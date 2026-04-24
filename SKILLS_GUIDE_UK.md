# Гайд: як встановити 85 скілів для Claude Code

Покрокова інструкція для учнів. Після виконання у твоєму репозиторії з'явиться директорія `.claude/skills/` з 85 готовими навичками від Anthropic, Vercel, Supabase та спільноти.

---

## Що таке Skill

**Skill** — це папка з файлом `SKILL.md`, в якому лежить процедурне знання: коли використати, яка логіка, які приклади. Claude Code автоматично підвантажує назву і опис у контекст, а повний текст читає тоді, коли задача відповідає тригерам скіла.

Не плагін. Не розширення. Просто Markdown з інструкціями.

---

## Що потрібно перед стартом

1. **Node.js 18+** (перевір: `node -v`)
2. **Claude Code** встановлений і запущений хоча б раз
3. **Git-репозиторій** — скіли ставляться у `./.claude/skills/` проєкту

---

## Встановлення: одна команда на пакет

Скіли встановлюються утилітою `npx skills` із каталогу [skills.sh](https://skills.sh). Прапорці:

- `-y` — пропустити підтвердження
- `-a claude-code` — тільки для Claude Code
- `-s '*'` — усі скіли з пакета

Виконай ці 8 команд по черзі у корені свого проєкту:

```bash
npx --yes skills add anthropics/skills                       -y -a claude-code -s '*'
npx --yes skills add vercel-labs/agent-skills                -y -a claude-code -s '*'
npx --yes skills add supabase/agent-skills                   -y -a claude-code -s '*'
npx --yes skills add obra/superpowers                        -y -a claude-code -s '*'
npx --yes skills add coreyhaines31/marketingskills           -y -a claude-code -s '*'
npx --yes skills add nextlevelbuilder/ui-ux-pro-max-skill    -y -a claude-code -s '*'
npx --yes skills add qwwiwi/skill-finder                     -y -a claude-code -s '*'
npx --yes skills add EveryInc/charlie-cfo-skill              -y -a claude-code -s '*'
```

Після встановлення Claude Code одразу бачить скіли. Перезапуск не потрібен.

Перевірка:

```bash
ls .claude/skills/ | wc -l   # має бути 85
npx skills list              # покаже встановлені з джерелами
```

## Що саме встановилося: 85 скілів за категоріями

### Маркетинг і продажі — 36 скілів (coreyhaines31/marketingskills)

Повний маркетинговий відділ «під ключ»: від дослідження клієнтів до retention.

| Скіл | Коли використати |
|---|---|
| copywriting | Продавальні тексти за формулами AIDA/PAS |
| seo-audit | Повний аудит сайту під пошуковики |
| ai-seo | SEO під AI-пошук (Perplexity, ChatGPT) |
| programmatic-seo | Масова генерація SEO-сторінок |
| schema-markup | Structured data для Google |
| site-architecture | Структура сайту під SEO та UX |
| aso-audit | ASO-аудит мобільних застосунків |
| content-strategy | Контент-план і стратегія |
| social-content | Пости для соцмереж |
| copy-editing | Редактура текстів |
| email-sequence | Листи для прогріву та продажу |
| cold-email | Холодні листи |
| ad-creative | Рекламні креативи (зокрема через Gemini) |
| paid-ads | Налаштування платної реклами |
| launch-strategy | Стратегія запуску продукту |
| lead-magnets | Лід-магніти |
| free-tool-strategy | Безкоштовні інструменти як канал залучення |
| referral-program | Реферальні програми |
| marketing-ideas | Генерація маркетингових ідей |
| marketing-psychology | Психологія споживача і тригери |
| pricing-strategy | Ціноутворення |
| competitor-alternatives | Сторінки «альтернатива X» |
| customer-research | Дослідження клієнтів, JTBD, інтерв'ю |
| product-marketing-context | Product marketing-брифи |
| analytics-tracking | Налаштування GA4, GTM, подій |
| ab-test-setup | Планування A/B-тестів і розрахунок вибірки |
| signup-flow-cro | Оптимізація реєстрації |
| onboarding-cro | Оптимізація онбордингу |
| page-cro | CRO посадкових сторінок |
| form-cro | Оптимізація форм |
| popup-cro | Оптимізація поп-апів |
| paywall-upgrade-cro | Оптимізація пейволів |
| churn-prevention | Утримання клієнтів, dunning |
| revops | Revenue operations |
| sales-enablement | Матеріали для відділу продажу |

### Фінанси — 1 скіл (EveryInc/charlie-cfo-skill)

| Скіл | Коли використати |
|---|---|
| charlie | AI CFO для bootstrapped стартапів: unit-economics (LTV:CAC), runway, burn multiple, Rule of 40, hiring ROI, working capital. Названий на честь Чарлі Манґера. |

### Дизайн та UI — 14 скілів

Офіційні від Anthropic та Vercel (8):

| Скіл | Джерело | Коли використати |
|---|---|---|
| frontend-design | anthropics | Фронтенд-дизайн за стандартами Anthropic |
| web-design-guidelines | vercel-labs | Веб-дизайн від творців Next.js |
| brand-guidelines | anthropics | Створення брендбуку |
| canvas-design | anthropics | Робота з canvas-графікою |
| theme-factory | anthropics | Генерація тем і колірних схем |
| algorithmic-art | anthropics | Генеративне мистецтво |
| slack-gif-creator | anthropics | Створення GIF для Slack |
| web-artifacts-builder | anthropics | Інтерактивні веб-артефакти |

Пакет nextlevelbuilder/ui-ux-pro-max-skill (7):

| Скіл | Коли використати |
|---|---|
| ui-ux-pro-max | Просунутий UI/UX-дизайн |
| ckm-design | Загальний дизайн CKM-системи |
| ckm-design-system | Побудова дизайн-систем |
| ckm-ui-styling | UI-стилізація |
| ckm-brand | Бренд-контекст |
| ckm-banner-design | Дизайн банерів |
| ckm-slides | Презентації |

### Розробка та DevOps — 22 скіли

Vercel (6):

| Скіл | Коли використати |
|---|---|
| deploy-to-vercel | Деплой на Vercel |
| vercel-cli-with-tokens | Робота з Vercel CLI через токени |
| vercel-composition-patterns | Патерни композиції компонентів |
| vercel-react-best-practices | React best practices від Vercel |
| vercel-react-native-skills | React Native рекомендації |
| vercel-react-view-transitions | View Transitions API |

Supabase (2):

| Скіл | Коли використати |
|---|---|
| supabase | Загальна робота з Supabase |
| supabase-postgres-best-practices | Postgres-практики від Supabase |

Dev workflow від obra/superpowers (14):

| Скіл | Коли використати |
|---|---|
| systematic-debugging | Наукова методологія дебагу |
| test-driven-development | TDD-цикл |
| writing-plans | Написання планів реалізації |
| executing-plans | Виконання плану крок за кроком |
| brainstorming | Структурований мозковий штурм |
| verification-before-completion | Перевірка перед «готово» |
| requesting-code-review | Запит ревʼю |
| receiving-code-review | Обробка коментарів ревʼю |
| finishing-a-development-branch | Завершення гілки |
| using-git-worktrees | Git worktrees для паралельної роботи |
| dispatching-parallel-agents | Паралельні агенти |
| subagent-driven-development | Розробка через субагентів |
| using-superpowers | Мета-скіл: як поєднувати superpowers |
| writing-skills | Як писати якісні скіли (Anthropic best-practices) |

### Робота з документами — 4 скіли (Anthropic)

| Скіл | Коли використати |
|---|---|
| pdf | Читання і створення PDF |
| pptx | Презентації PowerPoint |
| docx | Документи Word |
| xlsx | Таблиці Excel |

### Claude API та інфраструктура — 5 скілів

| Скіл | Джерело | Коли використати |
|---|---|---|
| claude-api | anthropics | Побудова застосунків на Claude API зі SDK |
| mcp-builder | anthropics | Створення MCP-серверів |
| skill-creator | anthropics | Створення власних скілів |
| template-skill | anthropics | Шаблон для нового скіла |
| webapp-testing | anthropics | Тестування веб-застосунків |

### Комунікація — 2 скіли

| Скіл | Коли використати |
|---|---|
| internal-comms | Внутрішні комунікації, анонси, звіти |
| doc-coauthoring | Сумісне написання документів |

### Пошук скілів — 1 скіл

| Скіл | Коли використати |
|---|---|
| skill-finder | Знаходить нові скіли на skills.sh, робить аудит безпеки, дає вердикт. Кажеш: «знайди скіл для Stripe» — і він працює. |

**Підсумок:** 36 маркетинг + 14 дизайн + 22 розробка + 4 офіс + 5 Claude/MCP + 2 комунікації + 1 фінанси + 1 пошук = **85 скілів**.

## Безпека: 5 правил зі статті

1. **Official — перший вибір.** Якщо скіл є від творців технології (Anthropic, Vercel, Supabase) — бери його.
2. **Читай SKILL.md перед встановленням.** Червоні прапорці:
   - `curl`/`wget` на невідомі URL
   - Base64/hex-закодовані рядки
   - Інструкції «ігноруй системний промпт»
   - Запис у `/etc`, `~/.ssh`, `~/.aws`
3. **Перевіряй аудит на skills.sh/audits:** Safe + Low Risk + 0 alerts.
4. **Один за раз** — краще ставити поступово, перевіряти ефект.
5. **Дивись на кількість установок** — 50К+ означає, що скіл перевірено спільнотою.

## Результат аудиту цих 85 скілів (статичний grep)

Перевірено на: `curl`/`wget` на сторонні URL, prompt-injection, `eval()`, base64-декодування, запис у системні директорії, exfiltration (.onion, telegram/discord webhooks, ngrok, pastebin).

**Критичних загроз не знайдено.** Усі `curl`-виклики — до документованих офіційних API (api.anthropic.com, Google Gemini, Supabase, ElevenLabs, Vercel). Всі `rm -rf` — очищення тимчасових `dist`/`$TEMP_DIR`.

**Одне попередження:** `deploy-to-vercel` завантажує tarball проєкту на `https://claude-skills-deploy.vercel.com/api/deploy`. `.env` виключається з архіву (рядок 204 `deploy.sh`), але майте на увазі, що код проєкту піде на сторонній endpoint.

## Як ці скіли працюють на практиці

Скіли не викликаються вручну — Claude Code сам обирає відповідний скіл за описом (`description:` у YAML-фронтматері `SKILL.md`).

Приклади тригерів:

| Твій запит | Який скіл підхопиться |
|---|---|
| «Напиши лендинг для SaaS» | copywriting, page-cro, frontend-design |
| «Проведи SEO-аудит domain.com» | seo-audit, schema-markup |
| «Скільки runway залишилось?» | charlie |
| «Створи PDF-звіт» | pdf |
| «Допоможи задебажити цю помилку» | systematic-debugging |
| «Задеплой на Vercel» | deploy-to-vercel, vercel-cli-with-tokens |
| «Знайди скіл для Stripe» | skill-finder |

## Як видалити скіл

```bash
npx skills remove                         # інтерактивно
npx skills remove -s skill-finder -y      # конкретний
npx skills remove --all -y                # всі
```

## Корисні посилання

- Каталог: [skills.sh](https://skills.sh)
- Лідерборд: [skills.sh](https://skills.sh) (головна)
- Офіційні скіли: [skills.sh/official](https://skills.sh/official)
- Аудит: [skills.sh/audits](https://skills.sh/audits)
- Документація Claude Code Skills: [code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills)

Питання — в чат. Не бійтесь експериментувати: скіли можна видалити однією командою.
