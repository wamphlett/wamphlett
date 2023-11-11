import { buildEvent } from '../data';
import { EventType, Grids } from '../types';
import fujiImages from '../images/2016mountFuji';
import tokyoImages from '../images/2016tokyo';
import turkeyImages from '../images/2016turkey';

export const Tokyo16 = buildEvent({
  type: EventType.Travel,
  year: 2016,
  month: 8,
  intro: 'Japan',
  title: 'Tokyo',
  tagline: 'life-long dream to visit Japan, finally came true',
  images: [
    {
      grid: Grids.Row,
      aspectRatio: 16 / 9,
      images: [fujiImages.theBestAndHardestThingIveEverDone],
    },
    {
      grid: Grids.TriSquareInverted,
      images: [
        tokyoImages.allTheSake,
        tokyoImages.aNerdsHeaven,
        fujiImages.theWayDownIsDefinitelyEasier,
      ],
    },
    {
      grid: Grids.Row,
      aspectRatio: 1.3 / 1,
      images: [
        tokyoImages.settlingIn,
        tokyoImages.gotToCatchThemAll,
        tokyoImages.newFriends,
        tokyoImages.sumidaFireworks,
      ],
    },
  ],
});

export const Antalya16 = buildEvent({
  type: EventType.Travel,
  year: 2016,
  month: 7,
  intro: 'Turkey',
  title: 'Antalya',
  tagline: 'family holiday to an all-inclusive resort in Turkey',
  images: [
    {
      grid: Grids.Row,
      aspectRatio: 21 / 9,
      images: [turkeyImages.nearPerfection],
    },
    {
      grid: Grids.Offset,
      aspectRatio: 21 / 9,
      images: [turkeyImages.upUpAndAway, turkeyImages.theSeaBar],
    },
  ],
});

export const Xabia16 = buildEvent({
  type: EventType.Travel,
  year: 2016,
  month: 4,
  intro: 'Spain',
  title: 'Xabia',
  // tagline: "family holiday to an all-inclusive resort in Turkey",
});
