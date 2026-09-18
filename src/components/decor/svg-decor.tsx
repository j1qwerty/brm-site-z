"use client";

import { memo } from "react";

/*
  10 SVG decorative background elements for BRM International School.
  These are bespoke, abstract decorative marks (not icons - per taste-skill §4.8
  override: the brief explicitly asks for "10 svg elements for bg", so this is the
  sanctioned case for hand-rolled decorative SVGs).

  Each is sized to its viewBox; rendered inside the AnimatedBackground wrapper
  which sets absolute positioning + corner classes + parallax.
*/

type SvgProps = { className?: string; style?: React.CSSProperties };

const accent = "var(--amber-accent)";
const brand = "var(--brand)";

/*
  NOTE: Math.sin / Math.cos are implementation-defined and can differ by 1 ULP
  between Node (SSR) and the browser, which causes React hydration mismatches
  when full-precision floats are rendered into SVG attributes. Round all
  trig-derived coordinates so server and client agree.
*/
const round3 = (n: number) => Math.round(n * 1000) / 1000;

/* 1. Concentric arcs - "growth rings" */
export const ConcentricArcs = memo(function ConcentricArcs({ className, style }: SvgProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 200 200" fill="none" aria-hidden>
      {[20, 40, 60, 80, 100].map((r, i) => (
        <circle
          key={r}
          cx="100"
          cy="100"
          r={r}
          stroke={i % 2 === 0 ? brand : accent}
          strokeOpacity={0.35 - i * 0.04}
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
});

/* 2. Hand-drawn blob - "growth cluster" */
export const BlobMark = memo(function BlobMark({ className, style }: SvgProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 200 200" fill="none" aria-hidden>
      <path
        d="M100 20 C140 20, 175 50, 175 95 C175 145, 130 175, 95 175 C50 175, 25 135, 25 95 C25 55, 60 20, 100 20 Z"
        stroke={accent}
        strokeOpacity={0.4}
        strokeWidth="1.5"
        strokeDasharray="3 5"
      />
      <path
        d="M100 60 C120 60, 135 75, 135 95 C135 120, 115 135, 95 135 C70 135, 60 115, 60 95 C60 75, 80 60, 100 60 Z"
        stroke={brand}
        strokeOpacity={0.3}
        strokeWidth="1.5"
      />
    </svg>
  );
});

/* 3. Dot grid - "constellation" */
export const DotGrid = memo(function DotGrid({ className, style }: SvgProps) {
  const dots: { x: number; y: number; r: number }[] = [];
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      dots.push({ x: 20 + i * 32, y: 20 + j * 32, r: (i + j) % 3 === 0 ? 2.5 : 1.2 });
    }
  }
  return (
    <svg className={className} style={style} viewBox="0 0 200 200" fill="none" aria-hidden>
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={i % 7 === 0 ? accent : brand} fillOpacity={0.4} />
      ))}
    </svg>
  );
});

/* 4. Sun rays / sunburst - "morning assembly" */
export const SunRays = memo(function SunRays({ className, style }: SvgProps) {
  const rays = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg className={className} style={style} viewBox="0 0 200 200" fill="none" aria-hidden>
      <circle cx="100" cy="100" r="32" stroke={accent} strokeOpacity={0.4} strokeWidth="1.5" />
      {rays.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = round3(100 + Math.cos(rad) * 42);
        const y1 = round3(100 + Math.sin(rad) * 42);
        const x2 = round3(100 + Math.cos(rad) * 80);
        const y2 = round3(100 + Math.sin(rad) * 80);
        return (
          <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke={accent} strokeOpacity={0.5} strokeWidth="1.5" strokeLinecap="round" />
        );
      })}
    </svg>
  );
});

/* 5. Wavy horizon line - "field trips" */
export const WaveLine = memo(function WaveLine({ className, style }: SvgProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 400 80" fill="none" aria-hidden preserveAspectRatio="none">
      <path
        d="M0 40 Q50 5, 100 40 T200 40 T300 40 T400 40"
        stroke={brand}
        strokeOpacity={0.5}
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M0 50 Q50 15, 100 50 T200 50 T300 50 T400 50"
        stroke={accent}
        strokeOpacity={0.3}
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
});

