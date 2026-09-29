# A Claude Agent — Setup from Scratch

**The idea.** Once: 15 minutes in the browser, on the server. After that, **you
just talk to Claude on claude.ai**, and the bot updates itself.

We never go back to the server again.

---

## What you'll end up with

```
You tell Claude what you want to change
            ↓
Claude edits the code in your GitHub repository
            ↓
The server pulls the changes and restarts the bot on its own
            ↓
The Telegram bot already has the new behavior
```

No terminals on your computer. No commands to memorize.

---

# Part 1. One-time setup

## First, collect 5 keys

Open 4 tabs in your browser and save the values in your notes.

### 1. Telegram bot token

In Telegram, open **[@BotFather](https://t.me/BotFather)** → `/newbot` →
pick a name and a username (`...bot`) → copy the token it sends you.

### 2. Anthropic key

**[console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)** →
**Create Key** → copy the key right away (it's shown only once).

If your account is new, top it up with at least $5 on the **Billing** page.

### 3. GitHub repository

Sign up: **[github.com/signup](https://github.com/signup)**.

Then **[create a new repository](https://github.com/new)**:
- **Name:** `my-bot`
- **Private**
- ✅ **Add a README file**

### 4. GitHub token

Open **[github.com/settings/tokens](https://github.com/settings/tokens)** →
top right, **Generate new token** → choose **Generate new token (classic)**.

![Generate new token (classic) menu](screenshots/github-classic-tokens-menu.png)

In the form that opens:

- **Note:** `bot-server`
- **Expiration:** *No expiration*
- **Select scopes:** tick the box next to **`repo`** (the boxes inside it —
  `repo:status`, `repo_deployment`, etc. — get ticked automatically).
- Scroll down → **Generate token**.

![Creating a classic token with the repo scope](screenshots/github-classic-token-form.png)

After it's generated, **copy the token immediately** (`ghp_...`) — it's shown only
once.

### 5. DigitalOcean account

Sign up with my link (this gives you a **$200 bonus for 60 days**):
**[m.do.co/c/8d079274e061](https://m.do.co/c/8d079274e061)** → confirm your
email → add a card.

---

## Creating the server

### Step A. Open the create menu

In the DigitalOcean dashboard, top right, click the green **Create** button → **Droplets**.

![Create → Droplets menu](https://github.com/user-attachments/assets/1cdeb3fa-389c-4b64-a271-58a85c08f1fe)

### Step B. Choose a region and OS

- **Region:** Frankfurt or Amsterdam (whichever is closest to you).
- **OS:** **Ubuntu 24.04 (LTS) x64** (marked *RECOMMENDED* by default).

![Choosing the Amsterdam region and Ubuntu 24.04](https://github.com/user-attachments/assets/17984969-4d45-4998-8fe9-3fb773a10866)

### Step C. Choose a plan

- **Basic** tab (Shared CPU).
- **CPU Options:** *Regular* (Disk Type: SSD).
- **Select a Plan:** **$6/mo** (1 vCPU, 1 GB RAM, 25 GB SSD,
  1000 GB Transfer).

![Choosing the Basic Regular $6/mo plan](https://github.com/user-attachments/assets/947e66b2-0a6f-4a1a-a620-ae55d62d06e2)

### Step D. Create a password

- On the **Authentication** tab, switch to **Password**.
- Create a password that follows the rules (10+ characters, an uppercase letter, a digit,
  must not end with a digit or special character).
- **Be sure to save it in your notes** — without it you can't log in to the server.

![Password tab with the password rules](https://github.com/user-attachments/assets/0fad0565-4e18-4d94-a592-ca4b747153d2)

### Step E. Create the Droplet

- **Hostname** (at the bottom of the page): `my-bot` or any name you like.
- Click the blue **Create Droplet** button on the right.

In ~30 seconds the server is ready. On the Droplet page you'll see its IP address
(something like `164.92.123.45`).

![The ready Droplet in the list with its IP address](https://github.com/user-attachments/assets/6c655731-6789-4d25-8a73-9a3130e38f47)

---

## Opening the terminal in your browser

### Step 1. Find your Droplet

In the left-hand menu, open the **Droplets** section. Your server will be there (under the name
you gave it in Step E). Click its name.

![Droplets list with your server](https://github.com/user-attachments/assets/6c655731-6789-4d25-8a73-9a3130e38f47)

### Step 2. Click Web Console

At the top of the server page there's a blue **Web Console** button. A new
tab opens with a black window — that's your terminal in the browser.

![Web Console button on the Droplet page](https://github.com/user-attachments/assets/ef3a88c6-ece7-40f3-a658-06da2558cc2f)

### Step 3. Log in

In the window:

- **Login as:** type `root`, press Enter.
- **Password:** type the password (the one you created in Step D — the characters
  aren't shown, that's normal), Enter.
- On the first login it will ask you to change the password — create a new one and **save it**.

When you see a prompt like `root@cloude:~#`, you're on the server.

![Web console with the root@cloude prompt](https://github.com/user-attachments/assets/159ba314-9f9d-44c5-a51c-28713055ce05)

---

## Pasting the install script

This is the only "technical" moment. After this it's just talking to Claude.

**What we do:**

1. On your computer, open **Notepad** (Windows) or **TextEdit** (Mac).
2. Copy **the whole script below** into it (click "Expand the script" → select
   everything → copy).
3. **Replace the first 5 lines** with your values from your notes.
4. Copy all the edited text and **paste it into the black window** on the server
   (right-click → Paste).
5. Wait 2–3 minutes.

At the end you'll see a green **✅ ALL DONE!** — which means the bot is already running.

<details>
<summary><b>📋 Expand the install script</b></summary>

```bash
# === FILL IN THESE 5 LINES ===
TG_TOKEN="PASTE_BOTFATHER_TOKEN"
ANTHROPIC_KEY="PASTE_ANTHROPIC_KEY"
GH_USER="PASTE_GITHUB_USERNAME"
GH_TOKEN="PASTE_GITHUB_TOKEN"
REPO_NAME="my-bot"
# === DON'T CHANGE ANYTHING BELOW ===

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
    await update.message.reply_text("Hi! I'm a bot powered by Claude. Ask me anything.")

async def reset(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    history.pop(update.effective_user.id, None)
    await update.message.reply_text("History cleared.")

async def chat(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    uid = update.effective_user.id
    history.setdefault(uid, []).append({"role": "user", "content": update.message.text})
    await ctx.bot.send_chat_action(chat_id=update.effective_chat.id, action="typing")
    try:
        resp = claude.messages.create(
            model="claude-opus-4-7", max_tokens=1024,
            system="You are a friendly assistant. Answer briefly and to the point in English.",
            messages=history[uid],
        )
        text = resp.content[0].text
        history[uid].append({"role": "assistant", "content": text})
        history[uid] = history[uid][-20:]
        await update.message.reply_text(text)
    except Exception:
        log.exception("error")
        await update.message.reply_text("Something went wrong. Please try again.")

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
# Telegram bot powered by Claude

Main file: bot.py. Dependencies: requirements.txt.

## Server
The bot runs on a DigitalOcean VPS.
- Path: /root/my-bot
- Service: mybot.service (systemd)
- Auto-deploy: /root/autodeploy.sh runs every minute,
  does a git pull and restarts the service when there are changes.

## Workflow
Everything goes through GitHub: commit to main → the server updates within a minute.
We don't touch the server by hand.

## User
Speaks English, not a programmer — explain things in plain words.
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
echo "✅ ALL DONE!"
echo "Open Telegram, find your bot, and send /start"
echo "From now on, work only through claude.ai"
echo "============================================="
```

</details>

---

## Checking it works

In Telegram, find your bot (by the username from BotFather) → `/start` → it should
reply.

🎉 **The server is set up.**

---

## Bonus step: Git Relay — so Claude can manage your server itself

After this step, Claude (on claude.ai or in Claude Code) will be able to **run
commands on your server directly**: restart the bot, show
logs, make backups, install new libraries — all without you
having to go into the Browser terminal.

**How it works (in plain words):** a small "mail carrier" script runs
on the server. Every 5 seconds it checks a special file in your
GitHub repository — `cmds/pending.json`. If you (or Claude) put a
command there, it runs it and returns the result in `cmds/result.json`. In other words,
Claude sends commands through GitHub rather than through a terminal — and GitHub
is reachable from anywhere.

> **Setup time:** 5 minutes. Once. After that you **never, ever** go back to the
> Browser terminal.

### Step 1. Ask Claude to set up Git Relay

On claude.ai (or in Claude Code), in the `my-bot` repository, write:

> Set up Git Relay for me in this repository. It's a mechanism that lets
> you run commands on my server directly, without a terminal.
>
> Context:
> - The bot lives in `/root/my-bot/` (or wherever your bot is — tell Claude the correct path)
> - `.env` contains `GITHUB_TOKEN`
> - Auto-deploy already works: `/root/autodeploy.sh` runs `git pull`
>   every minute via a systemd timer
>
> Create and commit to main:
>
> 1. A `cmd_runner.py` file:
>    - Every 5 seconds, reads `cmds/pending.json` via the GitHub API
>    - If there's a new `id` (not equal to `last_cmd_id`), runs `cmd`
>      as a shell command via `subprocess.run`
>    - Pushes the result (stdout, stderr, returncode, ts) to
>      `cmds/result.json` via the GitHub API
>    - Takes `GITHUB_TOKEN` from the environment or from `.env`
>    - Python standard library only
>    - Command timeout of 120 seconds
>    - Trims stdout to the last 3000 characters
>
> 2. A `cmdrunner.service` file (systemd unit):
>    - `User=root` (because commands may need `systemctl`)
>    - `WorkingDirectory=/root/my-bot`
>    - `ExecStart=/usr/bin/python3 /root/my-bot/cmd_runner.py`
>    - `Restart=always`, `RestartSec=10`
>    - `EnvironmentFile=-/root/my-bot/.env`
>
> 3. A `cmds/` folder with two files:
>    - `cmds/pending.json`: `{"id":"init","cmd":"echo ready"}`
>    - `cmds/result.json`: `{}`
>
> 4. Add a "Git Relay" section to README/CLAUDE.md — a short description
>    of the mechanism and the JSON format.
>
> Commit it all in one commit, "Add Git Relay", and push to main.

Claude will create the files and push them. Within ~1 minute auto-deploy will pull them onto
the server.

### Step 2. Install the service once — in the Browser terminal

While Claude is pushing, open the **Browser terminal** on DigitalOcean
(the same one as in Step 2 earlier). Copy this block and paste it:

```bash
cd /root/my-bot && \
sudo cp cmdrunner.service /etc/systemd/system/ && \
sudo systemctl daemon-reload && \
sudo systemctl enable --now cmdrunner.service && \
sleep 2 && \
sudo systemctl status cmdrunner.service --no-pager | head -10
```

What this command does:
- Copies the unit file to where `systemd` will find it
- Tells `systemd` to reload its units
- Enables the service and starts it
- Shows the status

If you see `Active: active (running)` — **you're done**.

### Step 3. Check that Claude can reach the server

On claude.ai, write:

> Check that Git Relay works. Put this in `cmds/pending.json`:
> `{"id":"hello-test-1","cmd":"echo ready && hostname && uptime"}`,
> push to main, wait 10 seconds, read `cmds/result.json` and
> show me the result.

After ~10 seconds Claude will show you your server's output. If you see
`ready`, the server name and the uptime — **Git Relay works**.

### What you can do now

Just write to Claude in plain language:

| I want to | I write |
|---|---|
| Check whether the bot is alive | *"Check the bot's status on the server"* |
| Look at the logs | *"Show me the last 50 lines of the bot's logs"* |
| Restart | *"Restart the bot"* |
| Install a library | *"Install `requests` in the bot's venv"* |
| Make a backup | *"Back up the bot's folder to `/tmp`"* |

Claude will do all of this through Git Relay — without you.

⚠️ **Important security note:** the repository must be **private**. Otherwise
anyone could write commands that would run on your server with
root privileges. If the repo has become public — revoke your GitHub token immediately
and create a new one.

---

# Part 2. From now on, we work only in Claude

## Connecting GitHub to Claude

1. **[claude.ai](https://claude.ai/)** → log in.
2. Profile (bottom left) → **Settings** → **Connectors**.
3. **GitHub** → **Connect** → authorize → choose **only the `my-bot` repo**.

---

## Changing the bot with words

Open a new chat on **claude.ai** and write in plain language, for example:

> My repository `my_username/my-bot` contains the code for my Telegram bot.
> The server pulls changes from main on its own within a minute.
>
> Add a `/help` command with a list of features. Commit to main.

Claude will read the code, make the changes and commit them. Within a minute the server will update
the bot. Go to Telegram and check.

---

## What you can ask Claude for

### Quick everyday edits

| I want to | I write |
|---|---|
| Change the greeting | *"Change the /start text to "Hi, friend!""* |
| Add menu buttons | *"Add a menu to /start with buttons: Services, Prices, Contact"* |
| Save conversations to a file | *"Save all client messages to chats.log with the date and username, so I can review them later"* |
| Working hours | *"From 22:00 to 09:00 Kyiv time, reply "We're closed right now, we'll reply in the morning""* |
| Roll back a bad change | *"Roll back to the previous commit, I didn't like it"* |
| Explain what happened | *"Show the latest changes and explain in plain words what you did"* |

---

### Turn the bot into your personal assistant

The most powerful use is a bot **for you**, not for clients. A helper
that's always at hand in Telegram, remembers your business and takes the
routine off your plate. Copy any template, replace the *italics* with your own details, and send it to Claude.

**Personal task planner:**

> You are my personal planning assistant. You help me keep things in order.
>
> What you can do:
> - Take tasks from me in free form ("Tomorrow a call with the
>   supplier at 14:00, need to prepare questions", "By Friday —
>   invoice for the tax office") and save them to a `tasks.md` file with the date,
>   deadline and priority (work it out from the context yourself).
> - On the `/today` command — show what I have today, in what order
>   it's best to do it, and what can be moved.
> - On the `/week` command — the picture for the next 7 days.
> - If a task has been hanging for more than 3 days — remind me.
> - When I report back ("done X") — mark it as completed.
>
> Style: short, no fluff. Ask for clarification only if something is truly unclear.

**Social media content helper:**

> You are my content helper. My niche: *"describe it"*. Target audience:
> *"describe it"*. Tone of posts: *"friendly/expert/with humor"*.
>
> What you do:
> - When I throw you a thought, a case or a situation from work — you turn it
>   into a ready-to-publish post of 800–1500 characters with a hooky opening and a call to action
>   at the end.
> - You immediately suggest **3 headline options** to choose from.
> - You know my taboos: *"no emoji at the start of lines, no jargon, no
>   promises of results"*.
> - If an idea is weak — say so honestly and suggest how to strengthen it.
> - On the `/ideas` command — give me 5 fresh post topics for this
>   week, based on the season and the niche.

**Financial helper for sole proprietors:**

> You help me keep track of income and expenses. I'm *"a sole proprietor on a
> simplified tax regime / self-employed / ..."*. Keep the records in a
> `finance.md` file.
>
> What you do:
> - Take entries in free form ("received 20000 from client A
>   for service X", "paid 3000 for advertising") and save them with the date,
>   category and a comment.
> - On the `/month` command — a summary: income, expenses by category,
>   tax, net profit.
> - On the `/year` command — the same for the year.
> - By the 20th of the last month of each quarter — remind me to pay
>   my quarterly taxes and social contributions.
> - If an expense looks odd (an unusual category or a large amount) —
>   double-check whether it's a mistake.

**Client memory (mini-CRM):**

> You are my memory about clients. There are many of them, I can't keep them all in my head.
> Store the data in a `crm.md` file, one client per block.
>
> What you do:
> - When I say "new client: *Anna Petrenko, ordered X for Y,
>   contact +380..., we met at Z*" — you save it.
> - On the `/client Name` command — tell me everything you know.
> - When I say "called Anna" / "texted Maria" — add a note
>   with the date.
> - On the `/stale` command — who I haven't written to in more than 30 days.
> - You never mix up clients and never make up data. If you're not sure —
>   ask.

---

### Make a bot for talking to clients

If you need the bot to **reply to clients**, here are other templates:

**Front-desk bot (bookings / requests):**

> Make the bot the front-desk admin for my *"salon / studio / service"*. Style —
> friendly, polite and formal, emoji in moderation.
>
> What it can do:
> - Tell people about services and prices *(put them in a `services.md` file)*.
> - Book a client: ask for their name, phone, service, preferred date and time.
>   Forward the finished request to me in Telegram (my ID: *123456789*).
> - For off-topic questions — "I'll check with the specialist and get back to you during working hours".
>
> What it **doesn't do:** it doesn't confirm bookings on its own, doesn't discuss
> contraindications, doesn't criticize competitors.

**FAQ bot based on a knowledge base:**

> Put a `knowledge.md` file in the repo with a description of my business
> *(I'll fill it in myself)*. The bot should:
> - Answer clients **only** based on this file.
> - If the file doesn't have the answer — honestly say "I don't know, I'll pass it on to a colleague"
>   and forward the question to me in Telegram (ID: *123456789*).
> - Never make up facts, prices or addresses.

---

### Your own prompt — how to write one from scratch

If none of the templates fit, **tell Claude in words what you want**, using
this structure:

> 1. **Who the bot is** (role): *"You are ..."*
> 2. **How it communicates** (tone): friendly / strict / casual / with humor
> 3. **What it can do** (a list of specific tasks)
> 4. **What it doesn't do** (restrictions)
> 5. **Where it gets information** (a file in the repo / only from memory / ask me)
> 6. **What it does in tricky situations** (decline / hand off to a human)

Put all of this into one message to Claude — it will figure out how to
write it into the bot's code. You don't even have to format it as a list; write it
as a single block of text — Claude will understand.

**Tip:** start with a minimal prompt, test it on 2-3 real messages,
and then add to it — *"and also don't let it ..."*, *"and add that it should ..."*. This
turns out more precise than trying to anticipate everything at once.

---

# If something breaks — write to Claude

Don't go into the server yourself. Just **open a chat on claude.ai** and describe the problem
as it is. Examples:

> The bot isn't responding after your last change, put it back the way it was.

> The bot has been silent for an hour, please figure out what's wrong.

> I accidentally clicked something I shouldn't have — fix it.

> I don't understand this error: *(paste the text)*

Claude will:
- check the code,
- roll back to a working version or fix it,
- if something needs to be done on the server — give you a **ready-made command** that
  you just copy into the **DigitalOcean Console**.

No guesswork or Googling needed.

---

## Security

- **Don't show** your tokens and passwords to anyone. Not even in a screenshot.
- All secrets live on the server in the `.env` file — they **never
  get into** GitHub (we set that up automatically).
- If you accidentally exposed a token — revoke it right away:
  - Telegram: `/revoke` in [@BotFather](https://t.me/BotFather)
  - GitHub: [tokens page](https://github.com/settings/tokens?type=beta) → Revoke
  - Anthropic: [keys page](https://console.anthropic.com/settings/keys) → Delete
  - And create new ones.

---

## All the links in one place

- **Claude:** [claude.ai](https://claude.ai/)
- **DigitalOcean** (sign-up with the $200 bonus): [m.do.co/c/8d079274e061](https://m.do.co/c/8d079274e061)
- **DigitalOcean** (dashboard, if you already have an account): [cloud.digitalocean.com](https://cloud.digitalocean.com/)
- **GitHub:** [github.com](https://github.com/)
- **Anthropic console:** [console.anthropic.com](https://console.anthropic.com/)
- **Telegram BotFather:** [@BotFather](https://t.me/BotFather)

Good luck!
