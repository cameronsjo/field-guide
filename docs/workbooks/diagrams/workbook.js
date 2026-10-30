/* ---------- diagram kit: a builder that draws on a 320 x 200 grid ---------- */
const xe = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const r1 = n => Math.round(n * 10) / 10;
class Dg {
  constructor() { this.out = []; }
  _lines(label) { return String(label).split('\n'); }
  _w(label, size = 11.5) { return Math.max(46, Math.max(...this._lines(label).map(l => l.length)) * size * 0.58 + 18); }
  _label(x, y, label, o = {}) {
    const ls = this._lines(label), lh = o.lh || 13.5, y0 = y - (ls.length - 1) * lh / 2;
    return ls.map((l, i) => `<text x="${r1(x)}" y="${r1(y0 + i * lh)}" text-anchor="middle" class="${o.cls || ''}">${xe(l)}</text>`).join('');
  }
  // a rounded box centered on x,y. o: { w, h, sub, dash, r (corner radius), bold }
  box(x, y, label, c = 'n', o = {}) {
    const n = this._lines(label).length, sub = o.sub ? 1 : 0;
    const w = o.w || Math.max(this._w(label), o.sub ? this._w(o.sub, 9.5) : 0), h = o.h || n * 13.5 + 14 + sub * 11;
    const rx = o.r == null ? 5 : o.r;
    this.out.push(`<g class="c-${c}"><rect class="nd${o.dash ? ' dash' : ''}" x="${r1(x - w / 2)}" y="${r1(y - h / 2)}" width="${r1(w)}" height="${r1(h)}" rx="${rx}"/>${this._label(x, y - sub * 5, label, { cls: o.bold === false ? '' : 'b' })}${o.sub ? `<text x="${r1(x)}" y="${r1(y + n * 6.75 + 1)}" text-anchor="middle" class="sm mono">${xe(o.sub)}</text>` : ''}</g>`);
    return { x, y, w, h, s: 'r' };
  }
  // a database cylinder centered on x,y
  db(x, y, label, c = 'n', o = {}) {
    const w = o.w || Math.max(46, this._w(label) - 6), h = o.h || 42, e = 5, t = y - h / 2, b = y + h / 2, l = x - w / 2, r = x + w / 2;
    this.out.push(`<g class="c-${c}"><path class="nd" d="M${r1(l)} ${r1(t + e)} A${r1(w / 2)} ${e} 0 0 1 ${r1(r)} ${r1(t + e)} V${r1(b - e)} A${r1(w / 2)} ${e} 0 0 1 ${r1(l)} ${r1(b - e)} Z"/><path class="nd" style="fill:none" d="M${r1(l)} ${r1(t + e)} A${r1(w / 2)} ${e} 0 0 0 ${r1(r)} ${r1(t + e)}"/>${this._label(x, y + 3, label, { cls: 'b' })}</g>`);
    return { x, y, w, h, s: 'r' };
  }
  // a queue or log: a long box of slots, label underneath. o: { w, slots, filled, label above: top }
  queue(x, y, label, c = 'n', o = {}) {
    const w = o.w || 74, h = o.h || 22, n = o.slots || 6, f = o.filled == null ? 3 : o.filled, sw = w / n;
    let s = `<g class="c-${c}"><rect class="nd" x="${r1(x - w / 2)}" y="${r1(y - h / 2)}" width="${w}" height="${h}" rx="3"/>`;
    for (let i = 0; i < n; i++) {
      if (i > 0) s += `<line x1="${r1(x - w / 2 + i * sw)}" y1="${r1(y - h / 2)}" x2="${r1(x - w / 2 + i * sw)}" y2="${r1(y + h / 2)}" class="ln k" style="stroke-width:1"/>`;
      if (i >= n - f) s += `<rect class="solid" x="${r1(x - w / 2 + i * sw + 3)}" y="${r1(y - h / 2 + 4)}" width="${r1(sw - 6)}" height="${h - 8}" rx="1.5" opacity=".75"/>`;
    }
    if (label) s += `<text x="${x}" y="${r1(o.top ? y - h / 2 - 8 : y + h / 2 + 9)}" text-anchor="middle" class="sm b">${xe(label)}</text>`;
    this.out.push(s + '</g>');
    return { x, y, w, h, s: 'r' };
  }
  // a person or client
  user(x, y, label = '', c = 'n') {
    this.out.push(`<g class="c-${c}"><circle class="nd" cx="${x}" cy="${y - 8}" r="6"/><path class="nd" d="M${x - 11} ${y + 12} Q${x - 11} ${y} ${x} ${y} Q${x + 11} ${y} ${x + 11} ${y + 12} Z"/>${label ? `<text x="${x}" y="${y + 21}" text-anchor="middle" class="sm b">${xe(label)}</text>` : ''}</g>`);
    return { x, y: y + 1, w: 24, h: 30, s: 'r' };
  }
  // a hexagon (flat sides left and right)
  hex(x, y, r, label = '', c = 'n', o = {}) {
    const p = [0, 60, 120, 180, 240, 300].map(a => { const t = (a + 30) * Math.PI / 180; return `${r1(x + r * Math.cos(t))},${r1(y + r * Math.sin(t))}`; }).join(' ');
    this.out.push(`<g class="c-${c}"><polygon class="nd${o.dash ? ' dash' : ''}" points="${p}"/>${label ? this._label(x, o.ly == null ? y : o.ly, label, { cls: 'b' }) : ''}</g>`);
    return { x, y, r: r * 0.92, s: 'c' };
  }
  // a circle; label inside, or at o.ly
  circle(x, y, r, label = '', c = 'n', o = {}) {
    this.out.push(`<g class="c-${c}"><circle class="nd${o.dash ? ' dash' : ''}" cx="${x}" cy="${y}" r="${r}"/>${label ? this._label(x, o.ly == null ? y : o.ly, label, { cls: o.small ? 'sm b' : 'b' }) : ''}</g>`);
    return { x, y, r, s: 'c' };
  }
  // a dashed boundary; x,y is the TOP-LEFT corner. Draw zones first so they sit behind.
  zone(x, y, w, h, label = '', c = 'n') {
    this.out.push(`<g class="c-${c}"><rect class="zn k" x="${x}" y="${y}" width="${w}" height="${h}" rx="7"/>${label ? `<text x="${x + 7}" y="${y + 9}" class="zl k">${xe(label)}</text>` : ''}</g>`);
    return { x: x + w / 2, y: y + h / 2, w, h, s: 'r' };
  }
  _edge(n, tx, ty, pad = 3) {
    const dx = tx - n.x, dy = ty - n.y;
    if (!dx && !dy) return [n.x, n.y];
    if (n.s === 'd') { const hw = n.w / 2 + pad, hh = n.h / 2 + pad, k = 1 / (Math.abs(dx) / hw + Math.abs(dy) / hh); return [n.x + dx * k, n.y + dy * k]; }
    if (n.s === 'c') { const d = Math.hypot(dx, dy); return [n.x + dx / d * (n.r + pad), n.y + dy / d * (n.r + pad)]; }
    const hw = n.w / 2 + pad, hh = n.h / 2 + pad, k = Math.min(dx ? hw / Math.abs(dx) : Infinity, dy ? hh / Math.abs(dy) : Infinity);
    return [n.x + dx * k, n.y + dy * k];
  }
  _head(x, y, fx, fy, c) {
    const a = Math.atan2(y - fy, x - fx), L = 7, W = 3.6;
    const p = [[x, y], [x - L * Math.cos(a) + W * Math.sin(a), y - L * Math.sin(a) - W * Math.cos(a)], [x - L * Math.cos(a) - W * Math.sin(a), y - L * Math.sin(a) + W * Math.cos(a)]];
    return `<polygon class="hd${c ? ' k' : ''}" points="${p.map(q => q.map(r1).join(',')).join(' ')}"/>`;
  }
  _tag(x, y, label) {
    const w = String(label).length * 5.5 + 8;
    return `<rect class="lbg" x="${r1(x - w / 2)}" y="${r1(y - 6.5)}" width="${r1(w)}" height="13" rx="3"/><text x="${r1(x)}" y="${r1(y)}" text-anchor="middle" class="sm mono">${xe(label)}</text>`;
  }
  // an arrow between two nodes, clipped to their edges.
  // o: { label, dash, c (color key), both, none (no head), flow (animated), bend (curve offset, + bends left of travel), lx/ly (label offset), w (stroke width) }
  link(a, b, o = {}) {
    const bend = o.bend || 0, mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const cx = mx + (-(b.y - a.y) / len) * bend * 2, cy = my + ((b.x - a.x) / len) * bend * 2;
    const [x1, y1] = this._edge(a, bend ? cx : b.x, bend ? cy : b.y), [x2, y2] = this._edge(b, bend ? cx : a.x, bend ? cy : a.y);
    const d = bend ? `M${r1(x1)} ${r1(y1)} Q${r1(cx)} ${r1(cy)} ${r1(x2)} ${r1(y2)}` : `M${r1(x1)} ${r1(y1)} L${r1(x2)} ${r1(y2)}`;
    return this._stroke(d, [x1, y1], [x2, y2], bend ? [cx, cy] : null, o, bend ? [(x1 + 2 * cx + x2) / 4, (y1 + 2 * cy + y2) / 4] : [(x1 + x2) / 2, (y1 + y2) / 2]);
  }
  // an arrow along raw points [[x,y],...]; the head is drawn at the last point.
  line(pts, o = {}) {
    const d = 'M' + pts.map(p => p.map(r1).join(' ')).join(' L');
    const m = Math.floor((pts.length - 1) / 2), mid = pts.length % 2 ? pts[m] : [(pts[m][0] + pts[m + 1][0]) / 2, (pts[m][1] + pts[m + 1][1]) / 2];
    return this._stroke(d, pts[0], pts[pts.length - 1], null, o, mid, pts[1], pts[pts.length - 2]);
  }
  _stroke(d, p1, p2, ctrl, o, mid, after1, before2) {
    const k = o.c ? ` k` : '', cls = `ln${k}${o.dash ? ' dash' : ''}${o.flow ? ' flow' : ''}`;
    let s = `<g class="c-${o.c || 'n'}"><path class="${cls}" d="${d}"${o.w ? ` style="stroke-width:${o.w}"` : ''}/>`;
    const from2 = before2 || ctrl || p1, from1 = after1 || ctrl || p2;
    if (!o.none) s += this._head(p2[0], p2[1], from2[0], from2[1], o.c);
    if (o.both) s += this._head(p1[0], p1[1], from1[0], from1[1], o.c);
    if (o.label) s += this._tag(mid[0] + (o.lx || 0), mid[1] + (o.ly || 0), o.label);
    this.out.push(s + '</g>');
    return this;
  }
  // free text. o: { c (color key, uses the color), sm, mono, b (bold), mut (muted), a ('start'|'middle'|'end'), size }
  text(x, y, s, o = {}) {
    const cls = [o.sm ? 'sm' : '', o.mono ? 'mono' : '', o.b ? 'b' : '', o.mut ? 'mut' : ''].join(' ');
    this.out.push(`<g class="c-${o.c || 'n'}">${this._lines(s).map((l, i) => `<text x="${x}" y="${y + i * (o.size ? o.size * 1.2 : (o.sm ? 11 : 13.5))}" text-anchor="${o.a || 'middle'}" class="${cls}"${o.c ? ' style="fill:var(--c)"' : ''}${o.size ? ` font-size="${o.size}"` : ''}>${xe(l)}</text>`).join('')}</g>`);
    return this;
  }
  // a small pill tag, e.g. an event name or a version
  tag(x, y, label, c = 'n') {
    const w = String(label).length * 5.5 + 10;
    this.out.push(`<g class="c-${c}"><rect class="nd" x="${r1(x - w / 2)}" y="${y - 7}" width="${r1(w)}" height="14" rx="7"/><text x="${x}" y="${y}" text-anchor="middle" class="sm mono">${xe(label)}</text></g>`);
    return { x, y, w, h: 14, s: 'r' };
  }
  // a filled dot (a message, an event); o.pulse animates it
  dot(x, y, c = 'a', r = 4, o = {}) { this.out.push(`<g class="c-${c}"><circle class="solid${o.pulse ? ' pulse' : ''}" cx="${x}" cy="${y}" r="${r}"/></g>`); return { x, y, r, s: 'c' }; }
  // a red X that marks a failure
  x(x, y, s = 6) { this.out.push(`<g class="c-r"><path class="ln k" style="stroke-width:2.4" d="M${x - s} ${y - s} L${x + s} ${y + s} M${x + s} ${y - s} L${x - s} ${y + s}"/></g>`); return this; }
  // a green check
  ok(x, y, s = 6) { this.out.push(`<g class="c-g"><path class="ln k" style="stroke-width:2.4" d="M${x - s} ${y} L${x - s / 3} ${y + s * .7} L${x + s} ${y - s * .7}"/></g>`); return this; }
  raw(svg) { this.out.push(svg); return this; }

  /* ----- additions for the Diagrams workbook ----- */
  // a decision diamond centered on x,y. o: { w, h }
  diamond(x, y, label = '', c = 'c', o = {}) {
    const w = o.w || Math.max(54, this._w(label, 10) + 18), h = o.h || 40;
    this.out.push(`<g class="c-${c}"><polygon class="nd" points="${r1(x)},${r1(y - h / 2)} ${r1(x + w / 2)},${r1(y)} ${r1(x)},${r1(y + h / 2)} ${r1(x - w / 2)},${r1(y)}"/>${label ? this._label(x, y, label, { cls: 'sm b' }) : ''}</g>`);
    return { x, y, w, h, s: 'd' };
  }
  // a stadium / pill: start and end of a flowchart, or a mind-map node
  pill(x, y, label, c = 'n', o = {}) { const h = o.h || 24; return this.box(x, y, label, c, { ...o, h, r: h / 2 }); }
  // a sticky note with a folded corner; x,y is the top-left. Text is small, left aligned, \n for lines.
  note(x, y, w, h, txt = '', c = 'c') {
    const f = 8;
    let s = `<g class="c-${c}"><path class="nd" d="M${x} ${y} H${x + w - f} L${x + w} ${y + f} V${y + h} H${x} Z"/><path class="ln k" style="stroke-width:1" d="M${x + w - f} ${y} V${y + f} H${x + w}"/>`;
    this._lines(txt).forEach((l, i) => { s += `<text x="${x + 6}" y="${y + 10 + i * 11}" class="sm">${xe(l)}</text>`; });
    this.out.push(s + '</g>');
    return { x: x + w / 2, y: y + h / 2, w, h, s: 'r' };
  }
  // a horizontal swimlane; x,y top-left. The lane name sits in a header strip on the left.
  lane(x, y, w, h, label = '', c = 'n', o = {}) {
    const hw = o.hw || 22;
    this.out.push(`<g class="c-${c}"><rect class="nd" style="fill:var(--f);opacity:.45" x="${x}" y="${y}" width="${w}" height="${h}"/><rect class="nd" x="${x}" y="${y}" width="${hw}" height="${h}"/><text transform="translate(${r1(x + hw / 2)} ${r1(y + h / 2)}) rotate(-90)" text-anchor="middle" class="sm b">${xe(label)}</text></g>`);
    return { x: x + hw, y, w: w - hw, h };
  }
  // a vertical swimlane (column); x,y top-left. Name in a header strip on top.
  col(x, y, w, h, label = '', c = 'n', o = {}) {
    const hh = o.hh || 18;
    this.out.push(`<g class="c-${c}"><rect class="nd" style="fill:var(--f);opacity:.45" x="${x}" y="${y}" width="${w}" height="${h}"/><rect class="nd" x="${x}" y="${y}" width="${w}" height="${hh}"/><text x="${r1(x + w / 2)}" y="${r1(y + hh / 2)}" text-anchor="middle" class="sm b">${xe(label)}</text></g>`);
    return { x, y: y + hh, w, h: h - hh };
  }
  // a sequence-diagram participant: head box at top y, dashed lifeline down to y2. o: { actor (stick figure head), w }
  life(x, y, y2, label, c = 'n', o = {}) {
    const top = o.actor ? this.user(x, y + 2, '', c) : this.box(x, y, label, c, { w: o.w, h: 22 });
    if (o.actor) this.text(x, y + 23, label, { sm: true, b: true });
    const y1 = o.actor ? y + 30 : y + 11;
    this.out.push(`<g class="c-${c}"><path class="ln dash" style="stroke-width:1" d="M${x} ${y1} V${y2}"/></g>`);
    return { x, y: y1 };
  }
  // a horizontal message from x1 to x2 at height y. o: { label, dash (reply), c, open (async open arrowhead), ly }
  msg(x1, x2, y, o = {}) {
    if (x1 === x2) { // self call
      const d = `M${x1} ${y} H${x1 + 22} V${y + 12} H${x1 + 2}`;
      let s = `<g class="c-${o.c || 'n'}"><path class="ln${o.c ? ' k' : ''}${o.dash ? ' dash' : ''}" d="${d}"/>${this._head(x1 + 2, y + 12, x1 + 22, y + 12, o.c)}`;
      if (o.label) s += `<text x="${x1 + 26}" y="${y + 6}" class="sm mono">${xe(o.label)}</text>`;
      this.out.push(s + '</g>'); return this;
    }
    const dir = x2 > x1 ? 1 : -1, e = x2 - dir * 1;
    let s = `<g class="c-${o.c || 'n'}"><path class="ln${o.c ? ' k' : ''}${o.dash ? ' dash' : ''}" d="M${x1} ${y} H${e}"/>`;
    if (o.open) s += `<path class="ln${o.c ? ' k' : ''}" d="M${e - dir * 7} ${y - 4} L${e} ${y} L${e - dir * 7} ${y + 4}"/>`;
    else s += this._head(e, y, x1, y, o.c);
    if (o.label) s += `<text x="${r1((x1 + x2) / 2)}" y="${y - 6 + (o.ly || 0)}" text-anchor="middle" class="sm mono">${xe(o.label)}</text>`;
    this.out.push(s + '</g>'); return this;
  }
  // an activation bar on a lifeline from y1 to y2
  act(x, y1, y2, c = 'a') { this.out.push(`<g class="c-${c}"><rect class="nd" x="${x - 3.5}" y="${y1}" width="7" height="${y2 - y1}" rx="1"/></g>`); return this; }
  // a combined fragment (alt, opt, loop, par); x,y top-left. o: { guard, split: y of the else line, guard2 }
  frag(x, y, w, h, kind, c = 'd', o = {}) {
    const tw = kind.length * 6 + 14;
    let s = `<g class="c-${c}"><rect class="zn k" style="stroke-dasharray:none" x="${x}" y="${y}" width="${w}" height="${h}" rx="2"/><path class="nd" d="M${x} ${y} H${x + tw} V${y + 9} L${x + tw - 5} ${y + 14} H${x} Z"/><text x="${x + 5}" y="${y + 7}" class="zl k" style="font-size:8px">${xe(kind)}</text>`;
    if (o.guard) s += `<text x="${x + tw + 5}" y="${y + 8}" class="sm mono">[${xe(o.guard)}]</text>`;
    if (o.split) s += `<path class="ln k dash" style="stroke-width:1" d="M${x} ${o.split} H${x + w}"/>${o.guard2 ? `<text x="${x + 6}" y="${o.split + 8}" class="sm mono">[${xe(o.guard2)}]</text>` : ''}`;
    this.out.push(s + '</g>'); return this;
  }
  // a smooth curved branch, e.g. a mind-map limb, from x1,y1 to x2,y2 (horizontal tangents). o: { w (stroke width), head }
  branch(x1, y1, x2, y2, c = 'n', o = {}) {
    const mx = (x1 + x2) / 2;
    let s = `<g class="c-${c}"><path class="ln k" style="stroke-width:${o.w || 2}" d="M${r1(x1)} ${r1(y1)} C${r1(mx)} ${r1(y1)} ${r1(mx)} ${r1(y2)} ${r1(x2)} ${r1(y2)}"/>`;
    if (o.head) s += this._head(x2, y2, mx, y2, c);
    this.out.push(s + '</g>'); return this;
  }
  // a handwritten marker annotation. o: { c, a (anchor), size, rot (degrees) }
  hand(x, y, s, o = {}) {
    const t = o.rot ? ` transform="rotate(${o.rot} ${x} ${y})"` : '';
    this.out.push(`<g class="c-${o.c || 'r'}"${t}>${this._lines(s).map((l, i) => `<text x="${x}" y="${y + i * (o.size || 15) * 1.05}" text-anchor="${o.a || 'middle'}" class="hand" style="fill:var(--c)${o.size ? `;font-size:${o.size}px` : ''}">${xe(l)}</text>`).join('')}</g>`);
    return this;
  }
  // a numbered step marker (a filled circle with a number)
  num(x, y, n, c = 'r', r = 7) { this.out.push(`<g class="c-${c}"><circle class="solid" cx="${x}" cy="${y}" r="${r}"/><text x="${x}" y="${y + .5}" text-anchor="middle" style="fill:var(--panel);font-size:${r * 1.35}px;font-weight:700">${xe(n)}</text></g>`); return { x, y, r, s: 'c' }; }
  // a hand-drawn style arrow (a gentle curve) for annotations, from x1,y1 to x2,y2. o: { c, bend }
  scribble(x1, y1, x2, y2, o = {}) {
    const bend = o.bend == null ? 14 : o.bend, mx = (x1 + x2) / 2, my = (y1 + y2) / 2, len = Math.hypot(x2 - x1, y2 - y1) || 1;
    const cx = mx - (y2 - y1) / len * bend, cy = my + (x2 - x1) / len * bend;
    this.out.push(`<g class="c-${o.c || 'r'}"><path class="ln k" style="stroke-width:1.6" d="M${r1(x1)} ${r1(y1)} Q${r1(cx)} ${r1(cy)} ${r1(x2)} ${r1(y2)}"/>${this._head(x2, y2, cx, cy, o.c || 'r')}</g>`);
    return this;
  }
}
const dg = fn => { const b = new Dg(); fn(b); return `<svg class="dg" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${b.out.join('')}</svg>`; };

/* code panel: write text with {cls|text} for colored spans. k keyword, s string, c comment, f function,
   t type, n number, d dim, h highlight, r red, g green. Spans may nest. Literal braces: &#123; &#125;.
   Keep lines <= 40 columns and <= 11 lines. */
const ccol = s => { let p; do { p = s; s = s.replace(/\{([a-z ]+)\|([^{}]*)\}/g, (_, c, t) => `<span class="${c}">${t}</span>`); } while (s !== p); return s; };
const code = (text, file = '') => `<div class="cd" data-f="${xe(file)}"><pre>${ccol(text.replace(/^\n/, '').replace(/<(?!\/?span)/g, '&lt;'))}</pre></div>`;
const rect = (b, x, y, w, h, c, o = {}) => b.raw(`<g class="c-${c}"><rect class="${o.solid ? 'solid' : 'nd'}${o.dash ? ' dash' : ''}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r == null ? 3 : o.r}"${o.op ? ` opacity="${o.op}"` : ''}/></g>`);
const path = (b, d, c, cls = 'ln k') => b.raw(`<g class="c-${c}"><path class="${cls}" d="${d}"/></g>`);


/* ---------- workbook content ----------
   Each section is a group pushed into pool.groups:
   { id, title, slot, intro, terms:[{ id, name, aka, desc, use, cost, ref, prompt, avoid?, ex }] }
*/
const pool = { groups: [] };
/* Structure & architecture: C4 model and structure diagrams */

// a UML class box; x,y is the top-left. o: { st (stereotype), abs (italic name) }
const st_cls = (b, x, y, w, name, attrs, ops, c = 'n', o = {}) => {
  const hh = o.st ? 28 : 20, ah = attrs.length * 11 + 6, oh = ops.length ? ops.length * 11 + 6 : 0, h = hh + ah + oh;
  let s = `<g class="c-${c}"><rect class="nd" x="${x}" y="${y}" width="${w}" height="${h}" rx="2"/>`;
  if (o.st) s += `<text x="${x + w / 2}" y="${y + 8}" text-anchor="middle" class="sm">${xe(o.st)}</text>`;
  s += `<text x="${x + w / 2}" y="${y + hh - 10}" text-anchor="middle" class="b"${o.abs ? ' font-style="italic"' : ''}>${xe(name)}</text>`;
  s += `<path class="ln k" style="stroke-width:1" d="M${x} ${y + hh} H${x + w}${oh ? ` M${x} ${y + hh + ah} H${x + w}` : ''}"/>`;
  attrs.forEach((a, i) => { s += `<text x="${x + 6}" y="${y + hh + 8.5 + i * 11}" class="sm mono">${xe(a)}</text>`; });
  ops.forEach((a, i) => { s += `<text x="${x + 6}" y="${y + hh + ah + 8.5 + i * 11}" class="sm mono">${xe(a)}</text>`; });
  b.raw(s + '</g>');
  return { x: x + w / 2, y: y + h / 2, w, h, s: 'r' };
};
// an ERD entity; x,y top-left. rows: [[column, key], ...]
const st_ent = (b, x, y, w, name, rows, c = 'n') => {
  const h = 18 + rows.length * 12 + 4;
  let s = `<g class="c-${c}"><rect class="nd" x="${x}" y="${y}" width="${w}" height="${h}" rx="2"/><path class="ln k" style="stroke-width:1" d="M${x} ${y + 18} H${x + w}"/><text x="${x + w / 2}" y="${y + 9.5}" text-anchor="middle" class="sm b mono">${xe(name)}</text>`;
  rows.forEach(([col, key], i) => {
    s += `<text x="${x + 6}" y="${y + 26 + i * 12}" class="sm mono">${xe(col)}</text>`;
    if (key) s += `<text x="${x + w - 6}" y="${y + 26 + i * 12}" text-anchor="end" class="sm mono mut">${xe(key)}</text>`;
  });
  b.raw(s + '</g>');
  return { x: x + w / 2, y: y + h / 2, w, h, s: 'r' };
};
// a crow's foot line end at x,y (on the entity edge), pointing away along dx,dy. kind: '||', '|<' (one or many), 'o<' (zero or many)
const st_end = (b, x, y, dx, dy, kind, c = 'n') => {
  const px = -dy, py = dx, P = (d, o = 0) => `${r1(x + dx * d + px * o)} ${r1(y + dy * d + py * o)}`;
  let d = '';
  if (kind === '||') d = `M${P(6, -5)} L${P(6, 5)} M${P(10, -5)} L${P(10, 5)}`;
  else d = `M${P(0, -6)} L${P(10)} L${P(0, 6)} M${P(0)} L${P(10)}` + (kind === '|<' ? ` M${P(14, -5)} L${P(14, 5)}` : '');
  let s = `<g class="c-${c}"><path class="ln k" d="${d}"/>`;
  if (kind === 'o<') s += `<circle class="ln k" style="fill:var(--tile)" cx="${r1(x + dx * 16)}" cy="${r1(y + dy * 16)}" r="4"/>`;
  b.raw(s + '</g>');
};
// a deployment node: a solid outlined box with name and technology at top-left
const st_node = (b, x, y, w, h, name, tech, c = 'n') => {
  b.raw(`<g class="c-${c}"><rect class="nd" style="fill:none" x="${x}" y="${y}" width="${w}" height="${h}" rx="4"/><text x="${x + 7}" y="${y + 11}" class="sm b">${xe(name)}</text><text x="${x + 7}" y="${y + 22}" class="sm mono mut">${xe(tech)}</text></g>`);
  return { x: x + w / 2, y: y + h / 2, w, h, s: 'r' };
};

