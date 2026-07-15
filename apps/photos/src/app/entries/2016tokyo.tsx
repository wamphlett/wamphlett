import { buildAlbum } from '../data';
import { images } from '../types';
import { Grids, GridData } from '../types';

import tokyoImages from '../images/2016tokyo';

const gridData: GridData[] = [
  images({
    grid: Grids.TriWideInverted,
    images: [
      tokyoImages.itReallyIsASkyTree,
      tokyoImages.soSmall,
      tokyoImages.topOfTheTree,
    ],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 16 / 9,
    images: [tokyoImages.aNerdsHeaven],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 1.5 / 1,
    images: [
      tokyoImages.nowThisIsAnAquarium,
      tokyoImages.donQuijote,
      tokyoImages.timeForScience,
    ],
  }),
  images({
    grid: Grids.Double,
    images: [tokyoImages.akihabara, tokyoImages.sumidaFireworks],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 16 / 10,
    images: [tokyoImages.allTheSake],
  }),
  images({
    grid: Grids.TriSquareInverted,
    images: [
      tokyoImages.settlingIn,
      tokyoImages.newFriends,
      tokyoImages.konnichiwaHandsome,
    ],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 1,
    images: [tokyoImages.gotToCatchThemAll],
  }),
];

export default buildAlbum({
  year: 2016,
  month: 8,
  title: 'Tokyo',
  description:
    'A life long dream to visit Japan and it was everything I hoped it would be and more. ' +
    'We spent our time in Tokyo and climbed Mount Fuji to watch the sun rise over the country. ' +
    'I love the culture, the Japanese people and the food and it only amplified my love for Japan. ' +
    'As well as visiting some amazing place, we met some amazing people along the way who I am now happy to call friends. ' +
    'Really was the trip of a lifetime.',
  headerImageUrl: tokyoImages.allTheSake.url,
  grids: gridData,
  moreLinks: ['/2016/mountfuji', '/2023/albania', '/2018/lakecomo'],
});
