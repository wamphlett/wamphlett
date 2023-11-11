import path from 'path';
import { getPlaiceholder } from 'plaiceholder';

type urlCacheType = {
  [url: string]: string;
};

const urlCache: urlCacheType = {};

export const getBlurUrl = async (url: string) => {
  url = addSizeToUrl(url, 640);

  if (urlCache[url]) {
    return urlCache[url];
  }

  try {
    const buffer = await fetch(url).then(async res =>
      Buffer.from(await res.arrayBuffer()),
    );

    const { base64 } = await getPlaiceholder(buffer);

    urlCache[url] = base64;

    return base64;
  } catch (err) {
    console.error(err);
    return '';
  }
};

const addSizeToUrl = (url: string, width: number) => {
  let directory = path.dirname(url);
  let fileName = path.basename(url);

  return `${directory}/${width}/${fileName}`;
};
