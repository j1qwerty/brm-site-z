"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Play,
  PlayCircle,
  Quotes,
  CalendarBlank,
  Clock,
  MapPin,
} from "@phosphor-icons/react/dist/ssr";
import { Section, FullWidthSection } from "@/components/site/section";
import { Parallax, Reveal, Stagger } from "@/components/site/motion-primitives";
import { useSite } from "@/components/site/site-context";
import { useSection, useItemList } from "@/lib/cms-context";
import { parseList } from "@/lib/cms-list";
import type { EventItem, VideoItem, FAQItem } from "@/lib/cms-types";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

/*
  HOME VIEW
  13 sections, each with a different layout family per taste-skill §4.7.
  1. Asymmetric Split Hero
  2. Stats row - 4 large display tiles
  3. Mission editorial - full-width quote
  4. Programs by level - asymmetric grid
  5. Faculty spotlight - split image + bio (zigzag, single use)
  6. Why BRM - bento grid with varied cell sizes + image cells
  7. Testimonials - horizontal scroll-snap
  8. Upcoming events - event card grid with category filter
  9. Gallery preview - masonry teaser
  10. Videos - external link preview cards
  11. FAQ - accordion
  12. Campus life preview - masonry
  13. News + admissions CTA - split 2/1 layout
*/
export function HomeView() {
  const { setView } = useSite();
  return (
    <>
      <HeroSection />
      <StatsRow />
      <MissionStatement />
      <ProgramsSection />
      <FacultySpotlight />
      <WhyBRMBento />
      <TestimonialsSection />
      <EventsPreview onViewAll={() => setView("events")} />
      <GalleryPreview onGallery={() => setView("gallery")} />
      <VideosSection />
      <HomeFAQ />
      <NewsAndCTA onInquire={() => setView("inquiry")} onGallery={() => setView("gallery")} />
    </>
  );
}

/* ---------- Section 1: Asymmetric Split Hero ---------- */
function HeroSection() {
  const reduce = useReducedMotion();
  const { setView } = useSite();
  const s = useSection("home.hero", {
    eyebrow: "Now enrolling grades K through 10",
    headline: "A school where curiosity becomes craft.",
    subtext:
      "Independent K-10 education built on small classes, real projects, and a community that knows your child by name.",
    primaryCta: "Visit campus",
    secondaryCta: "Explore programs",
    heroImage: "https://picsum.photos/seed/brm-hero-students/640/800",
    heroImageAlt: "BRM International School students working on a group project in the studio",
    captionKicker: "Studio hour, Tuesday",
    captionTitle: "Grade 9 marine biology field study",
  });
  return (
    <Section seed="home-hero" count={2} className="pt-12 pb-24 md:pt-16 md:pb-32 min-h-[92dvh] flex items-center">
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center w-full">
        <div className="lg:col-span-7 space-y-7">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs uppercase tracking-[0.2em] font-mono text-amber"
          >
            {s.eyebrow}
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="text-balance text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-bold tracking-tighter leading-[1.05]"
          >
            {s.headline}
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg text-muted-foreground max-w-[60ch] leading-relaxed"
          >
            {s.subtext}
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-3"
          >
            <button
              type="button"
              onClick={() => setView("contact")}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-brand text-brand-foreground font-medium hover:bg-brand/90 transition-colors"
            >
              {s.primaryCta}
              <ArrowRight size={16} weight="bold" />
            </button>
            <button
              type="button"
              onClick={() => setView("academics")}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-border hover:border-amber/60 hover:text-amber transition-colors"
            >
              <Play size={14} weight="fill" />
              {s.secondaryCta}
            </button>
          </motion.div>
        </div>

        <div className="lg:col-span-5">
          <Parallax offset={40} className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-muted">
            <img
              src={s.heroImage}
              alt={s.heroImageAlt}
              className="w-full h-full object-cover"
              loading="eager"
              width={640}
              height={800}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-brand-foreground">
              <p className="text-xs font-mono uppercase tracking-[0.16em] opacity-80">
                {s.captionKicker}
              </p>
              <p className="text-base font-medium">{s.captionTitle}</p>
            </div>
          </Parallax>
        </div>
      </div>
    </Section>
  );
}

