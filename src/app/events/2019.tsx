import { buildEvent } from '../data';
import { EventType } from '../types';

export const LakeComo19 = buildEvent({
  type: EventType.Travel,
  year: 2019,
  month: 6,
  intro: 'Italy',
  title: 'Lake Como',
  tagline: 'back for a second time, this time with the rest of the family',
});
