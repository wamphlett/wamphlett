import { GalleryImages, Content } from './types';

import Albania2023 from './entries/2023albania';
import LakeComo2018 from './entries/2018lakecomo';
import Turkey2016 from './entries/2016turkey';
import Tokyo2016 from './entries/2016tokyo';
import MountFuji2016 from './entries/2016mountfuji';
import FushimiInari2023 from './entries/2023fushimiInari';

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

type State = {
  entries: Albums;
};

const state: State = {
  entries: {},
};

export function register(url: string, data: AlbumData, more?: AlbumData[]) {
  data.moreLinks = more ? more.map(album => album.url) : [];
  state.entries[url] = data;
}

export function getAlbum(url: string): AlbumData {
  return state.entries[url];
}

export function getAll(): Albums {
  return state.entries;
}

type buildAlbumProps = {
  year: number;
  month: number;
  title: string;
  description: string;
  headerImageUrl: string;
  tileImageUrl?: string;
  grids: Content[];
  moreLinks?: string[];
};

export function buildAlbum({
  year,
  month,
  title,
  description,
  headerImageUrl,
  tileImageUrl,
  grids,
  moreLinks,
}: buildAlbumProps): AlbumData {
  if (!tileImageUrl) {
    tileImageUrl = headerImageUrl;
  }
  return {
    year: year,
    month: month,
    title: title,
    description: description,
    url: `/${year}/${title.trim().replace(/\s+/g, '').toLowerCase()}`,
    headerImageUrl: headerImageUrl,
    tileImageUrl: tileImageUrl,
    grids: grids,
    moreLinks: moreLinks || [],
  };
}

export function buildImages(
  root: string,
  images: GalleryImages,
): GalleryImages {
  return Object.entries(images).reduce<GalleryImages>((acc, [key, value]) => {
    acc[key] = {
      ...value,
      url: `${root}/${value.url}`,
    };
    return acc;
  }, {} as GalleryImages);
}

// register the routes
register(Albania2023.url, Albania2023, [Turkey2016, LakeComo2018, Tokyo2016]);
register(Turkey2016.url, Turkey2016, [Albania2023, LakeComo2018, Tokyo2016]);
register(LakeComo2018.url, LakeComo2018, [Albania2023, Turkey2016, Tokyo2016]);
register(Tokyo2016.url, Tokyo2016, [
  MountFuji2016,
  Albania2023,
  FushimiInari2023,
]);
register(MountFuji2016.url, MountFuji2016, [
  Tokyo2016,
  Albania2023,
  FushimiInari2023,
]);
register(FushimiInari2023.url, FushimiInari2023, [
  Tokyo2016,
  MountFuji2016,
  LakeComo2018,
]);
// register(Italy2022.url, Italy2022);
