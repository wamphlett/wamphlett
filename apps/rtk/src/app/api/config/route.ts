import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    apiUrl: process.env.RTK_API_URL,
    baseUrl: process.env.NEXT_PUBLIC_RTK_SITE_URL,
  });
}
