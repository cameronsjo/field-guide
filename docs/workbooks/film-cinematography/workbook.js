const pool = { groups: [] };
/* ======================================================
   FILM KIT (shared with the Photography workbook). Every example is an SVG on a 320 x 200 stage
   (16:10, same as the card). pic(k => markup) collects defs
   (gradients, filters, clips) with unique ids per drawing.
   ====================================================== */
let _u = 0;
const U = p => `${p}${++_u}`;
function pic(fn, vb = '0 0 320 200', after = '') {
  const defs = [];
  const k = {
    id: U,
    def(s) { defs.push(s); return ''; },
    // linear gradient; dir 'v' (top to bottom), 'h' (left to right) or explicit "x1 y1 x2 y2"; u = userSpaceOnUse
    lg(stops, dir = 'v', u = false) {
      const id = U('lg'); const [x1, y1, x2, y2] = dir === 'v' ? [0, 0, 0, 1] : dir === 'h' ? [0, 0, 1, 0] : dir.split(' ').map(Number);
      defs.push(`<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"${u ? ' gradientUnits="userSpaceOnUse"' : ''}>${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</linearGradient>`);
      return `url(#${id})`;
    },
    rg(stops, cx = .5, cy = .5, r = .5, fx = cx, fy = cy, u = false) {
      const id = U('rg');
      defs.push(`<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}" fx="${fx}" fy="${fy}"${u ? ' gradientUnits="userSpaceOnUse"' : ''}>${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</radialGradient>`);
      return `url(#${id})`;
    },
    // blur filter attribute; sd may be "x y" for directional blur
    blur(sd) { const id = U('bl'); defs.push(`<filter id="${id}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="${sd}"/></filter>`); return `filter="url(#${id})"`; },
    filter(prims) { const id = U('fx'); defs.push(`<filter id="${id}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">${prims}</filter>`); return `filter="url(#${id})"`; },
    clip(shapes) { const id = U('cp'); defs.push(`<clipPath id="${id}">${shapes}</clipPath>`); return `clip-path="url(#${id})"`; },
    // film grain overlay across the whole stage
    grain(op = .3, freq = .9) { const id = U('gn'); defs.push(`<filter id="${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>`); return `<rect x="-20" y="-20" width="360" height="240" filter="url(#${id})" opacity="${op}" style="mix-blend-mode:overlay"/>`; },
    vignette(op = .6, inner = .45) { return `<rect x="0" y="0" width="320" height="200" fill="${this.rg([[inner, '#000', 0], [1, '#000', op]], .5, .5, .7)}"/>`; }
  };
  return `<svg viewBox="${vb}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><g>${fn(k)}</g><defs>${defs.join('')}</defs></svg>${after}`;
}
const tag = (t, pos = 'tl') => `<span class="tag ${pos}">${t}</span>`;
const R = (x, y, w, h, f, x2 = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" ${x2}/>`;
const C = (x, y, r, f, x2 = '') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" ${x2}/>`;
const E = (x, y, rx, ry, f, x2 = '') => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}" ${x2}/>`;
const Pth = (d, f, x2 = '') => `<path d="${d}" fill="${f}" ${x2}/>`;
// seeded random so drawings are stable between renders
const rnd = s => () => (s = (s * 16807) % 2147483647) / 2147483647;

/* ---------- small silhouettes ---------- */
// standing person, feet at (x, y), height h
const fig = (x, y, h, c = '#15120F', x2 = '') => { const s = h / 30; return `<g transform="translate(${x} ${y}) scale(${s})" fill="${c}" ${x2}><circle cx="0" cy="-26.5" r="3.4"/><path d="M-5 -22 Q0 -23.6 5 -22 L6.2 -10 L4.2 -9.6 L3.6 -15 L3.4 0 L.8 0 L0 -10 L-.8 0 L-3.4 0 L-3.6 -15 L-4.2 -9.6 L-6.2 -10Z"/></g>`; };
const pine = (x, y, h, c) => `<path d="M${x} ${y - h} L${x + h * .28} ${y - h * .45} L${x + h * .16} ${y - h * .45} L${x + h * .36} ${y} L${x - h * .36} ${y} L${x - h * .16} ${y - h * .45} L${x - h * .28} ${y - h * .45}Z" fill="${c}"/>`;
const tree = (x, y, h, c, t = c) => `<rect x="${x - h * .04}" y="${y - h * .45}" width="${h * .08}" height="${h * .45}" fill="${t}"/><circle cx="${x}" cy="${y - h * .66}" r="${h * .3}" fill="${c}"/><circle cx="${x - h * .18}" cy="${y - h * .52}" r="${h * .2}" fill="${c}"/><circle cx="${x + h * .2}" cy="${y - h * .54}" r="${h * .22}" fill="${c}"/>`;
const house = (x, y, w, c, win = null, roof = c) => `<path d="M${x} ${y} V${y - w * .55} L${x + w / 2} ${y - w * .95} L${x + w} ${y - w * .55} V${y}Z" fill="${c}"/>${win ? R(x + w * .2, y - w * .45, w * .2, w * .2, win) + R(x + w * .6, y - w * .45, w * .2, w * .2, win) + R(x + w * .42, y - w * .22, w * .16, w * .22, win) : ''}`;

/* ---------- landscape ---------- */
const MTN = 'L0 96 L30 84 L58 92 L92 70 L120 86 L150 78 L182 92 L214 66 L246 84 L276 76 L320 90 L320';
function land(k, o = {}) {
  const hz = o.hz ?? 128, s = o.sky || ['#5B8DC9', '#9CC0E0', '#E9EEF0'];
  let g = R(-20, -20, 360, hz + 30, k.lg([[0, s[0]], [.6, s[1]], [1, s[2]]]));
  if (o.stars) { const r = rnd(o.stars); for (let i = 0; i < 70; i++) g += C(r() * 320, r() * hz * .85, r() * .9 + .2, '#fff', `opacity="${(r() * .7 + .3).toFixed(2)}"`); }
  if (o.band) g += `<path d="M-20 150 Q120 40 340 -10 L340 40 Q140 90 -20 190Z" fill="${k.rg([[0, '#E8D9FF', .55], [1, '#E8D9FF', 0]], .5, .5, .6)}" ${k.blur(6)}/>`;
  if (o.sun) { const u = o.sun; if (u.glow !== 0) g += C(u.x, u.y, u.r * (u.glow || 5), k.rg([[0, u.c, .8], [1, u.c, 0]])); g += C(u.x, u.y, u.r, u.core || '#FFF8E8'); }
  if (o.moon) g += C(o.moon.x, o.moon.y, o.moon.r * 4, k.rg([[0, '#DDE6FF', .35], [1, '#DDE6FF', 0]])) + C(o.moon.x, o.moon.y, o.moon.r, '#F2F4FA');
  if (o.clouds) g += o.clouds;
  if (o.mtn) g += Pth(`M0 ${hz} ${MTN} ${hz}Z`.replace(/(\d+) (\d+)/g, (m, a, b) => `${a} ${+b + (o.mtnY || 0)}`), o.mtn);
  if (o.fogFar) g += R(-20, hz - 60, 360, 60, k.lg([[0, o.fogFar, 0], [1, o.fogFar, .9]]));
  if (o.hill) g += Pth(`M-10 ${hz} L-10 ${hz - 14} Q40 ${hz - 32} 80 ${hz - 20} T160 ${hz - 24} T240 ${hz - 16} T330 ${hz - 28} L330 ${hz}Z`, o.hill);
  if (o.treeline) { for (let i = 0; i < 24; i++) g += pine(i * 14 - 4, hz + 1, 12 + (i * 7 % 9), o.treeline); }
  if (o.water) {
    const wc = o.waterC || [s[2], s[1], s[0]];
    g += R(-20, hz, 360, 220 - hz, k.lg([[0, wc[0]], [.5, wc[1]], [1, wc[2]]]));
    if (o.sun && o.sun.y < hz) g += E(o.sun.x, hz + 26, o.sun.r * .9, 30, k.lg([[0, o.sun.c, .85], [1, o.sun.c, 0]]), k.blur(2));
    g += Array.from({ length: 7 }, (_, i) => R(-20, hz + 6 + i * i * 1.4, 360, .6, '#fff', `opacity="${.25 - i * .02}"`)).join('');
  } else g += R(-20, hz, 360, 220 - hz, k.lg([[0, o.ground2 || o.ground || '#7C8C5A'], [1, o.ground || '#59683C']]));
  if (o.shore) g += Pth(`M-20 ${o.shore} Q80 ${o.shore - 10} 160 ${o.shore + 2} T340 ${o.shore - 4} L340 220 L-20 220Z`, o.shoreC || '#2A2620');
  if (o.extra) g += o.extra;
  if (o.fog) g += R(-20, hz - 40, 360, 120, k.lg([[0, o.fog, 0], [.45, o.fog, .75], [1, o.fog, .2]]));
  return g;
}

/* ---------- sphere still life (light quality and direction) ---------- */
// lx, ly: where the light comes from (-1..1); hard: crisp terminator and shadow
function sphere(k, o = {}) {
  const lx = o.lx ?? -.7, ly = o.ly ?? -.6, hard = !!o.hard, col = o.col || '#C7BBAA', wall = o.wall || ['#5A5550', '#3B3733'], table = o.table || ['#6B6259', '#3E3832'];
  let g = R(-20, -20, 360, 160, k.lg([[0, wall[0]], [1, wall[1]]])) + R(-20, 140, 360, 80, k.lg([[0, table[0]], [1, table[1]]]));
  if (o.wallGlow) g += o.wallGlow;
  const fx = .5 + lx * .32, fy = .5 + ly * .32;
  const stops = hard ? [[0, '#FFF6EA'], [.32, col], [.52, col], [.6, '#26211C'], [1, '#14110E']] : [[0, '#FFF6EA'], [.3, col], [.8, '#3C342C'], [1, '#221D18']];
  const shx = 160 - lx * 70, shy = 152 + (ly > .5 ? -1 : 0);
  if (!o.noShadow) g += E(shx, shy, 50 + Math.abs(lx) * 40, 9 + (ly < -.8 ? 3 : 0), '#0A0806', `opacity="${hard ? .8 : .55}" ${k.blur(hard ? 1 : 9)}`);
  g += E(160, 151, 30, 4, '#000', `opacity=".6" ${k.blur(2)}`);
  g += C(160, 108, 44, o.fill || k.rg(stops, fx, fy, .78, fx, fy));
  if (o.rim) g += `<circle cx="160" cy="108" r="43" fill="none" stroke="${o.rim}" stroke-width="3" ${k.blur(1.2)} ${k.clip(C(160, 108, 44, '#000'))}/>`;
  if (o.src) { const [sx, sy] = o.src; g += `<g opacity=".95">${C(sx, sy, 8, k.rg([[0, '#FFF3D6', 1], [1, '#FFF3D6', 0]]))}${C(sx, sy, 3.5, '#FFF8EA')}</g>`; }
  return g;
}

/* ---------- portrait (lighting patterns) ---------- */
// light from the left by default; shade = overlay markup in face-local coords (head is 76 x 94, centered on 0,0)
const SK = '#D6A27F';
function face(k, o = {}) {
  const x = o.x ?? 160, y = o.y ?? 98, skin = o.skin || SK, hair = o.hair || '#2E1F16', coat = o.coat || '#3A3F48', s = o.s || 1;
  const hairP = 'M-41 6 C-46 -40 -20 -58 2 -56 C30 -56 46 -38 41 6 C38 -12 34 -26 22 -30 C6 -24 -12 -30 -28 -26 C-36 -16 -39 -6 -41 6Z';
  const shoulders = 'M-110 150 C-104 92 -70 76 -18 64 L18 64 C70 76 104 92 110 150Z';
  const clip = k.clip(`<path d="${shoulders}"/><rect x="-16" y="28" width="32" height="40"/><ellipse rx="38" ry="47"/><ellipse cx="-38" cy="4" rx="6" ry="10"/><ellipse cx="38" cy="4" rx="6" ry="10"/><path d="${hairP}"/>`);
  const cl = o.catch ?? 'dot', cx = o.cdx ?? -.45, cy = o.cdy ?? -.45;
  const eye = ex => `<path d="M${ex - 9} -4 Q${ex} -11 ${ex + 9} -4 Q${ex} 2 ${ex - 9} -4Z" fill="#F4ECE6"/><circle cx="${ex}" cy="-4.4" r="4.2" fill="${o.iris || '#5A3B26'}"/><circle cx="${ex}" cy="-4.4" r="2" fill="#120C08"/>` +
    (cl === 'dot' ? C(ex + cx * 3, -4.4 + cy * 3, 1, '#fff') : cl === 'ring' ? `<circle cx="${ex}" cy="-4.4" r="2.6" fill="none" stroke="#fff" stroke-width=".7"/>` : cl === 'two' ? C(ex - .6, -6.8, .9, '#fff') + C(ex + .4, -1.9, .6, '#fff', 'opacity=".8"') : cl === 'win' ? `<g transform="translate(${ex - 2.4} -7.6)">${R(0, 0, 2.6, 3, '#fff')}<path d="M1.3 0 V3 M0 1.5 H2.6" stroke="#9A8A80" stroke-width=".35"/></g>` : '') +
    `<path d="M${ex - 10} -14 Q${ex} -19 ${ex + 10} -14" stroke="${hair}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="${shoulders}" fill="${coat}"/>
    ${R(-16, 28, 32, 40, skin)}
    ${E(-38, 4, 6, 10, skin)}${E(38, 4, 6, 10, skin)}
    ${E(0, 0, 38, 47, skin)}
    ${eye(-15)}${eye(15)}
    <path d="M-1 -2 L-4 15 Q0 18 5 15" stroke="#8C5038" stroke-opacity=".55" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <path d="M-10 27 Q0 31 10 27 Q0 33.5 -10 27Z" fill="#A65B4A"/>
    <path d="${hairP}" fill="${hair}"/>
    <g ${clip}>${o.shade || ''}</g>
    ${o.over || ''}
  </g>`;
}
// shading helpers in face-local coords
const SH = '#0B0710';
const shadeSide = (k, dir = 1, soft = 10, op = .72, at = 0, c = SH) => R(-200, -200, 400, 400, k.lg(dir > 0 ? [[0, c, 0], [1, c, op]] : [[0, c, op], [1, c, 0]], `${at - soft} 0 ${at + soft} 0`, true));
const shadeV = (k, top = 1, soft = 30, op = .7, at = 0, c = SH) => R(-200, -200, 400, 400, k.lg(top > 0 ? [[0, c, op], [1, c, 0]] : [[0, c, 0], [1, c, op]], `0 ${at - soft} 0 ${at + soft}`, true));
const tint = (k, c, dir = -1, op = .55, soft = 40) => R(-200, -200, 400, 400, k.lg(dir < 0 ? [[0, c, op], [1, c, 0]] : [[0, c, 0], [1, c, op]], `${-soft} 0 ${soft} 0`, true), 'style="mix-blend-mode:screen"');
const noseShadow = (k, d, op = .55, b = 1.2) => Pth(d, SH, `opacity="${op}" ${k.blur(b)}`);

// top-down lighting diagram: lights [{a: degrees (0 = from camera, -90 = from image left, 180 = from behind), kind: 'soft'|'hard'|'ref'|'ring', c, l: label}]
function ldiag(k, lights, o = {}) {
  const bx = o.bx ?? 228, by = o.by ?? 12, w = 82, h = 92, cx = bx + w / 2, cy = by + 40;
  let g = `<rect x="${bx}" y="${by}" width="${w}" height="${h}" rx="8" fill="#0D0C0B" fill-opacity=".72" stroke="#fff" stroke-opacity=".14"/>`;
  g += `<text x="${bx + 7}" y="${by + 11}" font-family="IBM Plex Mono, monospace" font-size="6.5" fill="#fff" fill-opacity=".55" letter-spacing=".6">TOP VIEW</text>`;
  lights.forEach(L => {
    const a = L.a * Math.PI / 180, r = L.r || 28, lx = cx + r * Math.sin(-a) * -1, ly = cy + r * Math.cos(a);
    const px = cx - (cx - lx) * 0, ang = Math.atan2(cy - ly, cx - lx) * 180 / Math.PI;
    const c = L.c || '#FFE2A8';
    g += `<path d="M${lx} ${ly} L${cx + 6 * Math.cos((ang + 90) * Math.PI / 180)} ${cy + 6 * Math.sin((ang + 90) * Math.PI / 180)} L${cx - 6 * Math.cos((ang + 90) * Math.PI / 180)} ${cy - 6 * Math.sin((ang + 90) * Math.PI / 180)}Z" fill="${c}" opacity=".18"/>`;
    g += `<g transform="translate(${lx} ${ly}) rotate(${ang + 90})">` + (L.kind === 'hard' ? C(0, 0, 3.2, c) + `<path d="M0 -6 V-4 M-4.5 -4.5 L-3.2 -3.2 M4.5 -4.5 L3.2 -3.2" stroke="${c}" stroke-width="1"/>` : L.kind === 'ref' ? `<path d="M-8 0 Q0 -3 8 0" stroke="#EDEDED" stroke-width="2" fill="none"/>` : L.kind === 'ring' ? `<circle r="5" fill="none" stroke="${c}" stroke-width="1.8"/>` : R(-8, -2.2, 16, 4.4, c, 'rx="1"')) + '</g>';
    if (L.l) g += `<text x="${lx + (lx < cx ? -2 : 2)}" y="${ly + (ly < cy ? -6 : 11)}" text-anchor="${lx < cx - 4 ? 'end' : lx > cx + 4 ? 'start' : 'middle'}" font-family="IBM Plex Mono, monospace" font-size="6.5" fill="${c}">${L.l}</text>`;
  });
  g += C(cx, cy, 6.5, SK) + Pth(`M${cx - 2} ${cy + 5.5} L${cx} ${cy + 9} L${cx + 2} ${cy + 5.5}Z`, SK);
  g += `<g transform="translate(${cx} ${by + h - 12})">${R(-6, -3, 12, 7, '#9AA0A8', 'rx="1.2"')}${R(-2.5, -6, 5, 3, '#9AA0A8')}</g>`;
  return g;
}

/* ---------- night street (film and city light) ---------- */
function nightStreet(k, o = {}) {
  const lamp = o.lamp || '#FFC27A', sky = o.sky || ['#0B1222', '#1B2740'];
  let g = R(-20, -20, 360, 240, k.lg([[0, sky[0]], [1, sky[1]]]));
  const r = rnd(o.seed || 7);
  // buildings
  [[0, 40, 46], [44, 62, 38], [98, 24, 52], [146, 52, 30], [194, 34, 44], [236, 70, 40], [272, 30, 52]].forEach(([x, y, w]) => {
    g += R(x, y, w, 140, o.bld || '#121826');
    for (let yy = y + 8; yy < 128; yy += 11) for (let xx = x + 5; xx < x + w - 6; xx += 9) if (r() < .45) g += R(xx, yy, 5, 6, r() < .7 ? '#F2B85E' : '#9CC6E8', `opacity="${(.5 + r() * .5).toFixed(2)}"`);
  });
  // street
  g += R(-20, 132, 360, 90, k.lg([[0, o.road || '#1A1E28'], [1, '#07080C']]));
  if (o.signs !== false) {
    const n1 = o.n1 || '#FF3D8B', n2 = o.n2 || '#34E0E8';
    g += `<g ${k.blur(3)} opacity=".9">${R(108, 70, 34, 12, n1, 'rx="3"')}${R(214, 82, 12, 34, n2, 'rx="3"')}</g>` + R(110, 72, 30, 8, '#FFE2EF', 'rx="2"') + R(216, 84, 8, 30, '#E2FFFF', 'rx="2"');
    if (o.wet) g += `<g opacity=".5" ${k.blur('2 6')}>${R(110, 150, 30, 26, n1)}${R(216, 140, 8, 50, n2)}</g>`;
  }
  // lamps
  [[40, 64], [170, 58], [300, 66]].forEach(([x, y]) => {
    g += R(x - 1, y, 2, 72, '#05060A') + C(x, y, 22, k.rg([[0, lamp, .55], [1, lamp, 0]])) + C(x, y, 3.2, '#FFF4DE');
    if (o.halation) g += C(x, y, 9, o.halation, `opacity=".75" ${k.blur(3)}`);
    if (o.wet) g += E(x, 150 + (72 - y) * .3, 5, 20, lamp, `opacity=".45" ${k.blur('1.5 5')}`);
  });
  if (o.extra) g += o.extra;
  return g;
}

/* ---------- summer lake (the reference scene for film and grades) ---------- */
function lake(k, o = {}) {
  let g = land(k, {
    hz: 112, sky: ['#3F7FCB', '#86B6E3', '#DDE9EE'], mtn: '#6E8FA6', mtnY: 8, hill: '#41704A', water: true, waterC: ['#8FB4CC', '#4E82AA', '#2C5A82'],
    clouds: `<g fill="#fff" opacity=".92">${E(70, 38, 30, 9, '#fff')}${E(90, 32, 18, 9, '#fff')}${E(240, 52, 26, 7, '#fff')}${E(256, 47, 14, 7, '#fff')}</g>`
  });
  // trees on the left bank
  g += Pth('M-20 112 L-20 60 Q10 40 30 64 Q46 50 60 74 Q78 80 74 112Z', '#2E6B34') + Pth('M-20 112 L-20 82 Q14 70 40 90 Q58 92 64 112Z', '#3C8A3E');
  // red canoe
  g += Pth('M150 142 Q186 152 222 142 Q216 150 186 151 Q156 150 150 142Z', '#C8322B') + R(184, 132, 1.2, 12, '#3A2A1C', 'transform="rotate(30 184 138)"');
  // dock and person in a yellow jacket
  g += Pth('M228 200 L262 128 L272 128 L320 200Z', '#8A5E3A') + Array.from({ length: 6 }, (_, i) => R(232 + i * 2, 196 - i * 13, 70 - i * 9, 1, '#5E3D24')).join('');
  g += `<g transform="translate(266 128)">${R(-3.4, -6, 2.6, 8, '#2D3540')}${R(.6, -6, 2.6, 8, '#2D3540')}<path d="M-6 -22 Q0 -24 6 -22 L5 -6 L-5 -6Z" fill="#F2B632"/>${C(0, -27, 4, SK)}${Pth('M-4 -28 Q0 -33 4 -28 Q2 -30 0 -30 Q-2 -30 -4 -28Z', '#3A2618')}</g>`;
  return g;
}

/* ---------- color science for film stocks and grades ---------- */
const sat = v => `<feColorMatrix type="saturate" values="${v}"/>`;
const mat = rows => `<feColorMatrix type="matrix" values="${rows}"/>`;
const curve = (r, gg = r, b = r) => `<feComponentTransfer><feFuncR type="table" tableValues="${r}"/><feFuncG type="table" tableValues="${gg}"/><feFuncB type="table" tableValues="${b}"/></feComponentTransfer>`;
const lin = (slope, icpt) => `<feComponentTransfer><feFuncR type="linear" slope="${slope}" intercept="${icpt}"/><feFuncG type="linear" slope="${slope}" intercept="${icpt}"/><feFuncB type="linear" slope="${slope}" intercept="${icpt}"/></feComponentTransfer>`;
const BW = (r = .3, g = .59, b = .11) => mat(`${r} ${g} ${b} 0 0 ${r} ${g} ${b} 0 0 ${r} ${g} ${b} 0 0 0 0 0 1 0`);
const LOOK = {
  portra: sat(.72) + mat('1.02 .05 0 0 .05  .02 .96 .02 0 .04  0 .04 .84 0 .06  0 0 0 1 0') + lin(.86, .08),
  ektar: sat(1.5) + lin(1.15, -.07),
  gold: sat(1.2) + mat('1.04 .06 0 0 .07  0 1 0 0 .05  0 0 .78 0 -.03  0 0 0 1 0'),
  kodachrome: sat(1.3) + mat('1.1 .02 0 0 .02  0 .98 0 0 0  0 .06 .94 0 -.03  0 0 0 1 0') + lin(1.3, -.14),
  velvia: sat(2.1) + mat('1 0 .08 0 0  0 1.06 0 0 -.02  .04 0 1.1 0 0  0 0 0 1 0') + lin(1.2, -.12),
  superia: sat(1.1) + mat('.9 .02 0 0 -.01  0 1.06 .04 0 .04  0 .08 .98 0 .03  0 0 0 1 0') + lin(1.04, -.01),
  aerochrome: mat('.1 1.05 -.3 0 .02  .1 .1 .25 0 0  0 0 1 0 0  0 0 0 1 0') + sat(1.35),
  lomopurple: mat('.55 .5 0 0 0  .2 .05 .6 0 0  .1 .75 .45 0 0  0 0 0 1 0') + sat(1.2),
  trix: BW() + lin(1.45, -.22),
  panf: BW() + lin(1.08, -.03),
  irbw: mat('.15 1.35 -.6 0 0  .15 1.35 -.6 0 0  .15 1.35 -.6 0 0  0 0 0 1 0') + lin(1.45, -.04),
  tealorange: curve('0 .14 .55 .92 1', '.04 .3 .58 .86 .97', '.14 .36 .5 .62 .74') + sat(1.2),
  bleach: sat(.35) + lin(1.35, -.14),
  matte: sat(.8) + lin(.78, .14),
  splittone: curve('.04 .26 .58 .9 1', '.06 .3 .56 .84 .95', '.18 .38 .52 .66 .8') + sat(.75),
  sepia: mat('.393 .769 .189 0 0  .349 .686 .168 0 0  .272 .534 .131 0 0  0 0 0 1 0') + lin(1, 0),
  pastel: sat(.6) + mat('1 0 .04 0 .08  0 1 0 0 .06  .02 0 1 0 .09  0 0 0 1 0') + lin(.8, .1),
  vivid: sat(1.75) + lin(1.1, -.04),
  cross: curve('0 .3 .72 1 1', '.02 .36 .78 1 1', '.24 .32 .4 .46 .52') + lin(1.1, -.04),
  expired: sat(.65) + mat('1 .1 0 0 .08  0 .9 .04 0 .04  .04 0 .9 0 .08  0 0 0 1 0') + lin(.82, .08),
  polaroid: sat(.75) + curve('.08 .32 .62 .9 .98', '.12 .36 .6 .86 .94', '.12 .34 .56 .8 .88'),
  digicam: sat(1.05) + mat('.92 0 0 0 0  0 .98 0 0 .01  0 .02 1.08 0 .03  0 0 0 1 0') + lin(1.12, -.02),
  super8: sat(.85) + mat('1.04 .06 0 0 .06  0 .96 0 0 .04  0 0 .78 0 .02  0 0 0 1 0') + lin(.86, .06),
  cinestill: mat('.86 0 0 0 0  0 .96 0 0 .02  0 .06 1.18 0 .04  0 0 0 1 0'),
  cyan: mat('.15 .2 .05 0 .02  .25 .45 .1 0 .18  .35 .5 .25 0 .42  0 0 0 1 0') + lin(1.2, -.06)
};
const graded = (k, look, inner) => `<g ${k.filter(LOOK[look])}>${inner}</g>`;
// 35mm film rebate: sprocket holes and orange edge print
function rebate(text, frame = '24', c = '#E8862B') {
  let g = R(-20, -20, 360, 36, '#0A0907') + R(-20, 178, 360, 42, '#0A0907');
  for (let x = 4; x < 320; x += 16) g += R(x, 4, 8, 7, '#E9E4DA', 'rx="1.2"') + R(x, 189, 8, 7, '#E9E4DA', 'rx="1.2"');
  g += `<text x="12" y="185.5" font-family="IBM Plex Mono, monospace" font-size="6" fill="${c}" letter-spacing="1">${text}</text><text x="236" y="185.5" font-family="IBM Plex Mono, monospace" font-size="6" fill="${c}">▸ ${frame}   ▸ ${frame}A</text>`;
  return g;
}
/* ===== Framing & angles ===== */
// one person standing in a field, drawn in world coordinates; each shot size is a different crop (viewBox) of it
function world(k, o = {}) {
  const skin = SK, hair = '#3A2618';
  const eye = ex => `<path d="M${ex - 2.4} 48 Q${ex} 46.3 ${ex + 2.4} 48 Q${ex} 49.5 ${ex - 2.4} 48Z" fill="#F4ECE6"/>${C(ex, 47.9, 1.05, '#4A3526')}${C(ex, 47.9, .5, '#111')}${C(ex - .35, 47.55, .26, '#fff')}<path d="M${ex - 2.6} 45.2 Q${ex} 44 ${ex + 2.6} 45.1" stroke="${hair}" stroke-width=".7" fill="none" stroke-linecap="round"/>`;
  let g = R(-900, -900, 2000, 948, k.lg([[0, '#3F6FAE'], [.75, '#7DA6D0'], [1, '#E9DCC4']], '0 -40 0 48', true));
  g += Pth('M-900 48 L-900 40 Q-500 30 -200 41 Q0 33 160 42 Q340 34 520 41 Q800 31 1100 40 L1100 48Z', '#8EA2A6');
  g += R(-900, 48, 2000, 900, k.lg([[0, '#A9A06E'], [.25, '#8A8150'], [1, '#5E5733']]));
  if (o.trees !== false) g += tree(-80, 50, 40, '#4E6B48', '#3A2A1C') + tree(400, 50, 46, '#4E6B48', '#3A2A1C') + tree(470, 49, 30, '#5C7A52', '#3A2A1C') + pine(-150, 49, 30, '#3F5A40');
  const P = (x, flip = 1, coat = '#2F4A55', scarf = '#D69A2D') => `<g transform="translate(${x} 0) scale(${flip} 1) translate(-160 0)">
    ${E(160, 189, 30, 3.5, '#000', 'opacity=".25"')}
    <path d="M139 124 L159 124 L157 186 L147 186Z" fill="#2A2B30"/><path d="M161 124 L181 124 L173 186 L163 186Z" fill="#2A2B30"/>
    ${E(151, 187, 7, 3, '#1A1612')}${E(169, 187, 7, 3, '#1A1612')}
    <path d="M139 69 Q132 72 131 86 L129 120 Q132 123 135 120 L139 88Z" fill="${coat}"/><path d="M181 69 Q188 72 189 86 L191 120 Q188 123 185 120 L181 88Z" fill="${coat}"/>
    ${C(132, 122, 3, skin)}${C(188, 122, 3, skin)}
    <path d="M138 70 Q160 63 182 70 L186 130 L134 130Z" fill="${coat}"/>
    <path d="M160 68 L160 130" stroke="#1E323B" stroke-width=".8"/>${C(162.5, 84, .9, '#1E323B')}${C(162.5, 98, .9, '#1E323B')}${C(162.5, 112, .9, '#1E323B')}
    ${R(155.5, 58, 9, 9, skin)}
    <path d="M151 63 Q160 69 169 63 L170 70 Q160 75 150 70Z" fill="${scarf}"/>
    ${E(149.7, 49, 1.8, 3, skin)}${E(170.3, 49, 1.8, 3, skin)}
    ${E(160, 48, 10.5, 13, skin)}
    ${eye(155.8)}${eye(164.2)}
    <path d="M160 48.5 L158.9 53.6 Q160 54.5 161.4 53.7" stroke="#8C5038" stroke-opacity=".55" stroke-width=".45" fill="none"/>
    <path d="M157 57 Q160 58.3 163 57" stroke="#9A4A3A" stroke-width=".7" fill="none" stroke-linecap="round"/>
    <path d="M149.5 47 C148.5 34 155 32.5 160 33 C166 32.5 171.5 35.5 170.5 47 C169.5 40 165 38.5 160 39.5 C155 38.5 151 41 149.5 47Z" fill="${hair}"/>
  </g>`;
  if (o.two) g += P(118, 1) + P(204, -1, '#6B3B2E', '#3E6C8C');
  else g += P(o.x ?? 160);
  return g;
}
const crop = (cx, cy, h) => `${(cx - h * .8).toFixed(1)} ${(cy - h / 2).toFixed(1)} ${(h * 1.6).toFixed(1)} ${h}`;
const shotEx = (vb, t, o) => pic(k => world(k, o), vb, tag(t, 'tl'));
const letterbox = () => R(-20, -20, 360, 44, '#000') + R(-20, 176, 360, 44, '#000');
const facade = (k, x, y, w, h, c, win, cols = 5, rows = 4) => { let g = R(x, y, w, h, c); const cw = w / cols, rh = h / rows; for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) g += R(x + i * cw + cw * .25, y + j * rh + rh * .22, cw * .5, rh * .56, win); return g; };

/* ======================================================
   FILM ADDITIONS: actors, busts, floor plans, storyboard
   strips, aspect-ratio gates and a few recurring sets.
   ====================================================== */
const CAMC = '#FF4D5E';
const txt = (x, y, t, o = {}) => `<text x="${x}" y="${y}" font-family="Courier Prime, Courier New, monospace" font-size="${o.size || 8}" font-weight="${o.w || 700}" fill="${o.c || '#F4EFE8'}"${o.anchor ? ` text-anchor="${o.anchor}"` : ''}${o.op ? ` fill-opacity="${o.op}"` : ''} letter-spacing="${o.ls ?? .4}">${t}</text>`;
const arrowHead = (k, c = '#F4EFE8') => { const id = k.id('ah'); k.def(`<marker id="${id}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10Z" fill="${c}"/></marker>`); return `marker-end="url(#${id})"`; };
const arrow = (k, d, c = '#F4EFE8', w = 1.6, x2 = '') => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" ${arrowHead(k, c)} ${x2}/>`;

// the two recurring characters, so coverage cards read as one scene
const A = { coat: '#8C3B2E', hair: '#2A1A12', skin: '#E0AE8C' };
const B = { coat: '#2F4A63', hair: '#15100D', skin: '#8E5C40' };

/* ---------- standing actor: feet at (x, y), height h. d: -1 faces screen left, 1 faces right; back: seen from behind ---------- */
const ARM = 'M-12 -75 Q-16.5 -73 -16.5 -62 L-17.5 -44 Q-15.5 -42 -13.5 -44 L-11.5 -60Z';
function actor(x, y, h, o = {}) {
  const s = h / 100, skin = o.skin || SK, hair = o.hair || '#2A1C14', coat = o.coat || '#2F4A55', pants = o.pants || '#25262B', d = o.d ?? 0, back = !!o.back;
  const fx = d * 3;
  let g = `<g transform="translate(${x} ${y}) scale(${o.flip ? -s : s} ${s})"${o.x2 ? ' ' + o.x2 : ''}>`;
  if (o.shadow !== false) g += E(0, 0, 18, 2.4, '#000', 'opacity=".3"');
  if (o.walk) g += Pth('M-8 -44 L-1 -44 L-9 -1 L-16 -1Z', pants) + Pth('M1 -44 L8 -44 L14 -1 L7 -1Z', pants) + E(-12, -.8, 4.5, 1.8, '#141110') + E(11, -.8, 4.5, 1.8, '#141110');
  else g += Pth('M-9 -44 L-1 -44 L-2 -1 L-8 -1Z', pants) + Pth('M1 -44 L9 -44 L8 -1 L2 -1Z', pants) + E(-5, -.8, 4.5, 1.8, '#141110') + E(5, -.8, 4.5, 1.8, '#141110');
  const armL = o.arms === 'up' ? 'M-11 -74 Q-18 -80 -22 -96 L-19 -98 Q-14 -86 -9 -78Z' : o.arms === 'out' ? 'M-11 -75 L-34 -70 L-34 -66 L-12 -66Z' : ARM;
  const armR = o.arms === 'up' ? 'M11 -74 Q18 -80 22 -96 L19 -98 Q14 -86 9 -78Z' : o.arms === 'outR' ? 'M11 -75 L34 -70 L34 -66 L12 -66Z' : ARM.replace(/(-?\d+\.?\d*) (-?\d+\.?\d*)/g, (m, a, b) => `${-a} ${b}`);
  g += Pth(armL, coat) + Pth(armR, coat);
  const hand = p => o.arms === 'up' ? (p < 0 ? C(-21, -98, 2.2, skin) : C(21, -98, 2.2, skin)) : null;
  g += (o.arms === 'up' ? hand(-1) + hand(1) : (o.arms === 'out' ? C(-35, -68, 2.2, skin) + C(15.5, -43, 2, skin) : o.arms === 'outR' ? C(35, -68, 2.2, skin) + C(-15.5, -43, 2, skin) : C(-15.5, -43, 2, skin) + C(15.5, -43, 2, skin)));
  g += Pth('M-12 -77 Q0 -81 12 -77 L14.5 -40 L-14.5 -40Z', coat);
  if (o.tie) g += Pth('M-1 -77 L1 -77 L1.6 -58 L0 -55 L-1.6 -58Z', o.tie);
  g += R(-2.6, -83, 5.2, 7, skin);
  if (back) g += E(0, -89, 6.4, 7.8, hair);
  else {
    g += E(0, -89, 6.2, 7.6, skin);
    if (d > -.75) g += C(fx - 2.3, -89.4, .8, '#1A1210');
    if (d < .75) g += C(fx + 2.3, -89.4, .8, '#1A1210');
    g += Pth(`M-6.5 -89 C-7 -96 -3 -97.6 0 -97.5 C3.5 -97.7 7 -95.8 6.5 -89 C5.6 -93 ${2 - d * 2} -93.8 ${-d * 2} -93.4 C-2 -93.6 -5.6 -93 -6.5 -89Z`, hair);
    if (o.long) g += Pth('M-6.5 -90 Q-8.5 -80 -6 -76 L-4 -84Z M6.5 -90 Q8.5 -80 6 -76 L4 -84Z', hair);
  }
  if (o.hat) g += E(0, -96.5, 11, 2.2, o.hat) + Pth('M-6.5 -96 Q-6 -104 0 -104 Q6 -104 6.5 -96Z', o.hat);
  return g + '</g>';
}

