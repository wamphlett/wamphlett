import { buildAlbum } from '../data';
import { images } from '../types';
import { Grids, GridData } from '../types';

import fushimiInari2023Images from '../images/2023fushimiInari';

const gridData: GridData[] = [
  images({
    grid: Grids.Row,
    aspectRatio: 3 / 4,
    images: [
      fushimiInari2023Images.attentionToDetail,
      fushimiInari2023Images.finallyAlone,
      fushimiInari2023Images.snakingUpTheMountain,
    ],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 4 / 5,
    images: [fushimiInari2023Images.guardiansOfTheShrine],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 6 / 4,
    images: [fushimiInari2023Images.dreamComeTrue],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 4 / 5,
    images: [
      fushimiInari2023Images.offeringsToTheKitsune,
      fushimiInari2023Images.prayForGoodFortune,
    ],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 5 / 4,
    images: [fushimiInari2023Images.oldMeetsNew],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 1,
    images: [fushimiInari2023Images.freeFromTheCrowds],
  }),
  images({
    grid: Grids.Double,
    images: [
      fushimiInari2023Images.homeOfInari,
      fushimiInari2023Images.messengersOfInari,
    ],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 16 / 9,
    images: [fushimiInari2023Images.capturingMemories],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 3 / 4,
    images: [
      fushimiInari2023Images.contrastingColours,
      fushimiInari2023Images.aGlimpseOfKyoto,
      fushimiInari2023Images.justHangingAround,
    ],
  }),
  images({
    grid: Grids.TriWideInverted,
    images: [
      fushimiInari2023Images.myFeetMadeIt,
      fushimiInari2023Images.aMetropolisBetweenMountains,
      fushimiInari2023Images.kyoto,
    ],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 3 / 4,
    images: [
      fushimiInari2023Images.atarashiTorii,
      fushimiInari2023Images.bombed,
      fushimiInari2023Images.donorRecognitionPlaques,
      fushimiInari2023Images.hakerumaCo,
    ],
  }),
  images({
    grid: Grids.OffsetInverted,
    images: [
      fushimiInari2023Images.naturalWear,
      fushimiInari2023Images.tranquillity,
    ],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 3 / 4,
    images: [
      fushimiInari2023Images.historicShrines,
      fushimiInari2023Images.madeToLast,
    ],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 1,
    images: [fushimiInari2023Images.vermilionTrails],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 16 / 11,
    images: [fushimiInari2023Images.hangingMessages],
  }),
  images({
    grid: Grids.TriWide,
    images: [
      fushimiInari2023Images.standingTheTestOfTime,
      fushimiInari2023Images.newlyPaintedToriis,
      fushimiInari2023Images.topOfInari,
    ],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 4 / 5,
    images: [fushimiInari2023Images.walkingAncientPaths],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 4 / 5,
    images: [
      fushimiInari2023Images.commemorativeStones,
      fushimiInari2023Images.wellDecorated,
      fushimiInari2023Images.oneToRuleThemAll,
    ],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 4 / 5,
    images: [
      fushimiInari2023Images.journeyToTheTop,
      fushimiInari2023Images.stillSmiling,
    ],
  }),
  images({
    grid: Grids.Row,
    aspectRatio: 4 / 5,
    images: [
      fushimiInari2023Images.endlessSteps,
      fushimiInari2023Images.endlessVisitors,
      fushimiInari2023Images.toriiTunnels,
    ],
  }),
];

export default buildAlbum({
  year: 2023,
  month: 9,
  title: 'Fushimi Inari',
  description: `Ever since I set my eyes on this place, I have wanted to visit. This year we finally got to walk the Fushimi Inari 「伏見稲荷大社」 trails. Thousands apon thousands of Torii gates 「鳥居」 line the paths up the 764 ft mountain, each one engraved with the name of the donor and the year it was placed. The trail is very popular with tourists so the crowds can be a bit much but the further you push up the mountain, the quieter it gets and this is where the trail really comes into its own. Established in the late 8th century, Fushimi Inari is one of the most historically significant shrines in Kyoto and I'd recommend anyone to visit.`,
  headerImageUrl: fushimiInari2023Images.oldMeetsNew.url,
  grids: gridData,
});
