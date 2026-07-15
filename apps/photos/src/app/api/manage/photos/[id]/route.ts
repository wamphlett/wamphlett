import { NextRequest } from 'next/server';
import { revalidateTag } from 'next/cache';

const apiBase = () => process.env.REMOTE_API_URL ?? 'http://localhost:3000';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const res = await fetch(`${apiBase()}/photos/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) return Response.json({ error: 'API error' }, { status: res.status });
  const photo = await res.json();
  revalidateTag('everything', 'max');
  for (const tag of (photo.tags ?? [])) revalidateTag(tag, 'max');
  return Response.json(photo);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${apiBase()}/photos/${id}`, { method: 'DELETE' });
  if (!res.ok) return Response.json({ error: 'API error' }, { status: res.status });
  revalidateTag('everything', 'max');
  const tags = request.nextUrl.searchParams.get('tags');
  if (tags) {
    for (const tag of tags.split(',').filter(Boolean)) revalidateTag(tag, 'max');
  }
  return Response.json(await res.json());
}
