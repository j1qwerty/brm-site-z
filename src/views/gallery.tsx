"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Section } from "@/components/site/section";
import { Reveal } from "@/components/site/motion-primitives";
import { useSite } from "@/components/site/site-context";
import { useItemList, useSection } from "@/lib/cms-context";
import type { GalleryItem as CMSGalleryItem } from "@/lib/cms-types";

/*
  GALLERY VIEW - 4 sections
  1. Editorial hero with category filter tabs
  2. Masonry grid - main gallery (CSS columns pattern, widely shared on GitHub)
  3. Sub-section - recent additions horizontal scroll
  4. Inquiry CTA

  Reads from CMS items in Firestore. Falls back to hardcoded defaults
  when Firestore is empty or not configured.
*/

const FALLBACK_GALLERY: CMSGalleryItem[] = [
  { id: "fallback-g1", src: "https://picsum.photos/seed/brm-gallery-studio-paint-1/600/800", alt: "Studio painting class", caption: "Grade 9 still life", category: "Studio" },
  { id: "fallback-g2", src: "https://picsum.photos/seed/brm-gallery-studio-clay/600/500", alt: "Ceramics wheel", caption: "Grade 7 clay project", category: "Studio" },
  { id: "fallback-g3", src: "https://picsum.photos/seed/brm-gallery-track-meet/600/800", alt: "Track meet", caption: "Spring track meet", category: "Athletics" },
  { id: "fallback-g4", src: "https://picsum.photos/seed/brm-gallery-soccer/600/500", alt: "Soccer practice", caption: "Grade 8 soccer", category: "Athletics" },
  { id: "fallback-g5", src: "https://picsum.photos/seed/brm-gallery-forest-hike/600/700", alt: "Forest hike", caption: "Wednesday forest hour", category: "Forest" },
  { id: "fallback-g6", src: "https://picsum.photos/seed/brm-gallery-forest-rain/600/500", alt: "Forest in the rain", caption: "Forest classroom, rain day", category: "Forest" },
  { id: "fallback-g7", src: "https://picsum.photos/seed/brm-gallery-trip-museum/600/600", alt: "Museum field trip", caption: "Portland Art Museum", category: "Field trips" },
  { id: "fallback-g8", src: "https://picsum.photos/seed/brm-gallery-trip-watershed/600/800", alt: "Watershed sampling", caption: "Cooper River sampling", category: "Field trips" },
  { id: "fallback-g9", src: "https://picsum.photos/seed/brm-gallery-perf-stage/600/500", alt: "Theater rehearsal", caption: "Spring play rehearsal", category: "Performance" },
  { id: "fallback-g10", src: "https://picsum.photos/seed/brm-gallery-perf-music/600/700", alt: "Music recital", caption: "Winter recital", category: "Performance" },
  { id: "fallback-g11", src: "https://picsum.photos/seed/brm-gallery-studio-wood/600/500", alt: "Wood shop", caption: "Grade 10 woodwork", category: "Studio" },
  { id: "fallback-g12", src: "https://picsum.photos/seed/brm-gallery-trip-archive/600/500", alt: "City archive visit", caption: "Grade 10 archive visit", category: "Field trips" },
  { id: "fallback-g13", src: "https://picsum.photos/seed/brm-gallery-perf-film/600/600", alt: "Film class screening", caption: "Grade 10 film class", category: "Performance" },
  { id: "fallback-g14", src: "https://picsum.photos/seed/brm-gallery-forest-snow/600/700", alt: "Forest snow", caption: "Forest classroom, January", category: "Forest" },
  { id: "fallback-g15", src: "https://picsum.photos/seed/brm-gallery-athletics-xc/600/500", alt: "Cross country", caption: "Cross country, autumn", category: "Athletics" },
];

