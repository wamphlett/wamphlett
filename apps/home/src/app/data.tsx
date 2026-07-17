import { EventType, ImageGrid, YoutubeVideo } from './types';

export type Content = ImageGrid | YoutubeVideo;

export type ConfigEventData = {
  kind: 'config';
  year: number;
  month: number;
  type: EventType;
  title: string;
  tagline?: string;
  intro?: string;
  icon?: string;
  small?: boolean;
  images: Content[];
};

export type BlogPostEventData = {
  kind: 'blogPost';
  year: number;
  month: number;
  title: string;
  description: string;
  image: string;
  url: string;
};

export type EventData = ConfigEventData | BlogPostEventData;

export type Events = EventData[];
