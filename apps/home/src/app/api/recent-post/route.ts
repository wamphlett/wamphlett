import { NextResponse } from 'next/server';
import logger from '@/lib/logger';

export async function GET(request: Request) {
  const start = Date.now();
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') ?? '1';

  const baseUrl = process.env.BLOG_API_URL ?? 'https://blog.wamphlett.net';

  const res = await fetch(`${baseUrl}/recent?limit=${limit}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    logger.error({ method: 'GET', path: '/api/recent-post', statusCode: res.status, durationMs: Date.now() - start, upstream: baseUrl }, 'upstream blog api error');
    return NextResponse.json({ articles: [] }, { status: res.status });
  }

  const data = await res.json();
  logger.info({ method: 'GET', path: '/api/recent-post', statusCode: 200, durationMs: Date.now() - start }, 'recent posts fetched');
  return NextResponse.json(data);
}
