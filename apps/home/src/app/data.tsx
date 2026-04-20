
import {
  EventType,
  ImageGrid,
  YoutubeVideo,
} from './types';

export type Content = ImageGrid | YoutubeVideo;

export type EventData = {
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

export type Events = EventData[];