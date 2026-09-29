🎓 GUIDE: Several Claude agents at once on one server — a parallel command queue

This guide is for those who already have a VPS with Claude Code and a working `cmd_runner`
(if not, start with the guide "Turning a Telegram bot into a full-fledged
agent"). Here we'll get rid of a pain point that everyone hits sooner or later.

**Sound familiar?** You opened two or three Claude sessions and gave each its own
task, and they start fighting: "a command is already running on the server",
responses get mixed up, one session overwrites another. In the end you have to
do everything one at a time. Slow and annoying.

**Why this happens.** The classic `cmd_runner` has **one slot** for a command: all sessions
write to the same `pending.json` file, and the server picks up one command at a time.
Two sessions at once → the second overwrites the first. It's not that the server is weak; it's a bottleneck
in the design of the queue itself.

**What becomes possible after this guide:**
- several agents (and you yourself in several tabs) work **at the same time**;
- up to 10 commands run in parallel, the rest wait in the queue, nothing
  gets lost;
- sessions don't get in each other's way and don't mix up responses.

---

## The idea in plain words

Instead of **one mailbox for everyone** (where everyone drops letters and
overwrites each other), we make **a separate mailbox for each letter**.

- Before: everyone writes to one `pending.json` file → a fight over the slot.
- Now: each task is a **separate file** in the `cmds/jobs/` folder, and the response is
  a separate file in `cmds/results/`. Different names → collisions are impossible by design.

The server simply looks at which new files have appeared in `cmds/jobs/` and runs
them **in parallel** (with a worker pool). Once done, it puts the response in
`cmds/results/` and removes the task file.

---

## Step 1. Teach `cmd_runner` to read the task folder

In the runner loop, instead of "read a single `pending.json`" we do "look through
all files in `cmds/jobs/` and hand each new one to the thread pool". The key
pieces (Python):

```python
from concurrent.futures import ThreadPoolExecutor
executor = ThreadPoolExecutor(max_workers=10)   # up to 10 at once
submitted = set()                                # so we don't run anything twice

# in the main loop, every ~5 seconds:
for entry in list_dir("cmds/jobs"):              # list of files in the folder
    name = entry["name"]
    if not name.endswith(".json") or name in submitted:
        continue
    submitted.add(name)
    job = read_json(entry["path"])               # {id, cmd, cwd?, timeout?}
    executor.submit(run_job, name, job)          # run in parallel
```

And `run_job` executes the command, writes the response to `cmds/results/<id>.json`, and
deletes the task file from `cmds/jobs/`.

> Tip: wrap Git writes (committing responses) in a single "lock" (Lock)
> so parallel workers don't jostle over the branch. The commands themselves still
> run in parallel, and that's the slowest part.

## Step 2. How to submit a task now

Put a file with a **unique** name into `cmds/jobs/`:

`cmds/jobs/my-task-20260613-0715.json`
```json
{"id":"my-task-20260613-0715","cmd":"echo hello from the server","cwd":"/home/<user>/<bot>"}
```

| Field | Required | What it is |
|---|---|---|
| `id` | yes | Unique identifier. Handy format: `name-date-time`. |
| `cmd` | yes | The command for the server. |
| `cwd` | no | Working directory. |
| `timeout` | no | How many seconds to wait (default 120). |

Push to your branch. If the push is rejected (someone pushed first),
run `git pull --rebase` and try again. **Everyone's files are different, so there are no conflicts.**

## Step 3. Get the response

After ~5–10 seconds, read **your own** file `cmds/results/<your-id>.json`:

```json
{"id":"my-task-20260613-0715","stdout":"hello from the server\n","returncode":0}
```

The main rule: **read your own `id`**, not "the latest response": others
may be working alongside you.

---

## Pitfalls (so you don't step on them)

- **`id` must always be unique.** Otherwise responses get mixed up.
- **Don't paste giant base64 blobs into a single command.** It's slow, and
  Claude's safety system may block the request ("Request was blocked").
  If you need to get a file onto the server, have the agent **download it via the API
  (raw)** right inside the script instead of pasting huge base64.
- **Don't print secrets** (tokens, passwords) in commands: the response is stored
  in Git. No "show me the contents of .env".
- **The queue solves the fight over the channel, not over the action.** Two sessions shouldn't
  perform a conflicting action at the same time, such as restarting the bot or
  editing the same file. That's a matter of task logic.

---

## Bonus: let the queue update itself

Add a tiny check to the runner: every ~minute (when no tasks are
running) it compares its own code with the branch and, if it has changed, restarts with
the new code. Then **any queue update is just a push to the branch**, and
you don't have to do anything by hand on the server.

---

Summary: one file per task instead of a shared slot + a worker pool,
and your agents work side by side instead of taking turns. Try opening two
sessions and giving them different tasks at the same time: now both will run together. 🚀

#guide #tool