export function GalleryView() {
  const [active, setActive] = useState<string>("All");
  const reduce = useReducedMotion();
  const { setView } = useSite();
  const hero = useSection("gallery.hero", {
    eyebrow: "Gallery",
    headline: "An ordinary Tuesday, in pictures.",
    subtext: "Photos taken by students in the photography elective. Updated weekly. Click any image to see the full caption.",
  });

  const cmsItems = useItemList<CMSGalleryItem>("gallery");
  const items = cmsItems.length > 0 ? cmsItems : FALLBACK_GALLERY;

  // Derive categories from items dynamically, plus "All"
  const CATEGORIES = useMemo(() => {
    const set = new Set<string>();
    items.forEach((g) => set.add(g.category));
    return ["All", ...Array.from(set).sort()];
  }, [items]);

  const filtered = useMemo(() => {
    if (active === "All") return items;
    return items.filter((g) => g.category === active);
  }, [active, items]);

  return (
    <>
      {/* Section 1: Hero + filter */}
      <Section seed="gallery-hero" count={3} className="py-20 md:py-28">
        <div className="grid lg:grid-cols-12 gap-8 items-end mb-10">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.2em] font-mono text-amber mb-5">
                {hero.eyebrow}
              </p>
              <h1 className="text-balance text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.02] mb-5">
                {hero.headline}
              </h1>
              <p className="text-base text-muted-foreground max-w-[60ch] leading-relaxed">
                {hero.subtext}
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.1}>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setActive(c)}
                    className={`relative px-4 py-2 text-sm rounded-full border transition-colors ${
                      active === c
                        ? "bg-brand text-brand-foreground border-brand"
                        : "border-border text-foreground hover:border-amber/60 hover:text-amber"
                    }`}
                    aria-pressed={active === c}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Section 2: Masonry grid */}
      <Section seed="gallery-masonry" count={0} className="pb-24 md:pb-32">
        <motion.div layout className="masonry">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.figure
                key={item.id}
                layout
                initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-xl overflow-hidden bg-muted aspect-[6/5]"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-700"
                  loading="lazy"
                />
                <figcaption className="sr-only">
                  {item.caption}. {item.category}.
                </figcaption>
              </motion.figure>
            ))}
          </AnimatePresence>
        </motion.div>
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No photos in this category yet.</p>
        )}
      </Section>

      {/* Section 3: Recent additions horizontal scroll-snap */}
      <Section seed="gallery-recent" count={2} className="py-20 md:py-28 bg-muted/30">
        <Reveal as="header" className="mb-10 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            This week
          </h2>
          <p className="text-base text-muted-foreground">
            Five photos added by students in the last seven days.
          </p>
        </Reveal>
        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-6 -mx-4 sm:-mx-6 px-4 sm:px-6">
          {items.slice(0, 5).map((item, i) => (
            <Reveal key={item.id} delay={i * 0.05} className="snap-start shrink-0 w-[80%] sm:w-[44%] lg:w-[31%]">
              <figure className="rounded-2xl overflow-hidden bg-muted">
                <img src={item.src} alt={item.alt} className="w-full h-64 object-cover" loading="lazy" />
                <figcaption className="p-4 text-sm">
                  <p className="font-medium text-foreground">{item.caption}</p>
                  <p className="text-xs text-muted-foreground font-mono uppercase tracking-[0.12em] mt-1">
                    {item.category}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Section 4: CTA */}
      <Section seed="gallery-cta" count={2} className="py-20 md:py-28">
        <Reveal>
          <div className="rounded-3xl bg-brand text-brand-foreground p-8 md:p-14 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3 text-balance">
                Want to see it in person?
              </h2>
              <p className="text-base opacity-85 max-w-prose leading-relaxed">
                Open houses run every Thursday at 9am, January through April.
                Or schedule a private tour any weekday.
              </p>
            </div>
            <div className="lg:col-span-4 lg:justify-self-end">
              <button
                type="button"
                onClick={() => setView("inquiry")}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-amber text-amber-foreground font-medium hover:bg-amber/90 transition-colors"
              >
                Schedule a visit
                <ArrowRight size={18} weight="bold" />
              </button>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
