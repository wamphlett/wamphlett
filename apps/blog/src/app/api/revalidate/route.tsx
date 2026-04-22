import { NextRequest } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const path = request.nextUrl.searchParams.get('path');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ message: 'Invalid secret' }, { status: 401 });
  }

  if (!path) {
    return Response.json({ message: 'Missing path param' }, { status: 400 });
  }

  const tagsToRevalidate: string[] = [];
  tagsToRevalidate.push('sidebar');
  tagsToRevalidate.push('recent');
  if (path === '/') {
    tagsToRevalidate.push('everything');
  }

  revalidatePath(path);

  for (const tag of tagsToRevalidate) {
    revalidateTag(tag);
  }

  return Response.json({
    revalidated: true,
    now: Date.now(),
    tags: tagsToRevalidate,
    path: path,
  });
}
