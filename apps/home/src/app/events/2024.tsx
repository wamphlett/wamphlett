import { images } from '../types';
import { buildEvent } from '../data';
import { EventType, Grids } from '../types';

import japan24Images from '../images/2024japan';
import japansummer24Images from '../images/2024japansummer';
import maltaImages from '../images/2024malta';

export const Japan24 = buildEvent({
  type: EventType.Travel,
  year: 2024,
  month: 4,
  intro: 'Japan',
  title: 'Tokyo & Osaka',
  tagline: '5 weeks working abroad',
  images: [
    images({
      grid: Grids.OffsetInverted,
      aspectRatio: 21 / 9,
      images: [japan24Images.sakura, japan24Images.castleWork],
    }),
    images({
      grid: Grids.TriSquareInverted,
      images: [
        japan24Images.teamlabs,
        japan24Images.udon,
        japan24Images.newFriends,
      ],
    }),
  ],
});

export const Japan24Summer = buildEvent({
  type: EventType.Travel,
  year: 2024,
  month: 8,
  intro: 'Japan',
  title: 'Tokyo, Osaka & Hokkaido',
  tagline: '6 weeks working abroad again',
  images: [
    images({
      grid: Grids.Row,
      aspectRatio: 21 / 10,
      images: [japansummer24Images.near_perfect],
    }),
  ],
});

export const Malta24 = buildEvent({
  type: EventType.Travel,
  year: 2024,
  month: 10,
  intro: 'Malta',
  title: 'Valletta',
  tagline: 'Weekend visiting a friend',
  images: [
    images({
      grid: Grids.Row,
      aspectRatio: 3/4,
      images: [maltaImages.cliffs, maltaImages.boat, maltaImages.church],
    }),
  ],
});
