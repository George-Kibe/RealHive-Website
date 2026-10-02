import fs from "node:fs/promises";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { formatMoney } from "@/lib/quote/format";
import { CONTACT } from "@/lib/schema";
import { SITE } from "@/lib/seo";

/**
 * Builds the quotation PDF (A4) with pdf-lib. It never mentions the visitor's
 * country or pricing tier: only final amounts in their currency. Pure JS with the standard PDF
 * fonts, so nothing is read from disk except the logo, which next.config.js
 * includes in the route bundles via outputFileTracingIncludes.
 */

const A4 = [595.28, 841.89];
const MARGIN = 50;
const INK = rgb(0.06, 0.09, 0.16);
const MUTED = rgb(0.39, 0.45, 0.53);
const BRAND = rgb(0, 0.467, 0.639); // #0077A3, the light-theme brand blue
const RULE = rgb(0.86, 0.89, 0.93);
const PANEL = rgb(0.95, 0.97, 0.99);

export const VALID_DAYS = 30;

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Nairobi" }).format(date);

// The standard fonts only cover Windows-1252; replace anything else (e.g. CJK names) so drawing never throws.
const makeSafe = (font) => {
  const cache = new Map();
  return (text = "") =>
    [...String(text)].map((ch) => {
      if (!cache.has(ch)) {
        try { font.encodeText(ch); cache.set(ch, ch); } catch { cache.set(ch, "?"); }
      }
      return cache.get(ch);
    }).join("");
};

const wrap = (text, font, size, maxWidth) => {
  const lines = [];
  for (const paragraph of String(text).split("\n")) {
    let line = "";
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const next = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(next, size) > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = next;
      }
    }
    lines.push(line);
  }
  return lines;
};

const loadLogo = async (pdf) => {
  try {
    return await pdf.embedPng(await fs.readFile(path.join(process.cwd(), "public", "images", "pdf-logo.png")));
  } catch {
    return null; // the PDF still works without it
  }
};

/**
 * @param quote    computeQuote() output plus { reference, createdAt }
 * @param contact  { name, email, company } (optional, for "Prepared for")
 * @returns Uint8Array
 */
