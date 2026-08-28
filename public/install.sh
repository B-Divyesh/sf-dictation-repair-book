#!/bin/sh
set -eu

BASE="https://github.com/B-Divyesh/sf-dictation-repair-book/releases/latest/download"
OS=$(uname -s)
ARCH=$(uname -m)

case "$OS" in
  Darwin)
    case "$ARCH" in arm64|aarch64) FILE="Dictation-Repair-Book-macos-arm64.dmg";; *) FILE="Dictation-Repair-Book-macos-x64.dmg";; esac
    DEST="${HOME}/Downloads/${FILE}"
    ;;
  Linux)
    case "$ARCH" in x86_64|amd64) FILE="Dictation-Repair-Book-linux-x64.AppImage";; *) echo "Unsupported Linux architecture: $ARCH" >&2; exit 1;; esac
    DEST="${HOME}/.local/bin/dictation-repair-book"
    mkdir -p "${HOME}/.local/bin"
    ;;
  *) echo "Unsupported system: $OS" >&2; exit 1;;
esac

TMP_DIR=$(mktemp -d)
trap 'rm -rf "$TMP_DIR"' EXIT HUP INT TERM
curl -fsSL "$BASE/$FILE" -o "$TMP_DIR/$FILE"
curl -fsSL "$BASE/SHA256SUMS" -o "$TMP_DIR/SHA256SUMS"
EXPECTED=$(awk -v file="$FILE" '$2 == file {print $1}' "$TMP_DIR/SHA256SUMS")
[ -n "$EXPECTED" ] || { echo "No checksum published for $FILE" >&2; exit 1; }
if command -v sha256sum >/dev/null 2>&1; then ACTUAL=$(sha256sum "$TMP_DIR/$FILE" | awk '{print $1}'); else ACTUAL=$(shasum -a 256 "$TMP_DIR/$FILE" | awk '{print $1}'); fi
[ "$EXPECTED" = "$ACTUAL" ] || { echo "Checksum mismatch; refusing to install." >&2; exit 1; }
mv "$TMP_DIR/$FILE" "$DEST"

if [ "$OS" = "Linux" ]; then
  chmod 755 "$DEST"
  echo "Installed verified AppImage to $DEST"
  echo "Ensure ${HOME}/.local/bin is on PATH, then run: dictation-repair-book"
else
  echo "Downloaded verified disk image to $DEST"
  echo "Opening it now. Drag the app to Applications; because it is unsigned, right-click it and choose Open the first time."
  open "$DEST"
fi
