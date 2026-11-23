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

  const C = { ink: '#191526', paper: '#f7f2e8', yellow: '#ffe93a', coral: '#f65456', aqua: '#03aae6', blue: '#323cfb',
    lav: '#b9a3f7', sage: '#93bb9a', lime: '#c7e86b', teal: '#1f7a6d', navy: '#29204b', skin: '#c98b5e', pine: '#3f7a52', rock: '#6b6475' };
  const HORIZON = 120, FEET = 156, SH = { x: 72, y: 104 }, ARM = 26, MAX_SKIPS = 10;
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

  // ---- drawing helpers ----
  const limb = (p, q, color, w) => {
    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
    ctx.strokeStyle = C.ink; ctx.lineWidth = w + 3.5; ctx.stroke();
    ctx.strokeStyle = color; ctx.lineWidth = w; ctx.stroke();
  };
  const tree = (x, y, h) => {
    ctx.fillStyle = C.pine; ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5;
    for (let i = 0; i < 3; i++) {
      const w = h * (0.34 - i * 0.07), ty = y - h + i * h * 0.28;
      ctx.beginPath(); ctx.moveTo(x, ty); ctx.lineTo(x + w, ty + h * 0.4); ctx.lineTo(x - w, ty + h * 0.4); ctx.closePath(); ctx.fill(); ctx.stroke();
    }
  };
  const pebble = (x, y, rx, ry) => {
    ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = C.paper; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5; ctx.stroke();
  };
  const pill = (txt, cx, cy, size = 9) => {
    ctx.font = `700 ${size}px "DM Sans", sans-serif`;
    const w = ctx.measureText(txt).width + 18, h = size + 12;
    ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, h / 2);
    ctx.fillStyle = C.paper; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, cx, cy + 0.5);
  };

  const drawScene = (now) => {
    // sky
    const sky = ctx.createLinearGradient(0, 0, 0, HORIZON);
    sky.addColorStop(0, '#f7f2e8'); sky.addColorStop(1, '#f9cdbd');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, HORIZON + 2);
    const glow = ctx.createRadialGradient(400, 52, 4, 400, 52, 70);
    glow.addColorStop(0, 'rgba(255,233,58,.65)'); glow.addColorStop(1, 'rgba(246,84,86,0)');
    ctx.fillStyle = glow; ctx.fillRect(320, 0, 160, HORIZON);
    ctx.beginPath(); ctx.arc(400, 52, 20, 0, Math.PI * 2); ctx.fillStyle = C.yellow; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.stroke();
    // clouds
    [[150, 38, 1], [300, 26, 0.8], [40, 24, 0.7]].forEach(([bx, by, sc], i) => {
      const x = ((bx + now * 0.004 * (i + 1)) % (W + 100)) - 50;
      ctx.fillStyle = C.paper; ctx.strokeStyle = C.ink; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(x, by, 46 * sc, 12 * sc, 6 * sc); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.roundRect(x + 10 * sc, by - 7 * sc, 24 * sc, 12 * sc, 6 * sc); ctx.fill(); ctx.stroke();
      ctx.fillRect(x + 12 * sc, by + 1, 20 * sc, 8 * sc);
    });
    // mountains
    ctx.beginPath(); ctx.moveTo(0, HORIZON);
    [[0, 104], [70, 84], [150, 110], [240, 78], [330, 108], [420, 82], [480, 100], [480, HORIZON]].forEach(([x, y]) => ctx.lineTo(x, y));
    ctx.closePath(); ctx.fillStyle = C.lav; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.stroke();
    // far shore
    ctx.beginPath(); ctx.moveTo(0, HORIZON); ctx.lineTo(0, 114);
    ctx.quadraticCurveTo(120, 106, 240, 112); ctx.quadraticCurveTo(360, 106, W, 112); ctx.lineTo(W, HORIZON); ctx.closePath();
    ctx.fillStyle = C.sage; ctx.fill(); ctx.stroke();
    [196, 214, 232, 262, 300, 338, 372, 408, 436, 456].forEach((x, i) => tree(x, 116, 16 + (i % 3) * 4));
    // lake
    const lake = ctx.createLinearGradient(0, HORIZON, 0, H);
    lake.addColorStop(0, C.aqua); lake.addColorStop(1, C.blue);
    ctx.fillStyle = lake; ctx.fillRect(0, HORIZON, W, H - HORIZON);
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(0, HORIZON); ctx.lineTo(W, HORIZON); ctx.stroke();
    // sun reflection
    ctx.fillStyle = 'rgba(255,233,58,.7)';
    for (let i = 0; i < 5; i++) ctx.fillRect(400 - (22 - i * 3), 128 + i * 9, (44 - i * 6), 2.5);
    // shimmer
    ctx.lineWidth = 2; ctx.lineCap = 'round';
    for (let i = 0; i < 18; i++) {
      const ph = now / 900 + i, py = 130 + ((i * 53) % 92), px = ((i * 97) % 450) + 20 + Math.sin(ph) * 6;
      ctx.strokeStyle = `rgba(247,242,232,${0.22 + 0.18 * Math.sin(ph * 1.3)})`;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + 10 + (i % 4) * 5, py); ctx.stroke();
    }
  };

  const drawRipples = (now) => {
    ripples = ripples.filter((r) => now - r.t0 < 1100);
    ripples.forEach((r) => {
      [0, 0.16].forEach((off) => {
        const a = (now - r.t0) / 1100 - off;
        if (a <= 0) return;
        const rx = (6 + 30 * a) * r.s;
        ctx.beginPath(); ctx.ellipse(r.x, r.y, rx, rx * 0.28, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(247,242,232,${Math.max(0, 0.95 - a)})`; ctx.lineWidth = 2; ctx.stroke();
      });
    });
    drops = drops.filter((d) => now - d.t0 < 560);
    ctx.fillStyle = C.paper;
    drops.forEach((d) => {
      const a = now - d.t0;
      ctx.globalAlpha = 1 - a / 560;
      ctx.beginPath(); ctx.arc(d.x + d.vx * a, d.y - d.vy * a + 0.00025 * a * a, 1.7, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
  };

  const drawBank = () => {
    ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(0, 152);
    ctx.quadraticCurveTo(50, 150, 100, 158); ctx.quadraticCurveTo(135, 166, 150, 180); ctx.quadraticCurveTo(162, 198, 132, H); ctx.closePath();
    const g = ctx.createLinearGradient(0, 150, 0, H);
    g.addColorStop(0, C.lime); g.addColorStop(1, C.sage);
    ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.stroke();
    [[30, 182, 5, 3], [72, 196, 6, 3.5], [112, 204, 5, 3], [52, 214, 4, 2.5], [96, 178, 3.5, 2], [18, 200, 3, 2], [126, 188, 3, 2], [88, 220, 4, 2.5]].forEach((p) => pebble(...p));
  };

  const drawRock = (x, y, ang, alpha = 1) => {
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); ctx.rotate(ang);
    ctx.beginPath(); ctx.ellipse(0, 0, 5, 2.8, 0, 0, Math.PI * 2);
    ctx.fillStyle = C.rock; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.8; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(-1.2, -0.8, 1.8, 0.8, 0, 0, Math.PI * 2); ctx.fillStyle = 'rgba(247,242,232,.55)'; ctx.fill();
    ctx.restore();
  };

  const drawPerson = (now) => {
    const { sh, hand, elbow } = pose(now);
    const hip = { x: 72, y: 130 };
    const hasRock = state === 'idle' || state === 'throwing' || (state === 'done' && now - T0 > 1500);
    // back arm
    limb({ x: sh.x - 4, y: sh.y + 3 }, { x: sh.x - 7, y: sh.y + 22 }, C.teal, 5.5);
    // legs + shoes
    limb(hip, { x: 77, y: FEET - 2 }, C.navy, 6.5);
    limb(hip, { x: 64, y: FEET - 2 }, C.navy, 6.5);
    [[80, FEET], [63, FEET]].forEach(([x, y]) => {
      ctx.beginPath(); ctx.ellipse(x, y, 6.5, 3.2, 0, 0, Math.PI * 2); ctx.fillStyle = C.coral; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.stroke();
    });
    // torso
    ctx.beginPath(); ctx.moveTo(sh.x - 9, sh.y); ctx.lineTo(sh.x + 9, sh.y); ctx.lineTo(80, 133); ctx.lineTo(64, 133); ctx.closePath();
    ctx.fillStyle = C.teal; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.stroke();
    // head
    const hx = sh.x + 1.5, hy = sh.y - 14;
    ctx.fillStyle = C.ink;
    for (let i = 0; i < 7; i++) { const t = Math.PI * (1.0 + i / 6 * 1.1) - 0.05; ctx.beginPath(); ctx.arc(hx + Math.cos(t) * 8.5, hy - 1 + Math.sin(t) * 8, 4.6, 0, Math.PI * 2); ctx.fill(); }
    ctx.beginPath(); ctx.arc(hx, hy, 9, 0, Math.PI * 2); ctx.fillStyle = C.skin; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = C.ink;
    for (let i = 0; i < 6; i++) { const t = Math.PI * (1.05 + i / 5 * 0.9); ctx.beginPath(); ctx.arc(hx + Math.cos(t) * 8, hy - 2 + Math.sin(t) * 6.5, 3.6, 0, Math.PI * 2); ctx.fill(); }
    ctx.strokeStyle = C.ink; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(hx + 1.5, hy + 0.5, 2.8, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(hx + 7, hy + 0.5, 2.8, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(hx + 5, hy + 3, 3.4, 0.2, Math.PI - 0.2); ctx.stroke();
    // throwing arm
    limb(sh, elbow, C.teal, 6);
    limb(elbow, hand, C.skin, 5);
    if (hasRock) drawRock(hand.x + 2, hand.y - 1, -0.2);
  };

  const drawHud = (now) => {
    const shown = state === 'done' || state === 'sink' || state === 'flight' ? skips : 0;
    const txt = `SKIPS ${String(shown).padStart(2, '0')}   BEST ${String(best).padStart(2, '0')}`;
    ctx.font = '700 9px "DM Sans", sans-serif';
    const w = ctx.measureText(txt).width + 18;
    ctx.beginPath(); ctx.roundRect(10, 10, w, 20, 10); ctx.fillStyle = C.paper; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = C.ink; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 19, 20.5);
    if (state === 'idle') pill(reduce ? 'PRESS SPACE OR CLICK TO THROW' : 'CLICK OR PRESS SPACE TO THROW', W / 2 + 40, H - 18);
    if (state === 'done') {
      pill('SPACE TO THROW AGAIN', W / 2 + 40, H - 18);
      const bx = Math.min(W - 70, Math.max(70, lastSplash.x)), by = lastSplash.y - 48;
      ctx.beginPath(); ctx.roundRect(bx - 56, by - 18, 112, 36, 12);
      ctx.moveTo(bx - 6, by + 17); ctx.lineTo(lastSplash.x, lastSplash.y - 8); ctx.lineTo(bx + 8, by + 17);
      ctx.fillStyle = C.yellow; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = '800 12px "Syne", sans-serif'; ctx.fillText(`${skips} SKIP${skips > 1 ? 'S' : ''}`, bx, by - 5);
      ctx.font = '700 9px "DM Sans", sans-serif'; ctx.fillText(MSGS[skips - 1], bx, by + 9);
    }
  };

  const render = (now) => {
    ctx.clearRect(0, 0, W, H);
    drawScene(now);
    drawRipples(now);
    drawBank();
    drawPerson(now);
    if (state === 'flight') {
      const tt = now - flightT0;
      [60, 40, 20].forEach((lag, i) => { const q = rockAt(Math.max(0, tt - lag)); drawRock(q.x, q.y, 0, 0.18 + i * 0.1); });
      const p = rockAt(tt); drawRock(p.x, p.y, tt * 0.025);
    }
    if (state === 'sink') {
      const k = (now - sinkT) / 450, l = plan[plan.length - 1];
      drawRock(l.xe, l.ye + 12 * k, 0, 1 - k);
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
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; if (visible) kick(); }).observe(canvas);
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });
})();
