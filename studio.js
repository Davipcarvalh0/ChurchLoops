/* Loop studio (/studio): a live WebGL loop designer. Every look is a function of (cos θ, sin θ) with θ running once
   around per loop, so whatever you design repeats with no seam. Settings live in sessionStorage (old links may carry them in location.hash) so a design can be
   shared, and "Render it in 4K" carries them into the custom-visuals form. */
(function () {
  "use strict";
  var LOOKS = ["Silk", "Aura", "Flow", "Rings", "Rays", "Halo", "Cross", "Mesh", "Point Wave", "Dot Globe",
    "Candle Haze", "Dawn Line", "Veil", "Ember Drift", "Window Light", "Breath", "Smoke", "Lanterns", "Tide", "Pillar",
    "Candle Haze II", "Veil II", "Liquid Chrome", "Chrome Ribbon", "Starfield", "Nebula", "Horizon Rays", "Ocean Glow", "Ripple Pool", "Silk Wave", "Arc", "Orbit", "Bloom Bars", "Spotlights", "Fog Bank", "Halo Ring", "Eclipse", "Lattice Light", "Gradient Sweep", "Dual Glow", "Scan Beam", "Petals",
    "Sunset Steps", "Hillside", "Streaks", "River", "Sparks", "Echo", "Whirl", "Spectrum", "Cumulus", "Edge Light", "Peaks",
    "Sky Opening", "Light Field", "Corner Form", "Aperture", "Light Wedge", "Ellipse Glass", "Portal", "Hidden Light", "Oculus", "Threshold",
    "Light Cross", "Shadow Cross", "Overlap", "Slit", "Ring Aperture", "Corridor", "Arch Opening", "Mist Room", "Light Blade", "Lozenge", "Pool",
    "Moir\u00e9", "Checker Warp", "Beacon", "Grid Floor", "Drift Shapes", "Stacked Cards", "Cloth Fold", "Crystal", "Refraction", "Pulse Dots",
    "Dune Lines", "Aurora", "Sun Disc", "Wave Field", "Light Rain", "Tunnel", "Flare", "Phase Rings", "Scan Grid", "Pixel Rain", "Glass Orb", "Ribbons", "Soft Blobs", "Starburst", "Zigzag", "Liquid Glass", "Fireflies", "Cloud Ceiling", "Curved Horizon", "Twin Apertures", "Halo Bands", "Light Tube", "Vortex Tunnel", "Diamond Grid", "Sound Waves", "Ripple Floor", "Light Columns", "Lotus", "Light Bars", "Moonrise",
    "Laser Fan", "Wire Sphere", "Wire Cube", "Light Sweep", "Glitter", "Sunrise Burst", "Nested Squares", "Ridge Lines", "Hex Pulse", "Light Strands", "Infinity", "Triangle Tunnel", "Plasma", "Nebula Ring", "Radar", "Arc Lights", "Circuit", "Particle Swirl", "Floor Spots", "Misty Ridges", "Ocean Sun", "Star Warp", "Woven", "Crescent", "Light Wall", "Kaleido Bloom", "Comet", "Rising Lines", "Prism Triangle", "Bloom Orbs",
    "Stained Window", "Rose Window", "Light Shafts", "Heartbeat", "Water Light", "Spiral Line", "Arc Rings", "Stream Lines", "Bubbles", "Low Poly", "Dot Wave", "Colonnade", "Neon Rings", "Ink Bloom", "Ring Equalizer", "Star Cross", "Terrain", "Fog Lights", "Diagonal Bands", "Atom", "Tile Pulse", "Halo Crown", "Twist Ribbon", "Cloud Break", "Topography", "Grid Flag", "Prism Shards", "Ring Grid", "Gradient Drift", "Twin Suns",
    "Stage Wash", "Floor Movers", "Anamorphic Flare", "Outline Ridge", "Hazy Sun", "Window Patch", "Golden Hour", "Frame Tunnel", "Ash Fall", "Line Burst", "Horizon Line", "Kinetic Lines", "Drawn Circle", "Cathedral Light", "Crowd Lights", "Outline Cross", "Light Ladder", "Wave Stack", "Paint Light", "Strata", "Venn", "Reflected Bars", "Dust Beam", "Film Leaks", "Square Pulse", "Gyro", "Starlight Horizon", "Soft Ground", "Retro Sun", "Spark Burst", "Your video", "Panel Mosaic", "Block Wall", "Burst Fans", "Truss Beams", "Gradient Door", "Corona Rim", "Light Slab", "Floating Ellipse", "Angled Panels", "Two Lights", "Hanging Blades", "Ribbon Fold", "Twist Band", "Liquid Eye", "Glass Stack", "Petal Orb", "Thin Film", "Chrome Cells", "Light Curtain", "Pixel Stretch", "Spectral Bars", "Form Contours", "Dot Curtain", "Arch Rows", "Impact Light", "Long Exposure", "Fan Fins", "Wave Slats", "Vortex Ring", "Light Plane", "Bottom Glow", "Linear Drift"];   // 174–203 (2026-10-31)   // 144–173 (2026-10-31)   // 114–143 (2026-10-31)   // 84–113 (2026-10-31)   // 74–83 (2026-10-31)   // 63–73: more light-and-space (2026-10-31)   // 53–62: light-and-space studies (2026-10-30)
  var RETIRED = [0, 10, 11, 12, 42, 14, 210, 217, 218, 220, 221, 222, 223, 224, 226, 234];   // no longer offered: Silk (2026-10-30), Candle Haze, Dawn Line, Veil, Sunset Steps (2026-10-31); old links and codes that use them still render
  var FINISHES = ["Clean", "Reeded", "Halftone", "Tiles", "Scanlines",
    "Frosted Glass", "Glass Block", "Rippled Glass", "Stained Glass",
    "Pebbled Glass", "Condensation", "Wavy Reeds", "Venetian Blinds", "Engraving", "Mosaic", "Embossed", "Ink Wash", "Mirror", "Soft Focus",
    "Chrome", "Brushed Metal", "Hammered Metal", "Gold Leaf", "Pearl", "Ripple Water", "Crystal Facets", "Hex Tiles", "Light Leak", "Iris", "Canvas", "Frosted Stripes", "Chevron Glass", "Bubble Glass", "Etched Rings", "Woodcut", "Stipple", "Duotone", "Glow Edges", "Ribbed Arch",
    "Pixel Steps", "Spectral Split", "Linen", "Frost Crack", "Lens Streak", "Slices", "Rain Glass", "Old Film", "Watercolor", "Bokeh",
    "Haze Field", "Knife Edge", "Doorway", "Color Wash", "Corner Light", "Horizon Split", "Diffuse", "Reflection", "Light Seam", "Sky Gradient",
    "Cane Glass", "Prism Glass", "Interlace", "Dot Mosaic", "Wave Warp", "Twirl", "Bulge", "Contour Lines", "Banding", "Glint Sand", "Rounded Frame", "God Rays", "Window Shadow", "Caustics", "Mist", "Lyric Fade", "Text Safe", "Pastel", "Riso", "Melt", "Tilt Shift", "Star Dust", "Lens Drops", "Window Mask", "Split Tone", "Cross Light", "Halo Overlay", "Fog Floor", "Stage Beams", "Breathe",
    "Cabinet Seams", "Scan Sweep", "Laser Lines", "Grid Horizon", "Glitter Overlay", "Echo Trail", "Panels", "Ring Mask", "Line Screen", "Wing Fade", "Hex Glass", "Star Glints", "Smoke", "Light Wipe", "Blueprint Grid", "Soft Dots", "Corrugated", "Ripple Rings", "Shatter", "Fisheye", "Heat Haze", "Color Vignette", "Spotlight", "Letterbox", "Pulse Glow", "Spin", "Light Stripes", "Soft Static", "Glow Frame", "Depth Blur",
    "Pill Mosaic", "Quad Mirror", "Soft Pixels", "Crosshatch", "Palette Shift", "Square Lenses", "Ripple Drop", "Shutter", "Noise Warp", "Center Glow", "Dust Motes", "Light Orbs", "Grid Glass", "Zoom Blur", "Motion Blur", "Threshold", "Halo Frame", "Sliding Reeds", "Matte Paper", "Chalk", "Top Light", "Under Water", "Ghost", "Stripe Mask", "Dot Window", "Cross Mask", "Diamond Mask", "Shimmer", "Frame Lines", "Mono Tint",
    "Truss Light", "Anamorphic", "Warm Film", "Lens Flare", "Neon Contour", "Overexpose", "Gate Weave", "Haze Lift", "Bloom", "Kinetic Slices", "Pill Mask", "Corner Brackets", "Sheen", "Crowd", "Strobe", "Iris Wipe", "Kaleidoscope", "Tunnel Warp", "Lens Pinch", "Hex Mask", "Triangle Mask", "Solarize", "Stretch", "Double Exposure", "Paper Fold", "Ash", "Column Wave", "Infinite Zoom", "Light Grid", "Spot Pools", "Fractal Glass", "Impact Crack", "Pixel Sort", "Block Glitch", "CRT Phosphor", "LED Wall", "LED Slats", "Thermal", "Holo Foil", "RGB Drift", "Line Tone", "Bayer Dither", "Glyph Grid", "Poster Glow", "Motion Smear", "Radial Smear", "Time Echo", "Prism Bars", "Liquid Lens", "Frost Panels", "Arch Window", "Slab Window", "Stage Wall", "Curved Screen", "Mirror Tunnel", "Smoke Holes", "Ink Bleed", "Film Burn", "Edge Sweep", "Interference", "Pixel Stretch"];   // 149–178 (2026-10-31)   // 119–148 (2026-10-31)   // 89–118 (2026-10-31)   // 59–88 (2026-10-31)   // 49–58: light-and-space finishes (2026-10-31)
  // New finishes can be tried at /studio?lab before going public: set LAB_FROM to the first lab finish's index.
  // Looks / finishes still in testing: only shown at /studio?lab. Published 2026-10-30: Candle Haze, Dawn Line, Veil, Window Light, Pillar, Engraving, Embossed; then Silk Wave, Arc, Bloom Bars, Spotlights, Fog Bank,
  // Halo Ring, Eclipse, Lattice Light, Gradient Sweep, Scan Beam, Mirror, Brushed Metal, Light Leak, Iris, Canvas (Ribbed Arch became Reeded › Arch);
  // then Sunset Steps, Streaks, Echo, Edge Light, Pixel Steps, Spectral Split.
  var LAB = /[?&]lab\b/.test(location.search), LAB_LOOKS = [204, 13, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26, 27, 28, 31, 39, 41, 43, 45, 46, 48, 49, 50, 52, 55, 56, 57, 58, 64, 65, 66, 67, 70, 71, 72, 78, 79, 80, 81, 82, 83, 85, 86, 87, 88, 89, 90, 93, 95, 96, 97, 98, 99, 100, 101, 105, 106, 107, 108, 111, 112, 113, 114, 117, 119, 121, 122, 123, 124, 125, 127, 128, 129, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203], LAB_FINS = [9, 10, 11, 12, 14, 16, 18, 19, 21, 22, 23, 24, 25, 26, 30, 31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 50, 51, 53, 54, 55, 57, 58, 60, 61, 62, 63, 64, 65, 66, 67, 69, 70, 71, 72, 73, 75, 76, 77, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 96, 99, 100, 101, 102, 104, 105, 106, 107, 109, 110, 112, 113, 114, 115, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178];
  // fx1–fx3 are shared sliders whose meaning, range and starting value depend on the finish (labels in studio.html)
  var FIN_DEFAULTS = { 5: { fx1: 0.6, fx2: 1.5, fx3: 0.4 }, 6: { fx1: 12, fx2: 0.5, fx3: 0.5 }, 7: { fx1: 4, fx2: 0.5, fx3: 90 }, 8: { fx1: 7, fx2: 0.4, fx3: 0.5 },
    9: { fx1: 12, fx2: 0.5, fx3: 0.4 }, 10: { fx1: 0.5, fx2: 1.2, fx3: 0.5 }, 11: { fx1: 10, fx2: 0.25, fx3: 0.5 }, 12: { fx1: 16, fx2: 0.6, fx3: 0 },
    13: { fx1: 90, fx2: 30, fx3: 0.5 }, 14: { fx1: 28, fx2: 0.3, fx3: 0.5 }, 15: { fx1: 0.5, fx2: 135, fx3: 1 }, 16: { fx1: 0.85, fx2: 0.6, fx3: 0.8 },
    17: { fx1: 0, fx2: 0, fx3: 6 }, 18: { fx1: 0.5, fx2: 0.4, fx3: 0.5 },
    19: { fx1: 0.7, fx2: 6, fx3: 0.6 }, 20: { fx1: 0.5, fx2: 0, fx3: 0.5 }, 21: { fx1: 12, fx2: 0.5, fx3: 0.5 }, 22: { fx1: 10, fx2: 0.7, fx3: 0.5 }, 23: { fx1: 0.5, fx2: 1, fx3: 0.5 }, 24: { fx1: 4, fx2: 0.5, fx3: 1 }, 25: { fx1: 8, fx2: 0.5, fx3: 0.4 }, 26: { fx1: 12, fx2: 0.3, fx3: 0.3 }, 27: { fx1: 0.5, fx2: 0.6, fx3: 0.5 }, 28: { fx1: 0.9, fx2: 0.5, fx3: 0 }, 29: { fx1: 0.5, fx2: 2.5, fx3: 0.4 }, 30: { fx1: 8, fx2: 0.6, fx3: 90 }, 31: { fx1: 10, fx2: 0.25, fx3: 30 }, 32: { fx1: 0.5, fx2: 1.2, fx3: 0.5 }, 33: { fx1: 30, fx2: 0.5, fx3: 0 }, 34: { fx1: 28, fx2: 0.5, fx3: 0.8 }, 35: { fx1: 2, fx2: 1, fx3: 0 }, 36: { fx1: 4, fx2: 0.5, fx3: 0.5 }, 37: { fx1: 0.4, fx2: 1, fx3: 0.3 }, 38: { fx1: 9, fx2: 0.3, fx3: 0.8 },
    39: { fx1: 24, fx2: 0.5, fx3: 0.3 }, 40: { fx1: 0.4, fx2: 0, fx3: 0.3 }, 41: { fx1: 3, fx2: 0.5, fx3: 0.5 }, 42: { fx1: 10, fx2: 0.5, fx3: 0.5 }, 43: { fx1: 0.5, fx2: 0.6, fx3: 0.3 }, 44: { fx1: 12, fx2: 0.5, fx3: 0.3 }, 45: { fx1: 0.5, fx2: 1, fx3: 0.5 }, 46: { fx1: 0.5, fx2: 0.5, fx3: 0 }, 47: { fx1: 0.5, fx2: 0.5, fx3: 0.5 }, 48: { fx1: 7, fx2: 0.5, fx3: 0.5 },
    49: { fx1: 0.5, fx2: 0.4, fx3: 0.5 }, 50: { fx1: 0.5, fx2: 0.3, fx3: 0.7 }, 51: { fx1: 0.45, fx2: 0.8, fx3: 0.5 }, 52: { fx1: 0.5, fx2: 0.5, fx3: 1 }, 53: { fx1: 0.5, fx2: 0.4, fx3: 0.5 }, 54: { fx1: 0.45, fx2: 0.5, fx3: 0.6 }, 55: { fx1: 0.5, fx2: 0.8, fx3: 0.3 }, 56: { fx1: 0.25, fx2: 0.4, fx3: 0.3 }, 57: { fx1: 0.5, fx2: 0.4, fx3: 0.4 }, 58: { fx1: 0.5, fx2: 0, fx3: 0.3 },
    59: { fx1: 8, fx2: 0.5, fx3: 0.5 }, 60: { fx1: 8, fx2: 0.5, fx3: 0.5 }, 61: { fx1: 0.3, fx2: 0.5, fx3: 0.3 }, 62: { fx1: 20, fx2: 0.2, fx3: 0.1 }, 63: { fx1: 2, fx2: 0.5, fx3: 0.3 }, 64: { fx1: 0.6, fx2: 0.5, fx3: 0.3 }, 65: { fx1: 0.8, fx2: 0.5, fx3: 0.3 }, 66: { fx1: 8, fx2: 0.3, fx3: 0.4 }, 67: { fx1: 6, fx2: 0.8, fx3: 0.3 }, 68: { fx1: 0.5, fx2: 0.3, fx3: 0.5 }, 69: { fx1: 0.3, fx2: 0.5, fx3: 0.5 }, 70: { fx1: 2, fx2: 0.5, fx3: 0.5 }, 71: { fx1: 3, fx2: 0.4, fx3: 0.7 }, 72: { fx1: 2, fx2: 0.5, fx3: 0.5 }, 73: { fx1: 1.5, fx2: 0.5, fx3: 0.5 }, 74: { fx1: 0.4, fx2: 0.8, fx3: 0 }, 75: { fx1: 0.2, fx2: 0.6, fx3: 0.5 }, 76: { fx1: 0.5, fx2: 0.4, fx3: 0.3 }, 77: { fx1: 0.5, fx2: 0.5, fx3: 0.3 }, 78: { fx1: 0.5, fx2: 0.4, fx3: 0.8 }, 79: { fx1: 0.5, fx2: 0.4, fx3: 0.6 }, 80: { fx1: 0.5, fx2: 0.3, fx3: 0.5 }, 81: { fx1: 0.4, fx2: 1, fx3: 0.5 }, 82: { fx1: 0.6, fx2: 0.6, fx3: 0.5 }, 83: { fx1: 0.6, fx2: 0.3, fx3: 0.5 }, 84: { fx1: 0.6, fx2: 0.5, fx3: 0.3 }, 85: { fx1: 0.6, fx2: 0.4, fx3: 0 }, 86: { fx1: 0.6, fx2: 0.7, fx3: 0.4 }, 87: { fx1: 0.5, fx2: 0.6, fx3: 0.5 }, 88: { fx1: 0.5, fx2: 1, fx3: 0.4 },
    89: { fx1: 8, fx2: 0.5, fx3: 0.3 }, 90: { fx1: 0.3, fx2: 0.5, fx3: 0 }, 91: { fx1: 10, fx2: 0.5, fx3: 0.2 }, 92: { fx1: 6, fx2: 0.5, fx3: 0.35 }, 93: { fx1: 0.5, fx2: 0.3, fx3: 0.5 }, 94: { fx1: 0.5, fx2: 0.6, fx3: 0 }, 95: { fx1: 0.5, fx2: 0.2, fx3: 0.4 }, 96: { fx1: 0.7, fx2: 0.5, fx3: 0.2 }, 97: { fx1: 5, fx2: 0.8, fx3: 0.3 }, 98: { fx1: 0.4, fx2: 0.9, fx3: 0 }, 99: { fx1: 8, fx2: 0.5, fx3: 0.5 }, 100: { fx1: 0.5, fx2: 1, fx3: 0.5 }, 101: { fx1: 1.2, fx2: 0.5, fx3: 0.3 }, 102: { fx1: 0.4, fx2: 0.5, fx3: 1 }, 103: { fx1: 8, fx2: 0.5, fx3: 0.2 }, 104: { fx1: 8, fx2: 0.6, fx3: 0.3 }, 105: { fx1: 10, fx2: 0.5, fx3: 0.5 }, 106: { fx1: 3, fx2: 0.5, fx3: 1 }, 107: { fx1: 6, fx2: 0.4, fx3: 0.5 }, 108: { fx1: 1, fx2: 0.5, fx3: 0.3 }, 109: { fx1: 2, fx2: 0.5, fx3: 0.5 }, 110: { fx1: 0.6, fx2: 0.5, fx3: 0.3 }, 111: { fx1: 0.8, fx2: 0.8, fx3: 0.5 }, 112: { fx1: 0.4, fx2: 0.3, fx3: 0 }, 113: { fx1: 0.5, fx2: 2, fx3: 0.5 }, 114: { fx1: 1, fx2: 0, fx3: 0 }, 115: { fx1: 4, fx2: 0.5, fx3: 45 }, 116: { fx1: 0.3, fx2: 0.3, fx3: 0.3 }, 117: { fx1: 0.3, fx2: 0.3, fx3: 0.6 }, 118: { fx1: 0.6, fx2: 0.5, fx3: 0.3 },
    119: { fx1: 16, fx2: 0.3, fx3: 0.5 }, 120: { fx1: 0.3, fx2: 0.2, fx3: 0.5 }, 121: { fx1: 20, fx2: 0.8, fx3: 0.3 }, 122: { fx1: 4, fx2: 45, fx3: 0.7 }, 123: { fx1: 0.8, fx2: 0.3, fx3: 0.2 }, 124: { fx1: 8, fx2: 0.6, fx3: 0.5 }, 125: { fx1: 2, fx2: 0.5, fx3: 0 }, 126: { fx1: 12, fx2: 0.7, fx3: 0.5 }, 127: { fx1: 1.5, fx2: 0.5, fx3: 0.5 }, 128: { fx1: 0.6, fx2: 0.5, fx3: 0.2 }, 129: { fx1: 0.5, fx2: 0.4, fx3: 0.5 }, 130: { fx1: 3, fx2: 0.5, fx3: 0.6 }, 131: { fx1: 8, fx2: 0.5, fx3: 0.4 }, 132: { fx1: 0.5, fx2: 0, fx3: 0.9 }, 133: { fx1: 0.5, fx2: 0, fx3: 0.9 }, 134: { fx1: 0.45, fx2: 0.3, fx3: 0.6 }, 135: { fx1: 0.85, fx2: 0.2, fx3: 0.5 }, 136: { fx1: 9, fx2: 0.3, fx3: 1 }, 137: { fx1: 0.5, fx2: 0.4, fx3: 0.3 }, 138: { fx1: 0.5, fx2: 0.5, fx3: 0.6 }, 139: { fx1: 0.6, fx2: 0.5, fx3: 0.2 }, 140: { fx1: 0.5, fx2: 0.5, fx3: 0.4 }, 141: { fx1: 0.4, fx2: 20, fx3: 0.6 }, 142: { fx1: 8, fx2: 0.6, fx3: 0 }, 143: { fx1: 10, fx2: 0.8, fx3: 0.1 }, 144: { fx1: 0.75, fx2: 0.3, fx3: 0.5 }, 145: { fx1: 0.6, fx2: 0.1, fx3: 0.5 }, 146: { fx1: 0.5, fx2: 0.3, fx3: 1 }, 147: { fx1: 0.4, fx2: 0.4, fx3: 0.6 }, 148: { fx1: 0.8, fx2: 0.5, fx3: 0.2 },
    149: { fx1: 0.6, fx2: 0.5, fx3: 0.4 }, 150: { fx1: 0.6, fx2: 0.5, fx3: 0.3 }, 151: { fx1: 0.6, fx2: 0.4, fx3: 0.4 }, 152: { fx1: 0.5, fx2: 0.5, fx3: 0.2 }, 153: { fx1: 0.7, fx2: 0.45, fx3: 0.3 }, 154: { fx1: 0.5, fx2: 0.3, fx3: 0.3 }, 155: { fx1: 0.5, fx2: 0.5, fx3: 0.3 }, 156: { fx1: 0.5, fx2: 0.3, fx3: 0.5 }, 157: { fx1: 0.6, fx2: 0.5, fx3: 0.3 }, 158: { fx1: 10, fx2: 0.4, fx3: 0.4 }, 159: { fx1: 0.7, fx2: 0.05, fx3: 0.5 }, 160: { fx1: 0.4, fx2: 0.4, fx3: 0.8 }, 161: { fx1: 0.6, fx2: 0.3, fx3: 1 }, 162: { fx1: 12, fx2: 0.5, fx3: 0.25 }, 163: { fx1: 0.4, fx2: 0.3, fx3: 0.2 }, 164: { fx1: 0.6, fx2: 0.1, fx3: 0.4 }, 165: { fx1: 3, fx2: 0, fx3: 0 }, 166: { fx1: 1, fx2: 0, fx3: 0.5 }, 167: { fx1: 0.2, fx2: 0.5, fx3: 0 }, 168: { fx1: 0.7, fx2: 0.02, fx3: 0.5 }, 169: { fx1: 0.9, fx2: 0.02, fx3: 0.5 }, 170: { fx1: 0.7, fx2: 0.3, fx3: 0.2 }, 171: { fx1: 0.5, fx2: 0, fx3: 0.3 }, 172: { fx1: 0.6, fx2: 0.5, fx3: 0.4 }, 173: { fx1: 0.5, fx2: 0.5, fx3: 0.4 }, 174: { fx1: 0.6, fx2: 0.5, fx3: 0.3 }, 175: { fx1: 8, fx2: 0.5, fx3: 0.5 }, 176: { fx1: 1, fx2: 0.5, fx3: 0.3 }, 177: { fx1: 8, fx2: 0.2, fx3: 0.5 }, 178: { fx1: 0.6, fx2: 0.6, fx3: 0.4 }, 179: {fx1: 7, fx2: 0.5, fx3: 3, fx4: 0, fx5: 0.35}, 180: {fx1: 13, fx2: 5, fx3: 0.45, fx4: 0.15, fx5: 0.6}, 181: {fx1: 140, fx2: 0.6, fx3: 0.6, fx4: 18, fx5: 90}, 182: {fx1: 9, fx2: 0.5, fx3: 0.35, fx4: 8, fx5: 0.55}, 183: {fx1: 240, fx2: 0.55, fx3: 0.35, fx4: 1, fx5: 0.4}, 184: {fx1: 64, fx2: 0.8, fx3: 8, fx4: 0.35, fx5: 0.1}, 185: {fx1: 24, fx2: 0.4, fx3: 72, fx4: 0, fx5: 0}, 186: {fx1: 0.75, fx2: 0.15, fx3: 0, fx4: 0.15, fx5: 0}, 187: {fx1: 0.7, fx2: 2, fx3: 40, fx4: 0.35, fx5: 1}, 188: {fx1: 0.35, fx2: 0, fx3: 0.5, fx4: 0.3, fx5: 0.4}, 189: {fx1: 90, fx2: 0.5, fx3: 0.6, fx4: 0, fx5: 1}, 190: {fx1: 4, fx2: 2, fx3: 0, fx4: 0.5, fx5: 0}, 191: {fx1: 34, fx2: 0.75, fx3: 5, fx4: 0.15, fx5: 0.08}, 192: {fx1: 5, fx2: 0.5, fx3: 0.15, fx4: 0.2, fx5: 0.35}, 193: {fx1: 0.45, fx2: 90, fx3: 0.6, fx4: 0.35, fx5: 0.12}, 194: {fx1: 0.5, fx2: 0, fx3: 0, fx4: 0, fx5: 0.1}, 195: {fx1: 4, fx2: 0.45, fx3: 0.5, fx4: 0.4, fx5: 0.7}, 196: {fx1: 12, fx2: 0.6, fx3: 0.5, fx4: 0.4, fx5: 0.4}, 197: {fx1: 1.2, fx2: 0.5, fx3: 0.6, fx4: 2, fx5: 0.4}, 198: {fx1: 3, fx2: 0.25, fx3: 0.35, fx4: 0.6, fx5: 0.5}, 199: {fx1: 0.45, fx2: 0.35, fx3: 0.35, fx4: 0.35, fx5: 1}, 200: {fx1: 0.36, fx2: 0.7, fx3: 0.5, fx4: -0.75, fx5: 0.6}, 201: {fx1: 0.45, fx2: 0.62, fx3: 0.95, fx4: -0.62, fx5: 0.55}, 202: {fx1: 0.55, fx2: 0.72, fx3: 0.9, fx4: 0.5, fx5: 1}, 203: {fx1: 4, fx2: 0.3, fx3: 1, fx4: 0, fx5: 0.35}, 204: {fx1: 1.1, fx2: 0.55, fx3: 0.2, fx4: 0.7, fx5: 0.5}, 205: {fx1: 0.45, fx2: 1.8, fx3: 0, fx4: 0.55, fx5: 0.5}, 206: {fx1: 0.5, fx2: 0.45, fx3: 0.6, fx4: 1.1, fx5: 1}, 207: {fx1: 0.75, fx2: 0.3, fx3: 1, fx4: 30, fx5: 0.6}, 208: {fx1: 90, fx2: 0.35, fx3: 0.7, fx4: 0.5, fx5: 0}, 209: {fx1: 28, fx2: 1, fx3: 0.55, fx4: 4, fx5: 0.85} };
  var PALETTES = [
    ["Ember", [4, 2, 2], [120, 25, 10], [240, 100, 30], [255, 210, 150]],
    ["Deep Sea", [1, 4, 12], [10, 40, 110], [40, 120, 230], [170, 210, 255]],
    ["Verdant", [3, 6, 3], [25, 70, 25], [120, 190, 90], [225, 250, 200]],
    ["Ultraviolet", [4, 2, 14], [60, 20, 140], [110, 90, 255], [210, 235, 255]],
    ["Crimson", [5, 1, 2], [100, 5, 20], [220, 30, 40], [255, 150, 130]],
    ["Gilded", [6, 4, 2], [90, 50, 10], [220, 160, 60], [255, 235, 180]],
    ["Tide", [2, 8, 20], [8, 45, 80], [30, 140, 160], [180, 235, 225]],
    ["Rosewater", [8, 3, 8], [110, 30, 70], [230, 110, 150], [255, 220, 230]],
    ["Lilac Mint", [6, 6, 12], [90, 70, 160], [120, 220, 190], [240, 255, 245]],
    ["Dusk", [8, 4, 20], [110, 40, 120], [240, 100, 80], [255, 200, 120]],
    ["Silver", [4, 4, 6], [50, 55, 65], [150, 160, 175], [245, 248, 252]],
    ["Chrome Pink", [6, 5, 8], [70, 60, 80], [220, 150, 200], [255, 240, 250]]
  ];
  var DEFAULTS = { look: 2, finish: 0, palette: 0, vtint: 0, cx1: 0.5, cx2: 0.5, cx3: 0.5, cx4: 0.5, cx5: 0.5, vspeed: 1, loop: 12, speed: 1, flow: 1, scale: 1, warp: 0.45, glow: 1, dark: 0.5, grain: 0.4, blur: 0, reeds: 7, refract: 0.12, angle: 0, reedShape: 0,
    htSize: 7, htAngle: 45, htFill: 1, tlCount: 36, tlGap: 0.2, tlVary: 0.3, slDensity: 300, slStrength: 0.32, slRoll: 0,
    haSize: 0.75, haBands: 8, haTilt: -10, haSoft: 0.4, crW: 0.07, crArm: 0.45, crBar: 0.35, crGlow: 1, crFlick: 0, meshN: 5, meshSoft: 0.5,
    pwDens: 40, pwAmp: 1, pwFreq: 1, pwDot: 1, dgSize: 0.8, dgDens: 30, dgDot: 0.62, dgTilt: 20, w: 1920, h: 1080, fx1: 0.5, fx2: 0.5, fx3: 0.5, lx1: 0.5, lx2: 0.5, lx3: 0.5, shift: 0, shiftY: 0, auCount: 4, auSpread: 1, auSoft: 1, flDetail: 1, flContrast: 1, flDrift: 1, rgCount: 9, rgFall: 0.9, rgSharp: 1, rayCount: 5, rayOrigin: -1.25, rayLen: 0.42, elFog: 1, ptShape: 0.45, ir1: "1a0f2e", ir2: "6e2850", irFill: 0, irAngle: 90, arCount: 1, orbIn: 0, lcBright: 1, lcPulse: 0.4, tpCount: 3,
    lx4: 0.5, lx5: 0.5, fx4: 0.5, fx5: 0.5, dyRate: 1, dyTurb: 0, dySwirl: 0, dyWave: 0, dyWaveF: 1, dyPulse: 0, dySway: 0, dyDrift: 0, dyStretch: 0, dyLiquid: 0, dyRipple: 0, dyBreathe: 0, dyFlick: 0, dyBeat: 0, dyPunch: 0, dySweep: 0, dyHue: 0, dyHueW: 0, dySplit: 0, dyEcho: 0, dfRate: 1, dfWobble: 0, dfDrift: 0, dfZoom: 0, dfSway: 0, dfAmt: 1, dfPulse: 0, dfMotion: 0, moRate: 1, c0: "040202", c1: "781a0a", c2: "f0641e", c3: "ffd296", p1: 0.35, p2: 0.7 };
  var LOOK_DEFAULTS = { 3: { scale: 1.2, glow: 0.5 },
    // lab looks: lx1–lx3 are shared sliders whose meaning depends on the look (labels in studio.html)
    10: { lx1: 0.5, lx2: 0.5, lx3: -0.1 }, 11: { lx1: 0.2, lx2: 0.5, lx3: -0.35 }, 12: { lx1: 3, lx2: 0.5, lx3: 15 }, 13: { lx1: 9, lx2: 1, lx3: 0.5 },
    14: { lx1: 3, lx2: 0.4, lx3: -15 }, 15: { lx1: 3, lx2: 0.5, lx3: 1 }, 16: { lx1: 1.2, lx2: 0.4, lx3: 0.5 }, 17: { lx1: 8, lx2: 0.7, lx3: 0.5 },
    18: { lx1: 3, lx2: 0.5, lx3: -0.2 }, 19: { lx1: 0.2, lx2: 0.5, lx3: 0 },
    20: { lx1: 0.45, lx2: 0.5, lx3: -0.15 }, 21: { lx1: 2.5, lx2: 0.6, lx3: 20 }, 22: { lx1: 1.2, lx2: 0.6, lx3: 5 }, 23: { lx1: 0.25, lx2: 1, lx3: 0 }, 24: { lx1: 0.5, lx2: 0.5, lx3: 0.3 }, 25: { lx1: 1, lx2: 0.6, lx3: 1 }, 26: { lx1: 9, lx2: 0.5, lx3: -0.4 }, 27: { lx1: 0.5, lx2: 0.5, lx3: 0.5 }, 28: { lx1: 3, lx2: 0.5, lx3: 0.5 }, 29: { lx1: 2, lx2: 0.6, lx3: 10 }, 30: { lx1: 1.1, lx2: 0.12, lx3: -1.2 }, 31: { lx1: 0.7, lx2: 0.6, lx3: 2 }, 32: { lx1: 5, lx2: 0.5, lx3: 0.5 }, 33: { lx1: 3, lx2: 0.5, lx3: 0.22 }, 34: { lx1: -0.4, lx2: 0.5, lx3: 0.6 }, 35: { lx1: 0.6, lx2: 0.06, lx3: 0.4 }, 36: { lx1: 0.55, lx2: 0.6, lx3: 0.3 }, 37: { lx1: 5, lx2: 0.4, lx3: 0.5 }, 38: { lx1: 0.5, lx2: 0.5, lx3: 1 }, 39: { lx1: 0.8, lx2: 0.5, lx3: 0.5 }, 40: { lx1: 0.1, lx2: 0.5, lx3: 0 }, 41: { lx1: 6, lx2: 0.7, lx3: 1 },
    42: { lx1: 5, lx2: 0.5, lx3: -0.2 }, 43: { lx1: 4, lx2: 0.5, lx3: 0.3 }, 44: { lx1: 28, lx2: 0.5, lx3: 20 }, 45: { lx1: 1, lx2: 0.5, lx3: 0.5 }, 46: { lx1: 8, lx2: 0.5, lx3: 0.5 }, 47: { lx1: 4, lx2: 0.5, lx3: 0 }, 48: { lx1: 3, lx2: 1, lx3: 0.5 }, 49: { lx1: 5, lx2: 0.5, lx3: 0 }, 50: { lx1: 0.5, lx2: 0.5, lx3: 0.5 }, 51: { lx1: 0.25, lx2: 0.5, lx3: 0.5 }, 52: { lx1: 4, lx2: 0.5, lx3: 0 },
    53: { lx1: 0.7, lx2: 0.3, lx3: 0.6 }, 54: { lx1: 0.5, lx2: 0.5, lx3: 0.7 }, 55: { lx1: 0.55, lx2: 0.2, lx3: 0 }, 56: { lx1: 0.8, lx2: 0.5, lx3: 0.5 }, 57: { lx1: 20, lx2: 0.2, lx3: 0.3 }, 58: { lx1: 0.6, lx2: 0.4, lx3: 0.6 }, 59: { lx1: 0.75, lx2: 0.7, lx3: 0.5 }, 60: { lx1: 0.7, lx2: 0.4, lx3: 0.2 }, 61: { lx1: 0.55, lx2: 0.5, lx3: 0.5 }, 62: { lx1: 0.5, lx2: 0.5, lx3: -0.15 },
    63: { lx1: 0.7, lx2: 0.09, lx3: 0.5 }, 64: { lx1: 0.7, lx2: 0.09, lx3: 0.4 }, 65: { lx1: 0.7, lx2: 0.6, lx3: 0.1 }, 66: { lx1: 1.1, lx2: 0.02, lx3: 0.5 }, 67: { lx1: 0.6, lx2: 0.05, lx3: 0.5 }, 68: { lx1: 0.9, lx2: 6, lx3: 0.5 }, 69: { lx1: 0.8, lx2: 0.4, lx3: 0.5 }, 70: { lx1: 0.6, lx2: 0.5, lx3: 0 }, 71: { lx1: 0.015, lx2: 0.5, lx3: 0 }, 72: { lx1: 0.55, lx2: 0, lx3: 0.5 }, 73: { lx1: 0.7, lx2: 0.4, lx3: -0.55 },
    74: { lx1: 22, lx2: 7, lx3: 0.5 }, 75: { lx1: 6, lx2: 0.5, lx3: 0.3 }, 76: { lx1: 2, lx2: 0.4, lx3: 0.5 }, 77: { lx1: 8, lx2: 0.2, lx3: 0.5 }, 78: { lx1: 4, lx2: 0.35, lx3: 0.3 }, 79: { lx1: 0.6, lx2: 0.5, lx3: 5 }, 80: { lx1: 3, lx2: 0.5, lx3: 0.5 }, 81: { lx1: 6, lx2: 0.55, lx3: 0.5 }, 82: { lx1: 0.5, lx2: 25, lx3: 0.4 }, 83: { lx1: 14, lx2: 1, lx3: 0.7 },
    84: { lx1: 8, lx2: 0.4, lx3: 0.6 }, 85: { lx1: 2, lx2: 0.6, lx3: 0.5 }, 86: { lx1: 0.45, lx2: 0, lx3: 0.5 }, 87: { lx1: 8, lx2: 0.5, lx3: 0.5 }, 88: { lx1: 16, lx2: 0.5, lx3: 10 }, 89: { lx1: 6, lx2: 0.8, lx3: 0.5 }, 90: { lx1: 0.5, lx2: 0.6, lx3: 0.5 }, 91: { lx1: 6, lx2: 0.2, lx3: 0.5 }, 92: { lx1: 6, lx2: 0.3, lx3: 0.5 }, 93: { lx1: 20, lx2: 0.5, lx3: 0.6 }, 94: { lx1: 0.6, lx2: 0.6, lx3: 0.6 }, 95: { lx1: 3, lx2: 0.4, lx3: 0.5 }, 96: { lx1: 4, lx2: 0.6, lx3: 0.6 }, 97: { lx1: 12, lx2: 0.6, lx3: 0.3 }, 98: { lx1: 3, lx2: 0, lx3: 0.4 }, 99: { lx1: 5, lx2: 0.5, lx3: 0.5 }, 100: { lx1: 6, lx2: 0.5, lx3: 0.6 }, 101: { lx1: 1, lx2: -0.2, lx3: 0.5 }, 102: { lx1: 0.5, lx2: 0.4, lx3: -0.2 }, 103: { lx1: 0.45, lx2: 0.3, lx3: 0.5 }, 104: { lx1: 4, lx2: 0.2, lx3: 0.6 }, 105: { lx1: 0.9, lx2: 0.03, lx3: 0.5 }, 106: { lx1: 2, lx2: 0.6, lx3: 3 }, 107: { lx1: 6, lx2: 0.7, lx3: 0.5 }, 108: { lx1: 3, lx2: 0.5, lx3: 1.2 }, 109: { lx1: 3, lx2: 0.6, lx3: 0.2 }, 110: { lx1: 5, lx2: 0.3, lx3: 0.5 }, 111: { lx1: 6, lx2: 3, lx3: 0.7 }, 112: { lx1: 10, lx2: 0.6, lx3: 0.3 }, 113: { lx1: 0.3, lx2: 0.15, lx3: 0.5 },
    114: { lx1: 12, lx2: 0.6, lx3: 0.5 }, 115: { lx1: 0.7, lx2: 10, lx3: 20 }, 116: { lx1: 0.45, lx2: 0.3, lx3: 0.5 }, 117: { lx1: 0.3, lx2: 30, lx3: 2 }, 118: { lx1: 12, lx2: 0.4, lx3: 0.7 }, 119: { lx1: 10, lx2: -0.4, lx3: 0.5 }, 120: { lx1: 5, lx2: 0.2, lx3: 0.5 }, 121: { lx1: 14, lx2: 0.6, lx3: 0.6 }, 122: { lx1: 6, lx2: 0.5, lx3: 0.5 }, 123: { lx1: 10, lx2: 0.3, lx3: 0.5 }, 124: { lx1: 1.2, lx2: 0.4, lx3: 0.5 }, 125: { lx1: 6, lx2: 1.2, lx3: 0.5 }, 126: { lx1: 1.5, lx2: 0.5, lx3: 0.5 }, 127: { lx1: 0.6, lx2: 0.4, lx3: 0.6 }, 128: { lx1: 4, lx2: 0.5, lx3: 0.6 }, 129: { lx1: 9, lx2: 0.6, lx3: 0.5 }, 130: { lx1: 8, lx2: 0.3, lx3: 0.7 }, 131: { lx1: 3, lx2: 0.9, lx3: 0.5 }, 132: { lx1: 3, lx2: 0.4, lx3: 0.5 }, 133: { lx1: 4, lx2: 0.6, lx3: 0 }, 134: { lx1: 0.25, lx2: 0.6, lx3: 0.5 }, 135: { lx1: 0.5, lx2: 0.5, lx3: 0 }, 136: { lx1: 6, lx2: 40, lx3: 0.4 }, 137: { lx1: 0.5, lx2: 0.35, lx3: 0.5 }, 138: { lx1: 12, lx2: 0.2, lx3: 0.4 }, 139: { lx1: 6, lx2: 0.8, lx3: 0.5 }, 140: { lx1: 0.5, lx2: 0.5, lx3: 0.5 }, 141: { lx1: 6, lx2: 0.3, lx3: 0.5 }, 142: { lx1: 0.8, lx2: 0.3, lx3: 0.4 }, 143: { lx1: 4, lx2: 0.35, lx3: 0.5 },
    144: { lx1: 8, lx2: 0.5, lx3: 0.5 }, 145: { lx1: 12, lx2: 3, lx3: 0.5 }, 146: { lx1: 4, lx2: 0.4, lx3: 0.5 }, 147: { lx1: 2, lx2: 0.6, lx3: 0.5 }, 148: { lx1: 1.5, lx2: 0.5, lx3: 0.4 }, 149: { lx1: 2, lx2: 0.2, lx3: 0.5 }, 150: { lx1: 5, lx2: 0.3, lx3: 0.6 }, 151: { lx1: 10, lx2: 0.6, lx3: 0.5 }, 152: { lx1: 5, lx2: 0.5, lx3: 0.6 }, 153: { lx1: 5, lx2: 0.5, lx3: 0.3 }, 154: { lx1: 24, lx2: 0.5, lx3: 0.9 }, 155: { lx1: 6, lx2: 0.5, lx3: 0.5 }, 156: { lx1: 0.7, lx2: 0.4, lx3: 0.5 }, 157: { lx1: 1.2, lx2: 0.6, lx3: 0.4 }, 158: { lx1: 48, lx2: 0.6, lx3: 0.45 }, 159: { lx1: 0.6, lx2: 2, lx3: 0.5 }, 160: { lx1: 8, lx2: 0.6, lx3: 0.5 }, 161: { lx1: 3, lx2: 0.5, lx3: 0.6 }, 162: { lx1: 2, lx2: 30, lx3: 0.5 }, 163: { lx1: 3, lx2: 0.4, lx3: 0.6 }, 164: { lx1: 10, lx2: 0.3, lx3: 0.2 }, 165: { lx1: 12, lx2: 0.6, lx3: 0.5 }, 166: { lx1: 1.5, lx2: 0.5, lx3: 0.6 }, 167: { lx1: 0.6, lx2: 0.6, lx3: 0.6 }, 168: { lx1: 10, lx2: 1, lx3: 0.6 }, 169: { lx1: 8, lx2: 0.5, lx3: 0.5 }, 170: { lx1: 4, lx2: 0.5, lx3: 0.5 }, 171: { lx1: 8, lx2: 0.5, lx3: 1 }, 172: { lx1: 60, lx2: 0.5, lx3: 0.2 }, 173: { lx1: 0.2, lx2: 1.2, lx3: 0.5 },
    174: { lx1: 6, lx2: 0.5, lx3: 0.5 }, 175: { lx1: 6, lx2: 0.5, lx3: 0.5 }, 176: { lx1: 0.5, lx2: 0.5, lx3: 0.5 }, 177: { lx1: 3, lx2: 0.6, lx3: 0.6 }, 178: { lx1: 0.35, lx2: 0.6, lx3: 0.6 }, 179: { lx1: 1, lx2: 0.3, lx3: 0.5 }, 180: { lx1: 0.25, lx2: 0.5, lx3: 0.5 }, 181: { lx1: 8, lx2: 0.3, lx3: 0.6 }, 182: { lx1: 6, lx2: 0.5, lx3: 0.6 }, 183: { lx1: 36, lx2: 0.6, lx3: 0.6 }, 184: { lx1: 0.45, lx2: 0.4, lx3: 0.5 }, 185: { lx1: 14, lx2: 0.6, lx3: 0.6 }, 186: { lx1: 0.6, lx2: 0.5, lx3: 0.5 }, 187: { lx1: 3, lx2: 0.4, lx3: 0.6 }, 188: { lx1: 5, lx2: 0.5, lx3: 0.5 }, 189: { lx1: 0.8, lx2: 0.4, lx3: 0.6 }, 190: { lx1: 12, lx2: 0.6, lx3: 0.5 }, 191: { lx1: 14, lx2: 0.4, lx3: 0.5 }, 192: { lx1: 2, lx2: 0.5, lx3: 0.5 }, 193: { lx1: 6, lx2: 0.5, lx3: 0.3 }, 194: { lx1: 3, lx2: 0.6, lx3: 0.5 }, 195: { lx1: 10, lx2: 0.6, lx3: 0.6 }, 196: { lx1: 0.5, lx2: 0.5, lx3: 0.3 }, 197: { lx1: 0.5, lx2: 0.5, lx3: 0.4 }, 198: { lx1: 4, lx2: 0.5, lx3: 0 }, 199: { lx1: 0.7, lx2: 0.3, lx3: 0.5 }, 200: { lx1: 0.3, lx2: 0.5, lx3: 0.6 }, 201: { lx1: 1, lx2: 0.5, lx3: 0.6 }, 202: { lx1: 0.5, lx2: 0.5, lx3: 0.5 }, 203: { lx1: 30, lx2: 0.7, lx3: 0.5 }, 205: {lx1: 9, lx2: 0.25, lx3: 0.5, lx4: 0.7, lx5: 0.55}, 206: {lx1: 24, lx2: 12, lx3: 1, lx4: 0.5, lx5: 0.2}, 207: {lx1: 48, lx2: -0.2, lx3: 0.6, lx4: 0.8, lx5: 0.4}, 208: {lx1: 7, lx2: 0.35, lx3: 0.4, lx4: 0.5, lx5: 0.9}, 209: {lx1: 0.35, lx2: -0.55, lx3: 0.55, lx4: 0.2, lx5: 0.08}, 210: {lx1: 0.6, lx2: 0.35, lx3: 0.4, lx4: 0.55, lx5: 0.35}, 211: {lx1: 0.32, lx2: 0.72, lx3: 0.6, lx4: -0.72, lx5: 0.7}, 212: {lx1: 0.78, lx2: 0.24, lx3: 0.45, lx4: 0.55, lx5: 0.55}, 213: {lx1: 3, lx2: 0.5, lx3: 0.5, lx4: 0.55, lx5: 0.5}, 214: {lx1: 0.4, lx2: 0.6, lx3: 0.7, lx4: 0.5, lx5: 0.35}, 215: {lx1: 9, lx2: 0.55, lx3: 0.55, lx4: 1, lx5: 0.6}, 216: {lx1: 70, lx2: 0.55, lx3: 0.62, lx4: 0.6, lx5: 0.45}, 217: {lx1: 42, lx2: 1.1, lx3: 0.55, lx4: 0.5, lx5: 0.65}, 218: {lx1: 0.7, lx2: 0.6, lx3: 35, lx4: 0.45, lx5: 0.5}, 219: {lx1: 9, lx2: 0.78, lx3: 0.5, lx4: 0.55, lx5: 0.45}, 220: {lx1: 7, lx2: 0.68, lx3: 0.7, lx4: 0.4, lx5: 0.45}, 221: {lx1: 0.68, lx2: 9, lx3: 0.45, lx4: 0.55, lx5: 0.5}, 222: {lx1: 5, lx2: 0.42, lx3: 0.55, lx4: 4, lx5: 0.5}, 223: {lx1: 1, lx2: 44, lx3: 0.62, lx4: -0.12, lx5: 0.55}, 224: {lx1: 26, lx2: 0.55, lx3: 0.55, lx4: 4, lx5: 0.5}, 225: {lx1: 8, lx2: 0.4, lx3: 0.4, lx4: 0.4, lx5: 0.4}, 226: {lx1: 34, lx2: 0.3, lx3: 0.6, lx4: 0.35, lx5: 0.55}, 227: {lx1: 30, lx2: 0.6, lx3: 0.55, lx4: 16, lx5: 0.5}, 228: {lx1: 22, lx2: 0.42, lx3: 0.35, lx4: 1, lx5: 0.62}, 229: {lx1: 15, lx2: 6, lx3: 0.45, lx4: 0.55, lx5: 0.5}, 230: {lx1: 2, lx2: 72, lx3: 0.75, lx4: 3, lx5: 0.5}, 231: {lx1: 52, lx2: 0.8, lx3: 0.45, lx4: 0.6, lx5: 1}, 232: {lx1: 28, lx2: 1.5, lx3: 0.3, lx4: 0.6, lx5: 0.5}, 233: {lx1: 5, lx2: 1.4, lx3: 0.3, lx4: 0.45, lx5: 0.55}, 234: {lx1: 0, lx2: 0.7, lx3: 0.65, lx4: 0.25, lx5: 3}, 235: {lx1: 0.35, lx2: 0.6, lx3: 0.3, lx4: 0.2, lx5: 0}, 236: {lx1: 25, lx2: 1, lx3: 0.3, lx4: 0.3, lx5: 0.4} };   // per-look standard settings, applied when the look is picked and on Reset
  // the Look and Finish pickers: thumbnails (public/thumbs, drawn by scripts/studio-thumbs.py), sorted into categories, with search
  var THUMBS_V = "1793653532";
  var START_LOOK = 205;   // Light Field: the look a fresh Studio opens on
  var PICK_ORDER = {"look": [235, 53, 51, 227, 32, 215, 205, 219, 225, 206, 207, 208, 209, 211, 212, 214, 69, 5, 228, 230, 59, 232, 216, 236, 233, 19, 6, 61, 54, 60, 231, 1, 2, 3, 4, 7, 8, 9, 29, 30, 213, 33, 34, 35, 36, 37, 38, 40, 44, 47, 126, 62, 63, 68, 73, 74, 75, 76, 77, 84, 91, 92, 94, 102, 103, 104, 109, 110, 115, 116, 118, 120, 130, 229, 204], "savedAt": "2026-11-06T06:05:30Z", "note": "Matthew's All-tab order from the Look Order page; Liquid Eye (218), Light Plane (234), Window Light (14) retired the same day"};
  var LOOK_FEATURED = [205, 206, 207, 208, 209, 211, 212, 213, 214, 215, 216, 219, 225, 227, 228, 229, 230, 231, 232, 233, 235, 236];   // shown first in the look picker: Edge Light, Hidden Light, Halo, Wire Sphere, Threshold, Plasma
  var LOOK_CATS = {"Stage & LED": [205, 206, 207, 208, 227, 228, 232, 234], "Light rooms": [209, 210, 211, 212, 213, 214, 215], "Flowing forms": [216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 229, 230, 231, 233], "Gradients": [235, 236],
    "Glow": [1, 5, 7, 13, 15, 17, 20, 32, 35, 36, 39, 46, 47, 51, 90, 94, 96, 97, 100, 118, 127, 137, 143, 159, 161, 165, 173, 176, 178, 197],
    "Flowing": [0, 2, 16, 18, 21, 22, 23, 25, 27, 29, 34, 38, 45, 48, 50, 80, 85, 95, 99, 126, 139, 148, 151, 157, 162, 166, 172, 180, 192, 193, 201],
    "Light & space": [6, 14, 19, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 102, 103, 105, 110, 144, 145, 146, 155, 179, 184, 187],
    "Beams": [4, 26, 33, 40, 44, 49, 76, 88, 114, 117, 119, 123, 129, 132, 135, 140, 141, 167, 174, 175, 183, 195, 196],
    "Shapes": [3, 8, 9, 24, 28, 30, 31, 41, 78, 79, 81, 82, 83, 89, 91, 104, 106, 108, 111, 115, 116, 120, 124, 125, 128, 131, 142, 147, 149, 150, 152, 156, 158, 163, 170, 171, 181, 186, 189, 194, 198, 199, 202, 203],
    "Lines & grids": [37, 74, 75, 77, 84, 92, 93, 98, 107, 112, 121, 122, 130, 136, 138, 153, 154, 160, 164, 168, 169, 177, 185, 190, 191],
    "Scenes": [10, 11, 42, 43, 52, 86, 87, 101, 109, 113, 133, 134, 182, 188, 200]
  };
  var FIN_CATS = {"Glitch": [181, 182, 183, 209], "Stage": [184, 185, 201, 202], "Color": [186, 187, 188], "Print": [189, 190, 191, 192], "Mix": [204, 205, 206],
    "Glass": [179, 180, 196, 197, 198, 1, 5, 6, 7, 8, 9, 10, 11, 25, 30, 31, 32, 38, 45, 59, 60, 81, 99, 105, 124, 131, 136],
    "Texture": [2, 3, 4, 12, 13, 14, 15, 16, 26, 29, 34, 35, 39, 41, 42, 46, 47, 61, 62, 66, 67, 68, 77, 89, 97, 104, 116, 119, 121, 122, 137, 138, 172, 173],
    "Color & metal": [18, 19, 20, 21, 22, 23, 36, 37, 40, 49, 50, 52, 55, 76, 83, 123, 134, 148, 151, 154, 170],
    "Light": [207, 208, 27, 43, 48, 53, 54, 57, 58, 70, 71, 72, 73, 80, 84, 85, 86, 87, 90, 91, 92, 93, 100, 101, 102, 103, 113, 115, 117, 128, 129, 130, 139, 146, 147, 149, 150, 152, 153, 156, 157, 161, 174, 177, 178],
    "Frame & mask": [199, 200, 28, 51, 69, 74, 75, 79, 82, 96, 98, 110, 111, 112, 118, 135, 142, 143, 144, 145, 159, 160, 162, 164, 168, 169],
    "Motion": [193, 194, 195, 203, 17, 24, 33, 44, 56, 63, 64, 65, 78, 88, 94, 95, 106, 107, 108, 109, 114, 120, 125, 126, 127, 132, 133, 140, 141, 155, 158, 163, 165, 166, 167, 171, 175, 176]
  };
  var COLORS = ["c0", "c1", "c2", "c3"], HEXK = COLORS.concat(["ir1", "ir2"]);   // ir1/ir2: Iris surround colors
  // Recipes after the Altar Loops packs. "Start from a pack" loads one; "Surprise me" picks one and varies it within brand limits.
  // look: 0 Silk 1 Aura 2 Flow 3 Rings 4 Rays · finish: 0 Clean 1 Reeded 2 Halftone 3 Tiles 4 Scanlines · palette index into PALETTES
  var RECIPES = [
    ["Flow", { look: 2, finish: 0, palette: 11, loop: 10, flow: 1, scale: 1, warp: 0.45, glow: 1, dark: 0.55 }, [11, 9, 1, 4]],
    ["Lilac Mint Flutes", { look: 2, finish: 1, palette: 8, loop: 10, reeds: 9, refract: 0.35, angle: 0, dark: 0.5 }, [8, 6, 3]],
    ["Line Waves", { look: 1, finish: 1, palette: 8, loop: 10, reeds: 21, refract: 0.1, angle: 0, dark: 0.55 }, [8, 3, 7]],
    ["Ultraviolet Panels", { look: 2, finish: 1, palette: 3, loop: 10, reeds: 5, refract: 0.4, angle: 0, warp: 0.54 }, [3, 9, 1]],
    ["Verdant Halftone", { look: 2, finish: 2, palette: 2, loop: 10, htSize: 8, htAngle: 45, htFill: 1 }, [2, 6, 0]],
    ["Tessera", { look: 2, finish: 3, palette: 5, loop: 10, tlCount: 36, tlGap: 0.2, tlVary: 0.3, warp: 0.36 }, [5, 1, 0]],
    ["Halo", { look: 5, finish: 0, palette: 1, loop: 20, haSize: 0.75, haBands: 8, haTilt: -10, haSoft: 0.4 }, [1, 3, 6]],
    ["Grooves", { look: 3, finish: 4, palette: 0, loop: 10, slDensity: 300, slStrength: 0.7, slRoll: 1, scale: 1.6 }, [0, 5, 4]],
    ["Halftone Horizon", { look: 4, finish: 2, palette: 0, loop: 20, htSize: 9, htAngle: 45, htFill: 1, dark: 0.6 }, [0, 5, 4]],
    ["Reeded Cross", { look: 6, finish: 1, palette: 0, loop: 20, reeds: 26, refract: 0.14, angle: 0, dark: 0.65 }, [0, 5, 10]],
    ["Point Wave", { look: 8, finish: 0, palette: 3, loop: 10, pwDens: 40, pwAmp: 1, pwFreq: 1, pwDot: 1 }, [6, 1, 8]],
    ["Dot Globe", { look: 9, finish: 0, palette: 6, loop: 10, dgSize: 0.8, dgDens: 30, dgDot: 0.62, dgTilt: 20 }, [6, 3, 7]],
    ["Current", { look: 2, finish: 0, palette: 6, loop: 20, warp: 0.45, flow: 0.8 }, [6, 1, 8]],
    ["Swirl", { look: 2, finish: 0, palette: 4, loop: 10, warp: 0.68 }, [4, 9]],
    ["Mesh", { look: 7, finish: 0, palette: 9, loop: 10, blur: 0.3, warp: 0.59 }, [9, 7, 3]],
    // 2026-10-30 looks + finishes, kept in the packs' world: dark grounds, slow light, warm or deep palettes
    ["Candle Haze", { look: 10, finish: 0, palette: 0, loop: 20, dark: 0.6 }, [5, 9, 4]],
    ["Frosted Candle", { look: 10, finish: 5, palette: 5, loop: 20, dark: 0.6 }, [0, 9]],
    ["Dawn Line", { look: 11, finish: 0, palette: 9, loop: 20, dark: 0.55 }, [0, 5, 6]],
    ["Engraved Dawn", { look: 11, finish: 13, palette: 5, loop: 20, dark: 0.55 }, [0, 10, 9]],
    ["Veil", { look: 12, finish: 0, palette: 8, loop: 20, dark: 0.6, glow: 0.85 }, [7, 3, 6]],
    ["Rippled Veil", { look: 12, finish: 7, palette: 1, loop: 20, dark: 0.55 }, [6, 3, 8]],
    ["Window Light", { look: 14, finish: 0, palette: 0, loop: 20, dark: 0.6, glow: 0.9 }, [5, 9, 1]],
    ["Stained Window", { look: 14, finish: 8, palette: 3, loop: 20, dark: 0.65, glow: 0.75 }, [4, 1, 0]],
    ["Pillar", { look: 19, finish: 0, palette: 1, loop: 20, dark: 0.6 }, [0, 3, 5]],
    ["Glass Pillar", { look: 19, finish: 6, palette: 5, loop: 20, dark: 0.6 }, [0, 10, 1]],
    ["Embossed Flow", { look: 2, finish: 15, palette: 10, loop: 12, warp: 0.4 }, [0, 1, 5]],
    ["Frosted Halo", { look: 5, finish: 5, palette: 7, loop: 20, haSize: 0.75, haBands: 8, haTilt: -10, haSoft: 0.4 }, [8, 3, 1]],
    // second 2026-10-30 batch
    ["Silk Wave", { look: 29, finish: 0, palette: 7, loop: 20, dark: 0.6 }, [8, 3, 1]],
    ["Arc", { look: 30, finish: 0, palette: 5, loop: 20, dark: 0.6 }, [0, 9, 1]],
    ["Bloom Bars", { look: 32, finish: 0, palette: 3, loop: 20, dark: 0.6 }, [1, 9, 7]],
    ["Spotlights", { look: 33, finish: 0, palette: 0, loop: 20, dark: 0.6 }, [5, 1, 9]],
    ["Fog Bank", { look: 34, finish: 0, palette: 1, loop: 20, dark: 0.55 }, [6, 3, 10]],
    ["Halo Ring", { look: 35, finish: 0, palette: 5, loop: 20, dark: 0.6 }, [0, 1, 7]],
    ["Eclipse", { look: 36, finish: 0, palette: 10, loop: 20, dark: 0.6 }, [5, 1, 3]],
    ["Lattice Light", { look: 37, finish: 0, palette: 1, loop: 20, dark: 0.6 }, [3, 6, 5]],
    ["Gradient Sweep", { look: 38, finish: 0, palette: 9, loop: 20, dark: 0.5 }, [7, 8, 11, 1]],
    ["Scan Beam", { look: 40, finish: 0, palette: 3, loop: 10, dark: 0.6 }, [1, 4, 10]],
    ["Iris Sweep", { look: 38, finish: 28, palette: 11, loop: 20, dark: 0.4 }, [9, 7, 1]],
    ["Brushed Silver", { look: 2, finish: 20, palette: 10, loop: 12, dark: 0.55 }, [11, 5, 1]],
    ["Leaking Light", { look: 12, finish: 27, palette: 0, loop: 20, dark: 0.6 }, [5, 9]],
    ["Canvas Flow", { look: 2, finish: 29, palette: 9, loop: 12, dark: 0.55 }, [0, 7, 5]],
    ["Mirrored Rays", { look: 4, finish: 17, palette: 1, loop: 20, dark: 0.55 }, [3, 6, 10]],
    ["Sunset Steps", { look: 42, finish: 0, palette: 9, loop: 20, dark: 0.55 }, [0, 5, 7]],
    ["Streaks", { look: 44, finish: 0, palette: 1, loop: 10, dark: 0.6 }, [3, 6, 10]],
    ["Echo", { look: 47, finish: 0, palette: 6, loop: 20, dark: 0.6 }, [1, 3, 8]],
    ["Edge Light", { look: 51, finish: 0, palette: 3, loop: 20, dark: 0.3 }, [1, 7, 11]],
    ["Pixel Flow", { look: 2, finish: 39, palette: 1, loop: 12, dark: 0.55 }, [3, 6, 0]],
    ["Split Veil", { look: 12, finish: 40, palette: 8, loop: 20, dark: 0.6 }, [7, 11, 3]],
    ["Sky Opening", { look: 53, finish: 0, palette: 7, loop: 20, dark: 0.3 }, [3, 1, 9]],
    ["Light Field", { look: 54, finish: 0, palette: 3, loop: 20, dark: 0.3 }, [1, 7, 9]],
    ["Corner Form", { look: 55, finish: 0, palette: 0, loop: 20, dark: 0.35 }, [5, 3, 1]],
    ["Ellipse Glass", { look: 58, finish: 0, palette: 7, loop: 20, dark: 0.3 }, [3, 11, 1]],
    ["Portal", { look: 59, finish: 0, palette: 1, loop: 20, dark: 0.35 }, [3, 6, 7]],
    ["Hidden Light", { look: 60, finish: 0, palette: 0, loop: 20, dark: 0.35 }, [5, 1, 3]],
    ["Oculus", { look: 61, finish: 0, palette: 3, loop: 20, dark: 0.35 }, [1, 7, 9]],
    ["Threshold", { look: 62, finish: 0, palette: 4, loop: 20, dark: 0.35 }, [7, 0, 3]],
    ["Light Cross", { look: 63, finish: 0, palette: 5, loop: 20, dark: 0.35 }, [0, 1, 7]],
    ["Corridor", { look: 68, finish: 0, palette: 3, loop: 20, dark: 0.35 }, [1, 7, 11]],
    ["Arch Opening", { look: 69, finish: 0, palette: 1, loop: 20, dark: 0.35 }, [3, 6, 9]],
    ["Three Arches", { look: 69, finish: 0, palette: 9, loop: 20, dark: 0.35, arCount: 3, lx2: 0.3 }, [7, 5, 1]],
    ["Pool", { look: 73, finish: 0, palette: 7, loop: 20, dark: 0.35 }, [3, 9, 1]],
    ["Moiré", { look: 74, finish: 0, palette: 3, loop: 20, dark: 0.45 }, [1, 7, 11]],
    ["Checker Warp", { look: 75, finish: 0, palette: 1, loop: 20, dark: 0.5 }, [3, 6, 10]],
    ["Beacon", { look: 76, finish: 0, palette: 0, loop: 20, dark: 0.5 }, [5, 4, 9]],
    ["Grid Floor", { look: 77, finish: 0, palette: 3, loop: 10, dark: 0.4 }, [1, 7, 9]],
    ["Hazy Flow", { look: 2, finish: 49, palette: 7, loop: 12, dark: 0.45 }, [3, 9, 1]],
    ["Hazy Rays", { look: 4, finish: 49, palette: 1, loop: 20, dark: 0.45 }, [3, 6, 7]],
    ["Reflected Rays", { look: 4, finish: 56, palette: 0, loop: 20, dark: 0.45 }, [5, 1, 3]],
    ["Reflected Arches", { look: 69, finish: 56, palette: 1, loop: 20, dark: 0.35, arCount: 3, lx2: 0.3 }, [3, 7]],
    ["Washed Flow", { look: 2, finish: 52, palette: 9, loop: 20, dark: 0.5 }, [7, 3, 0]],
    ["Dune Lines", { look: 84, finish: 0, palette: 0, loop: 20, dark: 0.45 }, [5, 9, 1]],
    ["Phase Rings", { look: 91, finish: 0, palette: 3, loop: 20, dark: 0.45 }, [1, 7, 11]],
    ["Scan Grid", { look: 92, finish: 0, palette: 1, loop: 10, dark: 0.45 }, [3, 6, 10]],
    ["Glass Orb", { look: 94, finish: 0, palette: 7, loop: 20, dark: 0.45 }, [3, 1, 11]],
    ["Curved Horizon", { look: 102, finish: 0, palette: 9, loop: 20, dark: 0.4 }, [1, 3, 0]],
    ["Twin Apertures", { look: 103, finish: 0, palette: 3, loop: 20, dark: 0.35 }, [7, 1, 5]],
    ["Ripple Floor", { look: 109, finish: 0, palette: 1, loop: 20, dark: 0.45 }, [3, 6, 8]],
    ["Light Columns", { look: 110, finish: 0, palette: 5, loop: 20, dark: 0.45 }, [0, 3, 1]],
    ["Cane Flow", { look: 2, finish: 59, palette: 8, loop: 12, dark: 0.5 }, [6, 3, 1]],
    ["Glint Rays", { look: 4, finish: 68, palette: 5, loop: 20, dark: 0.5 }, [0, 10]],
    ["Melted Halo", { look: 5, finish: 78, palette: 1, loop: 20, dark: 0.5 }, [3, 7]],
    ["Halo Bands", { look: 104, finish: 0, palette: 1, loop: 20, dark: 0.45 }, [3, 6, 7]],
    ["Wire Sphere", { look: 115, finish: 0, palette: 3, loop: 20, dark: 0.45 }, [1, 7, 11]],
    ["Wire Cube", { look: 116, finish: 0, palette: 0, loop: 20, dark: 0.45 }, [5, 3, 1]],
    ["Glitter", { look: 118, finish: 0, palette: 5, loop: 20, dark: 0.45 }, [0, 7, 11]],
    ["Nested Squares", { look: 120, finish: 0, palette: 3, loop: 20, dark: 0.45 }, [1, 9, 7]],
    ["Plasma", { look: 126, finish: 0, palette: 9, loop: 20, dark: 0.5 }, [7, 3, 0]],
    ["Circuit", { look: 130, finish: 0, palette: 1, loop: 10, dark: 0.45 }, [3, 6, 10]],
    ["Spotlit Flow", { look: 2, finish: 111, palette: 9, loop: 20, dark: 0.3 }, [7, 3, 0]],
    ["Panels", { look: 4, finish: 95, palette: 0, loop: 20, dark: 0.45 }, [5, 1, 3]],
    ["Arched Reeds", { look: 2, finish: 1, palette: 5, loop: 12, reeds: 9, refract: 0.3, reedShape: 3, dark: 0.55 }, [0, 9, 1]],
    ["Stained Aura", { look: 1, finish: 8, palette: 4, loop: 12, dark: 0.6, glow: 0.85 }, [0, 9, 3]],
    ["Glass Block Mesh", { look: 7, finish: 6, palette: 9, loop: 10, warp: 0.5, dark: 0.7, glow: 0.7 }, [3, 7, 6]]
  ];
  function hex(rgb) { return rgb.map(function (v) { return (v < 16 ? "0" : "") + v.toString(16); }).join(""); }
  function rgb(h) { return [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16) / 255; }); }

  var FRAG = [
    "precision highp float;",
    "uniform vec2 r; uniform float th; uniform int look, finish; uniform vec3 c0, c1, c2, c3; uniform float p1, p2;",
    "uniform float cx1, cx2, cx3, cx4, cx5; uniform float flow, scale, warp, glow, dark, grain, seed, cyc, amp, reeds, refract, angle, htSize, htAngle, htFill, tlCount, tlGap, tlVary, slDensity, slStrength, slRoll, haSize, haBands, haTilt, haSoft, crW, crArm, crBar, crGlow, crFlick, reedShape, meshN, meshSoft, pwDens, pwAmp, pwFreq, pwDot, dgSize, dgDens, dgDot, dgTilt, fx1, fx2, fx3, lx1, lx2, lx3, shift, shiftY, auCount, auSpread, auSoft, flDetail, flContrast, flDrift, rgCount, rgFall, rgSharp, rayCount, rayOrigin, rayLen, elFog, ptShape, irFill, irAngle, arCount, orbIn, lcBright, lcPulse, tpCount; uniform vec3 ir1, ir2;",
    "float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}",
    "float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}",
    "float fbm(vec2 p){float v=0.,a=.5;mat2 R=mat2(.8,.6,-.6,.8);for(int i=0;i<5;i++){v+=a*n(p);p=R*p*2.03;a*=.5;}return v/.97;}",
    "float sn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*f*(f*(f*6.-15.)+10.);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}",   // quintic: no grid creases
    "float fs(vec2 p,int o){float v=0.,a=.5,t=0.;for(int i=0;i<4;i++){if(i>=o)break;v+=a*sn(p);t+=a;p=p*2.+vec2(37.,91.);a*=.5;}return v/t;}",   // the Flow pack's smooth fbm
    "float TH;vec2 C(float k){return vec2(cos(TH*k),sin(TH*k));}",   // TH = th x whole cycles: seamless at any speed                      // whole turns per loop: seamless
    "vec3 ramp(float v){v=clamp(v,0.,1.);return v<p1?mix(c0,c1,v/p1):v<p2?mix(c1,c2,(v-p1)/(p2-p1)):mix(c2,c3,(v-p2)/(1.-p2));}",   // custom gradient: four colors, two movable stops
    // Your video (look 204): a video or image file as the picture. vid / vid2 = the frame and, across the loop seam, the frame it fades from;
    // vasp = the file's aspect (covers the screen, centered); vtint 0 = its own colors with the finish on top, 1 = recolored through the palette
    "uniform sampler2D vid, vid2; uniform float vmix, vasp, vtint;",
    "vec2 vcov(vec2 p){float a=r.x/r.y;vec2 q=vasp>a?vec2(p.x/vasp,p.y):vec2(p.x/a,p.y*a/vasp);return q*.5+.5;}",
    "vec3 vrgb(vec2 q){q=clamp(q,0.,1.);return mix(texture2D(vid2,q).rgb,texture2D(vid,q).rgb,vmix);}",
    "float rbox(vec2 p,vec2 b,float rr){vec2 q=abs(p)-b+rr;return length(max(q,0.))+min(max(q.x,q.y),0.)-rr;}",   // rounded-rectangle distance
    "uniform float lx4, lx5, fx4, fx5, dyRate, dyTurb, dySwirl, dyWave, dyWaveF, dyPulse, dySway, dyDrift, dyStretch, dyLiquid, dyRipple, dyBreathe, dyFlick, dyBeat, dyPunch, dySweep, dyHue, dyHueW, dySplit, dyEcho, dfRate, dfWobble, dfDrift, dfZoom, dfSway, dfAmt, dfPulse, dfMotion;",
    "float PH(){return TH/6.28318;}",
    "float DTH;",
    "vec2 dyn(vec2 p){",
    "float R=dyRate*DTH;vec2 c1=vec2(cos(R),sin(R));float l;",
    "if(dyDrift>.001)p+=c1*dyDrift*.35;",
    "if(dyPulse>.001)p*=1.+c1.y*dyPulse*.28;",
    "if(dyStretch>.001)p*=vec2(1.+c1.x*dyStretch*.32,1.-c1.x*dyStretch*.32);",
    "if(dySway>.001){l=c1.y*dySway*.65;p=mat2(cos(l),-sin(l),sin(l),cos(l))*p;}",
    "if(dySwirl>.001){float d=length(p);l=dySwirl*2.4*sin(R+d*2.2)*exp(-d*.45);p=mat2(cos(l),-sin(l),sin(l),cos(l))*p;}",
    "if(dyWave>.001){p.x+=sin(p.y*dyWaveF*2.5+R)*dyWave*.26;p.y+=sin(p.x*dyWaveF*1.9-R)*dyWave*.16;}",
    "if(dyRipple>.001){float d=length(p)+1e-4;p+=p/d*sin(d*11.-R*2.)*dyRipple*.07;}",
    "if(dyTurb>.001){vec2 q=p*1.7;vec2 e=vec2(.05,0.);for(int i=0;i<2;i++){vec2 tq=q+c1*.75*(1.+float(i));float a=sn(tq+e.yx),b=sn(tq-e.yx),cc=sn(tq+e),dd=sn(tq-e);p+=vec2(a-b,dd-cc)/.1*dyTurb*.09/(1.+float(i));q=q*2.1+3.7;}}",
    "if(dyLiquid>.001){vec2 q=vec2(fbm(p*1.15+c1*.55),fbm(p*1.15+vec2(5.2,1.3)-c1*.55));vec2 w=vec2(fbm(p*1.15+q*2.+vec2(1.7,9.2)+c1.yx*.3),fbm(p*1.15+q*2.+vec2(8.3,2.8)-c1.yx*.3));p+=(w-.5)*dyLiquid*1.5;}",
    "return p;",
    "}",
    "vec2 finDyn(vec2 p){",
    "float R=dfRate*th;vec2 c1=vec2(cos(R),sin(R));float l;",
    "if(dfDrift>.001)p+=c1*dfDrift*.4;",
    "if(dfZoom>.001)p*=1.+c1.y*dfZoom*.28;",
    "if(dfSway>.001){l=c1.x*dfSway*.6;p=mat2(cos(l),-sin(l),sin(l),cos(l))*p;}",
    "if(dfWobble>.001){vec2 tq=p*1.3+c1*.7;p+=(vec2(sn(tq+seed),sn(tq.yx+seed+4.))-.5)*dfWobble*.65;}",
    "return p;",
    "}",
    "vec3 hueR(vec3 c,float a){float cs=cos(a),sn0=sin(a);vec3 k=vec3(.57735);return c*cs+cross(k,c)*sn0+k*dot(k,c)*(1.-cs);}",
    "float LTH;float fieldL(vec2 p){ p=dyn(p); float FL=pow(flow,1.8);",   // Movement: curved so the slider spans barely-drifting to big sweeping motion (1 = unchanged)
    " vec2 o=C(1.)*FL*.9*amp, o2=C(2.)*FL*.45*amp; p-=vec2(shift*r.x/r.y,shiftY)*2.; p=p/scale; vec2 S=vec2(seed,seed*.7);",   // the seed varies texture only; shapes stay centered
    " if(look==204)return dot(vrgb(vcov(p)),vec3(.299,.587,.114));",   // your video: its brightness is the field, so every finish works on it
    " if(look==0){p+=S;o*=.28;o2=vec2(cos(TH+1.7),sin(TH+1.7))*FL*.11*amp;vec2 q=vec2(fbm(p*1.3+o),fbm(p*1.3+vec2(5.2,1.3)-o));vec2 w=vec2(fbm(p*1.5+2.4*warp*q+vec2(1.7,9.2)+o2),fbm(p*1.5+2.4*warp*q+vec2(8.3,2.8)-o2));",
    "   float f=fbm(p*1.1+2.8*warp*w);return smoothstep(.32,.95,f)*.85+pow(1.-abs(sin(f*5.+w.x*2.2)),6.)*.5*smoothstep(.4,.8,f);}",
    " if(look==1){float a=0.;for(int i=0;i<6;i++){float fi=float(i);if(fi>=auCount)break;vec2 c=vec2(sin(fi*2.1+seed)*.8,cos(fi*1.7+seed)*.4)*auSpread+vec2(cos(TH*(1.+mod(fi,2.))+fi),sin(TH*(1.+mod(fi,2.))+fi*1.3))*vec2(.45,.3)*FL*amp;",
    "   a+=exp(-dot(p-c,p-c)/((.12+.05*fi)*auSoft))*(.55+.12*fi);}return 1.-exp(-1.1*a*(1.+.3*warp*fbm(p*2.+S+o)));}",
    " if(look==2){p+=S;vec2 P=p*.62*flDetail;vec2 a1=C(1.)*.25*FL*amp*flDrift,a2=vec2(cos(TH+2.1),sin(TH+2.1))*.25*FL*amp*flDrift;",   // the Flow pack recipe: two smooth fields warp a third
    "  float qx=fs(P+a1,3),qy=fs(P+vec2(1.73,.43)+a2,3);float v=fs(P+1.6*warp*vec2(qx,qy),4);return smoothstep(.61-.31/flContrast,.61+.31/flContrast,v)*.74;}",
    " if(look==3){vec2 q=p;   /* rings: no warp, clean circles */float d=length(q);return pow(.5+.5*sin(d*rgCount-TH*3.),rgSharp)*exp(-d*rgFall)*1.3;}",
" if(look==5){float R=haSize;vec2 q=mat2(cos(haTilt),sin(haTilt),-sin(haTilt),cos(haTilt))*p;float d=length(p);",   // Halo: banded glowing sphere
    "  float inside=smoothstep(R*(1.+haSoft*.25),R*(1.-haSoft*.25),d);float sh=sqrt(max(0.,1.-d*d/(R*R)));",
    "  float st=pow(.5+.5*sin(q.y/R*haBands*3.14159+TH*2.+warp*.8*sin(q.x/R*3.+TH)),2.5);",
    "  return inside*(.2+.8*st)*(.35+.65*sh)+exp(-max(d-R,0.)*3.5/(.4+haSoft))*.25;}",
    " if(look==6){float pl=.5-.5*cos(TH*4.);pl=pl*pl*(3.-2.*pl);float br=.85+.15*cos(TH);",   // pulse: the glow around the cross swells and eases back, 4x per loop
    "  float ex=p.x/crW;float v=exp(-ex*ex)*smoothstep(-.95,-.7,p.y)*smoothstep(1.05,.75,p.y);",   // Cross: beams of light
    "  float ey=(p.y-crBar)/(crW*.85),ea=p.x/crArm;ea*=ea;float hz=exp(-ey*ey)*exp(-ea*ea);",
    "  float dy=p.y-crBar;float gs=.35*crGlow*(1.+crFlick*.9*pl);float g=exp(-(p.x*p.x+dy*dy)/gs)*.35*crGlow*(1.+crFlick*1.3*pl);return max(v,hz)*br+g;}",
    " if(look==7){float num=0.,den=0.;for(int i=0;i<8;i++){if(float(i)>=meshN)break;float fi=float(i);",   // Mesh: soft multi-tone mesh gradient
    "  vec2 c=vec2(sin(fi*2.3+seed)*1.3,cos(fi*1.9+seed*1.3)*.75)+vec2(cos(TH+fi*1.7),sin(TH+fi*2.2))*.35*FL*amp;",
    "  float d2=dot(p-c,p-c);float w=1./(d2*d2*4.+meshSoft*.05+.001);num+=w*fract(fi*.618+.15);den+=w;}",
    "  return num/den+warp*.08*(fbm(p*2.+S+o)-.5);}",
    " if(look==8){float Yd=-p.y,rows=floor(pwDens*2.25),dx=7./(pwDens*4.),r=pwDot*.0045,acc=0.;",   // Point Wave: the pack's dot surface in perspective
    "  for(int j=0;j<200;j++){float fj=float(j);if(fj>=rows)break;float z=1.+8.*fj/(rows-1.),x0=p.x*z/1.6;",
    "   for(int k=-1;k<=1;k++){float xc=(floor(x0/dx+.5)+float(k))*dx;if(abs(xc)>3.5)continue;",
    "    float y=pwAmp*(.35*sin(xc*1.1*pwFreq+TH)*cos(z*.8*pwFreq-TH)+.15*sin((xc*2.3-z)*pwFreq+2.*TH));",
    "    vec2 d=vec2(p.x-xc/z*1.6,Yd-((y+.8)/z*1.6-.05));float d2=dot(d,d);acc+=exp(-z/5.)*(exp(-d2/(r*r))+.12*exp(-d2/(r*r*16.)));}}",
    "  return 1.-exp(-acc*.38);}",   // soft roll-off so dense crests glow instead of clipping
" if(look==9){float R=dgSize;float d=length(p);if(d>R*1.02)return exp(-(d-R)*6.)*.12;",   // Dot Globe: a turning sphere of dots
    "  vec2 q=p/R;float z=sqrt(max(0.,1.-dot(q,q)));float t=dgTilt;vec3 nn=vec3(q.x,q.y*cos(t)-z*sin(t),q.y*sin(t)+z*cos(t));",
    "  float lon=atan(nn.x,nn.z)+TH;float lat=asin(clamp(nn.y,-1.,1.));vec2 f=fract(vec2(lon/6.28318*dgDens*2.,lat/3.14159*dgDens))-.5;f.x*=cos(lat);",
    "  return smoothstep(dgDot*.3,dgDot*.3-.08,length(f))*(.25+.75*z)*smoothstep(.95,.62,abs(nn.y))+exp(-abs(d-R)*20.)*.15;}",   // dots fade out at the poles
    " if(look==10){vec2 c=vec2(0.,lx3)+C(1.)*.03*FL*amp;float br=.85+.15*cos(TH)+.05*sin(TH*3.);float d=length((p-c)*vec2(1.,.8));float hz=fbm(p*1.6+S+o*.5);",   // candle haze
    "  return (exp(-d*d/(lx1*lx1*.5))*br*.95+exp(-d/(lx1*1.6))*.35)*(1.-lx2*.45+lx2*.7*hz);}",
    " if(look==11){float y=p.y-lx3;float band=exp(-y*y/(lx1*lx1))*(.75+.25*cos(TH));float hz=fs(vec2(p.x*.6,y*3.)+S+o*.4,3);",   // dawn line
    "  return (band*.9+exp(-abs(y)*2.)*.35)*(1.-lx2*.5+lx2*.9*hz)*(y<0.?.55+.45*exp(y*4.):1.);}",
    " if(look==12){float a=lx3*.0174533;vec2 d=vec2(cos(a),sin(a));float v=0.;for(int i=0;i<3;i++){float fi=float(i);float dir=mod(fi,2.)*2.-1.;",   // veil: sheer layers
    "  float w=dot(p,vec2(-d.y,d.x))*lx1*(1.+fi*.6)+fbm(p*.8+S+fi*3.1+o*(.6+fi*.3))*warp*4.+TH*dir;v+=pow(.5+.5*sin(w),1.+(1.-lx2)*6.)*(.45-fi*.1);}",
    "  return v*exp(-length(p)*.35)*1.2;}",
    " if(look==13){float acc=0.,t=TH/6.28318;for(int L=0;L<2;L++){float fl=float(L);float k=lx1*(1.+fl*.7);vec2 q=p*k+vec2(fl*7.,0.);q.y-=t*(2.+fl);",   // ember drift: sparks rising, whole cells per loop
    "  vec2 cl=floor(q),f=fract(q)-.5;vec2 jp=(vec2(h(cl+fl),h(cl+fl+3.3))-.5)*.7;float d=length(f-jp);",
    "  acc+=exp(-d*d/(.004*lx2*lx2*(.5+h(cl+5.))))*step(.55,h(cl+1.7))*(.6+.4*sin(TH*3.+h(cl)*6.28))*(1.-fl*.4);}",
    "  float beam=exp(-p.x*p.x*2.5)*smoothstep(-1.4,.8,.2-p.y);return acc*(1.-lx3*.5+lx3*beam)+beam*lx3*.4*(.8+.2*fbm(p*2.+S+o));}",
    " if(look==14){float a=lx3*.0174533;mat2 R=mat2(cos(a),-sin(a),sin(a),cos(a));vec2 q=R*p*vec2(1.,1.15)+C(1.)*.06*FL*amp;q.x+=q.y*.35;float e=.04+lx2*.3;",   // window light
    "  float m=smoothstep(.95+e,.95-e,abs(q.x))*smoothstep(.7+e,.7-e,abs(q.y));vec2 g=fract((q+vec2(.95,.7))*lx1/vec2(1.9,1.4));",
    "  float mul=smoothstep(0.,.04+lx2*.08,min(min(g.x,1.-g.x),min(g.y,1.-g.y)));return m*(.35+.65*mul)*(.75+.35*fbm(p*2.+S+o))+exp(-length(p)*1.2)*.12;}",
    " if(look==15){float d=length(p)/lx3,v=0.;for(int i=0;i<6;i++){if(float(i)>=lx1)break;float ph=fract(TH/6.28318+float(i)/lx1);float w=.05+lx2*.35;",   // breath: soft rings that swell outward
    "  float e=(d-ph*1.8)/w;v+=exp(-e*e)*(1.-ph)*sin(ph*3.14159)*1.4;}return v*.8+exp(-d*1.5)*.35*(.8+.2*cos(TH));}",
    " if(look==16){vec2 q=p*lx1+S;float w1=fbm(q+o*.6),w2=fbm(q*1.7+vec2(w1*2.,0.)+o2);float f=fbm(q+warp*2.*vec2(w1,w2)+vec2(0.,-lx3*sin(TH)*.4));",   // smoke
    "  float rid=1.-abs(f*2.-1.);return pow(rid,6.-lx2*4.)*(.6+.4*w2)*exp(-length(p)*.3)*1.1;}",
    " if(look==17){float v=0.;for(int i=0;i<16;i++){if(float(i)>=lx1)break;float fi=float(i);",   // lanterns: soft orbs at different depths
    "  vec2 c=vec2(h(vec2(fi,1.)+seed)*3.6-1.8,h(vec2(fi,2.)+seed)*2.-1.)+vec2(cos(TH+fi*1.9),sin(TH+fi*2.7))*.12*FL*amp;float z=.4+.6*h(vec2(fi,3.)+seed);",
    "  float R=lx2*.18*z,d=length(p-c),e=R*(.15+lx3*.9);v+=smoothstep(R+e,R-e,d)*(.35+.65*z)*(.8+.2*cos(TH+fi*2.))*(.55+.45*smoothstep(R,0.,d));}return v*.85+.06;}",
    " if(look==18){float y=p.y-lx3;float src=exp(-p.x*p.x*1.2);float wv=sin(y*lx1*14.+fbm(vec2(p.x*2.,y*6.)+S+o)*6.+TH*2.);",   // tide: light on water
    "  float lines=pow(.5+.5*wv,2.+(1.-lx2)*10.);return src*(lines*step(y,0.)*exp(y*1.6)*1.2+exp(-max(y,0.)*3.)*.4*step(0.,y))+exp(-y*y*30.)*src*.5;}",
    " if(look==19){float x=p.x+p.y*tan(lx3*.0174533);float col=exp(-x*x/(lx1*lx1))*(.75+.25*smoothstep(-1.2,1.,p.y));float hz=fbm(vec2(x*3.,p.y*1.5)+S+o*.5);",   // pillar of light (dust removed 2026-10-31)
    "  return col*(.6+.4*hz)*(.85+.15*cos(TH))+exp(-x*x*1.5)*.12;}",
    " if(look==20){vec2 q=p-vec2(0.,lx3);q.x+=(fbm(vec2(q.y*2.5,1.)+S+C(1.)*.4)-.5)*.18*lx2*smoothstep(-.1,.6,q.y);",   // candle haze II: a flame core, bloom and rising haze
    "  float fl=exp(-pow(q.x/(lx1*.22),2.)-pow(max(q.y,0.)/(lx1*.9),2.)-pow(min(q.y,0.)/(lx1*.35),2.));float bl=exp(-length(q*vec2(1.,.8))/(lx1*1.1));",
    "  float fk=.9+.06*sin(TH*7.)*lx2+.04*sin(TH*13.+1.)*lx2;float hz=fbm(p*1.4+S+vec2(0.,sin(TH)*.3)+o*.4);return fl*fk*1.1+bl*.45*fk+hz*bl*.3;}",
    " if(look==21){float a=lx3*.0174533;vec2 q=mat2(cos(a),-sin(a),sin(a),cos(a))*p;float w1=fs(q*vec2(.6,1.)*.8+S+o*.5,3),w2=fs(q*1.3+vec2(4.,1.)+S-o2*.6,3);",   // veil II: sheer silk with a moving sheen
    "  float u=q.y*lx1*1.6+w1*6.*warp+(w2-.5)*1.5;float sh=pow(1.-abs(sin(u*.5+w2*2.)),10.)*lx2;return ((.5+.5*sin(u))*.45+sh*.7)*(.5+.6*fs(q*.5+S*2.+o2,3))*exp(-length(p)*.25);}",
    " if(look==22){vec2 q=p*lx1+S;float h0=fs(q+o*.6,4),hx=fs(q+vec2(.02,0.)+o*.6,4),hy=fs(q+vec2(0.,.02)+o*.6,4);vec2 nn=vec2(h0-hx,h0-hy)*50.;",   // liquid chrome: a reflective surface
    "  float rf=smoothstep(.2,.8,.5+.5*sin(nn.y*lx3*.3+nn.x*.8+h0*lx3));return rf*rf*.5*(.35+.65*h0)+pow(max(0.,1.-length(nn-vec2(.4,.6))*.7),8.)*lx2*.85;}",
    " if(look==23){float y=p.y-lx3-sin(p.x*1.3+TH)*.25*lx2-sin(p.x*.6-TH+1.)*.15;float t=y/lx1;float tw=.5+.5*sin(p.x*2.*lx2+TH*2.);",   // chrome ribbon
    "  float mt=pow(.5+.5*sin(t*6.+tw*4.+p.x*1.5),3.);return smoothstep(1.,.8,abs(t))*(.15+mt*.85)+exp(-pow((abs(t)-.95)*12.,2.))*.6+exp(-abs(y)*3.)*.08;}",
    " if(look==24){float st=0.;for(int L=0;L<2;L++){float fl=float(L);float k=18.+fl*16.;vec2 q=(p+o*lx3*(.3+fl*.3))*k;vec2 cl=floor(q),f=fract(q)-.5;",   // starfield
    "   vec2 dd=f-(vec2(h(cl+fl),h(cl+fl+3.1))-.5)*.7;st+=exp(-dot(dd,dd)*240.)*step(.95-lx1*.25,h(cl+fl*2.3))*(.5+.5*sin(TH*3.+h(cl)*6.28));}",
    "  float nb=fbm(p*.9+S+o2*.3);return st*1.2+nb*nb*.6*lx2;}",
    " if(look==25){vec2 q=p*lx1;float r=length(q);vec2 w=vec2(fbm(q+S+o),fbm(q+S+vec2(3.,1.)-o));float f=fbm(q*1.5+w*lx3*1.5+vec2(r*.5));return f*f*1.2*exp(-r*.5)+exp(-r*r*3.)*lx2*.6;}",   // nebula
    " if(look==26){vec2 q=p-vec2(0.,lx3);float a=atan(q.x,max(q.y,.001)),d=length(q);float rr=pow(.5+.5*sin(a*lx1+fbm(vec2(a*3.,0.)+S+o*.4)*2.),1.+(1.-lx2)*4.);",   // horizon rays
    "  return rr*exp(-d*.6)*.9*step(0.,q.y)+exp(-abs(q.y)*8.)*.5+exp(-d*1.5)*.4;}",
    " if(look==27){float tp=smoothstep(-1.2,1.,p.y);float cf=fbm(p*vec2(3.,1.5)+S+o*.8);float ca=pow(1.-abs(sin(cf*9.)),6.)*lx2*tp;",   // ocean glow: light from the surface
    "  float ry=pow(.5+.5*sin(p.x*4.+fbm(vec2(p.x*2.,0.)+S+o2)*3.),4.)*lx3*tp*smoothstep(-1.,.8,p.y);return tp*(.25+.3*(1.-lx1))+ca*.5+ry*.35;}",
    " if(look==28){float v=0.;for(int i=0;i<5;i++){float fi=float(i);if(fi>=lx1)break;vec2 c=vec2(h(vec2(fi,1.)+seed)*2.4-1.2,h(vec2(fi,2.)+seed)*1.4-.7);",   // ripple pool
    "   float ph=fract(TH/6.28318+h(vec2(fi,7.)));float e=(length(p-c)-ph*1.6)/(.04+lx2*.12);v+=exp(-e*e)*(1.-ph);}return v*.9+fbm(p+S+o)*.15*(1.-lx3)+.04;}",
    " if(look==29){float a=lx3*.0174533;vec2 q=mat2(cos(a),-sin(a),sin(a),cos(a))*p;float v=0.;for(int i=0;i<3;i++){float fi=float(i);",   // silk wave
    "   v+=pow(.5+.5*sin(q.y*lx1*(1.+fi*.5)+sin(q.x*(.7+fi*.3)+TH*(1.+fi))*1.2+fi),1.+(1.-lx2)*5.)*(.5-fi*.12);}return v*exp(-length(p)*.3)*1.1;}",
    " if(look==30){vec2 c=vec2(0.,lx3);float d=length(p-c)-lx1;return exp(-d*d/(lx2*lx2))*(.85+.15*cos(TH+atan(p.x,p.y-lx3)*2.))+exp(-abs(d)*3.)*.2;}",   // arc
    " if(look==31){float v=0.;for(int i=0;i<4;i++){float fi=float(i);if(fi>=lx3)break;for(int j=0;j<8;j++){float fj=float(j);",   // orbit: orbs and their trails
    "   float an=TH+fi*6.28318/lx3-fj*.09*lx2;vec2 ps=vec2(cos(an),sin(an)*.55)*lx1;float dd=dot(p-ps,p-ps);v+=exp(-dd*(90.+fj*20.))*(1.-fj/8.)*(fj<.5?1.:.45);}}return v+exp(-length(p)*1.5)*.1;}",
    " if(look==32){float x=p.x*lx1*.35;float id=floor(x+.5),f=x-id;float br=exp(-f*f/(.02+lx2*.12));return br*(.6+.4*sin(TH*2.+id*1.7)*lx3)*(smoothstep(-1.2,.2,p.y)*.6+.4)*exp(-abs(p.y)*.4);}",   // bloom bars
    " if(look==33){float v=0.;for(int i=0;i<5;i++){float fi=float(i);if(fi>=lx1)break;float x0=(fi-(lx1-1.)*.5)*.9;float an=sin(TH+fi*1.3)*.35*lx2*FL;",   // spotlights
    "   vec2 q=p-vec2(x0,1.1);float ax=q.x*cos(an)-q.y*sin(an),ay=-(q.x*sin(an)+q.y*cos(an));float z=ax/(max(ay,.01)*lx3+.02);v+=exp(-z*z)*step(0.,ay)*exp(-ay*.35)*.55;}",
    "  return v*(.85+.15*fbm(p*2.+S+o))+.03;}",
    " if(look==34){float y=p.y-lx1;float fg=fbm(vec2(p.x*1.2,y*3.)+S+o*.5)*smoothstep(.4+lx2*.6,-.2,y);float bk=exp(-length(p-vec2(0.,lx1+.3))*1.2)*lx3;return fg*.8+bk*.8*(1.-fg*.5);}",   // fog bank
    " if(look==35){float a=atan(p.y,p.x);float d=length(p)-lx1*(1.+.035*sin(TH));float sw=.55+.45*pow(.5+.5*cos(a-TH),3.);float sh=.8+.4*fbm(vec2(cos(a),sin(a))*1.6+d*4.+S+o*.6);float br=.85+.15*sin(TH*2.);",   // halo ring: breathes, a bright arc travels round it, the glow shimmers
    "  return (exp(-d*d/(lx2*lx2))*sw*sh*1.15+exp(-length(p)/lx1*1.5)*lx3*.5*br+exp(-abs(d)*4.)*.15*(.7+.3*sw))*br;}",
    " if(look==36){float d=length(p)-lx1;float a=atan(p.y,p.x);float cr=exp(-max(d,0.)*(3.-lx2*2.))*(.7+.3*fbm(vec2(a*3.,d*4.)+S+o));",   // eclipse: dark disc, corona, a diamond bead
    "  float bd=exp(-dot(p-vec2(cos(2.3),sin(2.3))*lx1,p-vec2(cos(2.3),sin(2.3))*lx1)*400.)*lx3*1.5;return cr*smoothstep(0.,.01,d)*.9+exp(-d*d/.000225)*.8+bd;}",
    " if(look==37){vec2 q=mat2(.7071,-.7071,.7071,.7071)*p*lx1;vec2 g=abs(fract(q)-.5);float ln=exp(-min(g.x,g.y)*min(g.x,g.y)/(.002+lx2*.01));",   // lattice light
    "  return ln*(.6+.4*sin(TH+length(p)*2.)*lx3)*exp(-length(p)*.4)*(.7+.3*fbm(p+S+o));}",
    " if(look==38){float an=sin(TH)*lx1*1.5*FL;float t=dot(p,vec2(cos(an),sin(an)))*.4/lx3+.5;return clamp(mix(smoothstep(.2,.8,t),t,lx2),0.,1.)*.55;}",   // gradient sweep
    " if(look==39){vec2 c1=vec2(-lx1,0.)+C(1.)*.15,c2=vec2(lx1,0.)-C(1.)*.15;float s2=lx2*lx2;return exp(-dot(p-c1,p-c1)/s2)*(.5+.4*lx3)+exp(-dot(p-c2,p-c2)/s2)*(.9-.4*lx3);}",   // dual glow
    " if(look==40){float a=lx3*.0174533;vec2 q=mat2(cos(a),-sin(a),sin(a),cos(a))*p;float d=q.y-sin(TH)*1.1*min(FL,1.6);float vl=cos(TH);",   // scan beam
    "  float tr=exp(-max(-d*sign(vl),0.)/(.1+lx2*.6))*step(0.,-d*sign(vl))*.35*lx2*smoothstep(0.,.3,abs(vl));return exp(-d*d/(lx1*lx1))+tr+exp(-abs(d)*2.)*.08;}",
    " if(look==41){float a=atan(p.y,p.x)+sin(TH)*.5*lx3,r=length(p);float pt=.5+.5*cos(a*lx1);float e=(r-lx2*(.4+.6*pt))/(.08+.1*pt);",   // petals
    "  return exp(-e*e)*.9+exp(-r*2.)*.3+exp(-r/lx2*2.)*pt*.2;}",
    " if(look==42){float y=p.y-lx3;float g=exp(-max(y,0.)*1.5)*exp(min(y,0.)*2.5);",   // sunset steps: stepped bands of light around a horizon
    "  float t=g*lx1+sin(p.x*1.1+TH)*.06*FL+(fbm(vec2(p.x*.6,y*2.)+S+o*.3)-.5)*.25;return (floor(t)+smoothstep(1.-max(lx2,.02),1.,fract(t)))/lx1*.9;}",
    " if(look==43){vec2 sc=vec2(0.,lx3);float v=exp(-length(p-sc)*1.1)*.9;for(int i=0;i<6;i++){float fi=float(i);if(fi>=lx1)break;",   // hillside: layered hills in front of a low light
    "  float px=p.x+sin(TH)*.08*(fi+1.)*FL;float hy=lx3-.25-fi*.24+.12*sin(px*(1.1+fi*.4)+fi*2.1+seed)+.05*sin(px*2.7+fi);float cv=smoothstep(.012,-.012,p.y-hy);",
    "  float tone=lx2*.45*(1.-fi/lx1)*exp(-length(p-sc)*.5);v=mix(v,tone,cv)+exp(-abs(p.y-hy)*40.)*.25*exp(-length(p-sc)*.8)*(1.-cv*.5);}return v;}",
    " if(look==44){float a=lx3*.0174533;vec2 q=mat2(cos(a),-sin(a),sin(a),cos(a))*p;float row=q.y*lx1*.5;float id=floor(row),f=fract(row)-.5;",   // streaks: thin lines of light sliding past
    "  float m=1.+floor(h(vec2(id,seed))*3.);float ds=pow(.5+.5*sin(q.x*1.5/(.2+lx2)+TH*m+h(vec2(id,3.))*6.28),6.);",
    "  return exp(-f*f*300.)*ds*(.3+.7*h(vec2(id,5.)))*exp(-length(p)*.35)*1.2+exp(-f*f*20.)*ds*.08;}",
    " if(look==45){vec2 q=vec2(p.x*.45,p.y*2.2)*lx1+S;float t=TH/6.28318;float t1=fract(t),t2=fract(t+.5);",   // river: water streaming sideways (two phases cross-fade so it loops)
    "  float f1=fbm(q-vec2(t1*2.,0.)+o2*.2),f2=fbm(q-vec2(t2*2.,0.)+vec2(3.1,1.7)+o2*.2);float w=abs(t1*2.-1.);float m=mix(f1,f2,w);",
    "  float ca=pow(1.-abs(sin(m*7.)),10.)*lx2;return (.25+.5*smoothstep(.3,.8,m))*(.55+.45*lx3*smoothstep(-1.2,.6,-abs(p.y)*1.2+.2))+ca*.45;}",
    " if(look==46){float v=exp(-(p.y+1.1)*2.2)*lx3*.6;for(int L=0;L<2;L++){float fl=float(L);float k=lx1*(.5+fl*.4);",   // sparks: glowing specks rising from a warm floor
    "  vec2 q=p*k-vec2(0.,TH/6.28318*(2.+fl));vec2 ci=floor(q),f=fract(q)-.5;f.x+=sin(TH+h(ci)*6.28)*.18;vec2 jo=(vec2(h(ci+1.3),h(ci+7.1))-.5)*.5;",
    "  float sz=(90.-lx2*60.)*(1.+fl);v+=exp(-dot(f-jo,f-jo)*sz)*step(h(ci+3.3),.35)*(.6+.4*sin(TH*3.+h(ci)*6.28))*smoothstep(1.3,-.9,p.y)*(1.-fl*.35);}return v;}",
    " if(look==47){vec2 q=p-vec2(0.,lx3);float d=length(q);float s2=fract(d*lx1*.35-TH/6.28318);",   // echo: soft rings pulsing outward, a slow sweep
    "  float sw=pow(.5+.5*cos(atan(q.y,q.x)-TH),24.)*.35;return (pow(s2,8.)*.9+sw)*exp(-d*(.4+lx2*1.4))+exp(-d*d*30.)*.6+exp(-d*1.6)*.12;}",
    " if(look==48){float a=atan(p.y,p.x),d=length(p);float arm=.5+.5*sin(a*floor(lx1+.5)+log(d+.05)*lx2*4.-TH+(fbm(p*1.5+S+o)-.5)*warp*3.);",   // whirl: soft spiral arms around a bright core
    "  return pow(arm,3.)*exp(-d*.7)*smoothstep(0.,.25,d)*.95+exp(-d*d/(.02+lx3*.12))*lx3*.9+exp(-d*1.4)*.12;}",
    " if(look==49){float a=lx3*.0174533;vec2 q=mat2(cos(a),-sin(a),sin(a),cos(a))*p+vec2(2.2,0.);float v=0.;",   // spectrum: one light fanning out into beams
    "  for(int i=0;i<9;i++){float fi=float(i);if(fi>=lx1)break;float an=(fi-(lx1-1.)*.5)*lx2*.3+sin(TH+fi)*.015*FL;vec2 dr=vec2(cos(an),sin(an));",
    "   float al=dot(q,dr),pd=dot(q,vec2(-dr.y,dr.x));float w=.01+.025*max(al,0.);v+=exp(-pd*pd/(w*w))*step(0.,al)*(.45+.55*fract(fi*.618+.3))*exp(-al*.22);}",
    "  return v*.8+exp(-length(q)*2.)*.6;}",
    " if(look==50){vec2 L=vec2(0.,lx3);float cl=fbm(p*vec2(1.,1.6)*1.2+S+o*.4);float c2=fbm((p+normalize(L-p+.001)*.08)*vec2(1.,1.6)*1.2+S+o*.4);",   // cumulus: a cloud bank lit from behind
    "  float th0=.68-lx1*.4;float sh=smoothstep(th0,th0+.06+lx2*.35,cl);float lit=clamp((cl-c2)*7.,0.,1.);",
    "  return exp(-length(p-L)*1.1)*(1.-sh*.85)+sh*(.12+.65*lit)*exp(-length(p-L)*.45);}",
    " if(look==51){vec2 b=vec2(r.x/r.y,1.)/scale;float dd=min(b.x-abs(p.x),b.y-abs(p.y));float th1=lx1*(.5+lx2);",   // edge light: the frame glows inward
    "  float v=exp(-max(dd,0.)/th1)*mix(1.,.75+.35*fbm(p*2.+S+o),elFog)*(1.-lx3*.35+lx3*.35*cos(TH));return v*.95+exp(-max(dd,0.)/(th1*4.))*.15;}",
    " if(look==52){float v=exp(-length(p-vec2(0.,lx3+.35))*1.)*.55;for(int i=0;i<6;i++){float fi=float(i);if(fi>=lx1)break;",   // peaks: mountain ridges, each edge a hard line of light
    "  float px=p.x+sin(TH)*.06*(fi+1.)*FL+fi*3.7+seed;float hy=lx3+.25-fi*.22+.42*(1.-abs(2.*n(vec2(px*1.1,fi*7.))-1.))+.14*(1.-abs(2.*n(vec2(px*3.,fi*7.+3.))-1.))+.035*(1.-abs(2.*n(vec2(px*9.,fi*5.))-1.))-.3;",
    "  float dd=p.y-hy;float cv=smoothstep(.003,-.003,dd);float sh=.8+.2*sin(px*2.-TH+fi);",
    "  float rim=(exp(-abs(dd)*(320.-lx2*180.))*.95+exp(-abs(dd)*14.)*.22*lx2)*sh*(1.-fi/lx1*.45);",
    "  v=mix(v,.03+.06*(1.-fi/lx1),cv)+rim*step(-.002,dd)+rim*.35*(1.-step(-.002,dd));}return v;}",
    " float br=.92+.08*cos(TH);",   // light-and-space looks breathe very slowly
    " if(look==53){float d=rbox(p,vec2(lx1),lx2*lx1);float sky=(.55-p.y*.12+.12*(fbm(p*.7+S+o*.3)-.5))*br;",   // sky opening: a cut in the ceiling, the ceiling lit toward its edge
    "  float ce=(.06+exp(-max(d,0.)*3.)*.45*lx3)*exp(-length(p)*.15);return mix(ce,sky,smoothstep(.004,-.004,d))+exp(-abs(d)*220.)*.08;}",
    " if(look==54){return clamp((.3+.4*lx3+.12*cos(TH+p.y*.4)*lx2+.15*(fbm(p*.45+S+o*.25)-.5)*lx2*2.-length(p)*.2*lx1)*br,0.,1.);}",   // light field: no edges, just color and depth
    " if(look==55){float a=lx3*.0174533;vec2 q=mat2(cos(a),-sin(a),sin(a),cos(a))*p;float d=max(abs(q.x)*.866+abs(q.y)*.5,abs(q.y))-lx1;",   // corner form: a solid of light hanging in a corner
    "  float an=atan(q.y,q.x);float fc=(an>.5236&&an<2.618)?1.:(an<=.5236&&an>-1.5708)?.62:.8;float m=smoothstep(.01+lx2*.08,-.01,d);",
    "  return (.06+exp(-max(d,0.)*4.)*.18)*(1.-m)+m*fc*.85*br;}",
    " if(look==56){float d=rbox(p,vec2(lx1*1.3,lx2),.005);float in0=smoothstep(.003,-.003,d);",   // aperture: a flat window of light in a wall
    "  return mix(.05+exp(-max(d,0.)*2.2)*.28,(.72-p.y*.05)*br,in0)+exp(-abs(d)*240.)*.35*lx3;}",
    " if(look==57){float t=tan(lx1*.0174533);float e1=p.x-(lx2+p.y*t),e2=p.x-(lx2+.75+p.y*t*.35);float sf=.005+lx3*.08;",   // light wedge: planes of light dividing a dark room
    "  return (.06+.04*fbm(p+S+o*.3))+smoothstep(-sf,sf,e1)*.42*br+smoothstep(-sf,sf,e2)*.3*br+exp(-abs(e1)*60.)*.25;}",
    " if(look==58){vec2 q=p/vec2(lx1*1.5,lx1);float l=length(q);float rt=(l-lx3-.05*sin(TH))/.25;float rg=exp(-rt*rt);",   // ellipse glass: a soft oval with a glowing inner ring
    "  float m=smoothstep(1.,1.-.02-lx2*.3,l);return m*(.3+.45*rg+.2*(1.-l))*br+(1.-m)*exp(-max(l-1.,0.)*3.)*.22;}",
    " if(look==59){vec2 bx=lx1*vec2(ptShape,1.)/max(1.,ptShape/1.6);float d=rbox(p,bx,min(bx.x,bx.y)*lx2);float m=smoothstep(.01,-.01,d);",   // ptShape: width ÷ height (tall … wide)   // portal: a tall glowing doorway of graded light
    "  float g=.3+.55*smoothstep(bx.y,-bx.y,p.y+sin(TH)*.2*bx.y);return m*g*br+(1.-m)*exp(-max(d,0.)/(.1+lx3*.4))*.45*br;}",
    " if(look==60){float d=rbox(p,vec2(lx1*1.3,lx1*.8),lx1*.8*lx3);",   // hidden light: a dark panel, light spilling from behind its edges
    "  return d<0.?.03:(exp(-d/(.05+lx2*.4))*.9*br+exp(-d*.8)*.06);}",
    " if(look==61){float d=length(p)-lx1;float sky=(.58+.22*p.y/lx1+.1*(fbm(p*.9+S+o*.3)-.5))*br;",   // oculus: a round opening seen from below
    "  return d<0.?sky:(.05+.35*exp(-d*(2.+lx2*3.)))+exp(-abs(d)*150.)*.3*lx3;}",
    " if(look==62){float y=p.y-lx3;float v=y>0.?exp(-y*(1.+lx2*3.))*.7:exp(y*(1.5+lx1*4.))*.5;",   // threshold: where a lit floor meets a glowing wall
    "  return (v+exp(-abs(y)*80.)*.35)*br*exp(-abs(p.x)*.22);}",
    " if(look==63||look==64){vec2 c1=vec2(0.,-lx1*.12),b1=vec2(lx2,lx1),c2=vec2(0.,lx1*.38),b2=vec2(lx1*.62,lx2);",   // light cross: a cross-shaped opening of light / shadow cross: light spilling from behind a dark cross
    "  if(look==64){float d=min(rbox(p-c1,b1,.004),rbox(p-c2,b2,.004));return d<0.?.03:(exp(-d/(.04+lx3*.4))*.9*br+exp(-d*.8)*.06);}",
    "  vec2 e1=abs(p-c1)-b1,e2=abs(p-c2)-b2;float d=min(max(e1.x,e1.y),max(e2.x,e2.y));",   // square distance: the glow runs straight out from every edge, square at the corners
    "  return mix(.04+exp(-max(d,0.)/(.05+lx3*.45))*.5*br,(.82-p.y*.06)*br,smoothstep(.004,-.004,d));}",
    " if(look==65){float mv=1.+.08*sin(TH);vec2 o1=vec2(-lx2*.5,.08)*mv,o2=vec2(lx2*.5,-.08)*mv;float s0=.004+lx3*.15;",   // overlap: two planes of light, brighter where they cross
    "  float a1=smoothstep(s0,-s0,rbox(p-o1,vec2(lx1*.7,lx1*.55),.004)),a2=smoothstep(s0,-s0,rbox(p-o2,vec2(lx1*.7,lx1*.55),.004));return .04+(a1+a2)*.42*br;}",
    " if(look==66){float d=rbox(p,vec2(lx1,lx2),min(lx2,.01));return d<0.?.95*br:.04+exp(-d*(9.-lx3*7.))*.4*br+exp(-abs(d)*300.)*.2;}",   // slit: a thin line of light cut into a wall
    " if(look==67){float d=abs(length(p)-lx1)-lx2;return d<0.?.9*br:(.04+exp(-d/(.04+lx3*.35))*.45*br+(length(p)<lx1?.06:0.));}",   // ring aperture
    " if(look==68){float ph=fract(TH/6.28318),v=.03+exp(-length(p)*3./lx1)*.35*br;for(int i=0;i<10;i++){float fi=float(i);if(fi>=lx2)break;float t=fi+ph;float k=pow(.7,t);",   // corridor: frames of light receding, drifting slowly inward
    "  float d=abs(rbox(p,vec2(1.6,.9)*lx1*k,0.))-.004*k;v+=exp(-max(d,0.)/(.008+lx3*.05))*.4*(1.-t/(lx2+1.))*smoothstep(0.,1.,t)*(1.-smoothstep(lx2-1.,lx2,t));}return v;}",
    " if(look==69){float sp=lx2*2.6,ka=clamp(floor(p.x/sp+(arCount-1.)*.5+.5),0.,arCount-1.);vec2 q=vec2(p.x-(ka-(arCount-1.)*.5)*sp,p.y)+vec2(0.,(lx1-lx2)*.5);float d=q.y>0.?length(q)-lx2:rbox(q-vec2(0.,-lx1*.5),vec2(lx2,lx1*.5),0.);",   // arch opening: a doorway of sky
    "  float sky=(.6-q.y*.1+.1*(fbm(p*.7+S+o*.3)-.5))*br;return mix(.05+exp(-max(d,0.)*3.)*.4*lx3,sky,smoothstep(.004,-.004,d));}",
    " if(look==70){float y=p.y-lx3;return clamp((.2+.35*lx1+exp(-y*y/(.05+lx2*.6))*.35+.1*(fbm(vec2(p.x*.5,y*2.)+S+o*.4)-.5))*br-length(p)*.08,0.,1.);}",   // mist room: a room of color with a band of brighter mist
    " if(look==71){float x=p.x-lx3;float fl=p.y<-.7?exp(-abs(x)*(2.-lx2)/(1.+(-.7-p.y)*3.))*.25*smoothstep(-.7,-1.,p.y):0.;",   // light blade: one thin vertical blade of light, spilling on the floor
    "  return (exp(-abs(x)/lx1)*.95+exp(-abs(x)/(.15+lx2*.8))*.3+fl)*br+.03;}",
    " if(look==72){float a=lx2*.0174533+.7854;vec2 q=mat2(cos(a),-sin(a),sin(a),cos(a))*p;float d=rbox(q,vec2(lx1*.7071),.004);",   // lozenge: a diamond of light
    "  return mix(.04+exp(-max(d,0.)/(.05+lx3*.45))*.45*br,(.8-p.y*.08)*br,smoothstep(.004,-.004,d));}",
    " if(look==73){vec2 q=(p-vec2(0.,lx3))/vec2(lx1*1.7,lx1*.32);float l=length(q);float m=smoothstep(1.,1.-.05-lx2*.6,l);",   // pool: an oval of light on the floor, glowing up the wall
    "  float wall=p.y>lx3?exp(-(p.y-lx3)*1.6)*exp(-abs(p.x)/(lx1*1.5))*.28:0.;return (m*(.75+.15*(1.-l))+wall+(1.-m)*exp(-max(l-1.,0.)*2.)*.15)*br+.03;}",
    " if(look==74){float a2=(lx2+sin(TH)*.5*FL)*.0174533;float k=lx1*3.14159;float g1=.5+.5*cos(p.y*k),g2=.5+.5*cos(dot(p,vec2(-sin(a2),cos(a2)))*k);",   // moiré: two line screens a few degrees apart
    "  return pow(g1*g2,1.+(1.-lx3)*3.)*exp(-length(p)*.3)*.95+.02;}",
    " if(look==75){vec2 q=p*lx1*.5+vec2(fbm(p*.8+S+o*.5),fbm(p*.8+S+o*.5+3.1))*lx2*2.;float cc=sin(q.x*3.14159)*sin(q.y*3.14159);float sf=.02+lx3*.6;",   // checker warp
    "  return smoothstep(-sf,sf,cc)*.8*exp(-length(p)*.35)+.03;}",
    " if(look==76){float a=atan(p.y,p.x)-TH;float b=pow(.5+.5*cos(a*floor(lx1+.5)),2.+(1.-lx2)*40.);float d=length(p);",   // beacon: a turning beam of light
    "  return b*exp(-d*.45)*(.75+lx3*.5*fbm(p*1.5+S+o))*.9+exp(-d*6.)*.6+.02;}",
    " if(look==77){float d=lx2-p.y;if(d<.002)return exp(-(p.y-lx2)*2.)*.18*lx3+exp(-abs(p.y-lx2)*10.)*.5*lx3;float k=lx1*.25;",   // grid floor: a glowing grid running to the horizon
    "  float gx=abs(fract(p.x/d*k)-.5),gz=abs(fract(k/d-TH/6.28318)-.5);float g=min(gx,gz);float ln=smoothstep(.05,0.,g)*smoothstep(.02,.45,d);",
    "  return ln*(.35+.6*lx3)+exp(-abs(p.y-lx2)*10.)*.5*lx3+exp(-d*3.)*.08;}",
    " if(look==78){float v=.02;for(int i=0;i<6;i++){float fi=float(i);if(fi>=lx1)break;vec2 c=vec2(h(vec2(fi,seed))*3.2-1.6,h(vec2(fi,seed+1.))*1.6-.8)+vec2(cos(TH+fi*2.),sin(TH+fi*1.3))*.15*FL;",   // drift shapes: outlined circles, squares, triangles
    "  float sz=lx2*(.5+.5*h(vec2(fi,seed+2.)));vec2 q=p-c;float ty=mod(fi,3.);float d;if(ty<.5)d=length(q)-sz;else if(ty<1.5){float ra=TH*.25;q=mat2(cos(ra),-sin(ra),sin(ra),cos(ra))*q;d=rbox(q,vec2(sz*.8),.0);}",
    "  else{float ra=TH/3.;q=mat2(cos(ra),-sin(ra),sin(ra),cos(ra))*q;q.x=abs(q.x)-sz;q.y=q.y+sz/1.732;if(q.x+1.732*q.y>0.)q=vec2(q.x-1.732*q.y,-1.732*q.x-q.y)/2.;q.x-=clamp(q.x,-2.*sz,0.);d=-length(q)*sign(q.y);}",
    "  v+=exp(-abs(d)/(lx3*.03+.004))*.8+step(d,0.)*.05;}return v;}",
    " if(look==79){float v=.03;for(int i=0;i<8;i++){float fi=float(i);if(fi>=lx3)break;vec2 c=(fi-(lx3-1.)*.5)*vec2(.12,-.09)*lx2*3.+vec2(sin(TH+fi*.7),cos(TH+fi*.7))*.03*FL;",   // stacked cards: translucent panels of light
    "  float d=rbox(p-c,vec2(lx1*.8,lx1*.5),.06);v=mix(v,.1+.55*(fi+1.)/lx3,smoothstep(.004,-.004,d)*.75)+exp(-abs(d)*150.)*.3;}return v;}",
    " if(look==80){float arg=p.x*lx1+sin(p.y*1.3+TH)*lx2*1.5+fbm(p*.6+S+o*.4)*2.;return (.22+.6*pow(.5+.5*sin(arg+1.2),1.5+lx3*3.))*exp(-length(p)*.25);}",   // cloth fold
    " if(look==81){float n0=floor(lx1+.5),sg=6.28318/n0,a=atan(p.y,p.x)+TH/n0,l=length(p);float am=mod(a,sg)-sg*.5;float R=lx2*cos(sg*.5)/cos(am);float d=l-R;",   // crystal: a slowly turning faceted gem of light
    "  float id=floor(a/sg);float fc=.3+.55*h(vec2(id,seed))+.1*cos(TH+id);float m=smoothstep(.004,-.004,d);",
    "  return m*fc*(.6+.4*(1.-l/max(R,.01)))+exp(-abs(d)*80.)*.5+m*pow(max(0.,cos(am*n0*.5)),30.)*lx3*.5+exp(-max(d,0.)*3.)*.1;}",
    " if(look==82){float v=0.;for(int i=0;i<3;i++){float fi=float(i);float a=(lx2+fi*12.)*.0174533;vec2 q=mat2(cos(a),-sin(a),sin(a),cos(a))*p;",   // refraction: crossing bands of light
    "  float e=(q.y-(fi-1.)*1.1*lx1-sin(q.x*.8+TH+fi)*.1*FL)/(.05+lx3*.3);v+=exp(-e*e)*(.45+.2*fi);}return v*exp(-length(p)*.2)*.85;}",
    " if(look==83){vec2 P=p*lx1*.5,ci=floor(P)+.5,f=P-ci;float r0=length(ci/(lx1*.5));float wv=pow(.5+.5*cos(r0*6.-TH*floor(lx2+.5)),3.);",   // pulse dots: a wave of growing dots from the center
    "  float rad=(.12+.3*wv)*lx3;return smoothstep(rad,rad-.06,length(f))*(.2+.8*wv)*exp(-r0*.35)+.02;}",
    " if(look==84){float y=p.y*lx1*.5+sin(p.x*1.2+TH+fbm(p*.5+S)*2.)*lx2+fbm(vec2(p.x*.4,p.y)+S+o*.3)*.6;float l=abs(fract(y)-.5);",   // dune lines
    "  return exp(-l*l*300.)*(.4+.6*lx3)*exp(-abs(p.y)*.5)+exp(-l*l*20.)*.08;}",
    " if(look==85){float x=p.x+sin(p.x*.7*lx1+TH)*.25+fbm(vec2(p.x*.8,1.)+S+o*.4)*.5;float fo=pow(.5+.5*sin(x*lx1*2.),3.);float top=lx2-.2*fbm(vec2(p.x,0.)+S+o2);",   // aurora
    "  float hg=smoothstep(top-1.2,top,p.y)*smoothstep(top+.15,top-.05,p.y);return fo*hg*(.6+.4*lx3*fbm(vec2(p.x*4.,p.y*.5)+S+o))*.95+.02;}",
    " if(look==86){vec2 c=vec2(0.,lx2);float d=length(p-c);float sky=exp(-max(p.y-lx2+.3,0.)*1.2)*.45*smoothstep(-1.2,lx2,p.y);float sun=smoothstep(lx1,lx1-.01,d)*(.9+.1*cos(TH));",   // sun disc
    "  float cut=p.y<lx2?step(.5,fract((lx2-p.y)*12.-TH/6.28318))*step(d,lx1):0.;return max(sky+exp(-d/lx1*1.2)*.35*(1.+lx3),sun*(1.-cut*.85));}",
    " if(look==87){float hz=.25,d=hz-p.y;if(d<.01)return exp(-(p.y-hz)*2.5)*.25+exp(-abs(p.y-hz)*12.)*.4*lx3;float z=1./d;float w=sin(p.x*z*1.5+TH+z*.3)*lx2*.4;",   // wave field
    "  float l=abs(fract(z*lx1*.12+w-TH/6.28318)-.5);return smoothstep(.08,0.,l)*smoothstep(0.,.5,d)*(.4+.5*lx3)+exp(-abs(p.y-hz)*12.)*.4*lx3;}",
    " if(look==88){float a=lx3*.0174533;vec2 q=mat2(cos(a),-sin(a),sin(a),cos(a))*p;float col=floor(q.x*lx1);float f=fract(q.x*lx1)-.5;float sp=1.+floor(h(vec2(col,seed))*3.);",   // light rain
    "  float y=fract(q.y*.35+TH/6.28318*sp+h(vec2(col,1.)));return exp(-f*f*60.)*smoothstep(1.-lx2*.6-.05,1.,y)*pow(y,4.)*(.4+.6*h(vec2(col,5.)))+.02;}",
    " if(look==89){float d=length(p);float z=lx2/(d+.05);float l=abs(fract(z*lx1*.25-TH/6.28318)-.5);",   // tunnel
    "  return smoothstep(.06,0.,l)*smoothstep(0.,.3,d)*(.3+.6*lx3)+exp(-d*4.)*.3+.02;}",
    " if(look==90){float d=length(p);float core=exp(-d*d/(.01+lx1*.05))*.9;float st=exp(-abs(p.y)*(30.-lx2*25.))*exp(-abs(p.x)*.6)*.6*lx2;float g=0.;",   // flare
    "  for(int i=1;i<4;i++){float fi=float(i);vec2 gc=vec2(.5,.25)*(fi*.6-1.2);g+=smoothstep(.08*fi,.08*fi-.02,length(p-gc))*.12*lx3;}return (core+st+g+exp(-d*1.5)*.15)*br;}",
    " if(look==91){float d1=length(p-vec2(-lx2*.5,0.)+C(1.)*.05*FL),d2=length(p-vec2(lx2*.5,0.)-C(1.)*.05*FL);float g=(.5+.5*cos(d1*lx1*6.))*(.5+.5*cos(d2*lx1*6.));",   // phase rings
    "  return pow(g,1.+(1.-lx3)*3.)*exp(-length(p)*.35)*.95+.02;}",
    " if(look==92){vec2 g=abs(fract(p*lx1*.5)-.5);float ln=smoothstep(.03,0.,min(g.x,g.y));float sy=p.y-sin(TH);float sc=exp(-sy*sy/(.002+lx2*.05));",   // scan grid
    "  return ln*(.08+.8*sc)*(.4+.6*lx3)+sc*.15*lx3+.02;}",
    " if(look==93){float k=lx1*.5;vec2 P=p*k;float col=floor(P.x);float sp=1.+floor(h(vec2(col,seed))*3.);float y=P.y+TH/6.28318*sp*4.;vec2 g=vec2(fract(P.x),fract(y))-.5;",   // pixel rain
    "  float m=smoothstep(.45,.4,max(abs(g.x),abs(g.y)));return pow(h(vec2(col,floor(y))+seed),2.+(1.-lx2)*10.)*m*(.4+.6*lx3)*exp(-length(p)*.2)+.02;}",
    " if(look==94){float d=length(p)/lx1;if(d>1.)return exp(-(d-1.)*4.)*.15*lx2+.02;float z=sqrt(1.-d*d);vec2 q=p/lx1*(1.+z*.6);float ins=0.;",   // glass orb; orbIn: what's inside
    "  if(orbIn<.5)ins=fbm(q*1.5+S+o*.5);else if(orbIn<1.5)ins=.5+.5*sin(length(q)*12.-TH*2.);else if(orbIn<2.5)ins=.5+.5*sin(atan(q.y,q.x)*3.+length(q)*6.-TH);",
    "  else if(orbIn<3.5){vec2 ci=floor(q*8.),f=fract(q*8.)-.5;ins=exp(-dot(f,f)*60.)*step(.7,h(ci+seed))*(.6+.4*sin(TH+h(ci)*6.28))*2.;}else if(orbIn<4.5)ins=fs(q*.8+S+o*.4,4);",
    "  float rim=pow(1.-z,3.)*lx2*.9;float spec=pow(max(0.,dot(p/lx1,normalize(vec2(-.5,.6)))),12.)*.6;return .08+rim+spec+ins*lx3*.6*z;}",
    " if(look==95){float v=0.;for(int i=0;i<6;i++){float fi=float(i);if(fi>=lx1)break;float y=sin(p.x*(.6+fi*.15)+TH*(1.+mod(fi,2.))+fi*1.7)*(.3+lx3*.4)+(fi-(lx1-1.)*.5)*.25;",   // ribbons
    "  float e=(p.y-y)/(.03+lx2*.12);v+=exp(-e*e)*(.35+.1*fi);}return min(v,1.)*exp(-abs(p.x)*.15)+.02;}",
    " if(look==96){float v=0.;for(int i=0;i<6;i++){float fi=float(i);if(fi>=lx1)break;vec2 c=vec2(h(vec2(fi,seed))*2.8-1.4,h(vec2(fi,seed+3.))*1.4-.7)+vec2(cos(TH+fi*1.9),sin(TH+fi*2.3))*.3*FL;",   // soft blobs
    "  float d=length(p-c)/lx2;v+=exp(-d*d*(1.+(1.-lx3)*3.))*(.3+.7*h(vec2(fi,seed+7.)));}return clamp(v,0.,1.)*.95;}",
    " if(look==97){float n0=floor(lx1+.5);float a=atan(p.y,p.x)+TH/n0;float d=length(p);float rr=pow(.5+.5*cos(a*n0),40.*(1.-lx3*.9)+2.);",   // starburst
    "  return rr*exp(-d/(lx2*1.5+.1))*.8+exp(-d*5.)*.5+.02;}",
    " if(look==98){float a=lx2*.0174533;vec2 q=mat2(cos(a),-sin(a),sin(a),cos(a))*p;float u=q.y+abs(fract(q.x*.8)-.5)*.6;float l=sin((u*lx1-TH/6.28318*2.)*6.28318);",   // zigzag
    "  return smoothstep(-(.05+lx3*.9),.05+lx3*.9,l)*.75*exp(-length(p)*.35)+.03;}",
    " if(look==99){float x=p.x*lx1*.5;float id=floor(x),f=fract(x)-.5;float wv=sin(p.y*2.+TH+id*1.7)*lx2*.3;float base=fbm((p+vec2(f*.25*lx2+wv*.1,wv*.2))*.8+S+o*.4);",   // liquid glass
    "  float t=(f-.3)/.05;return base*.75+exp(-t*t)*.35*lx3+.02;}",
    " if(look==100){float v=.02;for(int L=0;L<2;L++){float fl=float(L);vec2 q=p*lx1*(.4+fl*.3);vec2 ci=floor(q),f=fract(q)-.5;vec2 jo=vec2(sin(TH+h(ci)*6.28),cos(TH*(1.+fl)+h(ci+1.)*6.28))*.3;",   // fireflies
    "  float sz=(80.-lx2*60.)*(1.+fl*.5);v+=exp(-dot(f-jo,f-jo)*sz)*step(h(ci+2.+fl),.4)*(.5+.5*sin(TH*2.+h(ci+4.)*6.28)*lx3+.5*(1.-lx3));}return v;}",
    " if(look==101){float d=p.y-lx2;if(d<.01)return .03+exp(d*3.)*.1;float z=1./d;float cl=fbm(vec2(p.x*z,z)*.6*lx1+S+o*.4);",   // cloud ceiling
    "  return smoothstep(.45,.75,cl)*(.3+.6*smoothstep(0.,.6,d))*(.6+.4*lx3)+exp(-abs(d)*6.)*.2;}",
    " if(look==102){float y=p.y-lx3+p.x*p.x*lx1*.15;float g=y>0.?exp(-y/(.05+lx2*.3)):0.;",   // curved horizon
    "  return g*.9*br+exp(-abs(y)*60.)*.4+(y<0.?.02:0.)+exp(-length(p))*.05;}",
    " if(look==103){float d1=rbox(p-vec2(-lx2*.5-lx1*.5,0.),vec2(lx1*.5,lx1*.8),.004),d2=rbox(p-vec2(lx2*.5+lx1*.5,0.),vec2(lx1*.5,lx1*.8),.004);float i1=smoothstep(.004,-.004,d1),i2=smoothstep(.004,-.004,d2);",   // twin apertures
    "  return (.04+exp(-max(min(d1,d2),0.)*(6.-lx3*4.))*.3)*(1.-max(i1,i2))+(i1*.85+i2*.55)*br;}",
    " if(look==104){float v=0.;for(int i=0;i<6;i++){float fi=float(i);if(fi>=lx1)break;float y0=(fi-(lx1-1.)*.5)*.3;vec2 q=(p-vec2(0.,y0+sin(TH+fi)*.03*FL))/vec2(1.,lx2);",   // halo bands
    "  float e=(length(q)-(.9-fi*.05))/.02;v+=exp(-e*e)*(.4+.1*fi)*(q.y<0.?1.:.45);}return v*(.5+.5*lx3)+.02;}",
    " if(look==105){float d=rbox(p,vec2(lx1,lx2*.5),lx2*.5);",   // light tube
    "  return exp(-max(d,0.)/(.03+.25*lx3))*.6*br+smoothstep(.003,-.003,d)*.95+.02;}",
    " if(look==106){float d=length(p),a=atan(p.y,p.x);float z=lx2/(d+.05);float arm=.5+.5*sin(a*floor(lx3+.5)+z*lx1-TH);float rg=.5+.5*sin(z*3.-TH*2.);",   // vortex tunnel
    "  return pow(arm,3.)*(.5+.5*rg)*smoothstep(0.,.4,d)*exp(-d*.3)*.9+exp(-d*4.)*.3;}",
    " if(look==107){vec2 q=mat2(.7071,-.7071,.7071,.7071)*p*lx1*.5;vec2 ci=floor(q),f=fract(q)-.5;float wv=.5+.5*cos(length(ci)*.8-TH);float d=max(abs(f.x),abs(f.y))-(.15+.25*wv)*lx2*2.*.5;",   // diamond grid
    "  return smoothstep(.02,-.02,d)*(.25+.65*wv)*exp(-length(p)*.35)+exp(-max(d,0.)*20.)*.15*lx3+.02;}",
    " if(look==108){float v=0.;for(int i=0;i<5;i++){float fi=float(i);if(fi>=lx1)break;float y=sin(p.x*lx3*4.+TH*(1.+fi)+fi)*lx2*.5*exp(-p.x*p.x*.3)*(1.-fi*.12);",   // sound waves
    "  float e=(p.y-y)/(.006+fi*.004);v+=exp(-e*e)*(.8-fi*.12);}return v+.02;}",
    " if(look==109){float hz=lx3,d=hz-p.y;if(d<.01)return exp(-(p.y-hz)*2.)*.15+exp(-abs(p.y-hz)*12.)*.3;float rr=length(vec2(p.x/d,1./d)-vec2(0.,2.5))*.5;float s2=fract(rr*lx1*.2-TH/6.28318);",   // ripple floor
    "  return pow(s2,8.)*exp(-rr*.25)*(.5+.5*lx2)*smoothstep(0.,.3,d)+exp(-abs(p.y-hz)*12.)*.3+.02;}",
    " if(look==110){float v=.02;for(int i=0;i<8;i++){float fi=float(i);if(fi>=lx1)break;float x0=(fi-(lx1-1.)*.5)*(3.2/lx1);float e=(p.x-x0)/(lx2*.3+.01);v+=exp(-e*e)*(1.-lcPulse+lcPulse*cos(TH+fi*1.3))*(.6+.4*smoothstep(-1.,1.,p.y));}",   // light columns
    "  float hz=fbm(p*1.2+S+o*.4);return (v*(1.-lx3*.4+lx3*.6*hz)+lx3*.08*hz)*lcBright;}",
    " if(look==111){float a=atan(p.y,p.x),rr=length(p),v=0.;float n0=floor(lx1+.5);for(int i=0;i<4;i++){float fi=float(i);if(fi>=lx2)break;float pt=abs(cos((a+fi*3.14159/n0)*n0*.5));float R=lx3*(1.-fi*.18)*(.55+.45*pt);",   // lotus
    "  float e=(rr-R)/(.03+.02*fi);v+=exp(-e*e)*(.5+.15*fi)+smoothstep(R,R-.02,rr)*.05;}return v*br+exp(-rr*4.)*.3;}",
    " if(look==112){float x=p.x*lx1*.25;float id=floor(x),f=fract(x)-.5;float hg=(.3+.7*(.5+.5*sin(TH+id*1.1+h(vec2(id,seed))*6.28*lx2)))*1.6-1.;float t=clamp((p.y+1.)/(hg+1.),0.,1.);",   // light bars
    "  return smoothstep(.45,.4-lx3*.25,abs(f))*step(p.y,hg)*(.2+.7*t)+.02;}",
    " if(look==113){vec2 c=vec2(0.,lx2);float d=length(p-c);float hz=-.35;float m=smoothstep(lx1,lx1-.006,d)*step(hz,p.y);float gl=exp(-max(d-lx1,0.)*(5.-lx3*4.))*.4*br;float tx=p.x/(lx1*.8);",   // moonrise
    "  float rf=p.y<hz?exp(-tx*tx)*(.5+.5*sin((hz-p.y)*60.+TH*2.))*exp(-(hz-p.y)*3.)*.35:0.;return max(m*.95,gl*step(hz,p.y))+rf+exp(-abs(p.y-hz)*40.)*.2+.02;}",
    " if(look==114){vec2 q=p-vec2(0.,-1.05);float a=atan(q.x,q.y);float n0=floor(lx1+.5);float sw=sin(TH)*lx3*.5;float wd=lx2*1.4+.05;float f=(a-sw)/wd*n0;float l=abs(fract(f)-.5);",   // laser fan
    "  return exp(-l*l*2000./(length(q)+.2))*step(abs(a-sw),wd*.5+.03)*exp(-length(q)*.35)*.95+exp(-length(q)*3.)*.4+.02;}",
    " if(look==115){float R=lx1,d=length(p);if(d>R)return exp(-(d-R)*8.)*.2+.02;float z=sqrt(R*R-d*d);float t=lx3*.0174533;vec3 nn=vec3(p.x,p.y*cos(t)-z*sin(t),p.y*sin(t)+z*cos(t))/R;float N=floor(lx2+.5);",   // wire sphere
    "  float lat=asin(clamp(nn.y,-1.,1.));float gl=abs(fract((atan(nn.x,nn.z)+TH/N)/6.28318*N)-.5)*cos(lat),gt=abs(fract(lat/3.14159*N*.5+.5)-.5);",
    "  return smoothstep(.04,0.,min(gl,gt))*(.35+.6*z/R)*.9+exp(-abs(d-R)*30.)*.3+.02;}",
    " if(look==116){float a=TH*.25,t=.5,dm=9.;for(int k=0;k<3;k++)for(int j=0;j<4;j++){float u=floor(float(j)/2.)*2.-1.,w=mod(float(j),2.)*2.-1.;vec3 A,B;",   // wire cube
    "  if(k==0){A=vec3(-1.,u,w);B=vec3(1.,u,w);}else if(k==1){A=vec3(u,-1.,w);B=vec3(u,1.,w);}else{A=vec3(u,w,-1.);B=vec3(u,w,1.);}",
    "  vec2 PA=vec2(A.x*cos(a)+A.z*sin(a),A.y*cos(t)-(-A.x*sin(a)+A.z*cos(a))*sin(t))*lx1,PB=vec2(B.x*cos(a)+B.z*sin(a),B.y*cos(t)-(-B.x*sin(a)+B.z*cos(a))*sin(t))*lx1;",
    "  vec2 pa=p-PA,ba=PB-PA;dm=min(dm,length(pa-ba*clamp(dot(pa,ba)/dot(ba,ba),0.,1.)));}return exp(-dm/(lx2*.02+.003))*.9+exp(-dm*8.)*.2*lx3+.02;}",
    " if(look==117){float a=lx2*.0174533;float u=dot(p,vec2(cos(a),sin(a)));float e=(fract(u*.25*lx3-TH/6.28318)-.5)/(.02+lx1*.2);",   // light sweep
    "  return exp(-e*e)*.85*exp(-length(p)*.2)+.03;}",
    " if(look==118){float v=.02;for(int L=0;L<3;L++){float fl=float(L);vec2 q=p*lx1*(1.+fl*.7)+vec2(0.,TH/6.28318*(1.+fl));vec2 ci=floor(q),f=fract(q)-.5;vec2 jo=(vec2(h(ci+fl),h(ci+fl+3.))-.5)*.7;",   // glitter
    "  float tw=pow(.5+.5*sin(TH*(2.+fl)+h(ci+9.)*6.28),6.);v+=exp(-dot(f-jo,f-jo)*(400.-lx2*300.))*step(h(ci+5.+fl),.5)*(1.-lx3+lx3*tw);}return v;}",
    " if(look==119){vec2 q=p-vec2(0.,lx2);float d=length(q),a=atan(q.x,q.y);float up=step(lx2,p.y);float ry=pow(.5+.5*cos(a*floor(lx1+.5)+TH),4.)*up;",   // sunrise burst
    "  return exp(-d*1.2)*.5*(1.+lx3)+ry*exp(-d*.5)*.35+smoothstep(.25,.24,d)*.6*up+(1.-up)*exp(-d*2.)*.25+.02;}",
    " if(look==120){float m=max(abs(p.x),abs(p.y));float l=abs(fract(m*lx1*.5-TH/6.28318)-.5);",   // nested squares
    "  return smoothstep(lx2*.3+.02,0.,l)*exp(-m*.6)*(.4+.5*lx3)+exp(-m*3.)*.2*lx3+.02;}",
    " if(look==121){float v=0.;for(int i=0;i<24;i++){float fi=float(i);if(fi>=lx1)break;float y=(fi/(lx1-1.)-.5)*1.6+(fbm(vec2(p.x*1.5,fi*.7)+S+o*.4*lx3)-.4)*lx2*.6*exp(-p.x*p.x*1.5);",   // ridge lines
    "  float e=(p.y-y)/.006;v+=exp(-e*e)*.7;}return v+.02;}",
    " if(look==122){vec2 q=p*lx1*.5;vec2 r2=vec2(1.,1.732);vec2 h1=mod(q,r2)-r2*.5,h2=mod(q-r2*.5,r2)-r2*.5;vec2 g=dot(h1,h1)<dot(h2,h2)?h1:h2;vec2 id=q-g;",   // hex pulse
    "  float ed=.5-max(abs(g.x),dot(abs(g),vec2(.5,.866)));float wv=.5+.5*cos(length(id)*1.2/lx1*3.-TH);",
    "  return smoothstep(.04*lx2+.01,0.,ed)*(.3+.6*wv)*exp(-length(p)*.3)+wv*.08*lx3+.02;}",
    " if(look==123){float x=p.x*lx1*.25;float id=floor(x),f=fract(x)-.5;float dens=floor(2.+lx3*8.),k=floor(1.+lx2*3.);float q=p.y*dens*.5-TH/6.28318*k;float cy=floor(q),fy=fract(q)-.5;",   // light strands
    "  return exp(-f*f*400.)*.15+exp(-(fy*fy*30.+f*f*400.))*step(h(vec2(id,cy)+seed),.35)*.9+.02;}",
    " if(look==124){float dm=9.,bt=0.;for(int i=0;i<96;i++){float t=float(i)/96.*6.28318;float s2=sin(t);vec2 c=lx1*vec2(cos(t),s2*cos(t))/(1.+s2*s2);float d=length(p-c);if(d<dm){dm=d;bt=t;}}",   // infinity
    "  float gv=exp(-mod(TH-bt,6.28318)/6.28318*(10.-lx3*8.));return exp(-dm/(lx2*.03+.004))*(.2+.8*gv)+exp(-dm*6.)*.12*gv+.02;}",
    " if(look==125){float ph=fract(TH/6.28318),v=.03+exp(-length(p)*3./lx2)*.3;for(int i=0;i<10;i++){float fi=float(i);if(fi>=lx1)break;float t=fi+ph;float k=pow(.72,t);float s2=lx2*k;vec2 q=p;q.y+=s2*.25;",   // triangle tunnel
    "  float d=abs(max(abs(q.x)*.866+q.y*.5,-q.y)-s2*.5)-.004*k;v+=exp(-max(d,0.)/(.006+lx3*.04))*.4*(1.-t/(lx1+1.))*smoothstep(0.,1.,t)*(1.-smoothstep(lx1-1.,lx1,t));}return v;}",
    " if(look==126){vec2 q=p*lx1;float v=sin(q.x+TH)+sin(q.y*.8-TH)+sin((q.x+q.y)*.6+TH)+sin(length(q+C(1.)*lx2*2.)*1.5-TH);",   // plasma
    "  return pow(v*.125+.5,1.+lx3*2.)*1.1;}",
    " if(look==127){float d=length(p);float t=(d-lx1)/(.1+lx2*.4);",   // nebula ring
    "  return exp(-t*t)*(.4+.6*fbm(p*2.+S+o*.5)*(lx3+.3))+.02;}",
    " if(look==128){float d=length(p),a=atan(p.y,p.x);float tr=exp(-mod(TH-a,6.28318)/6.28318*(12.-lx2*10.));float l=abs(fract(d*lx1*.5+.5)-.5);vec2 ci=floor(p*3.);vec2 bp=(ci+.25+.5*vec2(h(ci+seed),h(ci+seed+1.)))/3.;",   // radar
    "  float blip=exp(-dot(p-bp,p-bp)*900.)*step(h(ci+seed+2.),.35)*exp(-mod(TH-atan(bp.y,bp.x),6.28318)*.6)*lx3;return (tr*.6+smoothstep(.04,0.,l)*.25)*smoothstep(1.4,1.,d)+blip+.02;}",
    " if(look==129){float v=.02;for(int i=0;i<16;i++){float fi=float(i);if(fi>=lx1)break;float t=(fi/(lx1-1.)-.5)*lx2*2.4;vec2 ps=vec2(sin(t),cos(t))*1.1+vec2(0.,-.75);float b=.6+.4*cos(TH+fi*.8);",   // arc lights
    "  v+=exp(-dot(p-ps,p-ps)*300.)*b+exp(-length(p-ps)*4.)*.08*lx3*b;}return v;}",
    " if(look==130){vec2 q=p*lx1*.5;vec2 ci=floor(q),f=fract(q)-.5;float o1=h(ci+seed);float d=o1<.5?abs(f.y):abs(f.x);float ln=smoothstep(.04,.01,d)*step(h(ci+seed+4.),.6);",   // circuit
    "  float along=o1<.5?f.x:f.y;float pt=(fract(along*.5+.5-TH/6.28318*floor(1.+lx2*3.)+h(ci+2.))-.5)/.08;return ln*(.15+.8*exp(-pt*pt)*lx3+.15)+.02;}",
    " if(look==131){float d=length(p),a=atan(p.y,p.x);float rg=floor(d*lx1*3.);float rr=(rg+.5)/(lx1*3.);float aa=a+TH*floor(1.+2.*h(vec2(rg,seed)));float n0=floor(6.+rg*4.);float ca=aa/6.28318*n0;",   // particle swirl
    "  float dx=(fract(ca)-.5)*6.28318*rr/n0,dy=d-rr;return exp(-(dx*dx+dy*dy)*1500.)*step(h(vec2(rg,floor(ca))),.5)*smoothstep(lx2+.2,lx2-.2,d)+exp(-d*5.)*.3*lx3+.02;}",
    " if(look==132){float v=.02;for(int i=0;i<4;i++){float fi=float(i);if(fi>=lx1)break;vec2 ps=vec2(sin(TH+fi*2.1)*1.2,-.65+.08*sin(TH*2.+fi));vec2 q=(p-ps)/vec2(lx2*1.2,lx2*.35);v+=exp(-dot(q,q)*2.)*.7;",   // floor spots
    "  float t=clamp((1.2-p.y)/(1.2-ps.y),0.,1.);float bx=(p.x-mix(ps.x*.3,ps.x,t))/(.03+.25*lx2*t);v+=exp(-bx*bx)*step(ps.y,p.y)*lx3*.25;}return v;}",
    " if(look==133){float v=exp(-max(p.y-lx3,0.)*1.)*.5;for(int i=0;i<6;i++){float fi=float(i);if(fi>=lx1)break;float px=p.x+sin(TH)*.05*(fi+1.)*FL;float hy=lx3+.15-fi*.18+.25*fbm(vec2(px*.7+fi*3.1,fi)+S);",   // misty ridges
    "  float cv=smoothstep(.004,-.004,p.y-hy);v=mix(v,(1.-fi/lx1)*.5*lx2+.05,cv)+fbm(vec2(px*1.5,p.y*3.)+S+o*.3)*.08*lx2*smoothstep(hy+.2,hy-.1,p.y)*(1.-cv);}return v;}",
    " if(look==134){float hz=-.1;vec2 sc=vec2(0.,lx1);float sd=length(p-sc);if(p.y>hz)return exp(-(p.y-hz)*1.5)*.35+smoothstep(.16,.15,sd)*.95+exp(-sd*2.)*.4*(1.+lx3);",   // ocean sun
    "  float dd=hz-p.y;return .05+exp(-p.x*p.x*6.)*pow(n(vec2(p.x*20.,dd*40.)+C(1.)*3.),6.)*lx2*1.5*exp(-dd*1.5)+exp(-dd*10.)*.15;}",
    " if(look==135){float d=length(p),a=atan(p.y,p.x);float n0=floor(30.+60.*lx1);float ai=floor(a/6.28318*n0);float z=fract(h(vec2(ai,seed))+TH/6.28318*floor(1.+lx3*2.));float rs=z*z*1.8;",   // star warp
    "  float da=(fract(a/6.28318*n0)-.5)*6.28318/n0*d;return exp(-da*da*40000.)*smoothstep(rs*(1.-.5*lx2)-.01,rs,d)*step(d,rs)*z*1.2+exp(-d*5.)*.2+.02;}",
    " if(look==136){float a=lx2*.0174533;vec2 q1=mat2(cos(a),-sin(a),sin(a),cos(a))*p,q2=mat2(cos(-a),-sin(-a),sin(-a),cos(-a))*p;float u1=q1.x*lx1*.5+TH/6.28318,u2=q2.x*lx1*.5-TH/6.28318;",   // woven
    "  float w=.02+lx3*.1;float b1=smoothstep(w,0.,abs(fract(u1)-.5)),b2=smoothstep(w,0.,abs(fract(u2)-.5));float ov=step(.5,fract((floor(u1)+floor(u2))*.5));",
    "  return (ov>.5?max(b1,b2*.4):max(b2,b1*.4))*.8*exp(-length(p)*.3)+.02;}",
    " if(look==137){vec2 off=vec2(cos(TH),sin(TH))*lx1*lx2;float cr=max(length(p)-lx1,-(length(p-off)-lx1));",   // crescent
    "  return smoothstep(.006,-.006,cr)*.9+exp(-max(cr,0.)*(10.-lx3*8.))*.35+.02;}",
    " if(look==138){vec2 q=p*lx1*.5;vec2 ci=floor(q),f=fract(q)-.5;float fl=fbm(ci/(lx1*.5)*.8+S+o*.6);",   // light wall
    "  return smoothstep(.5-lx2*.3,.46-lx2*.3,max(abs(f.x),abs(f.y)))*pow(fl,1.+lx3*3.)*1.3+.02;}",
    " if(look==139){float n0=floor(lx1+.5),sg=6.28318/n0;float a=abs(mod(atan(p.y,p.x),sg)-sg*.5),d=length(p);",   // kaleido bloom
    "  return fbm(vec2(cos(a),sin(a))*d/lx2*(1.+lx3*2.)+S+o*.5)*exp(-d*.6)*1.2;}",
    " if(look==140){vec2 e=p/vec2(1.2,.5);float t0=atan(e.y,e.x);float al=mod(TH-t0,6.28318);float dd=(length(e)-1.)*.5;float wd=.01+al*.02*lx2;vec2 hd=vec2(cos(TH)*1.2,sin(TH)*.5);",   // comet
    "  return exp(-al*(8.-lx2*7.))*exp(-dd*dd/(wd*wd))*.8+exp(-length(p-hd)*(30.-lx1*20.))*(.6+lx3*.6)+.02;}",
    " if(look==141){float l=abs(fract(p.y*lx1*.5-TH/6.28318*2.)-.5);",   // rising lines
    "  return smoothstep(lx2*.05+.005,0.,l)*exp(-abs(p.y)*lx3*2.)*exp(-p.x*p.x*.2)*.85+.02;}",
    " if(look==142){vec2 q=p;q.y+=lx1*.25;float d=max(abs(q.x)*.866+q.y*.5,-q.y)-lx1*.5;float gr=clamp(.5+q.y/lx1*.6,0.,1.);",   // prism triangle
    "  return exp(-abs(d)/(lx2*.02+.004))*.9+smoothstep(.004,-.004,d)*gr*lx3*.6*br+exp(-max(d,0.)*6.)*.12+.02;}",
    " if(look==143){float v=.02;for(int i=0;i<6;i++){float fi=float(i);if(fi>=lx1)break;vec2 c=vec2(h(vec2(fi,seed))*3.-1.5,fract(h(vec2(fi,seed+1.))+TH/6.28318)*2.6-1.3);float al=smoothstep(-1.3,-.9,c.y)*smoothstep(1.3,.9,c.y);",   // bloom orbs
    "  float d=length(p-c)/lx2;float t=(d-.5)/.05;v+=(exp(-d*d*4.)*.6+exp(-t*t)*lx3*.4)*al;}return v;}",
    " if(look==144){vec2 q=p+vec2(0.,.15);float w=lx2,ht=.9;float d=q.y>ht-w?length(q-vec2(0.,ht-w))-w:rbox(q-vec2(0.,(ht-w-1.)*.5),vec2(w,(ht-w+1.)*.5),0.);",   // stained window
    "  float k=lx1*.5;vec2 P=q*k,i0=floor(P),f=fract(P);float d1=9.,d2=9.;vec2 bs=vec2(0.);for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 b=vec2(float(x),float(y));vec2 oo=b+vec2(h(i0+b+.4),h(i0+b+2.7))*.8+.1;float dd=length(f-oo);if(dd<d1){d2=d1;d1=dd;bs=i0+b;}else if(dd<d2)d2=dd;}",
    "  float pane=(.35+.55*h(bs+seed))*(.85+.15*sin(TH+h(bs)*6.28));return smoothstep(.004,-.004,d)*pane*smoothstep(0.,.06,d2-d1)*br+exp(-max(d,0.)*(5.-lx3*3.))*.25*lx3+.02;}",
    " if(look==145){float d=length(p),a=atan(p.y,p.x);float R=.85;float n0=floor(lx1+.5);float sec=abs(fract(a/6.28318*n0)-.5);float rg=abs(fract(d/R*lx2)-.5);float lead=smoothstep(0.,.05,min(sec*d*n0*.4,rg));",   // rose window
    "  float pane=.35+.55*h(vec2(floor(a/6.28318*n0)+floor(d/R*lx2)*17.,seed));return smoothstep(R,R-.006,d)*pane*lead*(.85+.15*cos(TH+d*3.))*br+exp(-max(d-R,0.)*(5.-lx3*3.))*.3*lx3+exp(-abs(d-R)*120.)*.4+.02;}",
    " if(look==146){float a=.5;vec2 q=mat2(cos(a),-sin(a),sin(a),cos(a))*p;float x=q.x*lx1*.4;float id=floor(x),f=fract(x)-.5;float sh=exp(-f*f/(.01+lx2*.06))*(.5+.5*h(vec2(id,seed)))*smoothstep(-1.5,1.,q.y);",   // light shafts
    "  vec2 dq=p*14.+vec2(0.,TH/6.28318*3.);vec2 ci=floor(dq),fd=fract(dq)-.5;float dust=exp(-dot(fd,fd)*180.)*step(.85,h(ci+seed))*(.6+.4*sin(TH*2.+h(ci)*6.28));",
    "  return sh*(.7+.3*fbm(q*1.5+S+o*.3))*.9+dust*sh*lx3*2.+.02;}",
    " if(look==147){float x=p.x*.5+.5;float t=fract(x*lx1);float e1=(t-.42)/.015,e2=(t-.47)/.012,e3=(t-.52)/.015,e4=(t-.7)/.05;float y=(-.15*exp(-e1*e1)+exp(-e2*e2)-.3*exp(-e3*e3)+.18*exp(-e4*e4))*lx2*.7;",   // heartbeat
    "  float e=(p.y-y)/.008;float bb=exp(-mod(fract(TH/6.28318)-x,1.)*4.);return exp(-e*e)*(.15+.85*bb)+exp(-abs(p.y-y)*20.)*.15*lx3*bb+.02;}",
    " if(look==148){vec2 q=p*lx1+C(1.)*.3;float cs=0.;for(int i=0;i<4;i++){float fi=float(i);q=vec2(q.x+sin(q.y*1.1+TH+fi),q.y+cos(q.x*.9-TH+fi*1.3));cs+=pow(abs(sin(q.x+q.y)),2.+lx2*12.);}",   // water light
    "  return cs*.3*(1.-lx3*.4)+lx3*.15*(.5+.5*fbm(p+S+o*.3))+.03;}",
    " if(look==149){float d=length(p),a=atan(p.y,p.x);float l=abs(fract(d*lx1*2.-a/6.28318-TH/6.28318)-.5);",   // spiral line
    "  return smoothstep(.04+lx2*.15,0.,l)*exp(-d*.6)*(.6+.4*lx3)+exp(-d*5.)*.3*lx3+.02;}",
    " if(look==150){float d=length(p),a=atan(p.y,p.x);float rg=floor(d*lx1*2.);float fr=fract(d*lx1*2.)-.5;float sp=floor((h(vec2(rg,seed))-.5)*6.*lx3+.5);float ang=fract((a+TH*sp)/6.28318+h(vec2(rg,seed+1.)));",   // arc rings
    "  return smoothstep(.04+lx2*.25,0.,abs(fr))*step(ang,.25+.5*h(vec2(rg,seed+2.)))*step(.5,rg)*exp(-d*.5)*.9+.02;}",
    " if(look==151){float y=p.y*lx1*.5+fbm(p*.6+S+o*.5)*lx2*3.;float l=abs(fract(y)-.5);",   // stream lines
    "  return smoothstep(.06,0.,l)*(.4+.5*lx3)*exp(-length(p)*.3)+exp(-l*l*30.)*.06+.02;}",
    " if(look==152){float v=.02;for(int L=0;L<2;L++){float fl=float(L);vec2 q=p*lx1*(.5+fl*.4)-vec2(0.,TH/6.28318*(2.+fl));vec2 ci=floor(q),f=fract(q)-.5;f.x+=sin(TH+h(ci)*6.28)*.1;float R=(.15+.25*h(ci+3.))*lx2*2.;float d=length(f)-R;float rt=d/.02;",   // bubbles
    "  v+=(exp(-rt*rt)*(.4+.6*lx3)+smoothstep(0.,-.02,d)*.08+exp(-length(f-vec2(-R*.4,R*.4))*40.)*.4)*step(h(ci+1.+fl),.45);}return v;}",
    " if(look==153){vec2 q=p*lx1*.5;vec2 g=vec2(q.x+q.y*.577,q.y*1.155);vec2 ci=floor(g),f=fract(g);float up=step(f.x,f.y);float sh=fbm((ci*2.+up)*.15+S+o*.4);float e=min(min(f.x,f.y),min(1.-max(f.x,f.y),abs(f.x-f.y)));",   // low poly
    "  return pow(sh,1.+lx2*2.)*1.1*(1.-smoothstep(.04,0.,e)*lx3*.6)+smoothstep(.03,0.,e)*lx3*.1;}",
    " if(look==154){vec2 q=p*lx1*.5;vec2 ci=floor(q)+.5,f=fract(q)-.5;float w=fbm(ci/(lx1*.5)*.8*(.5+lx2)+S+o*.5);float rad=w*.55*lx3;",   // dot wave
    "  return smoothstep(rad,rad-.05,length(f))*(.3+.7*w)+.02;}",
    " if(look==155){float v=.02,ph=fract(TH/6.28318);for(int i=0;i<10;i++){float fi=float(i);if(fi>=lx1)break;float t=fi+ph;float z=1.+(lx1-t)*(.4+lx2*.8);float fd=smoothstep(0.,1.,t)*(1.-smoothstep(lx1-1.,lx1,t));",   // colonnade
    "  for(int k=0;k<2;k++){float x0=(float(k)*2.-1.)*1.3/z;float e=(p.x-x0)/(.06/z);v+=exp(-e*e*e*e)*smoothstep(1./z+.02,1./z-.02,abs(p.y))*(.8/z)*fd*(.6+.4*lx3);}}return v+exp(-abs(p.y+.2)*6.)*.05;}",
    " if(look==156){float v=0.;for(int i=0;i<2;i++){float a=TH*.5+float(i)*1.5708;vec2 q=mat2(cos(a),-sin(a),sin(a),cos(a))*p;float f2=.25+lx2*.75;float dd=abs(length(q/vec2(1.,f2))-lx1)*f2;",   // neon rings
    "  v+=exp(-dd/.006)*.8+exp(-dd*12.)*.2*lx3;}return v+.02;}",
    " if(look==157){vec2 q=p*lx1;vec2 w1=vec2(fbm(q+S+o*.4),fbm(q+S+3.+o2*.4));float f=fbm(q+w1*lx2*3.);",   // ink bloom
    "  return smoothstep(.35,.35+.4*(1.-lx3)+.02,f)*.85*exp(-length(p)*.3)+.02;}",
    " if(look==158){float d=length(p),a=atan(p.y,p.x);float n0=floor(lx1+.5);float id=floor(a/6.28318*n0+.5);float f=fract(a/6.28318*n0+.5)-.5;float hg=lx2*.5*(.3+.7*(.5+.5*sin(TH*floor(1.+h(vec2(id,seed))*3.)+h(vec2(id,seed+1.))*6.28)));float rr=d-lx3;",   // ring equalizer
    "  return smoothstep(.3,.2,abs(f))*step(0.,rr)*step(rr,hg)*(.4+.6*rr/max(hg,.01))+exp(-abs(d-lx3)*40.)*.3+.02;}",
    " if(look==159){float d=length(p);float n0=floor(lx2+.5)*2.;float rays=pow(abs(cos(atan(p.y,p.x)*n0*.5)),60.)*exp(-d/(lx1*.8));",   // star cross
    "  return (rays*.8+exp(-d*d/(.003+lx1*.01))*.9+exp(-d/(lx1*.4))*.25*lx3)*(.9+.1*cos(TH));}",
    " if(look==160){float hz=.25;float d0=hz-p.y;if(d0<.01)return exp(-(p.y-hz)*3.)*.15+.02;float z=1./d0;float hg=fbm(vec2(p.x*z*.4,z*.4)+S)*lx2;float d=d0+hg*.5/z;if(d<.01)return .02;z=1./d;float k=lx1*.25;",   // terrain
    "  float gx=abs(fract(p.x*z*k)-.5),gz=abs(fract(z*k-TH/6.28318)-.5);return smoothstep(.06,0.,min(gx,gz))*smoothstep(0.,.5,d)*(.4+.6*lx3)+exp(-abs(p.y-hz)*12.)*.3*lx3+.02;}",
    " if(look==161){float v=0.;for(int i=0;i<6;i++){float fi=float(i);if(fi>=lx1)break;vec2 c=vec2(sin(TH+fi*2.4)*1.3,(h(vec2(fi,seed))-.5)*1.2);float d=length(p-c)/lx2;v+=exp(-d*d*6.)*.6+exp(-d*1.5)*.12;}",   // fog lights
    "  float fg=fbm(p*1.3+S+o*.4);return v*(1.-lx3*.5+lx3*.6*fg)+lx3*.12*fg;}",
    " if(look==162){float a=lx2*.0174533;float u=dot(p,vec2(cos(a),sin(a)))*lx1*.3-TH/6.28318;",   // diagonal bands
    "  return pow(.5+.5*cos(u*6.28318),1.+(1.-lx3)*6.)*.85*exp(-length(p)*.25)+.03;}",
    " if(look==163){float v=.02;for(int i=0;i<4;i++){float fi=float(i);if(fi>=lx1)break;float a=fi*3.14159/lx1;vec2 q=mat2(cos(a),-sin(a),sin(a),cos(a))*p;float f2=.15+lx2*.5;float dd=abs(length(q/vec2(1.,f2))-.8)*f2;float t=TH*(1.+mod(fi,2.))+fi;",   // atom
    "  vec2 e=mat2(cos(-a),-sin(-a),sin(-a),cos(-a))*vec2(cos(t)*.8,sin(t)*.8*f2);v+=exp(-dd/.005)*.5+exp(-length(p-e)*40.)*.9;}return v+exp(-length(p)*8.)*.5*lx3;}",
    " if(look==164){vec2 q=p*lx1*.5;vec2 ci=floor(q),f=fract(q)-.5;float bt=fract(h(ci+seed)+TH/6.28318*floor(1.+lx2*3.));float b=exp(-bt*6.)*smoothstep(0.,.03,bt);",   // tile pulse
    "  return smoothstep(.5-lx3*.2,.45-lx3*.2,max(abs(f.x),abs(f.y)))*(.08+.85*b)*exp(-length(p)*.25)+.02;}",
    " if(look==165){float n0=floor(lx1+.5);float d=length(p),a=atan(p.y,p.x)+TH/n0;float sg=6.28318/n0;float am=mod(a,sg)-sg*.5;vec2 lp=vec2(cos(am),sin(am))*d-vec2(lx2,0.);",   // halo crown
    "  return exp(-dot(lp,lp)*400.)*(.8+.2*cos(TH*2.+floor(a/sg)))+exp(-abs(d-lx2)*20.)*.2+exp(-d/lx2*2.)*.3*lx3+.02;}",
    " if(look==166){float tw=p.x*lx1+TH;float w=lx2*.35*abs(cos(tw))+.02;float y=sin(p.x*1.2+TH)*.25;float e=(p.y-y)/w;",   // twist ribbon
    "  return exp(-e*e*e*e)*(.3+.6*(.5+.5*sin(tw*2.))*lx3+.3*(1.-lx3))*exp(-abs(p.x)*.25)+.02;}",
    " if(look==167){vec2 L=vec2(0.,.5);float cl=fbm(p*vec2(1.,1.8)*1.2+S+o*.3);float gap=smoothstep(lx1*.6,lx1*.6+.2,length(p-L));float dens=smoothstep(.65-lx3*.4,.85-lx3*.4,cl)*gap;vec2 q=p-L;float a=atan(q.x,q.y);",   // cloud break
    "  float ry=smoothstep(.4,.9,fbm(vec2(cos(a),sin(a))*4.+S+C(1.)*.2))*exp(-length(q)*.6)*step(q.y,0.)*lx2;return mix(exp(-length(q)*1.2)*.9+ry*.6,.08+.3*cl,dens);}",
    " if(look==168){float f=fbm(p*lx2+S+o*.2);float l=abs(fract(f*lx1)-.5);",   // topography
    "  return smoothstep(.06,0.,l)*(.3+.6*f)*(.5+.5*lx3)+.02;}",
    " if(look==169){vec2 q=p*lx1*.5;q+=vec2(0.,sin(q.x*.8+TH)*lx2*.8+sin(q.y*.6-TH)*.2*lx2);vec2 g=abs(fract(q)-.5);",   // grid flag
    "  return smoothstep(.04,0.,min(g.x,g.y))*(.6+.4*cos(q.x*.8+TH))*(.4+.6*lx3)*exp(-length(p)*.3)+.02;}",
    " if(look==170){float v=.02;for(int i=0;i<6;i++){float fi=float(i);if(fi>=lx1)break;vec2 c=vec2(h(vec2(fi,seed))*3.-1.5,h(vec2(fi,seed+1.))*1.6-.8)+vec2(cos(TH+fi),sin(TH+fi*1.7))*.12;float ra=TH/3.*(mod(fi,2.)*2.-1.)+fi;",   // prism shards
    "  vec2 q=mat2(cos(ra),-sin(ra),sin(ra),cos(ra))*(p-c);float s2=lx2*(.5+.5*h(vec2(fi,seed+2.)));float d=max(abs(q.x)*.866+q.y*.5,-q.y)-s2*.5;v+=smoothstep(.004,-.004,d)*(.25+.4*clamp(.5+q.y/s2,0.,1.))+exp(-abs(d)*90.)*.5+exp(-max(d,0.)*8.)*.08*lx3;}return v;}",
    " if(look==171){vec2 q=p*lx1*.5;vec2 ci=floor(q),f=fract(q)-.5;float ph=fract(length(ci)*.15-TH/6.28318*floor(lx3+.5));float e=(length(f)-ph*.45*lx2*2.)/.02;",   // ring grid
    "  return exp(-e*e)*(1.-ph)*.9+.02;}",
    " if(look==172){float a=lx1*.0174533+sin(TH)*.2*lx2;float t=dot(p,vec2(cos(a),sin(a)))*.35+.5+fbm(p*.5+S+o*.3)*.2*lx2;",   // gradient drift
    "  return clamp(smoothstep(-.1+lx3*.3,1.1-lx3*.3,t),0.,1.)*.95;}",
    " if(look==173){vec2 c1=vec2(cos(TH),sin(TH))*lx2*.5,c2=-c1;float d1=length(p-c1),d2=length(p-c2);",   // twin suns
    "  return smoothstep(lx1,lx1-.006,d1)*.95+smoothstep(lx1*.8,lx1*.8-.006,d2)*.7+(exp(-d1/(lx1*1.5))+exp(-d2/(lx1*1.5)))*.25*(1.+lx3)+.02;}",
    " if(look==174){float v=.02;for(int i=0;i<8;i++){float fi=float(i);if(fi>=lx1)break;float x0=(fi-(lx1-1.)*.5)*.5;float a=sin(TH+fi*1.3)*.25*lx3;vec2 q=p-vec2(x0,1.1);vec2 dq=vec2(q.x*cos(a)-q.y*sin(a),q.x*sin(a)+q.y*cos(a));",   // stage wash
    "  float w=.03+lx2*.12*max(-dq.y,0.);v+=exp(-dq.x*dq.x/(w*w+1e-4))*smoothstep(0.,.4,-dq.y)*exp(dq.y*.35)*.35;}return v*(.75+.35*fbm(p*1.4+S+o*.4));}",
    " if(look==175){float v=.02;for(int i=0;i<8;i++){float fi=float(i);if(fi>=lx1)break;float x0=(fi-(lx1-1.)*.5)*.45;float a=sin(TH*(1.+mod(fi,2.))+fi*2.1)*lx2*.7;vec2 q=p-vec2(x0,-1.1);",   // floor movers
    "  float dx=q.x*cos(a)+q.y*sin(a),dy=-q.x*sin(a)+q.y*cos(a);float w=.012+max(dy,0.)*.03;v+=exp(-dx*dx/(w*w))*step(0.,dy)*exp(-dy*.5)*(.5+.3*lx3);}return v+exp(-abs(p.y+1.)*4.)*.15*lx3;}",
    " if(look==176){vec2 c=vec2(sin(TH)*.3*lx3,0.);vec2 q=p-c;float st=exp(-abs(q.y)*(40.-lx2*30.))*exp(-abs(q.x)*(.6-lx2*.4))*.7;float core=exp(-dot(q,q)/(.004+lx1*.02));float gh=0.;",   // anamorphic flare
    "  for(int i=1;i<4;i++){float fi=float(i);vec2 g=-c*fi*.6;float dg=length(p-g);gh+=exp(-dg*(12.+fi*6.))*.25+smoothstep(.02,0.,abs(dg-.06*fi))*.1;}return st+core*.9+exp(-length(q)*3.)*.2+gh+.02;}",
    " if(look==177){float x=p.x*lx1*.4;float y=(fbm(vec2(x,seed))-.5)*lx2*1.8-.1;float d=abs(p.y-y);float tr=fract(p.x*.15-TH/6.28318);",   // outline ridge
    "  return exp(-d/.006)*(.5+.5*exp(-pow(tr-.5,2.)*40.)*lx3*2.)+exp(-d*14.)*.12+step(p.y,y)*exp(-(y-p.y)*3.)*.05+.02;}",
    " if(look==178){vec2 c=vec2(0.,lx2-.5);float d=length(p-c);float hz=fbm(vec2(p.x*.8,p.y*3.)+S+o*.3);",   // hazy sun
    "  return smoothstep(lx1,lx1-.15,d)*.75+exp(-d/(lx1*1.5))*.45+hz*lx3*.35*exp(-abs(p.y-c.y)*1.5)-smoothstep(.5,.8,hz)*lx3*.15*smoothstep(lx1+.1,0.,d)+.02;}",
    " if(look==179){vec2 q=p-vec2(sin(TH)*.15*lx3,0.);q.x-=q.y*.35;vec2 b=vec2(.5,.7)*lx1;float d=rbox(q,b,0.);float mx=abs(q.x),my=abs(fract((q.y+b.y)/(b.y*2.)*3.)-.5)*b.y*2./3.;float mu=smoothstep(.012*lx1,.02*lx1,min(mx,my));",   // window patch
    "  float soft=.01+lx2*.08;return smoothstep(soft,-soft,d)*mu*(.75+.25*fbm(p*2.+S+o*.2))+exp(-max(d,0.)*4.)*.12+.03;}",
    " if(look==180){vec2 c=vec2(-1.4+lx1*2.8,-.6);float d=length((p-c)*vec2(.6,1.));float base=exp(-d*(1.2-lx2*.8))*.95;",   // golden hour
    "  vec2 dq=p*10.+C(1.)*.8;vec2 ci=floor(dq),fd=fract(dq)-.5;float dust=exp(-dot(fd,fd)*160.)*step(.88,h(ci+seed))*(.5+.5*sin(TH+h(ci)*6.28));return base+dust*lx3*base*1.5+.02;}",
    " if(look==181){float v=.02,ph=fract(TH/6.28318);for(int i=0;i<12;i++){float fi=float(i);if(fi>=lx1)break;float z=fract(fi/lx1+ph);float s2=z*z*2.2;float a=lx2*(1.-z)*1.5;vec2 q=mat2(cos(a),-sin(a),sin(a),cos(a))*p;",   // frame tunnel
    "  float d=abs(rbox(q,vec2(1.6,.9)*s2,0.));v+=exp(-d/(.004+z*.01))*smoothstep(0.,.3,z)*(1.-smoothstep(.8,1.,z))*(.5+.5*lx3);}return v+exp(-length(p)*4.)*.15;}",
    " if(look==182){float v=.02;for(int L=0;L<3;L++){float fl=float(L);float k=lx1*(1.+fl*.6);float cx=floor(p.x*k);float gx=fract(p.x*k)-.5;for(int j=0;j<2;j++){float fj=float(j);float hh=h(vec2(cx,fl*7.+fj*3.+seed));",   // ash fall
    "  float y=1.2-fract(hh+fract(TH/6.28318)+fj*.5)*2.4;float x=(h(vec2(cx,fl+fj+9.))-.5)*.7+sin(TH+hh*6.28)*.15*lx2;vec2 d=vec2((gx-x)/k,p.y-y);float sz=.004+.006*h(vec2(cx,fj+fl+4.));v+=exp(-dot(d,d)/(sz*sz))*(.3+.5*hh)*(1.-fl*.25);}}return v*(.6+.6*lx3)+exp(-abs(p.y+1.)*2.)*.05;}",
    " if(look==183){float d=length(p),a=atan(p.y,p.x);float n0=floor(lx1+.5);float f=fract(a/6.28318*n0)-.5;float ln=exp(-abs(f)*d*n0*(2.5-lx2*2.));",   // line burst
    "  float pu=exp(-pow(fract(d*.5-TH/6.28318)-.5,2.)*30.);return ln*smoothstep(.05,.3,d)*exp(-d*.4)*(.3*(1.-lx3)+.35+.65*pu*lx3)+exp(-d*6.)*.4+.02;}",
    " if(look==184){float y0=lx1-.5;float d=p.y-y0;float l=exp(-abs(d)/(.003+lx2*.01))*(.6+.4*exp(-p.x*p.x*.3));float sky=exp(-max(d,0.)*3.)*.25;",   // horizon line
    "  float refl=step(d,0.)*exp(d*4.)*.2*(.6+.4*sin(p.y*120.*(1.+fbm(p+S)*.2)+TH*2.))*lx3;return l+sky+refl+.02;}",
    " if(look==185){float row=floor(p.y*lx1*.5);float fy=fract(p.y*lx1*.5)-.5;float sp0=floor(1.+h(vec2(row,seed))*3.)*(h(vec2(row,seed+1.))>.5?1.:-1.);float x=fract(p.x*.2+h(vec2(row,seed+2.))+TH/6.28318*sp0);",   // kinetic lines
    "  float len=.2+.6*h(vec2(row,seed+3.))*lx2;return smoothstep(.12,.02,abs(fy))*step(x,len)*(.4+.5*h(vec2(row,seed+4.)))*(.5+.5*lx3)+.02;}",
    " if(look==186){float d=length(p),a=atan(p.y,p.x)/6.28318+.5;float R=lx1*(1.+(fbm(vec2(cos(a*6.28318),sin(a*6.28318))*1.5+seed)-.5)*.16*lx2);float ph=fract(TH/6.28318);float draw=ph<.5?step(a,ph*2.):step(ph*2.-1.,a);",   // drawn circle
    "  float l=abs(d-R);return exp(-l/(.004+lx3*.006))*draw*.9+exp(-l*10.)*.12*draw+.02;}",
    " if(look==187){float v=.02;for(int i=0;i<5;i++){float fi=float(i);if(fi>=lx1)break;float x0=(fi-(lx1-1.)*.5)*.7;vec2 q=p-vec2(x0,1.);q.x+=q.y*.35;float w=.04+lx2*.08;",   // cathedral light
    "  v+=exp(-q.x*q.x/(w*w*(1.+abs(q.y))))*smoothstep(0.,.3,-q.y)*exp(q.y*.4)*.4*(.8+.2*sin(TH+fi));}float hz=fbm(p*1.5+S+o*.4);return v*(.6+.6*hz*lx3+.4*(1.-lx3));}",
    " if(look==188){float v=.02;for(int L=0;L<2;L++){float fl=float(L);float k=lx1*(1.+fl*.8);vec2 q=p*k+vec2(fl*3.7,0.);vec2 ci=floor(q),f=fract(q)-.5;f+=vec2(sin(TH+h(ci)*6.28),cos(TH*2.+h(ci+1.)*6.28))*.08*lx2;",   // crowd lights
    "  float on=step(h(ci+seed+fl),.4)*smoothstep(-.1,-.7,p.y);float R=(.12+.18*h(ci+2.))*(1.-fl*.3);v+=smoothstep(R,R*.6,length(f))*on*(.25+.45*h(ci+3.))*(.7+.3*sin(TH*3.+h(ci)*9.))*(.5+lx3);}return v+exp(-abs(p.y+1.)*2.)*.15;}",
    " if(look==189){float w=.18*lx1,L=.95*lx1;float cr=min(rbox(p-vec2(0.,-L*.15),vec2(w*.5,L),0.),rbox(p-vec2(0.,L*.35),vec2(L*.6,w*.5),0.));float l=abs(cr);",   // outline cross
    "  return (exp(-l/(.003+lx2*.006))*.9+exp(-l*12.)*.15*lx3+smoothstep(0.,-.05,cr)*.05*lx3)*(.9+.1*cos(TH))+.02;}",
    " if(look==190){float row=floor((p.y+1.)*lx1*.5);float fy=fract((p.y+1.)*lx1*.5)-.5;float t=fract(TH/6.28318-row/lx1);float bk=3.+lx3*8.;float b=(exp(-t*bk)-exp(-bk))/(1.-exp(-bk))*smoothstep(0.,.03,t);",   // light ladder
    "  float wx=1.2*lx2+.2;return smoothstep(.25,.15,abs(fy))*smoothstep(wx,wx-.05,abs(p.x))*(.06+.9*b)+.02;}",
    " if(look==191){float v=.02;for(int i=0;i<24;i++){float fi=float(i);if(fi>=lx1)break;float y0=(fi-(lx1-1.)*.5)/lx1*1.8;float y=y0+sin(p.x*(1.5+lx2*3.)+TH+fi*.35)*.08*(1.+lx2);",   // wave stack
    "  float d=abs(p.y-y);v+=exp(-d/.004)*.6*(.5+.5*sin(fi*.5+TH))+exp(-d*30.)*.05*lx3;}return v;}",
    " if(look==192){vec2 q=vec2(p.x*.5,p.y*lx1);float f=fbm(q+vec2(0.,fbm(p*vec2(.4,3.)+S+o*.3)*lx2*2.)+S);float strk=fbm(vec2(p.x*.3,p.y*lx1*6.)+S+o*.2);",   // paint light
    "  return smoothstep(.45,.85,f)*(.6+.5*strk)*exp(-abs(p.y)*.4)*(.8+.3*lx3)+.02;}",
    " if(look==193){float y=p.y+fbm(vec2(p.x*.5,p.y*.2)+S+o*.3)*lx2*.6;float b=floor(y*lx1*.5+.5);float f=fract(y*lx1*.5+.5);",   // strata
    "  float base=clamp(.5-y*.35,0.,1.);float lv=clamp(base+(h(vec2(b,seed))-.5)*.25,0.,1.);return mix(lv,base,smoothstep(.5,1.,f)*lx3)*.95;}",
    " if(look==194){float v=.02;for(int i=0;i<4;i++){float fi=float(i);if(fi>=lx1)break;float a=fi/lx1*6.28318+TH;vec2 c=vec2(cos(a),sin(a))*lx2*.4;float d=length(p-c);",   // venn
    "  v+=exp(-abs(d-lx3)/.005)*.6+smoothstep(lx3,lx3-.01,d)*.12;}return v;}",
    " if(look==195){float y0=-.45;float x=p.x*lx1*.25;float id=floor(x),f=fract(x)-.5;float hg=.3+.9*(.5+.5*sin(TH+h(vec2(id,seed))*6.28))*lx2;float yy=p.y-y0;float ay=yy>0.?yy:-yy*1.6;",   // reflected bars
    "  float bar=smoothstep(.3,.2,abs(f))*step(ay,hg)*(1.-ay/hg*.6);return bar*(yy>0.?1.:.3*lx3*(.7+.3*sin(p.y*90.)))+exp(-abs(yy)*30.)*.3+.02;}",
    " if(look==196){vec2 q=p-vec2(sin(TH)*.3*lx3,1.1);float w=.05+max(-q.y,0.)*lx1*.35;float cone=exp(-q.x*q.x/(w*w))*smoothstep(0.,.2,-q.y);vec2 dq=p*14.+C(1.)*.7;vec2 ci=floor(dq),fd=fract(dq)-.5;",   // dust beam
    "  float dust=exp(-dot(fd,fd)*200.)*step(.82,h(ci+seed));float pool=exp(-pow((p.y+.9)*4.,2.)-q.x*q.x/(w*w))*.4;return cone*(.45+dust*lx2*2.)+pool+.02;}",
    " if(look==197){float v=0.;for(int i=0;i<4;i++){float fi=float(i);float a=fi*1.7+seed;vec2 c=vec2(cos(a)*1.6,sin(a*1.3)*.9)+C(1.)*.5*vec2(cos(fi),sin(fi*2.))*lx3;float d=length((p-c)*vec2(.7,1.));",   // film leaks
    "  v+=exp(-d*d/(.15+lx1*.5))*(.4+.4*h(vec2(fi,seed)));}float ed=smoothstep(.2,1.3,length(p*vec2(.6,1.)));return v*(1.-lx2*.6+lx2*.6*ed)*.9+.02;}",
    " if(look==198){float a=lx3*.785398;vec2 q=mat2(cos(a),-sin(a),sin(a),cos(a))*p;float d=max(abs(q.x),abs(q.y));float t=fract(d*lx1*.5-TH/6.28318);",   // square pulse
    "  return exp(-abs(t-.5)*(60.-lx2*50.))*exp(-d*.6)*.9+exp(-d*5.)*.3+.02;}",
    " if(look==199){float v=.02;for(int i=0;i<3;i++){float fi=float(i);float ta=TH+fi*2.094;float f2=abs(cos(ta))*.9+.05;float rot=fi*1.047;vec2 q=mat2(cos(rot),-sin(rot),sin(rot),cos(rot))*p;",   // gyro
    "  float R=lx1*(1.-fi*.12);float dd=abs(length(q/vec2(1.,f2))-R)*f2;v+=exp(-dd/(.003+lx2*.01))*(.5+.3*lx3)+exp(-dd*14.)*.08;}return v+exp(-length(p)*6.)*.3*lx3;}",
    " if(look==200){float R=3.;vec2 c=vec2(0.,-R-.6+lx1);float d=length(p-c)-R;vec2 sq=p*30.;vec2 ci=floor(sq),f2=fract(sq)-.5;float st=exp(-dot(f2,f2)*120.)*step(.93,h(ci+seed))*(.5+.5*sin(TH*2.+h(ci)*6.28))*step(0.,d);",   // starlight horizon
    "  return exp(-abs(d)/(.004+lx2*.01))*.9+exp(-max(d,0.)*(6.-lx2*4.))*.35+step(d,0.)*.03+st*lx3+.02;}",
    " if(look==201){float f=fbm(p*.35*lx1+S+o*.25+o2*.1);float g=smoothstep(.2,.8,f);",   // soft ground
    "  return mix(.15,.75,g)*(1.-lx2*.6*smoothstep(.2,.9,abs(p.y)))*(.6+.4*lx3);}",
    " if(look==202){vec2 c=vec2(0.,lx2-.5);float d=length(p-c);float y=(c.y-p.y)/lx1;float s2=fract(y*lx3*6.-TH/6.28318);float cut=y>0.?step(s2,y*.8):0.;",   // retro sun
    "  return smoothstep(lx1,lx1-.006,d)*(1.-cut)*(.6+.4*(1.-y*.5))+exp(-max(d-lx1,0.)*5.)*.25+.02;}",
    " if(look==203){float v=.02,ph=fract(TH/6.28318);for(int i=0;i<40;i++){float fi=float(i);if(fi>=lx1)break;float a=fi/lx1*6.28318+h(vec2(fi,seed))*.3;float sp0=.6+.4*h(vec2(fi,seed+1.));float rr=ph*sp0*lx2*1.6;",   // spark burst
    "  vec2 e=vec2(cos(a),sin(a))*rr-vec2(0.,ph*ph*.3);vec2 dd=p-e;v+=exp(-dot(dd,dd)/(.0004+.0012*(1.-ph)))*(1.-ph)*1.2;}return .02+(v-.02+exp(-length(p)/(.05+ph*.3))*(1.-ph)*.6*lx3)*smoothstep(0.,.04,ph);}",
    " if(look==205){float k=lx1*.5;vec2 q=p*k;float col=floor(q.x);q.y+=h(vec2(col,seed))*lx4*4.;float tall=1.+floor(h(vec2(col,seed+3.))*3.);q.y/=tall;vec2 id=vec2(col,floor(q.y));vec2 f=fract(q)-.5;",
    "  float g=lx2*.12;float m=smoothstep(.5-g,.5-g-.015,abs(f.x))*smoothstep(.5-g/tall,.5-(g+.015)/tall,abs(f.y));float r0=h(id+seed);",
    "  float on=smoothstep(1.-lx5-.06,1.-lx5+.06,r0+.22*lx3*sin(TH*(1.+floor(r0*3.))+r0*6.28));",
    "  return m*(.035+on*(.6+.4*lx3*sin(TH*2.+r0*40.)*sin(TH+r0*9.)));",
    "  }",
    " if(look==206){float a=r.x/r.y;vec2 g=vec2((p.x+a)/(2.*a)*lx1,(p.y+1.)*.5*lx2);float col=floor(g.x);g.y+=PH()*lx3*lx2*(mod(col,2.)<.5?1.:-1.);float row=floor(mod(floor(g.y),lx2)+.5);vec2 f=fract(g);float e=lx5*.25;",
    "  float w=sn(vec2(col*.22,row*.3)+C(1.)*.9+seed);float on=smoothstep(.62-lx4*.4,.66-lx4*.4,w);float m=smoothstep(e,e+.03,f.x)*smoothstep(1.-e,1.-e-.03,f.x)*smoothstep(e,e+.03,f.y)*smoothstep(1.-e,1.-e-.03,f.y);",
    "  return m*(.03+on*(.65+.35*h(vec2(col,row)+seed)));",
    "  }",
    " if(look==207){vec2 q=p-vec2(0.,-1.1+lx2*.6);float a=atan(q.x,q.y),d=length(q);float u=a/(lx4*2.2+.01)*lx1;float id=floor(u);float f=fract(u)-.5;float r0=h(vec2(id,seed));",
    "  float t=fract(r0*7.+PH()*(1.+floor(r0*2.)));float head=t*3.2;float tail=lx3*1.6*(.5+r0);float band=smoothstep(head-tail,head,d)*smoothstep(head+.04,head,d);",
    "  float w=exp(-f*f*(40.+r0*120.));float mask=smoothstep(1.57*lx4+.3,1.57*lx4,abs(a));",
    "  return mask*band*w*(1.-t*.55)*1.5+mask*exp(-d*1.6)*lx5*.45+.015;",
    "  }",
    " if(look==208){float a=r.x/r.y,v=.02;for(int i=0;i<14;i++){float fi=float(i);if(fi>=lx1)break;float x=(fi+.5)/lx1*2.*a-a;float r0=h(vec2(fi,seed));vec2 o=vec2(x,1.25);float ang=(x/a)*-.35+sin(TH*(1.+floor(r0*2.))+r0*6.28)*lx3*.5;",
    "  vec2 dir=vec2(sin(ang),-cos(ang));vec2 q=p-o;float t=dot(q,dir);if(t<0.)continue;float d=abs(dot(q,vec2(dir.y,-dir.x)));float w=.015+t*lx2*.13;v+=exp(-d*d/(w*w))*exp(-t*(1.15/lx5))*(.65+.35*sin(TH+r0*20.));}",
    "  float fog=.6+.8*fbm(p*1.3+o*.35+S);return v*mix(1.,fog,lx4)+.02;",
    "  }",
    " if(look==209){float a=r.x/r.y;float ed=lx1*a+(p.y-lx2)*lx4*.35+sin(TH)*.015*FL;float e=smoothstep(.005+lx5*.25,-.005-lx5*.25,p.x-ed);float wall=clamp((ed-p.x)/(a+ed),0.,1.);",
    "  float g=mix(.25,1.,pow(1.-wall,1.5))*(.65+.35*smoothstep(lx2,1.,p.y)+.1*sin(TH+p.y*2.)*FL);float up=step(lx2,p.y);float fl=(1.-up)*exp((p.y-lx2)*(3.2-lx3*2.))*exp(-abs(p.x-ed*.6)*(1.6-lx3))*e;",
    "  return up*e*g+fl*.9+(1.-e)*up*exp(-(p.x-ed)*(5.-lx3*4.))*lx3*.22+.012;",
    "  }",
    " if(look==210){vec2 q=p-C(1.)*lx5*.06*FL;float d0=length(q);float d=d0-lx1;vec2 nn=q/max(d0,1e-3);float ang=TH*lx5*.0+1.5708;vec2 L=vec2(cos(ang)+C(1.).x*lx5*.6,sin(ang));L=normalize(L);float top=.5+.5*dot(nn,L);",
    "  float rim=exp(-abs(d)/(.006+lx2*.04))*pow(top,1.+lx3*7.);float outer=exp(-max(d,0.)*(7.-lx4*5.))*(.25+.75*top)*lx4;float inner=step(d,0.)*exp(d*(9.-lx4*6.))*(.15+.85*pow(1.-top,2.))*.55;",
    "  return rim*1.25+outer*.8+inner+.01;",
    "  }",
    " if(look==211){float cy=lx4+lx2;vec2 q=vec2(p.x,p.y-cy);float dd=rbox(q,vec2(lx1,lx2),.01);float inner=smoothstep(.006,-.006,dd)*(.75+.25*sin(TH+p.y*2.)*FL*.5);float glow0=exp(-max(dd,0.)*(9.-lx3*7.))*lx3*.7+exp(-max(dd,0.)*40.)*.5;",
    "  float refl=0.;if(p.y<lx4){float ry=2.*lx4-p.y;float wob=sin(p.y*50.+TH*2.)*.01+sn(vec2(p.x*3.,p.y*14.)+C(1.)*.3)*.03;float d2=rbox(vec2(p.x+wob,ry-cy),vec2(lx1,lx2),.01);refl=exp(-max(d2,0.)*(6.-lx3*3.))*exp((p.y-lx4)*4.)*lx5;}",
    "  return p.y<lx4?refl+.012:min(1.2,inner+glow0)+.012;",
    "  }",
    " if(look==212){vec2 c0_=vec2(0.,lx3+sin(TH)*.02*FL);vec2 q=(p-c0_)/vec2(lx1,lx2);float d=(length(q)-1.)*lx2;float disc=smoothstep(.004,-.004,d);float pool=exp(-max(d,0.)*(8.-lx4*6.))*lx4*.75;",
    "  float hz=-.6;float fl=p.y<hz?exp(-abs(p.x)*1.6/lx1)*exp((p.y-hz)*(2.6-lx5))*lx5*.6:0.;float room=.05+.08*exp(-length(p-c0_)*1.3);",
    "  return disc*.98+(1.-disc)*(pool+room)+fl;",
    "  }",
    " if(look==213){float v=.02;for(int i=0;i<5;i++){float fi=float(i);if(fi>=lx1)break;float x=(fi-(lx1-1.)*.5)*lx2*2.05;float sk=(fi-(lx1-1.)*.5)*lx3*.55;vec2 q=p-vec2(x,-.12);q.y/=1.+q.x*sk;float dd=rbox(q,vec2(lx2,lx2*1.25),.012);float m=smoothstep(.006,-.006,dd);",
    "  float rr=length(q/vec2(lx2,lx2*1.25));float core=mix(1.,smoothstep(.0,.7,rr+.22*sin(TH+fi*2.)*FL),lx4);float heat=(.45+.55*core)*(.85+.15*sin(TH*2.+fi*4.));v=max(v,m*heat);v+=(1.-m)*exp(-max(dd,0.)*(7.-lx5*5.))*lx5*.14;}",
    "  return v+(p.y<-.72?exp((p.y+.72)*4.)*lx5*.28:0.);",
    "  }",
    " if(look==214){float gap=(.5+.5*C(1.).x)*lx2*.34*FL;vec2 a1=p-vec2(-lx1-gap,0.),a2=p-vec2(lx1+gap,0.);float d1=rbox(a1,vec2(lx1),.015),d2=rbox(a2,vec2(lx1),.015);float m1=smoothstep(.006,-.006,d1),m2=smoothstep(.006,-.006,d2);",
    "  float g1=exp(-dot(a1,a1)/(lx1*lx1*(.25+lx4))),g2=exp(-dot(a2,a2)/(lx1*lx1*(.25+lx4)));float near=1.-smoothstep(0.,.6,gap/max(lx2*.34,.01));float seam=exp(-abs(p.x)*(30.-lx3*22.))*exp(-p.y*p.y/(lx1*lx1))*(.25+near)*lx3*1.2;",
    "  return (m1*g1+m2*g2)*(.9+near*.2)+.08*(m1+m2)+seam*(m1+m2+.2)+exp(-max(min(d1,d2),0.)*5.)*.14+(p.y<-lx1-.1?exp((p.y+lx1+.1)*5.)*lx5*.5:0.)+.012;",
    "  }",
    " if(look==215){float v=.015;for(int i=13;i>=0;i--){float fi=float(i);if(fi>=lx1)continue;float dp=fi/max(lx1-1.,1.);float sc=1./(1.+dp*lx2*2.6);float cx=mix(-1.1,.95,dp*.9+.05)*sc+.1;vec2 q=(p-vec2(cx,-.05*sc))/sc;float w=.24+.1*lx2;float dd=rbox(q,vec2(w,lx5),.01);float m=smoothstep(.01,-.01,dd);",
    "  float t=fract(q.y*(1.5+lx3*5.)-PH()*lx4+dp*.8);float st=exp(-pow((t-.5)/(.08+lx3*.18),2.));float lit=.05+st*(.5+.5*sin(TH*lx4+dp*6.28+q.x*1.5))*(1.-dp*.45);v=mix(v,lit,m*.86);v+=m*exp(-abs(abs(q.x)-w)*60.)*.1;}return v;",
    "  }",
    " if(look==216){float x=p.x+sin(p.y*1.3+TH)*.15*FL;float cen=sin(x*(.7+lx2)+TH+seed)*.42*(.5+lx2)+sin(x*2.3*lx2-TH)*.2*lx2;float wid=lx3*(.55+.45*sin(x*(1.1+lx5*2.)+TH*(lx5>.01?1.:0.)+1.));float t=(p.y-cen)/max(abs(wid),.05);float m=smoothstep(1.03,.97,abs(t));",
    "  float ln=.5+.5*cos(t*lx1*.5+sin(x*2.)*lx5*5.);float sh=pow(1.-t*t*.9,1.2);float spec=exp(-pow((t-.35*sin(x*1.7+TH))*3.,2.))*lx4;",
    "  return m*(.12+.62*sh*(.35+.65*ln)+spec*.75*(.5+.5*ln))+.018;",
    "  }",
    " if(look==217){float cy=sin(p.x*1.6+TH)*lx3*.6;float wd=cos(p.x*lx2*2.+TH)*lx4;float t=(p.y-cy)/(abs(wd)+.012);float m=smoothstep(1.02,.96,abs(t));float ln=pow(.5+.5*cos(t*lx1*.5+p.x*5.),1.5);float flip=sign(wd);",
    "  float sh=mix(1.,.45+.55*abs(wd)/lx4*(.75+.25*flip),lx5);return m*(.14+.74*ln*sh*(1.-t*t*.35))+exp(-abs(p.y-cy)*3.5)*.06+.012;",
    "  }",
    " if(look==218){float an=lx3*.0174533+sin(TH)*.07*FL;vec2 q=mat2(cos(an),-sin(an),sin(an),cos(an))*p;q.y/=1.-lx2*.72;vec2 wr=vec2(fbm(p*.9+S+o*.4),fbm(p*.9+S+7.-o*.4))-.5;q+=wr*lx4*.9;float d=length(q)/lx1;",
    "  float ring=exp(-pow((d-1.)*2.1,2.));float bg=mix(.9,.3,smoothstep(.2,1.9,d));float core=smoothstep(.25+lx5*.45,.1,d);return clamp(bg*.85*(1.-ring*.3)+ring*.35,0.,1.)*(1.-core*.97)+exp(-abs(d-(.25+lx5*.45))*30.)*.45+.012;",
    "  }",
    " if(look==219){float a=r.x/r.y;float v=.03;float sp0=a*1.55/lx1;float W=sp0*(1.+lx4*2.);for(int i=0;i<16;i++){float fi=float(i);if(fi>=lx1)break;float t=fi/max(lx1-1.,1.);float cx=(t-.5)*(a*1.55-W*.0)+sin(TH+fi*.45)*lx5*.05;vec2 q=p-vec2(cx,sin(TH+fi*.45)*lx5*.06);float rd=min(W,lx2)*lx3*.95;float dd=rbox(q,vec2(W*.5,lx2),max(rd,.01));float m=smoothstep(.006,-.006,dd);",
    "  float g=mix(.2,1.,t)*(.72+.28*sin(q.y*2.+fi*.6+TH));float sh=1.-.45*smoothstep(0.,W,q.x+W*.5);v=mix(v,g*sh,m*.84);v+=m*exp(-abs(q.x+W*.5)*50.)*.11;}return v;",
    "  }",
    " if(look==220){vec2 q=p;float d=length(q);float a=atan(q.y,q.x)+TH/lx1;float m0=abs(cos(a*lx1*.5));float pet=pow(m0,mix(.5,4.,lx4));float op=lx3*(.72+.28*sin(TH));float R0=lx2*(.15+.85*op*pet);float e=d-R0;float body=smoothstep(.02,-.02,e);",
    "  float grad=clamp(d/max(R0,.02),0.,1.);float sheen=pow(1.-abs(sin(a*lx1*.5)),4.)*exp(-pow((grad-.62)*3.2,2.));float rimL=exp(-abs(e)*28.);",
    "  return body*(.2+.34*grad+sheen*.72)+rimL*.34+exp(-max(e,0.)*7.)*.28+exp(-d*(14.-lx5*11.))*lx5*.55+.01;",
    "  }",
    " if(look==221){float a=atan(p.y,p.x);float rr=lx1*(1.+lx3*.42*(sn(vec2(cos(a),sin(a))*1.6+C(1.)*.65+seed)-.5));float d=length(p)/rr;float m=smoothstep(1.005,.985,d);float z=sqrt(max(0.,1.-d*d));vec2 w=vec2(fbm(p*1.4+S+o*lx4),fbm(p*1.4+S+4.-o*lx4));",
    "  float th0=z*1.4+fbm(p*2.+w*2.)*lx4*2.2;float film=.5+.5*sin(th0*lx2+w.x*5.);return m*(.16+.68*film*(.5+.5*z)+pow(z,14.)*.2)+exp(-abs(d-1.)*22.)*lx5*.55+.018;",
    "  }",
    " if(look==222){float f=0.;vec2 g=vec2(0.);for(int i=0;i<8;i++){float fi=float(i);if(fi>=lx1)break;float r0=h(vec2(fi,seed)),r1=h(vec2(fi,seed+4.));vec2 c_=vec2(cos(TH+r0*6.28)*(.3+r1*.9),sin(TH*(1.+floor(r1*2.))+r1*6.28)*(.2+r0*.5))*lx3*1.2;vec2 q=p-c_;float dd=dot(q,q)+.003;float s2=lx2*lx2*(.45+r1*.6);f+=s2/dd;g+=-2.*q*s2/(dd*dd);}",
    "  float m=smoothstep(.97,1.03,f);vec2 nn=g/max(length(g),1e-3);float rf=clamp(1.-1./max(f,1.),0.,1.);float bd=.5+.5*sin(rf*lx4*6.283+nn.y*2.5+nn.x);return m*(.08+.82*pow(bd,1.5)*(.45+.55*rf))+exp(-abs(f-1.)*7.)*lx5*.42+.015;",
    "  }",
    " if(look==223){float x=p.x*lx1+sin(p.y*1.2+TH)*.1*FL;float yc=lx4+sin(x*1.8+TH+seed)*.26+sin(x*3.7-TH)*.09;float dy=p.y-yc;float up=exp(-max(dy,0.)*(4.5-lx3*3.8))*smoothstep(-.03,.02,dy);float low=exp(min(dy,0.)*20.);float ry=sn(vec2(x*lx2*.5,seed)+vec2(sin(TH+x)*.5*lx5,0.));float ry2=sn(vec2(x*lx2*1.3,seed+3.)-vec2(cos(TH)*.5*lx5,0.));",
    "  return (up*(.3+.7*pow(ry,1.6)*(.6+.8*ry2))+low*.5*smoothstep(.0,.5,dy+.5))*(.75+.35*fbm(vec2(x*.7,p.y*.3)+S+o*.4))+.012;",
    "  }",
    " if(look==224){float a=r.x/r.y;float rw=floor((p.y+1.)*.5*lx1);float tq=floor(PH()*lx4*6.)/max(lx4*6.,1.);float r0=h(vec2(rw,seed));float off=(h(vec2(rw,tq*17.+seed))-.5)*lx3*.5;float wob=sin(rw*.32+TH)*.12*lx3;float x=p.x+off+wob;float bd=smoothstep(lx2*a+.05,lx2*a-.05,abs(x));",
    "  float s0=sn(vec2(x*2.2+rw*.03,rw*.02)+C(1.)*.5+seed);s0=smoothstep(.2,.8,s0);float cb=.5+.5*sin(s0*14.*(.3+lx5)+rw*.14);return bd*(.06+.98*mix(s0,cb,lx5))+.012;",
    "  }",
    " if(look==225){float a=r.x/r.y,v=0.;for(int i=0;i<18;i++){float fi=float(i);if(fi>=lx1)break;float r0=h(vec2(fi,seed));float cx=((fi+.5)/lx1*2.-1.)*a+sin(TH+r0*6.28)*lx3*.18;float x=p.x-cx+sin(p.y*2.+r0*6.)*lx4*.16;float w=(a/lx1)*(.25+lx2*.95);float g=exp(-x*x/(w*w));float hg=.5+.5*sin(p.y*(1.2+r0*2.)+r0*6.28+TH);v+=g*hg*(.3+.7*r0);}",
    "  v=clamp(v*1.15,0.,1.2);return mix(v,floor(v*7.)/7.+.04,lx5*step(.03,v)*.5)+.015;",
    "  }",
    " if(look==226){vec2 w=vec2(fbm(p*1.1+S+o*.3),fbm(p*1.1+S+6.-o*.3))-.5;vec2 q=p+w*lx4*1.1;float d1=length(q-vec2(.05,.3)*lx3)-.28*lx3;float d2=rbox(q-vec2(0.,-.45)*lx3,vec2(.52,.5)*lx3+.01,.3*lx3+.01);float f=min(d1,d2)-(.25*sn(q*2.+S))*lx3;float u=f*lx1-PH()*2.;float l=abs(fract(u)-.5);float ln=smoothstep(lx2*.5+.03,lx2*.5-.03,l);",
    "  return ln*exp(-max(f,0.)*(.2+lx5*3.))*(step(0.,f)*.95+.05*step(f,0.))+step(f,0.)*.018+.012;",
    "  }",
    " if(look==227){float a=r.x/r.y;float nx=p.x/a;float sc=1.-lx2*.55*pow(1.-abs(nx),1.5);float xp=sign(nx)*pow(abs(nx),1.+lx5*.9);vec2 q=vec2(xp*a,p.y/sc);vec2 g=vec2(q.x,q.y)*lx1*.5;vec2 id=floor(g),f=fract(g)-.5;float bar=sn(vec2(id.x/lx1*lx4,seed))*.55+.45*(.5+.5*sin(id.x/lx1*lx4*3.+TH));float vert=exp(-pow((q.y-sin(id.x*.18+TH)*.18)*1.25,4.))*smoothstep(1.32,1.,abs(q.y));float b=clamp(pow(bar,1.1)*1.7,0.,1.)*vert*(1.-.4*lx2*pow(1.-abs(nx),2.));float R0=.5*lx3*(.3+.7*sqrt(clamp(b,0.,1.)));",
    "  return smoothstep(R0+.09,R0-.09,length(f))*(.14+.95*b)+.012;",
    "  }",
    " if(look==228){float yc=-.2;float x=p.x,y=p.y-yc;float ry=max(y,0.);float d=length(vec2(x,ry))-lx2;float ins=smoothstep(.006,-.006,d);float u=d*lx1*.75;float row=floor(u);float rq=lx2+max(row+.5,0.)/(lx1*.75);float along=y>0.?atan(x,y)*rq/.75:sign(x)*rq*2.09+y/.75;float dir=mod(row,2.)<.5?1.:-1.;float L=.12+lx3*.65;float per=floor(6./L);float aa=along/L+PH()*lx4*dir*per;float id=floor(mod(floor(aa),per)+.5);",
    "  float r0=h(vec2(id,row)+seed);float on=step(1.-lx5,r0);float fx=fract(aa),fy=fract(u);float m=smoothstep(0.,.05,fx)*smoothstep(1.,.95,fx)*smoothstep(.1,.18,fy)*smoothstep(.9,.82,fy);return (1.-ins)*m*(.04+on*(.45+.55*r0))*(.72+.28*sin(row*.8+TH))+.01;",
    "  }",
    " if(look==229){vec2 q=p-vec2(.1,-.25);float d=length(q);float a=atan(q.y,q.x);float rl=log(d+.07);float w=a/6.28318*lx1+sn(vec2(rl*2.,seed))*.45;float sp0=floor(w);float rr=rl*lx2/2.+h(vec2(sp0,seed))*.8;float rg=floor(rr);vec2 ii=vec2(sp0,rg);float r0=h(ii+seed);",
    "  float ex=min(min(fract(w),1.-fract(w))/(d*.55+.06),min(fract(rr),1.-fract(rr)));float crack=exp(-ex*(70.-lx3*50.));float sw=.5+.5*cos(a*2.+r0*2.-TH);return (.06+.42*pow(sw,1.+lx4*5.)*r0)*(1.-crack*.75)+crack*(.45+.55*r0)*lx3*1.4+exp(-d*(9.-lx5*7.))*lx5*.55+.012;",
    "  }",
    " if(look==230){float an=lx2*.0174533+sin(TH)*lx5*.08;vec2 dr=vec2(cos(an),sin(an)),nr=vec2(-dr.y,dr.x);float u=dot(p,nr),t=dot(p,dr);float k=mix(1.6,.1,lx3);float s0=fbm(vec2(u*lx1*2.,t*k)+S+vec2(0.,o.x*.4));float s1=fbm(vec2(u*lx1*7.,t*k*.6)+S+3.-vec2(0.,o.y*.5));float bl=0.;for(int i=0;i<7;i++){float fi=float(i);if(fi>=lx4)break;float cu=((fi+.5)/lx4*2.-1.)*.95+sin(TH+fi*2.)*lx5*.14;bl+=exp(-pow((u-cu)*(3.2+lx4*.5),2.))*(.65+.35*h(vec2(fi,seed)));}",
    "  return clamp(bl,0.,1.2)*(.2+.65*s0+.45*s1*s1)*exp(-t*t*.12)+.012;",
    "  }",
    " if(look==231){vec2 q=p-vec2(0.,lx3);float d=length(q);float a=atan(q.y,q.x);float u=a/6.28318*lx1+d*lx2*2.5+PH()*lx5;float f=fract(u);float blade=pow(f,1.+lx4*5.)*smoothstep(1.,.97,f);float falloff=exp(-d*(.5+lx4*.55));return blade*falloff*(.8+.2*sin(a*3.+TH))+exp(-d*12.)*.1+.012;",
    "  }",
    " if(look==232){float k=lx1*.5;float y=(p.y+1.)*k;float rw=floor(y);float f=fract(y);float ph=sin(p.x*lx2+rw*lx4*.45+TH);float lit=pow(.5+.5*ph,1.+lx5*6.);float gr=mix(.25,1.,f);float m=smoothstep(0.,.04,f-lx3*.45)*smoothstep(1.,.96,f);return m*(.05+.92*lit*gr)+.01;",
    "  }",
    " if(look==233){float ca=cos(.65),sa=sin(.65);vec2 q=mat2(ca,-sa,sa,ca)*p;q.y/=1.-lx4*.6;float d=length(q);float a=atan(q.y,q.x);float sw=a*lx1+log(d+.03)*lx2*5.-TH*lx1;float s0=pow(.5+.5*cos(sw),1.+(1.-lx5)*7.);float env=smoothstep(.05,.45,d)*exp(-d*.8);float ring=exp(-abs(d-lx3)*120.);float ho=smoothstep(lx3*.92,lx3*.75,d);",
    "  return (s0*env*(1.-ho)+ring*.85+exp(-abs(d-lx3)*10.)*.25*(1.-ho))+.015;",
    "  }",
    " if(look==234){float v=.01;for(int i=0;i<6;i++){float fi=float(i);if(fi>=lx5)break;float tt=fract(PH()+fi/lx5);float yp=lx1+(tt-.5)*lx2*2.4;float pers=1.+(p.y-yp)*.2;vec2 ff=vec2(p.x/pers*1.2,yp*2.+fi*3.)+S;float nz=fbm(ff+o*.3);float e=p.y-yp-(nz-.5)*lx3*.9;float fade=sin(tt*3.14159);v+=exp(-abs(e)/(.0045+lx4*.05))*fade*(.3+.9*nz)+exp(-abs(e)*5.)*.1*fade*lx3;}return v;",
    "  }",
    " if(look==235){float a=r.x/r.y;float e=floor(lx5+.5);float d=e<.5?p.y+1.:e<1.5?1.-p.y:e<2.5?(p.x+a)/a:(a-p.x)/a;float u=e<1.5?p.x/a:p.y;",
    "  float br=1.+lx3*.22*sin(TH)*FL;float hgt=lx1*1.5*br;float sw=(sin(TH*2.+u*1.7)*.6+sin(TH+u*3.1)*.4)*lx4*.07*FL;",
    "  float x=(d+sw)/hgt;float f=clamp(1.-x,0.,1.);float v=mix(f,f*f*(3.-2.*f),lx2);",
    "  v*=1.+.05*lx2*(sn(vec2(u*2.+seed,d*2.5+seed))-.5);",
    "  return v*.92+.01;",
    "  }",
    " if(look==236){float an=radians(lx1)+sin(TH)*lx3*.45*FL;vec2 dir=vec2(cos(an),sin(an));float t=dot(p,dir)/lx2+sin(TH*2.)*lx4*.35*FL;",
    "  float v=clamp(.5+.5*t,0.,1.);v=mix(v,v*v*(3.-2.*v),lx5);",
    "  return v*.72+.02;",
    "  }",
    " vec2 q=p-vec2(0.,rayOrigin);float a=atan(q.x,q.y),d=length(q);float rays=fbm(vec2(a*rayCount,d*.5)+S+o*.6+warp*.3*fbm(p+S+o2));return smoothstep(.35,.85,rays)*exp(-d*rayLen)*1.5+exp(-d*1.3)*.55;",
    "}",
    "float field(vec2 p){float t0=TH;TH=LTH;float v0=fieldL(p);if(look==13||look==46||look==81||look==93||look==118||look==123||look==131||look==152||look==165||look==170){float k=smoothstep(5.3407,6.28318,th);if(k>0.){TH=LTH-6.28318*cyc;v0=mix(v0,fieldL(p),k);}}TH=t0;return v0;}",
    "void main(){",
    " LTH=th*cyc; DTH=th; TH=dfMotion>.5?LTH*dfMotion:1.3; vec2 uv=gl_FragCoord.xy/r, p=(gl_FragCoord.xy-.5*r)/r.y*2.; vec2 sp=p, p00=p; p=finDyn(p); float loc=0.;",
    " if(finish==1){vec2 ax=vec2(cos(angle),sin(angle));float u=dot(p,ax);",   // custom reeds: straight at any angle, or circular rings around the center
    "  if(reedShape>2.5){u=p.x/(1.+(p.y+1.2)*.24);ax=vec2(1.,0.);}else if(reedShape>1.5){vec2 q=p-vec2(0.,-1.15);u=length(q);ax=u>1e-4?q/u:vec2(0.);}else if(reedShape>.5){u=length(p);ax=u>1e-4?p/u:vec2(0.);}loc=fract(u*reeds*.5+.5)-.5;sp+=ax*loc*refract*(7./reeds)*1.4;}",   // custom reeds: count, refraction, angle
    " if(finish==6){float k=fx1*.5;vec2 cl=floor(p*k),g=fract(p*k)-.5;sp=(cl+.5)/k+g/k*(1.-fx3*.7)+(vec2(h(cl),h(cl+7.3))-.5)*fx3*.12;loc=max(abs(g.x),abs(g.y));}",   // glass block: each brick shows its own shifted, magnified piece
    " if(finish==7){float a=fx3*.0174533;float w=dot(p,vec2(cos(a),sin(a)))*fx1*2.+n(p*1.7+seed)*2.5;sp+=vec2(sin(w),cos(w*.8+1.3))*fx2*.13;}",   // rippled glass: static waves, like old window panes
    " if(finish==9){float k=fx1*.5;vec2 P=p*k,i0=floor(P),f=fract(P);float d1=9.;vec2 dv=vec2(0.);",   // pebbled glass: round lenses
    "  for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 b=vec2(float(x),float(y));vec2 o=b+vec2(h(i0+b),h(i0+b+4.7))*.8+.1;float d=length(f-o);if(d<d1){d1=d;dv=f-o;}}",
    "  sp+=dv/k*fx2*.9;loc=d1;}",
    " if(finish==10){float k=10./fx2;vec2 P=p*k,ci=floor(P),f=fract(P)-.5;vec2 jo=(vec2(h(ci),h(ci+4.1))-.5)*.5;float R=.18+.22*h(ci+8.);float dd=length(f-jo);",   // condensation: droplets that flip the light
    "  loc=-1.;if(h(ci+2.2)<fx1&&dd<R){sp=(ci+.5+jo)/k-(f-jo)/k*.8;loc=dd/R;}}",
    " if(finish==11){float u=p.x+sin(p.y*3.+n(p+seed)*2.)*fx3*.15;loc=fract(u*fx1*.5+.5)-.5;sp.x+=loc*fx2*(7./fx1)*1.4;}",   // wavy reeds
    " if(finish==17){if(fx1<.5)sp.x=abs(sp.x-fx2)+fx2;else if(fx1<1.5)sp=abs(sp);else{float sg=6.28318/max(fx3,2.);float a=mod(atan(sp.y,sp.x),sg);a=abs(a-sg*.5);sp=vec2(cos(a),sin(a))*length(sp);}}",   // mirror
    " if(finish==24)sp+=vec2(sin(p.y*fx1*3.+TH*floor(fx3)+n(p*2.)*2.),cos(p.x*fx1*2.5-TH*floor(fx3)))*fx2*.05;",   // ripple water: moving refraction
    " if(finish==25){float k=fx1*.5;vec2 q=p*k,cl=floor(q),f=fract(q);float tri=step(f.x,f.y);vec2 ct=cl+(tri>.5?vec2(.33,.67):vec2(.67,.33));",   // crystal facets
    "  sp=ct/k+(p-ct/k)*(1.-fx2*.7)+(vec2(h(ct),h(ct+3.))-.5)*fx2*.08;loc=min(min(f.x,f.y),min(1.-max(f.x,f.y),abs(f.x-f.y)*.7));}",
    " if(finish==31){float u=abs(p.x)*tan(fx3*.0174533)+p.y;loc=fract(u*fx1*.5+.5)-.5;sp.y+=loc*fx2*(7./fx1)*1.4;}",   // chevron glass
    " if(finish==32){float k=8./fx2;vec2 P=p*k,ci=floor(P),f=fract(P)-.5;vec2 jo=(vec2(h(ci+1.3),h(ci+4.7))-.5)*.5;float R=.15+.25*h(ci+8.2);float dd=length(f-jo);",   // bubble glass
    "  loc=-1.;if(h(ci+2.9)<fx1&&dd<R){sp=(ci+.5+jo)/k+(f-jo)/k*.75;loc=dd/R;}}",
    " if(finish==38){float u=p.x/(1.+(p.y+1.2)*fx3*.3);loc=fract(u*fx1*.5+.5)-.5;sp.x+=loc*fx2*(7./fx1)*1.4;}",   // ribbed arch
    " if(finish==39){float k=fx1*.5;vec2 P=p*k;float col=floor(P.x);P.y+=floor(sin(TH+h(vec2(col,seed))*6.28)*fx2*2.+.5);vec2 ci=floor(P),g=fract(P)-.5;sp=(ci+.5)/k;loc=max(abs(g.x),abs(g.y));}",   // pixel steps
    " if(finish==41){float fd=sin(p.x*2.3+n(p*.8+seed)*3.);sp.y+=fd*fx3*.05;loc=fd;}",   // linen: soft folds
    " if(finish==44){float k=fx1*.5;float id=floor(p.y*k);sp.x+=sin(TH+h(vec2(id,seed))*6.28)*fx2*.15;loc=fract(p.y*k);}",   // slices
    " if(finish==45){float k=10./fx2;vec2 P=p*vec2(k,k*.4),ci=floor(P),f=fract(P)-.5;float t=fract(h(ci)+TH/6.28318*floor(1.+2.*h(ci+5.)));float dy=f.y-(.4-t*.8);",   // rain glass: drops running down
    "  float dd=length(vec2(f.x*1.4,dy*2.));loc=0.;if(h(ci+2.)<fx1){if(dd<.25){sp-=vec2(f.x,dy)/k*.8;loc=1.;}else if(dy>0.&&abs(f.x)<.04)loc=.5;}}",
    " if(finish==47)sp+=(vec2(fbm(p*3.+seed),fbm(p*3.+seed+5.))-.5)*fx1*.08;",   // watercolor: bleed
    " if(finish==56){float fy=-1.+fx1;if(p.y<fy){sp.y=2.*fy-p.y;sp.x+=sin(p.y*40.+TH*2.)*.012*fx3;loc=1.;}}",   // reflection: a floor that mirrors the look
    " if(finish==59){float k=fx1*.5;float f=fract(p.x*k)-.5;sp.x+=sin(f*3.14159)*fx2*.25/k;loc=f;}",   // cane glass
    " if(finish==60){float k=fx1*.5;float y=p.y*k;float id=floor(y);loc=fract(y);sp+=vec2((loc-.5)*fx2*.3/k+(h(vec2(id,seed))-.5)*fx2*.1,0.);}",   // prism glass
    " if(finish==61){float row=floor(gl_FragCoord.y*(540./r.y)/(1.+fx1*4.));sp.x+=mod(row,2.)*fx2*.04*sin(TH+row*.05);loc=mod(row,2.);}",   // interlace
    " if(finish==62){float k=fx1*.5;vec2 ci=floor(p*k),g=fract(p*k)-.5;sp=(ci+.5)/k;loc=length(g);}",   // dot mosaic
    " if(finish==63){sp+=vec2(sin(p.y*fx1*2.+TH)*fx2*.12,sin(p.x*fx1*1.5-TH)*fx3*.08);}",   // wave warp
    " if(finish==64){float d=length(p);float ang=fx2*3.*exp(-d/(fx1+.05))*(1.+fx3*.3*sin(TH));sp=mat2(cos(ang),-sin(ang),sin(ang),cos(ang))*p;}",   // twirl
    " if(finish==65){float R=fx1*(1.+fx3*.1*sin(TH));float d=length(p);if(d<R&&d>0.)sp=p/d*R*pow(d/R,1.+fx2);}",   // bulge
    " if(finish==81){float k=2./fx2;vec2 P=p*k,ci=floor(P),f=fract(P)-.5;vec2 jo=(vec2(h(ci+.3),h(ci+5.1))-.5)*.4;float R=.2+.2*h(ci+2.);float dd=length(f-jo);if(h(ci+7.)<fx1&&dd<R){sp=(ci+.5+jo)/k+(f-jo)/k*(.4+.3*fx3);loc=dd/R+.001;}}",   // lens drops
    " if(finish==88){sp=p*(1.-fx1*.05*sin(TH*floor(fx2+.5)));}",   // breathe
    " if(finish==95){float pw=r.x/r.y*2./tpCount;float id=floor((p.x+r.x/r.y)/pw);float cx=-r.x/r.y+(id+.5)*pw;sp=vec2(p.x-cx,p.y)*(1.+fx2)+vec2((id-(tpCount-1.)*.5)*fx1*.5,0.);loc=abs(p.x-cx)/(pw*.5);}",   // panels: the look split across 2–6 panels
    " if(finish==99){vec2 q=p*fx1*.5;vec2 r2=vec2(1.,1.732);vec2 h1=mod(q,r2)-r2*.5,h2=mod(q-r2*.5,r2)-r2*.5;vec2 g=dot(h1,h1)<dot(h2,h2)?h1:h2;sp=(q-g)/(fx1*.5)+g/(fx1*.5)*(1.-fx2*.7);loc=max(abs(g.x),dot(abs(g),vec2(.5,.866)));}",   // hex glass
    " if(finish==105){sp.y+=sin(p.y*fx1*3.14159)*fx2*.04;loc=cos(p.y*fx1*3.14159);}",   // corrugated
    " if(finish==106){float d=length(p);loc=sin(d*fx1*6.-TH*floor(fx3+.5));sp+=p/(d+.001)*loc*fx2*.04;}",   // ripple rings
    " if(finish==107){float k=fx1*.5;vec2 P=p*k,i0=floor(P),f=fract(P);float d1=9.,d2=9.;vec2 bs=vec2(0.);for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 b=vec2(float(x),float(y));vec2 oo=b+vec2(h(i0+b+.9),h(i0+b+3.3))*.8+.1;float d=length(f-oo);if(d<d1){d2=d1;d1=d;bs=i0+b;}else if(d<d2)d2=d;}sp=p+(vec2(h(bs),h(bs+1.))-.5)*fx2*.15;loc=d2-d1;}",   // shatter
    " if(finish==108){float d=length(p),a=atan(p.y,p.x);sp=mix(p,vec2(cos(a),sin(a))*(1./(d+.15))*fx1*.5,fx2);}",   // fisheye
    " if(finish==109){sp.x+=sin(p.y*fx1*8.+TH*2.+n(p*3.+seed)*3.)*fx2*.015*mix(1.,smoothstep(1.,-1.,p.y),fx3);}",   // heat haze
    " if(finish==114){float a=TH*floor(fx1+.5)*(fx2>.5?-1.:1.);sp=mat2(cos(a),-sin(a),sin(a),cos(a))*p*(1.-fx3*.3);}",   // spin
    " if(finish==119){float k=fx1*.5;vec2 ci=floor(p*k),g=fract(p*k)-.5;sp=(ci+.5)/k;loc=rbox(g,vec2(.45-fx2*.15),fx3*.3+.02);}",   // pill mosaic
    " if(finish==120){sp=abs(p)+vec2(fx1,fx2)*.8+C(1.)*.1*fx3;}",   // quad mirror
    " if(finish==121){float k=fx1*.5;vec2 ci=floor(p*k),g=fract(p*k)-.5;sp=mix(p,(ci+.5)/k,fx2);loc=length(g);}",   // soft pixels
    " if(finish==124){float k=fx1*.5;vec2 ci=floor(p*k),g=fract(p*k)-.5;sp=(ci+.5)/k+g/k*(1.-fx2*.8);loc=max(abs(g.x),abs(g.y));}",   // square lenses
    " if(finish==125){vec2 q=p-vec2(0.,fx3);float d=length(q);loc=sin(d*fx1*8.-TH*2.)*exp(-d*1.2);sp+=q/(d+.001)*loc*fx2*.05;}",   // ripple drop
    " if(finish==127){sp+=(vec2(fbm(p*fx1+C(1.)*fx3+seed),fbm(p*fx1+C(1.)*fx3+seed+5.2))-.5)*fx2*.3;}",   // noise warp
    " if(finish==131){float k=fx1*.5;vec2 f=fract(p*k)-.5;sp+=vec2(sin(f.x*3.14159),sin(f.y*3.14159))*fx2*.2/k;loc=max(abs(f.x),abs(f.y));}",   // grid glass
    " if(finish==136){float k=fx1*.5;float f=fract(p.x*k+TH/6.28318*floor(fx3+.5))-.5;sp.x+=f*fx2*.5/k;loc=f;}",   // sliding reeds
    " if(finish==140){sp+=vec2(sin(p.y*4.+TH*2.+n(p*2.)*2.),cos(p.x*3.-TH*2.))*fx1*.02;}",   // under water
    " if(finish==155){sp+=vec2(sin(TH*7.)+sin(TH*13.)*.5,cos(TH*11.)+cos(TH*5.)*.5)*fx1*.006;}",   // gate weave
    " if(finish==158){float row=floor(p.y*fx1*.5);float dir=h(vec2(row,3.))>.5?1.:-1.;sp.x+=sin(TH*dir+h(vec2(row,1.))*6.28)*fx2*.4;loc=fract(p.y*fx1*.5);}",   // kinetic slices
    " if(finish==165){float n0=floor(fx1+.5)*2.;float sg=6.28318/n0;float a=mod(atan(p.y,p.x)-TH*floor(fx3+.5)/n0,sg);a=abs(a-sg*.5);sp=vec2(cos(a),sin(a))*length(p)*(1.+fx2);}",   // kaleidoscope
    " if(finish==166){float d=length(p);float A=atan(p.y,p.x)+d*fx2*3.;sp=vec2(cos(A),sin(A))*(fx1*.5/(d+.15));loc=d;}",   // tunnel warp
    " if(finish==167){float d=length(p);sp=p*(1.+(fx1-.5)*1.2*exp(-d*d/(.2+fx2*1.5)))+C(1.)*.05*fx3;}",   // lens pinch
    " if(finish==171){sp=vec2(sp.x/(1.+fx1*3.),sp.y*(1.+fx2*2.))+vec2(sin(TH)*fx3*.4,0.);}",   // stretch
    " if(finish==175){float col=floor(p.x*fx1*.5);sp.y+=sin(TH+col*fx2*1.5)*fx3*.25;loc=fract(p.x*fx1*.5);}",   // column wave
    " if(finish==176){float m=floor(fx1+.5);float l=log2(length(p)+1e-4);float t=fract(l-TH/6.28318*m);sp=normalize(p+1e-5)*exp2(t)*(.5+fx2);loc=t;}",   // infinite zoom
    " if(finish==179){float a=fx4*.0174533;vec2 ax=vec2(cos(a),sin(a));float u=dot(p,ax),kk=fx1*.5,am=fx2*.5/kk;for(int i=0;i<4;i++){if(float(i)>=fx3)break;float f=fract(u*kk)-.5;sp+=ax*f*am*(1.+float(i));if(i==0)loc=f;kk*=2.3;am*=.55;}}",
    " if(finish==180){vec2 q=p-vec2(fx4,-.15);float d=length(q),a=atan(q.y,q.x),rl=log(d+.08);float w=a/6.28318*fx1+sn(vec2(rl*2.,seed))*.4;float id=floor(w);float rr=rl*fx2*.5+h(vec2(id,seed))*.8;vec2 ii=vec2(id,floor(rr));sp+=(vec2(h(ii),h(ii+3.1))-.5)*fx3*.4;loc=min(min(fract(w),1.-fract(w))/(d*.5+.08),min(fract(rr),1.-fract(rr)));}",
    " if(finish==181){vec2 dq=fx5>45.?p:p.yx;float cl=floor(dq.x*fx1*.5);float r0=h(vec2(cl,seed));float gate=smoothstep(1.-fx3-.04,1.-fx3+.04,sn(vec2(cl*.05,seed)+C(1.)*.6)*.5+r0*.5);float yq=floor(dq.y*fx4)/fx4;float off=fx2*(.15+.85*r0*r0)*(.6+.4*sin(TH+r0*6.28));float ny=mix(dq.y,yq+off*.3,gate);if(fx5>45.)sp=vec2(p.x,ny);else sp=vec2(ny,p.y);loc=gate;}",
    " if(finish==182){float tq=floor(PH()*fx4);vec2 cl=floor(p*fx1*.5*vec2(.45,1.5)+h(vec2(tq,seed)));float on=step(1.-fx3,h(cl+tq*3.17));sp.x+=(h(cl+tq)-.5)*fx2*on;loc=on;}",
    " if(finish==183){vec2 cc=p/vec2(r.x/r.y,1.);float bd=dot(cc,cc);vec2 wq=p*(1.+bd*fx3*.16);sp=wq;vec2 ee=abs(wq/vec2(r.x/r.y,1.));loc=max(ee.x,ee.y);}",
    " if(finish==184){float k=fx1*.5;vec2 cl=floor(p*k),g=fract(p*k)-.5;sp=(cl+.5)/k;loc=length(g);}",
    " if(finish==185){float a=fx4*.0174533;vec2 u=mat2(cos(a),-sin(a),sin(a),cos(a))*p;float k=fx1*.5;float yy=u.y*k+PH()*fx5;float id=floor(yy);loc=fract(yy);vec2 qq=vec2(fx3>0.5?(floor(u.x*fx3*.5)+.5)/(fx3*.5):u.x,(id-PH()*fx5+.5)/k);sp=vec2(cos(a)*qq.x+sin(a)*qq.y,-sin(a)*qq.x+cos(a)*qq.y);}",
    " if(finish==191){float k=fx1*.5;vec2 cl=floor(p*k*vec2(.68,1.));sp=(cl+.5)/(k*vec2(.68,1.));}",
    " if(finish==193){loc=0.;}",
    " if(finish==196){float a=r.x/r.y;float k=fx1/(2.*a);float id=floor((p.x+a)*k);float f=fract((p.x+a)*k);float cx=(id+.5)/k-a;float r0=h(vec2(id,seed));float dr=mod(id,2.)<.5?1.:1.-2.*step(1.-fx3,1.);sp.x=cx+(f-.5)/k*(1.-fx2*.85)*dr;sp.y=p.y*(1.-fx2*.45*r0)+sin(TH+r0*6.28)*fx4*.4;loc=f;}",
    " if(finish==197){vec2 ee=vec2(.05,0.);vec2 pf=p*fx1;vec2 cc=C(1.)*fx3;float n0=fs(pf+cc,int(fx4)+1);vec2 gr=vec2(fs(pf+ee+cc,int(fx4)+1)-n0,fs(pf+ee.yx+cc,int(fx4)+1)-n0)/.05;sp+=gr*fx2*.22;loc=length(gr);}",
    " if(finish==200){if(p.y<fx4){sp.y=2.*fx4-p.y;sp.x+=sin(p.y*40.+TH*2.)*.01;loc=1.;}}",
    " if(finish==201){vec2 w=p;float yw=fx4+fx2;if(p.y<fx4){w.y=2.*fx4-p.y;}float pp=1.+w.x*fx1*.35;vec2 pl=vec2(w.x/pp,(w.y-yw)/pp);sp=pl/vec2(fx3,fx2);sp.x*=r.x/r.y;loc=max(abs(pl.x)/(fx3*r.x/r.y*.55),abs(pl.y)/fx2);}",
    " if(finish==202){float a=r.x/r.y;float nx=p.x/(a*fx3);float cv=sqrt(max(1.-nx*nx*.92,.02));float rs=1.+(1.-cv)*fx1*fx5*.55;float y0=p.y-.06;float yy=y0*rs;float ang=asin(clamp(nx*.96,-1.,1.))/1.2857;vec2 wq=vec2(mix(nx,ang,fx1)*a,yy/fx2);sp=wq;loc=max(abs(nx),abs(yy)/fx2);}",
    " if(finish==203){vec2 a0=vec2(r.x/r.y,1.);vec2 q=p/a0;float dm=max(max(abs(q.x),abs(q.y)),1e-3);float l=log2(dm)+PH()*fx3;float t=fract(l);float dp=clamp(-floor(log2(dm)),0.,fx1);float an=fx4*.6*sin(TH);vec2 s0=(p/dm)*pow(2.,t)*.5;sp=mat2(cos(an),-sin(an),sin(an),cos(an))*s0;loc=t+dp*2.;}",
    " if(finish==205){vec2 cc=C(1.)*fx5*.5;vec2 q=vec2(fbm(p*fx2+cc+seed),fbm(p*fx2-cc+seed+5.))-.5;vec2 w=vec2(fbm(p*fx2*2.1+q*2.+seed+9.),fbm(p*fx2*2.1-q*2.+seed+2.))-.5;sp+=(q+w*.6)*fx1*.7;loc=fbm(p*fx2+q*3.);}",
    " if(finish==209){float rw=floor((p.y+1.)*.5*fx1);float tq=floor(PH()*fx4*6.)/max(fx4*6.,1.);float off=(h(vec2(rw,tq*17.+seed))-.5)*fx3*.5;float wob=sin(rw*.32+TH)*.12*fx3;sp.x=p.x+off+wob;sp.y=mix(p.y,(rw+.5)/fx1*2.-1.,fx5);loc=p.x+off+wob;}",
    " float v=field(sp)*glow; float vv0=v;",
    " if(dyEcho>.001){float T0=LTH,D0=DTH,vm=v;for(int i=1;i<4;i++){float fi=float(i);LTH=T0-fi*.2*dyEcho;DTH=D0-fi*.2*dyEcho;vm=max(vm,field(sp)*glow*(1.-fi*.24));}LTH=T0;DTH=D0;v=vm;}",
    " float vvC=v;{float R0=dyRate*th;if(dyBreathe>.001)v*=1.+sin(R0)*dyBreathe*.65;if(dyFlick>.001)v*=1.+(sin(R0*7.)+sin(R0*13.)*.6+sin(R0*23.)*.35)*dyFlick*.2;if(dyBeat>.001){float ph=fract(R0/6.28318*2.);v*=1.+exp(-ph*7.)*smoothstep(0.,.02,ph)*dyBeat*1.4-dyBeat*.25;}if(dySweep>.001){float tt=fract(R0/6.28318);float u0=(uv.x*.8+uv.y*.35);float d0=u0-(tt*2.2-.55);v*=1.+exp(-d0*d0*30.)*dySweep*2.2;}if(dyPunch>.001){float vc=clamp(v,0.,1.5);v=mix(v,pow(vc,1.+dyPunch*2.2)*(1.+dyPunch*.7),1.);}}",

    " if(finish==10&&loc<0.)v=mix(v,(v+field(sp+vec2(.05,.03))*glow+field(sp-vec2(.04,.05))*glow)/3.,fx3)*(1.-fx3*.25);",
    " if(finish==14){float k=fx1*.5;vec2 P=p*k,i0=floor(P),f=fract(P);float d1=9.,d2=9.;vec2 bs=vec2(0.);",   // mosaic: square-ish tesserae
    "  for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 b=vec2(float(x),float(y));vec2 o=b+.5+(vec2(h(i0+b),h(i0+b+2.9))-.5)*fx3*.8;vec2 dd=abs(f-o);float d=max(dd.x,dd.y);if(d<d1){d2=d1;d1=d;bs=i0+o;}else if(d<d2)d2=d;}",
    "  v=field(bs/k)*glow*(.85+.3*h(bs*3.1));loc=d2-d1;}",
    " if(finish==15){vec2 e=vec2(.02*fx3,0.);float dx=field(sp+e)*glow-v,dy=field(sp+e.yx)*glow-v;float a=fx2*.0174533;",   // embossed relief
    "  vec3 nr=normalize(vec3(-dx*10.,-dy*10.,.04/(fx1+.05)));loc=dot(nr,normalize(vec3(cos(a),sin(a),.6)));}",
    " if(finish==18){float b=v;for(int i=0;i<4;i++){float a=float(i)*1.5708+.6;b+=field(sp+vec2(cos(a),sin(a))*fx1*.08)*glow;}v=mix(v,b/5.,.85);}",   // soft focus
    " if(finish==19){vec2 e=vec2(.015,0.);float dx=field(sp+e)*glow-v,dy=field(sp+e.yx)*glow-v;vec2 nr=vec2(dx,dy)*40.;loc=.5+.5*sin(nr.x*fx2+nr.y*fx2*.6+v*fx2);}",   // chrome: reflective banding
    " if(finish==26){float k=fx1*.5;vec2 rr=vec2(1.,1.732),hq=p*k;vec2 a=mod(hq,rr)-rr*.5,b=mod(hq-rr*.5,rr)-rr*.5;vec2 g=dot(a,a)<dot(b,b)?a:b;vec2 id=hq-g;",   // hex tiles
    "  v=field(id/k)*glow*(1.-fx3*.5*h(id));loc=.5-max(dot(abs(g),normalize(vec2(1.,1.732))),abs(g.x));}",
    " if(finish==30){float a=fx3*.0174533;float bd=step(.5,fract(dot(p,vec2(cos(a),sin(a)))*fx1*.25));loc=bd;if(bd>.5){vec2 fq=gl_FragCoord.xy*(540./r.y)/3.;",   // frosted stripes
    "  vec2 jo=(vec2(h(floor(fq)),h(floor(fq)+5.7))-.5)*fx2*.2;v=(v+field(sp+jo)*glow+field(sp-jo.yx)*glow)/3.*(1.-fx2*.15);}}",
    " if(finish==32&&loc<0.)v*=.95;",
    " if(finish==37){vec2 e=vec2(.012,0.);float dx=field(sp+e)*glow-v,dy=field(sp+e.yx)*glow-v;loc=length(vec2(dx,dy))*30.;}",   // glow edges
    " if(finish==5){vec2 fc=gl_FragCoord.xy*(540./r.y)/(fx2*2.);vec2 jo=(vec2(h(floor(fc)),h(floor(fc)+5.7))-.5)*fx1*.2;float va=field(sp+jo)*glow,vb=field(sp-jo.yx)*glow;loc=abs(va-vb);v=(v+va+vb)/3.;}",   // frosted: jittered samples diffuse the light
    " if(finish==8){float k=fx1*.5;vec2 P=p*k,i0=floor(P),f=fract(P);float d1=9.,d2=9.;vec2 bs=vec2(0.);",   // stained glass: voronoi panes, flat color per pane, dark leading
    "  for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 b=vec2(float(x),float(y));vec2 o=vec2(h(i0+b),h(i0+b+11.3))*.8+.1;float d=length(b+o-f);if(d<d1){d2=d1;d1=d;bs=i0+b+o;}else if(d<d2)d2=d;}",
    "  v=mix(field(bs/k)*glow,v,.25)*(.75+.5*fx3*(1.-smoothstep(0.,.7,d1)));loc=d2-d1;}",
    " if(finish==3){float k=tlCount*.5;vec2 cell=floor(p*k),g=fract(p*k);float e=tlGap*.5,s=.04+.02*tlGap;",
    "  float m=smoothstep(e,e+s,g.x)*smoothstep(1.-e,1.-e-s,g.x)*smoothstep(e,e+s,g.y)*smoothstep(1.-e,1.-e-s,g.y);",
    "  v=field((cell+.5)/k)*glow*m*(1.-tlVary*.6*h(cell+3.1));}",
    " if(finish==1&&reedShape>1.5&&reedShape<2.5){float sh=smoothstep(-.5,.45,loc);v=mix(v,.03+.97*pow(sh,2.4)*(.75+.35*v),clamp(refract*2.4,0.,1.));}",   // radial: each band is a lit glass tube
    " vec3 c=ramp(v);",
    " if(finish==2){float a=htAngle;vec2 g=fract(mat2(cos(a),-sin(a),sin(a),cos(a))*gl_FragCoord.xy*(540./r.y)/htSize)-.5;float dots=smoothstep(.06,-.06,length(g)-sqrt(clamp(v,0.,1.))*.55*htFill);c=c0+(c-c0)*(.25+.75*dots);}",
    " if(finish==4)c*=1.-slStrength*.5+slStrength*.5*sin(uv.y*slDensity*3.14159+th*slRoll);",   // whole rolls per loop: seamless
    " if(finish==1&&(reedShape<1.5||reedShape>2.5)){float e=(loc+.44)/.04;c+=exp(-e*e)*.06*(.5+refract*4.);}",
    " if(finish==1&&reedShape>1.5&&reedShape<2.5){float e=(loc-.465)/.035;c+=exp(-e*e)*(.04+refract*.3)*(.3+c);}",
    " if(finish==5){vec2 fq=gl_FragCoord.xy*(540./r.y);c+=(h(floor(fq/max(fx2,.5)))-.5)*.05*fx1;c+=c3*smoothstep(.03,.2,loc)*fx3*.35;}",
    " if(finish==6){float e=smoothstep(.5-fx2*.2-.01,.5,loc);c*=1.-e*.55;c+=vec3(.07)*fx2*smoothstep(.43,.47,loc)*(1.-smoothstep(.47,.5,loc));}",
    " if(finish==8){float lw=.02+fx2*.1;c=mix(c,c0*.25,1.-smoothstep(lw,lw+.03,loc));}",
    " if(finish==9){c*=.8+.35*(1.-smoothstep(.2,.55,loc));c+=c3*fx3*.12*exp(-pow((loc-.12)/.05,2.));}",
    " if(finish==10&&loc>=0.){c*=1.25;c=mix(c,c*.3,smoothstep(.75,1.,loc));c+=vec3(.1)*exp(-pow((loc-.6)/.1,2.))*.6;}",
    " if(finish==11){float e=(loc+.44)/.04;c+=exp(-e*e)*.06*(.5+fx2*4.);}",
    " if(finish==12){float a=fx3*.0174533;float sl=fract(dot(p,vec2(-sin(a),cos(a)))*fx1*.5);float m=smoothstep(fx2+.03,fx2-.03,sl);c=c*(.12+.88*m)+ramp(v*.4)*(1.-m)*.25;}",   // venetian blinds
    " if(finish==13){float a=fx2*.0174533;float sp2=1080./fx1;float u=dot(gl_FragCoord.xy*(540./r.y),vec2(cos(a),sin(a)))/sp2*2.;float l=abs(fract(u)-.5)*2.;",   // engraving: line weight follows the light
    "  float t=clamp(v,0.,1.)*.95;c=mix(c0,ramp(v)*(1.+fx3*.4),smoothstep(t+.12,t-.12,l));}",
    " if(finish==14){float gw=.02+fx2*.12;c=mix(c,c0*.3,1.-smoothstep(gw,gw+.02,loc));}",
    " if(finish==15)c*=.25+1.3*clamp(loc,0.,1.);",
    " if(finish==16){float q=floor(v*5.)/5.;float vq=mix(v,q+.2*smoothstep(0.,.2,v-q),fx1);float ed=1.-smoothstep(0.,.03,abs(fract(v*5.)-.02));",   // ink wash
    "  vec2 fq=gl_FragCoord.xy*(540./r.y);c=ramp(vq)*(1.-fx3*.35*ed)*(1.+((n(fq*.35)-.5)*.12+(fbm(fq*.008)-.5)*.18)*fx2);}",
    " if(finish==18){float bn=3.+(1.-fx2)*5.;vec2 bp=p*bn,bi=floor(bp),bf=fract(bp)-.5;c+=c*fx3*smoothstep(.3,1.,v)*.7;",
    "  c+=c3*smoothstep(.35,.3,length(bf+(vec2(h(bi),h(bi+2.))-.5)*.3))*smoothstep(.3,.9,field((bi+.5)/bn)*glow)*h(bi+9.)*fx2*.45;}",
    " if(finish==19){float m=smoothstep(.5-.5*fx3,.5+.5*fx3,loc);c=ramp(.15+.85*m)*(.55+.45*clamp(v,0.,1.))+c3*pow(m,12.)*fx1*.6;}",
    " if(finish==20){float a=fx2*.0174533;vec2 u=mat2(cos(a),-sin(a),sin(a),cos(a))*(gl_FragCoord.xy*(540./r.y));float st=n(vec2(u.x*.02,u.y*1.5))*.6+n(vec2(u.x*.05,u.y*4.))*.4;",   // brushed metal
    "  c*=1.-fx1*.25+fx1*.5*st;c+=c3*fx3*.15*pow(.5+.5*sin(u.x*.004+v*3.),6.);}",
    " if(finish==21){float k=fx1*.5;vec2 P=p*k,i0=floor(P),f=fract(P);float d1=9.;vec2 dv=vec2(0.);for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 b=vec2(float(x),float(y));",   // hammered metal
    "  vec2 o=b+vec2(h(i0+b),h(i0+b+4.7))*.8+.1;float d=length(f-o);if(d<d1){d1=d;dv=f-o;}}float lt=dot(normalize(vec3(-dv*fx2*3.,1.)),normalize(vec3(-.5,.6,.6)));",
    "  c*=.5+.7*lt;c+=c3*pow(max(lt,0.),20.)*fx3*.35;}",
    " if(finish==22){float k=fx1*.5;vec2 P=p*k,i0=floor(P),f=fract(P);float d1=9.,d2=9.;vec2 bs=vec2(0.);for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 b=vec2(float(x),float(y));",   // gold leaf
    "  vec2 o=b+vec2(h(i0+b),h(i0+b+2.9))*.8+.1;float d=length(f-o);if(d<d2){if(d<d1){d2=d1;d1=d;bs=i0+o;}else d2=d;}}",
    "  c=mix(c,c*vec3(1.15,.95,.55)+vec3(.08,.05,0.)*v,fx2*.6)*(.85+.3*h(bs));c=mix(c,c0*.3,(1.-smoothstep(.0,.04,d2-d1))*fx3);}",
    " if(finish==23){float t=fbm(p*fx2*2.+v*2.+seed);vec3 pl=mix(c2,c3,.5+.5*sin(t*6.+v*4.));c=mix(c,c*.6+pl*.5*clamp(v,0.,1.)*(1.-fx3*.4),fx1*.7);}",   // pearl
    " if(finish==24)c+=c3*pow(.5+.5*sin(p.y*fx1*6.+TH*floor(fx3)*2.+n(p*3.)*3.),12.)*fx2*.12*clamp(v,0.,1.);",
    " if(finish==25)c+=c3*smoothstep(.04,.0,loc)*fx3*.18;",
    " if(finish==26)c=mix(c,c0*.35,1.-smoothstep(fx2*.12,fx2*.12+.03,loc));",
    " if(finish==27){float lk=exp(-length((uv-vec2(fx3,1.)+C(1.)*.08)*vec2(1.2,2.))*2.);c+=mix(c3,vec3(1.,.55,.25),fx2)*lk*fx1*.6;}",   // light leak
    " if(finish==28){float d=mix(length(p),max(abs(p.x)/1.6,abs(p.y)),fx3);float m=smoothstep(fx1,fx1-.05-fx2*.6,d);float ia=irAngle*.0174533;vec3 bg=mix(ir1,ir2,clamp(dot(uv-.5,vec2(cos(ia),sin(ia)))+.5,0.,1.));c=c*m+bg*irFill*(1.-m);}",   // iris: the surround is black, or a color / gradient (irFill)
    " if(finish==29){vec2 fq=gl_FragCoord.xy*(540./r.y)/fx2;float w=.5+.25*(sin(fq.x*3.14159)+sin(fq.y*3.14159));c*=1.+(w-.5)*.25*fx1+(n(fq*.5)-.5)*.1*fx1;c=mix(c,floor(c*8.)/8.,fx3*.5);}",   // canvas
    " if(finish==30&&loc>.5){vec2 fq=gl_FragCoord.xy*(540./r.y);c+=(h(floor(fq/1.5))-.5)*.04*fx2;}",
    " if(finish==31||finish==38){float e=(loc+.44)/.04;c+=exp(-e*e)*.06*(.5+fx2*4.);}",
    " if(finish==32&&loc>=0.){c*=1.12;c+=c3*exp(-pow((loc-.85)/.08,2.))*fx3*.35+vec3(.2)*exp(-pow((loc-.4)/.06,2.))*fx3*.1;}",
    " if(finish==33){float l=abs(fract(length(p-vec2(fx3,0.))*fx1*.5)-.5);c*=1.-fx2*.35*smoothstep(.12,.0,l);c+=c3*.05*fx2*smoothstep(.16,.06,abs(l-.18));}",   // etched rings
    " if(finish==34){float l=abs(fract(v*fx1+.5)-.5)*2.;float w=(1.-clamp(v,0.,1.))*fx2;c=mix(ramp(v)*1.1,c0*.2,step(l,w*.6)*fx3);}",   // woodcut
    " if(finish==35){vec2 cl=floor(gl_FragCoord.xy*(540./r.y)/fx1);c=mix(c0,mix(ramp(v),c3,fx3),step(h(cl),clamp(v*fx2,0.,1.)));}",   // stipple
    " if(finish==36){float v2=pow(clamp(v,0.,1.),.5+fx3);float q=floor(v2*fx1)/fx1;c=mix(c0,c3,mix(q,v2,fx2*.6));}",   // duotone
    " if(finish==37)c=ramp(v)*fx3+c3*smoothstep(.0,.3+fx1,loc)*fx2*.6+c2*smoothstep(.0,.6+fx1,loc)*fx2*.25;",
    " if(finish==39&&fx3>0.)c*=1.-fx3*.85*smoothstep(.5-fx3*.15-.01,.5-fx3*.15+.01,loc);",
    " if(finish==40){vec2 d=vec2(cos(fx2*.0174533),sin(fx2*.0174533))*fx1*.05;float vr=field(sp+d)*glow,vb=field(sp-d)*glow;c=vec3(ramp(vr).r,c.g,ramp(vb).b)+c3*abs(vr-vb)*fx3*.4;}",   // spectral split
    " if(finish==41){vec2 fq=gl_FragCoord.xy*(540./r.y)/fx1;vec2 ci=floor(fq),f=fract(fq);float ov=mod(ci.x+ci.y,2.);float t=mix(sin(f.y*3.14159),sin(f.x*3.14159),ov);",   // linen: weave
    "  c*=1.-fx2*.3+fx2*.35*t+(n(fq*vec2(.3,.05))-.5)*fx2*.12;c*=1.+loc*fx3*.18;}",
    " if(finish==42){float k=fx1*.5;vec2 P=p*k,i0=floor(P),f=fract(P);float d1=9.,d2=9.;for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 b=vec2(float(x),float(y));",   // frost crack
    "  vec2 o=b+vec2(h(i0+b+.7),h(i0+b+6.1))*.8+.1;float d=length(f-o);if(d<d1){d2=d1;d1=d;}else if(d<d2)d2=d;}float ck=smoothstep(.035,0.,d2-d1);",
    "  c+=c3*ck*fx3*.35*(.4+.6*n(p*9.));float fr=fbm(p*5.+seed)*smoothstep(.4,1.4,length(p));c=mix(c,mix(c,c3,.3)*1.1,fr*fx2*.5);}",
    " if(finish==43){float sk=0.;for(int i=0;i<3;i++){float fi=float(i);float xo=(fi+1.)*fx1*.14;sk+=(max(field(sp+vec2(xo,0.))*glow-.5,0.)+max(field(sp-vec2(xo,0.))*glow-.5,0.))*(1.-fi*.28);}",   // lens streak
    "  c+=mix(c3,vec3(.55,.75,1.),fx3)*sk*fx2*.45+mix(c3,vec3(.55,.75,1.),fx3)*max(v-.6,0.)*fx2*.3;}",
    " if(finish==44&&fx3>0.)c*=1.-fx3*.8*(1.-smoothstep(0.,.07,min(loc,1.-loc)));",
    " if(finish==45){c*=1.+(loc>.9?.12:loc>.4?.05:0.);c+=c3*fx3*.12*step(.9,loc)*smoothstep(.1,.25,v);}",
    " if(finish==46){float fi=floor(TH*4.);vec2 fq=gl_FragCoord.xy*(540./r.y);c*=1.+(h(vec2(fi,seed))-.5)*fx1*.18;",   // old film: flicker, scratches, dust
    "  for(int i=0;i<2;i++){float sx=h(vec2(fi,float(i)*7.+1.));c+=c3*.08*fx2*exp(-pow((uv.x-sx)*r.x*.6,2.))*step(h(vec2(fi,float(i)+3.)),.5);}",
    "  float ds=h(floor(fq/2.)+fi*13.1);c=mix(c,c0,step(.9985,ds)*fx2*.8);c=mix(c,vec3(dot(c,vec3(.3,.59,.11)))*vec3(1.06,.97,.82),fx3);}",
    " if(finish==47){vec2 fq=gl_FragCoord.xy*(540./r.y);c*=1.-fx2*.25*((n(fq*.6)*.6+fbm(fq*.05)*.4)-.5)*2.;float ed=abs(fract(v*3.)-.5);c*=1.-fx3*.3*smoothstep(.42,.5,ed);}",   // watercolor
    " if(finish==48){float k=fx1*.5;vec2 P=p*k+C(1.)*.25,ci=floor(P),f=fract(P)-.5;vec2 jo=(vec2(h(ci+.5),h(ci+3.7))-.5)*.4;float R=.18+.22*h(ci+1.9)*fx3*2.;float dd=length(f-jo);",   // bokeh
    "  float ds=smoothstep(R,R-.03,dd)*(.6+.4*smoothstep(R-.08,R,dd));c+=mix(c2,c3,h(ci+9.))*ds*step(h(ci+3.),.45)*fx2*.35*(.3+.7*clamp(v,0.,1.));}",
    " if(finish==49){vec3 hz=mix(c1,c3,fx2)*.55;float dp=mix(1.,smoothstep(1.6,0.,length(p)),fx3);c=mix(c,hz,fx1*.6*dp*(1.-clamp(v,0.,1.)*.5));}",   // haze field
    " if(finish==50){float e=(v-fx1)/(.01+fx2*.06);c+=c3*exp(-e*e)*fx3*.8;}",   // knife edge: a fine line of light where the look crosses a level
    " if(finish==51){vec2 q=p+vec2(0.,(fx2-fx1)*.5);float d=q.y>0.?length(q)-fx1:rbox(q-vec2(0.,-fx2*.5),vec2(fx1,fx2*.5),0.);",   // doorway: the look through an arched opening
    "  c=mix(c0*.5+c2*.5*exp(-max(d,0.)*3.)*fx3,c,smoothstep(.006,-.006,d));}",
    " if(finish==52){float ph=TH/6.28318*floor(fx3+.5);vec3 ws=ramp(abs(fract(clamp(v,0.,1.)*.5+ph+uv.y*.2*fx2)-.5)*2.);c=mix(c,ws*(.4+.6*clamp(v*1.5,0.,1.)),fx1*.6);}",   // color wash: slow color drift
    " if(finish==53){vec2 e2=abs(uv-.5)*2.;float cl=pow(smoothstep(1.-fx2*.8-.05,1.,max(e2.x,e2.y)),2.)*(.6+.4*e2.x*e2.y);c+=mix(c2,c3,fx3)*cl*fx1*.7;}",   // corner light
    " if(finish==54){float y=uv.y-fx1;c=mix(mix(c1*.6,c2*.8,step(0.,y)),c,fx2)+c3*exp(-abs(y)*r.y/(4.+fx3*40.))*fx3*.7;}",   // horizon split
    " if(finish==55){float vd=0.;for(int i=0;i<4;i++){float a=float(i)*1.5708+.4;vd+=field(sp+vec2(cos(a),sin(a))*fx1*.25)*glow;}vd=(vd*.25+v)*.5;c=ramp(mix(mix(v,vd,fx2),.5,fx3*.3));}",   // diffuse
    " if(finish==56&&loc>.5){float dd=(-1.+fx1)-p.y;c*=exp(-dd*(1.+fx2*4.))*.7;}",
    " if(finish==57){float x=uv.x-fx1;c*=x<0.?mix(vec3(1.),c1*2.,fx3*.5):mix(vec3(1.),c3,fx3*.5);c+=c3*exp(-abs(x)*r.x/(3.+fx2*30.))*.8;}",   // light seam
    " if(finish==58){float a=fx2*.0174533;float t=clamp(dot(uv-.5,vec2(sin(a),cos(a)))+.5,0.,1.);vec3 g=mix(c1,c3,t);c=mix(c,c+g*.35,fx1)*(1.-fx3*.3)+g*fx3*.12;}",   // sky gradient
    " if(finish==59){float t=(loc-.25)/.05;c*=.8+.35*cos(loc*3.14159);c+=c3*exp(-t*t)*fx3*.25;}",
    " if(finish==60){c*=.85+.3*loc;c+=c3*smoothstep(.95,1.,loc)*fx3*.3;}",
    " if(finish==61){c*=1.-fx3*.3*loc;}",
    " if(finish==62){float R=.48-fx2*.2;c=mix(c0*.5,c,smoothstep(R,R-.02-fx3*.1,loc));}",
    " if(finish==66){float l=abs(fract(v*fx1)-.5);c=mix(c*(1.-fx3*.6),c+c3*.4,smoothstep(.04+fx2*.08,0.,l)*(.3+.7*clamp(v,0.,1.)));}",   // contour lines
    " if(finish==67){float q=floor(clamp(v,0.,1.)*fx1)/fx1;c=mix(c,ramp(q+.5/fx1),fx2);c*=1.-fx3*.15*fract(v*fx1);}",   // banding
    " if(finish==68){vec2 fq=gl_FragCoord.xy*(540./r.y);c*=1.+(h(floor(fq/max(fx2*3.,.5)))-.5)*fx3*.25;c+=c3*step(1.-fx1*.04,h(floor(fq)+floor(TH*4.)))*clamp(v,0.,1.)*.8;}",   // glint sand
    " if(finish==69){float d=rbox(p,vec2(r.x/r.y,1.)*(1.-fx1*.3),fx2*.4);c=mix(c,c0*.3,smoothstep(-.004,.004,d))+c3*exp(-abs(d)*(80.-fx3*70.))*fx3*.4;}",   // rounded frame
    " if(finish==70){vec2 q=p-vec2(fx3*2.-1.,1.3);float a=atan(q.x,-q.y);float ry=smoothstep(.4,.9,fbm(vec2(a*fx1*4.,length(q)*.3)+seed+C(1.)*.3))*exp(-length(q)*.5);c+=mix(c2,c3,.6)*ry*fx2*.6;}",   // god rays
    " if(finish==71){float a=-.35;vec2 q=mat2(cos(a),-sin(a),sin(a),cos(a))*(p+vec2(.3,0.))*fx1*.5;q.x+=q.y*.35;vec2 g=abs(fract(q)-.5);c*=mix(1.,.35+.65*smoothstep(.02+fx2*.04,.05+fx2*.05,min(g.x,g.y)),fx3);}",   // window shadow
    " if(finish==72){vec2 q=p*fx1+C(1.)*.3;float cs=0.;for(int i=0;i<3;i++){float fi=float(i);q=vec2(q.x+sin(q.y+TH+fi),q.y+cos(q.x-TH+fi*1.3));cs+=pow(abs(sin(q.x+q.y)),8.);}c+=mix(c2,c3,.7)*cs*fx2*.15*mix(1.,clamp(v,0.,1.)*1.5,fx3);}",   // caustics
    " if(finish==73){float m=fbm(p*vec2(.8,1.6)*fx1+C(1.)*.4+seed);c=mix(c,mix(c1,c3,.5)*.6,smoothstep(.4,.9,m)*fx2*mix(1.,smoothstep(.6,-1.,p.y),fx3));}",   // mist
    " if(finish==74){float y=fx3>.5?1.-uv.y:uv.y;c*=1.-fx2*smoothstep(fx1,0.,y);}",   // lyric fade
    " if(finish==75){c*=1.-fx2*smoothstep(fx1,fx1*.3,abs(uv.y-fx3));}",   // text safe
    " if(finish==76){float l=dot(c,vec3(.3,.59,.11));c=mix(c,vec3(l),fx2*.5);c=c*(1.-fx1*.4)+mix(c2,c3,.5)*fx1*.3+fx3*.06;}",   // pastel
    " if(finish==77){float v2=field(sp+vec2(fx1*.02,-fx1*.015))*glow;c=mix(c,vec3(ramp(v).r,ramp(v2).g,c.b),.7)*(1.-fx2*.2*h(floor(gl_FragCoord.xy*(540./r.y))))+fx3*.04;}",   // riso
    " if(finish==78){float mx=v;for(int i=1;i<5;i++){mx=max(mx,field(sp+vec2(0.,float(i)*fx1*.06))*glow*(1.-float(i)*.15*fx2));}c=mix(c,ramp(mx),fx3);}",   // melt
    " if(finish==79){float bl=smoothstep(fx2*.3,fx2*.3+.3,abs(uv.y-fx1));if(bl>.01){float vb=0.;for(int i=0;i<4;i++){float a=float(i)*1.5708+.3;vb+=field(sp+vec2(cos(a),sin(a))*bl*fx3*.15)*glow;}c=ramp(mix(v,vb*.25,bl));}}",   // tilt shift
    " if(finish==80){vec2 ci=floor(gl_FragCoord.xy*(540./r.y)/(1.+fx2*2.));c+=c3*step(1.-fx1*.01,h(ci+seed))*(.5+.5*sin(TH*3.+h(ci)*6.28))*(1.-clamp(v*1.5,0.,1.))*(.5+fx3);}",   // star dust
    " if(finish==81){if(loc>0.){float t=(loc-.85)/.06;c*=1.+.15*(1.-loc);c+=c3*exp(-t*t)*.15;}}",
    " if(finish==82){float d=rbox(p,vec2(fx1*1.6,fx2),.004);c=mix(c0*.5+c2*.4*exp(-max(d,0.)*3.)*fx3,c,smoothstep(.004,-.004,d));}",   // window mask
    " if(finish==83){float l=dot(c,vec3(.3,.59,.11));c=mix(c,mix(c1,c3,smoothstep(.1,.7,l))*l*2.2,fx1*.5)*(1.+fx2*.2)+(fx3-.5)*.05;}",   // split tone
    " if(finish==84){float w=.01+fx3*.06;float cr=min(rbox(p-vec2(0.,-fx1*.12),vec2(w,fx1),0.),rbox(p-vec2(0.,fx1*.38),vec2(fx1*.62,w),0.));c+=mix(c2,c3,.7)*exp(-max(cr,0.)/(.03+.2*fx2))*fx2*.6*(.92+.08*cos(TH));}",   // cross light
    " if(finish==85){float d=abs(length(p-vec2(0.,fx3))-fx1);c+=c3*exp(-d/(.01+fx2*.08))*fx2*.6*(.92+.08*cos(TH));}",   // halo overlay
    " if(finish==86){float fg=fbm(vec2(p.x*1.2,p.y*3.)+C(1.)*.4+seed);float top=-1.+fx1;c=mix(c,mix(c1,c3,fx3)*(.5+.5*fg)*.8,smoothstep(top,top-.5,p.y)*fx2*(.4+.6*fg));}",   // fog floor
    " if(finish==87){float bm=0.;for(int i=0;i<2;i++){float fi=float(i),s2=fi*2.-1.;vec2 q=p-vec2(s2*r.x/r.y*.8,1.05);float t0=-1.5708-s2*(.35+fx3*.4)+.08*sin(TH+fi);float al=dot(q,vec2(cos(t0),sin(t0))),pd=dot(q,vec2(-sin(t0),cos(t0)));float w=(.02+fx1*.12)*max(al,0.)+.02;bm+=exp(-pd*pd/(w*w))*step(0.,al)*exp(-al*.3);}c+=mix(c2,c3,.6)*bm*fx2*.5;}",   // stage beams
    " if(finish==88){c*=1.+fx3*.15*sin(TH*floor(fx2+.5));}",
    " if(finish==89){vec2 g=abs(fract(uv*vec2(r.x/r.y,1.)*fx1)-.5);c*=1.-fx2*.7*smoothstep(.5-fx3*.02-.002,.5,max(g.x,g.y));}",   // cabinet seams
    " if(finish==90){float a=fx3*.0174533;float e=(dot(uv-.5,vec2(cos(a),sin(a)))-(fract(TH/6.28318)-.5)*1.6)/(.01+fx1*.08);c+=c3*exp(-e*e)*fx2*.7;}",   // scan sweep
    " if(finish==91){float l=abs(fract(uv.y*fx1+TH/6.28318*2.)-.5);c+=mix(c2,c3,.6)*smoothstep(.005+fx3*.03,0.,l)*fx2*.6*(.5+.5*sin(uv.x*6.+TH));}",   // laser lines
    " if(finish==92){float d=fx3-uv.y;if(d>0.){float gx=abs(fract((uv.x-.5)/d*fx1*.3)-.5),gz=abs(fract(fx1*.15/d-TH/6.28318)-.5);c+=mix(c2,c3,.5)*smoothstep(.04,0.,min(gx,gz))*smoothstep(0.,.3,d)*fx2*.5;}}",   // grid horizon
    " if(finish==93){vec2 ci=floor(gl_FragCoord.xy*(540./r.y)/(1.+fx2*2.));c+=c3*step(1.-fx1*.03,h(ci+seed+1.))*pow(.5+.5*sin(TH*3.+h(ci)*6.28),8.)*clamp(v*1.5,0.,1.)*(.6+fx3);}",   // glitter overlay
    " if(finish==94){vec2 dr=vec2(cos(fx3*.0174533),sin(fx3*.0174533))*fx1;float e1=field(sp+dr*.08)*glow,e2=field(sp+dr*.16)*glow;c=max(c,max(ramp(e1)*fx2*.6,ramp(e2)*fx2*.3));}",   // echo trail
    " if(finish==95){c*=1.-smoothstep(1.-fx3*.06-.005,1.,loc)*.9;}",
    " if(finish==96){float d=abs(length(p)-fx1)-fx2*.5;c=mix(c,c0*.4,smoothstep(-.005-fx3*.1,.005,d));}",   // ring mask
    " if(finish==97){float l=abs(fract(gl_FragCoord.y*(540./r.y)/fx1)-.5)*2.;float t=clamp(v,0.,1.);c=mix(c,mix(c0,c*(1.+fx3*.3),smoothstep(t+.1,t-.1,l)),fx2);}",   // line screen
    " if(finish==98){c*=mix(1.,smoothstep(0.,fx1*.5,min(uv.x,1.-uv.x)),fx2)*mix(1.,smoothstep(0.,fx1*.5,min(uv.y,1.-uv.y)),fx3);}",   // wing fade
    " if(finish==99){c*=1.-smoothstep(.44-fx3*.04,.5,loc)*.5;c+=c3*smoothstep(.4,.46,loc)*(1.-smoothstep(.46,.5,loc))*fx3*.2;}",
    " if(finish==100){vec2 q=p*fx2*3.+1.7;vec2 ci=floor(q),f=fract(q)-.5;float st=(exp(-abs(f.x)*80.)*exp(-abs(f.y)*6.)+exp(-abs(f.y)*80.)*exp(-abs(f.x)*6.))*step(h(ci+seed),.25)*(.6+.4*sin(TH*2.+h(ci)*6.28));c+=c3*st*fx1*clamp(v,0.,1.)*1.2*(.5+fx3);}",   // star glints
    " if(finish==101){vec2 q=p*fx1+C(1.)*.5;float sm=fbm(q+fbm(q*1.5+C(2.)*.3+seed)*2.);c=mix(c,c+mix(c1,c3,.5)*.5,smoothstep(.5,.85,sm)*fx2)*(1.-fx3*.2*sm);}",   // smoke
    " if(finish==102){float e=(dot(uv-.5,vec2(cos(.7),sin(.7)))-(fract(TH/6.28318*floor(fx3+.5))*2.-1.)*(.8+(.05+fx1*.3)*2.5))/(.05+fx1*.3);c*=1.+exp(-e*e)*fx2*.8;}",   // light wipe
    " if(finish==103){vec2 g=abs(fract(p*fx1*.5)-.5);c+=c3*smoothstep(.01+fx3*.02,0.,min(g.x,g.y))*fx2*.2;}",   // blueprint grid
    " if(finish==104){vec2 g=fract(gl_FragCoord.xy*(540./r.y)/fx1)-.5;c*=mix(1.,smoothstep(.5,.2-fx3*.2,length(g))*1.2,fx2);}",   // soft dots
    " if(finish==105){c*=1.+loc*fx3*.25;}",
    " if(finish==106){c*=1.+loc*fx2*.12;}",
    " if(finish==107){c*=1.-smoothstep(.04,0.,loc)*fx3*.7;c+=c3*smoothstep(.02,0.,loc)*fx3*.15;}",
    " if(finish==108){c*=mix(1.,smoothstep(0.,.5,length(p)),fx3);}",
    " if(finish==110){float e=pow(length(uv-.5)*1.4,2.+(1.-fx2)*3.);c=mix(c,mix(c1,c3,fx3)*.8,clamp(e*fx1*1.5,0.,1.));}",   // color vignette
    " if(finish==111){vec2 sc=vec2(sin(TH)*fx3*.8*r.x/r.y,cos(TH)*fx3*.3);float d=length(p-sc);c*=mix(1.,.08+.92*exp(-d*d/(fx1*fx1+.01)),fx2);}",   // spotlight
    " if(finish==112){float b=fx1*.25,y=min(uv.y,1.-uv.y),xb=fx3*.25,x=min(uv.x,1.-uv.x);c=mix(c0*.3,c,smoothstep(b-.002,b+.002,y)*smoothstep(xb-.002,xb+.002,x))+c3*exp(-abs(y-b)*r.y/(2.+fx2*20.))*fx2*.4*step(.001,b);}",   // letterbox
    " if(finish==113){c*=1.+pow(.5+.5*cos(TH*floor(fx2+.5)),2.+fx3*6.)*fx1*.6;}",   // pulse glow
    " if(finish==115){float a=fx3*.0174533;c*=1.-fx2*.5+fx2*.5*smoothstep(-.3,.3,sin(dot(p,vec2(cos(a),sin(a)))*fx1*3.14159+TH));}",   // light stripes
    " if(finish==116){float st=h(floor(gl_FragCoord.xy*(540./r.y)/(1.+fx2*3.))+floor(TH*12.)*7.1);c=mix(c,c*(.7+.6*st),fx1*.5)+(st-.5)*fx3*.05;}",   // soft static
    " if(finish==117){float d=abs(rbox(p,vec2(r.x/r.y,1.)*(1.-fx1*.25),.02));c+=mix(c2,c3,.6)*exp(-d/(.004+fx2*.05))*fx3*.8*(.9+.1*cos(TH));}",   // glow frame
    " if(finish==118){float bl=smoothstep(fx2*.6,fx2*.6+.6,length(p));if(bl>.01){float vb=0.;for(int i=0;i<4;i++){float a=float(i)*1.5708+.6;vb+=field(sp+vec2(cos(a),sin(a))*bl*fx1*.15)*glow;}c=ramp(mix(v,vb*.25,bl))*(1.-fx3*.4*bl);}}",   // depth blur
    " if(finish==119){c=mix(c0*.4,c,smoothstep(.01,-.01,loc));}",
    " if(finish==121){c*=1.-fx3*.5*smoothstep(.3,.7,loc);}",
    " if(finish==122){vec2 fq=gl_FragCoord.xy*(540./r.y)/fx1;float a=fx2*.0174533;float l1=abs(fract(dot(fq,vec2(cos(a),sin(a))))-.5),l2=abs(fract(dot(fq,vec2(-sin(a),cos(a))))-.5);float t=clamp(v,0.,1.);c=mix(c,c0,max(step(l1,.5-t*.5)*step(t,.85),step(l2,.4-t*.5)*step(t,.5))*fx3*.8);}",   // crosshatch
    " if(finish==123){float u=abs(fract(clamp(v,0.,1.)*.5+fx2*.5)-.5)*2.;c=mix(c,ramp(pow(u,1.+fx3)),fx1);}",   // palette shift
    " if(finish==124){c*=1.-smoothstep(.42,.5,loc)*fx3*.6;c+=c3*smoothstep(.44,.48,loc)*(1.-smoothstep(.48,.5,loc))*fx3*.15;}",
    " if(finish==125){c*=1.+loc*fx2*.15;}",
    " if(finish==126){float f=fract(uv.x*fx1);float op=fx2*(1.-fx3*.5+fx3*.5*sin(TH));c*=mix(1.,.08,smoothstep(op*.5,op*.5+.02,abs(f-.5)));}",   // shutter
    " if(finish==128){float d=length(p)/fx1;c+=mix(c3,vec3(1.),fx3)*exp(-d*d*2.)*fx2*.5;}",   // center glow
    " if(finish==129){vec2 q=p*(6.+fx2*10.)+C(1.)*.8;vec2 ci=floor(q),f=fract(q)-.5;vec2 jo=(vec2(h(ci+.7),h(ci+2.9))-.5)*.6+vec2(sin(TH+h(ci)*6.28),cos(TH+h(ci+1.)*6.28))*.1*fx3;c+=c3*exp(-dot(f-jo,f-jo)*260.)*step(h(ci+seed+4.),fx1*.5)*.6;}",   // dust motes
    " if(finish==130){for(int i=0;i<5;i++){float fi=float(i);if(fi>=fx1)break;vec2 cc=vec2(sin(TH+fi*2.3)*1.2,cos(TH+fi*1.7)*.6);float d=length(p-cc)/fx2;c+=mix(c2,c3,h(vec2(fi,seed)))*exp(-d*d*3.)*fx3*.35;}}",   // light orbs
    " if(finish==131){c+=c3*smoothstep(.42,.5,loc)*fx3*.2;c*=.85+.3*(1.-loc);}",
    " if(finish==132){vec2 ctr=vec2(0.,fx2);float vb=v;for(int i=1;i<5;i++){vb+=field(ctr+(sp-ctr)*(1.-float(i)*fx1*.04))*glow;}c=mix(c,ramp(vb*.2),fx3);}",   // zoom blur
    " if(finish==133){vec2 dr=vec2(cos(fx2*.0174533),sin(fx2*.0174533))*fx1*.05;float vb=v;for(int i=1;i<5;i++){vb+=field(sp+dr*float(i))*glow;}c=mix(c,ramp(vb*.2),fx3);}",   // motion blur
    " if(finish==134){c=mix(c0,mix(c3,ramp(v),fx3),smoothstep(fx1-fx2*.2-.005,fx1+fx2*.2+.005,v));}",   // threshold
    " if(finish==135){float d=length(p)-fx1;c=mix(c,c0*.3,smoothstep(-.01-fx2*.2,.01,d))+c3*exp(-abs(d)*(60.-fx3*50.))*fx3*.5;}",   // halo frame
    " if(finish==136){float e=(loc+.44)/.04;c+=exp(-e*e)*.06*(.5+fx2*4.);}",
    " if(finish==137){vec2 fq=gl_FragCoord.xy*(540./r.y);c*=1.-fx1*.15+fx1*.25*(fbm(fq*.02)*.6+n(fq*.4)*.4);c*=1.+(n(fq*vec2(.05,.8))-.5)*fx2*.12;c=mix(c,c*vec3(1.06,1.,.9),fx3);}",   // matte paper
    " if(finish==138){vec2 fq=gl_FragCoord.xy*(540./r.y)*(.5+fx1);float g=n(fq*vec2(.15+.85*(1.-fx2),1.2)+seed)*.5+n(fq*.8)*.5;float t=clamp(v,0.,1.);c*=mix(1.,smoothstep(.7-t*.7,.8-t*.7,g)*1.25,fx3);}",   // chalk
    " if(finish==139){float t=pow(clamp(uv.y,0.,1.),1.+(1.-fx2)*3.);c=c*(1.-fx1*.5*(1.-t))+mix(c3,vec3(1.),fx3)*t*fx1*.15;}",   // top light
    " if(finish==140){vec2 q=p*3.+C(1.)*.3;float cs=0.;for(int i=0;i<2;i++){q=vec2(q.x+sin(q.y+TH),q.y+cos(q.x-TH));cs+=pow(abs(sin(q.x+q.y)),6.);}c=mix(c,c*vec3(.6,.9,1.2),fx3)+c3*cs*fx2*.08;}",
    " if(finish==141){float a=fx2*.0174533+sin(TH)*.05;float vg=field(mat2(cos(a),-sin(a),sin(a),cos(a))*sp*(1.+fx1*.5))*glow;c=max(c,ramp(vg)*fx3*.7);}",   // ghost
    " if(finish==142){float a=fx3*.0174533;float f=fract(dot(p,vec2(-sin(a),cos(a)))*fx1*.5);c=mix(c0*.3,c,smoothstep(fx2+.02,fx2,abs(f-.5)*2.));}",   // stripe mask
    " if(finish==143){vec2 f=fract(p*fx1*.5)-.5;c=mix(c0*.3,c,smoothstep(fx2*.5+.01+fx3*.1,fx2*.5,length(f)));}",   // dot window
    " if(finish==144){float w=fx2*.5;float cr=min(rbox(p-vec2(0.,-fx1*.12),vec2(w*fx1,fx1),0.),rbox(p-vec2(0.,fx1*.38),vec2(fx1*.62,w*fx1),0.));c=mix(c0*.4+c2*.4*exp(-max(cr,0.)*4.)*fx3,c,smoothstep(.005,-.005,cr));}",   // cross mask
    " if(finish==145){float d=(abs(p.x)+abs(p.y))*.7071-fx1;c=mix(c0*.4+c2*.4*exp(-max(d,0.)*4.)*fx3,c,smoothstep(.005+fx2*.1,-.005,d));}",   // diamond mask
    " if(finish==146){vec2 fq=gl_FragCoord.xy*(540./r.y)/(1.+fx2*4.);c*=1.+(n(fq*.5+C(floor(fx3+.5))*3.)-.5)*fx1*.6*clamp(v*1.5,0.,1.);}",   // shimmer
    " if(finish==147){vec2 b=vec2(r.x/r.y,1.)*(1.-fx1*.2);float d1=abs(rbox(p,b,0.)),d2=abs(rbox(p,b-fx2*.08,0.));c+=c3*(smoothstep(.006,0.,d1)+smoothstep(.006,0.,d2)*.6)*fx3*.5;}",   // frame lines
    " if(finish==148){float l=pow(clamp(dot(c,vec3(.3,.59,.11)),0.,1.),1.+fx3);c=mix(c,mix(c0,mix(c2,c3,fx2),l*1.4),fx1);}",   // mono tint
    " if(finish==149){float bm=0.;for(int i=0;i<6;i++){float fi=float(i);float x0=(fi-2.5)*.6*(r.x/r.y)/1.8;float a=sin(TH+fi*1.7)*.3*fx3;vec2 q=p-vec2(x0,1.05);float dx=q.x*cos(a)+q.y*sin(a),dy=-q.x*sin(a)+q.y*cos(a);float w=.02+max(-dy,0.)*.12*fx2;bm+=exp(-dx*dx/(w*w))*step(dy,0.)*exp(dy*.6);}c+=c3*bm*fx1*.25;}",   // truss light
    " if(finish==150){float st=0.;for(int i=1;i<3;i++){float fi=float(i);st+=(field(sp+vec2(fi*.15*fx2,0.))+field(sp-vec2(fi*.15*fx2,0.)))*glow*(1.-fi*.3);}st=max(st/2.8-.4,0.);c+=mix(c3,vec3(.5,.7,1.),fx3)*st*fx1;}",   // anamorphic
    " if(finish==151){float fl=1.+(h(vec2(floor(TH*4.),3.))-.5)*.06*fx3;c=mix(c,c*vec3(1.08,.98,.85)+vec3(.03,.02,.01),fx1)*fl;c=c*(1.-fx2*.15)+fx2*.06;vec2 dq=gl_FragCoord.xy/r.y*40.;c=mix(c,vec3(.9,.85,.75)*.5,step(.9985,h(floor(dq)+floor(TH*4.)))*fx3);}",   // warm film
    " if(finish==152){vec2 L=vec2(cos(TH)*.6,.45+sin(TH)*.1)*fx2*1.5;float f=exp(-length(p-L)*8.)*.8+exp(-abs(p.y-L.y)*60.)*exp(-abs(p.x-L.x)*1.5)*.4;for(int i=1;i<4;i++){float fi=float(i);vec2 g=-L*(fi*.5-.2);float dg=length(p-g);f+=smoothstep(.06*fi,.05*fi,dg)*.06+exp(-abs(dg-.08*fi)*80.)*.08;}c+=mix(c3,vec3(.6,.8,1.),fx3)*f*fx1;}",   // lens flare
    " if(finish==153){float e=v-fx2;float l=exp(-e*e/(.0004+fx3*.004));c=c*(1.-fx1*.7)+c3*l*fx1*1.2;}",   // neon contour
    " if(finish==154){float l=dot(c,vec3(.3,.59,.11))*(1.+fx2);c*=1.+fx2;c=mix(c,mix(vec3(1.),c3*1.2,fx3),smoothstep(.9-fx1*.6,1.1-fx1*.6,l));}",   // overexpose
    " if(finish==155){c*=1.+(sin(TH*23.)*.5+sin(TH*37.)*.5)*fx2*.04;c=mix(c,c*smoothstep(1.2,.2,length((uv-.5)*vec2(r.x/r.y,1.))),fx3*.6);}",
    " if(finish==156){float hz=fbm(p*1.2+C(1.)*.3+vec2(seed));c=c+mix(c1,c2,.4)*hz*fx1*.35*(1.-clamp(dot(c,vec3(.33)),0.,1.)*fx3);c=mix(c,c*.9+.05,fx2*.3);}",   // haze lift
    " if(finish==157){float b=max(v-(.7-fx2*.4),0.);c+=ramp(min(v+.2,1.))*b*fx1*1.2+c3*pow(max(v-.8,0.),2.)*fx3*2.;}",   // bloom
    " if(finish==158){c*=1.-fx3*.6*(1.-smoothstep(0.,.06,loc)*smoothstep(1.,.94,loc));}",
    " if(finish==159){float d=rbox(p,vec2(fx1*.35,fx1),fx1*.35);c=mix(c0*.4+c2*.4*exp(-max(d,0.)*4.)*fx3,c,smoothstep(.005+fx2*.1,-.005,d));}",   // pill mask
    " if(finish==160){vec2 b=vec2(r.x/r.y,1.)*(1.-fx1*.25);vec2 dq=b-abs(p);float L=.15+fx2*.3;float l=min(max(abs(dq.y),max(-dq.x,dq.x-L)),max(abs(dq.x),max(-dq.y,dq.y-L)));c+=c3*smoothstep(.006,0.,l)*fx3;}",   // corner brackets
    " if(finish==161){float t=fract(TH/6.28318*floor(fx3+.5))*3.-1.;float d=(p.x*.6+p.y)/(r.x/r.y*.6+1.)-t;float s2=exp(-d*d/(.002+fx2*.02));c+=c3*s2*fx1*.6*clamp(v*1.5,0.,1.)+vec3(1.)*s2*fx1*.1;}",   // sheen
    " if(finish==162){float w=1./fx1;float id=floor(p.x/w);float hh=h(vec2(id,seed+5.));vec2 hc=vec2((id+.5+(hh-.5)*.3)*w,-1.+fx2*.35+hh*.06);float R=w*.28;float d=length(p-hc)-R;d=min(d,rbox(p-vec2(hc.x,-1.2),vec2(w*.48,hc.y+1.2-R*1.2),w*.2));if(h(vec2(id,seed+9.))<fx3){float sw=sin(TH+hh*6.28)*.15;vec2 ap=p-vec2(hc.x+w*.4,hc.y);ap=mat2(cos(sw),-sin(sw),sin(sw),cos(sw))*ap;d=min(d,rbox(ap-vec2(0.,R*3.),vec2(w*.07,R*3.),w*.05));d=min(d,length(ap-vec2(0.,R*6.2))-w*.1);}c=mix(c0*.15,c,smoothstep(-.004,.004,d));}",   // crowd
    " if(finish==163){float ph=fract(TH/6.28318*floor(fx2*8.+1.));c*=1.+exp(-ph*30.)*fx1*1.5;c+=c3*exp(-ph*20.)*fx3*.3;}",   // strobe
    " if(finish==164){float R=mix(2.2,.25,fx1*(.5-.5*cos(TH)));float d=length(p)-R;c=mix(c0*.2,c,smoothstep(.01+fx2*.2,-.01,d))+c3*exp(-abs(d)*60.)*fx3*.5;}",   // iris wipe
    " if(finish==166){c*=mix(1.,smoothstep(0.,.5,loc),fx3);}",
    " if(finish==168){vec2 q=abs(p);float d=max(q.x*.866+q.y*.5,q.y)-fx1;c=mix(c0*.4+c2*.4*exp(-max(d,0.)*4.)*fx3,c,smoothstep(.005+fx2*.1,-.005,d));}",   // hex mask
    " if(finish==169){vec2 q=p-vec2(0.,-.15*fx1);float d=max(abs(q.x)*.866+q.y*.5,-q.y)-fx1*.5;c=mix(c0*.4+c2*.4*exp(-max(d,0.)*4.)*fx3,c,smoothstep(.005+fx2*.1,-.005,d));}",   // triangle mask
    " if(finish==170){c=mix(c,ramp(abs(fract(clamp(v,0.,2.)*(.5+fx2*1.5))*2.-1.)),fx1);c=mix(c,c*c*1.6,fx3*.5);}",   // solarize
    " if(finish==172){float v2=field(sp*(1.+fx2)+vec2(1.3,-.4)*fx2+C(1.)*.15*fx3)*glow;c=1.-(1.-c)*(1.-ramp(v2)*fx1*.8);}",   // double exposure
    " if(finish==173){float x0=.3*(fx2*2.-1.);float f1=abs(p.x-x0),f2=abs(p.y+p.x*.3-.2);c*=1.+(-step(p.x,x0)*.08+step(p.y+p.x*.3,.2)*.05)*fx1*2.-exp(-f1*60.)*.15*fx1-exp(-f2*60.)*.1*fx1;c*=1.+(n(gl_FragCoord.xy/r.y*300.)-.5)*fx3*.12;}",   // paper fold
    " if(finish==174){float aa=0.;for(int L=0;L<2;L++){float fl=float(L);float k=(4.+fl*4.)*(.5+fx2);float cx=floor(p.x*k);float gx=fract(p.x*k)-.5;float hh=h(vec2(cx,fl*7.+seed));float y=1.2-fract(hh+fract(TH/6.28318))*2.4;float x=(h(vec2(cx,fl+9.))-.5)*.6+sin(TH+hh*6.28)*.12;vec2 d=vec2((gx-x)/k,p.y-y);float sz=.003+.005*h(vec2(cx,fl+4.));aa+=exp(-dot(d,d)/(sz*sz))*(.4+.6*hh)*(1.-fl*.3);}c+=mix(c3,vec3(1.),fx3)*aa*fx1;}",   // ash
    " if(finish==175){c*=.9+.1*sin(loc*3.14159);}",
    " if(finish==176){c*=1.-fx3*.5*(1.-smoothstep(0.,.08,loc));}",
    " if(finish==177){vec2 g=abs(fract(p*fx1*.5)-.5);float l=smoothstep(.02+fx2*.04,0.,min(g.x,g.y));c+=c*l*fx3*1.5+c3*l*fx3*.05;}",   // light grid
    " if(finish==178){float m=0.;for(int i=0;i<4;i++){float fi=float(i);vec2 cp=vec2((fi-1.5)*.9*fx2+sin(TH+fi*1.7)*.2*fx3,-.55);vec2 q=(p-cp)*vec2(1.,3.);m+=exp(-dot(q,q)*4.);}c=c*(1.-fx1*.75)+c*m*fx1*1.4;}",   // spot pools
    // your video, own colors: the file's color at the (finish-displaced) spot, scaled by how much the finish brightened or darkened the field
    " if(look==204){vec3 vr=vrgb(vcov((sp-vec2(shift*r.x/r.y,shiftY)*2.)/scale));float lc=dot(c,vec3(.299,.587,.114)),l0=dot(ramp(clamp(vv0,0.,1.)),vec3(.299,.587,.114));c=mix(vr*glow*clamp((lc+.02)/(l0+.02),0.,2.5),c,vtint);}",
    " if(finish==179){c*=1.-fx5*.4*smoothstep(.36,.5,abs(loc));c+=c3*fx5*.1*exp(-pow((loc+.42)/.05,2.));}",
    " if(finish==180){float e=exp(-loc*60.);c=c*(1.-e*.6)+c3*e*fx5*.8;}",
    " if(finish==182){if(loc>.5){vec3 a=ramp(field(sp+vec2(fx5*.05,0.))*glow),b=ramp(field(sp-vec2(fx5*.05,0.))*glow);c=vec3(a.r,c.g,b.b);}}",
    " if(finish==183){vec2 sc=gl_FragCoord.xy/r;float ln=.5+.5*sin(sc.y*fx1*6.28318+TH*fx4);c*=mix(1.,.55+.75*ln,.8);float tri=fract(gl_FragCoord.x*(540./r.y)/2.);vec3 mk=vec3(smoothstep(.34,.1,abs(tri-.17)),smoothstep(.34,.1,abs(tri-.5)),smoothstep(.34,.1,abs(tri-.83)));c=mix(c,c*mk*2.6,fx2);c+=c*c*fx5*.7;c*=smoothstep(1.,.965,loc);}",
    " if(finish==184){float k=fx1*.5;vec2 cl=floor(p*k);c*=smoothstep(fx2*.62,fx2*.62-.14,loc)*1.5;vec2 pn=mod(cl,fx3);float seam=min(min(pn.x,pn.y),min(fx3-1.-pn.x,fx3-1.-pn.y));c*=1.-fx4*.5*step(seam,.5);float tw=h(cl+seed);c*=1.+fx5*2.5*step(.985,tw)*(.5+.5*sin(TH*2.+tw*40.));}",
    " if(finish==185){c*=smoothstep(fx2*.45,fx2*.45+.06,loc)*smoothstep(1.,.94,loc)*1.2;}",
    " if(finish==186){float tv=clamp(v+fx3*.4+sin(TH*fx5)*.1*step(.5,fx5),0.,1.);if(fx2>.01){tv=mix(tv,floor(tv*(4.+fx2*12.))/(4.+fx2*12.),fx2);}vec3 hv=mix(vec3(.02,.01,.12),vec3(.45,.03,.55),smoothstep(0.,.3,tv));hv=mix(hv,vec3(.95,.25,.1),smoothstep(.25,.55,tv));hv=mix(hv,vec3(1.,.8,.2),smoothstep(.5,.8,tv));hv=mix(hv,vec3(1.,1.,.92),smoothstep(.78,1.,tv));c=mix(c,mix(hv,c,fx4),fx1);}",
    " if(finish==187){float a=fx3*.0174533;float u=dot(p,vec2(cos(a),sin(a)))*fx2+v*fx2*1.6+fbm(p*2.+seed)*fx4*2.-TH*fx5/6.28318;vec3 ho=.55+.45*cos(6.28318*(u+vec3(0.,.33,.67)));float lum=dot(c,vec3(.299,.587,.114));c=mix(c,ho*(.2+1.2*lum),fx1);}",
    " if(finish==188){float a=fx2*.0174533+sin(TH)*fx3*1.5;vec2 e=vec2(cos(a),sin(a))*fx1*.1+p*fx4*fx1*.12;float vr=field(sp+e)*glow,vb=field(sp-e)*glow;vec3 ms=vec3(clamp(vr,0.,1.),clamp(v,0.,1.),clamp(vb,0.,1.));vec3 cr=ramp(vr),cb=ramp(vb);vec3 kp=vec3(cr.r,c.g,cb.b);c=mix(ms*(c3*.35+.8),kp,fx5);}",
    " if(finish==189){float a=fx4*.0174533;float u=dot(p,vec2(-sin(a),cos(a)))*fx1*.5+clamp(v,0.,1.2)*fx2*7.-PH()*fx5;float l=abs(fract(u)-.5)*2.;float t=clamp(v,0.,1.)*fx3*1.15+.02;float mk=smoothstep(t+.1,t-.1,l);c=mix(c0*.7,ramp(min(v*1.2+.18,1.)),mk);}",
    " if(finish==190){vec2 gp=floor(gl_FragCoord.xy*(540./r.y)/fx1)+floor(PH()*fx5)*vec2(3.,1.);float b=0.,sc=.25;vec2 m0=mod(gp,4.);vec2 m2=floor(m0/2.),m1=m0-m2*2.;float bb=(mod(m1.x+m1.y*3.,4.)==0.?0.:mod(m1.x+m1.y*3.,4.)==3.?2.:mod(m1.x+m1.y*3.,4.)==2.?3.:1.)*4.+(mod(m2.x+m2.y*3.,4.)==0.?0.:mod(m2.x+m2.y*3.,4.)==3.?2.:mod(m2.x+m2.y*3.,4.)==2.?3.:1.);b=(bb+.5)/16.-.5;float tv=clamp((v-.5)*(1.+fx4*2.)+.5,0.,1.);float qv=floor(tv*(fx2-1.)+b+.5)/(fx2-1.);c=mix(ramp(clamp(qv,0.,1.)),c,fx3);}",
    " if(finish==191){float k=fx1*.5;vec2 cl=floor(p*k*vec2(.68,1.)),g=fract(p*k*vec2(.68,1.));float tq=floor(PH()*fx3);float id=h(cl+tq*.73*step(.5,h(cl+7.)));vec2 q=(g-.5)/(.5*fx2)*vec2(1.,1.);float bx=step(abs(q.x),.82)*step(abs(q.y),.86);vec2 gb=floor((q+1.)*vec2(1.5,2.5));float px=step(.42,h(gb+floor(id*53.)))*bx;float tv=clamp(v,0.,1.);float th0=1.-tv*1.25;px*=step(th0,id*.5+.5);c=mix(mix(c0*.8,ramp(min(tv*1.25+.2,1.)),px)+ramp(tv)*fx5,c,fx4);}",
    " if(finish==192){float qv=v*fx1+fx4;float fq=fract(qv),iq=floor(qv);float st=(iq+smoothstep(.5-fx3*.5-.02,.5+fx3*.5+.02,fq))/fx1;float ed=exp(-pow(min(fq,1.-fq)*fx1*2.4,2.));c=ramp(st);c+=c3*ed*fx2*.45*clamp(v*1.6,0.,1.);c+=ramp(min(st+.2,1.))*fx5*.35*st;}",
    " if(finish==193){float a=fx2*.0174533+sin(TH+p.x*1.3)*fx4*.5;vec2 dr=vec2(cos(a),sin(a))*fx1*.11;float acc=v,wt=1.;for(int i=1;i<8;i++){float fi=float(i);float k=exp(-fi*fx3*.42);acc+=field(sp+dr*fi)*glow*k;wt+=k;}c=mix(ramp(acc/wt*1.06),c,fx5);}",
    " if(finish==194){vec2 ct=vec2(fx3,fx4);float acc=v,wt=1.;for(int i=1;i<8;i++){float fi=float(i);float k=fi*fx1*.045;float an=k*fx2*2.+sin(TH)*fx1*fx2*.2;vec2 q=(sp-ct)*(1.-k);q=mat2(cos(an),-sin(an),sin(an),cos(an))*q;acc+=field(q+ct)*glow*(1.-fi*.08);wt+=1.-fi*.08;}c=mix(ramp(acc/wt*1.12),c,fx5);}",
    " if(finish==195){float T0=LTH;vec3 ec=c;for(int i=1;i<7;i++){float fi=float(i);if(fi>fx1)break;LTH=T0-fi*fx2*.22;float ve=field(sp)*glow*pow(1.-fx3*.8,fi);vec3 ce=ramp(ve);ce=mix(ce,ce*mix(vec3(1.),c3*1.3,fi/fx1),fx4);ec=mix(max(ec,ce),ec+ce*.6,fx5);}LTH=T0;c=ec;}",
    " if(finish==196){c*=1.-fx5*.55*pow(abs(loc-.5)*2.,3.);c+=c*fx5*.35*exp(-pow((loc-.2)*8.,2.));}",
    " if(finish==197){c+=c3*fx5*.4*smoothstep(.8,2.8,loc)+c*fx5*.15*loc;}",
    " if(finish==198){float a=r.x/r.y;float w=2.*a/fx1;float id=floor((p.x+a)/w);vec2 q=vec2(p.x+a-(id+.5)*w,p.y);float ga=fx2*.25;vec2 hb=vec2(w*.5-ga,1.-ga);float d=rbox(q,hb,min(hb.x,hb.y)*fx3+.003);float m=smoothstep(.004,-.004,d);if(m>.001){vec2 tp=vec2(h(gl_FragCoord.xy*.73),h(gl_FragCoord.xy*.31+4.))-.5;float bl=(field(sp+tp*fx4*.2)+field(sp-tp.yx*fx4*.16)+field(sp+tp.yx*vec2(-1.,1.)*fx4*.12)+v/glow)*.25*glow;vec3 fc=ramp(bl*1.04);fc+=c3*fx5*.2*exp(-pow((q.y-hb.y*.9)*11.,2.))+vec3(.5)*fx5*.12*exp(d*38.);c=mix(c*.12,fc,m);}else c*=.12;}",
    " if(finish==199){float a=r.x/r.y;float wd=2.*a/fx5;float id=floor((p.x+a)/wd);float x=p.x+a-(id+.5)*wd;float yb=-.9;float top=yb+fx2*2.;float d=p.y>top?length(vec2(x,p.y-top))-fx1:max(abs(x)-fx1,yb-p.y);c=mix(c0*.25+c2*.45*exp(-max(d,0.)*4.)*fx3,c,smoothstep(.005,-.005,d))+c3*exp(-abs(d)*(90.-fx4*60.))*fx4*.7;}",
    " if(finish==200){vec2 sy=p;if(p.y<fx4)sy.y=2.*fx4-p.y;vec2 q=sy-vec2(0.,fx4+fx2);float d=rbox(q,vec2(fx1,fx2),.012);float m=smoothstep(.005,-.005,d);vec3 gw=ramp(min(field(vec2(0.,fx4+fx2))*glow,1.))*exp(-max(d,0.)*(9.-fx3*7.))*fx3;c=c*m+gw*(1.-m)+c0*.25*(1.-m);if(p.y<fx4)c*=exp((p.y-fx4)*3.5)*fx5;}",
    " if(finish==201){c*=smoothstep(1.005,.99,loc);c+=c0*.3;if(p.y<fx4)c*=exp((p.y-fx4)*4.)*fx5;}",
    " if(finish==202){c*=smoothstep(1.005,.985,loc);c+=c0*.2;float fy=-fx2-.04;if(p.y<fy)c+=ramp(.45)*fx4*.5*exp((p.y-fy)*5.)*exp(-p.x*p.x*.8);}",
    " if(finish==203){float fr=fract(loc);float dp=floor(loc*.5+.25);c*=1.-exp(-fr*(26.-fx2*20.))*.75*fx2-.0;c*=pow(1.-fx5*.75,dp);}",
    " if(finish==204){vec2 cc=C(1.)*fx4;vec2 q=vec2(fbm(p*fx1+cc+seed),fbm(p*fx1-cc+seed+5.));float sk=fbm(p*fx1*1.3+q*2.2);float mk=smoothstep(fx2-.03-fx3*.2,fx2+.03+fx3*.2,sk);c=mix(c0*.35,c,mk)+c3*exp(-pow((sk-fx2)/(.012+fx3*.04),2.))*fx5*.55;}",
    " if(finish==205){float e=abs(fract(v*4.+loc*.7)-.5);c*=1.-fx4*.65*smoothstep(.1,0.,e);c=mix(c,c3*.92+c*.25,fx3*(1.-clamp(v*1.3,0.,1.)));}",
    " if(finish==206){float a=r.x/r.y;vec2 q=p/vec2(a,1.);float dg=max(abs(q.x),abs(q.y));float nz=fbm(p*fx4+C(1.)*.45+seed);float amt=fx1*(.72+.28*sin(TH*fx5+nz*3.)*step(.5,fx5));float bn=dg+nz*.55-1.25+amt*.95;float e=smoothstep(0.,.03+fx2*.28,bn);vec3 hot=mix(vec3(1.,.42,.1),vec3(1.,.92,.68),exp(-bn*bn*90.));c=mix(c,vec3(.015,.005,.002),smoothstep(.1,.55,bn));c+=hot*e*exp(-bn*(9.-fx3*6.))*fx3*1.15;}",
    " if(finish==207){vec2 e=vec2(.012,0.);float gx=field(sp+e)*glow-v,gy=field(sp+e.yx)*glow-v;float ed=clamp(length(vec2(gx,gy))*16.,0.,1.);float a=fx4*.0174533;float u=dot(p,vec2(cos(a),sin(a)));float band=fx3<.5?1.:exp(-pow((fract(u*.25+PH()*fx3)-.5)/(.05+fx2*.28),2.));c=c*mix(1.,.28,1.-fx5)+mix(c2,c3,ed)*ed*band*fx1*1.5+c*band*fx1*.3;}",
    " if(finish==208){float a1=sin(TH)*fx4*.06;vec2 pa=mat2(cos(a1),-sin(a1),sin(a1),cos(a1))*p;float g1=mix(p.x,length(p),fx5),g2=mix(pa.x,length(pa+vec2(fx2*.3,0.)),fx5);float l1=.5+.5*sin(g1*fx1*3.14159);float l2=.5+.5*sin((g2+fx2*.04)*(fx1*(1.+fx2*.08))*3.14159);float mo=l1*l2;c=mix(c,c*mo*2.4+c3*mo*mo*.12,fx3);}",
    " if(finish==209){float a=r.x/r.y;c*=smoothstep(fx2*a+.05,fx2*a-.05,abs(loc));}",
    " if(dfAmt<.999||dfPulse>.001){float am=clamp(dfAmt-dfPulse*(.5+.5*sin(dfRate*th)),0.,1.);c=mix(ramp(field(p00)*glow),c,am);}",
    " if(dySplit>.001){float R0=dyRate*th;vec2 e0=vec2(cos(R0),sin(R0))*dySplit*.035;vec3 ca=ramp(field(sp+e0)*glow),cb=ramp(field(sp-e0)*glow),c9=ramp(vvC);c=vec3(c.r+ca.r-c9.r,c.g,c.b+cb.b-c9.b);c=max(c,0.);}",
    " if(dyHue>.001||dyHueW>.001){float R0=dyRate*th;c=max(hueR(c,sin(R0)*dyHue*3.14159+sin(R0+p00.x*1.6+p00.y)*dyHueW*2.2),0.);}",
    " c*=mix(1.,clamp(1.15-.45*pow(length(uv-.5)*1.6,1.8),.15,1.),dark);",
    " gl_FragColor=vec4(c,1.);}"
  ].join("\n");
  // second pass: blur the drawn frame (golden-angle disk, 24 taps), then add grain on top so it stays crisp
  var FRAG_LINES = FRAG.split("\n"), NOSTRIP = /[?&]nostrip\b/.test(location.search);
  var DYN_LINE = /^ ?if\((d[yf][A-Z]\w*)>\.001\)/, DYN_GATES = [];
  FRAG_LINES.forEach(function (l) { var m = DYN_LINE.exec(l); if (m && DYN_GATES.indexOf(m[1]) < 0) DYN_GATES.push(m[1]); });
  function dynMask(st) { return DYN_GATES.filter(function (k) { return +st[k] > 0.001; }).join(","); }
  function fragFor(look, finish, st) {
    var head = "const int look=" + look + ";const int finish=" + finish + ";";
    if (NOSTRIP) return FRAG.replace("uniform int look, finish;", head);
    var out = [], skip = false;
    for (var i = 0; i < FRAG_LINES.length; i++) { var l = FRAG_LINES[i], m = /^ if\((look|finish)==(\d+)(\)|&&)/.exec(l);
      if (m) skip = +m[2] !== (m[1] === "look" ? look : finish); else if (!/^  /.test(l)) skip = false;
      if (!skip && st) { var dm = DYN_LINE.exec(l); if (dm && !(+st[dm[1]] > 0.001)) continue; }
      if (!skip) out.push(l); }
    return out.join("\n").replace("uniform int look, finish;", head);
  }
  var POST = [
    "precision highp float;",
    "uniform sampler2D tx; uniform vec2 r; uniform float blur, grain, th;",
    "float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}",
    "void main(){",
    " vec2 uv=gl_FragCoord.xy/r; vec3 c=texture2D(tx,uv).rgb;",
    " if(blur>.001){vec3 acc=c;float w=1.;float rad=blur*.06;",
    "  for(int i=1;i<24;i++){float fi=float(i);float a=fi*2.39996;float d=sqrt(fi/24.)*rad;",
    "   vec2 o=vec2(cos(a),sin(a))*d*vec2(r.y/r.x,1.);float k=exp(-fi/24.*1.5);acc+=texture2D(tx,uv+o).rgb*k;w+=k;}",
    "  c=acc/w;}",
    " c+=(h(gl_FragCoord.xy+fract(th*7.3))-.5)*.09*grain;",
    // anti-banding dither, always on: each channel lands on the two nearest 8-bit levels in the right proportion, a new pattern every frame. True black stays black.
    // 2-pixel clusters at +-2 levels: single-pixel dither averages away when anything scales the picture, and the scaler's own rounding brings the bands back
    " vec2 q=floor(gl_FragCoord.xy*.5)*2.+fract(th*5.1)*61.;c=max(c,0.);",
    " c+=(vec3(h(q+1.3)+h(q+17.7),h(q+31.1)+h(q+47.9),h(q+59.3)+h(q+71.7))-1.)*2.*clamp(c*255.,0.,1.)/255.;",
    " gl_FragColor=vec4(c,1.);}"
  ].join("\n");

  // "Your video" (look 204): a video or image file from this computer as the picture. The file never leaves the browser; the
  // render code only says "your video" + the finish and colors, and Altar Render / Altar Live ask for the file when they open it.
  var VIDEO_LOOK = 204, VIDEO = { el: null, aspect: 16 / 9, name: "", isVideo: false };
  var VIDEO_TILE = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 224 126"><rect width="224" height="126" fill="#141216"/><rect x="62" y="28" width="100" height="70" rx="8" fill="none" stroke="#ffb07c" stroke-width="3"/><path d="M101 46l30 17-30 17z" fill="#ffb07c"/><text x="112" y="118" fill="#9a929e" font-family="monospace" font-size="11" text-anchor="middle" letter-spacing="2">CHOOSE A FILE</text></svg>');
  // Every design setting into a shader's uniforms (shared by the live preview and the picker thumbnails).
  function setUniforms(g, u, st) {
    ["ir1", "ir2"].concat(COLORS).forEach(function (c) { var v = rgb(st[c]); g.uniform3f(u[c], v[0], v[1], v[2]); });
    g.uniform1f(u.p1, st.p1); g.uniform1f(u.p2, st.p2);
    // speed vs duration: 12 s at 1x is one trip around; slower speeds shrink the trip instead of breaking the loop
    var trv = st.speed * st.loop / 12, cyc = Math.max(1, Math.round(trv)); g.uniform1f(u.cyc, cyc); g.uniform1f(u.amp, trv / cyc);
    ["flow", "scale", "warp", "glow", "dark", "reeds", "refract", "htSize", "htFill", "tlCount", "tlGap", "tlVary", "slDensity", "slStrength", "slRoll", "haSize", "haBands", "haSoft", "crW", "crArm", "crBar", "crGlow", "crFlick", "reedShape", "meshN", "meshSoft", "pwDens", "pwAmp", "pwFreq", "pwDot", "dgSize", "dgDens", "dgDot", "fx1", "fx2", "fx3", "lx1", "lx2", "lx3", "shift", "shiftY", "auCount", "auSpread", "auSoft", "flDetail", "flContrast", "flDrift", "rgCount", "rgFall", "rgSharp", "rayCount", "rayOrigin", "rayLen", "elFog", "ptShape", "irFill", "irAngle", "arCount", "orbIn", "lcBright", "lcPulse", "tpCount", "vtint"].forEach(function (k) { g.uniform1f(u[k], st[k]); });
    ["cx1", "cx2", "cx3", "cx4", "cx5", "lx4", "lx5", "fx4", "fx5", "dyRate", "dyTurb", "dySwirl", "dyWave", "dyWaveF", "dyPulse", "dySway", "dyDrift", "dyStretch", "dyLiquid", "dyRipple", "dyBreathe", "dyFlick", "dyBeat", "dyPunch", "dySweep", "dyHue", "dyHueW", "dySplit", "dyEcho", "dfRate", "dfWobble", "dfDrift", "dfZoom", "dfSway", "dfAmt", "dfPulse", "dfMotion"].forEach(function (k) { g.uniform1f(u[k], st[k]); }); g.uniform1f(u.haTilt, st.haTilt * Math.PI / 180); g.uniform1f(u.dgTilt, st.dgTilt * Math.PI / 180);
    g.uniform1f(u.angle, st.angle * Math.PI / 180); g.uniform1f(u.htAngle, st.htAngle * Math.PI / 180);
  }

  function start() {
    var cv = document.getElementById("studio-gl"); if (!cv) return;
    // ---- test build: sliders that move by themselves. Each look's and finish's own smooth sliders get a "<name> motion" slider under them.
    var MO = [], moCache = {};   // { key, mo, min, max, ph }
    (function () {
      var seen = {}, skip = { angle: 1, haTilt: 1, dgTilt: 1, htAngle: 1, irAngle: 1 };
      document.querySelectorAll("#studio-form fieldset[data-look] input[type=range][data-k], #studio-form fieldset[data-fin] input[type=range][data-k]").forEach(function (inp) {
        var k = inp.dataset.k, step = +inp.step || 1, deg = inp.dataset.fmt === "deg"; if (skip[k] || (step >= 1 && !deg) || (k === "fx1" && inp.closest('[data-fin="122"]'))) return;
        var row = inp.closest(".tune-row"), lab = row.querySelector("span").firstChild.textContent.trim(), mo = "mo_" + k, r = document.createElement("label");
        r.className = "tune-row mo-row"; r.innerHTML = "<span>" + lab + ' motion <b data-out="' + mo + '"></b></span><input type="range" data-k="' + mo + '" data-fmt="pct" min="0" max="1" step="0.01">'; row.after(r);
        if (!seen[k]) { seen[k] = 1; MO.push({ key: k, mo: mo, ph: MO.length * 1.7 }); DEFAULTS[mo] = 0; }
      });
      // the range of each motion comes from the slider that's showing for this look or finish
      window.__moRange = function (key) { var el = document.querySelector('#studio-form fieldset[data-look]:not([hidden]) input[type=range][data-k="' + key + '"], #studio-form fieldset[data-fin]:not([hidden]) input[type=range][data-k="' + key + '"]'); if (key === "fx1" && document.querySelector('#studio-form fieldset[data-fin="122"]:not([hidden])')) return null; return el ? [+el.min, +el.max] : null; };
    })();
    function moApply(g, u, st, ph) {
      var R = (st.dyRate || 1) * ph * Math.PI * 2;
      for (var i = 0; i < MO.length; i++) { var m = MO[i], a = st[m.mo]; if (!a || !u[m.key]) continue; var ck = st.look + "/" + st.finish + "/" + m.key, rg = moCache[ck]; if (rg === undefined) rg = moCache[ck] = window.__moRange(m.key); if (!rg) continue; var v = st[m.key] + Math.sin(R + m.ph) * a * (rg[1] - rg[0]) * 0.5; g.uniform1f(u[m.key], Math.max(rg[0], Math.min(rg[1], v))); }
    }

    var gl = cv.getContext("webgl", { antialias: false, preserveDrawingBuffer: true, powerPreference: "high-performance" });
    var msg = document.getElementById("studio-msg");
    if (!gl) { msg.textContent = "Your browser can't draw the live preview (WebGL is off)."; return; }
    function sh(t, s) { var o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; }
    var pr = null, U = {}, progs = {}, curKey = "", curMask = "", pendingUse = null, pendingAt = 0, progOrder = [], PSC = gl.getExtension("KHR_parallel_shader_compile");
    var UNIFORMS = ["cx1", "cx2", "cx3", "cx4", "cx5", "lx4", "lx5", "fx4", "fx5", "dyRate", "dyTurb", "dySwirl", "dyWave", "dyWaveF", "dyPulse", "dySway", "dyDrift", "dyStretch", "dyLiquid", "dyRipple", "dyBreathe", "dyFlick", "dyBeat", "dyPunch", "dySweep", "dyHue", "dyHueW", "dySplit", "dyEcho", "dfRate", "dfWobble", "dfDrift", "dfZoom", "dfSway", "dfAmt", "dfPulse", "dfMotion"].concat(["vid", "vid2", "vmix", "vasp", "vtint", "r", "th", "c0", "c1", "c2", "c3", "flow", "scale", "warp", "glow", "dark", "grain", "seed", "reeds", "refract", "angle", "htSize", "htAngle", "htFill", "tlCount", "tlGap", "tlVary", "slDensity", "slStrength", "slRoll", "p1", "p2", "cyc", "amp", "haSize", "haBands", "haTilt", "haSoft", "crW", "crArm", "crBar", "crGlow", "crFlick", "reedShape", "meshN", "meshSoft", "pwDens", "pwAmp", "pwFreq", "pwDot", "dgSize", "dgDens", "dgDot", "dgTilt", "fx1", "fx2", "fx3", "lx1", "lx2", "lx3", "shift", "shiftY", "auCount", "auSpread", "auSoft", "flDetail", "flContrast", "flDrift", "rgCount", "rgFall", "rgSharp", "rayCount", "rayOrigin", "rayLen", "elFog", "ptShape", "irFill", "irAngle", "ir1", "ir2", "arCount", "orbIn", "lcBright", "lcPulse", "tpCount"]);
    // A shader specialised to one look + finish: look and finish become constants, so the compiler drops every other branch.
    function use(look, finish) {
      var key = look + "/" + finish, mask = dynMask(s), pkey = key + "|" + mask;
      if (!progs[pkey]) {
        var p = gl.createProgram(), vs = gl.createShader(gl.VERTEX_SHADER), fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(vs, "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}"); gl.compileShader(vs);
        gl.shaderSource(fs, fragFor(look, finish, s)); gl.compileShader(fs);
        gl.attachShader(p, vs); gl.attachShader(p, fs); gl.bindAttribLocation(p, 0, "a"); gl.linkProgram(p);
        progs[pkey] = { p: p, u: null, fs: fs };
      }
      var PR = progs[pkey];
      if (pr && PSC && !PR.u && !gl.getProgramParameter(PR.p, PSC.COMPLETION_STATUS_KHR)) { pendingUse = [look, finish]; return false; }
      pendingUse = null;
      if (!PR.u) { if (!gl.getProgramParameter(PR.p, gl.LINK_STATUS)) { delete progs[pkey]; msg.textContent = "That combination couldn't be drawn on this graphics card."; console.error(gl.getShaderInfoLog(PR.fs)); if (pr) { s.look = +curKey.split("/")[0]; s.finish = +curKey.split("/")[1]; return false; } throw new Error("shader"); } PR.u = {}; UNIFORMS.forEach(function (k) { PR.u[k] = gl.getUniformLocation(PR.p, k); }); }
      pr = PR.p; U = PR.u; curKey = key; curMask = mask; gl.useProgram(pr); progOrder = progOrder.filter(function (q) { return q !== pkey; }); progOrder.push(pkey); while (progOrder.length > 32) { var oldK = progOrder.shift(); if (progs[oldK]) { gl.deleteProgram(progs[oldK].p); delete progs[oldK]; } }
      gl.uniform1i(U.vid, 1); gl.uniform1i(U.vid2, 2); gl.uniform1f(U.vmix, 1); gl.uniform1f(U.vasp, VIDEO.aspect);   // your video: texture units 1 and 2
      if (cv.width) gl.uniform2f(U.r, cv.width, cv.height);
      if (typeof seed === "number") gl.uniform1f(U.seed, seed);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    var pp = gl.createProgram(); gl.attachShader(pp, sh(gl.VERTEX_SHADER, "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}")); gl.attachShader(pp, sh(gl.FRAGMENT_SHADER, POST)); gl.linkProgram(pp);
    var UP = {}; ["tx", "r", "blur", "grain", "th"].forEach(function (k) { UP[k] = gl.getUniformLocation(pp, k); });
    // your video: the current frame on unit 1 (unit 2 = the same frame here; Altar Render blends the loop seam with it)
    var vidTex = gl.createTexture(), vidReady = false;
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, vidTex);
    [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach(function (k) { gl.texParameteri(gl.TEXTURE_2D, k, gl.CLAMP_TO_EDGE); });
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
    gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, vidTex); gl.activeTexture(gl.TEXTURE0);
    function uploadVideo() {
      var el = VIDEO.el; if (!el || s.look !== VIDEO_LOOK) return;
      if (VIDEO.isVideo && el.readyState < 2) return;
      if (VIDEO.isVideo && el.paused) el.play().catch(function () {});
      if (VIDEO.isVideo && Math.abs(el.playbackRate - (s.vspeed || 1)) > 0.001) el.playbackRate = s.vspeed || 1;
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, vidTex); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, el); vidReady = true; } catch (e) {}
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false); gl.activeTexture(gl.TEXTURE0);
    }
    var vidFile = document.getElementById("vid-file"), vidName = document.getElementById("vid-name");
    var ovFile = document.getElementById("ov-file"), ovName = document.getElementById("ov-name"), ovClear = document.getElementById("ov-clear"), ovImg = null, ovUrl = null;
    var ovOp = document.getElementById("ov-op"), ovOpOut = document.getElementById("ov-op-out"), ovOpRow = document.getElementById("ov-op-row"), ovAlpha = 1;
    try { var oa = +localStorage.getItem("altar-overlay-opacity"); if (oa >= 0 && oa <= 100 && localStorage.getItem("altar-overlay-opacity") !== null) ovAlpha = oa / 100; } catch (e) {}
    if (ovOp) { ovOp.value = Math.round(ovAlpha * 100); if (ovOpOut) ovOpOut.textContent = Math.round(ovAlpha * 100) + "%"; }
    function applyOverlayAlpha() { if (ovImg) ovImg.style.opacity = ovAlpha; if (ovOpOut) ovOpOut.textContent = Math.round(ovAlpha * 100) + "%"; }
    if (ovOp) ovOp.addEventListener("input", function () { ovAlpha = Math.max(0, Math.min(1, ovOp.value / 100)); applyOverlayAlpha(); try { localStorage.setItem("altar-overlay-opacity", Math.round(ovAlpha * 100)); } catch (e) {} if (ovImg && designBC && !OUT) designBC.postMessage({ overlay: ovUrl, fit: ovImg.dataset.fit, opacity: ovAlpha }); });
    function setOverlay(file) {
      if (ovUrl) URL.revokeObjectURL(ovUrl); ovUrl = null; if (ovImg) { ovImg.remove(); ovImg = null; }
      if (!file) { if (ovName) ovName.textContent = "Nothing on top yet."; if (ovClear) ovClear.hidden = true; if (ovOpRow) ovOpRow.hidden = true; if (designBC && !OUT) designBC.postMessage({ overlay: null }); return; }
      ovUrl = URL.createObjectURL(file); ovImg = document.createElement("img"); ovImg.className = "studio-overlay"; ovImg.alt = ""; ovImg.src = ovUrl; ovImg.dataset.fit = document.querySelector('[data-k="ovFit"] button[aria-pressed="true"]') ? document.querySelector('[data-k="ovFit"] button[aria-pressed="true"]').dataset.i : "0";
      cv.parentNode.insertBefore(ovImg, cv.nextSibling); if (ovName) ovName.textContent = file.name; if (ovClear) ovClear.hidden = false; if (ovOpRow) ovOpRow.hidden = false; applyOverlayAlpha();
      if (designBC && !OUT) designBC.postMessage({ overlay: ovUrl, fit: ovImg.dataset.fit, opacity: ovAlpha });
    }
    if (ovFile) ovFile.addEventListener("change", function () { var f = ovFile.files && ovFile.files[0]; if (f) setOverlay(f); ovFile.value = ""; });
    if (ovClear) ovClear.addEventListener("click", function () { setOverlay(null); });
    var ovFitEl = document.querySelector('#studio-form [data-k="ovFit"]'); if (ovFitEl) { ovFitEl.innerHTML = '<button type="button" data-i="0" aria-pressed="true">Fill</button><button type="button" data-i="1" aria-pressed="false">Fit</button>'; ovFitEl.addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; ovFitEl.querySelectorAll("button").forEach(function (q) { q.setAttribute("aria-pressed", q === b); }); if (ovImg) { ovImg.dataset.fit = b.dataset.i; if (designBC && !OUT) designBC.postMessage({ overlay: ovUrl, fit: b.dataset.i, opacity: ovAlpha }); } }); }
    if (OUT && designBC) designBC.addEventListener("message", function (e) { if (!("overlay" in e.data)) return; if (ovImg) { ovImg.remove(); ovImg = null; } if (e.data.overlay) { ovImg = document.createElement("img"); ovImg.className = "studio-overlay"; ovImg.alt = ""; ovImg.src = e.data.overlay; ovImg.dataset.fit = e.data.fit || "0"; ovImg.style.opacity = "opacity" in e.data ? e.data.opacity : 1; cv.parentNode.insertBefore(ovImg, cv.nextSibling); } });
    function useVideoFile(f) {
      if (!f) return;
      if (VIDEO.url) URL.revokeObjectURL(VIDEO.url);
      var url = URL.createObjectURL(f), isVideo = /^video\//.test(f.type);
      var el = isVideo ? document.createElement("video") : new Image();
      if (isVideo) { el.muted = true; el.loop = true; el.playsInline = true; el.autoplay = true; el.setAttribute("playsinline", ""); }
      var done = function () {
        var w = isVideo ? el.videoWidth : el.naturalWidth, h = isVideo ? el.videoHeight : el.naturalHeight;
        if (!w || !h) { if (vidName) vidName.textContent = "That file couldn't be opened. Try an MP4 (H.264) or a PNG / JPG."; return; }
        VIDEO.el = el; VIDEO.aspect = w / h; VIDEO.name = f.name; VIDEO.isVideo = isVideo; VIDEO.url = url;
        if (isVideo && isFinite(el.duration) && el.duration > 0.5) s.loop = Math.max(2, Math.min(120, Math.round(el.duration)));
        if (vidName) vidName.textContent = f.name + " · " + w + " × " + h + (isVideo && isFinite(el.duration) ? " · " + el.duration.toFixed(1) + " s" : "");
        if (s.look !== VIDEO_LOOK) { s.look = VIDEO_LOOK; Object.assign(s, LOOK_DEFAULTS[s.look] || {}); }
        if (pr) { gl.useProgram(pr); gl.uniform1f(U.vasp, VIDEO.aspect); }
        if (isVideo) el.play().catch(function () {});
        sync();
      };
      if (isVideo) { el.addEventListener("loadeddata", done, { once: true }); el.src = url; el.load(); } else { el.onload = done; el.src = url; }
    }
    window.__useVideoFile = useVideoFile; if (vidFile) vidFile.addEventListener("change", function () { useVideoFile(vidFile.files && vidFile.files[0]); vidFile.value = ""; });
    var tex = gl.createTexture(), fbo = gl.createFramebuffer();
    // the look pass in 16-bit where the graphics card allows it (as the Mac apps do), so the dither has real in-between values to work with; 8-bit otherwise
    var hfExt = gl.getExtension("OES_texture_half_float"), hfOK = !!(hfExt && gl.getExtension("OES_texture_half_float_linear") && gl.getExtension("EXT_color_buffer_half_float"));
    gl.bindTexture(gl.TEXTURE_2D, tex);
    [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach(function (k) { gl.texParameteri(gl.TEXTURE_2D, k, gl.CLAMP_TO_EDGE); });
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    var s = load(), seed = 3.7, form = document.getElementById("studio-form");
    // settings live in six tabs (Look, Finish, Color, Motion, Text, Screen)
    var tabs = form.querySelectorAll("[data-tab]"), panes = form.querySelectorAll("[data-pane]");
    function showTab(t) {
      tabs.forEach(function (b) { b.setAttribute("aria-selected", b.dataset.tab === t); b.tabIndex = b.dataset.tab === t ? 0 : -1; });
      panes.forEach(function (p) { p.hidden = p.dataset.pane !== t; });
    }
    tabs.forEach(function (b, i) {
      b.addEventListener("click", function () { showTab(b.dataset.tab); });
      b.addEventListener("keydown", function (e) { var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (!d) return;
        var n = tabs[(i + d + tabs.length) % tabs.length]; showTab(n.dataset.tab); n.focus(); });
    });
    showTab(/[?&]tab=text\b/.test(location.search) ? "text" : "look");   // always opens on Look
    // Text tab + its output window: /studio?out=1 shows only the loop and text, and follows this Studio live
    var OUT = /[?&]out=1\b/.test(location.search), designBC = null;
    try { designBC = new BroadcastChannel("altar-studio-design"); } catch (e) {}
    if (OUT) { var sd = /[?&]seed=([\d.]+)/.exec(location.search); if (sd) seed = +sd[1]; }
    if (window.AltarScripture) { if (OUT) AltarScripture.bootStudioOutput(); else AltarScripture.mountControls(); }
    window.studioOutputUrl = function () { return "/studio?out=1" + (LAB ? "&lab" : "") + "&seed=" + seed + "#" + Object.keys(s).map(function (k) { return k + "~" + s[k]; }).join(","); };
    // "Customize colors" folds away until it's wanted; open state is remembered per browser
    var opened = {}; try { opened = JSON.parse(localStorage.getItem("studio-open") || "{}"); } catch (e) {}
    form.querySelectorAll("fieldset.sliders").forEach(function (f) {
      var lg = f.querySelector("legend"), name = lg.textContent, body = document.createElement("div"), inner = document.createElement("div");
      body.className = "drop-body"; inner.className = "drop-inner"; body.appendChild(inner);
      Array.prototype.slice.call(f.children).forEach(function (c) { if (c !== lg) inner.appendChild(c); });
      f.appendChild(body); f.classList.add("drop"); f.classList.toggle("open", !!opened[name]);
      lg.innerHTML = '<button type="button" class="drop-toggle" aria-expanded="' + !!opened[name] + '">' + name + "</button>";
      lg.firstChild.addEventListener("click", function (e) {
        var on = f.classList.toggle("open"); e.currentTarget.setAttribute("aria-expanded", on); opened[name] = on;
        try { localStorage.setItem("studio-open", JSON.stringify(opened)); } catch (er) {}
      });
    });
    function load() { var o = Object.assign({}, DEFAULTS), st = location.hash.slice(1); if (!st) try { st = sessionStorage.getItem("studio-state") || ""; } catch (e) {} if (!st && !/[?&]d=/.test(location.search)) Object.assign(o, LOOK_DEFAULTS[START_LOOK] || {}, { look: START_LOOK }); /* a fresh Studio opens on Light Field; DEFAULTS.look stays Flow so old share links keep their look */ setTimeout(function () { if (!LAB && (LAB_FINS.indexOf(s.finish) >= 0 || LAB_LOOKS.indexOf(s.look) >= 0)) { if (LAB_FINS.indexOf(s.finish) >= 0) s.finish = 0; if (LAB_LOOKS.indexOf(s.look) >= 0) s.look = 2; sync(); } }); try { st.split(",").forEach(function (kv) { var p = kv.split("~"); if (p[0] in o) o[p[0]] = HEXK.indexOf(p[0]) >= 0 ? (/^[0-9a-f]{6}$/i.test(p[1]) ? p[1] : o[p[0]]) : +p[1]; }); } catch (e) {} return o; }
    // The design is kept in this tab's sessionStorage (survives a refresh), not the address: Safari logged every address
    // change as a History entry. An old link with the design after # still opens; the # is dropped once it's read.
    var saveT = 0; function save() { clearTimeout(saveT); saveT = setTimeout(saveNow, 250); } addEventListener("pagehide", function () { saveNow(); }); function saveNow() { var st = Object.keys(s).map(function (k) { return k + "~" + s[k]; }).join(","); try { sessionStorage.setItem("studio-state", st); } catch (e) {}
      if (designBC && !OUT) designBC.postMessage({ st: st, seed: seed });
      if (location.hash) history.replaceState(null, "", location.pathname + location.search); }
    function seg(k, items) {
      var el = form.querySelector('[data-k="' + k + '"]');
      el.innerHTML = items.map(function (t, i) { return (k === "look" && (RETIRED.indexOf(i) >= 0 || (LAB_LOOKS.indexOf(i) >= 0 && !LAB && i !== VIDEO_LOOK))) || (k === "finish" && LAB_FINS.indexOf(i) >= 0 && !LAB) ? "" : '<button type="button" data-i="' + i + '">' + t + "</button>"; }).join("");
      el.addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; s[k] = +b.dataset.i;
        if (k === "look") Object.assign(s, LOOK_DEFAULTS[s.look] || {});
        if (k === "finish") Object.assign(s, FIN_DEFAULTS[s.finish] || {});
        if (k === "reedShape" && s[k] === 2) { s.reeds = 6; s.refract = Math.max(s.refract, 0.35); }   // radial reads best as a few wide glass bands
        sync(); });
    }
    // a picker: category chips + search above a grid of thumbnail tiles (the tiles are the same buttons seg() makes, so everything else just works)
    function picker(k, items, cats) {
      seg(k, items);
      var grid = form.querySelector('[data-k="' + k + '"]'), catOf = {}, cat = "All", q = "";
      Object.keys(cats).forEach(function (c) { cats[c].forEach(function (i) { catOf[i] = c; }); });
      grid.classList.add("pick-grid");
      if (k === "look") LOOK_FEATURED.slice().reverse().forEach(function (i) { var b = grid.querySelector('button[data-i="' + i + '"]'); if (b) grid.insertBefore(b, grid.firstChild); });
      (PICK_ORDER[k] || []).slice().reverse().forEach(function (i) { var b = grid.querySelector('button[data-i="' + i + '"]'); if (b) grid.insertBefore(b, grid.firstChild); });   // the saved All-tab order wins over the featured list
      grid.querySelectorAll("button").forEach(function (b) { var i = +b.dataset.i;
        b.innerHTML = (k === "look" && i === VIDEO_LOOK ? '<img alt="" src="' + VIDEO_TILE + '" data-static>' : '<img alt="" data-src="/thumbs/' + (k === "look" ? "look" : "fin") + "-" + i + ".jpg?v=" + THUMBS_V + '">') + '<span>' + items[i] + "</span>"; b.dataset.cat = catOf[i] || ""; b.title = items[i]; });
      var shown = [].map.call(grid.querySelectorAll("button"), function (b) { return b.dataset.cat; });
      var bar = document.createElement("div"); bar.className = "pick-bar";
      bar.innerHTML = '<div class="pick-cats">' + ["All"].concat(Object.keys(cats).filter(function (c) { return shown.indexOf(c) >= 0; })).map(function (c) { return '<button type="button" data-cat="' + c + '">' + c + "</button>"; }).join("") + "</div>" +
        '<input class="pick-find" type="search" placeholder="Search ' + (k === "look" ? "looks" : "finishes") + '" aria-label="Search ' + (k === "look" ? "looks" : "finishes") + '">';
      grid.parentNode.insertBefore(bar, grid);
      var store = "altar-pick-" + k; try { cat = localStorage.getItem(store) || "All"; } catch (e) {}
      if (cat !== "All" && shown.indexOf(cat) < 0) cat = "All";   // a category saved under an old name would hide every tile (iPhone, 2026-11-05)
      function apply() {
        bar.querySelectorAll(".pick-cats button").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.cat === cat); });
        grid.querySelectorAll("button").forEach(function (b) { var i = +b.dataset.i;
          b.hidden = !((cat === "All" || b.dataset.cat === cat || i === 0) && (!q || items[i].toLowerCase().indexOf(q) >= 0)); });
      }
      bar.querySelector(".pick-cats").addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; cat = b.dataset.cat; try { localStorage.setItem(store, cat); } catch (er) {} apply(); });
      bar.querySelector(".pick-find").addEventListener("input", function (e) { q = e.target.value.trim().toLowerCase(); if (q && cat !== "All") cat = "All"; apply(); });
      // two rows of tiles, then the grid scrolls (sized from a real tile, so it holds at any width)
      function fit() { var t = grid.querySelector("button:not([hidden])"); if (!t || !t.offsetHeight) return;
        var gap = parseFloat(getComputedStyle(grid).rowGap) || 10; grid.style.maxHeight = (t.offsetHeight * 2 + gap + 6) + "px"; }
      grid.addEventListener("load", fit, true); window.addEventListener("resize", fit); document.addEventListener("click", function (e) { if (e.target.closest("[data-tab]")) setTimeout(fit, 30); });
      apply(); setTimeout(fit, 50);
    }
    picker("look", LOOKS, LOOK_CATS); picker("finish", FINISHES, FIN_CATS);
    // Live thumbnails: look tiles in your colors, finish tiles on your look. A second small WebGL canvas draws them a few
    // per frame (the main preview keeps its pace); the bundled Ember images show until each one is ready.
    var TB = { gl: null, progs: {}, sig: { look: "", finish: "" }, queue: [], busy: false, W: 224, H: 126, cv: null, dead: false };
    function thumbGL() {
      if (TB.gl || TB.dead) return TB.gl;
      TB.cv = document.createElement("canvas"); TB.cv.width = TB.W; TB.cv.height = TB.H;
      var g = TB.cv.getContext("webgl", { antialias: false, preserveDrawingBuffer: true }); if (!g) { TB.dead = true; return null; }
      TB.cv.addEventListener("webglcontextlost", function (e) { e.preventDefault(); TB.dead = true; TB.gl = null; });
      g.bindBuffer(g.ARRAY_BUFFER, g.createBuffer()); g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), g.STATIC_DRAW);
      g.enableVertexAttribArray(0); g.vertexAttribPointer(0, 2, g.FLOAT, false, 0, 0); g.viewport(0, 0, TB.W, TB.H);
      TB.ext = g.getExtension("KHR_parallel_shader_compile"); return (TB.gl = g);
    }
    function thumbProg(look, finish, st) {
      var g = TB.gl, key = look + "/" + finish, P = TB.progs[key];
      if (!P) { var p = g.createProgram(), vs = g.createShader(g.VERTEX_SHADER), fs = g.createShader(g.FRAGMENT_SHADER);
        g.shaderSource(vs, "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}"); g.compileShader(vs); g.shaderSource(fs, fragFor(look, finish, st)); g.compileShader(fs);
        g.attachShader(p, vs); g.attachShader(p, fs); g.bindAttribLocation(p, 0, "a"); g.linkProgram(p); P = TB.progs[key] = { p: p, u: null }; TB.order = (TB.order || []).concat(key); while (TB.order.length > 24) { var oldT = TB.order.shift(); if (TB.progs[oldT]) { g.deleteProgram(TB.progs[oldT].p); delete TB.progs[oldT]; } } }
      if (!P.u) { if (TB.ext && !g.getProgramParameter(P.p, TB.ext.COMPLETION_STATUS_KHR)) return null; P.u = {}; UNIFORMS.forEach(function (k) { P.u[k] = g.getUniformLocation(P.p, k); }); }
      return P;
    }
    function thumbState(k, i) {   // the design a tile shows
      var colors = { c0: s.c0, c1: s.c1, c2: s.c2, c3: s.c3, p1: s.p1, p2: s.p2, ir1: s.ir1, ir2: s.ir2 };
      if (k === "look") return Object.assign({}, DEFAULTS, LOOK_DEFAULTS[i] || {}, colors, { look: i, finish: 0, dark: 0.45, grain: 0 });
      var still = {}; Object.keys(s).forEach(function (q) { if (/^(dy|df|mo_)/.test(q)) still[q] = DEFAULTS[q]; }); return Object.assign({}, s, still, FIN_DEFAULTS[i] || {}, { finish: i, shift: 0, shiftY: 0, grain: 0 });
    }
    function drawThumb(k, i) {
      var g = thumbGL(); if (!g) return false; var st = thumbState(k, i), pg = thumbProg(st.look, st.finish, st); if (!pg) return null;
      g.useProgram(pg.p); g.uniform2f(pg.u.r, TB.W, TB.H); g.uniform1f(pg.u.seed, seed); setUniforms(g, pg.u, st); g.uniform1f(pg.u.th, 1.3);
      g.drawArrays(g.TRIANGLES, 0, 3); return TB.cv.toDataURL("image/jpeg", 0.82);
    }
    // ---- custom looks: installed at runtime, drawn by splicing their branch in front of the fallback look
    (function () {
      var MARK = " vec2 q=p-vec2(0.,rayOrigin)", KEY = "altar-custom-look", CUSTOM = null, fragFor0 = fragFor;
      var SCRATCH = {}, scratchN = 0;
      fragFor = function (look, finish, st) { var src = fragFor0(look, finish, st); var body = CUSTOM && look === CUSTOM.id ? CUSTOM.glsl : SCRATCH[look];
        if (body && src.indexOf(MARK) >= 0) src = src.replace(MARK, " if(look==" + look + "){\n" + body.replace(/\r/g, "") + "\n}\n" + MARK); return src; };
      window.__scratchLook = function (glsl) { var id = 9000 + (scratchN++ % 40); SCRATCH[id] = glsl; Object.keys(TB.progs).forEach(function (k) { if (k.indexOf(id + "/") === 0) delete TB.progs[k]; }); return id; };
      function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
      function row(sl) { return '<label class="tune-row"><span>' + esc(sl[0]) + ' <b data-out="' + sl[1] + '"></b></span><input type="range" data-k="' + sl[1] + '" data-fmt="' + sl[2] + '" min="' + sl[3] + '" max="' + sl[4] + '" step="' + sl[5] + '"></label>'; }
      function valid(def) { return def && typeof def === "object" && typeof def.glsl === "string" && def.glsl.length < 20000 && Array.isArray(def.sliders) && def.sliders.length >= 1 && def.sliders.length <= 10 && def.sliders.every(function (sl) { return Array.isArray(sl) && /^(lx[1-5]|cx[1-5])$/.test(sl[1]) && isFinite(+sl[3]) && isFinite(+sl[4]) && isFinite(+sl[6]); }) && def.sliders.map(function (sl) { return sl[1]; }).every(function (k, i, arr) { return arr.indexOf(k) === i; }) && typeof def.name === "string"; }
      function install(def, quiet) {
        if (!valid(def)) return null;
        def = JSON.parse(JSON.stringify(def)); def.name = def.name.slice(0, 40) || "Converted look";
        var id = CUSTOM ? CUSTOM.id : LOOKS.length; if (!CUSTOM) LOOKS.push(def.name); else LOOKS[id] = def.name;
        def.id = id; CUSTOM = def; window.__customLook = def; try { localStorage.setItem(KEY, JSON.stringify(def)); } catch (e) {}
        var d = {}; def.sliders.forEach(function (sl) { d[sl[1]] = +sl[6]; }); LOOK_DEFAULTS[id] = d;
        Object.keys(progs).forEach(function (k) { if (k.indexOf(id + "/") === 0) { try { gl.deleteProgram(progs[k].p); } catch (e) {} delete progs[k]; } });   // a replaced look must recompile
        Object.keys(TB.progs).forEach(function (k) { if (k.indexOf(id + "/") === 0) delete TB.progs[k]; });
        if (s.look === id) curKey = "";   // replacing the look that is on the preview: make the next sync compile it again
        var old = form.querySelector('fieldset[data-look="' + id + '"]'); if (old) old.remove();
        var fs = document.createElement("fieldset"); fs.className = "group"; fs.dataset.look = id; fs.hidden = s.look !== id;
        fs.innerHTML = "<legend>" + esc(def.name) + " settings</legend>" + def.sliders.map(row).join("");
        var all = form.querySelectorAll("fieldset[data-look]"), last = all[all.length - 1]; if (last) last.after(fs); else form.appendChild(fs);
        fs.querySelectorAll("input[type=range]").forEach(function (inp) { inp.addEventListener("input", function () { s[inp.dataset.k] = +inp.value; syncSoon(); }); });
        RANGE_INFO = null;
        var grid = form.querySelector('[data-k="look"]'), b = grid.querySelector('button[data-i="' + id + '"]');
        if (!b) { b = document.createElement("button"); b.type = "button"; b.dataset.i = id; grid.insertBefore(b, grid.firstChild); }
        b.dataset.cat = "Converted"; b.title = def.name; b.innerHTML = '<img alt="" data-static><span>' + esc(def.name) + "</span>";
        var cats = form.querySelector(".pick-cats"); if (cats && !cats.querySelector('[data-cat="Converted"]')) { var c = document.createElement("button"); c.type = "button"; c.dataset.cat = "Converted"; c.textContent = "Converted"; cats.insertBefore(c, cats.children[1] || null); }
        var tries = 0; (function thumb() { var url = drawThumb("look", id); if (url === null && ++tries < 300) { requestAnimationFrame(thumb); return; } if (url) b.querySelector("img").src = url; })();
        if (!quiet) { s.look = id; Object.assign(s, d); var pal = Array.isArray(def.palette) && def.palette.length === 4 ? def.palette.map(function (c) { return String(c).replace(/^#/, "").toLowerCase(); }) : null; if (pal && pal.every(function (c) { return /^[0-9a-f]{6}$/.test(c); })) { COLORS.forEach(function (c, i) { s[c] = pal[i]; }); s.palette = -1; } sync(); }
        return id;
      }
      window.__installCustom = install;
      window.__renderCode = function () { return renderCode(); };   // test hook
      window.__customLookFile = function () { return CUSTOM ? JSON.stringify({ altarLook: 1, name: CUSTOM.name, about: CUSTOM.about || "", kind: CUSTOM.kind || "", palette: CUSTOM.palette || null, elements: CUSTOM.elements || null, sliders: CUSTOM.sliders, glsl: CUSTOM.glsl, fit: CUSTOM.fit || null }, null, 1) : null; };
      var lk = /[?&]look=([^&]+)/.exec(location.search);   // ?look=/looks/name.altarlook opens that look file (test pages, remake results)
      if (lk) { fetch(decodeURIComponent(lk[1])).then(function (r) { return r.json(); }).then(function (d) { var id = install(d, false); var m = document.getElementById("studio-msg"); if (m) m.textContent = id != null ? "Opened the look file " + d.name + ". Its sliders are in the settings below the picker; every element has its own." : "That look file couldn't be opened."; }).catch(function () {}); }
      try { var saved = JSON.parse(localStorage.getItem(KEY) || "null"); if (saved && valid(saved)) { var sid = install(saved, true); if (sid != null && s.look >= LOOKS.length - 1 && s.look !== sid) { s.look = sid; } } } catch (e) {}
    })();
    // ---- Convert a loop you own: measure the file, fit a template, install it as a custom look
    (function () {
      var fileIn = document.getElementById("conv-file"), openIn = document.getElementById("conv-open"), stat = document.getElementById("conv-status"), res = document.getElementById("conv-results");
      var srcImg = document.getElementById("conv-src"), outImg = document.getElementById("conv-out"), outName = document.getElementById("conv-outname"), fitEl = document.getElementById("conv-fit"), palEl = document.getElementById("conv-pal");
      var foot = document.getElementById("conv-foot"), drop = document.getElementById("conv-drop"), label = document.getElementById("conv-label"), useBtn = document.getElementById("conv-use"), dlBtn = document.getElementById("conv-dl"), exactBtn = document.getElementById("conv-exact"), exactImg = document.getElementById("conv-exact-img");
      if (!fileIn || !window.__installCustom) return;
      var CW = 224, CH = 126, busy = false, last = null, lastFile = null;
      function say(t) { stat.textContent = t; }
      function frameCanvas() { var c = document.createElement("canvas"); c.width = CW; c.height = CH; return c; }
      function cover(ctx, el) { var sw = el.videoWidth || el.naturalWidth || el.width, sh = el.videoHeight || el.naturalHeight || el.height; var k = Math.max(CW / sw, CH / sh), dw = sw * k, dh = sh * k; ctx.drawImage(el, (CW - dw) / 2, (CH - dh) / 2, dw, dh); }
      // frames: three pairs 0.1 s apart (motion) whose first frames also serve for structure and palette; a still gives one frame
      function framesFrom(file) { return new Promise(function (ok, bad) {
        var url = URL.createObjectURL(file);
        if (/^image\//.test(file.type)) { var im = new Image(); im.onload = function () { var c = frameCanvas(); cover(c.getContext("2d"), im); URL.revokeObjectURL(url); ok({ frames: [c], pairs: [], dt: 0 }); }; im.onerror = function () { bad("That image couldn't be read."); }; im.src = url; return; }
        var v = document.createElement("video"); v.muted = true; v.playsInline = true; v.preload = "auto"; var out = [], times = [], i = 0, DT = 0.25, timer = setTimeout(function () { bad("That video took too long to open. A short MP4 (H.264) works best."); }, 30000);
        v.onloadedmetadata = function () { var d = v.duration; if (!(d > 0) || d === Infinity) { clearTimeout(timer); bad("That video couldn't be read."); return; } [0.15, 0.45, 0.75].forEach(function (f) { var t = Math.max(0, Math.min(d - DT - 0.05, d * f)); times.push(t, t + DT); }); v.currentTime = times[0]; };
        var tries = 0; function grab() { var c = frameCanvas(), ctx = c.getContext("2d"); try { cover(ctx, v); } catch (e) { clearTimeout(timer); bad("That video couldn't be read."); return; } var d = ctx.getImageData(0, 0, CW, CH).data, mx = 0; for (var q = 0; q < d.length; q += 64) mx = Math.max(mx, d[q], d[q + 1], d[q + 2]); if (mx < 6 && ++tries < 4) { setTimeout(grab, 90); return; } tries = 0; out.push(c); i++; if (i < times.length) v.currentTime = times[i]; else { clearTimeout(timer); URL.revokeObjectURL(url); ok({ frames: [out[0], out[2], out[4]], pairs: [[out[0], out[1]], [out[2], out[3]], [out[4], out[5]]], dt: DT }); } }
        v.onseeked = function () { setTimeout(grab, 40); };
        v.onerror = function () { clearTimeout(timer); bad("That file isn't a video this browser can play. MP4 (H.264) works everywhere."); };
        v.src = url;
      }); }
      function hex(c) { return c.map(function (x) { x = Math.max(0, Math.min(255, Math.round(x))); return (x < 16 ? "0" : "") + x.toString(16); }).join(""); }
      function colourful(c) { var d = c.getContext("2d").getImageData(0, 0, CW, CH).data, t = 0; for (var i = 0; i < d.length; i += 16) { var mx = Math.max(d[i], d[i + 1], d[i + 2]), mn = Math.min(d[i], d[i + 1], d[i + 2]); t += (mx - mn) * mx / 255; } return t; }
      function palette(frames) {   // four colours from the most colourful frame: the darkest tenth, the middle, the bright band and the top 1.5% (so a mostly dark loop still keeps its highlights)
        var best = frames[0], bs = -1; frames.forEach(function (c) { var v = colourful(c); if (v > bs) { bs = v; best = c; } });
        var px = [], d = best.getContext("2d").getImageData(0, 0, CW, CH).data; for (var i = 0; i < d.length; i += 8) px.push([d[i], d[i + 1], d[i + 2]]);
        px.sort(function (a, b) { return (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2]); });
        var n = px.length, band = function (lo, hi) { var a = [0, 0, 0], k = 0; for (var j = Math.floor(n * lo); j < Math.ceil(n * hi); j++) { a[0] += px[j][0]; a[1] += px[j][1]; a[2] += px[j][2]; k++; } return k ? [a[0] / k, a[1] / k, a[2] / k] : [0, 0, 0]; };
        var q80 = px[Math.floor(n * 0.8)]; if (q80[0] + q80[1] + q80[2] < 150) return [band(0, 0.1), band(0.88, 0.95), band(0.95, 0.985), band(0.99, 1)].map(hex);   // a mostly dark loop: its mid tones are in the bright few percent
        return [band(0, 0.1), band(0.3, 0.6), band(0.8, 0.95), band(0.985, 1)].map(hex);
      }
      // grey at 112x63 (2x2 boxes) and 56x32 (4x4 boxes)
      function grey(c, W, H) { var d = c.getContext("2d").getImageData(0, 0, CW, CH).data, BX = CW / W | 0, BY = CH / H | 0, g = new Float32Array(W * H);
        for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) { var a = 0; for (var by = 0; by < BY; by++) for (var bx = 0; bx < BX; bx++) { var o = ((y * BY + by) * CW + x * BX + bx) * 4; a += d[o] * 0.3 + d[o + 1] * 0.59 + d[o + 2] * 0.11; } g[y * W + x] = a / (BX * BY); }
        return { g: g, W: W, H: H }; }
      function stats(G) { var g = G.g, m = 0; for (var i = 0; i < g.length; i++) m += g[i]; m /= g.length; var sd = 0; for (i = 0; i < g.length; i++) sd += (g[i] - m) * (g[i] - m); return { m: m, sd: Math.sqrt(sd / g.length) + 1e-3 }; }
      // stroke direction (8 bins over 180°), how streaky (horizontal vs vertical change), how much of the frame is edge
      function texture(G) { var g = G.g, W = G.W, H = G.H, st = stats(G), thr = st.sd * 0.4, ori = [0, 0, 0, 0, 0, 0, 0, 0], hv = 0, vv = 0, edges = 0, c2 = 0, s2 = 0;
        for (var y = 1; y < H - 1; y++) for (var x = 1; x < W - 1; x++) { var gx = g[y * W + x + 1] - g[y * W + x - 1], gy = g[(y + 1) * W + x] - g[(y - 1) * W + x], mg = Math.sqrt(gx * gx + gy * gy); hv += Math.abs(gx); vv += Math.abs(gy); if (mg < thr) continue; edges++; var an = Math.atan2(gy, gx); if (an < 0) an += Math.PI; ori[Math.min(7, (an / Math.PI * 8) | 0)] += mg; c2 += mg * Math.cos(2 * an); s2 += mg * Math.sin(2 * an); }
        var os = ori.reduce(function (p, q) { return p + q; }, 0) + 1e-3; ori = ori.map(function (v) { return v / os; });
        var peak = 0; for (var b = 1; b < 8; b++) if (ori[b] > ori[peak]) peak = b;
        var ga = 0.5 * Math.atan2(s2, c2); if (ga < 0) ga += Math.PI;   // mean gradient direction (axial average); strokes run across it
        return { ori: ori, aniso: (hv - vv) / (hv + vv + 1e-3), edges: edges / ((W - 2) * (H - 2)), stroke: ga + Math.PI / 2, peakShare: ori[peak] + ori[(peak + 7) % 8] * 0.5 + ori[(peak + 1) % 8] * 0.5, m: st.m, sd: st.sd }; }
      // runs of bright pixels along the strokes: how long, how wide, how many across
      function runs(G, vertical, k) { var g = G.g, W = G.W, H = G.H, st = stats(G), thr = st.m + st.sd * (k || 0.3), lens = [], wids = [], perLine = [];
        var N = vertical ? W : H, M = vertical ? H : W;
        for (var a = 0; a < N; a++) { var run = 0; for (var b = 0; b < M; b++) { var v = vertical ? g[b * W + a] : g[a * W + b]; if (v > thr) run++; else if (run) { lens.push(run); run = 0; } } if (run) lens.push(run); }
        for (b = 0; b < M; b += 2) { var cnt = 0; run = 0; for (a = 0; a < N; a++) { v = vertical ? g[b * W + a] : g[a * W + b]; if (v > thr) run++; else if (run) { wids.push(run); cnt++; run = 0; } } if (run) { wids.push(run); cnt++; } perLine.push(cnt); }
        var med = function (arr) { if (!arr.length) return 0; var s2 = arr.slice().sort(function (p, q) { return p - q; }); return s2[s2.length >> 1]; };
        return { len: med(lens) / M, wid: med(wids), per: med(perLine) }; }
      // bright spots: local maxima clearly above the mean
      function blobs(G) { var g = G.g, W = G.W, H = G.H, st = stats(G), thr = st.m + st.sd * 0.9, n = 0, rad = 0, area = 0; for (var q = 0; q < g.length; q++) if (g[q] > st.m + st.sd * 0.5) area++;
        for (var y = 1; y < H - 1; y++) for (var x = 1; x < W - 1; x++) { var v = g[y * W + x]; if (v < thr) continue; var top = true; for (var dy = -1; dy <= 1 && top; dy++) for (var dx = -1; dx <= 1; dx++) if ((dy || dx) && g[(y + dy) * W + x + dx] > v) { top = false; break; } if (!top) continue; n++;
          var r = 1; while (r < 12 && x - r >= 0 && x + r < W && (g[y * W + x - r] + g[y * W + x + r]) / 2 > st.m + (v - st.m) * 0.4) r++; rad += r; }
        return { n: n, rad: n ? rad / n : 0, area: area }; }
      // motion between two frames 0.1 s apart: block matching, median over textured blocks, in screen heights per second
      function flow(A, B, dt) { var W = A.W, H = A.H, g1 = A.g, g2 = B.g, SY = 16, SX = 4, best = 1e18, bdx = 0, bdy = 0, zero = 0, n = 0;   // one shift for the whole frame: heads and tails give the signal a sliding line can't
        for (var dy = -SY; dy <= SY; dy++) for (var dx = -SX; dx <= SX; dx++) { var sad = 0; for (var y = SY; y < H - SY; y += 2) for (var x = SX; x < W - SX; x += 2) sad += Math.abs(g1[y * W + x] - g2[(y + dy) * W + x + dx]); if (!dy && !dx) zero = sad; if (sad < best) { best = sad; bdx = dx; bdy = dy; } n++; }
        if (zero <= 0 || best > zero * 0.97) return null;   // nothing moved that we can see
        return { vx: bdx / H / dt, vy: -bdy / H / dt, n: n, gain: r2(1 - best / zero) }; }   // screen heights per second, y up
      // motion along the strokes: each column (or row) matched against itself a quarter second later; the typical shift of the ones that moved
      function flowAlong(A, B, dt, vertical) { var W = A.W, H = A.H, g1 = A.g, g2 = B.g, N = vertical ? W : H, M = vertical ? H : W, S = 20, out = [];
        for (var a = 0; a < N; a++) { var m = 0, vr = 0, p1 = new Float32Array(M), p2 = new Float32Array(M); for (var b = 0; b < M; b++) { p1[b] = vertical ? g1[b * W + a] : g1[a * W + b]; p2[b] = vertical ? g2[b * W + a] : g2[a * W + b]; m += p1[b]; } m /= M; for (b = 0; b < M; b++) vr += (p1[b] - m) * (p1[b] - m); if (vr / M < 100) continue;
          var best = 1e18, bd = 0, zero = 0; for (var d = -S; d <= S; d++) { var sad = 0; for (b = S; b < M - S; b++) sad += Math.abs(p1[b] - p2[b + d]); if (!d) zero = sad; if (sad < best) { best = sad; bd = d; } } if (best < zero * 0.9 && bd) out.push(bd); }
        if (out.length < 4) return null; out.sort(function (p, q) { return p - q; }); var sh = out[Math.floor(out.length * (out[out.length >> 1] > 0 ? 0.7 : 0.3))];   // lean toward the faster (nearer) strokes
        return -sh / H / dt; }   // screen heights per second along the axis, negative = toward the bottom / left
      var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); }, r2 = function (v) { return Math.round(v * 100) / 100; };
      function rot(ang) { var c = Math.cos(ang), s0 = Math.sin(ang); return "mat2(" + r2(c) + "," + r2(-s0) + "," + r2(s0) + "," + r2(c) + ")"; }
      // ---- elements: a slow base layer (gradient or fog) and a fine detail layer (water, particles, streaks or texture), each with its own sliders
      function upLow(L) { var W = 224, H = 126, g = new Float32Array(W * H), lw = L.W, lh = L.H;   // the 56x32 band drawn back up to 224x126, bilinear
        for (var y = 0; y < H; y++) { var fy = (y + 0.5) * lh / H - 0.5, y0 = Math.max(0, Math.floor(fy)), y1 = Math.min(lh - 1, y0 + 1), ty = Math.min(1, Math.max(0, fy - y0));
          for (var x = 0; x < W; x++) { var fx = (x + 0.5) * lw / W - 0.5, x0 = Math.max(0, Math.floor(fx)), x1 = Math.min(lw - 1, x0 + 1), tx = Math.min(1, Math.max(0, fx - x0));
            g[y * W + x] = (L.g[y0 * lw + x0] * (1 - tx) + L.g[y0 * lw + x1] * tx) * (1 - ty) + (L.g[y1 * lw + x0] * (1 - tx) + L.g[y1 * lw + x1] * tx) * ty; } }
        return { g: g, W: W, H: H }; }
      function highBand(c) { var G = grey(c, 224, 126), U = upLow(grey(c, 56, 32)), g = new Float32Array(G.g.length); for (var i = 0; i < g.length; i++) g[i] = G.g[i] - U.g[i] + 128; return { g: g, W: 224, H: 126 }; }
      function down(G, W, H) { var g = new Float32Array(W * H), bx = G.W / W | 0, by = G.H / H | 0; for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) { var a = 0; for (var j = 0; j < by; j++) for (var i = 0; i < bx; i++) a += G.g[(y * by + j) * G.W + x * bx + i]; g[y * W + x] = a / (bx * by); } return { g: g, W: W, H: H }; }
      function planeFit(L) { var g = L.g, W = L.W, H = L.H, n = g.length, sx = 0, sy = 0, sv = 0, sxx = 0, syy = 0, sxv = 0, syv = 0;   // how much of the low band is one straight gradient
        for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) { var X = x - (W - 1) / 2, Y = (H - 1) / 2 - y, V = g[y * W + x]; sx += X; sy += Y; sv += V; sxx += X * X; syy += Y * Y; sxv += X * V; syv += Y * V; }
        var a = sxv / sxx, b = syv / syy, m = sv / n, ss = 0, sr = 0;
        for (y = 0; y < H; y++) for (x = 0; x < W; x++) { var X2 = x - (W - 1) / 2, Y2 = (H - 1) / 2 - y, V2 = g[y * W + x], e = V2 - (m + a * X2 + b * Y2); ss += (V2 - m) * (V2 - m); sr += e * e; }
        return { r2: ss > 0 ? 1 - sr / ss : 0, angleDeg: Math.round((Math.atan2(b, a) * 180 / Math.PI + 360) % 360), sd: Math.sqrt(ss / n) / 255 }; }
      function pct(G, q) { var a = Array.prototype.slice.call(G.g).sort(function (p, r) { return p - r; }); return a[Math.min(a.length - 1, Math.floor(a.length * q))]; }
      function tdiff(A, B) { var d = 0, n = 0; for (var i = 0; i < A.g.length; i += 3) { d += Math.abs(A.g[i] - B.g[i]); n++; } return d / n; }
      // GLSL pieces
      function gBase(kind, f) { return kind === "wash" ? "float an=radians(" + f.angleDeg + ".);vec2 bd=vec2(cos(an),sin(an));float bt=dot(p,bd)/(1.2+cx3*1.6)+sin(TH*2.)*lx2*.3*FL;float base=clamp(.5+.5*bt,0.,1.);base=mix(base,base*base*(3.-2.*base),.4);"
        : "float bf=.9+cx3*1.6;float base=mix(fbm(p*bf+C(1.)*.35*lx2+S),fbm(p*bf*1.7+C(2.)*.25*lx2+S+5.),.45);base=clamp((base-.25)*1.6,0.,1.);"; }
      function gDetail(kind, f) {
        if (kind === "water") return "float wsz=2.+(1.-cx1)*7.;vec2 wq=p*wsz+vec2(fbm(p*1.3+S),fbm(p*1.3+S+7.))*(.6+cx2*.8);float wt=TH*floor(.5+lx5*4.);float ww=0.,w2=0.;" +
          "for(int i=0;i<5;i++){float fi=float(i);float wa=h(vec2(fi,seed+2.))*6.28+radians(cx4)*.3;vec2 wd=vec2(cos(wa),sin(wa));float wf=1.7+h(vec2(fi,seed+5.))*3.5;ww+=sin(dot(wq,wd)*wf+wt*(1.+floor(fi*.5))+fi*2.1);w2+=sin(dot(wq*2.3,wd)*wf+wt*(2.+floor(fi*.5))+fi*1.3);}" +
          "float wc=abs(ww)*.2,wc2=abs(w2)*.2;float caus=pow(max(0.,1.-wc),3.+cx5*10.)+pow(max(0.,1.-wc2),4.+cx5*12.)*.5;float rip=.5+.5*ww*.2;float det=rip*(.2+cx2*.4)+caus*(.35+lx4*1.2);";
        if (kind === "particles") return "float det=0.;float kk=floor(lx5*4.+.5);float pa=radians(cx4);vec2 dd=vec2(cos(pa),sin(pa));for(int i=0;i<3;i++){float fi=float(i);if(fi>=2.)break;float cs=mix(.9,.18,cx2)*(1.+fi*.5);vec2 q=p/cs+dd*PH()*kk*(1.+fi)+fi*2.3;vec2 id0=floor(q);" +
          " for(int j=0;j<9;j++){vec2 id=id0+vec2(float(j-(j/3)*3)-1.,float(j/3)-1.);vec2 f=q-id-.5;float r0=h(id+seed+fi);vec2 o2=(vec2(h(id+seed+2.),h(id+seed+4.))-.5)*.7;float d=length(f-o2)*cs;float R=cx1*.22*(.5+r0)/(1.+fi*.4);float on=step(.25,h(id+seed+7.+fi));float tw=mix(1.,.5+.5*sin(TH*(1.+floor(r0*2.))+r0*6.28),cx5);" +
          " det+=on*exp(-d*d/(R*R)*mix(1.,.35,lx4))*(.6+.4*r0)*(1.-fi*.2)*tw*1.3;}}det=1.-exp(-det*2.4);";
        if (kind === "streaks") return "float det=0.;float kf=floor(lx5+.5);vec2 pp=" + rot(f.angle) + "*p;float a=r.x/r.y;for(int i=0;i<3;i++){float fi=float(i);if(fi>=2.)break;" +
          " float sp=2.*a/(cx2*(.7+fi*.5));float c=floor((pp.x+a)/sp+fi*.37);float rc=h(vec2(c,seed+fi*3.)),rw=h(vec2(c,seed+9.+fi));float cx0=(c+.5-fi*.37)*sp-a+(rc-.5)*sp*.6;float dx=pp.x-cx0;float w=sp*(.025+.075*lx4)*(.6+.8*rw)*(1.-fi*.25);" +
          " float Ls=cx5*(.6+.9*rc)*(1.-fi*.2);float per=Ls*1.6+.4;float k=kf*(3.-fi);float yy=pp.y*" + (f.dir < 0 ? "1." : "-1.") + "+rc*per*2.7+PH()*k*per;float cell=floor(yy/per),f=fract(yy/per);float rs=h(vec2(c,cell)+seed+fi);" +
          " float on=step(.3+fi*.08,rs);float Lc=Ls*(.6+.8*h(vec2(cell,c)+seed));float t=f*per;float lw=dx/w;float line=exp(-lw*lw*1.5);float halo=exp(-abs(dx)/(w*8.))*.5;float tail=smoothstep(Lc,Lc*.55,t)*(.7+.3*exp(-t*2.5))*smoothstep(0.,.01,f);float head=exp(-t*t/(w*w*5.))*.9;" +
          " det+=on*(line*(tail*(.55+.4*rs)+head*.5)+halo*tail*.5)*(1.-fi*.3)*1.3;}";
        return "float tf=1.5+cx1*4.;float det=fbm(p*tf+C(1.)*.3*lx5+S+3.)*1.2-.3;det=clamp(det,0.,1.)*(.5+lx4*.8);";   // texture: fine grain that drifts
      }
      function fitElements(frames, pairs, dt) {
        var bi = 0, bs = -1; frames.forEach(function (c, i) { var v = colourful(c); if (v > bs && stats(grey(c, 56, 32)).sd > 2) { bs = v; bi = i; } });
        var c0 = frames[bi], G = grey(c0, 224, 126), L = grey(c0, 56, 32), Hb = highBand(c0), stG = stats(G);
        // base layer
        var pf = planeFit(L), baseKind = pf.r2 > 0.5 ? "wash" : "fog", baseAmt = clamp(r2(pf.sd * 2.6), 0.1, 1);
        var bflow = null; pairs.forEach(function (pr) { var x = flow(grey(pr[0], 56, 32), grey(pr[1], 56, 32), dt); if (x && (!bflow || x.gain > bflow.gain)) bflow = x; });
        var baseDrift = clamp(r2((bflow ? Math.sqrt(bflow.vx * bflow.vx + bflow.vy * bflow.vy) : 0.08) * 3), 0.05, 1);
        // detail layer
        var hs = stats(Hb), energy = hs.sd / 255, tH = texture(Hb), Hd = down(Hb, 112, 63), bl = blobs(Hd), shine = (pct(G, 0.995) - pct(G, 0.9)) / stG.sd;
        var td = 0, cf = 0; if (pairs.length) { var tds = [], cfs = []; pairs.forEach(function (pr) { var A = highBand(pr[0]), B = highBand(pr[1]); tds.push(tdiff(A, B) / (stats(A).sd + 1e-3)); var fl = flow(A, B, dt); cfs.push(fl ? Math.sqrt(fl.vx * fl.vx + fl.vy * fl.vy) : 0); }); td = Math.max.apply(null, tds); cf = Math.max.apply(null, cfs); }
        var detKind = "none", f = {}, desc = [];
        var elong = 0; if (energy > 0.02) { var sa = tH.stroke - Math.PI / 2; while (sa > Math.PI / 2) sa -= Math.PI; while (sa < -Math.PI / 2) sa += Math.PI; var Rv = runs(G, Math.abs(sa) < Math.PI / 4, 0.5); elong = (Rv.len * (Math.abs(sa) < Math.PI / 4 ? 126 : 224)) / Math.max(1, Rv.wid); }
        if (energy > 0.02) {
          var iso = Math.abs(tH.aniso) <= 0.25;
          if (!iso && tH.peakShare > 0.45 && elong >= 5) detKind = "streaks";
          else if (shine > 2.2 && energy > 0.08 && bl.n >= 8 && Math.abs(tH.aniso) <= 0.4) detKind = "water";
          else if (bl.n >= 6 && shine > 1.8) detKind = "particles";
          else detKind = "texture";
        }
        if (window.__conv && window.__conv.force) detKind = window.__conv.force;   // test hook
        var sliders = [], glsl = "", name = [];
        if (baseKind === "wash") { sliders.push(["Gradient amount", "lx1", "pct", 0, 1, 0.01, baseAmt], ["Gradient slide", "lx2", "pct", 0, 1, 0.01, baseDrift], ["Gradient spread", "cx3", "pct", 0, 1, 0.01, 0.5]); desc.push("gradient toward " + pf.angleDeg + "°"); }
        else { sliders.push(["Fog amount", "lx1", "pct", 0, 1, 0.01, baseAmt], ["Fog drift", "lx2", "pct", 0, 1, 0.01, baseDrift], ["Fog softness", "cx3", "pct", 0, 1, 0.01, 0.4]); desc.push("fog base"); }
        glsl += gBase(baseKind, pf);
        var detAmt = clamp(r2(energy * 9), 0.15, 1);
        if (detKind === "water") { sliders.push(["Water amount", "lx3", "pct", 0, 1, 0.01, detAmt], ["Water shine", "lx4", "pct", 0, 1, 0.01, clamp(r2(shine / 5), 0.2, 1)], ["Water speed", "lx5", "pct", 0, 1, 0.01, clamp(r2(td), 0.2, 1)], ["Ripple size", "cx1", "pct", 0, 1, 0.01, clamp(r2(0.9 - bl.n / 300), 0.15, 0.9)], ["Ripple density", "cx2", "pct", 0, 1, 0.01, 0.5], ["Ripple direction", "cx4", "deg", 0, 360, 1, 0], ["Caustic sharpness", "cx5", "pct", 0, 1, 0.01, clamp(r2(shine / 4), 0.2, 1)]); desc.push("water (shine " + r2(shine) + ", " + Math.round(bl.n) + " sparkles)"); }
        else if (detKind === "particles") { var vx = bflow ? bflow.vx : 0, vy = bflow ? bflow.vy : -0.1, sp2 = Math.sqrt(vx * vx + vy * vy) || 0.05; sliders.push(["Particle amount", "lx3", "pct", 0, 1, 0.01, clamp(r2(shine / 4), 0.4, 1)], ["Particle glow", "lx4", "pct", 0, 1, 0.01, 0.5], ["Particle drift", "lx5", "pct", 0, 1, 0.01, clamp(r2(sp2 * 2.5), 0.05, 1)], ["Particle size", "cx1", "pct", 0.05, 1, 0.01, clamp(r2(Math.max(bl.rad / 63 * 4, Math.sqrt(bl.area / Math.max(bl.n, 1) / Math.PI) / 63 * 5)), 0.12, 1)], ["Particle count", "cx2", "pct", 0, 1, 0.01, clamp(r2((Math.log(bl.n) - Math.log(5)) / (Math.log(400) - Math.log(5))), 0, 1)], ["Drift direction", "cx4", "deg", 0, 360, 1, Math.round((Math.atan2(-vy, -vx) * 180 / Math.PI + 360) % 360)], ["Twinkle", "cx5", "pct", 0, 1, 0.01, 0.4]); desc.push("particles (" + Math.round(bl.n) + ")"); }
        else if (detKind === "streaks") { var a0 = tH.stroke - Math.PI / 2; while (a0 > Math.PI / 2) a0 -= Math.PI; while (a0 < -Math.PI / 2) a0 += Math.PI; var vertical = Math.abs(a0) < Math.PI / 4, R = runs(G, vertical, 0.5), RL = runs(G, vertical, 0.3);
          var fa = null; pairs.forEach(function (pr) { var x = flowAlong(grey(pr[0], 224, 126), grey(pr[1], 224, 126), dt, vertical); if (x != null && (fa == null || Math.abs(x) > Math.abs(fa))) fa = x; }); var along = fa != null ? fa : -0.3;
          f = { angle: vertical ? -a0 : -(a0 > 0 ? a0 - Math.PI / 2 : a0 + Math.PI / 2), dir: along <= 0 ? -1 : 1 };
          sliders.push(["Streak amount", "lx3", "pct", 0, 1, 0.01, detAmt], ["Streak thickness", "lx4", "pct", 0, 1, 0.01, 0.4], ["Streak speed", "lx5", "raw", 1, 6, 1, clamp(Math.round(Math.abs(along) * 12 / 1.3) || 1, 1, 6)], ["Streak density", "cx2", "raw", 10, 100, 1, clamp(Math.round((R.per || 20) / 0.6), 10, 100)], ["Streak length", "cx5", "pct", 0.1, 1, 0.01, clamp(r2((RL.len || 0.25) * 3), 0.1, 1)]); desc.push("streaks " + (vertical ? "vertical" : "angled")); }
        else if (detKind === "texture") { sliders.push(["Texture amount", "lx3", "pct", 0, 1, 0.01, detAmt], ["Texture contrast", "lx4", "pct", 0, 1, 0.01, 0.5], ["Texture drift", "lx5", "pct", 0, 1, 0.01, 0.3], ["Texture size", "cx1", "pct", 0, 1, 0.01, 0.5]); desc.push("fine texture"); }
        glsl += detKind === "none" ? "float det=0.;" : gDetail(detKind, f);
        var haze = clamp(r2(stG.m / 255 * 0.25), 0.02, 0.12);
        glsl += "return base*lx1*.9+det*lx3+" + haze + ";";
        return { kind: baseKind + "+" + detKind, glsl: glsl, sliders: sliders, desc: desc.join(" · "), fit: { r2: r2(pf.r2), energy: r2(energy), aniso: r2(tH.aniso), peak: r2(tH.peakShare), elong: r2(elong), blobs: bl.n, shine: r2(shine), tdiff: r2(td), coherent: r2(cf) } };
      }

      // ---- the element library: GLSL reading its parameters from slider uniforms, so one compiled program serves the whole search
      var LIB = {
        base: {
          wash: { name: "Gradient", glsl: "float an=cx3*0.01745;vec2 bd=vec2(cos(an),sin(an));float bt=dot(p,bd)/1.4+sin(TH*2.)*lx2*.3*FL;float base=clamp(.5+.5*bt,0.,1.);base=mix(base,base*base*(3.-2.*base),.4);",
            sliders: [["Gradient amount", "lx1", "pct", 0, 1.5, 0.01, 0.6], ["Gradient slide", "lx2", "pct", 0, 1, 0.01, 0.2], ["Gradient angle", "cx3", "deg", 0, 360, 1, 90]], fit: ["cx3", "lx1"] },
          glow: { name: "Glow", glsl: "float a=r.x/r.y;vec2 gq=(p-vec2((cx3-.5)*2.*a,(lx2-.5)*2.))/vec2(a,1.);float base=exp(-dot(gq,gq)/(.08+cx5*1.6));",
            sliders: [["Glow amount", "lx1", "pct", 0, 1.5, 0.01, 0.8], ["Glow height", "lx2", "pct", 0, 1, 0.01, 0.5], ["Glow across", "cx3", "pct", 0, 1, 0.01, 0.5], ["Glow size", "cx5", "pct", 0, 1, 0.01, 0.4]], fit: ["lx2", "cx3", "cx5", "lx1"] },
          fog: { name: "Fog", glsl: "float bf=.6+cx3*2.4;float base=mix(fbm(p*bf+C(1.)*.35*lx2+S),fbm(p*bf*1.7+C(2.)*.25*lx2+S+5.),.45);base=clamp((base-.25)*1.6,0.,1.);",
            sliders: [["Fog amount", "lx1", "pct", 0, 1.5, 0.01, 0.6], ["Fog drift", "lx2", "pct", 0, 1, 0.01, 0.3], ["Fog scale", "cx3", "pct", 0, 1, 0.01, 0.4]], fit: ["cx3", "lx1"] }
        },
        detail: {
          streaks: { name: "Streaks", glsl: "float det=0.;{float kf=floor(lx5+.5);float sa=cx4*0.01745;vec2 pp=mat2(cos(sa),-sin(sa),sin(sa),cos(sa))*p;float a=r.x/r.y;for(int i=0;i<3;i++){float fi=float(i);if(fi>=2.)break;float dn=10.+cx2*90.;float sp=2.*a/(dn*(.7+fi*.5));float c=floor((pp.x+a)/sp+fi*.37);float rc=h(vec2(c,seed+fi*3.)),rw=h(vec2(c,seed+9.+fi));float cx0=(c+.5-fi*.37)*sp-a+(rc-.5)*sp*.6;float dx=pp.x-cx0;float w=sp*(.025+.075*lx4)*(.6+.8*rw)*(1.-fi*.25);float Ls=(.1+cx1*.9)*(.6+.9*rc)*(1.-fi*.2);float per=Ls*1.6+.4;float k=kf*(3.-fi);float yy=pp.y+rc*per*2.7+PH()*k*per;float cell=floor(yy/per),f=fract(yy/per);float rs=h(vec2(c,cell)+seed+fi);float on=step(cx5*.6+fi*.08,rs);float Lc=Ls*(.6+.8*h(vec2(cell,c)+seed));float t=f*per;float lw=dx/w;float line=exp(-lw*lw*1.5);float halo=exp(-abs(dx)/(w*8.))*.5;float tail=smoothstep(Lc,Lc*.55,t)*(.7+.3*exp(-t*2.5))*smoothstep(0.,.01,f);float head=exp(-t*t/(w*w*5.))*.9;det+=on*(line*(tail*(.55+.4*rs)+head*.5)+halo*tail*.5)*(1.-fi*.3)*1.3;}}",
            sliders: [["Streak amount", "lx3", "pct", 0, 1.5, 0.01, 0.9], ["Streak thickness", "lx4", "pct", 0, 1, 0.01, 0.4], ["Streak speed", "lx5", "raw", 1, 6, 1, 2], ["Streak length", "cx1", "pct", 0, 1, 0.01, 0.5], ["Streak density", "cx2", "pct", 0, 1, 0.01, 0.5], ["Streak angle", "cx4", "deg", -90, 90, 1, 0], ["Streak gaps", "cx5", "pct", 0, 1, 0.01, 0.5]], fit: ["cx4", "cx2", "cx1", "lx4", "cx5", "lx3"] },
          particles: { name: "Particles", glsl: "float det=0.;{float kk=floor(lx5*4.+.5);float pa=cx4*0.01745;vec2 dd=vec2(cos(pa),sin(pa));for(int i=0;i<3;i++){float fi=float(i);if(fi>=2.)break;float cs=mix(.9,.15,cx2)*(1.+fi*.5);vec2 q=p/cs+dd*PH()*kk*(1.+fi)+fi*2.3;vec2 id0=floor(q);for(int j=0;j<9;j++){vec2 id=id0+vec2(float(j-(j/3)*3)-1.,float(j/3)-1.);vec2 f=q-id-.5;float r0=h(id+seed+fi);vec2 o2=(vec2(h(id+seed+2.),h(id+seed+4.))-.5)*.7;float d=length(f-o2)*cs;float R=(.03+cx1*.3)*(.5+r0)/(1.+fi*.4);float on=step(.25,h(id+seed+7.+fi));float tw=mix(1.,.5+.5*sin(TH*(1.+floor(r0*2.))+r0*6.28),cx5);det+=on*exp(-d*d/(R*R)*mix(1.,.35,lx4))*(.6+.4*r0)*(1.-fi*.2)*tw*1.3;}}det=1.-exp(-det*2.4);}",
            sliders: [["Particle amount", "lx3", "pct", 0, 1.5, 0.01, 0.9], ["Particle softness", "lx4", "pct", 0, 1, 0.01, 0.5], ["Particle drift", "lx5", "pct", 0, 1, 0.01, 0.25], ["Particle size", "cx1", "pct", 0, 1, 0.01, 0.3], ["Particle count", "cx2", "pct", 0, 1, 0.01, 0.5], ["Drift direction", "cx4", "deg", 0, 360, 1, 90], ["Twinkle", "cx5", "pct", 0, 1, 0.01, 0.4]], fit: ["cx2", "cx1", "lx4", "lx3"] },
          water: { name: "Water", glsl: "float det=0.;{float wsz=2.+(1.-cx1)*7.;vec2 wq=p*wsz+vec2(fbm(p*1.3+S),fbm(p*1.3+S+7.))*(.6+cx2*.8);float wt=TH*floor(.5+lx5*4.);float ww=0.,w2=0.;for(int i=0;i<5;i++){float fi=float(i);float wa=h(vec2(fi,seed+2.))*6.28+cx4*0.01745*.3;vec2 wd=vec2(cos(wa),sin(wa));float wf=1.7+h(vec2(fi,seed+5.))*3.5;ww+=sin(dot(wq,wd)*wf+wt*(1.+floor(fi*.5))+fi*2.1);w2+=sin(dot(wq*2.3,wd)*wf+wt*(2.+floor(fi*.5))+fi*1.3);}float wc=abs(ww)*.2,wc2=abs(w2)*.2;float caus=pow(max(0.,1.-wc),3.+cx5*10.)+pow(max(0.,1.-wc2),4.+cx5*12.)*.5;float rip=.5+.5*ww*.2;det=rip*(.2+cx2*.4)+caus*(.35+lx4*1.2);}",
            sliders: [["Water amount", "lx3", "pct", 0, 1.5, 0.01, 0.8], ["Water shine", "lx4", "pct", 0, 1, 0.01, 0.6], ["Water speed", "lx5", "pct", 0, 1, 0.01, 0.4], ["Ripple size", "cx1", "pct", 0, 1, 0.01, 0.5], ["Ripple density", "cx2", "pct", 0, 1, 0.01, 0.5], ["Ripple direction", "cx4", "deg", 0, 360, 1, 0], ["Caustic sharpness", "cx5", "pct", 0, 1, 0.01, 0.6]], fit: ["cx1", "cx5", "lx4", "lx3"] },
          rays: { name: "Rays", glsl: "float det=0.;{float a=r.x/r.y;vec2 ro=vec2((cx4/360.-.5)*2.4*a,(cx5-.5)*3.);vec2 q=p-ro;float an=atan(q.x,q.y),d=length(q);float nr=4.+cx2*40.;float rr=fbm(vec2(an*nr*.16,d*.4)+S+C(1.)*.3*lx5);float beam=smoothstep(.55-lx4*.3,.9,rr);det=beam*exp(-d*(.3+(1.-cx1)*1.5))*1.6+exp(-d*1.2)*.3;}",
            sliders: [["Ray amount", "lx3", "pct", 0, 1.5, 0.01, 0.9], ["Ray width", "lx4", "pct", 0, 1, 0.01, 0.5], ["Ray flicker", "lx5", "pct", 0, 1, 0.01, 0.3], ["Ray length", "cx1", "pct", 0, 1, 0.01, 0.6], ["Ray count", "cx2", "pct", 0, 1, 0.01, 0.4], ["Ray origin across", "cx4", "deg", 0, 360, 1, 180], ["Ray origin height", "cx5", "pct", 0, 1, 0.01, 0.9]], fit: ["cx4", "cx5", "cx2", "cx1", "lx4", "lx3"] },
          bands: { name: "Bands", glsl: "float det=0.;{float ba=cx4*0.01745;vec2 bd=vec2(cos(ba),sin(ba));float u=dot(p,bd)*(1.+cx1*14.)+PH()*floor(lx5*4.+.5)+sin(dot(p,vec2(bd.y,-bd.x))*2.+TH)*cx5*.3;float b=.5+.5*cos(u*6.28318);det=pow(b,1.+(1.-lx4)*5.);}",
            sliders: [["Band amount", "lx3", "pct", 0, 1.5, 0.01, 0.8], ["Band softness", "lx4", "pct", 0, 1, 0.01, 0.6], ["Band speed", "lx5", "pct", 0, 1, 0.01, 0.25], ["Band count", "cx1", "pct", 0, 1, 0.01, 0.3], ["Band angle", "cx4", "deg", 0, 180, 1, 90], ["Band wobble", "cx5", "pct", 0, 1, 0.01, 0.2]], fit: ["cx4", "cx1", "lx4", "lx3"] },
          texture: { name: "Texture", glsl: "float det=0.;{float tf=1.+cx1*6.;float tx=fbm(p*tf+C(1.)*.3*lx5+S+3.)*1.2-.3;det=clamp(tx,0.,1.)*(.4+lx4*.9);}",
            sliders: [["Texture amount", "lx3", "pct", 0, 1.5, 0.01, 0.6], ["Texture contrast", "lx4", "pct", 0, 1, 0.01, 0.5], ["Texture drift", "lx5", "pct", 0, 1, 0.01, 0.3], ["Texture size", "cx1", "pct", 0, 1, 0.01, 0.5]], fit: ["cx1", "lx4", "lx3"] }
        }
      };
      function compose(baseGlsl, detGlsl, haze) { return baseGlsl + "\n" + detGlsl + "\nreturn base*lx1*.9+det*lx3+" + (+haze).toFixed(3) + ";"; }   // always a float literal: "+0" would not compile
      // measurements of a 224x126 grey band, the same for the footage and for every candidate render
      function measure(G) { var t = texture(G), st = stats(G), lay = [], d = down(G, 7, 4); for (var i = 0; i < 28; i++) lay.push((d.g[i] - st.m) / (st.sd + 1e-3)); var b = blobs(G);   // full resolution: fine sparkle survives
        return { ori: t.ori, aniso: t.aniso, edges: t.edges, mean: st.m / 255, sd: st.sd / 255, lay: lay, blobs: Math.min(1, b.n / 900), rad: Math.min(1, b.rad / 12), stroke: t.stroke }; }
      function mdist(a, b, w) { var o = 0; for (var i = 0; i < 8; i++) o += Math.abs(a.ori[i] - b.ori[i]); var l = 0; for (i = 0; i < 28; i++) l += Math.abs(a.lay[i] - b.lay[i]); l /= 28;
        return o * (w.ori || 1) + Math.abs(a.aniso - b.aniso) * (w.aniso || 1) + Math.abs(a.edges - b.edges) * (w.edges || 1) + Math.abs(a.sd - b.sd) * (w.sd || 1) + Math.abs(a.mean - b.mean) * (w.mean || 0.5) + l * (w.lay || 1) + Math.abs(a.blobs - b.blobs) * (w.blobs || 1) + Math.abs(a.rad - b.rad) * (w.rad || 0.5); }
      var W_BASE = { ori: 0.3, aniso: 0.5, edges: 0.3, sd: 2.5, mean: 1.5, lay: 2.5, blobs: 0, rad: 0 }, W_DET = { ori: 2.5, aniso: 2, edges: 3, sd: 2, mean: 0.8, lay: 0.4, blobs: 4, rad: 1.5 };
      // render a scratch look with a parameter set and give back its grey (a band of it when asked)
      function renderGrey(id, params, ph, band) { var g = thumbGL(); if (!g) return null; var st = thumbState("look", id); Object.keys(params).forEach(function (k) { st[k] = params[k]; }); st.c0 = "000000"; st.c1 = "555555"; st.c2 = "aaaaaa"; st.c3 = "ffffff"; st.palette = -1; st.glow = 1; st.dark = 0.45;
        var pg = thumbProg(st.look, st.finish, st); if (!pg) return null; g.useProgram(pg.p); g.uniform2f(pg.u.r, TB.W, TB.H); g.uniform1f(pg.u.seed, seed); setUniforms(g, pg.u, st); g.uniform1f(pg.u.th, ph); g.drawArrays(g.TRIANGLES, 0, 3);
        var px = new Uint8Array(TB.W * TB.H * 4); g.readPixels(0, 0, TB.W, TB.H, g.RGBA, g.UNSIGNED_BYTE, px); var G = { g: new Float32Array(TB.W * TB.H), W: TB.W, H: TB.H };
        for (var y = 0; y < TB.H; y++) for (var x = 0; x < TB.W; x++) { var o = ((TB.H - 1 - y) * TB.W + x) * 4; G.g[y * TB.W + x] = px[o] * 0.3 + px[o + 1] * 0.59 + px[o + 2] * 0.11; }
        if (band === "low") return upLow(down(G, 56, 32)); if (band === "high") { var U = upLow(down(G, 56, 32)); for (var i = 0; i < G.g.length; i++) G.g[i] = G.g[i] - U.g[i] + 128; } return G; }
      function waitProg(id, params) { return new Promise(function (ok) { var n = 0; (function tick() { if (renderGrey(id, params, 1.3, null) || ++n > 400) ok(); else requestAnimationFrame(tick); })(); }); }
      function defaults(tpl) { var o = {}; tpl.sliders.forEach(function (sl) { o[sl[1]] = sl[6]; }); return o; }
      function range(tpl, k) { for (var i = 0; i < tpl.sliders.length; i++) if (tpl.sliders[i][1] === k) return tpl.sliders[i]; return null; }
      // coordinate search: each fit parameter tried at 7 points across its range, best kept, two sweeps, then a finer sweep
      function search(id, tpl, target, band, weights, fixed) { var P = Object.assign(defaults(tpl), fixed || {}); var best = 1e9;
        function score(params) { var G = renderGrey(id, params, 1.3, band); if (!G) return 1e9; return mdist(measure(G), target, weights); }
        best = score(P);
        for (var sweep = 0; sweep < 3; sweep++) { var span = sweep < 2 ? 1 : 0.25;
          tpl.fit.forEach(function (k) { var sl = range(tpl, k); if (!sl) return; var lo = sl[3], hi = sl[4], c = P[k], bk = c, bs = best; var a0 = sweep < 2 ? lo : Math.max(lo, c - (hi - lo) * span / 2), a1 = sweep < 2 ? hi : Math.min(hi, c + (hi - lo) * span / 2);
            for (var i = 0; i < 7; i++) { var v = a0 + (a1 - a0) * i / 6; if (sl[5] >= 1) v = Math.round(v); var trial = Object.assign({}, P); trial[k] = v; var sc = score(trial); if (sc < bs) { bs = sc; bk = v; } }
            P[k] = bk; best = bs; }); }
        return { params: P, score: best }; }
      // speed: how much the render changes over a quarter second of the loop versus the footage pair
      function fitSpeed(id, tpl, P, footChange) { var sl = range(tpl, "lx5"); if (!sl || footChange == null) return P; var bestK = P.lx5, bd = 1e9;
        for (var i = 0; i < 7; i++) { var v = sl[3] + (sl[4] - sl[3]) * i / 6; if (sl[5] >= 1) v = Math.round(v); var t = Object.assign({}, P, { lx5: v }); var A = renderGrey(id, t, 1.3, null), B = renderGrey(id, t, 1.3 + 6.28318 * 0.25 / 12, null); if (!A || !B) continue;
          var ch = tdiff(A, B) / (stats(A).sd + 1e-3); var d = Math.abs(ch - footChange); if (d < bd) { bd = d; bestK = v; } }
        P.lx5 = bestK; return P; }
      async function fitBySynthesis(frames, pairs, dt, progress) {
        var bi = 0, bs = -1; frames.forEach(function (c, i) { var v = colourful(c); if (v > bs && stats(grey(c, 56, 32)).sd > 2) { bs = v; bi = i; } });
        var c0 = frames[bi], G = grey(c0, 224, 126), LOW = upLow(grey(c0, 56, 32)), HIGH = highBand(c0), stG = stats(G);
        var tLow = measure(LOW), tHigh = measure(HIGH), hs = stats(HIGH), energy = hs.sd / 255;
        var fc = null; if (pairs.length) { var cs = []; pairs.forEach(function (pr) { var A = grey(pr[0], 224, 126), B = grey(pr[1], 224, 126); cs.push(tdiff(A, B) / (stats(A).sd + 1e-3)); }); cs.sort(); fc = cs[cs.length >> 1]; }
        var haze = clamp(r2(stG.m / 255 * 0.2), 0.02, 0.1), results = { base: [], detail: [] }, n = 0, total = Object.keys(LIB.base).length + (energy > 0.02 ? Object.keys(LIB.detail).length : 0);
        for (var bk in LIB.base) { var tpl = LIB.base[bk]; var id = window.__scratchLook(compose(tpl.glsl, "float det=0.;", 0)); await waitProg(id, defaults(tpl)); var r = search(id, tpl, tLow, "low", W_BASE, { lx3: 0 }); results.base.push({ key: bk, tpl: tpl, id: id, params: r.params, score: r.score }); if (progress) progress(++n, total); }
        results.base.sort(function (a, b) { return a.score - b.score; }); var base = results.base[0];
        var det = null;
        if (energy > 0.02) { for (var dk in LIB.detail) { var tp2 = LIB.detail[dk]; var id2 = window.__scratchLook(compose("float base=0.;", tp2.glsl, 0)); await waitProg(id2, defaults(tp2)); var r2_ = search(id2, tp2, tHigh, "high", W_DET, { lx1: 0 }); results.detail.push({ key: dk, tpl: tp2, id: id2, params: r2_.params, score: r2_.score }); if (progress) progress(++n, total); }
          results.detail.sort(function (a, b) { return a.score - b.score; }); det = results.detail[0]; det.params = fitSpeed(det.id, det.tpl, det.params, fc); }
        // joint pass: the two amounts against the whole frame (mean, contrast, layout), so the sum matches, not just each band
        var tFull = measure(G), both = Object.assign({}, base.params, det ? det.params : {});
        var jid = window.__scratchLook(compose(base.tpl.glsl, det ? det.tpl.glsl : "float det=0.;", haze)); await waitProg(jid, both);
        var WJ = { ori: 0.3, aniso: 0.3, edges: 0.6, sd: 3, mean: 3, lay: 1.5, blobs: 0.3, rad: 0.2 }, bestJ = 1e9, bA = both.lx1, bD = both.lx3 || 0;
        for (var ia = 0; ia < 8; ia++) for (var idd = 0; idd < (det ? 8 : 1); idd++) { var tA = ia / 7 * 1.5, tD = idd / 7 * 1.5; var tr = Object.assign({}, both, { lx1: tA, lx3: tD }); var Gj = renderGrey(jid, tr, 1.3, null); if (!Gj) continue; var sc = mdist(measure(Gj), tFull, WJ); if (sc < bestJ) { bestJ = sc; bA = tA; bD = tD; } }
        for (var fa2 = 0; fa2 < 2; fa2++) for (var ia2 = -2; ia2 <= 2; ia2++) for (var id2 = -2; id2 <= (det ? 2 : -2); id2++) { var tA2 = clamp(bA + ia2 * 0.06, 0, 1.5), tD2 = clamp(bD + id2 * 0.06, 0, 1.5); var tr2 = Object.assign({}, both, { lx1: tA2, lx3: tD2 }); var Gj2 = renderGrey(jid, tr2, 1.3, null); if (!Gj2) continue; var sc2 = mdist(measure(Gj2), tFull, WJ); if (sc2 < bestJ) { bestJ = sc2; bA = tA2; bD = tD2; } }
        base.params.lx1 = bA; if (det) det.params.lx3 = bD;
        // the look: both elements, fitted values as slider defaults
        var sliders = [], seen = {};
        function take(tpl, P) { tpl.sliders.forEach(function (sl) { if (seen[sl[1]]) return; seen[sl[1]] = 1; var row = sl.slice(); row[6] = +(+P[sl[1]]).toFixed(sl[5] >= 1 ? 0 : 2); sliders.push(row); }); }
        take(base.tpl, base.params); if (det) take(det.tpl, det.params);
        var glsl = compose(base.tpl.glsl, det ? det.tpl.glsl : "float det=0.;", haze);
        var elements = [{ name: base.tpl.name, sliders: base.tpl.sliders.map(function (s) { return s[1]; }) }]; if (det) elements.push({ name: det.tpl.name, sliders: det.tpl.sliders.map(function (s) { return s[1]; }) });
        var desc = base.tpl.name.toLowerCase() + " base" + (det ? " · " + det.tpl.name.toLowerCase() + " detail" : "");
        return { kind: base.key + "+" + (det ? det.key : "none"), glsl: glsl, sliders: sliders, elements: elements, desc: desc, fit: { base: results.base.map(function (x) { return x.key + ":" + r2(x.score); }), detail: results.detail.map(function (x) { return x.key + ":" + r2(x.score); }), change: fc == null ? null : r2(fc), energy: r2(energy) } };
      }
      function fit(frames, pairs, dt) { return fitElements(frames, pairs, dt); }
      function thumbInto(img, id) { var tries = 0; img.removeAttribute("src"); (function thumb() { var url = drawThumb("look", id); if (url === null && ++tries < 300) { requestAnimationFrame(thumb); return; } if (url) img.src = url; })(); }
      function showResult(def, cols, frame) {
        if (frame) { srcImg.src = frame.toDataURL("image/jpeg", 0.85); palEl.innerHTML = cols.map(function (c) { return '<i style="background:#' + c + '" title="#' + c + '"></i>'; }).join(""); } else { srcImg.removeAttribute("src"); palEl.innerHTML = ""; }
        outName.textContent = def.name; fitEl.textContent = def.desc || def.about || ""; res.hidden = false; foot.hidden = false; thumbInto(outImg, def.id);
      }
      function run(file) {
        if (busy) return; busy = true; res.hidden = true; foot.hidden = true; label.textContent = file.name; say("Reading " + (/^image\//.test(file.type) ? "the image" : "the video") + "…");
        framesFrom(file).then(function (fr) {
          say("Measuring…");
          setTimeout(async function () { try {
            var cols = palette(fr.frames), def = await fitBySynthesis(fr.frames, fr.pairs, fr.dt, function (k, n) { say("Fitting elements " + k + " of " + n + "…"); });
            def.name = file.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").slice(0, 40) || "Converted look"; def.about = "Converted from " + file.name + ": " + def.desc + ".";
            COLORS.forEach(function (c, n) { s[c] = cols[n]; }); s.palette = -1; var id = window.__installCustom(def, true); last = { def: def, cols: cols }; lastFile = file; exactImg.src = fr.frames[Math.min(1, fr.frames.length - 1)].toDataURL("image/jpeg", 0.85); useFootage();
            if (id == null) { say("The conversion didn't produce a usable look."); busy = false; return; }
            showResult(window.__customLook, cols, fr.frames[Math.min(1, fr.frames.length - 1)]); say("Your footage is on the preview, adjustable. Rebuilt in code as " + def.desc + ", one click away.");
          } catch (e) { say("Conversion failed: " + (e && e.message || e)); } busy = false; }, 30);
        }, function (err) { say(String(err)); busy = false; });
      }
      function useFootage() { if (!lastFile || !window.__useVideoFile) return; if (last) { COLORS.forEach(function (c, n) { s[c] = last.cols[n]; }); s.palette = -1; } s.vtint = 0; s.vspeed = 1; s.grain = 0; s.finish = 0; window.__useVideoFile(lastFile); }
      exactBtn.addEventListener("click", function () { useFootage(); say("Your footage is on the preview. Palette tint, Speed, Scale and Position are in its settings; finishes and movement work on top."); var sc = document.querySelector(".studio-screen"); if (sc && sc.scrollIntoView) sc.scrollIntoView({ behavior: "smooth", block: "start" }); });
      useBtn.addEventListener("click", function () { if (!window.__customLook) return; var d = window.__customLook; s.look = d.id; Object.assign(s, LOOK_DEFAULTS[d.id] || {}); if (last) { COLORS.forEach(function (c, n) { s[c] = last.cols[n]; }); s.palette = -1; } sync(); var sc = document.querySelector(".studio-screen"); if (sc && sc.scrollIntoView) sc.scrollIntoView({ behavior: "smooth", block: "start" }); });
      dlBtn.addEventListener("click", function () { var txt = window.__customLookFile && window.__customLookFile(); if (!txt) return; var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([txt], { type: "application/json" })); a.download = (window.__customLook.name || "look").replace(/[^\w ]+/g, "").trim().replace(/ +/g, "-") + ".altarlook"; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500); });
      openIn.addEventListener("change", function () { var f = openIn.files && openIn.files[0]; if (!f) return; var rd = new FileReader(); rd.onload = function () { try { var d = JSON.parse(rd.result); if (!d || !d.glsl) throw 0; var id = window.__installCustom(d, false); if (id == null) throw 0; last = null; showResult(window.__customLook, [], null); say("Opened " + window.__customLook.name + "."); } catch (e) { say("That isn't an Altar look file."); } }; rd.readAsText(f); });
      fileIn.addEventListener("change", function () { if (fileIn.files && fileIn.files[0]) run(fileIn.files[0]); });
      ["dragenter", "dragover"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("over"); }); });
      ["dragleave", "drop"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("over"); }); });
      drop.addEventListener("drop", function (e) { var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; if (f) run(f); });
      window.__conv = { fit: fit, fitBySynthesis: fitBySynthesis, LIB: LIB, measure: measure, renderGrey: renderGrey, search: search, palette: palette, grey: grey, texture: texture, runs: runs, blobs: blobs, flow: flow, flowAlong: flowAlong, framesFrom: framesFrom, highBand: highBand, tdiff: tdiff, stats: stats, planeFit: planeFit, pct: pct, down: down, FW: 224, FH: 126 };   // test hook
    })();
    function pump() {
      var t0 = performance.now(), wait = [];
      while (TB.queue.length && performance.now() - t0 < 6) { if (pendingUse || slow > 4) break; var job = TB.queue.shift(); if (job.sig !== TB.sig[job.k] || !job.img.__vis) continue;
        var pkey = job.k === "look" ? job.i + "/0" : s.look + "/" + job.i, fresh = !TB.progs[pkey];
        if (fresh && !TB.ext) { if (t0 - (TB.lastC || 0) < 180) { wait.push(job); continue; } TB.lastC = t0; }   // no background compile here: at most one every 180 ms, so the preview keeps playing
        var url = drawThumb(job.k, job.i); if (url === false) { TB.queue = []; wait = []; break; } if (url === null) { wait.push(job); continue; } job.img.__src = 1; job.img.src = url; job.img.__sig = job.sig; }
      TB.queue = wait.concat(TB.queue);
      if (TB.queue.length) requestAnimationFrame(pump); else TB.busy = false;
    }
    function kickThumbs() { if (TB.queue.length && !TB.busy) { TB.busy = true; requestAnimationFrame(pump); } }
    function colorSig() { return [s.c0, s.c1, s.c2, s.c3, s.p1, s.p2].join(); }
    function thumbSig(k) { return k === "look" || !TB.ext ? colorSig() : [colorSig(), s.look, s.lx1, s.lx2, s.lx3, s.lx4, s.lx5, s.flow, s.scale, s.warp, s.glow, s.dark].join(); }
    function watchThumbs() {
      if (TB.io) return; thumbGL();
      TB.io = new IntersectionObserver(function (es) { es.forEach(function (e) { var img = e.target; img.__vis = e.isIntersecting; if (img.__vis && img.dataset.src && !img.__src) { img.__src = 1; img.src = img.dataset.src; } if (img.__vis && TB.sig[img.__k] && img.__sig !== TB.sig[img.__k]) TB.queue.push({ k: img.__k, i: img.__i, img: img, sig: TB.sig[img.__k] }); }); kickThumbs(); }, { rootMargin: "40px" });
      var EMBER = [DEFAULTS.c0, DEFAULTS.c1, DEFAULTS.c2, DEFAULTS.c3, DEFAULTS.p1, DEFAULTS.p2].join();
      ["look", "finish"].forEach(function (k) { form.querySelectorAll('[data-k="' + k + '"] button').forEach(function (b) { var img = b.querySelector("img:not([data-static])"); if (!img) return; img.__k = k; img.__i = +b.dataset.i; if (k === "look" || !TB.ext) img.__sig = EMBER; TB.io.observe(img); }); });
    }
    var thumbTimer = 0;
    function refreshThumbs() {
      clearTimeout(thumbTimer);
      thumbTimer = setTimeout(function () {
        watchThumbs();
        ["look", "finish"].forEach(function (k) {
          var sig = thumbSig(k); if (sig === TB.sig[k]) return; TB.sig[k] = sig;
          TB.queue = TB.queue.filter(function (j) { return j.k !== k; });
          form.querySelectorAll('[data-k="' + k + '"] button').forEach(function (b) { var img = b.querySelector("img:not([data-static])"); if (img && img.__vis && img.__sig !== sig) TB.queue.push({ k: k, i: +b.dataset.i, img: img, sig: sig }); });
        });
        kickThumbs();
      }, 250);
    }
    document.addEventListener("click", function (e) { if (e.target.closest("[data-tab]")) setTimeout(refreshThumbs, 40); }); seg("reedShape", ["Straight", "Circular", "Radial", "Arch"]); seg("orbIn", ["Cloud", "Rings", "Swirl", "Stars", "Flow", "Empty"]);
    form.querySelectorAll('[data-k="orbIn"] button[data-i="1"], [data-k="orbIn"] button[data-i="2"]').forEach(function (b) { b.remove(); });   // Rings and Swirl retired (2026-10-31); old designs that use them still render
    // screen size: the preview takes the shape of the screen it's for, and the render code carries the size to Altar Render
    var PRESET_SIZES = [["16:9", 1920, 1080], ["Ultrawide", 3840, 1080], ["Triple wide", 5760, 1080], ["Vertical", 1080, 1920], ["Square", 1080, 1080]];
    // saved sizes: your own screens, kept in this browser (name, width, height); they sit between the presets and Custom
    var MYSZ_KEY = "altar-my-sizes", mySizes = [];
    try { mySizes = (JSON.parse(localStorage.getItem(MYSZ_KEY)) || []).filter(function (z) { return z && z.w > 0 && z.h > 0; }).slice(0, 20); } catch (e) { mySizes = []; }
    function SIZES() { return PRESET_SIZES.concat(mySizes.map(function (z) { return [z.name, z.w, z.h, true]; }), [["Custom"]]); }
    var szSeg = document.getElementById("screen-size"), szBox = document.getElementById("size-custom"), szW = document.getElementById("size-w"), szH = document.getElementById("size-h");
    var szMy = document.getElementById("size-my"), szName = document.getElementById("size-name"), szForgetRow = document.getElementById("size-forget-row");
    var customOn = false, lastAR = 0;
    function escSz(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
    function drawSizes() { szSeg.innerHTML = SIZES().map(function (z, i) { return '<button type="button" data-i="' + i + '"' + (z[3] ? ' title="' + z[1] + ' × ' + z[2] + ' · saved size"' : "") + '>' + escSz(z[0]) + "</button>"; }).join(""); }
    function saveSizes() { try { localStorage.setItem(MYSZ_KEY, JSON.stringify(mySizes)); } catch (e) {} drawSizes(); }
    drawSizes();
    szSeg.addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; var z = SIZES()[+b.dataset.i];
      customOn = !z[1]; if (z[1]) { s.w = z[1]; s.h = z[2]; } sync(); if (customOn) szW.focus(); });
    function px(v, d) { var n = parseInt(String(v).replace(/[^0-9]/g, ""), 10); return n ? Math.max(16, Math.min(16384, n)) & ~1 : d; }
    [szW, szH].forEach(function (inp) { inp.addEventListener("change", function () { s.w = px(szW.value, s.w); s.h = px(szH.value, s.h); sync(); });
      inp.addEventListener("keydown", function (e) { if (e.key === "Enter") inp.blur(); }); });
    document.getElementById("size-save").addEventListener("click", function () {
      s.w = px(szW.value, s.w); s.h = px(szH.value, s.h);
      var name = szName.value.trim() || (s.w + " × " + s.h);
      mySizes = mySizes.filter(function (z) { return !(z.w === s.w && z.h === s.h) && z.name !== name; });
      if (mySizes.length >= 20) mySizes.shift();
      mySizes.push({ name: name, w: s.w, h: s.h }); szName.value = ""; customOn = false; saveSizes(); sync();
      msg.textContent = "Saved “" + name + "” (" + s.w + " × " + s.h + "). It's in the Screen size list on this browser.";
    });
    szName.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); document.getElementById("size-save").click(); } });
    document.getElementById("size-forget").addEventListener("click", function () {
      var gone = mySizes.filter(function (z) { return z.w === s.w && z.h === s.h; });
      mySizes = mySizes.filter(function (z) { return !(z.w === s.w && z.h === s.h); }); customOn = true; saveSizes(); sync();
      if (gone.length) msg.textContent = "Removed “" + gone[0].name + "”. The size stays as it is until you pick another.";
    });
    function frame() {
      var all = SIZES(), pre = -1; all.forEach(function (z, i) { if (z[1] === s.w && z[2] === s.h && (pre < 0 || !z[3])) pre = i; });   // a preset wins over a saved copy of it
      var pick = customOn || pre < 0 ? all.length - 1 : pre;
      szSeg.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", +b.dataset.i === pick); });
      szBox.hidden = pick !== all.length - 1; szMy.hidden = szBox.hidden;
      szForgetRow.hidden = !(pick >= 0 && pick < all.length - 1 && all[pick][3]);
      if (document.activeElement !== szW) szW.value = s.w; if (document.activeElement !== szH) szH.value = s.h;
      var ar = s.w / s.h, g = function (a, b) { return b ? g(b, a % b) : a; }, d = g(s.w, s.h);
      document.getElementById("size-note").textContent = s.w + " × " + s.h + " px · " + (s.w / d) + ":" + (s.h / d) + (s.w * 9 === s.h * 16 ? " · renders at HD or 4K" : " · Altar Render renders at this size");
      if (ar === lastAR) return; lastAR = ar;
      var scr = cv.parentNode; scr.style.aspectRatio = s.w + " / " + s.h; scr.style.width = "min(100%, calc(70vh * " + ar.toFixed(4) + "))";
      if (typeof size === "function" && gl) size();
    }
    var sw = form.querySelector('[data-k="palette"]');
    sw.innerHTML = PALETTES.map(function (p, i) { return '<button type="button" data-i="' + i + '" title="' + p[0] + '" aria-label="' + p[0] + '" style="background:linear-gradient(135deg,rgb(' + p[2] + "),rgb(" + p[3] + "),rgb(" + p[4] + '))"></button>'; }).join("");
    sw.addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; var P = PALETTES[+b.dataset.i];
      s.palette = +b.dataset.i; COLORS.forEach(function (c, i) { s[c] = hex(P[i + 1]); }); s.p1 = 0.35; s.p2 = 0.7; sync(); });
    // "My colors": saved palettes, in this browser and (signed in) on the account, shared with Altar Live (/api/palettes).
    // In the browser they live under one key per account (altar-my-colors:<account>), plus the anonymous key for a
    // signed-out visitor, so two people sharing a church computer never see or upload each other's bank. Palettes a
    // visitor saved before signing in are offered, not merged: one click adds them to the account.
    // Names and notes are set with textContent: a palette name is text, never markup.
    var MY_ANON = "altar-my-colors", myKey = MY_ANON, my = [], myEl = document.getElementById("my-colors"), mySigned = false, myNaming = false, myRev = 0, myOffer = null;
    function myLoad(key) { try { var l = JSON.parse(localStorage.getItem(key) || "[]"); return Array.isArray(l) ? l.filter(function (p) { return p && Array.isArray(p.c) && p.c.length === 4; }) : []; } catch (e) { return []; } }
    function myHash(str) { var h = 5381; for (var i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }
    my = myLoad(MY_ANON);
    function myCurrent() { for (var i = 0; i < my.length; i++) { var p = my[i]; if (p.c.join() === [s.c0, s.c1, s.c2, s.c3].join() && Math.abs(p.p1 - s.p1) < 0.011 && Math.abs(p.p2 - s.p2) < 0.011) return p; } return null; }
    function myStore(push, note) {
      try { localStorage.setItem(myKey, JSON.stringify(my)); } catch (e) {}
      drawMy(note);
      if (push && mySigned) fetch("/api/palettes", { method: "PUT", headers: { "content-type": "application/json" }, credentials: "same-origin", body: JSON.stringify({ palettes: my, updated: myRev }) })
        .then(function (r) { return r.json().then(function (j) { return { status: r.status, j: j }; }); })
        .then(function (x) {
          if (x.status === 409 && x.j && x.j.palettes) { my = x.j.palettes; myRev = x.j.updated || 0; try { localStorage.setItem(myKey, JSON.stringify(my)); } catch (e) {} drawMy("Your colors changed on another device, so this bank was reloaded."); return; }
          if (x.j && typeof x.j.updated === "number") myRev = x.j.updated;
        }).catch(function () {});
    }
    function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
    function drawMy(note) {
      if (!myEl) return;
      var cur = myCurrent();
      myEl.textContent = "";
      var head = el("div", "my-head"); head.appendChild(el("span", "lab", "My colors"));
      if (note) head.appendChild(el("span", "my-note", note)); else if (!my.length) head.appendChild(el("span", "my-note", "Save a mix you like; it shows here and in Altar Live."));
      myEl.appendChild(head);
      if (my.length) {
        var row = el("div", "my-row");
        my.forEach(function (p, i) {
          var b = el("button", "pal"); b.type = "button"; b.dataset.my = i; b.title = p.name; b.setAttribute("aria-label", p.name); b.setAttribute("aria-pressed", String(p === cur));
          b.style.background = "linear-gradient(135deg,#" + p.c[1] + ",#" + p.c[2] + ",#" + p.c[3] + ")"; row.appendChild(b);
        });
        myEl.appendChild(row);
      }
      var act = el("div", "my-row my-actions");
      if (myNaming) {
        var inp = el("input", "hex my-name"); inp.type = "text"; inp.maxLength = 40; inp.placeholder = "Name these colors"; inp.setAttribute("aria-label", "Name"); act.appendChild(inp);
        var sv = el("button", "btn small primary", "Save"); sv.type = "button"; sv.dataset.myAct = "save"; act.appendChild(sv);
        var cn = el("button", "btn small", "Cancel"); cn.type = "button"; cn.dataset.myAct = "cancel"; act.appendChild(cn);
      } else {
        var nw = el("button", "btn small", cur ? "Saved as “" + cur.name + "”" : "Save these colors"); nw.type = "button"; nw.dataset.myAct = "new"; if (cur) { nw.disabled = true; nw.title = "Saved as " + cur.name; } act.appendChild(nw);
        if (cur) { var rm = el("button", "btn small", "Remove"); rm.type = "button"; rm.dataset.myAct = "remove"; act.appendChild(rm); }
        if (myOffer && myOffer.length) { var im = el("button", "btn small", "Add " + myOffer.length + " from this browser"); im.type = "button"; im.dataset.myAct = "import"; im.title = "Colors saved here before you signed in"; act.appendChild(im); }
      }
      act.appendChild(el("span", "my-note", mySigned ? "On your account" : "In this browser · sign in to keep them on your account"));
      myEl.appendChild(act);
      if (myNaming) { var f = myEl.querySelector(".my-name"); if (f) f.focus(); }
    }
    if (myEl) {
      myEl.addEventListener("click", function (e) {
        var b = e.target.closest("button"); if (!b) return;
        if (b.dataset.my !== undefined) { var p = my[+b.dataset.my]; COLORS.forEach(function (c, i) { s[c] = p.c[i]; }); s.p1 = p.p1; s.p2 = p.p2; s.palette = -1; sync(); return; }
        var act = b.dataset.myAct;
        if (act === "new") { myNaming = true; drawMy(); }
        if (act === "cancel") { myNaming = false; drawMy(); }
        if (act === "save") {
          var inp = myEl.querySelector(".my-name"), name = (inp && inp.value.trim()) || ("Colors " + (my.length + 1));
          var p2 = { name: name.slice(0, 40), c: [s.c0, s.c1, s.c2, s.c3], p1: s.p1, p2: s.p2 };
          my = my.filter(function (q) { return q.c.join() !== p2.c.join(); }); my.unshift(p2); if (my.length > 60) my.length = 60;
          myNaming = false; myStore(true, "Saved “" + p2.name + "”");
        }
        if (act === "remove") { var c = myCurrent(); if (c) { my = my.filter(function (q) { return q !== c; }); myStore(true, "Removed “" + c.name + "”"); } }
        if (act === "import" && myOffer) {
          var add = myOffer.filter(function (l) { return !my.some(function (p) { return p.c.join() === l.c.join(); }); });
          my = my.concat(add).slice(0, 60); myOffer = null; try { localStorage.removeItem(MY_ANON); } catch (e) {}
          myStore(true, "Added " + add.length + " to your account");
        }
      });
      myEl.addEventListener("keydown", function (e) { if (e.key === "Enter" && e.target.classList.contains("my-name")) { e.preventDefault(); var b = myEl.querySelector('[data-my-act="save"]'); if (b) b.click(); } });
      drawMy();
      // signed in: the account's bank is the truth; anything saved in this browser before signing in is offered, not merged
      fetch("/api/palettes", { credentials: "same-origin" }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
        if (!j || !j.palettes) return; mySigned = true; myRev = j.updated || 0;
        var anon = my;
        myKey = MY_ANON + ":" + myHash(String(j.email || "account"));
        my = j.palettes;
        var onlyHere = anon.filter(function (l) { return !my.some(function (p) { return p.c.join() === l.c.join(); }); });
        myOffer = onlyHere.length ? onlyHere : null;
        try { localStorage.setItem(myKey, JSON.stringify(my)); } catch (e) {}
        drawMy();
      }).catch(function () {});
    }
    // hex codes: "#ff6a2c", "ff6a2c" or short "f60"; valid codes apply as you type, invalid ones are only marked
    function parseHex(v) {
      v = String(v).trim().replace(/^#/, "").toLowerCase();
      if (/^[0-9a-f]{3}$/.test(v)) v = v.replace(/./g, "$&$&");
      return /^[0-9a-f]{6}$/.test(v) ? v : null;
    }
    form.querySelectorAll("input[data-hex]").forEach(function (inp) {
      inp.addEventListener("input", function () {
        var v = parseHex(inp.value); inp.classList.toggle("bad", !v && inp.value.trim() !== "");
        if (v) { s[inp.dataset.hex] = v; s.palette = -1; sync(inp); if (cur === inp.dataset.hex) { hsv = toHsv(v); drawWheel(); paintPicker(); } }
      });
      inp.addEventListener("blur", function () { inp.value = "#" + s[inp.dataset.hex]; inp.classList.remove("bad"); });
    });
    // color wheel: click a gradient color to open it; hue around the ring, saturation out from the middle, brightness below
    var picker = document.getElementById("picker"), wheel = document.getElementById("wheel"), wx = wheel.getContext("2d"), pv = document.getElementById("pv"), cur = null, hsv = [0, 0, 1];
    function toHsv(h) { var c = rgb(h), mx = Math.max.apply(0, c), mn = Math.min.apply(0, c), d = mx - mn, hu = 0;
      if (d) hu = mx === c[0] ? ((c[1] - c[2]) / d + 6) % 6 : mx === c[1] ? (c[2] - c[0]) / d + 2 : (c[0] - c[1]) / d + 4;
      return [hu * 60, mx ? d / mx : 0, mx]; }
    function fromHsv(h, sa, v) { var f = function (n) { var k = (n + h / 60) % 6; return Math.round(255 * (v - v * sa * Math.max(0, Math.min(k, 4 - k, 1)))); }; return hex([f(5), f(3), f(1)]); }
    function drawWheel() {
      var W = wheel.width, R = W / 2, img = wx.createImageData(W, W), d = img.data;
      for (var y = 0; y < W; y++) for (var x = 0; x < W; x++) {
        var dx = x - R, dy = y - R, r = Math.sqrt(dx * dx + dy * dy) / (R - 2), i = (y * W + x) * 4;
        if (r > 1) { d[i + 3] = 0; continue; }
        var c = rgb(fromHsv((Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360, r, hsv[2]));
        d[i] = c[0] * 255; d[i + 1] = c[1] * 255; d[i + 2] = c[2] * 255; d[i + 3] = 255 * Math.min(1, (1 - r) * R / 1.5);
      }
      wx.putImageData(img, 0, 0);
      var a = hsv[0] * Math.PI / 180, mx = R + Math.cos(a) * hsv[1] * (R - 2), my = R + Math.sin(a) * hsv[1] * (R - 2);
      wx.lineWidth = 4; wx.strokeStyle = "rgba(0,0,0,.6)"; wx.beginPath(); wx.arc(mx, my, 13, 0, 7); wx.stroke();
      wx.lineWidth = 3; wx.strokeStyle = "#fff"; wx.beginPath(); wx.arc(mx, my, 11, 0, 7); wx.stroke();
    }
    function applyHsv() { s[cur] = fromHsv(hsv[0], hsv[1], hsv[2]); s.palette = -1; drawWheel(); sync(); paintPicker(); }
    function paintPicker() {
      document.getElementById("picker-chip").style.background = "#" + s[cur];
      document.getElementById("pv-out").textContent = Math.round(hsv[2] * 100) + "%";
      pv.value = hsv[2]; pv.style.setProperty("--fill", hsv[2] * 100 + "%");
      pv.style.background = "linear-gradient(90deg, #000, #" + fromHsv(hsv[0], hsv[1], 1) + ")";
    }
    function openPicker(c) {
      cur = c; hsv = toHsv(s[c]); picker.hidden = false;
      form.querySelectorAll(".sw").forEach(function (b) { b.setAttribute("aria-expanded", b.dataset.c === c); });
      document.getElementById("picker-for").textContent = { c0: "Shadow", c1: "Mid", c2: "Glow", c3: "Highlight" }[c];
      drawWheel(); paintPicker();
    }
    function closePicker() { if (picking) stopPicking(""); picker.hidden = true; cur = null; form.querySelectorAll(".sw").forEach(function (b) { b.setAttribute("aria-expanded", "false"); }); }
    form.querySelectorAll(".sw").forEach(function (b) { b.addEventListener("click", function () { cur === b.dataset.c ? closePicker() : openPicker(b.dataset.c); }); });
    document.getElementById("picker-done").addEventListener("click", closePicker);
    // Eyedropper: Chrome / Edge pick from anywhere on screen; Safari and Firefox pick from the live preview instead
    var screenEl = cv.parentNode, dropBtn = document.getElementById("picker-drop"), picking = false;
    function useColor(h) { if (!cur) return; s[cur] = h.toLowerCase(); s.palette = -1; hsv = toHsv(s[cur]); drawWheel(); sync(); paintPicker(); }
    function stopPicking(note) { picking = false; screenEl.classList.remove("picking"); dropBtn.setAttribute("aria-pressed", "false"); if (note) msg.textContent = note; }
    dropBtn.addEventListener("click", function () {
      if (!cur) return;
      if (window.EyeDropper) {
        new window.EyeDropper().open().then(function (r) { useColor(r.sRGBHex.replace("#", "")); }).catch(function () {});
      } else if (picking) { stopPicking(); }
      else { picking = true; screenEl.classList.add("picking"); dropBtn.setAttribute("aria-pressed", "true"); msg.textContent = "Click anywhere on the preview to pick that color. Esc to cancel."; }
    });
    screenEl.addEventListener("click", function (e) {
      if (!picking || !cur) return;
      var rc = cv.getBoundingClientRect(), x = Math.floor((e.clientX - rc.left) * cv.width / rc.width), y = cv.height - 1 - Math.floor((e.clientY - rc.top) * cv.height / rc.height);
      var n = 5, px = new Uint8Array(n * n * 4), x0 = Math.max(0, Math.min(cv.width - n, x - 2)), y0 = Math.max(0, Math.min(cv.height - n, y - 2));
      gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.readPixels(x0, y0, n, n, gl.RGBA, gl.UNSIGNED_BYTE, px);   // 5×5 average, so the grain doesn't skew it
      var c = [0, 0, 0]; for (var i = 0; i < n * n; i++) { c[0] += px[i * 4]; c[1] += px[i * 4 + 1]; c[2] += px[i * 4 + 2]; }
      useColor(hex(c.map(function (v) { return Math.round(v / (n * n)); })));
      stopPicking("Picked #" + s[cur].toUpperCase() + " for " + { c0: "Shadow", c1: "Mid", c2: "Glow", c3: "Highlight" }[cur] + ".");
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && picking) { stopPicking(""); return; } if (e.key === "Escape" && cur) closePicker(); });
    pv.addEventListener("input", function () { hsv[2] = +pv.value; applyHsv(); });
    function pick(e) {
      var b = wheel.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - 0.5, y = (e.clientY - b.top) / b.height - 0.5;
      hsv[0] = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360; hsv[1] = Math.min(1, Math.sqrt(x * x + y * y) * 2.04);
      if (hsv[2] < 0.05) hsv[2] = 0.5;          // picking a hue on a black stop gives you something visible
      applyHsv();
    }
    wheel.addEventListener("pointerdown", function (e) { wheel.setPointerCapture(e.pointerId); pick(e); wheel.onpointermove = pick; });
    wheel.addEventListener("pointerup", function () { wheel.onpointermove = null; });
    // custom colors: any edit makes the palette "Custom"
    form.querySelectorAll("input[data-ir]").forEach(function (inp) { inp.addEventListener("input", function () { s[inp.dataset.ir] = inp.value.slice(1); if (!s.irFill) s.irFill = 1; sync(); }); });   // iris surround colors: picking one turns the fill on
    form.querySelectorAll("input[type=color]:not([data-ir])").forEach(function (inp) { inp.addEventListener("input", function () { s[inp.dataset.c] = inp.value.slice(1); s.palette = -1; sync(); }); });
    // a small reset arrow on every slider: puts that one value back to its standard setting for the current look and finish
    function stdValue(k) { var d = Object.assign({}, DEFAULTS, LOOK_DEFAULTS[s.look] || {}, FIN_DEFAULTS[s.finish] || {}); return d[k]; }
    form.querySelectorAll("input[type=range][data-k]").forEach(function (inp) {
      var k = inp.dataset.k, lab = inp.closest(".tune-row"); if (!(k in DEFAULTS) || !lab || !lab.querySelector("span b")) return;
      var rs = document.createElement("span"); rs.className = "slider-reset"; rs.setAttribute("role", "button"); rs.tabIndex = 0; rs.textContent = "↺";
      rs.title = "Reset"; rs.setAttribute("aria-label", "Reset " + (lab.querySelector("span").firstChild.textContent || k).trim());
      var go = function (e) { e.preventDefault(); e.stopPropagation(); s[k] = stdValue(k); sync(); };
      rs.addEventListener("click", go); rs.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") go(e); });
      inp.after(rs);   // beside the slider
    });
    form.querySelectorAll("input[type=range][data-k]").forEach(function (inp) { inp.addEventListener("input", function () {
      s[inp.dataset.k] = +inp.value;
      if (inp.dataset.k === "p1") { s.p1 = Math.min(s.p1, s.p2 - 0.05); s.palette = -1; }
      if (inp.dataset.k === "p2") { s.p2 = Math.max(s.p2, s.p1 + 0.05); s.palette = -1; }
      syncSoon(); }); });

    var deg = function (v) { return v + "°"; }, num = function (v) { return v; };
    var rel = function (v) { return Math.round(v * 100) + "%"; };
    var FMT = { haSize: rel, haBands: num, haTilt: deg, haSoft: pct, crW: function (v) { return Math.round(v * 1000) / 10; }, crArm: rel, crBar: rel, crGlow: pct, crFlick: pct, meshN: num, meshSoft: pct,
      pwDens: num, pwAmp: pct, pwFreq: pct, pwDot: pct, dgSize: rel, dgDens: num, dgDot: pct, dgTilt: deg, p1: pct, p2: pct, htSize: function (v) { return v + " px"; }, htAngle: deg, htFill: pct, tlCount: num, tlGap: pct, tlVary: pct, slDensity: num, slStrength: pct, slRoll: function (v) { return v ? v + "× / loop" : "Still"; },
      reeds: function (v) { return v; }, refract: pct, angle: function (v) { return v + "°"; }, blur: pct, loop: function (v) { return v + " s"; }, speed: function (v) { return Math.round(v * 100) + "%"; }, flow: pct, scale: pct, shift: function (v) { return +v === 0 ? "Center" : (v > 0 ? "Right " : "Left ") + Math.round(Math.abs(v) * 100) + "%"; }, shiftY: function (v) { return +v === 0 ? "Center" : (v > 0 ? "Up " : "Down ") + Math.round(Math.abs(v) * 100) + "%"; }, warp: pct, glow: pct, dark: pct, grain: pct };
    function pct(v) { return Math.round(v * 100) + "%"; }
    var RANGE_INFO = null, syncQueued = false;
    function activeRanges() {
      if (!RANGE_INFO) RANGE_INFO = [].map.call(form.querySelectorAll("input[type=range][data-k]"), function (inp) { var f = inp.closest("[data-look],[data-fin]"); return { inp: inp, look: f && f.dataset.look != null ? +f.dataset.look : -1, fin: f && f.dataset.fin != null ? +f.dataset.fin : -1 }; });
      var out = []; for (var i = 0; i < RANGE_INFO.length; i++) { var r = RANGE_INFO[i]; if ((r.look < 0 || r.look === s.look) && (r.fin < 0 || r.fin === s.finish)) out.push(r.inp); } return out;
    }
    function syncSoon() { if (syncQueued) return; syncQueued = true; requestAnimationFrame(function () { syncQueued = false; sync(); }); }
    var lastPick = "", lastShown = "";
    var syncEvt = 0;
    function sync(typing) {
      if (!syncEvt) { syncEvt = 1; setTimeout(function () { syncEvt = 0; document.dispatchEvent(new Event("studio-sync")); }, 300); }
      if (typeof refreshThumbs === "function") setTimeout(refreshThumbs, 0);
      if (s.look !== 3 && s.reedShape === 1) s.reedShape = 0;   // circular reeds are a Rings-only option
      var circ = form.querySelector('[data-k="reedShape"] button[data-i="1"]'); if (circ) circ.hidden = s.look !== 3;
      var pickNow = [s.look, s.finish, s.reedShape, s.orbIn].join(); if (pickNow !== lastPick) { lastPick = pickNow; ["look", "finish", "reedShape", "orbIn"].forEach(function (k) { form.querySelectorAll('[data-k="' + k + '"] button').forEach(function (b) { b.setAttribute("aria-pressed", +b.dataset.i === s[k]); }); }); }
      sw.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", +b.dataset.i === s.palette); });
      if (myEl && my.length) { var mc = myCurrent(); myEl.querySelectorAll("button.pal").forEach(function (b) { b.setAttribute("aria-pressed", my[+b.dataset.my] === mc); });
        var nb = myEl.querySelector('[data-my-act="new"]'); if (nb && !myNaming) { nb.disabled = !!mc; nb.textContent = mc ? "Saved as “" + mc.name + "”" : "Save these colors"; var rb = myEl.querySelector('[data-my-act="remove"]'); if (!!rb !== !!mc) drawMy(); } }
      activeRanges().forEach(function (inp) {
        var k = inp.dataset.k; inp.value = s[k]; inp.style.setProperty("--fill", ((s[k] - inp.min) / (inp.max - inp.min) * 100) + "%");
        var out = inp.closest(".tune-row").querySelector("b"), f = inp.dataset.fmt;
        out.textContent = f === "raw" ? String(+s[k]) : f === "deg" ? Math.round(s[k]) + "°" : f === "px" ? s[k] + " px" : f === "pct" ? Math.round(s[k] * 100) + "%" : FMT[k](s[k]);
        var rs = inp.closest(".tune-row").querySelector(".slider-reset"); if (rs) rs.classList.toggle("on", Math.abs(s[k] - stdValue(k)) > 1e-6);
      });
      var ready = true; if (curKey !== s.look + "/" + s.finish || curMask !== dynMask(s)) { if (pr) { pendingUse = [s.look, s.finish]; pendingAt = performance.now() + 70; ready = false; } else ready = use(s.look, s.finish) !== false; } else { pendingUse = null; gl.useProgram(pr); }
      if (ready) setUniforms(gl, U, s);
      ["ir1", "ir2"].forEach(function (c) { var ii = form.querySelector('input[data-ir="' + c + '"]'); if (ii) ii.value = "#" + s[c]; });
      COLORS.forEach(function (c) { var sb = form.querySelector('.sw[data-c="' + c + '"]'); if (sb) sb.style.background = "#" + s[c];
        var hx = form.querySelector('input[data-hex="' + c + '"]'); if (hx && hx !== typing) { hx.value = "#" + s[c]; hx.classList.remove("bad"); } });
      var bar = form.querySelector(".grad-bar");
      if (bar) bar.style.background = "linear-gradient(90deg, #" + s.c0 + " 0%, #" + s.c1 + " " + s.p1 * 100 + "%, #" + s.c2 + " " + s.p2 * 100 + "%, #" + s.c3 + " 100%)";
      var an = form.querySelector('input[data-k="angle"]'); if (an) an.closest(".tune-row").hidden = s.reedShape >= 1;   // circular reeds and arches have no angle
      var wr = form.querySelector('input[data-k="warp"]'); if (wr) wr.closest(".tune-row").hidden = [3, 6, 8, 9].indexOf(s.look) >= 0;   // Rings, Cross, Point Wave and Dot Globe have no warp
      var shownNow = s.look + "/" + s.finish; if (shownNow !== lastShown) { lastShown = shownNow; form.querySelectorAll("[data-look]").forEach(function (f) { f.hidden = +f.dataset.look !== s.look; });   // only the active look's own sliders show
      form.querySelectorAll("[data-fin]").forEach(function (f) { f.hidden = +f.dataset.fin !== s.finish; }); }   // only the active finish's sliders show
      document.getElementById("studio-name").textContent = palName() + " · " + LOOKS[s.look] + " · " + FINISHES[s.finish] + (s.w * 9 === s.h * 16 ? "" : " · " + s.w + "×" + s.h);
      frame();
      save();
    }
    function palName() { return s.palette >= 0 ? PALETTES[s.palette][0] : "Custom"; }
    // load a pack recipe on top of the defaults (with the palette's own colors)
    function applyRecipe(r, pal) {
      var keep = { blur: 0, grain: 0.35, dark: 0.5, flow: 1, scale: 1, warp: 0.45, glow: 1 };   // calm by default: light warp
      s = Object.assign({}, DEFAULTS, keep, LOOK_DEFAULTS[r[1].look] || {}, FIN_DEFAULTS[r[1].finish] || {}, r[1], { w: s.w, h: s.h }); s.speed = +(Math.min(1, 12 / s.loop)).toFixed(2); s.palette = pal == null ? r[1].palette : pal;
      var P = PALETTES[s.palette]; COLORS.forEach(function (c, i) { s[c] = hex(P[i + 1]); }); s.p1 = 0.35; s.p2 = 0.7;
    }
    // render code for the Altar Render Mac app: "AL1-" + base64url(JSON of the design and its seed)
    // the Text tab travels with the design ("t") when it's showing, so share links and Altar Render carry the words too
    function textState() { return window.AltarScripture && AltarScripture.get ? AltarScripture.get() : null; }
    function renderCode() {
      var o = { v: 1, seed: +seed.toFixed(4), s: s }, t = textState(); if (t) o.t = t; if (window.__customLook && s.look === window.__customLook.id) o.c = window.__customLook;
      var j = JSON.stringify(o);
      return "AL1-" + btoa(unescape(encodeURIComponent(j))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    }
    // a design from outside (a code, a link, a share): keep the known keys whose values have the right shape, drop the rest
    function cleanDesign(o) {
      var out = {};
      Object.keys(o).forEach(function (k) {
        if (!(k in DEFAULTS)) return;
        var v = o[k], d = DEFAULTS[k];
        if (typeof d === "number") { v = +v; if (!isFinite(v)) return; out[k] = Math.max(-1e5, Math.min(1e5, v)); }
        else if (typeof d === "string") { v = String(v == null ? "" : v).toLowerCase().replace(/^#/, ""); if (HEXK.indexOf(k) >= 0 ? /^[0-9a-f]{6}$/.test(v) : v.length <= 64) out[k] = v; }
        else out[k] = v;
      });
      return out;
    }
    // bring a design back: a render code ("AL1-" + base64url JSON {v, seed, s}) or a Studio link (#look~2,finish~0,…)
    function openDesign(raw) {
      var t = String(raw || "").trim(), o = null, sd = 3.7;
      try {
        if (/^AL1-/.test(t)) {
          var b = t.slice(4).replace(/-/g, "+").replace(/_/g, "/"); while (b.length % 4) b += "=";
          var j = JSON.parse(decodeURIComponent(escape(atob(b)))); o = j && j.s; if (typeof j.seed === "number") sd = j.seed; if (o && j.c && j.c.glsl && window.__installCustom) { var cid = window.__installCustom(j.c, true); if (cid != null) o.look = cid; }
          if (o && window.AltarScripture && AltarScripture.set) { if (j.t && typeof j.t === "object") AltarScripture.set(j.t); else AltarScripture.hide(); }   // the design's text comes along (or none)
        } else if (t.indexOf("~") > 0) {
          o = {}; t.split("#").pop().split(",").forEach(function (kv) { var p = kv.split("~"); if (p[0] in DEFAULTS) o[p[0]] = HEXK.indexOf(p[0]) >= 0 ? p[1] : +p[1]; });
        }
      } catch (e) { o = null; }
      if (!o || typeof o !== "object") { msg.textContent = "That isn't a render code or Studio link. Codes start with AL1-."; return false; }
      // only known keys, and only values of the right shape: a number must be finite (and sane), a colour a 6-digit hex;
      // look and finish must exist; sizes stay inside what the renderers accept. Anything else keeps its default.
      o = cleanDesign(o);
      s = Object.assign({}, DEFAULTS); Object.keys(o).forEach(function (k) { if (k in DEFAULTS) s[k] = o[k]; }); if (!("dfMotion" in o)) s.dfMotion = 1;
      s.look = Math.max(0, Math.min(LOOKS.length - 1, Math.round(s.look))); s.finish = Math.max(0, Math.min(FINISHES.length - 1, Math.round(s.finish)));
      if (!(s.palette >= -1 && s.palette < PALETTES.length)) s.palette = -1; s.palette = Math.round(s.palette);
      s.w = Math.max(16, Math.min(16384, Math.round(s.w))); s.h = Math.max(16, Math.min(16384, Math.round(s.h)));
      s.loop = Math.max(1, Math.min(600, s.loop)); s.speed = Math.max(0, Math.min(20, s.speed));
      if (!LAB && ((LAB_LOOKS.indexOf(s.look) >= 0 && s.look !== VIDEO_LOOK) || LAB_FINS.indexOf(s.finish) >= 0)) msg.textContent = "Opened (it uses a look or finish that's still in testing, shown as the closest public one).";
      if (!LAB && LAB_LOOKS.indexOf(s.look) >= 0 && s.look !== VIDEO_LOOK) s.look = 2; if (!LAB && LAB_FINS.indexOf(s.finish) >= 0) s.finish = 0;
      seed = sd; customOn = false; if (cur) closePicker(); if (curKey === s.look + "/" + s.finish) { gl.useProgram(pr); gl.uniform1f(U.seed, seed); } sync();
      if (!/still in testing/.test(msg.textContent)) msg.textContent = "Opened your design: " + palName() + " · " + LOOKS[s.look] + " · " + FINISHES[s.finish] + ".";
      return true;
    }
    // the box under the buttons: paste (or type) a code and it opens on its own, no button
    var loadForm = document.getElementById("studio-load"), loadIn = document.getElementById("studio-load-in");
    function tryLoad(force) {
      var v = loadIn.value.trim(); if (!v) return;
      var complete = /^AL1-[A-Za-z0-9_-]{20,}$/.test(v) || /#.*look~/.test(v);
      if ((complete || force) && openDesign(v)) { loadIn.value = ""; loadIn.blur(); loadForm.classList.add("done"); setTimeout(function () { loadForm.classList.remove("done"); }, 1400); }
    }
    loadForm.addEventListener("submit", function (e) { e.preventDefault(); tryLoad(true); });
    loadIn.addEventListener("paste", function () { setTimeout(function () { tryLoad(true); }, 0); });
    loadIn.addEventListener("input", function () { tryLoad(false); });
    // ⌘V / Ctrl+V anywhere on the page (outside a text box) with a code on the clipboard opens it straight away
    document.addEventListener("paste", function (e) {
      var el = document.activeElement; if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
      var t = (e.clipboardData && e.clipboardData.getData("text")) || ""; if (/^\s*AL1-/.test(t)) { e.preventDefault(); openDesign(t); }
    });

    document.getElementById("studio-code").addEventListener("click", function (e) {
      var code = renderCode(), btn = e.currentTarget;
      var done = function () { btn.textContent = "Code copied"; var newOnes = false, extras = false;
        msg.textContent = newOnes ? "Copied. Altar Render and Altar Live can\u2019t show text treatments yet, so the file will have the look without this text. The apps are next." : extras ? "Copied. Altar Render and Altar Live don’t have dynamics or still finishes yet, so the file may move differently than this preview." : "Paste it into Altar Render or Altar Live, or into the box under these buttons to pick up where you left off."; setTimeout(function () { btn.textContent = "Copy render code"; }, 1800); };
      if (navigator.clipboard) navigator.clipboard.writeText(code).then(done, function () { window.prompt("Copy this render code", code); });
      else window.prompt("Copy this render code", code);
    });
    // share link: altarloops.com/s/<id> (the design is stored on the site, so the link stays short enough for any app);
    // if that can't be reached, the long /studio?d=<render code> link works on its own
    function shareCode() {
      var o = {}; Object.keys(s).forEach(function (k) { if (s[k] !== DEFAULTS[k]) o[k] = s[k]; });
      var pack = { v: 1, seed: +seed.toFixed(4), s: o }, t = textState(); if (t) pack.t = t;
      var j = JSON.stringify(pack);
      return "AL1-" + btoa(unescape(encodeURIComponent(j))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    }
    function shareLink() {
      var code = shareCode(), long = location.origin + "/studio?" + (LAB ? "lab&" : "") + "d=" + code;
      return fetch("/api/share", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ code: code, lab: LAB }) })
        .then(function (r) { return r.ok ? r.json() : Promise.reject(); }).then(function (j) { return location.origin + "/s/" + j.id; }, function () { return long; });
    }
    document.getElementById("studio-share").addEventListener("click", function (e) {
      var btn = e.currentTarget, link = shareLink();
      var done = function (url) { btn.textContent = "Link copied"; msg.textContent = "Send it to anyone: " + url.replace(/^https?:\/\//, "") + " opens this exact design in the Studio, ready to tweak or render."; setTimeout(function () { btn.textContent = "Share link"; }, 2200); };
      var show = function (url) { msg.textContent = "Your link: " + url; };   // last resort: the link on screen to copy by hand
      btn.textContent = "Making link…";
      if (navigator.share && matchMedia("(pointer: coarse)").matches) {
        link.then(function (url) { btn.textContent = "Share link"; return navigator.share({ title: "My Altar Loops design", url: url }).catch(function (err) { if (err && err.name !== "AbortError") show(url); }); });
      } else if (window.ClipboardItem && navigator.clipboard && navigator.clipboard.write) {   // copy now, fill in the link when it arrives (keeps Safari's click permission)
        navigator.clipboard.write([new ClipboardItem({ "text/plain": link.then(function (url) { return new Blob([url], { type: "text/plain" }); }) })])
          .then(function () { link.then(done); }, function () { link.then(function (url) { navigator.clipboard.writeText(url).then(function () { done(url); }, function () { btn.textContent = "Share link"; show(url); }); }); });
      } else link.then(function (url) { (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(function () { done(url); }, function () { btn.textContent = "Share link"; show(url); }); });
    });
    // opened from a share link: load the design, then tidy the address so edits and reloads keep your own changes
    (function () { var m = /[?&]d=(AL1-[A-Za-z0-9_-]+)/.exec(location.search); if (!m) return;
      if (openDesign(m[1]) && !/still in testing/.test(msg.textContent)) msg.textContent = "Opened a shared design: " + palName() + " · " + LOOKS[s.look] + " · " + FINISHES[s.finish] + ". Make it your own.";
      history.replaceState(null, "", location.pathname + (LAB ? "?lab" : "") + location.hash); })();
    // reset: everything back to the standard settings, keeping the look you're on
    document.getElementById("studio-reset").addEventListener("click", function () {
      var look = s.look; s = Object.assign({}, DEFAULTS, LOOK_DEFAULTS[look] || {}, { w: s.w, h: s.h }); s.look = look; seed = 3.7; gl.useProgram(pr); gl.uniform1f(U.seed, seed);
      if (cur) closePicker(); sync();
      var hadText = !!textState(); if (hadText && AltarScripture.hide) AltarScripture.hide();   // Reset also takes the Text tab's words off the screen
      msg.textContent = "Back to the standard " + LOOKS[look] + " settings" + (hadText ? ", text hidden." : ".");
    });
    // curated surprise: a pack recipe, a sister palette sometimes, and small nudges that stay dark, soft and on brand
    document.getElementById("studio-random").addEventListener("click", function () {
      var R = Math.random, j = function (v, amt) { return +(v * (1 - amt + R() * amt * 2)).toFixed(2); }, pick = function (a) { return a[R() * a.length | 0]; };
      var pubLooks = LOOKS.map(function (t, i) { return i; }).filter(function (i) { return RETIRED.indexOf(i) < 0 && (LAB || LAB_LOOKS.indexOf(i) < 0); });
      var pubFins = FINISHES.map(function (t, i) { return i; }).filter(function (i) { return LAB || LAB_FINS.indexOf(i) < 0; });
      var pubRecipes = RECIPES.filter(function (q) { return RETIRED.indexOf(q[1].look) < 0 && (LAB || (LAB_LOOKS.indexOf(q[1].look) < 0 && LAB_FINS.indexOf(q[1].finish) < 0)); });
      // half the time a pack recipe; otherwise a fresh mix of any published look and finish (Clean or Reeded most often, so it stays on brand)
      var r = pick(pubRecipes), mix = R() < 0.5;
      // looks with their own shapes (halo, cross, grids, windows, bars, beams) only take the soft finishes, so they never get busy
      var shaped = [5, 6, 8, 9, 14, 32, 35, 36, 37, 40], soft = [0, 5, 20, 27, 28, 29].filter(function (i) { return pubFins.indexOf(i) >= 0; });
      if (mix) { var lk = pick(pubLooks), fn = R() < 0.35 ? 0 : shaped.indexOf(lk) >= 0 ? pick(soft) : R() < 0.3 ? 1 : pick(pubFins), sib = RECIPES.filter(function (q) { return q[1].look === lk; });
        var pal = sib.length && R() < 0.6 ? pick(sib)[1].palette : pick([0, 1, 3, 5, 6, 7, 8, 9, 10, 11]);
        r = [LOOKS[lk] + (fn ? " · " + FINISHES[fn] : ""), { look: lk, finish: fn, palette: pal, loop: pick([10, 12, 20, 20]), dark: 0.55 }, [pal]];
        if (fn === 1) { r[1].reeds = pick([5, 7, 9, 12, 16]); r[1].refract = +(0.1 + R() * 0.3).toFixed(2); r[1].reedShape = pick([0, 0, 3]); } }
      applyRecipe(r, R() < 0.55 ? r[1].palette : r[2][R() * r[2].length | 0]);
      s.flow = j(s.flow, 0.2); s.speed = Math.max(0.15, j(s.speed, 0.25)); s.warp = j(s.warp, 0.3); s.glow = j(s.glow, 0.15);
      s.scale = +Math.max(0.7, Math.min(1.8, s.scale * (0.75 + R() * 0.6))).toFixed(2);   // zoom in or out
      if (R() < 0.35) { s.shift = +((R() - 0.5) * 0.3).toFixed(3); s.shiftY = +((R() - 0.5) * 0.2).toFixed(3); }        // sometimes off-center
      s.dark = Math.max(0.4, j(s.dark, 0.2)); s.grain = +(0.25 + R() * 0.25).toFixed(2); s.blur = R() < 0.7 ? s.blur : +(R() * 0.3).toFixed(2);
      // the look's and finish's own sliders: a step or two either side of their standard setting, inside the slider's range
      [form.querySelector('fieldset[data-look="' + s.look + '"]'), form.querySelector('fieldset[data-fin="' + s.finish + '"]')].forEach(function (g) {
        if (g) g.querySelectorAll('input[type="range"]').forEach(function (inp) { var k = inp.dataset.k; if (!(k in s) || k === "angle" || k === "reedShape" || /^mo_/.test(k)) return;
          var lo = +inp.min, hi = +inp.max, st = +inp.step || 0.01, v = s[k] + (R() - 0.5) * (hi - lo) * 0.4;
          s[k] = +Math.max(lo, Math.min(hi, Math.round(v / st) * st)).toFixed(4); }); });
      if (s.finish === 1) { s.reeds = Math.max(3, Math.round(s.reeds * (0.8 + R() * 0.4))); s.refract = j(s.refract, 0.25); }
      if (s.finish === 2) s.htSize = Math.max(4, Math.round(s.htSize * (0.8 + R() * 0.4)));
      if (s.finish === 3) s.tlCount = Math.max(10, Math.round(s.tlCount * (0.8 + R() * 0.4)));
      var span = function (a, b) { return +(a + R() * (b - a)).toFixed(2); }, near = function (v, amt, lo, hi) { return Math.max(lo, Math.min(hi, j(v, amt))); };
      if (s.finish === 5) { s.fx1 = span(0.45, 0.75); s.fx3 = span(0.25, 0.55); }                                   // frosted glass
      if (s.finish === 6) { s.fx1 = Math.round(span(9, 16)); s.fx2 = span(0.35, 0.65); s.fx3 = span(0.35, 0.65); }    // glass block
      if (s.finish === 7) { s.fx1 = span(3, 5.5); s.fx2 = span(0.35, 0.6); s.fx3 = R() < 0.5 ? 90 : Math.round(span(60, 120)); }   // rippled glass
      if (s.finish === 8) { s.fx1 = Math.round(span(5, 9)); s.fx2 = span(0.3, 0.5); s.fx3 = span(0.35, 0.65); }      // stained glass
      if (s.finish === 13) { s.fx1 = Math.round(span(70, 120)); s.fx2 = Math.round(R() < 0.5 ? span(20, 40) : span(130, 160)); s.fx3 = span(0.35, 0.6); }   // engraving
      if (s.finish === 15) { s.fx1 = span(0.35, 0.65); s.fx2 = Math.round(span(110, 160)); }                         // embossed
      if (s.look === 10) { s.lx1 = near(s.lx1, 0.15, 0.35, 0.75); s.lx3 = span(-0.25, 0.05); }                       // candle haze
      if (s.look === 11) { s.lx1 = near(s.lx1, 0.2, 0.12, 0.3); s.lx3 = span(-0.45, -0.2); }                          // dawn line
      if (s.look === 12) { s.lx1 = near(s.lx1, 0.2, 2, 4); s.lx3 = Math.round(span(-25, 25)); }                       // veil
      if (s.look === 14) { s.lx1 = R() < 0.6 ? 3 : 4; s.lx3 = Math.round(R() < 0.5 ? span(-25, -8) : span(8, 25)); } // window light
      if (s.look === 19) { s.lx1 = near(s.lx1, 0.2, 0.14, 0.3); s.lx3 = Math.round(span(-8, 8)); }                   // pillar
      seed = R() * 50; if (curKey === s.look + "/" + s.finish) { gl.useProgram(pr); gl.uniform1f(U.seed, seed); }
      sync();
      msg.textContent = (mix ? "New mix: " : "Based on ") + r[0] + (mix || s.palette !== r[1].palette ? ", in " + PALETTES[s.palette][0] : "") + ".";
    });

    // preview resolution follows the box, capped for speed (the field is soft, so ~0.75x looks the same)
    var quality = 1; try { var qq = +localStorage.getItem("altar-preview-quality"); if (qq >= 0.3 && qq <= 1) quality = qq; } catch (e) {} function keepQuality() { try { localStorage.setItem("altar-preview-quality", quality); } catch (e) {} }                         // drops on slow machines (see draw), so the preview stays smooth instead of stalling the GPU
    function size() { if (!pr) use(s.look, s.finish); var k = Math.min(window.devicePixelRatio || 1, 1.5) * 0.75 * quality; k = Math.min(k, Math.sqrt(1600000 / Math.max(1, cv.clientWidth * cv.clientHeight))); cv.width = Math.round(cv.clientWidth * k); cv.height = Math.round(cv.clientHeight * k); gl.viewport(0, 0, cv.width, cv.height);
      gl.bindTexture(gl.TEXTURE_2D, tex); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, cv.width, cv.height, 0, gl.RGBA, hfOK ? hfExt.HALF_FLOAT_OES : gl.UNSIGNED_BYTE, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      if (hfOK && gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) { hfOK = false; gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, cv.width, cv.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null); }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.useProgram(pr); gl.uniform2f(U.r, cv.width, cv.height); }
    window.addEventListener("resize", size); size(); gl.useProgram(pr); gl.uniform1f(U.seed, seed); sync();
    if (OUT && designBC) designBC.onmessage = function (e) {   // output window: take the Studio's changes
      e.data.st.split(",").forEach(function (kv) { var p = kv.split("~"); if (p[0] in s) s[p[0]] = HEXK.indexOf(p[0]) >= 0 ? p[1] : +p[1]; });
      seed = e.data.seed; sync(); gl.useProgram(pr); gl.uniform1f(U.seed, seed);
    };

    var t0 = performance.now(), tc = document.getElementById("studio-tc"), still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    var lastLoop = 0, lastNow = 0, slow = 0, quick = 0, lost = false, upAfter = 600;
    function draw(now) {
      if (lost || window.__studioRendering) { if (!lost) requestAnimationFrame(draw); return; }
      if (lastNow && now - lastNow < 13) { requestAnimationFrame(draw); return; }   // 60 fps is plenty for a preview, even on a 120 Hz screen
      if (pendingUse && now >= pendingAt && use(pendingUse[0], pendingUse[1]) !== false) setUniforms(gl, U, s);
      var dt = lastNow ? now - lastNow : 16; lastNow = now;
      if (dt > 45 && dt < 1000) { slow++; quick = 0; } else if (dt < 22) { quick++; slow = Math.max(0, slow - 1); }
      if (slow > 10 && quality > 0.3) { quality = Math.max(0.3, quality * 0.75); slow = 0; quick = 0; upAfter = Math.min(upAfter * 2, 9600); keepQuality(); size(); }          // struggling: draw fewer pixels
      else if (quick > upAfter && quality < 1) { quality = Math.min(1, quality / 0.75); quick = 0; keepQuality(); size(); }      // room to spare: sharpen back up
      if (lastLoop && s.loop !== lastLoop) t0 = now - (((now - t0) / 1000) % lastLoop) / lastLoop * s.loop * 1000; lastLoop = s.loop; var t = still ? 0 : (now - t0) / 1000, ph = (t % s.loop) / s.loop;
      uploadVideo();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo); gl.useProgram(pr); gl.uniform1f(U.th, ph * Math.PI * 2); moApply(gl, U, s, ph); gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.useProgram(pp); gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(UP.tx, 0); gl.uniform2f(UP.r, cv.width, cv.height); gl.uniform1f(UP.blur, s.blur); gl.uniform1f(UP.grain, s.grain); gl.uniform1f(UP.th, ph * Math.PI * 2);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      var f = Math.floor(t * 30) % 30, sec = Math.floor(t % s.loop);
      tc.textContent = "00:" + (sec < 10 ? "0" : "") + sec + ":" + (f < 10 ? "0" : "") + f + " / " + s.loop + " s";
      requestAnimationFrame(draw);
    }
    var DYKEYS = ["dyTurb", "dyLiquid", "dySwirl", "dyWave", "dyRipple", "dyDrift", "dyPulse", "dySway", "dyStretch", "dyBreathe", "dyFlick", "dyBeat", "dySweep", "dyPunch", "dyEcho", "dyHue", "dyHueW", "dySplit"]; document.getElementById("dyn-clear").onclick = function () { DYKEYS.forEach(function (k) { s[k] = 0; }); s.dyRate = 1; sync(); }; document.getElementById("dyn-surprise").onclick = function () { DYKEYS.forEach(function (k) { s[k] = 0; }); var pool = DYKEYS.slice(), n = 2 + Math.floor(Math.random() * 3); while (n-- > 0) { var k = pool.splice(Math.floor(Math.random() * pool.length), 1)[0]; s[k] = +(0.2 + Math.random() * 0.45).toFixed(2); } s.dyRate = 1 + Math.floor(Math.random() * 2); sync(); };
    if (!/[?&]out=1\b/.test(location.search)) fetch("/api/me", { credentials: "same-origin" }).then(function (r) { return r.ok ? r.json() : null; }).then(function (me) {
      if (me && me.email) return; var wm = document.createElement("div"); wm.className = "studio-mark"; wm.setAttribute("aria-hidden", "true"); wm.innerHTML = '<img src="/brand/logo-header.png" alt=""><span>altarloops.com</span>'; cv.parentNode.appendChild(wm);
    }).catch(function () {});
    // ---- "?" on every slider, and the per-control motion rows behind a switch
    var ABOUT_L = {"Panel Mosaic": "A wall of LED panels in uneven columns, lighting up in groups.", "Block Wall": "A grid of blocks that light in waves, like a pixel wall.", "Burst Fans": "Streaks shooting up from a point low in the frame, like a burst of light.", "Truss Beams": "Stage beams swinging from a truss overhead through haze.", "Gradient Door": "A tall doorway of light with a glow spilling onto the floor.", "Corona Rim": "A dark disc with a thin bright rim, like an eclipse.", "Light Slab": "A standing panel of light with its reflection in a dark floor.", "Floating Ellipse": "A soft oval of light hovering in a dark room.", "Angled Panels": "A few lit panels standing at angles, like a light installation.", "Two Lights": "Two glowing squares that drift apart and meet, with a seam of light between.", "Hanging Blades": "Tall blades of light hanging in a row, catching a chase.", "Ribbon Fold": "A wide ribbon of fine lines folding across the screen.", "Twist Band": "A band of lines twisting like a wrung cloth.", "Liquid Eye": "A soft lens shape with a dark center, like liquid metal.", "Glass Stack": "Rounded glass panels stacked side by side.", "Petal Orb": "A glossy flower of petals opening and closing.", "Thin Film": "A soap-film sphere with shifting bands of color.", "Chrome Cells": "Blobs of liquid chrome that merge and split.", "Light Curtain": "A curtain of thin light rays hanging from a folded edge.", "Pixel Stretch": "Rows of the picture stretched and torn sideways.", "Spectral Bars": "Soft vertical bars of light drifting and bending.", "Form Contours": "Contour lines wrapped around a soft shape, like a map.", "Dot Curtain": "A curtain of dots that brighten in vertical stripes.", "Arch Rows": "Rows of small blocks travelling around an arch.", "Impact Light": "A cracked, glowing surface with spokes from one point.", "Long Exposure": "Streaks of light pulled along one direction, like a long camera exposure.", "Fan Fins": "Fins fanning out from a point, like a paper fan.", "Wave Slats": "Horizontal slats lit by a wave rolling across them.", "Vortex Ring": "Arms spinning into a ring at the center.", "Light Plane": "Planes of light sweeping through fog, one after another.", "Bottom Glow": "A soft glow that sits along the bottom edge and fades to nothing partway up. Edge moves it to the top or a side.", "Linear Drift": "A plain two-tone gradient across the whole screen that slowly turns and slides. The quietest look here."}, ABOUT_F = {"Fractal Glass": "Layered ribbed glass: strips inside strips.", "Impact Crack": "The picture seen through cracked glass from one impact point.", "Pixel Sort": "Columns of the picture smeared along their length, a glitch look.", "Block Glitch": "Blocks of the picture jump sideways now and then, with color tearing.", "CRT Phosphor": "An old tube TV: scan lines, color triads and a curved screen.", "LED Wall": "The picture as an LED wall of dots, with panel seams.", "LED Slats": "Horizontal slats of LED pixels.", "Thermal": "A heat-camera palette over the picture.", "Holo Foil": "A rainbow holographic sheen that follows the light.", "RGB Drift": "The red and blue channels pulled apart.", "Line Tone": "The picture drawn as bending engraved lines.", "Bayer Dither": "Chunky retro dithering with a few brightness levels.", "Glyph Grid": "A grid of changing symbols, like a data display.", "Poster Glow": "Flat poster-style bands with glowing edges.", "Motion Smear": "A smear along one direction, like motion blur.", "Radial Smear": "A smear out from a center point, with a twist.", "Time Echo": "Faint copies of earlier frames trailing behind.", "Prism Bars": "Vertical glass bars that each stretch and flip the picture.", "Liquid Lens": "A lumpy lens of liquid bending the picture.", "Frost Panels": "Frosted glass panels side by side.", "Arch Window": "The look seen through one or more arched openings.", "Slab Window": "A tall window of light with a reflection on the floor.", "Stage Wall": "The look placed on a wall seen in perspective, with a shiny floor.", "Curved Screen": "The look on a curved screen with a floor reflection.", "Mirror Tunnel": "The picture repeated inward, like facing mirrors.", "Smoke Holes": "Holes of smoke burned through the picture.", "Ink Bleed": "The picture bleeding like wet ink on paper.", "Film Burn": "Film burning away from the edges.", "Edge Sweep": "A bright line tracing the edges in the look.", "Interference": "Two line patterns crossing, making moire bands.", "Pixel Stretch": "Rows of the picture stretched sideways and torn."};
    var HELP = {"ovOp": "How see-through the overlay is. 100% is the image as it came; lower it to let the loop show through a frame or logo. It only changes what you see here and in Altar Live's output, never the design.", "speed": "How fast the look moves. Slower feels calmer on a wall; faster reads as energy.", "loop": "How many seconds one loop lasts before it repeats. Longer loops repeat less obviously.", "flow": "How much the light travels across the screen over one loop. Low = a gentle drift, high = big sweeps.", "scale": "Zooms the look in or out. Bigger is softer and simpler; smaller shows more detail.", "shift": "Slides the whole look left or right, for walls where the band or a logo sits to one side.", "shiftY": "Slides the whole look up or down.", "warp": "Bends and twists the shapes. 0 keeps them smooth; high values make them swirl.", "glow": "Overall brightness of the light in the look.", "dark": "Darkens the edges of the screen so the middle reads brighter. Good behind text.", "grain": "Fine film-style texture over the picture. Helps hide banding on LED walls.", "blur": "Softens the whole picture.", "p1": "Where the second palette color sits along the light-to-dark ramp.", "p2": "Where the third palette color sits along the ramp.", "reeds": "How many ribbed glass bands cross the screen.", "refract": "How strongly each band bends the picture behind it.", "angle": "Turns the pattern. 0 is upright.", "reedShape": "Straight bands, circles, radial spokes or an arch.", "htSize": "Size of the halftone dots.", "htAngle": "Turns the dot grid.", "htFill": "How solid the dots are.", "tlCount": "How many tiles across.", "tlGap": "Space between tiles.", "tlVary": "How much the tiles differ from each other.", "slDensity": "How many scan lines.", "slStrength": "How dark the scan lines are.", "slRoll": "Scrolls the lines over the loop.", "dyRate": "How many times the Life & movement effects cycle during one loop. 1 is once a loop.", "dyTurb": "Turbulence: a gentle, uneven churn, like heat haze.", "dyLiquid": "Liquid: slow, flowing distortion, like looking through water.", "dySwirl": "Swirl: a slow spin around the middle.", "dyWave": "Wave: the picture ripples side to side.", "dyWaveF": "Wave size: how tight the wave ripples are.", "dyRipple": "Ripple: rings spreading out from the center.", "dyDrift": "Drift: the camera slowly wanders.", "dyPulse": "Zoom pulse: a slow zoom in and out.", "dySway": "Sway: a slow rock left and right.", "dyStretch": "Stretch: the picture breathes wider, then taller.", "dyBreathe": "Breathe: the brightness rises and falls slowly.", "dyFlick": "Flicker: quick, candle-like brightness changes.", "dyBeat": "Beat: a flash on each beat of the loop, then a fade.", "dySweep": "Light sweep: a bright band passes across the picture.", "dyPunch": "Punch: deeper darks and brighter highlights.", "dyEcho": "Echo: faint trails that follow the motion.", "dyHue": "Color drift: the whole palette slowly rotates its hue.", "dyHueW": "Color wave: hue shifts travel across the picture.", "dySplit": "RGB split: the red and blue separate slightly, like a lens.", "dfMotion": "Brings back the finish's own built-in movement (its zoom, sweep or pulse). 0 holds it still. The Roll, Crawl and Travel sliders need this on.", "dfRate": "How many times the finish movements below cycle per loop.", "dfAmt": "How much of the finish shows. Lower blends it back toward the plain look.", "dfPulse": "Pulses the finish amount in and out.", "dfWobble": "A slow, uneven wobble in the finish.", "dfDrift": "The finish slowly wanders.", "dfZoom": "The finish zooms in and out.", "dfSway": "The finish rocks left and right.", "fxSpeed": "How fast this treatment moves.", "fxSize": "Text size, as a share of the automatic size.", "fxDens": "How many rows or columns of words.", "fxAmt": "The treatment's own main control; its name changes with the treatment.", "fxSpace": "Spacing between words.", "fxGlow": "A soft glow around the letters.", "fxOpac": "How solid the text is over the loop.", "wscale": "Bigger or smaller than the automatic fit.", "wopacity": "How solid the word is.", "tickerSpeed": "How fast the ticker scrolls.", "tsize": "Ticker text size.", "scrollSpeed": "How fast the verses scroll.", "size": "Verse text size.", "width": "How wide the verse column is.", "dim": "Darkens the loop behind the text so it's easier to read."};
    function helpFor(row, k) {
      if (HELP[k]) return HELP[k];
      if (/^mo_/.test(k)) return "Lets the control above move back and forth on its own, in time with the loop. 0 = still.";
      var lab = ((row.querySelector("span") || {}).firstChild || {}).textContent || k; lab = lab.replace(/motion$/, "").trim();
      var f = row.closest("[data-look],[data-fin]"), what = f && f.dataset.fin != null ? "finish" : "look";
      var nm = f ? (what === "finish" ? FINISHES[+f.dataset.fin] : LOOKS[+f.dataset.look]) : "", ab = f ? (what === "finish" ? ABOUT_F[nm] : ABOUT_L[nm]) : ""; return (ab ? nm + ": " + ab + " " : "Only this " + what + " has this control. ") + "This slider changes its " + lab.toLowerCase() + ": drag it and watch the preview. The ↺ puts it back to the standard setting.";
    }
    document.querySelectorAll("#studio-form fieldset[data-look], #studio-form fieldset[data-fin]").forEach(function (f) { var nm = f.dataset.fin != null ? FINISHES[+f.dataset.fin] : LOOKS[+f.dataset.look], ab = f.dataset.fin != null ? ABOUT_F[nm] : ABOUT_L[nm]; if (!ab) return; var pp = document.createElement("p"); pp.className = "about"; pp.textContent = ab; var lg = f.querySelector("legend"); if (lg) lg.after(pp); else f.prepend(pp); });
    document.querySelectorAll("#studio-form .tune-row").forEach(function (row) {
      var inp = row.querySelector("input[type=range]"), span = row.querySelector("span"); if (!inp || !span || span.querySelector(".help")) return;
      var k = inp.dataset.k || inp.dataset.sk || inp.dataset.help || "", b = document.createElement("button"); b.type = "button"; b.className = "help"; b.textContent = "?"; b.setAttribute("aria-expanded", "false"); b.title = helpFor(row, k); b.setAttribute("aria-label", "What does this do?");
      span.insertBefore(b, span.querySelector("b"));
      b.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); var pop = row.querySelector(".help-pop"); if (pop) { pop.remove(); b.setAttribute("aria-expanded", "false"); return; }
        document.querySelectorAll(".help-pop").forEach(function (q) { q.remove(); }); document.querySelectorAll(".help[aria-expanded=true]").forEach(function (q) { q.setAttribute("aria-expanded", "false"); });
        pop = document.createElement("div"); pop.className = "help-pop"; pop.textContent = helpFor(row, k); row.appendChild(pop); b.setAttribute("aria-expanded", "true"); });
    });
    (function () {
      var opened = {}; try { opened = JSON.parse(localStorage.getItem("studio-animate") || "{}"); } catch (e) {}
      document.querySelectorAll("#studio-form fieldset[data-look], #studio-form fieldset[data-fin]").forEach(function (f) {
        if (!f.querySelector(".mo-row")) return; var key = f.dataset.look != null ? "l" + f.dataset.look : "f" + f.dataset.fin;
        var lab = document.createElement("label"); lab.className = "animate-row"; lab.innerHTML = '<input type="checkbox"> Let these controls move on their own';
        var cb = lab.querySelector("input"); f.appendChild(lab);
        var anyOn = function () { return [].some.call(f.querySelectorAll(".mo-row input[type=range]"), function (i) { return +s[i.dataset.k] > 0; }); };
        cb.checked = !!opened[key] || anyOn(); f.classList.toggle("animating", cb.checked);
        cb.addEventListener("change", function () { f.classList.toggle("animating", cb.checked); opened[key] = cb.checked; try { localStorage.setItem("studio-animate", JSON.stringify(opened)); } catch (e) {} });
      });
      // a design that arrives with motion already on shows its rows
      document.addEventListener("studio-sync", function () { document.querySelectorAll("#studio-form fieldset.animating, #studio-form fieldset:not(.animating)").forEach(function (f) { var cb = f.querySelector(".animate-row input"); if (cb && !cb.checked && [].some.call(f.querySelectorAll(".mo-row input[type=range]"), function (i) { return +s[i.dataset.k] > 0; })) { cb.checked = true; f.classList.add("animating"); } }); });
    })();
    function subTab() { var b = document.querySelector('.studio-tabs button[aria-selected="true"]'), el = document.getElementById("tab-sub"); if (b && el) el.textContent = b.dataset.sub || ""; }
    subTab(); document.querySelectorAll(".studio-tabs button").forEach(function (b) { b.addEventListener("click", function () { setTimeout(subTab, 0); }); b.addEventListener("keyup", function () { setTimeout(subTab, 0); }); });
    window.__studio = {
      set: function (o) { Object.assign(s, o); sync(); },
      pick: function (lk, fn, extra) { s = Object.assign({}, DEFAULTS, LOOK_DEFAULTS[lk] || {}, FIN_DEFAULTS[fn] || {}, { look: lk, finish: fn, w: 1920, h: 1080 }, extra || {}); sync(); },
      get: function () { return s; },
      LOOKS: LOOKS,
      FINISHES: FINISHES,
      shot: function (ph) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.useProgram(pr);
        gl.uniform1f(U.th, ph * Math.PI * 2);
        moApply(gl, U, s, ph);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.useProgram(pp);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.uniform1i(UP.tx, 0);
        gl.uniform2f(UP.r, cv.width, cv.height);
        gl.uniform1f(UP.blur, s.blur);
        gl.uniform1f(UP.grain, s.grain);
        gl.uniform1f(UP.th, ph * Math.PI * 2);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        return cv.toDataURL("image/jpeg", 0.85);
      },
      pix: function (ph) {
        window.__studio.shot(ph);
        var o = new Uint8Array(cv.width * cv.height * 4);
        gl.readPixels(0, 0, cv.width, cv.height, gl.RGBA, gl.UNSIGNED_BYTE, o);
        return o;
      },
      tile: function (k, i) { watchThumbs(); return drawThumb(k, i); },
      ready: function () { return new Promise(function (res) { (function w() { if (!pendingUse && curKey === s.look + "/" + s.finish) res(); else setTimeout(w, 20); })(); }); },
      hasExt: !!PSC,
      err: function () { return gl.getError(); },
      cv: cv,
      gl: gl,
      pausePreview: function () { window.__studioRendering = true; },
      resumePreview: function () { window.__studioRendering = false; size(); requestAnimationFrame(draw); },
      setRenderResolution: function (w, h) {
        cv.width = w;
        cv.height = h;
        gl.viewport(0, 0, w, h);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, hfOK ? hfExt.HALF_FLOAT_OES : gl.UNSIGNED_BYTE, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        if (pr) { gl.useProgram(pr); gl.uniform2f(U.r, w, h); }
        if (pp) { gl.useProgram(pp); gl.uniform2f(UP.r, w, h); }
      },
      renderFrame: function (ph) {
        uploadVideo();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.viewport(0, 0, cv.width, cv.height);
        gl.useProgram(pr);
        gl.uniform1f(U.th, ph * Math.PI * 2);
        moApply(gl, U, s, ph);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, cv.width, cv.height);
        gl.useProgram(pp);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.uniform1i(UP.tx, 0);
        gl.uniform2f(UP.r, cv.width, cv.height);
        gl.uniform1f(UP.blur, s.blur);
        gl.uniform1f(UP.grain, s.grain);
        gl.uniform1f(UP.th, ph * Math.PI * 2);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      },
      restoreSize: function () {
        size();
      }
    };
    requestAnimationFrame(function (now) { draw(now); requestAnimationFrame(function () { window.__firstPicture = performance.now(); cv.parentNode.classList.add("live"); }); });
    // If the browser takes the GPU away anyway (driver reset, too many tabs), reload with the same design (it lives in the link)
    cv.addEventListener("webglcontextlost", function (e) { e.preventDefault(); lost = true; msg.textContent = "The preview paused. Restoring…"; quality = Math.max(0.3, quality * 0.6); keepQuality(); save(); setTimeout(function () { var n = 0; try { n = +sessionStorage.getItem("altar-gpu-resets") || 0; sessionStorage.setItem("altar-gpu-resets", n + 1); } catch (er) {} if (n < 3) location.reload(); else msg.textContent = "Your graphics card keeps resetting. Close other tabs or heavy apps, then refresh this page."; }, 2500); });
    cv.addEventListener("webglcontextrestored", function () { location.reload(); });   // fade the picture in once the first frame is drawn

  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
