// One-off patch: short, punchy statement content ("People first.") + manifesto section.
const fs = require('fs');
const root = require('path').join(__dirname, '..', 'src');
let c = fs.readFileSync(root + '/content.mjs', 'utf8');
const r = (a, b) => { if (!c.includes(a)) throw new Error('missing ' + a.slice(0, 60)); c = c.replace(a, b); };

// punchy headlines (EN)
r(`aboutTitle: 'Technology that fits the people using it',`, `aboutTitle: 'Technology that fits the people using it.',`);
r(`servicesTitle: 'What we do',`, `servicesTitle: 'Think it. Build it. Keep it growing.',`);
r(`servicesText: 'Three groups, nine capabilities. Use one or move through all three.',`, `servicesText: 'Three groups, nine capabilities. Use one, or move through all three.',`);
r(`sliderTitle: 'From idea to something people use',`, `sliderTitle: 'From idea to something people use.',`);
r(`howTitle: 'How we work',\n      howText: 'Four stages,`, `howTitle: 'Listen. Agree. Build. Improve.',\n      howText: 'Four stages,`);
r(`stageTitle: 'Where do you start?',`, `stageTitle: 'Start. Grow. Improve.',`);
r(`whyTitle: 'How WAW is different',`, `whyTitle: 'Built around people.',`);
r(`projectsTitle: 'Projects',\n      projectsText: 'Work we have`, `projectsTitle: 'Work that speaks for itself.',\n      projectsText: 'Work we have`);
r(`productsTitle: 'Products',\n      productsText: 'Systems`, `productsTitle: 'Products with purpose.',\n      productsText: 'Systems`);
r(`faqTitle: 'Questions we hear first',`, `faqTitle: 'Clear answers. No jargon.',`);
// manifesto EN
r(`      chips: ['Based in Sharjah, UAE',`, `      manifesto: [
        ['People first.', 'Thoughtful questions, clear decisions, and technology that fits the people using it.'],
        ['Purpose in the details.', 'Small choices decide how a product feels. We sweat them.'],
        ['Clear communication.', 'Plain words about scope, cost and what happens next.'],
        ['Possibilities next.', 'Once the foundation is right, there is room to grow.'],
      ],
      chips: ['Based in Sharjah, UAE',`);

// AR
r(`aboutTitle: 'تقنية تناسب من يستخدمها',`, `aboutTitle: 'تقنية تناسب من يستخدمها.',`);
r(`servicesTitle: 'ماذا نقدّم',`, `servicesTitle: 'نفكّر. نبني. ونواصل النمو.',`);
r(`sliderTitle: 'من الفكرة إلى شيء يستخدمه الناس',`, `sliderTitle: 'من الفكرة إلى شيء يستخدمه الناس.',`);
r(`howTitle: 'كيف نعمل',\n      howText: 'أربع مراحل،`, `howTitle: 'نسمع. نتفق. نبني. نحسّن.',\n      howText: 'أربع مراحل،`);
r(`stageTitle: 'من أين تبدأ؟',`, `stageTitle: 'ابدأ. توسّع. حسّن.',`);
r(`whyTitle: 'ما الذي يميّز واو',`, `whyTitle: 'نبني حول الإنسان.',`);
r(`projectsTitle: 'المشاريع',\n      projectsText: 'أعمال`, `projectsTitle: 'أعمال تتحدث عن نفسها.',\n      projectsText: 'أعمال`);
r(`productsTitle: 'المنتجات',\n      productsText: 'أنظمة`, `productsTitle: 'منتجات لها هدف.',\n      productsText: 'أنظمة`);
r(`faqTitle: 'أسئلة نسمعها أولاً',`, `faqTitle: 'إجابات واضحة. بلا تعقيد.',`);
r(`      chips: ['من الشارقة، الإمارات',`, `      manifesto: [
        ['الإنسان أولاً.', 'أسئلة مدروسة وقرارات واضحة، وتقنية تناسب من يستخدمها.'],
        ['قيمة في التفاصيل.', 'القرارات الصغيرة تصنع إحساس المنتج، ونحن نعتني بها.'],
        ['تواصل واضح.', 'كلمات بسيطة عن النطاق والتكلفة وما سيحدث بعد ذلك.'],
        ['ثم نفتح باب الممكن.', 'حين يكون الأساس صحيحاً، تتسع مساحة النمو.'],
      ],
      chips: ['من الشارقة، الإمارات',`);
fs.writeFileSync(root + '/content.mjs', c);

let b = fs.readFileSync(root + '/build.mjs', 'utf8');
const rb = (a, x) => { if (!b.includes(a)) throw new Error('missing ' + a.slice(0, 60)); b = b.replace(a, x); };
// manifesto section right after the marquee
rb('<section class="sec sec-paper" id="about">',
  '<section class="manifesto" aria-label="${esc(t.brandLine)}"><div class="wrap"><ul>${h.manifesto.map(([big, sub], i) => `<li><span class="m-dot" aria-hidden="true"></span><h2>${esc(big)}</h2><p>${esc(sub)}</p></li>`).join(\'\')}</ul></div></section>\n\n<section class="sec sec-paper" id="about">');
// about page: replace the plain values grid with the loud version
const vs = b.indexOf('<section class="sec sec-paper"><div class="wrap">${sectionHead(a.valuesTitle');
const ve = b.indexOf('</section>', vs) + '</section>'.length;
const sec = '<section class="manifesto manifesto-sm"><div class="wrap"><ul>' + '$' + '{a.values.map(([x, y]) => `<li><span class="m-dot" aria-hidden="true"></span><h2>${esc(x)}.</h2><p>${esc(y)}</p></li>`).join("")}' + '</ul></div></section>';
b = b.slice(0, vs) + sec + b.slice(ve);
fs.writeFileSync(root + '/build.mjs', b);

fs.appendFileSync(root + '/assets/css/style.css', `
/* manifesto: short, loud statements */
.manifesto { background: var(--gold); color: var(--night); padding-block: clamp(48px, 7vw, 96px); }
.manifesto ul { display: grid; }
.manifesto li { display: grid; gap: 6px 32px; align-items: baseline; padding-block: clamp(18px, 2.4vw, 30px); border-top: 2px solid rgba(5, 46, 48, .85); position: relative; }
.manifesto li:last-child { border-bottom: 2px solid rgba(5, 46, 48, .85); }
@media (min-width: 860px) { .manifesto li { grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr); } }
.manifesto h2 { font-size: clamp(2.2rem, 6.2vw, 5rem); line-height: 1.02; letter-spacing: -.03em; margin: 0; font-weight: 700; }
:lang(ar) .manifesto h2 { line-height: 1.3; letter-spacing: 0; }
.manifesto p { margin: 0; font-size: clamp(1rem, 1.5vw, 1.2rem); font-weight: 500; max-width: 38ch; }
.m-dot { display: none; }
.manifesto-sm { background: var(--night); color: var(--paper); }
.manifesto-sm li, .manifesto-sm li:last-child { border-color: rgba(184, 230, 213, .35); }
.manifesto-sm h2 { color: var(--gold); font-size: clamp(1.9rem, 4.6vw, 3.4rem); }
.manifesto-sm p { color: #cfe3dc; }
.js .manifesto li { opacity: 0; transform: translateY(20px); transition: opacity .6s ease, transform .6s ease; }
.js .manifesto li.in { opacity: 1; transform: none; }
`);
console.log('patched');
