# Агент на Claude — настройка с нуля

**Идея.** Один раз — 15 минут в браузере, на сервере. Дальше — **только
разговариваешь с Claude в claude.ai**, и бот сам обновляется.

К серверу больше не возвращаемся.

---

## Что будет в результате

```
Ты говоришь Claude, что хочешь изменить
            ↓
Claude правит код в твоём репозитории на GitHub
            ↓
Сервер сам забирает изменения и перезапускает бота
            ↓
Бот в Telegram уже с новым поведением
```

Никаких терминалов на компьютере. Никаких команд наизусть.

---

# Часть 1. Настраиваем один раз

## Сначала собери 5 ключей

Открой 4 вкладки в браузере и сохрани значения в заметках.

### 1. Токен Telegram-бота

В Telegram открой **[@BotFather](https://t.me/BotFather)** → `/newbot` →
придумай имя и username (`...bot`) → скопируй присланный токен.

### 2. Ключ Anthropic

**[console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)** →
**Create Key** → скопируй ключ сразу (показывается один раз).

Если аккаунт новый — на странице **Billing** пополни хотя бы на $5.

### 3. Репозиторий на GitHub

Регистрация: **[github.com/signup](https://github.com/signup)**.

Потом — **[создать новый репозиторий](https://github.com/new)**:
- **Name:** `my-bot`
- **Private**
- ✅ **Add a README file**

### 4. GitHub-токен

Открой **[github.com/settings/tokens](https://github.com/settings/tokens)** →
справа сверху **Generate new token** → выбери **Generate new token (classic)**.

В форме, которая откроется:

- **Note:** `bot-server`
- **Expiration:** *No expiration*
- **Select scopes:** поставь галочку напротив **`repo`** (галочки внутри —
  `repo:status`, `repo_deployment` и прочие — отметятся сами).
- Прокрути вниз → **Generate token**.

После генерации **сразу скопируй токен** (`ghp_...`) — он показывается один
раз.

### 5. Аккаунт DigitalOcean

Зарегистрируйся по моей ссылке (так у тебя будет **$200 бонуса на 60 дней**):
**[m.do.co/c/8d079274e061](https://m.do.co/c/8d079274e061)** → подтверди
email → привяжи карту.

---

## Создаём сервер

### Шаг A. Открой меню создания

В панели DigitalOcean справа сверху зелёная кнопка **Create** → **Droplets**.

![Меню Create → Droplets](https://github.com/user-attachments/assets/1cdeb3fa-389c-4b64-a271-58a85c08f1fe)

### Шаг B. Выбери регион и систему

- **Region:** Frankfurt или Amsterdam (ближайший к тебе).
- **OS:** **Ubuntu 24.04 (LTS) x64** (по умолчанию отмечен как *RECOMMENDED*).

![Выбор региона Amsterdam и Ubuntu 24.04](https://github.com/user-attachments/assets/17984969-4d45-4998-8fe9-3fb773a10866)

### Шаг C. Выбери план

- Вкладка **Basic** (Shared CPU).
- **CPU Options:** *Regular* (Disk Type: SSD).
- **Select a Plan:** **$6/мес** (1 vCPU, 1 GB RAM, 25 GB SSD,
  1000 GB Transfer).

![Выбор плана Basic Regular $6/мес](https://github.com/user-attachments/assets/947e66b2-0a6f-4a1a-a620-ae55d62d06e2)

### Шаг D. Придумай пароль

- На вкладке **Authentication** перейди на **Password**.
- Придумай пароль по правилам (10+ символов, заглавная буква, цифра,
  не заканчивается цифрой или спецсимволом).
- **Обязательно сохрани его в заметках** — без него не зайдёшь на сервер.

![Вкладка Password с правилами пароля](https://github.com/user-attachments/assets/0fad0565-4e18-4d94-a592-ca4b747153d2)

### Шаг E. Создай Droplet

- **Hostname** (внизу страницы): `my-bot` или любое имя.
- Нажми синюю кнопку **Create Droplet** справа.

Через ~30 секунд сервер готов. На странице Droplet увидишь его IP-адрес
(вроде `164.92.123.45`).

![Готовый Droplet в списке с IP-адресом](https://github.com/user-attachments/assets/6c655731-6789-4d25-8a73-9a3130e38f47)

---

## Открываем терминал в браузере

### Шаг 1. Найди свой Droplet

Слева в меню — раздел **Droplets**. Там будет твой сервер (по имени, которое
ты задала на шаге E). Кликни на его имя.

![Список Droplets с твоим сервером](https://github.com/user-attachments/assets/6c655731-6789-4d25-8a73-9a3130e38f47)

### Шаг 2. Нажми Web Console

На странице сервера сверху — синяя кнопка **Web Console**. Откроется новая
вкладка с чёрным окошком — это и есть терминал в браузере.

![Кнопка Web Console на странице Droplet](https://github.com/user-attachments/assets/ef3a88c6-ece7-40f3-a658-06da2558cc2f)

### Шаг 3. Войди

В окошке:

- **Login as:** введи `root`, нажми Enter.
- **Password:** введи пароль (который ты придумала на шаге D — символы не
  показываются, это нормально), Enter.
- При первом входе попросит сменить пароль — придумай новый и **сохрани**.

Когда увидишь приглашение вроде `root@cloude:~#` — ты на сервере.

![Веб-консоль с приглашением root@cloude](https://github.com/user-attachments/assets/159ba314-9f9d-44c5-a51c-28713055ce05)

---

## Вставляем установочный скрипт

Это единственный «технический» момент. Дальше будет только разговор с Claude.

**Что делаем:**

1. Открой на компьютере **Блокнот** (Windows) или **TextEdit** (Mac).
2. Скопируй туда **весь скрипт ниже** (нажми «Развернуть скрипт» → выдели
   всё → копируй).
3. **Замени первые 5 строк** своими значениями из заметок.
4. Скопируй весь изменённый текст и **вставь в чёрное окошко** на сервере
   (правый клик → Paste).
5. Подожди 2–3 минуты.

В конце увидишь зелёное **✅ ВСЁ ГОТОВО!** — значит, бот уже работает.

<details>
<summary><b>📋 Развернуть установочный скрипт</b></summary>

```bash
# === ЗАПОЛНИ ЭТИ 5 СТРОК ===
TG_TOKEN="ВСТАВЬ_ТОКЕН_BOTFATHER"
ANTHROPIC_KEY="ВСТАВЬ_КЛЮЧ_ANTHROPIC"
GH_USER="ВСТАВЬ_ЛОГИН_GITHUB"
GH_TOKEN="ВСТАВЬ_GITHUB_TOKEN"
REPO_NAME="my-bot"
# === ДАЛЬШЕ НЕ МЕНЯЙ ===

set -e
apt update && apt install -y git python3 python3-pip python3-venv

cd /root
git clone "https://${GH_TOKEN}@github.com/${GH_USER}/${REPO_NAME}.git"
cd "/root/${REPO_NAME}"
git config user.name "auto-deploy"
git config user.email "deploy@server"

cat > bot.py <<'PYEOF'
import os, logging
for v in ("HTTP_PROXY","HTTPS_PROXY","http_proxy","https_proxy","ALL_PROXY","all_proxy"):
    os.environ.pop(v, None)
from dotenv import load_dotenv
import anthropic
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, filters, ContextTypes

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
log = logging.getLogger(__name__)

claude = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
history: dict[int, list[dict]] = {}

async def start(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Привет! Я бот на Claude. Спрашивай что угодно.")

async def reset(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    history.pop(update.effective_user.id, None)
    await update.message.reply_text("История очищена.")

async def chat(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    uid = update.effective_user.id
    history.setdefault(uid, []).append({"role": "user", "content": update.message.text})
    await ctx.bot.send_chat_action(chat_id=update.effective_chat.id, action="typing")
    try:
        resp = claude.messages.create(
            model="claude-opus-4-7", max_tokens=1024,
            system="Ты доброжелательный ассистент. Отвечай коротко и по существу на русском.",
            messages=history[uid],
        )
        text = resp.content[0].text
        history[uid].append({"role": "assistant", "content": text})
        history[uid] = history[uid][-20:]
        await update.message.reply_text(text)
    except Exception:
        log.exception("error")
        await update.message.reply_text("Ошибка. Попробуй ещё раз.")

def main():
    app = ApplicationBuilder().token(os.environ["TELEGRAM_BOT_TOKEN"]).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("reset", reset))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, chat))
    log.info("Bot started")
    app.run_polling()

if __name__ == "__main__":
    main()
PYEOF

cat > requirements.txt <<'EOF'
anthropic>=0.40.0
python-telegram-bot>=21.0
python-dotenv>=1.0.0
EOF

cat > .gitignore <<'EOF'
.env
venv/
__pycache__/
*.pyc
EOF

cat > .env <<EOF
TELEGRAM_BOT_TOKEN=${TG_TOKEN}
ANTHROPIC_API_KEY=${ANTHROPIC_KEY}
EOF

cat > CLAUDE.md <<'EOF'
# Telegram-бот на Claude

Главный файл — bot.py. Зависимости — requirements.txt.

## Сервер
Бот работает на VPS DigitalOcean.
- Путь: /root/my-bot
- Сервис: mybot.service (systemd)
- Автодеплой: /root/autodeploy.sh запускается ежеминутно,
  делает git pull и перезапускает сервис при изменениях.

## Workflow
Всё через GitHub: коммит в main → через минуту сервер обновится.
Руками на сервер не лезем.

## Пользователь
Говорит по-русски, не программист — объяснять простыми словами.
EOF

python3 -m venv venv
./venv/bin/pip install -q -r requirements.txt

git add bot.py requirements.txt .gitignore CLAUDE.md
git commit -m "Initial bot setup"
git branch -M main
git push -u origin main

cat > /etc/systemd/system/mybot.service <<EOF
[Unit]
Description=Telegram Bot on Claude
After=network.target

[Service]
Type=simple
WorkingDirectory=/root/${REPO_NAME}
ExecStart=/root/${REPO_NAME}/venv/bin/python /root/${REPO_NAME}/bot.py
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

cat > /root/autodeploy.sh <<EOF
#!/bin/bash
cd /root/${REPO_NAME} || exit 1
BEFORE=\$(git rev-parse HEAD)
git pull --quiet
AFTER=\$(git rev-parse HEAD)
if [ "\$BEFORE" != "\$AFTER" ]; then
    /root/${REPO_NAME}/venv/bin/pip install -q -r requirements.txt
    systemctl restart mybot.service
fi
EOF
chmod +x /root/autodeploy.sh

cat > /etc/systemd/system/autodeploy.service <<'EOF'
[Unit]
Description=Auto deploy from GitHub
[Service]
Type=oneshot
ExecStart=/root/autodeploy.sh
EOF

cat > /etc/systemd/system/autodeploy.timer <<'EOF'
[Unit]
Description=Run autodeploy every minute
[Timer]
OnBootSec=1min
OnUnitActiveSec=1min
[Install]
WantedBy=timers.target
EOF

systemctl daemon-reload
systemctl enable --now mybot.service
systemctl enable --now autodeploy.timer

echo ""
echo "============================================="
echo "✅ ВСЁ ГОТОВО!"
echo "Открой Telegram, найди своего бота, напиши /start"
echo "Дальше работай только через claude.ai"
echo "============================================="
```

</details>

---

## Проверяем

В Telegram найди своего бота (по username от BotFather) → `/start` → должен
ответить.

🎉 **Сервер настроен.**

---

## Бонусный шаг: Git Relay — чтобы Claude сам управлял твоим сервером

После этого шага Claude (в claude.ai или Claude Code) сможет **напрямую
выполнять команды на твоём сервере**: перезапускать бота, показывать
логи, делать бэкапы, ставить новые библиотеки — всё без того, чтобы ты
заходила в Browser terminal.

**Как это работает (простыми словами):** на сервере запускается маленький
скрипт-«почтальон». Раз в 5 секунд он заглядывает в специальный файл в твоём
GitHub-репозитории — `cmds/pending.json`. Если ты (или Claude) положила туда
команду, он её выполняет и возвращает результат в `cmds/result.json`. То есть
Claude передаёт команды через GitHub, а не через терминал — а GitHub
доступен откуда угодно.

> **Время настройки:** 5 минут. Один раз. Больше к Browser terminal не
> возвращаешься **вообще никогда**.

### Шаг 1. Скажи Claude установить Git Relay

В claude.ai (или Claude Code) в репозитории `my-bot` напиши:

> Настрой мне Git Relay в этом репозитории. Это механизм, через который
> ты сможешь выполнять команды на моём сервере напрямую, без терминала.
>
> Контекст:
> - Бот живёт в `/root/my-bot/` (или где у тебя бот, скажи Claude правильный путь)
> - В `.env` есть `GITHUB_TOKEN`
> - Автодеплой уже работает: `/root/autodeploy.sh` через systemd-таймер
>   ежеминутно делает `git pull`
>
> Создай и закоммить в main:
>
> 1. Файл `cmd_runner.py`:
>    - Раз в 5 секунд через GitHub API читает `cmds/pending.json`
>    - Если там новый `id` (не равен `last_cmd_id`) — выполняет `cmd`
>      как shell-команду через `subprocess.run`
>    - Результат (stdout, stderr, returncode, ts) пушит в
>      `cmds/result.json` через GitHub API
>    - Берёт `GITHUB_TOKEN` из окружения или из `.env`
>    - Только стандартная библиотека Python
>    - Таймаут команды 120 секунд
>    - Stdout обрезает до последних 3000 символов
>
> 2. Файл `cmdrunner.service` (systemd-юнит):
>    - `User=root` (потому что командам может понадобиться `systemctl`)
>    - `WorkingDirectory=/root/my-bot`
>    - `ExecStart=/usr/bin/python3 /root/my-bot/cmd_runner.py`
>    - `Restart=always`, `RestartSec=10`
>    - `EnvironmentFile=-/root/my-bot/.env`
>
> 3. Папку `cmds/` с двумя файлами:
>    - `cmds/pending.json`: `{"id":"init","cmd":"echo ready"}`
>    - `cmds/result.json`: `{}`
>
> 4. Допиши в README/CLAUDE.md раздел «Git Relay» — короткое описание
>    механизма и формат JSON.
>
> Закоммить одним коммитом «Add Git Relay» и запушь в main.

Claude сделает файлы и запушит. Через ~1 минуту автодеплой подтянет их на
сервер.

### Шаг 2. Один раз установить сервис — в Browser terminal

Пока Claude пушит — открой **Browser terminal** на DigitalOcean
(тот самый, что в Шаге 2 раньше). Скопируй блок и вставь:

```bash
cd /root/my-bot && \
sudo cp cmdrunner.service /etc/systemd/system/ && \
sudo systemctl daemon-reload && \
sudo systemctl enable --now cmdrunner.service && \
sleep 2 && \
sudo systemctl status cmdrunner.service --no-pager | head -10
```

Что эта команда делает:
- Копирует юнит-файл туда, где `systemd` его найдёт
- Говорит `systemd` перечитать юниты
- Включает сервис и запускает его
- Показывает статус

Если увидишь `Active: active (running)` — **готово**.

### Шаг 3. Проверь, что Claude дотягивается до сервера

В claude.ai напиши:

> Проверь, что Git Relay работает. Положи в `cmds/pending.json`:
> `{"id":"hello-test-1","cmd":"echo ready && hostname && uptime"}`,
> запушь в main, подожди 10 секунд, прочитай `cmds/result.json` и
> покажи мне результат.

Через ~10 секунд Claude покажет тебе вывод твоего сервера. Если видишь
`ready`, имя сервера и время работы — **Git Relay работает**.

### Что теперь можно

Просто пиши Claude обычным языком:

| Хочу | Пишу |
|---|---|
| Проверить, жив ли бот | *«Проверь статус бота на сервере»* |
| Посмотреть логи | *«Покажи мне последние 50 строк логов бота»* |
| Перезапустить | *«Перезапусти бота»* |
| Поставить библиотеку | *«Установи `requests` в venv бота»* |
| Сделать бэкап | *«Сделай бэкап папки бота в `/tmp`»* |

Всё это Claude сделает через Git Relay — без твоего участия.

⚠️ **Важно про безопасность:** репозиторий должен быть **приватным**. Иначе
кто угодно сможет писать команды, которые выполнятся на твоём сервере с
правами root. Если репо стало публичным — срочно отзови токен GitHub
и создай новый.

---

# Часть 2. Дальше работаем только в Claude

## Подключаем GitHub к Claude

1. **[claude.ai](https://claude.ai/)** → войди.
2. Профиль (снизу слева) → **Settings** → **Connectors**.
3. **GitHub** → **Connect** → авторизуй → выбери **только репо `my-bot`**.

---

## Меняем бота словами

Открой в **claude.ai** новый чат и пиши обычным языком, например:

> У меня в репозитории `мой_логин/my-bot` лежит код моего Telegram-бота.
> Сервер сам подтягивает изменения из main за минуту.
>
> Добавь команду `/help` со списком возможностей. Закоммить в main.

Claude сам прочитает код, внесёт изменения и закоммитит. Через минуту сервер
обновит бота. Идёшь в Telegram — проверяешь.

---

## Что можно просить у Claude

### Быстрые правки на каждый день

| Хочу | Пишу |
|---|---|
| Изменить приветствие | *«Измени текст /start на "Привет, друг!"»* |
| Добавить кнопки в меню | *«Добавь к /start меню с кнопками: Услуги, Цены, Связаться»* |
| Сохранять диалоги в файл | *«Сохраняй все сообщения клиентов в chats.log с датой и username, чтобы я могла потом просматривать»* |
| Расписание работы | *«С 22:00 до 09:00 по Киеву отвечай "Сейчас не работаем, ответим утром"»* |
| Откатить плохое изменение | *«Откатись на предыдущий коммит, мне не понравилось»* |
| Объясни, что случилось | *«Покажи последние изменения и объясни простыми словами, что ты сделал»* |

---

### Сделать бота личным ассистентом для себя

Самое мощное применение — бот **для тебя**, а не для клиентов. Помощник,
который всегда под рукой в Telegram, помнит твоё дело и берёт на себя
рутину. Скопируй любой шаблон, замени *курсив* на своё, отправь Claude.

**Личный планировщик задач:**

> Ты мой личный ассистент-планировщик. Помогаешь держать дела в порядке.
>
> Что умеешь:
> - Принимать от меня задачи в свободной форме («Завтра звонок с
>   поставщиком в 14:00, надо подготовить вопросы», «До пятницы —
>   счёт в налоговую») и сохранять в файл `tasks.md` с датой,
>   дедлайном и приоритетом (сам прикинь по контексту).
> - По команде `/день` — показать, что у меня сегодня, в каком порядке
>   лучше делать, что можно перенести.
> - По команде `/неделя` — картина на 7 дней.
> - Если задача висит больше 3 дней — напомни.
> - Когда я отчитываюсь («сделала Х») — отметь как выполненную.
>
> Стиль: коротко, без воды. Уточняешь только если действительно непонятно.

**Помощник по контенту для соцсетей:**

> Ты — мой контент-помощник. Моя ниша: *«опиши»*. Целевая аудитория:
> *«опиши»*. Тон постов: *«дружеский/экспертный/с юмором»*.
>
> Что делаешь:
> - Когда я кидаю тебе мысль, кейс или ситуацию с работы — превращаешь её
>   в готовый пост на 800–1500 знаков с цепляющим началом и призывом
>   в конце.
> - Предлагаешь сразу **3 варианта заголовков** на выбор.
> - Знаешь мои табу: *«без эмодзи в начале строк, без жаргона, без
>   обещаний результата»*.
> - Если идея слабая — честно скажи и предложи, как усилить.
> - По команде `/идеи` — накидай мне 5 свежих тем для постов на эту
>   неделю, опираясь на сезон и нишу.

**Финансовый помощник для ФОП/ИП:**

> Помогаешь мне вести учёт доходов и расходов. Я *«ФОП 3 группы
> единого налога / самозанятая / ...»*. Записи сохраняй в файле
> `finance.md`.
>
> Что делаешь:
> - Принимаешь записи в свободной форме («получила от клиента А 20000
>   за услугу Х», «заплатила за рекламу 3000») и сохраняешь с датой,
>   категорией и комментарием.
> - По команде `/месяц` — итоги: доходы, расходы по категориям,
>   налог, чистая прибыль.
> - По команде `/год` — то же самое за год.
> - До 20-го числа последнего месяца квартала — напомни об уплате
>   единого налога и ЕСВ.
> - Если расход выглядит странно (нетипичная категория или большая сумма) —
>   переспроси, не ошибка ли.

**Память о клиентах (мини-CRM):**

> Ты — моя память о клиентах. Их много, в голове всех не удержать.
> Данные сохраняй в файле `crm.md`, по одному клиенту на блок.
>
> Что делаешь:
> - Когда я говорю «новый клиент: *Анна Петренко, заказала Х за У,
>   контакт +380..., познакомились на Z*» — сохраняешь.
> - По команде `/клиент Имя` — расскажи всё, что знаешь.
> - Когда я говорю «звонила Анне» / «написала Марии» — добавь заметку
>   с датой.
> - По команде `/давно` — кому я не писала больше 30 дней.
> - Никогда не путаешь клиентов и не выдумываешь данных. Если не уверен —
>   спроси.

---

### Сделать бота для общения с клиентами

Если нужно, чтобы бот **отвечал клиентам** — другие шаблоны:

**Бот-администратор (запись / заявки):**

> Сделай бота администратором моего/моей *«салона / студии / сервиса»*. Стиль —
> дружелюбный, на «вы», эмодзи в меру.
>
> Что умеет:
> - Рассказать об услугах и ценах *(положи их в файл `services.md`)*.
> - Записать клиента: спросить имя, телефон, услугу, удобные дату и время.
>   Готовую заявку переслать мне в Telegram (мой ID: *123456789*).
> - На вопросы не по теме — «уточню у мастера, отвечу в рабочее время».
>
> Чего **не делает:** не подтверждает запись сам, не обсуждает
> противопоказания, не критикует конкурентов.

**Бот-FAQ по базе знаний:**

> Положи в репо файл `knowledge.md` с описанием моего бизнеса
> *(заполню сама)*. Бот должен:
> - Отвечать клиентам **только** на основе этого файла.
> - Если в файле нет ответа — честно сказать «не знаю, передам коллеге»
>   и переслать вопрос мне в Telegram (ID: *123456789*).
> - Никогда не выдумывать фактов, цен или адресов.

---

### Свой промт — как написать с нуля

Если ни один шаблон не подходит, **скажи Claude словами, чего хочешь**, по
такой структуре:

> 1. **Кто бот** (роль): *«Ты — ...»*
> 2. **Как общается** (тон): дружелюбно / строго / на «ты» / с юмором
> 3. **Что умеет** (список конкретных задач)
> 4. **Чего не делает** (запреты)
> 5. **Откуда берёт информацию** (файл в репо / только из памяти / спросить меня)
> 6. **Что делает в спорных ситуациях** (отказ / переадресация человеку)

Всё это вставь в одно сообщение Claude — он сам разберётся, как это
прописать в коде бота. Можешь даже не оформлять списком, написать
сплошным текстом — Claude поймёт.

**Совет:** начни с минимального промта, протестируй на 2–3 живых сообщениях,
а потом дописывай — *«а ещё пусть он не ...»*, *«и добавь, чтобы он ...»*. Так
получится точнее, чем пытаться предусмотреть всё сразу.

---

# Если что-то сломалось — пиши Claude

Не лезь в сервер сама. Просто **открой чат в claude.ai** и опиши проблему
как она есть. Примеры:

> Бот не отвечает после твоего последнего изменения, верни как было.

> Бот молчит уже час, разберись пожалуйста, что не так.

> Я случайно нажала что-то не то — почини.

> Не понимаю эту ошибку: *(вставь текст)*

Claude сам:
- проверит код,
- откатится на рабочую версию или починит,
- если что-то надо сделать на сервере — даст тебе **готовую команду**, которую
  ты просто скопируешь в **Console DigitalOcean**.

Никаких догадок и поиска в Google не нужно.

---

## Безопасность

- **Не показывай** свои токены и пароли. Даже скриншотом.
- Все секреты лежат на сервере в файле `.env` — в GitHub они **не
  попадают** (мы это настроили автоматически).
- Если случайно засветила токен — сразу его отзови:
  - Telegram: `/revoke` в [@BotFather](https://t.me/BotFather)
  - GitHub: [страница токенов](https://github.com/settings/tokens?type=beta) → Revoke
  - Anthropic: [страница ключей](https://console.anthropic.com/settings/keys) → Delete
  - И сделай новые.

---

## Ссылки одним блоком

- **Claude:** [claude.ai](https://claude.ai/)
- **DigitalOcean** (регистрация с бонусом $200): [m.do.co/c/8d079274e061](https://m.do.co/c/8d079274e061)
- **DigitalOcean** (панель, если уже есть аккаунт): [cloud.digitalocean.com](https://cloud.digitalocean.com/)
- **GitHub:** [github.com](https://github.com/)
- **Anthropic console:** [console.anthropic.com](https://console.anthropic.com/)
- **Telegram BotFather:** [@BotFather](https://t.me/BotFather)

Удачи!
