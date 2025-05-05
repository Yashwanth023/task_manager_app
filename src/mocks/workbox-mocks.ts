
// Mock implementations for Workbox modules

export const core = {
  setCacheNameDetails: () => {},
  skipWaiting: () => {},
  clientsClaim: () => {}
};

export const routing = {
  registerRoute: () => {}
};

export const strategies = {
  NetworkFirst: class {
    constructor() {}
  },
  CacheFirst: class {
    constructor() {}
  },
  StaleWhileRevalidate: class {
    constructor() {}
  }
};

export const precaching = {
  precacheAndRoute: () => {},
  cleanupOutdatedCaches: () => {}
};

export const expiration = {
  ExpirationPlugin: class {
    constructor() {}
  }
};