pool.groups.push({
  id: 'c4', title: 'C4 model', slot: 'C4 view',
  intro: 'Simon Brown\'s four zoom levels for software: context, containers, components and code, each a map at a different scale of the same system. Around them sit three supporting views for the whole estate, a runtime scenario and the infrastructure. Draw the level your reader needs and no more.',
  terms: [
    { id: 'c4context', name: 'System context diagram', aka: 'C4 level 1, context diagram, big picture',
      desc: 'Your software system as one box in the middle, with the people who use it and the other systems it talks to around it. No technology, no internals: just who and what it depends on, and why.',
      use: 'you need one picture that anyone in the company, technical or not, can read in a minute',
      cost: 'sneaking containers or databases into it; once the inside shows, it stops being the big picture',
      ref: 'Simon Brown, c4model.com; Structurizr; "The C4 model for visualising software architecture"',
      prompt: 'a C4 system context diagram: one box for our system in the center, people as person shapes, external systems as grey boxes around it; every box shows name, [type] and a one-line purpose, every arrow a verb label, and no internals',
      ex: dg(b => {
        const u = b.user(160, 24, '', 'a');
        b.text(176, 18, 'Customer', { sm: true, b: true, a: 'start' }); b.text(176, 30, '[Person]', { sm: true, mono: true, mut: true, a: 'start' });
        const s = b.box(160, 94, 'Internet Banking', 'a', { sub: '[Software System]', w: 150 });
        const m = b.box(80, 166, 'Mainframe', 'n', { sub: '[Software System]' }), e = b.box(240, 166, 'Email system', 'n', { sub: '[Software System]' });
        b.link(u, s, { label: 'views accounts' });
        b.link(s, m, { label: 'reads accounts', lx: -12 }); b.link(s, e, { label: 'sends email', lx: 12 });
      }) },

    { id: 'c4container', name: 'Container diagram', aka: 'C4 level 2, containers view',
      desc: 'Zooms into one system and shows its containers: the separately running or deployed things such as web apps, APIs, databases, queues and mobile apps. Each box names its technology, and each arrow names the protocol.',
      use: 'developers and ops need to see what runs, what it is built with and how the pieces talk',
      cost: 'confusing C4 containers with Docker containers, and listing every microservice until the page turns into spaghetti',
      ref: 'Simon Brown, c4model.com; Structurizr; C4-PlantUML',
      prompt: 'a C4 container diagram for one system inside a labeled boundary: each container as a box with name, [Container: technology] and its job, databases as cylinders, external systems grey outside the boundary; label every arrow with intent and protocol, e.g. reads accounts [JSON/HTTPS]',
      ex: dg(b => {
        b.zone(64, 12, 160, 178, 'internet banking', 'a');
        const u = b.user(32, 36, 'Customer', 'a');
        const w = b.box(144, 52, 'Web app', 'a', { sub: '[Container: React]', w: 120 });
        const a = b.box(144, 110, 'API', 'a', { sub: '[Container: Java]', w: 120 });
        const d = b.db(144, 165, '', 'a', { w: 120, h: 42 });
        b.text(144, 165, 'Database', { b: true }); b.text(144, 177, '[Postgres]', { sm: true, mono: true });
        const m = b.box(268, 110, 'Mainframe', 'n', { sub: '[External]' });
        b.link(u, w); b.link(w, a); b.link(a, d); b.link(a, m);
        b.text(58, 51, 'uses', { sm: true, mono: true, a: 'start' }); b.text(150, 81, 'JSON/HTTPS', { sm: true, mono: true, a: 'start' }); b.text(150, 138, 'SQL', { sm: true, mono: true, a: 'start' });
        b.text(268, 82, 'XML/HTTPS', { sm: true, mono: true });
      }) },

    { id: 'c4component', name: 'Component diagram', aka: 'C4 level 3, components view',
      desc: 'Zooms into one container and shows the major components inside it: controllers, services, repositories, facades, the groupings of code behind one interface. Arrows show which component calls which, and what sits outside the container.',
      use: 'a team is planning work inside one service and wants to agree on its internal structure',
      cost: 'drawing it for every container and keeping it current by hand; generate it from code or keep it to the one container that needs it',
      ref: 'Simon Brown, c4model.com; Structurizr component finder; Spring Modulith documentation',
      prompt: 'a C4 component diagram zoomed into one container: its boundary as a labeled dashed box, 3 to 7 components inside as boxes with name and [Component], neighbouring containers and systems grey outside, arrows labeled with what is called',
      ex: dg(b => {
        const w = b.box(160, 26, 'Web app', 'n', { h: 26 });
        b.zone(14, 56, 292, 80, 'api application [container]', 'a');
        const s = b.box(58, 100, 'Sign-in', 'a', { sub: '[Component]', w: 80 });
        const ac = b.box(160, 100, 'Accounts', 'a', { sub: '[Component]', w: 80 });
        const f = b.box(262, 100, 'Facade', 'a', { sub: '[Component]', w: 80 });
        const d = b.db(58, 168, 'Database', 'n', { h: 36 }), m = b.box(262, 168, 'Mainframe', 'n', { h: 28 });
        b.link(w, s); b.link(w, ac); b.link(s, d); b.link(ac, f); b.link(f, m);
      }) },

    { id: 'c4code', name: 'Code diagram', aka: 'C4 level 4, class diagram, code view',
      desc: 'Zooms into one component and shows the code that implements it, usually as a UML class diagram of its main classes and interfaces. It is the most detailed C4 level and the one most often skipped.',
      use: 'a component has a tricky internal design, such as a plugin interface or a pattern, that people keep getting wrong',
      cost: 'drawing it by hand; it goes stale with the first refactor, so generate it from the IDE or leave it out',
      ref: 'Simon Brown, c4model.com; IntelliJ IDEA UML diagrams; PlantUML class diagrams',
      prompt: 'a C4 code-level view of one component as a UML class diagram: only the 3 to 6 classes and interfaces that matter, public methods only, dependency arrows dashed, implementation arrows with hollow heads, nothing from other components',
      ex: dg(b => {
        const c = st_cls(b, 14, 34, 132, 'AccountsController', [], ['+ list(): Account[]', '+ get(id): Account']);
        const s = st_cls(b, 176, 26, 130, 'AccountService', [], ['+ find(id)', '+ all()'], 'a', { st: '«interface»' });
        const r = st_cls(b, 176, 122, 130, 'AccountRepository', [], ['+ byId(id)', '+ save(a)'], 'a');
        b.link(c, s, { dash: true }); b.link(s, r);
        b.hand(80, 140, 'generate this one,\ndon\'t draw it', { c: 'd' });
      }) },

    { id: 'c4landscape', name: 'System landscape diagram', aka: 'enterprise context, landscape view',
      desc: 'A context diagram for a whole organization: every software system and the people who use them, with no single system in focus. It shows how the estate hangs together and which systems are the hubs.',
      use: 'you are onboarding someone to a whole department, or planning work that touches many systems',
      cost: 'trying to show every integration; above about 15 systems it needs grouping by domain or it becomes a wall of lines',
      ref: 'Simon Brown, c4model.com (supplementary diagrams); Structurizr systemLandscape view',
      prompt: 'a C4 system landscape: all software systems of the organization as boxes inside an enterprise boundary, grouped by business domain, people outside on the left; arrows only for the main relationships, each with a short verb label',
      ex: dg(b => {
        b.zone(78, 10, 234, 180, 'big bank plc', 'a');
        const cu = b.user(36, 54, 'Customer', 'b'), sf = b.user(36, 138, 'Staff', 'b');
        const [wb, at, cr] = [['Web banking', 50], ['ATM', 104], ['CRM', 158]].map(([l, y]) => b.box(140, y, l, 'a', { sub: '[System]', w: 92 }));
        const [em, mf, dl] = [['Email', 50], ['Mainframe', 104], ['Data lake', 158]].map(([l, y]) => b.box(256, y, l, 'a', { sub: '[System]', w: 84 }));
        b.link(cu, wb); b.link(cu, at); b.link(sf, cr);
        b.link(wb, em); b.link(wb, mf); b.link(at, mf); b.link(cr, mf); b.link(mf, dl);
      }) },

    { id: 'c4dynamic', name: 'Dynamic diagram', aka: 'C4 dynamic view, runtime view, collaboration view',
      desc: 'Uses the same boxes as a container or component diagram, but shows one scenario at runtime: numbered arrows give the order of the calls for a single use case like signing in. It is the C4 cousin of a communication diagram.',
      use: 'you want to explain one important flow without leaving the C4 notation your readers already know',
      cost: 'more than about eight steps or any branching; at that point a sequence diagram reads better',
      ref: 'Simon Brown, c4model.com (dynamic diagram); Structurizr dynamic views; arc42 runtime view',
      prompt: 'a C4 dynamic diagram for one scenario: only the containers or components involved, arrows numbered 1, 2, 3 in call order with a short label each, and the scenario name as the title; no more than 8 steps',
      ex: dg(b => {
        b.text(160, 14, 'scenario: customer signs in', { sm: true, mut: true });
        const w = b.box(62, 58, 'Web app', 'a', { sub: '[Container]' });
        const s = b.box(250, 58, 'Sign-in', 'a', { sub: '[Component]', w: 84 });
        const se = b.box(250, 156, 'Security', 'a', { sub: '[Component]', w: 84 });
        const d = b.db(62, 156, 'Database', 'c');
        b.line([[104, 48], [205, 48]], { label: '1. POST /login' });
        b.link(s, se, { label: '2. validate()' }); b.link(se, d, { label: '3. SELECT user' });
        b.line([[205, 68], [104, 68]], { dash: true, label: '4. JWT' });
      }) },

    { id: 'c4deployment', name: 'Deployment diagram', aka: 'C4 deployment view, infrastructure view',
      desc: 'Shows where containers run in one environment: nested deployment nodes such as a region, a cluster, a VM or a browser, with container instances placed inside them. Each environment, like staging or production, gets its own diagram.',
      use: 'ops, security or a new on-call engineer needs to know what runs where, and how many of it',
      cost: 'mixing environments in one picture, or drawing every node and subnet; group identical instances and note the count',
      ref: 'Simon Brown, c4model.com (deployment diagram); UML deployment diagrams; Structurizr deployment views',
      prompt: 'a C4 deployment diagram for production: deployment nodes as nested solid boxes labeled with name and [technology], e.g. region > cluster > service; container instances inside with an instance count; arrows labeled with protocol',
      ex: dg(b => {
        st_node(b, 8, 46, 86, 116, 'Browser', '[Chrome]');
        const w = b.box(51, 120, 'Web app', 'a', { sub: '[SPA]', w: 66 });
        st_node(b, 104, 10, 208, 182, 'AWS eu-west-1', '[Region]');
        st_node(b, 114, 42, 92, 140, 'ECS cluster', '[Fargate]');
        st_node(b, 214, 42, 88, 140, 'RDS', '[Postgres 16]');
        const a = b.box(160, 120, 'API', 'a', { sub: '[Java]', w: 62 });
        b.text(160, 150, 'x 3', { sm: true, mono: true, b: true, c: 'a' });
        const d = b.db(258, 122, 'DB', 'c', { w: 54 });
        b.link(w, a); b.link(a, d);
      }) },

    { id: 'c4notation', name: 'C4 notation conventions', aka: 'C4 element anatomy, C4 key',
      desc: 'C4 is notation independent, but it asks for a few habits: every box carries a name, an element type, the technology and a short description; every arrow is one-way and labeled with intent and protocol; and every diagram has a title and a key.',
      use: 'you are drawing any C4 view, in any tool, and want strangers to read it without asking',
      cost: 'boxes that only have a name; a box called Billing tells nobody whether it is a service, a team or a database',
      ref: 'Simon Brown, c4model.com (notation); Structurizr themes; C4-PlantUML legends',
      prompt: 'C4 notation conventions: each box shows its name in bold, [element type: technology] beneath, then a one-sentence description; arrows one-way with a verb phrase and [protocol]; a title stating scope and level, and a key for shapes, colors and line styles',
      ex: dg(b => {
        b.hand(160, 18, 'name, type, tech, what it does', { c: 'd' });
        rect(b, 14, 38, 140, 76, 'a', { r: 5 });
        b.text(84, 54, 'Billing API', { b: true }); b.text(84, 68, '[Container: Go]', { sm: true, mono: true });
        b.text(84, 86, 'Creates invoices', { sm: true }); b.text(84, 97, 'and charges cards', { sm: true });
        const d = b.db(258, 76, '', 'c', { w: 92, h: 62 });
        b.text(258, 74, 'Ledger', { b: true }); b.text(258, 88, '[Postgres]', { sm: true, mono: true });
        b.line([[157, 76], [209, 76]]);
        b.text(183, 66, 'writes', { sm: true }); b.text(183, 87, '[SQL]', { sm: true, mono: true });
        b.zone(14, 132, 292, 54, 'key', 'n');
        rect(b, 26, 158, 14, 14, 'a'); b.text(46, 165, 'container', { sm: true, a: 'start' });
        rect(b, 118, 158, 14, 14, 'c'); b.text(138, 165, 'data store', { sm: true, a: 'start' });
        b.line([[212, 165], [240, 165]], { dash: true }); b.text(248, 165, 'async', { sm: true, a: 'start' });
      }) }
  ]
});

pool.groups.push({
  id: 'structural', title: 'Structure diagrams', slot: 'Structure diagram',
  intro: 'Pictures of what exists and how it connects, outside the C4 vocabulary: quick sketches, layers, classes and tables, dependencies, networks, trust zones and cloud accounts. Each answers a narrower question than a C4 view and uses its own established notation.',
  terms: [
    { id: 'boxarrow', name: 'Box-and-arrow sketch', aka: 'whiteboard diagram, napkin sketch, architecture sketch',
      desc: 'Boxes for things, arrows for how they connect, drawn fast with no formal notation. It is how most architecture conversations start, on a whiteboard or in Excalidraw.',
      use: 'you are thinking out loud with a few people and speed matters more than precision',
      cost: 'it outliving the meeting; without a key or labels, nobody can tell later whether an arrow meant calls, depends on or sends data',
      ref: 'Excalidraw, tldraw, Miro; Simon Brown "Software Architecture for Developers"',
      prompt: 'a quick box-and-arrow sketch: one box per running thing with a plain name, arrows in the direction data flows, a short label on every arrow, left to right, under 8 boxes, and one handwritten note on the part under discussion',
      ex: dg(b => {
        const w = b.box(40, 62, 'Web'), a = b.box(140, 62, 'API'), d = b.db(264, 62, 'DB');
        const q = b.queue(140, 140, 'jobs', 'n', { w: 64, slots: 4, filled: 2 });
        const k = b.box(264, 140, 'Worker', 'c');
        b.link(w, a, { label: 'REST' }); b.link(a, d, { label: 'SQL' }); b.link(a, q, { label: 'enqueue' }); b.link(q, k); b.link(k, d);
        b.hand(262, 182, 'the slow bit');
      }) },

    { id: 'layercake', name: 'Layer diagram', aka: 'layer cake, stack diagram, layered architecture diagram',
      desc: 'Horizontal bands stacked on top of each other, each a layer of the system, with the rule that a layer only calls the one below it. A vertical bar on the side often holds cross-cutting concerns like auth and logging.',
      use: 'you want to show the dependency rule of a codebase or the parts of a platform stack',
      cost: 'drawing layers that the code does not actually enforce; check it against the imports',
      ref: 'Microsoft Application Architecture Guide (layered style); OSI model diagrams; Mark Richards "Software Architecture Patterns"',
      prompt: 'a layer diagram: full-width horizontal bands from top (presentation) to bottom (infrastructure), each labeled with its name and two example contents, one arrow on the side saying calls go down only, and cross-cutting concerns as a vertical bar on the right',
      ex: dg(b => {
        [['Presentation', 'controllers, views', 'a', 36], ['Application', 'use cases', 'a', 80], ['Domain', 'entities, rules', 'b', 124], ['Infrastructure', 'db, queues, http', 'n', 168]]
          .forEach(([l, s, c, y]) => b.box(150, y, l, c, { w: 196, h: 34, sub: s }));
        rect(b, 258, 19, 46, 166, 'c', { r: 5 });
        b.raw(`<text transform="translate(281 102) rotate(-90)" text-anchor="middle" class="sm b">cross-cutting: auth, logging</text>`);
        b.line([[32, 24], [32, 180]]);
        b.raw(`<text transform="translate(22 102) rotate(-90)" text-anchor="middle" class="sm mut">calls go down only</text>`);
      }) },

    { id: 'classdiagram', name: 'UML class diagram', aka: 'class diagram, domain model diagram, object model',
      desc: 'Classes as three-part boxes holding the name, attributes and operations, joined by typed relationships: association with multiplicities, composition with a filled diamond, and inheritance with a hollow triangle. It shows the static shape of a model.',
      use: 'you are agreeing on a domain model or explaining an object design before or after coding it',
      cost: 'copying every field and getter; show the classes and relationships that carry the idea and leave the rest to the code',
      ref: 'OMG UML 2.5 specification; Martin Fowler "UML Distilled"; PlantUML, Mermaid classDiagram',
      prompt: 'a UML class diagram: three-compartment boxes (name, key attributes, key operations), associations with multiplicities at both ends, composition with a filled diamond on the owner, inheritance with a hollow triangle on the parent, abstract names in italics, under 8 classes',
      ex: dg(b => {
        const cu = st_cls(b, 10, 24, 74, 'Customer', ['- name', '- email'], ['+ orders()']);
        const o = st_cls(b, 126, 24, 84, 'Order', ['- id: UUID', '- total'], ['+ place()']);
        const ol = st_cls(b, 240, 24, 72, 'OrderLine', ['- qty: int'], []);
        b.line([[84, 56], [126, 56]], { none: true });
        b.text(88, 48, '1', { sm: true, mono: true, a: 'start' }); b.text(123, 65, '0..*', { sm: true, mono: true, a: 'end' });
        b.raw(`<g class="c-n"><polygon class="solid" style="fill:var(--d-line)" points="210,56 216,52 222,56 216,60"/></g>`);
        b.line([[222, 56], [240, 56]], { none: true });
        b.text(237, 66, '1..*', { sm: true, mono: true, a: 'end' });
        const p = st_cls(b, 126, 122, 84, 'Payment', ['- amount'], ['+ capture()'], 'a', { abs: true });
        b.line([[168, 89], [168, 122]], { none: true });
        b.text(173, 98, '1', { sm: true, mono: true, a: 'start' }); b.text(173, 114, '1', { sm: true, mono: true, a: 'start' });
        st_cls(b, 240, 132, 72, 'Card', ['- last4'], [], 'a'); st_cls(b, 10, 132, 80, 'Transfer', ['- iban'], [], 'a');
        b.line([[240, 150], [219, 150]], { none: true }); b.line([[90, 150], [117, 150]], { none: true });
        b.raw(`<g class="c-a"><polygon class="ln k" style="fill:var(--tile)" points="210,150 219,145 219,155"/><polygon class="ln k" style="fill:var(--tile)" points="126,150 117,145 117,155"/></g>`);
      }) },

    { id: 'erd', name: 'Entity relationship diagram', aka: 'ERD, ER diagram, crow\'s foot diagram, data model',
      desc: 'Tables or entities as boxes listing their columns and keys, joined by lines whose ends show cardinality in crow\'s foot notation: a bar for one, a circle for zero, a three-pronged foot for many. It shows how data relates and what must exist for what.',
      use: 'you are designing or reviewing a database schema, or explaining one to people who will query it',
      cost: 'drawing all 80 tables at once; show one subject area and mark which keys are primary and foreign',
      ref: 'Peter Chen (1976); Gordon Everest (crow\'s foot); dbdiagram.io, Mermaid erDiagram, DBeaver',
      prompt: 'an entity relationship diagram in crow\'s foot notation: one box per table with its name in caps, columns listed with PK and FK marked, relationship lines with correct cardinality at both ends, a verb on each line, one subject area of at most 8 tables',
      ex: dg(b => {
        st_ent(b, 14, 22, 96, 'CUSTOMER', [['id', 'PK'], ['name'], ['email']]);
        st_ent(b, 210, 22, 96, 'ORDER', [['id', 'PK'], ['customer_id', 'FK'], ['placed_at']]);
        st_ent(b, 14, 118, 96, 'PRODUCT', [['id', 'PK'], ['sku'], ['price']]);
        st_ent(b, 210, 118, 96, 'ORDER_LINE', [['order_id', 'FK'], ['product_id', 'FK'], ['qty']]);
        b.line([[110, 46], [210, 46]], { none: true, label: 'places' }); st_end(b, 110, 46, 1, 0, '||'); st_end(b, 210, 46, -1, 0, 'o<');
        b.line([[258, 80], [258, 118]], { none: true }); st_end(b, 258, 80, 0, 1, '||'); st_end(b, 258, 118, 0, -1, '|<');
        b.text(268, 99, 'has', { sm: true, mono: true, a: 'start' });
        b.line([[110, 142], [210, 142]], { none: true, label: 'appears in', lx: -4 }); st_end(b, 110, 142, 1, 0, '||'); st_end(b, 210, 142, -1, 0, 'o<');
      }) },

    { id: 'depgraph', name: 'Dependency graph', aka: 'module graph, package dependency diagram, import graph',
      desc: 'Modules, packages or services as nodes and dependencies as arrows from the user to the thing it uses. Laid out in layers, it shows what everything rests on and makes cycles and surprising imports jump out.',
      use: 'you are untangling a codebase, planning a migration order, or checking that boundaries hold',
      cost: 'generated graphs of hundreds of nodes; filter to one area and collapse leaf packages, or nobody can see anything',
      ref: 'Graphviz dot; madge, dependency-cruiser (JS); jdeps, ArchUnit (Java); Nx graph; go mod graph',
      prompt: 'a dependency graph laid out top to bottom: each module as a small rounded node, arrows from the depending module to the one it imports, stable shared modules at the bottom, any cycle drawn in red and called out',
      ex: dg(b => {
        b.text(12, 22, 'A → B: A imports B', { sm: true, mut: true, a: 'start' });
        const ap = b.pill(160, 26, 'app'), w = b.pill(92, 76, 'web'), a = b.pill(228, 76, 'api');
        const ui = b.pill(40, 128, 'ui'), dm = b.pill(160, 128, 'domain', 'r'), db = b.pill(272, 128, 'db', 'r');
        const u = b.pill(160, 178, 'util', 'b');
        b.link(ap, w); b.link(ap, a); b.link(w, ui); b.link(w, dm); b.link(a, dm); b.link(a, db);
        b.link(dm, u); b.link(ui, u);
        b.link(dm, db, { c: 'r', bend: 8 }); b.link(db, dm, { c: 'r', bend: 8 });
        b.hand(278, 166, 'cycle!');
      }) },

    { id: 'network', name: 'Network topology diagram', aka: 'network diagram, topology map, infrastructure network diagram',
      desc: 'Devices and network segments: the internet edge, firewalls, routers and switches, subnets or VLANs with their address ranges, and the hosts in each. It shows what can physically or logically reach what.',
      use: 'you are planning segmentation, debugging connectivity or answering an auditor\'s question about what sits in the DMZ',
      cost: 'mixing physical cabling and logical segments in one drawing; pick one, and note address ranges on every segment',
      ref: 'Cisco network topology icons; draw.io network shapes; NetBox; Microsoft Visio',
      prompt: 'a network topology diagram: internet on the left, firewall next, each subnet or VLAN as a labeled zone with its CIDR range, a switch per zone and hosts hanging off it with their last octet; plain lines without arrowheads for links',
      ex: dg(b => {
        b.raw(`<g class="c-n"><path class="nd" d="M18 116 A11 11 0 0 1 20 94 A14 14 0 0 1 44 84 A12 12 0 0 1 64 96 A10 10 0 0 1 62 116 Z"/></g>`);
        b.text(41, 104, 'Internet', { sm: true, b: true });
        const fw = b.box(104, 104, 'FW', 'c', { w: 34, h: 40 });
        b.zone(146, 16, 166, 80, 'dmz 10.0.1.0/24', 'b'); b.zone(146, 112, 166, 80, 'lan 10.0.2.0/24', 'a');
        const s1 = b.box(178, 60, 'sw', 'b', { w: 34, h: 22 }), s2 = b.box(178, 156, 'sw', 'a', { w: 34, h: 22 });
        const w1 = b.box(236, 60, 'web1', 'b', { sub: '.11', w: 42 }), w2 = b.box(284, 60, 'web2', 'b', { sub: '.12', w: 42 });
        const ap = b.box(236, 156, 'app', 'a', { sub: '.21', w: 42 }), db = b.box(284, 156, 'db', 'a', { sub: '.22', w: 42 });
        b.line([[66, 104], [87, 104]], { none: true });
        b.line([[121, 96], [140, 60], [161, 60]], { none: true }); b.line([[121, 112], [140, 156], [161, 156]], { none: true });
        b.line([[195, 60], [215, 60]], { none: true }); b.line([[178, 49], [178, 34], [284, 34], [284, 41]], { none: true });
        b.line([[195, 156], [215, 156]], { none: true }); b.line([[178, 167], [178, 182], [284, 182], [284, 175]], { none: true });
      }) },

    { id: 'trustboundary', name: 'Threat model data flow diagram', aka: 'threat model DFD, trust boundary diagram, STRIDE diagram',
      desc: 'A data flow diagram drawn for security: external entities as rectangles, processes as circles, data stores as open-ended boxes, and dashed trust boundaries wherever data crosses from less trusted to more trusted. Every flow that crosses a boundary is a place to ask what could go wrong.',
      use: 'you are running a threat modeling session or a security review of a new feature',
      cost: 'drawing the architecture and forgetting the boundaries; the boundaries and the flows that cross them are the whole point',
      ref: 'Adam Shostack "Threat Modeling: Designing for Security"; Microsoft Threat Modeling Tool; OWASP Threat Dragon; STRIDE',
      prompt: 'a threat model data flow diagram: external entities as rectangles, processes as circles, data stores as two parallel lines, labeled flow arrows, trust boundaries as red dashed lines, and a numbered marker on each flow that crosses a boundary for the threat discussion',
      ex: dg(b => {
        b.raw(`<g class="c-r"><path class="ln k dash" style="stroke-width:1.4" d="M80 24 V188 M206 24 V188"/></g>`);
        b.text(80, 14, 'trust boundary', { sm: true, c: 'r' }); b.text(206, 14, 'trust boundary', { sm: true, c: 'r' });
        const u = b.box(36, 70, 'User', 'n', { r: 0 });
        const p = b.circle(142, 70, 27, 'Web\napp', 'a', { small: true });
        const k = b.box(262, 70, 'Card API', 'n', { r: 0 });
        b.zone(94, 132, 96, 52, '', 'r');
        b.raw(`<g class="c-c"><path class="nd" d="M108 145 H178 V171 H108 Z" style="stroke:none"/><path class="ln k" d="M108 145 H178 M108 171 H178 M108 145 V171"/></g>`);
        b.text(145, 158, 'Orders', { b: true, sm: true });
        b.link(u, p, { label: 'login' }); b.link(p, k, { label: 'token' }); b.line([[142, 100], [142, 142]]);
        b.num(80, 46, '1'); b.num(206, 46, '2'); b.num(94, 132, '3');
        b.text(214, 140, '1 spoofing\n2 disclosure\n3 tampering', { sm: true, a: 'start' });
      }) },

    { id: 'cloudinfra', name: 'Cloud architecture diagram', aka: 'AWS architecture diagram, Azure diagram, reference architecture',
      desc: 'Managed services placed inside the provider\'s nesting of account, region, VPC, availability zone and subnet. It shows redundancy, network placement and which managed services the system leans on.',
      use: 'you are reviewing resilience or cost, or handing an environment to a platform or security team',
      cost: 'icon soup; dozens of service logos with unlabeled lines tell the reader which products you bought, and little about how requests flow',
      ref: 'AWS Architecture Icons and Reference Architecture Diagrams; Azure Architecture Center; Google Cloud architecture diagramming tool',
      prompt: 'a cloud architecture diagram: nested labeled boundaries for region, VPC and availability zones, managed services as labeled boxes in the right subnet, the request path from users to data drawn first and solid, replication and background flows dashed',
      ex: dg(b => {
        const u = b.user(24, 94, 'users');
        const cd = b.box(72, 98, 'CDN', 'n', { w: 40 });
        b.zone(102, 10, 210, 180, 'region eu-west-1', 'n');
        b.zone(110, 26, 196, 158, 'vpc 10.0.0.0/16', 'a');
        const lb = b.box(208, 56, 'Load balancer', 'a', { h: 24 });
        b.zone(116, 80, 90, 98, 'az a', 'n'); b.zone(210, 80, 90, 98, 'az b', 'n');
        const t1 = b.box(161, 116, 'App', 'a', { sub: '[ECS task]', w: 70 }), t2 = b.box(255, 116, 'App', 'a', { sub: '[ECS task]', w: 70 });
        const d1 = b.db(161, 158, 'primary', 'c', { w: 66, h: 32 }), d2 = b.db(255, 158, 'standby', 'c', { w: 66, h: 32 });
        b.link(u, cd); b.line([[92, 92], [150, 60]]);
        b.line([[184, 70], [164, 95]]); b.line([[232, 70], [252, 95]]); b.link(t1, d1); b.link(t2, d1);
        b.link(d1, d2, { dash: true, c: 'c' });
      }) }
  ]
});
/* Interactions over time: sequence diagrams, state and time */

