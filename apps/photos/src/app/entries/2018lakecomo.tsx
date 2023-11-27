import { buildAlbum } from '../data';
import { images } from '../types';
import { Grids, GridData } from '../types';

import comoImages from '../images/2018lakeComo';

const gridData: GridData[] = [
  images({
    grid: Grids.Row,
    aspectRatio: 16 / 10,
    images: [comoImages.theMorningView],
  }),
  images({
    grid: Grids.OffsetInverted,
    images: [comoImages.whyHelloThere, comoImages.greenway],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 16 / 9,
    images: [comoImages.howCanAnywhereLookThisGood],
  }),
  images({
    grid: Grids.OffsetInverted,
    images: [comoImages.comoHarbour, comoImages.builtIntoTheHills],
  }),
  images({
    grid: Grids.OffsetTallInverted,
    images: [comoImages.windowToBliss, comoImages.holidayIsThirstyWork],
  }),
  images({
    grid: Grids.Offset,
    images: [comoImages.anArtistsEscape, comoImages.creativityHousedInStyle],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 16 / 9,
    images: [comoImages.fetchTheClimbingRope],
  }),
  images({
    grid: Grids.TriSquare,
    images: [
      comoImages.alwaysAViewToTheLake,
      comoImages.aChurchOnTheWater,
      comoImages.cheeese,
    ],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 16 / 10,
    images: [comoImages.majesticPeaksOfLakeComo],
  }),
];

export default buildAlbum({
  year: 2018,
  month: 6,
  title: 'Lake Como',
  description:
    "Summer '18 and a short break in Lake Como, Italy. We stayed in Sala Comacina on the edge of the lake with an amazing view of Isola Comacina. The views heres really are amazing and need to be witnessed. It was my first time here and it very quickly turned out to be one of my favourite places. The people are friendly, the food is great and the views are breathtaking. I'll live here for a summer one day.",
  headerImageUrl:
    'https://library.wamphlett.net/photos/website/2018/lakecomo/how-can-anywhere-look-this-good.jpg',
  grids: gridData,
  moreLinks: ['/2023/albania', '/2016/tokyo', '/2016/turkey'],
});
