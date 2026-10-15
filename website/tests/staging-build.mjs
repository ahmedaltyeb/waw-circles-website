// Staging build mode (`node src/build.mjs --staging`): every page is noindex, no production SEO output, refuses
// incompatible flags before writing, and leaves the default, production and demo builds unchanged.
// Builds into throw-away temp copies of the sources: never touches website/dist or website/dist-demo, needs no domain
// or network. The production build uses a syntactically valid fixture origin that is only parsed.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, mkdtempSync, mkdirSync, writeFileSync, cpSync, rmSync, existsSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const site = join(dirname(fileURLToPath(import.meta.url)), '..');
const FIXTURE_ORIGIN = 'https://www.waw-fixture-origin.com';
const NOINDEX = '<meta name="robots" content="noindex">';
const MARK = '<meta name="waw-build" content="staging">';

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const list = (root) => walk(root).map((p) => relative(root, p).split(sep).join('/')).sort();
const htmlOf = (root) => list(root).filter((p) => p.endsWith('.html')).map((p) => [p, readFileSync(join(root, p), 'utf8')]);
const normalise = (h) => h.replace(NOINDEX, '').replace(MARK, '');

let tmp, work;           // work = <tmp>/website (a fresh copy of src per test group)
let defaultDist, defaultOriginDist, prodDist, stagingDist, stagingOverProdDist;

function run(args, env = {}, cwd = work) {
  const e = { ...process.env, ...env };
  for (const [k, v] of Object.entries(env)) if (v === undefined) delete e[k];
  return spawnSync(process.execPath, [join(cwd, 'src', 'build.mjs'), ...args], { cwd, env: e, encoding: 'utf8' });
}
function mustBuild(args, env) {
  const r = run(args, env);
  assert.equal(r.status, 0, `build ${args.join(' ')} failed:\n${r.stderr}${r.stdout}`);
  return r;
}
const snapshot = (name) => { const to = join(tmp, name); cpSync(join(work, 'dist'), to, { recursive: true }); return to; };

before(() => {
  tmp = mkdtempSync(join(tmpdir(), 'waw-staging-'));
  work = join(tmp, 'website');
  cpSync(join(site, 'src'), join(work, 'src'), { recursive: true });
  cpSync(join(site, '..', 'waw-white.svg'), join(tmp, 'waw-white.svg'));

  mustBuild([], { SITE_ORIGIN: undefined, CONTACT_ENDPOINT: undefined });
  defaultDist = snapshot('default');
  mustBuild([], { SITE_ORIGIN: FIXTURE_ORIGIN, CONTACT_ENDPOINT: undefined });
  defaultOriginDist = snapshot('default-origin');
  mustBuild(['--prod'], { SITE_ORIGIN: FIXTURE_ORIGIN, CONTACT_ENDPOINT: undefined });
  prodDist = snapshot('prod');                                   // dist/ now holds production robots.txt + sitemap.xml
  // staging built over that production output, with SITE_ORIGIN deliberately set: it must be ignored and stale SEO files removed
  mustBuild(['--staging'], { SITE_ORIGIN: FIXTURE_ORIGIN, CONTACT_ENDPOINT: undefined });
  stagingOverProdDist = snapshot('staging-over-prod');
  rmSync(join(work, 'dist'), { recursive: true, force: true });
  mustBuild(['--staging'], { SITE_ORIGIN: undefined, CONTACT_ENDPOINT: undefined });
  stagingDist = snapshot('staging');
});
after(() => { if (tmp) rmSync(tmp, { recursive: true, force: true }); });

// ---------------------------------------------------------------- staging behaviour

test('staging: every HTML file, including localized pages, 404s and the root redirect, is noindex and marked', () => {
  const pages = htmlOf(stagingDist);
  assert.ok(pages.length >= 24, `expected the full page set, got ${pages.length}`);
  const required = ['index.html', '404.html', 'en/index.html', 'ar/index.html', 'en/404.html', 'ar/404.html'];
  for (const r of required) assert.ok(pages.some(([p]) => p === r), `${r} missing from staging output`);
  const bad = pages.filter(([, h]) => !h.includes(NOINDEX) || !h.includes(MARK)).map(([p]) => p);
  assert.deepEqual(bad, [], 'pages without noindex and/or staging marker');
  for (const [p, h] of pages) assert.equal((h.match(/<meta name="robots"/g) || []).length, 1, `${p}: exactly one robots meta`);
});