/* ---------- head and shoulders: head center (x, y), scale s. d: -1 turned to screen left, 1 to screen right; back: back of the head ---------- */
function bust(k, o = {}) {
  const x = o.x ?? 160, y = o.y ?? 98, s = o.s || 1, skin = o.skin || SK, hair = o.hair || '#2E1F16', coat = o.coat || '#3A3F48', d = o.d ?? 0;
  const shoulders = 'M-110 150 C-104 92 -70 76 -18 64 L18 64 C70 76 104 92 110 150Z';
  const fx = d * 14, hx = -d * 5;
  const hairP = 'M-41 6 C-46 -40 -20 -58 2 -56 C30 -56 46 -38 41 6 C38 -12 34 -26 22 -30 C6 -24 -12 -30 -28 -26 C-36 -16 -39 -6 -41 6Z';
  let g = `<g transform="translate(${x} ${y}) scale(${s})"><path d="${shoulders}" fill="${coat}"/>`;
  if (o.collar) g += Pth('M-18 62 L0 84 L18 62 L12 60 L0 74 L-12 60Z', o.collar);
  g += R(-16, 28, 32, 38, skin);
  if (o.back) {
    g += E(-37, 4, 6, 10, skin) + E(37, 4, 6, 10, skin) + E(0, 0, 39, 48, hair) + Pth('M-26 34 Q0 46 26 34 L18 56 Q0 62 -18 56Z', hair);
    if (o.long) g += Pth('M-40 0 Q-46 50 -30 76 L30 76 Q46 50 40 0Z', hair);
  } else {
    if (o.long) g += Pth('M-40 -10 Q-50 50 -36 80 L36 80 Q50 50 40 -10Z', hair);
    if (d > -.3) g += E(-38 + Math.max(0, d) * 10, 4, 6, 10, skin);
    if (d < .3) g += E(38 + Math.min(0, d) * 10, 4, 6, 10, skin);
    g += E(0, 0, 38, 47, skin);
    const gz = o.gaze ?? d * 2.6, gy = o.gazeY ?? 0;
    const eye = (ex, w) => `<g transform="translate(${ex} 0) scale(${w} 1)"><path d="M-9 -4 Q0 -11 9 -4 Q0 2 -9 -4Z" fill="#F4ECE6"/><circle cx="${gz / w}" cy="${-4.4 + gy}" r="4.2" fill="${o.iris || '#4A3020'}"/><circle cx="${gz / w}" cy="${-4.4 + gy}" r="2" fill="#120C08"/><circle cx="${gz / w - 1.2}" cy="${-5.8 + gy}" r=".9" fill="#fff"/></g><path d="M${ex - 10 * w} ${o.brow === 'up' ? -17 : -14} Q${ex} ${o.brow === 'up' ? -22 : o.brow === 'down' ? -14 : -19} ${ex + 10 * w} ${o.brow === 'down' ? -11 : -14}" stroke="${hair}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    const wl = 1 - Math.max(0, -d) * .35, wr = 1 - Math.max(0, d) * .35;
    if (o.closed) g += `<path d="M${fx - 24} -4 Q${fx - 15} 0 ${fx - 6} -4 M${fx + 6} -4 Q${fx + 15} 0 ${fx + 24} -4" stroke="#5A3020" stroke-width="1.6" fill="none"/>`;
    else g += eye(fx - 15 + d * 2, wl) + eye(fx + 15 + d * 2, wr);
    g += `<path d="M${fx} -2 L${fx + d * 7 - 4} 15 Q${fx + d * 5} 18.5 ${fx + d * 3 + 5} 15" stroke="#7A4030" stroke-opacity=".55" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
    const mx = fx + d * 3, m = o.mouth || 'n';
    g += m === 'open' ? E(mx, 29, 8, 9, '#3A1414') + Pth(`M${mx - 7} 25 Q${mx} 22 ${mx + 7} 25`, 'none', 'stroke="#A65B4A" stroke-width="2"')
      : m === 'smile' ? `<path d="M${mx - 12} 25 Q${mx} 35 ${mx + 12} 25 Q${mx} 31 ${mx - 12} 25Z" fill="#A65B4A"/><path d="M${mx - 10} 26.5 Q${mx} 31 ${mx + 10} 26.5" stroke="#F4ECE6" stroke-width="1.6" fill="none"/>`
      : m === 'grin' ? `<path d="M${mx - 14} 23 Q${mx} 38 ${mx + 14} 23Z" fill="#3A1414"/><path d="M${mx - 13} 23.5 L${mx + 13} 23.5 L${mx + 11} 27 L${mx - 11} 27Z" fill="#F4ECE6"/>`
      : m === 'frown' ? `<path d="M${mx - 10} 30 Q${mx} 24 ${mx + 10} 30" stroke="#A65B4A" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
      : `<path d="M${mx - 10} 27 Q${mx} 31 ${mx + 10} 27 Q${mx} 33.5 ${mx - 10} 27Z" fill="#A65B4A"/>`;
    g += `<path d="${hairP}" fill="${hair}" transform="translate(${hx} 0)"/>`;
  }
  if (o.hat) g += E(0, -40, 62, 9, o.hat) + Pth('M-36 -40 Q-36 -82 0 -82 Q36 -82 36 -40Z', o.hat) + R(-36, -50, 72, 7, '#000', 'opacity=".35"');
  if (o.shade) g += `<g ${k.clip(`<path d="${shoulders}"/><rect x="-16" y="28" width="32" height="40"/><ellipse rx="40" ry="49"/><ellipse cx="-38" cy="4" rx="7" ry="11"/><ellipse cx="38" cy="4" rx="7" ry="11"/>`)}>${o.shade}</g>`;
  if (o.over) g += o.over;
  return g + '</g>';
}

/* ---------- floor plan seen from above. actors [{x,y,a,c,l}], cams [{x,y,a,fov,len,l,c,ok}], a in degrees: 0 = facing right, 90 = down ---------- */
const rad = a => a * Math.PI / 180;
function plan(k, o = {}) {
  let g = R(-20, -20, 360, 240, o.bg || '#1B2128');
  for (let x = 0; x <= 320; x += 20) g += R(x, -20, .5, 240, '#fff', 'opacity=".05"');
  for (let y = 0; y <= 200; y += 20) g += R(-20, y, 360, .5, '#fff', 'opacity=".05"');
  if (o.set) g += o.set;
  if (o.zone) g += `<path d="${o.zone}" fill="${o.zoneC || '#5BD0B4'}" opacity=".12"/>`;
  if (o.line) { const [x1, y1, x2, y2] = o.line; g += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#F2C14E" stroke-width="1.6" stroke-dasharray="6 4"/>`; if (o.lineL !== '') g += txt(o.lineLX ?? x2 - 4, o.lineLY ?? y2 - 6, o.lineL || '180° LINE', { size: 7, c: '#F2C14E', anchor: 'end' }); }
  (o.cams || []).forEach(c => {
    const a = rad(c.a), f = rad((c.fov || 40) / 2), L = c.len || 70, col = c.c || CAMC;
    g += `<path d="M${c.x} ${c.y} L${c.x + L * Math.cos(a - f)} ${c.y + L * Math.sin(a - f)} L${c.x + L * Math.cos(a + f)} ${c.y + L * Math.sin(a + f)}Z" fill="${col}" opacity="${c.ok === false ? .1 : .16}"/>`;
    g += `<g transform="translate(${c.x} ${c.y}) rotate(${c.a})">${R(-9, -5.5, 12, 11, col, 'rx="1.5"')}${Pth('M3 -3.5 L9 -6 L9 6 L3 3.5Z', col)}</g>`;
    if (c.ok === false) g += `<path d="M${c.x - 8} ${c.y - 8} L${c.x + 8} ${c.y + 8} M${c.x + 8} ${c.y - 8} L${c.x - 8} ${c.y + 8}" stroke="#fff" stroke-width="2.2"/>`;
    if (c.l) g += txt(c.lx ?? c.x, c.ly ?? c.y + 19, c.l, { size: 7.5, c: col, anchor: 'middle' });
  });
  (o.actors || []).forEach(p => {
    const a = rad(p.a ?? -90), c = p.c || '#E9E2D6';
    g += Pth(`M${p.x + 13 * Math.cos(a)} ${p.y + 13 * Math.sin(a)} L${p.x + 7 * Math.cos(a + 1.1)} ${p.y + 7 * Math.sin(a + 1.1)} L${p.x + 7 * Math.cos(a - 1.1)} ${p.y + 7 * Math.sin(a - 1.1)}Z`, c);
    g += C(p.x, p.y, 8.5, c) + C(p.x, p.y, 8.5, 'none', 'stroke="#000" stroke-opacity=".35" stroke-width="1"');
    if (p.l) g += txt(p.x, p.y + 3, p.l, { size: 8, c: '#111', anchor: 'middle' });
    if (p.look) g += `<line x1="${p.x + 13 * Math.cos(a)}" y1="${p.y + 13 * Math.sin(a)}" x2="${p.x + p.look * Math.cos(a)}" y2="${p.y + p.look * Math.sin(a)}" stroke="${c}" stroke-width="1" stroke-dasharray="2 2" opacity=".7"/>`;
  });
  (o.arrows || []).forEach(d => g += arrow(k, d.d || d, d.c || '#E9E2D6', d.w || 1.6, d.dash ? 'stroke-dasharray="4 3"' : ''));
  if (o.extra) g += o.extra;
  if (o.label !== false) g += txt(8, 14, o.label || 'FLOOR PLAN', { size: 7, c: '#fff', op: .5, ls: 1 });
  return g;
}
// floor plan as an inset box in a corner of a frame
const planInset = (k, o, bx = 222, by = 118, w = 90, h = 74) => `<g><rect x="${bx - 1}" y="${by - 1}" width="${w + 2}" height="${h + 2}" rx="5" fill="#000" fill-opacity=".5"/><svg x="${bx}" y="${by}" width="${w}" height="${h}" viewBox="${o.vb || '0 0 320 260'}" preserveAspectRatio="xMidYMid slice">${plan(k, { label: false, ...o })}</svg><rect x="${bx}" y="${by}" width="${w}" height="${h}" rx="4" fill="none" stroke="#fff" stroke-opacity=".25"/></g>`;

