// Renders the two new blog covers (1600x900 PNG) in the style of the existing
// seed covers: warm dark gradient, faint grid, glowing shapes, no text.
// Usage: node scripts/seed/make-blog-covers.cjs   (from the project root)
// Add a new cover by writing its SVG below; the file name must match the post slug.
const path = require("path");
const { createRequire } = require("module");
const project = process.argv[2] ?? process.cwd();
const sharp = createRequire(path.join(project, "package.json"))("sharp");
const out = path.join(project, "scripts/seed/blog-covers");

const W = 1600, H = 900;
const base = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#160f0c"/><stop offset="1" stop-color="#3a1f14"/>
    </linearGradient>
    <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
      <path d="M80 0H0V80" fill="none" stroke="#ffffff" stroke-opacity="0.035" stroke-width="1"/>
    </pattern>
    <filter id="glow" filterUnits="userSpaceOnUse" x="0" y="0" width="1600" height="900">
      <feGaussianBlur stdDeviation="10" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  ${inner}
</svg>`;

// a phone outline with a few interface bars inside
const phone = (x, y, w, h, color, bars = true) => {
  const r = w * 0.16;
  const inner = bars
    ? [0.18, 0.3, 0.42].map((t, i) => `<rect x="${x + w * 0.14}" y="${y + h * t}" width="${w * (i === 0 ? 0.72 : 0.52 - i * 0.06)}" height="${h * 0.05}" rx="${h * 0.025}" fill="${color}" fill-opacity="${0.75 - i * 0.18}"/>`).join("") +
      `<rect x="${x + w * 0.14}" y="${y + h * 0.56}" width="${w * 0.72}" height="${h * 0.24}" rx="${w * 0.06}" fill="${color}" fill-opacity="0.18" stroke="${color}" stroke-opacity="0.5"/>`
    : "";
  return `<g filter="url(#glow)">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${color}" fill-opacity="0.06" stroke="${color}" stroke-width="5"/>
    <rect x="${x + w * 0.38}" y="${y + h * 0.04}" width="${w * 0.24}" height="${h * 0.018}" rx="${h * 0.009}" fill="${color}" fill-opacity="0.8"/>
  </g>${inner}`;
};

// Cover 1: one point branching into three phones (React Native, Flutter, native)
const blue = "#0ea5e9", teal = "#14b8a6", orange = "#f97316";
const origin = [300, 450];
const targets = [[900, 200, blue], [1020, 450, teal], [900, 700, orange]];
const branches = targets.map(([tx, ty, c]) =>
  `<path d="M${origin[0]} ${origin[1]} C ${origin[0] + 260} ${origin[1]}, ${tx - 320} ${ty}, ${tx} ${ty}" fill="none" stroke="${c}" stroke-width="4" stroke-opacity="0.8" filter="url(#glow)"/>`).join("");
const phones1 = [
  phone(900, 75, 150, 250, blue),
  phone(1020, 325, 150, 250, teal),
  phone(900, 575, 150, 250, orange),
];
const cover1 = base(`
  <circle cx="1000" cy="450" r="320" fill="${teal}" fill-opacity="0.08" filter="url(#soft)"/>
  ${branches}
  ${phones1.join("")}
  <circle cx="${origin[0]}" cy="${origin[1]}" r="26" fill="#ffffff" filter="url(#glow)"/>
  <circle cx="${origin[0]}" cy="${origin[1]}" r="70" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="3"/>
`);

// Cover 2: blocks of different sizes stacked inside a phone outline, two still falling in
const colors = ["#f97316", "#facc15", "#0ea5e9", "#ec4899", "#14b8a6"];
const px = 600, py = 110, pw = 400, ph = 700;
const block = (x, y, w, h, c) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${c}" fill-opacity="0.85" filter="url(#glow)"/>`;
const floor = py + ph - 70;
const stack = [
  [px + 50, floor - 110, 300, 100, colors[2]],
  [px + 50, floor - 230, 140, 110, colors[0]],
  [px + 200, floor - 230, 150, 110, colors[3]],
  [px + 50, floor - 330, 190, 90, colors[1]],
  [px + 250, floor - 330, 100, 90, colors[4]],
  [px + 50, floor - 420, 100, 80, colors[3]],
];
const falling = [
  [px + 170, py + 90, 120, 80, colors[0], -8],
  [1150, 260, 90, 90, colors[1], 14],
  [400, 330, 110, 70, colors[4], -12],
];
const cover2 = base(`
  <circle cx="800" cy="520" r="360" fill="#f97316" fill-opacity="0.07" filter="url(#soft)"/>
  ${stack.map(([x, y, w, h, c]) => block(x, y, w, h, c)).join("")}
  ${falling.map(([x, y, w, h, c, a]) => `<g transform="rotate(${a} ${x + w / 2} ${y + h / 2})" opacity="0.9">${block(x, y, w, h, c)}</g>`).join("")}
  ${phone(px, py, pw, ph, "#ffffff", false)}
`);

