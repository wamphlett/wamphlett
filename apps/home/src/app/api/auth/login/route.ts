import { NextRequest, NextResponse } from 'next/server';
import {
  checkRateLimit,
  createSessionToken,
  resetRateLimit,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  validateCredentials,
} from '@/lib/auth';
import logger from '@/lib/logger';

export async function POST(req: NextRequest) {
  const start = Date.now();
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  if (!checkRateLimit(ip)) {
    logger.warn(
      {
        method: 'POST',
        path: '/api/auth/login',
        statusCode: 429,
        durationMs: Date.now() - start,
        ip,
        event: 'rate_limited',
      },
      'login rate limited',
    );
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again later.' },
      { status: 429 },
    );
  }

  let body: { username?: unknown; password?: unknown };
  try {
    body = await req.json();
  } catch {
    logger.warn(
      {
        method: 'POST',
        path: '/api/auth/login',
        statusCode: 400,
        durationMs: Date.now() - start,
        ip,
      },
      'invalid login request body',
    );
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 },
    );
  }

  const { username, password } = body;

  if (typeof username !== 'string' || typeof password !== 'string') {
    logger.warn(
      {
        method: 'POST',
        path: '/api/auth/login',
        statusCode: 400,
        durationMs: Date.now() - start,
        ip,
      },
      'missing credentials',
    );
    return NextResponse.json(
      { error: 'Username and password required' },
      { status: 400 },
    );
  }

  if (!validateCredentials(username, password)) {
    logger.warn(
      {
        method: 'POST',
        path: '/api/auth/login',
        statusCode: 401,
        durationMs: Date.now() - start,
        ip,
        username,
        event: 'login_failed',
      },
      'login failed',
    );
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  resetRateLimit(ip);

  const token = createSessionToken();
  const res = NextResponse.json({ success: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: SESSION_MAX_AGE,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  });

  logger.info(
    {
      method: 'POST',
      path: '/api/auth/login',
      statusCode: 200,
      durationMs: Date.now() - start,
      ip,
      username,
      event: 'login_success',
    },
    'login successful',
  );
  return res;
}
