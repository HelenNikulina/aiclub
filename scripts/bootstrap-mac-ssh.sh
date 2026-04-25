#!/usr/bin/env bash
# Bootstrap SSH access from this Claude Code sandbox to the user's Mac
# via the existing Cloudflare Tunnel at ai-call.uk.
#
# Run this at the start of every new web session.

set -euo pipefail

HOSTNAME="ai-call.uk"
MAC_USER="${MAC_USER:-REPLACE_ME}"   # override with: MAC_USER=helen bash bootstrap-mac-ssh.sh
KEY="$HOME/.ssh/id_ed25519_mac"
TAG="claude-sandbox-$(date +%Y%m%d-%H%M%S)"

echo "==> Installing cloudflared and openssh-client if missing"
if ! command -v cloudflared >/dev/null 2>&1; then
  curl -fsSL --insecure -o /tmp/cloudflared \
    https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
  install -m 755 /tmp/cloudflared /usr/local/bin/cloudflared
fi
if ! command -v ssh >/dev/null 2>&1; then
  apt-get update -qq && apt-get install -y -qq openssh-client
fi

echo "==> Generating fresh ed25519 keypair ($TAG)"
mkdir -p "$HOME/.ssh"
chmod 700 "$HOME/.ssh"
rm -f "$KEY" "$KEY.pub"
ssh-keygen -t ed25519 -N "" -C "$TAG" -f "$KEY" >/dev/null

echo "==> Writing ~/.ssh/config"
cat > "$HOME/.ssh/config" <<EOF
Host $HOSTNAME mac
    HostName $HOSTNAME
    User $MAC_USER
    IdentityFile $KEY
    IdentitiesOnly yes
    ProxyCommand /usr/local/bin/cloudflared access ssh --hostname %h
    StrictHostKeyChecking accept-new
    UserKnownHostsFile $HOME/.ssh/known_hosts
    ServerAliveInterval 30
EOF
chmod 600 "$HOME/.ssh/config"

PUBKEY="$(cat "$KEY.pub")"

cat <<MSG

================================================================
  Sandbox is ready. Now run THIS one command in Mac Terminal
  (it appends the new public key to ~/.ssh/authorized_keys):
================================================================

mkdir -p ~/.ssh && chmod 700 ~/.ssh && \\
  printf '%s\\n' '$PUBKEY' >> ~/.ssh/authorized_keys && \\
  chmod 600 ~/.ssh/authorized_keys

================================================================

Then test from this sandbox:

  ssh $HOSTNAME 'whoami && uname -a'

If it asks for CF Access auth, you have an Access policy on
$HOSTNAME — either disable it for this host or set
CF_ACCESS_CLIENT_ID / CF_ACCESS_CLIENT_SECRET in the env.

If MAC_USER is still REPLACE_ME, edit ~/.ssh/config or rerun:
  MAC_USER=yourlogin bash scripts/bootstrap-mac-ssh.sh

MSG
