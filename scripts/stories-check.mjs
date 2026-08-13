#!/usr/bin/env node
import { chromium } from "playwright";

const BASE = (process.env.STORYBOOK_URL || "http://localhost:6006").replace(/\/+$/, "");
const FILTERS = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const FAIL_FAST = process.argv.includes("--fail-fast");
const WAIT_MS = 1800;
const GOTO_TIMEOUT = 30000;

async function launchBrowser() {
  try {
    return await chromium.launch({ channel: "chrome" });
  } catch {
    return await chromium.launch();
  }
}

async function loadStories() {
  const res = await fetch(`${BASE}/index.json`);
  if (!res.ok) {
    throw new Error(
      `Storybook is not reachable at ${BASE} (HTTP ${res.status}).\n` +
        `Start it first with: npm run storybook`,
    );
  }
  const json = await res.json();
  const stories = Object.values(json.entries).filter((e) => e.type === "story");
  if (FILTERS.length === 0) return stories;
  return stories.filter(
    (s) =>
      FILTERS.some(
        (f) =>
          s.id.toLowerCase().includes(f.toLowerCase()) ||
          s.title.toLowerCase().includes(f.toLowerCase()),
      ),
  );
}

async function checkStory(browser, story) {
  const page = await browser.newPage();
  try {
    await page.goto(`${BASE}/iframe.html?id=${story.id}&viewMode=story`, {
      waitUntil: "domcontentloaded",
      timeout: GOTO_TIMEOUT,
    });
    await page.waitForTimeout(WAIT_MS);
    const failed = await page.evaluate(() => {
      const display = document.querySelector(".sb-errordisplay");
      if (!display) return null;
      const rect = display.getBoundingClientRect();
      const style = getComputedStyle(display);
      if (rect.width === 0 || rect.height === 0 || style.display === "none") return null;
      return { message: (display.innerText || "").replace(/\s+/g, " ").trim().slice(0, 300) };
    });
    if (failed) {
      return { id: story.id, error: failed.message.split(". The component")[0] };
    }
    return null;
  } catch (error) {
    return { id: story.id, error: `load failed: ${error.message.split("\n")[0]}` };
  } finally {
    await page.close().catch(() => {});
  }
}

async function main() {
  let stories;
  try {
    stories = await loadStories();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }

  if (stories.length === 0) {
    console.error(`No stories matched. Checked ${BASE}.`);
    process.exit(1);
  }

  console.log(`Checking ${stories.length} stories against ${BASE}...`);
  const browser = await launchBrowser();
  const failures = [];
  try {
    for (let i = 0; i < stories.length; i++) {
      const result = await checkStory(browser, stories[i]);
      if (result) {
        failures.push(result);
        console.log(`  FAIL ${result.id} :: ${result.error}`);
        if (FAIL_FAST) break;
      } else if ((i + 1) % 20 === 0 || i === stories.length - 1) {
        console.log(`  ...${i + 1}/${stories.length} checked (${failures.length} failed)`);
      }
    }
  } finally {
    await browser.close().catch(() => {});
  }

  const checked = FAIL_FAST && failures.length > 0 ? "aborted early" : "all stories";
  if (failures.length > 0) {
    console.error(
      `\n✖ ${failures.length} of ${stories.length} stories failed to render (${checked}).`,
    );
    process.exit(1);
  }
  console.log(`\n✔ All ${stories.length} stories rendered successfully.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
