import { buildEvent } from '../data';
import { EventType } from '../types';
import comoImages from '../images/2018lakeComo';
import { Grids } from '../types';

export const Warsaw18 = buildEvent({
  type: EventType.Travel,
  year: 2018,
  month: 8,
  intro: 'Poland',
  title: 'Warsaw',
});

export const LakeComo18 = buildEvent({
  type: EventType.Travel,
  year: 2018,
  month: 5,
  intro: 'Italy',
  title: 'Lake Como',
  tagline:
    'one of my favourite places in the world, I will live there for a summer one day',
  images: [
    {
      grid: Grids.Row,
      aspectRatio: 16 / 10,
      images: [comoImages.howCanAnywhereLookThisGood],
    },
    {
      grid: Grids.Row,
      aspectRatio: 1.5 / 1,
      images: [
        comoImages.theMorningView,
        comoImages.holidayIsThirstyWork,
        comoImages.aChurchOnTheWater,
        comoImages.cheeese,
      ],
    },
  ],
});
