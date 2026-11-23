// --- Mobile nav toggle ---
const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('#primary-nav');

if (menuToggle && primaryNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    primaryNav.classList.toggle('is-open', !isOpen);
  });

  primaryNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
      primaryNav.classList.remove('is-open');
    });
  });
}

// --- Footer year ---
const yearElement = document.querySelector('#year');
if (yearElement) yearElement.textContent = String(new Date().getFullYear());

// --- Respect reduced motion ---
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

// --- Split hero title into words for reveal ---
const splitTarget = document.querySelector('.split-reveal');
if (splitTarget && !prefersReducedMotion) {
  const text = splitTarget.textContent.trim();
  splitTarget.textContent = '';
  text.split(' ').forEach((word, i, arr) => {
    const w = document.createElement('span');
    w.className = 'word';
    const inner = document.createElement('span');
    inner.textContent = word;
    w.appendChild(inner);
    splitTarget.appendChild(w);
    if (i < arr.length - 1) splitTarget.appendChild(document.createTextNode(' '));
  });
}

// --- Scroll reveal via IntersectionObserver ---
const revealTargets = document.querySelectorAll('.reveal, .split-reveal');
if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealTargets.forEach((el) => io.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add('is-visible'));
}

// --- Active section highlighting for nav ---
const navLinks = Array.from(document.querySelectorAll('.primary-nav .nav-link'));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if (sections.length && 'IntersectionObserver' in window) {
  const sectionIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
      }
    });
  }, { threshold: 0.35 });
  sections.forEach((s) => sectionIO.observe(s));
}

// --- Custom cursor ---
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');

if (dot && ring && !isTouch && !prefersReducedMotion) {
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    document.body.classList.add('cursor-active');
  });

  const animateRing = () => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  };
  requestAnimationFrame(animateRing);

  document.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));

  const hoverables = document.querySelectorAll('a, button, .tilt-card, .interest-list li');
  hoverables.forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// --- Magnetic buttons ---
if (!isTouch && !prefersReducedMotion) {
  document.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left - rect.width / 2;
      const my = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${mx * 0.25}px, ${my * 0.35}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

// --- Tilt effect on hero art and project cards ---
if (!isTouch && !prefersReducedMotion) {
  const applyTilt = (el, strength = 8) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.querySelectorAll('.hero-art, .swirl-layer').forEach((layer) => {
        layer.style.transform = `scale(1.06) translate3d(${x * -14}px, ${y * -14}px, 0)`;
      });
      if (!el.querySelector('.hero-art')) {
        const img = el.querySelector('img');
        if (img) img.style.transform = `scale(1.06) translate3d(${x * -14}px, ${y * -14}px, 0)`;
      }
      el.style.transform = `perspective(900px) rotateY(${x * strength}deg) rotateX(${y * -strength}deg)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.querySelectorAll('.hero-art, .swirl-layer').forEach((layer) => { layer.style.transform = ''; });
      if (!el.querySelector('.hero-art')) {
        const img = el.querySelector('img');
        if (img) img.style.transform = '';
      }
    });
  };
  document.querySelectorAll('.tilt').forEach((el) => applyTilt(el, 6));
  document.querySelectorAll('.tilt-card').forEach((el) => applyTilt(el, 4));
}

// ===== Interactive layer =====

// --- Scroll progress ---
const progressBar = document.querySelector('.scroll-progress');
if (progressBar) {
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

// --- Toast ---
const toast = document.querySelector('.toast');
let toastTimer;
const showToast = (msg) => {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-on'), 2200);
};

// --- Click email to copy ---
const emailLink = document.querySelector('a[href^="mailto:"]');
if (emailLink && navigator.clipboard) {
  emailLink.title = 'Click to copy email';
  emailLink.addEventListener('click', (e) => {
    e.preventDefault();
    const addr = emailLink.getAttribute('href').replace('mailto:', '');
    navigator.clipboard.writeText(addr).then(
      () => showToast('Email copied ✓'),
      () => { window.location.href = emailLink.getAttribute('href'); }
    );
  });
}

// --- Skill chips filter projects ---
const chips = Array.from(document.querySelectorAll('.interest-list li'));
const cards = Array.from(document.querySelectorAll('.project-card'));
const filterStatus = document.querySelector('#filter-status');
const filterHint = document.querySelector('[data-hint]');
let activeChip = null;

const clearFilter = () => {
  activeChip = null;
  chips.forEach((c) => c.setAttribute('aria-pressed', 'false'));
  cards.forEach((c) => {
    c.classList.remove('is-dim', 'is-match');
    c.querySelectorAll('.tech-list li').forEach((t) => t.classList.remove('is-hit'));
  });
  if (filterStatus) filterStatus.hidden = true;
};

const applyFilter = (chip) => {
  const term = chip.textContent.trim().toLowerCase();
  activeChip = chip;
  chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
  let matches = 0;
  cards.forEach((card) => {
    const hit = card.dataset.tags.includes(term) ||
      Array.from(card.querySelectorAll('.tech-list li')).some((t) => t.textContent.toLowerCase().includes(term));
    card.classList.toggle('is-match', hit);
    card.classList.toggle('is-dim', !hit);
    card.querySelectorAll('.tech-list li').forEach((t) => t.classList.toggle('is-hit', hit && t.textContent.toLowerCase().includes(term)));
    if (hit) matches++;
  });
  if (filterStatus) {
    filterStatus.hidden = false;
    filterStatus.textContent = matches
      ? `${matches} project${matches > 1 ? 's' : ''} using ${chip.textContent.trim()}`
      : `No projects with ${chip.textContent.trim()} yet — coming soon`;
    const reset = document.createElement('button');
    reset.type = 'button';
    reset.textContent = 'Clear ✕';
    reset.addEventListener('click', clearFilter);
    filterStatus.appendChild(reset);
  }
  if (filterHint) filterHint.hidden = true;
  if (matches) document.querySelector('#projects').scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  else showToast(`No ${chip.textContent.trim()} projects yet`);
};

chips.forEach((chip) => {
  chip.tabIndex = 0;
  chip.setAttribute('role', 'button');
  chip.setAttribute('aria-pressed', 'false');
  const toggle = () => (activeChip === chip ? clearFilter() : applyFilter(chip));
  chip.addEventListener('click', toggle);
  chip.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  });
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && activeChip) clearFilter(); });

// --- Card spotlight follows cursor ---
cards.forEach((card) => {
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
});

// --- Cursor label over project visuals ---
if (ring && !isTouch && !prefersReducedMotion) {
  document.querySelectorAll('.project-visual').forEach((el) => {
    el.addEventListener('mouseenter', () => { ring.dataset.label = 'OPEN ↗'; document.body.classList.add('cursor-label'); });
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-label'));
  });
  chips.forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// --- Confetti sparks (portrait click, star click) ---
const burst = (x, y) => {
  if (prefersReducedMotion) return;
  const colors = ['#ffe93a', '#f65456', '#03aae6', '#9a76f4', '#c7e86b'];
  for (let i = 0; i < 16; i++) {
    const s = document.createElement('span');
    s.className = 'spark';
    s.style.left = `${x}px`;
    s.style.top = `${y}px`;
    s.style.background = colors[i % colors.length];
    document.body.appendChild(s);
    const angle = (Math.PI * 2 * i) / 16 + Math.random() * 0.4;
    const dist = 60 + Math.random() * 70;
    s.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist + 30}px) scale(.2)`, opacity: 0 }
    ], { duration: 750 + Math.random() * 300, easing: 'cubic-bezier(.2,.7,.2,1)' }).onfinish = () => s.remove();
  }
};