/* ---------- storyboard strip: panels [{d: k => scene markup on the 320 x 200 stage, vb, cap, t}], t = transition INTO the panel ---------- */
function board(k, panels, o = {}) {
  const n = panels.length, cols = o.cols || (n <= 3 ? n : n === 4 ? 2 : 3), rows = Math.ceil(n / cols);
  const gap = o.gap ?? (cols === 2 ? 12 : 9), pad = o.pad ?? (cols === 1 ? 40 : 10), capH = 12;
  let w = (320 - pad * 2 - gap * (cols - 1)) / cols, h = w / (o.ratio || 1.6);
  const maxH = (200 - 10 - (rows - 1) * (gap - 4) - rows * capH) / rows;
  if (h > maxH) { h = maxH; w = h * (o.ratio || 1.6); }
  const totalW = cols * w + (cols - 1) * gap, left = (320 - totalW) / 2;
  const totalH = rows * (h + capH) + (rows - 1) * (gap - 4), top = (200 - totalH) / 2 + 1;
  let g = R(-20, -20, 360, 240, o.bg || '#161314');
  panels.forEach((p, i) => {
    const c = i % cols, r = Math.floor(i / cols), x = left + c * (w + gap), y = top + r * (h + capH + gap - 4);
    g += `<svg x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" viewBox="${p.vb || '0 0 320 200'}" preserveAspectRatio="xMidYMid slice">${p.d(k)}</svg>`;
    g += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="none" stroke="#F4EFE8" stroke-opacity=".55" stroke-width=".8"/>`;
    const cap = (p.t ? `<tspan fill="${o.tc || '#FF8A9A'}">${p.t}</tspan> ` : '') + (p.cap || '');
    g += txt(x + 1, y + h + 9, `${o.nums === false ? '' : (i + 1) + ' '}${cap}`, { size: cols >= 3 ? 6.6 : 7.4, c: '#D9CFD0' });
    if (c < cols - 1 && i < n - 1 && o.arrows !== false) g += Pth(`M${x + w + gap / 2 - 2} ${y + h / 2 - 3.5} L${x + w + gap / 2 + 2.5} ${y + h / 2} L${x + w + gap / 2 - 2} ${y + h / 2 + 3.5}Z`, '#F4EFE8', 'opacity=".55"');
  });
  if (o.extra) g += o.extra;
  return g;
}

/* ---------- aspect-ratio gate: black bars cut the 16:10 stage down to ratio r ---------- */
function gate(r, o = {}) {
  let g = '';
  if (r > 1.6) { const h = 320 / r, y = (200 - h) / 2; g += R(-20, -20, 360, y + 20, '#000') + R(-20, y + h, 360, 220 - y - h, '#000'); if (o.line !== false) g += `<rect x="0.5" y="${y}" width="319" height="${h}" fill="none" stroke="#fff" stroke-opacity=".28" stroke-dasharray="3 3"/>`; }
  else if (r < 1.6) { const w = 200 * r, x = (320 - w) / 2; g += R(-20, -20, x + 20, 240, '#000') + R(x + w, -20, 340 - x - w, 240, '#000'); if (o.line !== false) g += `<rect x="${x}" y="0.5" width="${w}" height="199" fill="none" stroke="#fff" stroke-opacity=".28" stroke-dasharray="3 3"/>`; }
  return g;
}

/* ---------- recurring sets ---------- */
// late-night diner: wall, window with a neon sign, booth; view 'side' sees the window wall, 'front' the back wall
function diner(k, o = {}) {
  const v = o.view || 'side';
  let g = R(-20, -20, 360, 240, k.lg([[0, '#1F3B3A'], [1, '#14262A']]));
  if (v === 'side') {
    g += R(20, 14, 280, 92, '#0A1220') + R(20, 14, 280, 92, k.lg([[0, '#13223C'], [1, '#2A2032']]));
    g += `<g ${k.blur(3)}>${R(200, 30, 70, 16, '#FF3D8B', 'rx="4"')}</g>` + R(204, 33, 62, 10, '#FFD0E4', 'rx="3"');
    g += R(60, 64, 30, 30, '#F2B85E', `opacity=".5" ${k.blur(1.5)}`) + R(110, 72, 18, 22, '#9CC6E8', `opacity=".35" ${k.blur(1)}`);
    for (let x = 20; x <= 300; x += 70) g += R(x - 2, 12, 4, 96, '#B9C4C4');
    g += R(18, 104, 284, 5, '#B9C4C4');
  } else {
    g += R(-20, 30, 360, 6, '#B9C4C4', 'opacity=".5"') + R(-20, 100, 360, 120, '#7A2E2E') + R(-20, 98, 360, 4, '#B9C4C4');
    g += R(120, -20, 80, 40, k.rg([[0, '#FFE2A8', .5], [1, '#FFE2A8', 0]]));
    if (o.clock !== false) g += C(250, 52, 13, '#E9E4DA') + `<path d="M250 52 L250 44 M250 52 L256 55" stroke="#222" stroke-width="1.6"/>`;
  }
  g += C(160, 0, 8, '#FFE9B8') + C(160, 0, 50, k.rg([[0, '#FFE2A8', .35], [1, '#FFE2A8', 0]]));
  return g;
}
const dinerTable = (k, y = 168) => R(-20, y, 360, 240 - y, k.lg([[0, '#D9D3C6'], [.15, '#B9B2A4'], [1, '#6A645A']])) + E(118, y + 10, 16, 4, '#F4EFE8') + R(108, y - 8, 14, 16, '#F4EFE8', 'rx="2"') + E(210, y + 12, 14, 4, '#F4EFE8') + R(200, y - 6, 12, 14, '#E9E2D6', 'rx="2"');

// long corridor in one-point perspective: vanishing point (vx, vy)
function corridor(k, o = {}) {
  const vx = o.vx ?? 160, vy = o.vy ?? 92, wall = o.wall || '#C9B48A', floor = o.floor || '#7A3B2A', ceil = o.ceil || '#E9E0CC', dw = o.dw ?? 34, dh = o.dh ?? 46;
  let g = Pth(`M-20 -20 L340 -20 L${vx + dw} ${vy - dh} L${vx - dw} ${vy - dh}Z`, ceil) + Pth(`M-20 220 L340 220 L${vx + dw} ${vy + dh} L${vx - dw} ${vy + dh}Z`, floor);
  g += Pth(`M-20 -20 L${vx - dw} ${vy - dh} L${vx - dw} ${vy + dh} L-20 220Z`, wall) + Pth(`M340 -20 L${vx + dw} ${vy - dh} L${vx + dw} ${vy + dh} L340 220Z`, o.wall2 || wall);
  g += R(vx - dw, vy - dh, dw * 2, dh * 2, o.end || '#3A2A20');
  if (o.rug) g += Pth(`M60 220 L260 220 L${vx + dw * .6} ${vy + dh} L${vx - dw * .6} ${vy + dh}Z`, o.rug);
  if (o.lights !== false) for (let i = 0; i < 4; i++) { const t = .2 + i * .22, y = -20 + (vy - dh + 20) * t, x1 = -20 + (vx - dw + 20) * t, x2 = 340 - (340 - vx - dw) * t; g += E((x1 + x2) / 2, y + 4, (x2 - x1) * .08, 2.5 * (1 - t * .6), '#FFF6DA'); }
  g += `<rect x="-20" y="-20" width="360" height="240" fill="${k.rg([[.3, '#000', 0], [1, '#000', .35]], vx / 320, vy / 200, .8)}"/>`;
  return g;
}
// open landscape with a road to the horizon
function road(k, o = {}) {
  const hz = o.hz ?? 110;
  return land(k, { hz, sky: o.sky || ['#3F78C0', '#A6C8E6', '#F1E2C2'], ground: o.ground || '#8A7448', ground2: o.ground2 || '#C2A56A', mtn: o.mtn ?? '#9AA4B0', extra: Pth(`M${o.vx ?? 160} ${hz} L${(o.vx ?? 160) + 2} ${hz} L240 220 L80 220Z`, '#3A3A3E') + Pth(`M${o.vx ?? 160 + .7} ${hz} L${(o.vx ?? 160) + 1.3} ${hz} L162 220 L158 220Z`, '#F2D27A', 'stroke-dasharray="6 6"') + (o.extra || ''), sun: o.sun, fog: o.fog });
}
// city skyline at dusk or night
function skyline(k, o = {}) {
  const r = rnd(o.seed || 11), base = o.base ?? 150;
  let g = R(-20, -20, 360, 240, k.lg(o.sky || [[0, '#1A1E3A'], [.7, '#6A4A6E'], [1, '#F29A6A']]));
  let x = -10; while (x < 330) { const w = 18 + r() * 26, h = 30 + r() * (o.tall || 90); g += R(x, base - h, w, h + 60, o.bld || '#141629'); if (o.lit !== false) for (let yy = base - h + 6; yy < base - 4; yy += 8) for (let xx = x + 4; xx < x + w - 4; xx += 6) if (r() < .3) g += R(xx, yy, 2.6, 3.4, r() < .8 ? '#FFC873' : '#A8D4FF', 'opacity=".85"'); x += w + 2; }
  return g + R(-20, base, 360, 80, o.ground || '#0B0C16');
}
// a lit doorway or window in a dark wall
const doorway = (k, x, y, w, h, light = '#FFE2A8', wall = '#120E0C') => R(-20, -20, 360, 240, wall) + R(x, y, w, h, light) + Pth(`M${x} ${y + h} L${x + w} ${y + h} L${x + w + 60} 220 L${x - 60} 220Z`, light, `opacity=".25" ${k.blur(3)}`);
const stars = (n = 60, seed = 5, h = 200) => { const r = rnd(seed); let g = ''; for (let i = 0; i < n; i++) g += C(r() * 320, r() * h, r() * .9 + .2, '#fff', `opacity="${(r() * .7 + .3).toFixed(2)}"`); return g; };
const venetian = (k, x = -20, y = -20, w = 360, h = 240, slats = 12, c = '#FFF0D0', ang = -18, op = .55) => `<g transform="skewX(${ang})" opacity="${op}" ${k.blur(1.2)}>${Array.from({ length: slats }, (_, i) => R(x - 60, y + 30 + i * (h / slats), w * .75, h / slats * .5, c)).join('')}</g>`;
const longShadow = (x, y, len, ang = 0, op = .45) => `<path d="M${x - 3} ${y} L${x + 3} ${y} L${x + len + 6} ${y + len * ang + 4} L${x + len - 2} ${y + len * ang + 6}Z" fill="#000" opacity="${op}"/>`;

/* ===== Shot grammar: one diner scene with two characters, A (rust coat) and B (navy coat) ===== */
const car = (x, y, s = 1, c = '#8A2E2A') => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-40 0 L-40 -12 Q-38 -16 -28 -17 L-18 -28 Q-14 -31 -4 -31 L16 -31 Q24 -31 28 -24 L34 -17 Q42 -16 42 -10 L42 0Z" fill="${c}"/><path d="M-16 -18 L-12 -27 L0 -27 L0 -18Z M3 -18 L3 -27 L14 -27 Q20 -27 24 -18Z" fill="#9CB4C8" opacity=".75"/><circle cx="-24" cy="0" r="7" fill="#111"/><circle cx="26" cy="0" r="7" fill="#111"/><circle cx="-24" cy="0" r="3" fill="#777"/><circle cx="26" cy="0" r="3" fill="#777"/></g>`;
// interior of the diner with both characters seen side-on across the table
const twoSide = (k, o = {}) => diner(k) + bust(k, { x: o.ax ?? 92, y: o.y ?? 112, s: o.s ?? .62, d: .9, ...A, mouth: o.am }) + bust(k, { x: o.bx ?? 228, y: o.y ?? 112, s: o.s ?? .62, d: -.9, ...B, mouth: o.bm }) + dinerTable(k, o.ty ?? 170);
const singleA = (k, o = {}) => diner(k, { view: 'front' }) + bust(k, { x: o.x ?? 136, y: 92, s: .86, d: .35, gaze: 5, ...A, ...o });
const singleB = (k, o = {}) => diner(k, { view: 'front', clock: false }) + bust(k, { x: o.x ?? 184, y: 92, s: .86, d: -.35, gaze: -5, ...B, ...o });
const otsOnB = (k, o = {}) => diner(k, { view: 'front', clock: false }) + bust(k, { x: 200, y: 92, s: .8, d: -.4, gaze: -6, ...B, ...o }) + `<g ${k.blur(4)}>${bust(k, { x: 58, y: 120, s: 1.5, back: true, ...A, long: true })}</g>`;
const otsOnA = (k, o = {}) => diner(k, { view: 'front' }) + bust(k, { x: 120, y: 92, s: .8, d: .4, gaze: 6, ...A, ...o }) + `<g ${k.blur(4)}>${bust(k, { x: 262, y: 120, s: 1.5, back: true, ...B })}</g>`;
const exterior = k => {
  let g = R(-20, -20, 360, 240, k.lg([[0, '#0B1630'], [1, '#2C2C4C']])) + stars(40, 3, 80);
  g += R(40, 98, 240, 62, '#BDB5A6') + R(36, 92, 248, 8, '#8C3B2E') + R(52, 108, 216, 34, '#FFD98A');
  for (let x = 52; x <= 268; x += 36) g += R(x - 1.5, 108, 3, 34, '#7A6A50');
  g += `<g opacity=".8">${actor(110, 142, 20, { ...A, d: .9, shadow: false })}${actor(138, 142, 20, { ...B, d: -.9, shadow: false })}</g>`;
  g += R(110, 52, 100, 30, '#141322', 'rx="3"') + `<g ${k.blur(3)}>${txt(160, 74, 'DINER', { size: 20, c: '#FF5AA0', anchor: 'middle', ls: 3 })}</g>` + txt(160, 74, 'DINER', { size: 20, c: '#FFD6E8', anchor: 'middle', ls: 3 });
  g += R(-20, 160, 360, 60, '#15161C') + E(160, 164, 150, 10, '#FFD98A', `opacity=".28" ${k.blur(5)}`) + car(258, 182, .9, '#6E2A2A');
  g += R(16, 70, 2.4, 92, '#05060A') + C(17, 70, 28, k.rg([[0, '#FFC27A', .5], [1, '#FFC27A', 0]])) + C(17, 70, 3, '#FFF4DE');
  return g;
};
const door = (k, who = true) => {
  let g = diner(k, { view: 'front', clock: false }) + R(110, 20, 100, 180, '#0E1418') + R(118, 28, 84, 172, '#2A4054') + R(124, 36, 72, 80, k.lg([[0, '#0A1424'], [1, '#2C3C5A']]));
  if (who) g += `<g opacity=".95">${actor(160, 200, 168, { coat: '#121212', hair: '#121212', pants: '#121212', skin: '#2A2420', hat: '#121212', d: 0, shadow: false })}</g>`;
  return g + R(-20, -20, 360, 240, k.rg([[.45, '#000', 0], [1, '#000', .75]], .5, .5, .65));
};
const handsTable = k => R(-20, -20, 360, 240, k.lg([[0, '#C9C2B4'], [1, '#8E887A']])) + R(-20, -20, 360, 240, '#000', 'opacity=".08"') +
  `<g transform="rotate(-8 160 100)"><rect x="118" y="60" width="96" height="68" fill="#F4EFE6"/>${Array.from({ length: 6 }, (_, i) => `<path d="M128 ${76 + i * 8} q20 -3 40 0 t${30 + (i % 3) * 8} 0" stroke="#2A3A6A" stroke-width="1.2" fill="none"/>`).join('')}</g>` +
  `<g transform="translate(218 118) rotate(20)">${C(0, 0, 9, 'none', 'stroke="#C9A24A" stroke-width="4"')}${R(8, -2.5, 34, 5, '#C9A24A')}${R(34, 2, 4, 6, '#C9A24A')}${R(26, 2, 4, 5, '#C9A24A')}</g>` +
  `<path d="M-20 150 L60 128 Q84 122 104 126 L136 132 Q146 136 140 142 L106 144 L112 152 Q104 160 90 156 L40 170 L-20 190Z" fill="#E0AE8C"/><path d="M-20 160 L46 142 L52 172 L-20 200Z" fill="#8C3B2E"/>` + E(160, 140, 40, 10, '#000', `opacity=".15" ${k.blur(6)}`);

pool.groups.push({
  id: 'coverage', title: 'Coverage', slot: 'Shot',
  intro: 'The set of shots a crew films so a scene can be cut together: a wide master, then closer angles on each person. Every card here is the same diner scene, shot a different way.',
  terms: [
    { id: 'establishing', name: 'Establishing shot', aka: 'exterior establisher, location shot',
      desc: 'The shot that tells you where and when before the scene starts: the outside of the building, the city at night, the house on the hill. A screenplay writes it as a slugline.',
      spot: 'the outside of a place, wide, with no one important in close-up; it comes first and is often held for a beat',
      ref: 'the Bates house in Psycho, the Overlook from the air in The Shining, every sitcom\'s exterior bumper',
      prompt: 'establishing shot, the exterior of a roadside diner at night, warm windows glowing, a neon sign on the roof, small figures visible inside',
      ex: pic(exterior, undefined, tag('EXT. DINER - NIGHT')) },
    { id: 'master', name: 'Master shot', aka: 'master, wide master, cover shot',
      desc: 'One wide take of the whole scene from start to finish, with everyone in frame. Editors cut back to it to remind you where people are, and it saves the scene if nothing else works.',
      spot: 'all the characters and the room at once, nobody favored, held for long stretches',
      ref: 'Woody Allen dialogue scenes, Jim Jarmusch\'s Coffee and Cigarettes, classic sitcom wides',
      prompt: 'wide master shot of the whole scene, both people at the booth in frame, the room around them visible',
      ex: pic(k => twoSide(k, { s: .42, y: 122, ax: 110, bx: 210, ty: 160 }) + planInset(k, { actors: [{ x: 120, y: 110, a: 0, c: '#C86A54' }, { x: 200, y: 110, a: 180, c: '#6A8CB8' }], cams: [{ x: 160, y: 228, a: -90, fov: 80, len: 140 }], set: R(140, 90, 40, 40, '#555') }), undefined, tag('MASTER')) },
    { id: 'single', name: 'Single', aka: 'clean single, close single',
      desc: 'One person alone in the frame, usually from the chest up, looking just off the lens at someone we can\'t see. Most dialogue is cut from singles.',
      spot: 'one face, nobody else\'s shoulder or head in the frame, eyes aimed just past the camera',
      ref: 'almost every drama, interview cutaways, The Social Network\'s deposition scenes',
      prompt: 'clean single, medium close-up of one person alone in the frame, looking just off camera at someone unseen',
      ex: pic(k => singleA(k), undefined, tag('SINGLE · A')) },
    { id: 'dirtysingle', name: 'Over-the-shoulder', aka: 'OTS, dirty single',
      desc: 'A single with a slice of the other person in the foreground: the back of a head and a shoulder, soft and dark. It ties the two people together while favoring one.',
      spot: 'a big blurred shoulder or head on one side of the frame, the speaker sharp on the other side',
      ref: 'Heat\'s diner scene between Pacino and De Niro, nearly every film conversation',
      prompt: 'over-the-shoulder shot, the back of one person\'s head soft and dark in the foreground, the other person facing camera in sharp focus',
      ex: pic(k => otsOnB(k), undefined, tag('OTS · ON B', 'tr')) },
    { id: 'fifty', name: '50/50 shot', aka: 'profile two-shot, fifty-fifty',
      desc: 'Two people in profile facing each other, each taking half the frame. It feels balanced and theatrical, and the gap between them becomes part of the story.',
      spot: 'both faces in profile, nose to nose across the frame, neither favored',
      ref: 'the Pacino and De Niro face-off in Heat, Persona, Wes Anderson\'s symmetric dialogues',
      prompt: '50/50 profile two-shot, two people facing each other in profile across a table, each taking half the frame',
      ex: pic(k => twoSide(k), undefined, tag('50/50')) },
    { id: 'shotreverse', name: 'Shot / reverse shot', aka: 'shot-reverse-shot, singles and reverses',
      desc: 'The back-and-forth that carries most film dialogue: a shot of one person, then the matching shot from the opposite side on the other. Each angle mirrors the other in size and height.',
      spot: 'the edit keeps flipping between two matching angles, each person looking the opposite way',
      ref: 'Casablanca, The Godfather\'s kitchen talks, every TV procedural',
      prompt: 'shot / reverse shot coverage, matching over-the-shoulder angles on each person, same lens and height',
      ex: pic(k => board(k, [{ d: otsOnB, cap: 'OTS ON B' }, { d: otsOnA, cap: 'REVERSE ON A', t: 'CUT TO:' }])) },
    { id: 'reaction', name: 'Reaction shot', aka: 'reaction, listening shot',
      desc: 'A cut to someone who is not talking, to show how the words land. Often the strongest shot in a scene, because the audience reads the listener\'s face.',
      spot: 'the person on screen is silent; the voice we hear belongs to someone off-screen',
      ref: 'the shark reveal reactions in Jaws, the "you\'re gonna need a bigger boat" face, reality TV confessionals',
      prompt: 'reaction shot, a silent close-up of the listener\'s face as the news lands, eyebrows lifting, lips parted',
      ex: pic(k => board(k, [{ d: k => singleB(k, { mouth: 'open' }), cap: 'B TALKS' }, { d: k => singleA(k, { brow: 'up', mouth: 'open', gaze: 4 }), cap: 'A REACTS', t: 'CUT TO:' }])) },
    { id: 'insert', name: 'Insert', aka: 'insert shot, detail',
      desc: 'A close shot of an object or a hand in the middle of the scene: the note, the key, the gun in the drawer. It tells the audience exactly what to notice.',
      spot: 'no face; one object and a hand, very close, usually short',
      ref: 'the letter inserts in The Grand Budapest Hotel, the key in Notorious, heist-film blueprints',
      prompt: 'insert shot, a hand sliding a folded note and a brass key across a diner table, no faces',
      ex: pic(handsTable, undefined, tag('INSERT')) },
    { id: 'cutaway', name: 'Cutaway', aka: 'cutaway shot, B-roll',
      desc: 'A cut to something outside the main action (a clock, the rain, a passer-by), then back. It shows time passing or tension rising, and it lets the editor hide a cut.',
      spot: 'the scene briefly leaves the people for a detail of the room or the world outside, then returns',
      ref: 'the clocks in High Noon, the ticking watch cutaways in Dunkirk, news interview B-roll',
      prompt: 'cutaway to the wall clock above the counter, its second hand ticking, between shots of the conversation',
      ex: pic(k => board(k, [{ d: k => twoSide(k), cap: 'TWO-SHOT' }, { d: k => diner(k, { view: 'front' }), vb: '200 12 100 62', cap: 'CLOCK', t: 'CUT TO:' }, { d: k => twoSide(k), cap: 'TWO-SHOT', t: 'BACK TO:' }])) },
    { id: 'pov', name: 'POV shot', aka: 'point-of-view, subjective shot',
      desc: 'A character looks, then we cut to what they see, framed from their position. The audience shares their eyes and, for a moment, their feelings.',
      spot: 'a shot of someone looking, followed by a shot from their eye height of the thing they\'re looking at',
      ref: 'Rear Window, the shark\'s-eye view in Jaws, Halloween\'s opening',
      prompt: 'point-of-view shot from her seat in the booth, looking at the diner door as a dark figure in a hat steps in',
      ex: pic(k => board(k, [{ d: k => singleA(k, { gaze: 7, brow: 'down' }), cap: 'A LOOKS' }, { d: door, cap: 'HER POV', t: 'CUT TO:' }])) },
    { id: 'italian', name: 'Italian shot', aka: 'extreme close-up on the eyes, Leone close-up',
      desc: 'A wide frame filled by nothing but a pair of eyes. Sergio Leone made it famous in the stand-offs of his westerns, cutting faster and closer until only eyes are left.',
      spot: 'a thin letterboxed strip of eyes and brow, the rest of the face cut off top and bottom',
      ref: 'the final duel in The Good, the Bad and the Ugly, Once Upon a Time in the West, Kill Bill',
      prompt: 'extreme close-up "Italian shot" of a gunslinger\'s squinting eyes filling a 2.39:1 frame, sweat and stubble, harsh sun',
      ex: pic(k => `<svg x="0" y="0" width="320" height="200" viewBox="98 69 124 77" preserveAspectRatio="xMidYMid slice">${R(0, 0, 320, 200, '#6A4A2E')}${bust(k, { x: 160, y: 98, s: 1, d: 0, gaze: -2, brow: 'down', skin: '#B97E52', hair: '#3A2616', hat: '#4A3826', shade: R(-60, -60, 120, 40, '#2A1608', 'opacity=".55"') })}</svg>` + gate(2.39), undefined, tag('ECU · EYES', 'br')) }
  ]
});

pool.groups.push({
  id: 'rules', title: 'Rules of the screen', slot: 'Continuity',
  intro: 'The conventions that keep a cut scene readable: which side the camera stays on, which way people look and move, and when a cut will jump. The floor plans show the camera in red.',
  terms: [
    { id: 'rule180', name: '180-degree rule', aka: 'the axis of action, the line',
      desc: 'Draw an imaginary line through the two people talking. As long as every camera stays on one side of it, A is always on the left looking right and B on the right looking left.',
      spot: 'across a whole scene each person keeps their side of the screen and their direction of gaze',
      ref: 'taught in every film school; the dinner-table scenes of The Godfather keep it strictly',
      prompt: 'coverage that respects the 180-degree rule: every angle on the same side of the line between the two people, so their screen positions never flip',
      ex: pic(k => plan(k, { set: R(140, 80, 40, 40, '#3A4048', 'rx="3"'), line: [10, 100, 310, 100], lineLX: 310, lineLY: 92, actors: [{ x: 124, y: 100, a: 0, c: '#C86A54', l: 'A' }, { x: 196, y: 100, a: 180, c: '#6A8CB8', l: 'B' }], cams: [{ x: 160, y: 176, a: -90, fov: 70, len: 80, l: '1 WIDE', ly: 194 }, { x: 70, y: 150, a: -35, fov: 30, len: 120, l: '2 ON B', lx: 54 }, { x: 250, y: 150, a: -145, fov: 30, len: 120, l: '3 ON A', lx: 268 }, { x: 160, y: 30, a: 90, fov: 40, len: 60, l: '✕ CROSSES', ly: 22, ok: false }] })) },
    { id: 'crossline', name: 'Crossing the line', aka: 'breaking the 180, jumping the axis',
      desc: 'Cutting to a camera on the other side of the line flips the screen: suddenly both people seem to look the same way. Done by accident it confuses; done on purpose it unsettles.',
      spot: 'after a cut, someone has jumped to the other side of the screen and the two no longer look at each other',
      ref: 'the mirror-flip arguments in The Shining, Ozu ignored the rule all his life, Gollum talking to himself in The Two Towers',
      prompt: 'deliberately cross the 180-degree line between shots so the two people suddenly face the same direction on screen, creating unease',
      ex: pic(k => board(k, [{ d: k => singleA(k, { x: 116 }), cap: 'A LOOKS RIGHT' }, { d: k => diner(k, { view: 'front', clock: false }) + bust(k, { x: 116, y: 92, s: .86, d: .35, gaze: 5, ...B }), cap: 'B LOOKS RIGHT TOO', t: 'CUT TO:' }], { extra: txt(160, 30, 'THEY NO LONGER FACE EACH OTHER', { size: 7, c: '#F2C14E', anchor: 'middle' }) })) },
    { id: 'rule30', name: '30-degree rule', aka: 'the 20/30 rule',
      desc: 'If you cut between two shots of the same person, move the camera at least 30 degrees (or change the shot size a lot). Anything less looks like a mistake: a jump cut.',
      spot: 'when it\'s broken the subject seems to twitch or pop between shots; when kept, each cut feels like a fresh view',
      ref: 'standard continuity editing; Godard broke it on purpose in Breathless',
      prompt: 'cut between angles at least 30 degrees apart, or change the shot size, so cuts between shots of the same subject never look like a jump',
      ex: pic(k => plan(k, { actors: [{ x: 160, y: 60, a: 90, c: '#C86A54', l: 'A' }], cams: [{ x: 160, y: 168, a: -90, fov: 26, len: 100, l: '1', ly: 186 }, { x: 180, y: 166, a: -100, fov: 26, len: 100, l: '✕ 2 (10°)', lx: 214, ly: 186, ok: false }, { x: 242, y: 140, a: -125, fov: 26, len: 100, l: '3 (35°) OK', lx: 268, ly: 160 }], extra: `<path d="M160 120 A60 60 0 0 1 196 108" fill="none" stroke="#F2C14E" stroke-width="1.2" stroke-dasharray="3 2"/>` + txt(198, 120, '30°', { size: 7, c: '#F2C14E' }) })) },
    { id: 'screendir', name: 'Screen direction', aka: 'direction of travel, continuity of movement',
      desc: 'If someone leaves one shot walking left to right, they should keep going left to right in the next, or the audience thinks they turned around. Long journeys often run one way the whole film.',
      spot: 'a traveler or a chase keeps moving the same way across the screen from shot to shot',
      ref: 'the Fellowship heading right to left toward Mordor, Stagecoach, every chase scene',
      prompt: 'keep screen direction consistent: the traveler moves left to right in every shot of the journey',
      ex: pic(k => board(k, [{ d: k => land(k, { hz: 130, sky: ['#E9B87A', '#F2D8A8', '#F6E8CC'], ground: '#B9895A', ground2: '#D8AE78', mtn: '#C49A72' }) + actor(110, 168, 70, { coat: '#6A3A2A', walk: true, d: 1, hat: '#3A2A1C' }) + arrow(k, 'M150 120 L210 120', '#fff', 3), cap: 'DESERT' }, { d: k => road(k, { hz: 112 }) + actor(150, 176, 72, { coat: '#6A3A2A', walk: true, d: 1, hat: '#3A2A1C' }) + arrow(k, 'M190 130 L250 130', '#fff', 3), cap: 'ROAD', t: '/' }, { d: k => land(k, { hz: 140, sky: ['#5A6A9A', '#C9A0A0', '#F2C8A0'], ground: '#5A4A3A', extra: house(150, 140, 60, '#3A2A2A', '#FFD07A') + house(230, 140, 50, '#2A2A3A', '#FFD07A') }) + actor(90, 180, 66, { coat: '#6A3A2A', walk: true, d: 1, hat: '#3A2A1C' }) + arrow(k, 'M120 110 L180 110', '#fff', 3), cap: 'TOWN', t: '/' }], { extra: txt(160, 30, 'ALWAYS LEFT TO RIGHT', { size: 7.5, c: '#F2C14E', anchor: 'middle' }) })) },
    { id: 'eyeline', name: 'Eyeline match', aka: 'eye-line match, matching eyelines',
      desc: 'When two shots are cut together, the eyelines have to agree: if she looks down to the right, he should look up to the left. Get it wrong and they seem to be looking at different people.',
      spot: 'the gazes across two cuts point at each other: one up, one down, one left, one right',
      ref: 'Romeo and Juliet balcony scenes, the tall-short pairing in The Princess Bride\'s Fezzik scenes',
      prompt: 'matched eyelines across the cut: she looks down and to the right from the balcony, he looks up and to the left from the street',
      ex: pic(k => board(k, [{ d: k => R(-20, -20, 360, 240, k.lg([[0, '#2A3A5A'], [1, '#5A6A8A']])) + R(-20, 150, 360, 70, '#6A5A4A') + bust(k, { x: 130, y: 80, s: .8, d: .4, gaze: 6, gazeY: 2.6, ...A, long: true }), cap: 'LOOKS DOWN, RIGHT' }, { d: k => R(-20, -20, 360, 240, k.lg([[0, '#1A2232'], [1, '#2A3242']])) + bust(k, { x: 190, y: 104, s: .8, d: -.4, gaze: -6, gazeY: -2.4, ...B }), cap: 'LOOKS UP, LEFT', t: 'CUT TO:' }])) },
    { id: 'lookroom', name: 'Look room', aka: 'nose room, lead room',
      desc: 'Leave empty space in the direction a person is looking or moving. With room ahead the frame feels comfortable; with none, the person seems boxed in or about to be surprised.',
      spot: 'the face sits on one third of the frame and the open space is on the side they face',
      ref: 'standard framing everywhere; horror films remove it on purpose so something can enter',
      prompt: 'framed with generous look room: the face on the left third of the frame, gazing right into open space',
      ex: pic(k => diner(k, { view: 'front', clock: false }) + bust(k, { x: 100, y: 92, s: .86, d: .35, gaze: 7, ...A }) + `<g stroke="#fff" stroke-opacity=".45" stroke-width=".8" stroke-dasharray="3 3"><line x1="106.7" y1="0" x2="106.7" y2="200"/><line x1="213.3" y1="0" x2="213.3" y2="200"/><line x1="0" y1="66.7" x2="320" y2="66.7"/><line x1="0" y1="133.3" x2="320" y2="133.3"/></g>` + arrow(k, 'M150 60 L290 60', '#F2C14E', 2) + txt(220, 52, 'LOOK ROOM', { size: 8, c: '#F2C14E', anchor: 'middle' })) },
    { id: 'matchaction', name: 'Cut on action', aka: 'match on action, action match',
      desc: 'Cut in the middle of a movement (a door opening, a punch, a coat coming off) and finish it in the next shot. The motion carries the eye across the cut so it disappears.',
      spot: 'one continuous gesture spread over two shots, usually wide to close',
      ref: 'Raging Bull\'s fights, the door-opening cuts in every thriller, Lawrence of Arabia\'s match blown out',
      prompt: 'cut on action: a wide shot of her pushing the diner door, cut mid-movement to a close-up of her hand on the handle',
      ex: pic(k => board(k, [{ d: k => door(k, false) + actor(170, 196, 150, { ...A, d: 1, arms: 'outR', long: true }), cap: 'WIDE: REACHES' }, { d: k => R(-20, -20, 360, 240, '#2A4054') + R(150, 40, 18, 140, '#C9C2B4', 'rx="6"') + R(140, 80, 40, 40, '#9A9488', 'rx="4"') + `<path d="M-20 80 L120 70 Q148 70 152 86 L150 110 Q140 122 120 118 L-20 130Z" fill="#E0AE8C"/><path d="M-20 70 L40 66 L40 140 L-20 146Z" fill="#8C3B2E"/>`, cap: 'CU: SAME MOTION', t: 'CUT ON ACTION:' }])) },
    { id: 'cheat', name: 'Cheating', aka: 'cheat the angle, cheat a look',
      desc: 'Turning an actor, a prop or a look slightly toward the camera so it reads on screen, even though it would be wrong in the room. The audience never notices; the shot just works.',
      spot: 'people seem to face each other but both faces are fully visible to the camera',
      ref: 'theater blocking, sitcom couches facing camera, every dinner table in a family film',
      prompt: 'cheat both actors\' angles toward camera so their faces read clearly while they still seem to face each other',
      ex: pic(k => plan(k, { actors: [{ x: 120, y: 90, a: 30, c: '#C86A54', l: 'A', look: 70 }, { x: 200, y: 90, a: 150, c: '#6A8CB8', l: 'B', look: 70 }], cams: [{ x: 160, y: 180, a: -90, fov: 60, len: 110, l: 'CAMERA', ly: 196 }], extra: `<g opacity=".45">${Pth('M133 90 L127 86 L127 94Z', '#fff')}${Pth('M187 90 L193 86 L193 94Z', '#fff')}</g><line x1="132" y1="90" x2="188" y2="90" stroke="#fff" stroke-dasharray="2 3" stroke-opacity=".5"/>` + txt(160, 80, 'REAL', { size: 7, c: '#fff', anchor: 'middle', op: .6 }) + txt(160, 132, 'CHEATED', { size: 7, c: '#F2C14E', anchor: 'middle' }) })) }
  ]
});

/* ===== Staging & signature shots ===== */
const wheat = (k, n = 90, seed = 9, top = 120, c = '#E8B860') => { const r = rnd(seed); let g = ''; for (let i = 0; i < n; i++) { const x = r() * 340 - 10, h = 40 + r() * 70, y = 220; g += `<path d="M${x} ${y} Q${x + 3} ${y - h * .6} ${x + (r() - .5) * 10} ${top + (1 - h / 110) * 40}" stroke="${c}" stroke-width="${(1 + r() * 1.2).toFixed(1)}" fill="none" opacity="${(.5 + r() * .5).toFixed(2)}"/>` + E(x + (r() - .5) * 10, top + (1 - h / 110) * 40, 1.6, 5, c); } return g; };
const flare = (k, x, y, c = '#FFE2A8', s = 1) => C(x, y, 60 * s, k.rg([[0, c, .9], [.25, c, .35], [1, c, 0]])) + C(x, y, 9 * s, '#FFFBEF') + `<g opacity=".45">${C(x + (160 - x) * .6, y + (100 - y) * .6, 7 * s, 'none', `stroke="${c}" stroke-width="1.4"`)}${C(x + (160 - x) * 1.2, y + (100 - y) * 1.2, 12 * s, c, 'opacity=".25"')}${C(x + (160 - x) * 1.6, y + (100 - y) * 1.6, 4 * s, c, 'opacity=".5"')}</g>`;
const topHead = (x, y, r = 11, hair = '#2A1C14', coat = '#3A3F48', a = 0) => `<g transform="translate(${x} ${y}) rotate(${a})">${E(0, 9, r * 1.9, r * .9, coat)}${C(0, 0, r, hair)}</g>`;

pool.groups.push({
  id: 'blocking', title: 'Blocking & staging', slot: 'Staging',
  intro: 'Where people stand and how they move inside the frame. A director "blocks" a scene with the actors before the camera is placed, so staging is the first composition decision on a set.',
  terms: [
    { id: 'deepstaging', name: 'Deep staging', aka: 'staging in depth, deep focus staging',
      desc: 'Action on several planes at once, all sharp: a face in the foreground, someone in the middle of the room, a third person far behind. The audience chooses where to look, and the layers comment on each other.',
      spot: 'a big face close to the lens and people far back in the room, everything in focus',
      ref: 'Citizen Kane\'s window scene, Gregg Toland, William Wyler\'s The Best Years of Our Lives',
      prompt: 'deep staging with deep focus: a face in the near foreground, a figure in the middle of the room, a child visible through the far window, all sharp',
      ex: pic(k => { let g = R(-20, -20, 360, 240, k.lg([[0, '#4A4038'], [1, '#2A241F']])) + R(200, 30, 90, 80, k.lg([[0, '#DCE6EE'], [1, '#B8C8D4']])) + R(244, 30, 3, 80, '#4A4038') + R(200, 68, 90, 3, '#4A4038'); g += `<svg x="200" y="30" width="90" height="80" viewBox="80 40 160 140" preserveAspectRatio="xMidYMid slice">${land(k, { hz: 120, sky: ['#9CC0E0', '#C8DCEC', '#EEF2F2'], ground: '#E8EEF0', ground2: '#F4F6F6' })}${actor(160, 160, 34, { coat: '#3A5A8A', d: 0 })}</svg>` + R(-20, 150, 360, 70, '#3A2E26'); g += actor(150, 168, 96, { coat: '#2A2A30', d: -.6, tie: '#8A2A2A' }); g += bust(k, { x: 66, y: 112, s: .92, d: .5, gaze: 5, coat: '#5A3A5A', long: true, hair: '#1A1210' }); return g; }, undefined, tag('DEEP STAGING')) },
    { id: 'doorframe', name: 'Doorway frame', aka: 'frame within a frame, the Searchers shot',
      desc: 'A dark doorway, window or arch around a brighter world outside. It isolates the person, adds depth and often says something: inside and outside, home and wilderness.',
      spot: 'a black border made by the set itself, with the subject inside a bright opening',
      ref: 'the opening and closing shots of The Searchers, Wong Kar-wai\'s corridors, Barry Jenkins\' doorways',
      prompt: 'framed through a dark doorway, a lone figure silhouetted against a bright desert landscape outside',
      ex: pic(k => R(-20, -20, 360, 240, '#130E0B') + `<svg x="112" y="26" width="96" height="164" viewBox="112 0 96 164" preserveAspectRatio="none">${land(k, { hz: 112, sky: ['#5E9AD6', '#BFD8EC', '#F4E2C2'], ground: '#B97848', ground2: '#E0A870', mtn: '#C47E54', mtnY: 6 })}</svg>` + actor(160, 196, 120, { coat: '#1A120E', pants: '#1A120E', hair: '#1A120E', skin: '#1A120E', back: true, hat: '#1A120E', shadow: false }) + Pth('M112 190 L208 190 L300 220 L20 220Z', '#E0A870', `opacity=".22" ${k.blur(3)}`) + R(-20, 190, 360, 30, '#1A140F'), undefined, tag('FRAME IN FRAME')) },
    { id: 'planimetric', name: 'Planimetric staging', aka: 'tableau framing, flat frontal staging',
      desc: 'The camera faces the back wall straight on and the actors line up across the frame like figures in a painting or a police line-up. Everything is flat, frontal and deliberate.',
      spot: 'the back wall parallel to the frame, people side by side facing camera, nothing at an angle',
      ref: 'Wes Anderson, Stanley Kubrick, Roy Andersson, Napoleon Dynamite',
      prompt: 'planimetric staging: camera square to the back wall, three people standing side by side facing the lens, flat frontal composition, centered',
      ex: pic(k => R(-20, -20, 360, 240, '#E9C9A6') + R(-20, 150, 360, 70, '#B65A4A') + R(-20, 146, 360, 4, '#7A3A2E') + [70, 160, 250].map(x => R(x - 22, 34, 44, 54, '#F6EAD6') + R(x - 18, 38, 36, 46, ['#7AA6A0', '#E0A04A', '#8A6AAA'][x % 3]) + R(x - 22, 34, 44, 54, 'none', 'stroke="#C9A24A" stroke-width="3"')).join('') + actor(100, 176, 104, { coat: '#3A6A8A', d: 0 }) + actor(160, 176, 112, { coat: '#C9A24A', d: 0, tie: '#7A3A2E' }) + actor(220, 176, 98, { coat: '#6A8A3A', d: 0, long: true, hair: '#C9803A' }), undefined, tag('PLANIMETRIC')) },
    { id: 'onepoint', name: 'One-point perspective', aka: 'symmetrical vanishing point, Kubrick corridor',
      desc: 'Every line in the set runs to a single vanishing point in the middle of the frame. It pulls the eye down a corridor or a road and feels both perfect and oppressive.',
      spot: 'walls, ceiling and floor all converge to one point at the center; strict left-right symmetry',
      ref: 'The Shining\'s hallways, 2001\'s centrifuge, Wes Anderson, Edgar Wright parodies',
      prompt: 'one-point perspective down a long symmetrical hotel corridor, all lines converging to the center, a small figure at the far end',
      ex: pic(k => corridor(k, { rug: '#8A2A22' }) + actor(160, 136, 36, { coat: '#5A8ABA', d: 0, shadow: false }) + `<g stroke="#F2C14E" stroke-width=".9" stroke-dasharray="3 3" opacity=".7"><line x1="0" y1="0" x2="160" y2="92"/><line x1="320" y1="0" x2="160" y2="92"/><line x1="0" y1="200" x2="160" y2="92"/><line x1="320" y1="200" x2="160" y2="92"/></g>`, undefined, tag('ONE-POINT')) },
    { id: 'walktalk', name: 'Walk and talk', aka: 'walk-and-talk, Steadicam lead',
      desc: 'Two or more people deliver a scene while walking, with the camera backing up in front of them. It turns exposition into momentum and shows off the set.',
      spot: 'people walking toward the lens through a corridor or street, talking, never stopping',
      ref: 'The West Wing, ER, Aaron Sorkin scripts, Goodfellas\' corridor walk',
      prompt: 'walk-and-talk: two colleagues stride toward the camera down a busy office corridor mid-conversation, the camera backing up ahead of them on a Steadicam',
      ex: pic(k => corridor(k, { wall: '#B8C4C8', wall2: '#A8B4B8', floor: '#5A6268', ceil: '#E8ECEC', end: '#8AA0AE' }) + actor(214, 136, 30, { coat: '#3A3A40', walk: true }) + actor(132, 196, 136, { ...A, walk: true, long: true }) + actor(192, 196, 140, { ...B, walk: true, d: -.4, tie: '#AA3A3A' }) + planInset(k, { actors: [{ x: 140, y: 120, a: 90, c: '#C86A54' }, { x: 180, y: 120, a: 90, c: '#6A8CB8' }], cams: [{ x: 160, y: 200, a: -90, fov: 60, len: 70 }], arrows: [{ d: 'M120 70 L120 108', c: '#C86A54' }, { d: 'M160 210 L160 244', c: CAMC }] }, 8, 118), undefined, tag('WALK AND TALK')) },
    { id: 'diopter', name: 'Split diopter', aka: 'split-field diopter, split focus',
      desc: 'A half-lens over one side of the camera so a face very close and a person far away are both sharp, with a soft seam between them. It looks slightly wrong, which is why thrillers love it.',
      spot: 'two subjects at very different distances, both sharp, with a blurry vertical band where the halves meet',
      ref: 'Brian De Palma (Blow Out, Carrie), Jaws, Paul Thomas Anderson, Tarantino',
      prompt: 'split diopter shot: a face in extreme foreground on the left and a figure far in the background on the right, both in sharp focus, a faint soft seam between them',
      ex: pic(k => R(-20, -20, 360, 240, k.lg([[0, '#2A3440'], [1, '#141A22']])) + R(-20, 150, 360, 70, '#2A241F') + R(220, 40, 70, 110, '#3A4A5A') + R(228, 48, 54, 100, '#5A7088') + actor(256, 150, 84, { ...B, d: -.3 }) + bust(k, { x: 76, y: 104, s: 1.05, d: .55, gaze: 6, ...A, long: true }) + `<g ${k.blur('6 0')}>${R(150, -20, 34, 240, '#3A4450', 'opacity=".8"')}</g>`, undefined, tag('SPLIT DIOPTER')) },
    { id: 'mirror', name: 'Mirror shot', aka: 'reflection shot, doubled frame',
      desc: 'A character seen in a mirror, often with their real self in the frame too. It suggests a split, a lie, or someone sizing themselves up.',
      spot: 'the face we see clearly is a reflection; the real person may be a dark shape beside it',
      ref: 'Taxi Driver\'s "You talkin\' to me?", Black Swan, Citizen Kane\'s hall of mirrors',
      prompt: 'mirror shot: a man stares into a bathroom mirror, his reflection sharp and lit, the real back of his head dark and soft in the foreground',
      ex: pic(k => R(-20, -20, 360, 240, '#3A4A48') + R(-20, 150, 360, 70, '#D8D2C4') + R(110, 18, 180, 128, '#8A9A98') + `<svg x="114" y="22" width="172" height="120" viewBox="114 22 172 120">${R(100, 0, 220, 200, k.lg([[0, '#5A6A6A'], [1, '#2A3434']]))}${bust(k, { x: 214, y: 82, s: .62, d: -.5, gaze: 0, ...B, brow: 'down' })}</svg>` + R(110, 18, 180, 128, 'none', 'stroke="#C9C2B4" stroke-width="5"') + `<g ${k.blur(4)}>${bust(k, { x: 60, y: 118, s: 1.15, back: true, ...B })}</g>` + R(0, -20, 320, 240, k.lg([[0, '#fff', .07], [1, '#fff', 0]], 'h')), undefined, tag('MIRROR')) },
    { id: 'shadowplay', name: 'Shadow play', aka: 'expressionist shadow, cast-shadow staging',
      desc: 'The threat shows up as a shadow on the wall before the person does: huge, distorted and moving. Lit by one hard light from low down, it is one of the oldest tricks in horror.',
      spot: 'a giant shadow of a figure, hand or claw climbing a wall or staircase',
      ref: 'Nosferatu on the stairs, M, The Third Man, Scooby-Doo',
      prompt: 'expressionist shadow play: the elongated shadow of a clawed figure climbing a staircase wall, one hard low light, no person visible',
      ex: pic(k => graded(k, 'trix', R(-20, -20, 360, 240, k.rg([[0, '#E8E0D0'], [1, '#6A6258']], .3, .4, .9)) + Pth('M-20 220 L-20 170 L40 170 L40 150 L80 150 L80 130 L120 130 L120 110 L160 110 L160 90 L200 90 L200 70 L240 70 L240 50 L280 50 L280 30 L340 30 L340 220Z', '#2A2622') + `<g ${k.blur(1.4)} fill="#14100E"><path d="M120 128 L130 60 Q132 40 146 38 Q160 40 156 58 L170 50 Q176 56 168 64 L196 46 L210 34 L214 38 L204 50 L222 30 L226 34 L212 54 L232 40 L234 46 L214 62 L180 86 L160 128Z"/><circle cx="146" cy="30" r="12"/><path d="M138 22 L132 6 L142 18 M152 20 L160 6 L156 22"/></g>`) + k.grain(.3), undefined, tag('SHADOW')) },
    { id: 'godseye', name: 'Top shot', aka: 'God\'s-eye view, overhead, bird\'s-eye',
      desc: 'The camera looks straight down from the ceiling. People become shapes on a pattern, which makes a scene feel planned, fated or clinical.',
      spot: 'tops of heads and shoulders, the floor or table as a flat graphic background',
      ref: 'Scorsese\'s overheads in Taxi Driver and Casino, Busby Berkeley, the shower drain in Psycho',
      prompt: 'top shot looking straight down at four people around a round card table, tops of heads, scattered chips and cards, hard overhead lamp',
      ex: pic(k => { let g = R(-20, -20, 360, 240, '#2A1E18'); for (let i = 0; i < 9; i++) for (let j = 0; j < 6; j++) if ((i + j) % 2) g += R(i * 40 - 20, j * 40 - 20, 40, 40, '#3A2A20'); g += C(160, 100, 64, '#1F5A3A') + C(160, 100, 64, 'none', 'stroke="#5A3A20" stroke-width="6"'); [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dx, dy], i) => { g += topHead(160 + dx * 82, 100 + dy * 82, 12, ['#2A1A12', '#C9A15E', '#15100D', '#8A4A2A'][i], [A.coat, B.coat, '#3A5A3A', '#5A3A5A'][i], [90, -90, 180, 0][i]); }); const r = rnd(3); for (let i = 0; i < 12; i++) g += C(130 + r() * 60, 80 + r() * 40, 4, ['#E9E2D6', '#C8322B', '#2E6AC8'][i % 3]); g += R(140, 90, 12, 17, '#F4EFE8', 'transform="rotate(20 146 98)"') + R(162, 94, 12, 17, '#F4EFE8', 'transform="rotate(-12 168 102)"'); return g + C(160, 100, 150, k.rg([[0, '#FFE2A8', .2], [.5, '#000', 0], [1, '#000', .7]])); }, undefined, tag('TOP SHOT')) },
    { id: 'triangle', name: 'Triangle staging', aka: 'three-way standoff, Mexican standoff',
      desc: 'Three people placed at the corners of a triangle so every one of them can see, and threaten, the other two. Any one shot holds the whole tension.',
      spot: 'three figures spread across near-left, near-right and far-center, all facing inward',
      ref: 'the cemetery duel in The Good, the Bad and the Ugly, Reservoir Dogs, Pirates of the Caribbean',
      prompt: 'triangle staging, a three-way standoff in a dusty circular plaza, two figures in the near corners, one far in the middle, all facing inward',
      ex: pic(k => land(k, { hz: 96, sky: ['#E8C08A', '#F2DCAE', '#F6EACC'], ground: '#A88050', ground2: '#C8A070', mtn: '#C49A72', mtnY: 4 }) + E(160, 150, 150, 40, '#B89060', 'opacity=".5"') + actor(160, 118, 46, { coat: '#3A2A1C', hat: '#2A1E14', arms: 'outR', d: .4 }) + actor(60, 190, 112, { coat: '#5A3A2A', hat: '#3A2A1C', arms: 'outR', d: .8, back: true }) + actor(262, 190, 116, { coat: '#6A5A3A', hat: '#4A3A24', arms: 'out', d: -.8, back: true }) + `<path d="M74 120 L160 92 L250 120 Z" fill="none" stroke="#fff" stroke-opacity=".35" stroke-dasharray="3 3"/>`, undefined, tag('TRIANGLE')) }
  ]
});

pool.groups.push({
  id: 'signature', title: 'Signature shots', slot: 'Signature shot',
  intro: 'Shots so tied to one filmmaker that people name them after the director. Each is a quick way to borrow a feeling. For the camera moves behind them (dolly zoom, push-in, crane), see the Motion workbook.',
  terms: [
    { id: 'trunk', name: 'Trunk shot', aka: 'Tarantino trunk shot, from-the-trunk POV',
      desc: 'A low angle from inside a car trunk as people open it and look down at whatever (or whoever) is inside. The sky behind them, the trunk lid framing the top.',
      spot: 'two or three people looking down into the lens, framed by the black edges of a trunk, sky above',
      ref: 'Reservoir Dogs, Pulp Fiction, Jackie Brown, Kill Bill, Once Upon a Time in Hollywood',
      prompt: 'trunk shot: extreme low angle from inside a car trunk, two men in suits looking down into the lens, bright sky behind them, the dark trunk lid framing the top',
      ex: pic(k => R(-20, -20, 360, 240, k.lg([[0, '#5E9AD6'], [1, '#CFE2F0']])) + bust(k, { x: 110, y: 126, s: .84, d: .3, gazeY: 3.4, gaze: 2, coat: '#141414', collar: '#F4EFE8', hair: '#1A120E', skin: '#D8A27E', brow: 'down' }) + bust(k, { x: 214, y: 120, s: .9, d: -.3, gazeY: 3.4, gaze: -2, coat: '#141414', collar: '#F4EFE8', hair: '#3A2A1C', skin: '#8E5C40', brow: 'up' }) + R(-20, -20, 360, 34, '#0A0A0A') + Pth('M-20 14 L340 14 L340 26 Q160 40 -20 26Z', '#1A1A1A') + R(-20, 180, 360, 40, '#0A0A0A') + R(-20, -20, 26, 240, '#0A0A0A') + R(314, -20, 26, 240, '#0A0A0A') + R(6, 172, 308, 8, '#3A3A3A'), undefined, tag('TRUNK SHOT', 'bl')) },
    { id: 'spielbergface', name: 'The Spielberg face', aka: 'awe face, wonder close-up',
      desc: 'A slow push-in on a face lit by something just off screen, eyes wide, mouth slightly open, before you see what they\'re looking at. It tells you to feel wonder first.',
      spot: 'a close-up of awe or terror, light spilling onto the face from the thing we have not seen yet',
      ref: 'Close Encounters, E.T., Jurassic Park\'s first dinosaur, Jaws',
      prompt: 'the Spielberg face: slow push-in on a child\'s upturned face, eyes wide, mouth slightly open in awe, lit by a warm glow from something off screen',
      ex: pic(k => R(-20, -20, 360, 240, k.lg([[0, '#0E1424'], [1, '#1E2A3A']])) + bust(k, { x: 150, y: 104, s: .9, d: .25, gaze: 4, gazeY: -2.4, brow: 'up', mouth: 'open', ...A, shade: R(-120, -120, 240, 280, k.lg([[0, '#FFE2A8', .55], [.6, '#FFE2A8', 0]], 'h'), 'style="mix-blend-mode:screen"') + R(-120, -120, 240, 280, k.lg([[0, '#000', 0], [1, '#0A1430', .6]], 'h')) }) + R(270, -20, 80, 240, k.lg([[0, '#FFE2A8', 0], [1, '#FFE2A8', .7]], 'h')) + flare(k, 330, 30, '#FFE2A8', .8), undefined, tag('PUSH IN')) },
    { id: 'kubrickstare', name: 'The Kubrick stare', aka: 'head down, eyes up',
      desc: 'Chin lowered, eyes rolled up toward the lens from under the brow, often with a faint smile. It signals that something in the character has broken.',
      spot: 'the head tilted down while the eyes look up straight at us, brows heavy, whites of the eyes visible below the iris',
      ref: 'Jack in The Shining, Alex in A Clockwork Orange, Private Pyle in Full Metal Jacket',
      prompt: 'the Kubrick stare: a man tilts his head down and glares up into the lens from under his brow, a faint unsettling smile, symmetrical framing',
      ex: pic(k => R(-20, -20, 360, 240, k.lg([[0, '#3A2A22'], [1, '#14100C']])) + `<g transform="translate(0 10) rotate(0)">${bust(k, { x: 160, y: 104, s: .95, d: 0, gaze: 0, gazeY: -2.6, brow: 'down', mouth: 'smile', hair: '#2A1A12', skin: '#D8A27E', coat: '#5A2A22', shade: R(-80, -80, 160, 70, k.lg([[0, '#000', .7], [1, '#000', 0]])) })}</g>` + k.vignette(.7), undefined, tag('STARE')) },
    { id: 'doubledolly', name: 'Double dolly', aka: 'Spike Lee dolly, floating shot',
      desc: 'The actor stands on the same dolly as the camera, so they glide through the world without walking. The street slides past and they seem to float toward their fate.',
      spot: 'a person moving smoothly forward while their body stays perfectly still, the background drifting by',
      ref: 'Malcolm X, Do the Right Thing, Inside Man, 25th Hour, BlacKkKlansman',
      prompt: 'Spike Lee double-dolly shot: a man glides forward without walking, standing still on the moving dolly, the night street sliding past behind him',
      ex: pic(k => `<g ${k.blur('7 0')}>${nightStreet(k, { wet: true })}</g>` + bust(k, { x: 160, y: 96, s: .82, d: 0, gaze: 0, ...B, coat: '#1A1A22', collar: '#E9E2D6' }) + planInset(k, { actors: [{ x: 160, y: 110, a: 90, c: '#6A8CB8' }], cams: [{ x: 160, y: 170, a: -90, fov: 50, len: 60 }], set: R(132, 100, 56, 86, '#5A5A5A', 'rx="4"'), arrows: [{ d: 'M220 200 L220 120', c: '#F2C14E' }] }), undefined, tag('DOUBLE DOLLY')) },
    { id: 'hero360', name: 'Low-angle hero 360', aka: 'Bayhem spin, circling hero shot',
      desc: 'The camera circles low around one or more heroes as they rise to their feet or turn to face the enemy, the sun flaring behind them. Pure swagger.',
      spot: 'a low angle looking up at figures against the sky, the camera orbiting, lens flare',
      ref: 'Bad Boys II, Armageddon, Transformers, The Avengers\' circle shot',
      prompt: 'low-angle hero 360: the camera circles low around a team of heroes rising to their feet, sun flaring behind them, slow motion',
      ex: pic(k => R(-20, -20, 360, 240, k.lg([[0, '#2A6AB0'], [.7, '#F2B868'], [1, '#F2D2A0']])) + flare(k, 236, 92, '#FFD08A', 1.2) + `<g transform="translate(160 236) scale(1 1.25) translate(-160 -236)">${actor(110, 236, 170, { coat: '#3A3A44', d: .2 })}${actor(214, 236, 176, { ...B, coat: '#4A5A3A', d: -.2 })}${actor(160, 240, 196, { ...A, d: 0, long: true })}</g>` + `<ellipse cx="160" cy="196" rx="130" ry="18" fill="none" stroke="#fff" stroke-width="1.6" stroke-dasharray="5 4" opacity=".7"/>` + arrow(k, 'M262 206 Q286 200 290 194', '#fff', 1.6), undefined, tag('LOW 360')) },
    { id: 'pillow', name: 'Pillow shot', aka: 'Ozu pillow shot, curtain shot',
      desc: 'A still, empty shot between scenes: laundry on a line, a hallway, smokestacks, a vase. It rests the eye and lets time pass, like a pause in a poem.',
      spot: 'no people, a quiet still life or empty place, held for several seconds between scenes',
      ref: 'Yasujirō Ozu (Tokyo Story, Late Spring), Paterson, Kogonada\'s Columbus',
      prompt: 'Ozu-style pillow shot: an empty tatami room at low height, a teapot on a low table, paper screens glowing with afternoon light, no people',
      ex: pic(k => { let g = R(-20, -20, 360, 240, '#E8DEC8') + R(-20, 130, 360, 90, '#C8B88A'); for (let x = 20; x < 320; x += 44) g += R(x, 10, 40, 116, '#F6F0E2') + R(x, 10, 40, 116, 'none', 'stroke="#6A4A2A" stroke-width="2"') + R(x + 19, 10, 2, 116, '#8A6A4A', 'opacity=".5"') + R(x, 50, 40, 2, '#8A6A4A', 'opacity=".5"') + R(x, 90, 40, 2, '#8A6A4A', 'opacity=".5"'); g += R(-20, 126, 360, 6, '#4A3220'); for (let x = -20; x < 340; x += 60) g += R(x, 132, 1.5, 90, '#9A8A5A'); g += R(110, 150, 120, 10, '#4A2A1A') + R(118, 160, 8, 30, '#3A2010') + R(214, 160, 8, 30, '#3A2010') + E(162, 140, 14, 11, '#3A4A3A') + R(156, 126, 12, 6, '#3A4A3A', 'rx="2"') + `<path d="M176 136 Q188 130 186 124" stroke="#3A4A3A" stroke-width="3" fill="none"/>` + R(196, 140, 9, 10, '#E9E4DA'); return g; }, undefined, tag('PILLOW SHOT')) },
    { id: 'snorricam', name: 'SnorriCam', aka: 'body-mounted camera, chest rig',
      desc: 'A camera strapped to the actor\'s body, pointing back at their face. The face stays locked in the middle while the world lurches around it, like being drunk, high or panicking.',
      spot: 'the face never moves in the frame while the background tilts, bounces and swings',
      ref: 'Requiem for a Dream, Mean Streets, Pi, Kendrick Lamar and Massive Attack videos',
      prompt: 'SnorriCam shot: the camera rigged to his chest facing his sweating, panicked face, which stays locked in frame while the street lurches and tilts behind him',
      ex: pic(k => `<g transform="rotate(-14 160 100)"><g ${k.blur('5 2')}>${nightStreet(k, { seed: 4, lamp: '#FFB45E' })}</g></g>` + bust(k, { x: 160, y: 92, s: .86, d: 0, gaze: 0, brow: 'up', mouth: 'open', ...B, coat: '#4A4A50' }) + R(-20, 186, 360, 40, '#0A0A0A', 'opacity=".5"'), undefined, tag('BODY RIG')) },
    { id: 'topinsert', name: 'Overhead insert', aka: 'flat-lay insert, Wes Anderson top-down',
      desc: 'A neat top-down shot of hands and objects arranged on a colored surface: a suitcase being packed, a letter, a record player. It reads like a diorama.',
      spot: 'straight-down view, objects laid out at right angles, a pair of hands, a saturated tabletop',
      ref: 'Moonrise Kingdom\'s record player and books, The Royal Tenenbaums, Fantastic Mr. Fox',
      prompt: 'overhead insert shot, straight down on a mustard-yellow suitcase being packed with neatly arranged books, binoculars and a portable record player, two small hands, symmetrical',
      ex: pic(k => R(-20, -20, 360, 240, '#3E7A6E') + R(50, 30, 220, 140, '#E0A83A', 'rx="6"') + R(56, 36, 208, 128, '#C8902A', 'rx="4"') + R(66, 46, 60, 80, '#C8322B') + R(70, 50, 52, 72, '#E8D8B8') + R(140, 46, 40, 40, '#2A2A2E', 'rx="3"') + C(160, 66, 15, '#111') + C(160, 66, 3, '#C8322B') + R(190, 50, 60, 28, '#3A5A8A') + C(204, 64, 10, '#1A2A3A') + C(234, 64, 10, '#1A2A3A') + R(140, 100, 110, 50, '#F2E8D0') + Array.from({ length: 4 }, (_, i) => R(148, 110 + i * 9, 80, 1.5, '#5A4A3A')).join('') + `<path d="M-20 200 L40 160 Q56 150 70 158 L76 170 L40 200Z" fill="#E0AE8C"/><path d="M340 200 L280 160 Q264 150 250 158 L244 170 L280 200Z" fill="#E0AE8C"/>`, undefined, tag('OVERHEAD')) },
    { id: 'tinyfigure', name: 'Monumental scale', aka: 'tiny figure, scale shot',
      desc: 'A minuscule human against an enormous structure or landscape, often in haze. It makes the world feel ancient, alien or indifferent.',
      spot: 'a figure so small you have to look for it, beside a wall, monolith or ship that fills the frame',
      ref: 'Denis Villeneuve (Dune, Arrival, Blade Runner 2049), Lawrence of Arabia, Prometheus',
      prompt: 'monumental scale: a tiny lone figure at the foot of a colossal brutalist monolith rising into thick orange haze, minimal composition',
      ex: pic(k => R(-20, -20, 360, 240, k.lg([[0, '#C8783A'], [.6, '#E8A86A'], [1, '#F2C894']])) + `<g opacity=".9">${Pth('M96 220 L110 -20 L250 -20 L236 220Z', k.lg([[0, '#6A3A1E', .5], [1, '#3A1E0E']]))}</g>` + R(-20, 120, 360, 120, k.lg([[0, '#E8A86A', 0], [1, '#E8A86A', .6]])) + R(-20, 182, 360, 40, '#8A4A22') + actor(90, 184, 9, { coat: '#1A0E06', pants: '#1A0E06', skin: '#1A0E06', hair: '#1A0E06' }), undefined, tag('SCALE')) },
    { id: 'magichourhand', name: 'Hand through the grass', aka: 'Malick shot, magic-hour wander',
      desc: 'A hand drifting over a field of tall grass or wheat at magic hour, the sun flaring low behind it. Paired with whispered voice-over, it stands for memory and grace.',
      spot: 'backlit grass or wheat, golden rim light, a hand or a figure wandering, low sun in the lens',
      ref: 'Terrence Malick (Days of Heaven, The Tree of Life, The New World), Emmanuel Lubezki',
      prompt: 'a hand brushing the tops of tall wheat at magic hour, the low sun flaring directly behind it, golden backlight, floating handheld camera',
      ex: pic(k => R(-20, -20, 360, 240, k.lg([[0, '#6A88B8'], [.5, '#E8B07A'], [.7, '#F6D8A0'], [1, '#C8904A']])) + flare(k, 210, 112, '#FFE2A8', 1.3) + wheat(k, 140, 9, 118, '#E8B860') + wheat(k, 50, 19, 130, '#C88A3A') + `<path d="M-20 150 L50 132 Q70 126 90 128 L130 124 Q140 126 134 132 L104 136 L132 138 Q138 142 130 146 L98 146 L120 150 Q122 156 114 156 L74 154 L-20 176Z" fill="#B87A50"/><path d="M-20 150 L50 132" stroke="#FFD08A" stroke-width="2" opacity=".7"/>`, undefined, tag('MAGIC HOUR')) }
  ]
});

/* ===== Editing ===== */
const train = (k, s = 1) => R(-20, -20, 360, 240, k.lg([[0, '#141A26'], [1, '#2A2A34']])) + Pth('M150 96 L170 96 L260 220 L60 220Z', '#3A3530') + `<path d="M158 96 L110 220 M162 96 L210 220" stroke="#9AA0A8" stroke-width="2.4"/>` + `<g transform="translate(160 96) scale(${s}) translate(-160 -96)">${R(124, 40, 72, 64, '#2A2E36', 'rx="8"')}${R(132, 50, 56, 22, '#8AA0B8', 'opacity=".5"')}${C(160, 88, 9, '#FFF6D8')}</g>` + C(160, 88, 50 * s, k.rg([[0, '#FFF2C8', .8], [1, '#FFF2C8', 0]]));
const runner = (k, s = 1) => nightStreet(k, { wet: true, signs: false }) + `<g transform="translate(160 200) scale(${s}) translate(-160 -200)">${actor(160, 200, 130, { ...B, walk: true, d: .2, arms: 'up' })}</g>`;
const room = (k, o = {}) => R(-20, -20, 360, 240, o.wall || '#C8B8A0') + R(-20, 150, 360, 70, o.floor || '#7A5A40') + R(210, 30, 70, 90, '#E8F0F4') + R(244, 30, 2, 90, '#8A7A6A') + R(210, 74, 70, 2, '#8A7A6A') + R(40, 110, 90, 44, '#6A3A3A', 'rx="6"') + R(36, 100, 14, 54, '#5A2E2E', 'rx="5"') + R(120, 100, 14, 54, '#5A2E2E', 'rx="5"');
const calendar = (k, n) => R(-20, -20, 360, 240, '#D8CCB4') + R(100, 30, 120, 140, '#F4EFE6') + R(100, 30, 120, 30, '#C8322B') + txt(160, 51, 'MARCH', { size: 14, c: '#fff', anchor: 'middle' }) + Array.from({ length: 20 }, (_, i) => txt(114 + (i % 5) * 23, 80 + Math.floor(i / 5) * 22, String(i + 1), { size: 9, c: '#333', anchor: 'middle' }) + (i < n ? `<path d="M${105 + (i % 5) * 23} ${70 + Math.floor(i / 5) * 22} l18 14 M${123 + (i % 5) * 23} ${70 + Math.floor(i / 5) * 22} l-18 14" stroke="#C8322B" stroke-width="1.6"/>` : '')).join('');
const eyesCrop = (k, o = {}) => `<svg x="0" y="0" width="320" height="200" viewBox="104 74 112 70" preserveAspectRatio="xMidYMid slice">${R(0, 0, 320, 200, '#D6A27F')}${bust(k, { x: 160, y: 104, d: 0, ...o })}</svg>`;
const faceNeutral = k => R(-20, -20, 360, 240, '#2A2A2A') + bust(k, { x: 160, y: 96, s: .82, d: 0, gaze: 0, coat: '#3A3A3A', hair: '#2A1A12' });

pool.groups.push({
  id: 'scenecuts', title: 'Cutting a scene', slot: 'Edit',
  intro: 'How an editor joins shots to build tension, compress time or put two ideas side by side. Read the storyboards left to right; the red words are how a screenplay would mark the cut.',
  terms: [
    { id: 'crosscut', name: 'Cross-cutting', aka: 'cross-cut, intercutting',
      desc: 'Cutting back and forth between two things happening at the same time in different places, usually racing toward each other. Each cut makes the shots shorter and the stakes higher.',
      spot: 'the film alternates between two locations, and the shots get shorter as they converge',
      ref: 'D.W. Griffith\'s last-minute rescues, The Silence of the Lambs\' doorbell, The Dark Knight\'s ferries',
      prompt: 'cross-cut between the hero sprinting through the rain and the train bearing down, alternating shots that get shorter and closer',
      ex: pic(k => board(k, [{ d: k => train(k, .7), cap: 'TRAIN' }, { d: k => runner(k, .8), cap: 'HERO', t: 'CUT TO:' }, { d: k => train(k, 1.6), cap: 'CLOSER', t: 'CUT TO:' }, { d: k => runner(k, 1.5), cap: 'CLOSER', t: 'CUT TO:' }])) },
    { id: 'parallel', name: 'Parallel editing', aka: 'parallel action across time',
      desc: 'Alternating between two storylines that are not happening at the same moment (a father and a son decades apart, or two strangers in different cities) so each comments on the other.',
      spot: 'two stories in different times or places, often in different color treatments, alternating',
      ref: 'The Godfather Part II, Cloud Atlas, Intolerance, Moonlight\'s three chapters',
      prompt: 'parallel editing between a young father in 1917 in sepia and his grown son in the present day in color, the scenes echoing each other',
      ex: pic(k => board(k, [{ d: k => graded(k, 'sepia', nightStreet(k, { signs: false, lamp: '#FFD8A0' }) + actor(150, 186, 120, { coat: '#3A3A3A', hat: '#2A2A2A', d: .3 })) + k.grain(.3), cap: '1917' }, { d: k => skyline(k) + actor(170, 196, 124, { ...B, d: -.3 }), cap: 'TODAY', t: 'CUT TO:' }, { d: k => graded(k, 'sepia', room(k) + actor(170, 176, 110, { coat: '#3A3A3A', d: -.5, hat: '#2A2A2A' })) + k.grain(.3), cap: '1917', t: 'CUT TO:' }, { d: k => room(k, { wall: '#6A8A9A', floor: '#3A3A44' }) + actor(170, 176, 110, { ...B, d: -.5 }), cap: 'TODAY', t: 'CUT TO:' }])) },
    { id: 'kuleshov', name: 'Kuleshov effect', aka: 'context editing',
      desc: 'The same blank face reads as hunger, grief or tenderness depending on the shot cut next to it. The audience supplies the emotion; the cut does the acting.',
      spot: 'a neutral reaction shot whose meaning comes entirely from what it\'s placed beside',
      ref: 'Lev Kuleshov\'s 1910s experiment, Hitchcock explaining it on camera, every reality-TV edit',
      prompt: 'Kuleshov-style edit: hold on a neutral, unreadable face, then cut to the thing he sees, letting the cut supply the emotion',
      ex: pic(k => board(k, [{ d: faceNeutral, cap: 'SAME FACE' }, { d: faceNeutral, cap: 'SAME FACE' }, { d: faceNeutral, cap: 'SAME FACE' }, { d: k => R(-20, -20, 360, 240, '#6A4A30') + E(160, 110, 90, 40, '#E9E4DA') + E(160, 104, 74, 28, '#C86A3A') + R(240, 70, 10, 90, '#B8B8B8', 'rx="4"'), cap: '= HUNGER' }, { d: k => R(-20, -20, 360, 240, '#1A1A1E') + Pth('M80 150 L110 70 L210 70 L240 150Z', '#5A3A24') + R(80, 150, 160, 16, '#3A2416') + C(250, 60, 20, '#FFE2A8', 'opacity=".5"'), cap: '= GRIEF' }, { d: k => land(k, { hz: 120, ground: '#6A9A4A', ground2: '#9ACA6A' }) + actor(160, 176, 70, { coat: '#E8A0B8', d: .2, long: true, hair: '#C9803A' }), cap: '= TENDERNESS' }], { cols: 3, nums: false })) },
    { id: 'axial', name: 'Axial cut', aka: 'cut-in on the axis, punch-in',
      desc: 'Jumping straight closer (or farther) along the line of the lens, in one or more abrupt steps. It hits like a gasp; Kurosawa used two or three in a row.',
      spot: 'the angle doesn\'t change, only the size, in sudden jumps toward the subject',
      ref: 'Kurosawa\'s Seven Samurai, the farmhouse in Hitchcock\'s The Birds, Breaking Bad',
      prompt: 'axial cut: two abrupt cut-ins straight down the lens axis, from a wide shot of a man in a field to a medium shot to a close-up',
      ex: pic(k => board(k, [{ d: k => world(k), vb: crop(160, 70, 380), cap: 'WIDE' }, { d: k => world(k), vb: crop(160, 78, 110), cap: 'CUT IN', t: '' }, { d: k => world(k), vb: crop(160, 50, 38), cap: 'CUT IN', t: '' }], { extra: arrow(k, 'M60 150 L270 150', '#F2C14E', 1.4) + txt(160, 164, 'SAME AXIS', { size: 7, c: '#F2C14E', anchor: 'middle' }) })) },
    { id: 'elliptical', name: 'Elliptical edit', aka: 'ellipsis, time cut',
      desc: 'Leaving out the boring middle of an action: she leaves the house, and the next shot she is already at the sea. The audience fills the gap without noticing.',
      spot: 'a jump forward in time or place with no transition, and you understand it instantly',
      ref: 'Lawrence of Arabia\'s match to the desert, Jeanne Dielman for the opposite, every road trip film',
      prompt: 'elliptical edit: she shuts her front door, then cut straight to her arriving at the empty beach, skipping the journey',
      ex: pic(k => board(k, [{ d: k => doorway(k, 120, 30, 80, 150, '#FFE2A8', '#3A4A5A') + actor(160, 180, 140, { ...A, back: true, long: true, shadow: false }), cap: 'LEAVES HOME' }, { d: k => road(k) + `<path d="M40 30 L280 170 M280 30 L40 170" stroke="#FF5A6E" stroke-width="10"/>`, cap: '(THE DRIVE)', t: '' }, { d: k => land(k, { hz: 100, water: true, sky: ['#7AA6D6', '#C8DCEC', '#F2EAD8'], shore: 160, shoreC: '#D8C8A0' }) + actor(150, 190, 70, { ...A, back: true, long: true }), cap: 'AT THE SEA', t: 'CUT TO:' }])) },
    { id: 'longtake', name: 'Long take', aka: 'oner, one-shot, sequence shot',
      desc: 'A whole scene, or a whole film, in one unbroken shot with no cuts. The camera moves through rooms and crowds, and the tension builds because nothing lets you look away.',
      spot: 'minutes go by without a cut while the camera follows people from space to space',
      ref: 'Goodfellas\' Copacabana entrance, Touch of Evil\'s opening, Children of Men, 1917, Russian Ark',
      prompt: 'one continuous long take with no cuts: the camera follows them in through the kitchen, along the corridor and out into the crowded club',
      ex: pic(k => plan(k, { set: `<g fill="none" stroke="#E9E2D6" stroke-opacity=".6" stroke-width="3"><path d="M20 30 H140 V90 M20 30 V170 H110 M140 120 V170 H300 V30 H180 V90"/></g>` + txt(52, 52, 'STREET', { size: 7, c: '#fff', op: .5 }) + txt(150, 160, 'KITCHEN', { size: 7, c: '#fff', op: .5 }) + txt(250, 52, 'CLUB', { size: 7, c: '#fff', op: .5 }), actors: [{ x: 60, y: 122, a: 0, c: '#C86A54' }, { x: 250, y: 110, a: -90, c: '#C86A54' }], arrows: [{ d: 'M40 140 C90 150 110 110 160 110 S180 150 220 150 S270 120 260 70', c: CAMC, w: 2, dash: true }], extra: txt(312, 192, 'ONE TAKE  03:10', { size: 8, c: CAMC, anchor: 'end' }) + R(30, 132, 10, 10, CAMC, 'rx="2"') })) },
    { id: 'splitscreen', name: 'Split screen', aka: 'split-screen, multi-frame',
      desc: 'Two or more shots side by side in one frame, so the audience watches both at once. Good for phone calls, simultaneous action and stylized, comic-book energy.',
      spot: 'a hard line dividing the frame into separate shots, often of people talking to each other',
      ref: 'Pillow Talk, Carrie\'s prom, Kill Bill\'s hospital, (500) Days of Summer\'s expectations vs reality',
      prompt: 'split screen: the left half shows her on the phone in a pink bedroom, the right half shows him on the phone in a blue office, the two halves divided by a clean line',
      ex: pic(k => `<svg x="0" y="0" width="159" height="200" viewBox="80 0 159 200">${R(0, -20, 320, 240, '#E8A6B8')}${R(0, 150, 320, 70, '#C87890')}${bust(k, { x: 160, y: 98, s: .82, d: .3, ...A, long: true, over: R(30, -20, 16, 40, '#222', 'rx="5"') + E(38, 24, 9, 14, '#E0AE8C') })}</svg>` + `<svg x="161" y="0" width="159" height="200" viewBox="80 0 159 200">${R(0, -20, 320, 240, '#6A8AB8')}${R(0, 150, 320, 70, '#3A5A88')}${bust(k, { x: 160, y: 98, s: .82, d: -.3, ...B, over: R(-46, -20, 16, 40, '#222', 'rx="5"') + E(-38, 24, 9, 14, '#8E5C40') })}</svg>` + R(158, -20, 4, 240, '#111'), undefined, tag('SPLIT SCREEN')) },
    { id: 'freeze', name: 'Freeze frame', aka: 'freeze, still frame',
      desc: 'The action stops dead on one frame, often at the end of a film or the moment a character is introduced. It turns a moment into a memory, a verdict or a joke.',
      spot: 'the picture suddenly stops while sound or narration carries on',
      ref: 'the last shot of The 400 Blows, Butch Cassidy and the Sundance Kid, Goodfellas\' character freezes, Thelma & Louise',
      prompt: 'freeze frame on the boy\'s face as he turns to look straight into the camera on the beach, the image stops, grainy black and white',
      ex: pic(k => graded(k, 'trix', land(k, { hz: 112, water: true, sky: ['#9AA8B8', '#C8D0D8', '#E8ECEC'], shore: 150, shoreC: '#B8A88A' }) + bust(k, { x: 160, y: 100, s: .76, d: 0, gaze: 0, coat: '#3A3A3A', hair: '#2A1A12' })) + k.grain(.4) + R(18, 168, 6, 18, '#fff') + R(28, 168, 6, 18, '#fff') + txt(42, 182, '00:01:39:12', { size: 9, c: '#fff' }), undefined, tag('FREEZE')) }
  ]
});

pool.groups.push({
  id: 'montage', title: 'Montage & time', slot: 'Edit',
  intro: 'Editing that compresses weeks into a minute, makes ideas out of images, or plays with the order of events. The Motion workbook covers the transitions themselves (dissolves, wipes, smash cuts).',
  terms: [
    { id: 'trainingmontage', name: 'Montage sequence', aka: 'training montage, time-passing montage',
      desc: 'A run of short shots, usually over a song, that squeezes a long process (training, falling in love, building a house) into a minute or two.',
      spot: 'many brief shots of the same activity over different days, set to music, ending on a triumph',
      ref: 'Rocky\'s run up the museum steps, Team America\'s "Montage" song, Up\'s marriage sequence',
      prompt: 'montage sequence over an upbeat song: dawn runs, the calendar filling up, the sweat, and finally arms raised at the top of the steps',
      ex: pic(k => board(k, [{ d: k => road(k, { sky: ['#4A4A7A', '#D88A6A', '#F2C89A'], hz: 120 }) + actor(150, 184, 80, { coat: '#6A6A70', walk: true }), cap: 'DAWN RUN' }, { d: k => calendar(k, 6), cap: 'WEEK 1' }, { d: k => R(-20, -20, 360, 240, '#3A3A40') + bust(k, { x: 160, y: 100, s: .8, d: .2, brow: 'down', mouth: 'frown', coat: '#6A6A70', hair: '#2A1A12', over: C(-24, -20, 3, '#CFE6F2') + C(30, -10, 2.6, '#CFE6F2') }), cap: 'SWEAT' }, { d: k => calendar(k, 18), cap: 'WEEK 3' }, { d: k => R(-20, -20, 360, 240, '#4A4044') + R(120, 20, 40, 110, '#8A2A2A', 'rx="14"') + actor(220, 196, 160, { coat: '#6A6A70', arms: 'out', d: -.6 }), cap: 'THE BAG' }, { d: k => skyline(k, { sky: [[0, '#5A7AB8'], [.7, '#F2B87A'], [1, '#FFE2A8']] }) + `<path d="M-20 220 L-20 190 L60 190 L60 176 L120 176 L120 162 L340 162 L340 220Z" fill="#8A8070"/>` + actor(200, 164, 90, { coat: '#6A6A70', arms: 'up' }), cap: 'TRIUMPH' }])) },
    { id: 'soviet', name: 'Soviet montage', aka: 'intellectual montage, collision montage',
      desc: 'Shots chosen to collide, so their meaning comes from the clash between them: marching boots, a screaming face, a runaway pram. Eisenstein thought of editing as an argument.',
      spot: 'jarring, rhythmic cuts between bold, high-contrast images that build an idea rather than a place',
      ref: 'Battleship Potemkin\'s Odessa Steps, Strike, Man with a Movie Camera, The Untouchables\' homage',
      prompt: 'Soviet montage on a great stone staircase: a crowd fleeing, a line of soldiers\' boots marching down, a baby carriage rolling loose, stark black and white, hard rhythmic cuts',
      ex: pic(k => board(k, [{ d: k => graded(k, 'trix', R(-20, -20, 360, 240, '#9A9A9A') + Array.from({ length: 9 }, (_, i) => `<path d="M-20 ${30 + i * 22} L340 ${10 + i * 22}" stroke="#555" stroke-width="2"/>`).join('') + [40, 90, 130, 180, 230, 270].map((x, i) => actor(x, 100 + i * 16, 50, { coat: '#222', walk: true, d: .6 })).join('')), cap: 'CROWD' }, { d: k => graded(k, 'trix', R(-20, -20, 360, 240, '#B8B8B8') + `<path d="M-20 160 L340 120" stroke="#444" stroke-width="3"/>` + [40, 110, 180, 250].map(x => R(x, 40, 40, 90, '#1A1A1A') + R(x - 6, 126, 52, 16, '#0A0A0A', 'rx="4"')).join('')), cap: 'BOOTS', t: 'CUT:' }, { d: k => graded(k, 'trix', R(-20, -20, 360, 240, '#A0A0A0') + Array.from({ length: 9 }, (_, i) => `<path d="M-20 ${20 + i * 22} L340 ${60 + i * 22}" stroke="#555" stroke-width="2"/>`).join('') + `<g transform="rotate(14 160 110)">${R(110, 70, 100, 50, '#222', 'rx="10"')}${Pth('M110 70 Q120 30 170 40 L170 70Z', '#333')}${C(126, 130, 16, 'none', 'stroke="#111" stroke-width="5"')}${C(196, 130, 16, 'none', 'stroke="#111" stroke-width="5"')}</g>`), cap: 'PRAM', t: 'CUT:' }])) },
    { id: 'hiphop', name: 'Hip-hop montage', aka: 'rapid-fire close-up montage',
      desc: 'A burst of tiny, extreme close-ups, each a few frames long and punched with a sound effect: a pupil dilates, a pill drops, coffee pours. It turns a routine into a ritual or an addiction.',
      spot: 'half-second macro shots with exaggerated sound, repeated whenever the routine repeats',
      ref: 'Darren Aronofsky (Requiem for a Dream, Pi), Edgar Wright (Shaun of the Dead, Hot Fuzz)',
      prompt: 'hip-hop montage: rapid-fire extreme close-ups, each a few frames long, of a key in a lock, coffee pouring, a match striking and a pupil dilating, each hit with a sharp sound',
      ex: pic(k => board(k, [{ d: k => eyesCrop(k, A), cap: 'EYE' }, { d: k => R(-20, -20, 360, 240, '#2A1A12') + C(160, 100, 80, '#F4EFE6') + C(160, 100, 62, '#3A1E10') + `<path d="M150 -20 Q156 40 160 100" stroke="#5A3018" stroke-width="16" fill="none"/>`, cap: 'POUR' }, { d: k => R(-20, -20, 360, 240, '#0A0A0E') + R(150, 70, 14, 140, '#E0C890') + C(157, 64, 12, '#C8322B') + E(157, 40, 16, 30, '#FFB45E', k.blur(3)) + E(157, 46, 7, 14, '#FFF2C8'), cap: 'STRIKE' }, { d: k => R(-20, -20, 360, 240, '#8A8A90') + C(160, 100, 60, '#B8B8C0') + R(150, 60, 20, 60, '#2A2A2E', 'rx="8"') + R(156, 20, 8, 80, '#C9A24A') + C(160, 14, 20, 'none', 'stroke="#C9A24A" stroke-width="8"'), cap: 'LOCK' }, { d: k => R(-20, -20, 360, 240, '#E8E4DC') + C(160, 100, 26, '#F4F4F4', 'stroke="#ccc"') + `<g transform="rotate(30 160 100)">${R(134, 86, 52, 28, '#E8E8F0', 'rx="14"')}${R(160, 86, 26, 28, '#4A7AC8', 'rx="0"')}</g>`, cap: 'PILL' }, { d: k => eyesCrop(k, { ...A, brow: 'up' }) + C(126, 100, 0, '#000'), cap: 'EYE' }], { tc: '#F2C14E' }) + txt(312, 14, '6 FRAMES EACH', { size: 7, c: '#F2C14E', anchor: 'end' })) },
    { id: 'graphicmatch', name: 'Graphic match cut', aka: 'match cut on shape',
      desc: 'A cut between two shots whose shapes, positions or movements match exactly, so one object seems to turn into another. The rhyme makes a leap across time or space feel inevitable.',
      spot: 'a shape in the same spot of the frame before and after the cut: a bone and a spaceship, an eye and a moon',
      ref: 'the bone-to-satellite cut in 2001: A Space Odyssey, Lawrence of Arabia\'s match, Psycho\'s drain to eye',
      prompt: 'graphic match cut: a bone tossed into a blue sky spins at the top of its arc and becomes a long white satellite drifting in black space in the same position',
      ex: pic(k => board(k, [{ d: k => R(-20, -20, 360, 240, k.lg([[0, '#3A6AB0'], [1, '#9AC0E0']])) + `<g transform="rotate(-28 160 100)">${R(110, 92, 100, 16, '#F2EEE4', 'rx="8"')}${C(108, 92, 12, '#F2EEE4')}${C(108, 108, 12, '#F2EEE4')}${C(212, 92, 12, '#F2EEE4')}${C(212, 108, 12, '#F2EEE4')}</g>`, cap: 'BONE' }, { d: k => R(-20, -20, 360, 240, '#05060C') + stars(80, 8) + `<g transform="rotate(-28 160 100)">${R(96, 90, 128, 20, '#E8E8EE')}${R(124, 80, 20, 40, '#C8C8D0')}${R(176, 80, 20, 40, '#C8C8D0')}${R(206, 70, 12, 60, '#8A9AB8')}</g>` + C(290, 40, 60, '#2A4A8A', 'opacity=".5"'), cap: 'SATELLITE', t: 'MATCH CUT TO:' }])) },
    { id: 'jumpcut', name: 'Jump cut', aka: 'Godard jump cut',
      desc: 'Cutting between two shots of the same subject from almost the same angle, so they seem to skip forward in time. Once an error, it became the signature of the French New Wave and of YouTube vlogs.',
      spot: 'the frame stays the same while the person suddenly jumps to a new position or moment',
      ref: 'Breathless (1960), Annie Hall, Lost in Translation\'s hotel room, every vlog',
      prompt: 'jump cuts in a single fixed framing of a hotel room: she sits on the bed, then lies across it, then stands at the window, time skipping between each cut',
      ex: pic(k => board(k, [{ d: k => room(k) + actor(86, 140, 70, { ...A, long: true, d: .2, shadow: false }), cap: 'ON THE SOFA' }, { d: k => room(k) + actor(170, 176, 110, { ...A, long: true, d: -.3 }), cap: 'STANDING', t: 'JUMP:' }, { d: k => room(k) + actor(246, 150, 96, { ...A, long: true, back: true, shadow: false }), cap: 'AT WINDOW', t: 'JUMP:' }])) },
    { id: 'flashback', name: 'Flashback', aka: 'analepsis, memory sequence',
      desc: 'A jump back to an earlier time, usually signaled by a push in on a face, a dissolve and a change in color or texture. It explains who someone is by showing what happened to them.',
      spot: 'a close-up of someone remembering, then the image softens or changes color and we\'re in the past',
      ref: 'Citizen Kane, The Godfather Part II, Lost, the "Rosebud" sled',
      prompt: 'flashback: push in on her face as she remembers, slow dissolve to a warm, faded, grainy image of her as a child on a summer lawn',
      ex: pic(k => board(k, [{ d: k => R(-20, -20, 360, 240, '#2A3440') + bust(k, { x: 160, y: 98, s: .82, d: .2, gaze: 3, gazeY: -1.6, ...A, long: true }), cap: 'NOW' }, { d: k => `<g opacity=".5">${R(-20, -20, 360, 240, '#2A3440')}${bust(k, { x: 160, y: 98, s: .82, d: .2, gaze: 3, ...A, long: true })}</g><g opacity=".55">${graded(k, 'super8', land(k, { hz: 120, ground: '#6A9A4A', ground2: '#9ACA6A' }) + actor(160, 180, 70, { coat: '#E8C04A', long: true, hair: '#2A1A12', skin: '#E0AE8C' }))}</g>`, cap: 'DISSOLVE', t: '' }, { d: k => graded(k, 'super8', land(k, { hz: 120, ground: '#6A9A4A', ground2: '#9ACA6A', sun: { x: 260, y: 40, r: 10, c: '#FFE2A8' } }) + tree(60, 130, 90, '#4E7A3A', '#3A2A1C') + actor(160, 180, 70, { coat: '#E8C04A', long: true, hair: '#2A1A12', skin: '#E0AE8C' })) + k.grain(.35) + k.vignette(.5), cap: 'THE PAST', t: '' }])) },
    { id: 'nonlinear', name: 'Nonlinear timeline', aka: 'fractured chronology, out-of-order structure',
      desc: 'The story is told out of order: the ending first, chapters shuffled, or scenes running backward. The audience pieces the timeline together, which makes them part of the puzzle.',
      spot: 'title cards or chapter breaks that jump around in time, characters who are dead in one scene and alive in the next',
      ref: 'Pulp Fiction, Memento, Eternal Sunshine of the Spotless Mind, Arrival, Rashomon',
      prompt: 'tell it as a nonlinear timeline: open on the aftermath, then jump back to the morning, then to a week earlier, with chapter title cards',
      ex: pic(k => { const cols = ['#C8322B', '#E07A2A', '#E8C04A', '#4AA86A', '#3A7AC8', '#8A5AC8']; let g = R(-20, -20, 360, 240, '#161314') + txt(20, 40, 'STORY ORDER', { size: 8, c: '#fff', op: .6 }) + txt(20, 150, 'FILM ORDER', { size: 8, c: '#fff', op: .6 }); const order = [3, 1, 5, 0, 4, 2]; cols.forEach((c, i) => { g += R(20 + i * 48, 48, 42, 24, c, 'rx="3"') + txt(41 + i * 48, 64, String(i + 1), { size: 10, c: '#111', anchor: 'middle' }); }); order.forEach((s, j) => { g += R(20 + j * 48, 158, 42, 24, cols[s], 'rx="3"') + txt(41 + j * 48, 174, String(s + 1), { size: 10, c: '#111', anchor: 'middle' }) + `<path d="M${41 + s * 48} 74 C${41 + s * 48} 115 ${41 + j * 48} 115 ${41 + j * 48} 156" stroke="${cols[s]}" stroke-width="1.6" fill="none" opacity=".75"/>`; }); return g; }) }
  ]
});

/* ===== Light & color for the screen ===== */
Object.assign(LOOK, {
  threestrip: sat(1.9) + lin(1.22, -.08),
  twostrip: mat('1 .05 0 0 0  .05 .92 .05 0 0  .05 .55 .25 0 .02  0 0 0 1 0') + sat(1.25) + lin(1.08, -.02),
  matrixgreen: mat('.7 .12 0 0 0  .06 1 .1 0 .04  0 .14 .62 0 0  0 0 0 1 0') + lin(1.18, -.08),
  amelie: curve('.04 .3 .64 .94 1', '.06 .38 .66 .9 .96', '0 .14 .36 .58 .72') + sat(1.35),
  fincher: sat(.5) + mat('.92 .06 0 0 .01  .02 1 0 0 .02  0 .04 .72 0 0  0 0 0 1 0') + lin(.95, -.04),
  yellowfilter: sat(1.2) + mat('1.1 .12 0 0 .06  .06 1 0 0 .05  0 0 .45 0 0  0 0 0 1 0') + lin(1.15, -.03),
  wardesat: sat(.22) + mat('.95 0 0 0 0  0 .98 0 0 0  0 .02 1.04 0 .01  0 0 0 1 0') + lin(1.35, -.13),
  dayfornight: mat('.25 .1 .05 0 0  .1 .32 .1 0 .01  .1 .2 .6 0 .06  0 0 0 1 0') + lin(1.1, -.04),
  modernbw: BW(.25, .65, .1) + lin(1.15, -.05),
  noirbw: BW() + lin(1.6, -.3)
});
// a small-town main street in daylight: the reference scene for the grades
function mainStreet(k, o = {}) {
  let g = R(-20, -20, 360, 240, k.lg([[0, '#3E7FD0'], [1, '#A8CCEC']])) + E(80, 30, 40, 10, '#fff', 'opacity=".85"') + E(250, 22, 30, 8, '#fff', 'opacity=".85"');
  g += facade(k, -10, 60, 80, 90, '#C8504A', '#F4E2C2', 3, 3) + facade(k, 70, 40, 90, 110, '#E8D4A8', '#5A7A9A', 4, 4) + facade(k, 160, 70, 70, 80, '#4A8A6A', '#F4E2C2', 3, 3) + facade(k, 230, 50, 100, 100, '#3A5A9A', '#F2D27A', 4, 4);
  g += Pth('M70 112 L160 112 L168 124 L62 124Z', '#C8322B') + Array.from({ length: 6 }, (_, i) => Pth(`M${70 + i * 15} 112 L${77 + i * 15} 112 L${75 + i * 16} 124 L${68 + i * 16} 124Z`, '#F4EFE6')).join('');
  g += R(-20, 150, 360, 70, '#8A8A86') + R(-20, 150, 360, 8, '#C8C2B4') + tree(196, 152, 60, '#3A8A3A', '#4A3020');
  g += car(250, 186, 1, '#C8322B') + actor(120, 184, 66, { coat: '#E8C04A', d: .3, long: true, hair: '#2A1A12' }) + actor(150, 186, 70, { coat: '#2A6AC8', d: -.3 });
  return g;
}
const tvRoom = k => R(-20, -20, 360, 240, '#06080E') + R(-20, 140, 360, 80, '#0A0C12') + R(30, 120, 160, 50, '#1A2230', 'rx="10"') + R(24, 104, 20, 66, '#141A26', 'rx="8"') + R(176, 104, 20, 66, '#141A26', 'rx="8"');

pool.groups.push({
  id: 'cinelight', title: 'Lighting the scene', slot: 'Lighting',
  intro: 'Film lighting has to hold up across a whole scene and every angle, so it\'s planned around a source the audience believes in. The Photography workbook covers lighting patterns and quality; these are the cinema setups.',
  terms: [
    { id: 'motivated', name: 'Motivated lighting', aka: 'source lighting, naturalistic lighting',
      desc: 'Every light on set pretends to come from something in the scene: a window, a lamp, a fridge, a fire. The audience never questions it, so the image feels real.',
      spot: 'you can point to where each light comes from, and the shadows agree with it',
      ref: 'Roger Deakins, Gordon Willis, nearly all modern drama',
      prompt: 'motivated lighting: soft daylight from a tall window on the right falls across her face, the side away from the window falls into shadow, no other visible source',
      ex: pic(k => R(-20, -20, 360, 240, '#2A2622') + R(236, 10, 70, 150, '#E8EEF2') + R(268, 10, 4, 150, '#3A3430') + R(236, 80, 70, 4, '#3A3430') + Pth('M236 10 L306 10 L140 220 L20 220Z', '#E8EEF2', `opacity=".12" ${k.blur(6)}`) + bust(k, { x: 140, y: 100, s: .86, d: .35, gaze: 5, ...A, long: true, shade: shadeSide(k, -1, 26, .78, -6) }), undefined, tag('WINDOW SOURCE')) },
    { id: 'practical', name: 'Practicals', aka: 'practical lights, in-frame sources',
      desc: 'Lamps, neon signs, candles and screens that appear in the shot and actually light it. They make a set feel lived in and give the frame warm points of light.',
      spot: 'visible lamps or signs in the frame, each casting a pool of light on the people near it',
      ref: 'Drive, Taxi Driver, Wong Kar-wai, Edward Hopper\'s Nighthawks',
      prompt: 'lit by practicals in frame: a green banker\'s lamp on the bar, a red neon beer sign and a string of bulbs, warm pools of light in a dark room',
      ex: pic(k => R(-20, -20, 360, 240, '#0E0C10') + Array.from({ length: 9 }, (_, i) => C(20 + i * 36, 20 + Math.sin(i) * 6, 3, '#FFE2A8') + C(20 + i * 36, 20 + Math.sin(i) * 6, 12, k.rg([[0, '#FFE2A8', .5], [1, '#FFE2A8', 0]]))).join('') + `<g ${k.blur(3)}>${R(222, 50, 70, 22, '#FF3A4A', 'rx="6"')}</g>` + txt(257, 66, 'BEER', { size: 14, c: '#FFD0D4', anchor: 'middle' }) + bust(k, { x: 150, y: 108, s: .8, d: -.3, ...B, shade: shadeSide(k, 1, 30, .7, 10) + tint(k, '#FF6A3A', 1, .35) }) + R(-20, 160, 360, 60, '#2A1A12') + R(50, 128, 4, 32, '#B8A060') + Pth('M36 128 L68 128 L62 116 L42 116Z', '#2A7A4A') + C(52, 132, 40, k.rg([[0, '#FFE8B0', .5], [1, '#FFE8B0', 0]])), undefined, tag('PRACTICALS')) },
    { id: 'blinds', name: 'Venetian-blind noir', aka: 'blinds shadow, slatted light',
      desc: 'Hard light through venetian blinds throws bars of shadow across a face and wall. It is shorthand for film noir: secrets, guilt and a detective\'s office at night.',
      spot: 'diagonal stripes of light and shadow across a person and the wall behind them, usually in black and white',
      ref: 'Double Indemnity, The Big Sleep, Blade Runner, Who Framed Roger Rabbit',
      prompt: 'film noir: hard light through venetian blinds casting diagonal bars of shadow across a detective\'s face and the wall, cigarette smoke, high-contrast black and white',
      ex: pic(k => graded(k, 'noirbw', R(-20, -20, 360, 240, '#3A3A3A') + bust(k, { x: 150, y: 104, s: .86, d: .3, hat: '#2A2A2A', coat: '#2A2A2A', hair: '#1A1A1A', skin: '#B8A090', brow: 'down' }) + venetian(k, -20, -40, 360, 300, 11, '#F4F0E8', -22, .6) + `<g ${k.blur(6)} opacity=".35"><path d="M196 140 Q220 110 200 80 Q186 50 210 20" stroke="#fff" stroke-width="10" fill="none"/></g>`) + k.grain(.3), undefined, tag('BLINDS')) },
    { id: 'toplight', name: 'Top light', aka: 'overhead light, Gordon Willis light',
      desc: 'A single soft light from directly above. Foreheads and shoulders glow while the eyes sink into shadow, so you can\'t quite read what someone is thinking.',
      spot: 'bright tops of heads and noses, dark eye sockets, a dim amber room',
      ref: 'Gordon Willis on The Godfather (the "Prince of Darkness"), Apocalypse Now\'s Kurtz',
      prompt: 'Gordon Willis top light: one soft source directly overhead, a man at a desk with his eyes lost in shadow, warm amber, underexposed and dark',
      ex: pic(k => R(-20, -20, 360, 240, k.rg([[0, '#3A2A1A'], [1, '#0A0604']], .5, .2, .9)) + bust(k, { x: 160, y: 106, s: .86, d: .1, gaze: 0, coat: '#141010', collar: '#E8D8C0', hair: '#1A120C', skin: '#C08860', shade: shadeV(k, -1, 26, .82, 6) + E(-15, -4, 16, 9, SH, `opacity=".7" ${k.blur(3)}`) + E(15, -4, 16, 9, SH, `opacity=".7" ${k.blur(3)}`) }) + C(160, -30, 60, k.rg([[0, '#FFD8A0', .5], [1, '#FFD8A0', 0]])), undefined, tag('TOP LIGHT')) },
    { id: 'dayfornight', name: 'Day for night', aka: 'nuit américaine, American night',
      desc: 'Shooting in daylight and darkening and tinting it blue to pass for moonlight. Old westerns did it constantly; it gives a strange, flat, dreamlike night.',
      spot: 'a "night" scene with sharp shadows, a bright sky and no lamps, everything a deep steel blue',
      ref: 'Mad Max: Fury Road\'s night chase, classic westerns, Truffaut\'s Day for Night',
      prompt: 'day-for-night: a rider crossing a desert under hard sun, graded deep blue and underexposed to read as moonlit night, crisp shadows',
      ex: pic(k => { const sc = k => land(k, { hz: 110, sky: ['#3A7AC8', '#9AC4E8', '#E8E0C8'], ground: '#B08050', ground2: '#D8B080', mtn: '#B88A64', sun: { x: 70, y: 30, r: 8, c: '#FFF2C8' } }) + actor(160, 172, 70, { coat: '#5A3A2A', hat: '#3A2A1C', d: .6 }) + longShadow(160, 172, 50, .1); return `<svg x="0" y="0" width="160" height="200" viewBox="0 0 160 200">${sc(k)}</svg><svg x="160" y="0" width="160" height="200" viewBox="160 0 160 200">${graded(k, 'dayfornight', sc(k))}</svg>` + R(159, -20, 2, 240, '#fff') + txt(8, 192, 'AS SHOT', { size: 8 }) + txt(312, 192, 'AS GRADED', { size: 8, anchor: 'end' }); }) },
    { id: 'availablelight', name: 'Available light only', aka: 'natural light, no film lights',
      desc: 'No film lights at all: only the sun, the sky, fire and whatever the location provides, often caught at the edges of the day. It looks raw and beautiful, and it is hard to schedule.',
      spot: 'soft, low-contrast skylight on faces, real fire glow, wide lenses close to the actors',
      ref: 'The Revenant (Lubezki), Barry Lyndon\'s exteriors, Nomadland, Days of Heaven',
      prompt: 'available light only: a trapper in a snowy forest at dusk, lit by the cold blue sky and a small campfire, wide lens close to his face, no film lights',
      ex: pic(k => R(-20, -20, 360, 240, k.lg([[0, '#6A7A98'], [1, '#B8C4D4']])) + Array.from({ length: 14 }, (_, i) => R(i * 26 - 10, -20, 6 + (i % 3) * 3, 200, '#2A2E3A', `opacity="${.5 + (i % 4) * .12}"`)).join('') + R(-20, 150, 360, 70, '#DCE2EA') + E(240, 168, 20, 5, '#FF8A3A', k.blur(2)) + Pth('M232 168 Q236 150 240 140 Q246 152 248 168Z', '#FFB45E') + bust(k, { x: 120, y: 112, s: .82, d: .5, gaze: 6, coat: '#5A4A3A', hair: '#2A1A12', skin: '#C89878', hat: '#4A3A2A', shade: tint(k, '#FF8A3A', 1, .35, 50) + R(-60, -60, 120, 120, '#6A7AA0', 'opacity=".18"') }) + k.grain(.15), undefined, tag('NO FILM LIGHTS')) },
    { id: 'candlelit', name: 'Candlelight', aka: 'Barry Lyndon candlelight, firelight interior',
      desc: 'Faces lit only by candles: warm, soft, flickering, with rich darkness all around. Kubrick shot Barry Lyndon with NASA lenses fast enough to do it for real.',
      spot: 'a warm golden glow on faces near the flames, deep brown darkness beyond, very shallow focus',
      ref: 'Barry Lyndon, Amadeus, Kingdom of Heaven, Georges de La Tour paintings',
      prompt: 'lit only by candlelight: two figures in 18th-century dress at a card table, warm golden glow on their faces, rich darkness beyond, soft and grainy',
      ex: pic(k => R(-20, -20, 360, 240, '#100A06') + bust(k, { x: 86, y: 110, s: .7, d: .7, gaze: 6, coat: '#3A1E10', collar: '#E8DCC4', hair: '#E8E0D0', skin: '#E0A878', shade: shadeSide(k, 1, 30, .75, 6) }) + bust(k, { x: 238, y: 106, s: .72, d: -.7, gaze: -6, coat: '#2A2A3A', collar: '#E8DCC4', hair: '#5A3A22', skin: '#E0A878', long: true, shade: shadeSide(k, -1, 30, .75, -6) }) + R(-20, 168, 360, 60, '#2A160A') + [140, 160, 180].map((x, i) => R(x - 3, 130 - i % 2 * 6, 6, 40, '#F2E8D0') + E(x, 122 - i % 2 * 6, 3.4, 7, '#FFD27A') + C(x, 124 - i % 2 * 6, 34, k.rg([[0, '#FFC870', .35], [1, '#FFC870', 0]]))).join('') + k.grain(.3), undefined, tag('CANDLES ONLY')) },
    { id: 'haze', name: 'Volumetric haze', aka: 'god rays, light shafts, smoke and beams',
      desc: 'Haze or smoke in the air makes beams of light visible, so a window or a skylight becomes solid shafts cutting through the room. Instant grandeur.',
      spot: 'visible diagonal shafts of light, dust floating in them, figures cut out against the beams',
      ref: 'Ridley Scott, Spielberg\'s Raiders of the Lost Ark, The Matrix\'s lobby, church scenes in The Godfather Part III',
      prompt: 'volumetric haze in a cavernous warehouse: hard shafts of sunlight slant down from high windows through smoke, a lone silhouette standing in one beam',
      ex: pic(k => R(-20, -20, 360, 240, '#14100C') + [60, 120, 180, 240].map(x => R(x, 10, 26, 34, '#FFF0D0')).join('') + `<g ${k.blur(4)} opacity=".4">${[60, 120, 180, 240].map(x => Pth(`M${x} 10 L${x + 26} 10 L${x - 40} 220 L${x - 90} 220Z`, '#FFE2B0')).join('')}</g>` + R(-20, 180, 360, 40, '#1E1810') + actor(110, 186, 80, { coat: '#0A0806', pants: '#0A0806', skin: '#0A0806', hair: '#0A0806' }) + (() => { const r = rnd(4); let d = ''; for (let i = 0; i < 40; i++) d += C(r() * 320, r() * 200, .8, '#FFF0D0', 'opacity=".6"'); return d; })(), undefined, tag('HAZE')) },
    { id: 'tvglow', name: 'Screen glow', aka: 'TV light, monitor light',
      desc: 'A face lit only by a television, phone or computer: cold, blue and flickering, with the room black around it. It reads as loneliness, insomnia or obsession.',
      spot: 'blue-white light on one side of a face, nothing else lit, shifting brightness',
      ref: 'Poltergeist, The Social Network, Requiem for a Dream, every doomscrolling scene',
      prompt: 'lit only by the cold blue flicker of a television in a dark living room, a man alone on a sofa, the rest of the room black',
      ex: pic(k => tvRoom(k) + bust(k, { x: 110, y: 106, s: .74, d: .45, gaze: 6, ...B, coat: '#2A2A30', shade: shadeSide(k, -1, 24, .85, 6) + tint(k, '#7AB0FF', 1, .45, 40) }) + R(250, 70, 70, 50, '#CFE4FF', 'rx="3"') + C(285, 95, 110, k.rg([[0, '#9AC4FF', .4], [1, '#9AC4FF', 0]])), undefined, tag('TV ONLY')) },
    { id: 'policelights', name: 'Red and blue strobes', aka: 'police lights, emergency lights',
      desc: 'Alternating red and blue light washing over a face or a street from an unseen police car. It says trouble has arrived, and it pulses even in a still.',
      spot: 'one side of the frame red, the other blue, glistening on wet surfaces at night',
      ref: 'Collateral, Training Day, Drive, every crime drama\'s arrest scene',
      prompt: 'night, red and blue police strobes washing across her face from opposite sides, wet street reflections, a sense of sudden trouble',
      ex: pic(k => R(-20, -20, 360, 240, '#08080E') + R(-20, -20, 140, 240, k.lg([[0, '#FF2A3A', .55], [1, '#FF2A3A', 0]], 'h')) + R(200, -20, 140, 240, k.lg([[0, '#2A6AFF', 0], [1, '#2A6AFF', .55]], 'h')) + bust(k, { x: 160, y: 104, s: .84, d: -.1, ...A, long: true, shade: R(-120, -120, 240, 280, SH, 'opacity=".55"') + tint(k, '#FF3A4A', -1, .6, 30) + tint(k, '#3A7AFF', 1, .6, 30) }), undefined, tag('STROBES')) }
  ]
});

pool.groups.push({
  id: 'cinecolor', title: 'Color & grade', slot: 'Color',
  intro: 'The color a film is graded to, or the process it was shot on, is one of the fastest ways to say which film you mean. The Photography workbook covers teal and orange, bleach bypass and film stocks.',
  terms: [
    { id: 'threestrip', name: 'Three-strip Technicolor', aka: 'glorious Technicolor, IB Technicolor',
      desc: 'The dye-transfer color of Hollywood\'s golden age: saturated primaries, lipstick reds, emerald greens and skies like enamel. It looks richer than reality on purpose.',
      spot: 'intensely saturated pure colors, especially red and green, with smooth glowing skin',
      ref: 'The Wizard of Oz, Singin\' in the Rain, The Red Shoes, Gone with the Wind',
      prompt: 'three-strip Technicolor look: hyper-saturated primaries, a ruby-red dress against emerald green and a deep blue sky, lustrous 1950s Hollywood color',
      ex: pic(k => graded(k, 'threestrip', mainStreet(k))) },
    { id: 'twostrip', name: 'Two-strip Technicolor', aka: 'early Technicolor, red-green color',
      desc: 'The 1920s and early 30s process that recorded only red and green. No true blues: skies come out teal, faces peachy, and everything has a hand-tinted, antique glow.',
      spot: 'coral reds and minty greens, no real blue anywhere, a faded dreamlike palette',
      ref: 'The Mystery of the Wax Museum, Doctor X, The Aviator\'s first act (recreated)',
      prompt: 'two-strip Technicolor look: only coral reds and sea greens, no true blues, skies rendered teal, soft 1920s glow',
      ex: pic(k => graded(k, 'twostrip', mainStreet(k)) + k.grain(.2)) },
    { id: 'matrixgreen', name: 'Matrix green', aka: 'green tint, digital-world grade',
      desc: 'A sickly green cast laid over everything, used in The Matrix for scenes inside the simulation (the real world is blue). It feels artificial and coded.',
      spot: 'everything tinted green, including skin and white walls, high contrast',
      ref: 'The Matrix trilogy, Fight Club\'s office scenes, early-2000s thrillers',
      prompt: 'Matrix-green grade: a man in a long black coat and sunglasses in an office corridor, everything tinted a cold digital green, high contrast',
      ex: pic(k => graded(k, 'matrixgreen', corridor(k, { wall: '#C8C8C0', wall2: '#B8B8B0', floor: '#4A4A48', ceil: '#E8E8E0', end: '#8A8A88' }) + actor(160, 196, 150, { coat: '#0E0E0E', pants: '#0E0E0E', hair: '#0E0E0E', d: 0, over: '' }) + R(150, 89, 20, 4, '#000', 'rx="1"'))) },
    { id: 'amelie', name: 'Amélie grade', aka: 'warm greens and golds, storybook Paris',
      desc: 'Reds and greens pushed hard, blues pulled almost out, and everything warmed to gold. It turns a real city into a fairy tale.',
      spot: 'emerald greens, cherry reds and amber skin, with almost no blue in the picture',
      ref: 'Amélie and Delicatessen (Jean-Pierre Jeunet and Bruno Delbonnel), Hugo',
      prompt: 'storybook grade in the spirit of Amélie: saturated emerald greens and cherry reds, blues pulled out, warm golden skin, a whimsical Paris café',
      ex: pic(k => graded(k, 'amelie', mainStreet(k))) },
    { id: 'fincheryellow', name: 'Fincher yellow-green', aka: 'sickly sodium grade, desaturated yellow-green',
      desc: 'Low saturation with a dirty yellow-green cast and inky shadows. Everything looks slightly ill, like a city under sodium lamps that never quite wakes up.',
      spot: 'muted color, greenish-yellow highlights, deep cold shadows, precise framing',
      ref: 'Se7en, Zodiac, The Girl with the Dragon Tattoo, Fight Club',
      prompt: 'Fincher-style grade: desaturated, a sickly yellow-green cast, inky shadows, a rain-damp office at night lit by fluorescent tubes',
      ex: pic(k => graded(k, 'fincher', room(k, { wall: '#A8B0A0', floor: '#4A4A40' }) + R(-20, -20, 360, 18, '#E8F0D8') + actor(170, 176, 110, { coat: '#3A3A34', tie: '#5A2A22', d: -.5 })) + k.vignette(.6)) },
    { id: 'yellowfilter', name: 'Hot yellow filter', aka: 'Mexico filter, tobacco grade',
      desc: 'A blown-out, saturated yellow wash that Hollywood uses to mean "hot, dusty, somewhere else". Critics call it the Mexico filter, and it\'s now a cliché worth knowing.',
      spot: 'the whole frame tinted mustard yellow, bleached highlights, hazy sky',
      ref: 'Traffic\'s Mexico scenes, Breaking Bad\'s border trips, Extraction',
      prompt: 'hot yellow tobacco-filter grade over a dusty border-town street at noon, blown-out sky, heavy heat haze',
      ex: pic(k => graded(k, 'yellowfilter', mainStreet(k)) + R(-20, -20, 360, 240, '#FFE8A0', 'opacity=".15"')) },
    { id: 'wardesat', name: 'Desaturated war grade', aka: 'drained color, Saving Private Ryan look',
      desc: 'Color drained almost to monochrome, crushed blacks and harsh contrast, often with a shuttered, staccato motion. It makes a war film feel like newsreel and memory.',
      spot: 'nearly grey images with just a trace of color, hard contrast, smoke',
      ref: 'Saving Private Ryan, Band of Brothers, Black Hawk Down, Hacksaw Ridge',
      prompt: 'desaturated war-film grade, color drained almost to grey, crushed blacks, soldiers in a smoky landing with hard contrast and a newsreel feel',
      ex: pic(k => graded(k, 'wardesat', land(k, { hz: 96, water: true, sky: ['#8A9AA8', '#B8C0C8', '#D0D4D4'], shore: 130, shoreC: '#8A7A5A', fog: '#C8CCD0' }) + [70, 130, 200, 250].map((x, i) => actor(x, 180 - i % 2 * 14, 60 - i % 2 * 10, { coat: '#4A5A3A', hat: '#3A4A2A', walk: true, d: .4 })).join('') + `<g ${k.blur(8)} opacity=".6">${E(260, 60, 80, 40, '#9A9A9A')}${E(60, 80, 60, 30, '#7A7A7A')}</g>`) + k.grain(.35)) },
    { id: 'colorisolation', name: 'Color isolation', aka: 'selective color, the red coat',
      desc: 'A black-and-white film with one thing left in color: a girl\'s red coat, a goldfish, a single dress. The eye goes straight to it and the meaning lands hard.',
      spot: 'one small object or figure in color, everything else grey',
      ref: 'Schindler\'s List, Sin City, Pleasantville, Rumble Fish',
      prompt: 'black-and-white film with color isolation: a crowded wartime street in monochrome, one little girl in a red coat the only color in the frame',
      ex: pic(k => graded(k, 'modernbw', nightStreet(k, { signs: false, seed: 3 }) + [40, 76, 210, 250, 290].map((x, i) => actor(x, 176 + i % 2 * 8, 80, { coat: '#5A5A5A', hat: i % 2 ? '#3A3A3A' : undefined, walk: true, d: -.4 })).join('')) + actor(150, 184, 46, { coat: '#D0202A', long: true, hair: '#3A3A3A', skin: '#B8B8B8', pants: '#3A3A3A', walk: true, d: .4 }) + k.grain(.2)) },
    { id: 'neonnoir', name: 'Neon magenta and blue', aka: 'Refn neon, synthwave night',
      desc: 'Faces lit in hot magenta on one side and electric blue on the other, deep black around them. Nicolas Winding Refn made it a signature; music videos made it everywhere.',
      spot: 'two saturated neon colors split across a face, glossy black shadows, no natural color at all',
      ref: 'Only God Forgives, The Neon Demon, Drive, Euphoria, John Wick\'s nightclubs',
      prompt: 'neon noir lighting: a face split between hot magenta and electric blue neon, deep glossy blacks, synth-scored stillness',
      ex: pic(k => R(-20, -20, 360, 240, '#0A0614') + R(-20, -20, 360, 240, k.rg([[0, '#FF2AA0', .45], [1, '#FF2AA0', 0]], .1, .5, .6)) + R(-20, -20, 360, 240, k.rg([[0, '#2A5AFF', .45], [1, '#2A5AFF', 0]], .9, .4, .6)) + bust(k, { x: 160, y: 104, s: .84, d: 0, gaze: 0, ...B, coat: '#0A0A10', shade: R(-120, -120, 240, 280, '#0A0614', 'opacity=".6"') + tint(k, '#FF3AB0', -1, .8, 22) + tint(k, '#3A6AFF', 1, .8, 22) })) },
    { id: 'modernbw', name: 'Modern black and white', aka: 'digital monochrome, crisp b&w',
      desc: 'Black and white shot on a modern digital camera: clean, sharp, wide and silvery, with no grain or scratches. It feels timeless rather than old.',
      spot: 'pristine grey scale, enormous detail and dynamic range, often wide and deep-focus',
      ref: 'Roma, Belfast, Nebraska, The Lighthouse (the opposite: gritty and boxy)',
      prompt: 'pristine modern digital black and white, a wide deep-focus shot of a family on a beach, silvery tones, enormous detail, no grain',
      ex: pic(k => graded(k, 'modernbw', land(k, { hz: 96, water: true, sky: ['#5A8AC8', '#A8C8E8', '#E8F0F4'], shore: 140, shoreC: '#D8C8A0' }) + [110, 140, 170, 200].map((x, i) => actor(x, 176, [74, 54, 80, 44][i], { coat: ['#2A2A2A', '#E8E8E8', '#6A6A6A', '#C8C8C8'][i], d: i % 2 ? .4 : -.3 })).join(''))) },
    { id: 'ozshift', name: 'Sepia to color', aka: 'the Oz door, monochrome to color',
      desc: 'A film that starts in sepia or black and white and bursts into color when the story crosses into another world, or the other way round.',
      spot: 'a doorway, a dream or a death that changes the whole palette of the film',
      ref: 'The Wizard of Oz, Wings of Desire, Pleasantville, Stalker',
      prompt: 'a sepia-toned farmhouse doorway swinging open onto a world of saturated Technicolor flowers and a yellow road',
      ex: pic(k => graded(k, 'sepia', R(-20, -20, 360, 240, '#7A6A5A') + R(-20, 160, 360, 60, '#5A4A3A') + Pth('M120 20 L80 40 L80 196 L120 186Z', '#5A4A3A')) + `<svg x="120" y="20" width="110" height="166" viewBox="0 0 320 480" preserveAspectRatio="xMidYMid slice">${graded(k, 'threestrip', land(k, { hz: 220, sky: ['#3A7AE0', '#7AB4F0', '#C8E4F8'], ground: '#3AA84A', ground2: '#6AD86A', extra: Pth('M150 220 L170 220 L260 480 L60 480Z', '#F2D23A') + Array.from({ length: 40 }, (_, i) => C((i * 47) % 320, 240 + (i * 31) % 240, 6, ['#FF3A6A', '#FFE23A', '#C83AFF', '#FF8A2A'][i % 4])).join('') }))}</svg>` + actor(150, 196, 120, { coat: '#6A5A4A', back: true, long: true, hair: '#4A3A2A', skin: '#A89078', shadow: false }) + k.grain(.15)) }
  ]
});

/* ===== Formats & aspect ratios ===== */
// the reference scene for aspect ratios: a mesa, a road and two travelers
const refScene = k => land(k, { hz: 118, sky: ['#3A78C8', '#9CC4E8', '#F2DCB0'], ground: '#A86A3A', ground2: '#D89A5A', mtn: '#B87A54', mtnY: 10, extra: Pth('M200 118 L206 70 L262 66 L268 118Z', '#9A5A34') + Pth('M30 118 L36 88 L70 86 L76 118Z', '#A8643C') + Pth('M156 118 L164 118 L230 220 L90 220Z', '#7A5038') }) + actor(132, 170, 64, { coat: '#3A5A7A', hat: '#2A2A2A', d: .4 }) + actor(178, 172, 60, { ...A, long: true, d: -.4 }) + longShadow(132, 170, 40, .1, .35) + longShadow(178, 172, 40, .1, .35);
const ratioEx = (r, t, o = {}) => pic(k => (o.scene || refScene)(k) + gate(r), undefined, tag(t, 'br') + (o.tl ? tag(o.tl) : ''));
// film gauge edges: perforations down the sides of a motion-picture frame
function filmEdge(gauge) {
  let g = '';
  const col = '#0B0908', hole = '#E9E4DA';
  if (gauge === '70') { g += R(-20, -20, 44, 240, col) + R(296, -20, 44, 240, col); for (let y = 2; y < 200; y += 12) g += R(6, y, 8, 6, hole, 'rx="1"') + R(306, y, 8, 6, hole, 'rx="1"'); g += `<text x="20" y="100" transform="rotate(-90 20 100)" font-family="Courier Prime, monospace" font-size="6" fill="#E8862B" text-anchor="middle">65MM 5-PERF</text>`; }
  if (gauge === '35') { g += R(-20, -20, 40, 240, col) + R(300, -20, 40, 240, col); for (let y = 4; y < 200; y += 14) g += R(6, y, 7, 8, hole, 'rx="1"') + R(307, y, 7, 8, hole, 'rx="1"'); g += `<text x="17" y="100" transform="rotate(-90 17 100)" font-family="Courier Prime, monospace" font-size="6" fill="#E8862B" text-anchor="middle">35MM 4-PERF</text>`; }
  if (gauge === '16') { g += R(-20, -20, 46, 240, col) + R(302, -20, 38, 240, col); for (let y = 30; y < 200; y += 60) g += R(8, y, 9, 12, hole, 'rx="1.5"'); }
  if (gauge === '8') { g += R(-20, -20, 54, 240, col) + R(298, -20, 42, 240, col); for (let y = 10; y < 200; y += 50) g += R(12, y, 10, 14, hole, 'rx="2"'); }
  return g;
}
const hud = (t1, t2, c = '#fff') => txt(16, 24, t1, { size: 11, c }) + txt(304, 188, t2, { size: 11, c, anchor: 'end' });
const scan = (k, op = .18, gap = 3) => `<g opacity="${op}">${Array.from({ length: Math.ceil(200 / gap) }, (_, i) => R(-20, i * gap, 360, gap / 2, '#000')).join('')}</g>`;
const scratches = (seed = 2, n = 8) => { const r = rnd(seed); let g = ''; for (let i = 0; i < n; i++) { const x = r() * 320; g += R(x, -20, .7, 240, '#fff', `opacity="${(.2 + r() * .4).toFixed(2)}"`); } for (let i = 0; i < 30; i++) g += C(r() * 320, r() * 200, r() * 1.4 + .3, r() < .5 ? '#fff' : '#000', 'opacity=".6"'); return g; };

pool.groups.push({
  id: 'aspect', title: 'Aspect ratios', slot: 'Aspect ratio',
  intro: 'The shape of the frame, written as width to height. Every card shows the same scene through a different gate, so you can see what each ratio keeps and what it throws away.',
  terms: [
    { id: 'fourthree', name: '1.33:1 (4:3)', aka: 'silent-era and old TV ratio, fullscreen',
      desc: 'Almost square. The shape of silent films and of television until the 2000s. Today it reads as vintage, intimate or claustrophobic.',
      spot: 'thick black bars on the left and right of a widescreen display',
      ref: 'silent films, Mid90s, Zack Snyder\'s Justice League, First Cow, old sitcoms',
      prompt: '4:3 aspect ratio (1.33:1), a boxy almost-square frame, pillarboxed',
      ex: ratioEx(4 / 3, '1.33:1') },
    { id: 'academy', name: '1.37:1 Academy', aka: 'Academy ratio, Academy aperture',
      desc: 'The standard frame of Hollywood\'s golden age, from 1932 until widescreen arrived in the 1950s. Slightly wider than 4:3, it centers faces and suits close, formal compositions.',
      spot: 'a nearly square frame with classical, centered portraits',
      ref: 'Casablanca, Citizen Kane, The Grand Budapest Hotel\'s 1930s scenes, Fish Tank',
      prompt: '1.37:1 Academy ratio, classical boxy framing',
      ex: ratioEx(1.37, '1.37:1') },
    { id: 'boxy119', name: '1.19:1 Movietone', aka: 'early sound ratio, near-square',
      desc: 'An even squarer frame from the first sound films, when the soundtrack took a slice of the picture. Revived for claustrophobic period pieces.',
      spot: 'a frame taller than it looks like it should be, with heavy black side bars',
      ref: 'The Lighthouse, M (1931), Sunrise (1927)',
      prompt: '1.19:1 near-square frame, claustrophobic, early-sound-film proportions',
      ex: ratioEx(1.19, '1.19:1') },
    { id: 'euro166', name: '1.66:1 European widescreen', aka: '5:3, European flat',
      desc: 'The wide ratio European cinema adopted in the 1950s and 60s: wider than Academy, narrower than American widescreen. Common in art films and animation.',
      spot: 'a modest widescreen with thin bars on the sides of a 16:9 screen',
      ref: 'Jacques Tati, Studio Ghibli features, Stanley Kubrick\'s Barry Lyndon',
      prompt: '1.66:1 European widescreen framing',
      ex: ratioEx(1.66, '1.66:1') },
    { id: 'flat185', name: '1.85:1 flat', aka: 'American widescreen, spherical widescreen',
      desc: 'The everyday widescreen of American films, shot with ordinary lenses. Close to a 16:9 TV, so it fills the screen at home.',
      spot: 'thin or no bars on a TV; a general-purpose, unshowy widescreen frame',
      ref: 'most comedies and dramas: Jurassic Park, Do the Right Thing, Lady Bird',
      prompt: '1.85:1 widescreen frame',
      ex: ratioEx(1.85, '1.85:1') },
    { id: 'scope', name: '2.39:1 scope', aka: 'anamorphic widescreen, CinemaScope, 2.35',
      desc: 'The wide, letterboxed frame of epics and blockbusters. It gives room for landscapes and lets two faces share the frame with space between them. People call it "cinematic" for a reason.',
      spot: 'thick black bars above and below on a TV, a long horizontal frame',
      ref: 'Lawrence of Arabia, Star Wars, Blade Runner 2049, most action films',
      prompt: '2.39:1 anamorphic widescreen, letterboxed, wide cinematic frame',
      ex: ratioEx(2.39, '2.39:1') },
    { id: 'ultra276', name: '2.76:1 Ultra Panavision 70', aka: 'ultra-wide, Ultra Panavision',
      desc: 'The widest frame in common use: 65mm film squeezed through anamorphic lenses. Revived for a handful of event films that want vast horizons.',
      spot: 'an extremely thin, long strip of image with huge black bars',
      ref: 'Ben-Hur (1959), The Hateful Eight, parts of Rogue One',
      prompt: '2.76:1 Ultra Panavision 70, an extremely wide strip of a frame, epic horizon',
      ex: ratioEx(2.76, '2.76:1') },
    { id: 'imax143', name: '1.43:1 IMAX', aka: 'full IMAX, IMAX 15/70',
      desc: 'The tall frame of 15-perf 65mm IMAX film, used for a film\'s biggest moments. On a giant screen it fills your peripheral vision top to bottom.',
      spot: 'scenes that suddenly open up taller, with sky and ground filling the screen',
      ref: 'The Dark Knight\'s heist, Interstellar, Oppenheimer, Dunkirk',
      prompt: '1.43:1 IMAX frame, towering vertical scale, immense detail',
      ex: ratioEx(1.43, '1.43:1') },
    { id: 'vertical', name: '9:16 vertical', aka: 'phone vertical, portrait video',
      desc: 'The phone-native frame of social video and vertical micro-dramas. One person fills it; anything wide has to be told in height instead.',
      spot: 'a tall, narrow frame, a single figure top to bottom, text at the edges',
      ref: 'TikTok and Reels, vertical micro-dramas, Steven Soderbergh\'s phone experiments',
      prompt: 'vertical 9:16 framing for a phone, a single figure filling the height of the frame',
      ex: ratioEx(9 / 16, '9:16') },
    { id: 'shifting', name: 'Changing aspect ratio', aka: 'variable ratio, ratio switch',
      desc: 'A film that changes shape: the frame widens or narrows to mark a new era, a new world or a big moment.',
      spot: 'black bars that appear, disappear or change thickness between scenes',
      ref: 'The Grand Budapest Hotel (1.37, 1.85, 2.39 for three eras), Mommy\'s 1:1 that pushes open, The Dark Knight\'s IMAX scenes',
      prompt: 'change the aspect ratio between eras: boxy 1.37:1 for the past, widening to 2.39:1 for the present',
      ex: pic(k => board(k, [{ d: k => refScene(k) + gate(1.37, { line: false }), cap: '1930s · 1.37' }, { d: k => refScene(k) + gate(1.85, { line: false }), cap: '1960s · 1.85' }, { d: k => refScene(k) + gate(2.39, { line: false }), cap: 'TODAY · 2.39' }])) }
  ]
});

pool.groups.push({
  id: 'gauge', title: 'Film & camera formats', slot: 'Format',
  intro: 'What the film was shot on changes grain, sharpness, color and even how the camera moves. The edges of each drawing show the perforations of that gauge of film.',
  terms: [
    { id: 'f65', name: '65mm / 70mm film', aka: 'large format, 5-perf 65, 70mm print',
      desc: 'Film twice the width of 35mm. Enormous detail, very fine grain and a depth that feels almost three-dimensional. Reserved for epics and landscapes.',
      spot: 'crisp, grainless vistas with rich color, often in wide ratios',
      ref: 'Lawrence of Arabia, 2001, The Master, Oppenheimer',
      prompt: 'shot on 65mm film: crisp large-format detail, extremely fine grain, rich deep color, vast landscape',
      ex: pic(k => refScene(k) + filmEdge('70'), undefined, tag('65MM', 'br')) },
    { id: 'f35', name: '35mm film', aka: 'thirty-five, 4-perf 35, celluloid',
      desc: 'The standard gauge of cinema for a century. Gentle grain, soft highlights that roll off rather than clip, and color that still defines "the film look".',
      spot: 'fine organic grain, warm skin, glowing highlights, a slight softness at the edges',
      ref: 'most films before 2012, and many since: Once Upon a Time in Hollywood, Past Lives',
      prompt: 'shot on 35mm film: fine organic grain, soft highlight roll-off, warm natural skin tones',
      ex: pic(k => graded(k, 'portra', nightStreet(k, { wet: true, halation: '#FF7A3A' }) + actor(160, 184, 110, { ...A, long: true })) + k.grain(.28) + filmEdge('35'), undefined, tag('35MM', 'br')) },
    { id: 'f16', name: '16mm film', aka: 'Super 16, sixteen',
      desc: 'A smaller, cheaper gauge with visible grain and a soft, intimate feel. Light cameras made it the format of documentaries, indies and handheld realism.',
      spot: 'chunky grain, slightly muted color, a lived-in, handheld look',
      ref: 'The Wrestler, Moonrise Kingdom, Black Swan, Carol, early Spike Lee',
      prompt: 'shot on Super 16mm film: visible chunky grain, muted color, intimate handheld feel',
      ex: pic(k => `<g ${k.blur(.7)}>${graded(k, 'expired', mainStreet(k))}</g>` + k.grain(.5, .75) + filmEdge('16'), undefined, tag('16MM', 'br')) },
    { id: 's8', name: 'Super 8', aka: 'home movie film, 8mm',
      desc: 'The tiny home-movie film of the 1960s to 80s. Heavy grain, warm faded color, light leaks and a flickering, rounded frame. Pure nostalgia.',
      spot: 'warm, grainy, soft and flickery; light leaks, rounded corners, jumpy frame rate',
      ref: 'The Wonder Years titles, Super 8 (2011), Aftersun, music videos',
      prompt: 'Super 8 home movie: heavy grain, warm faded color, light leaks, soft focus, rounded flickering frame edges',
      ex: pic(k => `<g ${k.blur(1)}>${graded(k, 'super8', land(k, { hz: 112, water: true, sky: ['#7AA6D6', '#C8DCEC', '#F2EAD8'], shore: 150, shoreC: '#D8C8A0' }) + actor(150, 184, 70, { coat: '#E8C04A', long: true, hair: '#2A1A12', arms: 'up' }))}</g>` + R(-20, -20, 140, 240, k.lg([[0, '#FF6A2A', .5], [1, '#FF6A2A', 0]], 'h')) + k.grain(.55, .7) + `<rect x="34" y="4" width="264" height="192" rx="18" fill="none" stroke="#0B0908" stroke-width="12"/>` + filmEdge('8'), undefined, tag('SUPER 8', 'br')) },
    { id: 'vhs', name: 'VHS camcorder', aka: 'home video, analog tape, 80s and 90s video',
      desc: 'Analog videotape from a consumer camcorder: soft, smeary color, scan lines, tracking noise and an on-screen date stamp.',
      spot: 'blurry color bleeding past edges, horizontal noise bands, a blocky date in the corner',
      ref: 'The Blair Witch Project\'s era, V/H/S, Stranger Things\' home videos, 90s wedding tapes',
      prompt: 'VHS camcorder footage: soft smeared color bleeding sideways, scan lines, a band of tracking noise, a blocky date stamp in the corner',
      ex: pic(k => `<g ${k.blur('1.6 .4')}>${graded(k, 'digicam', room(k, { wall: '#C8A88A' }) + actor(150, 176, 110, { ...A, arms: 'up', long: true }) + actor(206, 176, 80, { coat: '#3A8AC8', d: -.4 }))}</g><g opacity=".35" style="mix-blend-mode:screen" transform="translate(3 0)">${R(140, 70, 30, 100, '#FF2A2A', k.blur(3))}</g>` + scan(k) + `<g opacity=".7">${R(-20, 150, 360, 6, '#fff', 'opacity=".4"')}${R(-20, 156, 360, 2, '#000')}</g>` + hud('PLAY ▶', 'JUN 14 1994', '#F4F4F4') + txt(304, 24, 'SP', { size: 11, anchor: 'end' }), undefined, '') },
    { id: 'minidv', name: 'Early digital video', aka: 'MiniDV, standard definition digital, prosumer DV',
      desc: 'The first consumer digital camcorders of the late 1990s and 2000s: harsh, over-sharpened, clipped white skies and smeary motion. Dogme 95 and early horror made it an aesthetic.',
      spot: 'blown-out white highlights, crunchy edges, 4:3 frame, smeary motion',
      ref: 'The Celebration, 28 Days Later, Inland Empire, Collateral (HD), early YouTube',
      prompt: 'early 2000s MiniDV digital video: harsh over-sharpened detail, blown-out white sky, smeary motion, 4:3 standard definition',
      ex: pic(k => graded(k, 'digicam', `<g ${k.filter(lin(1.4, -.05))}>${road(k, { sky: ['#C8D8E8', '#F4F8FA', '#FFFFFF'], hz: 100 }) + `<g ${k.blur('3 0')}>${actor(160, 190, 120, { ...B, walk: true })}</g>`}</g>`) + gate(4 / 3, { line: false }) + txt(60, 26, '● REC', { size: 10, c: '#FF3A3A' }) + txt(260, 186, '00:04:12', { size: 10, anchor: 'end' }), undefined, tag('DV', 'tr')) },
    { id: 'anamorphic', name: 'Anamorphic lens', aka: 'scope lenses, squeezed lenses',
      desc: 'Lenses that squeeze a wide picture onto the film, then unsqueeze it in projection. They leave fingerprints: oval out-of-focus lights, horizontal blue streak flares and gently bending edges.',
      spot: 'vertical oval bokeh, long horizontal lens flares, a 2.39:1 frame',
      ref: 'J.J. Abrams\' Star Trek, Blade Runner, Jaws, Drive',
      prompt: 'shot on anamorphic lenses: oval vertical bokeh, a long horizontal blue streak flare across the frame, 2.39:1, slight edge distortion',
      ex: pic(k => R(-20, -20, 360, 240, '#0B0E18') + `<g ${k.blur(2)}>${(() => { const r = rnd(5); let g = ''; for (let i = 0; i < 26; i++) g += E(r() * 330, 40 + r() * 120, 5 + r() * 5, 10 + r() * 9, ['#FFB45E', '#FFD28A', '#7FB8FF', '#FF7A5A'][i % 4], `opacity="${(.45 + r() * .4).toFixed(2)}"`); return g; })()}</g>` + bust(k, { x: 130, y: 104, s: .78, d: .3, ...B, coat: '#1A1A22', shade: shadeSide(k, -1, 30, .6) }) + `<g ${k.blur('22 1')}>${R(-20, 86, 360, 4, '#5AB4FF')}</g>` + R(-20, 87, 360, 1.4, '#CFE8FF', 'opacity=".9"') + C(250, 88, 6, '#E8F4FF') + gate(2.39), undefined, tag('ANAMORPHIC', 'br')) },
    { id: 'silent', name: 'Silent-era film', aka: 'hand-cranked film, nitrate',
      desc: 'Early black-and-white film, often slightly sped up because it was shot at around 16 to 18 frames a second. Flicker, scratches, an iris vignette and theatrical acting.',
      spot: 'jittery, flickering monochrome with dust and scratches, dark rounded corners, boxy frame',
      ref: 'Charlie Chaplin, Buster Keaton, Metropolis, The Artist',
      prompt: 'silent-era film: flickering scratched black and white, sped-up 18 frames per second motion, iris vignette, 1.33:1, an intertitle card',
      ex: pic(k => graded(k, 'sepia', graded(k, 'trix', mainStreet(k))) + R(-20, -20, 360, 240, k.rg([[.35, '#000', 0], [.75, '#000', .95]], .5, .5, .55)) + scratches(3) + gate(4 / 3, { line: false }), undefined, tag('18 FPS', 'br')) },
    { id: 'digitalcine', name: 'Digital cinema camera', aka: 'ARRI Alexa look, clean digital',
      desc: 'Modern digital cinema cameras: clean, grainless images with huge dynamic range, holding detail in both the sunset and the shadows. The baseline look of most current films and series.',
      spot: 'smooth, noiseless images, detail in bright skies and dark interiors at once, natural skin',
      ref: 'Skyfall, Mad Max: Fury Road, The Revenant, most prestige TV',
      prompt: 'shot on an ARRI Alexa: clean grainless digital image, wide dynamic range holding the sunset and the shadows, natural skin tones',
      ex: pic(k => land(k, { hz: 120, sky: ['#2A3A6A', '#C86A5A', '#F2B87A'], sun: { x: 240, y: 112, r: 10, c: '#FFC88A' }, mtn: '#4A3A5A', ground: '#2A2430', ground2: '#3A2E3A' }) + actor(110, 180, 90, { ...A, d: .6, long: true }) + R(196, 140, 110, 40, '#3A3036', 'rx="3"') + R(204, 146, 30, 20, '#FFD8A0') + R(244, 146, 30, 20, '#FFD8A0'), undefined, tag('DIGITAL', 'br')) },
    { id: 'foundfootage', name: 'Found footage', aka: 'night-vision camcorder, POV horror',
      desc: 'The film pretends to be footage recovered from a character\'s own camera: shaky, badly framed, night-vision green, with an on-screen REC indicator. It feels like evidence.',
      spot: 'frantic handheld camera, green night vision with glowing eyes, timestamps and battery icons',
      ref: 'The Blair Witch Project, Paranormal Activity, [REC], Cloverfield',
      prompt: 'found-footage horror: shaky handheld night-vision camcorder, green monochrome, a figure with glowing eyes at the end of a hallway, REC indicator and timestamp',
      ex: pic(k => `<g transform="rotate(-6 160 100)">${graded(k, 'matrixgreen', graded(k, 'trix', corridor(k, { lights: false })))}${actor(170, 128, 44, { coat: '#0A1A0A', pants: '#0A1A0A', hair: '#0A1A0A', skin: '#0A1A0A', shadow: false })}${C(168, 87, 1.2, '#EFFFEA')}${C(172, 87, 1.2, '#EFFFEA')}</g>` + R(-20, -20, 360, 240, '#3AFF5A', 'opacity=".12"') + k.grain(.5) + R(-20, -20, 360, 240, k.rg([[.4, '#000', 0], [1, '#000', .8]])) + txt(16, 24, '● REC', { size: 11, c: '#FF3A3A' }) + txt(304, 24, 'NIGHTSHOT', { size: 9, anchor: 'end', c: '#CFFFD0' }) + R(270, 176, 26, 10, 'none', 'stroke="#CFFFD0" stroke-width="1.4"') + R(273, 179, 8, 4, '#CFFFD0') + txt(16, 188, '03:14:09 AM', { size: 10, c: '#CFFFD0' })) },
    { id: 'cctv', name: 'Security camera', aka: 'CCTV, surveillance footage',
      desc: 'A fixed, high, wide view with a fisheye bulge, washed-out grey color, a low frame rate and a timestamp. It makes ordinary moments feel like evidence.',
      spot: 'a high corner angle looking down, distorted wide lens, timestamp and camera number',
      ref: 'Lost Highway, Paranormal Activity\'s bedroom cam, true-crime documentaries',
      prompt: 'CCTV security camera footage: high corner angle looking down a convenience store, fisheye distortion, grey low-saturation image, timestamp and CAM 03 overlay',
      ex: pic(k => graded(k, 'wardesat', R(-20, -20, 360, 240, '#B8BCB8') + Pth('M-20 220 L340 220 L250 70 L70 70Z', '#8A8C88') + [90, 130, 170, 210].map(x => R(x, 70, 30, 60, '#5A6A7A') + R(x + 2, 74, 26, 52, '#C8B87A', 'opacity=".6"')).join('') + R(20, 150, 120, 40, '#4A4C48') + actor(230, 176, 70, { coat: '#3A3A3A', d: -.2, hat: '#222' }) + actor(80, 152, 54, { coat: '#6A6A6A', d: .3 })) + R(-20, -20, 360, 240, k.rg([[.55, '#000', 0], [1, '#000', .7]])) + scan(k, .12, 2) + txt(16, 22, 'CAM 03', { size: 10 }) + txt(304, 190, '2024-11-02  23:41:07', { size: 9, anchor: 'end' })) }
  ]
});

/* ===== Genres & movements ===== */
const horse = (x, y, s = 1, c = '#3A2416', rider = null) => `<g transform="translate(${x} ${y}) scale(${s})" fill="${c}"><path d="M-30 -40 Q-34 -54 -18 -56 L18 -56 Q30 -58 34 -66 L40 -82 Q44 -88 50 -84 L58 -74 Q60 -70 54 -68 L46 -70 L42 -56 Q40 -40 30 -36 L-24 -34Z"/><path d="M-28 -38 L-34 0 L-29 0 L-22 -34Z M-14 -36 L-18 0 L-13 0 L-8 -36Z M18 -36 L22 0 L27 0 L26 -36Z M28 -38 L36 0 L41 0 L34 -38Z"/><path d="M-30 -48 Q-44 -40 -42 -20 L-38 -22 Q-38 -38 -28 -42Z"/>${rider ? `<g transform="translate(4 -40)">${rider}</g>` : ''}</g>`;
const riderFig = (c = '#2A1E14') => `<path d="M-6 -2 L-6 -26 Q0 -30 6 -26 L6 -2 L10 8 L6 10 L0 0 L-4 10 L-8 8Z" fill="${c}"/><circle cx="0" cy="-32" r="5" fill="${c}"/><ellipse cx="0" cy="-36" rx="10" ry="2" fill="${c}"/><path d="M-5 -36 Q-5 -44 0 -44 Q5 -44 5 -36Z" fill="${c}"/>`;
const dove = (x, y, s = 1, a = 0) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})" fill="#F4F4F0"><path d="M0 0 Q-10 -18 -26 -20 Q-14 -8 -6 2 Q-18 4 -22 10 Q-8 10 2 6 Q10 8 14 4 L20 2 L14 0 Q12 -4 6 -2 Q12 -14 22 -22 Q8 -18 0 0Z"/></g>`;
const bamboo = (k, seed = 4) => { const r = rnd(seed); let g = ''; for (let i = 0; i < 22; i++) { const x = r() * 340 - 10, w = 3 + r() * 6, c = ['#5A8A4A', '#3A6A3A', '#7AAA5A'][i % 3]; g += R(x, -20, w, 240, c, `opacity="${(.5 + r() * .5).toFixed(2)}"`); for (let y = 10; y < 200; y += 30 + r() * 20) g += R(x - 1, y, w + 2, 2, '#2A4A2A', 'opacity=".6"'); g += Pth(`M${x + w} ${40 + r() * 100} q14 -6 26 2 q-14 2 -26 -2Z`, c); } return g; };
const monster = (x, y, s = 1, c = '#1A1E24') => `<g transform="translate(${x} ${y}) scale(${s})" fill="${c}"><path d="M-40 0 L-34 -60 Q-40 -90 -26 -112 Q-14 -130 4 -128 Q20 -126 22 -112 L34 -110 Q40 -104 30 -98 L14 -98 Q12 -86 20 -76 L44 -70 L46 -62 L18 -60 Q24 -30 30 0 L10 0 L4 -30 L-14 -30 L-18 0Z"/><path d="M-30 -110 L-36 -122 L-24 -114 L-26 -128 L-16 -118 L-14 -132 L-6 -122" fill="${c}"/><path d="M-34 -40 Q-70 -30 -90 0 L-70 0 Q-56 -18 -36 -24Z"/></g>`;

