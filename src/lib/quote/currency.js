import "server-only";

/**
 * Converts USD quote amounts into the visitor's local currency at current rates.
 *
 * Rates come from ExchangeRate-API's open endpoint (no key; updated daily),
 * cached for an hour. Its terms require the "Rates By Exchange Rate API"
 * attribution, which the quote page shows. If the service is unreachable, or
 * doesn't carry a currency, amounts stay in USD.
 */

const RATES_URL = "https://open.er-api.com/v6/latest/USD";

// ISO 3166-1 alpha-2 country -> ISO 4217 currency, for every country in regions.js.
// Dollarised economies use USD; currencies the rates service lacks fall back to USD.
const CURRENCY_BY_COUNTRY = {
  // low income
  AF: "AFN", BF: "XOF", BI: "BIF", CD: "CDF", CF: "XAF", ER: "ERN", ET: "ETB", GM: "GMD", GW: "XOF",
  KP: "KPW", LR: "LRD", MG: "MGA", ML: "XOF", MW: "MWK", MZ: "MZN", NE: "XOF", RW: "RWF", SD: "SDG",
  SL: "SLE", SO: "SOS", SS: "SSP", SY: "SYP", TD: "XAF", TG: "XOF", UG: "UGX", YE: "YER",
  // lower-middle income
  AO: "AOA", BD: "BDT", BJ: "XOF", BO: "BOB", BT: "BTN", CG: "XAF", CI: "XOF", CM: "XAF", DJ: "DJF",
  EG: "EGP", FM: "USD", GH: "GHS", GN: "GNF", HN: "HNL", HT: "HTG", IN: "INR", JO: "JOD", KE: "KES",
  KG: "KGS", KH: "KHR", KI: "AUD", KM: "KMF", LA: "LAK", LB: "LBP", LK: "LKR", LS: "LSL", MA: "MAD",
  MM: "MMK", MR: "MRU", NA: "NAD", NG: "NGN", NI: "NIO", NP: "NPR", PG: "PGK", PH: "PHP", PK: "PKR",
  PS: "ILS", SB: "SBD", SN: "XOF", ST: "STN", SZ: "SZL", TJ: "TJS", TL: "USD", TN: "TND", TZ: "TZS",
  UZ: "UZS", VN: "VND", VU: "VUV", ZM: "ZMW", ZW: "USD",
  // upper-middle income
  AL: "ALL", AM: "AMD", AR: "ARS", AZ: "AZN", BA: "BAM", BR: "BRL", BW: "BWP", BY: "BYN", BZ: "BZD",
  CN: "CNY", CO: "COP", CU: "CUP", CV: "CVE", DM: "XCD", DO: "DOP", DZ: "DZD", EC: "USD", FJ: "FJD",
  GA: "XAF", GD: "XCD", GE: "GEL", GQ: "XAF", GT: "GTQ", ID: "IDR", IQ: "IQD", IR: "IRR", JM: "JMD",
  KZ: "KZT", LC: "XCD", LY: "LYD", MD: "MDL", ME: "EUR", MH: "USD", MK: "MKD", MN: "MNT", MU: "MUR",
  MV: "MVR", MX: "MXN", MY: "MYR", PE: "PEN", PY: "PYG", RS: "RSD", SR: "SRD", SV: "USD", TH: "THB",
  TM: "TMT", TO: "TOP", TR: "TRY", TV: "AUD", UA: "UAH", VC: "XCD", VE: "VES", WS: "WST", XK: "EUR",
  ZA: "ZAR",
  // high income
  AD: "EUR", AE: "AED", AG: "XCD", AT: "EUR", AU: "AUD", AW: "AWG", BB: "BBD", BE: "EUR", BG: "EUR",
  BH: "BHD", BM: "BMD", BN: "BND", BS: "BSD", CA: "CAD", CH: "CHF", CL: "CLP", CR: "CRC", CW: "XCG",
  CY: "EUR", CZ: "CZK", DE: "EUR", DK: "DKK", EE: "EUR", ES: "EUR", FI: "EUR", FO: "DKK", FR: "EUR",
  GB: "GBP", GG: "GBP", GI: "GIP", GL: "DKK", GR: "EUR", GU: "USD", GY: "GYD", HK: "HKD", HR: "EUR",
  HU: "HUF", IE: "EUR", IL: "ILS", IM: "GBP", IS: "ISK", IT: "EUR", JE: "GBP", JP: "JPY", KN: "XCD",
  KR: "KRW", KW: "KWD", KY: "KYD", LI: "CHF", LT: "EUR", LU: "EUR", LV: "EUR", MC: "EUR", MF: "EUR",
  MO: "MOP", MP: "USD", MT: "EUR", NC: "XPF", NL: "EUR", NO: "NOK", NR: "AUD", NZ: "NZD", OM: "OMR",
  PA: "USD", PF: "XPF", PL: "PLN", PR: "USD", PT: "EUR", PW: "USD", QA: "QAR", RO: "RON", RU: "RUB",
  SA: "SAR", SC: "SCR", SE: "SEK", SG: "SGD", SI: "EUR", SK: "EUR", SM: "EUR", SX: "XCG", TC: "USD",
  TT: "TTD", TW: "TWD", US: "USD", UY: "UYU", VG: "USD", VI: "USD",
};

const USD = { currency: "USD", rate: 1, ratesDate: null };

async function fetchRates() {
  try {
    const res = await fetch(RATES_URL, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.result === "success" ? data : null;
  } catch {
    return null;
  }
}

/**
 * The currency and USD->currency rate to quote a country in.
 * Returns { currency, rate, ratesDate } (USD with rate 1 as the fallback).
 */
export async function currencyFor(country) {
  const currency = CURRENCY_BY_COUNTRY[country];
  if (!currency || currency === "USD") return USD;
  const data = await fetchRates();
  const rate = Number(data?.rates?.[currency]);
  if (!rate || !Number.isFinite(rate)) return USD;
  return { currency, rate, ratesDate: new Date(data.time_last_update_unix * 1000) };
}

/**
 * Round DOWN to two significant figures, so a converted "starting from" amount
 * stays a round number and never exceeds the real minimum:
 * 36,296 -> 36,000; 4,725 -> 4,700; 1,327,682 -> 1,300,000; 280 -> 280.
 */
export function roundDownNice(amount) {
  if (amount < 100) return Math.floor(amount);
  const step = 10 ** (Math.floor(Math.log10(amount)) - 1);
  return Math.floor(amount / step) * step;
}
