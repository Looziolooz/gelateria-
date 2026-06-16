// Produces an ordered structural outline of a saved page's MAIN content,
// so we can rebuild it 1:1. Usage: node scripts/outline.mjs <name>
import { readFile } from "node:fs/promises";

const name = process.argv[2] || "home";
let html = await readFile(`docs/research/raw/${name}.html`, "utf8");

// Strip scripts/styles/noscript/svg
html = html.replace(/<script[\s\S]*?<\/script>/gi, "")
           .replace(/<style[\s\S]*?<\/style>/gi, "")
           .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
           .replace(/<svg[\s\S]*?<\/svg>/gi, "[svg]");

// Slice main content: from first MainContent / <main to <footer
const startM = html.search(/id=["']MainContent["']|<main[\s>]/i);
const endM = html.search(/<footer[\s>]/i);
let main = startM >= 0 ? html.slice(startM, endM > startM ? endM : undefined) : html;

const out = [];
// Tokenize tags and text
const re = /<(\/?)([a-zA-Z0-9]+)([^>]*?)\/?>|([^<]+)/g;
let depthSection = 0;
let m;
function attr(s, a) {
  const r = new RegExp(a + '=["\\\']([^"\\\']*)["\\\']', "i").exec(s);
  return r ? r[1] : "";
}
let lastText = "";
while ((m = re.exec(main))) {
  if (m[4] != null) {
    const t = m[4].replace(/\s+/g, " ").trim();
    if (t && t.length > 1) { out.push("  " + t.slice(0, 600)); }
    continue;
  }
  const closing = m[1] === "/";
  const tag = m[2].toLowerCase();
  const attrs = m[3] || "";
  const cls = attr(attrs, "class");
  if (tag === "img") {
    const src = attr(attrs, "src") || attr(attrs, "data-src") || attr(attrs, "data-srcset").split(" ")[0];
    out.push(`[IMG] ${src.replace(/\?.*/, "")}  alt="${attr(attrs, "alt")}"`);
  } else if (tag === "section" && !closing) {
    out.push(`\n=== SECTION class="${cls}" ===`);
  } else if ((tag === "h1" || tag === "h2" || tag === "h3" || tag === "h4") && !closing) {
    out.push(`[${tag.toUpperCase()}] class="${cls}"`);
  } else if (!closing && /\b(title|main-title|claim|lbl|subtitle|eyebrow|btn|cta|hero|block|row|col-|d-g)\b/.test(cls)) {
    out.push(`[DIV class="${cls}"]`);
  } else if (tag === "a" && !closing) {
    const href = attr(attrs, "href");
    out.push(`[LINK href="${href}"]`);
  }
}
console.log(out.join("\n"));