pool.groups.push({
  id: 'genre', title: 'Genres', slot: 'Genre',
  intro: 'A genre brings a whole kit of images with it: the locations, the light, the costumes and the shots the audience expects. Name the genre and borrow its visual habits.',
  terms: [
    { id: 'noir', name: 'Film noir', aka: 'noir, 1940s crime',
      desc: 'Hard-boiled 1940s and 50s crime films: black and white, night, rain, cigarettes, fedoras and trench coats, and light that cuts faces in half. Everyone has something to hide.',
      spot: 'high-contrast black and white, wet streets, a lone figure under a streetlight, deep shadow',
      ref: 'Double Indemnity, The Maltese Falcon, The Third Man, Out of the Past',
      prompt: 'classic 1940s film noir: a man in a fedora and trench coat under a lone streetlight on a rain-slicked street, hard high-contrast black and white, long shadows',
      ex: pic(k => graded(k, 'noirbw', nightStreet(k, { wet: true, signs: false, lamp: '#FFF0D0' }) + actor(176, 176, 96, { coat: '#3A3A3A', hat: '#1A1A1A', d: -.4 }) + longShadow(176, 176, 90, .2, .7)) + k.grain(.25)) },
    { id: 'neonoir', name: 'Neo-noir', aka: 'modern noir, color noir',
      desc: 'Noir\'s moral murk carried into color: night cities, neon reflected in wet asphalt, lone drivers and synth scores. The rules are the same, only the light has changed.',
      spot: 'a night city in saturated neon and sodium orange, a car, rain, a loner',
      ref: 'Chinatown, Blade Runner, Drive, Collateral, Nightcrawler',
      prompt: 'neo-noir: a lone driver in a parked car on a rain-soaked Los Angeles street at night, magenta and cyan neon reflected in the wet asphalt, sodium-orange streetlights',
      ex: pic(k => graded(k, 'tealorange', nightStreet(k, { wet: true, n1: '#FF2AA0', n2: '#2AE0F0' })) + car(150, 176, 1.6, '#1A1A22') + R(124, 132, 20, 12, '#FFB45E', 'opacity=".25"') + E(100, 176, 70, 6, '#FF2AA0', `opacity=".2" ${k.blur(3)}`)) },
    { id: 'western', name: 'Western', aka: 'cowboy film, frontier film',
      desc: 'Wide frontier landscapes, lone riders, saloons and showdowns at high noon. The space itself is the subject: tiny people against an enormous, indifferent land.',
      spot: 'mesas and desert, a rider on the horizon, dust, wide-brimmed hats, hard sun',
      ref: 'The Searchers, Once Upon a Time in the West, Unforgiven, True Grit',
      prompt: 'classic western: a lone rider on horseback crossing a vast desert valley beneath towering red mesas, hard afternoon sun, dust, extreme wide shot',
      ex: pic(k => land(k, { hz: 128, sky: ['#2A6AC0', '#8AB8E0', '#F2D8A8'], ground: '#B06A38', ground2: '#D89A5A', mtn: '#B87A54', extra: Pth('M190 128 L200 52 L282 48 L292 128Z', '#9A4A2A') + Pth('M60 128 L68 84 L120 82 L128 128Z', '#A8582E') }) + horse(140, 170, .8, '#2A1A10', riderFig('#2A1A10')) + E(146, 171, 40, 3, '#000', 'opacity=".25"')) },
    { id: 'scifi', name: 'Science fiction', aka: 'sci-fi, space film',
      desc: 'Spaceships, future cities and other worlds, from clean white corridors to grimy cargo holds. It is often about scale, loneliness and what technology does to people.',
      spot: 'a planet looming in a black sky, a small ship, cold light, or a vast clean interior',
      ref: '2001: A Space Odyssey, Alien, Interstellar, Arrival, Dune',
      prompt: 'hard science fiction: a small spacecraft drifting past an enormous ringed gas giant, cold sunlight, deep black space, realistic scale',
      ex: pic(k => R(-20, -20, 360, 240, '#03040A') + stars(120, 21) + C(220, 150, 120, k.rg([[0, '#E8C08A'], [.6, '#B87A4A'], [1, '#3A2010']], .3, .3, .8)) + `<ellipse cx="220" cy="150" rx="190" ry="26" fill="none" stroke="#D8C0A0" stroke-width="5" opacity=".6" transform="rotate(-14 220 150)"/>` + `<g transform="translate(90 70) rotate(-8)">${R(-30, -5, 60, 10, '#C8CCD4')}${R(-10, -14, 20, 28, '#A8ACB4')}${C(-34, 0, 5, '#6AC8FF')}${C(-34, 0, 14, k.rg([[0, '#6AC8FF', .6], [1, '#6AC8FF', 0]]))}</g>`) },
    { id: 'horror', name: 'Horror', aka: 'slasher, haunted-house horror',
      desc: 'Darkness you can\'t see into, long hallways, doors left ajar and a figure that shouldn\'t be there. The frame leaves empty space on purpose so the audience searches it.',
      spot: 'a terrified face in the foreground, a dark doorway or hallway behind with something half-visible',
      ref: 'Halloween, The Exorcist, Hereditary, The Conjuring',
      prompt: 'horror: a terrified woman in the foreground of a dark hallway, unaware of a pale figure standing motionless in the doorway far behind her, cold moonlight',
      ex: pic(k => corridor(k, { wall: '#3A3A44', wall2: '#2A2A34', floor: '#1A1A20', ceil: '#2A2A30', end: '#0A0A10', lights: false }) + actor(160, 136, 34, { coat: '#D8D8D0', pants: '#D8D8D0', skin: '#E8E8E0', hair: '#1A1A1A', long: true, shadow: false }) + bust(k, { x: 76, y: 116, s: .9, d: .6, gaze: 7, brow: 'up', mouth: 'open', ...A, long: true, shade: R(-120, -120, 240, 280, '#0A1430', 'opacity=".45"') }) + k.vignette(.75)) },
    { id: 'folkhorror', name: 'Folk horror', aka: 'pagan horror, daylight horror',
      desc: 'Horror in bright daylight: a remote village, flower crowns, smiling locals and an old ritual nobody will explain. The sunshine makes it worse.',
      spot: 'white-clad villagers in a green meadow, a maypole or wicker structure, too much sun, unsettling calm',
      ref: 'The Wicker Man, Midsommar, The Witch, Apostasy',
      prompt: 'folk horror in bright midsummer daylight: villagers in white with flower crowns dancing around a maypole in a meadow, eerie smiling calm, overexposed pastel',
      ex: pic(k => graded(k, 'pastel', land(k, { hz: 100, sky: ['#8AC0E8', '#C8E0F4', '#F4F4EC'], ground: '#6AAA4A', ground2: '#9ACA6A', extra: tree(30, 102, 50, '#4A8A3A') + tree(290, 100, 60, '#4A8A3A') }) + R(158, 30, 4, 140, '#E8E0D0') + [-1, 1].map(s => `<path d="M160 32 Q${160 + s * 60} 90 ${160 + s * 90} 150" stroke="${s > 0 ? '#E8A0C0' : '#A0C8E8'}" stroke-width="2" fill="none"/>`).join('') + [70, 110, 210, 250, 130, 190].map((x, i) => actor(x, 160 + (i > 3 ? 14 : 0), 56 + (i > 3 ? 8 : 0), { coat: '#F4F2EA', pants: '#F4F2EA', long: true, hair: '#E8C88A', arms: i % 2 ? 'up' : null, over: '' }) + C(x, 160 + (i > 3 ? 14 : 0) - (56 + (i > 3 ? 8 : 0)) * .96, 3.5, 'none', 'stroke="#F2A0C0" stroke-width="2.2"')).join(''))) },
    { id: 'musical', name: 'Musical', aka: 'movie musical, song-and-dance film',
      desc: 'Characters break into song and dance, and the film breaks into theater: spotlights, saturated color, painted skies and choreography designed for the camera.',
      spot: 'a single spotlight or a stylized set, a dancer mid-move, the background turning to color',
      ref: 'Singin\' in the Rain, West Side Story, La La Land, The Umbrellas of Cherbourg',
      prompt: 'movie musical: a dancer mid-twirl in a yellow dress on a hilltop at magic hour, a painted purple sky, a single spotlight following her',
      ex: pic(k => R(-20, -20, 360, 240, k.lg([[0, '#2A1A5A'], [.6, '#8A4AA0'], [1, '#F2A07A']])) + stars(30, 7, 80) + skyline(k, { base: 160, sky: [[0, '#000', 0], [1, '#000', 0]], bld: '#2A1A3A', tall: 40 }).replace(/^<rect[^>]*\/>/, '') + Pth('M110 -20 L210 -20 L230 200 L90 200Z', '#FFF2C8', `opacity=".22" ${k.blur(4)}`) + E(160, 182, 50, 8, '#FFF2C8', 'opacity=".4"') + actor(160, 182, 100, { coat: '#F2C83A', pants: '#F2C83A', long: true, arms: 'up', hair: '#2A1A12' }) + Pth('M146 140 Q160 168 174 140 L184 160 Q160 176 136 160Z', '#F2C83A')) },
    { id: 'heist', name: 'Heist', aka: 'caper film, crime crew',
      desc: 'A crew assembles, a plan is laid out, and it goes wrong at the worst moment. Look for blueprints, slick suits, slow-motion walks and split-second timing.',
      spot: 'a team in suits walking toward camera in a line, a blueprint or vault, a ticking clock',
      ref: 'Ocean\'s Eleven, Heat, Reservoir Dogs, Inside Man, Baby Driver',
      prompt: 'heist film: a crew of five in sharp dark suits walking toward the camera in a line, slow motion, low angle, a casino glowing behind them',
      ex: pic(k => skyline(k, { sky: [[0, '#0A0A1A'], [.7, '#2A1A3A'], [1, '#C86A3A']], base: 150 }) + [70, 115, 160, 205, 250].map((x, i) => actor(x, 196, 150 - Math.abs(i - 2) * 8, { coat: '#14141A', pants: '#14141A', tie: i === 2 ? '#C8322B' : '#2A2A30', d: 0, walk: i % 2 === 1, hair: ['#2A1A12', '#C9A15E', '#1A1A1A', '#5A3A22', '#1A1A1A'][i], skin: [SK, '#E0AE8C', '#8E5C40', SK, '#C89878'][i] })).join('')) },
    { id: 'romcom', name: 'Romantic comedy', aka: 'rom-com, meet-cute',
      desc: 'Two people who obviously belong together keep missing each other in a warm, bright, picture-postcard city. Rain, bookstores, autumn leaves and the airport run.',
      spot: 'a couple framed together under an umbrella or a streetlamp, warm soft light, a pretty city',
      ref: 'When Harry Met Sally, Notting Hill, Before Sunrise, Crazy Rich Asians',
      prompt: 'romantic comedy: a couple sharing a red umbrella on a rainy autumn street in New York, warm shop windows glowing, soft flattering light, a meet-cute',
      ex: pic(k => graded(k, 'gold', mainStreet(k)) + R(-20, -20, 360, 240, '#6A7AA0', 'opacity=".25"') + Array.from({ length: 40 }, (_, i) => R((i * 37) % 320, (i * 23) % 200, .8, 9, '#fff', 'opacity=".35" transform="rotate(10)"')).join('') + actor(148, 190, 124, { ...A, long: true, d: .4 }) + actor(184, 190, 132, { ...B, d: -.4 }) + `<path d="M120 80 Q166 30 214 80Z" fill="#C8322B"/><path d="M166 58 L166 140" stroke="#222" stroke-width="2"/>`) },
    { id: 'war', name: 'War film', aka: 'combat film',
      desc: 'Trenches, beaches and ruined towns; desaturated color, smoke, shaky cameras and sudden chaos. The best ones keep the camera at soldier height, where nobody can see far.',
      spot: 'helmets and silhouettes against smoke or flare light, mud, a drained palette',
      ref: '1917, Saving Private Ryan, Come and See, Dunkirk, Apocalypse Now',
      prompt: 'war film: soldiers silhouetted in a muddy trench at night, a flare burning orange overhead through drifting smoke, desaturated palette',
      ex: pic(k => R(-20, -20, 360, 240, k.lg([[0, '#1A1A1E'], [1, '#5A4A3A']])) + C(220, 40, 70, k.rg([[0, '#FFB45E', .8], [1, '#FFB45E', 0]])) + C(220, 40, 5, '#FFF2C8') + `<g ${k.blur(8)} opacity=".5">${E(80, 100, 120, 30, '#8A7A6A')}${E(260, 120, 100, 24, '#8A7A6A')}</g>` + Pth('M-20 220 L-20 150 Q60 140 120 152 Q200 140 340 150 L340 220Z', '#14100C') + [60, 120, 190, 250].map((x, i) => actor(x, 160, 60 - (i % 2) * 6, { coat: '#14100C', pants: '#14100C', skin: '#14100C', hair: '#14100C', hat: '#14100C', shadow: false, walk: i % 2 === 0 })).join('') + k.grain(.3)) },
    { id: 'roadmovie', name: 'Road movie', aka: 'road film, road trip',
      desc: 'Characters running from something on long empty highways: motels, diners, gas stations and a car that becomes a home. The landscape keeps changing while they don\'t.',
      spot: 'a car on a long straight road through an empty landscape, a motel sign, big sky',
      ref: 'Thelma & Louise, Paris, Texas, Easy Rider, Little Miss Sunshine, Nomadland',
      prompt: 'road movie: a dusty convertible on a long empty desert highway under a huge sky, a lone motel sign in the distance, late afternoon sun',
      ex: pic(k => road(k, { sky: ['#2A6AC0', '#9AC4E8', '#F2D8A8'], vx: 210, extra: R(260, 70, 3, 44, '#2A2A2A') + R(244, 56, 40, 18, '#E85A3A', 'rx="3"') + txt(264, 69, 'MOTEL', { size: 9, c: '#FFF2C8', anchor: 'middle' }) }) + `<g ${k.blur('3 1')} opacity=".5">${E(70, 186, 60, 12, '#E8C08A')}</g>` + car(120, 196, 1.5, '#5AA8C8')) },
    { id: 'kaiju', name: 'Kaiju', aka: 'giant monster film',
      desc: 'A colossal creature rising over a city, shot from street level to sell the scale: tiny people, toppling towers, searchlights and smoke.',
      spot: 'a monster silhouette towering over skyscrapers, haze and searchlights, a crowd running in the foreground',
      ref: 'Godzilla (1954), Shin Godzilla, Pacific Rim, Cloverfield',
      prompt: 'kaiju film: a colossal monster silhouette rising out of the bay behind a city skyline at night, searchlights sweeping through smoke, crowds fleeing in the foreground, shot from street level',
      ex: pic(k => R(-20, -20, 360, 240, k.lg([[0, '#0A1020'], [1, '#3A3A4A']])) + `<g ${k.blur(3)} opacity=".6">${Pth('M100 200 L60 -20 L76 -20Z', '#E8F0FF')}${Pth('M260 200 L320 -20 L304 -20Z', '#E8F0FF')}</g>` + monster(210, 150, 1.4, '#14181E') + C(232, -18, 1.6, '#FFE24A') + skyline(k, { sky: [[0, '#000', 0], [1, '#000', 0]], base: 170, tall: 60, seed: 4 }).replace(/^<rect[^>]*\/>/, '') + `<g ${k.blur(6)} opacity=".4">${E(160, 160, 200, 20, '#8A8A9A')}</g>` + [40, 70, 100, 230, 270].map((x, i) => actor(x, 196, 30, { coat: '#0A0A0A', pants: '#0A0A0A', skin: '#0A0A0A', hair: '#0A0A0A', walk: true, d: -.6, shadow: false })).join('')) },
    { id: 'wuxia', name: 'Wuxia', aka: 'martial arts fantasy, swordplay film',
      desc: 'Chinese martial-arts fantasy: warriors who run up walls and fly across rooftops and treetops, with flowing silk, sword fights and painterly landscapes.',
      spot: 'figures floating or leaping through bamboo or across roofs, robes streaming, misty depth',
      ref: 'Crouching Tiger, Hidden Dragon, Hero, House of Flying Daggers, A Touch of Zen',
      prompt: 'wuxia: two swordfighters in flowing robes balanced on the swaying tops of a misty bamboo forest, green light filtering through, weightless and graceful',
      ex: pic(k => R(-20, -20, 360, 240, k.lg([[0, '#C8DCC0'], [1, '#6A8A5A']])) + bamboo(k) + R(-20, -20, 360, 240, '#E8F0E0', 'opacity=".25"') + `<g transform="rotate(-20 110 90)">${actor(110, 110, 70, { coat: '#F2F2EA', pants: '#F2F2EA', long: true, arms: 'out', shadow: false })}<path d="M100 60 Q60 70 30 110" stroke="#F2F2EA" stroke-width="3" fill="none" opacity=".8"/></g>` + `<g transform="rotate(16 230 70)">${actor(230, 90, 60, { coat: '#1A1A1A', pants: '#1A1A1A', arms: 'outR', shadow: false })}</g>` + `<path d="M140 74 L198 58" stroke="#E8E8F0" stroke-width="1.6"/>`) },
    { id: 'period', name: 'Period drama', aka: 'costume drama, heritage film',
      desc: 'Historical stories in careful costume and real old houses: corsets, carriages, letters, candlelit dinners and grey English skies. Composition is often painterly and still.',
      spot: 'bonnets and tailcoats, a country house or a drawing room, soft overcast or candle light',
      ref: 'Pride & Prejudice (2005), Barry Lyndon, The Age of Innocence, Bridgerton',
      prompt: 'period drama: a young woman in a Regency empire-waist dress walks across a misty meadow at dawn toward a grand English country house, soft overcast light',
      ex: pic(k => land(k, { hz: 120, sky: ['#9AA8B8', '#C8D0D4', '#E8E8E0'], ground: '#5A7A4A', ground2: '#8AA06A', fog: '#E8EAE6', extra: R(190, 70, 120, 52, '#C8BCA8') + Pth('M186 72 L250 46 L314 72Z', '#7A7068') + Array.from({ length: 6 }, (_, i) => R(198 + i * 18, 82, 8, 14, '#5A5A6A')).join('') + Array.from({ length: 6 }, (_, i) => R(198 + i * 18, 102, 8, 14, '#5A5A6A')).join('') }) + actor(110, 184, 88, { coat: '#EDE6DA', pants: '#EDE6DA', long: true, hair: '#5A3A22', d: .4 }) + Pth('M98 134 L122 134 L132 182 L88 182Z', '#EDE6DA')) }
  ]
});

