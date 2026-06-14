import { getPlaiceholder } from 'plaiceholder';
import logger from '@/lib/logger';

const urlCache: Record<string, string> = {};
const inFlight = new Map<string, Promise<string>>();

export const getBlurUrl = async (url: string): Promise<string> => {
  url = addSizeToUrl(url, 640);

  if (urlCache[url]) return urlCache[url];
  if (inFlight.has(url)) return inFlight.get(url)!;

  const promise = (async () => {
    try {
      const buffer = await fetch(url).then(async res =>
        Buffer.from(await res.arrayBuffer()),
      );
      const { base64 } = await getPlaiceholder(buffer);
      urlCache[url] = base64;
      return base64;
    } catch (err) {
      logger.error({ url, err }, 'failed to generate blur url');
      return '';
    } finally {
      inFlight.delete(url);
    }
  })();

  inFlight.set(url, promise);
  return promise;
};

const addSizeToUrl = (url: string, width: number) => {
  return `${url}?w=${width}`;
};