const portrait = document.querySelector('.hero-portrait');
if (portrait) {
  const quips = ['Hi 👋', 'Caught mid-smile', 'Still learning R', 'Ask me about Python'];
  const tag = portrait.querySelector('.portrait-tag');
  const original = tag.innerHTML;
  let q = 0;
  portrait.addEventListener('click', (e) => {
    burst(e.clientX, e.clientY);
    portrait.classList.remove('is-wiggle');
    void portrait.offsetWidth;
    portrait.classList.add('is-wiggle');
    tag.innerHTML = `<span class="portrait-dot"></span> ${quips[q++ % quips.length].toUpperCase()}`;
    clearTimeout(portrait._t);
    portrait._t = setTimeout(() => { tag.innerHTML = original; }, 2400);
  });
}
const star = document.querySelector('.bottom-star');
if (star) star.addEventListener('click', (e) => burst(e.clientX, e.clientY));


// --- Anchor the cloud swirl on the spiral's centre (maps image coords through object-fit: cover) ---
const artWrap = document.querySelector('.hero-art-wrap');
const artImg = document.querySelector('.hero-art');
if (artWrap && artImg) {
  const SPIRAL = { x: 0.486, y: 0.412 };
  const place = () => {
    const nw = artImg.naturalWidth, nh = artImg.naturalHeight;
    if (!nw) return;
    const w = artWrap.clientWidth, h = artWrap.clientHeight;
    const s = Math.max(w / nw, h / nh);
    const cx = (w - nw * s) / 2 + SPIRAL.x * nw * s;
    const cy = (h - nh * s) / 2 + SPIRAL.y * nh * s;
    const iw = nw * s;
    artWrap.style.setProperty('--cx', `${cx}px`);
    artWrap.style.setProperty('--cy', `${cy}px`);
    artWrap.style.setProperty('--rx', `${iw * 0.27}px`);
    artWrap.style.setProperty('--ry', `${iw * 0.36}px`);
    artWrap.style.setProperty('--ri', `${iw * 0.15}px`);
  };
  if (artImg.complete) place(); else artImg.addEventListener('load', place);
  window.addEventListener('resize', place);
}


