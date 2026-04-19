import PrimaryLayout from '@/layouts/primary';
import Timeline from '@/components/timeline';
import { getOrderedEventsFromConfig } from '@/app/config-events';
import Introduction from '@/components/introduction';
import More from '@/components/more';
import { getBlurUrl } from './loaders';

export default async function Page() {
  const headerURL =
    'https://library.wamphlett.net/photos/website/2023/albania/three-of-a-kind.jpg';
  const [blurDataURL, events] = await Promise.all([
    getBlurUrl(headerURL),
    getOrderedEventsFromConfig(),
  ]);
  return (
    <PrimaryLayout
      headerImageUrl={headerURL}
      headerImageBlurDataURL={blurDataURL ?? ''}
    >
      <Introduction locale='en' />
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
            tileImageUrl: 'https://library.wamphlett.net/photos/website/2018/lakecomo/how-can-anywhere-look-this-good.jpg',
          },
        ]}
      />
    </PrimaryLayout>
  );
}
