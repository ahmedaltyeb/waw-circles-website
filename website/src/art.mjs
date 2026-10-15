// Original on-brand illustrations used until real photos / screenshots are dropped into src/assets/img/.
// Palette: Night #052E30, Pine #07534C, Mint #B8E6D5, Gold #FFC75B, Paper #F4F7F5.
const N = '#052E30', P = '#07534C', M = '#B8E6D5', G = '#FFC75B', W = '#F4F7F5';

const themes = {
  dark: { bg: [P, N], ink: M, soft: 'rgba(184,230,213,.22)', panel: 'rgba(5,46,48,.55)', line: 'rgba(184,230,213,.5)' },
  mint: { bg: ['#d4f0e4', M], ink: N, soft: 'rgba(5,46,48,.16)', panel: W, line: 'rgba(5,46,48,.55)' },
  gold: { bg: ['#ffd98a', G], ink: N, soft: 'rgba(5,46,48,.18)', panel: W, line: 'rgba(5,46,48,.6)' },
};

const frame = (id, th, inner, w = 800, h = 500) => {
  const t = themes[th];
  return `<svg viewBox="0 0 ${w} ${h}" role="presentation" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="bg-${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.bg[0]}"/><stop offset="1" stop-color="${t.bg[1]}"/></linearGradient></defs>
<rect width="${w}" height="${h}" fill="url(#bg-${id})"/>
<g fill="none" stroke="${t.soft}" stroke-width="2"><circle cx="640" cy="90" r="120"/><circle cx="640" cy="90" r="200"/><circle cx="110" cy="440" r="90"/><circle cx="110" cy="440" r="150"/></g>
${inner(t)}</svg>`;
};

const rr = (x, y, w, h, r, fill, stroke = 'none', sw = 0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const dot = (x, y, r, f = G) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}"/>`;
const bar = (x, y, w, f, h = 10) => rr(x, y, w, h, h / 2, f);

const phone = (x, y, t, body, scale = 1) => `<g transform="translate(${x} ${y}) scale(${scale})">
  ${rr(0, 0, 190, 360, 30, N, t.line, 3)}${rr(12, 14, 166, 332, 20, W)}${rr(70, 6, 50, 7, 3.5, '#0a4a46')}${body}</g>`;
const browser = (x, y, w, h, t, body) => `<g transform="translate(${x} ${y})">
  ${rr(0, 0, w, h, 16, W, t.line, 3)}${rr(0, 0, w, 36, 16, N)}<rect x="0" y="22" width="${w}" height="14" fill="${N}"/>
  ${dot(20, 18, 5, G)}${dot(38, 18, 5, M)}${dot(56, 18, 5, '#6fa89c')}${body}</g>`;
const person = (x, y, s, f) => `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="-26" r="16" fill="${f}"/><path d="M-30 30c0-30 14-46 30-46s30 16 30 46z" fill="${f}"/></g>`;