// ===== Dino runner =====
(() => {
  const canvas = document.querySelector('#dino-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = W * dpr; canvas.height = H * dpr;
  ctx.scale(dpr, dpr);

  const INK = '#191526', CORAL = '#f65456', MUTED = '#777181', PAPER = '#f7f2e8', YELLOW = '#ffe93a';
  const GROUND = H - 22, PX = 2;
  const BODY = [
    '........XXXXXXX.',
    '........XXXXXXXX',
    '........XX.XXXXX',
    '........XXXXXXXX',
    '........XXXXXXXX',
    '........XXXX....',
    'X.......XXXXXXX.',
    'X......XXXXXXX..',
    'XX....XXXXXXXXX.',
    'XXXXXXXXXXXXX.X.',
    '.XXXXXXXXXXXX...',
    '..XXXXXXXXXX....',
    '...XXXXXXXX.....',
    '....XXXXXX......',
  ];
  const DW = 16 * PX, DH = (BODY.length + 3) * PX, DX = 26;

  let state = 'idle', y = 0, vy = 0, speed = 4.2, dist = 0, best = 0, frame = 0;
  let obstacles = [], clouds = [], nextSpawn = 0, last = 0, rafId = 0, visible = true, flash = 0;
  const reduce = prefersReducedMotion;
  try { best = Number(localStorage.getItem('dino-best')) || 0; } catch (e) {}

  const reset = () => {
    y = 0; vy = 0; speed = 4.2; dist = 0; obstacles = []; nextSpawn = 70;
    clouds = [{ x: 90, y: 20 }, { x: 260, y: 34 }, { x: 380, y: 14 }];
  };

  const jump = () => { if (y === 0) vy = 8.6; };

  const drawDino = (dead) => {
    const top = GROUND - y - DH;
    ctx.fillStyle = INK;
    BODY.forEach((row, r) => {
      for (let c = 0; c < row.length; c++) {
        if (row[c] === 'X') ctx.fillRect(DX + c * PX, top + r * PX, PX, PX);
      }
    });
    const legA = frame % 2 === 0;
    const legY = top + BODY.length * PX;
    const airborne = y > 0 || dead;
    ctx.fillRect(DX + 4 * PX, legY, 3 * PX, (airborne || legA ? 3 : 2) * PX);
    ctx.fillRect(DX + 9 * PX, legY, 3 * PX, (airborne || !legA ? 3 : 2) * PX);
    ctx.fillStyle = PAPER;
    if (dead) { ctx.fillRect(DX + 10 * PX, top + 2 * PX, PX, PX); ctx.fillStyle = CORAL; ctx.fillRect(DX + 10 * PX, top + 2 * PX, PX, PX); }
  };

  const drawCactus = (o) => {
    ctx.fillStyle = CORAL;
    ctx.strokeStyle = INK; ctx.lineWidth = 1.5;
    const stem = (x, h, w) => { ctx.beginPath(); ctx.roundRect(x, GROUND - h, w, h, 3); ctx.fill(); ctx.stroke(); };
    stem(o.x, o.h, 7);
    if (o.arms) {
      stem(o.x - 5, 12, 5); stem(o.x + 7, 9, 5);
    }
    if (o.double) stem(o.x + 13, o.h - 8, 7);
  };

  const render = (now) => {
    ctx.clearRect(0, 0, W, H);
    // sky details
    ctx.fillStyle = 'rgba(25,21,38,.08)';
    clouds.forEach((c) => { ctx.beginPath(); ctx.roundRect(c.x, c.y, 26, 6, 3); ctx.fill(); ctx.beginPath(); ctx.roundRect(c.x + 6, c.y - 4, 14, 6, 3); ctx.fill(); });
    // ground
    ctx.fillStyle = INK; ctx.fillRect(0, GROUND, W, 2);
    for (let i = 0; i < 18; i++) {
      const gx = ((i * 47 - dist * 2.2) % (W + 20) + (W + 20)) % (W + 20) - 10;
      ctx.fillRect(gx, GROUND + 6 + (i % 3) * 4, 3 + (i % 4), 1.5);
    }
    obstacles.forEach(drawCactus);
    drawDino(state === 'over');

    // HUD
    ctx.font = '700 9px "DM Sans", sans-serif';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'right';
    ctx.fillStyle = MUTED;
    ctx.fillText(`HI ${String(Math.floor(best)).padStart(5, '0')}   ${String(Math.floor(dist / 8)).padStart(5, '0')}`, W - 12, 10);
    ctx.textAlign = 'left';
    ctx.fillStyle = INK;
    if (state === 'idle' || state === 'demo') {
      const label = reduce ? 'PRESS SPACE OR CLICK TO PLAY' : 'CLICK OR PRESS SPACE TO PLAY';
      ctx.fillText(label, 12, 10);
    }
    if (state === 'over') {
      ctx.textAlign = 'center';
      ctx.font = '800 12px "Syne", sans-serif';
      ctx.fillText('GAME OVER', W / 2, 30);
      ctx.font = '700 9px "DM Sans", sans-serif';
      ctx.fillStyle = MUTED;
      ctx.fillText('CLICK OR SPACE TO RETRY', W / 2, 48);
    }
  };

  const step = (dt) => {
    // physics
    if (y > 0 || vy > 0) {
      y += vy * dt; vy -= 0.5 * dt;
      if (y <= 0) { y = 0; vy = 0; }
    }
    dist += speed * dt;
    if (state === 'playing') speed = Math.min(9, speed + 0.0015 * dt);
    frame = Math.floor(dist / 7);

    clouds.forEach((c) => { c.x -= 0.4 * dt; if (c.x < -30) { c.x = W + 20; c.y = 10 + Math.random() * 30; } });

    nextSpawn -= speed * dt;
    if (nextSpawn <= 0) {
      const h = 18 + Math.floor(Math.random() * 10);
      obstacles.push({ x: W + 10, h, arms: h > 22, double: Math.random() < 0.25 });
      nextSpawn = 150 + Math.random() * 120;
    }
    obstacles.forEach((o) => { o.x -= speed * dt; });
    obstacles = obstacles.filter((o) => o.x > -30);

    const front = obstacles.find((o) => o.x + 20 > DX);
    if (state === 'demo' && front && front.x - (DX + DW) < speed * 11 && y === 0) jump();

    if (state === 'playing') {
      const hit = obstacles.some((o) => {
        const ow = o.double ? 20 : (o.arms ? 19 : 7);
        const ox = o.arms ? o.x - 5 : o.x;
        return DX + 6 < ox + ow && DX + DW - 4 > ox && GROUND - y - 4 > GROUND - o.h;
      });
      if (hit) {
        state = 'over';
        if (dist / 8 > best) {
          best = dist / 8;
          try { localStorage.setItem('dino-best', String(best)); } catch (e) {}
        }
      }
    }
  };

  const loop = (t) => {
    rafId = 0;
    const dt = Math.min((t - (last || t)) / 16.67, 3);
    last = t;
    if (state !== 'over' && state !== 'idle') step(dt);
    render(t);
    if (visible && !document.hidden && state !== 'over' && state !== 'idle') rafId = requestAnimationFrame(loop);
  };
  const kick = () => { last = 0; if (!rafId) rafId = requestAnimationFrame(loop); };

  const press = () => {
    if (state === 'over' || state === 'idle' || state === 'demo') {
      if (state !== 'playing') { reset(); state = 'playing'; kick(); }
    }
    jump();
  };

  canvas.addEventListener('pointerdown', (e) => { e.preventDefault(); canvas.focus({ preventScroll: true }); press(); });
  canvas.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') { e.preventDefault(); if (!e.repeat) press(); }
  });
  canvas.addEventListener('blur', () => { if (state === 'playing') { state = 'demo'; reset(); kick(); } });

  reset();
  state = reduce ? 'idle' : 'demo';
  render(0);
  if (!reduce) kick();

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible) kick();
    }).observe(canvas);
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });
})();