// an underlined object name box for a communication diagram
const tm_obj = (b, x, y, label, c = 'n') => {
  const n = b.box(x, y, label, c, { h: 28 }), w = label.length * 6.6;
  b.raw(`<g class="c-${c}"><path class="ln" style="stroke-width:1;stroke:var(--ink)" d="M${r1(x - w / 2)} ${y + 8} H${r1(x + w / 2)}"/></g>`);
  return n;
};
// a UML final state (bullseye)
const tm_final = (b, x, y) => { b.raw(`<g class="c-n"><circle class="ln" style="fill:var(--tile)" cx="${x}" cy="${y}" r="8"/><circle class="solid" style="fill:var(--d-line)" cx="${x}" cy="${y}" r="4.5"/></g>`); return { x, y, r: 8, s: 'c' }; };
// a UML initial state (filled dot)
const tm_init = (b, x, y, r = 5.5) => { b.raw(`<g class="c-n"><circle class="solid" style="fill:var(--d-line)" cx="${x}" cy="${y}" r="${r}"/></g>`); return { x, y, r, s: 'c' }; };

pool.groups.push({
  id: 'sequence', title: 'Sequence diagrams', slot: 'Sequence',
  intro: 'One scenario, read top to bottom: participants across the top, time running down, messages as horizontal arrows. The notation is small, and most of its value is in a few details people skip: activation bars, the arrow styles, fragments for branches and loops, and drawing the failure case too.',
  terms: [
    { id: 'sequence', name: 'Sequence diagram', aka: 'UML sequence diagram, interaction diagram, swimlane of calls',
      desc: 'Participants sit in a row across the top, each with a dashed lifeline running down. Messages are horizontal arrows between lifelines, ordered top to bottom in time, with replies drawn dashed. It shows one scenario, such as a single request, from start to finish.',
      use: 'you need to explain the order of calls in one request, an integration or an auth flow',
      cost: 'cramming every branch into one picture; draw one scenario per diagram and keep it to about ten participants',
      ref: 'OMG UML 2.5 interactions; Mermaid sequenceDiagram; PlantUML; sequencediagram.org; WebSequenceDiagrams',
      prompt: 'a sequence diagram of one scenario: participants left to right in the order they are first called, the caller or user first, dashed lifelines, solid arrows for calls labeled with the operation, dashed arrows for replies labeled with the result, time running down',
      ex: dg(b => {
        b.life(40, 20, 186, 'User', 'n', { actor: true });
        [[120, 'Web'], [200, 'API'], [280, 'DB']].forEach(([x, l]) => b.life(x, 20, 186, l));
        b.act(120, 62, 172); b.act(200, 84, 150); b.act(280, 106, 128);
        b.msg(40, 116, 62, { label: 'click Buy' }); b.msg(124, 196, 84, { label: 'POST /orders' }); b.msg(204, 276, 106, { label: 'INSERT' });
        b.msg(276, 204, 128, { dash: true, label: 'ok' }); b.msg(196, 124, 150, { dash: true, label: '201' }); b.msg(116, 40, 172, { dash: true, label: 'receipt' });
      }) },

    { id: 'activation', name: 'Activation bars', aka: 'execution specification, focus of control, activation box',
      desc: 'Thin rectangles on a lifeline that show when a participant is busy handling a call, from the message that starts the work to the reply. A call to itself stacks a second, offset bar on top, so nesting stays visible.',
      use: 'it matters who is blocked while waiting, or a call does nested work before it can answer',
      cost: 'drawing bars that do not start at an incoming message and end at a reply; a bar with no cause confuses more than it helps',
      ref: 'OMG UML 2.5 (ExecutionSpecification); Mermaid activate and deactivate; PlantUML activate',
      prompt: 'a sequence diagram with activation bars: a bar on each lifeline from the incoming call to its reply, self-calls as a looped arrow with a second bar offset to the right, and no bar on a participant that is idle',
      ex: dg(b => {
        [[40, 'Client'], [150, 'Orders'], [262, 'Stock']].forEach(([x, l]) => b.life(x, 20, 186, l));
        b.act(40, 48, 176, 'n'); b.act(150, 56, 166); b.act(154, 84, 100, 'd'); b.act(262, 116, 140);
        b.msg(44, 146, 56, { label: 'place()' });
        b.msg(154, 154, 78, { label: 'validate()' });
        b.msg(154, 258, 116, { label: 'reserve()' }); b.msg(258, 154, 140, { dash: true, label: 'ok' });
        b.msg(146, 44, 166, { dash: true, label: 'orderId' });
        b.hand(94, 112, 'busy until\nthe reply', { c: 'd' });
      }) },

    { id: 'fragments', name: 'Combined fragments', aka: 'alt, opt, loop, par, interaction operators, sequence frames',
      desc: 'Labeled frames drawn across lifelines that add control flow to a sequence: alt for if/else with a guard per section, opt for an optional part, loop for repetition and par for things that run at the same time. Dashed lines split the sections of an alt or par.',
      use: 'one scenario has a branch or repetition that matters, like a cache hit versus miss, or a retry loop',
      cost: 'nesting fragments three deep; past one level of nesting, split it into separate diagrams',
      ref: 'OMG UML 2.5 (CombinedFragment); Mermaid alt, opt, loop, par; PlantUML alt/else, group',
      prompt: 'a sequence diagram with combined fragments: alt frames for branches with a [guard] on each section separated by a dashed line, opt for optional steps, loop with its condition, par for parallel work; at most one level of nesting',
      ex: dg(b => {
        [[36, 'Client'], [150, 'API'], [230, 'Cache'], [288, 'DB']].forEach(([x, l]) => b.life(x, 20, 192, l));
        b.frag(72, 54, 238, 114, 'alt', 'd', { guard: 'hit', split: 102, guard2: 'miss' });
        b.act(150, 44, 182); b.act(230, 76, 92); b.act(230, 156, 162); b.act(288, 124, 140, 'c');
        b.msg(36, 146, 44, { label: 'GET /item' });
        b.msg(154, 226, 76, { label: 'get(key)' }); b.msg(226, 154, 92, { dash: true, label: 'item', c: 'g' });
        b.msg(154, 284, 124, { label: 'SELECT' }); b.msg(284, 154, 140, { dash: true, label: 'row' });
        b.msg(154, 226, 156, { label: 'set(key)' });
        b.msg(146, 36, 182, { dash: true, label: '200 item' });
      }) },

    { id: 'asyncmsg', name: 'Sync, async and reply arrows', aka: 'message types, synchronous call, asynchronous message, return message',
      desc: 'Sequence diagrams use three arrow styles. A solid line with a filled head is a synchronous call where the caller waits; a solid line with an open head is an asynchronous message where the caller carries on; a dashed line is the reply.',
      use: 'a flow mixes request/response calls with events or queue messages and the difference matters',
      cost: 'tools and people that draw every arrow the same; readers then assume everything blocks',
      ref: 'OMG UML 2.5 (MessageSort); Mermaid sequenceDiagram arrow types (->>, -), -->>); PlantUML ->, ->>, -->',
      prompt: 'a sequence diagram that distinguishes message types: solid line with filled arrowhead for a blocking call, solid line with open arrowhead for an async message or event, dashed line for a reply, and a small key explaining the three',
      ex: dg(b => {
        [[50, 'Checkout'], [160, 'Payments'], [270, 'Email']].forEach(([x, l]) => b.life(x, 20, 134, l));
        b.act(160, 54, 78); b.act(270, 104, 128, 'b');
        b.msg(50, 156, 54, { label: 'charge()' }); b.msg(156, 50, 78, { dash: true, label: 'receipt' });
        b.msg(50, 266, 104, { open: true, label: 'OrderPlaced', c: 'b' });
        b.zone(12, 146, 296, 40, '', 'n');
        b.msg(22, 52, 166); b.text(58, 166, 'sync call', { sm: true, a: 'start' });
        b.msg(116, 146, 166, { open: true, c: 'b' }); b.text(152, 166, 'async', { sm: true, a: 'start' });
        b.msg(236, 206, 166, { dash: true }); b.text(244, 166, 'reply', { sm: true, a: 'start' });
      }) },

    { id: 'seqnotes', name: 'Notes, actors and grouping boxes', aka: 'sequence notes, participant boxes, actor shapes',
      desc: 'Three small additions that make a sequence easier to read: stick-figure actors for humans, notes attached to one lifeline or spanning several, and colored boxes that group participants that belong together, such as everything inside the backend.',
      use: 'a sequence has a rule or timing that does not fit in a message label, or the reader needs to see which side of a boundary each participant is on',
      cost: 'notes that repeat the message labels; a note should say what the arrows cannot, like a timeout or an invariant',
      ref: 'OMG UML 2.5 (Comment, Actor); Mermaid note over and box; PlantUML note and box',
      prompt: 'a sequence diagram with a stick-figure actor for the human, a shaded labeled box grouping the backend participants, and notes over the lifelines for rules or timings that the message labels cannot carry',
      ex: dg(b => {
        b.zone(146, 8, 166, 184, 'backend', 'b');
        b.life(40, 28, 188, 'User', 'n', { actor: true });
        b.life(192, 36, 188, 'API', 'b'); b.life(272, 36, 188, 'DB', 'b');
        b.msg(40, 188, 74, { label: 'login(pw)' }); b.msg(196, 268, 94, { label: 'find user' }); b.msg(268, 196, 112, { dash: true, label: 'row' });
        b.note(52, 96, 80, 28, 'retries 3x,\nthen locks', 'c');
        b.note(174, 124, 118, 30, 'issues a JWT,\nvalid for 15 min', 'c');
        b.msg(188, 40, 174, { dash: true, label: 'token' });
      }) },

    { id: 'commdiagram', name: 'Communication diagram', aka: 'collaboration diagram, UML communication diagram',
      desc: 'The same information as a sequence diagram, arranged as a graph: objects are boxes placed freely, links are plain lines between them, and each message is a small arrow beside a link with a sequence number like 1, 1.1, 1.2. Time is in the numbers, not the layout.',
      use: 'the structure of who talks to whom matters more than the timing, or a sequence would be too wide',
      cost: 'readers have to follow the numbers to get the order; past about ten messages a sequence diagram is easier',
      ref: 'OMG UML 2.5 (CommunicationDiagram); Rumbaugh, Jacobson, Booch "The UML Reference Manual"; C4 dynamic diagram',
      prompt: 'a UML communication diagram: objects as boxes with underlined :Type names, plain lines for links, each message as a small arrow next to its link labeled with a nested sequence number and operation, e.g. 1.2: charge(), no more than 10 messages',
      ex: dg(b => {
        const c = tm_obj(b, 44, 104, ':Client'), o = tm_obj(b, 150, 104, ':Orders', 'a');
        const i = tm_obj(b, 262, 40, ':Stock'), p = tm_obj(b, 262, 168, ':Payment');
        b.link(c, o, { none: true }); b.link(o, i, { none: true }); b.link(o, p, { none: true });
        b.line([[84, 94], [108, 94]], { c: 'a' }); b.text(96, 82, '1: place()', { sm: true, mono: true });
        b.line([[188, 74], [210, 62]], { c: 'a' }); b.text(194, 52, '1.1: reserve()', { sm: true, mono: true, a: 'end' });
        b.line([[188, 134], [210, 146]], { c: 'a' }); b.text(194, 156, '1.2: charge()', { sm: true, mono: true, a: 'end' });
        b.line([[230, 70], [208, 82]], { c: 'b', dash: true }); b.text(232, 88, '1.1.1: ok', { sm: true, mono: true, a: 'start' });
      }) },

    { id: 'seqerror', name: 'Happy path beside failure path', aka: 'failure sequence, unhappy path, error flow',
      desc: 'Two short sequences of the same interaction drawn side by side: what happens when everything works, and what happens when one step times out or fails. The failure side shows the timeout, the retry and how the system recovers or gives up.',
      use: 'you are explaining an incident, reviewing resilience, or the failure handling is the actual design decision',
      cost: 'drawing only the happy path; most outages live in the failure path nobody drew',
      ref: 'Michael Nygard "Release It!"; Google SRE book (postmortems); Stripe idempotency keys documentation',
      prompt: 'a pair of sequence diagrams side by side for the same interaction: left the happy path in green, right the failure path in red showing the timeout, the retry with the same idempotency key and the final outcome, with matching participants and order',
      ex: dg(b => {
        b.zone(8, 8, 148, 184, 'happy path', 'g'); b.zone(164, 8, 148, 184, 'timeout', 'r');
        b.life(44, 34, 184, 'App'); b.life(120, 34, 184, 'Pay');
        b.life(200, 34, 184, 'App'); b.life(276, 34, 184, 'Pay');
        b.msg(44, 116, 72, { label: 'charge' }); b.msg(116, 44, 94, { dash: true, label: 'ok', c: 'g' });
        b.ok(82, 130, 7);
        b.msg(200, 272, 72, { label: 'charge' }); b.x(276, 92, 5);
        b.msg(200, 200, 100, { label: 'timeout', c: 'r' });
        b.msg(200, 272, 138, { label: 'retry(key)' }); b.msg(272, 200, 160, { dash: true, label: 'ok', c: 'g' });
      }) }
  ]
});

pool.groups.push({
  id: 'statetime', title: 'State & time', slot: 'State and time',
  intro: 'Diagrams for things that change: the states one object moves through, signals changing over milliseconds, and events and plans laid out along a calendar. Pick by the question: what can happen next, how long did it take, or what comes after what.',
  terms: [
    { id: 'statemachine', name: 'State machine diagram', aka: 'state diagram, state transition diagram, finite state machine, FSM',
      desc: 'The states one thing can be in, drawn as rounded boxes, and the transitions between them as arrows labeled event [guard] / action. A filled dot marks the start and a bullseye the end. Anything not drawn is not allowed.',
      use: 'an order, ticket, account or device has a lifecycle with rules about what can happen next',
      cost: 'mixing states and steps; a state is something the object is in for a while, like Paid, not an action like Pay',
      ref: 'David Harel (1987); OMG UML 2.5 state machines; XState; Mermaid stateDiagram-v2',
      prompt: 'a state machine diagram: states as rounded boxes named as adjectives or past participles, a filled dot for the initial state, a bullseye for final states, each transition arrow labeled event [guard] / action, and no transitions that the code does not allow',
      ex: dg(b => {
        const i = tm_init(b, 18, 46);
        const dr = b.box(74, 46, 'Draft', 'n', { r: 10 }), pl = b.box(176, 46, 'Placed', 'a', { r: 10 }), pd = b.box(272, 46, 'Paid', 'a', { r: 10 });
        const sh = b.box(272, 132, 'Shipped', 'g', { r: 10 }), ca = b.box(176, 132, 'Cancelled', 'r', { r: 10 });
        const f = tm_final(b, 224, 180);
        b.link(i, dr); b.link(dr, pl, { label: 'submit' }); b.link(pl, pd, { label: 'pay' });
        b.link(pd, sh, { label: 'ship / notify' }); b.link(pl, ca, { label: 'cancel' });
        b.link(sh, f); b.link(ca, f);
        b.line([[166, 32], [166, 18], [186, 18], [186, 32]]); b.text(196, 18, 'edit', { sm: true, mono: true, a: 'start' });
      }) },

    { id: 'statechart', name: 'Hierarchical statechart', aka: 'Harel statechart, nested state machine, composite states, orthogonal regions',
      desc: 'A state machine with depth and concurrency: states nest inside a parent state, so one arrow from the parent covers all its children, and a parent can split into regions that run at the same time. It keeps big machines from exploding into hundreds of arrows.',
      use: 'a flat state machine has the same transition copied onto many states, or two independent aspects multiply the states',
      cost: 'deep nesting that only the author can follow; two levels and two regions is usually the limit for a picture',
      ref: 'David Harel "Statecharts: A Visual Formalism for Complex Systems" (1987); XState and Stately; SCXML (W3C)',
      prompt: 'a hierarchical statechart: a composite state as a large rounded box with its name at top left, child states inside with their own initial dot, orthogonal regions separated by a dashed line, and transitions from the composite border that apply to every child',
      ex: dg(b => {
        const off = b.box(42, 100, 'Off', 'n', { r: 12, h: 34 });
        b.raw(`<g class="c-a"><rect class="nd" style="fill:none" x="104" y="14" width="206" height="174" rx="12"/><text x="116" y="27" class="b" style="fill:var(--c)">On</text></g>`);
        b.line([[66, 90], [102, 90]]); b.line([[102, 110], [66, 110]]); b.text(84, 100, 'power', { sm: true, mono: true });
        b.raw(`<g class="c-a"><path class="ln k dash" style="stroke-width:1" d="M104 104 H310"/></g>`);
        const i1 = tm_init(b, 120, 62, 4.5), id = b.box(160, 62, 'Idle', 'a', { r: 10 }), pl = b.box(270, 62, 'Playing', 'a', { r: 10 });
        b.link(i1, id); b.link(id, pl, { label: 'play', bend: -7 }); b.link(pl, id, { label: 'stop', bend: -7 });
        const i2 = tm_init(b, 120, 148, 4.5), so = b.box(160, 148, 'Sound', 'b', { r: 10 }), mu = b.box(270, 148, 'Muted', 'b', { r: 10 });
        b.link(i2, so); b.link(so, mu, { label: 'mute', bend: -7 }); b.link(mu, so, { label: 'unmute', bend: -7 });
        b.text(302, 96, 'playback', { sm: true, mut: true, a: 'end' }); b.text(302, 180, 'volume', { sm: true, mut: true, a: 'end' });
      }) },

    { id: 'timingdiagram', name: 'Timing diagram', aka: 'UML timing diagram, waveform diagram, signal timing chart',
      desc: 'Each participant gets a horizontal row, and a stepped line shows which state it is in along a shared time axis. Arrows between rows show the messages that cause the changes, and brackets mark duration constraints.',
      use: 'exact durations matter: timeouts, latency budgets, debounce windows, hardware signals or protocol handshakes',
      cost: 'using it when only the order matters; a sequence diagram is easier to read if nobody cares about the milliseconds',
      ref: 'OMG UML 2.5 (TimingDiagram); WaveDrom; PlantUML timing diagrams; logic analyzer traces',
      prompt: 'a timing diagram: one row per participant with its name on the left and its states listed as levels, a stepped line showing the state over a shared time axis in milliseconds at the bottom, arrows between rows for causing messages, and a {≤ n ms} bracket for constraints',
      ex: dg(b => {
        rect(b, 8, 30, 300, 56, 'n', { r: 3 }); rect(b, 8, 98, 300, 56, 'n', { r: 3 });
        path(b, 'M60 30 V86 M60 98 V154', 'n');
        b.text(34, 58, 'Client', { sm: true, b: true }); b.text(34, 126, 'Server', { sm: true, b: true });
        [['wait', 44], ['idle', 72], ['busy', 112], ['idle', 140]].forEach(([l, y]) => b.text(66, y, l, { sm: true, mono: true, a: 'start' }));
        b.raw(`<g class="c-a"><path class="ln k" style="stroke-width:2" d="M100 72 H120 V44 H240 V72 H300"/></g><g class="c-b"><path class="ln k" style="stroke-width:2" d="M100 140 H140 V112 H220 V140 H300"/></g>`);
        b.line([[122, 76], [138, 108]]); b.line([[222, 108], [238, 76]], { dash: true });
        path(b, 'M120 26 V20 H240 V26', 'c'); b.text(180, 12, '{wait ≤ 80 ms}', { sm: true, mono: true, c: 'c' });
        path(b, 'M100 166 H300', 'n');
        [0, 20, 40, 60, 80, 100].forEach(t => { path(b, `M${100 + t * 2} 163 V169`, 'n'); b.text(100 + t * 2, 179, String(t), { sm: true, mono: true }); });
        b.text(72, 179, 'ms', { sm: true, mono: true, mut: true });
      }) },

    { id: 'timeline', name: 'Timeline', aka: 'chronology, incident timeline, event timeline',
      desc: 'Events placed in order along one time axis, each with a timestamp and a short label. Shading a span shows how long something lasted, such as the customer impact during an incident.',
      use: 'you are writing up an incident, a project history or a roadmap where the gaps between events matter',
      cost: 'spacing events evenly when the gaps are uneven; if 14:05 to 14:11 was the slow part, the drawing should show it',
      ref: 'Google SRE workbook postmortem template; PagerDuty incident timelines; Mermaid timeline; Edward Tufte on time series',
      prompt: 'a horizontal timeline: one axis left to right with events as dots placed to scale, each with a timestamp and a short label alternating above and below, the impact window shaded, and the key gap called out',
      ex: dg(b => {
        rect(b, 92, 84, 198, 14, 'r', { solid: true, op: .18, r: 2 });
        b.text(226, 91, 'impact 26 min', { sm: true, b: true, c: 'r' });
        b.line([[14, 104], [306, 104]]);
        [[30, '14:02', 'deploy v41', 'n', 1], [92, '14:05', 'errors spike', 'r', -1], [160, '14:11', 'on-call paged', 'n', 1], [228, '14:20', 'rollback', 'n', -1], [290, '14:31', 'recovered', 'g', 1]].forEach(([x, t, l, c, up]) => {
          b.dot(x, 104, c, 4.5);
          path(b, up > 0 ? `M${x} 98 V78` : `M${x} 110 V124`, 'n', 'ln');
          b.text(x, up > 0 ? 58 : 134, t, { sm: true, mono: true, b: true }); b.text(x, up > 0 ? 70 : 146, l, { sm: true });
        });
        b.hand(126, 178, 'why 6 min to page?');
      }) },

    { id: 'gantt', name: 'Gantt chart', aka: 'project timeline, schedule bar chart',
      desc: 'Tasks as rows and time as columns, with a bar per task from its start to its end. Arrows link tasks that depend on each other, diamonds mark milestones, and a line marks today.',
      use: 'you are planning work with dependencies and dates, or showing a stakeholder what ships when',
      cost: 'false precision; bars to the day on a six-month plan look certain and are not, so use weeks and show uncertainty',
      ref: 'Henry Gantt (1910s); Microsoft Project; Mermaid gantt; GitHub Projects roadmap view',
      prompt: 'a Gantt chart: tasks as rows listed in start order, weeks as columns, one bar per task, dependency arrows from the end of one bar to the start of the next, milestones as diamonds, and a dashed today line',
      ex: dg(b => {
        const X = w => 76 + w * 38;
        ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'].forEach((l, i) => { b.text(X(i + .5), 20, l, { sm: true, mono: true, mut: true }); b.raw(`<g class="c-n"><path class="ln dash" style="opacity:.35" d="M${X(i)} 30 V164"/></g>`); });
        [['Design', 46], ['API', 72], ['Web UI', 98], ['QA', 124], ['Launch', 150]].forEach(([l, y]) => b.text(12, y, l, { sm: true, b: true, a: 'start' }));
        [[0, 1.5, 46, 'a'], [1.5, 3.5, 72, 'a'], [2, 4.5, 98, 'a'], [4.5, 5.5, 124, 'b']].forEach(([s, e, y, c]) => rect(b, X(s), y - 7, X(e) - X(s), 14, c));
        b.line([[X(1.5), 46], [X(1.5) + 8, 46], [X(1.5) + 8, 63]]);
        b.line([[X(4.5), 98], [X(4.5) + 8, 98], [X(4.5) + 8, 115]]);
        b.raw(`<g class="c-n"><polygon class="solid" style="fill:var(--d-line)" points="${X(5.5)},142 ${X(5.5) + 8},150 ${X(5.5)},158 ${X(5.5) - 8},150"/></g>`);
        b.raw(`<g class="c-r"><path class="ln k dash" d="M${X(3.2)} 30 V168"/></g>`);
        b.tag(X(3.2), 178, 'today', 'r');
      }) },

    { id: 'lifecycle', name: 'Lifecycle loop', aka: 'cycle diagram, loop diagram, continuous cycle',
      desc: 'A handful of stages placed around a ring with arrows from each to the next, ending back at the start. It says that the process repeats and that the last stage feeds the first.',
      use: 'the point is that something repeats: a release cycle, a feedback loop, a customer lifecycle',
      cost: 'drawing a loop for a process that does not actually repeat, or hiding the exits; if things leave the loop, draw where',
      ref: 'Deming PDCA cycle; the DevOps infinity loop; Lean Startup build-measure-learn',
      prompt: 'a lifecycle loop: 4 to 6 stages as labeled pills spaced evenly around a ring, curved arrows clockwise from each stage to the next, the arrow back to the first stage highlighted and labeled with what feeds back',
      ex: dg(b => {
        const st = [['Plan', -90], ['Build', -18], ['Test', 54], ['Release', 126], ['Monitor', 198]].map(([l, a]) => {
          const t = a * Math.PI / 180; return b.pill(r1(160 + 110 * Math.cos(t)), r1(100 + 68 * Math.sin(t)), l, 'a');
        });
        st.forEach((n, i) => { if (i < 4) b.link(n, st[i + 1], { bend: -9 }); });
        b.link(st[4], st[0], { bend: -14, c: 'b', label: 'learn' });
        b.text(160, 96, 'one turn', { sm: true, mut: true }); b.text(160, 108, 'per release', { sm: true, mut: true });
      }) }
  ]
});
/* Process & flow: flowcharts, swimlanes, BPMN, data flow, journeys and pipelines */

// local helpers (prefix fl_)
const fl_smooth = pts => { // a smooth path through points (Catmull-Rom as cubic Beziers)
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += ` C${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)} ${r1(p2[1] - (p3[1] - p1[1]) / 6)} ${p2[0]} ${p2[1]}`;
  }
  return d;
};
const fl_chev = (b, x, w, y, h, label, c, o = {}) => { // a pipeline stage chevron, x left edge
  const t = 10, m = y + h / 2, p = [[x, y], [x + w - t, y], [x + w, m], [x + w - t, y + h], [x, y + h], o.first ? [x, m] : [x + t, m]];
  b.raw(`<g class="c-${c}"><polygon class="nd${o.dash ? ' dash' : ''}" points="${p.map(q => q.join(',')).join(' ')}"/><text x="${x + w / 2 + (o.first ? -2 : 3)}" y="${m}" text-anchor="middle" class="b">${xe(label)}</text></g>`);
};
const fl_es = (b, x, y, w, h, txt, kind) => { // an EventStorming sticky: kind ev (orange, solid), cmd (blue), agg (pale), pol (lilac), hot (pink)
  const c = { ev: 'c', cmd: 'a', agg: 'c', pol: 'd', hot: 'r' }[kind], solid = kind === 'ev';
  let s = `<g class="c-${c}"><rect class="${solid ? 'solid' : 'nd'}" x="${x}" y="${y}" width="${w}" height="${h}" rx="2"${solid ? ' opacity=".9"' : ''}/>`;
  const ls = String(txt).split('\n'), y0 = y + h / 2 - (ls.length - 1) * 5.5;
  ls.forEach((l, i) => { s += `<text x="${x + w / 2}" y="${r1(y0 + i * 11)}" text-anchor="middle" class="sm b"${solid ? ' style="fill:var(--panel)"' : ''}>${xe(l)}</text>`; });
  b.raw(s + '</g>');
  return { x: x + w / 2, y: y + h / 2, w, h, s: 'r' };
};