/* ---------- Section 2: Stats row - 4 large display tiles ---------- */
type Stat = { value: string; label: string };

const DEFAULT_STATS: Stat[] = [
  { value: "1:7", label: "Faculty to student ratio" },
  { value: "82", label: "Faculty with advanced degrees" },
  { value: "K-10", label: "Continuous, integrated curriculum" },
  { value: "1998", label: "Year founded" },
];

function StatsRow() {
  const s = useSection("home.stats", {
    title: "Numbers from the school",
    statsJson: JSON.stringify(DEFAULT_STATS),
  });
  const stats = parseList<Stat>(s.statsJson, DEFAULT_STATS);
  return (
    <FullWidthSection seed="home-stats" count={2} className="border-y border-border/60 bg-muted/30 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6">
          {stats.map((stat) => (
            <Stagger.Item key={stat.label}>
              <div className="space-y-2">
                <p className="text-5xl md:text-6xl font-bold tracking-tighter text-brand">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground max-w-[18ch]">{stat.label}</p>
              </div>
            </Stagger.Item>
          ))}
        </Stagger>
      </div>
    </FullWidthSection>
  );
}

/* ---------- Section 3: Mission editorial ---------- */
function MissionStatement() {
  const s = useSection("home.mission", {
    quote:
      "We believe children are already capable people. Our job is not to fill them, but to give them the tools, time, and trust to do work that matters.",
    attribution: "Mara Bishop, Head of School",
  });
  return (
    <Section seed="home-mission" count={3} className="py-24 md:py-36">
      <Reveal as="header" className="max-w-4xl mx-auto text-center">
        <Quotes size={32} className="text-amber mx-auto mb-6" weight="fill" />
        <p className="text-2xl md:text-4xl leading-[1.25] font-medium tracking-tight text-balance">
          {s.quote}
        </p>
        <p className="mt-6 text-sm text-muted-foreground font-mono">
          {s.attribution}
        </p>
      </Reveal>
    </Section>
  );
}

/* ---------- Section 4: Programs by level - asymmetric grid ---------- */
type Program = { grade: string; range: string; blurb: string; image: string; big: boolean };

const DEFAULT_PROGRAMS: Program[] = [
  {
    grade: "Lower School",
    range: "Grades K through 5",
    blurb:
      "Play-based foundations in literacy, numeracy, and the natural world. Two teachers per classroom.",
    image: "https://picsum.photos/seed/brm-lower-school-classroom/800/600",
    big: true,
  },
  {
    grade: "Middle School",
    range: "Grades 6 through 8",
    blurb:
      "Transition to disciplinary depth with integrated humanities, lab science, and the arts.",
    image: "https://picsum.photos/seed/brm-middle-school-lab/600/400",
    big: false,
  },
  {
    grade: "High School",
    range: "Grades 9 through 10",
    blurb:
      "College-prep with the grade 10 capstone, dual-enrollment, and independent study in a field of choice.",
    image: "https://picsum.photos/seed/brm-high-school-seminar/600/400",
    big: false,
  },
];

