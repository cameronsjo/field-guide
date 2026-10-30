// Cards and presets come from data.js, written by scripts/build.py.
const { WB, CARDS, PRESETS } = window.RECIPE_DATA;
const TARGETS = {
  general:{name:"Any chat", lead:s=>s?`I'm working on ${s}.`:"Here's the direction I want.", mid:"Use these named references:"},
  image:{name:"Image", lead:s=>`Create an image of ${s||"[subject]"}.`, mid:"The look, in named references:"},
  ui:{name:"UI design", lead:s=>`Design ${s||"[the screen or page]"}.`, mid:"Use these patterns and treatments:"},
  code:{name:"Code", lead:s=>`Build ${s||"[the system]"}.`, mid:"Follow these patterns, and tell me where one doesn't fit:"},
  writing:{name:"Writing", lead:s=>`Write ${s||"[the piece]"}.`, mid:"Voice, shape and moves:"},
  music:{name:"Music", lead:s=>`Make a track: ${s||"[the song]"}.`, mid:"Sound, in named references:"}
};
const GC = {see:"var(--see)", build:"var(--build)", say:"var(--say)"};
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const load = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

let picks = load("recipe.picks", []).filter(i => CARDS[i]);
let target = load("recipe.target", "general");
let wb = -1, limit = 48;
$("#subject").value = load("recipe.subject", "");

const KEY = {};
// Cards are found by workbook + subject + name; a few names repeat across subjects in one workbook.
// Styles saved before subjects were stored fall back to workbook + name (first match).
CARDS.forEach((c, i) => {
  const slug = WB[c[0]].slug;
  KEY[slug + "|" + c[1] + "|" + c[2]] = i;
  if (!(slug + "|" + c[2] in KEY)) KEY[slug + "|" + c[2]] = i;
});
let styles = [], activeStyle = null;
CARDS.forEach(c => { c.hay = (c[2] + " " + c[3] + " " + c[4] + " " + c[5] + " " + c[1]).toLowerCase(); });
const color = i => GC[WB[CARDS[i][0]].group];

function cardHTML(i){
  const [w, sub, name, aka, desc, phrase] = CARDS[i];
  const on = picks.includes(i);
  return `<article class="card${on ? " picked" : ""}" style="--c:${color(i)}">
    <div class="src">${esc(WB[w].title)} · ${esc(sub)}</div>
    <h3>${esc(name)}</h3>
    <p title="${esc(desc)}">${esc(desc)}</p>
    <code>${esc(phrase)}</code>
    <button class="add" data-i="${i}" aria-pressed="${on}">${on ? "Added" : "Add"}</button>
  </article>`;
}

function matches(){
  const words = $("#q").value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const out = [];
  for (let i = 0; i < CARDS.length; i++){
    const c = CARDS[i];
    if (wb >= 0 && c[0] !== wb) continue;
    if (words.length && !words.every(w => c.hay.includes(w))) continue;
    out.push(i);
  }
  if (words.length){
    const w0 = words.join(" ");
    out.sort((a, b) => (CARDS[b][2].toLowerCase().includes(w0) ? 1 : 0) - (CARDS[a][2].toLowerCase().includes(w0) ? 1 : 0));
  }
  return out;
}

function renderResults(){
  const m = matches();
  const q = $("#q").value.trim();
  $("#hint").textContent = m.length
    ? `${m.length.toLocaleString()} card${m.length === 1 ? "" : "s"}${q ? ` match “${q}”` : wb >= 0 ? ` in ${WB[wb].title}` : " across all workbooks"}`
    : `Nothing matches “${q}”. Try one word, or a different workbook.`;
  $("#results").innerHTML = m.slice(0, limit).map(cardHTML).join("");
  $("#more").hidden = m.length <= limit;
  $("#more").textContent = `Show more (${(m.length - limit).toLocaleString()} left)`;
}

function brief(){
  if (!picks.length) return "";
  const t = TARGETS[target], s = $("#subject").value.trim();
  const lines = picks.map(i => `- ${CARDS[i][2]}: ${CARDS[i][5]}`);
  const st = styles.find(x => x.id === activeStyle);
  return `${t.lead(s)}${st ? `\nHouse style: ${st.name}.` : ""}\n\n${t.mid}\n${lines.join("\n")}\n\nKeep every choice consistent with these. If two of them pull against each other, tell me which one you favored.`;
}

