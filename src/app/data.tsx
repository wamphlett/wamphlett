import { Japan, Albania } from './events/2023';
import { Italy22 } from './events/2022';
import { Chisinau21 } from './events/2021';
import { LakeComo19 } from './events/2019';
import { LakeComo18, Warsaw18 } from './events/2018';
import { Austin17, NewYork17 } from './events/2017';
import { Tokyo16, Antalya16, Xabia16 } from './events/2016';

import { EventType, Grids, GalleryImages } from './types';

export type GalleryImage = {
  url: string;
  title?: string;
  description?: string;
};

export type GridData = {
  grid: Grids;
  aspectRatio?: number;
  skinny: boolean;
  images: GalleryImage[];
};

export type ImageGrid = {
  grid: Grids;
  aspectRatio?: number;
  images: GalleryImage[];
};

export type AlbumData = {
  year: number;
  month: number;
  title: string;
  description: string;
  url: string;
  headerImageUrl: string;
  tileImageUrl: string;
  grids: GridData[];
  moreLinks: [string, string, string];
};

export type Albums = {
  [url: string]: AlbumData;
};

export type EventData = {
  year: number;
  month: number;
  type: EventType;
  title: string;
  tagline?: string;
  intro?: string;
  small?: boolean;
  images: ImageGrid[];
};

export type Events = EventData[];

type State = {
  entries: Albums;
  events: Events;
};

const state: State = {
  entries: {},
  events: [],
};

export function registerRoutes(url: string, data: AlbumData) {
  state.entries[url] = data;
}

export function register(data: EventData) {
  state.events.push(data);
}

export function getAlbum(url: string): AlbumData {
  return state.entries[url];
}

export function getAll(): Albums {
  return state.entries;
}

export function getEvents(): Events {
  return state.events;
}

export function getOrderedEvents(): Events {
  const events = getEvents();

  // Sort the events based on the year and then by month, most recent first
  events.sort((a, b) => {
    if (a.year !== b.year) {
      return b.year - a.year; // Descending order based on year
    }
    return b.month - a.month; // If the years are the same, then sort by month
  });

  return events;
}

export function getOrderedEventsGroupedByYear(): Map<number, Events> {
  const events = getOrderedEvents();

  // Group events by year
  const groupedEvents = new Map<number, Events>();
  events.forEach(event => {
    if (!groupedEvents.has(event.year)) {
      groupedEvents.set(event.year, []);
    }
    groupedEvents.get(event.year)!.push(event);
  });

  return groupedEvents;
}

type buildAlbumProps = {
  year: number;
  month: number;
  title: string;
  description: string;
  headerImageUrl: string;
  tileImageUrl?: string;
  grids: GridData[];
  moreLinks: [string, string, string];
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
    moreLinks: moreLinks,
  };
}

type buildEventsProps = {
  year: number;
  month: number;
  type: EventType;
  title: string;
  tagline?: string;
  intro?: string;
  small?: boolean;
  images?: ImageGrid[];
};

export function buildEvent({
  year,
  month,
  type,
  title,
  tagline,
  small,
  images,
  intro,
}: buildEventsProps): EventData {
  let imageGrids: ImageGrid[] = [];
  if (images) {
    imageGrids = images;
  }
  return {
    year: year,
    month: month,
    type: type,
    title: title,
    tagline: tagline,
    intro: intro,
    small: small,
    images: imageGrids,
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

export function libraryUrl(path: string) {
  return `https://library.wamphlett.net/photos/website/${path}`;
}

register(Japan);
register(Albania);
register(Italy22);
register(Chisinau21);
register(LakeComo19);
register(LakeComo18);
register(Warsaw18);
register(Austin17);
register(NewYork17);
register(Tokyo16);
register(Antalya16);
register(Xabia16);
