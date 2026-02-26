/* ============================================
   SHOW TOOLS — Main JavaScript
   Animations, Particles, Cursor, Scroll Reveals
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  initCustomCursor();
  initScrollReveal();
  initMobileNav();
  initNavActiveState();
  initTerminalTyping();
});

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

      // Wrap around
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

  // Check if touch device
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

  // Hover effect on interactive elements
  const hoverTargets = document.querySelectorAll('a, button, .btn, .feature-card, .product-card, .download-item, .contact-link');
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

  // Close nav when clicking a link
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
