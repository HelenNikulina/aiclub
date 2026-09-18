// Шаг 1. Открывает Chrome с отдельным профилем. Войди в Instagram руками,
// дождись ленты и закрой окно. Cookies сохранятся в config.profileDir.
import { openBrowser } from "./lib.js";
import { config } from "./config.js";

const { ctx, page } = await openBrowser();
await page.goto("https://www.instagram.com/accounts/login/");
console.log("\n=== Войди в Instagram в открывшемся окне. ===");
console.log(`Профиль сохраняется в: ${config.profileDir}`);
console.log("Когда увидишь ленту — просто закрой окно браузера.\n");
await new Promise((resolve) => ctx.on("close", resolve));
console.log("Готово. Дальше: npm run collect");
