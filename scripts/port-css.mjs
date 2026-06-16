// Ports the original theme's common.css utility framework into the project,
// converting rem -> px (original uses a 10px root: 1rem = 10px) so it coexists
// with Tailwind's 16px root without changing the document font-size.
// Output: src/app/theme-utils.css
import { readFile, writeFile } from "node:fs/promises";

let css = await readFile("docs/research/css/common.css", "utf8");

// Strip source map comment
css = css.replace(/\/\*#\s*sourceMappingURL=[^*]*\*\//g, "");

// Convert every <number>rem to px (×10). rem only appears as a length unit here.
css = css.replace(/(-?\d*\.?\d+)rem\b/g, (_, n) => `${Math.round(parseFloat(n) * 10 * 1000) / 1000}px`);

// Drop the global element resets that would fight Tailwind/admin base styles.
// (Keep :root, .classes, @media, @font-face, @keyframes.)
// Remove top-level/media rules whose selector is exactly one of these globals.
const GLOBAL_SELECTORS = new Set(["*", "a", "a:hover", "body", "html", "html,body", "p", "img", "ul", "li", "button"]);

function stripGlobals(block) {
  let out = "";
  let i = 0;
  while (i < block.length) {
    // @media / @supports — recurse into inner block
    if (block[i] === "@") {
      const braceStart = block.indexOf("{", i);
      const atRule = block.slice(i, braceStart);
      if (/^@(font-face|keyframes|-webkit-keyframes)/i.test(atRule.trim())) {
        // keep verbatim — find matching brace
        const end = matchBrace(block, braceStart);
        out += block.slice(i, end + 1);
        i = end + 1;
        continue;
      }
      // media/supports: keep wrapper, strip inside
      const end = matchBrace(block, braceStart);
      const inner = block.slice(braceStart + 1, end);
      out += atRule + "{" + stripGlobals(inner) + "}";
      i = end + 1;
      continue;
    }
    const braceStart = block.indexOf("{", i);
    if (braceStart === -1) { out += block.slice(i); break; }
    const selector = block.slice(i, braceStart).trim();
    const end = matchBrace(block, braceStart);
    const isGlobal = selector
      .split(",")
      .map((s) => s.trim())
      .every((s) => GLOBAL_SELECTORS.has(s));
    if (!isGlobal || selector === ":root") {
      out += block.slice(i, end + 1);
    }
    i = end + 1;
  }
  return out;
}

function matchBrace(str, openIdx) {
  let depth = 0;
  for (let i = openIdx; i < str.length; i++) {
    if (str[i] === "{") depth++;
    else if (str[i] === "}") { depth--; if (depth === 0) return i; }
  }
  return str.length - 1;
}

const ported = "/* Ported from gelatocrema.com common.css (rem→px, globals stripped) */\n" + stripGlobals(css);
await writeFile("src/app/theme-utils.css", ported);
console.log("Wrote src/app/theme-utils.css:", ported.length, "bytes");
