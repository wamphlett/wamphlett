import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/auth';
import logger from '@/lib/logger';

export async function POST() {
  const start = Date.now();
  const res = NextResponse.json({ success: true });
  res.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
  logger.info(
    {
      method: 'POST',
      path: '/api/auth/logout',
      statusCode: 200,
      durationMs: Date.now() - start,
      event: 'logout',
    },
    'user logged out',
  );
  return res;
}
