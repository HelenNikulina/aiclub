# Гайд: як встановити 138 скілів для Claude Code

> **Оновлена версія гайду (серпень 2026).** Попередній гайд на 85 скілів лишається без змін у [`SKILLS_GUIDE_UK.md`](SKILLS_GUIDE_UK.md). Тут — 12 пакетів замість 8, нові скіли для анімацій, дизайн-смаку й відео, а також попередження про перейменування маркетингових скілів.


Покрокова інструкція для учнів. Після виконання у твоєму репозиторії з'явиться директорія `.claude/skills/` з готовими навичками від Anthropic, Vercel, Supabase, Remotion та спільноти.

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

Виконай ці 12 команд по черзі у корені свого проєкту:

```bash
npx --yes skills add anthropics/skills                       -y -a claude-code -s '*'
npx --yes skills add vercel-labs/agent-skills                -y -a claude-code -s '*'
npx --yes skills add supabase/agent-skills                   -y -a claude-code -s '*'
npx --yes skills add obra/superpowers                        -y -a claude-code -s '*'
npx --yes skills add coreyhaines31/marketingskills           -y -a claude-code -s '*'
npx --yes skills add nextlevelbuilder/ui-ux-pro-max-skill    -y -a claude-code -s '*'
npx --yes skills add qwwiwi/skill-finder                     -y -a claude-code -s '*'
npx --yes skills add EveryInc/charlie-cfo-skill              -y -a claude-code -s '*'
npx --yes skills add emilkowalski/skill                      -y -a claude-code -s '*'
npx --yes skills add pbakaus/impeccable                      -y -a claude-code -s '*'
npx --yes skills add leonxlnx/taste-skill                    -y -a claude-code -s '*'
npx --yes skills add remotion-dev/skills                     -y -a claude-code -s '*'
```

Після встановлення Claude Code одразу бачить скіли. Перезапуск не потрібен.

**Перевірка:**
```bash
ls .claude/skills/ | wc -l   # має бути 138
npx skills list              # покаже встановлені з джерелами
```

> **Хочеш поставити не весь пакет, а окремі скіли?** Прапорець `-s` **не приймає список через кому** — `-s 'a,b'` мовчки проігнорується і команда просто покаже перелік доступних скілів. Треба повторювати прапорець:
> ```bash
> npx --yes skills add coreyhaines31/marketingskills -y -a claude-code -s sms -s offers -s prospecting
> ```

> ⚠️ **Про перейменування.** У листопаді 2025 пакет `coreyhaines31/marketingskills` перейменував майже всі скіли на короткі назви: `paid-ads`→`ads`, `email-sequence`→`emails`, `page-cro`→`cro`, `signup-flow-cro`→`signup`, `pricing-strategy`→`pricing`, `schema-markup`→`schema`, `social-content`→`social`, `launch-strategy`→`launch`, `analytics-tracking`→`analytics`, `aso-audit`→`aso`, `ab-test-setup`→`ab-testing`, `referral-program`→`referrals`, `free-tool-strategy`→`free-tools`, `competitor-alternatives`→`competitors`, `product-marketing-context`→`product-marketing`, `onboarding-cro`→`onboarding`, `popup-cro`→`popups`, `paywall-upgrade-cro`→`paywalls`. Скіл `form-cro` злився в `cro`.
>
> Якщо ти ставила скіли раніше — у тебе лежать **старі довгі назви**. Вони працюють, але це застаріла версія. Щоб перейти на нові: `npx skills remove -s <стара-назва> -y`, потім постав пакет заново.

---

## Що саме встановилося: 138 скілів за категоріями

### Маркетинг і продажі — 49 скілів (`coreyhaines31/marketingskills`)

Повний маркетинговий відділ «під ключ»: від дослідження клієнтів до retention.

