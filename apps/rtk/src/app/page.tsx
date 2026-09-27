import PrimaryLayout from '@/layouts/primary';
import Introduction from '@/components/introduction';
import { getBlurUrl } from './loaders';
import FrameList from '@/components/frameList';
import { cookies } from 'next/headers';
import { isTokenValid } from '@/lib/auth';

export default async function Page() {
  const headerURL = `${process.env.LIBRARY_URL ?? 'https://library.wamphlett.net'}/photos/website/2023/albania/three-of-a-kind.jpg`;
  const blurDataURL = await getBlurUrl(headerURL);
  const apiUrl = process.env.RTK_API_URL ?? 'https://rtk.wamphlett.net';
  const res = await fetch(`${apiUrl}/frames`, {
    cache: 'no-store', // or 'force-cache' / 'revalidate'
  });
  const data = await res.json();
  const c = await cookies();
  const token = c.get('TOKEN')?.value;

  return (
    <PrimaryLayout
      headerImageBlurDataURL={blurDataURL!}
      headerImageUrl={headerURL}
    >
      <Introduction />
      <FrameList
        frames={data.frames}
        token={isTokenValid(token) ? token : undefined}
      />
    </PrimaryLayout>
  );
}
