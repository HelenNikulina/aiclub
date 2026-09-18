// Шаг 4. Отписывается ТОЛЬКО от ников из data/approved.txt.
// Лимиты в час/день, случайные паузы, лог. Можно прерывать и продолжать.
import { config } from "./config.js";
import {
  openBrowser, assertLoggedIn, dismissPopups, sleepSec, readJson, writeJson, readLines,
} from "./lib.js";

const approved = readLines(config.files.approved);
if (approved.length === 0) {
  console.error(`Файл ${config.files.approved} пуст. Впиши ники (по одному в строке), от кого отписаться.`);
  process.exit(1);
}

const log = readJson(config.files.log, []);
const already = new Set(log.filter((e) => e.ok).map((e) => e.user));
const todo = approved.filter((u) => !already.has(u));
const now = Date.now();
const inLastHour = log.filter((e) => e.ok && now - Date.parse(e.at) < 3600e3).length;
const inLastDay = log.filter((e) => e.ok && now - Date.parse(e.at) < 86400e3).length;
let hourBudget = config.unfollowMaxPerHour - inLastHour;
let dayBudget = config.unfollowMaxPerDay - inLastDay;

console.log(`В списке: ${approved.length}, уже отписаны: ${already.size}, осталось: ${todo.length}.`);
console.log(`Бюджет на сейчас: ${Math.max(0, hourBudget)} в этот час, ${Math.max(0, dayBudget)} сегодня.`);
if (todo.length === 0 || hourBudget <= 0 || dayBudget <= 0) {
  console.log("Сейчас делать нечего. Запусти позже.");
  process.exit(0);
}

const { ctx, page } = await openBrowser();
try {
  await assertLoggedIn(page);
  await dismissPopups(page);

  for (const user of todo) {
    if (hourBudget <= 0 || dayBudget <= 0) {
      console.log("Лимит исчерпан. Запусти позже — продолжит с этого места.");
      break;
    }
    const entry = { user, at: new Date().toISOString(), ok: false, note: "" };
    try {
      await page.goto(`https://www.instagram.com/${user}/`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(2000);

      // Кнопка "Following" (или "Requested" для закрытых аккаунтов) в шапке профиля.
      const followingBtn = page.locator("header").getByRole("button", { name: /^(following|requested|подписки|запрос отправлен|стежите|запит надіслано)$/i });
      if ((await followingBtn.count()) === 0) {
        entry.note = "кнопки Following нет (уже не подписана или страница изменилась)";
        entry.ok = true; // считаем выполненным, чтобы не крутиться на нём
      } else {
        await followingBtn.first().click();
        await page.waitForTimeout(1200);
        const unfollowBtn = page.getByRole("button", { name: /^(unfollow|отменить подписку|отписаться|скасувати підписку|відписатися)$/i });
        await unfollowBtn.first().waitFor({ timeout: 8000 });
        await unfollowBtn.first().click();
        await page.waitForTimeout(1500);
        entry.ok = true;
        hourBudget--; dayBudget--;
      }
      console.log(`✓ @${user} ${entry.note}`);
    } catch (e) {
      entry.note = `ошибка: ${e.message.split("\n")[0]}`;
      console.log(`✗ @${user} ${entry.note}`);
      // Если Instagram показал "Try again later" / "Action blocked" — стоп на сегодня.
      const body = (await page.locator("body").innerText().catch(() => "")) || "";
      if (/try again later|action blocked|попробуйте позже|спробуйте пізніше/i.test(body)) {
        log.push(entry); writeJson(config.files.log, log);
        console.log("\n⚠ Instagram ограничил действия. Остановись минимум на 24 часа.");
        break;
      }
    }
    log.push(entry);
    writeJson(config.files.log, log);
    await sleepSec(config.unfollowDelaySec.min, config.unfollowDelaySec.max);
  }
} finally {
  await ctx.close();
}
const okCount = log.filter((e) => e.ok).length;
console.log(`\nИтого отписано за всё время: ${okCount}/${approved.length}. Лог: ${config.files.log}`);
