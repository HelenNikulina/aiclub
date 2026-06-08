🎓 ГАЙД №__: Переводимо свого Telegram-бота на підписку Claude (без витрати API-токенів)

Якщо ти вже зробив(ла) свого Telegram-бота, який відповідає через Claude — він майже напевно ходить у **платний API** (рядок `anthropic.Anthropic(api_key=...)`). За кожну відповідь капають токени, окремо від твоєї підписки.

Цей гайд показує, як зробити, щоб бот відповідав з твоєї **підписки Claude (Pro/Max)** і **не витрачав API-токени взагалі** — додавши лише **один файл і один рядок коду**.

──────────────────────

## Чому це працює

Головне правило: підписку Claude можна витрачати ТІЛЬКИ через `claude` (CLI), а не через прямі запити до API з ключем.

Тож ми ставимо невелику «прослойку»: вона перехоплює всі звернення бота `import anthropic` → `client.messages.create(...)` і непомітно пускає їх через команду `claude -p`, яка працює на підписці. **Код самого бота переписувати не треба** — лише підключити прослойку.

──────────────────────

## Передумови (зробити один раз)

1. **Встановлений Claude Code** на тій машині, де живе бот (компʼютер або VPS).
2. **Claude залогінений твоєю підпискою.** На сервері без браузера найзручніше:
   ```
   claude setup-token
   ```
   (видасть OAuth-токен підписки на рік; на звичайному компʼютері достатньо `claude` → `/login` → вхід через акаунт Pro/Max).
3. **Прибрати `ANTHROPIC_API_KEY` з оточення бота.** Якщо ця змінна задана — Claude віддасть перевагу платному ключу, а не підписці. (Можна лишити її у файлі `.env` для сумісності — прослойка сама вирізає її перед викликом CLI.)

Перевірити, що CLI працює на підписці:
```
claude -p "скажи одним словом: працює"
```
Якщо відповів — усе готово.

──────────────────────

## Крок 1. Створи файл `claude_cli_shim.py`

Поклади його поруч зі своїм ботом (у ту ж папку) з таким вмістом:

