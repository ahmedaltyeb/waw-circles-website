// Patch: replace giant "People first" statement bands with concrete, work-related content.
const fs = require('fs');
const root = require('path').join(__dirname, '..', 'src');
let c = fs.readFileSync(root + '/content.mjs', 'utf8');
const r = (a, b) => { if (!c.includes(a)) throw new Error('missing ' + a.slice(0, 60)); c = c.replace(a, b); };

// drop manifesto data (both locales)
c = c.replace(/      manifesto: \[[\s\S]*?\n      \],\n/g, '');

// EN
r(`whyTitle: 'Built around people.',`, `whyTitle: 'What you get with WAW.',`);
r(`      chips: ['Based in Sharjah, UAE',`, `      showcaseTitle: 'What we can build for you',
      showcaseText: 'Concrete work, from first prototype to a system your team uses every day.',
      showcase: [
        ['globe', 'Company websites', 'Clear, bilingual websites that explain what you do and make it easy to get in touch.', 's03'],
        ['cart', 'Online stores and portals', 'Catalogues, carts and customer portals built around how your customers buy.', 's03'],
        ['phone', 'Mobile apps', 'Booking, service and field-tool apps for your customers or your team, from prototype to release.', 's04'],
        ['chart', 'Business systems', 'Dashboards and operations tools that put the information your team needs in one place.', 's05'],
        ['link', 'Automation and integrations', 'Connect the tools you already use and remove repeated manual steps.', 's06'],
        ['check', 'Testing and QA', 'Test the flows that matter before launch and get a clear defect report.', 's08'],
      ],
      points: [
        ['Start where you are', 'A plan, a prototype or a first release, sized to your stage.'],
        ['Two languages, one build', 'Arabic and English, including right-to-left layouts, from day one.'],
        ['Support after launch', 'Maintenance and improvement within an agreed scope.'],
      ],
      chips: ['Based in Sharjah, UAE',`);
// AR
r(`whyTitle: 'نبني حول الإنسان.',`, `whyTitle: 'ماذا تحصل مع واو.',`);
r(`      chips: ['من الشارقة، الإمارات',`, `      showcaseTitle: 'ماذا نستطيع أن نبني لك',
      showcaseText: 'أعمال ملموسة، من النموذج الأولي إلى نظام يستخدمه فريقك كل يوم.',
      showcase: [
        ['globe', 'مواقع الشركات', 'مواقع واضحة بلغتين تشرح ما تقدّمه وتسهّل التواصل معك.', 's03'],
        ['cart', 'المتاجر والبوابات الإلكترونية', 'كتالوجات وسلال شراء وبوابات عملاء مبنية حول طريقة شراء عملائك.', 's03'],
        ['phone', 'تطبيقات الجوال', 'تطبيقات حجز وخدمات وأدوات ميدانية لعملائك أو لفريقك، من النموذج الأولي إلى الإصدار.', 's04'],
        ['chart', 'أنظمة الأعمال', 'لوحات متابعة وأدوات تشغيل تجمع المعلومات التي يحتاجها فريقك في مكان واحد.', 's05'],
        ['link', 'الأتمتة والتكامل', 'اربط الأدوات التي تستخدمها اليوم وأزل الخطوات اليدوية المتكررة.', 's06'],
        ['check', 'الاختبار وضمان الجودة', 'اختبر المسارات المهمة قبل الإطلاق واحصل على تقرير واضح بالعيوب.', 's08'],
      ],
      points: [
        ['ابدأ من حيث أنت', 'خطة أو نموذج أولي أو إصدار أول، بحجم يناسب مرحلتك.'],
        ['لغتان في بناء واحد', 'العربية والإنجليزية، بما في ذلك التخطيط من اليمين إلى اليسار، منذ اليوم الأول.'],
        ['دعم بعد الإطلاق', 'صيانة وتحسين ضمن نطاق متفق عليه.'],
      ],
      chips: ['من الشارقة، الإمارات',`);
fs.writeFileSync(root + '/content.mjs', c);

