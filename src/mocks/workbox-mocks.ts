
// Mock implementations for Workbox modules

interface CacheNameDetails {
  prefix?: string;
  suffix?: string;
  precache?: string;
  runtime?: string;
}

interface RouteHandlerCallbackOptions {
  request: Request;
  url?: URL;
  event?: Event;
  params?: any;
}

interface StrategyOptions {
  cacheName?: string;
  plugins?: Array<any>;
  fetchOptions?: RequestInit;
  matchOptions?: CacheQueryOptions;
}

interface ExpirationPluginOptions {
  maxEntries?: number;
  maxAgeSeconds?: number;
  purgeOnQuotaError?: boolean;
}

// Core module mock
export const core = {
  setCacheNameDetails: (details: CacheNameDetails) => {},
  skipWaiting: () => {},
  clientsClaim: () => {}
};

// Routing module mock
export const routing = {
  registerRoute: (
    capture: ((options: RouteHandlerCallbackOptions) => boolean) | RegExp | string,
    handler: any
  ) => {}
};

// Strategies module mock
export const strategies = {
  NetworkFirst: class {
    constructor(options?: StrategyOptions) {}
  },
  CacheFirst: class {
    constructor(options?: StrategyOptions) {}
  },
  StaleWhileRevalidate: class {
    constructor(options?: StrategyOptions) {}
  }
};

// Precaching module mock
export const precaching = {
  precacheAndRoute: (entries: Array<string | object>) => {},
  cleanupOutdatedCaches: () => {}
};

// Expiration module mock
export const expiration = {
  ExpirationPlugin: class {
    constructor(config?: ExpirationPluginOptions) {}
  }
};
