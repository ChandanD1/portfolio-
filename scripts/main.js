'use strict';

/* ============================================================
   SCI-FI DASHBOARD - MAIN JS
============================================================ */

/* ── TAB SWITCHING LOGIC ────────────────────────────────── */
(function initTabs() {
  const tabs = document.querySelectorAll('.nav-tab');
  const views = document.querySelectorAll('.sys-view');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      // Add active to clicked tab
      tab.classList.add('active');

      // Hide all views
      views.forEach(v => v.classList.remove('active'));
      
      // Show target view
      const targetId = tab.getAttribute('data-target');
      const targetView = document.getElementById(targetId);
      if (targetView) {
        targetView.classList.add('active');
      }
    });
  });
})();

/* ── LIVE CLOCKS ────────────────────────────────────────── */
(function initClocks() {
  const serverTimeEl = document.getElementById('serverTime');
  const localTimeEl = document.getElementById('localTime');

  function updateTime() {
    const now = new Date();
    
    // Local Time (HH:MM:SS)
    const local = now.toLocaleTimeString('en-US', { hour12: false });
    if (localTimeEl) localTimeEl.textContent = local;

    // "Server Time" (Offset by some hours to look different, e.g. UTC)
    const server = new Date(now.getTime() + (now.getTimezoneOffset() * 60000)).toLocaleTimeString('en-US', { hour12: false });
    if (serverTimeEl) serverTimeEl.textContent = server;
  }

  setInterval(updateTime, 1000);
  updateTime();
})();

/* ── AVATAR CANVAS (NOISE/GLITCH EFFECT) ────────────────── */
(function initAvatar() {
  const canvas = document.getElementById('avatarCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  function drawNoise() {
    const imgData = ctx.createImageData(w, h);
    const data = imgData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      // Create dark red/black noise
      const val = Math.random() * 255;
      data[i] = val > 200 ? 255 : (val * 0.3); // R
      data[i+1] = 0; // G
      data[i+2] = 0; // B
      data[i+3] = 255; // A
    }
    
    ctx.putImageData(imgData, 0, 0);

    // Draw some random red lines over it
    for(let j=0; j<5; j++) {
      ctx.fillStyle = `rgba(255, 42, 42, ${Math.random()})`;
      ctx.fillRect(0, Math.random() * h, w, Math.random() * 5);
    }

    setTimeout(() => requestAnimationFrame(drawNoise), 100);
  }
  
  drawNoise();
})();

/* ── COMMS CANVAS (SPINNING WIREFRAME) ──────────────────── */
(function initCommsCanvas() {
  const canvas = document.getElementById('commsCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width;
  let h = canvas.height;
  
  let angle = 0;

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.translate(w/2, h/2);
    
    // Rotate the whole context
    ctx.rotate(angle);
    
    ctx.strokeStyle = '#ff2a2a';
    ctx.lineWidth = 1;

    // Draw overlapping polygons
    for(let i=0; i<6; i++) {
      ctx.rotate(Math.PI / 3);
      ctx.beginPath();
      ctx.moveTo(0, -100);
      ctx.lineTo(86, -50);
      ctx.lineTo(86, 50);
      ctx.lineTo(0, 100);
      ctx.lineTo(-86, 50);
      ctx.lineTo(-86, -50);
      ctx.closePath();
      ctx.stroke();

      // Inner lines
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -100);
      ctx.stroke();
    }
    
    ctx.restore();
    angle += 0.005;
    
    requestAnimationFrame(draw);
  }
  
  draw();
})();
