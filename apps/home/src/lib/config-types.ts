export const GRID_TYPES = [
  'row',
  'double',
  'doubleInverted',
  'offset',
  'offsetInverted',
  'triWide',
  'triWideInverted',
  'triSquare',
  'triSquareInverted',
] as const;

export const EVENT_TYPES = ['travel', 'work', 'misc'] as const;

export type GridType = (typeof GRID_TYPES)[number];
export type EventType = (typeof EVENT_TYPES)[number];

export interface ConfigImage {
  url: string;
  title?: string;
  tagline?: string;
}

export interface ImageGridRow {
  grid_type: GridType;
  ratio: [number, number];
  images: ConfigImage[];
}

export interface ConfigEvent {
  date_ts: number;
  type: EventType;
  title: string;
  sub_title?: string;
  tagline?: string;
  icon?: string;
  image_grid?: ImageGridRow[];
}

export interface Config {
  updated_ts: number;
  events: ConfigEvent[];
}
