// Patch: partners + testimonials sections (data-gated, demo preview), nicer cards.
const fs = require('fs');
const root = require('path').join(__dirname, '..', 'src');
const read = (f) => fs.readFileSync(root + f, 'utf8');
const mk = (src) => ({ src, rep(a, b) { if (!this.src.includes(a)) throw new Error('missing: ' + a.slice(0, 70)); this.src = this.src.replace(a, b); } });

// ---------------- content
const c = mk(read('/content.mjs'));
c.rep(`export const serviceGroups`, `// Real partners and client quotes go here. Nothing is shown until an entry exists (PRD: no invented proof).
//   partners:     { name: {en, ar}, logo: 'partners/acme.svg' (file in src/assets/img/), url: 'https://...' }
//   testimonials: { quote: {en, ar}, name: {en, ar}, role: {en, ar}, company: {en, ar} }  // only with written permission
export const partners = [];
export const testimonials = [];

// Placeholder data for \`npm run demo\` only: lets you review the design. Never included in the normal build.
export const demoPartners = ['One', 'Two', 'Three', 'Four', 'Five', 'Six'].map((n) => ({ name: { en: 'Partner ' + n, ar: 'شريك ' + n } }));
export const demoTestimonials = [1, 2, 3].map((n) => ({
  quote: { en: 'Sample quote ' + n + '. Replace this with a real, approved statement from a client.', ar: 'اقتباس تجريبي ' + n + '. استبدله بعبارة حقيقية ومعتمدة من عميل.' },
  name: { en: 'Client name', ar: 'اسم العميل' }, role: { en: 'Role', ar: 'المنصب' }, company: { en: 'Company', ar: 'الشركة' },
}));

export const serviceGroups`);
c.rep(`      showcaseTitle: 'What we can build for you',`, `      partnersTitle: 'Partners and collaborators',
      partnersText: 'The organisations and technologies we work alongside.',
      testimonialsTitle: 'What our clients say',
      testimonialsText: 'In their own words.',
      sample: 'Sample',
      demoBanner: 'Design preview: partners and testimonials below are placeholders, not real.',
      showcaseTitle: 'What we can build for you',`);
c.rep(`      showcaseTitle: 'ماذا نستطيع أن نبني لك',`, `      partnersTitle: 'الشركاء والمتعاونون',
      partnersText: 'الجهات والتقنيات التي نعمل معها.',
      testimonialsTitle: 'ماذا يقول عملاؤنا',
      testimonialsText: 'بكلماتهم هم.',
      sample: 'تجريبي',
      demoBanner: 'معاينة تصميم: الشركاء والآراء أدناه أمثلة وليست حقيقية.',
      showcaseTitle: 'ماذا نستطيع أن نبني لك',`);
fs.writeFileSync(root + '/content.mjs', c.src);

// ---------------- build
const b = mk(read('/build.mjs'));
b.rep(`import L, { company, products, projects, serviceGroups, social }`, `import L, { company, products, projects, serviceGroups, social, partners as realPartners, testimonials as realTestimonials, demoPartners, demoTestimonials }`);
b.rep(`const dist = join(here, '..', 'dist');`, `const DEMO = process.argv.includes('--demo');
const dist = join(here, '..', DEMO ? 'dist-demo' : 'dist');
const partners = DEMO && !realPartners.length ? demoPartners : realPartners;
const testimonials = DEMO && !realTestimonials.length ? demoTestimonials : realTestimonials;
const isSample = DEMO && !realPartners.length;`);
// banner
b.rep(`<a class="skip" href="#main">\${esc(t.ui.skip)}</a>`, `<a class="skip" href="#main">\${esc(t.ui.skip)}</a>
\${DEMO ? \`<div class="demo-banner">\${esc(t.home.demoBanner)}</div>\` : ''}`);
// card status overlay (products + projects)
b.rep(`<div class="card-media">\${media(c, 'prod-' + (p.id === 'waw' ? 'waw' : p.id === 'sales' ? 'sales' : 'pharmacy'))}</div><span class="status\${dev ? ' status-dev' : ''}">\${esc(i.status)}</span>`,
  `<div class="card-media">\${media(c, 'prod-' + (p.id === 'waw' ? 'waw' : p.id === 'sales' ? 'sales' : 'pharmacy'))}<span class="status\${dev ? ' status-dev' : ''}">\${esc(i.status)}</span></div>`);
