// One-off patch script (kept for reference): stronger copy + modern home sections.
const fs = require('fs');
const root = require('path').join(__dirname, '..', 'src');
let c = fs.readFileSync(root + '/content.mjs', 'utf8');
const r = (a, b) => { if (!c.includes(a)) throw new Error('missing ' + a.slice(0, 50)); c = c.replace(a, b); };

r(`      lead: 'We develop digital products and deliver technology consultancy, design, development and software support. Websites, apps and customer experiences, shaped around your next stage.',
      secondary: 'Explore services',`,
`      lead: 'From first idea to something people actually use. We design, build and support websites, apps and connected systems, shaped around where your business is going next.',
      secondary: 'Explore services',
      chips: ['Based in Sharjah, UAE', 'Arabic and English, by design', 'Clear scope, clear costs'],
      marquee: ['Product strategy', 'Experience design', 'Websites and e-commerce', 'Mobile apps', 'Business systems', 'Connected systems and automation', 'AI-assisted workflows', 'Testing and QA', 'Support and improvement'],
      whyTitle: 'How WAW is different',
      whyText: 'A small set of principles that shape every engagement.',
      why: [
        ['Arabic and English, designed together', 'Both languages shape the layout, the copy and the flow from day one, not as a translation at the end.'],
        ['A starting point that fits', 'Big ambition, sensible first step. We size the first release to your stage so you can grow from a solid base.'],
        ['One team, from idea to support', 'Strategy, design, build, testing and support in one place, so nothing is lost in handover.'],
        ['Product thinking of our own', 'We are building WAW Circles, our own app. The same care for people goes into client work.'],
      ],
      faqTitle: 'Questions we hear first',
      faqText: 'Short answers before the first conversation.',
      faq: [
        ['What should I bring to the first conversation?', 'Your goal, who it is for, and anything that already exists, such as designs, a website or a system. A rough idea is enough to begin.'],
        ['Do you work in Arabic and English?', 'Yes. Websites and apps can be designed for both languages, including right-to-left layouts.'],
        ['Can you improve something we already have?', 'Yes. IMPROVE is for existing websites, apps and workflows. We look at the current system first, then agree the changes.'],
        ['How do you agree cost and timing?', 'After we understand your needs, scope, costs and milestones are agreed in writing before build starts. We do not publish fixed prices because every project differs.'],
        ['Do you support us after launch?', 'Support, maintenance and improvement are available within an agreed scope, set out separately from the build.'],
        ['What is WAW Circles?', 'Our own gifting app, currently in development. It connects the people who matter, the ideas that suit them, and the circles that make something special happen.'],
      ],`);

r(`      lead: 'نطوّر منتجات رقمية ونقدّم الاستشارات التقنية والتصميم والتطوير والدعم البرمجي. مواقع وتطبيقات وتجارب عملاء مصممة بما يناسب مرحلتك القادمة.',
      secondary: 'استكشف الخدمات',`,
`      lead: 'من الفكرة الأولى إلى منتج يستخدمه الناس فعلاً. نصمّم ونبني وندعم المواقع والتطبيقات والأنظمة المترابطة، بما يناسب وجهة عملك القادمة.',
      secondary: 'استكشف الخدمات',
      chips: ['من الشارقة، الإمارات', 'العربية والإنجليزية بالتصميم', 'نطاق واضح وتكاليف واضحة'],
      marquee: ['استراتيجية المنتج', 'تصميم التجربة', 'المواقع والمتاجر الإلكترونية', 'تطبيقات الجوال', 'أنظمة الأعمال', 'ربط الأنظمة والأتمتة', 'إجراءات عمل بالذكاء الاصطناعي', 'الاختبار وضمان الجودة', 'الدعم والتحسين'],
      whyTitle: 'ما الذي يميّز واو',
      whyText: 'مبادئ قليلة تحكم كل تعاون.',
      why: [
        ['العربية والإنجليزية بتصميم واحد', 'تُشكّل اللغتان التخطيط والنصوص والمسارات منذ اليوم الأول، لا كترجمة في النهاية.'],
        ['نقطة بداية تناسبك', 'طموح كبير وخطوة أولى معقولة. نُحجّم الإصدار الأول بما يناسب مرحلتك لتنمو من أساس متين.'],
        ['فريق واحد من الفكرة إلى الدعم', 'الاستراتيجية والتصميم والتطوير والاختبار والدعم في مكان واحد، فلا يضيع شيء عند التسليم.'],
        ['تفكير منتجات خاص بنا', 'نبني «واو سيركلز»، تطبيقنا الخاص. والعناية نفسها بالناس نضعها في أعمال عملائنا.'],
      ],
      faqTitle: 'أسئلة نسمعها أولاً',
      faqText: 'إجابات مختصرة قبل أول حديث.',
      faq: [
        ['ماذا أُحضر معي إلى أول حديث؟', 'هدفك، ومن تستهدف، وأي شيء قائم لديك مثل التصاميم أو موقع أو نظام. تكفي فكرة أولية للبدء.'],
        ['هل تعملون بالعربية والإنجليزية؟', 'نعم. يمكن تصميم المواقع والتطبيقات للغتين، بما في ذلك التخطيط من اليمين إلى اليسار.'],
        ['هل تستطيعون تحسين شيء لدينا بالفعل؟', 'نعم. مسار «حسّن» مخصص للمواقع والتطبيقات وإجراءات العمل القائمة. ننظر في النظام الحالي أولاً ثم نتفق على التغييرات.'],
        ['كيف نتفق على التكلفة والمدة؟', 'بعد أن نفهم احتياجك نتفق كتابةً على النطاق والتكاليف والمراحل قبل بدء التنفيذ. لا ننشر أسعاراً ثابتة لأن كل مشروع يختلف.'],
        ['هل تقدّمون الدعم بعد الإطلاق؟', 'الدعم والصيانة والتحسين متاحة ضمن نطاق متفق عليه، يُحدَّد بشكل منفصل عن التنفيذ.'],
        ['ما هو واو سيركلز؟', 'تطبيقنا الخاص للهدايا، وهو قيد التطوير. يربط بين الأشخاص المهمين في حياتك، والأفكار التي تناسبهم، والدوائر التي تصنع لحظة مميزة.'],
      ],`);