pool.groups.push({
  id: 'movements', title: 'Movements & schools', slot: 'Movement',
  intro: 'Groups of filmmakers in one place and time who shared a way of shooting. Naming a movement brings its rules along: real streets or painted sets, handheld or still, story or mood.',
  terms: [
    { id: 'expressionism', name: 'German Expressionism', aka: 'Weimar cinema, Caligari style',
      desc: 'Silent German films of the 1920s with painted, tilting sets, jagged shadows and stylized acting. The world looks the way the characters feel: twisted.',
      spot: 'crooked buildings and doorways, shadows painted directly onto the set, heavy eye makeup',
      ref: 'The Cabinet of Dr. Caligari, Nosferatu, Metropolis, Tim Burton\'s homages',
      prompt: 'German Expressionist film: a gaunt figure creeping through a crooked painted alley, jagged angled walls, shadows painted onto the set, black and white with a tinted wash',
      ex: pic(k => graded(k, 'sepia', R(-20, -20, 360, 240, '#C8C0A8') + Pth('M-20 -20 L90 -20 L120 200 L-20 220Z', '#3A3530') + Pth('M340 -20 L230 -20 L200 200 L340 220Z', '#2A2622') + Pth('M120 200 L200 200 L170 40 L150 40Z', '#E8E0C8') + Pth('M20 40 L70 60 L60 90 L10 70Z', '#E8E0C8') + Pth('M260 50 L300 30 L310 80 L270 96Z', '#E8E0C8') + `<path d="M0 120 L80 100 M0 150 L90 130 M240 120 L330 150 M235 150 L330 180" stroke="#E8E0C8" stroke-width="3"/>` + `<g transform="skewX(-12)">${actor(190, 176, 96, { coat: '#14100C', pants: '#14100C', skin: '#E8E0D8', hair: '#14100C', d: .5, arms: 'outR' })}</g>`) + k.grain(.35)) },
    { id: 'neorealism', name: 'Italian Neorealism', aka: 'neorealist film',
      desc: 'Postwar Italian films shot on real streets with non-professional actors, about poverty and ordinary people. Plain, natural, grey and heartbreaking.',
      spot: 'black-and-white real streets and rubble, natural light, ordinary working people',
      ref: 'Bicycle Thieves, Rome, Open City, Umberto D., La Terra Trema',
      prompt: 'Italian Neorealism: a father and young son walk a bicycle down a crowded postwar Roman street, real locations, natural light, black and white',
      ex: pic(k => graded(k, 'modernbw', mainStreet(k) + Pth('M-20 150 L60 120 L100 150Z', '#8A8278') + C(80, 186, 22, 'none', 'stroke="#222" stroke-width="3"') + C(140, 186, 22, 'none', 'stroke="#222" stroke-width="3"') + `<path d="M80 186 L104 160 L130 160 L140 186 M104 160 L112 186 L130 160" stroke="#222" stroke-width="3" fill="none"/>`) + actor(130, 190, 110, { coat: '#3A3A3A', hat: '#2A2A2A', walk: true, d: .4 }) + actor(170, 190, 60, { coat: '#6A6A6A', walk: true, d: .4 }) + k.grain(.35)) },
    { id: 'newwave', name: 'French New Wave', aka: 'Nouvelle Vague',
      desc: 'Young critics-turned-directors in late-1950s Paris who broke the rules: handheld cameras on real streets, jump cuts, characters who talk to the camera, cool and playful.',
      spot: 'black-and-white Paris streets, a cool couple walking and talking, striped shirts, cigarettes, jump cuts',
      ref: 'Breathless, The 400 Blows, Jules and Jim, Cléo from 5 to 7, Pierrot le Fou',
      prompt: 'French New Wave: a cool young couple strolling down a Paris boulevard in 1960, she sells newspapers in a striped shirt, handheld camera, natural light, black and white',
      ex: pic(k => graded(k, 'trix', mainStreet(k)) + k.grain(.3) + actor(140, 190, 120, { coat: '#222', d: .3, hat: '#111' }) + actor(186, 190, 116, { coat: '#E8E8E8', long: true, hair: '#222', d: -.3, skin: '#C8C8C8' }) + Array.from({ length: 5 }, (_, i) => R(176, 112 + i * 7, 20, 3, '#222')).join('')) },
    { id: 'newhollywood', name: 'New Hollywood', aka: '1970s American cinema, the movie brats',
      desc: 'American films of the late 60s and 70s made by young directors with real freedom: gritty locations, natural light, long lenses, moral grey areas and downbeat endings.',
      spot: 'grainy warm 70s color, real dirty city streets, yellow cabs, wide collars, telephoto crowds',
      ref: 'Taxi Driver, The French Connection, Chinatown, Dog Day Afternoon, The Godfather',
      prompt: 'New Hollywood 1970s look: a grimy Manhattan street at dusk, yellow cabs and steam from a manhole, grainy warm film stock, long telephoto lens, a loner in an army jacket',
      ex: pic(k => graded(k, 'gold', nightStreet(k, { signs: true, n1: '#FF4A3A', n2: '#E8C04A', lamp: '#FFB45E' }) + car(90, 186, 1.2, '#E8B82A') + car(250, 182, 1, '#E8B82A') + `<g ${k.blur(5)} opacity=".5">${E(170, 170, 20, 40, '#E8E0D8')}</g>` + actor(190, 188, 100, { coat: '#5A5A3A', d: -.3 })) + k.grain(.4)) },
    { id: 'dogme', name: 'Dogme 95', aka: 'the Vow of Chastity',
      desc: 'A Danish manifesto that banned film lights, music not recorded on set, tripods and special effects. Handheld digital video, real locations and raw emotion.',
      spot: 'shaky handheld video, natural or practical light only, real rooms, no score, awkward framing',
      ref: 'The Celebration (Festen), The Idiots, Italian for Beginners, Breaking the Waves (near)',
      prompt: 'Dogme 95 style: shaky handheld digital video of a tense family dinner in a real dining room, available light only, no music, awkward intimate framing',
      ex: pic(k => `<g transform="rotate(5 160 100)">${graded(k, 'digicam', room(k, { wall: '#D8C8A8' }) + R(-20, 150, 360, 70, '#F2EEE6') + bust(k, { x: 90, y: 110, s: .6, d: .6, ...A, long: true }) + bust(k, { x: 220, y: 106, s: .64, d: -.5, mouth: 'open', ...B, collar: '#F4EFE8' }) + R(-20, 170, 360, 50, '#F2EEE6') + [70, 160, 250].map(x => E(x, 186, 24, 7, '#E8E8E8', 'stroke="#ccc"') + R(x + 22, 158, 6, 26, '#C8D8E0', 'opacity=".7"')).join(''))}</g>` + `<g ${k.blur('2 0')} opacity=".3">${R(-20, -20, 360, 240, '#fff')}</g>`) },
    { id: 'giallo', name: 'Giallo', aka: 'Italian thriller, yellow-paperback horror',
      desc: 'Lurid Italian murder mysteries of the 60s and 70s: a killer in black leather gloves, saturated red and blue gel light, fashion, mirrors and an operatic score.',
      spot: 'pure red and blue lighting, a black-gloved hand, glamorous victims, extreme close-ups of eyes',
      ref: 'Suspiria, Deep Red, Blood and Black Lace, Last Night in Soho',
      prompt: 'giallo: a black-leather-gloved hand reaching for a doorknob in a stylish apartment lit with saturated red and blue gels, operatic suspense',
      ex: pic(k => R(-20, -20, 360, 240, '#14061A') + R(-20, -20, 180, 240, k.lg([[0, '#E0102A'], [1, '#6A0A2A']], 'h')) + R(160, -20, 180, 240, k.lg([[0, '#2A1AA0'], [1, '#0A0A5A']], 'h')) + R(196, 30, 80, 170, '#1A0A3A') + C(212, 120, 8, '#C9A24A') + `<path d="M-20 140 L120 120 Q170 112 196 118 L204 124 Q200 134 190 132 L170 130 L196 136 Q200 142 190 144 L160 142 L180 150 Q180 158 170 156 L130 150 L-20 176Z" fill="#0A0A0C"/><path d="M-20 140 L120 120" stroke="#5A5A6A" stroke-width="1.4"/>`) },
    { id: 'heroic', name: 'Hong Kong action', aka: 'heroic bloodshed, gun fu',
      desc: '1980s and 90s Hong Kong action: balletic gunfights in slow motion, two guns at once, white doves, churches and honor among killers.',
      spot: 'white doves bursting through a church, slow-motion leaps with a pistol in each hand, candles',
      ref: 'John Woo (The Killer, Hard Boiled, Face/Off), Johnnie To, The Matrix\'s lobby',
      prompt: 'Hong Kong heroic-bloodshed gunfight: a man in a white suit leaps sideways in slow motion with a pistol in each hand, white doves bursting through a candlelit church',
      ex: pic(k => R(-20, -20, 360, 240, k.lg([[0, '#2A2018'], [1, '#14100C']])) + R(140, 10, 40, 80, '#E8D8B0', 'rx="20"') + Pth('M140 10 L180 10 L230 220 L90 220Z', '#FFE8B0', `opacity=".15" ${k.blur(4)}`) + Array.from({ length: 8 }, (_, i) => R(20 + i * 40, 160, 4, 16, '#F2E8D0') + E(22 + i * 40, 156, 2.4, 4, '#FFD27A')).join('') + `<g transform="rotate(-70 150 130)">${actor(150, 160, 110, { coat: '#F2EEE6', pants: '#F2EEE6', arms: 'up', hair: '#1A1210', shadow: false })}</g>` + [[60, 40, .8, -10], [240, 30, 1, 20], [270, 90, .7, 5], [90, 110, .9, -20], [200, 60, .6, 30]].map(([x, y, s, a]) => dove(x, y, s, a)).join('')) },
    { id: 'slowcinema', name: 'Slow cinema', aka: 'contemplative cinema, durational film',
      desc: 'Very long, mostly static takes in which little happens, so you notice light, weather, sound and time itself. Hypnotic if you give in to it.',
      spot: 'a wide, still frame held for minutes, a tiny figure or none, mist, wind in grass',
      ref: 'Andrei Tarkovsky, Béla Tarr (Sátántangó), Apichatpong Weerasethakul, Chantal Akerman',
      prompt: 'slow cinema: a static wide shot held for minutes of a lone figure crossing a misty, wind-blown plain toward a distant farmhouse, muted grey light',
      ex: pic(k => graded(k, 'modernbw', land(k, { hz: 108, sky: ['#8A8A8A', '#B8B8B8', '#D8D8D8'], ground: '#5A5A50', ground2: '#7A7A70', fog: '#D0D0D0', extra: house(240, 108, 26, '#3A3A3A') + tree(276, 108, 30, '#3A3A3A') }) + actor(110, 140, 16, { coat: '#1A1A1A', walk: true, d: .7 })) + k.grain(.25) + txt(312, 192, 'TAKE 1 · 07:42', { size: 8, anchor: 'end', op: .8 })) },
    { id: 'mumblecore', name: 'Mumblecore', aka: 'microbudget naturalism',
      desc: 'Cheap, talky 2000s indies about twenty-somethings and their relationships, shot on digital in real apartments with friends as actors and lots of improvised, overlapping dialogue.',
      spot: 'plain digital images, ugly real kitchens, two people talking past each other, zooms and handheld',
      ref: 'Funny Ha Ha, Hannah Takes the Stairs, Frances Ha, Joe Swanberg, the Duplass brothers',
      prompt: 'mumblecore: two twenty-somethings talking awkwardly in a cramped real apartment kitchen at night, flat practical light, handheld digital, improvised feel',
      ex: pic(k => graded(k, 'digicam', R(-20, -20, 360, 240, '#C8C0A8') + R(-20, 90, 360, 6, '#8A8070') + R(-20, 96, 360, 60, '#E8E0D0') + R(200, -20, 100, 80, '#E8E4DC') + R(-20, 150, 360, 70, '#8A7A6A') + Array.from({ length: 6 }, (_, i) => R(30 + i * 20, 70, 12, 20, ['#C8322B', '#3A7AC8', '#E8C04A'][i % 3])).join('') + bust(k, { x: 110, y: 116, s: .62, d: .6, ...A, long: true, mouth: 'smile' }) + bust(k, { x: 228, y: 112, s: .64, d: -.6, ...B })) + R(-20, -20, 360, 240, '#000', 'opacity=".08"')) },
    { id: 'kitchensink', name: 'Kitchen-sink realism', aka: 'British New Wave, social realism',
      desc: 'British films about working-class life in industrial towns: terraced houses, rain, pubs and angry young men. Its descendants are Ken Loach and Andrea Arnold.',
      spot: 'rows of brick terraced houses, chimneys, grey skies, black and white or drab color',
      ref: 'Saturday Night and Sunday Morning, A Taste of Honey, Kes, Fish Tank, I, Daniel Blake',
      prompt: 'British kitchen-sink realism: a young man in a donkey jacket on a wet street of brick terraced houses with smoking chimneys, overcast industrial town, gritty black and white',
      ex: pic(k => graded(k, 'trix', R(-20, -20, 360, 240, '#9A9A9A') + Array.from({ length: 8 }, (_, i) => R(-20 + i * 46, 70 + i * 4, 46, 130, i % 2 ? '#5A4A44' : '#6A5850') + R(-6 + i * 46, 86 + i * 4, 14, 20, '#C8C8C8') + R(16 + i * 46, 56 + i * 4, 8, 16, '#3A3430') + R(-12 + i * 46, 116 + i * 4, 12, 30, '#2A2420')).join('') + `<g ${k.blur(5)} opacity=".6">${E(30, 40, 20, 12, '#ccc')}${E(140, 50, 20, 12, '#ccc')}</g>` + R(-20, 186, 360, 40, '#3A3A3A') + actor(200, 196, 120, { coat: '#2A2A2A', d: -.3, hands: true })) + k.grain(.35)) }
  ]
});

