import "server-only";

/**
 * Location-based pricing tiers. SERVER-ONLY and never shown to visitors: the
 * quote page, PDF and email only ever show final amounts, so nobody can tell
 * that (or how) prices vary by location. Tiers appear only in the admin panel
 * and the team's notification email.
 *
 * Prices in prices.js are for high-income markets; each income group pays a
 * fraction of that. Groups follow the World Bank's country income
 * classification (FY2026, effective 1 July 2025), which is reviewed every July:
 * https://datahelpdesk.worldbank.org/knowledgebase/articles/906519
 */

// Tune these to your pricing strategy. 1.0 = the price list.
export const TIERS = {
  high: { label: "High income", multiplier: 1.0 },
  upper_middle: { label: "Upper-middle income", multiplier: 0.55 },
  lower_middle: { label: "Lower-middle income", multiplier: 0.35 },
  low: { label: "Low income", multiplier: 0.25 },
};

// Economies not listed below (mostly small territories) are priced as high income.
export const DEFAULT_TIER = "high";

// When the visitor's location can't be detected at all (rare in production;
// always the case in local dev), price at a middle tier, in USD.
export const UNDETECTED_TIER = "upper_middle";

const GROUPS = {
  low: [
    "AF", "BF", "BI", "CD", "CF", "ER", "ET", "GM", "GW", "KP", "LR", "MG", "ML", "MW",
    "MZ", "NE", "RW", "SD", "SL", "SO", "SS", "SY", "TD", "TG", "UG", "YE",
  ],
  lower_middle: [
    "AO", "BD", "BJ", "BO", "BT", "CG", "CI", "CM", "DJ", "EG", "FM", "GH", "GN", "HN",
    "HT", "IN", "JO", "KE", "KG", "KH", "KI", "KM", "LA", "LB", "LK", "LS", "MA", "MM",
    "MR", "NA", "NG", "NI", "NP", "PG", "PH", "PK", "PS", "SB", "SN", "ST", "SZ", "TJ",
    "TL", "TN", "TZ", "UZ", "VN", "VU", "ZM", "ZW",
  ],
  upper_middle: [
    "AL", "AM", "AR", "AZ", "BA", "BR", "BW", "BY", "BZ", "CN", "CO", "CU", "CV", "DM",
    "DO", "DZ", "EC", "FJ", "GA", "GD", "GE", "GQ", "GT", "ID", "IQ", "IR", "JM", "KZ",
    "LC", "LY", "MD", "ME", "MH", "MK", "MN", "MU", "MV", "MX", "MY", "PE", "PY", "RS",
    "SR", "SV", "TH", "TM", "TO", "TR", "TV", "UA", "VC", "VE", "WS", "XK", "ZA",
  ],
  high: [
    "AD", "AE", "AG", "AT", "AU", "AW", "BB", "BE", "BG", "BH", "BM", "BN", "BS", "CA",
    "CH", "CL", "CR", "CW", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FO", "FR", "GB",
    "GG", "GI", "GL", "GR", "GU", "GY", "HK", "HR", "HU", "IE", "IL", "IM", "IS", "IT",
    "JE", "JP", "KN", "KR", "KW", "KY", "LI", "LT", "LU", "LV", "MC", "MF", "MO", "MP",
    "MT", "NC", "NL", "NO", "NR", "NZ", "OM", "PA", "PF", "PL", "PR", "PT", "PW", "QA",
    "RO", "RU", "SA", "SC", "SE", "SG", "SI", "SK", "SM", "SX", "TC", "TT", "TW", "US",
    "UY", "VG", "VI",
  ],
};

const TIER_BY_COUNTRY = Object.fromEntries(
  Object.entries(GROUPS).flatMap(([tier, codes]) => codes.map((code) => [code, tier]))
);

export const isKnownCountry = (code) => typeof code === "string" && code in TIER_BY_COUNTRY;

export const tierForCountry = (code) => (code ? TIER_BY_COUNTRY[code] ?? DEFAULT_TIER : UNDETECTED_TIER);

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
export const countryName = (code) => {
  try {
    return regionNames.of(code) ?? code;
  } catch {
    return code;
  }
};

