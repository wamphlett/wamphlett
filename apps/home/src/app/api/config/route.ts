import { NextRequest, NextResponse } from 'next/server';
import { readConfig, writeConfig, validateConfig, ConflictError } from '@/lib/config-io';

export async function GET() {
  try {
    const config = await readConfig();
    return NextResponse.json(config);
  } catch {
    return NextResponse.json({ error: 'Failed to read config' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!validateConfig(body)) {
    return NextResponse.json({ error: 'Invalid config structure' }, { status: 400 });
  }

  try {
    const saved = await writeConfig(body);
    return NextResponse.json(saved);
  } catch (e) {
    if (e instanceof ConflictError) {
      return NextResponse.json({ error: e.message }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to write config' }, { status: 500 });
  }
}
