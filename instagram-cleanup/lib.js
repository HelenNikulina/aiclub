// Общие функции: запуск браузера, паузы, чтение/запись файлов.
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { config } from "./config.js";

export function sleepSec(min, max) {
  const s = min + Math.random() * (max - min);
  return new Promise((r) => setTimeout(r, s * 1000));
}

export function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

export function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

export function readLines(file) {
  try {
    return fs
      .readFileSync(file, "utf8")
      .split(/\r?\n/)
      .map((l) => l.trim().replace(/^@/, ""))
      .filter((l) => l && !l.startsWith("#"));
  } catch {
    return [];
  }
}

// Открывает Chrome с постоянным профилем (cookies сохраняются между запусками).
export async function openBrowser({ headless = false } = {}) {
  const ctx = await chromium.launchPersistentContext(config.profileDir, {
    headless,
    channel: config.useSystemChrome ? "chrome" : undefined,
    viewport: { width: 1280, height: 900 },
    locale: "en-US",
    args: ["--disable-blink-features=AutomationControlled"],
  });
  const page = ctx.pages()[0] ?? (await ctx.newPage());
  return { ctx, page };
}

// Проверка, что мы залогинены: на главной нет формы входа.
export async function assertLoggedIn(page) {
  await page.goto("https://www.instagram.com/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);
  const loginForm = await page.locator('input[name="username"]').count();
  if (loginForm > 0) {
    throw new Error(
      "Не залогинены. Запусти сначала: npm run login — и войди в Instagram в открывшемся окне."
    );
  }
}

// Закрыть всплывашки вида "Turn on notifications?" / "Not now".
export async function dismissPopups(page) {
  for (const name of [/not now/i, /не сейчас/i, /не зараз/i]) {
    const btn = page.getByRole("button", { name });
    if (await btn.count()) {
      await btn.first().click().catch(() => {});
      await page.waitForTimeout(500);
    }
  }
}

// Парсит число вида "1,234" / "12.5K" / "1.2M" / "12 тыс." в целое.
export function parseCount(s) {
  if (s == null) return null;
  const t = String(s).replace(/,/g, "").replace(/\s/g, "").toLowerCase();
  const m = t.match(/([\d.]+)\s*([km]|тыс|млн)?/);
  if (!m) return null;
  let n = parseFloat(m[1]);
  const suf = m[2];
  if (suf === "k" || suf === "тыс") n *= 1_000;
  if (suf === "m" || suf === "млн") n *= 1_000_000;
  return Math.round(n);
}
