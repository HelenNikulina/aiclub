// Все настройки в одном месте. Меняй только здесь.
import path from "node:path";
import os from "node:os";

export const config = {
  // Твой ник в Instagram (без @). Обязательно заполнить.
  username: "ЗАМЕНИ_НА_СВОЙ_НИК",

  // Папка с отдельным профилем Chrome. В него ты один раз залогинишься,
  // дальше cookies сохраняются и вход не нужен.
  profileDir: path.join(os.homedir(), "ig-cleanup-profile"),

  // Использовать установленный Google Chrome (true) или Chromium из Playwright (false).
  // Chrome выглядит для Instagram "естественнее".
  useSystemChrome: true,

  // --- Сбор (collect.js) ---
  // Паузы между открытием профилей, секунды (случайное значение между min и max).
  collectDelaySec: { min: 3, max: 7 },
  // Сколько профилей максимум проверять за один запуск (0 = без лимита).
  collectMaxPerRun: 400,

  // --- Отписка (unfollow.js) ---
  // Пауза между отписками, секунды.
  unfollowDelaySec: { min: 25, max: 70 },
  // Лимиты. Не поднимай: выше — риск блокировки действий.
  unfollowMaxPerHour: 40,
  unfollowMaxPerDay: 120,

  // --- Критерии бота (score.js). Балл >= botThreshold → кандидат. ---
  botThreshold: 3,

  // Файлы
  files: {
    following: "data/following.json",   // все, на кого подписана
    profiles: "data/profiles.json",     // собранные данные по профилям
    candidates: "data/candidates.csv",  // кандидаты на отписку (для проверки глазами)
    approved: "data/approved.txt",      // утверждённый список (по нику в строке)
    log: "data/unfollow-log.json",      // что и когда отписали
  },
};
