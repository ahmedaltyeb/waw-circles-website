// Output hygiene: internal editor notes must not be published, and the asset copy must otherwise be unchanged.
// Builds into a throw-away temp copy of the sources (default and production builds), so it never touches dist/
// and needs no real domain or network. The production build uses a syntactically valid fixture origin that is only parsed.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync, mkdtempSync, cpSync, rmSync } from 'node:fs';
import { join, dirname, relative, basename, sep } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { projects } from '../src/content.mjs';

const site = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcAssets = join(site, 'src', 'assets');
const FIXTURE_ORIGIN = 'https://www.waw-fixture-origin.com';
const INTERNAL = ['video/README.txt', 'img/slides/README.txt'];       // paths relative to src/assets

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const list = (root) => walk(root).map((p) => relative(root, p).split(sep).join('/')).sort();
const isReadme = (p) => basename(p).toLowerCase() === 'readme.txt';
const isCredits = (p) => basename(p).toLowerCase() === 'credits.md';
const HAS_PROJECTS = projects.some((x) => x.publish);
// placeholder imagery named after hidden projects (src/assets/img/proj-*.jpg): excluded only while no project is published
const isHiddenProjectImage = (p) => !HAS_PROJECTS && /^proj-[a-z0-9-]+\.(jpe?g|png|webp)$/i.test(basename(p));
// Independent statement of what the build must leave out; everything else must be copied byte for byte.
const isExcluded = (p) => isReadme(p) || isCredits(p) || isHiddenProjectImage(p);

let tmp, defaultDist, prodDist, demoDist;

function buildInTemp(args, env) {
  const e = { ...process.env, ...env };
  for (const [k, v] of Object.entries(env)) if (v === undefined) delete e[k];
  const r = spawnSync(process.execPath, [join(tmp, 'website', 'src', 'build.mjs'), ...args], { cwd: join(tmp, 'website'), env: e, encoding: 'utf8' });
  assert.equal(r.status, 0, `build ${args.join(' ')} failed:\n${r.stderr}${r.stdout}`);
}

before(() => {
  tmp = mkdtempSync(join(tmpdir(), 'waw-hygiene-'));
  cpSync(join(site, 'src'), join(tmp, 'website', 'src'), { recursive: true });
  cpSync(join(site, '..', 'waw-white.svg'), join(tmp, 'waw-white.svg'));
  buildInTemp([], { SITE_ORIGIN: undefined, CONTACT_ENDPOINT: undefined });
  defaultDist = join(tmp, 'website', 'dist');
  // keep the default output for comparison, then build production over the same temp tree
  cpSync(defaultDist, join(tmp, 'default-dist'), { recursive: true });
  defaultDist = join(tmp, 'default-dist');
  buildInTemp(['--prod'], { SITE_ORIGIN: FIXTURE_ORIGIN, CONTACT_ENDPOINT: undefined });
  prodDist = join(tmp, 'website', 'dist');
  // demo build with SITE_ORIGIN deliberately set: demo output must ignore it
  buildInTemp(['--demo'], { SITE_ORIGIN: FIXTURE_ORIGIN, CONTACT_ENDPOINT: undefined });
  demoDist = join(tmp, 'website', 'dist-demo');
});
after(() => { if (tmp) rmSync(tmp, { recursive: true, force: true }); });

test('the internal README files exist in the sources (so the exclusion is meaningful)', () => {
  for (const p of INTERNAL) assert.ok(existsSync(join(srcAssets, p)), `src/assets/${p} missing`);
});

test('no README file is published by the default build', () => {
  const leaked = list(defaultDist).filter(isReadme);
  assert.deepEqual(leaked, []);
  for (const p of INTERNAL) assert.ok(!existsSync(join(defaultDist, 'assets', p)), `assets/${p} published`);
});

test('no README file is published by the production build', () => {
  const leaked = list(prodDist).filter(isReadme);
  assert.deepEqual(leaked, []);
});

test('every other source asset is still copied, byte for byte, in both builds', () => {
  const wanted = list(srcAssets).filter((p) => !isExcluded(p));
  assert.ok(wanted.length >= 10, `unexpectedly few assets: ${wanted.length}`);
  for (const [name, root] of [['default', defaultDist], ['prod', prodDist]]) {
    const bad = [];
    for (const p of wanted) {
      const out = join(root, 'assets', p);
      if (!existsSync(out)) bad.push(`${name}: missing assets/${p}`);
      else if (!readFileSync(out).equals(readFileSync(join(srcAssets, p)))) bad.push(`${name}: assets/${p} differs`);
    }
    assert.deepEqual(bad, []);
  }
});

test('required public assets are present', () => {
  for (const root of [defaultDist, prodDist]) {
    for (const p of ['assets/css/style.css', 'assets/css/fonts.css', 'assets/js/main.js', 'assets/js/config.js', 'assets/img/favicon.svg',
      'assets/img/hero-poster.jpg', 'assets/video/hero.mp4', 'assets/fonts/cairo-arabic.woff2', 'assets/fonts/space-grotesk-latin.woff2']) {
      assert.ok(existsSync(join(root, p)), `${p} missing`);
    }
  }
});

test('build output differs between default and production only by SEO files and metadata', () => {
  const a = list(defaultDist), b = list(prodDist);
  assert.deepEqual(b.filter((p) => !a.includes(p)).sort(), ['robots.txt', 'sitemap.xml']);
  assert.deepEqual(a.filter((p) => !b.includes(p)), []);
  // non-HTML assets are identical in both builds
  for (const p of a.filter((x) => !x.endsWith('.html'))) {
    assert.ok(readFileSync(join(defaultDist, p)).equals(readFileSync(join(prodDist, p))), `${p} differs between builds`);
  }
});

