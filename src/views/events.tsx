"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarBlank, Clock, MapPin } from "@phosphor-icons/react/dist/ssr";
import { Section } from "@/components/site/section";
import { Reveal } from "@/components/site/motion-primitives";
import { useSection } from "@/lib/cms-context";
import { useItemList } from "@/lib/cms-context";
import { useSite } from "@/components/site/site-context";
import type { EventItem } from "@/lib/cms-types";

/*
  EVENTS VIEW - 4 sections
  1. Editorial hero (CMS-backed)
  2. Filter tabs + event cards grid
  3. Featured upcoming event (split image + body)
  4. CTA card (CMS-backed)
*/

const FALLBACK_EVENTS: EventItem[] = [
  {
    id: "fallback-1",
    title: "Spring open house series",
    date: "2026-03-12",
    time: "9:00 AM - 11:00 AM",
    location: "Founders Hall, main entrance",
    description: "Walk through classrooms in session, meet faculty, ask questions. No RSVP required.",
    imageSrc: "https://picsum.photos/seed/brm-event-open-house/800/600",
    category: "Open house",
  },
  {
    id: "fallback-2",
    title: "Grade 10 capstone showcase",
    date: "2026-04-04",
    time: "6:00 PM - 8:30 PM",
    location: "STEAM wing, room 204",
    description: "Every grade 10 student presents their year-long project. Open to families and the public.",
    imageSrc: "https://picsum.photos/seed/brm-event-capstone/800/600",
    category: "Academic",
  },
  {
    id: "fallback-3",
    title: "Cross-country home meet",
    date: "2026-04-19",
    time: "10:00 AM",
    location: "Athletic fields",
    description: "Our cross-country team hosts three visiting schools. Five-kilometer course through the forest.",
    imageSrc: "https://picsum.photos/seed/brm-event-xc/800/600",
    category: "Athletics",
  },
  {
    id: "fallback-4",
    title: "Middle school spring play",
    date: "2026-05-09",
    time: "7:00 PM",
    location: "Black box theater",
    description: "Grade 7 and 8 present an original one-act. Tickets free, suggested donation at the door.",
    imageSrc: "https://picsum.photos/seed/brm-event-play/800/600",
    category: "Performance",
  },
];

export function EventsView() {
  return (
    <>
      <EventsHero />
      <EventsList />
      <EventsCTA />
    </>
  );
}

function EventsHero() {
  const reduce = useReducedMotion();
  const hero = useSection("events.hero", {
    eyebrow: "Events",
    headline: "What is happening at BRM.",
    subtext: "Open houses, performances, athletic fixtures, community gatherings. Most are open to the public.",
  });
  return (
    <Section seed="events-hero" count={3} className="py-20 md:py-32 min-h-[60dvh] flex items-center">
      <div className="max-w-4xl">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs uppercase tracking-[0.2em] font-mono text-amber mb-6"
        >
          {hero.eyebrow}
        </motion.p>
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="text-balance text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.02]"
        >
          {hero.headline}
        </motion.h1>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="mt-6 text-base text-muted-foreground max-w-[60ch] leading-relaxed"
        >
          {hero.subtext}
        </motion.p>
      </div>
    </Section>
  );
}

function EventsList() {
  const events = useItemList<EventItem>("event");
  const allEvents = events.length > 0 ? events : FALLBACK_EVENTS;
  const categories = useMemo(() => {
    const set = new Set<string>();
    allEvents.forEach((e) => set.add(e.category));
    return Array.from(set).sort();
  }, [allEvents]);
  const [active, setActive] = useState<string>("All");

  const filtered = active === "All" ? allEvents : allEvents.filter((e) => e.category === active);

  // Sort by date ascending
  const sorted = [...filtered].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Section seed="events-list" count={2} className="py-20 md:py-28">
      <Reveal as="header" className="mb-8 flex flex-wrap justify-between gap-4 items-end">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">Upcoming</h2>
          <p className="text-base text-muted-foreground">
            Filter by category. All events are open to families unless noted.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", ...categories].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              className={`px-3.5 py-2 rounded-full text-sm border transition-colors ${
                active === c
                  ? "bg-brand text-brand-foreground border-brand"
                  : "border-border hover:border-amber/60"
              }`}
              aria-pressed={active === c}
            >
              {c}
            </button>
          ))}
        </div>
      </Reveal>

      {sorted.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No events in this category.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {sorted.map((e, i) => (
            <Reveal key={e.id} delay={i * 0.05}>
              <article className="rounded-2xl border border-border bg-card overflow-hidden hover:border-amber/60 transition-colors h-full flex flex-col">
                {e.imageSrc && (
                  <div className="aspect-[16/9] overflow-hidden bg-muted">
                    <img src={e.imageSrc} alt={e.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground mb-2">
                    <CalendarBlank size={14} className="text-amber" />
                    <span>{new Date(e.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-2">{e.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{e.description}</p>
                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                    {e.time && <span className="inline-flex items-center gap-1.5"><Clock size={14} /> {e.time}</span>}
                    {e.location && <span className="inline-flex items-center gap-1.5"><MapPin size={14} /> {e.location}</span>}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      )}
    </Section>
  );
}

function EventsCTA() {
  const { setView } = useSite();
  const cta = useSection("events.cta", {
    headline: "Want to host an event here?",
    body: "Our campus is available for community events outside school hours. Email events@brm-international.org.",
    cta: "Email events team",
  });
  return (
    <Section seed="events-cta" count={2} className="py-24 md:py-32">
      <Reveal>
        <div className="rounded-3xl bg-brand text-brand-foreground p-8 md:p-14 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3 text-balance">
              {cta.headline}
            </h2>
            <p className="text-base opacity-85 max-w-prose leading-relaxed">{cta.body}</p>
          </div>
          <div className="lg:col-span-4 lg:justify-self-end">
            <a
              href="mailto:events@brm-international.org"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-amber text-amber-foreground font-medium hover:bg-amber/90 transition-colors"
            >
              {cta.cta}
              <ArrowRight size={18} weight="bold" />
            </a>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
