import PrimaryLayout from '@/layouts/primary';
import Timeline from '@/components/timeline';
import { getOrderedEventsGroupedByYear } from '@/app/data';
import Introduction from '@/components/introduction';
import More from '@/components/more';
import { getBlurUrl } from './loaders';
import comoImages from './images/2018lakeComo';

const events = getOrderedEventsGroupedByYear();

export default async function Page() {
  const headerURL =
    'https://library.wamphlett.net/photos/website/2023/albania/three-of-a-kind.jpg';
  const blurDataURL = await getBlurUrl(headerURL);
  return (
    <PrimaryLayout
      headerImageUrl={headerURL}
      headerImageBlurDataURL={blurDataURL!}
    >
      <Introduction />
      <Timeline events={events} />
      <More
        tiles={[
          {
            title: 'Albania',
            year: 2023,
            url: 'https://photos.warrenamphlett.co.uk/2023/albania',
            tileImageUrl:
              'https://library.wamphlett.net/photos/website/2023/albania/three-of-a-kind.jpg',
          },
          {
            title: 'Mount Fuji',
            year: 2016,
            url: 'https://photos.warrenamphlett.co.uk/2016/mountfuji',
            tileImageUrl:
              'https://library.wamphlett.net/photos/website/2016/mountfuji/land-of-the-rising-sun.jpg',
          },
          {
            title: 'Lake Como',
            year: 2018,
            url: 'https://photos.warrenamphlett.co.uk/2018/lakecomo',
            tileImageUrl: comoImages.howCanAnywhereLookThisGood.url,
          },
        ]}
      />
    </PrimaryLayout>
  );
}
