/* ==========================================================================
   E-PORTFOLIO SCROLL-DRIVEN GENRE BACKGROUND SCRIPT (script.js)
   Smoothly transitions the background images, procedural canvas graphics,
   and accent colors purely as the user scrolls through the website:
     0: UAV & Autonomous Robotics (2.jpg - Top / Self-Introduction)
     1: Embedded Hardware & PCB Design (3.png & 3.2.png - Resume / Early Academic)
     2: Space Systems & Orbital Atlas (4.png - Academic Samples)
     3: 3D CAD & Modular Web Systems (1.png - Business & Formal Work Samples)
   ========================================================================== */

const GENRES = [
  {
    id: 0,
    rgb: [56, 189, 248], // Sky Cyan (UAV & Robotics - 2.jpg)
    photoId: 'bg-photo-1'
  },
  {
    id: 1,
    rgb: [16, 185, 129], // PCB Emerald (Embedded & PCB - 3.png / 3.2.png)
    photoId: 'bg-photo-2'
  },
  {
    id: 2,
    rgb: [129, 140, 248], // Cosmic Indigo (Space & Orbital Atlas - 4.png)
    photoId: 'bg-photo-3'
  },
  {
    id: 3,
    rgb: [245, 158, 11], // Warm Amber (Industrial CAD / Rome Cabinets - 1.png)
    photoId: 'bg-photo-0'
  }
];

let targetScrollPos = 0; // 0.0 to 3.0 based on scroll percentage
let smoothedScrollPos = 0;
let genreWeights = [1, 0, 0, 0];

function updateTargetScroll() {
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
  targetScrollPos = progress * (GENRES.length - 1);
}

/* ==========================================================================
   PROCEDURAL MULTI-GENRE CANVAS + SCROLL INTERPOLATION
   ========================================================================== */