/* ===== Directors & cinematographers ===== */
const plane = (x, y, s = 1, c = '#1A1A1A') => `<g transform="translate(${x} ${y}) scale(${s})" fill="${c}"><path d="M-30 0 L24 -3 Q34 -2 34 2 L24 4 L-30 3Z"/><path d="M-4 -2 L-14 -22 L-6 -22 L8 -2Z M-4 3 L-14 22 L-6 22 L8 3Z"/><path d="M-28 -1 L-34 -10 L-30 -10 L-22 -1Z"/></g>`;
const bicycleKid = (x, y, s = 1, c = '#0A0A10') => `<g transform="translate(${x} ${y}) scale(${s})" stroke="${c}" fill="none" stroke-width="2.6"><circle cx="-20" cy="0" r="12"/><circle cx="20" cy="0" r="12"/><path d="M-20 0 L-4 -16 L14 -16 L20 0 M-4 -16 L2 0 L14 -16"/><g fill="${c}" stroke="none"><circle cx="0" cy="-40" r="5"/><path d="M-6 -34 Q4 -36 12 -20 L8 -18 L0 -26 L-4 -16 L-10 -18Z"/><path d="M8 -30 Q22 -40 24 -26 Q16 -28 8 -26Z"/><circle cx="16" cy="-34" r="3"/></g></g>`;
const curtains = k => { let g = R(-20, -20, 360, 240, '#7A0A10'); for (let x = -20; x < 340; x += 14) g += R(x, -20, 7, 240, k.lg([[0, '#A01A22'], [1, '#5A060C']], 'h')); return g; };
const chevron = (y0 = 140) => { let g = R(-20, y0, 360, 240 - y0, '#F4F0E8'); for (let i = 0; i < 12; i++) g += `<path d="M-20 ${y0 + i * 14} ${Array.from({ length: 19 }, (_, j) => `L${-20 + j * 20} ${y0 + i * 14 + (j % 2 ? 8 : 0)}`).join(' ')} L340 ${y0 + i * 14 + 7} L340 ${y0 + i * 14 + 14} ${Array.from({ length: 19 }, (_, j) => `L${340 - j * 20} ${y0 + i * 14 + 14 + (j % 2 ? 0 : 8)}`).join(' ')}Z" fill="#141414" opacity="${i % 2 ? 0 : 1}"/>`; return g; };

