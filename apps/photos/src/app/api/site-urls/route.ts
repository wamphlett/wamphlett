import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    homeSiteUrl: process.env.HOME_SITE_URL ?? 'https://warrenamphlett.co.uk',
    blogSiteUrl:
      process.env.BLOG_SITE_URL ?? 'https://blog.warrenamphlett.co.uk',
  });
}
