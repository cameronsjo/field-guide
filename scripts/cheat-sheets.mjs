// Render one printable PDF per workbook into docs/cheat-sheets/: every term and its phrase, three columns.
// Usage: npm run cheatsheets   (reads data/vocabulary.json, so run `npm run vocab` first if pages changed)
import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "node:fs";

const root = new URL("..", import.meta.url);
const { workbooks } = JSON.parse(readFileSync(new URL("data/workbooks.json", root)));
const vocab = JSON.parse(readFileSync(new URL("data/vocabulary.json", root)));
const outDir = new URL("docs/cheat-sheets/", root);
mkdirSync(outDir, { recursive: true });

const esc = s => s.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
const accent = { see: "#2B50D8", build: "#1F8A80", say: "#C0532F" };

const browser = await chromium.launch();
for (const b of workbooks) {
  const subjects = vocab[b.slug] ?? [];
  const n = subjects.reduce((a, s) => a + s.cards.length, 0);
  const c = accent[b.group];
  const body = subjects.map(s => `<section><h2>${esc(s.subject)}</h2>${s.cards.map(k =>
    `<p><b>${esc(k.name)}</b> ${esc(k.phrase)}</p>`).join("")}</section>`).join("");
  const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700&family=IBM+Plex+Sans:wght@400;600&display=swap" rel="stylesheet">
<style>
body{font:7.4pt/1.32 "IBM Plex Sans",Arial,sans-serif;color:#161C27;margin:0}
header{display:flex;justify-content:space-between;align-items:baseline;border-bottom:1.5pt solid ${c};padding-bottom:4pt;margin-bottom:6pt}
h1{font:700 17pt "Bricolage Grotesque",Arial,sans-serif;margin:0;letter-spacing:-.01em}
header span{font-size:7.5pt;color:#4B5466}
main{columns:3;column-gap:14pt;column-rule:.5pt solid #DCE1E8}
h2{font:700 9.5pt "Bricolage Grotesque",Arial,sans-serif;color:${c};margin:5pt 0 2pt;break-after:avoid}
section:first-child h2{margin-top:0}
p{margin:0 0 2.6pt;break-inside:avoid;color:#4B5466}
p b{color:#161C27;font-weight:600}
</style></head><body><header><h1>${esc(b.title)}</h1><span>${n} terms · name, then the phrase to paste</span></header><main>${body}</main></body></html>`;
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.pdf({
    path: new URL(`${b.slug}.pdf`, outDir).pathname, format: "Letter", printBackground: true,
    displayHeaderFooter: true, headerTemplate: "<span></span>",
    footerTemplate: `<div style="font:6.5pt Arial;color:#8A93A3;width:100%;text-align:center">${esc(b.title)} · page <span class="pageNumber"></span> of <span class="totalPages"></span></div>`,
    margin: { top: ".45in", bottom: ".5in", left: ".45in", right: ".45in" },
  });
  await page.close();
  console.log(`${b.slug}.pdf`);
}
await browser.close();