test('staging: no canonical, hreflang, og:url, production origin, sitemap or robots.txt', () => {
  const files = list(stagingDist);
  assert.ok(!files.includes('sitemap.xml'), 'sitemap.xml must not be generated');
  assert.ok(!files.includes('robots.txt'), 'robots.txt must not be generated (a crawler must be able to read noindex)');
  for (const [p, h] of htmlOf(stagingDist)) {
    assert.ok(!/rel="canonical"/.test(h), `${p}: canonical`);
    assert.ok(!/rel="alternate"/.test(h), `${p}: alternate/hreflang`);
    assert.ok(!/property="og:url"/.test(h), `${p}: og:url`);
    assert.ok(!h.includes(FIXTURE_ORIGIN), `${p}: origin leaked`);
  }
  const ld = readFileSync(join(stagingDist, 'en', 'index.html'), 'utf8').match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(ld);
  assert.equal(JSON.parse(ld[1]).url, undefined, 'JSON-LD must not carry a url in staging');
});

test('staging: never writes a robots.txt Disallow (noindex must stay readable by allowed crawlers)', () => {
  for (const f of list(stagingDist)) assert.ok(!/(^|\/)robots\.txt$/.test(f), f);
  for (const f of list(stagingDist).filter((x) => /\.(txt|xml|html|js)$/.test(x))) {
    assert.ok(!/Disallow:\s*\//.test(readFileSync(join(stagingDist, f), 'utf8')), `${f}: Disallow rule`);
  }
});

test('staging: ignores SITE_ORIGIN and removes stale production SEO files left in dist/', () => {
  assert.ok(list(prodDist).includes('sitemap.xml') && list(prodDist).includes('robots.txt'), 'precondition: production build wrote them');
  const files = list(stagingOverProdDist);
  assert.ok(!files.includes('sitemap.xml') && !files.includes('robots.txt'), 'stale production SEO files survived');
  assert.deepEqual(files, list(stagingDist), 'staging output must not depend on SITE_ORIGIN');
  for (const [p, h] of htmlOf(stagingOverProdDist)) assert.equal(h, readFileSync(join(stagingDist, p), 'utf8'), `${p} differs when SITE_ORIGIN is set`);
});

test('staging output differs from the default build only by the noindex meta and the staging marker', () => {
  const a = list(defaultDist), b = list(stagingDist);
  assert.deepEqual(b, a, 'same file set as the default build');
  for (const p of a) {
    const x = readFileSync(join(defaultDist, p)), y = readFileSync(join(stagingDist, p));
    if (!p.endsWith('.html')) { assert.ok(x.equals(y), `${p} differs`); continue; }
    assert.equal(normalise(y.toString('utf8')), normalise(x.toString('utf8')), `${p}: more than noindex/marker differs`);
  }
});

// ---------------------------------------------------------------- refusals (nothing written)

function refusal(name, args, env) {
  test(`staging refuses ${name} and writes nothing`, () => {
    const dir = mkdtempSync(join(tmpdir(), 'waw-staging-refuse-'));
    try {
      const w = join(dir, 'website');
      cpSync(join(site, 'src'), join(w, 'src'), { recursive: true });
      cpSync(join(site, '..', 'waw-white.svg'), join(dir, 'waw-white.svg'));
      for (const d of ['dist', 'dist-demo']) { mkdirSync(join(w, d), { recursive: true }); writeFileSync(join(w, d, 'sentinel.txt'), d); }
      const r = run(args, env, w);
      assert.equal(r.status, 1, `expected exit 1, got ${r.status}\n${r.stderr}`);
      assert.match(r.stderr, /Staging build refused: --staging cannot be combined with/);
      assert.match(r.stderr, /No files were written/);
      for (const d of ['dist', 'dist-demo']) {
        assert.deepEqual(readdirSync(join(w, d)), ['sentinel.txt'], `${d}/ was modified`);
        assert.equal(readFileSync(join(w, d, 'sentinel.txt'), 'utf8'), d);
      }
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
}
refusal('--prod with a valid origin', ['--staging', '--prod'], { SITE_ORIGIN: FIXTURE_ORIGIN });
refusal('--prod without an origin', ['--staging', '--prod'], { SITE_ORIGIN: undefined });
refusal('--demo', ['--staging', '--demo'], { SITE_ORIGIN: undefined });
refusal('--demo with an origin set', ['--demo', '--staging'], { SITE_ORIGIN: FIXTURE_ORIGIN });
refusal('--prod and --demo together', ['--staging', '--prod', '--demo'], { SITE_ORIGIN: FIXTURE_ORIGIN });

test('staging refusal names the conflicting flag(s)', () => {
  const r = run(['--staging', '--demo'], { SITE_ORIGIN: undefined });
  assert.match(r.stderr, /combined with --demo\b/);
  const r2 = run(['--staging', '--prod', '--demo'], { SITE_ORIGIN: FIXTURE_ORIGIN });
  assert.match(r2.stderr, /--prod and --demo/);
});

// ---------------------------------------------------------------- regression: default / production / demo unchanged

test('default build: no staging marker; only 404s and the root redirect are noindex; no SEO output without an origin', () => {
  for (const [p, h] of htmlOf(defaultDist)) {
    assert.ok(!h.includes(MARK), `${p}: staging marker in default build`);
    const wantsNoindex = p === 'index.html' || /(^|\/)404\.html$/.test(p);
    assert.equal(h.includes(NOINDEX), wantsNoindex, `${p}: noindex ${wantsNoindex ? 'expected' : 'unexpected'}`);
    assert.ok(!/rel="canonical"/.test(h), `${p}: canonical without SITE_ORIGIN`);
  }
  const files = list(defaultDist);
  assert.ok(!files.includes('sitemap.xml') && !files.includes('robots.txt'));
});

test('default build with SITE_ORIGIN keeps emitting canonical, hreflang, sitemap and robots (unchanged)', () => {
  const home = readFileSync(join(defaultOriginDist, 'en', 'index.html'), 'utf8');
  assert.ok(home.includes(`<link rel="canonical" href="${FIXTURE_ORIGIN}/en/">`));
  assert.ok(home.includes(`hreflang="ar" href="${FIXTURE_ORIGIN}/ar/"`));
  assert.ok(!home.includes(MARK) && !home.includes(NOINDEX));
  const files = list(defaultOriginDist);
  assert.ok(files.includes('sitemap.xml') && files.includes('robots.txt'));
  assert.doesNotMatch(readFileSync(join(defaultOriginDist, 'robots.txt'), 'utf8'), /Disallow/);
});

test('production build: canonical, hreflang, sitemap, robots; indexable content pages; no staging marker', () => {
  const home = readFileSync(join(prodDist, 'en', 'index.html'), 'utf8');
  assert.ok(home.includes(`<link rel="canonical" href="${FIXTURE_ORIGIN}/en/">`));
  assert.ok(home.includes(`hreflang="x-default" href="${FIXTURE_ORIGIN}/ar/"`));
  assert.ok(home.includes(`"url":"${FIXTURE_ORIGIN}"`));
  for (const [p, h] of htmlOf(prodDist)) {
    assert.ok(!h.includes(MARK), `${p}: staging marker in production build`);
    const wantsNoindex = p === 'index.html' || /(^|\/)404\.html$/.test(p);
    assert.equal(h.includes(NOINDEX), wantsNoindex, `${p}: noindex ${wantsNoindex ? 'expected' : 'unexpected'}`);
  }
  assert.ok(readFileSync(join(prodDist, 'sitemap.xml'), 'utf8').includes(`<loc>${FIXTURE_ORIGIN}/en/</loc>`));
});

test('production build still refuses a missing or invalid origin (unchanged)', () => {
  const r = run(['--prod'], { SITE_ORIGIN: undefined });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /Production build refused: SITE_ORIGIN is not set/);
  const r2 = run(['--prod', '--demo'], { SITE_ORIGIN: FIXTURE_ORIGIN });
  assert.equal(r2.status, 1);
  assert.match(r2.stderr, /cannot be combined with --demo/);
});

test('demo build: still noindex everywhere, still ignores SITE_ORIGIN, no staging marker', () => {
  const dir = mkdtempSync(join(tmpdir(), 'waw-staging-demo-'));
  try {
    const w = join(dir, 'website');
    cpSync(join(site, 'src'), join(w, 'src'), { recursive: true });
    cpSync(join(site, '..', 'waw-white.svg'), join(dir, 'waw-white.svg'));
    const r = run(['--demo'], { SITE_ORIGIN: FIXTURE_ORIGIN }, w);
    assert.equal(r.status, 0, r.stderr);
    const demo = join(w, 'dist-demo');
    assert.ok(!existsSync(join(w, 'dist')), 'demo build must not write dist/');
    for (const [p, h] of htmlOf(demo)) {
      assert.ok(h.includes(NOINDEX), `${p}: noindex`);
      assert.ok(!h.includes(MARK), `${p}: staging marker in demo build`);
      assert.ok(!h.includes(FIXTURE_ORIGIN), `${p}: origin leaked`);
    }
    const files = list(demo);
    assert.ok(!files.includes('sitemap.xml') && !files.includes('robots.txt'));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('package.json: existing build, build:prod, start, serve and demo scripts are unchanged', () => {
  const s = JSON.parse(readFileSync(join(site, 'package.json'), 'utf8')).scripts;
  assert.equal(s.build, 'node src/build.mjs');
  assert.equal(s['build:prod'], 'node src/build.mjs --prod');
  assert.equal(s.start, 'node src/build.mjs && node serve.mjs');
  assert.equal(s.serve, 'node serve.mjs');
  assert.equal(s.demo, 'node src/build.mjs --demo && node serve.mjs 4180 --demo');
});
