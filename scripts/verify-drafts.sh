#!/usr/bin/env bash
# Fails if a draft case study leaked into the production build (dist/) or its sitemap (spec §21).
# Run after `astro build` (without SHOW_DRAFTS). Used by `task verify:drafts` and CI.
set -euo pipefail

DIST="${1:-dist}"
DEFAULT_LOCALE="en"

[ -d "$DIST" ] || { echo "No build output in $DIST/: run astro build first." >&2; exit 2; }

leaked=0
checked=0
while IFS= read -r file; do
  locale=$(basename "$(dirname "$file")")
  slug=$(grep -m1 '^slug:' "$file" | awk '{print $2}')
  prefix=""
  [ "$locale" != "$DEFAULT_LOCALE" ] && prefix="$locale/"
  path="${prefix}work/${slug}"
  checked=$((checked + 1))
  if [ -e "$DIST/$path" ] || grep -qs "/$path/" "$DIST"/sitemap-*.xml; then
    printf '  \033[1;31m✗\033[0m draft leaked: /%s/ (%s)\n' "$path" "$file"
    leaked=1
  fi
done < <(grep -rl --include='*.mdoc' '^publicationStatus: draft' src/content/projects || true)

if [ "$leaked" -eq 0 ]; then
  printf '  \033[1;32m✓\033[0m no drafts in %s/ or its sitemap (%d checked)\n' "$DIST" "$checked"
fi
exit "$leaked"
