import { buildEvent } from '../data';
import { EventType } from '../types';

export const Austin17 = buildEvent({
  type: EventType.Travel,
  year: 2017,
  month: 7,
  intro: 'USA',
  title: 'Austin',
  // tagline: "back for a second time, this time with the rest of the family",
});

export const NewYork17 = buildEvent({
  type: EventType.Travel,
  year: 2017,
  month: 6,
  intro: 'USA',
  title: 'New York',
  tagline: 'my sons first trip to the US',
});