fs.writeFileSync(root + '/content.mjs', c);

let b = fs.readFileSync(root + '/build.mjs', 'utf8');
const rb = (a, x) => { if (!b.includes(a)) throw new Error('missing ' + a.slice(0, 50)); b = b.replace(a, x); };

rb('<p class="hero-sub">${esc(t.taglineSub)}</p>',
  '<ul class="chips-row">${h.chips.map((x) => `<li>${esc(x)}</li>`).join(\'\')}</ul>\n      <p class="hero-sub">${esc(t.taglineSub)}</p>');

rb('<section class="sec sec-paper" id="about">',
  '<section class="marquee" aria-hidden="true"><div class="marquee-track">${[0, 1].map(() => `<ul>${h.marquee.map((x) => `<li>${esc(x)}</li>`).join(\'\')}</ul>`).join(\'\')}</div></section>\n\n<section class="sec sec-paper" id="about">');

rb('<div class="groups">${serviceGroups.map((g) => groupBlock(c, g)).join(\'\')}</div>\n  <p class="more">${btn(c.to(\'services\'), t.ui.exploreServices',
  '<div class="groups bento">${serviceGroups.map((g, i) => groupBlock(c, g).replace(\'<article class="group card-lg">\', `<article class="group card-lg bento-${i + 1}"><span class="num" aria-hidden="true">0${i + 1}</span>`)).join(\'\')}</div>\n  <p class="more">${btn(c.to(\'services\'), t.ui.exploreServices');

rb('<section class="sec sec-night" id="how">',
  '<section class="sec why" id="why"><div class="wrap">\n  ${sectionHead(h.whyTitle, h.whyText, { eyebrow: \'WAW\' })}\n  <ol class="why-grid">${h.why.map(([a, d], i) => `<li class="why-item"><span class="why-n" aria-hidden="true">0${i + 1}</span><h3>${esc(a)}</h3><p>${esc(d)}</p></li>`).join(\'\')}</ol>\n</div></section>\n\n<section class="sec sec-night" id="how">');

rb('${finalCta(c, h.contactTitle, h.contactText)}`;\n};',
  '<section class="sec sec-paper" id="faq"><div class="wrap narrow">\n  ${sectionHead(h.faqTitle, h.faqText, { eyebrow: \'FAQ\' })}\n  <div class="faq">${h.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join(\'\')}</div>\n</div></section>\n\n${finalCta(c, h.contactTitle, h.contactText)}`;\n};');
fs.writeFileSync(root + '/build.mjs', b);

