/* High-Quality Video Renderer for Altar Loops Studio
 * Supports 4K UHD, 2K QHD, 1080p Full HD, 720p HD, and custom aspect ratios.
 * Deterministic frame-by-frame encoding via WebCodecs (MP4 H.264) + Mp4Muxer
 * and MediaRecorder fallback.
 */

(function () {
  'use strict';

  // Inject UI Styles
  const style = document.createElement('style');
  style.textContent = `
    .btn-render-video {
      background: linear-gradient(135deg, #ff8a4c 0%, #ff521a 100%) !important;
      color: #0d0b10 !important;
      font-weight: 600 !important;
      border: 1px solid rgba(255, 138, 76, 0.4) !important;
      box-shadow: 0 4px 18px rgba(255, 106, 44, 0.3) !important;
      transition: all 0.2s ease !important;
      display: inline-flex !important;
      align-items: center !important;
      gap: 7px !important;
      cursor: pointer !important;
    }
    .btn-render-video:hover {
      transform: translateY(-1px) !important;
      box-shadow: 0 6px 24px rgba(255, 106, 44, 0.5) !important;
      filter: brightness(1.1) !important;
    }
    .render-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(8, 7, 10, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease;
    }
    .render-modal-backdrop.active {
      opacity: 1;
      pointer-events: auto;
    }
    .render-modal {
      width: 100%;
      max-width: 580px;
      background: #141217;
      border: 1px solid rgba(236, 229, 218, 0.16);
      border-radius: 20px;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 176, 124, 0.1);
      padding: 28px;
      color: #ece5da;
      font-family: var(--font-sans, "Inter Tight", sans-serif);
      transform: scale(0.96) translateY(8px);
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .render-modal-backdrop.active .render-modal {
      transform: scale(1) translateY(0);
    }
    .render-head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .render-head h2 {
      font-size: 1.35rem;
      font-family: var(--font-serif, "Instrument Serif", serif);
      font-weight: 400;
      letter-spacing: 0.02em;
      margin: 0 0 4px;
      color: #fff;
    }
    .render-head h2 em {
      color: #ffb07c;
      font-style: italic;
    }
    .render-head p {
      font-size: 0.82rem;
      color: #9a929e;
      margin: 0;
      line-height: 1.4;
    }
    .render-close {
      background: none;
      border: none;
      color: #9a929e;
      font-size: 1.4rem;
      line-height: 1;
      cursor: pointer;
      padding: 4px;
      border-radius: 6px;
      transition: color 0.15s;
    }
    .render-close:hover {
      color: #fff;
    }
    .render-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin-bottom: 18px;
    }
    .render-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .render-field.full {
      grid-column: 1 / -1;
    }
    .render-label {
      font-family: var(--font-mono, monospace);
      font-size: 0.65rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #ffb07c;
      font-weight: 500;
    }
    .render-select, .render-input {
      background: rgba(236, 229, 218, 0.04);
      border: 1px solid rgba(236, 229, 218, 0.18);
      border-radius: 10px;
      color: #ece5da;
      font-family: inherit;
      font-size: 0.85rem;
      padding: 9px 12px;
      outline: none;
      transition: border-color 0.2s, background 0.2s;
    }
    .render-select:focus, .render-input:focus {
      border-color: #ffb07c;
      background: rgba(255, 176, 124, 0.05);
    }
    .render-select option {
      background: #19171d;
      color: #ece5da;
    }
    .render-chip-summary {
      background: rgba(255, 176, 124, 0.06);
      border: 1px dashed rgba(255, 176, 124, 0.25);
      border-radius: 12px;
      padding: 12px 14px;
      margin-bottom: 22px;
      font-family: var(--font-mono, monospace);
      font-size: 0.72rem;
      line-height: 1.5;
      color: #d1c8d8;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .render-chip-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 6px;
      background: rgba(255, 106, 44, 0.2);
      color: #ffb07c;
      font-weight: 600;
    }
    .render-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }
    .render-btn-start {
      background: linear-gradient(135deg, #ff8a4c 0%, #ff521a 100%);
      color: #0d0b10;
      border: none;
      border-radius: 10px;
      padding: 11px 24px;
      font-weight: 600;
      font-size: 0.85rem;
      font-family: var(--font-mono, monospace);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      cursor: pointer;
      box-shadow: 0 4px 18px rgba(255, 106, 44, 0.35);
      transition: all 0.2s;
    }
    .render-btn-start:hover {
      filter: brightness(1.1);
      transform: translateY(-1px);
    }
    .render-btn-cancel {
      background: transparent;
      border: 1px solid rgba(236, 229, 218, 0.2);
      border-radius: 10px;
      color: #9a929e;
      padding: 11px 18px;
      font-size: 0.82rem;
      font-family: var(--font-mono, monospace);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.2s;
    }
    .render-btn-cancel:hover {
      color: #ece5da;
      border-color: rgba(236, 229, 218, 0.4);
    }

    /* Progress Stage */
    .render-progress-view {
      display: none;
      flex-direction: column;
      gap: 16px;
    }
    .render-preview-box {
      width: 100%;
      height: 180px;
      background: #000;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .render-preview-box canvas {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
    .render-preview-box video {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .render-pbar-wrap {
      width: 100%;
      height: 10px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 999px;
      overflow: hidden;
      position: relative;
    }
    .render-pbar-fill {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #ff521a, #ffb07c);
      border-radius: 999px;
      transition: width 0.1s linear;
      box-shadow: 0 0 12px rgba(255, 106, 44, 0.6);
    }
    .render-stat-row {
      display: flex;
      justify-content: space-between;
      font-family: var(--font-mono, monospace);
      font-size: 0.75rem;
      color: #9a929e;
    }
    .render-stat-val {
      color: #ffb07c;
      font-weight: 500;
    }
    .render-finished-view {
      display: none;
      flex-direction: column;
      gap: 16px;
    }
    .render-success-msg {
      background: rgba(56, 189, 248, 0.1);
      border: 1px solid rgba(56, 189, 248, 0.3);
      color: #7dd3fc;
      border-radius: 10px;
      padding: 10px 14px;
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      gap: 10px;
    }
  `;
  document.head.appendChild(style);

  // Inject Render Button in .studio-actions
  function injectButton() {
    const keepGroup = document.querySelector('.studio-actions .act-group:last-child');
    if (!keepGroup || document.getElementById('studio-render-btn')) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn primary btn-render-video';
    btn.id = 'studio-render-btn';
    btn.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
      </svg>
      <span>Render Video (HD/4K)</span>
    `;
    keepGroup.appendChild(btn);

    btn.addEventListener('click', openRenderModal);
  }

  // Create Modal DOM
  let modalBackdrop = null;
  function createModal() {
    modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'render-modal-backdrop';
    modalBackdrop.innerHTML = `
      <div class="render-modal">
        <!-- Settings View -->
        <div class="render-config-view" id="render-config-view">
          <div class="render-head">
            <div>
              <h2>Render <em>High-Quality</em> Video</h2>
              <p>Export this seamless loop in full master resolution directly from your browser.</p>
            </div>
            <button type="button" class="render-close" id="render-close-btn">&times;</button>
          </div>

          <div class="render-grid">
            <div class="render-field">
              <label class="render-label">Resolution</label>
              <select class="render-select" id="rv-res">
                <option value="3840x2160">4K Ultra HD (3840 × 2160)</option>
                <option value="2560x1440">2K QHD (2560 × 1440)</option>
                <option value="1920x1080" selected>1080p Full HD (1920 × 1080)</option>
                <option value="1280x720">720p HD (1280 × 720)</option>
                <option value="screen">Current Screen Size</option>
                <option value="custom">Custom Resolution...</option>
              </select>
            </div>

            <div class="render-field">
              <label class="render-label">Frame Rate (FPS)</label>
              <select class="render-select" id="rv-fps">
                <option value="60" selected>60 FPS (Ultra Smooth)</option>
                <option value="30">30 FPS (Broadcast)</option>
                <option value="24">24 FPS (Cinematic)</option>
              </select>
            </div>

            <div class="render-field" id="rv-custom-res-group" style="display:none; grid-column: 1 / -1;">
              <label class="render-label">Custom Dimensions (W × H)</label>
              <div style="display:flex; gap:10px; align-items:center;">
                <input type="number" class="render-input" id="rv-custom-w" value="1920" min="256" max="7680" style="flex:1;">
                <span style="color:#9a929e;">&times;</span>
                <input type="number" class="render-input" id="rv-custom-h" value="1080" min="256" max="4320" style="flex:1;">
              </div>
            </div>

            <div class="render-field">
              <label class="render-label">Loop Duration (Seconds)</label>
              <input type="number" class="render-input" id="rv-duration" min="2" max="60" step="1" value="10">
            </div>

            <div class="render-field">
              <label class="render-label">Encoding Quality / Bitrate</label>
              <select class="render-select" id="rv-bitrate">
                <option value="50000000">Master / Pro (~50 Mbps)</option>
                <option value="25000000" selected>High Quality (~25 Mbps)</option>
                <option value="12000000">Standard (~12 Mbps)</option>
              </select>
            </div>

            <div class="render-field">
              <label class="render-label">Container Format</label>
              <select class="render-select" id="rv-format">
                <option value="mp4" selected>MP4 (H.264 / AVC - Universal)</option>
                <option value="webm">WebM (VP9)</option>
              </select>
            </div>

            <div class="render-field">
              <label class="render-label">Watermark</label>
              <select class="render-select" id="rv-watermark">
                <option value="none" selected>Clean (No Watermark)</option>
                <option value="mark">Include Brand Mark</option>
              </select>
            </div>
          </div>

          <div class="render-chip-summary" id="render-summary">
            <span>Ready to render: <strong id="rv-sum-text">1920 × 1080 @ 60 FPS (600 frames)</strong></span>
            <span class="render-chip-badge" id="rv-encoder-badge">WebCodecs Hardware</span>
          </div>

          <div class="render-actions">
            <button type="button" class="render-btn-cancel" id="render-cancel-btn">Cancel</button>
            <button type="button" class="render-btn-start" id="render-start-btn">Start Rendering</button>
          </div>
        </div>

        <!-- In-Progress View -->
        <div class="render-progress-view" id="render-progress-view">
          <div class="render-head">
            <div>
              <h2>Rendering <em>Loop</em>...</h2>
              <p id="rv-prog-subtitle">Encoding frame-by-frame for 100% flawless loop seam and zero frame drops.</p>
            </div>
          </div>

          <div class="render-preview-box">
            <canvas id="rv-mini-preview" width="320" height="180"></canvas>
          </div>

          <div class="render-pbar-wrap">
            <div class="render-pbar-fill" id="rv-pbar"></div>
          </div>

          <div class="render-stat-row">
            <span>Progress: <span class="render-stat-val" id="rv-stat-pct">0%</span></span>
            <span>Frames: <span class="render-stat-val" id="rv-stat-frames">0 / 0</span></span>
            <span>ETA: <span class="render-stat-val" id="rv-stat-eta">Calculating...</span></span>
          </div>

          <div class="render-actions">
            <button type="button" class="render-btn-cancel" id="render-abort-btn">Abort Render</button>
          </div>
        </div>

        <!-- Finished View -->
        <div class="render-finished-view" id="render-finished-view">
          <div class="render-head">
            <div>
              <h2>Render <em>Complete!</em></h2>
              <p>Your seamless worship loop is ready.</p>
            </div>
            <button type="button" class="render-close" id="render-done-close">&times;</button>
          </div>

          <div class="render-preview-box">
            <video id="rv-result-video" controls autoplay loop playsinline></video>
          </div>

          <div class="render-success-msg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span id="rv-finish-details">Rendered seamlessly: 1920 &times; 1080 @ 60 FPS</span>
          </div>

          <div class="render-actions">
            <button type="button" class="render-btn-cancel" id="render-again-btn">Render Another</button>
            <a class="render-btn-start" id="render-download-link" download style="text-decoration:none; display:inline-flex; align-items:center; gap:8px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download Video
            </a>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modalBackdrop);

    // Bind UI Events
    bindModalEvents();
  }

  let abortController = null;
  let isAborted = false;

  function bindModalEvents() {
    const closeBtns = [
      document.getElementById('render-close-btn'),
      document.getElementById('render-cancel-btn'),
      document.getElementById('render-done-close')
    ];
    closeBtns.forEach(b => {
      if (b) b.addEventListener('click', closeRenderModal);
    });

    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop && !abortController) {
        closeRenderModal();
      }
    });

    const resSelect = document.getElementById('rv-res');
    const customGroup = document.getElementById('rv-custom-res-group');
    resSelect.addEventListener('change', () => {
      customGroup.style.display = resSelect.value === 'custom' ? 'flex' : 'none';
      updateSummary();
    });

    document.getElementById('rv-fps').addEventListener('change', updateSummary);
    document.getElementById('rv-duration').addEventListener('input', updateSummary);
    document.getElementById('rv-custom-w').addEventListener('input', updateSummary);
    document.getElementById('rv-custom-h').addEventListener('input', updateSummary);

    document.getElementById('render-start-btn').addEventListener('click', executeRender);
    document.getElementById('render-abort-btn').addEventListener('click', () => {
      isAborted = true;
    });
    document.getElementById('render-again-btn').addEventListener('click', () => {
      showView('config');
    });
  }

  function showView(view) {
    document.getElementById('render-config-view').style.display = view === 'config' ? 'block' : 'none';
    document.getElementById('render-progress-view').style.display = view === 'progress' ? 'flex' : 'none';
    document.getElementById('render-finished-view').style.display = view === 'finished' ? 'flex' : 'none';
  }

  function getTargetResolution() {
    const val = document.getElementById('rv-res').value;
    if (val === 'custom') {
      const w = parseInt(document.getElementById('rv-custom-w').value, 10) || 1920;
      const h = parseInt(document.getElementById('rv-custom-h').value, 10) || 1080;
      return { w: w % 2 === 0 ? w : w + 1, h: h % 2 === 0 ? h : h + 1 };
    }
    if (val === 'screen') {
      const s = window.__studio ? window.__studio.get() : { w: 1920, h: 1080 };
      const w = s.w || 1920;
      const h = s.h || 1080;
      return { w: w % 2 === 0 ? w : w + 1, h: h % 2 === 0 ? h : h + 1 };
    }
    const [w, h] = val.split('x').map(n => parseInt(n, 10));
    return { w, h };
  }

  function updateSummary() {
    const { w, h } = getTargetResolution();
    const fps = parseInt(document.getElementById('rv-fps').value, 10) || 60;
    const duration = parseFloat(document.getElementById('rv-duration').value) || 10;
    const totalFrames = Math.round(duration * fps);

    const sumEl = document.getElementById('rv-sum-text');
    if (sumEl) {
      sumEl.textContent = `${w} × ${h} @ ${fps} FPS • ${duration.toFixed(1)}s Loop (${totalFrames} frames)`;
    }

    const hasWebCodecs = typeof window.VideoEncoder !== 'undefined' && typeof window.Mp4Muxer !== 'undefined';
    const badge = document.getElementById('rv-encoder-badge');
    if (badge) {
      badge.textContent = hasWebCodecs ? 'WebCodecs GPU Muxer' : 'MediaRecorder Fallback';
      badge.style.background = hasWebCodecs ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 176, 124, 0.2)';
      badge.style.color = hasWebCodecs ? '#4ade80' : '#ffb07c';
    }
  }

  function openRenderModal() {
    if (!modalBackdrop) createModal();

    if (window.__studio) {
      const s = window.__studio.get();
      if (s && s.loop) {
        document.getElementById('rv-duration').value = s.loop;
      }
    }

    updateSummary();
    showView('config');
    modalBackdrop.classList.add('active');
  }

  function closeRenderModal() {
    if (abortController) {
      isAborted = true;
    }
    if (modalBackdrop) {
      modalBackdrop.classList.remove('active');
    }
  }

  // Core Render Execution
  async function executeRender() {
    if (!window.__studio) {
      alert("Studio is still initializing. Please wait a moment.");
      return;
    }

    const { w, h } = getTargetResolution();
    const fps = parseInt(document.getElementById('rv-fps').value, 10) || 60;
    const duration = parseFloat(document.getElementById('rv-duration').value) || 10;
    const bitrate = parseInt(document.getElementById('rv-bitrate').value, 10) || 25000000;
    const format = document.getElementById('rv-format').value;
    const totalFrames = Math.round(duration * fps);

    const s = window.__studio.get();
    const lookName = (window.__studio.LOOKS && window.__studio.LOOKS[s.look]) ? window.__studio.LOOKS[s.look].replace(/[^a-zA-Z0-9_-]/g, '') : `Look-${s.look}`;

    showView('progress');
    isAborted = false;
    abortController = true;

    const pbar = document.getElementById('rv-pbar');
    const statPct = document.getElementById('rv-stat-pct');
    const statFrames = document.getElementById('rv-stat-frames');
    const statEta = document.getElementById('rv-stat-eta');
    const miniCv = document.getElementById('rv-mini-preview');
    const miniCtx = miniCv.getContext('2d');

    const startTime = performance.now();

    // Pause normal preview loop
    window.__studio.pausePreview();

    // Set canvas to high export resolution
    window.__studio.setRenderResolution(w, h);

    try {
      const hasWebCodecs = typeof window.VideoEncoder !== 'undefined' && typeof window.Mp4Muxer !== 'undefined' && format === 'mp4';

      let videoBlob = null;

      if (hasWebCodecs) {
        // --- WebCodecs + MP4Muxer ---
        videoBlob = await renderWithWebCodecs({
          w, h, fps, duration, totalFrames, bitrate,
          onProgress: (frameIdx) => {
            const pct = Math.round((frameIdx / totalFrames) * 100);
            pbar.style.width = `${pct}%`;
            statPct.textContent = `${pct}%`;
            statFrames.textContent = `${frameIdx} / ${totalFrames}`;

            const elapsed = (performance.now() - startTime) / 1000;
            const avgPerFrame = elapsed / Math.max(1, frameIdx);
            const remaining = Math.round((totalFrames - frameIdx) * avgPerFrame);
            statEta.textContent = `${remaining}s remaining`;

            // Draw mini preview
            miniCtx.drawImage(window.__studio.cv, 0, 0, miniCv.width, miniCv.height);
          }
        });
      } else {
        // --- Universal MediaRecorder Fallback ---
        videoBlob = await renderWithMediaRecorder({
          w, h, fps, duration, totalFrames, bitrate, format,
          onProgress: (frameIdx) => {
            const pct = Math.round((frameIdx / totalFrames) * 100);
            pbar.style.width = `${pct}%`;
            statPct.textContent = `${pct}%`;
            statFrames.textContent = `${frameIdx} / ${totalFrames}`;
            miniCtx.drawImage(window.__studio.cv, 0, 0, miniCv.width, miniCv.height);
          }
        });
      }

      if (isAborted || !videoBlob) {
        showView('config');
        return;
      }

      // Restore preview
      window.__studio.restoreSize();
      window.__studio.resumePreview();

      // Show completion view
      const videoUrl = URL.createObjectURL(videoBlob);
      const resVideo = document.getElementById('rv-result-video');
      resVideo.src = videoUrl;

      const filename = `AltarLoops-${lookName}-${w}x${h}-${fps}fps.${format}`;
      const dlLink = document.getElementById('render-download-link');
      dlLink.href = videoUrl;
      dlLink.download = filename;

      const sizeMb = (videoBlob.size / (1024 * 1024)).toFixed(1);
      document.getElementById('rv-finish-details').textContent =
        `${filename} • ${sizeMb} MB • ${w} × ${h} @ ${fps} FPS`;

      showView('finished');

      // Auto trigger download for seamless UX
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

    } catch (err) {
      console.error("Render failed:", err);
      alert("Render encountered an error: " + (err.message || err));
      window.__studio.restoreSize();
      window.__studio.resumePreview();
      showView('config');
    } finally {
      abortController = null;
    }
  }

  // WebCodecs frame-by-frame implementation
  async function renderWithWebCodecs({ w, h, fps, duration, totalFrames, bitrate, onProgress }) {
    const muxer = new window.Mp4Muxer.Muxer({
      target: new window.Mp4Muxer.ArrayBufferTarget(),
      video: {
        codec: 'avc',
        width: w,
        height: h
      },
      fastStart: 'in-memory'
    });

    let encoderError = null;
    const encoder = new VideoEncoder({
      output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
      error: (e) => {
        encoderError = e;
        console.error("VideoEncoder error:", e);
      }
    });

    // Check supported codec profiles
    const candidateCodecs = [
      'avc1.640033', // High Profile Level 5.1 (up to 4K 60fps)
      'avc1.4d002a', // Main Profile Level 4.2 (1080p 60fps)
      'avc1.42e01f'  // Baseline Level 3.1
    ];

    let selectedCodec = candidateCodecs[0];
    for (const c of candidateCodecs) {
      const config = { codec: c, width: w, height: h, bitrate, framerate: fps };
      try {
        const support = await VideoEncoder.isConfigSupported(config);
        if (support.supported) {
          selectedCodec = c;
          break;
        }
      } catch (e) {}
    }

    encoder.configure({
      codec: selectedCodec,
      width: w,
      height: h,
      bitrate: bitrate,
      framerate: fps,
      hardwareAcceleration: 'prefer-hardware'
    });

    const cv = window.__studio.cv;

    for (let i = 0; i < totalFrames; i++) {
      if (isAborted) {
        encoder.close();
        return null;
      }

      // Exact periodic phase in [0, 1)
      const ph = i / totalFrames;

      // Render deterministic frame
      window.__studio.renderFrame(ph);

      // Create VideoFrame directly from WebGL canvas
      const timestampUs = Math.round((i * 1_000_000) / fps);
      const durationUs = Math.round(1_000_000 / fps);

      const frame = new VideoFrame(cv, {
        timestamp: timestampUs,
        duration: durationUs
      });

      const isKeyFrame = i % (fps * 2) === 0;
      encoder.encode(frame, { keyFrame: isKeyFrame });
      frame.close();

      onProgress(i + 1);

      // Yield every frame or 2 frames to avoid freezing browser UI and keep GPU fed
      if (i % 2 === 0) {
        await new Promise(r => setTimeout(r, 0));
      }
    }

    if (encoderError) throw encoderError;

    await encoder.flush();
    muxer.finalize();

    const buffer = muxer.target.buffer;
    return new Blob([buffer], { type: 'video/mp4' });
  }

  // MediaRecorder Fallback implementation
  async function renderWithMediaRecorder({ w, h, fps, duration, totalFrames, bitrate, format, onProgress }) {
    const cv = window.__studio.cv;
    const stream = cv.captureStream(fps);

    let mimeType = 'video/webm;codecs=vp9';
    if (format === 'mp4' && MediaRecorder.isTypeSupported('video/mp4;codecs=avc1')) {
      mimeType = 'video/mp4;codecs=avc1';
    } else if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
    }

    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: bitrate
    });

    const chunks = [];
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    recorder.start(100);

    const frameDurationMs = 1000 / fps;

    for (let i = 0; i < totalFrames; i++) {
      if (isAborted) {
        recorder.stop();
        return null;
      }
      const ph = i / totalFrames;
      window.__studio.renderFrame(ph);
      onProgress(i + 1);
      await new Promise(r => setTimeout(r, frameDurationMs));
    }

    return new Promise((resolve) => {
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        resolve(blob);
      };
      recorder.stop();
    });
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectButton);
  } else {
    injectButton();
  }

  window.__openRenderVideo = openRenderModal;
})();
