const toHex = (buffer: ArrayBuffer): string =>
  Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

const fromHex = (hex: string): Uint8Array => {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
};

const getKey = (secret: string): Promise<CryptoKey> =>
  crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );

export async function createSessionToken(username: string, secret: string): Promise<string> {
  const exp = Date.now() + 24 * 60 * 60 * 1000;
  const payload = btoa(JSON.stringify({ username, exp }));
  const key = await getKey(secret);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return `${payload}.${toHex(sig)}`;
}

export async function verifySessionToken(token: string, secret: string): Promise<boolean> {
  try {
    const dotIndex = token.lastIndexOf('.');
    if (dotIndex === -1) return false;
    const payload = token.substring(0, dotIndex);
    const sigHex = token.substring(dotIndex + 1);
    const { exp } = JSON.parse(atob(payload));
    if (Date.now() > exp) return false;
    const key = await getKey(secret);
    return await crypto.subtle.verify('HMAC', key, fromHex(sigHex), new TextEncoder().encode(payload));
  } catch {
    return false;
  }
}
