// Heading hierarchy (WCAG 1.3.1 / best practice): every content page has exactly one h1, starts with it, and never
// skips a level downwards (h1 -> h3). Inspects the GENERATED html in dist/ (run after a build; `npm test` builds first),
// plus a temp build with a project published to cover the dormant Projects template.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync, mkdtempSync, cpSync, rmSync, writeFileSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const site = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(site, 'dist');
assert.ok(existsSync(join(dist, 'index.html')), 'dist/ not found: run `npm run build` first (or use `npm test`)');

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const rel = (root, p) => relative(root, p).split(sep).join('/');
const strip = (h) => h.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
const headings = (html) => [...strip(html).matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/g)]
  .map((m) => ({ level: Number(m[1]), text: m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() }));
const pagesIn = (root) => walk(root).filter((f) => f.endsWith('.html')).map((f) => [rel(root, f), readFileSync(f, 'utf8')]);
const outline = (hs) => hs.map((h) => `h${h.level}`).join(' ');

// Defects in a heading list: no h1 / several h1 / first heading not h1 / empty heading / skipped level when going deeper.
function defects(hs) {
  const d = [];
  const h1s = hs.filter((h) => h.level === 1).length;
  if (h1s !== 1) d.push(`${h1s} h1 elements`);
  if (hs.length && hs[0].level !== 1) d.push(`first heading is h${hs[0].level}`);
  hs.forEach((h, i) => {
    if (!h.text) d.push(`empty h${h.level}`);
    if (i > 0 && h.level - hs[i - 1].level > 1) d.push(`h${hs[i - 1].level} -> h${h.level} at "${h.text.slice(0, 40)}"`);
  });
  return d;
}

// The root /index.html is a noindex language chooser/redirect with no content heading by design (reported separately, not changed).
const isRoot = (p) => p === 'index.html';
const content = pagesIn(dist).filter(([p]) => !isRoot(p));

test('every localized page has exactly one h1, starts with it, and skips no heading level', () => {
  assert.ok(content.length >= 22, `expected the full page set, got ${content.length}`);
  const bad = [];
  for (const [p, h] of content) { const d = defects(headings(h)); if (d.length) bad.push(`${p}: ${d.join('; ')}  [${outline(headings(h))}]`); }
  assert.deepEqual(bad, []);
});

test('How we work, Products and Your next stage: card titles are h2 directly under the page h1 (EN and AR)', () => {
  for (const loc of ['en', 'ar']) {
    for (const [route, minCards] of [['how-we-work', 4], ['products', 3], ['your-next-stage', 3]]) {
      const hs = headings(readFileSync(join(dist, loc, route, 'index.html'), 'utf8'));
      assert.equal(hs[0].level, 1, `${loc}/${route}`);
      assert.equal(hs[1].level, 2, `${loc}/${route}: first heading after h1 must be h2, got h${hs[1].level} "${hs[1].text}"`);
      const cards = hs.slice(1, 1 + minCards);
      assert.ok(cards.every((h) => h.level === 2), `${loc}/${route}: card titles must be h2`);
    }
  }
});

test('card titles use the markup shapes the h2 style overrides target (so the h2 look matches the h3 look)', () => {
  const css = readFileSync(join(dist, 'assets', 'css', 'style.css'), 'utf8');
  for (const sel of ['.sec .step > h2', '.sec .card.path > h2', '.sec .card.prod > h2', ':lang(ar) .sec .step > h2']) {
    assert.ok(css.includes(sel), `style.css lacks override "${sel}"`);
  }
  for (const loc of ['en', 'ar']) {
    const how = readFileSync(join(dist, loc, 'how-we-work', 'index.html'), 'utf8');
    assert.equal((how.match(/<li class="step"><span class="step-n"[^>]*>\d+<\/span><h2>/g) || []).length, 4, `${loc}: step titles`);
    const stage = readFileSync(join(dist, loc, 'your-next-stage', 'index.html'), 'utf8');
    assert.equal((stage.match(/<li class="card path [^"]*"[^>]*><span class="badge">[^<]*<\/span><h2>/g) || []).length, 3, `${loc}: pathway titles`);
    const prods = readFileSync(join(dist, loc, 'products', 'index.html'), 'utf8');
    assert.equal((prods.match(/<li class="card prod[^"]*"><div class="card-media">[\s\S]*?<\/div><h2>/g) || []).length, 3, `${loc}: product titles`);
  }
});

test('home page keeps its structure: h1, then section h2s with h3 card titles', () => {
  for (const loc of ['en', 'ar']) {
    const hs = headings(readFileSync(join(dist, loc, 'index.html'), 'utf8'));
    assert.deepEqual(defects(hs), []);
    assert.equal(hs[1].level, 2);
    assert.ok(hs.filter((h) => h.level === 3).length >= 20, `${loc}: home card titles should remain h3`);
  }
});

test('the root redirect page is the only content-less exception and is noindex', () => {
  const root = readFileSync(join(dist, 'index.html'), 'utf8');
  assert.equal(headings(root).length, 0);
  assert.match(root, /<meta name="robots" content="noindex">/);
  assert.match(root, /http-equiv="refresh"/);
});

test('Projects template (dormant while no project is published): h1 then h2 card titles, no skipped level', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'waw-headings-'));
  try {
    const w = join(tmp, 'website');
    cpSync(join(site, 'src'), join(w, 'src'), { recursive: true });
    cpSync(join(site, '..', 'waw-white.svg'), join(tmp, 'waw-white.svg'));
    const f = join(w, 'src', 'content.mjs');
    const src = readFileSync(f, 'utf8');
    const start = src.indexOf('export const projects = [');
    assert.ok(start > -1, 'projects array not found');
    const patched = src.slice(0, start) + src.slice(start).replace(/publish: false/, 'publish: true');
    assert.notEqual(patched, src, 'no project to publish in the temp copy');
    writeFileSync(f, patched);
    const r = spawnSync(process.execPath, [join(w, 'src', 'build.mjs')], { cwd: w, encoding: 'utf8', env: { ...process.env, SITE_ORIGIN: '' } });
    assert.equal(r.status, 0, r.stderr);
    for (const loc of ['en', 'ar']) {
      const file = join(w, 'dist', loc, 'projects', 'index.html');
      assert.ok(existsSync(file), `${loc}: projects page not generated in temp build`);
      const hs = headings(readFileSync(file, 'utf8'));
      assert.deepEqual(defects(hs), [], `${loc}/projects [${outline(hs)}]`);
      assert.equal(hs[1].level, 2, `${loc}: project titles must be h2`);
    }
  } finally { rmSync(tmp, { recursive: true, force: true }); }
});
