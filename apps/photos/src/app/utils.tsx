export function libraryUrl(path: string): string {
  const base =
    process.env.NEXT_PUBLIC_LIBRARY_URL ?? 'https://library.wamphlett.net';
  return `${base}/photos/website/` + trimSlash(path);
}

function trimSlash(path: string): string {
  return path.startsWith('/') ? path.substring(1, path.length) : path;
}
