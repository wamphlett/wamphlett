type JWTPayload = {
  exp?: number;
};

// Only checks the token's expiry; rtk-api verifies the signature on every
// write, so this just decides whether to show the editing UI.
export function isTokenValid(token?: string): boolean {
  if (!token) {
    return false;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString(),
    ) as JWTPayload;

    if (!payload.exp) {
      return false;
    }

    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch {
    return false;
  }
}
