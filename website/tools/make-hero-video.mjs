// Renders an original, seamless-loop brand motion video (no stock footage, no licensing issues).
// Usage: cd tools && npm install && node make-hero-video.mjs   -> ../src/assets/video/hero.mp4 + ../src/assets/img/hero-poster.jpg
import { createCanvas, Path2D } from '@napi-rs/canvas';
import ffmpegPath from 'ffmpeg-static';
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '..', 'src', 'assets');
mkdirSync(join(out, 'video'), { recursive: true }); mkdirSync(join(out, 'img'), { recursive: true });
const W = 1280, H = 720, FPS = 24, SECS = 12, N = FPS * SECS;
const svg = readFileSync(join(here, '..', '..', 'waw-white.svg'), 'utf8');
const symbol = new Path2D([...svg.matchAll(/ d="([^"]+)"/g)][0][1]);

const c = createCanvas(W, H); const g = c.getContext('2d');
const TAU = Math.PI * 2;
const rnd = (() => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
const parts = Array.from({ length: 46 }, () => ({ x: rnd() * W, y: rnd() * H, a: 10 + rnd() * 40, b: 10 + rnd() * 50, k: 1 + Math.floor(rnd() * 2), j: 1 + Math.floor(rnd() * 2), p: rnd() * TAU, q: rnd() * TAU, r: 1.5 + rnd() * 3.5 }));
const cx = W * 0.74, cy = H * 0.46;

function frame(t) {
  const bg = g.createRadialGradient(cx, cy, 40, W * .5, H * .5, W * .85);
  bg.addColorStop(0, '#0a6a60'); bg.addColorStop(.45, '#07534C'); bg.addColorStop(1, '#052E30');
  g.fillStyle = bg; g.fillRect(0, 0, W, H);

  // large faint symbol, gently breathing
  g.save(); g.translate(cx, cy); const s = 0.62 * (1 + 0.025 * Math.sin(TAU * t)); g.scale(s, s); g.translate(-575, -700);
  g.fillStyle = 'rgba(184,230,213,0.07)'; g.fill(symbol, 'evenodd'); g.restore();

  // rings expanding from the connection point
  const R = 720;
  for (let k = 0; k < 5; k++) {
    const ph = (t + k / 5) % 1; g.beginPath(); g.arc(cx, cy, ph * R, 0, TAU);
    g.strokeStyle = `rgba(184,230,213,${(0.4 * Math.pow(1 - ph, 1.6)).toFixed(3)})`; g.lineWidth = 2; g.stroke();
  }
  // static orbits with gold nodes
  const orbits = [[190, 1, 0.0], [300, -1, 0.33], [420, 2, 0.6]];
  const nodes = [];
  for (const [r, m, p] of orbits) {
    g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.strokeStyle = 'rgba(184,230,213,0.14)'; g.lineWidth = 1.5; g.stroke();
    const a = TAU * (t * m + p); nodes.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  g.strokeStyle = 'rgba(255,199,91,0.35)'; g.lineWidth = 1.5;
  for (let i = 0; i < nodes.length; i++) { const [x1, y1] = nodes[i], [x2, y2] = nodes[(i + 1) % nodes.length]; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); }
  for (const [x, y] of nodes) {
    const gl = g.createRadialGradient(x, y, 0, x, y, 34); gl.addColorStop(0, 'rgba(255,199,91,0.55)'); gl.addColorStop(1, 'rgba(255,199,91,0)');
    g.fillStyle = gl; g.beginPath(); g.arc(x, y, 34, 0, TAU); g.fill();
    g.fillStyle = '#FFC75B'; g.beginPath(); g.arc(x, y, 9, 0, TAU); g.fill();
  }
  // drifting particles
  for (const p of parts) {
    const x = p.x + p.a * Math.cos(TAU * (t * p.k) + p.p), y = p.y + p.b * Math.sin(TAU * (t * p.j) + p.q);
    g.fillStyle = `rgba(184,230,213,${(0.12 + 0.2 * (p.r / 5)).toFixed(3)})`; g.beginPath(); g.arc(x, y, p.r, 0, TAU); g.fill();
  }
}

const ff = spawn(ffmpegPath, ['-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-r', String(FPS), '-i', '-', '-an',
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '27', '-preset', 'slow', '-movflags', '+faststart', join(out, 'video', 'hero.mp4')], { stdio: ['pipe', 'inherit', 'inherit'] });
for (let i = 0; i < N; i++) {
  frame(i / N);
  if (i === Math.floor(N * 0.12)) writeFileSync(join(out, 'img', 'hero-poster.jpg'), c.toBuffer('image/jpeg', 82));
  if (!ff.stdin.write(Buffer.from(c.data()))) await new Promise((r) => ff.stdin.once('drain', r));
}
ff.stdin.end();
await new Promise((r) => ff.on('close', r));
console.log('hero.mp4 + hero-poster.jpg written');
