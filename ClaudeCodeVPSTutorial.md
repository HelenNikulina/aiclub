# Агент на Claude — налаштування з нуля

**Ідея.** Один раз — 15 хвилин у браузері, на сервері. Далі — **тільки
розмовляєш із Claude у claude.ai**, і бот сам оновлюється.

До сервера більше не повертаємося.

---

## Що буде в результаті

```
Ти кажеш Claude, що хочеш змінити
            ↓
Claude править код у твоєму репозиторії на GitHub
            ↓
Сервер сам забирає зміни і перезапускає бота
            ↓
Бот у Telegram уже з новою поведінкою
```

Жодних терміналів на комп'ютері. Жодних команд напам'ять.

---

# Частина 1. Налаштовуємо один раз

## Спочатку збери 5 ключів

Відкрий 4 вкладки в браузері і збережи значення в нотатках.

### 1. Токен Telegram-бота

У Telegram відкрий **[@BotFather](https://t.me/BotFather)** → `/newbot` →
придумай ім'я та username (`...bot`) → скопіюй надісланий токен.

### 2. Ключ Anthropic

**[console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)** →
**Create Key** → скопіюй ключ одразу (показується один раз).

Якщо акаунт новий — на сторінці **Billing** поповни хоча б на $5.

### 3. Репозиторій на GitHub

Реєстрація: **[github.com/signup](https://github.com/signup)**.

Потім — **[створити новий репозиторій](https://github.com/new)**:
- **Name:** `my-bot`
- **Private**
- ✅ **Add a README file**

### 4. GitHub-токен

Відкрий **[github.com/settings/tokens](https://github.com/settings/tokens)** →
праворуч згори **Generate new token** → обери **Generate new token (classic)**.

![Меню Generate new token (classic)](screenshots/github-classic-tokens-menu.png)

У формі, що відкриється:

- **Note:** `bot-server`
- **Expiration:** *No expiration*
- **Select scopes:** постав галочку навпроти **`repo`** (галочки всередині —
  `repo:status`, `repo_deployment` тощо — відмітяться самі).
- Прокрути вниз → **Generate token**.

![Створення classic-токена з scope repo](screenshots/github-classic-token-form.png)

Після генерації **одразу скопіюй токен** (`ghp_...`) — він показується один
раз.

### 5. Акаунт DigitalOcean

Зареєструйся за моїм посиланням (так у тебе буде **$200 бонусу на 60 днів**):
**[m.do.co/c/8d079274e061](https://m.do.co/c/8d079274e061)** → підтверди
email → прив'яжи карту.

---

## Створюємо сервер

### Крок A. Відкрий меню створення

У панелі DigitalOcean праворуч згори зелена кнопка **Create** → **Droplets**.

![Меню Create → Droplets](https://github.com/user-attachments/assets/1cdeb3fa-389c-4b64-a271-58a85c08f1fe)

### Крок B. Обери регіон і систему

- **Region:** Frankfurt або Amsterdam (найближчий до тебе).
- **OS:** **Ubuntu 24.04 (LTS) x64** (за замовчуванням позначений як *RECOMMENDED*).

![Вибір регіону Amsterdam та Ubuntu 24.04](https://github.com/user-attachments/assets/17984969-4d45-4998-8fe9-3fb773a10866)

### Крок C. Обери план

- Вкладка **Basic** (Shared CPU).
- **CPU Options:** *Regular* (Disk Type: SSD).
- **Select a Plan:** **$6/міс** (1 vCPU, 1 GB RAM, 25 GB SSD,
  1000 GB Transfer).

![Вибір плану Basic Regular $6/міс](https://github.com/user-attachments/assets/947e66b2-0a6f-4a1a-a620-ae55d62d06e2)

### Крок D. Придумай пароль

- На вкладці **Authentication** перейди на **Password**.
- Придумай пароль за правилами (10+ символів, велика літера, цифра,
  не закінчується цифрою або спецсимволом).
- **Обов'язково збережи його в нотатках** — без нього не зайдеш на сервер.

![Вкладка Password з правилами пароля](https://github.com/user-attachments/assets/0fad0565-4e18-4d94-a592-ca4b747153d2)

### Крок E. Створи Droplet

- **Hostname** (внизу сторінки): `my-bot` або будь-яке ім'я.
- Натисни синю кнопку **Create Droplet** праворуч.

Через ~30 секунд сервер готовий. На сторінці Droplet побачиш його IP-адресу
(на кшталт `164.92.123.45`).

![Готовий Droplet у списку з IP-адресою](https://github.com/user-attachments/assets/6c655731-6789-4d25-8a73-9a3130e38f47)

---

## Відкриваємо термінал у браузері

### Крок 1. Знайди свій Droplet

Ліворуч у меню — розділ **Droplets**. Там буде твій сервер (за іменем, яке
ти задала на кроці E). Клікни на його ім'я.

![Список Droplets з твоїм сервером](https://github.com/user-attachments/assets/6c655731-6789-4d25-8a73-9a3130e38f47)

### Крок 2. Натисни Web Console

На сторінці сервера згори — синя кнопка **Web Console**. Відкриється нова
вкладка з чорним віконцем — це і є термінал у браузері.

![Кнопка Web Console на сторінці Droplet](https://github.com/user-attachments/assets/ef3a88c6-ece7-40f3-a658-06da2558cc2f)

### Крок 3. Увійди

У віконці:

- **Login as:** введи `root`, натисни Enter.
- **Password:** введи пароль (який ти придумала на кроці D — символи не
  показуються, це нормально), Enter.
- Під час першого входу попросить змінити пароль — придумай новий і **збережи**.

Коли побачиш запрошення на кшталт `root@cloude:~#` — ти на сервері.

![Веб-консоль із запрошенням root@cloude](https://github.com/user-attachments/assets/159ba314-9f9d-44c5-a51c-28713055ce05)

---

## Вставляємо установчий скрипт

Це єдиний «технічний» момент. Далі буде тільки розмова з Claude.

**Що робимо:**

1. Відкрий на комп'ютері **Блокнот** (Windows) або **TextEdit** (Mac).
2. Скопіюй туди **весь скрипт нижче** (натисни «Розгорнути скрипт» → виділи
   все → копіюй).
3. **Заміни перші 5 рядків** своїми значеннями з нотаток.
4. Скопіюй увесь змінений текст і **встав у чорне віконце** на сервері
   (правий клік → Paste).
5. Зачекай 2–3 хвилини.

Наприкінці побачиш зелене **✅ ВСЕ ГОТОВО!** — отже, бот уже працює.

<details>
<summary><b>📋 Розгорнути установчий скрипт</b></summary>

```bash
# === ЗАПОВНИ ЦІ 5 РЯДКІВ ===
TG_TOKEN="ВСТАВ_ТОКЕН_BOTFATHER"
ANTHROPIC_KEY="ВСТАВ_КЛЮЧ_ANTHROPIC"
GH_USER="ВСТАВ_ЛОГІН_GITHUB"
GH_TOKEN="ВСТАВ_GITHUB_TOKEN"
REPO_NAME="my-bot"
# === ДАЛІ НЕ ЗМІНЮЙ ===

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
    await update.message.reply_text("Привіт! Я бот на Claude. Питай будь-що.")

async def reset(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    history.pop(update.effective_user.id, None)
    await update.message.reply_text("Історію очищено.")

async def chat(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    uid = update.effective_user.id
    history.setdefault(uid, []).append({"role": "user", "content": update.message.text})
    await ctx.bot.send_chat_action(chat_id=update.effective_chat.id, action="typing")
    try:
        resp = claude.messages.create(
            model="claude-opus-4-7", max_tokens=1024,
            system="Ти доброзичливий асистент. Відповідай коротко та по суті українською.",
            messages=history[uid],
        )
        text = resp.content[0].text
        history[uid].append({"role": "assistant", "content": text})
        history[uid] = history[uid][-20:]
        await update.message.reply_text(text)
    except Exception:
        log.exception("error")
        await update.message.reply_text("Помилка. Спробуй ще раз.")

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

Головний файл — bot.py. Залежності — requirements.txt.

## Сервер
Бот працює на VPS DigitalOcean.
- Шлях: /root/my-bot
- Сервіс: mybot.service (systemd)
- Автодеплой: /root/autodeploy.sh запускається щохвилини,
  робить git pull і перезапускає сервіс при змінах.

## Workflow
Усе через GitHub: коміт у main → за хвилину сервер оновиться.
Руками до сервера не лізьмо.

## Користувач
Говорить українською, не програміст — пояснювати простими словами.
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
echo "✅ ВСЕ ГОТОВО!"
echo "Відкрий Telegram, знайди свого бота, напиши /start"
echo "Далі працюй тільки через claude.ai"
echo "============================================="
```

</details>

---

## Перевіряємо

У Telegram знайди свого бота (за username від BotFather) → `/start` → має
відповісти.

🎉 **Сервер налаштовано. Закривай вкладку DigitalOcean — вона більше не потрібна.**

---

# Частина 2. Далі працюємо тільки в Claude

## Підключаємо GitHub до Claude

1. **[claude.ai](https://claude.ai/)** → увійди.
2. Профіль (знизу зліва) → **Settings** → **Connectors**.
3. **GitHub** → **Connect** → авторизуй → обери **тільки репо `my-bot`**.

---

## Змінюємо бота словами

Відкрий у **claude.ai** новий чат і пиши звичайною мовою, наприклад:

> У мене в репозиторії `мій_логін/my-bot` лежить код мого Telegram-бота.
> Сервер сам підтягує зміни з main за хвилину.
>
> Додай команду `/help` зі списком можливостей. Закомить у main.

Claude сам прочитає код, внесе зміни і закомить. За хвилину сервер оновить
бота. Йдеш у Telegram — перевіряєш.

---

## Що можна просити в Claude

### Швидкі правки на щодень

| Хочу | Пишу |
|---|---|
| Змінити привітання | *«Зміни текст /start на "Привіт, друже!"»* |
| Додати кнопки в меню | *«Додай до /start меню з кнопками: Послуги, Ціни, Зв'язатися»* |
| Зберігати діалоги у файл | *«Зберігай усі повідомлення клієнтів у chats.log з датою та username, щоб я могла потім переглядати»* |
| Розклад роботи | *«З 22:00 до 09:00 за Києвом відповідай "Зараз не працюємо, відповімо зранку"»* |
| Відкотити погану зміну | *«Відкотися на попередній коміт, мені не сподобалося»* |
| Поясни що сталося | *«Покажи останні зміни і поясни простими словами, що ти зробив»* |

---

### Зробити бота особистим асистентом для тебе

Найпотужніше застосування — бот **для тебе**, а не для клієнтів. Помічник,
який завжди під рукою в Telegram, пам'ятає твою справу і бере на себе
рутину. Скопіюй будь-який шаблон, заміни *курсив* на своє, надішли Claude.

**Особистий планувальник задач:**

> Ти мій особистий асистент-планувальник. Допомагаєш тримати справи в порядку.
>
> Що вмієш:
> - Приймати від мене задачі у вільній формі («Завтра дзвінок із
>   постачальником о 14:00, треба підготувати питання», «До п'ятниці —
>   рахунок до податкової») і зберігати у файл `tasks.md` з датою,
>   дедлайном і пріоритетом (сам прикинь за контекстом).
> - За командою `/день` — показати що у мене сьогодні, в якому порядку
>   краще робити, що можна перенести.
> - За командою `/тиждень` — картина на 7 днів.
> - Якщо задача висить більше 3 днів — нагадай.
> - Коли я звітую («зробила Х») — познач як виконану.
>
> Стиль: коротко, без води. Уточнюєш тільки якщо справді незрозуміло.

**Помічник із контенту для соцмереж:**

> Ти — мій контент-помічник. Моя ніша: *«опиши»*. Цільова аудиторія:
> *«опиши»*. Тон постів: *«дружній/експертний/з гумором»*.
>
> Що робиш:
> - Коли я кидаю тобі думку, кейс або ситуацію з роботи — перетворюєш її
>   на готовий пост на 800–1500 знаків із чіпляючим початком і закликом
>   у кінці.
> - Пропонуєш одразу **3 варіанти заголовків** на вибір.
> - Знаєш мої табу: *«без емодзі на початку рядків, без жаргону, без
>   обіцянок результату»*.
> - Якщо ідея слабка — чесно скажи і запропонуй як посилити.
> - За командою `/ідеї` — кинь мені 5 свіжих тем для постів на цей
>   тиждень, спираючись на сезон і нішу.

**Фінансовий помічник для ФОП:**

> Допомагаєш мені вести облік доходів і витрат. Я *«ФОП 3 групи
> єдиного податку / самозайнята / ...»*. Записи зберігай у файлі
> `finance.md`.
>
> Що робиш:
> - Приймаєш записи у вільній формі («отримала від клієнта А 20000
>   за послугу Х», «заплатила за рекламу 3000») і зберігаєш із датою,
>   категорією та коментарем.
> - За командою `/місяць` — підсумки: доходи, витрати за категоріями,
>   податок, чистий прибуток.
> - За командою `/рік` — те саме за рік.
> - До 20-го числа останнього місяця кварталу — нагадай про сплату
>   єдиного податку та ЄСВ.
> - Якщо витрата виглядає дивно (нетипова категорія або велика сума) —
>   перепитай, чи не помилка.

**Пам'ять про клієнтів (міні-CRM):**

> Ти — моя пам'ять про клієнтів. Їх багато, в голові всіх не втримати.
> Дані зберігай у файлі `crm.md`, по одному клієнту на блок.
>
> Що робиш:
> - Коли я кажу «новий клієнт: *Анна Петренко, замовила Х за У,
>   контакт +380..., познайомилися на Z*» — зберігаєш.
> - За командою `/клієнт Ім'я` — розкажи все що знаєш.
> - Коли я кажу «дзвонила Анні» / «написала Марії» — додай нотатку
>   з датою.
> - За командою `/давно` — кому я не писала більше 30 днів.
> - Ніколи не плутаєш клієнтів і не вигадуєш даних. Якщо не впевнений —
>   запитай.

---

### Зробити бота для спілкування з клієнтами

Якщо потрібно, щоб бот **відповідав клієнтам** — інші шаблони:

**Бот-адміністратор (запис / заявки):**

> Зроби бота адміністратором моєї *«салону / студії / сервісу»*. Стиль —
> дружній, на «ви», емодзі в міру.
>
> Що вміє:
> - Розповісти про послуги та ціни *(поклади їх у файл `services.md`)*.
> - Записати клієнта: запитати ім'я, телефон, послугу, зручну дату і час.
>   Готову заявку переслати мені в Telegram (мій ID: *123456789*).
> - На питання поза темою — «уточню в майстра, відповім у робочий час».
>
> Чого **не робить:** не підтверджує запис сам, не обговорює
> протипоказання, не критикує конкурентів.

**Бот-FAQ за базою знань:**

> Поклади в репо файл `knowledge.md` з описом мого бізнесу
> *(заповню сама)*. Бот має:
> - Відповідати клієнтам **тільки** на основі цього файлу.
> - Якщо у файлі немає відповіді — чесно сказати «не знаю, передам колезі»
>   і переслати питання мені в Telegram (ID: *123456789*).
> - Ніколи не вигадувати фактів, цін чи адрес.

---

### Власний промт — як написати з нуля

Якщо жоден шаблон не підходить, **скажи Claude словами що хочеш**, за
такою структурою:

> 1. **Хто бот** (роль): *«Ти — ...»*
> 2. **Як спілкується** (тон): дружньо / строго / на «ти» / з гумором
> 3. **Що вміє** (список конкретних задач)
> 4. **Чого не робить** (заборони)
> 5. **Звідки бере інформацію** (файл у репо / тільки з пам'яті / запитати мене)
> 6. **Що робить у спірних ситуаціях** (відмова / переадресація людині)

Усе це встав в одне повідомлення Claude — він сам розбереться, як це
прописати в коді бота. Можеш навіть не оформлювати списком, написати
суцільним текстом — Claude зрозуміє.

**Порада:** почни з мінімального промта, протестуй на 2-3 живих повідомленнях,
а потім дописуй — *«а ще нехай він не ...»*, *«і додай, щоб він ...»*. Так
вийде точніше, ніж намагатися передбачити все одразу.

---

# Якщо щось зламалося — пиши Claude

Не лізь у сервер сама. Просто **відкрий чат у claude.ai** і опиши проблему
як вона є. Приклади:

> Бот не відповідає після твоєї останньої зміни, поверни як було.

> Бот мовчить уже годину, розберися будь ласка що не так.

> Я випадково натиснула щось не те — полагодь.

> Не розумію цю помилку: *(встав текст)*

Claude сам:
- перевірить код,
- відкотиться на робочу версію або полагодить,
- якщо щось треба зробити на сервері — дасть тобі **готову команду**, яку
  ти просто скопіюєш у **Console DigitalOcean**.

Жодних здогадок і пошуку в Google не потрібно.

---

## Безпека

- **Не показуй** свої токени і паролі. Навіть скриншотом.
- Усі секрети лежать на сервері у файлі `.env` — в GitHub вони **не
  потрапляють** (ми це налаштували автоматично).
- Якщо випадково засвітила токен — одразу його відклич:
  - Telegram: `/revoke` у [@BotFather](https://t.me/BotFather)
  - GitHub: [сторінка токенів](https://github.com/settings/tokens?type=beta) → Revoke
  - Anthropic: [сторінка ключів](https://console.anthropic.com/settings/keys) → Delete
  - І зроби нові.

---

## Посилання одним блоком

- **Claude:** [claude.ai](https://claude.ai/)
- **DigitalOcean** (реєстрація з бонусом $200): [m.do.co/c/8d079274e061](https://m.do.co/c/8d079274e061)
- **DigitalOcean** (панель, якщо вже є акаунт): [cloud.digitalocean.com](https://cloud.digitalocean.com/)
- **GitHub:** [github.com](https://github.com/)
- **Anthropic console:** [console.anthropic.com](https://console.anthropic.com/)
- **Telegram BotFather:** [@BotFather](https://t.me/BotFather)

Успіху!