pool.groups.push({
  id: 'flowcharts', title: 'Flowcharts & processes', slot: 'Flow',
  intro: 'How work moves through steps, choices and people. Start with a plain flowchart; add lanes when handoffs matter, and reach for BPMN or UML when the process will be automated or audited.',
  terms: [
    { id: 'flowchart', name: 'Flowchart', aka: 'process flow, flow diagram, process map',
      desc: 'Boxes for steps, diamonds for yes or no decisions, and arrows for the order they happen in. Rounded pills mark where the process starts and ends, so a reader can trace every path from one to the other.',
      use: 'you need to explain a procedure with a few decisions in it, for a runbook, a support script or a code review',
      cost: 'flowcharts sprawl past a screen fast; once there are many actors or loops, split it into lanes or sub-processes',
      ref: 'ISO 5807 flowchart symbols, Frank and Lillian Gilbreth\'s flow process chart (1921), Mermaid flowchart syntax',
      prompt: 'a flowchart read top to bottom or left to right, with rounded pills for start and end, rectangles for steps written as verb phrases, diamonds for yes or no questions with both exits labeled, and no more than about 12 shapes',
      ex: dg(b => {
        const s = b.pill(34, 66, 'Start', 'g', { w: 46 });
        const c = b.box(104, 66, 'Check\nstock', 'a', { w: 64 });
        const d = b.diamond(190, 66, 'In stock?', 'c', { w: 74, h: 46 });
        const sh = b.box(278, 66, 'Ship', 'a', { w: 54 });
        const bo = b.box(190, 150, 'Back-order', 'a', { w: 82 });
        const e = b.pill(278, 150, 'End', 'g', { w: 48 });
        b.link(s, c); b.link(c, d); b.link(d, sh); b.link(d, bo); b.link(sh, e); b.link(bo, e);
        b.text(238, 56, 'yes', { sm: true, mono: true }); b.text(178, 104, 'no', { sm: true, mono: true });
      }) },

    { id: 'decisiontree', name: 'Decision tree', aka: 'decision diagram, question tree, classification tree',
      desc: 'A tree that starts with one question and splits on each answer until every branch ends in an outcome. Read from the root down, each path is one rule, so the whole tree is a complete set of if-then rules you can check by eye.',
      use: 'a choice depends on a few questions asked in order, such as triage rules, eligibility checks or a what-should-I-use guide',
      cost: 'trees grow exponentially; past three or four levels, or when the same subtree repeats, switch to a decision table',
      ref: 'Howard Raiffa "Decision Analysis" (1968), scikit-learn plot_tree, the "which chart should I use" guides',
      prompt: 'a decision tree drawn top down, with each question in a box, each branch labeled with its answer, and every leaf a colored outcome pill; keep it to three levels and make sure every path ends in a leaf',
      ex: dg(b => {
        const r = b.box(160, 30, 'Over $50k?', 'n');
        const l = b.box(82, 94, 'On roadmap?', 'n'), rr = b.box(238, 94, 'Has sponsor?', 'n');
        const leaves = [[40, 'Build', 'g'], [122, 'Park', 'n'], [198, 'Pitch', 'a'], [280, 'Drop', 'r']].map(([x, t, c]) => b.pill(x, 160, t, c, { w: 52 }));
        b.link(r, l, { label: 'no' }); b.link(r, rr, { label: 'yes' });
        b.link(l, leaves[0], { label: 'yes' }); b.link(l, leaves[1], { label: 'no' });
        b.link(rr, leaves[2], { label: 'yes' }); b.link(rr, leaves[3], { label: 'no' });
      }) },

    { id: 'swimlane', name: 'Swimlane diagram', aka: 'cross-functional flowchart, Rummler-Brache diagram, lane diagram',
      desc: 'A flowchart split into horizontal or vertical lanes, one per role, team or system. Each step sits in the lane of whoever does it, so every arrow that crosses a lane line is a handoff, and handoffs are where work waits and gets lost.',
      use: 'a process passes between several people or teams and you want to show who does what and where the handoffs are',
      cost: 'too many lanes, or lanes for things that are not actors; keep to three to five, and give each lane a role, not a person\'s name',
      ref: 'Geary Rummler and Alan Brache "Improving Performance" (1990), BPMN pools and lanes, Lucidchart and draw.io swimlane shapes',
      prompt: 'a swimlane diagram with one horizontal lane per role, lane names in a header strip on the left, steps as boxes in the lane of whoever does them, decisions as diamonds, time flowing left to right, and every lane-crossing arrow treated as a handoff',
      ex: dg(b => {
        b.lane(10, 14, 300, 56, 'Customer', 'a');
        b.lane(10, 70, 300, 60, 'Support', 'b');
        b.lane(10, 130, 300, 56, 'Engineer', 'd');
        const rep = b.pill(74, 42, 'Report', 'a', { w: 62 });
        const tri = b.box(74, 100, 'Triage', 'b', { w: 60, h: 26 });
        const bug = b.diamond(146, 100, 'Bug?', 'c', { w: 54, h: 36 });
        const ans = b.box(146, 42, 'Answer', 'a', { w: 60, h: 26 });
        const fix = b.box(146, 158, 'Fix + test', 'd', { w: 72, h: 26 });
        const dep = b.box(226, 158, 'Release', 'd', { w: 62, h: 26 });
        const upd = b.box(226, 100, 'Update', 'b', { w: 62, h: 26 });
        const done = b.pill(284, 42, 'Closed', 'g', { w: 50 });
        b.link(rep, tri); b.link(tri, bug); b.link(bug, ans); b.link(bug, fix); b.link(fix, dep); b.link(dep, upd);
        b.line([[176, 42], [257, 42]]);
        b.line([[257, 100], [284, 100], [284, 56]]);
        b.text(156, 72, 'no', { sm: true, mono: true, a: 'start' }); b.text(156, 128, 'yes', { sm: true, mono: true, a: 'start' });
        [[74, 70], [146, 70], [146, 130], [226, 130], [284, 70]].forEach(([x, y]) => b.dot(x, y, 'r', 3));
        b.hand(268, 178, '5 handoffs', { size: 14 });
      }) },

    { id: 'activity', name: 'UML activity diagram', aka: 'activity diagram, UML activity',
      desc: 'UML\'s flowchart. A filled dot starts the flow, rounded actions follow, and a thick bar forks the flow into steps that run in parallel and joins them again. A bullseye ends it.',
      use: 'you need to show concurrency in a workflow, such as steps that run at the same time and must all finish before the next one',
      cost: 'a join waits for every incoming branch; people often draw a join where they mean either path, which needs a merge diamond instead',
      ref: 'OMG UML 2.5 specification, Martin Fowler "UML Distilled", PlantUML activity diagrams',
      prompt: 'a UML activity diagram flowing left to right, starting at a filled dot and ending at a bullseye, with rounded action boxes, a thick fork bar where steps run in parallel and a matching join bar where they all must finish',
      ex: dg(b => {
        const st = b.dot(20, 100, 'n', 7);
        const rc = b.box(68, 100, 'Receive\norder', 'a', { w: 64, r: 10 });
        rect(b, 112, 46, 5, 108, 'n', { solid: true, r: 1.5 }); rect(b, 216, 46, 5, 108, 'n', { solid: true, r: 1.5 });
        const ch = b.box(166, 64, 'Charge card', 'a', { w: 80, r: 10, h: 28 });
        const pk = b.box(166, 136, 'Pack items', 'a', { w: 80, r: 10, h: 28 });
        const sh = b.box(256, 100, 'Ship', 'a', { w: 46, r: 10 });
        b.link(st, rc); b.line([[101, 100], [111, 100]]);
        b.line([[117, 64], [125, 64]]); b.line([[117, 136], [125, 136]]);
        b.line([[207, 64], [215, 64]]); b.line([[207, 136], [215, 136]]);
        b.line([[221, 100], [232, 100]]);
        b.circle(298, 100, 8, '', 'n'); b.dot(298, 100, 'n', 4.5);
        b.line([[279, 100], [288, 100]]);
        b.text(114, 166, 'fork', { sm: true, mut: true }); b.text(218, 166, 'join', { sm: true, mut: true });
      }) },

    { id: 'bpmn', name: 'BPMN process diagram', aka: 'BPMN 2.0, business process model and notation, process model',
      desc: 'A standard notation for business processes. Circles are events (thin to start, thick to end), rounded boxes are tasks, and diamonds are gateways: an X picks one path, a plus runs all paths. Pools hold one organization and lanes split it by role.',
      use: 'a process will be automated in a workflow engine, audited, or shared between business and engineering who need the same exact meaning',
      cost: 'the full notation has over a hundred symbols; most readers know about ten, so stick to events, tasks, gateways, lanes and sequence flows',
      ref: 'OMG BPMN 2.0 (ISO/IEC 19510), Camunda Modeler and bpmn.io, Bruce Silver "BPMN Method and Style"',
      prompt: 'a BPMN 2.0 process inside one pool with a lane per role, a thin-circle start event, rounded tasks named verb plus noun, an exclusive gateway (diamond with X) with labeled outgoing flows, and a thick-circle end event on every path',
      ex: dg(b => {
        b.lane(10, 20, 300, 160, 'Shop', 'n', { hw: 18 });
        b.lane(28, 20, 282, 80, 'Sales', 'n', { hw: 18 });
        b.lane(28, 100, 282, 80, 'Warehouse', 'n', { hw: 18 });
        const s = b.circle(64, 60, 9, '', 'g');
        const t1 = b.box(118, 60, 'Check\norder', 'a', { w: 64, h: 40, r: 7 });
        const g = b.diamond(184, 60, '', 'c', { w: 30, h: 30 });
        path(b, 'M178 54 L190 66 M190 54 L178 66', 'c');
        const t2 = b.box(242, 60, 'Refuse', 'a', { w: 54, h: 28, r: 7 });
        const t3 = b.box(184, 140, 'Pick &\npack', 'a', { w: 58, h: 40, r: 7 });
        const t4 = b.box(254, 140, 'Ship', 'a', { w: 50, h: 28, r: 7 });
        b.raw('<g class="c-r"><circle class="nd" style="stroke-width:3" cx="294" cy="60" r="8"/><circle class="nd" style="stroke-width:3" cx="294" cy="140" r="8"/></g>');
        b.link(s, t1); b.link(t1, g); b.link(g, t2); b.link(g, t3); b.link(t3, t4);
        b.line([[269, 60], [284, 60]]); b.line([[279, 140], [284, 140]]);
        b.text(207, 49, 'no', { sm: true, mono: true }); b.text(194, 100, 'ok', { sm: true, mono: true, a: 'start' });
      }) },

    { id: 'dataflow', name: 'Data flow diagram', aka: 'DFD, data flow, Gane-Sarson diagram, Yourdon-DeMarco diagram',
      desc: 'Shows where data comes from, which processes transform it, where it is stored and where it goes. External entities are squares, processes are circles, data stores are open-ended boxes, and every arrow is named after the data it carries. It shows no timing or order.',
      use: 'you are reviewing privacy, security or compliance and need to know every place personal data travels and rests',
      cost: 'drawing control flow by mistake (arrows that mean then instead of data); every arrow should be a noun, and data never flows straight from store to store',
      ref: 'Tom DeMarco "Structured Analysis and System Specification" (1978), Gane and Sarson (1979), OWASP Threat Dragon and Microsoft Threat Modeling Tool',
      prompt: 'a data flow diagram with external entities as squares, numbered processes as circles, data stores as open-ended rectangles with an id, and every arrow labeled with the data it carries as a noun; no control flow, timing or decisions',
      ex: dg(b => {
        const cu = b.box(38, 60, 'Customer', 'n', { w: 58, h: 40, r: 0 });
        const p1 = b.circle(142, 60, 28, 'Take\norder', 'a', { ly: 64 });
        b.text(142, 42, '1', { sm: true, mono: true });
        const p2 = b.circle(250, 60, 28, 'Charge', 'a', { ly: 64 });
        b.text(250, 42, '2', { sm: true, mono: true });
        const bk = b.box(250, 160, 'Bank', 'n', { w: 56, h: 36, r: 0 });
        b.raw('<g class="c-c"><rect class="nd" style="stroke:none" x="98" y="146" width="88" height="28"/><path class="ln k" d="M186 146 H98 V174 H186 M120 146 V174"/><text x="109" y="160" text-anchor="middle" class="sm mono">D1</text><text x="153" y="160" text-anchor="middle" class="b">Orders</text></g>');
        const st = { x: 142, y: 160, w: 88, h: 28, s: 'r' };
        b.link(cu, p1, { label: 'order' }); b.link(p1, st, { label: 'order' }); b.link(st, p2, { label: 'total' });
        b.link(p2, bk, { label: 'payment' });
      }) }
  ]
});

pool.groups.push({
  id: 'journeys', title: 'Journeys & pipelines', slot: 'Journey map',
  intro: 'Processes seen end to end over time: what a customer goes through, what the organization does behind the scenes to make it happen, and how work moves through stages until it ships.',
  terms: [
    { id: 'journeymap', name: 'Customer journey map', aka: 'user journey map, experience map, journey map',
      desc: 'A row of stages a customer goes through, with what they do, think and feel at each one. An emotion curve runs underneath, and the low points are where the team should look first.',
      use: 'you want a team to see a product from the customer\'s side, across channels and teams, and agree on which moments hurt',
      cost: 'maps made from guesses; base each stage on research with real customers, and draw one map per persona and scenario',
      ref: 'Nielsen Norman Group journey mapping guides, Jim Kalbach "Mapping Experiences", Adaptive Path\'s Rail Europe experience map',
      prompt: 'a customer journey map with 4 to 6 stage columns left to right, rows for what the customer does and their touchpoint, and an emotion curve underneath with a dashed neutral line; mark low points as pain points with a one-line note',
      ex: dg(b => {
        const xs = [74, 140, 206, 272], st = ['Discover', 'Sign up', 'Use', 'Renew'], dn = ['sees ad', '9-field form', 'daily use', 'gets bill'];
        [107, 173, 239].forEach(x => b.raw(`<g class="c-n"><path class="ln k dash" style="stroke-width:.8" d="M${x} 14 V190"/></g>`));
        xs.forEach((x, i) => { b.box(x, 24, st[i], 'a', { w: 60, h: 20 }); b.text(x, 52, dn[i], { sm: true }); });
        b.text(12, 52, 'does', { sm: true, b: true, a: 'start' }); b.text(12, 120, 'feels', { sm: true, b: true, a: 'start' });
        b.raw('<g class="c-n"><path class="ln k dash" style="stroke-width:.8" d="M42 120 H308"/></g>');
        const pts = [[74, 92], [140, 156], [206, 88], [272, 136]];
        b.raw(`<g class="c-a"><path class="ln k" style="stroke-width:2.2" d="${fl_smooth(pts)}"/></g>`);
        pts.forEach(([x, y]) => b.dot(x, y, y < 120 ? 'g' : 'r', 4.5));
        b.text(30, 86, '+', { b: true, c: 'g' }); b.text(30, 154, '−', { b: true, c: 'r' });
        b.hand(140, 178, 'drop-off here', { size: 14 });
      }) },

    { id: 'serviceblueprint', name: 'Service blueprint', aka: 'blueprint, service map',
      desc: 'A journey map that also shows the organization behind it. Rows run from customer actions, through frontstage staff and screens, to backstage work and support systems, split by the line of interaction, the line of visibility and the line of internal interaction.',
      use: 'a service involves many teams and systems behind the scenes and you need to see which backstage step causes a frontstage problem',
      cost: 'blueprints get huge; draw one for a single scenario, and keep each cell a short verb phrase',
      ref: 'G. Lynn Shostack "Designing Services That Deliver" (HBR, 1984), Mary Jo Bitner\'s service blueprinting work, Nielsen Norman Group',
      prompt: 'a service blueprint with columns for each step left to right and rows for customer actions, frontstage, backstage and support systems, separated by labeled lines of interaction, visibility and internal interaction, with vertical arrows where a row triggers the one below',
      ex: dg(b => {
        const xs = [106, 184, 262], rows = [38, 84, 130, 174];
        [['Customer', 'a'], ['Frontstage', 'b'], ['Backstage', 'n'], ['Support', 'n']].forEach(([l, c], i) => b.text(10, rows[i], l, { sm: true, b: true, a: 'start', c: c === 'n' ? null : c }));
        const cells = [['Books', 'Arrives', 'Pays'], ['Web form', 'Greeter', 'Checkout'], ['Confirm', 'Prep room', 'Invoice']];
        const cs = ['a', 'b', 'n'];
        const nodes = cells.map((row, r) => row.map((t, i) => b.box(xs[i], rows[r], t, cs[r], { w: 64, h: 26 })));
        const sup = [b.box(xs[0], rows[3], 'Calendar', 'n', { w: 64, h: 24, dash: true, bold: false }), b.box(xs[2], rows[3], 'Payments', 'n', { w: 64, h: 24, dash: true, bold: false })];
        b.link(nodes[0][0], nodes[0][1]); b.link(nodes[0][1], nodes[0][2]);
        [0, 1, 2].forEach(i => { b.link(nodes[0][i], nodes[1][i]); b.link(nodes[1][i], nodes[2][i]); });
        b.link(nodes[2][0], sup[0]); b.link(nodes[2][2], sup[1]);
        [[61, 'interaction', 'n', ''], [107, 'visibility', 'r', ''], [152, 'internal', 'n', '']].forEach(([y, l, c]) => {
          b.raw(`<g class="c-${c}"><path class="ln k dash" style="stroke-width:${c === 'r' ? 1.8 : 1}" d="M10 ${y} H310"/><rect class="lbg" x="196" y="${y - 6.5}" width="58" height="13" rx="3"/><text x="225" y="${y}" text-anchor="middle" class="sm mono" style="fill:var(--c)">${l}</text></g>`);
        });
      }) },

    { id: 'valuestream', name: 'Value stream map', aka: 'VSM, material and information flow diagram',
      desc: 'A lean diagram of every step a piece of work goes through from request to delivery, with the time each step actually takes and how long work sits waiting between steps. A timeline ladder along the bottom adds them up, and the wait usually dwarfs the work.',
      use: 'delivery feels slow and you need to show where the time really goes, in a factory or in a software delivery process',
      cost: 'mapping the official process; walk a real piece of work through and time it, and keep the first map to one value stream',
      ref: 'Mike Rother and John Shook "Learning to See" (1999), Toyota\'s material and information flow charts, Karen Martin and Mike Osterling "Value Stream Mapping"',
      prompt: 'a value stream map with process boxes left to right, a data box under each with process time, inventory triangles between steps, and a timeline ladder along the bottom showing wait time on the high steps and work time on the low steps, totaled at the end',
      ex: dg(b => {
        const xs = [52, 128, 204, 280], ps = ['Code', 'Review', 'Test', 'Deploy'], ct = ['2h', '1h', '4h', '15m'], wt = ['3d', '2d', '1d'];
        xs.forEach((x, i) => {
          b.box(x, 44, ps[i], 'a', { w: 52, h: 28, r: 2 });
          rect(b, x - 26, 64, 52, 22, 'n', { r: 1 });
          b.text(x, 75, 'CT ' + ct[i], { sm: true, mono: true });
          b.raw(`<g class="c-n"><path class="ln" d="M${i ? xs[i - 1] + 26 : 12} 172 H${x - 26} M${x - 26} 172 V188 H${x + 26} V172${i === 3 ? ' H308' : ''}"/></g>`);
          b.text(x, 180, ct[i], { sm: true, mono: true });
        });
        [90, 166, 242].forEach((x, i) => {
          b.raw(`<g class="c-c"><polygon class="nd" points="${x},30 ${x + 9},46 ${x - 9},46"/><text x="${x}" y="40.5" text-anchor="middle" class="sm b" style="font-size:8px">I</text></g>`);
          b.text(x, 160, wt[i], { sm: true, mono: true, c: 'r', b: true });
        });
        b.raw('<g class="c-n"><path class="ln" d="M12 172 V172"/></g>');
        b.hand(160, 124, 'work 7h, waiting 6 days', { size: 15 });
      }) },

    { id: 'storymap', name: 'User story map', aka: 'story map, story mapping, backbone and walking skeleton',
      desc: 'User activities run left to right across the top as a backbone, in the order a user does them. The stories that make up each activity hang underneath, most important first, and horizontal lines slice them into releases.',
      use: 'you are planning a product or a large feature and want a first release that covers the whole journey thinly instead of one part in full',
      cost: 'treating it as a flat backlog; the left-to-right order is the user\'s journey, and each release line should cut across every column',
      ref: 'Jeff Patton "User Story Mapping" (2014), story map boards in Miro and FigJam',
      prompt: 'a user story map with user activities as a backbone across the top in journey order, user tasks under each, story cards hanging beneath in priority order, and dashed horizontal release lines labeled MVP and Release 2 that cut across every column',
      ex: dg(b => {
        const cols = [60, 160, 260], acts = ['Find', 'Buy', 'Get it'];
        const tasks = [['search', 'browse'], ['cart', 'pay'], ['track', 'return']];
        const st = [[['name', 'list'], ['filters', 'photos']], [['add', 'card'], ['coupons', 'wallet']], [['email', 'label'], ['map', 'refund']]];
        cols.forEach((x, i) => {
          b.box(x, 22, acts[i], 'a', { w: 94, h: 20 });
          tasks[i].forEach((t, j) => b.box(x - 24 + j * 48, 50, t, 'n', { w: 44, h: 20, bold: false }));
          st[i].forEach((row, r) => row.forEach((t, j) => b.note(x - 46 + j * 48, r ? 132 : 70, 44, 22, t, 'c')));
          b.note(x - 46, 98, 44, 22, '', 'c');
        });
        b.note(212, 160, 44, 22, '', 'c'); b.note(62, 160, 44, 22, '', 'c');
        b.line([[10, 125], [310, 125]], { none: true, dash: true, c: 'r', label: 'MVP' });
        b.line([[10, 188], [310, 188]], { none: true, dash: true, c: 'n' });
        b.text(10, 182, 'release 2', { sm: true, mut: true, a: 'start' });
      }) },

    { id: 'pipeline', name: 'Pipeline diagram', aka: 'CI/CD pipeline, deployment pipeline, data pipeline, stage diagram',
      desc: 'A row of stages that every change or every batch of data passes through in order, with the jobs inside each stage and their status. A failed job stops everything to its right.',
      use: 'you need to explain how code gets to production or how data moves from source to dashboard, and where it can be stopped',
      cost: 'hiding the gates; show manual approvals, quality checks and what happens on failure, since those are what people ask about',
      ref: 'Jez Humble and David Farley "Continuous Delivery" (deployment pipeline), GitHub Actions and GitLab CI pipeline graphs, Jenkins stage view',
      prompt: 'a pipeline diagram with stages as chevrons left to right, the jobs of each stage stacked beneath with a pass or fail mark, gates and manual approvals drawn as their own step, and stages after a failure shown dashed as blocked',
      ex: dg(b => {
        const st = [['Commit', 'a'], ['Build', 'a'], ['Test', 'r'], ['Deploy', 'n']];
        st.forEach(([l, c], i) => fl_chev(b, 12 + i * 75, 74, 40, 34, l, c, { first: !i, dash: i === 3 }));
        const jobs = [[['a1f9c2', 1]], [['compile', 1], ['lint', 1]], [['unit', 1], ['e2e', 0]], [['staging', 2], ['prod', 2]]];
        jobs.forEach((js, i) => js.forEach(([t, okv], j) => {
          const cx = 48 + i * 75, y = 104 + j * 32;
          b.raw(`<g class="c-n"><path class="ln" style="stroke-width:1" d="M${cx} ${j ? y - 22 : 76} V${y - 11}"/></g>`);
          b.box(cx - 6, y, t, okv === 0 ? 'r' : 'n', { w: 54, h: 22, bold: false, dash: okv === 2 });
          if (okv === 1) b.ok(cx + 30, y, 4.5); else if (okv === 0) b.x(cx + 30, y, 4.5);
        }));
        b.hand(272, 176, 'blocked', { size: 15 });
      }) },

    { id: 'eventstorming', name: 'EventStorming board', aka: 'event storming, big picture EventStorming, process modelling EventStorming',
      desc: 'A wall of sticky notes that tells a business process as a timeline of domain events, written in the past tense on orange notes. Blue commands trigger them, pale yellow aggregates handle the commands, lilac policies react to events, and pink notes mark hot spots.',
      use: 'you are starting on a domain with many experts in the room and need a shared picture of what happens before modeling services or code',
      cost: 'events written as tasks or screens; each orange note should be something that happened, in the past tense, that a domain expert would recognize',
      ref: 'Alberto Brandolini, "Introducing EventStorming" and eventstorming.com',
      prompt: 'an EventStorming board read left to right as a timeline: orange past-tense domain events, blue commands before the events they cause, pale yellow aggregates under each command and event pair, lilac policies that react to an event, and pink hot spots for open questions',
      ex: dg(b => {
        const c1 = fl_es(b, 14, 40, 50, 34, 'Place\norder', 'cmd'), e1 = fl_es(b, 72, 40, 50, 34, 'Order\nplaced', 'ev');
        const p1 = fl_es(b, 130, 40, 50, 34, 'If paid,\nship', 'pol');
        const c2 = fl_es(b, 188, 40, 50, 34, 'Ship\norder', 'cmd'), e2 = fl_es(b, 246, 40, 54, 34, 'Order\nshipped', 'ev');
        fl_es(b, 14, 84, 108, 26, 'Order', 'agg'); fl_es(b, 188, 84, 112, 26, 'Shipment', 'agg');
        b.user(39, 18, '', 'c');
        b.raw('<g transform="rotate(-4 155 140)">'); fl_es(b, 122, 124, 66, 34, 'out of\nstock?', 'hot'); b.raw('</g>');
        b.line([[14, 180], [306, 180]]); b.text(160, 191, 'time', { sm: true, mut: true });
        b.text(306, 22, 'orange = happened', { sm: true, mut: true, a: 'end' });
      }) }
  ]
});
/* Ideas & concepts: mind maps, concept maps, trees, fishbones and the frameworks people sketch on slides */

// local helpers (prefix id_)
const id_leaf = (b, x, y, txt, c, side, o = {}) => { // a word sitting on a short underline, Buzan style; side -1 runs left, 1 runs right
  const w = String(txt).length * (o.big ? 6.9 : 5.6) + 6, x2 = x + side * w;
  b.raw(`<g class="c-${c}"><path class="ln k" style="stroke-width:${o.big ? 3 : 1.4}" d="M${r1(x)} ${y} H${r1(x2)}"/><text x="${r1((x + x2) / 2)}" y="${y - (o.big ? 8 : 6.5)}" text-anchor="middle" class="${o.big ? 'b' : 'sm'}" style="fill:${o.big ? 'var(--c)' : 'var(--ink)'}">${xe(txt)}</text></g>`);
  return x2;
};
const id_rot = (b, deg, cx, cy, fn) => { b.raw(`<g transform="rotate(${deg} ${cx} ${cy})">`); fn(); b.raw('</g>'); };
const id_ring = (b, x, y, r, c, o = {}) => b.raw(`<g class="c-${c}"><circle class="lf" cx="${x}" cy="${y}" r="${r}"${o.op ? ` style="opacity:${o.op}"` : ''}/><circle class="ln k" cx="${x}" cy="${y}" r="${r}" style="stroke-width:1.2"/></g>`);

