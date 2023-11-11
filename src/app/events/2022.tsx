import { buildEvent } from '../data';
import { EventType } from '../types';

export const Italy22 = buildEvent({
  type: EventType.Travel,
  year: 2022,
  month: 4,
  intro: 'Italy',
  title: 'Rome to Sicily',
  tagline: 'travelled from Rome, through Naples, to Catania and Palermo',
});
