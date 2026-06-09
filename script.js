/* ═══════════════════════════════════════════════════════════
   XIANGLINLIE — AI Anime Canvas + Orbital Navigation
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Canvas: AI Anime Energy Field ───
  const canvas = document.getElementById('anime-bg');
  const ctx = canvas.getContext('2d');
  let W, H, particles, energyRings, animeStreaks, mouseX, mouseY;
  let frame = 0;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initParticles();
  }

  function initParticles() {
    const count = Math.min(180, Math.floor((W * H) / 8000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 2 + 0.5,
      hue: Math.random() > 0.5 ? 185 : 310,
      alpha: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * Math.PI * 2,
    }));

    energyRings = Array.from({ length: 5 }, (_, i) => ({
      cx: W * (0.3 + Math.random() * 0.4),
      cy: H * (0.3 + Math.random() * 0.4),
      r: 60 + i * 80,
      speed: (i % 2 === 0 ? 1 : -1) * (0.003 + i * 0.001),
      hue: [185, 310, 270, 50, 185][i],
    }));

    animeStreaks = Array.from({ length: 12 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      len: 80 + Math.random() * 200,
      angle: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 2,
      hue: [185, 310, 270][Math.floor(Math.random() * 3)],
      width: 1 + Math.random() * 2,
      life: Math.random(),
    }));
  }

  mouseX = W / 2;
  mouseY = H / 2;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function drawBackground() {
    const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
    grad.addColorStop(0, '#0a0020');
    grad.addColorStop(0.4, '#080018');
    grad.addColorStop(1, '#020008');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  function drawEnergyRings() {
    const t = frame * 0.01;
    energyRings.forEach((ring) => {
      ring.r += Math.sin(t + ring.hue) * 0.3;
      ctx.beginPath();
      ctx.arc(ring.cx, ring.cy, ring.r, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${ring.hue}, 100%, 60%, 0.06)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const segments = 6;
      for (let s = 0; s < segments; s++) {
        const a = (s / segments) * Math.PI * 2 + frame * ring.speed;
        const x1 = ring.cx + Math.cos(a) * ring.r;
        const y1 = ring.cy + Math.sin(a) * ring.r;
        const x2 = ring.cx + Math.cos(a + 0.3) * (ring.r + 20);
        const y2 = ring.cy + Math.sin(a + 0.3) * (ring.r + 20);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `hsla(${ring.hue}, 100%, 70%, 0.15)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });
  }

  function drawAnimeStreaks() {
    animeStreaks.forEach((s) => {
      s.life += 0.008;
      if (s.life > 1) {
        s.x = Math.random() * W;
        s.y = Math.random() * H;
        s.life = 0;
        s.angle = Math.random() * Math.PI * 2;
      }

      const alpha = Math.sin(s.life * Math.PI) * 0.5;
      const ex = s.x + Math.cos(s.angle) * s.len;
      const ey = s.y + Math.sin(s.angle) * s.len;

      const lg = ctx.createLinearGradient(s.x, s.y, ex, ey);
      lg.addColorStop(0, `hsla(${s.hue}, 100%, 70%, 0)`);
      lg.addColorStop(0.5, `hsla(${s.hue}, 100%, 70%, ${alpha})`);
      lg.addColorStop(1, `hsla(${s.hue}, 100%, 90%, 0)`);

      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(ex, ey);
      ctx.strokeStyle = lg;
      ctx.lineWidth = s.width;
      ctx.stroke();
    });
  }

  function drawParticles() {
    particles.forEach((p) => {
      p.pulse += 0.04;
      const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));

      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        p.vx += (dx / dist) * 0.02;
        p.vy += (dy / dist) * 0.02;
      }

      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.99;
      p.vy *= 0.99;

      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${a})`;
      ctx.fill();
    });

    // Neural connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.08 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function drawCentralAura() {
    const cx = W / 2;
    const cy = H / 2;
    const pulse = 1 + 0.1 * Math.sin(frame * 0.03);

    const aura = ctx.createRadialGradient(cx, cy, 0, cx, cy, 200 * pulse);
    aura.addColorStop(0, 'rgba(0, 240, 255, 0.08)');
    aura.addColorStop(0.5, 'rgba(255, 0, 170, 0.04)');
    aura.addColorStop(1, 'transparent');
    ctx.fillStyle = aura;
    ctx.fillRect(cx - 250, cy - 250, 500, 500);

    // Anime speed lines radiating from center
    const lines = 24;
    for (let i = 0; i < lines; i++) {
      const angle = (i / lines) * Math.PI * 2 + frame * 0.005;
      const inner = 80 + 20 * Math.sin(frame * 0.02 + i);
      const outer = inner + 60 + 30 * Math.sin(frame * 0.03 + i * 0.5);
      const x1 = cx + Math.cos(angle) * inner;
      const y1 = cy + Math.sin(angle) * inner;
      const x2 = cx + Math.cos(angle) * outer;
      const y2 = cy + Math.sin(angle) * outer;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      const hue = i % 3 === 0 ? 185 : i % 3 === 1 ? 310 : 270;
      ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${0.1 + 0.05 * Math.sin(frame * 0.05 + i)})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  function drawLightning() {
    if (frame % 180 > 175) {
      const cx = W / 2 + (Math.random() - 0.5) * 200;
      const cy = H / 2 + (Math.random() - 0.5) * 200;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      let x = cx, y = cy;
      for (let i = 0; i < 6; i++) {
        x += (Math.random() - 0.5) * 60;
        y += (Math.random() - 0.5) * 60;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(0, 240, 255, ${0.3 + Math.random() * 0.4})`;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }

  function animate() {
    frame++;
    drawBackground();
    drawEnergyRings();
    drawCentralAura();
    drawAnimeStreaks();
    drawParticles();
    drawLightning();
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  resize();
  animate();

  // ─── Orbital Navigation ───
  const panels = ['vision', 'power', 'services', 'about', 'contact', 'future'];
  let currentIndex = 0;
  const orbitNav = document.querySelector('.orbit-nav');
  const nodes = document.querySelectorAll('.orbit-node');
  const allPanels = document.querySelectorAll('.content-panel');
  const progressFill = document.getElementById('progress-fill');
  const progressLabel = document.getElementById('progress-label');
  const orbitHint = document.getElementById('orbit-hint');
  const circumference = 163.36;

  function setPanel(index) {
    currentIndex = ((index % panels.length) + panels.length) % panels.length;

    nodes.forEach((n, i) => {
      n.classList.toggle('active', i === currentIndex);
    });

    allPanels.forEach((p) => p.classList.remove('active'));
    const target = document.getElementById('panel-' + panels[currentIndex]);
    if (target) target.classList.add('active');

    const offset = circumference - (currentIndex / (panels.length - 1)) * circumference;
    progressFill.style.strokeDashoffset = offset;
    progressLabel.textContent = String(currentIndex + 1).padStart(2, '0');

    // Rotate orbit nav to align active node at top
    const angle = -(currentIndex * (360 / panels.length));
    orbitNav.style.transform = `rotate(${angle}deg)`;
    orbitNav.classList.add('paused');

    animateCounters();
  }

  nodes.forEach((node, i) => {
    node.addEventListener('click', () => {
      setPanel(i);
      hideHint();
    });
  });

  // Scroll to orbit
  let scrollCooldown = false;
  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (scrollCooldown) return;
    scrollCooldown = true;
    setPanel(currentIndex + (e.deltaY > 0 ? 1 : -1));
    hideHint();
    setTimeout(() => { scrollCooldown = false; }, 400);
  }, { passive: false });

  // Touch swipe
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    const dy = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(dy) > 40) {
      setPanel(currentIndex + (dy > 0 ? 1 : -1));
      hideHint();
    }
  }, { passive: true });

  // Keyboard
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      setPanel(currentIndex + 1);
      hideHint();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      setPanel(currentIndex - 1);
      hideHint();
    }
  });

  function hideHint() {
    orbitHint.classList.add('hidden');
  }

  setTimeout(hideHint, 6000);

  // Counter animation
  function animateCounters() {
    const activePanel = document.querySelector('.content-panel.active');
    if (!activePanel) return;
    activePanel.querySelectorAll('.stat-num').forEach((el) => {
      const target = parseInt(el.dataset.count, 10);
      let current = 0;
      const step = Math.ceil(target / 40);
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current;
      }, 30);
    });
  }

  // Parallax tilt on panels
  document.addEventListener('mousemove', (e) => {
    const activePanel = document.querySelector('.content-panel.active');
    if (!activePanel) return;
    const rect = activePanel.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / window.innerWidth;
    const dy = (e.clientY - cy) / window.innerHeight;
    const tilt = parseFloat(activePanel.dataset.tilt) || 0;
    activePanel.style.transform = `rotate(${tilt + dy * 3}deg) rotateY(${dx * 5}deg) scale(1)`;
  });

  setPanel(0);
})();
