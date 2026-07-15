import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    photosSiteUrl:
      process.env.PHOTOS_SITE_URL ?? 'https://photos.warrenamphlett.co.uk',
    blogSiteUrl:
      process.env.BLOG_SITE_URL ?? 'https://blog.warrenamphlett.co.uk',
  });
}
