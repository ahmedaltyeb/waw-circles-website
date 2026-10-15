// Production origin guard. No dependencies, no network: nothing is ever fetched or resolved.
// Rejections use reserved/test names. The single "valid" fixture is a syntactically valid domain that is only parsed, never contacted.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { validateOrigin } from '../src/origin.mjs';

const site = join(dirname(fileURLToPath(import.meta.url)), '..');
const VALID = 'https://www.waw-fixture-origin.com';

test('valid https origins pass and are normalised', () => {
  assert.deepEqual(validateOrigin(VALID), { ok: true, origin: VALID });
  assert.equal(validateOrigin(`${VALID}/`).origin, VALID, 'trailing slash removed');
  assert.equal(validateOrigin('https://WWW.Waw-Fixture-Origin.COM').origin, VALID, 'host lower-cased');
  assert.equal(validateOrigin('https://waw-fixture-origin.com').ok, true, 'apex domain');
  assert.equal(validateOrigin('https://bücher.de').origin, 'https://xn--bcher-kva.de', 'IDN to punycode');
});

const rejected = {
  missing: [undefined, /not set/],
  empty: ['', /not set/],
  'surrounding whitespace': [` ${VALID}`, /whitespace/],
  'malformed: text': ['not a url', /not a valid absolute URL/],
  'malformed: no scheme': ['www.waw-fixture-origin.com', /not a valid absolute URL/],
  'malformed: broken scheme': ['https//waw-fixture-origin.com', /not a valid absolute URL/],
  'http scheme': ['http://www.waw-fixture-origin.com', /https/],
  'ftp scheme': ['ftp://www.waw-fixture-origin.com', /https/],
  'placeholder.invalid': ['https://placeholder.invalid', /reserved/],
  'example.com': ['https://example.com', /reserved example/],
  'www.example.org': ['https://www.example.org', /reserved example/],
  'sub.example.net': ['https://sub.example.net', /reserved example/],
  '.test domain': ['https://site.test', /reserved/],
  '.local domain': ['https://waw.local', /reserved/],
  '.example TLD': ['https://site.example', /reserved/],
  localhost: ['https://localhost', /no top-level domain|reserved|placeholder/],
  '*.localhost': ['https://app.localhost', /reserved/],
  'loopback IPv4': ['https://127.0.0.1', /IP address/],
  'loopback IPv6': ['https://[::1]', /IP address/],
  'private IPv4': ['https://192.168.1.10', /IP address/],
  'unspecified IPv4': ['https://0.0.0.0', /IP address/],
  'decimal-encoded IPv4': ['https://2130706433', /IP address/],
  'single label host': ['https://intranet', /no top-level domain/],
  'underscore host': ['https://bad_host.com', /invalid characters/],
  'placeholder word: yourdomain': ['https://yourdomain.com', /placeholder/],
  'placeholder word in name': ['https://my-placeholder-site.com', /placeholder/],
  port: ['https://www.waw-fixture-origin.com:8443', /port/],
  path: ['https://www.waw-fixture-origin.com/site', /origin only/],
  query: ['https://www.waw-fixture-origin.com/?a=1', /origin only/],
  fragment: ['https://www.waw-fixture-origin.com/#x', /origin only/],
  credentials: ['https://user:pw@www.waw-fixture-origin.com', /credentials/],
};
for (const [name, [value, re]] of Object.entries(rejected)) {
  test(`rejects: ${name}`, () => {
    const r = validateOrigin(value);
    assert.equal(r.ok, false, `accepted ${JSON.stringify(value)}`);
    assert.match(r.error, re);
    assert.equal(r.origin, undefined);
  });
}

test('non-string input is rejected', () => {
  for (const v of [null, 42, {}, []]) assert.equal(validateOrigin(v).ok, false);
});

test('validator is pure: no imports, no env or filesystem access', () => {
  const src = readFileSync(join(site, 'src/origin.mjs'), 'utf8');
  assert.ok(!/^\s*import\s/m.test(src), 'no imports');
  assert.ok(!/\bprocess\b|\bfetch\b|\brequire\b/.test(src), 'no process/fetch/require');
});

// --- CLI behaviour: only refusal paths are exercised here, because they exit before anything is written.
// A passing production build would overwrite dist/ with canonical URLs, so the success path is covered at validator level.
const dist = join(site, 'dist', 'index.html');
function runProd(env = {}, args = ['--prod']) {
  const e = { ...process.env, ...env };
  for (const [k, v] of Object.entries(env)) if (v === undefined) delete e[k];
  return spawnSync(process.execPath, [join(site, 'src/build.mjs'), ...args], { cwd: site, env: e, encoding: 'utf8' });
}

const cli = {
  'SITE_ORIGIN missing': { SITE_ORIGIN: undefined },
  'SITE_ORIGIN empty': { SITE_ORIGIN: '' },
  'SITE_ORIGIN malformed': { SITE_ORIGIN: 'not a url' },
  'SITE_ORIGIN http': { SITE_ORIGIN: 'http://www.waw-fixture-origin.com' },
  'SITE_ORIGIN placeholder.invalid': { SITE_ORIGIN: 'https://placeholder.invalid' },
  'SITE_ORIGIN localhost': { SITE_ORIGIN: 'https://localhost' },
};
for (const [name, env] of Object.entries(cli)) {
  test(`build --prod refuses and writes nothing: ${name}`, () => {
    assert.ok(existsSync(dist), 'dist/ not found: run `npm run build` first (or use `npm test`)');
    const before = statSync(dist).mtimeMs;
    const r = runProd(env);
    assert.equal(r.status, 1, `exit code ${r.status}\n${r.stdout}`);
    assert.match(r.stderr, /Production build refused: /);
    assert.match(r.stderr, /No files were written/);
    assert.equal(r.stdout.trim(), '', 'no build output');
    assert.ok(existsSync(dist), 'dist/ must still exist');
    assert.equal(statSync(dist).mtimeMs, before, 'dist/ must be untouched');
  });
}

test('build --prod --demo is refused even with a valid origin', () => {
  const before = statSync(dist).mtimeMs;
  const r = runProd({ SITE_ORIGIN: VALID }, ['--prod', '--demo']);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /cannot be combined with --demo/);
  assert.equal(statSync(dist).mtimeMs, before);
});

test('package.json exposes build:prod and leaves the default scripts intact', () => {
  const s = JSON.parse(readFileSync(join(site, 'package.json'), 'utf8')).scripts;
  assert.equal(s['build:prod'], 'node src/build.mjs --prod');
  assert.equal(s.build, 'node src/build.mjs');
  assert.match(s.test, /^node src\/build\.mjs && /, 'tests build with the default (non-production) build');
});
