// Unpublished-projects guard. No dependencies. Asserts that, while no project has documented permission and evidence
// (PRD D05), nothing about the projects reaches the generated site in either language.
// To publish a project later: set publish:true in src/content.mjs AFTER permission and evidence are on record,
// then update this file deliberately (the first test is the tripwire).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import L, { projects } from '../src/content.mjs';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
assert.ok(existsSync(join(dist, 'index.html')), 'dist/ not found: run `npm run build` first (or use `npm test`)');

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const rel = (p) => p.slice(dist.length).replace(/\\/g, '/');
const all = walk(dist);
const text = all.filter((f) => /\.(html|js|css|xml|txt|svg|json)$/.test(f)).map((f) => [rel(f), readFileSync(f, 'utf8')]);
const html = text.filter(([p]) => p.endsWith('.html'));

test('every project record is unpublished and still kept in the source for later review', () => {
  assert.ok(projects.length >= 5, 'project records must be preserved locally');
  assert.deepEqual(projects.filter((p) => p.publish).map((p) => p.id), [],
    'a project is published: confirm written permission + evidence (PRD D05) and update this test deliberately');
});

test('no Projects route is generated in either language', () => {
  for (const loc of ['en', 'ar']) {
    assert.ok(!existsSync(join(dist, loc, 'projects')), `${loc}/projects exists`);
    assert.ok(existsSync(join(dist, loc, 'index.html')), `${loc} home missing`);
  }
});

test('no link, anchor, nav or footer item points at Projects', () => {
  const bad = [];
  for (const [p, h] of html) {
    for (const m of h.matchAll(/\bhref="([^"]*)"/g)) if (/(^|\/)projects(\/|#|$)|^#projects$/.test(m[1])) bad.push(`${p}: ${m[1]}`);
    if (/\bid="projects"/.test(h)) bad.push(`${p}: id="projects" section`);
    if (/class="[^"]*\b(projs|proj)\b/.test(h)) bad.push(`${p}: project cards`);
    // visible link labels for the section
    for (const m of h.matchAll(/<a\b[^>]*>([^<]*)<\/a>/g)) if (/^(projects|المشاريع)$/i.test(m[1].trim())) bad.push(`${p}: link "${m[1]}"`);
  }
  assert.deepEqual(bad, []);
});

test('no project name or detail from any record appears anywhere in the output (EN or AR)', () => {
  const names = new Set();
  for (const p of projects) for (const n of [p.name?.en, p.name?.ar]) if (n) names.add(n.toLowerCase());
  for (const loc of ['en', 'ar']) for (const x of ['hajin', 'baytech', 'flowrz', 'mohmaina', 'barking me', 'parking me']) names.add(x);
  names.add('هجن الخليج');
  const bad = [];
  for (const [p, s] of text) { const low = s.toLowerCase(); for (const n of names) if (low.includes(n)) bad.push(`${p}: "${n}"`); }
  assert.deepEqual(bad, []);
});

test('no unsupported project-delivery or portfolio claims in the output (EN or AR)', () => {
  const claims = [
    /projects? (that )?(we have |were |was )?delivered/i, /delivered (by|for) (waw|us)\b/i, /work we have (delivered|built)/i,
    /\bour (past |previous |recent |selected )?(projects|portfolio|clients)\b/i, /\bportfolio\b/i, /selection of projects/i,
    /speaks for itself/i, /case stud(y|ies) (is|are)? ?available/i, /\bcar rental\b/i,
    /مشاريع (نفّذ|منفذة)|نفّذتها|نفّذناها|مختارات من المشاريع|أعمال تتحدث عن نفسها|تأجير السيارات/,
  ];
  const bad = [];
  for (const [p, s] of html) {
    const visible = s.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ');
    const metas = [...s.matchAll(/<meta [^>]*content="([^"]*)"/g)].map((m) => m[1]).join(' ');
    for (const re of claims) { const m = (visible + ' ' + metas).match(re); if (m) bad.push(`${p}: "${m[0]}"`); }
  }
  assert.deepEqual(bad, []);
});

test('hidden project copy is not rendered: project strings from content.mjs are absent from the output', () => {
  const strings = [];
  for (const loc of ['en', 'ar']) {
    strings.push(L[loc].projects.lead, L[loc].projects.note, L[loc].home.projectsTitle, L[loc].home.projectsText, L[loc].meta.projects[1]);
  }
  const bad = [];
  for (const [p, s] of html) for (const str of strings) if (str && s.includes(str.replace(/&/g, '&amp;'))) bad.push(`${p}: "${str.slice(0, 40)}"`);
  assert.deepEqual(bad, []);
});

test('sitemap (when SITE_ORIGIN is set) and hreflang never reference Projects', () => {
  const sm = join(dist, 'sitemap.xml');
  if (existsSync(sm)) assert.ok(!/projects/i.test(readFileSync(sm, 'utf8')));
  for (const [p, h] of html) assert.ok(!/hreflang="[a-z]+" href="[^"]*projects/.test(h), p);
});

test('no project illustration art ships in page markup', () => {
  const bad = html.filter(([, h]) => /aria-label="[^"]*(Hajin|Baytech|Flowrz|Mohmaina)/i.test(h) || /\bid="pj[1-5]"|\bg-pj[1-5]\b/.test(h)).map(([p]) => p);
  assert.deepEqual(bad, []);
});
