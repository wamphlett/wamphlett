export type AlbumData = {
  year: number;
  month: number;
  title: string;
  description: string;
  url: string;
  headerImageUrl: string;
  tileImageUrl: string;
  grids: Content[];
  moreLinks: string[];
};

export type Albums = {
  [url: string]: AlbumData;
};

export enum Grids {
  Row = 'row',
  Double = 'double',
  DoubleInverted = 'doubleInverted',
  Offset = 'offset',
  OffsetInverted = 'offsetInverted',
  OffsetTall = 'offsetTall',
  OffsetTallInverted = 'offsetTallInverted',
  TriWide = 'triWide',
  TriWideInverted = 'triWideInverted',
  TriSquare = 'triSquare',
  TriSquareInverted = 'triSquareInverted',
}

export enum ContentType {
  ImageGrid = 'imageGrid',
  YoutubeVideo = 'youtubeVideo',
}

export type Content = GridData | YoutubeVideo;

export type GalleryImages = {
  [url: string]: GalleryImage;
};

export type GalleryImage = {
  url: string;
  title?: string;
  description?: string;
};

export type GridData = {
  kind: ContentType.ImageGrid;
  grid: Grids;
  aspectRatio?: number;
  images: GalleryImage[];
};

export type YoutubeVideo = {
  kind: ContentType.YoutubeVideo;
  link: string;
};

export type MoreData = {
  title: string;
  year: string;
  link: string;
  imageUrl: string;
};

type MoreTiles = MoreData[];

export type PageData = {
  title: string;
  year: string;
  description: string;
  headerImageUrl: string;
  grids: GridData[];
  more: MoreTiles;
};

export const images = ({
  grid = Grids.Row,
  aspectRatio = 1,
  images,
}: {
  grid: Grids;
  aspectRatio?: number;
  images: GalleryImage[];
}): GridData => ({
  kind: ContentType.ImageGrid,
  grid,
  aspectRatio,
  images: images,
});

export const youtube = ({ link }: { link: string }): YoutubeVideo => ({
  kind: ContentType.YoutubeVideo,
  link,
});
