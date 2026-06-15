import { metrics } from '@opentelemetry/api';

const meter = metrics.getMeter('blog-site');

export const upstreamRequestDuration = meter.createHistogram(
  'upstream.request.duration',
  { description: 'Duration of upstream API requests', unit: 'ms' },
);

export const upstreamRequestErrors = meter.createCounter(
  'upstream.request.errors',
  { description: 'Number of failed upstream API requests' },
);
