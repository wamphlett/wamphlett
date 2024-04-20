import { images } from '../types';
import { buildEvent } from '../data';
import { EventType, Grids } from '../types';

import japan24Images from '../images/2024japan';

export const Japan24 = buildEvent({
  type: EventType.Travel,
  year: 2024,
  month: 4,
  intro: 'Japan',
  title: 'Tokyo & Osaka',
  tagline: '5 weeks working abroad',
  images: [
    images({
      grid: Grids.Row,
      aspectRatio: 21 / 9,
      images: [japan24Images.castleWork],
    }),
  ],
});