function ProgramsSection() {
  const s = useSection("home.programs", {
    headline: "Programs by level",
    intro:
      "A continuous curriculum from kindergarten through grade 10, designed so each grade builds on the last without gaps or repetition.",
    programsJson: JSON.stringify(DEFAULT_PROGRAMS),
  });
  const programs = parseList<Program>(s.programsJson, DEFAULT_PROGRAMS);
  return (
    <Section id="home-programs" seed="home-programs" count={2} className="py-24 md:py-32">
      <Reveal as="header" className="max-w-2xl mb-12">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
          {s.headline}
        </h2>
        <p className="text-base text-muted-foreground max-w-prose">
          {s.intro}
        </p>
      </Reveal>

      <div className="grid md:grid-cols-3 gap-6 md:auto-rows-[20rem]">
        {programs.map((p, i) => (
          <Reveal
            key={p.grade}
            delay={i * 0.08}
            className={p.big ? "md:col-span-2 md:row-span-2" : ""}
          >
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="group block w-full h-full rounded-2xl overflow-hidden bg-card border border-border hover:border-amber/60 transition-colors relative"
            >
              <div className="absolute inset-0">
                <img src={p.image} alt={`${p.grade} program`} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand/80 via-brand/30 to-transparent" />
              </div>
              <div className="relative h-full p-6 flex flex-col justify-end text-brand-foreground">
                <p className="text-xs uppercase tracking-[0.16em] font-mono opacity-80">
                  {p.range}
                </p>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight mt-1 mb-2">
                  {p.grade}
                </h3>
                <p className="text-sm opacity-85 max-w-[40ch]">{p.blurb}</p>
                <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-mono text-amber">
                  Read the curriculum
                  <ArrowUpRight size={14} weight="bold" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </p>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Section 5: Faculty spotlight - split image + bio (zigzag single use) ---------- */
const DEFAULT_CREDENTIALS: string[] = [
  "14 years teaching",
  "B.S. Mechanical Engineering",
  "STEAM cohort lead",
];

function FacultySpotlight() {
  const s = useSection("home.faculty", {
    eyebrow: "Faculty spotlight",
    headline: "Hugo Tanaka teaches grade 7 physics with bike wheels and stopwatches.",
    body1:
      "Before joining BRM in 2014, Hugo built test rigs at a bicycle manufacturer. He brings that same hands-on discipline into his classroom, where students learn force and motion by building, instrumenting, and breaking things on purpose.",
    body2:
      "His students keep a field notebook that travels with them through eighth grade, a record of every measurement, hypothesis, and wrong turn they made along the way.",
    facultyImage: "https://picsum.photos/seed/brm-faculty-hugo/640/800",
    facultyImageAlt: "Hugo Tanaka, middle school science teacher",
    credentialsJson: JSON.stringify(DEFAULT_CREDENTIALS),
  });
  const credentials = parseList<string>(s.credentialsJson, DEFAULT_CREDENTIALS);
  return (
    <Section seed="home-faculty" count={3} className="py-24 md:py-32 bg-muted/30">
      <div className="grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 order-2 lg:order-1">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.2em] font-mono text-amber mb-3">
              {s.eyebrow}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-balance">
              {s.headline}
            </h2>
            <p className="text-base text-muted-foreground max-w-prose leading-relaxed mb-4">
              {s.body1}
            </p>
            <p className="text-base text-muted-foreground max-w-prose leading-relaxed">
              {s.body2}
            </p>
            <div className="mt-6 flex flex-wrap gap-6 text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground">
              {credentials.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
          </Reveal>
        </div>
        <div className="lg:col-span-6 order-1 lg:order-2">
          <Parallax offset={50}>
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-muted">
              <img
                src={s.facultyImage}
                alt={s.facultyImageAlt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </Parallax>
        </div>
      </div>
    </Section>
  );
}

/* ---------- Section 6: Why BRM - bento grid with varied cell sizes ---------- */
function WhyBRMBento() {
  const s = useSection("home.why", {
    headline: "Why families choose BRM",
    intro:
      "Eight reasons that came up again and again in conversations with current parents and alumni.",
    heroImage: "https://picsum.photos/seed/brm-why-campus-walk/800/800",
    heroImageAlt: "A student walking between studio buildings on campus",
    heroTitle: "A walkable campus that scales with your child",
    heroBody:
      "Twelve buildings, four gardens, one learning community that runs from kindergarten through grade 10.",
    smallTitle: "Small by design",
    smallBody:
      "Cap of 18 students per class, 22 per grade. The faculty know each student as a person, not a name on a roster.",
    ratioValue: "7:1",
    ratioLabel: "Faculty-to-student ratio across the school.",
    capstoneTitle: "Grade 10 capstone",
    capstoneBody:
      "Every grade 10 student ships a year-long project. Defended publicly in May.",
    outdoorTitle: "Outdoor education, weekly",
    outdoorBody:
      "Every Wednesday afternoon, regardless of weather. The forest is part of the curriculum, not a reward for finishing it.",
    aidTitle: "Financial aid that actually scales",
    aidBody:
      "38% of families receive need-based aid. The average award covers 47% of tuition. Apply without affecting admission odds.",
    counselingTitle: "College counseling that starts in 9th grade",
    counselingBody:
      "One counselor per 25 students. Four years to find the right fit, not four months to fill out applications.",
    lunchTitle: "Family-style lunch",
    lunchBody:
      "Mixed-age tables, faculty hosts, real food from the school garden. The most underrated part of the day.",
  });
  return (
    <Section seed="home-why-bento" count={3} className="py-24 md:py-32">
      <Reveal as="header" className="mb-12 max-w-2xl">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
          {s.headline}
        </h2>
        <p className="text-base text-muted-foreground">
          {s.intro}
        </p>
      </Reveal>

      <div className="grid md:grid-cols-4 gap-4 md:auto-rows-[14rem]">
        {/* Hero tile - 2x2 */}
        <Reveal className="md:col-span-2 md:row-span-2">
          <div className="relative w-full h-full rounded-2xl overflow-hidden">
            <img
              src={s.heroImage}
              alt={s.heroImageAlt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-brand-foreground">
              <h3 className="text-xl font-bold tracking-tight mb-1">
                {s.heroTitle}
              </h3>
              <p className="text-sm opacity-85">
                {s.heroBody}
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05} className="md:col-span-2">
          <div className="w-full h-full rounded-2xl border border-border p-6 bg-card">
            <h3 className="text-xl font-bold tracking-tight mb-2">{s.smallTitle}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {s.smallBody}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="w-full h-full rounded-2xl bg-amber/15 p-6">
            <p className="text-4xl font-bold tracking-tighter text-amber mb-1">{s.ratioValue}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {s.ratioLabel}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="w-full h-full rounded-2xl border border-border p-6 bg-card">
            <h3 className="text-base font-bold tracking-tight mb-2">{s.capstoneTitle}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {s.capstoneBody}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2} className="md:col-span-2">
          <div className="w-full h-full rounded-2xl border border-border p-6 bg-card">
            <h3 className="text-base font-bold tracking-tight mb-2">
              {s.outdoorTitle}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {s.outdoorBody}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.25} className="md:col-span-2">
          <div className="w-full h-full rounded-2xl bg-brand text-brand-foreground p-6 flex flex-col justify-between">
            <h3 className="text-base font-bold tracking-tight mb-2">
              {s.aidTitle}
            </h3>
            <p className="text-sm opacity-85 leading-relaxed">
              {s.aidBody}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.3} className="md:col-span-2">
          <div className="w-full h-full rounded-2xl border border-border p-6 bg-card">
            <h3 className="text-base font-bold tracking-tight mb-2">
              {s.counselingTitle}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {s.counselingBody}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.35} className="md:col-span-2">
          <div className="w-full h-full rounded-2xl border border-border p-6 bg-card">
            <h3 className="text-base font-bold tracking-tight mb-2">
              {s.lunchTitle}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {s.lunchBody}
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ---------- Section 7: Testimonials - horizontal scroll-snap (NOT a marquee) ---------- */
type Testimonial = { quote: string; name: string; role: string };

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    quote: "Our daughter came home talking about tectonic plates for three weeks. We didn't know what to do, but we loved it.",
    name: "Priya Ramanathan",
    role: "Parent, grade 4",
  },
  {
    quote: "The capstone program is the closest thing to real work I've ever asked students to do.",
    name: "David Cho",
    role: "High School faculty",
  },
  {
    quote: "I was nervous about the transition from public school. The faculty made space for who my kid already was.",
    name: "Aisha Okonkwo",
    role: "Parent, grade 7",
  },
  {
    quote: "They told me I had to defend my senior project in front of the whole school. I have never been more prepared for anything.",
    name: "Theo Vandermeer",
    role: "Alumnus, class of 2023",
  },
];

function TestimonialsSection() {
  const s = useSection("home.testimonials", {
    headline: "What families say",
    intro: "Pulled from a survey of current parents and 2024 alumni.",
    testimonialsJson: JSON.stringify(DEFAULT_TESTIMONIALS),
  });
  const testimonials = parseList<Testimonial>(s.testimonialsJson, DEFAULT_TESTIMONIALS);
  return (
    <Section seed="home-testimonials" count={2} className="py-24 md:py-32 bg-muted/30">
      <Reveal as="header" className="mb-10 flex flex-wrap justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
            {s.headline}
          </h2>
          <p className="text-base text-muted-foreground max-w-prose">
            {s.intro}
          </p>
        </div>
      </Reveal>

      <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-6 -mx-4 sm:-mx-6 px-4 sm:px-6 [scrollbar-width:simple]">
        {testimonials.map((t, i) => (
          <Reveal
            key={t.name}
            delay={i * 0.06}
            className="snap-start shrink-0 w-[88%] sm:w-[42%] lg:w-[31%]"
          >
            <figure className="h-full rounded-2xl border border-border bg-card p-7 flex flex-col">
              <Quotes size={28} className="text-amber mb-4" weight="fill" />
              <blockquote className="text-lg md:text-xl leading-snug font-medium tracking-tight text-balance">
                {t.quote}
              </blockquote>
              <figcaption className="mt-auto pt-6 text-sm">
                <p className="font-medium text-foreground">{t.name}</p>
                <p className="text-muted-foreground">{t.role}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Section 8: Campus life preview - masonry teaser ---------- */
type CampusImage = { src: string; alt: string; tall?: boolean };

const DEFAULT_CAMPUS_IMAGES: CampusImage[] = [
  { src: "https://picsum.photos/seed/brm-campus-library/600/800", alt: "Students reading in the library", tall: true },
  { src: "https://picsum.photos/seed/brm-campus-studio/600/500", alt: "Studio art class in progress" },
  { src: "https://picsum.photos/seed/brm-campus-garden/600/600", alt: "Working in the school garden" },
  { src: "https://picsum.photos/seed/brm-campus-cafeteria/600/700", alt: "Family-style lunch", tall: true },
  { src: "https://picsum.photos/seed/brm-campus-stage/600/450", alt: "Theater rehearsal" },
  { src: "https://picsum.photos/seed/brm-campus-court/600/700", alt: "Outdoor basketball", tall: true },
];

function CampusPreview() {
  const { setView } = useSite();
  const s = useSection("home.campus_preview", {
    headline: "Campus life",
    intro: "A glimpse of an ordinary Tuesday.",
    imagesJson: JSON.stringify(DEFAULT_CAMPUS_IMAGES),
  });
  const images = parseList<CampusImage>(s.imagesJson, DEFAULT_CAMPUS_IMAGES);
  return (
    <Section seed="home-campus-preview" count={3} className="py-24 md:py-32">
      <Reveal as="header" className="mb-10 flex flex-wrap justify-between gap-4 items-end">
        <div className="max-w-xl">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
            {s.headline}
          </h2>
          <p className="text-base text-muted-foreground">
            {s.intro}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setView("gallery")}
          className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-[0.14em] text-brand hover:text-amber transition-colors"
        >
          Full gallery
          <ArrowRight size={14} weight="bold" />
        </button>
      </Reveal>

      <div className="masonry">
        {images.map((img, i) => (
          <Reveal key={img.src} delay={i * 0.04}>
            <div className={`rounded-xl overflow-hidden bg-muted ${img.tall ? "aspect-[3/4]" : "aspect-[6/5]"}`}>
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Section 8: Upcoming events preview ---------- */
function EventsPreview({ onViewAll }: { onViewAll: () => void }) {
  const section = useSection("home.events", {
    headline: "Upcoming events",
    intro: "Open to families and the public unless noted. Click through for details.",
  });
  const events = useItemList<EventItem>("event");

  // Fall back to a few seeded events if Firestore is empty or not configured
  const fallback: EventItem[] = [
    {
      id: "fallback-ev1",
      title: "Spring open house series",
      date: "2026-03-12",
      time: "9:00 AM - 11:00 AM",
      location: "Founders Hall",
      description: "Walk through classrooms in session, meet faculty, ask questions.",
      imageSrc: "https://picsum.photos/seed/brm-event-open-house/800/600",
      category: "Open house",
    },
    {
      id: "fallback-ev2",
      title: "Grade 10 capstone showcase",
      date: "2026-04-04",
      time: "6:00 PM",
      location: "STEAM wing",
      description: "Every grade 10 student presents their year-long project.",
      imageSrc: "https://picsum.photos/seed/brm-event-capstone/800/600",
      category: "Academic",
    },
    {
      id: "fallback-ev3",
      title: "Middle school spring play",
      date: "2026-05-09",
      time: "7:00 PM",
      location: "Black box theater",
      description: "Grade 7 and 8 present an original one-act.",
      imageSrc: "https://picsum.photos/seed/brm-event-play/800/600",
      category: "Performance",
    },
  ];
  const all = events.length > 0 ? events : fallback;
  // Sort by date ascending, take first 3
  const upcoming = [...all]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <Section seed="home-events" count={2} className="py-24 md:py-32 bg-muted/30">
      <Reveal as="header" className="mb-10 flex flex-wrap justify-between gap-4 items-end">
        <div className="max-w-xl">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
            {section.headline}
          </h2>
          <p className="text-base text-muted-foreground">{section.intro}</p>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-[0.14em] text-brand hover:text-amber transition-colors"
        >
          All events
          <ArrowRight size={14} weight="bold" />
        </button>
      </Reveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {upcoming.map((e, i) => (
          <Reveal key={e.id} delay={i * 0.05}>
            <article className="rounded-2xl border border-border bg-card overflow-hidden h-full flex flex-col hover:border-amber/60 transition-colors">
              {e.imageSrc && (
                <div className="aspect-[16/9] overflow-hidden bg-muted">
                  <img src={e.imageSrc} alt={e.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground mb-2">
                  <CalendarBlank size={14} className="text-amber" />
                  <span>{new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                </div>
                <h3 className="text-lg font-bold tracking-tight mb-2">{e.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3 flex-1 line-clamp-3">{e.description}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  {e.time && <span className="inline-flex items-center gap-1"><Clock size={12} /> {e.time}</span>}
                  {e.location && <span className="inline-flex items-center gap-1"><MapPin size={12} /> {e.location}</span>}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Section 9: Gallery preview - masonry teaser ---------- */
function GalleryPreview({ onGallery }: { onGallery: () => void }) {
  const section = useSection("home.gallery_preview", {
    headline: "Campus life",
    intro: "A glimpse of an ordinary Tuesday.",
  });
  const images = [
    { src: "https://picsum.photos/seed/brm-campus-library/600/800", alt: "Students reading in the library", tall: true },
    { src: "https://picsum.photos/seed/brm-campus-studio/600/500", alt: "Studio art class in progress" },
    { src: "https://picsum.photos/seed/brm-campus-garden/600/600", alt: "Working in the school garden" },
    { src: "https://picsum.photos/seed/brm-campus-cafeteria/600/700", alt: "Family-style lunch", tall: true },
    { src: "https://picsum.photos/seed/brm-campus-stage/600/450", alt: "Theater rehearsal" },
    { src: "https://picsum.photos/seed/brm-campus-court/600/700", alt: "Outdoor basketball", tall: true },
  ];
  return (
    <Section seed="home-gallery-preview" count={2} className="py-24 md:py-32">
      <Reveal as="header" className="mb-10 flex flex-wrap justify-between gap-4 items-end">
        <div className="max-w-xl">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
            {section.headline}
          </h2>
          <p className="text-base text-muted-foreground">{section.intro}</p>
        </div>
        <button
          type="button"
          onClick={onGallery}
          className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-[0.14em] text-brand hover:text-amber transition-colors"
        >
          Full gallery
          <ArrowRight size={14} weight="bold" />
        </button>
      </Reveal>
      <div className="masonry">
        {images.map((img, i) => (
          <Reveal key={img.src} delay={i * 0.04}>
            <div className={`rounded-xl overflow-hidden bg-muted ${img.tall ? "aspect-[3/4]" : "aspect-[6/5]"}`}>
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Section 10: Videos - external link preview cards ---------- */
function VideosSection() {
  const section = useSection("home.videos", {
    headline: "Watch",
    intro: "Student productions, classroom visits, and event highlights. All play in a new tab on the source site.",
  });

  const videos = useItemList<VideoItem>("video");
  const fallback: VideoItem[] = [
    {
      id: "fallback-v1",
      externalUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnailUrl: "https://picsum.photos/seed/brm-video-classroom/800/450",
      title: "A day in grade 5",
      description: "Forty seconds of an ordinary Wednesday, filmed by students.",
      durationLabel: "0:42",
      source: "YouTube",
    },
    {
      id: "fallback-v2",
      externalUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnailUrl: "https://picsum.photos/seed/brm-video-capstone/800/450",
      title: "How the grade 10 capstone works",
      description: "Faculty and students walk through the year-long project.",
      durationLabel: "3:21",
      source: "YouTube",
    },
    {
      id: "fallback-v3",
      externalUrl: "https://vimeo.com/123456789",
      thumbnailUrl: "https://picsum.photos/seed/brm-video-spring-play/800/450",
      title: "Spring play, 2025",
      description: "Full recording of the grade 8 original one-act performance.",
      durationLabel: "47:30",
      source: "Vimeo",
    },
  ];
  const all = videos.length > 0 ? videos : fallback;

  return (
    <Section seed="home-videos" count={2} className="py-24 md:py-32 bg-muted/30">
      <Reveal as="header" className="mb-10 max-w-2xl">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
          {section.headline}
        </h2>
        <p className="text-base text-muted-foreground">{section.intro}</p>
      </Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {all.map((v, i) => (
          <Reveal key={v.id} delay={i * 0.05}>
            <a
              href={v.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl border border-border bg-card overflow-hidden hover:border-amber/60 transition-colors"
            >
              <div className="relative aspect-video bg-muted overflow-hidden">
                {v.thumbnailUrl ? (
                  <img
                    src={v.thumbnailUrl}
                    alt={v.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full grid place-items-center">
                    <PlayCircle size={36} className="text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 grid place-items-center transition-opacity">
                  <PlayCircle size={56} weight="fill" className="text-white drop-shadow-lg" />
                </div>
                {v.durationLabel && (
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white text-xs font-mono">
                    {v.durationLabel}
                  </span>
                )}
              </div>
              <div className="p-5">
                <p className="text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground mb-1">
                  {v.source ?? "External"} · Opens new tab
                </p>
                <h3 className="text-lg font-bold tracking-tight mb-1">{v.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{v.description}</p>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Section 11: FAQ accordion ---------- */
function HomeFAQ() {
  const section = useSection("home.faq", {
    headline: "Quick answers",
    intro: "The questions families ask most. For more, see the full FAQ on the Admissions page.",
  });

  const allFaqs = useItemList<FAQItem>("faq");
  const faqs = allFaqs.filter((f) => f.page === "home").sort((a, b) => a.order - b.order);

  const fallbackFaqs = [
    { q: "What grades does BRM serve?", a: "Kindergarten through grade 10. We do not currently offer grades 11 or 12." },
    { q: "What is the application deadline?", a: "January 15 for the following fall. Late applications go on the waitlist." },
    { q: "Do you offer financial aid?", a: "Yes. 38% of families receive need-based aid. The average award covers 47% of tuition." },
    { q: "Do you require standardized testing?", a: "No. We do not require the ISEE, SSAT, or any other entrance exam." },
    { q: "Can my child visit for a day?", a: "Yes. Every applicant gets a half-day visit in their current grade, paired with a student host." },
  ];

  const list = faqs.length > 0 ? faqs.map(f => ({ q: f.question, a: f.answer })) : fallbackFaqs;

  return (
    <Section seed="home-faq" count={2} className="py-24 md:py-32">
      <Reveal as="header" className="mb-10 max-w-2xl">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
          {section.headline}
        </h2>
        <p className="text-base text-muted-foreground">{section.intro}</p>
      </Reveal>
      <Reveal>
        <Accordion type="single" collapsible className="border-t border-border">
          {list.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b border-border px-2">
              <AccordionTrigger className="text-base md:text-lg font-medium tracking-tight text-left py-5 hover:text-amber transition-colors">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-base text-muted-foreground leading-relaxed pb-5">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </Section>
  );
}

/* ---------- Section 13: News + admissions CTA - split 2/1 ---------- */
type NewsCard = { tag: string; date: string; title: string; excerpt: string };

const DEFAULT_NEWS: NewsCard[] = [
  {
    tag: "Announcement",
    date: "March 14, 2026",
    title: "BRM awarded state grant for forest stewardship program",
    excerpt: "The three-year grant funds a partnership with the Willowbrook Watershed Council.",
  },
  {
    tag: "Student work",
    date: "February 28, 2026",
    title: "Grade 10 chemistry class publishes water-quality dataset",
    excerpt: "Eight months of sampling along the Cooper River, openly licensed on Zenodo.",
  },
  {
    tag: "Community",
    date: "February 12, 2026",
    title: "Annual spring festival open to the public, May 4",
    excerpt: "Student performances, studio tours, plant sale, food. Admission is free.",
  },
];

function NewsAndCTA({ onInquire, onGallery }: { onInquire: () => void; onGallery: () => void }) {
  const s = useSection("home.news_cta", {
    headline: "From the school journal",
    ctaHeadline: "Visit us this spring",
    ctaBody:
      "Open houses run every Thursday at 9am from January through April. Or schedule a private tour any weekday.",
    ctaPrimary: "Inquire now",
    ctaSecondary: "See the campus",
    newsJson: JSON.stringify(DEFAULT_NEWS),
  });
  const news = parseList<NewsCard>(s.newsJson, DEFAULT_NEWS);
  return (
    <Section seed="home-news-cta" count={2} className="py-24 md:py-32">
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <Reveal as="header" className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              {s.headline}
            </h2>
          </Reveal>
          <ul className="divide-y divide-border">
            {news.map((n, i) => (
              <Reveal as="li" key={n.title} delay={i * 0.05}>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="block py-6 group hover:bg-muted/30 -mx-3 px-3 rounded-md transition-colors"
                >
                  <div className="flex flex-wrap items-baseline gap-3 text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground mb-2">
                    <span className="text-amber">{n.tag}</span>
                    <span>{n.date}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-medium tracking-tight text-foreground group-hover:text-brand transition-colors mb-2">
                    {n.title}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-prose">{n.excerpt}</p>
                </a>
              </Reveal>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-4">
          <Reveal delay={0.1}>
            <div className="sticky top-24 rounded-2xl bg-brand text-brand-foreground p-7">
              <h3 className="text-2xl font-bold tracking-tight mb-3">
                {s.ctaHeadline}
              </h3>
              <p className="text-sm opacity-85 mb-6 leading-relaxed">
                {s.ctaBody}
              </p>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={onInquire}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-amber text-amber-foreground font-medium hover:bg-amber/90 transition-colors"
                >
                  {s.ctaPrimary}
                  <ArrowRight size={16} weight="bold" />
                </button>
                <button
                  type="button"
                  onClick={onGallery}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-brand-foreground/30 hover:border-amber transition-colors"
                >
                  {s.ctaSecondary}
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