b.rep(`<div class="card-media">\${media(c, 'proj-' + x.id)}</div><span class="status">\${esc(p.types[x.type])}</span>`,
  `<div class="card-media">\${media(c, 'proj-' + x.id)}<span class="status">\${esc(p.types[x.type])}</span></div>`);

// block builders
b.rep(`function finalCta(`, `function partnersBlock(c) {
  if (!partners.length) return '';
  const h = c.t.home;
  const tile = (p) => {
    const name = p.name[c.loc] || p.name.en;
    const logo = p.logo && has('img/' + p.logo) ? \`<img src="\${c.asset('img/' + p.logo)}" alt="\${esc(name)}" loading="lazy">\` : \`<span class="partner-name" dir="auto">\${esc(name)}</span>\`;
    const inner = \`\${logo}\${isSample ? \`<span class="sample-tag">\${esc(h.sample)}</span>\` : ''}\`;
    return \`<li class="partner">\${p.url ? \`<a href="\${esc(p.url)}" target="_blank" rel="noopener noreferrer">\${inner}</a>\` : inner}</li>\`;
  };
  return \`<section class="sec sec-paper" id="partners"><div class="wrap">\${sectionHead(h.partnersTitle, h.partnersText, { eyebrow: 'WAW' })}<ul class="partners">\${partners.map(tile).join('')}</ul></div></section>\`;
}

function testimonialsBlock(c) {
  if (!testimonials.length) return '';
  const h = c.t.home;
  const initial = (n) => [...(n[c.loc] || n.en)][0] || '•';
  return \`<section class="sec" id="testimonials"><div class="wrap">\${sectionHead(h.testimonialsTitle, h.testimonialsText, { eyebrow: 'WAW' })}
  <ul class="quotes">\${testimonials.map((q) => \`<li class="quote"><span class="q-mark" aria-hidden="true">“</span>\${isSample ? \`<span class="sample-tag">\${esc(h.sample)}</span>\` : ''}
    <blockquote><p dir="auto">\${esc(q.quote[c.loc] || q.quote.en)}</p></blockquote>
    <div class="q-by"><span class="q-av" aria-hidden="true">\${esc(initial(q.name))}</span><div><b dir="auto">\${esc(q.name[c.loc] || q.name.en)}</b><span dir="auto">\${esc([q.role && (q.role[c.loc] || q.role.en), q.company && (q.company[c.loc] || q.company.en)].filter(Boolean).join(' · '))}</span></div></div>
  </li>\`).join('')}</ul></div></section>\`;
}

function finalCta(`);
b.rep(`<section class="sec sec-paper" id="faq">`, `\${testimonialsBlock(c)}

\${partnersBlock(c)}

<section class="sec sec-paper" id="faq">`);
fs.writeFileSync(root + '/build.mjs', b.src);

// ---------------- serve: --demo serves dist-demo
const sv = fs.readFileSync(root + '/../serve.mjs', 'utf8');
fs.writeFileSync(root + '/../serve.mjs', sv.replace(`const root = join(fileURLToPath(new URL('.', import.meta.url)), 'dist');`, `const root = join(fileURLToPath(new URL('.', import.meta.url)), process.argv.includes('--demo') ? 'dist-demo' : 'dist');`).replace(`Number(process.argv[2] || process.env.PORT || 4173)`, `Number(process.argv.slice(2).find((a) => /^\\d+$/.test(a)) || process.env.PORT || 4173)`));
const pk = JSON.parse(fs.readFileSync(root + '/../package.json', 'utf8'));
pk.scripts.demo = 'node src/build.mjs --demo && node serve.mjs 4180 --demo';
fs.writeFileSync(root + '/../package.json', JSON.stringify(pk, null, 2) + '\n');