export async function buildQuotePdf(quote, contact = {}) {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`Project estimate ${quote.reference}`);
  pdf.setAuthor(SITE.name);
  pdf.setSubject("Indicative project estimate");
  pdf.setCreationDate(quote.createdAt);

  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const safe = makeSafe(font);
  const logo = await loadLogo(pdf);

  let page = pdf.addPage(A4);
  const width = A4[0] - MARGIN * 2;
  let y = A4[1] - MARGIN;

  // currency codes, not symbols: the standard PDF fonts can't draw e.g. ₦ or ₹
  const money = (amount) => formatMoney(amount, quote.currency, "code");
  const text = (str, x, size, { f = font, color = INK } = {}) => page.drawText(safe(str), { x, y, size, font: f, color });
  const rightText = (str, xRight, size, opts = {}) =>
    text(str, xRight - (opts.f ?? font).widthOfTextAtSize(safe(str), size), size, opts);
  const ensureRoom = (needed) => {
    if (y - needed < MARGIN + 40) {
      page = pdf.addPage(A4);
      y = A4[1] - MARGIN;
    }
  };

  // --- header ---
  if (logo) page.drawImage(logo, { x: MARGIN, y: y - 34, width: 38, height: 38 });
  const brandX = MARGIN + (logo ? 48 : 0);
  y -= 14;
  text(SITE.name, brandX, 16, { f: bold, color: BRAND });
  y -= 16;
  text("Software development · Data · Cloud", brandX, 9, { color: MUTED });
  y += 30;
  rightText("PROJECT ESTIMATE", MARGIN + width, 15, { f: bold });
  y -= 16;
  rightText(quote.reference, MARGIN + width, 10, { color: MUTED });
  y -= 30;
  page.drawLine({ start: { x: MARGIN, y }, end: { x: MARGIN + width, y }, thickness: 1, color: RULE });
  y -= 24;

  // --- meta: prepared for | details ---
  const created = quote.createdAt;
  const validUntil = new Date(created.getTime() + VALID_DAYS * 24 * 60 * 60 * 1000);
  const left = [
    ["Prepared for", [contact.name, contact.company, contact.email].filter(Boolean)],
  ];
  const right = [
    ["Date", formatDate(created)],
    ["Valid until", formatDate(validUntil)],
    ["Build level", quote.buildLevelLabel],
  ];
  const metaTop = y;
  if (left[0][1].length) {
    text("PREPARED FOR", MARGIN, 8, { f: bold, color: MUTED });
    y -= 14;
    for (const line of left[0][1]) { text(line, MARGIN, 10); y -= 13; }
  }
  const leftBottom = y;
  y = metaTop;
  const colX = MARGIN + width / 2 + 10;
  for (const [label, value] of right) {
    text(label, colX, 9, { color: MUTED });
    rightText(value, MARGIN + width, 9, { f: bold });
    y -= 14;
  }
  y = Math.min(y, leftBottom) - 18;

  // --- line items ---
  page.drawRectangle({ x: MARGIN, y: y - 6, width, height: 20, color: PANEL });
  text("SERVICE", MARGIN + 8, 8, { f: bold, color: MUTED });
  rightText("STARTING FROM", MARGIN + width - 8, 8, { f: bold, color: MUTED });
  y -= 26;
  const detailWidth = width - 160;
  for (const item of quote.items) {
    const details = wrap(safe(item.details), font, 9, detailWidth);
    ensureRoom(22 + details.length * 12);
    text(item.name, MARGIN + 8, 11, { f: bold });
    rightText(`${money(item.from)}${item.monthly ? " / month" : ""}`, MARGIN + width - 8, 11, { f: bold });
    y -= 14;
    for (const line of details) { text(line, MARGIN + 8, 9, { color: MUTED }); y -= 12; }
    y -= 6;
    page.drawLine({ start: { x: MARGIN, y: y + 4 }, end: { x: MARGIN + width, y: y + 4 }, thickness: 0.5, color: RULE });
    y -= 8;
  }

  // --- totals ---
  const totals = [];
  if (quote.projectFrom > 0) totals.push(["Estimated project investment", `from ${money(quote.projectFrom)}`]);
  if (quote.monthlyFrom > 0) totals.push(["Ongoing support", `from ${money(quote.monthlyFrom)} / month`]);
  if (quote.weeksFrom > 0) totals.push(["Typical timeline", `from ${quote.weeksFrom} week${quote.weeksFrom === 1 ? "" : "s"}`]);
  const boxHeight = 16 + totals.length * 20;
  ensureRoom(boxHeight + 20);
  y -= 4;
  page.drawRectangle({ x: MARGIN, y: y - boxHeight + 12, width, height: boxHeight, color: PANEL, borderColor: BRAND, borderWidth: 1 });
  y -= 6;
  for (const [label, value] of totals) {
    text(label, MARGIN + 12, 11);
    rightText(value, MARGIN + width - 12, 12, { f: bold, color: BRAND });
    y -= 20;
  }
  y -= 18;

  // --- notes ---
  const notes = [
    ["About this estimate", `These are indicative "starting from" prices in ${quote.currency}, not a fixed quote. The final price depends on your detailed requirements, design, integrations and timeline, and is agreed in writing after a free discovery call.${quote.currency !== "USD" ? " Amounts are approximate, based on the exchange rate on the date above." : ""}`],
    ["Next steps", `Reply to the email this came with, or contact us at ${CONTACT.email} or ${CONTACT.telephone}, quoting ${quote.reference}. We'll set up a short call to understand your project and send a detailed proposal.`],
  ];
  for (const [heading, body] of notes) {
    const lines = wrap(safe(body), font, 9.5, width);
    ensureRoom(18 + lines.length * 13);
    text(heading, MARGIN, 10, { f: bold });
    y -= 14;
    for (const line of lines) { text(line, MARGIN, 9.5, { color: MUTED }); y -= 13; }
    y -= 10;
  }

  // --- footer on every page ---
  const footer = safe(`${SITE.name}  ·  ${SITE.url.replace(/^https?:\/\//, "")}  ·  ${CONTACT.email}  ·  ${CONTACT.telephone}`);
  for (const p of pdf.getPages()) {
    p.drawLine({ start: { x: MARGIN, y: MARGIN + 14 }, end: { x: MARGIN + width, y: MARGIN + 14 }, thickness: 0.5, color: RULE });
    p.drawText(footer, { x: MARGIN + (width - font.widthOfTextAtSize(footer, 8)) / 2, y: MARGIN, size: 8, font, color: MUTED });
  }

  return pdf.save();
}