// ===== Rock skipping =====
(() => {
  const canvas = document.querySelector('#skip-canvas');
  if (!canvas) return;
  const live = document.querySelector('#skip-live');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = W * dpr; canvas.height = H * dpr;
  ctx.scale(dpr, dpr);
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';

  const C = { ink: '#191526', cream: '#f6e9c4', orange: '#f59a1e', orangeDark: '#d9741a', steel: '#5b6366', eye: '#1b2224', cyan: '#38c8e6', scrap: '#a39b8e' };
  const HORIZON = 120, FEET = 156, SH = { x: 83, y: 104 }, ARM = 26, MAX_SKIPS = 10;
  const MSGS = ['KERPLUNK', 'OOF', 'NOT BAD', 'NICE ONE', 'SMOOTH', 'SOLID', 'SLICK', 'PRO MOVE', 'SO CLOSE', 'LEGEND!'];
  const wy = (x) => Math.max(HORIZON + 14, 176 - Math.max(0, x - 150) * 0.09);
  const easeOut = (t) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
  const easeIn = (t) => Math.pow(Math.min(1, Math.max(0, t)), 2);
  const reduce = prefersReducedMotion;

  let state = 'idle', T0 = 0, flightT0 = 0, sinkT = 0, plan = [], target = 1, skips = 0, best = 0;
  let ripples = [], drops = [], lastSplash = { x: 300, y: 150 }, raf = 0, visible = true;
  try { best = Number(localStorage.getItem('skip-best')) || 0; } catch (e) {}

  // ---- arm / pose ----
  const armAngle = (now) => {
    if (!T0) return 100 + Math.sin(now / 500) * 3;
    const e = now - T0;
    if (e < 260) return 100 + 50 * easeOut(e / 260);
    if (e < 480) return 150 - 162 * easeIn((e - 260) / 220);
    const f = e - 480;
    if (f < 220) return -12 + 22 * easeOut(f / 220);
    if (f < 900) return 10;
    if (f < 1500) return 10 + 90 * easeOut((f - 900) / 600);
    return 100 + Math.sin(now / 500) * 3;
  };
  const pose = (now) => {
    const deg = armAngle(now), a = deg * Math.PI / 180;
    const lean = Math.max(-1.5, (120 - deg) / 160 * 7);
    const bob = (!T0 || now - T0 > 1500) ? Math.sin(now / 600) * 0.8 : 0;
    const sh = { x: SH.x + lean, y: SH.y + bob };
    const hand = { x: sh.x + Math.cos(a) * ARM, y: sh.y + Math.sin(a) * ARM };
    const elbow = { x: sh.x + Math.cos(a) * ARM * 0.48, y: sh.y + Math.sin(a) * ARM * 0.48 };
    return { sh, hand, elbow };
  };

  // ---- throw plan ----
  const makePlan = (n, sx, sy) => {
    const r = 0.82, M = n + 1, total = 130 + 22 * n;
    const L0 = total * (1 - r) / (1 - Math.pow(r, M));
    const arcs = []; let x = sx, t = 0;
    for (let i = 0; i <= n; i++) {
      const L = L0 * Math.pow(r, i), xe = x + L;
      const Hh = i === 0 ? 24 : Math.max(5, 30 * Math.pow(0.72, i - 1));
      const dur = i === 0 ? 380 : 200 + Hh * 8;
      arcs.push({ xs: x, ys: i === 0 ? sy : wy(x), xe, ye: wy(xe), H: Hh, dur, t0: t, fired: false });
      x = xe; t += dur;
    }
    return arcs;
  };
  const rockAt = (tt) => {
    for (const a of plan) {
      if (tt >= a.t0 && tt < a.t0 + a.dur) {
        const u = (tt - a.t0) / a.dur;
        return { x: a.xs + (a.xe - a.xs) * u, y: a.ys + (a.ye - a.ys) * u - 4 * a.H * u * (1 - u) };
      }
    }
    const l = plan[plan.length - 1];
    return { x: l.xe, y: l.ye };
  };

  const addRipple = (x, y, now, big) => {
    ripples.push({ x, y, t0: now, s: Math.min(1.15, Math.max(0.5, (y - HORIZON) / 55)) * (big ? 1.3 : 1) });
    for (let i = 0; i < (big ? 7 : 5); i++) {
      drops.push({ x, y, t0: now, vx: (Math.random() - 0.4) * 0.12, vy: 0.08 + Math.random() * 0.1 });
    }
  };

  const start = (now) => {
    state = 'throwing'; T0 = now; skips = 0; ripples = []; drops = []; plan = [];
    target = 1 + Math.floor(Math.random() * MAX_SKIPS);
    if (live) live.textContent = '';
    kick();
  };

  const update = (now) => {
    if (state === 'throwing' && now - T0 >= 480) {
      const p = pose(T0 + 480);
      plan = makePlan(target, p.hand.x, p.hand.y);
      flightT0 = T0 + 480; state = 'flight';
    }
    if (state === 'flight') {
      const tt = now - flightT0;
      plan.forEach((a, i) => {
        if (!a.fired && tt >= a.t0 + a.dur) {
          a.fired = true;
          if (i < target) { skips++; addRipple(a.xe, a.ye, now); lastSplash = { x: a.xe, y: a.ye }; }
          else { addRipple(a.xe, a.ye, now, true); lastSplash = { x: a.xe, y: a.ye }; state = 'sink'; sinkT = now; }
        }
      });
    }
    if (state === 'sink' && now - sinkT > 450) {
      state = 'done';
      if (skips > best) { best = skips; try { localStorage.setItem('skip-best', String(best)); } catch (e) {} }
      if (live) live.textContent = `${skips} skips. ${MSGS[skips - 1]}`;
    }
  };

  // ---- pen-and-ink helpers: wobbly, hand-drawn line that "boils" a little, like a newspaper cartoon ----
  const FONT = '"Patrick Hand", "Comic Sans MS", "Chalkboard SE", cursive';
  let frame = 0;
  const rnd = (i, s) => { const v = Math.sin(i * 12.9898 + s * 78.233 + frame * 3.71) * 43758.5453; return v - Math.floor(v) - 0.5; };
  const trace = (pts, close, seed, amp, smooth) => {
    const out = [], n = pts.length, segs = close ? n : n - 1;
    for (let i = 0; i < segs; i++) {
      const p = pts[i], q = pts[(i + 1) % n];
      const k = Math.max(1, Math.round(Math.hypot(q[0] - p[0], q[1] - p[1]) / 8));
      for (let j = 0; j < k; j++) {
        const u = j / k, id = i * 7 + j;
        out.push([p[0] + (q[0] - p[0]) * u + rnd(id, seed) * amp * 2, p[1] + (q[1] - p[1]) * u + rnd(id + 99, seed) * amp * 2]);
      }
    }
    if (!close) { const l = pts[n - 1]; out.push([l[0] + rnd(500, seed) * amp, l[1] + rnd(501, seed) * amp]); }
    const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    ctx.beginPath();
    if (smooth && out.length > 2) {
      if (close) {
        const s0 = mid(out[out.length - 1], out[0]);
        ctx.moveTo(s0[0], s0[1]);
        for (let i = 0; i < out.length; i++) { const m = mid(out[i], out[(i + 1) % out.length]); ctx.quadraticCurveTo(out[i][0], out[i][1], m[0], m[1]); }
      } else {
        ctx.moveTo(out[0][0], out[0][1]);
        for (let i = 1; i < out.length - 1; i++) { const m = mid(out[i], out[i + 1]); ctx.quadraticCurveTo(out[i][0], out[i][1], m[0], m[1]); }
        ctx.lineTo(out[out.length - 1][0], out[out.length - 1][1]);
      }
    } else {
      ctx.moveTo(out[0][0], out[0][1]);
      for (let i = 1; i < out.length; i++) ctx.lineTo(out[i][0], out[i][1]);
    }
    if (close) ctx.closePath();
  };
  const ink = (pts, o = {}) => {
    const { close = false, seed = 1, amp = 0.6, smooth = false, fill = null, lw = 2, alpha = 1, color = C.ink, stroke = true } = o;
    trace(pts, close, seed, amp, smooth);
    ctx.globalAlpha = alpha;
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.stroke(); }
    ctx.globalAlpha = 1;
  };
  const oval = (x, y, rx, ry, rot = 0, o = {}) => {
    const n = Math.min(18, Math.max(8, Math.round((rx + ry) * 1.2))), pts = [], c = Math.cos(rot), s = Math.sin(rot);
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2, px = Math.cos(a) * rx, py = Math.sin(a) * ry;
      pts.push([x + px * c - py * s, y + px * s + py * c]);
    }
    ink(pts, { amp: Math.min(0.7, (rx + ry) * 0.06), ...o, close: true, smooth: true });
  };
  const dot = (x, y, r, color) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill(); };
  const limb = (p, q, color, w) => {
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
    ctx.strokeStyle = C.ink; ctx.lineWidth = w + 3; ctx.stroke();
    ctx.strokeStyle = color; ctx.lineWidth = w; ctx.stroke();
  };
  const text = (txt, x, y, size, align = 'left', color = C.ink) => {
    ctx.font = `${size}px ${FONT}`; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'middle';
    ctx.fillText(txt, x, y);
    return ctx.measureText(txt).width;
  };
  const scrap = (x, y, rx, ry, seed, fill = C.scrap) => oval(x, y, rx, ry, 0, { fill, lw: 1.6, seed });

  const drawScene = (now) => {
    // smoggy, dust-choked sky
    const sky = ctx.createLinearGradient(0, 0, 0, HORIZON);
    sky.addColorStop(0, '#9c8e6e'); sky.addColorStop(0.55, '#cdb27c'); sky.addColorStop(1, '#ebcf92');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, HORIZON + 2);
    // dim sun behind the haze
    const glow = ctx.createRadialGradient(402, 50, 6, 402, 50, 85);
    glow.addColorStop(0, 'rgba(255,240,190,.85)'); glow.addColorStop(1, 'rgba(255,230,160,0)');
    ctx.fillStyle = glow; ctx.fillRect(300, 0, 180, HORIZON);
    oval(402, 50, 15, 15, 0, { fill: '#fbe9b4', lw: 1.8, seed: 4, amp: 0.5 });
    // smog banks
    [[120, 34, 1.1], [300, 22, 0.9], [20, 52, 0.8]].forEach(([bx, by, sc], i) => {
      const x = ((bx + now * 0.004 * (i + 1)) % (W + 140)) - 70;
      ink([[-40, 4], [-30, -4], [-8, -6], [14, -7], [36, -3], [44, 4], [10, 7]].map(([px, py]) => [x + px * sc, by + py * sc]), { close: true, smooth: true, fill: 'rgba(168,132,86,.7)', lw: 1.5, seed: 20 + i, amp: 0.4, alpha: 0.9 });
    });
    // ruined towers poking out of the haze
    [[16, 16, 38, -3], [40, 12, 54, 2], [58, 18, 30, 0], [108, 14, 46, -2], [128, 20, 62, 3], [158, 16, 34, 0], [230, 18, 50, -2], [260, 14, 68, 2], [288, 20, 36, 0], [336, 16, 56, -3], [362, 22, 40, 1], [436, 14, 62, 2], [456, 18, 36, -1]]
      .forEach(([x, w, h, lean], i) => {
        ink([[x, 118], [x + lean, 118 - h], [x + w / 2 + lean, 118 - h + 5 + (i % 3) * 2], [x + w + lean, 118 - h - 2], [x + w, 118]], { close: true, fill: i % 2 ? '#8e7b5c' : '#7f6d52', lw: 1.5, seed: 200 + i, amp: 0.4 });
        for (let k = 1; k < 4; k++) ink([[x + 3, 118 - h * k / 4], [x + w - 3, 118 - h * k / 4 - 1]], { lw: 1, alpha: 0.35, seed: 220 + i + k, amp: 0.2 });
      });
    // heaps of garbage along the far shore
    const heap = [[-4, HORIZON + 1], [-4, 108]];
    for (let x = 0; x <= W + 8; x += 12) heap.push([x, 110 - ((x * 13) % 9) - (Math.sin(x / 47) + 1) * 6]);
    heap.push([W + 4, HORIZON + 1]);
    ink(heap, { fill: '#6e5842', lw: 1.8, seed: 31, amp: 0.7 });
    for (let i = 0; i < 26; i++) { const x = 8 + ((i * 83) % 460), y = 112 + ((i * 7) % 6); ink([[x, y], [x + 3 + (i % 3) * 2, y - 1]], { lw: 1.2, seed: 240 + i, amp: 0.2, alpha: 0.5 }); }
    // dust specks drifting past
    for (let i = 0; i < 16; i++) dot((i * 131 + now * 0.012 * (1 + (i % 3))) % W, 14 + ((i * 37) % 84) + Math.sin(now / 900 + i) * 2, 1, 'rgba(250,236,200,.55)');
    // filthy lake
    const lake = ctx.createLinearGradient(0, HORIZON, 0, H);
    lake.addColorStop(0, '#7d8a5c'); lake.addColorStop(1, '#3e4d44');
    ctx.fillStyle = lake; ctx.fillRect(0, HORIZON, W, H - HORIZON);
    ink([[0, HORIZON], [W, HORIZON]], { seed: 33, amp: 0.8, lw: 2.2 });
    // oily sheen and sun glint
    [[60, 128, 70], [250, 140, 90], [340, 176, 80], [170, 206, 60]].forEach(([x, y, w], i) => ink([[x, y], [x + w, y + 1]], { lw: 3, seed: 260 + i, amp: 0.6, color: '#a6a55b', alpha: 0.35, smooth: true }));
    [30, 22, 14, 8].forEach((w, i) => ink([[402 - w / 2, 131 + i * 9], [402 + w / 2, 131 + i * 9]], { lw: 1.7, seed: 40 + i, amp: 0.4, alpha: 0.6, color: '#fbe9b4' }));
    for (let i = 0; i < 12; i++) {
      const ph = now / 1000 + i, py = 134 + ((i * 53) % 84), px = ((i * 97) % 420) + 40 + Math.sin(ph) * 5;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.quadraticCurveTo(px + 5, py - 2.5, px + 10, py); ctx.quadraticCurveTo(px + 15, py + 2.5, px + 20, py);
      ctx.globalAlpha = 0.25 + 0.15 * Math.sin(ph * 1.3); ctx.strokeStyle = C.cream; ctx.lineWidth = 1.4; ctx.stroke(); ctx.globalAlpha = 1;
    }
    // floating junk: a tyre and a plank
    const bob = Math.sin(now / 700) * 1.2;
    oval(352, 146 + bob, 9, 3.2, 0, { fill: '#2d2a28', lw: 1.5, seed: 270 }); oval(352, 145.5 + bob, 4, 1.3, 0, { fill: '#52614d', lw: 1, seed: 271 });
    ink([[212, 140 - bob], [236, 138 - bob], [237, 141 - bob], [213, 143 - bob]], { close: true, fill: '#9a7048', lw: 1.5, seed: 272, amp: 0.3 });
  };

  const drawRipples = (now) => {
    ripples = ripples.filter((r) => now - r.t0 < 1100);
    ripples.forEach((r) => {
      [0, 0.16].forEach((off, k) => {
        const a = (now - r.t0) / 1100 - off;
        if (a <= 0) return;
        const rx = (6 + 30 * a) * r.s;
        oval(r.x, r.y, rx, rx * 0.28, 0, { lw: 1.8, alpha: Math.max(0, 1 - a), seed: 50 + k, amp: 0.5, color: C.cream });
      });
      const age = (now - r.t0) / 320;
      if (age < 1) [-155, -115, -75, -35].forEach((deg, k) => {
        const an = deg * Math.PI / 180, d0 = 5 + age * 9 * r.s, d1 = d0 + 4;
        ink([[r.x + Math.cos(an) * d0 * 1.4, r.y + Math.sin(an) * d0], [r.x + Math.cos(an) * d1 * 1.4, r.y + Math.sin(an) * d1]], { lw: 1.7, alpha: 1 - age, seed: 60 + k, amp: 0.2, color: C.cream });
      });
    });
    drops = drops.filter((d) => now - d.t0 < 560);
    drops.forEach((d) => {
      const a = now - d.t0;
      ctx.globalAlpha = 1 - a / 560;
      ctx.beginPath(); ctx.arc(d.x + d.vx * a, d.y - d.vy * a + 0.00025 * a * a, 1.4, 0, Math.PI * 2);
      ctx.strokeStyle = C.cream; ctx.lineWidth = 1.3; ctx.stroke();
    });
    ctx.globalAlpha = 1;
  };

  const drawBank = () => {
    const g = ctx.createLinearGradient(0, 150, 0, H);
    g.addColorStop(0, '#b98550'); g.addColorStop(1, '#85583a');
    ink([[-4, H + 4], [-4, 152], [50, 150], [100, 158], [135, 166], [150, 180], [162, 198], [132, H + 4]], { fill: g, smooth: true, lw: 2.4, seed: 70, amp: 0.9 });
    // scrap and rubble
    [[30, 182, 5, 3, '#a39b8e'], [72, 196, 6, 3.5, '#8d8579'], [52, 214, 4, 2.5, '#a39b8e'], [96, 178, 3.5, 2, '#8d8579'], [18, 200, 3, 2, '#a39b8e'], [126, 188, 3, 2, '#8d8579'], [88, 220, 4, 2.5, '#a39b8e']].forEach((p, i) => scrap(p[0], p[1], p[2], p[3], 80 + i, p[4]));
    // squashed cube, rusty can, half-buried tyre
    ink([[100, 208], [112, 204], [117, 213], [105, 217]], { close: true, fill: '#8d9aa0', lw: 1.6, seed: 280, amp: 0.3 });
    ink([[104, 209], [110, 207]], { lw: 1.1, seed: 281, amp: 0.2, alpha: 0.6 });
    ink([[34, 196], [44, 196], [44, 207], [34, 207]], { close: true, fill: '#c25a3c', lw: 1.6, seed: 282, amp: 0.3 });
    oval(39, 196, 5, 1.7, 0, { fill: '#d9855f', lw: 1.3, seed: 283 });
    oval(14, 214, 11, 5, -0.3, { fill: '#2d2a28', lw: 1.6, seed: 284 }); oval(14, 214, 5, 2, -0.3, { fill: '#6e4b32', lw: 1.1, seed: 285 });
    // specks and rusty wire
    [[40, 168], [64, 176], [84, 168], [110, 190], [74, 208], [120, 214], [10, 186]].forEach(([x, y]) => dot(x, y, 1, '#3c2a1e'));
    ink([[116, 172], [123, 166], [128, 168], [131, 163]], { lw: 1.3, seed: 286, amp: 0.3, color: '#4a3526' });
    // the one little green sprout
    ink([[56, 168], [56, 160]], { lw: 1.6, seed: 287, amp: 0.15, color: '#2f6b2a' });
    oval(52.5, 159, 3.6, 1.8, -0.5, { fill: '#7ed957', lw: 1.2, seed: 288 }); oval(59.5, 158, 3.6, 1.8, 0.5, { fill: '#7ed957', lw: 1.2, seed: 289 });
  };

  const drawRock = (x, y, ang) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
    ctx.beginPath(); ctx.ellipse(0, 0, 4.6, 2.6, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#a39b8e'; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.7; ctx.stroke();
    ctx.restore();
  };

  const drawPerson = (now) => {
    const { sh, hand, elbow } = pose(now);
    const cx = sh.x - 11, top = sh.y;
    const hasRock = state === 'idle' || state === 'throwing' || (state === 'done' && now - T0 > 1500);
    // shadow
    oval(cx, FEET + 3, 21, 3.5, 0, { fill: 'rgba(25,21,38,.28)', stroke: false });
    // back arm
    limb({ x: cx - 12, y: top + 5 }, { x: cx - 15, y: top + 21 }, C.orange, 4.5);
    oval(cx - 15, top + 23, 3.2, 3.2, 0, { fill: C.steel, lw: 1.6, seed: 300 });
    // legs: steel joints and boots
    [cx - 7, cx + 7].forEach((lx, i) => {
      limb({ x: lx, y: 130 }, { x: lx, y: 147 }, C.steel, 4.5);
      ink([[lx - 7, 147], [lx + 6, 147], [lx + 9, FEET + 1], [lx - 9, FEET + 1]], { close: true, fill: C.orange, lw: 2, seed: 301 + i, amp: 0.4 });
      ink([[lx - 8, FEET - 1], [lx + 8, FEET - 1]], { lw: 2.4, seed: 303 + i, amp: 0.2, color: C.steel });
    });
    // body
    ink([[cx - 12, top - 1], [cx + 12, top - 1], [cx + 10, 132], [cx - 10, 132]], { close: true, fill: C.orange, lw: 2.2, seed: 305, amp: 0.5 });
    ink([[cx + 7, top + 2], [cx + 10, 130]], { lw: 3, seed: 306, amp: 0.3, color: C.orangeDark, alpha: 0.7 });
    oval(cx + 3, top + 15, 4.8, 4.8, 0, { fill: C.steel, lw: 1.6, seed: 307 });
    oval(cx + 3, top + 15, 3, 3, 0, { fill: C.cyan, stroke: false }); dot(cx + 4, top + 13.6, 1, '#fff');
    [[cx - 8, top + 24], [cx - 6, top + 8], [cx + 7, top + 25]].forEach(([x, y]) => dot(x, y, 0.8, '#3c2a1e'));
    // neck + head
    ink([[cx - 6, top - 6], [cx + 6, top - 6], [cx + 6, top], [cx - 6, top]], { close: true, fill: C.steel, lw: 1.6, seed: 308, amp: 0.2 });
    ink([[cx - 14, top - 27], [cx - 16, top - 38]], { lw: 1.6, seed: 309, amp: 0.2 });
    ink([[cx - 17, top - 27], [cx + 15, top - 30], [cx + 17, top - 5], [cx - 16, top - 4]], { close: true, fill: C.orange, lw: 2.2, seed: 310, amp: 0.5 });
    ink([[cx - 16, top - 7.5], [cx + 17, top - 8.5], [cx + 17, top - 5], [cx - 16, top - 4]], { close: true, fill: C.orangeDark, stroke: false });
    ink([[cx - 13, top - 25], [cx + 6, top - 27]], { lw: 3, seed: 311, amp: 0.3, color: '#f9cf74', alpha: 0.8 });
    [[-6, -17], [8, -17]].forEach(([dx, dy], i) => {
      const ex = cx + dx + 1, ey = top + dy;
      oval(ex, ey, 6, 7, 0, { fill: C.eye, lw: 1.6, seed: 312 + i });
      oval(ex + 1, ey + 1.5, 3.6, 4.4, 0, { fill: C.cyan, stroke: false });
      dot(ex + 2.4, ey - 2.6, 1.8, '#fff');
    });
    ctx.beginPath(); ctx.arc(cx + 2, top - 10.5, 3, 0.2 * Math.PI, 0.8 * Math.PI); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.4; ctx.stroke();
    [[cx - 14, top - 24], [cx + 13, top - 26], [cx + 14, top - 8]].forEach(([x, y]) => dot(x, y, 1, C.ink));
    // throwing arm
    limb(sh, elbow, C.orange, 5);
    limb(elbow, hand, C.orange, 4.5);
    dot(sh.x, sh.y, 3.2, C.steel); dot(elbow.x, elbow.y, 2.2, C.steel);
    oval(hand.x, hand.y, 3.4, 3.4, 0, { fill: C.steel, lw: 1.6, seed: 320 });
    if (hasRock) drawRock(hand.x + 2, hand.y - 1, -0.2);
  };

  const bubble = (cx, cy, rx, ry, tipX, tipY, seed) => {
    oval(cx, cy, rx, ry, 0, { fill: C.cream, lw: 2, seed, amp: 0.8 });
    const bx = cx + Math.max(-rx * 0.4, Math.min(rx * 0.4, (tipX - cx) * 0.5)), by = cy + ry;
    trace([[bx - 6, by - 2], [tipX, tipY], [bx + 7, by - 2]], true, seed, 0.2, false);
    ctx.fillStyle = C.cream; ctx.fill();
    ink([[bx - 6, by - 1], [tipX, tipY], [bx + 7, by - 1]], { lw: 2, seed: seed + 1, amp: 0.3 });
  };

  const drawHud = (now) => {
    const shown = state === 'done' || state === 'sink' || state === 'flight' ? skips : 0;
    text(`skips: ${shown}    best: ${best}`, 12, 16, 17);
    if (state === 'idle') {
      const hint = reduce ? 'press space or click to throw' : 'click or press space to throw';
      const w = text(hint, W / 2 + 40, H - 20, 16, 'center', C.cream);
      ink([[W / 2 + 40 - w / 2, H - 9], [W / 2 + 40 + w / 2, H - 10]], { lw: 1.4, seed: 140, amp: 0.8, smooth: true, color: C.cream });
    }
    if (state === 'done') {
      text('space to throw again', W / 2 + 40, H - 16, 16, 'center', C.cream);
      const bx = Math.min(W - 64, Math.max(64, lastSplash.x)), by = Math.max(30, lastSplash.y - 50);
      bubble(bx, by, 58, 24, lastSplash.x, lastSplash.y - 8, 150);
      text(`${skips} skip${skips > 1 ? 's' : ''}!`, bx, by - 6, 19, 'center');
      text(MSGS[skips - 1].toLowerCase(), bx, by + 9, 14, 'center');
    }
  };

  const render = (now) => {
    frame = reduce ? 0 : Math.floor(now / 170) % 3;
    ctx.clearRect(0, 0, W, H);
    drawScene(now);
    drawRipples(now);
    drawBank();
    drawPerson(now);
    if (state === 'flight') {
      const tt = now - flightT0, p = rockAt(tt);
      [-2.5, 2.5].forEach((dy, i) => {
        const a = rockAt(Math.max(0, tt - 70 + i * 12)), b = rockAt(Math.max(0, tt - 22));
        if (tt > 40) ink([[a.x, a.y + dy], [b.x, b.y + dy]], { lw: 1.4, seed: 160 + i, amp: 0.3, color: C.cream });
      });
      drawRock(p.x, p.y, tt * 0.025);
    }
    if (state === 'sink') {
      const k = (now - sinkT) / 450, l = plan[plan.length - 1];
      ctx.globalAlpha = 1 - k; drawRock(l.xe, l.ye + 12 * k, 0); ctx.globalAlpha = 1;
    }
    drawHud(now);
  };

  const busy = (now) => state === 'throwing' || state === 'flight' || state === 'sink' || (state === 'done' && now - T0 < 1600);
  const loop = (now) => {
    raf = 0;
    update(now); render(now);
    if (visible && !document.hidden && (!reduce || busy(now))) raf = requestAnimationFrame(loop);
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };

  const press = () => { if (state === 'idle' || state === 'done') start(performance.now()); };
  canvas.addEventListener('pointerdown', (e) => { e.preventDefault(); canvas.focus({ preventScroll: true }); press(); });
  canvas.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'Enter' || e.code === 'ArrowRight') { e.preventDefault(); if (!e.repeat) press(); }
  });

  render(performance.now());
  if (!reduce) kick();
  if (document.fonts && document.fonts.load) document.fonts.load('16px "Patrick Hand"').then(kick).catch(() => {});
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; if (visible) kick(); }).observe(canvas);
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });
})();


