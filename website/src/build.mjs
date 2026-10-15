// Static site generator: node src/build.mjs  ->  dist/
// Env: SITE_ORIGIN (https://example.com, enables canonical/hreflang/sitemap), CONTACT_ENDPOINT (form POST URL).
// --prod: production build. Refuses to run unless SITE_ORIGIN is a valid public https origin (see origin.mjs). Default build is unchanged.
// --staging: private pre-production build (writes dist/). Every page, including the root redirect and the 404 pages, carries
//   <meta name="robots" content="noindex"> and a <meta name="waw-build" content="staging"> marker. SITE_ORIGIN is ignored: no
//   canonical, hreflang, og:url, sitemap.xml or robots.txt. No robots.txt Disallow is written on purpose: a crawler that is allowed
//   in must be able to read the noindex directive. Preferred protection is access control at the hosting layer (password, SSO or
//   IP allow-list); noindex is the second line. Never upload a staging build to production. Cannot be combined with --prod/--demo.
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import L, { company, products, projects, serviceGroups, social, partners as realPartners, testimonials as realTestimonials, demoPartners, demoTestimonials } from './content.mjs';
import { artSvg } from './art.mjs';
import { validateOrigin } from './origin.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const DEMO = process.argv.includes('--demo');
const dist = join(here, '..', DEMO ? 'dist-demo' : 'dist');
const partners = DEMO && !realPartners.length ? demoPartners : realPartners;
const testimonials = DEMO && !realTestimonials.length ? demoTestimonials : realTestimonials;
const isSample = DEMO && !realPartners.length;
const PROD = process.argv.includes('--prod');
const STAGING = process.argv.includes('--staging');
// Incompatible modes are refused before any output is computed or written, so dist/ and dist-demo/ stay untouched.
if (STAGING && (PROD || DEMO)) {
  const clash = [PROD && '--prod', DEMO && '--demo'].filter(Boolean).join(' and ');
  const why = PROD
    ? 'a staging build must never carry a production origin or be mistaken for the production build'
    : 'demo output contains placeholder content';
  console.error(`Staging build refused: --staging cannot be combined with ${clash} (${why}).\nNo files were written.`);
  process.exit(1);
}
// Present only in staging output, on every HTML page, so tooling can tell a staging build from a production one.
const BUILD_MARK = STAGING ? '<meta name="waw-build" content="staging">' : '';
// Demo and staging output never carry a site origin: no canonical, hreflang, sitemap or robots.txt for them.
const origin = PROD ? productionOrigin() : (DEMO || STAGING) ? '' : (process.env.SITE_ORIGIN || '').replace(/\/$/, '');
// Runs before anything is written, so a refused production build leaves dist/ untouched. Reads env; does not modify it.
function productionOrigin() {
  const r = DEMO
    ? { ok: false, error: '--prod cannot be combined with --demo (demo output contains placeholder content).' }
    : validateOrigin(process.env.SITE_ORIGIN);
  if (!r.ok) {
    console.error(`Production build refused: ${r.error}\nNo files were written. Use "npm run build" for a local build.`);
    process.exit(1);
  }
  return r.origin;
}
const endpoint = process.env.CONTACT_ENDPOINT || '';
const LOCALES = ['en', 'ar'];
// The Projects route, nav/footer links and home section exist only while at least one project is published (publish:true in content.mjs).
const HAS_PROJECTS = projects.some((x) => x.publish);

const ROUTES = {
  home: '', about: 'about', services: 'services',
  'think-design': 'services/think-design', 'build-connect': 'services/build-connect', 'support-continuity': 'services/support-continuity',
  products: 'products', projects: 'projects', how: 'how-we-work', stage: 'your-next-stage', contact: 'contact', privacy: 'privacy',
};

// ---- brand symbol (from the supplied waw-white.svg; paths unchanged, body colour via currentColor)
const svgSrc = readFileSync(join(here, '..', '..', 'waw-white.svg'), 'utf8');
const [bodyD, dotD] = [...svgSrc.matchAll(/ d="([^"]+)"/g)].map((m) => m[1]);
const symbol = (cls = '') => `<svg class="sym ${cls}" viewBox="75 80 1000 1240" aria-hidden="true" focusable="false"><path fill="currentColor" fill-rule="evenodd" d="${bodyD}"/><path fill="#FFC75B" fill-rule="evenodd" d="${dotD}"/></svg>`;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const has = (p) => existsSync(join(here, 'assets', p));
const firstExisting = (base, exts) => exts.map((e) => `${base}.${e}`).find(has);

// Real image if one is dropped in src/assets/img/<key>.(webp|jpg|png), else the built-in brand illustration.
function media(c, key, alt = '', { w = 800, h = 500, lazy = true } = {}) {
  const file = firstExisting(`img/${key}`, ['webp', 'jpg', 'jpeg', 'png']);
  if (file) return `<img src="${c.asset(file)}" alt="${esc(alt)}" width="${w}" height="${h}"${lazy ? ' loading="lazy"' : ''}>`;
  return artSvg(key).replace('role="presentation"', alt ? `role="img" aria-label="${esc(alt)}"` : 'role="presentation"');
}

// ---- page context helpers
function ctx(loc, route) {
  const t = L[loc];
  const depth = 1 + (ROUTES[route] ? ROUTES[route].split('/').length : 0);
  const up = '../'.repeat(depth);
  return {
    loc, t, route, up,
    asset: (p) => `${up}assets/${p}`,
    to: (r, hash = '', l = loc) => `${up}${l}/${ROUTES[r]}${ROUTES[r] ? '/' : ''}${hash}`,
    toRoot: `${up}`,
  };
}

const arrow = (c) => `<span class="arr" aria-hidden="true">${c.loc === 'ar' ? '←' : '→'}</span>`;
const btn = (href, label, kind = 'primary', c) => `<a class="btn btn-${kind}" href="${href}">${esc(label)}${c ? arrow(c) : ''}</a>`;
const contactHref = (c, interest) => `${c.to('contact')}${interest ? `?interest=${interest}` : ''}#form`;

