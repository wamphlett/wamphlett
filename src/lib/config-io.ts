import fs from 'fs/promises';
import path from 'path';
import type { Config, ConfigEvent, ImageGridRow, ConfigImage } from './config-types';
import { GRID_TYPES, EVENT_TYPES } from './config-types';

const CONFIG_PATH = process.env.CONFIG_PATH
  ? path.resolve(process.env.CONFIG_PATH)
  : path.resolve(process.cwd(), 'events.config.json');

const EMPTY_CONFIG: Config = { updated_ts: 0, events: [] };

export async function readConfig(): Promise<Config> {
  try {
    const content = await fs.readFile(CONFIG_PATH, 'utf-8');
    return JSON.parse(content) as Config;
  } catch (e: unknown) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
      await fs.writeFile(CONFIG_PATH, JSON.stringify(EMPTY_CONFIG, null, 4), 'utf-8');
      return { ...EMPTY_CONFIG };
    }
    throw e;
  }
}

export async function writeConfig(incoming: Config): Promise<Config> {
  let currentTs = 0;
  try {
    const current = await readConfig();
    currentTs = current.updated_ts ?? 0;
  } catch {
    // File doesn't exist yet — allow first write
  }

  if (incoming.updated_ts < currentTs) {
    throw new ConflictError(
      `Config was updated more recently (stored: ${currentTs}, incoming: ${incoming.updated_ts})`
    );
  }

  const toWrite: Config = {
    ...incoming,
    updated_ts: Math.floor(Date.now() / 1000),
  };

  await fs.writeFile(CONFIG_PATH, JSON.stringify(toWrite, null, 4), 'utf-8');
  return toWrite;
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

export function validateConfig(body: unknown): body is Config {
  if (typeof body !== 'object' || body === null) return false;
  const c = body as Record<string, unknown>;

  if (typeof c.updated_ts !== 'number') return false;
  if (!Array.isArray(c.events)) return false;

  for (const event of c.events) {
    if (!validateEvent(event)) return false;
  }
  return true;
}

function validateEvent(e: unknown): e is ConfigEvent {
  if (typeof e !== 'object' || e === null) return false;
  const ev = e as Record<string, unknown>;
  if (typeof ev.date_ts !== 'number') return false;
  if (!EVENT_TYPES.includes(ev.type as never)) return false;
  if (typeof ev.title !== 'string' || ev.title.trim() === '') return false;
  if (ev.sub_title !== undefined && typeof ev.sub_title !== 'string') return false;
  if (ev.tagline !== undefined && typeof ev.tagline !== 'string') return false;
  if (ev.icon !== undefined && typeof ev.icon !== 'string') return false;
  if (ev.small !== undefined && typeof ev.small !== 'boolean') return false;
  if (ev.image_grid !== undefined) {
    if (!Array.isArray(ev.image_grid)) return false;
    for (const row of ev.image_grid) {
      if (!validateGridRow(row)) return false;
    }
  }
  return true;
}

function validateGridRow(r: unknown): r is ImageGridRow {
  if (typeof r !== 'object' || r === null) return false;
  const row = r as Record<string, unknown>;
  if (!GRID_TYPES.includes(row.grid_type as never)) return false;
  if (
    !Array.isArray(row.ratio) ||
    row.ratio.length !== 2 ||
    !Number.isInteger(row.ratio[0]) ||
    !Number.isInteger(row.ratio[1]) ||
    (row.ratio[1] as number) === 0
  ) return false;
  if (!Array.isArray(row.images) || row.images.length < 1) return false;
  for (const img of row.images) {
    if (!validateImage(img)) return false;
  }
  return true;
}

function validateImage(i: unknown): i is ConfigImage {
  if (typeof i !== 'object' || i === null) return false;
  const img = i as Record<string, unknown>;
  if (typeof img.url !== 'string' || img.url.trim() === '') return false;
  if (img.title !== undefined && typeof img.title !== 'string') return false;
  if (img.tagline !== undefined && typeof img.tagline !== 'string') return false;
  return true;
}