| Скіл | Коли використати |
|---|---|
| `copywriting` | Продавальні тексти за формулами AIDA/PAS |
| `copy-editing` | Редактура текстів |
| `content-strategy` | Контент-план і стратегія |
| `social` | Пости для соцмереж |
| `emails` | Листи для прогріву та продажу |
| `cold-email` | Холодні листи |
| `sms` | SMS/MMS-розсилки: вітальні, кинутий кошик, win-back, комплаєнс |
| `ads` | Налаштування платної реклами (Google, Meta, LinkedIn) |
| `ad-creative` | Рекламні креативи (зокрема через Gemini) |
| `image` | Генерація й оптимізація картинок: Flux, Midjourney, Nano Banana, OG-картинки |
| `video` | Виробництво відео: Remotion, HeyGen, Veo, Sora, Runway, AI-аватари |
| `seo-audit` | Повний аудит сайту під пошуковики |
| `ai-seo` | SEO під AI-пошук (Perplexity, ChatGPT) |
| `programmatic-seo` | Масова генерація SEO-сторінок |
| `schema` | Structured data для Google |
| `site-architecture` | Структура сайту під SEO та UX |
| `aso` | ASO-аудит мобільних застосунків |
| `analytics` | Налаштування GA4, GTM, подій |
| `attribution` | Атрибуція: який канал реально дає гроші, MMM, інкрементальність |
| `ab-testing` | Планування A/B-тестів і розрахунок вибірки |
| `launch` | Стратегія запуску продукту |
| `directory-submissions` | Розміщення в каталогах заради беклінків (Product Hunt, G2, AI-каталоги) |
| `public-relations` | PR і earned media: пітчі журналістам, прес-релізи, newsjacking |
| `influencer-marketing` | Робота з блогерами і креаторами: пошук, умови, брифи, ROI |
| `community-marketing` | Побудова спільноти (Discord/Slack/форум), амбасадори |
| `co-marketing` | Партнерські й спільні кампанії, крос-промо |
| `referrals` | Реферальні програми |
| `lead-magnets` | Лід-магніти |
| `free-tools` | Безкоштовні інструменти як канал залучення |
| `offers` | Конструювання оффера: цінність, бонуси, гарантії, схема оплати |
| `pricing` | Ціноутворення |
| `cro` | Конверсія посадкових сторінок і форм |
| `signup` | Оптимізація реєстрації |
| `onboarding` | Оптимізація онбордингу |
| `popups` | Оптимізація поп-апів |
| `paywalls` | Оптимізація пейволів |
| `churn-prevention` | Утримання клієнтів, dunning |
| `prospecting` | Пошук і кваліфікація лідів, збірка списку для аутріча |
| `sales-enablement` | Матеріали для відділу продажу |
| `revops` | Revenue operations |
| `customer-research` | Дослідження клієнтів, JTBD, інтерв'ю |
| `competitor-profiling` | Глибокі досьє на конкурентів із їхніх URL |
| `competitors` | Сторінки «альтернатива X» і порівняння |
| `product-marketing` | Product marketing-брифи, позиціонування, ICP |
| `marketing-plan` | Повний маркетинг-план по AARRR (13 секцій, під бюджет і стадію) |
| `marketing-ideas` | Генерація маркетингових ідей |
| `marketing-psychology` | Психологія споживача і тригери |
| `marketing-council` | «Рада» з легендарних маркетологів (Годін, Огілві, Шварц, Данфорд, Хормозі) |
| `marketing-loops` | Повторювані маркетингові процеси на автопілоті |

### Фінанси — 1 скіл (`EveryInc/charlie-cfo-skill`)

| Скіл | Коли використати |
|---|---|
| `charlie` | AI CFO для bootstrapped стартапів: unit-economics (LTV:CAC), runway, burn multiple, Rule of 40, hiring ROI, working capital. Названий на честь Чарлі Манґера. |

### Дизайн та UI — 29 скілів

**Офіційні від Anthropic та Vercel (8):**

| Скіл | Джерело | Коли використати |
|---|---|---|
| `frontend-design` | anthropics | Фронтенд-дизайн за стандартами Anthropic |
| `web-design-guidelines` | vercel-labs | Веб-дизайн від творців Next.js |
| `brand-guidelines` | anthropics | Створення брендбуку |
| `canvas-design` | anthropics | Робота з canvas-графікою |
| `theme-factory` | anthropics | Генерація тем і колірних схем |
| `algorithmic-art` | anthropics | Генеративне мистецтво |
| `slack-gif-creator` | anthropics | Створення GIF для Slack |
| `web-artifacts-builder` | anthropics | Інтерактивні веб-артефакти |