// ---- social links (rendered only when a URL is set in content.mjs)
const socialMeta = {
  linkedin: ['LinkedIn', 'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.800 2.600 4.800 6V21h-4v-5c0-1.300 0-3-1.900-3s-2.100 1.400-2.100 2.900V21h-4z'],
  instagram: ['Instagram', 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm5 3.500a4.500 4.500 0 1 1 0 9 4.500 4.500 0 0 1 0-9zm0 2a2.500 2.500 0 1 0 0 5 2.500 2.500 0 0 0 0-5zM17.500 5.500a1 1 0 1 1 0 2 1 1 0 0 1 0-2z'],
  x: ['X', 'M17.800 3h3l-6.600 7.600L22 21h-6.100l-4.800-6.200L5.600 21h-3l7.100-8.100L2 3h6.200l4.300 5.700zm-1 16.200h1.700L7.300 4.700H5.500z'],
  facebook: ['Facebook', 'M13.500 22v-8.500h2.900l.5-3.400h-3.400V8c0-1 .3-1.700 1.700-1.700H17V3.300C16.700 3.300 15.700 3.200 14.500 3.200c-2.500 0-4.200 1.500-4.200 4.300v2.600H7.400v3.400h2.900V22z'],
  youtube: ['YouTube', 'M21.600 7.200a2.500 2.500 0 0 0-1.800-1.800C18.200 5 12 5 12 5s-6.200 0-7.800.4a2.500 2.500 0 0 0-1.800 1.800C2 8.800 2 12 2 12s0 3.200.4 4.800a2.500 2.500 0 0 0 1.800 1.800C5.800 19 12 19 12 19s6.200 0 7.800-.4a2.500 2.500 0 0 0 1.800-1.800c.4-1.600.4-4.800.4-4.800s0-3.200-.4-4.800zM10 15V9l5.200 3z'],
  tiktok: ['TikTok', 'M16.600 2h-3.200v13.300a2.700 2.700 0 1 1-2.700-2.700c.3 0 .6 0 .8.100V9.400a6 6 0 1 0 5.100 5.900V8.500a7.300 7.300 0 0 0 4.200 1.300V6.600A4.300 4.300 0 0 1 16.600 2z'],
  whatsapp: ['WhatsApp', 'M12 2a10 10 0 0 0-8.600 15.100L2 22l5-1.300A10 10 0 1 0 12 2zm0 18.200c-1.500 0-3-.4-4.200-1.200l-.3-.2-3 .8.8-2.900-.2-.3A8.200 8.200 0 1 1 12 20.200zm4.500-6.100c-.2-.1-1.500-.7-1.700-.8s-.4-.1-.6.100l-.8 1c-.1.200-.3.200-.5.100a6.700 6.700 0 0 1-3.300-2.900c-.2-.4.200-.4.700-1.300.1-.2 0-.3 0-.5l-.8-1.800c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.300 3 3 0 0 0-.9 2.200c0 1.300.9 2.500 1 2.700s1.800 2.800 4.400 3.900c1.600.7 2.200.7 3 .6.500-.1 1.500-.6 1.700-1.200s.2-1.100.2-1.200-.2-.2-.5-.3z'],
};
const socialLinks = (c, cls = '') => {
  const items = social.filter((s) => s.url && socialMeta[s.id]);
  if (!items.length) return '';
  return `<ul class="social ${cls}" aria-label="${esc(c.t.ui.followUs)}">${items.map((s) => {
    const [name, d] = socialMeta[s.id];
    return `<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(c.t.ui.socialOn)} ${name}"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="${d}"/></svg></a></li>`;
  }).join('')}</ul>`;
};

// ---- shared chrome
function header(c) {
  const { t } = c;
  const items = t.nav.filter(([r]) => r !== 'projects' || HAS_PROJECTS).map(([r, label]) => `<li><a href="${c.to(r)}"${c.route === r || (r === 'services' && ROUTES[c.route]?.startsWith('services/')) ? ' aria-current="page"' : ''}>${esc(label)}</a></li>`).join('');
  return `<header class="site-header" data-header>
  <div class="wrap bar">
    <a class="brand" href="${c.to('home')}" aria-label="${esc(t.brandName)}">${symbol('brand-sym')}<span class="brand-text"><b>CIRCLES</b><small>TECHNOLOGIES</small></span></a>
    <nav id="nav" class="nav" aria-label="${esc(t.ui.menu)}"><ul>${items}</ul></nav>
    <div class="bar-actions">
      <a class="lang" href="${c.to(c.route, '', t.otherLang)}" hreflang="${t.otherLang}" lang="${t.otherLang}" aria-label="${esc(t.otherName)}">${esc(t.otherLabel)}</a>
      <a class="btn btn-primary btn-sm cta-head" href="${contactHref(c)}">${esc(t.ui.cta)}</a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav" data-menu><span class="sr">${esc(t.ui.menu)}</span><span class="bars" aria-hidden="true"></span></button>
    </div>
  </div>