test('production build emits canonical output for the fixture origin and none for the default build', () => {
  assert.ok(!readFileSync(join(defaultDist, 'en', 'index.html'), 'utf8').includes('rel="canonical"'));
  const prod = readFileSync(join(prodDist, 'en', 'index.html'), 'utf8');
  assert.ok(prod.includes(`<link rel="canonical" href="${FIXTURE_ORIGIN}/en/">`));
  assert.match(readFileSync(join(prodDist, 'robots.txt'), 'utf8'), new RegExp(`Sitemap: ${FIXTURE_ORIGIN}/sitemap\\.xml`));
});

// ---- demo output (npm run demo -> dist-demo/): contains sample partners/testimonials, so it must be inert if deployed by mistake
const demoHtml = () => list(demoDist).filter((p) => p.endsWith('.html')).map((p) => [p, readFileSync(join(demoDist, p), 'utf8')]);

test('demo build: README files excluded and every other asset byte-identical', () => {
  assert.deepEqual(list(demoDist).filter(isReadme), []);
  const bad = [];
  for (const p of list(srcAssets).filter((x) => !isExcluded(x))) {
    const out = join(demoDist, 'assets', p);
    if (!existsSync(out) || !readFileSync(out).equals(readFileSync(join(srcAssets, p)))) bad.push(p);
  }
  assert.deepEqual(bad, []);
});

test('demo build: really is the demo (banner and sample tags present)', () => {
  const home = readFileSync(join(demoDist, 'en', 'index.html'), 'utf8');
  assert.match(home, /class="demo-banner"/);
  assert.match(home, /class="sample-tag"/);
});

test('demo build: every page is noindex', () => {
  const missing = demoHtml().filter(([, h]) => !/<meta name="robots" content="noindex">/.test(h)).map(([p]) => p);
  assert.deepEqual(missing, []);
});

test('demo build ignores SITE_ORIGIN: no canonical or alternate link tags, og:url, origin string, sitemap or robots.txt', () => {
  const bad = [];
  for (const [p, h] of demoHtml()) {
    if (/<link[^>]*rel="(?:canonical|alternate)"|property="og:url"/.test(h)) bad.push(`${p}: SEO link tags`);
    if (h.includes(FIXTURE_ORIGIN)) bad.push(`${p}: origin leaked`);
  }
  assert.deepEqual(bad, []);
  assert.ok(!existsSync(join(demoDist, 'sitemap.xml')) && !existsSync(join(demoDist, 'robots.txt')));
});

test('demo build: hidden projects stay hidden', () => {
  const bad = demoHtml().filter(([, h]) => /Hajin|Baytech|Flowrz|Mohmaina|هجن/.test(h)).map(([p]) => p);
  assert.deepEqual(bad, []);
  assert.ok(!existsSync(join(demoDist, 'en', 'projects')));
});

test('demo-only protections do not leak into default or production output', () => {
  for (const root of [defaultDist, prodDist]) {
    const home = readFileSync(join(root, 'en', 'index.html'), 'utf8');
    assert.ok(!home.includes('demo-banner') && !home.includes('sample-tag'), 'demo markers');
    assert.ok(!/<meta name="robots" content="noindex">/.test(home), 'home must stay indexable');
  }
});

// ---- editor notes and hidden-project imagery (found after Step 7: src/assets/img/CREDITS.md and proj-*.jpg appeared)
const outputs = () => [['default', defaultDist], ['prod', prodDist], ['demo', demoDist]];

test('editor notes (README.txt, CREDITS.md) are not published by any build', () => {
  const leaked = [];
  for (const [name, root] of outputs()) for (const p of list(root)) if (isReadme(p) || isCredits(p)) leaked.push(`${name}: ${p}`);
  assert.deepEqual(leaked, []);
});

test('no output file name reveals an unpublished project', () => {
  assert.ok(!HAS_PROJECTS, 'projects are published: this guard applies only while all are hidden (update deliberately)');
  const ids = projects.map((p) => p.id).concat(projects.flatMap((p) => [p.name?.en, p.name?.ar]).filter(Boolean).map((n) => n.toLowerCase().replace(/\s+/g, '-')));
  const bad = [];
  for (const [name, root] of outputs()) for (const p of list(root)) {
    const low = p.toLowerCase();
    if (/(^|\/)proj-/.test(low) || ids.some((id) => id && low.includes(id.toLowerCase()))) bad.push(`${name}: ${p}`);
  }
  assert.deepEqual(bad, []);
});

test('images used by pages are still copied (about, product and slide imagery)', () => {
  const html = readFileSync(join(defaultDist, 'en', 'index.html'), 'utf8') + readFileSync(join(defaultDist, 'en', 'products', 'index.html'), 'utf8');
  const refs = [...html.matchAll(/src="\.\.\/(?:\.\.\/)?assets\/(img\/[^"]+\.(?:jpe?g|png|webp))"/g)].map((m) => m[1]);
  const missing = refs.filter((r) => !existsSync(join(defaultDist, 'assets', r)));
  assert.deepEqual(missing, []);
  for (const r of refs) assert.ok(!/proj-/.test(r), `page references hidden-project image ${r}`);
});