pool.groups.push({
  id: 'maps', title: 'Maps of ideas', slot: 'Idea map',
  intro: 'Pictures for thinking through a topic before there is a system to draw: how ideas branch, relate, break down and cluster. Most start messy on a whiteboard and get tidied once the shape is clear.',
  terms: [
    { id: 'mindmap', name: 'Mind map', aka: 'mindmap, idea map, radial map, spider diagram',
      desc: 'One central topic with branches radiating out, each branch a subtopic and each twig a detail. The layout is free and organic, and the position of a word tells you what it belongs to, so you can capture ideas as fast as people say them.',
      use: 'you are brainstorming, taking notes in a meeting, or planning a talk or a project and want everything on one page',
      cost: 'mind maps only show belongs-to; when ideas relate across branches you need a concept map, and past about 30 words split it',
      ref: 'Tony Buzan "Use Your Head" (1974), XMind, MindNode, Mermaid mindmap syntax',
      prompt: 'a mind map with the central topic in the middle, 4 to 6 main branches radiating out as thick curved limbs in one color each, single words or short phrases on the lines, thinner twigs for details, and no more than about 30 words',
      ex: dg(b => {
        const br = [
          { c: 'a', s: -1, from: [122, 92], to: [104, 58], word: 'Users', tw: [[40, 'devs'], [80, 'ops']] },
          { c: 'c', s: -1, from: [122, 108], to: [104, 142], word: 'Money', tw: [[124, 'ads'], [168, 'swag']] },
          { c: 'b', s: 1, from: [198, 92], to: [216, 58], word: 'Reach', tw: [[34, 'blog'], [80, 'events']] },
          { c: 'd', s: 1, from: [198, 108], to: [216, 142], word: 'When', tw: [[124, 'beta'], [170, 'launch']] }
        ];
        br.forEach(o => {
          b.branch(o.from[0], o.from[1], o.to[0], o.to[1], o.c, { w: 5 });
          const q = id_leaf(b, o.to[0], o.to[1], o.word, o.c, o.s, { big: true });
          o.tw.forEach(([y, t]) => { const lx = q + o.s * 9; b.branch(q, o.to[1], lx, y, o.c, { w: 1.6 }); id_leaf(b, lx, y, t, o.c, o.s); });
        });
        b.raw('<g class="c-n"><ellipse class="nd" style="stroke-width:2" cx="160" cy="100" rx="44" ry="20"/></g>');
        b.text(160, 100, 'Launch', { b: true, size: 14 });
      }) },

    { id: 'conceptmap', name: 'Concept map', aka: 'concept diagram, knowledge map, semantic network',
      desc: 'Concepts in boxes or ovals joined by arrows, and every arrow carries a linking phrase, so each concept, phrase and concept reads as a sentence. Cross-links between distant parts of the map show the relationships a mind map cannot.',
      use: 'you are teaching or learning a topic and want to show how its ideas depend on each other, or checking what someone actually understands',
      cost: 'arrows without phrases turn it back into a tangle; every link should read as a true sentence, such as sun heats ocean',
      ref: 'Joseph Novak (Cornell, 1972), Novak and Gowin "Learning How to Learn", IHMC CmapTools',
      prompt: 'a concept map with each concept as a short noun in a rounded box, arrows labeled with a verb phrase so every link reads as a sentence from one concept to the next, a few cross-links between distant concepts, and no unlabeled arrows',
      ex: dg(b => {
        const sun = b.box(50, 40, 'Sun', 'c', { w: 56, r: 12 }), wind = b.box(160, 40, 'Wind', 'a', { w: 56, r: 12 }), cl = b.box(270, 40, 'Clouds', 'a', { w: 64, r: 12 });
        const oc = b.box(50, 160, 'Ocean', 'a', { w: 60, r: 12 }), riv = b.box(160, 160, 'Rivers', 'a', { w: 62, r: 12 }), rain = b.box(270, 160, 'Rain', 'a', { w: 56, r: 12 });
        b.link(sun, wind, { label: 'drives' }); b.link(wind, cl, { label: 'moves' }); b.link(sun, oc, { label: 'heats' });
        b.link(oc, cl, { label: 'evaporates into', c: 'c' }); b.link(cl, rain, { label: 'release' });
        b.link(rain, riv, { label: 'fills' }); b.link(riv, oc, { label: 'flow to' });
      }) },

    { id: 'treediagram', name: 'Tree diagram', aka: 'hierarchy diagram, org chart, organizational chart, tree chart',
      desc: 'A hierarchy drawn as a tree: one root at the top, each node connected to its parent by an elbow line, and siblings side by side on the same level. Org charts are the best-known kind, and the same shape works for site maps, file systems and taxonomies.',
      use: 'every item has exactly one parent and you want to show reporting lines, nesting or a breakdown by level',
      cost: 'trees hide anything that has two parents, such as dotted-line reports or shared services; note those separately, and keep wide levels readable by stacking leaves',
      ref: 'Daniel McCallum\'s New York and Erie Railroad chart (1855), Reingold-Tilford tree layout, Graphviz dot',
      prompt: 'a tree diagram drawn top down with the root at the top, one box per node with its name and role, siblings aligned on one level, parents joined to children by right-angle elbow connectors, and the same box size on each level',
      ex: dg(b => {
        b.box(160, 30, 'CEO', 'a', { w: 64, sub: 'Maya' });
        const mids = [[64, 'CTO', 'Lee'], [160, 'CFO', 'Sam'], [256, 'COO', 'Ana']].map(([x, l, s]) => b.box(x, 96, l, 'a', { w: 58, sub: s }));
        b.line([[160, 51], [160, 62], [64, 62], [64, 73]], { none: true }); b.line([[160, 62], [256, 62], [256, 73]], { none: true }); b.line([[160, 62], [160, 73]], { none: true });
        const leaves = [[36, 'Web'], [92, 'Data'], [160, 'Legal'], [228, 'Sales'], [284, 'Ops']];
        leaves.forEach(([x, l]) => b.box(x, 164, l, 'n', { w: 50, h: 24, bold: false }));
        b.line([[64, 119], [64, 134], [36, 134], [36, 152]], { none: true }); b.line([[64, 134], [92, 134], [92, 152]], { none: true });
        b.line([[160, 119], [160, 152]], { none: true });
        b.line([[256, 119], [256, 134], [228, 134], [228, 152]], { none: true }); b.line([[256, 134], [284, 134], [284, 152]], { none: true });
      }) },

    { id: 'issuetree', name: 'Issue tree', aka: 'logic tree, MECE tree, hypothesis tree, driver tree',
      desc: 'A question on the left broken into its parts on the right, level by level. At each split the branches should be mutually exclusive and collectively exhaustive (MECE): no overlaps and no gaps, so every possible answer falls under exactly one branch.',
      use: 'you have a big fuzzy problem, like why profits fell, and need to split it into pieces a team can investigate one by one',
      cost: 'branches that overlap or leave a gap; a split that follows a formula (revenue minus cost, price times volume) is the easiest way to stay MECE',
      ref: 'Barbara Minto "The Pyramid Principle", Ethan Rasiel "The McKinsey Way"',
      prompt: 'an issue tree read left to right, with the key question at the root on the left, each level splitting into two to four branches that are mutually exclusive and collectively exhaustive, elbow connectors, and the leaves phrased as questions or hypotheses you can test',
      ex: dg(b => {
        b.box(52, 100, 'Why are\nprofits\ndown?', 'a', { w: 78 });
        const l2 = [[56, 'Revenue\nfell'], [144, 'Costs\nrose']].map(([y, t]) => b.box(152, y, t, 'b', { w: 70 }));
        const l3 = [[30, 'Fewer buyers'], [82, 'Lower price'], [118, 'Input costs'], [170, 'More staff']].map(([y, t]) => b.box(260, y, t, 'n', { w: 94, h: 24, bold: false }));
        b.line([[91, 100], [104, 100], [104, 56], [117, 56]]); b.line([[104, 100], [104, 144], [117, 144]]);
        b.line([[187, 56], [200, 56], [200, 30], [213, 30]]); b.line([[200, 56], [200, 82], [213, 82]]);
        b.line([[187, 144], [200, 144], [200, 118], [213, 118]]); b.line([[200, 144], [200, 170], [213, 170]]);
        b.hand(52, 160, 'no overlaps,\nno gaps', { c: 'a', size: 14 });
      }) },

    { id: 'fishbone', name: 'Fishbone diagram', aka: 'Ishikawa diagram, cause-and-effect diagram, herringbone diagram',
      desc: 'The problem sits at the head of a fish on the right, and a spine runs to it. Ribs off the spine are categories of cause, such as people, process and tools, and each rib collects the specific causes a team names for it.',
      use: 'you are running a retro or incident review and want to collect contributing causes across categories before picking which to fix',
      cost: 'it collects possible causes; it does not prove any of them, so follow up with data or a five whys on the likely ones',
      ref: 'Kaoru Ishikawa, "Guide to Quality Control" (1968), one of the seven basic tools of quality',
      prompt: 'a fishbone diagram with the problem as the head on the right, a horizontal spine, three to six slanted ribs labeled with cause categories above and below, and short specific causes as horizontal twigs off each rib',
      ex: dg(b => {
        b.box(278, 100, 'Late\norders', 'r', { w: 58 });
        b.line([[18, 100], [247, 100]], { w: 2.4 });
        const top = [['People', ['no cover', 'new staff']], ['Process', ['handoffs', 'manual QA']], ['Tools', ['outages', 'old WMS']]];
        const bot = [['Suppliers', ['late stock', 'no backup']], ['Data', ['stale stock', 'bad ETAs']], ['Demand', ['promos', 'peaks']]];
        [top, bot].forEach((side, k) => side.forEach(([cat, cs], i) => {
          const x0 = 54 + i * 70, y0 = k ? 164 : 36, x1 = x0 + 30;
          b.line([[x0, y0], [x1, 100]], { none: true });
          b.box(x0, k ? 176 : 24, cat, 'a', { w: cat.length * 6.4 + 14, h: 18 });
          cs.forEach((t, j) => {
            const y = k ? [120, 144][j] : [56, 80][j], rx = x0 + 30 * Math.abs(y - y0) / 64;
            b.raw(`<g class="c-n"><path class="ln" style="stroke-width:1" d="M${r1(rx - 2)} ${y} H${r1(rx - 4 - t.length * 5.5)}"/></g>`);
            b.text(r1(rx - 4), y - 5, t, { sm: true, a: 'end' });
          });
        }));
      }) },

    { id: 'affinity', name: 'Affinity map', aka: 'affinity diagram, KJ method, sticky-note clustering',
      desc: 'Lots of single observations, one per sticky note, sorted into clusters by similarity, then each cluster given a name. The themes come up from the notes instead of being decided first.',
      use: 'you have a pile of research quotes, survey answers or retro notes and need to find the themes in them with a group',
      cost: 'naming the groups before sorting, which turns it into filing; sort first in silence, then name, and keep one idea per note',
      ref: 'Jiro Kawakita\'s KJ method (1960s), Karen Holtzblatt and Hugh Beyer "Contextual Design", Miro and FigJam templates',
      prompt: 'an affinity map with one observation per sticky note in the person\'s own words, notes grouped into loose clusters with a dashed boundary and a short theme name on top, three to six clusters, and a count of notes per theme',
      ex: dg(b => {
        const cl = [['Pricing', 12, [['too', 'expensive'], ['unclear', 'tiers'], ['want', 'monthly']]], ['Setup', 114, [['lost in', 'setup'], ['docs', 'confusing'], ['need a', 'video']]], ['Speed', 216, [['slow', 'search'], ['app', 'lags'], ['export', 'times out']]]];
        cl.forEach(([name, x, ns], i) => {
          b.zone(x, 34, 92, 154, '', 'a');
          b.text(x + 46, 22, name + ' (' + ns.length + ')', { b: true, c: 'a' });
          ns.forEach((t, j) => {
            const nx = x + [8, 26, 10][j], ny = 44 + j * 46, rot = [-4, 3, -2][(i + j) % 3];
            id_rot(b, rot, nx + 30, ny + 16, () => b.note(nx, ny, 60, 32, t.join('\n'), 'c'));
          });
        });
      }) }
  ]
});

pool.groups.push({
  id: 'frames', title: 'Frameworks & shapes', slot: 'Framework',
  intro: 'The simple shapes people reach for on a slide or a whiteboard to place things against each other: matrices, overlaps, scales, layers and loops. Each one makes a claim about how things relate, so pick the shape whose claim is true.',
  terms: [
    { id: 'twobytwo', name: '2×2 matrix', aka: 'two-by-two, quadrant chart, four-box, impact effort matrix',
      desc: 'Two axes, each split into low and high, make four quadrants, and items are placed by where they score on both. Each quadrant gets a name that says what to do with things that land in it.',
      use: 'you are prioritizing or comparing a list of options on two things that matter, such as impact and effort',
      cost: 'axes that are not independent, or vague ones like value; name each axis with something you could actually estimate',
      ref: 'Eisenhower urgent-important matrix, BCG growth-share matrix (Bruce Henderson, 1970), Gartner Magic Quadrant',
      prompt: 'a 2×2 matrix with clearly named axes and low and high at each end, a named action for each quadrant in its corner, items placed as labeled dots, and the quadrant you want people to act on lightly shaded',
      ex: dg(b => {
        rect(b, 40, 14, 132, 80, 'g', { r: 0 }); b.raw('<g class="c-n"><rect class="ln" x="40" y="14" width="264" height="160"/><path class="ln" d="M172 14 V174 M40 94 H304"/></g>');
        b.text(46, 26, 'Quick wins', { sm: true, b: true, a: 'start', c: 'g' }); b.text(298, 26, 'Big bets', { sm: true, b: true, a: 'end' });
        b.text(46, 164, 'Fill-ins', { sm: true, b: true, a: 'start' }); b.text(298, 164, 'Money pits', { sm: true, b: true, a: 'end' });
        [[82, 52, 'SSO'], [106, 72, 'fix search'], [226, 46, 'mobile app'], [96, 130, 'dark mode'], [250, 128, 'rewrite']].forEach(([x, y, t]) => { b.dot(x, y, 'a', 4.5); b.text(x + 8, y, t, { sm: true, a: 'start' }); });
        b.raw('<g><text transform="translate(24 94) rotate(-90)" text-anchor="middle" class="sm b">impact →</text></g>');
        b.text(172, 187, 'effort →', { sm: true, b: true });
      }) },

    { id: 'venn', name: 'Venn diagram', aka: 'set diagram, overlap diagram, Euler diagram (when not all overlaps exist)',
      desc: 'Overlapping circles, one per set or quality, where each overlap holds what belongs to both. The center of a three-circle Venn is usually the point of the slide: the things that meet every condition.',
      use: 'you want to show what two or three groups share, or argue that a sweet spot needs several qualities at once',
      cost: 'more than three circles stop showing every overlap clearly; and if some overlaps are empty, draw an Euler diagram instead',
      ref: 'John Venn, "On the Diagrammatic and Mechanical Representation of Propositions and Reasonings" (1880), Leonhard Euler\'s circles',
      prompt: 'a Venn diagram with two or three translucent overlapping circles of equal size in distinct colors, each set named in its own region outside the overlaps, overlaps labeled only where they mean something, and the center region called out',
      ex: dg(b => {
        id_ring(b, 128, 76, 54, 'a'); id_ring(b, 192, 76, 54, 'b'); id_ring(b, 160, 128, 54, 'd');
        b.text(108, 58, 'Useful', { b: true }); b.text(212, 58, 'Usable', { b: true }); b.text(160, 154, 'Wanted', { b: true });
        b.dot(160, 94, 'n', 3.5);
        b.hand(272, 160, 'ship this', { c: 'r', size: 15 });
        b.scribble(256, 150, 166, 98, { bend: 16 });
      }) },

    { id: 'spectrum', name: 'Spectrum', aka: 'axis placement, continuum, scale, slider diagram',
      desc: 'One line between two named extremes, with items placed along it. It shows that a choice is a matter of degree, and it makes people commit to where each thing sits relative to the others.',
      use: 'a decision is a trade-off on one dimension, such as build versus buy or central versus team-owned, and you want to compare where things sit and where they should move',
      cost: 'false precision; positions are relative judgments, so avoid a numbered scale unless you really measured something',
      ref: 'Charles Osgood\'s semantic differential scales, build versus buy lines in architecture reviews',
      prompt: 'a spectrum drawn as one horizontal line with the two extremes named at each end, items placed along it as labeled dots with leader lines, and a dashed arrow for any item you propose to move',
      ex: dg(b => {
        b.line([[34, 110], [286, 110]], { both: true, w: 2 });
        b.text(34, 132, 'Build', { b: true, a: 'start' }); b.text(34, 146, 'custom code', { sm: true, mut: true, a: 'start' });
        b.text(286, 132, 'Buy', { b: true, a: 'end' }); b.text(286, 146, 'SaaS', { sm: true, mut: true, a: 'end' });
        [[70, 46, 'Pricing engine'], [140, 76, 'Search'], [214, 46, 'Billing'], [266, 76, 'Auth']].forEach(([x, y, t]) => {
          b.raw(`<g class="c-n"><path class="ln" style="stroke-width:1" d="M${x} ${y + 7} V106"/></g>`);
          b.tag(x, y, t, 'a'); b.dot(x, 110, 'a', 4.5);
        });
        b.raw('<g class="c-c"><circle class="nd dash" cx="198" cy="110" r="4.5" style="fill:none"/></g>');
        b.line([[146, 122], [192, 122]], { dash: true, c: 'c' });
        b.hand(170, 170, 'move search to buy', { c: 'c', size: 15 });
      }) },

    { id: 'pyramid', name: 'Pyramid', aka: 'hierarchy of levels, triangle diagram, layered pyramid',
      desc: 'A triangle cut into horizontal bands, where the width of each band says how much or how many, and the order says what rests on what. The bottom is the broad foundation and the top is the narrow peak.',
      use: 'the levels really do depend on the ones below and shrink as you go up, as in the test pyramid or a data, information, knowledge stack',
      cost: 'drawing a pyramid for a plain list; if the levels do not get smaller or depend on each other, use a stack or a list instead',
      ref: 'Mike Cohn\'s test pyramid ("Succeeding with Agile", 2009), the DIKW pyramid, Maslow\'s hierarchy as drawn by later authors',
      prompt: 'a pyramid of three to five horizontal bands, widest at the bottom, each band named inside, with the width meaning quantity and each level resting on the one below, plus one side note explaining what changes from bottom to top',
      ex: dg(b => {
        const ax = 124, top = 16, base = 184, hw = 104, X = y => hw * (y - top) / (base - top);
        const bands = [[top, 72, 'E2E', 'c'], [72, 128, 'Integration', 'b'], [128, base, 'Unit', 'a']];
        bands.forEach(([y1, y2, l, c]) => {
          const p = y1 === top ? `${ax},${top} ${r1(ax + X(y2))},${y2} ${r1(ax - X(y2))},${y2}` : `${r1(ax - X(y1))},${y1} ${r1(ax + X(y1))},${y1} ${r1(ax + X(y2))},${y2} ${r1(ax - X(y2))},${y2}`;
          b.raw(`<g class="c-${c}"><polygon class="nd" points="${p}"/></g>`);
          b.text(ax, y1 === top ? 54 : (y1 + y2) / 2, l, { b: true });
        });
        b.line([[256, 30], [256, 170]], { both: true });
        b.text(284, 30, 'slow,', { sm: true, a: 'middle' }); b.text(284, 42, 'costly', { sm: true });
        b.text(284, 158, 'fast,', { sm: true }); b.text(284, 170, 'many', { sm: true });
      }) },

    { id: 'onion', name: 'Onion diagram', aka: 'concentric layers, concentric circles, layer diagram, stakeholder onion',
      desc: 'Nested rings around a core, where each ring wraps the one inside it. It shows what is central and protected and what sits further out, and in software it usually means dependencies point inward only.',
      use: 'you are showing layers of an architecture, circles of stakeholders, or what is core and what is periphery',
      cost: 'rings without a rule; say what moving inward means, such as more stable, fewer dependencies or closer to the customer',
      ref: 'Jeffrey Palermo "The Onion Architecture" (2008), Robert C. Martin\'s Clean Architecture circles, Ian Alexander\'s stakeholder onion',
      prompt: 'an onion diagram of three to five concentric rings with the core in the center, each ring named at its top, the rings shading darker toward the core, and one arrow and note stating what moving inward means',
      ex: dg(b => {
        [[88, 'n'], [64, 'a'], [40, 'a'], [18, 'a']].forEach(([r, c]) => id_ring(b, 128, 100, r, c));
        b.text(128, 24, 'Infrastructure', { sm: true, b: true }); b.text(128, 48, 'App services', { sm: true, b: true });
        b.text(128, 71, 'Domain svc', { sm: true, b: true }); b.text(128, 100, 'Core', { sm: true, b: true });
        b.line([[300, 100], [150, 100]], { c: 'r', w: 1.8 });
        b.hand(262, 128, 'deps point in', { size: 15 });
      }) },

    { id: 'cycle', name: 'Cycle diagram', aka: 'loop diagram, circular process, flywheel',
      desc: 'Steps arranged in a circle with arrows from each to the next and from the last back to the first. It says the process never really ends: the output of the last step feeds the first step of the next round.',
      use: 'a process genuinely repeats, like plan, do, check, act, a learning loop, or a growth flywheel',
      cost: 'drawing a cycle for a process that ends; if nothing feeds back, it is a flowchart or a timeline',
      ref: 'Walter Shewhart and W. Edwards Deming\'s PDCA cycle, John Boyd\'s OODA loop, David Kolb\'s learning cycle',
      prompt: 'a cycle diagram of three to six steps evenly spaced around a circle, read clockwise from the top, each step a short verb in a box, curved arrows between neighbours with the last arrow returning to the first, and the loop\'s name in the center',
      ex: dg(b => {
        const n = [[160, 32, 'Plan'], [264, 100, 'Do'], [160, 168, 'Check'], [56, 100, 'Act']].map(([x, y, l], i) => b.box(x, y, l, i === 2 ? 'c' : 'a', { w: 64, h: 26 }));
        n.forEach((a, i) => b.link(a, n[(i + 1) % 4], { bend: -14, w: 1.8 }));
        b.text(160, 94, 'PDCA', { b: true, size: 15 }); b.text(160, 112, 'repeat', { sm: true, mut: true });
      }) },

    { id: 'iceberg', name: 'Iceberg diagram', aka: 'iceberg model, systems thinking iceberg, above and below the waterline',
      desc: 'A small tip above the waterline and a much larger mass below. The tip is what people see, such as events or symptoms, and the layers underneath are the patterns, structures and beliefs that produce them.',
      use: 'you want to move a conversation from the incident everyone saw to the causes underneath it, or show how much work is hidden',
      cost: 'a nice picture with nothing to act on; name concrete items in each layer, and point at the layer where you will change something',
      ref: 'Edward T. Hall\'s cultural iceberg ("Beyond Culture", 1976), the events, patterns, structures and mental models iceberg used in systems thinking',
      prompt: 'an iceberg diagram with a wavy waterline, a small tip above it naming what is visible, and a larger mass below divided into two or three labeled layers getting deeper and less visible, with a note on the layer you will act on',
      ex: dg(b => {
        b.raw('<g class="c-a"><rect class="lf" x="10" y="70" width="300" height="122" rx="4"/><path class="ln k" d="M10 70 q10 -5 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0"/></g>');
        b.raw('<g class="c-n"><path class="nd" style="stroke-width:1.5" d="M136 70 L156 28 L168 36 L190 70 L232 96 L244 146 L206 184 L120 186 L82 150 L96 102 Z"/><path class="ln dash" style="stroke-width:.9" d="M98 110 H236 M86 146 H244"/></g>');
        b.text(163, 58, 'Events', { sm: true, b: true });
        b.text(166, 90, 'Patterns', { sm: true, b: true }); b.text(166, 128, 'Structures', { sm: true, b: true }); b.text(164, 166, 'Mental models', { sm: true, b: true });
        b.text(30, 40, 'what we see', { sm: true, mut: true, a: 'start' }); b.text(30, 100, 'below the', { sm: true, mut: true, a: 'start' }); b.text(30, 111, 'surface', { sm: true, mut: true, a: 'start' });
        b.hand(282, 112, 'fix here', { c: 'r', size: 15 });
        b.scribble(272, 120, 238, 130, { bend: 6 });
      }) },

    { id: 'wardley', name: 'Wardley map', aka: 'value chain map, situational map',
      desc: 'A map of the components behind a user need. The vertical axis is the value chain, from visible to the user at the top to invisible at the bottom, and the horizontal axis is evolution from genesis through custom-built and product to commodity. Arrows show where components are moving.',
      use: 'you are deciding what to build, buy or outsource, or explaining why a component should move to a product or utility',
      cost: 'placing components by guesswork on evolution; use the characteristics for each stage, and keep the user need as the anchor at the top',
      ref: 'Simon Wardley "Wardley Maps" (free on Medium), learnwardleymapping.com, OnlineWardleyMaps',
      prompt: 'a Wardley map with the user need as the anchor at the top, components as dots on a value chain going down from visible to invisible, the x axis divided into genesis, custom, product and commodity, dependency lines between components, and dashed red arrows for expected evolution',
      ex: dg(b => {
        b.raw('<g class="c-n"><path class="ln" d="M28 14 V170 H310"/><path class="ln dash" style="stroke-width:.8" d="M99 14 V170 M170 14 V170 M241 14 V170"/></g>');
        ['Genesis', 'Custom', 'Product', 'Commodity'].forEach((t, i) => b.text(63.5 + i * 71, 182, t, { sm: true, mut: true }));
        b.raw('<g><text transform="translate(16 92) rotate(-90)" text-anchor="middle" class="sm b">value chain</text></g>');
        const P = { user: [214, 24], shop: [200, 58], rec: [118, 96], pay: [258, 96], data: [150, 130], comp: [276, 144] };
        [['user', 'shop'], ['shop', 'rec'], ['shop', 'pay'], ['rec', 'data'], ['data', 'comp'], ['pay', 'comp']].forEach(([a, c]) => b.line([P[a], P[c]], { none: true }));
        Object.entries(P).forEach(([k, [x, y]]) => b.raw(`<g class="c-${k === 'user' ? 'a' : 'n'}"><circle class="nd" cx="${x}" cy="${y}" r="${k === 'user' ? 5 : 4.5}" style="fill:var(--panel)"/></g>`));
        [['user', 'Customer', 'a', 1], ['shop', 'Online shop', 'n', 1], ['rec', 'Recommend', 'n', -1], ['pay', 'Payments', 'n', 1], ['data', 'Data model', 'n', 1], ['comp', 'Compute', 'n', 0]].forEach(([k, t, c, s]) => b.text(P[k][0] + s * 8, P[k][1] + (s ? -7 : 13), t, { sm: true, b: true, a: s > 0 ? 'start' : s < 0 ? 'end' : 'middle', c: c === 'a' ? 'a' : null }));
        b.line([[124, 96], [186, 96]], { dash: true, c: 'r' });
      }) }
  ]
});
/* Craft of explaining: composition, techniques and pitfalls */
const cr_dim = (b, fn) => { b.raw('<g opacity=".42">'); fn(); b.raw('</g>'); };
const cr_lines = (b, x, y, ls, o = {}) => ls.forEach((l, i) => b.text(x, y + i * (o.lh || 11), l, { sm: true, a: 'start', mono: o.mono, mut: o.mut }));

