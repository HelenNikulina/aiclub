# Persistent context for Claude Code sessions

## Mac access via Cloudflare Tunnel

The web Claude Code sandbox is in a datacenter (some sites like Kinescope block its
IP). To run commands on the user's Mac instead, the sandbox SSHes into the Mac
through a Cloudflare Tunnel.

### Connection facts
- **Tunnel hostname:** `ai-call.uk`
- **Mac user:** _to be filled in — replace `REPLACE_ME` in `scripts/bootstrap-mac-ssh.sh`_
- **CF Access on hostname:** unknown (check Zero Trust → Access → Applications)
- **Tunnel ingress to ssh://localhost:22:** unverified (check `~/.cloudflared/config.yml` on Mac)

### How to use this in a new session

At the start of every web session run:

```bash
bash scripts/bootstrap-mac-ssh.sh
```

The script:
1. Installs `cloudflared` and `openssh-client` if missing.
2. Generates a fresh ed25519 keypair (sandbox is ephemeral, so a new key per session
   is the simplest secure model).
3. Writes `~/.ssh/config` with `ProxyCommand cloudflared access ssh --hostname %h`.
4. Prints **one command** for the user to copy-paste in Mac Terminal that appends the
   new public key to `~/.ssh/authorized_keys`.

After the user runs that one command, Claude can:

```bash
ssh ai-call.uk 'whoami && uname -a'
ssh ai-call.uk 'yt-dlp --add-header "Referer:https://example.com/" -o "%(title)s.%(ext)s" "URL"'
```

### One-time Mac setup (already done if SSH works)

```bash
# 1. Enable Remote Login
sudo systemsetup -setremotelogin on

# 2. Confirm Cloudflare tunnel routes ai-call.uk → ssh://localhost:22
#    (cat ~/.cloudflared/config.yml ; should have an ingress rule like:
#       - hostname: ai-call.uk
#         service: ssh://localhost:22)

# 3. If CF Access is on, either disable it for this hostname
#    OR create a service token and bypass-policy and add CF_ACCESS_CLIENT_ID/SECRET
#    to the sandbox env each session.
```

### Security model
- Private SSH key lives only in the sandbox memory for this session and dies with it.
- Public key in `~/.ssh/authorized_keys` on Mac is identifiable as `claude-sandbox-YYYYMMDD`,
  so old ones can be pruned by `sed` or by hand at any time.
- Anyone with access to this sandbox session can SSH to the Mac while it lives.
