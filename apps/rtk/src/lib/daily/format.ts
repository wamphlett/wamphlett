// Fixed time zones so the server render and hydration agree.

export function formatDay(
  date: string,
  style: 'long' | 'short' = 'long',
): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', {
    weekday: style === 'long' ? 'long' : 'short',
    day: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    year: style === 'long' ? 'numeric' : undefined,
    timeZone: 'UTC',
  });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/London',
  });
}

export const percent = (value: number) => `${Math.round(value * 100)}%`;
