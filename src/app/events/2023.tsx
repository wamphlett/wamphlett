import { buildEvent } from '../data';
import { EventType, Grids } from '../types';
import albaniaImages from '../images/2023albania';

export const Japan = buildEvent({
  type: EventType.Travel,
  year: 2023,
  month: 9,
  intro: 'Japan',
  title: 'Tokyo, Osaka & Kyoto',
  tagline: 'coming up later this year... finally!',
  small: true,
  images: [
    // {
    //   grid: Grids.Row,
    //   aspectRatio: 1,
    //   images: [
    //     {
    //       url: 'https://library.wamphlett.net/photos/website/2023/albania/lifes-better-by-the-sea.jpg',
    //       title: 'Lifes better by the sea',
    //       description: 'A day on Ksamil Beach',
    //     },
    //   ],
    // },
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
    {
      grid: Grids.Row,
      aspectRatio: 16 / 9,
      images: [albaniaImages.lifesBetterByTheSea],
    },
    {
      grid: Grids.Row,
      aspectRatio: 16 / 10,
      images: [
        albaniaImages.whyTravelByRoadWhenYouCanGoBySea,
        albaniaImages.watchingTheSunDisapear,
      ],
    },
    {
      grid: Grids.TriSquareInverted,
      images: [
        albaniaImages.paradise,
        albaniaImages.letsFly,
        albaniaImages.priorities,
      ],
    },
    {
      grid: Grids.Row,
      aspectRatio: 4 / 5,
      images: [
        albaniaImages.sarande,
        albaniaImages.notACareInTheWorld,
        albaniaImages.aCrystalSea,
      ],
    },
    {
      grid: Grids.Row,
      aspectRatio: 21 / 9,
      images: [albaniaImages.justMeAndTheSea],
    },
  ],
});