**Пакет `nextlevelbuilder/ui-ux-pro-max-skill` (7):**

| Скіл | Коли використати |
|---|---|
| `ui-ux-pro-max` | Просунутий UI/UX-дизайн |
| `ckm-design` | Загальний дизайн CKM-системи |
| `ckm-design-system` | Побудова дизайн-систем |
| `ckm-ui-styling` | UI-стилізація |
| `ckm-brand` | Бренд-контекст |
| `ckm-banner-design` | Дизайн банерів |
| `ckm-slides` | Презентації |

**Дизайн-смак — `pbakaus/impeccable` (1) + `leonxlnx/taste-skill` (13):**

Ці скіли існують для однієї мети: щоб інтерфейс не виглядав «згенерованим AI».

| Скіл | Джерело | Коли використати |
|---|---|---|
| `impeccable` | pbakaus | Головний скіл дизайну і критики UI: ієрархія, доступність, типографіка, спейсинг, колір, мікровзаємодії, темізація, edge-кейси |
| `design-taste-frontend` | leonxlnx | Anti-slop лендинги, портфоліо, редизайни. Сам обирає напрямок за брифом |
| `design-taste-frontend-v1` | leonxlnx | Стара версія попереднього — тільки для сумісності |
| `high-end-visual-design` | leonxlnx | Точні шрифти, тіні, картки й анімації, які роблять сайт «дорогим» |
| `redesign-existing-projects` | leonxlnx | Апгрейд наявного сайту до преміум-рівня без поламаної функціональності |
| `brandkit` | leonxlnx | Преміум бренд-борди, лого-системи, айдентика-деки |
| `gpt-taste` | leonxlnx | Просунута GSAP-анімація + строга AIDA-структура сторінки |
| `stitch-design-taste` | leonxlnx | Генерує `DESIGN.md` для Google Stitch із преміум-стандартами |
| `minimalist-ui` | leonxlnx | Чистий редакторський стиль: тепла монохромність, bento-сітки |
| `industrial-brutalist-ui` | leonxlnx | Швейцарська типографіка + військовий термінал: жорсткі сітки, аналогові дефекти |
| `imagegen-frontend-web` | leonxlnx | Генерація референсних зображень для лендингу — окрема картинка на кожну секцію |
| `imagegen-frontend-mobile` | leonxlnx | Те саме для мобільних застосунків, у рамці телефону |
| `image-to-code` | leonxlnx | Спочатку згенерувати дизайн-картинку, потім зверстати сайт точно по ній |
| `full-output-enforcement` | leonxlnx | Забороняє моделі обрізати код і лишати `// ...` замість реалізації |

### Анімації та полірування UI — 11 скілів (`emilkowalski/skill`)

Від Еміля Ковальського (автора Sonner і Vaul) — філософія «непомітних деталей», через які софт відчувається якісним.

| Скіл | Коли використати |
|---|---|
| `emil-design-eng` | Базовий скіл: полірування UI, дизайн компонентів, рішення про анімацію |
| `animate` | Побудувати анімацію з нуля: чи анімувати взагалі, які властивості, яка крива, як переривати |
| `animate-expo` | Те саме для React Native / Expo: Reanimated, Gesture Handler, хаптика |
| `apple-design` | Підхід Apple до інтерфейсів і фізичного руху, перекладений на веб |
| `review-animations` | Критика вже наявної анімації в дифі |
| `improve-animations` | Аудит анімацій усього кодбейсу + план виправлень |
| `find-animation-opportunities` | Знайти місця, де анімації немає, але вона потрібна |
| `animation-vocabulary` | Зворотний словник: «та пружна штука коли відкривається попап» → *Pop in* |
| `prototype` | Швидкий прототип інтерфейсної ідеї |
| `pick-ui-library` | Вибір UI-бібліотеки під задачу |
| `ask-sonner` | Все про бібліотеку тостів Sonner: підключення, промиси, стилізація, дебаг |

### Відео з коду — 12 скілів (`remotion-dev/skills`)

Remotion — це React для відео. Скіли покривають повний цикл: створення, розмітка, рендер, деплой.

