// Build validation. No dependencies. Run: npm test  (builds dist/ first, then runs this file).
// Checks the generated site in dist/ against invariants the project documents (README, PRD, privacy notice).
// Set SITE_ORIGIN when building to also assert canonical/hreflang/sitemap output.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import L, { projects, products } from '../src/content.mjs';

const site = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(site, 'dist');
const LOCALES = ['en', 'ar'];
const ROUTES = ['', 'about', 'services', 'services/think-design', 'services/build-connect', 'services/support-continuity',
  'products', ...(projects.some((p) => p.publish) ? ['projects'] : []), 'how-we-work', 'your-next-stage', 'contact', 'privacy'];

assert.ok(existsSync(join(dist, 'index.html')), 'dist/ not found: run `npm run build` first (or use `npm test`)');

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const rel = (p) => p.slice(dist.length).replace(/\\/g, '/');
const htmlFiles = walk(dist).filter((f) => f.endsWith('.html'));
const pages = new Map(htmlFiles.map((f) => [rel(f), readFileSync(f, 'utf8')]));
const localized = [...pages].filter(([p]) => /^\/(en|ar)\//.test(p));        // /en/**, /ar/** incl. 404
const content = [...pages].filter(([p]) => p !== '/index.html');             // root redirect page has no H1/description by design
const strip = (h) => h.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');

test('every expected page exists in both locales, plus 404s and root', () => {
  const expected = [
    '/index.html', '/404.html',
    ...LOCALES.flatMap((l) => [`/${l}/404.html`, ...ROUTES.map((r) => `/${l}/${r}${r ? '/' : ''}index.html`)]),
  ];
  const missing = expected.filter((p) => !pages.has(p));
  assert.deepEqual(missing, [], `missing pages: ${missing.join(', ')}`);
});

test('locale content has identical structure in English and Arabic', () => {
  const keys = (o, p = '') => Array.isArray(o) ? [`${p}[${o.length}]`] : o && typeof o === 'object' ? Object.keys(o).flatMap((k) => keys(o[k], `${p}.${k}`)) : [p];
  const en = new Set(keys(L.en)), ar = new Set(keys(L.ar));
  assert.deepEqual([...en].filter((k) => !ar.has(k)), [], 'keys only in EN');
  assert.deepEqual([...ar].filter((k) => !en.has(k)), [], 'keys only in AR');
});

test('each page has exactly one H1, a title and a description', () => {
  const bad = [];
  for (const [p, h] of content) {
    const h1 = (h.match(/<h1[\s>]/g) || []).length;
    if (h1 !== 1) bad.push(`${p}: ${h1} h1`);
    if (!/<title>[^<]+<\/title>/.test(h)) bad.push(`${p}: no title`);
    if (!/<meta name="description" content="[^"]+"/.test(h) && !/\/404\.html$/.test(p)) bad.push(`${p}: no description`);
  }
  assert.deepEqual(bad, []);
});

test('titles are unique across indexable pages', () => {
  const seen = new Map();
  for (const [p, h] of content) {
    if (/\/404\.html$/.test(p)) continue;
    const t = h.match(/<title>([^<]+)<\/title>/)[1];
    seen.set(t, [...(seen.get(t) || []), p]);
  }
  const dups = [...seen].filter(([, v]) => v.length > 1);
  assert.deepEqual(dups, []);
});

test('localized pages set lang and dir to match their locale', () => {
  const bad = [];
  for (const [p, h] of localized) {
    const loc = p.split('/')[1];
    const want = `<html lang="${loc}" dir="${loc === 'ar' ? 'rtl' : 'ltr'}">`;
    if (!h.includes(want)) bad.push(p);
  }
  assert.deepEqual(bad, []);
});

test('every <img> has an alt attribute', () => {
  const bad = [];
  for (const [p, h] of pages) for (const m of h.matchAll(/<img\b[^>]*>/g)) if (!/\balt=/.test(m[0])) bad.push(`${p}: ${m[0].slice(0, 60)}`);
  assert.deepEqual(bad, []);
});

test('internal links and assets resolve, including #fragment targets', () => {
  const bad = [];
  for (const [p, h] of pages) {
    for (const m of h.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      const u = m[1];
      if (/^(https?:|mailto:|tel:|data:|javascript:)/.test(u)) continue;
      const [pathPart, frag] = u.split('#');
      const clean = pathPart.split('?')[0];
      let target = p;                                                   // fragment-only link: same page
      if (clean) {
        const abs = clean.startsWith('/') ? join(dist, clean) : resolve(dirname(join(dist, p)), clean);
        const file = existsSync(abs) && statSync(abs).isFile() ? abs : join(abs, 'index.html');
        if (!existsSync(file)) { bad.push(`${p} -> ${u}`); continue; }
        target = rel(file);
      }
      if (frag && pages.has(target) && !new RegExp(`\\bid="${frag}"`).test(pages.get(target))) bad.push(`${p} -> ${u} (no #${frag})`);
    }
  }
  assert.deepEqual([...new Set(bad)], []);
});

test('no third-party requests (privacy notice: fonts and scripts are served from this site)', () => {
  const bad = [];
  // <link rel="canonical|alternate"> are metadata pointers, not requests; every other external reference is a third-party load.
  const metaLink = /\brel="(?:canonical|alternate)"/;
  for (const [p, h] of pages) for (const m of h.matchAll(/<(?:script|link|img|video|source|iframe)\b[^>]*>/g)) {
    if (m[0].startsWith('<link') && metaLink.test(m[0])) continue;
    const u = m[0].match(/\b(?:src|href)="(https?:[^"]+)"/);
    if (u) bad.push(`${p}: ${u[1]}`);
  }
  for (const f of walk(dist).filter((x) => /\.(css|js)$/.test(x))) {
    const s = readFileSync(f, 'utf8');
    if (/url\(\s*['"]?https?:/.test(s) || /@import\s+(url\()?['"]?https?:/.test(s)) bad.push(`${rel(f)}: external url()/@import`);
  }
  assert.deepEqual(bad, []);
});

test('no placeholder, demo or sample content in the production build', () => {
  const pattern = /demo-banner|sample-tag|Sample quote|Partner \d\b|lorem ipsum|\[INSERT|TODO|TBD\b/i;
  const bad = [];
  for (const [p, h] of pages) { const m = strip(h).match(pattern); if (m) bad.push(`${p}: ${m[0]}`); }
  assert.deepEqual(bad, []);
});

test('entries marked publish:false do not appear anywhere in the output', () => {
  const hidden = [...projects, ...products].filter((x) => x.publish === false);
  const names = hidden.flatMap((x) => [x.name?.en, x.name?.ar].filter(Boolean));
  const bad = [];
  for (const [p, h] of pages) for (const n of names) if (strip(h).includes(n)) bad.push(`${p}: "${n}"`);
  assert.deepEqual(bad, []);
});

test('JSON-LD parses and describes the organisation', () => {
  for (const loc of LOCALES) {
    const h = pages.get(`/${loc}/index.html`);
    const m = h.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert.ok(m, `${loc}: JSON-LD missing`);
    const ld = JSON.parse(m[1]);
    assert.equal(ld['@type'], 'Organization');
    assert.equal(ld.name, 'Waw Circles Technologies FZE LLC');
  }
});

test('contact form page: honeypot present and runtime config is well-formed', () => {
  for (const loc of LOCALES) {
    const h = pages.get(`/${loc}/contact/index.html`);
    assert.match(h, /data-form\b/);
    assert.match(h, /name="website"/);
    assert.match(h, /name="name"[^>]*required/);
    assert.match(h, /name="email"[^>]*required/);
    assert.match(h, /name="message"[^>]*required/);
  }
  const cfg = readFileSync(join(dist, 'assets/js/config.js'), 'utf8');
  const m = cfg.match(/^window\.WAW_CONFIG=(\{.*\});?\s*$/);
  assert.ok(m, 'config.js format changed');
  const c = JSON.parse(m[1]);
  assert.equal(typeof c.endpoint, 'string');
  assert.match(c.email, /^[^@\s]+@[^@\s]+\.[^@\s]+$/);
});

test('SEO output is consistent with SITE_ORIGIN', () => {
  const origin = (process.env.SITE_ORIGIN || '').replace(/\/$/, '');
  const home = pages.get('/en/index.html');
  if (!origin) {
    assert.ok(!home.includes('rel="canonical"'), 'canonical emitted without SITE_ORIGIN');
    assert.ok(!existsSync(join(dist, 'sitemap.xml')) && !existsSync(join(dist, 'robots.txt')));
    return;
  }
  assert.ok(home.includes(`<link rel="canonical" href="${origin}/en/">`));
  assert.ok(home.includes(`hreflang="ar" href="${origin}/ar/"`));
  const sm = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
  assert.equal((sm.match(/<loc>/g) || []).length, LOCALES.length * ROUTES.length);
  assert.match(readFileSync(join(dist, 'robots.txt'), 'utf8'), /Sitemap: /);
});
