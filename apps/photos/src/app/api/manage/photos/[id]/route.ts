import { NextRequest } from 'next/server';
import { revalidateTag } from 'next/cache';

const apiBase = () => process.env.REMOTE_API_URL ?? 'http://localhost:3000';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();
  const res = await fetch(`${apiBase()}/photos/${params.id}`, {
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

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const res = await fetch(`${apiBase()}/photos/${params.id}`, { method: 'DELETE' });
  if (!res.ok) return Response.json({ error: 'API error' }, { status: res.status });
  revalidateTag('everything');
  const tags = request.nextUrl.searchParams.get('tags');
  if (tags) {
    for (const tag of tags.split(',').filter(Boolean)) revalidateTag(tag);
  }
  return Response.json(await res.json());
}