// ---------------- css
fs.appendFileSync(root + '/assets/css/style.css', `
/* ===== cards v2 ===== */
.card, .card-lg, .why-item, .show { border-radius: 20px; }
.card-media { position: relative; margin: -24px -24px 20px; border-radius: 20px 20px 0 0; }
.card-media::after { content: ''; position: absolute; inset: auto 0 0 0; height: 40%; background: linear-gradient(to top, rgba(5, 46, 48, .35), transparent); pointer-events: none; }
.card-media .status { position: absolute; z-index: 1; inset-block-start: 14px; inset-inline-start: 14px; margin: 0; background: rgba(244, 247, 245, .94); box-shadow: 0 4px 14px rgba(5, 46, 48, .18); }
.card-media .status-dev { background: var(--gold); }
.prod h3, .proj h3 { font-size: 1.3rem; margin-bottom: .5rem; }
.prod-feature .card-media::after { background: linear-gradient(to top, rgba(5, 46, 48, .6), transparent); }
.projs { grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr)); }
.prods { grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); }
.card, .proj, .prod, .path, .svc-card { box-shadow: 0 1px 0 rgba(5, 46, 48, .04), 0 8px 24px rgba(5, 46, 48, .05); }
.proj, .prod { overflow: hidden; }
.proj:hover .card-media svg, .proj:hover .card-media img, .prod:hover .card-media svg, .prod:hover .card-media img { transform: scale(1.04); }
.card-media svg, .card-media img { transition: transform .5s ease; }
.path { position: relative; overflow: hidden; }
.path::after { content: ''; position: absolute; inset-inline-end: -30px; top: -30px; width: 110px; height: 110px; border-radius: 50%; background: radial-gradient(circle, rgba(255, 199, 91, .35), transparent 70%); }

/* partners */
.partners { display: grid; gap: 14px; grid-template-columns: repeat(2, 1fr); }
@media (min-width: 640px) { .partners { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1000px) { .partners { grid-template-columns: repeat(6, 1fr); } }
.partner { position: relative; background: var(--white); border: 1px solid var(--line); border-radius: 18px; min-height: 104px; display: grid; place-items: center; padding: 18px; transition: transform .2s, box-shadow .2s, border-color .2s; }
.partner:hover { transform: translateY(-3px); box-shadow: 0 14px 30px rgba(5, 46, 48, .1); border-color: var(--gold); }
.partner a { display: grid; place-items: center; width: 100%; height: 100%; text-decoration: none; }
.partner img { max-height: 48px; width: auto; max-width: 100%; object-fit: contain; filter: grayscale(1); opacity: .8; transition: filter .2s, opacity .2s; }
.partner:hover img { filter: none; opacity: 1; }
.partner-name { font-weight: 700; color: var(--pine); text-align: center; }

/* testimonials */
.quotes { display: grid; gap: 18px; }
@media (min-width: 720px) { .quotes { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1040px) { .quotes { grid-template-columns: repeat(3, 1fr); } }
.quote { position: relative; background: var(--night); color: var(--paper); border-radius: 22px; padding: 34px 28px 26px; display: flex; flex-direction: column; overflow: hidden; }
.quote:nth-child(3n+2) { background: var(--pine); }
.q-mark { position: absolute; inset-inline-end: 22px; top: -14px; font-size: 7rem; line-height: 1; color: var(--gold); opacity: .9; font-family: Georgia, serif; }
.quote blockquote { margin: 0 0 1.6rem; flex: 1; }
.quote blockquote p { font-size: 1.1rem; line-height: 1.7; margin: 0; }
.q-by { display: flex; align-items: center; gap: 14px; border-top: 1px solid rgba(184, 230, 213, .25); padding-top: 18px; }
.q-av { width: 46px; height: 46px; border-radius: 50%; background: var(--gold); color: var(--night); display: grid; place-items: center; font-weight: 700; flex: none; }
.q-by b { display: block; }
.q-by span:not(.q-av) { color: var(--mint); font-size: .9rem; }

.sample-tag { position: absolute; inset-block-start: 10px; inset-inline-start: 10px; background: #a4161a; color: #fff; font-size: .7rem; font-weight: 700; letter-spacing: .08em; padding: .15rem .5rem; border-radius: 6px; text-transform: uppercase; z-index: 2; }
.demo-banner { background: #a4161a; color: #fff; text-align: center; padding: .55rem 1rem; font-weight: 600; font-size: .92rem; }
`);
console.log('patched');
