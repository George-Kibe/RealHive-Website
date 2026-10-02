import { BUILD_LEVELS, SERVICE_BY_ID } from "@/lib/quote/catalog";

/**
 * Validating and describing a visitor's choices. Client-safe: no prices.
 * The quote page uses it for instant validation messages, the server uses it
 * to clean untrusted input before pricing.
 */

const optionsOf = (field) => new Map(field.options.map((o) => [o.id, o]));

/**
 * Keep only valid choices from untrusted input:
 *   { buildLevel: "mvp" | "production", services: { [serviceId]: { [fieldKey]: id | id[] } } }
 * Returns { selection, errors }. A service with a missing required field is an error.
 */
export function normalizeSelection(raw = {}) {
  const errors = [];
  const buildLevel = raw.buildLevel in BUILD_LEVELS ? raw.buildLevel : "mvp";
  const services = {};
  for (const [serviceId, rawSel] of Object.entries(raw.services ?? {})) {
    const service = SERVICE_BY_ID[serviceId];
    if (!service || !rawSel || typeof rawSel !== "object") continue;
    const sel = {};
    for (const field of service.fields) {
      const valid = optionsOf(field);
      const value = rawSel[field.key];
      if (field.type === "single") {
        if (typeof value === "string" && valid.has(value)) sel[field.key] = value;
      } else {
        const ids = Array.isArray(value) ? value.filter((id) => valid.has(id)) : [];
        // keep catalog order, so the PDF lists options consistently
        sel[field.key] = field.options.map((o) => o.id).filter((id) => ids.includes(id));
      }
      const missing = field.type === "single" ? !sel[field.key] : !sel[field.key].length;
      if (field.required && missing) errors.push(`${service.name}: choose ${field.label.toLowerCase().replace(/\?$/, "")}`);
    }
    services[serviceId] = sel;
  }
  if (!Object.keys(services).length) errors.push("Choose at least one service");
  return { selection: { buildLevel, services }, errors };
}

// Human summary of a service's choices, e.g. "Android & iOS · Cross-platform · Push notifications".
export function describe(service, sel) {
  const parts = [];
  for (const field of service.fields) {
    const options = optionsOf(field);
    const value = sel[field.key];
    const labels = (Array.isArray(value) ? value : value ? [value] : []).map((id) => options.get(id)?.label).filter(Boolean);
    if (labels.length) parts.push(labels.join(field.key === "platforms" ? " & " : ", "));
  }
  return parts.join(" · ");
}

