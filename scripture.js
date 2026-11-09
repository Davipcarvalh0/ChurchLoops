// Altar Text: tickers, one full-screen word, and a scripture scroll over the loop.
// Used by the Studio's Text tab, its output window (/studio?out=1) and the text-only browser source (/scripture?out=1&s=...).
(function () {
  "use strict";
  var BOOKS = [["Genesis",50],["Exodus",40],["Leviticus",27],["Numbers",36],["Deuteronomy",34],["Joshua",24],["Judges",21],["Ruth",4],["1 Samuel",31],["2 Samuel",24],["1 Kings",22],["2 Kings",25],["1 Chronicles",29],["2 Chronicles",36],["Ezra",10],["Nehemiah",13],["Esther",10],["Job",42],["Psalms",150],["Proverbs",31],["Ecclesiastes",12],["Song of Solomon",8],["Isaiah",66],["Jeremiah",52],["Lamentations",5],["Ezekiel",48],["Daniel",12],["Hosea",14],["Joel",3],["Amos",9],["Obadiah",1],["Jonah",4],["Micah",7],["Nahum",3],["Habakkuk",3],["Zephaniah",3],["Haggai",2],["Zechariah",14],["Malachi",4],["Matthew",28],["Mark",16],["Luke",24],["John",21],["Acts",28],["Romans",16],["1 Corinthians",16],["2 Corinthians",13],["Galatians",6],["Ephesians",6],["Philippians",4],["Colossians",4],["1 Thessalonians",5],["2 Thessalonians",3],["1 Timothy",6],["2 Timothy",4],["Titus",3],["Philemon",1],["Hebrews",13],["James",5],["1 Peter",5],["2 Peter",3],["1 John",5],["2 John",1],["3 John",1],["Jude",1],["Revelation",22]];
  var TRANS = [["web","WEB · World English Bible"],["kjv","KJV · King James"],["asv","ASV · American Standard"],["ylt","YLT · Young's Literal (New Testament only)"],["darby","Darby"]];
  var KEY = "altar-text", CH = "altar-scripture";
  // key: [family, weight, style]. The same fonts are bundled in Altar Live (altar-live/Resources/fonts).
  var FONTS = { anton: ["Anton", 400, ""], bebas: ["Bebas Neue", 400, ""], oswald: ["Oswald", 600, ""], montserrat: ["Montserrat", 800, ""], sans: ["Inter Tight", 500, ""], serif: ["Gloock", 400, ""], playfair: ["Playfair Display", 700, ""], cormorant: ["Cormorant Garamond", 600, ""], italic: ["Instrument Serif", 400, "italic"] };
  var FONT_NAMES = [["anton", "Anton"], ["bebas", "Bebas Neue"], ["oswald", "Oswald"], ["montserrat", "Montserrat"], ["sans", "Inter"], ["serif", "Gloock"], ["playfair", "Playfair"], ["cormorant", "Cormorant"], ["italic", "Instrument italic"]];
  var BLENDS = [["normal", "Normal"], ["screen", "Screen"], ["overlay", "Overlay"], ["soft-light", "Soft light"], ["multiply", "Multiply"], ["plus-lighter", "Add"], ["color-dodge", "Color dodge"], ["difference", "Difference"]];
  var DEFAULT = {
    on: false, mode: "fx", tscroll: false, word: "Jesus", wscale: 100, wopacity: 100, wblend: "normal", wfont: "anton",
    passages: [{ id: "p1", ref: "Psalm 23", tr: "WEB", on: true, verses: [
      [1,"Yahweh is my shepherd: I shall lack nothing."],[2,"He makes me lie down in green pastures. He leads me beside still waters."],[3,"He restores my soul. He guides me in the paths of righteousness for his name's sake."],[4,"Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me. Your rod and your staff, they comfort me."],[5,"You prepare a table before me in the presence of my enemies. You anoint my head with oil. My cup runs over."],[6,"Surely goodness and loving kindness shall follow me all the days of my life, and I will dwell in Yahweh's house forever."]] }],
    edges: { bottom: true, top: false, left: false, right: false },
    scrollSpeed: 40, tickerSpeed: 110, size: 64, tsize: 40, width: 1300,
    font: "serif", tfont: "sans", align: "center", fg: "#ece5da", ac: "#ffc48a",
    fxId: 0, fxLines: "Holy\nPrince of Peace\nKing of Kings\nAlpha and Omega\nEmmanuel\nGood Shepherd\nLiving Water\nLord of Hosts\nRedeemer\nRock of Ages\nLight of the World\nWonderful Counselor", fxFont: "anton", fxCaps: true, fxSpeed: 100, fxSize: 100, fxDens: 50, fxAmt: 55, fxSpace: 50, fxGlow: 15, fxOpac: 100, fxEdge: 60, fxIn: 0, fxOut: 0, fxInDur: 0.6, fxOutDur: 0.6, fxLoop: false, fxTurb: 50, fxScale: 50, fxHold: 4, fxBlend: "normal", bg: "loop", dim: 0, tsrc: "custom", ttext: "Jesus", band: true, nums: true, refs: true, label: "", playing: true
  };
  var CSS = '\
.scr-wrap{position:absolute;inset:0;overflow:hidden;pointer-events:none}\
.scr-stage{position:absolute;left:0;top:0;height:1080px;overflow:hidden;transform-origin:0 0;--fg:#ece5da;--ac:#ff6a2c;--band:rgba(5,4,6,.78);line-height:1.32}\
.scr-under{position:absolute;inset:0;pointer-events:none}.scr-under.bg-black{background:#000}.scr-under.bg-green{background:#00b140}\
.studio-screen{isolation:isolate}\
.scr-stage svg{position:absolute;left:0;top:0;overflow:visible}\
.scr-stage .lane .copy{flex:none}\
.scr-stage .scroll{position:absolute;overflow:hidden;-webkit-mask-image:linear-gradient(transparent,#000 14%,#000 86%,transparent);mask-image:linear-gradient(transparent,#000 14%,#000 86%,transparent)}\
.scr-stage .scroll .trk{position:absolute;left:0;right:0;top:0;will-change:transform}\
.scr-stage .psg{margin:0 0 1.4em;color:var(--fg);text-shadow:0 2px 24px rgba(0,0,0,.45)}\
.scr-stage .psg h2{margin:0 0 .7em;font:500 .42em/1 "IBM Plex Mono",ui-monospace,Menlo,monospace;letter-spacing:.22em;text-transform:uppercase;color:var(--ac)}\
.scr-stage .psg p{margin:0 0 .55em;font:inherit;color:inherit;max-width:none}\
.scr-stage sup{font:500 .42em "IBM Plex Mono",ui-monospace,Menlo,monospace;color:var(--ac);vertical-align:.9em;margin-right:.35em;letter-spacing:0}\
.scr-stage .a-center{text-align:center}.scr-stage .a-left{text-align:left}\
.scr-stage .edge{position:absolute;display:flex;overflow:hidden;color:var(--fg)}\
.scr-stage .edge.h{left:0;right:0;align-items:center}.scr-stage .edge.v{justify-content:center}\
.scr-stage .edge.band{background:var(--band)}\
.scr-stage .edge.top.band{border-bottom:2px solid var(--ac)}.scr-stage .edge.bottom.band{border-top:2px solid var(--ac)}\
.scr-stage .edge.left.band{border-right:2px solid var(--ac)}.scr-stage .edge.right.band{border-left:2px solid var(--ac)}\
.scr-stage .tag{flex:none;align-self:stretch;display:flex;align-items:center;justify-content:center;background:var(--ac);color:#120602;font:600 .5em "IBM Plex Mono",ui-monospace,Menlo,monospace;letter-spacing:.2em;text-transform:uppercase;padding:0 1.2em;z-index:2}\
.scr-stage .edge.v .tag{padding:1.2em 0;writing-mode:vertical-rl}\
.scr-stage .lane{position:relative;flex:1;overflow:hidden;align-self:stretch}\
.scr-stage .lane .trk{position:absolute;white-space:nowrap;will-change:transform;display:flex}\
.scr-stage .edge.h .lane .trk{top:0;bottom:0;left:0;align-items:center}\
.scr-stage .edge.v .lane .trk{left:0;right:0;top:0;flex-direction:column;align-items:center}\
.scr-stage .edge.v .lane .copy{writing-mode:vertical-rl}\
.scr-stage .edge.left .lane{transform:rotate(180deg)}\
.scr-stage .edge .r{color:var(--ac);font:500 .62em "IBM Plex Mono",ui-monospace,Menlo,monospace;letter-spacing:.18em;text-transform:uppercase;margin:0 .9em 0 0}\
.scr-stage .edge.v .r{margin:0 0 .9em 0}\
.scr-stage .edge .dot{color:var(--ac);margin:0 1.1em}.scr-stage .edge.v .dot{margin:1.1em 0}\
.scr-stage .edge sup{font-size:.5em;vertical-align:.6em;margin-right:.3em}\
body.scr-out{background:transparent;margin:0;overflow:hidden;cursor:none}\
body.scr-out #scr-root{position:fixed;inset:0}\
body.studio-out{overflow:hidden;cursor:none;background:#000}\
body.studio-out #site-head,body.studio-out #site-foot,body.studio-out .page-head,body.studio-out .studio-panel,body.studio-out .studio-actions,body.studio-out .studio-load,body.studio-out .studio-get,body.studio-out .studio-note,body.studio-out .studio-hud{display:none!important}\
body.studio-out .studio-screen{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;max-width:none!important;aspect-ratio:auto!important;border:0!important;border-radius:0!important;box-shadow:none!important;animation:none!important;z-index:9}\
.scr-pane .scr-in{width:100%;background:rgba(236,229,218,.04);border:1px solid var(--line);border-radius:9px;padding:9px 11px;color:var(--bone);font:inherit;font-size:.82rem;min-width:0}\
.scr-pane select.scr-in option{background:#0a090c}\
.scr-pane .scr-in:focus{outline:none;border-color:rgba(255,176,124,.6)}\
.scr-pane textarea.scr-in{min-height:84px;resize:vertical;display:block}\
.scr-pane .scr-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.scr-pane .scr-row>*{min-width:0}\
.scr-pane fieldset.group{display:grid;gap:12px}\
.scr-pane .scr-msg{font-size:.76rem;color:var(--ember-soft);min-height:1em;margin:0}\
.scr-pane .scr-note{font-size:.76rem;color:var(--ash);margin:0}\
.scr-pane .scr-list{display:grid;gap:6px}\
.scr-pane .scr-item{display:grid;grid-template-columns:auto minmax(0,1fr) auto auto auto;gap:9px;align-items:center;border:1px solid var(--line);border-radius:10px;padding:8px 10px;font-size:.84rem}\
.scr-pane .scr-item.off{opacity:.5}.scr-pane .scr-item b{font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\
.scr-pane .scr-item small{font:.62rem var(--font-mono);color:var(--ash)}\
.scr-pane .scr-x{background:none;border:0;color:var(--ash);cursor:pointer;padding:2px 4px}.scr-pane .scr-x:hover{color:var(--bone)}\
.scr-pane input[type=checkbox]{accent-color:var(--ember);width:15px;height:15px}\
.scr-pane input[type=color]{width:34px;height:30px;border:1px solid var(--line);border-radius:8px;background:none;padding:2px}\
.scr-pane .scr-ck{display:flex;gap:8px;align-items:center;cursor:pointer;font-size:.84rem}\
.scr-pane .btn{padding:9px 14px;font-size:.62rem}\
';

  var stages = [];
  function fontRule(k) { var f = FONTS[k]; return '.scr-stage .f-' + k + '{font-family:"' + f[0] + '",Georgia,serif;font-weight:' + f[1] + ';font-style:' + (f[2] || "normal") + '}'; }
  function css() {
    if (document.getElementById("scr-css")) return;
    var st = document.createElement("style"); st.id = "scr-css"; st.textContent = CSS + Object.keys(FONTS).map(fontRule).join(""); document.head.appendChild(st);
    var l = document.createElement("link"); l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Oswald:wght@600&family=Montserrat:wght@800&family=Playfair+Display:wght@700&family=Cormorant+Garamond:wght@600&family=Gloock&family=Instrument+Serif:ital@1&family=Inter+Tight:wght@500&display=swap";
    l.onload = function () { stages.forEach(function (st) { if (st.s) st.build(st.s); }); };   // re-measure now the fonts can load
    document.head.appendChild(l);
  }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function b64e(o) { var b = new TextEncoder().encode(JSON.stringify(o)), s = ""; b.forEach(function (c) { s += String.fromCharCode(c); }); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
  function b64d(s) { var bin = atob(s.replace(/-/g, "+").replace(/_/g, "/")); return JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, function (c) { return c.charCodeAt(0); }))); }
  function fresh() { return JSON.parse(JSON.stringify(DEFAULT)); }
  function merge(o) { var s = Object.assign(fresh(), o); s.edges = Object.assign({}, DEFAULT.edges, o.edges); s.fxLoop = false; var R = { fxSpeed: [0, 300], fxSize: [30, 200], fxDens: [0, 100], fxAmt: [0, 100], fxSpace: [0, 100], fxGlow: [0, 100], fxOpac: [0, 100], fxEdge: [0, 100], fxTurb: [0, 100], fxScale: [0, 100], fxHold: [1, 15], fxInDur: [0.05, 10], fxOutDur: [0.05, 10], dim: [0, 100], scrollSpeed: [5, 160], tickerSpeed: [20, 400], size: [32, 130], tsize: [20, 80], width: [700, 1800], wopacity: [0, 100], wscale: [20, 200] };Object.keys(DEFAULT).forEach(function (k) { var d = DEFAULT[k], v = s[k]; if (typeof d === "number") { if (typeof v !== "number" || !isFinite(v) || (R[k] && (v < R[k][0] || v > R[k][1]))) s[k] = d; } else if (typeof d === "string") { if (typeof v !== "string") s[k] = d; } else if (typeof d === "boolean") s[k] = !!v; });["font", "tfont", "wfont", "fxFont"].forEach(function (k) { if (!FONTS[s[k]]) s[k] = DEFAULT[k]; }); var bl = BLENDS.map(function (b) { return b[0]; }); ["wblend", "fxBlend"].forEach(function (k) { if (bl.indexOf(s[k]) < 0) s[k] = "normal"; });["fg", "ac"].forEach(function (k) { if (!/^#[0-9a-f]{6}$/i.test(s[k])) s[k] = DEFAULT[k]; }); if (["fx", "ticker", "word", "scroll"].indexOf(s.mode) < 0) s.mode = "fx"; if (!Array.isArray(s.passages)) s.passages = DEFAULT.passages;var nfl = window.AltarTextFX && AltarTextFX.FLOWS ? AltarTextFX.FLOWS.length : 0; ["fxIn", "fxOut"].forEach(function (k) { if (!(s[k] >= 0 && s[k] < nfl)) s[k] = 0; });var nfx = window.AltarTextFX && AltarTextFX.TREATMENTS ? AltarTextFX.TREATMENTS.length : 0; s.fxId = (s.fxId === +s.fxId && s.fxId >= 0 && s.fxId < nfx) ? Math.floor(s.fxId) : 0; if (s.bg === "transparent") s.bg = "loop"; if (s.bg === "dim") { s.bg = "loop"; s.dim = 45; } s.passages = s.passages.filter(function (p) { return p.tr !== "BBE"; }); return s; }
  function stored() { try { var v = JSON.parse(localStorage.getItem(KEY)); if (v) return merge(v); } catch (e) {} return fresh(); }

  // Draws the layout on a stage 1080 units tall (width follows the screen's shape), scaled to fit `host`.
  function Stage(host) {
    this.wrap = document.createElement("div"); this.wrap.className = "scr-wrap";
    this.el = document.createElement("div"); this.wrap.appendChild(this.el);
    this.under = document.createElement("div"); this.under.className = "scr-under";   // what's behind the text; separate so blend modes see it
    stages.push(this);
    this.fx = window.AltarTextFX ? new AltarTextFX.Fx(this.wrap, FONTS) : null; this.host = host; this.W = 1920; this.parts = []; this.off = {}; this.last = 0; this.s = null;
    var hud = host.querySelector && host.querySelector(".studio-hud");
    if (hud) host.insertBefore(this.wrap, hud); else host.appendChild(this.wrap);
    host.insertBefore(this.under, this.wrap);
    var self = this;
    this.ro = new ResizeObserver(function () { self.fit(); }); this.ro.observe(host);
    this.fit();
    requestAnimationFrame(function (t) { self.tick(t); });
  }
  Stage.prototype.fit = function () {
    var w = this.host.clientWidth, h = this.host.clientHeight; if (!w || !h) return;
    var k = h / 1080, W = Math.round(w / k), ch = W !== this.W;
    this.W = W; this.el.style.width = W + "px"; this.el.style.transform = "scale(" + k + ")";
    if (ch && this.s) this.build(this.s);
  };
  Stage.prototype.paintUnder = function () {     // black, green, or the loop dimmed by the Background dim slider
    var s = this.s, u = this.under;
    u.className = "scr-under" + (s.on && s.bg !== "loop" ? " bg-" + s.bg : "");
    u.style.background = s.on && s.bg === "loop" && s.dim > 0 ? "rgba(0,0,0," + s.dim / 100 + ")" : "";
  };
  Stage.prototype.build = function (s) {
    this.s = s;
    var st = this.el, W = this.W, self = this;
    st.className = "scr-stage"; st.style.setProperty("--fg", s.fg); st.style.setProperty("--ac", s.ac);
    st.innerHTML = ""; this.parts = []; this.wrap.style.mixBlendMode = "";
    this.paintUnder();
    if (this.fx) this.fx.update(s, W);
    if (!s.on) return;
    if (s.mode === "fx") return;
    if (s.mode === "word") { this.buildWord(s); return; }
    var on = s.passages.filter(function (p) { return p.on && p.verses.length; });
    var custom = (s.ttext || "").split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean);
    var useS = s.tsrc !== "custom" && on.length, useC = s.tsrc !== "scripture" && custom.length, ticker = s.mode === "ticker" && (useS || useC);
    var T = s.tsize * 1.9, E = s.edges, top = ticker && E.top ? T : 0, bot = ticker && E.bottom ? T : 0, lef = ticker && E.left ? T : 0, rig = ticker && E.right ? T : 0;
    if ((s.mode === "scroll" || (s.mode === "ticker" && s.tscroll)) && on.length) {     // the verse scroll: its own mode, or in the centre with the tickers around it
      var box = document.createElement("div"), w = Math.min(s.width, W - lef - rig - 120);
      box.className = "scroll f-" + s.font + " a-" + s.align;
      Object.assign(box.style, { top: top + "px", bottom: bot + "px", left: lef + (W - lef - rig - w) / 2 + "px", width: w + "px", fontSize: s.size + "px" });
      var html = on.map(function (p) { return '<div class="psg">' + (s.refs ? "<h2>" + esc(p.ref) + (p.tr ? " · " + esc(p.tr) : "") + "</h2>" : "") + p.verses.map(function (v) { return "<p>" + (s.nums && v[0] ? "<sup>" + esc(v[0]) + "</sup>" : "") + esc(v[1]) + "</p>"; }).join("") + "</div>"; }).join("");
      var pad = 'style="padding-top:' + (1080 - top - bot) * 0.55 + 'px"';
      box.innerHTML = '<div class="trk"><div class="copy" ' + pad + ">" + html + '</div><div class="copy" ' + pad + ">" + html + "</div></div>";
      st.appendChild(box); this.parts.push({ key: "scroll", trk: box.firstChild, axis: "y", speed: function () { return self.s.scrollSpeed; } });
    }
    if (ticker) {
      var DOT = '<span class="dot">✦</span>';
      var sLine = !useS ? "" : on.map(function (p) { return (s.refs ? '<span class="r">' + esc(p.ref) + "</span>" : "") + p.verses.map(function (v) { return (s.nums && v[0] ? "<sup>" + esc(v[0]) + "</sup>" : "") + esc(v[1]); }).join(" "); }).join(DOT) + DOT;
      var line = sLine + (!useC ? "" : custom.map(esc).join(DOT) + DOT);
      ["top", "bottom", "left", "right"].forEach(function (side) {
        if (!E[side]) return;
        var v = side === "left" || side === "right", el = document.createElement("div");
        el.className = "edge " + (v ? "v " : "h ") + side + " f-" + s.tfont + (s.band ? " band" : "");
        el.style.fontSize = s.tsize + "px";
        if (v) { el.style.width = T + "px"; el.style[side] = "0"; el.style.top = top + "px"; el.style.bottom = bot + "px"; }
        else { el.style.height = T + "px"; el.style[side] = "0"; }
        var tag = s.label && (!v || (!E.bottom && !E.top)) ? '<div class="tag">' + esc(s.label) + "</div>" : "";
        var lane = '<div class="lane"><div class="trk"><div class="copy">' + line + '</div><div class="copy">' + line + "</div></div></div>";
        el.innerHTML = side === "right" ? lane + tag : tag + lane;
        st.appendChild(el); self.parts.push({ key: side, one: line, trk: el.querySelector(".trk"), axis: v ? "y" : "x", speed: function () { return self.s.tickerSpeed; } });
      });
    }
    var m = function () { self.parts.forEach(function (p) {
      var c = p.trk.firstChild, size = function () { return p.axis === "x" ? c.offsetWidth : c.offsetHeight; };
      if (p.one) {       // short text repeats next to itself, spacer between, until it fills the longest side of the screen
        c.innerHTML = p.one; var one = size(), n = one ? Math.ceil((Math.max(W, 1080) + 200) / one) : 1, all = new Array(n + 1).join(p.one);
        p.trk.children[0].innerHTML = all; p.trk.children[1].innerHTML = all;
      }
      p.len = size();
    }); };
    requestAnimationFrame(m); if (document.fonts) { document.fonts.load("500 40px \"" + FONTS[s.tfont][0] + "\"").then(m, m); document.fonts.ready.then(m); }
  };
  // One word, full screen. The size follows the word: long words fit the width, short ones fit the height; Scale adjusts from there.
  Stage.prototype.buildWord = function (s) {
    var word = (s.word || "").trim(), self = this, f = FONTS[s.wfont] || FONTS.anton;
    if (!word) return;
    this.wrap.style.mixBlendMode = s.wblend;
    var font = (f[2] ? f[2] + " " : "") + f[1] + ' 100px "' + f[0] + '"';
    var draw = function () {
      if (self.s !== s || s.mode !== "word" || !s.on) return;
      var ctx = self.mc || (self.mc = document.createElement("canvas").getContext("2d")); ctx.font = font;
      var m = ctx.measureText(word), l = m.actualBoundingBoxLeft, r = m.actualBoundingBoxRight, a = m.actualBoundingBoxAscent, d = m.actualBoundingBoxDescent;
      if (!(l + r) || !(a + d)) return;
      var W = self.W, k = Math.min(0.88 * W / (l + r), 0.78 * 1080 / (a + d)) * s.wscale / 100;   // k: font scale from the 100px measure
      var x = W / 2 + (l - r) / 2 * k, y = 540 + (a - d) / 2 * k;                                 // centre the letters themselves, not their line box
      self.el.innerHTML = '<svg width="' + W + '" height="1080" viewBox="0 0 ' + W + ' 1080"><text x="' + x + '" y="' + y + '" fill="' + esc(s.fg) + '" opacity="' + s.wopacity / 100 + '" font-family="&quot;' + f[0] + '&quot;, Georgia, serif" font-weight="' + f[1] + '" font-style="' + (f[2] || "normal") + '" font-size="' + 100 * k + '" text-rendering="geometricPrecision">' + esc(word) + "</text></svg>";
    };
    draw();
    if (document.fonts) { document.fonts.load(font, word).then(draw, draw); document.fonts.ready.then(draw); }
  };
  Stage.prototype.restart = function () { this.off = {}; if (this.fx && this.s && this.s.mode === "fx") this.fx.take(); };
  Stage.prototype.tick = function (t) {
    var dt = Math.min(0.1, (t - (this.last || t)) / 1000), self = this; this.last = t;
    if (this.s) this.parts.forEach(function (p) {
      if (!p.len) return;
      var o = self.off[p.key] || 0;
      if (self.s.playing) o += p.speed() * dt;
      o %= p.len; self.off[p.key] = o;
      p.trk.style.transform = p.axis === "x" ? "translate3d(" + -o + "px,0,0)" : "translate3d(0," + -o + "px,0)";
    });
    requestAnimationFrame(function (t2) { self.tick(t2); });
  };

  function outputKeys(get, stage) {
    addEventListener("keydown", function (e) {
      if (e.key === "f" || e.key === "F") { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(function () {}); }
      if (e.key === " ") { var s = get(); s.playing = !s.playing; e.preventDefault(); }
      if (e.key === "r" || e.key === "R") stage.restart();
    });
    addEventListener("dblclick", function () { document.documentElement.requestFullscreen().catch(function () {}); });
  }

  // /scripture?out=1&s=... : text only, for a ProPresenter Web element or OBS Browser Source
  function bootTextOutput() {
    css(); document.body.className = "scr-out";
    var root = document.createElement("div"); root.id = "scr-root"; document.body.appendChild(root);
    var q = new URLSearchParams(location.search).get("s"), S = stored();
    if (q) { try { S = merge(b64d(q)); } catch (e) {} }
    S.on = true;
    var stage = new Stage(root); stage.build(S);
    var bc = null; try { bc = new BroadcastChannel(CH); } catch (e) {}
    if (bc && !q) bc.onmessage = function (e) { if (e.data.restart) stage.restart(); if (e.data.state) { S = e.data.state; S.on = true; stage.build(S); } };
    outputKeys(function () { return S; }, stage);
  }

  // /studio?out=1 : the loop full window with the text on top, following the Studio live
  function bootStudioOutput() {
    css(); document.body.classList.add("studio-out");
    var S = stored(), stage = new Stage(document.querySelector(".studio-screen")); stage.build(S);
    var bc = null; try { bc = new BroadcastChannel(CH); } catch (e) {}
    if (bc) bc.onmessage = function (e) { if (e.data.restart) stage.restart(); if (e.data.state) { S = e.data.state; stage.build(S); } };
    outputKeys(function () { return S; }, stage);
  }

  // The Studio's Text tab
  function mountControls() {
    var pane = document.querySelector('[data-pane="text"]'), screen = document.querySelector(".studio-screen");
    if (!pane || !screen) return;
    css(); pane.classList.add("scr-pane");
    var S = stored(); S.on = false;      // text never appears by itself when the Studio opens
    var stage = new Stage(screen), touched = false, fontOpts = function () { return FONT_NAMES.map(function (f) { return opt(f[0], f[1]); }).join(""); };
    var bc = null; try { bc = new BroadcastChannel(CH); } catch (e) {}
    function opt(v, l, sel) { return '<option value="' + esc(v) + '"' + (sel ? " selected" : "") + ">" + esc(l) + "</option>"; }
    function slider(id, label, min, max, step) { return '<label class="tune-row"><span>' + label + ' <b></b></span><input type="range" data-sk="' + id + '" min="' + min + '" max="' + max + '" step="' + (step || 1) + '"></label>'; }
    function pills(id, items) { return '<div class="seg" id="' + id + '">' + items.map(function (i) { return '<button type="button" data-v="' + i[0] + '" aria-pressed="false">' + i[1] + "</button>"; }).join("") + "</div>"; }
    pane.innerHTML =
      '<p class="pane-hint">Put words over your loop.</p>' +
      '<fieldset class="group"><legend>Text</legend>' +
        '<div class="scr-row"><button type="button" class="btn primary" id="scr-on"></button><button type="button" class="btn" id="scr-play"></button><button type="button" class="btn" id="scr-restart">Restart</button></div>' +
        pills("scr-mode", [["fx", "Treatments"], ["ticker", "Ticker"], ["word", "Full screen"], ["scroll", "Scroll"]]) +
      "</fieldset>" +
      '<fieldset class="group" id="scr-sec-fx"><legend>Text treatment</legend>' +
        '<div class="seg pick-grid" id="fx-grid"></div>' +
        '<textarea class="scr-in" id="fx-lines" placeholder="Your words. One line each. Walls repeat them, lyric treatments step through them."></textarea>' +
        '<div class="scr-row"><select class="scr-in" id="fx-font" style="flex:1;width:auto" aria-label="Font">' + fontOpts() + '</select><label class="scr-ck"><input type="checkbox" id="fx-caps"> All caps</label></div>' +
        slider("fxSpeed", "Speed", 0, 300) + slider("fxSize", "Size", 30, 200) + slider("fxDens", "Density", 0, 100) + '<div id="fx-amt-row">' + slider("fxAmt", "Amount", 0, 100) + "</div>" + slider("fxSpace", "Spacing", 0, 100) + slider("fxGlow", "Glow", 0, 100) + slider("fxOpac", "Opacity", 0, 100) +
        '<div class="scr-note">Blend mode</div>' + pills("fx-blend", BLENDS) + "</fieldset>" +
      '<fieldset class="group" id="scr-sec-word"><legend>Full-screen word</legend>' +
        '<input class="scr-in" id="scr-word" type="text" placeholder="One word" spellcheck="false" autocomplete="off" aria-label="One word">' +
        slider("wscale", "Scale", 20, 200) + slider("wopacity", "Opacity", 0, 100) +
        '<p class="scr-note">The size fits the word automatically. Scale goes bigger or smaller from there.</p>' +
        '<div class="scr-note">Blend mode</div>' + pills("scr-wblend", BLENDS) +
        '<select class="scr-in" id="scr-wfont" aria-label="Font">' + fontOpts() + "</select></fieldset>" +
      '<fieldset class="group" id="scr-sec-ticker"><legend>Ticker</legend>' +
        pills("scr-edges", [["bottom", "Bottom"], ["top", "Top"], ["left", "Left"], ["right", "Right"]]) +
        pills("scr-tsrc", [["custom", "Your text"], ["scripture", "Scripture"], ["both", "Both"]]) +
        '<label class="scr-ck"><input type="checkbox" id="scr-tscroll"> Verse scroll in the centre too</label>' +
        '<textarea class="scr-in" id="scr-ttext" placeholder="Type a word or a message. One message per line. Short text repeats to fill the ticker."></textarea>' +
        slider("tickerSpeed", "Speed", 20, 400) + slider("tsize", "Text size", 20, 80) +
        '<div class="scr-row"><select class="scr-in" id="scr-tfont" style="flex:1;width:auto" aria-label="Font">' + fontOpts() + '</select><input class="scr-in" id="scr-label" type="text" placeholder="Label (optional)" style="width:130px" aria-label="Ticker label"></div>' +
        '<label class="scr-ck"><input type="checkbox" id="scr-band"> Dark band behind the ticker</label></fieldset>' +
      '<fieldset class="group" id="scr-sec-bible"><legend>Scripture</legend>' +
        pills("scr-src", [["bible", "Bible"], ["paste", "Paste your own"]]) +
        '<div id="scr-bible" style="display:grid;gap:8px"><select class="scr-in" id="scr-tr">' + TRANS.map(function (t) { return opt(t[0], t[1]); }).join("") + "</select>" +
          '<div class="scr-row"><select class="scr-in" id="scr-book" style="flex:1 1 140px;width:auto">' + BOOKS.map(function (b) { return opt(b[0], b[0], b[0] === "John"); }).join("") + '</select>' +
          '<input class="scr-in" id="scr-chap" type="number" min="1" value="3" style="width:68px" aria-label="Chapter"><input class="scr-in" id="scr-vs" type="text" placeholder="16-21" style="width:80px" aria-label="Verses, blank for the whole chapter"></div>' +
          '<div class="scr-row"><input class="scr-in" id="scr-quick" type="text" placeholder="or type it: Romans 8:28-39" style="flex:1;width:auto"><button type="button" class="btn primary" id="scr-add">Add</button></div></div>' +
        '<div id="scr-paste" style="display:none;gap:8px"><input class="scr-in" id="scr-pref" type="text" placeholder="Reference, e.g. Isaiah 40:31 NIV"><textarea class="scr-in" id="scr-ptext" placeholder="One verse per line. Start a line with its number to show it: 31 But those who wait…"></textarea>' +
          '<div class="scr-row"><button type="button" class="btn primary" id="scr-padd">Add</button><span class="scr-note">For translations your church is licensed to show (NIV, ESV…)</span></div></div>' +
        '<p class="scr-msg" id="scr-msg"></p><div class="scr-list" id="scr-list"></div>' +
        '<label class="scr-ck"><input type="checkbox" id="scr-nums"> Verse numbers</label><label class="scr-ck"><input type="checkbox" id="scr-refs"> References</label></fieldset>' +
      '<fieldset class="group" id="scr-sec-scroll"><legend>Verse scroll</legend><div class="scr-note">Scripture font</div>' +
        '<div class="scr-row"><select class="scr-in" id="scr-font" style="flex:1;width:auto" aria-label="Scripture font">' + fontOpts() + '</select><select class="scr-in" id="scr-align" style="width:auto" aria-label="Alignment">' + opt("center", "Centred") + opt("left", "Left") + "</select></div>" +
        slider("scrollSpeed", "Speed", 5, 160) + slider("size", "Text size", 32, 130) + slider("width", "Width", 700, 1800, 10) + "</fieldset>" +
      '<fieldset class="group"><legend>Colors &amp; background</legend><div class="scr-row"><input type="color" id="scr-fg" aria-label="Text color"><span class="scr-note">Text</span><input type="color" id="scr-ac" aria-label="Accent color"><span class="scr-note">Accent</span></div>' +
        '<div class="scr-note">Behind the text</div>' + pills("scr-bg", [["loop", "Loop"], ["black", "Black"], ["green", "Green"]]) + '<div id="scr-dimrow">' + slider("dim", "Background dim", 0, 100) + "</div>" +
        '<p class="scr-note">While the text is showing it travels with the design: Copy render code and Share link include it, and Altar Render burns it into the file. Altar Live for Mac and Windows has this same tab and sends it out over NDI® (ndi.video). Bible text: public-domain translations via bible-api.com. The King James is under Crown protection in the UK, so UK churches should check before showing it.</p></fieldset>';
      // The "Send it out" controls (output window, text-only link) were removed from the Studio on 2026-11-02; the /studio?out=1 and /scripture?out=1 pages still work for existing links.
    var $ = function (id) { return document.getElementById(id); }, q = function (sel) { return pane.querySelectorAll(sel); };
    function msg(t) { $("scr-msg").textContent = t || ""; }
    function commit(rebuild) {
      touched = true;
      try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
      if (rebuild !== false) stage.build(S); else stage.s = S;
      if (bc) bc.postMessage({ state: S });
      ui();
    }
    function press(id, on) { q("#" + id + " button").forEach(function (b) { b.setAttribute("aria-pressed", on(b.dataset.v)); }); }
    function ui() {
      $("scr-on").textContent = S.on ? "Hide text" : "Show text";
      $("scr-play").textContent = S.playing ? "Pause" : "Play";
      press("scr-mode", function (v) { return S.mode === v; }); press("scr-wblend", function (v) { return S.wblend === v; });
      $("scr-sec-fx").style.display = S.mode === "fx" ? "" : "none"; if ($("scr-sec-flow")) $("scr-sec-flow").style.display = S.mode === "fx" ? "" : "none"; press("fx-blend", function (v) { return S.fxBlend === v; }); q("#fx-grid button").forEach(function (b) { b.setAttribute("aria-pressed", +b.dataset.i === S.fxId); }); if (document.activeElement !== $("fx-lines")) $("fx-lines").value = S.fxLines; $("fx-font").value = S.fxFont; $("fx-caps").checked = S.fxCaps; if ($("fx-loop")) { $("fx-loop").checked = S.fxLoop; $("fx-in").value = S.fxIn; $("fx-out").value = S.fxOut; } var fxLab = $("fx-amt-row").querySelector("span"); if (fxLab && window.AltarTextFX) fxLab.firstChild.textContent = AltarTextFX.TREATMENTS[S.fxId].amt + " ";
      var bible = S.mode === "scroll" || (S.mode === "ticker" && (S.tsrc !== "custom" || S.tscroll));
      $("scr-sec-word").style.display = S.mode === "word" ? "" : "none"; $("scr-sec-ticker").style.display = S.mode === "ticker" ? "" : "none";
      $("scr-sec-scroll").style.display = S.mode === "scroll" || (S.mode === "ticker" && S.tscroll) ? "" : "none"; $("scr-sec-bible").style.display = bible ? "" : "none";
      $("scr-dimrow").style.display = S.bg === "loop" ? "" : "none";
      $("scr-play").style.display = $("scr-restart").style.display = S.mode === "word" ? "none" : "";
      if (document.activeElement !== $("scr-word")) $("scr-word").value = S.word;
      press("scr-edges", function (v) { return !!S.edges[v]; }); press("scr-tsrc", function (v) { return S.tsrc === v; }); press("scr-bg", function (v) { return S.bg === v; });
      q("[data-sk]").forEach(function (i) { var k = i.dataset.sk; i.value = S[k]; i.style.setProperty("--fill", ((S[k] - i.min) / (i.max - i.min) * 100) + "%"); i.closest(".tune-row").querySelector("b").textContent = S[k] + (k === "wscale" || k === "wopacity" || k === "dim" || k === "fxSpeed" || k === "fxSize" || k === "fxDens" || k === "fxAmt" || k === "fxSpace" || k === "fxGlow" || k === "fxOpac" || k === "fxTurb" || k === "fxScale" || k === "fxEdge" ? "%" : k === "fxInDur" || k === "fxOutDur" || k === "fxHold" ? " s" : ""); });
      ["font", "align", "tfont", "wfont", "fg", "ac"].forEach(function (k) { $("scr-" + k).value = S[k]; });
      ["band", "nums", "refs", "tscroll"].forEach(function (k) { $("scr-" + k).checked = S[k]; });
      if (document.activeElement !== $("scr-label")) $("scr-label").value = S.label;
      if (document.activeElement !== $("scr-ttext")) $("scr-ttext").value = S.ttext;
      $("scr-ttext").style.display = S.tsrc === "scripture" ? "none" : "block";
      $("scr-list").innerHTML = S.passages.length ? S.passages.map(function (p, i) {
        return '<div class="scr-item' + (p.on ? "" : " off") + '" data-i="' + i + '"><input type="checkbox" ' + (p.on ? "checked" : "") + ' data-a="on" aria-label="Show ' + esc(p.ref) + '"><b title="' + esc(p.ref) + '">' + esc(p.ref) + "</b><small>" + esc(p.tr || "") + '</small><button type="button" class="scr-x" data-a="up" aria-label="Move up">↑</button><button type="button" class="scr-x" data-a="del" aria-label="Remove">✕</button></div>';
      }).join("") : '<p class="scr-note">Nothing yet. Add a passage above.</p>';
    }
    function turnOnOnce() { if (!touched) { S.on = true; commit(); } }
    document.querySelectorAll('[data-tab="text"]').forEach(function (b) { b.addEventListener("click", turnOnOnce); });
    q("[data-sk]").forEach(function (i) { var k = i.dataset.sk, soft = k === "scrollSpeed" || k === "tickerSpeed" || k === "dim" || k.indexOf("fx") === 0; i.addEventListener("input", function () { S[k] = +i.value; commit(!soft); if (k === "dim") stage.paintUnder(); }); });
    ["font", "align", "tfont", "wfont"].forEach(function (k) { $("scr-" + k).addEventListener("change", function (e) { S[k] = e.target.value; commit(); }); });
    ["fg", "ac"].forEach(function (k) { $("scr-" + k).addEventListener("input", function (e) { S[k] = e.target.value; commit(); }); });
    ["band", "nums", "refs", "tscroll"].forEach(function (k) { $("scr-" + k).addEventListener("change", function (e) { S[k] = e.target.checked; commit(); }); });
    $("scr-label").addEventListener("input", function (e) { S.label = e.target.value; commit(); });
    $("scr-ttext").addEventListener("input", function (e) { S.ttext = e.target.value; commit(); });
    // one word only: the first word of whatever is typed or pasted
    $("scr-word").addEventListener("input", function (e) { var w = e.target.value.trim().split(/\s+/)[0] || ""; if (e.target.value !== w) e.target.value = w; S.word = w; commit(); });
        if (window.AltarTextFX) {
      var FXT = AltarTextFX.TREATMENTS, fxo = AltarTextFX.FLOWS.map(function (n, i) { return opt(i, n); }).join(""); if ($("fx-in")) { $("fx-in").innerHTML = fxo; $("fx-out").innerHTML = fxo; }
      $("fx-grid").innerHTML = FXT.map(function (t, i) { return '<button type="button" data-i="' + i + '" title="' + esc(t.name) + '"><img alt=""><span>' + esc(t.name) + "</span></button>"; }).join("");
      var drawTiles = function () { var i = 0, list = q("#fx-grid button"); (function next() { var t0 = performance.now(); while (i < list.length && performance.now() - t0 < 12) { list[i].querySelector("img").src = AltarTextFX.thumb(i, FONTS, S, 320, 180, 2.2); i++; } if (i < list.length) requestAnimationFrame(next); })(); };
      drawTiles(); if (document.fonts) document.fonts.ready.then(drawTiles);
      $("fx-grid").addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; S.fxId = +b.dataset.i; commit(false); });
      $("fx-lines").addEventListener("input", function (e) { S.fxLines = e.target.value; commit(false); });
      $("fx-font").addEventListener("change", function (e) { S.fxFont = e.target.value; commit(false); drawTiles(); if (document.fonts) document.fonts.load('400 40px "' + FONTS[S.fxFont][0] + '"').then(drawTiles); });
      $("fx-caps").addEventListener("change", function (e) { S.fxCaps = e.target.checked; commit(false); drawTiles(); });
      $("fx-blend").addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; S.fxBlend = b.dataset.v; commit(); });
      if ($("fx-loop")) {       // the on/off flow controls are only built on the test link
      $("fx-loop").addEventListener("change", function (e) { S.fxLoop = e.target.checked; commit(false); });
      $("fx-in").addEventListener("change", function (e) { S.fxIn = +e.target.value; commit(false); stage.fx.take(); });
      $("fx-out").addEventListener("change", function (e) { S.fxOut = +e.target.value; commit(false); stage.fx.off(); });
      $("fx-take").onclick = function () { if (!S.on) { S.on = true; commit(); } else stage.fx.take(); };
      $("fx-off").onclick = function () { stage.fx.off(); };
      }
    }
    $("scr-mode").addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; S.mode = b.dataset.v; commit(); });
    window.__altarFxStage = stage;
    $("scr-wblend").addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; S.wblend = b.dataset.v; commit(); });
    $("scr-on").onclick = function () { if (S.on && S.mode === "fx" && stage.fx) { stage.fx.off(function () { S.on = false; commit(); }); return; } S.on = !S.on; commit(); };
    $("scr-play").onclick = function () { S.playing = !S.playing; commit(false); };
    $("scr-restart").onclick = function () { stage.restart(); if (bc) bc.postMessage({ restart: true }); };
    $("scr-edges").addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; S.edges[b.dataset.v] = !S.edges[b.dataset.v]; commit(); });
    $("scr-tsrc").addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; S.tsrc = b.dataset.v; if (!S.edges.bottom && !S.edges.top && !S.edges.left && !S.edges.right) S.edges.bottom = true; commit(); });
    $("scr-bg").addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; S.bg = b.dataset.v; commit(); });
    $("scr-src").addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; var bible = b.dataset.v === "bible"; $("scr-bible").style.display = bible ? "grid" : "none"; $("scr-paste").style.display = bible ? "none" : "grid"; press("scr-src", function (v) { return v === b.dataset.v; }); msg(); });
    press("scr-src", function (v) { return v === "bible"; });
    $("scr-book").addEventListener("change", function () { var n = BOOKS.filter(function (b) { return b[0] === $("scr-book").value; })[0][1]; $("scr-chap").max = n; if (+$("scr-chap").value > n) $("scr-chap").value = n; });
    function addRef(ref) {
      var tr = $("scr-tr").value; msg("Loading " + ref + "…");
      fetch("https://bible-api.com/" + encodeURIComponent(ref) + "?translation=" + tr).then(function (r) { return r.json().then(function (j) { if (!r.ok || !j.verses) throw 0; return j; }); }).then(function (j) {
        var chs = {}; j.verses.forEach(function (v) { chs[v.chapter] = 1; }); var multi = Object.keys(chs).length > 1;
        S.passages.push({ id: "p" + Date.now(), ref: j.reference, tr: tr.toUpperCase(), on: true, verses: j.verses.map(function (v) { return [multi ? v.chapter + ":" + v.verse : v.verse, v.text.replace(/\s+/g, " ").trim()]; }) });
        msg(); commit();
      }).catch(function () { msg("Couldn't find “" + ref + "”. Check the reference and try again."); });
    }
    $("scr-add").onclick = function () { var v = $("scr-quick").value.trim(); if (v) { $("scr-quick").value = ""; addRef(v); return; } var vs = $("scr-vs").value.trim(); addRef($("scr-book").value + " " + $("scr-chap").value + (vs ? ":" + vs : "")); };
    ["scr-quick", "scr-vs", "scr-chap"].forEach(function (id) { $(id).addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); $("scr-add").click(); } }); });
    $("scr-padd").onclick = function () {
      var lines = $("scr-ptext").value.split(/\n+/).map(function (l) { return l.trim(); }).filter(Boolean);
      if (!lines.length) { msg("Paste some verses first."); return; }
      S.passages.push({ id: "p" + Date.now(), ref: $("scr-pref").value.trim() || "Scripture", tr: "", on: true, verses: lines.map(function (l) { var m = l.match(/^(\d+(?::\d+)?)[.)]?\s+(.*)$/); return m ? [m[1], m[2]] : [0, l]; }) });
      $("scr-pref").value = ""; $("scr-ptext").value = ""; msg(); commit();
    };
    $("scr-list").addEventListener("click", function (e) {
      var it = e.target.closest(".scr-item"), a = e.target.dataset.a; if (!it || !a) return; var i = +it.dataset.i;
      if (a === "on") S.passages[i].on = e.target.checked;
      if (a === "del") S.passages.splice(i, 1);
      if (a === "up" && i > 0) S.passages.splice(i - 1, 0, S.passages.splice(i, 1)[0]);
      commit();
    });
    stage.build(S); ui();
    if (/[?&]tab=text\b/.test(location.search)) turnOnOnce();
    // the design carries the text: studio.js puts it in render codes and share links, and takes it back out
    window.AltarScripture.get = function () { if (!S.on) return null; var t = JSON.parse(JSON.stringify(S)); delete t.playing; return t; };
    window.AltarScripture.set = function (t) { S = merge(t); S.on = true; touched = true; commit(); };
    window.AltarScripture.hide = function () { if (S.on) { S.on = false; touched = true; commit(); } };
  }

  window.AltarScripture = { bootTextOutput: bootTextOutput, bootStudioOutput: bootStudioOutput, mountControls: mountControls };
})();
