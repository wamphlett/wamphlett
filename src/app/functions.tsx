export function libraryUrl(path: string): string {
  return `https://library.wamphlett.net/photos/website/` + trimSlash(path);
}

function trimSlash(path: string): string {
  return path.startsWith("/") ? path.substring(1, path.length) : path;
}
