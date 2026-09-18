"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SVG_DECOR_COMPONENTS } from "@/components/decor/svg-decor";

/*
  AnimatedBackground
  -----------------
  Scatters the 10 SVG decorative elements across a section. Randomly assigns each
  element to one of N corner/edge anchors. The assignment is stable per (seed, count)
  so re-renders don't reshuffle the layout.

  Props:
    seed: stable per-section seed (use a hash of the section id or page name).
          Without it, every section would reshuffle on every render.
    count: how many SVG elements to render in this section (default 2-3 per section).
    size:  tailwind size string for the SVG (default "w-32 h-32").
    opacity: base opacity (default 0.7).

  Per taste-skill §6.E: SVG decor sits on `bg-svg-decor` which is position:absolute,
  pointer-events:none, z-index:0. The section content sits above via z-10/relative.

  Per taste-skill §6.B: motion degrades to static when prefers-reduced-motion.
*/

const ANCHORS = [
  "corner-tl",
  "corner-tr",
  "corner-bl",
  "corner-br",
  "corner-ml",
  "corner-mr",
  "corner-tm",
  "corner-bm",
  "corner-center",
] as const;

const SVG_KEYS = Object.keys(SVG_DECOR_COMPONENTS) as Array<
  keyof typeof SVG_DECOR_COMPONENTS
>;

// Tiny seeded PRNG (mulberry32) - stable across renders, no Math.random reshuffles.
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(s: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

type AnimatedBackgroundProps = {
  seed: string;
  count?: number;
  sizeClass?: string;
  opacity?: number;
};

export function AnimatedBackground({
  seed,
  count = 3,
  sizeClass = "w-40 h-40",
  opacity = 0.7,
}: AnimatedBackgroundProps) {
  const reduce = useReducedMotion();
  // Generate a stable layout for this seed + count
  const placements = useMemo(() => {
    const rng = mulberry32(hashString(seed));
    const usedAnchors = new Set<string>();
    const items: {
      key: keyof typeof SVG_DECOR_COMPONENTS;
      anchor: string;
      size: string;
      floatDelay: number;
      floatDur: number;
      parallax: number;
      rotate: number;
      flipX: boolean;
      flipY: boolean;
    }[] = [];

    for (let i = 0; i < count; i++) {
      // pick an anchor not yet used when possible
      let anchor: string;
      let attempts = 0;
      do {
        anchor = ANCHORS[Math.floor(rng() * ANCHORS.length)];
        attempts++;
      } while (usedAnchors.has(anchor) && attempts < 8 && usedAnchors.size < ANCHORS.length);
      usedAnchors.add(anchor);

      const key = SVG_KEYS[Math.floor(rng() * SVG_KEYS.length)];
      const sizeVariants = ["w-24 h-24", "w-32 h-32", "w-40 h-40", "w-52 h-52", "w-64 h-64", "w-28 h-28"];
      items.push({
        key,
        anchor,
        size: sizeVariants[Math.floor(rng() * sizeVariants.length)],
        floatDelay: rng() * 6,
        floatDur: 8 + rng() * 10,
        parallax: 30 + rng() * 60,
        rotate: (rng() - 0.5) * 24,
        flipX: rng() > 0.5,
        flipY: rng() > 0.5,
      });
    }
    return items;
  }, [seed, count]);

  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
    >
      {placements.map((p, i) => {
        const Svg = SVG_DECOR_COMPONENTS[p.key];
        return (
          <motion.div
            key={`${seed}-${i}`}
            className={`bg-svg-decor ${p.anchor} ${p.size}`}
            style={{
              opacity,
              transformStyle: "preserve-3d",
            }}
            initial={false}
            animate={
              reduce
                ? undefined
                : {
                    y: [0, -10, 0],
                    x: [0, 4, 0],
                    transition: {
                      duration: p.floatDur,
                      delay: p.floatDelay,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }
            }
          >
            <Svg
              className={`w-full h-full ${p.flipX ? "scale-x-[-1]" : ""} ${p.flipY ? "scale-y-[-1]" : ""}`}
              style={{
                transform: `rotate(${p.rotate}deg)`,
                transformOrigin: "center",
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
