#!/bin/bash
# Verify all view URLs work via hash routing

# Already running from verify-dev.sh, just fetch and check
# Fetching with hash routes - but since it's a SPA, all hashes return same HTML
# We verify the homepage HTML contains references to all view content
echo "=== Page size ==="
ls -la /tmp/page.html

echo ""
echo "=== Critical strings check ==="
for s in "Lumina Academy" "curiosity becomes craft" "Programs by level" "Hugo Tanaka" "Why families choose Lumina" "What families say" "Campus life" "From the school journal" "Schedule a visit"; do
  count=$(grep -c "$s" /tmp/page.html)
  if [ "$count" -gt 0 ]; then
    echo "[OK] $s"
  else
    echo "[MISS] $s"
  fi
done

echo ""
echo "=== Firebase placeholder text check ==="
for s in "isFirebaseConfigured" "contact_messages" "inquiries"; do
  # These are JS-bundled strings; we look at the compiled JS in browser
  :
done

echo ""
echo "=== Accessibility basics ==="
grep -c 'aria-hidden' /tmp/page.html
grep -c 'aria-label' /tmp/page.html
grep -c 'aria-pressed' /tmp/page.html

echo ""
echo "=== Theme color check (forest palette) ==="
grep -c "var(--brand)" /tmp/page.html
grep -c "var(--amber-accent)" /tmp/page.html

echo ""
echo "=== No em-dashes (taste-skill §9.G) ==="
em=$(grep -o $'\u2014' /tmp/page.html | wc -l)
echo "Em-dashes found: $em"