// Cover 3: a solid glowing core (the MVP) inside the dashed outline of the full product
const pink = "#ec4899", yellow = "#facc15";
const ring = (r, c, dash, op) => `<circle cx="800" cy="450" r="${r}" fill="none" stroke="${c}" stroke-width="4" stroke-opacity="${op}" stroke-dasharray="${dash}"/>`;
const modules = [[-1, -1], [1, -1], [-1, 1], [1, 1], [0, -1.45], [0, 1.45], [-1.45, 0], [1.45, 0]].map(([dx, dy], i) => {
  const x = 800 + dx * 210, y = 450 + dy * 210, s = i < 4 ? 90 : 64;
  return `<rect x="${x - s / 2}" y="${y - s / 2}" width="${s}" height="${s}" rx="16" fill="none" stroke="${[blue, teal, orange, yellow][i % 4]}" stroke-width="4" stroke-opacity="0.55" stroke-dasharray="14 12"/>`;
});
const cover3 = base(`
  <circle cx="800" cy="450" r="300" fill="${pink}" fill-opacity="0.08" filter="url(#soft)"/>
  ${ring(380, "#ffffff", "4 14", 0.25)}
  ${ring(280, "#ffffff", "18 16", 0.35)}
  ${modules.join("")}
  <rect x="725" y="375" width="150" height="150" rx="28" fill="${pink}" fill-opacity="0.9" filter="url(#glow)"/>
  <rect x="757" y="407" width="86" height="86" rx="16" fill="#ffffff" fill-opacity="0.85"/>
`);

// Cover 4: scattered sources flowing into one warehouse, then into a chart
const sources = [[260, 170, orange], [180, 360, yellow], [300, 520, pink], [200, 720, blue], [420, 300, teal], [430, 640, orange]];
const wx = 820, wy = 450;
const flows = sources.map(([x, y, c]) =>
  `<path d="M${x} ${y} C ${x + 220} ${y}, ${wx - 260} ${wy + (y - wy) * 0.15}, ${wx - 110} ${wy + (y - wy) * 0.15}" fill="none" stroke="${c}" stroke-width="3" stroke-opacity="0.7" filter="url(#glow)"/>
   <circle cx="${x}" cy="${y}" r="16" fill="${c}" filter="url(#glow)"/>`).join("");
const cylinder = `<g filter="url(#glow)" stroke="#ffffff" stroke-width="4" fill="#ffffff" fill-opacity="0.06">
    <path d="M${wx - 110} ${wy - 120} V ${wy + 120} A 110 34 0 0 0 ${wx + 110} ${wy + 120} V ${wy - 120}"/>
    <ellipse cx="${wx}" cy="${wy - 120}" rx="110" ry="34"/>
    <path d="M${wx - 110} ${wy - 40} A 110 34 0 0 0 ${wx + 110} ${wy - 40} M${wx - 110} ${wy + 40} A 110 34 0 0 0 ${wx + 110} ${wy + 40}" fill="none" stroke-opacity="0.5"/>
  </g>`;
const bars = [[1180, 0.45, teal], [1260, 0.7, blue], [1340, 0.55, yellow], [1420, 0.9, pink]].map(([x, t, c]) =>
  `<rect x="${x}" y="${640 - 360 * t}" width="54" height="${360 * t}" rx="10" fill="${c}" fill-opacity="0.85" filter="url(#glow)"/>`).join("");
const cover4 = base(`
  <circle cx="${wx}" cy="${wy}" r="320" fill="${blue}" fill-opacity="0.07" filter="url(#soft)"/>
  ${flows}
  <path d="M${wx + 120} ${wy} H 1150" stroke="#ffffff" stroke-width="4" stroke-opacity="0.6" stroke-dasharray="10 10"/>
  ${cylinder}
  <path d="M1160 660 H 1500" stroke="#ffffff" stroke-width="3" stroke-opacity="0.4"/>
  ${bars}
`);

(async () => {
  for (const [name, svg] of [
    ["react-native-vs-flutter-vs-native", cover1],
    ["how-much-does-a-mobile-app-cost", cover2],
    ["mvp-or-production-grade", cover3],
    ["data-engineering-vs-data-science", cover4],
  ]) {
    await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(path.join(out, `${name}.png`));
    console.log("wrote", name);
  }
})();
