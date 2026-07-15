import { NextRequest } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import logger from '@/lib/logger';

export async function POST(request: NextRequest) {
  const start = Date.now();
  const secret = request.nextUrl.searchParams.get('secret');
  const path = request.nextUrl.searchParams.get('path');

  if (secret !== process.env.REVALIDATE_SECRET) {
    logger.warn(
      {
        method: 'POST',
        path: '/api/revalidate',
        statusCode: 401,
        durationMs: Date.now() - start,
      },
      'api request',
    );
    return Response.json({ message: 'Invalid secret' }, { status: 401 });
  }

  if (!path) {
    logger.warn(
      {
        method: 'POST',
        path: '/api/revalidate',
        statusCode: 400,
        durationMs: Date.now() - start,
      },
      'api request',
    );
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
    revalidateTag(tag, 'max');
  }

  logger.info(
    {
      method: 'POST',
      path: '/api/revalidate',
      statusCode: 200,
      durationMs: Date.now() - start,
      revalidatePath: path,
      tags: tagsToRevalidate,
    },
    'api request',
  );

  return Response.json({
    revalidated: true,
    now: Date.now(),
    tags: tagsToRevalidate,
    path: path,
  });
}
