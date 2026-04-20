import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'admin_session';

function b64urlDecode(b64url: string): string {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4;
  return pad ? b64 + '='.repeat(4 - pad) : b64;
}

async function verifySessionToken(token: string): Promise<boolean> {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [encoded, hmacB64] = parts;

  try {
    const enc = new TextEncoder();
    const key = await globalThis.crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const hmacBinary = atob(b64urlDecode(hmacB64));
    const hmacBytes = new Uint8Array(hmacBinary.length);
    for (let i = 0; i < hmacBinary.length; i++) {
      hmacBytes[i] = hmacBinary.charCodeAt(i);
    }

    const isValid = await globalThis.crypto.subtle.verify(
      'HMAC',
      key,
      hmacBytes,
      enc.encode(encoded)
    );
    if (!isValid) return false;

    const payloadStr = atob(b64urlDecode(encoded));
    const payload = JSON.parse(payloadStr) as { exp?: number };
    return typeof payload.exp === 'number' && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === '/config/login';

  if (isLoginPage) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const authenticated = token ? await verifySessionToken(token) : false;

  if (!authenticated) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = '/config/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/config/:path*', '/api/config/:path*'],
};
