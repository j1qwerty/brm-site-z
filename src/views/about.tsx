"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Section } from "@/components/site/section";
import { Parallax, Reveal, Stagger } from "@/components/site/motion-primitives";
import { useSite } from "@/components/site/site-context";

/*
  ABOUT VIEW - 7 sections, each with a different layout family.
  1. Editorial manifesto hero - large display type, no asset
  2. History timeline - vertical alternating
  3. Mission & values - chunked grouped values (NOT equal cards)
  4. Leadership team - 4-up portrait grid with hover-bio
  5. Campus & facilities - split image + key list
  6. Accreditation - logo wall (real SVGs + monograms)
  7. CTA card
*/
export function AboutView() {
  const { setView } = useSite();
  return (
    <>
      <AboutHero />
      <HistoryTimeline />
      <MissionValues />
      <LeadershipTeam />
      <CampusFacilities />
      <AccreditationWall />
      <AboutCTA onInquire={() => setView("inquiry")} />
    </>
  );
}

function AboutHero() {
  const reduce = useReducedMotion();
  return (
    <Section seed="about-hero" count={3} className="py-20 md:py-32 min-h-[80dvh] flex items-center">
      <div className="max-w-4xl">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs uppercase tracking-[0.2em] font-mono text-amber mb-6"
        >
          About BRM
        </motion.p>
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="text-balance text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter leading-[1.02]"
        >
          A school built to fit the child, not the other way around.
        </motion.h1>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="mt-8 text-lg text-muted-foreground max-w-[60ch] leading-relaxed"
        >
          Founded in 1998 by a group of parents and teachers who wanted a
          school that took children seriously. We are still that school.
        </motion.p>
      </div>
    </Section>
  );
}

