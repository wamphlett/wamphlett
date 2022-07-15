const requestCache = class {
  constructor() {
    this.cache = {}
  }

  get(route) {
    if (this.cache[route]) {
      let secondsInCache = (new Date() - this.cache[route].time) / 1000
      if (secondsInCache < 180) {
        return this.cache[route].json
      }
    }
  }

  set(route, json) {
    this.cache[route] = {
      json,
      time: new Date()
    }
  }
}

const cache = new requestCache()

export const callApi = (route) => {
  let cacheRes = cache.get(route)
  if (cacheRes) {
    return Promise.resolve(cacheRes)
  }
  if (process.env.REACT_APP_API_URL != "") {
    route = process.env.REACT_APP_API_URL + route
  }
  return fetch(route)
    .then((res) => {
      if (res.ok) {
        return res.json()
      }
      let e = new Error("error calling the api")
      e.code = res.status
      throw e
    })
    .then((json) => {
      cache.set(route, json)
      return json
    })
}