"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { ArrowUp } from "@phosphor-icons/react/dist/ssr";

/*
  FloatingScrollTop - BRM International School
  ---------------------------------
  Spec compliance:
  - Position: floating, bottom-right corner, fixed.
  - Hidden when at top of page.
  - Shown when scrolled (i.e., not at top).
  - Hides when scroll stops for > 800ms (subtle auto-hide so it doesn't sit there forever).
  - Animates (spins/floats) while the user is actively scrolling, stops animating when
    scroll stops.
  - Always visible when not at top of page (visible === scrollY > 24).
  - On click: smooth-scrolls to top of page.

  Per taste-skill §5.D: NO `window.addEventListener('scroll')`. We use Motion's
  `useScroll` (which is rAF-batched internally) + `useSpring` for smoothed velocity.
  Per taste-skill §6.B: motion degrades to static when prefers-reduced-motion.
*/

export function FloatingScrollTop() {
  const reduce = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001,
  });

  const [visible, setVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  // Track scroll velocity to know when we are actively scrolling.
  // Use a ref so we don't trigger React re-renders per scroll frame.
  const lastScrollFrame = useRef(0);
  const velocityRef = useRef(0);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // scrollY.on("change") is rAF-batched internally by Motion - safe per §5.D.
    const unsubscribe = scrollY.on("change", (latest) => {
      // Show when not at top
      setVisible(latest > 24);

      const now = typeof performance !== "undefined" ? performance.now() : Date.now();
      const delta = now - lastScrollFrame.current;
      const velocity = delta > 0 ? Math.min(1, delta / 50) : 0;
      velocityRef.current = velocity;
      lastScrollFrame.current = now;

      setIsScrolling(true);

      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
      hideTimerRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 800);
    });

    return () => {
      unsubscribe();
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [scrollY]);

  const handleClick = () => {
    if (reduce) {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-top"
          type="button"
          aria-label="Scroll back to top of page"
          onClick={handleClick}
          initial={{ opacity: 0, y: 24, scale: 0.7 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.7 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-brand text-brand-foreground shadow-[0_18px_60px_-15px_rgba(0,0,0,0.45)] grid place-items-center border border-amber/30 hover:border-amber/60 transition-colors"
          whileHover={{ scale: reduce ? 1 : 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Progress ring */}
          <motion.svg
            className="absolute inset-0 -rotate-90 pointer-events-none"
            viewBox="0 0 56 56"
            aria-hidden
            style={{ width: "100%", height: "100%" }}
          >
            <motion.circle
              cx="28"
              cy="28"
              r="25"
              fill="none"
              stroke="var(--amber-accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ pathLength: smoothProgress }}
            />
          </motion.svg>

          {/* Arrow that rotates while scrolling */}
          <motion.div
            animate={
              reduce
                ? undefined
                : isScrolling
                  ? { rotate: [0, 360], scale: [1, 1.1, 1] }
                  : { rotate: 0, scale: 1 }
            }
            transition={
              isScrolling && !reduce
                ? {
                    rotate: { duration: 1.2, repeat: Infinity, ease: "linear" },
                    scale: { duration: 0.6, repeat: Infinity, repeatType: "mirror" as const, ease: "easeInOut" },
                  }
                : { duration: 0.3 }
            }
          >
            <ArrowUp size={22} weight="bold" />
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