</header>`;
}

function footer(c) {
  const { t } = c;
  const nv = (r) => t.nav.find(([k]) => k === r)[1];
  const explore = [['home', t.ui.home], ['about', nv('about')], ['products', nv('products')], ...(HAS_PROJECTS ? [['projects', nv('projects')]] : []), ['how', nv('how')], ['stage', nv('stage')]];
  const groups = serviceGroups.map((g) => [g.id, t.services.groups[g.id].title]);
  return `<footer class="site-footer">
  <div class="wrap foot-grid">
    <div class="foot-brand">
      <a class="brand" href="${c.to('home')}" aria-label="${esc(t.brandName)}">${symbol('brand-sym')}<span class="brand-text"><b>CIRCLES</b><small>TECHNOLOGIES</small></span></a>
      <p class="foot-tag">${esc(t.tagline)}</p>
      <p class="foot-line">${esc(t.brandLine)}</p>
      <p class="foot-actions"><a class="btn btn-primary btn-sm" href="${contactHref(c)}">${esc(t.ui.cta)}</a><a class="lang" href="${c.to(c.route, '', t.otherLang)}" hreflang="${t.otherLang}" lang="${t.otherLang}">${esc(t.otherLabel)}</a></p>
      ${socialLinks(c)}
    </div>
    <nav class="foot-col" aria-labelledby="ft-services"><h2 id="ft-services">${esc(t.ui.footerServices)}</h2><ul>${groups.map(([r, l]) => `<li><a href="${c.to(r)}">${esc(l)}</a></li>`).join('')}<li><a href="${c.to('services')}">${esc(t.groupPage.allServices)}</a></li></ul></nav>
    <nav class="foot-col" aria-labelledby="ft-explore"><h2 id="ft-explore">${esc(t.ui.footerNav)}</h2><ul>${explore.map(([r, l]) => `<li><a href="${c.to(r)}">${esc(l)}</a></li>`).join('')}</ul></nav>
    <div class="foot-col"><h2>${esc(t.ui.footerContact)}</h2>
      <dl class="foot-dl">
        <dt>${esc(t.ui.emailLabel)}</dt><dd class="ltr"><a href="mailto:${company.email}">${company.email}</a></dd>
        <dt>${esc(t.ui.addressLabel)}</dt><dd>${esc(company.address[c.loc])}</dd>
        <dt>${esc(t.ui.licenceLabel)}</dt><dd class="ltr">${company.licence}</dd>
      </dl>
      <p class="foot-links"><a href="${c.to('contact')}">${esc(t.ui.contactUs)}</a> <span aria-hidden="true">·</span> <a href="${c.to('privacy')}">${esc(t.privacy.h1)}</a></p>
    </div>
  </div>
  <div class="wrap foot-base"><p>© ${new Date().getFullYear()} <bdi>${esc(company.legal)}</bdi>. ${esc(t.ui.rights)}</p><a class="to-top" href="#main">${esc(t.ui.backToTop)} <span aria-hidden="true">↑</span></a></div>
</footer>`;
}

function document_(c, body, { title, desc, noindex: pageNoindex = false, bodyClass = '' }) {
  const { t } = c;
  const noindex = pageNoindex || DEMO || STAGING; // every demo and staging page is noindex, so a mis-deployed folder is not indexed
  const path = ROUTES[c.route];
  const alt = (l) => `${origin}/${l}/${path}${path ? '/' : ''}`;
  const seo = origin && !noindex
    ? `<link rel="canonical" href="${alt(c.loc)}">
<link rel="alternate" hreflang="en" href="${alt('en')}"><link rel="alternate" hreflang="ar" href="${alt('ar')}"><link rel="alternate" hreflang="x-default" href="${origin}/ar/${path}${path ? '/' : ''}">
<meta property="og:url" content="${alt(c.loc)}">` : '';
  const ld = c.route === 'home' ? `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Organization', name: company.legal, alternateName: company.legalAr,
    email: company.email, address: { '@type': 'PostalAddress', streetAddress: 'Business Centre, Sharjah Publishing City Free Zone', addressLocality: 'Sharjah', addressCountry: 'AE' },
    ...(origin ? { url: origin } : {}),
    ...(social.some((s) => s.url) ? { sameAs: social.filter((s) => s.url).map((s) => s.url) } : {}),
  })}</script>` : '';
  return `<!doctype html>
<html lang="${t.lang}" dir="${t.dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${noindex ? '<meta name="robots" content="noindex">' : ''}${BUILD_MARK}
<meta name="theme-color" content="#052E30">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:locale" content="${t.lang === 'ar' ? 'ar_AE' : 'en_AE'}">
${seo}
<link rel="icon" href="${c.asset('img/favicon.svg')}" type="image/svg+xml">
<link rel="preload" href="${c.asset(t.lang === 'ar' ? 'fonts/cairo-arabic.woff2' : 'fonts/space-grotesk-latin.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${c.asset('css/fonts.css')}">
<link rel="stylesheet" href="${c.asset('css/style.css')}">
<script src="${c.asset('js/boot.js')}"></script>
${ld}
</head>
<body class="${bodyClass}">
<a class="skip" href="#main">${esc(t.ui.skip)}</a>
${DEMO ? `<div class="demo-banner">${esc(t.home.demoBanner)}</div>` : ''}
${header(c)}
<main id="main">
${body}
</main>
${footer(c)}
<script src="${c.asset('js/config.js')}"></script>
<script src="${c.asset('js/main.js')}" defer></script>
</body>
</html>`;
}

// ---- reusable blocks
const ICONS = {"globe":"M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.600 3.500 5.600 3.500 9s-1 6.400-3.500 9c-2.500-2.600-3.500-5.600-3.500-9S9.500 5.600 12 3z","cart":"M3 4h2.500l2.200 10.500h9.600L19.500 7H6.200M9.500 19.500a1 1 0 1 0 0 .01M16.500 19.500a1 1 0 1 0 0 .01","phone":"M8 2.500h8a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-15a2 2 0 0 1 2-2zM10.500 18.500h3","chart":"M4 20V10M10 20V4M16 20v-7M22 20H2","link":"M10 14a4 4 0 0 0 5.700 0l3-3a4 4 0 0 0-5.700-5.700l-1 1M14 10a4 4 0 0 0-5.700 0l-3 3a4 4 0 0 0 5.700 5.700l1-1","check":"M4 12.500l5 5L20 6.500"};
const icon = (k) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${ICONS[k]}"/></svg>`;
const sectionHead = (title, text, { eyebrow = '', center = false } = {}) => `<div class="sec-head${center ? ' center' : ''}">${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}<h2>${esc(title)}</h2>${text ? `<p class="lede">${esc(text)}</p>` : ''}</div>`;

function pageHero(c, h1, lead, crumb) {
  const { t } = c;
  const trail = crumb
    ? `<nav class="crumbs" aria-label="${esc(t.ui.breadcrumb)}"><ol><li><a href="${c.to('home')}">${esc(t.ui.home)}</a></li>${crumb.map(([r, l], i) => `<li>${i === crumb.length - 1 ? `<span aria-current="page">${esc(l)}</span>` : `<a href="${c.to(r)}">${esc(l)}</a>`}</li>`).join('')}</ol></nav>` : '';
  return `<section class="page-hero"><div class="rings" aria-hidden="true"><i></i><i></i><i></i></div><div class="wrap">${trail}<h1>${esc(h1)}</h1><p class="lede">${esc(lead)}</p></div></section>`;
}