```python
"""
claude_cli_shim — пускає `import anthropic` через локальний CLI `claude -p`,
щоб текстові генерації йшли з підписки Claude (Pro/Max), а не з платних API-токенів.

Підключення: на самому початку свого бота (ДО будь-якого `import anthropic`) додай:
    import claude_cli_shim

Передумова: `claude` залогінений підпискою; ANTHROPIC_API_KEY вирізається для CLI-викликів.
"""
import os
import sys
import subprocess
import asyncio

try:
    import anthropic as _real_anthropic   # для рідкісних випадків (картинки/tools) — відкат на API
except Exception:
    _real_anthropic = None

_CLI_TIMEOUT = 120


class APIError(Exception):
    pass


def _map_model(model):
    m = (model or "").lower()
    if "haiku" in m:
        return "haiku"
    return "sonnet"   # opus/sonnet/невідоме -> sonnet (економніше по лімітах; прибери рядок нижче, якщо хочеш opus)


def _has_image(messages):
    for msg in messages or []:
        c = msg.get("content")
        if isinstance(c, list):
            for b in c:
                if isinstance(b, dict) and b.get("type") == "image":
                    return True
    return False


def _build_prompt(messages):
    msgs = messages or []

    def _text(content):
        if isinstance(content, list):
            return "\n".join(b.get("text", "") for b in content
                             if isinstance(b, dict) and b.get("type") == "text")
        return content if isinstance(content, str) else str(content)

    if len(msgs) == 1 and msgs[0].get("role", "user") == "user":
        return _text(msgs[0].get("content", ""))
    parts = []
    for m in msgs:
        who = "User" if m.get("role") == "user" else "Assistant"
        parts.append(f"{who}: {_text(m.get('content', ''))}")
    return "\n\n".join(parts)


class _TextBlock:
    def __init__(self, text):
        self.text = text
        self.type = "text"


class _Response:
    def __init__(self, text):
        self.content = [_TextBlock(text)]
        self.stop_reason = "end_turn"


def _run_cli(model, system, messages, max_tokens):
    prompt = _build_prompt(messages)
    cmd = ["claude", "-p", "--model", _map_model(model)]
    if system:
        cmd += ["--append-system-prompt", system]
    env = {k: v for k, v in os.environ.items() if k != "ANTHROPIC_API_KEY"}
    try:
        r = subprocess.run(cmd, input=prompt, capture_output=True, text=True,
                           timeout=_CLI_TIMEOUT, env=env)
    except subprocess.TimeoutExpired:
        raise APIError(f"claude CLI timeout ({_CLI_TIMEOUT}s)")
    if r.returncode != 0:
        raise APIError(f"claude CLI rc={r.returncode}: {(r.stderr or r.stdout or '')[:300]}")
    out = (r.stdout or "").strip()
    if not out:
        raise APIError("claude CLI returned empty output")
    return _Response(out)


def _needs_fallback(kw):
    return bool(kw.get("tools")) or _has_image(kw.get("messages"))


def _fallback_sync(kw):
    if _real_anthropic is None:
        raise APIError("real anthropic SDK unavailable")
    return _real_anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY")).messages.create(**kw)


async def _fallback_async(kw):
    if _real_anthropic is None:
        raise APIError("real anthropic SDK unavailable")
    return await _real_anthropic.AsyncAnthropic(api_key=os.environ.get("ANTHROPIC_API_KEY")).messages.create(**kw)


class _Messages:
    def create(self, **kw):
        if _needs_fallback(kw):
            return _fallback_sync(kw)
        return _run_cli(kw.get("model"), kw.get("system"), kw.get("messages"), kw.get("max_tokens", 1024))


class _AsyncMessages:
    async def create(self, **kw):
        if _needs_fallback(kw):
            return await _fallback_async(kw)
        return await asyncio.to_thread(
            _run_cli, kw.get("model"), kw.get("system"), kw.get("messages"), kw.get("max_tokens", 1024))


class Anthropic:
    def __init__(self, *a, **k):
        self.messages = _Messages()


class AsyncAnthropic:
    def __init__(self, *a, **k):
        self.messages = _AsyncMessages()


sys.modules["anthropic"] = sys.modules[__name__]
```

──────────────────────

## Крок 2. Підключи прослойку (один рядок)

На самому початку свого бота, **до будь-якого `import anthropic`**, додай:

```python
import claude_cli_shim
```

Наприклад одразу після `load_dotenv()` / своїх перших імпортів. Більше нічого в коді бота міняти не треба — усі твої `client.messages.create(...)` тепер підуть на підписку.

──────────────────────

## Крок 3. Перезапусти бота

```
# приклад для systemd:
sudo systemctl restart твій-бот.service
# або просто заново запусти свій python-скрипт
```

Готово. Напиши боту в Telegram — відповідь прийде вже з підписки, API-токени не витрачаються.

──────────────────────

## Як переконатися, що працює

- У логах бота немає помилок старту.
- Спробуй у терміналі: `claude -p "тест"` — якщо відповідає, CLI на підписці працює.
- На сторінці використання API (console.anthropic.com) витрати на бота більше не ростуть.

──────────────────────

## Чесні обмеження

- **Потрібен `claude` на тій же машині, де бот**, і він має бути залогінений підпискою.
- **Картинки (vision) і виклики з `tools=`** прослойка не пускає через CLI — вона відкочує їх на звичайний API (рідкісні випадки). Якщо у твоєму боті є аналіз фото — це окрема, трохи технічніша тема, напишіть у клубі.
- **Ліміти.** Витрати йдуть не грошима, а лімітами твого плану Pro/Max. Для частих дрібних задач лиши модель `haiku` (у `_map_model`).
- **Швидкість.** Кожна відповідь — це запуск `claude` (кілька секунд). Для бота-помічника це нормально.

──────────────────────

## FAQ

**Треба переписувати бота?** Ні. Один файл + один рядок імпорту.

**А якщо в мене бот не на Python?** Цей приклад — для Python (бібліотека `anthropic`). Принцип той самий для будь-якої мови: викликати не API, а `claude -p` з вирізаним ключем.

**Це безкоштовно?** В межах твоєї підписки — так. Окремі API-токени більше не списуються.

#гайд #інструмент #новини
