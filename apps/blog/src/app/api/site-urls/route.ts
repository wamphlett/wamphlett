import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    homeSiteUrl: process.env.HOME_SITE_URL ?? 'https://warrenamphlett.co.uk',
    photosSiteUrl:
      process.env.PHOTOS_SITE_URL ?? 'https://photos.warrenamphlett.co.uk',
  });
}
