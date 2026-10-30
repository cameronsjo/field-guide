/* ---------- drawing helpers ---------- */
const sv = b => `<svg viewBox="0 0 160 100" aria-hidden="true">${b}</svg>`;
const pts = a => a.map(q => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' ');
// isometric box: (cx,by) is the back corner of the base; w = right-hand depth, d = left-hand depth, h = height
function ib(cx, by, w, d, h, t) {
  const ty = by - h, R = [.866 * w, .5 * w], L = [-.866 * d, .5 * d];
  const A = [cx, ty], B = [cx + R[0], ty + R[1]], C = [cx + R[0] + L[0], ty + R[1] + L[1]], D = [cx + L[0], ty + L[1]];
  const dn = q => [q[0], q[1] + h];
  return `<polygon class="${t}" points="${pts([D, C, dn(C), dn(D)])}"/><polygon class="${t}d" points="${pts([B, C, dn(C), dn(B)])}"/><polygon class="${t}l" points="${pts([A, B, C, D])}"/>`;
}
// palette scene: background, circle, bars, plus a swatch strip
function cs(c) {
  return sv(`<rect x="14" y="8" width="132" height="60" rx="6" fill="${c[0]}"/><circle cx="48" cy="38" r="17" fill="${c[1]}"/><rect x="76" y="24" width="56" height="9" rx="4.5" fill="${c[2]}"/><rect x="76" y="39" width="40" height="6" rx="3" fill="${c[3]}"/><rect x="76" y="51" width="24" height="9" rx="4.5" fill="${c[4]}"/>` +
    c.map((x, i) => `<rect x="${(14 + i * 26.4).toFixed(1)}" y="76" width="26.4" height="16" fill="${x}"/>`).join(''));
}
function pixels(rows, cell, ox, oy, cls) {
  let o = '';
  rows.forEach((r, y) => [...r].forEach((ch, x) => { if (ch === '1') o += `<rect x="${ox + x * cell}" y="${oy + y * cell}" width="${cell}" height="${cell}" class="${cls}"/>`; }));
  return o;
}
const box = (x, y, w, h, label, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" class="nd ${extra}"/>` + (label ? `<text x="${x + w / 2}" y="${y + h / 2 + 2.5}" class="dt">${label}</text>` : '');

/* ---------- workbook content ----------
   Every section is a group pushed into pool.groups:
   { id, title, slot, intro, terms:[{ id, name, aka, desc, spot?, ref, prompt, ex }] }
   Subjects (one page each) are assembled from groups further down.
*/
const WORKBOOK = { areas: [] };

const pool = {
  id: 'design', title: 'Design',
  recipe: [
    ['A '], ['3D isometric', 'isometric'], [' '], ['exploded view', 'exploded'], [' of how an LLM answers a question, laid out as a '],
    ['layer stack', 'layerstack'], [' with '], ['annotated callouts', 'callouts'], ['. '], ['Muted palette', 'muted'], [' with '],
    ['one accent color', 'accent'], [', '], ['minimalist', 'minimal'], [' with plenty of '], ['negative space', 'negative'],
    ['. Layers '], ['stagger in', 'stagger'], [' on load.']
  ],
  groups: []
};

pool.groups.push({
  id: 'render', title: 'Rendering style', slot: 'Rendering',
  intro: 'How things are drawn. When a picture looks wrong but you can\'t say why, this is usually the missing word.',
  terms: [
    { id: 'flat', name: 'Flat', aka: 'flat illustration, flat vector',
      desc: 'Solid blocks of color with no shadows, gradients or texture. Clean, modern and easy to read at small sizes.',
      ref: 'Google Material icons, most app onboarding screens',
      prompt: 'flat vector illustration, solid fills, no gradients or shadows',
      ex: sv(`<rect x="40" y="18" width="80" height="52" rx="5" class="x1"/><rect x="46" y="24" width="68" height="40" class="sf"/><rect x="28" y="70" width="104" height="7" rx="3.5" class="x1d"/><circle cx="68" cy="44" r="10" class="x2"/><rect x="84" y="36" width="22" height="5" rx="2.5" class="x3"/><rect x="84" y="46" width="15" height="5" rx="2.5" class="gr"/>`) },
    { id: 'isometric', name: '3D isometric', aka: 'isometric illustration, 2.5D, diorama view',
      desc: '3D objects drawn at fixed 30° angles with no vanishing point, so parallel edges stay parallel. Feels like a tidy game board or a miniature model.',
      ref: 'SimCity, Monument Valley, cloud architecture diagrams',
      prompt: '3D isometric illustration, 30° angles, no perspective distortion, soft shading on each face',
      ex: sv(ib(80, 34, 48, 48, 6, 'g') + ib(80, 40, 14, 14, 26, 'x1') + ib(60, 48, 10, 10, 8, 'x3') + ib(104, 50, 10, 10, 12, 'x2')) },
    { id: 'lineart', name: 'Line art', aka: 'outline style, monoline, stroke icons',
      desc: 'Drawn only with lines of one consistent thickness, no fills. Light, precise and good for technical subjects.',
      ref: 'Feather and Lucide icon sets, architectural sketches',
      prompt: 'monoline line art, consistent 2px stroke, no fills',
      ex: sv(`<rect x="30" y="22" width="58" height="40" rx="8" class="st"/><path d="M44 62 l-6 12 l14 -12" class="st"/><path d="M42 36h34M42 46h22" class="st"/><circle cx="114" cy="50" r="19" class="st"/><path d="M106 50 l6 6 l10 -12" class="st"/>`) },
    { id: 'skeuo', name: 'Skeuomorphic', aka: 'realistic UI, faux-physical',
      desc: 'Imitates real materials such as brushed metal, leather or glass, with bevels and shadows, so digital things look like physical objects.',
      ref: 'early iPhone apps, audio plugin knobs',
      prompt: 'skeuomorphic style, realistic materials, bevels and highlights like a physical object',
      ex: sv(`<defs><linearGradient id="skA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e4e8ee"/><stop offset="1" stop-color="#9aa3b0"/></linearGradient><radialGradient id="skB" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#c3c9d2"/><stop offset="1" stop-color="#7d8794"/></radialGradient></defs><rect x="34" y="10" width="92" height="80" rx="10" fill="url(#skA)" stroke="#6f7884"/><ellipse cx="82" cy="58" rx="27" ry="25" fill="#000" opacity=".25"/><circle cx="80" cy="50" r="26" fill="url(#skB)" stroke="#5f6874"/><circle cx="80" cy="50" r="19" fill="none" stroke="#fff" opacity=".5"/><rect x="78.5" y="27" width="3" height="11" rx="1.5" fill="#d3263a"/>` + [...Array(9)].map((_, i) => { const a = (-225 + i * 33.75) * Math.PI / 180; return `<line x1="${(80 + 31 * Math.cos(a)).toFixed(1)}" y1="${(50 + 31 * Math.sin(a)).toFixed(1)}" x2="${(80 + 35 * Math.cos(a)).toFixed(1)}" y2="${(50 + 35 * Math.sin(a)).toFixed(1)}" stroke="#3b424c" stroke-width="1.4"/>`; }).join('')) },
    { id: 'neumorph', name: 'Neumorphism', aka: 'soft UI',
      desc: 'Shapes look pressed out of, or into, the same material as the background, using a light shadow on one side and a dark one on the other.',
      ref: 'smart-home control mockups on Dribbble',
      prompt: 'neumorphic soft UI, elements extruded from the background with soft light and dark shadows',
      ex: `<div class="hx neu"><div class="b"></div><div class="i"></div></div>` },
    { id: 'glass', name: 'Glassmorphism', aka: 'frosted glass',
      desc: 'Translucent panels that blur whatever sits behind them, usually floating over bright color blobs. Feels layered and airy.',
      ref: 'macOS and iOS control panels, Windows 11 "Mica"',
      prompt: 'glassmorphism, frosted translucent panels with background blur over soft color blobs',
      ex: `<div class="hx glass"><span class="blob" style="width:90px;height:90px;left:16%;top:8%;background:var(--x4)"></span><span class="blob" style="width:80px;height:80px;right:14%;bottom:6%;background:var(--x1)"></span><span class="blob" style="width:44px;height:44px;right:34%;top:10%;background:var(--x2)"></span><div class="p"><i style="width:60%"></i><i style="width:85%"></i><i style="width:40%"></i></div></div>` },
    { id: 'clay', name: 'Claymorphism', aka: '3D clay, soft 3D, puffy',
      desc: 'Chunky rounded 3D shapes that look like soft plastic or modelling clay, with gentle inner highlights. Friendly and toy-like.',
      ref: 'Headspace and Duolingo marketing, Blender "cute 3D" renders',
      prompt: 'soft 3D clay style, rounded puffy shapes, matte material, gentle studio lighting',
      ex: `<div class="hx clay"><div class="c" style="background:var(--x4l)"></div><div class="c" style="background:var(--x2l);border-radius:50%"></div><div class="c" style="background:var(--x3l)"></div></div>` },
    { id: 'lowpoly', name: 'Low-poly', aka: 'faceted, polygonal',
      desc: 'Objects built from a small number of flat triangles, each with its own shade. Reads as crafted and geometric.',
      ref: 'Monument-style landscapes, early 3D games',
      prompt: 'low-poly style, faceted triangles with flat shading',
      ex: sv(`<circle cx="128" cy="24" r="9" class="x2"/><polygon points="18,84 56,30 76,84" class="x1"/><polygon points="56,30 76,84 94,50" class="x1l"/><polygon points="76,84 94,50 108,84" class="x1d"/><polygon points="94,50 122,38 108,84" class="x3"/><polygon points="122,38 144,84 108,84" class="x3d"/><polygon points="56,30 66,46 50,42" class="sf"/>`) },
    { id: 'sketchy', name: 'Hand-drawn', aka: 'sketchy, whiteboard style, doodle',
      desc: 'Slightly wobbly lines that look drawn by hand. Makes technical diagrams feel informal, approachable and "work in progress".',
      ref: 'Excalidraw, whiteboard explainer videos',
      prompt: 'hand-drawn sketchy style like Excalidraw, wobbly marker lines, casual',
      ex: sv(`<defs><filter id="rough"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="4"/></filter></defs><g filter="url(#rough)"><rect x="16" y="32" width="46" height="32" rx="4" class="st"/><rect x="98" y="32" width="46" height="32" rx="4" class="st"/><path d="M64 48 H94 M87 42 l7 6 -7 6" class="st"/><path d="M24 72 q16 6 32 0" class="sx2"/><path d="M106 72 q16 6 32 0" class="sx3"/><text x="39" y="51" class="dt" style="font-family:Caveat,cursive;font-size:12px">idea</text><text x="121" y="51" class="dt" style="font-family:Caveat,cursive;font-size:12px">ship</text></g>`) },
    { id: 'pixel', name: 'Pixel art', aka: '8-bit, retro sprite',
      desc: 'Images built from a visible grid of square pixels with a tiny palette. Instantly reads as retro gaming.',
      ref: 'Space Invaders, Stardew Valley',
      prompt: '8-bit pixel art, visible square pixels, limited palette',
      ex: sv(pixels(['..1.....1..', '...1...1...', '..1111111..', '.11.111.11.', '11111111111', '1.1111111.1', '1.1.....1.1', '...11.11...'], 7.5, 38.75, 20, 'x3')) },
    { id: 'blueprint', name: 'Blueprint', aka: 'technical drawing, schematic',
      desc: 'Light lines on a deep blue grid with dimension marks, like an engineer\'s plan. Says "this is how it\'s built".',
      ref: 'architectural plans, patent drawings',
      prompt: 'blueprint style, white technical linework on a blue grid, dimension annotations',
      ex: sv(`<rect width="160" height="100" fill="#1d4a94"/><path d="${[...Array(16)].map((_, i) => `M${i * 10} 0V100`).join('')}${[...Array(10)].map((_, i) => `M0 ${i * 10}H160`).join('')}" stroke="#ffffff" stroke-opacity=".12"/><g fill="none" stroke="#dbe7ff" stroke-width="1.2"><rect x="40" y="28" width="80" height="44"/><circle cx="80" cy="50" r="12"/><path d="M80 34V66M64 50H96" stroke-dasharray="3 2"/><path d="M40 82H120M40 79V85M120 79V85M126 28V72M123 28H129M123 72H129"/></g><text x="80" y="92" fill="#dbe7ff" style="font:7px var(--mono)" text-anchor="middle">120 mm</text><text x="140" y="53" fill="#dbe7ff" style="font:7px var(--mono)" text-anchor="middle">66</text>`) },
    { id: 'wireframe', name: 'Wireframe', aka: 'lo-fi mockup, grey-box',
      desc: 'Grey boxes and placeholder lines that show structure only, with no styling. Used to agree on layout before any visual design.',
      ref: 'Balsamiq, early-stage product specs',
      prompt: 'low-fidelity wireframe, grey boxes and placeholder lines, no styling',
      ex: sv(`<rect x="22" y="12" width="116" height="78" rx="4" class="sf" stroke="var(--g3)"/><rect x="30" y="20" width="100" height="8" class="gr"/><rect x="30" y="34" width="46" height="36" class="sf" stroke="var(--g3)"/><path d="M30 34 L76 70 M76 34 L30 70" stroke="var(--g3)"/><rect x="84" y="36" width="46" height="5" class="gr"/><rect x="84" y="46" width="38" height="5" class="gr"/><rect x="84" y="56" width="42" height="5" class="gr"/><rect x="30" y="76" width="28" height="8" rx="2" class="gd"/>`) }
  ]
});

pool.groups.push({
  id: 'depth', title: 'Perspective & depth', slot: 'Perspective',
  intro: 'Where the viewer is standing, and how depth is shown. Pair one of these with a rendering style.',
  terms: [
    { id: 'ortho', name: 'Front view', aka: 'orthographic, elevation, straight-on',
      desc: 'Looking straight at the front with no depth at all. Everything is shown at true proportions, like a flat facade.',
      ref: 'building elevations, app screenshots',
      prompt: 'straight-on front view, orthographic, no perspective',
      ex: sv(`<rect x="44" y="20" width="72" height="66" class="x1l"/><polygon points="40,22 80,6 120,22" class="x1d"/>` + [0, 1, 2].map(r => [0, 1, 2].map(c => `<rect x="${52 + c * 20}" y="${28 + r * 16}" width="12" height="10" class="sf"/>`).join('')).join('') + `<rect x="74" y="74" width="12" height="12" class="x2"/><rect x="20" y="86" width="120" height="3" class="gd"/>`) },
    { id: 'persp', name: 'Perspective', aka: 'vanishing point, 1-point / 2-point perspective',
      desc: 'Things shrink as they get further away and lines converge on a vanishing point. Feels cinematic and real.',
      ref: 'photography, film stills, architectural renders',
      prompt: 'one-point perspective with a central vanishing point, depth receding into the distance',
      ex: sv(`<rect width="160" height="44" class="x1l" opacity=".5"/><polygon points="0,100 160,100 84,44 76,44" class="g"/><path d="M80 100 L80 44" stroke="var(--xs)" stroke-width="1.5" stroke-dasharray="6 5"/>` + [[18, 30], [44, 18], [60, 10], [69, 6]].map(([x, h]) => `<rect x="${x}" y="${66 - h * 0.6}" width="${h * 0.25}" height="${h * 1.1}" class="x1d"/><rect x="${160 - x - h * 0.25}" y="${66 - h * 0.6}" width="${h * 0.25}" height="${h * 1.1}" class="x1d"/>`).join('') + `<circle cx="80" cy="44" r="2" class="x4"/>`) },
    { id: 'topdown', name: 'Top-down', aka: 'bird\'s-eye view, plan view, overhead',
      desc: 'Looking straight down from above, like a map or floor plan. Great for showing how parts are arranged in space.',
      ref: 'Google Maps, board-game boards, floor plans',
      prompt: 'top-down bird\'s-eye view, map-like layout',
      ex: sv(`<rect x="0" y="44" width="160" height="12" class="gd"/><rect x="74" y="0" width="12" height="100" class="gd"/><path d="M0 50H160M80 0V100" stroke="var(--xs)" stroke-dasharray="4 4"/><rect x="14" y="10" width="48" height="26" rx="2" class="x1l"/><rect x="96" y="8" width="26" height="28" rx="2" class="x2l"/><rect x="128" y="14" width="22" height="22" rx="2" class="x4l"/><circle cx="34" cy="78" r="12" class="x3"/><circle cx="54" cy="72" r="7" class="x3d"/><rect x="98" y="64" width="50" height="28" rx="2" class="x1"/>`) },
    { id: 'exploded', name: 'Exploded view', aka: 'exploded diagram, pulled-apart layers',
      desc: 'The parts of a thing separated along one direction so you can see every layer and how they fit back together. Ideal for "what\'s inside".',
      ref: 'IKEA manuals, iFixit teardowns, tech stack diagrams',
      prompt: 'exploded view, layers separated vertically with dashed guide lines showing how they stack',
      ex: sv(ib(80, 68, 24, 24, 4, 'x3') + ib(80, 38, 24, 24, 4, 'x2') + ib(80, 8, 24, 24, 4, 'x1') + `<path d="M59.2 20V46M100.8 20V46M59.2 50V76M100.8 50V76" class="sm dash"/>`) },
    { id: 'cutaway', name: 'Cutaway', aka: 'cross-section, cut-through',
      desc: 'A slice removed from the outside so the inner layers are visible while the rest stays whole.',
      ref: 'Earth\'s-core diagrams, engine cutaways, cable cross-sections',
      prompt: 'cutaway illustration with a wedge removed to reveal the inner layers',
      ex: sv(`<circle cx="80" cy="50" r="38" class="x2l"/><circle cx="80" cy="50" r="27" class="x2"/><circle cx="80" cy="50" r="15" class="x4"/><path d="M80 50 L80 12 A38 38 0 1 0 118 50 Z" class="x1"/><path d="M80 50 L80 12 M80 50 L118 50" class="ln"/>`) },
    { id: 'elevation', name: 'Elevation', aka: 'drop shadow, depth layers, z-axis',
      desc: 'Flat shapes made to float at different heights using shadows. Bigger, softer shadows mean higher up and more important.',
      ref: 'Material Design cards, macOS windows',
      prompt: 'cards at different elevations, soft drop shadows indicating depth',
      ex: `<div class="hx elev"><div class="c" style="box-shadow:0 1px 2px rgba(15,25,45,.25)"></div><div class="c" style="box-shadow:0 6px 12px rgba(15,25,45,.22)"></div><div class="c" style="box-shadow:0 16px 30px rgba(15,25,45,.28);transform:translateY(-6px)"></div></div>` },
    { id: 'dof', name: 'Depth of field', aka: 'background blur, bokeh, tilt-shift',
      desc: 'The subject is sharp and things behind it are blurred, pulling the eye to one spot. Tilt-shift is the miniature-model version of this.',
      ref: 'portrait-mode photos, tilt-shift city shots',
      prompt: 'shallow depth of field, sharp subject, softly blurred background',
      ex: sv(`<defs><filter id="blr"><feGaussianBlur stdDeviation="3.2"/></filter></defs><g filter="url(#blr)"><circle cx="30" cy="30" r="14" class="x2l"/><circle cx="126" cy="26" r="18" class="x4l"/><circle cx="110" cy="76" r="12" class="x1l"/><circle cx="34" cy="78" r="10" class="x3l"/></g><circle cx="76" cy="52" r="20" class="x1"/><circle cx="70" cy="46" r="6" class="sf" opacity=".6"/>`) }
  ]
});

// generic parallel-projection box: R and L are the screen vectors of the two ground axes
function ax(cx, by, R, L, h, t) {
  const ty = by - h, A = [cx, ty], B = [cx + R[0], ty + R[1]], C = [cx + R[0] + L[0], ty + R[1] + L[1]], D = [cx + L[0], ty + L[1]];
  const dn = q => [q[0], q[1] + h];
  return `<polygon class="${t}" points="${pts([D, C, dn(C), dn(D)])}"/><polygon class="${t}d" points="${pts([B, C, dn(C), dn(B)])}"/><polygon class="${t}l" points="${pts([A, B, C, D])}"/>`;
}
const voxels = (list) => list.slice().sort((a, b) => (a[0] + a[1]) - (b[0] + b[1]) || a[2] - b[2])
  .map(([i, j, k, t]) => ib(80 + (i - j) * 8.66, 34 + (i + j) * 5 - k * 10, 10, 10, 10, t)).join('');

pool.groups.push({
  id: 'three', title: '3D', slot: '3D',
  intro: 'Words for 3D scenes: the projection, the camera, the light, and what things are made of. Mix one from each, e.g. "isometric diorama, soft studio lighting, matte clay materials".',
  terms: [
    { id: 'axono', name: 'Axonometric', aka: 'isometric / dimetric / trimetric, parallel projection',
      desc: 'The family of 3D views with no vanishing point. Isometric tilts all three axes equally; dimetric and trimetric tilt them unevenly for a more natural or dramatic angle.',
      ref: 'technical illustration, game maps, Monument Valley (isometric)',
      prompt: 'dimetric axonometric view, parallel projection, no vanishing point',
      ex: sv(ax(30, 46, [17.3, 10], [-17.3, 10], 20, 'x1') + ax(80, 48, [21, 7], [-14, 10], 20, 'x2') + ax(130, 48, [22, 5], [-10, 12], 20, 'x3') + `<text x="30" y="88" class="dts">isometric</text><text x="80" y="88" class="dts">dimetric</text><text x="130" y="88" class="dts">trimetric</text>`) },
    { id: 'threequarter', name: 'Three-quarter view', aka: '¾ view, hero product angle',
      desc: 'The object turned about 45° and seen slightly from above, so you see the front, one side and the top at once. The classic product-shot angle.',
      ref: 'Apple product renders, car ads',
      prompt: 'three-quarter view from slightly above, showing front, side and top',
      ex: sv(`<ellipse cx="88" cy="86" rx="44" ry="6" class="ik" opacity=".14"/><polygon points="48,38 98,28 124,40 74,52" class="x1l"/><polygon points="48,38 74,52 74,86 48,70" class="x1"/><polygon points="74,52 124,40 124,72 74,86" class="x1d"/><rect x="82" y="58" width="30" height="4" rx="2" class="sf" opacity=".5" transform="rotate(-14 82 58)"/>`) },
    { id: 'lowangle', name: 'Low angle', aka: 'worm\'s-eye view, looking up',
      desc: 'The camera low on the ground looking up, so things tower over you. Makes a subject feel big, powerful or monumental.',
      ref: 'superhero film shots, skyscraper photography',
      prompt: 'dramatic low-angle shot looking up at the subject',
      ex: sv(`<polygon points="40,96 80,96 74,12 52,22" class="x1"/><polygon points="80,96 126,96 100,22 74,12" class="x1d"/>` + [30, 46, 62, 78].map(y => `<path d="M${52 + (y - 22) * -.16} ${y}L${76 - (y - 12) * -.05} ${y + 4}" stroke="var(--x1l)" stroke-width="2"/>`).join('') + `<rect x="0" y="94" width="160" height="6" class="gd"/><circle cx="138" cy="80" r="3" class="x2"/><rect x="136" y="83" width="4" height="11" rx="2" class="x2"/>`) },
    { id: 'studio', name: 'Studio lighting', aka: 'softbox lighting, three-point lighting',
      desc: 'Soft, even light from big diffuse sources, like a photo studio. Gentle gradients, soft shadows, nothing harsh. The default for clean product and object renders.',
      ref: 'product photography, Spline and Blender showcase renders',
      prompt: 'soft studio lighting from a large softbox, gentle gradients and soft shadows',
      ex: sv(`<defs><radialGradient id="d3st" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" style="stop-color:var(--x4l)"/><stop offset="1" style="stop-color:var(--x4d)"/></radialGradient><filter id="d3sb"><feGaussianBlur stdDeviation="4"/></filter></defs><rect x="14" y="8" width="34" height="18" rx="3" class="sf" opacity=".9" transform="rotate(-20 31 17)"/><ellipse cx="90" cy="84" rx="30" ry="6" class="ik" opacity=".25" filter="url(#d3sb)"/><circle cx="84" cy="54" r="27" fill="url(#d3st)"/>`) },
    { id: 'rimlight', name: 'Rim light', aka: 'backlight, edge light',
      desc: 'Light from behind the subject that outlines its edge with a bright glow, separating it from a dark background. Moody and cinematic.',
      ref: 'film noir portraits, game character art',
      prompt: 'strong rim lighting from behind, glowing edges against a dark background',
      ex: sv(`<defs><radialGradient id="d3rim" cx=".38" cy=".42" r=".62"><stop offset="0" stop-color="#151b2b"/><stop offset=".82" stop-color="#1c2540"/><stop offset="1" stop-color="#ffcf7a"/></radialGradient><filter id="d3rg" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter></defs><rect width="160" height="100" fill="#0c101a"/><circle cx="84" cy="52" r="29" fill="#ff9e3d" opacity=".55" filter="url(#d3rg)"/><circle cx="80" cy="52" r="28" fill="url(#d3rim)"/>`) },
    { id: 'ao', name: 'Contact shadows', aka: 'ambient occlusion, grounding shadow',
      desc: 'The soft darkening where objects touch the floor or each other. Without it, 3D objects look like they are floating or pasted on.',
      ref: 'any convincing 3D render',
      prompt: 'soft contact shadows and ambient occlusion so objects feel grounded',
      ex: sv(`<defs><filter id="d3ao" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter></defs><rect x="0" y="56" width="160" height="44" class="gr" opacity=".5"/>` + ib(42, 54, 16, 16, 18, 'x1') + `<ellipse cx="118" cy="64" rx="19" ry="9" class="ik" opacity=".45" filter="url(#d3ao)"/>` + ib(118, 54, 16, 16, 18, 'x1') + `<text x="42" y="96" class="dts">without</text><text x="118" y="96" class="dts">with</text>`) },
    { id: 'matteglossy', name: 'Matte vs. glossy', aka: 'surface finish, roughness, specular highlight',
      desc: 'Matte surfaces scatter light softly; glossy ones show a sharp bright highlight and reflections. One word changes how premium or soft an object feels.',
      ref: 'rubber (matte), ceramic and lacquer (glossy)',
      prompt: 'matte surfaces with no reflections (or: glossy with sharp specular highlights)',
      ex: sv(`<defs><radialGradient id="d3mt" cx=".4" cy=".35" r=".75"><stop offset="0" style="stop-color:var(--x3l)"/><stop offset="1" style="stop-color:var(--x3d)"/></radialGradient><radialGradient id="d3gl" cx=".4" cy=".35" r=".7"><stop offset="0" style="stop-color:var(--x3)"/><stop offset=".7" style="stop-color:var(--x3d)"/><stop offset="1" stop-color="#062e2a"/></radialGradient></defs><circle cx="46" cy="46" r="24" fill="url(#d3mt)"/><circle cx="114" cy="46" r="24" fill="url(#d3gl)"/><ellipse cx="105" cy="35" rx="7" ry="4.5" fill="#fff" transform="rotate(-30 105 35)"/><circle cx="124" cy="58" r="2" fill="#fff" opacity=".6"/><text x="46" y="88" class="dts">matte</text><text x="114" y="88" class="dts">glossy</text>`) },
    { id: 'glass3d', name: 'Glass & translucency', aka: 'transmission, refraction, frosted acrylic',
      desc: 'See-through materials that bend and tint what is behind them. Makes an object feel light, precious or high-tech.',
      ref: 'glass app icons, Apple Vision Pro UI',
      prompt: 'translucent glass material with refraction, background visible and slightly distorted through it',
      ex: sv(`<defs><clipPath id="d3gc"><circle cx="80" cy="50" r="30"/></clipPath><linearGradient id="d3gs" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity=".05"/></linearGradient></defs>` + [0, 1, 2, 3, 4].map(i => `<rect x="${14 + i * 28}" y="10" width="14" height="80" class="${['x1', 'x2', 'x4', 'x3', 'x1'][i]}"/>`).join('') + `<g clip-path="url(#d3gc)"><rect x="40" y="10" width="80" height="80" class="sf"/>` + [0, 1, 2, 3, 4].map(i => `<rect x="${6 + i * 34}" y="10" width="17" height="80" class="${['x1l', 'x2l', 'x4l', 'x3l', 'x1l'][i]}"/>`).join('') + `</g><circle cx="80" cy="50" r="30" fill="url(#d3gs)" stroke="#fff" stroke-width="1.5" stroke-opacity=".8"/>`) },
    { id: 'chrome', name: 'Chrome & metal', aka: 'metallic, reflective, liquid metal',
      desc: 'Mirror-like surfaces that reflect the sky and ground as bright and dark bands. Reads as futuristic, luxurious or Y2K.',
      ref: 'Y2K logos, Terminator 2 liquid metal, chrome 3D type',
      prompt: 'polished chrome material reflecting a bright sky and dark horizon',
      ex: sv(`<defs><linearGradient id="d3ch" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6f9fc"/><stop offset=".42" stop-color="#9aa7ba"/><stop offset=".5" stop-color="#232a36"/><stop offset=".62" stop-color="#596579"/><stop offset=".85" stop-color="#d7dee8"/><stop offset="1" stop-color="#ffffff"/></linearGradient></defs><circle cx="56" cy="50" r="26" fill="url(#d3ch)"/><rect x="92" y="26" width="44" height="48" rx="22" fill="url(#d3ch)"/><ellipse cx="48" cy="36" rx="6" ry="3" fill="#fff" transform="rotate(-25 48 36)"/>`) },
    { id: 'mesh', name: '3D wireframe', aka: 'mesh, topology, polygon grid',
      desc: 'A 3D object shown as the grid of lines that forms its surface, with no solid fill. Feels technical, digital and "under the hood".',
      ref: 'sci-fi HUDs, 3D modelling software, 90s tech ads',
      prompt: '3D wireframe mesh rendering, glowing grid lines, no solid surfaces',
      ex: sv(`<g fill="none" stroke="var(--x1)" stroke-width="1">` + [-24, -14, 0, 14, 24].map(y => { const r = Math.sqrt(32 * 32 - y * y); return `<ellipse cx="80" cy="${50 + y}" rx="${r.toFixed(1)}" ry="${(r * .22).toFixed(1)}"/>`; }).join('') + [0, 10, 20, 26, 30].map(rx => `<ellipse cx="80" cy="50" rx="${rx}" ry="32"/>`).join('') + `<circle cx="80" cy="50" r="32"/></g><path d="M20 90L140 90M40 82L120 82" class="sm dash"/>`) },
    { id: 'voxel', name: 'Voxel art', aka: '3D pixel art, blocky 3D',
      desc: 'Scenes built entirely from small identical cubes, like 3D pixels. Playful, retro and instantly readable.',
      ref: 'Minecraft, MagicaVoxel scenes, Crossy Road',
      prompt: 'voxel art, scene built from small uniform cubes',
      ex: sv(voxels([...[0, 1, 2, 3].flatMap(i => [0, 1, 2, 3].map(j => [i, j, 0, 'x3'])), [1, 1, 1, 'x2'], [2, 1, 1, 'x2'], [1, 2, 1, 'x2'], [1, 1, 2, 'x4'], [3, 3, 1, 'x1']])) },
    { id: 'diorama', name: 'Diorama', aka: 'isometric room, miniature scene, cutaway room',
      desc: 'A small self-contained 3D scene, often a room with two walls removed, like a doll\'s house or museum model. Great for showing a whole system in one tidy box.',
      ref: 'isometric room illustrations, tilt-shift miniatures',
      prompt: 'isometric diorama: a miniature room with two walls cut away, objects arranged inside',
      ex: sv(`<polygon points="45.4,60 80,40 80,10 45.4,30" class="x1l"/><polygon points="80,40 114.6,60 114.6,30 80,10" class="x1"/><polygon points="92,36 104,43 104,31 92,24" class="sf" opacity=".85"/>` + ib(80, 44, 40, 40, 4, 'g') + ib(64, 52, 6, 6, 14, 'x3') + ib(92, 52, 10, 6, 8, 'x2')) },
    { id: 'floating', name: 'Floating objects', aka: 'levitating, hovering',
      desc: 'Objects suspended in mid-air with their shadow below them. Feels light, playful and a bit magical; good for hero visuals.',
      ref: 'app landing pages, 3D icon sets',
      prompt: 'objects floating in mid-air with soft shadows on the ground beneath',
      ex: sv(`<defs><filter id="d3fl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5"/></filter></defs><ellipse cx="80" cy="86" rx="22" ry="4" class="ik bobs" opacity=".2" filter="url(#d3fl)"/><g class="bob">` + ib(80, 50, 18, 18, 18, 'x4') + `</g>`) },
    { id: 'toon', name: 'Cel-shaded', aka: 'toon shading, anime 3D',
      desc: '3D objects lit with a few hard bands of flat color and a dark outline, so they look hand-drawn or cartoon-like.',
      ref: 'Zelda: Breath of the Wild, Borderlands, Spider-Verse',
      prompt: 'cel-shaded toon rendering, hard-edged shadow bands and bold outlines',
      ex: sv(`<circle cx="80" cy="50" r="28" class="x2"/><path d="M98 28 A28 28 0 0 1 64 74 A30 30 0 0 0 98 28 Z" class="x2d"/><ellipse cx="70" cy="38" rx="7" ry="4" fill="#fff" transform="rotate(-30 70 38)"/><circle cx="80" cy="50" r="28" fill="none" stroke="var(--ink)" stroke-width="2.6"/><ellipse cx="82" cy="88" rx="22" ry="4" class="ik" opacity=".8"/>`) },
    { id: 'extrude', name: 'Extruded type', aka: '3D text, block letters',
      desc: 'Flat letters or shapes pushed out into thick 3D blocks. Bold, chunky and attention-grabbing.',
      ref: '3D logo intros, retro movie titles',
      prompt: 'chunky extruded 3D lettering with visible depth',
      ex: sv([...Array(9)].map((_, i) => `<text x="${72 + i * 1.1}" y="${66 + i * 1.1}" class="x1d" style="font:800 46px var(--display)" text-anchor="middle">3D</text>`).join('') + `<text x="72" y="66" class="x1l" style="font:800 46px var(--display)" text-anchor="middle" stroke="var(--x1d)" stroke-width=".8">3D</text>`) },
    { id: 'orbit', name: 'Orbit / turntable', aka: '360° spin, camera orbit',
      desc: 'The camera circles around an object, or the object spins on a turntable, so you see it from every side. The standard way to show off a 3D model.',
      ref: 'product spin viewers, Sketchfab previews',
      prompt: 'slow 360° turntable rotation around the object',
      ex: sv(`<ellipse cx="80" cy="66" rx="52" ry="14" class="sm dash"/><ellipse cx="80" cy="66" rx="30" ry="8" class="gr"/>` + ib(80, 52, 14, 14, 18, 'x1') + `<circle r="5" class="x2 orb"/>`) },
    { id: 'render3d', name: 'Soft 3D render', aka: 'C4D look, Blender render, global illumination',
      desc: 'The polished, softly lit look of modern 3D software: smooth simple shapes, soft bounce light, gentle color gradients and a seamless backdrop.',
      ref: 'Cinema 4D, Blender, Spline, Octane renders on Dribbble',
      prompt: 'clean soft 3D render in the style of Cinema 4D or Blender, global illumination, seamless pastel backdrop',
      ex: sv(`<defs><linearGradient id="d3bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--x1l)" stop-opacity=".35"/><stop offset="1" style="stop-color:var(--x4l)" stop-opacity=".45"/></linearGradient><radialGradient id="d3sp" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff"/><stop offset=".5" style="stop-color:var(--x2l)"/><stop offset="1" style="stop-color:var(--x2d)"/></radialGradient><filter id="d3rs" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter></defs><rect width="160" height="100" fill="url(#d3bg)"/><ellipse cx="62" cy="80" rx="20" ry="4" class="ik" opacity=".18" filter="url(#d3rs)"/><ellipse cx="108" cy="80" rx="18" ry="4" class="ik" opacity=".18" filter="url(#d3rs)"/><circle cx="60" cy="58" r="20" fill="url(#d3sp)"/>` + ib(108, 56, 14, 14, 20, 'x4') + `<rect x="76" y="70" width="16" height="10" rx="5" class="x3l"/>`) }
  ]
});

pool.groups.push({
  id: 'diagram', title: 'Diagram types', slot: 'Diagram',
  intro: 'Ways to explain a concept. Choose by the question the picture answers: how does it flow, how is it built, how do the parts relate, how did it change?',
  terms: [
    { id: 'flowchart', name: 'Flowchart', aka: 'decision tree, process map',
      desc: 'Boxes for steps and diamonds for decisions, joined by arrows. Answers "what happens next, and when does it branch?"',
      ref: 'onboarding flows, troubleshooting guides',
      prompt: 'flowchart with step boxes, decision diamonds and labelled yes/no branches',
      ex: sv(`<rect x="60" y="4" width="40" height="13" rx="6.5" class="nd"/><text x="80" y="12.8" class="dt">start</text><path d="M80 17V26" class="ar"/>${box(54, 27, 52, 13, 'read input')}<path d="M80 40V48" class="ar"/><polygon points="80,49 98,60 80,71 62,60" class="x2l" stroke="var(--ink)" stroke-width="1.1"/><text x="80" y="62.5" class="dt">ok?</text><path d="M98 60H122V78" class="ar"/><path d="M62 60H38V78" class="ar"/><text x="110" y="57" class="dts">yes</text><text x="50" y="57" class="dts">no</text>${box(104, 79, 36, 13, 'answer', 'x3l')}${box(20, 79, 36, 13, 'retry', 'x4l')}`) },
    { id: 'sequence', name: 'Sequence diagram', aka: 'swim timeline, message flow',
      desc: 'Actors as columns with time running downward, and arrows for each message between them. Answers "who talks to whom, in what order?"',
      ref: 'API docs, UML',
      prompt: 'sequence diagram with lifelines for each actor and numbered messages flowing downward',
      ex: sv(`${box(14, 4, 32, 12, 'user')}${box(64, 4, 32, 12, 'agent', 'x1l')}${box(114, 4, 32, 12, 'tool')}<path d="M30 16V96M80 16V96M130 16V96" class="sm dash"/><path d="M30 32H79" class="ar"/><text x="55" y="29" class="dts">ask</text><path d="M80 48H129" class="ar"/><text x="105" y="45" class="dts">call</text><path d="M130 64H81" class="ar dash"/><text x="105" y="61" class="dts">result</text><path d="M80 80H31" class="ar"/><text x="55" y="77" class="dts">answer</text>`) },
    { id: 'pipeline', name: 'Pipeline', aka: 'data flow, process flow, assembly line',
      desc: 'Stages in a row with arrows between them, where each stage transforms what it receives. Answers "what does the input become?"',
      ref: 'ETL diagrams, how-a-compiler-works explainers',
      prompt: 'left-to-right pipeline diagram, each stage a box transforming the data, arrows between stages',
      ex: sv(`${box(4, 38, 30, 24, 'text', 'x2l')}<path d="M34 50H42" class="ar"/>${box(43, 38, 32, 24, 'tokens', 'x1l')}<path d="M75 50H83" class="ar"/>${box(84, 38, 32, 24, 'model', 'x1')}<path d="M116 50H124" class="ar"/>${box(125, 38, 31, 24, 'reply', 'x3l')}<text x="80" y="80" class="dts">each stage changes the data</text>`) },
    { id: 'layerstack', name: 'Layer stack', aka: 'architecture stack, layer cake',
      desc: 'Horizontal bands stacked on top of each other, where each layer is built on the one below. Answers "what sits on top of what?"',
      ref: 'the OSI model, cloud architecture slides',
      prompt: 'layer stack diagram, horizontal bands from foundation at the bottom to user-facing at the top',
      ex: sv(`${box(24, 8, 112, 18, 'your app', 'x3l')}${box(24, 30, 112, 18, 'agent loop', 'x2l')}${box(24, 52, 112, 18, 'language model', 'x1l')}${box(24, 74, 112, 18, 'GPUs & data centers')}`) },
    { id: 'hub', name: 'Hub and spoke', aka: 'radial diagram, star diagram',
      desc: 'One central idea with related pieces arranged around it. Answers "what connects to this one thing?"',
      ref: 'mind maps, "the agent and its tools"',
      prompt: 'hub-and-spoke diagram with a central node and satellites around it',
      ex: sv([...Array(6)].map((_, i) => { const a = i * Math.PI / 3 - Math.PI / 2; const x = 80 + 56 * Math.cos(a), y = 50 + 36 * Math.sin(a); return `<path d="M80 50L${x.toFixed(1)} ${y.toFixed(1)}" class="ln"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="8" class="nd"/>`; }).join('') + `<circle cx="80" cy="50" r="15" class="x1"/><text x="80" y="52.5" class="dt" style="fill:#fff">core</text>`) },
    { id: 'tree', name: 'Tree', aka: 'hierarchy, org chart, taxonomy',
      desc: 'A root that branches into children and grandchildren. Answers "how does this break down into parts?"',
      ref: 'org charts, file explorers, family trees',
      prompt: 'top-down tree diagram showing parent-child hierarchy',
      ex: sv(`<path d="M80 22V32H44V42M80 32H116V42M44 56V64H24V72M44 64H64V72M116 56V64H96V72M116 64H136V72" class="ln"/>${box(62, 8, 36, 14, 'root', 'x1l')}${box(28, 42, 32, 14, 'a')}${box(100, 42, 32, 14, 'b')}${[24, 64, 96, 136].map(x => box(x - 12, 72, 24, 14, '')).join('')}`) },
    { id: 'network', name: 'Network graph', aka: 'node-link diagram, knowledge graph',
      desc: 'Dots for things and lines for relationships, with no fixed hierarchy. Answers "how is everything connected?"',
      ref: 'social graphs, neural-net node diagrams',
      prompt: 'network graph of nodes and connecting edges, key nodes larger and highlighted',
      ex: (() => { const N = [[28, 30, 6], [60, 16, 5], [92, 36, 10], [128, 20, 5], [42, 72, 7], [84, 72, 5], [122, 78, 6], [146, 50, 4]]; const E = [[0, 1], [0, 2], [1, 2], [2, 3], [0, 4], [2, 4], [2, 5], [4, 5], [5, 6], [2, 6], [3, 7], [6, 7], [2, 7]]; return sv(E.map(([a, b]) => `<path d="M${N[a][0]} ${N[a][1]}L${N[b][0]} ${N[b][1]}" class="sm"/>`).join('') + N.map(([x, y, r], i) => `<circle cx="${x}" cy="${y}" r="${r}" class="${i === 2 ? 'x4' : i % 3 ? 'x1l' : 'x3'}"/>`).join('')); })() },
    { id: 'swimlane', name: 'Swimlane', aka: 'cross-functional flowchart',
      desc: 'A flowchart split into horizontal lanes, one per person or system, so you see who does each step.',
      ref: 'business process maps, incident runbooks',
      prompt: 'swimlane diagram with one lane per actor, steps hopping between lanes',
      ex: sv(`<rect x="2" y="4" width="156" height="30" class="sf"/><rect x="2" y="34" width="156" height="30" class="gr" opacity=".5"/><rect x="2" y="64" width="156" height="32" class="sf"/><text x="6" y="21" class="dtl">user</text><text x="6" y="51" class="dtl">agent</text><text x="6" y="82" class="dtl">tool</text><path d="M30 4V96" class="sm"/>${box(36, 12, 26, 14, '', 'x2l')}${box(66, 42, 26, 14, '', 'x1l')}${box(96, 72, 26, 14, '', 'x3l')}${box(126, 42, 26, 14, '', 'x1l')}<path d="M49 26V49H65" class="ar"/><path d="M79 56V79H95" class="ar"/><path d="M122 79H139V57" class="ar"/>`) },
    { id: 'timeline', name: 'Timeline', aka: 'chronology, roadmap',
      desc: 'Events placed along a line in date order. Answers "what happened when, and how did we get here?"',
      ref: 'history explainers, product roadmaps',
      prompt: 'horizontal timeline with dated milestones, labels alternating above and below',
      ex: sv(`<path d="M10 50H150" class="ln"/>` + [[24, '2017', 'Transformer'], [60, '2018', 'GPT-1'], [98, '2020', 'GPT-3'], [134, '2022', 'ChatGPT']].map(([x, y, l], i) => `<circle cx="${x}" cy="50" r="4" class="${i === 3 ? 'x4' : 'x1'}"/><path d="M${x} ${i % 2 ? 54 : 46}V${i % 2 ? 66 : 34}" class="sm"/><text x="${x}" y="${i % 2 ? 74 : 30}" class="dt">${y}</text><text x="${x}" y="${i % 2 ? 83 : 21}" class="dts">${l}</text>`).join('')) },
    { id: 'venn', name: 'Venn diagram', aka: 'overlap diagram',
      desc: 'Overlapping circles where the overlap shows what two or three ideas share.',
      ref: 'the "ikigai" chart, skills overlaps',
      prompt: 'Venn diagram of overlapping translucent circles, shared area labelled',
      ex: sv(`<circle cx="62" cy="50" r="32" class="x1" opacity=".55"/><circle cx="98" cy="50" r="32" class="x2" opacity=".6"/><text x="48" y="53" class="dt">code</text><text x="112" y="53" class="dt">words</text><text x="80" y="53" class="dt">LLM</text>`) },
    { id: 'quadrant', name: '2×2 matrix', aka: 'quadrant chart, magic quadrant',
      desc: 'Two axes split the space into four boxes so items can be sorted by two qualities at once.',
      ref: 'effort vs. impact, Eisenhower matrix',
      prompt: '2x2 quadrant matrix with labelled axes and items plotted in each quadrant',
      ex: sv(`<rect x="86" y="8" width="62" height="38" class="x3l" opacity=".6"/><path d="M24 50H148M86 8V92" class="ln"/><path d="M24 92H148M24 8V92" class="sm"/><text x="117" y="18" class="dts">quick wins</text><text x="86" y="99" class="dts">effort →</text><text x="12" y="52" class="dts" transform="rotate(-90 12 50)">impact →</text>` + [[104, 30], [126, 22], [52, 28], [60, 70], [118, 66], [40, 80]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="4" class="${i < 2 ? 'x3d' : 'x1'}"/>`).join('')) },
    { id: 'funnel', name: 'Funnel', aka: 'conversion funnel, narrowing stages',
      desc: 'Wide at the top, narrow at the bottom, showing how much survives each stage.',
      ref: 'sales funnels, search ranking explainers',
      prompt: 'funnel diagram with stages narrowing from top to bottom',
      ex: sv(`<polygon points="20,8 140,8 128,28 32,28" class="x1l"/><polygon points="34,31 126,31 114,51 46,51" class="x1"/><polygon points="48,54 112,54 100,74 60,74" class="x1d"/><polygon points="62,77 98,77 92,94 68,94" class="x2"/><text x="80" y="20.5" class="dt">1M documents</text><text x="80" y="43.5" class="dt" style="fill:#fff">10k</text><text x="80" y="66.5" class="dt" style="fill:#fff">100</text><text x="80" y="88" class="dt">5</text>`) },
    { id: 'callouts', name: 'Annotated callouts', aka: 'labels with leader lines',
      desc: 'Short labels connected to parts of a picture by thin lines. Turns any illustration into an explanation.',
      ref: 'anatomy diagrams, product feature shots',
      prompt: 'annotated callouts, short labels connected to parts by thin leader lines with dots',
      ex: sv(ib(58, 40, 22, 22, 22, 'x1') + `<circle cx="58" cy="29" r="2" class="ik"/><path d="M58 29H104" class="ln"/><text x="108" y="31.5" class="dtl">top</text><circle cx="68" cy="56" r="2" class="ik"/><path d="M68 56L84 52H104" class="ln"/><text x="108" y="54.5" class="dtl">side</text><circle cx="50" cy="72" r="2" class="ik"/><path d="M50 72L62 84H104" class="ln"/><text x="108" y="86.5" class="dtl">base</text>`) },
    { id: 'zoom', name: 'Zoom inset', aka: 'magnifier, detail view, callout zoom',
      desc: 'A big picture with one small area enlarged in a bubble beside it. Shows the forest and a tree at once.',
      ref: 'map insets, microscopy figures',
      prompt: 'zoom inset: a small highlighted region magnified in a circle beside the main image',
      ex: sv(`<defs><clipPath id="zc"><circle cx="122" cy="50" r="30"/></clipPath></defs><rect x="10" y="20" width="64" height="60" rx="3" class="sf" stroke="var(--g3)"/>` + [...Array(48)].map((_, i) => `<rect x="${14 + (i % 8) * 7.5}" y="${24 + Math.floor(i / 8) * 9}" width="5" height="6" class="${i === 27 ? 'x4' : 'gr'}"/>`).join('') + `<rect x="46" y="40" width="14" height="14" fill="none" stroke="var(--x2d)" stroke-width="1.5"/><path d="M60 40L106 25M60 54L106 75" class="sm"/><g clip-path="url(#zc)"><rect x="92" y="20" width="60" height="60" class="sf"/><rect x="96" y="30" width="20" height="24" class="gr"/><rect x="122" y="30" width="20" height="24" class="x4"/><rect x="96" y="60" width="20" height="24" class="gr"/><rect x="122" y="60" width="20" height="24" class="gr"/></g><circle cx="122" cy="50" r="30" fill="none" stroke="var(--x2d)" stroke-width="2"/>`) },
    { id: 'beforeafter', name: 'Before / after', aka: 'side-by-side comparison',
      desc: 'Two panels next to each other showing a state before and after a change. The difference is the message.',
      ref: 'renovation photos, "without vs. with" product pages',
      prompt: 'side-by-side before/after comparison, same framing in both panels',
      ex: sv(`<rect x="8" y="12" width="62" height="70" rx="4" class="sf" stroke="var(--g3)"/><rect x="90" y="12" width="62" height="70" rx="4" class="sf" stroke="var(--g3)"/>` + [[18, 24], [44, 30], [30, 50], [56, 46], [22, 70], [50, 66], [38, 34], [60, 72]].map(([x, y]) => `<rect x="${x - 4}" y="${y - 4}" width="8" height="8" class="gd" transform="rotate(${(x * 7) % 40 - 20} ${x} ${y})"/>`).join('') + [0, 1, 2, 3].map(r => [0, 1].map(c => `<rect x="${102 + c * 24}" y="${22 + r * 14}" width="14" height="8" rx="1" class="x1"/>`).join('')).join('') + `<path d="M73 47H87" class="ar"/><text x="39" y="93" class="dts">before</text><text x="121" y="93" class="dts">after</text>`) },
    { id: 'multiples', name: 'Small multiples', aka: 'grid of mini charts, trellis',
      desc: 'The same small chart repeated for each case, with identical axes, so differences jump out.',
      ref: 'Edward Tufte, per-country COVID charts',
      prompt: 'small multiples: a grid of identical mini charts sharing the same axes',
      ex: sv([[10, 12], [58, 12], [106, 12], [10, 56], [58, 56], [106, 56]].map(([x, y], i) => { const sh = [[0, 8, 14, 20, 26], [0, 14, 10, 22, 30], [0, 4, 6, 8, 10], [0, 10, 24, 20, 28], [0, 2, 12, 26, 30], [0, 6, 4, 10, 16]][i]; return `<rect x="${x}" y="${y}" width="44" height="38" rx="2" class="sf" stroke="var(--g2)"/><path d="M${x + 4} ${y + 34}H${x + 40}" class="sm"/><polyline points="${sh.map((v, k) => `${x + 4 + k * 9},${y + 34 - v}`).join(' ')}" fill="none" stroke="var(--${i === 4 ? 'x4' : 'x1'})" stroke-width="1.6"/>`; }).join('')) },
    { id: 'cycle', name: 'Cycle', aka: 'loop diagram, feedback loop',
      desc: 'Steps arranged in a circle with arrows that come back to the start. Answers "what repeats?"',
      ref: 'the agent loop, the water cycle, build-measure-learn',
      prompt: 'cycle diagram with steps around a circle and curved arrows looping back',
      ex: sv(`<path d="M100 14 Q126 18 130 38" class="ar"/><path d="M130 62 Q126 82 100 86" class="ar"/><path d="M60 86 Q34 82 30 62" class="ar"/><path d="M30 38 Q34 18 60 14" class="ar"/><rect x="60" y="7" width="40" height="14" rx="7" class="x1l"/><text x="80" y="16.5" class="dt">think</text><rect x="114" y="43" width="36" height="14" rx="7" class="x2l"/><text x="132" y="52.5" class="dt">act</text><rect x="58" y="79" width="44" height="14" rx="7" class="x3l"/><text x="80" y="88.5" class="dt">observe</text><rect x="10" y="43" width="40" height="14" rx="7" class="x4l"/><text x="30" y="52.5" class="dt">decide</text>`) },
    { id: 'sankey', name: 'Sankey', aka: 'flow diagram with widths',
      desc: 'Bands that split and merge, where each band\'s thickness shows how much flows that way.',
      ref: 'energy-use charts, budget breakdowns',
      prompt: 'Sankey diagram, band widths proportional to the amount flowing between stages',
      ex: sv(`<path d="M18 10 C80 10 80 4 142 4 L142 34 C80 34 80 40 18 40 Z" class="x1" opacity=".55"/><path d="M18 40 C80 40 80 40 142 40 L142 70 C80 70 80 70 18 70 Z" class="x2" opacity=".6"/><path d="M18 70 C80 70 80 76 142 76 L142 96 C80 96 80 90 18 90 Z" class="x3" opacity=".6"/><rect x="12" y="10" width="6" height="80" class="ik"/><rect x="142" y="4" width="6" height="30" class="x1d"/><rect x="142" y="40" width="6" height="30" class="x2d"/><rect x="142" y="76" width="6" height="20" class="x3d"/>`) },
    { id: 'heatmap', name: 'Heatmap', aka: 'grid of intensities, attention map',
      desc: 'A grid where color strength shows how much of something is in each cell. Good for patterns across two dimensions.',
      ref: 'GitHub contribution graph, attention-weight visuals',
      prompt: 'heatmap grid, single hue from pale to saturated showing intensity',
      ex: sv([...Array(40)].map((_, i) => { const c = i % 8, r = Math.floor(i / 8); const v = Math.max(.08, 1 - Math.abs(c - r * 1.6) / 4.5) * (0.6 + 0.4 * ((i * 37) % 7) / 6); return `<rect x="${22 + c * 15}" y="${14 + r * 15}" width="13" height="13" rx="2" class="x1" fill-opacity="${v.toFixed(2)}"/>`; }).join('')) }
  ]
});

pool.groups.push({
  id: 'layout', title: 'Layout & composition', slot: 'Layout',
  intro: 'How things are arranged on the page or canvas: where the eye lands first and how much room everything gets.',
  terms: [
    { id: 'grid', name: 'Grid layout', aka: '12-column grid, modular grid',
      desc: 'Invisible columns that every element snaps to, so edges line up across the page. The backbone of most tidy designs.',
      ref: 'newspapers, Bootstrap, most websites',
      prompt: 'strict 12-column grid, elements aligned to column edges',
      ex: sv([...Array(12)].map((_, i) => `<rect x="${12 + i * 11.5}" y="8" width="8" height="84" class="x1l" opacity=".35"/>`).join('') + `<rect x="12" y="14" width="135.5" height="14" class="x1"/><rect x="12" y="34" width="65.5" height="36" class="x1d"/><rect x="81.5" y="34" width="66" height="16" class="x2"/><rect x="81.5" y="54" width="31" height="16" class="x3"/><rect x="116.5" y="54" width="31" height="16" class="x3"/><rect x="12" y="76" width="42" height="10" class="gd"/>`) },
    { id: 'bento', name: 'Bento grid', aka: 'bento box layout',
      desc: 'Tiles of different sizes packed into a neat rectangle, like compartments in a bento lunch box. Each tile shows one feature.',
      ref: 'Apple product pages, personal portfolio sites',
      prompt: 'bento grid layout, rounded tiles of varied sizes packed into a tidy rectangle',
      ex: sv(`<rect x="12" y="10" width="64" height="48" rx="7" class="x1"/><rect x="80" y="10" width="68" height="22" rx="7" class="x2l"/><rect x="80" y="36" width="32" height="22" rx="7" class="x3"/><rect x="116" y="36" width="32" height="54" rx="7" class="x4l"/><rect x="12" y="62" width="30" height="28" rx="7" class="x2"/><rect x="46" y="62" width="66" height="28" rx="7" class="x1l"/>`) },
    { id: 'cards', name: 'Card layout', aka: 'card grid, tiles',
      desc: 'Repeated self-contained boxes, each with an image, title and text. Easy to scan and compare.',
      ref: 'Netflix rows, blog indexes, app stores',
      prompt: 'card layout, equal cards in a row each with image, title and short text',
      ex: sv([14, 62, 110].map((x, i) => `<rect x="${x}" y="16" width="38" height="68" rx="5" class="sf" stroke="var(--g2)"/><rect x="${x}" y="16" width="38" height="28" rx="5" class="${['x1l', 'x2l', 'x3l'][i]}"/><rect x="${x + 5}" y="50" width="26" height="5" rx="2" class="gd"/><rect x="${x + 5}" y="60" width="20" height="3" rx="1.5" class="gr"/><rect x="${x + 5}" y="66" width="24" height="3" rx="1.5" class="gr"/>`).join('')) },
    { id: 'hero', name: 'Hero section', aka: 'hero banner, above the fold',
      desc: 'A large opening block with a big headline, short line of text and one main button. The first thing anyone sees.',
      ref: 'almost every landing page',
      prompt: 'bold hero section: large headline, one-line subhead and a single call-to-action button',
      ex: sv(`<rect x="10" y="8" width="140" height="56" rx="4" class="x1d"/><rect x="22" y="20" width="76" height="10" rx="2" class="sf"/><rect x="22" y="34" width="56" height="5" rx="2" class="x1l"/><rect x="22" y="46" width="28" height="10" rx="5" class="x2"/><circle cx="124" cy="36" r="16" class="x1l"/><rect x="10" y="70" width="44" height="22" rx="3" class="gr"/><rect x="58" y="70" width="44" height="22" rx="3" class="gr"/><rect x="106" y="70" width="44" height="22" rx="3" class="gr"/>`) },
    { id: 'split', name: 'Split screen', aka: 'two-column, half and half',
      desc: 'The canvas divided into two halves, often image on one side and words on the other. Good for comparisons or pairing a visual with text.',
      ref: 'login pages, editorial features',
      prompt: 'split-screen layout, image on the left half and text on the right half',
      ex: sv(`<rect x="10" y="10" width="70" height="80" class="x3"/><circle cx="45" cy="44" r="16" class="x3l"/><polygon points="16,90 40,62 60,80 74,70 80,90" class="x3d"/><rect x="92" y="28" width="52" height="9" rx="2" class="ik"/><rect x="92" y="44" width="46" height="4" rx="2" class="gd"/><rect x="92" y="52" width="40" height="4" rx="2" class="gd"/><rect x="92" y="66" width="26" height="9" rx="4.5" class="x2"/>`) },
    { id: 'masonry', name: 'Masonry', aka: 'Pinterest layout, waterfall',
      desc: 'Columns of items with uneven heights packed tightly, like bricks. Good for galleries of mixed shapes.',
      ref: 'Pinterest, Unsplash',
      prompt: 'masonry layout, columns of uneven-height tiles packed tightly',
      ex: sv([[12, [30, 22, 26]], [60, [18, 34, 26]], [108, [40, 16, 22]]].map(([x, hs], c) => { let y = 8; return hs.map((h, k) => { const r = `<rect x="${x}" y="${y}" width="42" height="${h}" rx="4" class="${['x1l', 'x2l', 'x3l', 'x4l', 'x1', 'gr'][(c * 2 + k) % 6]}"/>`; y += h + 4; return r; }).join(''); }).join('')) },
    { id: 'negative', name: 'Negative space', aka: 'whitespace, breathing room',
      desc: 'Deliberately empty space around things. Makes a design feel calm, premium and focused on what remains.',
      ref: 'Apple, luxury brands, museum labels',
      prompt: 'generous negative space, few elements, lots of breathing room',
      ex: sv(`<rect x="10" y="10" width="140" height="80" class="sf"/><circle cx="104" cy="58" r="6" class="x4"/><rect x="34" y="34" width="34" height="3" rx="1.5" class="ik"/><rect x="34" y="41" width="22" height="2" rx="1" class="gd"/>`) },
    { id: 'hierarchy', name: 'Visual hierarchy', aka: 'emphasis, reading order',
      desc: 'Using size, weight and color so the most important thing is seen first, then the next. Answers "where does the eye go?"',
      ref: 'any good poster or news front page',
      prompt: 'strong visual hierarchy: one dominant headline, a clear secondary level, quiet body text',
      ex: sv(`<rect x="20" y="16" width="110" height="18" rx="3" class="ik"/><rect x="20" y="42" width="72" height="8" rx="2" class="x1"/><rect x="20" y="58" width="120" height="3" rx="1.5" class="gd"/><rect x="20" y="65" width="114" height="3" rx="1.5" class="gd"/><rect x="20" y="72" width="100" height="3" rx="1.5" class="gd"/><rect x="20" y="79" width="70" height="3" rx="1.5" class="gd"/><text x="140" y="29" class="dts">1</text><text x="100" y="49" class="dts">2</text><text x="148" y="68" class="dts">3</text>`) },
    { id: 'thirds', name: 'Rule of thirds', aka: 'focal point, off-center composition',
      desc: 'The frame split into a 3×3 grid, with the subject placed on a line or crossing point instead of dead center. Feels more dynamic.',
      ref: 'photography, film framing',
      prompt: 'rule-of-thirds composition, subject placed off-center on a third line',
      ex: sv(`<rect x="10" y="10" width="140" height="80" class="x1l" opacity=".45"/><path d="M56.7 10V90M103.3 10V90M10 36.7H150M10 63.3H150" class="sm dash"/><circle cx="103.3" cy="36.7" r="13" class="x2"/><rect x="10" y="68" width="140" height="22" class="x3" opacity=".6"/>`) },
    { id: 'asym', name: 'Asymmetric balance', aka: 'dynamic balance, off-axis',
      desc: 'One heavy element on one side balanced by several lighter ones on the other, without mirroring. Feels modern and intentional.',
      ref: 'Swiss posters, magazine spreads',
      prompt: 'asymmetric but balanced composition, large element offset by smaller ones',
      ex: sv(`<rect x="14" y="14" width="74" height="72" class="x1"/><rect x="100" y="20" width="24" height="5" rx="2" class="ik"/><rect x="100" y="30" width="44" height="3" rx="1.5" class="gd"/><rect x="100" y="36" width="38" height="3" rx="1.5" class="gd"/><circle cx="132" cy="72" r="10" class="x2"/>`) },
    { id: 'dashboard', name: 'Sidebar + content', aka: 'dashboard layout, app shell',
      desc: 'A fixed navigation column on the left and a main work area that scrolls. Standard for apps and tools.',
      ref: 'Gmail, Notion, admin dashboards',
      prompt: 'app layout with a left sidebar for navigation and a main content area of panels',
      ex: sv(`<rect x="8" y="8" width="32" height="84" rx="3" class="x1d"/>` + [18, 28, 38, 48].map(y => `<rect x="14" y="${y}" width="20" height="4" rx="2" class="x1l"/>`).join('') + `<rect x="46" y="8" width="106" height="12" rx="3" class="gr"/><rect x="46" y="26" width="33" height="22" rx="3" class="sf" stroke="var(--g2)"/><rect x="83" y="26" width="33" height="22" rx="3" class="sf" stroke="var(--g2)"/><rect x="120" y="26" width="32" height="22" rx="3" class="sf" stroke="var(--g2)"/><rect x="46" y="54" width="106" height="38" rx="3" class="sf" stroke="var(--g2)"/><polyline points="52,84 70,74 88,78 106,64 124,68 146,58" fill="none" stroke="var(--x1)" stroke-width="1.6"/>`) }
  ]
});

pool.groups.push({
  id: 'color', title: 'Color', slot: 'Color',
  intro: 'Name the palette as a relationship ("analogous", "one accent") rather than listing hex codes, and Claude can pick colors that work together.',
  terms: [
    { id: 'mono', name: 'Monochromatic', aka: 'single-hue, tonal',
      desc: 'Many shades and tints of one hue. Calm, cohesive and hard to get wrong.',
      ref: 'IBM blue-only diagrams, sepia photos',
      prompt: 'monochromatic palette, shades and tints of a single blue',
      ex: cs(['#dce6fb', '#1f4fb5', '#0d2b6b', '#4a7de0', '#93b2f0']) },
    { id: 'analog', name: 'Analogous', aka: 'neighbor colors, harmonious',
      desc: 'Colors that sit next to each other on the color wheel, like teal, green and lime. Natural and pleasant.',
      ref: 'autumn leaves, ocean palettes',
      prompt: 'analogous palette of neighboring hues (teal, green, lime)',
      ex: cs(['#e6f4ea', '#1b7c8a', '#1f9a7a', '#59b35f', '#a9c93a']) },
    { id: 'comp', name: 'Complementary', aka: 'opposite colors, contrast pair',
      desc: 'Two colors from opposite sides of the wheel, such as blue and orange. Each makes the other pop.',
      ref: 'movie posters (teal and orange), sports kits',
      prompt: 'complementary palette, blue paired with orange accents',
      ex: cs(['#eef2fb', '#f08a1c', '#1f4fb5', '#0f2a63', '#f9c98f']) },
    { id: 'pastel', name: 'Pastel', aka: 'soft colors, candy palette',
      desc: 'Light, low-intensity colors with lots of white mixed in. Gentle, friendly and youthful.',
      ref: 'baby products, Notion illustrations, spring campaigns',
      prompt: 'soft pastel palette, light and low saturation',
      ex: cs(['#fdf3f6', '#f8c8d4', '#bcdcf6', '#cdebc8', '#e0d2f6']) },
    { id: 'muted', name: 'Muted', aka: 'desaturated, dusty, earthy',
      desc: 'Colors with some grey mixed in so nothing shouts. Sophisticated and easy on the eyes for long reading.',
      ref: 'Scandinavian interiors, documentary films',
      prompt: 'muted desaturated palette, dusty tones, nothing fully saturated',
      ex: cs(['#ebe7df', '#7d8f80', '#4f5d6b', '#b39f86', '#a46b5a']) },
    { id: 'contrast', name: 'High contrast', aka: 'bold, black and white plus one',
      desc: 'Very dark against very light, sometimes with one loud color. Punchy, readable and accessible.',
      ref: 'Nike ads, road signs',
      prompt: 'high-contrast palette, black and white with one bold yellow',
      ex: cs(['#ffffff', '#111111', '#111111', '#ffd400', '#111111']) },
    { id: 'neon', name: 'Neon on dark', aka: 'glow, dark mode with neon',
      desc: 'Saturated glowing colors on a near-black background. Feels techy, nocturnal and energetic.',
      ref: 'gaming UI, cyberpunk posters',
      prompt: 'dark background with glowing neon accents in magenta and cyan',
      ex: cs(['#0b0b18', '#ff2bd6', '#22f0ff', '#b6ff3b', '#7a5cff']) },
    { id: 'accent', name: 'One accent color', aka: '60-30-10 rule, neutral plus accent',
      desc: 'Mostly neutral greys or whites, with a single strong color reserved for the thing that matters. Guides attention precisely.',
      ref: 'Stripe docs, most good dashboards',
      prompt: 'mostly neutral palette with a single accent color used only for emphasis',
      ex: cs(['#f3f4f6', '#d3d8e0', '#9aa3b2', '#c3c9d3', '#2b50d8']) },
    { id: 'gradient', name: 'Gradient', aka: 'color blend, mesh gradient',
      desc: 'Colors that blend smoothly into each other. A mesh gradient blends several colors in soft organic patches.',
      ref: 'Instagram logo, Stripe homepage',
      prompt: 'smooth gradient background blending purple into coral',
      ex: sv(`<defs><linearGradient id="grd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5b3cf0"/><stop offset=".55" stop-color="#d94fa8"/><stop offset="1" stop-color="#ffa26b"/></linearGradient><radialGradient id="grm" cx=".25" cy=".8" r=".6"><stop offset="0" stop-color="#3ee0c8" stop-opacity=".9"/><stop offset="1" stop-color="#3ee0c8" stop-opacity="0"/></radialGradient></defs><rect x="10" y="8" width="140" height="84" rx="8" fill="url(#grd)"/><rect x="10" y="8" width="140" height="84" rx="8" fill="url(#grm)"/>`) },
    { id: 'duotone', name: 'Duotone', aka: 'two-color image',
      desc: 'An image reduced to just two colors, dark and light. Unifies mixed photos and feels graphic.',
      ref: 'Spotify campaign art',
      prompt: 'duotone treatment, every image in deep navy and hot pink only',
      ex: sv(`<rect x="10" y="8" width="140" height="84" rx="4" fill="#ff5f9e"/><circle cx="112" cy="32" r="12" fill="#ffd0e2"/><polygon points="10,92 50,40 78,70 98,52 150,92" fill="#1b1f5e"/><polygon points="40,92 64,64 86,92" fill="#2f3590"/>`) },
    { id: 'warmcool', name: 'Warm vs. cool', aka: 'color temperature',
      desc: 'Warm colors (reds, oranges) feel close and energetic; cool colors (blues, greens) feel distant and calm. Use them to separate two sides of an idea.',
      ref: 'heat maps, "problem vs. solution" visuals',
      prompt: 'warm colors for the problem side, cool colors for the solution side',
      ex: sv(`<rect x="10" y="8" width="70" height="84" fill="#f3d9c8"/><rect x="80" y="8" width="70" height="84" fill="#d3e3f3"/><circle cx="45" cy="44" r="18" fill="#e4572e"/><rect x="26" y="70" width="38" height="8" rx="4" fill="#f2a541"/><circle cx="115" cy="44" r="18" fill="#2a6fdb"/><rect x="96" y="70" width="38" height="8" rx="4" fill="#2bb3a3"/>`) },
    { id: 'semantic', name: 'Semantic color', aka: 'status colors, traffic light',
      desc: 'Colors that carry a fixed meaning: green for good, amber for warning, red for problems. Keep them separate from the decorative palette.',
      ref: 'CI dashboards, health checks',
      prompt: 'semantic status colors: green for success, amber for warning, red for error',
      ex: sv([['#1e8e63', 'passing', 22], ['#d9900f', 'slow', 50], ['#d1384a', 'failing', 78]].map(([c, l, y]) => `<rect x="30" y="${y - 10}" width="100" height="20" rx="10" fill="${c}" fill-opacity=".16"/><circle cx="44" cy="${y}" r="5" fill="${c}"/><text x="56" y="${y + 2.5}" class="dtl">${l}</text>`).join('')) }
  ]
});

pool.groups.push({
  id: 'type', title: 'Typography', slot: 'Type',
  intro: 'The letters set the voice before anyone reads a word. One family for headings and one for text is plenty.',
  terms: [
    { id: 'serif', name: 'Serif', aka: 'classic, bookish, editorial',
      desc: 'Letters with small feet on the strokes. Reads as traditional, literary and trustworthy.',
      ref: 'The New Yorker, Times New Roman, Georgia',
      prompt: 'elegant serif typeface for headings',
      ex: `<div class="hx typo"><div style="font:400 56px/1 'Instrument Serif',Georgia,serif">Aa</div><div style="font:400 15px 'Instrument Serif',Georgia,serif">A considered headline</div></div>` },
    { id: 'sans', name: 'Sans-serif', aka: 'grotesk, clean, modern',
      desc: 'Letters without the feet. Clean, neutral and the default for screens and interfaces.',
      ref: 'Helvetica, Inter, SF Pro',
      prompt: 'clean geometric sans-serif typeface',
      ex: `<div class="hx typo"><div style="font:600 54px/1 var(--body)">Aa</div><div style="font:500 14px var(--body)">A clear interface label</div></div>` },
    { id: 'monospace', name: 'Monospace', aka: 'code font, typewriter',
      desc: 'Every letter takes the same width, like code or a typewriter. Signals technical, precise, developer-ish.',
      ref: 'code editors, terminals, IBM Plex Mono',
      prompt: 'monospace typeface for labels and data, developer aesthetic',
      ex: `<div class="hx typo"><div style="font:500 40px/1 var(--mono)">fn()</div><div style="font:400 12px var(--mono)">tokens: 1,024 · temp: 0.7</div></div>` },
    { id: 'displayface', name: 'Display type', aka: 'headline face, expressive type',
      desc: 'A characterful font made for big sizes only. Gives a page its personality; never use it for paragraphs.',
      ref: 'movie posters, magazine covers',
      prompt: 'bold expressive display typeface for the headline only',
      ex: `<div class="hx typo"><div style="font:800 46px/0.95 var(--display);letter-spacing:-.03em;font-variation-settings:'opsz' 96">BIG<br>IDEA</div></div>` },
    { id: 'script', name: 'Handwritten', aka: 'script, marker font',
      desc: 'Type that looks written by hand. Warm and personal; best for short notes and annotations.',
      ref: 'sticky notes, wedding invites, Excalidraw labels',
      prompt: 'handwritten marker-style font for annotations',
      ex: `<div class="hx typo"><div style="font:600 40px/1 Caveat,'Comic Sans MS',cursive;color:var(--x4d)">note to self</div></div>` },
    { id: 'scale', name: 'Type scale', aka: 'heading levels, H1/H2/body',
      desc: 'A fixed set of sizes that step up in proportion, so headings, subheadings and text always relate cleanly.',
      ref: 'any design system',
      prompt: 'clear type scale with distinct H1, H2 and body sizes',
      ex: `<div class="hx typo" style="align-items:flex-start;text-align:left"><div style="font:700 30px/1.1 var(--display)">Heading 1</div><div style="font:600 19px/1.3 var(--display)">Heading 2</div><div style="font:400 13px/1.5 var(--body);color:var(--ink2)">Body text sits here at a calm reading size.</div></div>` },
    { id: 'weight', name: 'Weight contrast', aka: 'bold vs. light',
      desc: 'Mixing very heavy and very light weights of the same family. Creates emphasis without changing size or color.',
      ref: 'Spotify Wrapped, fashion brands',
      prompt: 'strong weight contrast, ultra-bold keywords next to light text',
      ex: `<div class="hx typo"><div style="font:300 34px/1.1 var(--display)">light <span style="font-weight:800">HEAVY</span></div></div>` },
    { id: 'tracking', name: 'Letter-spacing', aka: 'tracking',
      desc: 'The space between letters. Wide tracking feels airy and premium in caps; tight tracking makes big headlines punchy.',
      ref: 'luxury logos (wide), tech headlines (tight)',
      prompt: 'wide letter-spacing on small uppercase labels, tight tracking on large headlines',
      ex: `<div class="hx typo"><div style="font:500 13px var(--body);letter-spacing:.4em">W I D E</div><div style="font:800 34px/1 var(--display);letter-spacing:-.06em">Tight</div></div>` },
    { id: 'eyebrow', name: 'Eyebrow label', aka: 'kicker, overline',
      desc: 'A small uppercase label above a headline that names its category, like "CASE STUDY" or "STEP 2".',
      ref: 'blog posts, product sections',
      prompt: 'small uppercase eyebrow label above each heading',
      ex: `<div class="hx typo" style="align-items:flex-start;text-align:left"><div style="font:500 10px var(--mono);letter-spacing:.14em;color:var(--accent)">STEP 02 · TOKENS</div><div style="font:700 24px/1.15 var(--display)">Words become numbers</div></div>` }
  ]
});

pool.groups.push({
  id: 'shape', title: 'Shape, line & texture', slot: 'Shape & texture',
  intro: 'The small decisions that make a style feel soft or sharp, crafted or digital.',
  terms: [
    { id: 'rounded', name: 'Corner radius', aka: 'rounded corners, pill shapes',
      desc: 'How round the corners are. Sharp reads serious, softly rounded reads friendly, fully round "pill" reads playful.',
      ref: 'iOS (soft), Bloomberg terminal (sharp)',
      prompt: 'softly rounded corners on all shapes, pill-shaped buttons',
      ex: sv(`<rect x="14" y="30" width="30" height="40" class="x1"/><rect x="50" y="30" width="30" height="40" rx="6" class="x1"/><rect x="86" y="30" width="30" height="40" rx="14" class="x1"/><rect x="122" y="40" width="26" height="20" rx="10" class="x1"/><text x="29" y="82" class="dts">0</text><text x="65" y="82" class="dts">6</text><text x="101" y="82" class="dts">14</text><text x="135" y="82" class="dts">pill</text>`) },
    { id: 'geometric', name: 'Geometric', aka: 'hard-edged, primitives',
      desc: 'Built from perfect circles, squares and triangles. Feels precise, modern and constructed.',
      ref: 'Bauhaus, Google logo construction',
      prompt: 'geometric shapes only: circles, squares and triangles with crisp edges',
      ex: sv(`<rect x="22" y="30" width="36" height="36" class="x1"/><circle cx="82" cy="48" r="19" class="x2"/><polygon points="122,28 144,68 100,68" class="x4"/>`) },
    { id: 'organic', name: 'Organic', aka: 'blobs, fluid shapes',
      desc: 'Soft irregular curves that feel natural and hand-made. Takes the edge off technical content.',
      ref: 'wellness brands, Mailchimp illustrations',
      prompt: 'organic blob shapes and flowing curves, nothing perfectly geometric',
      ex: sv(`<path d="M44 22c18-8 40 2 42 22s-12 34-32 36-36-10-34-28 6-24 24-30z" class="x3"/><path d="M104 30c14-6 34 4 36 18s-8 30-24 30-26-10-26-24 2-18 14-24z" class="x2l"/><path d="M78 74c8-4 16 0 16 6s-6 10-12 9-10-4-4-15z" class="x4"/>`) },
    { id: 'stroke', name: 'Stroke weight', aka: 'line thickness, hairline vs. bold',
      desc: 'How thick the lines are. Hairlines feel delicate and technical; heavy strokes feel bold and graphic.',
      ref: 'technical drawings (thin), sticker art (thick)',
      prompt: 'consistent medium stroke weight on all lines and icons',
      ex: sv([0.5, 1.5, 3, 6].map((w, i) => `<path d="M${20 + i * 36} 72 L${40 + i * 36} 30 L${52 + i * 36} 60" fill="none" stroke="var(--ink)" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/><text x="${36 + i * 36}" y="88" class="dts">${w}px</text>`).join('')) },
    { id: 'grain', name: 'Grain', aka: 'noise texture, risograph feel',
      desc: 'A fine speckled texture laid over flat color, like film grain or print. Adds warmth and a tactile, analog feel.',
      ref: 'risograph prints, modern editorial illustration',
      prompt: 'subtle grain texture over flat colors, risograph print feel',
      ex: sv(`<defs><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0"/><feComposite in2="SourceGraphic" operator="in"/></filter></defs><circle cx="62" cy="50" r="30" class="x4"/><rect x="78" y="26" width="56" height="50" rx="4" class="x2"/><g filter="url(#noise)"><circle cx="62" cy="50" r="30" class="x4"/><rect x="78" y="26" width="56" height="50" rx="4" class="x2"/></g>`) },
    { id: 'pattern', name: 'Background pattern', aka: 'dot grid, graph paper',
      desc: 'A faint repeating pattern of dots or lines behind the content. Signals "workspace" or "canvas".',
      ref: 'Figma and Miro canvases, notebooks',
      prompt: 'faint dot-grid background like a design canvas',
      ex: sv([...Array(15)].map((_, c) => [...Array(9)].map((_, r) => `<circle cx="${10 + c * 10}" cy="${10 + r * 10}" r=".9" class="mu"/>`).join('')).join('') + `<rect x="46" y="30" width="68" height="40" rx="5" class="sf" stroke="var(--g3)"/><rect x="54" y="40" width="40" height="5" rx="2" class="x1"/><rect x="54" y="50" width="28" height="4" rx="2" class="gr"/>`) },
    { id: 'dashed', name: 'Solid vs. dashed', aka: 'line style',
      desc: 'Solid lines show what is real or happening now. Dashed lines show what is optional, planned, async or a boundary.',
      ref: 'architecture diagrams, sewing patterns',
      prompt: 'solid arrows for the main path, dashed arrows for optional or async steps',
      ex: sv(`${box(14, 22, 34, 18, 'A')}${box(112, 22, 34, 18, 'B')}${box(112, 62, 34, 18, 'C')}<path d="M48 31H111" class="ar"/><path d="M48 36Q80 70 111 71" class="ar dash"/><text x="80" y="27" class="dts">always</text><text x="76" y="68" class="dts">sometimes</text>`) },
    { id: 'glow', name: 'Glow', aka: 'bloom, halo, light emission',
      desc: 'A soft blurred halo of light around a shape, as if it emits light. Draws attention and adds atmosphere on dark backgrounds.',
      ref: 'sci-fi UI, neon signs',
      prompt: 'soft glow around the key element, like light emission',
      ex: sv(`<defs><filter id="glw" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter></defs><rect width="160" height="100" fill="#0e1220"/><circle cx="80" cy="50" r="18" fill="#3ee0ff" filter="url(#glw)"/><circle cx="80" cy="50" r="12" fill="#c9f7ff"/><circle cx="34" cy="32" r="3" fill="#7a8bb0"/><circle cx="128" cy="70" r="3" fill="#7a8bb0"/>`) }
  ]
});

pool.groups.push({
  id: 'motion', title: 'Motion', slot: 'Motion',
  intro: 'How things move and change. A little motion in the right place explains order and cause; too much becomes noise.',
  terms: [
    { id: 'easing', name: 'Easing', aka: 'ease-in-out, timing curve',
      desc: 'How speed changes during a movement. Linear feels robotic; ease-in-out speeds up then slows down, like real objects.',
      ref: 'every polished app transition',
      prompt: 'smooth ease-in-out transitions, nothing linear',
      ex: sv(`<path d="M24 34H136M24 70H136" class="sm"/><circle cx="24" cy="34" r="7" class="x3 mv lin"/><circle cx="24" cy="70" r="7" class="x1 mv eio"/><text x="24" y="22" class="dts" style="text-anchor:start">linear</text><text x="24" y="58" class="dts" style="text-anchor:start">ease-in-out</text>`) },
    { id: 'spring', name: 'Spring', aka: 'bounce, overshoot',
      desc: 'Motion that overshoots its target slightly and settles back, like a spring. Feels lively and physical.',
      ref: 'iOS interactions, Framer Motion',
      prompt: 'springy motion with a slight overshoot and settle',
      ex: sv(`<path d="M24 50H136" class="sm"/><path d="M120 40V60" stroke="var(--x4)" stroke-dasharray="2 2"/><rect x="17" y="42" width="16" height="16" rx="4" class="x2 mv spr"/>`) },
    { id: 'stagger', name: 'Stagger', aka: 'cascade, sequential reveal',
      desc: 'Items animate one after another with a short delay instead of all at once. Shows order and feels choreographed.',
      ref: 'list loads in Material Design',
      prompt: 'staggered entrance, items appear one after another with a short delay',
      ex: sv([0, 1, 2, 3].map(i => `<rect x="30" y="${16 + i * 18}" width="${100 - i * 14}" height="12" rx="3" class="x1 pop" style="animation-delay:${i * 0.18}s"/>`).join('')) },
    { id: 'fadeslide', name: 'Fade and slide', aka: 'enter transition, reveal',
      desc: 'Something fades in while moving a short distance into place. The quiet default for new content arriving.',
      ref: 'scroll reveals on landing pages',
      prompt: 'elements fade in while sliding up a few pixels',
      ex: sv(`<g class="pop"><rect x="44" y="24" width="72" height="52" rx="6" class="sf" stroke="var(--g3)"/><rect x="54" y="36" width="40" height="6" rx="3" class="x1"/><rect x="54" y="48" width="52" height="4" rx="2" class="gr"/><rect x="54" y="56" width="44" height="4" rx="2" class="gr"/></g>`) },
    { id: 'morph', name: 'Morph', aka: 'shape tween, transform',
      desc: 'One shape smoothly turns into another. Shows that two states are the same thing, changed.',
      ref: 'Apple keynote transitions, Lottie animations',
      prompt: 'shape morphs smoothly from one form into the next',
      ex: `<div class="hx"><div class="morph"></div></div>` },
    { id: 'pulse', name: 'Pulse', aka: 'ping, ripple, heartbeat',
      desc: 'A ring that expands and fades on repeat. Says "this is live" or "look here".',
      ref: 'live map dots, notification badges',
      prompt: 'subtle pulsing ring to show the element is live',
      ex: sv(`<circle cx="80" cy="50" r="14" fill="none" stroke="var(--x4)" stroke-width="2" class="ring"/><circle cx="80" cy="50" r="14" fill="none" stroke="var(--x4)" stroke-width="2" class="ring" style="animation-delay:1s"/><circle cx="80" cy="50" r="8" class="x4"/>`) },
    { id: 'flow', name: 'Flowing dashes', aka: 'marching ants, animated data flow',
      desc: 'Dashed lines that move along a path, showing direction of travel. Great for data moving between boxes.',
      ref: 'network diagrams, n8n and Zapier editors',
      prompt: 'animated dashed connectors showing data flowing along each arrow',
      ex: sv(`${box(10, 40, 34, 20, 'input')}${box(116, 18, 34, 20, 'model', 'x1l')}${box(116, 62, 34, 20, 'tools', 'x3l')}<path d="M44 50 C80 50 80 28 116 28" class="sx1 flow"/><path d="M44 50 C80 50 80 72 116 72" class="sx3 flow"/>`) },
    { id: 'parallax', name: 'Parallax', aka: 'layered scrolling, depth motion',
      desc: 'Layers move at different speeds, near ones faster than far ones, giving a sense of depth.',
      ref: 'Firewatch site, Apple product scroll pages',
      prompt: 'parallax effect, foreground layers move faster than background layers',
      ex: sv(`<rect width="160" height="100" class="x1l" opacity=".35"/><g class="p1"><circle cx="118" cy="24" r="9" class="x2l"/><polygon points="-10,72 30,36 70,72" class="x1l"/><polygon points="60,72 104,30 150,72 170,72" class="x1l"/></g><g class="p2"><polygon points="-20,84 30,50 80,84" class="x1"/><polygon points="70,84 120,46 180,84" class="x1"/></g><g class="p3"><rect x="-30" y="84" width="220" height="16" class="x1d"/><circle cx="40" cy="80" r="8" class="x3d"/><circle cx="120" cy="78" r="10" class="x3d"/></g>`) },
    { id: 'buildup', name: 'Build-up', aka: 'step-through, progressive disclosure',
      desc: 'A diagram appears piece by piece, in the order you would explain it out loud. Each step adds one idea.',
      ref: 'keynote builds, 3Blue1Brown videos',
      prompt: 'diagram builds up step by step, one component at a time in explanation order',
      ex: sv(`<g class="b1">${box(10, 38, 36, 24, 'prompt', 'x2l')}</g><g class="b2"><path d="M46 50H61" class="ar"/>${box(62, 38, 36, 24, 'model', 'x1l')}</g><g class="b3"><path d="M98 50H113" class="ar"/>${box(114, 38, 36, 24, 'answer', 'x3l')}</g>`) },
    { id: 'micro', name: 'Micro-interaction', aka: 'feedback animation, hover state',
      desc: 'A tiny response to an action: a button squishes when pressed, then shows a check. Confirms that something happened.',
      ref: 'Twitter like-heart, Stripe payment button',
      prompt: 'small micro-interactions on buttons: press feedback and a success state',
      ex: `<div class="hx"><div class="press"><span class="a">Save</span><span class="b">✓ Saved</span></div></div>` }
  ]
});

pool.groups.push({
  id: 'mood', title: 'Named aesthetics', slot: 'Mood',
  intro: 'Shorthand for a whole look. One of these words carries dozens of decisions about color, type and shape at once.',
  terms: [
    { id: 'minimal', name: 'Minimalist', aka: 'clean, less is more',
      desc: 'Only what is necessary, lots of space, restrained color and simple type. Calm and confident.',
      ref: 'Apple, Muji, Dieter Rams',
      prompt: 'minimalist: few elements, restrained color, lots of white space',
      ex: sv(`<rect width="160" height="100" fill="#f7f7f5"/><path d="M40 62H120" stroke="#1a1a1a" stroke-width=".8"/><circle cx="80" cy="44" r="7" fill="#1a1a1a"/><text x="80" y="76" fill="#777" style="font:5.5px var(--body);letter-spacing:.3em" text-anchor="middle">ONE THING</text>`) },
    { id: 'swiss', name: 'Swiss style', aka: 'International Typographic Style',
      desc: 'Strict grids, big bold sans-serif type set flush left, asymmetric layouts and a few flat colors, often red. Objective and timeless.',
      ref: 'Josef Müller-Brockmann posters, Helvetica',
      prompt: 'Swiss International style: strict grid, bold flush-left sans-serif, asymmetric layout, red accent',
      ex: sv(`<rect width="160" height="100" fill="#efeeea"/><rect x="104" y="0" width="56" height="100" fill="#e1251b"/><text x="12" y="44" fill="#111" style="font:800 30px/1 'Helvetica Neue',Arial,sans-serif;letter-spacing:-1.5px">Form</text><text x="12" y="72" fill="#111" style="font:800 30px/1 'Helvetica Neue',Arial,sans-serif;letter-spacing:-1.5px">follows</text><rect x="12" y="82" width="40" height="3" fill="#111"/><circle cx="132" cy="70" r="14" fill="#efeeea"/>`) },
    { id: 'bauhaus', name: 'Bauhaus', aka: 'primary geometric',
      desc: 'Primary colors (red, yellow, blue) plus black, built from circles, squares and triangles. Bold, playful and architectural.',
      ref: 'Bauhaus school posters, Kandinsky',
      prompt: 'Bauhaus style: primary colors, black, bold geometric shapes',
      ex: sv(`<rect width="160" height="100" fill="#efe6d2"/><circle cx="54" cy="50" r="30" fill="#d9302c"/><rect x="74" y="20" width="44" height="44" fill="#f2c230"/><polygon points="100,90 132,34 160,90" fill="#1f4fb5"/><rect x="10" y="84" width="90" height="6" fill="#111"/>`) },
    { id: 'brutalist', name: 'Brutalist', aka: 'neo-brutalism, raw web',
      desc: 'Deliberately raw: thick black borders, hard offset shadows, clashing flat colors, default-looking fonts. Loud and honest.',
      ref: 'Gumroad, Figma\'s FigJam stickers',
      prompt: 'neo-brutalist style: thick black outlines, hard offset shadows, flat bright colors',
      ex: sv(`<rect width="160" height="100" fill="#fff36b"/><rect x="34" y="26" width="96" height="52" fill="#111"/><rect x="28" y="20" width="96" height="52" fill="#ff90e8" stroke="#111" stroke-width="3"/><text x="76" y="51" fill="#111" style="font:700 13px var(--mono)" text-anchor="middle">RAW.HTML</text><rect x="44" y="58" width="40" height="8" fill="#fff" stroke="#111" stroke-width="2"/>`) },
    { id: 'editorial', name: 'Editorial', aka: 'magazine style',
      desc: 'Like a quality magazine: big serif headlines, columns of text, pull quotes, considered photography. Feels authored and thoughtful.',
      ref: 'The New York Times Magazine, Kinfolk',
      prompt: 'editorial magazine style: large serif headline, text columns, generous margins',
      ex: sv(`<rect width="160" height="100" fill="#fbfaf6"/><text x="14" y="30" fill="#1a1a1a" style="font:400 21px 'Instrument Serif',Georgia,serif">The Long Read</text><path d="M14 38H146" stroke="#1a1a1a" stroke-width=".6"/><text x="14" y="62" fill="#1a1a1a" style="font:400 26px 'Instrument Serif',Georgia,serif">T</text>` + [0, 1].map(c => [...Array(6)].map((_, r) => `<rect x="${(c ? 84 : 30) - (c || r > 2 ? 0 : 0)}" y="${46 + r * 7}" width="${c ? 62 : (r < 3 ? 46 : 62) }" height="2.4" fill="#9a968c" transform="translate(${!c && r > 2 ? -16 : 0} 0)"/>`).join('')).join('')) },
    { id: 'memphis', name: 'Memphis', aka: '80s Memphis, squiggle confetti',
      desc: 'Loud 1980s pattern style: squiggles, zigzags, confetti dots and triangles in pastels with black. Fun and chaotic.',
      ref: 'Memphis Group furniture, Saved by the Bell',
      prompt: 'Memphis design style: squiggles, zigzags, confetti shapes, pastel colors with black accents',
      ex: sv(`<rect width="160" height="100" fill="#fff2f7"/><path d="M14 30q8-12 16 0t16 0t16 0" fill="none" stroke="#111" stroke-width="3" stroke-linecap="round"/><polyline points="96,82 104,70 112,82 120,70 128,82 136,70" fill="none" stroke="#f2c230" stroke-width="4"/><polygon points="108,18 128,48 92,46" fill="#2bc3b5"/><circle cx="56" cy="70" r="16" fill="#ff8fb1"/><circle cx="56" cy="70" r="16" fill="none" stroke="#111" stroke-width="2" stroke-dasharray="2 3"/>` + [[24, 84], [86, 30], [146, 34], [140, 92], [80, 60]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.5" fill="#111"/>`).join('')) },
    { id: 'synthwave', name: 'Synthwave', aka: 'retrowave, outrun, vaporwave',
      desc: '1980s retro-future: neon pink and purple sunsets, a glowing grid running to the horizon, chrome text.',
      ref: 'Stranger Things titles, Kavinsky album art',
      prompt: 'synthwave retro-futurist style: neon sunset, glowing perspective grid, purple and magenta',
      ex: sv(`<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#160a38"/><stop offset="1" stop-color="#6a1b78"/></linearGradient><linearGradient id="sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd84a"/><stop offset="1" stop-color="#ff3f8e"/></linearGradient></defs><rect width="160" height="100" fill="url(#sky)"/><circle cx="80" cy="56" r="26" fill="url(#sun)"/>` + [44, 49, 53, 56].map((y, i) => `<rect x="50" y="${y}" width="60" height="${1.2 + i * .7}" fill="#3a0f55"/>`).join('') + `<rect y="58" width="160" height="42" fill="#13072b"/><g stroke="#ff3fd0" stroke-width=".8">` + [...Array(11)].map((_, i) => `<path d="M80 58L${-120 + i * 40} 100"/>`).join('') + [62, 67, 74, 84, 98].map(y => `<path d="M0 ${y}H160"/>`).join('') + `</g>`) },
    { id: 'terminal', name: 'Terminal', aka: 'hacker, CRT, command line',
      desc: 'Green or amber monospace text on black, a blinking cursor, maybe scanlines. Signals code, systems and under-the-hood.',
      ref: 'The Matrix, old CRT monitors, CLI tools',
      prompt: 'terminal aesthetic: green monospace text on black, blinking cursor',
      ex: sv(`<rect width="160" height="100" fill="#0b120c"/>` + ['$ agent run --task explain', '> reading 3 files…', '> calling tool: search', '> done in 4.2s'].map((t, i) => `<text x="12" y="${24 + i * 14}" fill="${i ? '#5be37a' : '#b8ffc9'}" style="font:7px var(--mono)">${t}</text>`).join('') + `<rect x="12" y="78" width="5" height="9" fill="#5be37a" class="blink"/>`) }
  ]
});

/* ---------- art, technique & architecture ---------- */
// seeded random so the generated examples look the same on every load
const rng = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pick = (r, a) => a[Math.floor(r() * a.length)];
const f1 = n => n.toFixed(1);
function jag(r, x, y, w, h, fill, rot) {
  const p = [];
  for (let i = 0; i <= 8; i++) p.push([x + w * i / 8, y + (r() - .5) * 2.4]);
  for (let i = 0; i <= 6; i++) p.push([x + w + (r() - .5) * 2.4, y + h * i / 6]);
  for (let i = 8; i >= 0; i--) p.push([x + w * i / 8, y + h + (r() - .5) * 2.4]);
  for (let i = 6; i >= 0; i--) p.push([x + (r() - .5) * 2.4, y + h * i / 6]);
  return `<polygon points="${pts(p)}" fill="${fill}" transform="rotate(${rot} ${x + w / 2} ${y + h / 2})"/>`;
}
const sky = `<rect width="160" height="100" style="fill:var(--tile)"/>`;
const ground = `<rect x="0" y="94" width="160" height="6" class="gd"/>`;

pool.groups.push({
  id: 'art', title: 'Art movements', slot: 'Art style',
  intro: 'Named periods in art history. Each one is a ready-made bundle of color, shape and texture you can borrow for an illustration, a slide or a whole UI theme. "Spot it" says what gives each one away.',
  terms: [
    { id: 'impressionism', name: 'Impressionism', aka: 'impressionist painting',
      desc: 'Painting the feeling of a moment of light rather than precise detail. Late 1800s France.',
      spot: 'short visible brushstrokes, soft edges with no outlines, shimmering light, everyday outdoor scenes',
      ref: 'Monet (Impression, Sunrise), Renoir, Degas',
      prompt: 'impressionist painting style, short visible brushstrokes, soft dappled light, no hard outlines',
      ex: (() => { const r = rng(3); let o = `<rect width="160" height="100" fill="#cddff0"/><rect y="56" width="160" height="44" fill="#6f95c4"/>`; const sk = ['#b9d3ea', '#d9cfe8', '#f2d7c9', '#a9c6e3', '#e8e2f0', '#f6e3c6']; const sea = ['#5d86b8', '#4a73a6', '#7aa0c9', '#3f6596', '#8fb2d6', '#9ab9da']; for (let i = 0; i < 420; i++) { const x = r() * 160, y = r() * 100; let c; if (y < 57) { const d = Math.hypot(x - 80, y - 36); c = d < 9 ? pick(r, ['#ee7d31', '#f6a55a']) : d < 16 && r() < .5 ? '#f6c79a' : pick(r, sk); } else { c = (Math.abs(x - 80) < 6 + (y - 57) * .35 && r() < .6) ? pick(r, ['#ee7d31', '#f6c27b', '#f3a35f']) : pick(r, sea); } o += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(3 + r() * 3)}" ry="1.7" fill="${c}" transform="rotate(${Math.round(r() * 30 - 15)} ${f1(x)} ${f1(y)})"/>`; } return sv(o + `<path d="M36 70h20l-3 4H39z" fill="#26304a"/><path d="M45 70V56" stroke="#26304a" stroke-width="1.3"/>`); })() },
    { id: 'pointillism', name: 'Pointillism', aka: 'divisionism, dot painting',
      desc: 'Pictures made entirely of small dots of pure color that blend into shapes when you step back.',
      spot: 'the whole image is tiny separate dots; colors mix in your eye, not on the canvas',
      ref: 'Georges Seurat (A Sunday on La Grande Jatte), Paul Signac',
      prompt: 'pointillism, image built from small dots of pure color',
      ex: (() => { const r = rng(9); let o = `<rect width="160" height="100" fill="#f5f1e6"/>`; for (let y = 2; y < 100; y += 3.6) for (let x = 2; x < 160; x += 3.6) { const jx = x + (r() - .5) * 1.4, jy = y + (r() - .5) * 1.4; let pal; if (Math.hypot(jx - 80, jy - 36) < 24) pal = ['#2f7d3b', '#3f9a48', '#7cbf4f', '#1f5f35', '#c9d84a']; else if (jx > 75 && jx < 85 && jy > 55 && jy < 78) pal = ['#6b4a2b', '#8a5f35', '#4a3320']; else if (jy > 70) pal = ['#7fb24f', '#a9c95a', '#e2d35a', '#5e9a42', '#3f7f6a']; else pal = ['#8fb9e0', '#b6d3ee', '#f3e3a0', '#c7d9f2', '#f2c2b8']; o += `<circle cx="${f1(jx)}" cy="${f1(jy)}" r="1.5" fill="${pick(r, pal)}"/>`; } return sv(o); })() },
    { id: 'ukiyoe', name: 'Ukiyo-e', aka: 'Japanese woodblock print',
      desc: 'Japanese woodblock prints from the 1600s to 1800s showing landscapes, waves, actors and city life.',
      spot: 'flat areas of color, bold dark outlines, Prussian blue, stylized waves and clouds, flattened space',
      ref: 'Hokusai (The Great Wave), Hiroshige',
      prompt: 'ukiyo-e woodblock print style, flat color areas, bold outlines, stylized waves, indigo and cream',
      ex: sv(`<rect width="160" height="100" fill="#efe3c6"/><polygon points="114,72 130,50 146,72" fill="#6d84a8"/><polygon points="124,58 130,50 136,58 132,56 128,58" fill="#fff"/><path d="M0 100 C14 64 44 30 86 32 C108 33 116 48 104 56 C98 50 88 52 90 60 C94 74 120 80 160 76 V100Z" fill="#1d3b6e" stroke="#0f1f3a" stroke-width="1.6"/><path d="M8 100 C24 74 52 52 80 52 C70 62 76 80 100 88 C120 92 140 90 160 88" fill="none" stroke="#7fa4cf" stroke-width="2"/>` + [[86, 32], [94, 35], [101, 40], [105, 47], [104, 55], [97, 51], [91, 54], [78, 33], [70, 36]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#fff" stroke="#0f1f3a" stroke-width=".8"/>`).join('') + `<rect x="10" y="8" width="10" height="26" fill="#c23a2b"/><path d="M12 13h6M12 19h6M12 25h6" stroke="#efe3c6"/>`) },
    { id: 'artnouveau', name: 'Art Nouveau', aka: 'Jugendstil, Liberty style',
      desc: 'Around 1890 to 1910. Decorative art inspired by plants and flowing natural forms, used on posters, metro stations and furniture.',
      spot: 'long flowing "whiplash" curves, vines and flowers, arched frames, muted olive, gold and rose colors',
      ref: 'Alphonse Mucha posters, Paris Métro entrances, Tiffany lamps',
      prompt: 'Art Nouveau style, flowing whiplash curves, floral ornament, arched decorative frame, muted olive and gold',
      ex: sv(`<rect width="160" height="100" fill="#e9dcbc"/><path d="M34 98V44Q34 8 80 8Q126 8 126 44V98" fill="#f6ecd5" stroke="#55622f" stroke-width="4"/><circle cx="80" cy="46" r="22" fill="#e6c97a"/><path d="M58 98C46 74 72 66 62 48C56 36 66 26 78 30" fill="none" stroke="#6f7f3a" stroke-width="2.6"/><path d="M102 98C114 74 88 66 98 48C104 36 94 26 82 30" fill="none" stroke="#6f7f3a" stroke-width="2.6"/><path d="M62 70c-10-4-14 2-16 8M98 70c10-4 14 2 16 8" fill="none" stroke="#6f7f3a" stroke-width="1.8"/>` + [[78, 30], [82, 30], [46, 78], [114, 78]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#d48a76"/><circle cx="${x}" cy="${y}" r="1.8" fill="#e7b84b"/>`).join('')) },
    { id: 'cubism', name: 'Cubism', aka: 'analytic / synthetic cubism',
      desc: 'Early 1900s. Objects broken into geometric facets and shown from several angles at once.',
      spot: 'fractured angular planes, several viewpoints in one image, muted browns, ochres and greys',
      ref: 'Picasso, Georges Braque, Juan Gris',
      prompt: 'cubist style, subject fractured into overlapping geometric planes seen from multiple angles, muted earthy palette',
      ex: (() => { const r = rng(21); const pal = ['#8a6f4e', '#b89a6a', '#5f5a52', '#c9b48a', '#3e3a35', '#a3866a', '#d8c7a3', '#6f7a78']; let o = `<rect width="160" height="100" fill="#cdbb95"/>`; for (let i = 0; i < 26; i++) { const cx = 20 + r() * 120, cy = 10 + r() * 80, n = 3 + Math.floor(r() * 2); const p = []; for (let k = 0; k < n; k++) { const a = k / n * Math.PI * 2 + r(); const d = 10 + r() * 22; p.push([cx + Math.cos(a) * d, cy + Math.sin(a) * d]); } o += `<polygon points="${pts(p)}" fill="${pick(r, pal)}" stroke="#2e2a26" stroke-width=".7" opacity=".92"/>`; } return sv(o + `<path d="M80 50 A16 16 0 0 1 80 82Z" fill="#2e2a26"/><path d="M80 50 A16 16 0 0 0 80 82" fill="none" stroke="#2e2a26" stroke-width="1.2"/><path d="M84 20V82M88 20V82" stroke="#f0e6cf" stroke-width=".8"/>`); })() },
    { id: 'destijl', name: 'De Stijl', aka: 'neoplasticism, Mondrian style',
      desc: 'Dutch movement from 1917. Reduced everything to straight lines, right angles and primary colors.',
      spot: 'thick black horizontal and vertical lines, white space, a few blocks of pure red, yellow and blue',
      ref: 'Piet Mondrian, the Rietveld chair',
      prompt: 'De Stijl / Mondrian composition: black grid lines, white fields, primary red, yellow and blue blocks',
      ex: sv(`<rect width="160" height="100" fill="#f4f1ea"/><rect width="70" height="58" fill="#d62b26"/><rect x="122" y="72" width="38" height="28" fill="#1e43a0"/><rect y="84" width="30" height="16" fill="#f2c614"/><rect x="122" y="0" width="38" height="20" fill="#f4f1ea"/><g fill="#111"><rect x="68" width="5" height="100"/><rect x="119" width="5" height="100"/><rect y="56" width="160" height="5"/><rect y="81" width="70" height="4"/><rect x="119" y="70" width="41" height="4"/><rect x="28" y="81" width="4" height="19"/><rect x="119" y="18" width="41" height="4"/></g>`) },
    { id: 'constructivism', name: 'Constructivism', aka: 'Russian avant-garde',
      desc: 'Soviet art and design from the 1920s. Art as a tool for a new society, full of energy and propaganda.',
      spot: 'strong diagonals, red and black on cream, bold sans-serif type, circles and wedges, photomontage',
      ref: 'El Lissitzky, Rodchenko, Soviet posters',
      prompt: 'Russian constructivist poster style: dynamic diagonals, red and black on cream, bold geometric type',
      ex: sv(`<rect width="160" height="100" fill="#ece2cf"/><circle cx="106" cy="46" r="30" fill="#151515"/><polygon points="6,92 104,44 20,100" fill="#d3261d"/><rect x="18" y="14" width="80" height="6" fill="#151515" transform="rotate(-24 58 17)"/><rect x="30" y="26" width="42" height="3" fill="#d3261d" transform="rotate(-24 51 27)"/><text x="98" y="94" fill="#151515" style="font:800 13px 'Helvetica Neue',Arial,sans-serif" transform="rotate(-24 98 94)">FORWARD</text>`) },
    { id: 'artdeco', name: 'Art Deco', aka: 'Deco, Jazz Age style',
      desc: '1920s and 30s glamour. Machine-age geometry mixed with luxury: think grand hotels, ocean liners and cinema lobbies.',
      spot: 'symmetry, sunbursts and fans, stepped shapes, thin gold lines on black or deep navy, tall elegant type',
      ref: 'Chrysler Building, The Great Gatsby, 1930s posters',
      prompt: 'Art Deco style: symmetrical geometric fans and sunbursts, stepped forms, thin gold linework on deep navy',
      ex: sv(`<rect width="160" height="100" fill="#10203a"/><g stroke="#d6b25e" fill="none" stroke-width="1">` + [...Array(13)].map((_, i) => { const a = Math.PI + i * Math.PI / 12; return `<path d="M80 96L${f1(80 + 90 * Math.cos(a))} ${f1(96 + 90 * Math.sin(a))}"/>`; }).join('') + [20, 34, 48].map(r => `<path d="M${80 - r} 96A${r} ${r} 0 0 1 ${80 + r} 96"/>`).join('') + `</g><polygon points="62,96 62,70 68,70 68,58 74,58 74,44 86,44 86,58 92,58 92,70 98,70 98,96" fill="#10203a" stroke="#d6b25e" stroke-width="1.5"/><path d="M80 44V96M74 58V96M86 58V96" stroke="#d6b25e" stroke-width=".7"/><rect x="8" y="8" width="144" height="84" fill="none" stroke="#d6b25e" stroke-width="1"/><rect x="11" y="11" width="138" height="78" fill="none" stroke="#d6b25e" stroke-width=".5"/>`) },
    { id: 'surrealism', name: 'Surrealism', aka: 'dreamlike art',
      desc: 'From the 1920s. Realistic painting of impossible, dream-like scenes, meant to tap the unconscious.',
      spot: 'precisely painted objects in illogical situations: melting, floating or out of scale; empty dreamy landscapes and long shadows',
      ref: 'Salvador Dalí (melting clocks), René Magritte',
      prompt: 'surrealist scene: realistic rendering of a dreamlike impossible situation, empty landscape, long shadows',
      ex: sv(`<defs><linearGradient id="srsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fb6da"/><stop offset="1" stop-color="#f3d8ad"/></linearGradient></defs><rect width="160" height="70" fill="url(#srsk)"/><rect y="70" width="160" height="30" fill="#d9b47c"/><rect x="26" y="58" width="50" height="16" fill="#7b5a3a"/><rect x="26" y="74" width="50" height="4" fill="#5b4028"/><path d="M36 58C36 46 68 44 72 56C74 62 80 66 78 80C76 88 70 84 70 76C70 66 58 60 36 58Z" fill="#ead58f" stroke="#8a6d2a" stroke-width="1.2"/><path d="M54 54L58 50M54 54L62 56" stroke="#3b2c14" stroke-width="1"/><circle cx="124" cy="28" r="10" fill="#9aa0a8"/><circle cx="121" cy="25" r="3" fill="#c9ced4"/><ellipse cx="140" cy="84" rx="18" ry="2.5" fill="#5b4028" opacity=".4"/>`) },
    { id: 'abstractexp', name: 'Abstract Expressionism', aka: 'action painting, gestural abstraction',
      desc: 'Post-war New York painting where the act of painting itself is the subject. Big, raw and emotional.',
      spot: 'no recognizable subject, energetic drips and splatters, sweeping gestural strokes, large scale',
      ref: 'Jackson Pollock, Willem de Kooning, Franz Kline',
      prompt: 'abstract expressionist style, energetic drips, splatters and gestural brushstrokes, no literal subject',
      ex: (() => { const r = rng(5); let o = `<rect width="160" height="100" fill="#f1ece1"/><path d="M14 70C40 40 70 86 104 48S146 30 152 22" fill="none" stroke="#c8352b" stroke-width="7" stroke-linecap="round"/>`; for (let i = 0; i < 22; i++) { const x0 = r() * 160, y0 = r() * 100; o += `<path d="M${f1(x0)} ${f1(y0)}C${f1(r() * 160)} ${f1(r() * 100)} ${f1(r() * 160)} ${f1(r() * 100)} ${f1(r() * 160)} ${f1(r() * 100)}" fill="none" stroke="${pick(r, ['#111', '#111', '#333', '#e8b730', '#f7f7f2'])}" stroke-width="${f1(.5 + r() * 2.2)}"/>`; } for (let i = 0; i < 60; i++) o += `<circle cx="${f1(r() * 160)}" cy="${f1(r() * 100)}" r="${f1(r() * 1.6 + .3)}" fill="${pick(r, ['#111', '#c8352b', '#e8b730'])}"/>`; return sv(o); })() },
    { id: 'popart', name: 'Pop Art', aka: 'comic style, 60s pop',
      desc: '1950s and 60s art that borrowed from comics, ads and packaging. Turns everyday commercial imagery into art.',
      spot: 'Ben-Day halftone dots, bold black outlines, flat bright primaries, speech bubbles, repeated images',
      ref: 'Roy Lichtenstein, Andy Warhol (soup cans, Marilyn)',
      prompt: 'pop art comic style: Ben-Day dots, thick black outlines, flat primary colors, speech bubble',
      ex: sv(`<rect width="160" height="100" fill="#ffe14d"/>` + [...Array(17)].map((_, i) => [...Array(11)].map((_, j) => `<circle cx="${i * 10 + (j % 2) * 5}" cy="${j * 10}" r="2" fill="#f0462e"/>`).join('')).join('') + `<polygon points="80,8 90,30 114,22 100,42 124,52 98,58 104,84 84,66 66,88 66,62 38,62 58,46 40,24 66,32" fill="#ffffff" stroke="#111" stroke-width="2.5"/><text x="81" y="55" fill="#e3261c" stroke="#111" stroke-width="1" style="font:900 20px Impact,'Arial Black',sans-serif" text-anchor="middle">POW!</text>`) },
    { id: 'opart', name: 'Op Art', aka: 'optical art',
      desc: '1960s art that uses precise patterns to trick the eye into seeing movement, depth or vibration.',
      spot: 'high-contrast black and white patterns, stripes or circles that seem to bulge, ripple or spin',
      ref: 'Bridget Riley, Victor Vasarely',
      prompt: 'op art optical illusion pattern, high-contrast black and white shapes that appear to move',
      ex: sv(`<rect width="160" height="100" fill="#111"/>` + [...Array(12)].map((_, i) => `<circle cx="${f1(80 + i * 1.6)}" cy="${f1(50 - i * .6)}" r="${64 - i * 5.2}" fill="${i % 2 ? '#111' : '#f4f4f0'}"/>`).join('')) }
  ]
});

pool.groups.push({
  id: 'technique', title: 'Illustration techniques', slot: 'Technique',
  intro: 'How an image is physically made: the medium and the marks. Adding one of these to a style ("isometric, risograph print") changes its whole texture.',
  terms: [
    { id: 'watercolor', name: 'Watercolor', aka: 'aquarelle, wash',
      desc: 'Transparent paint thinned with water, so colors bleed, pool and layer over each other.',
      spot: 'soft bleeding edges, darker rims where paint dried, see-through overlapping layers, paper showing through',
      ref: 'botanical illustration, travel sketchbooks',
      prompt: 'loose watercolor illustration, soft bleeding edges, transparent layered washes on textured paper',
      ex: sv(`<defs><filter id="wcf" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="2"/><feDisplacementMap in="SourceGraphic" scale="9"/><feGaussianBlur stdDeviation="1"/></filter></defs><rect width="160" height="100" fill="#fbf8f1"/><g filter="url(#wcf)" style="mix-blend-mode:multiply"><rect x="8" y="6" width="144" height="40" fill="#a9cbe8" opacity=".55"/><circle cx="62" cy="56" r="24" fill="#e86f8a" opacity=".55"/><circle cx="92" cy="58" r="22" fill="#f2b84b" opacity=".6"/><circle cx="78" cy="38" r="16" fill="#4f8fd0" opacity=".45"/><circle cx="62" cy="56" r="24" fill="none" stroke="#c94f6c" stroke-width="1.5" opacity=".5"/></g>`) },
    { id: 'hatching', name: 'Crosshatching', aka: 'pen and ink, hatching',
      desc: 'Shading with sets of parallel lines. More layers crossing each other means darker.',
      spot: 'tone made only from lines; denser and crossed lines in the shadows, bare paper in the light',
      ref: 'old engravings, banknotes, Wall Street Journal portraits',
      prompt: 'pen-and-ink crosshatching, shading built from layered parallel lines',
      ex: sv(`<defs><clipPath id="chc"><circle cx="80" cy="46" r="28"/></clipPath><mask id="chm1"><rect width="160" height="100" fill="#fff"/><circle cx="70" cy="36" r="20" fill="#000"/></mask><mask id="chm2"><rect width="160" height="100" fill="#fff"/><circle cx="73" cy="39" r="28" fill="#000"/></mask><clipPath id="chs"><ellipse cx="96" cy="80" rx="28" ry="6"/></clipPath></defs><rect width="160" height="100" fill="#f7f3ea"/><g clip-path="url(#chs)" stroke="#23262e" stroke-width=".6">` + [...Array(9)].map((_, i) => `<path d="M60 ${74 + i * 1.6}H132"/>`).join('') + `</g><g clip-path="url(#chc)" stroke="#23262e" stroke-width=".7"><g mask="url(#chm1)">` + [...Array(30)].map((_, i) => `<path d="M${30 + i * 3.4} 10L${70 + i * 3.4} 90"/>`).join('') + `</g><g mask="url(#chm2)">` + [...Array(30)].map((_, i) => `<path d="M${130 - i * 3.4} 10L${90 - i * 3.4} 90"/>`).join('') + `</g></g><circle cx="80" cy="46" r="28" fill="none" stroke="#23262e" stroke-width="1.2"/>`) },
    { id: 'linocut', name: 'Linocut', aka: 'woodcut, relief print',
      desc: 'An image carved into a block, inked and pressed onto paper. Whatever was cut away stays white.',
      spot: 'chunky black and white, visible carving marks, rough edges, bold simplified shapes',
      ref: 'German Expressionist prints, craft-beer labels',
      prompt: 'linocut print style, bold black and white, visible carving marks and rough edges',
      ex: (() => { const r = rng(14); let o = `<defs><filter id="lcf"><feTurbulence type="fractalNoise" baseFrequency=".4" seed="3"/><feDisplacementMap in="SourceGraphic" scale="1.6"/></filter></defs><rect width="160" height="100" fill="#efe8da"/><g filter="url(#lcf)"><rect x="18" y="10" width="124" height="80" fill="#1b1b1b"/><circle cx="110" cy="32" r="9" fill="#efe8da"/>`; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; o += `<path d="M${f1(110 + 12 * Math.cos(a))} ${f1(32 + 12 * Math.sin(a))}L${f1(110 + 17 * Math.cos(a))} ${f1(32 + 17 * Math.sin(a))}" stroke="#efe8da" stroke-width="1.6"/>`; } o += `<path d="M18 78L52 36L68 54L84 40L142 82" fill="none" stroke="#efe8da" stroke-width="2.4"/>`; for (let i = 0; i < 16; i++) { const x = 24 + r() * 60, y = 16 + r() * 22; o += `<path d="M${f1(x)} ${f1(y)}q4 -2 8 0" fill="none" stroke="#efe8da" stroke-width="1.1"/>`; } for (let y = 82; y < 90; y += 3) o += `<path d="M22 ${y}q15 -2 30 0t30 0t30 0t28 0" fill="none" stroke="#efe8da" stroke-width="1"/>`; return sv(o + `</g>`); })() },
    { id: 'halftone', name: 'Halftone', aka: 'dot screen, newsprint dots',
      desc: 'Shading made from a grid of dots that get bigger in the dark areas and smaller in the light. How newspapers print photos.',
      spot: 'a regular grid of dots changing size to make tone; looks like print when you zoom in',
      ref: 'newspapers, comics, retro posters',
      prompt: 'halftone dot shading, regular dot grid varying in size to create tone',
      ex: sv(`<rect width="160" height="100" fill="#f4efe4"/>` + [...Array(32)].map((_, i) => [...Array(20)].map((_, j) => { const x = 3 + i * 5, y = 3 + j * 5; const d = Math.hypot(x - 80, y - 48); let v; if (d < 32) v = .12 + .88 * Math.min(1, Math.hypot(x - 66, y - 34) / 46); else if (y > 80) v = Math.max(0, .6 - Math.abs(x - 92) / 50); else v = 0; return v > .05 ? `<circle cx="${x}" cy="${y}" r="${f1(2.5 * v)}" fill="#1c2a4a"/>` : ''; }).join('')).join('')) },
    { id: 'screenprint', name: 'Screen print', aka: 'silkscreen, risograph, misregistration',
      desc: 'Prints made one flat ink color at a time. The layers rarely line up perfectly, and that slight offset is part of the charm.',
      spot: 'a few flat inks, overlaps that mix into a third color, layers slightly out of alignment, grainy texture',
      ref: 'gig posters, risograph zines',
      prompt: 'risograph screen-print style, two or three flat inks, overlapping colors, slight misregistration and grain',
      ex: sv(`<rect width="160" height="100" fill="#f6efe2"/><g style="mix-blend-mode:multiply"><circle cx="66" cy="50" r="27" fill="#ff5c8a"/><rect x="78" y="24" width="50" height="46" fill="#19a7a0" transform="rotate(8 103 47)"/></g><circle cx="69" cy="52" r="27" fill="none" stroke="#1b2a5a" stroke-width="2"/><rect x="81" y="26" width="50" height="46" fill="none" stroke="#1b2a5a" stroke-width="2" transform="rotate(8 106 49)"/><text x="80" y="92" fill="#1b2a5a" style="font:800 11px var(--display);letter-spacing:.2em" text-anchor="middle">PRINT</text><text x="78.5" y="91" fill="#ff5c8a" style="font:800 11px var(--display);letter-spacing:.2em;mix-blend-mode:multiply" text-anchor="middle">PRINT</text>`) },
    { id: 'collage', name: 'Collage', aka: 'cut-and-paste, mixed media',
      desc: 'An image assembled from scraps of paper, photos and print, glued together.',
      spot: 'torn or cut edges, mismatched textures and sources, tape and overlaps, pieces at slight angles',
      ref: 'Hannah Höch, punk zines, editorial illustration',
      prompt: 'paper collage style, torn edges, mixed textures and cut-out shapes layered at angles',
      ex: (() => { const r = rng(8); let o = `<rect width="160" height="100" fill="#e9e2d4"/>` + jag(r, 14, 14, 70, 50, '#d7d2c6', -6); for (let i = 0; i < 6; i++) o += `<rect x="22" y="${24 + i * 6}" width="${40 + r() * 16}" height="2" fill="#8a857a" transform="rotate(-6 49 39)"/>`; o += jag(r, 70, 30, 64, 44, '#3d6fb6', 7) + `<circle cx="62" cy="68" r="17" fill="#e2462f"/>` + jag(r, 98, 12, 34, 26, '#f2c94c', -12) + `<rect x="40" y="6" width="26" height="9" fill="#f3e7b5" opacity=".8" transform="rotate(-18 53 10)"/><rect x="114" y="68" width="26" height="9" fill="#f3e7b5" opacity=".8" transform="rotate(22 127 72)"/>`; return sv(o); })() },
    { id: 'papercut', name: 'Layered paper', aka: 'paper cut, papercraft',
      desc: 'Shapes cut from colored card and stacked in layers, each casting a small shadow on the one behind.',
      spot: 'flat cut-out layers, soft shadows between them, smooth curved edges, a tactile handmade depth',
      ref: 'shadow-box art, Google Doodles, kids\' book illustration',
      prompt: 'layered paper-cut illustration, stacked cut-out layers with soft shadows between them',
      ex: sv(`<defs><filter id="pcf" x="-10%" y="-20%" width="120%" height="150%"><feDropShadow dx="0" dy="-2" stdDeviation="1.6" flood-color="#0b2e2a" flood-opacity=".35"/></filter></defs><rect width="160" height="100" fill="#e6f3f0"/><circle cx="116" cy="28" r="12" fill="#f6c46a"/>` + [['#bfe2db', 44, 0], ['#8fcfc4', 56, 2], ['#57b1a4', 68, 4], ['#2c8a7e', 78, 1], ['#1c5c55', 88, 3]].map(([c, y, k]) => `<path d="M0 ${y}C${30 + k * 8} ${y - 18} ${60 + k * 6} ${y + 12} ${100 - k * 4} ${y - 4}S150 ${y - 14} 160 ${y - 6}V100H0Z" fill="${c}" filter="url(#pcf)"/>`).join('')) },
    { id: 'stippling', name: 'Stippling', aka: 'dotwork',
      desc: 'Shading made from many tiny hand-placed dots, packed tightly in shadows and sparse in light.',
      spot: 'thousands of irregular dots (not a grid), density instead of lines, precise and scientific-looking',
      ref: 'scientific illustration, tattoo dotwork',
      prompt: 'stippling dotwork illustration, shading built from dense tiny dots',
      ex: (() => { const r = rng(4); let o = `<rect width="160" height="100" fill="#f7f3ea"/>`; for (let i = 0; i < 7000; i++) { const x = r() * 160, y = r() * 100; const d = Math.hypot(x - 80, y - 46); let p = 0; if (d < 28) p = .03 + .85 * Math.min(1, Math.hypot(x - 68, y - 34) / 44) ** 2; else if (Math.hypot((x - 96) / 28, (y - 80) / 6) < 1) p = .45; if (r() < p) o += `<circle cx="${f1(x)}" cy="${f1(y)}" r=".7" fill="#23262e"/>`; } return sv(o + `<circle cx="80" cy="46" r="28" fill="none" stroke="#23262e" stroke-width=".5" opacity=".5"/>`); })() }
  ]
});

pool.groups.push({
  id: 'arch', title: 'Architectural styles', slot: 'Architecture',
  intro: 'Buildings carry design ideas you can reuse on screen: a "brutalist" site, a "mid-century" color palette, a "parametric" hero graphic. "Spot it" lists the giveaways.',
  terms: [
    { id: 'classical', name: 'Classical', aka: 'Greek and Roman, neoclassical',
      desc: 'Based on ancient Greek and Roman temples, revived again and again for banks, courts and museums.',
      spot: 'rows of columns, a triangular pediment on top, strict symmetry, stone steps, a sense of authority',
      ref: 'the Parthenon, the US Supreme Court, the British Museum',
      prompt: 'neoclassical architecture: symmetrical facade, rows of columns, triangular pediment, pale stone',
      ex: sv(sky + `<polygon points="28,32 80,12 132,32" fill="#e8dfcc" stroke="#9c8e72"/><polygon points="40,30 80,16 120,30" fill="#d8ccb2"/><rect x="30" y="32" width="100" height="9" fill="#e8dfcc" stroke="#9c8e72"/>` + [0, 1, 2, 3, 4, 5].map(i => { const x = 36 + i * 17; return `<rect x="${x}" y="41" width="12" height="3" fill="#d8ccb2"/><rect x="${x + 2}" y="44" width="8" height="38" fill="#ece4d3"/><path d="M${x + 4.5} 44V82M${x + 7.5} 44V82" stroke="#c9bc9f" stroke-width=".6"/>`; }).join('') + `<rect x="26" y="82" width="108" height="4" fill="#d8ccb2"/><rect x="22" y="86" width="116" height="4" fill="#e8dfcc"/><rect x="18" y="90" width="124" height="4" fill="#d8ccb2"/>` + ground) },
    { id: 'gothic', name: 'Gothic', aka: 'medieval cathedral style',
      desc: 'European cathedrals from the 1100s to 1500s, built to soar upward and flood the inside with colored light.',
      spot: 'pointed arches, tall spires, huge stained-glass and rose windows, everything pulling the eye upward',
      ref: 'Notre-Dame de Paris, Cologne Cathedral',
      prompt: 'Gothic architecture: pointed arches, tall spires, rose window, vertical soaring stone facade',
      ex: sv(sky + `<rect x="34" y="30" width="20" height="64" fill="#c9c3b5"/><rect x="106" y="30" width="20" height="64" fill="#c9c3b5"/><polygon points="34,30 44,2 54,30" fill="#a8a294"/><polygon points="106,30 116,2 126,30" fill="#a8a294"/><rect x="54" y="40" width="52" height="54" fill="#d6d0c2"/><polygon points="54,40 80,18 106,40" fill="#c9c3b5"/><circle cx="80" cy="52" r="10" fill="#3a5a8c" stroke="#6f6a60" stroke-width="1.5"/>` + [...Array(8)].map((_, i) => { const a = i * Math.PI / 4; return `<path d="M80 52L${f1(80 + 10 * Math.cos(a))} ${f1(52 + 10 * Math.sin(a))}" stroke="#d6d0c2" stroke-width=".8"/>`; }).join('') + `<circle cx="80" cy="52" r="3" fill="#c23a5a"/><path d="M70 94V80Q70 70 80 64Q90 70 90 80V94Z" fill="#4a453d"/>` + [40, 112].map(x => `<path d="M${x} 66V52Q${x} 46 ${x + 4} 42Q${x + 8} 46 ${x + 8} 52V66Z" fill="#3a5a8c"/>`).join('') + ground) },
    { id: 'decoarch', name: 'Art Deco architecture', aka: 'Deco skyscraper',
      desc: 'The 1920s and 30s skyscraper look: luxurious, geometric and vertical, built in steps as the tower rises.',
      spot: 'setbacks (tower steps in as it rises), sunburst crowns, strong vertical lines, metal and geometric ornament',
      ref: 'Chrysler Building, Empire State Building, Miami Beach hotels',
      prompt: 'Art Deco skyscraper: stepped setbacks, sunburst crown, strong vertical lines, gold geometric ornament',
      ex: sv(sky + `<rect x="46" y="54" width="68" height="40" fill="#d9d2c3"/><rect x="56" y="36" width="48" height="18" fill="#e3ddd0"/><rect x="64" y="22" width="32" height="14" fill="#ece7dc"/><path d="M68 22Q80 2 92 22Z" fill="#c9a24a"/>` + [0, 1, 2].map(i => `<path d="M${71 + i * 2} 22Q80 ${8 + i * 4} ${89 - i * 2} 22" fill="none" stroke="#10203a" stroke-width=".8"/>`).join('') + `<path d="M80 2V-4" stroke="#c9a24a" stroke-width="1.5"/>` + [52, 60, 68, 76, 84, 92, 100, 108].map(x => `<path d="M${x} ${x > 58 && x < 102 ? 38 : 56}V92" stroke="#8f8676" stroke-width="1.2"/>`).join('') + `<rect x="72" y="80" width="16" height="14" fill="#c9a24a"/>` + ground) },
    { id: 'modernist', name: 'Modernist', aka: 'International Style, Bauhaus architecture',
      desc: 'Early-to-mid 1900s. Ornament was stripped away, and the shape of a building came from what it does.',
      spot: 'white or glass boxes, flat roofs, long ribbon windows, thin columns lifting the building, no decoration',
      ref: 'Le Corbusier\'s Villa Savoye, Mies van der Rohe, the Bauhaus building',
      prompt: 'modernist International Style architecture: white flat-roofed box on thin columns, ribbon windows, no ornament',
      ex: sv(sky + `<rect x="0" y="86" width="160" height="14" fill="#a7c48a"/>` + [32, 52, 72, 92, 112, 128].map(x => `<rect x="${x}" y="60" width="2.5" height="28" fill="#d9d9d4"/>`).join('') + `<rect x="62" y="64" width="30" height="24" fill="#c7d9c0" opacity=".8"/><rect x="26" y="34" width="108" height="26" fill="#f7f7f4" stroke="#b9b9b2"/><rect x="32" y="42" width="96" height="8" fill="#2b3442"/><path d="M96 34V26Q110 24 114 34" fill="#f7f7f4" stroke="#b9b9b2"/>`) },
    { id: 'brutalism', name: 'Brutalism', aka: 'brutalist architecture',
      desc: '1950s to 70s. Massive buildings in raw, unpainted concrete, honest about their materials and structure. Loved and hated in equal measure.',
      spot: 'raw concrete with board marks, huge heavy blocks, repeated deep-set windows, cantilevers, a fortress feel',
      ref: 'the Barbican (London), Boston City Hall, Habitat 67',
      prompt: 'brutalist architecture: massive raw concrete blocks, repeated deep-set windows, heavy cantilevered forms',
      ex: sv(sky + (() => { const blk = (x, y, w, h) => { let o = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#a8a49c"/><rect x="${x}" y="${y + h - 3}" width="${w}" height="3" fill="#8c887f"/>`; for (let i = x + 4; i < x + w - 6; i += 9) for (let j = y + 4; j < y + h - 7; j += 9) o += `<rect x="${i}" y="${j}" width="6" height="5" fill="#4d4b47"/>`; return o; }; return blk(22, 54, 64, 40) + blk(58, 30, 82, 26) + blk(40, 10, 48, 20) + `<rect x="94" y="56" width="10" height="38" fill="#8c887f"/>`; })() + ground) },
    { id: 'midcentury', name: 'Mid-century modern', aka: 'MCM, 1950s modern',
      desc: 'Postwar homes and furniture from about 1945 to 1970: modern but warm, built to bring the outdoors in.',
      spot: 'low horizontal lines, flat or butterfly roofs, walls of glass, warm wood, stone chimneys, mustard, teal and orange',
      ref: 'Palm Springs houses, Eames chairs, Mad Men sets',
      prompt: 'mid-century modern style: low horizontal lines, butterfly roof, walls of glass, warm wood and stone, mustard and teal accents',
      ex: sv(sky + `<rect x="0" y="86" width="160" height="14" fill="#d9c9a3"/><rect x="118" y="30" width="12" height="58" fill="#8d8478"/><polygon points="16,42 80,54 144,34 144,39 80,59 16,47" fill="#3e3a34"/><rect x="24" y="52" width="40" height="34" fill="#b5763f"/>` + [0, 1, 2, 3, 4, 5].map(i => `<path d="M24 ${56 + i * 5}H64" stroke="#93592b" stroke-width=".8"/>`).join('') + `<polygon points="64,58 118,44 118,86 64,86" fill="#bfe0ea"/><path d="M82 54V86M100 49V86" stroke="#3e3a34" stroke-width="1.5"/><rect x="66" y="74" width="12" height="12" fill="#e2a33b"/><rect x="132" y="70" width="18" height="16" rx="8" fill="#2f8f7f"/>`) },
    { id: 'postmodern', name: 'Postmodern', aka: 'PoMo',
      desc: '1970s to 90s reaction against plain modernism. Brings back color, humor and classical shapes, used ironically.',
      spot: 'classical shapes made oversized or cartoonish, a broken pediment on top, pastel colors, playful and ornamental',
      ref: 'AT&T Building (New York), Portland Building, Memphis furniture',
      prompt: 'postmodern architecture: playful oversized classical motifs, broken pediment, pastel pink and teal',
      ex: sv(sky + `<rect x="50" y="26" width="60" height="68" fill="#f1b0a8"/><polygon points="46,28 76,10 76,28" fill="#e2847a"/><polygon points="84,10 114,28 84,28" fill="#e2847a"/><circle cx="80" cy="16" r="5" style="fill:var(--tile)"/>` + [0, 1, 2, 3].map(r => [0, 1, 2, 3].map(c => `<rect x="${58 + c * 12}" y="${34 + r * 9}" width="6" height="5" fill="#fdf1ec"/>`).join('')).join('') + `<rect x="50" y="70" width="60" height="24" fill="#47b3a6"/><path d="M68 94V80Q80 68 92 80V94Z" fill="#fdf1ec"/><polygon points="76,66 84,66 82,74 78,74" fill="#f2c94c"/><rect x="52" y="70" width="6" height="24" fill="#f2c94c"/><rect x="102" y="70" width="6" height="24" fill="#f2c94c"/>` + ground) },
    { id: 'deconstructivism', name: 'Deconstructivism', aka: 'deconstructivist architecture',
      desc: 'From the 1980s. Buildings that look fragmented, tilted or exploded, deliberately breaking the box.',
      spot: 'tilted walls, colliding angular or curved volumes, no clear front or symmetry, shiny metal skins',
      ref: 'Frank Gehry (Guggenheim Bilbao), Daniel Libeskind, Zaha Hadid\'s early work',
      prompt: 'deconstructivist architecture: fragmented tilted volumes, colliding angles and curved metal surfaces',
      ex: sv(sky + `<polygon points="22,94 30,40 70,30 64,94" fill="#8e96a3"/><polygon points="52,94 60,22 104,36 94,94" fill="#d4d8de" stroke="#8e96a3"/><path d="M84 94C78 64 98 40 128 34C134 54 130 76 140 94Z" fill="#b8bec7" stroke="#8e96a3"/><path d="M92 94C90 72 104 52 126 46M100 94C100 78 110 62 132 58" fill="none" stroke="#f0f2f5" stroke-width="1.2"/><polygon points="38,58 78,46 80,54 40,66" fill="#5b6472"/><path d="M60 22L104 36M70 30L64 94" stroke="#6b7380" stroke-width=".8"/>` + ground) },
    { id: 'parametric', name: 'Parametric', aka: 'parametricism, blob architecture',
      desc: 'Buildings designed with algorithms, so forms can flow and curve in ways hand drawing never could.',
      spot: 'smooth flowing curves with no corners, repeated ribs or panels that gradually change, a liquid or organic look',
      ref: 'Zaha Hadid (Heydar Aliyev Center), Beijing Daxing Airport',
      prompt: 'parametric architecture: flowing curved form, repeated ribs that gradually shift, smooth white surfaces',
      ex: sv(sky + `<defs><clipPath id="pmc"><path d="M10 94C24 44 66 26 96 44C120 58 134 36 152 94Z"/></clipPath></defs><path d="M10 94C24 44 66 26 96 44C120 58 134 36 152 94Z" fill="#f2f3f5" stroke="#aeb5c0"/><g clip-path="url(#pmc)" fill="none" stroke="#aeb5c0" stroke-width=".8">` + [...Array(24)].map((_, i) => { const x = 12 + i * 6; return `<path d="M${x} 96Q${x + 8 + Math.sin(i / 3) * 6} 60 ${x + 2 + i * .4} 20"/>`; }).join('') + `</g><path d="M26 94C40 70 70 62 96 70C116 76 128 66 140 94Z" fill="#2c3a4c" opacity=".85"/>` + ground) },
    { id: 'japanese', name: 'Traditional Japanese', aka: 'sukiya, wabi-sabi architecture',
      desc: 'Wooden buildings designed around simplicity, natural materials and a close link to the garden.',
      spot: 'exposed wooden frames, sliding paper screens (shoji) in a grid, deep overhanging eaves, raised veranda, calm and modular',
      ref: 'Katsura Imperial Villa, Kyoto teahouses',
      prompt: 'traditional Japanese architecture: exposed timber frame, shoji paper screens, deep eaves, natural materials, calm modular grid',
      ex: sv(sky + `<path d="M8 44Q80 32 152 44L140 28Q80 18 20 28Z" fill="#3e4a54"/><path d="M20 28Q80 18 140 28" fill="none" stroke="#2a3238" stroke-width="2"/><rect x="30" y="44" width="100" height="30" fill="#f6f1e4"/>` + [30, 50, 70, 90, 110, 130].map(x => `<rect x="${x - 1.5}" y="44" width="3" height="36" fill="#4a3a2c"/>`).join('') + [0, 1, 2, 3].map(i => `<path d="M30 ${50 + i * 6}H130" stroke="#8a6f52" stroke-width=".5"/>`).join('') + [...Array(10)].map((_, i) => `<path d="M${40 + i * 10} 44V74" stroke="#8a6f52" stroke-width=".5"/>`).join('') + `<rect x="22" y="74" width="116" height="5" fill="#a7764a"/><rect x="26" y="79" width="3" height="15" fill="#4a3a2c"/><rect x="131" y="79" width="3" height="15" fill="#4a3a2c"/><ellipse cx="146" cy="90" rx="7" ry="4" fill="#9aa09a"/><circle cx="12" cy="66" r="10" fill="#c8553d" opacity=".85"/>` + ground) }
  ]
});

/* ---------- UI & UX, principles, critique, icons, photo ---------- */
const panel = (x = 10, y = 8, w = 140, h = 84) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" class="sf" stroke="var(--g2)"/>`;
const pageBits = `<rect x="18" y="16" width="60" height="6" rx="2" class="gd"/><rect x="18" y="28" width="124" height="22" rx="3" class="gr"/><rect x="18" y="56" width="90" height="4" rx="2" class="gr"/><rect x="18" y="64" width="110" height="4" rx="2" class="gr"/><rect x="18" y="72" width="70" height="4" rx="2" class="gr"/>`;

pool.groups.push({
  id: 'ux', title: 'UI & UX patterns', slot: 'UI pattern',
  intro: 'The names for the parts and behaviors of app screens. Use these when you describe an interface, a flow or a state, so Claude builds the pattern you mean.',
  terms: [
    { id: 'density', name: 'Density', aka: 'compact vs. comfortable, information density',
      desc: 'How much fits on screen at once. Comfortable layouts have room to breathe; compact ones pack in more rows for power users.',
      ref: 'Gmail density setting, Linear (compact), Notion (comfortable)',
      prompt: 'compact, information-dense layout with tight row height (or: comfortable density with generous row spacing)',
      ex: sv(panel(8, 8, 68, 78) + panel(84, 8, 68, 78) + [0, 1, 2].map(i => `<circle cx="20" cy="${24 + i * 24}" r="6" class="x1l"/><rect x="31" y="${19 + i * 24}" width="36" height="5" rx="2" class="gd"/><rect x="31" y="${27 + i * 24}" width="24" height="3" rx="1.5" class="gr"/>`).join('') + [...Array(8)].map((_, i) => `<circle cx="91" cy="${15.5 + i * 9}" r="2" class="x1l"/><rect x="96" y="${13 + i * 9}" width="${i % 3 ? 50 : 40}" height="5" rx="1.5" class="gr"/>`).join('') + `<text x="42" y="96" class="dts">comfortable</text><text x="118" y="96" class="dts">compact</text>`) },
    { id: 'affordance', name: 'Affordance', aka: 'perceived clickability, signifiers',
      desc: 'Visual cues that tell people what they can do with something: a button looks pressable, a handle looks draggable, a field looks typeable.',
      ref: 'Don Norman, The Design of Everyday Things',
      prompt: 'clear affordances: buttons look pressable, draggable items show grab handles, inputs look editable',
      ex: sv(`<rect x="14" y="31" width="46" height="17" rx="5" class="x1d"/><rect x="14" y="28" width="46" height="17" rx="5" class="x1"/><text x="37" y="39" class="dt" style="fill:#fff">Press</text><text x="37" y="66" class="dts">Press</text><text x="37" y="76" class="dts" style="font-size:5px">(no affordance)</text><path d="M84 36H146" stroke="var(--g3)" stroke-width="3" stroke-linecap="round"/><path d="M84 36H112" stroke="var(--x1)" stroke-width="3" stroke-linecap="round"/><circle cx="112" cy="36" r="6" class="nd"/><rect x="84" y="58" width="62" height="14" rx="3" class="nd"/><rect x="89" y="61" width="1.2" height="8" class="ik blink"/>`) },
    { id: 'progressive', name: 'Progressive disclosure', aka: 'show more, advanced settings',
      desc: 'Show only the basics first and reveal advanced options when someone asks for them. Keeps screens simple without removing power.',
      ref: '"Advanced" sections in settings, expandable rows',
      prompt: 'progressive disclosure: show the essential options first, tuck advanced settings behind an expandable section',
      ex: sv(panel(24, 6, 112, 88) + [0, 1, 2].map(i => `<rect x="32" y="${17 + i * 14}" width="${44 - i * 6}" height="5" rx="2" class="gd"/><rect x="112" y="${15 + i * 14}" width="16" height="9" rx="4.5" class="${i === 1 ? 'gr' : 'x1'}"/><circle cx="${i === 1 ? 116.5 : 123.5}" cy="${19.5 + i * 14}" r="3" class="sf"/>`).join('') + `<text x="32" y="66" class="dtl" style="fill:var(--x1)">Advanced ▸</text><rect x="32" y="72" width="96" height="16" rx="3" fill="none" stroke="var(--g3)" stroke-dasharray="3 2"/><rect x="38" y="78" width="40" height="4" rx="2" class="gr" opacity=".6"/>`) },
    { id: 'emptystate', name: 'Empty state', aka: 'zero state, first-run screen',
      desc: 'What a screen shows before there is any data. A good one explains what will appear here and gives one clear first action.',
      ref: 'Dropbox and Slack first-run screens',
      prompt: 'friendly empty state: small illustration, one line explaining what goes here, and a single primary button to start',
      ex: sv(panel() + `<circle cx="80" cy="34" r="14" class="x1l"/><rect x="73" y="29" width="14" height="10" rx="2" class="sf"/><path d="M76 33h8" stroke="var(--x1d)" stroke-width="1.2"/><rect x="54" y="54" width="52" height="5" rx="2" class="gd"/><rect x="60" y="62" width="40" height="3" rx="1.5" class="gr"/><rect x="64" y="71" width="32" height="10" rx="5" class="x1"/>`) },
    { id: 'skeleton', name: 'Skeleton screen', aka: 'loading placeholder, shimmer',
      desc: 'Grey placeholder shapes in the layout of the content that is about to load. Feels faster than a spinner because the page already has its shape.',
      ref: 'Facebook and LinkedIn feeds while loading',
      prompt: 'skeleton loading state: grey placeholder blocks shaped like the content, with a gentle shimmer',
      ex: sv(panel() + `<g class="shim"><circle cx="30" cy="26" r="9" class="gr"/><rect x="44" y="20" width="60" height="5" rx="2.5" class="gr"/><rect x="44" y="29" width="40" height="4" rx="2" class="gr"/><rect x="20" y="42" width="120" height="24" rx="3" class="gr"/><rect x="20" y="72" width="110" height="4" rx="2" class="gr"/><rect x="20" y="80" width="80" height="4" rx="2" class="gr"/></g>`) },
    { id: 'modal', name: 'Modal dialog', aka: 'popup, lightbox, dialog',
      desc: 'A box that appears over a dimmed page and must be dealt with before going back. Use for focused decisions or short forms.',
      ref: 'delete confirmations, sign-in popups',
      prompt: 'centered modal dialog over a dimmed backdrop, with a title, short message and two buttons',
      ex: sv(panel() + pageBits + `<rect x="10" y="8" width="140" height="84" rx="5" class="ik" opacity=".35"/><rect x="40" y="22" width="80" height="56" rx="5" class="sf"/><rect x="48" y="30" width="40" height="5" rx="2" class="gd"/><rect x="48" y="40" width="64" height="3" rx="1.5" class="gr"/><rect x="48" y="46" width="52" height="3" rx="1.5" class="gr"/><rect x="62" y="62" width="24" height="9" rx="3" class="gr"/><rect x="90" y="62" width="24" height="9" rx="3" class="x1"/>`) },
    { id: 'drawer', name: 'Drawer', aka: 'side sheet, slide-over panel',
      desc: 'A panel that slides in from the edge of the screen for details or settings, while the page stays visible behind it.',
      ref: 'shopping carts, Jira issue detail, mobile nav menus',
      prompt: 'slide-over drawer from the right edge showing details, page dimmed behind it',
      ex: sv(panel() + pageBits + `<rect x="10" y="8" width="140" height="84" rx="5" class="ik" opacity=".25"/><rect x="96" y="8" width="54" height="84" class="sf" stroke="var(--g2)"/><rect x="104" y="16" width="28" height="5" rx="2" class="gd"/><path d="M140 16l5 5M145 16l-5 5" class="st" style="stroke-width:1"/><rect x="104" y="30" width="38" height="20" rx="3" class="x1l"/><rect x="104" y="56" width="36" height="3" rx="1.5" class="gr"/><rect x="104" y="63" width="30" height="3" rx="1.5" class="gr"/><rect x="104" y="78" width="38" height="9" rx="3" class="x1"/>`) },
    { id: 'toast', name: 'Toast', aka: 'snackbar, notification',
      desc: 'A small message that pops up briefly to confirm something happened, then disappears on its own.',
      ref: '"Message sent" in Gmail, "Copied to clipboard"',
      prompt: 'brief toast notification at the bottom of the screen confirming the action, auto-dismisses',
      ex: sv(panel() + pageBits + `<g class="pop"><rect x="42" y="74" width="76" height="14" rx="7" class="ik"/><circle cx="52" cy="81" r="3.5" class="x3"/><rect x="60" y="79" width="48" height="4" rx="2" style="fill:var(--bg)"/></g>`) },
    { id: 'tabs', name: 'Tabs', aka: 'tab bar, segmented control',
      desc: 'A row of labels that switch between views of the same thing without leaving the page. The selected one is clearly marked.',
      ref: 'browser tabs, profile pages (Posts / Replies / Likes)',
      prompt: 'tab bar across the top of the panel with an underline on the active tab',
      ex: sv(panel() + `<text x="40" y="25" class="dt" style="font-weight:600">Overview</text><text x="80" y="25" class="dts">Activity</text><text x="120" y="25" class="dts">Settings</text><path d="M14 31H146" stroke="var(--g2)"/><rect x="22" y="29.5" width="36" height="2.5" rx="1" class="x1"/><rect x="20" y="40" width="58" height="34" rx="3" class="x1l" opacity=".6"/><rect x="84" y="40" width="56" height="5" rx="2" class="gd"/><rect x="84" y="50" width="48" height="3" rx="1.5" class="gr"/><rect x="84" y="57" width="52" height="3" rx="1.5" class="gr"/>`) },
    { id: 'breadcrumbs', name: 'Breadcrumbs', aka: 'location trail',
      desc: 'A trail of links showing where you are in a hierarchy and how to step back up.',
      ref: 'file browsers, docs sites, online shops',
      prompt: 'breadcrumb trail above the page title showing the path back up the hierarchy',
      ex: sv(panel() + `<text x="20" y="26" style="font:500 7.5px var(--mono)"><tspan class="mu">Home</tspan><tspan class="mu"> › </tspan><tspan class="mu">Projects</tspan><tspan class="mu"> › </tspan><tspan class="ik">Agentic 101</tspan></text><rect x="20" y="36" width="70" height="8" rx="2" class="ik"/><rect x="20" y="52" width="120" height="3" rx="1.5" class="gr"/><rect x="20" y="59" width="110" height="3" rx="1.5" class="gr"/><rect x="20" y="66" width="90" height="3" rx="1.5" class="gr"/>`) },
    { id: 'cmdk', name: 'Command palette', aka: '⌘K menu, quick switcher',
      desc: 'A search box that pops up on a keyboard shortcut and lets you run any command by typing its name. Loved by power users.',
      ref: 'VS Code, Linear, Raycast, Slack',
      prompt: 'command palette opened with ⌘K: search input on top, filtered list of commands with one highlighted',
      ex: sv(`<rect x="26" y="12" width="108" height="76" rx="6" class="sf" stroke="var(--g3)"/><text x="34" y="27" class="dtl mu">⌕ Type a command…</text><rect x="112" y="19" width="16" height="10" rx="2" fill="none" stroke="var(--g3)"/><text x="120" y="26" class="dts">⌘K</text><path d="M26 34H134" stroke="var(--g2)"/><rect x="30" y="38" width="100" height="11" rx="2" class="x1l" opacity=".6"/>` + ['New project', 'Open file…', 'Toggle theme', 'Search docs'].map((t, i) => `<text x="36" y="${45.5 + i * 12}" class="dtl">${t}</text>`).join('')) },
    { id: 'btnhierarchy', name: 'Button hierarchy', aka: 'primary / secondary / tertiary actions',
      desc: 'Giving actions different visual weights so the main one is obvious: one filled primary button, outlined secondary ones, plain text links for minor actions.',
      ref: 'any well-designed form footer',
      prompt: 'clear button hierarchy: one filled primary action, an outlined secondary, a text-link tertiary',
      ex: sv(`<rect x="12" y="40" width="40" height="16" rx="4" class="x1"/><text x="32" y="50" class="dt" style="fill:#fff">Save</text><rect x="60" y="40" width="40" height="16" rx="4" class="sf" stroke="var(--x1)"/><text x="80" y="50" class="dt" style="fill:var(--x1)">Cancel</text><text x="128" y="50" class="dt" style="fill:var(--x1);text-decoration:underline">Learn more</text><text x="32" y="70" class="dts">primary</text><text x="80" y="70" class="dts">secondary</text><text x="128" y="70" class="dts">tertiary</text>`) },
    { id: 'states', name: 'Interaction states', aka: 'hover, focus, active, disabled',
      desc: 'How a control looks in each situation: resting, hovered, focused by keyboard, pressed and disabled. Missing states make an app feel broken.',
      ref: 'any design system\'s button page',
      prompt: 'design every interaction state: default, hover, focus ring, pressed and disabled',
      ex: sv([['x1', 'default'], ['x1d', 'hover'], ['x1', 'focus'], ['gr', 'disabled']].map(([c, l], i) => { const x = 8 + i * 38; return (l === 'focus' ? `<rect x="${x - 3}" y="33" width="36" height="20" rx="7" fill="none" stroke="var(--x1l)" stroke-width="2"/>` : '') + `<rect x="${x}" y="36" width="30" height="14" rx="4" class="${c}"/><text x="${x + 15}" y="45" class="dt" style="fill:${c === 'gr' ? 'var(--ink3)' : '#fff'}">OK</text><text x="${x + 15}" y="66" class="dts">${l}</text>`; }).join('')) },
    { id: 'validation', name: 'Inline validation', aka: 'form errors, field feedback',
      desc: 'Checking a form field as you go and showing the problem right next to it, in plain words, instead of a list of errors at the end.',
      ref: 'sign-up forms that flag a weak password as you type',
      prompt: 'inline form validation: error message directly under the field in red, success check when valid',
      ex: sv(`<rect x="20" y="16" width="120" height="16" rx="3" class="sf" stroke="var(--x4)" stroke-width="1.5"/><text x="26" y="26.5" class="dtl">name@</text><text x="20" y="41" class="dtl" style="fill:var(--x4d);font-size:6.5px">Enter a full email address</text><rect x="20" y="56" width="120" height="16" rx="3" class="sf" stroke="var(--x3)" stroke-width="1.5"/><text x="26" y="66.5" class="dtl">Agentic 101</text><circle cx="130" cy="64" r="4.5" class="x3"/><path d="M128 64l1.6 1.6 3-3.2" fill="none" stroke="#fff" stroke-width="1.2"/>`) },
    { id: 'tooltip', name: 'Tooltip', aka: 'popover, hint',
      desc: 'A small label that appears when you hover or focus something, explaining what it does. A popover is the bigger, clickable version.',
      ref: 'icon buttons in any toolbar',
      prompt: 'small dark tooltip with an arrow appearing above the icon on hover',
      ex: sv(`<rect x="44" y="20" width="72" height="20" rx="4" class="ik"/><polygon points="76,40 84,40 80,45" class="ik"/><rect x="52" y="28" width="56" height="4" rx="2" style="fill:var(--bg)"/><circle cx="80" cy="62" r="9" class="nd"/><text x="80" y="65" class="dt" style="font-size:9px">i</text>`) },
    { id: 'responsive', name: 'Responsive layout', aka: 'breakpoints, mobile-first',
      desc: 'One design that rearranges itself for different screen sizes: several columns on desktop, fewer on tablet, one on a phone.',
      ref: 'any modern website',
      prompt: 'responsive layout: three columns on desktop, two on tablet, a single stacked column on mobile',
      ex: sv(`<rect x="6" y="16" width="76" height="50" rx="3" class="sf" stroke="var(--ink)"/><path d="M36 66l-4 10h24l-4-10" class="ln"/>` + [0, 1, 2].map(i => `<rect x="${11 + i * 23}" y="26" width="20" height="34" rx="2" class="x1l"/>`).join('') + `<rect x="90" y="22" width="38" height="56" rx="4" class="sf" stroke="var(--ink)"/>` + [0, 1].map(i => `<rect x="${94 + i * 16}" y="30" width="14" height="${40}" rx="2" class="x2l"/>`).join('') + `<rect x="134" y="32" width="20" height="40" rx="4" class="sf" stroke="var(--ink)"/>` + [0, 1, 2].map(i => `<rect x="137" y="${37 + i * 11}" width="14" height="9" rx="1.5" class="x3l"/>`).join('') + `<text x="44" y="90" class="dts">desktop</text><text x="109" y="90" class="dts">tablet</text><text x="144" y="90" class="dts">phone</text>`) }
  ]
});

pool.groups.push({
  id: 'principles', title: 'Design principles', slot: 'Principle',
  intro: 'The rules underneath why a layout works. Most come from Gestalt psychology: how the brain groups what it sees. Name the principle and Claude can apply or fix it.',
  terms: [
    { id: 'proximity', name: 'Proximity', aka: 'Gestalt grouping by distance',
      desc: 'Things placed close together are seen as a group. The single most useful rule for organizing a screen: spacing is grouping.',
      ref: 'label sits closer to its own field than to the next one',
      prompt: 'use proximity to group related items: tight spacing within groups, larger gaps between groups',
      ex: sv([30, 104].map(ox => [0, 1, 2].map(i => [0, 1, 2].map(j => `<circle cx="${ox + i * 9}" cy="${41 + j * 9}" r="3.2" class="x1"/>`).join('')).join('')).join('') + `<text x="39" y="82" class="dts">group</text><text x="113" y="82" class="dts">group</text>`) },
    { id: 'similarity', name: 'Similarity', aka: 'Gestalt grouping by look',
      desc: 'Things that look alike, by color, shape or size, are seen as belonging together, even when they are spread out.',
      ref: 'all links share one color; all tags share one shape',
      prompt: 'use similarity: items with the same role share the same color and shape',
      ex: sv([0, 1, 2, 3].map(r => [...Array(8)].map((_, c) => { const x = 24 + c * 16, y = 22 + r * 18; return r % 2 ? `<rect x="${x - 4}" y="${y - 4}" width="8" height="8" class="x2"/>` : `<circle cx="${x}" cy="${y}" r="4" class="x1"/>`; }).join('')).join('')) },
    { id: 'region', name: 'Common region', aka: 'enclosure',
      desc: 'Items inside the same boundary, like a box, card or tinted background, are seen as a group, even if they look different.',
      ref: 'cards, fieldsets, grouped settings',
      prompt: 'use common region: wrap related controls in a subtle tinted container',
      ex: sv(`<rect x="14" y="36" width="44" height="28" rx="8" class="x3l" opacity=".55"/><rect x="66" y="36" width="80" height="28" rx="8" class="x2l" opacity=".55"/>` + [...Array(8)].map((_, i) => `<circle cx="${24 + i * 16 + (i > 2 ? 2 : 0)}" cy="50" r="4" class="ik"/>`).join('')) },
    { id: 'continuity', name: 'Continuity', aka: 'good continuation',
      desc: 'The eye follows smooth lines and curves, so elements arranged along a path are read in order and as connected.',
      ref: 'timelines, flow lines guiding the eye through a page',
      prompt: 'use continuity: arrange steps along one smooth path so the eye follows them in order',
      ex: sv([...Array(15)].map((_, i) => { const t = i / 14; const x1 = 10 + t * 140, y1 = 80 - 60 * t + 18 * Math.sin(t * Math.PI); const y2 = 20 + 60 * t + 18 * Math.sin(t * Math.PI); return `<circle cx="${f1(x1)}" cy="${f1(y1)}" r="3" class="x1"/><circle cx="${f1(x1)}" cy="${f1(y2)}" r="3" class="x2"/>`; }).join('')) },
    { id: 'closure', name: 'Closure', aka: 'implied shapes',
      desc: 'The brain fills in gaps to see a complete shape, so you can suggest a form without drawing all of it. Great for minimal logos.',
      ref: 'the WWF panda logo, the Kanizsa triangle',
      prompt: 'use closure: suggest the shape with partial outlines and let negative space complete it',
      ex: sv(`<circle cx="80" cy="16" r="13" class="x1"/><circle cx="44" cy="78" r="13" class="x1"/><circle cx="116" cy="78" r="13" class="x1"/><polygon points="80,16 44,78 116,78" style="fill:var(--tile)"/>`) },
    { id: 'figureground', name: 'Figure and ground', aka: 'positive and negative space',
      desc: 'We split every image into a subject (figure) and what is behind it (ground). Clever designs make the background itself form a shape.',
      ref: 'the hidden arrow in the FedEx logo, Rubin\'s vase',
      prompt: 'play with figure and ground: let the negative space form a second shape',
      ex: sv(`<rect x="26" y="14" width="108" height="72" rx="4" class="ik"/><polygon points="44,42 92,42 92,30 118,50 92,70 92,58 44,58" style="fill:var(--tile)"/><text x="80" y="96" class="dts">the arrow is background</text>`) },
    { id: 'contrastp', name: 'Contrast', aka: 'emphasis, focal contrast',
      desc: 'A difference in size, color, weight or shape makes one thing stand out. Without contrast nothing leads; with too much, everything shouts.',
      ref: 'one red "Buy" button on a quiet page',
      prompt: 'use contrast to make one element clearly dominant; keep everything else quiet',
      ex: sv([...Array(18)].map((_, i) => { const x = 24 + (i % 6) * 22, y = 26 + Math.floor(i / 6) * 24; return i === 8 ? `<circle cx="${x}" cy="${y}" r="10" class="x4"/>` : `<circle cx="${x}" cy="${y}" r="5" class="gr"/>`; }).join('')) },
    { id: 'alignmentp', name: 'Alignment', aka: 'shared edges, invisible lines',
      desc: 'Lining elements up on shared edges creates invisible lines that make a design feel ordered and intentional.',
      ref: 'every element starts at the same left edge',
      prompt: 'strict alignment: elements share left edges and baselines on a consistent grid',
      ex: sv(`<path d="M94 8V92" stroke="var(--x4)" stroke-dasharray="3 3"/>` + [[18, 44], [26, 36], [14, 52], [22, 30], [16, 40]].map(([x, w], i) => `<rect x="${x}" y="${16 + i * 14}" width="${w}" height="7" rx="2" class="gd"/>`).join('') + [44, 36, 52, 30, 40].map((w, i) => `<rect x="94" y="${16 + i * 14}" width="${w}" height="7" rx="2" class="x1"/>`).join('')) },
    { id: 'repetition', name: 'Repetition', aka: 'consistency, visual system',
      desc: 'Reusing the same colors, shapes, spacing and styles across a design ties it together and makes it learnable.',
      ref: 'design systems, a consistent card style across a site',
      prompt: 'consistent visual system: repeat the same card style, spacing and accent across every section',
      ex: sv([0, 1, 2, 3].map(i => `<rect x="${10 + i * 36}" y="26" width="32" height="48" rx="4" class="sf" stroke="var(--g2)"/><rect x="${10 + i * 36}" y="26" width="32" height="4" rx="2" class="x1"/><circle cx="${26 + i * 36}" cy="44" r="7" class="x1l"/><rect x="${15 + i * 36}" y="58" width="22" height="3" rx="1.5" class="gd"/><rect x="${15 + i * 36}" y="64" width="16" height="3" rx="1.5" class="gr"/>`).join('')) },
    { id: 'rhythm', name: 'Rhythm', aka: 'visual rhythm, pacing',
      desc: 'A pattern of repeated elements and intervals that the eye moves through, like a beat. Regular rhythm feels calm; progressive rhythm feels like movement.',
      ref: 'columns of a building, alternating content sections on a landing page',
      prompt: 'create a steady visual rhythm with evenly repeated elements and consistent intervals',
      ex: sv([...Array(9)].map((_, i) => `<rect x="${14 + i * 15}" y="18" width="6" height="24" rx="2" class="x1"/>`).join('') + [0, 8, 18, 30, 44, 60, 78, 98, 120].map(x => `<rect x="${14 + x}" y="58" width="6" height="24" rx="2" class="x2"/>`).join('') + `<text x="80" y="52" class="dts">regular</text><text x="80" y="94" class="dts">progressive</text>`) },
    { id: 'symmetry', name: 'Symmetry', aka: 'formal balance, mirror balance',
      desc: 'Mirroring a composition across a center line. Feels stable, formal and calm; asymmetry feels more dynamic.',
      ref: 'Wes Anderson framing, classical buildings, wedding invitations',
      prompt: 'symmetrical composition mirrored around a central vertical axis',
      ex: sv(`<path d="M80 6V94" stroke="var(--x4)" stroke-dasharray="3 3"/><circle cx="48" cy="34" r="12" class="x1"/><circle cx="112" cy="34" r="12" class="x1"/><polygon points="80,22 94,50 66,50" class="x2"/><rect x="34" y="62" width="34" height="8" rx="2" class="gd"/><rect x="92" y="62" width="34" height="8" rx="2" class="gd"/><rect x="56" y="78" width="48" height="8" rx="4" class="x3"/>`) },
    { id: 'visualweight', name: 'Visual weight', aka: 'balance, heaviness',
      desc: 'Some elements pull the eye more than others: bigger, darker, more saturated or more detailed things are "heavier". Balance them like a seesaw.',
      ref: 'a big photo on one side balanced by a block of text on the other',
      prompt: 'balance visual weight: offset the heavy dark element with several lighter ones on the other side',
      ex: sv(`<polygon points="80,68 72,84 88,84" class="gd"/><path d="M14 68H146" class="ln" style="stroke-width:2"/><rect x="56" y="40" width="22" height="28" class="ik"/><rect x="118" y="58" width="10" height="10" class="x1l"/><rect x="130" y="58" width="10" height="10" class="x1l"/><rect x="124" y="48" width="10" height="10" class="x1l"/>`) }
  ]
});

const ba = (L, R) => sv(`<rect x="4" y="4" width="72" height="80" rx="4" class="sf" stroke="var(--g2)"/><rect x="84" y="4" width="72" height="80" rx="4" class="sf" stroke="var(--g2)"/><g transform="translate(4 4)">${L}</g><g transform="translate(84 4)">${R}</g><text x="40" y="94" class="dts">feels off</text><text x="120" y="94" class="dts">fixed</text>`);
const tidy = `<rect x="8" y="10" width="56" height="24" rx="3" class="x1l"/><rect x="8" y="42" width="40" height="5" rx="2" class="ik"/><rect x="8" y="51" width="30" height="3" rx="1.5" class="gr"/><rect x="8" y="62" width="22" height="8" rx="4" class="x1"/>`;

pool.groups.push({
  id: 'critique', title: 'Critique words', slot: 'Fix',
  intro: 'Turn a gut feeling into the cause. Each card starts from what you might say ("it feels cluttered") and names the design problem behind it, with a phrase that asks for the fix.',
  terms: [
    { id: 'cluttered', name: 'Visual noise', aka: '"it feels cluttered", "too busy"',
      desc: 'Too many elements competing for attention with no clear order. The fix is fewer things, clearer hierarchy and more space.',
      ref: 'crowded dashboards, ad-heavy news sites',
      prompt: 'reduce visual noise: remove non-essential elements, establish one clear hierarchy, add whitespace',
      ex: ba((() => { const r = rng(31); let o = ''; for (let i = 0; i < 22; i++) { const c = pick(r, ['x1', 'x2', 'x3', 'x4', 'gd', 'x1l', 'x2l']); o += r() < .5 ? `<rect x="${f1(r() * 58)}" y="${f1(r() * 66)}" width="${f1(6 + r() * 16)}" height="${f1(4 + r() * 10)}" class="${c}"/>` : `<circle cx="${f1(6 + r() * 60)}" cy="${f1(6 + r() * 68)}" r="${f1(2 + r() * 5)}" class="${c}"/>`; } return o; })(), tidy) },
    { id: 'cramped', name: 'Tight spacing', aka: '"it feels cramped", "claustrophobic"',
      desc: 'Not enough padding inside containers or space between elements, so everything touches. Usually fixed by roughly doubling the spacing.',
      ref: 'early-stage admin panels',
      prompt: 'increase spacing: generous padding inside containers and consistent gaps between elements',
      ex: ba(`<rect x="1" y="1" width="70" height="28" class="x1l"/><rect x="1" y="30" width="62" height="6" class="ik"/><rect x="1" y="37" width="70" height="3" class="gr"/><rect x="1" y="41" width="66" height="3" class="gr"/><rect x="1" y="45" width="30" height="10" class="x1"/>`, `<rect x="10" y="10" width="52" height="22" rx="3" class="x1l"/><rect x="10" y="40" width="40" height="5" rx="2" class="ik"/><rect x="10" y="50" width="48" height="3" rx="1.5" class="gr"/><rect x="10" y="56" width="40" height="3" rx="1.5" class="gr"/><rect x="10" y="64" width="24" height="8" rx="4" class="x1"/>`) },
    { id: 'disconnected', name: 'Weak grouping', aka: '"it feels disconnected", "floaty", "I can\'t tell what goes with what"',
      desc: 'Related items are spaced the same as unrelated ones, so nothing reads as a group. Fix it with proximity: tight within groups, wide between them.',
      ref: 'forms where each label floats between two fields',
      prompt: 'fix grouping: keep each label close to its value and add larger gaps between groups',
      ex: ba([0, 1, 2, 3, 4, 5].map(i => `<rect x="10" y="${10 + i * 11}" width="${i % 2 ? 48 : 22}" height="${i % 2 ? 5 : 3}" rx="1.5" class="${i % 2 ? 'gd' : 'gr'}"/>`).join(''), [0, 1, 2].map(i => `<rect x="10" y="${10 + i * 22}" width="22" height="3" rx="1.5" class="gr"/><rect x="10" y="${15 + i * 22}" width="48" height="5" rx="1.5" class="gd"/>`).join('')) },
    { id: 'misaligned', name: 'Misalignment', aka: '"it looks off", "wobbly", "sloppy"',
      desc: 'Edges that almost but don\'t quite line up. The eye notices even a few pixels. Snap everything to shared edges.',
      ref: 'hand-placed slides, mixed padding in cards',
      prompt: 'fix alignment: snap all elements to a shared left edge and consistent grid',
      ex: ba([[8, 44], [13, 36], [6, 52], [11, 30], [9, 40]].map(([x, w], i) => `<rect x="${x}" y="${10 + i * 13}" width="${w}" height="6" rx="2" class="gd"/>`).join(''), `<path d="M10 4V76" stroke="var(--x4)" stroke-dasharray="2 2"/>` + [44, 36, 52, 30, 40].map((w, i) => `<rect x="10" y="${10 + i * 13}" width="${w}" height="6" rx="2" class="gd"/>`).join('')) },
    { id: 'loud', name: 'Color overload', aka: '"it\'s too loud", "garish", "like a circus"',
      desc: 'Too many saturated colors fighting each other. Pull back to neutrals and keep one or two accents for meaning.',
      ref: 'rainbow dashboards where every chart is a different color',
      prompt: 'calm the palette: mostly neutrals with a single accent color reserved for emphasis',
      ex: ba(['#e8352b', '#f7c51e', '#16a34a', '#2563eb', '#db2777', '#9333ea'].map((c, i) => `<rect x="${8 + (i % 2) * 30}" y="${8 + Math.floor(i / 2) * 22}" width="26" height="18" rx="2" fill="${c}"/>`).join(''), [0, 1, 2, 3, 4, 5].map(i => `<rect x="${8 + (i % 2) * 30}" y="${8 + Math.floor(i / 2) * 22}" width="26" height="18" rx="2" class="${i === 0 ? 'x1' : 'gr'}"/>`).join('')) },
    { id: 'nofocal', name: 'No focal point', aka: '"it feels flat", "boring", "I don\'t know where to look"',
      desc: 'Everything has the same size and weight, so nothing leads the eye. Make one thing clearly the most important.',
      ref: 'slides where every bullet is the same size',
      prompt: 'create a focal point: make the key element significantly larger or more colorful than the rest',
      ex: ba([0, 1, 2, 3, 4, 5].map(i => `<rect x="${8 + (i % 2) * 30}" y="${8 + Math.floor(i / 2) * 22}" width="26" height="18" rx="2" class="gr"/>`).join(''), `<rect x="8" y="8" width="56" height="36" rx="3" class="x1"/>` + [0, 1, 2, 3].map(i => `<rect x="${8 + (i % 2) * 30}" y="${50 + Math.floor(i / 2) * 12}" width="26" height="8" rx="2" class="gr"/>`).join('')) },
    { id: 'hardtoread', name: 'Poor legibility', aka: '"it\'s hard to read", "my eyes hurt"',
      desc: 'Usually low contrast between text and background, text that is too small, or lines that run too long. Aim for dark text, real size and about 65 characters per line.',
      ref: 'light-grey-on-white body text',
      prompt: 'improve legibility: higher text contrast, larger body size, line length around 65 characters, more line spacing',
      ex: ba([...Array(10)].map((_, i) => `<rect x="5" y="${8 + i * 6.5}" width="62" height="2.4" class="gr" opacity=".7"/>`).join(''), [...Array(7)].map((_, i) => `<rect x="10" y="${10 + i * 9}" width="${i === 6 ? 26 : 46}" height="3.2" rx="1" class="ik"/>`).join('')) },
    { id: 'cheap', name: 'Inconsistency', aka: '"it feels cheap", "amateur", "thrown together"',
      desc: 'Mixed corner radii, icon styles, font sizes and colors that don\'t follow one system. Consistency is what reads as polish.',
      ref: 'apps built from several UI kits at once',
      prompt: 'make it consistent: one corner radius, one icon style, a fixed type scale and spacing system',
      ex: ba(`<rect x="8" y="10" width="26" height="11" class="x1"/><rect x="38" y="10" width="26" height="11" rx="5.5" class="x2"/><circle cx="16" cy="40" r="7" class="st"/><rect x="32" y="33" width="14" height="14" class="ik"/><path d="M54 33l7 14h-14z" class="x3"/><rect x="8" y="56" width="44" height="7" class="gd"/><rect x="8" y="67" width="30" height="3" class="gd"/>`, `<rect x="8" y="10" width="26" height="11" rx="3" class="x1"/><rect x="38" y="10" width="26" height="11" rx="3" class="sf" stroke="var(--x1)"/><circle cx="16" cy="40" r="7" class="st"/><rect x="32" y="33" width="14" height="14" rx="3" class="st"/><circle cx="58" cy="40" r="7" class="st"/><rect x="8" y="56" width="44" height="5" rx="2" class="gd"/><rect x="8" y="65" width="34" height="3" rx="1.5" class="gr"/>`) },
    { id: 'heavy', name: 'Heavy visual weight', aka: '"it feels heavy", "dark", "oppressive"',
      desc: 'Thick borders, dark fills and big shadows everywhere. Lighten borders, use tints instead of solid fills and let backgrounds breathe.',
      ref: 'enterprise software from the 2000s',
      prompt: 'lighten the visual weight: thin subtle borders, light tinted fills, fewer heavy shadows',
      ex: ba([0, 1, 2].map(i => `<rect x="8" y="${8 + i * 22}" width="56" height="16" class="ik" stroke="var(--ink)" stroke-width="3"/><rect x="14" y="${14 + i * 22}" width="24" height="4" style="fill:var(--bg)"/>`).join(''), [0, 1, 2].map(i => `<rect x="8" y="${8 + i * 22}" width="56" height="16" rx="3" class="x1l" opacity=".35" stroke="var(--g2)"/><rect x="14" y="${14 + i * 22}" width="24" height="4" rx="2" class="gd"/>`).join('')) },
    { id: 'dated', name: 'Dated styling', aka: '"it looks old", "very 2010"',
      desc: 'Trends from a past era: glossy buttons, heavy bevels, embossed text, busy gradients, stock clip-art. Flatter surfaces and calmer type read as current.',
      ref: 'Web 2.0 glossy buttons, early-iOS textures',
      prompt: 'modernize the styling: flat surfaces, subtle shadows, no gloss or bevels, contemporary sans-serif type',
      ex: ba(`<defs><linearGradient id="crgl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ad8ff"/><stop offset=".5" stop-color="#3a8ee6"/><stop offset=".5" stop-color="#1d6fd1"/><stop offset="1" stop-color="#2b86e8"/></linearGradient></defs><rect x="11" y="31" width="50" height="20" rx="10" fill="#0b3f80" opacity=".5"/><rect x="10" y="28" width="50" height="20" rx="10" fill="url(#crgl)" stroke="#0b4fa0"/><text x="35" y="41.5" fill="#fff" stroke="#0b3f80" stroke-width=".4" style="font:700 8px Verdana,sans-serif" text-anchor="middle">Click!</text>`, `<rect x="10" y="28" width="50" height="20" rx="5" class="x1"/><text x="35" y="40.5" class="dt" style="fill:#fff;font-family:var(--body);font-size:8px">Continue</text>`) },
    { id: 'generic', name: 'No point of view', aka: '"it feels generic", "template-y", "like every other site"',
      desc: 'The default layout and safe choices any template would make. Fix it by committing to one distinctive decision: a typeface, a color, an unusual layout.',
      ref: 'centered hero plus three icon columns',
      prompt: 'give it a point of view: one distinctive typeface and color, an asymmetric layout, avoid template defaults',
      ex: ba(`<rect x="16" y="8" width="40" height="5" rx="2" class="gd"/><rect x="22" y="17" width="28" height="3" rx="1.5" class="gr"/><rect x="26" y="25" width="20" height="7" rx="3.5" class="gd"/>` + [0, 1, 2].map(i => `<circle cx="${16 + i * 20}" cy="50" r="6" class="gr"/><rect x="${10 + i * 20}" y="60" width="12" height="3" rx="1.5" class="gr"/>`).join(''), `<rect x="40" y="8" width="26" height="60" class="x2"/><text x="6" y="34" class="ik" style="font:800 19px var(--display);letter-spacing:-.04em">Make</text><text x="6" y="52" class="ik" style="font:800 19px var(--display);letter-spacing:-.04em">it.</text><rect x="6" y="62" width="22" height="3" rx="1.5" class="gd"/>`) },
    { id: 'overdesigned', name: 'Over-decoration', aka: '"it\'s too much", "trying too hard"',
      desc: 'Gradients, shadows, borders, icons and effects stacked on things that don\'t need them. Remove decoration until something breaks, then add one back.',
      ref: 'PowerPoint WordArt, effect-heavy templates',
      prompt: 'strip back decoration: remove gradients, extra borders and effects that don\'t carry meaning',
      ex: ba(`<defs><linearGradient id="crod" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff7ab6"/><stop offset="1" stop-color="#7a5cff"/></linearGradient></defs><rect x="11" y="13" width="54" height="58" rx="8" fill="#000" opacity=".3"/><rect x="8" y="10" width="54" height="58" rx="8" fill="url(#crod)" stroke="#ffd84a" stroke-width="2"/><rect x="11" y="13" width="48" height="52" rx="6" fill="none" stroke="#fff" stroke-dasharray="2 2"/>` + [[18, 20], [52, 24], [46, 56]].map(([x, y]) => `<path d="M${x} ${y - 4}l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" fill="#fff"/>`).join('') + `<rect x="16" y="40" width="38" height="5" rx="2" fill="#fff"/>`, `<rect x="8" y="10" width="54" height="58" rx="5" class="sf" stroke="var(--g2)"/><rect x="16" y="40" width="38" height="5" rx="2" class="gd"/><rect x="16" y="49" width="28" height="3" rx="1.5" class="gr"/>`) },
    { id: 'lopsided', name: 'Lopsided balance', aka: '"it feels unbalanced", "tipping over", "empty on one side"',
      desc: 'All the weight sits in one corner and the rest is empty by accident rather than on purpose. Redistribute elements or make the emptiness intentional.',
      ref: 'slides with everything in the top-left',
      prompt: 'rebalance the composition: distribute visual weight across the frame',
      ex: ba(`<rect x="6" y="6" width="26" height="18" class="x1"/><rect x="6" y="27" width="34" height="4" class="gd"/><rect x="6" y="34" width="22" height="4" class="gd"/><circle cx="38" cy="14" r="6" class="x2"/>`, `<rect x="8" y="10" width="30" height="40" class="x1"/><rect x="44" y="14" width="20" height="4" class="gd"/><rect x="44" y="22" width="16" height="4" class="gd"/><circle cx="54" cy="58" r="7" class="x2"/>`) }
  ]
});

const ICON = {
  house: 'M-10 0L0-9L10 0V11H-10Z',
  heart: 'M0 10C-14 0-9-11 0-4C9-11 14 0 0 10Z',
  bell: 'M-8 6C-6 4-7-2-6-4C-5-8 5-8 6-4C7-2 6 4 8 6Z'
};
const icons3 = fn => sv([['house', 40], ['heart', 80], ['bell', 120]].map(([k, x]) => `<g transform="translate(${x} 50) scale(1.7)">${fn(k)}</g>`).join(''));
const iconDetail = (k, cls) => k === 'house' ? `<rect x="-3" y="4" width="6" height="7" class="${cls}"/>` : k === 'bell' ? `<circle cx="0" cy="8.5" r="2" class="${cls}"/>` : '';

pool.groups.push({
  id: 'icons', title: 'Icon & illustration styles', slot: 'Icon style',
  intro: 'The look of the small pictures in an interface or document. Pick one icon style and keep it everywhere; mixing styles is one of the quickest ways to look unpolished.',
  terms: [
    { id: 'outlineicon', name: 'Outline icons', aka: 'line icons, stroke icons',
      desc: 'Icons drawn with a single stroke weight and no fill. Light and modern; the default in most current apps.',
      ref: 'Lucide, Feather, Heroicons outline',
      prompt: 'outline icons with a consistent 1.5px stroke and rounded joins',
      ex: icons3(k => `<path d="${ICON[k]}" fill="none" stroke="var(--ink)" stroke-width="1" stroke-linejoin="round"/>` + (k === 'house' ? `<path d="M-3 11V4H3V11" fill="none" stroke="var(--ink)" stroke-width="1"/>` : k === 'bell' ? `<circle cx="0" cy="8.5" r="1.6" fill="none" stroke="var(--ink)" stroke-width="1"/>` : '')) },
    { id: 'glyphicon', name: 'Filled icons', aka: 'glyph icons, solid icons',
      desc: 'Solid silhouette icons. Bolder and easier to spot at small sizes; often used for the selected state of an outline set.',
      ref: 'Font Awesome solid, iOS tab bar selected icons',
      prompt: 'solid filled glyph icons, simple silhouettes',
      ex: icons3(k => `<path d="${ICON[k]}" class="ik"/>` + iconDetail(k, 'sf')) },
    { id: 'duotoneicon', name: 'Duotone icons', aka: 'two-tone icons',
      desc: 'Icons in two shades of one color: a light base shape with darker details. Friendly and a bit richer than plain line icons.',
      ref: 'Phosphor duotone, Font Awesome duotone',
      prompt: 'duotone icons: light tint fill with darker accent details in the same hue',
      ex: icons3(k => `<path d="${ICON[k]}" class="x1l"/>` + (k === 'heart' ? `<path d="${ICON.heart}" class="x1d" transform="translate(2 1.5) scale(.5)"/>` : iconDetail(k, 'x1d')) + `<path d="${ICON[k]}" fill="none" stroke="var(--x1d)" stroke-width=".9" stroke-linejoin="round"/>`) },
    { id: 'offsetfill', name: 'Line and offset fill', aka: 'misregistered fill, line with color pop',
      desc: 'An outline drawing with a flat color shape shifted slightly off it, like an imperfect print. Playful and hand-made feeling.',
      ref: 'marketing illustrations, Notion-style spot art',
      prompt: 'line icons with an offset flat color fill shifted slightly behind the outline',
      ex: icons3(k => `<path d="${ICON[k]}" class="x2l" transform="translate(2 2)"/><path d="${ICON[k]}" fill="none" stroke="var(--ink)" stroke-width="1" stroke-linejoin="round"/>` + (k === 'house' ? `<path d="M-3 11V4H3V11" fill="none" stroke="var(--ink)" stroke-width="1"/>` : '')) },
    { id: 'icon3d', name: '3D icons', aka: 'glossy 3D emoji-style icons',
      desc: 'Small rendered 3D objects used as icons, with soft lighting and highlights. Eye-catching for landing pages; too heavy for dense UI.',
      ref: 'Microsoft Fluent 3D emoji, Apple-style app icons',
      prompt: 'soft 3D rendered icons with glossy highlights and gentle shadows',
      ex: sv(`<defs><radialGradient id="i3h" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffd0dc"/><stop offset=".5" stop-color="#f0507a"/><stop offset="1" stop-color="#9c1d44"/></radialGradient><radialGradient id="i3s" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff6c8"/><stop offset=".55" stop-color="#f6c02c"/><stop offset="1" stop-color="#b9780c"/></radialGradient><filter id="i3b"><feGaussianBlur stdDeviation="2"/></filter></defs><ellipse cx="54" cy="80" rx="18" ry="3.5" class="ik" opacity=".2" filter="url(#i3b)"/><ellipse cx="110" cy="80" rx="16" ry="3.5" class="ik" opacity=".2" filter="url(#i3b)"/><g transform="translate(54 46) scale(2.4)"><path d="${ICON.heart}" fill="url(#i3h)"/></g><ellipse cx="45" cy="36" rx="5" ry="3" fill="#fff" opacity=".7" transform="rotate(-30 45 36)"/><circle cx="110" cy="50" r="18" fill="url(#i3s)"/><ellipse cx="104" cy="42" rx="5" ry="3" fill="#fff" opacity=".7" transform="rotate(-30 104 42)"/>`) },
    { id: 'sticker', name: 'Sticker style', aka: 'die-cut stickers',
      desc: 'Illustrations with a thick white border and a small shadow, as if cut out and stuck on. Casual and fun.',
      ref: 'iMessage and Telegram stickers, laptop stickers',
      prompt: 'sticker-style illustrations with a thick white die-cut border and a soft drop shadow, slightly rotated',
      ex: sv(`<defs><filter id="stk" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-opacity=".3"/></filter></defs><g filter="url(#stk)"><g transform="translate(52 48) rotate(-10) scale(2.2)"><path d="${ICON.heart}" class="x4" stroke="#fff" stroke-width="2.4" stroke-linejoin="round" paint-order="stroke"/></g><g transform="rotate(12 112 50)"><polygon points="${[...Array(10)].map((_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? 9 : 20; return f1(112 + rr * Math.cos(a)) + ',' + f1(50 + rr * Math.sin(a)); }).join(' ')}" class="x2" stroke="#fff" stroke-width="5" stroke-linejoin="round" paint-order="stroke"/></g></g>`) },
    { id: 'pictogram', name: 'Pictogram', aka: 'signage icons, wayfinding symbols',
      desc: 'Highly simplified symbols of people and objects meant to be understood instantly by anyone, in any language.',
      ref: 'airport signs, Olympic sport pictograms, the AIGA symbol set',
      prompt: 'pictogram style: ultra-simplified geometric figures, white on a solid colored square, like airport signage',
      ex: sv(`<rect x="22" y="20" width="56" height="56" rx="6" fill="#1f5fa8"/><circle cx="50" cy="32" r="5" fill="#fff"/><path d="M50 40L46 56M50 40L56 50L62 46M46 56L40 68M46 56L54 62L56 70M50 42L42 50" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none"/><rect x="86" y="20" width="56" height="56" rx="6" fill="#1f8a4c"/><path d="M98 48H126M116 36L128 48L116 60" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`) },
    { id: 'spotillo', name: 'Spot illustration', aka: 'vignette, inline illustration',
      desc: 'A small illustration placed next to text to add warmth or explain an idea, without a full background or frame.',
      ref: 'Stripe and Notion marketing pages, help-center articles',
      prompt: 'small spot illustrations beside the text, no background frame, simple shapes in the brand palette',
      ex: sv(`<rect x="14" y="20" width="60" height="6" rx="2" class="ik"/>` + [0, 1, 2, 3, 4].map(i => `<rect x="14" y="${34 + i * 8}" width="${i === 4 ? 36 : 62}" height="3" rx="1.5" class="gr"/>`).join('') + `<path d="M98 50c6-22 36-24 44-4s-10 34-26 32-24-12-18-28z" class="x3l" opacity=".7"/><rect x="110" y="60" width="18" height="16" rx="2" class="x2"/><path d="M119 60C119 48 110 44 104 42M119 60C120 46 128 40 136 38M119 60V40" fill="none" stroke="var(--x3d)" stroke-width="2"/><ellipse cx="104" cy="42" rx="6" ry="3" class="x3" transform="rotate(20 104 42)"/><ellipse cx="136" cy="38" rx="6" ry="3" class="x3" transform="rotate(-20 136 38)"/><ellipse cx="119" cy="38" rx="3" ry="6" class="x3"/>`) },
    { id: 'corpmemphis', name: 'Corporate Memphis', aka: 'Alegria style, "big tech flat people"',
      desc: 'Flat cartoon people with tiny heads, long bendy limbs and unrealistic skin colors. Hugely popular in the late 2010s, now often seen as generic.',
      ref: 'Facebook\'s Alegria, Slack and Google marketing',
      prompt: 'Corporate Memphis style: flat people with small heads, exaggerated long limbs, non-realistic skin colors, blob shapes',
      ex: sv(`<path d="M40 30c20-20 70-14 80 10s-6 50-40 50-56-30-40-60z" fill="#ffd7c9"/><path d="M66 44L54 92M76 44L94 92" stroke="#2f2a6b" stroke-width="9" stroke-linecap="round"/><path d="M60 28h22l4 24H58z" fill="#ff8a3d"/><circle cx="71" cy="20" r="5" fill="#7b61ff"/><path d="M60 32C40 34 32 22 30 12M82 32C100 40 112 34 120 22" stroke="#7b61ff" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M118 64c6-10 16-6 14 4s-10 10-14-4z" fill="#3cb371"/>`) },
    { id: 'mascot', name: 'Mascot', aka: 'brand character',
      desc: 'A recurring friendly character that represents a product. Gives personality to empty states, errors and onboarding.',
      ref: 'Duolingo\'s owl, GitHub\'s Octocat, Mailchimp\'s Freddie',
      prompt: 'friendly brand mascot character: simple rounded shape, big expressive eyes, used in empty and error states',
      ex: sv(`<path d="M80 24V14" stroke="var(--ink)" stroke-width="1.5"/><circle cx="80" cy="12" r="3" class="x2"/><rect x="50" y="24" width="60" height="54" rx="27" class="x3"/><ellipse cx="80" cy="86" rx="24" ry="4" class="ik" opacity=".15"/><circle cx="68" cy="46" r="8" fill="#fff"/><circle cx="92" cy="46" r="8" fill="#fff"/><circle cx="70" cy="47" r="4" fill="#111"/><circle cx="94" cy="47" r="4" fill="#111"/><path d="M70 62Q80 70 90 62" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round"/><ellipse cx="60" cy="58" rx="4" ry="2.5" class="x4l"/><ellipse cx="100" cy="58" rx="4" ry="2.5" class="x4l"/>`) }
  ]
});

const person = (x, y, s, fill) => `<circle cx="${x}" cy="${f1(y - s * 1.15)}" r="${f1(s * .5)}" fill="${fill}"/><path d="M${f1(x - s * .85)} ${f1(y + s * 1.4)}Q${f1(x - s * .85)} ${f1(y - s * .45)} ${x} ${f1(y - s * .5)}Q${f1(x + s * .85)} ${f1(y - s * .45)} ${f1(x + s * .85)} ${f1(y + s * 1.4)}Z" fill="${fill}"/>`;

pool.groups.push({
  id: 'photo', title: 'Photo & film', slot: 'Photo & film',
  intro: 'Camera and lighting language from photography and film. Useful for hero images, AI image prompts, video, and describing the mood of a scene.',
  terms: [
    { id: 'wideshot', name: 'Establishing shot', aka: 'wide shot, long shot',
      desc: 'A wide view that shows the whole setting, with people small in the frame. Answers "where are we?"',
      ref: 'the opening shot of almost any film scene',
      prompt: 'wide establishing shot showing the whole setting, people small in the frame',
      ex: sv(`<defs><linearGradient id="phws" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bcd5ea"/><stop offset="1" stop-color="#eef3f6"/></linearGradient></defs><rect width="160" height="100" fill="url(#phws)"/><polygon points="0,64 30,34 56,58 84,26 118,56 140,40 160,52 160,100 0,100" fill="#8aa1b6"/><rect y="74" width="160" height="26" fill="#6f8a5a"/>` + [[50, 14], [58, 22], [66, 10], [72, 18], [80, 26], [88, 12], [96, 20]].map(([x, h]) => `<rect x="${x}" y="${74 - h}" width="7" height="${h}" fill="#5d6b7c"/>`).join('') + person(124, 84, 2.2, '#2b2b2b')) },
    { id: 'mediumshot', name: 'Medium shot', aka: 'waist-up shot',
      desc: 'A person framed from about the waist up. Natural and conversational; the default for interviews and talking heads.',
      ref: 'news anchors, YouTube talking heads',
      prompt: 'medium shot framing the subject from the waist up',
      ex: sv(`<rect width="160" height="100" fill="#cdd8e4"/><rect x="104" y="12" width="40" height="52" fill="#b5c3d2"/>` + person(70, 64, 26, '#3b4a63') + `<circle cx="70" cy="34" r="12" fill="#e2b48f"/>`) },
    { id: 'closeup', name: 'Close-up', aka: 'CU, head shot',
      desc: 'The face fills most of the frame. Shows emotion and creates intimacy.',
      ref: 'emotional film moments, portrait photography',
      prompt: 'tight close-up on the face, filling the frame',
      ex: sv(`<rect width="160" height="100" fill="#d9c3ad"/><ellipse cx="80" cy="56" rx="34" ry="44" fill="#e5b490"/><path d="M46 44C46 10 114 10 114 44C104 28 60 26 46 44Z" fill="#3b2a20"/><ellipse cx="66" cy="56" rx="5" ry="3.5" fill="#fff"/><ellipse cx="94" cy="56" rx="5" ry="3.5" fill="#fff"/><circle cx="66" cy="56" r="2.6" fill="#3a2a1f"/><circle cx="94" cy="56" r="2.6" fill="#3a2a1f"/><path d="M80 60V74H76" fill="none" stroke="#b57f5f" stroke-width="1.5"/><path d="M70 84Q80 89 90 84" fill="none" stroke="#a5503f" stroke-width="2.4" stroke-linecap="round"/>`) },
    { id: 'macro', name: 'Extreme close-up', aka: 'ECU, macro shot',
      desc: 'One small detail fills the whole frame, like an eye or a texture. Dramatic, tactile and attention-grabbing.',
      ref: 'Sergio Leone westerns, product detail shots',
      prompt: 'extreme close-up macro shot of a single detail filling the frame',
      ex: sv(`<rect width="160" height="100" fill="#e1ad8a"/><path d="M14 50Q80 0 146 50Q80 100 14 50Z" fill="#fbf6f0"/><circle cx="80" cy="50" r="22" fill="#3a7a8c"/><circle cx="80" cy="50" r="22" fill="none" stroke="#1f4d5a" stroke-width="3"/><circle cx="80" cy="50" r="10" fill="#0d0d0d"/><circle cx="73" cy="43" r="4" fill="#fff" opacity=".85"/><path d="M14 50Q80 0 146 50" fill="none" stroke="#3b2418" stroke-width="3"/>` + [...Array(9)].map((_, i) => { const x = 30 + i * 12.5; const y = 50 - Math.sin((x - 14) / 132 * Math.PI) * 25; return `<path d="M${f1(x)} ${f1(y)}l${f1((i - 4) * .8)} -8" stroke="#3b2418" stroke-width="1.4"/>`; }).join('')) },
    { id: 'ots', name: 'Over-the-shoulder', aka: 'OTS shot',
      desc: 'Framed from behind one person\'s shoulder looking at another. Puts the viewer inside a conversation.',
      ref: 'dialogue scenes, interview setups',
      prompt: 'over-the-shoulder shot: blurred shoulder in the foreground, the other person in focus facing camera',
      ex: sv(`<defs><filter id="otsb" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.5"/></filter></defs><rect width="160" height="100" fill="#c9d3c4"/><rect x="88" y="10" width="60" height="40" fill="#b3bfae"/>` + person(108, 66, 16, '#7a4a3a') + `<circle cx="108" cy="47" r="7" fill="#e0b08c"/><g filter="url(#otsb)"><circle cx="30" cy="40" r="22" fill="#1d2230"/><path d="M-10 100Q-6 58 30 58Q70 60 76 100Z" fill="#1d2230"/></g>`) },
    { id: 'dutch', name: 'Dutch angle', aka: 'canted angle, tilted frame',
      desc: 'The camera tilted so the horizon is slanted. Signals unease, tension or something off-balance.',
      ref: 'The Third Man, Batman (1966) villain scenes, thrillers',
      prompt: 'Dutch angle: camera tilted so the horizon slants, uneasy tension',
      ex: sv(`<rect width="160" height="100" fill="#3a3550"/><g transform="rotate(-16 80 50)"><rect x="-40" y="-40" width="240" height="96" fill="#5b5577"/><rect x="-40" y="56" width="240" height="90" fill="#26223a"/>` + [[10, 36], [36, 52], [66, 30], [92, 46], [120, 40]].map(([x, h]) => `<rect x="${x}" y="${56 - h}" width="22" height="${h}" fill="#1b182b"/><rect x="${x + 5}" y="${62 - h}" width="4" height="4" fill="#e9c46a"/>`).join('') + person(84, 76, 5, '#0d0b16') + `</g>`) },
    { id: 'goldenhour', name: 'Golden hour', aka: 'magic hour, warm light',
      desc: 'The hour after sunrise or before sunset: low, warm, soft light with long shadows. Flattering, nostalgic and hopeful.',
      ref: 'Terrence Malick films, lifestyle photography',
      prompt: 'golden hour lighting: low warm sun, long soft shadows, glowing amber tones',
      ex: sv(`<defs><linearGradient id="phgh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7d189"/><stop offset=".6" stop-color="#f39a63"/><stop offset="1" stop-color="#c8587a"/></linearGradient><filter id="phgg" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter></defs><rect width="160" height="100" fill="url(#phgh)"/><circle cx="36" cy="66" r="16" fill="#fff4c9" filter="url(#phgg)"/><circle cx="36" cy="66" r="9" fill="#fff8dd"/><rect y="72" width="160" height="28" fill="#7a3d34"/><path d="M118 72V40M118 50Q104 42 102 30M118 46Q130 38 134 28" stroke="#3b1d1a" stroke-width="3" fill="none"/><circle cx="104" cy="30" r="10" fill="#3b1d1a"/><circle cx="132" cy="28" r="12" fill="#3b1d1a"/><circle cx="118" cy="24" r="10" fill="#3b1d1a"/>` + person(84, 66, 5, '#3b1d1a') + `<polygon points="80,73 88,73 150,82 150,86" fill="#3b1d1a" opacity=".5"/>`) },
    { id: 'bluehour', name: 'Blue hour', aka: 'twilight, dusk',
      desc: 'The short time after sunset when the sky turns deep blue and city lights come on. Calm, cool and a little melancholy.',
      ref: 'city skyline photography, neo-noir films',
      prompt: 'blue hour: deep blue twilight sky, warm city lights just switching on',
      ex: (() => { const r = rng(11); let o = `<defs><linearGradient id="phbh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14204d"/><stop offset="1" stop-color="#5a7cc0"/></linearGradient></defs><rect width="160" height="100" fill="url(#phbh)"/>`; [[0, 44], [22, 60], [40, 36], [58, 70], [80, 50], [100, 64], [124, 42], [142, 56]].forEach(([x, h]) => { o += `<rect x="${x}" y="${100 - h}" width="20" height="${h}" fill="#0f1733"/>`; for (let wy = 104 - h; wy < 96; wy += 6) for (let wx = x + 3; wx < x + 17; wx += 5) if (r() < .45) o += `<rect x="${wx}" y="${wy}" width="2.5" height="3" fill="#ffd27a"/>`; }); return sv(o); })() },
    { id: 'highkey', name: 'High-key', aka: 'bright and airy',
      desc: 'Bright, even lighting with mostly white and light tones and almost no dark shadows. Feels clean, optimistic and fresh.',
      ref: 'Apple product shots, skincare ads',
      prompt: 'high-key lighting: bright, airy, mostly white tones, minimal shadows',
      ex: sv(`<rect width="160" height="100" fill="#fbfbfa"/><ellipse cx="80" cy="92" rx="34" ry="3" fill="#e9eaea"/>` + person(80, 68, 20, '#e4e6ea') + `<circle cx="80" cy="45" r="10" fill="#f1dccb"/>`) },
    { id: 'lowkey', name: 'Low-key', aka: 'chiaroscuro, dramatic lighting',
      desc: 'Mostly dark with a single hard light picking out part of the subject. Moody, mysterious and dramatic.',
      ref: 'Rembrandt, Caravaggio, The Godfather',
      prompt: 'low-key chiaroscuro lighting: mostly darkness, one hard side light revealing half the subject',
      ex: sv(`<defs><clipPath id="phlk"><rect x="0" y="0" width="80" height="100"/></clipPath></defs><rect width="160" height="100" fill="#0a0a0c"/>` + person(80, 72, 24, '#1a1714') + `<circle cx="80" cy="44" r="13" fill="#1a1714"/><g clip-path="url(#phlk)">` + person(80, 72, 24, '#6b4a33') + `<circle cx="80" cy="44" r="13" fill="#d9a77f"/></g>`) },
    { id: 'silhouette', name: 'Silhouette', aka: 'backlit shape',
      desc: 'A subject shot against a bright light so it becomes a solid dark shape. Strong, graphic and anonymous.',
      ref: 'sunset beach shots, the iPod ads',
      prompt: 'silhouette: subject as a solid black shape against a bright backlit sky',
      ex: sv(`<defs><linearGradient id="phsi" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb36b"/><stop offset="1" stop-color="#ff6f61"/></linearGradient></defs><rect width="160" height="100" fill="url(#phsi)"/><circle cx="80" cy="74" r="22" fill="#ffe2a8"/><rect y="80" width="160" height="20" fill="#111"/><path d="M76 80L78 60L72 66M78 60L88 64L94 54M78 60L82 46M82 46L76 80M82 46L88 80" stroke="#111" stroke-width="4" stroke-linecap="round" fill="none"/><circle cx="83" cy="40" r="5" fill="#111"/>`) },
    { id: 'tealorange', name: 'Teal and orange', aka: 'color grading, blockbuster grade',
      desc: 'A common film color grade: shadows and backgrounds pushed toward teal, skin tones toward orange. Instant "Hollywood" look.',
      ref: 'Michael Bay films, Mad Max: Fury Road',
      prompt: 'cinematic teal-and-orange color grade, teal shadows, warm orange skin tones',
      ex: sv(`<defs><linearGradient id="phto" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0d3b4a"/><stop offset="1" stop-color="#2a8a8a"/></linearGradient><filter id="phtb"><feGaussianBlur stdDeviation="3"/></filter></defs><rect width="160" height="100" fill="url(#phto)"/><g filter="url(#phtb)" opacity=".7"><circle cx="30" cy="24" r="8" fill="#5fd3c8"/><circle cx="132" cy="30" r="10" fill="#ffb26b"/><circle cx="120" cy="70" r="6" fill="#5fd3c8"/></g>` + person(76, 72, 22, '#123c46') + `<circle cx="76" cy="46" r="12" fill="#f2a65a"/><path d="M76 34A12 12 0 0 1 76 58Z" fill="#c4743a"/>`) },
    { id: 'filmlook', name: 'Analog film look', aka: 'film grain, 35mm, light leaks',
      desc: 'The texture of old film photos: grain, slightly faded colors, warm light leaks and soft contrast. Nostalgic and human.',
      ref: 'Kodak Portra, VSCO filters, disposable-camera photos',
      prompt: 'analog 35mm film look: visible grain, faded warm colors, soft contrast, light leaks',
      ex: sv(`<defs><filter id="phfg"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="5"/><feColorMatrix values="0 0 0 0 .2  0 0 0 0 .15  0 0 0 0 .1  0 0 0 .5 0"/><feComposite in2="SourceGraphic" operator="in"/></filter><radialGradient id="phfl" cx="1" cy="0" r=".8"><stop offset="0" stop-color="#ff7a2f" stop-opacity=".75"/><stop offset="1" stop-color="#ff7a2f" stop-opacity="0"/></radialGradient></defs><rect width="160" height="100" fill="#141414"/>` + [...Array(10)].map((_, i) => `<rect x="${6 + i * 16}" y="3" width="8" height="5" rx="1" fill="#e9e1cf"/><rect x="${6 + i * 16}" y="92" width="8" height="5" rx="1" fill="#e9e1cf"/>`).join('') + `<g><rect x="8" y="12" width="144" height="76" fill="#c9d6c8"/><rect x="8" y="58" width="144" height="30" fill="#b9a978"/><circle cx="52" cy="44" r="14" fill="#d7a98c"/><rect x="8" y="12" width="144" height="76" fill="url(#phfl)"/><rect x="8" y="12" width="144" height="76" fill="#fff" filter="url(#phfg)"/></g>`) },
    { id: 'longexposure', name: 'Long exposure', aka: 'light trails, motion blur',
      desc: 'The shutter stays open for seconds, so moving lights become smooth streaks and water turns to mist. Shows motion and the passing of time.',
      ref: 'night traffic photos, silky waterfall shots',
      prompt: 'long exposure photograph: smooth light trails streaking through a night scene',
      ex: sv(`<defs><filter id="phle" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter></defs><rect width="160" height="100" fill="#0b0e1c"/><polygon points="0,100 160,100 92,44 68,44" fill="#1b1f30"/><g filter="url(#phle)" fill="none" stroke-linecap="round"><path d="M4 98C40 80 60 56 76 44" stroke="#ff4d4d" stroke-width="3"/><path d="M14 100C46 82 64 58 78 44" stroke="#ff7a5c" stroke-width="1.6"/><path d="M156 98C120 80 100 56 84 44" stroke="#fff1c2" stroke-width="3"/><path d="M146 100C116 82 98 58 82 44" stroke="#ffd97a" stroke-width="1.6"/></g>` + [[20, 20], [140, 18], [36, 32], [124, 30]].map(([x, h]) => `<rect x="${x - 6}" y="${44 - h}" width="12" height="${h}" fill="#151a2e"/>`).join('')) },
    { id: 'flatlay', name: 'Flat lay', aka: 'top-down product shot, knolling',
      desc: 'Objects arranged neatly on a surface and shot straight down from above. Tidy and curated; knolling lines everything up at right angles.',
      ref: 'Instagram product shots, "what\'s in my bag" photos',
      prompt: 'flat lay photo from directly above, objects neatly arranged on a clean surface',
      ex: sv(`<rect width="160" height="100" fill="#e9e3d8"/><rect x="22" y="16" width="46" height="62" rx="2" fill="#fbfaf6" transform="rotate(-6 45 47)"/>` + [0, 1, 2, 3, 4].map(i => `<rect x="28" y="${28 + i * 8}" width="32" height="2" fill="#c9c2b4" transform="rotate(-6 45 47)"/>`).join('') + `<circle cx="104" cy="30" r="14" fill="#f6f2ea" stroke="#d8d0c2" stroke-width="2"/><circle cx="104" cy="30" r="9" fill="#5a3826"/><rect x="74" y="60" width="44" height="4" rx="2" fill="#2b4a6f" transform="rotate(30 96 62)"/><rect x="118" y="56" width="22" height="34" rx="3" fill="#1c1c1e"/><rect x="120" y="58" width="18" height="30" rx="2" fill="#39404d"/>` + [[22, 86, 10], [10, 76, 8], [32, 92, 7]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#4f8a5b"/>`).join('')) }
  ]
});


/* ---------- textures & mediums ---------- */
const noiseFx = (id, freq, alpha, rgb = '0 0 0', seed = 2) => `<filter id="${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="2" seed="${seed}"/><feColorMatrix values="0 0 0 0 ${rgb.split(' ')[0]}  0 0 0 0 ${rgb.split(' ')[1]}  0 0 0 0 ${rgb.split(' ')[2]}  0 0 0 ${alpha} 0"/></filter>`;
const sunSea = (sun, sea, bg) => `<rect width="160" height="100" fill="${bg}"/><circle cx="80" cy="58" r="30" fill="${sun}"/><rect y="62" width="160" height="38" fill="${sea}"/>`;

pool.groups.push({
  id: 'texture', title: 'Surfaces & textures', slot: 'Texture',
  intro: 'The surface an image seems to sit on, or the grit laid over it. A texture word is often what turns a flat digital picture into something that feels printed, painted or touchable.',
  terms: [
    { id: 'canvas', name: 'Canvas', aka: 'canvas weave, linen canvas',
      desc: 'The woven cloth paintings are made on. A faint crisscross grid of threads shows through the paint, especially in thin areas.',
      spot: 'a tiny regular over-under weave pattern visible across the whole image, paint catching on the raised threads',
      ref: 'oil paintings, giclée art prints',
      prompt: 'visible canvas weave texture showing through the paint',
      ex: sv(`<defs><pattern id="txcw" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 1H4" stroke="#4a3a22" stroke-opacity=".22" stroke-width="1.3"/><path d="M3 0V4" stroke="#fff" stroke-opacity=".28" stroke-width="1.3"/></pattern>${noiseFx('txcn', .9, .3, '.3 .25 .2')}</defs>` + sunSea('#e98a2b', '#2f6f73', '#e8dcc4') + `<rect width="160" height="100" fill="url(#txcw)"/><rect width="160" height="100" filter="url(#txcn)"/>`) },
    { id: 'papergrain', name: 'Paper grain', aka: 'cold-press paper, tooth, watercolor paper',
      desc: 'The bumpy surface of good art paper. Light catches the little hills and pigment settles in the valleys.',
      spot: 'soft irregular bumps (not a grid like canvas), paint or pencil skipping over the raised spots',
      ref: 'watercolor paintings, letterpress cards',
      prompt: 'textured cold-press paper surface, visible paper tooth under the color',
      ex: sv(`<defs><filter id="txpg" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".07" numOctaves="4" seed="8" result="n"/><feDiffuseLighting in="n" surfaceScale="2.4" lighting-color="#f6f1e7"><feDistantLight azimuth="45" elevation="55"/></feDiffuseLighting></filter></defs><rect width="160" height="100" filter="url(#txpg)"/><circle cx="80" cy="54" r="28" fill="#e98a2b" opacity=".75" style="mix-blend-mode:multiply"/><rect y="64" width="160" height="36" fill="#3f8a8c" opacity=".6" style="mix-blend-mode:multiply"/>`) },
    { id: 'kraft', name: 'Kraft paper', aka: 'cardboard, brown paper',
      desc: 'Unbleached brown paper with visible fibers. Feels handmade, eco and packaging-like.',
      spot: 'warm brown base, short streaky fibers, dark flecks, white or black ink printed on top',
      ref: 'artisan packaging, farmers-market labels',
      prompt: 'printed on brown kraft paper with visible fibers and flecks',
      ex: sv(`<defs><filter id="txkf" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".015 .4" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 .3  0 0 0 0 .2  0 0 0 0 .1  0 0 0 .55 -.1"/></filter></defs><rect width="160" height="100" fill="#b98b5c"/><rect width="160" height="100" filter="url(#txkf)"/>` + (() => { const r = rng(17); let o = ''; for (let i = 0; i < 70; i++) o += `<circle cx="${f1(r() * 160)}" cy="${f1(r() * 100)}" r="${f1(.3 + r() * .7)}" fill="#3e2a17" opacity=".6"/>`; return o; })() + `<circle cx="80" cy="48" r="30" fill="none" stroke="#fdf7ee" stroke-width="2.5"/><text x="80" y="51" fill="#fdf7ee" style="font:800 8px var(--display);letter-spacing:.12em" text-anchor="middle">HANDMADE</text>`) },
    { id: 'graingrad', name: 'Grain shading', aka: 'stipple shading, spray grit, noise shading',
      desc: 'Shading made from a scatter of fine specks instead of a smooth blend. Popular in modern retro illustration; it reads as printed or hand-made rather than digital.',
      spot: 'tones built from sand-like specks that get denser toward the shadow side; flat shapes otherwise',
      ref: 'retro poster illustration, Procreate grain brushes',
      prompt: 'flat shapes shaded with fine grainy stipple texture instead of smooth gradients',
      ex: (() => { const r = rng(23); let o = `<rect width="160" height="100" fill="#f4e6c4"/><circle cx="80" cy="56" r="34" fill="#f0a531"/><polygon points="76,20 76,84 52,84" fill="#fbecc6"/><polygon points="80,26 80,84 100,84" fill="#fbecc6"/><rect x="77" y="18" width="2.5" height="68" fill="#1f5e66"/>`; for (let i = 0; i < 2200; i++) { const x = r() * 160, y = r() * 100; const inSun = Math.hypot(x - 80, y - 56) < 34; const sailA = y > 20 && y < 84 && x < 76 && x > 76 - (y - 20) * .375; const sailB = y > 26 && y < 84 && x > 80 && x < 80 + (y - 26) * .345; let p = 0, c = ''; if (sailA) { p = Math.max(0, (x - 66) / 10) * .7; c = '#e3a04a'; } else if (sailB) { p = Math.max(0, (90 - x) / 10) * .6; c = '#c8601f'; } else if (inSun) { p = Math.max(0, (Math.hypot(x - 80, y - 56) - 18) / 16) * .6; c = '#c8601f'; } if (r() < p) o += `<circle cx="${f1(x)}" cy="${f1(y)}" r=".55" fill="${c}"/>`; } return sv(o); })() },
    { id: 'halftonegrad', name: 'Halftone gradient', aka: 'dot gradient, Ben-Day fade',
      desc: 'A color fading into another through a field of dots that shrink as they go. The signature texture of printed posters and comics.',
      spot: 'regular rows of dots that get smaller toward the light side; flat inks, no smooth blending',
      ref: 'vintage posters',
      prompt: 'halftone dot gradients for shading, dots shrinking toward the light, flat screen-print inks',
      ex: sv(`<defs><clipPath id="txhs"><circle cx="80" cy="60" r="36"/></clipPath></defs><rect width="160" height="100" fill="#f4e6c4"/>` + [...Array(41)].map((_, i) => [...Array(16)].map((_, j) => { const x = i * 4 + (j % 2) * 2, y = j * 4; const rr = Math.max(0, 1.7 - y / 34); return rr > .15 ? `<circle cx="${x}" cy="${y}" r="${f1(rr)}" fill="#4fa3a0"/>` : ''; }).join('')).join('') + `<circle cx="80" cy="60" r="36" fill="#f6b23e"/><g clip-path="url(#txhs)">` + [...Array(20)].map((_, i) => [...Array(20)].map((_, j) => { const x = 44 + i * 3.8 + (j % 2) * 1.9, y = 24 + j * 3.8; const rr = Math.max(0, 1.7 - Math.abs(y - 60) / 28 - Math.abs(x - 80) / 60) * 1.1; return rr > .2 ? `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rr)}" fill="#d9661f"/>` : ''; }).join('')).join('') + `</g><rect y="66" width="160" height="34" fill="#1f5e66"/>` + [...Array(9)].map((_, i) => `<rect x="${36 + (i % 3) * 8 + i * 4}" y="${70 + i * 3}" width="${40 - i * 2}" height="1.6" rx=".8" fill="#f6b23e"/>`).join('')) },
    { id: 'printwear', name: 'Distressed print', aka: 'worn texture, grunge, vintage wear',
      desc: 'Ink that looks faded, scuffed and broken up, as if the poster has been in the sun for years. Adds age and authenticity.',
      spot: 'specks and patches missing from solid ink areas, slightly faded colors, rough edges',
      ref: 'vintage band T-shirts, old enamel signs',
      prompt: 'distressed vintage print texture, worn and speckled ink, slightly faded',
      ex: sv(`<defs><filter id="txpwn" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".25" numOctaves="3" seed="12"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"/><feComponentTransfer><feFuncA type="discrete" tableValues="0 0 0 0 0 .9 1"/></feComponentTransfer></filter><mask id="txpwm"><rect width="160" height="100" fill="#fff"/><rect width="160" height="100" filter="url(#txpwn)"/></mask></defs><rect width="160" height="100" fill="#efe3c8"/><g mask="url(#txpwm)"><circle cx="80" cy="44" r="26" fill="#c8402b"/><rect x="30" y="74" width="100" height="14" fill="#1f3a5f"/><text x="80" y="84.5" fill="#efe3c8" style="font:800 9px var(--display);letter-spacing:.2em" text-anchor="middle">EST. 1962</text><polygon points="80,26 96,58 64,58" fill="#efe3c8"/></g>`) },
    { id: 'linen', name: 'Linen & fabric', aka: 'cloth texture, woven texture',
      desc: 'A fine soft woven texture, finer and more irregular than canvas. Feels warm, domestic and tactile.',
      spot: 'tiny irregular horizontal and vertical threads, soft and slightly uneven',
      ref: 'book covers, early iOS backgrounds',
      prompt: 'soft linen fabric texture as the background',
      ex: sv(`<defs><filter id="txln" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9 .05" numOctaves="2" seed="5" result="a"/><feTurbulence type="fractalNoise" baseFrequency=".05 .9" numOctaves="2" seed="6" result="b"/><feBlend in="a" in2="b" mode="multiply"/><feColorMatrix values="0 0 0 0 .35  0 0 0 0 .32  0 0 0 0 .28  0 0 0 .9 -.25"/></filter></defs><rect width="160" height="100" fill="#e7e1d4"/><rect width="160" height="100" filter="url(#txln)"/><rect x="50" y="34" width="60" height="32" rx="3" fill="#7d8f7a" opacity=".85"/>`) },
    { id: 'concrete', name: 'Concrete & plaster', aka: 'stone texture, stucco',
      desc: 'A mottled grey mineral surface with tiny pits. Feels solid, industrial and architectural.',
      spot: 'uneven grey blotches, small air holes, slight relief under light',
      ref: 'brutalist websites, minimalist interiors',
      prompt: 'raw concrete texture, mottled grey with small pits',
      ex: sv(`<defs><filter id="txcc" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".4" numOctaves="4" seed="21" result="n"/><feDiffuseLighting in="n" surfaceScale="1.6" lighting-color="#b9b5ad"><feDistantLight azimuth="60" elevation="50"/></feDiffuseLighting></filter><filter id="txcc2" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".02" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 .2  0 0 0 0 .2  0 0 0 0 .2  0 0 0 .45 -.1"/></filter></defs><rect width="160" height="100" filter="url(#txcc)"/><rect width="160" height="100" filter="url(#txcc2)"/>` + (() => { const r = rng(9); let o = ''; for (let i = 0; i < 40; i++) o += `<circle cx="${f1(r() * 160)}" cy="${f1(r() * 100)}" r="${f1(.4 + r())}" fill="#55524c" opacity=".6"/>`; return o; })()) },
    { id: 'woodgrain', name: 'Wood grain', aka: 'timber texture',
      desc: 'Long flowing lines and rings from a tree\'s growth. Warm, natural and crafted.',
      spot: 'long wavy parallel streaks, occasional knots, warm brown tones',
      ref: 'Scandinavian product shots, craft brands',
      prompt: 'warm natural wood grain texture',
      ex: sv(`<defs><filter id="txwd" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".012 .2" numOctaves="3" seed="7"/><feColorMatrix values=".45 0 0 0 .38  .32 0 0 0 .22  .2 0 0 0 .12  0 0 0 0 1"/></filter></defs><rect width="160" height="100" filter="url(#txwd)"/><ellipse cx="110" cy="40" rx="7" ry="4" fill="none" stroke="#5b3a1e" stroke-opacity=".5"/><ellipse cx="110" cy="40" rx="3" ry="1.8" fill="#5b3a1e" opacity=".5"/>`) },
    { id: 'crumpled', name: 'Crumpled paper', aka: 'wrinkled paper, creased',
      desc: 'Paper that has been scrunched and flattened, leaving soft folds and creases. Feels informal, lived-in or nostalgic.',
      spot: 'irregular soft ridges and valleys of light and shadow across the whole surface',
      ref: 'scrapbook layouts, handwritten-note designs',
      prompt: 'crumpled paper texture with soft creases and folds',
      ex: sv(`<defs><filter id="txcr" x="0" y="0" width="100%" height="100%"><feTurbulence type="turbulence" baseFrequency=".025" numOctaves="3" seed="15" result="n"/><feDiffuseLighting in="n" surfaceScale="5" lighting-color="#f5f2ec"><feDistantLight azimuth="225" elevation="42"/></feDiffuseLighting></filter></defs><rect width="160" height="100" filter="url(#txcr)"/><text x="80" y="56" fill="#2d3a5a" style="font:600 16px Caveat,cursive" text-anchor="middle" opacity=".85">remember this</text>`) },
    { id: 'brushedmetal', name: 'Brushed metal', aka: 'brushed aluminum, steel',
      desc: 'Metal with fine parallel scratch lines from polishing, plus a soft band of reflected light.',
      spot: 'very fine straight streaks all in one direction, cool grey, a broad soft highlight',
      ref: 'MacBook bodies, early macOS windows, appliance panels',
      prompt: 'brushed aluminum texture with fine horizontal streaks and a soft sheen',
      ex: sv(`<defs><linearGradient id="txbm" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9aa1aa"/><stop offset=".45" stop-color="#e3e7ec"/><stop offset=".6" stop-color="#c5cbd2"/><stop offset="1" stop-color="#8a919b"/></linearGradient>${noiseFx('txbn', '.002 .9', .45, '.25 .27 .3', 3)}</defs><rect width="160" height="100" fill="url(#txbm)"/><rect width="160" height="100" filter="url(#txbn)"/><circle cx="80" cy="50" r="10" fill="none" stroke="#6b737d" stroke-width="1.5"/><circle cx="80" cy="50" r="6" fill="#6b737d" opacity=".25"/>`) },
    { id: 'grainygradient', name: 'Grainy gradient', aka: 'noise gradient',
      desc: 'A soft color gradient with a layer of fine noise on top, which stops it looking plasticky and adds a print-like softness.',
      spot: 'smooth color transition plus visible fine specks everywhere, especially in the darker areas',
      ref: 'tech landing pages, album covers, Spotify Wrapped',
      prompt: 'soft grainy gradient background with visible fine noise',
      ex: sv(`<defs><linearGradient id="txgg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3b2a8f"/><stop offset=".5" stop-color="#e2557a"/><stop offset="1" stop-color="#f6b54a"/></linearGradient><filter id="txgn" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".95" numOctaves="2" seed="9"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 .55"/></feComponentTransfer></filter></defs><rect width="160" height="100" fill="url(#txgg)"/><rect width="160" height="100" filter="url(#txgn)" style="mix-blend-mode:overlay"/>`) }
  ]
});

pool.groups.push({
  id: 'medium', title: 'Mediums', slot: 'Medium',
  intro: 'What a picture is made with. Naming the medium ("gouache", "charcoal", "marker") tells Claude or an image model how edges, color and texture should behave. Watercolor, ink hatching, linocut and collage are under Illustration techniques.',
  terms: [
    { id: 'oil', name: 'Oil paint', aka: 'impasto, oil painting',
      desc: 'Slow-drying paint that can be blended smoothly or laid on thick so the brushstrokes stand up off the canvas (impasto).',
      spot: 'rich deep color, visible ridged brushstrokes that catch the light, soft blended transitions',
      ref: 'Van Gogh (thick impasto), classical portraits (smooth)',
      prompt: 'oil painting with thick impasto brushstrokes catching the light',
      ex: sv(`<defs><filter id="mdoil" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".03 .5" numOctaves="2" seed="3" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="5" result="d"/><feGaussianBlur in="t" stdDeviation=".6" result="tb"/><feSpecularLighting in="tb" surfaceScale="3" specularConstant=".6" specularExponent="16" lighting-color="#fff" result="s"><feDistantLight azimuth="225" elevation="50"/></feSpecularLighting><feComposite in="s" in2="d" operator="in" result="s2"/><feComposite in="d" in2="s2" operator="arithmetic" k2="1" k3=".8"/></filter></defs><rect width="160" height="100" fill="#1d2f6b"/><g filter="url(#mdoil)" fill="none" stroke-linecap="round">` + [[10, '#2c4a9a'], [24, '#3d63b8'], [38, '#2c4a9a'], [52, '#4f78c9']].map(([y, c]) => `<path d="M-6 ${y}C30 ${y - 8} 60 ${y + 10} 100 ${y}S150 ${y - 6} 170 ${y + 4}" stroke="${c}" stroke-width="12"/>`).join('') + `<circle cx="116" cy="28" r="10" fill="#f6d34a" stroke="#f3a530" stroke-width="5"/><path d="M-6 74C40 64 90 84 170 70" stroke="#1a2a3a" stroke-width="30"/><path d="M30 92L44 56L52 92" stroke="#13331f" stroke-width="10"/></g>`) },
    { id: 'gouache', name: 'Gouache', aka: 'opaque watercolor, poster paint',
      desc: 'Water-based paint that dries flat, matte and opaque. Gives clean blocks of color with soft, slightly dry edges.',
      spot: 'flat velvety color with no shine, crisp but slightly brushy edges, light colors painted over dark',
      ref: 'mid-century children\'s books, Disney background paintings, Studio Ghibli concept art',
      prompt: 'gouache painting: flat matte opaque color shapes with soft brushy edges',
      ex: sv(`<defs><filter id="mdgo" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="2" seed="5"/><feDisplacementMap in="SourceGraphic" scale="3"/></filter>${noiseFx('mdgn', .7, .18, '.2 .15 .1', 6)}</defs><rect width="160" height="100" fill="#f3e5c9"/><g filter="url(#mdgo)"><circle cx="118" cy="28" r="12" fill="#f2c14e"/><path d="M0 60C30 40 60 44 90 56S140 40 160 50V100H0Z" fill="#7aa874"/><path d="M0 74C40 60 80 70 110 66S150 72 160 70V100H0Z" fill="#3f7a5a"/><path d="M18 80V58M14 62L18 50L22 62" stroke="#2b4a36" stroke-width="5" stroke-linecap="round" fill="#2b4a36"/><rect x="92" y="70" width="18" height="14" fill="#d9603b"/><polygon points="90,70 101,60 112,70" fill="#8a3b2a"/></g><rect width="160" height="100" filter="url(#mdgn)"/>`) },
    { id: 'pastelchalk', name: 'Pastel & chalk', aka: 'soft pastel, chalk drawing',
      desc: 'Sticks of pure pigment rubbed onto textured paper. Colors are soft and powdery and break up over the paper\'s grain.',
      spot: 'grainy broken strokes, powdery soft color, paper showing through, often on tinted or dark paper',
      ref: 'Degas dancers, chalkboard menus',
      prompt: 'soft pastel drawing on dark paper, grainy powdery strokes',
      ex: sv(`<defs><filter id="mdps" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4" result="n"/><feColorMatrix in="n" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -4 2.6" result="m"/><feComposite in="SourceGraphic" in2="m" operator="in"/></filter></defs><rect width="160" height="100" fill="#2a2f3b"/><g filter="url(#mdps)" stroke-linecap="round" fill="none">` + [...Array(9)].map((_, i) => `<path d="M${20 + i * 5} ${74 - i * 3}L${50 + i * 6} ${30 - i}" stroke="#f2a7b8" stroke-width="5"/>`).join('') + [...Array(8)].map((_, i) => `<path d="M${84 + i * 6} 80L${100 + i * 5} 36" stroke="#8fd3e0" stroke-width="5"/>`).join('') + `<path d="M10 88C60 80 100 92 150 84" stroke="#f6e3a1" stroke-width="7"/></g>`) },
    { id: 'charcoal', name: 'Charcoal', aka: 'charcoal sketch, graphite',
      desc: 'Burnt wood sticks that make rich, smudgy blacks. Great for quick expressive drawings with dramatic dark tones.',
      spot: 'soft smudged greys, deep velvety blacks, loose gestural lines, fingerprints of blending',
      ref: 'life-drawing studies, Käthe Kollwitz',
      prompt: 'expressive charcoal drawing, smudged soft shading and bold dark lines',
      ex: sv(`<defs><filter id="mdch" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".6" numOctaves="2" seed="8" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.5"/></filter><filter id="mdcb"><feGaussianBlur stdDeviation="5"/></filter></defs><rect width="160" height="100" fill="#efece5"/><ellipse cx="92" cy="60" rx="34" ry="22" fill="#33302c" opacity=".35" filter="url(#mdcb)"/><ellipse cx="96" cy="88" rx="40" ry="5" fill="#33302c" opacity=".4" filter="url(#mdcb)"/><g filter="url(#mdch)" fill="none" stroke="#1d1b19" stroke-linecap="round"><path d="M62 48C62 30 98 26 104 44C110 62 96 82 80 82C66 82 60 66 62 48Z" stroke-width="2.5"/><path d="M82 30C80 22 84 16 90 14" stroke-width="2"/>` + [...Array(10)].map((_, i) => `<path d="M${88 + i * 1.6} ${48 + i * 2.6}L${102 - i * .5} ${44 + i * 2.4}" stroke-width="1" opacity=".7"/>`).join('') + `</g>`) },
    { id: 'pencil', name: 'Colored pencil', aka: 'pencil crayon',
      desc: 'Layers of light, directional strokes that build color slowly. Gentle, detailed and a little nostalgic.',
      spot: 'visible parallel hatching strokes, white paper flecks between strokes, colors layered rather than mixed',
      ref: 'botanical sketches, children\'s book illustration',
      prompt: 'colored pencil illustration, visible directional strokes and paper texture',
      ex: sv(`<defs><clipPath id="mdpc"><path d="M80 24C104 18 122 36 116 60C110 84 88 90 76 84C56 92 38 76 42 54C46 32 64 20 80 24Z"/></clipPath></defs><rect width="160" height="100" fill="#fbf9f3"/><g clip-path="url(#mdpc)" stroke-linecap="round">` + (() => { const r = rng(6); let o = ''; for (let i = 0; i < 90; i++) { const x = 30 + i * 1.1 + r() * 2; const c = i < 50 ? '#d93a3a' : pick(r, ['#d93a3a', '#f08a3c']); o += `<path d="M${f1(x)} 96L${f1(x + 34)} 14" stroke="${c}" stroke-width=".8" opacity="${f1(.5 + r() * .5)}"/>`; } for (let i = 0; i < 30; i++) { const x = 60 + i * 2 + r() * 2; o += `<path d="M${f1(x)} 96L${f1(x + 30)} 20" stroke="#7a1f2a" stroke-width=".7" opacity="${f1(.3 + r() * .4)}"/>`; } return o; })() + `</g><path d="M80 24C80 16 84 10 90 8" stroke="#5b3a1e" stroke-width="2" fill="none"/><path d="M84 14C92 8 102 10 104 16C96 18 88 18 84 14Z" fill="#5b9a3a" opacity=".85"/>`) },
    { id: 'marker', name: 'Marker', aka: 'alcohol marker, Copic sketch',
      desc: 'Felt-tip markers lay down bold see-through color. Where strokes overlap the color gets darker, leaving visible streaks.',
      spot: 'flat translucent color with darker bands where strokes overlap, crisp streak edges, often over ink lines',
      ref: 'industrial design sketches, fashion illustration, UX whiteboard sketches',
      prompt: 'marker rendering: bold translucent strokes with darker overlaps, over a black ink line drawing',
      ex: sv(`<rect width="160" height="100" fill="#fdfcf8"/><g style="mix-blend-mode:multiply" opacity=".55">` + [...Array(6)].map((_, i) => `<rect x="${30 + i * 15}" y="${30 + (i % 2) * 3}" width="22" height="${44 - (i % 3) * 4}" fill="#2bb3c0" transform="rotate(-8 80 50)"/>`).join('') + `<rect x="34" y="60" width="96" height="14" fill="#f2a33a" transform="rotate(-8 80 50)"/></g><rect x="32" y="30" width="96" height="44" rx="8" fill="none" stroke="#111" stroke-width="1.6" transform="rotate(-8 80 50)"/><circle cx="56" cy="74" r="8" fill="none" stroke="#111" stroke-width="1.6"/><circle cx="108" cy="67" r="8" fill="none" stroke="#111" stroke-width="1.6"/>`) },
    { id: 'airbrush', name: 'Airbrush', aka: 'spray gradient, 80s airbrush',
      desc: 'Paint sprayed as a fine mist, giving ultra-smooth gradients and soft glowing edges. Very 1970s and 80s.',
      spot: 'perfectly smooth soft gradients, fuzzy glowing edges, fine speckle where the spray thins out, chrome and sunsets',
      ref: '80s album covers, Hajime Sorayama, van murals',
      prompt: '1980s airbrush illustration: ultra-smooth gradients, soft glowing edges, fine spray speckle',
      ex: (() => { const r = rng(12); let o = `<defs><linearGradient id="mdab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b1a5e"/><stop offset=".6" stop-color="#d9548a"/><stop offset="1" stop-color="#ffc06b"/></linearGradient><radialGradient id="mdas" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff6d0"/><stop offset=".6" stop-color="#ffd36b"/><stop offset="1" stop-color="#ffd36b" stop-opacity="0"/></radialGradient></defs><rect width="160" height="100" fill="url(#mdab)"/><circle cx="80" cy="62" r="34" fill="url(#mdas)"/>`; for (let i = 0; i < 260; i++) { const a = r() * Math.PI * 2, d = 18 + r() * 22; o += `<circle cx="${f1(80 + Math.cos(a) * d)}" cy="${f1(62 + Math.sin(a) * d)}" r=".5" fill="#fff3c8" opacity="${f1(r() * .7)}"/>`; } return sv(o + `<rect y="78" width="160" height="22" fill="#1d0f3a" opacity=".85"/>`); })() },
    { id: 'inkwash', name: 'Ink wash', aka: 'sumi-e, brush and ink',
      desc: 'East Asian brush painting in black ink diluted to many greys. A few confident strokes suggest a whole landscape.',
      spot: 'black-to-grey washes, expressive tapered brushstrokes, lots of empty paper, often a red seal stamp',
      ref: 'Chinese shan shui landscapes, Japanese sumi-e',
      prompt: 'sumi-e ink wash painting: grey washes, expressive black brushstrokes, generous empty space',
      ex: sv(`<defs><filter id="mdiw"><feGaussianBlur stdDeviation="2.2"/></filter></defs><rect width="160" height="100" fill="#f6f2e8"/><g filter="url(#mdiw)"><path d="M0 70C20 40 34 36 50 56C62 30 80 22 98 52C110 40 126 44 160 64V100H0Z" fill="#9b9a96" opacity=".45"/><path d="M0 84C30 64 50 66 70 78C90 66 120 70 160 82V100H0Z" fill="#5d5c58" opacity=".5"/></g><path d="M100 12C104 30 98 46 112 62C116 68 124 70 130 68" fill="none" stroke="#141414" stroke-width="3.2" stroke-linecap="round"/><path d="M106 34C112 30 118 30 124 32M110 48C116 46 124 48 128 50" fill="none" stroke="#141414" stroke-width="1.8" stroke-linecap="round"/><rect x="138" y="80" width="10" height="12" fill="#b8322a"/>`) },
    { id: 'spraypaint', name: 'Spray paint', aka: 'graffiti, street art',
      desc: 'Paint from an aerosol can: bold fills, soft overspray halos and the occasional drip. Loud, urban and rebellious.',
      spot: 'fuzzy overspray around hard shapes, drips running down, chunky outlined letters, painted on walls',
      ref: 'Banksy stencils, New York subway graffiti',
      prompt: 'spray-painted graffiti style: bold outlined lettering, soft overspray, paint drips on a concrete wall',
      ex: sv(`<defs><filter id="mdsp" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter></defs><rect width="160" height="100" fill="#8d9097"/>` + [0, 1, 2, 3].map(r => `<path d="M0 ${r * 25}H160" stroke="#7b7e85" stroke-width="1"/>`).join('') + `<text x="80" y="64" fill="#ff3d8b" style="font:900 40px Impact,'Arial Black',sans-serif;letter-spacing:2px" text-anchor="middle" filter="url(#mdsp)" opacity=".7">WOW</text><text x="80" y="62" fill="#ff5fa2" stroke="#111" stroke-width="2.4" paint-order="stroke" style="font:900 38px Impact,'Arial Black',sans-serif;letter-spacing:2px" text-anchor="middle">WOW</text>` + [[52, 62, 14], [76, 62, 22], [108, 62, 10]].map(([x, y, l]) => `<path d="M${x} ${y}v${l}" stroke="#ff5fa2" stroke-width="1.6"/><circle cx="${x}" cy="${y + l}" r="1.6" fill="#ff5fa2"/>`).join('')) },
    { id: 'digitalpaint', name: 'Digital painting', aka: 'concept art, painterly digital',
      desc: 'Painting done on a tablet with software brushes. Can mimic any medium; its own look is smooth blends, soft brushes and bright, glowing light.',
      spot: 'very smooth blends, soft round-brush edges, saturated glowing light and rim highlights, crisp detail only where it matters',
      ref: 'video-game concept art, ArtStation, Procreate',
      prompt: 'painterly digital concept art: soft brushes, smooth blends, glowing atmospheric light',
      ex: sv(`<defs><linearGradient id="mddp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e3a6b"/><stop offset=".7" stop-color="#7fb6d6"/><stop offset="1" stop-color="#f5d9a8"/></linearGradient><filter id="mddb"><feGaussianBlur stdDeviation="4"/></filter></defs><rect width="160" height="100" fill="url(#mddp)"/><g filter="url(#mddb)"><ellipse cx="50" cy="30" rx="30" ry="8" fill="#e8f1f7" opacity=".7"/><ellipse cx="120" cy="40" rx="26" ry="6" fill="#e8f1f7" opacity=".5"/><circle cx="118" cy="70" r="16" fill="#ffe7b0" opacity=".9"/></g><path d="M0 100L0 76C20 70 30 54 46 50C60 46 70 60 76 72C84 66 96 72 104 100Z" fill="#162236"/><path d="M46 50C60 46 70 60 76 72" fill="none" stroke="#ffd58a" stroke-width="1.8" stroke-linecap="round"/>`) }
  ]
});

pool.groups.find(g => g.id === 'mood').terms.push(
  { id: 'travelposter', name: 'Vintage travel poster', aka: 'WPA poster, National Parks poster, retro screen-print poster',
    desc: 'The look of 1930s to 50s travel and parks posters, recently revived: big simple shapes, a handful of flat inks, halftone and grain for shading, and a strong sense of place.',
    spot: '3 to 5 flat inks (often orange, teal and cream), halftone or stipple gradients, bold silhouettes, slightly worn paper',
    ref: 'WPA National Parks posters, Fifty-Nine Parks prints',
    prompt: 'vintage travel-poster style: limited palette of flat screen-print inks, halftone and grain shading, bold simple silhouettes, warm paper texture',
    ex: (() => { const r = rng(40); let o = `<defs><clipPath id="tvsun"><circle cx="80" cy="62" r="34"/></clipPath></defs><rect width="160" height="100" fill="#f1e4c6"/><rect x="6" y="6" width="148" height="88" fill="#5aa9a4"/>` + [...Array(37)].map((_, i) => [...Array(9)].map((_, j) => { const x = 8 + i * 4 + (j % 2) * 2, y = 32 + j * 3.5; const rr = Math.max(0, (y - 30) / 32) * 1.6; return rr > .2 ? `<circle cx="${x}" cy="${f1(y)}" r="${f1(rr)}" fill="#f1e4c6"/>` : ''; }).join('')).join('') + `<circle cx="80" cy="62" r="34" fill="#f2a93b"/><g clip-path="url(#tvsun)">` + [...Array(18)].map((_, i) => [...Array(12)].map((_, j) => { const x = 46 + i * 3.9 + (j % 2) * 1.95, y = 28 + j * 3.6; const rr = Math.max(0, 1.6 - Math.hypot(x - 80, y - 70) / 26); return rr > .2 ? `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rr)}" fill="#d9661f"/>` : ''; }).join('')).join('') + `</g><rect x="6" y="66" width="148" height="28" fill="#1f5e66"/>`; for (let i = 0; i < 26; i++) { const y = 68 + r() * 24, w = 4 + r() * 14 * (1 - Math.abs(y - 68) / 40), x = 80 - 26 + r() * 52 - w / 2; o += `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="1.4" rx=".7" fill="${pick(r, ['#f2a93b', '#f6c76a'])}"/>`; } o += `<polygon points="78,40 78,74 66,74" fill="#fbecc6"/><polygon points="80,44 80,74 90,74" fill="#f6dca0"/><rect x="77.6" y="38" width="1.4" height="38" fill="#173f45"/><path d="M64 75H94L90 79H68Z" fill="#173f45"/><text x="80" y="18" fill="#f1e4c6" style="font:800 8px var(--display);letter-spacing:.3em" text-anchor="middle">GOLDEN HOUR</text>`; return sv(o); })() }
);

/* ---------- terms found in a real prompt ---------- */
pool.groups.find(g => g.id === 'layout').terms.push(
  { id: 'leadinglines', name: 'Leading lines', aka: 'directional lines, visual path',
    desc: 'A line in the picture, like a road, river, fence or reflection, that carries the eye from the edge of the frame to the subject.',
    spot: 'a road, shoreline or beam of light that starts near the bottom edge and runs straight to the thing you look at first',
    ref: 'a sun reflection running across water to a boat, railway tracks into the distance',
    prompt: 'use leading lines: a road or reflection runs from the bottom of the frame straight to the subject',
    ex: sv(`<rect width="160" height="44" class="x1l" opacity=".5"/><rect y="44" width="160" height="56" class="gr"/><polygon points="78,44 82,44 124,100 36,100" class="x2" opacity=".85"/><path d="M80 48V96" stroke="var(--xs)" stroke-width="1.6" stroke-dasharray="4 4"/><circle cx="80" cy="38" r="7" class="x2"/><rect x="77" y="52" width="6" height="5" rx="1" class="ik"/>`) }
);
pool.groups.find(g => g.id === 'principles').terms.push(
  { id: 'scalecontrast', name: 'Scale contrast', aka: 'tiny figure, sense of scale, the small subject',
    desc: 'Something very small set against something enormous. The size gap is the story: awe, loneliness, ambition or danger, depending on the mood.',
    spot: 'a speck of a person, boat or house dwarfed by a sun, mountain, wave or empty sky',
    ref: 'Caspar David Friedrich, Hokusai\'s Great Wave, a lone sailboat under a giant sun',
    prompt: 'extreme scale contrast: a tiny subject dwarfed by an enormous shape that fills the frame',
    ex: sv(`<rect width="160" height="100" class="x1l" opacity=".35"/><circle cx="80" cy="56" r="44" class="x2" opacity=".9"/><rect y="62" width="160" height="38" class="x1"/><polygon points="58,74 58,64 54,74" class="sf"/><rect x="51" y="74" width="10" height="2" rx="1" class="ik"/>`) },
  { id: 'visualmetaphor', name: 'Visual metaphor', aka: 'symbolism, concept image',
    desc: 'The picture stands for an idea it never says out loud. A door in an empty field means a new start; sailing into the sun means leaving for good.',
    spot: 'an ordinary object placed where it does not belong, or an action that clearly means more than itself',
    ref: 'New Yorker covers, Magritte, album art',
    prompt: 'built around one clear visual metaphor for [idea], shown without any text',
    ex: sv(`<defs><radialGradient id="vmg"><stop offset="0" stop-color="var(--x2)"/><stop offset="1" stop-color="var(--x2)" stop-opacity="0"/></radialGradient></defs><rect width="160" height="100" class="x1l" opacity=".35"/><rect y="74" width="160" height="26" class="gr"/><ellipse cx="80" cy="60" rx="46" ry="34" fill="url(#vmg)" opacity=".7"/><rect x="66" y="28" width="28" height="48" class="ik"/><rect x="70" y="32" width="20" height="42" class="x2"/><polygon points="70,74 90,74 104,98 56,98" class="x2" opacity=".45"/><circle cx="46" cy="66" r="3" class="ik"/><rect x="44.5" y="69" width="3" height="8" rx="1.5" class="ik"/>`) }
);
pool.groups.find(g => g.id === 'technique').terms.push(
  { id: 'spotcolor', name: 'Spot color separation', aka: 'ink layers, color separations, flat inks',
    desc: 'The image is split into a few solid inks, each printed as its own layer. Naming the exact inks, and what each one is used for, gives you tight control over the palette.',
    spot: 'every color is one of a handful of flat inks; shading comes from dots or grain, never from blending',
    ref: 'screen prints, risograph, "five ink layers: amber, teal, gold, bone, pine"',
    prompt: 'flat color separation in [N] spot inks: [ink] for [use], [ink] for [use]; no blended gradients',
    ex: sv(`<g transform="translate(6 30)"><rect width="30" height="30" fill="#fff" stroke="var(--line)"/><circle cx="15" cy="17" r="10" fill="#f2a93b"/></g><g transform="translate(42 30)"><rect width="30" height="30" fill="#fff" stroke="var(--line)"/><rect y="18" width="30" height="12" fill="#1f5e66"/></g><g transform="translate(78 30)"><rect width="30" height="30" fill="#fff" stroke="var(--line)"/><polygon points="15,6 15,24 8,24" fill="#3a2a1a"/></g><text x="39" y="49" class="dts">+</text><text x="75" y="49" class="dts">+</text><text x="113" y="49" class="dts">=</text><g transform="translate(120 26)"><rect width="36" height="38" fill="#f1e4c6"/><circle cx="18" cy="21" r="12" fill="#f2a93b"/><rect y="24" width="36" height="14" fill="#1f5e66"/><polygon points="18,10 18,30 10,30" fill="#3a2a1a"/></g><text x="21" y="74" class="dts">ink 1</text><text x="57" y="74" class="dts">ink 2</text><text x="93" y="74" class="dts">ink 3</text><text x="138" y="74" class="dts">print</text>`) },
  { id: 'lostedges', name: 'Lost and found edges', aka: 'dissolving edges, soft vs hard edges',
    desc: 'Some edges are crisp ("found") and others melt into what is behind them ("lost"). It makes light feel bright and lets a subject sink into its surroundings.',
    spot: 'a shape that is sharp on one side and vanishes into a glow or shadow on the other',
    ref: 'John Singer Sargent, a mast dissolving into the sun, figures fading into fog',
    prompt: 'lost and found edges: the subject\'s outline is crisp at the bottom and dissolves into the light at the top',
    ex: sv(`<defs><linearGradient id="leg" x1="0" y1="1" x2="0" y2="0"><stop offset=".35" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><mask id="lem"><rect width="160" height="100" fill="url(#leg)"/></mask><radialGradient id="lesun" cx=".5" cy=".3" r=".7"><stop offset="0" stop-color="#ffe2a0"/><stop offset="1" stop-color="#f2a93b"/></radialGradient></defs><rect width="160" height="100" fill="url(#lesun)"/><rect y="78" width="160" height="22" fill="#1f5e66"/><g mask="url(#lem)"><polygon points="80,14 80,76 52,76" fill="#fbf3df"/><rect x="79" y="10" width="2.4" height="68" fill="#173f45"/></g><path d="M48 77H100L95 84H54Z" fill="#173f45"/>`) }
);

/* ---------- readings: real prompts, annotated with workbook terms ---------- */
const READINGS = [];

/* ---------- round 7: color theory, composition, camera, charts, brand, animation, games, type detail ---------- */
const wheel = (sel, lines) => {
  const P = i => { const a = (i * 30 - 90) * Math.PI / 180; return [80 + 34 * Math.cos(a), 50 + 34 * Math.sin(a)]; };
  let o = lines ? `<path d="${lines.map(([a, b]) => `M${pts([P(a)])}L${pts([P(b)])}`).join('')}" stroke="var(--ink)" stroke-width="1.2" fill="none"/>` : '';
  for (let i = 0; i < 12; i++) { const [x, y] = P(i), on = sel.includes(i); o += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${on ? 8.5 : 5.5}" fill="hsl(${i * 30} 78% 56%)"${on ? ' stroke="var(--ink)" stroke-width="1.6"' : ' opacity=".55"'}/>`; }
  return sv(o);
};
const swatchRow = (y, cols, h = 22) => cols.map((c, i) => `<rect x="${12 + i * (136 / cols.length)}" y="${y}" width="${136 / cols.length - 2}" height="${h}" rx="3" fill="${c}"/>`).join('');
const goldSpiral = () => {
  let x = 12, y = 8, w = 136, h = 84.05, d = `M${x} ${y + h}`, sq = '';
  const R = (a, b, s) => `<rect x="${f1(a)}" y="${f1(b)}" width="${f1(s)}" height="${f1(s)}" fill="none" stroke="var(--g3)" stroke-width=".8"/>`;
  for (let i = 0; i < 9; i++) {
    const k = i % 4; let s;
    if (k === 0) { s = h; sq += R(x, y, s); d += `A${f1(s)} ${f1(s)} 0 0 1 ${f1(x + s)} ${f1(y)}`; x += s; w -= s; }
    else if (k === 1) { s = w; sq += R(x, y, s); d += `A${f1(s)} ${f1(s)} 0 0 1 ${f1(x + s)} ${f1(y + s)}`; y += s; h -= s; }
    else if (k === 2) { s = h; sq += R(x + w - s, y, s); d += `A${f1(s)} ${f1(s)} 0 0 1 ${f1(x + w - s)} ${f1(y + s)}`; w -= s; }
    else { s = w; sq += R(x, y + h - s, s); d += `A${f1(s)} ${f1(s)} 0 0 1 ${f1(x)} ${f1(y + h - s)}`; h -= s; }
  }
  return { sq, d, eye: [x + w / 2, y + h / 2] };
};
const ridge = (y0, amp, seed, fill) => { const r = rng(seed); let p = `M0 100L0 ${y0}`; for (let x = 0; x <= 160; x += 10) p += `L${x} ${f1(y0 - r() * amp)}`; return `<path d="${p}L160 100Z" fill="${fill}"/>`; };
const axes = `<path d="M18 10V86H150" class="sm"/>`;

pool.groups.push({
  id: 'colortheory', title: 'Color theory', slot: 'Color',
  intro: 'The three dials every color has (hue, saturation, value) and the classic ways to pick colors that work together. Useful when "make it pop" isn\'t specific enough.',
  terms: [
    { id: 'hue', name: 'Hue', aka: 'the color family',
      desc: 'Which color it is: red, orange, blue and so on, as a position around the color wheel. Changing hue changes the color itself, not how strong or light it is.',
      ref: '"shift the hue toward teal", "same hue, lighter"',
      prompt: 'keep all colors within a narrow hue range around [color]',
      ex: sv(swatchRow(30, [0, 30, 60, 120, 180, 210, 260, 310].map(h => `hsl(${h} 72% 56%)`), 40) + `<text x="80" y="86" class="dts">hue: which color</text>`) },
    { id: 'saturation', name: 'Saturation', aka: 'chroma, intensity, vividness',
      desc: 'How pure or strong a color is, from gray to vivid. Low saturation feels calm and grown-up; high saturation feels loud and energetic.',
      spot: 'the same color looks either dusty and grayish or electric and pure',
      ref: 'desaturated film looks vs bright kids\' brands',
      prompt: 'low-saturation palette with one fully saturated accent',
      ex: sv(swatchRow(30, [0, 15, 30, 50, 70, 90].map(s => `hsl(210 ${s}% 52%)`), 40) + `<text x="80" y="86" class="dts">gray → vivid</text>`) },
    { id: 'valuekey', name: 'Value', aka: 'lightness, tonal value, value structure',
      desc: 'How light or dark a color is, ignoring its hue. Artists say value does the work and color gets the credit: a picture with clear light and dark shapes reads well even in black and white.',
      spot: 'squint or turn the image grayscale; strong images still show clear big shapes',
      ref: '"squint test", notan studies',
      prompt: 'strong value structure: clear separation of lights and darks that reads even in grayscale',
      ex: sv(swatchRow(18, [18, 32, 46, 60, 74, 88].map(l => `hsl(210 60% ${l}%)`), 26) + swatchRow(50, [18, 32, 46, 60, 74, 88].map(l => `hsl(0 0% ${l}%)`), 26) + `<text x="80" y="90" class="dts">dark → light, with and without color</text>`) },
    { id: 'tintshade', name: 'Tints, tones & shades', aka: 'adding white, gray or black',
      desc: 'A tint is a color mixed with white (lighter, softer). A shade is mixed with black (deeper, richer). A tone is mixed with gray (muted). Asking for "tints of one blue" keeps a palette unified.',
      ref: 'pastels are tints, jewel tones lean toward shades',
      prompt: 'palette built from tints and shades of a single [color]',
      ex: sv([['tint', i => `hsl(27 82% ${55 + i * 7}%)`], ['tone', i => `hsl(27 ${82 - i * 14}% 55%)`], ['shade', i => `hsl(27 82% ${55 - i * 8}%)`]].map(([n, c], r) => [0, 1, 2, 3, 4, 5].map(i => `<rect x="${44 + i * 18}" y="${14 + r * 26}" width="16" height="20" rx="3" fill="${c(i)}"/>`).join('') + `<text x="38" y="${27 + r * 26}" class="dts" style="text-anchor:end">${n}</text>`).join('')) },
    { id: 'triadic', name: 'Triadic', aka: 'three-way color scheme',
      desc: 'Three colors evenly spaced around the wheel, like red, yellow and blue. Playful and balanced; usually one leads and the other two support.',
      ref: 'primary-color toys, Bauhaus posters, Burger King',
      prompt: 'triadic color scheme of [color], [color] and [color], with one dominant',
      ex: wheel([0, 4, 8], [[0, 4], [4, 8], [8, 0]]) },
    { id: 'splitcomp', name: 'Split-complementary', aka: 'split complement',
      desc: 'One main color plus the two colors on either side of its opposite. You get the punch of complementary colors with less clash.',
      ref: 'blue with orange-red and yellow-orange accents',
      prompt: 'split-complementary palette: [main color] with the two neighbors of its complement as accents',
      ex: wheel([0, 5, 7], [[0, 5], [0, 7]]) }
  ]
});

pool.groups.push({
  id: 'composition', title: 'Composition & depth', slot: 'Composition',
  intro: 'How a picture is arranged in space: what is near, what is far, what frames what, and the shape of the frame itself.',
  terms: [
    { id: 'depthlayers', name: 'Foreground, midground, background', aka: 'depth layers, planes',
      desc: 'Splitting a scene into a near layer, a middle layer and a far layer. Even flat illustrations feel deep when each layer is clearly separate.',
      spot: 'something close at the edge of the frame, the subject in the middle, scenery far behind',
      ref: 'landscape painting, parallax game backgrounds, boat, sun)',
      prompt: 'clear foreground, midground and background layers: [near thing] in front, [subject] in the middle, [scenery] behind',
      ex: sv(`<rect width="160" height="100" fill="#dbe7ef"/>` + ridge(48, 14, 3, '#a9bfd0') + ridge(66, 10, 8, '#6f8fa6') + `<path d="M0 100V78Q40 70 80 82T160 76V100Z" fill="#2f4a5c"/><path d="M14 100V44L6 70H22L14 44" fill="#1d3240"/><polygon points="14,30 2,62 26,62" fill="#1d3240"/><text x="150" y="40" class="dts" style="text-anchor:end">background</text><text x="150" y="62" class="dts" style="fill:#fff;text-anchor:end">midground</text><text x="150" y="94" class="dts" style="fill:#fff;text-anchor:end">foreground</text>`) },
    { id: 'atmos', name: 'Atmospheric perspective', aka: 'aerial perspective, haze',
      desc: 'Far-away things look lighter, bluer and lower in contrast because of air and haze. Fading the distant layers is the quickest way to add depth.',
      spot: 'mountain ridges that get paler and bluer the further back they are',
      ref: 'Chinese landscape painting, Smoky Mountains, Firewatch',
      prompt: 'atmospheric perspective: distant layers fade lighter and bluer with lower contrast',
      ex: sv(`<rect width="160" height="100" fill="#eef2f6"/>` + [[40, '#cfdbe6', 1], [54, '#a7bccf', 2], [68, '#7895ad', 5], [82, '#45627a', 9]].map(([y, c, s]) => ridge(y, 16, s, c)).join('')) },
    { id: 'framewithin', name: 'Frame within a frame', aka: 'natural framing, doorway shot',
      desc: 'Using something in the scene, like a doorway, window, arch or branches, to put a border around the subject. It focuses attention and adds depth.',
      ref: 'Wes Anderson doorways, The Searchers, cave-mouth shots',
      prompt: 'frame-within-a-frame composition: the subject seen through a [doorway, window, arch]',
      ex: sv(`<rect width="160" height="100" fill="#2a2420"/><path d="M50 100V44A30 30 0 0 1 110 44V100Z" fill="#f2c27a"/><rect x="50" y="76" width="60" height="24" fill="#d99a4e"/>` + person(84, 74, 4, '#2a2420')) },
    { id: 'tightcrop', name: 'Tight crop', aka: 'cropping, bleed, breaking the frame',
      desc: 'Letting the subject run off the edges instead of fitting it neatly inside. Feels bold, close and confident; showing everything feels distant and safe.',
      spot: 'the subject is cut off by one or more edges of the frame',
      ref: 'fashion editorials, Apple product shots, album covers',
      prompt: 'tight crop: the subject fills the frame and bleeds off the edges',
      ex: sv(`<rect width="160" height="100" class="x2l"/><circle cx="96" cy="58" r="56" class="x2"/><circle cx="78" cy="48" r="6" class="ik"/><circle cx="118" cy="48" r="6" class="ik"/><path d="M84 74Q98 86 112 74" class="st" stroke-width="3"/>`) },
    { id: 'aspect', name: 'Aspect ratio', aka: 'frame shape, 16:9, 4:5, 9:16',
      desc: 'The width-to-height shape of the frame. It changes what fits and how it feels: wide is cinematic, square is calm, tall is phone-native.',
      ref: '21:9 cinema, 16:9 video, 1:1 and 4:5 for feeds, 9:16 for stories and reels',
      prompt: 'composed for a [16:9 / 4:5 / 9:16] aspect ratio',
      ex: sv([['21:9', 6, 49, 21], ['16:9', 62, 40, 22.5], ['1:1', 110, 24, 24], ['9:16', 140, 18, 32]].map(([n, x, w, h]) => `<rect x="${x}" y="${50 - h / 2}" width="${w}" height="${h}" rx="2" class="x1l" stroke="var(--x1)"/><text x="${x + w / 2}" y="${50 + h / 2 + 10}" class="dts">${n}</text>`).join('')) },
    { id: 'odds', name: 'Rule of odds', aka: 'odd-number grouping',
      desc: 'Groups of three or five look more natural and interesting than pairs or fours, because the eye can\'t split them into neat halves.',
      ref: 'three trees, three products, five flowers in a vase',
      prompt: 'group the [objects] in threes following the rule of odds',
      ex: sv(`<rect y="78" width="160" height="22" class="gr"/>` + [[56, 30], [80, 44], [104, 34]].map(([x, h]) => `<rect x="${x - 2}" y="${78 - h * .35}" width="4" height="${h * .35}" class="x3d"/><circle cx="${x}" cy="${78 - h * .35 - h * .3}" r="${h * .35}" class="x3"/>`).join('')) },
    { id: 'goldenratio', name: 'Golden ratio', aka: 'golden spiral, Fibonacci spiral, 1.618',
      desc: 'A proportion (about 1 to 1.618) that shows up in nature and classical art. As a composition guide, the subject sits at the tight end of a spiral.',
      ref: 'Renaissance painting, shells, many logo grids',
      prompt: 'golden-ratio composition, subject placed at the eye of the spiral',
      ex: (() => { const g = goldSpiral(); return sv(`<rect x="12" y="8" width="136" height="84" class="x1l" opacity=".35"/>${g.sq}<path d="${g.d}" class="sx1"/><circle cx="${f1(g.eye[0])}" cy="${f1(g.eye[1])}" r="5" class="x2"/>`); })() }
  ]
});

pool.groups.push({
  id: 'camera', title: 'Camera & lens', slot: 'Lens',
  intro: 'What the lens does to space. Focal length is the big one: it decides whether the background looks huge and close or small and far away.',
  terms: [
    { id: 'telephoto', name: 'Telephoto compression', aka: 'long lens, 200mm, flattened perspective',
      desc: 'A long lens shot from far away makes distant things look huge and stacked right behind the subject. It\'s how photographers get a giant sun or moon behind a tiny figure.',
      spot: 'background objects look enormous and close; layers look flat and stacked',
      ref: 'giant-moon photos, heat-haze desert shots',
      prompt: 'shot on a long telephoto lens, compressed perspective, enormous sun stacked behind the subject',
      ex: sv(`<rect x="4" y="6" width="72" height="78" rx="4" fill="#f6e3c2"/><circle cx="40" cy="44" r="6" fill="#f2a93b"/><rect x="4" y="50" width="72" height="34" fill="#2f6f73"/><rect x="84" y="6" width="72" height="78" rx="4" fill="#f6e3c2"/><circle cx="120" cy="52" r="36" fill="#f2a93b"/><rect x="84" y="50" width="72" height="34" fill="#2f6f73"/>` + [[28, 64], [114, 64]].map(([x, y]) => `<polygon points="${x},${y - 9} ${x},${y} ${x - 6},${y}" fill="#fbecc6"/><rect x="${x - 7}" y="${y}" width="10" height="2" fill="#173f45"/>`).join('') + `<text x="40" y="94" class="dts">24mm</text><text x="120" y="94" class="dts">200mm</text>`) },
    { id: 'wideangle', name: 'Wide-angle', aka: '16–24mm, exaggerated perspective',
      desc: 'A short lens that fits a lot in and stretches space: close things look big, far things look tiny, and lines rush toward the center.',
      spot: 'strong converging lines, a huge nearby object, a small distant background',
      ref: 'real-estate interiors, skateboarding videos, action-cam footage',
      prompt: 'wide-angle lens, exaggerated perspective with lines rushing to the center',
      ex: sv(`<rect width="160" height="100" class="x1l" opacity=".35"/><polygon points="0,0 60,38 60,58 0,100" class="x1"/><polygon points="160,0 100,38 100,58 160,100" class="x1d"/><polygon points="0,100 60,58 100,58 160,100" class="gr"/>` + [0, 1, 2, 3].map(i => `<path d="M${f1(60 - 60 * (i + 1) / 5)} ${f1(38 - 38 * (i + 1) / 5)}V${f1(58 + 42 * (i + 1) / 5)}M${f1(100 + 60 * (i + 1) / 5)} ${f1(38 - 38 * (i + 1) / 5)}V${f1(58 + 42 * (i + 1) / 5)}" stroke="var(--xs)" stroke-opacity=".5"/>`).join('') + `<circle cx="80" cy="48" r="3" class="x2"/>`) },
    { id: 'fisheye', name: 'Fisheye', aka: 'barrel distortion, ultra-wide',
      desc: 'An extreme wide lens that bends straight lines into curves and fits almost half the world into one round image. Playful, skate-video, 90s music-video energy.',
      spot: 'a curved horizon and straight lines bowing outward from the center',
      ref: '90s hip-hop videos, skate photography, peephole views',
      prompt: 'fisheye lens with strong barrel distortion and a curved horizon',
      ex: sv(`<defs><clipPath id="fishc"><circle cx="80" cy="50" r="44"/></clipPath></defs><rect width="160" height="100" class="ik"/><g clip-path="url(#fishc)"><rect width="160" height="100" fill="#9cc7e8"/><path d="M20 60Q80 40 140 60V100H20Z" fill="#6f9a5a"/>` + [-2, -1, 1, 2].map(i => `<path d="M${80 + i * 18} 0Q${80 + i * 30} 50 ${80 + i * 18} 100" stroke="#fff" stroke-opacity=".7" fill="none"/>`).join('') + `<path d="M80 0V100" stroke="#fff" stroke-opacity=".7"/></g>`) },
    { id: 'lensflare', name: 'Lens flare', aka: 'sun flare, anamorphic streak',
      desc: 'Bright light bouncing inside the lens, showing up as a streak and a line of soft colored circles. Signals "real camera" and sunny warmth, or sci-fi when overdone.',
      ref: 'J.J. Abrams films, summer ads, golden-hour portraits',
      prompt: 'subtle lens flare from the sun in the corner, soft circular ghosts and a horizontal anamorphic streak',
      ex: sv(`<defs><linearGradient id="lfsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b3c6b"/><stop offset="1" stop-color="#e98a4b"/></linearGradient><radialGradient id="lfsun"><stop offset="0" stop-color="#fff"/><stop offset=".3" stop-color="#fff6d8" stop-opacity=".9"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient></defs><rect width="160" height="100" fill="url(#lfsky)"/><path d="M0 80Q50 70 90 82T160 76V100H0Z" fill="#1d2440"/><ellipse cx="124" cy="22" rx="70" ry="1.4" fill="#cfe3ff" opacity=".7"/><circle cx="124" cy="22" r="26" fill="url(#lfsun)"/>` + [[100, 36, 5, '#9fd0ff', .35], [86, 45, 9, '#ffd59a', .25], [66, 57, 4, '#b8ffd9', .4], [48, 68, 12, '#c9a2ff', .18], [34, 76, 6, '#ffb0a0', .3]].map(([x, y, r, c, o]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity="${o}"/>`).join('')) }
  ]
});

pool.groups.find(g => g.id === 'photo').terms.push(
  { id: 'backlit', name: 'Backlit', aka: 'contre-jour, shooting into the sun',
    desc: 'The light source sits behind the subject, facing the camera. Edges glow, the air looks hazy, and the subject drops toward silhouette. Warm, dreamy and a little nostalgic.',
    spot: 'the sun or a window behind the subject, a bright halo around hair and edges, lifted haze',
    ref: 'golden-hour portraits, Terrence Malick',
    prompt: 'backlit, contre-jour lighting: the sun directly behind the subject, glowing rim and soft haze',
    ex: sv(`<defs><radialGradient id="blsun" cx=".55" cy=".45" r=".6"><stop offset="0" stop-color="#fffbe8"/><stop offset=".25" stop-color="#ffe2a0"/><stop offset="1" stop-color="#e98a4b"/></radialGradient></defs><rect width="160" height="100" fill="url(#blsun)"/><path d="M0 84Q60 78 160 86V100H0Z" fill="#7a4a2a"/><g stroke="#fff6d0" stroke-width="2.4" fill="#4a2c1a">${person(88, 74, 8, '#4a2c1a')}</g>${person(88, 74, 8, '#4a2c1a')}`) }
);
pool.groups.find(g => g.id === 'technique').terms.push(
  { id: 'misregistration', name: 'Misregistration', aka: 'off-register, print offset',
    desc: 'When the ink layers of a print don\'t line up exactly, leaving slivers of paper and color peeking out at the edges. A small amount reads as handmade and authentic.',
    spot: 'a thin white or colored gap along one side of shapes, outlines sitting slightly off their fills',
    ref: 'risograph zines, vintage comics, gig posters',
    prompt: 'slight misregistration between ink layers, thin slivers of paper showing at the edges',
    ex: sv(`<rect width="160" height="100" fill="#f6efe2"/><circle cx="60" cy="50" r="26" fill="#f2a93b"/><circle cx="63" cy="47" r="26" fill="none" stroke="#1f5e66" stroke-width="3"/><rect x="96" y="24" width="44" height="52" fill="#e1527a"/><rect x="99" y="21" width="44" height="52" fill="none" stroke="#1f5e66" stroke-width="3"/><rect x="104" y="36" width="34" height="8" fill="#1f5e66"/>`) },
  { id: 'overprint', name: 'Overprint', aka: 'multiply, transparent inks',
    desc: 'Printing one ink on top of another so they mix where they overlap, making a third color for free. Designers plan these overlaps on purpose.',
    spot: 'see-through colored shapes, with a darker mixed color where two overlap',
    ref: 'risograph prints, Swiss posters, Saul Bass',
    prompt: 'overprinted transparent inks that mix into new colors where shapes overlap',
    ex: sv(`<rect width="160" height="100" fill="#f6efe2"/><g style="mix-blend-mode:multiply"><circle cx="64" cy="44" r="26" fill="#ff6b8b"/><circle cx="96" cy="44" r="26" fill="#3fb6e0"/><circle cx="80" cy="66" r="26" fill="#ffd23f"/></g>`) }
);
pool.groups.find(g => g.id === 'texture').terms.push(
  { id: 'uncoated', name: 'Uncoated paper', aka: 'matte stock, toothy paper, ink soak',
    desc: 'Paper without a glossy coating. Ink sinks in, so colors are softer and slightly muted, edges are a touch fuzzy, and the paper fibers show. The opposite of a shiny magazine page.',
    spot: 'muted colors, no shine, faint fibers and a soft, slightly bleeding ink edge',
    ref: 'letterpress cards, art prints, Kinfolk magazine',
    prompt: 'printed on uncoated matte paper: inks soaked in and slightly muted, soft edges, visible paper tooth',
    ex: sv(`<defs><filter id="ucsoft" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="2.2"/></filter>${noiseFx('ucgrain', .8, .22, '.35 .3 .25', 5)}<linearGradient id="ucgl" x1="0" y1="0" x2="1" y2="1"><stop offset=".3" stop-color="#fff" stop-opacity="0"/><stop offset=".45" stop-color="#fff" stop-opacity=".55"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><rect x="4" y="6" width="72" height="78" rx="3" fill="#fbfbfb"/><circle cx="40" cy="45" r="24" fill="#f08a1c"/><rect x="4" y="6" width="72" height="78" rx="3" fill="url(#ucgl)"/><rect x="84" y="6" width="72" height="78" rx="3" fill="#efe8da"/><circle cx="120" cy="45" r="24" fill="#d98a48" filter="url(#ucsoft)"/><rect x="84" y="6" width="72" height="78" rx="3" filter="url(#ucgrain)"/><text x="40" y="94" class="dts">coated</text><text x="120" y="94" class="dts">uncoated</text>`) }
);

pool.groups.push({
  id: 'charts', title: 'Charts & data', slot: 'Chart',
  intro: 'Picking the chart is picking the question: compare amounts, show change over time, show a relationship, or show parts of a whole.',
  terms: [
    { id: 'barchart', name: 'Bar chart', aka: 'column chart',
      desc: 'Bars whose length shows an amount. The clearest way to compare categories; highlight one bar to make the point.',
      ref: 'revenue by region, votes by option',
      prompt: 'clean bar chart, one highlighted bar, others in muted gray, direct value labels',
      ex: sv(axes + [34, 50, 26, 62, 42, 30].map((h, i) => `<rect x="${28 + i * 20}" y="${86 - h}" width="13" height="${h}" rx="1.5" class="${i === 3 ? 'x1' : 'gr'}"/>`).join('')) },
    { id: 'linechart', name: 'Line chart', aka: 'trend line, time series',
      desc: 'Points over time joined by a line. Best for trends, growth and change; a soft fill under the line makes it an area chart.',
      ref: 'stock prices, weekly active users',
      prompt: 'line chart of [metric] over time, soft area fill under the line, end point labeled',
      ex: (() => { const ys = [70, 64, 66, 52, 56, 40, 34, 22]; const P = ys.map((y, i) => [24 + i * 17.5, y]); return sv(axes + `<path d="M${pts(P).replace(/ /g, 'L')}L146.5 86L24 86Z" class="x1l" opacity=".45"/><path d="M${pts(P).replace(/ /g, 'L')}" class="sx1"/><circle cx="146.5" cy="22" r="3.5" class="x1"/>`); })() },
    { id: 'scatter', name: 'Scatter plot', aka: 'correlation chart, dot plot',
      desc: 'One dot per item, placed by two values. Shows whether two things move together, plus clusters and outliers.',
      ref: 'price vs rating, height vs weight',
      prompt: 'scatter plot with a faint trend line and outliers highlighted',
      ex: (() => { const r = rng(12); let o = axes + `<path d="M24 78L146 22" class="sm dash"/>`; for (let i = 0; i < 34; i++) { const x = 26 + r() * 118, y = 78 - (x - 24) * .46 + (r() - .5) * 24; o += `<circle cx="${f1(x)}" cy="${f1(y)}" r="2.3" class="x1" opacity=".75"/>`; } return sv(o + `<circle cx="120" cy="72" r="3" class="x4"/>`); })() },
    { id: 'sparkline', name: 'Sparkline & KPI', aka: 'big number, stat card',
      desc: 'One big number with a tiny inline chart and a change indicator. The workhorse of dashboards: the headline first, the trend at a glance.',
      ref: 'Stripe dashboard, Google Analytics overview',
      prompt: 'KPI stat cards: big number, small label, green or red delta and an inline sparkline',
      ex: sv(panel(16, 18, 128, 64) + `<text x="28" y="38" class="dts" style="text-anchor:start">Weekly users</text><text x="28" y="62" style="font:700 20px var(--display);fill:var(--ink)">12,840</text><text x="28" y="74" style="font:600 7px var(--mono);fill:var(--ok)">▲ 8.2%</text><path d="M96 66L102 60L108 63L114 52L120 56L126 44L132 40" fill="none" stroke="var(--ok)" stroke-width="1.6" stroke-linejoin="round"/>`) },
    { id: 'donut', name: 'Donut chart', aka: 'pie chart, ring chart',
      desc: 'A ring split into slices of a whole. Fine for two or three parts; past that, a bar chart reads better.',
      ref: 'storage used, budget split',
      prompt: 'donut chart with three segments and the total in the center',
      ex: (() => { const C = 2 * Math.PI * 30; let off = 0; return sv([[.55, 'var(--x1)'], [.28, 'var(--x2)'], [.17, 'var(--x3)']].map(([p, c]) => { const s = `<circle cx="80" cy="50" r="30" fill="none" stroke="${c}" stroke-width="14" stroke-dasharray="${f1(p * C - 1.5)} ${f1(C)}" stroke-dashoffset="${f1(-off * C)}" transform="rotate(-90 80 50)"/>`; off += p; return s; }).join('') + `<text x="80" y="54" style="font:700 11px var(--display);fill:var(--ink)" text-anchor="middle">72%</text>`); })() },
    { id: 'stackedarea', name: 'Stacked area', aka: 'stream graph, layered area',
      desc: 'Several area charts stacked on top of each other, showing both the total over time and how the parts change inside it.',
      ref: 'traffic by source, energy mix over decades',
      prompt: 'stacked area chart of [parts] over time, soft distinct colors, total on top',
      ex: (() => { const xs = [...Array(8)].map((_, i) => 20 + i * 18); const L = [[8, 10, 9, 12, 14, 13, 16, 18], [10, 12, 14, 13, 16, 18, 20, 22], [6, 8, 10, 14, 13, 16, 18, 22]]; let base = xs.map(() => 86), o = ''; L.forEach((l, k) => { const top = base.map((b, i) => b - l[i]); o += `<path d="M${xs.map((x, i) => `${x} ${top[i]}`).join('L')}L${xs.slice().reverse().map((x, i) => `${x} ${base[7 - i]}`).join('L')}Z" class="${['x1', 'x3', 'x2'][k]}" opacity=".85"/>`; base = top; }); return sv(axes + o); })() },
    { id: 'treemap', name: 'Treemap', aka: 'nested rectangles',
      desc: 'Rectangles sized by value, nested by category. Shows what takes up the most space in a hierarchy at a glance.',
      ref: 'disk usage tools, market maps (finviz)',
      prompt: 'treemap of [items] sized by value, grouped by category with subtle borders',
      ex: sv([[12, 10, 74, 50, 'x1'], [12, 62, 40, 28, 'x1l'], [54, 62, 32, 28, 'x1d'], [88, 10, 60, 32, 'x3'], [88, 44, 34, 46, 'x3l'], [124, 44, 24, 24, 'x2'], [124, 70, 24, 20, 'x2l']].map(([x, y, w, h, c]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" class="${c}" stroke="var(--tile)" stroke-width="2"/>`).join('')) }
  ]
});

pool.groups.push({
  id: 'brand', title: 'Logos & brand', slot: 'Brand',
  intro: 'The kinds of logo, and the system around a logo that makes a brand recognizable. Knowing the type of mark you want saves a lot of back-and-forth.',
  terms: [
    { id: 'wordmark', name: 'Wordmark', aka: 'logotype',
      desc: 'A logo that is just the name, set in distinctive type. Works when the name is short and memorable.',
      ref: 'Google, Coca-Cola, FedEx, Stripe',
      prompt: 'wordmark logo: the name "[name]" in a custom [geometric / serif / rounded] typeface, no symbol',
      ex: `<div class="hx typo"><div style="font:800 40px/1 var(--display);letter-spacing:-.04em;color:var(--x1)">lumen</div></div>` },
    { id: 'lettermark', name: 'Lettermark', aka: 'initials logo',
      desc: 'A logo made from the initials of a long name. Compact and strong, but says little on its own until people know the brand.',
      ref: 'IBM, HBO, CNN, NASA',
      prompt: 'lettermark logo using the initials "[ABC]", bold and compact',
      ex: `<div class="hx typo"><div style="font:900 40px/1 var(--display);letter-spacing:.06em;color:var(--panel);background:var(--ink);padding:8px 14px;border-radius:4px">KDL</div></div>` },
    { id: 'monogram', name: 'Monogram', aka: 'interlocking initials',
      desc: 'Two or three letters woven together into one shape. Feels crafted, heritage and premium.',
      ref: 'Louis Vuitton, Yankees NY, Chanel',
      prompt: 'interlocking monogram of the letters [A] and [B], elegant and symmetrical',
      ex: sv(`<circle cx="80" cy="50" r="34" fill="none" stroke="var(--x2d)" stroke-width="1.4"/><text x="72" y="66" style="font:400 46px 'Instrument Serif',Georgia,serif;fill:var(--ink)" text-anchor="middle">C</text><text x="88" y="66" style="font:400 46px 'Instrument Serif',Georgia,serif;fill:var(--x2d)" text-anchor="middle">S</text>`) },
    { id: 'pictorialmark', name: 'Pictorial mark', aka: 'logo symbol, brand icon',
      desc: 'A simple picture of a real thing standing for the brand. Strong once known, and works at tiny sizes like app icons.',
      ref: 'Apple\'s apple, the Twitter bird, Target',
      prompt: 'pictorial logo mark: a simplified [object] symbol, works at 16px',
      ex: sv(`<rect x="58" y="28" width="44" height="44" rx="11" class="x3"/><path d="M80 36C70 46 70 58 80 64C90 58 90 46 80 36Z" class="sf"/><path d="M80 44V64" stroke="var(--x3)" stroke-width="1.6"/>`) },
    { id: 'abstractmark', name: 'Abstract mark', aka: 'geometric symbol',
      desc: 'A shape that represents nothing literal but carries a feeling: motion, connection, balance. Very ownable, but needs time to earn meaning.',
      ref: 'Nike swoosh, Pepsi globe, Airbnb Bélo, Mastercard circles',
      prompt: 'abstract geometric logo mark suggesting [idea], simple enough to draw from memory',
      ex: sv(`<g style="mix-blend-mode:multiply"><circle cx="70" cy="50" r="22" fill="#eb3d3d"/><circle cx="90" cy="50" r="22" fill="#f6a623"/></g>`) },
    { id: 'emblem', name: 'Emblem', aka: 'badge, crest, seal',
      desc: 'Text and symbol locked together inside a shape, like a badge or crest. Feels official, traditional or outdoorsy; hard to shrink.',
      ref: 'Starbucks, Harley-Davidson, national parks patches, craft beer labels',
      prompt: 'emblem logo: badge shape with "[name]" around the edge and a [symbol] in the center',
      ex: sv(`<defs><path id="emarc" d="M52 50A28 28 0 0 1 108 50"/></defs><circle cx="80" cy="50" r="38" class="x3d"/><circle cx="80" cy="50" r="33" fill="none" stroke="var(--xs)" stroke-width="1"/><text style="font:700 7.5px var(--mono);letter-spacing:.2em;fill:#fff;text-anchor:middle"><textPath href="#emarc" startOffset="50%">PINE LAKE</textPath></text><polygon points="80,42 68,66 92,66" fill="#fff"/><rect x="66" y="66" width="28" height="2" fill="#fff"/><text x="80" y="78" style="font:700 5px var(--mono);letter-spacing:.2em;fill:#fff" text-anchor="middle">EST. 1974</text>`) },
    { id: 'combomark', name: 'Combination mark', aka: 'logo lockup, symbol + wordmark',
      desc: 'A symbol and a wordmark used together, side by side or stacked. The most common logo type, because each half can also stand alone.',
      ref: 'Slack, Spotify, Mastercard, Burger King',
      prompt: 'combination mark: a simple [symbol] next to the wordmark "[name]", horizontal lockup',
      ex: `<div class="hx"><svg viewBox="0 0 40 40" style="width:44px;height:44px" aria-hidden="true"><rect width="40" height="40" rx="10" fill="var(--x1)"/><circle cx="20" cy="20" r="9" fill="none" stroke="#fff" stroke-width="4"/><circle cx="27" cy="13" r="3.5" fill="var(--x2)"/></svg><div style="font:800 30px/1 var(--display);letter-spacing:-.03em;color:var(--ink)">orbit</div></div>` },
    { id: 'brandsystem', name: 'Brand identity system', aka: 'brand kit, style guide, brand guidelines',
      desc: 'Everything that makes a brand recognizable beyond the logo: colors, typefaces, patterns, photo style and rules for using them. Asking for a "system" gets you consistency across many pieces.',
      ref: 'Pentagram case studies, Mailchimp brand, Airbnb DLS',
      prompt: 'a brand identity system for [name]: logo, primary and secondary colors, type pairing, a graphic pattern and example applications',
      ex: sv(panel(8, 8, 144, 84) + `<rect x="16" y="16" width="56" height="34" rx="3" class="x1"/><circle cx="34" cy="33" r="7" fill="none" stroke="#fff" stroke-width="3"/><rect x="44" y="30" width="20" height="5" rx="2" fill="#fff"/>` + ['x1', 'x1l', 'x2', 'ik'].map((c, i) => `<rect x="${80 + i * 16}" y="16" width="13" height="13" rx="2" class="${c}"/>`).join('') + `<text x="80" y="44" style="font:800 12px var(--display);fill:var(--ink)">Aa</text><text x="100" y="44" style="font:400 12px 'Instrument Serif',serif;fill:var(--ink)">Aa</text>` + [...Array(6)].map((_, i) => `<circle cx="${22 + i * 9}" cy="${66 + (i % 2) * 8}" r="3" class="x2"/>`).join('') + `<rect x="80" y="56" width="62" height="28" rx="3" class="x1l"/><rect x="86" y="62" width="28" height="4" rx="2" class="x1d"/><rect x="86" y="70" width="20" height="3" rx="1.5" class="sf"/>`) }
  ]
});

pool.groups.push({
  id: 'animation', title: 'Animation styles', slot: 'Animation',
  intro: 'How moving pictures are made. The technique leaves a fingerprint, like the stutter of stop-motion or the thumbprints in clay, and naming it gets you that feel even in a still image.',
  terms: [
    { id: 'stopmotion', name: 'Stop-motion', aka: 'frame-by-frame puppets',
      desc: 'Real objects moved a tiny bit and photographed one frame at a time. Slightly jittery, tactile and handmade, with real light and real materials.',
      spot: 'miniature sets, fabric and felt textures, slightly stuttering motion',
      ref: 'Wes Anderson\'s Fantastic Mr. Fox, Laika (Coraline), Robot Chicken',
      prompt: 'stop-motion animation look: handmade miniature set, felt and wood textures, real shallow-focus lighting',
      ex: sv(`<rect width="160" height="100" class="ik"/>` + [0, 1, 2].map(i => `<g transform="translate(${10 + i * 48} 14)"><rect width="44" height="72" fill="#e9d8bc"/><rect y="52" width="44" height="20" fill="#8b6b4a"/><g transform="translate(${4 + i * 7} ${i % 2 ? 1 : 0}) rotate(${(i - 1) * 6} 10 46)"><rect x="6" y="30" width="12" height="20" rx="4" fill="#c4553a"/><circle cx="12" cy="24" r="7" fill="#f2c9a0"/><rect x="7" y="50" width="4" height="6" fill="#2b2b2b"/><rect x="13" y="50" width="4" height="6" fill="#2b2b2b"/></g></g>`).join('') + [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${6 + i * 20}" y="4" width="8" height="5" rx="1" fill="#555"/><rect x="${6 + i * 20}" y="91" width="8" height="5" rx="1" fill="#555"/>`).join('')) },
    { id: 'claymation', name: 'Claymation', aka: 'clay animation, plasticine',
      desc: 'Stop-motion with soft modelling clay. Rounded, lumpy shapes, visible fingerprints and a warm, goofy charm.',
      spot: 'blobby rounded forms, thumbprints and tool marks, slightly waxy sheen',
      ref: 'Wallace & Gromit, Shaun the Sheep, Pingu',
      prompt: 'claymation style: chunky plasticine characters with visible fingerprints and soft waxy highlights',
      ex: sv(`<defs><filter id="clayf" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="4"/></filter><filter id="clayl"><feTurbulence type="fractalNoise" baseFrequency=".18" numOctaves="2" seed="5" result="n"/><feDiffuseLighting in="n" surfaceScale="1.6" lighting-color="#fff" result="l"><feDistantLight azimuth="235" elevation="55"/></feDiffuseLighting><feComposite in="l" in2="SourceGraphic" operator="in" result="lit"/><feBlend in="SourceGraphic" in2="lit" mode="multiply"/></filter></defs><rect width="160" height="100" fill="#cfe3d4"/><rect y="76" width="160" height="24" fill="#8fbf7a"/><g filter="url(#clayf)"><g filter="url(#clayl)"><ellipse cx="80" cy="62" rx="26" ry="22" fill="#f08a5d"/><circle cx="80" cy="36" r="17" fill="#f08a5d"/></g><circle cx="74" cy="34" r="4" fill="#fff"/><circle cx="86" cy="34" r="4" fill="#fff"/><circle cx="75" cy="35" r="2" fill="#222"/><circle cx="87" cy="35" r="2" fill="#222"/><ellipse cx="80" cy="44" rx="6" ry="2.4" fill="#7a2f22"/></g>`) },
    { id: 'celanim', name: 'Cel animation', aka: 'traditional 2D, hand-drawn animation',
      desc: 'Characters drawn with clean ink lines and flat colors, laid over a painted background. The classic Disney and anime look: crisp figures, soft painted world.',
      spot: 'flat-colored characters with dark outlines in front of a softer, painted background',
      ref: 'classic Disney, Cowboy Bebop, Cartoon Saloon',
      prompt: 'traditional cel animation look: crisp ink-outlined flat-color character over a soft painted background',
      ex: sv(`<defs><linearGradient id="celbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ec8e8"/><stop offset="1" stop-color="#f3e0b8"/></linearGradient><filter id="celsoft"><feGaussianBlur stdDeviation="1.6"/></filter></defs><rect width="160" height="100" fill="url(#celbg)"/><g filter="url(#celsoft)"><ellipse cx="40" cy="30" rx="22" ry="8" fill="#fff" opacity=".7"/><path d="M0 76Q40 60 90 72T160 66V100H0Z" fill="#7fae6a"/></g><g stroke="#1b1b2a" stroke-width="1.6" stroke-linejoin="round"><path d="M70 92L74 66H96L100 92Z" fill="#e2504a"/><circle cx="85" cy="52" r="14" fill="#f6cfa6"/><path d="M71 48Q76 32 92 36Q102 40 99 50Q90 42 80 46Z" fill="#2b2b3a"/></g><circle cx="80" cy="54" r="1.6" fill="#1b1b2a"/><circle cx="91" cy="54" r="1.6" fill="#1b1b2a"/>`) },
    { id: 'kinetictype', name: 'Kinetic typography', aka: 'motion type, animated text',
      desc: 'Words that move, scale and snap in time with speech or music. The text itself is the visual.',
      ref: 'Saul Bass title sequences, lyric videos, Apple keynote reveals',
      prompt: 'kinetic typography: bold words scale and slide in on the beat, one phrase at a time',
      ex: `<div class="hx typo"><div style="display:flex;gap:6px;align-items:baseline"><span class="kt" style="font:800 30px/1 var(--display);color:var(--ink)">MAKE</span><span class="kt kt2" style="font:800 30px/1 var(--display);color:var(--x1)">IT</span><span class="kt kt3" style="font:800 30px/1 var(--display);color:var(--x4)">MOVE</span></div></div>` },
    { id: 'motiongraphics', name: 'Motion graphics', aka: 'mograph, explainer animation, Lottie-style',
      desc: 'Animated flat shapes, icons and charts, usually vector, with smooth easing and satisfying transitions. The language of product explainers and app animations.',
      spot: 'flat vector shapes that pop, morph and slide with springy easing',
      ref: 'Headspace, Stripe explainer videos, Lottie app animations',
      prompt: 'motion graphics style: flat vector shapes with springy easing, shapes morph and pop between scenes',
      ex: `<div class="hx"><span class="morph"></span><svg viewBox="0 0 60 60" style="width:60px;height:60px" aria-hidden="true"><circle cx="30" cy="30" r="22" fill="none" stroke="var(--x2)" stroke-width="6" stroke-dasharray="100 140" class="mgspin"/></svg></div>` }
  ]
});

pool.groups.push({
  id: 'game', title: 'Game & stylized 3D', slot: 'Game art',
  intro: 'Rendering styles from games and animated films. Useful for 3D scenes, characters and any image that should feel like a world you could walk into.',
  terms: [
    { id: 'pbr', name: 'PBR', aka: 'physically based rendering, realistic materials',
      desc: 'Materials that react to light like the real thing: metal reflects, rubber is matte, plastic has a soft shine. The standard for realistic 3D.',
      spot: 'believable roughness and reflections that differ per material',
      ref: 'Unreal Engine, Substance Painter, product renders',
      prompt: 'physically based rendering with realistic materials: brushed metal, matte rubber, glossy plastic',
      ex: sv(`<defs><radialGradient id="pbr1" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#e88a7a"/><stop offset="1" stop-color="#7a2a22"/></radialGradient><radialGradient id="pbr2" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#7fb0ff"/><stop offset=".6" stop-color="#2b5bd8"/><stop offset="1" stop-color="#0d235e"/></radialGradient><linearGradient id="pbr3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff4d0"/><stop offset=".35" stop-color="#c8962e"/><stop offset=".5" stop-color="#5a3c10"/><stop offset=".62" stop-color="#e8c060"/><stop offset="1" stop-color="#6a4a14"/></linearGradient></defs><rect width="160" height="100" fill="#d9dce2"/><rect y="66" width="160" height="34" fill="#c4c8d0"/>` + [36, 80, 124].map(x => `<ellipse cx="${x}" cy="68" rx="16" ry="3.5" fill="#000" opacity=".2"/>`).join('') + `<circle cx="36" cy="52" r="16" fill="url(#pbr1)"/><circle cx="80" cy="52" r="16" fill="url(#pbr2)"/><circle cx="74" cy="45" r="3" fill="#fff"/><circle cx="124" cy="52" r="16" fill="url(#pbr3)"/><text x="36" y="86" class="dts">rough</text><text x="80" y="86" class="dts">glossy</text><text x="124" y="86" class="dts">metal</text>`) },
    { id: 'handpainted', name: 'Hand-painted textures', aka: 'painterly 3D, stylized textures',
      desc: 'Simple 3D shapes with lighting and wear painted straight into the textures: bright edge highlights, painted shadows, chunky shapes.',
      spot: 'painted-on highlights along edges, soft painted shading, chunky exaggerated forms',
      ref: 'World of Warcraft, League of Legends, Hades',
      prompt: 'stylized 3D with hand-painted textures, painted edge highlights and soft painted shadows',
      ex: sv(`<polygon points="80,22 116,38 80,54 44,38" fill="#c98a4a"/><polygon points="44,38 80,54 80,90 44,74" fill="#9a6232"/><polygon points="116,38 80,54 80,90 116,74" fill="#7a4a22"/><path d="M44 38L80 22L116 38M80 54V90" stroke="#ffd9a0" stroke-width="2.2" stroke-linecap="round" fill="none"/><path d="M52 50L72 60M52 62L72 72M88 60L108 50M88 72L108 62" stroke="#5a3214" stroke-width="2" stroke-linecap="round"/><path d="M60 30L76 26M92 30L100 34" stroke="#ffe8c0" stroke-width="1.4" stroke-linecap="round" opacity=".8"/>`) },
    { id: 'stylizedreal', name: 'Stylized realism', aka: 'chunky stylized, Pixar-like',
      desc: 'Believable lighting and materials on exaggerated, friendly shapes and bright colors. Real enough to feel solid, cartoony enough to feel inviting.',
      ref: 'Pixar, Fortnite, Overwatch, Animal Crossing',
      prompt: 'stylized realism: chunky exaggerated shapes, saturated colors, soft realistic lighting and materials',
      ex: sv(`<defs><radialGradient id="srtree" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#9ee06a"/><stop offset="1" stop-color="#2f8f3a"/></radialGradient><linearGradient id="srsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc4ff"/><stop offset="1" stop-color="#d8f0ff"/></linearGradient></defs><rect width="160" height="100" fill="url(#srsky)"/><ellipse cx="80" cy="96" rx="110" ry="24" fill="#6cc04a"/><rect x="88" y="52" width="40" height="30" rx="6" fill="#ffe0b0"/><path d="M84 54Q108 26 132 54Z" fill="#e8504a"/><rect x="102" y="64" width="12" height="18" rx="5" fill="#8a5a3a"/><rect x="42" y="56" width="8" height="26" rx="4" fill="#8a5a3a"/><circle cx="46" cy="46" r="20" fill="url(#srtree)"/><ellipse cx="80" cy="84" rx="60" ry="3" fill="#000" opacity=".1"/>`) },
    { id: 'ghibli', name: 'Ghibli-like painterly', aka: 'anime landscape, Studio Ghibli style',
      desc: 'Lush hand-painted worlds: towering cumulus clouds, deep blue skies, rich greens and cozy details, with simple characters set inside. Nostalgic, gentle and full of light.',
      spot: 'huge bright clouds, saturated summer greens, soft painted textures, small cozy buildings',
      ref: 'Studio Ghibli (Totoro, Kiki\'s Delivery Service), Makoto Shinkai skies',
      prompt: 'painterly anime landscape in a Ghibli-like spirit: towering cumulus clouds, lush greens, warm summer light, cozy details',
      ex: sv(`<defs><linearGradient id="ghsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f74c8"/><stop offset="1" stop-color="#9fd2f2"/></linearGradient><filter id="ghsoft"><feTurbulence type="fractalNoise" baseFrequency=".08" numOctaves="2" seed="9"/><feDisplacementMap in="SourceGraphic" scale="5"/></filter></defs><rect width="160" height="100" fill="url(#ghsky)"/><g filter="url(#ghsoft)" fill="#fff">` + [[96, 46, 20], [116, 38, 18], [134, 46, 16], [106, 28, 16], [84, 52, 12], [124, 24, 12]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('') + `</g><rect x="76" y="50" width="76" height="10" fill="#d8e6f2"/><path d="M0 70Q50 54 100 66T160 62V100H0Z" fill="#5aa04a"/><path d="M0 84Q60 72 160 82V100H0Z" fill="#3f7f36"/><rect x="34" y="62" width="16" height="11" fill="#f4ead6"/><polygon points="32,63 42,54 52,63" fill="#c8483a"/><circle cx="20" cy="66" r="9" fill="#2f6a2c"/>`) },
    { id: 'hud', name: 'Game HUD', aka: 'heads-up display, game UI overlay',
      desc: 'The information layered over gameplay: health and energy bars, a minimap, ammo or score counters. Clean HUDs stay in the corners and out of the action.',
      ref: 'Zelda: Breath of the Wild (minimal), Destiny, racing games',
      prompt: 'game HUD overlay: health bar top-left, minimap bottom-right, minimal and out of the center',
      ex: sv(`<rect width="160" height="100" fill="#3a5a4a"/><path d="M0 70Q60 56 160 66V100H0Z" fill="#2a4234"/><rect x="8" y="8" width="52" height="6" rx="3" fill="#000" opacity=".4"/><rect x="8" y="8" width="38" height="6" rx="3" fill="#e2504a"/><rect x="8" y="17" width="40" height="4" rx="2" fill="#000" opacity=".4"/><rect x="8" y="17" width="28" height="4" rx="2" fill="#4ab0f0"/><circle cx="138" cy="78" r="15" fill="#000" opacity=".45" stroke="#fff" stroke-opacity=".6"/><path d="M138 70L142 80L138 78L134 80Z" fill="#ffd23f"/><text x="152" y="16" style="font:700 9px var(--mono);fill:#fff" text-anchor="end">24/90</text><path d="M80 46V54M76 50H84" stroke="#fff" stroke-width="1.2"/>`) }
  ]
});

pool.groups.find(g => g.id === 'type').terms.push(
  { id: 'kerning', name: 'Kerning', aka: 'letter-pair spacing',
    desc: 'Adjusting the space between specific pairs of letters, like "AV" or "To", so a word looks evenly spaced. Matters most in logos and big headlines.',
    ref: 'any logo, large display headlines',
    prompt: 'carefully kerned headline with optically even letter spacing',
    ex: `<div class="hx typo"><div style="font:700 30px/1.1 var(--display);color:var(--ink3)">A V A T A R</div><div style="font:700 30px/1.1 var(--display);color:var(--ink);letter-spacing:-.07em">AVATAR</div></div>` },
  { id: 'leading', name: 'Leading', aka: 'line height, line spacing',
    desc: 'The space between lines of text. Tight leading suits big headlines; body text needs room (around 1.4 to 1.6 times the size) to be comfortable to read.',
    ref: 'line-height in CSS',
    prompt: 'tight leading on headlines, generous 1.5 line height for body text',
    ex: `<div class="hx" style="gap:14px;text-align:left"><div style="font:13px/1.05 var(--body);color:var(--ink);max-width:70px">Lines packed tight feel dense</div><div style="font:13px/1.7 var(--body);color:var(--ink);max-width:70px">Lines with room feel calm</div></div>` },
  { id: 'pairing', name: 'Type pairing', aka: 'font pairing, heading and body fonts',
    desc: 'Choosing two typefaces that work together, usually a characterful one for headings and a plain one for text. Contrast in style, harmony in proportion.',
    ref: 'serif headings with sans body (editorial), display grotesk with mono (tech)',
    prompt: 'type pairing: [serif] for headings with [sans-serif] for body text',
    ex: `<div class="hx typo" style="text-align:left;align-items:flex-start"><div style="font:400 28px/1 'Instrument Serif',Georgia,serif;color:var(--ink)">The quiet lake</div><div style="font:400 11px/1.5 var(--body);color:var(--ink2);max-width:150px">A serif headline with a plain sans-serif body underneath.</div></div>` },
  { id: 'dropcap', name: 'Drop cap', aka: 'initial capital',
    desc: 'An oversized first letter that drops down into the first few lines of a paragraph. Signals the start of a story; feels literary and editorial.',
    ref: 'magazines, long-form articles, old manuscripts',
    prompt: 'editorial layout with a large serif drop cap starting the first paragraph',
    ex: `<div class="hx" style="text-align:left"><p style="margin:0;font:11px/1.45 var(--body);color:var(--ink2);max-width:170px"><span style="float:left;font:400 44px/.8 'Instrument Serif',Georgia,serif;color:var(--x1);margin:3px 6px 0 0">O</span>nce the boat left the shore, the sun filled the whole sky and the lake turned to gold beneath it.</p></div>` },
  { id: 'measure', name: 'Line length', aka: 'measure, characters per line',
    desc: 'How wide a column of text is. Around 45 to 75 characters per line is comfortable; much wider and the eye loses its place.',
    ref: 'max-width: 65ch',
    prompt: 'body text limited to about 65 characters per line',
    ex: sv(`<g class="gr">${[0, 1, 2, 3, 4, 5].map(i => `<rect x="8" y="${14 + i * 8}" width="${i === 5 ? 90 : 144}" height="3" rx="1.5"/>`).join('')}</g><g class="x1">${[0, 1, 2, 3, 4, 5].map(i => `<rect x="8" y="${66 + i * 5}" width="${i === 5 ? 40 : 72}" height="2.4" rx="1.2"/>`).join('')}</g><text x="152" y="10" class="dts" style="text-anchor:end">too wide</text><text x="90" y="78" class="dts" style="text-anchor:start">comfortable</text>`) }
);

/* ---------- subjects: one page each ----------
   To add a subject, push groups into pool.groups above, then add an entry here:
   { id, title, blurb, preview: termId, groups: [groupId, ...] }
*/
const G = Object.fromEntries(pool.groups.map(g => [g.id, g]));
WORKBOOK.recipe = pool.recipe;
WORKBOOK.areas = [
  { id: 'visual', title: 'Visual style', preview: 'isometric', blurb: 'How things are drawn: rendering styles, perspective, color, type, texture and named looks.', groups: ['render', 'depth', 'color', 'colortheory', 'type', 'shape', 'mood'] },
  { id: 'threed', title: '3D', preview: 'diorama', blurb: 'Projection, camera angles, lighting and materials for 3D scenes and renders.', groups: ['three'] },
  { id: 'ui', title: 'UI & UX', preview: 'cmdk', blurb: 'The names for screen layouts, interface patterns, states and motion in apps.', groups: ['ux', 'layout', 'motion'] },
  { id: 'principles', title: 'Principles & critique', preview: 'cluttered', blurb: 'Why a design works, and the words that turn "it feels off" into a fix.', groups: ['principles', 'critique'] },
  { id: 'diagrams', title: 'Diagrams & charts', preview: 'cycle', blurb: 'Ways to explain a concept or show data, chosen by the question the picture answers.', groups: ['diagram', 'charts'] },
  { id: 'illustration', title: 'Illustration & icons', preview: 'duotoneicon', blurb: 'Icon styles, illustration types and the hand-made techniques behind them.', groups: ['icons', 'technique'] },
  { id: 'brand', title: 'Brand & logos', preview: 'combomark', blurb: 'The kinds of logo mark and the identity system that surrounds them.', groups: ['brand'] },
  { id: 'texture', title: 'Textures & mediums', preview: 'travelposter', blurb: 'Surfaces, grain and physical mediums: what makes an image feel printed, painted or touchable.', groups: ['texture', 'medium'] },
  { id: 'art', title: 'Art & architecture', preview: 'ukiyoe', blurb: 'Art movements and building styles, with how to recognize each one.', groups: ['art', 'arch'] },
  { id: 'photo', title: 'Photo & film', preview: 'goldenhour', blurb: 'Shot types, lighting, lenses and composition for images, video and mood.', groups: ['photo', 'composition', 'camera'] },
  { id: 'animation', title: 'Animation & games', preview: 'ghibli', blurb: 'Animation techniques and the rendering styles of games and animated films.', groups: ['animation', 'game'] }
].map(a => ({ ...a, groups: a.groups.map(id => G[id]) }));

/* ---------- rendering ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
};
const picks = new Set(store.get('vv-picks', []));
const TERMS = {};
WORKBOOK.areas.forEach(a => a.groups.forEach(g => g.terms.forEach(t => TERMS[t.id] = { t, g, a })));
const totalTerms = Object.keys(TERMS).length;
let pendingJump = null;

const cardHTML = (t, g) => `
  <article class="card${picks.has(t.id) ? ' picked' : ''}" id="t-${t.id}" data-search="${esc((t.name + ' ' + (t.aka || '') + ' ' + t.desc + ' ' + (t.ref || '') + ' ' + (t.spot || '') + ' ' + g.title).toLowerCase())}">
    <div class="ex">${t.ex}</div>
    <div class="cbody">
      <h3>${esc(t.name)}</h3>
      ${t.aka ? `<div class="aka">Also called ${esc(t.aka)}</div>` : ''}
      <p class="desc">${esc(t.desc)}</p>
      ${t.spot ? `<p class="ref"><b>Spot it</b>${esc(t.spot)}</p>` : ''}
      ${t.ref ? `<p class="ref"><b>Think</b>${esc(t.ref)}</p>` : ''}
      <div class="phrase">
        <code id="p-${t.id}">${esc(t.prompt)}</code>
        <div class="btns">
          <button type="button" class="btn add" data-add="${t.id}" aria-pressed="${picks.has(t.id)}">${picks.has(t.id) ? 'Added' : 'Add to prompt'}</button>
          <button type="button" class="btn" data-copy="${t.id}">Copy phrase</button>
        </div>
      </div>
    </div>
  </article>`;
const groupHTML = (g, sub) => `
  <section class="group" id="g-${g.id}" aria-labelledby="h-${g.id}">
    <div class="ghead">${sub ? `<div class="eyebrow">${esc(sub)}</div>` : ''}<h2 id="h-${g.id}">${esc(g.title)}</h2><p>${esc(g.intro)}</p></div>
    <div class="cards">${g.terms.map(t => cardHTML(t, g)).join('')}</div>
  </section>`;
const emptyMsg = `<p class="empty" id="empty" hidden>No terms match that search. Try a plainer word like "3D", "soft", "light" or "flow".</p>`;

function renderHome() {
  $('#home').hidden = false; $('#subject').hidden = true; $('#main').innerHTML = '';
  $('#homeCount').textContent = `${totalTerms} terms in ${WORKBOOK.areas.length} subjects`;
  $('#sentence').innerHTML = WORKBOOK.recipe.map(([txt, id]) => {
    if (!id || !TERMS[id]) return esc(txt);
    return `<a class="chip" href="#${TERMS[id].a.id}" data-jump="${id}"><span>${esc(txt)}</span><small>${esc(TERMS[id].g.slot)}</small></a>`;
  }).join('');
  $('#tiles').innerHTML = WORKBOOK.areas.map(a => `
    <a class="tile" href="#${a.id}">
      <div class="ex" aria-hidden="true">${TERMS[a.preview] ? TERMS[a.preview].t.ex.replace(/id="([^"]+)"/g, 'id="tile-$1"').replace(/url\(#([^)]+)\)/g, 'url(#tile-$1)') : ''}</div>
      <div class="tbody"><h3>${esc(a.title)}</h3><p>${esc(a.blurb)}</p>
      <div class="tmeta">${a.groups.reduce((n, g) => n + g.terms.length, 0)} terms · ${a.groups.map(g => esc(g.title)).join(' · ')}</div></div>
    </a>`).join('');
  const chip = id => TERMS[id] ? `<a class="chip" href="#${TERMS[id].a.id}" data-jump="${id}"><span>${esc(TERMS[id].t.name)}</span><small>${esc(TERMS[id].g.slot)}</small></a>` : '';
  $('#reading').innerHTML = READINGS.map(r => `
    <h2 id="readingH">Read a real prompt: ${esc(r.title)}</h2>
    <p class="lead">${esc(r.intro)}</p>
    <div class="rgrid">
      <figure class="rfig"><img src="${r.img}" alt="${esc(r.alt)}" loading="lazy"><figcaption>${esc(r.by)}</figcaption></figure>
      <ol class="rparts">${r.parts.map(p => `<li><blockquote>“${esc(p.q)}”</blockquote>${p.uses.length ? `<div class="uses">${p.uses.map(chip).join('')}</div>` : ''}${p.note ? `<p class="note"><b>Sharpen</b>${esc(p.note)}</p>` : ''}${p.also ? `<div class="uses also">${p.also.map(chip).join('')}</div>` : ''}</li>`).join('')}</ol>
    </div>`).join('');
  $('#results').innerHTML = WORKBOOK.areas.map(a => a.groups.map(g => groupHTML(g, a.title)).join('')).join('') + emptyMsg;
  filter($('#qh'), $('#results'), true);
}

function renderSubject(a) {
  $('#home').hidden = true; $('#subject').hidden = false; $('#results').innerHTML = '';
  $('#subTitle').textContent = a.title;
  $('#subBlurb').textContent = a.blurb;
  const i = WORKBOOK.areas.indexOf(a), next = WORKBOOK.areas[(i + 1) % WORKBOOK.areas.length];
  $('#nav').innerHTML = a.groups.map(g => `<a href="#g-${g.id}" data-g="${g.id}">${esc(g.title)}<span>${g.terms.length}</span></a>`).join('');
  $('#main').innerHTML = a.groups.map(g => groupHTML(g)).join('') + emptyMsg + `<a class="next" href="#${next.id}">Next subject: ${esc(next.title)} →</a>`;
  $('#q').value = '';
}

function route() {
  const id = location.hash.slice(1);
  const a = WORKBOOK.areas.find(x => x.id === id);
  if (a) renderSubject(a);
  else if (!id || !document.getElementById(id)) renderHome();
  else return; // in-page anchor such as #g-color
  if (pendingJump) { const j = pendingJump; pendingJump = null; setTimeout(() => jumpTo(j), 60); }
  else if (a || !id) window.scrollTo(0, 0);
}

function compose() {
  const subj = $('#subject-in').value.trim() || '[what you want to visualize]';
  const lines = [`Create a visual of ${subj}.`, '', 'Style direction:'];
  let n = 0;
  WORKBOOK.areas.forEach(a => a.groups.forEach(g => {
    const ps = g.terms.filter(t => picks.has(t.id));
    if (ps.length) { n += ps.length; lines.push(`- ${g.slot}: ${ps.map(t => t.prompt).join('; ')}`); }
  }));
  if (!n) lines.push('- (add terms from the workbook)');
  return { text: lines.join('\n'), n };
}

function renderTray() {
  const { text, n } = compose();
  $('#out').textContent = text;
  const names = [...picks].filter(id => TERMS[id]).map(id => TERMS[id].t.name);
  $('#count').innerHTML = n
    ? `${n} term${n > 1 ? 's' : ''} picked<small>${esc(names.join(' · '))}</small>`
    : `No terms picked yet<small>Press "Add to prompt" on any card to start</small>`;
}

function copyText(text, btn, fallbackEl) {
  const done = ok => { const o = btn.textContent; btn.textContent = ok ? 'Copied' : 'Selected, press Ctrl+C'; setTimeout(() => btn.textContent = o, 1400); };
  const select = () => { if (!fallbackEl) return; const r = document.createRange(); r.selectNodeContents(fallbackEl); const s = getSelection(); s.removeAllRanges(); s.addRange(r); };
  try {
    navigator.clipboard.writeText(text).then(() => done(true), () => { select(); done(false); });
  } catch (e) { select(); done(false); }
}

function jumpTo(id) {
  const el = document.getElementById('t-' + id);
  if (!el || el.hidden) return;
  el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
  el.classList.add('flash'); setTimeout(() => el.classList.remove('flash'), 1400);
}

function filter(input, scope, homeMode) {
  const q = input.value.trim().toLowerCase();
  let any = false;
  scope.querySelectorAll('.group').forEach(g => {
    let vis = 0;
    g.querySelectorAll('.card').forEach(c => { const ok = !q || c.dataset.search.includes(q); c.hidden = !ok; if (ok) vis++; });
    g.hidden = !vis; if (vis) any = true;
    const nav = document.querySelector(`#nav [data-g="${g.id.slice(2)}"]`); if (nav) nav.hidden = !vis;
  });
  const empty = scope.querySelector('#empty'); if (empty) empty.hidden = any;
  if (homeMode) { $('#results').hidden = !q; $('#tiles').hidden = !!q; $('#recipe').hidden = !!q; $('#reading').hidden = !!q; }
}

document.addEventListener('click', e => {
  const add = e.target.closest('[data-add]');
  if (add) {
    const id = add.dataset.add;
    picks.has(id) ? picks.delete(id) : picks.add(id);
    store.set('vv-picks', [...picks]);
    const on = picks.has(id);
    add.setAttribute('aria-pressed', on); add.textContent = on ? 'Added' : 'Add to prompt';
    document.getElementById('t-' + id).classList.toggle('picked', on);
    renderTray(); return;
  }
  const cp = e.target.closest('[data-copy]');
  if (cp) { const el = document.getElementById('p-' + cp.dataset.copy); copyText(el.textContent, cp, el); return; }
  const j = e.target.closest('[data-jump]');
  if (j) {
    e.preventDefault();
    const target = TERMS[j.dataset.jump].a.id;
    pendingJump = j.dataset.jump;
    if (location.hash.slice(1) === target) route(); else location.hash = target;
  }
});

window.addEventListener('hashchange', route);
$('#q').addEventListener('input', () => filter($('#q'), $('#main')));
$('#qh').addEventListener('input', () => filter($('#qh'), $('#results'), true));
$('#toggle').addEventListener('click', () => {
  const body = $('#trayBody'), open = body.hidden;
  body.hidden = !open; $('#toggle').setAttribute('aria-expanded', open); $('#toggle').textContent = open ? 'Hide prompt' : 'Show prompt';
});
$('#copyAll').addEventListener('click', e => copyText(compose().text, e.currentTarget, $('#out')));
$('#clear').addEventListener('click', () => {
  picks.clear(); store.set('vv-picks', []);
  document.querySelectorAll('.card.picked').forEach(c => c.classList.remove('picked'));
  document.querySelectorAll('[data-add]').forEach(b => { b.setAttribute('aria-pressed', 'false'); b.textContent = 'Add to prompt'; });
  renderTray();
});
$('#subject-in').value = store.get('vv-subject', '');
$('#subject-in').addEventListener('input', () => { store.set('vv-subject', $('#subject-in').value); renderTray(); });

route();
renderTray();