const art = {
  // About
  'about-1': () => frame('a1', 'dark', (t) => `
    <g fill-opacity=".9"><circle cx="330" cy="260" r="120" fill="${P}" stroke="${M}" stroke-width="3"/><circle cx="470" cy="260" r="120" fill="${N}" stroke="${M}" stroke-width="3" fill-opacity=".85"/><circle cx="400" cy="170" r="120" fill="${P}" stroke="${M}" stroke-width="3" fill-opacity=".7"/></g>
    ${person(290, 285, 1.1, M)}${person(510, 285, 1.1, M)}${person(400, 195, 1.1, W)}
    ${dot(400, 275, 14)}<path d="M400 275 L330 300M400 275 L470 300M400 275 L400 215" stroke="${G}" stroke-width="3" stroke-linecap="round"/>`),
  'about-2': () => frame('a2', 'mint', (t) => `
    ${browser(110, 90, 400, 270, t, `${bar(30, 70, 190, N, 16)}${bar(30, 104, 300, '#7aa89b')}${bar(30, 124, 260, '#7aa89b')}${rr(30, 160, 150, 70, 12, M)}${rr(196, 160, 150, 70, 12, G)}`)}
    ${phone(520, 120, t, `${rr(30, 50, 130, 50, 12, M)}${rr(30, 114, 130, 20, 8, '#d9e5e0')}${rr(30, 144, 90, 20, 8, '#d9e5e0')}${rr(30, 270, 130, 40, 20, G)}`, .85)}
    <path d="M510 230 C 520 230 520 270 545 270" stroke="${N}" stroke-width="3" fill="none" stroke-dasharray="6 8"/>${dot(510, 230, 9, N)}`),

  // Products
  'prod-sales': () => frame('ps', 'dark', (t) => `
    ${rr(120, 90, 330, 300, 18, W)}${bar(150, 120, 120, N, 14)}
    ${[0, 1, 2, 3, 4].map((i) => rr(160 + i * 52, 340 - [90, 140, 70, 170, 120][i], 34, [90, 140, 70, 170, 120][i], 6, i === 3 ? G : P)).join('')}
    <path d="M150 350H430" stroke="${N}" stroke-opacity=".3" stroke-width="2"/>
    ${rr(430, 150, 250, 290, 16, M)}${bar(455, 180, 120, N, 14)}${[0, 1, 2, 3].map((i) => `${bar(455, 225 + i * 36, 130, '#5f9d90')}${bar(600, 225 + i * 36, 50, i === 3 ? G : N)}`).join('')}
    ${rr(455, 380, 200, 38, 19, G)}`),
  'prod-pharmacy': () => frame('pp', 'mint', (t) => `
    <circle cx="400" cy="250" r="150" fill="${N}"/><circle cx="400" cy="250" r="150" fill="none" stroke="${G}" stroke-width="4" stroke-dasharray="3 14" stroke-linecap="round"/>
    ${rr(366, 170, 68, 160, 14, W)}${rr(320, 216, 160, 68, 14, W)}${dot(400, 250, 12)}
    ${rr(110, 140, 120, 36, 18, G)}${rr(110, 140, 60, 36, 18, N)}
    ${rr(580, 320, 110, 36, 18, N)}${rr(635, 320, 55, 36, 18, G)}
    ${rr(90, 330, 90, 90, 12, W, N, 3)}${bar(104, 350, 60, N)}${bar(104, 372, 40, '#7aa89b')}${bar(104, 392, 50, '#7aa89b')}
    ${rr(600, 90, 100, 60, 12, W, N, 3)}${bar(615, 110, 70, G, 12)}${bar(615, 130, 40, N)}`),
  'prod-waw': () => frame('pw', 'dark', (t) => `
    <g fill="none" stroke="${M}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">
      <rect x="320" y="250" width="160" height="130" rx="12" fill="${N}"/><rect x="306" y="206" width="188" height="48" rx="12" fill="${P}"/>
      <path d="M400 206V380"/><path d="M400 206c-38-64-100-36-74 4M400 206c38-64 100-36 74 4"/></g>
    ${dot(400, 206, 15)}
    <g stroke="${M}" stroke-opacity=".5" stroke-width="2" fill="none"><circle cx="400" cy="270" r="190"/></g>
    ${person(210, 170, .9, M)}${person(600, 160, .9, W)}${person(620, 360, .9, M)}${person(190, 380, .9, W)}
    <path d="M240 190L330 230M570 175L470 225M590 350L480 320M225 370L320 330" stroke="${G}" stroke-width="2.5" stroke-dasharray="4 8" stroke-linecap="round"/>`),

  // Projects (placeholders for real screenshots)
  'proj-hajin': () => frame('pj1', 'gold', (t) => `
    ${phone(300, 70, t, `${rr(28, 40, 134, 70, 14, M)}${dot(52, 75, 16, N)}${bar(76, 64, 70, N)}${bar(76, 84, 46, '#6fa89c')}
      ${rr(28, 126, 134, 60, 14, '#e8f0ed')}${bar(44, 146, 90, N)}${bar(44, 166, 60, '#7aa89b')}
      ${rr(28, 200, 134, 60, 14, '#e8f0ed')}${bar(44, 220, 80, N)}${bar(44, 240, 100, '#7aa89b')}${rr(28, 285, 134, 40, 20, N)}`)}
    ${dot(180, 140, 40, N)}${dot(640, 360, 56, N)}${dot(640, 360, 20, G)}`),
  'proj-baytech': () => frame('pj2', 'dark', (t) => `
    ${phone(300, 70, t, `${rr(28, 40, 134, 120, 16, M)}<path d="M60 130V92l35-26 35 26v38z" fill="${N}"/>${rr(86, 108, 18, 22, 3, G)}
      ${bar(28, 180, 100, N, 12)}${bar(28, 204, 134, '#7aa89b')}${bar(28, 224, 110, '#7aa89b')}${rr(28, 285, 134, 40, 20, G)}`)}
    <g fill="none" stroke="${M}" stroke-opacity=".6" stroke-width="3"><path d="M110 300h130M110 340h90M560 150h130M600 200h90"/></g>${dot(110, 300, 9)}${dot(690, 150, 9)}`),
  'proj-flowrz': () => frame('pj3', 'mint', (t) => `
    ${browser(150, 90, 500, 320, t, `
      <g transform="translate(250 190)">${[0, 60, 120, 180, 240, 300].map((a) => `<ellipse cx="0" cy="-48" rx="22" ry="48" fill="${a % 120 ? P : G}" transform="rotate(${a})"/>`).join('')}${dot(0, 0, 18, N)}</g>
      ${bar(400, 100, 70, N, 14)}${bar(400, 130, 60, '#7aa89b')}${bar(400, 150, 70, '#7aa89b')}${rr(400, 200, 70, 34, 17, G)}`)}`),
  'proj-parking': () => frame('pj4', 'gold', (t) => `
    ${phone(300, 70, t, `${rr(0, 0, 0, 0, 0, 'none')}<rect x="12" y="14" width="166" height="190" fill="${M}"/><path d="M12 80h166M12 140h166M70 14v190M130 14v190" stroke="${W}" stroke-width="6"/>
      <path d="M95 60a26 26 0 0 1 26 26c0 22-26 52-26 52s-26-30-26-52a26 26 0 0 1 26-26z" fill="${N}"/>${dot(95, 86, 9, G)}
      ${rr(28, 224, 134, 50, 14, '#e8f0ed')}${bar(44, 244, 90, N)}${rr(28, 292, 134, 40, 20, N)}`)}
    ${dot(170, 380, 44, N)}${dot(170, 380, 14, G)}`),
  'proj-mohmaina': () => frame('pj5', 'dark', (t) => `
    ${browser(110, 100, 420, 290, t, `${rr(24, 60, 110, 90, 12, M)}${rr(150, 60, 110, 90, 12, G)}${rr(276, 60, 110, 90, 12, '#6fa89c')}${bar(24, 175, 250, '#d9e5e0')}${bar(24, 197, 200, '#d9e5e0')}${bar(24, 219, 230, '#d9e5e0')}`)}
    ${phone(560, 150, t, `${rr(28, 40, 134, 50, 12, M)}${rr(28, 104, 134, 50, 12, '#e8f0ed')}${rr(28, 168, 134, 50, 12, '#e8f0ed')}${rr(28, 285, 134, 40, 20, G)}`, .8)}`),
};

export const hasArt = (key) => key in art;
export const artSvg = (key) => art[key]();
