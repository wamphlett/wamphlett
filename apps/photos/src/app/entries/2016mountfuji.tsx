import { buildAlbum } from '../data';
import { Content, images, youtube } from '../types';
import { GridData, Grids } from '../types';

import fujiImages from '../images/2016mountFuji';

const gridData: Content[] = [
  images({
    grid: Grids.Row,
    aspectRatio: 16 / 10,
    images: [fujiImages.soItBegins],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 16 / 9,
    images: [fujiImages.aboveTheClouds],
  }),
  images({
    grid: Grids.Offset,
    images: [fujiImages.recordingMemories, fujiImages.landOfTheRisingSun],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 1,
    images: [fujiImages.trafficJam],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 16 / 9,
    images: [fujiImages.weMadeIt],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 16 / 10,
    images: [fujiImages.theWayDownIsDefinitelyEasier],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 1.5 / 1,
    images: [fujiImages.justAShortBreak, fujiImages.whatDidWeGetInto],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 16 / 9,
    images: [fujiImages.theBestAndHardestThingIveEverDone],
  }),
  images({
    grid: Grids.Offset,
    images: [fujiImages.dilierium, fujiImages.theFinalMile],
  }),
  youtube({
    link: 'https://www.youtube.com/embed/0agZLtnJvuo?si=50Y-zv80yI5Jtvw-',
  }),
];

export default buildAlbum({
  year: 2016,
  month: 8,
  title: 'Mount Fuji',
  description:
    'Climbing Mount Fuji was one of the most challenging things I have ever done, both mentally and physically. ' +
    'We started our climb at 8pm and reached the summit at 4am, just in time to watch the sun rise over Japan. ' +
    'Despite the pain and the struggle, it was one of the most rewarding experiences of my life. ',
  headerImageUrl: fujiImages.landOfTheRisingSun.url,
  grids: gridData,
  moreLinks: ['/2016/tokyo', '/2023/albania', '/2018/lakecomo'],
});
