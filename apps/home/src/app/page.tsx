export const dynamic = 'force-dynamic';

import PrimaryLayout from '@/layouts/primary';
import Timeline from '@/components/timeline';
import { getOrderedEventsFromConfig } from '@/app/config-events';
import Introduction from '@/components/introduction';
import More from '@/components/more';
import RecentPostPopup from '@/components/recentPostPopup';
import { getBlurUrl } from './loaders';
import { libraryUrl } from './functions';

export default async function Page() {
  const photosSiteUrl =
    process.env.NEXT_PUBLIC_PHOTOS_SITE_URL ??
    'https://photos.warrenamphlett.co.uk';
  const headerURL = libraryUrl('/2023/albania/three-of-a-kind.jpg');
  const [blurDataURL, events] = await Promise.all([
    getBlurUrl(headerURL),
    getOrderedEventsFromConfig(),
  ]);
  return (
    <>
      <PrimaryLayout
        headerImageBlurDataURL={blurDataURL ?? ''}
        headerImageUrl={headerURL}
      >
        <Introduction locale="en" />
        <Timeline events={events} />
        <More
          tiles={[
            {
              title: 'Albania',
              year: 2023,
              url: `${photosSiteUrl}/2023/albania`,
              tileImageUrl: libraryUrl('/2023/albania/three-of-a-kind.jpg'),
            },
            {
              title: 'Mount Fuji',
              year: 2016,
              url: `${photosSiteUrl}/2016/mountfuji`,
              tileImageUrl: libraryUrl(
                '/2016/mountfuji/land-of-the-rising-sun.jpg',
              ),
            },
            {
              title: 'Lake Como',
              year: 2018,
              url: `${photosSiteUrl}/2018/lakecomo`,
              tileImageUrl: libraryUrl(
                '/2018/lakecomo/how-can-anywhere-look-this-good.jpg',
              ),
            },
          ]}
        />
      </PrimaryLayout>
      <RecentPostPopup />
    </>
  );
}
