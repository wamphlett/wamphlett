import { buildAlbum } from '../data';
import { images } from '../types';
import { GridData, Grids } from '../types';

import turkeyImages from '../images/2016turkey';

const gridData: GridData[] = [
  images({
    grid: Grids.Row,
    aspectRatio: 16 / 9,
    images: [turkeyImages.itsQuiet],
  }),
  images({
    grid: Grids.OffsetInverted,
    images: [turkeyImages.outAtSea, turkeyImages.upUpAndAway],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 16 / 9,
    images: [turkeyImages.dontHaveToGoFarForADrink],
  }),
  images({
    grid: Grids.Offset,
    images: [turkeyImages.hiddenAmongstTheTrees, turkeyImages.relaxingGardens],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 21 / 9,
    images: [turkeyImages.nearPerfection],
  }),
  images({
    grid: Grids.OffsetInverted,
    images: [turkeyImages.serene, turkeyImages.theSeaBar],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 16 / 9,
    images: [turkeyImages.justCoolingOff],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 1,
    images: [turkeyImages.splash, turkeyImages.lookTheSea],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 16 / 9,
    images: [turkeyImages.nothingButRelxation],
  }),
  images({
    grid: Grids.Offset,
    images: [turkeyImages.uncleTime, turkeyImages.theNightBar],
  }),
];

export default buildAlbum({
  year: 2016,
  month: 6,
  title: 'Turkey',
  description:
    "Who doesn't love a good all inclusive holiday at a 5 star hotel for 2 weeks? " +
    'We spent some quality family time together sitting around the pool, eating good food and taking daily dips in the warm ocean.',
  headerImageUrl: turkeyImages.nearPerfection.url,
  grids: gridData,
  moreLinks: ['/2023/albania', '/2018/lakecomo', '/2016/tokyo'],
});
