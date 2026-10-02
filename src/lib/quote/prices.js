import "server-only";

/**
 * The price list. SERVER-ONLY: importing this from a client component fails the
 * build, so prices never reach the browser (visitors only ever see the final,
 * localised "starting from" amounts).
 *
 * All prices are USD for HIGH-INCOME markets and are the low end of a typical
 * engagement; regions.js scales them per country and currency.js converts them
 * to the visitor's currency. `weeks` are the minimum typical effort.
 * Keys must match the option ids in catalog.js.
 */

export const LEVELS = {
  mvp: { price: 1, weeks: 1 },
  production: { price: 1.7, weeks: 1.6 },
};

export const PRICES = {
  web: {
    type: {
      website: { price: 800, weeks: 2 },
      webapp: { price: 3500, weeks: 6 },
      ecommerce: { price: 2000, weeks: 4 },
    },
    features: {
      auth: { price: 400, weeks: 1 },
      payments: { price: 600, weeks: 1 },
      admin: { price: 1000, weeks: 2 },
      cms: { price: 500, weeks: 1 },
      integrations: { price: 600, weeks: 1 },
    },
  },
  mobile: {
    platforms: { android: { price: 0, weeks: 0 }, ios: { price: 0, weeks: 0 } },
    approach: { cross: { price: 0, weeks: 0 }, native: { price: 0, weeks: 0 } },
    features: {
      auth: { price: 400, weeks: 1 },
      payments: { price: 800, weeks: 1 },
      push: { price: 300, weeks: 1 },
      maps: { price: 600, weeks: 1 },
      chat: { price: 1200, weeks: 2 },
      offline: { price: 800, weeks: 2 },
    },
    // The app itself: cross-platform shares one codebase; native is built once per OS.
    base(sel) {
      const count = sel.platforms?.length ?? 0;
      if (!count) return { price: 0, weeks: 0 };
      if (sel.approach === "native") return { price: 4000 * count, weeks: 7 + 3 * (count - 1) };
      return count === 1 ? { price: 3500, weeks: 6 } : { price: 4500, weeks: 7 };
    },
  },
  data_science: {
    solutions: {
      bi: { price: 1500, weeks: 3 },
      ml: { price: 3500, weeks: 5 },
      ai: { price: 3000, weeks: 4 },
    },
  },
  data_engineering: {
    sources: {
      few: { price: 2500, weeks: 3 },
      some: { price: 5000, weeks: 6 },
      many: { price: 9000, weeks: 9 },
    },
    extras: {
      warehouse: { price: 1500, weeks: 2 },
      realtime: { price: 2000, weeks: 3 },
    },
  },
  cloud: {
    work: {
      migration: { price: 2500, weeks: 3 },
      infra: { price: 1500, weeks: 2 },
      review: { price: 900, weeks: 1 },
    },
  },
  // per month; not affected by the build level
  support: {
    plan: {
      basic: { price: 100, weeks: 0 },
      standard: { price: 300, weeks: 0 },
      premium: { price: 800, weeks: 0 },
    },
  },
};
