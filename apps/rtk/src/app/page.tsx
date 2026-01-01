import PrimaryLayout from '@/layouts/primary';
import Introduction from '@/components/introduction';
import { getBlurUrl } from './loaders';
import FrameList from '@/components/frameList';

export default async function Page() {
  const headerURL =
    'https://library.wamphlett.net/photos/website/2023/albania/three-of-a-kind.jpg';
  const blurDataURL = await getBlurUrl(headerURL);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/frames`, {
    cache: 'no-store', // or 'force-cache' / 'revalidate'
  })
  const data = await res.json()

  return (
    <PrimaryLayout
      headerImageUrl={headerURL}
      headerImageBlurDataURL={blurDataURL!}
    >
      <Introduction locale='en' />
      <FrameList frames={data.frames} />
    </PrimaryLayout>
  );
}
