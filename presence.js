/*  ═══════════════════════════════════════════════════════════════
    PRESENCE ENGINE — Competition Edition
    
    Conceptual Layer: "Digital Identity as Energy"
    Every system below models energy: ambient fields drift like 
    potential energy, pointer tracking is kinetic transfer, aura 
    intensity is emotional charge, and idle decay is entropy.
    ═══════════════════════════════════════════════════════════════ */
(() => {
  'use strict';

  // ── ENERGY CONSTANTS ──
  // Tuned for subtlety. Every value serves the theme.
  const E = {
    magneticRange: 110,       // energy field detection radius (px)
    magneticStrength: 2.5,    // max pull force (px)
    presenceRadius: 180,      // awareness field around profile (px)
    particleCount: 24,        // ambient energy motes
    greetDelay: 2400,         // ms — let the page breathe first
    greetDuration: 5000,      // ms — whisper, don't shout
    idleTimeout: 3500,        // ms before energy decays
    identityDuration: 1800,   // ms — identity surge on profile click
    decayRate: 0.01,          // energy dissipation per frame
    chargeRate: 0.06,         // energy absorption per interaction
  };

  // ── DOM REFS ──
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);
  const root = document.documentElement;
  const body = document.body;
  const card = $('#card');
  const profile = $('#profile');
  const bio = $('#bio');
  const aura = $('#aura');
  const greetEl = $('#greeting');
  const links = $$('.link-btn');

  // ── STATE ──
  let pointerX = innerWidth / 2;
  let pointerY = innerHeight / 2;
  let energy = 0;            // 0 = dormant, 1 = fully charged
  let isIdle = true;
  let hasInteracted = false;
  let greetingShown = false;
  let identityBurst = false;
  let idleTimer = null;

  // ════════════════════════════════════════════
  //  1. ATMOSPHERIC ENERGY — Time-based palette
  // ════════════════════════════════════════════
  // The energy field shifts color with the day cycle,
  // mirroring natural light as a metaphor for digital presence.

  function setAtmosphere() {
    const h = new Date().getHours();
    let h1, h2, h3, bright;

    if (h >= 6 && h < 12) {
      // Dawn — cool clarity
      h1 = 215; h2 = 235; h3 = 190; bright = 1.05;
    } else if (h >= 12 && h < 17) {
      // Midday — balanced energy
      h1 = 235; h2 = 258; h3 = 195; bright = 1;
    } else if (h >= 17 && h < 21) {
      // Dusk — warm resonance
      h1 = 255; h2 = 275; h3 = 25; bright = 0.92;
    } else {
      // Night — deep focus
      h1 = 242; h2 = 268; h3 = 200; bright = 0.8;
    }

    root.style.setProperty('--h1', h1);
    root.style.setProperty('--h2', h2);
    root.style.setProperty('--h3', h3);
    root.style.setProperty('--bright', bright);
  }

  setAtmosphere();
  setInterval(setAtmosphere, 600000); // re-evaluate every 10 min

  // ════════════════════════════════════════════
  //  2. POINTER ENERGY — Kinetic tracking
  // ════════════════════════════════════════════
  // The pointer is the primary energy source.
  // Movement charges the system; stillness lets it decay.

  function onPointerMove(x, y) {
    pointerX = x;
    pointerY = y;
    root.style.setProperty('--cx', x + 'px');
    root.style.setProperty('--cy', y + 'px');

    // Parallax — subtle depth shift proportional to pointer offset
    const px = (x / innerWidth - 0.5) * 16;
    const py = (y / innerHeight - 0.5) * 16;
    root.style.setProperty('--px', px + 'px');
    root.style.setProperty('--py', py + 'px');

    charge();
  }

  document.addEventListener('mousemove', e => onPointerMove(e.clientX, e.clientY), { passive: true });
  document.addEventListener('touchmove', e => {
    if (e.touches[0]) onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  function charge() {
    isIdle = false;
    hasInteracted = true;
    energy = Math.min(1, energy + E.chargeRate);
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { isIdle = true; entropyLoop(); }, E.idleTimeout);

    // Dismiss greeting on interaction
    if (greetingShown && greetEl.classList.contains('visible')) {
      greetEl.classList.remove('visible');
      greetEl.classList.add('hidden');
    }
  }

  // Energy entropy — gradual return to rest
  function entropyLoop() {
    if (!isIdle) return;
    energy = Math.max(0, energy - E.decayRate);
    if (energy > 0) requestAnimationFrame(entropyLoop);
  }

  // ════════════════════════════════════════════
  //  3. PRESENCE FIELD — Proximity awareness
  // ════════════════════════════════════════════
  // The profile radiates a presence field.
  // Approaching it charges the aura and sharpens the bio.

  function presenceLoop() {
    const rect = profile.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const distance = Math.hypot(pointerX - cx, pointerY - cy);

    if (distance < E.presenceRadius) {
      profile.classList.add('presence-active');
      bio.classList.replace('idle', 'focused');
    } else {
      profile.classList.remove('presence-active');
      if (bio.classList.contains('focused')) {
        bio.classList.replace('focused', 'idle');
      }
    }

    // Broadcast energy state to CSS
    const auraEnergy = 0.15 + energy * 0.4;
    root.style.setProperty('--aura-energy', auraEnergy.toFixed(3));
    root.style.setProperty('--energy', energy.toFixed(3));
    body.className = isIdle ? 'presence-idle' : 'presence-active';

    requestAnimationFrame(presenceLoop);
  }

  requestAnimationFrame(presenceLoop);

  // ════════════════════════════════════════════
  //  4. IDENTITY SIGNATURE — Profile click surge
  // ════════════════════════════════════════════
  // Clicking the profile triggers an energy surge —
  // a moment of self-assertion through light and ripple.

  let identityActive = false;

  profile.addEventListener('click', () => {
    if (identityActive) return;
    identityActive = true;
    card.classList.add('identity-reveal');

    // Aura ripple burst — two concentric rings
    for (let i = 0; i < 2; i++) {
      const ripple = document.createElement('div');
      ripple.className = 'aura-ripple';
      ripple.style.animation = `auraRippleOut ${0.7 + i * 0.25}s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.12}s forwards`;
      aura.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    }

    // Energize particles outward
    identityBurst = true;
    energy = Math.min(1, energy + 0.35);

    setTimeout(() => {
      card.classList.remove('identity-reveal');
      identityActive = false;
      identityBurst = false;
    }, E.identityDuration);
  });

  // ════════════════════════════════════════════
  //  5. MAGNETIC FIELD — Button energy pull
  // ════════════════════════════════════════════
  // Each button has a small gravitational field.
  // The pointer bends them slightly — intentional, not gimmicky.

  function magneticLoop() {
    links.forEach(btn => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const distance = Math.hypot(pointerX - cx, pointerY - cy);

      if (distance < E.magneticRange) {
        const strength = (1 - distance / E.magneticRange) * E.magneticStrength;
        const angle = Math.atan2(pointerY - cy, pointerX - cx);
        btn.style.setProperty('--mag-x', (Math.cos(angle) * strength).toFixed(2) + 'px');
        btn.style.setProperty('--mag-y', (Math.sin(angle) * strength).toFixed(2) + 'px');
      } else {
        btn.style.setProperty('--mag-x', '0px');
        btn.style.setProperty('--mag-y', '0px');
      }

      // Radial spotlight position within button
      btn.style.setProperty('--rx', ((pointerX - rect.left) / rect.width * 100).toFixed(1) + '%');
      btn.style.setProperty('--ry', ((pointerY - rect.top) / rect.height * 100).toFixed(1) + '%');
    });

    requestAnimationFrame(magneticLoop);
  }

  requestAnimationFrame(magneticLoop);

  // ════════════════════════════════════════════
  //  6. BUTTON INTELLIGENCE — Click energy
  // ════════════════════════════════════════════
  // Clicks release energy ripples. No hover-delay hints —
  // they added noise without enough value.

  links.forEach(btn => {
    btn.addEventListener('click', e => {
      spawnRipple(e.clientX, e.clientY);
      energy = Math.min(1, energy + 0.2);
    });
  });

  function spawnRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    body.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  }

  // ════════════════════════════════════════════
  //  7. GREETING — Contextual whisper
  // ════════════════════════════════════════════
  // A single, brief greeting that fades. Not a notification —
  // a gentle acknowledgment of presence.

  const greetings = [
    "Welcome — explore freely.",
    "Glad you're here.",
    "Take a look around.",
    "Curious minds welcome.",
  ];

  setTimeout(() => {
    greetEl.textContent = greetings[Math.floor(Math.random() * greetings.length)];
    greetEl.classList.add('visible');
    greetingShown = true;

    setTimeout(() => {
      if (greetEl.classList.contains('visible')) {
        greetEl.classList.remove('visible');
        greetEl.classList.add('hidden');
      }
    }, E.greetDuration);
  }, E.greetDelay);

  // ════════════════════════════════════════════
  //  8. ENERGY MOTES — Ambient particle field
  // ════════════════════════════════════════════
  // Particles are energy made visible — drifting upward like
  // heat shimmer, drawn gently toward the pointer, and 
  // expelled outward during identity bursts.

  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }
  resizeCanvas();
  addEventListener('resize', resizeCanvas);

  class EnergyMote {
    constructor() { this.seed() }

    seed() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.depth = 0.3 + Math.random() * 0.7;
      this.radius = this.depth * 1.8;
      this.vx = (Math.random() - 0.5) * 0.1 * this.depth;
      this.vy = -0.08 - Math.random() * 0.15 * this.depth;
      this.baseOpacity = 0.08 + this.depth * 0.2;
      this.age = 0;
      this.lifespan = 500 + Math.random() * 500;
    }

    update() {
      // Pointer attraction — gentle energy pull
      const dx = pointerX - this.x;
      const dy = pointerY - this.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 250 && dist > 1) {
        const force = (1 - dist / 250) * 0.015 * this.depth;
        this.vx += (dx / dist) * force;
        this.vy += (dy / dist) * force;
      }

      // Identity burst — radial energy expulsion
      if (identityBurst) {
        const rect = profile.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const bx = this.x - cx;
        const by = this.y - cy;
        const bd = Math.hypot(bx, by);
        if (bd > 5) {
          this.vx += (bx / bd) * 0.3;
          this.vy += (by / bd) * 0.3;
        }
      }

      this.x += this.vx;
      this.y += this.vy;
      this.age++;

      // Gentle friction — energy dissipates
      this.vx *= 0.997;
      this.vy *= 0.997;

      // Recycle when spent or out of bounds
      if (this.age > this.lifespan || this.x < -30 || this.x > canvas.width + 30 ||
        this.y < -30 || this.y > canvas.height + 30) {
        this.seed();
      }
    }

    draw() {
      // Fade in and out — energy conservation
      const fadeIn = Math.min(1, this.age / 80);
      const fadeOut = Math.max(0, 1 - (this.age - this.lifespan + 80) / 80);
      const alpha = this.baseOpacity * fadeIn * fadeOut * (isIdle ? 0.5 : 0.85);

      const hue = getComputedStyle(root).getPropertyValue('--h2').trim() || 265;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue}, 40%, 60%, ${alpha})`;
      ctx.fill();
    }
  }

  // Initialize motes with staggered ages for organic appearance
  for (let i = 0; i < E.particleCount; i++) {
    const mote = new EnergyMote();
    mote.age = Math.random() * mote.lifespan;
    particles.push(mote);
  }

  function renderParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(renderParticles);
  }
  renderParticles();

  // ════════════════════════════════════════════
  //  9. MOBILE INTELLIGENCE — Touch adaptation
  // ════════════════════════════════════════════
  // On touch devices, the bio stays focused (no hover needed),
  // and device tilt drives the parallax depth layer.

  const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

  if (isTouch) {
    bio.classList.replace('idle', 'focused');

    document.addEventListener('touchstart', e => {
      if (e.touches[0]) spawnRipple(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', e => {
        if (e.gamma !== null && e.beta !== null) {
          const px = Math.max(-12, Math.min(12, e.gamma)) * 0.7;
          const py = Math.max(-12, Math.min(12, e.beta - 45)) * 0.7;
          root.style.setProperty('--px', px + 'px');
          root.style.setProperty('--py', py + 'px');
        }
      }, { passive: true });
    }
  }

  // ════════════════════════════════════════════
  //  10. AWAKENING — Initial energy ramp
  // ════════════════════════════════════════════
  // The page doesn't just appear — it wakes up.
  // Energy builds from zero over the first 2 seconds.

  let awakenProgress = 0;

  function awakenLoop() {
    awakenProgress = Math.min(1, awakenProgress + 0.006);
    root.style.setProperty('--aura-energy', (awakenProgress * 0.25).toFixed(3));

    if (awakenProgress < 1) requestAnimationFrame(awakenLoop);
  }
  requestAnimationFrame(awakenLoop);

})();