/* 6. Hand-drawn star - "achievements" */
export const StarMark = memo(function StarMark({ className, style }: SvgProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 200 200" fill="none" aria-hidden>
      <path
        d="M100 30 L115 85 L170 90 L125 120 L140 175 L100 145 L60 175 L75 120 L30 90 L85 85 Z"
        stroke={accent}
        strokeOpacity={0.45}
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="100" cy="110" r="6" fill={accent} fillOpacity={0.5} />
    </svg>
  );
});

/* 7. Tree branch - "growth + stewardship" */
export const BranchMark = memo(function BranchMark({ className, style }: SvgProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 200 200" fill="none" aria-hidden>
      <path
        d="M30 170 C60 140, 90 110, 130 90"
        stroke={brand}
        strokeOpacity={0.55}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M60 145 C70 130, 85 125, 100 115" stroke={brand} strokeOpacity={0.45} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M90 115 C100 100, 110 95, 125 90" stroke={brand} strokeOpacity={0.45} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M110 100 C120 85, 130 80, 140 75" stroke={brand} strokeOpacity={0.4} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="140" cy="75" r="6" fill={accent} fillOpacity={0.6} />
      <circle cx="125" cy="90" r="5" fill={accent} fillOpacity={0.45} />
      <circle cx="100" cy="115" r="4" fill={accent} fillOpacity={0.35} />
      <circle cx="60" cy="145" r="3" fill={accent} fillOpacity={0.25} />
    </svg>
  );
});

/* 8. Compass mark - "exploration" */
export const CompassMark = memo(function CompassMark({ className, style }: SvgProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 200 200" fill="none" aria-hidden>
      <circle cx="100" cy="100" r="70" stroke={brand} strokeOpacity={0.4} strokeWidth="1.5" />
      <circle cx="100" cy="100" r="55" stroke={accent} strokeOpacity={0.3} strokeWidth="1" strokeDasharray="2 4" />
      <path d="M100 35 L110 100 L100 165 L90 100 Z" fill={accent} fillOpacity={0.55} />
      <path d="M35 100 L100 110 L165 100 L100 90 Z" fill={brand} fillOpacity={0.35} />
      <circle cx="100" cy="100" r="5" fill={brand} />
    </svg>
  );
});

/* 9. Hand-drawn squiggle - "experimentation" */
export const SquiggleMark = memo(function SquiggleMark({ className, style }: SvgProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 300 100" fill="none" aria-hidden preserveAspectRatio="none">
      <path
        d="M10 50 C40 20, 70 80, 100 50 C130 20, 160 80, 190 50 C220 20, 250 80, 290 50"
        stroke={accent}
        strokeOpacity={0.6}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
});

/* 10. Hexagonal honeycomb - "community + beehive" */
export const HoneycombMark = memo(function HoneycombMark({ className, style }: SvgProps) {
  const hexes = [
    { cx: 50, cy: 50, op: 0.5 },
    { cx: 95, cy: 50, op: 0.35 },
    { cx: 72, cy: 10, op: 0.4 },
    { cx: 72, cy: 90, op: 0.3 },
    { cx: 27, cy: 30, op: 0.25 },
    { cx: 27, cy: 70, op: 0.3 },
  ];
  const hexPath = (cx: number, cy: number, r: number) => {
    const pts = Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 2;
      return `${round3(cx + Math.cos(a) * r)},${round3(cy + Math.sin(a) * r)}`;
    }).join(" ");
    return pts;
  };
  return (
    <svg className={className} style={style} viewBox="0 0 140 120" fill="none" aria-hidden>
      {hexes.map((h, i) => (
        <polygon
          key={i}
          points={hexPath(h.cx, h.cy, 20)}
          stroke={i % 2 === 0 ? accent : brand}
          strokeOpacity={h.op}
          strokeWidth="1.5"
          fill="none"
        />
      ))}
    </svg>
  );
});

export const SVG_DECOR_NAMES = [
  "ConcentricArcs",
  "BlobMark",
  "DotGrid",
  "SunRays",
  "WaveLine",
  "StarMark",
  "BranchMark",
  "CompassMark",
  "SquiggleMark",
  "HoneycombMark",
] as const;

export const SVG_DECOR_COMPONENTS = {
  ConcentricArcs,
  BlobMark,
  DotGrid,
  SunRays,
  WaveLine,
  StarMark,
  BranchMark,
  CompassMark,
  SquiggleMark,
  HoneycombMark,
} as const;
