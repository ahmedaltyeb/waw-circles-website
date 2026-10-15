// Release-quality checks on the generated site (run after a build; `npm test` builds first):
// no inline executable script or style (CSP-ready), root redirect behaviour, language tagging, decorative-image alt text,
// hero video loading rules, package metadata. No dependencies, no network.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const site = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(site, 'dist');
assert.ok(existsSync(join(dist, 'index.html')), 'dist/ not found: run `npm run build` first (or use `npm test`)');

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const rel = (p) => relative(dist, p).split(sep).join('/');
const pages = walk(dist).filter((f) => f.endsWith('.html')).map((f) => [rel(f), readFileSync(f, 'utf8')]);
const read = (p) => readFileSync(join(dist, p), 'utf8');
const src = (p) => readFileSync(join(site, 'src', 'assets', p), 'utf8');

// ---- CSP readiness: nothing inline that a strict policy (script-src 'self'; style-src 'self') would block
test('no inline executable script, style block or style attribute on any page (JSON-LD data blocks excepted)', () => {
  const bad = [];
  for (const [p, h] of pages) {
    for (const m of h.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
      const attrs = m[1];
      if (/type="application\/ld\+json"/.test(attrs)) continue;
      if (!/\bsrc="/.test(attrs) || m[2].trim()) bad.push(`${p}: inline <script>`);
    }
    if (/<style\b/i.test(h)) bad.push(`${p}: <style> block`);
    if (/\sstyle="/i.test(h)) bad.push(`${p}: style attribute`);
    if (/\son[a-z]+="/i.test(h.replace(/<script[\s\S]*?<\/script>/g, ''))) bad.push(`${p}: inline event handler`);
  }
  assert.deepEqual(bad, []);
});

test('every localized page loads the external boot script before the stylesheet-dependent content', () => {
  for (const [p, h] of pages.filter(([x]) => /^(en|ar)\//.test(x))) {
    assert.match(h, /<script src="[^"]*assets\/js\/boot\.js"><\/script>/, `${p}: boot.js`);
  }
});

function run(file, sandbox) { vm.runInNewContext(readFileSync(file, 'utf8'), sandbox); return sandbox; }

test('boot.js marks the document as script-enabled', () => {
  const added = [];
  run(join(site, 'src/assets/js/boot.js'), { document: { documentElement: { classList: { add: (c) => added.push(c) } } } });
  assert.deepEqual(added, ['js']);
});

// ---- root redirect
test('root index.html: external redirect script and stylesheet, no-JS fallback inside <noscript>, language links visible', () => {
  const h = read('index.html');
  assert.match(h, /<script src="assets\/js\/redirect\.js"><\/script>/);
  assert.match(h, /<link rel="stylesheet" href="assets\/css\/root\.css">/);
  assert.match(h, /<noscript><meta http-equiv="refresh" content="0; url=ar\/"><\/noscript>/);
  assert.ok(!/<meta http-equiv="refresh"/.test(h.replace(/<noscript>[\s\S]*?<\/noscript>/g, '')), 'meta refresh outside <noscript> would race with the script');
  assert.match(h, /<a href="ar\/">/); assert.match(h, /<a href="en\/">/);
  assert.match(h, /<meta name="robots" content="noindex">/);
});

test('root 404.html uses the shared stylesheet by absolute path and exists as an asset', () => {
  assert.match(read('404.html'), /<link rel="stylesheet" href="\/assets\/css\/root\.css">/);
  assert.ok(existsSync(join(dist, 'assets/css/root.css')) && existsSync(join(dist, 'assets/js/redirect.js')));
});

function redirectTo(getItem) {
  const calls = [];
  run(join(site, 'src/assets/js/redirect.js'), { localStorage: { getItem }, location: { replace: (t) => calls.push(t) } });
  return calls;
}
test('redirect.js: Arabic by default, English only when the visitor chose it, Arabic when storage is unavailable', () => {
  assert.deepEqual(redirectTo(() => null), ['ar/']);
  assert.deepEqual(redirectTo(() => 'ar'), ['ar/']);
  assert.deepEqual(redirectTo(() => 'en'), ['en/']);
  assert.deepEqual(redirectTo(() => 'fr'), ['ar/'], 'unknown value falls back to the default');
  assert.deepEqual(redirectTo(() => { throw new Error('blocked'); }), ['ar/']);
});

// ---- language tagging and image alt text
test('Arabic text on English pages sits inside an element tagged lang="ar"', () => {
  const bad = [];
  for (const [p, h] of pages.filter(([x]) => x.startsWith('en/'))) {
    let t = h.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
    t = t.replace(/<([a-z0-9]+)\b[^>]*\blang="ar"[^>]*>[\s\S]*?<\/\1>/g, '');
    const m = t.replace(/<[^>]+>/g, ' ').match(/[؀-ۿ]+/g);
    if (m) bad.push(`${p}: ${m.slice(0, 3).join(' ')}`);
  }
  assert.deepEqual(bad, []);
});

test('image alt text never repeats a heading of the same page (decorative photos use an empty alt)', () => {
  const bad = [];
  for (const [p, h] of pages) {
    const heads = [...h.matchAll(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/g)].map((m) => m[1].replace(/<[^>]+>/g, '').trim());
    for (const m of h.matchAll(/<img\b[^>]*\balt="([^"]*)"/g)) if (m[1] && heads.includes(m[1])) bad.push(`${p}: alt "${m[1]}"`);
  }
  assert.deepEqual(bad, []);
});

// ---- hero video loading rules
test('hero video markup: no autoplay attribute, nothing preloaded, poster present, hidden from assistive tech', () => {
  for (const loc of ['en', 'ar']) {
    const v = read(`${loc}/index.html`).match(/<video\b[^>]*>/);
    assert.ok(v, `${loc}: hero video present`);
    assert.ok(!/\bautoplay\b/.test(v[0]), 'autoplay attribute would fetch the video on every device');
    assert.match(v[0], /preload="none"/);
    assert.match(v[0], /\bposter="/);
    assert.match(v[0], /aria-hidden="true"/);
    assert.match(v[0], /\bmuted\b/); assert.match(v[0], /\bplaysinline\b/);
  }
});

function mountVideo({ reduce = false, saveData = false, phone = false } = {}) {
  const calls = { play: 0, pause: 0 };
  const video = {
    paused: true, listeners: {},
    play() { calls.play += 1; video.paused = false; return Promise.resolve(); },
    pause() { calls.pause += 1; video.paused = true; },
    addEventListener(t, f) { video.listeners[t] = f; },
  };
  const btn = {
    attrs: {}, listeners: {}, firstElementChild: { textContent: '' }, dataset: { play: 'Play background video', pause: 'Pause background video' },
    setAttribute(k, v) { btn.attrs[k] = v; }, addEventListener(t, f) { btn.listeners[t] = f; },
  };
  const doc = {
    documentElement: { lang: 'en', dir: 'ltr' },
    querySelector: (s) => (s === '[data-video]' ? video : s === '[data-vid-toggle]' ? btn : null),
    getElementById: () => null, querySelectorAll: () => [], addEventListener() {},
  };
  const window = {
    WAW_CONFIG: {}, navigator: { connection: saveData ? { saveData: true } : {} },
    matchMedia: (q) => ({ matches: /prefers-reduced-motion/.test(q) ? reduce : /max-width: 699px/.test(q) ? phone : false }),
  };
  vm.runInNewContext(readFileSync(join(site, 'src/assets/js/main.js'), 'utf8'),
    { window, document: doc, location: { search: '' }, localStorage: { setItem() {} }, Promise, URLSearchParams, setTimeout, clearTimeout });
  return { calls, video, btn };
}
const settle = () => new Promise((r) => setImmediate(r));

test('hero video: starts on a normal desktop visit', async () => {
  const t = mountVideo();
  await settle();
  assert.equal(t.calls.play, 1);
  assert.equal(t.btn.attrs['aria-label'], 'Pause background video');
});
test('hero video: not started (so not downloaded) for reduced motion, data-saver or phone viewports', async () => {
  for (const opt of [{ reduce: true }, { saveData: true }, { phone: true }]) {
    const t = mountVideo(opt);
    await settle();
    assert.equal(t.calls.play, 0, JSON.stringify(opt));
    assert.equal(t.btn.attrs['aria-label'], 'Play background video', JSON.stringify(opt));
  }
});
test('hero video: the visitor can still start it with the button, then pause it', async () => {
  const t = mountVideo({ reduce: true });
  await settle();
  t.btn.listeners.click();
  await settle();
  assert.equal(t.calls.play, 1);
  t.btn.listeners.click();
  assert.equal(t.calls.pause, 1);
});

// ---- package metadata and release script
test('package.json declares the Node engine and a release script that tests then builds for production', () => {
  const pkg = JSON.parse(readFileSync(join(site, 'package.json'), 'utf8'));
  assert.equal(pkg.engines.node, '>=20');
  assert.equal(pkg.scripts.release, 'npm test && npm run build:prod');
  assert.equal(pkg.scripts['build:prod'], 'node src/build.mjs --prod');
  assert.match(readFileSync(join(site, '.nvmrc'), 'utf8'), /^20\s*$/);
});

test('page titles are at most 60 characters and descriptions at most 160 (counted in characters, not bytes)', () => {
  const dec = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"');
  const bad = [];
  for (const [p, h] of pages.filter(([x]) => /^(en|ar)\//.test(x))) {
    const t = dec((h.match(/<title>([^<]*)<\/title>/) || [, ''])[1]);
    const d = dec((h.match(/name="description" content="([^"]*)"/) || [, ''])[1]);
    if ([...t].length > 60) bad.push(`${p}: title ${[...t].length}`);
    if ([...d].length > 160) bad.push(`${p}: description ${[...d].length}`);
  }
  assert.deepEqual(bad, []);
});
