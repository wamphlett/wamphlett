import { buildAlbum } from '../data';
import { images } from '../types';
import { Grids, GridData } from '../types';
import { libraryUrl } from '../utils';

const gridData: GridData[] = [
  images({
    grid: Grids.Row,
    aspectRatio: 1,
    images: [
      // {
      //   url: 'https://library.wamphlett.net/direct/nonpy.gif',
      //   title: 'はい、チーズ！',
      //   description: "She really didn't care",
      // },
    ],
  }),
];

export default buildAlbum({
  year: 2022,
  month: 4,
  title: 'Italy',
  description:
    'A last minute trip to Italy to meet my travel companion. Armed solely with a Google Pixel camera, we travelled from Rome to Naples and explored the ruins of Pompeii. From there, we took the unique train ride to Catania — a train that actually boards a ferry — before concluding our adventure in Palermo. The best part of traveling without bulky, expensive equipment? Indulging in copious amounts of wine and pizza! Prego!',
  headerImageUrl:
    'https://library.wamphlett.net/photos/website/2016/tokyo/the-hardest-and-the-best-thing-ive-ever-done.jpg',
  grids: gridData,
  // moreLinks: ["/2023/tokyo", "/2016/turkey", "/2018/lakecomo"],
  moreLinks: ['/2016/tokyo', '/2023/albania', '/2023/albania'],
});

// This function takes a filename as a string and returns the URL of the corresponding image in the library.
function imageUrl(filename: string): string {
  return libraryUrl(`/2016/tokyo/${filename}.jpg`);
}
