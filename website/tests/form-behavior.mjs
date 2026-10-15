// Contact form behaviour. No dependencies, no network, no real email.
// Runs src/assets/js/main.js in a node:vm sandbox against a minimal fake DOM and a fake fetch.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import L, { company } from '../src/content.mjs';

const script = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'src/assets/js/main.js'), 'utf8');
const settle = () => new Promise((r) => setImmediate(r));
const ENDPOINT = 'https://form.invalid/submit'; // never contacted: fetch is a stub

function el() {
  const e = {
    children: [], attrs: {}, listeners: {}, className: '', hidden: false, disabled: false, dataset: {}, value: '', _text: '',
    classList: { toggle() {}, add() {}, contains() { return false; } },
    get textContent() { return e._text; },
    set textContent(v) { e._text = String(v); e.children = []; },
    set innerHTML(v) { e.children = []; }, get innerHTML() { return ''; },
    appendChild(c) { e.children.push(c); return c; },
    addEventListener(t, f) { e.listeners[t] = f; },
    setAttribute(k, v) { e.attrs[k] = v; }, getAttribute(k) { return e.attrs[k] ?? null; }, removeAttribute(k) { delete e.attrs[k]; },
    focus() {}, querySelector() { return null; },
  };
  return e;
}

// loc: 'en' | 'ar'; cfg: window.WAW_CONFIG; fetchImpl: (url, init) => Promise; values: field overrides
function mount({ loc = 'en', endpoint = '', fetchImpl, values = {} } = {}) {
  const f = L[loc].contact.form;
  const opts = [{ value: 'general', text: f.notSure }, { value: 's01', text: 'Product strategy' }];
  const field = (v = '') => Object.assign(el(), { value: v });
  const fields = {
    name: field('Aisha'), email: field('aisha@example.com'), company: field('Acme'), website: field(''), message: field('We need a booking app for our fleet.'),
    interest: Object.assign(field('s01'), { options: opts, selectedIndex: 1 }),
  };
  for (const [k, v] of Object.entries(values)) fields[k].value = v;
  const status = el(), summary = el(), submit = el(), ul = el();
  summary.querySelector = (s) => (s === 'ul' ? ul : null);
  const errEls = {};
  let resetCalls = 0;
  const form = Object.assign(el(), {
    elements: fields,
    reset() { resetCalls++; },
    dataset: { msgs: JSON.stringify({ ...f, interestGroups: undefined }), fallback: company.email, locale: loc },
    querySelector(sel) {
      if (sel === '[data-errors]') return summary;
      if (sel === '[data-status]') return status;
      if (sel === '[data-submit]') return submit;
      const m = sel.match(/data-err-for="(\w+)"/);
      return m ? (errEls[m[1]] ||= el()) : null;
    },
  });
  const doc = {
    documentElement: { lang: loc, dir: loc === 'ar' ? 'rtl' : 'ltr' },
    querySelector: (s) => (s === '[data-form]' ? form : null),
    getElementById: () => null, querySelectorAll: () => [], addEventListener() {},
    createElement: () => el(), createTextNode: (t) => Object.assign(el(), { _text: t, isText: true }),
  };
  const timers = [];
  const calls = { fetch: [], hrefSet: [] };
  const location = { search: '' };
  Object.defineProperty(location, 'href', { set(v) { calls.hrefSet.push(v); }, get() { return ''; } });
  const sandbox = {
    window: { WAW_CONFIG: { endpoint, email: company.email }, matchMedia: () => ({ matches: false }) },
    document: doc, location, localStorage: { setItem() {} },
    URLSearchParams, AbortController, Promise, JSON, Date, encodeURIComponent,
    setTimeout: (fn) => { timers.push(fn); return timers.length; }, clearTimeout() {},
    fetch: (url, init) => { calls.fetch.push({ url, init }); return fetchImpl(url, init); },
  };
  vm.runInNewContext(script, sandbox);
  return {
    f, fields, status, summary, submit, ul, calls, timers, form,
    resets: () => resetCalls,
    submitForm: async () => { form.listeners.submit({ preventDefault() {} }); await settle(); await settle(); },
    link: () => status.children.find((c) => c.href),
  };
}

const respond = (status, body, { json } = {}) => () => Promise.resolve({
  ok: status >= 200 && status < 300, status,
  json: json || (() => Promise.resolve(body)),
});

for (const loc of ['en', 'ar']) {
  test(`[${loc}] no endpoint: nothing sent, no success state, input kept, mailto link shown`, async () => {
    const t = mount({ loc, endpoint: '', fetchImpl: () => assert.fail('fetch must not be called') });
    await t.submitForm();
    assert.equal(t.calls.fetch.length, 0, 'no network call');
    assert.deepEqual(t.calls.hrefSet, [], 'must not navigate or auto-open the mail app');
    assert.equal(t.resets(), 0, 'form must not be reset');
    assert.equal(t.fields.message.value, 'We need a booking app for our fleet.');
    assert.ok(!/\bok\b/.test(t.status.className), `success style used: "${t.status.className}"`);
    assert.ok(!/\bbad\b/.test(t.status.className));
    assert.equal(t.status.textContent, t.f.notConfigured);
    assert.notEqual(t.status.textContent, t.f.accepted);
    const link = t.link();
    assert.ok(link, 'mailto link present');
    assert.ok(link.href.startsWith(`mailto:${company.email}?subject=`));
    assert.equal(link.textContent, company.email);
    assert.ok(decodeURIComponent(link.href).includes('We need a booking app'));
    assert.equal(t.submit.disabled, false);
  });
}

