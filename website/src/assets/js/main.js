/* WAW site behaviour: menu, hero video control, slider, reveal, language memory, enquiry form. No dependencies. */
(function () {
  'use strict';
  var doc = document;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // remember language choice (used by the root redirect)
  try { localStorage.setItem('waw-lang', doc.documentElement.lang === 'en' ? 'en' : 'ar'); } catch (e) {}

  // mobile menu
  var menuBtn = doc.querySelector('[data-menu]');
  var nav = doc.getElementById('nav');
  if (menuBtn && nav) {
    var setMenu = function (open) { menuBtn.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); };
    menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); menuBtn.focus(); } });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  }

  // hero video (preload="none", no autoplay attribute): it starts by itself only when the visitor has not asked for reduced
  // motion, is not on data-saver, and the viewport is not a phone. Otherwise nothing is downloaded and the poster stays;
  // the button lets the visitor start or pause it at any time.
  var video = doc.querySelector('[data-video]');
  var vbtn = doc.querySelector('[data-vid-toggle]');
  if (video && vbtn) {
    var vlabel = function () {
      var paused = video.paused;
      vbtn.setAttribute('aria-label', paused ? vbtn.dataset.play : vbtn.dataset.pause);
      vbtn.firstElementChild.textContent = paused ? '▶' : '❚❚';
    };
    var conn = (window.navigator && window.navigator.connection) || null;
    var phone = window.matchMedia && window.matchMedia('(max-width: 699px)').matches;
    var autoplay = !reduce && !(conn && conn.saveData) && !phone;
    var startVideo = function () {
      var p = video.play();
      if (p && p.catch) p.catch(function () {}).then(vlabel);
    };
    if (autoplay) startVideo();
    vbtn.addEventListener('click', function () { if (video.paused) startVideo(); else video.pause(); vlabel(); });
    video.addEventListener('playing', vlabel);
    video.addEventListener('pause', vlabel);
    vlabel();
  }

  // slider (scroll-snap based, works in LTR and RTL)
  var root = doc.querySelector('[data-slider]');
  if (root) {
    var track = root.querySelector('[data-track]');
    var slides = Array.prototype.slice.call(track.children);
    var dots = Array.prototype.slice.call(root.querySelectorAll('[data-dot]'));
    var toggle = root.querySelector('[data-toggle]');
    var index = 0, timer = null, playing = !reduce, userPaused = reduce;

    var current = function () {
      var tl = track.getBoundingClientRect(), best = 0, bd = Infinity;
      var rtl = doc.documentElement.dir === 'rtl';
      slides.forEach(function (s, i) {
        var r = s.getBoundingClientRect();
        var d = Math.abs((rtl ? r.right - tl.right : r.left - tl.left));
        if (d < bd) { bd = d; best = i; }
      });
      return best;
    };
    var mark = function () {
      index = current();
      dots.forEach(function (d, i) { d.setAttribute('aria-current', String(i === index)); });
    };
    var go = function (i) {
      index = (i + slides.length) % slides.length;
      var s = slides[index];
      var rtl = doc.documentElement.dir === 'rtl';
      var tl = track.getBoundingClientRect(), sl = s.getBoundingClientRect();
      var delta = rtl ? sl.right - tl.right : sl.left - tl.left;
      track.scrollBy({ left: delta, behavior: reduce ? 'auto' : 'smooth' });
    };
    var stop = function () { if (timer) { clearInterval(timer); timer = null; } };
    var start = function () { stop(); if (playing && !userPaused) timer = setInterval(function () { go(index + 1); }, 6500); };
    var syncToggle = function () {
      var on = playing && !userPaused;
      toggle.setAttribute('aria-label', on ? root.dataset.pause : root.dataset.play);
      toggle.firstElementChild.textContent = on ? '❚❚' : '▶';
    };

    var st;
    track.addEventListener('scroll', function () { clearTimeout(st); st = setTimeout(mark, 80); }, { passive: true });
    root.querySelector('[data-prev]').addEventListener('click', function () { go(index - 1); start(); });
    root.querySelector('[data-next]').addEventListener('click', function () { go(index + 1); start(); });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); start(); }); });
    toggle.addEventListener('click', function () { userPaused = !userPaused; syncToggle(); start(); });
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);
    track.addEventListener('keydown', function (e) {
      var rtl = doc.documentElement.dir === 'rtl';
      if (e.key === 'ArrowRight') { e.preventDefault(); go(index + (rtl ? -1 : 1)); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(index + (rtl ? 1 : -1)); }
    });
    doc.addEventListener('visibilitychange', function () { if (doc.hidden) stop(); else start(); });
    mark(); syncToggle(); start();
  }

  // reveal on scroll
  if ('IntersectionObserver' in window && !reduce) {
    var els = doc.querySelectorAll('.card, .card-lg, .step, .sec-head, .facts li, .svc-detail, .manifesto li, .why-item, .faq details');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
    // safety net: never leave content hidden if the observer does not fire
    setTimeout(function () { els.forEach(function (el) { el.classList.add('in'); }); }, 3000);
  }

  // enquiry form
  var form = doc.querySelector('[data-form]');
  if (form) {
    var m = JSON.parse(form.dataset.msgs);
    var cfg = window.WAW_CONFIG || {};
    var summary = form.querySelector('[data-errors]');
    var status = form.querySelector('[data-status]');
    var submit = form.querySelector('[data-submit]');
    var interest = form.elements.interest;
    var allowed = Array.prototype.map.call(interest.options, function (o) { return o.value; });
    var wanted = new URLSearchParams(location.search).get('interest');
    if (wanted && allowed.indexOf(wanted) > -1) interest.value = wanted;
    var lastSent = 0;

    var setErr = function (name, msg) {
      var f = form.elements[name], p = form.querySelector('[data-err-for="' + name + '"]');
      if (!f || !p) return;
      p.textContent = msg || '';
      if (msg) { f.setAttribute('aria-invalid', 'true'); f.setAttribute('aria-describedby', p.id || (p.id = 'err-' + name)); }
      else { f.removeAttribute('aria-invalid'); f.removeAttribute('aria-describedby'); }
    };
    var validate = function () {
      var errs = [];
      var v = function (n) { return (form.elements[n].value || '').trim(); };
      var name = v('name'), email = v('email'), msg = v('message');
      var e1 = !name ? m.nameRequired : (name.length > 100 ? m.nameRequired : '');
      var e2 = (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ? m.invalidEmail : '';
      var e3 = msg.length < 10 ? m.messageShort : (msg.length > 3000 ? m.messageLong : '');
      setErr('name', e1); setErr('email', e2); setErr('message', e3);
      if (e1) errs.push(['name', e1]); if (e2) errs.push(['email', e2]); if (e3) errs.push(['message', e3]);
      return errs;
    };
    // Status line. Optional mailto link is built with DOM calls (no HTML injection).
    var say = function (text, cls, link) {
      status.textContent = text;
      status.className = 'status-msg ' + (cls || '');
      if (link) {
        status.appendChild(doc.createTextNode(' '));
        var a = doc.createElement('a');
        a.href = link.href; a.textContent = link.label; a.className = 'ltr'; a.dir = 'ltr';
        status.appendChild(a);
      }
    };
    var emailLink = function (data) {
      var label = interest.options[interest.selectedIndex].text;
      var body = data.name + '\n' + (data.company ? data.company + '\n' : '') + data.email + '\n' + label + '\n\n' + data.message;
      return { label: form.dataset.fallback, href: 'mailto:' + form.dataset.fallback + '?subject=' + encodeURIComponent('WAW enquiry: ' + label) + '&body=' + encodeURIComponent(body) };
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.elements.website.value) return; // honeypot
      var errs = validate();
      var ul = summary.querySelector('ul');
      ul.innerHTML = '';
      if (errs.length) {
        errs.forEach(function (er) {
          var li = doc.createElement('li'), a = doc.createElement('a');
          a.href = '#f-' + er[0]; a.textContent = er[1];
          a.addEventListener('click', function (ev) { ev.preventDefault(); form.elements[er[0]].focus(); });
          li.appendChild(a); ul.appendChild(li);
        });
        summary.hidden = false; summary.focus(); return;
      }
      summary.hidden = true;
      if (Date.now() - lastSent < 10000) { say(m.rate, 'bad'); return; }
      var data = {
        name: form.elements.name.value.trim(), email: form.elements.email.value.trim(), company: form.elements.company.value.trim(),
        interest: allowed.indexOf(interest.value) > -1 ? interest.value : 'general', message: form.elements.message.value.trim(), locale: form.dataset.locale,
      };

      var fallback = emailLink(data);

      if (!cfg.endpoint) {
        // No delivery service configured: nothing is sent and nothing is reported as sent.
        // The visitor's input stays in the form and they are pointed to email.
        say(m.notConfigured, '', fallback);
        return;
      }

      submit.disabled = true; say(m.pending);
      var ctl = new AbortController(); var to = setTimeout(function () { ctl.abort(); }, 15000);
      // Success only for an HTTP 2xx whose JSON body is exactly { "ok": true }. Anything else is a failure.
      Promise.resolve()
        .then(function () {
          return fetch(cfg.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data), signal: ctl.signal });
        })
        .then(function (r) {
          if (!r.ok) throw new Error('http');
          return r.json();
        })
        .then(function (body) {
          if (!body || body.ok !== true) throw new Error('not-accepted');
          lastSent = Date.now(); form.reset(); say(m.accepted, 'ok');
        })
        .catch(function () { say(m.failure, 'bad', fallback); })
        .then(function () { clearTimeout(to); submit.disabled = false; });
    });
  }
})();