function serviceCard(c, id) {
  const s = c.t.svc[id];
  const group = serviceGroups.find((g) => g.services.includes(id)).id;
  return `<li class="card svc-card"><h3>${esc(s.title)}</h3><p>${esc(s.need)}</p><a class="text-link" href="${c.to(group, '#' + id)}">${esc(c.t.ui.learnMore)}${arrow(c)}</a></li>`;
}

function groupBlock(c, g, { withServices = true } = {}) {
  const info = c.t.services.groups[g.id];
  return `<article class="group card-lg">
    <h3>${esc(info.title)}</h3><p>${esc(info.text)}</p>
    ${withServices ? `<ul class="chips">${g.services.map((s) => `<li>${esc(c.t.svc[s].title)}</li>`).join('')}</ul>` : ''}
    <a class="text-link" href="${c.to(g.id)}">${esc(c.t.ui.learnMore)}${arrow(c)}</a>
  </article>`;
}

// Card titles use h3 inside home sections (they sit under a section h2). On pages where the cards are the page's own sections
// (How we work, Products, Your next stage, Projects) the title is an h2, so no level is skipped under the page h1.
// style.css keeps the h2 variants visually identical to the h3 ones.
function stepsBlock(c, detailed = false, level = 3) {
  return `<ol class="steps">${c.t.process.steps.map((s) => `<li class="step"><span class="step-n" aria-hidden="true">${s.n}</span><h${level}>${esc(s.title)}</h${level}><p>${esc(s.text)}</p>${detailed ? `<dl class="step-dl"><dt>${esc(c.t.ui.youBring)}</dt><dd>${esc(s.bring)}</dd><dt>${esc(c.t.ui.wawDoes)}</dt><dd>${esc(s.does)}</dd></dl>` : ''}</li>`).join('')}</ol>`;
}

function pathwayCards(c, full = false, level = 3) {
  return `<ul class="paths">${c.t.stage.items.map((p) => `<li class="card path path-${p.id}" id="${full ? p.id : ''}"><span class="badge">${esc(p.label)}</span><h${level}>${esc(p.title)}</h${level}><p>${esc(p.text)}</p><p class="outputs">${esc(p.outputs)}</p>${full ? btn(contactHref(c, p.interest), c.t.stage.cta, 'primary', c) : `<a class="text-link" href="${c.to('stage', '#' + p.id)}">${esc(c.t.ui.learnMore)}${arrow(c)}</a>`}</li>`).join('')}</ul>`;
}

function productCards(c, cta = true, level = 3) {
  return `<ul class="prods">${products.filter((p) => p.publish).map((p) => {
    const i = c.t.products.items[p.id];
    const dev = p.id === 'waw';
    return `<li class="card prod${dev ? ' prod-feature' : ''}"><div class="card-media">${media(c, 'prod-' + (p.id === 'waw' ? 'waw' : p.id === 'sales' ? 'sales' : 'pharmacy'))}<span class="status${dev ? ' status-dev' : ''}">${esc(i.status)}</span></div><h${level}>${esc(i.title)}</h${level}><p>${esc(i.text)}</p>${i.line ? `<p class="prod-line">${esc(i.line)}</p>` : ''}${cta ? `<a class="text-link" href="${contactHref(c, p.href)}">${esc(i.cta)}${arrow(c)}</a>` : ''}</li>`;
  }).join('')}</ul>`;
}

function projectCards(c, cta = false, level = 3) {
  const p = c.t.projects;
  return `<ul class="projs">${projects.filter((x) => x.publish).map((x) => `<li class="card proj"><div class="card-media">${media(c, 'proj-' + x.id)}<span class="status">${esc(p.types[x.type])}</span></div><h${level} dir="auto">${esc(x.name[c.loc])}</h${level}>${cta ? `<a class="text-link" href="${contactHref(c)}">${esc(p.cta)}${arrow(c)}</a>` : ''}</li>`).join('')}</ul>`;
}

function partnersBlock(c) {
  if (!partners.length) return '';
  const h = c.t.home;
  const tile = (p) => {
    const name = p.name[c.loc] || p.name.en;
    const logo = p.logo && has('img/' + p.logo) ? `<img src="${c.asset('img/' + p.logo)}" alt="${esc(name)}" loading="lazy">` : `<span class="partner-name" dir="auto">${esc(name)}</span>`;
    const inner = `${logo}${isSample ? `<span class="sample-tag">${esc(h.sample)}</span>` : ''}`;
    return `<li class="partner">${p.url ? `<a href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">${inner}</a>` : inner}</li>`;
  };
  return `<section class="sec sec-paper" id="partners"><div class="wrap">${sectionHead(h.partnersTitle, h.partnersText, { eyebrow: 'WAW' })}<ul class="partners">${partners.map(tile).join('')}</ul></div></section>`;
}

function testimonialsBlock(c) {
  if (!testimonials.length) return '';
  const h = c.t.home;
  const initial = (n) => [...(n[c.loc] || n.en)][0] || '•';
  return `<section class="sec" id="testimonials"><div class="wrap">${sectionHead(h.testimonialsTitle, h.testimonialsText, { eyebrow: 'WAW' })}
  <ul class="quotes">${testimonials.map((q) => `<li class="quote"><span class="q-mark" aria-hidden="true">“</span>${isSample ? `<span class="sample-tag">${esc(h.sample)}</span>` : ''}
    <blockquote><p dir="auto">${esc(q.quote[c.loc] || q.quote.en)}</p></blockquote>
    <div class="q-by"><span class="q-av" aria-hidden="true">${esc(initial(q.name))}</span><div><b dir="auto">${esc(q.name[c.loc] || q.name.en)}</b><span dir="auto">${esc([q.role && (q.role[c.loc] || q.role.en), q.company && (q.company[c.loc] || q.company.en)].filter(Boolean).join(' · '))}</span></div></div>
  </li>`).join('')}</ul></div></section>`;
}

