"use client";

import { AnimatedBackground } from "@/components/decor/animated-background";
import { cn } from "@/lib/utils";

/*
  Section: a section wrapper that paints an AnimatedBackground behind its content
  using a stable seed (caller-supplied, usually derived from section name).
  Content sits above the decor via z-10 + relative positioning.

  Per taste-skill §6.E: bg-svg-decor is position:absolute, pointer-events:none.
  Content uses position:relative z-10 so it always sits above decor.

  Props:
  - seed: stable per-section string used to scatter SVG elements.
  - count: how many SVG elements (default 2-3 to avoid clutter).
  - className, containerClassName: pass-through styling.
  - sizeClass, opacity: tuned per section.
*/
export function Section({
  id,
  seed,
  count = 3,
  className,
  containerClassName,
  children,
  sizeClass,
  opacity,
}: {
  id?: string;
  seed: string;
  count?: number;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
  sizeClass?: string;
  opacity?: number;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden",
        className,
      )}
    >
      <AnimatedBackground
        seed={seed}
        count={count}
        sizeClass={sizeClass}
        opacity={opacity}
      />
      <div
        className={cn(
          "relative z-10 mx-auto max-w-7xl px-4 sm:px-6",
          containerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}

/* Section variant: no max-width constraint, lets the caller paint full-width content */
export function FullWidthSection({
  id,
  seed,
  count = 3,
  className,
  children,
  sizeClass,
  opacity,
}: {
  id?: string;
  seed: string;
  count?: number;
  className?: string;
  children: React.ReactNode;
  sizeClass?: string;
  opacity?: number;
}) {
  return (
    <section id={id} className={cn("relative overflow-hidden", className)}>
      <AnimatedBackground
        seed={seed}
        count={count}
        sizeClass={sizeClass}
        opacity={opacity}
      />
      <div className="relative z-10">{children}</div>
    </section>
  );
}
