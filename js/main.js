/* ============================================
   SHOW TOOLS — Main JavaScript
   Loader, Transitions, Animations, Particles
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initCanvas();
  initCustomCursor();
  initScrollReveal();
  initMobileNav();
  initNavActiveState();
  initTerminalTyping();
  initPageTransitions();
  initChangelog();
});

/* --- Page Loader with Particles (first visit only) --- */
function initPageLoader() {
  const loader = document.getElementById('pageLoader');
  if (!loader) return;

  // Only show loader on first visit this session
  if (sessionStorage.getItem('showtools_loaded')) {
    loader.remove();
    document.body.classList.add('page-ready');
    return;
  }

  const canvas = document.getElementById('loaderCanvas');
  const ctx = canvas.getContext('2d');
  const barFill = document.querySelector('.loader-bar-fill');
  const percentText = document.querySelector('.loader-percent');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Loader particles
  const particles = [];
  const particleCount = 80;

  for (let i = 0; i < particleCount; i++) {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 200;
    particles.push({
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
      targetX: Math.random() * canvas.width,
      targetY: Math.random() * canvas.height,
      size: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.02 + 0.005,
      progress: 0,
    });
  }

  let progress = 0;
  let loadingDone = false;

  function drawLoader() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      // Move particles outward from center as loading progresses
      p.progress += p.speed;
      if (p.progress > 1) p.progress = 1;

      const ease = 1 - Math.pow(1 - p.progress, 3);
      const startX = canvas.width / 2 + (p.x - canvas.width / 2) * 0.3;
      const startY = canvas.height / 2 + (p.y - canvas.height / 2) * 0.3;
      const currentX = startX + (p.targetX - startX) * ease;
      const currentY = startY + (p.targetY - startY) * ease;

      ctx.fillStyle = `rgba(0, 240, 255, ${p.opacity * ease})`;
      ctx.beginPath();
      ctx.arc(currentX, currentY, p.size, 0, Math.PI * 2);
      ctx.fill();

      // Draw connections
      particles.forEach((p2) => {
        if (p === p2) return;
        const ease2 = 1 - Math.pow(1 - p2.progress, 3);
        const x2 = canvas.width / 2 + (p2.targetX - canvas.width / 2) * ease2;
        const y2 = canvas.height / 2 + (p2.targetY - canvas.height / 2) * ease2;
        const dx = currentX - x2;
        const dy = currentY - y2;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.strokeStyle = `rgba(0, 240, 255, ${(1 - dist / 120) * 0.06 * ease})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(currentX, currentY);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      });
    });

    if (!loadingDone) {
      requestAnimationFrame(drawLoader);
    }
  }

  drawLoader();

  // Simulate loading progress
  const loadDuration = 1800; // ms
  const startTime = Date.now();

  function updateProgress() {
    const elapsed = Date.now() - startTime;
    progress = Math.min(elapsed / loadDuration, 1);

    // Ease the progress for a nice feel
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const percent = Math.round(easedProgress * 100);

    barFill.style.width = percent + '%';
    percentText.textContent = percent + '%';

    if (progress < 1) {
      requestAnimationFrame(updateProgress);
    } else {
      // Loading complete
      setTimeout(() => {
        loadingDone = true;
        loader.classList.add('loaded');
        document.body.classList.add('page-ready');
        sessionStorage.setItem('showtools_loaded', 'true');
      }, 200);
    }
  }

  updateProgress();
}

/* --- Animated Grid Canvas Background --- */
function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, columns, rows;
  const cellSize = 60;
  let mouseX = -1000;
  let mouseY = -1000;
  let animationId;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    columns = Math.ceil(width / cellSize) + 1;
    rows = Math.ceil(height / cellSize) + 1;
  }

  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Particles
  const particles = [];
  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.03)';
    ctx.lineWidth = 0.5;

    for (let i = 0; i <= columns; i++) {
      const x = i * cellSize;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let j = 0; j <= rows; j++) {
      const y = j * cellSize;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw grid intersections with mouse proximity glow
    for (let i = 0; i <= columns; i++) {
      for (let j = 0; j <= rows; j++) {
        const x = i * cellSize;
        const y = j * cellSize;
        const dx = mouseX - x;
        const dy = mouseY - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 200;

        if (dist < maxDist) {
          const intensity = 1 - dist / maxDist;
          ctx.fillStyle = `rgba(0, 240, 255, ${intensity * 0.4})`;
          ctx.beginPath();
          ctx.arc(x, y, 2 + intensity * 3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = 'rgba(0, 240, 255, 0.04)';
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Draw and update particles
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.fillStyle = `rgba(0, 240, 255, ${p.opacity})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw connections between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          const opacity = (1 - dist / 150) * 0.08;
          ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    animationId = requestAnimationFrame(draw);
  }

  draw();
}

/* --- Custom Cursor --- */
function initCustomCursor() {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  if ('ontouchstart' in window) {
    dot.style.display = 'none';
    ring.style.display = 'none';
    return;
  }

  let dotX = 0, dotY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    dotX = e.clientX;
    dotY = e.clientY;
  });

  function animate() {
    ringX += (dotX - ringX) * 0.15;
    ringY += (dotY - ringY) * 0.15;

    dot.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`;
    ring.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;

    requestAnimationFrame(animate);
  }
  animate();

  const hoverTargets = document.querySelectorAll('a, button, .btn, .feature-card, .product-card, .download-item, .contact-link, .changelog-toggle');
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
  });
}

/* --- Scroll Reveal --- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* --- Mobile Navigation --- */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('open');
  });

  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('open');
    });
  });
}

/* --- Active Nav State --- */
function initNavActiveState() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-links a');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (currentPath.endsWith(href) || (currentPath === '/' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* --- Terminal Typing Effect --- */
function initTerminalTyping() {
  const typingElements = document.querySelectorAll('.terminal-typing');
  if (!typingElements.length) return;

  typingElements.forEach((el) => {
    const text = el.getAttribute('data-text');
    if (!text) return;

    let i = 0;
    el.textContent = '';
    el.classList.add('typing');

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const typeInterval = setInterval(() => {
            el.textContent += text[i];
            i++;
            if (i >= text.length) {
              clearInterval(typeInterval);
              setTimeout(() => el.classList.remove('typing'), 1000);
            }
          }, 50);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
  });
}

/* --- Page Transitions --- */
function initPageTransitions() {
  const transition = document.getElementById('pageTransition');
  if (!transition) return;

  // On page load, play the exit (reveal) animation
  transition.classList.add('exiting');
  setTimeout(() => {
    document.body.classList.remove('page-blurring');
  }, 350);

  // Intercept all internal navigation links
  const links = document.querySelectorAll('a[href]');
  links.forEach((link) => {
    const href = link.getAttribute('href');

    // Skip external links, anchors, mailto, download triggers, logo, and javascript
    if (!href ||
        href.startsWith('#') ||
        href.startsWith('http') ||
        href.startsWith('mailto') ||
        href.startsWith('javascript') ||
        link.hasAttribute('download') ||
        link.classList.contains('donation-trigger') ||
        link.classList.contains('nav-logo') ||
        link.getAttribute('target') === '_blank') {
      return;
    }

    link.addEventListener('click', (e) => {
      e.preventDefault();
      const destination = href;

      // Blur page content behind the transition
      document.body.classList.add('page-blurring');

      // Play entering animation
      transition.classList.remove('exiting');
      
      requestAnimationFrame(() => {
        transition.classList.add('entering');

        // Navigate after dissolve covers the screen
        setTimeout(() => {
          window.location.href = destination;
        }, 450);
      });
    });
  });
}

/* --- Changelog Toggle --- */
function initChangelog() {
  const toggle = document.querySelector('.changelog-toggle');
  const entries = document.querySelector('.changelog-entries');
  if (!toggle || !entries) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    entries.classList.toggle('open');
  });
}

/* --- Smooth Scroll for Anchor Links --- */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* --- Easter Egg: Logo Click Rainbow Mode --- */
(function () {
  const logo = document.querySelector('.nav-logo');
  if (!logo) return;
  let clickCount = 0;
  let clickTimer = null;
  let rainbowActive = false;

  logo.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    clickCount++;
    clearTimeout(clickTimer);

    if (clickCount >= 5 && !rainbowActive) {
      clickCount = 0;
      rainbowActive = true;
      document.body.classList.add('rainbow-mode');

      setTimeout(() => {
        document.body.classList.remove('rainbow-mode');
        rainbowActive = false;
      }, 6000);
      return;
    }

    // If single click after a delay, navigate home
    clickTimer = setTimeout(() => {
      if (clickCount < 5) {
        clickCount = 0;
        window.location.href = 'index.html';
      }
    }, 400);
  });
})();

/* --- Easter Egg: Matrix Rain on "wake up neo" --- */
(function () {
  let buffer = '';
  let matrixActive = false;

  document.addEventListener('keypress', (e) => {
    if (matrixActive) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    buffer += e.key.toLowerCase();
    if (buffer.length > 20) buffer = buffer.slice(-20);

    if (buffer.includes('wake up neo')) {
      buffer = '';
      matrixActive = true;
      startMatrixRain();
    }
  });

  function startMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.id = 'matrixCanvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9998;pointer-events:none;opacity:0;transition:opacity 0.5s;';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    requestAnimationFrame(() => { canvas.style.opacity = '0.85'; });

    const chars = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ01234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(1);

    // Randomize starting positions
    for (let i = 0; i < drops.length; i++) {
      drops[i] = Math.random() * -50;
    }

    function drawMatrix() {
      ctx.fillStyle = 'rgba(5, 5, 8, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];

        // Lead character is bright
        if (Math.random() > 0.3) {
          ctx.fillStyle = '#00f0ff';
        } else {
          ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
        }

        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    const matrixInterval = setInterval(drawMatrix, 45);

    // Fade out and clean up after 7 seconds
    setTimeout(() => {
      canvas.style.opacity = '0';
      setTimeout(() => {
        clearInterval(matrixInterval);
        canvas.remove();
        matrixActive = false;
      }, 600);
    }, 7000);
  }
})();
