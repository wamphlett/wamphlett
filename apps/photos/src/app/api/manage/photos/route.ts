import { NextRequest } from 'next/server';
import { revalidateTag } from 'next/cache';

const apiBase = () => process.env.REMOTE_API_URL ?? 'http://localhost:3000';

export async function GET(request: NextRequest) {
  const page = request.nextUrl.searchParams.get('page') ?? '1';
  const res = await fetch(`${apiBase()}/photos?limit=20&page=${page}`, { cache: 'no-store' });
  if (!res.ok) return Response.json({ error: 'API error' }, { status: res.status });
  return Response.json(await res.json());
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const res = await fetch(`${apiBase()}/photos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) return Response.json({ error: 'API error' }, { status: res.status });
  const photo = await res.json();
  revalidateTag('everything');
  for (const tag of (photo.tags ?? [])) revalidateTag(tag);
  return Response.json(photo);
}
