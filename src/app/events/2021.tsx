import { buildEvent } from '../data';
import { EventType } from '../types';

export const Chisinau21 = buildEvent({
  type: EventType.Travel,
  year: 2021,
  month: 11,
  intro: 'Moldova',
  title: 'Chisinau',
  // tagline: "travelled from Rome, through Naples, to Catania and Palermo",
});