function finalCta(c, title, text) {
  return `<section class="cta-band"><div class="rings" aria-hidden="true"><i></i><i></i><i></i></div><div class="wrap"><h2>${esc(title)}</h2><p class="lede">${esc(text)}</p>${btn(contactHref(c), c.t.ui.cta, 'primary', c)}</div></section>`;
}

// ---- slider art (replaced by assets/img/slides/slide-N.(jpg|webp|png) when present)
function slideArt(id) {
  const base = `<defs><linearGradient id="g-${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#07534C"/><stop offset="1" stop-color="#052E30"/></linearGradient></defs><rect width="800" height="500" fill="url(#g-${id})"/>`;
  const rings = '<g fill="none" stroke="#B8E6D5" stroke-opacity=".22"><circle cx="560" cy="250" r="90"/><circle cx="560" cy="250" r="150"/><circle cx="560" cy="250" r="215"/></g>';
  const art = {
    'think-design': '<g stroke="#B8E6D5" stroke-width="3" fill="none" stroke-linecap="round"><path d="M430 340 C480 240 540 330 580 230 S680 170 710 120"/></g><g fill="#B8E6D5"><circle cx="430" cy="340" r="13"/><circle cx="520" cy="285" r="13"/><circle cx="600" cy="220" r="13"/><circle cx="660" cy="175" r="13"/></g><circle cx="710" cy="120" r="20" fill="#FFC75B"/>',
    'build-connect': '<g fill="none" stroke="#B8E6D5" stroke-width="3"><rect x="410" y="150" width="150" height="200" rx="18"/><rect x="520" y="110" width="210" height="140" rx="14"/><path d="M560 300h90M650 300v60"/></g><circle cx="650" cy="360" r="16" fill="#FFC75B"/><g fill="#B8E6D5" opacity=".7"><rect x="432" y="176" width="70" height="10" rx="5"/><rect x="432" y="200" width="100" height="10" rx="5"/><rect x="545" y="136" width="120" height="10" rx="5"/></g>',
    'support-continuity': '<g fill="none" stroke="#B8E6D5" stroke-width="10" stroke-linecap="round"><path d="M470 250a90 90 0 0 1 150-66"/><path d="M650 250a90 90 0 0 1-150 66"/></g><path d="M610 160l30 24-38 8z" fill="#B8E6D5"/><path d="M510 340l-30-24 38-8z" fill="#B8E6D5"/><circle cx="560" cy="250" r="22" fill="#FFC75B"/>',
    waw: '<g fill="none" stroke="#B8E6D5" stroke-width="4" stroke-linejoin="round"><rect x="490" y="230" width="140" height="110" rx="10"/><rect x="480" y="195" width="160" height="40" rx="10"/><path d="M560 195v145"/><path d="M560 195c-30-50-80-30-60 0M560 195c30-50 80-30 60 0"/></g><circle cx="560" cy="195" r="14" fill="#FFC75B"/>',
  };
  return `<svg viewBox="0 0 800 500" role="presentation" preserveAspectRatio="xMidYMid slice">${base}${rings}${art[id]}</svg>`;
}

function slider(c) {
  const { t } = c;
  const slides = t.slides.map((s, i) => {
    const img = firstExisting(`img/slides/slide-${i + 1}`, ['webp', 'jpg', 'jpeg', 'png']);
    const media = img ? `<img src="${c.asset(img)}" alt="" width="800" height="500" loading="lazy">` : slideArt(s.id);
    return `<li class="slide" id="slide-${i + 1}" role="group" aria-roledescription="slide" aria-label="${i + 1} / ${t.slides.length}">
      <div class="slide-media">${media}</div>
      <div class="slide-copy"><p class="eyebrow">${esc(s.kicker)}</p><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p><a class="text-link" href="${c.to(s.href)}">${esc(t.ui.learnMore)}${arrow(c)}</a></div>
    </li>`;
  }).join('');
  const dots = t.slides.map((_, i) => `<button type="button" class="dot" data-dot="${i}" aria-label="${esc(t.ui.goToSlide)} ${i + 1}"></button>`).join('');
  return `<section class="slider-sec" aria-roledescription="carousel" aria-label="${esc(t.home.sliderTitle)}" data-slider data-pause="${esc(t.ui.pauseSlider)}" data-play="${esc(t.ui.playSlider)}">
  <div class="wrap">
    ${sectionHead(t.home.sliderTitle, t.home.sliderText)}
    <ul class="track" data-track tabindex="0" aria-live="off">${slides}</ul>
    <div class="slider-ui">
      <button type="button" class="ctl" data-prev aria-label="${esc(t.ui.previous)}"><span aria-hidden="true">${c.loc === 'ar' ? '→' : '←'}</span></button>
      <div class="dots">${dots}</div>
      <button type="button" class="ctl" data-next aria-label="${esc(t.ui.next)}"><span aria-hidden="true">${c.loc === 'ar' ? '←' : '→'}</span></button>
      <button type="button" class="ctl ctl-play" data-toggle aria-label="${esc(t.ui.pauseSlider)}"><span aria-hidden="true">❚❚</span></button>
    </div>
  </div>
</section>`;
}

// ---- pages
const pages = {};

