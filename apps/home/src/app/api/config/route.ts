import { NextRequest, NextResponse } from 'next/server';
import {
  ConflictError,
  readConfig,
  validateConfig,
  writeConfig,
} from '@/lib/config-io';
import logger from '@/lib/logger';

export async function GET() {
  const start = Date.now();
  try {
    const config = await readConfig();
    logger.info(
      {
        method: 'GET',
        path: '/api/config',
        statusCode: 200,
        durationMs: Date.now() - start,
      },
      'config read',
    );
    return NextResponse.json(config);
  } catch (err) {
    logger.error(
      {
        method: 'GET',
        path: '/api/config',
        statusCode: 500,
        durationMs: Date.now() - start,
        err,
      },
      'failed to read config',
    );
    return NextResponse.json(
      { error: 'Failed to read config' },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  const start = Date.now();
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    logger.warn(
      {
        method: 'PUT',
        path: '/api/config',
        statusCode: 400,
        durationMs: Date.now() - start,
      },
      'invalid json body',
    );
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!validateConfig(body)) {
    logger.warn(
      {
        method: 'PUT',
        path: '/api/config',
        statusCode: 400,
        durationMs: Date.now() - start,
      },
      'invalid config structure',
    );
    return NextResponse.json(
      { error: 'Invalid config structure' },
      { status: 400 },
    );
  }

  try {
    const saved = await writeConfig(body);
    logger.info(
      {
        method: 'PUT',
        path: '/api/config',
        statusCode: 200,
        durationMs: Date.now() - start,
      },
      'config updated',
    );
    return NextResponse.json(saved);
  } catch (e) {
    if (e instanceof ConflictError) {
      logger.warn(
        {
          method: 'PUT',
          path: '/api/config',
          statusCode: 409,
          durationMs: Date.now() - start,
        },
        'config conflict',
      );
      return NextResponse.json({ error: e.message }, { status: 409 });
    }
    logger.error(
      {
        method: 'PUT',
        path: '/api/config',
        statusCode: 500,
        durationMs: Date.now() - start,
        err: e,
      },
      'failed to write config',
    );
    return NextResponse.json(
      { error: 'Failed to write config' },
      { status: 500 },
    );
  }
}
