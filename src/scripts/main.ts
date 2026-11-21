import { animate, inView } from 'motion';

(function () {
  'use strict';
  var root = document.documentElement;
  function $$(s: string, c?: Document | Element) {
    return Array.prototype.slice.call((c || document).querySelectorAll(s));
  }
  function $(s: string, c?: Document | Element) {
    return (c || document).querySelector(s) as HTMLElement | null;
  }

  /* ---------- video players (always on) ---------- */
  (function () {
    function stopOthers(except: HTMLVideoElement) {
      $$('.frame video').forEach(function (v: HTMLVideoElement) {
        if (v !== except) v.pause();
      });
    }
    $$('.frame').forEach(function (f: HTMLElement) {
      var v = $('video', f) as HTMLVideoElement | null;
      var b = $('.play', f);
      if (!v || !b) return;
      v.controls = false;
      b.addEventListener('click', function () {
        stopOthers(v); f.classList.add('on'); v.controls = true; f.style.transform = ''; v.play().catch(function () {});
      });
      v.addEventListener('play', function () { stopOthers(v); f.classList.add('on'); v.controls = true; });
      v.addEventListener('ended', function () { f.classList.remove('on'); v.controls = false; });
    });
  })();

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  root.classList.add('js');

  try { init(); } catch (e) { root.classList.add('js-off'); if (window.console) console.error(e); }

  function init() {
    var ease: [number, number, number, number] = [0.22, 1, 0.36, 1];
    var fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
    var seen = root.classList.contains('seen');

    /* ---------- helpers ---------- */
    function splitWords(el: Element) {
      var out: HTMLElement[] = [];
      (function walk(node: Node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (n: Node) {
          if (n.nodeType === 3) {
            var frag = document.createDocumentFragment();
            (n.textContent || '').split(/(\s+)/).forEach(function (t) {
              if (!t) return;
              if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(' ')); return; }
              var w = document.createElement('span'); w.className = 'w';
              var i = document.createElement('span'); i.className = 'wi'; i.textContent = t;
              w.appendChild(i); frag.appendChild(w); out.push(i);
            });
            (n as ChildNode).parentNode!.replaceChild(frag, n);
          } else if (n.nodeType === 1 && (n as Element).tagName !== 'BR') { walk(n); }
        });
      })(el);
      return out;
    }
    function reveal(el: any, delay?: number, from?: string, dur?: number) {
      if (el.__done) return; el.__done = 1;
      var c = animate(el, { opacity: [0, 1], transform: [from || 'translateY(40px)', 'translateY(0px)'] },
        { duration: dur || 0.95, delay: delay || 0, ease: ease });
      c.then(function () { el.classList.add('in'); el.style.opacity = ''; el.style.transform = ''; });
    }
    function wordsUp(words: HTMLElement[], delay: number) {
      words.forEach(function (w, i) {
        animate(w, { transform: ['translateY(112%)', 'translateY(0%)'] }, { duration: 1.05, delay: delay + i * 0.09, ease: ease });
      });
    }

    /* ---------- split headings ---------- */
    $$('h1,h2').forEach(function (h: any) {
      var w = splitWords(h);
      w.forEach(function (i) { i.style.transform = 'translateY(112%)'; });
      h.__w = w;
    });
    root.classList.add('split-on');

    /* ---------- hero intro (right after the curtain lifts; near-instant on repeat visits) ---------- */
    var d0 = seen ? 0.1 : 0.9;
    var h1 = $('h1') as any;
    if (h1) wordsUp(h1.__w, d0);
    $$('.hi').forEach(function (el, i) { reveal(el, d0 + 0.2 + i * 0.12, 'translateY(28px)'); });
    setTimeout(function () {
      $$('.hi').forEach(function (el: any) { if (!el.classList.contains('in')) { el.classList.add('in'); el.style.opacity = ''; } });
      $$('h1 .wi').forEach(function (w) { (w as HTMLElement).style.transform = 'translateY(0%)'; });
    }, seen ? 900 : 3000);
    try { sessionStorage.setItem('sn-seen', '1'); } catch (e) {}

    /* ---------- scroll reveals ---------- */
    $$('h2').forEach(function (h: any) {
      inView(h, function () { wordsUp(h.__w, 0); h.classList.add('in'); }, { amount: 0.5 });
    });
    $$('.lead').forEach(function (el) { el.classList.add('rv'); inView(el, function () { reveal(el, 0.2, 'translateY(24px)'); }, { amount: 0.4 }); });
    $$('.about > p:not(.lead)').forEach(function (el) { el.classList.add('rv'); inView(el, function () { reveal(el, 0.1); }, { amount: 0.3 }); });
    ([['.stats', '.stat', 'translateY(40px) scale(.92)'], ['.brands', 'span', 'translateY(24px) scale(.94)'],
      ['.steps', '.step', 'translateY(44px)'], ['.contact .row', '.btn', 'translateY(30px)']] as const).forEach(function (g) {
      $$(g[0]).forEach(function (parent) {
        var items = $$(g[1], parent);
        items.forEach(function (it) { it.classList.add('rv'); });
        inView(parent, function () { items.forEach(function (it, i) { reveal(it, i * 0.11, g[2]); }); }, { amount: 0.25 });
      });
    });
    var ct = $('.contact .tag'); if (ct) { ct.classList.add('rv'); inView(ct, function () { reveal(ct, 0, 'translateY(20px)'); }, { amount: 0.6 }); }

    var cards = $$('.vcard');
    cards.forEach(function (c) { c.classList.add('rv'); });
    cards.forEach(function (c, i) {
      inView(c, function () {
        var reel = $('.reel');
        var cols = reel ? getComputedStyle(reel).gridTemplateColumns.split(' ').length : 1;
        reveal(c, (i % (cols || 1)) * 0.12, 'translateY(70px) scale(.95)', 1.05);
      }, { amount: 0.15 });
    });

    $$('.vis figure').forEach(function (f: any) {
      f.classList.add('rv');
      inView(f, function () {
        if (f.__done) return; f.__done = 1;
        var c = animate(f, { opacity: [0, 1], clipPath: ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'] }, { duration: 1.2, ease: ease });
        c.then(function () { f.classList.add('in'); f.style.opacity = ''; f.style.clipPath = ''; });
        var im = $('img', f); if (im) animate(im, { transform: ['scale(1.25)', 'scale(1)'] }, { duration: 1.6, ease: ease });
      }, { amount: 0.2 });
    });

    /* ---------- nav pill + progress + parallax + marquee (one frame loop) ---------- */
    var prog = $('.prog'), nav = $('.nav'), hero = $('.hero'), heroIn = $('.hero-in');
    var parEls = $$('[data-speed],[data-hx]');
    var marq = $('.marq div'), mpos = 0, mhalf = 0, sv = 0, dir = 1, lastY = window.scrollY, first = true;
    function measure() { mhalf = marq ? (marq as HTMLElement).offsetWidth / 2 : 0; }
    measure(); addEventListener('resize', measure); addEventListener('load', measure);

    var tx = innerWidth / 2, ty = innerHeight / 2, rx = tx, ry = ty;
    var cur = $('.cur'), cdot = $('.cdot'), cring = $('.cring');
    var depthEls = $$('[data-depth]'), dS = depthEls.map(function () { return { x: 0, y: 0, tx: 0, ty: 0 }; });

    function par(el: any, axisKey: 'x' | 'y', k: number) {
      var r = el.getBoundingClientRect();
      var prev = el.__o || 0;
      var base = axisKey === 'x' ? 0 : (r.top - prev);
      var centre = axisKey === 'x' ? (r.top + r.height / 2 - innerHeight / 2) : (base + r.height / 2 - innerHeight / 2);
      var off = centre * k;
      el.__o = off;
      el.style.translate = axisKey === 'x' ? off.toFixed(1) + 'px 0' : '0 ' + off.toFixed(1) + 'px';
    }
    function loop() {
      var y = window.scrollY, raw = y - lastY; lastY = y;
      sv += (raw - sv) * 0.12;
      if (Math.abs(raw) > 0.5) dir = raw > 0 ? 1 : -1;

      if (marq && mhalf) {
        mpos -= (0.55 + Math.min(Math.abs(sv), 40) * 0.45) * dir;
        if (mpos <= -mhalf) mpos += mhalf; if (mpos > 0) mpos -= mhalf;
        (marq as HTMLElement).style.transform = 'translate3d(' + mpos.toFixed(2) + 'px,0,0)';
      }
      if (raw !== 0 || first) {
        var max = root.scrollHeight - innerHeight;
        if (prog) prog.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0).toFixed(4) + ')';
        if (nav) nav.classList.toggle('show', y > innerHeight * 0.55);
        if (heroIn && y < innerHeight * 1.2) {
          heroIn.style.translate = '0 ' + (y * 0.2).toFixed(1) + 'px';
          heroIn.style.opacity = Math.max(0, 1 - y / (innerHeight * 0.85)).toFixed(3);
        }
        parEls.forEach(function (el: any) {
          if (el.hasAttribute('data-hx')) par(el, 'x', parseFloat(el.getAttribute('data-hx')));
          else par(el, 'y', parseFloat(el.getAttribute('data-speed')));
        });
        first = false;
      }
      if (fine && cdot && cring) {
        rx += (tx - rx) * 0.16; ry += (ty - ry) * 0.16;
        cdot.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,0)';
        cring.style.transform = 'translate3d(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px,0)';
        depthEls.forEach(function (el, i) {
          var s = dS[i]; s.x += (s.tx - s.x) * 0.07; s.y += (s.ty - s.y) * 0.07;
          (el as HTMLElement).style.translate = s.x.toFixed(2) + 'px ' + s.y.toFixed(2) + 'px';
        });
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    /* active nav link */
    var links: Record<string, Element> = {};
    $$('.nav a').forEach(function (a) { links[(a.getAttribute('href') || '').slice(1)] = a; });
    ['about', 'work', 'concepts', 'contact'].forEach(function (id) {
      var s = document.getElementById(id); if (!s) return;
      inView(s, function () {
        Object.keys(links).forEach(function (k) { links[k].classList.toggle('act', k === id); });
        return function () { links[id] && links[id].classList.remove('act'); };
      }, { amount: 0.3 });
    });

    /* ---------- mouse effects (fine pointers only) ---------- */
    if (!fine || !cur || !hero) return;
    root.classList.add('has-cursor');
    addEventListener('pointermove', function (e) { tx = e.clientX; ty = e.clientY; cur.classList.add('vis'); }, { passive: true });
    root.addEventListener('mouseleave', function () { cur.classList.remove('vis'); });
    addEventListener('pointerdown', function () { cur.classList.add('down'); });
    addEventListener('pointerup', function () { cur.classList.remove('down'); });
    addEventListener('pointerover', function (e) {
      var t = e.target as Element, s = '';
      if (t.closest('.frame.on')) s = 'native';
      else if (t.closest('.frame')) s = 'play';
      else if (t.closest('a,button')) s = 'link';
      cur.setAttribute('data-s', s);
    });

    /* hero: spotlight, depth parallax, sparkle trail */
    var spN = 0, lastSp = 0;
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      hero.style.setProperty('--my', (e.clientY - r.top) + 'px');
      var nx = (e.clientX / innerWidth - 0.5) * 2, ny = (e.clientY / innerHeight - 0.5) * 2;
      depthEls.forEach(function (el, i) {
        var d = parseFloat(el.getAttribute('data-depth') || '0');
        dS[i].tx = -nx * d; dS[i].ty = -ny * d * 0.6;
      });
      var now = performance.now();
      if (now - lastSp < 50 || spN > 28) return; lastSp = now;
      var s = document.createElement('i'); s.className = 'sp' + (Math.random() > 0.55 ? ' rose' : '');
      s.style.left = (e.clientX - r.left) + 'px'; s.style.top = (e.clientY - r.top) + 'px';
      hero.appendChild(s); spN++;
      var dx = (Math.random() - 0.5) * 70, dy = 18 + Math.random() * 46;
      animate(s, { opacity: [1, 0], transform: ['translate(-50%,-50%) scale(1) rotate(0deg)', 'translate(' + dx + 'px,' + dy + 'px) scale(0.2) rotate(90deg)'] },
        { duration: 1.1, ease: 'easeOut' }).then(function () { s.remove(); spN--; });
    });
    hero.addEventListener('pointerleave', function () { dS.forEach(function (s) { s.tx = 0; s.ty = 0; }); });

    /* magnetic buttons */
    $$('.btn,.nav a').forEach(function (b: HTMLElement) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.translate = ((e.clientX - r.left - r.width / 2) * 0.3).toFixed(1) + 'px ' + ((e.clientY - r.top - r.height / 2) * 0.4).toFixed(1) + 'px';
      });
      b.addEventListener('pointerleave', function () { b.style.translate = '0px 0px'; });
    });

    /* 3D tilt + glare on video cards */
    cards.forEach(function (c) {
      var f = $('.frame', c);
      if (!f) return;
      c.addEventListener('pointermove', function (e) {
        if (f.classList.contains('on')) { f.style.transform = ''; return; }
        var r = f.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        f.style.transform = 'perspective(900px) rotateX(' + ((0.5 - py) * 9).toFixed(2) + 'deg) rotateY(' + ((px - 0.5) * 11).toFixed(2) + 'deg) scale(1.025)';
        f.style.setProperty('--gx', (px * 100).toFixed(1) + '%'); f.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
      });
      c.addEventListener('pointerleave', function () { f.style.transform = ''; });
    });
  }
})();
