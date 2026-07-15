import OverviewLayout from '@/layouts/overview';

import { getAll } from './data';
import { AlbumData } from './types';
import { getBlurUrl } from './loaders';

import AlbumTile, { AlbumTileStyle } from '@/components/albumTile';

import albaniaImages from './images/2023albania';
import Feed from '@/components/feed';

export default async function Home() {
  const headerURL = albaniaImages.lifesBetterByTheSea.url;
  const blurDataURL = await getBlurUrl(headerURL);

  const albumArray: AlbumData[] = Object.values(getAll());

  albumArray.sort((a, b) => {
    if (a.year !== b.year) {
      return b.year - a.year;
    }
    return b.month - a.month;
  });

  return (
    <OverviewLayout
      description="When I'm not playing software engineer, I like to take photos. I've been fortunate enough to travel to some amazing places and this is a collection of some of my favourite photos from those trips."
      headerImageBlurDataURL={blurDataURL}
      headerImageUrl={albaniaImages.lifesBetterByTheSea.url}
      title="Photos"
    >
      <Feed />
    </OverviewLayout>
  );
}
