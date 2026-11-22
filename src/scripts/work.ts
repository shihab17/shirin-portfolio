import { animate, inView } from 'motion';

// Project detail page — enter sequence, scroll reveals, ambient video
// preview and the custom cursor. Mirrors the index-page feel without
// dragging in the reel/hero machinery.
(function () {
  'use strict';
  var root = document.documentElement;
  function $$(s: string, c?: Document | Element) {
    return Array.prototype.slice.call((c || document).querySelectorAll(s));
  }
  function $(s: string, c?: Document | Element) {
    return (c || document).querySelector(s) as HTMLElement | null;
  }

  /* ---------- ambient video preview (functional — runs for everyone) ---------- */
  root.classList.add('js-video');
  var frame = $('.wframe');
  var video = (frame && frame.querySelector('video')) as HTMLVideoElement | null;
  if (frame && video) {
    (video as any).__preview = true;
    video.muted = true;
    video.loop = true;
    video.controls = false;
    var realPlay = function () {
      (video as any).__preview = false;
      video.muted = false;
      video.loop = false;
      video.controls = true;
      frame.classList.remove('preview');
      frame.classList.add('on');
      video.play().catch(function () {});
    };
    var playBtn = $('.play', frame);
    if (playBtn) playBtn.addEventListener('click', realPlay);
    frame.addEventListener('click', function () {
      if (frame.classList.contains('preview')) realPlay();
    });
    video.addEventListener('ended', function () {
      frame.classList.remove('on');
      video.controls = false;
    });
    inView(frame, function () {
      video!.play().then(function () {
        frame.classList.add('preview');
      }).catch(function () {
        (video as any).__preview = false;
      });
    }, { amount: 0.3 });
  }

  /* ---------- gallery lightbox (functional — runs for everyone) ---------- */
  var gImgs = $$('.wgallery img');
  if (gImgs.length) {
    var lbx = document.createElement('div');
    lbx.className = 'lbx';
    lbx.setAttribute('role', 'dialog');
    lbx.setAttribute('aria-label', 'Image viewer');
    lbx.innerHTML =
      '<button class="lbx-x" type="button" aria-label="Close">×</button>' +
      '<button class="lbx-p" type="button" aria-label="Previous image">‹</button>' +
      '<img alt="" />' +
      '<button class="lbx-n" type="button" aria-label="Next image">›</button>';
    document.body.appendChild(lbx);
    var lbxImg = lbx.querySelector('img') as HTMLImageElement;
    var li = 0;
    var openLbx = function (i: number) {
      li = (i + gImgs.length) % gImgs.length;
      var im = gImgs[li] as HTMLImageElement;
      lbxImg.src = im.src.replace('w=1080', 'w=1600');
      lbxImg.alt = im.alt;
      lbx.classList.add('on');
      document.body.style.overflow = 'hidden';
    };
    var closeLbx = function () {
      lbx.classList.remove('on');
      document.body.style.overflow = '';
    };
    gImgs.forEach(function (im, i) {
      im.addEventListener('click', function () { openLbx(i); });
      im.addEventListener('keydown', function (e) {
        var k = (e as KeyboardEvent).key;
        if (k === 'Enter' || k === ' ') { e.preventDefault(); openLbx(i); }
      });
    });
    lbx.querySelector('.lbx-x')!.addEventListener('click', closeLbx);
    lbx.querySelector('.lbx-p')!.addEventListener('click', function () { openLbx(li - 1); });
    lbx.querySelector('.lbx-n')!.addEventListener('click', function () { openLbx(li + 1); });
    lbx.addEventListener('click', function (e) { if (e.target === lbx) closeLbx(); });
    addEventListener('keydown', function (e) {
      if (!lbx.classList.contains('on')) return;
      if (e.key === 'Escape') closeLbx();
      if (e.key === 'ArrowLeft') openLbx(li - 1);
      if (e.key === 'ArrowRight') openLbx(li + 1);
    });
  }

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  root.classList.add('js');
  var ease: [number, number, number, number] = [0.22, 1, 0.36, 1];
  var fine = matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ---------- helpers (same split/mask + reveal as the index page) ---------- */
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
  function clipReveal(el: any, delay?: number) {
    if (el.__done) return; el.__done = 1;
    var c = animate(el, { opacity: [0, 1], clipPath: ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'] },
      { duration: 1.1, delay: delay || 0, ease: ease });
    c.then(function () { el.classList.add('in'); el.style.opacity = ''; el.style.clipPath = ''; });
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

  /* ---------- enter sequence ---------- */
  $$('.crumbs, .wmain .tag, .wmain .chips span, .wframe, .wfacts').forEach(function (el) {
    el.classList.add('rv');
  });
  var h1 = $('h1') as any;
  if (h1) wordsUp(h1.__w, 0.15);
  var crumbs = $('.crumbs');
  if (crumbs) reveal(crumbs, 0.05, 'translateY(-14px)', 0.7);
  var tag = $('.wmain .tag');
  if (tag) reveal(tag, 0.1, 'translateY(14px)', 0.7);
  $$('.wmain .chips span').forEach(function (el, i) {
    reveal(el, 0.55 + i * 0.09, 'translateY(16px)', 0.6);
  });
  if (frame) clipReveal(frame, 0.35);
  var facts = $('.wfacts');
  if (facts) reveal(facts, 0.5, 'translateX(40px)', 1);

  /* ---------- scroll reveals ---------- */
  $$('h2').forEach(function (h: any) {
    inView(h, function () { wordsUp(h.__w, 0); h.classList.add('in'); }, { amount: 0.5 });
  });
  $$('.wdesc p').forEach(function (el, i) {
    el.classList.add('rv');
    inView(el, function () { reveal(el, i * 0.06, 'translateY(22px)'); }, { amount: 0.3 });
  });
  $$('.wgallery img').forEach(function (el, i) {
    el.classList.add('rv');
    inView(el, function () { clipReveal(el, i * 0.08); }, { amount: 0.25 });
  });
  $$('.rcard').forEach(function (el, i) {
    el.classList.add('rv');
    inView(el, function () { reveal(el, i * 0.11, 'translateY(46px)'); }, { amount: 0.2 });
  });
  $$('.wprocess .step').forEach(function (el, i) {
    el.classList.add('rv');
    inView(el, function () { reveal(el, i * 0.11, 'translateY(44px)'); }, { amount: 0.25 });
  });
  $$('.wquote').forEach(function (el) {
    el.classList.add('rv');
    inView(el, function () { reveal(el, 0.1, 'translateY(24px)'); }, { amount: 0.4 });
  });
  $$('.wflow, .wcta').forEach(function (el) {
    el.classList.add('rv');
    inView(el, function () { reveal(el, 0.1, 'translateY(30px)'); }, { amount: 0.3 });
  });

  /* ---------- frame glare (follows the pointer) ---------- */
  if (fine && frame) {
    frame.addEventListener('pointermove', function (e) {
      var r = frame!.getBoundingClientRect();
      frame!.style.setProperty('--gx', (((e.clientX - r.left) / r.width) * 100).toFixed(1) + '%');
      frame!.style.setProperty('--gy', (((e.clientY - r.top) / r.height) * 100).toFixed(1) + '%');
    });
  }

  /* ---------- magnetic buttons ---------- */
  $$('.btn').forEach(function (b: HTMLElement) {
    b.addEventListener('pointermove', function (e) {
      var r = b.getBoundingClientRect();
      b.style.translate = ((e.clientX - r.left - r.width / 2) * 0.3).toFixed(1) + 'px ' + ((e.clientY - r.top - r.height / 2) * 0.4).toFixed(1) + 'px';
    });
    b.addEventListener('pointerleave', function () { b.style.translate = '0px 0px'; });
  });

  /* ---------- custom cursor ---------- */
  var cur = $('.cur'), cdot = $('.cdot'), cring = $('.cring');
  if (!fine || !cur || !cdot || !cring) return;
  root.classList.add('has-cursor');
  var tx = innerWidth / 2, ty = innerHeight / 2, rx = tx, ry = ty;
  addEventListener('pointermove', function (e) { tx = e.clientX; ty = e.clientY; cur.classList.add('vis'); }, { passive: true });
  root.addEventListener('mouseleave', function () { cur.classList.remove('vis'); });
  addEventListener('pointerdown', function () { cur.classList.add('down'); });
  addEventListener('pointerup', function () { cur.classList.remove('down'); });
  addEventListener('pointerover', function (e) {
    var t = e.target as Element, s = '';
    if (t.closest('.wframe.on, .frame.on')) s = 'native';
    else if (t.closest('.wframe, .frame')) s = 'play';
    else if (t.closest('a,button')) s = 'link';
    cur.setAttribute('data-s', s);
  });
  (function loop() {
    rx += (tx - rx) * 0.16; ry += (ty - ry) * 0.16;
    cdot.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,0)';
    cring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
    requestAnimationFrame(loop);
  })();
})();
