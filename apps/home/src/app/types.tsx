export type Image = {
  url: string;
  title?: string;
  tag?: string;
};

export enum Grids {
  Row = 'row',
  Double = 'double',
  DoubleInverted = 'doubleInverted',
  Offset = 'offset',
  OffsetInverted = 'offsetInverted',
  TriWide = 'triWide',
  TriWideInverted = 'triWideInverted',
  TriSquare = 'triSquare',
  TriSquareInverted = 'triSquareInverted',
}

export enum EventType {
  Travel = 'travel',
}

export type GalleryImages = {
  [url: string]: GalleryImage;
};

export type GalleryImage = {
  url: string;
  title?: string;
  description?: string;
};

export type Album = {
  title: string;
  year: number;
  url: string;
  tileImageUrl: string;
};