pages.home = (c) => {
  const { t } = c; const h = t.home;
  const vid = firstExisting('video/hero', ['mp4']);
  const webm = firstExisting('video/hero', ['webm']);
  const poster = firstExisting('img/hero-poster', ['jpg', 'webp', 'png']);
  const video = vid || webm ? `<video class="hero-video" muted loop playsinline preload="none"${poster ? ` poster="${c.asset(poster)}"` : ''} aria-hidden="true" data-video>${webm ? `<source src="${c.asset(webm)}" type="video/webm">` : ''}${vid ? `<source src="${c.asset(vid)}" type="video/mp4">` : ''}</video>` : '';
  const toggle = video ? `<button type="button" class="vid-toggle" data-vid-toggle data-pause="${esc(t.ui.pauseVideo)}" data-play="${esc(t.ui.playVideo)}" aria-label="${esc(t.ui.pauseVideo)}"><span aria-hidden="true">❚❚</span></button>` : '';
  return `<section class="hero">
  <div class="hero-bg" aria-hidden="true">${video}<div class="rings rings-lg"><i></i><i></i><i></i><i></i></div><div class="hero-shade"></div></div>
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <p class="eyebrow">${esc(h.eyebrow)}</p>
      <h1>${esc(t.tagline.replace(/«?واو»?\.?$/, '').replace(/WAW\.$/, ''))}<span class="gold">${t.lang === 'ar' ? '«واو».' : 'WAW.'}</span></h1>
      <p class="lede">${esc(h.lead)}</p>
      <div class="btn-row">${btn(contactHref(c), t.ui.cta, 'primary', c)}${btn(c.to('services'), h.secondary, 'ghost', c)}</div>
      <ul class="chips-row">${h.chips.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
      <p class="hero-sub">${esc(t.taglineSub)}</p>
    </div>
    ${video ? '' : `<div class="hero-mark" aria-hidden="true">${symbol('hero-sym')}</div>`}
  </div>
  ${toggle}
</section>

<section class="facts" aria-label="WAW"><div class="wrap"><ul>${h.facts.map(([n, l]) => `<li><b>${esc(n)}</b><span>${esc(l)}</span></li>`).join('')}</ul></div></section>

<section class="marquee" aria-hidden="true"><div class="marquee-track">${[0, 1].map(() => `<ul>${h.marquee.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`).join('')}</div></section>

<section class="sec showcase-sec" id="services"><div class="wrap">
  ${sectionHead(h.showcaseTitle, h.showcaseText, { eyebrow: t.nav[0][1] })}
  <ul class="showcase">${h.showcase.map(([ic, ti, tx, sv]) => `<li class="card show"><span class="show-ic">${icon(ic)}</span><h3>${esc(ti)}</h3><p>${esc(tx)}</p><a class="text-link" href="${c.to(serviceGroups.find((g) => g.services.includes(sv)).id, '#' + sv)}">${esc(t.ui.learnMore)}${arrow(c)}</a></li>`).join('')}</ul>
  <div class="group-links">${serviceGroups.map((g) => `<a class="group-link" href="${c.to(g.id)}"><span>${esc(t.services.groups[g.id].title)}</span>${arrow(c)}</a>`).join('')}</div>
  <p class="more">${btn(c.to('services'), t.ui.exploreServices, 'dark', c)}</p>
</div></section>

<section class="sec sec-paper" id="about"><div class="wrap split">
  <div>${sectionHead(h.aboutTitle, '', { eyebrow: t.nav.find(([k]) => k === 'about')[1] })}<p class="lede">${esc(h.aboutText)}</p>${btn(c.to('about'), h.aboutLink, 'dark', c)}</div>
  <div><div class="photo">${media(c, 'about-1')}</div><ul class="points">${h.points.map(([a, d]) => `<li><h3>${esc(a)}</h3><p>${esc(d)}</p></li>`).join('')}</ul></div>
</div></section>

${slider(c)}

<section class="sec why" id="why"><div class="wrap">
  ${sectionHead(h.whyTitle, h.whyText, { eyebrow: 'WAW' })}
  <ol class="why-grid">${h.why.map(([a, d], i) => `<li class="why-item"><span class="why-n" aria-hidden="true">0${i + 1}</span><h3>${esc(a)}</h3><p>${esc(d)}</p></li>`).join('')}</ol>
</div></section>

<section class="sec sec-night" id="how"><div class="wrap">
  ${sectionHead(h.howTitle, h.howText, { eyebrow: t.nav.find(([k]) => k === 'how')[1] })}
  ${stepsBlock(c)}
  <p class="more">${btn(c.to('how'), t.ui.learnMore, 'ghost', c)}</p>
</div></section>

<section class="sec sec-paper" id="stage"><div class="wrap">
  ${sectionHead(h.stageTitle, h.stageText, { eyebrow: t.nav.find(([k]) => k === 'stage')[1] })}
  ${pathwayCards(c)}
</div></section>

${HAS_PROJECTS ? `<section class="sec" id="projects"><div class="wrap">
  ${sectionHead(h.projectsTitle, h.projectsText, { eyebrow: t.nav.find(([k]) => k === 'projects')[1] })}
  ${projectCards(c)}
  <p class="more">${btn(c.to('projects'), t.ui.viewAll, 'dark', c)}</p>
</div></section>` : ''}

<section class="sec sec-paper" id="products"><div class="wrap">
  ${sectionHead(h.productsTitle, h.productsText, { eyebrow: t.nav.find(([k]) => k === 'products')[1] })}
  ${productCards(c)}
  <p class="more">${btn(c.to('products'), t.ui.viewAll, 'dark', c)}</p>
</div></section>

${testimonialsBlock(c)}

${partnersBlock(c)}

<section class="sec sec-paper" id="faq"><div class="wrap narrow">
  ${sectionHead(h.faqTitle, h.faqText, { eyebrow: 'FAQ' })}
  <div class="faq">${h.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>
</div></section>

${finalCta(c, h.contactTitle, h.contactText)}`;
};

pages.about = (c) => {
  const a = c.t.about;
  return `${pageHero(c, a.h1, a.lead, [['about', a.h1]])}
<section class="sec"><div class="wrap split">
  <div>${sectionHead(a.povTitle, '')}<p class="lede">${esc(a.povText)}</p>
    <h3 class="mt">${esc(a.bilingualTitle)}</h3><p>${esc(a.bilingualText)}</p>
    <div class="photo mt">${media(c, 'about-2')}</div></div>
  <div><h2 class="h3">${esc(a.factsTitle)}</h2><dl class="facts-dl">${a.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd${/^[\x00-\x7F]+$/.test(v) ? ' dir="ltr"' : ''}${/[\u0600-\u06FF]/.test(v) ? (c.loc === 'ar' ? '' : ' lang="ar"') : (c.loc === 'ar' && /[A-Za-z]/.test(v) ? ' lang="en"' : '')}>${esc(v)}</dd></div>`).join('')}</dl></div>
