#!/usr/bin/env node
/**
 * Genereert printscreens van sjabloon 2 voor visuele controle.
 * Gebruik: npm run build && npm run start & node scripts/capture-sjabloon2-screenshots.mjs
 */
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "reference/sjabloon-2/screenshots");
const port = 3456;
const baseUrl = `http://127.0.0.1:${port}/sjabloon-2-voorbeeld`;

async function waitForServer(url, attempts = 40) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("Server startte niet op tijd");
}

const server = spawn("npx", ["next", "start", "-p", String(port)], {
  cwd: root,
  stdio: "pipe",
  env: { ...process.env, NODE_ENV: "production" },
});

try {
  await waitForServer(baseUrl);
  const { chromium } = await import("playwright");
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1400, height: 2000 },
  });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.waitForSelector(".a4-page");

  await mkdir(outDir, { recursive: true });
  const pages = await page.locator(".a4-page").all();

  for (let i = 0; i < pages.length; i += 1) {
    await pages[i].screenshot({
      path: path.join(outDir, `page-${i + 1}.png`),
    });
  }

  await page.screenshot({
    path: path.join(outDir, "overview.png"),
    fullPage: true,
  });

  await browser.close();
  console.log(`Screenshots opgeslagen in ${outDir} (${pages.length} pagina's)`);
} finally {
  server.kill("SIGTERM");
}