| Скіл | Коли використати |
|---|---|
| `remotion-best-practices` | **Точка входу** — роутер, який сам обирає потрібний remotion-скіл |
| `remotion-create` | Створити новий Remotion-проєкт |
| `remotion-markup` | Контент, анімація й ефекти — основні практики |
| `remotion-captions` | Транскрипція, показ і анімація субтитрів |
| `remotion-multimedia` | Робота з аудіо/відео через Mediabunny |
| `remotion-maps` | Анімація карт |
| `remotion-interactivity` | Інтерактивні відео |
| `remotion-studio` | Прев'ю відео у Remotion Studio |
| `remotion-render` | Експорт готового відео |
| `remotion-saas` | Побудувати SaaS на базі Remotion |
| `remotion-upgrade` | Оновлення Remotion і пов'язаних пакетів |
| `remotion-docs` | Пошук по документації Remotion |

### Розробка та DevOps — 23 скіли

**Vercel (7):**

| Скіл | Коли використати |
|---|---|
| `deploy-to-vercel` | Деплой на Vercel (⚠️ завантажує tarball на claude-skills-deploy.vercel.com — перевір `.env` виключення) |
| `vercel-cli-with-tokens` | Робота з Vercel CLI через токени |
| `vercel-optimize` | Зниження рахунку і прискорення проєкту на Vercel: Function Invocations, Build Minutes, кешування, Core Web Vitals |
| `vercel-composition-patterns` | Патерни композиції компонентів |
| `vercel-react-best-practices` | React best practices від Vercel |
| `vercel-react-native-skills` | React Native рекомендації |
| `vercel-react-view-transitions` | View Transitions API |

**Supabase (2):**

| Скіл | Коли використати |
|---|---|
| `supabase` | Загальна робота з Supabase |
| `supabase-postgres-best-practices` | Postgres-практики від Supabase |

**Dev workflow від `obra/superpowers` (14):**

| Скіл | Коли використати |
|---|---|
| `systematic-debugging` | Наукова методологія дебагу |
| `test-driven-development` | TDD-цикл |
| `writing-plans` | Написання планів реалізації |
| `executing-plans` | Виконання плану крок за кроком |
| `brainstorming` | Структурований мозковий штурм |
| `verification-before-completion` | Перевірка перед «готово» |
| `requesting-code-review` | Запит ревʼю |
| `receiving-code-review` | Обробка коментарів ревʼю |
| `finishing-a-development-branch` | Завершення гілки |
| `using-git-worktrees` | Git worktrees для паралельної роботи |
| `dispatching-parallel-agents` | Паралельні агенти |
| `subagent-driven-development` | Розробка через субагентів |
| `using-superpowers` | Мета-скіл: як поєднувати superpowers |
| `writing-skills` | Як писати якісні скіли (Anthropic best-practices) |

### Робота з документами — 4 скіли (Anthropic)

| Скіл | Коли використати |
|---|---|
| `pdf` | Читання і створення PDF |
| `pptx` | Презентації PowerPoint |
| `docx` | Документи Word |
| `xlsx` | Таблиці Excel |

### Claude API та інфраструктура — 5 скілів

| Скіл | Джерело | Коли використати |
|---|---|---|
| `claude-api` | anthropics | Побудова застосунків на Claude API зі SDK |
| `mcp-builder` | anthropics | Створення MCP-серверів |
| `skill-creator` | anthropics | Створення власних скілів |
| `template-skill` | anthropics | Шаблон для нового скіла |
| `webapp-testing` | anthropics | Тестування веб-застосунків |

### Комунікація і тексти — 3 скіли

| Скіл | Джерело | Коли використати |
|---|---|---|
| `internal-comms` | anthropics | Внутрішні комунікації, анонси, звіти |
| `doc-coauthoring` | anthropics | Сумісне написання документів |
| `writing-guidelines` | vercel-labs | Перевірка документації на відповідність гайдлайнам письма |

### Пошук скілів — 1 скіл

| Скіл | Коли використати |
|---|---|
| `skill-finder` | Знаходить нові скіли на skills.sh, робить аудит безпеки, дає вердикт. Кажеш: «знайди скіл для Stripe» — і він працює. |

**Підсумок:** 49 маркетинг + 29 дизайн + 11 анімації + 12 Remotion + 23 розробка + 4 офіс + 5 Claude/MCP + 3 комунікації + 1 фінанси + 1 пошук = **138 скілів**.