function styleSheet(){
  const name = activeStyle ? (styles.find(x => x.id === activeStyle) || {}).name : "";
  const by = {};
  picks.forEach(i => { const t = WB[CARDS[i][0]].title; (by[t] = by[t] || []).push(i); });
  let md = `# ${name || "Style sheet"}\n`;
  const s = $("#subject").value.trim(); if (s) md += `\nFor: ${s}\n`;
  for (const [t, ids] of Object.entries(by)){
    md += `\n## ${t}\n` + ids.map(i => `- **${CARDS[i][2]}**: ${CARDS[i][5]}`).join("\n") + "\n";
  }
  return md;
}

function renderStyles(){
  const box = $("#styles");
  if (!styles.length){
    box.innerHTML = `<p class="snote">Build a brief below, then press Save as style. Your styles show up here, ready to drop into the next prompt.</p>`;
    return;
  }
  box.innerHTML = styles.slice().sort((a, b) => (b.updated || 0) - (a.updated || 0)).map(st =>
    `<div class="style${st.id === activeStyle ? " on" : ""}"><button class="load" data-s="${esc(st.id)}"><b>${esc(st.name)}</b><small>${(st.picks || []).length} picks · ${esc((TARGETS[st.target] || TARGETS.general).name)}</small></button><button class="del" data-d="${esc(st.id)}" aria-label="Delete ${esc(st.name)}">Delete</button></div>`).join("");
}

function renderActive(){
  const st = styles.find(x => x.id === activeStyle);
  $("#active").hidden = !st;
  if (st) $("#active").innerHTML = `Working from <b>${esc(st.name)}</b>. Changes stay here until you press Update style.`;
  $("#update").hidden = !st;
}

function loadStyle(st){
  picks = (st.picks || []).map(p => KEY[p.join("|")]).filter(i => i !== undefined);
  target = TARGETS[st.target] ? st.target : "general";
  $("#subject").value = st.subject || ""; save("recipe.subject", $("#subject").value);
  activeStyle = st.id;
  renderBrief(); renderResults(); renderStyles(); renderActive();
}

function styleBody(name){
  return {kind:"style", name, subject:$("#subject").value.trim(), target,
    picks:picks.map(i => [WB[CARDS[i][0]].slug, CARDS[i][1], CARDS[i][2]]), updated:Date.now()};
}

function writeStyle(id, body){
  styles = styles.filter(x => x.id !== id).concat([{id, ...body}]);
  save("recipe.styles", styles); renderStyles();
}
function removeStyle(id){
  styles = styles.filter(x => x.id !== id);
  save("recipe.styles", styles); renderStyles();
}

function flash(btn, text, ms = 1800){
  const old = btn.dataset.label || btn.textContent; btn.dataset.label = old;
  btn.textContent = text; setTimeout(() => { btn.textContent = old; }, ms);
}

function renderBrief(){
  $("#pcount").textContent = `${picks.length} pick${picks.length === 1 ? "" : "s"}`;
  $("#picks").innerHTML = picks.length
    ? picks.map(i => `<li style="--c:${color(i)}"><i></i><span>${esc(CARDS[i][2])} <small style="color:var(--ink3)">· ${esc(WB[CARDS[i][0]].title)}</small></span><button data-rm="${i}" aria-label="Remove ${esc(CARDS[i][2])}">×</button></li>`).join("")
    : `<li class="none" style="background:none;padding:0">Press Add on any card, or start from a recipe above.</li>`;
  $("#out").textContent = brief() || "Your brief appears here.";
  $("#targets").innerHTML = Object.entries(TARGETS).map(([k, v]) => `<button class="tg" data-t="${k}" aria-pressed="${k === target}">${v.name}</button>`).join("");
  save("recipe.picks", picks); save("recipe.target", target);
}

function toggle(i){
  picks = picks.includes(i) ? picks.filter(x => x !== i) : [...picks, i];
  renderBrief();
  document.querySelectorAll(`.add[data-i="${i}"]`).forEach(b => {
    const on = picks.includes(i);
    b.setAttribute("aria-pressed", on); b.textContent = on ? "Added" : "Add";
    b.closest(".card").classList.toggle("picked", on);
  });
}

$("#count").textContent = `${CARDS.length.toLocaleString()} cards from ${WB.length} workbooks`;
$("#wbs").innerHTML = [`<button class="wb" data-w="-1" aria-pressed="true">All</button>`, ...WB.map((w, i) => `<button class="wb" data-w="${i}" aria-pressed="false">${esc(w.title)}</button>`)].join("");
$("#presets").innerHTML = PRESETS.map((p, i) => `<button class="preset" data-p="${i}"><b>${esc(p.name)}</b><small>${esc(p.blurb)}</small></button>`).join("");

