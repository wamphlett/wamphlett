import { NextRequest } from 'next/server';
import { createSessionToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  const validUsername = process.env.MANAGE_USERNAME;
  const validPassword = process.env.MANAGE_PASSWORD;

  if (!validUsername || !validPassword) {
    return new Response(JSON.stringify({ error: 'Auth not configured' }), {
      status: 500,
    });
  }

  if (username !== validUsername || password !== validPassword) {
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
      status: 401,
    });
  }

  const secret = process.env.MANAGE_SESSION_SECRET ?? 'change-me-in-env';
  const token = await createSessionToken(username, secret);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `manage-session=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${24 * 60 * 60}`,
    },
  });
}

export async function DELETE() {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie':
        'manage-session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0',
    },
  });
}