</div></section>
<section class="sec sec-paper"><div class="wrap">${sectionHead(c.t.home.servicesTitle, c.t.home.servicesText)}<div class="groups">${serviceGroups.map((g) => groupBlock(c, g, { withServices: false })).join('')}</div></div></section>
${finalCta(c, c.t.home.contactTitle, c.t.home.contactText)}`;
};

pages.services = (c) => {
  const s = c.t.services;
  return `${pageHero(c, s.h1, s.lead, [['services', s.h1]])}
<section class="sec"><div class="wrap">
  ${serviceGroups.map((g) => `<div class="svc-group"><div class="svc-group-head"><h2>${esc(s.groups[g.id].title)}</h2><p>${esc(s.groups[g.id].text)}</p><a class="text-link" href="${c.to(g.id)}">${esc(c.t.ui.learnMore)}${arrow(c)}</a></div><ul class="cards">${g.services.map((id) => serviceCard(c, id)).join('')}</ul></div>`).join('')}
</div></section>
<section class="sec sec-paper"><div class="wrap narrow">${sectionHead(s.boundariesTitle, s.boundariesText)}</div></section>
${finalCta(c, c.t.home.contactTitle, c.t.home.contactText)}`;
};

function groupPage(c, g) {
  const info = c.t.services.groups[g.id];
  const others = serviceGroups.filter((x) => x.id !== g.id);
  return `${pageHero(c, info.title, info.text, [['services', c.t.services.h1], [g.id, info.title]])}
<section class="sec"><div class="wrap">
  ${g.services.map((id) => {
    const s = c.t.svc[id];
    return `<article class="svc-detail" id="${id}">
      <div class="svc-detail-head"><h2>${esc(s.title)}</h2><p class="lede">${esc(s.need)}</p>${btn(contactHref(c, id), s.cta, 'primary', c)}</div>
      <div class="svc-detail-body">
        <div><h3>${esc(c.t.ui.scope)}</h3><ul class="ticks">${s.scope.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
        <div><h3>${esc(c.t.ui.useCases)}</h3><ul class="plain">${s.use.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
      </div>
    </article>`;
  }).join('')}
</div></section>
<section class="sec sec-paper"><div class="wrap">${sectionHead(c.t.groupPage.relatedTitle, '')}<div class="groups">${others.map((x) => groupBlock(c, x, { withServices: false })).join('')}</div></div></section>
${finalCta(c, c.t.home.contactTitle, c.t.home.contactText)}`;
}

pages.products = (c) => {
  const p = c.t.products;
  return `${pageHero(c, p.h1, p.lead, [['products', p.h1]])}
<section class="sec"><div class="wrap">${productCards(c, true, 2)}<p class="note">${esc(p.note)}</p></div></section>
${finalCta(c, c.t.home.contactTitle, c.t.home.contactText)}`;
};

pages.projects = (c) => {
  const p = c.t.projects;
  return `${pageHero(c, p.h1, p.lead, [['projects', p.h1]])}
<section class="sec"><div class="wrap">${projectCards(c, true, 2)}<p class="note">${esc(p.note)}</p></div></section>
${finalCta(c, c.t.home.contactTitle, c.t.home.contactText)}`;
};

pages.how = (c) => {
  const p = c.t.process;
  return `${pageHero(c, p.h1, p.lead, [['how', p.h1]])}
<section class="sec"><div class="wrap">${stepsBlock(c, true, 2)}</div></section>
<section class="sec sec-paper"><div class="wrap narrow">${sectionHead(p.noteTitle, p.note)}</div></section>
${finalCta(c, c.t.home.contactTitle, c.t.home.contactText)}`;
};

pages.stage = (c) => {
  const s = c.t.stage;
  return `${pageHero(c, s.h1, s.lead, [['stage', s.h1]])}
<section class="sec"><div class="wrap">${pathwayCards(c, true, 2)}<p class="note">${esc(s.note)}</p></div></section>`;
};

pages.contact = (c) => {
  const { t } = c; const f = t.contact.form;
  const opt = (v, l) => `<option value="${v}">${esc(l)}</option>`;
  const groupOpts = `<option value="general">${esc(f.notSure)}</option>
    <optgroup label="${esc(f.interestGroups.services)}">${serviceGroups.flatMap((g) => g.services).map((id) => opt(id, t.svc[id].title)).join('')}</optgroup>
    <optgroup label="${esc(f.interestGroups.products)}">${products.filter((p) => p.publish).map((p) => opt(p.href, t.products.items[p.id].title)).join('')}</optgroup>
    <optgroup label="${esc(f.interestGroups.pathways)}">${t.stage.items.map((p) => opt(p.interest, `${p.label}: ${p.title}`)).join('')}</optgroup>`;
  const msgs = JSON.stringify({ ...f, interestGroups: undefined }).replace(/</g, '\\u003c');
  return `${pageHero(c, t.contact.h1, t.contact.lead, [['contact', t.contact.h1]])}
<section class="sec"><div class="wrap contact-grid">
  <form id="form" class="form" novalidate data-form data-locale="${t.lang}" data-msgs='${esc(msgs)}' data-fallback="${company.email}">
    <div class="err-summary" data-errors tabindex="-1" role="alert" hidden><h2>${esc(f.errorsTitle)}</h2><ul></ul></div>
    <p class="req-note">${esc(f.requiredNote)}</p>
    <div class="field"><label for="f-name">${esc(f.name)} *</label><input id="f-name" name="name" type="text" autocomplete="name" dir="auto" maxlength="100" required><p class="field-err" data-err-for="name"></p></div>
    <div class="field"><label for="f-email">${esc(f.email)} *</label><input id="f-email" name="email" type="email" autocomplete="email" dir="ltr" maxlength="254" required><p class="field-err" data-err-for="email"></p></div>
    <div class="field"><label for="f-company">${esc(f.company)}</label><input id="f-company" name="company" type="text" autocomplete="organization" dir="auto" maxlength="150"></div>
    <div class="field"><label for="f-interest">${esc(f.interest)}</label><select id="f-interest" name="interest">${groupOpts}</select></div>
    <div class="field"><label for="f-message">${esc(f.message)} *</label><textarea id="f-message" name="message" rows="6" dir="auto" maxlength="3000" required></textarea><p class="field-err" data-err-for="message"></p></div>
    <div class="hp" aria-hidden="true"><label>Website <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
    <p class="privacy-note">${esc(f.privacyNote)} <a href="${c.to('privacy')}">${esc(f.privacyLink)}</a>.</p>
    <button class="btn btn-primary" type="submit" data-submit>${esc(f.send)}</button>
    <p class="status-msg" data-status role="status" aria-live="polite"></p>
  </form>
  <aside class="contact-card">
    <h2 class="h3">${esc(t.contact.detailsTitle)}</h2>
    <dl class="foot-dl">
      <dt>${esc(t.ui.emailLabel)}</dt><dd><a href="mailto:${company.email}" dir="ltr">${company.email}</a></dd>
      <dt>${esc(t.ui.addressLabel)}</dt><dd>${esc(company.address[c.loc])}</dd>
      <dt>${esc(t.ui.legalLabel)}</dt><dd dir="ltr">${esc(company.legal)}</dd>
      <dt>${esc(t.ui.licenceLabel)}</dt><dd dir="ltr">${company.licence}</dd>
    </dl>
    ${socialLinks(c, 'social-card')}
  </aside>
