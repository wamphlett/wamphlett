import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') ?? '1';

  const baseUrl =
    process.env.BLOG_API_URL ?? 'https://blog.wamphlett.net';

  const res = await fetch(`${baseUrl}/recent?limit=${limit}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    return NextResponse.json({ articles: [] }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
