import PrimaryLayout from '@/layouts/primary';
import Introduction from '@/components/introduction';
import { getBlurUrl } from './loaders';
import FrameList from '@/components/frameList';
import { cookies } from "next/headers";

type JWTPayload = {
  exp?: number;
};

function isTokenValid(token?: string): boolean {
  if (!token) return false;

  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    ) as JWTPayload;

    console.log("Payload:", payload);

    if (!payload.exp) return false;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch {
    return false;
  }
}

export default async function Page() {
  const headerURL =
    'https://library.wamphlett.net/photos/website/2023/albania/three-of-a-kind.jpg';
  const blurDataURL = await getBlurUrl(headerURL);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/frames`, {
    cache: 'no-store', // or 'force-cache' / 'revalidate'
  })
  const data = await res.json()
  const c = await cookies()
  const token = c.get("TOKEN")?.value;

  return (
    <PrimaryLayout
      headerImageUrl={headerURL}
      headerImageBlurDataURL={blurDataURL!}
    >
      <Introduction locale='en' />
      <FrameList frames={data.frames} token={isTokenValid(token) ? token : undefined} />
    </PrimaryLayout>
  );
}
