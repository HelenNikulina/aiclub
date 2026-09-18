// Шаг 2. Собирает список "Following" и по каждому профилю читает
// счётчики (посты, подписчики, подписки), био и приватность.
// Можно прерывать (Ctrl+C) и запускать снова — продолжит с места остановки.
import { config } from "./config.js";
import {
  openBrowser, assertLoggedIn, dismissPopups, sleepSec,
  readJson, writeJson, parseCount,
} from "./lib.js";

if (config.username.includes("ЗАМЕНИ")) {
  console.error("Сначала впиши свой ник в config.js (поле username).");
  process.exit(1);
}

const { ctx, page } = await openBrowser();
try {
  await assertLoggedIn(page);
  await dismissPopups(page);

  // --- 2a. Список подписок через модальное окно /following/ ---
  let following = readJson(config.files.following, []);
  if (following.length === 0) {
    console.log("Открываю список подписок…");
    await page.goto(`https://www.instagram.com/${config.username}/following/`, {
      waitUntil: "domcontentloaded",
    });
    const dialog = page.locator('div[role="dialog"]');
    await dialog.waitFor({ timeout: 20000 });

    // Скроллим внутренний контейнер модалки, пока список не перестанет расти.
    const seen = new Set();
    let stagnant = 0;
    while (stagnant < 6) {
      const hrefs = await dialog.locator('a[href^="/"]').evaluateAll((as) =>
        as.map((a) => a.getAttribute("href"))
      );
      for (const h of hrefs) {
        const m = h && h.match(/^\/([A-Za-z0-9._]+)\/?$/);
        if (m && !["explore", "reels", "direct", "accounts", "p"].includes(m[1])) seen.add(m[1]);
      }
      const before = seen.size;
      await dialog.evaluate((d) => {
        const scroller = [...d.querySelectorAll("div")].find(
          (el) => el.scrollHeight > el.clientHeight + 50 && getComputedStyle(el).overflowY !== "visible"
        );
        if (scroller) scroller.scrollTop = scroller.scrollHeight;
      });
      await page.waitForTimeout(1500 + Math.random() * 1000);
      stagnant = seen.size === before ? stagnant + 1 : 0;
      process.stdout.write(`\r  собрано ников: ${seen.size}   `);
    }
    following = [...seen].filter((u) => u !== config.username);
    writeJson(config.files.following, following);
    console.log(`\nСписок сохранён: ${following.length} аккаунтов → ${config.files.following}`);
  } else {
    console.log(`Список подписок уже есть (${following.length}). Удали ${config.files.following}, чтобы пересобрать.`);
  }

  // --- 2b. Данные по каждому профилю ---
  const profiles = readJson(config.files.profiles, {});
  const todo = following.filter((u) => !profiles[u]);
  const limit = config.collectMaxPerRun || todo.length;
  console.log(`Осталось проверить профилей: ${todo.length}. В этом запуске: до ${Math.min(limit, todo.length)}.`);

  let done = 0;
  for (const user of todo.slice(0, limit)) {
    await page.goto(`https://www.instagram.com/${user}/`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);

    // Самый стабильный источник счётчиков — meta-теги страницы.
    const og = (await page.locator('meta[property="og:description"]').getAttribute("content").catch(() => null)) || "";
    const desc = (await page.locator('meta[name="description"]').getAttribute("content").catch(() => null)) || "";
    const title = (await page.title().catch(() => "")) || "";
    const bodyText = (await page.locator("body").innerText().catch(() => "")) || "";

    // og:description: "1,234 Followers, 567 Following, 89 Posts - See Instagram photos and videos from Name (@user)"
    const followers = parseCount((og.match(/([\d.,]+\s*[KMkm]?)\s+Followers/) || [])[1]);
    const followingN = parseCount((og.match(/([\d.,]+\s*[KMkm]?)\s+Following/) || [])[1]);
    const posts = parseCount((og.match(/([\d.,]+\s*[KMkm]?)\s+Posts/) || [])[1]);
    const fullName = (og.match(/from\s+(.+?)\s+\(@/) || [])[1] || "";
    // Био в meta description идёт после ' - "' (бывает не всегда).
    const bio = (desc.match(/-\s*"([\s\S]*)"\s*$/) || [])[1] || "";

    profiles[user] = {
      followers, following: followingN, posts, fullName, bio,
      isPrivate: /This account is private|Этот аккаунт закрыт|Це закритий акаунт/i.test(bodyText),
      notFound: /Sorry, this page isn't available|Страница недоступна|Сторінка недоступна/i.test(bodyText) || /Page Not Found/i.test(title),
      checkedAt: new Date().toISOString(),
    };
    done++;
    writeJson(config.files.profiles, profiles);
    console.log(`[${done}/${Math.min(limit, todo.length)}] @${user}: posts=${posts ?? "?"} followers=${followers ?? "?"} following=${followingN ?? "?"}`);
    await sleepSec(config.collectDelaySec.min, config.collectDelaySec.max);
  }
  console.log(`\nГотово. Проверено всего: ${Object.keys(profiles).length}/${following.length}.`);
  if (Object.keys(profiles).length < following.length) console.log("Запусти npm run collect ещё раз, чтобы продолжить.");
  else console.log("Дальше: npm run score");
} finally {
  await ctx.close();
}
