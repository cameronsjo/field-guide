// Read every card out of the rendered workbooks into data/vocabulary.json.
// The recipe builder, cheat sheets and search all build on that file.
// Usage: npm run vocab
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const root = new URL("..", import.meta.url);
const { workbooks } = JSON.parse(readFileSync(new URL("data/workbooks.json", root)));

const browser = await chromium.launch();
const out = {};
for (const { slug } of workbooks) {
  const page = await browser.newPage();
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.goto(new URL(`docs/workbooks/${slug}/index.html`, root).href);
  await page.waitForTimeout(400);
  const tiles = await page.$$eval("#tiles a", as => as.map(a => a.getAttribute("href")));
  const subjects = [];
  for (const href of tiles) {
    await page.evaluate(h => { location.hash = h.replace(/^.*#/, "#"); }, href);
    await page.waitForTimeout(200);
    subjects.push(await page.evaluate(() => ({
      subject: document.querySelector("#subTitle")?.textContent.trim() ?? "",
      cards: [...document.querySelectorAll(".group:not([hidden]) .card")].map(c => ({
        name: c.querySelector("h3")?.textContent.trim() ?? "",
        aka: (c.querySelector(".aka")?.textContent.trim() ?? "").replace(/^Also called /, ""),
        desc: c.querySelector(".desc")?.textContent.trim() ?? "",
        phrase: c.querySelector(".phrase code, code")?.textContent.trim() ?? "",
      })),
    })));
  }
  const n = subjects.reduce((a, s) => a + s.cards.length, 0);
  console.log(`${slug.padEnd(24)} ${String(subjects.length).padStart(2)} subjects ${String(n).padStart(4)} cards`);
  out[slug] = subjects;
  await page.close();
}
await browser.close();
writeFileSync(new URL("data/vocabulary.json", root), JSON.stringify(out, null, 1) + "\n");