pool.groups.push({
  id: 'composition', title: 'Composition', slot: 'Composition',
  intro: 'The layout choices that make any diagram readable, whatever its type: which way it reads, what sits together, what every line and color means, and where the eye lands first.',
  terms: [
    { id: 'readingdir', name: 'One reading direction', aka: 'flow direction, left to right, top to bottom, rank direction',
      desc: 'The main flow runs one way across the whole diagram, usually left to right or top to bottom, so it reads like a sentence. Side branches and error paths leave the main line at right angles and never double back against it.',
      use: 'any diagram with a flow in it: requests, pipelines, processes, data moving through stages',
      cost: 'return arrows and feedback loops that fight the direction; draw replies dashed, or route them along the bottom edge',
      ref: 'Graphviz rankdir, Mermaid flowchart LR and TD, Edward Tufte on reading order',
      prompt: 'one reading direction, left to right for the main flow; each step sits to the right of the one before it, branches and error paths drop downward, and no arrow on the main path points back to the left',
      ex: dg(b => {
        b.line([[24, 36], [296, 36]], { c: 'a', w: 2 });
        b.text(160, 24, 'main flow reads this way', { sm: true, c: 'a', b: true });
        const ns = [['Order', 44], ['Check', 122], ['Pay', 200], ['Ship', 278]].map(([l, x]) => b.box(x, 92, l, 'a', { w: 58 }));
        for (let i = 0; i < 3; i++) b.link(ns[i], ns[i + 1]);
        const rf = b.box(200, 160, 'Refund', 'r', { w: 66 });
        b.link(ns[2], rf, { label: 'declined', dash: true, c: 'r' });
      }) },

    { id: 'grouping', name: 'Grouping with boundaries and proximity', aka: 'boundaries, containers, clusters, common region, swim groups',
      desc: 'Things that belong together sit close together, and a labeled boundary draws the line around them: a team, a deployment unit, a network zone. The reader sees the groups before reading a single box.',
      use: 'ownership, trust zones or deployment units matter to the question, or a diagram has more than about six boxes',
      cost: 'boundaries that overlap or nest more than two deep, and groups with no label saying what the boundary means',
      ref: 'Gestalt principles of proximity and common region; C4 system and container boundaries; Graphviz cluster subgraphs',
      prompt: 'group related elements inside labeled dashed boundaries (team, deployment unit or network zone), keep members of a group close together with wider gaps between groups, and say in the boundary label what the grouping means',
      ex: dg(b => {
        b.zone(14, 26, 136, 150, 'checkout team', 'a');
        b.zone(170, 26, 136, 150, 'catalog team', 'b');
        const ca = b.box(82, 68, 'Cart', 'a', { w: 76 }), pa = b.box(82, 136, 'Payments', 'a', { w: 76 });
        const se = b.box(238, 68, 'Search', 'b', { w: 76 }), pr = b.box(238, 136, 'Products', 'b', { w: 76 });
        b.link(ca, pa); b.link(se, pr);
        b.link(ca, se, { label: 'lookup' });
        b.text(160, 190, 'close together = belongs together', { sm: true, mut: true });
      }) },

    { id: 'labeledarrows', name: 'Label every arrow', aka: 'labeled relationships, edge labels, connector labels',
      desc: 'Every line says what moves along it or what the relationship is, as a short verb or protocol: "reads via SQL", "publishes OrderPlaced", "HTTPS/JSON". The reader never has to guess why two boxes are connected.',
      use: 'always, and especially in architecture and data flow diagrams where one line could mean a call, a dependency or a data flow',
      cost: 'labels that repeat the box names, or long sentences on a line; keep them to two or three words and put detail in a caption',
      ref: 'c4model.com notation guidance, Simon Brown "Software Architecture for Developers"',
      prompt: 'label every arrow with a short verb phrase or protocol saying what travels along it (for example "HTTPS/JSON", "reads via SQL", "publishes OrderPlaced"); the arrowhead points in the direction the request or data moves',
      ex: dg(b => {
        const w = b.box(46, 56, 'Web', 'n'), a = b.box(160, 56, 'API', 'a'), d = b.db(274, 56, 'DB', 'c');
        b.link(w, a, { label: 'HTTPS' }); b.link(a, d, { label: 'SQL' });
        const q = b.queue(160, 148, 'orders', 'd', { w: 70 }), e = b.box(274, 148, 'Email', 'n');
        b.link(a, q, { label: 'OrderPlaced' }); b.link(q, e, { label: 'pulls' });
        b.text(46, 148, 'verb or\nprotocol', { sm: true, mut: true });
      }) },

    { id: 'legend', name: 'Legend and key', aka: 'key, notation guide, map legend',
      desc: 'A small box in a corner that explains every shape, color and line style that carries meaning. With a key, the diagram stands on its own when someone screenshots it into a slide or a chat.',
      use: 'the diagram uses more than one color, line style or shape, or it will travel beyond the people who drew it',
      cost: 'a legend for things that need none, or a legend so long it shows the notation is too clever; aim for three to five entries',
      ref: 'c4model.com notation checklist (include a key), cartographic map legends, Structurizr auto-generated keys',
      prompt: 'add a small legend in the bottom-right corner that explains every color, line style and shape used (for example blue = our services, dashed box = external, dashed line = async event), with no more than five entries',
      ex: dg(b => {
        const o = b.box(62, 50, 'Orders', 'a'), bl = b.box(62, 146, 'Billing', 'a'), s = b.box(196, 50, 'Stripe', 'n', { dash: true });
        b.link(o, s); b.link(o, bl, { dash: true }); b.link(bl, s, { dash: true });
        rect(b, 196, 102, 114, 88, 'n', { r: 5 });
        b.text(206, 114, 'LEGEND', { sm: true, b: true, a: 'start', mono: true });
        rect(b, 206, 125, 14, 10, 'a');
        b.text(228, 130, 'our service', { sm: true, a: 'start' });
        rect(b, 206, 141, 14, 10, 'n', { dash: true });
        b.text(228, 146, 'external', { sm: true, a: 'start' });
        b.line([[204, 162], [220, 162]]); b.text(228, 162, 'sync call', { sm: true, a: 'start' });
        b.line([[204, 178], [220, 178]], { dash: true }); b.text(228, 178, 'async event', { sm: true, a: 'start' });
      }) },

    { id: 'meaningcolor', name: 'Color that means something', aka: 'semantic color, color encoding, status colors',
      desc: 'Color encodes one thing, such as status, owner or new versus existing, and everything else stays neutral. Two or three colors with a stated meaning do more than a full palette.',
      use: 'one attribute matters most to the reader: what is broken, what is new, which team owns what',
      cost: 'red and green as the only signal (about one in twelve men is red-green color blind); pair color with a label, icon or line style',
      ref: 'Cynthia Brewer, ColorBrewer; Edward Tufte "Envisioning Information" (use of color); IBM Carbon status colors',
      prompt: 'use color for one meaning only and say it in the legend (for example green = healthy, amber = degraded, red = down); everything else stays neutral gray, use at most three colors, and repeat the meaning with a label or icon',
      ex: dg(b => {
        [['auth', 'g'], ['search', 'g'], ['cart', 'c'], ['pay', 'r'], ['email', 'g'], ['feed', 'g']].forEach(([l, c], i) => b.box(60 + (i % 3) * 100, 46 + Math.floor(i / 3) * 62, l, c, { w: 74 }));
        [['g', 'healthy', 64], ['c', 'degraded', 150], ['r', 'down', 238]].forEach(([c, l, x]) => { b.dot(x, 166, c, 5); b.text(x + 10, 166, l, { sm: true, a: 'start' }); });
        b.hand(160, 188, 'one color = one meaning', { c: 'n', size: 14 });
      }) },

    { id: 'emphasis', name: 'Highlight one path, gray the rest', aka: 'focus and context, emphasis, de-emphasis, spotlight',
      desc: 'The part of the diagram the explanation is about is drawn in strong color and heavier lines, and everything around it is faded to light gray. The context stays visible so the reader knows where they are, but the eye goes straight to the path.',
      use: 'walking someone through one request, one failure or one change inside a bigger system',
      cost: 'highlighting three things at once, which is the same as highlighting nothing; make a second copy of the diagram for the second path',
      ref: 'Cole Nussbaumer Knaflic "Storytelling with Data" (focus attention), focus+context in information visualization',
      prompt: 'draw the whole system in light gray, then highlight only the path being explained in one strong color with thicker lines, so the context is visible but the eye lands on that path first',
      ex: dg(b => {
        const u = b.user(30, 98, 'user', 'a');
        const e = b.box(100, 100, 'Edge', 'a');
        const o = b.box(190, 100, 'Orders', 'a');
        const d = b.db(276, 100, 'DB', 'a');
        cr_dim(b, () => {
          const au = b.box(190, 36, 'Auth'), se = b.box(190, 164, 'Search'), ca = b.box(276, 36, 'Cache'), ix = b.box(276, 164, 'Index');
          b.link(e, au); b.link(e, se); b.link(au, ca); b.link(se, ix); b.link(o, ca);
        });
        b.link(u, e, { c: 'a', w: 2.6 }); b.link(e, o, { c: 'a', w: 2.6 }); b.link(o, d, { c: 'a', w: 2.6 });
      }) },

    { id: 'gridalign', name: 'Align to a grid', aka: 'snap to grid, alignment, consistent spacing, orthogonal layout',
      desc: 'Boxes sit on shared rows and columns with equal gaps, matching sizes for things of the same kind, and connectors run straight or at right angles. An aligned diagram looks deliberate, and misalignment becomes a signal you can use.',
      use: 'any diagram that will be read more than once, and every diagram drawn by hand in a canvas tool',
      cost: 'forcing unrelated things onto the same row just because it is tidy, which suggests they are peers when they are not',
      ref: 'Josef Müller-Brockmann "Grid Systems in Graphic Design"; snap to grid in draw.io, Figma and Excalidraw',
      prompt: 'place every box on a shared grid of rows and columns with equal spacing, use the same width and height for elements of the same kind, and route connectors straight or with right-angle bends only',
      ex: dg(b => {
        cr_dim(b, () => {
          [64, 160, 256].forEach(x => path(b, `M${x} 18 V182`, 'a', 'ln k dash'));
          [60, 140].forEach(y => path(b, `M18 ${y} H302`, 'a', 'ln k dash'));
        });
        const o = { w: 66, h: 30 };
        const w = b.box(64, 60, 'Web', 'n', o), a = b.box(160, 60, 'API', 'a', o), k = b.box(256, 60, 'Worker', 'n', o);
        const d = b.db(160, 140, 'DB', 'c', { w: 66 }), q = b.box(256, 140, 'Queue', 'n', o);
        b.link(w, a); b.link(a, k); b.link(a, d); b.link(k, q);
        b.line([[99, 34], [125, 34]], { both: true }); b.line([[195, 34], [221, 34]], { both: true });
        b.text(112, 24, 'gap', { sm: true, mut: true }); b.text(208, 24, 'gap', { sm: true, mut: true });
      }) }
  ]
});

pool.groups.push({
  id: 'techniques', title: 'Techniques', slot: 'Technique',
  intro: 'Ways to walk a reader through something bigger than one glance: numbering, building up in steps, zooming, annotating, comparing side by side, pulling things apart, borrowing a familiar picture and letting people play with it.',
  terms: [
    { id: 'numbered', name: 'Numbered steps', aka: 'numbered flow, step markers, sequence numbers',
      desc: 'Small numbered markers on the arrows or boxes give the order of events, and a short key or caption explains each number. The picture shows where things happen and the numbers show when.',
      use: 'a structural diagram also has to tell a story in order, like a request path drawn on an architecture diagram or a runbook',
      cost: 'numbers that skip, branch or loop; if the order needs alternatives or loops, use a sequence diagram instead',
      ref: 'AWS reference architecture diagrams, IKEA assembly instructions',
      prompt: 'mark each step with a filled numbered circle (1, 2, 3...) placed on the arrow where it happens, in the order events occur, with a short numbered key under the diagram explaining each step in a few words',
      ex: dg(b => {
        const u = b.user(30, 50, 'user'), ap = b.box(110, 52, 'App', 'a'), au = b.box(110, 112, 'Auth', 'n'), ai = b.box(200, 52, 'API', 'a'), d = b.db(282, 52, 'DB', 'c');
        b.link(u, ap); b.link(ap, au); b.link(ap, ai); b.link(ai, d);
        b.num(58, 52, 1); b.num(122, 84, 2); b.num(155, 44, 3); b.num(244, 44, 4);
        path(b, 'M16 138 H304', 'n', 'ln dash');
        [[1, 'sign in', 24, 154], [2, 'get a token', 24, 176], [3, 'call the API', 170, 154], [4, 'read orders', 170, 176]].forEach(([n, l, x, y]) => { b.num(x, y, n); b.text(x + 13, y, l, { sm: true, a: 'start' }); });
      }) },

    { id: 'buildup', name: 'Progressive build-up', aka: 'build, reveal, step-by-step diagram, animation frames',
      desc: 'The same diagram shown several times, each version adding one new element in a highlight color while earlier parts turn gray. It works on slides, in docs as a short series, and in talks where you click through.',
      use: 'a diagram is too dense to take in at once, or you are presenting and want people to follow along',
      cost: 'boxes that move between frames; keep every element in the same place so only the new part changes',
      ref: 'Nancy Duarte "slide:ology", Keynote and PowerPoint build animations, Excalidraw frames',
      prompt: 'show the diagram as a sequence of frames, each adding exactly one new element or arrow in the highlight color while earlier elements turn gray; every element keeps the same position in every frame',
      ex: dg(b => {
        const fs = [10, 113, 216];
        fs.forEach((fx, i) => {
          rect(b, fx, 22, 94, 148, 'n', { r: 6 });
          b.text(fx + 47, 34, 'step ' + (i + 1), { sm: true, b: true, mono: true });
          const cx = fx + 47;
          const w = b.box(cx, 66, 'Web', i === 0 ? 'a' : 'n', { w: 56, h: 24 });
          if (i >= 1) { const a = b.box(cx, 106, 'API', i === 1 ? 'a' : 'n', { w: 56, h: 24 }); b.link(w, a, i === 1 ? { c: 'a' } : {});
            if (i >= 2) { const d = b.db(cx, 146, 'DB', 'a', { w: 50, h: 30 }); b.link(a, d, { c: 'a' }); } }
        });
        b.hand(160, 187, 'one new thing per step', { c: 'a', size: 14 });
      }) },

    { id: 'zoomlevels', name: 'Zoom levels', aka: 'views at different altitudes, levels of detail, drill-down, overview then detail',
      desc: 'A set of diagrams at different altitudes, where one box in the high-level view is opened up into its own diagram at the next level. Each view keeps one level of abstraction and points to the one above and below.',
      use: 'a system is too big for one picture, or different readers need different depths (executives, new engineers, the owning team)',
      cost: 'names that change between levels; the box called "Shop" up top must be the boundary called "Shop" when you zoom in',
      ref: 'Simon Brown, C4 model (context, container, component, code); Ben Shneiderman "overview first, zoom and filter, then details on demand"',
      prompt: 'split the explanation into views at different zoom levels: a high-level view with the system as one box, then a view that opens that box to show its parts inside a matching labeled boundary; keep one level of abstraction per view and the same names across views',
      ex: dg(b => {
        b.zone(10, 54, 112, 100, 'level 1', 'n');
        const u = b.user(34, 84, '');
        const s = b.box(88, 124, 'Shop', 'a', { w: 54, h: 30 });
        b.link(u, s);
        b.zone(164, 18, 146, 166, 'level 2: inside Shop', 'a');
        cr_dim(b, () => { path(b, 'M115 109 L164 18', 'a', 'ln k dash'); path(b, 'M115 139 L164 184', 'a', 'ln k dash'); });
        const w = b.box(237, 50, 'Web app', 'a', { w: 80, h: 26 }), a = b.box(237, 100, 'API', 'a', { w: 80, h: 26 }), d = b.db(237, 150, 'Orders', 'c', { w: 64, h: 34 });
        b.link(w, a); b.link(a, d);
        b.text(66, 170, 'one box here...', { sm: true, mut: true });
        b.text(66, 182, '...a diagram there', { sm: true, mut: true });
      }) },

    { id: 'callouts', name: 'Callouts and annotations', aka: 'annotations, margin notes, leader lines, marginalia',
      desc: 'Short notes placed right next to the part of the diagram they explain, joined to it by a leader line or arrow. They carry the why ("cold after every deploy", "900 ms here") that a box and arrow cannot say on their own.',
      use: 'explaining an incident, a design review or a bottleneck, where one or two places in the picture need words',
      cost: 'more than three or four callouts; at that point the notes are the explanation and belong in the text beside the diagram',
      ref: 'Julia Evans zines (wizardzines.com), annotated graphics in The New York Times, Edward Tufte on integrating words and pictures',
      prompt: 'add at most three short callouts, each placed beside the element it explains and joined to it with a thin leader line, written in a contrasting color and a handwritten or italic style so they read as commentary on top of the diagram',
      ex: dg(b => {
        const u = b.user(32, 104, 'client');
        const a = b.box(126, 106, 'API', 'a', { w: 58 });
        const c = b.box(252, 66, 'Cache', 'b', { w: 64 });
        const d = b.db(252, 148, 'Orders', 'c', { w: 64 });
        b.link(u, a, { label: 'HTTPS' });
        b.link(a, c, { label: 'get' });
        b.link(a, d, { c: 'r', w: 2.4 });
        b.hand(92, 30, 'cold after every deploy', { c: 'a', size: 15, rot: -3 });
        b.scribble(176, 28, 218, 50, { c: 'a', bend: -10 });
        b.hand(118, 172, '900 ms here!', { c: 'r', size: 17, rot: -4 });
        b.scribble(160, 164, 194, 136, { c: 'r', bend: 10 });
      }) },

    { id: 'smallmultiples', name: 'Small multiples and before/after', aka: 'side by side, comparison panels, before and after, trellis',
      desc: 'The same diagram drawn two or more times at the same scale and layout, each panel showing one state, time or option. Because everything else is identical, the eye finds the difference instantly.',
      use: 'proposing a change, comparing options, or showing how something evolved over releases',
      cost: 'moving things around between panels; the layout must match exactly or the reader compares positions instead of content',
      ref: 'Edward Tufte "Envisioning Information" (small multiples), Eadweard Muybridge motion studies',
      prompt: 'draw two panels side by side, labeled before and after, at the same scale with every unchanged element in exactly the same position; draw what changed in a highlight color and keep everything else neutral',
      ex: dg(b => {
        [[10, 'before', 'n'], [165, 'after', 'g']].forEach(([px, l, c], i) => {
          b.zone(px, 22, 145, 156, l, c);
          const cx = px + 48, o = { w: 56, h: 26 };
          const w = b.box(cx, 54, 'Web', 'n', o), a = b.box(cx, 100, 'App', 'n', o), d = b.db(cx, 148, 'DB', 'n', { w: 50, h: 34 });
          b.link(w, a); b.link(a, d);
          if (i === 1) { const k = b.box(px + 112, 100, 'cache', 'g', { w: 50, h: 26 }); b.link(a, k, { c: 'g', both: true }); b.hand(px + 112, 146, 'p95 300 ms', { c: 'g', size: 14 }); }
          else b.text(px + 112, 146, 'p95 2.1 s', { sm: true, mut: true, mono: true });
        });
      }) },

    { id: 'exploded', name: 'Exploded view', aka: 'cutaway, layer view, pulled-apart stack, isometric layers',
      desc: 'The parts of a stack or assembly are pulled apart along one axis, with dashed guide lines showing where they fit back together and labels beside each layer. A cutaway does the same by removing the outer layer to show what is inside.',
      use: 'explaining layers that normally hide each other: a network stack, a request passing through proxies, a platform built on a platform',
      cost: 'perspective drawn for looks; the offset is there to show order and containment, so keep it uniform and simple',
      ref: 'David Macaulay "The Way Things Work", IKEA assembly instructions, the OSI model layer diagrams',
      prompt: 'an exploded view: the layers drawn as flat stacked plates pulled apart along one vertical axis, in their real order, with dashed guide lines joining their corners and a label with a leader line beside each layer',
      ex: dg(b => {
        const cx = 104, ys = [40, 82, 124, 166], ls = ['CDN', 'load balancer', 'app servers', 'database'];
        cr_dim(b, () => { path(b, `M${cx - 62} 40 V166 M${cx + 62} 40 V166`, 'n', 'ln dash'); });
        ys.forEach((y, i) => {
          const c = i === 2 ? 'a' : 'n';
          b.raw(`<g class="c-${c}"><polygon class="nd" points="${cx - 62},${y} ${cx},${y - 15} ${cx + 62},${y} ${cx},${y + 15}"/></g>`);
          path(b, `M${cx + 34} ${y - 7} L${cx + 82} ${y - 7}`, c, 'ln dash');
          b.text(cx + 88, y - 7, ls[i], { a: 'start', b: true, c: i === 2 ? 'a' : undefined });
        });
        b.text(cx + 88, 129, 'where your code runs', { sm: true, a: 'start', mut: true });
      }) },

    { id: 'analogy', name: 'Analogy diagram', aka: 'metaphor diagram, mapping diagram, like-a picture',
      desc: 'A familiar thing (a post office, a restaurant kitchen, a library) drawn next to the technical system, with each part mapped to its counterpart. The reader borrows a model they already have and then sees where it stops holding.',
      use: 'introducing a concept to people new to it: queues, caches, load balancers, public key cryptography',
      cost: 'stretching the analogy past where it fits; say in a caption where it breaks (a mailbox does not retry)',
      ref: 'Dan Roam "The Back of the Napkin", Julia Evans zines',
      prompt: 'an analogy diagram: a top row with a familiar real-world scene and a bottom row with the technical system in the same layout, each pair joined by a dashed vertical line, plus a one-line note on where the analogy breaks',
      ex: dg(b => {
        const s = b.user(48, 40, 'sender', 'c'), m = b.box(160, 46, 'mailbox', 'c'), k = b.user(272, 40, 'carrier', 'c');
        b.link(s, m); b.link(m, k);
        const p = b.box(48, 142, 'Producer', 'a'), q = b.queue(160, 142, 'queue', 'a', { w: 70 }), c = b.box(272, 142, 'Consumer', 'a');
        b.link(p, q); b.link(q, c);
        [48, 160, 272].forEach(x => { b.line([[x, 72], [x, 126]], { dash: true, none: true }); b.tag(x, 99, 'is like', 'c'); });
        b.hand(160, 186, 'but a mailbox never retries', { c: 'r', size: 14 });
      }) },

    { id: 'explorable', name: 'Explorable explanation', aka: 'interactive diagram, reactive document, live figure',
      desc: 'A diagram on a web page with controls the reader can drag or toggle, such as a slider for load or a switch for a failure, and the picture updates as they do. The reader builds intuition by trying values instead of reading about them.',
      use: 'the idea is about how something responds to a change: queueing delay, cache hit rates, backoff, consensus under partitions',
      cost: 'the effort to build and maintain it, and a static fallback for print, screenshots and screen readers',
      ref: 'Bret Victor "Explorable Explanations" (2011), Nicky Case, Bartosz Ciechanowski, Distill.pub',
      prompt: 'an interactive explanation: one diagram or chart with a single labeled control (slider or toggle) that changes one input, the picture and a numeric readout update live as it moves, and a sensible default value plus a static fallback image',
      ex: dg(b => {
        path(b, 'M40 26 V140 H290', 'n', 'ln');
        b.text(46, 22, 'wait time', { sm: true, a: 'start', mut: true });
        b.text(290, 152, 'load', { sm: true, a: 'end', mut: true });
        path(b, 'M40 134 C150 132 210 122 236 96 S270 40 278 26', 'a', 'ln k thick');
        path(b, 'M236 96 V140 M40 96 H236', 'a', 'ln k dash');
        b.dot(236, 96, 'a', 5, { pulse: true });
        b.tag(196, 84, 'wait 4.1 s', 'a');
        path(b, 'M40 174 H290', 'n', 'ln thick');
        path(b, 'M40 174 H236', 'a', 'ln k thick');
        b.raw('<g class="c-a"><circle class="nd" cx="236" cy="174" r="7" style="stroke-width:2"/></g>');
        b.tag(236, 156, 'load 80%', 'a');
        b.hand(118, 156, 'drag me', { c: 'r', size: 15 });
        b.scribble(144, 158, 224, 170, { c: 'r', bend: 8 });
      }) }
  ]
});

