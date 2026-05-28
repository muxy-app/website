#!/bin/bash
# Demo extension client.
#
# Connects to MUXY_SOCKET_PATH, identifies as MUXY_EXTENSION_ID, then runs a
# loop that:
#   1. reads `refreshSeconds` from its own settings (defaulting to 5);
#   2. updates the left status bar item ("ticker") with a UTC timestamp;
#   3. sleeps and repeats.
#
# This exercises the new `extension.settings.get` and `extension.statusbar.set`
# verbs in addition to the older identify handshake.

set -eu

SOCKET="${MUXY_SOCKET_PATH:?MUXY_SOCKET_PATH is required}"
EXT_ID="${MUXY_EXTENSION_ID:?MUXY_EXTENSION_ID is required}"
TOKEN="${MUXY_EXTENSION_TOKEN:?MUXY_EXTENSION_TOKEN is required}"

# Round-trip a single request: write one line, read one line back.
send() {
    local request="$1"
    printf '%s\n' "$request" | nc -U -w 2 "$SOCKET" | head -n 1
}

# Get a setting value as raw JSON (strips the "ok\t" prefix when present).
get_setting() {
    local key="$1"
    local response
    response=$(send "identify|${EXT_ID}|${TOKEN}
extension.settings.get|${key}" | tail -n 1)
    case "$response" in
        "ok\t"*) printf '%s' "${response#ok	}" ;;
        ok)      printf '' ;;
        *)       printf '' ;;
    esac
}

# Update the left status bar item text.
set_ticker() {
    local text="$1"
    send "identify|${EXT_ID}|${TOKEN}
extension.statusbar.set|ticker|${text}" >/dev/null
}

# Parse a JSON number conservatively; fall back to the default when empty/null.
default_interval=5
parse_interval() {
    local raw="$1"
    case "$raw" in
        ''|null) printf '%s' "$default_interval" ;;
        *)
            local n
            n=$(printf '%s' "$raw" | tr -d '"' | awk '{ printf "%d", $0 + 0 }')
            if [ "$n" -lt 1 ]; then printf '%s' "$default_interval"; else printf '%s' "$n"; fi
            ;;
    esac
}

set_ticker "starting"

while true; do
    interval=$(parse_interval "$(get_setting refreshSeconds)")
    set_ticker "$(date -u +%H:%M:%SZ)"
    sleep "$interval"
done
