import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    apiUrl: process.env.RTK_API_URL,
    baseUrl: process.env.RTK_SITE_URL,
    homeSiteUrl: process.env.HOME_SITE_URL ?? 'https://warrenamphlett.co.uk',
    photosSiteUrl:
      process.env.PHOTOS_SITE_URL ?? 'https://photos.warrenamphlett.co.uk',
    blogSiteUrl:
      process.env.BLOG_SITE_URL ?? 'https://blog.warrenamphlett.co.uk',
  });
}
