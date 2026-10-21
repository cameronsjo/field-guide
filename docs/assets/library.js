// Field Guide home: renders the shelves from window.CATALOG (assets/catalog.js, written by scripts/build.py).
const { workbooks: BOOKS, groups } = window.CATALOG;
const GROUP_COLOR = { see: "var(--see)", build: "var(--build)", say: "var(--say)" };
const GROUPS = groups.map(g => ({ ...g, color: GROUP_COLOR[g.key] }));
const GLYPHS = {
  vocab:'<rect x="5" y="9" width="14" height="14" rx="2"/><circle cx="25" cy="13" r="5"/><path d="M21 29l5-9 5 9z"/>',
  ui:'<rect x="4" y="6" width="26" height="22" rx="3"/><path d="M4 12h26M9 17h8M9 22h12"/>',
  color:'<circle cx="12" cy="13" r="7"/><circle cx="22" cy="13" r="7"/><circle cx="17" cy="22" r="7"/>',
  type:'<path d="M5 27L12 7l7 20M8 20h8"/><path d="M23 17c4-3 7-1 7 3v7M30 22c-6-1-8 5-3 5 2 0 3-1 3-3"/>',
  photo:'<rect x="4" y="10" width="26" height="17" rx="3"/><path d="M12 10l2-4h6l2 4"/><circle cx="17" cy="18" r="5"/>',
  art:'<path d="M17 4c7 0 13 5 13 11 0 4-3 5-6 5h-3c-2 0-3 2-2 4 1 3-1 6-4 6C9 30 4 24 4 17S10 4 17 4z"/><circle class="fill" cx="11" cy="15" r="2"/><circle class="fill" cx="16" cy="10" r="2"/><circle class="fill" cx="23" cy="11" r="2"/>',
  motion:'<path d="M4 27C14 27 14 7 30 7"/><circle class="fill" cx="30" cy="7" r="2.6"/><circle class="fill" cx="4" cy="27" r="2.6"/>',
  arch:'<path d="M4 29h26M7 29V13l10-7 10 7v16"/><path d="M14 29v-8h6v8M11 16h3M20 16h3"/>',
  voice:'<path d="M6 7h22v15H15l-6 5v-5H6z"/><path d="M11 13h12M11 17h8"/>',
  music:'<path d="M12 25V8l16-3v17"/><circle cx="9" cy="25" r="3.4"/><circle cx="25" cy="22" r="3.4"/>',
  soft:'<rect x="13" y="4" width="8" height="7" rx="1.5"/><rect x="4" y="23" width="8" height="7" rx="1.5"/><rect x="22" y="23" width="8" height="7" rx="1.5"/><path d="M17 11v6M8 23v-6h18v6"/>',
  prompt:'<rect x="4" y="6" width="26" height="22" rx="3"/><path d="M9 13l4 3-4 3M16 20h8"/>',
  uxw:'<rect x="4" y="12" width="26" height="11" rx="5.5"/><path d="M10 17.5h10"/><path d="M24 26l2 4 1.5-2 2.5.5z"/>',
  brand:'<circle cx="17" cy="15" r="9"/><path d="M13 15l3 3 5-6"/><path d="M8 30h18"/>',
  mat:'<rect x="5" y="5" width="24" height="24" rx="3"/><path d="M5 13c6-3 12 3 24 0M5 21c6-3 12 3 24 0"/>',
  diag:'<rect x="4" y="5" width="10" height="7" rx="1.5"/><rect x="20" y="22" width="10" height="7" rx="1.5"/><circle cx="25" cy="9" r="4"/><path d="M9 12v8h11M25 13v9"/>',
  film:'<rect x="4" y="9" width="26" height="19" rx="2"/><path d="M4 14h26M9 9l3 5M16 9l3 5M23 9l3 5"/>',
  dataviz:'<path d="M5 29h25"/><path d="M8 29V18M14 29V11M20 29V21M26 29V7"/>'
};
const $ = s => document.querySelector(s);
let filter = "all";

function bookHTML(b){
  const g = GROUPS.find(x => x.key === b.group);
  const href = `workbooks/${b.slug}/`;
  const link = new URL(href, location.href).href;
  return `<article class="book" style="--c:${g.color}">
    <div class="glyph" aria-hidden="true"><svg viewBox="0 0 34 34">${GLYPHS[b.glyph]}</svg></div>
    <div class="bbody">
      <h3><a href="${href}">${b.title}</a></h3>
      <p>${b.desc}</p>
      <div class="meta"><span class="use">${b.use}</span><button class="copy" data-url="${link}" aria-label="Copy link to ${b.title}">Copy link</button></div>
    </div>
  </article>`;
}

function render(){
  const q = $("#q").value.trim().toLowerCase();
  const hit = b => (filter === "all" || b.group === filter) &&
    (!q || (b.title + " " + b.desc + " " + b.use + " " + b.keys).toLowerCase().includes(q));
  let html = "", shown = 0;
  for (const g of GROUPS){
    const list = BOOKS.filter(b => b.group === g.key && hit(b));
    if (!list.length) continue;
    shown += list.length;
    html += `<section class="group"><div class="ghead"><h2>${g.name}</h2><p>${g.blurb}</p></div><div class="shelf">${list.map(bookHTML).join("")}</div></section>`;
  }
  $("#shelves").innerHTML = shown ? html : `<p class="empty">No workbook matches “${q.replace(/[<>&]/g,"")}”. Try a broader word, or clear the search.</p>`;
}

const TOOLS = [
  ["recipe/", "Prompt Recipe Builder →", "Search every card at once, copy one brief, and save it as a reusable style."],
  ["cheat-sheets/", "Cheat sheets →", "A printable PDF of every term and phrase, one per workbook."]
];
$("#tools").innerHTML = TOOLS.map(([h, t, d]) => `<a class="tool" href="${h}"><b>${t}</b><span>${d}</span></a>`).join("");
$("#count").textContent = `${BOOKS.length} workbooks`;
$("#filters").innerHTML = [{key:"all",name:"All"}, ...GROUPS].map(g =>
  `<button class="f" data-k="${g.key}" aria-pressed="${g.key === "all"}">${g.name}</button>`).join("");
$("#filters").addEventListener("click", e => {
  const b = e.target.closest(".f"); if (!b) return;
  filter = b.dataset.k;
  document.querySelectorAll(".f").forEach(x => x.setAttribute("aria-pressed", x === b));
  render();
});
$("#q").addEventListener("input", render);
$("#shelves").addEventListener("click", async e => {
  const b = e.target.closest(".copy"); if (!b) return;
  e.preventDefault();
  try { await navigator.clipboard.writeText(b.dataset.url); b.textContent = "Copied"; }
  catch { b.textContent = b.dataset.url; }
  b.classList.add("done");
  setTimeout(() => { b.textContent = "Copy link"; b.classList.remove("done"); }, 1800);
});

const WAYS = [
  ["Bookmark this page", "Every workbook is one click away, in any browser, signed in to nothing."],
  ["Send a teammate one workbook", "Press Copy link on a card and paste it into chat or email. Anyone with the address can open it."],
  ["Save picks as you go", "Picks and saved styles are kept in your own browser, on this device."],
  ["Print a cheat sheet", "Each workbook has a PDF of every term and phrase in the cheat sheets section."]
];
$("#ways").innerHTML = WAYS.map(([t, d]) => `<li><strong>${t}</strong><span>${d}</span></li>`).join("");
$("#foot").innerHTML = 'Built with Claude. <a href="https://github.com/cameronsjo/field-guide">Source on GitHub</a>. Picks you make are saved in your own browser only.';
render();
