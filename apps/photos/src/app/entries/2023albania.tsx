import { buildAlbum } from '../data';
import { Content, images, youtube } from '../types';
import { Grids } from '../types';

import albaniaImages from '../images/2023albania';

const gridData: Content[] = [
  images({
    grid: Grids.Row,
    aspectRatio: 4 / 5,
    images: [
      albaniaImages.sophistication,
      albaniaImages.aCrystalSea,
      albaniaImages.itsAlwaysTimeForWine,
    ],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 16 / 9,
    images: [albaniaImages.threeOfAKind],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 1.4 / 1,
    images: [albaniaImages.paradise],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 16 / 9,
    images: [albaniaImages.castleOfPortoPalermo],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 4 / 5,
    images: [
      albaniaImages.notACareInTheWorld,
      albaniaImages.priorities,
      albaniaImages.watchWhereYouStep,
    ],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 21 / 9,
    images: [albaniaImages.nothingButPerfectBeaches],
  }),
  images({
    grid: Grids.OffsetInverted,
    images: [
      albaniaImages.whyTravelByRoadWhenYouCanGoBySea,
      albaniaImages.neverFarFromABunker,
    ],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 16 / 9,
    images: [albaniaImages.lifesBetterByTheSea],
  }),
  images({
    grid: Grids.OffsetInverted,
    images: [albaniaImages.justAnotherDrink, albaniaImages._4BottlesLater],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 16 / 9,
    images: [albaniaImages.justMeAndTheSea],
  }),
  images({
    grid: Grids.OffsetTall,
    images: [albaniaImages.roadTrip, albaniaImages.thatView],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 2 / 3,
    images: [
      albaniaImages.gotToGetThatShot,
      albaniaImages.blueEye,
      albaniaImages.aLongWayDown,
      albaniaImages.itsNotThatBad,
    ],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 1.5 / 1,
    images: [albaniaImages.deepInThought],
  }),
  images({
    grid: Grids.OffsetTallInverted,
    images: [albaniaImages.theRoadToGjirokaster, albaniaImages.gjirokaster],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 21 / 10,
    images: [albaniaImages.gjirokasterFortress],
  }),
  images({
    grid: Grids.Offset,
    images: [albaniaImages.renovationsWanted, albaniaImages.byzantineStreets],
  }),
  images({
    grid: Grids.TriWide,
    images: [
      albaniaImages.sarande,
      albaniaImages.letsFly,
      albaniaImages.lightsOnTheSea,
    ],
  }),
  images({
    grid: Grids.Offset,
    images: [albaniaImages.sarandeByNight, albaniaImages.goodnightSarande],
  }),
  images({
    grid: Grids.OffsetTallInverted,
    images: [albaniaImages.theBestFlag, albaniaImages.whatAnEnterance],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 16 / 9,
    images: [albaniaImages.watchingTheSunDisapear],
  }),
  youtube({
    link: 'https://www.youtube.com/embed/uqqm7GKzpXs?si=DB92MA_ElmxyOU6B',
  }),
];

export default buildAlbum({
  year: 2023,
  month: 6,
  title: 'Albania',
  description:
    'Our first time exploring Albania. We rented a car from Tirana and drove south to Sarande. From there we took a boat to Ksamil and did a day trip to Gjirokaster and Blue Eye. First-time drone photography on holiday capturing relaxed beach days, scenic boat trips, and local life. Albania is a stunning country with a lot to offer. I will be back.',
  headerImageUrl: albaniaImages.paradise.url,
  grids: gridData,
  moreLinks: ['/2016/tokyo', '/2016/mountfuji', '/2018/lakecomo'],
});
