# Guide: Claude Code Memory Between Sessions (for claude.ai/code)

This guide is for people who work with Claude Code in the browser or the desktop app (`claude.ai/code`). If you use the **local Claude Code CLI** in a terminal, the approach is different: see the "Local CLI" section at the end.

---

## What you get

- Claude **knows you and your projects** in every new chat
- No need to explain "I'm a Python developer", "I use FastAPI", "my bot is on branch X" every single time
- Claude **records** important decisions and facts **on its own** as it works, so nothing is lost if a session crashes

---

## Why the "standard" approach does NOT work

You may have been advised to set up `~/.claude/CLAUDE.md`, `~/.claude/MEMORY.md`, or hooks in `~/.claude/settings.json`. **For `claude.ai/code` this is pointless.** Here's why:

- Every new chat starts in a **new cloud sandbox** (a temporary container).
- The sandbox has an **empty home folder** `~/.claude/`. Everything you wrote there in the previous chat is gone.
- Hooks in `settings.json` never get a chance to fire even once: the file doesn't exist in the new chat.

What **survives** a new sandbox is **your GitHub repository**, because it is cloned from GitHub at the start of every chat. Conclusion: **memory has to live in the repo**, not in the home folder.

---

## The approach that works: two files in the repo

| File | Path | What it contains | Who writes it |
|---|---|---|---|
| `CLAUDE.md` | repo root | Permanent context: who you are, rules, infrastructure | You + Claude on request |
| `MEMORY.md` | repo root | Session summaries: decisions, changes, unfinished work | Claude, automatically and proactively |

Both files are committed to the **`main`** branch. Every new chat clones `main` → sees these files → knows you.

---

## Step by step

### Step 1. Open your working repo in Claude Code

Go to `https://claude.ai/code` and start a new chat on the repo you work with regularly. If you don't have one, create a new repo on GitHub (for example, `my-claude-memory`) and open it.

### Step 2. Make sure the default branch is `main`

This is critical. If the default is something else, a new chat will clone that branch and won't see the memory.

1. Open `https://github.com/<username>/<repo>/settings`
2. On the left: `General` → scroll to the bottom
3. Find the **Default branch** section
4. If it's not `main`, click ⇄ → choose `main` → **Update** → confirm

### Step 3. Ask Claude to create `CLAUDE.md`

Copy this request into the chat:

> Create a `CLAUDE.md` file in the repo root for permanent context. Structure:
> - Heading "Context for Claude — read before doing anything"
> - Section "Session memory": "also read `MEMORY.md` in the repo root right away"
> - Section "Who I am" (empty, I'll fill it in)
> - Section "Rules for working with me" (empty)
> - Section "My projects" (empty)
>
> Commit it to the `main` branch and push with `git push origin main`.

### Step 4. Ask Claude to create `MEMORY.md`

> Create a `MEMORY.md` file in the repo root with the heading "Memory — session summaries" and a short description of the format: new sections go at the end of the file, heading in the form `## YYYY-MM-DD HH:MM — short description`, 3-7 bullets. Commit to `main`, push.

### Step 5. Fill `CLAUDE.md` with your context

Just tell Claude about yourself. Example:

> Write into `CLAUDE.md` (the "Who I am" and "Rules" sections):
> - I'm a beginner Python developer and need detailed explanations with examples
> - Always reply in English
> - My main project is a Telegram bot, branch `bot-main`
> - Server is a Hostinger VPS, accessed via Browser terminal
>
> Commit to `main`, push.

### Step 6. Add the proactivity rule to `CLAUDE.md`

Without it, Claude will write to `MEMORY.md` only when you ask. With it, Claude does it on its own.

> Add a section "How to update MEMORY.md" to `CLAUDE.md`:
>
> Don't wait for an "update memory" command and don't wait for the end of the session. Write immediately when:
> - a technical decision is made
> - a significant commit/push happens
> - a fact/limitation is discovered that will matter later
> - there's an unfinished task that needs to be handed over to the next session
>
> Make every `MEMORY.md` update **only on the `main` branch**:
> ```
> current=$(git branch --show-current)
> git checkout main && git pull origin main
> # Edit MEMORY.md (new section at the end)
> git add MEMORY.md && git commit -m "memory: <description>" && git push origin main
> git checkout "$current"
> ```
>
> Commit this addition to `main`, push.

### Step 7. Check in a new chat

1. Close the current chat
2. Open the same repo in a **new** chat on `claude.ai/code`
3. Ask: **"What do you know about me?"**
4. It should immediately recount everything from `CLAUDE.md` and `MEMORY.md`

If it does, everything works. If it says "I don't remember anything", see the table below.

---

## What NOT to put in these files

`CLAUDE.md` and `MEMORY.md` live in git → visible to everyone with access to the repo. If the repo is public, visible to literally everyone on the internet.

**Forbidden:**

- API keys, tokens, passwords (even test ones — it's about the habit)
- Personal data of third parties
- Production secrets — they belong in `.env` + `.gitignore`

In a private repo, test tokens are technically OK, but the habit of keeping everything in `.env` is more reliable.

---

## How to clean up when `MEMORY.md` gets bloated

Once a month:

> Open `MEMORY.md` on the `main` branch and remove sections older than a month (except unfinished tasks and important decisions). Commit, push to `main`.

---

## What to fix if it doesn't work

| Symptom | Cause | Fix |
|---|---|---|
| New chat says "I don't remember anything" | Default branch ≠ `main` | GitHub → Settings → General → Default branch → `main` |
| `MEMORY.md` doesn't update on its own | Claude didn't pick up the proactivity rule | "Read `CLAUDE.md` in full and follow the section about MEMORY.md" |
| `git checkout main` error | Uncommitted changes on the working branch | First `git add . && git commit -m "wip"`, then `checkout main` |
| Commits to `MEMORY.md` happen, but a new chat doesn't see them | Pushed to a feature branch, not to `main` | `git log origin/main -- MEMORY.md` — check that your commits are there |

---

## Local CLI — a separate case

If you use Claude Code **in a terminal on your own computer** (the `claude` command, not the browser):

- The home folder `~/.claude/` is **not wiped** between sessions
- You can set up **hooks** for automatic summaries via a Stop hook
- The `~/.claude/MEMORY.md` + `settings.json` approach works

But that's a different world. Most people today use `claude.ai/code`, and for them only the repo-based approach from this guide works.

---

## Key rules

1. **Memory lives in the repo** on the `main` branch, not in `~/.claude/`. In the sandbox, `~/.claude/` gets wiped.
2. **The default branch must be `main`**, otherwise new chats clone a different branch.
3. **`CLAUDE.md`** is the permanent part (who you are, rules). **`MEMORY.md`** is the dynamic part (what happened in sessions).
4. **Update `MEMORY.md` only on `main`**. New chats can't see feature branches.
5. **No secrets in git.** Tokens go in `.env`.
6. **The proactivity rule** in `CLAUDE.md` matters more than reminding it to "update memory": a session can crash before you remember to ask.