function HistoryTimeline() {
  const events = [
    { year: "1998", title: "Founded in a converted grange hall", body: "Forty-three students, eight teachers, one rented building on Linden Ridge Road." },
    { year: "2004", title: "Permanent campus purchased", body: "Twelve acres of former orchard land. The first building, Founders Hall, opens with grades K-8." },
    { year: "2009", title: "First grade 10 class graduates", body: "Twelve students. Eleven go on to higher secondary; one starts an apprentice furniture-making business." },
    { year: "2014", title: "STEAM wing opens", body: "Three labs, a maker space, and a student-run garden funded entirely by parent donations." },
    { year: "2021", title: "Forest stewardship program", body: "Formal partnership with Willowbrook Watershed Council. Every grade now has forest curriculum." },
    { year: "2026", title: "28 years in", body: "412 students, 84 faculty, 1,872 alumni across 32 states and 14 countries." },
  ];
  return (
    <Section seed="about-history" count={2} className="py-24 md:py-32">
      <Reveal as="header" className="mb-12 max-w-2xl">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">A short history</h2>
        <p className="text-base text-muted-foreground">
          Not a chronicle, just the years where something changed.
        </p>
      </Reveal>
      <div className="relative">
        {/* vertical line */}
        <div className="absolute left-[7.5rem] top-2 bottom-2 w-px bg-border hidden md:block" aria-hidden />
        <ul className="space-y-12 md:space-y-0">
          {events.map((e, i) => (
            <Reveal as="li" key={e.year} delay={i * 0.04}>
              <div className="md:grid md:grid-cols-[7rem_1fr] md:gap-8 md:items-start md:pb-12">
                <p className="text-4xl md:text-5xl font-bold tracking-tighter text-amber mb-2 md:mb-0">
                  {e.year}
                </p>
                <div className="md:border-l md:border-border md:pl-8 md:pb-2">
                  <h3 className="text-xl md:text-2xl font-medium tracking-tight mb-2">
                    {e.title}
                  </h3>
                  <p className="text-base text-muted-foreground max-w-prose leading-relaxed">
                    {e.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}

function MissionValues() {
  const values = [
    {
      name: "Take children seriously",
      body: "We assume students are competent until they prove otherwise, which they rarely do. Treat a child like a person and they respond like one.",
    },
    {
      name: "Make work that matters",
      body: "Every project ends in something shipped: a paper, a dataset, a performance, a fix to a real problem. No busy work, ever.",
    },
    {
      name: "Stay small",
      body: "Classes cap at 18. Faculty know every student by name. The school will not grow past 480 students, no matter how many applications arrive.",
    },
    {
      name: "Be honest about difficulty",
      body: "School is hard. We tell students when something is hard, and we help them through it. We do not pretend everything is fun.",
    },
    {
      name: "Get outside",
      body: "Wednesday afternoons, every week, in every grade, in every weather. The forest is curriculum, not reward.",
    },
    {
      name: "Welcome families in",
      body: "Parents are part of the school. Drop in. Eat lunch with your kid. Sit in on a class. The door is open.",
    },
  ];
  return (
    <Section seed="about-values" count={3} className="py-24 md:py-32 bg-muted/30">
      <Reveal as="header" className="mb-12 max-w-2xl">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">What we believe</h2>
        <p className="text-base text-muted-foreground">
          Six values that show up in every decision we make, from hiring to
          schedule to lunch.
        </p>
      </Reveal>
      {/* Grouped chunks: 3 chunks of 2 values each - per taste-skill §4.9 grouped chunks */}
      <div className="space-y-12">
        {Array.from({ length: 3 }).map((_, chunkIdx) => (
          <Reveal key={chunkIdx} delay={chunkIdx * 0.05}>
            <div className="grid md:grid-cols-2 gap-8">
              {values.slice(chunkIdx * 2, chunkIdx * 2 + 2).map((v) => (
                <div key={v.name} className="space-y-3">
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                    {v.name}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed max-w-prose">
                    {v.body}
                  </p>
                </div>
              ))}
            </div>
            {chunkIdx < 2 && <div className="mt-12 h-px bg-border" />}
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function LeadershipTeam() {
  const leaders = [
    { name: "Mara Bishop", role: "Head of School", image: "https://picsum.photos/seed/brm-leader-mara/400/500", bio: "Ed.D. Harvard, 22 years at BRM." },
    { name: "Hugo Tanaka", role: "Middle School Director", image: "https://picsum.photos/seed/brm-leader-hugo/400/500", bio: "B.S. Mech. Eng., 12 years at BRM." },
    { name: "Adaeze Okwu", role: "Lower School Director", image: "https://picsum.photos/seed/brm-leader-adaeze/400/500", bio: "M.Ed. Bank Street, 9 years at BRM." },
    { name: "Ben Carter", role: "High School Director", image: "https://picsum.photos/seed/brm-leader-ben/400/500", bio: "Ph.D. History Yale, 7 years at BRM." },
  ];
  return (
    <Section seed="about-leadership" count={3} className="py-24 md:py-32">
      <Reveal as="header" className="mb-12 max-w-2xl">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">School leadership</h2>
        <p className="text-base text-muted-foreground">
          Four people who set the tone. Email any of them directly.
        </p>
      </Reveal>
      <Stagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {leaders.map((p) => (
          <Stagger.Item key={p.name}>
            <div className="group">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-muted mb-4">
                <img src={p.image} alt={`${p.name}, ${p.role}`} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" loading="lazy" />
              </div>
              <h3 className="text-lg font-bold tracking-tight">{p.name}</h3>
              <p className="text-sm text-amber font-mono uppercase tracking-[0.12em] mb-2">{p.role}</p>
              <p className="text-sm text-muted-foreground">{p.bio}</p>
            </div>
          </Stagger.Item>
        ))}
      </Stagger>
    </Section>
  );
}

function CampusFacilities() {
  const facilities = [
    { name: "Founders Hall", body: "Original 2004 building. Lower school classrooms, library, dining hall." },
    { name: "STEAM Wing", body: "Three labs, maker space, robotics bay, darkroom. Built 2014." },
    { name: "Theater & Music", body: "240-seat black box, four practice rooms, recording studio." },
    { name: "Forest Classroom", body: "Heated yurt, outdoor kitchen, composting toilets. Used every Wednesday." },
    { name: "Garden & Greenhouse", body: "Half-acre working garden. Student-run. Food goes to lunch program." },
    { name: "Athletic Fields", body: "Two full-size fields, cross-country trail, all-weather track." },
  ];
  return (
    <Section seed="about-campus" count={2} className="py-24 md:py-32 bg-muted/30">
      <div className="grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-5">
          <Parallax offset={40}>
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-muted">
              <img
                src="https://picsum.photos/seed/brm-campus-aerial/600/750"
                alt="Aerial view of the BRM campus in autumn"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </Parallax>
        </div>
        <div className="lg:col-span-7">
          <Reveal as="header" className="mb-8">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">The campus</h2>
            <p className="text-base text-muted-foreground max-w-prose">
              Twelve buildings on twelve acres. Built for the way children
              actually move through a day.
            </p>
          </Reveal>
          <ul className="divide-y divide-border">
            {facilities.map((f, i) => (
              <Reveal as="li" key={f.name} delay={i * 0.04}>
                <div className="py-5 grid grid-cols-[1fr_2fr] gap-6">
                  <h3 className="text-base font-bold tracking-tight">{f.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

function AccreditationWall() {
  // Real-world accreditation + partner bodies, with simple monogram SVGs
  const orgs = [
    { name: "NAIS", monogram: "NAIS" },
    { name: "NWAC", monogram: "NWAC" },
    { name: "ISACS", monogram: "IS" },
    { name: "CASE", monogram: "CASE" },
    { name: "Watershed Council", monogram: "WC" },
    { name: "Zenodo", monogram: "ZD" },
  ];
  return (
    <Section seed="about-accreditation" count={2} className="py-24 md:py-32">
      <Reveal as="header" className="mb-10 max-w-2xl">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">Accreditation & partners</h2>
        <p className="text-base text-muted-foreground">
          We hold ourselves accountable to people outside the building.
        </p>
      </Reveal>
      <Stagger className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-border rounded-2xl overflow-hidden border border-border">
        {orgs.map((o) => (
          <Stagger.Item key={o.name}>
            <div className="aspect-[3/2] bg-card flex flex-col items-center justify-center gap-2 px-3">
              <span className="grid place-items-center h-10 w-10 rounded-full border border-border text-brand font-mono font-bold text-xs">
                {o.monogram}
              </span>
              <p className="text-xs text-muted-foreground text-center">{o.name}</p>
            </div>
          </Stagger.Item>
        ))}
      </Stagger>
    </Section>
  );
}

function AboutCTA({ onInquire }: { onInquire: () => void }) {
  return (
    <Section seed="about-cta" count={2} className="py-24 md:py-32">
      <Reveal>
        <div className="rounded-3xl bg-brand text-brand-foreground p-8 md:p-14 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3 text-balance">
              Come see the school for yourself.
            </h2>
            <p className="text-base opacity-85 max-w-prose leading-relaxed">
              The best way to know if a school fits your family is to walk
              through it. Open houses run Thursdays at 9am from January through April.
            </p>
          </div>
          <div className="lg:col-span-4 lg:justify-self-end">
            <button
              type="button"
              onClick={onInquire}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-amber text-amber-foreground font-medium hover:bg-amber/90 transition-colors"
            >
              Schedule a visit
              <ArrowRight size={18} weight="bold" />
            </button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