---

## Вбудовані команди — ставити не треба

Це часта плутанина. Наступне — **не скіли з GitHub**, а вбудовані слеш-команди Claude Code. Вони вже є, встановлювати нічого:

`/code-review` · `/simplify` · `/security-review` · `/init` · `/run` · `/loop` · `/update-config` · `/keybindings-help` · `/artifact-design` · `/artifact-diagramming`

Окремої команди `verify` не існує — її роль виконує скіл `verification-before-completion`.

---

## Безпека: 5 правил зі статті

1. **Official — перший вибір.** Якщо скіл є від творців технології (Anthropic, Vercel, Supabase, Remotion) — бери його.
2. **Читай `SKILL.md`** перед встановленням. Червоні прапорці:
   - `curl`/`wget` на невідомі URL
   - Base64/hex-закодовані рядки
   - Інструкції «ігноруй системний промпт»
   - Запис у `/etc`, `~/.ssh`, `~/.aws`
3. **Перевіряй аудит** на [skills.sh/audits](https://skills.sh): Safe + Low Risk + 0 alerts.
4. **Один за раз** — краще ставити поступово, перевіряти ефект.
5. **Дивись на кількість установок** — 50К+ означає, що скіл перевірено спільнотою.

### Результат аудиту (статичний grep)

Перевірено на: `curl`/`wget` на сторонні URL, prompt-injection, `eval()`, base64-декодування, запис у системні директорії, exfiltration (`.onion`, telegram/discord webhooks, ngrok, pastebin).

**Критичних загроз не знайдено.** Усі `curl`-виклики — до документованих офіційних API (api.anthropic.com, Google Gemini, Supabase, ElevenLabs, Vercel). Всі `rm -rf` — очищення тимчасових `dist`/`$TEMP_DIR`.

**Одне попередження:** `deploy-to-vercel` завантажує tarball проєкту на `https://claude-skills-deploy.vercel.com/api/deploy`. `.env` виключається з архіву (рядок 204 `deploy.sh`), але майте на увазі, що код проєкту піде на сторонній endpoint.

> Пакети `emilkowalski/skill`, `pbakaus/impeccable`, `leonxlnx/taste-skill`, `remotion-dev/skills` додані пізніше і тим самим grep-аудитом не проходили в повному обсязі. `remotion-dev/skills` — офіційний пакет команди Remotion.

---

## Як ці скіли працюють на практиці

Скіли **не викликаються вручну** — Claude Code сам обирає відповідний скіл за описом (`description:` у YAML-фронтматері `SKILL.md`).

Приклади тригерів:

| Твій запит | Який скіл підхопиться |
|---|---|
| «Напиши лендинг для SaaS» | `copywriting`, `cro`, `design-taste-frontend`, `impeccable` |
| «Зроби цей інтерфейс дорожчим на вигляд» | `high-end-visual-design`, `impeccable` |
| «Додай анімацію до модалки» | `animate`, `emil-design-eng` |
| «Зроби відео з коду» | `remotion-best-practices` |
| «Проведи SEO-аудит domain.com» | `seo-audit`, `schema` |
| «Який канал реально приносить продажі?» | `attribution`, `analytics` |
| «Скільки runway залишилось?» | `charlie` |
| «Створи PDF-звіт» | `pdf` |
| «Допоможи задебажити цю помилку» | `systematic-debugging` |
| «Задеплой на Vercel» | `deploy-to-vercel`, `vercel-cli-with-tokens` |
| «Чому рахунок за Vercel такий великий?» | `vercel-optimize` |
| «Знайди скіл для Stripe» | `skill-finder` |

---

## Як видалити скіл

```bash
npx skills remove                         # інтерактивно
npx skills remove -s skill-finder -y      # конкретний
npx skills remove --all -y                # всі
```

---

## Корисні посилання

- Каталог: [skills.sh](https://skills.sh)
- Лідерборд: [skills.sh](https://skills.sh) (головна)
- Офіційні скіли: [skills.sh/official](https://skills.sh)
- Аудит: [skills.sh/audits](https://skills.sh)
- Документація Claude Code Skills: [code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills)

---

**Питання — в чат. Не бійтесь експериментувати: скіли можна видалити однією командою.**
