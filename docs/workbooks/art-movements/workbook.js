const SUN_IMG = '';

/* ---------- drawing helpers (shared by every part file) ---------- */
const sv = b => `<svg viewBox="0 0 160 100" aria-hidden="true">${b}</svg>`;
const f1 = n => (+n).toFixed(1);
const pts = a => a.map(q => f1(q[0]) + ',' + f1(q[1])).join(' ');
let UID = 0;
// unique id for <defs> (gradients, filters, clipPaths): const id = U('wc'); ... fill="url(#${id})"
const U = p => p + (++UID);
// seeded random: const r = rng(7); r() -> 0..1
const rng = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pick = (r, a) => a[Math.floor(r() * a.length)];
// overlays that use the page-level filters/gradients #grainF and #vigF
const grainOv = (a = .35) => `<rect width="160" height="100" filter="url(#grainF)" opacity="${a}"/>`;
const vig = (a = 1) => `<rect width="160" height="100" fill="url(#vigF)" opacity="${a}"/>`;
// full-tile background
const bg = c => `<rect width="160" height="100" fill="${c}"/>`;
// paper-ish wobble filter: returns [defs, filterId]; scale = how much the edges wobble
function wob(scale = 2.5, freq = .06, seed = 3) {
  const id = U('wb');
  return [`<filter id="${id}" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="2" seed="${seed}"/><feDisplacementMap in="SourceGraphic" scale="${scale}"/></filter>`, id];
}
// simple standing figure, feet at (x, y), height h
const fig = (x, y, h, fill) => `<circle cx="${f1(x)}" cy="${f1(y - h * .86)}" r="${f1(h * .14)}" fill="${fill}"/><path d="M${f1(x - h * .17)} ${f1(y)} L${f1(x - h * .12)} ${f1(y - h * .7)} h${f1(h * .24)} L${f1(x + h * .17)} ${f1(y)}Z" fill="${fill}"/>`;
const pool = { groups: [] };

/* ===== a_early.js ===== */
/* ---------- a_early: Ancient & medieval, Renaissance to Romanticism ---------- */

// small private helpers (prefix ea_)
const ea_P = (d, f, x = '') => `<path d="${d}" fill="${f}" ${x}/>`;
function ea_lgrad(stops, x2 = 0, y2 = 1) {
  const id = U('eag');
  return [`<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(s => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ''}/>`).join('')}</linearGradient>`, id];
}
function ea_rgrad(stops, cx = .5, cy = .5, r = .5) {
  const id = U('eag');
  return [`<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(s => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ''}/>`).join('')}</radialGradient>`, id];
}
function ea_blur(sd) {
  const id = U('eab');
  return [`<filter id="${id}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${sd}"/></filter>`, id];
}
// soft foliage clump made of overlapping ellipses
function ea_clump(r, cx, cy, w, h, n, cols, op = 1) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2, d = Math.sqrt(r());
    s += `<ellipse cx="${f1(cx + Math.cos(a) * d * w)}" cy="${f1(cy + Math.sin(a) * d * h)}" rx="${f1(2 + r() * 3)}" ry="${f1(1.5 + r() * 2.2)}" fill="${pick(r, cols)}" opacity="${op}"/>`;
  }
  return s;
}

/* ===== ANCIENT & MEDIEVAL ===== */

function ea_cave() {
  const r = rng(11);
  const [wd, wf] = wob(2.6, .07, 5);
  const [gd, g] = ea_rgrad([[0, '#e4c696'], [.55, '#c09062'], [1, '#4a3020']], .45, .4, .75);
  const [bd, bl] = ea_blur(2.2);
  let s = `<defs>${wd}${gd}${bd}</defs><rect width="160" height="100" fill="url(#${g})"/>`;
  // rock mottling and cracks
  for (let i = 0; i < 45; i++) s += `<ellipse cx="${f1(r() * 160)}" cy="${f1(r() * 100)}" rx="${f1(4 + r() * 14)}" ry="${f1(3 + r() * 8)}" fill="${pick(r, ['#a87648', '#ead2a6', '#8d6240'])}" opacity=".18" filter="url(#${bl})"/>`;
  s += `<path d="M0 78 Q30 70 52 84 T110 88 T160 80" stroke="#6b4a30" stroke-width=".8" fill="none" opacity=".5"/><path d="M118 0 Q122 20 112 34" stroke="#6b4a30" stroke-width=".7" fill="none" opacity=".45"/>`;
  // bison: red ochre body, black mane and outline
  const bison = 'M38 56 Q40 44 54 40 Q66 30 80 31 Q92 33 98 42 Q104 46 105 54 Q106 61 99 64 Q93 66 91 72 L92 84 L88 84 L85 73 Q74 75 62 73 L60 85 L56 85 L54 73 Q48 72 45 68 L43 82 L39 82 Q38 70 38 56Z';
  s += `<g filter="url(#${wf})"><path d="${bison}" fill="#a8411f" opacity=".88"/>`;
  s += `<path d="M66 33 Q80 28 92 34 Q100 40 104 50 Q96 46 88 47 Q78 44 66 33Z" fill="#231610" opacity=".85"/>`;
  s += `<path d="M98 64 Q101 70 97 74" stroke="#231610" stroke-width="2" fill="none"/>`;
  s += `<path d="${bison}" fill="none" stroke="#231610" stroke-width="1.8" stroke-linejoin="round"/>`;
  s += `<path d="M96 40 Q100 33 106 34" stroke="#231610" stroke-width="1.6" fill="none"/><circle cx="99" cy="48" r=".9" fill="#231610"/>`;
  // a small running horse, black outline only
  s += `<path d="M12 30 Q16 22 28 22 Q36 18 40 12 Q44 10 46 14 Q44 18 42 22 Q42 30 36 32 L38 40 M30 32 L26 40 M18 32 L14 40 M14 30 L8 36 M12 30 Q8 26 4 28" stroke="#231610" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
  s += `<path d="M14 24 Q26 20 36 20 Q30 28 16 29Z" fill="#c9762e" opacity=".75"/></g>`;
  // hand stencil: blown pigment halo, rock-coloured hand
  s += `<circle cx="134" cy="56" r="15" fill="#9c2f1a" opacity=".85" filter="url(#${bl})"/>`;
  s += `<g fill="#cfa577" transform="rotate(-12 134 58)"><ellipse cx="134" cy="62" rx="6.5" ry="7.5"/>`;
  [[-5.6, -3, 9, -38], [-2.6, -8, 11, -10], [.4, -9, 12, 0], [3.2, -8, 11, 8], [5.6, -5, 9, 18]].forEach(([dx, dy, h, rot]) => {
    s += `<rect x="${f1(134 + dx - 1.4)}" y="${f1(58 + dy - h + 4)}" width="2.8" height="${h}" rx="1.4" transform="rotate(${rot} ${f1(134 + dx)} ${f1(58 + dy + 4)})"/>`;
  });
  s += `<rect x="131" y="66" width="6" height="10" rx="2"/></g>`;
  // dots of pigment (sprayed)
  for (let i = 0; i < 40; i++) { const a = r() * 6.28, d = 13 + r() * 7; s += `<circle cx="${f1(134 + Math.cos(a) * d)}" cy="${f1(56 + Math.sin(a) * d)}" r="${f1(.3 + r() * .7)}" fill="#8f2a16" opacity=".7"/>`; }
  // a row of ochre dots (signs)
  for (let i = 0; i < 6; i++) s += `<circle cx="${18 + i * 6}" cy="${f1(66 + Math.sin(i) * 1.5)}" r="1.6" fill="#a8411f" opacity=".8"/>`;
  return sv(s + grainOv(.45) + vig(.8));
}

function ea_egypt() {
  const r = rng(21);
  const skinM = '#a4492a', skinF = '#d89a52', blk = '#1b1712', wht = '#f4eedc', blu = '#2f63a8', grn = '#3d8a6a';
  let s = bg('#e6cf98');
  // plaster speckle
  for (let i = 0; i < 70; i++) s += `<circle cx="${f1(r() * 160)}" cy="${f1(r() * 100)}" r="${f1(.4 + r())}" fill="#b89a62" opacity=".35"/>`;
  // block frieze border on top, register lines
  const cols = [blu, '#b3402a', grn, '#d9a43a'];
  for (let i = 0; i < 20; i++) s += `<rect x="${i * 8}" y="2" width="7" height="6" fill="${cols[i % 4]}"/>`;
  s += `<rect y="9" width="160" height="1.4" fill="${blk}"/><rect y="88" width="160" height="1.6" fill="${blk}"/>`;
  // water register at bottom
  s += `<rect y="89.6" width="160" height="10.4" fill="${blu}"/>`;
  for (let x = 0; x < 160; x += 8) s += `<path d="M${x} 94 q2 -2 4 0 t4 0" stroke="#bcd3ee" stroke-width=".8" fill="none"/>`;
  // MAN (composite view): profile head facing right, frontal shoulders, profile legs
  const mx = 44;
  s += `<path d="M${mx - 6} 88 L${mx - 4} 70 L${mx - 1} 70 L${mx - 1} 88 L${mx - 9} 88 Z" fill="${skinM}"/>`; // back leg
  s += `<path d="M${mx + 2} 70 L${mx + 6} 70 L${mx + 13} 87 L${mx + 18} 88 L${mx + 8} 88 Z" fill="${skinM}"/>`; // striding front leg
  s += `<path d="M${mx - 12} 34 L${mx + 12} 34 L${mx + 5} 56 L${mx - 5} 56 Z" fill="${skinM}"/>`; // frontal torso
  s += `<path d="M${mx - 7} 56 L${mx + 7} 56 L${mx + 10} 72 L${mx - 7} 72 Z" fill="${wht}"/><path d="M${mx + 1} 57 L${mx + 9} 71" stroke="#c9bfa4" stroke-width=".6"/>`; // kilt
  s += `<path d="M${mx - 12} 35 L${mx - 15} 52 L${mx - 13} 64" stroke="${skinM}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`; // arm down
  s += `<path d="M${mx + 12} 35 L${mx + 20} 44 L${mx + 27} 38" stroke="${skinM}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`; // arm raised offering
  s += `<path d="M${mx - 8} 34 Q${mx} 44 ${mx + 8} 34 Z" fill="${blu}"/><path d="M${mx - 10} 34 Q${mx} 47 ${mx + 10} 34" stroke="${grn}" stroke-width="1.4" fill="none"/><path d="M${mx - 11.5} 34 Q${mx} 50 ${mx + 11.5} 34" stroke="#d9a43a" stroke-width="1" fill="none"/>`; // broad collar
  s += `<rect x="${mx - 2.5}" y="29" width="5" height="6" fill="${skinM}"/>`;
  s += `<path d="M${mx - 5} 24 Q${mx - 5} 16 ${mx + 2} 16 Q${mx + 8} 17 ${mx + 8} 23 L${mx + 10} 26 L${mx + 8} 27 Q${mx + 7} 31 ${mx + 2} 31 L${mx - 3} 30 Z" fill="${skinM}"/>`; // profile face
  s += `<path d="M${mx - 8} 32 L${mx - 7} 18 Q${mx - 2} 13 ${mx + 6} 16 L${mx + 6} 20 L${mx + 1} 20 L${mx + 1} 26 L${mx - 2} 33 Z" fill="${blk}"/>`; // wig
  s += `<path d="M${mx + 3.2} 21.5 q1.6 -1.2 3.6 0 q-1.6 1.2 -3.6 0Z" fill="${wht}" stroke="${blk}" stroke-width=".6"/><circle cx="${mx + 5}" cy="21.5" r=".7" fill="${blk}"/>`; // frontal eye
  s += `<path d="M${mx + 6} 24 l3 0" stroke="${blk}" stroke-width=".4"/>`;
  // lotus in raised hand
  s += `<path d="M${mx + 27} 38 L${mx + 30} 30" stroke="${grn}" stroke-width=".8"/><path d="M${mx + 27} 30 L${mx + 30} 24 L${mx + 33} 30 Z" fill="${blu}"/>`;
  // hieroglyph column
  s += `<g fill="${blk}"><rect x="80" y="14" width="0.6" height="70"/><rect x="92" y="14" width="0.6" height="70"/>`;
  s += `<path d="M82 20 q4 -3 8 0 q-4 3 -8 0Z" fill="none" stroke="${blk}" stroke-width=".9"/><circle cx="86" cy="20" r="1"/><path d="M85 22 l-1 3"  stroke="${blk}" stroke-width=".8"/>`; // eye
  s += `<path d="M83 31 q1 -2 2 0 t2 0 t2 0 t2 0" stroke="${blk}" stroke-width=".9" fill="none"/><path d="M83 34 q1 -2 2 0 t2 0 t2 0 t2 0" stroke="${blk}" stroke-width=".9" fill="none"/>`; // water
  s += `<path d="M84 50 Q83 44 86 42 Q88 41 89 43 L91 42 L89 45 Q90 49 87 50 L90 54 L84 54 Z"/>`; // bird
  s += `<circle cx="86" cy="61" r="3" fill="none" stroke="${blk}" stroke-width=".9"/><circle cx="86" cy="61" r=".8"/>`; // sun
  s += `<path d="M84 70 h4 v8 h-4z M83 70 h6" fill="none" stroke="${blk}" stroke-width=".9"/></g>`;
  // WOMAN: lighter skin, white sheath, facing left
  const wx = 118;
  s += `<path d="M${wx - 8} 34 L${wx + 8} 34 L${wx + 5} 87 L${wx - 6} 88 Z" fill="${wht}"/><path d="M${wx - 6} 88 L${wx - 4} 50 M${wx + 1} 88 L${wx + 2} 50" stroke="#d6cbb0" stroke-width=".5"/>`;
  s += `<path d="M${wx - 6} 87 l-6 1 l6 0 M${wx + 2} 87 l-6 1" stroke="${skinF}" stroke-width="1.4"/>`;
  s += `<path d="M${wx - 8} 35 L${wx - 15} 46 L${wx - 22} 42" stroke="${skinF}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M${wx + 8} 35 L${wx + 10} 52 L${wx + 7} 62" stroke="${skinF}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  s += `<path d="M${wx - 7} 34 Q${wx} 43 ${wx + 7} 34 Z" fill="${grn}"/><path d="M${wx - 8.5} 34 Q${wx} 46 ${wx + 8.5} 34" stroke="${blu}" stroke-width="1.3" fill="none"/>`;
  s += `<rect x="${wx - 2}" y="29" width="4" height="6" fill="${skinF}"/>`;
  s += `<path d="M${wx + 5} 24 Q${wx + 5} 16 ${wx - 2} 16 Q${wx - 7} 17 ${wx - 7} 23 L${wx - 9} 26 L${wx - 7} 27 Q${wx - 6} 31 ${wx - 1} 31 L${wx + 3} 30 Z" fill="${skinF}"/>`;
  s += `<path d="M${wx + 9} 40 L${wx + 7} 17 Q${wx + 1} 12 ${wx - 6} 16 L${wx - 6} 20 L${wx - 1} 20 L${wx - 1} 27 L${wx + 2} 40 Z" fill="${blk}"/><rect x="${wx - 6}" y="16.5" width="14" height="1.6" fill="${blu}"/>`;
  s += `<path d="M${wx - 3.2} 21.5 q-1.6 -1.2 -3.6 0 q1.6 1.2 3.6 0Z" fill="${wht}" stroke="${blk}" stroke-width=".6"/><circle cx="${wx - 5}" cy="21.5" r=".7" fill="${blk}"/>`;
  s += `<path d="M${wx - 22} 42 L${wx - 22} 34" stroke="${grn}" stroke-width=".8"/><path d="M${wx - 25} 34 L${wx - 22} 28 L${wx - 19} 34 Z" fill="${blu}"/>`;
  return sv(s + grainOv(.4));
}

function ea_amph(cx, top, bot, w) {
  // amphora silhouette path centred at cx
  const h = bot - top, y = k => f1(top + h * k);
  return `M${f1(cx - w * .16)} ${y(0)} L${f1(cx + w * .16)} ${y(0)} L${f1(cx + w * .12)} ${y(.05)} L${f1(cx + w * .14)} ${y(.2)} Q${f1(cx + w * .5)} ${y(.26)} ${f1(cx + w * .48)} ${y(.5)} Q${f1(cx + w * .44)} ${y(.76)} ${f1(cx + w * .14)} ${y(.88)} L${f1(cx + w * .2)} ${y(.97)} L${f1(cx + w * .22)} ${y(1)} L${f1(cx - w * .22)} ${y(1)} L${f1(cx - w * .2)} ${y(.97)} L${f1(cx - w * .14)} ${y(.88)} Q${f1(cx - w * .44)} ${y(.76)} ${f1(cx - w * .48)} ${y(.5)} Q${f1(cx - w * .5)} ${y(.26)} ${f1(cx - w * .14)} ${y(.2)} L${f1(cx - w * .12)} ${y(.05)} Z`;
}
function ea_meander(x0, x1, y, u, col) {
  let d = '';
  for (let x = x0; x < x1; x += u) d += `M${f1(x)} ${f1(y + u * .8)} v${f1(-u * .8)} h${f1(u * .75)} v${f1(u * .55)} h${f1(-u * .45)} v${f1(-u * .3)} `;
  return `<path d="${d}" stroke="${col}" stroke-width="${f1(u * .14)}" fill="none"/><path d="M${x0} ${f1(y - u * .25)} H${x1} M${x0} ${f1(y + u * 1.05)} H${x1}" stroke="${col}" stroke-width="${f1(u * .12)}"/>`;
}
// tiny warrior: helmet, round shield, spear
function ea_warrior(x, y, k, body, line, flip) {
  const sx = flip ? -1 : 1;
  return `<g transform="translate(${x} ${y}) scale(${sx * k} ${k})"><path d="M0 -8 L-4 4 M0 -8 L5 4" stroke="${body}" stroke-width="2" stroke-linecap="round"/><path d="M-2.4 -18 L2.4 -18 L1.6 -7 L-1.6 -7Z" fill="${body}"/><circle cx="0" cy="-21" r="2.6" fill="${body}"/><path d="M-3 -22 Q-1 -28 4 -24" stroke="${body}" stroke-width="1.4" fill="none"/><path d="M-7 -22 L13 -5" stroke="${body}" stroke-width=".8"/><circle cx="4" cy="-13" r="5" fill="${body}"/><circle cx="4" cy="-13" r="3.6" fill="none" stroke="${line}" stroke-width=".45"/><path d="M-0.8 -21.5 h2" stroke="${line}" stroke-width=".4"/></g>`;
}
function ea_vase() {
  const r = rng(31);
  const terra = '#d0763a', blk = '#1d1410';
  const [gd, g] = ea_lgrad([[0, '#efe6d2'], [1, '#d6c7a8']]);
  const [hd, hl] = ea_lgrad([[0, '#fff', 0], [.35, '#fff', .28], [.5, '#fff', 0]], 1, 0);
  const c1 = U('eac'), c2 = U('eac');
  const A = ea_amph(46, 10, 94, 52), B = ea_amph(116, 10, 94, 52);
  let s = `<defs>${gd}${hd}<clipPath id="${c1}"><path d="${A}"/></clipPath><clipPath id="${c2}"><path d="${B}"/></clipPath></defs><rect width="160" height="100" fill="url(#${g})"/>`;
  s += `<rect y="92" width="160" height="8" fill="#c4b18b"/><ellipse cx="46" cy="94" rx="16" ry="2" fill="#000" opacity=".2"/><ellipse cx="116" cy="94" rx="16" ry="2" fill="#000" opacity=".2"/>`;
  // handles
  s += `<path d="M34 22 Q24 22 26 36 M58 22 Q68 22 66 36" stroke="${terra}" stroke-width="2.2" fill="none"/>`;
  s += `<path d="M104 22 Q94 22 96 36 M128 22 Q138 22 136 36" stroke="${blk}" stroke-width="2.2" fill="none"/>`;
  // LEFT: black-figure (black figures on orange clay)
  s += `<path d="${A}" fill="${terra}"/><g clip-path="url(#${c1})">`;
  s += `<rect x="0" y="10" width="160" height="14" fill="${blk}"/><rect x="0" y="76" width="160" height="20" fill="${blk}"/>`;
  for (let x = 22; x < 72; x += 4) s += `<path d="M${x} 76 l2 -5 l2 5Z" fill="${blk}"/>`; // rays
  s += ea_meander(20, 74, 27, 4, blk);
  s += ea_warrior(33, 70, 1.35, blk, terra, false) + ea_warrior(53, 70, 1.35, blk, terra, false);
  s += `<rect x="0" y="80" width="160" height="1" fill="${terra}"/></g>`;
  // RIGHT: red-figure (clay-coloured figures reserved in black gloss)
  s += `<path d="${B}" fill="${blk}"/><g clip-path="url(#${c2})">`;
  s += `<rect x="0" y="80" width="160" height="1.2" fill="${terra}"/>`;
  s += ea_meander(92, 142, 27, 4, terra);
  // a draped figure and a seated lyre player in clay colour with black inner lines
  s += `<g fill="${terra}"><circle cx="108" cy="40" r="3.4"/><path d="M103 45 Q108 43 113 45 L115 72 L101 72Z"/><path d="M103 47 L99 58 M113 47 L118 54" stroke="${terra}" stroke-width="2" stroke-linecap="round"/>`;
  s += `<circle cx="125" cy="48" r="3"/><path d="M121 52 Q125 51 129 53 L130 63 L135 64 L134 72 L120 72 L120 63Z"/><path d="M119 50 Q117 42 122 40 M119 50 L126 41" stroke="${terra}" stroke-width="1.1" fill="none"/></g>`;
  s += `<path d="M104 50 Q107 60 104 71 M108 49 Q110 60 108 71 M112 50 Q114 60 112 71 M122 56 Q127 60 130 63 M107 39 l2 0 M124 47 l2 0" stroke="${blk}" stroke-width=".55" fill="none"/>`;
  s += `<path d="M106 37 Q108 35 111 37 L110 38 Q108 36.5 106 38Z" fill="${blk}"/>`;
  s += `</g>`;
  // gloss highlights
  s += `<path d="${A}" fill="url(#${hl})"/><path d="${B}" fill="url(#${hl})"/>`;
  return sv(s + grainOv(.25));
}

function ea_byzantine() {
  const r = rng(41);
  const pg = U('eap'), pr = U('eap'), ph = U('eap');
  const tile = (id, cols, seed) => {
    const q = rng(seed); let t = '';
    for (let y = 0; y < 5; y++) for (let x = 0; x < 5; x++) t += `<rect x="${f1(x * 4 + q() * .5)}" y="${f1(y * 4 + q() * .5)}" width="${f1(3.2 + q() * .4)}" height="${f1(3.2 + q() * .4)}" fill="${pick(q, cols)}"/>`;
    return `<pattern id="${id}" width="20" height="20" patternUnits="userSpaceOnUse">${t}</pattern>`;
  };
  let s = `<defs>${tile(pg, ['#d6a238', '#e7bb4f', '#c4902a', '#f1d071', '#dcae44'], 7)}${tile(pr, ['#1f2c66', '#283a85', '#3b2a6b', '#18224f', '#2e4596'], 8)}${tile(ph, ['#f3d677', '#ffe79a', '#e8c25a'], 9)}</defs>`;
  s += `<rect width="160" height="100" fill="#4a3412"/><rect width="160" height="100" fill="url(#${pg})"/>`;
  // arch border band of red/white tesserae
  s += `<path d="M20 100 V40 A60 36 0 0 1 140 40 V100" fill="none" stroke="#8d1f25" stroke-width="5"/><path d="M20 100 V40 A60 36 0 0 1 140 40 V100" fill="none" stroke="#f3ead0" stroke-width="1.2" stroke-dasharray="2 2"/>`;
  // halo
  s += `<circle cx="80" cy="34" r="17" fill="url(#${ph})"/><circle cx="80" cy="34" r="17" fill="none" stroke="#8d1f25" stroke-width="1.6"/>`;
  // robe (frontal, flat), with gold clavus stripe
  s += `<path d="M58 54 Q80 44 102 54 L112 100 L48 100 Z" fill="url(#${pr})"/>`;
  s += `<path d="M58 54 Q80 44 102 54 L112 100 L48 100 Z" fill="none" stroke="#0e1230" stroke-width="1"/>`;
  s += `<path d="M70 50 L66 100 M90 50 L94 100" stroke="#d6a238" stroke-width="2.2"/><path d="M80 52 L80 100" stroke="#0e1230" stroke-width=".8"/>`;
  // book with jewels held at chest
  s += `<rect x="83" y="60" width="13" height="17" fill="#8d1f25" stroke="#d6a238" stroke-width="1.2"/><circle cx="89.5" cy="68.5" r="1.6" fill="#f3ead0"/><circle cx="85.5" cy="63" r=".7" fill="#e7bb4f"/><circle cx="93.5" cy="63" r=".7" fill="#e7bb4f"/><circle cx="85.5" cy="74" r=".7" fill="#e7bb4f"/><circle cx="93.5" cy="74" r=".7" fill="#e7bb4f"/>`;
  // blessing hand
  s += `<path d="M70 66 Q68 60 70 56 L72 56 L72 60 L74 58 L74 66 Q73 69 70 66Z" fill="#c99470" stroke="#5a3520" stroke-width=".5"/>`;
  // neck, beard, face: long almond face, huge eyes
  s += `<rect x="77" y="44" width="6" height="7" fill="#c99470"/>`;
  s += `<path d="M71 26 Q72 17 80 17 Q88 17 89 26 L89 34 Q88 40 80 42 Q72 40 71 34Z" fill="#d6a37c"/>`;
  s += `<path d="M70 28 Q70 15 80 15 Q90 15 90 28 Q88 21 80 20 Q72 21 70 28Z" fill="#4a2e1a"/>`;
  s += `<path d="M72 34 Q74 46 80 47 Q86 46 88 34 Q85 40 80 40 Q75 40 72 34Z" fill="#4a2e1a"/>`;
  s += `<path d="M74 27.5 q2.5 -2 5 0 M81 27.5 q2.5 -2 5 0" stroke="#3a2214" stroke-width=".9" fill="none"/>`;
  s += `<ellipse cx="76.5" cy="29.5" rx="2" ry="1.3" fill="#f6ecd8"/><ellipse cx="83.5" cy="29.5" rx="2" ry="1.3" fill="#f6ecd8"/><circle cx="76.8" cy="29.6" r=".95" fill="#1a110a"/><circle cx="83.2" cy="29.6" r=".95" fill="#1a110a"/>`;
  s += `<path d="M80 28 L79 35 L81 35.5" stroke="#8a5a3a" stroke-width=".7" fill="none"/><path d="M78 38 q2 .8 4 0" stroke="#8a3a2a" stroke-width=".8" fill="none"/>`;
  s += `<path d="M73.5 33 q1.5 1 2.5 0 M84 33 q1.5 1 2.5 0" stroke="#c07a64" stroke-width=".7" fill="none" opacity=".7"/>`;
  // scattered tilted glinting tesserae
  for (let i = 0; i < 40; i++) { const x = r() * 160, y = r() * 100; if (Math.hypot(x - 80, y - 60) < 32) continue; s += `<rect x="${f1(x)}" y="${f1(y)}" width="3.2" height="3.2" fill="#fff4c4" opacity="${f1(.25 + r() * .5)}"/>`; }
  return sv(s + vig(.7));
}

function ea_illuminated() {
  const r = rng(51);
  const gold = '#d7a531', gold2 = '#f2d276', blu = '#2747a3', red = '#b2262a', ink = '#2a1d14', grn = '#2e7a46';
  const [gd, g] = ea_rgrad([[0, '#f4e6c3'], [.75, '#e9d4a3'], [1, '#c9a874']], .5, .5, .7);
  const [ld, lg] = ea_lgrad([[0, gold2], [.5, gold], [1, '#a87a1e']], 1, 1);
  let s = `<defs>${gd}${ld}</defs><rect width="160" height="100" fill="url(#${g})"/>`;
  // border frame: gold bars with ivy vines
  s += `<rect x="6" y="6" width="3" height="88" fill="url(#${lg})"/><rect x="6" y="91" width="148" height="3" fill="url(#${lg})"/>`;
  s += `<path d="M11 8 Q16 18 11 28 T11 48 T11 68 T11 88" stroke="${grn}" stroke-width=".6" fill="none"/><path d="M12 89 Q30 85 46 89 T80 89 T114 89 T150 89" stroke="${grn}" stroke-width=".6" fill="none"/>`;
  for (let i = 0; i < 18; i++) {
    const vert = i < 8, x = vert ? 13 + r() * 3 : 18 + (i - 8) * 13.5, y = vert ? 12 + i * 10 : 86 + r() * 2;
    s += `<path d="M${f1(x)} ${f1(y)} q2 -3 4 0 q-2 2 -4 0Z" fill="${pick(r, [blu, red, gold])}" transform="rotate(${f1(r() * 360)} ${f1(x)} ${f1(y)})"/>`;
    s += `<circle cx="${f1(x + 2 + r() * 2)}" cy="${f1(y + (r() - .5) * 4)}" r="1" fill="${gold}" stroke="${ink}" stroke-width=".25"/>`;
  }
  // big historiated initial: blue field, gold letter D, vine inside
  s += `<rect x="18" y="12" width="38" height="38" fill="${red}"/><rect x="20" y="14" width="34" height="34" fill="${blu}"/>`;
  for (let i = 0; i < 26; i++) s += `<circle cx="${f1(21 + r() * 32)}" cy="${f1(15 + r() * 32)}" r=".45" fill="#e8eefc" opacity=".7"/>`;
  s += `<path d="M25 17 H37 Q51 17 51 31 Q51 45 37 45 H25 Z M31 22 V40 H37 Q45 40 45 31 Q45 22 37 22 Z" fill="url(#${lg})" fill-rule="evenodd" stroke="${ink}" stroke-width=".6"/>`;
  s += `<path d="M33 37 Q36 28 42 30 Q38 33 40 37" stroke="${grn}" stroke-width=".8" fill="none"/><circle cx="42" cy="29" r="1.5" fill="${red}"/><circle cx="34" cy="35" r="1.2" fill="${gold2}"/>`;
  s += `<path d="M18 50 Q16 60 22 66 Q14 72 18 84" stroke="${blu}" stroke-width="1.4" fill="none"/><circle cx="22" cy="66" r="1.8" fill="${gold}" stroke="${ink}" stroke-width=".3"/>`;
  // script lines: rows of little black strokes; one red rubric line
  const pk = U('eap'), pr = U('eap');
  s += `<defs><pattern id="${pk}" width="1.3" height="6" patternUnits="userSpaceOnUse"><rect x=".2" width=".6" height="2.6" fill="${ink}"/><rect x=".2" y="2.2" width="1.1" height=".4" fill="${ink}"/></pattern><pattern id="${pr}" width="1.3" height="6" patternUnits="userSpaceOnUse"><rect x=".2" width=".6" height="2.6" fill="${red}"/><rect x=".2" y="2.2" width="1.1" height=".4" fill="${red}"/></pattern></defs>`;
  const line = (x0, x1, y, col) => {
    let t = '', x = x0;
    while (x < x1 - 2) { const w = 3 + Math.round(r() * 7) * 1.3; if (x + w > x1) break; t += `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="2.6" fill="url(#${col === red ? pr : pk})"/>`; x += w + 1.8; }
    return t;
  };
  for (let i = 0; i < 6; i++) s += line(62, 150, 16 + i * 6.4, i === 0 ? red : ink);
  for (let i = 0; i < 6; i++) s += line(26, 150, 56 + i * 5.6, i === 3 ? red : ink);
  // a small gold-ground miniature roundel in the margin
  s += `<circle cx="146" cy="12" r="5" fill="url(#${lg})" stroke="${red}" stroke-width=".8"/>`;
  return sv(s + grainOv(.3));
}

function ea_unicorn(x, y, k) {
  const w = '#f4f0e6', o = '#8f8a7e';
  return `<g transform="translate(${x} ${y}) scale(${k})" stroke="${o}" stroke-width=".5">` +
    `<path d="M-14 -4 Q-14 -12 -6 -12 L8 -12 Q12 -13 14 -18 L17 -27 Q20 -30 23 -28 L26 -24 L24 -22 L20 -23 L18 -16 Q16 -8 12 -4 Z" fill="${w}"/>` +
    `<path d="M-12 -5 L-14 8 M-8 -4 L-6 8 M6 -4 L4 8 M10 -5 L13 8" stroke="${w}" stroke-width="2.2" stroke-linecap="round"/>` +
    `<path d="M-12 -5 L-14 8 M-8 -4 L-6 8 M6 -4 L4 8 M10 -5 L13 8" stroke="${o}" stroke-width=".4" fill="none"/>` +
    `<path d="M-14 -9 Q-22 -10 -21 -2 Q-22 3 -19 5" stroke="${w}" stroke-width="1.6" fill="none"/>` +
    `<path d="M22 -28 L30 -38" stroke="#e2d6a8" stroke-width="1.4" stroke-linecap="round"/><path d="M23.5 -30 l1.5 .6 M25.5 -32.6 l1.5 .6 M27.5 -35.2 l1.4 .6" stroke="${o}" stroke-width=".35"/>` +
    `<path d="M17 -26 Q14 -20 13 -14 M19 -26 Q16 -20 15 -14" stroke="${o}" stroke-width=".4" fill="none"/>` +
    `<path d="M23 -22 l-1 4" stroke="${w}" stroke-width="1"/><circle cx="22" cy="-26" r=".6" fill="#222" stroke="none"/></g>`;
}
function ea_tapestry() {
  const r = rng(61);
  const pw = U('eap');
  let s = `<defs><pattern id="${pw}" width="2" height="1.6" patternUnits="userSpaceOnUse"><rect width="2" height=".5" fill="#000" opacity=".13"/><rect x="1" y=".8" width="1" height=".4" fill="#fff" opacity=".06"/></pattern></defs>`;
  s += bg('#7d2420');
  s += `<rect x="7" y="6" width="146" height="88" fill="#173a2c"/>`;
  // border motif
  for (let x = 4; x < 160; x += 8) s += `<circle cx="${x}" cy="3" r="1.4" fill="#d9b25a"/><circle cx="${x}" cy="97" r="1.4" fill="#d9b25a"/>`;
  for (let y = 10; y < 96; y += 8) s += `<circle cx="3.5" cy="${y}" r="1.4" fill="#d9b25a"/><circle cx="156.5" cy="${y}" r="1.4" fill="#d9b25a"/>`;
  // oak/pomegranate tree behind
  s += `<path d="M118 92 Q116 60 120 40" stroke="#4a3220" stroke-width="3.4" fill="none"/>`;
  s += ea_clump(r, 120, 28, 18, 14, 55, ['#2f5c3a', '#3c7046', '#24482e']);
  for (let i = 0; i < 9; i++) s += `<circle cx="${f1(106 + r() * 28)}" cy="${f1(18 + r() * 22)}" r="1.5" fill="#c23a2a"/>`;
  // millefleurs: hundreds of tiny flowers and plants
  const fc = ['#e8dcc0', '#d4473a', '#e3b23c', '#8fa6d6', '#f2a7a0', '#c96a2b'];
  for (let i = 0; i < 150; i++) {
    const x = 9 + r() * 142, y = 8 + r() * 84;
    if (y < 46 && x > 100) continue;
    const k = r();
    if (k < .35) s += `<path d="M${f1(x)} ${f1(y + 3)} v-3" stroke="#5f8f4e" stroke-width=".5"/><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(.8 + r() * .6)}" fill="${pick(r, fc)}"/>`;
    else if (k < .7) s += `<path d="M${f1(x)} ${f1(y)} l-1.4 -2.2 M${f1(x)} ${f1(y)} l1.4 -2.2 M${f1(x)} ${f1(y)} v-2.6" stroke="#4f7f42" stroke-width=".55"/>`;
    else s += `<g fill="${pick(r, fc)}"><circle cx="${f1(x - .8)}" cy="${f1(y)}" r=".6"/><circle cx="${f1(x + .8)}" cy="${f1(y)}" r=".6"/><circle cx="${f1(x)}" cy="${f1(y - .8)}" r=".6"/><circle cx="${f1(x)}" cy="${f1(y + .8)}" r=".6"/></g>`;
  }
  // a little rabbit and a bird
  s += `<path d="M28 82 q0 -4 4 -4 q3 0 4 2 l2 -4 l.6 4 q1 2 -1 3 Z" fill="#a8896a"/>`;
  s += `<path d="M40 22 q4 -3 7 0 l3 -1 l-2 2 q-3 3 -8 -1Z" fill="#c6c0b0"/>`;
  s += ea_unicorn(66, 66, 1.35);
  s += `<rect x="7" y="6" width="146" height="88" fill="url(#${pw})"/><rect width="160" height="100" fill="url(#${pw})" opacity=".6"/>`;
  return sv(s + vig(.5));
}

function ea_stainedglass() {
  const r = rng(71);
  const jc = ['#b3122e', '#1f3fa8', '#1d7a4a', '#e3a818', '#5b2a86', '#6fa4d8', '#1f3fa8', '#b3122e'];
  const lead = '#151210';
  const [gd, g] = ea_rgrad([[0, '#fff6d8', .55], [1, '#fff6d8', 0]], .5, .5, .5);
  const c1 = U('eac');
  let s = `<defs>${gd}</defs>` + bg('#2b2622');
  // stone masonry
  for (let y = 0; y < 100; y += 7) for (let x = (y / 7 % 2) * 7; x < 160; x += 14) s += `<rect x="${x}" y="${y}" width="13.4" height="6.4" fill="#37312b"/>`;
  // two lancets with pointed arches
  const lancet = (x0, w, top, bot) => `M${x0} ${bot} V${top + w * .7} Q${x0} ${top} ${x0 + w / 2} ${top - w * .3} Q${x0 + w} ${top} ${x0 + w} ${top + w * .7} V${bot}Z`;
  const L1 = lancet(48, 26, 58, 96), L2 = lancet(86, 26, 58, 96);
  s += `<defs><clipPath id="${c1}"><path d="${L1}"/><path d="${L2}"/></clipPath></defs>`;
  s += `<g clip-path="url(#${c1})">`;
  for (let y = 46; y < 98; y += 6.5) for (let x = 46; x < 114; x += 6.5) {
    if (x > 72 && x < 82) continue;
    const jx = (r() - .5) * 2, jy = (r() - .5) * 2;
    s += `<path d="M${f1(x + jx)} ${f1(y + jy)} l6.5 ${f1((r() - .5) * 2)} l${f1((r() - .5) * 2)} 6.5 l-6.5 ${f1((r() - .5) * 2)}Z" fill="${pick(r, jc)}" stroke="${lead}" stroke-width="1"/>`;
  }
  // a saint silhouette in one lancet (simple)
  s += `<circle cx="61" cy="62" r="4.4" fill="#e3a818" stroke="${lead}" stroke-width="1"/><circle cx="61" cy="63" r="2.3" fill="#e9c9a5" stroke="${lead}" stroke-width=".7"/><path d="M55 96 L57 68 L65 68 L67 96Z" fill="#b3122e" stroke="${lead}" stroke-width="1"/>`;
  s += `<circle cx="99" cy="62" r="4.4" fill="#e3a818" stroke="${lead}" stroke-width="1"/><circle cx="99" cy="63" r="2.3" fill="#e9c9a5" stroke="${lead}" stroke-width=".7"/><path d="M93 96 L95 68 L103 68 L105 96Z" fill="#1f3fa8" stroke="${lead}" stroke-width="1"/>`;
  s += `<path d="M48 80 H140 M48 88 H140" stroke="${lead}" stroke-width="1.6"/></g>`;
  s += `<path d="${L1}" fill="none" stroke="#5a5048" stroke-width="2.2"/><path d="${L2}" fill="none" stroke="#5a5048" stroke-width="2.2"/>`;
  // rose window
  const cx = 80, cy = 27, R = 22;
  s += `<circle cx="${cx}" cy="${cy}" r="${R + 2.5}" fill="#5a5048"/>`;
  const N = 12;
  for (let i = 0; i < N; i++) {
    const a0 = i / N * 6.283 - 1.57, a1 = (i + 1) / N * 6.283 - 1.57, am = (a0 + a1) / 2;
    const p = (a, rr) => `${f1(cx + Math.cos(a) * rr)} ${f1(cy + Math.sin(a) * rr)}`;
    s += `<path d="M${p(a0, 8)} L${p(a0, R)} A${R} ${R} 0 0 1 ${p(a1, R)} L${p(a1, 8)} A8 8 0 0 0 ${p(a0, 8)}Z" fill="${i % 2 ? '#1f3fa8' : '#b3122e'}" stroke="${lead}" stroke-width="1"/>`;
    s += `<circle cx="${f1(cx + Math.cos(am) * 15)}" cy="${f1(cy + Math.sin(am) * 15)}" r="3" fill="${i % 2 ? '#e3a818' : '#1d7a4a'}" stroke="${lead}" stroke-width=".9"/>`;
  }
  s += `<circle cx="${cx}" cy="${cy}" r="8" fill="#e3a818" stroke="${lead}" stroke-width="1"/>`;
  for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283; s += `<path d="M${cx} ${cy} L${f1(cx + Math.cos(a) * 8)} ${f1(cy + Math.sin(a) * 8)}" stroke="${lead}" stroke-width=".9"/>`; }
  s += `<circle cx="${cx}" cy="${cy}" r="2.4" fill="#b3122e" stroke="${lead}" stroke-width=".8"/>`;
  // light glow through glass
  s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#${g})"/><ellipse cx="80" cy="76" rx="40" ry="26" fill="url(#${g})" opacity=".55"/>`;
  return sv(s + vig(.9));
}

function ea_shanshui() {
  const r = rng(81);
  const ink = '#2b2a28';
  const [gd, g] = ea_lgrad([[0, ink, .95], [.55, ink, .55], [1, ink, 0]]);
  const [gd2, g2] = ea_lgrad([[0, ink, .5], [1, ink, 0]]);
  const [bd, bl] = ea_blur(.6);
  const cl = U('eac');
  const X0 = 50, X1 = 110;
  let s = `<defs>${gd}${gd2}${bd}<clipPath id="${cl}"><rect x="${X0}" y="9" width="${X1 - X0}" height="82"/></clipPath></defs>`;
  // wall and scroll mounting
  s += bg('#d9d0bd');
  s += `<rect x="${X0 - 5}" y="2" width="${X1 - X0 + 10}" height="96" fill="#6f7f86"/><rect x="${X0 - 3}" y="3" width="${X1 - X0 + 6}" height="94" fill="#c4b79a"/>`;
  s += `<rect x="${X0 - 7}" y="0" width="${X1 - X0 + 14}" height="3" rx="1.5" fill="#3a2a1e"/><rect x="${X0 - 8}" y="97" width="${X1 - X0 + 16}" height="3" rx="1.5" fill="#3a2a1e"/>`;
  s += `<rect x="${X0}" y="9" width="${X1 - X0}" height="82" fill="#ece2c8"/>`;
  s += `<g clip-path="url(#${cl})">`;
  // distant pale peaks
  s += `<path d="M50 50 Q60 30 66 34 Q70 20 76 26 Q80 34 86 32 L110 50 V56 H50Z" fill="url(#${g2})"/>`;
  // main towering peak with texture strokes (cun)
  s += `<path d="M62 64 Q66 40 72 30 Q76 14 82 12 Q88 16 90 30 Q96 38 98 52 Q102 58 104 64Z" fill="url(#${g})"/>`;
  for (let i = 0; i < 26; i++) { const x = 70 + r() * 26, y = 16 + r() * 34; s += `<path d="M${f1(x)} ${f1(y)} q${f1(-1 - r() * 2)} ${f1(3 + r() * 3)} ${f1(-r() * 1.5)} ${f1(5 + r() * 3)}" stroke="${ink}" stroke-width="${f1(.3 + r() * .4)}" fill="none" opacity=".55"/>`; }
  // mist band (empty silk)
  s += `<rect x="50" y="58" width="60" height="9" fill="#ece2c8" filter="url(#${bl})"/>`;
  // middle rock with pines
  s += `<path d="M50 80 Q54 66 62 64 Q68 66 70 72 Q76 70 80 78 L80 92 H50Z" fill="url(#${g})"/>`;
  const pine = (x, y, h) => {
    let t = `<path d="M${f1(x)} ${f1(y)} q-1 ${f1(-h * .5)} ${f1(.6)} ${f1(-h)}" stroke="${ink}" stroke-width=".7" fill="none"/>`;
    for (let k = 0; k < 4; k++) { const yy = y - h * (.35 + k * .18), w = 4 - k * .7; t += `<path d="M${f1(x - w)} ${f1(yy)} q${f1(w)} -1.4 ${f1(w * 2)} 0" stroke="${ink}" stroke-width="1.1" fill="none"/>`; }
    return t;
  };
  s += pine(58, 68, 11) + pine(63, 66, 13) + pine(67, 69, 9);
  // pavilion at the foot of the peak, tiny figure on a bridge
  s += `<path d="M86 66 l4 -2.6 l4 2.6Z M87 66 h6 v3 h-6z" fill="${ink}" opacity=".85"/>`;
  s += `<path d="M78 84 Q88 80 98 84" stroke="${ink}" stroke-width=".7" fill="none"/>`;
  s += fig(88, 82, 3.2, ink);
  // river ripples
  for (let i = 0; i < 5; i++) s += `<path d="M${f1(84 + r() * 18)} ${f1(87 + i * 1.3)} h${f1(3 + r() * 4)}" stroke="${ink}" stroke-width=".3" opacity=".5"/>`;
  // right foreground rock
  s += `<path d="M96 92 Q100 82 106 80 L110 80 V92Z" fill="${ink}" opacity=".75"/>`;
  s += `</g>`;
  // faint calligraphy column + red seal
  for (let i = 0; i < 7; i++) s += `<rect x="54" y="${f1(12 + i * 3.4)}" width="${f1(1.5 + r() * 1.5)}" height="1.6" fill="${ink}" opacity=".6"/>`;
  s += `<rect x="53.4" y="37" width="4" height="4" fill="#b8322a"/><rect x="101" y="84" width="3.6" height="3.6" fill="#b8322a" opacity=".85"/>`;
  return sv(s + grainOv(.3));
}

function ea_persian() {
  const r = rng(91);
  const gold = '#d6aa3a', lap = '#1f3a8a', tq = '#2aa3a0', ink = '#2a1c14';
  const pt = U('eap'), pc = U('eap');
  let s = `<defs><pattern id="${pt}" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="${tq}"/><path d="M2.5 .4 L4.6 2.5 L2.5 4.6 L.4 2.5Z" fill="${lap}"/><circle cx="2.5" cy="2.5" r=".7" fill="#f2e6c4"/></pattern>`;
  s += `<pattern id="${pc}" width="6" height="4" patternUnits="userSpaceOnUse"><rect width="6" height="4" fill="#a8282a"/><path d="M0 2 L3 0 L6 2 L3 4Z" fill="#e1b04a"/><circle cx="3" cy="2" r=".6" fill="${lap}"/></pattern></defs>`;
  // outer borders
  s += bg('#e9dcb8') + `<rect x="4" y="4" width="152" height="92" fill="${gold}"/><rect x="6" y="6" width="148" height="88" fill="${lap}"/>`;
  // gold sky with Chinese-style cloud bands
  s += `<rect x="8" y="8" width="144" height="22" fill="${gold}"/>`;
  for (let i = 0; i < 4; i++) { const x = 18 + i * 34 + r() * 8, y = 14 + r() * 8; s += `<path d="M${f1(x)} ${f1(y)} q4 -5 8 0 q4 -4 7 1 q-3 3 -7 1 q-4 3 -8 -2Z" fill="#f3efe4" stroke="#7a5a2a" stroke-width=".4"/>`; }
  // ground: steep tilted-up green meadow with flowers (bird's-eye)
  s += `<rect x="8" y="30" width="144" height="62" fill="#5c8f52"/>`;
  s += `<path d="M8 30 Q40 26 70 30 L70 32 L8 32Z" fill="#7aa86a"/>`;
  for (let i = 0; i < 80; i++) s += `<circle cx="${f1(10 + r() * 60)}" cy="${f1(34 + r() * 56)}" r="${f1(.5 + r() * .5)}" fill="${pick(r, ['#f3efe4', '#e85a5a', '#f1c84a'])}"/>`;
  // silver stream
  s += `<path d="M8 72 Q24 66 38 74 T70 70" stroke="#c9d3da" stroke-width="3" fill="none"/><path d="M8 72 Q24 66 38 74 T70 70" stroke="#8796a2" stroke-width=".5" fill="none"/>`;
  // cypress and blossoming tree
  s += `<path d="M24 60 Q18 42 24 28 Q30 42 24 60Z" fill="#1f4a30"/><rect x="23.3" y="58" width="1.4" height="4" fill="${ink}"/>`;
  s += `<path d="M46 60 Q45 46 48 36" stroke="${ink}" stroke-width="1.2" fill="none"/>`;
  for (let i = 0; i < 30; i++) s += `<circle cx="${f1(40 + r() * 16)}" cy="${f1(28 + r() * 14)}" r="${f1(.8 + r() * .8)}" fill="${pick(r, ['#f6d7e2', '#fff', '#eab0c3'])}"/>`;
  // pavilion: facade with tiled walls and pointed arch (iwan)
  s += `<rect x="74" y="26" width="76" height="58" fill="url(#${pt})"/>`;
  s += `<rect x="74" y="24" width="76" height="4" fill="${gold}"/><rect x="74" y="80" width="76" height="4" fill="#d9c9a0"/>`;
  s += `<path d="M90 80 V46 Q90 34 104 30 Q118 34 118 46 V80Z" fill="#f2e6c4"/>`;
  s += `<path d="M93 80 V47 Q93 37 104 33 Q115 37 115 47 V80Z" fill="${lap}"/>`;
  for (let i = 0; i < 18; i++) s += `<circle cx="${f1(95 + r() * 18)}" cy="${f1(40 + r() * 36)}" r=".5" fill="${gold}"/>`;
  // carpet seen from above, tilted up
  s += `<rect x="94" y="62" width="20" height="16" fill="url(#${pc})" stroke="${gold}" stroke-width="1"/>`;
  // figures: seated prince, standing attendant, figure at right window
  const per = (x, y, robe, turban, h) => `<path d="M${x - h * .22} ${y} Q${x - h * .24} ${y - h * .6} ${x} ${y - h * .72} Q${x + h * .24} ${y - h * .6} ${x + h * .22} ${y}Z" fill="${robe}" stroke="${ink}" stroke-width=".35"/><circle cx="${x}" cy="${f1(y - h * .82)}" r="${f1(h * .12)}" fill="#f0d7b4"/><ellipse cx="${x}" cy="${f1(y - h * .94)}" rx="${f1(h * .15)}" ry="${f1(h * .08)}" fill="${turban}"/><path d="M${x} ${f1(y - h)} v${f1(-h * .1)}" stroke="#a8282a" stroke-width=".7"/>`;
  s += per(104, 70, '#e4572e', '#fff', 14) + per(122, 90, '#4b8b3b', '#f1c84a', 16) + per(60, 88, '#c23b6a', '#fff', 15);
  // side window with lattice
  s += `<rect x="128" y="36" width="14" height="22" fill="#f2e6c4"/><path d="M128 43 H142 M128 50 H142 M135 36 V58" stroke="${ink}" stroke-width=".6"/><path d="M128 36 h14 v22 h-14z" fill="none" stroke="${gold}" stroke-width="1"/>`;
  s += `<path d="M80 34 h6 v10 h-6z" fill="#f2e6c4" stroke="${gold}" stroke-width=".8"/>`;
  return sv(s + grainOv(.25));
}

/* ===== RENAISSANCE TO ROMANTICISM ===== */

function ea_earlyren() {
  const r = rng(101);
  const vx = 80, vy = 44;
  let s = bg('#e9dcc4');
  // flat ultramarine sky and soft hills
  s += `<rect width="160" height="62" fill="#5c7cba"/><rect width="160" height="22" fill="#4a69a8"/>`;
  s += `<path d="M0 62 Q30 52 60 58 Q100 50 160 60 V62H0Z" fill="#8aa07a"/>`;
  // floor: checkerboard in one-point linear perspective
  const rows = [62, 65, 69, 74, 80.5, 89, 100];
  const xs = [-200, -120, -60, -10, 30, 60, 80, 100, 130, 170, 220, 280, 360];
  const at = (x, y) => vx + (x - vx) * (y - vy) / (100 - vy);
  for (let i = 0; i < rows.length - 1; i++) for (let j = 0; j < xs.length - 1; j++) {
    const y0 = rows[i], y1 = rows[i + 1];
    s += `<polygon points="${pts([[at(xs[j], y0), y0], [at(xs[j + 1], y0), y0], [at(xs[j + 1], y1), y1], [at(xs[j], y1), y1]])}" fill="${(i + j) % 2 ? '#c99b8a' : '#efe4cf'}"/>`;
  }
  // loggia: thin columns and round arches, pale stone
  const stone = '#f1e8d6', sh = '#cdbfa6';
  s += `<rect x="10" y="4" width="140" height="6" fill="${stone}"/>`;
  [[10], [56], [104], [146]].forEach(([x]) => { s += `<rect x="${x}" y="10" width="4" height="54" fill="${stone}"/><rect x="${x + 3}" y="10" width="1" height="54" fill="${sh}"/><rect x="${x - 1}" y="60" width="6" height="4" fill="${sh}"/>`; });
  s += `<path d="M14 10 V24 A21 14 0 0 1 56 24 V10Z M60 10 V24 A22 14 0 0 1 104 24 V10Z M108 10 V24 A19 14 0 0 1 146 24 V10Z" fill="${stone}"/>`;
  s += `<path d="M14 24 A21 14 0 0 1 56 24 M60 24 A22 14 0 0 1 104 24 M108 24 A19 14 0 0 1 146 24" stroke="${sh}" stroke-width="1" fill="none"/>`;
  // kneeling angel (pink robe, gilded halo, coloured wings)
  s += `<path d="M30 62 Q24 42 34 32 Q30 46 40 56Z" fill="#c9577a"/><path d="M31 56 Q26 44 33 36" stroke="#e8c45a" stroke-width="1" fill="none"/>`;
  s += `<path d="M34 72 Q34 54 40 44 Q46 46 48 56 L52 60 L46 64 L50 72Z" fill="#e7a3a0"/><path d="M40 50 Q42 60 40 70 M44 52 Q46 60 46 70" stroke="#c7807d" stroke-width=".7" fill="none"/>`;
  s += `<circle cx="42" cy="38" r="6" fill="#e2b743" stroke="#a37a1e" stroke-width=".6"/><circle cx="42.5" cy="39" r="3.6" fill="#f0d2b4"/><path d="M39 37 Q42 33 46 37 L46 35 Q42 32 39 35Z" fill="#c78a3a"/>`;
  s += `<path d="M47 52 L54 48" stroke="#f0d2b4" stroke-width="1.6" stroke-linecap="round"/>`;
  // seated Virgin in ultramarine
  s += `<path d="M106 72 Q104 52 112 42 Q120 44 122 56 L126 72Z" fill="#2f4c9a"/><path d="M110 50 Q112 60 110 70 M116 48 Q120 60 120 70" stroke="#22397a" stroke-width=".8" fill="none"/>`;
  s += `<path d="M110 46 Q112 54 116 52 Q114 46 114 43Z" fill="#b6413a"/>`;
  s += `<circle cx="114" cy="36" r="6" fill="#e2b743" stroke="#a37a1e" stroke-width=".6"/><circle cx="113.5" cy="37" r="3.6" fill="#f0d2b4"/><path d="M109.6 38 Q110 32 114 32 Q118 32 118 38 Q116 34 114 34 Q111 34 109.6 38Z" fill="#2f4c9a"/>`;
  s += `<path d="M110 52 L108 48 M112 52 L112 48" stroke="#f0d2b4" stroke-width="1.2" stroke-linecap="round"/>`;
  // fresco: chalky bloom and fine cracks
  for (let i = 0; i < 6; i++) s += `<path d="M${f1(r() * 160)} ${f1(r() * 100)} l${f1((r() - .5) * 14)} ${f1((r() - .5) * 10)} l${f1((r() - .5) * 8)} ${f1((r() - .5) * 8)}" stroke="#7a6a58" stroke-width=".3" fill="none" opacity=".6"/>`;
  s += `<rect width="160" height="100" fill="#f4ecd8" opacity=".14"/>`;
  return sv(s + grainOv(.4));
}

function ea_highren() {
  const r = rng(111);
  const [sd, sk] = ea_lgrad([[0, '#8fa9b0'], [.45, '#dcd6b4'], [.62, '#e8dcb2'], [1, '#6a6a48']]);
  const [b1d, b1] = ea_blur(1.1);
  const [b2d, b2] = ea_blur(.45);
  const [fd, fg] = ea_rgrad([[0, '#f3d9b8'], [.6, '#d2a47c'], [1, '#7a5636']], .42, .38, .62);
  const [md, mg] = ea_lgrad([[0, '#3a5488'], [.6, '#24386a'], [1, '#141e3c']], .3, 1);
  let s = `<defs>${sd}${b1d}${b2d}${fd}${md}</defs><rect width="160" height="100" fill="url(#${sk})"/>`;
  // hazy blue aerial-perspective landscape with a winding river and slender trees
  s += `<g filter="url(#${b1})"><path d="M0 50 Q12 36 24 42 Q34 28 46 38 Q54 44 60 50 V62 H0Z" fill="#93a9b6"/><path d="M104 48 Q116 30 128 38 Q140 30 150 40 Q156 44 160 42 V62 H104Z" fill="#93a9b6"/>`;
  s += `<path d="M0 58 Q30 52 60 58 L100 58 Q130 52 160 58 V100 H0Z" fill="#7d8a66"/><path d="M4 66 Q30 58 46 64 T70 62 M100 62 Q120 58 156 64" stroke="#d6dccb" stroke-width="1.8" fill="none"/></g>`;
  s += `<g filter="url(#${b2})"><path d="M0 74 Q40 66 80 72 Q120 66 160 74 V100 H0Z" fill="#545434"/>`;
  [[14, 72, 30], [22, 74, 24], [142, 72, 32], [150, 74, 22]].forEach(([x, y, h]) => { s += `<path d="M${x} ${y} Q${x - 1} ${y - h / 2} ${x + 1} ${y - h}" stroke="#4a3e28" stroke-width=".9" fill="none"/>`; s += ea_clump(r, x + 1, y - h + 4, 5, 6, 12, ['#5a6440', '#6d7650', '#48502e'], .9); });
  s += `</g>`;
  // pyramidal group: blue mantle forms a stable triangle
  s += `<path d="M80 18 Q68 22 64 40 Q60 62 42 96 L120 96 Q102 64 96 40 Q92 22 80 18Z" fill="url(#${mg})"/>`;
  s += `<path d="M64 40 Q60 62 42 96 M96 40 Q100 64 120 96" stroke="#c9a24a" stroke-width=".7" fill="none" opacity=".8"/>`;
  s += `<path d="M71 40 Q80 37 89 40 L92 58 Q80 62 68 58Z" fill="#a8362a"/><path d="M73 40 Q80 44 87 40" stroke="#e2c08a" stroke-width=".6" fill="none"/>`;
  s += `<path d="M58 80 Q80 70 104 80 L110 92 Q80 96 54 92Z" fill="#2e4478"/><path d="M66 84 Q80 78 98 86" stroke="#4a64a0" stroke-width="1" fill="none"/>`;
  // Madonna's head: thin dark veil, soft modelled face, downcast eyes
  s += `<rect x="77.4" y="34" width="5.2" height="6" fill="#d2a47c"/>`;
  s += `<path d="M72 34 Q71 20 80 19 Q89 20 88 34 Q86 26 80 25 Q74 26 72 34Z" fill="#4a3220"/>`;
  s += `<ellipse cx="80" cy="30" rx="6" ry="7.6" fill="url(#${fg})"/>`;
  s += `<path d="M73 28 Q74 22 80 22 Q86 22 87 28 Q84 24 80 24 Q76 24 73 28Z" fill="#5a3c22"/>`;
  s += `<g filter="url(#${b2})" fill="none"><path d="M76 29.6 q1.6 .9 3 0 M81.2 29.6 q1.6 .9 3 0" stroke="#6a4428" stroke-width=".7"/><path d="M80 30 l-.6 4.4 l1.4 .2" stroke="#a8784e" stroke-width=".6"/><path d="M78.3 36.4 q1.7 .8 3.4 0" stroke="#9a5a44" stroke-width=".7"/></g>`;
  // child seated on her lap at left, with soft modelling
  s += `<path d="M58 78 Q60 66 68 66 Q76 68 78 76 L80 84 Q70 88 60 86Z" fill="#e0b48c"/>`;
  s += `<path d="M78 78 Q86 82 92 80" stroke="#e0b48c" stroke-width="3" stroke-linecap="round" fill="none"/>`;
  s += `<circle cx="66" cy="60" r="5.4" fill="url(#${fg})"/><path d="M61 58 Q63 54 68 55 Q71 56 71 59 Q68 56 64 58Z" fill="#b0824a"/>`;
  s += `<g filter="url(#${b2})"><path d="M64 60.6 h1.6 M68 60.6 h1.4" stroke="#6a4428" stroke-width=".6"/></g>`;
  s += `<path d="M86 52 Q80 62 72 66" stroke="#d8ac84" stroke-width="2.6" stroke-linecap="round" fill="none"/>`;
  return sv(s + vig(.85) + grainOv(.2));
}

function ea_northren() {
  const r = rng(121);
  const [wd, wg] = ea_lgrad([[0, '#2f3a26'], [1, '#1a2116']]);
  const [md, mg] = ea_rgrad([[0, '#d9dccb'], [.6, '#9aa08a'], [1, '#3e4434']], .4, .38, .6);
  const [rd, rg] = ea_lgrad([[0, '#c3262a'], [1, '#6a0e14']], 1, 1);
  let s = `<defs>${wd}${md}${rd}</defs><rect width="160" height="100" fill="url(#${wg})"/>`;
  // window with bullseye panes, left
  s += `<rect x="8" y="8" width="36" height="52" fill="#3a2a1a"/><rect x="10" y="10" width="32" height="48" fill="#cfd9cf"/>`;
  for (let y = 0; y < 8; y++) for (let x = 0; x < 5; x++) s += `<circle cx="${f1(13.2 + x * 6.4)}" cy="${f1(13 + y * 6)}" r="2.8" fill="#dfe8df" stroke="#7a8478" stroke-width=".45"/><circle cx="${f1(13.2 + x * 6.4)}" cy="${f1(13 + y * 6)}" r=".8" fill="#a8b5a6"/>`;
  s += `<rect x="25.4" y="10" width="1.2" height="48" fill="#3a2a1a"/>`;
  // arched opening at the back with a tiny detailed landscape
  s += `<path d="M62 46 V22 Q62 10 76 10 Q90 10 90 22 V46Z" fill="#9bb6c9"/>`;
  s += `<path d="M62 34 Q70 30 78 34 Q84 30 90 33 V46 H62Z" fill="#5d7a4a"/><path d="M62 40 Q74 36 90 41" stroke="#bcd0d8" stroke-width="1.4" fill="none"/>`;
  s += `<path d="M70 32 h2 v-5 l1 -2 l1 2 v5 h2 v-3 h1 v3" stroke="#6a6a6a" stroke-width=".6" fill="#c7bfae"/><path d="M82 34 l1.4 -4 l1.4 4" fill="#2e4a2a"/><path d="M85.5 34 l1 -3 l1 3" fill="#2e4a2a"/>`;
  for (let i = 0; i < 10; i++) s += `<circle cx="${f1(64 + r() * 24)}" cy="${f1(42 + r() * 3)}" r=".35" fill="#f2f0e0"/>`;
  s += `<path d="M62 46 V22 Q62 10 76 10 Q90 10 90 22 V46" stroke="#6e5a3a" stroke-width="1.6" fill="none"/>`;
  // convex mirror on the back wall
  s += `<circle cx="122" cy="26" r="11" fill="#5a4426"/>`;
  for (let i = 0; i < 10; i++) { const a = i / 10 * 6.283; s += `<circle cx="${f1(122 + Math.cos(a) * 10)}" cy="${f1(26 + Math.sin(a) * 10)}" r="1.7" fill="#7a6036" stroke="#3a2a14" stroke-width=".3"/>`; }
  s += `<circle cx="122" cy="26" r="7.6" fill="url(#${mg})"/><path d="M117 30 Q122 22 127 30" stroke="#5a5a48" stroke-width=".5" fill="none"/><rect x="120.8" y="25" width="2.4" height="4" fill="#2a2a20" opacity=".6"/><circle cx="119.4" cy="23" r="1.4" fill="#fff" opacity=".7"/>`;
  // red brocade canopy, right
  s += `<path d="M138 0 H160 V100 H140 Q146 70 140 40 Q136 20 138 0Z" fill="url(#${rg})"/>`;
  for (let i = 0; i < 4; i++) s += `<path d="M${142 + i * 4} 4 Q${146 + i * 4 - (i % 2) * 6} 50 ${144 + i * 4} 98" stroke="#4a0a0e" stroke-width=".6" fill="none"/>`;
  // table with cloth, lily in vase, book, brass candlestick
  s += `<rect x="0" y="66" width="136" height="34" fill="#4a2e18"/><rect x="0" y="66" width="136" height="3" fill="#6a4426"/>`;
  s += `<path d="M10 69 H128 L132 100 H6Z" fill="#1d3e6a"/>`;
  const pb = U('eap');
  s += `<defs><pattern id="${pb}" width="7" height="6" patternUnits="userSpaceOnUse"><path d="M3.5 .6 Q5.6 3 3.5 5.4 Q1.4 3 3.5 .6Z" fill="none" stroke="#c9a24a" stroke-width=".45"/><circle cx="3.5" cy="3" r=".6" fill="#c9a24a"/><circle cx="0" cy="0" r=".4" fill="#c9a24a"/><circle cx="7" cy="6" r=".4" fill="#c9a24a"/></pattern></defs><path d="M10 69 H128 L132 100 H6Z" fill="url(#${pb})"/>`;
  s += `<path d="M30 70 Q28 62 32 56 L38 56 Q42 62 40 70Z" fill="#c9c4b4"/><path d="M33 58 Q35 63 34 69" stroke="#fff" stroke-width=".7" opacity=".8" fill="none"/>`;
  s += `<path d="M35 56 Q34 44 36 34 M36 46 L30 40 M36 42 Q42 38 44 36" stroke="#4a6a2a" stroke-width=".8" fill="none"/>`;
  [[36, 32], [29.5, 38.5], [44, 34]].forEach(([x, y]) => s += `<path d="M${x} ${y} l-2.5 -4 l2.5 1.5 l2.5 -1.5Z" fill="#f4f2ea" stroke="#b8b49a" stroke-width=".3"/><circle cx="${x}" cy="${y - 1.4}" r=".5" fill="#d98a2a"/>`);
  s += `<path d="M84 69 L100 64 L116 69 L100 72Z" fill="#efe6cc" stroke="#8a7a5a" stroke-width=".4"/><path d="M100 64 V72" stroke="#8a7a5a" stroke-width=".4"/>`;
  for (let i = 0; i < 4; i++) s += `<path d="M${88 + i * 2.5} ${68.2 - i * .7} l8 -2.4 M${103 + i * 2.5} ${65 + i * .7} l8 2.4" stroke="#6a5a4a" stroke-width=".3"/>`;
  s += `<path d="M62 68 h10 l-3 -2 h-4Z M66 66 V54 h2 V66" fill="#c99a3a"/><rect x="66.2" y="50" width="1.6" height="4.4" fill="#f2ead2"/><path d="M67 50 q-.8 -1.6 0 -3 q.8 1.4 0 3Z" fill="#f6c24a"/>`;
  return sv(s + grainOv(.2));
}

function ea_mannerism() {
  const r = rng(131);
  const [sd, sk] = ea_lgrad([[0, '#1e2a2a'], [.5, '#3a4a46'], [1, '#14191a']], .3, 1);
  const [bd, bl] = ea_blur(1.5);
  let s = `<defs>${sd}${bd}</defs><rect width="160" height="100" fill="url(#${sk})"/>`;
  // storm clouds with sharp white rims
  for (let i = 0; i < 10; i++) { const x = r() * 160, y = r() * 60, w = 20 + r() * 30; s += `<path d="M${f1(x - w)} ${f1(y)} Q${f1(x)} ${f1(y - 14 - r() * 8)} ${f1(x + w)} ${f1(y + 4)}" stroke="#d6e0d8" stroke-width="${f1(1.5 + r() * 3)}" fill="none" opacity="${f1(.3 + r() * .4)}" filter="url(#${bl})"/>`; }
  s += `<path d="M0 90 L20 80 L30 84 L44 76 L56 82 L56 100 H0Z" fill="#2e3a24"/><path d="M28 80 v-6 h3 v-3 l1.5 -2 l1.5 2 v9" fill="#c8c0a2"/>`;
  s += `<path d="M104 100 L112 84 L130 80 L160 86 V100Z" fill="#2a2a1e"/>`;
  // elongated serpentine figure 1 (acid pink & lime), twisting up
  s += `<path d="M76 98 Q70 80 78 64 Q86 50 78 34 Q76 26 80 20 L84 20 Q88 30 90 40 Q94 56 86 70 Q82 84 90 98Z" fill="#e8508a"/>`;
  s += `<path d="M78 66 Q88 54 84 38 M82 84 Q80 74 86 66" stroke="#a62060" stroke-width="1" fill="none"/><path d="M80 60 Q90 52 88 40" stroke="#ffb6d2" stroke-width="1.1" fill="none"/>`;
  s += `<path d="M84 36 Q96 44 106 40 Q112 46 102 46 Q94 50 84 42Z" fill="#b8e34a"/><path d="M86 40 Q96 44 104 42" stroke="#eaff9a" stroke-width=".8" fill="none"/>`;
  s += `<path d="M80 22 Q74 10 68 4" stroke="#e4c7a8" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M84 22 Q90 12 98 8" stroke="#e4c7a8" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  s += `<ellipse cx="82" cy="16" rx="2.6" ry="3.6" fill="#e9cfb2" transform="rotate(18 82 16)"/><path d="M80 13 Q82 11 85 13" stroke="#3a2a1a" stroke-width="1" fill="none"/>`;
  // second, smaller elongated figure in sky blue / acid yellow, leaning
  s += `<path d="M40 98 Q38 80 44 66 Q50 54 46 42 L50 40 Q56 56 52 70 Q50 84 54 98Z" fill="#6fb8e0"/><path d="M44 70 Q52 58 48 44" stroke="#c6ecff" stroke-width="1" fill="none"/>`;
  s += `<path d="M48 54 Q56 48 62 52 L60 56 Q54 54 50 60Z" fill="#f0e04a"/><ellipse cx="48" cy="37" rx="2.2" ry="3.2" fill="#e9cfb2" transform="rotate(-14 48 37)"/>`;
  s += `<path d="M48 44 Q42 36 36 34" stroke="#e4c7a8" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  // third figure, right, olive-orange
  s += `<path d="M118 98 Q122 76 116 60 Q114 50 118 44 L122 44 Q126 58 126 70 Q126 86 130 98Z" fill="#e88a2a"/><path d="M118 62 Q124 72 122 88" stroke="#ffd09a" stroke-width="1" fill="none"/>`;
  s += `<ellipse cx="120" cy="40" rx="2.2" ry="3.2" fill="#e9cfb2"/><path d="M124 50 Q132 40 136 30" stroke="#e4c7a8" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  return sv(s + vig(.8) + grainOv(.25));
}

function ea_baroque() {
  const lit = (c1, c2) => ea_rgrad([[0, c1], [.5, c2], [1, '#0c0806']], .72, .28, .75);
  const [bm, beam] = ea_lgrad([[0, '#ffe9b8', .6], [1, '#ffe9b8', 0]], -.6, 1);
  const [f1d, fA] = lit('#f8d6a8', '#b07448');
  const [rd, rG] = lit('#e8483a', '#7a1410');
  const [wd, wG] = lit('#fbf4e6', '#a89a80');
  const [yd, yG] = lit('#e2b04a', '#6a4810');
  let s = `<defs>${bm}${f1d}${rd}${wd}${yd}</defs>` + bg('#0c0806');
  s += `<polygon points="160,0 116,0 24,100 100,100" fill="url(#${beam})" opacity=".45"/>`;
  // table
  s += `<path d="M0 78 L118 74 L118 100 H0Z" fill="#24160c"/><path d="M0 78 L118 74" stroke="#8a5a30" stroke-width="1"/>`;
  // head in three-quarter view facing right: skull, nose, eye socket, beard
  const head = (x, y, k, beard, hat) => {
    let t = `<g transform="translate(${x} ${y}) scale(${k})">`;
    t += `<path d="M-6 -2 Q-7 -10 0 -11 Q6 -11 7 -4 L8.6 -1 L7 0 Q7 4 4 6 Q0 8 -3 6 Q-6 4 -6 -2Z" fill="url(#${fA})"/>`;
    t += `<path d="M2.6 -4 q1.6 -.8 3 0" stroke="#3a1e10" stroke-width=".9" fill="none"/><circle cx="4" cy="-3.2" r=".6" fill="#1a0e08"/>`;
    t += `<path d="M7 -2.4 L8.6 -1 L7 0" fill="#c48a5a"/><path d="M4 3 q1.6 .4 2.6 -.4" stroke="#7a3a24" stroke-width=".7" fill="none"/>`;
    t += `<path d="M-6.4 -1 Q-7 -12 1 -11.6 Q5 -11 6 -8 Q0 -9 -2 -4 Q-3 0 -6.4 -1Z" fill="#1e120a"/>`;
    if (beard) t += `<path d="M-3 4 Q0 10 5 6 Q6 4 7 2 Q4 5 0 4.4Z" fill="#3a2414"/>`;
    if (hat) t += `<path d="M-8 -9 Q0 -16 9 -10 L7 -8 Q0 -11 -6 -7Z" fill="#1a1410"/><path d="M-4 -12 Q-10 -18 -14 -14" stroke="#f2ead8" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
    return t + `</g>`;
  };
  // seated youth with feathered hat, red doublet
  s += `<path d="M10 100 Q8 76 22 66 Q36 60 46 70 L50 100Z" fill="url(#${rG})"/><path d="M22 68 Q30 74 30 100" stroke="#3a0a08" stroke-width=".8" fill="none"/>`;
  s += head(30, 54, 1.15, false, true);
  // older bearded man, white shirt, counting coins
  s += `<path d="M54 100 Q52 74 66 66 Q82 62 88 76 L90 100Z" fill="url(#${wG})"/><path d="M66 70 Q72 80 70 100" stroke="#6a604a" stroke-width=".7" fill="none"/>`;
  s += head(70, 54, 1.1, true, false);
  s += `<path d="M84 80 Q92 78 96 74" stroke="#c88a5a" stroke-width="2.4" stroke-linecap="round" fill="none"/>`;
  // standing figure at right, golden cloak, pointing across the light (faces left)
  s += `<path d="M118 100 Q114 62 126 48 Q140 46 146 64 L152 100Z" fill="url(#${yG})"/><path d="M128 54 Q134 74 130 100" stroke="#3a2808" stroke-width=".8" fill="none"/>`;
  s += `<g transform="translate(266 0) scale(-1 1)">${head(134, 38, 1.15, true, false)}</g>`;
  s += `<path d="M124 56 Q108 50 94 46" stroke="#e6b688" stroke-width="3.2" stroke-linecap="round" fill="none"/><path d="M94 46 L88 44.6" stroke="#e6b688" stroke-width="1.2" stroke-linecap="round"/>`;
  s += `<path d="M124 57.6 Q108 52.6 94 48" stroke="#5a3418" stroke-width="1" fill="none" opacity=".7"/>`;
  [[40, 80], [44, 81], [48, 79.5], [92, 77], [96, 77.6]].forEach(([x, y]) => s += `<ellipse cx="${x}" cy="${y}" rx="2" ry=".8" fill="#e8c35a"/>`);
  return sv(s + vig(.6) + grainOv(.3));
}

function ea_dutchstill() {
  const r = rng(141);
  const [wd, wg] = ea_rgrad([[0, '#4a4430'], [.6, '#2a2618'], [1, '#100e08']], .35, .35, .8);
  const [gd, gg] = ea_lgrad([[0, '#9fb07a', .55], [1, '#3a4a2a', .75]], 1, 0);
  const [ld, lg] = ea_rgrad([[0, '#fff1a0'], [.5, '#e8c22a'], [1, '#8a6a0a']], .35, .3, .7);
  const [pd, pg] = ea_rgrad([[0, '#e8e8e0'], [.5, '#9a9a90'], [1, '#3a3a34']], .3, .3, .8);
  const [kd, kg] = ea_rgrad([[0, '#e8dcc0'], [.6, '#a89a7a'], [1, '#3a3020']], .35, .3, .7);
  const [cd, cg] = ea_lgrad([[0, '#f2eee2'], [1, '#9a9488']]);
  let s = `<defs>${wd}${gd}${ld}${pd}${kd}${cd}</defs><rect width="160" height="100" fill="url(#${wg})"/>`;
  // table with dark green cloth and white cloth spill
  s += `<rect x="0" y="66" width="160" height="34" fill="#1a1e12"/><path d="M0 66 H160" stroke="#3a3a22" stroke-width="1"/>`;
  s += `<path d="M58 66 L152 66 L153 72 L58 72Z" fill="#e6e0d2"/><path d="M58 72 L153 72 L154 92 Q148 95 142 92 Q136 96 128 92 Q120 96 112 92 Q104 95 96 92 Q88 96 80 92 Q72 95 64 92 Q60 94 57 92Z" fill="url(#${cg})"/>`;
  s += `<path d="M66 73 V92 M80 73 V93 M96 73 V92 M112 73 V93 M128 73 V93 M142 73 V92" stroke="#b8b2a4" stroke-width=".9"/><path d="M58 72 H153" stroke="#fff" stroke-width=".6" opacity=".7"/>`;
  // skull (vanitas) at left in shadow
  s += `<path d="M14 66 Q10 50 24 46 Q38 46 38 60 Q38 66 32 68 L30 72 H18 Q14 70 14 66Z" fill="url(#${kg})"/>`;
  s += `<ellipse cx="22" cy="58" rx="3" ry="3.4" fill="#1a160c"/><ellipse cx="31" cy="58" rx="2.6" ry="3.2" fill="#1a160c"/><path d="M26 62 l-1.4 3 h2.8Z" fill="#1a160c"/><path d="M19 70 h12" stroke="#3a3020" stroke-width=".6" stroke-dasharray="1 .8"/>`;
  // tall roemer glass: transparent green with prunts and highlights
  s += `<path d="M70 18 Q66 32 72 40 L74 42 L74 58 L68 64 L84 64 L78 58 L78 42 L80 40 Q86 32 82 18Z" fill="url(#${gg})"/>`;
  s += `<path d="M70 18 Q66 32 72 40 L74 42 L74 58 L68 64 L84 64 L78 58 L78 42 L80 40 Q86 32 82 18Z" fill="none" stroke="#c8d4b0" stroke-width=".4" opacity=".7"/>`;
  s += `<path d="M72 22 Q70 30 73 37" stroke="#fff" stroke-width="1" opacity=".75" fill="none"/><rect x="79" y="22" width="1.4" height="4" fill="#fff" opacity=".6"/>`;
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) s += `<circle cx="${f1(74.6 + j * 2.8)}" cy="${f1(46 + i * 4)}" r="1.2" fill="#7a9a4a" stroke="#d8e8b0" stroke-width=".3"/>`;
  s += `<path d="M71 26 Q76 28 81 26" stroke="#e8e0a0" stroke-width=".4" fill="none" opacity=".6"/>`;
  // pewter plate tilted over the edge, lemon with hanging spiral peel
  s += `<ellipse cx="108" cy="66" rx="24" ry="5" fill="url(#${pg})"/><ellipse cx="108" cy="65.4" rx="18" ry="3.4" fill="#8a8a82"/><path d="M90 65 Q108 62 126 65" stroke="#f2f2ea" stroke-width=".6" fill="none" opacity=".8"/>`;
  s += `<ellipse cx="106" cy="58" rx="9" ry="7" fill="url(#${lg})"/><circle cx="103" cy="55" r="1.4" fill="#fffbe0" opacity=".85"/>`;
  s += `<path d="M114 60 Q122 64 120 70 Q116 76 124 80 Q130 84 126 90" stroke="#e8c22a" stroke-width="2" fill="none"/><path d="M114 60 Q122 64 120 70 Q116 76 124 80 Q130 84 126 90" stroke="#f6f0d0" stroke-width=".6" fill="none" transform="translate(-.8 0)"/>`;
  // grapes and a hazelnut
  for (let i = 0; i < 9; i++) s += `<circle cx="${f1(48 + (i % 3) * 3.2 + (i > 5 ? 1.6 : 0))}" cy="${f1(60 + Math.floor(i / 3) * 3)}" r="1.8" fill="#3a2a44"/><circle cx="${f1(47.4 + (i % 3) * 3.2 + (i > 5 ? 1.6 : 0))}" cy="${f1(59.4 + Math.floor(i / 3) * 3)}" r=".45" fill="#c8b8d8"/>`;
  s += `<path d="M51 58 Q52 52 56 50" stroke="#5a4a2a" stroke-width=".6" fill="none"/><path d="M54 52 Q60 48 62 54 Q58 54 54 52Z" fill="#4a5a28"/>`;
  s += `<ellipse cx="140" cy="62" rx="3" ry="2.4" fill="#8a5a2a"/><ellipse cx="139" cy="61" rx=".8" ry=".6" fill="#d8b080"/>`;
  // window reflection on glass + subtle dust motes
  return sv(s + vig(.8) + grainOv(.25));
}

function ea_rococo() {
  const r = rng(151);
  const [sd, sk] = ea_lgrad([[0, '#b9d6e4'], [.6, '#f2dbe0'], [1, '#f6eacb']]);
  const [bd, bl] = ea_blur(.9);
  const cl = U('eac');
  let s = `<defs>${sd}${bd}<clipPath id="${cl}"><ellipse cx="80" cy="50" rx="66" ry="44"/></clipPath></defs>` + bg('#efe6d2');
  s += `<g clip-path="url(#${cl})"><rect width="160" height="100" fill="url(#${sk})"/>`;
  // feathery pastel trees
  s += `<g filter="url(#${bl})">${ea_clump(r, 30, 34, 26, 28, 70, ['#9fb79a', '#c7d3b0', '#7f9c88', '#dfe6c8'], .85)}${ea_clump(r, 132, 30, 24, 26, 60, ['#9fb79a', '#c7d3b0', '#a8c0b0', '#e6ead2'], .85)}${ea_clump(r, 80, 92, 60, 10, 40, ['#8aa280', '#b7c79c'], .9)}</g>`;
  // fluffy clouds
  s += `<g filter="url(#${bl})" fill="#fff" opacity=".85"><ellipse cx="78" cy="22" rx="16" ry="5"/><ellipse cx="88" cy="18" rx="10" ry="5"/></g>`;
  // branch and swing ropes
  s += `<path d="M30 20 Q70 10 104 16" stroke="#7a6048" stroke-width="2" fill="none"/>`;
  s += `<path d="M66 15 L81 62 M86 13 L96 59" stroke="#8a7458" stroke-width=".6"/>`;
  // lady on swing: billowing pink dress
  s += `<g transform="translate(-42 -22) scale(1.5)">`;
  s += `<path d="M80 56 Q72 52 70 62 Q74 70 88 66 Q98 64 96 56 Q92 50 86 54 Z" fill="#f2a2b6"/>`;
  s += `<path d="M74 60 Q80 66 92 60 M78 64 Q86 68 94 62" stroke="#fbd4dc" stroke-width=".8" fill="none"/>`;
  s += `<path d="M84 54 Q86 46 88 42 L91 44 Q90 50 88 55Z" fill="#f2a2b6"/><circle cx="89.5" cy="39.5" r="2.6" fill="#f6dcc8"/>`;
  s += `<path d="M87 37.6 Q90 34.6 93 37.6 Q96 36 92 34 Q88 34 87 37.6Z" fill="#e8c890"/><path d="M86 36.6 L95 35" stroke="#e8d0a8" stroke-width="2" stroke-linecap="round"/>`;
  s += `<path d="M90 46 L95 40 M88 46 L82 44" stroke="#f6dcc8" stroke-width="1" stroke-linecap="round"/>`;
  s += `<path d="M70 62 L64 66" stroke="#f6dcc8" stroke-width="1.2" stroke-linecap="round"/><path d="M58 52 l2.4 -1 l.4 1.4Z" fill="#f2a2b6"/></g>`; // flying slipper
  // rose garland
  s += `<path d="M20 74 Q50 86 80 76 Q110 86 140 74" stroke="#7f9c68" stroke-width="1.2" fill="none"/>`;
  for (let i = 0; i < 16; i++) { const t = i / 15, x = 20 + t * 120, y = 74 + Math.sin(t * Math.PI * 2) * 4 + 4 * Math.sin(t * Math.PI); s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(1.4 + r())}" fill="${pick(r, ['#f2a2b6', '#fbe0e6', '#e87a98', '#fff2d0'])}"/>`; }
  s += `</g>`;
  // gilded rocaille frame: oval with C-scrolls and shells at corners
  s += `<ellipse cx="80" cy="50" rx="66" ry="44" fill="none" stroke="#c9a040" stroke-width="3"/><ellipse cx="80" cy="50" rx="68.5" ry="46.5" fill="none" stroke="#f2d888" stroke-width="1"/>`;
  [[8, 8, 1, 1], [152, 8, -1, 1], [8, 92, 1, -1], [152, 92, -1, -1]].forEach(([x, y, sx, sy]) => {
    s += `<g transform="translate(${x} ${y}) scale(${sx} ${sy})" fill="none" stroke="#c9a040" stroke-width="1.6" stroke-linecap="round"><path d="M0 14 Q0 0 14 0 Q20 0 20 6 Q20 10 15 10 Q12 9 13 6"/><path d="M4 22 Q2 30 8 30 Q12 28 10 25"/><path d="M22 4 Q30 2 30 8 Q28 12 25 10"/></g>`;
  });
  s += `<path d="M72 4 Q80 -2 88 4 Q84 10 80 6 Q76 10 72 4Z" fill="#e2bf62" stroke="#a8802a" stroke-width=".5"/>`;
  return sv(s + grainOv(.15));
}

function ea_neoclassical() {
  const ink = '#2a2420';
  const [wd, wg] = ea_lgrad([[0, '#5a544a'], [1, '#3a3630']]);
  let s = `<defs>${wd}</defs><rect width="160" height="100" fill="url(#${wg})"/>`;
  // three round arches in deep shadow behind, Doric columns
  s += `<rect x="0" y="0" width="160" height="70" fill="#7c766a"/>`;
  [[14], [62], [110]].forEach(([x]) => { s += `<path d="M${x} 70 V34 A18 18 0 0 1 ${x + 36} 34 V70Z" fill="#26231e"/>`; });
  [6, 54, 102, 150].forEach(x => {
    s += `<rect x="${x}" y="22" width="6" height="48" fill="#b9b1a0"/><rect x="${x + 3.6}" y="22" width="2.4" height="48" fill="#8f8878"/>`;
    for (let k = 1; k < 4; k++) s += `<path d="M${x + k * 1.5} 23 V69" stroke="#9a9282" stroke-width=".35"/>`;
    s += `<rect x="${x - 1.5}" y="19" width="9" height="3" fill="#c9c1b0"/>`;
  });
  s += `<rect x="0" y="14" width="160" height="5" fill="#c9c1b0"/><path d="M0 19 H160" stroke="#8f8878" stroke-width=".6"/>`;
  // marble floor
  s += `<rect x="0" y="70" width="160" height="30" fill="#a69c88"/>`;
  for (let i = 0; i < 9; i++) s += `<path d="M${i * 20 - 20} 100 L${i * 20 + 4} 70" stroke="#8a8070" stroke-width=".5"/>`;
  s += `<path d="M0 80 H160 M0 90 H160" stroke="#8a8070" stroke-width=".5"/>`;
  // frieze-like row of figures, crisp contours, raking light from left
  const st = `stroke="${ink}" stroke-width=".5"`;
  // central hero, red cloak, arm raised
  s += `<path d="M78 92 L76 72 L74 50 Q80 44 86 50 L86 72 L86 92 Z" fill="#e9e2d2" ${st}/>`;
  s += `<path d="M86 50 Q94 60 92 88 L86 84 Z" fill="#a82422" ${st}/>`;
  s += `<path d="M76 52 L66 38 L64 30" stroke="#d9b08a" stroke-width="2.4" stroke-linecap="round" fill="none"/><path d="M76 52 L66 38 L64 30" stroke="${ink}" stroke-width=".3" fill="none"/>`;
  s += `<rect x="62.6" y="20" width="1.2" height="12" fill="#c9a24a"/>`;
  s += `<circle cx="80" cy="44" r="4" fill="#d9b08a" ${st}/><path d="M76 43 Q78 37 84 40 L84 42 Q80 40 77 44Z" fill="#4a3220"/>`;
  s += `<path d="M78 92 v-6 M84 92 v-6" stroke="#d9b08a" stroke-width="2"/>`;
  // two figures at left in profile, mirroring the gesture
  [[34, '#3a5a8a'], [48, '#c9a24a']].forEach(([x, c]) => {
    s += `<path d="M${x - 4} 92 L${x - 5} 56 Q${x} 50 ${x + 5} 56 L${x + 4} 92Z" fill="${c}" ${st}/>`;
    s += `<circle cx="${x}" cy="50" r="3.6" fill="#d9b08a" ${st}/><path d="M${x - 3.6} 49 Q${x} 44 ${x + 3.4} 48 L${x + 4} 46 Q${x} 42 ${x - 4} 47Z" fill="#8a8070"/>`;
    s += `<path d="M${x + 4} 58 L${x + 12} 46" stroke="#d9b08a" stroke-width="2" stroke-linecap="round"/>`;
  });
  // mourning women at right
  s += `<path d="M118 92 Q114 76 118 64 Q124 58 130 64 Q134 76 132 92Z" fill="#e9e2d2" ${st}/><circle cx="124" cy="60" r="3.6" fill="#d9b08a" ${st}/><path d="M120 60 Q124 54 128 60 L130 66 Q124 62 118 66Z" fill="#8a3a2a"/>`;
  s += `<path d="M136 92 Q134 80 138 70 Q144 66 148 72 Q150 82 148 92Z" fill="#7a8a6a" ${st}/><circle cx="142" cy="68" r="3.2" fill="#d9b08a" ${st}/>`;
  return sv(s);
}

function ea_romanticism() {
  const r = rng(161);
  const [sd, sk] = ea_lgrad([[0, '#2e3c52'], [.55, '#8a93a4'], [.85, '#e2b8a2'], [1, '#f0d2b0']]);
  const [bd, bl] = ea_blur(2.4);
  const [md, mg] = ea_rgrad([[0, '#fff8e0', .9], [1, '#fff8e0', 0]]);
  let s = `<defs>${sd}${bd}${md}</defs><rect width="160" height="100" fill="url(#${sk})"/>`;
  s += `<circle cx="118" cy="30" r="14" fill="url(#${mg})"/><circle cx="118" cy="30" r="4" fill="#fff6dc"/>`;
  // distant peaks emerging from fog, receding layers
  s += `<path d="M0 60 L18 46 L30 54 L50 38 L66 52 L80 48 L96 56 L112 42 L132 54 L160 46 V70 H0Z" fill="#7a8494" opacity=".75"/>`;
  s += `<g filter="url(#${bl})">`;
  for (let i = 0; i < 14; i++) s += `<ellipse cx="${f1(r() * 160)}" cy="${f1(58 + r() * 16)}" rx="${f1(18 + r() * 20)}" ry="${f1(4 + r() * 3)}" fill="#e8e2e0" opacity=".75"/>`;
  s += `</g>`;
  s += `<path d="M0 74 L22 64 L40 72 L52 66 L70 76 L90 72 L104 80 L130 70 L160 76 V86 H0Z" fill="#4a4e58" opacity=".85"/>`;
  s += `<g filter="url(#${bl})">${Array.from({ length: 10 }, () => `<ellipse cx="${f1(r() * 160)}" cy="${f1(78 + r() * 8)}" rx="${f1(16 + r() * 18)}" ry="3.6" fill="#d8d2d4" opacity=".7"/>`).join('')}</g>`;
  // dark rocky foreground crag
  s += `<path d="M34 100 L46 84 L58 80 L70 76 L82 78 L90 74 L100 80 L114 86 L126 100Z" fill="#1c1a1a"/>`;
  s += `<path d="M58 80 L64 90 M90 74 L94 88 M100 80 L108 92" stroke="#3a3634" stroke-width=".8"/>`;
  // dead tree on the left
  s += `<path d="M14 100 L18 70 L14 56 M18 70 L26 60 L30 52 M16 62 L8 54 M24 62 L28 66" stroke="#1c1a1a" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  s += `<path d="M0 100 L0 88 L24 92 L34 100Z" fill="#1c1a1a"/>`;
  // Rueckenfigur: man from behind, dark coat, cane, hair in wind
  const x = 84, y = 75;
  s += `<path d="M${x - 2.6} ${y} L${x - 2} ${y - 7} L${x - 3.2} ${y - 16} Q${x} ${y - 19} ${x + 3.2} ${y - 16} L${x + 2.4} ${y - 7} L${x + 3.2} ${y}Z" fill="#141212"/>`;
  s += `<path d="M${x - 3.6} ${y - 7} L${x - 3.2} ${y - 16} Q${x} ${y - 18} ${x + 3.2} ${y - 16} L${x + 4} ${y - 7}Z" fill="#1e1c1c"/>`;
  s += `<circle cx="${x}" cy="${y - 19.4}" r="2.2" fill="#2a1e16"/><path d="M${x + 1} ${y - 21} q3 -.6 4 1" stroke="#3a2a1e" stroke-width=".8" fill="none"/>`;
  s += `<path d="M${x + 3.4} ${y - 9} L${x + 6} ${y}" stroke="#141212" stroke-width=".7"/>`;
  return sv(s + vig(.6) + grainOv(.2));
}

function ea_hudson() {
  const r = rng(171);
  const [sd, sk] = ea_lgrad([[0, '#9fb3c0'], [.45, '#f1d9a6'], [.7, '#f6c47a'], [1, '#e9a868']]);
  const [hd, hz] = ea_rgrad([[0, '#fff6d6', 1], [.35, '#ffe7a6', .6], [1, '#ffe7a6', 0]]);
  const [wd, wg] = ea_lgrad([[0, '#f6d49a'], [1, '#c99a62']]);
  const [bd, bl] = ea_blur(1.2);
  let s = `<defs>${sd}${hd}${wd}${bd}</defs><rect width="160" height="100" fill="url(#${sk})"/>`;
  // glowing sun haze, thin cloud streaks
  s += `<circle cx="104" cy="46" r="40" fill="url(#${hz})"/><circle cx="104" cy="46" r="3.4" fill="#fffbe8"/>`;
  s += `<g filter="url(#${bl})" opacity=".55"><path d="M10 18 Q60 12 110 20" stroke="#fff3dc" stroke-width="2" fill="none"/><path d="M60 28 Q110 24 156 30" stroke="#f6dcc0" stroke-width="1.4" fill="none"/></g>`;
  // far blue mountains, hazy
  s += `<g filter="url(#${bl})"><path d="M0 54 L16 46 L34 50 L54 36 L72 48 L86 44 L100 52 L124 44 L144 50 L160 46 V64 H0Z" fill="#a9a8ae" opacity=".75"/></g>`;
  // mid valley with river and still lake reflecting sky
  s += `<path d="M0 62 Q40 56 70 62 Q100 58 160 62 V100 H0Z" fill="#7a7a52"/>`;
  s += `<path d="M30 68 Q70 62 104 64 Q132 66 160 64 V74 Q120 72 90 76 Q60 80 40 74Z" fill="url(#${wg})"/>`;
  s += `<path d="M96 66 v9" stroke="#fff6d6" stroke-width="2" opacity=".7"/><path d="M64 72 h20 M100 70 h18" stroke="#fff3dc" stroke-width=".4"/>`;
  // tiny sailboat on the still water
  s += `<path d="M118 70 l3 -6 v6Z" fill="#f6f0e0"/><path d="M116.5 70.4 h6" stroke="#4a3a2a" stroke-width=".6"/>`;
  // rolling forested hills with tiny trees
  s += `<path d="M0 74 Q30 70 50 80 Q80 90 120 84 Q140 82 160 86 V100 H0Z" fill="#4a4a2a"/>`;
  for (let i = 0; i < 70; i++) { const x = r() * 160, y = 80 + r() * 18; s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="1.4" ry="2" fill="${pick(r, ['#3a3e22', '#5a5a2e', '#6a5a2a', '#2e321c'])}"/>`; }
  // dark foreground framing tree with blasted trunk at left
  s += `<path d="M0 100 V20 Q8 10 14 22 Q12 40 18 60 Q20 80 28 100Z" fill="#2a2416"/>`;
  s += `<path d="M10 40 Q20 30 30 34 L34 28 M16 56 Q26 50 34 54" stroke="#2a2416" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  s += ea_clump(r, 8, 18, 14, 12, 40, ['#2a3018', '#3a3a1e', '#1e2210']);
  s += `<path d="M14 22 L22 8 L20 2 M20 12 L28 10" stroke="#d8c8a8" stroke-width="1" fill="none"/>`;
  // two tiny figures on an overlook
  s += fig(40, 86, 3.4, '#2a1e14') + fig(43.4, 86, 3, '#5a2a1e');
  return sv(s + grainOv(.2));
}

function ea_preraph() {
  const r = rng(181);
  const [hd, hg] = ea_lgrad([[0, '#d0602a'], [.5, '#b0401a'], [1, '#7a2810']], 1, 1);
  const [dd, dg] = ea_lgrad([[0, '#2f8a5a'], [1, '#14503a']], 1, 1);
  const [sd, sg] = ea_rgrad([[0, '#fbe6d6'], [1, '#e8c0a6']], .4, .4, .6);
  let s = `<defs>${hd}${dd}${sd}</defs>` + bg('#1e3a26');
  // dense jewel-bright foliage, each leaf drawn
  for (let i = 0; i < 160; i++) {
    const x = r() * 160, y = r() * 100, a = r() * 360;
    s += `<path d="M${f1(x)} ${f1(y)} q2.4 -3 5 0 q-2.6 2.4 -5 0Z" fill="${pick(r, ['#2f6a3a', '#3e8a46', '#265a30', '#5a9a4a'])}" transform="rotate(${f1(a)} ${f1(x)} ${f1(y)})"/>`;
  }
  // medieval arched window, right, with distant river and tower
  s += `<path d="M118 60 V24 Q118 12 132 10 Q146 12 146 24 V60Z" fill="#c9dde8"/><path d="M118 44 Q132 40 146 46 V60 H118Z" fill="#6a9a6a"/><path d="M126 44 v-12 l2 -2 l2 2 v12" fill="#a89a8a"/>`;
  s += `<path d="M118 60 V24 Q118 12 132 10 Q146 12 146 24 V60Z M132 10 V60" stroke="#8a7a62" stroke-width="2.2" fill="none"/>`;
  // flowers: roses, poppies, lilies, daisies
  for (let i = 0; i < 34; i++) {
    const x = r() * 160, y = r() * 100;
    if (x > 116 && x < 148 && y < 62) continue;
    const c = pick(r, ['#e23a4a', '#f2f0e8', '#f2b0c0', '#e8c23a', '#7a3a9a']);
    s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(1.6 + r() * 1.2)}" fill="${c}"/><circle cx="${f1(x)}" cy="${f1(y)}" r=".6" fill="${c === '#e8c23a' ? '#7a3a1a' : '#f6d860'}"/>`;
  }
  // woman in profile facing right, long flowing copper hair
  s += `<path d="M48 100 Q46 70 56 60 Q66 54 76 58 Q86 64 88 100Z" fill="url(#${dg})"/>`;
  s += `<path d="M58 66 Q64 80 62 100 M70 62 Q76 80 76 100" stroke="#0e3a28" stroke-width=".8" fill="none"/><path d="M60 62 Q68 58 76 60" stroke="#e8c23a" stroke-width="1.2" fill="none"/>`;
  s += `<path d="M70 52 L72 60 L66 61Z" fill="url(#${sg})"/>`;
  // hair mass behind
  s += `<path d="M58 26 Q50 32 52 50 Q48 66 40 82 Q38 92 44 100 L54 100 Q50 86 56 70 Q60 56 62 44Z" fill="url(#${hg})"/>`;
  // face in profile
  s += `<path d="M62 30 Q64 20 72 20 Q79 21 80 30 L82 35 L80 36 Q80 40 78 41 Q78 44 74 45 Q70 50 66 48 Q61 44 62 30Z" fill="url(#${sg})"/>`;
  s += `<path d="M78 41 q-1.6 .6 -3 0" stroke="#b8484a" stroke-width="1" fill="none"/><path d="M74.6 31 q1.6 -1 3 .2" stroke="#4a2a1a" stroke-width=".7" fill="none"/><path d="M75 33 q1.4 .4 2.6 0" stroke="#4a2a1a" stroke-width=".4" fill="none"/>`;
  // hair over head and flowing strands
  s += `<path d="M60 34 Q58 18 70 16 Q80 16 82 26 Q76 20 68 24 Q64 30 66 42 Q62 40 60 34Z" fill="url(#${hg})"/>`;
  for (let i = 0; i < 9; i++) s += `<path d="M${f1(60 + i * .8)} ${f1(30 + i * 2)} Q${f1(52 - i)} ${f1(60 + i * 2)} ${f1(46 + i * 1.4)} ${f1(96 + r() * 4)}" stroke="${pick(r, ['#e8823a', '#a8341a', '#f2a050'])}" stroke-width=".6" fill="none"/>`;
  // flower crown
  [[64, 20], [68, 17.4], [73, 16.4], [78, 18.4]].forEach(([x, y], i) => s += `<circle cx="${x}" cy="${y}" r="1.6" fill="${i % 2 ? '#f2f0e8' : '#e23a4a'}"/>`);
  // hand holding a lily stem
  s += `<path d="M84 74 Q90 70 92 64" stroke="#f0cdb4" stroke-width="2.4" stroke-linecap="round" fill="none"/><path d="M92 66 Q94 50 98 40" stroke="#3e8a46" stroke-width=".8" fill="none"/>`;
  [[98, 40], [96, 48]].forEach(([x, y]) => s += `<path d="M${x} ${y} l-3 -4 l3 1.6 l3 -1.6Z" fill="#fbfaf2"/>`);
  return sv(s + vig(.5));
}

pool.groups.push({
  id: 'ancient', title: 'Ancient & medieval', slot: 'Era style',
  intro: 'The oldest picture-making traditions, from cave walls to illuminated books. Name one to set the whole look at once: its flat space, its materials (ochre, gold leaf, glass, silk, thread) and its symbolic way of showing the world.',
  terms: [
    { id: 'cave', name: 'Cave painting', aka: 'Paleolithic rock art, prehistoric cave art',
      when: 'c. 40,000–12,000 BCE · France, Spain, Indonesia', y: -40000,
      desc: 'Animals painted with ochre, charcoal and blown pigment straight onto cave rock, often using the bumps of the stone as muscles. It feels alive, raw and very old.',
      spot: 'red and yellow ochre, black charcoal outlines, bison, horses and deer in side view, hand stencils, rough rock texture, no ground line or scene',
      ref: 'Lascaux, Chauvet, Altamira, Leang Tedongnge (Sulawesi)',
      prompt: 'prehistoric cave painting, red ochre and charcoal animals in side view on rough limestone, blown-pigment hand stencils, flickering torchlit rock texture, no background scene',
      ex: ea_cave() },
    { id: 'egypt', name: 'Egyptian wall painting', aka: 'Ancient Egyptian tomb painting',
      when: 'c. 2600–30 BCE · Egypt', y: -2600,
      desc: 'Figures shown in "composite view": head and legs in profile but eye and shoulders facing you, so every part is shown at its most recognizable. Scenes are stacked in horizontal bands (registers) with flat, unshaded color and hieroglyphs filling the gaps.',
      spot: 'profile head with a frontal eye, square frontal shoulders, striding legs, stacked horizontal registers, flat earth colors with blue and green, hieroglyph columns, men darker red-brown and women paler',
      ref: 'Tomb of Nebamun, Tomb of Nefertari, Book of the Dead papyri',
      prompt: 'ancient Egyptian tomb wall painting, composite profile figures with frontal eyes and shoulders, flat unshaded ochre, red, blue and green, horizontal registers, hieroglyph columns on plaster',
      ex: ea_egypt() },
    { id: 'vase', name: 'Greek vase painting', aka: 'black-figure, red-figure pottery',
      when: 'c. 700–300 BCE · Greece', y: -700,
      desc: 'Scenes painted on pots in two colors only: black-figure paints black silhouettes on orange clay and scratches details in, red-figure flips it so the figures stay clay-colored on a glossy black ground. Bands of key pattern frame the scene.',
      spot: 'only orange clay and glossy black, crisp silhouettes or reserved figures with fine black inner lines, Greek key (meander) bands, figures on a single ground line, curved vase surface',
      ref: 'Exekias (black-figure), Euphronios and the Berlin Painter (red-figure)',
      prompt: 'ancient Greek red-figure vase painting, terracotta figures with fine black contour lines on glossy black ground, meander key border, profile figures on a single ground line',
      ex: ea_vase() },
    { id: 'byzantine', name: 'Byzantine mosaic & icon', aka: 'Byzantine art, Orthodox icon',
      when: '500–1450 · Constantinople, Ravenna, Eastern Mediterranean', y: 500,
      desc: 'Holy figures made of thousands of glass and gold tiles (tesserae) or painted on wood, standing flat and frontal against a shimmering gold ground. They are meant to feel eternal and otherworldly, not lifelike.',
      spot: 'gold background, visible small square tiles, frontal figure staring straight out, large almond eyes, long thin nose, halo, flat robes with dark outlines, no depth or shadows',
      ref: 'San Vitale (Ravenna), Hagia Sophia Deësis, Andrei Rublev (Trinity icon)',
      prompt: 'Byzantine gold-ground mosaic, frontal saint with large almond eyes and halo, visible glass tesserae, flat deep blue and purple robes, shimmering gold leaf background, solemn and timeless',
      ex: ea_byzantine() },
    { id: 'illuminated', name: 'Illuminated manuscript', aka: 'medieval illumination, book of hours',
      when: '600–1500 · Ireland, France, Flanders', y: 600,
      desc: 'Handwritten books decorated with gold leaf and bright pigment: huge ornamented first letters, vine borders and tiny jewel-like scenes. "Illuminated" means the gold literally catches the light.',
      spot: 'large decorated initial letter, burnished gold leaf, ultramarine and vermilion, vine and ivy borders with gold dots, blocks of black script with red headings, parchment page',
      ref: 'Book of Kells, Lindisfarne Gospels, Très Riches Heures du Duc de Berry',
      prompt: 'medieval illuminated manuscript page, ornate gilded initial on ultramarine, vine and ivy border with gold dots, vermilion accents, parchment, tiny jewel-like painted miniature',
      ex: ea_illuminated() },
    { id: 'tapestry', name: 'Medieval tapestry', aka: 'millefleurs tapestry, woven wall hanging',
      when: '1000–1550 · France, Flanders, England', y: 1070,
      desc: 'Pictures woven in wool and silk to hang on castle walls, often packed with flat figures and animals floating on a ground of countless tiny flowers ("millefleurs", a thousand flowers). Colors are earthy reds, deep greens and indigo, with a soft woven texture.',
      spot: 'visible weave texture, dark green or red ground scattered with tiny flowers, flat figures and animals without shadows, decorative border, no real perspective',
      ref: 'Bayeux Tapestry, The Hunt of the Unicorn, The Lady and the Unicorn',
      prompt: 'medieval millefleurs tapestry, flat white unicorn on a deep green ground scattered with tiny flowers, woven wool texture, madder red border, no perspective, muted vegetable dyes',
      ex: ea_tapestry() },
    { id: 'stainedglass', name: 'Gothic stained glass', aka: 'cathedral glass, leaded glass',
      when: '1140–1500 · France, England, Germany', y: 1140,
      desc: 'Pictures built from pieces of colored glass held together by black lead strips, set in tall pointed windows and round rose windows. Sunlight through it gives a glowing, jewel-like color you cannot get with paint.',
      spot: 'thick black lead lines between color pieces, ruby red and cobalt blue dominant, pointed lancet arches, round rose window with radiating petals, light glowing from behind, small stylized saints',
      ref: 'Chartres Cathedral, Sainte-Chapelle (Paris), Notre-Dame rose windows',
      prompt: 'Gothic stained glass window, jewel-toned ruby, cobalt and emerald glass pieces separated by thick black lead lines, pointed lancet arches and rose window, glowing backlit light',
      ex: ea_stainedglass() },
    { id: 'shanshui', name: 'Chinese shan shui', aka: 'mountain-water painting, literati landscape',
      when: 'since c. 900 · China', y: 900,
      desc: 'Landscapes in ink on silk or paper ("shan shui" means mountain-water): towering peaks, drifting mist and tiny people, usually on a tall hanging scroll. Empty space is part of the picture and stands for mist, water or air.',
      spot: 'tall vertical scroll, black ink in many grays, layered mountains fading into mist, lots of blank silk, tiny figures, pavilions and pines, texture strokes on rock, small red seal stamps',
      ref: 'Fan Kuan (Travelers among Mountains and Streams), Guo Xi (Early Spring), Huang Gongwang',
      prompt: 'Chinese shan shui ink landscape on silk hanging scroll, towering misty mountains, layered gray ink washes and texture strokes, tiny pavilion and traveler, pines, generous empty space, red seal',
      ex: ea_shanshui() },
    { id: 'persian', name: 'Persian miniature', aka: 'Persian painting, Safavid miniature',
      when: '1300–1700 · Iran, Central Asia', y: 1300,
      desc: 'Small, jewel-bright book paintings where the world is seen from high above, so floors, gardens and carpets tilt up like a map. Every surface carries pattern, from tiles to robes, under a gold or lapis sky.',
      spot: 'high bird\'s-eye viewpoint, ground tilted up the page, patterned tiles and carpets, lapis blue and gold, slender figures with turbans, flowering trees and cypresses, decorative borders, no cast shadows',
      ref: 'Shahnameh of Shah Tahmasp, Kamāl ud-Dīn Behzād, Reza Abbasi',
      prompt: 'Persian miniature painting, high bird\'s-eye view, tilted-up garden and pavilion with patterned turquoise tiles, lapis lazuli and gold leaf, slender turbaned figures, flowering trees, fine detail',
      ex: ea_persian() },
  ]
});

pool.groups.push({
  id: 'masters', title: 'Renaissance to Romanticism', slot: 'Era style',
  intro: 'Four centuries of European painting, from the first convincing perspective to sublime storms. Each era name brings a whole package of light, color and composition, so add one to a prompt to get that "old master" feel.',
  terms: [
    { id: 'earlyren', name: 'Early Renaissance', aka: 'Quattrocento, proto-Renaissance',
      when: '1300–1490 · Florence, Italy', y: 1300,
      desc: 'Painters rediscover depth: Giotto gives figures weight, and by the 1400s linear perspective makes floors and buildings recede to a single point. The colors are chalky and clear, the mood calm and devout.',
      spot: 'checkerboard floors and arches converging to one vanishing point, egg tempera or fresco with pale chalky colors, gold halos still present, simple solid figures, ultramarine blue, quiet poses',
      ref: 'Giotto (Scrovegni Chapel), Masaccio, Fra Angelico, Piero della Francesca',
      prompt: 'Early Renaissance fresco, one-point linear perspective, tiled floor and slender arches, pale chalky egg tempera colors, ultramarine and rose, gold halos, calm solid figures',
      ex: ea_earlyren() },
    { id: 'highren', name: 'High Renaissance', aka: 'Cinquecento',
      when: '1490–1530 · Florence, Rome, Venice', y: 1490,
      desc: 'The peak of balance and ideal beauty: figures arranged in stable triangles, softly modeled with sfumato (edges melting into smoky shadow) before a hazy blue landscape. Everything feels harmonious and serene.',
      spot: 'pyramid-shaped figure groups, soft smoky edges with no hard outlines, idealized calm faces, hazy blue distant landscape (aerial perspective), warm skin against deep reds and blues',
      ref: 'Leonardo da Vinci, Raphael, Michelangelo, Giorgione',
      prompt: 'High Renaissance oil painting, in the manner of Leonardo and Raphael: pyramidal composition, soft sfumato modeling, idealized serene faces, hazy blue atmospheric landscape behind',
      ex: ea_highren() },
    { id: 'northren', name: 'Northern Renaissance', aka: 'Flemish Primitives, Early Netherlandish',
      when: '1420–1580 · Flanders, Germany, Netherlands', y: 1420,
      desc: 'Oil paint built up in thin transparent glazes lets painters render every thread, jewel and reflection with almost microscopic precision. Everyday objects often hide religious symbols.',
      spot: 'tiny precise detail everywhere, glowing enamel-like oil glazes, reflections in mirrors and metal, rich brocade, bullseye window glass, a tiny detailed landscape through a window, symbolic objects (lilies, candles)',
      ref: 'Jan van Eyck, Rogier van der Weyden, Albrecht Dürer, Hans Holbein the Younger',
      prompt: 'Northern Renaissance oil painting, in the manner of Jan van Eyck: microscopic detail, luminous oil glazes, domestic interior with convex mirror and bullseye windows, rich brocade, symbolic objects',
      ex: ea_northren() },
    { id: 'mannerism', name: 'Mannerism', aka: 'Late Renaissance',
      when: '1520–1600 · Italy, Spain', y: 1520,
      desc: 'A deliberate break from Renaissance balance: bodies stretch and twist into S-curves, space feels crowded or unstable, and colors turn acid. Elegant and slightly uneasy.',
      spot: 'elongated bodies with small heads, twisting serpentine poses, unnatural acid pinks, limes and blues, crowded or ambiguous space, stormy flickering light',
      ref: 'Parmigianino (Madonna with the Long Neck), Pontormo, Bronzino, El Greco',
      prompt: 'Mannerist painting, in the manner of El Greco and Pontormo: elongated twisting figures with small heads, acid pink, lime and cold blue, stormy flickering sky, unstable crowded space',
      ex: ea_mannerism() },
    { id: 'baroque', name: 'Baroque', aka: 'Baroque painting, Caravaggesque',
      when: '1600–1750 · Italy, Spain, Flanders', y: 1600,
      desc: 'Drama and motion: figures lit by a single strong light burst out of deep shadow (chiaroscuro), often frozen at the most intense moment. Compositions run on bold diagonals.',
      spot: 'pitch-dark backgrounds, one hard spotlight, faces and hands glowing out of shadow, strong diagonals, pointing gestures, rich reds and golds, theatrical moment',
      ref: 'Caravaggio (The Calling of Saint Matthew), Rubens, Artemisia Gentileschi, Rembrandt',
      prompt: 'Baroque oil painting, dramatic chiaroscuro, figures emerging from deep shadow, single raking light, rich warm darks, crimson and gold drapery, theatrical diagonal composition',
      ex: ea_baroque() },
    { id: 'dutchstill', name: 'Dutch Golden Age still life', aka: 'vanitas, pronkstilleven, banketje',
      when: '1600–1700 · Netherlands', y: 1600,
      desc: 'Arrangements of glasses, fruit, pewter and flowers painted so precisely they look touchable, glowing against a dark background. Many are "vanitas" pictures: a skull, a peeled lemon or a guttered candle reminds you life is short.',
      spot: 'near-black background, objects on a table edge, glowing highlights on glass and metal, half-peeled lemon with hanging spiral peel, tipped pewter plate, skull or watch as a reminder of mortality, muted tonal palette',
      ref: 'Willem Claesz Heda, Pieter Claesz, Rachel Ruysch, Willem Kalf',
      prompt: 'Dutch Golden Age still life oil painting, dark ground, glass roemer, pewter plate and half-peeled lemon on a table edge, glowing highlights, vanitas skull, muted tonal browns and greens',
      ex: ea_dutchstill() },
    { id: 'rococo', name: 'Rococo', aka: 'Late Baroque, Louis XV style',
      when: '1720–1780 · France', y: 1720,
      desc: 'Light, playful and pretty: aristocrats flirt in feathery gardens painted in pastel pinks, blues and creams. Frames and rooms swirl with gilded shell-and-scroll ornament (rocaille).',
      spot: 'pastel pink, powder blue and cream, feathery soft trees, lovers, swings and garlands, frothy silk dresses, fluffy clouds, gilded curly C-scroll and shell frames',
      ref: 'Jean-Honoré Fragonard, François Boucher, Antoine Watteau',
      prompt: 'Rococo painting, in the manner of Fragonard and Boucher: pastel pink and powder blue, frothy silk gowns, feathery garden trees, rose garlands, playful lighthearted mood, gilded rocaille frame',
      ex: ea_rococo() },
    { id: 'neoclassical', name: 'Neoclassicism', aka: 'Neoclassical painting',
      when: '1760–1850 · France, Italy, Britain', y: 1760,
      desc: 'A sober reaction to Rococo, inspired by ancient Greece and Rome: crisp outlines, smooth invisible brushwork and figures posed like a carved frieze. Calm, noble and serious.',
      spot: 'sharp clean contours, smooth porcelain-like finish, columns and round arches, figures lined up parallel to the picture like a relief, heroic gestures, togas and helmets, restrained reds and stone grays',
      ref: 'Jacques-Louis David, Jean-Auguste-Dominique Ingres, Angelica Kauffman, Antonio Canova (sculpture)',
      prompt: 'Neoclassical oil painting, in the manner of Jacques-Louis David: crisp contours, smooth finish, figures in a frieze-like row before Doric columns and arches, togas, restrained red and stone gray',
      ex: ea_neoclassical() },
    { id: 'romanticism', name: 'Romanticism', aka: 'Romantic painting, the sublime',
      when: '1790–1850 · Germany, Britain, France', y: 1790,
      desc: 'Feeling over reason: tiny people face vast, wild nature (fog, storms, moonlit ruins) to evoke the "sublime", awe mixed with fear. A favorite device is the Rückenfigur, a figure seen from behind so you look out through their eyes.',
      spot: 'lone figure seen from behind, sea of fog or storm, moonlight or glowing dawn, Gothic ruins and dead trees, dark foreground silhouettes, huge scale contrast, melancholy mood',
      ref: 'Caspar David Friedrich, J. M. W. Turner, Eugène Delacroix, John Martin',
      prompt: 'Romantic landscape painting, in the manner of Caspar David Friedrich: lone figure seen from behind on a dark crag above a sea of fog, distant peaks, pale moon, sublime melancholy',
      ex: ea_romanticism() },
    { id: 'hudson', name: 'Hudson River School & Luminism', aka: 'American sublime, Luminism',
      when: '1825–1880 · United States', y: 1825,
      desc: 'Huge, detailed American landscapes celebrating untouched wilderness, often bathed in golden sunset light. Luminism is its quiet branch: glassy still water, hidden brushstrokes and a hushed, glowing calm.',
      spot: 'vast panoramic valleys, glowing golden haze around a low sun, mirror-still water, tiny figures for scale, dark framing tree or blasted stump in the foreground, smooth invisible brushwork',
      ref: 'Thomas Cole, Frederic Edwin Church, Albert Bierstadt, Fitz Henry Lane',
      prompt: 'Hudson River School landscape, Luminist light: vast panoramic valley, golden glowing haze, mirror-still lake, distant blue mountains, tiny figures, dark framing tree, smooth invisible brushwork',
      ex: ea_hudson() },
    { id: 'preraph', name: 'Pre-Raphaelite', aka: 'Pre-Raphaelite Brotherhood',
      when: '1848–1900 · England', y: 1848,
      desc: 'Victorian painters who wanted the honesty of art "before Raphael": every leaf and flower painted in sharp, jewel-bright detail, usually around a melancholy medieval or literary heroine.',
      spot: 'jewel-bright saturated greens and reds, every leaf and petal in sharp focus, women with long flowing copper hair, medieval dress, flowers and lilies, literary or Arthurian themes, dreamy melancholy expression',
      ref: 'Dante Gabriel Rossetti, John Everett Millais, John William Waterhouse, Edward Burne-Jones',
      prompt: 'Pre-Raphaelite oil painting, in the manner of Rossetti and Waterhouse: jewel-bright detail, woman with long flowing copper hair in medieval green gown, dense flowers and foliage, dreamy melancholy',
      ex: ea_preraph() },
  ]
});

/* ===== b_modern.js ===== */
/* ---------- b_modern: 1850 to 1914, 1914 to 1945 ---------- */

// short brush dab (rotated ellipse)
function mo_dab(x, y, w, h, a, c, o = 1) {
  return `<ellipse rx="${f1(w)}" ry="${f1(h)}" transform="translate(${f1(x)} ${f1(y)})rotate(${Math.round(a)})" fill="${c}"${o === 1 ? '' : ` opacity="${o}"`}/>`;
}
// fill a rect area with seeded dabs from a palette
function mo_dabs(seed, n, x0, y0, w, h, cols, sz = [3, 1.2], ang = [-20, 20], o = .9) {
  const r = rng(seed); let s = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + r() * w, y = y0 + r() * h;
    s += mo_dab(x, y, sz[0] * (.6 + r() * .7), sz[1] * (.7 + r() * .6), ang[0] + r() * (ang[1] - ang[0]), pick(r, cols), o);
  }
  return s;
}
pool.groups.push({
  id: 'avant', title: '1850 to 1914', slot: 'Movement',
  intro: 'The decades when painters stopped copying what the eye sees and started painting what they felt, thought or dreamed. Put one of these names first in a prompt to set the whole mood, palette and brushwork in one go.',
  terms: [
    { id: 'realism', name: 'Realism', aka: 'French Realism, peasant painting',
      when: '1848–1880s · France', y: 1848,
      desc: 'Paintings of ordinary working people, shown honestly and at full dignity instead of gods, kings or pretty myths. The mood is quiet, heavy and earthbound.',
      spot: 'peasants or laborers as the main subject, bent backs and real work, low horizon, earthy browns and ochres, muted overcast light, no idealizing',
      ref: 'Gustave Courbet (The Stone Breakers), Jean-François Millet (The Gleaners), Rosa Bonheur, Honoré Daumier',
      prompt: 'Realism oil painting, 19th-century French peasants at work in a wide field, earthy ochre and umber palette, soft overcast light, low horizon, honest unidealized figures',
      ex: (() => {
        const [wd, wf] = wob(1.5, .08, 5);
        const sk = U('mo');
        const r = rng(11);
        let field = '';
        for (let i = 0; i < 140; i++) { const y = 58 + r() * 42; field += mo_dab(r() * 160, y, 2.5 + r() * 3, .7, -4 + r() * 8, pick(r, ['#9C7A3E', '#B08A48', '#8A6A34', '#C29A55', '#7A5C2E']), .7); }
        // bent gleaner: back curve, head low, arm to ground
        const bent = (x, y, s, c, ap, scarf, flip) => `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})" filter="url(#${wf})">
          <path d="M-9 0 L-6 -13 L5 -13 L8 0Z" fill="${c}"/>
          <path d="M-2 -1 L0 -13 L6 -12 L7 -1Z" fill="${ap}" opacity=".9"/>
          <path d="M-7 -12 Q-8 -22 2 -23 Q11 -23 15 -15 L12 -11 Q7 -15 3 -12Z" fill="${c}"/>
          <path d="M11 -15 L13 -3" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/>
          <path d="M8 -16 L8 -4" stroke="${c}" stroke-width="2" stroke-linecap="round" opacity=".85"/>
          <circle cx="15.5" cy="-12.5" r="3.2" fill="${scarf}"/>
          <path d="M-7 0 h4 M3 0 h4" stroke="#2A2018" stroke-width="1.4"/></g>`;
        return sv(`<defs>${wd}<linearGradient id="${sk}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9BC98"/><stop offset="1" stop-color="#E6D3A4"/></linearGradient></defs>
          <rect width="160" height="60" fill="url(#${sk})"/>
          <rect y="57" width="160" height="43" fill="#A88444"/>${field}
          <path d="M100 58 Q106 45 113 58Z M118 58 Q122 49 127 58Z" fill="#B8975A" filter="url(#${wf})"/>
          <path d="M0 58 Q40 55 80 57 T160 56 V59 H0Z" fill="#8E7B5A" opacity=".6"/>
          ${bent(30, 90, 1.7, '#4A3B2C', '#8A7A5C', '#B04A34')}${bent(70, 88, 1.6, '#4E5468', '#C9B98E', '#D6C18C')}
          ${bent(124, 84, 1.35, '#6E4A32', '#A08A64', '#3C4E66', 1)}
          ${grainOv(.4)}${vig(.6)}`);
      })() },

    { id: 'postimp', name: 'Post-Impressionism', aka: 'Cézanne-style, Gauguin-style, Cloisonnism',
      when: '1886–1905 · France, Tahiti', y: 1886,
      desc: 'Painters who kept Impressionism\'s bright color but added structure: Cézanne built landscapes from blocks of parallel strokes, Gauguin used flat areas of bold color with dark outlines. It feels solid, deliberate and a little stylized.',
      spot: 'patches of short parallel brushstrokes, simplified block-like houses and mountains, dark outlines around shapes, flat bold color areas, tilted or flattened perspective',
      ref: 'Paul Cézanne (Mont Sainte-Victoire), Paul Gauguin (Where Do We Come From?), Georges Seurat, Henri de Toulouse-Lautrec',
      prompt: 'Post-Impressionist oil painting, Cézanne-like landscape built from patches of parallel brushstrokes, blocky ochre houses, blue-violet mountain, flat color zones with dark outlines',
      ex: (() => {
        const r = rng(23);
        // strokes grouped by color: one path per color keeps the SVG small
        const grp = (n, y0, h, cols, a0, as) => {
          const d = {};
          for (let i = 0; i < n; i++) {
            const x = r() * 160, y = y0 + r() * h, c = pick(r, cols), a = a0 + r() * as;
            const dx = Math.cos(a) * 4, dy = Math.sin(a) * 4 + 3;
            for (let k = 0; k < 4; k++) d[c] = (d[c] || '') + `M${f1(x + k * 1.6)} ${f1(y)}l${f1(dx)} ${f1(dy)}`;
          }
          return Object.entries(d).map(([c, p]) => `<path d="${p}" stroke="${c}" stroke-width="1.5" stroke-linecap="round" opacity=".88"/>`).join('');
        };
        const sky = grp(105, 0, 44, ['#9DB8C9', '#B9CDD4', '#C8D6CF', '#8FA9C2'], .9, 0);
        const fld = grp(135, 52, 48, ['#6E8B4A', '#4F6E3E', '#B59650', '#C7A35C', '#7E9A58', '#3E5A3A'], .8, .4);
        return sv(`${bg('#C8D3CB')}${sky}
          <path d="M0 52 L28 40 L52 30 Q62 22 72 28 L92 18 Q100 14 108 22 L130 36 L160 44 V60 H0Z" fill="#7F86B8"/>
          <path d="M52 30 Q62 22 72 28 L92 18 L86 34 L66 36Z" fill="#A6A9CF" opacity=".8"/>
          <path d="M0 52 L28 40 L52 30 Q62 22 72 28 L92 18 Q100 14 108 22 L130 36 L160 44" fill="none" stroke="#3E4378" stroke-width="1.1"/>
          <rect y="52" width="160" height="48" fill="#8DA05C"/>
          ${fld}
          <g stroke="#3B3A55" stroke-width="1">
            <path d="M58 70 h16 v12 h-16Z" fill="#E2B572"/><path d="M56 70 l10 -6 l10 6Z" fill="#C46A3C"/>
            <path d="M78 74 h12 v9 h-12Z" fill="#EAC88E"/><path d="M76 74 l8 -5 l8 5Z" fill="#B85A32"/>
            <path d="M92 66 h8 v16 h-8Z" fill="#D9A866"/><path d="M91 66 l5 -4 l5 4Z" fill="#C46A3C"/>
          </g>
          <path d="M18 100 Q14 70 22 56 M22 56 Q28 66 26 100" stroke="#5A4630" stroke-width="2.5" fill="none"/>
          <ellipse cx="22" cy="54" rx="16" ry="9" fill="#3F6040" stroke="#2C3A32" stroke-width=".8"/>
          <ellipse cx="140" cy="60" rx="14" ry="10" fill="#4C6E42" stroke="#2C3A32" stroke-width=".8"/>
          ${mo_dabs(5, 40, 8, 46, 30, 14, ['#2E4E36', '#5C8050', '#6F9658'], [2.4, 1], [30, 50], 1)}
          ${mo_dabs(6, 30, 128, 52, 26, 16, ['#2E4E36', '#5C8050', '#7FA068'], [2.4, 1], [30, 50], 1)}
          ${grainOv(.3)}`);
      })() },

    { id: 'symbolism', name: 'Symbolism', aka: 'Symbolist painting, Decadent movement',
      when: '1880–1910 · France, Belgium, Switzerland', y: 1880,
      desc: 'Paintings of dreams, myths, death and the soul, more interested in mood and hidden meaning than in the real world. Scenes glow softly out of dusky darkness, like a vision half remembered.',
      spot: 'dreamlike or mystical subject, lone figures, floating heads or eyes, cypresses and still water, dim twilight with a soft inner glow, jewel-like accents',
      ref: 'Odilon Redon (The Cyclops), Gustave Moreau (The Apparition), Arnold Böcklin (Isle of the Dead), Fernand Khnopff',
      prompt: 'Symbolist painting, dreamlike mystical scene in dusky twilight, soft inner glow, dark cypresses and still water, lone pale figure, muted violet and gold, hushed mood',
      ex: (() => {
        const sk = U('mo'), gl = U('mo'), bl = U('mo');
        const r = rng(31); let cyp = '';
        for (let i = 0; i < 6; i++) { const x = 68 + i * 5 + r() * 2, h = 26 + r() * 12; cyp += `<path d="M${f1(x)} 64 Q${f1(x - 3.5)} ${f1(64 - h * .5)} ${f1(x)} ${f1(64 - h)} Q${f1(x + 3.5)} ${f1(64 - h * .5)} ${f1(x)} 64Z" fill="#141A1A"/>`; }
        let fl = '';
        for (let i = 0; i < 18; i++) fl += `<circle cx="${f1(4 + r() * 30)}" cy="${f1(70 + r() * 28)}" r="${f1(.8 + r() * 1.8)}" fill="${pick(r, ['#E8A6C8', '#F3D27A', '#9FD0E0', '#D88A5A'])}" opacity=".85"/>`;
        return sv(`<defs><linearGradient id="${sk}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1F1A33"/><stop offset=".55" stop-color="#5A4A6A"/><stop offset=".72" stop-color="#C9A06A"/><stop offset="1" stop-color="#2A2638"/></linearGradient>
          <radialGradient id="${gl}"><stop offset="0" stop-color="#FFF2C8" stop-opacity=".95"/><stop offset=".3" stop-color="#F4D08A" stop-opacity=".5"/><stop offset="1" stop-color="#F4D08A" stop-opacity="0"/></radialGradient>
          <filter id="${bl}"><feGaussianBlur stdDeviation="1.2"/></filter></defs>
          <rect width="160" height="100" fill="url(#${sk})"/>
          <circle cx="118" cy="30" r="26" fill="url(#${gl})"/><circle cx="118" cy="30" r="5" fill="#FFF4D6"/>
          <rect y="66" width="160" height="34" fill="#1E2030"/>
          <path d="M0 68 Q80 64 160 68" stroke="#C9A06A" stroke-width=".6" opacity=".5" fill="none"/>
          <g transform="translate(-32.8 -26.4) scale(1.4)"><path d="M50 66 L56 50 Q60 42 66 46 L70 40 L96 40 L100 48 L108 52 L114 66Z" fill="#3A3540"/>
          <path d="M60 66 L62 54 h6 v12Z M96 66 V54 h6 l2 12Z" fill="#2A2630"/>
          ${cyp}</g>
          <g filter="url(#${bl})" opacity=".45"><path d="M40 68 L124 68 L112 90 L52 90Z" fill="#14141F"/></g>
          <path d="M30 82 Q40 86 52 82 L50 80 L32 80Z" fill="#20182A"/>
          <path d="M42 80 q0 -9 2 -10 q2 1 2 10Z" fill="#F2EEE6"/><circle cx="44" cy="69" r="1.5" fill="#F2EEE6"/>
          <path d="M44 81 Q44 86 47 90" stroke="#F2EEE6" stroke-width=".4" opacity=".4" fill="none"/>
          ${fl}${grainOv(.45)}${vig(.9)}`);
      })() },

    { id: 'secession', name: 'Vienna Secession', aka: 'Wiener Secession, Secessionstil, Viennese Jugendstil',
      when: '1897–1910s · Vienna', y: 1897,
      desc: 'A group of Viennese artists who broke from the official academy to treat posters, furniture and buildings as art. Their look is flat, square, gilded and ornamental, with stark black-and-white grids beside shimmering gold.',
      spot: 'square formats, gold leaf, flat ornamental patterns of squares, spirals and circles, black-and-white checkerboard borders, stylized elongated figures, geometric lettering',
      ref: 'Koloman Moser (Ver Sacrum covers), Egon Schiele, Joseph Maria Olbrich (Secession Building), Josef Hoffmann',
      prompt: 'Vienna Secession poster design, square format, flat gold leaf ornament, grids of small squares and spirals, black-and-white checker border, stylized elegant figure, geometric lettering',
      ex: (() => {
        const gd = U('mo'); const r = rng(41);
        let chk = '';
        for (let i = 0; i < 20; i++) for (let j = 0; j < 2; j++) if ((i + j) % 2 === 0) { chk += `<rect x="${f1(40 + i * 4)}" y="${f1(2 + j * 2)}" width="4" height="2" fill="#111"/><rect x="${f1(40 + i * 4)}" y="${f1(94 + j * 2)}" width="4" height="2" fill="#111"/>`; }
        for (let i = 0; i < 23; i++) for (let j = 0; j < 2; j++) if ((i + j) % 2 === 0) { chk += `<rect x="${f1(40 + j * 2)}" y="${f1(6 + i * 4)}" width="2" height="4" fill="#111"/><rect x="${f1(116 + j * 2)}" y="${f1(6 + i * 4)}" width="2" height="4" fill="#111"/>`; }
        // gold dome of leaves (the Secession "golden cabbage")
        let lv = '';
        for (let i = 0; i < 90; i++) { const a = Math.PI * (r()), rr = 16 * Math.sqrt(r()); const x = 80 + Math.cos(a) * rr * 1.1, y = 40 - Math.sin(a) * rr; lv += mo_dab(x, y, 2, 1.1, r() * 180, pick(r, ['#E8C04A', '#C9962A', '#F4DA7A', '#A87A1E']), 1); }
        let sq = '';
        for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) sq += `<rect x="${f1(66 + i * 6)}" y="${f1(58 + j * 5)}" width="3" height="3" fill="${(i + j) % 2 ? '#C9962A' : '#1A1A1A'}"/>`;
        return sv(`<defs><linearGradient id="${gd}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E9C766"/><stop offset=".5" stop-color="#B9862A"/><stop offset="1" stop-color="#E4BC5A"/></linearGradient></defs>
          ${bg('#1A1A1A')}
          <rect x="0" y="0" width="38" height="100" fill="url(#${gd})"/><rect x="122" y="0" width="38" height="100" fill="url(#${gd})"/>
          ${[0, 1, 2, 3, 4, 5].map(k => `<circle cx="19" cy="${10 + k * 16}" r="5" fill="none" stroke="#1A1A1A" stroke-width=".8"/><circle cx="19" cy="${10 + k * 16}" r="2" fill="#1A1A1A"/><circle cx="141" cy="${10 + k * 16}" r="5" fill="none" stroke="#1A1A1A" stroke-width=".8"/><circle cx="141" cy="${10 + k * 16}" r="2" fill="#1A1A1A"/>`).join('')}
          <rect x="40" y="2" width="80" height="96" fill="#F3EEE2"/>${chk}
          <path d="M60 86 V50 h40 v36Z" fill="#FBF8F0" stroke="#1A1A1A" stroke-width=".8"/>
          <path d="M62 50 h36 v-4 h-36Z" fill="#1A1A1A"/>
          <path d="M56 86 V54 h6 v32Z M98 86 V54 h6 v32Z" fill="#EDE6D4" stroke="#1A1A1A" stroke-width=".7"/>
          <path d="M72 86 V72 q8 -6 16 0 V86Z" fill="#1A1A1A"/>
          ${sq}
          ${lv}
          <path d="M64 46 Q80 18 96 46" fill="none" stroke="#7A5612" stroke-width=".6"/>
          <rect x="54" y="86" width="52" height="3" fill="#1A1A1A"/>
          <g fill="#1A1A1A"><rect x="50" y="10" width="2" height="12"/><rect x="108" y="10" width="2" height="12"/></g>
          ${grainOv(.25)}`);
      })() },

    { id: 'fauvism', name: 'Fauvism', aka: 'Les Fauves, Fauve painting',
      when: '1905–1910 · France', y: 1905,
      desc: 'The "wild beasts": painters who used color for feeling, not accuracy, so trees turn red, skies orange and faces green. Pure paint straight from the tube, laid on in loose energetic strokes.',
      spot: 'wildly unnatural color (red trees, pink water, green shadows on faces), pure unmixed tube colors side by side, loose visible strokes, bare canvas showing through, simple drawing',
      ref: 'Henri Matisse (Woman with a Hat), André Derain (Charing Cross Bridge, Collioure harbor scenes), Maurice de Vlaminck, Raoul Dufy',
      prompt: 'Fauvist painting, harbor scene in wildly unnatural pure colors, red tree trunks, pink and turquoise water, orange sky, loose bold brushstrokes, patches of bare canvas',
      ex: (() => {
        const boat = (x, y, c, m) => `<path d="M${x} ${y} h18 l-4 5 h-11Z" fill="${c}"/><path d="M${x + 9} ${y} v-14 l7 12Z" fill="${m}"/><path d="M${x + 9} ${y} v-14" stroke="#1E2A8C" stroke-width=".8"/>`;
        return sv(`${bg('#F7EEDC')}
          ${mo_dabs(51, 60, 0, 0, 160, 46, ['#F6A13A', '#F7D046', '#F27A4A', '#F6C0A0'], [6, 2.2], [-10, 10], .92)}
          <path d="M0 46 Q30 38 56 44 T110 40 T160 44 V52 H0Z" fill="#7A3FA0"/>
          <path d="M0 46 Q30 40 56 44" stroke="#2E7BD8" stroke-width="1.5" fill="none"/>
          ${mo_dabs(52, 100, 0, 50, 160, 50, ['#2BB8C2', '#F58BB8', '#1E58C8', '#56D3A6', '#F7E36A'], [6, 1.6], [-6, 6], .9)}
          ${boat(70, 66, '#E8302C', '#F7F2E0')}${boat(100, 76, '#1E58C8', '#F7D046')}${boat(52, 84, '#2E9A4A', '#F58BB8')}
          <path d="M14 100 Q10 70 18 40 Q20 30 16 22" stroke="#E2312A" stroke-width="5" fill="none" stroke-linecap="round"/>
          <path d="M24 100 Q28 72 26 48" stroke="#C81E7A" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          ${mo_dabs(53, 50, 0, 8, 44, 30, ['#2FA84A', '#1E7A3A', '#9BD84A', '#F05A3A'], [5, 2], [-40, 40], .95)}
          <path d="M140 100 Q142 72 136 50" stroke="#E2312A" stroke-width="4" fill="none" stroke-linecap="round"/>
          ${mo_dabs(54, 30, 124, 34, 36, 22, ['#2FA84A', '#9BD84A', '#1E58C8'], [5, 2], [-40, 40], .95)}
          ${grainOv(.15)}`);
      })() },

    { id: 'expressionism', name: 'German Expressionism', aka: 'Die Brücke, Der Blaue Reiter, Expressionist painting',
      when: '1905–1925 · Dresden, Berlin, Munich', y: 1905,
      desc: 'Art that bends and distorts the world to show inner feeling, usually anxiety, alienation or spiritual yearning. Forms are jagged and stretched, colors harsh and clashing, outlines rough like a woodcut.',
      spot: 'jagged angular shapes, elongated mask-like figures, tilted buildings and streets, acid greens and hot pinks against black, rough woodcut-style outlines, emotional tension',
      ref: 'Ernst Ludwig Kirchner (Street, Berlin), Franz Marc (Blue Horse), Wassily Kandinsky (Blaue Reiter period), Emil Nolde, Käthe Kollwitz',
      prompt: 'German Expressionist painting, jagged elongated figures on a tilted city street, harsh acid green and hot pink against black, rough woodcut-like outlines, anxious mood',
      ex: (() => {
        const [wd, wf] = wob(2.2, .09, 8);
        const man = (x, s, c) => `<g transform="translate(${x} 96) scale(${s})"><path d="M-7 0 L-5 -30 L-9 -50 L-3 -56 L4 -56 L9 -48 L5 -30 L8 0 L2 0 L0 -26 L-2 0Z" fill="${c}" stroke="#0E0E10" stroke-width="1.2"/>
          <path d="M-4 -56 L-3 -66 L3 -68 L5 -62 L4 -56Z" fill="#E8D7A0" stroke="#0E0E10" stroke-width="1"/>
          <path d="M-1 -63 l1 1 M2 -63 l1 1" stroke="#0E0E10" stroke-width=".8"/><path d="M0 -64 l-1 4" stroke="#3FA85A" stroke-width="1"/>
          <path d="M-6 -66 L8 -67 L5 -72 L-3 -71Z" fill="#0E0E10"/></g>`;
        return sv(`<defs>${wd}</defs>${bg('#1A1420')}
          <g filter="url(#${wf})">
          <path d="M0 0 H160 V100 H0Z" fill="#2A2232"/>
          <path d="M0 0 L40 0 L56 52 L0 70Z" fill="#3E7A5A"/>
          <path d="M0 0 L22 0 L30 40 L0 46Z" fill="#E86A9A"/>
          <path d="M160 0 L118 0 L104 50 L160 66Z" fill="#C8A23A"/>
          <path d="M160 10 L134 6 L126 38 L160 46Z" fill="#2B4AA0"/>
          <path d="M56 52 L104 50 L160 100 H0 L0 70Z" fill="#E86A9A"/>
          <path d="M56 52 L104 50 L90 100 L50 100Z" fill="#B44A7A"/>
          <path d="M8 10 l8 -2 l2 10 l-8 2Z M10 26 l8 -2 l2 10 l-8 2Z M138 14 l8 1 l-1 10 l-8 -1Z" fill="#E8D040"/>
          <path d="M40 0 L56 52 M118 0 L104 50 M0 70 L56 52 L104 50 L160 66" stroke="#0E0E10" stroke-width="2" fill="none"/>
          ${man(66, 1, '#1C3A6E')}${man(86, 1.08, '#0E0E10')}${man(108, .92, '#3E7A5A')}
          <path d="M20 96 L26 70 L34 70 L38 96Z" fill="#0E0E10"/><circle cx="30" cy="66" r="5" fill="#E8D7A0" stroke="#0E0E10"/><path d="M22 64 L40 62 L36 56 L26 58Z" fill="#E8302C"/>
          </g>${grainOv(.25)}`);
      })() },

    { id: 'futurism', name: 'Futurism', aka: 'Italian Futurism, Futurist dynamism',
      when: '1909–1930s · Italy', y: 1909,
      desc: 'An Italian movement in love with speed, machines and the modern city, which tried to paint motion itself. Objects repeat like stacked film frames and are sliced by sharp lines of force.',
      spot: 'the same form repeated in overlapping steps, sharp wedge-shaped "force lines", speeding cars, trains, cyclists or crowds, fractured planes, energetic diagonals',
      ref: 'Giacomo Balla (Dynamism of a Dog on a Leash), Umberto Boccioni (Unique Forms of Continuity in Space), Gino Severini, Carlo Carrà',
      prompt: 'Futurist painting, speeding automobile shown as overlapping repeated forms, sharp wedge-shaped lines of force, fractured planes, energetic diagonals, steel gray, red and electric blue',
      ex: (() => {
        let s = '';
        // force wedges
        const wedges = [[-10, 20, 120, 46, '#2B4AA0'], [0, 90, 140, 58, '#D8D2C2'], [20, -10, 150, 52, '#B8B2A6'], [-20, 60, 130, 50, '#E8B83A']];
        for (const [x1, y1, x2, y2, c] of wedges) s += `<path d="M${x1} ${y1} L${x2} ${y2} L${x1} ${y1 + 16}Z" fill="${c}" opacity=".8"/>`;
        // repeated car silhouettes
        for (let i = 0; i < 5; i++) {
          const x = 30 + i * 18, o = .25 + i * .18;
          s += `<g opacity="${f1(o)}" transform="translate(${x} 0)"><path d="M0 64 L6 52 L22 48 L34 50 L44 58 L48 64Z" fill="${i === 4 ? '#D8262A' : '#6A6A72'}" stroke="#1A1A1F" stroke-width=".7"/>
            <circle cx="10" cy="65" r="5" fill="none" stroke="#1A1A1F" stroke-width="1.6"/><circle cx="38" cy="65" r="5" fill="none" stroke="#1A1A1F" stroke-width="1.6"/></g>`;
        }
        for (let k = 0; k < 7; k++) s += `<path d="M${10 + k * 4} ${54 + k * 2} H${70 + k * 6}" stroke="#1A1A1F" stroke-width=".6" opacity=".6"/>`;
        // arcs (spinning wheels / sound)
        for (let k = 0; k < 4; k++) s += `<path d="M${118 + k * 5} 66 a${8 + k * 4} ${8 + k * 4} 0 0 0 0 -${16 + k * 8}" fill="none" stroke="#1A1A1F" stroke-width=".8" opacity=".7"/>`;
        return sv(`${bg('#F0E8D6')}${s}
          <path d="M0 70 L160 72 L160 100 H0Z" fill="#4A4A52"/>
          <path d="M0 78 L160 74 M0 88 L160 80" stroke="#E8E2D0" stroke-width="1" stroke-dasharray="10 6"/>
          <path d="M60 100 L150 72 L160 76 L80 100Z" fill="#D8262A" opacity=".55"/>
          ${grainOv(.2)}`);
      })() },

    { id: 'orphism', name: 'Orphism', aka: 'Orphic Cubism, Simultanism',
      when: '1912–1914 · Paris', y: 1912,
      desc: 'An offshoot of Cubism that turned to pure color and rhythm, like visual music. Bright concentric discs and arcs overlap and pulse against each other.',
      spot: 'concentric circles and discs split into colored quarters, overlapping arcs, pure bright complementary colors side by side, sense of rotation and rhythm, little or no subject',
      ref: 'Robert Delaunay (Simultaneous Contrasts: Sun and Moon), Sonia Delaunay (Electric Prisms), František Kupka',
      prompt: 'Orphism abstract painting, overlapping concentric color discs split into quarters, bright complementary colors side by side, rhythmic circular motion, flat paint, like visual music',
      ex: (() => {
        const cols = ['#E8302C', '#F6A13A', '#F7D046', '#3FA85A', '#1E58C8', '#7A3FA0', '#F58BB8', '#2BB8C2', '#F2EEE2', '#1A1A2E'];
        const disc = (cx, cy, R, seed, rot) => {
          const r = rng(seed); let s = ''; const rings = 5;
          for (let i = rings; i > 0; i--) {
            const rr = R * i / rings;
            for (let q = 0; q < 4; q++) {
              const a0 = (q * 90 + rot) * Math.PI / 180, a1 = ((q + 1) * 90 + rot) * Math.PI / 180;
              s += `<path d="M${f1(cx)} ${f1(cy)} L${f1(cx + Math.cos(a0) * rr)} ${f1(cy + Math.sin(a0) * rr)} A${f1(rr)} ${f1(rr)} 0 0 1 ${f1(cx + Math.cos(a1) * rr)} ${f1(cy + Math.sin(a1) * rr)}Z" fill="${pick(r, cols)}"/>`;
            }
          }
          return s;
        };
        return sv(`${bg('#2A2A44')}
          ${disc(52, 50, 48, 3, 20)}
          <g opacity=".92">${disc(118, 40, 34, 9, 55)}</g>
          <g opacity=".9">${disc(126, 88, 22, 14, 0)}</g>
          ${disc(20, 88, 16, 21, 35)}
          ${grainOv(.25)}`);
      })() },
  ]
});

pool.groups.push({
  id: 'interwar', title: '1914 to 1945', slot: 'Movement',
  intro: 'Art between two world wars: some artists fled into dreams and pure geometry, others turned hard and political, and many painted the machine age or their own community for the first time. Naming the movement gives a model a whole worldview, not just a palette.',
  terms: [
    { id: 'metaphysical', name: 'Metaphysical painting', aka: 'Pittura metafisica',
      when: '1911–1920 · Italy', y: 1911,
      desc: 'Eerie, silent city squares painted with a too-clear afternoon light, where nobody lives and something seems about to happen. It is the direct ancestor of Surrealism, but calmer and more architectural.',
      spot: 'empty piazzas, arcades of dark arches, long raking shadows, a deep green or dusky sky, lone statues or mannequins, a distant train or tower, steep stage-set perspective',
      ref: 'Giorgio de Chirico (Mystery and Melancholy of a Street, The Red Tower), Carlo Carrà, Giorgio Morandi (early)',
      prompt: 'Metaphysical painting, empty Italian piazza with dark arcades, long raking late-afternoon shadows, deep green sky, lone statue, distant train, eerie silent stillness, smooth flat paint',
      ex: (() => {
        const sk = U('mo');
        let arc = '';
        for (let i = 0; i < 5; i++) { const x0 = 8 + i * 9, w = 6 - i * .3, top = 44 - i * 2.4, bot = 80 - i * 4; arc += `<path d="M${f1(x0)} ${f1(bot)} V${f1(top + w / 2)} a${f1(w / 2)} ${f1(w / 2)} 0 0 1 ${f1(w)} 0 V${f1(bot)}Z" fill="#2A1E16"/>`; }
        return sv(`<defs><linearGradient id="${sk}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16352A"/><stop offset=".7" stop-color="#4E8A62"/><stop offset="1" stop-color="#E6C36A"/></linearGradient></defs>
          <rect width="160" height="60" fill="url(#${sk})"/>
          <rect y="54" width="160" height="46" fill="#D89A4A"/>
          <path d="M0 30 L56 38 L56 64 L0 100Z" fill="#E6B26A"/><path d="M0 30 L56 38 L56 34 L0 24Z" fill="#B5703A"/>
          ${arc}
          <path d="M120 54 V20 h10 v34Z" fill="#B84A2E"/><path d="M118 20 h14 v-4 h-14Z" fill="#8A3020"/><path d="M125 16 v-6 l5 2 l-5 2" fill="#E8D7A0" stroke="#3A2A20" stroke-width=".5"/>
          <path d="M84 54 h30" stroke="#3A2A20" stroke-width=".8"/><path d="M90 52 h10 v2 h-10Z" fill="#3A2A20"/><path d="M100 52 q4 -5 10 -6" stroke="#E8E2D0" stroke-width="1.5" fill="none" opacity=".8"/>
          <path d="M56 64 L160 100 V70 L74 58Z" fill="#7A4A26" opacity=".8"/>
          <path d="M104 66 h6 v-3 h-6Z" fill="#C9B79A"/><path d="M106 63 q1 -8 2 -8 q1 0 1 8Z" fill="#C9B79A"/><circle cx="107.6" cy="54" r="1.4" fill="#C9B79A"/>
          <path d="M104 66 L148 78 L150 76 L110 63Z" fill="#3A2412" opacity=".75"/>
          <circle cx="84" cy="86" r="1.6" fill="#3A2412"/><path d="M84 86 L150 98" stroke="#3A2412" stroke-width="1"/>
          ${grainOv(.3)}${vig(.5)}`);
      })() },

    { id: 'suprematism', name: 'Suprematism', aka: 'Malevich style, Suprematist composition',
      when: '1915–1930s · Russia', y: 1915,
      desc: 'Pure abstraction built from the simplest shapes (squares, bars, circles, crosses) floating on white space, meant to express pure feeling rather than any object. It looks weightless, like shapes drifting in outer space.',
      spot: 'a few flat geometric shapes floating on a white or off-white ground, tilted diagonal arrangement, black, red and a few accent colors, no horizon, lots of empty space',
      ref: 'Kazimir Malevich (Black Square, Suprematist Composition: Airplane Flying), El Lissitzky, Lyubov Popova, Olga Rozanova',
      prompt: 'Suprematist abstract painting, flat black, red and yellow rectangles, bars and a circle floating diagonally on off-white ground, weightless composition, lots of empty space, crisp edges',
      ex: sv(`${bg('#F1ECE0')}
        <rect x="40" y="18" width="34" height="34" fill="#141414" transform="rotate(-14 57 35)"/>
        <rect x="70" y="56" width="58" height="9" fill="#C8262A" transform="rotate(-24 99 60)"/>
        <rect x="96" y="22" width="34" height="5" fill="#141414" transform="rotate(-24 113 24)"/>
        <rect x="104" y="34" width="20" height="3" fill="#2B4AA0" transform="rotate(-24 114 35)"/>
        <rect x="30" y="68" width="14" height="14" fill="#E8B83A" transform="rotate(-24 37 75)"/>
        <circle cx="132" cy="80" r="6" fill="#C8262A"/>
        <rect x="18" y="58" width="40" height="2" fill="#141414" transform="rotate(-24 38 59)"/>
        <rect x="84" y="80" width="18" height="2.5" fill="#3FA85A" transform="rotate(66 93 81)"/>
        ${grainOv(.2)}`) },

    { id: 'dada', name: 'Dada', aka: 'Dadaism, Dada photomontage',
      when: '1916–1924 · Zurich, Berlin, Paris, New York', y: 1916,
      desc: 'An anti-art protest born from the madness of World War I, using nonsense, chance and insult to mock respectable culture. Visually it is cut-up photos, machine parts and shouting typography slammed together on purpose to make no sense.',
      spot: 'photomontage of cut-out heads, eyes and machine gears, newspaper fragments, letters of different fonts and sizes at crazy angles, nonsense words, black and red on newsprint, deliberate absurdity',
      ref: 'Hannah Höch (Cut with the Kitchen Knife), Kurt Schwitters (Merz), Raoul Hausmann (ABCD), Marcel Duchamp (Fountain)',
      prompt: 'Dada photomontage, absurd cut-out photo fragments of heads, eyes and machine gears, chaotic mixed typography at odd angles, newsprint scraps, black and red ink, deliberately nonsensical',
      ex: (() => {
        const r = rng(71); let np = '';
        for (let i = 0; i < 9; i++) {
          const x = r() * 140, y = r() * 80, w = 18 + r() * 22, h = 12 + r() * 18, a = -25 + r() * 50;
          let lines = ''; for (let k = 2; k < h - 1; k += 2) lines += `<path d="M${f1(x + 2)} ${f1(y + k)} h${f1(w - 4 - r() * 6)}" stroke="#5A5650" stroke-width=".6"/>`;
          np += `<g transform="rotate(${f1(a)} ${f1(x + w / 2)} ${f1(y + h / 2)})"><rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="${pick(r, ['#E8E0C8', '#D8CFB4', '#EFE8D4'])}"/>${lines}</g>`;
        }
        let teeth = ''; for (let k = 0; k < 12; k++) { const a = k * 30; teeth += `<rect x="-2" y="-15" width="4" height="5" transform="rotate(${a})" fill="#6A6A6A"/>`; }
        return sv(`${bg('#CFC6AE')}${np}
          <g transform="translate(112 34)">${teeth}<circle r="11" fill="#6A6A6A"/><circle r="4" fill="#CFC6AE"/></g>
          <g transform="rotate(8 62 50)"><path d="M48 30 Q46 20 58 18 Q72 18 72 32 Q74 48 62 54 Q50 52 48 40Z" fill="#B8B0A0" stroke="#1A1A1A" stroke-width=".6"/>
            <path d="M52 30 h8 M64 30 h6" stroke="#3A3A3A" stroke-width="1.5"/><path d="M56 44 q5 3 10 0" stroke="#3A3A3A" stroke-width="1" fill="none"/></g>
          <g transform="rotate(-10 60 34)"><rect x="58" y="26" width="16" height="10" fill="#EFE8D4" stroke="#1A1A1A" stroke-width=".4"/><ellipse cx="66" cy="31" rx="6" ry="3.4" fill="#fff" stroke="#1A1A1A" stroke-width=".6"/><circle cx="66" cy="31" r="2" fill="#1A1A1A"/></g>
          <path d="M60 54 L58 74 L70 74 L68 54Z" fill="#7A7A80" stroke="#1A1A1A" stroke-width=".5"/>
          <text x="6" y="30" font-family="Georgia,serif" font-weight="700" font-size="22" fill="#C8262A" transform="rotate(-12 6 30)">DA</text>
          <text x="96" y="86" font-family="Impact,Arial Black,sans-serif" font-size="26" fill="#141414" transform="rotate(9 96 86)">DA</text>
          <text x="10" y="90" font-family="Courier New,monospace" font-weight="700" font-size="9" fill="#141414" transform="rotate(-4 10 90)">ABCD</text>
          <text x="126" y="14" font-family="Arial,sans-serif" font-weight="900" font-size="12" fill="#C8262A" transform="rotate(18 126 14)">!</text>
          <circle cx="140" cy="62" r="7" fill="#C8262A"/>
          ${grainOv(.3)}`);
      })() },

    { id: 'newobjectivity', name: 'New Objectivity', aka: 'Neue Sachlichkeit, Verism',
      when: '1919–1933 · Weimar Germany', y: 1919,
      desc: 'A cold, sharp-focus realism that came after Expressionism, showing Weimar Germany\'s war cripples, profiteers and nightclub sophisticates without warmth. Everything is smooth, crisply outlined and slightly too clear, often with biting satire.',
      spot: 'hard sharp outlines, smooth enamel-like paint with no visible brushwork, pale or sickly skin, cool greenish-gray backgrounds, unflattering staring portraits, satirical city types, glassy detail',
      ref: 'Otto Dix (Portrait of the Journalist Sylvia von Harden), George Grosz (Pillars of Society), Christian Schad (Self-Portrait with Model), Jeanne Mammen',
      prompt: 'New Objectivity oil portrait, cold sharp-focus realism, smooth enamel paint, hard outlines, pale sallow skin, unflattering stare, cool greenish-gray background, satirical Weimar-era mood',
      ex: (() => {
        const bgd = U('mo'), sk = U('mo');
        return sv(`<defs><linearGradient id="${bgd}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9AA89A"/><stop offset="1" stop-color="#5E6C64"/></linearGradient>
          <radialGradient id="${sk}" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#EADCC4"/><stop offset=".7" stop-color="#C9B794"/><stop offset="1" stop-color="#9C9474"/></radialGradient></defs>
          <rect width="160" height="100" fill="url(#${bgd})"/>
          <path d="M0 74 H160 V100 H0Z" fill="#4A524E"/>
          <path d="M28 100 Q30 76 56 70 L104 70 Q130 76 132 100Z" fill="#20242A" stroke="#0E1012" stroke-width=".8"/>
          <path d="M68 70 L80 92 L92 70Z" fill="#F2F0EA" stroke="#0E1012" stroke-width=".6"/>
          <path d="M76 72 L80 90 L84 72 L80 70Z" fill="#7A1E22"/>
          <path d="M70 58 L72 72 Q80 76 88 72 L90 58Z" fill="#B7A784" stroke="#0E1012" stroke-width=".6"/>
          <path d="M62 34 Q62 12 80 12 Q98 12 98 34 Q98 56 80 62 Q62 56 62 34Z" fill="url(#${sk})" stroke="#0E1012" stroke-width=".8"/>
          <path d="M61 30 Q62 10 80 10 Q100 10 99 30 Q96 18 80 18 Q66 18 61 30Z" fill="#141414"/>
          <path d="M82 18 Q90 16 98 26" stroke="#4A4A4A" stroke-width=".5" fill="none"/>
          <path d="M68 33 h8 M84 33 h8" stroke="#2A2A2A" stroke-width="1.2"/>
          <ellipse cx="72" cy="37" rx="2.6" ry="1.6" fill="#F4F2EA"/><circle cx="72" cy="37" r="1.1" fill="#3A5A4A"/>
          <ellipse cx="88" cy="37" rx="2.6" ry="1.6" fill="#F4F2EA"/><circle cx="88" cy="37" r="1.1" fill="#3A5A4A"/>
          <circle cx="88" cy="37" r="5" fill="#DDE8E2" fill-opacity=".25" stroke="#141414" stroke-width=".9"/>
          <path d="M93 38 Q100 50 98 66" stroke="#141414" stroke-width=".4" fill="none"/>
          <path d="M80 38 L78 47 L82 48" stroke="#8A7A5A" stroke-width=".8" fill="none"/>
          <path d="M73 53 Q80 51 87 53" stroke="#6A3A36" stroke-width="1.2" fill="none"/>
          <path d="M66 46 Q68 52 72 54" stroke="#9AA07A" stroke-width="1" fill="none" opacity=".7"/>
          <path d="M124 74 V40 l3 -4 l3 4 V74Z" fill="#D8D4C4" stroke="#0E1012" stroke-width=".5"/>
          <rect x="16" y="20" width="22" height="30" fill="#3A4A44" stroke="#0E1012" stroke-width=".6"/><path d="M27 20 V50 M16 35 H38" stroke="#0E1012" stroke-width=".6"/>`);
      })() },

    { id: 'precisionism', name: 'Precisionism', aka: 'Cubist Realism, Immaculates',
      when: '1918–1940 · United States', y: 1918,
      desc: 'American painters who celebrated factories, grain silos and skyscrapers as the new cathedrals, painting them with razor-clean edges and almost no people. It feels calm, orderly and machine-made.',
      spot: 'factories, smokestacks, water towers and silos, crisp hard-edged geometry, smooth flat planes of light and shadow, clear blue skies, transparent ray-like light beams, no visible brushwork, few or no people',
      ref: 'Charles Sheeler (American Landscape, River Rouge Plant), Charles Demuth (My Egypt), Georgia O\'Keeffe (city paintings), Ralston Crawford',
      prompt: 'Precisionist painting, clean industrial landscape of factories, smokestacks and grain silos, crisp hard-edged geometry, smooth flat planes, clear pale blue sky, transparent diagonal light beams, no people',
      ex: (() => {
        const sk = U('mo');
        return sv(`<defs><linearGradient id="${sk}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FB4D4"/><stop offset="1" stop-color="#E4ECEE"/></linearGradient></defs>
          <rect width="160" height="100" fill="url(#${sk})"/>
          <path d="M20 0 L70 100 L100 100 L40 0Z" fill="#fff" opacity=".22"/>
          <path d="M110 0 L80 100 L96 100 L124 0Z" fill="#fff" opacity=".18"/>
          <g>
          <rect x="18" y="14" width="6" height="56" fill="#B8BCC0"/><rect x="18" y="14" width="3" height="56" fill="#D8DCDE"/>
          <rect x="30" y="22" width="5" height="48" fill="#A8ACB2"/><rect x="30" y="22" width="2.5" height="48" fill="#CCD0D4"/>
          <path d="M44 70 V34 a10 4 0 0 1 20 0 V70Z" fill="#E8E4D8"/><path d="M54 70 V30 a10 4 0 0 1 10 4 V70Z" fill="#BDB8AA"/>
          <path d="M64 70 V34 a10 4 0 0 1 20 0 V70Z" fill="#E8E4D8"/><path d="M74 70 V30 a10 4 0 0 1 10 4 V70Z" fill="#BDB8AA"/>
          <path d="M90 70 V44 h40 v26Z" fill="#C8A47A"/><path d="M90 44 l10 -8 l10 8 l10 -8 l10 8Z" fill="#9A7A56"/>
          <path d="M100 36 v8 M120 36 v8" stroke="#7A5E42" stroke-width=".6"/>
          ${[0, 1, 2, 3].map(k => `<rect x="${94 + k * 9}" y="52" width="5" height="10" fill="#4A5E70"/>`).join('')}
          <path d="M136 70 V40 h6 V70Z" fill="#8A8E94"/><ellipse cx="142" cy="30" rx="9" ry="4" fill="#A8ACB2"/><rect x="133" y="30" width="18" height="8" fill="#B8BCC0"/><path d="M134 38 L138 56 M150 38 L146 56" stroke="#5A5E64" stroke-width="1"/>
          <path d="M0 70 H160 V100 H0Z" fill="#6A7880"/>
          <path d="M0 70 H160 V76 H0Z" fill="#8A969C"/>
          <path d="M0 84 H160" stroke="#3E4A52" stroke-width="1"/><path d="M0 88 H160" stroke="#3E4A52" stroke-width="1"/>
          </g>
          <path d="M14 70 L4 100 M150 70 L158 100" stroke="#3E4A52" stroke-width=".8"/>
          <path d="M24 14 Q30 8 40 8 Q48 6 58 8" stroke="#F4F4F2" stroke-width="3" fill="none" stroke-linecap="round" opacity=".85"/>`);
      })() },

    { id: 'harlem', name: 'Harlem Renaissance', aka: 'New Negro Movement art, Aaron Douglas style',
      when: '1918–1937 · Harlem, New York', y: 1918,
      desc: 'A flowering of Black American art, music and writing centered in Harlem, which told African American history and hope in a new modern visual language. Aaron Douglas\'s murals mixed flat silhouettes, Art Deco geometry and African sculpture into glowing purple-gold scenes.',
      spot: 'flat silhouetted figures in profile, concentric rings of light radiating outward, translucent overlapping bands of tone, purple, violet and gold palette, stylized palms, stars and musical instruments',
      ref: 'Aaron Douglas (Aspects of Negro Life), Lois Mailou Jones, Augusta Savage, Palmer Hayden',
      prompt: 'Harlem Renaissance mural in the manner of Aaron Douglas: flat silhouetted figure in profile, concentric rings of light, translucent overlapping bands, purple, violet and gold palette, Art Deco geometry',
      ex: (() => {
        let rings = '';
        const rc = ['#F2D58A', '#C9A6C8', '#A27AB0', '#7E5A98', '#5E3E7E', '#46305E'];
        for (let i = rc.length - 1; i >= 0; i--) rings += `<circle cx="108" cy="22" r="${16 + i * 16}" fill="${rc[i]}"/>`;
        const fig = `<path d="M52 100 L54 74 Q50 64 56 56 L54 48 Q52 40 58 36 Q64 34 66 40 Q68 44 66 48 L62 50 Q70 52 74 46 L92 26 L95 28 L80 52 Q74 62 70 64 L74 100Z" fill="#2A1A3A"/>
          <path d="M60 37 Q57 41 58 46" stroke="#3A2850" stroke-width=".8" fill="none"/>`;
        return sv(`${bg('#3A2650')}${rings}
          <path d="M94 0 L160 64 V0Z" fill="#F2D58A" opacity=".18"/>
          <path d="M60 0 L160 100 L140 100 L40 0Z" fill="#FFFFFF" opacity=".08"/>
          ${[[136, 8], [148, 28], [124, 50]].map(([x, y]) => `<path d="M${x} ${y - 3} l1 2.2 2.4 .2 -1.8 1.6 .6 2.4 -2.2 -1.2 -2.2 1.2 .6 -2.4 -1.8 -1.6 2.4 -.2Z" fill="#F2D58A"/>`).join('')}
          <path d="M12 100 Q14 70 22 46" stroke="#2A1A3A" stroke-width="3" fill="none"/>
          ${[[-28, 16], [-8, 18], [14, 18], [36, 15], [-50, 12]].map(([dx, dy]) => `<path d="M22 46 Q${f1(22 + dx * .5)} ${f1(46 - 10)} ${f1(22 + dx)} ${f1(46 + dy * .3)} Q${f1(22 + dx * .45)} ${f1(46 - 4)} 22 46Z" fill="#2A1A3A"/>`).join('')}
          ${fig}
          <path d="M100 100 L104 84 L124 84 L130 100Z" fill="#2A1A3A"/>
          <path d="M0 92 H160 V100 H0Z" fill="#2A1A3A" opacity=".6"/>
          ${grainOv(.2)}`);
      })() },

    { id: 'muralism', name: 'Mexican muralism', aka: 'Muralismo, Los Tres Grandes',
      when: '1920–1950s · Mexico', y: 1920,
      desc: 'After the Mexican Revolution, the government paid artists to paint huge public walls telling the nation\'s history and the struggles of workers and Indigenous people. Figures are heavy, rounded and monumental, packed into crowded story-telling scenes.',
      spot: 'monumental rounded figures with simplified volumes, workers, farmers and Indigenous people as heroes, earthy terracotta, ochre and deep green, crowded narrative scenes, fresco texture, social and political themes',
      ref: 'Diego Rivera (Detroit Industry, The Flower Carrier), José Clemente Orozco, David Alfaro Siqueiros',
      prompt: 'Mexican muralism fresco, monumental rounded figures of workers and farmers, simplified heavy volumes, earthy terracotta, ochre and deep green, crowded narrative scene, flat matte fresco texture, social themes',
      ex: (() => {
        const sh = U('mo');
        let lil = '';
        const r = rng(91);
        for (let i = 0; i < 16; i++) { const a = Math.PI * (1.05 + r() * .9), rr = 8 + r() * 22; const x = 82 + Math.cos(a) * rr * 1.3, y = 34 + Math.sin(a) * rr * .8; lil += `<path d="M${f1(x)} ${f1(y)} q-3 -5 0 -9 q3 4 0 9Z" fill="#F4EEDC" stroke="#9A9078" stroke-width=".4" transform="rotate(${f1(-60 + r() * 120)} ${f1(x)} ${f1(y)})"/><circle cx="${f1(x)}" cy="${f1(y - 3)}" r=".8" fill="#E8C04A"/>`; }
        return sv(`<defs><radialGradient id="${sh}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#C46A3C"/><stop offset="1" stop-color="#7A3A20"/></radialGradient></defs>
          ${bg('#D8A860')}
          <path d="M0 0 H160 V60 Q120 50 80 56 T0 52Z" fill="#E6C27A"/>
          <path d="M0 70 Q40 60 80 66 T160 62 V100 H0Z" fill="#B87A3A"/>
          <path d="M120 100 V60 Q132 52 146 60 V100Z" fill="#3E5A3A"/><path d="M132 52 Q140 30 150 54" fill="#4E7044"/>
          <path d="M4 100 V64 Q14 54 26 64 V100Z" fill="#3E5A3A"/>
          <ellipse cx="82" cy="34" rx="40" ry="20" fill="#C9963E" stroke="#6A4420" stroke-width="1"/>
          <path d="M44 36 Q82 50 120 36" stroke="#8A5A28" stroke-width="1.2" fill="none"/><path d="M48 28 Q82 40 116 28" stroke="#8A5A28" stroke-width=".8" fill="none" opacity=".7"/>
          <path d="M44 30 Q48 18 70 14 Q82 10 96 14" fill="#3E7044" stroke="#2A4A2E" stroke-width=".6"/>
          ${lil}
          <path d="M46 100 Q42 74 58 64 Q82 58 106 64 Q122 74 118 100Z" fill="#F0E6CE" stroke="#8A7A5A" stroke-width=".8"/>
          <path d="M62 70 Q66 86 64 100 M102 70 Q98 86 100 100 M82 66 V100" stroke="#C8BA96" stroke-width="1.4" fill="none"/>
          <path d="M58 66 Q46 54 48 40 L56 38 Q56 52 66 62Z" fill="url(#${sh})" stroke="#5A2A14" stroke-width=".5"/>
          <path d="M106 66 Q118 54 116 40 L108 38 Q108 52 98 62Z" fill="url(#${sh})" stroke="#5A2A14" stroke-width=".5"/>
          <ellipse cx="52" cy="38" rx="4.5" ry="3" fill="url(#${sh})"/><ellipse cx="112" cy="38" rx="4.5" ry="3" fill="url(#${sh})"/>
          <path d="M74 64 Q72 52 82 50 Q92 52 90 64Z" fill="url(#${sh})"/>
          <path d="M72 58 Q72 46 82 46 Q92 46 92 58 Q88 52 82 52 Q76 52 72 58Z" fill="#2A1A10"/>
          <path d="M78 59 q2 1 4 0 M84 59 q2 1 4 0" stroke="#3A1A10" stroke-width=".7" fill="none"/>
          <path d="M30 100 Q34 86 46 88 L50 100Z" fill="url(#${sh})"/><path d="M114 100 L118 88 Q130 86 134 100Z" fill="url(#${sh})"/>
          ${grainOv(.45)}`);
      })() },

    { id: 'regionalism', name: 'American Regionalism', aka: 'Regionalism, American Scene painting',
      when: '1928–1945 · American Midwest', y: 1928,
      desc: 'Painters who turned away from European modernism to paint the rural Midwest: farms, small towns and the people who worked them. Grant Wood\'s landscapes swell into toy-like rolling hills with lollipop trees and neatly combed fields.',
      spot: 'rolling rounded hills like soft pillows, crop rows following the curves, round puffball trees in neat lines, small white farmhouses and red barns, smooth stylized forms, sunny clear light, sometimes a stern farm couple',
      ref: 'Grant Wood (American Gothic, Young Corn, Stone City), Thomas Hart Benton, John Steuart Curry',
      prompt: 'American Regionalism painting, rolling stylized Midwest farmland with pillowy hills, curving crop rows, round lollipop trees in neat lines, small red barn and white farmhouse, smooth forms, warm clear light',
      ex: (() => {
        const sk = U('mo');
        const rows = (d, c, n, dy) => { let s = ''; for (let k = 1; k < n; k++) s += `<path d="${d}" transform="translate(0 ${k * dy})" stroke="${c}" stroke-width=".7" fill="none" opacity=".7"/>`; return s; };
        const tree = (x, y, s) => `<path d="M${x} ${y} v${4 * s}" stroke="#4A3420" stroke-width="${f1(.8 * s)}"/><circle cx="${x}" cy="${f1(y - 2.4 * s)}" r="${f1(3 * s)}" fill="#3E6A34"/><circle cx="${f1(x - .8 * s)}" cy="${f1(y - 3.2 * s)}" r="${f1(1.2 * s)}" fill="#6A9A4A"/>`;
        return sv(`<defs><linearGradient id="${sk}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A8CBE0"/><stop offset="1" stop-color="#F2E6C4"/></linearGradient></defs>
          <rect width="160" height="100" fill="url(#${sk})"/>
          <path d="M0 40 Q30 22 60 36 Q90 18 124 32 Q144 24 160 30 V100 H0Z" fill="#8AAA5A"/>
          <path d="M0 52 Q36 34 76 50 Q110 36 160 46 V100 H0Z" fill="#C9A85A"/>
          ${rows('M0 52 Q36 34 76 50 Q110 36 160 46', '#9A7A3A', 9, 3)}
          <path d="M0 70 Q40 54 86 70 Q122 58 160 66 V100 H0Z" fill="#6E9A44"/>
          ${rows('M0 70 Q40 54 86 70 Q122 58 160 66', '#4E7A34', 10, 3.2)}
          <path d="M60 100 Q90 74 160 82 V100Z" fill="#B8873E"/>
          ${rows('M60 100 Q90 74 160 82', '#8A5E2A', 7, 3)}
          ${[[18, 36, 1.2], [26, 34, 1.1], [34, 33, 1], [104, 34, 1], [112, 32, 1.1], [120, 31, 1], [70, 46, 1.4], [80, 44, 1.3], [90, 43, 1.2]].map(([x, y, s]) => tree(x, y, s)).join('')}
          <path d="M44 46 h10 v-6 l-5 -4 l-5 4Z" fill="#F4F0E4" stroke="#6A5A44" stroke-width=".4"/><path d="M43 40 l6 -5 l6 5Z" fill="#5A4A3A"/>
          <path d="M132 58 h12 v-7 l-6 -5 l-6 5Z" fill="#B8382C"/><path d="M131 51 l7 -6 l7 6Z" fill="#6A2A20"/><rect x="136" y="53" width="4" height="5" fill="#F4F0E4"/>
          ${tree(14, 80, 2)}${tree(26, 78, 1.7)}`);
      })() },

    { id: 'wpa', name: 'WPA poster', aka: 'Federal Art Project poster, New Deal silkscreen poster',
      when: '1935–1943 · United States', y: 1935,
      desc: 'Posters made by artists employed by the New Deal\'s Federal Art Project, hand-printed by silkscreen to promote national parks, public health, libraries and safety. Simple flat shapes in a few muted inks, with bold, plain sans-serif lettering in a block at the bottom.',
      spot: 'hand-pulled silkscreen look, 3 to 6 flat muted inks with no gradients, simplified layered landscapes or public-service scenes, bold condensed sans-serif lettering in a band, small "WPA" or "Federal Art Project" credit line',
      ref: 'WPA national park series (Grand Teton, Yellowstone), Federal Art Project health and safety posters, Richard Halls, Jerome Henry Rothstein',
      prompt: 'WPA poster, 1930s Federal Art Project silkscreen, flat layered national park landscape in five muted inks, no gradients, bold condensed sans-serif lettering band at bottom, small credit line',
      ex: sv(`${bg('#E9DFC4')}
        <rect x="0" y="0" width="160" height="72" fill="#E6C88A"/>
        <circle cx="118" cy="24" r="12" fill="#F2E2B4"/>
        <path d="M0 52 L22 30 L34 38 L54 14 L72 34 L84 26 L106 48 L130 30 L160 50 V72 H0Z" fill="#6F7E9A"/>
        <path d="M54 14 L62 22 L58 24 L54 20 L50 24 L47 21Z M130 30 L138 36 L134 37 L130 34 L126 37Z" fill="#E9DFC4"/>
        <path d="M0 60 Q40 46 80 56 T160 54 V72 H0Z" fill="#3E5E4E"/>
        ${[8, 18, 26, 120, 132, 144, 152].map((x, i) => `<path d="M${x} ${72} L${x + 5} ${48 + (i % 3) * 4} L${x + 10} 72Z" fill="#24382E"/>`).join('')}
        <path d="M40 72 Q70 64 100 72Z" fill="#9AB0B8"/>
        <rect x="0" y="72" width="160" height="28" fill="#2E3A4A"/>
        <text x="80" y="88" text-anchor="middle" font-family="Arial Narrow,Arial,Helvetica,sans-serif" font-weight="700" font-size="13" letter-spacing="1.5" fill="#E9DFC4">NATIONAL PARKS</text>
        <rect x="56" y="92" width="48" height=".8" fill="#E6C88A"/>
        <text x="80" y="97.5" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="3.6" letter-spacing=".8" fill="#E6C88A">WPA · FEDERAL ART PROJECT</text>
        ${grainOv(.3)}`) },

    { id: 'socrealism', name: 'Socialist Realism', aka: 'Soviet Realism, Stalin-era propaganda art',
      when: '1932–1980s · Soviet Union, Eastern Bloc, China', y: 1932,
      desc: 'The official art style of the Soviet Union, which showed workers and farmers as idealized heroes building a glorious future. It is realistic in technique but always optimistic and staged, with strong bodies, red banners and faces lifted toward the horizon.',
      spot: 'heroic muscular workers and farmers, low camera angle, upward hopeful gaze, red flags and banners, factories, tractors and wheat fields, sunrise light, clean confident realism',
      ref: 'Vera Mukhina (Worker and Kolkhoz Woman), Aleksandr Deineka, Isaak Brodsky, Arkady Plastov',
      prompt: 'Socialist Realism painting, heroic worker and farm woman seen from a low angle, upward hopeful gaze, red banner, factories and wheat fields, warm sunrise light, idealized confident realism',
      ex: (() => {
        const sk = U('mo'), sk2 = U('mo');
        let rays = '';
        for (let i = 0; i < 12; i++) { const a = Math.PI * (1 + i / 11); rays += `<path d="M110 70 L${f1(110 + Math.cos(a - .05) * 200)} ${f1(70 + Math.sin(a - .05) * 200)} L${f1(110 + Math.cos(a + .05) * 200)} ${f1(70 + Math.sin(a + .05) * 200)}Z" fill="#FFF0C8" opacity=".25"/>`; }
        const r = rng(101); let wheat = '';
        for (let i = 0; i < 60; i++) { const x = r() * 160; wheat += `<path d="M${f1(x)} 100 l${f1(-1 + r() * 2)} -${f1(8 + r() * 10)}" stroke="${pick(r, ['#E8B83A', '#C9963E', '#F2D070'])}" stroke-width="1"/>`; }
        return sv(`<defs><linearGradient id="${sk}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A8AC0"/><stop offset=".7" stop-color="#F2C88A"/><stop offset="1" stop-color="#F8E2B0"/></linearGradient>
          <linearGradient id="${sk2}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7A2A1E"/><stop offset=".5" stop-color="#C46A4A"/><stop offset="1" stop-color="#8A3A2A"/></linearGradient></defs>
          <rect width="160" height="100" fill="url(#${sk})"/>${rays}
          <g fill="#7A6A6A" opacity=".8"><rect x="118" y="56" width="4" height="22"/><rect x="126" y="50" width="4" height="28"/><rect x="134" y="58" width="4" height="20"/><path d="M112 78 V66 h40 V78Z"/></g>
          <path d="M120 54 q-6 -8 2 -14 q6 -6 0 -12" stroke="#BCB4AC" stroke-width="3" fill="none" opacity=".6"/>
          <path d="M0 80 Q80 70 160 78 V100 H0Z" fill="#C9963E"/>${wheat}
          <path d="M84 6 L86 74" stroke="#4A2A1A" stroke-width="1.6"/>
          <path d="M86 6 Q104 2 118 10 Q130 16 146 10 L144 32 Q128 38 116 32 Q102 26 87 30Z" fill="#D8262A"/>
          <path d="M100 12 Q112 18 124 18" stroke="#A81A1E" stroke-width="1.2" fill="none"/>
          <path d="M26 100 L32 64 Q30 52 40 48 L56 48 Q64 52 62 64 L66 100Z" fill="#2E4A6A"/>
          <path d="M56 50 L82 24 L86 28 L64 58Z" fill="url(#${sk2})"/>
          <path d="M40 48 Q38 38 46 34 Q54 32 56 40 Q58 46 54 50Z" fill="url(#${sk2})"/>
          <path d="M42 36 Q46 28 56 32 Q52 32 48 34Z" fill="#3A2A1A"/>
          <path d="M53 38 l3 -2" stroke="#3A1A10" stroke-width=".8"/>
          <path d="M62 100 L68 70 Q68 60 76 58 L88 60 Q94 66 92 74 L96 100Z" fill="#B8382C"/>
          <path d="M74 58 Q72 48 80 46 Q88 46 88 54 Q86 60 82 62Z" fill="#D88A6A"/>
          <path d="M72 52 Q74 42 84 44 Q90 46 89 52 Q84 46 76 50Z" fill="#F4F0E4"/>
          <path d="M88 64 Q96 56 98 46" stroke="#D88A6A" stroke-width="3" stroke-linecap="round" fill="none"/>
          <path d="M98 46 q4 -6 -2 -10 q-4 -2 -6 2" stroke="#9AA0A8" stroke-width="1.6" fill="none"/>
          ${grainOv(.25)}`);
      })() },
  ]
});

/* ===== c_contemporary.js ===== */
/* ---------- Contemporary: 1945 to 1980, 1980 to today ---------- */

// stripe pattern defs, returns [defs, id]
function co_stripes(c1, c2, w = 2.4, ang = 45) {
  const id = U('cost');
  return [`<pattern id="${id}" width="${w * 2}" height="${w * 2}" patternUnits="userSpaceOnUse" patternTransform="rotate(${ang})"><rect width="${w * 2}" height="${w * 2}" fill="${c2}"/><rect width="${w}" height="${w * 2}" fill="${c1}"/></pattern>`, id];
}
const co_blur = s => { const id = U('cobl'); return [`<filter id="${id}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${s}"/></filter>`, id]; };

/* --- Art Brut: crude dense face, Hourloupe-like cells, crayon marks --- */
function co_artbrut() {
  const r = rng(11);
  const [wd, wf] = wob(2.2, .08, 5);
  const [sd1, s1] = co_stripes('#d8302a', '#f6f1e4', 1.6, 35);
  const [sd2, s2] = co_stripes('#2347a8', '#f6f1e4', 1.6, -30);
  const cid = U('coc');
  let marks = '';
  for (let i = 0; i < 70; i++) {
    const x = r() * 160, y = r() * 100, k = r();
    if (k < .35) marks += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(.8 + r() * 1.3)}" fill="none" stroke="#2a1d14" stroke-width=".6"/>`;
    else if (k < .7) marks += `<path d="M${f1(x)} ${f1(y)} l2 -2.5 l2 2.5 l2 -2.5 l2 2.5" fill="none" stroke="${pick(r, ['#2a1d14', '#a3301f', '#2c4a7a'])}" stroke-width=".7"/>`;
    else marks += `<path d="M${f1(x)} ${f1(y)} l${f1(r() * 6 - 3)} ${f1(r() * 6 - 3)}" stroke="#2a1d14" stroke-width=".9" stroke-linecap="round"/>`;
  }
  // cells inside the face
  let cells = '';
  const cs = [[48, 22, 14, 10, s1], [76, 30, 12, 9, s2], [58, 64, 16, 8, s1], [40, 48, 9, 12, s2], [82, 58, 10, 10, s1], [66, 44, 6, 5, s2]];
  for (const [x, y, a, b, s] of cs) cells += `<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}" fill="url(#${s})" stroke="#111" stroke-width="1.6"/>`;
  // small stick people at right
  let people = '';
  for (let i = 0; i < 3; i++) {
    const x = 118 + i * 14, y = 40 + (i % 2) * 22;
    people += `<g fill="none" stroke="#111" stroke-width="1.4" stroke-linecap="round"><circle cx="${x}" cy="${y}" r="5" fill="#f6f1e4"/><path d="M${x} ${y + 5} v14 M${x - 7} ${y + 10} h14 M${x} ${y + 19} l-5 9 M${x} ${y + 19} l5 9"/><circle cx="${x - 2}" cy="${y - 1}" r=".8" fill="#111"/><circle cx="${x + 2}" cy="${y - 1.5}" r="1.3" fill="#111"/></g>`;
  }
  return sv(`<defs>${wd}${sd1}${sd2}<clipPath id="${cid}"><ellipse cx="62" cy="47" rx="36" ry="40"/></clipPath></defs>${bg('#c79a5e')}
  <g opacity=".6">${marks}</g>
  <g filter="url(#${wf})">
  <ellipse cx="62" cy="47" rx="36" ry="40" fill="#f6f1e4"/>
  <g clip-path="url(#${cid})">${cells}<path d="M26 40 Q50 34 60 50 T98 44 M40 80 Q55 58 70 76 M62 8 Q70 30 92 26" fill="none" stroke="#111" stroke-width="1.6"/></g>
  <ellipse cx="62" cy="47" rx="36" ry="40" fill="none" stroke="#111" stroke-width="2.6"/>
  <circle cx="48" cy="38" r="8" fill="#fff" stroke="#111" stroke-width="2"/><circle cx="50" cy="39" r="3.4" fill="#111"/>
  <circle cx="76" cy="34" r="5" fill="#fff" stroke="#111" stroke-width="2"/><circle cx="75" cy="35" r="2.2" fill="#111"/>
  <rect x="44" y="60" width="34" height="10" rx="2" fill="#fff" stroke="#111" stroke-width="2"/>
  <path d="M50 60 v10 M56 60 v10 M62 60 v10 M68 60 v10 M73 60 v10" stroke="#111" stroke-width="1.3"/>
  ${people}
  <path d="M104 12 l6 6 M110 12 l-6 6 M140 88 q6 -6 12 0 q-6 6 -12 0" fill="none" stroke="#a3301f" stroke-width="1.6"/>
  </g>${grainOv(.3)}`);
}

/* --- Color field: Rothko-like soft rectangles --- */
function co_colorfield() {
  const [bd, bf] = co_blur(1.1);
  const [bd2, bf2] = co_blur(2.5);
  return sv(`<defs>${bd}${bd2}</defs>${bg('#8a2130')}
  <g filter="url(#${bf})">
  <rect x="20" y="8" width="120" height="46" rx="2" fill="#e25a26"/>
  <rect x="20" y="61" width="120" height="31" rx="2" fill="#3a0c18"/>
  </g>
  <g filter="url(#${bf2})" opacity=".55"><rect x="30" y="16" width="100" height="26" fill="#f6a043"/><rect x="34" y="68" width="92" height="16" fill="#5a1626"/></g>
  ${grainOv(.4)}${vig(.35)}`);
}

/* --- Hard-edge: crisp flat shapes --- */
function co_hardedge() {
  return sv(`${bg('#f3efe4')}
  <rect x="0" y="0" width="46" height="100" fill="#1d47a6"/>
  <path d="M46 100 L46 0 Q118 8 116 100 Z" fill="#e2412b"/>
  <rect x="116" y="0" width="44" height="100" fill="#111"/>
  <path d="M116 100 L160 56 L160 100 Z" fill="#f2c318"/>
  <circle cx="23" cy="72" r="13" fill="#f3efe4"/>
  <path d="M0 0 H30 L0 30 Z" fill="#2fa86a"/>`);
}

/* --- Psychedelic poster: wavy bands, melting letters, complementary vibration --- */
function co_psychedelic() {
  const id = U('cops');
  let bands = '';
  const cols = ['#ff3d7f', '#ff9a1f', '#7b2fd0', '#ff3d7f', '#ff9a1f', '#7b2fd0', '#ff3d7f', '#ff9a1f'];
  for (let i = cols.length - 1; i >= 0; i--) {
    const rx = 18 + i * 12, ry = 10 + i * 8;
    let d = '';
    for (let a = 0; a <= 64; a++) {
      const t = a / 64 * Math.PI * 2, w = 1 + .08 * Math.sin(t * 7 + i);
      d += (a ? 'L' : 'M') + f1(80 + Math.cos(t) * rx * w) + ' ' + f1(50 + Math.sin(t) * ry * w);
    }
    bands += `<path d="${d}Z" fill="${cols[i]}"/>`;
  }
  return sv(`<defs><filter id="${id}" x="-10%" y="-20%" width="120%" height="140%"><feTurbulence type="turbulence" baseFrequency=".02 .06" numOctaves="1" seed="4"/><feDisplacementMap in="SourceGraphic" scale="6"/></filter></defs>${bg('#3b1170')}${bands}
  <ellipse cx="80" cy="50" rx="62" ry="24" fill="#16b85a"/>
  <g filter="url(#${id})"><text x="80" y="58.5" text-anchor="middle" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="25" fill="#ff2a3a" letter-spacing="-.5" transform="translate(80 50) scale(1 1.55) translate(-80 -50)">GROOVE</text></g>`);
}

/* --- Photorealism: storefront reflections + chrome bumper --- */
function co_photorealism() {
  const sky = U('cosk'), gl = U('cogl'), cr = U('cocr');
  let refl = '';
  const r = rng(5);
  for (let x = 14; x < 146; x += 9 + r() * 6) {
    const h = 10 + r() * 18;
    refl += `<rect x="${f1(x)}" y="${f1(54 - h)}" width="${f1(6 + r() * 6)}" height="${f1(h)}" fill="#8b98a8" opacity=".55"/>`;
  }
  let mull = '';
  for (const x of [14, 50, 86, 122]) mull += `<rect x="${x}" y="24" width="24" height="32" fill="url(#${gl})"/>`;
  return sv(`<defs>
  <linearGradient id="${sky}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fb8de"/><stop offset="1" stop-color="#dbe8f2"/></linearGradient>
  <linearGradient id="${gl}" x1="0" y1="0" x2=".4" y2="1"><stop offset="0" stop-color="#c9dbea"/><stop offset=".45" stop-color="#6f8aa4"/><stop offset=".5" stop-color="#2c3a48"/><stop offset="1" stop-color="#4a5c6c"/></linearGradient>
  <linearGradient id="${cr}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".3" stop-color="#9fc4e6"/><stop offset=".48" stop-color="#e9f2fa"/><stop offset=".52" stop-color="#5a4a3a"/><stop offset=".7" stop-color="#1c1c1e"/><stop offset=".9" stop-color="#b8b8bc"/><stop offset="1" stop-color="#f4f4f4"/></linearGradient>
  </defs>${bg('#b8a48a')}
  <rect x="0" y="0" width="160" height="16" fill="url(#${sky})"/>
  <rect x="0" y="12" width="160" height="50" fill="#c9b79c"/>
  <rect x="8" y="14" width="144" height="8" fill="#8a2a22"/>
  <rect x="10" y="22" width="140" height="36" fill="#2b2b2b"/>
  ${mull}
  <g>${refl}</g>
  <path d="M14 24 l24 32 M50 24 l22 32 M88 24 l20 32 M124 24 l22 32" stroke="#fff" stroke-width="1.2" opacity=".55"/>
  <rect x="0" y="58" width="160" height="6" fill="#d6cfc2"/>
  <rect x="0" y="64" width="160" height="36" fill="#6b6a68"/>
  <path d="M0 72 H160" stroke="#d8d4cc" stroke-width=".6" opacity=".5"/>
  <path d="M-4 90 V74 Q-2 70 6 70 L24 70 L34 60 H74 L88 70 H104 Q112 71 112 78 V90Z" fill="#8c1a1f"/>
  <path d="M28 70 L36 62 H52 V70Z M56 70 V62 H72 L83 70Z" fill="url(#${gl})"/>
  <path d="M38 62 L32 70 M60 62 L56 70" stroke="#fff" stroke-width=".8" opacity=".7"/>
  <path d="M-4 77 H112" stroke="#f2b5b0" stroke-width=".6" opacity=".7"/>
  <rect x="-4" y="79" width="116" height="3" fill="url(#${cr})"/>
  <rect x="98" y="83" width="18" height="7" rx="3" fill="url(#${cr})"/>
  <ellipse cx="108" cy="75" rx="2.4" ry="2" fill="#fff7d0"/>
  <circle cx="20" cy="90" r="8.5" fill="#151515"/><circle cx="20" cy="90" r="5" fill="url(#${cr})"/><circle cx="20" cy="90" r="1.6" fill="#333"/>
  <circle cx="86" cy="90" r="8.5" fill="#151515"/><circle cx="86" cy="90" r="5" fill="url(#${cr})"/><circle cx="86" cy="90" r="1.6" fill="#333"/>
  <path d="M30 74 h50" stroke="#fff" stroke-width=".9" opacity=".8"/>
  <circle cx="62" cy="84" r="1.3" fill="#fff"/>`);
}

/* --- Neo-expressionism: raw patches, scrawled mask, crossed-out word --- */
function co_neoexpr() {
  const r = rng(23);
  const [wd, wf] = wob(3, .05, 9);
  let patches = '';
  const cols = ['#f2c21b', '#d9331f', '#1d4fa0', '#f4efe2', '#e8742a', '#2c2c2c'];
  for (let i = 0; i < 14; i++) patches += `<rect x="${f1(r() * 150 - 10)}" y="${f1(r() * 90 - 10)}" width="${f1(25 + r() * 40)}" height="${f1(18 + r() * 30)}" fill="${pick(r, cols)}" opacity="${f1(.75 + r() * .25)}"/>`;
  let scr = '';
  for (let i = 0; i < 26; i++) {
    const x = r() * 160, y = r() * 100;
    scr += `<path d="M${f1(x)} ${f1(y)} l${f1(r() * 14 - 7)} ${f1(r() * 10 - 5)}" stroke="#111" stroke-width="${f1(.6 + r() * 1.2)}" stroke-linecap="round"/>`;
  }
  let drips = '';
  for (let i = 0; i < 6; i++) { const x = 40 + r() * 80; drips += `<path d="M${f1(x)} ${f1(70 + r() * 6)} v${f1(8 + r() * 14)}" stroke="#d9331f" stroke-width="1.6" stroke-linecap="round"/>`; }
  return sv(`<defs>${wd}</defs>${bg('#e6ddc8')}
  <g filter="url(#${wf})">${patches}
  <g fill="none" stroke="#111" stroke-linecap="round" stroke-linejoin="round">
    <path d="M58 22 Q80 10 102 22 L106 54 Q96 76 80 78 Q62 76 54 54 Z" fill="#3a2a22" stroke-width="2.6"/>
    <circle cx="70" cy="38" r="6" fill="#f4efe2" stroke-width="2"/><circle cx="92" cy="37" r="7" fill="#f4efe2" stroke-width="2"/>
    <circle cx="70" cy="39" r="2" fill="#111"/><circle cx="93" cy="37" r="2.6" fill="#111"/>
    <path d="M64 58 H96 M66 64 H94" stroke="#f4efe2" stroke-width="2"/>
    <path d="M68 56 v10 M74 56 v10 M80 56 v10 M86 56 v10 M92 56 v10" stroke="#f4efe2" stroke-width="1.4"/>
    <path d="M58 22 l-6 -10 M80 14 l0 -10 M100 20 l8 -9" stroke-width="2.2"/>
  </g>
  ${scr}${drips}
  <text x="12" y="88" font-family="Arial Black, Impact, sans-serif" font-size="13" fill="#111">BONE</text>
  <path d="M10 84 H58 M12 80 L56 90" stroke="#111" stroke-width="2"/>
  <path d="M118 14 h24 M118 20 h24 M124 8 v18 M136 8 v18" stroke="#f4efe2" stroke-width="1.6"/>
  <path d="M120 70 l18 -8 m-5 -2 l5 2 l-3 5" fill="none" stroke="#111" stroke-width="1.8"/>
  </g>${grainOv(.25)}`);
}

/* --- Graffiti: brick wall, bubble throw-up, drips, stencil, tag --- */
function co_graffiti() {
  const r = rng(31);
  const fillg = U('cogf'), [bd, bf] = co_blur(1.6);
  let bricks = '';
  for (let y = 0; y < 100; y += 7) for (let x = (y / 7 % 2) * -8; x < 160; x += 16) bricks += `<rect x="${x + .5}" y="${y + .5}" width="15" height="6" fill="${pick(r, ['#9c5a46', '#a6624c', '#8f5140', '#a8695a'])}"/>`;
  let drips = '';
  for (let i = 0; i < 9; i++) { const x = 18 + r() * 96; drips += `<path d="M${f1(x)} 62 v${f1(5 + r() * 16)}" stroke="#ff4fa3" stroke-width="1.5" stroke-linecap="round"/>`; }
  return sv(`<defs>${bd}<linearGradient id="${fillg}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe23a"/><stop offset=".55" stop-color="#ff8a1e"/><stop offset="1" stop-color="#ff3fa0"/></linearGradient></defs>${bg('#6f3d31')}${bricks}
  <ellipse cx="66" cy="44" rx="64" ry="26" fill="#2fd1e0" opacity=".85" filter="url(#${bf})"/>
  ${drips}
  <text x="66" y="62" text-anchor="middle" font-family="Arial Rounded MT Bold, Arial Black, sans-serif" font-weight="900" font-size="38" fill="url(#${fillg})" stroke="#111" stroke-width="5" paint-order="stroke" stroke-linejoin="round" transform="rotate(-6 66 46)" letter-spacing="-2">ZAP</text>
  <g fill="#fff" transform="rotate(-6 66 46)"><ellipse cx="37" cy="40" rx="3" ry="1.4"/><ellipse cx="66" cy="40" rx="2.2" ry="1.3"/><ellipse cx="91" cy="40" rx="2.6" ry="1.4"/><circle cx="42" cy="41" r=".9"/><circle cx="95" cy="41" r=".9"/></g>
  <g opacity=".9"><circle cx="140" cy="48" r="17" fill="#111" opacity=".25" filter="url(#${bf})"/>
  <g fill="#141414"><circle cx="140" cy="29" r="5.5"/><path d="M134 36 h12 q3 0 3 3 v16 h-4 l1 22 h-5 l-1 -16 l-1 16 h-5 l1 -22 h-4 v-16 q0 -3 3 -3z"/><path d="M148 38 l10 -8 l2 2 l-10 9z"/><rect x="155" y="24" width="4" height="7" rx="1" transform="rotate(-40 157 27)"/></g></g>
  <path d="M10 88 q6 -10 10 0 t10 -2 q4 -8 8 0 l6 -6 q2 8 10 2" fill="none" stroke="#f4f4f4" stroke-width="1.5" stroke-linecap="round"/>
  ${grainOv(.25)}`);
}

/* --- Lowbrow / Pop surrealism: big-eyed porcelain girl in ornate frame --- */
function co_lowbrow() {
  const sky = U('cols'), skin = U('cosn'), gold = U('cogd');
  let beads = '';
  for (let i = 0; i < 28; i++) { const t = i / 28 * Math.PI * 2; beads += `<circle cx="${f1(80 + Math.cos(t) * 40)}" cy="${f1(50 + Math.sin(t) * 46)}" r="2.6" fill="url(#${gold})"/>`; }
  const eye = (x) => `<ellipse cx="${x}" cy="52" rx="8" ry="9" fill="#fff"/><circle cx="${x}" cy="53" r="6.4" fill="#4a2f6a"/><circle cx="${x}" cy="53" r="3.4" fill="#120a1a"/><circle cx="${x - 2.4}" cy="50" r="1.8" fill="#fff"/><circle cx="${x + 2}" cy="56" r=".8" fill="#fff"/>`;
  return sv(`<defs>
  <radialGradient id="${sky}" cx=".5" cy=".35" r=".8"><stop offset="0" stop-color="#ffe6ef"/><stop offset=".6" stop-color="#f3a9c4"/><stop offset="1" stop-color="#6aa6a4"/></radialGradient>
  <radialGradient id="${skin}" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#fffaf5"/><stop offset="1" stop-color="#ecd2cc"/></radialGradient>
  <radialGradient id="${gold}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff2b0"/><stop offset=".6" stop-color="#c9952e"/><stop offset="1" stop-color="#6e4a12"/></radialGradient>
  </defs>${bg('#2c1a2e')}
  <ellipse cx="80" cy="50" rx="40" ry="46" fill="url(#${sky})"/>
  ${beads}
  <path d="M56 52 Q54 24 80 22 Q106 24 104 52 Q112 62 108 74 L100 62 Q90 26 60 62 L52 74 Q48 62 56 52Z" fill="#5a2c1e"/>
  <ellipse cx="80" cy="56" rx="21" ry="23" fill="url(#${skin})"/>
  <path d="M60 42 Q70 30 80 34 Q92 28 100 42 Q90 34 80 38 Q70 34 60 42Z" fill="#5a2c1e"/>
  ${eye(71)}${eye(89)}
  <ellipse cx="66" cy="64" rx="3" ry="1.6" fill="#f3a0b0" opacity=".7"/><ellipse cx="94" cy="64" rx="3" ry="1.6" fill="#f3a0b0" opacity=".7"/>
  <path d="M78 70 q2 1.6 4 0" stroke="#b0405a" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <circle cx="98" cy="28" r="4" fill="#ff5e8a"/><circle cx="104" cy="31" r="3" fill="#7ad0c8"/><circle cx="102" cy="25" r="2" fill="#fff"/>
  <g transform="translate(26 22)"><ellipse rx="6" ry="4.4" fill="#f2c21b"/><path d="M-2 -4 v8 M2 -4 v8" stroke="#111" stroke-width="1.6"/><ellipse cx="-1" cy="-5" rx="3.6" ry="2.4" fill="#e8f4ff" opacity=".85"/></g>
  <g transform="translate(134 78)"><path d="M0 -10 q4 -6 8 -2" stroke="#3a6a2a" fill="none" stroke-width="1.2"/><circle cx="-2" cy="0" r="4.4" fill="#c4122a"/><circle cx="7" cy="1" r="4.4" fill="#c4122a"/><circle cx="-3.5" cy="-1.5" r="1.2" fill="#fff" opacity=".8"/></g>`);
}

/* --- Superflat: dense field of smiling flowers (one unit flower per color offset, reused) --- */
function co_superflat() {
  const r = rng(44);
  const cols = ['#ff3b3b', '#ff9f1a', '#ffd400', '#3fbf4a', '#2f8ef0', '#9b4dd8', '#ff6fb5', '#fff'];
  const faces = ['#ffe94a', '#fff', '#ffb3d1', '#9fe0ff'];
  const ids = [];
  let defs = '';
  for (let k = 0; k < 8; k++) {
    const id = U('cofl'); ids.push(id);
    let p = '';
    for (let i = 0; i < 11; i++) {
      const t = i / 11 * Math.PI * 2;
      p += `<circle cx="${(Math.cos(t) * 7.8).toFixed(2)}" cy="${(Math.sin(t) * 7.8).toFixed(2)}" r="3.6" fill="${cols[(k + i) % 8]}"/>`;
    }
    p += `<circle r="5.6" fill="${faces[k % 4]}"/><g stroke="none" fill="#111"><ellipse cx="-2" cy="-1.4" rx=".6" ry="1"/><ellipse cx="2" cy="-1.4" rx=".6" ry="1"/></g><path d="M-3.2 .6 Q0 5.2 3.2 .6Z" fill="#e8243a"/>`;
    defs += `<g id="${id}">${p}</g>`;
  }
  const spots = [];
  for (let i = 0; i < 44; i++) spots.push([r() * 172 - 6, r() * 112 - 6, 7 + r() * 8]);
  spots.push([80, 50, 22]);
  spots.sort((a, b) => a[2] - b[2]);
  let f = '';
  for (const [x, y, sz] of spots) f += `<use href="#${pick(r, ids)}" transform="translate(${f1(x)} ${f1(y)}) scale(${(sz / 10).toFixed(2)})"/>`;
  return sv(`<defs>${defs}</defs>${bg('#fdfdfb')}<g stroke="#111" stroke-width=".5">${f}</g>`);
}

/* --- Afrofuturism: cosmic sky, chrome headdress, textile pattern --- */
function co_afrofuturism() {
  const r = rng(52);
  const sk = U('coaf'), ch = U('coch'), sun = U('cosu');
  let stars = '';
  for (let i = 0; i < 60; i++) stars += `<circle cx="${f1(r() * 160)}" cy="${f1(r() * 70)}" r="${f1(.3 + r() * .8)}" fill="#fff" opacity="${f1(.4 + r() * .6)}"/>`;
  let cloth = '';
  const cc = ['#f2b81b', '#1e8a4a', '#c8281e', '#111', '#f2b81b', '#2a4fb0'];
  for (let i = 0; i < 16; i++) {
    const x = 40 + i * 5;
    cloth += `<rect x="${x}" y="72" width="5" height="28" fill="${cc[i % cc.length]}"/>`;
    for (let j = 0; j < 4; j++) if ((i + j) % 2) cloth += `<rect x="${x}" y="${74 + j * 7}" width="5" height="3" fill="${cc[(i + 3) % cc.length]}"/>`;
  }
  const cid = U('cocl');
  return sv(`<defs>
  <radialGradient id="${sk}" cx=".7" cy=".3" r=".9"><stop offset="0" stop-color="#4b1f7a"/><stop offset=".6" stop-color="#1a0d3a"/><stop offset="1" stop-color="#05040e"/></radialGradient>
  <linearGradient id="${ch}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6c6f78"/><stop offset=".3" stop-color="#ffffff"/><stop offset=".55" stop-color="#9aa0ad"/><stop offset=".8" stop-color="#f1d58a"/><stop offset="1" stop-color="#5a4a2a"/></linearGradient>
  <radialGradient id="${sun}"><stop offset="0" stop-color="#ffd96a"/><stop offset=".7" stop-color="#f08a1a"/><stop offset="1" stop-color="#f08a1a" stop-opacity="0"/></radialGradient>
  <clipPath id="${cid}"><path d="M36 100 Q40 74 80 70 Q120 74 124 100Z"/></clipPath>
  </defs>${bg('#05040e')}<rect width="160" height="100" fill="url(#${sk})"/>${stars}
  <circle cx="80" cy="34" r="30" fill="url(#${sun})"/>
  <g transform="translate(134 22) rotate(-18)"><circle r="9" fill="#d8743a"/><ellipse rx="17" ry="3.4" fill="none" stroke="#f1d58a" stroke-width="1.4"/></g>
  <g clip-path="url(#${cid})"><rect x="0" y="60" width="160" height="40" fill="#111"/>${cloth}</g>
  <path d="M72 62 h16 l2 10 h-20z" fill="#5a3422"/>
  <ellipse cx="80" cy="50" rx="12" ry="15" fill="#6a3e28"/>
  <path d="M68 40 Q66 8 80 4 Q94 8 92 40 Q80 34 68 40Z" fill="url(#${ch})"/>
  <path d="M68.5 34 Q80 30 91.5 34 M69 26 Q80 22 91 26 M70 18 Q80 14 90 18" stroke="#e0b440" stroke-width="2.2" fill="none"/>
  <path d="M73 50 q3 1.5 6 0 M81 50 q3 1.5 6 0" stroke="#1a0d08" stroke-width="1" fill="none" stroke-linecap="round"/>
  <path d="M76 58 q4 2 8 0" stroke="#2a120a" stroke-width="1.2" fill="none"/>
  <path d="M64 70 Q80 80 96 70 L98 74 Q80 86 62 74Z" fill="url(#${ch})"/>
  <circle cx="68" cy="52" r="1.8" fill="#f1d58a"/><circle cx="92" cy="52" r="1.8" fill="#f1d58a"/>`);
}

/* --- Glitch: sunset scene with RGB split, slice offsets, pixel-sort streaks --- */
function co_glitch() {
  const r = rng(61);
  const sk = U('cogs'), scene = U('cosc');
  const body = `<rect width="160" height="100" fill="url(#${sk})"/><circle cx="80" cy="46" r="20" fill="#ffd34a"/><path d="M0 70 L30 50 L52 64 L80 44 L110 66 L132 52 L160 68 V100 H0Z" fill="#2a1450"/><path d="M0 84 L40 72 L90 86 L130 74 L160 82 V100 H0Z" fill="#120828"/>`;
  let slices = '';
  const ys = [[22, 6, 14], [40, 4, -18], [58, 5, 22], [76, 3, -10], [88, 6, 30]];
  for (const [y, h, dx] of ys) {
    const c = U('cogc');
    slices += `<clipPath id="${c}"><rect x="0" y="${y}" width="160" height="${h}"/></clipPath><g clip-path="url(#${c})"><use href="#${scene}" x="${dx}"/></g>`;
  }
  let sort = '';
  for (let x = 62; x < 100; x += 2) {
    const h = 10 + r() * 34;
    sort += `<rect x="${x}" y="46" width="2" height="${f1(h)}" fill="${pick(r, ['#ffd34a', '#ff8a3a', '#ff4f7a', '#f7b0d0'])}" opacity=".85"/>`;
  }
  let blocks = '';
  for (let i = 0; i < 10; i++) blocks += `<rect x="${f1(r() * 150)}" y="${f1(r() * 95)}" width="${f1(4 + r() * 14)}" height="${f1(2 + r() * 4)}" fill="${pick(r, ['#00ffd0', '#ff00a8', '#00a2ff', '#fff'])}" opacity=".8"/>`;
  let scan = '';
  for (let y = 0; y < 100; y += 2) scan += `<rect y="${y}" width="160" height=".6" fill="#000" opacity=".18"/>`;
  return sv(`<defs><linearGradient id="${sk}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a1f8a"/><stop offset=".6" stop-color="#e8487a"/><stop offset="1" stop-color="#ff9a4a"/></linearGradient>
  <g id="${scene}">${body}</g></defs>
  <use href="#${scene}"/>
  <circle cx="76" cy="46" r="20" fill="#ff0040" opacity=".55" style="mix-blend-mode:screen"/>
  <circle cx="85" cy="46" r="20" fill="#00e5ff" opacity=".5" style="mix-blend-mode:screen"/>
  ${sort}${slices}${blocks}${scan}`);
}

/* --- Generative: flow-field plotter lines --- */
function co_generative() {
  const r = rng(77);
  const ang = (x, y) => Math.sin(x * .03 + y * .02) * 2.2 + Math.cos(y * .06 - x * .015) * 1.2;
  let lines = '', reds = '';
  for (let i = 0; i < 150; i++) {
    let x = (i % 15) * 11.5 + r() * 8 - 4, y = Math.floor(i / 15) * 10.5 + r() * 8 - 2;
    let d = `M${f1(x)} ${f1(y)}l`;
    for (let s = 0; s < 14; s++) { const a = ang(x, y), dx = Math.cos(a) * 1.6, dy = Math.sin(a) * 1.6; x += dx; y += dy; d += `${f1(dx)} ${f1(dy)} `; }
    const red = i % 13 === 0;
    if (red) reds += `<path d="${d}"/>`; else lines += `<path d="${d}"/>`;
  }
  let sq = '';
  for (let k = 0; k < 5; k++) {
    const s = 6 + k * 3.2, j = () => (r() - .5) * 1.6;
    sq += `<polygon points="${pts([[136 - s + j(), 78 - s + j()], [136 + s + j(), 78 - s + j()], [136 + s + j(), 78 + s + j()], [136 - s + j(), 78 + s + j()]])}" fill="none" stroke="#1d2230" stroke-width=".55"/>`;
  }
  return sv(`${bg('#f4efe3')}<g fill="none" stroke-linecap="round"><g stroke="#1d2230" stroke-width=".45">${lines}</g><g stroke="#d9472b" stroke-width=".8">${reds}</g></g><rect x="112" y="54" width="48" height="46" fill="#f4efe3"/>${sq}`);
}

/* --- New Contemporary figurative: flat figure, tiny head, big limbs, plant --- */
function co_flatfigure() {
  return sv(`${bg('#ead9c0')}
  <rect x="0" y="74" width="160" height="26" fill="#d2b48f"/>
  <path d="M34 74 V36 a26 26 0 0 1 52 0 V74Z" fill="#cf7a52"/>
  <g transform="translate(128 74)">
    <path d="M-10 0 h20 l-3 -16 h-14z" fill="#e9e1d4"/>
    <path d="M0 -16 Q-22 -30 -24 -52 Q-8 -46 0 -16Z" fill="#3f6b4e"/>
    <path d="M0 -16 Q20 -26 26 -48 Q8 -44 0 -16Z" fill="#4f7d5c"/>
    <path d="M0 -16 Q-4 -40 4 -62 Q12 -40 0 -16Z" fill="#355c43"/>
    <path d="M-16 -38 l6 3 M-20 -46 l6 2 M18 -36 l-5 3 M20 -42 l-6 2" stroke="#ead9c0" stroke-width="1.4"/>
  </g>
  <rect x="44" y="60" width="54" height="16" rx="6" fill="#8fa38a"/>
  <path d="M54 62 Q50 40 62 34 Q72 32 76 44 L74 62Z" fill="#f2efe6"/>
  <circle cx="66" cy="27" r="4.2" fill="#9a5a3e"/><path d="M62 25 a4.4 4.4 0 0 1 8.4 0 Q66 22 62 25Z" fill="#2a1d18"/><circle cx="69" cy="22" r="2.2" fill="#2a1d18"/>
  <path d="M74 62 Q96 56 110 62 Q118 66 116 84 L106 86 Q104 72 96 70 Q84 72 74 72Z" fill="#c4874a"/>
  <path d="M60 64 Q78 64 92 70 Q102 76 100 90 L90 90 Q88 80 82 78 Q66 78 56 72Z" fill="#b97a42"/>
  <path d="M104 86 h14 q4 0 4 3 h-18z M88 90 h14 q4 0 4 3 h-18z" fill="#9a5a3e"/>
  <path d="M60 40 Q46 54 52 66 Q58 70 62 64 Q58 56 66 46Z" fill="#9a5a3e"/>
  <path d="M74 42 Q90 46 92 60 Q90 64 86 62 Q84 52 72 50Z" fill="#9a5a3e"/>
  <ellipse cx="88" cy="62" rx="5" ry="3.4" fill="#9a5a3e"/>
  ${grainOv(.18)}`);
}

/* --- Maximalism: clashing patterns everywhere --- */
function co_maximalism() {
  const r = rng(91);
  const mo = U('como');
  let wall = `<defs><g id="${mo}"><circle r="3.4" fill="#ff6f91"/><circle r="1.4" fill="#ffd23f"/>${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-5.4" rx="1.6" ry="2.6" fill="#ff9fb5" transform="rotate(${a})"/>`).join('')}<path d="M4 3 q5 1 6 5 q-5 0 -6 -5" fill="#3cb371"/></g></defs>`;
  for (let y = 4; y < 70; y += 12) for (let x = (y % 24 ? 0 : 8); x < 170; x += 16) wall += `<use href="#${mo}" x="${x}" y="${y}"/>`;
  let rug = '';
  for (let i = 0; i < 18; i++) rug += `<path d="M${-10 + i * 10} 100 L${i * 9.2 + 4} 80 h4.6 L${i * 10} 100Z" fill="${i % 3 === 0 ? '#ffd23f' : i % 3 === 1 ? '#1a2a6c' : '#fff'}"/>`;
  let leo = '';
  for (let i = 0; i < 46; i++) { const x = 102 + r() * 50, y = 50 + r() * 34; leo += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(.9 + r() * .5)}" ry="${f1(.7 + r() * .4)}" fill="#a8641e" stroke="#2a1608" stroke-width=".7" stroke-dasharray="2 .8" transform="rotate(${f1(r() * 180)} ${f1(x)} ${f1(y)})"/>`; }
  const lc = U('coleo');
  let mirror = '';
  for (let i = 0; i < 18; i++) { const t = i / 18 * Math.PI * 2; mirror += `<circle cx="${f1(52 + Math.cos(t) * 19)}" cy="${f1(32 + Math.sin(t) * 19)}" r="3.4" fill="#d4a62a" stroke="#8a6410" stroke-width=".5"/>`; }
  return sv(`<defs><clipPath id="${lc}"><path d="M100 86 V60 Q100 48 112 48 H142 Q154 48 154 60 V86Z"/></clipPath></defs>${bg('#0f4d3c')}${wall}
  ${mirror}<circle cx="52" cy="32" r="17" fill="#a8d8e8"/><path d="M40 26 q12 -10 22 4" stroke="#fff" stroke-width="1.6" fill="none" opacity=".7"/>
  <rect x="0" y="72" width="160" height="28" fill="#b5122e"/>
  <g>${rug}</g>
  <path d="M100 86 V60 Q100 48 112 48 H142 Q154 48 154 60 V86Z" fill="#e3a54a"/>
  <g clip-path="url(#${lc})">${leo}</g>
  <rect x="96" y="68" width="62" height="12" rx="5" fill="#7b2fd0"/>
  <rect x="102" y="86" width="3" height="8" fill="#d4a62a"/><rect x="149" y="86" width="3" height="8" fill="#d4a62a"/>
  <circle cx="112" cy="66" r="6" fill="#00b3a4"/><path d="M107 66 h10 M112 61 v10" stroke="#ffd23f" stroke-width="1.2"/>
  <circle cx="140" cy="66" r="6" fill="#ff6f91"/><circle cx="140" cy="66" r="2.4" fill="#1a2a6c"/>
  <g transform="translate(16 76)"><path d="M-7 0 h14 l-2 -12 h-10z" fill="#1a2a6c"/><path d="M-5 -12 l2 -4 l2 4 l2 -4 l2 4 l2 -4" stroke="#fff" fill="none" stroke-width=".8"/>
  <path d="M0 -12 Q-16 -24 -12 -42 Q-2 -30 0 -12Z M0 -12 Q14 -26 12 -44 Q2 -30 0 -12Z M0 -12 Q2 -34 -2 -52" fill="#2e8b3e" stroke="#2e8b3e" stroke-width="1.4"/></g>
  <g transform="translate(84 44)"><path d="M-7 0 h14 l-4 -10 h-6z" fill="#ffd23f"/><rect x="-1" y="0" width="2" height="26" fill="#d4a62a"/><path d="M-6 26 h12" stroke="#d4a62a" stroke-width="2"/><path d="M-7 0 l2 2 l2 -2 l2 2 l2 -2 l2 2 l2 -2" stroke="#ff6f91" fill="none" stroke-width="1"/></g>
  ${grainOv(.15)}`);
}

pool.groups.push({
  id: 'postwar', title: '1945 to 1980', slot: 'Movement',
  intro: 'The postwar decades split art into many camps at once: raw and untrained, huge and calm, crisp and flat, loud and melting, cool and photographic. Name the movement first in a prompt, then add its marks and color.',
  terms: [
    { id: 'artbrut', name: 'Art Brut / Outsider art', aka: 'outsider art, raw art, self-taught art',
      when: '1945 onward · France, then worldwide', y: 1945,
      desc: 'Art made by people outside the art world (self-taught makers, hospital patients, loners) that Jean Dubuffet called "raw art". It feels urgent and private, with crude figures and every inch of the surface filled.',
      spot: 'crude wobbly figures, staring mismatched eyes, thick black outlines, no perspective, obsessive pattern filling every gap, cheap materials like crayon, pen and found paper',
      ref: 'Jean Dubuffet (L\'Hourloupe series), Henry Darger (In the Realms of the Unreal), Adolf Wölfli, Martín Ramírez',
      prompt: 'Art Brut outsider art drawing, crude untrained figures with staring eyes, thick black outlines, obsessive repeated patterns filling every space, crayon and ink on brown paper, flat with no perspective',
      ex: co_artbrut() },
    { id: 'colorfield', name: 'Color field', aka: 'color field painting, soak-stain',
      when: '1950s–1960s · New York', y: 1950,
      desc: 'Paintings made of big, calm areas of color meant to swallow you when you stand close. Unlike the splashy side of Abstract Expressionism, there are almost no visible gestures, just soft glowing fields.',
      spot: 'huge canvas, two or three soft-edged rectangles floating on a colored ground, feathered blurry edges, thin stained paint, a single vertical stripe ("zip"), color soaked into raw canvas',
      ref: 'Mark Rothko (Seagram murals), Barnett Newman (Vir Heroicus Sublimis), Helen Frankenthaler (Mountains and Sea), Morris Louis',
      prompt: 'Color field painting, large soft-edged rectangles of glowing color stacked on a deep ground, feathered blurry edges, thin translucent stained paint, meditative, no brushwork, canvas texture',
      ex: co_colorfield() },
    { id: 'hardedge', name: 'Hard-edge painting', aka: 'hard-edge abstraction',
      when: '1958–1970s · California and New York', y: 1958,
      desc: 'Abstract painting made of flat shapes with perfectly crisp borders, as if cut from colored card. It feels clean, confident and sunny, the opposite of the dripping postwar style.',
      spot: 'razor-sharp edges, flat unmodulated color with no brushstrokes, a few big shapes (curves, wedges, panels), bold saturated pairs, shapes that touch exactly at their borders',
      ref: 'Ellsworth Kelly (Red Blue Green), Karl Benjamin, Frederick Hammersley, Lorser Feitelson',
      prompt: 'Hard-edge painting, flat saturated color shapes with razor-sharp borders, one bold curve against straight panels, no brushwork or texture, clean geometric abstraction, sunny California palette',
      ex: co_hardedge() },
    { id: 'psychedelic', name: 'Psychedelic poster', aka: 'San Francisco rock poster, 60s concert poster',
      when: '1966–1972 · San Francisco', y: 1966,
      desc: 'Concert posters for the Fillmore and Avalon ballrooms, designed to be decoded slowly, with lettering that melts and swells to fill a shape. Clashing complementary colors make the edges seem to vibrate.',
      spot: 'melting, bulging hand-drawn letters that fill the whole shape, nearly unreadable text, vibrating complementary pairs (red on green, orange on blue), wavy concentric bands, Art Nouveau curves turned up loud',
      ref: 'Wes Wilson (Fillmore posters), Victor Moscoso, Bonnie MacLean, Rick Griffin',
      prompt: 'Psychedelic 1960s concert poster, melting swollen hand-drawn lettering filling the shape, vibrating complementary colors red on green, wavy concentric bands, flat ink, Art Nouveau curves',
      ex: co_psychedelic() },
    { id: 'photorealism', name: 'Photorealism', aka: 'hyperrealism, superrealism',
      when: 'late 1960s–1980s · United States', y: 1968,
      desc: 'Paintings copied from photographs so precisely that they look like photos, often of ordinary things: diners, storefronts, cars, giant faces. The thrill is in the cool, impossible detail of reflections.',
      spot: 'mirror-sharp chrome and glass, reflections of buildings in shop windows, everyday urban subjects, even focus everywhere like a camera, no visible brushstrokes, crisp hard highlights',
      ref: 'Richard Estes (Telephone Booths), Chuck Close (giant portraits), Ralph Goings (diners), Audrey Flack',
      prompt: 'Photorealist painting, city storefront with plate-glass windows reflecting buildings, gleaming chrome car bumper, crisp highlights, everything in sharp focus, cool even daylight, no visible brushstrokes',
      ex: co_photorealism() },
    { id: 'neoexpr', name: 'Neo-expressionism', aka: 'Neue Wilde, new image painting',
      when: '1978–1990 · New York, Germany, Italy', y: 1978,
      desc: 'A loud return to painting by hand after years of cool, conceptual art: big canvases, rough figures and raw emotion. It feels like graffiti, a child\'s drawing and a history lesson colliding.',
      spot: 'scrawled black line drawing over raw color patches, masklike heads with gritted teeth, words written then crossed out, drips and scratches, crude anatomy, thick earthy paint and straw in German work',
      ref: 'Jean-Michel Basquiat, Anselm Kiefer (Margarethe), Georg Baselitz, Julian Schnabel',
      prompt: 'Neo-expressionist painting, raw scrawled black lines over rough patches of bright color, masklike head with gritted teeth, crossed-out words, drips and scratches, crude energetic figures, large canvas',
      ex: co_neoexpr() },
  ]
});

pool.groups.push({
  id: 'now', title: '1980 to today', slot: 'Movement',
  intro: 'Recent art pulls from the street, from comics and anime, from code and from social media. These labels are what galleries, magazines and image sites actually use, so they work well as prompt anchors.',
  terms: [
    { id: 'graffiti', name: 'Graffiti & street art', aka: 'writing, wildstyle, stencil art, muralism',
      when: '1970s onward · New York, then worldwide', y: 1972,
      desc: 'Art painted on walls and trains, from fast name tags to giant murals. Graffiti writers prize style in letters; street artists add stencils, paste-ups and murals that speak to passers-by.',
      spot: 'fat bubble letters with black outlines and white shine marks (throw-ups), interlocking arrowed wildstyle letters, fast scribbled tags, drips, fuzzy sprayed halos, crisp stencil silhouettes, brick or concrete wall',
      ref: 'Lee Quiñones and the New York subway writers, Banksy (stencils), Os Gêmeos (murals), Lady Pink',
      prompt: 'Graffiti street art on a brick wall, fat bubble-letter throw-up with black outline and white highlights, paint drips, fuzzy sprayed halo, crisp stencil figure, scribbled tags, bold saturated colors',
      ex: co_graffiti() },
    { id: 'lowbrow', name: 'Lowbrow / Pop surrealism', aka: 'pop surrealism, Juxtapoz style',
      when: '1990s onward · Los Angeles', y: 1994,
      desc: 'Gallery painting that grew out of hot-rod "kustom kulture", underground comics and tattoo flash, made with old-master polish. Expect sweet, eerie dreamlike scenes: cute on the surface, unsettling underneath.',
      spot: 'big-eyed porcelain-skinned figures, candy pastels, glossy smooth oil finish, ornate gilded frames, cute creatures and meat or bugs side by side, dreamy Victorian or carnival props, pinstripes and flames',
      ref: 'Mark Ryden, Robert Williams (founder of Juxtapoz magazine), Ed "Big Daddy" Roth (kustom kulture), Margaret Keane (big-eyed forerunner)',
      prompt: 'Pop surrealism lowbrow painting, porcelain-skinned girl with huge glossy eyes, candy pastel palette, smooth old-master oil finish, ornate gilded frame, cute yet eerie dreamlike details',
      ex: co_lowbrow() },
    { id: 'superflat', name: 'Superflat', aka: 'Superflat, Poku',
      when: '2000 onward · Japan', y: 2000,
      desc: 'Takashi Murakami\'s name for art that merges anime, manga, kawaii character design and old Japanese painting into one flat, glossy surface. It is cheerful and dense, with an edge of critique about consumer culture.',
      spot: 'perfectly flat color with no shading, crisp black outlines, smiling cartoon flowers, rainbow-bright palette, dense all-over repeat, anime eyes, gold or white grounds, slick commercial finish',
      ref: 'Takashi Murakami (smiling flowers), Yoshitomo Nara, Chiho Aoshima, Mr.',
      prompt: 'Superflat art, dense all-over pattern of smiling cartoon flowers with rainbow petals, perfectly flat color, crisp black outlines, no shading, anime kawaii style, glossy white ground',
      ex: co_superflat() },
    { id: 'afrofuturism', name: 'Afrofuturism', aka: 'Afrofuturist art',
      when: '1950s onward · African diaspora, US and Africa', y: 1955,
      desc: 'Art, music and fiction that imagine Black futures by mixing space-age technology with African history and myth. The look is cosmic and regal: stars, chrome and planets meeting textile patterns and adornment; prompts should borrow its palette and pattern language rather than copy specific sacred or ceremonial designs.',
      spot: 'deep cosmic purples and starfields, sun disks and ringed planets, chrome or gold headdresses and collars, bold African textile geometry (woven stripes, wax-print color), regal figures, collage of the organic and the mechanical',
      ref: 'Sun Ra (Space Is the Place), Wangechi Mutu (collages), Kerry James Marshall, Black Panther (2018) costume design by Ruth E. Carter',
      prompt: 'Afrofuturist art, regal figure with a gleaming chrome and gold headdress against a deep purple starfield, glowing sun disk, ringed planet, bold woven textile stripes, cosmic and majestic',
      ex: co_afrofuturism() },
    { id: 'glitch', name: 'Glitch art', aka: 'datamoshing, databending, pixel sorting',
      when: '2000s onward · internet', y: 2005,
      desc: 'Art made by breaking digital images on purpose: corrupting files, misreading video or sorting pixels so the image tears apart. It feels like a broken screen, beautiful and unstable.',
      spot: 'horizontal slices shifted sideways, red and cyan channel split ghosting, smeared vertical streaks of sorted pixels, blocky compression squares, scanlines, neon color errors',
      ref: 'Rosa Menkman (The Collapse of PAL), Kim Asendorf (pixel sorting), Takeshi Murata (Monster Movie), Nick Briz',
      prompt: 'Glitch art, digital image torn into horizontal slices shifted sideways, RGB channel split with red and cyan ghosting, pixel-sorted streaks, blocky compression artifacts, scanlines, neon error colors',
      ex: co_glitch() },
    { id: 'generative', name: 'Generative art', aka: 'algorithmic art, code art, plotter art',
      when: '1960s onward · Europe, then online', y: 1965,
      desc: 'Art made by writing rules or code that then draws the picture, often with randomness built in. The result looks precise but organic, like thousands of lines combed by an invisible wind.',
      spot: 'thousands of thin even lines following a hidden flow field, slight jitter on repeated squares, single pen weight like a pen plotter, off-white paper, one accent color, systematic grids that drift',
      ref: 'Vera Molnár ((Des)Ordres), Frieder Nake, Manfred Mohr, Tyler Hobbs (Fidenza)',
      prompt: 'Generative plotter art, thousands of thin black ink lines flowing along an invisible flow field, uniform pen weight, slight jitter, off-white paper, a few red accent lines, precise yet organic',
      ex: co_generative() },
    { id: 'flatfigure', name: 'New Contemporary figurative', aka: 'flat figurative painting, Instagram-era figuration',
      when: '2010s onward · galleries and Instagram', y: 2014,
      desc: 'A popular strand of recent painting with simplified, flat figures who have tiny heads and huge, heavy limbs, posed calmly in rooms with plants. It feels warm, quiet and graphic, like a mid-century illustration slowed down.',
      spot: 'tiny heads on oversized rounded limbs, flat matte color with little shading, soft earthy palette (terracotta, sage, cream), monstera and potted plants, arches and simple interiors, smooth curvy silhouettes',
      ref: '2010s gallery and Instagram painting, Alex Katz (flat figurative forerunner), Henri Matisse (late interiors)',
      prompt: 'Contemporary flat figurative painting, seated figure with a tiny head and oversized rounded limbs, flat matte color, terracotta arch, sage and cream palette, potted monstera, calm simple interior',
      ex: co_flatfigure() },
    { id: 'maximalism', name: 'Maximalism', aka: 'more is more, maximalist interior',
      when: '2010s onward · design and illustration', y: 2015,
      desc: 'The reaction to minimalism: more color, more pattern, more objects, all at once. It feels joyful and personal, as if someone collected everything they love into one room.',
      spot: 'clashing patterns side by side (florals, stripes, animal print), jewel-tone walls, gold ornament, plants everywhere, no empty space, layered rugs and objects, bold saturated color pairings',
      ref: 'Dorothy Draper (forerunner), Iris Apfel, Victorian parlors, Gucci under Alessandro Michele',
      prompt: 'Maximalist interior illustration, clashing patterns everywhere, floral wallpaper on emerald walls, leopard print armchair, striped rug, ornate gold mirror, lush plants, jewel tones, no empty space',
      ex: co_maximalism() },
  ]
});

/* ===== d_illustration.js ===== */
/* ---------- Illustration: printed matter, comics & genre ---------- */

// straight parallel hatching clipped to a clipPath id
function il_hatch(cid, cx, cy, ang, gap, col, sw, R = 100, op = 1) {
  let s = '';
  for (let d = -R; d <= R; d += gap) s += `<line x1="${f1(cx - R)}" y1="${f1(cy + d)}" x2="${f1(cx + R)}" y2="${f1(cy + d)}"/>`;
  return `<g clip-path="url(#${cid})"><g transform="rotate(${ang} ${cx} ${cy})" stroke="${col}" stroke-width="${sw}" opacity="${op}">${s}</g></g>`;
}
// recursive gnarled branch (quadratic segments that thin out)
function il_branch(r, x, y, a, len, w, d, out) {
  const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len;
  const bend = (r() - .5) * len * .7;
  const mx = (x + x2) / 2 + Math.cos(a + Math.PI / 2) * bend, my = (y + y2) / 2 + Math.sin(a + Math.PI / 2) * bend;
  out.push(`<path d="M${f1(x)} ${f1(y)}Q${f1(mx)} ${f1(my)} ${f1(x2)} ${f1(y2)}" stroke-width="${f1(Math.max(w, .3))}"/>`);
  if (d <= 0) return;
  const n = 2 + (r() < .35 ? 1 : 0);
  for (let i = 0; i < n; i++) il_branch(r, x2, y2, a + (r() - .5) * 1.5, len * (.6 + r() * .22), w * .6, d - 1, out);
}
// soft watercolor blob
const il_blob = (cx, cy, rx, ry, col, op, fid) => `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${col}" opacity="${op}" filter="url(#${fid})"/>`;
// a dot pattern (Ben-Day / screentone / polka). returns [defs, id]
function il_dots(step, rad, col, back) {
  const id = U('ildot');
  return [`<pattern id="${id}" width="${step}" height="${step}" patternUnits="userSpaceOnUse">${back ? `<rect width="${step}" height="${step}" fill="${back}"/>` : ''}<circle cx="${step / 4}" cy="${step / 4}" r="${rad}" fill="${col}"/><circle cx="${step * .75}" cy="${step * .75}" r="${rad}" fill="${col}"/></pattern>`, id];
}

/* ===== printed ===== */

function il_goldenage() {
  const r = rng(21), [wd, wf] = wob(1.4, .09, 4), bl = U('ilbl');
  const out = [];
  il_branch(r, 30, 24, -2.5, 16, 2.6, 4, out);
  il_branch(r, 60, 16, -.7, 15, 2.4, 4, out);
  il_branch(r, 49, 40, -.15, 17, 2.2, 4, out);
  il_branch(r, 38, 50, -2.9, 12, 1.8, 3, out);
  let bark = '';
  for (let i = 0; i < 14; i++) { const y = 30 + i * 4.6, x = 38 + Math.sin(i * 1.3) * 3; bark += `<path d="M${f1(x)} ${f1(y)}q${f1(2 + r() * 3)} ${f1(-2 - r() * 2)} ${f1(4 + r() * 3)} ${f1(-1)}"/>`; }
  let leaves = '';
  for (let i = 0; i < 26; i++) { const x = 60 + r() * 50, y = 5 + r() * 40; leaves += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="1.3" ry=".7" transform="rotate(${f1(r() * 180)} ${f1(x)} ${f1(y)})" fill="#8C8A52" opacity=".55"/>`; }
  return sv(`<defs>${wd}<filter id="${bl}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter></defs>
  ${bg('#E8DCC0')}
  ${il_blob(110, 20, 50, 18, '#B9B79A', .5, bl)}${il_blob(130, 60, 40, 22, '#C6A36E', .35, bl)}${il_blob(80, 96, 90, 12, '#8E9A6C', .55, bl)}${il_blob(40, 60, 30, 40, '#9C8C6A', .3, bl)}
  <g filter="url(#${wf})">
  <path d="M22 98C32 92 35 82 33 70C31 58 38 50 36 40C35 33 31 29 26 24L31 20C36 25 40 30 43 34C45 26 51 18 58 13L62 16C56 22 50 30 50 40C51 51 47 60 51 72C53 82 60 90 72 98Z" fill="#7A6447" opacity=".85"/>
  <path d="M22 98C32 92 35 82 33 70C31 58 38 50 36 40C35 33 31 29 26 24M31 20C36 25 40 30 43 34C45 26 51 18 58 13M62 16C56 22 50 30 50 40C51 51 47 60 51 72C53 82 60 90 72 98M22 98c-6 0-10 2-14 1M72 98c6-2 10-1 16 1M30 96c-2-4-6-6-10-6" fill="none" stroke="#2B2118" stroke-width=".9" stroke-linecap="round"/>
  <g fill="none" stroke="#2B2118" stroke-width=".45" stroke-linecap="round" opacity=".8">${bark}</g>
  <ellipse cx="40" cy="58" rx="1.2" ry="1.6" fill="#1E1710"/><ellipse cx="45.5" cy="58" rx="1.2" ry="1.6" fill="#1E1710"/><path d="M39 64q3.5 2.5 7 0" fill="none" stroke="#1E1710" stroke-width=".7"/>
  <g fill="none" stroke="#2B2118" stroke-linecap="round">${out.join('')}</g>
  ${leaves}
  <path d="M112 93l2-14q3-3 6 0l2 14z" fill="#8E3B2C" opacity=".85" stroke="#2B2118" stroke-width=".6"/>
  <circle cx="117" cy="76.5" r="2.6" fill="#E3C3A0" stroke="#2B2118" stroke-width=".5"/>
  <path d="M114.2 76c0-3.5 5.6-3.5 5.6 0l-.5 2" fill="#8E3B2C" stroke="#2B2118" stroke-width=".5"/>
  <path d="M95 92c-1-3 2-4 2-1M100 93c0-3 3-3 2 0" fill="none" stroke="#5A4A32" stroke-width=".6"/>
  <ellipse cx="88" cy="94" rx="3" ry="1.6" fill="#B85C3C" opacity=".8"/><rect x="87.5" y="94" width="1" height="3" fill="#E8DCC0"/>
  </g>${grainOv(.4)}`);
}

function il_picturebook() {
  const [wd, wf] = wob(1, .1, 8), bl = U('ilbl');
  const ink = '#4B3A2C';
  let grass = '';
  for (let i = 0; i < 9; i++) { const x = 52 + i * 6; grass += `<path d="M${x} 88q1-4 3-6M${x + 2} 88q0-3 -1-5"/>`; }
  return sv(`<defs>${wd}<filter id="${bl}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2"/></filter></defs>
  ${bg('#FBF7EE')}
  ${il_blob(80, 88, 34, 4, '#B9C99A', .7, bl)}
  <g filter="url(#${wf})" stroke="${ink}" stroke-width=".6" stroke-linejoin="round" stroke-linecap="round">
  <ellipse cx="74" cy="25" rx="3.2" ry="11" transform="rotate(-14 74 25)" fill="#C9AB88"/><ellipse cx="74" cy="25" rx="1.4" ry="8" transform="rotate(-14 74 25)" fill="#E9C3B5" stroke="none"/>
  <ellipse cx="84" cy="24" rx="3.2" ry="11" transform="rotate(10 84 24)" fill="#C9AB88"/>
  <path d="M68 86C62 74 64 58 72 52C82 47 92 56 92 68C92 78 89 85 84 86Z" fill="#7F9CBB"/>
  <path d="M74 52l4 9 4-9" fill="#F4EFE2"/>
  <circle cx="64.5" cy="72" r="3.5" fill="#FFFFFF"/>
  <ellipse cx="80" cy="42" rx="9.5" ry="8" fill="#C9AB88"/><path d="M87 44q3 1 2.5 3" fill="none"/>
  <circle cx="84.5" cy="40" r="1" fill="${ink}" stroke="none"/><ellipse cx="89" cy="43" rx="1" ry=".7" fill="#D88C8C"/>
  <path d="M86 56C92 58 96 60 99 61" fill="none" stroke-width="3.2" stroke="${ink}"/><path d="M86 56C92 58 96 60 99 61" fill="none" stroke-width="2.2" stroke="#7F9CBB"/>
  <circle cx="100" cy="61.5" r="2" fill="#C9AB88"/>
  <path d="M101 59l12 4-11 1z" fill="#E08A3C"/><path d="M101 59l-3-4M101 60l-4-1" stroke="#6E9A4A" stroke-width="1"/>
  <ellipse cx="72" cy="87" rx="5" ry="2.2" fill="#C9AB88"/><ellipse cx="85" cy="87" rx="5" ry="2.2" fill="#C9AB88"/>
  <circle cx="80" cy="64" r=".9" fill="#E6C25A"/><circle cx="81" cy="71" r=".9" fill="#E6C25A"/>
  <g fill="none" stroke="#7E9A5C" stroke-width=".5">${grass}</g>
  <path d="M30 88v-10" fill="none" stroke="#7E9A5C"/><circle cx="30" cy="76" r="2" fill="#E9B3B9"/><circle cx="30" cy="76" r=".7" fill="#E6C25A" stroke="none"/>
  <path d="M126 30q3-4 4 0q1-4 4 0" fill="none" stroke-width=".5"/>
  </g>`);
}

function il_botanical() {
  const r = rng(5), [wd, wf] = wob(.6, .12, 2), g = U('ilgr');
  const leaf = (x, y, a, s) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})"><path d="M0 0C6-5 16-5 24 0C16 5 6 5 0 0Z" fill="#6E8B52"/><path d="M0 0H22M6 0l3-3M11 0l3-3M16 0l3-2.5M6 0l3 3M11 0l3 3M16 0l3 2.5" fill="none" stroke="#3E5530" stroke-width=".35"/></g>`;
  let petals = '';
  for (let i = 0; i < 6; i++) petals += `<g transform="rotate(${i * 60 + 10} 62 26)"><path d="M62 26C58 18 59 10 62 7C65 10 66 18 62 26Z" fill="url(#${g})" stroke="#7A2A3A" stroke-width=".35"/><path d="M62 24V10" stroke="#8E3446" stroke-width=".25"/></g>`;
  let roots = '';
  for (let i = 0; i < 9; i++) roots += `<path d="M${f1(58 + i)} 92q${f1((r() - .5) * 8)} 3 ${f1((r() - .5) * 10)} 6"/>`;
  let seeds = '';
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; seeds += `<ellipse cx="${f1(125 + Math.cos(a) * 6)}" cy="${f1(28 + Math.sin(a) * 6)}" rx="1.4" ry="2.2" transform="rotate(${f1(a * 57.3 + 90)} ${f1(125 + Math.cos(a) * 6)} ${f1(28 + Math.sin(a) * 6)})" fill="#9A7A3E"/>`; }
  const cap = (x, y, w) => `<path d="M${x} ${y}h${w}M${x + 2} ${y + 2.4}h${w - 4}" stroke="#7D705C" stroke-width=".35"/>`;
  return sv(`<defs>${wd}<linearGradient id="${g}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#E9A6B0"/><stop offset="1" stop-color="#B8384F"/></linearGradient></defs>
  ${bg('#F4EEDF')}<rect x="4" y="4" width="152" height="92" fill="none" stroke="#9C8E72" stroke-width=".4"/>
  <g filter="url(#${wf})">
  <path d="M62 90C60 70 64 50 62 28" fill="none" stroke="#557040" stroke-width="1"/>
  ${leaf(62, 72, -150, 1)}${leaf(62, 60, -30, .9)}${leaf(62, 48, -155, .75)}
  ${petals}<circle cx="62" cy="26" r="2" fill="#E2B54A"/>
  <path d="M62 26l-3-6M62 26l3-6M62 26l0-7" stroke="#6A4A2A" stroke-width=".3"/>
  <path d="M56 90C56 84 68 84 68 90C68 94 56 94 56 90Z" fill="#E4D2A8" stroke="#8C7550" stroke-width=".4"/>
  <g fill="none" stroke="#8C7550" stroke-width=".3">${roots}</g>
  <circle cx="125" cy="28" r="10" fill="#EEDDB3" stroke="#7A6A48" stroke-width=".4"/>${seeds}<circle cx="125" cy="28" r="1.5" fill="#B49A5A"/>
  <path d="M117 66C112 56 115 48 120 45C125 48 128 56 123 66Z" fill="url(#${g})" stroke="#7A2A3A" stroke-width=".35"/><path d="M120 64V49" stroke="#8E3446" stroke-width=".25"/>
  <g transform="translate(140 66) rotate(-90)"><path d="M0 0v-1" /></g>
  ${cap(117, 42, 16)}${cap(112, 72, 16)}${cap(46, 98 - 6, 32)}
  <path d="M100 30h12M100 30l-32-3" stroke="#9C8E72" stroke-width=".25" fill="none" stroke-dasharray="1 1"/>
  </g>${grainOv(.25)}`);
}

function il_fashion() {
  const [wd, wf] = wob(1.2, .07, 6), bl = U('ilbl');
  return sv(`<defs>${wd}<filter id="${bl}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4"/></filter></defs>
  ${bg('#F4EFE7')}
  ${il_blob(68, 52, 26, 40, '#E4B9B4', .7, bl)}${il_blob(104, 70, 18, 24, '#CFC8C0', .7, bl)}
  <g filter="url(#${wf})">
  <path d="M76 26C72 36 77 44 79 52C74 64 62 80 50 96C62 92 76 95 88 94C96 94 104 96 112 92C102 80 94 64 90 52C93 42 93 33 88 26C84 29 80 29 76 26Z" fill="#141414"/>
  <path d="M84 56C80 68 76 82 72 94" fill="none" stroke="#F4EFE7" stroke-width="1.1" stroke-linecap="round" opacity=".9"/>
  <path d="M88 27C93 30 96 38 97 46C97.5 52 96 58 94 60" fill="none" stroke="#141414" stroke-width=".5"/>
  <path d="M88 27C94 30 95 38 96 45" fill="none" stroke="#C8222B" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M76 27C72 31 70 40 72 48" fill="none" stroke="#141414" stroke-width=".5"/>
  <path d="M80.5 18.5v7M84.5 18.5v7" stroke="#141414" stroke-width=".35"/>
  <ellipse cx="82.5" cy="15" rx="3.3" ry="4.2" fill="#F6E2D3" stroke="#141414" stroke-width=".35"/>
  <path d="M78.8 15C78 9 85 7 87 11C88 9 92 9 93 12C90 11 87 12 86 13C84 11 81 12 78.8 15Z" fill="#141414"/>
  <path d="M74 10C80 4 92 4 98 9C92 8 82 8 74 10Z" fill="#C8222B"/>
  <ellipse cx="83.5" cy="17.4" rx=".9" ry=".4" fill="#C8222B"/>
  <path d="M84.2 14.4h1.2" stroke="#141414" stroke-width=".35"/>
  <path d="M40 96C70 94 110 95 130 96" fill="none" stroke="#141414" stroke-width=".4" opacity=".6"/>
  </g>${grainOv(.25)}`);
}

function il_propaganda() {
  let rays = '';
  for (let i = 0; i < 16; i++) {
    const a1 = i / 16 * Math.PI * 2, a2 = a1 + Math.PI / 16;
    rays += `<path d="M74 34L${f1(74 + Math.cos(a1) * 200)} ${f1(34 + Math.sin(a1) * 200)}L${f1(74 + Math.cos(a2) * 200)} ${f1(34 + Math.sin(a2) * 200)}Z"/>`;
  }
  const [wd, wf] = wob(.8, .05, 9);
  const ol = 'stroke="#18181A" stroke-width="1.1" stroke-linejoin="round"';
  return sv(`<defs>${wd}</defs>
  ${bg('#EDE0C2')}<g fill="#E2C996">${rays}</g>
  <g filter="url(#${wf})">
  <path d="M46 6L50 6L54 84L50 84Z" fill="#6A4A2E" ${ol}/>
  <path d="M48 7C38 4 28 12 16 8C18 16 14 24 18 30C30 32 38 24 50 28Z" fill="#B8322A" ${ol}/>
  <path d="M60 44L88 44L84 84L62 84Z" fill="#2B3A5C" ${ol}/>
  <path d="M74 44L84 44L82 84L72 84Z" fill="#1E2A44"/>
  <path d="M84 44L124 18L128 24L88 54Z" fill="#2B3A5C" ${ol}/>
  <path d="M124 17C128 14 132 15 136 13L137 16C134 17 132 18 131 19C133 21 132 24 129 25C127 24 125 22 124 17Z" fill="#E2A77B" ${ol}/>
  <path d="M62 46C56 50 52 56 51 62" fill="none" stroke="#2B3A5C" stroke-width="7" stroke-linecap="round"/>
  <circle cx="51" cy="62" r="3.4" fill="#E2A77B" ${ol}/>
  <path d="M68 40L80 40L79 46L69 46Z" fill="#D9B48F"/>
  <ellipse cx="74" cy="32" rx="7.5" ry="8.8" fill="#E2A77B" ${ol}/>
  <path d="M74 24C79 25 82 30 81 36C80 40 77 41 74 41Z" fill="#C4825A"/>
  <path d="M65 28C66 20 82 19 84 27L88 29L64 30Z" fill="#3E4A2E" ${ol}/>
  <path d="M70 33h3M77 32h3" stroke="#18181A" stroke-width="1"/>
  <path d="M71 37.5h5" stroke="#18181A" stroke-width=".8"/>
  </g>
  <rect y="82" width="160" height="18" fill="#B8322A"/><rect y="82" width="160" height="1.4" fill="#18181A"/>
  <g fill="#EDE0C2"><rect x="16" y="86" width="22" height="9"/><rect x="42" y="86" width="34" height="9"/><rect x="80" y="86" width="16" height="9"/><rect x="100" y="86" width="44" height="9"/></g>
  ${grainOv(.35)}`);
}

function il_pulp() {
  const sky = U('ilgr'), pl = U('ilgr'), rk = U('ilgr'), bl = U('ilbl');
  let sucks = '';
  [[139, 90], [134, 82], [129.5, 74], [126.5, 66], [125, 58], [124.5, 51]].forEach((q, i) => sucks += `<circle cx="${q[0]}" cy="${q[1]}" r="${f1(1.5 - i * .12)}" fill="#C9F08A" stroke="#163A12" stroke-width=".3"/>`);
  let stars = '', r = rng(4);
  for (let i = 0; i < 30; i++) stars += `<circle cx="${f1(r() * 160)}" cy="${f1(r() * 45)}" r="${f1(.2 + r() * .5)}" fill="#FFF3C4" opacity="${f1(.4 + r() * .6)}"/>`;
  return sv(`<defs><linearGradient id="${sky}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E0B3E"/><stop offset=".55" stop-color="#8A1F6A"/><stop offset="1" stop-color="#F7782A"/></linearGradient>
  <radialGradient id="${pl}" cx=".35" cy=".35" r=".7"><stop offset="0" stop-color="#9BF0C8"/><stop offset=".6" stop-color="#2E9E8A"/><stop offset="1" stop-color="#11384A"/></radialGradient>
  <linearGradient id="${rk}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F4F1EA"/><stop offset=".45" stop-color="#C9CDD6"/><stop offset="1" stop-color="#5D6478"/></linearGradient>
  <filter id="${bl}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.6"/></filter></defs>
  <rect width="160" height="100" fill="url(#${sky})"/>${stars}
  <circle cx="34" cy="28" r="17" fill="url(#${pl})"/>
  <ellipse cx="34" cy="28" rx="30" ry="6" transform="rotate(-18 34 28)" fill="none" stroke="#F7D35A" stroke-width="2.4" opacity=".9"/>
  <path d="M5.5 37.3A30 6 -18 0 1 18.3 13" fill="none" stroke="url(#${pl})" stroke-width="0"/>
  <g transform="translate(116 36) rotate(38)">
   <path d="M-4 15L0 34L4 15Z" fill="#FFD23A" filter="url(#${bl})"/><path d="M-2.5 15L0 26L2.5 15Z" fill="#FFF6C8"/>
   <path d="M0-26C7-16 8 4 6 15L-6 15C-8 4-7-16 0-26Z" fill="url(#${rk})" stroke="#2A1530" stroke-width=".6"/>
   <path d="M0-26C3-22 4.5-19 5-16L-5-16C-4.5-19-3-22 0-26Z" fill="#D8262B"/>
   <path d="M-6 6L-13 18L-6 15Z M6 6L13 18L6 15Z" fill="#D8262B" stroke="#2A1530" stroke-width=".6"/>
   <circle cx="0" cy="-5" r="2.6" fill="#7FD6FF" stroke="#2A1530" stroke-width=".8"/>
  </g>
  <path d="M0 100L0 70C10 66 20 72 30 68C40 66 46 70 52 76L58 100Z" fill="#2A1020"/>
  <path d="M30 68L58 100" stroke="#5A2A2A" stroke-width=".6"/>
  <path d="M40 60L121 56" stroke="#FFF27A" stroke-width="1.6" filter="url(#${bl})"/><path d="M40 60L121 56" stroke="#FFFFFF" stroke-width=".5"/>
  ${fig(36, 69, 13, '#E8302A')}<circle cx="36" cy="57.8" r="2.6" fill="none" stroke="#BFEFFF" stroke-width=".7"/><path d="M37 62L41 60" stroke="#C9CDD6" stroke-width="1.3"/>
  <path d="M150 100C150 80 132 74 128 60C126 52 132 46 128 44C122 44 120 52 122 60C126 76 138 82 136 100Z" fill="#3BAA3E" stroke="#163A12" stroke-width=".7"/>
  <path d="M120 100C118 90 104 86 100 76C98 70 92 72 92 76C94 82 104 88 108 100Z" fill="#2F9234" stroke="#163A12" stroke-width=".7"/>
  ${sucks}
  <path d="M66 90L118 98" stroke="#FFEA7A" stroke-width=".8" opacity=".0"/>
  <rect width="160" height="100" fill="#FFB36A" opacity=".06"/>${grainOv(.3)}`);
}

function il_pinup() {
  const [dd, did] = il_dots(10, 2, '#FBF1E4', '#D8352F');
  const sk = U('ilgr'), hr = U('ilgr');
  return sv(`<defs>${dd}<radialGradient id="${sk}" cx=".42" cy=".38" r=".7"><stop offset="0" stop-color="#FCE1CB"/><stop offset=".7" stop-color="#F1B693"/><stop offset="1" stop-color="#DE9472"/></radialGradient>
  <linearGradient id="${hr}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C2582A"/><stop offset="1" stop-color="#6E2A12"/></linearGradient></defs>
  <rect width="160" height="100" fill="url(#${did})"/>
  <path d="M60 32C56 46 58 60 66 66L94 66C102 60 104 46 100 32Z" fill="url(#${hr})"/>
  <ellipse cx="62" cy="58" rx="6" ry="9" fill="url(#${hr})"/><ellipse cx="98" cy="58" rx="6" ry="9" fill="url(#${hr})"/>
  <path d="M75 54L85 54L86 68L74 68Z" fill="#E9A27F"/>
  <path d="M44 100C46 78 60 68 80 68C100 68 114 78 116 100Z" fill="#F7F4EE"/>
  <path d="M60 71L80 88L100 71L106 78L80 99L54 78Z" fill="#1F3466"/>
  <path d="M58 75L80 93L102 75" fill="none" stroke="#F7F4EE" stroke-width=".9"/>
  <path d="M80 88L70 96L72 86Z M80 88L90 96L88 86Z" fill="#D8352F"/><circle cx="80" cy="88" r="2.4" fill="#B82620"/>
  <ellipse cx="80" cy="42" rx="12.5" ry="14.5" fill="url(#${sk})"/>
  <circle cx="69" cy="25" r="7.5" fill="url(#${hr})"/><circle cx="91" cy="24.5" r="7.5" fill="url(#${hr})"/>
  <path d="M65 22q4-4 8 0M87 21q4-4 8 0" fill="none" stroke="#F2A26A" stroke-width="1.2" stroke-linecap="round" opacity=".8"/>
  <path d="M76 27C79 25 82 25 84 27C82 30 78 30 76 27Z" fill="url(#${hr})"/>
  <path d="M70 36q4-2.5 7 0" fill="none" stroke="#5A2412" stroke-width=".8"/><path d="M83 35.5q4-2.5 7 .5" fill="none" stroke="#5A2412" stroke-width=".8"/>
  <path d="M70.5 41q3.5-3.2 7 0q-3.5 2.4-7 0Z" fill="#FFFFFF"/><circle cx="74" cy="40.8" r="1.6" fill="#3E7DB8"/><circle cx="74" cy="40.8" r=".7" fill="#111"/><circle cx="74.6" cy="40.2" r=".4" fill="#FFF"/>
  <path d="M70 41q3.8-3.8 8 0M70 40l-1.2-1.2M71.5 38.8l-.6-1.5M73.5 38.2l-.2-1.6" fill="none" stroke="#1A0E0A" stroke-width=".7" stroke-linecap="round"/>
  <path d="M82.5 41q3.5 2.6 7.5-.4M89.5 40.8l1.4-.8M88 41.8l.8 1.2" fill="none" stroke="#1A0E0A" stroke-width=".8" stroke-linecap="round"/>
  <path d="M79.5 41.5q-1 4 .4 5.2q1 .4 1.8-.2" fill="none" stroke="#C97B5A" stroke-width=".6"/>
  <ellipse cx="72" cy="47" rx="3" ry="1.8" fill="#EE7F78" opacity=".45"/><ellipse cx="88" cy="47" rx="3" ry="1.8" fill="#EE7F78" opacity=".45"/>
  <path d="M74.5 50.5C77 49 79 49.5 80 50.2C81 49.5 83 49 85.5 50.5C83.5 54.5 76.5 54.5 74.5 50.5Z" fill="#D21F2A"/>
  <path d="M75.2 50.8C78 52.2 82 52.2 84.8 50.8" fill="none" stroke="#7A0E14" stroke-width=".4"/>
  <ellipse cx="78" cy="52.6" rx="1.2" ry=".4" fill="#FFB8B8" opacity=".9"/>
  <circle cx="86.5" cy="49" r=".45" fill="#3A1A10"/>
  <path d="M95 34l1 2.2 2.2 1-2.2 1-1 2.2-1-2.2-2.2-1 2.2-1z" fill="#FFF6D8"/>`);
}

function il_midcentury() {
  const r = rng(13), [wd, wf] = wob(.7, .2, 3);
  let tex = '';
  for (let i = 0; i < 160; i++) tex += `<rect x="${f1(r() * 160)}" y="${f1(r() * 100)}" width="${f1(.5 + r() * 2.5)}" height=".5" fill="#6B5A3A" opacity="${f1(.06 + r() * .1)}"/>`;
  let dry = '';
  for (let i = 0; i < 40; i++) dry += `<rect x="${f1(22 + r() * 34)}" y="${f1(40 + r() * 34)}" width="${f1(2 + r() * 6)}" height=".45" fill="#F2E7CF" opacity=".55"/>`;
  const tri = (x, y, h, c) => `<path d="M${x} ${y - h}L${x + h * .32} ${y}L${x - h * .32} ${y}Z" fill="${c}"/>`;
  return sv(`<defs>${wd}</defs>
  ${bg('#EFE5CC')}
  <circle cx="122" cy="22" r="13" fill="#E3A93A"/>
  <path d="M30 22c0-4 6-5 8-2c2-4 9-3 9 1c3 0 4 4 0 4H32c-3 0-4-2-2-3Z" fill="#FBF6EA"/><path d="M32 20c0-4 6-5 8-2c2-4 9-3 9 1c3 0 4 4 0 4H34c-3 0-4-2-2-3Z" fill="none" stroke="#232220" stroke-width=".5"/>
  <path d="M66 14l3 2 3-2M76 20l2.4 1.6 2.4-1.6" fill="none" stroke="#232220" stroke-width=".7" stroke-linecap="round"/>
  <path d="M0 80H160V100H0Z" fill="#C5B48C"/>
  <path d="M20 76L22 44L40 34L58 42L56 76Z" fill="#D9573B"/>${dry}
  <rect x="30" y="56" width="10" height="20" fill="#232220"/>
  <rect x="44" y="50" width="7" height="7" fill="#EFE5CC"/>
  ${tri(80, 80, 38, '#2F7F7A')}${tri(94, 80, 26, '#1F5E5A')}${tri(108, 80, 44, '#2F7F7A')}
  <g filter="url(#${wf})" fill="none" stroke="#232220" stroke-width=".7" stroke-linecap="round">
   <path d="M18 78L21 46L39 36L59 44L57 78M17 48L40 34L61 44"/>
   <path d="M82 80V48M78 54l4 4 4-4M77 62l5 5 5-5M76 70l6 6 6-6"/>
   <path d="M110 80V40M105 48l5 5 5-5M104 58l6 6 6-6M103 68l7 7 7-7"/>
   <path d="M124 21l14 0M124 23l12 3M123 25l9 7M125 19l12-5" opacity=".6"/>
   <path d="M120 22a4 4 0 1 0 8 0" />
  </g>
  <g transform="translate(132 80)">
   <path d="M-6 0C-8-6-6-14 0-16C6-16 8-10 8-4L10 0Z" fill="#232220"/>
   <path d="M2-16L4-24L7-17Z M-2-16L-2-24L2-17Z" fill="#232220"/>
   <path d="M-6 0C-14 0-16-8-12-12" fill="none" stroke="#232220" stroke-width="1.6" stroke-linecap="round"/>
   <circle cx="1" cy="-19" r="1.3" fill="#E3A93A"/><circle cx="5" cy="-19" r="1.3" fill="#E3A93A"/>
  </g>
  <path d="M0 80H160" stroke="#232220" stroke-width=".6"/>
  ${tex}`);
}

function il_conceptual() {
  let rungs = '';
  for (let i = 0; i < 9; i++) rungs += `<path d="M${f1(97.6 - i * 2.2)} ${f1(90 - i * 8.6)}h${f1(10)}"/>`;
  return sv(`${bg('#F1EBDF')}
  <path d="M38 100C36 88 30 82 30 70C26 66 22 62 24 58C26 56 26 54 25 52C22 50 22 46 26 42C24 30 30 16 46 12L56 11C76 10 92 20 94 40C96 56 86 66 82 76C80 84 82 92 84 100Z" fill="#23304A"/>
  <rect x="20" y="0" width="80" height="18" fill="#F1EBDF"/>
  <ellipse cx="62" cy="18" rx="15" ry="3.2" fill="#0B1120"/>
  <g transform="rotate(-32 47 18)"><path d="M47 18C50 10 74 10 77 18Z" fill="#23304A"/><path d="M47 18H77" stroke="#3E5276" stroke-width="1"/></g>
  <g stroke="#D8432F" stroke-width="1.5" stroke-linecap="round" fill="none"><path d="M96 98L76 16M106 98L86 16"/>${rungs}</g>
  <g transform="translate(83 21)"><circle cx="0" cy="-8" r="2.2" fill="#23304A"/><path d="M-2-5.5L2-5.5L2.5 2L-2.5 2Z" fill="#23304A"/><path d="M-2.5 2l-1 5M2.5 2l3 3M-2-4l-5-3" stroke="#23304A" stroke-width="1.3" stroke-linecap="round"/>
  <circle cx="-9" cy="-9" r="3" fill="#F2C94C"/><rect x="-8.6" y="-6.6" width="2.4" height="2" fill="#8C8C8C"/></g>
  <path d="M88 99H140" stroke="#23304A" stroke-width=".6"/>`);
}

/* ===== comics ===== */

function il_rubberhose() {
  const r = rng(2);
  const glove = (x, y, a) => `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M-3 3C-6 0-5-6 0-6C4-7 7-4 6 0C6 3 3 5 0 5Z" fill="#FFF" stroke="#111" stroke-width=".8"/><path d="M-1-3v3M2-3v3" stroke="#111" stroke-width=".5"/><rect x="-3.5" y="4" width="7" height="3" rx="1.2" fill="#FFF" stroke="#111" stroke-width=".8"/></g>`;
  const note = (x, y) => `<g fill="#2A2420"><ellipse cx="${x}" cy="${y}" rx="2" ry="1.4" transform="rotate(-20 ${x} ${y})"/><path d="M${x + 1.7} ${y}V${y - 8}q3 1 4 4" fill="none" stroke="#2A2420" stroke-width=".7"/></g>`;
  let rays = '';
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; rays += `<path d="M${f1(130 + Math.cos(a) * 13)} ${f1(22 + Math.sin(a) * 13)}L${f1(130 + Math.cos(a + .12) * 19)} ${f1(22 + Math.sin(a + .12) * 19)}"/>`; }
  return sv(`${bg('#E9DDC3')}
  <path d="M0 84H160" stroke="#2A2420" stroke-width=".8"/>
  <g stroke="#2A2420" stroke-width="1.4" stroke-linecap="round">${rays}</g>
  <circle cx="130" cy="22" r="11" fill="#F7EEDC" stroke="#2A2420" stroke-width="1"/>
  <circle cx="126.5" cy="20" r="1.2" fill="#2A2420"/><circle cx="133.5" cy="20" r="1.2" fill="#2A2420"/><path d="M125 25q5 5 10 0" fill="none" stroke="#2A2420" stroke-width="1"/>
  ${note(22, 36)}${note(36, 22)}
  <ellipse cx="74" cy="86" rx="22" ry="2.6" fill="#2A2420" opacity=".25"/>
  <g stroke="#111" fill="none" stroke-width="3.4" stroke-linecap="round">
   <path d="M70 64C66 72 58 74 56 82"/><path d="M80 64C86 70 92 70 94 78"/>
   <path d="M66 50C58 48 52 40 52 32"/><path d="M84 48C92 50 98 56 104 54"/>
  </g>
  <path d="M62 64C60 66 60 70 64 70L86 70C90 70 90 66 88 64C86 60 64 60 62 64Z" fill="#111"/>
  <path d="M63 64C62 67 64 69 66 69L84 69C87 69 88 67 87 64Z" fill="#F7EEDC" opacity="0"/>
  <path d="M84 62C94 60 96 52 92 50" fill="none" stroke="#111" stroke-width="1.2"/>
  <ellipse cx="75" cy="56" rx="11" ry="12" fill="#111"/>
  <ellipse cx="72" cy="57" rx="3" ry="4" fill="#3A3A3A" opacity=".6"/>
  <ellipse cx="52" cy="84" rx="7" ry="3.4" fill="#111"/><ellipse cx="98" cy="80" rx="7" ry="3.4" transform="rotate(-10 98 80)" fill="#111"/>
  <ellipse cx="50" cy="83" rx="2" ry=".8" fill="#FFF" opacity=".7"/><ellipse cx="96" cy="79" rx="2" ry=".8" fill="#FFF" opacity=".7"/>
  ${glove(52, 29, -10)}${glove(106, 54, 70)}
  <path d="M65 22L67 12L72 19Z M85 19L90 11L91 21Z" fill="#111"/>
  <circle cx="78" cy="30" r="12" fill="#111"/>
  <path d="M68 34C68 26 74 24 78 27C82 24 88 26 88 34C88 42 82 44 78 44C74 44 68 42 68 34Z" fill="#F2E3C6"/>
  <ellipse cx="74.5" cy="28" rx="3" ry="5" fill="#FFF" stroke="#111" stroke-width=".6"/><ellipse cx="81.5" cy="28" rx="3" ry="5" fill="#FFF" stroke="#111" stroke-width=".6"/>
  <path d="M75 30.5a2 2.6 0 1 1 1.4-2.8L75 28.6Z" fill="#111"/><path d="M82 30.5a2 2.6 0 1 1 1.4-2.8L82 28.6Z" fill="#111"/>
  <ellipse cx="78" cy="34.5" rx="2.2" ry="1.5" fill="#111"/>
  <path d="M70 37C74 44 82 44 86 37C82 39 74 39 70 37Z" fill="#111"/><path d="M75 40.6q3 2 6 0q-3 1.4-6 0Z" fill="#C24A4A"/>
  <g stroke="#2A2420" stroke-width=".7" stroke-linecap="round"><path d="M44 30l-4-2M45 25l-4-4M108 50l4-2M108 58l4 1"/></g>
  ${vig(.6)}${grainOv(.55)}`);
}

function il_upa() {
  const ln = 'fill="none" stroke="#1C1C1C" stroke-width=".7" stroke-linecap="round" stroke-linejoin="round"';
  return sv(`${bg('#F0E2C0')}
  <path d="M10 8L74 4L70 60L14 64Z" fill="#E2A93C"/>
  <circle cx="122" cy="30" r="20" fill="#E07A5F" opacity=".9"/>
  <path d="M96 58L156 54L158 96L92 98Z" fill="#3F8C8A"/>
  <path d="M0 78L160 72V100H0Z" fill="#D9C79C"/>
  <path ${ln} d="M20 14H62V50H20ZM41 14V50M20 32H62"/>
  <path ${ln} d="M128 18V72M118 18H138L132 10H124Z"/>
  <path ${ln} d="M104 66V86M104 66H120V86M104 76H120M106 86V94M118 86V94"/>
  <path d="M60 80L64 40L80 38L84 80Z" fill="#26313A"/>
  <path d="M64 40L80 38L76 80L60 80Z" fill="none" stroke="#1C1C1C" stroke-width=".7" transform="translate(2 -1)"/>
  <path d="M66 82L60 94H54M78 82L84 94H92" ${ln} stroke-width=".9"/>
  <path d="M60 52L48 62M84 50L96 46" ${ln} stroke-width=".9"/>
  <path d="M62 40C62 28 82 26 82 38Z" fill="#F4D7B5"/>
  <path d="M82 34L96 36L82 39Z" fill="#F4D7B5"/>
  <path d="M60 40C60 26 84 24 84 38L96 36" ${ln}/>
  <path d="M60 28H86L82 18H64Z" fill="#1C1C1C"/><path d="M56 28H90" stroke="#1C1C1C" stroke-width="1.4"/>
  <circle cx="76" cy="33" r=".9" fill="#1C1C1C"/><path d="M73 31h5" stroke="#1C1C1C" stroke-width=".5"/>
  <path d="M30 70h8M33 74h12M140 46l6-4" stroke="#1C1C1C" stroke-width=".5"/>`);
}

function il_ligneclaire() {
  const k = 'stroke="#141414" stroke-width=".8" stroke-linejoin="round"';
  let win = '';
  for (let row = 0; row < 3; row++) for (let c = 0; c < 2; c++) win += `<rect x="${8 + c * 14}" y="${14 + row * 18}" width="7" height="10" fill="#4E7BAA" ${k}/>`;
  for (let row = 0; row < 2; row++) for (let c = 0; c < 2; c++) win += `<rect x="${118 + c * 16}" y="${24 + row * 18}" width="8" height="11" fill="#F6F0DC" ${k}/>`;
  return sv(`${bg('#8EC6E8')}
  <path d="M110 10C116 6 124 8 126 12C132 10 138 14 134 18H108C104 16 106 12 110 10Z" fill="#FFFFFF" ${k}/>
  <path d="M0 6H40V78H0Z" fill="#E9C37A" ${k}/><path d="M-1 6H42V10H-1Z" fill="#C9573E" ${k}/>
  <path d="M40 30H60V78H40Z" fill="#F2EAD3" ${k}/><path d="M44 36h12v8H44ZM44 52h12v8H44Z" fill="#4E7BAA" ${k}/>
  <path d="M110 16H160V78H110Z" fill="#D1563F" ${k}/><path d="M108 16H162V20H108Z" fill="#F2EAD3" ${k}/>
  ${win}
  <path d="M120 64H132V78H120Z" fill="#6B3E26" ${k}/>
  <path d="M0 78H160V100H0Z" fill="#A9A7A0" ${k}/><path d="M0 84H160" stroke="#141414" stroke-width=".8"/>
  <path d="M-1 78H161V84H-1Z" fill="#CFCBBE" ${k}/>
  <path d="M70 94V86C72 84 78 83 82 82C86 76 90 74 98 74C106 74 110 76 114 82C120 83 126 84 128 88V94Z" fill="#D2302A" ${k}/>
  <path d="M86 82C88 78 92 77 97 77V82ZM100 77C106 77 108 79 110 82H100Z" fill="#BFE0F2" ${k}/>
  <circle cx="82" cy="94" r="5" fill="#222" ${k}/><circle cx="82" cy="94" r="2" fill="#D9D9D9" ${k}/>
  <circle cx="116" cy="94" r="5" fill="#222" ${k}/><circle cx="116" cy="94" r="2" fill="#D9D9D9" ${k}/>
  <path d="M68 90H74M126 90H130" stroke="#141414" stroke-width="1.4"/>
  <g>
   <path d="M60 84L61 70H66L67 84Z" fill="#8A7A5A" ${k}/>
   <path d="M58 72L59 60C60 58 67 58 68 60L69 72Z" fill="#E6D8A8" ${k}/>
   <circle cx="63.5" cy="54.5" r="3.6" fill="#F5D3B5" ${k}/>
   <path d="M59.5 53C59.5 49 67.5 49 67.5 53L69 53.5H58Z" fill="#7A5A3A" ${k}/>
   <path d="M59 84h3M65 84h3" stroke="#141414" stroke-width="1.4"/>
  </g>`);
}

function il_superhero() {
  const [d1, i1] = il_dots(3, .75, '#E8463C', '#F7D530');
  const [d2, i2] = il_dots(2.2, .55, '#F08C8C', '#FFE3D2');
  const r = rng(9);
  let burst = '', crack = '';
  for (let i = 0; i < 28; i++) { const a = i / 28 * Math.PI * 2, R = i % 2 ? 22 : 38; burst += (i ? 'L' : 'M') + f1(112 + Math.cos(a) * R) + ' ' + f1(60 + Math.sin(a) * R * .8); }
  for (let i = 0; i < 26; i++) { const t = r(), x = 20 + t * 70 + (r() - .5) * 10, y = 82 - t * 30 + (r() - .5) * 16; crack += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(.8 + r() * 3.2)}" fill="#111"/>`; if (r() < .5) crack += `<circle cx="${f1(x + 4)}" cy="${f1(y - 3)}" r=".6" fill="#111"/>`; }
  const k = 'stroke="#111" stroke-width="1.3" stroke-linejoin="round"';
  let sp = '';
  for (let i = 0; i < 9; i++) sp += `<path d="M${f1(4 + i * 3)} ${f1(10 + i * 7)}L${f1(30 + i * 2)} ${f1(20 + i * 6)}"/>`;
  return sv(`<defs>${d1}${d2}</defs>
  <rect width="160" height="100" fill="url(#${i1})"/>
  <path d="${burst}Z" fill="#FFFFFF" ${k}/>
  ${crack}
  <g stroke="#111" stroke-width=".8">${sp}</g>
  <path d="M40 28C30 20 16 8 0 4L0 40C14 40 26 44 38 48Z" fill="#D8262B" ${k}/>
  <path d="M40 56L20 80L28 86L52 58Z" fill="#2457B3" ${k}/><path d="M20 80L12 90L22 94L28 86Z" fill="#D8262B" ${k}/>
  <path d="M34 30L56 24L62 50L40 58Z" fill="#2457B3" ${k}/>
  <circle cx="48" cy="40" r="5" fill="#F7D530" ${k} stroke-width="1"/><path d="M46 37l4 3-4 3" fill="none" stroke="#D8262B" stroke-width="1.4"/>
  <path d="M38 52L60 46" stroke="#F7D530" stroke-width="3"/>
  <path d="M52 24L100 40L98 76L58 42Z" fill="#2457B3" ${k}/>
  <path d="M60 32L96 50" stroke="#16367A" stroke-width="2"/>
  <circle cx="42" cy="20" r="7.5" fill="url(#${i2})" ${k}/>
  <path d="M34.5 18C36 11 48 10 49.5 18L49.5 20L34.5 20Z" fill="#2457B3" ${k}/>
  <path d="M37 18h4.5M43.5 18h4.5" stroke="#FFF" stroke-width="1.6"/>
  <path d="M93 46C98 38 114 38 122 46C128 54 126 70 118 76C108 82 94 78 90 68C88 60 89 52 93 46Z" fill="#D8262B" ${k}/>
  <path d="M100 48C104 46 110 46 114 48M98 56C104 53 112 53 118 56M98 64C104 61 112 61 118 64" fill="none" stroke="#111" stroke-width="1"/>
  <path d="M106 42C108 36 116 36 120 42" fill="none" stroke="#111" stroke-width="1"/>
  <path d="M0 0H160V100H0Z" fill="none" stroke="#111" stroke-width="3"/>`);
}

function il_comix() {
  const c1 = U('ilcp'), c2 = U('ilcp'), c3 = U('ilcp'), [wd, wf] = wob(.9, .15, 5);
  return sv(`<defs>${wd}<clipPath id="${c1}"><path d="M0 0H160V76H0Z"/></clipPath><clipPath id="${c2}"><path d="M0 0H160V40C120 34 60 40 0 48Z"/></clipPath>
  <clipPath id="${c3}"><path d="M60 54L58 70L66 72L70 58L76 72L84 70L76 54Z"/></clipPath></defs>
  ${bg('#F5F1E6')}
  <g filter="url(#${wf})">
  ${il_hatch(c1, 80, 40, 30, 2.4, '#111', .45, 110)}
  ${il_hatch(c2, 80, 40, -35, 2.6, '#111', .45, 110)}
  <path d="M0 76H160" stroke="#111" stroke-width="1"/>
  <ellipse cx="72" cy="86" rx="30" ry="4" fill="#111" opacity=".85"/>
  <path d="M74 30C66 30 62 38 62 46C62 54 66 56 72 56C80 56 84 52 82 44C80 36 80 30 74 30Z" fill="#F5F1E6" stroke="#111" stroke-width="1"/>
  <path d="M62 56L54 72C52 78 48 80 44 82" fill="none" stroke="#111" stroke-width="5.5" stroke-linecap="round"/>
  <path d="M76 56L88 70C92 76 96 78 100 80" fill="none" stroke="#111" stroke-width="5.5" stroke-linecap="round"/>
  <path d="M34 84C34 78 44 76 48 80C50 84 46 86 40 86C36 86 34 86 34 84Z" fill="#111"/>
  <path d="M96 82C96 76 108 76 112 80C114 84 108 86 102 86C98 86 96 86 96 82Z" fill="#111"/>
  <path d="M66 40C62 46 58 50 52 50M80 40C84 44 86 48 92 46" fill="none" stroke="#111" stroke-width="3.4" stroke-linecap="round"/><path d="M66 40C62 46 58 50 52 50M80 40C84 44 86 48 92 46" fill="none" stroke="#F5F1E6" stroke-width="1.6" stroke-linecap="round"/><circle cx="51" cy="50" r="2.2" fill="#F5F1E6" stroke="#111" stroke-width=".8"/><circle cx="93" cy="46" r="2.2" fill="#F5F1E6" stroke="#111" stroke-width=".8"/>
  <path d="M70 30C66 22 70 14 78 14C86 14 88 22 84 28C82 32 76 32 70 30Z" fill="#F5F1E6" stroke="#111" stroke-width="1"/>
  <path d="M82 22C88 22 92 26 88 28C86 29 83 28 82 26Z" fill="#F5F1E6" stroke="#111" stroke-width="1"/>
  <path d="M68 16C70 8 84 8 86 16Z" fill="#111"/><path d="M64 16H90" stroke="#111" stroke-width="1.4"/>
  <circle cx="80" cy="20" r=".9" fill="#111"/>
  <g stroke="#111" stroke-width=".4"><path d="M64 34l4 18M67 34l4 18M70 33l4 18M64 44l14-4M64 48l14-4"/><path d="M71 18q2 3 1 8M73 18q2 3 1 8"/></g>
  <path d="M94 16l6-4M96 22l8-1M94 28l7 3" stroke="#111" stroke-width=".8" stroke-linecap="round"/>
  </g>${grainOv(.25)}`);
}

function il_manga() {
  const p1 = U('ilcp'), p2 = U('ilcp'), p3 = U('ilcp'), ir = U('ilgr');
  const [dt, dti] = il_dots(2, .45, '#1A1A1A');
  const [dt2, dti2] = il_dots(2.6, .8, '#1A1A1A');
  const r = rng(7);
  let focus = '';
  for (let i = 0; i < 70; i++) { const a = r() * Math.PI * 2, w = .012 + r() * .03, r0 = 10 + r() * 8; focus += `<path d="M${f1(116 + Math.cos(a) * r0)} ${f1(27 + Math.sin(a) * r0 * .7)}L${f1(116 + Math.cos(a - w) * 90)} ${f1(27 + Math.sin(a - w) * 90)}L${f1(116 + Math.cos(a + w) * 90)} ${f1(27 + Math.sin(a + w) * 90)}Z"/>`; }
  let speed = '';
  for (let i = 0; i < 22; i++) { const y = 56 + r() * 40, x = 70 + r() * 40; speed += `<path d="M${f1(x)} ${f1(y)}H${f1(x + 30 + r() * 50)}" stroke-width="${f1(.2 + r() * .6)}"/>`; }
  return sv(`<defs>${dt}${dt2}<clipPath id="${p1}"><path d="M5 5H72L62 95H5Z"/></clipPath><clipPath id="${p2}"><path d="M76 5H155V49H71Z"/></clipPath><clipPath id="${p3}"><path d="M70 53H155V95H66Z"/></clipPath>
  <linearGradient id="${ir}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#111"/><stop offset=".6" stop-color="#444"/><stop offset="1" stop-color="#9A9A9A"/></linearGradient></defs>
  ${bg('#FAFAF7')}
  <g clip-path="url(#${p1})">
   <rect x="0" y="62" width="80" height="40" fill="url(#${dti})" opacity=".8"/>
   <path d="M0 5L14 26L20 5L28 30L38 5L44 24L56 5Z" fill="#1A1A1A"/>
   <path d="M10 36C16 30 30 28 44 30" fill="none" stroke="#1A1A1A" stroke-width="1.2" stroke-linecap="round"/>
   <path d="M8 52C14 38 42 36 56 46C46 62 18 64 8 52Z" fill="#FFF"/>
   <ellipse cx="32" cy="50" rx="11" ry="12.5" fill="url(#${ir})"/>
   <ellipse cx="32" cy="52" rx="5" ry="6" fill="#111"/>
   <ellipse cx="27" cy="45" rx="3.6" ry="4.4" fill="#FFF"/><circle cx="37" cy="56" r="1.8" fill="#FFF"/><circle cx="35.5" cy="44" r="1" fill="#FFF"/>
   <path d="M6 52C14 36 44 36 58 46L60 42C46 32 14 34 4 48Z" fill="#1A1A1A"/>
   <path d="M54 44l6-6M57 46l5-4M48 40l4-6" stroke="#1A1A1A" stroke-width="1.1" stroke-linecap="round"/>
   <path d="M14 60C24 64 40 63 50 57" fill="none" stroke="#1A1A1A" stroke-width=".6"/>
   <path d="M52 70l3-6l3 6a3 3 0 1 1-6 0Z" fill="#FFF" stroke="#1A1A1A" stroke-width=".6"/>
   <path d="M18 72l2 6M23 71l2 6M28 71l2 6" stroke="#1A1A1A" stroke-width=".5"/>
  </g>
  <g clip-path="url(#${p2})"><g fill="#1A1A1A">${focus}</g>
   <circle cx="116" cy="27" r="6" fill="#FFF" stroke="#1A1A1A" stroke-width=".8"/><path d="M110 24C112 18 122 18 122 25L118 22L116 25L113 22Z" fill="#1A1A1A"/>
   <path d="M113 30q3 1.5 6 0" fill="none" stroke="#1A1A1A" stroke-width=".6"/><circle cx="114" cy="27" r=".7" fill="#1A1A1A"/><circle cx="118.5" cy="27" r=".7" fill="#1A1A1A"/>
  </g>
  <g clip-path="url(#${p3})">
   <rect x="60" y="50" width="100" height="50" fill="url(#${dti2})" opacity=".55"/>
   <g stroke="#1A1A1A" fill="none">${speed}</g>
   <path d="M86 96C88 80 96 70 110 68C122 68 128 76 130 96Z" fill="#1A1A1A"/>
   <path d="M98 70C96 60 104 54 112 56C120 58 120 66 116 70Z" fill="#FFF" stroke="#1A1A1A" stroke-width=".8"/>
  </g>
  <g fill="none" stroke="#1A1A1A" stroke-width="1.3" stroke-linejoin="round"><path d="M5 5H72L62 95H5Z"/><path d="M76 5H155V49H71Z"/><path d="M70 53H155V95H66Z"/></g>`);
}

function il_kawaii() {
  const ol = 'stroke="#6B4A4A" stroke-width="1" stroke-linejoin="round"';
  const star = (x, y, s, c) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0-5L1.4-1.6L5-1.4L2.2 1L3 4.6L0 2.6L-3 4.6L-2.2 1L-5-1.4L-1.4-1.6Z" fill="${c}" stroke="#6B4A4A" stroke-width="${f1(.8 / s)}" stroke-linejoin="round"/>`;
  const heart = (x, y, s, c) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 3C-6-1-4-6 0-3.4C4-6 6-1 0 3Z" fill="${c}" stroke="#6B4A4A" stroke-width="${f1(.8 / s)}"/>`;
  return sv(`${bg('#FCE0E8')}
  <circle cx="20" cy="80" r="26" fill="#FFF0F4"/><circle cx="146" cy="16" r="20" fill="#E6E0FA"/>
  ${star(24, 20, 1.1, '#FFF2A8')}${star(140, 72, .9, '#FFF2A8')}${heart(128, 40, 1.2, '#FF9BB5')}${heart(30, 46, .9, '#C9F0DE')}${star(118, 88, .6, '#C9F0DE')}
  <path d="M100 74C96 74 94 70 97 68C96 64 101 62 104 64C106 60 113 61 113 66C117 66 118 71 114 74Z" fill="#FFFFFF" ${ol}/>
  <circle cx="102.5" cy="69" r=".7" fill="#6B4A4A"/><circle cx="109" cy="69" r=".7" fill="#6B4A4A"/><ellipse cx="101" cy="71" rx="1.2" ry=".7" fill="#FFAAC0"/><ellipse cx="111" cy="71" rx="1.2" ry=".7" fill="#FFAAC0"/>
  <path d="M68 92C64 92 64 84 66 78C68 72 92 72 94 78C96 84 96 92 92 92Z" fill="#B9E6F2" ${ol}/>
  <ellipse cx="72" cy="92" rx="5" ry="2.6" fill="#FFF7EE" ${ol}/><ellipse cx="88" cy="92" rx="5" ry="2.6" fill="#FFF7EE" ${ol}/>
  <path d="M60 22L56 6L70 14Z M100 22L104 6L90 14Z" fill="#FFF7EE" ${ol}/>
  <path d="M59.5 13L62 18L66 15Z M100.5 13L98 18L94 15Z" fill="#FFB8C8"/>
  <ellipse cx="80" cy="44" rx="27" ry="23" fill="#FFF7EE" ${ol}/>
  <path d="M94 22C98 16 106 18 104 24C110 24 110 32 104 32C102 36 96 32 98 28Z" fill="#FF7FA3" ${ol}/><circle cx="100" cy="27" r="2.2" fill="#FF5C8A" ${ol}/>
  <ellipse cx="69" cy="46" rx="2" ry="2.6" fill="#4A3232"/><ellipse cx="91" cy="46" rx="2" ry="2.6" fill="#4A3232"/>
  <circle cx="69.6" cy="45" r=".7" fill="#FFF"/><circle cx="91.6" cy="45" r=".7" fill="#FFF"/>
  <ellipse cx="63" cy="52" rx="4" ry="2.2" fill="#FF9FB8" opacity=".75"/><ellipse cx="97" cy="52" rx="4" ry="2.2" fill="#FF9FB8" opacity=".75"/>
  <path d="M77.5 50.5q1.25 1.6 2.5 0q1.25 1.6 2.5 0" fill="none" stroke="#4A3232" stroke-width=".8" stroke-linecap="round"/>
  <path d="M60 52l-8-1M60 55l-8 2M100 52l8-1M100 55l8 2" stroke="#6B4A4A" stroke-width=".6" stroke-linecap="round"/>`);
}

function il_eurosf() {
  const sk = U('ilgr'), pl = U('ilgr'), c1 = U('ilcp');
  const ln = 'fill="none" stroke="#3A2C3C" stroke-width=".35" stroke-linecap="round"';
  let dune = '', r = rng(17);
  for (let i = 0; i < 8; i++) { const y = 74 + i * 3.4; dune += `<path d="M0 ${f1(y)}C40 ${f1(y - 3 + r() * 2)} 80 ${f1(y + 3)} 160 ${f1(y - 2)}"/>`; }
  let stripes = '';
  for (let i = 0; i < 8; i++) stripes += `<path d="M100 ${f1(6 + i * 4)}H160"/>`;
  return sv(`<defs><linearGradient id="${sk}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFE4DE"/><stop offset=".55" stop-color="#F6E6CA"/><stop offset="1" stop-color="#F3CFB0"/></linearGradient>
  <radialGradient id="${pl}" cx=".4" cy=".4" r=".7"><stop offset="0" stop-color="#FBE0E6"/><stop offset="1" stop-color="#E3A9BE"/></radialGradient>
  <clipPath id="${c1}"><circle cx="122" cy="22" r="18"/></clipPath></defs>
  <rect width="160" height="100" fill="url(#${sk})"/>
  <circle cx="122" cy="22" r="18" fill="url(#${pl})"/><g clip-path="url(#${c1})" stroke="#C9809A" stroke-width=".35" opacity=".8">${stripes}</g>
  <circle cx="122" cy="22" r="18" ${ln}/>
  <path d="M0 62C8 60 10 48 16 46C22 48 22 58 30 60L52 60C56 50 58 40 64 40C70 40 70 52 74 60H160V70H0Z" fill="#CDB6DA"/>
  <path d="M0 62C8 60 10 48 16 46C22 48 22 58 30 60L52 60C56 50 58 40 64 40C70 40 70 52 74 60" ${ln}/>
  <path d="M90 70C92 50 96 34 104 32C108 32 108 40 106 46C112 44 118 44 122 48C126 40 134 38 136 46C138 54 136 62 140 70Z" fill="#E7B98A"/>
  <path d="M90 70C92 50 96 34 104 32C108 32 108 40 106 46C112 44 118 44 122 48C126 40 134 38 136 46C138 54 136 62 140 70M108 70C108 60 114 54 118 56C122 58 124 64 122 70" ${ln}/>
  <g ${ln}><path d="M96 66C98 54 100 44 104 36M100 68C102 56 104 48 106 44M128 68C130 58 130 50 132 46M132 68C134 58 134 52 135 48M112 56l2 4M116 55l1 5"/></g>
  <path d="M0 70H160V100H0Z" fill="#F2D9A8"/>
  <g ${ln} opacity=".7">${dune}</g>
  <g transform="translate(46 86) scale(1.5)">
   <path d="M2 0L18 -2" stroke="#9AA6C8" stroke-width="1.6" opacity=".6"/>
   <path d="M-3 0L-1-8M3 0L1-8M-1-8L-4-14" ${ln} stroke-width=".5"/>
   <ellipse cx="0" cy="-10" rx="5" ry="2.6" fill="#F7F2EA" stroke="#3A2C3C" stroke-width=".4"/>
   <path d="M4-11C7-16 9-18 11-17" ${ln} stroke-width=".7"/><circle cx="11" cy="-17" r="1.4" fill="#F7F2EA" stroke="#3A2C3C" stroke-width=".4"/>
   <path d="M-1-12L-1-17" stroke="#C43A3A" stroke-width="1.6"/><circle cx="-1" cy="-18.4" r="1" fill="#3A2C3C"/>
  </g>
  <path d="M30 18l10 2-10 1z" fill="#3A2C3C" opacity=".5"/>`);
}

function il_tattoo() {
  const k = 'stroke="#151515" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"';
  return sv(`${bg('#EFE2C6')}
  <g transform="translate(118 48) rotate(-32)">
   <path d="M-3-40H3L4 34L0 42L-4 34Z" fill="#D9DCDF" ${k}/><path d="M0-36V36" stroke="#8A9096" stroke-width=".8"/>
   <path d="M-12-44H12L10-39H-10Z" fill="#F1C232" ${k}/>
   <path d="M-3-44V-58H3V-44Z" fill="#151515" ${k}/><circle cx="0" cy="-60" r="3.5" fill="#F1C232" ${k}/>
   <path d="M-1 46q1 3 0 5q-1-2 1-5Z" fill="#C8271F"/>
  </g>
  <g transform="translate(102 70) rotate(160)"><path d="M0 0C4-6 12-7 18 0C12 7 4 6 0 0Z" fill="#2E8B3A" ${k}/><path d="M2 0H14" stroke="#151515" stroke-width="1"/></g>
  <g transform="translate(128 70) rotate(15)"><path d="M0 0C4-6 12-7 18 0C12 7 4 6 0 0Z" fill="#2E8B3A" ${k}/><path d="M2 0H14" stroke="#151515" stroke-width="1"/></g>
  <circle cx="115" cy="62" r="16" fill="#C8271F" ${k}/>
  <path d="M115 50C108 50 104 58 108 64C112 70 122 68 122 60C122 54 116 54 114 58C112 62 118 64 118 60" fill="none" ${k}/>
  <path d="M100 66C104 74 112 78 122 76M130 56C132 64 128 72 120 76" fill="none" ${k}/>
  <path d="M104 52C108 48 116 46 122 48" fill="none" stroke="#F5A8A0" stroke-width="1.6" stroke-linecap="round"/>
  <g transform="translate(48 44)">
   <path d="M-14 6L-36-2L-24 9L-36 18L-14 12Z" fill="#1E3D74" ${k}/>
   <path d="M0 10C-6 22-20 30-38 33C-24 24-14 16-8 8Z" fill="#1E3D74" ${k}/>
   <path d="M-16 4C-8-2 8-4 18-3C24-2 26 1 26 4C18 10 0 14-16 12Z" fill="#1E3D74" ${k}/>
   <path d="M-10 11C0 12 14 10 25 5C18 13 4 16-10 13Z" fill="#F2E4C8" ${k}/>
   <path d="M17 3C21 9 26 7 26 3Z" fill="#C8271F"/>
   <circle cx="20" cy="-1" r="6" fill="#1E3D74" ${k}/>
   <path d="M25.5-2L32 0L25.5 2Z" fill="#151515" ${k}/>
   <circle cx="21.5" cy="-2" r="1.2" fill="#F2E4C8"/>
   <path d="M-2 2C-8-12-2-28 16-38C12-26 14-12 10 0Z" fill="#1E3D74" ${k}/>
   <path d="M3-6C5-16 8-24 13-31M7-3C9-12 11-18 13-24" fill="none" stroke="#5C8FD8" stroke-width="1.2" stroke-linecap="round"/>
  </g>
  <g fill="#F1C232" ${k} stroke-width="1"><path d="M20 76l2 5 5 .4-4 3.4 1.4 5-4.4-2.8-4.4 2.8 1.4-5-4-3.4 5-.4Z"/><path d="M68 16l1.4 3.4 3.6.3-2.8 2.4 1 3.6-3.2-2-3.2 2 1-3.6-2.8-2.4 3.6-.3Z"/></g>
  <path d="M8 8l4 4M12 8l-4 4M146 90l4 4M150 90l-4 4" stroke="#151515" stroke-width="1.2"/>
  ${grainOv(.3)}`);
}

function il_conceptart() {
  const sk = U('ilgr'), gl = U('ilgr'), bl = U('ilbl'), bl2 = U('ilbl'), r = rng(31);
  let strokes = '';
  for (let i = 0; i < 70; i++) { const x = r() * 160, y = r() * 70, w = 6 + r() * 18; strokes += `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(1.5 + r() * 3)}" transform="rotate(${f1(-20 + r() * 14)} ${f1(x)} ${f1(y)})" fill="${pick(r, ['#4A5E6E', '#8E9EA2', '#E6C99A', '#5A6872'])}" opacity="${f1(.1 + r() * .16)}"/>`; }
  let far = '';
  for (let i = 0; i < 6; i++) { const x = 70 + i * 16 + r() * 6, h = 30 + r() * 30; far += `<path d="M${f1(x)} 70V${f1(70 - h)}l${f1(2 + r() * 2)}-${f1(4 + r() * 6)}l${f1(2 + r() * 2)} ${f1(4 + r() * 6)}V70Z"/>`; }
  return sv(`<defs><linearGradient id="${sk}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A3846"/><stop offset=".42" stop-color="#7E8E92"/><stop offset=".72" stop-color="#E6C894"/><stop offset="1" stop-color="#A88E68"/></linearGradient>
  <radialGradient id="${gl}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE4B0" stop-opacity=".9"/><stop offset="1" stop-color="#FFE4B0" stop-opacity="0"/></radialGradient>
  <filter id="${bl}" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="1.2"/></filter><filter id="${bl2}" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="4"/></filter></defs>
  <rect width="160" height="100" fill="url(#${sk})"/>
  <ellipse cx="104" cy="60" rx="50" ry="26" fill="url(#${gl})"/>
  ${strokes}
  <g fill="#A9A9A0" opacity=".75" filter="url(#${bl})">${far}</g>
  <path d="M22 72V18L28 6L34 0L40 6L46 18V72Z M46 30H100V37H46Z M100 72V26L106 14L112 26V72Z M54 37L58 72H52Z M92 37L94 72H88Z" fill="#3A4650"/>
  <path d="M46 37q27 14 54 0" fill="none" stroke="#3A4650" stroke-width="1.6"/>
  <g fill="#FFD98E" opacity=".8"><rect x="33" y="24" width="1" height="1.6"/><rect x="30" y="40" width="1" height="1.6"/><rect x="38" y="48" width="1" height="1.6"/><rect x="105" y="34" width="1" height="1.6"/></g>
  <path d="M60 0L72 0L108 70L90 70Z" fill="#FFE8C0" opacity=".1"/><path d="M84 0L90 0L118 70L108 70Z" fill="#FFE8C0" opacity=".08"/>
  <rect x="0" y="58" width="160" height="18" fill="#D9BF96" opacity=".6" filter="url(#${bl2})"/>
  <path d="M0 100V78C14 74 26 76 40 72C50 70 56 74 60 80L74 100Z" fill="#141A20"/>
  <path d="M100 100L110 86C120 84 140 88 160 84V100Z" fill="#1E262D"/>
  <g transform="translate(50 71)"><path d="M-1.4 0L-.8-5H.8L1.4 0Z" fill="#0C1014"/><circle cx="0" cy="-6" r=".9" fill="#0C1014"/><path d="M.6-5L4-1.5L1.2-1Z" fill="#7A2A22"/></g>`);
}

pool.groups.push({
  id: 'printed', title: 'Books, posters & magazines', slot: 'Illustration style',
  intro: 'The looks of commercial illustration from a century of print: storybooks, field guides, fashion pages, posters and magazine covers. Name one in a prompt to get both its drawing habits and its era\'s printing feel.',
  terms: [
    { id: 'goldenage', name: 'Golden Age illustration', aka: 'Golden Age of Illustration, Edwardian gift-book illustration',
      when: '1880–1920 · Britain, France, United States', y: 1880,
      desc: 'The era when lavish illustrated books and magazines made illustrators famous: fine ink line drawing laid under soft, muted watercolor. Think fairy tales, twisted old trees and slightly eerie, enchanted woods.',
      spot: 'sepia ink outlines, muted earthy washes (olive, ochre, faded rose), gnarled trees with faces in the bark, tipped-in plate feel, lots of fine linework',
      ref: 'Arthur Rackham, Edmund Dulac, N.C. Wyeth, Kay Nielsen',
      prompt: 'Golden Age storybook illustration, fine sepia ink line with muted watercolor washes, gnarled twisting tree, enchanted forest, faded earthy palette, aged paper, 1910s gift book plate',
      ex: il_goldenage() },
    { id: 'picturebook', name: 'Classic picture book', aka: 'Storybook ink and wash, nursery illustration',
      when: '1900s–1960s · Britain, United States', y: 1902,
      desc: 'Gentle children\'s book art: a delicate pen line, light washes of color and lots of empty white page around a small scene. Animals often wear little jackets and act like people.',
      spot: 'thin wobbly pen outline, pale transparent washes, generous white space, small vignette scenes without a full background, animals in clothes',
      ref: 'Beatrix Potter (Peter Rabbit), E.H. Shepard (Winnie-the-Pooh), Richard Scarry, Garth Williams',
      prompt: 'classic children\'s picture book illustration, delicate pen and ink with soft watercolor wash, small vignette on white paper, rabbit in a blue jacket, gentle, lots of white space',
      ex: il_picturebook() },
    { id: 'botanical', name: 'Botanical & naturalist', aka: 'Scientific illustration, natural history plate',
      when: '1700s–1900s · Europe, Americas', y: 1750,
      desc: 'Drawing made to identify a species: one specimen shown clearly on a plain page, with details like seeds or cross-sections beside it. Precise and calm, it reads as scientific and quietly beautiful.',
      spot: 'single specimen on blank paper, whole plant from root to flower, side details and cross-sections, tiny captions or numbers, fine hatching, true-to-life color',
      ref: 'Pierre-Joseph Redouté (Les Liliacées), John James Audubon (Birds of America), Ernst Haeckel (Art Forms in Nature), Maria Sibylla Merian',
      prompt: 'vintage botanical illustration plate, single specimen from root to flower on cream paper, precise fine linework and delicate watercolor, labelled detail studies, scientific accuracy',
      ex: il_botanical() },
    { id: 'fashion', name: 'Fashion illustration', aka: 'Fashion plate, croquis illustration',
      when: '1920s–1960s · Paris, New York', y: 1920,
      desc: 'Drawings made to sell clothes before photography took over: impossibly tall, elegant figures caught in a few quick strokes. The garment gets bold attention and everything else is barely suggested.',
      spot: 'elongated figure (about nine heads tall), tiny head and long neck, loose wash and blank paper, one bold black brush shape for the garment, a single red accent',
      ref: 'René Gruau (Dior ads), Erté, Carl Erickson (Eric), Antonio Lopez',
      prompt: 'mid-century fashion illustration, elongated elegant figure, bold sweeping black brushstrokes, loose watercolor wash, minimal detail, a single red accent, lots of blank paper',
      ex: il_fashion() },
    { id: 'propaganda', name: 'Wartime propaganda poster', aka: 'WWI and WWII poster, home-front poster',
      when: '1914–1945 · United States, Britain, Europe', y: 1914,
      desc: 'Posters made to recruit, ration and rally: one heroic figure seen from below, flat bold color, and a band left clear for a big slogan. Urgent, proud and very direct.',
      spot: 'heroic low camera angle, pointing or striding figure, flat red, navy and cream, sunburst rays, a slogan band across the bottom, bold dark outlines',
      ref: 'J.M. Flagg (I Want YOU), Alfred Leete (Kitchener poster), J. Howard Miller (We Can Do It!), Abram Games',
      prompt: 'vintage wartime propaganda poster, heroic figure from a low angle pointing forward, flat bold red navy and cream, sunburst rays, bold outlines, empty slogan band, lithograph texture',
      ex: il_propaganda() },
    { id: 'pulp', name: 'Pulp cover art', aka: 'Pulp magazine cover, golden-age sci-fi cover',
      when: '1930s–1950s · United States', y: 1930,
      desc: 'Painted covers for cheap fiction magazines, designed to grab you from a newsstand: lurid colors, danger and wonder all at once. Rocket ships, monsters, ray guns and a hero in trouble.',
      spot: 'saturated purple and orange skies, glossy painted rocket ships with fins, ringed planets, tentacled monsters, a figure in peril, melodramatic diagonal action',
      ref: 'Frank R. Paul, Earle K. Bergey, Virgil Finlay, Margaret Brundage',
      prompt: 'vintage pulp magazine cover art, lurid saturated oil paint, sleek finned rocket ship, ringed planet in a purple and orange sky, monster rising, hero in peril, dramatic',
      ex: il_pulp() },
    { id: 'pinup', name: 'Pin-up', aka: 'Pin-up girl, calendar art',
      when: '1940s–1950s · United States', y: 1940,
      desc: 'Glossy painted calendar and ad art of cheerful, glamorous women: smooth skin, bright lipstick, a wink and a playful pose. For a tasteful result, ask for the polish and the charm (a wink, a sailor top, polka dots) rather than the cheesecake.',
      spot: 'airbrush-smooth glossy painting, victory-roll hairdos, red lips, a wink or big smile, polka dots and sailor outfits, bright flat color background',
      ref: 'Gil Elvgren, Alberto Vargas, Pearl Frush, Zoë Mozert',
      prompt: '1950s pin-up illustration, glossy painted portrait, cheerful winking woman with victory-roll hair and red lipstick, sailor top, red polka dot background, smooth vintage calendar art',
      ex: il_pinup() },
    { id: 'midcentury', name: 'Mid-century illustration', aka: 'Mid-century commercial illustration, Golden Books style',
      when: '1950s–1960s · United States, Europe', y: 1950,
      desc: 'Postwar illustration that flattened everything into lively, slightly wonky shapes in a few printed colors. Linework floats loosely off the color, and dry-brush textures make it feel hand printed.',
      spot: 'flat stylized shapes, tilted houses and triangle trees, three or four spot colors (mustard, teal, coral, black), line drawn slightly off the fills, dry brush and crayon textures',
      ref: 'Little Golden Books, Jim Flora (jazz album covers), Alice and Martin Provensen, J.P. Miller',
      prompt: 'mid-century illustration, flat stylized shapes, limited palette of mustard teal coral and black, loose offset linework, dry brush textures, whimsical 1950s Golden Books feel',
      ex: il_midcentury() },
    { id: 'conceptual', name: 'Conceptual editorial', aka: 'Conceptual illustration, op-ed illustration',
      when: 'since the 1960s · magazines, newspapers', y: 1960,
      desc: 'Illustration that carries an article\'s argument as one clever idea, usually a visual pun or metaphor. Very few elements and colors, so the idea lands instantly.',
      spot: 'one simple visual metaphor, a surprising twist on an everyday object, two or three flat colors, lots of empty space, tiny figures against big symbolic shapes',
      ref: 'Brad Holland, Christoph Niemann, Jean-Michel Folon, New Yorker covers',
      prompt: 'conceptual editorial illustration, single clever visual metaphor, minimal flat shapes, limited palette of navy cream and red, lots of negative space, witty and simple',
      ex: il_conceptual() },
  ]
});

pool.groups.push({
  id: 'comics', title: 'Comics, cartoons & genre', slot: 'Illustration style',
  intro: 'Drawing languages from cartoons, comic books and genre art. Each has strong habits of line, color and print that an image model knows well, so one name brings a whole toolkit.',
  terms: [
    { id: 'rubberhose', name: 'Rubber hose', aka: 'Rubber hose animation, 1930s cartoon style',
      when: '1920s–1930s · United States', y: 1925,
      desc: 'The look of the earliest sound cartoons: characters with bendy, boneless limbs that bounce to the music. Black and white, round and endlessly cheerful (or slightly creepy).',
      spot: 'limbs like noodles with no elbows, white puffy gloves, pie-cut eyes (a wedge missing from each pupil), big shoes, everything bouncing, black and white film grain',
      ref: 'Fleischer Studios (Betty Boop), early Disney (Steamboat Willie), Felix the Cat, Cuphead (a modern homage)',
      prompt: '1930s rubber hose cartoon, black and white, bouncy character with noodle limbs and white gloves, pie-cut eyes, big grin, smiling sun, film grain and vignette',
      ex: il_rubberhose() },
    { id: 'upa', name: 'UPA cartoon modern', aka: 'Cartoon modern, limited animation style',
      when: '1950s · United States', y: 1950,
      desc: 'A modernist rebellion against round Disney cartoons: angular, flat characters and backgrounds made of loose abstract color blocks. Color shapes and lines are drawn separately, so they do not quite line up.',
      spot: 'angular geometric characters, flat color patches that ignore outlines, thin sketchy line for furniture, sparse abstract backgrounds, mustard, coral and teal',
      ref: 'UPA Studio (Gerald McBoing-Boing, Mr. Magoo), John Hubley, Saul Bass title sequences, The Incredibles credits (homage)',
      prompt: '1950s UPA cartoon modern style, angular flat stylized character, abstract color block background, thin line furniture drawn off the color, mustard coral and teal palette',
      ex: il_upa() },
    { id: 'ligneclaire', name: 'Ligne claire', aka: 'Clear line, Franco-Belgian clear line',
      when: 'since 1929 · Belgium, France', y: 1929,
      desc: 'Comics drawn with one even, clean outline around everything and flat bright color inside, with no hatching or heavy shadow. Every object reads crisply, from the car to the window frames.',
      spot: 'same line thickness everywhere, flat unshaded color, detailed realistic backgrounds with simple cartoon figures, no hatching, bright clear daylight',
      ref: 'Hergé (The Adventures of Tintin), Edgar P. Jacobs (Blake and Mortimer), Yves Chaland, Joost Swarte',
      prompt: 'ligne claire comic illustration, uniform clean black outlines, flat bright colors, no hatching or shading, detailed European street with vintage car, clear daylight',
      ex: il_ligneclaire() },
    { id: 'superhero', name: 'Silver Age superhero comic', aka: 'Silver Age comics, Kirby style, four-color comics',
      when: '1956–1970 · United States', y: 1956,
      desc: 'Bold, energetic comic books printed in cheap four-color: heroes punch straight out of the page while cosmic energy crackles around them. Everything is louder, closer and more dramatic.',
      spot: 'Ben-Day dots for skin and backgrounds, Kirby crackle (clusters of black energy dots), extreme foreshortening with fists toward the viewer, thick inks, primary colors, starburst shapes',
      ref: 'Jack Kirby (Fantastic Four), Steve Ditko (Spider-Man), Carmine Infantino, John Buscema',
      prompt: 'Silver Age comic book art, dynamic foreshortened hero punching toward viewer, thick black inks, Ben-Day dots, Kirby crackle energy, four-color print, primary colors, starburst',
      ex: il_superhero() },
    { id: 'comix', name: 'Underground comix', aka: 'Underground comics, comix',
      when: '1968–1970s · San Francisco, United States', y: 1968,
      desc: 'Self-published, rule-breaking comics of the counterculture, drawn in dense black and white pen. Rubbery, lumpy characters strut through scenes buried in obsessive crosshatching.',
      spot: 'heavy crosshatching filling the background, black and white only, rubbery figures with huge feet and bulbous noses, wobbly hand-inked lines, sweat and motion lines',
      ref: 'Robert Crumb (Zap Comix), S. Clay Wilson, Gilbert Shelton, Aline Kominsky-Crumb',
      prompt: 'underground comix style, black and white pen and ink, dense crosshatching, rubbery cartoon figure strutting with huge feet, wobbly hand-inked lines, 1960s counterculture',
      ex: il_comix() },
    { id: 'manga', name: 'Manga', aka: 'Japanese comics, black and white manga',
      when: 'since the 1950s · Japan', y: 1950,
      desc: 'Japanese comics, mostly black and white, where gray comes from printed dot screens called screentone. Big expressive eyes, speed lines and dramatic panel shapes carry the emotion and the action.',
      spot: 'screentone dot shading, radiating focus lines and speed lines, large glossy eyes with several highlights, spiky hair, angled panel borders, sweat drops',
      ref: 'Osamu Tezuka (Astro Boy), Naoko Takeuchi (Sailor Moon), Akira Toriyama, Takehiko Inoue',
      prompt: 'black and white manga page, angled panels, screentone shading, radiating speed lines, close-up of a large glossy expressive eye with highlights, crisp ink lines',
      ex: il_manga() },
    { id: 'kawaii', name: 'Kawaii & chibi', aka: 'Cute style, chibi, super-deformed',
      when: 'since the 1970s · Japan', y: 1974,
      desc: 'Japanese cute culture: round, soft characters with oversized heads, tiny bodies and minimal faces. Chibi means drawing any character this way, about two heads tall.',
      spot: 'huge round head on a tiny body, dot eyes set wide apart, blush ovals on the cheeks, tiny or no mouth, pastel pinks and mints, soft brown outlines, hearts and stars',
      ref: 'Sanrio (Hello Kitty), San-X (Rilakkuma), Pusheen, chibi fan art',
      prompt: 'kawaii chibi illustration, round character with oversized head and tiny body, simple dot eyes, pink blush cheeks, pastel colors, soft rounded outlines, little hearts and stars',
      ex: il_kawaii() },
    { id: 'eurosf', name: 'European sci-fi comics', aka: 'Métal hurlant style, bande dessinée sci-fi',
      when: '1974–1980s · France', y: 1974,
      desc: 'Adult French science fiction comics with vast, dreamlike alien landscapes drawn in delicate line and pale, strange color. Tiny travelers cross enormous deserts under giant planets.',
      spot: 'huge empty desert vistas, fine even pen line with light hatching, pale pastel colors (peach, turquoise, lilac), tiny figures on odd creatures, giant planets, surreal rock formations',
      ref: 'Moebius (Arzach, The Incal), Philippe Druillet, Enki Bilal, Métal hurlant magazine',
      prompt: 'European 1970s sci-fi comic art, vast alien desert, tiny rider on a strange creature, giant pale planet, fine clean pen line, pastel peach turquoise and lilac color',
      ex: il_eurosf() },
    { id: 'tattoo', name: 'American traditional tattoo', aka: 'Old school tattoo, Sailor Jerry flash',
      when: 'since the 1920s · United States', y: 1920,
      desc: 'Classic tattoo designs drawn as "flash" sheets for customers to pick from: bold, simple and built to last on skin. Thick black outlines hold a few strong colors.',
      spot: 'very bold black outlines, solid red, green, yellow and navy, solid black shading, swallows, roses, daggers, anchors, banners and stars on parchment',
      ref: 'Sailor Jerry (Norman Collins), Bert Grimm, Amund Dietzel, Don Ed Hardy',
      prompt: 'American traditional tattoo flash, bold black outlines, solid red green yellow and navy, swallow, rose pierced by a dagger, stars, vintage parchment background',
      ex: il_tattoo() },
    { id: 'conceptart', name: 'Concept art & matte painting', aka: 'Pre-production art, environment concept, speed painting',
      when: 'since the 1930s · film and game studios', y: 1930,
      desc: 'Paintings made to imagine a film or game world before it is built: huge scale, moody light and atmosphere over detail. Quick broad brushwork sets the mood, and a tiny figure gives the size.',
      spot: 'tiny silhouette figure against colossal structures, layers fading into haze, god rays, broad textured brush strokes, desaturated palette with one warm light source',
      ref: 'Syd Mead (Blade Runner), Ralph McQuarrie (Star Wars), Peter Ellenshaw (matte paintings), Feng Zhu',
      prompt: 'cinematic concept art, atmospheric speed painting, colossal towers fading into haze, tiny silhouette figure on a cliff, god rays, broad textured brushstrokes, moody desaturated palette',
      ex: il_conceptart() },
  ]
});

/* ===== e_folk.js ===== */
/* ---------- e_folk: folk art traditions + pattern & ornament traditions ---------- */
const fo_clip = b => { const id = U('foc'); return `<defs><clipPath id="${id}"><rect width="160" height="100"/></clipPath></defs><g clip-path="url(#${id})">${b}</g>`; };
function fo_bez(a, b, c, d, n = 16) {
  const o = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, u = 1 - t;
    o.push([u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]]);
  }
  return o;
}
// spiral points around (cx,cy), radius r0->r1, angle a0->a1 (degrees)
function fo_spiral(cx, cy, r0, r1, a0, a1, n = 36) {
  const o = [];
  for (let i = 0; i <= n; i++) { const t = i / n, r = r0 + (r1 - r0) * t, a = (a0 + (a1 - a0) * t) * Math.PI / 180; o.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
  return o;
}
// ribbon (brush stroke) along points with width function wf(t)
function fo_rib(P, wf, fill, extra = '') {
  const L = [], R = [], n = P.length;
  for (let i = 0; i < n; i++) {
    const a = P[Math.max(0, i - 1)], b = P[Math.min(n - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
    const w = wf(i / (n - 1)) / 2;
    L.push([P[i][0] - dy * w, P[i][1] + dx * w]); R.push([P[i][0] + dy * w, P[i][1] - dx * w]);
  }
  return `<path d="M${pts(L)} L${pts(R.reverse())}Z" fill="${fill}"${extra}/>`;
}
const fo_sw = (w, lo = .3, p = .7) => t => lo + w * Math.pow(Math.max(0, Math.sin(Math.PI * t)), p);
const fo_leafD = (len, w) => `M0,0 C${f1(len * .3)},${f1(-w)} ${f1(len * .75)},${f1(-w * .8)} ${f1(len)},0 C${f1(len * .75)},${f1(w * .8)} ${f1(len * .3)},${f1(w)} 0,0Z`;
// petal pointing up (-y) from radius r0 to r1
const fo_petalD = (r0, r1, w) => { const a = r0 + (r1 - r0) * .3, b = r0 + (r1 - r0) * .78; return `M0,${f1(-r0)} C${f1(w / 2)},${f1(-a)} ${f1(w / 2)},${f1(-b)} 0,${f1(-r1)} C${f1(-w / 2)},${f1(-b)} ${f1(-w / 2)},${f1(-a)} 0,${f1(-r0)}Z`; };
// scalloped disc
function fo_scal(cx, cy, R, n) {
  const P = []; for (let k = 0; k <= n; k++) { const a = k / n * 2 * Math.PI; P.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]); }
  const b = f1(R * Math.sin(Math.PI / n));
  return 'M' + f1(P[0][0]) + ',' + f1(P[0][1]) + P.slice(1).map(p => `A${b},${b} 0 0 1 ${f1(p[0])},${f1(p[1])}`).join('') + 'Z';
}

/* ================= FOLK ART ================= */

function fo_mfish(cx, cy, L, H, dir) {
  const K = '#1B1410', cid = U('mfc'), k = .78, ox = .1 * L * (1 - k);
  const body = (k, ox) => `M${f1(L / 2 * k + ox)},0 C${f1(L * .3 * k + ox)},${f1(-H * k)} ${f1(-L * .2 * k + ox)},${f1(-H * k)} ${f1(-L * .3 * k + ox)},0 C${f1(-L * .2 * k + ox)},${f1(H * k)} ${f1(L * .3 * k + ox)},${f1(H * k)} ${f1(L / 2 * k + ox)},0Z`;
  let s = `<g transform="translate(${cx} ${cy}) scale(${dir} 1)"><defs><clipPath id="${cid}"><path d="${body(k, ox)}"/></clipPath></defs>`;
  // fins
  s += `<path d="M${f1(-L * .05)},${f1(-H * .8)} L${f1(L * .08)},${f1(-H * 1.28)} L${f1(L * .2)},${f1(-H * .78)}Z M${f1(-L * .05)},${f1(H * .8)} L${f1(L * .08)},${f1(H * 1.28)} L${f1(L * .2)},${f1(H * .78)}Z" fill="#3E7A3A" stroke="${K}" stroke-width=".7"/>`;
  // tail
  s += `<path d="M${f1(-L * .27)},0 L${f1(-L * .5)},${f1(-H * .85)} Q${f1(-L * .4)},0 ${f1(-L * .5)},${f1(H * .85)}Z" fill="#2C3E8C" stroke="${K}" stroke-width=".9"/>`;
  let tl = ''; for (let i = -2; i <= 2; i++) tl += `M${f1(-L * .29)},0 L${f1(-L * .45)},${f1(H * .3 * i)}`;
  s += `<path d="${tl}" stroke="#F0DDB0" stroke-width=".5"/>`;
  s += `<path d="${body(1, 0)}" fill="#C8341F" stroke="${K}" stroke-width="1.1"/>`;
  s += `<path d="${body(k, ox)}" fill="#E8B83A" stroke="${K}" stroke-width=".6"/>`;
  let sc = ''; let row = 0;
  for (let y = -H; y < H; y += 2.6, row++) for (let x = -L * .32 + (row % 2) * 1.6; x < L * .3; x += 3.2) sc += `M${f1(x)},${f1(y)}a1.6,1.6 0 0 0 3.2,0`;
  s += `<path d="${sc}" fill="none" stroke="${K}" stroke-width=".4" clip-path="url(#${cid})"/>`;
  s += `<rect x="${f1(L * .27)}" y="${-H}" width="${L}" height="${2 * H}" fill="#C8341F" clip-path="url(#${cid})"/>`;
  s += `<path d="M${f1(L * .27)},${f1(-H * .62)} Q${f1(L * .2)},0 ${f1(L * .27)},${f1(H * .62)} M${f1(L * .24)},${f1(-H * .6)} Q${f1(L * .17)},0 ${f1(L * .24)},${f1(H * .6)}" fill="none" stroke="${K}" stroke-width=".7"/>`;
  s += `<circle cx="${f1(L * .36)}" cy="${f1(-H * .1)}" r="${f1(H * .22)}" fill="#F7EBD0" stroke="${K}" stroke-width=".7"/><circle cx="${f1(L * .37)}" cy="${f1(-H * .1)}" r="${f1(H * .1)}" fill="${K}"/>`;
  s += `<path d="M${f1(L * .46)},${f1(H * .12)} l-2.5,.6" stroke="${K}" stroke-width=".6"/></g>`;
  return s;
}
function fo_mpeacock(cx, cy) {
  const K = '#1B1410'; let s = '';
  const R = 24, a0 = 188 * Math.PI / 180, a1 = 352 * Math.PI / 180;
  s += `<path d="M${cx},${cy} L${f1(cx + R * Math.cos(a0))},${f1(cy + R * Math.sin(a0))} A${R},${R} 0 0 1 ${f1(cx + R * Math.cos(a1))},${f1(cy + R * Math.sin(a1))}Z" fill="#E8B83A" stroke="${K}" stroke-width=".9"/>`;
  s += `<path d="M${f1(cx + (R - 2.2) * Math.cos(a0))},${f1(cy + (R - 2.2) * Math.sin(a0))} A${R - 2.2},${R - 2.2} 0 0 1 ${f1(cx + (R - 2.2) * Math.cos(a1))},${f1(cy + (R - 2.2) * Math.sin(a1))}" fill="none" stroke="${K}" stroke-width=".5"/>`;
  let ln = '', eyes = '';
  for (let a = 196; a <= 344; a += 12.3) {
    const r = a * Math.PI / 180, ex = cx + 17 * Math.cos(r), ey = cy + 17 * Math.sin(r);
    ln += `M${cx},${cy}L${f1(ex)},${f1(ey)}`;
    eyes += `<ellipse cx="${f1(ex)}" cy="${f1(ey)}" rx="2.3" ry="3.3" transform="rotate(${f1(a + 90)} ${f1(ex)} ${f1(ey)})" fill="#2E6FA8" stroke="${K}" stroke-width=".5"/><circle cx="${f1(ex)}" cy="${f1(ey)}" r="1.2" fill="#C8341F"/>`;
  }
  s += `<path d="${ln}" stroke="#3E7A3A" stroke-width="1"/>` + eyes;
  // legs
  s += `<path d="M${cx - 2},${cy + 10} L${cx - 3},${cy + 21} l-2.5,1 M${cx - 3},${cy + 21} l2,1 M${cx + 3},${cy + 10} L${cx + 4},${cy + 21} l-2,1 M${cx + 4},${cy + 21} l2.5,1" fill="none" stroke="${K}" stroke-width=".9"/>`;
  // neck
  s += fo_rib(fo_bez([cx + 3, cy - 4], [cx + 9, cy - 11], [cx + 5, cy - 18], [cx + 9, cy - 25], 10), t => 5.5 - 2.5 * t, '#2C4FA0', ` stroke="${K}" stroke-width=".8"`);
  // body
  const bd = `M${cx - 9},${cy + 2} C${cx - 9},${cy - 8} ${cx + 4},${cy - 10} ${cx + 8},${cy - 4} C${cx + 11},${cy + 4} ${cx + 4},${cy + 12} ${cx - 3},${cy + 12} C${cx - 7},${cy + 11} ${cx - 9},${cy + 7} ${cx - 9},${cy + 2}Z`;
  s += `<path d="${bd}" fill="#2C4FA0" stroke="${K}" stroke-width="1.1"/><path d="${bd}" transform="translate(${f1(cx * .25)} ${f1((cy + 2) * .25)}) scale(.75)" fill="#4A78C8" stroke="${K}" stroke-width=".6"/>`;
  let u = ''; for (let i = 0; i < 9; i++) { const x = cx - 5 + (i % 3) * 3.4 + (Math.floor(i / 3) % 2) * 1.7, y = cy - 2 + Math.floor(i / 3) * 3; u += `M${f1(x)},${f1(y)}a1.3,1.3 0 0 0 2.6,0`; }
  s += `<path d="${u}" fill="none" stroke="${K}" stroke-width=".45"/>`;
  // head
  s += `<path d="M${cx + 10},${cy - 31} l-2,-4 M${cx + 10},${cy - 31} l0,-4.5 M${cx + 10},${cy - 31} l2,-4" stroke="${K}" stroke-width=".6"/><circle cx="${cx + 8}" cy="${cy - 35}" r=".9" fill="#2C4FA0"/><circle cx="${cx + 10}" cy="${cy - 35.6}" r=".9" fill="#2C4FA0"/><circle cx="${cx + 12}" cy="${cy - 35}" r=".9" fill="#2C4FA0"/>`;
  s += `<path d="M${cx + 12.5},${cy - 27.5} L${cx + 17},${cy - 26} L${cx + 12.5},${cy - 24.6}Z" fill="#E8B83A" stroke="${K}" stroke-width=".4"/>`;
  s += `<circle cx="${cx + 10}" cy="${cy - 27}" r="3.3" fill="#2C4FA0" stroke="${K}" stroke-width=".8"/><circle cx="${cx + 11}" cy="${cy - 27.6}" r="1.1" fill="#F7EBD0"/><circle cx="${cx + 11.2}" cy="${cy - 27.6}" r=".5" fill="${K}"/>`;
  return s;
}
function fo_madhubani() {
  const r = rng(11), K = '#1B1410';
  let s = bg('#E9D2A0');
  let tri = '';
  for (let x = 3; x < 157; x += 5) tri += `M${x},3 L${x + 2.5},8 L${x + 5},3Z M${x},97 L${x + 2.5},92 L${x + 5},97Z`;
  for (let y = 8; y < 92; y += 5) tri += `M3,${y} L8,${y + 2.5} L3,${y + 5}Z M157,${y} L152,${y + 2.5} L157,${y + 5}Z`;
  s += `<path d="${tri}" fill="#C8341F"/><rect x="2.5" y="2.5" width="155" height="95" fill="none" stroke="${K}" stroke-width="1"/>`;
  s += `<rect x="9" y="9" width="142" height="82" fill="#F4E4BC" stroke="${K}" stroke-width="1"/><rect x="10.6" y="10.6" width="138.8" height="78.8" fill="none" stroke="${K}" stroke-width=".5"/>`;
  const fl = U('mfl'), sp = U('msp');
  s += `<defs><g id="${fl}">${[0, 1, 2, 3, 4].map(k => `<circle cx="${f1(2.1 * Math.sin(k * 1.2566))}" cy="${f1(-2.1 * Math.cos(k * 1.2566))}" r="1.2" fill="#C8341F" stroke="${K}" stroke-width=".3"/>`).join('')}<circle r="1.1" fill="#E8B83A" stroke="${K}" stroke-width=".3"/></g>`;
  s += `<g id="${sp}"><path d="M0,2 L0,-2.5 M0,0 q2,-3 4,-1 q-2,1.5 -4,1 M0,-1 q-2,-3 -4,-1 q2,1.5 4,1" fill="#3E7A3A" stroke="${K}" stroke-width=".35"/></g></defs>`;
  let f = '';
  for (let y = 14; y < 89; y += 7.5) for (let x = 14; x < 148; x += 7.5) {
    const X = x + (r() - .5) * 2, Y = y + (r() - .5) * 2;
    if (Math.hypot(X - 125, Y - 62) < 25 && Y < 66) continue;
    if (Math.hypot((X - 58) / 37, (Y - 31) / 13) < 1 || Math.hypot((X - 50) / 37, (Y - 69) / 13) < 1 || Math.hypot(X - 125, Y - 70) < 9) continue;
    const q = r();
    if (q < .55) f += `<use href="#${fl}" x="${f1(X)}" y="${f1(Y)}"/>`;
    else if (q < .85) f += `<use href="#${sp}" x="${f1(X)}" y="${f1(Y)}"/>`;
    else f += `<circle cx="${f1(X)}" cy="${f1(Y)}" r=".9" fill="${K}"/>`;
  }
  s += f;
  s += fo_mfish(54, 31, 76, 15, 1) + fo_mfish(54, 69, 76, 15, -1);
  s += fo_mpeacock(125, 62);
  return s;
}

function fo_gond() {
  const K = '#2A1A12';
  let s = bg('#F5ECD5');
  // ground
  let gr = ''; for (let x = 8; x < 154; x += 3.2) gr += `M${f1(x)},94 l1,-3`;
  s += `<path d="${gr}" stroke="#3E8E55" stroke-width=".8"/>`;
  // trunk
  const tc = U('gtc'), trunk = 'M44,94 C48,82 49,66 47,50 L57,50 C55,66 56,82 62,94Z';
  s += `<defs><clipPath id="${tc}"><path d="${trunk}"/></clipPath></defs><path d="${trunk}" fill="#8A4B2A"/>`;
  let d = ''; for (let y = 52; y < 95; y += 2.6) d += `M40,${f1(y)} q3,-1.4 6,0 t6,0 t6,0 t6,0`;
  s += `<path d="${d}" fill="none" stroke="#F2D9A8" stroke-width=".55" clip-path="url(#${tc})"/><path d="${trunk}" fill="none" stroke="${K}" stroke-width=".9"/>`;
  // leaves
  const angs = [-172, -146, -119, -90, -61, -34, -8], cols = ['#2E8B57', '#E0A526', '#C8452C', '#3B6FB6', '#2E8B57', '#E0A526', '#C8452C'];
  for (const i of [0, 6, 1, 5, 2, 4, 3]) {
    const len = 35 - Math.abs(i - 3) * 2.6, w = len * .27, a = angs[i];
    let tk = '';
    for (let t = .16; t < .88; t += .065) { const x = t * len, hw = w * .78 * Math.sin(Math.PI * Math.pow(t, .85)); tk += `M${f1(x)},0 l2.2,${f1(-hw)} M${f1(x)},0 l2.2,${f1(hw)}`; }
    s += `<g transform="translate(52 49) rotate(${a}) translate(3 0)"><path d="${fo_leafD(len, w)}" fill="${cols[i]}" stroke="${K}" stroke-width=".8"/>`;
    s += `<path d="${tk}" stroke="${K}" stroke-width=".45"/><path d="M1.5,0 L${f1(len * .93)},0" stroke="${K}" stroke-width=".8"/>`;
    s += `<path d="${fo_leafD(len * .9, w * .82)}" transform="translate(${f1(len * .05)} 0)" fill="none" stroke="#FFF6E0" stroke-width="1.1" stroke-dasharray="0 2" stroke-linecap="round"/></g>`;
  }
  // deer
  const O = '#E07A2E', dc = U('gdc');
  const neck = 'M127,57 C131,50 133,44 136,38 L143,40 C140,48 138,56 136,64Z';
  const legs = [[[106, 67], [103, 90]], [[112, 70], [111, 90]], [[125, 70], [124, 90]], [[131, 67], [133, 90]]];
  for (const [a, b] of legs) {
    s += fo_rib([a, [(a[0] * 2 + b[0]) / 3, (a[1] * 2 + b[1]) / 3], [(a[0] + b[0] * 2) / 3, (a[1] + b[1] * 2) / 3], b], t => 3.6 - 1.8 * t, O, ` stroke="${K}" stroke-width=".7"`);
    s += `<path d="M${b[0] - 1.4},${b[1]} h2.8 l-.4,2 h-2Z" fill="${K}"/>`;
  }
  s += `<path d="M100,58 l-4,-5 l1,6Z" fill="${O}" stroke="${K}" stroke-width=".7"/>`;
  s += `<path d="M138,32 L134,21 M135.6,26.4 L130.6,23.6 M134.6,23.4 L131.4,17.6 M134.4,22.6 L137,17 M140.4,32 L143.6,21 M142.6,26 L147.4,23.6 M143.4,22.6 L141.6,16.6 M143.4,22.6 L147.6,18" stroke="${K}" stroke-width="1.1" stroke-linecap="round"/>`;
  s += `<defs><clipPath id="${dc}"><ellipse cx="118" cy="63" rx="19" ry="10"/><path d="${neck}"/><ellipse cx="141" cy="37" rx="6.5" ry="3.8" transform="rotate(18 141 37)"/></clipPath></defs>`;
  s += `<g fill="${O}"><ellipse cx="118" cy="63" rx="19" ry="10"/><path d="${neck}"/><ellipse cx="141" cy="37" rx="6.5" ry="3.8" transform="rotate(18 141 37)"/></g>`;
  let ds = '', row = 0; for (let y = 31; y < 74; y += 2.3, row++) for (let x = 98 + (row % 2) * 1.6; x < 150; x += 3.2) ds += `M${f1(x)},${f1(y)}h1.5`;
  s += `<path d="${ds}" stroke="#7A2E10" stroke-width=".6" clip-path="url(#${dc})"/>`;
  s += `<g fill="none" stroke="${K}" stroke-width=".9"><ellipse cx="118" cy="63" rx="19" ry="10"/><path d="${neck}"/><ellipse cx="141" cy="37" rx="6.5" ry="3.8" transform="rotate(18 141 37)"/></g>`;
  s += `<ellipse cx="118" cy="63" rx="15.5" ry="6.8" fill="none" stroke="#FFF6E0" stroke-width="1.3" stroke-dasharray="0 2.3" stroke-linecap="round"/>`;
  s += `<ellipse cx="136.4" cy="33.4" rx="3.2" ry="1.4" transform="rotate(-35 136.4 33.4)" fill="${O}" stroke="${K}" stroke-width=".7"/><circle cx="142.6" cy="36.2" r="1.3" fill="#FFF6E0" stroke="${K}" stroke-width=".5"/><circle cx="142.8" cy="36.2" r=".55" fill="${K}"/>`;
  // bird on top leaf
  s += `<g transform="translate(117 51)"><path d="M-6,1 C-5,-4 2,-5 4,-2 L7,-3 L5,0 C4,3 0,5 -3,4 L-9,5 L-8,1Z" fill="#3B6FB6" stroke="${K}" stroke-width=".7"/><path d="M-4,1 C-2,-2 1,-2 2,1 C0,2.5 -2,2.5 -4,1Z" fill="#E0A526" stroke="${K}" stroke-width=".4"/><circle cx="2.4" cy="-2" r=".6" fill="${K}"/></g>`;
  return s;
}

function fo_tenango() {
  let defs = '', s = '';
  const pats = {};
  const P = (c, a) => { const k = c + a; if (!pats[k]) { const id = U('tst'); pats[k] = id; defs += `<pattern id="${id}" width="1.25" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(${a})"><rect width=".95" height="4" fill="${c}"/></pattern>`; } return `url(#${pats[k]})`; };
  const weave = U('tw');
  defs += `<pattern id="${weave}" width="2" height="2" patternUnits="userSpaceOnUse"><path d="M0,.5H2M.5,0V2" stroke="#ECE7DB" stroke-width=".35"/></pattern>`;
  s += bg('#F8F6F0') + `<rect width="160" height="100" fill="url(#${weave})"/>`;
  const bird = (x, y, sc, flip, c, c2) => `<g transform="translate(${x} ${y}) scale(${sc * flip} ${sc})"><path d="M-12,4 C-10,-6 0,-8 6,-4 C7,-10 12,-12 15,-9 L19,-8 L15,-6 C14,-2 13,2 10,6 C6,12 -4,12 -8,8 L-21,7 L-22,-1 L-18,-9 L-12,-2Z" fill="${P(c, 70)}"/><path d="M-8,0 C-4,-6 6,-5 6,0 C2,4 -4,4 -8,0Z" fill="${P(c2, 15)}"/><path d="M0,10 l-1,6 M4,10 l1,6" stroke="${c}" stroke-width="1"/><circle cx="12.5" cy="-8.5" r="1" fill="#F8F6F0"/></g>`;
  const deer = (x, y, sc, flip, c) => `<g transform="translate(${x} ${y}) scale(${sc * flip} ${sc})"><path d="M-16,0 C-16,-7 6,-8 11,-5 L15,-14 C16,-17 20,-17 22,-15 L27,-12 L23,-9 L19,-8 L16,1 C14,6 -12,7 -15,3Z" fill="${P(c, 100)}"/><path d="M-12,3 L-13,16 L-11,16 L-9,4Z M-6,5 L-6,17 L-4,17 L-3,5Z M8,4 L9,16 L11,16 L11,3Z M13,2 L15,15 L17,15 L15,0Z M-16,-2 L-20,-7 L-17,1Z M17,-15 L14,-19 L19,-16Z" fill="${P(c, 88)}"/><path d="M18.5,-16 L16,-24 M17,-21 L12.5,-23 M20.5,-16.5 L24,-24 M22.5,-20.5 L27,-22.5" stroke="${c}" stroke-width="1.3" stroke-linecap="round"/><circle cx="20.5" cy="-13.2" r=".9" fill="#F8F6F0"/></g>`;
  const ros = (x, y, R, n, c1, c2, cc) => { let o = ''; for (let k = 0; k < n; k++) { const a = k * 360 / n; o += `<ellipse cx="${x}" cy="${f1(y - R)}" rx="${f1(R * .5)}" ry="${f1(R * .62)}" transform="rotate(${f1(a)} ${x} ${y})" fill="${P(k % 2 ? c2 : c1, a + 90)}"/>`; } return o + `<circle cx="${x}" cy="${y}" r="${f1(R * .5)}" fill="${P(cc, 30)}"/>`; };
  // central plant
  s += `<path d="M80,94 C78,74 82,52 80,32" fill="none" stroke="#2FA35B" stroke-width="1.6"/>`;
  const leaf = (x, y, a, sc, c) => `<path d="${fo_leafD(14, 4.4)}" transform="translate(${x} ${y}) rotate(${a}) scale(${sc})" fill="${P(c, a + 60)}"/>`;
  s += leaf(80, 48, -40, 1, '#2FA35B') + leaf(80, 48, -140, 1, '#2FA35B') + leaf(80, 66, -25, 1.1, '#1E9AA8') + leaf(80, 66, -155, 1.1, '#1E9AA8') + leaf(80, 82, -15, .9, '#2FA35B') + leaf(80, 82, -165, .9, '#2FA35B');
  s += ros(80, 25, 8, 8, '#E03A8C', '#F28C28', '#F2C230');
  s += bird(36, 28, 1.2, 1, '#7A45C2', '#E03A8C') + bird(124, 28, 1.2, -1, '#1E9AA8', '#F2C230');
  s += deer(34, 74, 1.12, 1, '#E8492E') + deer(126, 74, 1.12, -1, '#2F7FD1');
  s += ros(10, 10, 3.2, 6, '#F2C230', '#F2C230', '#E03A8C') + ros(150, 10, 3.2, 6, '#E03A8C', '#E03A8C', '#F2C230') + ros(10, 50, 3, 6, '#2FA35B', '#2FA35B', '#F28C28') + ros(150, 50, 3, 6, '#F28C28', '#F28C28', '#7A45C2');
  s += ros(60, 46, 2.8, 5, '#2F7FD1', '#2F7FD1', '#F2C230') + ros(100, 46, 2.8, 5, '#E8492E', '#E8492E', '#F2C230') + ros(10, 90, 3, 6, '#7A45C2', '#7A45C2', '#F2C230') + ros(150, 90, 3, 6, '#2FA35B', '#2FA35B', '#E03A8C');
  return `<defs>${defs}</defs>` + s;
}

function fo_calavera() {
  const r = rng(5), K = '#1A1714', Pp = '#EFE6D0';
  const [wd, wf] = wob(1.1, .1, 4);
  let g = '';
  let h = ''; for (let y = 9.5; y < 92; y += 2.5) { let x = 8; while (x < 151) { const l = 3 + r() * 14; if (r() > .3) h += `M${f1(x)},${f1(y)}h${f1(Math.min(l, 151 - x))}`; x += l + 1.2 + r() * 3; } }
  g += `<path d="${h}" stroke="${K}" stroke-width=".6" opacity=".6"/>`;
  g += `<rect x="4" y="4" width="152" height="92" fill="none" stroke="${K}" stroke-width="1.6"/><rect x="6.6" y="6.6" width="146.8" height="86.8" fill="none" stroke="${K}" stroke-width=".6"/>`;
  // shoulders / dress
  g += `<path d="M28,96 C32,82 50,74 66,72 L94,72 C110,74 128,82 132,96Z" fill="${K}"/>`;
  let dh = ''; for (let i = 0; i < 9; i++) { const x = 40 + i * 9.5; dh += `M${f1(x)},95 q${f1((x - 80) * .08)},-8 ${f1((x - 80) * .14)},-16`; }
  g += `<path d="${dh}" fill="none" stroke="${Pp}" stroke-width=".7"/>`;
  // ruffle collar
  const zz = []; for (let i = 0; i <= 14; i++) { const x = 60 + i * 40 / 14; zz.push([x, i % 2 ? 80 : 74]); }
  g += `<path d="M60,72 L${pts(zz)} L100,72Z" fill="${Pp}" stroke="${K}" stroke-width=".9"/>`;
  g += `<path d="M75,64 h10 v9 h-10Z" fill="${Pp}" stroke="${K}" stroke-width="1"/><path d="M75,67 h10 M75,70 h10" stroke="${K}" stroke-width=".7"/>`;
  // feathers
  const fe = (P, w) => {
    let o = fo_rib(P, t => w * (.35 + .65 * Math.sin(Math.PI * Math.min(1, .15 + t * .9))), Pp);
    let b = ''; const n = P.length;
    for (let i = 1; i < n - 1; i++) { const a = P[i - 1], c = P[i + 1]; let dx = c[0] - a[0], dy = c[1] - a[1]; const l = Math.hypot(dx, dy); dx /= l; dy /= l; const t = i / (n - 1), hw = w * .5 * (.35 + .65 * Math.sin(Math.PI * Math.min(1, .15 + t * .9))) + 1.2;
      for (const sd of [-1, 1]) b += `M${f1(P[i][0])},${f1(P[i][1])} q${f1(-dy * sd * hw * .6)},${f1(dx * sd * hw * .6)} ${f1(-dy * sd * hw + dx * 3)},${f1(dx * sd * hw + dy * 3)}`; }
    return o + `<path d="${b}" fill="none" stroke="${K}" stroke-width=".55"/>` + `<path d="M${pts(P)}" fill="none" stroke="${K}" stroke-width=".8"/>`;
  };
  g += fe(fo_bez([66, 25], [52, 2], [26, 2], [20, 30], 34), 14) + fe(fo_bez([93, 24], [108, 4], [134, 6], [138, 30], 34), 13);
  // hat
  g += `<path d="M60,33 C60,17 100,17 100,33Z" fill="${K}"/><ellipse cx="80" cy="34" rx="40" ry="7.5" fill="${K}"/>`;
  g += `<path d="M46,35.6 Q80,42 114,35.6 M52,37.8 Q80,42.6 108,37.8" fill="none" stroke="${Pp}" stroke-width=".55"/>`;
  for (const [x, y, rr] of [[69, 27, 3.4], [80, 25, 3.8], [91, 27, 3.4]]) g += `<circle cx="${x}" cy="${y}" r="${rr}" fill="${Pp}" stroke="${K}" stroke-width=".7"/><path d="M${x},${y} m-${f1(rr * .6)},0 a${f1(rr * .6)},${f1(rr * .6)} 0 1 1 ${f1(rr * .6)},${f1(rr * .6)} a${f1(rr * .3)},${f1(rr * .3)} 0 1 1 0,-${f1(rr * .6)}" fill="none" stroke="${K}" stroke-width=".6"/>`;
  // skull
  g += `<path d="M63,40 C64,46 66,51 68,55 L69,63 C74,67 86,67 91,63 L92,55 C94,51 96,46 97,40Z" fill="${Pp}" stroke="${K}" stroke-width="1.4"/>`;
  g += `<path d="M66,41 Q80,45 94,41" fill="none" stroke="${K}" stroke-width=".7"/>`;
  g += `<ellipse cx="72.5" cy="48" rx="4.6" ry="4.4" fill="${K}"/><ellipse cx="87.5" cy="48" rx="4.6" ry="4.4" fill="${K}"/><circle cx="73.5" cy="47" r=".9" fill="${Pp}"/><circle cx="88.5" cy="47" r=".9" fill="${Pp}"/>`;
  g += `<path d="M80,51.5 L77.8,55.6 Q80,56.8 82.2,55.6Z" fill="${K}"/>`;
  g += `<path d="M71,58.5 Q80,61 89,58.5 L89,62 Q80,64.5 71,62Z" fill="${Pp}" stroke="${K}" stroke-width=".9"/><path d="M74,59 v4 M77,59.6 v4.2 M80,59.8 v4.3 M83,59.6 v4.2 M86,59 v4" stroke="${K}" stroke-width=".7"/>`;
  g += `<path d="M66,52 l2,1 M65.6,54.5 l2,.8 M94,52 l-2,1 M94.4,54.5 l-2,.8" stroke="${K}" stroke-width=".6"/>`;
  return `<defs>${wd}</defs>` + bg(Pp) + `<g filter="url(#${wf})">${g}</g>`;
}

function fo_papel() {
  let defs = '', s = bg('#2F95CF') + `<rect y="55" width="160" height="45" fill="#58B6E2"/>`;
  const cols = ['#E8358A', '#F39A1E', '#2DB36B', '#8A3FC4', '#F2D12E', '#E8358A'];
  const W = 27, H = 44;
  const shape = `M0,0 H${W} V${H}` + Array.from({ length: 5 }, () => `a2.7,2.7 0 0 1 -5.4,0`).join('') + 'Z';
  const cut = type => {
    let k = `<path d="${shape}" fill="#fff"/><rect x="3" y="5" width="21" height="33" fill="none" stroke="#000" stroke-width="1.1" stroke-dasharray="3.4 1.3"/>`;
    for (let i = 0; i < 5; i++) k += `<circle cx="${f1(2.7 + i * 5.4)}" cy="${H - .4}" r=".9" fill="#000"/>`;
    k += `<path d="M5,2.4 h17" stroke="#000" stroke-width=".8" stroke-dasharray="1.2 1"/>`;
    if (type === 0) {
      k += `<circle cx="13.5" cy="21.5" r="2.2" fill="#000"/>`;
      for (let a = 0; a < 360; a += 45) k += `<path d="M0,-3.4 C2,-5 1.7,-8.2 0,-9.2 C-1.7,-8.2 -2,-5 0,-3.4Z" transform="translate(13.5 21.5) rotate(${a})" fill="#000"/>`;
      for (let a = 22.5; a < 360; a += 45) k += `<circle cx="${f1(13.5 + 7 * Math.sin(a * Math.PI / 180))}" cy="${f1(21.5 - 7 * Math.cos(a * Math.PI / 180))}" r=".8" fill="#000"/>`;
    } else if (type === 1) {
      for (let rw = 0; rw < 6; rw++) for (let c = 0; c < 4 - (rw % 2); c++) { const x = 7.2 + c * 4.4 + (rw % 2) * 2.2, y = 9 + rw * 5; k += `<path d="M${f1(x)},${y - 1.9} l1.6,1.9 l-1.6,1.9 l-1.6,-1.9Z" fill="#000"/>`; }
    } else {
      k += `<circle cx="13.5" cy="21" r="9.2" fill="#000"/><path d="M8,20 a5.5,5.5 0 0 1 11,0 c0,3 -1.4,4 -2,5 v3 h-7 v-3 c-.6,-1 -2,-2 -2,-5Z" fill="#fff"/>`;
      k += `<circle cx="11.2" cy="20.6" r="1.6" fill="#000"/><circle cx="15.8" cy="20.6" r="1.6" fill="#000"/><path d="M13.5,22.6 l-.9,1.5 h1.8Z M11.6,26 v2 M13.5,26 v2 M15.4,26 v2" fill="#000" stroke="#000" stroke-width=".6"/>`;
      k += `<path d="M5,7 l1.4,1.4 l-1.4,1.4 l-1.4,-1.4Z M22,7 l1.4,1.4 l-1.4,1.4 l-1.4,-1.4Z M5,34 l1.4,1.4 l-1.4,1.4 l-1.4,-1.4Z M22,34 l1.4,1.4 l-1.4,1.4 l-1.4,-1.4Z" fill="#000" transform="translate(.4 -1)"/>`;
    }
    return k;
  };
  const masks = [0, 1, 2].map(t => { const id = U('ppm'); defs += `<mask id="${id}" maskUnits="userSpaceOnUse" x="-2" y="-2" width="32" height="52">${cut(t)}</mask>`; return id; });
  const row = (y0, sag, xs, types, colOff, op) => {
    let o = `<path d="M-4,${y0} Q80,${y0 + sag * 2} 164,${y0}" fill="none" stroke="#F4EFE6" stroke-width=".8"/>`;
    xs.forEach((x, i) => {
      const xc = x + W / 2, yt = y0 + sag * (1 - Math.pow((xc - 80) / 84, 2)) + .3, rot = ((i * 37) % 5 - 2) * .9;
      o += `<g transform="translate(${f1(x)} ${f1(yt)}) rotate(${f1(rot)} ${W / 2} 0)"><path d="${shape}" fill="${cols[(i + colOff) % cols.length]}" fill-opacity="${op}" mask="url(#${masks[types[i % types.length]]})"/><rect width="${W}" height="2.2" fill="#000" opacity=".12" mask="url(#${masks[0]})"/></g>`;
    });
    return o;
  };
  s += row(4, 3, [2, 33.2, 66.5, 99.8, 131], [1, 0, 2, 0, 1], 0, .94);
  s += row(60, 3, [-14, 17.5, 49, 80.5, 112, 143.5], [0, 1, 0, 2, 1, 0], 3, .9);
  return `<defs>${defs}</defs>` + s;
}

function fo_wycin() {
  const B = '#1C1C1C', st = (w = 2.6) => ` stroke="${B}" stroke-width="${w}" stroke-linejoin="round" paint-order="stroke"`;
  let s = bg('#F6F2E7');
  // stem (center)
  let c = `<path d="M80,93 V30" stroke="${B}" stroke-width="4"/><path d="M80,92 V30" stroke="#2E9D48" stroke-width="1.8"/>`;
  // half (left) elements, mirrored
  let h = '';
  const leaf = (x, y, a, len, w) => `<g transform="translate(${x} ${y}) rotate(${a})"><path d="${fo_leafD(len, w)}" fill="#2E9D48"${st(2.4)}/><path d="${fo_leafD(len * .7, w * .38)}" transform="translate(${f1(len * .12)} 0)" fill="#F2B705"/></g>`;
  h += leaf(79, 44, -150, 15, 4.5) + leaf(79, 72, -160, 16, 4.6) + leaf(79, 86, -175, 12, 3.6);
  // corner tulips
  const tul = (x, y, sc, c1, c2) => `<g transform="translate(${x} ${y}) scale(${sc})"><path d="M0,14 V0" stroke="${B}" stroke-width="3"/><path d="M0,13 V0" stroke="#2E9D48" stroke-width="1.2"/>${leaf(0, 10, -40, 8, 2.4)}${leaf(0, 10, -140, 8, 2.4)}<path d="M0,0 C-6,-1 -7,-8 -5,-12 L-2,-8 L0,-13 L2,-8 L5,-12 C7,-8 6,-1 0,0Z" fill="${c1}"${st(2.2)}/><path d="M0,-1 C-3.5,-1.5 -4,-6 -3,-8 L0,-5 L3,-8 C4,-6 3.5,-1.5 0,-1Z" fill="${c2}"/></g>`;
  h += tul(16, 22, 1.15, '#B5267A', '#F2B705') + tul(20, 84, .9, '#1F6FB2', '#C7253E');
  // rooster
  let rr = '';
  const fc = ['#1F6FB2', '#2E9D48', '#C7253E', '#B5267A'], fi = ['#F2B705', '#F2B705', '#F2B705', '#F6F2E7'];
  [[-15, -31], [-25, -25], [-30, -14], [-29, -2]].forEach((e, k) => {
    const p0 = [-8, -1 + k * .8], P = fo_bez(p0, [p0[0] - 3, p0[1] - 7], [e[0] + 5, e[1] + 3], e, 14);
    rr += fo_rib(P, fo_sw(5, .6, .55), fc[k], st(2.2)) + fo_rib(P.slice(3, 13), fo_sw(1.6, .2, .6), fi[k]);
  });
  rr += `<path d="M0,12 L-1,20 l-2.5,1 M-1,20 l2,1 M5,11 L6,20 l-2.5,1 M6,20 l2,1" fill="none" stroke="${B}" stroke-width="1.4" stroke-linecap="round"/>`;
  rr += `<path d="M-10,8 C-4,14 10,12 14,4 C16,-2 14,-8 12,-12 C13,-16 10,-20 6,-19 C3,-18 2,-14 4,-10 C2,-4 -4,-2 -10,-2Z" fill="#C7253E"${st(2.8)}/>`;
  rr += `<ellipse cx="1" cy="3" rx="8" ry="4.6" transform="rotate(-12 1 3)" fill="#F2B705"${st(1.2)}/><ellipse cx="0" cy="3.4" rx="5" ry="2.5" transform="rotate(-12 0 3.4)" fill="#1F6FB2"/><circle cx="-.5" cy="3.6" r="1.2" fill="#2E9D48"/>`;
  rr += `<path d="M10,-6 l2.5,2 M9,-3 l3,1.6" stroke="#F2B705" stroke-width="1.2"/>`;
  rr += `<g fill="#C7253E"${st(1.6)}><circle cx="5" cy="-20.6" r="1.6"/><circle cx="7.6" cy="-21.4" r="1.8"/><circle cx="10.1" cy="-20.4" r="1.5"/><ellipse cx="12.4" cy="-11.6" rx="1.2" ry="1.8"/></g>`;
  rr += `<path d="M12,-17 L16,-15.5 L12,-14Z" fill="#F2B705"${st(1)}/><circle cx="8.6" cy="-16.2" r="1.2" fill="#F6F2E7"/><circle cx="8.8" cy="-16.2" r=".55" fill="${B}"/>`;
  h += `<g transform="translate(46 63) scale(1.05)">${rr}</g>`;
  s += h + `<g transform="translate(160 0) scale(-1 1)">${h}</g>` + c;
  // flowers on stem
  const fl = (x, y, R, cs) => `<path d="${fo_scal(x, y, R, 12)}" fill="${cs[0]}"${st(2.4)}/><path d="${fo_scal(x, y, R * .66, 10)}" fill="${cs[1]}"/><path d="${fo_scal(x, y, R * .42, 8)}" fill="${cs[2]}"/><circle cx="${x}" cy="${y}" r="${f1(R * .2)}" fill="${cs[3]}"/>`;
  s += fl(80, 22, 13, ['#C7253E', '#F2B705', '#1F6FB2', '#F6F2E7']) + fl(80, 57, 8.5, ['#B5267A', '#F2B705', '#2E9D48', '#C7253E']);
  return s;
}

function fo_jianzhi() {
  const m = U('jzm'), cx = 80, cy = 50, Bk = '#000';
  let k = '';
  const P = []; for (let i = 0; i < 96; i++) { const a = i / 96 * 2 * Math.PI, R = i % 2 ? 41.6 : 44; P.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]); }
  k += `<polygon points="${pts(P)}" fill="#fff"/>`;
  k += `<circle cx="${cx}" cy="${cy}" r="39" fill="none" stroke="${Bk}" stroke-width="1.3" stroke-dasharray="10.6 1.6"/>`;
  const cres = 'M-2.6,0 Q0,4.6 2.6,0 Q0,1.8 -2.6,0Z';
  for (let i = 0; i < 20; i++) k += `<path d="${cres}" transform="translate(${cx} ${cy}) rotate(${i * 18}) translate(0 33.5)" fill="${Bk}"/><circle cx="${f1(cx + 35 * Math.cos((i * 18 + 99) * Math.PI / 180))}" cy="${f1(cy + 35 * Math.sin((i * 18 + 99) * Math.PI / 180))}" r=".9" fill="${Bk}"/>`;
  k += `<circle cx="${cx}" cy="${cy}" r="29" fill="none" stroke="${Bk}" stroke-width="1.1" stroke-dasharray="8.5 1.6"/>`;
  for (let i = 0; i < 8; i++) {
    k += `<g transform="translate(${cx} ${cy}) rotate(${i * 45 + 22.5})"><path d="${fo_petalD(10.5, 27, 12)}" fill="${Bk}"/><path d="M0,-11 V-26 M0,-15 l3.2,-3 M0,-15 l-3.2,-3 M0,-19.5 l3.3,-3 M0,-19.5 l-3.3,-3" stroke="#fff" stroke-width="1"/></g>`;
    k += `<g transform="translate(${cx} ${cy}) rotate(${i * 45})"><circle cx="0" cy="-23.5" r="1.4" fill="${Bk}"/><path d="${cres}" transform="translate(0 -16) scale(.7)" fill="${Bk}"/></g>`;
  }
  k += `<circle cx="${cx}" cy="${cy}" r="8.6" fill="none" stroke="${Bk}" stroke-width="1" stroke-dasharray="4 1.2"/>`;
  for (let i = 0; i < 6; i++) k += `<path d="${cres}" transform="translate(${cx} ${cy}) rotate(${i * 60}) translate(0 4.6) scale(.6)" fill="${Bk}"/>`;
  k += `<circle cx="${cx}" cy="${cy}" r="1.4" fill="${Bk}"/>`;
  // corner cuts
  const cp = [[0, 0]]; for (let i = 0; i <= 30; i++) { const a = i / 30 * Math.PI / 2, R = i % 2 ? 22.4 : 24.5; cp.push([R * Math.cos(a), R * Math.sin(a)]); }
  let corner = `<polygon points="${pts(cp)}" fill="#fff"/><path d="M19.5,0 A19.5,19.5 0 0 1 0,19.5" fill="none" stroke="${Bk}" stroke-width="1" stroke-dasharray="4 1.2"/>`;
  for (const a of [12, 34, 56, 78]) corner += `<path d="${cres}" transform="rotate(${a - 90}) translate(0 13.5) scale(.8)" fill="${Bk}"/>`;
  for (const a of [23, 45, 67]) corner += `<circle cx="${f1(14 * Math.cos(a * Math.PI / 180))}" cy="${f1(14 * Math.sin(a * Math.PI / 180))}" r=".9" fill="${Bk}"/>`;
  corner += `<path d="${fo_petalD(2, 9.5, 4.4)}" transform="rotate(135)" fill="${Bk}"/><path d="${fo_petalD(2, 8, 3.6)}" transform="rotate(105)" fill="${Bk}"/><path d="${fo_petalD(2, 8, 3.6)}" transform="rotate(165)" fill="${Bk}"/>`;
  k += [[3, 3, 1, 1], [157, 3, -1, 1], [3, 97, 1, -1], [157, 97, -1, -1]].map(([x, y, a, b]) => `<g transform="translate(${x} ${y}) scale(${a} ${b})">${corner}</g>`).join('');
  const red = '#C8102E';
  return `<defs><mask id="${m}" maskUnits="userSpaceOnUse" x="-5" y="-5" width="170" height="110">${k}</mask></defs>` + bg('#F3EADB') +
    `<g transform="translate(.9 1.3)"><rect width="160" height="100" fill="#5A1F14" opacity=".28" mask="url(#${m})"/></g><rect width="160" height="100" fill="${red}" mask="url(#${m})"/>`;
}

function fo_rosemaling() {
  const CR = '#ECDDB4', OC = '#D9A441', SH = '#9A3D26', BL = '#5C8DB0', GR = '#7C9A4E', RD = '#B23A2E';
  let s = bg('#7A2C1F');
  let bd = ''; for (let x = 10; x < 152; x += 6) bd += `M${x},3 q1.5,1.6 3,0 M${x},97 q1.5,-1.6 3,0`;
  s += `<path d="${bd}" fill="none" stroke="#E2B85C" stroke-width=".7"/>`;
  s += `<rect x="6" y="6" width="148" height="88" rx="9" fill="#1F4C56"/><rect x="9" y="9" width="142" height="82" rx="7" fill="none" stroke="${CR}" stroke-width="1" stroke-dasharray="0 2.6" stroke-linecap="round"/>`;
  const comma = (x, y, a, l, w, c) => fo_rib(fo_bez([x, y], [x + l * .4 * Math.cos(a), y + l * .4 * Math.sin(a)], [x + l * .8 * Math.cos(a + .5), y + l * .8 * Math.sin(a + .5)], [x + l * Math.cos(a + .9), y + l * Math.sin(a + .9)], 8), t => w * (1 - t) + .2, c);
  let h = '';
  // big C scroll
  const sp = fo_spiral(46, 50, 27, 6, 62, 415, 44);
  h += fo_rib(sp, t => .6 + 7.5 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.02)), .7) * (1 - .4 * t), SH);
  const sp2 = fo_spiral(46, 49.3, 27.6, 6.3, 62, 412, 44);
  h += fo_rib(sp2, t => .4 + 5.2 * Math.pow(Math.sin(Math.PI * t), .75) * (1 - .4 * t), OC);
  h += fo_rib(fo_spiral(46, 50, 31.4, 18, 95, 300, 30), fo_sw(1.1, .1, .7), CR);
  h += fo_rib(fo_spiral(46, 50, 23.5, 9, 120, 330, 30), fo_sw(.8, .1, .7), CR);
  // acanthus leaf up-left
  const ac = fo_bez([74, 45], [70, 30], [62, 17], [47, 18], 22);
  h += fo_rib(ac, fo_sw(7, .4, .55), BL) + fo_rib(ac.slice(2, 20), fo_sw(1.1, .1, .6), CR);
  h += comma(66, 30, 3.6, 8, 2.4, BL) + comma(60, 22, 3.9, 6, 1.8, CR);
  // low leaves
  const lw = fo_bez([72, 62], [68, 72], [60, 82], [50, 84], 16);
  h += fo_rib(lw, fo_sw(5, .3, .6), GR) + fo_rib(lw.slice(2, 14), fo_sw(.9, .1, .6), CR);
  h += comma(30, 76, -1.2, 9, 2.6, RD) + comma(20, 30, 1.4, 8, 2.4, RD) + comma(36, 14, .2, 7, 2, CR) + comma(24, 66, 4.2, 6, 1.8, CR);
  h += `<g fill="${CR}"><circle cx="16" cy="18" r="1.2"/><circle cx="19" cy="15.4" r="1"/><circle cx="14" cy="21.6" r=".9"/><circle cx="62" cy="88" r="1"/><circle cx="66" cy="86.6" r=".8"/></g>`;
  s += h + `<g transform="translate(160 0) scale(-1 1)">${h}</g>`;
  // tulip bud top
  s += `<path d="M80,38 V24" stroke="${GR}" stroke-width="1.6"/>` + `<path d="M80,26 C74,25 73,18 75,14 L78,17 L80,12 L82,17 L85,14 C87,18 86,25 80,26Z" fill="${RD}"/><path d="M77.5,22 q2.5,-6 2.5,-8 M82.5,22 q-2.5,-6 -2.5,-8" fill="none" stroke="${CR}" stroke-width=".7"/>`;
  // rose
  s += `<circle cx="80" cy="53" r="12" fill="${RD}"/><circle cx="80" cy="51.5" r="8" fill="#8A2A22"/>`;
  const arc = (r0, a0, a1, w) => fo_rib(fo_spiral(80, 53, r0, r0, a0, a1, 16), fo_sw(w, .1, .6), CR);
  s += arc(10.3, 200, 340, 1.8) + arc(6.2, 20, 160, 1.5) + arc(3.6, 210, 330, 1.1) + arc(10.6, 30, 80, 1) + arc(10.6, 100, 150, 1);
  s += `<g fill="#E2B85C"><circle cx="80" cy="53" r="1.4"/><circle cx="77.4" cy="54" r=".8"/><circle cx="82.6" cy="54" r=".8"/></g>`;
  s += fo_rib(fo_bez([80, 66], [76, 72], [84, 76], [80, 84], 12), fo_sw(2.4, .2, .7), OC);
  return s;
}

function fo_fraktur() {
  const r = rng(9), K = '#161210', RD = '#C8302B', YE = '#E9B627', BL = '#2B4C8C', GN = '#3E7D3A', CRM = '#F3EAD3';
  let s = bg('#9E2B25');
  let bd = ''; for (let x = 0; x < 160; x += 11 + r() * 2) bd += `M${f1(x)},0V100`;
  s += `<path d="${bd}" stroke="#7A1E1A" stroke-width=".9"/>`;
  let nz = ''; for (let i = 0; i < 40; i++) nz += `M${f1(r() * 160)},${f1(r() * 100)}v${f1(2 + r() * 6)}`;
  s += `<path d="${nz}" stroke="#B5403A" stroke-width=".5" opacity=".7"/>`;
  // hex sign
  const cx = 80, cy = 50;
  s += `<circle cx="${cx}" cy="${cy}" r="41" fill="${K}" opacity=".25" transform="translate(1 1.4)"/><circle cx="${cx}" cy="${cy}" r="40" fill="${BL}" stroke="${K}" stroke-width="1"/>`;
  for (let i = 0; i < 24; i++) { const a = i * 15 * Math.PI / 180; s += `<circle cx="${f1(cx + 35.4 * Math.cos(a))}" cy="${f1(cy + 35.4 * Math.sin(a))}" r="3.4" fill="${CRM}"/>`; }
  s += `<circle cx="${cx}" cy="${cy}" r="35.4" fill="${CRM}"/><circle cx="${cx}" cy="${cy}" r="32.5" fill="none" stroke="${K}" stroke-width=".6"/>`;
  for (let i = 0; i < 8; i++) s += `<g transform="translate(${cx} ${cy}) rotate(${i * 45 + 22.5})"><path d="M0,0 Q4,-12 0,-21 Q-4,-12 0,0Z" fill="${GN}" stroke="${K}" stroke-width=".5"/></g>`;
  for (let i = 0; i < 8; i++) s += `<g transform="translate(${cx} ${cy}) rotate(${i * 45})"><path d="M0,0 Q7.5,-15 0,-31Z" fill="${i % 2 ? YE : RD}"/><path d="M0,0 Q-7.5,-15 0,-31Z" fill="${i % 2 ? RD : YE}"/><path d="M0,0 Q7.5,-15 0,-31 Q-7.5,-15 0,0Z" fill="none" stroke="${K}" stroke-width=".6"/></g>`;
  s += `<circle cx="${cx}" cy="${cy}" r="5" fill="${BL}" stroke="${K}" stroke-width=".6"/><circle cx="${cx}" cy="${cy}" r="1.8" fill="${CRM}"/>`;
  // distelfinks on tulip branches
  const bird = `<path d="M-10,2 C-8,-6 2,-8 6,-6 C8,-11 13,-11 14,-7 L18,-6 L14,-4 C14,2 8,8 0,8 C-4,8 -6,6 -8,5 L-18,11 L-15,5 L-19,0Z" fill="${YE}" stroke="${K}" stroke-width=".7"/><path d="M-6,1 C-3,-5 5,-4 6,0 C3,3 -2,4 -6,1Z" fill="${RD}" stroke="${K}" stroke-width=".5"/><path d="M-3,0 q2,-2 4,0 M0,1 q2,-2 4,0" fill="none" stroke="${YE}" stroke-width=".6"/><path d="M6.5,-7 C8,-11 13,-11 14,-7 C11,-8.4 9,-8 6.5,-7Z" fill="${RD}"/><circle cx="11.6" cy="-7.6" r=".9" fill="${K}"/><path d="M-12,4 l-5,4 M-12,2 l-6,1" stroke="${BL}" stroke-width="1"/>`;
  const tulip = `<path d="M0,0 C-6,-2 -7,-9 -5,-13 L-2,-9 L0,-14 L2,-9 L5,-13 C7,-9 6,-2 0,0Z" fill="${RD}" stroke="${K}" stroke-width=".6"/><path d="M0,-2 C-2,-4 -2,-8 0,-10 C2,-8 2,-4 0,-2Z" fill="${YE}"/>`;
  const branch = `<path d="M4,46 C10,36 6,26 16,18" fill="none" stroke="${GN}" stroke-width="1.6"/><path d="${fo_leafD(9, 3)}" transform="translate(8 36) rotate(20)" fill="${GN}" stroke="${K}" stroke-width=".4"/><path d="${fo_leafD(8, 2.6)}" transform="translate(7 30) rotate(200)" fill="${GN}" stroke="${K}" stroke-width=".4"/><path d="${fo_leafD(8, 2.6)}" transform="translate(5 44) rotate(150)" fill="${GN}" stroke="${K}" stroke-width=".4"/><g transform="translate(16 18) scale(.75)">${bird}</g>`;
  s += `<g transform="translate(2 32)">${branch}</g><g transform="translate(158 32) scale(-1 1)">${branch}</g>`;
  s += `<g transform="translate(20 22) scale(.7)">${tulip}</g><g transform="translate(140 22) scale(.7)">${tulip}</g>`;
  return s;
}

function fo_ovD(cx, cy, w, h) {
  const l = cx - w / 2, r = cx + w / 2, t = cy - h / 2, b = cy + h / 2;
  return `M${f1(l)},${f1(cy)} C${f1(l)},${f1(t)} ${f1(cx - w * .3)},${f1(t)} ${f1(cx)},${f1(t)} C${f1(cx + w * .3)},${f1(t)} ${f1(r)},${f1(t)} ${f1(r)},${f1(cy)} C${f1(r)},${f1(b + h * .06)} ${f1(cx + w * .3)},${f1(b)} ${f1(cx)},${f1(b - h * .13)} C${f1(cx - w * .3)},${f1(b)} ${f1(l)},${f1(b + h * .06)} ${f1(l)},${f1(cy)}Z`;
}
function fo_U(cx, t, w, h, th, f, bgc, rot = 0) {
  const l = cx - w / 2, r = cx + w / 2, b = t + h;
  const o = `M${f1(l)},${f1(t)} C${f1(l)},${f1(b + h * .16)} ${f1(r)},${f1(b + h * .16)} ${f1(r)},${f1(t)}Z`;
  const i = `M${f1(l + th * .3)},${f1(t - .6)} C${f1(l + th * 1.15)},${f1(b - th * 1.1 + h * .16)} ${f1(r - th * 1.15)},${f1(b - th * 1.1 + h * .16)} ${f1(r - th * .3)},${f1(t - .6)}Z`;
  return `<g transform="rotate(${rot} ${cx} ${t + h / 2})"><path d="${o}" fill="${f}"/><path d="${i}" fill="${bgc}"/></g>`;
}
function fo_formline() {
  const C = '#EEE4CD', B = '#151312', R = '#B3261E', G = '#3F7D78';
  let s = bg(C);
  const ov = (cx, cy, w, h, f) => `<path d="${fo_ovD(cx, cy, w, h)}" fill="${f}"/>`;
  const eye = (cx, cy, w, h) => ov(cx, cy, w, h, B) + `<path d="${fo_ovD(cx, cy + h * .04, w * .76, h * .56)}" fill="none" stroke="${C}" stroke-width="${f1(Math.max(.8, h * .08))}"/>`;
  // red U-forms cradling the eye ovoids
  s += fo_U(50, 42, 50, 20, 5.5, R, C) + fo_U(110, 42, 50, 20, 5.5, R, C);
  // big eye ovoids
  for (const x of [50, 110]) s += ov(x, 31, 50, 34, B) + ov(x, 33.6, 41, 25, C) + eye(x, 33, 26, 15);
  // inverted red split U between the eyes
  s += fo_U(80, 7, 16, 30, 4.6, R, C, 180) + `<path d="M80,10 C83,14 83,19 80,22 C77,19 77,14 80,10Z" fill="${C}"/>`;
  // lower center: black U holding a red ovoid
  s += fo_U(80, 50, 38, 40, 7, B, C) + ov(80, 67, 18, 12, R) + `<path d="${fo_ovD(80, 67.6, 11, 6.4)}" fill="${C}"/>` + ov(80, 67.6, 7, 3.6, G);
  // lower corners: black U-forms with blue-green ovoids, red split U
  for (const [x, r] of [[26, 1], [134, -1]]) {
    s += fo_U(x, 64, 36, 26, 6, B, C) + ov(x, 74, 16, 9, G) + `<path d="${fo_ovD(x, 74.4, 9, 4.4)}" fill="${C}"/>`;
    s += fo_U(x + r * 27, 56, 17, 32, 6.5, R, C);
  }
  s += `<rect x="4" y="4" width="152" height="92" rx="10" fill="none" stroke="${B}" stroke-width="3.4"/>`;
  return s;
}

function fo_dots() {
  const r = rng(31), D = '#2A1810';
  let s = bg('#3A1F14');
  const bcols = ['#9C5A33', '#C27A3E', '#6E3A24', '#B5442A', '#D9A440', '#8A4A2C'];
  const wa = U('dwa'), wb2 = U('dwb');
  let rows = '<defs>';
  for (const [id, ph] of [[wa, 1.6], [wb2, -1.6]]) { let d = 'M-4,0'; for (let x = -4; x < 166; x += 6) d += ` Q${f1(x + 1.5)},${ph} ${f1(x + 3)},0 T${f1(x + 6)},0`; rows += `<path id="${id}" d="${d}" fill="none" stroke-width="1.5" stroke-dasharray="0 3" stroke-linecap="round"/>`; }
  rows += '</defs>';
  for (let k = 0, y = 2; y < 102; y += 3.1, k++) rows += `<use href="#${k % 2 ? wa : wb2}" y="${f1(y)}" stroke="${bcols[Math.floor(k / 3) % bcols.length]}"/>`;
  s += rows;
  const sites = [[38, 36, 5], [124, 28, 4], [100, 76, 5]];
  const path = (a, b, bend) => { const mx = (a[0] + b[0]) / 2 + bend[0], my = (a[1] + b[1]) / 2 + bend[1]; return `M${a[0]},${a[1]} Q${f1(mx)},${f1(my)} ${b[0]},${b[1]}`; };
  for (const p of [path(sites[0], sites[2], [-14, 10]), path(sites[2], sites[1], [14, 4]), path(sites[0], sites[1], [6, -18])]) {
    s += `<path d="${p}" fill="none" stroke="${D}" stroke-width="7.5"/><path d="${p}" fill="none" stroke="#F3E9D2" stroke-width="1.7" stroke-dasharray="0 3" stroke-linecap="round" transform="translate(0 -1.8)"/><path d="${p}" fill="none" stroke="#D9A440" stroke-width="1.7" stroke-dasharray="0 3" stroke-linecap="round" transform="translate(0 1.8)"/>`;
  }
  const rc = ['#F3E9D2', '#D9A440', '#B5442A', '#F3E9D2', '#D9A440'];
  for (const [x, y, n] of sites) {
    s += `<circle cx="${x}" cy="${y}" r="${n * 3 + 2.2}" fill="${D}"/><circle cx="${x}" cy="${y}" r="2.6" fill="#D9A440"/>`;
    for (let i = 1; i <= n; i++) { const R = i * 3 + .4, c = 2 * Math.PI * R, m = Math.max(6, Math.round(c / 2.9)); s += `<circle cx="${x}" cy="${y}" r="${f1(R)}" fill="none" stroke="${rc[i - 1]}" stroke-width="1.6" stroke-dasharray="0 ${(c / m).toFixed(3)}" stroke-linecap="round"/>`; }
  }
  // scattered white dot clusters in the field
  let sc = ''; for (let i = 0; i < 26; i++) { const x = r() * 160, y = r() * 100; if (sites.some(([a, b, n]) => Math.hypot(x - a, y - b) < n * 3 + 6)) continue; sc += `M${f1(x)},${f1(y)}h.01`; }
  s += `<path d="${sc}" stroke="#F3E9D2" stroke-width="1.7" stroke-linecap="round"/>`;
  return s;
}

function fo_alebrije() {
  const pd = U('ad'), ps = U('as'), pz = U('az'), pc = U('ac');
  let defs = `<pattern id="${pd}" width="3.4" height="3.4" patternUnits="userSpaceOnUse"><circle cx="1.7" cy="1.7" r=".75" fill="#FFE14D"/></pattern>`;
  defs += `<pattern id="${ps}" width="2.8" height="2.8" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><rect width="1" height="2.8" fill="#5A1F8C"/></pattern>`;
  defs += `<pattern id="${pz}" width="4" height="3" patternUnits="userSpaceOnUse"><path d="M0,2.4 L1,.6 L2,2.4 L3,.6 L4,2.4" fill="none" stroke="#FF3D9A" stroke-width=".7"/></pattern>`;
  defs += `<pattern id="${pc}" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.1" fill="none" stroke="#FFF4D6" stroke-width=".5"/></pattern>`;
  const two = (d, c, p, extra = '') => `<path d="${d}" fill="${c}"${extra}/><path d="${d}" fill="url(#${p})"/>`;
  let s = bg('#2B2347') + `<ellipse cx="80" cy="91" rx="52" ry="4" fill="#1A1530"/>`;
  // back wing
  s += two('M74,46 C66,30 52,16 34,12 C40,20 38,24 42,26 C38,28 38,32 44,34 C40,36 42,40 50,42Z', '#168C96', pc);
  // tail spiral
  const tp = fo_spiral(38, 46, 17, 4, 36, 380, 34);
  const rib = (P, wf, c, p, o = '') => { const a = fo_rib(P, wf, c, o); return a + a.replace(`fill="${c}"${o}`, `fill="url(#${p})"`); };
  s += rib(tp, t => 7 - 5.5 * t, '#3BC14A', pd, ` stroke="#FFE14D" stroke-width=".6"`);
  // back legs
  const leg = (a, b) => rib(fo_bez(a, [a[0] + (b[0] - a[0]) * .3, a[1] + (b[1] - a[1]) * .4], [b[0], b[1] - 8], b, 10), t => 6.5 - 2.4 * t, '#FFD23F', ps) + `<ellipse cx="${b[0] + 1}" cy="${b[1] + 1}" rx="4.4" ry="2.2" fill="#1EC8C8"/><path d="M${b[0] + 3},${b[1] + 1} l2.4,.6 M${b[0] + 3},${b[1] + 2.4} l2,1" stroke="#FFF4D6" stroke-width=".6"/>`;
  s += leg([60, 64], [50, 86]) + leg([96, 64], [94, 87]);
  // body
  s += `<ellipse cx="80" cy="58" rx="29" ry="13" fill="#E8227A" stroke="#FFE14D" stroke-width="1"/><ellipse cx="80" cy="58" rx="29" ry="13" fill="url(#${pd})"/>`;
  s += two('M53,61 C62,72 98,72 107,61 C98,67 62,67 53,61Z', '#FFD23F', pz);
  let sp = ''; for (let x = 62; x < 98; x += 5) { const y = 45.4 + Math.pow((x - 80) / 29, 2) * 9; sp += `M${x},${f1(y + 1)} l2.4,-4 l2.4,4Z`; }
  s += `<path d="${sp}" fill="#1EC8C8" stroke="#FFF4D6" stroke-width=".4"/>`;
  s += leg([68, 66], [64, 88]) + leg([102, 62], [108, 86]);
  // neck + head
  s += two('M96,50 C102,44 104,40 106,36 L116,42 C112,48 108,56 102,64Z', '#FF8A1E', ps);
  // horns
  s += fo_rib(fo_bez([105, 30], [100, 22], [92, 20], [94, 12], 14), t => 4 - 3 * t, '#8A3FC4', ` stroke="#FFE14D" stroke-width=".5"`);
  s += fo_rib(fo_bez([114, 29], [118, 22], [126, 20], [124, 11], 14), t => 4 - 3 * t, '#8A3FC4', ` stroke="#FFE14D" stroke-width=".5"`);
  s += `<path d="M103,34 L97,30 L104,29Z" fill="#FF3D9A" stroke="#FFE14D" stroke-width=".5"/>`;
  s += `<circle cx="111" cy="38" r="11" fill="#FF8A1E" stroke="#1EC8C8" stroke-width="1"/><circle cx="111" cy="38" r="11" fill="url(#${pz})"/>`;
  s += `<path d="M118,46 C124,48 128,46 130,42 C126,43 122,43 119,42Z" fill="#B3123E"/><path d="M124,46 C128,50 132,52 134,49" fill="none" stroke="#FF3D9A" stroke-width="1.6" stroke-linecap="round"/>`;
  s += `<ellipse cx="121" cy="40.5" rx="7.4" ry="4.4" fill="#1EC8C8" stroke="#FFE14D" stroke-width=".8"/><ellipse cx="121" cy="40.5" rx="7.4" ry="4.4" fill="url(#${pc})"/><circle cx="126.4" cy="39.4" r=".8" fill="#2B2347"/>`;
  s += `<path d="M120,44.4 l1,2 l1,-2 M123,44.2 l1,2 l1,-2" fill="#FFF4D6"/>`;
  s += `<circle cx="109.6" cy="34.4" r="4.4" fill="#FFF4D6" stroke="#2B2347" stroke-width=".6"/><circle cx="110.6" cy="34.6" r="2.5" fill="#3BC14A"/><circle cx="110.9" cy="34.6" r="1.2" fill="#111"/><circle cx="111.6" cy="33.8" r=".5" fill="#fff"/>`;
  // front wing
  s += two('M84,47 C80,28 70,12 52,4 C58,13 56,16 61,19 C56,21 57,25 63,27 C59,30 62,33 69,35 C66,38 70,42 76,44Z', '#1EC8C8', pz, ` stroke="#FFE14D" stroke-width=".8"`);
  s += `<path d="M82,45 L56,8 M80,44 L62,22 M79,44 L66,31" fill="none" stroke="#FFE14D" stroke-width=".8"/>`;
  return `<defs>${defs}</defs>` + s;
}

pool.groups.push({
  id: 'folkart', title: 'Folk art traditions', slot: 'Folk tradition',
  intro: 'Living art traditions with their own communities, materials and meanings. Name the tradition and the people it comes from, describe its visual language (line, pattern, palette, layout), and borrow that language rather than copying specific works or sacred designs.',
  terms: [
    { id: 'madhubani', name: 'Madhubani', aka: 'Mithila painting',
      when: 'on paper since the 1960s (on walls for centuries) · Mithila, Bihar, India', y: 1966,
      desc: 'Painting from the Mithila region of Bihar, made for generations by women on the mud walls of their homes for weddings and festivals, and on paper since the 1960s. Every figure gets a double outline and every gap is filled with pattern, so the picture feels dense, joyful and ceremonial.',
      spot: 'double black outlines, no empty background, fish, peacocks, lotus and suns, borders of triangles or vines, hatched and patterned fills, flat red, turmeric yellow, indigo and leaf green',
      ref: 'Sita Devi, Ganga Devi, Mahasundari Devi, the Mithila Art Institute (Madhubani)',
      prompt: 'Madhubani (Mithila) painting style: double black ink outlines, every gap filled with hatching and tiny flowers, stylized fish and peacock, flat red, turmeric yellow, indigo and green, triangle border',
      ex: sv(fo_madhubani()) },
    { id: 'gond', name: 'Gond art', aka: 'Gond painting, Pardhan Gond art',
      when: 'on paper since the 1980s (rooted in wall and floor art) · Madhya Pradesh, India', y: 1981,
      desc: 'Painting by the Pardhan Gond community of central India, carried from house walls onto paper and canvas by Jangarh Singh Shyam in the 1980s. Animals and trees are drawn as bold flat silhouettes and then filled with rhythmic dots, dashes and lines, so they seem to hum with life.',
      spot: 'flat silhouettes of deer, birds, fish and trees, insides packed with dots, dashes, seed and fish-bone patterns, dotted inner contours, bright flat colors on a plain ground, no shading or perspective',
      ref: 'Jangarh Singh Shyam, The London Jungle Book (Bhajju Shyam), The Night Life of Trees (Tara Books)',
      prompt: 'Gond art style: flat silhouettes of a deer and a tree, filled with rhythmic dots, dashes and fine lines, bright orange, green, yellow and blue on cream, no shading',
      ex: sv(fo_gond()) },
    { id: 'tenango', name: 'Tenango embroidery', aka: 'Tenangos, Otomí (Hñähñu) embroidery',
      when: 'since the 1960s · Otomí communities around Tenango de Doria, Hidalgo, Mexico', y: 1960,
      desc: 'Hand embroidery from the Otomí villages of the Sierra Otomí-Tepehua, where deer, birds, rabbits and flowering plants are stitched in dense satin stitch on white cotton, in a single bold color or a rainbow. The designs are a community heritage, so borrow the look (flat stitched silhouettes, symmetry, color) rather than copying a real piece.',
      spot: 'flat animal and plant silhouettes with no outlines, visible parallel satin stitches, white cotton ground, roughly mirrored layout, each figure one solid color, often a rainbow of figures or all one color',
      ref: 'Tenango de Doria and San Nicolás embroiderers, Otomí textile cooperatives of Hidalgo',
      prompt: 'Tenango Otomí embroidery style: flat satin-stitched silhouettes of deer, birds and flowers on white cotton, visible thread direction, rainbow of solid colors, mirrored folk layout, no outlines',
      ex: sv(fo_tenango()) },
    { id: 'calavera', name: 'Calavera print', aka: 'Posada calaveras, La Catrina',
      when: '1890s–1913 · Mexico City', y: 1890,
      desc: 'Cheap satirical broadsheet prints by José Guadalupe Posada showing skeletons dressed as fine ladies, dandies and politicians, a cheerful reminder that death comes for everyone. His elegant skeleton lady, La Catrina, became the face of Día de Muertos.',
      spot: 'grinning skulls in fancy hats and clothes, black ink on cheap off-white paper, cut lines and hatching from relief plates, slightly rough wobbly edges, dancing skeletons, bold black and white',
      ref: 'José Guadalupe Posada (La Calavera Catrina, c. 1910), Manuel Manilla, Diego Rivera (Dream of a Sunday Afternoon in the Alameda)',
      prompt: 'In the manner of José Guadalupe Posada: calavera relief print, grinning skeleton lady in a wide feathered hat, black ink on off-white newsprint, bold cut lines and hatching',
      ex: sv(fo_calavera()) },
    { id: 'papelpicado', name: 'Papel picado', aka: 'perforated paper banners',
      when: 'since the 1800s · Mexico (famously San Salvador Huixcolotla, Puebla)', y: 1800,
      desc: 'Mexican banners of colored tissue paper with lace-like designs chiseled through stacks of sheets, strung across streets, churches and altars for fiestas and Día de Muertos. The light shines through the holes, so the effect is bright, fluttering and festive.',
      spot: 'rows of rectangular tissue flags on a string, hot pink, orange, green, purple and yellow, symmetrical cut-out flowers, skulls and lattices, cut frame borders, scalloped bottom edges, sky showing through the holes',
      ref: 'Huixcolotla papel picado artisans, Día de Muertos ofrendas, Mexican fiesta streets',
      prompt: 'Papel picado style: strings of bright tissue paper banners in hot pink, orange, green and purple, intricate symmetrical cut-out flowers, skulls and lattices, scalloped edges, blue sky showing through',
      ex: sv(fo_papel()) },
    { id: 'wycinanki', name: 'Wycinanki', aka: 'Polish paper-cut, Łowicz paper-cut',
      when: 'since the mid-1800s · Łowicz and Kurpie regions, Poland', y: 1850,
      desc: 'Polish folk paper-cutting, first done with sheep shears to brighten cottage walls and beams for Easter. Łowicz cuts stack layer upon layer of glossy colored paper into mirror-symmetric roosters, birds and flower trees, while Kurpie cuts are single-color silhouettes.',
      spot: 'perfect mirror symmetry, roosters or peacocks facing a central flower tree, small layers of red, yellow, blue, green and magenta stacked on a dark base shape, scalloped flowers, white background',
      ref: 'Łowicz wycinanki (leluja and kodra designs), Kurpie forest silhouettes, Ethnographic Museum in Kraków',
      prompt: 'Polish wycinanki paper-cut style: mirror-symmetric roosters facing a flower tree, stacked layers of glossy red, yellow, blue, green and magenta paper on a dark base, crisp scissor-cut edges, white background',
      ex: sv(fo_wycin()) },
    { id: 'jianzhi', name: 'Chinese paper-cut', aka: 'jianzhi, window flowers (chuanghua)',
      when: 'since at least the 500s · China', y: 500,
      desc: 'Designs cut from a single sheet of red paper, often folded so the pattern repeats in perfect symmetry, and pasted on windows and doors for Spring Festival and weddings. Lucky subjects such as fish, peonies, zodiac animals and characters like 福 (good fortune) are held together by a lace of crescent and sawtooth cuts.',
      spot: 'one bright red on white or gold, radial or mirror symmetry, round window-flower shape, tiny crescent and sawtooth cuts, every part linked by thin bridges, lucky animals, flowers and characters',
      ref: 'Yu County and Ansai paper-cuts (Hebei, Shaanxi), Yangzhou paper-cut, Chinese paper-cut on the UNESCO intangible heritage list',
      prompt: 'Chinese jianzhi paper-cut style: round red window flower cut from a single sheet, radial symmetry, crescent and sawtooth lace cuts, leaf motifs, crisp edges, soft shadow on cream',
      ex: sv(fo_jianzhi()) },
    { id: 'rosemaling', name: 'Rosemaling', aka: 'Norwegian rose painting',
      when: '1750–1850 · rural Norway (Telemark, Hallingdal, Rogaland)', y: 1750,
      desc: 'Decorative folk painting on wooden bowls, trunks, cupboards and church walls in rural Norway, adapted from Baroque and Rococo acanthus ornament. Big C and S scrolls sweep around stylized flowers in confident single brushstrokes, finished with fine pale liner work.',
      spot: 'C- and S-shaped scrolls, acanthus leaves, stylized roses, tapered one-stroke brush marks with two-tone shading, cream liner outlines and dots, deep blue-green, red or ochre grounds, painted wood',
      ref: 'Telemark, Hallingdal and Rogaland regional styles, Norwegian-American rosemaling (Per Lysne), Vesterheim Museum (Decorah, Iowa)',
      prompt: 'Norwegian rosemaling style: sweeping C and S scrolls, acanthus leaves and a stylized rose, tapered single brushstrokes, cream liner work, ochre, red and blue on deep teal painted wood',
      ex: sv(fo_rosemaling()) },
    { id: 'fraktur', name: 'Pennsylvania Dutch fraktur & hex signs', aka: 'Pennsylvania German folk art, barn stars, distelfink',
      when: 'fraktur 1740–1860, hex signs from the 1850s · southeastern Pennsylvania, USA', y: 1740,
      desc: 'Folk art of German-speaking settlers in Pennsylvania: brightly painted, hand-lettered birth and marriage certificates (fraktur) and, later, big round star paintings on barns (hex signs). Both share one cheerful vocabulary of distelfink birds, tulips, hearts and compass stars.',
      spot: 'six- or eight-point compass rosettes inside a circle, scalloped borders, distelfink goldfinches, three-lobed tulips, hearts, flat red, yellow, green and blue on red barn boards or cream paper',
      ref: 'Johann Henrich Otto (fraktur), Berks County barn stars, Johnny Ott hex signs, Winterthur Museum fraktur collection',
      prompt: 'Pennsylvania Dutch folk art style: round hex sign with an eight-point compass rosette and scalloped border, distelfink birds and tulips, flat red, yellow, green and blue on red barn boards',
      ex: sv(fo_fraktur()) },
    { id: 'formline', name: 'Northwest Coast formline', aka: 'formline design, Haida, Tlingit, Tsimshian, Kwakwaka’wakw art',
      when: 'for well over a thousand years · Pacific Northwest Coast (Alaska to British Columbia)',
      desc: 'The design system of the Haida, Tlingit, Tsimshian, Kwakwaka’wakw and neighboring Nations, used on poles, bentwood boxes, masks and Chilkat blankets: black lines that swell and taper to form ovoids and U-shapes, with red secondary lines. Crests and specific designs belong to families and clans, so borrow only the visual grammar (ovoids, U-forms, black and red), never a particular crest or artwork.',
      spot: 'ovoids (rounded rectangles with a dipped bottom), U-forms and split U-forms, black primary lines that swell and taper, red secondary shapes, small blue-green accents, every shape locked tightly together, strong symmetry',
      ref: 'Bill Reid (Haida), Mungo Martin (Kwakwaka’wakw), Chilkat weavings, Bill Holm’s book Northwest Coast Indian Art: An Analysis of Form (1965)',
      prompt: 'Northwest Coast formline-inspired design: interlocking ovoids and U-forms in bold black lines that swell and taper, red secondary shapes, small blue-green accents, flat on natural cream, tight symmetrical panel',
      ex: sv(fo_formline()) },
    { id: 'dotpainting', name: 'Aboriginal dot painting', aka: 'Western Desert painting, Papunya Tula style',
      when: '1971– · Papunya and the Western Desert, Central Australia', y: 1971,
      desc: 'Acrylic painting that began at Papunya in 1971, when Western Desert artists moved designs from ground drawings, body paint and ceremony onto boards and canvas, often using dots to veil restricted sacred details. Many designs belong to particular people, Country and Dreaming stories, so prompts should borrow only the technique and palette (dotting, concentric circles, earth colors), never the stories or symbols.',
      spot: 'fields of evenly spaced round dots, concentric dotted circles linked by dotted paths, rippling bands of dots, red and yellow ochre, white and black on a dark ground, seen from above like a map',
      ref: 'Papunya Tula Artists, Clifford Possum Tjapaltjarri, Warlukurlangu Artists (Yuendumu), National Museum of Australia',
      prompt: 'Western Desert-inspired dot painting technique: dense fields of small round dots, concentric dotted circles linked by dotted paths, red ochre, yellow ochre, white and black on dark brown, aerial view',
      ex: sv(fo_dots()) },
    { id: 'alebrije', name: 'Alebrijes', aka: 'Oaxacan wood carvings, alebrije creatures',
      when: '1936– · Mexico City, then Oaxaca', y: 1936,
      desc: 'Fantastical hybrid creatures first made in papier-mâché by Pedro Linares in Mexico City, from a fever dream, and later carved from copal wood in Oaxacan villages like San Antonio Arrazola and San Martín Tilcajete. They are painted in electric colors and covered edge to edge in tiny dots, stripes and zigzags.',
      spot: 'hybrid animals with wings, horns, fangs and curly tails, hot pink, turquoise, orange, yellow and purple, every surface covered in tiny dots, dashes, zigzags and scales, contrasting outlines, glossy hand-painted look',
      ref: 'Pedro Linares (Mexico City), Manuel Jiménez (Arrazola), the carvers of San Martín Tilcajete',
      prompt: 'Alebrije folk art style: fantastical winged horned creature with a curly tail, hand-painted in hot pink, turquoise, orange and yellow, every surface covered in tiny dots, stripes and zigzags',
      ex: sv(fo_alebrije()) },
  ]
});

/* ================= PATTERN & ORNAMENT ================= */

function fo_star8(cx, cy, R) { const P = []; for (let k = 0; k < 16; k++) { const a = k * 22.5 * Math.PI / 180, r = k % 2 ? R * .7654 : R; P.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } return pts(P); }
function fo_islamic() {
  const s0 = 22, R = 11, K = '#15130F', W = '#F2EBDD', BL = '#1D3F8A', GN = '#1E6B57', OC = '#D9A43A';
  const arch = 'M34,100 L34,46 Q34,14 80,5 Q126,14 126,46 L126,100Z', cid = U('iar');
  let s = bg('#E6D8B9');
  let lat = ''; for (let x = -100; x < 170; x += 7) lat += `M${x},0 l100,100 M${x + 100},0 l-100,100`;
  s += `<path d="${lat}" stroke="#CDB98E" stroke-width=".7"/>`;
  const sid = U('ist');
  let st = `<defs><g id="${sid}"><polygon points="${fo_star8(0, 0, R)}" fill="${BL}" stroke="${K}" stroke-width="2.6"/><polygon points="${fo_star8(0, 0, R)}" fill="none" stroke="${W}" stroke-width="1.3"/><polygon points="${fo_star8(0, 0, R * .5)}" fill="${OC}" stroke="${K}" stroke-width=".5" transform="rotate(22.5)"/><circle r="1" fill="${W}"/><rect x="${s0 / 2 - 1.6}" y="${s0 / 2 - 1.6}" width="3.2" height="3.2" fill="${OC}" stroke="${K}" stroke-width=".4" transform="rotate(45 ${s0 / 2} ${s0 / 2})"/></g></defs>`;
  for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) st += `<use href="#${sid}" x="${80 + i * s0}" y="${52 + j * s0}"/>`;
  s += `<defs><clipPath id="${cid}"><path d="${arch}"/></clipPath></defs><g clip-path="url(#${cid})"><rect width="160" height="100" fill="${GN}"/>${st}</g>`;
  s += `<path d="${arch}" fill="none" stroke="${K}" stroke-width="4.4"/><path d="${arch}" fill="none" stroke="${OC}" stroke-width="2.6"/><path d="M27,100 L27,45 Q27,8 80,-3 Q133,8 133,45 L133,100" fill="none" stroke="#B9A273" stroke-width=".8"/>`;
  return s;
}

function fo_celtic() {
  const N = 11, Rr = 5, u = 11.6, ox = 80 - (N - 1) / 2 * u, oy = 50 - (Rr - 1) / 2 * u;
  const X = i => ox + i * u, Y = r => oy + r * u;
  const W = u * .44, O = '#16110C', F = '#E2B04A';
  let s = bg('#E9DAB2');
  s += `<rect x="${f1(X(-1) - 1)}" y="${f1(Y(-1) - 1)}" width="${f1((N + 1) * u + 2)}" height="${f1((Rr + 1) * u + 2)}" fill="#203D30" stroke="#7A2A1E" stroke-width="1.4"/>`;
  s += `<rect x="${f1(X(-1) - 4.4)}" y="${f1(Y(-1) - 4.4)}" width="${f1((N + 1) * u + 8.8)}" height="${f1((Rr + 1) * u + 8.8)}" fill="none" stroke="#B5352A" stroke-width="1.4" stroke-dasharray="0 2.8" stroke-linecap="round"/>`;
  const band = d => `<path d="${d}" fill="none" stroke="${O}" stroke-width="${f1(W + 2)}"/><path d="${d}" fill="none" stroke="${F}" stroke-width="${f1(W)}"/>`;
  const C = [], ends = [];
  for (let i = 0; i < N; i++) for (let r = 0; r < Rr; r++) if ((i + r) % 2 === 1) {
    C.push([i, r]);
    for (const dx of [-1, 1]) for (const dy of [-1, 1]) { const ni = i + dx, nr = r + dy; if (ni < 0 || ni >= N || nr < 0 || nr >= Rr) ends.push({ mx: i + dx / 2, my: r + dy / 2, dx, dy }); }
  }
  const per = e => e.my < 0 ? e.mx : e.mx > N - 1 ? N + e.my : e.my > Rr - 1 ? N + Rr + (N - 1 - e.mx) : 2 * N + Rr + (Rr - 1 - e.my);
  ends.sort((a, b) => per(a) - per(b));
  let loops = '';
  for (let k = 1; k <= ends.length; k += 2) {
    const a = ends[k], b = ends[(k + 1) % ends.length], kk = .62;
    loops += `M${f1(X(a.mx))},${f1(Y(a.my))} C${f1(X(a.mx + a.dx * kk))},${f1(Y(a.my + a.dy * kk))} ${f1(X(b.mx + b.dx * kk))},${f1(Y(b.my + b.dy * kk))} ${f1(X(b.mx))},${f1(Y(b.my))}`;
  }
  s += band(loops);
  const seg = (i, r, dir) => dir ? `M${f1(X(i - .5))},${f1(Y(r - .5))}L${f1(X(i + .5))},${f1(Y(r + .5))}` : `M${f1(X(i - .5))},${f1(Y(r + .5))}L${f1(X(i + .5))},${f1(Y(r - .5))}`;
  for (const [i, r] of C) { const over = i % 2 === 0; s += band(seg(i, r, !over)) + band(seg(i, r, over)); }
  // corner knots of the frame
  for (const [x, y] of [[X(-1) - 4.4, Y(-1) - 4.4], [X(N) + 4.4, Y(-1) - 4.4], [X(-1) - 4.4, Y(Rr) + 4.4], [X(N) + 4.4, Y(Rr) + 4.4]]) s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="3" fill="#B5352A"/><circle cx="${f1(x)}" cy="${f1(y)}" r="1.2" fill="${F}"/>`;
  return s;
}

function fo_artscrafts() {
  const IN = '#1F3550', K = '#14202F', cell = U('acc');
  const vine = fo_bez([0, 38], [18, 38], [22, 8], [40, 10], 20).concat(fo_bez([40, 10], [58, 12], [62, 38], [80, 38], 20).slice(1));
  let c = '';
  c += `<path d="M0,38 C18,38 22,8 40,10 C58,12 62,38 80,38" fill="none" stroke="#7D8A4E" stroke-width="1.8"/>`;
  c += `<path d="M24,26 C30,34 34,38 44,39 M60,26 C64,18 70,14 76,13 M16,33 C12,24 8,20 2,18" fill="none" stroke="#7D8A4E" stroke-width="1"/>`;
  const leaf = (x, y, a, len, w, col) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(a)})"><path d="${fo_leafD(len, w)}" fill="${col}" stroke="${K}" stroke-width=".5"/><path d="M1,0 L${f1(len * .85)},0 M${f1(len * .3)},0 l2,-1.6 M${f1(len * .5)},0 l2,-1.4 M${f1(len * .3)},0 l2,1.6 M${f1(len * .5)},0 l2,1.4" stroke="#2E4A35" stroke-width=".45"/></g>`;
  [[.1, 1], [.22, -1], [.34, 1], [.62, -1], [.72, 1], [.86, -1], [.95, 1]].forEach(([t, sd], k) => {
    const i = Math.round(t * (vine.length - 1)), p = vine[i], q = vine[Math.min(vine.length - 1, i + 1)];
    const a = Math.atan2(q[1] - p[1], q[0] - p[0]) * 180 / Math.PI + sd * 55;
    c += leaf(p[0], p[1], a, 11, 3.2, k % 2 ? '#6F8F5A' : '#A7B57E');
  });
  c += leaf(44, 39, -10, 8, 2.4, '#6F8F5A') + leaf(76, 13, -30, 8, 2.4, '#A7B57E') + leaf(2, 18, 200, 8, 2.4, '#6F8F5A');
  // flower
  c += `<g transform="translate(40 9)">`;
  for (const a of [-150, -120, -90, -60, -30]) c += `<ellipse cx="0" cy="-5.5" rx="3.2" ry="5.8" transform="rotate(${a + 90})" fill="#C8553D" stroke="${K}" stroke-width=".5"/>`;
  c += `<path d="M-6,0 C-6,-6 6,-6 6,0 C4,2 -4,2 -6,0Z" fill="#EAD8B0" stroke="${K}" stroke-width=".5"/><path d="M-3.5,-1 l0,-3 M0,-1 l0,-4 M3.5,-1 l0,-3" stroke="#C8553D" stroke-width=".6"/><path d="M-5,1 Q0,5 5,1 Q0,2.6 -5,1Z" fill="#6F8F5A" stroke="${K}" stroke-width=".4"/></g>`;
  // bird
  c += `<g transform="translate(36 32)"><path d="M6,1 C10,3 14,6 16,8 L13,8.6 C10,6.6 7,5 4,4Z" fill="#5C3A26" stroke="${K}" stroke-width=".4"/><ellipse cx="0" cy="0" rx="7" ry="4.2" transform="rotate(-12)" fill="#8B5A3C" stroke="${K}" stroke-width=".5"/><path d="M-6,1 C-4,5 2,5 4,2 C1,3 -3,3 -6,1Z" fill="#EAD8B0"/><path d="M-1,-2 C2,-4 6,-2 7,1 C4,0 1,0 -1,-2Z" fill="#5C3A26"/><circle cx="-6" cy="-3" r="3" fill="#8B5A3C" stroke="${K}" stroke-width=".5"/><path d="M-8.8,-3.4 l-2.6,1 l2.6,.6Z" fill="#D9A43A"/><circle cx="-6.8" cy="-3.6" r=".6" fill="#EAD8B0"/><g fill="#5C3A26"><circle cx="-3" cy="2.2" r=".4"/><circle cx="-1" cy="3" r=".4"/><circle cx="1" cy="2.4" r=".4"/></g><path d="M-1,4 l-.6,3 M1.4,4 l.4,3" stroke="${K}" stroke-width=".5"/></g>`;
  c += `<path d="M28,39.4 H48" stroke="#7D8A4E" stroke-width=".9"/>`;
  // berries and small flowers
  const berry = (x, y) => `<circle cx="${x}" cy="${y}" r="1.9" fill="#B23A3A" stroke="${K}" stroke-width=".4"/><circle cx="${x - .6}" cy="${y - .6}" r=".5" fill="#EAD8B0"/>`;
  c += berry(7, 13) + berry(10.4, 15.4) + berry(6.4, 17.2) + berry(70, 30) + berry(73, 32.6);
  const sfl = (x, y) => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-1.8" rx="1.1" ry="1.8" transform="rotate(${a})" fill="#EAD8B0"/>`).join('')}<circle r=".8" fill="#D9A43A"/></g>`;
  c += sfl(62, 4) + sfl(20, 46) + sfl(60, 46) + sfl(4, 30);
  let s = bg(IN) + `<defs><g id="${cell}">${c}</g></defs>`;
  for (const x of [-80, 0, 80, 160]) for (const y of [-50, 0, 50, 100]) s += `<use href="#${cell}" x="${x}" y="${y}"/>`;
  return fo_clip(s);
}

function fo_batik() {
  const r = rng(17), CR = '#EAD9B2', BR = '#6B3A1C', IN = '#1E2740', DK = '#3A1E0E';
  const pp = U('bpa'), pk = U('bka'), [wd, wf] = wob(.9, .2, 2);
  let defs = `<pattern id="${pp}" width="12" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><rect width="12" height="12" fill="${BR}"/><path d="M-6,10.5 C-1,10.5 -4,1.5 2,1.5 M6,10.5 C11,10.5 8,1.5 14,1.5" fill="none" stroke="${CR}" stroke-width="2.6"/><path d="M-6,10.5 C-1,10.5 -4,1.5 2,1.5 M6,10.5 C11,10.5 8,1.5 14,1.5" fill="none" stroke="${DK}" stroke-width=".7"/><circle cx="3" cy="9" r=".7" fill="${CR}"/><circle cx="9.4" cy="3.4" r=".7" fill="${CR}"/><rect y="13.6" width="12" height="2.8" fill="${IN}"/><path d="M3,15 l1.3,-1.1 l1.3,1.1 l-1.3,1.1Z M9,15 l1.3,-1.1 l1.3,1.1 l-1.3,1.1Z" fill="${CR}"/></pattern>`;
  let kw = ''; for (const [dx, dy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) kw += `<ellipse cx="${5 + dx * 2.4}" cy="${8 + dy * 2.4}" rx="3.2" ry="2.1" transform="rotate(${dx * dy * 45} ${5 + dx * 2.4} ${8 + dy * 2.4})" fill="${CR}" stroke="${BR}" stroke-width=".5"/><circle cx="${5 + dx * 2.4}" cy="${8 + dy * 2.4}" r=".6" fill="${BR}"/>`;
  defs += `<pattern id="${pk}" width="10" height="16" patternUnits="userSpaceOnUse" x="0" y="82">${kw}<circle cx="5" cy="8" r=".8" fill="${CR}"/><circle cx="0" cy="0" r=".8" fill="${CR}"/><circle cx="10" cy="0" r=".8" fill="${CR}"/><circle cx="0" cy="16" r=".8" fill="${CR}"/><circle cx="10" cy="16" r=".8" fill="${CR}"/></pattern>`;
  let g = bg(CR) + `<rect width="160" height="82" fill="url(#${pp})"/>`;
  g += `<rect y="80" width="160" height="20" fill="${IN}"/><rect y="82" width="160" height="16" fill="url(#${pk})"/><path d="M0,80.8 H160 M0,99.2 H160" stroke="${CR}" stroke-width=".7"/>`;
  let ck = '';
  for (let i = 0; i < 26; i++) { let x = r() * 160, y = r() * 100, a = r() * Math.PI * 2; ck += `M${f1(x)},${f1(y)}`; for (let k = 0; k < 5; k++) { a += (r() - .5) * 1.4; const l = 3 + r() * 7; x += Math.cos(a) * l; y += Math.sin(a) * l; ck += `L${f1(x)},${f1(y)}`; } }
  g += `<path d="${ck}" fill="none" stroke="${IN}" stroke-width=".35" opacity=".6"/>`;
  return `<defs>${defs}${wd}</defs><g filter="url(#${wf})">${g}</g>`;
}

function fo_bluetile() {
  const D = '#1F3F8F', Lw = '#7D97CC', tile = U('btt'), tc = U('btc'), [wd, wf] = wob(.8, .14, 6);
  let t = `<rect width="40" height="40" fill="#F6F3EB"/>`;
  let blue = '';
  for (let k = 0; k < 4; k++) blue += `<g transform="rotate(${k * 90} 20 20)"><path d="M0,0 L11,0 A11,11 0 0 1 0,11Z" fill="${Lw}" opacity=".55"/><path d="M11,0 A11,11 0 0 1 0,11 M6.5,0 A6.5,6.5 0 0 1 0,6.5" fill="none" stroke="${D}" stroke-width="1"/><ellipse cx="9.6" cy="9.6" rx="1.3" ry="3.4" transform="rotate(-45 9.6 9.6)" fill="${D}"/><path d="M20,0 m-3.4,0 a3.4,3.4 0 0 0 6.8,0" fill="${Lw}" opacity=".6" stroke="${D}" stroke-width=".8"/><path d="M20,3.4 V7.4" stroke="${D}" stroke-width=".9"/></g>`;
  for (let k = 0; k < 8; k++) blue += `<ellipse cx="20" cy="13" rx="2.5" ry="5" transform="rotate(${k * 45} 20 20)" fill="${k % 2 ? '#A9BBDF' : Lw}" stroke="${D}" stroke-width=".8"/>`;
  blue += `<circle cx="20" cy="20" r="5.4" fill="#F6F3EB" stroke="${D}" stroke-width=".8"/><circle cx="20" cy="20" r="3.1" fill="${D}"/><circle cx="20" cy="20" r="1" fill="#F6F3EB"/>`;
  t += `<g filter="url(#${wf})">${blue}</g><path d="M3,9 Q4,4 9,3" stroke="#fff" stroke-width="1.4" fill="none" opacity=".7" stroke-linecap="round"/>`;
  let s = `<defs>${wd}<clipPath id="${tc}"><rect width="40" height="40"/></clipPath><g id="${tile}" clip-path="url(#${tc})">${t}</g></defs>` + bg('#D8D3C6');
  for (let x = 0; x < 160; x += 40) for (let y = -10; y < 100; y += 40) s += `<use href="#${tile}" x="${x}" y="${y}"/>`;
  let gr = ''; for (let x = 40; x < 160; x += 40) gr += `M${x},0V100`; for (let y = 30; y < 100; y += 40) gr += `M0,${y}H160`;
  s += `<path d="${gr}" stroke="#D3CDBE" stroke-width="1.3"/>`;
  return s;
}

function fo_kente() {
  const GO = '#E8B321', GN = '#1F7A3A', RD = '#C1272D', BK = '#1A1A1A', BL = '#23408E';
  const pw = U('kw'), pch = U('kc'), pb = U('kb'), pzz = U('kz'), pt = U('kt');
  const warp = [[2, BK], [3, GO], [1.5, GN], [3, GO], [1, RD], [3, GO], [1.5, GN], [3, GO], [2, BK]];
  let x = 0, wr = ''; for (const [w, c] of warp) { wr += `<rect x="${x}" width="${w}" height="2" fill="${c}"/>`; x += w; }
  let defs = `<pattern id="${pw}" width="20" height="2" patternUnits="userSpaceOnUse">${wr}</pattern>`;
  defs += `<pattern id="${pch}" width="5" height="4.6" patternUnits="userSpaceOnUse"><rect width="2.5" height="2.3" fill="${GO}"/><rect x="2.5" y="2.3" width="2.5" height="2.3" fill="${GO}"/></pattern>`;
  defs += `<pattern id="${pb}" width="20" height="3.5" patternUnits="userSpaceOnUse"><rect width="20" height="1.1" fill="${GO}"/><rect y="2" width="20" height=".6" fill="${GN}"/></pattern>`;
  defs += `<pattern id="${pzz}" width="5" height="14" patternUnits="userSpaceOnUse"><path d="M0,7 L2.5,2 L5,7 L2.5,12Z" fill="${GO}"/><path d="M1.6,7 L2.5,5 L3.4,7 L2.5,9Z" fill="${BK}"/></pattern>`;
  defs += `<pattern id="${pt}" width="1.3" height="1.3" patternUnits="userSpaceOnUse"><rect width="1.3" height=".45" fill="#fff" opacity=".13"/><rect width=".35" height="1.3" fill="#000" opacity=".08"/></pattern>`;
  const blocks = [[RD, pch], [GN, pb], [RD, pzz], [BK, pch], [BL, pb], [GN, pzz]];
  let s = '';
  for (let i = 0; i < 8; i++) {
    const x0 = i * 20; let seg = 0;
    for (let y = -28 + (i % 2) * 14; y < 100; y += 14, seg++) {
      if (seg % 2 === 0) s += `<rect x="${x0}" y="${y}" width="20" height="14" fill="url(#${pw})"/>`;
      else { const [c, p] = blocks[(i * 2 + seg) % blocks.length]; s += `<rect x="${x0}" y="${y}" width="20" height="14" fill="${c}"/><rect x="${x0}" y="${y + 1.2}" width="20" height="11.6" fill="url(#${p})"/><path d="M${x0},${y + .6}h20 M${x0},${y + 13.4}h20" stroke="${GO}" stroke-width=".8"/>`; }
    }
  }
  let sm = ''; for (let i = 1; i < 8; i++) sm += `M${i * 20},0V100`;
  s += `<rect width="160" height="100" fill="url(#${pt})"/><path d="${sm}" stroke="#2A1E08" stroke-width=".6" opacity=".55"/>`;
  return `<defs>${defs}</defs>` + s;
}

function fo_wagara() {
  const IN = '#1E3A6E', VR = '#B9412F', CR = '#F1E6CC', GD = '#B8892E', WH = '#F4EFE4';
  const p1 = U('wsg'), p2 = U('was'), p3 = U('wsp'), c1 = U('wc'), c2 = U('wc'), c3 = U('wc');
  const R = 8;
  let sg = '';
  for (let j = 0; j <= 4; j++) { const cy = j * R / 2; for (const cx of (j % 2 ? [-R, R, 3 * R] : [0, 2 * R])) { sg += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${IN}" stroke="${WH}" stroke-width=".9"/>`; for (const k of [.75, .5, .25]) sg += `<circle cx="${cx}" cy="${cy}" r="${f1(R * k)}" fill="none" stroke="${WH}" stroke-width=".8"/>`; } }
  let defs = `<pattern id="${p1}" width="${2 * R}" height="${R}" patternUnits="userSpaceOnUse">${sg}</pattern>`;
  const S = 12, h = S * Math.sqrt(3) / 2;
  let as = '';
  for (let k = 0; k < 2; k++) for (let j = -1; j <= 1; j++) {
    const o = (k % 2) * S / 2, y0 = k * h, y1 = y0 + h, ax = j * S + o;
    const tris = [[[ax, y0], [ax - S / 2, y1], [ax + S / 2, y1]], [[ax, y0], [ax + S, y0], [ax + S / 2, y1]]];
    for (const T of tris) { const gx = (T[0][0] + T[1][0] + T[2][0]) / 3, gy = (T[0][1] + T[1][1] + T[2][1]) / 3; for (let q = 0; q < 3; q++) { const A = T[q], B = T[(q + 1) % 3]; as += `M${f1(A[0])},${f1(A[1])}L${f1(B[0])},${f1(B[1])}M${f1(A[0])},${f1(A[1])}L${f1(gx)},${f1(gy)}`; } }
  }
  defs += `<pattern id="${p2}" width="${S}" height="${f1(2 * h)}" patternUnits="userSpaceOnUse"><path d="${as}" stroke="${WH}" stroke-width=".7" stroke-linecap="round"/></pattern>`;
  const Q = 7;
  defs += `<pattern id="${p3}" width="${2 * Q}" height="${2 * Q}" patternUnits="userSpaceOnUse"><g fill="none" stroke="${GD}" stroke-width="1"><circle cx="0" cy="0" r="${Q}"/><circle cx="${2 * Q}" cy="0" r="${Q}"/><circle cx="0" cy="${2 * Q}" r="${Q}"/><circle cx="${2 * Q}" cy="${2 * Q}" r="${Q}"/><circle cx="${Q}" cy="${Q}" r="${Q}"/></g><circle cx="${Q}" cy="0" r="1" fill="${VR}"/><circle cx="0" cy="${Q}" r="1" fill="${VR}"/><circle cx="${2 * Q}" cy="${Q}" r="1" fill="${VR}"/><circle cx="${Q}" cy="${2 * Q}" r="1" fill="${VR}"/></pattern>`;
  const A = 'M0,0 L60,0 L46,100 L0,100Z', B = 'M60,0 L114,0 L100,100 L46,100Z', C = 'M114,0 L160,0 L160,100 L100,100Z';
  let s = `<defs>${defs}</defs>`;
  s += `<path d="${A}" fill="${IN}"/><path d="${A}" fill="url(#${p1})"/>`;
  s += `<path d="${B}" fill="${VR}"/><path d="${B}" fill="url(#${p2})"/>`;
  s += `<path d="${C}" fill="${CR}"/><path d="${C}" fill="url(#${p3})"/>`;
  s += `<path d="M60,0 L46,100 M114,0 L100,100" stroke="${GD}" stroke-width="2.4"/><path d="M60,0 L46,100 M114,0 L100,100" stroke="#2A1E10" stroke-width=".6"/>`;
  return s;
}

function fo_rangoli() {
  const r = rng(41), WH = '#F7F1E3', cx = 80, cy = 50, [wd, wf] = wob(.9, .35, 7);
  const MG = '#D6246E', SA = '#F28C1E', YE = '#F7C928', GN = '#2E9E5B', BL = '#2C6BC4';
  let s = bg('#5A3022');
  let sp = ''; for (let i = 0; i < 120; i++) sp += `M${f1(r() * 160)},${f1(r() * 100)}h.01`;
  s += `<path d="${sp}" stroke="#6E4030" stroke-width="1.2" stroke-linecap="round"/>`;
  let g = `<circle cx="${cx}" cy="${cy}" r="46" fill="none" stroke="${WH}" stroke-width="1.6" stroke-dasharray="0 3.4" stroke-linecap="round"/>`;
  g += `<circle cx="${cx}" cy="${cy}" r="42.5" fill="${BL}"/>`;
  for (let k = 0; k < 16; k++) g += `<path d="${fo_petalD(26, 43, 9.5)}" transform="translate(${cx} ${cy}) rotate(${k * 22.5 + 11.25})" fill="${YE}" stroke="${WH}" stroke-width="1"/>`;
  g += `<circle cx="${cx}" cy="${cy}" r="30" fill="${SA}"/>`;
  for (let k = 0; k < 8; k++) g += `<path d="${fo_petalD(16, 34, 8)}" transform="translate(${cx} ${cy}) rotate(${k * 45 + 22.5})" fill="${GN}" stroke="${WH}" stroke-width=".9"/>`;
  for (let k = 0; k < 8; k++) g += `<path d="${fo_petalD(10, 37, 16)}" transform="translate(${cx} ${cy}) rotate(${k * 45})" fill="${MG}" stroke="${WH}" stroke-width="1.1"/><path d="${fo_petalD(16, 31, 7)}" transform="translate(${cx} ${cy}) rotate(${k * 45})" fill="${YE}"/><circle cx="${f1(cx + 34.4 * Math.sin(k * Math.PI / 4))}" cy="${f1(cy - 34.4 * Math.cos(k * Math.PI / 4))}" r="1.1" fill="${WH}"/>`;
  g += `<circle cx="${cx}" cy="${cy}" r="13" fill="${SA}" stroke="${WH}" stroke-width="1.1"/>`;
  for (let k = 0; k < 8; k++) g += `<path d="${fo_petalD(3.5, 11.5, 5.4)}" transform="translate(${cx} ${cy}) rotate(${k * 45 + 22.5})" fill="${YE}" stroke="${WH}" stroke-width=".6"/>`;
  g += `<circle cx="${cx}" cy="${cy}" r="3.6" fill="${WH}"/><circle cx="${cx}" cy="${cy}" r="1.7" fill="${MG}"/>`;
  g += `<circle cx="${cx}" cy="${cy}" r="20.5" fill="none" stroke="${WH}" stroke-width="1.2" stroke-dasharray="0 2.6" stroke-linecap="round"/>`;
  s += `<defs>${wd}</defs><g filter="url(#${wf})">${g}</g>`;
  // diyas
  const glow = U('rgl');
  s += `<defs><radialGradient id="${glow}"><stop offset="0" stop-color="#FFD873" stop-opacity=".75"/><stop offset="1" stop-color="#FFD873" stop-opacity="0"/></radialGradient></defs>`;
  const diya = (x, y) => `<circle cx="${x}" cy="${y - 8}" r="11" fill="url(#${glow})"/><path d="M${x - 9},${y - 2} Q${x},${y + 7} ${x + 9},${y - 2} Q${x + 4},${y - 3.6} ${x + 11},${y - 5} Q${x},${y - 4} ${x - 9},${y - 2}Z" fill="#B8572E" stroke="#7A3218" stroke-width=".6"/><path d="M${x - 6},${y} q6,3 12,0" fill="none" stroke="${YE}" stroke-width=".7" stroke-dasharray="0 1.8" stroke-linecap="round"/><path d="M${x},${y - 4} C${x - 3},${y - 7} ${x - 1},${y - 11} ${x + .5},${y - 14} C${x + 2.4},${y - 10} ${x + 3},${y - 7} ${x},${y - 4}Z" fill="#FFB02E"/><path d="M${x},${y - 4.6} C${x - 1.2},${y - 6.6} ${x},${y - 9} ${x + .5},${y - 10.4} C${x + 1.4},${y - 8} ${x + 1.4},${y - 6.4} ${x},${y - 4.6}Z" fill="#FFF3B0"/>`;
  s += diya(18, 86) + diya(142, 86) + diya(16, 22) + diya(144, 22);
  return s;
}

pool.groups.push({
  id: 'ornament', title: 'Pattern & ornament traditions', slot: 'Pattern tradition',
  intro: 'Repeating patterns and decorative systems from around the world. Use one as a surface (a background, border, textile, tile or wallpaper) and name its geometry and palette, so the model builds the repeat correctly instead of a vague "ethnic pattern".',
  terms: [
    { id: 'islamicgeo', name: 'Islamic geometric pattern', aka: 'girih, zellige, star-and-cross pattern',
      when: 'since the 900s · from Spain and Morocco to Iran and Central Asia', y: 900,
      desc: 'Pattern built with compass and straightedge from repeating stars and polygons, used across the mosques, palaces and manuscripts of the Islamic world in tile, carved plaster and wood. Bands seem to weave over and under each other without end, suggesting infinite order without showing any figures.',
      spot: '8-, 10- and 12-point stars, interlocking polygons and crosses, strapwork lines that weave over and under, perfect repeat, mosaic tile (zellige) in cobalt, green, ochre, white and black, framed by pointed or horseshoe arches',
      ref: 'the Alhambra (Granada), Darb-i Imam shrine (Isfahan), Bou Inania Madrasa (Fez), Topkapı Palace tiles (Istanbul)',
      prompt: 'Islamic geometric pattern style: interlocking eight-point stars and crosses, white strapwork interlace, zellige tile mosaic in cobalt, green, ochre and black, framed by a pointed arch in carved plaster',
      ex: sv(fo_islamic()) },
    { id: 'celtic', name: 'Celtic knotwork', aka: 'Insular interlace, Celtic knot',
      when: '600–900 · Ireland and Britain', y: 600,
      desc: 'Endless interlaced bands from the illuminated Gospel books and carved stone crosses of early medieval Ireland and Britain. Each strand passes alternately over and under the next with no loose ends, so the eye keeps travelling round in loops.',
      spot: 'ribbons that strictly alternate over and under, no loose ends, plaits, spirals and knots, sometimes long-necked beasts, panels framed by borders, gold, red, green and purple inks, rows of red dots',
      ref: 'Book of Kells, Lindisfarne Gospels, Book of Durrow, George Bain’s Celtic Art: The Methods of Construction (1951)',
      prompt: 'Celtic knotwork style: ribbons strictly alternating over and under, no loose ends, gold strands with black outlines on dark green, framed panel with red dot border, illuminated manuscript',
      ex: sv(fo_celtic()) },
    { id: 'artscrafts', name: 'Arts & Crafts pattern', aka: 'William Morris pattern',
      when: '1860–1910 · Britain', y: 1860,
      desc: 'Wallpaper and textile design from the Arts and Crafts movement, which championed handcraft over cheap factory goods. William Morris drew dense, flat, medieval-inspired repeats of twisting vines, leaves, flowers and birds that fill the whole surface with a calm rhythm.',
      spot: 'dense seamless repeat with no empty ground, twisting vines and acanthus leaves, birds among flowers and berries, flat color with fine outlines and vein lines, no depth, muted indigo, sage, madder red and cream, woodblock-printed look',
      ref: 'William Morris (Strawberry Thief, Willow Bough, Trellis), May Morris, C. F. A. Voysey, Morris & Co.',
      prompt: 'In the manner of William Morris: dense seamless repeat of twisting vines, leaves, flowers, berries and thrushes, flat woodblock-printed indigo, sage green, madder red and cream',
      ex: sv(fo_artscrafts()) },
    { id: 'batik', name: 'Batik', aka: 'Javanese batik, batik tulis',
      when: 'for centuries · Java, Indonesia',
      desc: 'Indonesian cloth decorated by drawing hot wax onto cotton with a small copper pen (canting) or stamp, dyeing it, and repeating, so the waxed lines stay pale. Classic court batik of Yogyakarta and Solo uses indigo and sogan brown with motifs like the diagonal parang blade and the four-oval kawung, and fine crackle lines appear where the wax cracks in the dye.',
      spot: 'pale lines and dots on dyed ground, fine spidery crackle veins, diagonal parang bands of S-shaped blades, kawung rows of four ovals, indigo, deep sogan brown and cream, slightly soft edges from dye bleed',
      ref: 'Yogyakarta and Surakarta (Solo) court batik, Pekalongan coastal batik, Indonesian batik on the UNESCO intangible heritage list',
      prompt: 'Javanese batik style: wax-resist cotton with diagonal parang bands and a kawung border, cream wax lines on sogan brown and indigo, fine crackle veins, soft dye-bled edges, flat textile pattern',
      ex: sv(fo_batik()) },
    { id: 'bluetile', name: 'Blue-and-white tile', aka: 'Delftware, azulejo, blue-and-white porcelain',
      when: 'since the 1300s · China, then Delft, Lisbon and beyond', y: 1300,
      desc: 'Cobalt blue painted on white glaze, perfected on Chinese porcelain under the Yuan and Ming dynasties and then imitated in Dutch Delftware and Portuguese azulejo tiles. The brush leaves pooled darks and pale washes, giving a cool, crisp, hand-painted look.',
      spot: 'only cobalt blue on milky white, brushy washes from pale to near-black blue, square tiles with grout lines, corner motifs that join into circles across tiles, flowers, windmills, ships or scenes, glossy glaze highlights',
      ref: 'Ming dynasty porcelain, Delft tiles (Royal Delft), Lisbon azulejo façades, National Tile Museum (Lisbon)',
      prompt: 'Blue-and-white tile style: hand-painted cobalt blue on glossy white tin glaze, brushy pale-to-dark washes, repeating floral azulejo tiles whose corner motifs join into circles across thin grout lines',
      ex: sv(fo_bluetile()) },
    { id: 'kente', name: 'Kente cloth', aka: 'kente, nwentoma (Asante), kete (Ewe)',
      when: 'since the 1600s · Asante and Ewe peoples, Ghana', y: 1600,
      desc: 'Hand-woven cloth of the Asante and Ewe peoples of Ghana, made on narrow looms as long strips that are sewn edge to edge so blocks of pattern form a checkerboard. Each pattern has a name and every color carries meaning (gold for wealth, green for growth, red for sacrifice and struggle), so treat it as meaningful cloth and borrow the woven structure and palette rather than presenting a named pattern as generic decoration.',
      spot: 'narrow vertical woven strips sewn together, blocks offset like a checkerboard, warp stripes alternating with blocks of weft pattern (checks, bars, diamonds), gold, green, red, black and blue, visible thread texture',
      ref: 'Bonwire kente weavers (Asante), Agotime and Kpetoe weavers (Ewe), Smithsonian National Museum of African Art',
      prompt: 'Kente-inspired hand-woven textile: narrow strips sewn side by side, offset checkerboard of warp stripes and geometric weft blocks, gold, green, red and black, visible thread texture',
      ex: sv(fo_kente()) },
    { id: 'wagara', name: 'Wagara patterns', aka: 'Japanese traditional patterns, seigaiha, asanoha, shippo',
      when: 'refined in the Edo period (1603–1868) · Japan', y: 1603,
      desc: 'Named repeating motifs on Japanese kimono, furoshiki, ceramics and paper, each carrying a wish: seigaiha waves for calm and good fortune, asanoha hemp leaf for healthy growth, shippo interlocking circles for harmony. They are crisp, geometric and endlessly repeatable.',
      spot: 'overlapping fan-shaped wave scales (seigaiha), six-point hemp-leaf star lattice (asanoha), interlocking circles (shippo), indigo, vermilion, cream and gold, fine even lines, different patterns patched side by side',
      ref: 'Edo-period kimono and obi, chiyogami printed paper, tenugui cotton towels, Imari porcelain',
      prompt: 'Japanese wagara pattern style: patchwork panels of seigaiha wave scales in indigo, asanoha hemp-leaf star lattice on vermilion, shippo interlocking circles in gold on cream, crisp fine lines',
      ex: sv(fo_wagara()) },
    { id: 'rangoli', name: 'Mandala & rangoli', aka: 'rangoli, kolam, alpana, mandala',
      when: 'living tradition · India and South Asia',
      desc: 'Radially symmetric designs drawn on floors and doorsteps across South Asia in colored powder, rice flour or flower petals, especially for Diwali, Pongal and weddings, as a welcome and blessing for the home. Some mandalas, such as Tibetan Buddhist sand mandalas, are sacred diagrams, so borrow the radial symmetry, petals and color rather than reproducing a ritual design.',
      spot: 'perfect radial symmetry, rings of petals, leaves and dots, white rice-flour outlines, bright powder colors (magenta, saffron, yellow, green, blue), soft grainy edges, on a floor, often with small clay oil lamps (diyas)',
      ref: 'Diwali rangoli, Tamil Nadu kolam, Bengali alpana, Tibetan sand mandalas',
      prompt: 'Rangoli style: radially symmetric floor design with rings of petals and dots in magenta, saffron, yellow, green and blue powder, white rice-flour outlines, soft grainy edges, small clay oil lamps',
      ex: sv(fo_rangoli()) },
  ]
});

/* ===== f_craft.js ===== */
/* ---------- Printmaking & Surfaces/Crafts (prefix cr_) ---------- */

// jittery hand line from (x1,y1) to (x2,y2)
function cr_jl(r, x1, y1, x2, y2, j = .5, n = 4) {
  let d = `M${f1(x1)} ${f1(y1)}`;
  for (let i = 1; i <= n; i++) {
    const t = i / n;
    d += ` L${f1(x1 + (x2 - x1) * t + (i < n ? (r() - .5) * j * 2 : 0))} ${f1(y1 + (y2 - y1) * t + (i < n ? (r() - .5) * j * 2 : 0))}`;
  }
  return d;
}
// random walk path
function cr_walk(r, x, y, n, step, ang, turn = .5) {
  let d = `M${f1(x)} ${f1(y)}`;
  for (let i = 0; i < n; i++) { ang += (r() - .5) * turn; x += Math.cos(ang) * step; y += Math.sin(ang) * step; d += ` L${f1(x)} ${f1(y)}`; }
  return d;
}
// filled ribbon along points P with widths W (swelling engraved line)
const cr_n = v => String(+v.toFixed(1));
const cr_pts = a => a.map(q => cr_n(q[0]) + ',' + cr_n(q[1])).join(' ');
function cr_ribbon(P, W, fill) {
  const L = [], R = [];
  for (let i = 0; i < P.length; i++) {
    const a = P[Math.max(0, i - 1)], b = P[Math.min(P.length - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
    const w = W[i] / 2;
    L.push([P[i][0] - dy * w, P[i][1] + dx * w]); R.push([P[i][0] + dy * w, P[i][1] - dx * w]);
  }
  return `<polygon points="${cr_pts(L.concat(R.reverse()))}" fill="${fill}"/>`;
}
// grain filter: keeps the source only where noise is high -> grainy dots (aquatint, mezzotint)
function cr_grainF(freq = 1.1, k = 6, b = -2.7, seed = 4) {
  const id = U('crg');
  return [`<filter id="${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="1" seed="${seed}" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${k} 0 0 0 ${b}" result="m"/><feComposite in="SourceGraphic" in2="m" operator="in"/></filter>`, id];
}
// speckle filter: knocks small holes out of the source (uneven ink coverage)
function cr_speckF(freq = .55, k = 9, b = -5.2, seed = 2) {
  const id = U('crs');
  return [`<filter id="${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="2" seed="${seed}" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${k} 0 0 0 ${b}" result="m"/><feComposite in="SourceGraphic" in2="m" operator="out"/></filter>`, id];
}
// mottle filter: uneven alpha inside a flat shape (stencil dabbing, chalky plaster)
function cr_mottleF(freq = .12, lo = .7, seed = 6) {
  const id = U('crm');
  return [`<filter id="${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="3" seed="${seed}" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${f1((1 - lo) * 2)} 0 0 0 ${f1(lo - (1 - lo) * .5)}" result="m"/><feComposite in="SourceGraphic" in2="m" operator="in"/></filter>`, id];
}

/* ===================== PRINTMAKING ===================== */

function cr_woodcut() {
  const r = rng(11), P = '#EFE6D2', K = '#17120E';
  const [wd, wf] = wob(1.8, .08, 5);
  let g = `<rect x="7" y="6" width="146" height="88" fill="${K}"/>`;
  // wood grain in the uncut black: long broken wavy lines bending round a knot
  for (let i = 0; i < 17; i++) {
    const y0 = 8 + i * 3.1 + r() * 1.2;
    let d = '';
    for (let x = 7; x <= 153; x += 5) {
      const dx = x - 122, dy = y0 - 22;
      const bend = 7 * Math.exp(-(dx * dx) / 260) * Math.sign(dy || 1) * Math.exp(-(dy * dy) / 120);
      d += (d ? ' L' : 'M') + f1(x) + ' ' + f1(y0 + Math.sin(x * .045 + i * .7) * 1.1 + bend);
    }
    g += `<path d="${d}" stroke="${P}" stroke-width="${f1(.25 + r() * .45)}" fill="none" stroke-dasharray="${Math.round(6 + r() * 20)} ${Math.round(2 + r() * 7)}" opacity=".75"/>`;
  }
  g += `<ellipse cx="122" cy="22" rx="4" ry="2.2" fill="none" stroke="${P}" stroke-width=".5"/><ellipse cx="122" cy="22" rx="1.8" ry="1" fill="${P}"/>`;
  // sun with chunky chisel rays
  g += `<circle cx="42" cy="26" r="9" fill="${P}"/><circle cx="42" cy="26" r="4" fill="${K}"/><circle cx="42" cy="26" r="1.6" fill="${P}"/>`;
  for (let i = 0; i < 14; i++) {
    const a = i / 14 * Math.PI * 2 + r() * .15, r1 = 11, r2 = 17 + r() * 5, w = .09;
    g += `<polygon points="${pts([[42 + Math.cos(a - w) * r1, 26 + Math.sin(a - w) * r1], [42 + Math.cos(a) * r2, 26 + Math.sin(a) * r2], [42 + Math.cos(a + w) * r1, 26 + Math.sin(a + w) * r1]])}" fill="${P}"/>`;
  }
  // white hills cut away
  g += `<path d="M7 70 C30 56 52 58 74 66 C96 54 124 50 153 60 L153 94 L7 94Z" fill="${P}"/>`;
  // splintery black gouge marks left in the hills
  for (let i = 0; i < 46; i++) {
    const x = 10 + r() * 140, y = 70 + r() * 22, len = 6 + r() * 14, w = .5 + r() * 1.1;
    g += `<polygon points="${pts([[x, y], [x + len, y - w * .4 + (r() - .5)], [x + len * .55, y + w]])}" fill="${K}"/>`;
  }
  // stark tree
  g += `<path d="M112 80 L114 52 L110 40 M114 52 L122 42 L126 34 M113 60 L104 50 M118 47 L124 50" stroke="${K}" stroke-width="2.6" fill="none" stroke-linecap="square"/><path d="M110 82 L117 82 L115 54Z" fill="${K}"/>`;
  // tiny figure on the path
  g += fig(62, 82, 13, K);
  g += `<path d="M30 94 C44 84 56 82 64 82" stroke="${K}" stroke-width="1.2" fill="none"/>`;
  return sv(`<defs>${wd}</defs>${bg(P)}<g filter="url(#${wf})">${g}</g>${grainOv(.25)}`);
}

function cr_woodeng() {
  const r = rng(21), K = '#141210', P = '#F4EFE4';
  const [wd, wf] = wob(1.6, .12, 8);
  const cid = U('crc');
  const clip = `<clipPath id="${cid}"><path d="M28 50 C26 28 52 12 82 13 C112 12 136 26 134 50 C136 72 112 88 80 88 C50 88 28 74 28 50Z"/></clipPath>`;
  let g = `<rect width="160" height="100" fill="${K}"/>`;
  // sky: fine white lines, wider (lighter) toward the horizon
  for (let y = 14; y < 62; y += 1.25) {
    const w = .18 + (y - 14) / 48 * .75;
    g += `<path d="M20 ${f1(y)} H140" stroke="${P}" stroke-width="${f1(w)}"/>`;
  }
  // distant hill with sparse lines
  g += `<path d="M20 62 C44 52 62 56 80 58 C100 54 118 50 140 56 L140 70 L20 70Z" fill="${K}"/>`;
  for (let y = 59; y < 69; y += 1.6) g += `<path d="M20 ${f1(y)} H140" stroke="${P}" stroke-width=".18" opacity=".8" stroke-dasharray="${Math.round(3 + r() * 6)} 2"/>`;
  // grass: white flicks
  for (let i = 0; i < 120; i++) {
    const x = 26 + r() * 108, y = 70 + r() * 18, h = 1.5 + r() * 3;
    g += `<path d="M${f1(x)} ${f1(y)} q${f1((r() - .5) * 1.5)} ${f1(-h * .6)} ${f1((r() - .5) * 2)} ${f1(-h)}" stroke="${P}" stroke-width=".3" fill="none"/>`;
  }
  // branch
  g += `<path d="M30 52 C50 56 68 60 98 66 L100 69 C70 64 50 60 30 56Z" fill="${K}"/>`;
  for (let i = 0; i < 12; i++) { const x = 34 + i * 5.4; g += `<path d="M${f1(x)} ${f1(54.8 + (x - 30) * .16)} l4 .8" stroke="${P}" stroke-width=".25"/>`; }
  // bird (thrush) on the branch
  g += `<path d="M66 60 C62 50 66 40 76 37 C80 34 86 34 89 37 L95 38 L89 40 C90 48 86 56 78 61 L60 72 L63 64Z" fill="${K}"/>`;
  for (let i = 0; i < 9; i++) {
    const t = i / 8;
    g += `<path d="M${f1(70 + t * 14)} ${f1(42 + t * 3)} C${f1(72 + t * 10)} ${f1(50 + t * 2)} ${f1(70 + t * 6)} ${f1(56)} ${f1(64 + t * 4)} ${f1(64 - t * 2)}" stroke="${P}" stroke-width="${f1(.22 + t * .2)}" fill="none"/>`;
  }
  // speckled breast
  for (let i = 0; i < 26; i++) { const a = r() * Math.PI, rr = r() * 8; g += `<circle cx="${f1(82 - Math.sin(a) * rr * .6)}" cy="${f1(48 + Math.cos(a) * rr * .8)}" r=".45" fill="${P}"/>`; }
  g += `<circle cx="85" cy="38.5" r="1.1" fill="${P}"/><circle cx="85.2" cy="38.5" r=".5" fill="${K}"/>`;
  g += `<path d="M71 61 L68 66 M74 60 L72 66" stroke="${P}" stroke-width=".3"/>`;
  return sv(`<defs>${clip}${wd}</defs>${bg(P)}<g clip-path="url(#${cid})"><g filter="url(#${wf})">${g}</g></g>`);
}

function cr_etching() {
  const r = rng(31), I = '#2C2119';
  let s = bg('#F2EBDB');
  // plate tone and plate mark
  s += `<rect x="12" y="8" width="136" height="84" fill="#E7DCC6" stroke="#C9B998" stroke-width=".8"/><path d="M12.6 91.4 H147.4 V8.6" stroke="#FBF7EE" stroke-width=".6" fill="none"/>`;
  let g = '';
  // horizon
  g += `<path d="${cr_jl(r, 16, 66, 144, 64, .4, 10)}"/>`;
  // rise
  g += `<path d="M70 66 C82 58 100 54 120 56 C130 57 138 60 144 62"/>`;
  // windmill body
  g += `<path d="${cr_jl(r, 104, 56, 107, 36, .3, 4)}"/><path d="${cr_jl(r, 116, 56, 113, 36, .3, 4)}"/><path d="M106 36 L110 31 L114 36Z"/>`;
  for (let i = 0; i < 16; i++) { const y = 38 + i * 1.15; g += `<path d="${cr_jl(r, 110 + (y - 36) * .05, y, 115.8 - (56 - y) * .15, y + .6, .2, 2)}" stroke-width=".25"/>`; }
  // sails
  const sx = 110, sy = 34;
  for (const a of [.6, 2.17, 3.74, 5.31]) {
    const ex = sx + Math.cos(a) * 24, ey = sy + Math.sin(a) * 24;
    g += `<path d="${cr_jl(r, sx, sy, ex, ey, .3, 5)}"/>`;
    const nx = -Math.sin(a) * 4, ny = Math.cos(a) * 4;
    g += `<path d="M${f1(sx + Math.cos(a) * 5 + nx)} ${f1(sy + Math.sin(a) * 5 + ny)} L${f1(ex + nx)} ${f1(ey + ny)}" stroke-width=".3"/>`;
    for (let k = 1; k < 6; k++) { const t = 5 + k * 3.6; g += `<path d="M${f1(sx + Math.cos(a) * t)} ${f1(sy + Math.sin(a) * t)} l${f1(nx)} ${f1(ny)}" stroke-width=".25"/>`; }
  }
  // clouds: delicate wandering lines
  for (let i = 0; i < 7; i++) g += `<path d="${cr_walk(r, 20 + r() * 60, 16 + r() * 22, 14, 2.2, (r() - .5) * .4, .9)}" stroke-width=".25" opacity=".8"/>`;
  // foreground scribbled hatching
  for (let i = 0; i < 70; i++) {
    const x = 16 + r() * 120, y = 70 + r() * 20;
    g += `<path d="${cr_jl(r, x, y, x + 3 + r() * 6, y - 1 - r() * 2, .4, 3)}" stroke-width=".3"/>`;
  }
  for (let i = 0; i < 40; i++) { const x = 72 + r() * 60, y = 57 + r() * 8; g += `<path d="${cr_jl(r, x, y, x + 4, y + 2, .3, 2)}" stroke-width=".25"/>`; }
  // water and a boat
  for (let i = 0; i < 12; i++) { const y = 68 + i * 1.6, x = 18 + r() * 30; g += `<path d="M${f1(x)} ${f1(y)} h${f1(8 + r() * 18)}" stroke-width=".25"/>`; }
  g += `<path d="M30 69 L46 69 L43 72 L33 72Z M38 69 L38 56 L45 67" stroke-width=".4"/>`;
  // little figures
  g += `<path d="M88 64 l.5 -6 l.5 6 M88.5 58 m0 -1.2 a1 1 0 1 0 .1 0 M92 64 l.4 -5 l.6 5 M92.4 59 m0 -1 a.9 .9 0 1 0 .1 0" stroke-width=".35"/>`;
  return sv(`${s}<g stroke="${I}" stroke-width=".45" fill="none" stroke-linecap="round">${g}</g>${grainOv(.15)}`);
}

function cr_engraving() {
  const P = '#EEF0E4', I = '#1D3A2C';
  const cid = U('crc'), hid = U('crc'), oid = U('crc');
  const head = 'M86 19 C76 18 69 24 68 32 C67 36 66 38 64 41 C63 43 63 44 65 45 L66 46 C65 48 66 49 67 50 C66 52 67 54 69 55 C70 58 72 60 76 60 L77 66 C74 70 66 74 58 80 L56 92 L106 92 L104 80 C98 74 92 70 90 64 C96 58 100 50 100 40 C100 27 94 19 86 19Z';
  const hair = 'M86 17 C75 16 68 23 68 30 C76 28 84 31 88 38 C90 46 92 52 90 60 C97 57 102 50 102 40 C102 26 95 17 86 17Z';
  const defs = `<clipPath id="${oid}"><ellipse cx="80" cy="50" rx="30" ry="40"/></clipPath><clipPath id="${cid}"><path d="${head}"/></clipPath><clipPath id="${hid}"><path d="${hair}"/></clipPath>`;
  let s = bg(P);
  // guilloche rosettes in the side panels and round the oval
  let gl = '';
  for (const cx of [22, 138]) for (let ph = 0; ph < 4; ph++) {
    let d = '';
    for (let t = 0; t <= 60; t++) { const a = t / 60 * Math.PI * 2, rr = 12 + 3 * Math.sin(9 * a + ph * 1.57); d += (t ? 'L' : 'M') + cr_n(cx + Math.cos(a) * rr) + ' ' + cr_n(50 + Math.sin(a) * rr); }
    gl += `<path d="${d}Z"/>`;
  }
  for (let ph = 0; ph < 3; ph++) {
    let d = '';
    for (let t = 0; t <= 100; t++) { const a = t / 100 * Math.PI * 2, k = 4 + 1.8 * Math.sin(25 * a + ph * 2.09); d += (t ? 'L' : 'M') + cr_n(80 + Math.cos(a) * (30 + k)) + ' ' + cr_n(50 + Math.sin(a) * (40 + k)); }
    gl += `<path d="${d}Z"/>`;
  }
  s += `<g stroke="${I}" stroke-width=".3" fill="none" opacity=".85">${gl}</g>`;
  s += `<rect x="3" y="3" width="154" height="94" fill="none" stroke="${I}" stroke-width="1.2"/><rect x="5" y="5" width="150" height="90" fill="none" stroke="${I}" stroke-width=".35"/>`;
  // inside the oval: ruled background lines
  let o = `<rect width="160" height="100" fill="${P}"/>`;
  let bl = '';
  for (let y = 10; y < 92; y += 1.4) bl += `M48 ${cr_n(y)}H112`;
  o += `<path d="${bl}" stroke="${I}" stroke-width=".35"/>`;
  o += `<path d="${head}" fill="${P}"/>`;
  // face: curved parallel lines that swell into the shadow side
  let face = '';
  for (let y = 18; y < 92; y += 1.9) {
    const P2 = [], W = [];
    for (let x = 60; x <= 105; x += 4.5) {
      P2.push([x, y + 2.4 * Math.sin((x - 60) / 45 * Math.PI)]);
      const sh = Math.max(0, (x - 72) / 28);
      W.push(y > 66 ? 1 : .24 + sh * sh * 1.2);
    }
    face += cr_ribbon(P2, W, I);
  }
  let nk = '';
  for (let x = 76; x < 96; x += 1.8) nk += `M${cr_n(x)} 57l4 10`;
  face += `<path d="${nk}" stroke="${I}" stroke-width=".4"/>`;
  o += `<g clip-path="url(#${cid})">${face}</g>`;
  // hair: flowing waves swept back
  let hr = `<path d="${hair}" fill="${P}"/>`;
  for (let i = 0; i < 17; i++) {
    const P2 = [], W = [];
    for (let x = 66; x <= 104; x += 3.2) {
      P2.push([x, 15 + i * 2.7 + 2.2 * Math.sin((x - 66) / 7 + i * .5) + (x - 66) * .12]);
      W.push(.45 + .7 * Math.sin((x - 66) / 38 * Math.PI));
    }
    hr += cr_ribbon(P2, W, I);
  }
  o += `<g clip-path="url(#${hid})">${hr}</g>`;
  o += `<path d="${head}" fill="none" stroke="${I}" stroke-width=".6"/><path d="${hair}" fill="none" stroke="${I}" stroke-width=".4"/>`;
  o += `<path d="M71 39.5 C72.5 38.6 74 38.6 75 39.6" stroke="${I}" stroke-width=".7" fill="none"/>`;
  s += `<g clip-path="url(#${oid})">${o}</g><ellipse cx="80" cy="50" rx="30" ry="40" fill="none" stroke="${I}" stroke-width=".9"/>`;
  return sv(`<defs>${defs}</defs>${s}`);
}

function cr_mezzotint() {
  const [gd, gf] = cr_grainF(1.3, 5, -2.2, 9);
  const bid = U('crb'), g1 = U('crr'), g2 = U('crr'), g3 = U('crr');
  const grad = (id, c) => `<radialGradient id="${id}" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="${c}"/><stop offset=".55" stop-color="#5B4C3E"/><stop offset="1" stop-color="#0E0B09"/></radialGradient>`;
  const defs = `${gd}<filter id="${bid}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation=".9"/></filter>${grad(g1, '#E9DCC4')}${grad(g2, '#D7C7A9')}${grad(g3, '#F3EAD8')}`;
  let s = bg('#0C0A09');
  let f = '';
  // table edge catching light
  f += `<path d="M0 80 L160 76 L160 80 L0 84Z" fill="#6E5E4C" opacity=".8"/><path d="M0 84 L160 80 L160 100 L0 100Z" fill="#1C1713"/>`;
  // pear
  f += `<path d="M56 79 C38 79 34 66 42 58 C47 53 48 46 50 40 C52 34 60 34 62 40 C64 47 64 52 70 58 C78 66 74 79 56 79Z" fill="url(#${g1})"/>`;
  f += `<path d="M56 36 C56 31 58 28 61 26" stroke="#3A3028" stroke-width="1.4" fill="none"/>`;
  // cup
  f += `<path d="M84 44 L120 44 C120 64 112 76 102 76 C92 76 84 64 84 44Z" fill="url(#${g2})"/><ellipse cx="102" cy="44" rx="18" ry="4" fill="#2A221C"/><path d="M119 50 C128 50 128 62 116 64" stroke="#8A7A66" stroke-width="2.2" fill="none"/>`;
  // walnut
  f += `<ellipse cx="132" cy="75" rx="9" ry="6" fill="url(#${g3})"/>`;
  s += `<g filter="url(#${bid})">${f}</g>`;
  // sharp scraped highlights
  s += `<path d="M46 60 C44 64 45 70 49 73" stroke="#F6EEDD" stroke-width="1.2" fill="none" opacity=".8" stroke-linecap="round"/><path d="M89 48 C89 58 92 66 96 70" stroke="#F6EEDD" stroke-width="1.1" fill="none" opacity=".7" stroke-linecap="round"/><circle cx="129" cy="72" r="1.3" fill="#FBF5E8" opacity=".8"/>`;
  // velvet burr: dark grain over everything
  s += `<rect width="160" height="100" fill="#000" filter="url(#${gf})" opacity=".55"/>`;
  return sv(`<defs>${defs}</defs>${s}${vig(.8)}`);
}

function cr_litho() {
  const r = rng(51);
  const [wd, wf] = wob(1.4, .1, 2);
  const [sd, sf] = cr_speckF(.9, 7, -3.6, 5);
  let s = bg('#E7D9B0');
  // olive wall with crachis spatter
  s += `<path d="M0 0 H160 V58 L0 70Z" fill="#8F9A55"/>`;
  let sp = '';
  for (let i = 0; i < 300; i++) { const x = r() * 160, y = r() * 66; if (y > 70 - x * .075) continue; sp += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(.25 + r() * .55)}" fill="${r() < .7 ? '#4F5A2A' : '#C2573A'}"/>`; }
  s += sp;
  // ochre floor, crayon texture
  s += `<path d="M0 70 L160 58 V100 H0Z" fill="#D9A43C" filter="url(#${sf})"/>`;
  for (let i = 0; i < 30; i++) { const x = r() * 160, y = 66 + r() * 34; s += `<path d="M${f1(x)} ${f1(y)} l${f1(8 + r() * 10)} ${f1(-1 - r())}" stroke="#B9822A" stroke-width=".6" opacity=".7"/>`; }
  let g = '';
  // dancer: white petticoat flurry, kicking leg
  g += `<path d="M92 56 C80 50 76 40 86 36 C90 44 98 40 104 44 C112 40 120 46 116 54 C110 60 100 60 92 56Z" fill="#FAF6EC" stroke="#1A1714" stroke-width=".8"/>`;
  for (let i = 0; i < 6; i++) g += `<path d="M${84 + i * 5} ${42 + Math.sin(i) * 2} q2 4 5 2" stroke="#1A1714" stroke-width=".5" fill="none"/>`;
  g += `<path d="M104 44 L118 18 L121 19 L108 46Z" fill="#1A1714"/><path d="M117 17 l6 -2 l1 3 l-5 2Z" fill="#1A1714"/>`;
  g += `<path d="M98 57 L96 76 L99 76 L102 57Z" fill="#1A1714"/>`;
  g += `<path d="M92 46 C90 38 92 30 98 28 C104 30 104 38 102 47Z" fill="#C8382A"/><path d="M93 32 C88 30 86 36 84 40 M103 32 C108 34 110 38 108 42" stroke="#F1D9BE" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  g += `<circle cx="97" cy="24" r="4.2" fill="#F1D9BE"/><path d="M93 22 C93 17 101 16 102 21 C100 20 97 20 93 22Z" fill="#D9612E"/>`;
  // big black silhouette of a man in a top hat, cropped at the edge
  g += `<path d="M0 100 L0 40 C4 34 12 34 18 36 L22 30 L20 12 L34 10 L36 30 L42 34 C46 40 44 48 40 52 C48 60 52 76 50 100Z" fill="#141210"/>`;
  g += `<path d="M14 12 L42 9 L42 12 L14 15Z" fill="#141210"/>`;
  g += `<path d="M38 44 C50 46 52 56 46 64 L40 58Z" fill="#C8382A"/>`;
  s += `<g filter="url(#${wf})">${g}</g>`;
  // lettering, hand drawn
  s += `<text x="148" y="20" text-anchor="end" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-weight="700" font-size="17" fill="#C8382A" filter="url(#${wf})">Bal</text>`;
  return sv(`<defs>${wd}${sd}</defs>${s}${grainOv(.25)}`);
}

function cr_letterpress() {
  const [sd, sf] = cr_speckF(.7, 9, -6.1, 3);
  const [sd2, sf2] = cr_speckF(.5, 8, -5, 8);
  const P = '#F2ECDD';
  let s = bg(P);
  // paper fibres
  const r = rng(61);
  for (let i = 0; i < 40; i++) { const x = r() * 160, y = r() * 100; s += `<path d="M${f1(x)} ${f1(y)} q2 ${f1(r() - .5)} 4 ${f1(r() - .5)}" stroke="#D9CFBA" stroke-width=".3" fill="none"/>`; }
  // letters built from blocks (wood type gothic with slab serifs)
  const L = [
    [[24, 22, 12, 44], [21, 20, 18, 4], [21, 64, 18, 4]],
    [[44, 22, 11, 44], [72, 22, 11, 44], [41, 20, 17, 4], [69, 20, 17, 4], [41, 64, 17, 4], [69, 64, 17, 4]],
    [[93, 22, 11, 44], [90, 20, 17, 4], [90, 64, 17, 4], [118, 20, 20, 4], [118, 64, 20, 4]]];
  let shapes = '';
  for (const l of L) for (const b of l) shapes += `<rect x="${b[0]}" y="${b[1]}" width="${b[2]}" height="${b[3]}"/>`;
  shapes += `<polygon points="44,22 55,22 83,66 72,66"/><polygon points="104,47 124,22 136,22 108,54"/><polygon points="108,42 138,66 125,66 104,50"/>`;
  // deep impression: pale bite around, then ink with squeeze at the edges
  s += `<g fill="#D6CCB6" transform="translate(.7 .8)">${shapes}</g><g fill="#FFFDF7" transform="translate(-.4 -.4)">${shapes}</g>`;
  s += `<g fill="#26221F" stroke="#0E0C0B" stroke-width=".9" filter="url(#${sf})">${shapes}</g>`;
  // red rule and ornaments
  s += `<g filter="url(#${sf2})"><rect x="20" y="74" width="120" height="5" fill="#C23B2E"/><rect x="20" y="12" width="120" height="1.6" fill="#C23B2E"/>`;
  for (let i = 0; i < 7; i++) { const x = 32 + i * 16; s += `<polygon points="${x},84 ${x + 2.4},86.5 ${x},89 ${x - 2.4},86.5" fill="#C23B2E"/>`; }
  s += `</g>`;
  return sv(`<defs>${sd}${sd2}</defs>${s}${grainOv(.2)}`);
}

function cr_pochoir() {
  const [md, mf] = cr_mottleF(.09, .62, 11);
  const r = rng(71);
  let s = bg('#F1E8D4');
  // gold dots wallpaper
  for (let y = 8; y < 70; y += 10) for (let x = (y / 10 % 2) * 5 + 6; x < 160; x += 10) s += `<circle cx="${x}" cy="${y}" r=".9" fill="#C9A13B"/>`;
  s += `<rect x="0" y="80" width="160" height="20" fill="#2B2E4A"/>`;
  // colour stencils: flat jewel tones, darker pooled edges
  const C = (d, c, e) => `<path d="${d}" fill="${c}" stroke="${e}" stroke-width=".9" stroke-opacity=".6" filter="url(#${mf})"/>`;
  let c = '';
  // long jade coat
  c += C('M50 30 C44 40 42 60 38 84 L74 84 C70 60 68 40 62 30Z', '#1F8A70', '#0E5644');
  // fur collar and hem
  c += C('M48 30 C52 25 60 25 64 30 C62 36 50 36 48 30Z', '#EDE6DA', '#B8AE9E');
  c += C('M38 82 C48 79 64 79 74 82 L74 86 L38 86Z', '#EDE6DA', '#B8AE9E');
  // face, cloche hat
  c += C('M52 22 C52 15 60 15 60 22 C60 27 52 27 52 22Z', '#F3D9C2', '#C9A68A');
  c += C('M49 19 C49 10 63 9 64 18 L66 20 L48 21Z', '#1B1B26', '#000');
  // arm reaching to the fan
  c += C('M60 34 C64 38 66 40 68 41 L66 44 C62 42 58 40 56 36Z', '#17735C', '#0E5644');
  // coral fan
  c += C('M66 40 L84 28 C88 34 88 42 84 48Z', '#E5604A', '#A53A2B');
  // vase of flowers
  c += C('M112 84 C104 74 106 62 116 58 L124 58 C134 62 136 74 128 84Z', '#2F4C9E', '#1C2E66');
  c += C('M114 58 C108 46 100 40 92 38 C98 44 104 52 110 58Z', '#3E8A4A', '#245C2E');
  c += C('M126 58 C132 46 140 42 148 42 C142 48 136 54 130 58Z', '#3E8A4A', '#245C2E');
  for (const [x, y, col, e] of [[104, 34, '#E5604A', '#A53A2B'], [120, 26, '#E8B530', '#A97E14'], [138, 34, '#C94A7E', '#8A2B52'], [128, 44, '#E8B530', '#A97E14'], [110, 46, '#C94A7E', '#8A2B52']]) {
    c += C(`M${x} ${y - 7} C${x + 8} ${y - 7} ${x + 8} ${y + 7} ${x} ${y + 7} C${x - 8} ${y + 7} ${x - 8} ${y - 7} ${x} ${y - 7}Z`, col, e);
  }
  s += c;
  // black key line, slightly out of step with the colour
  let k = '';
  k += `<path d="M50.8 30.8 C44.8 40.8 42.8 60.8 38.8 84.8 M62.8 30.8 C68.8 40.8 70.8 60.8 74.8 84.8 M56 34 L58 82"/>`;
  k += `<path d="M66.8 40.8 L84.8 28.8 M67 41 L85 34 M67 41 L86 40 M67 41 L84.8 48.8"/>`;
  for (const [x, y] of [[104, 34], [120, 26], [138, 34], [128, 44], [110, 46]]) k += `<circle cx="${x + .7}" cy="${y + .7}" r="3" /><path d="M${x + .7} ${y + 3.7} L${x + .7 + (120 - x) * .3} 58"/>`;
  s += `<g stroke="#121212" stroke-width=".5" fill="none">${k}</g>`;
  s += `<circle cx="57.7" cy="24.4" r=".7" fill="#C2303A"/>`;
  return sv(`<defs>${md}</defs>${s}${grainOv(.18)}`);
}

function cr_monotype() {
  const [wd, wf] = wob(5, .05, 7);
  const bid = U('crb'), bid2 = U('crb');
  const defs = `${wd}<filter id="${bid}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.6"/></filter><filter id="${bid2}" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".04 .3" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="6"/><feGaussianBlur stdDeviation=".5"/></filter>`;
  const r = rng(81);
  let s = bg('#EEE7D8');
  let ink = `<rect x="10" y="8" width="140" height="84" fill="#25283A"/>`;
  // ink brushed thinner in the upper sky
  ink += `<path d="M10 8 H150 V40 C110 34 60 44 10 38Z" fill="#454A60"/>`;
  s += `<g filter="url(#${wf})">${ink}</g>`;
  // wiped-out light: sky glow and a road, plus rag streaks
  let w = '';
  w += `<path d="M14 46 C50 40 100 38 146 46 C120 52 50 54 14 50Z" fill="#F3E2C4"/>`;
  w += `<ellipse cx="112" cy="28" rx="10" ry="8" fill="#F6EBD6"/>`;
  w += `<path d="M64 92 C74 80 82 66 86 56 L90 56 C90 66 92 80 100 92Z" fill="#E5D3B2"/>`;
  s += `<g filter="url(#${bid})" opacity=".92">${w}</g>`;
  let st = '';
  for (let i = 0; i < 14; i++) { const y = 12 + r() * 30; st += `<path d="M${f1(14 + r() * 40)} ${f1(y)} l${f1(30 + r() * 50)} ${f1((r() - .5) * 3)}" stroke="#EBDDC4" stroke-width="${f1(.6 + r() * 1.4)}" opacity="${f1(.25 + r() * .3)}"/>`; }
  s += `<g filter="url(#${bid2})">${st}</g>`;
  // dark hill masses and blot trees, soft and pooled
  let h = `<path d="M10 56 C40 48 60 52 80 58 C60 66 30 66 10 70Z" fill="#1A1C2A"/><path d="M96 58 C116 50 134 52 150 54 L150 72 C130 68 110 64 96 58Z" fill="#1A1C2A"/>`;
  for (let i = 0; i < 6; i++) { const x = 22 + i * 9 + r() * 4; h += `<ellipse cx="${f1(x)}" cy="${f1(52 - r() * 6)}" rx="${f1(3 + r() * 2)}" ry="${f1(5 + r() * 3)}" fill="#14161F"/>`; }
  h += `<path d="M74 52 C76 46 80 46 82 52" fill="#B97E5E"/>`;
  s += `<g filter="url(#${bid2})">${h}</g>`;
  // a touch of colour added by hand
  s += `<g filter="url(#${bid})"><ellipse cx="40" cy="46" rx="14" ry="2.5" fill="#D69A73" opacity=".7"/><ellipse cx="124" cy="80" rx="12" ry="5" fill="#5C7A6C" opacity=".7"/></g>`;
  return sv(`<defs>${defs}</defs>${s}${grainOv(.3)}`);
}

function cr_aquatint() {
  const [gd, gf] = cr_grainF(2.2, 6, -2.2, 13);
  const [gd2, gf2] = cr_grainF(2.2, 6, -3.1, 21);
  const bid = U('crb');
  const r = rng(91), I = '#2A1E14';
  let s = bg('#EFE4CA');
  s += `<rect x="8" y="6" width="144" height="88" fill="none" stroke="#CDBB97" stroke-width=".7"/>`;
  // tonal steps: each a flat shape bitten through a grainy resin ground
  s += `<rect x="8" y="6" width="144" height="88" fill="#6A5640" filter="url(#${gf2})"/>`;
  s += `<path d="M8 6H152V66C120 56 96 50 70 54C44 58 24 52 8 48Z" fill="#4A3A2A" filter="url(#${gf})"/>`;
  s += `<path d="M8 6H152V34C110 24 60 32 8 24Z" fill="#20160E" filter="url(#${gf})"/>`;
  s += `<path d="M8 6H152V20C110 14 60 20 8 14Z" fill="#20160E" filter="url(#${gf2})"/>`;
  // pool of light behind the sleeper
  s += `<g filter="url(#${bid})"><ellipse cx="66" cy="70" rx="34" ry="16" fill="#EFE4CA" opacity=".85"/></g>`;
  // desk
  s += `<path d="M56 68H112V72H56Z" fill="#3A2C1E"/><path d="M60 72V92M108 72V92" stroke="${I}" stroke-width="1"/>`;
  // sleeper slumped forward, head on folded arms
  const body = 'M34 92C30 80 34 66 46 60C52 57 58 58 62 61L70 66L60 69C56 74 54 84 56 92Z';
  s += `<path d="${body}" fill="#3A2C1E" filter="url(#${gf})"/><path d="${body}" fill="none" stroke="${I}" stroke-width=".5"/>`;
  s += `<ellipse cx="68" cy="66.5" rx="9" ry="2.6" fill="#3A2C1E" stroke="${I}" stroke-width=".4"/>`;
  s += `<circle cx="64" cy="61" r="5" fill="#2A1E14"/>`;
  // owl perched on the desk, watching
  const owl = 'M98 68C93 63 93 54 98 50L99 45L102 49L106 49L109 45L110 50C115 54 115 63 110 68Z';
  s += `<path d="${owl}" fill="#2E2318" filter="url(#${gf})"/><path d="${owl}" fill="none" stroke="${I}" stroke-width=".5"/>`;
  s += `<circle cx="101" cy="54.5" r="2" fill="#EFE4CA"/><circle cx="107" cy="54.5" r="2" fill="#EFE4CA"/><circle cx="101" cy="54.5" r=".8" fill="${I}"/><circle cx="107" cy="54.5" r=".8" fill="${I}"/>`;
  // bats: etched shapes over the tone
  for (let i = 0; i < 9; i++) {
    const x = 60 + r() * 84, y = 12 + r() * 34, k = .5 + r() * .7;
    s += `<path d="M${f1(x)} ${f1(y)}q${f1(-4 * k)} ${f1(-4 * k)} ${f1(-9 * k)} ${f1(-1 * k)}q${f1(2 * k)} ${f1(1 * k)} ${f1(2 * k)} ${f1(3 * k)}q${f1(3 * k)} ${f1(-1 * k)} ${f1(7 * k)} ${f1(-2 * k)}q${f1(4 * k)} ${f1(1 * k)} ${f1(7 * k)} ${f1(2 * k)}q0 ${f1(-2 * k)} ${f1(2 * k)} ${f1(-3 * k)}q${f1(-5 * k)} ${f1(-3 * k)} ${f1(-9 * k)} ${f1(1 * k)}Z" fill="#120C08"/>`;
  }
  // etched hatching on the floor
  for (let i = 0; i < 26; i++) { const x = 12 + r() * 130; s += `<path d="M${f1(x)} 92l${f1(4 + r() * 3)} -3" stroke="${I}" stroke-width=".3"/>`; }
  return sv(`<defs>${gd}${gd2}<filter id="${bid}" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="5"/></filter></defs>${s}`);
}

/* ===================== SURFACES & CRAFTS ===================== */

function cr_fresco() {
  const [md, mf] = cr_mottleF(.06, .55, 3);
  const r = rng(101);
  let s = bg('#E8DCC4');
  // Pompeian red panel, black dado, ochre borders
  s += `<rect x="0" y="0" width="160" height="100" fill="#E3CFA6"/>`;
  s += `<rect x="18" y="6" width="124" height="66" fill="#A63B2A"/><rect x="18" y="6" width="124" height="66" fill="#C55A3F" filter="url(#${mf})"/>`;
  s += `<rect x="22" y="10" width="116" height="58" fill="none" stroke="#E2B65E" stroke-width="1"/><rect x="25" y="13" width="110" height="52" fill="none" stroke="#E7D9B8" stroke-width=".4"/>`;
  s += `<rect x="0" y="76" width="160" height="24" fill="#2A2420"/><rect x="0" y="76" width="160" height="24" fill="#4A403A" filter="url(#${mf})"/>`;
  s += `<rect x="0" y="72" width="160" height="4" fill="#D7A944"/>`;
  s += `<rect x="4" y="6" width="10" height="66" fill="#C99A4A"/><rect x="146" y="6" width="10" height="66" fill="#C99A4A"/>`;
  // floating maenad: chalky pale robe, flowing scarf
  let f = '';
  f += `<path d="M80 22 C76 22 74 26 76 30 C70 34 66 44 64 56 L72 56 L76 46 L80 58 L92 56 C88 46 86 36 84 30 C86 26 84 22 80 22Z" fill="#EDE2C8"/>`;
  f += `<path d="M64 36 C70 30 78 32 84 30 C92 28 98 30 104 26" stroke="#7FA39A" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  f += `<path d="M76 30 C78 34 82 34 84 30" fill="#D9B08C"/><circle cx="80" cy="25" r="3.4" fill="#D9AE8A"/><path d="M77 23 C78 20 83 20 84 24" fill="#5A3A22"/>`;
  f += `<path d="M72 56 L70 62 M88 56 L92 62" stroke="#D9AE8A" stroke-width="1.4" stroke-linecap="round"/>`;
  f += `<path d="M70 40 C74 44 78 46 82 44 M76 50 C80 52 84 52 88 50" stroke="#C8B897" stroke-width=".7" fill="none"/>`;
  s += `<g opacity=".93">${f}</g>`;
  // chalky bloom over the whole wall
  s += `<rect width="160" height="100" fill="#F4EDE0" filter="url(#${mf})" opacity=".22"/>`;
  // losses: patches where the plaster is gone
  for (const [x, y, rx, ry] of [[132, 60, 14, 10], [26, 22, 8, 6], [104, 86, 16, 8]]) {
    const r2 = rng(x * 7 + y);
    let p = [];
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, k = .7 + r2() * .5; p.push([x + Math.cos(a) * rx * k, y + Math.sin(a) * ry * k]); }
    s += `<polygon points="${pts(p)}" fill="#D3C6AE" stroke="#B5A88E" stroke-width=".5"/>`;
  }
  // cracks
  for (let i = 0; i < 6; i++) s += `<path d="${cr_walk(r, r() * 160, r() * 100, 18, 3, r() * 6.28, 1.1)}" stroke="#4A3A2C" stroke-width=".35" fill="none" opacity=".7"/>`;
  return sv(`<defs>${md}</defs>${s}${grainOv(.4)}`);
}

function cr_tempera() {
  const gid = U('crl'), fid = U('crr'), cid = U('crc');
  const r = rng(111);
  const facep = 'M80 30C92 30 98 40 97 52C96 64 88 72 80 72C72 72 64 64 64 52C63 40 68 30 80 30Z';
  const defs = `<linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F3D27A"/><stop offset=".5" stop-color="#C9962E"/><stop offset="1" stop-color="#E9C463"/></linearGradient><radialGradient id="${fid}" cx=".42" cy=".4" r=".62"><stop offset="0" stop-color="#F3DCC4"/><stop offset=".55" stop-color="#E3BC9C" stop-opacity=".9"/><stop offset="1" stop-color="#C9A88A" stop-opacity="0"/></radialGradient><clipPath id="${cid}"><path d="${facep}"/></clipPath>`;
  let s = `<rect width="160" height="100" fill="url(#${gid})"/>`;
  // incised halo
  s += `<circle cx="80" cy="44" r="30" fill="none" stroke="#8A6118" stroke-width=".6"/><circle cx="80" cy="44" r="27" fill="none" stroke="#8A6118" stroke-width=".4"/>`;
  // ultramarine mantle with fine gold hatching along the folds
  s += `<path d="M38 100C40 70 52 30 80 22C108 30 120 70 122 100Z" fill="#2E4A86"/>`;
  for (const [x0, y0, x1, y1] of [[58, 60, 50, 98], [102, 60, 110, 98], [70, 76, 66, 98], [92, 76, 96, 98]]) {
    for (let k = 0; k < 6; k++) s += `<path d="M${f1(x0 + k * 1.3)} ${f1(y0 + k * 2)}L${f1(x1 + k * 1.3)} ${f1(y1)}" stroke="#1E3366" stroke-width=".35" opacity=".8"/>`;
  }
  s += `<path d="M40 100C42 72 54 34 80 26C106 34 118 72 120 100" fill="none" stroke="#E9C463" stroke-width=".9"/>`;
  // face: green underpaint, flesh laid over it, then fine hatching
  s += `<path d="${facep}" fill="#8E9C7A"/><path d="${facep}" fill="url(#${fid})"/>`;
  const hb = { '#FBEAD6': '', '#E2BE9E': '', '#7F8E6C': '' };
  for (let i = 0; i < 420; i++) {
    const x = 62 + r() * 36, y = 30 + r() * 42;
    const light = 1 - Math.hypot((x - 76) / 22, (y - 46) / 28);
    hb[light > .5 ? '#FBEAD6' : light > .2 ? '#E2BE9E' : '#7F8E6C'] += `M${f1(x)} ${f1(y)}l2.2 -1.1`;
  }
  s += `<g clip-path="url(#${cid})" stroke-width=".4" stroke-linecap="round" fill="none">${Object.entries(hb).map(([c, d]) => `<path d="${d}" stroke="${c}"/>`).join('')}</g>`;
  // features drawn with a fine brush
  s += `<path d="M70 48C72 46 75 46 77 48M83 48C85 46 88 46 90 48" stroke="#5A3E2A" stroke-width=".7" fill="none"/>`;
  s += `<path d="M71 50.5C73 49 75 49 76.5 50.5C75 51.5 73 51.5 71 50.5ZM83.5 50.5C85 49 87 49 89 50.5C87 51.5 85 51.5 83.5 50.5Z" fill="#3A2A20"/>`;
  s += `<path d="M80 50C80 55 79 58 78 60C79 61 81 61 82 60" stroke="#8A6448" stroke-width=".55" fill="none"/>`;
  s += `<path d="M76 65C78 64 82 64 84 65C82 66.5 78 66.5 76 65Z" fill="#B5534A"/>`;
  s += `<ellipse cx="72" cy="58" rx="3" ry="2" fill="#E59B8A" opacity=".35"/><ellipse cx="88" cy="58" rx="3" ry="2" fill="#E59B8A" opacity=".35"/>`;
  s += `<path d="M64 52C64 38 70 30 80 29C90 30 96 38 97 52" stroke="#F2EAD8" stroke-width="1.2" fill="none" opacity=".8"/>`;
  // fine craquelure
  for (let i = 0; i < 4; i++) s += `<path d="${cr_walk(r, r() * 160, r() * 100, 10, 3, r() * 6.28, .9)}" stroke="#6A4A18" stroke-width=".25" fill="none" opacity=".5"/>`;
  return sv(`<defs>${defs}</defs>${s}${grainOv(.2)}`);
}

function cr_encaustic() {
  const r = rng(121);
  const gid = U('crl');
  const defs = `<linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".3" stop-color="#fff" stop-opacity=".16"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/></linearGradient>`;
  let s = bg('#5E4128');
  for (let i = 0; i < 14; i++) s += `<path d="M0 ${f1(i * 7.5 + r() * 3)} C50 ${f1(i * 7.5 + r() * 6)} 110 ${f1(i * 7.5 + r() * 6)} 160 ${f1(i * 7.5)}" stroke="#4A3220" stroke-width=".6" fill="none"/>`;
  // panel with waxy background
  s += `<rect x="36" y="4" width="88" height="96" fill="#9A8A64"/>`;
  const dab = (x, y, rx, ry, a, c, o) => `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(rx)}" ry="${f1(ry)}" transform="rotate(${f1(a)} ${f1(x)} ${f1(y)})" fill="${c}" opacity="${o}"/>`;
  for (let i = 0; i < 40; i++) s += dab(38 + r() * 84, 6 + r() * 92, 3 + r() * 4, 1.5 + r() * 2, r() * 180, pick(r, ['#A8986E', '#8C7C58', '#B4A57C']), .35);
  // tunic with clavus stripe
  s += `<path d="M44 100 C46 84 58 76 80 74 C102 76 114 84 116 100Z" fill="#E9DFCB"/><path d="M98 78 L104 100 L110 100 L104 80Z" fill="#7A2E3A"/>`;
  for (let i = 0; i < 30; i++) s += dab(50 + r() * 60, 82 + r() * 16, 3 + r() * 3, 1.2, -10 + r() * 20, pick(r, ['#F6EEDC', '#D8CCB4']), .6);
  // neck and face built from translucent wax strokes following the form
  s += `<path d="M72 64 L88 64 L90 78 L70 78Z" fill="#9B6A42"/>`;
  s += `<ellipse cx="80" cy="44" rx="17" ry="23" fill="#A9774C"/>`;
  for (let i = 0; i < 75; i++) {
    const a = r() * Math.PI * 2, d = Math.sqrt(r());
    const x = 80 + Math.cos(a) * d * 15, y = 44 + Math.sin(a) * d * 21;
    const lit = (x < 80 ? .4 : 0) + (1 - d) * .6;
    s += dab(x, y, 2.4 + r() * 2, 1 + r(), Math.atan2(y - 44, x - 80) * 57.3 + 90, lit > .6 ? '#D9A879' : lit > .35 ? '#BE8A5C' : '#7E5434', .45);
  }
  // black curls
  for (let i = 0; i < 28; i++) { const a = Math.PI * (1.05 + r() * .9), rr = 17 + r() * 4; s += `<circle cx="${f1(80 + Math.cos(a) * rr * .95)}" cy="${f1(42 + Math.sin(a) * rr * 1.05)}" r="${f1(3 + r() * 1.8)}" fill="${pick(r, ['#1C1410', '#2A1E16'])}"/>`; }
  // big dark eyes, straight nose, small full mouth
  for (const x of [73, 87]) {
    s += `<path d="M${x - 5} 41 C${x - 3} 37 ${x + 3} 37 ${x + 5} 41 C${x + 3} 44 ${x - 3} 44 ${x - 5} 41Z" fill="#F2E6D2"/><circle cx="${x}" cy="40.8" r="2.6" fill="#2A1A12"/><circle cx="${x + .8}" cy="40" r=".7" fill="#fff"/>`;
    s += `<path d="M${x - 5} 36 C${x - 2} 33.5 ${x + 2} 33.5 ${x + 5} 36" stroke="#2A1A12" stroke-width="1" fill="none"/>`;
  }
  s += `<path d="M80 42 L78 52 C79 53 81 53 82 52" stroke="#5E3A22" stroke-width=".7" fill="none"/><path d="M75 58 C78 56.5 82 56.5 85 58 C82 60 78 60 75 58Z" fill="#8E3A30"/>`;
  // wax sheen
  s += `<rect x="36" y="4" width="88" height="96" fill="url(#${gid})"/>`;
  for (let i = 0; i < 14; i++) s += `<ellipse cx="${f1(40 + r() * 80)}" cy="${f1(8 + r() * 88)}" rx="${f1(1.5 + r() * 2)}" ry=".5" fill="#FFF8E8" opacity=".35"/>`;
  return sv(`<defs>${defs}</defs>${s}${vig(.5)}`);
}

// tessera: small square centred at x,y rotated by angle a
function cr_tess(x, y, a, s, c) {
  if (!a) return `<rect x="${f1(x - s / 2)}" y="${f1(y - s / 2)}" width="${f1(s)}" height="${f1(s)}" fill="${c}"/>`;
  const ca = Math.cos(a) * s / 2, sa = Math.sin(a) * s / 2;
  return `<polygon points="${pts([[x - ca + sa, y - sa - ca], [x + ca + sa, y + sa - ca], [x + ca - sa, y + sa + ca], [x - ca - sa, y - sa + ca]])}" fill="${c}"/>`;
}
// a ring of tesserae as a dashed ellipse stroke: base colour, then every 3rd/5th tile varied
function cr_tring(cx, cy, rx, ry, T, S, c, c2, c3) {
  const e = `cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="none" stroke-width="${T}"`;
  return `<ellipse ${e} stroke="${c}" stroke-dasharray="${f1(T)} ${f1(S - T)}"/>` +
    (c2 ? `<ellipse ${e} stroke="${c2}" stroke-dasharray="${f1(T)} ${f1(S * 3 - T)}" stroke-dashoffset="${f1(-S)}"/>` : '') +
    (c3 ? `<ellipse ${e} stroke="${c3}" stroke-dasharray="${f1(T)} ${f1(S * 5 - T)}" stroke-dashoffset="${f1(-S * 2)}"/>` : '');
}
function cr_mosaic() {
  const r = rng(131), S = 3.9, T = 3.3, G = '#8C8270';
  const pid = U('crp'), bid = U('crc');
  const shades = ['#EFE6D4', '#E6DCC6', '#F3ECDD', '#E9E0CB', '#EDE3CC'];
  let pat = `<pattern id="${pid}" width="${f1(S * 5)}" height="${f1(S * 3)}" patternUnits="userSpaceOnUse"><rect width="${f1(S * 5)}" height="${f1(S * 3)}" fill="${G}"/>`;
  for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) pat += `<rect x="${f1(i * S + .3 + (r() - .5) * .3)}" y="${f1(j * S + .3)}" width="${T}" height="${T}" fill="${shades[(i * 2 + j * 3) % 5]}"/>`;
  pat += `</pattern>`;
  const cx = 72, cy = 52, RX = 40, RY = 20;
  const defs = `${pat}<clipPath id="${bid}"><rect x="0" y="${cy + 5}" width="160" height="60"/></clipPath>`;
  let s = `<rect width="160" height="100" fill="url(#${pid})"/>`;
  // border: rows of tiles as dashed strokes
  s += `<rect x="6" y="6" width="148" height="88" fill="none" stroke="${G}" stroke-width="12"/>`;
  s += `<rect x="2.2" y="2.2" width="155.6" height="95.6" fill="none" stroke="#26221E" stroke-width="${T}" stroke-dasharray="${T} ${f1(S - T)}"/>`;
  s += `<rect x="6.1" y="6.1" width="147.8" height="87.8" fill="none" stroke="#B4543A" stroke-width="${T}" stroke-dasharray="${T} ${f1(S - T)}"/>`;
  s += `<rect x="10" y="10" width="140" height="80" fill="none" stroke="#26221E" stroke-width="${T}" stroke-dasharray="${T} ${f1(S * 2 - T)}"/>`;
  // grout around the figure, then halo rows that echo its outline (andamento)
  s += `<ellipse cx="${cx}" cy="${cy}" rx="${RX + 9}" ry="${RY + 9}" fill="${G}"/><path d="M106 52L131 28L131 76Z" fill="${G}" stroke="${G}" stroke-width="5" stroke-linejoin="round"/>`;
  s += cr_tring(cx, cy, RX + 7, RY + 7, T, S, '#EFE6D4', '#E3D8C0', '#F5EFE2') + cr_tring(cx, cy, RX + 3.2, RY + 3.2, T, S, '#E9E0CB', '#F3ECDD');
  // tail: little grid of tiles
  for (let i = 0; i < 6; i++) for (let j = -i - 1; j <= i + 1; j++) {
    s += cr_tess(110 + i * S, cy + j * S * .92, 0, T, Math.abs(j) > i ? '#1F2A36' : pick(r, ['#2F6C8E', '#3D82A3', '#4B91AF']));
  }
  // body rings: dark outline, blue back, cream belly
  let body = '', belly = '';
  for (let k = 0; k < 5; k++) {
    const rx = RX - k * S, ry = RY - k * S;
    if (k === 0) { body += cr_tring(cx, cy, rx, ry, T, S, '#1F2A36', '#2A3644'); continue; }
    body += cr_tring(cx, cy, rx, ry, T, S, k < 2 ? '#2A5677' : '#3E86A8', k < 2 ? '#24506F' : '#5A9FB8', '#4B91AF');
    belly += cr_tring(cx, cy, rx, ry, T, S, '#DCCB9C', '#E7DBB6', '#CDBB86');
  }
  // spine row along the middle
  for (let x = cx - 18; x <= cx + 18; x += S) body += cr_tess(x, cy, 0, T, pick(r, ['#5A9FB8', '#6BAFC4']));
  s += `<ellipse cx="${cx}" cy="${cy}" rx="${RX}" ry="${RY}" fill="${G}"/>${body}<g clip-path="url(#${bid})">${belly}</g>`;
  // red fin and eye
  for (let i = -2; i <= 2; i++) { const a = i * .42; s += cr_tess(46 + Math.cos(a) * 11, cy + Math.sin(a) * 11, a, T, '#B4543A'); }
  s += cr_tess(44, 46, 0, T, '#F7F1E4') + `<circle cx="44" cy="46" r="1.1" fill="#1A1A1A"/>`;
  return sv(`<defs>${defs}</defs>${s}${grainOv(.25)}`);
}

function cr_gilding() {
  const gid = U('crl'), rid = U('crr');
  const r = rng(141);
  const defs = `<linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F5D883"/><stop offset=".35" stop-color="#D3A23A"/><stop offset=".6" stop-color="#F0CF72"/><stop offset="1" stop-color="#B2832A"/></linearGradient><radialGradient id="${rid}" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#FFF2C2"/><stop offset=".5" stop-color="#E4B850"/><stop offset="1" stop-color="#B98A2C"/></radialGradient>`;
  let s = bg('#9C3A26');
  s += `<rect width="160" height="100" fill="url(#${gid})"/>`;
  // worn gold showing red bole beneath
  for (const [x, y, n] of [[10, 90, 10], [150, 12, 8], [140, 92, 7]]) for (let i = 0; i < n; i++) s += `<ellipse cx="${f1(x + (r() - .5) * 22)}" cy="${f1(y + (r() - .5) * 14)}" rx="${f1(1 + r() * 4)}" ry="${f1(.6 + r() * 2)}" fill="#9C3A26" opacity=".85"/>`;
  // punched border along the panel edge
  for (let x = 6; x < 156; x += 3.2) for (const y of [5, 95]) s += `<circle cx="${f1(x)}" cy="${y}" r=".7" fill="#8A6118" opacity=".8"/>`;
  // halo: burnished disc with tooled rings and rosette punches
  const hx = 80, hy = 48;
  s += `<circle cx="${hx}" cy="${hy}" r="40" fill="url(#${rid})"/>`;
  s += `<circle cx="${hx}" cy="${hy}" r="40" fill="none" stroke="#7A5314" stroke-width=".7"/><circle cx="${hx}" cy="${hy}" r="37" fill="none" stroke="#7A5314" stroke-width=".4"/><circle cx="${hx}" cy="${hy}" r="29" fill="none" stroke="#7A5314" stroke-width=".4"/>`;
  for (let i = 0; i < 70; i++) { const a = i / 70 * Math.PI * 2; s += `<circle cx="${f1(hx + Math.cos(a) * 38.5)}" cy="${f1(hy + Math.sin(a) * 38.5)}" r=".55" fill="#7A5314"/>`; }
  for (let i = 0; i < 18; i++) {
    const a = i / 18 * Math.PI * 2, x = hx + Math.cos(a) * 33, y = hy + Math.sin(a) * 33;
    s += `<circle cx="${f1(x)}" cy="${f1(y)}" r=".6" fill="#7A5314"/>`;
    for (let k = 0; k < 6; k++) { const b = k / 6 * Math.PI * 2; s += `<circle cx="${f1(x + Math.cos(b) * 1.8)}" cy="${f1(y + Math.sin(b) * 1.8)}" r=".45" fill="#7A5314"/>`; }
  }
  // incised rays
  for (let i = 0; i < 36; i++) { const a = i / 36 * Math.PI * 2; s += `<path d="M${f1(hx + Math.cos(a) * 18)} ${f1(hy + Math.sin(a) * 18)} L${f1(hx + Math.cos(a) * 28)} ${f1(hy + Math.sin(a) * 28)}" stroke="#9A6E20" stroke-width=".3"/>`; }
  // head and mantle
  s += `<path d="M50 100 C52 76 62 62 80 60 C98 62 108 76 110 100Z" fill="#23345E"/><path d="M50 100 C52 76 62 62 80 60 C98 62 108 76 110 100" fill="none" stroke="#E4B850" stroke-width="1.2"/>`;
  s += `<path d="M64 62 C62 40 70 28 80 27 C90 28 98 40 96 62 C90 58 70 58 64 62Z" fill="#23345E"/>`;
  s += `<ellipse cx="80" cy="48" rx="10" ry="13" fill="#E8C9A6"/>`;
  s += `<path d="M75 46 h3.5 M82 46 h3.5" stroke="#5A3A24" stroke-width=".8"/><path d="M80 47 L79 53 L81 53" stroke="#9A6E50" stroke-width=".5" fill="none"/><path d="M77.5 56.5 h5" stroke="#A84438" stroke-width="1"/>`;
  // burnish glints
  for (let i = 0; i < 6; i++) s += `<path d="M${f1(20 + r() * 120)} ${f1(10 + r() * 80)} l2 -2" stroke="#FFF6D6" stroke-width=".6" opacity=".9"/>`;
  return sv(`<defs>${defs}</defs>${s}`);
}

function cr_marbling() {
  const cols = ['#1F3A68', '#EADCB8', '#B33A2E', '#F2E8CF', '#D9A43A', '#2F6B5E', '#EADCB8', '#1F3A68', '#C56A3E', '#F2E8CF'];
  let s = bg('#EADCB8');
  // horizontal colour bands, pulled by a stylus (big serpentine) then a fine comb
  const D = (x, y0) => 9 * Math.sin(x / 50 * Math.PI * 2 + y0 * .09) + 3.4 * Math.sin(x / 15 * Math.PI * 2 + y0 * .25) * (.6 + .4 * Math.sin(y0 * .07));
  let b = 0;
  for (let y0 = -16; y0 < 112; y0 += 4.3, b++) {
    let d = 'M0 112';
    for (let x = 0; x <= 162; x += 3) d += 'L' + cr_n(x) + ' ' + cr_n(y0 + D(x, y0));
    s += `<path d="${d}L160 112Z" fill="${cols[b % cols.length]}"/>`;
  }
  // dropped "stones" floating on top, slightly dragged
  const r = rng(151);
  for (const [x, y, rr] of [[28, 26, 9], [126, 72, 10], [96, 18, 5.5]]) {
    for (let k = 0; k < 4; k++) {
      let d = '';
      for (let i = 0; i < 28; i++) { const a = i / 28 * Math.PI * 2, q = rr * (1 - k * .24) * (1 + .1 * Math.sin(a * 3 + k)); d += (i ? 'L' : 'M') + f1(x + Math.cos(a) * q * 1.25) + ' ' + f1(y + Math.sin(a) * q); }
      s += `<path d="${d}Z" fill="${['#1F3A68', '#F2E8CF', '#B33A2E', '#EADCB8'][k]}"/>`;
    }
  }
  for (let i = 0; i < 10; i++) s += `<path d="${cr_walk(r, r() * 160, r() * 100, 12, 2.5, r() * 6.28, .6)}" stroke="#5A4A3A" stroke-width=".25" fill="none" opacity=".4"/>`;
  return sv(`${s}${grainOv(.2)}`);
}

function cr_embroidery() {
  const r = rng(161);
  const cid = U('crc');
  let s = bg('#5A3B26');
  for (let i = 0; i < 9; i++) s += `<path d="M0 ${f1(i * 12 + r() * 4)} H160" stroke="#4A301E" stroke-width="1.2"/>`;
  s += `<clipPath id="${cid}"><circle cx="80" cy="50" r="44"/></clipPath><g clip-path="url(#${cid})"><rect width="160" height="100" fill="#EEE5D1"/>`;
  // linen weave
  let wv = '', wh = '';
  for (let i = 34; i < 126; i += 1.6) wv += `M${f1(i)} 0V100`;
  for (let i = 4; i < 96; i += 1.6) wh += `M0 ${f1(i)}H160`;
  s += `<path d="${wv}" stroke="#DCD1BA" stroke-width=".35"/><path d="${wh}" stroke="#E4DAC4" stroke-width=".35"/>`;
  // stem in stem stitch
  for (let t = 0; t < 1; t += .045) { const x = 56 + Math.sin(t * 3) * 4, y = 52 + t * 38; s += `<path d="M${f1(x - 1.2)} ${f1(y + 1)} L${f1(x + 1.2)} ${f1(y - 1)}" stroke="#4E7A3A" stroke-width="1.1" stroke-linecap="round"/>`; }
  // fishbone leaf
  for (let i = 0; i < 9; i++) { const t = i / 8, x = 58 + t * 18, y = 76 - t * 8, w = 5 * Math.sin(t * Math.PI) + .5; s += `<path d="M${f1(x)} ${f1(y)} l${f1(-w * .5)} ${f1(-w)} M${f1(x)} ${f1(y)} l${f1(w * .3)} ${f1(w)}" stroke="#6E9A4E" stroke-width=".9" stroke-linecap="round"/>`; }
  // satin-stitch petals: parallel long stitches across each petal
  const fx = 56, fy = 40;
  for (let p = 0; p < 5; p++) {
    const a = p / 5 * Math.PI * 2 - Math.PI / 2, ux = Math.cos(a), uy = Math.sin(a), L = 14;
    let dk = '', md = '', hi = '';
    for (let t = 1.5; t < L; t += .85) {
      const w = 5.2 * Math.sin(Math.PI * t / L), cx = fx + ux * t, cy = fy + uy * t;
      const seg = `M${f1(cx - uy * w)} ${f1(cy + ux * w)}L${f1(cx + uy * w)} ${f1(cy - ux * w)}`;
      if (t < 4) dk += seg; else md += seg;
      if (t > 4) hi += `M${f1(cx - uy * w * .6)} ${f1(cy + ux * w * .6 - .25)}L${f1(cx + uy * w * .2)} ${f1(cy - ux * w * .2 - .25)}`;
    }
    s += `<g stroke-width=".95" stroke-linecap="round"><path d="${dk}" stroke="#A22F40"/><path d="${md}" stroke="#D24A5E"/></g><path d="${hi}" stroke="#F08A98" stroke-width=".25" opacity=".8"/>`;
  }
  // French knots
  for (let i = 0; i < 9; i++) { const a = r() * 6.28, d = r() * 3; s += `<circle cx="${f1(fx + Math.cos(a) * d)}" cy="${f1(fy + Math.sin(a) * d)}" r="1" fill="#E8B530" stroke="#B58612" stroke-width=".3"/>`; }
  // cross-stitch heart on a grid
  const G = 2.6, ox = 92, oy = 30;
  const heart = ['0110110', '1111111', '1111111', '0111110', '0011100', '0001000'];
  for (let j = 0; j < heart.length; j++) for (let i = 0; i < 7; i++) if (heart[j][i] === '1') {
    const x = ox + i * G * 1.5, y = oy + j * G * 1.5, h = G * .65;
    s += `<path d="M${f1(x - h)} ${f1(y - h)} L${f1(x + h)} ${f1(y + h)} M${f1(x + h)} ${f1(y - h)} L${f1(x - h)} ${f1(y + h)}" stroke="#B8323F" stroke-width=".9" stroke-linecap="round"/>`;
  }
  // cross-stitch border
  for (let i = 0; i < 11; i++) { const x = 92 + i * 3.4, y = 66 + (i % 2) * 3.4, h = 1.2; s += `<path d="M${f1(x - h)} ${f1(y - h)} L${f1(x + h)} ${f1(y + h)} M${f1(x + h)} ${f1(y - h)} L${f1(x - h)} ${f1(y + h)}" stroke="#2F5E9E" stroke-width=".8" stroke-linecap="round"/>`; }
  s += `</g>`;
  // wooden hoop
  s += `<circle cx="80" cy="50" r="45.5" fill="none" stroke="#C8965C" stroke-width="4"/><circle cx="80" cy="50" r="47.3" fill="none" stroke="#A7743E" stroke-width=".6"/><rect x="76" y="1" width="8" height="5" rx="1" fill="#9A9AA0"/>`;
  // needle and loose thread
  s += `<path d="M118 88 C130 82 138 92 150 80" stroke="#B8323F" stroke-width=".8" fill="none"/><path d="M146 84 L156 72" stroke="#C9CCD2" stroke-width="1" stroke-linecap="round"/>`;
  return sv(s);
}

function cr_scratch() {
  const r = rng(171), W = '#F4F1EA';
  let s = bg('#0B0B0B');
  let g = '';
  const B = {}, P = (d, w) => { w = (Math.round(w * 10) / 10).toFixed(1); B[w] = (B[w] || '') + d; };
  // facial discs: fine radiating scratches
  for (const [ex, ey] of [[68, 40], [92, 40]]) {
    for (let i = 0; i < 60; i++) {
      const a = i / 60 * Math.PI * 2 + r() * .05, r1 = 5 + r() * 1.5, r2 = 10 + r() * 4;
      P(`M${f1(ex + Math.cos(a) * r1)} ${f1(ey + Math.sin(a) * r1)}L${f1(ex + Math.cos(a) * r2)} ${f1(ey + Math.sin(a) * r2)}`, f1(.2 + r() * .25));
    }
    g += `<circle cx="${ex}" cy="${ey}" r="4.4" stroke-width=".6"/><circle cx="${ex}" cy="${ey}" r="3.4" stroke-width=".3"/><circle cx="${ex + 1}" cy="${ey - 1.2}" r=".8" fill="${W}" stroke="none"/>`;
  }
  // beak
  g += `<path d="M78 46L80 54L82 46" stroke-width=".5"/><path d="M79 47L80 51M81 47L80.5 50" stroke-width=".25"/>`;
  // ear tufts
  for (const sx of [-1, 1]) for (let i = 0; i < 9; i++) P(`M${f1(80 + sx * (12 + i * .9))} ${f1(28 - i * .3)}q${f1(sx * 2)} -5 ${f1(sx * 5 + sx * i * .2)} ${f1(-9 - i * .4)}`, .3);
  // crown: short scratches round the head
  for (let i = 0; i < 70; i++) { const a = Math.PI * (.95 + r() * 1.1), q = 20 + r() * 8, x = 80 + Math.cos(a) * q * 1.25, y = 44 + Math.sin(a) * q * .9; P(`M${f1(x)} ${f1(y)}l${f1(Math.cos(a) * 2.5)} ${f1(Math.sin(a) * 2.5)}`, .3); }
  // breast: barred feathers, short downward strokes and broken bars
  for (let i = 0; i < 230; i++) {
    const a = r() * Math.PI * 2, d = Math.sqrt(r()), x = 80 + Math.cos(a) * d * 22, y = 75 + Math.sin(a) * d * 18;
    if (y < 56) continue;
    P(`M${f1(x)} ${f1(y)}l${f1((x - 80) * .05)} ${f1(2 + r() * 2.5)}`, f1(.2 + r() * .25));
  }
  for (let row = 0; row < 7; row++) {
    const y = 62 + row * 4.4, half = 16 + row * 1.2;
    for (let x = 80 - half; x < 80 + half; x += 3 + r() * 3) P(`M${f1(x)} ${f1(y + r())}q1.5 ${f1(1 + r())} 3 0`, .4);
  }
  // wings: long flight-feather scratches down each side
  for (const sx of [-1, 1]) for (let i = 0; i < 9; i++) P(`M${f1(80 + sx * (17 + i * 1.1))} ${f1(56 + i * 1.4)}C${f1(80 + sx * (23 + i * .9))} ${f1(68 + i)} ${f1(80 + sx * (22 + i * .6))} ${f1(80 + i)} ${f1(80 + sx * (16 + i * 1.2))} ${f1(92)}`, .35);
  // branch with scratched bark
  for (let i = 0; i < 18; i++) { const y = 94 + r() * 4; P(`M${f1(r() * 160)} ${f1(y)}h${f1(6 + r() * 14)}`, .3); }
  g += `<path d="M0 93C60 90 100 91 160 94" stroke-width=".6"/><path d="M72 93l-1 3M74 93v3M76 93l1 3M84 93l-1 3M86 93v3M88 93l1 3" stroke-width=".4"/>`;
  g += Object.entries(B).map(([w, d]) => `<path d="${d}" stroke-width="${w}"/>`).join('');
  return sv(`${s}<g stroke="${W}" fill="none" stroke-linecap="round">${g}</g>`);
}

function cr_silverpoint() {
  const r = rng(181), I = '#55504A', H = '#FBFAF4';
  const cid = U('crc');
  const face = 'M66 18 C78 15 90 20 94 28 C96 32 96 35 97 38 L101 45 C101 47 99 47 98 48 C99 50 98 51 97 52 C98 54 97 56 95 57 C93 62 90 64 86 64 L84 74 C88 80 96 82 104 88';
  const back = 'M66 18 C56 20 50 30 52 42 C54 52 62 58 68 62 L68 74 C62 80 54 82 48 88';
  let s = bg('#C9D0CE');
  for (let i = 0; i < 30; i++) s += `<ellipse cx="${f1(r() * 160)}" cy="${f1(r() * 100)}" rx="${f1(4 + r() * 10)}" ry="${f1(2 + r() * 4)}" fill="${pick(r, ['#C2C9C6', '#D0D6D3'])}" opacity=".6"/>`;
  // shading: left-handed hatching clipped to the shadow areas
  s += `<clipPath id="${cid}"><path d="M52 42 C54 52 62 58 68 62 L68 74 L84 74 L86 64 C80 62 74 56 72 48 C70 40 64 30 66 18 C56 20 50 30 52 42Z M90 34 C86 42 88 50 95 57 C97 54 98 50 97 48 Z M104 88 L48 88 L58 80 L96 82Z"/></clipPath>`;
  let h = '';
  for (let k = -60; k < 110; k += 1.15) h += `<path d="${cr_jl(r, 40 + k, 14, 80 + k, 94, .25, 3)}"/>`;
  s += `<g clip-path="url(#${cid})" stroke="${I}" stroke-width=".28" fill="none" opacity=".8">${h}</g>`;
  // contour, drawn twice with pentimenti
  s += `<g stroke="${I}" stroke-width=".45" fill="none" stroke-linecap="round"><path d="${face}"/><path d="${back}"/><path d="${face}" transform="translate(.8 .4)" opacity=".5"/><path d="${back}" transform="translate(-.9 .3)" opacity=".45"/></g>`;
  // hair: loose curving strokes and a knot
  let hr = '';
  for (let i = 0; i <= 18; i++) {
    const t = i / 18, x = 86 - 16 * t, y = 22 + 18 * t;
    hr += `<path d="M${f1(x)} ${f1(y)}Q${f1(x - 10 - 4 * t)} ${f1(y - 14 + 6 * t)} ${f1(58)} ${f1(25 + 6 * t)}"/>`;
  }
  hr += `<ellipse cx="54" cy="28" rx="7" ry="6"/><path d="M50 26 C53 23 58 24 59 29 M51 30 C54 28 57 29 58 32"/>`;
  s += `<g stroke="${I}" stroke-width=".3" fill="none" opacity=".85">${hr}</g>`;
  // eye, lips, ear
  s += `<g stroke="${I}" stroke-width=".35" fill="none"><path d="M86 36 C88 35 90 35.5 91 37 M86.5 37.4 C88 38 89.5 38 91 37"/><path d="M93 53 C95 53 96.5 53 97 52.5"/><path d="M70 38 C67 38 66 42 67 45 C68 47 70 47 71 45"/></g>`;
  // white heightening
  s += `<g stroke="${H}" stroke-width=".4" fill="none" opacity=".9" stroke-linecap="round"><path d="M84 22 l5 3 M86 21 l4 3 M92 44 l3 2 M90 46 l3 2 M88 58 l3 1"/></g>`;
  // a faint study of a hand at the side
  s += `<g stroke="${I}" stroke-width=".28" fill="none" opacity=".65"><path d="M120 70 C122 60 126 54 132 52 L140 50 M128 56 C132 54 138 54 142 56 M128 60 C132 59 137 60 141 62 M126 64 C130 64 134 66 136 68 M120 70 C126 74 132 74 136 70"/></g>`;
  return sv(s);
}

function cr_cloisonne() {
  const r = rng(191), Au = '#D8B04A';
  const gid = U('crr'), lid = U('crl'), cid = U('crc');
  const vase = 'M72 6 L88 6 L87 14 C86 20 90 24 98 28 C114 36 120 48 118 60 C116 74 106 82 96 86 L98 94 L62 94 L64 86 C54 82 44 74 42 60 C40 48 46 36 62 28 C70 24 74 20 73 14Z';
  const defs = `<radialGradient id="${gid}" cx=".4" cy=".55" r=".6"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient><linearGradient id="${lid}" x1="0" y1="0" x2="1" y2="0"><stop offset=".18" stop-color="#fff" stop-opacity="0"/><stop offset=".27" stop-color="#fff" stop-opacity=".55"/><stop offset=".34" stop-color="#fff" stop-opacity="0"/></linearGradient><clipPath id="${cid}"><path d="${vase}"/></clipPath>`;
  let s = `<rect width="160" height="100" fill="#3A1E18"/><rect y="90" width="160" height="10" fill="#24120E"/>`;
  let v = `<rect width="160" height="100" fill="#2CA3A2"/>`;
  // wire scrolls dividing the turquoise ground into cells
  let w = '';
  for (let i = 0; i < 20; i++) {
    const x = 44 + r() * 74, y = 30 + r() * 56, k = 2.5 + r() * 2, d = r() < .5 ? 1 : -1;
    w += `<path d="M${f1(x)} ${f1(y)} a${f1(k)} ${f1(k)} 0 1 ${d > 0 ? 1 : 0} ${f1(k * 2)} 0 a${f1(k * .6)} ${f1(k * .6)} 0 1 ${d > 0 ? 1 : 0} ${f1(-k * 1.2)} 0 M${f1(x + k * 2)} ${f1(y)} q${f1(k * 1.5)} ${f1(k)} ${f1(k * 3)} 0"/>`;
  }
  // neck band and foot band
  v += `<rect x="40" y="6" width="80" height="16" fill="#1E3B8A"/><rect x="40" y="84" width="80" height="12" fill="#1E3B8A"/>`;
  for (let x = 62; x < 98; x += 6) w += `<path d="M${x} 22 L${x + 3} 15 L${x + 6} 22"/>`;
  for (let x = 58; x < 102; x += 6) w += `<path d="M${x} 84 Q${x + 3} 90 ${x + 6} 84"/>`;
  w += `<path d="M40 22 H120 M40 84 H120"/>`;
  // lotus flower and leaves
  const petal = (a, len, wd, c1) => {
    const ux = Math.cos(a), uy = Math.sin(a), bx = 80, by = 58;
    const tx = bx + ux * len, ty = by + uy * len;
    return `<path d="M${bx} ${by} C${f1(bx + ux * len * .5 - uy * wd)} ${f1(by + uy * len * .5 + ux * wd)} ${f1(tx - uy * 2)} ${f1(ty + ux * 2)} ${f1(tx)} ${f1(ty)} C${f1(tx + uy * 2)} ${f1(ty - ux * 2)} ${f1(bx + ux * len * .5 + uy * wd)} ${f1(by + uy * len * .5 - ux * wd)} ${bx} ${by}Z" fill="${c1}"/>`;
  };
  let fl = '';
  fl += `<path d="M80 60 C66 66 54 64 48 56 C58 54 70 56 80 60Z M80 60 C94 66 106 64 112 56 C102 54 90 56 80 60Z" fill="#3E9A4E"/>`;
  for (const [a, len, wd, c] of [[-2.6, 20, 7, '#E86A7A'], [-.54, 20, 7, '#E86A7A'], [-2.1, 24, 7, '#D9455E'], [-1.04, 24, 7, '#D9455E'], [-1.57, 26, 7.5, '#F08A98']]) fl += petal(a, len, wd, c);
  fl += `<ellipse cx="80" cy="58" rx="6" ry="3" fill="#E8B530"/>`;
  v += fl;
  v += `<g stroke="${Au}" stroke-width=".8" fill="none" stroke-linecap="round">${w}</g>`;
  v += `<g fill="none" stroke="${Au}" stroke-width=".8">${fl.replace(/fill="[^"]+"/g, '')}</g>`;
  v += `<rect width="160" height="100" fill="url(#${gid})"/><rect width="160" height="100" fill="url(#${lid})"/>`;
  for (let i = 0; i < 40; i++) v += `<circle cx="${f1(44 + r() * 74)}" cy="${f1(8 + r() * 84)}" r=".25" fill="#0E2A2A" opacity=".5"/>`;
  s += `<g clip-path="url(#${cid})">${v}</g><path d="${vase}" fill="none" stroke="${Au}" stroke-width="1.4"/>`;
  return sv(`<defs>${defs}</defs>${s}`);
}

function cr_quilt() {
  const r = rng(201);
  const fab = [], defs = [];
  const mk = (base, dot, kind) => {
    const id = U('crp');
    let inner = `<rect width="4" height="4" fill="${base}"/>`;
    if (kind === 0) inner += `<circle cx="1" cy="1" r=".45" fill="${dot}"/><circle cx="3" cy="3" r=".45" fill="${dot}"/>`;
    if (kind === 1) inner += `<path d="M0 1 H4 M0 3 H4" stroke="${dot}" stroke-width=".5"/>`;
    if (kind === 2) inner += `<path d="M0 4 L4 0" stroke="${dot}" stroke-width=".5"/>`;
    defs.push(`<pattern id="${id}" width="4" height="4" patternUnits="userSpaceOnUse">${inner}</pattern>`);
    return `url(#${id})`;
  };
  const light = [mk('#F1E6CC', '#D9C29A', 0), mk('#E9DCC0', '#C9A97A', 1), '#F4EBD8', mk('#E7D2A6', '#C78B4A', 2)];
  const dark = [mk('#2E4E7A', '#6F8FB8', 0), '#7A2E2A', mk('#3C6A4A', '#2A4A34', 1), mk('#A4462E', '#E3A35A', 2), '#4A3A5E'];
  let s = bg('#F1E6CC');
  const B = 40;
  for (let by = 0; by < 3; by++) for (let bx = 0; bx < 4; bx++) {
    const ox = bx * B, oy = by * B - 15;
    if (bx === 3 && by === 1) {
      // improvised housetop block: wonky concentric strips, Gee's Bend style
      const C = ['#B9452E', '#F1E6CC', '#2E4E7A', '#E3A35A', '#4A3A5E', '#E9DCC0', '#B9452E'];
      for (let k = 0; k < 7; k++) {
        const i = k * 2.9 + r() * 1.2, j = k * 2.9 + r() * 1.2;
        s += `<polygon points="${pts([[ox + i, oy + j + r() * 1.5], [ox + B - j, oy + i], [ox + B - i + r() * 1.5, oy + B - j], [ox + j, oy + B - i]])}" fill="${C[k]}"/>`;
      }
      continue;
    }
    // log cabin: logs spiral out from a red centre, light on one diagonal half, dark on the other
    let g = '';
    const w = 4, c0 = 16;
    for (let k = 3; k >= 0; k--) {
      const a = c0 - k * w - w, A = c0 + 8 + k * w + w;
      g += `<rect x="${a}" y="${a}" width="${A - a}" height="${A - a}" fill="${pick(r, dark)}"/>`;
      g += `<polygon points="${a},${a} ${A},${a} ${A},${A} ${A - w},${A} ${A - w},${a + w} ${a},${a + w}" fill="${pick(r, light)}"/>`;
    }
    g += `<rect x="${c0}" y="${c0}" width="8" height="8" fill="#C2302A"/>`;
    const rot = ((bx + by) % 2) * 180 + (by % 2) * 90;
    s += `<g transform="translate(${ox} ${oy}) rotate(${rot} 20 20)">${g}</g>`;
  }
  // seams and hand-quilting stitches
  s += `<g stroke="#000" stroke-opacity=".18" stroke-width=".4">`;
  for (let x = 40; x < 160; x += 40) s += `<path d="M${x} 0 V100"/>`;
  for (const y of [25, 65]) s += `<path d="M0 ${y} H160"/>`;
  s += `</g><g stroke="#FFF8E6" stroke-width=".5" stroke-dasharray="1.6 1.4" fill="none" opacity=".85">`;
  for (let k = -100; k < 160; k += 10) s += `<path d="M${k} 0 L${k + 100} 100"/>`;
  s += `</g>`;
  return sv(`<defs>${defs.join('')}</defs>${s}${grainOv(.25)}`);
}

function cr_silhouette() {
  const gid = U('crl');
  const r = rng(211), K = '#141110';
  const defs = `<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6D9A2"/><stop offset=".7" stop-color="#E9A16A"/><stop offset="1" stop-color="#C9683F"/></linearGradient>`;
  let s = `<rect width="160" height="100" fill="url(#${gid})"/>`;
  // lady in profile with bun, ringlet and ruffled collar
  s += `<path fill="${K}" d="M62 16 C50 16 42 24 42 34 C42 40 44 44 46 47 C44 52 46 56 50 58 L50 66 C40 70 30 76 26 86 L26 100 L92 100 L92 88 C88 78 80 72 70 68 L70 62 C74 62 77 60 78 57 C79 55 78 53 79 52 C80 51 79 50 78.5 49 C80 48 81 47 80 45.5 L77 40 C77 36 76 33 74 30 C72 22 68 16 62 16Z"/>`;
  s += `<circle cx="44" cy="22" r="8" fill="${K}"/><path d="M44 30 C38 36 40 44 36 50" stroke="${K}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  // lace collar: scallops with tiny cut holes
  let lace = '';
  for (let i = 0; i < 10; i++) { const x = 34 + i * 6, y = 72 + Math.abs(i - 4.5) * 1.6; lace += `<circle cx="${f1(x)}" cy="${f1(y)}" r="3.4" fill="${K}"/><circle cx="${f1(x)}" cy="${f1(y + .6)}" r="1" fill="#E9A16A"/>`; }
  s += lace;
  // curly branch with leaves and a bird
  s += `<path d="M160 30 C140 34 126 44 118 58 C114 66 116 74 124 74 C130 74 130 66 124 66" stroke="${K}" stroke-width="1.6" fill="none"/>`;
  s += `<path d="M138 38 C134 30 136 24 142 22 M128 48 C122 44 120 38 122 34" stroke="${K}" stroke-width="1" fill="none"/>`;
  for (let i = 0; i < 16; i++) {
    const t = i / 15, x = 160 - t * 40, y = 30 + t * 28 + Math.sin(t * 9) * 3, a = r() * 360;
    s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="3.4" ry="1.4" transform="rotate(${f1(a)} ${f1(x)} ${f1(y)})" fill="${K}"/>`;
  }
  s += `<path fill="${K}" d="M134 40 C130 38 126 39 125 42 L121 43 L125 44 C126 48 130 50 136 49 L146 52 L141 46 C142 42 138 40 134 40Z"/><circle cx="128.5" cy="41.6" r=".6" fill="#F6D9A2"/>`;
  // grass and flowers fringe
  let gr = '';
  for (let x = 92; x < 160; x += 2.2) gr += `<path d="M${f1(x)} 100 q${f1((r() - .5) * 3)} ${f1(-4 - r() * 6)} ${f1((r() - .5) * 4)} ${f1(-8 - r() * 8)}" stroke="${K}" stroke-width=".8" fill="none"/>`;
  for (const [x, y] of [[104, 84], [126, 80], [146, 86]]) { gr += `<path d="M${x} 100 V${y}" stroke="${K}" stroke-width=".8"/>`; for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; gr += `<circle cx="${f1(x + Math.cos(a) * 2.2)}" cy="${f1(y + Math.sin(a) * 2.2)}" r="1.3" fill="${K}"/>`; } }
  s += gr + `<rect y="96" width="160" height="4" fill="${K}"/>`;
  return sv(`<defs>${defs}</defs>${s}${grainOv(.18)}`);
}

pool.groups.push({
  id: 'printmaking', title: 'Printmaking', slot: 'Print technique',
  intro: 'Each print technique leaves its own fingerprint: the grain of a plank, the swell of a burin line, the grit of a bitten plate. Name the technique and its marks so the image looks printed, not drawn.',
  terms: [
    { id: 'woodcut', name: 'Woodcut', aka: 'woodblock print, xylograph, plank woodcut',
      when: 'since the 1400s · Europe and East Asia',
      desc: 'A picture carved into a plank of wood along the grain, then inked and pressed onto paper, so every white is a cut and every black is wood left standing. It feels bold, rough and urgent; unlike linocut, the wood fights back, leaving grain streaks and splintery edges.',
      spot: 'wood-grain streaks printing in the black areas, splintery wedge-shaped cuts, chunky black shapes, rough broken edges, knots, no smooth curves',
      ref: 'Albrecht Dürer (Apocalypse series), Ernst Ludwig Kirchner, Edvard Munch, Käthe Kollwitz',
      prompt: 'Woodcut print, plank wood grain visible in the solid blacks, splintery gouged white lines, chunky black shapes, rough edges, black ink on cream paper, stark expressive carving',
      ex: cr_woodcut() },
    { id: 'woodengraving', name: 'Wood engraving', aka: 'end-grain engraving, white-line engraving',
      when: 'since the 1780s · England',
      desc: 'Cut into the hard end grain of boxwood with fine engraving tools, so the artist draws in thin white lines out of a black block. The result is tiny, crisp and silvery, with skies made of hundreds of fine parallel lines.',
      spot: 'white lines on black rather than black lines on white, skies of fine horizontal lines that lighten toward the horizon, tiny scale, crisp detail, small vignettes that fade out at the edges',
      ref: 'Thomas Bewick (History of British Birds), Gustave Doré (Bible illustrations), Eric Gill, Lynd Ward',
      prompt: 'Wood engraving, fine white lines cut from a black block, tightly ruled parallel-line sky, crisp miniature detail, small oval vignette with broken edges, black ink on white paper',
      ex: cr_woodeng() },
    { id: 'etching', name: 'Etching', aka: 'intaglio etching, line etching',
      when: 'since the 1500s · Europe',
      desc: 'The artist scratches through a wax coating on a copper plate and lets acid bite the lines, so they flow as freely as a pen sketch. Prints carry a faint film of plate tone and a pressed rectangle (the plate mark) around the image.',
      spot: 'thin, wandering, slightly nervous lines, loose scribbled hatching, lots of empty paper, warm plate tone, embossed plate-mark rectangle, brown-black ink',
      ref: 'Rembrandt (The Windmill, Three Trees), Francisco Goya, Whistler (Thames Set), Canaletto',
      prompt: 'Etching on cream paper, delicate wandering acid-bitten lines, loose scribbled hatching, soft plate tone, visible plate mark border, warm brown-black ink, airy open composition',
      ex: cr_etching() },
    { id: 'engraving', name: 'Engraving', aka: 'line engraving, burin engraving, banknote engraving',
      when: 'since the 1400s · Europe',
      desc: 'Lines are pushed into a metal plate with a sharp burin, so each one starts thin, swells and tapers like a ribbon. Engravers model form with orderly parallel lines that curve around a face, which is why it still says money, stamps and official portraits.',
      spot: 'perfectly controlled lines that swell and taper, parallel curved lines following the form, cross-hatched diamonds in the shadows, guilloche rosettes and frames, single-color ink',
      ref: 'Albrecht Dürer (Melencolia I), Hendrick Goltzius, banknote and postage-stamp portraits',
      prompt: 'Line engraving, crisp burin lines that swell and taper, parallel curved hatching following the form, guilloche oval frame, banknote portrait style, single dark green ink on pale paper',
      ex: cr_engraving() },
    { id: 'mezzotint', name: 'Mezzotint', aka: 'manière noire, black manner',
      when: 'since the 1640s · Netherlands, England',
      desc: 'The whole plate is roughened so it would print solid velvety black, then the artist scrapes and burnishes it smooth where light should be. It works from dark to light, giving soft glowing forms floating out of deep shadow.',
      spot: 'rich velvety black background, soft edges with no outlines, forms glowing up out of darkness, smooth gradients, fine grainy texture in the darks',
      ref: 'Ludwig von Siegen, John Raphael Smith, Richard Earlom (after Joseph Wright of Derby), Yozo Hamaguchi',
      prompt: 'Mezzotint print, deep velvety black ground, forms scraped up into soft glowing light, no outlines, smooth tonal gradations, fine grainy texture, quiet still life',
      ex: cr_mezzotint() },
    { id: 'lithograph', name: 'Lithograph poster', aka: 'color lithography, chromolithograph, crayon lithograph',
      when: 'since the 1790s · Germany; posters 1880s–1900s · Paris',
      desc: 'Drawn with greasy crayon and ink on a flat stone, so prints keep the grainy crayon texture alongside big flat color areas. Belle Époque poster artists added "crachis", a spatter flicked from a toothbrush, for speckled tones.',
      spot: 'flat bold color areas, grainy crayon texture, toothbrush spatter speckles, big cropped black silhouettes, hand-drawn lettering, a few strong colors like ochre, olive, red and black',
      ref: 'Henri de Toulouse-Lautrec (Moulin Rouge posters), Jules Chéret, Théophile Steinlen, Pierre Bonnard',
      prompt: 'Belle Époque color lithograph poster, flat bold areas of ochre, olive and red, grainy crayon texture, spatter crachis speckles, cropped black silhouette in the foreground, hand-drawn lettering',
      ex: cr_litho() },
    { id: 'letterpress', name: 'Letterpress', aka: 'wood type, relief printing, hand-set type',
      when: 'since the 1450s · Europe; wood type 1800s · USA',
      desc: 'Raised metal or wood letters are inked and pressed hard into thick paper, so the type bites in and leaves a slight dent. The ink is never perfectly even: you get a darker rim where it squeezes out and tiny speckles where it skipped.',
      spot: 'deep impression you can almost feel, slightly darker ink rim around letters, speckled and uneven coverage, chunky wood-type letterforms, red and black on soft cotton paper, ornaments and rules',
      ref: 'Hatch Show Print (Nashville gig posters), 19th-century wood-type playbills, William Morris\'s Kelmscott Press, Alan Kitching',
      prompt: 'Letterpress print, chunky wood type, deep impression in thick cotton paper, ink squeeze at the letter edges, slightly uneven speckled coverage, red and black ink, ornamental rules',
      ex: cr_letterpress() },
    { id: 'pochoir', name: 'Pochoir & stencil', aka: 'pochoir, hand-coloured stencil print',
      when: '1900s–1930s · Paris',
      desc: 'Color is dabbed by hand through a series of cut stencils, one per color, over a printed black outline. It gives crisp flat jewel-like color with soft mottled dabbing inside and a little pooling of pigment at the stencil edges.',
      spot: 'crisp flat shapes of saturated jewel color, mottled dabbed texture inside each shape, slightly darker pooled edges, color a hair out of step with the black key line, 1920s fashion plates and patterns',
      ref: 'George Barbier, Gazette du Bon Ton fashion plates, Sonia Delaunay (Compositions, Couleurs, Idées), E. A. Séguy',
      prompt: 'Pochoir stencil print, flat saturated jewel colors, hand-dabbed mottled color with darker pooled edges, thin black key line slightly out of register, 1920s fashion plate, cream paper',
      ex: cr_pochoir() },
    { id: 'monotype', name: 'Monotype', aka: 'monoprint, one-off print',
      when: 'since the 1640s · Italy; popular 1870s · France',
      desc: 'The artist paints or rolls ink onto a smooth plate, wipes some away with rags, fingers or brushes, then presses a single sheet onto it. Only one strong print is possible, and it looks like a ghostly, soft-edged painting.',
      spot: 'soft blurry edges, light areas wiped out of dark ink, rag and brush drag marks, ghostly mood, mottled pressed texture, sometimes pastel added on top',
      ref: 'Edgar Degas (landscape and café monotypes), Giovanni Benedetto Castiglione, Paul Gauguin, Maurice Prendergast',
      prompt: 'Monotype print, dark ink plate with light wiped out by rag and fingers, soft ghostly blurred edges, brush drag marks, mottled pressed texture, touches of muted color, moody landscape',
      ex: cr_monotype() },
    { id: 'aquatint', name: 'Etching with aquatint', aka: 'aquatint, etching and aquatint',
      when: 'since the 1760s · France, Spain',
      desc: 'Powdered resin is melted onto the plate so the acid bites around each grain, giving grainy tones like a wash instead of lines. Mixed with etched lines it creates dramatic pools of shadow and light, perfect for dark, dreamlike scenes.',
      spot: 'grainy sandpaper-like tones in flat areas, several clear steps of grey or sepia, crisp etched outlines on top, dramatic night skies, pools of light',
      ref: 'Francisco Goya (Los Caprichos, Disasters of War), Mary Cassatt, Edward Hopper, Picasso (Vollard Suite)',
      prompt: 'Etching with aquatint, grainy tonal washes in sepia stepping from light to deep shadow, crisp etched outlines, dramatic night sky, pool of light, moody satirical scene',
      ex: cr_aquatint() },
  ]
});

pool.groups.push({
  id: 'craft', title: 'Surfaces & crafts', slot: 'Craft',
  intro: 'Not paint or ink but the surface itself: plaster, wax, gold, glass, thread, paper. Naming the material gets you its texture, its light and the marks only that craft can make.',
  terms: [
    { id: 'fresco', name: 'Fresco', aka: 'buon fresco, wall painting',
      when: 'since antiquity · Mediterranean',
      desc: 'Pigment painted into wet lime plaster so it dries as part of the wall. Colors come out chalky, matte and soft, and old frescoes show cracks, faded patches and bare plaster where pieces have fallen away.',
      spot: 'chalky matte pastel-ish color, no gloss, cracks and patches of bare plaster, faded edges, painted borders and panels, Pompeian red and ochre walls',
      ref: 'Pompeii (Villa of the Mysteries), Michelangelo (Sistine Chapel ceiling), Giotto (Scrovegni Chapel), Diego Rivera',
      prompt: 'Ancient fresco on lime plaster, chalky matte colors, Pompeian red panel with ochre borders, floating figure, hairline cracks, flaked areas of bare plaster, softly faded',
      ex: cr_fresco() },
    { id: 'tempera', name: 'Egg tempera', aka: 'tempera on panel, gold-ground painting',
      when: '1200s–1400s · Italy, and icons',
      desc: 'Pigment mixed with egg yolk dries in seconds, so painters build forms from countless tiny hatched strokes instead of blending. It gives pale, luminous, slightly flat color, often against a background of gold leaf.',
      spot: 'fine hatched brushstrokes visible on faces, pale luminous color, green underpaint showing in flesh shadows, crisp outlines, gold background, little blending',
      ref: 'Duccio (Maestà), Simone Martini, Fra Angelico, Andrew Wyeth (Christina\'s World)',
      prompt: 'Egg tempera on gold-ground panel, fine hatched brushstrokes building the face, green underpaint in the shadows, pale luminous color, crisp contours, ultramarine robe, medieval Italian icon feeling',
      ex: cr_tempera() },
    { id: 'encaustic', name: 'Encaustic', aka: 'hot wax painting, wax encaustic',
      when: 'since antiquity · Egypt, Greece',
      desc: 'Pigment mixed into melted beeswax and brushed on hot, so each stroke sets in a rich translucent layer. It looks waxy and luminous, with soft thick strokes that catch the light like the Fayum mummy portraits.',
      spot: 'thick soft strokes with rounded ends, translucent layered color, waxy sheen, luminous skin, buttery texture, wooden panel showing at the edges',
      ref: 'Fayum mummy portraits (Roman Egypt), Jasper Johns (Flag), Tony Scherman',
      prompt: 'Encaustic painting on wood panel, translucent layers of pigmented beeswax, soft thick rounded strokes, waxy sheen, luminous skin, large dark eyes, Fayum portrait feeling',
      ex: cr_encaustic() },
    { id: 'mosaic', name: 'Mosaic', aka: 'Roman mosaic, opus tessellatum, tesserae',
      when: 'since antiquity · Greece, Rome',
      desc: 'Pictures built from small cut cubes of stone or glass (tesserae) set in mortar. The direction the rows flow (the andamento) traces each shape, like contour lines echoing around a figure.',
      spot: 'small square tiles with grout lines, rows of tiles curving around a figure, halo rows in the background, stone colors like cream, terracotta, slate blue, patterned borders',
      ref: 'Roman floor mosaics (Pompeii\'s Alexander Mosaic, Villa Romana del Casale), Antoni Gaudí\'s trencadís, Ravenna',
      prompt: 'Roman floor mosaic, small square stone tesserae with grey grout, rows of tiles flowing around the figure, cream background with halo rows, terracotta and slate blue, patterned border',
      ex: cr_mosaic() },
    { id: 'gilding', name: 'Gold leaf & gilding', aka: 'water gilding, punchwork, tooled gold',
      when: 'since antiquity; peak 1300s · Italy, Byzantium',
      desc: 'Gold beaten thinner than tissue is laid over a red clay (bole), burnished to a mirror shine, then pressed with punches and incised lines. Where it wears, the warm red shows through.',
      spot: 'gold background, halos tooled with rings of punched dots and little rosettes, incised rays, bright burnished glints, red bole peeking through worn spots',
      ref: 'Simone Martini (Annunciation), Gentile da Fabriano, Gustav Klimt (The Kiss), Japanese kintsugi',
      prompt: 'Gilded panel, burnished gold leaf over red bole, halo tooled with punched dot rings and rosettes, incised rays, worn edges showing red, ultramarine mantle, medieval altarpiece',
      ex: cr_gilding() },
    { id: 'marbling', name: 'Paper marbling', aka: 'ebru, suminagashi, marbled endpapers',
      when: 'since the 1100s · Japan; 1400s · Persia, Ottoman Turkey',
      desc: 'Colors are floated on a bath of thickened water, combed or pulled into patterns, and lifted off with a sheet of paper. Every sheet is one of a kind, full of swirling bands, feathered combing and round "stones".',
      spot: 'flowing bands of color pulled into waves and feathers, combed zigzags, round dropped stones of color, no brush marks, classic endpaper palette of navy, red, ochre and cream',
      ref: 'Turkish ebru (Necmeddin Okyay), Japanese suminagashi, 19th-century book endpapers, Cockerell marbled papers',
      prompt: 'Marbled paper, ebru, colors floating in swirling combed bands, feathered and zigzag pulls, round dropped stones, navy, crimson, ochre and cream, antique book endpaper',
      ex: cr_marbling() },
    { id: 'embroidery', name: 'Embroidery & cross-stitch', aka: 'needlework, satin stitch, sampler',
      when: 'worldwide, since antiquity',
      desc: 'Pictures stitched in thread on cloth. Satin stitch lays glossy parallel threads across a shape, while cross-stitch builds pixel-like images from little X stitches on a grid.',
      spot: 'visible thread with a soft sheen, parallel satin stitches across petals, tiny X stitches on a grid, linen weave behind, French knots, embroidery hoop',
      ref: 'Bayeux Tapestry (embroidered), Victorian samplers, Hungarian Matyó embroidery, Suzani textiles of Central Asia',
      prompt: 'Hand embroidery on natural linen, glossy satin-stitch petals, stem stitch and French knots, a cross-stitch heart on a grid, visible thread texture, wooden hoop, soft daylight',
      ex: cr_embroidery() },
    { id: 'scratchboard', name: 'Scratchboard', aka: 'scraperboard, scratch art',
      when: 'since the 1880s · Britain, France',
      desc: 'A board coated with white clay and black ink: the artist scratches away the black with a blade, so the image is made of fine white lines on black. It is brilliant for fur, feathers and crisp, high-contrast detail.',
      spot: 'thin sharp white lines on solid black, fur and feathers built from short scratches, radiating lines, crisp highlights, no grey washes, scientific or editorial feel',
      ref: 'Scott McKowen (theatre posters), Mark Summers (book covers), mid-century newspaper illustrations',
      prompt: 'Scratchboard illustration, fine white lines scratched from solid black, fur and feathers rendered with short crisp strokes, radiating line patterns, stark high contrast',
      ex: cr_scratch() },
    { id: 'silverpoint', name: 'Silverpoint', aka: 'metalpoint drawing',
      when: '1300s–1500s · Italy, Flanders',
      desc: 'Drawing with a thin silver wire on paper coated with a tinted ground: the lines are always faint, fine and silvery grey and cannot be erased. Renaissance masters used it for delicate studies of heads and hands.',
      spot: 'very fine, faint grey lines, tinted ground (blue-grey, rose, ochre), even parallel hatching, white highlights brushed on, light pentimenti (corrected lines left visible), small studies on one sheet',
      ref: 'Leonardo da Vinci (head studies), Albrecht Dürer (Self-Portrait at 13), Rogier van der Weyden, Raphael',
      prompt: 'Silverpoint drawing on blue-grey prepared paper, faint fine silvery lines, delicate parallel hatching, white heightening on the highlights, Renaissance profile study, visible corrected lines',
      ex: cr_silverpoint() },
    { id: 'cloisonne', name: 'Enamel & cloisonné', aka: 'cloisonné, vitreous enamel',
      when: 'since the 1200s BCE · Mycenae; Ming dynasty China',
      desc: 'Thin gold or brass wires are bent into cells on a metal object, filled with powdered colored glass and fired until glossy. Every color sits in its own wire-edged cell, like a stained-glass window you can hold.',
      spot: 'thin gold outlines around every color, glossy glassy surface with bright reflections, turquoise ground filled with wire scrolls, saturated jewel colors, small pits in the enamel',
      ref: 'Ming dynasty Jingtai cloisonné, Byzantine enamels, Fabergé eggs (guilloché enamel), Japanese Meiji shippō',
      prompt: 'Cloisonné enamel vase, thin gold wire outlines around every cell, glossy vitreous enamel in turquoise, coral and cobalt, lotus motif, scrolling wire clouds, bright specular highlights',
      ex: cr_cloisonne() },
    { id: 'quilt', name: 'Patchwork quilt', aka: 'pieced quilt, log cabin, improv quilting',
      when: 'since the 1700s · Britain, North America',
      desc: 'Fabric scraps sewn into repeating blocks, then layered and stitched through with small running stitches. Patterns range from orderly log cabin squares to the bold improvised strips of the Gee\'s Bend quilters of Alabama.',
      spot: 'square blocks of pieced fabric, mixed small-print and solid cottons, log-cabin strips spiralling around a red centre, light and dark halves, rows of small quilting stitches, slightly wonky seams',
      ref: 'Gee\'s Bend quilts (Mary Lee Bendolph, Lucy Mingo), Amish quilts, Harriet Powers (Bible Quilt)',
      prompt: 'Patchwork quilt, pieced cotton fabrics in small prints and solids, log cabin blocks with light and dark halves, one improvised housetop block, visible hand quilting stitches, warm faded colors',
      ex: cr_quilt() },
    { id: 'silhouette', name: 'Silhouette cut', aka: 'paper silhouette, shadow portrait, scherenschnitte',
      when: '1700s–1800s · Europe; film 1920s · Germany',
      desc: 'Shapes cut from black paper with scissors and set against a light ground, from tiny profile portraits to whole fairy-tale scenes. Lotte Reiniger animated such cut-outs in the 1920s, adding lacy trees and curling vines.',
      spot: 'solid black shapes with no inner detail, crisp scissor-cut edges, profile faces, delicate lace and curly vines cut into the black, warm glowing backdrop',
      ref: 'Augustin Edouart (profile portraits), Lotte Reiniger (The Adventures of Prince Achmed), Hans Christian Andersen\'s paper cuts, Kara Walker',
      prompt: 'Black paper silhouette cut, crisp scissor-cut profile portrait, lacy cut-out collar, curling vine and bird, solid black shapes against a warm amber gradient, fairy-tale shadow theatre',
      ex: cr_silhouette() },
  ]
});

/* ===== g_hand.js ===== */
/* ---------- g_hand: painting effects + drawing approaches ---------- */

// hatch lines across a box at an angle (deg), optional clipPath id
function ha_hatch(r, o) {
  const { x = 0, y = 0, w = 160, h = 100, ang = 45, gap = 3, col = '#000', sw = .5, op = 1, jit = .6, clip, cap = 'round' } = o;
  const cx = x + w / 2, cy = y + h / 2, L = Math.hypot(w, h);
  const a = ang * Math.PI / 180, dx = Math.cos(a), dy = Math.sin(a), px = -dy, py = dx;
  let s = '';
  for (let t = -L / 2; t <= L / 2; t += gap) {
    const ox = cx + px * t + (r() - .5) * jit, oy = cy + py * t + (r() - .5) * jit;
    const l1 = L / 2 * (.85 + r() * .3), l2 = L / 2 * (.85 + r() * .3);
    s += `M${f1(ox - dx * l1)} ${f1(oy - dy * l1)}L${f1(ox + dx * l2)} ${f1(oy + dy * l2)}`;
  }
  return `<path d="${s}" stroke="${col}" stroke-width="${sw}" opacity="${op}" stroke-linecap="${cap}" fill="none"${clip ? ` clip-path="url(#${clip})"` : ''}/>`;
}
// a clipPath def from inner svg
function ha_clip(inner) { const id = U('hac'); return [`<clipPath id="${id}">${inner}</clipPath>`, id]; }
// a short rotated brush/knife stroke
function ha_dab(x, y, l, w, ang, col, op = 1, rx) {
  return `<rect x="${f1(x - l / 2)}" y="${f1(y - w / 2)}" width="${f1(l)}" height="${f1(w)}" rx="${f1(rx == null ? w / 2 : rx)}" fill="${col}" opacity="${op}" transform="rotate(${f1(ang)} ${f1(x)} ${f1(y)})"/>`;
}
// smooth path through points (catmull-rom)
function ha_cr(p, closed = false) {
  const n = p.length, g = i => closed ? p[(i + n) % n] : p[Math.max(0, Math.min(n - 1, i))];
  let d = `M${f1(p[0][0])} ${f1(p[0][1])}`;
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    d += `C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return d + (closed ? 'Z' : '');
}
function ha_rg(stops, cx = .35, cy = .3, rr = .75) {
  const id = U('har');
  return [`<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${rr}">${stops.map(s => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ''}/>`).join('')}</radialGradient>`, id];
}
function ha_lg(stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1) {
  const id = U('hal');
  return [`<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(s => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ''}/>`).join('')}</linearGradient>`, id];
}
function ha_blur(sd) { const id = U('hab'); return [`<filter id="${id}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${sd}"/></filter>`, id]; }

/* ================= PAINTING EFFECTS ================= */

function ha_chiaroscuro() {
  const [g1, a] = ha_rg([[0, '#fbe6b8'], [.28, '#d99a4e'], [.62, '#7a3a17'], [1, '#1c0d06']], .32, .28, .78);
  const [g2, j] = ha_lg([[0, '#efdcb6'], [.35, '#b88a55'], [.75, '#4a2c16'], [1, '#160c06']], 0, 0, 1, 0);
  const [g3, b] = ha_rg([[0, '#5c4128'], [.6, '#2a1a0e'], [1, '#120a05']], .2, .2, 1);
  const [g4, c] = ha_lg([[0, '#f6ecd8'], [.5, '#bfa98a'], [1, '#2a1d12']], 0, 0, 1, .4);
  return sv(`<defs>${g1}${g2}${g3}${g4}</defs><rect width="160" height="100" fill="url(#${b})"/>
<rect y="74" width="160" height="26" fill="#2b190c"/><rect y="73" width="160" height="2" fill="#8a6338"/>
<path d="M66 76 Q90 84 140 78 L150 79 Q100 90 60 80Z" fill="#0c0603" opacity=".7"/>
<path d="M78 30 Q74 22 80 18 h14 Q100 22 96 30 Q114 44 108 64 Q104 76 87 77 Q70 76 66 64 Q60 44 78 30Z" fill="url(#${j})"/>
<ellipse cx="87" cy="18.5" rx="7" ry="1.6" fill="#1a0e06"/><path d="M98 34 Q112 34 110 46 Q108 54 102 56" stroke="#2a170a" stroke-width="3" fill="none"/>
<path d="M30 79 Q38 70 54 74 Q70 72 82 80 Q60 92 34 86Z" fill="url(#${c})"/>
<path d="M120 80 Q116 86 104 84" stroke="#0c0603" stroke-width="5" opacity=".5" fill="none"/>
<circle cx="56" cy="64" r="12" fill="url(#${a})"/><path d="M56 52 q1 -4 4 -5" stroke="#3a2210" stroke-width="1.2" fill="none"/>
<circle cx="51" cy="59" r="2" fill="#fff6dc" opacity=".8"/>${vig(.9)}${grainOv(.3)}`);
}

function ha_tenebrism() {
  const [g1, lt] = ha_rg([[0, '#ffe7a8', .95], [.18, '#d58a3a', .8], [.42, '#3a1a08', .5], [.6, '#000', 0]], .5, .5, .5);
  const [g2, face] = ha_rg([[0, '#f6c98e'], [.35, '#c07a43'], [.7, '#4a2210'], [1, '#090403']], .55, .85, .7);
  const [g3, hand] = ha_rg([[0, '#ffd9a0'], [.5, '#a65a2a'], [1, '#100604']], .5, .2, .8);
  return sv(`<defs>${g1}${g2}${g3}</defs>${bg('#050302')}
<circle cx="84" cy="60" r="62" fill="url(#${lt})"/>
<path d="M44 100 Q50 72 70 66 L100 66 Q122 72 128 100Z" fill="#1a0b05"/>
<path d="M70 70 Q84 64 100 70 L96 100 L74 100Z" fill="#3a1d0c" opacity=".8"/>
<path d="M72 30 Q72 14 86 14 Q100 14 100 30 Q100 48 86 52 Q72 48 72 30Z" fill="url(#${face})"/>
<path d="M68 30 Q66 10 86 8 Q106 10 104 30 Q100 18 86 18 Q74 18 68 30Z" fill="#0c0604"/>
<path d="M78 33 h5 M90 33 h5" stroke="#3a1a0a" stroke-width="1.2"/><path d="M82 44 q4 2 8 0" stroke="#5a2a12" stroke-width="1" fill="none"/>
<rect x="82.5" y="58" width="3.5" height="12" fill="#efe0c0"/><path d="M84.2 49 q-2.4 4 0 9 q2.4 -5 0 -9Z" fill="#fff4c8"/>
<circle cx="84.2" cy="55" r="5" fill="#ffd27a" opacity=".35"/>
<path d="M70 76 Q74 66 82 68 L83 76 Q78 80 70 76Z" fill="url(#${hand})"/>
<path d="M98 76 Q94 66 87 68 L86 76 Q91 80 98 76Z" fill="url(#${hand})"/>${grainOv(.25)}`);
}

function ha_sfumato() {
  const [g1, sky] = ha_lg([[0, '#9fb4a8'], [.45, '#c8c9a2'], [1, '#6e7a52']]);
  const [g2, face] = ha_rg([[0, '#f0d4a0'], [.5, '#c99a64'], [1, '#6a4524']], .45, .35, .7);
  const [f, bl] = ha_blur(1.1);
  const [f2, bl2] = ha_blur(.55);
  return sv(`<defs>${g1}${g2}${f}${f2}</defs><rect width="160" height="100" fill="url(#${sky})"/>
<g filter="url(#${bl})"><path d="M0 52 Q20 40 36 48 Q46 30 58 44 L58 100 L0 100Z" fill="#7d8f74" opacity=".8"/>
<path d="M102 46 Q118 30 130 42 Q144 34 160 44 L160 100 L102 100Z" fill="#7d8f74" opacity=".8"/>
<path d="M0 70 Q26 60 50 68 L50 100 L0 100Z" fill="#5c5a36"/><path d="M110 66 Q136 58 160 64 L160 100 L110 100Z" fill="#5c5a36"/>
<path d="M14 66 Q30 62 26 56 Q22 50 40 50" stroke="#c8b07a" stroke-width="2" fill="none"/>
<path d="M50 100 Q48 58 64 40 Q60 18 80 14 Q100 18 96 40 Q112 58 110 100Z" fill="#2a1d12"/>
<path d="M54 100 Q60 70 80 66 Q100 70 106 100Z" fill="#3a2c1a"/>
<path d="M68 64 Q80 60 92 64 L90 72 Q80 69 70 72Z" fill="#c99a64"/>
<ellipse cx="80" cy="38" rx="11.5" ry="15" fill="url(#${face})"/>
<path d="M66 92 Q80 82 96 90 Q86 98 70 96Z" fill="#d8ae78"/></g>
<g filter="url(#${bl2})" opacity=".85"><path d="M73 35 q2.5 -1.2 5 0 M82 35 q2.5 -1.2 5 0" stroke="#4a2c14" stroke-width="1.3" fill="none"/>
<path d="M80 38 l-.6 5" stroke="#8a5a30" stroke-width=".8"/><path d="M75.5 47 q4.5 1.6 9 0" stroke="#7a4424" stroke-width="1" fill="none"/></g>${grainOv(.2)}`);
}

function ha_grisaille() {
  const [g1, st] = ha_lg([[0, '#e8e6e0'], [.5, '#a8a6a0'], [1, '#55534f']], 0, 0, 1, 0);
  const [g2, ni] = ha_lg([[0, '#3e3d3a'], [1, '#7a7873']], 0, 0, 1, 0);
  const statue = x => `<path d="M${x - 16} 92 V34 A16 16 0 0 1 ${x + 16} 34 V92Z" fill="url(#${ni})"/>
<path d="M${x - 16} 34 A16 16 0 0 1 ${x + 16} 34" stroke="#c8c6c0" stroke-width="1.4" fill="none"/>
<rect x="${x - 13}" y="80" width="26" height="6" fill="#bdbbb5"/><rect x="${x - 13}" y="85" width="26" height="2" fill="#6a6864"/>
<circle cx="${x}" cy="32" r="5" fill="url(#${st})"/>
<path d="M${x - 5} 38 Q${x} 36 ${x + 5} 38 Q${x + 10} 50 ${x + 9} 80 H${x - 9} Q${x - 10} 50 ${x - 5} 38Z" fill="url(#${st})"/>
<path d="M${x - 3} 44 Q${x - 2} 62 ${x - 5} 79 M${x + 2} 46 Q${x + 4} 62 ${x + 2} 79 M${x + 6} 50 Q${x + 7} 64 ${x + 6} 79" stroke="#5e5c58" stroke-width=".8" fill="none"/>
<path d="M${x - 5} 50 Q${x + 2} 54 ${x + 7} 48" stroke="#f4f2ec" stroke-width="1.2" fill="none" opacity=".8"/>
<path d="M${x + 11} 80 Q${x + 18} 70 ${x + 16} 46 V92 H${x + 11}Z" fill="#2a2927" opacity=".5"/>`;
  return sv(`<defs>${g1}${g2}</defs>${bg('#8d8b86')}
<rect x="6" y="6" width="148" height="88" fill="none" stroke="#c4c2bc" stroke-width="1.5"/><rect x="9" y="9" width="142" height="82" fill="none" stroke="#5f5d59" stroke-width="1"/>
<line x1="80" y1="9" x2="80" y2="91" stroke="#5f5d59" stroke-width="1.5"/>${statue(46)}${statue(114)}${grainOv(.3)}`);
}

function ha_glazing() {
  const [g1, sp] = ha_rg([[0, '#f4f4f0'], [.4, '#a9a8a2'], [.8, '#4b4a46'], [1, '#2a2926']], .35, .3, .75);
  const ball = (x, glazes) => `<circle cx="${x}" cy="52" r="17" fill="url(#${sp})"/>${glazes.map(c => `<circle cx="${x}" cy="52" r="17" fill="${c[0]}" opacity="${c[1]}" style="mix-blend-mode:multiply"/>`).join('')}<ellipse cx="${x + 2}" cy="72" rx="16" ry="3" fill="#000" opacity=".35"/>`;
  const plus = x => `<path d="M${x - 4} 52 h8 M${x} 48 v8" stroke="#d8c8a8" stroke-width="1.6" stroke-linecap="round"/>`;
  const lay = (x, cols) => cols.map((c, i) => `<rect x="${x - 14 + i * 3}" y="${84 + i * 2.2}" width="${28 - i * 6}" height="3" fill="${c}" opacity=".85"/>`).join('');
  return sv(`<defs>${g1}</defs>${bg('#2f2620')}<rect y="72" width="160" height="28" fill="#251d18"/>
${ball(26, [])}${plus(53)}${ball(80, [['#f2c23a', .75]])}${plus(107)}${ball(134, [['#f2c23a', .75], ['#c0182a', .7], ['#7a0a2a', .25]])}
<circle cx="128" cy="46" r="3" fill="#fff" opacity=".55"/>
${lay(26, ['#9a9994'])}${lay(80, ['#9a9994', '#e8b830'])}${lay(134, ['#9a9994', '#e8b830', '#b8182a'])}${grainOv(.25)}`);
}

function ha_allaprima() {
  const r = rng(11);
  let s = '';
  for (let i = 0; i < 70; i++) s += ha_dab(r() * 170 - 5, r() * 104 - 2, 22 + r() * 22, 8 + r() * 6, -40 + r() * 30, pick(r, ['#6b6050', '#7a6d5a', '#5d5346', '#857660', '#8e8270']), .85, 1.5);
  s += `<rect y="84" width="160" height="16" fill="#4a3e32"/>` + ha_dab(30, 86, 50, 4, 2, '#5e5040', .9, 1) + ha_dab(130, 88, 50, 4, -2, '#5e5040', .9, 1);
  s += `<path d="M64 100 Q60 80 68 66 h24 Q100 80 96 100Z" fill="#1d2a30"/>`;
  for (let i = 0; i < 8; i++) s += ha_dab(70 + r() * 20, 72 + r() * 24, 10 + r() * 6, 2.5, 70 + r() * 30, '#3c5560', .9);
  s += ha_dab(72, 78, 12, 2, 80, '#c8dce0', .9);
  const leaf = [[52, 54], [104, 52], [60, 38], [100, 66], [118, 40], [44, 66]];
  for (const [x, y] of leaf) for (let k = 0; k < 3; k++) s += ha_dab(x + r() * 8 - 4, y + r() * 6 - 3, 12 + r() * 6, 4, r() * 180, pick(r, ['#2f5a2a', '#4f7a34', '#7a9a48']), .95);
  const fl = [[66, 40, '#e8889a'], [92, 34, '#f2b8c0'], [80, 54, '#d0405a'], [110, 50, '#f6e2d8'], [54, 52, '#f0a8b0']];
  for (const [x, y, c] of fl) {
    for (let k = 0; k < 9; k++) { const a = r() * Math.PI * 2, d = r() * 7; s += ha_dab(x + Math.cos(a) * d, y + Math.sin(a) * d, 7 + r() * 5, 4 + r() * 2, r() * 180, c, .95); }
    s += ha_dab(x - 2, y - 3, 6, 2.4, -30, '#fff8f0', .95) + ha_dab(x + 3, y + 3, 5, 2, 40, '#8a2038', .7);
  }
  return sv(`${bg('#6e6252')}${s}${grainOv(.2)}`);
}

function ha_scumbling() {
  const id = U('hasc');
  const [g1, sky] = ha_lg([[0, '#2a2030'], [.6, '#6a3a30'], [1, '#a4552c']]);
  const r = rng(5);
  let s = '';
  for (let i = 0; i < 40; i++) { const y = 30 + r() * 40; s += ha_dab(r() * 160, y, 10 + r() * 16, 2 + r() * 3, -6 + r() * 12, '#f2e2c8', .06 + r() * .12, 1); }
  return sv(`<defs>${g1}<filter id="${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".018 .06" numOctaves="4" seed="8"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 .93  0 0 0 0 .84  1.8 0 0 0 -.75"/><feComposite in2="SourceGraphic" operator="in"/></filter></defs>
<rect width="160" height="100" fill="url(#${sky})"/><circle cx="112" cy="52" r="9" fill="#e9a050"/>
<path d="M0 62 Q30 48 58 58 Q80 50 104 60 L104 100 L0 100Z" fill="#1e1a20"/><rect y="62" width="160" height="38" fill="#241c22"/>
<path d="M0 80 Q20 70 46 76 Q60 82 70 100 H0Z" fill="#14100f"/><path d="M100 70 h24 M96 76 h32" stroke="#e9a050" stroke-width="1.2" opacity=".5"/>
${s}<rect x="0" y="10" width="160" height="70" filter="url(#${id})" fill="#fff" opacity=".7"/>${grainOv(.25)}`);
}

function ha_drybrush() {
  const r = rng(21);
  let s = '';
  for (let i = 0; i < 260; i++) {
    const x = r() * 165 - 3, y = 46 + Math.pow(r(), .7) * 56, l = 4 + r() * 9, a = -100 + r() * 30;
    const rad = a * Math.PI / 180;
    s += `<path d="M${f1(x)} ${f1(y)}l${f1(Math.cos(rad) * l)} ${f1(Math.sin(rad) * l)}" stroke="${pick(r, ['#8a6a3a', '#a88450', '#6a5030', '#c4a46a', '#5a4428'])}" stroke-width="${f1(.4 + r() * .7)}" stroke-dasharray="${f1(1 + r() * 3)} ${f1(.5 + r() * 1.5)}" opacity="${f1(.5 + r() * .5)}"/>`;
  }
  let sk = '';
  for (let i = 0; i < 10; i++) { const y = 4 + r() * 30; sk += `<path d="M${f1(r() * 160)} ${f1(y)}h${f1(20 + r() * 40)}" stroke="#a8a49a" stroke-width="${f1(.6 + r() * 1.4)}" stroke-dasharray="${f1(2 + r() * 6)} ${f1(1 + r() * 3)}" opacity=".18"/>`; }
  return sv(`${bg('#e6e0d2')}${sk}<path d="M0 54 Q50 40 100 46 Q130 44 160 50 V100 H0Z" fill="#b89a64"/>
<path d="M104 46 V34 L114 26 L124 34 V46Z" fill="#8c8a84"/><path d="M104 34 L114 26 L124 34" stroke="#4a4844" stroke-width="1.2" fill="none"/>
<rect x="108" y="36" width="3" height="4" fill="#3a3834"/><rect x="117" y="36" width="3" height="4" fill="#3a3834"/>
<path d="M124 46 V38 H138 V48" fill="#7a7872"/><path d="M30 60 V40 M28 46 h5" stroke="#4a3a28" stroke-width="1.2"/>
${s}<path d="M36 52 q2 -1 4 0" stroke="#2a2018" stroke-width=".6" fill="none"/>${grainOv(.35)}`);
}

function ha_paletteknife() {
  const r = rng(31);
  const slab = (x, y, w, h, col, a) => {
    const p = [[x, y], [x + w, y + (r() - .5) * 4], [x + w + (r() - .5) * 4, y + h], [x + (r() - .5) * 4, y + h + (r() - .5) * 3]];
    return `<g transform="rotate(${f1(a)} ${f1(x + w / 2)} ${f1(y + h / 2)})"><polygon points="${pts(p)}" fill="${col}"/><polyline points="${pts([p[0], p[1]])}" stroke="#fff" stroke-width=".9" opacity=".55"/><polyline points="${pts([p[2], p[3]])}" stroke="#000" stroke-width=".9" opacity=".3"/></g>`;
  };
  let s = '';
  for (let i = 0; i < 34; i++) s += slab(r() * 170 - 14, r() * 52 - 6, 16 + r() * 18, 7 + r() * 6, pick(r, ['#3f7cc4', '#6aa0d8', '#a8cce8', '#2c5ea8', '#e8eef0']), -12 + r() * 24);
  s += slab(96, 12, 16, 14, '#f6c43a', 8) + slab(100, 18, 10, 8, '#fde08a', -10);
  for (let i = 0; i < 26; i++) s += slab(r() * 170 - 14, 56 + r() * 44, 18 + r() * 20, 8 + r() * 6, pick(r, ['#c8a43a', '#e0c050', '#8a9a30', '#a8762a', '#d88a2a']), -10 + r() * 20);
  for (let i = 0; i < 18; i++) s += slab(28 + r() * 30, 22 + r() * 36, 9 + r() * 9, 7 + r() * 5, pick(r, ['#1f5a2a', '#2f7a34', '#4a9a3a', '#163e22']), r() * 90 - 45);
  s += slab(40, 56, 4, 18, '#4a2a18', 0);
  return sv(`${bg('#5a8ac8')}${s}`);
}

function ha_trompeloeil() {
  const r = rng(41);
  let gr = '';
  for (let i = 0; i < 22; i++) { const y = 8 + i * 4 + r() * 2; gr += `<path d="M10 ${f1(y)} Q60 ${f1(y + (r() - .5) * 4)} 100 ${f1(y)} T150 ${f1(y + (r() - .5) * 3)}" stroke="#6a4424" stroke-width="${f1(.3 + r() * .6)}" fill="none" opacity=".5"/>`; }
  const [g1, fr] = ha_lg([[0, '#d8b46a'], [.5, '#a07a34'], [1, '#5a3e18']], 0, 0, 1, 1);
  const tack = (x, y) => `<circle cx="${x + 1.2}" cy="${y + 1.4}" r="2.2" fill="#000" opacity=".3"/><circle cx="${x}" cy="${y}" r="2.2" fill="#b8b4a8"/><circle cx="${x - .7}" cy="${y - .7}" r=".8" fill="#fff"/>`;
  let wr = '';
  for (let i = 0; i < 5; i++) wr += `<path d="M58 ${32 + i * 7} H${f1(96 - r() * 14)}" stroke="#6a6458" stroke-width=".7" stroke-dasharray="${f1(2 + r() * 3)} 1"/>`;
  return sv(`<defs>${g1}</defs>${bg('#a06a3a')}${gr}
<rect x="4" y="4" width="152" height="92" fill="none" stroke="url(#${fr})" stroke-width="8"/><rect x="8" y="8" width="144" height="84" fill="none" stroke="#3a2410" stroke-width="1"/>
<g transform="rotate(-4 78 52)"><rect x="54" y="26" width="50" height="50" fill="#2a1608" opacity=".35" transform="translate(3 4)"/>
<path d="M52 24 H102 V64 L90 76 H52Z" fill="#efe6cf"/><path d="M102 64 L90 76 Q92 68 102 64Z" fill="#c8bc9e"/><path d="M90 76 Q92 68 102 64" stroke="#8a7e64" stroke-width=".5" fill="none"/>${wr}</g>
${tack(56, 27)}${tack(98, 24)}
<g transform="translate(128 84) rotate(-25) scale(1.5)"><ellipse cx="1.5" cy="2.5" rx="3" ry="2" fill="#000" opacity=".3"/><ellipse cx="-2" cy="-1" rx="3.4" ry="1.6" fill="#cfd8e0" opacity=".7" transform="rotate(-30)"/><ellipse cx="2" cy="-1" rx="3.4" ry="1.6" fill="#cfd8e0" opacity=".7" transform="rotate(30)"/><ellipse cx="0" cy="1" rx="1.6" ry="2.6" fill="#1a1a1a"/><circle cx="0" cy="-1.8" r="1.2" fill="#3a1a14"/></g>
<rect x="22" y="40" width="22" height="3" fill="#7a2a20" transform="rotate(20 33 41)"/><rect x="22" y="40" width="22" height="3" fill="#7a2a20" transform="rotate(-20 33 41)"/>
<rect x="24" y="30" width="16" height="22" fill="#e4dcc4" transform="rotate(6 32 41)"/>
<rect x="22" y="40" width="22" height="3" fill="#8a3428" transform="rotate(-20 33 41)"/>${grainOv(.25)}`);
}

function ha_underdrawing() {
  const r = rng(51);
  let wv = '';
  for (let i = 0; i < 50; i++) wv += `<path d="M0 ${i * 2} H160" stroke="#a8946a" stroke-width=".4" opacity=".5"/>`;
  for (let i = 0; i < 80; i++) wv += `<path d="M${i * 2} 0 V100" stroke="#a8946a" stroke-width=".4" opacity=".35"/>`;
  const [cl, cid] = ha_clip(`<rect x="12" y="10" width="72" height="80"/>`);
  const [cl2, cid2] = ha_clip(`<rect x="84" y="10" width="64" height="80"/>`);
  const sk = (g) => `<g stroke="#4a4844" stroke-width=".55" fill="none" opacity="${g}"><path d="M14 66 H146"/><path d="M38 66 Q32 44 50 36 Q80 28 108 36 Q126 44 120 66"/><ellipse cx="79" cy="36" rx="29" ry="5"/>
<path d="M100 34 Q96 18 108 14 Q120 16 118 30 Q116 36 108 36"/><path d="M107 14 q2 -4 5 -5"/><path d="M60 34 Q56 22 66 18 Q78 18 74 32"/>
<path d="M80 10 V90 M14 50 H146" stroke-dasharray="2 2" opacity=".6"/><path d="M38 66 Q50 80 79 82 Q108 80 120 66"/></g>`;
  const [g1, bowl] = ha_lg([[0, '#4a6a9a'], [1, '#1a2a4a']], 0, 0, 0, 1);
  return sv(`<defs>${cl}${cl2}${g1}</defs>${bg('#cdb98c')}${wv}
<rect x="12" y="10" width="136" height="80" fill="#f2ede0"/>
<g clip-path="url(#${cid})"><rect x="12" y="10" width="72" height="56" fill="#6a5a44"/><rect x="12" y="66" width="72" height="24" fill="#9a7444"/>
<path d="M38 66 Q32 44 50 36 Q80 28 108 36 Q126 44 120 66 Q108 80 79 82 Q50 80 38 66Z" fill="url(#${bowl})"/><ellipse cx="79" cy="36" rx="29" ry="5" fill="#0f1a30"/>
<path d="M60 34 Q56 22 66 18 Q78 18 74 32Z" fill="#c8302a"/><path d="M62 24 q3 -3 5 -2" stroke="#ffd0b0" stroke-width="1.4" fill="none"/></g>
<g clip-path="url(#${cid2})">${sk(.9)}${ha_hatch(r, { x: 104, y: 40, w: 20, h: 26, ang: 50, gap: 2.2, col: '#4a4844', sw: .4, op: .6 })}
<rect x="84" y="10" width="14" height="80" fill="#f2ede0" opacity=".001"/></g>
<path d="M84 10 Q82 40 86 60 Q83 76 85 90" stroke="#6a5a44" stroke-width="2.4" fill="none" opacity=".5"/>
<g clip-path="url(#${cid})">${sk(.35)}</g>${grainOv(.3)}`);
}

function ha_tonalism() {
  const [g1, sky] = ha_lg([[0, '#1e3a44'], [.55, '#3e5a5a'], [.62, '#4a6260'], [1, '#22383e']]);
  const [f, bl] = ha_blur(1.2);
  const r = rng(61);
  let lights = '';
  for (let i = 0; i < 9; i++) { const x = 8 + r() * 150, y = 56 + r() * 3; lights += `<circle cx="${f1(x)}" cy="${f1(y)}" r=".9" fill="#e8c070"/><path d="M${f1(x)} ${f1(y + 3)}v${f1(5 + r() * 8)}" stroke="#d8b060" stroke-width=".8" opacity=".45"/>`; }
  let sp = '';
  for (let i = 0; i < 14; i++) sp += `<circle cx="${f1(118 + (r() - .5) * 22)}" cy="${f1(16 + r() * 22)}" r="${f1(.4 + r() * .7)}" fill="#f0c870" opacity="${f1(.4 + r() * .5)}"/>`;
  return sv(`<defs>${g1}${f}</defs><rect width="160" height="100" fill="url(#${sky})"/>
<g filter="url(#${bl})"><path d="M0 58 Q40 54 80 57 T160 56 V60 H0Z" fill="#2c4446" opacity=".7"/>
<path d="M28 20 H92 V24 H86 V74 H80 V24 H40 V70 H34 V24 H28Z" fill="#14262c" opacity=".85"/>
<path d="M58 84 q10 -3 20 0" stroke="#14262c" stroke-width="2" fill="none"/><path d="M66 82 v-8" stroke="#14262c" stroke-width=".8"/>
<circle cx="132" cy="22" r="5" fill="#d8e0c8" opacity=".3"/></g>${lights}${sp}<rect width="160" height="100" fill="#3a5a58" opacity=".18"/>${grainOv(.2)}`);
}

/* ================= DRAWING APPROACHES ================= */

function ha_paper(c, a = .3) { return bg(c) + grainOv(a); }

function ha_gesture() {
  const [w, wid] = wob(1.4, .08, 4);
  const g = (d, sw = 1.1) => `<path d="${d}" stroke="#2a2420" stroke-width="${sw}" fill="none" stroke-linecap="round"/>`;
  const la = d => `<path d="${d}" stroke="#c0402a" stroke-width="1" fill="none" stroke-linecap="round" opacity=".75"/>`;
  return sv(`<defs>${w}</defs>${ha_paper('#f1e9d6')}<g filter="url(#${wid})">
${la('M22 88 Q30 56 34 26')}<ellipse cx="34" cy="18" rx="4" ry="5" stroke="#2a2420" fill="none" stroke-width="1"/>
${g('M34 24 Q28 40 30 54 Q26 70 18 88 M30 54 Q36 70 34 88 M33 28 Q44 22 52 12 M33 30 Q22 34 16 44')}
${g('M33 30 Q38 44 30 54', .6)}
${la('M66 86 Q82 52 104 40')}<ellipse cx="106" cy="33" rx="4" ry="5" stroke="#2a2420" fill="none" stroke-width="1"/>
${g('M104 39 Q92 48 84 60 Q80 72 66 86 M84 60 Q94 68 102 84 M100 44 Q112 52 120 48 M98 44 Q86 40 78 46')}
${g('M102 41 Q92 52 85 59', .6)}
${la('M140 90 Q150 60 136 30')}<ellipse cx="134" cy="22" rx="3.8" ry="4.6" stroke="#2a2420" fill="none" stroke-width="1"/>
${g('M135 27 Q146 46 142 62 Q144 76 140 90 M142 62 Q130 74 128 90 M137 32 Q126 40 124 52 M138 32 Q150 28 154 20')}
</g>`);
}

function ha_blindcontour() {
  const r = rng(71);
  // a face in three-quarter: one path that drifts
  const P = [[60, 14], [52, 20], [48, 34], [50, 50], [56, 64], [66, 74], [76, 78], [86, 74], [92, 66], [96, 58], [98, 52], [104, 50], [98, 46], [100, 36], [96, 22], [86, 14], [72, 12], [64, 22], [74, 26], [82, 24], [76, 32], [68, 32], [66, 28], [80, 30], [92, 30], [90, 40], [94, 48], [86, 50], [80, 56], [72, 60], [82, 62], [90, 60], [84, 66], [76, 64], [70, 84], [66, 96], [100, 80], [112, 98]];
  let dx = 0, dy = 0;
  const Q = [];
  for (const [x, y] of P) {
    dx += (r() - .5) * 3; dy += (r() - .5) * 3;
    const n = 3;
    for (let k = 0; k < n; k++) Q.push([x + dx + (r() - .5) * 2.2 + k * .3, y + dy + (r() - .5) * 2.2]);
  }
  // resample: keep wobble but in order
  const Q2 = [];
  for (let i = 0; i < P.length - 1; i++) {
    for (let k = 0; k < 4; k++) {
      const t = k / 4, a = P[i], b = P[i + 1];
      dx += (r() - .5) * 1.4; dy += (r() - .5) * 1.4;
      Q2.push([a[0] + (b[0] - a[0]) * t + dx + (r() - .5) * 1.6, a[1] + (b[1] - a[1]) * t + dy + (r() - .5) * 1.6]);
    }
  }
  return sv(`${ha_paper('#f4efe4')}<path d="${ha_cr(Q2)}" stroke="#1f2430" stroke-width=".8" fill="none" stroke-linejoin="round" transform="translate(4 0)"/>`);
}

function ha_oneline() {
  return sv(`${ha_paper('#efe7d8', .25)}<circle cx="122" cy="30" r="13" fill="#e8b4a0" opacity=".6"/>
<path d="${ha_oneline_face()}" stroke="#1a1a1a" stroke-width="1.15" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`);
}
// one continuous stroke: profile face facing right, eye loop, ear loop, hair swirl
function ha_oneline_face() {
  return [
    'M30 98 C34 86 38 76 44 70',          // neck back
    'C40 60 36 48 40 36',                  // back of head
    'C44 18 62 8 80 12',                   // crown
    'C90 14 96 20 98 28',                  // forehead top
    'C99 34 97 38 98 42',                  // brow
    'C103 48 108 52 104 55',               // nose
    'C101 57 100 58 101 60',               // under nose
    'C104 61 104 64 100 65',               // lips
    'C103 67 102 70 99 71',                // lower lip
    'C98 76 96 80 90 82',                  // chin
    'C84 84 80 82 78 88 C76 92 76 96 76 99', // throat down
    'M76 99 C70 96 64 84 66 74',           // (pen does not lift visually: retrace up)
    'C68 66 76 62 72 54',                  // jaw to ear
    'C68 48 60 50 61 56 C62 62 70 62 70 56', // ear loop
    'C70 48 82 44 88 42',                  // to eye
    'C92 41 94 44 91 45 C88 46 86 43 90 41', // eye loop
    'C94 38 90 30 82 28 C70 26 58 32 52 42' // hair swirl
  ].join(' ').replace(/ M76 99/, ' L76 99');
}

function ha_linewash() {
  const [w, wid] = wob(5, .05, 9);
  const [w2, wid2] = wob(.8, .2, 2);
  const wash = (x, y, ww, h, c, o = .55) => `<rect x="${x}" y="${y}" width="${ww}" height="${h}" fill="${c}" opacity="${o}" filter="url(#${wid})" rx="2"/>`;
  const r = rng(81);
  let win = '';
  const bld = [[10, 30, 34], [44, 18, 30], [74, 36, 26], [100, 24, 38], [138, 40, 20]];
  for (const [x, top, ww] of bld) for (let yy = top + 6; yy < 72; yy += 9) for (let xx = x + 4; xx < x + ww - 5; xx += 7) win += `<rect x="${f1(xx + (r() - .5))}" y="${f1(yy)}" width="3.4" height="5"/>`;
  return sv(`<defs>${w}${w2}</defs>${ha_paper('#f7f2e6', .25)}
${wash(6, 26, 40, 50, '#d8a070')}${wash(42, 14, 34, 62, '#e6c890')}${wash(74, 32, 28, 44, '#8ab0c8')}${wash(98, 22, 42, 54, '#d88a78')}${wash(20, 76, 130, 20, '#a8a49a', .4)}
${wash(110, 4, 46, 16, '#9cc4dc', .4)}
<g stroke="#2a2a30" stroke-width=".7" fill="none" filter="url(#${wid2})" stroke-linecap="round">
<path d="M8 31 L46 29 M10 30 V78 M44 18 L75 17 M46 16 V78 M74 36 L101 35 M76 37 V78 M100 24 L139 23 M102 22 V78 M138 40 L159 41 M139 39 V78 M2 78 H158"/>
<path d="M50 18 L60 8 L70 17 M104 24 L112 15 h18 l8 9"/><g stroke-width=".45">${win}</g>
<path d="M30 78 L4 98 M120 78 L154 98"/><path d="M90 78 V54 M88 54 h5"/></g>
${fig(64, 90, 10, '#2a2a30')}${fig(112, 86, 8, '#2a2a30')}`);
}

function ha_sanguine() {
  const r = rng(91);
  const red = '#a8452a';
  const head = 'M70 22 Q74 12 86 12 Q100 14 102 28 Q104 40 98 50 Q94 58 86 60 Q80 60 76 56 L74 50 Q70 50 70 46 L72 42 Q68 40 70 36 L68 32 Q66 26 70 22Z';
  const [c1, ci] = ha_clip(`<path d="M86 12 Q100 14 102 28 Q104 40 98 50 Q94 58 86 60 Q90 46 88 34 Q88 22 86 12Z"/>`);
  const [c2, ci2] = ha_clip(`<path d="M78 58 Q76 70 70 80 Q86 90 112 84 Q104 72 98 52Z"/>`);
  const [c4, ci4] = ha_clip(`<path d="M38 48 Q46 52 46 60 Q46 70 42 76 Q36 70 38 48Z"/>`);
  const [c3, ci3] = ha_clip(`<path d="M80 12 Q100 6 106 24 Q108 34 102 38 Q100 22 86 18 Q78 18 74 24 Q72 14 80 12Z"/>`);
  return sv(`<defs>${c1}${c2}${c3}${c4}</defs>${ha_paper('#f0e2c6', .35)}
${ha_hatch(r, { x: 80, y: 8, w: 30, h: 56, ang: 60, gap: 1.6, col: red, sw: .55, op: .8, clip: ci })}
${ha_hatch(r, { x: 66, y: 50, w: 50, h: 40, ang: 55, gap: 2, col: red, sw: .5, op: .7, clip: ci2 })}
${ha_hatch(r, { x: 70, y: 4, w: 40, h: 36, ang: 30, gap: 1.2, col: '#8a3220', sw: .6, op: .9, clip: ci3 })}
<path d="${head}" stroke="${red}" stroke-width=".9" fill="none"/><path d="M76 56 Q76 70 70 80 M98 52 Q104 72 112 84" stroke="${red}" stroke-width=".8" fill="none"/>
<path d="M76 32 q3 -1.5 6 0 M77 34 q2 1 4 0" stroke="#7a2a18" stroke-width=".7" fill="none"/><path d="M90 30 a3 4 0 1 1 1 7" stroke="${red}" stroke-width=".6" fill="none"/>
<g stroke="${red}" stroke-width=".7" fill="none" opacity=".85"><path d="M30 46 Q22 46 22 56 Q22 62 20 66 l3 1 v4 q0 3 4 3 l2 4 Q40 80 44 72 Q48 64 46 56 Q44 46 30 46Z"/><path d="M28 80 Q26 88 22 94 M44 72 Q48 84 56 92"/></g>
${ha_hatch(r, { x: 36, y: 46, w: 12, h: 30, ang: 60, gap: 1.8, col: red, sw: .45, op: .6, clip: ci4 })}`);
}

function ha_troiscrayons() {
  const r = rng(101);
  const [b1, bl] = ha_blur(2);
  const [c1, ci] = ha_clip(`<path d="M60 26 Q66 10 84 10 Q104 12 104 34 Q96 22 84 22 Q72 22 66 34Z"/>`);
  return sv(`<defs>${b1}${c1}</defs>${ha_paper('#c9b48c', .35)}
<path d="M52 36 Q50 12 82 8 Q112 10 110 38 Q112 54 104 62" stroke="#1e1a18" stroke-width="1" fill="none"/>
${ha_hatch(r, { x: 54, y: 4, w: 56, h: 34, ang: 70, gap: 1.6, col: '#1e1a18', sw: .6, op: .85, clip: ci })}
<path d="M66 34 Q64 52 74 64 Q82 70 90 66 Q100 60 102 44 Q102 36 100 32" stroke="#1e1a18" stroke-width=".9" fill="none"/>
<g filter="url(#${bl})"><ellipse cx="73" cy="50" rx="5" ry="4" fill="#c04a34" opacity=".55"/><ellipse cx="96" cy="50" rx="4" ry="4" fill="#c04a34" opacity=".45"/><ellipse cx="85" cy="59" rx="3.5" ry="1.8" fill="#b83a2a" opacity=".8"/></g>
<path d="M82 59 q3 -1.2 6 0 q-3 2 -6 0" stroke="#a8302a" stroke-width=".8" fill="#c04a3a"/>
<path d="M72 41 q4 -2 7 0 M89 41 q4 -2 7 0" stroke="#1e1a18" stroke-width=".9" fill="none"/><circle cx="75.5" cy="43" r="1.1" fill="#1e1a18"/><circle cx="92.5" cy="43" r="1.1" fill="#1e1a18"/>
<path d="M85 44 q-1 6 -2 8 q2 1 4 0" stroke="#a8402a" stroke-width=".7" fill="none"/>
<g stroke="#fbf6ea" stroke-linecap="round" fill="none"><path d="M80 32 Q86 30 92 32" stroke-width="1.5" opacity=".75"/><path d="M85 46 v4" stroke-width="1.4"/><path d="M70 48 q1 2 2 3" stroke-width="1.3" opacity=".8"/><path d="M84 64 q2 1 4 0" stroke-width="1.1"/></g>
<path d="M74 64 Q70 78 58 90 M98 60 Q104 80 120 92 M60 90 Q90 80 120 92" stroke="#1e1a18" stroke-width=".8" fill="none"/>
<g stroke="#a8402a" stroke-width=".5" opacity=".7">${[0, 1, 2, 3, 4, 5, 6].map(i => `<path d="M${100 + i * 2.4} ${66 + i * 3} l5 -3"/>`).join('')}</g>
<g stroke="#fbf6ea" stroke-width="1.2" opacity=".8" stroke-linecap="round">${[0, 1, 2, 3].map(i => `<path d="M${66 + i * 4} ${78 + i} l5 -4"/>`).join('')}</g>`);
}

function ha_valuestudy() {
  const v = ['#e8e8e6', '#b4b4b0', '#7a7a76', '#3a3a38'];
  return sv(`${bg(v[0])}<path d="M0 54 Q30 36 56 46 Q84 30 116 44 Q140 38 160 46 V100 H0Z" fill="${v[1]}"/>
<path d="M0 68 Q40 58 80 64 Q120 58 160 66 V100 H0Z" fill="${v[2]}"/>
<path d="M0 82 Q60 74 160 84 V100 H0Z" fill="${v[3]}"/>
<path d="M104 84 V56 Q92 54 92 44 Q92 28 108 26 Q124 26 124 42 Q126 54 112 56 V84Z" fill="${v[3]}"/>
<circle cx="40" cy="24" r="7" fill="#fafaf8"/>
<g transform="translate(6 6)">${v.map((c, i) => `<rect x="${i * 9}" y="0" width="9" height="7" fill="${c}" stroke="#2a2a28" stroke-width=".4"/>`).join('')}</g>`);
}

function ha_notan() {
  const ink = '#141210', pap = '#f1ead8';
  return sv(`${bg(pap)}<path d="M0 0 H160 V58 Q130 44 104 56 Q80 66 52 52 Q26 42 0 56Z" fill="${ink}"/>
<circle cx="112" cy="24" r="13" fill="${pap}"/>
<path d="M22 100 Q30 70 26 54 Q22 40 34 30 M28 66 Q44 58 60 60 M30 46 Q16 40 8 44" stroke="${pap}" stroke-width="0" fill="none"/>
<path d="M18 100 Q26 74 22 56 L28 56 Q32 74 28 100Z" fill="${ink}"/>
<path d="M4 60 Q24 48 46 58 Q30 58 22 66Z" fill="${ink}"/><path d="M20 46 Q40 34 62 44 Q44 44 30 52Z" fill="${pap}"/>
<path d="M24 74 Q44 64 70 74 Q48 74 30 80Z" fill="${ink}"/>
<path d="M0 100 V88 Q50 78 90 86 Q130 92 160 84 V100Z" fill="${ink}"/>
<path d="M120 84 l8 -10 l8 10Z M132 86 l6 -7 l6 7Z" fill="${pap}"/>`);
}

function ha_academic() {
  const r = rng(111);
  const [g1, sp] = ha_rg([[0, '#f2f0ea'], [.45, '#bcbab2'], [.78, '#6e6c66'], [.9, '#8a8880'], [1, '#7a7872']], .32, .3, .72);
  const [g2, co] = ha_lg([[0, '#e8e6e0'], [.4, '#b0aea6'], [.85, '#5a5852'], [1, '#76746e']], 0, 0, 1, 0);
  const [c1, ci] = ha_clip(`<rect x="0" y="0" width="160" height="72"/>`);
  return sv(`<defs>${g1}${g2}${c1}</defs>${bg('#d8d4ca')}
${ha_hatch(r, { x: 0, y: 0, w: 160, h: 72, ang: 60, gap: 1.6, col: '#8a8678', sw: .4, op: .45, clip: ci })}
<rect y="72" width="160" height="28" fill="#c4c0b4"/><path d="M0 72 H160" stroke="#8a8678" stroke-width=".6"/>
<path d="M76 74 Q100 80 132 76 L118 70Z" fill="#6a665c" opacity=".55"/><path d="M120 74 Q136 78 156 75 L150 72Z" fill="#6a665c" opacity=".5"/>
<polygon points="20,74 34,80 58,74 58,46 34,52 20,46" fill="#9a988f"/><polygon points="20,46 34,52 58,46 44,40" fill="#f0eee8"/><polygon points="34,52 58,46 58,74 34,80" fill="#6c6a64"/><polygon points="20,46 34,52 34,80 20,74" fill="#c8c6be"/>
<circle cx="78" cy="58" r="16" fill="url(#${sp})"/>
<path d="M118 76 L126 34 L138 76 Q128 80 118 76Z" fill="url(#${co})"/>
<path d="M148 6 V96" stroke="#3a3832" stroke-width=".3"/><circle cx="148" cy="96" r=".9" fill="#3a3832"/>
<g stroke="#3a3832" stroke-width=".35">${[34, 46, 52, 74, 80].map(y => `<path d="M${144} ${y} h4"/>`).join('')}<path d="M10 42 h4 M10 80 h4 M12 42 V80" /></g>`);
}

function ha_ballpoint() {
  const r = rng(121);
  const blue = '#1f3a9a';
  let lines = '';
  for (let y = 12; y < 100; y += 8) lines += `<path d="M0 ${y} H160" stroke="#9ab8d8" stroke-width=".4"/>`;
  const [c1, ci] = ha_clip(`<circle cx="80" cy="48" r="13"/>`);
  const [c2, ci2] = ha_clip(`<path d="M44 48 Q80 20 116 48 Q80 72 44 48Z"/>`);
  let scrib = '';
  for (let i = 0; i < 6; i++) scrib += `<ellipse cx="${f1(134 + (r() - .5) * 4)}" cy="${f1(80 + (r() - .5) * 3)}" rx="${f1(8 + i * 1.4)}" ry="${f1(5 + i)}" stroke="${blue}" stroke-width=".4" fill="none" opacity=".6" transform="rotate(${f1(r() * 30)} 134 80)"/>`;
  return sv(`<defs>${c1}${c2}</defs>${bg('#fbfaf4')}${lines}<path d="M18 0 V100" stroke="#e08a8a" stroke-width=".6"/>
<g clip-path="url(#${ci2})">${ha_hatch(r, { x: 40, y: 24, w: 80, h: 18, ang: 10, gap: 1.6, col: blue, sw: .35, op: .55 })}</g>
${ha_hatch(r, { x: 66, y: 34, w: 28, h: 28, ang: 35, gap: 1.1, col: blue, sw: .35, op: .8, clip: ci })}
${ha_hatch(r, { x: 66, y: 34, w: 28, h: 28, ang: -40, gap: 1.3, col: blue, sw: .35, op: .7, clip: ci })}
<circle cx="80" cy="48" r="5.5" fill="#101a50"/><circle cx="76" cy="44" r="2.4" fill="#fbfaf4"/>
<path d="M44 48 Q80 20 116 48 Q80 72 44 48Z" stroke="${blue}" stroke-width=".9" fill="none"/>
<path d="M42 44 Q80 14 118 44" stroke="${blue}" stroke-width=".5" fill="none" opacity=".7"/>
<path d="M40 30 Q80 6 122 32" stroke="${blue}" stroke-width=".9" fill="none"/>
<g stroke="${blue}" stroke-width=".5">${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => { const t = .12 + i * .095, x = 44 + 72 * t, y = 48 - 56 * t * (1 - t) * 1.0; return `<path d="M${f1(x)} ${f1(y)} l${f1((t - .5) * 6)} -5"/>`; }).join('')}</g>
${scrib}<path d="M24 86 q4 -8 8 0 t8 0 t8 0" stroke="${blue}" stroke-width=".6" fill="none"/>`);
}

function ha_thumbnails() {
  const r = rng(131);
  const box = (x, y, inner) => `<g transform="translate(${x} ${y})"><rect width="40" height="26" fill="#f8f4ea" stroke="#2a2a2a" stroke-width=".9"/>${inner}</g>`;
  const g1 = '#5a5a58', g2 = '#9a9a96';
  const b = [
    `<path d="M0 18 H40 V26 H0Z" fill="${g2}"/><path d="M8 18 V6 Q4 4 8 2 Q14 4 10 6 V18" fill="${g1}"/>`,
    `<path d="M0 26 L40 8 V26Z" fill="${g2}"/><circle cx="30" cy="7" r="3" fill="${g1}"/>`,
    `<path d="M0 12 H40" stroke="${g1}" stroke-width=".8"/><path d="M0 12 H40 V26 H0Z" fill="${g2}"/><path d="M18 26 L22 12 L26 26Z" fill="${g1}"/>`,
    `<rect x="4" y="4" width="14" height="22" fill="${g1}"/><path d="M18 20 H40 V26 H18Z" fill="${g2}"/><path d="M28 20 v-6" stroke="${g1}" stroke-width="1.6"/>`,
    `<circle cx="20" cy="14" r="8" fill="${g2}"/><path d="M0 22 Q20 16 40 22 V26 H0Z" fill="${g1}"/>`,
    `<path d="M0 26 V14 Q12 4 22 14 Q30 6 40 12 V26Z" fill="${g2}"/><path d="M28 26 V16" stroke="${g1}" stroke-width="2"/>`
  ];
  let s = '';
  b.forEach((inner, i) => { const x = 10 + (i % 3) * 48, y = 14 + Math.floor(i / 3) * 40; s += box(x + (r() - .5) * 2, y + (r() - .5) * 2, inner); });
  return sv(`${ha_paper('#efe9da', .3)}${s}
<ellipse cx="78" cy="67" rx="25" ry="17" stroke="#c0302a" stroke-width="1.1" fill="none" transform="rotate(-4 78 67)"/>
<path d="M104 58 q2 -3 5 -1" stroke="#c0302a" stroke-width="1" fill="none"/>
<g stroke="#2a2a2a" stroke-width=".5">${[0, 1, 2].map(i => `<path d="M${12 + i * 48} 44 h${f1(14 + r() * 14)}"/>`).join('')}</g>`);
}

pool.groups.push({
  id: 'painteffects', title: 'Painting effects', slot: 'Painting effect',
  intro: 'How the paint is handled: the way light is modelled, how layers are stacked, and how much of the process shows. Add one of these to any subject to change its finish without changing its era or style.',
  terms: [
    { id: 'chiaroscuro', name: 'Chiaroscuro', aka: 'light-dark modelling, clair-obscur', when: 'since the 1400s · Italy',
      desc: 'Strong light and shadow used to make forms look round and solid, with one clear light source falling across the subject. Italian for "light-dark", it gives a picture weight, warmth and drama.',
      spot: 'one directional light, smooth turn from highlight to deep shadow, cast shadows, warm dark backgrounds, forms that look sculpted',
      ref: 'Leonardo da Vinci, Rembrandt (The Night Watch), Caravaggio',
      prompt: 'chiaroscuro oil painting, single warm light from upper left, forms modelled from bright highlight into deep shadow, rich brown darks, strong cast shadows',
      ex: ha_chiaroscuro() },
    { id: 'tenebrism', name: 'Tenebrism', aka: 'dramatic illumination, Caravaggism', when: 'from about 1600 · Italy, Spain',
      desc: 'The extreme form of chiaroscuro: most of the picture drops into pure black, and a spotlight or candle picks out only faces and hands. It feels theatrical, secret and intense.',
      spot: 'large areas of flat black, a hard spotlight or single candle, faces and hands floating out of darkness, almost no background',
      ref: 'Caravaggio (Judith Beheading Holofernes), Georges de La Tour (Magdalene with the Smoking Flame), Zurbarán',
      prompt: 'tenebrist painting, figure emerging from pitch-black darkness, lit only by a single candle, hard falloff to black, glowing faces and hands, warm amber light',
      ex: ha_tenebrism() },
    { id: 'sfumato', name: 'Sfumato', aka: 'smoky modelling, soft blending', when: 'about 1490s · Florence',
      desc: 'Tones melt into one another like smoke, with no hard outlines anywhere, so faces seem to breathe and edges dissolve into haze. Leonardo used it to make expressions feel ambiguous and alive.',
      spot: 'no outlines, very soft edges, gentle shadows at the corners of eyes and mouth, hazy blue-green distance, quiet muted palette',
      ref: 'Leonardo da Vinci (Mona Lisa, Virgin of the Rocks), Correggio, Giorgione',
      prompt: 'sfumato oil portrait, smoky soft transitions with no hard edges or outlines, veiled shadows around eyes and mouth, hazy blue-green landscape behind, muted warm palette',
      ex: ha_sfumato() },
    { id: 'grisaille', name: 'Grisaille', aka: 'monochrome painting, en grisaille', when: 'since the 1300s · Northern Europe',
      desc: 'A painting made entirely in shades of grey, often to imitate carved stone statues in niches. Painters also used it as a first layer to work out light and shadow before adding color.',
      spot: 'only greys (sometimes brown or green-grey), figures that look like stone sculpture, painted niches and ledges, crisp sculptural light',
      ref: 'Jan van Eyck (Ghent Altarpiece exterior), Giotto (Virtues and Vices), Ingres (Odalisque in Grisaille)',
      prompt: 'grisaille painting, entirely in shades of grey, figures rendered like carved stone statues standing in painted niches, crisp sculptural lighting, no color',
      ex: ha_grisaille() },
    { id: 'glazing', name: 'Glazing', aka: 'glaze layers, transparent layering', when: 'since the 1400s · Flanders',
      desc: 'Thin, transparent layers of color are laid one over another on top of a monochrome underpainting, so light passes through and bounces back like stained glass. It gives jewel-like depth and glow that a single coat of paint cannot.',
      spot: 'deep luminous color, glowing reds and blues, smooth surface with no brushmarks, a sense of looking into the paint, enamel-like finish',
      ref: 'Jan van Eyck (Arnolfini Portrait), Titian, Vermeer',
      prompt: 'oil painting built with transparent glazes, luminous jewel-like color glowing from within, smooth enamel surface without visible brushstrokes, deep layered crimson and ultramarine',
      ex: ha_glazing() },
    { id: 'allaprima', name: 'Alla prima', aka: 'wet-into-wet, direct painting', when: 'popular since the 1800s',
      desc: 'Painting finished in one sitting, wet paint into wet paint, with each stroke put down confidently and left alone. The result is fresh, loose and lively, with the brushwork on show.',
      spot: 'visible confident single strokes, colors blended on the canvas while wet, loose edges, bright highlights flicked on top, sense of speed',
      ref: 'John Singer Sargent, Frans Hals, Joaquín Sorolla',
      prompt: 'alla prima oil painting, wet-into-wet, bold confident visible brushstrokes, loose fresh handling, crisp highlights flicked on top, painted in a single sitting',
      ex: ha_allaprima() },
    { id: 'scumbling', name: 'Scumbling', aka: 'scumble, broken veil',
      desc: 'A thin, broken layer of light opaque paint is dragged over a darker dry layer so the color below peeks through. It makes hazy veils of mist, smoke, dusty light and soft skies.',
      spot: 'pale hazy patches over darker paint, broken patchy texture where the underlayer shows through, misty atmosphere, soft glowing light',
      ref: 'J. M. W. Turner, Titian (late works), Rembrandt',
      prompt: 'oil painting with scumbled veils, thin broken layers of pale opaque paint dragged over dark underpainting, hazy misty light, glowing sunset haze, soft atmospheric texture',
      ex: ha_scumbling() },
    { id: 'drybrush', name: 'Dry brush', aka: 'dry-brush technique', when: 'refined 1900s · United States',
      desc: 'A brush with very little paint is dragged across textured paper so the color catches only on the peaks, leaving scratchy, broken strokes. It is perfect for dry grass, weathered wood and hair.',
      spot: 'scratchy broken strokes, paper showing through each mark, fine linear texture, muted earthy palette, weathered surfaces',
      ref: 'Andrew Wyeth, Winslow Homer, Albrecht Dürer (watercolors)',
      prompt: 'dry brush painting, scratchy broken strokes dragged over textured paper, fine detailed dry grass and weathered wood, muted ochre and grey palette, quiet rural mood',
      ex: ha_drybrush() },
    { id: 'paletteknife', name: 'Palette knife', aka: 'knife painting',
      desc: 'Paint is spread with a flat metal knife instead of a brush, leaving thick, flat slabs of color with sharp ridges at their edges. The surface looks chunky, sculptural and bold.',
      spot: 'flat angular slabs of thick paint, sharp ridged edges catching light, no brush hairs, bold unblended color, chunky mosaic-like surface',
      ref: 'Gustave Courbet, Nicolas de Staël, Leonid Afremov',
      prompt: 'palette knife painting, thick flat slabs of paint with sharp ridged edges, bold unblended color, chunky sculptural texture, angular planes catching the light',
      ex: ha_paletteknife() },
    { id: 'trompeloeil', name: "Trompe-l'oeil", aka: 'fool-the-eye, illusionism', when: 'since antiquity · peak 1600s',
      desc: 'French for "deceive the eye": painting so realistic, life-size and shallow that it seems to be a real object. Typical tricks are a fly on the frame, papers pinned to a wooden board or something poking out of the picture.',
      spot: 'life-size objects, very shallow space, flat wooden or wall backgrounds, crisp cast shadows, pinned or curling papers, a fly or crack on the frame',
      ref: 'Cornelis Gijsbrechts (letter racks), William Harnett, Samuel van Hoogstraten',
      prompt: "trompe-l'oeil painting, hyperreal life-size objects in very shallow space, papers pinned to a wooden board with curling corners, crisp cast shadows, a fly resting on the frame",
      ex: ha_trompeloeil() },
    { id: 'underdrawing', name: 'Visible underdrawing', aka: 'unfinished painting, non finito',
      desc: 'A painting left partly unfinished, so the pencil or charcoal sketch, grid lines and raw canvas edges are still showing beside the painted parts. It reveals the process and feels honest and immediate.',
      spot: 'pencil lines showing through or beside paint, a half-painted area, grid or construction lines, raw unprimed canvas at the edges',
      ref: 'Leonardo da Vinci (Adoration of the Magi), Gilbert Stuart (unfinished Washington portrait), Paul Cézanne',
      prompt: 'unfinished oil painting, half painted and half visible pencil underdrawing, construction lines and grid showing, raw canvas edges, process visible',
      ex: ha_underdrawing() },
    { id: 'tonalism', name: 'Tonalism', aka: 'nocturne, atmospheric glow', when: '1880–1915 · United States, Britain',
      desc: 'Landscapes painted in one narrow, muted color family, wrapped in haze at dusk, night or fog, so everything feels soft, quiet and dreamy. Whistler called his night pictures "nocturnes", like pieces of music.',
      spot: 'one dominant hue (blue-green, grey or brown), very low contrast, soft silhouettes, fog or twilight, a few tiny points of light',
      ref: 'James McNeill Whistler (Nocturne in Blue and Gold), George Inness, Edward Steichen (The Pond, Moonlight)',
      prompt: 'tonalist nocturne painting, muted unified blue-green haze, low contrast soft silhouettes at twilight, a few tiny glowing lights reflected in still water, quiet dreamy mood',
      ex: ha_tonalism() },
  ]
});

pool.groups.push({
  id: 'drawing', title: 'Drawing approaches', slot: 'Drawing approach',
  intro: 'Ways of drawing, from fast studies to careful renderings. Name the approach and the medium (chalk, pen, pencil) to get the right kind of line and finish.',
  terms: [
    { id: 'gesture', name: 'Gesture drawing', aka: 'gesture sketch, line of action',
      desc: 'Very fast drawings, often 30 seconds to two minutes, that catch the movement and energy of a pose rather than its details. A single sweeping "line of action" sets the curve of the whole body.',
      spot: 'quick sweeping curves, one long line through the body, simple oval heads, no detail or shading, several poses on one sheet',
      ref: 'Kimon Nicolaides (The Natural Way to Draw), Rembrandt (sketches), Glenn Vilppu',
      prompt: 'gesture drawing, fast flowing charcoal lines capturing movement, strong curved line of action through each figure, simple oval heads, no detail, several dynamic poses on cream paper',
      ex: ha_gesture() },
    { id: 'blindcontour', name: 'Blind contour', aka: 'blind contour drawing',
      desc: 'A drawing made with one slow line while looking only at the subject, never at the paper. The parts drift out of place, giving a wobbly, charming, oddly truthful result.',
      spot: 'one wandering wobbly line, features that do not quite meet, overshoots and doubled edges, no shading, naive charm',
      ref: 'Kimon Nicolaides, Betty Edwards (Drawing on the Right Side of the Brain)',
      prompt: 'blind contour drawing, single wobbly continuous ink line, features slightly misaligned and drifting, no shading, naive charming distortion on white paper',
      ex: ha_blindcontour() },
    { id: 'oneline', name: 'Continuous line', aka: 'one-line drawing, single-line art',
      desc: 'The whole picture is one unbroken line, pen never lifted, but unlike blind contour it is controlled and graceful. It is popular for minimal portraits, tattoos and logos.',
      spot: 'one smooth unbroken line, elegant loops connecting features, lots of empty space, no shading, often a single accent color shape',
      ref: 'Pablo Picasso (line drawings), Henri Matisse, Saul Steinberg',
      prompt: 'continuous line drawing, one smooth unbroken black line forming a minimal face profile, elegant looping strokes, lots of negative space, single soft color accent',
      ex: ha_oneline() },
    { id: 'linewash', name: 'Line and wash', aka: 'pen and wash, urban sketching',
      desc: 'A loose pen drawing with transparent watercolor washes laid in quickly, the color not quite matching the lines. It feels like an on-the-spot travel sketch.',
      spot: 'thin ink lines with overshooting corners, loose watercolor blobs that spill past the lines, lots of white paper, street scenes',
      ref: 'Ronald Searle, Quentin Blake, the Urban Sketchers movement',
      prompt: 'line and wash urban sketch, loose fine ink pen lines, transparent watercolor washes spilling past the outlines, white paper showing, lively street scene',
      ex: ha_linewash() },
    { id: 'sanguine', name: 'Sanguine', aka: 'red chalk drawing', when: 'since about 1500 · Italy',
      desc: 'Drawing in reddish-brown chalk on cream paper, the favorite medium for Renaissance figure and head studies. The warm color makes skin look alive with very little effort.',
      spot: 'rust red-brown lines only, cream or warm paper, diagonal parallel hatching for shadow, studies of heads, hands and figures',
      ref: 'Leonardo da Vinci (red chalk studies), Michelangelo (Libyan Sibyl studies), Andrea del Sarto',
      prompt: 'sanguine red chalk drawing on cream paper, Renaissance study of a head, warm rust-colored lines, diagonal parallel hatching for shadows, soft paper texture',
      ex: ha_sanguine() },
    { id: 'troiscrayons', name: 'Trois crayons', aka: 'three chalks', when: '1700s · France',
      desc: 'Black, red and white chalk together on toned paper: black for line and dark, red for warmth in cheeks and lips, and white for highlights. The mid-tone paper does the rest, so three sticks give a full, lifelike effect.',
      spot: 'toned tan or grey-blue paper, black chalk contours, touches of red on cheeks and lips, bright white highlights, paper showing as the mid-tone',
      ref: 'Antoine Watteau, Peter Paul Rubens, François Boucher',
      prompt: 'trois crayons drawing, black, red and white chalk on toned tan paper, delicate head study, red warming cheeks and lips, white chalk highlights, paper as mid-tone',
      ex: ha_troiscrayons() },
    { id: 'valuestudy', name: 'Value study', aka: 'tonal study, value thumbnail',
      desc: 'A quick painting or drawing that reduces a scene to three to five flat shades of grey, with no detail. It checks whether a composition reads from light and dark alone before color is added.',
      spot: 'only 3 to 5 flat grey tones, big simple shapes, no texture or detail, clear separation of foreground, middle and background',
      ref: 'Edgar Payne (Composition of Outdoor Painting), John Carlson, standard plein air practice',
      prompt: 'value study, landscape simplified into four flat grey tones, big simple shapes, no detail or texture, clear light, mid and dark separation',
      ex: ha_valuestudy() },
    { id: 'notan', name: 'Notan', aka: 'nōtan, two-value design', when: 'Japanese concept · taught in the West from the 1890s',
      desc: 'A Japanese design idea about the balance of dark and light: the picture is designed using just two flat values, so the shapes of the black and the white must both be beautiful. Arthur Wesley Dow taught it to American artists.',
      spot: 'pure black and white only, flat shapes with no shading, interlocking positive and negative space, strong silhouettes, balanced asymmetry',
      ref: 'Arthur Wesley Dow (Composition), Japanese sumi-e and woodblock design, Hokusai',
      prompt: 'notan design, two flat values only, pure black and cream shapes interlocking, pine branch and full moon silhouette, balanced asymmetric composition, no gradients',
      ex: ha_notan() },
    { id: 'academic', name: 'Academic figure drawing', aka: 'cast drawing, atelier drawing, sight-size', when: '1600s–1800s · European academies',
      desc: 'The slow, careful drawing taught in art academies: copying plaster casts and models under steady light, measuring with plumb lines, and rendering every tone smoothly. It looks calm, precise and highly finished.',
      spot: 'plaster casts or geometric solids, smooth graphite or charcoal tones, core shadow and reflected light, plumb lines and measuring marks, neutral grey palette',
      ref: 'Charles Bargue (Drawing Course), Jean-Léon Gérôme, John Singer Sargent (academy studies)',
      prompt: 'academic cast drawing, plaster sphere, cube and cone under one steady light, smooth graphite tonal rendering, core shadows and reflected light, faint plumb line and measuring marks',
      ex: ha_academic() },
    { id: 'ballpoint', name: 'Ballpoint pen', aka: 'biro drawing, sketchbook doodle',
      desc: 'Drawing in an ordinary blue ballpoint, building darks by layering fine hatching and scribbles. It ranges from loose notebook doodles to surprisingly detailed renderings.',
      spot: 'blue ink only, layered crosshatching and scribbled tone, notebook lines or margins, slight ink blobs, doodles in the margins',
      ref: 'Alighiero Boetti (ballpoint works), Il Lee, Juan Francisco Casas',
      prompt: 'blue ballpoint pen drawing on lined notebook paper, layered fine crosshatching building dark tones, scribbled shading, casual sketchbook doodle feel',
      ex: ha_ballpoint() },
    { id: 'thumbnails', name: 'Thumbnail sketches', aka: 'thumbnails, composition sketches',
      desc: 'Tiny, rough boxes drawn side by side to try out different compositions in seconds before committing to a final picture. Only the big shapes and placement matter.',
      spot: 'a grid of small boxed rectangles, rough blocky shapes in two or three greys, different layouts of the same idea, one circled or starred',
      ref: 'Alfred Hitchcock (storyboards), Norman Rockwell (planning sketches), standard concept-art practice',
      prompt: 'page of thumbnail sketches, grid of tiny rough boxed compositions in grey marker, blocky simple shapes, one favorite circled in red pencil, planning stage',
      ex: ha_thumbnails() },
  ]
});

/* ===== h_artists.js ===== */
/* ---------- Artists: painters, illustrators & designers (prefix ar_) ---------- */

// parallel hatching lines covering a box, at angle a (degrees); returns a path string
function ar_hatch(x, y, w, h, sp, a, col, sw, op = 1, clip = '') {
  const cx = x + w / 2, cy = y + h / 2, L = Math.hypot(w, h) / 2 + 2;
  const r = a * Math.PI / 180, dx = Math.cos(r), dy = Math.sin(r), nx = -dy, ny = dx;
  let d = '';
  for (let o = -L; o <= L; o += sp) {
    const px = cx + nx * o, py = cy + ny * o;
    d += `M${f1(px - dx * L)} ${f1(py - dy * L)}L${f1(px + dx * L)} ${f1(py + dy * L)}`;
  }
  return `<path d="${d}" stroke="${col}" stroke-width="${sw}" opacity="${op}" fill="none"${clip ? ` clip-path="url(#${clip})"` : ''}/>`;
}
// one short brush stroke
const ar_dab = (x, y, a, len, col, w, op = 1) => {
  const dx = Math.cos(a) * len / 2, dy = Math.sin(a) * len / 2;
  return `<path d="M${f1(x - dx)} ${f1(y - dy)}L${f1(x + dx)} ${f1(y + dy)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"${op < 1 ? ` opacity="${op}"` : ''}/>`;
};
const ar_lg = (id, x2, y2, stops) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(s => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ''}/>`).join('')}</linearGradient>`;
const ar_rg = (id, cx, cy, rr, stops) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${rr}">${stops.map(s => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ''}/>`).join('')}</radialGradient>`;

/* ---------------- painters ---------------- */

function ar_bosch() {
  const r = rng(11), sky = U('bs'), mead = U('bm'), [wd, wf] = wob(1.2, .09, 4);
  let s = `<defs>${ar_lg(sky, 0, 1, [[0, '#e6e9d6'], [1, '#b7cbbd']])}${ar_lg(mead, 0, 1, [[0, '#86a05e'], [1, '#5f7c40']])}${wd}</defs>`;
  s += `<rect width="160" height="100" fill="url(#${sky})"/>`;
  s += `<path d="M0 40 Q30 30 55 38 T110 34 T160 38 V56 H0Z" fill="#9db3ad"/><path d="M0 46 Q40 40 80 45 T160 44 V60 H0Z" fill="#8ea98a"/>`;
  s += `<rect y="52" width="160" height="48" fill="url(#${mead})"/>`;
  s += `<ellipse cx="86" cy="82" rx="46" ry="9" fill="#93acaa"/><ellipse cx="86" cy="80" rx="40" ry="5" fill="#b4c7c2" opacity=".6"/>`;
  s += `<g filter="url(#${wf})">`;
  // cracked egg-house on the pond
  s += `<path d="M70 82 C66 60 74 38 88 38 C102 38 110 60 106 82 Z" fill="#ecd3c3" stroke="#8a6250" stroke-width=".6"/>`;
  s += `<path d="M78 46 L84 52 L80 58 L88 62" stroke="#7a4d3c" stroke-width=".7" fill="none"/>`;
  s += `<path d="M84 82 v-12 a4 4 0 0 1 8 0 v12z" fill="#3b2a22"/><circle cx="96" cy="58" r="3" fill="#3b2a22"/>`;
  s += `<path d="M88 39 C86 30 92 24 90 18" stroke="#5a4630" stroke-width="1.4" fill="none"/><circle cx="85" cy="20" r="5" fill="#6f8c48"/><circle cx="93" cy="17" r="5.5" fill="#5f7d3e"/><circle cx="91" cy="23" r="2.4" fill="#c4372b"/>`;
  s += `<path d="M66 82 L74 56 M70 82 L78 56" stroke="#7a5a3a" stroke-width=".6"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${f1(67 + i * 1.3)} ${f1(79 - i * 4.4)}h4" stroke="#7a5a3a" stroke-width=".5"/>`).join('')}`;
  // giant strawberry
  s += `<path d="M24 74 C14 66 16 52 28 52 C40 52 42 66 32 76 C30 78 26 78 24 74Z" fill="#c23a2c"/><path d="M22 53 l6 -5 l6 5 l-6 -2z" fill="#4f7a34"/>`;
  for (let i = 0; i < 22; i++) s += `<circle cx="${f1(20 + r() * 16)}" cy="${f1(56 + r() * 18)}" r=".45" fill="#f2d36a"/>`;
  // fish with legs
  s += `<path d="M120 70 q10 -7 20 0 q-10 7 -20 0z" fill="#8e9aa0"/><path d="M140 70 l6 -4 v8z" fill="#7d878c"/><circle cx="124" cy="69" r=".8" fill="#222"/><path d="M127 73 l-2 6 M134 73 l2 6" stroke="#6b5a4a" stroke-width=".8"/>`;
  // bird-headed walker
  s += `<path d="M48 80 l2 -12 h5 l2 12z" fill="#6c4a36"/><circle cx="52.5" cy="65" r="3.2" fill="#3e5a6e"/><path d="M55 64 l8 2 l-8 1.5z" fill="#d8b04a"/><path d="M50 80 v4 M55 80 v4" stroke="#3a2a20" stroke-width=".8"/>`;
  s += `</g>`;
  // tiny pale figures
  const P = [[38, 88], [44, 92], [112, 90], [118, 86], [60, 94], [136, 92], [102, 96], [30, 93], [73, 66], [77, 60]];
  for (const [x, y] of P) s += fig(x, y, 6.5 + r() * 1.5, '#f2dccb');
  s += `<g fill="#3e3a32">${[[20, 22], [26, 18], [130, 14], [136, 19], [142, 15]].map(([x, y]) => `<path d="M${x} ${y} q2 -2 4 0 q2 -2 4 0" stroke="#3e3a32" stroke-width=".6" fill="none"/>`).join('')}</g>`;
  return sv(s + grainOv(.25));
}

function ar_bruegel() {
  const r = rng(22);
  let s = bg('#bfa476');
  s += `<rect width="160" height="16" fill="#d3d7cc"/><path d="M0 16 Q40 10 80 15 T160 13 V24 H0Z" fill="#97ab9e"/><path d="M0 22 Q50 18 100 22 T160 21 V30 H0Z" fill="#a9ae84"/>`;
  s += `<path d="M120 13 v-9 l2 -3 l2 3 v9z" fill="#8a8a80"/>`;
  s += `<path d="M0 30 H160 V100 H0Z" fill="#b99a66"/><path d="M0 60 L160 36 V48 L0 76Z" fill="#a68757" opacity=".55"/>`;
  // houses along a diagonal
  const H = [[96, 30, 16], [114, 33, 14], [132, 30, 18], [6, 44, 18], [26, 40, 14], [140, 52, 20], [8, 70, 22]];
  for (const [x, y, w] of H) {
    const h = w * .6, roof = pick(r, ['#7b3e28', '#5c4a3a', '#8e5a34']);
    s += `<rect x="${x}" y="${y}" width="${w}" height="${f1(h)}" fill="#e3d4b2" stroke="#5a4630" stroke-width=".4"/>`;
    s += `<path d="M${x - 2} ${y} L${f1(x + w / 2)} ${f1(y - w * .55)} L${x + w + 2} ${y}Z" fill="${roof}"/>`;
    s += `<rect x="${f1(x + w * .2)}" y="${f1(y + h * .35)}" width="${f1(w * .18)}" height="${f1(h * .65)}" fill="#4a3424"/>`;
  }
  // big tree
  s += `<path d="M44 100 L47 40 L49 40 L52 100Z" fill="#4b3826"/>`;
  s += `<path d="M48 60 L36 46 M48 52 L60 38 M48 46 L40 34 M48 42 L56 30 M48 68 L64 56" stroke="#4b3826" stroke-width="1.1"/>`;
  for (let i = 0; i < 70; i++) { const a = r() * 6.28, d = Math.sqrt(r()) * 15; s += `<circle cx="${f1(48 + Math.cos(a) * d * 1.1)}" cy="${f1(42 + Math.sin(a) * d * .8)}" r="${f1(1.4 + r())}" fill="${pick(r, ['#5c6a34', '#6f7a3a', '#4c5a2c'])}"/>`; }
  // peasants: dancing ring + crowd
  const pp = (x, y, h) => {
    const c = pick(r, ['#b2362a', '#efe6d2', '#2a2420', '#7a5a34', '#b2362a', '#3d4a6a']);
    return `<path d="M${f1(x - h * .28)} ${f1(y)} L${f1(x - h * .18)} ${f1(y - h * .72)} H${f1(x + h * .18)} L${f1(x + h * .28)} ${f1(y)}Z" fill="${c}"/><circle cx="${f1(x)}" cy="${f1(y - h * .86)}" r="${f1(h * .15)}" fill="${pick(r, ['#e2b894', '#efe6d2', '#d8a27a'])}"/>`;
  };
  for (let i = 0; i < 12; i++) { const a = i / 12 * 6.28; s += pp(96 + Math.cos(a) * 16, 72 + Math.sin(a) * 7, 7); }
  for (let i = 0; i < 46; i++) {
    const x = 6 + r() * 150, y = 46 + r() * 52;
    if (Math.abs(x - 96) < 20 && Math.abs(y - 72) < 10) continue;
    if (x > 40 && x < 56 && y < 84) continue;
    s += pp(x, y, 4 + (y - 40) * .1);
  }
  s += `<ellipse cx="96" cy="72" rx="4" ry="1.5" fill="#7a5a3a"/>`;
  return sv(s + grainOv(.25));
}

function ar_vermeer() {
  const wall = U('vw'), lt = U('vl'), bl = U('vb');
  let s = `<defs>${ar_lg(wall, 1, 0, [[0, '#ece2c6'], [.55, '#cfc3a2'], [1, '#8d8264']])}${ar_lg(lt, 1, .4, [[0, '#fff8de', .65], [1, '#fff8de', 0]])}<filter id="${bl}"><feGaussianBlur stdDeviation=".35"/></filter></defs>`;
  s += `<rect width="160" height="100" fill="url(#${wall})"/>`;
  // window, left
  s += `<rect x="0" y="6" width="26" height="60" fill="#c7d4cd"/>`;
  for (let i = 0; i <= 26; i += 6.5) s += `<path d="M${i} 6 V66" stroke="#6a6a5a" stroke-width=".5"/>`;
  for (let j = 6; j <= 66; j += 7.5) s += `<path d="M0 ${j} H26" stroke="#6a6a5a" stroke-width=".5"/>`;
  s += `<path d="M0 6 H28 V68 H0" fill="none" stroke="#5b4a34" stroke-width="2"/>`;
  // map on the wall
  s += `<rect x="78" y="10" width="54" height="34" fill="#c4a564"/><path d="M80 14 q10 6 20 0 t28 4 M84 24 q8 10 18 4 t22 6 M82 34 q14 -4 26 2 t20 -2" stroke="#7a6034" stroke-width=".6" fill="none"/><path d="M76 9 h58 M76 45 h58" stroke="#3c2c1c" stroke-width="1.6"/>`;
  // floor
  s += `<rect y="80" width="160" height="20" fill="#d9d2bc"/>`;
  for (let i = -8; i < 12; i++) for (let j = 0; j < 3; j++) if ((i + j) % 2 === 0) {
    const y0 = 80 + j * 6.7, y1 = y0 + 6.7, k0 = 1 + j * .25, k1 = k0 + .25, w = 14;
    s += `<path d="M${f1(80 + (i * w - 80) * k0 / 1.5)} ${y0} L${f1(80 + ((i + 1) * w - 80) * k0 / 1.5)} ${y0} L${f1(80 + ((i + 1) * w - 80) * k1 / 1.5)} ${f1(y1)} L${f1(80 + (i * w - 80) * k1 / 1.5)} ${f1(y1)}Z" fill="#2b2620"/>`;
  }
  s += `<rect x="28" y="66" width="2" height="14" fill="#8d8264"/><rect x="26" y="64" width="12" height="3" fill="#a59878"/>`;
  // figure by the window
  s += `<g filter="url(#${bl})">`;
  s += `<path d="M42 82 C40 70 44 60 48 56 L62 56 C66 62 70 72 70 82Z" fill="#2f4c8a"/><path d="M46 82 C46 74 50 66 54 60" stroke="#203868" stroke-width="1.2" fill="none"/>`;
  s += `<path d="M46 58 C46 46 50 38 55 38 C60 38 64 46 64 58Z" fill="#e2b84a"/><path d="M46 58 H64" stroke="#f5efe2" stroke-width="2.2"/>`;
  s += `<path d="M48 44 C42 46 38 50 36 54" stroke="#e2b84a" stroke-width="3.2" stroke-linecap="round" fill="none"/><circle cx="35.5" cy="54.5" r="1.6" fill="#ecd2b4"/>`;
  s += `<ellipse cx="54" cy="33" rx="4.4" ry="5.2" fill="#ecd2b4"/><path d="M53 27.6 C56 26 60 28 60 32 C60 36 58 38 57 39 C57 35 56 31 53 29Z" fill="#f4efe4"/><path d="M50.5 30 C52 27 56 27 57 28" stroke="#6a4a2a" stroke-width="1" fill="none"/><circle cx="51.5" cy="32.5" r=".6" fill="#3a2a1a"/><path d="M49.8 34 l-.8 1 l1 .4" stroke="#b08a6a" stroke-width=".5" fill="none"/>`;
  s += `<path d="M36 64 h6 l-1 -8 h-4z" fill="#3c5c9a"/><path d="M39 56 c-3 -4 -6 -4 -6 -8 M39 56 c1 -5 4 -6 6 -9 M39 56 c0 -5 -1 -7 -1 -10" stroke="#5a7a3a" stroke-width=".7" fill="none"/>${[[33, 48, '#c84a3a'], [45, 47, '#f2e6c8'], [38, 46, '#e8b84a']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="${c}"/>`).join('')}`;
  s += `</g>`;
  // table with rug and jug
  s += `<path d="M100 66 H160 V86 H96Z" fill="#7a2a24"/><path d="M98 72 H160 M97 79 H160" stroke="#2f4c8a" stroke-width="1.6"/><path d="M100 70 h60 M99 76 h61 M98 83 h62" stroke="#d8a84a" stroke-width=".5" stroke-dasharray="1.5 1.5"/>`;
  s += `<path d="M118 66 c-4 0 -5 -10 -2 -14 h8 c3 4 2 14 -2 14z" fill="#e8eef0"/><path d="M117 56 h10 M117 61 h10" stroke="#3a5a9a" stroke-width=".8"/><path d="M126 55 c4 0 4 6 0 7" stroke="#e8eef0" stroke-width="1.2" fill="none"/>`;
  s += `<path d="M0 0 L40 0 L120 100 L0 100Z" fill="url(#${lt})"/>`;
  for (const [x, y] of [[119, 55], [55, 39], [62, 56]]) s += `<circle cx="${x}" cy="${y}" r=".7" fill="#fff"/>`;
  return sv(s + grainOv(.22));
}

function ar_rembrandt() {
  const glow = U('rg'), face = U('rf'), r = rng(5);
  let s = `<defs>${ar_rg(glow, .5, .55, .6, [[0, '#7a4d22'], [.45, '#3a2410'], [1, '#120b06']])}${ar_rg(face, .35, .3, .8, [[0, '#f3cf94'], [.5, '#c88c52'], [1, '#5a3418']])}</defs>`;
  s += `<rect width="160" height="100" fill="url(#${glow})"/>`;
  // body / cloak
  s += `<path d="M64 100 C62 80 72 64 92 62 C112 62 126 78 128 100Z" fill="#2a1a0e"/><path d="M80 66 C84 74 90 78 98 76" stroke="#5a3a1c" stroke-width="1.4" fill="none"/>`;
  // head
  s += `<path d="M84 46 C82 32 90 24 98 24 C108 24 112 34 110 46 C109 56 104 62 97 62 C90 62 85 56 84 46Z" fill="url(#${face})"/>`;
  s += `<path d="M86 50 C88 64 96 72 100 72 C106 70 110 60 109 50 C104 58 92 58 86 50Z" fill="#cdbfa6"/><path d="M90 58 c3 6 8 10 14 4" stroke="#8a7a62" stroke-width=".6" fill="none"/>`;
  s += `<path d="M80 30 C80 18 98 12 114 20 C118 24 114 28 110 28 C100 24 90 26 84 32Z" fill="#1d120a"/>`;
  s += `<path d="M90 40 q3 -2 6 0 M101 40 q3 -2 6 0" stroke="#4a2a14" stroke-width=".9" fill="none"/><circle cx="93" cy="42" r=".8" fill="#2a160a"/><circle cx="104" cy="42" r=".8" fill="#2a160a"/><path d="M98 43 q-1 5 1 6" stroke="#8a5a30" stroke-width=".7" fill="none"/>`;
  // hands and open book
  s += `<path d="M66 84 L96 80 L126 84 L124 92 L96 88 L68 92Z" fill="#e9d29a"/><path d="M96 80 V88" stroke="#8a6a3a" stroke-width=".6"/>`;
  for (let i = 0; i < 6; i++) s += `<path d="M${70 + i * 4} ${f1(86 - i * .4)} h3 M${101 + i * 4} ${f1(83.6 + i * .4)} h3" stroke="#a88a5a" stroke-width=".4"/>`;
  s += `<ellipse cx="66" cy="90" rx="4" ry="3" fill="#c88c52"/><ellipse cx="126" cy="90" rx="4" ry="3" fill="#a46c3a"/>`;
  // candle
  s += `<rect x="36" y="64" width="6" height="22" fill="#d8c49a"/><rect x="34" y="86" width="10" height="3" fill="#5a3a1c"/><path d="M39 64 c-3 -4 -1 -9 0 -12 c1 3 3 8 0 12z" fill="#ffe7a0"/><circle cx="39" cy="58" r="10" fill="#ffd27a" opacity=".18"/>`;
  // impasto highlights
  for (let i = 0; i < 26; i++) s += ar_dab(87 + r() * 9, 30 + r() * 8, -.4 + r() * .3, 1.4 + r() * 1.5, pick(r, ['#ffe2a8', '#f6c983']), .9, .35);
  for (let i = 0; i < 14; i++) s += ar_dab(70 + r() * 50, 82 + r() * 8, r() * .3, 2 + r() * 3, '#fff2c4', .8, .5);
  return sv(s + grainOv(.3));
}

function ar_turner() {
  const sk = U('ts'), sun = U('tu'), bl = U('tb'), r = rng(9);
  let s = `<defs>${ar_lg(sk, 0, 1, [[0, '#cdbf9a'], [.5, '#e9cf8a'], [.72, '#d7b26a'], [1, '#8a8a7a']])}${ar_rg(sun, .38, .45, .5, [[0, '#fffbe6'], [.25, '#fbe6a4', .95], [1, '#e8c070', 0]])}<filter id="${bl}"><feGaussianBlur stdDeviation="1.6"/></filter></defs>`;
  s += `<rect width="160" height="100" fill="url(#${sk})"/>`;
  s += `<g filter="url(#${bl})">`;
  for (let i = 0; i < 70; i++) {
    const rad = 10 + r() * 70, a0 = r() * 6.28, a1 = a0 + .6 + r() * 1.2;
    const cx = 60, cy = 46;
    s += `<path d="M${f1(cx + Math.cos(a0) * rad)} ${f1(cy + Math.sin(a0) * rad * .7)} A${f1(rad)} ${f1(rad * .7)} 0 0 1 ${f1(cx + Math.cos(a1) * rad)} ${f1(cy + Math.sin(a1) * rad * .7)}" stroke="${pick(r, ['#f7e7b6', '#c9965a', '#8f8f86', '#e6b866', '#6f7280', '#fff3cf'])}" stroke-width="${f1(1.5 + r() * 4)}" fill="none" opacity="${f1(.35 + r() * .4)}"/>`;
  }
  s += `<rect y="66" width="160" height="34" fill="#9a8a62" opacity=".55"/>`;
  s += `<path d="M0 72 Q40 66 80 72 T160 70 V100 H0Z" fill="#6f6a5a" opacity=".5"/>`;
  s += `</g>`;
  s += `<rect width="160" height="100" fill="url(#${sun})"/>`;
  // reflection on water
  for (let i = 0; i < 26; i++) s += ar_dab(60 + (r() - .5) * 30 * (1 + i / 20), 70 + i * 1.1, 0, 4 + r() * 10, '#fff4cc', 1, .6);
  // dark boat dissolving
  s += `<g opacity=".85"><path d="M110 74 h22 l-3 4 h-17z" fill="#2a2620"/><path d="M120 74 V54" stroke="#2a2620" stroke-width="1"/><path d="M118 74 v-8 h3 v8" fill="#2a2620"/><path d="M119 66 c-2 -6 -8 -10 -14 -16" stroke="#3a3530" stroke-width="3" opacity=".45" fill="none"/></g>`;
  for (let i = 0; i < 18; i++) s += ar_dab(20 + r() * 130, 76 + r() * 22, (r() - .5) * .4, 6 + r() * 12, pick(r, ['#5a5040', '#e8d6a0', '#3e4048']), 1.3, .5);
  return sv(s + grainOv(.25));
}

function ar_vangogh() {
  const r = rng(31), D = {};
  const ad = (x, y, an, len, col) => { const dx = Math.cos(an) * len / 2, dy = Math.sin(an) * len / 2; D[col] = (D[col] || '') + `M${f1(x - dx)} ${f1(y - dy)}l${f1(dx * 2)} ${f1(dy * 2)}`; return ''; };
  const flush = () => { let o = ''; for (const c in D) o += `<path d="${D[c]}" stroke="${c}" stroke-width="1.6" stroke-linecap="round" fill="none"/>`; for (const c in D) delete D[c]; return o; };
  let s = bg('#2c5aa0');
  // sky strokes following two swirls
  const sw = (x, y) => {
    let a = 0;
    for (const [cx, cy, k] of [[52, 22, 1], [120, 24, .8]]) { const dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy); a += Math.atan2(dy, dx) * 0 + 0; if (d < 26) return Math.atan2(dy, dx) + Math.PI / 2; }
    return Math.sin(x * .05) * .3;
  };
  for (let i = 0; i < 260; i++) {
    const x = r() * 160, y = r() * 52;
    s += ad(x, y, sw(x, y), 4 + r() * 3, pick(r, ['#3f74c4', '#1f437e', '#7fa8de', '#2c5aa0', '#b8d0ea']));
  }
  // sun with rings
  s += flush();
  s += `<circle cx="120" cy="24" r="9" fill="#f5c93a"/>`;
  for (let ring = 0; ring < 3; ring++) for (let i = 0; i < 22 + ring * 8; i++) {
    const a = i / (22 + ring * 8) * 6.28 + ring, rad = 11 + ring * 4;
    s += ad(120 + Math.cos(a) * rad, 24 + Math.sin(a) * rad, a + Math.PI / 2, 3.2, ring === 2 ? '#e8a43a' : '#f7dc5a');
  }
  for (let i = 0; i < 20; i++) { const a = r() * 6.28, d = r() * 7; s += ad(120 + Math.cos(a) * d, 24 + Math.sin(a) * d, a, 2.5, '#fff0a0'); }
  s += flush();
  // hills
  s += `<path d="M0 52 Q30 40 70 50 T160 46 V100 H0Z" fill="#3e6e4a"/>`;
  for (let i = 0; i < 120; i++) { const x = r() * 160, y = 50 + r() * 12; s += ad(x, y, -.2 + r() * .4, 4, pick(r, ['#2f5a3a', '#5a8a4a', '#2c4a7a'])); }
  s += flush();
  // fields
  s += `<path d="M0 62 Q50 56 100 62 T160 60 V100 H0Z" fill="#d9a72a"/>`;
  for (let i = 0; i < 200; i++) {
    const x = r() * 160, y = 62 + r() * 38;
    s += ad(x, y, -1.3 + r() * .5, 3.5 + r() * 2, pick(r, ['#f0c43a', '#c98a1a', '#e6b02a', '#8aa63a', '#f6de6a']));
  }
  s += flush();
  // winding road
  s += `<path d="M58 100 C60 86 86 82 92 72 C96 66 104 64 108 62" stroke="#e8c48a" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  for (let i = 0; i < 26; i++) { const t = i / 26, x = 58 + t * 50 + Math.sin(t * 6) * 3, y = 100 - t * 38; s += ad(x + (r() - .5) * 4, y, -.6, 3, pick(r, ['#c99a5a', '#f2dcaa'])); }
  s += flush();
  // house
  s += `<path d="M104 62 v-8 h12 v8z" fill="#f2ead2" stroke="#2c4a7a" stroke-width=".8"/><path d="M102 54 l8 -6 l8 6z" fill="#c8402a" stroke="#2c4a7a" stroke-width=".8"/><rect x="108" y="57" width="3" height="5" fill="#2c5aa0"/>`;
  // olive tree, twisting
  s += `<path d="M24 92 C20 80 30 74 24 64 M24 76 C30 70 36 70 38 62 M23 70 C16 66 12 60 14 54" stroke="#3a2a1a" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  for (let i = 0; i < 70; i++) { const a = r() * 6.28, d = Math.sqrt(r()) * 14; const x = 26 + Math.cos(a) * d * 1.3, y = 56 + Math.sin(a) * d * .7; s += ad(x, y, a + 1.5, 3, pick(r, ['#6a8a5a', '#9ab07a', '#3a5a3a', '#b8c890'])); }
  s += flush();
  return sv(s);
}

function ar_klimt() {
  const r = rng(41), gold = U('kg'), sh = U('ks');
  let s = `<defs>${ar_lg(gold, 1, 1, [[0, '#f2d36a'], [.5, '#c99a2e'], [1, '#e8c25a']])}${ar_lg(sh, 0, 1, [[0, '#d8a83a'], [1, '#a87a1e']])}</defs>`;
  s += bg('#4f5a2e');
  for (let i = 0; i < 90; i++) s += `<rect x="${f1(r() * 160)}" y="${f1(r() * 100)}" width="${f1(.8 + r() * 1.6)}" height="${f1(.8 + r() * 1.6)}" fill="${pick(r, ['#d8b048', '#a8882e', '#e8c860'])}" opacity=".8"/>`;
  // flower meadow at the bottom
  s += `<path d="M0 84 Q80 78 160 84 V100 H0Z" fill="#3d4a26"/>`;
  for (let i = 0; i < 70; i++) { const x = r() * 160, y = 84 + r() * 16; s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(1 + r() * 1.2)}" fill="${pick(r, ['#e8607a', '#f2e6c8', '#7a8ad8', '#f2c84a', '#d84a3a'])}"/>`; }
  // robe: tall rounded gold column
  s += `<path d="M58 100 C52 70 56 40 72 30 L92 30 C108 40 112 70 106 100Z" fill="url(#${gold})"/>`;
  // patterns inside robe
  for (let i = 0; i < 64; i++) {
    const x = 60 + r() * 44, y = 40 + r() * 56, k = r();
    if (k < .4) s += `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(3 + r() * 3)}" height="${f1(4 + r() * 4)}" fill="${pick(r, ['#1d1a14', '#f4ecd8', '#6a5aa8'])}"/>`;
    else if (k < .7) s += `<path d="M${f1(x)} ${f1(y)} m-2.5 0 a2.5 2.5 0 1 1 2.5 2.5 a1.5 1.5 0 1 1 -1.5 -1.5" stroke="#5a3a10" stroke-width=".6" fill="none"/>`;
    else s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="2.6" ry="1.6" fill="#f4ecd8" stroke="#1d1a14" stroke-width=".4"/><circle cx="${f1(x)}" cy="${f1(y)}" r=".8" fill="#1d1a14"/>`;
  }
  s += `<path d="M58 100 C52 70 56 40 72 30 L92 30 C108 40 112 70 106 100Z" fill="none" stroke="#7a5a18" stroke-width=".6"/>`;
  // head tilted
  s += `<g transform="rotate(-14 82 22)"><path d="M70 22 C68 8 96 6 96 22 C96 26 92 30 88 30 C80 30 74 28 70 22Z" fill="#1c140e"/><ellipse cx="83" cy="24" rx="7" ry="8.5" fill="#f2dcc6"/><path d="M78 23 q2 1.4 4 0 M85 23 q2 1.4 4 0" stroke="#4a2a1a" stroke-width=".6" fill="none"/><path d="M81.5 29 q1.5 .9 3 0" stroke="#c23a3a" stroke-width="1" fill="none"/>${[[72, 14, '#e8607a'], [78, 10, '#f2e6c8'], [86, 9, '#e8607a'], [93, 13, '#7a8ad8']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="2" fill="${c}"/>`).join('')}</g>`;
  // hands
  // gold spiral columns either side
  for (const cx of [24, 136]) for (let j = 0; j < 4; j++) {
    const cy = 14 + j * 19;
    s += `<path d="M${cx} ${cy} m-6 0 a6 6 0 1 1 6 6 a4 4 0 1 1 -4 -4 a2 2 0 1 1 2 2" stroke="url(#${sh})" stroke-width="1.6" fill="none"/>`;
  }
  return sv(s + grainOv(.2));
}

function ar_mleaf(cx, cy, sc, rot, col) {
  let d = `<g transform="translate(${cx} ${cy}) rotate(${rot}) scale(${sc})" fill="${col}"><path d="M-1 12 Q0 0 0 -14 Q1 0 1 12Z"/>`;
  for (let i = 0; i < 4; i++) {
    const y = 8 - i * 6, w = 7 - i * 1.2;
    d += `<path d="M0 ${y} Q${-w} ${y - 2} ${-w - 1} ${y - 6} Q${-w / 2} ${y - 5} 0 ${y - 2}Z"/><path d="M0 ${y - 2} Q${w} ${y - 4} ${w + 1} ${y - 8} Q${w / 2} ${y - 7} 0 ${y - 4}Z"/>`;
  }
  return d + `<ellipse cx="0" cy="-15" rx="2.2" ry="3"/></g>`;
}
function ar_matisse() {
  const [wd, wf] = wob(1.6, .11, 7);
  let s = `<defs>${wd}</defs>` + bg('#f4efe2');
  const C = [['#2342a8', '#f4efe2'], ['#e0427a', '#f6c33a'], ['#f08a2a', '#2342a8'], ['#1f8a5a', '#f4efe2'], ['#f6c33a', '#e0427a'], ['#141414', '#f08a2a']];
  s += `<g filter="url(#${wf})">`;
  const cells = [[4, 4, 48, 44], [56, 4, 48, 44], [108, 4, 48, 44], [4, 52, 48, 44], [56, 52, 48, 44], [108, 52, 48, 44]];
  cells.forEach(([x, y, w, h], i) => {
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${C[i][0]}"/>`;
    const cx = x + w / 2, cy = y + h / 2, c = C[i][1];
    if (i === 0 || i === 3) s += ar_mleaf(cx, cy + 2, 1.35, i === 0 ? -8 : 10, c);
    else if (i === 1) { let d = ''; for (let k = 0; k < 10; k++) { const a = k / 10 * 6.28 - 1.57, rr = k % 2 ? 7 : 17; d += (k ? 'L' : 'M') + f1(cx + Math.cos(a) * rr) + ' ' + f1(cy + Math.sin(a) * rr); } s += `<path d="${d}Z" fill="${c}"/>`; }
    else if (i === 2) s += `<path d="M${x + 6} ${cy} q6 -14 12 0 t12 0 t12 0" stroke="${c}" stroke-width="5" fill="none"/><circle cx="${x + 12}" cy="${y + 10}" r="4" fill="#f4efe2"/>`;
    else if (i === 4) s += `<path d="M${cx} ${y + 6} C${cx + 14} ${y + 14} ${cx + 4} ${y + 24} ${cx + 16} ${y + 36} C${cx} ${y + 34} ${cx - 2} ${y + 26} ${cx - 14} ${y + 30} C${cx - 8} ${y + 20} ${cx - 16} ${y + 14} ${cx} ${y + 6}Z" fill="${c}"/>`;
    else { for (let k = 0; k < 3; k++) s += `<circle cx="${x + 12 + k * 12}" cy="${f1(cy + (k - 1) * 8)}" r="${5 - k}" fill="${c}"/>`; s += `<path d="M${x + 8} ${y + 38} q10 -6 20 0 t16 -2" stroke="#f4efe2" stroke-width="3" fill="none"/>`; }
  });
  s += `</g>`;
  return sv(s);
}

function ar_afklint() {
  let s = `<rect width="80" height="100" fill="#f0b48a"/><rect x="80" width="80" height="100" fill="#b9a8d4"/>`;
  // central split disc
  s += `<path d="M80 12 A38 38 0 0 0 80 88Z" fill="#f4d34a"/><path d="M80 12 A38 38 0 0 1 80 88Z" fill="#3e64b0"/>`;
  // petal rosette
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * 360;
    s += `<ellipse cx="80" cy="36" rx="5" ry="13" fill="${i % 2 ? '#f7f0e4' : '#e88aa8'}" transform="rotate(${a} 80 50)" opacity=".92"/>`;
  }
  s += `<circle cx="80" cy="50" r="9" fill="#f7f0e4"/><circle cx="80" cy="50" r="5" fill="#e0505a"/><circle cx="80" cy="50" r="2" fill="#f4d34a"/>`;
  // snail spirals
  const spiral = (cx, cy, k, dir, col) => { let d = ''; for (let t = 0; t < 22; t += .4) { const rr = t * k, a = t * dir; d += (t ? 'L' : 'M') + f1(cx + Math.cos(a) * rr) + ' ' + f1(cy + Math.sin(a) * rr); } return `<path d="${d}" stroke="${col}" stroke-width=".9" fill="none"/>`; };
  s += spiral(20, 22, .55, 1, '#6a3a5a') + spiral(140, 22, .55, -1, '#6a3a5a');
  // corner rosettes and dots
  for (const [x, y, c1, c2] of [[18, 80, '#e88aa8', '#f4d34a'], [142, 80, '#f4d34a', '#e88aa8']]) {
    for (let i = 0; i < 8; i++) s += `<ellipse cx="${x}" cy="${y - 6}" rx="2.2" ry="5" fill="${c1}" transform="rotate(${i * 45} ${x} ${y})"/>`;
    s += `<circle cx="${x}" cy="${y}" r="3" fill="${c2}"/>`;
  }
  // thin calligraphic curls
  s += `<path d="M38 92 c6 -8 14 -8 16 0 c2 6 8 4 10 -2 M96 92 c6 -8 14 -8 16 0 c2 6 8 4 10 -2" stroke="#4a3a6a" stroke-width=".7" fill="none"/>`;
  s += `<path d="M80 0 V12 M80 88 V100" stroke="#6a3a5a" stroke-width=".8"/>`;
  return sv(s + grainOv(.22));
}

function ar_kandinsky() {
  const hz = U('kh'), halo = U('ka');
  let s = `<defs>${ar_rg(hz, .3, .3, .9, [[0, '#f6efdc'], [1, '#d9cfb4']])}${ar_rg(halo, .5, .5, .5, [[.55, '#2a3a8a'], [.75, '#6a8ad8', .6], [1, '#9ab0e8', 0]])}</defs>`;
  s += `<rect width="160" height="100" fill="url(#${hz})"/>`;
  s += `<circle cx="40" cy="34" r="30" fill="url(#${halo})"/><circle cx="40" cy="34" r="14" fill="#141414"/><circle cx="44" cy="30" r="5" fill="#e0402a"/>`;
  s += `<path d="M96 88 L132 22 L150 88Z" fill="#f2c63a" opacity=".9"/>`;
  // checkerboard patch
  for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) s += `<rect x="${12 + i * 5}" y="${70 + j * 5}" width="5" height="5" fill="${(i + j) % 2 ? '#141414' : '#f6efdc'}"/>`;
  // concentric circles
  for (const [x, y, cs] of [[112, 64, ['#3a7a5a', '#f2c63a', '#e0402a', '#141414']], [76, 20, ['#e88aa8', '#2a3a8a', '#f6efdc']]]) cs.forEach((c, k) => { s += `<circle cx="${x}" cy="${y}" r="${(cs.length - k) * 3.2}" fill="${c}"/>`; });
  s += `<path d="M58 78 A18 18 0 0 1 94 78Z" fill="#e0402a"/>`;
  // black lines and arcs
  s += `<path d="M10 92 L150 8 M20 6 L120 96 M60 50 H156 M84 6 V96" stroke="#141414" stroke-width=".9"/>`;
  s += `<path d="M14 54 Q60 26 100 46" stroke="#141414" stroke-width="2.2" fill="none"/><path d="M124 40 q10 -14 22 -4" stroke="#2a3a8a" stroke-width="1.2" fill="none"/>`;
  for (let i = 0; i < 5; i++) s += `<path d="M${130 + i * 4} 76 v14" stroke="#141414" stroke-width=".7"/>`;
  s += `<circle cx="146" cy="16" r="3.5" fill="#141414"/><circle cx="64" cy="64" r="2.4" fill="#2a3a8a"/>`;
  return sv(s + grainOv(.2));
}

function ar_hopper() {
  let s = bg('#cfc6a4');
  // left side wall in perspective, back wall, floor
  s += `<path d="M0 0 L34 8 V74 L0 92Z" fill="#5f806c"/><rect x="34" y="8" width="126" height="66" fill="#d2c7a2"/><path d="M34 0 H160 V8 H34Z" fill="#bfb38e"/><path d="M0 0 L34 8" stroke="#4a6656" stroke-width=".6"/>`;
  s += `<path d="M0 92 L34 74 H160 V100 H0Z" fill="#7d5236"/>`;
  // window on the back wall, right
  s += `<rect x="106" y="14" width="44" height="44" fill="#7aa6c8"/><path d="M106 34 H150 V58 H106Z" fill="#a8523a"/>${[0, 1, 2, 3].map(i => `<rect x="${110 + i * 10}" y="40" width="5" height="8" fill="#3a2a22"/>`).join('')}<path d="M106 34 H150" stroke="#6a3a28" stroke-width="1.6"/>`;
  s += `<rect x="106" y="14" width="44" height="44" fill="none" stroke="#f0ead2" stroke-width="2"/><path d="M128 14 V58" stroke="#f0ead2" stroke-width="1.6"/><path d="M104 59 H152" stroke="#efe6cc" stroke-width="2.4"/>`;
  // sunlight: one sharp slab on side wall, one on floor and bed
  s += `<path d="M6 26 L24 22 L24 58 L6 66Z" fill="#f4e0a2"/><path d="M14 24 V62" stroke="#5f806c" stroke-width="1.6"/>`;
  s += `<path d="M28 100 L60 76 H104 L88 100Z" fill="#e3a868"/>`;
  // bed
  s += `<path d="M40 64 H112 V80 H40Z" fill="#efeadc"/><path d="M58 64 H96 L92 80 H52Z" fill="#fbf4dc"/><path d="M40 80 H112 V85 H40Z" fill="#5a3a26"/><rect x="38" y="50" width="4" height="36" fill="#5a3a26"/><path d="M42 66 H112" stroke="#c8c2b0" stroke-width=".6"/>`;
  // seated woman facing the window
  s += `<path d="M80 66 C78 56 80 46 85 42 C91 42 94 54 93 66Z" fill="#e8958a"/><path d="M82 66 L100 70 L102 84 L98 84 L96 74 L82 72Z" fill="#e8958a"/><path d="M97 84 L104 84" stroke="#e2b898" stroke-width="2"/>`;
  s += `<circle cx="88" cy="36" r="5" fill="#e8c09a"/><path d="M83 36 C82 29 92 28 93 33 C90 32 86 33 83 36Z" fill="#7a3a1e"/><path d="M84 32 C82 36 82 40 84 42" stroke="#7a3a1e" stroke-width="2" fill="none"/><path d="M91 48 L99 56 L100 64" stroke="#e8c09a" stroke-width="2.2" stroke-linecap="round" fill="none"/>`;
  // her hard shadow on back wall
  s += `<path d="M70 64 C68 52 70 44 74 40 C78 40 80 52 80 64Z" fill="#a89c78" opacity=".55"/>`;
  return sv(s + grainOv(.2));
}

function ar_magritte() {
  const sk = U('ms'), ap = U('ma'), r = rng(51);
  let s = `<defs>${ar_lg(sk, 0, 1, [[0, '#5f8fcc'], [1, '#cfe0ef']])}${ar_rg(ap, .35, .35, .75, [[0, '#c4e27a'], [.6, '#7fb23a'], [1, '#4a7a22']])}</defs>`;
  s += `<rect width="160" height="100" fill="url(#${sk})"/>`;
  const cloud = (x, y, k) => `<g fill="#fbfcfd">${[[0, 0, 6], [7, -3, 7], [15, 0, 6], [7, 2, 6], [-5, 2, 4], [20, 2, 4]].map(([dx, dy, rr]) => `<circle cx="${f1(x + dx * k)}" cy="${f1(y + dy * k)}" r="${f1(rr * k)}"/>`).join('')}</g>`;
  s += cloud(16, 18, .9) + cloud(118, 12, 1.1) + cloud(70, 30, .6) + cloud(140, 40, .5);
  s += `<rect y="66" width="160" height="10" fill="#3c5f86"/><rect y="76" width="160" height="24" fill="#d9c8a0"/><path d="M0 76 H160" stroke="#f2ead2" stroke-width=".8"/>`;
  // giant apple with a door
  s += `<ellipse cx="78" cy="90" rx="26" ry="4" fill="#9a8a68" opacity=".7"/>`;
  s += `<path d="M78 34 C66 26 50 32 52 54 C54 76 68 90 78 86 C88 90 102 76 104 54 C106 32 90 26 78 34Z" fill="url(#${ap})"/>`;
  s += `<path d="M78 34 C79 28 80 24 83 20" stroke="#4a3220" stroke-width="2" fill="none"/><path d="M82 26 C88 18 98 20 100 24 C94 28 88 28 82 26Z" fill="#3e7a2a"/>`;
  s += `<path d="M71 87 V72 a5 5 0 0 1 10 0 V87Z" fill="#7a4a2a"/><circle cx="79" cy="80" r=".8" fill="#e8c86a"/><rect x="88" y="54" width="7" height="8" fill="#f8e7a0"/><path d="M91.5 54 v8 M88 58 h7" stroke="#7a4a2a" stroke-width=".6"/>`;
  // small man in bowler hat seen from behind
  s += `<path d="M124 92 L125 74 C125 70 133 70 133 74 L134 92Z" fill="#1e1e24"/><circle cx="129" cy="68" r="3" fill="#1e1e24"/><path d="M125 66.6 h8" stroke="#1e1e24" stroke-width="1.2"/><path d="M126.4 66.5 a2.6 2.8 0 0 1 5.2 0Z" fill="#1e1e24"/>`;
  s += `<ellipse cx="136" cy="92" rx="7" ry="1.2" fill="#9a8a68" opacity=".6"/>`;
  return sv(s);
}

function ar_okeeffe() {
  const bgG = U('ob'), bl = U('ol');
  let defs = `${ar_lg(bgG, 1, 1, [[0, '#a8c4d8'], [1, '#e8d4dc']])}<filter id="${bl}"><feGaussianBlur stdDeviation=".5"/></filter>`;
  const cx = 92, cy = 62;
  const petals = [[-150, 70, '#f6e8ec'], [-100, 64, '#f2d0dc'], [-40, 70, '#f6e2e8'], [10, 60, '#eebccc'], [70, 66, '#f4dde4'], [130, 62, '#efc4d2'], [-70, 46, '#e898b2'], [40, 44, '#e48aa8'], [170, 46, '#e898b2']];
  let s = '';
  petals.forEach(([a, len, col], i) => {
    const g = U('op');
    defs += `<linearGradient id="${g}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7a1e4a"/><stop offset=".35" stop-color="#d0607e"/><stop offset=".75" stop-color="${col}"/><stop offset="1" stop-color="#fff8fa"/></linearGradient>`;
    const w = len * .55;
    s += `<path d="M0 0 C${f1(len * .3)} ${f1(-w)} ${f1(len * .9)} ${f1(-w * .9)} ${len} 0 C${f1(len * .9)} ${f1(w * .9)} ${f1(len * .3)} ${f1(w)} 0 0Z" fill="url(#${g})" transform="translate(${cx} ${cy}) rotate(${a})"/>`;
  });
  s = `<defs>${defs}</defs><rect width="160" height="100" fill="url(#${bgG})"/><g filter="url(#${bl})">${s}`;
  s += `<circle cx="${cx}" cy="${cy}" r="8" fill="#4a0e2e"/><circle cx="${cx}" cy="${cy}" r="4" fill="#2a0a1a"/>`;
  for (let i = 0; i < 9; i++) { const a = i / 9 * 6.28; s += `<path d="M${cx} ${cy} L${f1(cx + Math.cos(a) * 9)} ${f1(cy + Math.sin(a) * 9 - 3)}" stroke="#e8c84a" stroke-width=".7"/><circle cx="${f1(cx + Math.cos(a) * 9)}" cy="${f1(cy + Math.sin(a) * 9 - 3)}" r="1" fill="#f2d65a"/>`; }
  s += `</g>`;
  return sv(s);
}

function ar_kahlo() {
  const r = rng(61);
  let s = bg('#2e4a2a');
  // big leaves behind
  for (let i = 0; i < 18; i++) {
    const x = r() * 160, y = r() * 100, a = r() * 360, l = 14 + r() * 12;
    s += `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(a)})"><path d="M0 0 C${f1(l * .4)} ${f1(-l * .35)} ${f1(l * .8)} ${f1(-l * .25)} ${f1(l)} 0 C${f1(l * .8)} ${f1(l * .25)} ${f1(l * .4)} ${f1(l * .35)} 0 0Z" fill="${pick(r, ['#3f6e34', '#56883e', '#2f5a2a', '#6e9a48'])}"/><path d="M0 0 H${f1(l)}" stroke="#244a22" stroke-width=".5"/></g>`;
  }
  // shoulders / blouse
  s += `<path d="M44 100 C46 82 60 74 80 74 C100 74 114 82 116 100Z" fill="#b8302a"/>`;
  for (let i = 0; i < 9; i++) s += `<circle cx="${58 + i * 5.5}" cy="${f1(84 + Math.abs(i - 4) * 1.2)}" r="1.4" fill="#f2c84a"/><path d="M${57 + i * 5.5} ${f1(88 + Math.abs(i - 4) * 1.2)} l1 2 l1 -2" stroke="#f2e6c8" stroke-width=".5" fill="none"/>`;
  s += `<path d="M74 66 h12 v10 c-4 3 -8 3 -12 0z" fill="#b88660"/>`;
  // face
  s += `<path d="M66 42 C66 30 72 24 80 24 C88 24 94 30 94 42 C94 56 88 66 80 66 C72 66 66 56 66 42Z" fill="#c99a6e"/>`;
  s += `<path d="M64 42 C62 22 74 16 80 16 C90 16 98 22 96 42 C94 32 90 28 80 28 C72 28 66 32 64 42Z" fill="#1a120e"/>`;
  s += `<path d="M71 40 Q75 37 80 39.5 Q85 37 89 40" stroke="#1a120e" stroke-width="1.4" fill="none"/>`;
  s += `<ellipse cx="75" cy="43" rx="2.2" ry="1.3" fill="#f2e6d8"/><ellipse cx="85" cy="43" rx="2.2" ry="1.3" fill="#f2e6d8"/><circle cx="75" cy="43" r="1" fill="#2a160a"/><circle cx="85" cy="43" r="1" fill="#2a160a"/>`;
  s += `<path d="M80 45 q-1.6 5 .6 6" stroke="#8a5a3a" stroke-width=".7" fill="none"/><path d="M76 56 q4 2 8 0 q-4 -1.6 -8 0z" fill="#a8302a"/>`;
  // flower crown
  for (const [x, y, rr, c] of [[66, 22, 4.5, '#d8304a'], [74, 16, 4, '#f2c84a'], [82, 14, 4.8, '#e86a9a'], [91, 17, 4, '#d8304a'], [97, 24, 3.6, '#f2e6c8'], [62, 30, 3.2, '#f28a3a']]) {
    for (let k = 0; k < 6; k++) { const a = k / 6 * 6.28; s += `<circle cx="${f1(x + Math.cos(a) * rr * .55)}" cy="${f1(y + Math.sin(a) * rr * .55)}" r="${f1(rr * .5)}" fill="${c}"/>`; }
    s += `<circle cx="${x}" cy="${y}" r="${f1(rr * .3)}" fill="#5a2a1a"/>`;
  }
  s += `<path d="M58 28 l-6 -4 l4 7z M101 30 l7 -3 l-5 7z" fill="#3f6e34"/>`;
  // parrot on shoulder
  s += `<path d="M106 76 C102 66 106 58 112 58 C118 58 120 66 116 76 L120 92 L112 82Z" fill="#3fa84a"/><path d="M111 61 l-4 1 l3 2z" fill="#e8c84a"/><circle cx="112" cy="61" r="1" fill="#141414"/><path d="M110 70 q4 6 6 14" stroke="#e0402a" stroke-width="1.2" fill="none"/>`;
  // earrings
  s += `<circle cx="66" cy="50" r="1.4" fill="#f2c84a"/><circle cx="94" cy="50" r="1.4" fill="#f2c84a"/>`;
  return sv(s + grainOv(.22));
}

function ar_escher() {
  const S = 16, A = x => Math.max(0, Math.min(1, (x - 10) / 110)) * 5;
  const pt = (x, y, ex, ey, t, horiz) => {
    const amp = A(x);
    return horiz ? [x, y - amp * 1.2 * Math.sin(Math.PI * t)] : [x + amp * Math.sin(2 * Math.PI * t), y];
  };
  const N = 10;
  let s = bg('#ece4d0'), black = '', eyes = '';
  for (let i = -1; i < 11; i++) for (let j = -1; j < 8; j++) {
    if ((i + j) % 2 !== 0) continue;
    const x0 = i * S, y0 = j * S - 6, P = [];
    for (let k = 0; k < N; k++) { const t = k / N; P.push(pt(x0 + t * S, y0, 0, 0, t, true)); }
    for (let k = 0; k < N; k++) { const t = k / N; P.push(pt(x0 + S, y0 + t * S, 0, 0, t, false)); }
    for (let k = 0; k < N; k++) { const t = k / N; P.push(pt(x0 + S - t * S, y0 + S, 0, 0, 1 - t, true)); }
    for (let k = 0; k < N; k++) { const t = k / N; P.push(pt(x0, y0 + S - t * S, 0, 0, 1 - t, false)); }
    black += `M${pts(P).replace(/ /g, 'L')}Z`;
  }
  for (let i = 0; i < 10; i++) for (let j = 0; j < 7; j++) {
    const x = i * S + S * .7, y = j * S - 6 + S * .3;
    if (x < 96) continue;
    eyes += `<circle cx="${f1(x)}" cy="${f1(y)}" r="1.1" fill="${(i + j) % 2 === 0 ? '#ece4d0' : '#1b1b1b'}"/>`;
  }
  s += `<path d="${black}" fill="#1b1b1b" fill-rule="evenodd"/>${eyes}`;
  s += `<rect x="1" y="1" width="158" height="98" fill="none" stroke="#1b1b1b" stroke-width="2"/>`;
  return sv(s + grainOv(.3));
}

pool.groups.push({
  id: 'painters', title: 'Painters', slot: 'In the manner of',
  intro: 'Fifteen painters whose look is so distinct that their name works as a style. In a prompt, write "in the manner of X" and then spell out the traits (palette, marks, light, subject), because the traits are what carry the look; never ask for a copy of a specific painting.',
  terms: [
    { id: 'bosch', name: 'Hieronymus Bosch', aka: 'teeming fantastical moral landscapes',
      when: 'c.1450–1516 · Netherlands', y: 1490,
      desc: 'Wide, pale landscapes swarming with tiny naked people, hybrid creatures and giant fruit, painted as busy moral allegories. It feels like a dream told by a preacher with a wicked sense of humor.',
      spot: 'high horizon, hundreds of tiny pale figures, part-animal part-object creatures, oversized fruit and eggshell buildings, pastel greens and pinks, crisp fine detail',
      ref: 'The Garden of Earthly Delights, The Haywain Triptych, The Temptation of Saint Anthony',
      prompt: 'in the manner of Hieronymus Bosch: Netherlandish oil on panel, pale green high-horizon landscape, swarms of tiny pale figures, hybrid creatures, giant fruit, eggshell houses, crisp detail',
      ex: ar_bosch() },
    { id: 'bruegel', name: 'Pieter Bruegel the Elder', aka: 'bird\'s-eye peasant village life',
      when: 'c.1525–1569 · Flanders', y: 1559,
      desc: 'Busy village scenes seen from a high viewpoint, full of peasants working, feasting and playing, set in a sweeping landscape. It feels earthy, humorous and alive, like a whole community on one panel.',
      spot: 'high bird\'s-eye viewpoint, dozens of chunky little figures in red, white and black, steep-roofed houses, a big foreground tree, earthy browns fading to blue-green distance',
      ref: 'Hunters in the Snow, The Peasant Wedding, Netherlandish Proverbs',
      prompt: 'in the manner of Pieter Bruegel the Elder: Flemish oil on panel, high bird\'s-eye village view, crowds of stocky peasants in red and white, earthy browns, blue-green distance',
      ex: ar_bruegel() },
    { id: 'vermeer', name: 'Johannes Vermeer', aka: 'quiet window-lit Dutch interiors',
      when: '1632–1675 · Dutch Republic', y: 1657,
      desc: 'A single person absorbed in a quiet task in a room lit by a window on the left. The light is soft and pearly, and everything feels still, clean and intimate.',
      spot: 'window light from the left, one figure in a corner of a room, lemon yellow and ultramarine blue, a map or picture on the wall, checkered floor, soft glints of light on objects',
      ref: 'The Milkmaid, Girl with a Pearl Earring, The Art of Painting',
      prompt: 'in the manner of Johannes Vermeer: Dutch Golden Age oil, quiet interior, pearly daylight from a left window, lone figure in lemon yellow and ultramarine, checkered floor, still',
      ex: ar_vermeer() },
    { id: 'rembrandt', name: 'Rembrandt', aka: 'golden light out of deep brown shadow',
      when: '1606–1669 · Dutch Republic', y: 1632,
      desc: 'Faces and hands glow with warm golden light while everything else sinks into deep brown darkness. The paint is thick where the light falls, which makes the people feel tender, aged and real.',
      spot: 'warm gold-brown palette, most of the canvas in shadow, light pooled on face and hands, thick lumpy highlights, soft loose edges, old faces full of character',
      ref: 'The Night Watch, The Return of the Prodigal Son, late self-portraits',
      prompt: 'in the manner of Rembrandt: Dutch Baroque oil portrait, warm golden light on face and hands, deep brown shadow, thick impasto highlights, loose soft edges, tender aged character',
      ex: ar_rembrandt() },
    { id: 'turner', name: 'J. M. W. Turner', aka: 'dissolving storms of golden light',
      when: '1775–1851 · England', y: 1830,
      desc: 'Seas, storms and sunsets painted as swirling veils of light and mist, where boats and buildings almost melt away. It feels sublime: the weather is the real subject.',
      spot: 'blazing yellow-white center, vortex of hazy brush sweeps, objects dissolving into mist, warm golds against grey-blue, few hard edges anywhere',
      ref: 'Rain, Steam and Speed, The Fighting Temeraire, Snow Storm: Steam-Boat off a Harbour\'s Mouth',
      prompt: 'in the manner of J. M. W. Turner: Romantic oil, swirling vortex of golden light and mist, sea and sky dissolving, dark ship fading into haze, luminous yellow on grey-blue',
      ex: ar_turner() },
    { id: 'vangogh', name: 'Vincent van Gogh', aka: 'swirling impasto in blazing color',
      when: '1853–1890 · Netherlands, France', y: 1888,
      desc: 'Everything, even the sky, is built from thick, short, directional brushstrokes in intense blues and yellows. The marks swirl and flicker, so the scene feels charged with emotion and movement.',
      spot: 'visible thick dashes of paint, strokes that follow the form or swirl in the sky, cobalt blue against chrome yellow, twisting trees, dark outlines, glowing halo suns and stars',
      ref: 'The Starry Night, Wheatfield with Cypresses, Café Terrace at Night',
      prompt: 'in the manner of Vincent van Gogh: Post-Impressionist oil, thick short directional impasto strokes, swirling sky, cobalt blue and chrome yellow, twisting trees, glowing halo sun, vivid and restless',
      ex: ar_vangogh() },
    { id: 'klimt', name: 'Gustav Klimt', aka: 'gold-leaf patterned portraits',
      when: '1862–1918 · Austria', y: 1901,
      desc: 'Pale, dreamy faces and hands float inside robes and backgrounds made of real gold leaf and mosaic-like ornament. It feels sensual, decorative and precious, like an icon crossed with a jewel box.',
      spot: 'gold leaf fields, flat ornament (spirals, eye shapes, rectangles) right next to softly painted skin, tilted heads with closed eyes, flower meadows, tall narrow formats',
      ref: 'The Kiss, Portrait of Adele Bloch-Bauer I, The Tree of Life (Stoclet Frieze)',
      prompt: 'in the manner of Gustav Klimt: Vienna Secession painting, gold leaf, flat mosaic ornament of spirals, eyes and rectangles, softly modeled pale face with closed eyes, scattered flower meadow',
      ex: ar_klimt() },
    { id: 'matisse', name: 'Henri Matisse (cut-outs)', aka: 'painted-paper cut-outs',
      when: '1869–1954 · France', y: 1943,
      desc: 'In his last years Matisse cut shapes straight out of paper he had painted in pure color, then pinned them up: seaweed fronds, stars, dancers. The result is joyful, flat and bold, with the slightly wobbly edge of scissors.',
      spot: 'flat saturated cut shapes, no shading, wavy scissor edges, seaweed and leaf fronds, stars and blobs, colored rectangles set side by side, white gaps between pieces',
      ref: 'Jazz (book), The Snail, Blue Nudes',
      prompt: 'in the manner of Henri Matisse\'s late paper cut-outs: flat painted-paper shapes with wobbly scissor edges, seaweed fronds and stars, saturated ultramarine, magenta, orange and green on white',
      ex: ar_matisse() },
    { id: 'afklint', name: 'Hilma af Klint', aka: 'pastel spiritual abstraction',
      when: '1862–1944 · Sweden', y: 1906,
      desc: 'Huge, symmetrical abstract paintings made as spiritual diagrams: spirals, petals, split circles and soft curls in pinks, oranges, lavenders and blues. They feel botanical, mystical and calm, years before abstraction had a name.',
      spot: 'mirror symmetry, split circles (yellow and blue halves), snail spirals, petal rosettes, thin calligraphic curls, pastel peach, pink and lavender grounds, flat matte paint',
      ref: 'The Ten Largest, Group IX/SUW (The Swan), Altarpieces',
      prompt: 'in the manner of Hilma af Klint: early abstract tempera, symmetrical diagram of petals, snail spirals and split yellow-blue circles, flat pastel peach, pink and lavender, mystical and botanical',
      ex: ar_afklint() },
    { id: 'kandinsky', name: 'Wassily Kandinsky', aka: 'musical geometric abstraction',
      when: '1866–1944 · Russia, Germany, France', y: 1911,
      desc: 'Pure abstract compositions built like music: circles, triangles, crossing lines and checkerboards in vivid color on a soft ground. It feels playful and rhythmic, as if shapes were notes.',
      spot: 'circles with glowing halos, concentric rings, crisp black lines crossing at angles, triangles and arcs, small checkerboards, primary colors on a warm cream ground',
      ref: 'Composition VIII, Several Circles, Yellow-Red-Blue',
      prompt: 'in the manner of Wassily Kandinsky: geometric abstract painting, circles with soft halos, concentric rings, crisp crossing black lines, triangles and checkerboards, primary colors on warm cream, musical rhythm',
      ex: ar_kandinsky() },
    { id: 'hopper', name: 'Edward Hopper', aka: 'lonely sunlit American rooms',
      when: '1882–1967 · USA', y: 1925,
      desc: 'Plain American rooms, diners and streets, with one or two people sitting still in hard slabs of sunlight or electric light. It feels quiet, lonely and cinematic, like a paused film.',
      spot: 'sharp-edged geometric light and shadow, simple flat walls, a window to the outside, lone figure lost in thought, muted greens, ochres and brick reds, little detail',
      ref: 'Nighthawks, Morning Sun, Early Sunday Morning',
      prompt: 'in the manner of Edward Hopper: American realist oil, solitary figure in a plain room, hard slabs of window sunlight, muted green, ochre and brick red, cinematic loneliness',
      ex: ar_hopper() },
    { id: 'magritte', name: 'René Magritte', aka: 'deadpan everyday-object paradoxes',
      when: '1898–1967 · Belgium', y: 1926,
      desc: 'Ordinary things (apples, bowler hats, clouds, doors) painted flatly and politely, then put in impossible situations or at impossible sizes. Calm and clear on the surface, quietly unsettling underneath.',
      spot: 'smooth even paint, clear blue sky with puffy white clouds, bowler-hatted men, objects at wrong scale or in wrong places, crisp clean edges, no visible brushwork',
      ref: 'The Son of Man, The Treachery of Images, The Empire of Light',
      prompt: 'in the manner of René Magritte: deadpan Surrealist oil, smooth flat paint, ordinary objects at impossible scale, clear blue sky with puffy clouds, bowler-hatted man, crisp clean edges, quietly uncanny',
      ex: ar_magritte() },
    { id: 'okeeffe', name: 'Georgia O\'Keeffe', aka: 'giant close-up flowers, desert forms',
      when: '1887–1986 · USA', y: 1924,
      desc: 'Flowers painted so close up that they fill the whole canvas, plus sun-bleached bones and smooth New Mexico hills. The paint is silky and the forms are simplified into soft, flowing curves.',
      spot: 'extreme close-up filling the frame, smooth gradients with no visible brushstrokes, simplified curving forms, petals running off the edges, soft pinks, whites and deep centers',
      ref: 'Jimson Weed/White Flower No. 1, Black Iris, Red Hills and Bones',
      prompt: 'in the manner of Georgia O\'Keeffe: American modernist oil, extreme close-up flower filling the frame, silky smooth gradients, simplified flowing petals, soft pink and white into a deep center',
      ex: ar_okeeffe() },
    { id: 'kahlo', name: 'Frida Kahlo', aka: 'folk-art frontal self-portraits',
      when: '1907–1954 · Mexico', y: 1931,
      desc: 'Frontal, steady-eyed portraits framed by lush leaves, flowers and animals, painted in the flat, bright, symbolic style of Mexican folk retablos. They feel personal, proud and emblematic.',
      spot: 'straight-on bust with a direct gaze, strong joined brows, flower crowns and braided hair, embroidered Tehuana blouse, monkeys or parrots, dense leaf backdrop, flat bright colors',
      ref: 'Self-Portrait with Thorn Necklace and Hummingbird, The Two Fridas, Self-Portrait with Monkeys',
      prompt: 'in the manner of Frida Kahlo: Mexican folk-influenced oil, frontal portrait with steady gaze, flower crown and braids, embroidered blouse, parrot, dense tropical leaves, flat bright symbolic color',
      ex: ar_kahlo() },
    { id: 'escher', name: 'M. C. Escher', aka: 'tessellations and impossible spaces',
      when: '1898–1972 · Netherlands', y: 1937,
      desc: 'Precise black-and-white prints of interlocking shapes that tile the plane and slowly turn into birds or fish, and of buildings whose stairs loop impossibly. They feel like mathematical puzzles you can look at.',
      spot: 'black-and-white lithograph or woodcut look, shapes that interlock with no gaps, gradual morphing from simple tiles into creatures, impossible staircases, crisp exact lines',
      ref: 'Metamorphosis II, Relativity, Sky and Water I',
      prompt: 'in the manner of M. C. Escher: black-and-white lithograph, interlocking tessellation that gradually morphs from checkerboard into birds, crisp exact lines, mathematical and impossible',
      ex: ar_escher() },
  ]
});

/* ---------------- illustrators & designers ---------------- */

function ar_branch(r, x, y, a, len, w, depth, col) {
  if (depth === 0 || len < 2) return '';
  const mx = x + Math.cos(a) * len * .5 + (r() - .5) * len * .3, my = y + Math.sin(a) * len * .5 + (r() - .5) * len * .3;
  const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len;
  let s = `<path d="M${f1(x)} ${f1(y)}Q${f1(mx)} ${f1(my)} ${f1(x2)} ${f1(y2)}" stroke="${col}" stroke-width="${f1(w)}" fill="none" stroke-linecap="round"/>`;
  const n = depth > 2 ? 2 : 1 + (r() < .6 ? 1 : 0);
  for (let i = 0; i < n; i++) s += ar_branch(r, x2, y2, a + (r() - .5) * 1.4 + (i ? .4 : -.4), len * (.6 + r() * .2), w * .62, depth - 1, col);
  return s;
}
function ar_rackham() {
  const r = rng(71), sk = U('rk'), mist = U('rm');
  let s = `<defs>${ar_lg(sk, 0, 1, [[0, '#e7dcbc'], [.7, '#d6c59c'], [1, '#bba57a']])}${ar_lg(mist, 0, 1, [[0, '#f2ead6', 0], [1, '#f2ead6', .8]])}</defs>`;
  s += `<rect width="160" height="100" fill="url(#${sk})"/>`;
  // distant pale tree
  s += `<g opacity=".35">${ar_branch(r, 138, 100, -1.6, 22, 3, 5, '#6a5a44')}</g>`;
  s += `<rect y="60" width="160" height="40" fill="url(#${mist})"/>`;
  // gnarled trunk
  s += `<path d="M44 100 C50 86 40 74 48 60 C54 48 44 38 50 24 L60 24 C58 38 66 48 62 60 C58 74 70 86 72 100Z" fill="#8a7a5e"/>`;
  s += `<path d="M40 100 C30 96 20 98 8 94 M72 100 C84 96 92 98 104 92 M48 99 C42 94 34 90 26 90 M66 99 C76 92 86 88 98 88" stroke="#3a2a1a" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  for (let i = 0; i < 16; i++) { const x = 47 + i * 1.3; s += `<path d="M${f1(x - 2)} 100 C${f1(x + 4 - i * .4)} 86 ${f1(x - 6 + i * .2)} 74 ${f1(x + 1)} 60 C${f1(x + 6 - i * .3)} 48 ${f1(x - 4)} 38 ${f1(x + 2)} 26" stroke="#3a2a1a" stroke-width=".35" fill="none" opacity=".8"/>`; }
  // face in the bark
  s += `<ellipse cx="51" cy="52" rx="2.6" ry="1.6" fill="#2a1a0e"/><ellipse cx="60" cy="51" rx="2.2" ry="1.5" fill="#2a1a0e"/><circle cx="51.6" cy="51.8" r=".5" fill="#e8d8a8"/><path d="M50 49 q2 -2 4 0 M58 48 q2 -2 4 0" stroke="#2a1a0e" stroke-width=".6" fill="none"/><path d="M55 54 q-1 4 1 5" stroke="#2a1a0e" stroke-width=".6" fill="none"/><path d="M50 62 q5 3 11 -1 q-5 4 -11 1z" fill="#2a1a0e"/>`;
  // spindly finger branches
  s += ar_branch(r, 52, 26, -2.2, 18, 3, 5, '#3a2a1a') + ar_branch(r, 58, 26, -1.0, 18, 3, 5, '#3a2a1a') + ar_branch(r, 55, 30, -1.6, 14, 2.4, 5, '#3a2a1a');
  // muted washes: leaves
  for (let i = 0; i < 26; i++) s += `<ellipse cx="${f1(20 + r() * 80)}" cy="${f1(6 + r() * 26)}" rx="${f1(1 + r() * 1.5)}" ry=".8" fill="${pick(r, ['#8a8a5a', '#a86a3a', '#6a7a5a'])}" opacity=".7" transform="rotate(${f1(r() * 180)} 0 0)"/>`;
  // little goblin with red hood
  s += `<path d="M112 92 l3 -12 h6 l3 12z" fill="#6a6a4a" stroke="#2a1a0e" stroke-width=".5"/><circle cx="118" cy="77" r="3" fill="#d8b890" stroke="#2a1a0e" stroke-width=".5"/><path d="M114 77 L118 64 L122 77Z" fill="#a8402a" stroke="#2a1a0e" stroke-width=".5"/><path d="M121 78 l3 1" stroke="#2a1a0e" stroke-width=".5"/><path d="M114 92 l-2 2 M122 92 l2 2" stroke="#2a1a0e" stroke-width=".7"/>`;
  s += `<path d="M0 94 C40 90 120 92 160 90 V100 H0Z" fill="#9a8a5e" opacity=".6"/>`;
  return sv(s + grainOv(.3));
}

function ar_potter() {
  const bl = U('pb'), bl2 = U('pc'), r = rng(81);
  let s = `<defs><filter id="${bl}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2"/></filter><filter id="${bl2}"><feGaussianBlur stdDeviation=".7"/></filter></defs>` + bg('#fbf7ee');
  // soft watercolor grass and earth, fading at the edges
  s += `<g filter="url(#${bl})"><ellipse cx="80" cy="88" rx="66" ry="12" fill="#a9c48c" opacity=".8"/><ellipse cx="60" cy="92" rx="30" ry="6" fill="#c8b48a" opacity=".6"/><ellipse cx="136" cy="66" rx="24" ry="18" fill="#b9d0a4" opacity=".6"/></g>`;
  // fern fronds
  for (const [x, y, a] of [[24, 90, -100], [32, 92, -70], [16, 90, -130]]) {
    let f = `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 0 Q14 -2 30 0" stroke="#6a8a4a" stroke-width=".7" fill="none"/>`;
    for (let i = 3; i < 28; i += 3) f += `<path d="M${i} 0 l2 -${f1(4 - i * .1)} M${i} 0 l2 ${f1(4 - i * .1)}" stroke="#7a9a52" stroke-width="1.1" stroke-linecap="round"/>`;
    s += f + '</g>';
  }
  // flowerpot on its side
  s += `<g filter="url(#${bl2})"><path d="M108 72 L140 66 L144 90 L110 88Z" fill="#cf8058"/><ellipse cx="109" cy="80" rx="4" ry="8.5" fill="#8a4a30"/></g><path d="M108 72 L140 66 L144 90 L110 88" stroke="#7a4a30" stroke-width=".5" fill="none"/><ellipse cx="109" cy="80" rx="4" ry="8.5" fill="none" stroke="#7a4a30" stroke-width=".5"/>`;
  // mouse in a red jacket
  s += `<g filter="url(#${bl2})"><path d="M60 86 C50 86 50 66 66 62 C80 60 90 70 88 84 Z" fill="#a8927a"/><path d="M58 76 C60 66 72 62 80 66 C84 70 84 76 82 80 C74 82 64 82 58 76Z" fill="#c4473a"/><ellipse cx="56" cy="62" rx="10" ry="8" fill="#b29c84"/></g><path d="M58 76 C60 66 72 62 80 66 C84 70 84 76 82 80 C74 82 64 82 58 76Z" fill="none" stroke="#7a3a2a" stroke-width=".45"/><circle cx="70" cy="70" r=".9" fill="#f2e2b0"/><circle cx="72" cy="75" r=".9" fill="#f2e2b0"/>`;
  s += `<path d="M60 86 C50 86 50 66 66 62 C80 60 90 70 88 84" stroke="#6a5040" stroke-width=".5" fill="none"/><path d="M46 62 C48 56 56 54 62 58 C66 62 64 68 58 70 C52 70 46 66 46 62" stroke="#6a5040" stroke-width=".5" fill="none"/>`;
  s += `<circle cx="58" cy="54" r="4.2" fill="#c8ae96" stroke="#6a5040" stroke-width=".4"/><circle cx="58" cy="54" r="2.4" fill="#eab6b0"/><circle cx="64" cy="55" r="3.6" fill="#c8ae96" stroke="#6a5040" stroke-width=".4"/><circle cx="64" cy="55" r="2" fill="#eab6b0"/>`;
  s += `<circle cx="51" cy="61" r="1.1" fill="#1a1410"/><circle cx="51.3" cy="60.7" r=".3" fill="#fff"/><circle cx="46.4" cy="63.4" r=".9" fill="#b07a7a"/><path d="M47 63 l-7 -2 M47 64 l-7 1 M47 64.5 l-6 3" stroke="#6a5040" stroke-width=".25"/>`;
  s += `<path d="M58 68 C56 74 54 76 56 78" stroke="#a8927a" stroke-width="2.2" stroke-linecap="round" fill="none"/>`;
  s += `<path d="M88 82 C98 84 100 76 94 74 C90 73 90 78 94 78" stroke="#c8a8a0" stroke-width=".8" fill="none"/>`;
  // forget-me-nots
  for (let i = 0; i < 9; i++) { const x = 96 + r() * 20, y = 88 + r() * 6; s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="1.1" fill="#8aaad8"/><circle cx="${f1(x)}" cy="${f1(y)}" r=".35" fill="#f2d86a"/>`; }
  return sv(s + grainOv(.18));
}

function ar_jansson() {
  const r = rng(91), cl = U('jc');
  const ink = '#1c1c1c';
  let s = `<defs><clipPath id="${cl}"><path d="M0 0 H110 C100 10 70 18 40 14 C20 12 6 20 0 26Z"/></clipPath></defs>` + bg('#e7e2d0');
  // stormy hatched cloud
  s += `<path d="M0 0 H110 C100 10 70 18 40 14 C20 12 6 20 0 26Z" fill="#9aa7a8"/>` + ar_hatch(0, 0, 110, 26, 1.6, 20, ink, .35, .9, cl) + ar_hatch(0, 0, 70, 20, 2.2, -30, ink, .3, .7, cl);
  s += `<circle cx="132" cy="18" r="7" fill="#f2e2a0" stroke="${ink}" stroke-width=".6"/>`;
  // sea with ink wave curls
  s += `<rect y="58" width="160" height="42" fill="#6f93a8"/>`;
  for (let i = 0; i < 36; i++) { const x = r() * 160, y = 62 + r() * 36; s += `<path d="M${f1(x)} ${f1(y)} q3 -3 6 0 q-2 -1 -3 1" stroke="${ink}" stroke-width=".5" fill="none"/>`; }
  s += `<path d="M0 58 H160" stroke="${ink}" stroke-width=".6"/>`;
  // rocky island with rounded boulders
  s += `<path d="M30 70 C30 58 44 52 56 54 C64 46 82 46 90 54 C102 52 116 58 114 70Z" fill="#a8a494" stroke="${ink}" stroke-width=".8"/>`;
  s += `<path d="M44 66 c4 -4 10 -4 12 0 M74 62 c4 -5 12 -5 14 0 M96 66 c3 -3 8 -3 10 0" stroke="${ink}" stroke-width=".5" fill="none"/>`;
  // pines
  for (const [x, h] of [[46, 18], [52, 24], [100, 16]]) s += `<path d="M${x} ${56 - h} L${x - 5} ${54} H${x + 5}Z" fill="#2f4a3a" stroke="${ink}" stroke-width=".6"/><path d="M${x} ${56 - h} L${x - 4} ${56 - h * .5} H${x + 4}Z M${x} ${56 - h} L${x - 3} ${56 - h * .25}" fill="#2f4a3a" stroke="${ink}" stroke-width=".5"/>`;
  // lighthouse
  s += `<path d="M72 50 L75 18 H83 L86 50Z" fill="#f4efe2" stroke="${ink}" stroke-width=".8"/><path d="M74 34 H84" stroke="#c4473a" stroke-width="3"/><rect x="74" y="12" width="10" height="6" fill="#f2d86a" stroke="${ink}" stroke-width=".7"/><path d="M72 12 L79 6 L86 12Z" fill="#2f4a3a" stroke="${ink}" stroke-width=".7"/><path d="M84 15 L100 11 M84 15 L100 19" stroke="#f2d86a" stroke-width=".8"/>`;
  s += ar_hatch(80, 18, 6, 32, 1.2, 70, ink, .35, .7);
  // rowboat with a small round figure
  s += `<path d="M122 80 h22 c-2 4 -6 6 -10 6 h-4 c-4 0 -7 -2 -8 -6z" fill="#c4473a" stroke="${ink}" stroke-width=".7"/><ellipse cx="132" cy="75" rx="4" ry="5" fill="#f4efe2" stroke="${ink}" stroke-width=".7"/><circle cx="131" cy="73.5" r=".6" fill="${ink}"/><path d="M128 78 L120 86" stroke="${ink}" stroke-width=".8"/>`;
  return sv(s + grainOv(.2));
}

function ar_blair() {
  const r = rng(101);
  let s = bg('#f2668b');
  s += `<path d="M0 50 Q30 36 60 48 T120 42 T160 46 V100 H0Z" fill="#7a3f9a"/><path d="M0 64 Q40 56 80 64 T160 60 V100 H0Z" fill="#2bb3a3"/><path d="M0 84 Q60 76 160 84 V100 H0Z" fill="#f4e04a"/>`;
  // flower sun
  for (let i = 0; i < 12; i++) { const a = i / 12 * 6.28; s += `<path d="M${f1(128 + Math.cos(a) * 9)} ${f1(20 + Math.sin(a) * 9)} L${f1(128 + Math.cos(a + .18) * 16)} ${f1(20 + Math.sin(a + .18) * 16)} L${f1(128 + Math.cos(a - .18) * 16)} ${f1(20 + Math.sin(a - .18) * 16)}Z" fill="#ffd23a"/>`; }
  s += `<circle cx="128" cy="20" r="9" fill="#ff8a2a"/><circle cx="128" cy="20" r="4" fill="#ffd23a"/>`;
  // curly clouds
  s += `<path d="M14 18 q4 -6 8 0 q4 -6 8 0 q4 -6 8 0" stroke="#fff4f8" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M70 12 q3 -5 6 0 q3 -5 6 0" stroke="#fff4f8" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  // stacked, tilted houses
  const H = [[34, 30, 14, '#ff8a2a', '#3a2a7a'], [50, 22, 12, '#fff4f8', '#f2668b'], [64, 34, 16, '#3a2a7a', '#f4e04a'], [82, 26, 12, '#f4e04a', '#2bb3a3'], [96, 38, 14, '#2bb3a3', '#ff8a2a']];
  H.forEach(([x, h, w, c, roof], i) => {
    const base = 66 - (i % 2) * 3, tilt = (i % 2 ? 4 : -3);
    s += `<g transform="rotate(${tilt} ${x + w / 2} ${base})"><rect x="${x}" y="${base - h}" width="${w}" height="${h}" fill="${c}"/><path d="M${x - 2} ${base - h} L${x + w / 2} ${base - h - 9} L${x + w + 2} ${base - h}Z" fill="${roof}"/>`;
    for (let k = 0; k < Math.floor(h / 8); k++) s += `<rect x="${f1(x + w * .3)}" y="${base - h + 3 + k * 8}" width="${f1(w * .4)}" height="4" fill="${c === '#fff4f8' ? '#7a3f9a' : '#fff4f8'}"/>`;
    s += `</g>`;
  });
  // lollipop trees
  for (const [x, y, rr, c] of [[18, 70, 7, '#c4e84a'], [124, 70, 8, '#ff8a2a'], [146, 74, 6, '#c4e84a'], [26, 80, 5, '#fff4f8']]) s += `<path d="M${x} ${y} V${y + 14}" stroke="#3a2a7a" stroke-width="1.4"/><circle cx="${x}" cy="${y}" r="${rr}" fill="${c}"/><circle cx="${x}" cy="${y}" r="${f1(rr * .5)}" fill="none" stroke="#3a2a7a" stroke-width=".6"/>`;
  // tiny round-headed children
  for (const [x, c] of [[62, '#f2668b'], [72, '#3a2a7a'], [84, '#ff8a2a']]) s += `<path d="M${x - 3} 92 L${x} 84 L${x + 3} 92Z" fill="${c}"/><circle cx="${x}" cy="82" r="2.6" fill="#fff4f8"/><circle cx="${x}" cy="81" r="2.6" fill="#3a2a22" clip-path="none" opacity=".0"/>`;
  return sv(s);
}

function ar_harper() {
  let s = bg('#28506e');
  // geometric snowflakes in a loose grid
  const r = rng(111);
  for (let i = 0; i < 12; i++) for (let j = 0; j < 7; j++) {
    const x = 6 + i * 13.5 + (j % 2) * 6, y = 6 + j * 14;
    if (Math.abs(x - 84) < 30 && Math.abs(y - 50) < 26) continue;
    s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${pick(r, [1, 1.4, 2])}" fill="#eaf2f2"/>`;
  }
  // branch: straight-edged slabs with snow caps
  s += `<path d="M0 74 L160 58 L160 64 L0 82Z" fill="#5a3a2a"/><path d="M0 74 L160 58 L160 55 L0 70Z" fill="#eaf2f2"/><path d="M108 63 L138 82 L136 85 L104 66Z" fill="#5a3a2a"/><path d="M108 63 L138 82 L140 79 L110 60Z" fill="#eaf2f2"/>`;
  // red bird from circles and triangles
  s += `<path d="M66 66 L50 86 L58 86 L70 70Z" fill="#9a1e1e"/>`;
  s += `<path d="M64 66 A20 20 0 0 1 100 48 L94 66Z" fill="#d42a2a"/>`;
  s += `<path d="M64 66 A20 20 0 0 1 84 46 L84 66Z" fill="#b01f22"/>`;
  s += `<circle cx="96" cy="42" r="9" fill="#d42a2a"/><path d="M90 35 L94 22 L100 34Z" fill="#d42a2a"/>`;
  s += `<path d="M96 38 L108 42 L96 48Z" fill="#141414"/><path d="M103 40 L112 43 L103 46Z" fill="#f2a23a"/><circle cx="99" cy="41" r="1.4" fill="#eaf2f2"/>`;
  s += `<path d="M80 66 v6 l-3 2 M86 66 v6 l3 2" stroke="#141414" stroke-width="1.2" fill="none"/>`;
  return sv(s);
}

function ar_bass() {
  const [wd, wf] = wob(2.2, .14, 12);
  let s = `<defs>${wd}</defs>` + bg('#d8381e');
  s += `<g filter="url(#${wf})">`;
  // tilted paper bars
  s += `<path d="M-6 30 L170 12 L170 22 L-6 42Z" fill="#f1e8d6"/><path d="M-6 66 L170 50 L170 54 L-6 71Z" fill="#f1e8d6"/><path d="M-6 84 L170 70 L170 80 L-6 96Z" fill="#141414"/>`;
  // running figure, hand cut
  s += `<g fill="#141414"><circle cx="84" cy="26" r="7"/><path d="M76 36 L92 34 L96 58 L78 60Z"/><path d="M92 38 L110 50 L106 54 L90 44Z"/><path d="M78 40 L60 46 L62 52 L80 48Z"/><path d="M80 58 L66 76 L58 74 L56 78 L68 82 L88 60Z"/><path d="M90 58 L104 70 L114 66 L116 70 L102 78 L86 62Z"/></g>`;
  s += `<circle cx="40" cy="16" r="9" fill="#f1e8d6"/>`;
  s += `</g>`;
  return sv(s + grainOv(.25));
}

function ar_gorey() {
  const ink = '#1a1a1a', cl = U('gc');
  let s = `<defs><clipPath id="${cl}"><rect x="8" y="6" width="144" height="70"/></clipPath></defs>` + bg('#f4f1e8');
  // dense vertical hatching wall with a faint wallpaper stripe
  s += ar_hatch(8, 6, 144, 70, 1.15, 90, ink, .32, 1, cl);
  for (let x = 14; x < 152; x += 12) s += `<path d="M${x} 6 V76" stroke="#f4f1e8" stroke-width="1.6"/>`;
  // floor: horizontal hatching
  s += ar_hatch(8, 76, 144, 18, 1.6, 0, ink, .3, .8);
  s += `<rect x="8" y="6" width="144" height="88" fill="none" stroke="${ink}" stroke-width="1.2"/><rect x="5" y="3" width="150" height="94" fill="none" stroke="${ink}" stroke-width=".4"/>`;
  // urn on a plinth, with a small black bird
  s += `<rect x="106" y="58" width="22" height="26" fill="#f4f1e8" stroke="${ink}" stroke-width=".7"/>` + ar_hatch(106, 58, 22, 26, 1.4, 45, ink, .3, .7);
  s += `<path d="M108 58 C104 48 110 40 112 38 H122 C124 40 130 48 126 58Z" fill="#f4f1e8" stroke="${ink}" stroke-width=".7"/><path d="M110 38 H124 M109 46 H125" stroke="${ink}" stroke-width=".5"/>`;
  s += `<path d="M118 38 c-2 -4 0 -7 3 -7 l3 1 l-2 1 c1 3 0 5 -2 5z" fill="${ink}"/>`;
  // tall figure in a long fur coat and top hat
  s += `<path d="M48 88 L52 34 C52 28 66 28 66 34 L72 88Z" fill="${ink}"/>`;
  for (let x = 49; x < 72; x += 1.3) s += `<path d="M${f1(x)} 86 l.4 4" stroke="${ink}" stroke-width=".5"/>`;
  s += `<path d="M58 34 C58 50 60 70 61 86" stroke="#f4f1e8" stroke-width=".4"/>`;
  s += `<ellipse cx="59" cy="24" rx="4.2" ry="5" fill="#f4f1e8" stroke="${ink}" stroke-width=".6"/><circle cx="57.6" cy="23.5" r=".5" fill="${ink}"/><circle cx="60.6" cy="23.5" r=".5" fill="${ink}"/>`;
  s += `<rect x="54.5" y="8" width="9" height="12" fill="${ink}"/><path d="M52 19.5 H66" stroke="${ink}" stroke-width="1.4"/>`;
  s += `<path d="M55 30 C58 32 62 32 64 30 L66 34 C60 36 56 36 53 34Z M63 33 L68 56 L65 56 L61 34Z" fill="#f4f1e8" stroke="${ink}" stroke-width=".5"/>`;
  s += `<path d="M54 88 v3 h-4 M66 88 v3 h4" stroke="${ink}" stroke-width="1" fill="none"/>`;
  // a small child in a pinafore watching
  s += `<path d="M84 88 L87 72 H93 L96 88Z" fill="#f4f1e8" stroke="${ink}" stroke-width=".6"/><circle cx="90" cy="68" r="3.4" fill="#f4f1e8" stroke="${ink}" stroke-width=".6"/><path d="M86.6 67 C86 62 94 62 93.4 67" fill="${ink}"/><path d="M88 88 v3 M92 88 v3" stroke="${ink}" stroke-width=".8"/>`;
  return sv(s);
}

function ar_sendak() {
  const r = rng(121), ink = '#1e1a16', sk = U('ss'), cl = U('sc');
  let s = `<defs>${ar_lg(sk, 0, 1, [[0, '#2c4a5a'], [1, '#5a7a6a']])}<clipPath id="${cl}"><rect width="160" height="70"/></clipPath></defs>`;
  s += `<rect width="160" height="100" fill="url(#${sk})"/>`;
  s += ar_hatch(0, 0, 160, 70, 1.6, 30, ink, .3, .55, cl) + ar_hatch(0, 0, 160, 70, 2.2, -40, ink, .25, .35, cl);
  s += `<circle cx="124" cy="18" r="8" fill="#f2e6b0"/><circle cx="124" cy="18" r="8" fill="none" stroke="${ink}" stroke-width=".5"/>`;
  // trees: trunks + rounded hatched crowns
  for (const [x, w, top] of [[14, 8, 6], [38, 6, 14], [148, 9, 4], [104, 5, 26]]) {
    const cid = U('st');
    s += `<rect x="${x - w / 2}" y="${top}" width="${w}" height="${90 - top}" fill="#5a4a34"/>` + ar_hatch(x - w / 2, top, w, 90 - top, 1, 80, ink, .35, .9);
    s += `<clipPath id="${cid}"><circle cx="${x}" cy="${top + 4}" r="${w * 1.8}"/></clipPath><circle cx="${x}" cy="${top + 4}" r="${w * 1.8}" fill="#3e5a3a"/>` + ar_hatch(x - w * 2, top - w * 2 + 4, w * 4, w * 4, 1, 50, ink, .35, .9, cid);
  }
  // ground
  s += `<path d="M0 82 Q80 74 160 82 V100 H0Z" fill="#6a7a4a"/>` + ar_hatch(0, 80, 160, 20, 1.8, 10, ink, .3, .6);
  // big shaggy creature
  s += `<path d="M58 88 C50 70 56 40 76 36 C96 34 104 60 98 88Z" fill="#9a7a50" stroke="${ink}" stroke-width=".8"/>`;
  for (let i = 0; i < 70; i++) { const x = 58 + r() * 40, y = 42 + r() * 44; s += `<path d="M${f1(x)} ${f1(y)} l${f1(-1 + r() * 2)} 3" stroke="${ink}" stroke-width=".4"/>`; }
  s += `<circle cx="64" cy="40" r="4" fill="#9a7a50" stroke="${ink}" stroke-width=".7"/><circle cx="92" cy="40" r="4" fill="#9a7a50" stroke="${ink}" stroke-width=".7"/><path d="M62 88 l-1 2 M66 88 v2.5 M90 88 v2.5 M94 88 l1 2" stroke="${ink}" stroke-width=".6"/>`;
  s += `<circle cx="72" cy="48" r="4.4" fill="#f2e2a0" stroke="${ink}" stroke-width=".7"/><circle cx="84" cy="48" r="4.4" fill="#f2e2a0" stroke="${ink}" stroke-width=".7"/><circle cx="73" cy="49" r="1.6" fill="${ink}"/><circle cx="83" cy="49" r="1.6" fill="${ink}"/>`;
  s += `<path d="M72 56 q6 4 12 0" stroke="${ink}" stroke-width=".9" fill="#f4efe2"/><path d="M74 57 v1.8 M78 58 v2 M82 57 v1.8" stroke="${ink}" stroke-width=".5"/>`;
  s += `<path d="M62 88 h8 v2 h-8z M86 88 h8 v2 h-8z" fill="#9a7a50" stroke="${ink}" stroke-width=".6"/>`;
  s += `<path d="M98 66 C104 70 108 72 112 72" stroke="#9a7a50" stroke-width="4" stroke-linecap="round" fill="none"/>`;
  // small child in white pajamas holding its paw
  s += `<path d="M112 90 L113 74 C113 70 121 70 121 74 L122 90Z" fill="#f4efe2" stroke="${ink}" stroke-width=".7"/><path d="M117 74 V90" stroke="${ink}" stroke-width=".4"/><circle cx="117" cy="66" r="4.4" fill="#f0c8a0" stroke="${ink}" stroke-width=".7"/><path d="M112.6 65 C112 60 122 59 121.4 65 C119 62 115 62 112.6 65Z" fill="#6a4a2a"/><circle cx="115.6" cy="66.6" r=".5" fill="${ink}"/><path d="M113 76 L111 72" stroke="#f4efe2" stroke-width="2" stroke-linecap="round"/>`;
  return sv(s + grainOv(.2));
}

pool.groups.push({
  id: 'illustrators', title: 'Illustrators & designers', slot: 'In the manner of',
  intro: 'Picture-book artists, illustrators and graphic designers with an instantly recognizable hand. Name them with "in the manner of X" and then list the traits (line, palette, texture, characters), and keep the scene your own rather than a copy of a famous book page or poster.',
  terms: [
    { id: 'rackham', name: 'Arthur Rackham', aka: 'gnarled fairy-tale trees in sepia',
      when: '1867–1939 · England', y: 1905,
      desc: 'Fairy-tale illustrations drawn in fine, nervous pen line and tinted with muted sepia, grey-green and rust washes. Trees have faces and twisting roots, and goblins and fairies lurk in the misty half-light.',
      spot: 'brown ink outlines, gnarled trees with faces in the bark, spidery branches like fingers, muted parchment palette, thin translucent washes, spindly elves and goblins',
      ref: 'Rip Van Winkle (1905), Peter Pan in Kensington Gardens, Grimm\'s Fairy Tales',
      prompt: 'in the manner of Arthur Rackham: Edwardian fairy-tale illustration, fine brown pen line, muted sepia, grey-green and rust washes, gnarled trees with faces, spindly branches, misty and eerie',
      ex: ar_rackham() },
    { id: 'potter', name: 'Beatrix Potter', aka: 'gentle watercolor animals in clothes',
      when: '1866–1943 · England', y: 1902,
      desc: 'Small, accurately observed animals wearing a jacket or apron, painted in delicate watercolor over light pencil. The pictures are small and fade softly into white paper, so they feel cozy, quiet and true to nature.',
      spot: 'realistic small animals with one piece of clothing, soft transparent watercolor, faint pencil lines, vignette that fades into white paper, garden and countryside props',
      ref: 'The Tale of Peter Rabbit, The Tale of Mrs. Tiggy-Winkle, The Tailor of Gloucester',
      prompt: 'in the manner of Beatrix Potter: delicate Edwardian watercolor over light pencil, realistic small animal wearing a little jacket, soft garden setting, vignette fading into white paper',
      ex: ar_potter() },
    { id: 'jansson', name: 'Tove Jansson', aka: 'inky Nordic islands and soft round creatures',
      when: '1914–2001 · Finland', y: 1945,
      desc: 'Confident black pen line with dense hatching for storms and night, plus flat muted color for sea and rock. Her worlds are rocky Finnish islands with lighthouses and round, soft little beings, both cozy and melancholy.',
      spot: 'bold black ink outlines, scratchy hatched skies, flat muted blues and greys, rounded boulders and pine trees, lighthouses and small boats, small round soft creatures',
      ref: 'Moominvalley in November, Comet in Moominland, The Summer Book',
      prompt: 'in the manner of Tove Jansson: Nordic pen-and-ink illustration, confident black line, dense hatching for stormy sky, flat muted blue sea and grey rocks, lighthouse, pine trees, cozy and melancholy',
      ex: ar_jansson() },
    { id: 'blair', name: 'Mary Blair', aka: 'bold flat mid-century color whimsy',
      when: '1911–1978 · USA', y: 1941,
      desc: 'Flat, childlike shapes in daring color combinations (hot pink skies, teal hills, orange houses). Everything is simplified and a little tilted, so it feels joyful, naive and musical.',
      spot: 'unexpected saturated palettes, flat shapes with no outlines or shading, stacked tilted houses, lollipop trees, flower-shaped suns, tiny round-headed people',
      ref: 'concept art for Cinderella and Alice in Wonderland, It\'s a Small World, I Can Fly (Golden Book)',
      prompt: 'in the manner of Mary Blair: mid-century gouache concept art, flat childlike shapes, hot pink sky, teal and purple hills, tilted stacked houses, lollipop trees, flower sun, joyful',
      ex: ar_blair() },
    { id: 'harper', name: 'Charley Harper', aka: 'geometric "minimal realism" wildlife',
      when: '1922–2007 · USA', y: 1950,
      desc: 'Birds and animals reduced to circles, triangles and flat color, with no outlines and no texture. He called it minimal realism: you count the wings, not the feathers, and it feels clever and serene.',
      spot: 'animals built from simple geometric shapes, flat even color, no outlines, crisp straight-edged branches, repeating patterns of dots or snowflakes, playful symmetry',
      ref: 'Ford Times illustrations, The Golden Book of Biology, Cardinal Christmas',
      prompt: 'in the manner of Charley Harper: minimal-realism wildlife print, bird built from circles and triangles, flat even colors, no outlines, crisp geometric branch, pattern of dots, serene and witty',
      ex: ar_harper() },
    { id: 'bass', name: 'Saul Bass', aka: 'jagged cut-paper film-poster graphics',
      when: '1920–1996 · USA', y: 1955,
      desc: 'Bold, symbolic graphics made from a few rough cut-paper shapes in two or three colors, usually black and white on a strong red or orange. One striking silhouette tells the whole story.',
      spot: 'hand-cut ragged edges, black silhouettes, two or three flat colors, tilted bars and strips, one dramatic symbol, lots of empty colored space',
      ref: 'The Man with the Golden Arm poster, Anatomy of a Murder, the Vertigo title sequence',
      prompt: 'in the manner of Saul Bass: mid-century film poster, rough hand-cut paper shapes, black silhouette of a running figure, tilted white strips, flat red-orange ground, bold symbolic minimal',
      ex: ar_bass() },
    { id: 'gorey', name: 'Edward Gorey', aka: 'crosshatched Edwardian gloom',
      when: '1925–2000 · USA', y: 1953,
      desc: 'Tiny, meticulous pen drawings of Edwardian people in long fur coats, standing in hatched rooms beside urns and gloomy wallpaper. Deadpan and darkly funny, as if a Victorian picture book went wrong.',
      spot: 'black ink only, very fine dense parallel hatching, small framed vignettes, tall figures in fur coats and scarves, urns and striped wallpaper, pale blank faces',
      ref: 'The Gashlycrumb Tinies, The Doubtful Guest, The Unstrung Harp',
      prompt: 'in the manner of Edward Gorey: black pen-and-ink vignette, dense fine parallel hatching, Edwardian figure in long fur coat and top hat, stone urn, striped wallpaper, deadpan gothic humor',
      ex: ar_gorey() },
    { id: 'sendak', name: 'Maurice Sendak', aka: 'crosshatched night-forest picture books',
      when: '1928–2012 · USA', y: 1963,
      desc: 'Soft watercolor scenes laced with fine crosshatching, often at night in a forest, where chubby children meet big shaggy creatures. Tender and a little wild, like a dream you are not quite scared of.',
      spot: 'pen crosshatching over muted watercolor, moonlit greens and blues, chunky trees, big furry creatures with round yellow eyes, small sturdy children in pajamas',
      ref: 'Where the Wild Things Are, In the Night Kitchen, Outside Over There',
      prompt: 'in the manner of Maurice Sendak: picture-book pen crosshatching over soft watercolor, moonlit forest night, big shaggy creature with round yellow eyes, small child in pajamas, tender and wild',
      ex: ar_sendak() },
  ]
});


/* ---------- subjects: one page each ----------
   To add a subject, push groups into pool.groups (part files above), then add an entry here:
   { id, title, blurb, preview: termId, color, groups: [groupId, ...] }
*/
const G = Object.fromEntries(pool.groups.map(g => [g.id, g]));
const WORKBOOK = {
  recipe: [
    ['A '], ['WPA poster', 'wpa'], [' of a lone sailboat sailing into an enormous sun, with the still, glowing light of '], ['Luminism', 'hudson'],
    [' and a small '], ['figure seen from behind', 'romanticism'], [', planned as a '], ['notan', 'notan'], [' of light and dark, printed like a '],
    ['lithograph', 'lithograph'], [', the boat dissolving into the glare '], ['the way Turner paints it', 'turner'], ['.']
  ],
  areas: [
    { id: 'early', title: 'Early eras', preview: 'byzantine', color: '#C8902E', blurb: 'From cave walls to the Romantics: what each era before modern art looks like, and the words that summon it.', groups: ['ancient', 'masters'] },
    { id: 'modern', title: 'Modern movements', preview: 'fauvism', color: '#D2513F', blurb: 'The movements that broke the rules between 1850 and 1945, from Realism and Fauvism to Dada and WPA posters.', groups: ['avant', 'interwar'] },
    { id: 'contemporary', title: 'Postwar & now', preview: 'psychedelic', color: '#C2479B', blurb: 'Color field, psychedelic posters, street art, Superflat and the styles of the last few decades.', groups: ['postwar', 'now'] },
    { id: 'illustration', title: 'Illustration traditions', preview: 'ligneclaire', color: '#3D6BF0', blurb: 'Picture books, pulp covers, propaganda posters, manga, ligne claire, tattoo flash and other working illustration styles.', groups: ['printed', 'comics'] },
    { id: 'folk', title: 'World & folk traditions', preview: 'madhubani', color: '#1FA197', blurb: 'Folk art and ornament from around the world, with notes on borrowing the visual language respectfully.', groups: ['folkart', 'ornament'] },
    { id: 'craft', title: 'Printmaking & crafts', preview: 'woodcut', color: '#7A8A2E', blurb: 'How a picture is physically made: woodcut, etching, lithography, fresco, gilding, marbling and more.', groups: ['printmaking', 'craft'] },
    { id: 'hand', title: 'Painting & drawing', preview: 'chiaroscuro', color: '#8C63D9', blurb: 'The painter’s and draftsman’s words: chiaroscuro, sfumato, glazing, gesture, notan and other ways of handling light and line.', groups: ['painteffects', 'drawing'] },
    { id: 'artists', title: 'Artists’ signatures', preview: 'vangogh', color: '#5B6B82', blurb: 'Historical painters and illustrators whose manner is a style of its own, with the traits to ask for.', groups: ['painters', 'illustrators'] }
  ].map(a => ({ ...a, groups: a.groups.map(id => G[id]).filter(Boolean) }))
};
const OUTPUTS = ['Image generation', 'Poster or print', 'Book illustration', 'Pattern or textile', 'Slide or UI theme', 'Brief for an illustrator'];
const STYLE_SLOTS = ['Era style', 'Movement', 'Illustration style', 'Folk tradition', 'Pattern tradition', 'In the manner of'];
const VV_URL = '../visual-vocabulary/';
// movements that live in Visual Vocabulary, shown dashed on the timeline
const ELSEWHERE = [['Ukiyo-e', 1680], ['Impressionism', 1872], ['Pointillism', 1886], ['Art Nouveau', 1890], ['Cubism', 1907], ['Constructivism', 1915], ['De Stijl', 1917], ['Bauhaus', 1919], ['Surrealism', 1924], ['Art Deco', 1925], ['Abstract Expressionism', 1945], ['Swiss style', 1950], ['Pop Art', 1956], ['Op Art', 1964], ['Memphis', 1981]];
const BANDS = [[-Infinity, 1400, 'Before 1400', 'Caves, temples, cathedrals'], [1400, 1700, '1400 to 1700', 'Renaissance and Baroque'], [1700, 1850, '1700 to 1850', 'Rococo to Romanticism'], [1850, 1914, '1850 to 1914', 'The modern break'], [1914, 1945, '1914 to 1945', 'Between the wars'], [1945, 1980, '1945 to 1980', 'Postwar'], [1980, Infinity, '1980 to today', 'Now']];

/* ---------- readings: a real prompt, read for art history ---------- */
const READINGS = [];

/* ---------- rendering ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
};
const picks = new Set(store.get('am-picks', []));
let output = store.get('am-output', '');
const TERMS = {};
WORKBOOK.areas.forEach(a => a.groups.forEach(g => g.terms.forEach(t => TERMS[t.id] = { t, g, a })));
[...picks].forEach(id => { if (!TERMS[id]) picks.delete(id); });
const totalTerms = Object.keys(TERMS).length;
let pendingJump = null;

const cardHTML = (t, g) => `
  <article class="card${picks.has(t.id) ? ' picked' : ''}" id="t-${t.id}" data-search="${esc((t.name + ' ' + (t.aka || '') + ' ' + (t.when || '') + ' ' + t.desc + ' ' + (t.ref || '') + ' ' + (t.spot || '') + ' ' + g.title).toLowerCase())}">
    <div class="ex">${t.ex}</div>
    <div class="cbody">
      ${t.when ? `<div class="when">${esc(t.when)}</div>` : ''}
      <h3>${esc(t.name)}</h3>
      ${t.aka ? `<div class="aka">Also called ${esc(t.aka)}</div>` : ''}
      <p class="desc">${esc(t.desc)}</p>
      ${t.spot ? `<p class="ref"><b>Spot it</b>${esc(t.spot)}</p>` : ''}
      ${t.ref ? `<p class="ref"><b>Look up</b>${esc(t.ref)}</p>` : ''}
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
const emptyMsg = `<p class="empty" id="empty" hidden>Nothing matches that search. Try a plainer word like "gold", "poster", "Japan", "1920" or a painter's name.</p>`;
const retag = s => s.replace(/id="([^"]+)"/g, 'id="tile-$1"').replace(/url\(#([^)]+)\)/g, (m, id) => id === 'grainF' || id === 'vigF' ? m : `url(#tile-${id})`).replace(/href="#([^"]+)"/g, 'href="#tile-$1"');
const yr = y => y < 0 ? `${-y} BCE` : y < 1000 ? `${y} CE` : String(y);

function timelineHTML() {
  const items = Object.values(TERMS).filter(x => typeof x.t.y === 'number').map(x => ({ y: x.t.y, name: x.t.name, id: x.t.id, color: x.a.color }))
    .concat(ELSEWHERE.map(([name, y]) => ({ y, name, ghost: true })));
  return `<h2 id="timelineH">Timeline</h2>
    <p class="lead">Every dated card, in order. The year is roughly when the style or the artist's mature manner took shape. Dashed entries are the famous movements that already have cards in Visual Vocabulary.</p>
    <ul class="legend">${WORKBOOK.areas.filter(a => a.groups.some(g => g.terms.some(t => typeof t.y === 'number'))).map(a => `<li><i style="background:${a.color}"></i>${esc(a.title)}</li>`).join('')}<li class="ghost"><i></i>In Visual Vocabulary</li></ul>
    <div class="bands">${BANDS.map(([lo, hi, label, sub]) => {
      const row = items.filter(i => i.y >= lo && i.y < hi).sort((a, b) => a.y - b.y || a.name.localeCompare(b.name));
      if (!row.length) return '';
      return `<div class="band"><h3>${esc(label)}<small>${esc(sub)}</small></h3><div class="tchips">${row.map(i => i.ghost
        ? `<a class="tchip ghost" href="${VV_URL}" target="_blank" rel="noopener" title="Open Visual Vocabulary"><i></i>${esc(i.name)} <b>${yr(i.y)}</b></a>`
        : `<a class="tchip" href="#${TERMS[i.id].a.id}" data-jump="${i.id}"><i style="background:${i.color}"></i>${esc(i.name)} <b>${yr(i.y)}</b></a>`).join('')}</div></div>`;
    }).join('')}</div>`;
}

function renderHome() {
  $('#home').hidden = false; $('#subject').hidden = true; $('#main').innerHTML = '';
  $('#homeCount').textContent = `${totalTerms} cards in ${WORKBOOK.areas.length} subjects`;
  $('#sentence').innerHTML = WORKBOOK.recipe.map(([txt, id]) => {
    if (!id || !TERMS[id]) return esc(txt);
    return `<a class="chip" href="#${TERMS[id].a.id}" data-jump="${id}"><span>${esc(txt)}</span><small>${esc(TERMS[id].g.slot)}</small></a>`;
  }).join('');
  $('#tiles').innerHTML = WORKBOOK.areas.map(a => `
    <a class="tile" href="#${a.id}">
      <div class="ex" aria-hidden="true">${TERMS[a.preview] ? retag(TERMS[a.preview].t.ex) : ''}</div>
      <div class="tbody"><h3>${esc(a.title)}</h3><p>${esc(a.blurb)}</p>
      <div class="tmeta">${a.groups.reduce((n, g) => n + g.terms.length, 0)} cards · ${a.groups.map(g => esc(g.title)).join(' · ')}</div></div>
    </a>`).join('');
  $('#timeline').innerHTML = timelineHTML();
  const chip = id => TERMS[id] ? `<a class="chip" href="#${TERMS[id].a.id}" data-jump="${id}"><span>${esc(TERMS[id].t.name)}</span><small>${esc(TERMS[id].g.slot)}</small></a>` : '';
  $('#reading').innerHTML = READINGS.map(r => `
    <h2 id="readingH">Read a real prompt: ${esc(r.title)}</h2>
    <p class="lead">${esc(r.intro)}</p>
    <div class="rgrid">
      <figure class="rfig"><img src="${r.img}" alt="${esc(r.alt)}" loading="lazy"><figcaption>${esc(r.by)}</figcaption></figure>
      <ol class="rparts">${r.parts.map(p => `<li><blockquote>“${esc(p.q)}”</blockquote>${p.uses.length ? `<div class="uses">${p.uses.map(chip).join('')}</div>` : ''}${p.note ? `<p class="note"><b>Sharpen</b>${esc(p.note)}</p>` : ''}</li>`).join('')}</ol>
    </div>`).join('');
  $('#results').innerHTML = '';
  filter($('#qh'), $('#results'), true);
}

// search results on the home page are built only when someone searches, so the page stays light
let resultsBuilt = false;
function buildResults() {
  if (resultsBuilt) return;
  $('#results').innerHTML = WORKBOOK.areas.map(a => a.groups.map(g => groupHTML(g, a.title)).join('')).join('') + emptyMsg;
  resultsBuilt = true;
}

function renderSubject(a) {
  $('#home').hidden = true; $('#subject').hidden = false; $('#results').innerHTML = ''; resultsBuilt = false;
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
  else if (!id || !document.getElementById(id)) { renderHome(); resultsBuilt = false; }
  else return; // in-page anchor such as #g-ancient
  if (pendingJump) { const j = pendingJump; pendingJump = null; setTimeout(() => jumpTo(j), 60); }
  else if (a || !id) window.scrollTo(0, 0);
}

function compose() {
  const subj = $('#subject-in').value.trim() || '[what you are making]';
  const lines = [`Art direction for ${subj}${output ? ` (${output.toLowerCase()})` : ''}:`, ''];
  const tells = [], refs = [];
  const chosen = [];
  WORKBOOK.areas.forEach(a => a.groups.forEach(g => {
    const ps = g.terms.filter(t => picks.has(t.id));
    if (!ps.length) return;
    lines.push(`- ${g.slot}: ${ps.map(t => t.prompt).join('; ')}`);
    ps.forEach(t => { chosen.push({ t, g }); if (t.spot) tells.push(`- ${t.name}: ${t.spot}`); if (t.ref) refs.push(`- ${t.name}: ${t.ref}`); });
  }));
  const n = chosen.length;
  if (!n) { lines.push('- (add cards from the workbook)'); return { text: lines.join('\n'), n }; }
  if (tells.length) lines.push('', 'What makes each one recognizable:', ...tells);
  if (output === 'Brief for an illustrator' && refs.length) lines.push('', 'References to look up:', ...refs);
  const styles = chosen.filter(c => STYLE_SLOTS.includes(c.g.slot));
  lines.push('');
  if (styles.length >= 2) lines.push(`Let ${styles[0].t.name} lead the structure and use ${styles.slice(1).map(c => c.t.name).join(' and ')} only to flavor it.`);
  if (chosen.some(c => c.g.slot === 'In the manner of')) lines.push('Borrow the traits of each artist, not any specific artwork.');
  if (chosen.some(c => c.g.slot === 'Folk tradition' || c.g.slot === 'Pattern tradition')) lines.push('Use each tradition\'s visual language (line, pattern, palette) rather than specific sacred or community-owned designs.');
  if (output === 'Image generation') lines.push('Spell out the traits in plain words as well as the names, since some image models ignore style names.');
  if (output === 'Pattern or textile') lines.push('Make it a seamless repeating tile with an even spread of motifs.');
  if (output === 'Slide or UI theme') lines.push('Keep the style to backgrounds, illustration and accents so text stays readable.');
  return { text: lines.join('\n').replace(/\n+$/, ''), n };
}

function renderTray() {
  const { text, n } = compose();
  $('#out').textContent = text;
  const names = [...picks].filter(id => TERMS[id]).map(id => TERMS[id].t.name);
  $('#count').innerHTML = n
    ? `${n} card${n > 1 ? 's' : ''} picked<small>${esc(names.join(' · '))}</small>`
    : `No cards picked yet<small>Press "Add to prompt" on any card to start</small>`;
  $('#outputs').innerHTML = OUTPUTS.map(m => `<button type="button" class="qchip" data-output="${esc(m)}" aria-pressed="${m === output}">${esc(m)}</button>`).join('');
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
  if (homeMode) { if (q) buildResults(); $('#results').hidden = !q; $('#tiles').hidden = !!q; $('#recipe').hidden = !!q; $('#timeline').hidden = !!q; $('#reading').hidden = !!q; }
  let any = false;
  scope.querySelectorAll('.group').forEach(g => {
    let vis = 0;
    g.querySelectorAll('.card').forEach(c => { const ok = !q || c.dataset.search.includes(q); c.hidden = !ok; if (ok) vis++; });
    g.hidden = !vis; if (vis) any = true;
    const nav = document.querySelector(`#nav [data-g="${g.id.slice(2)}"]`); if (nav) nav.hidden = !vis;
  });
  const empty = scope.querySelector('#empty'); if (empty) empty.hidden = any;
}

document.addEventListener('click', e => {
  const add = e.target.closest('[data-add]');
  if (add) {
    const id = add.dataset.add;
    picks.has(id) ? picks.delete(id) : picks.add(id);
    store.set('am-picks', [...picks]);
    const on = picks.has(id);
    document.querySelectorAll(`[data-add="${id}"]`).forEach(b => { b.setAttribute('aria-pressed', on); b.textContent = on ? 'Added' : 'Add to prompt'; });
    document.querySelectorAll(`#t-${id}`).forEach(c => c.classList.toggle('picked', on));
    renderTray(); return;
  }
  const md = e.target.closest('[data-output]');
  if (md) { output = output === md.dataset.output ? '' : md.dataset.output; store.set('am-output', output); renderTray(); return; }
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
  picks.clear(); store.set('am-picks', []);
  document.querySelectorAll('.card.picked').forEach(c => c.classList.remove('picked'));
  document.querySelectorAll('[data-add]').forEach(b => { b.setAttribute('aria-pressed', 'false'); b.textContent = 'Add to prompt'; });
  renderTray();
});
$('#subject-in').value = store.get('am-subject', '');
$('#subject-in').addEventListener('input', () => { store.set('am-subject', $('#subject-in').value); renderTray(); });

route();
renderTray();