</div></section>`;
};

pages.privacy = (c) => {
  const p = c.t.privacy;
  return `${pageHero(c, p.h1, p.banner, [['privacy', p.h1]])}
<section class="sec"><div class="wrap narrow prose">${p.sections.map(([h, b]) => `<h2 class="h3">${esc(h)}</h2><p>${esc(b)}</p>`).join('')}</div></section>`;
};

pages['think-design'] = (c) => groupPage(c, serviceGroups[0]);
pages['build-connect'] = (c) => groupPage(c, serviceGroups[1]);
pages['support-continuity'] = (c) => groupPage(c, serviceGroups[2]);

// ---- write
function write(file, html) { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, html); }

rmSync(dist, { recursive: true, force: true });
// Files in src/assets that must not be published (narrow, by exact name; everything else is copied as before):
//  - README.txt (src/assets/video, src/assets/img/slides) and CREDITS.md (src/assets/img): editor notes
//  - proj-*.jpg|png|webp while no project is published: placeholder imagery named after hidden projects
const INTERNAL_ASSET_FILES = new Set(['readme.txt', 'credits.md']);
const assetFilter = (p) => {
  const n = basename(p).toLowerCase();
  if (INTERNAL_ASSET_FILES.has(n)) return false;
  if (!HAS_PROJECTS && /^proj-[a-z0-9-]+\.(jpe?g|png|webp)$/.test(n)) return false;
  return true;
};
cpSync(join(here, 'assets'), join(dist, 'assets'), { recursive: true, filter: assetFilter });
write(join(dist, 'assets', 'js', 'config.js'), `window.WAW_CONFIG=${JSON.stringify({ endpoint, email: company.email })};\n`);
write(join(dist, 'assets', 'img', 'favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="75 80 1000 1240"><rect x="75" y="80" width="1000" height="1240" rx="220" fill="#052E30"/><g transform="translate(220 250) scale(.72)"><path fill="#B8E6D5" fill-rule="evenodd" d="${bodyD}"/><path fill="#FFC75B" fill-rule="evenodd" d="${dotD}"/></g></svg>`);

const urls = [];
for (const loc of LOCALES) {
  for (const route of Object.keys(ROUTES).filter((r) => r !== 'projects' || HAS_PROJECTS)) {
    const c = ctx(loc, route);
    const [title, desc] = L[loc].meta[route];
    const path = ROUTES[route];
    write(join(dist, loc, path, 'index.html'), document_(c, pages[route](c), { title, desc, bodyClass: route === 'home' ? 'is-home' : '' }));
    urls.push(`${loc}/${path}${path ? '/' : ''}`);
  }
  // localized 404 at /{loc}/404.html
  const c = { ...ctx(loc, 'home'), route: 'home', up: '/' }; c.asset = (p) => `/assets/${p}`; c.to = (r, hash = '', l = loc) => `/${l}/${ROUTES[r]}${ROUTES[r] ? '/' : ''}${hash}`;
  const t = L[loc]; const n = t.notfound;
  const body = `${pageHero(c, n.h1, n.text)}<section class="sec"><div class="wrap"><h2 class="h3">${esc(n.links)}</h2><p class="btn-row">${btn(c.to('home'), t.ui.home, 'dark')}${btn(c.to('services'), t.nav[0][1], 'dark')}${btn(c.to('contact'), t.ui.contactUs, 'primary')}</p></div></section>`;
  write(join(dist, loc, '404.html'), document_(c, body, { title: t.meta.notfound[0], desc: t.meta.notfound[1], noindex: true }));
}

// root: language chooser / redirect (default Arabic, saved preference overrides)
write(join(dist, 'index.html'), `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>واو سيركلز للتقنيات | Waw Circles Technologies</title><meta name="robots" content="noindex">${BUILD_MARK}<noscript><meta http-equiv="refresh" content="0; url=ar/"></noscript>
<link rel="stylesheet" href="assets/css/root.css">
<script src="assets/js/redirect.js"></script></head>
<body class="r-lang"><p><a href="ar/">العربية</a><a href="en/">English</a></p></body></html>`);
write(join(dist, '404.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>404</title><meta name="robots" content="noindex">${BUILD_MARK}<link rel="stylesheet" href="/assets/css/root.css"></head><body class="r-404"><div><h1>404</h1><p>Page not found · الصفحة غير موجودة</p><p><a href="/ar/">العربية</a><a href="/en/">English</a></p></div></body></html>`);

if (origin) {
  write(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `<url><loc>${origin}/${u}</loc></url>`).join('\n')}\n</urlset>\n`);
  write(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
}
console.log(`Built ${urls.length} pages -> ${dist}${STAGING ? ' (staging: noindex on every page; no canonical, hreflang, sitemap or robots.txt; protect access at the host)' : origin ? '' : ' (set SITE_ORIGIN to emit canonical, hreflang, sitemap)'}`);
