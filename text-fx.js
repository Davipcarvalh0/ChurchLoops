/* Altar Text treatments (test build): 30 animated text treatments drawn on a 2D canvas, then passed through a WebGL shader
   that does the fluid on and off animations. The flow is curl-noise advection: it moves like smoke, ink and water, and it's
   exact math of (position, progress), so it can be scrubbed and rendered frame by frame. It is not a physics simulation. */
(function () {
  "use strict";
  var TAU = Math.PI * 2;
  function hash(n) { var x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function smooth(a, b, x) { var t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }

  // ---- text helpers: every glyph and repeated line is cached as an image, so thousands of words stay smooth
  function Kit(ctx, e) { this.c = ctx; this.e = e; this.g = {}; this.st = {}; this.gn = 0; this.sn = 0; }
  Kit.prototype.font = function (px) { var f = this.e.fontSpec; return (f[2] ? f[2] + " " : "") + f[1] + " " + px + 'px "' + f[0] + '", Georgia, serif'; };
  Kit.prototype.glyph = function (ch, px, color) {
    var k = ch + "|" + Math.round(px) + "|" + color + "|" + this.e.fontKey, o = this.g[k]; if (o) return o; if (++this.gn > 1200) { this.g = {}; this.gn = 0; }
    var cv = document.createElement("canvas"), x = cv.getContext("2d"), f = this.font(px); x.font = f; var w = Math.max(1, x.measureText(ch).width), pad = Math.ceil(px * 0.3);
    cv.width = Math.ceil(w + pad * 2); cv.height = Math.ceil(px * 1.7); x = cv.getContext("2d"); x.font = f; x.textBaseline = "alphabetic"; x.fillStyle = color; x.fillText(ch, pad, px * 1.2);
    o = this.g[k] = { cv: cv, w: w, pad: pad, base: px * 1.2 }; return o;
  };
  Kit.prototype.strip = function (text, px, color, gap) {
    var k = text + "|" + Math.round(px) + "|" + color + "|" + gap + "|" + this.e.fontKey, o = this.st[k]; if (o) return o; if (++this.sn > 300) { this.st = {}; this.sn = 0; }
    var x = document.createElement("canvas").getContext("2d"), f = this.font(px); x.font = f; var w = Math.ceil(x.measureText(text).width + gap), cv = document.createElement("canvas");
    cv.width = Math.max(2, w); cv.height = Math.ceil(px * 1.6); x = cv.getContext("2d"); x.font = f; x.textBaseline = "alphabetic"; x.fillStyle = color; x.fillText(text, 0, px * 1.18);
    o = this.st[k] = { cv: cv, w: w, h: cv.height, base: px * 1.18 }; return o;
  };
  // a line repeated across a width, sliding by `off`; y is the text baseline
  Kit.prototype.row = function (text, y, px, off, alpha, color, W, x0) {
    var s = this.strip(text, px, color || this.e.fg, px * 0.45), c = this.c, W2 = W || this.e.W, X = x0 || 0, o = ((off % s.w) + s.w) % s.w;
    c.globalAlpha = alpha == null ? 1 : alpha;
    for (var x = X - o; x < X + W2; x += s.w) c.drawImage(s.cv, x, y - s.base);
    c.globalAlpha = 1;
  };
  // letters along a path: pt(s) returns [x, y, angle]; s runs from a to b
  Kit.prototype.along = function (text, px, pt, a, b, alpha, color, off, track) {
    off = off || 0; var c = this.c, col = color || this.e.fg, adv = [], tot = 0, i, tr = (track || 0) * px, chars = text.split("");
    for (i = 0; i < chars.length; i++) { var g = this.glyph(chars[i], px, col); adv.push(g.w + tr); tot += g.w + tr; }
    if (!tot) return; var s = a - (((off % tot) + tot) % tot), n = 0; c.globalAlpha = alpha == null ? 1 : alpha;
    while (s < b && n++ < 4000) { for (i = 0; i < chars.length && s < b; i++) { if (s >= a - px) { var q = pt(s + adv[i] / 2); if (q) { var G = this.glyph(chars[i], px, col); c.setTransform(q[3] || this.e.k, 0, 0, q[3] || this.e.k, q[0] * this.e.k, q[1] * this.e.k); c.rotate(q[2]); c.translate(-G.w / 2 - G.pad, -G.base + px * 0.34); if (q[4] != null) c.globalAlpha = q[4] * (alpha == null ? 1 : alpha); c.drawImage(G.cv, 0, 0); } } s += adv[i]; } }
    c.setTransform(this.e.k, 0, 0, this.e.k, 0, 0); c.globalAlpha = 1;
  };
  // the ink box of a word at 100px: lets big words center on their letters, not the line box
  Kit.prototype.ink = function (t) { var x = this.c; x.save(); x.font = this.font(100); var m = x.measureText(t); x.restore(); return { l: m.actualBoundingBoxLeft, r: m.actualBoundingBoxRight, a: m.actualBoundingBoxAscent, d: m.actualBoundingBoxDescent, w: m.width }; };
  Kit.prototype.fit = function (t, fw, fh) { var m = this.ink(t); return Math.min(fw * this.e.W / Math.max(1, m.l + m.r), fh * this.e.H / Math.max(1, m.a + m.d)) * this.e.size * 100; };
  Kit.prototype.big = function (t, px, x, y, color, alpha) { var c = this.c, m = this.ink(t), k = px / 100; c.font = this.font(px); c.textBaseline = "alphabetic"; c.fillStyle = color || this.e.fg; c.globalAlpha = alpha == null ? 1 : alpha; c.fillText(t, x + (m.l - m.r) / 2 * k, y + (m.a - m.d) / 2 * k); c.globalAlpha = 1; };
  Kit.prototype.chars = function (t, px, track) { var c = this.c, out = [], x = 0, a = t.split(""); c.save(); c.font = this.font(px); for (var i = 0; i < a.length; i++) { var w = c.measureText(a[i]).width; out.push({ ch: a[i], x: x, w: w }); x += w + track * px; } c.restore(); return { list: out, w: x - track * px }; };
  function word(e, hold) { var L = e.lines; return L[Math.floor(e.t / (hold || 2.4)) % L.length]; }
  function all(e) { return e.lines.join("  ·  "); }

  // ---- the 30 treatments. e: W, H, t (seconds, follows Speed), lines, size, dens, amt (0..1), space, fg, ac
  var T = [];
  function add(name, cat, amtLabel, draw) { T.push({ name: name, cat: cat, amt: amtLabel, draw: draw }); }

  add("Word Rows", "Word walls", "Light wave", function (K, e) { var R = Math.round(6 + e.dens * 34), rh = e.H / R, px = rh * (0.72 + e.space * 0.2) * e.size, i;
    for (i = 0; i < R; i++) { var dir = i % 2 ? 1 : -1, sp = 30 + 30 * hash(i), a = 1 - e.amt * 0.85 * (0.5 + 0.5 * Math.sin(i * 0.55 - e.t * 0.9)); K.row(e.lines[i % e.lines.length], (i + 0.74) * rh, px, e.t * sp * dir + i * 90, a); } });
  add("Arch Wall", "Word walls", "Opening", function (K, e) { var R = Math.round(6 + e.dens * 22), px = (22 + 36 * (1 - e.dens)) * e.size, st = px * 1.12, R0 = 110 + e.amt * 260, base = e.H + 30, yc = e.H * 0.55, cx = e.W / 2;
    for (var i = 0; i < R; i++) { var rd = R0 + i * st, leg = base - yc, arc = Math.PI * rd, tot = leg * 2 + arc, a = 1 - i / R * 0.55; var pt = function (s) { if (s < leg) return [cx - rd, base - s, -Math.PI / 2]; if (s < leg + arc) { var f = (s - leg) / rd; return [cx - Math.cos(f) * rd, yc - Math.sin(f) * rd, f - Math.PI / 2]; } return [cx + rd, yc + (s - leg - arc), Math.PI / 2]; }; K.along(e.lines[i % e.lines.length] + "   ", px, pt, 0, tot, a, null, e.t * (i % 2 ? 26 : -26), 0.04); } });
  add("Twin Pillars", "Word walls", "Pillar gap", function (K, e) { var C = Math.round(2 + e.dens * 6), px = (28 + 26 * (1 - e.dens)) * e.size, st = px * 1.18, gap = e.W * (0.14 + e.amt * 0.42), x, i;
    [-1, 1].forEach(function (s) { for (i = 0; i < C; i++) { x = e.W / 2 + s * (gap / 2 + i * st + st / 2); var lx = x, a = 1 - i / C * 0.5, up = (s > 0) === (i % 2 === 0) ? 1 : -1; K.along(e.lines[(i + (s > 0 ? 3 : 0)) % e.lines.length] + "   ", px, function (q) { return [lx, e.H - q, -Math.PI / 2]; }, -20, e.H + 20, a, null, e.t * 34 * up, 0.04); } }); });
  add("Column Field", "Word walls", "Stagger", function (K, e) { var C = Math.round(5 + e.dens * 22), st = e.W / C, px = st * 0.72 * e.size, i; for (i = 0; i < C; i++) { var x = (i + 0.5) * st, up = i % 2 ? 1 : -1, a = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(i * 0.8 + e.t)); K.along(e.lines[i % e.lines.length] + "   ", px, (function (lx) { return function (q) { return [lx, e.H - q, -Math.PI / 2]; }; })(x), -20, e.H + 20, a, null, e.t * 40 * up + i * e.amt * 200, 0.03); } });
  add("Sweep Wall", "Word walls", "Beam width", function (K, e) { var R = Math.round(6 + e.dens * 24), rh = e.H / R, px = rh * 0.76 * e.size, cx = (0.5 + 0.48 * Math.sin(e.t * 0.5)) * e.W, cy = (0.5 + 0.35 * Math.cos(e.t * 0.37)) * e.H, c = K.c, i; for (i = 0; i < R; i++) K.row(e.lines[i % e.lines.length], (i + 0.74) * rh, px, e.t * 10 * (i % 2 ? 1 : -1) + i * 70, 0.12);
    var rad = e.W * (0.14 + e.amt * 0.42); c.save(); c.beginPath(); for (var y = 0; y < 2; y++) { } c.arc(cx, cy, rad, 0, TAU); c.clip(); for (i = 0; i < R; i++) K.row(e.lines[i % e.lines.length], (i + 0.74) * rh, px, e.t * 10 * (i % 2 ? 1 : -1) + i * 70, 1); c.restore(); });
  add("Flicker Wall", "Word walls", "Flicker", function (K, e) { var R = Math.round(6 + e.dens * 24), rh = e.H / R, px = rh * 0.74 * e.size, i, j; var tick = Math.floor(e.t * 9); for (i = 0; i < R; i++) { var txt = e.lines[i % e.lines.length], s = K.strip(txt, px, e.fg, px * 0.45), n = Math.ceil(e.W / s.w) + 1, off = (i * 83) % s.w; for (j = 0; j < n; j++) { var hv = hash(i * 31 + j * 7 + Math.floor((tick + hash(i + j) * 40) / 7) * 3.3), a = 1 - e.amt * (hv > 0.6 ? 0.88 : hv > 0.25 ? 0.42 : 0); K.c.globalAlpha = a; K.c.drawImage(s.cv, j * s.w - off, (i + 0.74) * rh - s.base); } } K.c.globalAlpha = 1; });
  add("Halo Rings", "Rings and depth", "Inner size", function (K, e) { var R = Math.round(3 + e.dens * 11), px = (24 + 26 * (1 - e.dens)) * e.size, st = px * 1.24, R0 = 70 + e.amt * 300, cx = e.W / 2, cy = e.H / 2, i; for (i = 0; i < R; i++) { var rd = R0 + i * st, circ = TAU * rd, a = 1 - i / R * 0.6; K.along(e.lines[i % e.lines.length] + "   ", px, (function (q) { return function (s) { var f = s / q; return [cx + Math.cos(f) * q, cy + Math.sin(f) * q, f + Math.PI / 2]; }; })(rd), 0, circ, a, null, e.t * (i % 2 ? 22 : -22), 0.04); } });
  add("Echo Stack", "Big type", "Echo spread", function (K, e) { var w = word(e, 3), px = K.fit(w, 0.82, 0.34), N = Math.round(3 + e.dens * 9), i, c = K.c; c.lineWidth = Math.max(1, px * 0.008); for (i = N; i >= 1; i--) { var y = e.H / 2 + Math.sin(e.t * 1.2 - i * 0.5) * i * px * 0.1 * (0.4 + e.amt * 1.8), m = K.ink(w), k = px / 100; c.font = K.font(px); c.textBaseline = "alphabetic"; c.strokeStyle = e.fg; c.globalAlpha = (1 - i / (N + 1)) * 0.7; c.strokeText(w, e.W / 2 + (m.l - m.r) / 2 * k, y + (m.a - m.d) / 2 * k); } c.globalAlpha = 1; K.big(w, px, e.W / 2, e.H / 2); });
  add("Filled Line Chase", "Big type", "Outline weight", function (K, e) { var R = Math.round(3 + e.dens * 8), rh = e.H / R, c = K.c, w = word(e, 5), i, act = Math.floor(e.t * 1.6) % R; for (i = 0; i < R; i++) { var px = rh * 0.86 * e.size, s = K.strip(w, px, e.fg, px * 0.5), off = (e.t * 34 * (i % 2 ? 1 : -1) + i * 80), o = ((off % s.w) + s.w) % s.w, x, y = (i + 0.76) * rh; c.font = K.font(px); c.textBaseline = "alphabetic"; c.lineWidth = 0.6 + e.amt * 3.5; c.strokeStyle = e.fg; if (i === act) { for (x = -o; x < e.W; x += s.w) c.drawImage(s.cv, x, y - s.base); } else { c.globalAlpha = 0.55; for (x = -o; x < e.W; x += s.w) c.strokeText(w, x, y); c.globalAlpha = 1; } } });
  add("Liquid Word", "Big type", "Flow", function (K, e) { var w = word(e, 3.6), px = K.fit(w, 0.82, 0.62); K.big(w, px, e.W / 2, e.H / 2); e.warp = 0.15 + e.amt * 0.85; });
  add("Light Through", "Big type", "Beam width", function (K, e) { var w = word(e, 4), px = K.fit(w, 0.84, 0.62), c = K.c; K.big(w, px, e.W / 2, e.H / 2, null, 0.16); var bx = (0.5 + 0.62 * Math.sin(e.t * 0.7)) * e.W, bw = e.W * (0.08 + e.amt * 0.4), g = c.createLinearGradient(bx - bw, 0, bx + bw, 0); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(0.5, "#fff"); g.addColorStop(1, "rgba(0,0,0,0)"); var tmp = K.tmp || (K.tmp = document.createElement("canvas")); tmp.width = c.canvas.width; tmp.height = c.canvas.height; var x = tmp.getContext("2d"); x.setTransform(e.k, 0, 0, e.k, 0, 0); var keep = K.c; K.c = x; K.big(w, px, e.W / 2, e.H / 2, e.ac); K.c = keep; x.globalCompositeOperation = "destination-in"; x.fillStyle = g; x.fillRect(0, 0, e.W, e.H); c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(tmp, 0, 0); c.restore(); });
  add("Neon Tube", "Big type", "Buzz", function (K, e) { var w = word(e, 4.5), px = K.fit(w, 0.82, 0.58), c = K.c, m = K.ink(w), k = px / 100, x = e.W / 2 + (m.l - m.r) / 2 * k, y = e.H / 2 + (m.a - m.d) / 2 * k, buzz = 1 - e.amt * (hash(Math.floor(e.t * 22)) > 0.84 ? 0.7 : 0.06 * (0.5 + 0.5 * Math.sin(e.t * 19))); c.font = K.font(px); c.textBaseline = "alphabetic"; c.lineJoin = "round"; c.globalAlpha = 0.28 * buzz; c.strokeStyle = e.ac; c.lineWidth = px * 0.05; c.strokeText(w, x, y); c.globalAlpha = buzz; c.lineWidth = Math.max(1.5, px * 0.012); c.strokeStyle = e.fg; c.strokeText(w, x, y); c.globalAlpha = 1; e.glowAdd = 0.5; });
  add("Letter Rain", "Particles", "Trail", function (K, e) { var C = Math.round(8 + e.dens * 62), st = e.W / C, px = st * 0.92 * e.size, txt = all(e).replace(/\s+/g, ""), i, j; for (i = 0; i < C; i++) { var sp = 90 + hash(i) * 180, head = ((e.t * sp + hash(i + 7) * 3000) % (e.H * 1.8)), tl = Math.round(4 + e.amt * 20); for (j = 0; j < tl; j++) { var y = head - j * px * 1.02; if (y < -px || y > e.H + px) continue; var chi = txt[Math.floor(hash(i * 13 + Math.floor((y + 4000) / (px * 1.02))) * txt.length)], G = K.glyph(chi, px, j === 0 ? e.ac : e.fg); K.c.globalAlpha = j === 0 ? 1 : (1 - j / tl) * 0.8; K.c.drawImage(G.cv, i * st + st / 2 - G.w / 2 - G.pad, y - G.base); } } K.c.globalAlpha = 1; });
  add("Tile Flip", "Particles", "Wave speed", function (K, e) { var L = all(e).replace(/\s*·\s*/g, " ").toUpperCase(), Cl = Math.round(6 + e.dens * 22), rows = Math.round(Cl * e.H / e.W), cw = e.W / Cl, ch = e.H / rows, px = Math.min(cw, ch) * 0.72 * e.size, c = K.c, i, j, n = 0; for (j = 0; j < rows; j++) for (i = 0; i < Cl; i++, n++) { var q = L[n % L.length]; if (q === " ") continue; var ph = Math.sin((i + j) * 0.4 - e.t * (0.8 + e.amt * 3)), fl = Math.abs(ph); var G = K.glyph(q, px, ph > 0 ? e.fg : e.ac); c.save(); c.translate(i * cw + cw / 2, j * ch + ch / 2); c.scale(Math.max(0.03, fl), 1); c.drawImage(G.cv, -G.w / 2 - G.pad, -G.base + px * 0.36); c.restore(); } });
  add("Crossed Ribbons", "Word walls", "Angle", function (K, e) { var c = K.c, N = Math.round(1 + e.dens * 5), px = (46 + 50 * (1 - e.dens)) * e.size, hh = px * 1.5, ang = (0.12 + e.amt * 0.5), D = Math.hypot(e.W, e.H); [1, -1].forEach(function (sg, q) { for (var i = 0; i < N; i++) { c.save(); c.translate(e.W / 2, e.H / 2); c.rotate(ang * sg); c.translate(-D / 2, (i - (N - 1) / 2) * hh * 1.5); c.fillStyle = q ? e.ac : e.fg; c.globalAlpha = 0.14; c.fillRect(0, -hh / 2, D, hh); c.globalAlpha = 1; var off = e.t * 60 * (i % 2 ? sg : -sg); K.row(e.lines[(i + q * 2) % e.lines.length], px * 0.36, px, off, 1, null, D, 0); c.restore(); } }); });


  // ---- word walls, round two (2026-11-04): more of the first four. rows() draws R rows of the lines, sliding; cuts and clips shape them.
  function rows(K, e, R, f) { var rh = e.H / R, px = rh * 0.72 * e.size; for (var i = 0; i < R; i++) { var o = f ? f(i, rh, px) : {}; if (o === false) continue; K.row(e.lines[((o.line != null ? o.line : i) % e.lines.length + e.lines.length) % e.lines.length], (i + 0.74) * rh, o.px || px, o.off != null ? o.off : e.t * 22 * (i % 2 ? 1 : -1) + i * 90, o.alpha == null ? 1 : o.alpha, o.color); } }
  function col(K, e, x, text, px, alpha, off, color) { K.along(text + "   ", px, function (q) { return [x, e.H - q, -Math.PI / 2]; }, -20, e.H + 20, alpha, color, off, 0.04); }
  add("Brick Wall", "Word walls", "Light wave", function (K, e) { var R = Math.round(6 + e.dens * 30); rows(K, e, R, function (i, rh, px) { var s = K.strip(e.lines[i % e.lines.length], px, e.fg, px * 0.45); return { off: e.t * 14 * (i % 2 ? 1 : -1) + (i % 2) * s.w / 2, alpha: 1 - e.amt * 0.6 * (0.5 + 0.5 * Math.sin(i * 0.7 - e.t * 0.8)) }; }); });
  add("Cross Wall", "Word walls", "Arm width", function (K, e) { var R = Math.round(8 + e.dens * 28), c = K.c; rows(K, e, R, function () { return { alpha: 0.14 }; }); var aw = e.W * (0.06 + e.amt * 0.16), ah = e.H * (0.06 + e.amt * 0.16); c.save(); c.beginPath(); c.rect(e.W / 2 - aw / 2, 0, aw, e.H); c.rect(0, e.H * 0.42 - ah / 2, e.W, ah); c.clip(); rows(K, e, R); c.restore(); });
  add("Circle Void", "Word walls", "Opening", function (K, e) { var R = Math.round(8 + e.dens * 28); rows(K, e, R); var c = K.c, r = e.H * (0.12 + e.amt * 0.35); c.save(); c.globalCompositeOperation = "destination-out"; var g = c.createRadialGradient(e.W / 2, e.H / 2, r * 0.86, e.W / 2, e.H / 2, r); g.addColorStop(0, "rgba(0,0,0,1)"); g.addColorStop(1, "rgba(0,0,0,0)"); c.fillStyle = g; c.fillRect(0, 0, e.W, e.H); c.restore(); });
  add("Diamond Void", "Word walls", "Opening", function (K, e) { var R = Math.round(8 + e.dens * 28); rows(K, e, R); var c = K.c, r = e.H * (0.15 + e.amt * 0.4); c.save(); c.globalCompositeOperation = "destination-out"; c.beginPath(); c.moveTo(e.W / 2, e.H / 2 - r); c.lineTo(e.W / 2 + r * 1.1, e.H / 2); c.lineTo(e.W / 2, e.H / 2 + r); c.lineTo(e.W / 2 - r * 1.1, e.H / 2); c.closePath(); c.fillStyle = "#000"; c.fill(); c.restore(); });
  add("Window Wall", "Word walls", "Window", function (K, e) { var R = Math.round(8 + e.dens * 28); rows(K, e, R); var c = K.c, w = e.W * (0.2 + e.amt * 0.45), h = w * 9 / 16; c.save(); c.globalCompositeOperation = "destination-out"; c.fillStyle = "#000"; c.fillRect(e.W / 2 - w / 2, e.H / 2 - h / 2, w, h); c.restore(); });
  add("Checker Wall", "Word walls", "Contrast", function (K, e) { var R = Math.round(6 + e.dens * 24), rh = e.H / R, px = rh * 0.72 * e.size, c = K.c, ph = Math.floor(e.t * 0.8) % 2, i, j; for (i = 0; i < R; i++) { var s = K.strip(e.lines[i % e.lines.length], px, e.fg, px * 0.45), n = Math.ceil(e.W / s.w) + 2, o = (i * 70) % s.w; for (j = 0; j < n; j++) { c.globalAlpha = ((i + j + ph) % 2) ? 1 : 1 - e.amt * 0.85; c.drawImage(s.cv, j * s.w - o, (i + 0.74) * rh - s.base); } } c.globalAlpha = 1; });
  add("Stacked Blocks", "Word walls", "Outline weight", function (K, e) { var R = Math.round(3 + e.dens * 7), rh = e.H / R, c = K.c, i, x; for (i = 0; i < R; i++) { var L = e.lines[i % e.lines.length], px = rh * 0.84 * e.size, s = K.strip(L, px, e.fg, px * 0.5), off = e.t * 26 * (i % 2 ? 1 : -1) + i * 120, o = ((off % s.w) + s.w) % s.w, y = (i + 0.76) * rh; if (i % 2 === 0) { for (x = -o; x < e.W; x += s.w) c.drawImage(s.cv, x, y - s.base); } else { c.font = K.font(px); c.textBaseline = "alphabetic"; c.lineWidth = 0.5 + e.amt * 4; c.strokeStyle = e.fg; for (x = -o; x < e.W; x += s.w) c.strokeText(L, x, y); } } });
  add("Tilted Wall", "Word walls", "Angle", function (K, e) { var c = K.c, ang = -(0.1 + e.amt * 0.5), D = Math.hypot(e.W, e.H), R = Math.round(8 + e.dens * 30), rh = D / R, px = rh * 0.72 * e.size, i; c.save(); c.translate(e.W / 2, e.H / 2); c.rotate(ang); for (i = 0; i < R; i++) K.row(e.lines[i % e.lines.length], (i + 0.74) * rh - D / 2, px, e.t * 22 * (i % 2 ? 1 : -1) + i * 90, 1, null, D, -D / 2); c.restore(); });
  add("Horizon Wall", "Word walls", "Horizon", function (K, e) { var hz = e.H * (0.1 + e.amt * 0.35), R = Math.round(6 + e.dens * 18), y = e.H, i = 0; while (y > hz + 8 && i < 60) { var d = (y - hz) / (e.H - hz), px = Math.max(6, Math.round((e.H / R) * 0.72 * e.size * (0.15 + 0.85 * d * d))); y -= px * 1.35; K.row(e.lines[i % e.lines.length], y + px * 0.9, px, e.t * (10 + 30 * d) * (i % 2 ? 1 : -1) + i * 60, 0.25 + 0.75 * d); i++; } });
  add("Mirror Wall", "Word walls", "Reflection", function (K, e) { var R = Math.round(4 + e.dens * 14), hz = e.H * 0.52, rh = hz / R, px = rh * 0.72 * e.size, c = K.c, i; for (i = 0; i < R; i++) K.row(e.lines[i % e.lines.length], (i + 0.74) * rh, px, e.t * 20 * (i % 2 ? 1 : -1) + i * 90, 1); c.save(); c.translate(0, hz * 2); c.scale(1, -1); for (i = 0; i < R; i++) K.row(e.lines[i % e.lines.length], (i + 0.74) * rh, px, e.t * 20 * (i % 2 ? 1 : -1) + i * 90, (0.15 + e.amt * 0.6) * (1 - i / R * 0.5)); c.restore(); });
  add("Twin Arches", "Word walls", "Opening", function (K, e) { var R = Math.round(4 + e.dens * 12), px = (18 + 28 * (1 - e.dens)) * e.size, st = px * 1.12, R0 = 60 + e.amt * 160, base = e.H + 30, yc = e.H * 0.55, i, k; for (k = 0; k < 2; k++) { var cx = e.W * (k ? 0.74 : 0.26); for (i = 0; i < R; i++) { var rd = R0 + i * st, leg = base - yc, arc = Math.PI * rd, tot = leg * 2 + arc; K.along(e.lines[(i + k * 2) % e.lines.length] + "   ", px, (function (cx, rd, leg, arc) { return function (s) { if (s < leg) return [cx - rd, base - s, -Math.PI / 2]; if (s < leg + arc) { var f = (s - leg) / rd; return [cx - Math.cos(f) * rd, yc - Math.sin(f) * rd, f - Math.PI / 2]; } return [cx + rd, yc + (s - leg - arc), Math.PI / 2]; }; })(cx, rd, leg, arc), 0, tot, 1 - i / R * 0.55, null, e.t * (i % 2 ? 26 : -26) + k * 300, 0.04); } } });
  add("Three Pillars", "Word walls", "Pillar width", function (K, e) { var C = Math.round(2 + e.dens * 5), px = (24 + 24 * (1 - e.dens)) * e.size, st = px * 1.18, i, k; for (k = 0; k < 3; k++) { var cx = e.W * (0.2 + k * 0.3); for (i = 0; i < C; i++) col(K, e, cx + (i - (C - 1) / 2) * st * (0.8 + e.amt * 0.8), e.lines[(i + k * 3) % e.lines.length], px, 1 - Math.abs(i - (C - 1) / 2) / C * 0.6, e.t * 34 * (i % 2 ? 1 : -1) + k * 200); } });
  add("Frame Wall", "Word walls", "Inset", function (K, e) { var N = Math.round(2 + e.dens * 8), px = (16 + 24 * (1 - e.dens)) * e.size, st = px * (1.2 + e.amt * 1.6), i; for (i = 0; i < N; i++) { var m = 20 + i * st, x0 = m, y0 = m, x1 = e.W - m, y1 = e.H - m; if (x1 - x0 < px * 4 || y1 - y0 < px * 4) break; var w = x1 - x0, h = y1 - y0; K.along(e.lines[i % e.lines.length] + "   ", px, (function (x0, y0, x1, y1, w, h) { return function (s) { if (s < w) return [x0 + s, y0 + px * 0.5, 0]; s -= w; if (s < h) return [x1 - px * 0.5, y0 + s, Math.PI / 2]; s -= h; if (s < w) return [x1 - s, y1 - px * 0.5, Math.PI]; s -= w; return [x0 + px * 0.5, y1 - s, -Math.PI / 2]; }; })(x0, y0, x1, y1, w, h), 0, 2 * (w + h), 1 - i / N * 0.5, null, e.t * 24 * (i % 2 ? 1 : -1), 0.04); } });
  add("Letter Columns", "Word walls", "Spacing", function (K, e) { var C = Math.round(8 + e.dens * 30), st = e.W / C, px = st * 0.8 * e.size, c = K.c, gap = px * (1 + e.amt * 0.5), i, j; for (i = 0; i < C; i++) { var txt = e.lines[i % e.lines.length].replace(/\s+/g, ""), n = txt.length; if (!n) continue; var off = e.t * (14 + hash(i) * 20) * (i % 2 ? 1 : -1), o = ((off % gap) + gap) % gap, base = Math.floor(off / gap); for (j = -1; j < Math.ceil(e.H / gap) + 1; j++) { var G = K.glyph(txt[(((j + base) % n) + n) % n], px, e.fg); c.drawImage(G.cv, (i + 0.5) * st - G.w / 2 - G.pad, j * gap - o + gap * 0.8 - G.base); } } });
  add("Outline Rows", "Word walls", "Line weight", function (K, e) { var R = Math.round(6 + e.dens * 24), rh = e.H / R, px = rh * 0.74 * e.size, c = K.c, i, x; for (i = 0; i < R; i++) { var L = e.lines[i % e.lines.length], s = K.strip(L, px, e.fg, px * 0.45), off = e.t * 20 * (i % 2 ? 1 : -1) + i * 90, o = ((off % s.w) + s.w) % s.w, y = (i + 0.74) * rh; if (i % 2 === 0) { for (x = -o; x < e.W; x += s.w) c.drawImage(s.cv, x, y - s.base); } else { c.font = K.font(px); c.textBaseline = "alphabetic"; c.lineWidth = Math.max(0.6, 0.4 + e.amt * 3); c.strokeStyle = e.fg; c.globalAlpha = 0.9; for (x = -o; x < e.W; x += s.w) c.strokeText(L, x, y); c.globalAlpha = 1; } } });
  add("Pulse Wall", "Word walls", "Pulse", function (K, e) { var R = Math.round(6 + e.dens * 24), rh = e.H / R, px = rh * 0.74 * e.size, c = K.c, i, j; for (i = 0; i < R; i++) { var s = K.strip(e.lines[i % e.lines.length], px, e.fg, px * 0.45), n = Math.ceil(e.W / s.w) + 1, off = e.t * 8 * (i % 2 ? 1 : -1) + i * 83, o = ((off % s.w) + s.w) % s.w; for (j = 0; j < n; j++) { var ph = e.t * 0.7 + hash(i * 17 + j * 5) * 20, p = Math.max(0, Math.sin(ph)) * Math.max(0, Math.sin(ph * 0.37 + hash(i + j) * 6)); c.globalAlpha = 0.3 + 0.7 * (1 - e.amt) + e.amt * 0.7 * p * p; c.drawImage(s.cv, j * s.w - o, (i + 0.74) * rh - s.base); } } c.globalAlpha = 1; });
  add("Center Glow Wall", "Word walls", "Reach", function (K, e) { var R = Math.round(8 + e.dens * 28); rows(K, e, R, function (i) { return { off: e.t * 12 * (i % 2 ? 1 : -1) + i * 90 }; }); var c = K.c, r = e.W * (0.25 + e.amt * 0.45); c.save(); c.globalCompositeOperation = "destination-in"; var g = c.createRadialGradient(e.W / 2, e.H / 2, 0, e.W / 2, e.H / 2, r); g.addColorStop(0, "rgba(0,0,0,1)"); g.addColorStop(0.5, "rgba(0,0,0,0.8)"); g.addColorStop(1, "rgba(0,0,0,0.05)"); c.fillStyle = g; c.fillRect(0, 0, e.W, e.H); c.restore(); });
  add("Split Wall", "Word walls", "Seam", function (K, e) { var R = Math.round(6 + e.dens * 26), rh = e.H / R, px = rh * 0.72 * e.size, gap = e.W * (0.02 + e.amt * 0.18), c = K.c, i, k; for (k = 0; k < 2; k++) { c.save(); c.beginPath(); if (k === 0) c.rect(0, 0, e.W / 2 - gap / 2, e.H); else c.rect(e.W / 2 + gap / 2, 0, e.W / 2, e.H); c.clip(); for (i = 0; i < R; i++) K.row(e.lines[i % e.lines.length], (i + 0.74) * rh, px, e.t * 22 * (k ? -1 : 1) + i * 90, 1); c.restore(); } });
  // ---- the fluid on and off animations (progress pr: 0 gone, 1 fully on; sgn: -1 coming in, +1 going out)
  var FLOWS = ["Fade", "Smoke Rise", "Ink Bleed", "Liquid Melt", "Water Ripple", "Curl Swirl", "Wind Streak", "Vapor", "Pour", "Surface Tension", "Vortex", "Flood", "Droplets", "Fold Wave", "Current"];
  var FRAG = [
    "precision highp float;uniform sampler2D tx;uniform vec2 rs;uniform float pr,sgn,turb,scl,tm,glow,warp,bias;uniform int kind;uniform vec3 ac;",
    "float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}",
    "float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*f*(f*(f*6.-15.)+10.);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}",
    "float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=mat2(.8,.6,-.6,.8)*p*2.03;a*=.5;}return v;}",
    "vec2 curl(vec2 p){float e=.04;return vec2(fbm(p+vec2(0.,e))-fbm(p-vec2(0.,e)),fbm(p-vec2(e,0.))-fbm(p+vec2(e,0.)))/(2.*e);}",
    "vec2 advect(vec2 q,float amt,vec2 bias0,float s){for(int i=0;i<9;i++){q+=(curl(q*s+vec2(tm*.03,0.)+bias0*amt*.4)*.11+bias0*.12)*amt;}return q;}",
    "vec4 S(vec2 q){return texture2D(tx,q);}",
    "vec4 B(vec2 q,float d){vec4 a=S(q)*.2;for(int i=0;i<10;i++){float f=float(i);float t=f*2.4;float rr=sqrt((f+.5)/10.)*d;a+=S(q+vec2(cos(t),sin(t))*rr*vec2(rs.y/rs.x,1.))*.08;}return a;}",
    "void main(){vec2 uv=gl_FragCoord.xy/rs;float a0=rs.x/rs.y;vec2 q=vec2(uv.x*a0,uv.y);float P=clamp(pr,0.,1.),A=1.-P,E=A*A*(3.-2.*A),s=scl;float T=.25+turb*1.7;vec4 c=vec4(0.);float edge=0.;",
    " if(warp>.001){vec2 w=curl(q*1.6+vec2(tm*.06,tm*.04))*.018*warp;uv+=w;q=vec2(uv.x*a0,uv.y);}",
    " if(pr>=.999){c=S(uv);}",
    " else if(kind==0){c=S(uv)*P;}",
    " else if(kind==1){vec2 d=advect(q,E*T,vec2(.06,-.55)*(sgn>0.?1.:-1.)*(-1.),s*2.);vec2 u2=vec2(d.x/a0,d.y);float nn=fbm(q*s*4.+vec2(0.,tm*.2));float m=smoothstep(A*1.15-.18,A*1.15+.1,nn+.1);c=B(u2,.002+E*.03)*m;edge=(1.-smoothstep(.0,.16,abs(nn+.1-A*1.15)))*step(.002,A);}",
    " else if(kind==2){float nn=fbm(q*s*2.6+7.);float d=length(vec2((uv.x-.5)*a0,uv.y-.5))*.55;float f=nn*.65+d*.55;float th=A*1.15-.05;float m=smoothstep(th-.015,th+.1,f);vec2 d2=advect(q,E*T*.45,vec2(0.),s*3.);c=B(vec2(d2.x/a0,d2.y),.001+E*.012)*m;edge=(1.-smoothstep(0.,.05,abs(f-th)))*step(.002,A);}",
    " else if(kind==3){float cl=fbm(vec2(q.x*s*6.,1.3));float cl2=n(vec2(q.x*s*16.,4.));float L=E*(.5+cl*1.6+cl2*.45)*T;float yy=uv.y+L*(sgn>0.?1.:-1.)*(sgn>0.?1.:1.);vec2 u2=vec2(uv.x+sin(uv.y*14.+tm)*E*.006,uv.y+(sgn>0.?L:-L)*-1.*(-1.));c=S(u2)+S(u2+vec2(0.,E*.03))*.6+S(u2+vec2(0.,E*.08))*.35;c=min(c,vec4(1.));float m=1.-smoothstep(.6,1.,A);c*=m;}",
    " else if(kind==4){vec2 cc=vec2(a0*.5,.5);vec2 dq=q-cc;float d=length(dq)+1e-4;float rp=sin(d*(30.+s*16.)-A*22.-tm*2.)*E*.05*T*exp(-d*.5)/(1.+d*.2);vec2 d2=q+dq/d*rp*1.8;c=B(vec2(d2.x/a0,d2.y),E*.018)*(1.-smoothstep(.45,1.,A));edge=abs(rp)*12.*(1.-A);}",
    " else if(kind==5){vec2 d=advect(q,E*T*1.8,vec2(0.),s*1.2);float m=1.-smoothstep(.55,1.,A);c=B(vec2(d.x/a0,d.y),E*.015)*m;edge=E*(1.-E)*1.2*c.a;}",
    " else if(kind==6){float rw=fbm(vec2(uv.y*s*9.,seedW()));float ln=(.2+rw*1.4)*E*T*(sgn>0.?1.:-1.);vec4 a=vec4(0.);for(int i=0;i<12;i++){float f=float(i)/11.;a+=S(vec2(uv.x-ln*f*.9,uv.y));}c=a/12.*(1.+E*.9);c=min(c,vec4(1.))*(1.-smoothstep(.72,1.,A));}",
    " else if(kind==7){float nn=fbm(q*s*12.);float nb=fbm(q*s*2.5+tm*.1);float th=A*1.2-.1;float m=smoothstep(th-.1,th+.02,nn*.55+nb*.45);vec2 u2=vec2(uv.x,uv.y-E*.14*T*(sgn>0.?-1.:1.));vec2 d=advect(vec2(u2.x*a0,u2.y),E*T*.4,vec2(0.),s*5.);c=B(vec2(d.x/a0,d.y),E*.024)*m;}",
    " else if(kind==8){float wave=(fbm(vec2(q.x*s*2.5,tm*.25))-.5)*.2*T+sin(q.x*s*5.+tm*2.)*.018;float fr=(sgn>0.?(1.-P)*1.5-.25:P*1.5-.25);float yv=1.-uv.y+wave;float m=sgn>0.?smoothstep(fr-.012,fr+.012,yv):smoothstep(fr+.012,fr-.012,yv);float dF=abs(yv-fr);vec2 u2=uv+vec2(0.,exp(-dF*16.)*.05*step(.002,A));c=S(u2)*m;edge=exp(-dF*70.)*step(.002,A);}",
    " else if(kind==9){vec2 d=advect(q,E*T*.32,vec2(0.),s*2.4);vec4 b=B(vec2(d.x/a0,d.y),.002+E*.05);float th=.08+A*.7;float m=smoothstep(th-.05,th+.05,b.a);vec4 sh=S(vec2(d.x/a0,d.y));c=mix(b/max(b.a,.001)*m,sh,P*P*step(.6,P)*0.)*1.;c=vec4(c.rgb,m)*step(0.,1.);c.rgb=(b.rgb/max(b.a,.001))*m;c=mix(c,sh,smoothstep(.72,1.,P));}",
    " else if(kind==10){vec2 cc=vec2(a0*.5,.5);vec2 dq=q-cc;float d=length(dq);float ang=E*T*4.*(sgn>0.?1.:-1.)*exp(-d*1.1);float zm=1.+E*.9*(sgn>0.?1.:-.3);vec2 rq=mat2(cos(ang),-sin(ang),sin(ang),cos(ang))*dq*zm+cc;c=B(vec2(rq.x/a0,rq.y),E*.022)*(1.-smoothstep(.45,1.,A));}",
    " else if(kind==11){float w0=(fbm(vec2(uv.y*s*3.,tm*.25))-.5)*.2*T;float fr=sgn>0.?A*1.5-.25:P*1.5-.25;float xv=uv.x+w0;float m=sgn>0.?smoothstep(fr-.02,fr+.02,xv):smoothstep(fr+.02,fr-.02,xv);float dF=abs(xv-fr);vec2 u2=uv+curl(q*s*3.)*exp(-dF*14.)*.025*T*step(.002,A);c=S(u2)*m;edge=exp(-dF*38.)*step(.002,A);}",
    " else if(kind==12){float k=8.+s*14.;vec2 cl=floor(q*k),f=fract(q*k)-.5;float o=h(cl);float t=clamp((P*1.7-o*.7),0.,1.);float R=t*.78;float m=smoothstep(R,R-.1,length(f));vec2 u2=uv+f/k*(1.-t)*vec2(1./a0,1.);c=S(u2)*m;c=mix(c,S(uv),smoothstep(.9,1.,P));}",
    " else if(kind==13){float w0=sin(uv.x*(5.+s*5.)-A*7.+tm)*E*.18*T+sin(uv.x*(13.+s*6.)+A*5.)*E*.05*T;float sc0=1.-E*.45;c=S(vec2(uv.x,(uv.y-.5+w0)/max(sc0,.05)+.5))*(1.-smoothstep(.6,1.,A));}",
    " else{float pf=fbm(vec2(uv.y*s*2.+tm*.05,1.));float ln=E*(.3+pf)*1.3*T*(sgn>0.?1.:-1.);vec2 d=advect(vec2((uv.x-ln)*a0,uv.y),E*T*.6,vec2(.5,0.)*(sgn>0.?1.:-1.),s*1.7);c=B(vec2(d.x/a0,d.y),E*.024)*(1.-smoothstep(.62,1.,A));edge=E*(1.-E)*c.a*.7;}",
    " if(glow>.001&&P>.7){float gk=glow*.9*smoothstep(.7,1.,P);vec4 g=B(uv,.012+glow*.03);c.rgb=c.rgb+g.rgb*gk*(1.-c.a*.45);c.a=clamp(max(c.a,g.a*gk),0.,1.);}",
    " if(edge>.001){float e=clamp(edge,0.,1.);float al=max(c.a,e*.65*bias);c.rgb=c.rgb*(1.-e*.35)+ac*e*.75*bias;c.a=al;}",
    " gl_FragColor=c;}"
  ].join("\n").replace("seedW()", "2.7");
  var FRAG_LINES = FRAG.split("\n");
  function fragFor(kind) {   // only the animation in use; kind < 0 is text on screen with nothing animating
    return FRAG_LINES.filter(function (l) { var m = /^ else if\(kind==(\d+)\)/.exec(l); if (m) return +m[1] === kind; if (/^ else\{float pf/.test(l)) return kind === 14; return true; }).join("\n");
  }
  function glSetup(cv) {
    var gl = cv.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false }); if (!gl) return null;
    function sh(t, src) { var o = gl.createShader(t); gl.shaderSource(o, src); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error("text fx: " + gl.getShaderInfoLog(o)); return o; }
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    var tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex); [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach(function (k) { gl.texParameteri(gl.TEXTURE_2D, k, gl.CLAMP_TO_EDGE); }); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    var vs = sh(gl.VERTEX_SHADER, "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}"), progs = {};
    function prog(kind) { if (progs[kind]) return progs[kind]; var p = gl.createProgram(); gl.attachShader(p, vs); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fragFor(kind))); gl.bindAttribLocation(p, 0, "a"); gl.linkProgram(p); var u = {}; ["tx", "rs", "pr", "sgn", "turb", "scl", "tm", "glow", "warp", "bias", "kind", "ac"].forEach(function (k) { u[k] = gl.getUniformLocation(p, k); }); return (progs[kind] = { p: p, u: u }); }
    return { gl: gl, prog: prog };
  }
  function hexRGB(h) { var v = parseInt(h.replace("#", ""), 16); return [(v >> 16 & 255) / 255, (v >> 8 & 255) / 255, (v & 255) / 255]; }
  function fontSpec(fonts, key) { return fonts[key] || fonts.anton; }
  function ease(x) { return x; }

  // One instance per Stage: `state` is the Text tab's settings
  function Fx(wrap, fonts) {
    this.fonts = fonts; this.cv = document.createElement("canvas"); this.cv.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;display:none";
    wrap.appendChild(this.cv); this.tc = document.createElement("canvas"); this.ctx = this.tc.getContext("2d", { willReadFrequently: false });
    this.g = null; this.s = null; this.t = 0; this.rt = 0; this.pr = 0; this.sgn = -1; this.phase = "off"; this.last = 0; this.kit = null; this.sig = ""; var self = this;
    this.raf = function (now) { self.frame(now); requestAnimationFrame(self.raf); }; requestAnimationFrame(this.raf);
    if (document.fonts && document.fonts.addEventListener) document.fonts.addEventListener("loadingdone", function () { self.kit = null; self.sig = ""; });
  }
  Fx.prototype.size = function (W) {
    var h = Math.round(Math.min(1080, Math.max(360, Math.round(this.cv.clientHeight * (window.devicePixelRatio || 1)))) * (this.q || 1)), w = Math.round(h * W / 1080);
    if (this.tc.width !== w || this.tc.height !== h) { this.tc.width = w; this.tc.height = h; this.cv.width = w; this.cv.height = h; if (this.g) this.g.gl.viewport(0, 0, w, h); this.kit = null; this.sig = ""; }
    return { w: w, h: h, k: h / 1080 };
  };
  Fx.prototype.update = function (s, W) {
    var was = this.shown; this.s = s; this.W = W; var on = !!(s.on && s.mode === "fx"); if (on && !this.g) this.g = glSetup(this.cv); this.shown = on; this.cv.style.display = on ? "block" : "none";
    this.cv.style.mixBlendMode = on && s.fxBlend ? s.fxBlend : "";
    // the glyph cache is built with whatever font the browser has at that moment: ask for the real one and rebuild once it lands (Safari loads it late)
    if (on && document.fonts) { var fs = fontSpec(this.fonts, s.fxFont), fq = (fs[2] ? fs[2] + " " : "") + fs[1] + ' 40px "' + fs[0] + '"', self = this; if (fq !== this.fq || !document.fonts.check(fq)) { this.fq = fq; document.fonts.load(fq).then(function () { self.kit = null; self.sig = ""; }, function () {}); } }   // check() is false once the stylesheet has arrived and the face is still unloaded
    if (on && !was) this.take();
    if (!on) { this.phase = "off"; this.pr = 0; }
  };
  Fx.prototype.take = function () { this.phase = "hold"; this.pr = 1; this.sgn = -1; this.done = null; this.holdAt = 0; };
  Fx.prototype.off = function (done) { this.phase = "gone"; this.pr = 0; this.sgn = 1; this.done = null; if (done) done(); };
  Fx.prototype.frame = function (now) {
    var s = this.s; if (!s || !s.on || s.mode !== "fx" || !this.g) { this.last = now; return; }
    var raw = now - (this.last || now), dt = Math.min(0.1, raw / 1000); this.last = now; if (this.frozen) dt = 0;
    if (raw > 50 && raw < 1000) { this.slow = (this.slow || 0) + 1; if (this.slow > 12 && (this.q || 1) > 0.5) { this.q = Math.max(0.5, (this.q || 1) * 0.75); this.slow = 0; } } else if (this.slow) this.slow -= 0.25;
    if (s.playing !== false) { this.t += dt * s.fxSpeed / 100; this.rt += dt * s.fxSpeed / 100; }
    if (this.phase === "in") { this.pr += dt / Math.max(0.05, s.fxInDur); if (this.pr >= 1) { this.pr = 1; this.phase = "hold"; this.holdAt = 0; var gg = this.g, ko = s.fxOut; setTimeout(function () { try { gg.prog(ko); } catch (er) {} }, 400); } }
    else if (this.phase === "out") { this.pr -= dt / Math.max(0.05, s.fxOutDur); if (this.pr <= 0) { this.pr = 0; if (this.done) { var d = this.done; this.done = null; d(); return; } if (s.fxLoop) { this.phase = "wait"; this.holdAt = 0; } else this.phase = "gone"; } }
    else if (this.phase === "hold" && s.fxLoop) { this.holdAt += dt; if (this.holdAt > s.fxHold) this.off(); }
    else if (this.phase === "wait") { this.holdAt += dt; if (this.holdAt > 0.5) this.take(); }
    this.paint(this.frozen ? this.frozenT : this.t, this.frozen ? this.frozenP : this.pr);
  };
  Fx.prototype.env = function (s, t) {
    var lines = (s.fxLines || "").split(/\n+/).map(function (l) { return l.trim(); }).filter(Boolean); if (!lines.length) lines = ["Your words here"];
    if (s.fxCaps) lines = lines.map(function (l) { return l.toUpperCase(); });
    return { lines: lines, t: t, rt: t, speed: s.fxSpeed / 100, size: s.fxSize / 100, dens: s.fxDens / 100, amt: s.fxAmt / 100, space: s.fxSpace / 100, fg: s.fg, ac: s.ac, fontSpec: fontSpec(this.fonts, s.fxFont), fontKey: s.fxFont };
  };
  Fx.prototype.paint = function (t, pr) {
    var s = this.s, D = this.size(this.W || 1920), c = this.ctx, g = this.g, gl = g.gl, e = this.env(s, t), sig = [s.fxFont, s.fg, s.ac, D.w, D.h, s.fxSize].join("|");
    e.W = this.W || 1920; e.H = 1080; e.k = D.k;
    if (!this.kit || this.sig !== sig) { this.kit = new Kit(c, e); this.sig = sig; }
    this.kit.e = e; this.kit.c = c;
    c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.clearRect(0, 0, D.w, D.h); c.setTransform(D.k, 0, 0, D.k, 0, 0); c.textAlign = "left";
    var TR = T[clamp(s.fxId | 0, 0, T.length - 1)]; try { TR.draw(this.kit, e); } catch (er) { if (!this.warned) { this.warned = 1; console.error(TR.name, er); } }
    c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1;
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.tc);
    var k = this.sgn < 0 ? s.fxIn : s.fxOut, ac = hexRGB(s.ac), PG = g.prog(pr >= 0.999 ? -1 : k), u = PG.u; gl.useProgram(PG.p); gl.uniform1i(u.tx, 0); gl.uniform2f(u.rs, D.w, D.h); gl.uniform1f(u.pr, pr); gl.uniform1f(u.sgn, this.sgn); gl.uniform1f(u.turb, s.fxTurb / 100); gl.uniform1f(u.scl, 0.35 + s.fxScale / 100 * 1.6); gl.uniform1f(u.tm, t); gl.uniform1f(u.glow, Math.min(1, s.fxGlow / 100 + (e.glowAdd || 0))); gl.uniform1f(u.warp, e.warp || 0); gl.uniform1f(u.bias, s.fxEdge / 100); gl.uniform1i(u.kind, k); gl.uniform3f(u.ac, ac[0], ac[1], ac[2]);
    gl.drawArrays(gl.TRIANGLES, 0, 3); this.cv.style.opacity = s.fxOpac / 100;
  };
  // A still of treatment i, for the picker tiles
  function thumb(i, fonts, s, W, H, t) {
    var cv = document.createElement("canvas"); cv.width = W; cv.height = H; var c = cv.getContext("2d"); c.fillStyle = "#0a090c"; c.fillRect(0, 0, W, H);
    var lines = (s.fxLines || "").split(/\n+/).map(function (l) { return l.trim(); }).filter(Boolean); if (!lines.length) lines = ["Your words here"]; if (s.fxCaps) lines = lines.map(function (l) { return l.toUpperCase(); });
    var k = H / 1080, e = { lines: lines, t: t, rt: t, speed: 1, size: 1, dens: 0.5, amt: 0.55, space: 0.5, fg: s.fg, ac: s.ac, fontSpec: fontSpec(fonts, s.fxFont), fontKey: s.fxFont, W: W / k, H: 1080, k: k }, K = new Kit(c, e);
    c.setTransform(k, 0, 0, k, 0, 0); try { T[i].draw(K, e); } catch (er) {} c.setTransform(1, 0, 0, 1, 0, 0); return cv.toDataURL("image/jpeg", 0.8);
  }
  window.AltarTextFX = { TREATMENTS: T, FLOWS: FLOWS, Fx: Fx, thumb: thumb };
})();
