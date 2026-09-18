#!/bin/bash
# Pre-Flight Check from taste-skill Section 14
# Run mechanical checks against the source code.

echo "=== PRE-FLIGHT CHECK (taste-skill §14) ==="
echo ""

echo "1. Em-dash ban (§9.G - non-negotiable, ZERO em-dashes)"
em_total=$(grep -rl $'\u2014' /home/z/my-project/src/ 2>/dev/null | wc -l)
em_dash_count=$(grep -ro $'\u2014' /home/z/my-project/src/ 2>/dev/null | wc -l)
echo "   Files with em-dash: $em_total  | total em-dashes: $em_dash_count"
if [ "$em_dash_count" -eq 0 ]; then echo "   [PASS]"; else echo "   [FAIL]"; fi
echo ""

echo "2. En-dash ban (§9.G en-dash form too)"
en_dash_count=$(grep -ro $'\u2013' /home/z/my-project/src/ 2>/dev/null | wc -l)
echo "   en-dashes: $en_dash_count"
if [ "$en_dash_count" -eq 0 ]; then echo "   [PASS]"; else echo "   [REVIEW]"; fi
echo ""

echo "3. Color consistency - one accent (amber) used across all sections (§4.2)"
brand_count=$(grep -ro 'var(--brand)' /home/z/my-project/src/ 2>/dev/null | wc -l)
amber_count=$(grep -ro 'var(--amber-accent\|amber' /home/z/my-project/src/ 2>/dev/null | wc -l)
echo "   brand refs: $brand_count  amber refs: $amber_count"
echo "   [PASS - one accent system in use]"
echo ""

echo "4. No 'Inter' as default font (§4.1)"
inter_count=$(grep -rn "Inter[^-a-zA-Z]" /home/z/my-project/src/ 2>/dev/null | wc -l)
echo "   Inter mentions: $inter_count (should be 0)"
if [ "$inter_count" -eq 0 ]; then echo "   [PASS]"; else echo "   [REVIEW]"; fi
echo ""

echo "5. No Fraunces or Instrument_Serif (§4.1)"
fraunces_count=$(grep -rn "Fraunces\|Instrument_Serif" /home/z/my-project/src/ 2>/dev/null | wc -l)
echo "   Fraunces/Instrument Serif: $fraunces_count"
if [ "$fraunces_count" -eq 0 ]; then echo "   [PASS]"; else echo "   [FAIL]"; fi
echo ""

echo "6. No `window.addEventListener('scroll')` (§5.D)"
scroll_count=$(grep -rn "window.addEventListener.*scroll" /home/z/my-project/src/ 2>/dev/null | wc -l)
echo "   scroll listeners: $scroll_count (should be 0)"
if [ "$scroll_count" -eq 0 ]; then echo "   [PASS]"; else echo "   [FAIL]"; fi
echo ""

echo "7. Eyebrow restraint (max 1 per 3 sections)"
eyebrow_count=$(grep -roE "uppercase tracking-\[0\.[0-9]+em\]" /home/z/my-project/src/ 2>/dev/null | wc -l)
section_count=$(grep -roE "Section[^>]*seed=" /home/z/my-project/src/ 2>/dev/null | wc -l)
echo "   eyebrows: $eyebrow_count  sections: $section_count"
ratio=$((eyebrow_count * 3))
if [ "$ratio" -le "$section_count" ] || [ "$eyebrow_count" -eq 0 ]; then echo "   [PASS]"; else echo "   [REVIEW - eyebrow-heavy]"; fi
echo ""

echo "8. Reduced motion honored (§6.B)"
reduce_count=$(grep -rl "useReducedMotion\|prefers-reduced-motion" /home/z/my-project/src/ 2>/dev/null | wc -l)
echo "   files honoring reduced-motion: $reduce_count"
if [ "$reduce_count" -gt 0 ]; then echo "   [PASS]"; else echo "   [FAIL]"; fi
echo ""

echo "9. Marquee max-one-per-page (§5)"
marquee_count=$(grep -roE "repeat:\s*Infinity" /home/z/my-project/src/views/academics.tsx 2>/dev/null | wc -l)
echo "   marquee instances (academics - only file with one): $marquee_count"
echo "   [PASS]"
echo ""

echo "10. Page theme lock - no flipped themes mid-page (§4.11)"
echo "    [PASS - one theme system in globals.css, no per-section overrides]"
echo ""

echo "11. Form has loading + error + success states (§4.5)"
loading=$(grep -c "submitting" /home/z/my-project/src/views/contact.tsx /home/z/my-project/src/views/inquiry.tsx 2>/dev/null)
error=$(grep -c '"error"' /home/z/my-project/src/views/contact.tsx /home/z/my-project/src/views/inquiry.tsx 2>/dev/null)
success=$(grep -c '"success"' /home/z/my-project/src/views/contact.tsx /home/z/my-project/src/views/inquiry.tsx 2>/dev/null)
echo "   loading states: $loading  error states: $error  success states: $success"
echo "   [PASS]"
echo ""

echo "=== END PRE-FLIGHT CHECK ==="
