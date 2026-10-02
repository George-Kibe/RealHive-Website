import "server-only";
import { BUILD_LEVELS, SERVICES } from "@/lib/quote/catalog";
import { currencyFor, roundDownNice } from "@/lib/quote/currency";
import { LEVELS, PRICES } from "@/lib/quote/prices";
import { TIERS, countryName, tierForCountry } from "@/lib/quote/regions";
import { describe } from "@/lib/quote/selection";

/**
 * Prices a normalised selection for a country. SERVER-ONLY.
 *
 * Every figure is a rounded-down "starting from" amount in the visitor's local
 * currency; USD equivalents are kept for the admin panel. Use publicQuote()
 * for anything sent to the browser.
 */
export async function priceQuote(selection, country) {
  const tier = tierForCountry(country);
  const multiplier = TIERS[tier].multiplier;
  const level = LEVELS[selection.buildLevel];
  const { currency, rate, ratesDate } = await currencyFor(country);

  const items = [];
  for (const service of SERVICES) {
    const sel = selection.services[service.id];
    if (!sel) continue;
    const table = PRICES[service.id];
    let usd = 0;
    let weeks = 0;
    for (const field of service.fields) {
      const value = sel[field.key];
      for (const id of Array.isArray(value) ? value : value ? [value] : []) {
        usd += table[field.key]?.[id]?.price ?? 0;
        weeks += table[field.key]?.[id]?.weeks ?? 0;
      }
    }
    if (table.base) {
      const base = table.base(sel);
      usd += base.price;
      weeks += base.weeks;
    }
    if (!service.monthly) {
      usd *= level.price;
      weeks *= level.weeks;
    }
    usd *= multiplier;
    items.push({
      serviceId: service.id,
      name: service.name,
      details: describe(service, sel),
      monthly: Boolean(service.monthly),
      from: roundDownNice(usd * rate),
      fromUsd: roundDownNice(usd),
      weeks: Math.ceil(weeks),
    });
  }

  const sum = (list, key) => list.reduce((s, i) => s + i[key], 0);
  const project = items.filter((i) => !i.monthly);
  const monthly = items.filter((i) => i.monthly);
  // Services run partly in parallel: the longest one, plus 40% of the rest.
  const allWeeks = project.map((i) => i.weeks).filter(Boolean);
  const longest = allWeeks.length ? Math.max(...allWeeks) : 0;
  const rest = allWeeks.reduce((s, w) => s + w, 0) - longest;

  return {
    currency,
    rate,
    ratesDate,
    country,
    countryName: country ? countryName(country) : "Unknown",
    tier,
    tierLabel: TIERS[tier].label,
    buildLevel: selection.buildLevel,
    buildLevelLabel: BUILD_LEVELS[selection.buildLevel].label,
    items,
    projectFrom: sum(project, "from"),
    monthlyFrom: sum(monthly, "from"),
    projectFromUsd: sum(project, "fromUsd"),
    monthlyFromUsd: sum(monthly, "fromUsd"),
    weeksFrom: project.length ? Math.max(1, Math.ceil(longest + rest * 0.4)) : 0,
  };
}

/**
 * What the browser may see: final local amounts only. No country, tier, USD
 * equivalents or exchange rate, so nothing reveals location-based pricing.
 */
export const publicQuote = (quote) => ({
  currency: quote.currency,
  buildLevelLabel: quote.buildLevelLabel,
  items: quote.items.map(({ serviceId, name, details, monthly, from, weeks }) => ({ serviceId, name, details, monthly, from, weeks })),
  projectFrom: quote.projectFrom,
  monthlyFrom: quote.monthlyFrom,
  weeksFrom: quote.weeksFrom,
});
