import { images } from '../types';
import { buildEvent } from '../data';
import { EventType, Grids } from '../types';

import albaniaImages from '../images/2023albania';
import fushimi23Images from '../images/2023fushimiInari';

export const Japan = buildEvent({
  type: EventType.Travel,
  year: 2023,
  month: 9,
  intro: 'Japan',
  title: 'Tokyo, Osaka & Kyoto',
  tagline: 'back again at last',
  images: [
    images({
      grid: Grids.Row,
      aspectRatio: 16 / 9,
      images: [fushimi23Images.walkingAncientPaths],
    }),
  ],
});

export const Albania = buildEvent({
  type: EventType.Travel,
  year: 2023,
  month: 7,
  intro: 'Albania',
  title: 'Sarande',
  tagline:
    'a long weekend in Albania, rented a car and drove south to stay in Sarande',
  images: [
    images({
      grid: Grids.Row,
      aspectRatio: 16 / 9,
      images: [albaniaImages.lifesBetterByTheSea],
    }),
    images({
      grid: Grids.Row,
      aspectRatio: 16 / 10,
      images: [
        albaniaImages.whyTravelByRoadWhenYouCanGoBySea,
        albaniaImages.watchingTheSunDisapear,
      ],
    }),
    images({
      grid: Grids.TriSquareInverted,
      images: [
        albaniaImages.paradise,
        albaniaImages.letsFly,
        albaniaImages.priorities,
      ],
    }),
    images({
      grid: Grids.Row,
      aspectRatio: 4 / 5,
      images: [
        albaniaImages.sarande,
        albaniaImages.notACareInTheWorld,
        albaniaImages.aCrystalSea,
      ],
    }),
    images({
      grid: Grids.Row,
      aspectRatio: 21 / 9,
      images: [albaniaImages.justMeAndTheSea],
    }),
  ],
});