$("#wbs").addEventListener("click", e => {
  const b = e.target.closest(".wb"); if (!b) return;
  wb = +b.dataset.w; limit = 48;
  document.querySelectorAll(".wb").forEach(x => x.setAttribute("aria-pressed", x === b));
  renderResults();
});
$("#q").addEventListener("input", () => { limit = 48; renderResults(); });
$("#more").addEventListener("click", () => { limit += 48; renderResults(); });
$("#results").addEventListener("click", e => { const b = e.target.closest(".add"); if (b) toggle(+b.dataset.i); });
$("#picks").addEventListener("click", e => { const b = e.target.closest("[data-rm]"); if (b) toggle(+b.dataset.rm); });
$("#targets").addEventListener("click", e => { const b = e.target.closest(".tg"); if (b){ target = b.dataset.t; renderBrief(); } });
$("#subject").addEventListener("input", () => { save("recipe.subject", $("#subject").value); $("#out").textContent = brief() || "Your brief appears here."; });
$("#presets").addEventListener("click", e => {
  const b = e.target.closest(".preset"); if (!b) return;
  const p = PRESETS[+b.dataset.p];
  activeStyle = null; renderStyles(); renderActive();
  picks = p.cards.slice(); target = p.target; $("#subject").value = p.subject; save("recipe.subject", p.subject);
  renderBrief(); renderResults();
  if (matchMedia("(max-width:960px)").matches){ $("#brief").classList.add("open"); $("#toggle").setAttribute("aria-expanded", "true"); $("#toggle").textContent = "Hide brief"; }
});
$("#toggle").addEventListener("click", () => {
  const open = $("#brief").classList.toggle("open");
  $("#toggle").setAttribute("aria-expanded", open); $("#toggle").textContent = open ? "Hide brief" : "Show brief";
});
$("#clear").addEventListener("click", () => { picks = []; activeStyle = null; renderBrief(); renderResults(); renderStyles(); renderActive(); });
$("#styles").addEventListener("click", async e => {
  const l = e.target.closest(".load");
  if (l){ const st = styles.find(x => x.id === l.dataset.s); if (st) loadStyle(st); return; }
  const d = e.target.closest(".del"); if (!d) return;
  if (!d.classList.contains("sure")){ d.classList.add("sure"); d.textContent = "Delete?"; setTimeout(() => { d.classList.remove("sure"); d.textContent = "Delete"; }, 3000); return; }
  try { await removeStyle(d.dataset.d); if (activeStyle === d.dataset.d){ activeStyle = null; renderActive(); } }
  catch { d.textContent = "Couldn't delete"; }
});
$("#save").addEventListener("click", () => {
  if (!picks.length){ flash($("#save"), "Pick a card first"); return; }
  $("#saveform").hidden = false; $("#sname").value = $("#subject").value.trim().slice(0, 60); $("#sname").focus(); $("#sname").select();
});
$("#scancel").addEventListener("click", () => { $("#saveform").hidden = true; });
async function doSave(){
  const name = $("#sname").value.trim();
  if (!name){ $("#sname").focus(); return; }
  const id = "style-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  try { await writeStyle(id, styleBody(name)); activeStyle = id; $("#saveform").hidden = true; renderStyles(); renderActive(); flash($("#save"), "Saved"); }
  catch { flash($("#sdo"), "Couldn't save, try again"); }
}
$("#sdo").addEventListener("click", doSave);
$("#sname").addEventListener("keydown", e => { if (e.key === "Enter") doSave(); if (e.key === "Escape") $("#saveform").hidden = true; });
$("#update").addEventListener("click", async () => {
  const st = styles.find(x => x.id === activeStyle); if (!st) return;
  try { await writeStyle(st.id, styleBody(st.name)); flash($("#update"), "Updated"); }
  catch { flash($("#update"), "Couldn't update"); }
});
$("#sheet").addEventListener("click", async () => {
  const b = $("#sheet");
  if (!picks.length){ flash(b, "Pick a card first"); return; }
  try { await navigator.clipboard.writeText(styleSheet()); flash(b, "Copied"); }
  catch { $("#out").textContent = styleSheet(); flash(b, "Shown above, copy it"); }
});
$("#copy").addEventListener("click", async () => {
  const text = brief(), b = $("#copy");
  if (!text){ b.textContent = "Pick a card first"; setTimeout(() => b.textContent = "Copy brief", 1600); return; }
  try { await navigator.clipboard.writeText(text); b.textContent = "Copied"; b.classList.add("done"); }
  catch { const r = document.createRange(); r.selectNodeContents($("#out")); getSelection().removeAllRanges(); getSelection().addRange(r); b.textContent = "Selected, press Ctrl+C"; }
  setTimeout(() => { b.textContent = "Copy brief"; b.classList.remove("done"); }, 1800);
});

styles = load("recipe.styles", []);
renderResults(); renderBrief(); renderStyles();
