'use client';

import { FormEvent, useEffect, useState } from 'react';
import TagInput from './TagInput';
import { Photo } from './types';

interface PhotoModalProps {
  photo?: Photo;
  onClose: () => void;
  onSave: (photo: Photo) => void;
}

const toDateValue = (iso: string) => iso.split('T')[0];
const toISO = (date: string) => new Date(date + 'T12:00:00Z').toISOString();
const todayValue = () => new Date().toISOString().split('T')[0];

export default function PhotoModal({
  photo,
  onClose,
  onSave,
}: PhotoModalProps) {
  const isNew = !photo;
  const [url, setUrl] = useState(photo?.url ?? '');
  const [previewUrl, setPreviewUrl] = useState(photo?.url ?? '');
  const [alt, setAlt] = useState(photo?.alt ?? '');
  const [captureDate, setCaptureDate] = useState(
    photo ? toDateValue(photo.captureTime) : todayValue(),
  );
  const [tags, setTags] = useState<string[]>(photo?.tags ?? []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imgError, setImgError] = useState(false);
  const [previewLoaded, setPreviewLoaded] = useState(!!photo?.url);

  // Debounce the preview URL so it only updates 400ms after the user stops typing
  useEffect(() => {
    const resetPreview = () => {
      setImgError(false);
      setPreviewLoaded(false);
    };

    resetPreview();
    const t = setTimeout(() => setPreviewUrl(url), 400);
    return () => clearTimeout(t);
  }, [url]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      let res: Response;
      if (isNew) {
        res = await fetch('/api/manage/photos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url,
            alt,
            captureTime: toISO(captureDate),
            tags,
          }),
        });
      } else {
        res = await fetch(`/api/manage/photos/${photo.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ alt, captureTime: toISO(captureDate), tags }),
        });
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Save failed');
      }

      onSave(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <h2 className="text-lg font-semibold text-gray-800">
            {isNew ? 'Add Photo' : 'Edit Photo'}
          </h2>
          <button
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none w-8 h-8 flex items-center justify-center"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col md:flex-row flex-1 min-h-0">
          {/* Preview */}
          <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center p-6 min-h-[200px] md:min-h-0 relative">
            {previewUrl && !imgError ? (
              <>
                {!previewLoaded && (
                  <div className="absolute inset-6 rounded bg-gray-200 animate-pulse" />
                )}
                <img
                  alt="Preview"
                  className={`max-w-full max-h-[55vh] object-contain rounded shadow transition-opacity duration-300 ${previewLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onError={() => {
                    setImgError(true);
                    setPreviewLoaded(false);
                  }}
                  onLoad={() => setPreviewLoaded(true)}
                  src={previewUrl}
                />
              </>
            ) : (
              <div className="text-gray-400 text-sm text-center select-none">
                <div className="text-5xl mb-3 opacity-30">[ ]</div>
                {imgError ? 'Could not load image' : 'Paste a URL to preview'}
              </div>
            )}
          </div>

          {/* Form */}
          <div className="w-full md:w-1/2 overflow-y-auto">
            <form className="p-6 space-y-4" onSubmit={handleSubmit}>
              {isNew ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    autoFocus
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://..."
                    required
                    type="url"
                    value={url}
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL
                  </label>
                  <p className="text-xs text-gray-500 break-all bg-gray-50 rounded px-3 py-2 border border-gray-200">
                    {photo.url}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alt Text
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
                  onChange={e => setAlt(e.target.value)}
                  placeholder="Describe the image..."
                  rows={2}
                  value={alt}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capture Date
                </label>
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  onChange={e => setCaptureDate(e.target.value)}
                  required
                  type="date"
                  value={captureDate}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <TagInput onChange={setTags} tags={tags} />
                <p className="text-xs text-gray-400 mt-1">
                  Press Tab or Enter to add a tag
                </p>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  className="flex-1 border border-gray-300 text-gray-700 rounded px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                  onClick={onClose}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="flex-1 bg-gray-800 text-white rounded px-4 py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
                  disabled={saving}
                  type="submit"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