function initGenreCanvas() {
  const canvas = document.getElementById('genre-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    updateTargetScroll();
  });

  window.addEventListener('scroll', updateTargetScroll, { passive: true });
  updateTargetScroll();
  smoothedScrollPos = targetScrollPos;

  const photoLayers = GENRES.map((g) => document.getElementById(g.photoId));

  // Pre-generate particles/elements for the genres
  const stars = Array.from({ length: 75 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.6 + 0.4,
    phase: Math.random() * Math.PI * 2
  }));

  const pcbTraces = Array.from({ length: 18 }, (_, i) => ({
    x: (i / 18) * 1.1 - 0.05,
    y: ((i * 37) % 100) / 100,
    len: 120 + (i % 5) * 45,
    dir: i % 2 === 0 ? 1 : -1
  }));

  let time = 0;

  function render() {
    time += 0.012;
    ctx.clearRect(0, 0, width, height);

    // Smoothly glide toward the current scroll position
    smoothedScrollPos += (targetScrollPos - smoothedScrollPos) * 0.07;

    // Calculate continuous blend weights for each genre based on scroll position
    let rAcc = 0;
    let gAcc = 0;
    let bAcc = 0;

    for (let i = 0; i < GENRES.length; i++) {
      const w = Math.max(0, 1 - Math.abs(smoothedScrollPos - i));
      genreWeights[i] = w;

      // Update background photo layer opacity smoothly
      if (photoLayers[i]) {
        photoLayers[i].style.opacity = (w * 0.75).toFixed(3);
      }

      rAcc += GENRES[i].rgb[0] * w;
      gAcc += GENRES[i].rgb[1] * w;
      bAcc += GENRES[i].rgb[2] * w;
    }

    const r = Math.round(rAcc);
    const g = Math.round(gAcc);
    const b = Math.round(bAcc);
    document.documentElement.style.setProperty('--accent', `rgb(${r}, ${g}, ${b})`);
    document.documentElement.style.setProperty('--accent-rgb', `${r}, ${g}, ${b}`);

    // --- GENRE 0 (Top): UAV / DRONE FLIGHT TELEMETRY & AIRFLOW (2.jpg) ---
    if (genreWeights[0] > 0.01) {
      const alpha = genreWeights[0];
      ctx.save();
      const cx = width * 0.5;
      const cy = height * 0.5;
      const maxR = Math.min(width, height) * 0.34;

      [0.45, 0.75, 1.0].forEach((scale, idx) => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(56, 189, 248, ${(0.18 - idx * 0.04) * alpha})`;
        ctx.lineWidth = 1.2;
        ctx.setLineDash(idx % 2 === 0 ? [8, 12] : []);
        ctx.arc(
          cx,
          cy,
          maxR * scale,
          time * (idx % 2 === 0 ? 0.2 : -0.15) + smoothedScrollPos * 0.6,
          time * (idx % 2 === 0 ? 0.2 : -0.15) + smoothedScrollPos * 0.6 + Math.PI * 1.65
        );
        ctx.stroke();
      });

      ctx.setLineDash([]);
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.22 * alpha})`;
      for (let i = -3; i <= 3; i++) {
        if (i === 0) continue;
        const yOff = cy + i * 36 + Math.sin(time * 0.9) * 14;
        const barW = 28 + Math.abs(i) * 6;
        ctx.beginPath();
        ctx.moveTo(cx - barW, yOff);
        ctx.lineTo(cx - 10, yOff);
        ctx.moveTo(cx + 10, yOff);
        ctx.lineTo(cx + barW, yOff);
        ctx.stroke();
      }
      ctx.restore();
    }

    // --- GENRE 1 (Upper-Mid): EMBEDDED HARDWARE, PCB TRACES & 8x8 LED MATRIX (3.png & 3.2.png) ---
    if (genreWeights[1] > 0.01) {
      const alpha = genreWeights[1];
      ctx.save();
      ctx.strokeStyle = `rgba(16, 185, 129, ${0.22 * alpha})`;
      ctx.lineWidth = 1.6;

      pcbTraces.forEach((t) => {
        const sx = t.x * width;
        const sy = t.y * height;
        const bend = 45;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + bend * t.dir, sy);
        ctx.lineTo(sx + (bend + 35) * t.dir, sy + 35);
        ctx.lineTo(sx + (bend + 35 + t.len * 0.5) * t.dir, sy + 35);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
        ctx.arc(sx + (bend + 35 + t.len * 0.5) * t.dir, sy + 35, 3.5, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Glowing 8x8 LED Matrix Pong motif (from 3.2.png)
      const matrixX = width * 0.78;
      const matrixY = height * 0.25;
      const dotSpacing = 14;
      const ballCol = Math.floor(((Math.sin(time * 2) + 1) / 2) * 5) + 1;
      const ballRow = Math.floor(((Math.cos(time * 1.5) + 1) / 2) * 6) + 1;

      for (let rIdx = 0; rIdx < 8; rIdx++) {
        for (let cIdx = 0; cIdx < 8; cIdx++) {
          const isLeftPaddle = cIdx === 0 && rIdx >= 2 && rIdx <= 5;
          const isRightPaddle = cIdx === 7 && rIdx >= 2 && rIdx <= 5;
          const isBall = cIdx === ballCol && rIdx === ballRow;
          const lit = isLeftPaddle || isRightPaddle || isBall;

          ctx.beginPath();
          ctx.fillStyle = lit
            ? `rgba(239, 68, 68, ${0.55 * alpha})`
            : `rgba(255, 255, 255, ${0.06 * alpha})`;
          ctx.arc(matrixX + cIdx * dotSpacing, matrixY + rIdx * dotSpacing, lit ? 4.2 : 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    // --- GENRE 2 (Lower-Mid): SPACE SYSTEMS & ORBITAL ATLAS (4.png) ---
    if (genreWeights[2] > 0.01) {
      const alpha = genreWeights[2];
      ctx.save();

      stars.forEach((s) => {
        const twinkle = 0.4 + 0.6 * Math.sin(time * 2 + s.phase);
        ctx.fillStyle = `rgba(224, 231, 255, ${twinkle * 0.55 * alpha})`;
        ctx.beginPath();
        ctx.arc(s.x * width, s.y * height, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      const sunX = width * 0.5;
      const sunY = height * 0.52;

      const sunGrad = ctx.createRadialGradient(sunX, sunY, 2, sunX, sunY, 54);
      sunGrad.addColorStop(0, `rgba(251, 191, 36, ${0.42 * alpha})`);
      sunGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 54, 0, Math.PI * 2);
      ctx.fill();

      const orbits = [
        { rx: 140, ry: 52, speed: 0.9, color: '129, 140, 248', pRadius: 3.5 },
        { rx: 240, ry: 88, speed: 0.55, color: '56, 189, 248', pRadius: 4.5 },
        { rx: 360, ry: 132, speed: 0.32, color: '245, 158, 11', pRadius: 4.0 },
        { rx: 490, ry: 180, speed: 0.18, color: '167, 139, 250', pRadius: 3.2 }
      ];

      orbits.forEach((orb, idx) => {
        ctx.strokeStyle = `rgba(${orb.color}, ${0.2 * alpha})`;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.ellipse(sunX, sunY, orb.rx, orb.ry, -0.12, 0, Math.PI * 2);
        ctx.stroke();

        const ang = time * orb.speed + idx * 1.7 + smoothedScrollPos * 0.8;
        const px = sunX + orb.rx * Math.cos(ang) * Math.cos(-0.12) - orb.ry * Math.sin(ang) * Math.sin(-0.12);
        const py = sunY + orb.rx * Math.cos(ang) * Math.sin(-0.12) + orb.ry * Math.sin(ang) * Math.cos(-0.12);

        ctx.fillStyle = `rgba(${orb.color}, ${0.8 * alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, orb.pRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
    }

    // --- GENRE 3 (Bottom): 3D CAD WIREFRAME & MODULAR GRID (1.png - Rome Cabinets) ---
    if (genreWeights[3] > 0.01) {
      const alpha = genreWeights[3];
      ctx.save();
      ctx.strokeStyle = `rgba(245, 158, 11, ${0.11 * alpha})`;
      ctx.lineWidth = 1;

      const gridSize = 64;
      const offsetX = (time * 14) % gridSize;
      const offsetY = (time * 8) % gridSize;

      for (let x = -gridSize + offsetX; x < width + gridSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x - height * 0.25, height);
        ctx.stroke();
      }
      for (let y = -gridSize + offsetY; y < height + gridSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const cx = width * 0.78;
      const cy = height * 0.36;
      const size = Math.min(width, height) * 0.16;
      const angle = time * 0.35 + smoothedScrollPos;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      const vertices = [
        [-1, -1.2, -0.7], [1, -1.2, -0.7], [1, 1.2, -0.7], [-1, 1.2, -0.7],
        [-1, -1.2, 0.7], [1, -1.2, 0.7], [1, 1.2, 0.7], [-1, 1.2, 0.7]
      ].map(([vx, vy, vz]) => {
        const rx = vx * cos - vz * sin;
        const rz = vx * sin + vz * cos;
        const py = vy * 0.92 - rz * 0.28;
        return [cx + rx * size, cy + py * size];
      });

      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7]
      ];

      ctx.strokeStyle = `rgba(245, 158, 11, ${0.26 * alpha})`;
      ctx.lineWidth = 1.5;
      edges.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(vertices[a][0], vertices[a][1]);
        ctx.lineTo(vertices[b][0], vertices[b][1]);
        ctx.stroke();
      });
      ctx.restore();
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   SCROLL REVEAL & LIGHTBOX INITIALIZATION
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initGenreCanvas();

  // Scroll reveal for sections
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.section-block').forEach((sec) => observer.observe(sec));

  // Lightbox image preview
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  document.querySelectorAll('.zoomable-img').forEach((img) => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = img.getAttribute('data-caption') || img.alt || '';
      lightbox.classList.add('open');
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
});
