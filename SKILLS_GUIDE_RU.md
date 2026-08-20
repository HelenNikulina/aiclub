# Гайд: как установить 85 скилов для Claude Code

Пошаговая инструкция для учеников. После выполнения в твоём репозитории появится директория `.claude/skills/` с 85 готовыми навыками от Anthropic, Vercel, Supabase и сообщества.

---

## Что такое Skill

**Skill** — это папка с файлом `SKILL.md`, в котором лежит процедурное знание: когда использовать, какая логика, какие примеры. Claude Code автоматически подгружает название и описание в контекст, а полный текст читает тогда, когда задача совпадает с триггерами скила.

Не плагин. Не расширение. Просто Markdown с инструкциями.

---

## Что нужно перед стартом

1. **Node.js 18+** (проверь: `node -v`)
2. **Claude Code** установлен и запущен хотя бы раз
3. **Git-репозиторий** — скилы ставятся в `./.claude/skills/` проекта

---

## Установка: одна команда на пакет

Скилы устанавливаются утилитой `npx skills` из каталога [skills.sh](https://skills.sh). Флаги:

- `-y` — пропустить подтверждение
- `-a claude-code` — только для Claude Code
- `-s '*'` — все скилы из пакета

Выполни эти 8 команд по очереди в корне своего проекта:

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

После установки Claude Code сразу видит скилы. Перезапуск не нужен.

Проверка:

```bash
ls .claude/skills/ | wc -l   # должно быть 85
npx skills list              # покажет установленные с источниками
```

## Что именно установилось: 85 скилов по категориям

### Маркетинг и продажи — 36 скилов (coreyhaines31/marketingskills)

Полный маркетинговый отдел «под ключ»: от исследования клиентов до retention.

| Скил | Когда использовать |
|---|---|
| copywriting | Продающие тексты по формулам AIDA/PAS |
| seo-audit | Полный аудит сайта под поисковики |
| ai-seo | SEO под AI-поиск (Perplexity, ChatGPT) |
| programmatic-seo | Массовая генерация SEO-страниц |
| schema-markup | Structured data для Google |
| site-architecture | Структура сайта под SEO и UX |
| aso-audit | ASO-аудит мобильных приложений |
| content-strategy | Контент-план и стратегия |
| social-content | Посты для соцсетей |
| copy-editing | Редактура текстов |
| email-sequence | Письма для прогрева и продажи |
| cold-email | Холодные письма |
| ad-creative | Рекламные креативы (в том числе через Gemini) |
| paid-ads | Настройка платной рекламы |
| launch-strategy | Стратегия запуска продукта |
| lead-magnets | Лид-магниты |
| free-tool-strategy | Бесплатные инструменты как канал привлечения |
| referral-program | Реферальные программы |
| marketing-ideas | Генерация маркетинговых идей |
| marketing-psychology | Психология потребителя и триггеры |
| pricing-strategy | Ценообразование |
| competitor-alternatives | Страницы «альтернатива X» |
| customer-research | Исследование клиентов, JTBD, интервью |
| product-marketing-context | Product marketing-брифы |
| analytics-tracking | Настройка GA4, GTM, событий |
| ab-test-setup | Планирование A/B-тестов и расчёт выборки |
| signup-flow-cro | Оптимизация регистрации |
| onboarding-cro | Оптимизация онбординга |
| page-cro | CRO посадочных страниц |
| form-cro | Оптимизация форм |
| popup-cro | Оптимизация поп-апов |
| paywall-upgrade-cro | Оптимизация пейволов |
| churn-prevention | Удержание клиентов, dunning |
| revops | Revenue operations |
| sales-enablement | Материалы для отдела продаж |

### Финансы — 1 скил (EveryInc/charlie-cfo-skill)

| Скил | Когда использовать |
|---|---|
| charlie | AI CFO для bootstrapped стартапов: unit-economics (LTV:CAC), runway, burn multiple, Rule of 40, hiring ROI, working capital. Назван в честь Чарли Мангера. |

### Дизайн и UI — 14 скилов

Официальные от Anthropic и Vercel (8):

| Скил | Источник | Когда использовать |
|---|---|---|
| frontend-design | anthropics | Фронтенд-дизайн по стандартам Anthropic |
| web-design-guidelines | vercel-labs | Веб-дизайн от создателей Next.js |
| brand-guidelines | anthropics | Создание брендбука |
| canvas-design | anthropics | Работа с canvas-графикой |
| theme-factory | anthropics | Генерация тем и цветовых схем |
| algorithmic-art | anthropics | Генеративное искусство |
| slack-gif-creator | anthropics | Создание GIF для Slack |
| web-artifacts-builder | anthropics | Интерактивные веб-артефакты |

Пакет nextlevelbuilder/ui-ux-pro-max-skill (7):

| Скил | Когда использовать |
|---|---|
| ui-ux-pro-max | Продвинутый UI/UX-дизайн |
| ckm-design | Общий дизайн CKM-системы |
| ckm-design-system | Построение дизайн-систем |
| ckm-ui-styling | UI-стилизация |
| ckm-brand | Бренд-контекст |
| ckm-banner-design | Дизайн баннеров |
| ckm-slides | Презентации |

### Разработка и DevOps — 22 скила

Vercel (6):

| Скил | Когда использовать |
|---|---|
| deploy-to-vercel | Деплой на Vercel |
| vercel-cli-with-tokens | Работа с Vercel CLI через токены |
| vercel-composition-patterns | Паттерны композиции компонентов |
| vercel-react-best-practices | React best practices от Vercel |
| vercel-react-native-skills | React Native рекомендации |
| vercel-react-view-transitions | View Transitions API |

Supabase (2):

| Скил | Когда использовать |
|---|---|
| supabase | Общая работа с Supabase |
| supabase-postgres-best-practices | Postgres-практики от Supabase |

Dev workflow от obra/superpowers (14):

| Скил | Когда использовать |
|---|---|
| systematic-debugging | Научная методология дебага |
| test-driven-development | TDD-цикл |
| writing-plans | Написание планов реализации |
| executing-plans | Выполнение плана шаг за шагом |
| brainstorming | Структурированный мозговой штурм |
| verification-before-completion | Проверка перед «готово» |
| requesting-code-review | Запрос ревью |
| receiving-code-review | Обработка комментариев ревью |
| finishing-a-development-branch | Завершение ветки |
| using-git-worktrees | Git worktrees для параллельной работы |
| dispatching-parallel-agents | Параллельные агенты |
| subagent-driven-development | Разработка через субагентов |
| using-superpowers | Мета-скил: как сочетать superpowers |
| writing-skills | Как писать качественные скилы (Anthropic best-practices) |

### Работа с документами — 4 скила (Anthropic)

| Скил | Когда использовать |
|---|---|
| pdf | Чтение и создание PDF |
| pptx | Презентации PowerPoint |
| docx | Документы Word |
| xlsx | Таблицы Excel |

### Claude API и инфраструктура — 5 скилов

| Скил | Источник | Когда использовать |
|---|---|---|
| claude-api | anthropics | Построение приложений на Claude API со SDK |
| mcp-builder | anthropics | Создание MCP-серверов |
| skill-creator | anthropics | Создание собственных скилов |
| template-skill | anthropics | Шаблон для нового скила |
| webapp-testing | anthropics | Тестирование веб-приложений |

### Коммуникация — 2 скила

| Скил | Когда использовать |
|---|---|
| internal-comms | Внутренние коммуникации, анонсы, отчёты |
| doc-coauthoring | Совместное написание документов |

### Поиск скилов — 1 скил

| Скил | Когда использовать |
|---|---|
| skill-finder | Находит новые скилы на skills.sh, делает аудит безопасности, выдаёт вердикт. Говоришь: «найди скил для Stripe» — и он работает. |

**Итого:** 36 маркетинг + 14 дизайн + 22 разработка + 4 офис + 5 Claude/MCP + 2 коммуникации + 1 финансы + 1 поиск = **85 скилов**.

## Безопасность: 5 правил из статьи

1. **Official — первый выбор.** Если скил есть от создателей технологии (Anthropic, Vercel, Supabase) — бери его.
2. **Читай SKILL.md перед установкой.** Красные флаги:
   - `curl`/`wget` на неизвестные URL
   - Base64/hex-закодированные строки
   - Инструкции «игнорируй системный промпт»
   - Запись в `/etc`, `~/.ssh`, `~/.aws`
3. **Проверяй аудит на skills.sh/audits:** Safe + Low Risk + 0 alerts.
4. **По одному за раз** — лучше ставить постепенно, проверять эффект.
5. **Смотри на количество установок** — 50К+ означает, что скил проверен сообществом.

## Результат аудита этих 85 скилов (статический grep)

Проверено на: `curl`/`wget` на сторонние URL, prompt-injection, `eval()`, base64-декодирование, запись в системные директории, exfiltration (.onion, telegram/discord webhooks, ngrok, pastebin).

**Критических угроз не найдено.** Все `curl`-вызовы — к документированным официальным API (api.anthropic.com, Google Gemini, Supabase, ElevenLabs, Vercel). Все `rm -rf` — очистка временных `dist`/`$TEMP_DIR`.

**Одно предупреждение:** `deploy-to-vercel` загружает tarball проекта на `https://claude-skills-deploy.vercel.com/api/deploy`. `.env` исключается из архива (строка 204 `deploy.sh`), но имейте в виду, что код проекта уйдёт на сторонний endpoint.

## Как эти скилы работают на практике

Скилы не вызываются вручную — Claude Code сам выбирает подходящий скил по описанию (`description:` в YAML-фронтматере `SKILL.md`).

Примеры триггеров:

| Твой запрос | Какой скил подхватится |
|---|---|
| «Напиши лендинг для SaaS» | copywriting, page-cro, frontend-design |
| «Проведи SEO-аудит domain.com» | seo-audit, schema-markup |
| «Сколько runway осталось?» | charlie |
| «Создай PDF-отчёт» | pdf |
| «Помоги задебажить эту ошибку» | systematic-debugging |
| «Задеплой на Vercel» | deploy-to-vercel, vercel-cli-with-tokens |
| «Найди скил для Stripe» | skill-finder |

## Как удалить скил

```bash
npx skills remove                         # интерактивно
npx skills remove -s skill-finder -y      # конкретный
npx skills remove --all -y                # все
```

## Полезные ссылки

- Каталог: [skills.sh](https://skills.sh)
- Лидерборд: [skills.sh](https://skills.sh) (главная)
- Официальные скилы: [skills.sh/official](https://skills.sh/official)
- Аудит: [skills.sh/audits](https://skills.sh/audits)
- Документация Claude Code Skills: [code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills)

Вопросы — в чат. Не бойтесь экспериментировать: скилы можно удалить одной командой.
