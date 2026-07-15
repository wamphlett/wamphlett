'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type {
  Config,
  ConfigEvent,
  ConfigImage,
  EventType,
  GridType,
  ImageGridRow,
} from '@/lib/config-types';
import { EVENT_TYPES, GRID_TYPES } from '@/lib/config-types';

// ─── Internal types with stable IDs for DnD ─────────────────────────────────

interface UIImage extends ConfigImage {
  _id: string;
}

interface UIGridRow extends Omit<ImageGridRow, 'images' | 'ratio'> {
  _id: string;
  ratio: [number, number];
  images: UIImage[];
}

interface UIEvent extends Omit<ConfigEvent, 'image_grid'> {
  _id: string;
  image_grid: UIGridRow[];
}

interface UIConfig {
  updated_ts: number;
  events: UIEvent[];
}

// ─── ID helpers ──────────────────────────────────────────────────────────────

let _idCounter = 0;
function nextId() {
  return `_${++_idCounter}`;
}

function toUI(config: Config): UIConfig {
  return {
    updated_ts: config.updated_ts,
    events: config.events.map(e => ({
      ...e,
      _id: nextId(),
      image_grid: (e.image_grid ?? []).map(row => ({
        ...row,
        _id: nextId(),
        ratio: (row.ratio ?? [4, 3]) as [number, number],
        images: row.images.map(img => ({ ...img, _id: nextId() })),
      })),
    })),
  };
}

function fromUI(ui: UIConfig): Config {
  return {
    updated_ts: ui.updated_ts,
    events: ui.events.map(({ _id: _eid, image_grid, ...rest }) => ({
      ...rest,
      image_grid:
        image_grid.length > 0
          ? image_grid.map(({ _id: _rid, images, ...rowRest }) => ({
              ...rowRest,
              images: images.map(({ _id: _iid, ...imgRest }) => imgRest),
            }))
          : undefined,
    })),
  };
}

function newEvent(): UIEvent {
  return {
    _id: nextId(),
    date_ts: 0,
    type: 'travel',
    title: '',
    sub_title: '',
    tagline: '',
    icon: '',
    small: false,
    image_grid: [],
  };
}

function newGridRow(): UIGridRow {
  return {
    _id: nextId(),
    grid_type: 'row',
    ratio: [4, 3],
    images: [newImage()],
  };
}

function newImage(): UIImage {
  return { _id: nextId(), url: '', title: '', tagline: '' };
}

// ─── Validation ──────────────────────────────────────────────────────────────

type ValidationErrors = Record<string, string>;