pool.groups.push({
  id: 'pitfalls', title: 'Pitfalls', slot: 'Avoid',
  intro: 'The mistakes that make people squint, ask "what does this line mean?" or stop trusting the picture. Add them to the prompt so a model knows what not to draw.',
  terms: [
    { id: 'spaghetti', name: 'Spaghetti diagram', aka: 'everything connected, hairball, rat\'s nest', avoid: true,
      desc: 'Every box is connected to many others with crossing lines, so no path can be followed and no structure is visible. It usually comes from drawing every dependency that exists instead of the ones that answer the question.',
      use: 'someone exports every dependency from a tool, or tries to show a whole system in one picture',
      cost: 'pick the one question the diagram answers and draw only the lines that matter to it; split into several views or highlight one path and gray the rest',
      ref: 'auto-generated dependency graphs of large codebases; the remedy is in C4 views and Tufte\'s "data-ink" idea',
      prompt: 'a spaghetti diagram where every element connects to many others with crossing lines, so no single path can be followed from start to end and no grouping is visible',
      ex: dg(b => {
        const ns = [];
        for (let i = 0; i < 8; i++) { const t = (i / 8) * Math.PI * 2 - Math.PI / 2 + 0.2; ns.push({ x: 170 + Math.cos(t) * 120, y: 104 + Math.sin(t) * 70 }); }
        const pairs = [[0, 3], [0, 5], [1, 4], [1, 6], [2, 5], [2, 7], [3, 6], [3, 7], [4, 0], [5, 1], [6, 2], [7, 4], [0, 2], [4, 6], [1, 3], [5, 7], [0, 6], [2, 4]];
        const bx = ns.map(p => ({ x: p.x, y: p.y, w: 46, h: 24, s: 'r' }));
        pairs.forEach(([a, c], i) => b.link(bx[a], bx[c], { bend: i % 3 ? 0 : 10, none: i % 4 === 1 }));
        ns.forEach((p, i) => b.box(p.x, p.y, 'svc' + (i + 1), i % 2 ? 'n' : 'a', { w: 46, h: 24 }));
      }) },

    { id: 'unlabeledarrows', name: 'Unlabeled arrows', aka: 'mystery lines, unexplained connectors', avoid: true,
      desc: 'Lines join boxes with no label, so the reader has to guess whether each one is a call, a dependency, a data flow or a deployment. Different readers guess differently and walk away with different pictures.',
      use: 'a diagram is drawn quickly on a whiteboard and copied into the docs unchanged',
      cost: 'label each arrow with a short verb or protocol ("calls", "reads via SQL", "publishes OrderPlaced") and point it the way the request or data moves',
      ref: 'c4model.com notation guidance; Simon Brown "Software Architecture for Developers"',
      prompt: 'arrows without labels, where a reader has to guess whether each line means calls, depends on, sends data to or deploys to, and which way it points',
      ex: dg(b => {
        const w = b.box(90, 58, 'Web'), a = b.box(200, 58, 'API', 'a'), d = b.db(270, 150, 'DB', 'c'), q = b.box(150, 150, 'Queue'), k = b.box(40, 150, 'Worker');
        b.link(w, a); b.link(a, d); b.link(a, q, { both: true }); b.link(k, q); b.link(k, a, { bend: -8 });
        b.hand(145, 46, '?', { size: 20 }); b.hand(250, 100, '?', { size: 20 }); b.hand(162, 104, '?', { size: 20 }); b.hand(96, 164, '?', { size: 20 }); b.hand(102, 100, '?', { size: 20 });
      }) },

    { id: 'mixedlevels', name: 'Mixed levels of abstraction', aka: 'mixed altitude, zoom-level soup, apples and screws', avoid: true,
      desc: 'One diagram puts a whole business system, a Java class, an EC2 instance and a database table side by side as if they were peers. The reader cannot tell what is inside what or which level the diagram is about.',
      use: 'a diagram grows by accretion, each person adding the detail they care about',
      cost: 'keep one level per diagram (systems, or containers, or components) and link to a zoomed-in view for the detail',
      ref: 'Simon Brown, C4 model (one level per diagram)',
      prompt: 'mixed levels of abstraction, with whole systems, code classes, servers and database tables drawn side by side as peers in one view, so nobody can tell what sits inside what',
      ex: dg(b => {
        const u = b.user(110, 48, 'customer');
        const ps = b.box(240, 50, 'Payment system', 'a', { h: 36 });
        const oc = b.box(110, 124, 'OrderController', 'n', { sub: '.java' });
        const ec = b.box(250, 124, 'EC2 i-0ab3', 'c');
        const tb = b.box(250, 176, 'orders table', 'n', { h: 22, r: 0 });
        b.link(u, ps); b.link(ps, oc); b.link(oc, ec); b.link(ec, tb);
        b.hand(84, 178, 'four zoom levels\nin one picture', { size: 14 });
      }) },

    { id: 'rainbow', name: 'Rainbow colors with no meaning', aka: 'decorative color, color for its own sake', avoid: true,
      desc: 'Every box gets a different color because the tool offers them, so color carries no information but readers still look for a pattern in it. Important elements no longer stand out because everything does.',
      use: 'a template or tool assigns colors automatically, or someone wants the slide to look lively',
      cost: 'make everything neutral, then add one or two colors that mean something and say what in a legend',
      ref: 'Edward Tufte on color as information (Envisioning Information); ColorBrewer for palettes that do encode something',
      prompt: 'rainbow colors with no meaning, where every box gets a different color and there is no legend saying what the colors stand for, so readers hunt for a pattern that is not there',
      ex: dg(b => {
        const cs = ['a', 'c', 'd', 'g', 'r', 'b'], ls = ['Web', 'API', 'Auth', 'Cart', 'Billing', 'Email'];
        const ns = ls.map((l, i) => b.box(80 + (i % 3) * 90, 64 + Math.floor(i / 3) * 70, l, cs[i], { w: 70 }));
        b.link(ns[0], ns[1]); b.link(ns[1], ns[2]); b.link(ns[1], ns[4]); b.link(ns[3], ns[4]); b.link(ns[4], ns[5]);
        b.hand(170, 182, 'why is Auth purple?', { size: 16, rot: -2 });
      }) },

    { id: 'walloftext', name: 'Wall of text in boxes', aka: 'paragraphs in shapes, documentation in a box', avoid: true,
      desc: 'Boxes stuffed with sentences or bullet lists describing what each component does, shrunk to a tiny font to fit. The shapes and arrows disappear behind the text, and the diagram becomes a hard-to-read document.',
      use: 'a diagram has to stand in for the design doc, or a reviewer asked for "more detail" on it',
      cost: 'keep box labels to a name and at most a short type line; move descriptions into the text beside the diagram or a numbered key',
      ref: 'Simon Brown\'s C4 element notation (name, type, one short line of description)',
      prompt: 'a wall of text in boxes, with sentences or bullet lists crammed into shapes in a tiny font so the structure disappears behind the words',
      ex: dg(b => {
        rect(b, 18, 38, 132, 128, 'a', { r: 4 });
        b.text(26, 50, 'OrderService', { b: true, a: 'start', size: 10 });
        cr_lines(b, 26, 64, ['Validates the order,', 'checks stock in the', 'warehouse DB, applies', 'discount rules and', 'coupon codes, then', 'calls payments with', 'retries (3x, backoff)', 'and writes an audit…']);
        rect(b, 178, 38, 128, 128, 'c', { r: 4 });
        b.text(186, 50, 'PaymentService', { b: true, a: 'start', size: 10 });
        cr_lines(b, 186, 64, ['Talks to Stripe and', 'Adyen depending on', 'region. Stores tokens', 'not cards. Sends', 'receipts. NOTE: EU', 'flow differs, see', 'wiki page (outdated)', 'and Slack thread…']);
        b.line([[150, 102], [178, 102]]);
        b.hand(160, 186, 'nobody reads this', { size: 16 });
      }) },

    { id: 'iconsoup', name: 'Icon soup', aka: 'logo salad, clip-art architecture, icon-only diagram', avoid: true,
      desc: 'A diagram made mostly of product icons and logos with few or no text labels. Readers have to recognize dozens of tiny symbols, three different cylinders look alike, and nobody can tell which box is your service.',
      use: 'a cloud vendor\'s icon set is the default in the drawing tool, or a diagram is drawn for a marketing slide',
      cost: 'use plain labeled boxes with the product as a small type line ("Orders DB, PostgreSQL"); add an icon only next to a label, never instead of one',
      ref: 'AWS, Azure and Google Cloud architecture icon sets used without labels; c4model.com on notation',
      prompt: 'icon soup: product icons and logos with no text labels, so readers have to recognize small symbols to know what each element is or which one is your own service',
      ex: dg(b => {
        b.raw('<g class="c-a"><path class="nd" d="M96 70 a14 14 0 0 1 4-27 a18 18 0 0 1 34-4 a13 13 0 0 1 14 22 Z"/></g>');
        b.db(196, 54, '', 'c', { w: 30, h: 32 }); b.db(250, 54, '', 'a', { w: 30, h: 32 }); b.db(290, 110, '', 'd', { w: 30, h: 32 });
        b.circle(84, 126, 13, '', 'b', { dash: true }); b.circle(84, 126, 5, '', 'b');
        b.raw('<g class="c-c"><polygon class="nd" points="152,104 138,130 150,130 144,152 164,122 152,122 160,104"/></g>');
        b.hex(214, 132, 16, '', 'g');
        b.raw('<g class="c-n"><rect class="nd" x="230" y="160" width="22" height="18" rx="3"/><path class="ln k" d="M235 160 v-6 a6 6 0 0 1 12 0 v6"/></g>');
        b.user(40, 90, '');
        const L = { none: true };
        b.line([[54, 92], [92, 72]], L); b.line([[150, 58], [178, 56]], L); b.line([[212, 56], [234, 56]], L); b.line([[262, 70], [282, 92]], L);
        b.line([[98, 126], [138, 126]], L); b.line([[164, 128], [196, 132]], L); b.line([[230, 136], [276, 116]], L); b.line([[214, 150], [236, 160]], L);
        b.hand(120, 182, 'which one is the database?', { size: 15 });
      }) },

    { id: 'ambiguousarrows', name: 'Arrows that mean different things', aka: 'overloaded arrows, inconsistent notation, one line many meanings', avoid: true,
      desc: 'The same solid arrow is used for a runtime call, a build dependency, a data flow and a deployment, sometimes pointing the way data moves and sometimes the way control goes. Even with labels, the reader has to reread each line to know what kind of thing it is.',
      use: 'a diagram mixes concerns (runtime, build and deployment) or several people add to it without a shared notation',
      cost: 'give each relationship kind its own line style (solid = sync call, dashed = async event, dotted = deploys to), keep arrow direction consistent, and put the styles in the legend',
      ref: 'UML\'s distinct arrow types for association, dependency and generalization; c4model.com notation checklist',
      prompt: 'arrows that mean different things, where the same line style is used for calls, dependencies, data flows and deployments, and arrow direction is not consistent',
      ex: dg(b => {
        const o = b.box(164, 100, 'Orders', 'a');
        const w = b.box(54, 100, 'Web'), p = b.box(276, 100, 'Payments'), k = b.box(164, 34, 'K8s cluster'), l = b.box(164, 170, 'shared-lib');
        b.link(w, o, { label: 'calls' }); b.link(p, o, { label: 'feeds' }); b.link(o, k, { label: 'deploys to' }); b.link(o, l, { label: 'depends on' });
        b.hand(270, 160, 'same line,\nfour meanings', { size: 15 });
      }) },

    { id: 'stalediagram', name: 'Stale diagram that drifted from reality', aka: 'outdated diagram, diagram rot, the wiki picture', avoid: true,
      desc: 'A diagram that was right when drawn and has not been touched since: it shows a database that was retired and misses the service everyone now depends on. Readers trust it, so it misleads more than having no diagram at all.',
      use: 'the diagram is an exported PNG on a wiki page, with no source file and no owner',
      cost: 'keep the source next to the code, update it in the same pull request as the change, put a date or version on it, or generate it from code and infrastructure',
      ref: 'docs-as-code practice (Write the Docs), Structurizr and diagrams generated from Terraform or Kubernetes',
      prompt: 'a stale diagram with no date, owner or source file, that still shows retired components and misses ones added since it was drawn, so readers trust a picture of a system that no longer exists',
      ex: dg(b => {
        const w = b.box(100, 60, 'Web'), a = b.box(214, 60, 'Monolith API', 'n'), d = b.db(214, 138, 'Oracle', 'n');
        b.link(w, a); b.link(a, d);
        b.x(214, 138, 12);
        b.text(268, 166, 'retired 2023', { sm: true, c: 'r', b: true });
        b.box(92, 132, 'Search', 'r', { dash: true, w: 70 });
        b.text(92, 158, 'exists, not drawn', { sm: true, c: 'r', b: true });
        b.tag(160, 184, 'arch-v2-final.png · 2021', 'n');
        b.hand(286, 24, 'still true?', { size: 15, rot: 4 });
      }) },

    { id: 'decorative3d', name: 'Decorative 3D, shadows and gradients', aka: 'chartjunk, isometric for looks, glossy boxes', avoid: true,
      desc: 'Boxes extruded into 3D blocks, drop shadows, gradients and bevels that carry no information. The depth suggests layering or size that is not there, labels get squeezed onto slanted faces, and it prints and themes badly.',
      use: 'a diagram is made in a presentation tool with effects turned on, or polished for an executive slide',
      cost: 'flat shapes, one stroke weight, no shadows; if depth is real (layers, containment), show it with an exploded view or nested boundaries',
      ref: 'Edward Tufte, "chartjunk" in The Visual Display of Quantitative Information',
      prompt: 'decorative 3D, drop shadows, gradients and bevels on boxes and arrows that add no information, suggest depth or layering that is not there and print badly',
      ex: dg(b => {
        b.raw('<defs><linearGradient id="cr3dg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--d-af)"/><stop offset="1" stop-color="var(--d-a)"/></linearGradient><linearGradient id="cr3dc" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="var(--d-c)"/><stop offset=".5" stop-color="var(--d-cf)"/><stop offset="1" stop-color="var(--d-c)"/></linearGradient></defs>');
        const blk = (x, y, w, h, l) => {
          b.raw(`<rect x="${x + 8}" y="${y + 10}" width="${w}" height="${h}" rx="4" fill="var(--ink)" opacity=".18"/>`);
          b.raw(`<g class="c-a"><polygon class="nd" points="${x},${y} ${x + 14},${y - 12} ${x + w + 14},${y - 12} ${x + w},${y}"/><polygon class="nd" style="fill:var(--c);opacity:.55" points="${x + w},${y} ${x + w + 14},${y - 12} ${x + w + 14},${y + h - 12} ${x + w},${y + h}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#cr3dg)" stroke="var(--d-a)"/></g>`);
          b.text(x + w / 2, y + h / 2, l, { b: true });
        };
        blk(84, 54, 70, 40, 'Web'); blk(84, 140, 70, 40, 'API');
        b.raw('<rect x="236" y="108" width="54" height="64" rx="4" fill="var(--ink)" opacity=".18"/>');
        b.raw('<g class="c-c"><path d="M226 104 a27 8 0 0 1 54 0 V160 a27 8 0 0 1 -54 0 Z" fill="url(#cr3dc)" stroke="var(--d-c)"/><ellipse cx="253" cy="104" rx="27" ry="8" fill="var(--d-cf)" stroke="var(--d-c)"/></g>');
        b.text(253, 134, 'DB', { b: true });
        b.raw('<g class="c-n"><path d="M162 152 H212 V144 L224 156 L212 168 V160 H162 Z" fill="url(#cr3dg)" stroke="var(--d-a)" opacity=".85"/><path d="M113 98 H125 V112 H131 L119 124 L107 112 H113 Z" fill="url(#cr3dg)" stroke="var(--d-a)"/></g>');
        b.hand(250, 40, 'shiny, but\nwhat does it say?', { size: 14 });
      }) }
  ]
});
/* Diagrams as code: tools and formats, keeping diagrams useful */
const co_lines = (b, x, y, ls, o = {}) => ls.forEach((l, i) => b.text(x, y + i * (o.lh || 12), l, { sm: true, mono: true, a: 'start', c: o.c && o.c[i] ? o.c[i] : undefined, b: o.b && o.b[i] }));
// a rough, hand-drawn rectangle: two slightly offset strokes
const co_rough = (b, x, y, w, h, c, k = 0) => {
  const j = (n, s) => r1(Math.sin(n * 12.9898 + s * 78.233 + k) * 1.6);
  const one = s => `M${x + j(1, s)} ${y + j(2, s)} Q${x + w / 2} ${y + j(3, s) - 1.5} ${x + w + j(4, s)} ${y + j(5, s)} Q${x + w + j(6, s) + 1.5} ${y + h / 2} ${x + w + j(7, s)} ${y + h + j(8, s)} Q${x + w / 2} ${y + h + j(9, s) + 1.5} ${x + j(10, s)} ${y + h + j(11, s)} Q${x + j(12, s) - 1.5} ${y + h / 2} ${x + j(1, s)} ${y + j(2, s)}`;
  b.raw(`<g class="c-${c}"><path class="ln k" style="stroke-width:1.5" d="${one(0)}"/><path class="ln k" style="stroke-width:1;opacity:.6" d="${one(1)}"/></g>`);
};
// a fixed-color mini panel used to show the same diagram in light, dark and print
const co_theme = (b, x, y, t) => {
  const P = {
    light: { bg: '#FFFFFF', ln: '#C9CFD8', ink: '#1A1F2B', a: '#2457C9', af: '#DDE6F9', c: '#B5650D', cf: '#FBEBD3', dash: '' },
    dark: { bg: '#161B24', ln: '#3A4352', ink: '#E8ECF3', a: '#86AEF6', af: '#1C2A44', c: '#F0B060', cf: '#3A2A14', dash: '' },
    print: { bg: '#FFFFFF', ln: '#C9CFD8', ink: '#111111', a: '#222222', af: '#FFFFFF', c: '#222222', cf: '#E6E6E6', dash: ' stroke-dasharray="4 3"' }
  }[t];
  const bx = (cx, cy, l, s, f, d = '') => `<rect x="${cx - 30}" y="${cy - 12}" width="60" height="24" rx="4" fill="${f}" stroke="${s}" stroke-width="1.3"${d}/><text x="${cx}" y="${cy}" text-anchor="middle" style="fill:${P.ink};font-weight:700">${l}</text>`;
  const cx = x + 46;
  b.raw(`<g><rect x="${x}" y="${y}" width="92" height="128" rx="6" fill="${P.bg}" stroke="${P.ln}"/>` +
    bx(cx, y + 30, 'API', P.a, P.af) + bx(cx, y + 98, 'Stripe', P.c, P.cf, P.dash) +
    `<path d="M${cx} ${y + 43} V${y + 78}" stroke="${P.ink}" stroke-width="1.3" stroke-dasharray="4 3" fill="none"/><polygon points="${cx},${y + 85} ${cx - 3.6},${y + 78} ${cx + 3.6},${y + 78}" fill="${P.ink}"/>` +
    `<rect x="${cx - 18}" y="${y + 55}" width="36" height="13" rx="3" fill="${P.bg}"/><text x="${cx}" y="${y + 61.5}" text-anchor="middle" class="sm mono" style="fill:${P.ink}">event</text></g>`);
  b.text(cx, y + 142, t, { sm: true, b: true, mono: true });
};

pool.groups.push({
  id: 'tools', title: 'Tools & formats', slot: 'Tool',
  intro: 'Text formats that turn a short description into a drawing, plus the canvas tools people reach for when they want to place things by hand. Pick by where the diagram has to render and who will edit it next.',
  terms: [
    { id: 'mermaid', name: 'Mermaid', aka: 'mermaid.js, mermaid fences',
      desc: 'A Markdown-like text syntax for flowcharts, sequence, state, class, ER and Gantt diagrams, rendered in the browser by a JavaScript library. GitHub, GitLab, Notion, Obsidian and most docs site generators render a ```mermaid fence directly, so the diagram lives in the README.',
      use: 'the diagram belongs in a README, wiki or docs site and should render without a build step',
      cost: 'little control over layout on large graphs; labels with parentheses, colons or quotes break the parser unless quoted, and GitHub may run an older Mermaid version than your docs site',
      ref: 'mermaid.js.org, Knut Sveidqvist (creator), the Mermaid Live Editor at mermaid.live',
      prompt: 'Mermaid source in a ```mermaid fenced block (GitHub renders it inline), using the right diagram keyword (flowchart LR, sequenceDiagram, stateDiagram-v2, erDiagram); short node ids, labels in double quotes whenever they contain spaces, parentheses or colons, and no HTML or custom CSS in labels',
      ex: code(`
{d|\`\`\`}{k|mermaid}
{k|sequenceDiagram}
  {k|participant} {t|U} {k|as} User
  {k|participant} {t|A} {k|as} API
  {k|participant} {t|D} {k|as} Orders DB
  {t|U}{f|->>}{t|A}: {s|POST /orders}
  {t|A}{f|->>}{t|D}: {s|INSERT order}
  {h|{t|D}{f|-->>}{t|A}: {s|order id}}
  {t|A}{f|-->>}{t|U}: {s|201 Created}
{d|\`\`\`}`, 'README.md') },

    { id: 'plantuml', name: 'PlantUML', aka: 'puml, @startuml',
      desc: 'A long-established text language for UML and related diagrams (sequence, component, class, activity, state, deployment) between @startuml and @enduml. It renders through a Java tool or a PlantUML server, and the C4-PlantUML library adds C4 shapes.',
      use: 'you need full UML notation, or your wiki or IDE already has a PlantUML plugin (Confluence, IntelliJ, VS Code, Kroki)',
      cost: 'it needs Java and Graphviz or a server to render, GitHub does not render it natively, and the default styling looks dated without a theme',
      ref: 'plantuml.com, C4-PlantUML (plantuml-stdlib on GitHub), Kroki',
      prompt: 'PlantUML between @startuml and @enduml; declare every actor, component and database with an alias before using it, write arrows as a --> b : label, set left to right direction for flows, and use the C4-PlantUML include for architecture views',
      ex: code(`
{k|@startuml}
{k|left to right direction}
{k|actor} Customer
{k|component} {s|[Web app]} {k|as} {t|web}
{k|component} {s|[Order API]} {k|as} {t|api}
{k|database} {s|"Orders DB"} {k|as} {t|db}
Customer {f|-->} {t|web}
{t|web} {f|-->} {t|api} : {s|HTTPS}
{h|{t|api} {f|-->} {t|db} : {s|SQL}}
{k|@enduml}`, 'orders.puml') },

    { id: 'd2', name: 'D2', aka: 'd2lang, Declarative Diagramming',
      desc: 'A modern text language for diagrams from Terrastruct: nodes and containers as nested blocks, connections as a -> b: label, and shapes like cylinder, person and queue. A single CLI renders SVG or PNG with a choice of layout engines.',
      use: 'architecture and flow diagrams where nesting (clouds, VPCs, teams) matters and you want better default looks than Graphviz',
      cost: 'fewer places render it natively than Mermaid, so you usually commit the SVG too; the layout engine you pick (dagre, ELK, TALA) changes the result',
      ref: 'd2lang.com, Terrastruct, the D2 Playground',
      prompt: 'D2 source with direction: right, boundaries as nested container blocks, shape: cylinder for datastores, every connection written as a -> b: label, and short keys with readable labels; reference nested nodes by their full path like cloud.api',
      ex: code(`
{k|direction}: right
{t|web}: Web app
{t|cloud}: AWS &#123;
  {t|api}: Order API
  {t|db}: Orders &#123;
    {k|shape}: cylinder
  &#125;
  {h|{t|api} {f|->} {t|db}: {s|SQL}}
&#125;
{t|web} {f|->} {t|cloud.api}: {s|HTTPS}`, 'orders.d2') },

    { id: 'graphviz', name: 'Graphviz DOT', aka: 'dot, Graphviz, digraph',
      desc: 'The original graph description language: you list nodes and edges, and a layout engine (dot, neato, fdp) decides where everything goes. Many tools emit DOT, so it is often the output format for generated diagrams.',
      use: 'the graph is generated or large (dependencies, call graphs, state spaces) and automatic layout matters more than a hand-tuned look',
      cost: 'you give up control over positions, wide graphs turn into hairballs, and styling attributes get verbose',
      ref: 'graphviz.org (AT&T Labs, Emden Gansner and Stephen North), terraform graph, Doxygen call graphs',
      prompt: 'Graphviz DOT as a digraph with rankdir=LR, node defaults set once (shape=box, style=rounded), shape=cylinder for datastores, a label on every edge, and subgraph cluster_ blocks with a label for each boundary',
      ex: code(`
{k|digraph} {t|orders} &#123;
  {k|rankdir}={n|LR};
  {k|node} [shape={s|box}, style={s|rounded}];
  {t|web} [label={s|"Web app"}];
  {t|api} [label={s|"Order API"}];
  {t|db}  [label={s|"Orders"}, shape={s|cylinder}];
  {t|web} {f|->} {t|api} [label={s|"HTTPS"}];
  {h|{t|api} {f|->} {t|db}  [label={s|"SQL"}];}
&#125;`, 'orders.dot') },

    { id: 'structurizr', name: 'Structurizr DSL', aka: 'Structurizr, C4 DSL, workspace.dsl',
      desc: 'A text language for the C4 model by Simon Brown: you describe the model once (people, systems, containers and their relationships) and then define views at each zoom level. Every view is drawn from the same model, so names and relationships stay consistent.',
      use: 'you want several C4 diagrams of one system that never disagree with each other',
      cost: 'it only does C4-style software architecture, and you need Structurizr Lite, the cloud service or an export to PlantUML or Mermaid to see it',
      ref: 'Simon Brown, structurizr.com, docs.structurizr.com/dsl, c4model.com',
      prompt: 'Structurizr DSL: one workspace with a model of people, software systems and containers (each with a technology string) and a description on every relationship, then systemContext and container views using include * and autolayout lr',
      ex: code(`
{k|workspace} &#123;
  {k|model} &#123;
    {t|u} = {k|person} {s|"Customer"}
    {t|s} = {k|softwareSystem} {s|"Shop"} &#123;
      {t|web} = {k|container} {s|"Web app"}
      {t|db} = {k|container} {s|"Orders DB"}
    &#125;
    {t|u} {f|->} {t|web} {s|"Places orders"}
    {h|{t|web} {f|->} {t|db} {s|"Reads and writes"}}
  &#125;
&#125;`, 'workspace.dsl') },

    { id: 'excalidraw', name: 'Excalidraw', aka: 'hand-drawn whiteboard, sketchy diagrams, .excalidraw',
      desc: 'An open-source virtual whiteboard that draws everything with a rough, hand-drawn line and a handwritten font. Files are JSON, and exported PNG and SVG can embed the scene so the image opens again for editing.',
      use: 'early design discussions, talks and docs where a sketchy look signals "this is a draft, argue with it"',
      cost: 'the JSON is not readable in a diff, and freehand layout drifts out of alignment; use the grid and keep it to a dozen elements',
      ref: 'excalidraw.com, Rough.js, the Obsidian Excalidraw plugin',
      prompt: 'an Excalidraw-style sketch: rough hand-drawn boxes and arrows, a handwritten font, a dozen elements at most with short labels, one accent color for the important part; if a file is wanted, valid .excalidraw JSON with rectangle, text and arrow elements bound to each other',
      ex: dg(b => {
        co_rough(b, 22, 46, 78, 40, 'n', 1); b.hand(61, 66, 'Browser', { c: 'n', size: 16 });
        co_rough(b, 128, 46, 78, 40, 'a', 2); b.hand(167, 66, 'API', { c: 'a', size: 17 });
        b.raw('<g class="c-a" opacity=".35">' + [0, 1, 2, 3, 4, 5, 6].map(i => `<path class="ln k" style="stroke-width:1" d="M${134 + i * 10} 82 L${146 + i * 10} 50"/>`).join('') + '</g>');
        co_rough(b, 232, 112, 70, 44, 'c', 3); b.hand(267, 134, 'Postgres', { c: 'c', size: 16 });
        co_rough(b, 128, 132, 78, 36, 'n', 4); b.hand(167, 150, 'Worker', { c: 'n', size: 16 });
        b.scribble(102, 62, 126, 64, { c: 'n', bend: -4 });
        b.scribble(208, 76, 244, 110, { c: 'n', bend: -8 });
        b.scribble(166, 90, 168, 128, { c: 'n', bend: 6 });
        b.scribble(208, 150, 230, 144, { c: 'n', bend: 3 });
        b.hand(250, 40, 'does this\nneed a queue?', { c: 'r', size: 14, rot: 4 });
        b.hand(60, 130, 'v0, argue\nwith it', { c: 'n', size: 14, rot: -4 });
      }) },

    { id: 'ascii', name: 'ASCII and box-drawing diagrams', aka: 'ASCII art, text diagrams, Unicode box drawing, comment diagrams',
      desc: 'A diagram typed as plain text with box-drawing characters or plain ASCII, living in a code comment, a commit message or a plain-text README. It shows up wherever the code is read: the editor, the terminal, a diff.',
      use: 'a small structure or flow needs to sit right next to the code it explains, like a buffer layout, a state table or a request path',
      cost: 'it breaks in proportional fonts and when someone edits one line without realigning the rest; keep it small and under 80 columns',
      ref: 'asciiflow.com, Monodraw, svgbob, RFC packet diagrams',
      prompt: 'a plain-text diagram for a code comment using Unicode box-drawing characters (┌ ─ ┐ │ └ ┘ ┬) with ▶ and ▼ for arrowheads, aligned for a monospace font, under 80 columns wide, with short protocol labels beside the lines',
      ex: code(`
{c|// order flow}
{c|//}
// ┌───────┐  {s|HTTPS}  ┌───────┐
// │  {t|Web}  │{f|────────▶}│  {t|API}  │
// └───────┘         └───┬───┘
//                       {f|│} {s|SQL}
//                       {f|▼}
//                  ┌─────────┐
//                  │ {t|Orders}  │
//                  └─────────┘`, 'checkout.ts') },

    { id: 'drawio', name: 'draw.io', aka: 'diagrams.net, mxGraph, .drawio, .drawio.svg',
      desc: 'A free canvas editor with a big shape library (cloud icons, UML, network, BPMN) where you place and connect everything by hand. Files are mxGraph XML, and a .drawio.svg or .drawio.png is both the picture and the editable source.',
      use: 'a diagram needs precise manual layout or vendor icon sets, or people who do not write code will edit it',
      cost: 'XML diffs are unreadable in review and nothing stops drift; save as .drawio.svg next to the docs so it renders and stays editable',
      ref: 'draw.io / diagrams.net (JGraph), the draw.io VS Code extension, the Confluence draw.io app',
      prompt: 'a draw.io diagram as uncompressed mxGraph XML (mxfile, diagram, mxGraphModel, root), each shape an mxCell with vertex="1", a style and mxGeometry, each arrow an mxCell with edge="1" and source and target ids, and labels in the value attribute',
      ex: dg(b => {
        rect(b, 12, 14, 296, 172, 'n', { r: 6 });
        rect(b, 12, 14, 296, 18, 'n', { r: 6 });
        b.text(22, 23, 'File  Edit  View  Arrange', { sm: true, a: 'start' });
        path(b, 'M68 32 V186 M244 32 V186', 'n', 'ln');
        b.text(40, 42, 'Shapes', { sm: true, b: true });
        const g = 'c-n';
        b.raw(`<g class="${g}"><rect class="nd" x="22" y="52" width="16" height="12" rx="2"/><circle class="nd" cx="52" cy="58" r="7"/><polygon class="nd" points="30,72 39,80 30,88 21,80"/><path class="nd" d="M45 74 a7 2.5 0 0 1 14 0 v11 a7 2.5 0 0 1 -14 0 Z"/><rect class="nd" x="22" y="96" width="16" height="12" rx="6"/><polygon class="nd" points="45,108 50,96 60,96 55,108"/></g>`);
        [120, 136, 152].forEach(y => rect(b, 22, y, 38, 6, 'n', { solid: true, op: .35, r: 2 }));
        const a = b.box(108, 70, 'Web', 'n', { w: 54, h: 26 }), c = b.box(198, 70, 'API', 'a', { w: 54, h: 26 }), d = b.db(198, 146, 'DB', 'c', { w: 50, h: 34 });
        b.link(a, c); b.link(c, d);
        b.raw('<g class="c-a"><rect x="168" y="54" width="60" height="32" fill="none" stroke="var(--c)" stroke-dasharray="3 2"/>' + [[168, 54], [228, 54], [168, 86], [228, 86], [198, 54], [198, 86], [168, 70], [228, 70]].map(([x, y]) => `<rect class="solid" x="${x - 2.5}" y="${y - 2.5}" width="5" height="5"/>`).join('') + '</g>');
        b.text(276, 42, 'Format', { sm: true, b: true });
        [['Fill', 'a'], ['Line', 'n'], ['Text', 'n']].forEach(([l, c], i) => { b.text(252, 60 + i * 20, l, { sm: true, a: 'start' }); rect(b, 282, 54 + i * 20, 18, 12, c, { r: 2 }); });
        b.text(276, 172, 'mxGraph', { sm: true, mono: true, mut: true });
      }) }
  ]
});