// ===== Stick figure writing the photo credit =====
(() => {
  const canvas = document.querySelector('#writer-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const INK = '#191526', YELLOW = '#ffe93a';
  const reduce = prefersReducedMotion;
  const mq = window.matchMedia('(max-width: 700px)');
  const GAP = 24, TY = 17, WRITE_MS = 2800, PAUSE = 240;
  let lines = [], W = 240, H = 74, X0 = 8, size = 21, slideDist = 24, total = 1, t0 = 0, raf = 0, visible = false;

  const layout = () => {
    const stacked = mq.matches;
    size = stacked ? 18 : 21;
    ctx.font = `600 ${size}px "Patrick Hand", "Comic Sans MS", cursive`;
    const parts = stacked ? ['Photo', 'taken by', 'Anjola'] : ['Photo taken by Anjola'];
    X0 = stacked ? 18 : 8; slideDist = stacked ? 12 : 24;
    lines = parts.map((txt, i) => ({ txt, y: TY + i * GAP, w: ctx.measureText(txt).width }));
    const widest = Math.max(...lines.map((l) => l.w));
    W = Math.ceil(X0 + widest + (stacked ? 26 : 34));
    H = stacked ? TY + GAP * 2 + 57 : 74;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.font = `600 ${size}px "Patrick Hand", "Comic Sans MS", cursive`;
    total = WRITE_MS + PAUSE * (lines.length - 1);
  };

  const line = (pts, w = 2.2) => {
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.strokeStyle = INK; ctx.lineWidth = w; ctx.stroke();
  };
  const dot = (x, y, r) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = INK; ctx.fill(); };

  // where is the pen at time e? which lines are fully written, and how much of the current one?
  const pen = (e) => {
    const sumW = lines.reduce((a, l) => a + l.w, 0);
    let t = e;
    for (let i = 0; i < lines.length; i++) {
      const L = lines[i], dur = WRITE_MS * L.w / sumW;
      if (t < dur) return { cur: i, frac: t / dur, x: X0 + L.w * t / dur, y: L.y, moving: true, done: false };
      t -= dur;
      if (i < lines.length - 1) {
        if (t < PAUSE) {
          const u = t / PAUSE, s = u * u * (3 - 2 * u), N = lines[i + 1];
          return { cur: i, frac: 1, x: X0 + L.w + (X0 - X0 - L.w) * s, y: L.y + (N.y - L.y) * s, moving: true, done: false };
        }
        t -= PAUSE;
      }
    }
    const last = lines[lines.length - 1];
    return { cur: lines.length - 1, frac: 1, x: X0 + last.w, y: last.y, moving: false, done: true };
  };

  const draw = (now) => {
    const e = reduce ? total + 2000 : now - t0;
    const p = pen(Math.min(e, total));
    const done = p.done && e >= total;
    ctx.clearRect(0, 0, W, H);

    lines.forEach((L, i) => {
      const cw = i < p.cur ? L.w + 2 : i === p.cur ? L.w * p.frac + 1 : 0;
      if (cw <= 0) return;
      ctx.save(); ctx.beginPath(); ctx.rect(X0 - 2, L.y - 16, cw + 2, 32); ctx.clip();
      ctx.font = `600 ${size}px "Patrick Hand", "Comic Sans MS", cursive`;
      ctx.fillStyle = INK; ctx.textBaseline = 'middle'; ctx.fillText(L.txt, X0, L.y);
      ctx.restore();
    });

    // figure: walks along under the pen while writing, then waves
    const slide = done ? Math.min(1, (e - total) / 500) : 0;
    const bx = p.x - 11 + slide * slideDist, oy = p.y - TY;
    const walking = !done && !reduce, ph = e / 110;
    const hip = [bx, 54 + oy], sh = [bx, 44 + oy], FY = 70 + oy;
    const sw = walking ? Math.sin(ph) * 5 : 0;
    line([hip, [bx - 3 + sw, 62 + oy], [bx - 4 + sw * 1.4, FY]]);
    line([hip, [bx + 3 - sw, 62 + oy], [bx + 4 - sw * 1.4, FY]]);
    line([sh, hip]);
    line([[bx, 45 + oy], [bx - 6, 50 + oy], [bx - 8, 55 + oy + (walking ? Math.sin(ph + 1) * 2 : 0)]]);
    const hy = 37 + oy - (walking ? Math.abs(Math.sin(ph)) : 0);
    ctx.beginPath(); ctx.arc(bx + 1, hy, 5.2, 0, Math.PI * 2); ctx.fillStyle = YELLOW; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.stroke();
    dot(bx + 3, hy - 0.5, 0.9); dot(bx + 5.5, hy - 0.5, 0.9);
    ctx.beginPath(); ctx.arc(bx + 4.3, hy + 1.8, 1.8, 0.2, Math.PI - 0.2); ctx.lineWidth = 1.1; ctx.stroke();
    if (!done) {
      const wob = Math.sin(e / 55) * 1.6, hand = [p.x - 1, p.y + 8 + wob];
      line([[bx, 45 + oy], [(bx + hand[0]) / 2 - 3, (45 + oy + hand[1]) / 2 + 2], hand]);
      line([hand, [hand[0] + 4, hand[1] - 6]], 1.8);
    } else {
      const wv = Math.sin(e / 160) * 4;
      line([[bx, 45 + oy], [bx + 8, 44 + oy], [bx + 11 + wv * 0.4, 34 + oy + wv * 0.5]]);
    }
  };

  const loop = (now) => {
    raf = 0; draw(now);
    if (visible && !document.hidden && !reduce && now - t0 < total + 4000) raf = requestAnimationFrame(loop);
  };
  const play = () => { t0 = performance.now(); if (!raf) raf = requestAnimationFrame(loop); };
  const relayout = () => { layout(); if (reduce || !visible) draw(0); else play(); };

  layout(); draw(0);
  if (document.fonts && document.fonts.load) document.fonts.load('21px "Patrick Hand"').then(relayout).catch(() => {});
  if (mq.addEventListener) mq.addEventListener('change', relayout);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      const was = visible; visible = entries[0].isIntersecting;
      if (visible && !was) { if (reduce) draw(0); else play(); }
    }).observe(canvas);
  } else { visible = true; play(); }
  canvas.addEventListener('pointerenter', () => { if (!reduce && visible && performance.now() - t0 > total + 600) play(); });
  canvas.addEventListener('pointerdown', () => { if (!reduce && visible && performance.now() - t0 > total + 600) play(); });
})();
