/* Altar Loops storefront. Plain JS, no build step. Each page sets <body data-page="..."> and this file does the rest. */
(function () {
  "use strict";
  var page = document.body.dataset.page;
  // Library filter tags come from site.json ("filters" = the chips, "tags" = which chips each pack belongs to).
  var SITE = { filters: [], tags: {} };
  function tags(p) { return (SITE.tags && SITE.tags[p.slug]) || [p.family]; }
  // Everyday color words for the loop palette names, so a search for "purple" or "blue" finds them.
  var COLOR_WORDS = {
    abyss: "blue dark navy", amber: "orange gold yellow warm", aurora: "green teal purple", bioluminescent: "blue teal green",
    chrome: "silver grey gray white", cobalt: "blue", copper: "orange brown warm", crimson: "red", dusk: "purple orange pink warm",
    ember: "orange red warm", emerald: "green", flame: "orange red warm", gilded: "gold yellow warm", glacier: "blue white ice cool",
    gold: "yellow warm", ice: "blue white cool", indigo: "blue purple", infrared: "red", jade: "green", lapis: "blue",
    magenta: "pink purple", midnight: "blue dark navy", mono: "black white grey gray", neon: "bright", night: "dark blue",
    nordic: "blue white cool", orchid: "purple pink", oxblood: "red dark", pink: "rose", plum: "purple", rose: "pink",
    rosewater: "pink", saffron: "orange yellow warm", sea: "blue teal", silver: "grey gray white", steel: "blue grey gray",
    sunset: "orange pink warm", teal: "blue green", tide: "blue teal", ultraviolet: "purple violet", verdant: "green", violet: "purple"
  };
  function colorWords(label) {
    return label.toLowerCase().split(/[^a-z]+/).map(function (w) { return COLOR_WORDS[w] || ""; }).join(" ");
  }
  function tagLabel(id) { var f = (SITE.filters || []).filter(function (x) { return x.id === id; })[0]; return f ? f.label : id; }
  // Errors on the page go to /api/client-error (then to Sentry when the site has a DSN). Message and position only: no
  // query strings, no cookies, nothing typed into a form. At most a few per visit.
  (function () {
    var sent = 0;
    window.addEventListener("error", function (e) {
      if (sent++ > 4 || !e || !e.message || window.AL_PREVIEW) return;
      try {
        var body = JSON.stringify({ message: String(e.message).slice(0, 500), source: String(e.filename || "").replace(/\?.*$/, ""), line: e.lineno || 0, col: e.colno || 0,
          stack: e.error && e.error.stack ? String(e.error.stack).slice(0, 1500) : "", page: location.pathname, release: (document.querySelector('script[src*="app.js?v="]') || {}).src ? document.querySelector('script[src*="app.js?v="]').src.split("v=")[1] : "" });
        if (navigator.sendBeacon) navigator.sendBeacon("/api/client-error", new Blob([body], { type: "application/json" }));
        else fetch("/api/client-error", { method: "POST", headers: { "content-type": "application/json" }, body: body, keepalive: true });
      } catch (er) {}
    });
  })();
  var canHover = window.matchMedia("(hover: hover)").matches;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var qs = new URLSearchParams(location.search);
  // Share-preview build (scripts/build_share.py): no server, so no sign-in, checkout or form sending.
  var PREVIEW = !!window.AL_PREVIEW;
  var PREVIEW_MSG = "Preview only: checkout opens when the site launches.";
  // Pre-launch: /api/me reports SALES_OPEN from wrangler.toml. Stays closed if that call fails.
  var SALES_OPEN = false;
  var SOON_BTN = '<button class="btn" type="button" disabled>Opens at launch</button>';

  /* ---------- helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function nn(n) { return (n < 10 ? "0" : "") + n; }
  function poster(slug, n) { return "/p/" + slug + "/" + nn(n) + ".jpg"; }
  function preview(slug, n) { return "/p/" + slug + "/" + nn(n) + ".mp4"; }
  function money(n) { return SALES_OPEN ? "$" + Number(n).toLocaleString("en-US") : "Pricing soon"; }   // no amounts on the site until launch
  function size(b) { return b >= 1e9 ? (b / 1e9).toFixed(1) + " GB" : Math.max(1, Math.round(b / 1e6)) + " MB"; }
  function dlUrl(key) { return "/dl/" + key.split("/").map(encodeURIComponent).join("/"); }
  function toast(msg) {
    var t = document.createElement("div");
    t.className = "toast"; t.setAttribute("role", "status"); t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 4200);
  }
  function getJSON(url) { return fetch(url, { credentials: "same-origin" }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }); }
  function post(url, body) {
    return fetch(url, { method: "POST", credentials: "same-origin", headers: { "content-type": "application/json" }, body: JSON.stringify(body || {}) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { if (!r.ok) throw new Error(d.error || "Something went wrong. Try again."); return d; }); });
  }

  // Same content stamp as this script's own ?v= (set by scripts/deploy.py), so data files are never served stale.
  var VER = ((document.currentScript && document.currentScript.src.match(/[?&]v=([0-9a-f]+)/)) || [])[1] || "";
  var data = Promise.all([
    getJSON("/catalog.json" + (VER ? "?v=" + VER : "")).catch(function () { return { packs: [] }; }),
    getJSON("/site.json" + (VER ? "?v=" + VER : "")),
    (PREVIEW ? Promise.reject() : getJSON("/api/me")).catch(function () { return { email: null, plan: null, packs: [], offline: true }; })
  ]).then(function (r) {
    // site.json "lineup" picks which packs the site shows, in order. Without it, every pack in the catalog shows.
    var packs = r[0].packs || [], lineup = r[1].lineup;
    if (lineup && lineup.length) {
      packs = lineup.map(function (slug) { return packs.filter(function (p) { return p.slug === slug; })[0]; }).filter(Boolean);
    }
    SITE = r[1];
    SALES_OPEN = r[2].salesOpen === true;
    return { catalog: packs, site: r[1], me: r[2] };
  });

  function owns(me, slug, format) {
    if (!me || !me.email) return false;
    if (me.plan && me.plan.tier === "premium") return true;
    if (me.packs.indexOf(slug) >= 0) return true;
    return !!(me.plan && me.plan.tier === "basic" && format !== "prores");
  }

  function checkout(kind, extra, btn) {
    if (PREVIEW) { toast(PREVIEW_MSG); return Promise.resolve(); }
    if (!SALES_OPEN) { toast("Purchases open when the full beta launches."); return Promise.resolve(); }
    if (btn) btn.classList.add("busy");
    var body = Object.assign({ kind: kind }, extra || {});
    return post("/api/checkout", body).then(function (d) { location.href = d.url; })
      .catch(function (e) { toast(e.message); if (btn) btn.classList.remove("busy"); });
  }

  /* ---------- header + footer on every page ---------- */
  function header(me) {
    var head = $("#site-head");
    if (head) {
      var signedIn = me && me.email;
      head.className = "site-head";
      head.innerHTML =
        (SALES_OPEN || PREVIEW ? "" : '<div class="beta-bar"><span><b>Full beta launching soon.</b> Purchases aren\'t open yet, but you can test the Studio builder now<span class="bb-x">, no account needed</span>.</span>' +
          '<span class="bb-links">' + (page === "beta" ? "" : '<a href="/beta">Sign up for the beta</a>') + (page === "studio" ? "" : '<a href="/studio">Open the Studio</a>') + "</span></div>") +
        '<div class="wrap">' +
          '<a class="wordmark" href="/" aria-label="Altar Loops home"><img class="logo" src="/brand/logo-header.png?v=' + VER + '" alt="Altar Loops" width="632" height="127">' +
            (PREVIEW ? '<span class="label preview-tag">Preview</span>' : "") + "</a>" +
          '<nav class="nav" aria-label="Main">' +
            '<a href="/studio"' + (page === "studio" ? ' aria-current="page"' : "") + '>Studio</a>' +
            '<a href="/live"' + (page === "live" ? ' aria-current="page"' : "") + '>Live</a>' +
            '<a href="/library"' + (page === "library" ? ' aria-current="page"' : "") + '>Library</a>' +
            '<a href="/plans"' + (page === "plans" ? ' aria-current="page"' : "") + '>Plans</a>' +
            '<a href="/custom"' + (page === "custom" ? ' aria-current="page"' : "") + '>Custom</a>' +
            '<a href="/license"' + (page === "license" ? ' aria-current="page"' : "") + '>License</a>' +
            (signedIn ? acctMenu(me)
              : '<a class="nav-signin" href="/signin"' + (page === "signin" ? ' aria-current="page"' : "") + '>Sign in</a><a class="btn primary" href="/studio">Open the Studio</a>') +
          "</nav>" +
        "</div>";
      // the header is position: fixed, so pages pad by its real height (it is shorter on phones)
      var setHead = function () {
        var rs = document.documentElement.style, bar = head.querySelector(".beta-bar");
        rs.setProperty("--head-h", head.offsetHeight + "px");
        rs.setProperty("--bar-h", (bar ? bar.offsetHeight : 0) + "px");   // the home hero runs under the header, so it makes room for the banner
      };
      setHead(); window.addEventListener("resize", setHead);
    }
  }

  function acctMenu(me) {
    var tier = me.plan && me.plan.tier;
    return '<details class="acct-menu"><summary class="btn"><span class="avatar" aria-hidden="true">' + esc(me.email.charAt(0).toUpperCase()) + "</span>My loops</summary>" +
      '<div class="menu" role="menu">' +
        '<div class="who"><span class="mono">' + esc(me.email) + '</span><span class="label">' +
          (tier ? esc(tier) + " member" : me.packs.length ? me.packs.length + " pack" + (me.packs.length === 1 ? "" : "s") : "No plan yet") + "</span></div>" +
        '<a role="menuitem" href="/account">My loops</a>' +
        '<a role="menuitem" href="/library">Library</a>' +
        (me.billing ? '<button role="menuitem" type="button" data-portal>Billing and receipts</button>' : "") +
        '<button role="menuitem" type="button" data-logout>Sign out</button>' +
      "</div></details>";
  }

  function signOut() {
    post("/api/auth/logout").then(function () { location.href = "/"; }).catch(function (e) { toast(e.message); });
  }

  // Close the account menu on outside click or Escape.
  document.addEventListener("click", function (e) {
    var m = $(".acct-menu[open]");
    if (m && !m.contains(e.target)) m.removeAttribute("open");
    if (e.target.closest && e.target.closest("[data-logout]")) signOut();
    var pb = e.target.closest && e.target.closest(".acct-menu [data-portal]");
    if (pb) openPortal(pb);
  });
  document.addEventListener("keydown", function (e) {
    var m = $(".acct-menu[open]");
    if (e.key === "Escape" && m) { m.removeAttribute("open"); m.querySelector("summary").focus(); }
  });

  function footer(cat) {
    var foot = $("#site-foot");
    if (foot) {
      var packs = (cat || []).slice(0, 5);
      var col = function (title, links) {
        return '<nav class="foot-col" aria-label="' + title + '"><span class="label">' + title + "</span>" +
          links.map(function (l) { return '<a href="' + l[1] + '">' + esc(l[0]) + "</a>"; }).join("") + "</nav>";
      };
      foot.className = "site-foot";
      foot.innerHTML =
        '<div class="wrap foot-cta">' +
          '<span class="label">Altar Loops</span>' +
          "<h2>Ready for <em>Sunday?</em></h2>" +
          "<p>Seamless motion for every song in the set.</p>" +
          '<div class="ctas"><a class="btn primary" href="/library">Browse the library</a><a class="btn" href="/plans">See plans</a></div>' +
        "</div>" +
        '<div class="wrap foot-grid">' +
          '<div class="foot-brand"><a href="/" aria-label="Altar Loops home"><img src="/brand/logo-header.png?v=' + VER + '" alt="Altar Loops" width="632" height="127"></a>' +
            "<p>Worship motion by SelahCreative. Abstract, seamless loops made for the room.</p></div>" +
          col("Library", packs.map(function (p) { return [p.name, "/pack?p=" + encodeURIComponent(p.slug)]; }).concat([["All packs", "/library"]])) +
          col("Plans", [["Single pack", "/plans"], ["Basic", "/plans"], ["Premium", "/plans"], ["Compare plans", "/plans#compare"]]) +
          col("Custom work", [["Custom screen sizes", "/custom#size"], ["Custom visuals", "/custom#visuals"]]) +
          col("Fine print", [["License", "/license"], ["Terms", "/legal#terms"], ["Refunds", "/legal#refunds"], ["Privacy", "/legal#privacy"], ["What's new", "/changelog"], ["Support", "/legal#support"]]) +
        "</div>" +
        '<div class="wrap foot-bar"><span>© ' + new Date().getFullYear() + ' SelahCreative</span><span class="mono">4K · 30 fps · ProRes 422 · seamless</span></div>' +
        '<div class="wrap" style="padding-top:10px;font-size:.72rem;color:var(--ash)">NDI® is a registered trademark of Vizrt NDI AB (<a href="https://ndi.video">ndi.video</a>). ProPresenter, Resolume, OBS and other product names belong to their owners. Altar Loops is not affiliated with or endorsed by them.</div>';
      // Footer background: the hero's ember Flow (already cached from the top of the page) as a quiet loop, loaded only as the footer comes near.
      var fv = document.createElement("video");
      fv.className = "foot-gl"; fv.muted = true; fv.loop = true; fv.playsInline = true; fv.preload = "none";
      fv.setAttribute("aria-hidden", "true"); fv.setAttribute("muted", ""); fv.poster = "/media/hero-flow.jpg";
      foot.insertBefore(fv, foot.firstChild);
      function startFoot() {
        if (fv.getAttribute("src")) return;
        fv.src = "/media/hero-flow.mp4";
        fv.addEventListener("playing", function () { fv.classList.add("on"); }, { once: true });
        if (reduceMotion) { fv.addEventListener("loadeddata", function () { fv.classList.add("on"); }, { once: true }); return; }
        var pr = fv.play(); if (pr && pr.catch) pr.catch(function () {});
      }
      if (io) new IntersectionObserver(function (e, o) { if (e[0].isIntersecting) { startFoot(); o.disconnect(); } }, { rootMargin: "600px 0px" }).observe(foot);
      else startFoot();
    }
  }

  /* ---------- plan cards ---------- */
  function planCard(key, p, opts) {
    return '<div class="plan' + (opts.feature ? " feature" : "") + '">' +
      (opts.tag ? '<span class="tag">' + esc(opts.tag) + "</span>" : "") +
      "<h3>" + esc(p.name) + "</h3>" +
      '<div class="price">' + (opts.price || (SALES_OPEN ? money(p.price) + " <small>" + esc(p.period) + "</small>" : "Pricing soon")) + "</div>" +
      '<p class="blurb">' + esc(p.blurb) + "</p>" +
      "<ul>" + p.features.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + "</ul>" +
      opts.cta +
    "</div>";
  }

  // opts.custom: false leaves out the custom size / custom visuals row (the home page shows the three main plans only)
  function renderPlans(el, site, me, opts) {
    opts = opts || {};
    var P = site.plans, tier = me.plan && me.plan.tier;
    function memberBtn(kind, primary) {
      if (tier === kind) return '<a class="btn" href="/account">Your current plan</a>';
      if ((tier === "premium" && kind === "basic") || (tier === "max" && kind !== "max")) return '<a class="btn" href="/account">Included in ' + esc(P[tier].name) + "</a>";
      if (tier === "premium" && kind === "basic") return '<a class="btn" href="/account">Included in Premium</a>';
      if (!SALES_OPEN) return SOON_BTN;
      if (tier) return '<button class="btn' + (primary ? " primary" : "") + '" data-portal>Switch to ' + esc(P[kind].name) + "</button>";
      return '<button class="btn' + (primary ? " primary" : "") + '" data-buy="' + kind + '">Join ' + esc(P[kind].name) + "</button>";
    }
    el.innerHTML =
      (SALES_OPEN ? "" : '<div class="notice" style="margin-bottom:18px"><span>Full beta launching soon. Pricing and purchases open at launch. Until then, you can <a href="/studio">test the Studio builder</a> or <a href="/beta">sign up for the beta</a>.</span></div>') +
      '<div class="plans">' +
        planCard("basic", P.basic, { cta: memberBtn("basic", false) }) +
        planCard("premium", P.premium, { feature: true, tag: "Best value", cta: memberBtn("premium", true) }) +
        (P.max ? planCard("max", P.max, { cta: memberBtn("max", false) }) : "") +
      "</div>" +
      // the single pack: one thin row under the plans (members already have every pack, so it just says so)
      '<div class="plans pack-row">' + planCard("pack", P.pack, { cta: tier ? '<a class="btn" href="/account">Included in ' + esc(P[tier].name) + "</a>" : SALES_OPEN ? '<a class="btn" href="/library">Choose a pack</a>' : SOON_BTN }) + "</div>" +
      (opts.custom === false ? "" :
      '<div class="plans custom">' +
        planCard("customSize", P.customSize, { cta: SALES_OPEN ? '<a class="btn" href="/custom#size">Order a custom size</a>' : SOON_BTN }) +
        planCard("customVisuals", P.customVisuals, { price: "Contact <small>for a quote</small>", cta: '<a class="btn" href="/custom#visuals">Get in touch</a>' }) +
      "</div>");
    el.querySelectorAll("[data-buy]").forEach(function (b) { b.addEventListener("click", function () { checkout(b.dataset.buy, {}, b); }); });
    el.querySelectorAll("[data-portal]").forEach(function (b) { b.addEventListener("click", function () { openPortal(b); }); });
  }

  function openPortal(btn) {
    if (PREVIEW) { toast(PREVIEW_MSG); return; }
    if (btn) btn.classList.add("busy");
    post("/api/portal").then(function (d) { location.href = d.url; })
      .catch(function (e) { toast(e.message); if (btn) btn.classList.remove("busy"); });
  }

  /* ---------- loop thumbnails that play on hover / tap ---------- */
  function wireThumb(thumb, name) {
    var vid = thumb.querySelector("video");
    function play() {
      if (!vid.getAttribute("src")) vid.src = vid.dataset.src;
      var p = vid.play(); if (p && p.catch) p.catch(function () {});
      thumb.classList.add("playing");
    }
    function stop() { vid.pause(); thumb.classList.remove("playing"); }
    if (canHover) {
      thumb.addEventListener("mouseenter", play);
      thumb.addEventListener("mouseleave", stop);
    } else {
      thumb.addEventListener("click", function (e) {
        if (!thumb.classList.contains("playing")) { e.preventDefault(); play(); }
      });
    }
  }

  function packCard(p, me, cover) {
    cover = cover || 1; // site.json "covers": which colorway shows in the library
    var secs = p.loops.reduce(function (a, l) { return a.indexOf(l.secs) < 0 ? a.concat(l.secs) : a; }, []).sort(function (a, b) { return a - b; });
    var owned = me.packs.indexOf(p.slug) >= 0;
    var card = document.createElement("article");
    card.className = "card";
    card.dataset.tags = " " + tags(p).join(" ") + " ";
    card.dataset.name = p.name.toLowerCase() + " " + tags(p).map(tagLabel).join(" ").toLowerCase() + " " + p.loops.map(function (l) { return l.label.toLowerCase() + " " + colorWords(l.label); }).join(" ");
    card.innerHTML =
      '<a class="cover" href="/pack?p=' + encodeURIComponent(p.slug) + '" aria-label="' + esc(p.name) + ' pack">' +
        '<div class="thumb">' +
          '<img src="' + poster(p.slug, cover) + '" alt="" loading="lazy">' +
          '<video muted loop playsinline preload="none" data-src="' + preview(p.slug, cover) + '"></video>' +
          '<span class="badge">' + esc(tagLabel(tags(p)[0])) + '</span><span class="play" aria-hidden="true"></span>' +
        "</div>" +
      "</a>" +
      '<div class="card-meta"><h3><a href="/pack?p=' + encodeURIComponent(p.slug) + '" style="text-decoration:none">' + esc(p.name) + "</a></h3>" +
      '<span class="mono' + (owned ? " owned" : "") + '">' + (owned ? "Owned" : p.loops.length + " loops · " + secs.join("/") + " s") + "</span></div>";
    wireThumb(card.querySelector(".thumb"), p.name);
    return card;
  }

  /* ---------- pages ---------- */
  var pages = {};

  // Pack grid with family filters and search. Home passes its own pick of packs (site.json "home") and has no tools.
  function library(d, pick) {
    var packs = d.catalog, grid = $("#grid"), empty = $("#empty"), search = $("#search");
    if (!grid) return;
    if (!packs.length) { empty.hidden = false; empty.textContent = "The library is being uploaded. Check back shortly."; return; }
    if (pick) packs = pick.map(function (slug) { return d.catalog.filter(function (p) { return p.slug === slug; })[0]; }).filter(Boolean);
    packs.forEach(function (p) { grid.appendChild(packCard(p, d.me, (d.site.covers || {})[p.slug])); });
    if (!search) return;
    var fam = "all";
    function apply() {
      var q = search.value.trim().toLowerCase(), shown = 0;
      grid.querySelectorAll(".card").forEach(function (c) {
        var on = (fam === "all" || c.dataset.tags.indexOf(" " + fam + " ") >= 0) && (!q || c.dataset.name.indexOf(q) >= 0);
        c.hidden = !on; if (on) shown++;
      });
      empty.hidden = shown > 0;
      empty.textContent = "Nothing matches that. Try another color or family.";
    }
    var bar = $(".filters");
    if (bar && SITE.filters && SITE.filters.length) {
      bar.innerHTML = '<button class="chip" data-filter="all" aria-pressed="true">All <span class="n">' + packs.length + "</span></button>" +
        SITE.filters.map(function (f) {
          var n = packs.filter(function (p) { return tags(p).indexOf(f.id) >= 0; }).length;
          return n ? '<button class="chip" data-filter="' + esc(f.id) + '" aria-pressed="false" title="' + esc(f.hint || "") + '">' + esc(f.label) + ' <span class="n">' + n + "</span></button>" : "";
        }).join("");
    }
    var chips = document.querySelectorAll(".chip");
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        chips.forEach(function (x) { x.setAttribute("aria-pressed", x === c ? "true" : "false"); });
        fam = c.dataset.filter; apply();
      });
    });
    search.addEventListener("input", apply);
  }

  // Color previews for the video server: index 0 keeps the loop's own colors; the rest map its brightness onto a
  // four-stop ramp (dark -> mid -> glow -> highlight), the same way the packs' colorways are made.
  var PALETTES = [
    { name: "Original", dot: "#888" },
    { name: "Ember", dot: "#f0642a", stops: [[4, 2, 2], [120, 25, 10], [240, 100, 30], [255, 210, 150]] },
    { name: "Deep Sea", dot: "#2f7ae6", stops: [[1, 4, 12], [10, 40, 110], [40, 120, 230], [170, 210, 255]] },
    { name: "Verdant", dot: "#5fae4c", stops: [[3, 6, 3], [25, 70, 25], [120, 190, 90], [225, 250, 200]] },
    { name: "Ultraviolet", dot: "#7a5cff", stops: [[4, 2, 14], [60, 20, 140], [110, 90, 255], [210, 235, 255]] },
    { name: "Crimson", dot: "#dc2832", stops: [[5, 1, 2], [100, 5, 20], [220, 30, 40], [255, 150, 130]] },
    { name: "Gilded", dot: "#dca03c", stops: [[6, 4, 2], [90, 50, 10], [220, 160, 60], [255, 235, 180]] },
    { name: "Tide", dot: "#1e9aa8", stops: [[2, 8, 20], [8, 45, 80], [30, 140, 160], [180, 235, 225]] },
    { name: "Rosewater", dot: "#e66e96", stops: [[8, 3, 8], [110, 30, 70], [230, 110, 150], [255, 220, 230]] },
    { name: "Silver", dot: "#a0aab9", stops: [[4, 4, 6], [50, 55, 65], [150, 160, 175], [245, 248, 252]] }
  ];
  var TINT_FRAG = [
    "precision mediump float;",
    "uniform sampler2D v, st; uniform vec3 a0,a1,a2,a3,b0,b1,b2,b3; uniform float ma, mb, x, sw; varying vec2 uv;",
    "vec3 ramp(float l, vec3 c0, vec3 c1, vec3 c2, vec3 c3){",
    " return l < .35 ? mix(c0, c1, l / .35) : l < .7 ? mix(c1, c2, (l - .35) / .35) : mix(c2, c3, (l - .7) / .3);}",
    "void main(){",
    " vec3 c = mix(texture2D(v, uv).rgb, texture2D(st, uv).rgb, sw); float l = clamp(pow(dot(c, vec3(.3,.59,.11)) / .82, .95), 0., 1.);",
    " vec3 A = mix(c, ramp(l, a0,a1,a2,a3) * .86 + c * .14, ma), B = mix(c, ramp(l, b0,b1,b2,b3) * .86 + c * .14, mb);",
    " gl_FragColor = vec4(mix(A, B, x), 1.);",
    "}"
  ].join("\n");

  // Draws `vid` into `cv` through TINT_FRAG. Returns tint(j) to blend to PALETTES[j] over 0.6 s, or null without WebGL.
  // tint.still(img) shows a still through the same palette (faded in over 0.4 s) until tint.release() fades back to the video,
  // so a clip switch stays in the chosen color from its first frame.
  function recolor(cv, vid) {
    var gl = cv && cv.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return null;
    function sh(type, src) { var o = gl.createShader(type); gl.shaderSource(o, src); gl.compileShader(o); return gl.getShaderParameter(o, gl.COMPILE_STATUS) ? o : null; }
    var vs = sh(gl.VERTEX_SHADER, "attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}"), fs = sh(gl.FRAGMENT_SHADER, TINT_FRAG);
    if (!vs || !fs) return null;
    var pr = gl.createProgram(); gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return null;
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    function tex(unit) {
      var t = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);
      [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach(function (k) { gl.texParameteri(gl.TEXTURE_2D, k, gl.CLAMP_TO_EDGE); });
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array(3));
      return t;
    }
    var tv = tex(0), ts = tex(1);
    var U = {}; ["a0", "a1", "a2", "a3", "b0", "b1", "b2", "b3", "ma", "mb", "x", "sw", "v", "st"].forEach(function (k) { U[k] = gl.getUniformLocation(pr, k); });
    gl.uniform1i(U.v, 0); gl.uniform1i(U.st, 1);
    function set(side, j) {
      var stp = PALETTES[j].stops || [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
      stp.forEach(function (c, q) { gl.uniform3f(U[side + q], c[0] / 255, c[1] / 255, c[2] / 255); });
      gl.uniform1f(U["m" + side], PALETTES[j].stops ? 1 : 0);
    }
    var to = 0, t0 = 0, sw = 0, swFrom = 0, swTo = 0, sT0 = 0;
    set("a", 0); set("b", 0);
    function ease(k) { k = Math.min(1, Math.max(0, k)); return k * k * (3 - 2 * k); }
    function frame(now) {
      var live = vid.readyState >= 2;
      sw = swFrom + (swTo - swFrom) * ease((now - sT0) / 400);
      if ((live || sw > 0) && !document.hidden) {
        var w = live ? vid.videoWidth : cv.width, h = live ? vid.videoHeight : cv.height;
        if (w && cv.width !== w) { cv.width = w; cv.height = h; gl.viewport(0, 0, w, h); }
        if (live) { gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tv); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, vid); }
        gl.uniform1f(U.x, ease((now - t0) / 600));
        gl.uniform1f(U.sw, sw);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        cv.classList.add("ready");
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    function fadeStill(target) { swFrom = sw; swTo = target; sT0 = performance.now(); }
    var tint = function (j) { set("a", to); to = j; set("b", to); t0 = performance.now(); };
    tint.active = function () { return to !== 0; };
    tint.still = function (img) {
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, ts);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      fadeStill(1);
    };
    tint.release = function () { if (swTo) fadeStill(0); };
    return tint;
  }

  // Hero video server: one home pack's preview loops in the output window; the clip bank below switches it.
  // Only one video is ever loaded.
  function monitor(d) {
    var box = $("#monitor");
    if (!box || getComputedStyle(box).display === "none") return;
    var picks = (d.site.home || []).map(function (slug) { return d.catalog.filter(function (p) { return p.slug === slug; })[0]; }).filter(Boolean);
    if (!picks.length) return;
    var vid = box.querySelector("video"), name = box.querySelector(".mon-name"), tc = box.querySelector(".tc");
    var bank = box.querySelector(".srv-clips"), prog = box.querySelector(".srv-prog b"), len = box.querySelector(".srv-len");
    var covers = d.site.covers || {}, i = 0;
    function cover(p) { return covers[p.slug] || 1; }
    var still = box.querySelector(".srv-poster"), fade = box.querySelector(".srv-cover"), swaps = 0;
    var built = [].map.call(bank.querySelectorAll(".clip"), function (c) { return c.dataset.slug; }).join(",");
    if (built !== picks.map(function (p) { return p.slug; }).join(",")) bank.innerHTML = picks.map(function (p, k) {
      return '<button class="clip" type="button" data-k="' + k + '" data-slug="' + esc(p.slug) + '" aria-label="Preview ' + esc(p.name) + '"><span><img src="' + poster(p.slug, cover(p)) + '" alt="" loading="lazy"></span><span class="nm">' + esc(p.name) + "</span></button>";
    }).join("");
    var clips = bank.querySelectorAll(".clip");
    function show(k) {
      i = (k + picks.length) % picks.length;
      var p = picks[i], n = cover(p);
      var src = preview(p.slug, n), img = poster(p.slug, n);
      if (vid.getAttribute("src") === src) {          // first clip is already in the page
        if (!reduceMotion) { var p0 = vid.play(); if (p0 && p0.catch) p0.catch(function () {}); }
        // it may have started (autoplay) before this script listened for "playing"
        if (!vid.paused && vid.readyState > 2) vid.classList.add("on");
        else vid.addEventListener("timeupdate", function on() { vid.classList.add("on"); vid.removeEventListener("timeupdate", on); });
      } else {
        // crossfade: the next still fades in over the playing video, the video swaps underneath it,
        // and the still lifts once the new video is running
        var token = ++swaps;
        fade.onload = function () {
          if (token !== swaps) return;
          if (tint && tint.active()) tint.still(fade);   // the still fades in already in the chosen color
          else fade.classList.add("on");
          setTimeout(function () {
            if (token !== swaps) return;
            still.src = img; vid.poster = img; vid.src = src;
            if (reduceMotion) { vid.classList.add("on"); fade.classList.remove("on"); return; }
            var pr = vid.play(); if (pr && pr.catch) pr.catch(function () {});
          }, 500);
        };
        fade.src = img;
      }
      name.textContent = p.name + " · " + nn(n);
      clips.forEach(function (c, j) { c.classList.toggle("on", j === i); });
    }
    clips.forEach(function (c) { c.addEventListener("click", function () { show(+c.dataset.k); }); });
    // color dots: the playing video is recolored live through a palette shader, so a color change never loads a video
    // opacity fader: fades the output toward black (srv-dim), like a media server's layer fader
    var fader = box.querySelector(".fader input"), fill = box.querySelector(".fader b"), opN = box.querySelector(".op-n"), out = box.querySelector(".srv-out");
    fader.addEventListener("input", function () {
      var v = +fader.value;
      fill.style.width = v + "%"; opN.textContent = v + "%";
      out.style.setProperty("--op", (v / 100).toFixed(2));
    });
    // the recolor shader compiles on the first color pick: compiling WebGL during the intro stalls Safari for a beat
    var tint = null, tintTried = false;
    function ensureTint() {
      if (!tintTried) { tintTried = true; tint = recolor(box.querySelector(".srv-gl"), vid); }
      return tint;
    }
    var cw = box.querySelector(".cw"), cwN = box.querySelector(".cw-n");
    if (window.WebGLRenderingContext) {
      cw.innerHTML = PALETTES.map(function (p, j) {
        return '<button type="button" class="' + (j ? "" : "orig on") + '" style="--c:' + p.dot + ";--i:" + j + '" data-j="' + j + '" aria-label="' + esc(p.name) + '" title="' + esc(p.name) + '"></button>';
      }).join("");
      cw.addEventListener("click", function (e) {
        var b = e.target.closest("button");
        if (!b) return;
        var j = +b.dataset.j;
        if (!ensureTint()) { cw.parentNode.hidden = true; return; }
        tint(j);
        cwN.textContent = PALETTES[j].name;
        cw.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); });
      });
    } else cw.parentNode.hidden = true;
    vid.addEventListener("playing", function () { vid.classList.add("on"); fade.classList.remove("on"); if (tint) tint.release(); });
    vid.addEventListener("loadeddata", function () { if (reduceMotion) vid.classList.add("on"); });
    vid.addEventListener("loadedmetadata", function () { len.textContent = "0:" + nn(Math.round(vid.duration || 10)); });
    var start = Date.now();
    setInterval(function () {
      var f = Math.floor((Date.now() - start) / (1000 / 30)), s = Math.floor(f / 30);
      tc.textContent = nn(Math.floor(s / 3600)) + ":" + nn(Math.floor(s / 60) % 60) + ":" + nn(s % 60) + ":" + nn(f % 30);
      if (vid.duration) prog.style.width = (100 * vid.currentTime / vid.duration).toFixed(1) + "%";
    }, 1000 / 15);
    show(0);
    // no auto-advance: the playing visual loops seamlessly until a visitor picks another clip (Matthew, 2026-10-30)
  }

  pages.home = function (d) {
    var packs = d.catalog;
    var loops = packs.reduce(function (a, p) { return a + p.loops.length; }, 0);
    if (packs.length) {
      if ($("#fact-packs")) $("#fact-packs").textContent = packs.length;
      if ($("#fact-loops")) $("#fact-loops").textContent = loops;
    }
    monitor(d);
    idleStep(function () { library(d, d.site.home || d.catalog.slice(0, 8).map(function (p) { return p.slug; })); });
    idleStep(function () { renderPlans($("#plans"), d.site, d.me, { custom: false }); });
    var all = $("#all-packs");
    if (all && packs.length) all.textContent = "See all " + packs.length + " packs";
    if (reduceMotion) { var hv = $(".hero video"); if (hv) { hv.removeAttribute("autoplay"); hv.pause(); } }
  };

  // "Tune" bar on the library and pack pages: color / speed / intensity previews for everything inside `target`.
  // Visual only; downloads are the rendered files.
  var TUNE_HTML =
    '<div class="tune" role="group" aria-label="Tune the previews">' +
      '<div class="tune-title"><span>Tune</span><small>Live preview</small></div>' +
      '<label class="tune-row"><span>Color <b data-out="color">Original</b></span><input type="range" data-k="color" min="0" max="360" step="1" value="0"></label>' +
      '<label class="tune-row"><span>Speed <b data-out="speed">1.0×</b></span><input type="range" data-k="speed" min="0.5" max="2" step="0.05" value="1"></label>' +
      '<label class="tune-row"><span>Intensity <b data-out="intensity">100%</b></span><input type="range" data-k="intensity" min="0.4" max="1.6" step="0.01" value="1"></label>' +
      '<button class="tune-reset" type="button">Reset</button>' +
    "</div>" +
    '<p class="tune-note">Previews only. Your media server can adjust color, speed and intensity live.</p>';
  function tune(slot, target) {
    if (!slot || !target) return;
    slot.innerHTML = TUNE_HTML;
    var box = slot.querySelector(".tune");
    target.classList.add("tune-target");
    var v = { color: 0, speed: 1, intensity: 1 };
    // the color slider tints like the home video server: brightness kept, glow recolored to one hue (0 = Original)
    var NAMES = [[15, "Red"], [40, "Orange"], [65, "Gold"], [100, "Lime"], [150, "Green"], [190, "Teal"], [235, "Blue"], [275, "Indigo"], [315, "Violet"], [345, "Pink"], [361, "Red"]];
    function colorName(h) { if (!h) return "Original"; for (var k = 0; k < NAMES.length; k++) if (h < NAMES[k][0]) return NAMES[k][1]; return "Red"; }
    var inputs = box.querySelectorAll("input");
    function fill(inp) { inp.style.setProperty("--fill", ((inp.value - inp.min) / (inp.max - inp.min) * 100) + "%"); }
    function rate(vid) { vid.defaultPlaybackRate = v.speed; vid.playbackRate = v.speed; }
    function apply() {
      var i = v.intensity;
      // tint: drop to grey, warm it with sepia, push the saturation, then turn sepia's ~30° hue to the chosen one
      var tint = v.color ? "grayscale(1) sepia(1) saturate(4.2) hue-rotate(" + (v.color - 30) + "deg) " : "";
      target.style.setProperty("--tune-filter", tint + "saturate(" + i.toFixed(2) + ") contrast(" + (0.85 + 0.15 * i).toFixed(3) + ") brightness(" + (0.82 + 0.18 * i).toFixed(3) + ")");
      target.classList.toggle("tuned", v.color !== 0 || i !== 1);
      target.querySelectorAll("video").forEach(rate);
      box.querySelector('[data-out="color"]').textContent = colorName(v.color);
      box.querySelector('[data-out="speed"]').textContent = v.speed.toFixed(2).replace(/0$/, "") + "×";
      box.querySelector('[data-out="intensity"]').textContent = Math.round(i * 100) + "%";
    }
    inputs.forEach(function (inp) {
      fill(inp);
      inp.addEventListener("input", function () { v[inp.dataset.k] = +inp.value; fill(inp); apply(); });
    });
    // videos load on demand (hover, colorway switches), so give each one the chosen speed as it starts
    target.addEventListener("play", function (e) { if (e.target.tagName === "VIDEO") rate(e.target); }, true);
    box.querySelector(".tune-reset").addEventListener("click", function () {
      inputs.forEach(function (inp) { inp.value = inp.dataset.k === "color" ? 0 : 1; v[inp.dataset.k] = +inp.value; fill(inp); });
      apply();
    });
    apply();
  }

  pages.library = function (d) { library(d); tune($(".tune-slot"), $("#grid")); };

  pages.plans = function (d) {
    var P = d.site.plans;
    renderPlans($("#plans"), d.site, d.me);
    var Y = '<span class="yes" aria-label="Included">✓</span>', N = '<span class="no" aria-label="Not included">—</span>';
    var rows = [
      ["Price", money(P.pack.price) + (SALES_OPEN ? " once" : ""), money(P.basic.price) + (SALES_OPEN ? " / yr" : ""), money(P.premium.price) + (SALES_OPEN ? " / yr" : ""), money(P.max.price) + (SALES_OPEN ? " / yr" : "")],
      ["Studio", N, Y, Y, Y],
      ["Altar Render", N, "1920×1080", "4K UHD", "Any size your computer can handle"],
      ["Altar Live", N, N, N, Y],
      ["Packs", "The one you pick", "Every pack", "Every pack", "Every pack"],
      ["New packs as they release", N, Y, Y, Y],
      ["Church locations", "One", "One", "Every campus", "Every campus"],
      ["Keep what you download", "Forever", "Yes, after you cancel", "Yes, after you cancel", "Yes, after you cancel"]
    ];
    $("#compare-root").innerHTML = '<table class="compare"><thead><tr><th scope="col"><span class="sr">Feature</span></th>' +
      '<th scope="col">' + esc(P.pack.name) + '</th><th scope="col">' + esc(P.basic.name) + '</th><th scope="col" class="hot">' + esc(P.premium.name) + '</th><th scope="col">' + esc(P.max.name) + "</th></tr></thead><tbody>" +
      rows.map(function (r) { return '<tr><th scope="row">' + esc(r[0]) + "</th><td>" + r.slice(1).join("</td><td>") + "</td></tr>"; }).join("") +
      "</tbody></table>";
  };

  pages.license = function () {};
  // /live: the download is for members; everyone else is pointed at plans (the /dl route enforces it either way)
  pages.live = function (d) {
    var me = d.me || {}, plan = me.plan, P = d.site.plans || {};
    document.querySelectorAll("[data-live-dl]").forEach(function (a) {
      if (plan) return;
      if (me.email && !SALES_OPEN) { a.textContent = "Opens at launch"; a.removeAttribute("href"); a.setAttribute("disabled", ""); return; }
      a.textContent = me.email ? "Join to download" : "Sign in to download";
      a.href = me.email ? "/plans?app=live" : "/signin?next=" + encodeURIComponent("/live");
    });
    var note = document.querySelector("[data-live-note]");
    if (note && plan) note.textContent = "Included with your " + (P[plan.tier] ? P[plan.tier].name : "") + " plan · macOS 13 or later";
    document.querySelectorAll("[data-live-plans]").forEach(function (a) { if (plan) a.remove(); });
  };

  pages.pack = function (d) {
    var slug = qs.get("p") || decodeURIComponent(location.hash.slice(1));
    var p = d.catalog.filter(function (x) { return x.slug === slug; })[0];
    var root = $("#pack-root");
    if (!p) {
      root.innerHTML = '<div class="wrap page-head"><h1>Pack not found.</h1><p><a href="/library">Back to the library</a></p></div>';
      return;
    }
    document.title = p.name + " · Altar Loops";
    var me = d.me, P = d.site.plans;
    var canMp4 = owns(me, p.slug, "mp4"), canPro = owns(me, p.slug, "prores");
    var secs = p.loops.map(function (l) { return l.secs; });

    var notice = "";
    if (qs.get("thanks")) notice = '<div class="notice">It\'s yours. Every file in this pack is ready to download below, and it\'s saved to your account.</div>';
    else if (qs.get("locked") === "prores" && canMp4) notice = '<div class="notice">ProRes masters come with Premium or when you buy this pack. Your Basic plan includes the MP4s and stills.</div>';
    else if (qs.get("locked")) notice = '<div class="notice">Downloads unlock with a membership or when you buy this pack.</div>';

    var side;
    if (canPro) {
      side = '<h2>' + (me.packs.indexOf(p.slug) >= 0 ? "You own this pack" : "Included in your plan") + "</h2>" +
        '<div class="stack">' +
          '<a class="btn primary" href="' + dlUrl("zips/" + p.slug + "-prores.zip") + '">Download ProRes pack · ' + size(p.zip.prores) + "</a>" +
          '<a class="btn" href="' + dlUrl("zips/" + p.slug + "-mp4.zip") + '">Download MP4 pack · ' + size(p.zip.mp4) + "</a>" +
        "</div><p class=\"lock\">Both include a PNG still of every loop. Or grab single files below.</p>";
    } else if (canMp4) {
      side = "<h2>Included in Basic</h2><p class=\"lock\">Basic downloads are 1920×1080. Premium and single-pack buyers get 4K.</p>" +
        '<div class="stack">' +
          '<a class="btn primary" href="' + dlUrl("zips/" + p.slug + "-mp4.zip") + '">Download MP4 pack · ' + size(p.zip.mp4) + "</a>" +
          (SALES_OPEN ? '<button class="btn" data-portal>Upgrade to Premium for ProRes</button>' : "") +
        "</div>";
    } else {
      side = "<h2>Get " + esc(p.name) + "</h2>" +
        '<div class="price-line"><strong>' + money(P.pack.price) + '</strong>' + (SALES_OPEN ? '<span class="label">one time</span>' : "") + '</div>' +
        (SALES_OPEN ? '<div class="stack">' +
          '<button class="btn ember" data-buy-pack>Buy this pack</button>' +
          '<p class="or">or get every pack</p>' +
          '<button class="btn" data-buy="basic">Basic · ' + money(P.basic.price) + " / yr</button>" +
          '<button class="btn primary" data-buy="premium">Premium · ' + money(P.premium.price) + " / yr</button>" +
        "</div>"
        : '<div class="stack">' + SOON_BTN + '<a class="btn primary" href="/studio">Test the Studio builder</a></div>') +
        (me.email || PREVIEW ? "" : '<p class="lock">Already a member? <a href="/signin?next=' + encodeURIComponent(location.pathname + location.search) + '">Sign in</a></p>');
    }

    var rows = p.loops.map(function (l) {
      var base = "packs/" + p.slug + "/";
      var links = canMp4
        ? '<a class="btn small" href="' + dlUrl(base + "mp4/" + l.file + ".mp4") + '">MP4</a>' +
          (canPro ? '<a class="btn small" href="' + dlUrl(base + "prores/" + l.file + ".mov") + '">ProRes</a>' : "") +
          '<a class="btn small" href="' + dlUrl(base + "stills/" + l.file + ".png") + '">Still</a>'
        : '<span class="lock">Locked</span>';
      return "<tr><td class=\"mono\">" + nn(l.n) + "</td><td>" + esc(l.label) + '</td><td class="mono">' + l.secs + " s</td>" +
        '<td class="mono">' + size(canPro || !canMp4 ? l.bytes.prores : l.bytes.mp4) + '</td><td class="dl">' + links + "</td></tr>";
    }).join("");

    root.innerHTML =
      '<div class="wrap page-head">' +
        '<div class="crumbs label"><a href="/library">Library</a><span>/</span><span>' + esc(tagLabel(tags(p)[0])) + "</span></div>" +
        "<h1>" + esc(p.name) + "</h1>" +
        "<p>" + p.loops.length + " seamless variations of one look. " + (Math.min.apply(null, secs) === Math.max.apply(null, secs) ? secs[0] + "-second" : Math.min.apply(null, secs) + "–" + Math.max.apply(null, secs) + "-second") + " loops in 4K, 30 fps.</p>" +
      "</div>" +
      '<section style="padding-top:clamp(28px,4vw,44px)"><div class="wrap">' + notice +
        '<div class="pack-layout">' +
          '<div class="pack-view">' +
            '<div class="stage"><img id="stage-img" src="' + poster(p.slug, 1) + '" alt=""><video class="stage-vid on" muted loop playsinline></video><video class="stage-vid" muted loop playsinline></video><span class="badge" id="stage-label"></span></div>' +
            '<div class="strip" role="group" aria-label="Variations">' + p.loops.map(function (l) {
              return '<button type="button" data-n="' + l.n + '" aria-pressed="' + (l.n === 1) + '" aria-label="Play ' + esc(l.label) + '"><img src="' + poster(p.slug, l.n) + '" alt="" loading="lazy"><span>' + nn(l.n) + "</span></button>";
            }).join("") + "</div>" +
            '<div class="tune-slot"></div>' +
          "</div>" +
          '<aside class="side panel">' + side +
            '<dl class="specs"><dt>Loops</dt><dd>' + p.loops.length + ' colorways</dd><dt>Size</dt><dd>4K · 30 fps</dd><dt>Masters</dt><dd>ProRes 422</dd><dt>Also</dt><dd>4K MP4 + PNG stills</dd></dl>' +
            '<p class="lock">Need it for an LED wall or a vertical screen? <a href="/custom?pack=' + encodeURIComponent(p.slug) + '#size">Get it rendered at your size</a>.</p>' +
          "</aside>" +
        "</div>" +
        '<div class="files"><div class="section-head" style="margin-bottom:12px"><span class="label">Every file</span></div>' +
          '<div class="table-scroll"><table><thead><tr><th class="label">#</th><th class="label">Colorway</th><th class="label">Length</th><th class="label">Size</th><th></th></tr></thead><tbody>' + rows + "</tbody></table></div>" +
        "</div>" +
      "</div></section>";

    tune(root.querySelector(".tune-slot"), root.querySelector(".pack-view"));
    // Two stacked players: the next colorway loads behind the current one, then cross-fades in once it's playing.
    var vids = root.querySelectorAll(".stage-vid"), front = 0, label = $("#stage-label");
    function play(v) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
    function show(n) {
      if (n === current && vids[front].getAttribute("src")) return;
      current = n;
      var l = p.loops.filter(function (x) { return x.n === n; })[0];
      if (reduceMotion || !vids[front].getAttribute("src")) {
        $("#stage-img").src = poster(p.slug, n);
        vids[front].src = preview(p.slug, n);
        if (!reduceMotion) play(vids[front]);
      } else {
        var back = vids[1 - front], was = vids[front];
        back.src = preview(p.slug, n);
        back.addEventListener("playing", function swap() {
          back.removeEventListener("playing", swap);
          if (current !== n) return;
          back.classList.add("on"); was.classList.remove("on");
          $("#stage-img").src = poster(p.slug, n);
          setTimeout(function () { if (!was.classList.contains("on")) was.pause(); }, 800);
        });
        play(back);
        front = 1 - front;
      }
      label.textContent = nn(n) + " · " + l.label;
      root.querySelectorAll(".strip button").forEach(function (b) { b.setAttribute("aria-pressed", String(Number(b.dataset.n) === n)); });
    }
    var current = 0;
    show(1);
    root.querySelectorAll(".strip button").forEach(function (b) { b.addEventListener("click", function () { show(Number(b.dataset.n)); }); });
    var buyPack = $("[data-buy-pack]", root);
    if (buyPack) buyPack.addEventListener("click", function () { checkout("pack", { pack: p.slug }, buyPack); });
    root.querySelectorAll("[data-buy]").forEach(function (b) { b.addEventListener("click", function () { checkout(b.dataset.buy, {}, b); }); });
    root.querySelectorAll("[data-portal]").forEach(function (b) { b.addEventListener("click", function () { openPortal(b); }); });
  };

  pages.account = function (d) {
    var me = d.me, root = $("#account-root"), P = d.site.plans;
    var notice = "";
    var thanks = qs.get("thanks");
    if (thanks === "basic" || thanks === "premium") notice = '<div class="notice">Welcome to ' + esc(P[thanks].name) + ". The whole library is unlocked. Start in the library and download whatever you need.</div>";
    if (thanks === "custom-size") notice = '<div class="notice">Your custom-size order is in. We\'ll email you when the files are rendered.</div>';

    if (!me.email) {
      location.replace("/signin?next=/account" + (qs.get("checkout") ? "&checkout=" + encodeURIComponent(qs.get("checkout")) : ""));
      return;
    }

    var plan = me.plan;
    var planHtml = plan
      ? "<h2>" + esc(P[plan.tier] ? P[plan.tier].name : plan.tier) + " membership</h2>" +
        "<p>" + (plan.status === "lifetime" ? "Lifetime access. Nothing to pay, nothing renews." : plan.status === "past_due" ? '<span class="owned">Payment didn\'t go through.</span> Update your card to keep access.' :
          (plan.cancelling ? "Ends" : "Renews") + " " + (plan.renews ? new Date(plan.renews * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "yearly") + ".") + "</p>" +
        '<p style="color:var(--ash)">' + (plan.tier === "premium" ? "Every pack, every format, every campus." : "Every pack as 1920×1080 MP4 + stills. Upgrade to Premium for 4K and ProRes masters.") + "</p>" +
        '<div><a class="btn primary" href="/library">Open the library</a></div>'
      : "<h2>No membership</h2><p style=\"color:var(--ash)\">Unlock every pack with Basic" + (SALES_OPEN ? " (" + money(P.basic.price) + "/yr)" : "") + " or Premium" + (SALES_OPEN ? " (" + money(P.premium.price) + "/yr)" : "") + ".</p>" +
        (SALES_OPEN ? '<div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn" data-buy="basic">Join Basic</button><button class="btn primary" data-buy="premium">Join Premium</button></div>'
          : '<p style="color:var(--ash)">Purchases open when the full beta launches.</p><div><a class="btn primary" href="/studio">Test the Studio builder</a></div>');

    var owned = d.catalog.filter(function (p) { return me.packs.indexOf(p.slug) >= 0; });
    var packsHtml = "<h2>Packs you own</h2>" + (owned.length
      ? '<ul class="list">' + owned.map(function (p) { return '<li><a href="/pack?p=' + encodeURIComponent(p.slug) + '"><span>' + esc(p.name) + '</span><span class="mono">Download →</span></a></li>'; }).join("") + "</ul>"
      : '<p style="color:var(--ash)">' + (plan ? "Your membership covers every pack, so there's nothing to buy separately." : "Packs you buy one at a time show up here.") + "</p>");

    var inv = qs.get("invite");
    if (inv) notice = '<div class="notice">' + (inv === "ok" ? "You're in. Your invite gives you lifetime " + esc(plan && P[plan.tier] ? P[plan.tier].name : "") + " access, free." :
      inv === "already" ? "This account already has a plan, so the invite wasn't used. It's still good for someone else." : "That invite code isn't valid or has already been used.") + "</div>";
    root.innerHTML = notice +
      '<div class="acct">' +
        '<div class="panel">' + planHtml + "</div>" +
        '<div class="panel">' + packsHtml + "</div>" +
        '<div class="panel" id="render"><h2>Altar Render</h2>' + (plan
          ? '<p style="color:var(--ash)">Design a loop in the Studio, copy its render code, and render ProRes or MP4 up to 4K on your own computer. Mac: macOS 13+. On first launch, if macOS blocks it, go to System Settings › Privacy &amp; Security and click Open Anyway. Windows: 10 or 11 (64-bit), run AltarRender-Setup.exe; if SmartScreen appears, choose More info, then Run anyway. It adds Altar Render to the Start menu and desktop.</p><div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn primary" href="/dl/apps/AltarRender-mac.zip">Download for Mac</a><a class="btn primary" href="/dl/apps/AltarRender-Setup.exe">Download for Windows</a><a class="btn" href="/studio">Open the Studio</a></div>' +
            '<h2 style="margin-top:28px">License key</h2><p style="color:var(--ash)">Altar Render and Altar Live ask for this the first time they open. Paste it once and they unlock and keep themselves up to date. Keep it to yourself: it\'s tied to your account.</p><div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center"><code class="appkey" data-appkey>…</code><button class="btn" type="button" data-copykey>Copy license key</button></div>' +
            '<h2 style="margin-top:28px">Altar Live</h2><p style="color:var(--ash)">Play your Studio designs live in ProPresenter over NDI®, and change looks with the song by macro, hotkey or song name. Mac (macOS 13+) or Windows 10/11, 64-bit (beta).</p><div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn primary" href="/dl/apps/AltarLive-mac.zip">Download Altar Live for Mac</a><a class="btn" href="/dl/apps/AltarLive-Setup.exe">Download for Windows (beta)</a><a class="btn" href="/live">How it works</a></div>'
          : '<p style="color:var(--ash)">Render your own Studio designs in ProRes up to 4K on your Mac or PC. Included with Basic and Premium.</p><div><a class="btn" href="/plans">See plans</a></div>') + "</div>" +
        '<div class="panel"><h2>Billing</h2><p style="color:var(--ash)">Change plans, update your card, download receipts or cancel.</p><div>' +
          (me.billing ? '<button class="btn" data-portal>Manage billing</button>' : '<span class="lock">Nothing billed to this email yet.</span>') + "</div></div>" +
        '<div class="panel"><h2>Signed in</h2><p>' + esc(me.email) + '</p><p style="color:var(--ash)">You stay signed in on this device for 30 days. On a shared church computer, sign out when you\'re done.</p><div><button class="btn" data-logout>Sign out</button></div></div>' +
      "</div>";
    root.querySelectorAll("[data-buy]").forEach(function (b) { b.addEventListener("click", function () { checkout(b.dataset.buy, {}, b); }); });
    root.querySelectorAll("[data-portal]").forEach(function (b) { b.addEventListener("click", function () { openPortal(b); }); });
    var keyEl = root.querySelector("[data-appkey]"), keyBtn = root.querySelector("[data-copykey]");
    if (keyEl) fetch("/api/app-key", { credentials: "same-origin" }).then(function (r) { return r.json(); }).then(function (j) { keyEl.textContent = j.key || j.error || ""; }).catch(function () { keyEl.textContent = "Couldn't load your key. Refresh to try again."; });
    if (keyBtn) keyBtn.addEventListener("click", function () { var k = keyEl.textContent; if (!/^AK1\./.test(k)) return; (navigator.clipboard ? navigator.clipboard.writeText(k) : Promise.reject()).then(function () { keyBtn.textContent = "Copied"; setTimeout(function () { keyBtn.textContent = "Copy license key"; }, 1600); }, function () { var r = document.createRange(); r.selectNodeContents(keyEl); var sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); }); });
  };

  pages.signin = function (d) {
    var root = $("#auth-root");
    var next = qs.get("next") || "/account";
    if (!/^\/(?![\/\\])/.test(next)) next = "/account";
    if (d.me && d.me.email) { location.replace(next); return; }
    silk($("#auth"), "auth-gl", 0.55);

    var notice = "";
    if (qs.get("expired")) notice = '<div class="notice">That sign-in link has expired. Send yourself a new one below.</div>';
    if (/^\/redeem\//.test(next)) notice = '<div class="notice">Sign in with your email to claim your free invite. No card needed.</div>';
    if (qs.get("checkout") === "pending") notice = '<div class="notice">We\'re confirming your payment. Sign in with the email you used at checkout to see your downloads.</div>';
    var email = "";
    try { email = localStorage.getItem("al_email") || ""; } catch (e) {}

    var invite = (next.match(/^\/redeem\/([A-Za-z0-9-]+)$/) || [])[1];
    function stepEmail(msg) {
      if (invite) return stepInvite(msg);
      root.innerHTML =
        '<span class="label">Members</span>' +
        "<h1>Welcome <em>back.</em></h1>" +
        '<p class="auth-sub">No password to remember. Enter the email you paid with and we\'ll send you a sign-in code.</p>' +
        notice +
        '<form class="form" id="f-email" novalidate>' +
          '<div class="field"><label for="email">Email</label><input id="email" name="email" type="email" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false" required value="' + esc(email) + '"></div>' +
          '<button class="btn primary" type="submit">Send my code</button>' +
          '<p class="auth-msg" role="alert">' + esc(msg || "") + "</p>" +
        "</form>" +
        '<p class="auth-foot">New here? <a href="/plans">See plans</a> or <a href="/library">browse the library</a>. Buying anything creates your account.</p>';
      notice = "";
      var f = $("#f-email");
      if (!email) f.email.focus();
      f.addEventListener("submit", function (e) {
        e.preventDefault();
        email = f.email.value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { f.querySelector(".auth-msg").textContent = "Enter a valid email address."; f.email.focus(); return; }
        send(f.querySelector("button"), f.querySelector(".auth-msg"), stepCode);
      });
    }

    // invite link: the email is verified first (a code, like any sign-in), then /redeem/<code> claims the invite for that account
    function stepInvite(msg) {
      root.innerHTML =
        '<span class="label">Invite</span>' +
        "<h1>You're <em>invited.</em></h1>" +
        '<p class="auth-sub">Enter your email and we\'ll send a 6-digit code. Type it in and your free lifetime access is ready to claim. No card, no password.</p>' +
        '<form class="form" id="f-invite" novalidate>' +
          '<div class="field"><label for="email">Email</label><input id="email" name="email" type="email" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false" required value="' + esc(email) + '"></div>' +
          '<button class="btn primary" type="submit">Send my code</button>' +
          '<p class="auth-msg" role="alert">' + esc(msg || "") + "</p>" +
        "</form>" +
        '<p class="auth-foot">Already have an account? Use the same email; the invite is added to it.</p>';
      var f = $("#f-invite");
      if (!email) f.email.focus();
      f.addEventListener("submit", function (e) {
        e.preventDefault();
        email = f.email.value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { f.querySelector(".auth-msg").textContent = "Enter a valid email address."; f.email.focus(); return; }
        send(f.querySelector("button"), f.querySelector(".auth-msg"), stepCode);
      });
    }

    function send(btn, msgEl, then) {
      if (PREVIEW) { toast(PREVIEW_MSG.replace("checkout", "sign-in")); return; }
      btn.classList.add("busy"); msgEl.textContent = "";
      post("/api/auth/start", { email: email, next: next })
        .then(function (r) {
          try { localStorage.setItem("al_email", email); } catch (e) {}
          then(r);
        })
        .catch(function (err) { msgEl.textContent = err.message; })
        .then(function () { btn.classList.remove("busy"); });
    }

    function stepCode(r) {
      root.innerHTML =
        '<span class="label">Check your email</span>' +
        "<h1>Enter your <em>code.</em></h1>" +
        '<p class="auth-sub">We sent a 6-digit code to <b>' + esc(email) + "</b>. It works for 20 minutes. You can also tap the link in that email.</p>" +
        '<form class="form" id="f-code" novalidate>' +
          '<div class="field"><label for="code">Sign-in code</label>' +
            '<input id="code" class="code-input" name="code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]*" maxlength="7" placeholder="000 000" required></div>' +
          '<button class="btn primary" type="submit">Sign in</button>' +
          '<p class="auth-msg" role="alert"></p>' +
        "</form>" +
        '<div class="auth-alt"><button type="button" class="linkish" id="resend" disabled>Resend code</button><span aria-hidden="true">·</span><button type="button" class="linkish" id="change">Use a different email</button></div>' +
        (r && r.devCode ? '<p class="auth-foot mono">Dev mode: code ' + esc(r.devCode) + ' · <a href="' + esc(r.devLink) + '">or sign in by link</a></p>' : "") +
        '<p class="auth-foot">Can\'t find it? Check spam or promotions for an email from Altar Loops.</p>';
      var f = $("#f-code"), input = f.code, msg = f.querySelector(".auth-msg"), btn = f.querySelector("button");
      input.focus();
      function submit() {
        var code = input.value.replace(/\D/g, "");
        if (code.length !== 6) { msg.textContent = "Enter all 6 digits."; return; }
        btn.classList.add("busy"); msg.textContent = "";
        post("/api/auth/code", { email: email, code: code })
          .then(function () { btn.textContent = "Signed in"; location.replace(next); })
          .catch(function (err) { msg.textContent = err.message; input.select(); btn.classList.remove("busy"); });
      }
      input.addEventListener("input", function () {
        var dg = input.value.replace(/\D/g, "").slice(0, 6);
        input.value = dg.length > 3 ? dg.slice(0, 3) + " " + dg.slice(3) : dg;
        if (dg.length === 6) submit(); // pasted or autofilled code signs in straight away
      });
      f.addEventListener("submit", function (e) { e.preventDefault(); submit(); });
      $("#change").addEventListener("click", function () { stepEmail(); });
      var resend = $("#resend"), wait = 30;
      var tick = setInterval(function () {
        wait -= 1;
        resend.textContent = wait > 0 ? "Resend code in " + wait + "s" : "Resend code";
        if (wait <= 0) { clearInterval(tick); resend.disabled = false; }
      }, 1000);
      resend.textContent = "Resend code in 30s";
      resend.addEventListener("click", function () {
        send(resend, msg, function (r2) { clearInterval(tick); stepCode(r2); toast("New code sent. Use the newest email."); });
      });
    }

    stepEmail();
  };

  pages.custom = function (d) {
    var P = d.site.plans;
    $("#size-price").textContent = money(P.customSize.price);
    $("#visuals-price").textContent = money(P.customVisuals.price);
    if (qs.get("brief")) { var vb = $("#v-brief"); if (vb && !vb.value) vb.value = qs.get("brief"); }   // a design sent from /studio
    var sel = $("#size-pack");
    d.catalog.forEach(function (p) {
      var o = document.createElement("option");
      o.value = p.slug; o.textContent = p.name;
      if (qs.get("pack") === p.slug) o.selected = true;
      sel.appendChild(o);
    });
    document.querySelectorAll("[data-preset]").forEach(function (b) {
      b.addEventListener("click", function () {
        var wh = b.dataset.preset.split("x");
        $("#size-w").value = wh[0]; $("#size-h").value = wh[1];
      });
    });
    var sf = $("#size-form");
    if (!SALES_OPEN) {
      var sb = sf.querySelector("button[type=submit]");
      sb.textContent = "Opens at launch"; sb.disabled = true;
      var pay = $("#size-pay"); if (pay) pay.textContent = "Custom sizes can be ordered when the full beta launches.";
    }
    sf.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!sf.reportValidity()) return;
      checkout("custom-size", { pack: sel.value, width: sf.width.value, height: sf.height.value, notes: sf.notes.value }, sf.querySelector("button[type=submit]"));
    });
    var vf = $("#visuals-form");
    vf.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!vf.reportValidity()) return;
      var btn = vf.querySelector("button[type=submit]"), msg = $("#visuals-msg");
      if (PREVIEW) { msg.textContent = "Preview only: requests open when the site launches."; return; }
      btn.classList.add("busy");
      var body = {};
      new FormData(vf).forEach(function (v, k) { body[k] = v; });
      post("/api/request", body)
        .then(function () { vf.reset(); msg.textContent = "Got it. We'll reply by email with next steps. A copy is on its way to your inbox."; })
        .catch(function (err) { msg.textContent = err.message; })
        .then(function () { btn.classList.remove("busy"); });
    });
  };

  pages.legal = function () {};

  pages.beta = function () {
    var f = $("#beta-form"), msg = $("#beta-msg"), btn = f.querySelector("button[type=submit]");
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!f.reportValidity()) return;
      if (PREVIEW) { msg.textContent = "Preview only: signups open when the site launches."; return; }
      btn.classList.add("busy");
      var body = {};
      new FormData(f).forEach(function (v, k) { body[k] = v; });
      post("/api/beta-signup", body)
        .then(function () { f.reset(); msg.textContent = "You're on the list. We'll email you when the full beta opens."; })
        .catch(function (err) { msg.textContent = err.message; })
        .then(function () { btn.classList.remove("busy"); });
    });
  };

  /* ---------- motion ---------- */
  var io = "IntersectionObserver" in window;

  // Hero headline: each word rises out of a mask, then the rest of the pane settles in.
  var introDone = Promise.resolve(), finishIntro = null;
  var silkWarm = Promise.resolve(), warmed = null;
  function heroIntro() {
    var h1 = $(".hero h1");
    if (!h1 || reduceMotion) return;
    introDone = new Promise(function (res) { finishIntro = res; });
    var i = 0;
    (function wrap(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (w) {
            if (!w) return;
            if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
            var o = document.createElement("span"), inner = document.createElement("span");
            o.className = "w"; inner.textContent = w; inner.style.animationDelay = (0.15 + i++ * 0.07) + "s";
            o.appendChild(inner); frag.appendChild(o);
          });
          node.replaceChild(frag, c);
        } else if (c.nodeType === 1) wrap(c);
      });
    })(h1);
    h1.setAttribute("aria-label", h1.textContent.replace(/\s+/g, " ").trim());
    var root = document.documentElement, started = false;
    root.classList.add("pre-intro");
    function go() {
      if (started) return;
      started = true;
      requestAnimationFrame(function () { root.classList.remove("pre-intro"); root.classList.add("intro"); });
      setTimeout(finishIntro, 1900); // heavy page work waits until the words and the server have landed
    }
    // Safari resolves document.fonts.ready immediately if no font has been requested yet, then swaps every face
    // mid-animation. Ask for each face by name, and let the silk draw its first frames, before the words move.
    var faces = ['400 1em "Gloock"', 'italic 400 1em "Instrument Serif"', '400 1em "Inter Tight"', '500 1em "Inter Tight"', '400 1em "IBM Plex Mono"'];
    var fontsIn = document.fonts && document.fonts.load
      ? Promise.all(faces.map(function (f) { return document.fonts.load(f).catch(function () {}); }))
      : Promise.resolve();
    Promise.all([fontsIn, silkWarm]).then(go);
    setTimeout(go, 2000); // never hold the headline longer than this
  }

  // Sections and cards drift up out of a slight blur as they scroll in. Only things below the fold at load
  // get the pre-state, and it's never fully hidden, so the page reads even if this never runs.
  function reveals() {
    if (reduceMotion || !io) return;
    var els = document.querySelectorAll(".section-head, .card, .point, .plan, .panel, .pack .tree, .files, .rule, details, .foot-cta, .foot-grid");
    var fold = window.innerHeight;
    var ob = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.remove("pre");
        ob.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) {
      if (el.getBoundingClientRect().top < fold * 0.92) return;
      var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.transitionDelay = Math.min(sib % 4, 3) * 0.08 + "s";
      el.classList.add("rv", "pre");
      ob.observe(el);
    });
  }

  // Stat numbers count up from zero when they scroll into view; at rest they show the real figure.
  function countUps() {
    if (reduceMotion || !io) return;
    var ob = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        ob.unobserve(e.target);
        var el = e.target, to = parseInt(el.textContent, 10), t0 = performance.now();
        if (!(to > 0)) return;
        (function tick(t) {
          var k = Math.min(1, (t - t0) / 1400), ease = 1 - Math.pow(1 - k, 4);
          el.textContent = Math.round(to * ease);
          if (k < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll(".fact strong").forEach(function (el) { ob.observe(el); });
  }

  // The hero's reeded pane reacts to scroll: --sp runs 0 to 1 as the hero scrolls away (see .pane-reeds in styles.css).
  function scrollReeds() {
    var pane = $(".hero .pane"), hero = $(".hero");
    if (!pane || !hero || reduceMotion) return;
    var queued = false;
    function update() {
      queued = false;
      var p = Math.min(1, Math.max(0, window.scrollY / Math.max(1, hero.offsetHeight)));
      pane.style.setProperty("--sp", p.toFixed(4));
    }
    window.addEventListener("scroll", function () { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  // A soft light follows the pointer across glass surfaces.
  function pointerLight() {
    if (!canHover || reduceMotion) return;
    document.addEventListener("pointermove", function (e) {
      var el = e.target.closest && e.target.closest(".pane, .thumb, .plan, .stage, .side");
      if (!el) return;
      var r = el.getBoundingClientRect();
      el.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
      el.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
    }, { passive: true });
  }

  // The hero loop drifts slower than the page.
  function parallax() {
    var v = $(".hero-gl") || $(".hero video");
    if (!v || reduceMotion) return;
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < window.innerHeight * 1.2) v.style.transform = "translate3d(0," + (y * 0.28).toFixed(1) + "px,0) scale(1.06)";
        ticking = false;
      });
    }, { passive: true });
  }

  // Hero background: a live, resolution-independent shader (domain-warped silk light in the brand's teal and ember),
  // drawn by the GPU at the screen's own resolution. Falls back to the hero video if WebGL is missing.
  var HERO_FRAG = [
    "precision highp float;",
    "uniform vec2 r; uniform float t; uniform vec2 m; uniform float k;",
    "float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}",
    "float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);",
    " return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}",
    "float fbm(vec2 p){float v=0.,a=.5;mat2 R=mat2(.8,.6,-.6,.8);",
    " for(int i=0;i<4;i++){v+=a*n(p);p=R*p*2.03;a*=.5;}return v/.9375;}",
    "void main(){",
    " vec2 uv=gl_FragCoord.xy/r, p=(gl_FragCoord.xy-.5*r)/r.y; float T=t*.045;",
    " vec2 q=vec2(fbm(p*1.3+vec2(0.,T)),fbm(p*1.3+vec2(5.2,1.3)-T));",
    " vec2 w=vec2(fbm(p*1.5+2.4*q+vec2(1.7,9.2)+T*1.3),fbm(p*1.5+2.4*q+vec2(8.3,2.8)-T*.8));",
    " float f=fbm(p*1.1+2.8*w+vec2(0.,-T*.5));",
    " float ridge=pow(1.-abs(sin(f*5.+w.x*2.2)),4.);",
    " vec3 ink=vec3(.03,.028,.04), deep=vec3(.03,.13,.19), teal=vec3(.10,.58,.72), ember=vec3(1.,.38,.12), soft=vec3(1.,.72,.52);",
    " vec3 c=mix(ink,deep,smoothstep(.2,.8,f));",
    " c+=teal*smoothstep(.45,.95,w.y)*.75*smoothstep(.3,.7,f);",
    " c+=ember*smoothstep(.36,.75,q.x*w.x*1.7)*.85;",
    " c+=soft*pow(smoothstep(.5,.85,f*w.x*1.55),2.)*.55;",
    " c+=mix(teal*1.8,soft,smoothstep(.4,.7,w.x))*ridge*.42*smoothstep(.3,.75,f);",
    " float d=length(p-m); c+=soft*.12*exp(-d*d*2.2);",
    " c*=mix(.3,1.,smoothstep(-.8,.35,p.x));",
    " c*=1.-.35*pow(length(uv-vec2(.62,.5))*1.3,2.4);",
    " c=1.-exp(-c*1.55*k);",
    " c+=(h(gl_FragCoord.xy+fract(t))-.5)/255.;",  // dither: no banding in the dark gradients
    " gl_FragColor=vec4(max(c,0.),1.);",
    "}"
  ].join("\n");

  // Draws the silk shader into a canvas at the back of `host`. Returns false if WebGL isn't available.
  function silk(host, cls, k) {
    var cv = document.createElement("canvas");
    cv.className = cls; cv.setAttribute("aria-hidden", "true");
    var gl = cv.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return false;
    function sh(type, src) { var o = gl.createShader(type); gl.shaderSource(o, src); gl.compileShader(o); return gl.getShaderParameter(o, gl.COMPILE_STATUS) ? o : null; }
    var vs = sh(gl.VERTEX_SHADER, "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}"), fs = sh(gl.FRAGMENT_SHADER, HERO_FRAG);
    if (!vs || !fs) return false;
    var pr = gl.createProgram(); gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return false;
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    var uR = gl.getUniformLocation(pr, "r"), uT = gl.getUniformLocation(pr, "t"), uM = gl.getUniformLocation(pr, "m");
    gl.uniform1f(gl.getUniformLocation(pr, "k"), k);

    host.insertBefore(cv, host.firstChild);
    var scale = 0.5; // the field is soft, so half CSS resolution looks the same and costs a fraction (big win on Retina)
    var mx = 0.4, my = 0, tx = mx, ty = my, visible = false, t0 = performance.now() - 40000;
    function size() {
      // resizing a canvas wipes it, so skip no-op resizes (Safari fires them as its toolbar slides while scrolling)
      // and redraw at once, so there is never a blank frame
      var w = Math.max(2, Math.round(cv.clientWidth * scale)), h = Math.max(2, Math.round(cv.clientHeight * scale));
      if (w === cv.width && h === cv.height) return;
      cv.width = w; cv.height = h;
      gl.viewport(0, 0, w, h);
      draw(performance.now());
    }
    var frames = 0;
    function draw(now) {
      if (++frames === 3 && cls === "hero-gl" && warmed) warmed();
      mx += (tx - mx) * 0.04; my += (ty - my) * 0.04;
      gl.uniform2f(uR, cv.width, cv.height);
      gl.uniform1f(uT, (now - t0) / 1000);
      gl.uniform2f(uM, mx, my);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    var last = 0;
    function loop(now) {
      if (visible && !document.hidden && now - last > 30) { last = now; draw(now); } // ~30 fps is plenty for slow silk
      requestAnimationFrame(loop);
    }
    size();
    window.addEventListener("resize", size);
    if (window.ResizeObserver) new ResizeObserver(size).observe(cv);
    if (io) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(cv); else visible = true;
    host.addEventListener("pointermove", function (e) {
      var b = cv.getBoundingClientRect();
      tx = (e.clientX - b.left - b.width / 2) / b.height;
      ty = -(e.clientY - b.top - b.height / 2) / b.height;
    }, { passive: true });
    draw(performance.now());
    // footer and sign-in fields fade in after their first frames instead of popping in (the hero has its own intro)
    if (cls !== "hero-gl") requestAnimationFrame(function () { requestAnimationFrame(function () { cv.classList.add("on"); }); });
    if (!reduceMotion) requestAnimationFrame(loop);
    return true;
  }

  function heroShader() {
    var hero = $(".hero"), video = hero && hero.querySelector("video");
    // a hero video marked data-keep is the background itself (Halftone Horizon 01 since 2026-10-30), so no shader
    if (video && video.hasAttribute("data-keep")) return;
    if (hero) silkWarm = new Promise(function (res) { warmed = res; setTimeout(res, 1200); });
    if (hero && silk(hero, "hero-gl", 0.88) && video) { video.pause(); video.remove(); }
  }

  header(null);
  heroShader();
  heroIntro();
  pointerLight();
  scrollReeds();
  parallax();

  // After the intro, the page is built one piece per idle moment: doing it all at once froze Safari for ~230 ms
  // right as the headline landed.
  var idleStep = window.requestIdleCallback ? function (f) { requestIdleCallback(f, { timeout: 400 }); } : function (f) { setTimeout(f, 30); };
  function inSteps(steps) {
    (function next() { var f = steps.shift(); if (!f) return; f(); if (steps.length) idleStep(next); })();
  }
  data.then(function (d) {
    return introDone.then(function () { return d; });
  }).then(function (d) {
    inSteps([
      function () { if ((d.me && d.me.email) || SALES_OPEN) header(d.me); (pages[page] || function () {})(d); },
      reveals,
      countUps,
      function () { footer(d.catalog); }
    ]);
  }).catch(function () {
    footer([]);
    toast("Couldn't load the library. Refresh to try again.");
  });
})();