function validate(config: UIConfig): ValidationErrors {
  const errs: ValidationErrors = {};
  config.events.forEach((ev, ei) => {
    if (!ev.date_ts) {
      errs[`e${ei}.date_ts`] = 'Date is required';
    }
    if (!ev.title.trim()) {
      errs[`e${ei}.title`] = 'Title is required';
    }
    ev.image_grid.forEach((row, ri) => {
      if (!row.ratio[0] || !row.ratio[1]) {
        errs[`e${ei}.r${ri}.ratio`] = 'Ratio required';
      }
      row.images.forEach((img, ii) => {
        if (!img.url.trim()) {
          errs[`e${ei}.r${ri}.i${ii}.url`] = 'URL is required';
        }
      });
    });
  });
  return errs;
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

function tsToDateInput(ts: number): string {
  if (!ts) {
    return '';
  }
  return new Date(ts * 1000).toISOString().split('T')[0];
}

function dateInputToTs(s: string): number {
  if (!s) {
    return 0;
  }
  return Math.floor(new Date(s + 'T00:00:00Z').getTime() / 1000);
}

// ─── Reusable primitives ─────────────────────────────────────────────────────

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function Input({
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <input
      className={`w-full px-2.5 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent ${
        error ? 'border-red-400 bg-red-50' : 'border-gray-300'
      }`}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      type={type}
      value={value}
    />
  );
}

function Select<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: readonly T[];
}) {
  return (
    <select
      className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
      onChange={e => onChange(e.target.value as T)}
      value={value}
    >
      {options.map(o => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function DragHandle({
  listeners,
  attributes,
}: {
  listeners?: object;
  attributes?: object;
}) {
  return (
    <button
      type="button"
      {...listeners}
      {...attributes}
      aria-label="Drag to reorder"
      className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 px-1 py-0.5 rounded touch-none"
    >
      <svg fill="currentColor" height="16" viewBox="0 0 16 16" width="16">
        <circle cx="5" cy="4" r="1.5" />
        <circle cx="11" cy="4" r="1.5" />
        <circle cx="5" cy="8" r="1.5" />
        <circle cx="11" cy="8" r="1.5" />
        <circle cx="5" cy="12" r="1.5" />
        <circle cx="11" cy="12" r="1.5" />
      </svg>
    </button>
  );
}

// ─── Image row (sortable) ─────────────────────────────────────────────────────

function SortableImageRow({
  img,
  onChange,
  onRemove,
  canRemove,
  errPrefix,
  errors,
}: {
  img: UIImage;
  onChange: (patch: Partial<UIImage>) => void;
  onRemove: () => void;
  canRemove: boolean;
  errPrefix: string;
  errors: ValidationErrors;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: img._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div className="flex items-start gap-1" ref={setNodeRef} style={style}>
      <div className="pt-5">
        <DragHandle attributes={attributes} listeners={listeners} />
      </div>
      <div className="flex-1 grid grid-cols-3 gap-2 items-start">
        <Field error={errors[`${errPrefix}.url`]} label="URL *">
          <Input
            error={!!errors[`${errPrefix}.url`]}
            onChange={v => onChange({ url: v })}
            placeholder="https://…"
            value={img.url}
          />
        </Field>
        <Field label="Title">
          <Input
            onChange={v => onChange({ title: v })}
            value={img.title ?? ''}
          />
        </Field>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Field label="Tagline">
              <Input
                onChange={v => onChange({ tagline: v })}
                value={img.tagline ?? ''}
              />
            </Field>
          </div>
          {canRemove && (
            <button
              className="mb-0.5 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              onClick={onRemove}
              title="Remove image"
              type="button"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Grid row card (sortable) ────────────────────────────────────────────────

function SortableGridRow({
  row,
  onChange,
  onRemove,
  errPrefix,
  errors,
}: {
  row: UIGridRow;
  onChange: (patch: Partial<UIGridRow>) => void;
  onRemove: () => void;
  errPrefix: string;
  errors: ValidationErrors;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: row._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const imageSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleImageDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) {
      return;
    }
    const ids = row.images.map(img => img._id);
    const oldIdx = ids.indexOf(active.id as string);
    const newIdx = ids.indexOf(over.id as string);
    onChange({ images: arrayMove(row.images, oldIdx, newIdx) });
  }

  function patchImage(id: string, patch: Partial<UIImage>) {
    onChange({
      images: row.images.map(img =>
        img._id === id ? { ...img, ...patch } : img,
      ),
    });
  }

  function removeImage(id: string) {
    onChange({ images: row.images.filter(img => img._id !== id) });
  }

  function addImage() {
    onChange({ images: [...row.images, newImage()] });
  }

  return (
    <div
      className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3"
      ref={setNodeRef}
      style={style}
    >
      <div className="flex items-center gap-2">
        <DragHandle attributes={attributes} listeners={listeners} />
        <div className="w-44">
          <Field label="Grid type">
            <Select<GridType>
              onChange={v => onChange({ grid_type: v })}
              options={GRID_TYPES}
              value={row.grid_type}
            />
          </Field>
        </div>
        <Field error={errors[`${errPrefix}.ratio`]} label="Ratio">
          <div className="flex items-center gap-1">
            <input
              className={`w-14 px-2 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 ${errors[`${errPrefix}.ratio`] ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              min={1}
              onChange={e =>
                onChange({
                  ratio: [
                    Math.max(1, parseInt(e.target.value) || 1),
                    row.ratio[1],
                  ],
                })
              }
              step={1}
              type="number"
              value={row.ratio[0]}
            />
            <span className="text-gray-400 text-sm">:</span>
            <input
              className={`w-14 px-2 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 ${errors[`${errPrefix}.ratio`] ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              min={1}
              onChange={e =>
                onChange({
                  ratio: [
                    row.ratio[0],
                    Math.max(1, parseInt(e.target.value) || 1),
                  ],
                })
              }
              step={1}
              type="number"
              value={row.ratio[1]}
            />
          </div>
        </Field>
        <button
          className="ml-auto text-xs text-red-500 hover:text-red-700 hover:underline"
          onClick={onRemove}
          type="button"
        >
          Remove row
        </button>
      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleImageDragEnd}
        sensors={imageSensors}
      >
        <SortableContext
          items={row.images.map(img => img._id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {row.images.map((img, ii) => (
              <SortableImageRow
                canRemove={row.images.length > 1}
                errors={errors}
                errPrefix={`${errPrefix}.i${ii}`}
                img={img}
                key={img._id}
                onChange={p => patchImage(img._id, p)}
                onRemove={() => removeImage(img._id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        className="text-xs text-gray-500 hover:text-gray-700 hover:underline"
        onClick={addImage}
        type="button"
      >
        + Add image
      </button>
    </div>
  );
}

// ─── Event card (sortable) ───────────────────────────────────────────────────

function SortableEventCard({
  event,
  index,
  onChange,
  onRemove,
  expanded,
  onToggle,
  errors,
}: {
  event: UIEvent;
  index: number;
  onChange: (patch: Partial<UIEvent>) => void;
  onRemove: () => void;
  expanded: boolean;
  onToggle: () => void;
  errors: ValidationErrors;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: event._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const errPrefix = `e${index}`;
  const hasErrors = Object.keys(errors).some(k => k.startsWith(errPrefix));

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleGridDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) {
      return;
    }
    const ids = event.image_grid.map(r => r._id);
    const oldIdx = ids.indexOf(active.id as string);
    const newIdx = ids.indexOf(over.id as string);
    onChange({ image_grid: arrayMove(event.image_grid, oldIdx, newIdx) });
  }

  function patchGrid(ri: number, patch: Partial<UIGridRow>) {
    const image_grid = event.image_grid.map((row, i) =>
      i === ri ? { ...row, ...patch } : row,
    );
    onChange({ image_grid });
  }

  function addGridRow() {
    onChange({ image_grid: [...event.image_grid, newGridRow()] });
  }

  function removeGridRow(ri: number) {
    onChange({ image_grid: event.image_grid.filter((_, i) => i !== ri) });
  }

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
      ref={setNodeRef}
      style={style}
    >
      {/* Header row */}
      <div
        className={`flex items-center gap-2 px-4 py-3 cursor-pointer select-none ${
          hasErrors ? 'bg-red-50' : 'hover:bg-gray-50'
        }`}
        onClick={onToggle}
      >
        <DragHandle attributes={attributes} listeners={listeners} />
        <span className="flex-1 text-sm font-medium truncate">
          {event.title || (
            <span className="text-gray-400 italic">Untitled event</span>
          )}
        </span>
        {event.date_ts > 0 && (
          <span className="text-xs text-gray-400 shrink-0">
            {new Date(event.date_ts * 1000).toLocaleDateString('en-GB', {
              year: 'numeric',
              month: 'short',
            })}
          </span>
        )}
        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 shrink-0">
          {event.type}
        </span>
        {hasErrors && <span className="text-xs text-red-500 shrink-0">⚠</span>}
        <span className="text-gray-400 text-xs shrink-0">
          {expanded ? '▲' : '▼'}
        </span>
      </div>

      {/* Body */}
      {expanded && (
        <div className="px-4 pb-4 pt-2 space-y-5 border-t border-gray-100">
          {/* Core fields */}
          <div className="grid grid-cols-2 gap-4">
            <Field error={errors[`${errPrefix}.date_ts`]} label="Date *">
              <Input
                error={!!errors[`${errPrefix}.date_ts`]}
                onChange={v => onChange({ date_ts: dateInputToTs(v) })}
                type="date"
                value={tsToDateInput(event.date_ts)}
              />
            </Field>
            <Field label="Type *">
              <Select<EventType>
                onChange={v => onChange({ type: v })}
                options={EVENT_TYPES}
                value={event.type}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field error={errors[`${errPrefix}.title`]} label="Title *">
              <Input
                error={!!errors[`${errPrefix}.title`]}
                onChange={v => onChange({ title: v })}
                placeholder="Event title"
                value={event.title}
              />
            </Field>
            <Field label="Sub-title">
              <Input
                onChange={v => onChange({ sub_title: v })}
                placeholder="Optional sub-title"
                value={event.sub_title ?? ''}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tagline">
              <Input
                onChange={v => onChange({ tagline: v })}
                placeholder="Optional tagline"
                value={event.tagline ?? ''}
              />
            </Field>
            <Field label="Icon">
              <Input
                onChange={v => onChange({ icon: v })}
                placeholder="Optional icon string"
                value={event.icon ?? ''}
              />
            </Field>
            <div className="flex items-center gap-2 pt-5">
              <input
                checked={event.small ?? false}
                className="w-4 h-4 rounded border-gray-300 accent-gray-900"
                id={`small-${event._id}`}
                onChange={e => onChange({ small: e.target.checked })}
                type="checkbox"
              />
              <label
                className="text-xs font-medium text-gray-600 select-none cursor-pointer"
                htmlFor={`small-${event._id}`}
              >
                Small layout
              </label>
            </div>
          </div>

          {/* Image grid */}
          <div>
            <p className="text-xs font-medium text-gray-600 mb-2">Image grid</p>
            {event.image_grid.length > 0 ? (
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleGridDragEnd}
                sensors={sensors}
              >
                <SortableContext
                  items={event.image_grid.map(r => r._id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {event.image_grid.map((row, ri) => (
                      <SortableGridRow
                        errors={errors}
                        errPrefix={`${errPrefix}.r${ri}`}
                        key={row._id}
                        onChange={p => patchGrid(ri, p)}
                        onRemove={() => removeGridRow(ri)}
                        row={row}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <p className="text-xs text-gray-400 italic mb-2">No image rows</p>
            )}
            <button
              className="mt-2 text-xs text-gray-500 hover:text-gray-700 hover:underline"
              onClick={addGridRow}
              type="button"
            >
              + Add grid row
            </button>
          </div>

          {/* Delete */}
          <div className="pt-2 border-t border-gray-100 flex justify-end">
            <button
              className="text-xs text-red-500 hover:text-red-700 hover:underline"
              onClick={() => {
                if (confirm('Delete this event?')) {
                  onRemove();
                }
              }}
              type="button"
            >
              Delete event
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export default function ConfigPage() {
  const router = useRouter();
  const [config, setConfig] = useState<UIConfig | null>(null);
  const [loadError, setLoadError] = useState('');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveError, setSaveError] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const errors = config ? validate(config) : {};

  // ── Load ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/config')
      .then(async res => {
        if (res.status === 401) {
          router.push('/config/login');
          return;
        }
        if (!res.ok) {
          throw new Error('Failed to load config');
        }
        const data = await res.json();
        setConfig(toUI(data));
      })
      .catch(() => setLoadError('Failed to load config. Please refresh.'));
  }, [router]);

  // ── Patch helpers ──────────────────────────────────────────────────────────
  const patchEvent = useCallback((id: string, patch: Partial<UIEvent>) => {
    setConfig(c =>
      c
        ? {
            ...c,
            events: c.events.map(e => (e._id === id ? { ...e, ...patch } : e)),
          }
        : c,
    );
  }, []);

  const removeEvent = useCallback((id: string) => {
    setConfig(c =>
      c ? { ...c, events: c.events.filter(e => e._id !== id) } : c,
    );
  }, []);

  function addEvent() {
    const e = newEvent();
    setConfig(c => (c ? { ...c, events: [...c.events, e] } : c));
    setExpanded(s => new Set(s).add(e._id));
  }

  // ── Event drag-and-drop ────────────────────────────────────────────────────
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleEventDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!config || !over || active.id === over.id) {
      return;
    }
    const ids = config.events.map(ev => ev._id);
    const oldIdx = ids.indexOf(active.id as string);
    const newIdx = ids.indexOf(over.id as string);
    setConfig({ ...config, events: arrayMove(config.events, oldIdx, newIdx) });
  }

  // ── Save ────────────────────────────────────────────────────────────────────
  async function handleSave() {
    if (!config) {
      return;
    }
    if (Object.keys(errors).length > 0) {
      // Expand all events that have errors
      const errorIds = new Set(
        config.events
          .filter((_, i) =>
            Object.keys(errors).some(k => k.startsWith(`e${i}.`)),
          )
          .map(e => e._id),
      );
      setExpanded(s => {
        const next = new Set(Array.from(s));
        errorIds.forEach(id => next.add(id));
        return next;
      });
      return;
    }

    setSaveStatus('saving');
    setSaveError('');

    try {
      const res = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fromUI(config)),
      });

      if (res.status === 401) {
        router.push('/config/login');
        return;
      }

      if (res.status === 409) {
        setSaveStatus('error');
        setSaveError(
          'The config was updated elsewhere. Refresh to get the latest version before saving.',
        );
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Save failed');
      }

      const saved = await res.json();
      setConfig(toUI(saved));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      setSaveStatus('error');
      setSaveError(err instanceof Error ? err.message : 'Save failed');
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/config/login');
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  const hasValidationErrors = Object.keys(errors).length > 0;

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-sm">{loadError}</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading…</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-light tracking-wide">Events Config</h1>
          {config.updated_ts > 0 && (
            <p className="text-xs text-gray-400 mt-0.5">
              Last saved: {new Date(config.updated_ts * 1000).toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            className="text-xs text-gray-400 hover:text-gray-600 hover:underline"
            onClick={handleLogout}
            type="button"
          >
            Logout
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              saveStatus === 'saved'
                ? 'bg-green-600 text-white'
                : saveStatus === 'error'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-900 text-white hover:bg-gray-700'
            }`}
            disabled={saveStatus === 'saving'}
            onClick={handleSave}
            type="button"
          >
            {saveStatus === 'saving'
              ? 'Saving…'
              : saveStatus === 'saved'
                ? 'Saved ✓'
                : saveStatus === 'error'
                  ? 'Error'
                  : 'Save'}
          </button>
        </div>
      </div>

      {/* Save error */}
      {saveStatus === 'error' && saveError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {saveError}
        </div>
      )}

      {/* Validation summary */}
      {hasValidationErrors && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          There are validation errors. Fix them before saving.
        </div>
      )}

      {/* Events */}
      {config.events.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          No events yet. Add one below.
        </div>
      ) : (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleEventDragEnd}
          sensors={sensors}
        >
          <SortableContext
            items={config.events.map(e => e._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3 mb-4">
              {config.events.map((ev, i) => (
                <SortableEventCard
                  errors={errors}
                  event={ev}
                  expanded={expanded.has(ev._id)}
                  index={i}
                  key={ev._id}
                  onChange={p => patchEvent(ev._id, p)}
                  onRemove={() => removeEvent(ev._id)}
                  onToggle={() =>
                    setExpanded(s => {
                      const next = new Set(s);
                      next.has(ev._id) ? next.delete(ev._id) : next.add(ev._id);
                      return next;
                    })
                  }
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <button
        className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
        onClick={addEvent}
        type="button"
      >
        + Add event
      </button>
    </div>
  );
}
