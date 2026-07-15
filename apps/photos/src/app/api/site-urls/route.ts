import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    homeSiteUrl: process.env.HOME_SITE_URL ?? 'https://warrenamphlett.co.uk',
  });
}