let b = fs.readFileSync(root + '/build.mjs', 'utf8');
const cut = (startMarker, endMarker, replacement) => {
  const s = b.indexOf(startMarker); if (s < 0) throw new Error('missing ' + startMarker.slice(0, 50));
  const e = b.indexOf(endMarker, s); if (e < 0) throw new Error('missing end ' + endMarker.slice(0, 50));
  b = b.slice(0, s) + replacement + b.slice(e + endMarker.length);
};
const icons = {
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.600 3.500 5.600 3.500 9s-1 6.400-3.500 9c-2.500-2.600-3.500-5.600-3.500-9S9.500 5.600 12 3z',
  cart: 'M3 4h2.500l2.200 10.500h9.600L19.500 7H6.200M9.500 19.500a1 1 0 1 0 0 .01M16.500 19.500a1 1 0 1 0 0 .01',
  phone: 'M8 2.500h8a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-15a2 2 0 0 1 2-2zM10.500 18.500h3',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  link: 'M10 14a4 4 0 0 0 5.700 0l3-3a4 4 0 0 0-5.700-5.700l-1 1M14 10a4 4 0 0 0-5.700 0l-3 3a4 4 0 0 0 5.700 5.700l1-1',
  check: 'M4 12.500l5 5L20 6.500',
};
b = b.replace('// ---- reusable blocks', `// ---- reusable blocks\nconst ICONS = ${JSON.stringify(icons)};\nconst icon = (k) => \`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="\${ICONS[k]}"/></svg>\`;`);

// home: manifesto -> showcase
cut('<section class="manifesto" aria-label', '</section>',
  '<section class="sec showcase-sec" id="build"><div class="wrap">\n  ${sectionHead(h.showcaseTitle, h.showcaseText, { eyebrow: t.nav[0][1] })}\n  <ul class="showcase">${h.showcase.map(([ic, ti, tx, sv]) => `<li class="card show"><span class="show-ic">${icon(ic)}</span><h3>${esc(ti)}</h3><p>${esc(tx)}</p><a class="text-link" href="${c.to(serviceGroups.find((g) => g.services.includes(sv)).id, \'#\' + sv)}">${esc(t.ui.learnMore)}${arrow(c)}</a></li>`).join(\'\')}</ul>\n</div></section>');

// home about: values cards -> work points
cut('<ul class="values">${t.about.values.map(', '</ul>',
  '<ul class="points">${h.points.map(([a, d]) => `<li><h3>${esc(a)}</h3><p>${esc(d)}</p></li>`).join(\'\')}</ul>');

// about page: loud values band -> service groups
cut('<section class="manifesto manifesto-sm">', '</section>',
  '<section class="sec sec-paper"><div class="wrap">${sectionHead(c.t.home.servicesTitle, c.t.home.servicesText)}<div class="groups">${serviceGroups.map((g) => groupBlock(c, g, { withServices: false })).join(\'\')}</div></div></section>');
fs.writeFileSync(root + '/build.mjs', b);

// css: drop manifesto, add showcase + points
let css = fs.readFileSync(root + '/assets/css/style.css', 'utf8');
const ms = css.indexOf('/* manifesto: short, loud statements */');
css = css.slice(0, ms) + `/* showcase: concrete deliverables */
.showcase-sec { background: var(--white); }
.showcase { display: grid; gap: 16px; }
@media (min-width: 640px) { .showcase { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1000px) { .showcase { grid-template-columns: repeat(3, 1fr); } }
.show { display: flex; flex-direction: column; background: var(--paper); border-radius: 20px; padding: 28px; }
.show .text-link { margin-top: auto; align-self: flex-start; }
.show-ic { width: 52px; height: 52px; border-radius: 14px; background: var(--night); color: var(--gold); display: grid; place-items: center; margin-bottom: 1.2rem; }
.show-ic svg { width: 26px; height: 26px; }
.show h3 { font-size: 1.25rem; }
.points { display: grid; gap: 0; margin-top: 1.5rem; }
.points li { padding: 18px 0; border-top: 1px solid var(--line); }
.points li:last-child { border-bottom: 1px solid var(--line); }
.points h3 { font-size: 1.1rem; margin-bottom: .25rem; }
.points p { margin: 0; color: var(--muted); }
`;
fs.writeFileSync(root + '/assets/css/style.css', css);
console.log('patched');