pool.groups.push({
  id: 'directors', title: 'Directors', slot: 'Directed like',
  intro: 'Directors whose look is distinct enough that their name works as a style. Pair the name with the description in your prompt: some tools ignore or refuse names, and the description carries the look either way.',
  terms: [
    { id: 'hitchcock', name: 'Alfred Hitchcock', aka: 'the Master of Suspense',
      desc: 'Suspense built from what the audience knows and the character doesn\'t. Precise storyboarded shots, voyeuristic POVs, icy blondes, staircases and ordinary men chased across wide open spaces.',
      spot: 'a lone figure exposed in a huge empty space, a looming threat, very controlled framing',
      ref: 'North by Northwest, Vertigo, Psycho, Rear Window, The Birds',
      prompt: 'in the spirit of Alfred Hitchcock: a man in a grey suit running across a flat empty prairie as a crop-duster plane swoops low behind him, wide controlled framing, suspense',
      ex: pic(k => land(k, { hz: 112, sky: ['#6A9ACC', '#B8D4EA', '#EAE6D6'], ground: '#B8A06A', ground2: '#D8C08A', mtn: false }) + R(-20, 112, 360, 2, '#8A7A50') + `<path d="M-20 160 L340 140" stroke="#9A8050" stroke-width="2"/>` + plane(210, 92, 1.4, '#2A2A2A') + `<g ${k.blur('6 0')} opacity=".4">${R(150, 88, 50, 6, '#6A6A6A')}</g>` + actor(110, 168, 50, { coat: '#6A6A6A', pants: '#6A6A6A', tie: '#2A2A2A', walk: true, d: -.6 })) },
    { id: 'kubrick', name: 'Stanley Kubrick', aka: 'one-point Kubrick',
      desc: 'Cold perfectionism: one-point perspective, wide lenses, slow zooms out, symmetrical corridors, classical music over violence and the Kubrick stare.',
      spot: 'perfect symmetry down a long corridor, wide-angle distortion, something quietly wrong standing at the far end',
      ref: 'The Shining, 2001: A Space Odyssey, A Clockwork Orange, Barry Lyndon, Full Metal Jacket',
      prompt: 'in the spirit of Stanley Kubrick: a perfectly symmetrical one-point-perspective hotel corridor with patterned carpet, two identical girls in pale blue dresses standing at the far end, wide lens, unsettling stillness',
      ex: pic(k => corridor(k, { wall: '#E8D8B8', floor: '#8A3A22', rug: '#C8642A', end: '#4A3A2A' }) + actor(152, 138, 36, { coat: '#9AB8D8', pants: '#E8E8E8', long: true, hair: '#8A6A3A', shadow: false }) + actor(168, 138, 36, { coat: '#9AB8D8', pants: '#E8E8E8', long: true, hair: '#8A6A3A', shadow: false })) },
    { id: 'kurosawa', name: 'Akira Kurosawa', aka: 'Kurosawa weather',
      desc: 'Epic samurai films with weather as drama: driving rain, wind-whipped banners, mud and fog. Long telephoto lenses compress crowds into a wall of movement; axial cuts punch in.',
      spot: 'heavy diagonal rain, armored figures and flags whipped by wind, telephoto compression, mud',
      ref: 'Seven Samurai, Ran, Throne of Blood, Rashomon, Yojimbo',
      prompt: 'in the spirit of Akira Kurosawa: samurai with banners charging through driving rain and mud, telephoto compression, wind-whipped flags, black and white',
      ex: pic(k => graded(k, 'trix', R(-20, -20, 360, 240, k.lg([[0, '#6A6A6A'], [1, '#3A3A3A']])) + [50, 100, 150, 200, 250, 290].map((x, i) => R(x, 30 + i % 2 * 10, 2, 100, '#2A2A2A') + Pth(`M${x + 2} ${30 + i % 2 * 10} L${x + 30} ${40 + i % 2 * 10} L${x + 2} ${54 + i % 2 * 10}Z`, i % 2 ? '#E8E8E8' : '#1A1A1A')).join('') + [40, 90, 140, 190, 240, 280].map((x, i) => actor(x, 176 + i % 2 * 8, 70, { coat: '#1A1A1A', pants: '#2A2A2A', walk: true, d: .7, hat: '#111' })).join('') + `<g stroke="#fff" stroke-width=".9" opacity=".55">${Array.from({ length: 90 }, (_, i) => `<line x1="${(i * 37) % 340 - 10}" y1="${(i * 53) % 200}" x2="${(i * 37) % 340 - 22}" y2="${(i * 53) % 200 + 24}"/>`).join('')}</g>`) + k.grain(.3)) },
    { id: 'ozu', name: 'Yasujirō Ozu', aka: 'tatami shot',
      desc: 'Quiet family dramas shot with a still camera at the height of someone kneeling on a tatami mat, actors facing almost straight into the lens, and pillow shots between scenes.',
      spot: 'a low, motionless camera, rooms framed by doorways, people seated on the floor, calm symmetry',
      ref: 'Tokyo Story, Late Spring, An Autumn Afternoon, Good Morning',
      prompt: 'in the spirit of Yasujirō Ozu: a static low camera at tatami height, an elderly couple seated on the floor of a Japanese home framed by sliding doors, calm, frontal, gentle',
      ex: pic(k => { let g = R(-20, -20, 360, 240, '#E8DEC8') + R(-20, 140, 360, 80, '#C8B88A'); for (let x = 60; x < 280; x += 40) g += R(x, 20, 36, 110, '#F6F0E2') + R(x, 20, 36, 110, 'none', 'stroke="#6A4A2A" stroke-width="2"'); g += R(-20, 0, 70, 220, '#4A3220') + R(270, 0, 70, 220, '#4A3220') + R(-20, 134, 360, 6, '#4A3220'); g += bust(k, { x: 130, y: 118, s: .44, d: .2, coat: '#3A4A5A', hair: '#B8B8B8', skin: '#D8A27E', mouth: 'smile' }) + bust(k, { x: 196, y: 120, s: .42, d: -.2, coat: '#6A5A4A', hair: '#2A2A2A', long: true }); return g + R(-20, 170, 360, 50, '#C8B88A'); }, undefined, tag('TATAMI HEIGHT')) },
    { id: 'tarkovsky', name: 'Andrei Tarkovsky', aka: 'sculpting in time',
      desc: 'Long, slow, spiritual films full of water, fire, wind in grass, levitation and ruined rooms. Shots last minutes; the camera drifts; dreams and memory blur together.',
      spot: 'a house burning in a misty field, rain falling indoors, puddles, a tiny figure watching, muted green-grey',
      ref: 'Mirror, Stalker, Solaris, Nostalghia, The Sacrifice',
      prompt: 'in the spirit of Andrei Tarkovsky: a wooden house burning in a misty meadow, a lone figure standing in the wet grass watching, muted green-grey palette, a slow minutes-long take',
      ex: pic(k => graded(k, 'matte', land(k, { hz: 112, sky: ['#7A8478', '#A8B0A0', '#C8CCC0'], ground: '#4A5A3A', ground2: '#6A7A50', fog: '#C8CCC0', mtn: false, extra: house(196, 112, 50, '#3A2A1A') + `<g ${k.blur(4)}>${E(222, 70, 30, 50, '#FF8A3A', 'opacity=".8"')}${E(222, 50, 16, 40, '#FFD27A')}</g>` + `<g ${k.blur(8)} opacity=".6">${E(240, 0, 40, 50, '#5A5A5A')}</g>` }) + actor(90, 168, 44, { coat: '#2A2A2A', back: true }) + R(-20, 170, 360, 50, '#6A7A60', 'opacity=".5"')) + k.grain(.25)) },
    { id: 'spielberg', name: 'Steven Spielberg', aka: 'the Spielberg oner, wonder',
      desc: 'Wonder and danger for everyone: silhouettes against huge light sources, backlit haze, the awed face, kids on bikes, and long fluid shots that hide their complexity.',
      spot: 'silhouettes against a giant moon or spaceship light, beams through haze, suburban kids',
      ref: 'E.T., Close Encounters of the Third Kind, Jaws, Jurassic Park, Raiders of the Lost Ark',
      prompt: 'in the spirit of Steven Spielberg: a kid on a bicycle silhouetted against a giant full moon over a forest, soft blue night, a sense of wonder',
      ex: pic(k => R(-20, -20, 360, 240, k.lg([[0, '#0A1430'], [1, '#2A3A6A']])) + stars(40, 9, 120) + C(170, 96, 120, k.rg([[0, '#DCE6FF', .25], [1, '#DCE6FF', 0]])) + C(170, 96, 70, '#F2F0E6') + C(150, 80, 12, '#DAD6C8', 'opacity=".5"') + C(196, 120, 8, '#DAD6C8', 'opacity=".5"') + bicycleKid(160, 110, 1.2) + Array.from({ length: 22 }, (_, i) => pine(i * 16 - 10, 210, 50 + (i * 13 % 30), '#05080F')).join('')) },
    { id: 'scorsese', name: 'Martin Scorsese', aka: 'Scorsese style',
      desc: 'Restless energy: long Steadicam tracking shots, slow motion set to a rock song, freeze frames with voice-over, saturated red bars and men who talk too fast.',
      spot: 'red-lit bars and clubs, slow-motion entrances, a camera that glides through a crowd',
      ref: 'Goodfellas, Mean Streets, Taxi Driver, Raging Bull, The Wolf of Wall Street',
      prompt: 'in the spirit of Martin Scorsese: slow-motion entrance into a crowded bar bathed in red light, a tough guy in a sharp suit, a rock song on the soundtrack, the camera gliding with him',
      ex: pic(k => R(-20, -20, 360, 240, '#2A0408') + R(-20, -20, 360, 240, k.rg([[0, '#FF2A2A', .55], [1, '#FF2A2A', 0]], .5, .2, .7)) + R(-20, 130, 360, 90, '#1A0204') + R(200, 60, 140, 80, '#140204') + [220, 250, 280, 310].map(x => R(x, 70, 10, 30, '#FF6A3A', 'opacity=".5"')).join('') + `<g ${k.blur('6 0')} opacity=".6">${actor(70, 190, 130, { coat: '#1A0A0A', pants: '#1A0A0A', walk: true })}${actor(270, 190, 120, { coat: '#1A0A0A', pants: '#1A0A0A', walk: true })}</g>` + actor(160, 196, 150, { coat: '#2A2A30', tie: '#C8322B', d: .2, walk: true, hair: '#1A1210' })) },
    { id: 'lynch', name: 'David Lynch', aka: 'Lynchian',
      desc: 'Dream logic and dread under a cozy surface: red velvet curtains, zigzag floors, humming lamps, small towns and nightmares. "Lynchian" means wholesome and wrong at once.',
      spot: 'red curtains, a black-and-white chevron floor, a single lamp, a figure who moves or speaks strangely',
      ref: 'Twin Peaks, Blue Velvet, Mulholland Drive, Eraserhead, Lost Highway',
      prompt: 'in the spirit of David Lynch: a room of red velvet curtains with a black-and-white zigzag floor, a single art-deco lamp, a figure standing very still, uncanny dream logic',
      ex: pic(k => curtains(k) + chevron(140) + R(240, 70, 6, 76, '#C9A24A') + Pth('M228 70 L258 70 L250 50 L236 50Z', '#E8D8B0') + C(243, 64, 30, k.rg([[0, '#FFE2A8', .4], [1, '#FFE2A8', 0]])) + actor(130, 172, 110, { coat: '#1A1A1A', tie: '#C8322B', d: 0, hair: '#E8E8E8' })) },
    { id: 'fincher', name: 'David Fincher', aka: 'Fincher precision',
      desc: 'Clinical, perfectly locked-off camera, dark rooms, sickly yellow-green color and rain. Every move is motivated and machine-smooth; nothing is left to chance.',
      spot: 'a dark room cut by a single flashlight beam, desaturated yellow-green, rain on windows, precise symmetry',
      ref: 'Se7en, Zodiac, Fight Club, Gone Girl, The Social Network',
      prompt: 'in the spirit of David Fincher: two detectives with flashlights entering a pitch-dark apartment, beams cutting through dust, desaturated yellow-green, locked-off precise framing, rain outside',
      ex: pic(k => graded(k, 'fincher', R(-20, -20, 360, 240, '#14140E') + R(240, 20, 60, 90, '#3A4A3A') + `<g ${k.blur(3)} opacity=".45">${Pth('M120 96 L340 40 L340 160Z', '#E8F0C8')}${Pth('M200 110 L60 150 L80 200Z', '#E8F0C8')}</g>` + actor(110, 176, 110, { coat: '#2A2A24', d: .6 }) + actor(210, 180, 116, { coat: '#3A3A30', d: -.6, tie: '#2A2A24' }) + `<g stroke="#9AB0A0" stroke-width=".8" opacity=".5">${Array.from({ length: 20 }, (_, i) => `<line x1="${244 + (i * 7) % 54}" y1="${24 + (i * 13) % 80}" x2="${242 + (i * 7) % 54}" y2="${32 + (i * 13) % 80}"/>`).join('')}</g>`)) },
    { id: 'nolan', name: 'Christopher Nolan', aka: 'Nolan scale',
      desc: 'Big-concept puzzles shot practically on IMAX film: folding cities, rotating hallways, ticking scores, cross-cut timelines and cool steel-blue palettes.',
      spot: 'impossible physical spectacle shot for real, steel-blue tones, suits, IMAX-height frames',
      ref: 'Inception, Interstellar, The Dark Knight, Dunkirk, Oppenheimer',
      prompt: 'in the spirit of Christopher Nolan: a city street folding up and over itself into the sky, two figures in suits standing in the middle, steel-blue grade, IMAX large-format scale',
      ex: pic(k => R(-20, -20, 360, 240, k.lg([[0, '#7A8A9A'], [.5, '#C8D2DA'], [1, '#8A98A6']])) + `<g transform="translate(0 200) scale(1 -1)">${skyline(k, { base: 150, sky: [[0, '#000', 0], [1, '#000', 0]], bld: '#5A6A7A', seed: 7, lit: false, ground: '#4A5866' }).replace(/^<rect[^>]*\/>/, '')}</g>` + skyline(k, { base: 150, sky: [[0, '#000', 0], [1, '#000', 0]], bld: '#3A4856', seed: 3, lit: false, ground: '#2A3440' }).replace(/^<rect[^>]*\/>/, '') + actor(150, 190, 50, { coat: '#14181E', d: .3 }) + actor(172, 190, 48, { coat: '#14181E', d: -.3 }) + gate(1.43), undefined, tag('1.43:1', 'br')) },
    { id: 'villeneuve', name: 'Denis Villeneuve', aka: 'Villeneuve scale',
      desc: 'Hushed, enormous science fiction and thrillers: vast brutalist shapes in fog, tiny people, low droning sound and patient, monolithic compositions.',
      spot: 'a giant dark shape hovering in mist over a landscape, minuscule figures, muted palette, silence',
      ref: 'Arrival, Dune, Blade Runner 2049, Sicario, Enemy',
      prompt: 'in the spirit of Denis Villeneuve: a colossal dark oval vessel hovering silently over a misty green valley, tiny figures on the ridge below, muted palette, monumental stillness',
      ex: pic(k => land(k, { hz: 140, sky: ['#8A9A9A', '#B8C4C0', '#D8DCD4'], ground: '#3A5A3A', ground2: '#5A7A50', mtn: '#6A7A6A', fog: '#D0D6D0' }) + `<g transform="rotate(-8 170 70)">${E(170, 70, 28, 74, '#1A1E20')}</g>` + `<g ${k.blur(10)} opacity=".6">${R(-20, 100, 360, 50, '#D8DCD4')}</g>` + [100, 108, 116].map(x => actor(x, 166, 7, { coat: '#E8862B', pants: '#E8862B', skin: '#E8862B', hair: '#E8862B', shadow: false })).join('')) },
    { id: 'malick', name: 'Terrence Malick', aka: 'Malickian',
      desc: 'Lyrical, drifting films about nature and grace: magic-hour light, wide lenses floating close to people, whispered voice-over, trees, water and hands touching grass.',
      spot: 'low sun through leaves, a camera looking up into a huge tree, figures wandering, no clear scene structure',
      ref: 'The Tree of Life, Days of Heaven, The Thin Red Line, Badlands, A Hidden Life',
      prompt: 'in the spirit of Terrence Malick: looking up into the canopy of a huge oak at magic hour, the sun flaring through the leaves, a mother lifting a child, floating wide-angle camera',
      ex: pic(k => R(-20, -20, 360, 240, k.lg([[0, '#9AC0E8'], [1, '#F2DCA8']])) + flare(k, 200, 70, '#FFE8B0', 1.2) + Pth('M140 220 L150 120 Q120 80 60 60 L66 52 Q122 70 156 108 L164 40 L176 40 L176 110 Q210 70 280 60 L282 70 Q214 84 182 124 L192 220Z', '#3A2A1A') + `<g opacity=".92">${Array.from({ length: 50 }, (_, i) => C((i * 61) % 360 - 20, (i * 29) % 90 - 10, 18 + (i % 4) * 5, ['#3A6A2A', '#5A8A3A', '#2A4A1A'][i % 3])).join('')}</g>` + flare(k, 200, 70, '#FFE8B0', .5) + actor(90, 210, 60, { coat: '#E8E0D0', long: true, arms: 'up', hair: '#8A5A2A' })) },
    { id: 'tarantino', name: 'Quentin Tarantino', aka: 'Tarantino style',
      desc: 'Pop-culture pastiche: chapter titles, long dialogue scenes, trunk shots, crash zooms, bold primary color and sudden stylized violence, all borrowed from grindhouse and kung-fu films.',
      spot: 'a figure in a bold primary color against a stylized set, a samurai sword, a chapter title card',
      ref: 'Kill Bill, Pulp Fiction, Reservoir Dogs, Inglourious Basterds, Once Upon a Time in Hollywood',
      prompt: 'in the spirit of Quentin Tarantino: a woman in a yellow tracksuit with a katana standing in a snowy Japanese garden lit deep blue, stylized grindhouse composition, a chapter title card',
      ex: pic(k => R(-20, -20, 360, 240, k.lg([[0, '#0A1A4A'], [1, '#2A4A8A']])) + Array.from({ length: 50 }, (_, i) => C((i * 47) % 330, (i * 31) % 200, 1.4, '#fff', 'opacity=".7"')).join('') + R(-20, 150, 360, 70, '#C8D8F0') + tree(260, 156, 90, '#0A1430', '#0A1430') + actor(130, 170, 110, { coat: '#F2D02A', pants: '#F2D02A', long: true, hair: '#E8C88A', arms: 'outR', d: .3 }) + `<path d="M162 104 L230 80" stroke="#E8E8F0" stroke-width="2"/><path d="M162 104 L170 101" stroke="#1A1A1A" stroke-width="3.5"/>` + txt(16, 30, 'CHAPTER 5', { size: 10, c: '#F2D02A' }) + txt(16, 44, 'SHOWDOWN AT HOUSE OF BLUE LEAVES', { size: 7, c: '#F2D02A' })) },
    { id: 'wongkarwai', name: 'Wong Kar-wai', aka: 'WKW, In the Mood for Love',
      desc: 'Romantic longing in saturated Hong Kong color: narrow corridors, rain, cigarette smoke, slow motion, step-printed blur and lovers who never quite touch.',
      spot: 'a woman in a patterned qipao in a narrow green-walled corridor, warm lamp light, slow motion, frames within frames',
      ref: 'In the Mood for Love, Chungking Express, Fallen Angels, 2046, Happy Together',
      prompt: 'in the spirit of Wong Kar-wai: a woman in a patterned qipao passing a man in a narrow green corridor under a warm lamp, slow motion, rain on the window, saturated longing',
      ex: pic(k => R(-20, -20, 360, 240, '#0E2A1E') + R(-20, -20, 100, 240, '#1A1210') + R(240, -20, 100, 240, '#1A1210') + R(80, -20, 160, 240, k.lg([[0, '#2A5A3A'], [1, '#14321E']])) + C(160, 30, 40, k.rg([[0, '#FFC870', .6], [1, '#FFC870', 0]])) + C(160, 30, 5, '#FFE8B0') + `<g ${k.blur('6 0')} opacity=".5">${actor(150, 196, 140, { coat: '#3A2A6A', pants: '#3A2A6A', long: true, hair: '#14100C' })}</g>` + actor(176, 196, 140, { coat: '#C8322B', pants: '#C8322B', long: true, hair: '#14100C', d: .5 }) + Array.from({ length: 6 }, (_, i) => C(168 + (i % 3) * 7, 120 + Math.floor(i / 3) * 18, 2.4, '#F2C14E')).join('') + k.grain(.3)) },
    { id: 'wesanderson', name: 'Wes Anderson', aka: 'Andersonian',
      desc: 'Storybook symmetry: centered compositions, flat frontal staging, pastel palettes, whip pans, overhead inserts, title cards and deadpan characters in uniforms.',
      spot: 'everything dead center and symmetrical, candy-colored set, characters facing the lens, tiny details everywhere',
      ref: 'The Grand Budapest Hotel, Moonrise Kingdom, The Royal Tenenbaums, Asteroid City',
      prompt: 'in the spirit of Wes Anderson: a perfectly symmetrical pink-and-red hotel lobby, a lobby boy in a purple uniform standing dead center facing the camera, pastel palette, flat frontal composition',
      ex: pic(k => R(-20, -20, 360, 240, '#F2B8C0') + R(-20, 140, 360, 80, '#B8323A') + R(110, 30, 100, 110, '#E8A0AA') + R(124, 44, 72, 96, '#C8A24A') + R(130, 50, 60, 90, '#2A1A1A') + R(40, 50, 40, 60, '#F6E2D2') + R(240, 50, 40, 60, '#F6E2D2') + R(-20, 136, 360, 6, '#C9A24A') + actor(160, 176, 100, { coat: '#6A3A8A', pants: '#6A3A8A', d: 0, hat: '#6A3A8A', tie: '#C9A24A' }) + R(60, 120, 30, 40, '#C9A24A') + R(230, 120, 30, 40, '#C9A24A'), undefined, tag('DEAD CENTER')) },
    { id: 'sofiacoppola', name: 'Sofia Coppola', aka: 'dreamy ennui',
      desc: 'Soft, pastel loneliness: young women gazing out of hotel and palace windows, natural light, long quiet moments, pop music and beautiful boredom.',
      spot: 'a figure at a big window overlooking a city at dusk, pale pink and blue, soft daylight, stillness',
      ref: 'Lost in Translation, The Virgin Suicides, Marie Antoinette, Somewhere, Priscilla',
      prompt: 'in the spirit of Sofia Coppola: a young woman in a pink sweater sitting on a hotel windowsill looking out over Tokyo at dusk, soft pastel light, quiet loneliness',
      ex: pic(k => graded(k, 'pastel', skyline(k, { sky: [[0, '#6A7AB0'], [.6, '#D8A8C0'], [1, '#F2D0C0']], base: 170, tall: 110, seed: 13 }) + R(-20, -20, 60, 240, '#E8D8D0') + R(280, -20, 60, 240, '#E8D8D0') + R(-20, 170, 360, 50, '#D8C8C0') + `<g>${bust(k, { x: 110, y: 120, s: .7, back: true, hair: '#4A3020', coat: '#F2B0C0', long: true })}</g>`)) },
    { id: 'bong', name: 'Bong Joon-ho', aka: 'Bong genre-blend',
      desc: 'Genre films that switch tone mid-scene (comedy, thriller, horror, satire) with class staged vertically: the rich up the stairs, the poor below, and rain flowing down between them.',
      spot: 'long staircases descending through a city in pouring rain, characters framed by levels and windows',
      ref: 'Parasite, Memories of Murder, Snowpiercer, Mother, The Host',
      prompt: 'in the spirit of Bong Joon-ho: a family running down an endless stone staircase through a hillside city in torrential night rain, water cascading past them, framed to show high and low',
      ex: pic(k => R(-20, -20, 360, 240, '#0A1018') + Array.from({ length: 10 }, (_, i) => R(-20 + i * 18, -20 + i * 22, 360, 22, i % 2 ? '#3A4048' : '#2E343C')).join('') + Array.from({ length: 10 }, (_, i) => R(-20 + i * 18, -20 + i * 22, 360, 2, '#8AA0B8', 'opacity=".4"')).join('') + R(-20, -20, 80, 240, '#1A2028') + [[100, 90], [130, 112], [160, 134], [196, 156]].map(([x, y], i) => actor(x, y, 44 - i * 2, { coat: ['#5A5A3A', '#3A4A5A', '#6A3A3A', '#3A5A4A'][i], walk: true, d: .5, shadow: false })).join('') + `<g stroke="#9AB4D0" stroke-width=".8" opacity=".55">${Array.from({ length: 120 }, (_, i) => `<line x1="${(i * 29) % 340}" y1="${(i * 41) % 200}" x2="${(i * 29) % 340 - 4}" y2="${(i * 41) % 200 + 16}"/>`).join('')}</g>`) },
    { id: 'spikelee', name: 'Spike Lee', aka: 'Spike Lee joint',
      desc: 'Bold, political and stylized: Dutch angles, characters talking straight to camera, saturated heat, the double-dolly float and a neighborhood as a whole world.',
      spot: 'a tilted frame, a character addressing the lens, hot saturated reds and yellows, a brownstone block',
      ref: 'Do the Right Thing, Malcolm X, 25th Hour, BlacKkKlansman, Da 5 Bloods',
      prompt: 'in the spirit of Spike Lee: a Dutch-angle close-up of a man on a Brooklyn stoop talking straight into the lens on the hottest day of the summer, saturated red and orange heat',
      ex: pic(k => `<g transform="rotate(-14 160 100)">${R(-60, -60, 440, 320, '#B8321E')}${Array.from({ length: 14 }, (_, i) => R(-60, -60 + i * 22, 440, 1.6, '#7A1A0A')).join('')}${R(230, -60, 120, 300, '#8A2412')}${Array.from({ length: 8 }, (_, i) => R(240 + (i % 2) * 50, -40 + i * 30, 30, 20, '#E8D8B8', 'opacity=".8"')).join('')}${bust(k, { x: 150, y: 100, s: .86, d: 0, gaze: 0, ...B, coat: '#F2C83A', mouth: 'open' })}</g>` + R(-20, -20, 360, 240, '#FF8A2A', 'opacity=".15"'), undefined, tag('DUTCH ANGLE')) },
    { id: 'peele', name: 'Jordan Peele', aka: 'social horror',
      desc: 'Horror built on social unease: everyday settings that turn uncanny, faces in tight close-up with tears or frozen smiles, and surreal voids like the Sunken Place.',
      spot: 'a frozen, tearful close-up; a figure falling through an endless black void; a cheerful suburb that feels wrong',
      ref: 'Get Out, Us, Nope',
      prompt: 'in the spirit of Jordan Peele: a man floating and falling slowly through an endless black void, a small glowing screen of the real world far above him, uncanny social-horror stillness',
      ex: pic(k => R(-20, -20, 360, 240, '#030305') + R(124, 10, 72, 46, '#3A5A7A') + R(128, 14, 64, 38, k.lg([[0, '#9AB8D8'], [1, '#5A7A9A']])) + C(160, 33, 60, k.rg([[0, '#9AB8D8', .15], [1, '#9AB8D8', 0]])) + `<g transform="rotate(-18 160 140)">${actor(160, 190, 90, { ...B, coat: '#4A4A50', arms: 'up', shadow: false })}</g>`) },
    { id: 'varda', name: 'Agnès Varda', aka: 'the grandmother of the New Wave',
      desc: 'Playful, personal films and essays mixing documentary and fiction: beaches, mirrors, potatoes, cats and the director herself on camera, curious about everyone.',
      spot: 'mirrors standing on a beach reflecting the sea, bright natural light, a warm personal voice',
      ref: 'Cléo from 5 to 7, The Beaches of Agnès, The Gleaners and I, Faces Places',
      prompt: 'in the spirit of Agnès Varda: a row of old mirrors standing upright on a sunny beach, each reflecting a slice of sea and sky, playful and personal, bright natural light',
      ex: pic(k => land(k, { hz: 100, water: true, sky: ['#5A9AD8', '#A8D0F0', '#E8F2F8'], shore: 140, shoreC: '#E8D8B0' }) + [50, 120, 190, 260].map((x, i) => `<g transform="rotate(${[-4, 3, -2, 5][i]} ${x + 18} 160)">${R(x, 92, 36, 64, '#C9A24A')}<svg x="${x + 3}" y="95" width="30" height="58" viewBox="${x - 30} 40 80 155" preserveAspectRatio="xMidYMid slice">${land(k, { hz: 110, water: true, sky: ['#3A7AC8', '#8AC0E8', '#E8F2F8'] })}</svg></g>`).join('') + actor(160, 196, 60, { coat: '#C8322B', hair: '#6A3A6A', long: true, d: -.3 })) }
  ]
});