// modern styling layer
fs.appendFileSync(root + '/assets/css/style.css', `
/* ===== modern layer ===== */
.site-header { background: rgba(5, 46, 48, .78); -webkit-backdrop-filter: saturate(160%) blur(14px); backdrop-filter: saturate(160%) blur(14px); }
.hero h1 { font-size: clamp(2.6rem, 7vw, 5.2rem); letter-spacing: -.025em; }
.hero .gold { background: linear-gradient(100deg, var(--gold), #ffe3a3 60%, var(--gold)); -webkit-background-clip: text; background-clip: text; color: transparent; }
.chips-row { display: flex; flex-wrap: wrap; gap: 10px; margin: 0 0 1.6rem; }
.chips-row li { font-size: .88rem; padding: .4rem .9rem; border-radius: 999px; background: rgba(184, 230, 213, .12); border: 1px solid rgba(184, 230, 213, .28); color: var(--paper); -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); }
.hero-bg::after { content: ''; position: absolute; inset: auto 0 0 0; height: 120px; background: linear-gradient(to bottom, transparent, rgba(5, 46, 48, .6)); }

/* marquee */
.marquee { background: var(--night); color: var(--mint); overflow: hidden; border-block: 1px solid rgba(184, 230, 213, .14); direction: ltr; }
.marquee-track { display: flex; width: max-content; animation: scroll 38s linear infinite; }
.marquee ul { display: flex; flex: none; }
.marquee li { padding: 18px 28px; white-space: nowrap; font-weight: 600; font-size: 1.05rem; display: flex; align-items: center; gap: 28px; }
.marquee li::after { content: ''; width: 8px; height: 8px; border-radius: 50%; background: var(--gold); }
@keyframes scroll { to { transform: translateX(-50%); } }

/* bento services */
.bento { display: grid; gap: 16px; }
@media (min-width: 900px) {
  .bento { grid-template-columns: repeat(6, 1fr); grid-auto-rows: auto; }
  .bento-1 { grid-column: span 3; }
  .bento-3 { grid-column: span 3; }
  .bento-2 { grid-column: span 6; background: var(--night); color: var(--paper); border-color: var(--night); }
  .bento-2 p { color: #cfe3dc; }
  .bento-2 .text-link { color: var(--mint); }
  .bento-2 .chips li { background: rgba(184, 230, 213, .16); color: var(--mint); border: 1px solid rgba(184, 230, 213, .3); }
  .bento-2 .chips { max-width: 760px; }
}
.group .num { font-size: .85rem; font-weight: 700; letter-spacing: .14em; color: var(--pine); margin-bottom: .8rem; display: block; }
.bento-2 .num { color: var(--gold); }
.card-lg:hover { border-color: var(--gold); }

/* why section */
.why { background: linear-gradient(180deg, var(--paper), #e6f1ec); }
.why-grid { display: grid; gap: 16px; counter-reset: w; }
@media (min-width: 720px) { .why-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1100px) { .why-grid { grid-template-columns: repeat(4, 1fr); } }
.why-item { background: var(--white); border-radius: 20px; padding: 28px 24px 26px; border: 1px solid var(--line); position: relative; overflow: hidden; transition: transform .2s, box-shadow .2s; }
.why-item:hover { transform: translateY(-4px); box-shadow: 0 18px 40px rgba(5, 46, 48, .12); }
.why-item::after { content: ''; position: absolute; inset-inline-end: -40px; top: -40px; width: 120px; height: 120px; border-radius: 50%; background: radial-gradient(circle, rgba(255, 199, 91, .35), transparent 70%); }
.why-n { display: block; font-size: 3rem; font-weight: 700; line-height: 1; color: var(--pine); margin-bottom: 1rem; }
.why-item h3 { font-size: 1.2rem; }
.why-item p { color: var(--muted); margin: 0; }

/* FAQ */
.faq { display: grid; gap: 12px; }
.faq details { background: var(--white); border: 1px solid var(--line); border-radius: 16px; padding: 0 22px; transition: border-color .2s, box-shadow .2s; }
.faq details[open] { border-color: var(--pine); box-shadow: 0 10px 28px rgba(5, 46, 48, .08); }
.faq summary { cursor: pointer; list-style: none; padding: 20px 0; font-weight: 700; font-size: 1.05rem; display: flex; justify-content: space-between; align-items: center; gap: 16px; min-height: 48px; }
.faq summary::-webkit-details-marker { display: none; }
.faq summary::after { content: '+'; flex: none; width: 32px; height: 32px; display: grid; place-items: center; border-radius: 50%; background: var(--gold); color: var(--night); font-size: 1.3rem; font-weight: 700; transition: transform .2s; }
.faq details[open] summary::after { transform: rotate(45deg); }
.faq details p { margin: 0 0 20px; color: var(--muted); }

/* sections: tighter rhythm, bolder titles */
.sec-head h2, .sec h2 { letter-spacing: -.02em; }
.sec .eyebrow::before { content: ''; display: inline-block; width: 28px; height: 2px; background: var(--gold); vertical-align: middle; margin-inline-end: 10px; }
.btn-primary { box-shadow: 0 8px 24px rgba(255, 199, 91, .28); }
.card { transition: transform .2s, box-shadow .2s, border-color .2s; }
.card:hover { transform: translateY(-3px); box-shadow: 0 16px 36px rgba(5, 46, 48, .1); border-color: rgba(7, 83, 76, .35); }
@media (prefers-reduced-motion: reduce) { .marquee-track { animation: none; } }
`);
console.log('patched');
