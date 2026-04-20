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
  Work = 'work'
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

export enum ContentType {
  ImageGrid = 'imageGrid',
  YoutubeVideo = 'youtubeVideo',
}

export type ImageGrid = {
  kind: ContentType.ImageGrid;
  grid: Grids;
  aspectRatio?: number;
  images: GalleryImage[];
};

export type YoutubeVideo = {
  kind: ContentType.YoutubeVideo;
  aspectRatio?: number;
  link: string;
};

export const images = ({
  grid = Grids.Row,
  aspectRatio = 1,
  images,
}: {
  grid: Grids;
  aspectRatio?: number;
  images: GalleryImage[];
}): ImageGrid => ({
  kind: ContentType.ImageGrid,
  grid,
  aspectRatio,
  images: images,
});

export const youtubeVideo = ({ link }: { link: string }): YoutubeVideo => ({
  kind: ContentType.YoutubeVideo,
  link,
});