test('endpoint set: 200 with {"ok":true} shows success, posts JSON, resets the form', async () => {
  const t = mount({ endpoint: ENDPOINT, fetchImpl: respond(200, { ok: true }) });
  await t.submitForm();
  assert.equal(t.calls.fetch.length, 1);
  assert.equal(t.calls.fetch[0].url, ENDPOINT);
  assert.equal(t.calls.fetch[0].init.method, 'POST');
  const sent = JSON.parse(t.calls.fetch[0].init.body);
  assert.deepEqual(Object.keys(sent).sort(), ['company', 'email', 'interest', 'locale', 'message', 'name']);
  assert.equal(sent.locale, 'en');
  assert.match(t.status.className, /\bok\b/);
  assert.equal(t.status.textContent, t.f.accepted);
  assert.equal(t.resets(), 1);
  assert.equal(t.submit.disabled, false);
});

const failures = {
  'HTTP 200 with {"ok":false}': respond(200, { ok: false }),
  'HTTP 200 with empty object': respond(200, {}),
  'HTTP 200 with truthy non-true ok': respond(200, { ok: 'true' }),
  'HTTP 200 with null body': respond(200, null),
  'HTTP 200 with invalid JSON': respond(200, null, { json: () => Promise.reject(new SyntaxError('bad json')) }),
  'HTTP 500 even with {"ok":true}': respond(500, { ok: true }),
  'HTTP 429': respond(429, { ok: false }),
  'HTTP 404': respond(404, null),
  'network failure': () => Promise.reject(new TypeError('network')),
};
for (const [name, impl] of Object.entries(failures)) {
  test(`endpoint set: ${name} is a failure, never success`, async () => {
    const t = mount({ endpoint: ENDPOINT, fetchImpl: impl });
    await t.submitForm();
    assert.match(t.status.className, /\bbad\b/);
    assert.ok(!/\bok\b/.test(t.status.className));
    assert.equal(t.status.textContent, t.f.failure);
    assert.ok(t.link()?.href.startsWith(`mailto:${company.email}`), 'email fallback shown');
    assert.equal(t.resets(), 0, 'input preserved');
    assert.equal(t.fields.message.value, 'We need a booking app for our fleet.');
    assert.equal(t.submit.disabled, false, 'button re-enabled');
  });
}

test('endpoint set: timeout aborts the request and shows failure', async () => {
  const t = mount({
    endpoint: ENDPOINT,
    fetchImpl: (_u, init) => new Promise((_res, rej) => init.signal.addEventListener('abort', () => rej(new Error('aborted')))),
  });
  await t.submitForm();
  assert.equal(t.status.textContent, t.f.pending);
  assert.equal(t.submit.disabled, true);
  assert.equal(t.timers.length, 1, 'timeout armed');
  t.timers[0]();                                   // fire the 15 s timeout
  await settle();
  assert.match(t.status.className, /\bbad\b/);
  assert.equal(t.status.textContent, t.f.failure);
  assert.equal(t.submit.disabled, false);
});

test('endpoint set: missing fetch support is a failure, not an unhandled error', async () => {
  const t = mount({ endpoint: ENDPOINT, fetchImpl: () => { throw new ReferenceError('fetch is not defined'); } });
  await t.submitForm();
  assert.match(t.status.className, /\bbad\b/);
  assert.equal(t.submit.disabled, false);
});

test('validation errors block submission before any delivery path runs', async () => {
  for (const endpoint of ['', ENDPOINT]) {
    const t = mount({ endpoint, values: { email: 'not-an-email', message: 'short' }, fetchImpl: () => assert.fail('fetch must not be called') });
    await t.submitForm();
    assert.equal(t.calls.fetch.length, 0);
    assert.deepEqual(t.calls.hrefSet, []);
    assert.equal(t.summary.hidden, false);
    assert.equal(t.status.textContent, '');
  }
});

test('honeypot submissions are dropped silently', async () => {
  const t = mount({ endpoint: ENDPOINT, values: { website: 'http://spam.invalid' }, fetchImpl: () => assert.fail('fetch must not be called') });
  await t.submitForm();
  assert.equal(t.calls.fetch.length, 0);
  assert.equal(t.status.textContent, '');
});

test('both locales define every form state string used by the script', () => {
  for (const loc of ['en', 'ar']) {
    const f = L[loc].contact.form;
    for (const k of ['pending', 'accepted', 'failure', 'notConfigured', 'rate', 'invalidEmail', 'nameRequired', 'messageShort', 'messageLong']) {
      assert.ok(typeof f[k] === 'string' && f[k].trim(), `${loc}.contact.form.${k}`);
    }
    assert.equal(f.mailto, undefined, 'old auto-open string must be gone');
  }
  assert.match(L.ar.contact.form.notConfigured, /[؀-ۿ]/);
});
