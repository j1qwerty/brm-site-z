#!/bin/bash
# Start dev, wait, fetch, save - all in one shell session

# Kill any existing (allow failure if none running)
pkill -9 -f next 2>/dev/null || true
sleep 3
rm -f /tmp/dev.log /tmp/page.html

# Start dev in background  
nohup setsid bash -c 'cd /home/z/my-project && exec bun x next dev -p 3000' > /tmp/dev.log 2>&1 < /dev/null &
disown

# Wait until ready
for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15; do
  sleep 3
  if curl -sI --max-time 3 http://localhost:3000 2>&1 | head -1 | grep -q "200"; then
    echo "[$i] Server ready"
    break
  fi
  echo "[$i] Waiting..."
done

# Immediate fetch
echo "=== Fetching HTML ==="
curl -s --max-time 60 http://localhost:3000 > /tmp/page.html
ls -la /tmp/page.html

echo "=== Title ==="
grep -oE '<title[^>]*>[^<]+' /tmp/page.html | head -2

echo "=== Lumina mentions ==="
grep -c "Lumina" /tmp/page.html

echo "=== Hero text ==="
grep -c "curiosity becomes craft" /tmp/page.html

echo "=== Headings ==="
grep -oE '<h[12][^>]*>[^<]{8,150}' /tmp/page.html | head -10

echo "=== Status ==="
tail -3 /tmp/dev.log
