// Conservative purge of unused selectors in theme-utils.css.
//
// Safety model: a rule is removed ONLY when every comma-separated selector is a
// pure simple-class selector (".a", ".a .b", ".a.b" — no element/pseudo/
// attribute parts) AND none of those class names appear anywhere in the source.
// Rules with :root, element selectors, pseudos, attributes, or inside
// @keyframes are always kept. Class names are matched as exact tokens against
// the whole src corpus (the codebase builds no atomic class names dynamically),
// so a class that is used anywhere is always kept. Over-keeping is fine; the
// only thing we ever drop is provably-absent classes. Run from project root:
//   node scripts/purge-css.mjs
import postcss from "postcss";
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const CSS_PATH = "src/app/theme-utils.css";

// 1) Collect every identifier-like token used anywhere in the source (minus the
//    file being purged, which would otherwise mark all its own classes "used").
const TOKEN_RE = /[A-Za-z_][A-Za-z0-9_-]*/g;
const used = new Set();
function collect(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) {
      collect(p);
    } else if (/\.(tsx?|jsx?|css)$/.test(entry)) {
      if (p.replace(/\\/g, "/").endsWith(CSS_PATH)) continue;
      const txt = readFileSync(p, "utf8");
      const m = txt.match(TOKEN_RE);
      if (m) for (const t of m) used.add(t);
    }
  }
}
collect("src");

// 2) Walk the stylesheet.
const root = postcss.parse(readFileSync(CSS_PATH, "utf8"));
const PURE_CLASS = /^\s*\.[A-Za-z0-9_-]+(\s*[>+~]?\s*\.[A-Za-z0-9_-]+)*\s*$/;
let kept = 0;
let dropped = 0;

root.walkRules((rule) => {
  const parent = rule.parent;
  if (parent && parent.type === "atrule" && /keyframes/i.test(parent.name)) {
    kept++;
    return;
  }
  let keep = false;
  for (const sel of rule.selectors) {
    if (!PURE_CLASS.test(sel)) {
      keep = true; // element / pseudo / attribute / :root → always keep
      break;
    }
    const classes = sel.match(/\.[A-Za-z0-9_-]+/g).map((c) => c.slice(1));
    if (classes.some((c) => used.has(c))) {
      keep = true;
      break;
    }
  }
  if (keep) kept++;
  else {
    rule.remove();
    dropped++;
  }
});

// 3) Drop any @media/@supports blocks left empty by the purge.
root.walkAtRules((at) => {
  if (at.nodes && at.nodes.length === 0) at.remove();
});

const before = readFileSync(CSS_PATH, "utf8").length;
const out = root.toString();
writeFileSync(CSS_PATH, out);

// 4) Smoke-check: a handful of classes we KNOW are used must survive.
const MUST_KEEP = ["b-primary", "c-white", "caviar", "t-u", "hs-track", "fs-120"];
const missing = MUST_KEEP.filter((c) => !new RegExp(`\\.${c}\\b`).test(out));
console.log(`rules kept: ${kept}  dropped: ${dropped}`);
console.log(`size: ${(before / 1024).toFixed(1)}KB -> ${(out.length / 1024).toFixed(1)}KB`);
console.log(missing.length ? `!! MISSING expected classes: ${missing.join(", ")}` : "smoke-check OK: critical classes retained");
