class RequestCache {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private cache: Record<string, { json: any; expires: Date }>;

  constructor() {
    this.cache = {};
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(route: string): any | undefined {
    if (this.cache[route]) {
      if (this.cache[route].expires.getTime() < new Date().getTime()) {
        delete this.cache[route];
        return undefined;
      }
      return this.cache[route].json;
    }
    return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set(route: string, json: any, cacheSeconds: number = 180): void {
    const expiryTime = new Date(new Date().getTime() + cacheSeconds * 1000);
    console.log(`setting cache for ${route} to expire at ${expiryTime}`);
    this.cache[route] = {
      json,
      expires: expiryTime,
    };
  }
}

const cache = new RequestCache();

export const callApi = (route: string, cacheSeconds: number = 180) => {
  if (process.env.REACT_APP_API_URL != '') {
    route = process.env.REACT_APP_API_URL + route;
  }

  const cacheRes = cache.get(route);
  if (cacheRes) {
    return Promise.resolve(cacheRes);
  }

  return fetch(route)
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      throw new Error('error calling the api');
    })
    .then(json => {
      cache.set(route, json, cacheSeconds);
      return json;
    });
};