pool.groups.push({
  id: 'dps', title: 'Cinematographers', slot: 'Shot by',
  intro: 'The director of photography designs the light and the camera. These names mean a specific look to anyone who works in film, and they are less likely than directors\' names to be refused by image tools.',
  terms: [
    { id: 'deakins', name: 'Roger Deakins', aka: 'single-source Deakins',
      desc: 'Simple, bold compositions built around one strong source: silhouettes against walls of light, colored haze, and perfect restraint. Every frame reads in a glance.',
      spot: 'two dark figures fighting in silhouette against a giant glowing screen or window',
      ref: 'Skyfall, Blade Runner 2049, 1917, No Country for Old Men, Sicario',
      prompt: 'lit like Roger Deakins: two figures fighting in pure silhouette against a vast glowing blue digital billboard in a dark skyscraper at night, single source, minimal',
      ex: pic(k => R(-20, -20, 360, 240, '#02040A') + R(40, 10, 260, 160, k.rg([[0, '#4AB0F0'], [.6, '#1A5AA0'], [1, '#0A1A3A']], .6, .4, .8)) + `<g ${k.blur(12)} opacity=".6">${E(220, 60, 60, 40, '#C8F0FF')}</g>` + Array.from({ length: 16 }, (_, i) => R(40 + i * 16.4, 10, 1, 160, '#000', 'opacity=".5"')).join('') + R(-20, 170, 360, 50, '#02040A') + actor(130, 172, 100, { coat: '#000', pants: '#000', skin: '#000', hair: '#000', arms: 'outR', shadow: false }) + actor(200, 172, 104, { coat: '#000', pants: '#000', skin: '#000', hair: '#000', arms: 'out', shadow: false })) },
    { id: 'lubezki', name: 'Emmanuel Lubezki', aka: 'Chivo',
      desc: 'Natural light, wide lenses inches from the actors and impossibly long, floating takes. The camera breathes with the characters and the world feels physically present.',
      spot: 'a very wide lens right up in someone\'s face with a deep landscape behind, breath and weather on the lens',
      ref: 'The Revenant, Children of Men, Gravity, The Tree of Life, Birdman',
      prompt: 'shot like Emmanuel Lubezki: an ultra-wide lens inches from a man\'s face as his breath fogs in the cold blue dusk of a vast forest, natural light only, one floating continuous take',
      ex: pic(k => R(-20, -20, 360, 240, k.lg([[0, '#4A5A7A'], [1, '#9AA8BC']])) + Array.from({ length: 16 }, (_, i) => R(i * 22 - 10, -20, 4 + (i % 3) * 2, 180, '#1A2230', `opacity="${.4 + (i % 3) * .15}"`)).join('') + R(-20, 140, 360, 80, '#D0D8E2') + `<g transform="translate(160 110) scale(1.15 1.05) translate(-160 -110)">${bust(k, { x: 150, y: 116, s: .95, d: .4, gaze: 6, coat: '#4A3A2A', hair: '#2A1A12', skin: '#C89878', brow: 'down', shade: R(-80, -80, 160, 200, '#6A7AA0', 'opacity=".25"') })}</g>` + `<g ${k.blur(6)} opacity=".6">${E(240, 140, 40, 18, '#E8EEF4')}</g>` + C(60, 40, 8, '#fff', 'opacity=".25"') + C(280, 170, 12, '#fff', 'opacity=".2"')) },
    { id: 'storaro', name: 'Vittorio Storaro', aka: 'writing with light',
      desc: 'Bold, symbolic color as emotion: blazing oranges, deep reds and blues, and light that moves across faces during a scene. Painterly and operatic.',
      spot: 'saturated orange smoke and sunsets, colored light sweeping over faces, operatic silhouettes',
      ref: 'Apocalypse Now, The Conformist, The Last Emperor, Reds, Wonder Wheel',
      prompt: 'lit like Vittorio Storaro: helicopters silhouetted over a jungle through billowing orange smoke at sunset, saturated symbolic color, operatic',
      ex: pic(k => R(-20, -20, 360, 240, k.lg([[0, '#8A1A0A'], [.6, '#F26A1A'], [1, '#FFC86A']])) + C(220, 110, 34, '#FFE8A0') + `<g ${k.blur(10)} opacity=".7">${E(80, 120, 120, 40, '#E8501A')}${E(260, 150, 100, 30, '#C83A0A')}</g>` + Array.from({ length: 14 }, (_, i) => `<path d="M${i * 26 - 20} 220 L${i * 26 - 10} ${150 + (i % 3) * 10} Q${i * 26} ${130 + (i % 4) * 8} ${i * 26 + 10} ${150 + (i % 3) * 10} L${i * 26 + 20} 220Z" fill="#1A0804"/>`).join('') + [[90, 60, 1], [150, 40, .7], [250, 70, .9]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})" fill="#1A0804"><ellipse rx="22" ry="8"/><path d="M18 -2 L50 -4 L52 2 L18 4Z"/><path d="M-40 -12 L40 -12" stroke="#1A0804" stroke-width="2"/><path d="M-6 6 L-12 14 M6 6 L12 14 M-14 14 L14 14" stroke="#1A0804" stroke-width="2"/></g>`).join('')) },
    { id: 'willis', name: 'Gordon Willis', aka: 'the Prince of Darkness',
      desc: 'Daring underexposure and top light (The Godfather), and luminous black-and-white city panoramas (Manhattan). He trusted darkness more than anyone before him.',
      spot: 'deep blacks where you expect detail, or silvery black-and-white skylines at dawn',
      ref: 'The Godfather trilogy, Manhattan, Annie Hall, All the President\'s Men, Klute',
      prompt: 'shot like Gordon Willis: a couple on a bench beneath the Queensboro Bridge at dawn, silvery widescreen black and white, silhouettes against the river',
      ex: pic(k => graded(k, 'modernbw', R(-20, -20, 360, 240, k.lg([[0, '#4A5A7A'], [.7, '#C8C0B8'], [1, '#E8E0D8']])) + `<path d="M-20 70 Q80 120 160 80 Q240 40 340 80" stroke="#1A1A1A" stroke-width="3" fill="none"/>` + R(-20, 76, 360, 10, '#1A1A1A') + Array.from({ length: 30 }, (_, i) => R(i * 12 - 20, 72, 1, 14, '#E8E0D8', 'opacity=".5"')).join('') + R(100, 40, 12, 110, '#1A1A1A') + R(230, 40, 12, 110, '#1A1A1A') + R(-20, 120, 360, 40, '#9A9A9A') + R(-20, 160, 360, 60, '#141414') + R(160, 150, 70, 4, '#141414') + bust(k, { x: 176, y: 140, s: .2, back: true, coat: '#141414', hair: '#141414', skin: '#141414' }) + bust(k, { x: 206, y: 141, s: .19, back: true, coat: '#141414', hair: '#141414', skin: '#141414', long: true })) + gate(2.39, { line: false })) },
    { id: 'hoytema', name: 'Hoyte van Hoytema', aka: 'IMAX realism',
      desc: 'Large-format film used for intimate realism: IMAX cameras handheld, natural light, real locations and enormous landscapes that make people feel tiny and exposed.',
      spot: 'a tiny human against an alien sea or sky, tall IMAX frame, natural light and texture',
      ref: 'Interstellar, Dunkirk, Oppenheimer, Nope, Her',
      prompt: 'shot like Hoyte van Hoytema on IMAX film: a tiny astronaut standing in shallow water on an endless ocean planet as a mountainous wave rises on the horizon, natural light, tall large-format frame',
      ex: pic(k => R(-20, -20, 360, 240, k.lg([[0, '#8A9AA8'], [1, '#C8D0D4']])) + Pth('M-20 120 Q60 100 120 70 Q160 30 200 70 Q260 100 340 110 L340 140 L-20 140Z', '#4A5A64') + Pth('M120 70 Q160 30 200 70 Q170 60 150 70Z', '#E8EEF0', 'opacity=".6"') + R(-20, 140, 360, 80, k.lg([[0, '#9AA8B0'], [1, '#C8D0D4']])) + Array.from({ length: 8 }, (_, i) => R(-20, 146 + i * 9, 360, .8, '#fff', 'opacity=".4"')).join('') + actor(150, 170, 26, { coat: '#E8E8E8', pants: '#E8E8E8', hair: '#D8D8D8', skin: '#D8D8D8' }) + gate(1.43)) },
    { id: 'kaminski', name: 'Janusz Kamiński', aka: 'blown-out windows',
      desc: 'Spielberg\'s cinematographer since Schindler\'s List: blown-out white windows, heavy backlit haze, desaturated or bleach-bypassed color and shuttered, staccato motion.',
      spot: 'windows burning pure white, smoky shafts, silhouettes, drained color with crushed blacks',
      ref: 'Schindler\'s List, Saving Private Ryan, Minority Report, Lincoln, West Side Story (2021)',
      prompt: 'lit like Janusz Kamiński: silhouetted figures in a smoky room against windows blown out to pure white, heavy backlit haze, desaturated bleach-bypass color',
      ex: pic(k => graded(k, 'bleach', R(-20, -20, 360, 240, '#2A2A2E') + [40, 140, 240].map(x => R(x, 20, 60, 120, '#FFFFFF')).join('') + `<g ${k.blur(14)} opacity=".7">${[40, 140, 240].map(x => R(x - 10, 20, 80, 160, '#F0F0F0')).join('')}</g>` + `<g ${k.blur(4)} opacity=".35">${[40, 140, 240].map(x => Pth(`M${x} 140 L${x + 60} 140 L${x + 20} 220 L${x - 50} 220Z`, '#FFFFFF')).join('')}</g>` + actor(110, 190, 120, { coat: '#14141A', pants: '#14141A', skin: '#14141A', hair: '#14141A', shadow: false }) + actor(220, 194, 130, { coat: '#14141A', pants: '#14141A', skin: '#14141A', hair: '#14141A', hat: '#14141A', shadow: false }))) },
    { id: 'bradfordyoung', name: 'Bradford Young', aka: 'luminous darkness',
      desc: 'Daringly underexposed, soft and warm images where faces glow out of rich darkness. He lights dark skin with love and lets the shadows hold most of the frame.',
      spot: 'a face half emerging from deep brown-black shadow, soft side light, very little else visible',
      ref: 'Arrival, Selma, A Most Violent Year, When They See Us, Pariah',
      prompt: 'shot like Bradford Young: a woman\'s face emerging softly out of deep warm darkness, lit by a dim window to the side, underexposed, rich luminous skin, most of the frame in shadow',
      ex: pic(k => R(-20, -20, 360, 240, '#0A0705') + R(260, 20, 40, 120, '#3A3A40', 'opacity=".6"') + bust(k, { x: 160, y: 104, s: .86, d: .35, gaze: 5, coat: '#14100C', hair: '#0A0705', skin: '#7A4A30', long: true, shade: shadeSide(k, -1, 22, .88, 10, '#0A0705') + tint(k, '#E8A878', 1, .25, 40) }) + k.vignette(.6)) },
    { id: 'greigfraser', name: 'Greig Fraser', aka: 'textured darkness',
      desc: 'Moody, textured digital images built from silhouettes, harsh single sources and colored haze, often on custom-detuned lenses for a slightly imperfect, analog feel.',
      spot: 'a dark silhouette lit by one burning red flare or a hard backlight, rain and haze, soft-edged lenses',
      ref: 'The Batman, Dune, Zero Dark Thirty, Rogue One, Lion',
      prompt: 'shot like Greig Fraser: a caped silhouette in heavy rain lit only by a red emergency flare, thick haze, soft detuned lens, dark textured image',
      ex: pic(k => R(-20, -20, 360, 240, '#050304') + C(200, 150, 140, k.rg([[0, '#FF2A1A', .55], [.5, '#8A0A0A', .2], [1, '#000', 0]])) + C(200, 162, 4, '#FFE0C8') + `<g stroke="#FF6A5A" stroke-width=".7" opacity=".4">${Array.from({ length: 80 }, (_, i) => `<line x1="${(i * 41) % 340}" y1="${(i * 23) % 200}" x2="${(i * 41) % 340 - 3}" y2="${(i * 23) % 200 + 12}"/>`).join('')}</g>` + Pth('M118 196 L126 96 Q130 70 150 66 Q144 52 150 44 L154 52 L160 52 L164 44 Q170 52 164 66 Q184 70 188 96 L200 196Z', '#030202') + `<g ${k.blur(6)} opacity=".5">${E(160, 180, 120, 20, '#5A0A0A')}</g>`) },
    { id: 'nykvist', name: 'Sven Nykvist', aka: 'Bergman\'s cinematographer',
      desc: 'Simple, soft, natural light, often a single bounced source, and long close-ups of faces. His work with Ingmar Bergman made the human face the main landscape of cinema.',
      spot: 'two faces filling the frame in soft grey northern light, minimal background, intense stillness',
      ref: 'Persona, Cries and Whispers, Fanny and Alexander, Through a Glass Darkly',
      prompt: 'lit like Sven Nykvist: two women\'s faces close together in the frame, one in profile and one facing the camera, soft natural northern light, minimal grey background, black and white',
      ex: pic(k => graded(k, 'modernbw', R(-20, -20, 360, 240, '#C8C8C4') + bust(k, { x: 200, y: 100, s: .9, d: -.2, gaze: -2, hair: '#3A2A1A', skin: '#E0C0A8', coat: '#2A2A2A', long: true }) + bust(k, { x: 112, y: 96, s: .92, d: .95, gaze: 6, hair: '#C8A060', skin: '#E8C8B0', coat: '#1A1A1A', shade: shadeSide(k, 1, 30, .55, 10) })) + k.grain(.15)) },
    { id: 'laxton', name: 'James Laxton', aka: 'Moonlight blue',
      desc: 'Barry Jenkins\' cinematographer: saturated, dreamlike color on rich dark skin, faces looking straight into the lens, Miami teals and purples, and the sea at night.',
      spot: 'a face lit in deep blue and violet, looking directly at us, ocean behind, intimate and lush',
      ref: 'Moonlight, If Beale Street Could Talk, The Underground Railroad',
      prompt: 'shot like James Laxton: a young man on a beach at night looking straight into the lens, his dark skin glowing in saturated blue and violet moonlight, teal ocean behind, intimate and lush',
      ex: pic(k => R(-20, -20, 360, 240, k.lg([[0, '#0A0A3A'], [.55, '#1A2A6A'], [1, '#0A3A4A']])) + R(-20, 120, 360, 100, k.lg([[0, '#0A5A6A'], [1, '#0A2A3A']])) + Array.from({ length: 6 }, (_, i) => R(-20, 126 + i * 10, 360, 1, '#6AE0E8', 'opacity=".3"')).join('') + bust(k, { x: 160, y: 98, s: .86, d: 0, gaze: 0, coat: '#1A1A3A', hair: '#05050A', skin: '#3A2A3A', shade: tint(k, '#6A4AFF', -1, .55, 40) + tint(k, '#2AC8E8', 1, .4, 40) })) }
  ]
});

/* ---------- subjects: one page each ---------- */
const G = Object.fromEntries(pool.groups.map(g => [g.id, g]));
const WORKBOOK = {};
WORKBOOK.areas = [
  { id: 'grammar', title: 'Shot grammar', preview: 'dirtysingle', blurb: 'Coverage of a scene, from the establishing shot to the reaction shot, and the rules that keep a cut scene readable: the 180-degree line, eyelines and screen direction.', groups: ['coverage', 'rules'] },
  { id: 'staging', title: 'Staging & signature shots', preview: 'onepoint', blurb: 'Where people stand and move in the frame, and the shots named after the directors who made them famous.', groups: ['blocking', 'signature'] },
  { id: 'editing', title: 'Editing', preview: 'graphicmatch', blurb: 'How shots are joined: cross-cutting, the Kuleshov effect, long takes, montage, jump cuts and stories told out of order.', groups: ['scenecuts', 'montage'] },
  { id: 'look', title: 'Light & color', preview: 'blinds', blurb: 'Film lighting built around a believable source, and the grades and color processes that say which film you mean.', groups: ['cinelight', 'cinecolor'] },
  { id: 'format', title: 'Formats & aspect ratios', preview: 'anamorphic', blurb: 'The shape of the frame from 1.19:1 to 2.76:1, and what the film was shot on, from 65mm to VHS.', groups: ['aspect', 'gauge'] },
  { id: 'genres', title: 'Genres & movements', preview: 'western', blurb: 'The visual habits of genres from noir to wuxia, and of movements from German Expressionism to Dogme 95.', groups: ['genre', 'movements'] },
  { id: 'names', title: 'Directors & cinematographers', preview: 'lynch', blurb: 'Directors and directors of photography whose names carry a whole look, each with the description to pair it with.', groups: ['directors', 'dps'] }
].map(a => ({ ...a, groups: a.groups.map(id => G[id]).filter(Boolean) })).filter(a => a.groups.length);
WORKBOOK.recipes = [
  { label: 'A music video in the Lord Huron mood', parts: [['A '], ['2.39:1', 'scope'], [' '], ['western', 'western'], [' that opens on an '], ['establishing shot', 'establishing'], [' of a lonely motel, then a '], ['single', 'single'], [' of the drifter lit by '], ['practicals', 'practical'], [', graded '], ['day for night', 'dayfornight'], [', intercut with '], ['Super 8', 's8'], [' '], ['flashbacks', 'flashback'], [', in the spirit of '], ['Wong Kar-wai', 'wongkarwai'], ['.']] },
  { label: 'A tense dialogue scene', parts: [['A '], ['master', 'master'], [' then '], ['shot / reverse shot', 'shotreverse'], [' across a diner table, keeping the '], ['180-degree rule', 'rule180'], [' until the reveal, when we '], ['cross the line', 'crossline'], ['. '], ['Top light', 'toplight'], [', a '], ['Fincher yellow-green', 'fincheryellow'], [' grade, and a '], ['cut on action', 'matchaction'], [' as he stands. '], ['Neo-noir', 'neonoir'], ['.']] },
  { label: 'A sci-fi teaser shot', parts: [['A '], ['1.43:1 IMAX', 'imax143'], [' frame on '], ['65mm', 'f65'], [': '], ['monumental scale', 'tinyfigure'], [', one figure under a vast hovering shape, '], ['volumetric haze', 'haze'], [', held as a '], ['long take', 'longtake'], [', in the spirit of '], ['Denis Villeneuve', 'villeneuve'], [', lit like '], ['Greig Fraser', 'greigfraser'], ['.']] }
];
WORKBOOK.xcols = ['Shot & staging', 'Edit', 'Light', 'Color & format', 'Genre or name'];
WORKBOOK.xlate = [
  { job: 'Dread', note: 'something is coming', cells: [['diopter', 'onepoint'], ['crosscut', 'longtake'], ['shadowplay', 'toplight'], ['fincheryellow', 'f35'], ['horror', 'kubrick']] },
  { job: 'Longing', note: 'apart, together', cells: [['doorframe', 'dirtysingle'], ['jumpcut', 'flashback'], ['practical', 'candlelit'], ['s8', 'amelie'], ['wongkarwai', 'sofiacoppola']] },
  { job: 'Wonder', note: 'awe, scale', cells: [['spielbergface', 'tinyfigure'], ['graphicmatch'], ['haze', 'motivated'], ['f65', 'imax143'], ['spielberg', 'villeneuve']] },
  { job: 'Paranoia', note: 'watched, trapped', cells: [['godseye', 'single'], ['hiphop', 'crossline'], ['blinds', 'tvglow'], ['cctv', 'matrixgreen'], ['noir', 'fincher']] },
  { job: 'Nostalgia', note: 'memory, warmth', cells: [['pillow', 'magichourhand'], ['flashback', 'trainingmontage'], ['availablelight'], ['s8', 'f16'], ['malick', 'ozu']] },
  { job: 'Comedy', note: 'deadpan, bright', cells: [['planimetric', 'topinsert'], ['jumpcut', 'splitscreen'], ['practical'], ['threestrip', 'flat185'], ['wesanderson', 'romcom']] },
  { job: 'Epic', note: 'vast, heroic', cells: [['establishing', 'triangle'], ['axial', 'longtake'], ['haze'], ['scope', 'f65'], ['western', 'kurosawa']] },
  { job: 'Raw', note: 'real, unpolished', cells: [['walktalk', 'snorricam'], ['elliptical', 'jumpcut'], ['availablelight'], ['f16', 'minidv'], ['newhollywood', 'dogme']] }
];
WORKBOOK.aspects = ['2.39:1 scope', '1.85:1 widescreen', '16:9 TV', '1.43:1 IMAX', '1.37:1 Academy', '4:3', '9:16 vertical'];
/* ---------- rendering ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
};
const picks = new Set(store.get('fcw-picks', []));
let fmt = store.get('fcw-fmt', 'list');
const TERMS = {};
WORKBOOK.areas.forEach(a => a.groups.forEach(g => g.terms.forEach(t => TERMS[t.id] = { t, g, a })));
const totalTerms = Object.keys(TERMS).length;
let pendingJump = null;

const cardHTML = (t, g) => `
  <article class="card${picks.has(t.id) ? ' picked' : ''}" id="t-${t.id}" data-search="${esc((t.name + ' ' + (t.aka || '') + ' ' + t.desc + ' ' + (t.ref || '') + ' ' + (t.spot || '') + ' ' + g.title).toLowerCase())}">
    <div class="ex" aria-hidden="true">${t.ex}</div>
    <div class="cbody">
      <h3>${esc(t.name)}</h3>
      ${t.aka ? `<div class="aka">Also called ${esc(t.aka)}</div>` : ''}
      <p class="desc">${esc(t.desc)}</p>
      ${t.spot ? `<p class="ref spot"><b>Spot it</b>${esc(t.spot)}</p>` : ''}
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
const emptyMsg = `<p class="empty" id="empty" hidden>Nothing matches that search. Try a plainer word like "close-up", "cut", "noir" or "Kubrick".</p>`;
const chip = (id, txt) => TERMS[id] ? `<a class="chip" href="#${TERMS[id].a.id}" data-jump="${id}"><span>${esc(txt || TERMS[id].t.name)}</span><small>${esc(TERMS[id].g.slot)}</small></a>` : esc(txt || '');
const link = id => TERMS[id] ? `<a href="#${TERMS[id].a.id}" data-jump="${id}">${esc(TERMS[id].t.name)}</a>` : '';
const reId = s => s.replace(/id="([^"]+)"/g, 'id="tile-$1"').replace(/url\(#([^)]+)\)/g, 'url(#tile-$1)');

function renderHome() {
  $('#home').hidden = false; $('#subject').hidden = true; $('#main').innerHTML = '';
  $('#homeCount').textContent = `${totalTerms} terms on ${WORKBOOK.areas.length} pages`;
  $('#recipes').innerHTML = WORKBOOK.recipes.map(r => `<div class="rcp"><div class="eyebrow">${esc(r.label)}</div><p class="sentence">${r.parts.map(([txt, id]) => id ? chip(id, txt) : esc(txt)).join('')}</p></div>`).join('');
  $('#xtable').innerHTML = `<thead><tr><th>The mood</th>${WORKBOOK.xcols.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>` +
    WORKBOOK.xlate.map(r => `<tr><th>${esc(r.job)}<small>${esc(r.note)}</small></th>${r.cells.map(c => `<td>${c.map(link).join(' ')}</td>`).join('')}</tr>`).join('') + '</tbody>';
  $('#tiles').innerHTML = WORKBOOK.areas.map(a => `
    <a class="tile" href="#${a.id}">
      <div class="ex" aria-hidden="true">${TERMS[a.preview] ? reId(TERMS[a.preview].t.ex) : ''}</div>
      <div class="tbody"><h3>${esc(a.title)}</h3><p>${esc(a.blurb)}</p>
      <div class="tmeta">${a.groups.reduce((n, g) => n + g.terms.length, 0)} terms · ${a.groups.map(g => esc(g.title)).join(' · ')}</div></div>
    </a>`).join('');
  $('#results').innerHTML = WORKBOOK.areas.map(a => a.groups.map(g => groupHTML(g, a.title)).join('')).join('') + emptyMsg;
  filter($('#qh'), $('#results'), true);
}

function renderSubject(a) {
  $('#home').hidden = true; $('#subject').hidden = false; $('#results').innerHTML = '';
  $('#subTitle').textContent = a.title;
  $('#subBlurb').textContent = a.blurb;
  const i = WORKBOOK.areas.indexOf(a), next = WORKBOOK.areas[(i + 1) % WORKBOOK.areas.length];
  $('#nav').innerHTML = a.groups.map(g => `<a href="#g-${g.id}" data-g="${g.id}">${esc(g.title)}<span>${g.terms.length}</span></a>`).join('');
  $('#main').innerHTML = a.groups.map(g => groupHTML(g)).join('') + emptyMsg + `<a class="next" href="#${next.id}">Next: ${esc(next.title)} →</a>`;
  $('#q').value = '';
  document.title = `${a.title} · Film & Cinematography Workbook`;
}

function route() {
  const id = location.hash.slice(1);
  const a = WORKBOOK.areas.find(x => x.id === id);
  if (a) renderSubject(a);
  else if (!id || !document.getElementById(id)) { renderHome(); document.title = 'Film & Cinematography Workbook'; }
  else return;
  if (pendingJump) { const j = pendingJump; pendingJump = null; setTimeout(() => jumpTo(j), 60); }
  else if (a || !id) window.scrollTo(0, 0);
}

function compose() {
  const subj = $('#subject-in').value.trim() || '[what happens in the scene]';
  const aspect = $('#aspect-in').value.trim();
  const chosen = [];
  WORKBOOK.areas.forEach(a => a.groups.forEach(g => {
    const ps = g.terms.filter(t => picks.has(t.id));
    if (ps.length) chosen.push([g, ps]);
  }));
  const n = chosen.reduce((s, [, ps]) => s + ps.length, 0);
  if (fmt === 'line') {
    const parts = [`A cinematic shot: ${subj}`, ...chosen.flatMap(([, ps]) => ps.map(t => t.prompt))];
    if (aspect) parts.push(`aspect ratio ${aspect}`);
    return { text: parts.join(', ') + '.', n };
  }
  const lines = [`Plan this as a scene from a film: ${subj}.`];
  if (aspect) lines.push(`Aspect ratio: ${aspect}.`);
  lines.push('', 'Shot, staging, light and look:');
  chosen.forEach(([g, ps]) => lines.push(`- ${g.slot}: ${ps.map(t => t.prompt).join('; ')}`));
  if (!n) lines.push('- (add terms from the workbook)');
  lines.push('', 'If you are making one image or one video clip, treat it as a single shot and keep the light motivated by something in the scene. If you are planning a scene, write it as a numbered shot list (shot size, angle, who is in frame, what moves, what we hear) and use the edit picks between shots. No subtitles, watermarks or logos unless a pick asks for them.');
  return { text: lines.join('\n'), n };
}

function renderTray() {
  const { text, n } = compose();
  $('#out').textContent = text;
  const names = [...picks].filter(id => TERMS[id]).map(id => TERMS[id].t.name);
  $('#count').innerHTML = n
    ? `${n} pick${n > 1 ? 's' : ''}<small>${esc(names.join(' · '))}</small>`
    : `Nothing picked yet<small>Press "Add to prompt" on any card to start</small>`;
  $('#fmt-list').setAttribute('aria-pressed', fmt === 'list');
  $('#fmt-line').setAttribute('aria-pressed', fmt === 'line');
}

function copyText(text, btn, fallbackEl) {
  const done = ok => { const o = btn.textContent; btn.textContent = ok ? 'Copied' : 'Selected, press Ctrl+C'; setTimeout(() => btn.textContent = o, 1400); };
  const select = () => { if (!fallbackEl) return; const r = document.createRange(); r.selectNodeContents(fallbackEl); const s = getSelection(); s.removeAllRanges(); s.addRange(r); };
  try { navigator.clipboard.writeText(text).then(() => done(true), () => { select(); done(false); }); }
  catch (e) { select(); done(false); }
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
  if (homeMode) { $('#results').hidden = !q; ['#tiles', '#recipe', '#xlate'].forEach(s => $(s).hidden = !!q); }
}

document.addEventListener('click', e => {
  const add = e.target.closest('[data-add]');
  if (add) {
    const id = add.dataset.add;
    picks.has(id) ? picks.delete(id) : picks.add(id);
    store.set('fcw-picks', [...picks]);
    const on = picks.has(id);
    add.setAttribute('aria-pressed', on); add.textContent = on ? 'Added' : 'Add to prompt';
    document.getElementById('t-' + id).classList.toggle('picked', on);
    renderTray(); return;
  }
  const cp = e.target.closest('[data-copy]');
  if (cp) { const el = document.getElementById('p-' + cp.dataset.copy); copyText(el.textContent, cp, el); return; }
  const sk = e.target.closest('[data-aspect]');
  if (sk) { $('#aspect-in').value = sk.dataset.aspect; store.set('fcw-aspect', sk.dataset.aspect); renderTray(); return; }
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
  picks.clear(); store.set('fcw-picks', []);
  document.querySelectorAll('.card.picked').forEach(c => c.classList.remove('picked'));
  document.querySelectorAll('[data-add]').forEach(b => { b.setAttribute('aria-pressed', 'false'); b.textContent = 'Add to prompt'; });
  renderTray();
});
$('#fmt-list').addEventListener('click', () => { fmt = 'list'; store.set('fcw-fmt', fmt); renderTray(); });
$('#fmt-line').addEventListener('click', () => { fmt = 'line'; store.set('fcw-fmt', fmt); renderTray(); });
$('#aspects').innerHTML = WORKBOOK.aspects.map(s => `<button type="button" data-aspect="${esc(s)}">${esc(s)}</button>`).join('');
$('#subject-in').value = store.get('fcw-subject', '');
$('#aspect-in').value = store.get('fcw-aspect', '');
$('#subject-in').addEventListener('input', () => { store.set('fcw-subject', $('#subject-in').value); renderTray(); });
$('#aspect-in').addEventListener('input', () => { store.set('fcw-aspect', $('#aspect-in').value); renderTray(); });

route();
renderTray();
