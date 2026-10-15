// One-off: downloads Space Grotesk + Cairo (variable, Google Fonts, OFL) and writes a local fonts.css.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'assets');
const api = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400..700&family=Cairo:wght@400..700&display=swap';
const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36';
const css = await (await fetch(api, { headers: { 'user-agent': ua } })).text();
mkdirSync(join(root, 'fonts'), { recursive: true });
let out = '', i = 0;
for (const block of css.match(/\/\*[^*]+\*\/\s*@font-face\s*\{[^}]+\}/g)) {
  const subset = block.match(/\/\*\s*([\w-]+)\s*\*\//)[1];
  if (!['latin', 'latin-ext', 'arabic'].includes(subset)) continue;
  const family = block.match(/font-family:\s*'([^']+)'/)[1];
  const url = block.match(/url\(([^)]+)\)/)[1];
  const file = `${family.toLowerCase().replace(/\s+/g, '-')}-${subset}.woff2`;
  writeFileSync(join(root, 'fonts', file), Buffer.from(await (await fetch(url)).arrayBuffer()));
  out += block.replace(/\/\*[^*]+\*\/\s*/, '').replace(/url\([^)]+\)/, `url(../fonts/${file})`).replace(/font-weight:\s*\d+/, 'font-weight: 400 700') + '\n';
  i++;
}
writeFileSync(join(root, 'css', 'fonts.css'), out);
console.log('wrote', i, 'font faces');