pool.groups.push({
  id: 'docs', title: 'Keeping diagrams useful', slot: 'Docs practice',
  intro: 'Habits that keep a diagram true and readable after the day it was drawn: where the source lives, who can read it, how it is labeled, and how changes get reviewed.',
  terms: [
    { id: 'docsascode', name: 'Diagram source in the repo', aka: 'docs as code, diagrams as code, versioned diagrams',
      desc: 'The diagram\'s text source sits in the same repository as the code it describes, next to the docs that use it, and CI renders it to SVG. Changing the system and changing its picture happen in the same pull request.',
      use: 'the diagrams describe a codebase that changes every week, and you want them in the same history as the code',
      cost: 'exported images committed without their source, which nobody can update; commit the .mmd, .d2 or .puml (or a .drawio.svg with the source embedded)',
      ref: 'Write the Docs "Docs as Code", arc42, Kroki, GitHub rendering Mermaid in Markdown',
      prompt: 'keep the diagram source as a text file in the repo next to the docs that use it (for example docs/diagrams/checkout.mmd), render it to SVG in CI, and never commit an exported image without its source',
      ex: dg(b => {
        rect(b, 14, 22, 112, 104, 'n', { r: 5 });
        co_lines(b, 22, 36, ['shop/', '├ src/', '├ docs/', '│ ├ arch.md', '│ └ checkout.mmd', '└ ci.yml'], { lh: 15, c: [0, 0, 0, 0, 'a', 0], b: [1, 0, 0, 0, 1, 0] });
        const ci = b.box(172, 74, 'CI', 'n', { sub: 'render' });
        b.line([[126, 74], [146, 74]]);
        rect(b, 220, 34, 88, 80, 'a', { r: 5 });
        b.text(264, 46, 'checkout.svg', { sm: true, mono: true });
        const m1 = b.box(246, 74, '', 'a', { w: 26, h: 16 }), m2 = b.box(286, 74, '', 'a', { w: 26, h: 16 }), m3 = b.box(286, 100, '', 'a', { w: 26, h: 14 });
        b.link(m1, m2); b.link(m2, m3);
        b.link(ci, { x: 264, y: 74, w: 88, h: 80, s: 'r' });
        path(b, 'M24 160 H296', 'n', 'ln');
        [40, 92, 144, 248].forEach(x => b.dot(x, 160, 'n', 4));
        b.dot(196, 160, 'a', 6);
        b.tag(196, 182, 'one PR: code + diagram', 'a');
      }) },

    { id: 'alttext', name: 'Alt text and a text description', aka: 'accessible diagrams, long description, accTitle and accDescr',
      desc: 'Every diagram image gets alt text that says in a sentence or two what it shows, and complex diagrams also get a longer text description nearby listing the parts and how they connect. Screen reader users, search and anyone whose image fails to load get the same information.',
      use: 'always, on any published diagram, and with a longer description when the diagram carries an argument the surrounding text does not repeat',
      cost: 'alt text that only names the picture ("architecture diagram"); say what it shows and the main relationship',
      ref: 'W3C WAI Images Tutorial (complex images), WCAG 2.2 success criterion 1.1.1, Mermaid accTitle and accDescr',
      prompt: 'give each diagram alt text of one or two sentences stating what it shows and its main relationship, plus a longer text description listing the elements and connections for complex diagrams (in Mermaid, use accTitle and accDescr)',
      ex: dg(b => {
        rect(b, 16, 14, 288, 86, 'n', { r: 5 });
        const w = b.box(58, 57, 'Web app', 'n'), a = b.box(178, 57, 'Order API', 'a'), d = b.db(268, 57, 'Postgres', 'c', { w: 62, h: 38 });
        b.link(w, a, { label: 'HTTPS' }); b.link(a, d);
        rect(b, 16, 112, 288, 58, 'a', { r: 5 });
        co_lines(b, 26, 126, ['alt="The web app calls the Order API', '  over HTTPS; the API stores orders', '  in Postgres."'], { lh: 13 });
        b.hand(222, 186, 'what a screen reader hears', { c: 'a', size: 14 });
      }) },

    { id: 'themesafe', name: 'Works in dark mode, print and grayscale', aka: 'theme-safe diagrams, color-blind safe, print-friendly',
      desc: 'The diagram stays readable on a dark background, on a black and white printout and for color blind readers. Meaning is carried by labels, line styles and shapes as well as color, and the background is transparent or follows the theme.',
      use: 'diagrams appear on GitHub, docs sites and slides where readers switch themes, or get printed for a review',
      cost: 'black lines on a transparent PNG that vanish in dark mode, white boxes that glare, and red versus green as the only difference between two states',
      ref: 'GitHub <picture> with prefers-color-scheme in README images, Mermaid neutral and dark themes, WCAG 1.4.1 (use of color)',
      prompt: 'make it readable in light mode, dark mode and grayscale print: no hard-coded white background, text and lines with enough contrast on both, and every color difference repeated with a label, line style or shape',
      ex: dg(b => {
        co_theme(b, 12, 22, 'light'); co_theme(b, 114, 22, 'dark'); co_theme(b, 216, 22, 'print');
        b.hand(160, 190, 'same meaning in all three', { c: 'a', size: 14 });
      }) },

    { id: 'captionstitles', name: 'Title, caption and date', aka: 'figure caption, diagram metadata, as-of date',
      desc: 'A title that states the question the diagram answers, and a caption with its scope, the date or version it reflects and where its source lives. A reader can tell at a glance whether it is the right diagram and whether it is current.',
      use: 'any diagram that leaves the room it was drawn in: docs, slides, incident reports, wiki pages',
      cost: 'titles that name the diagram type ("Architecture diagram") instead of the question, and captions with no date',
      ref: 'figure captions in scientific papers, Structurizr view titles and descriptions, arc42 templates',
      prompt: 'give the diagram a title phrased as the question it answers (for example "How a checkout gets paid") and a one-line caption with its scope, the date or version it reflects and the path to its source file',
      ex: dg(b => {
        b.text(20, 24, 'How a checkout gets paid', { a: 'start', b: true, size: 14 });
        path(b, 'M20 38 H300', 'n', 'ln');
        const c = b.box(62, 88, 'Checkout', 'a'), p = b.box(172, 88, 'Payments', 'a'), s = b.box(270, 88, 'Stripe', 'n', { dash: true });
        b.link(c, p, { label: 'charge' }); b.link(p, s, { label: 'API' });
        path(b, 'M20 132 H300', 'n', 'ln');
        b.text(20, 148, 'Fig. 3  Card payments only, as of 2026-09.', { sm: true, a: 'start' });
        b.text(20, 162, 'Source: docs/diagrams/checkout-pay.d2', { sm: true, a: 'start', mono: true, mut: true });
        b.hand(276, 170, 'still true?', { c: 'r', size: 14, rot: -3 });
        b.scribble(258, 160, 234, 150, { c: 'r', bend: 4 });
      }) },

    { id: 'generated', name: 'Generated from code or infrastructure', aka: 'auto-generated diagrams, living diagrams, reverse-engineered diagrams',
      desc: 'A tool draws the diagram from the real thing: Terraform state, Kubernetes manifests, the import graph of the codebase or the database schema. It cannot drift, because it is regenerated on every build.',
      use: 'the question is what actually exists (dependencies, infrastructure, tables) and the source of truth is machine-readable',
      cost: 'generated diagrams show everything at one level and lay out badly past a few dozen nodes; filter hard, and keep hand-drawn diagrams for intent and explanation',
      ref: 'terraform graph (DOT output), dependency-cruiser, SchemaSpy, Diagrams by mingrammer (cloud diagrams as Python)',
      prompt: 'generate the diagram from the source of truth (Terraform, Kubernetes manifests, the import graph or the database schema) in CI, filtered to the elements that answer the question, and flag the pull request when the committed diagram is out of date',
      ex: dg(b => {
        rect(b, 14, 40, 128, 108, 'n', { r: 5 });
        b.text(22, 52, 'main.tf', { sm: true, mono: true, mut: true, a: 'start' });
        co_lines(b, 22, 72, ['aws_lb.web', 'aws_ecs_service.api', 'aws_db_instance.main', 'aws_s3_bucket.logs'], { lh: 17, c: ['d', 'd', 'd', 'd'] });
        b.line([[146, 94], [218, 94]], { flow: true });
        b.text(182, 82, 'in CI', { sm: true, b: true });
        const lb = b.box(258, 36, 'LB', 'n', { w: 70, h: 26 }), api = b.box(258, 94, 'ECS api', 'a', { w: 70, h: 26 }), db = b.db(258, 156, 'RDS', 'c', { w: 62, h: 36 });
        b.link(lb, api); b.link(api, db);
        b.text(78, 172, 'rebuilt every merge', { sm: true, mut: true });
      }) },

    { id: 'diagramreview', name: 'Review diagram changes in pull requests', aka: 'diagram review, rendered diffs, visual diff',
      desc: 'Diagram changes go through the same pull request review as code, with the rendered before and after in front of the reviewer. A text format makes the diff readable, and a rendered preview lets people comment on the picture itself.',
      use: 'the team relies on the diagrams for onboarding, incident response or design decisions',
      cost: 'reviewers who only see a text diff of a large file; put a rendered before-and-after in the PR, or use GitHub\'s image diff views for committed images',
      ref: 'GitHub image diff (2-up, swipe, onion skin), CODEOWNERS on docs/diagrams, Kroki for rendering in CI',
      prompt: 'treat diagram changes like code: update the diagram source in the same pull request as the change it reflects, include a rendered before-and-after image in the PR description, and give the diagrams a code owner',
      ex: dg(b => {
        rect(b, 12, 12, 296, 24, 'n', { r: 5 });
        b.text(22, 24, '#482  Add search service', { b: true, a: 'start' });
        b.tag(260, 24, 'docs/arch.d2', 'n');
        const w = b.box(60, 74, 'Web'), a = b.box(160, 74, 'API', 'a'), d = b.db(160, 150, 'DB', 'c', { h: 38 });
        const s = b.box(262, 74, '+ Search', 'g');
        b.link(w, a); b.link(a, d); b.link(a, s, { c: 'g', w: 2 });
        b.line([[78, 90], [136, 140]], { dash: true, c: 'r' }); b.x(106, 114, 5);
        b.raw('<g class="c-c"><path class="nd" d="M212 124 H222 L208 88 L238 124 H306 V164 H212 Z"/></g>');
        b.circle(224, 137, 6, '', 'c');
        b.text(236, 137, 'reviewer', { sm: true, b: true, a: 'start' });
        b.text(218, 153, 'sync or async?', { sm: true, a: 'start' });
      }) }
  ]
});

/* ---------- subjects: one page each ---------- */
const WORKBOOK = {};
WORKBOOK.areas = [
  { id: 'structure', title: 'Structure & architecture', preview: 'c4container', blurb: 'What a system is made of and how the parts connect: the four C4 levels, plus class, data, dependency, network and cloud diagrams.', groups: ['c4', 'structural'] },
  { id: 'time', title: 'Interactions over time', preview: 'fragments', blurb: 'Who talks to whom and in what order: sequence diagrams and their notation, state machines, timelines and Gantt charts.', groups: ['sequence', 'statetime'] },
  { id: 'flow', title: 'Process & flow', preview: 'swimlane', blurb: 'How work and data move through steps and people: flowcharts, swimlanes, BPMN, data flow, journey maps and service blueprints.', groups: ['flowcharts', 'journeys'] },
  { id: 'ideas', title: 'Ideas & concepts', preview: 'mindmap', blurb: 'Pictures for thinking rather than systems: mind maps, concept maps, issue trees and fishbones, plus the 2×2s, Venns and pyramids people reach for in a slide.', groups: ['maps', 'frames'] },
  { id: 'craft', title: 'Craft of explaining', preview: 'callouts', blurb: 'What makes any diagram readable: direction, grouping, labels, color with meaning, emphasis, build-ups and callouts, and the mistakes that make people squint.', groups: ['composition', 'techniques', 'pitfalls'] },
  { id: 'code', title: 'Diagrams as code', preview: 'mermaid', blurb: 'The text formats and tools that turn a description into a drawing, and the habits that keep diagrams accurate, accessible and reviewed.', groups: ['tools', 'docs'] }
];
WORKBOOK.recipes = [
  { label: 'Onboarding a new engineer', parts: [['Start with a '], ['system context diagram', 'c4context'], [', then a '], ['container diagram', 'c4container'], [' of the same system, one '], ['zoom level', 'zoomlevels'], [' at a time. Group by team with '], ['boundaries', 'grouping'], [', '], ['label every arrow', 'labeledarrows'], [' with the protocol, and add a '], ['legend', 'legend'], ['. Write it in '], ['Structurizr DSL', 'structurizr'], [' and keep the '], ['source in the repo', 'docsascode'], ['. No '], ['mixed levels of detail', 'mixedlevels'], ['.']] },
  { label: 'Explaining an incident', parts: [['A '], ['timeline', 'timeline'], [' of what happened, then a '], ['sequence diagram', 'sequence'], [' of the failing request with the '], ['failure path', 'seqerror'], [' drawn next to the happy one. Mark the cause with a '], ['callout', 'callouts'], [' and '], ['highlight that one path', 'emphasis'], ['. A '], ['fishbone', 'fishbone'], [' collects the contributing causes. Write it in '], ['Mermaid', 'mermaid'], ['. No '], ['spaghetti', 'spaghetti'], ['.']] },
  { label: 'A process for the ops team', parts: [['A '], ['swimlane diagram', 'swimlane'], [' with one lane per role, '], ['decision diamonds', 'flowchart'], [' for every branch and '], ['numbered steps', 'numbered'], [' that match the runbook. Keep '], ['one reading direction', 'readingdir'], [', left to right. For the customer side, a '], ['service blueprint', 'serviceblueprint'], ['. No '], ['wall of text in the boxes', 'walloftext'], ['.']] },
  { label: 'A strategy slide', parts: [['A '], ['2×2 matrix', 'twobytwo'], [' with honest axis labels, or a '], ['Wardley map', 'wardley'], [' if the question is what to build versus buy. Use '], ['color only where it means something', 'meaningcolor'], [', and '], ['build it up', 'buildup'], [' one quadrant at a time. No '], ['decorative 3D', 'decorative3d'], [' and no '], ['rainbow palette', 'rainbow'], ['.']] },
  { label: 'Teaching how something works', parts: [['Open with an '], ['analogy diagram', 'analogy'], [', then an '], ['exploded view', 'exploded'], [' of the real parts. Show the states as a '], ['state machine', 'statemachine'], [', and compare before and after as '], ['small multiples', 'smallmultiples'], ['. If it lives on the web, make it an '], ['explorable explanation', 'explorable'], [' with '], ['alt text', 'alttext'], [' for each figure.']] }
];
WORKBOOK.xcols = ['Start with', 'When it grows', 'Usual mistake'];
WORKBOOK.xlate = [
  { job: 'What does our system talk to?', note: 'the big picture for anyone', cells: [['c4context', 'boxarrow'], ['c4landscape', 'c4container'], ['iconsoup', 'mixedlevels']] },
  { job: 'What are the parts inside it?', note: 'apps, databases, queues', cells: [['c4container'], ['c4component', 'zoomlevels'], ['spaghetti', 'unlabeledarrows']] },
  { job: 'What happens on one request?', note: 'calls, replies, order', cells: [['sequence', 'activation'], ['fragments', 'seqerror', 'asyncmsg'], ['ambiguousarrows']] },
  { job: 'What states can a thing be in?', note: 'orders, tickets, accounts', cells: [['statemachine'], ['statechart'], ['a flowchart standing in for a state machine']] },
  { job: 'Who does what in this process?', note: 'handoffs between roles', cells: [['swimlane', 'flowchart'], ['bpmn', 'serviceblueprint'], ['walloftext']] },
  { job: 'How does a customer experience it?', note: 'feelings and touchpoints', cells: [['journeymap'], ['serviceblueprint', 'storymap'], ['rainbow']] },
  { job: 'Where does the data go?', note: 'privacy, security, pipelines', cells: [['dataflow', 'pipeline'], ['trustboundary', 'erd'], ['mixedlevels']] },
  { job: 'How do these ideas relate?', note: 'brainstorms and research', cells: [['mindmap', 'affinity'], ['conceptmap', 'issuetree'], ['spaghetti']] },
  { job: 'Why did this go wrong?', note: 'incidents and retros', cells: [['timeline', 'fishbone'], ['sequence', 'callouts'], ['walloftext']] },
  { job: 'Where should we place our bets?', note: 'strategy and priorities', cells: [['twobytwo', 'spectrum'], ['wardley'], ['decorative3d']] },
  { job: 'When will it ship?', note: 'plans and dependencies', cells: [['timeline', 'gantt'], ['gantt', 'storymap'], ['stalediagram']] },
  { job: 'Keep the diagrams true', note: 'docs that age well', cells: [['docsascode', 'mermaid'], ['generated', 'diagramreview'], ['stalediagram']] }
];
WORKBOOK.stacks = ['Mermaid in a GitHub README', 'Mermaid in Notion', 'PlantUML', 'D2', 'Graphviz DOT', 'Structurizr DSL', 'Excalidraw', 'draw.io XML', 'ASCII art in a code comment', 'Hand-written SVG', 'A slide', 'A whiteboard sketch'];
/* ---------- rendering ---------- */
const G = Object.fromEntries(pool.groups.map(g => [g.id, g]));
WORKBOOK.areas = WORKBOOK.areas.map(a => ({ ...a, groups: a.groups.map(id => G[id]).filter(Boolean) })).filter(a => a.groups.length);
const $ = s => document.querySelector(s);
const esc = xe;
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
};
const picks = new Set(store.get('dgw-picks', []));
let fmt = store.get('dgw-fmt', 'design');
const TERMS = {};
WORKBOOK.areas.forEach(a => a.groups.forEach(g => g.terms.forEach(t => TERMS[t.id] = { t, g, a })));
const totalTerms = Object.keys(TERMS).length;
let pendingJump = null;

const cardHTML = (t, g) => `
  <article class="card${t.avoid ? ' avoid' : ''}${picks.has(t.id) ? ' picked' : ''}" id="t-${t.id}" data-search="${esc((t.name + ' ' + (t.aka || '') + ' ' + t.desc + ' ' + (t.ref || '') + ' ' + (t.use || '') + ' ' + g.title).toLowerCase())}">
    <div class="ex" aria-hidden="true">${t.avoid ? '<span class="badge">Avoid</span>' : ''}${t.ex || ''}</div>
    <div class="cbody">
      <h3>${esc(t.name)}</h3>
      ${t.aka ? `<div class="aka">Also called ${esc(t.aka)}</div>` : ''}
      <p class="desc">${esc(t.desc)}</p>
      ${t.use ? `<p class="ref"><b>${t.avoid ? 'Shows up when' : 'Use when'}</b>${esc(t.use)}</p>` : ''}
      ${t.cost ? `<p class="ref cost"><b>${t.avoid ? 'Instead' : 'Watch for'}</b>${esc(t.cost)}</p>` : ''}
      ${t.ref ? `<p class="ref"><b>Think</b>${esc(t.ref)}</p>` : ''}
      <div class="phrase">
        <code id="p-${t.id}">${t.avoid ? 'Avoid ' : ''}${esc(t.prompt)}</code>
        <div class="btns">
          <button type="button" class="btn add" data-add="${t.id}" aria-pressed="${picks.has(t.id)}">${picks.has(t.id) ? 'Added' : (t.avoid ? 'Add to avoid list' : 'Add to prompt')}</button>
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
const emptyMsg = `<p class="empty" id="empty" hidden>Nothing matches that search. Try a plainer word like "arrow", "flow", "boxes" or "timeline".</p>`;
const chip = (id, txt) => TERMS[id] ? `<a class="chip${TERMS[id].t.avoid ? ' avoid' : ''}" href="#${TERMS[id].a.id}" data-jump="${id}"><span>${esc(txt || TERMS[id].t.name)}</span><small>${esc(TERMS[id].t.avoid ? 'Avoid' : TERMS[id].g.slot)}</small></a>` : esc(txt || '');
const link = id => TERMS[id] ? `<a href="#${TERMS[id].a.id}" data-jump="${id}">${esc(TERMS[id].t.name)}</a>` : '';

function renderHome() {
  $('#home').hidden = false; $('#subject').hidden = true; $('#main').innerHTML = '';
  $('#homeCount').textContent = `Workbook · ${totalTerms} cards on ${WORKBOOK.areas.length} pages`;
  $('#recipes').innerHTML = WORKBOOK.recipes.map(r => `<div class="rcp"><div class="eyebrow">${esc(r.label)}</div><p class="sentence">${r.parts.map(([txt, id]) => id ? chip(id, txt) : esc(txt)).join('')}</p></div>`).join('');
  $('#xtable').innerHTML = `<thead><tr><th>The problem</th>${WORKBOOK.xcols.map((c, i) => `<th${i === WORKBOOK.xcols.length - 1 ? ' class="av"' : ''}>${esc(c)}</th>`).join('')}</tr></thead><tbody>` +
    WORKBOOK.xlate.map(r => `<tr><th>${esc(r.job)}<small>${esc(r.note)}</small></th>${r.cells.map((c, i) => `<td${i === r.cells.length - 1 ? ' class="av"' : ''}>${c.map(x => TERMS[x] ? link(x) : `<span>${esc(x)}</span>`).join(' ')}</td>`).join('')}</tr>`).join('') + '</tbody>';
  $('#tiles').innerHTML = WORKBOOK.areas.map(a => `
    <a class="tile" href="#${a.id}">
      <div class="ex" aria-hidden="true">${TERMS[a.preview] ? TERMS[a.preview].t.ex : ''}</div>
      <div class="tbody"><h3>${esc(a.title)}</h3><p>${esc(a.blurb)}</p>
      <div class="tmeta">${a.groups.reduce((n, g) => n + g.terms.length, 0)} cards · ${a.groups.map(g => esc(g.title)).join(' · ')}</div></div>
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
  document.title = `${a.title} · Diagrams Workbook`;
}

function route() {
  const id = location.hash.slice(1);
  const a = WORKBOOK.areas.find(x => x.id === id);
  if (a) renderSubject(a);
  else if (!id || !document.getElementById(id)) { renderHome(); document.title = 'Diagrams Workbook'; }
  else return;
  if (pendingJump) { const j = pendingJump; pendingJump = null; setTimeout(() => jumpTo(j), 60); }
  else if (a || !id) window.scrollTo(0, 0);
}

function collect() {
  const use = [], avoid = [];
  WORKBOOK.areas.forEach(a => a.groups.forEach(g => {
    const ps = g.terms.filter(t => picks.has(t.id));
    const yes = ps.filter(t => !t.avoid), no = ps.filter(t => t.avoid);
    if (yes.length) use.push(`- ${g.slot}: ${yes.map(t => t.prompt).join('; ')}`);
    no.forEach(t => avoid.push(`- ${t.prompt}`));
  }));
  return { use, avoid };
}

function compose() {
  const subj = $('#subject-in').value.trim(), aud = $('#limits-in').value.trim(), tool = $('#stack-in').value.trim();
  const { use, avoid } = collect(), n = [...picks].filter(id => TERMS[id]).length;
  const lines = [];
  if (fmt === 'guide') {
    lines.push('## Diagrams', '', `Diagrams in this project explain ${subj || '[what the project is]'}.`);
    if (aud) lines.push(`Readers: ${aud}.`);
    if (tool) lines.push(`Tool: ${tool}. Diagram source lives in the repo next to the docs it illustrates.`);
    lines.push('', '### Diagram types and conventions we use');
    lines.push(...(use.length ? use : ['- (add diagram types and techniques from the workbook)']));
    if (avoid.length) lines.push('', '### What we avoid', ...avoid);
    lines.push('', '### When you add or change a diagram',
      '- Give it a title that states the question it answers, and a one-line caption with the date or version it reflects.',
      '- One level of abstraction per diagram. If it passes about a dozen boxes, split it into views.',
      '- Label every arrow with what moves along it, and include a legend for any color, line style or shape that carries meaning.',
      '- When the code it describes changes, update the diagram in the same change.');
  } else {
    lines.push(`Make a diagram that explains ${subj || '[what it should explain]'}.`);
    if (aud) lines.push(`Audience: ${aud}. Pitch the level of detail to what they already know.`);
    if (tool) lines.push(`Output: ${tool}. Return source I can paste and render as is.`);
    lines.push('', 'Diagram direction:');
    lines.push(...(use.length ? use : ['- (add diagram types and techniques from the workbook)']));
    if (avoid.length) lines.push('', 'Avoid:', ...avoid);
    lines.push('', 'Before drawing, state in one line the question the diagram answers, then list the elements and relationships you will show and what you are leaving out. Keep one level of abstraction, label every arrow, and add a short legend if color or line style means something. If it needs more than about a dozen elements, propose splitting it into views.');
  }
  return { text: lines.join('\n'), n };
}

function renderTray() {
  const { text, n } = compose();
  $('#out').textContent = text;
  const names = [...picks].filter(id => TERMS[id]).map(id => (TERMS[id].t.avoid ? 'no ' : '') + TERMS[id].t.name);
  $('#count').innerHTML = n
    ? `${n} pick${n > 1 ? 's' : ''}<small>${esc(names.join(' · '))}</small>`
    : `Nothing picked yet<small>Press "Add to prompt" on any card to start</small>`;
  document.querySelectorAll('[data-fmt]').forEach(b => b.setAttribute('aria-pressed', b.dataset.fmt === fmt));
  $('#fmtHint').textContent = fmt === 'guide' ? 'Reusable rules to paste into CLAUDE.md or AGENTS.md.' : 'A one-off ask: draw this diagram.';
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
    const id = add.dataset.add, av = TERMS[id] && TERMS[id].t.avoid;
    picks.has(id) ? picks.delete(id) : picks.add(id);
    store.set('dgw-picks', [...picks]);
    const on = picks.has(id);
    add.setAttribute('aria-pressed', on); add.textContent = on ? 'Added' : (av ? 'Add to avoid list' : 'Add to prompt');
    document.getElementById('t-' + id).classList.toggle('picked', on);
    renderTray(); return;
  }
  const cp = e.target.closest('[data-copy]');
  if (cp) { const el = document.getElementById('p-' + cp.dataset.copy); copyText(el.textContent, cp, el); return; }
  const sk = e.target.closest('[data-stack]');
  if (sk) { $('#stack-in').value = sk.dataset.stack; store.set('dgw-stack', sk.dataset.stack); renderTray(); return; }
  const f = e.target.closest('[data-fmt]');
  if (f) { fmt = f.dataset.fmt; store.set('dgw-fmt', fmt); renderTray(); return; }
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
  picks.clear(); store.set('dgw-picks', []);
  document.querySelectorAll('.card.picked').forEach(c => c.classList.remove('picked'));
  document.querySelectorAll('[data-add]').forEach(b => { b.setAttribute('aria-pressed', 'false'); b.textContent = TERMS[b.dataset.add] && TERMS[b.dataset.add].t.avoid ? 'Add to avoid list' : 'Add to prompt'; });
  renderTray();
});
$('#stacks').innerHTML = WORKBOOK.stacks.map(s => `<button type="button" data-stack="${esc(s)}">${esc(s)}</button>`).join('');
[['subject-in', 'dgw-subject'], ['limits-in', 'dgw-limits'], ['stack-in', 'dgw-stack']].forEach(([id, k]) => {
  const el = document.getElementById(id); el.value = store.get(k, '');
  el.addEventListener('input', () => { store.set(k, el.value); renderTray(); });
});

route();
renderTray();
