import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth';

const PUBLIC = ['/manage/login', '/api/manage/auth'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (PUBLIC.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const session = request.cookies.get('manage-session')?.value;
  if (!session) {
    return NextResponse.redirect(new URL('/manage/login', request.url));
  }

  const secret = process.env.MANAGE_SESSION_SECRET ?? 'change-me-in-env';
  if (!(await verifySessionToken(session, secret))) {
    const res = NextResponse.redirect(new URL('/manage/login', request.url));
    res.cookies.delete('manage-session');
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/manage/:path*', '/api/manage/:path*'],
};
