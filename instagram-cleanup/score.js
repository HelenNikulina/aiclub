// Шаг 3. Считает "балл бота" по каждому профилю и пишет кандидатов в CSV.
// Ничего в Instagram не делает — только читает data/profiles.json.
import fs from "node:fs";
import { config } from "./config.js";
import { readJson } from "./lib.js";

const profiles = readJson(config.files.profiles, {});
const rows = [];

for (const [user, p] of Object.entries(profiles)) {
  const reasons = [];
  let score = 0;

  if (p.notFound) { reasons.push("аккаунт удалён/заблокирован"); score += 5; }
  if (p.posts === 0) { reasons.push("0 публикаций"); score += 2; }
  if (p.followers != null && p.followers < 30) { reasons.push("< 30 подписчиков"); score += 1; }
  if (p.followers != null && p.following != null && p.followers > 0 && p.following / p.followers > 10) {
    reasons.push("подписок в 10+ раз больше, чем подписчиков"); score += 2;
  }
  if (p.following != null && p.following > 3000) { reasons.push("> 3000 подписок"); score += 1; }
  if (!p.bio) { reasons.push("пустое био"); score += 1; }
  if (!p.fullName) { reasons.push("нет имени"); score += 1; }
  if (/\d{4,}$/.test(user) || /^[a-z]+[._]?[a-z]+\d{3,}$/.test(user)) { reasons.push("ник с числовым хвостом"); score += 1; }

  rows.push({ user, score, reasons: reasons.join("; "), ...p });
}

rows.sort((a, b) => b.score - a.score);
const candidates = rows.filter((r) => r.score >= config.botThreshold);

const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
const header = ["user", "score", "reasons", "posts", "followers", "following", "fullName", "bio", "isPrivate", "url"];
const csv = [header.join(",")]
  .concat(candidates.map((r) => [r.user, r.score, r.reasons, r.posts, r.followers, r.following, r.fullName, r.bio, r.isPrivate, `https://www.instagram.com/${r.user}/`].map(esc).join(",")))
  .join("\n");
fs.writeFileSync(config.files.candidates, "﻿" + csv);

console.log(`Проверено профилей: ${rows.length}`);
console.log(`Кандидатов на отписку (балл >= ${config.botThreshold}): ${candidates.length}`);
console.log(`Открой ${config.files.candidates} (Excel / Numbers), проверь глазами.`);
console.log(`Кого реально отписать — ники по одному в строке в ${config.files.approved}.`);
console.log(`\nТоп-10:`);
for (const r of candidates.slice(0, 10)) console.log(`  @${r.user} [${r.score}] ${r.reasons}`);
