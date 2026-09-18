"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Section } from "@/components/site/section";
import { Parallax, Reveal, Stagger } from "@/components/site/motion-primitives";
import { useSite } from "@/components/site/site-context";

/*
  ACADEMICS VIEW - 7 sections
  1. Editorial hero
  2. Curriculum by grade band - chunked table (NOT long spec sheet)
  3. Departments - vertical list with depth
  4. Sample weekly schedule - actual weekly grid
  5. Outcomes - alumni college destinations + capstone archive
  6. Field studies & partners - marquee (only one on page)
  7. CTA card
*/
export function AcademicsView() {
  const { setView } = useSite();
  return (
    <>
      <AcademicsHero />
      <CurriculumBands />
      <DepartmentsList />
      <SampleSchedule />
      <OutcomesSection />
      <FieldStudies />
      <AcademicsCTA onInquire={() => setView("inquiry")} />
    </>
  );
}

function AcademicsHero() {
  const reduce = useReducedMotion();
  return (
    <Section seed="academics-hero" count={3} className="py-20 md:py-32 min-h-[78dvh] flex items-center">
      <div className="grid lg:grid-cols-12 gap-10 items-end w-full">
        <div className="lg:col-span-7">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-[0.2em] font-mono text-amber mb-6"
          >
            Academics
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-balance text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.02]"
          >
            A curriculum that compounds, year over year.
          </motion.h1>
        </div>
        <div className="lg:col-span-5">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="text-base text-muted-foreground leading-relaxed max-w-prose"
          >
            Each grade band is designed to build on the last without gaps or
            repetition. The same faculty teach across the band, so they know
            exactly what your child learned the year before.
          </motion.p>
        </div>
      </div>
    </Section>
  );
}

function CurriculumBands() {
  const bands = [
    {
      band: "Lower School",
      grades: "K through 5",
      summary: "Foundational literacy, numeracy, and care for the natural world. Two teachers per classroom.",
      subjects: [
        { name: "Literacy", body: "Daily reader's and writer's workshop. Two hours per day across the band." },
        { name: "Mathematics", body: "Singapore-style, conceptual first. 60 minutes daily." },
        { name: "Science", body: "Three units per year, integrated with the school garden." },
        { name: "Studio", body: "Visual art, music, and movement on a three-week rotation." },
        { name: "Forest", body: "Wednesday afternoons, every week, in every weather." },
      ],
    },
    {
      band: "Middle School",
      grades: "6 through 8",
      summary: "Transition to disciplinary depth. Students move between specialist faculty for the first time.",
      subjects: [
        { name: "Humanities", body: "Integrated English and history. Three civilizations per year." },
        { name: "Mathematics", body: "Pre-algebra in grade 6, algebra in grade 7, geometry in grade 8." },
        { name: "Lab Science", body: "Physics, chemistry, biology, in rotation, taught as separate labs." },
        { name: "World Languages", body: "Spanish, Mandarin, or French. Four years required to graduate." },
        { name: "Arts", body: "Choose a primary and a secondary art. Both required each year." },
      ],
    },
    {
      band: "High School",
      grades: "9 through 10",
      summary: "College-prep with the grade 10 capstone, dual-enrollment, and independent study in a field of choice.",
      subjects: [
        { name: "English", body: "Two years. American, British, World, and a capstone-linked research seminar." },
        { name: "Mathematics", body: "Algebra 2, Pre-calc, Calculus, Statistics, or Discrete Math." },
        { name: "Science", body: "Three lab sciences required. AP option in each." },
        { name: "History", body: "World, US, and a primary-source research seminar tied to the capstone." },
        { name: "Capstone", body: "Year-long project, defended publicly in May. Required to graduate from grade 10." },
      ],
    },
  ];
  return (
    <Section seed="academics-bands" count={2} className="py-24 md:py-32">
      <Reveal as="header" className="mb-12 max-w-2xl">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">Curriculum by band</h2>
        <p className="text-base text-muted-foreground">
          Three bands, each designed by the faculty who teach in it. Click
          into any subject for the full scope and sequence.
        </p>
      </Reveal>
      <div className="space-y-12">
        {bands.map((b, i) => (
          <Reveal key={b.band} delay={i * 0.05}>
            <div className="border border-border rounded-2xl overflow-hidden bg-card">
              <div className="grid lg:grid-cols-12 gap-px">
                <div className="lg:col-span-4 p-7 bg-brand text-brand-foreground">
                  <p className="text-xs font-mono uppercase tracking-[0.16em] opacity-80 mb-2">
                    {b.grades}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                    {b.band}
                  </h3>
                  <p className="text-sm opacity-85 leading-relaxed">{b.summary}</p>
                </div>
                <div className="lg:col-span-8 p-7">
                  <ul className="space-y-4">
                    {b.subjects.map((s) => (
                      <li key={s.name} className="grid grid-cols-[8rem_1fr] gap-4">
                        <p className="text-sm font-bold tracking-tight text-brand">
                          {s.name}
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {s.body}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function DepartmentsList() {
  const departments = [
    { name: "Humanities & Literature", lead: "Ben Carter", body: "American literature to creative nonfiction. Senior seminar on primary-source research.", count: "7 faculty" },
    { name: "Mathematics & Computing", lead: "Mei-Ling Park", body: "Singapore math through multivariable calculus. Three sections of computer science.", count: "5 faculty" },
    { name: "Lab Sciences", lead: "Hugo Tanaka", body: "Physics, chemistry, biology. All taught as separate labs starting grade 6.", count: "6 faculty" },
    { name: "World Languages", lead: "Lucia Marchetti", body: "Spanish, Mandarin, French. Four-year minimum requirement for graduation.", count: "4 faculty" },
    { name: "Studio & Performance Arts", lead: "Marcus Bell", body: "Visual art, music, theater, film. Every student must ship a public work each year.", count: "8 faculty" },
    { name: "Health & Wellness", lead: "Jen Okonkwo", body: "Movement, nutrition, mental health. Required weekly through grade 10.", count: "3 faculty" },
  ];
  return (
    <Section seed="academics-departments" count={2} className="py-24 md:py-32 bg-muted/30">
      <Reveal as="header" className="mb-12 max-w-2xl">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">Departments</h2>
        <p className="text-base text-muted-foreground">
          Six departments, each led by a teaching department chair. Email any
          chair directly.
        </p>
      </Reveal>
      <ul className="divide-y divide-border">
        {departments.map((d, i) => (
          <Reveal as="li" key={d.name} delay={i * 0.04}>
            <div className="py-6 grid md:grid-cols-12 gap-4 items-baseline">
              <div className="md:col-span-4">
                <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-1">
                  {d.name}
                </h3>
                <p className="text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground">
                  {d.count} · Chair: {d.lead}
                </p>
              </div>
              <p className="md:col-span-7 text-base text-muted-foreground leading-relaxed">
                {d.body}
              </p>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="md:col-span-1 md:justify-self-end inline-flex items-center gap-1 text-sm font-mono uppercase tracking-[0.12em] text-brand hover:text-amber transition-colors"
              >
                Visit
                <ArrowUpRight size={14} weight="bold" />
              </a>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

function SampleSchedule() {
  // Per taste-skill §4.9: long lists need a different UI. A weekly grid IS the right UI for a schedule.
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const slots = [
    { time: "08:30", mon: "Morning meeting", tue: "Morning meeting", wed: "Morning meeting", thu: "Morning meeting", fri: "Morning meeting" },
    { time: "09:00", mon: "Humanities block", tue: "Math block", wed: "Lab science", thu: "Humanities block", fri: "Math block" },
    { time: "10:30", mon: "Studio art", tue: "World languages", wed: "Forest classroom", thu: "World languages", fri: "Music" },
    { time: "12:00", mon: "Family lunch", tue: "Family lunch", wed: "Family lunch", thu: "Family lunch", fri: "Family lunch" },
    { time: "13:00", mon: "Math workshop", tue: "Humanities block", wed: "Field study", thu: "Lab science", fri: "Independent reading" },
    { time: "14:30", mon: "Movement", tue: "Movement", wed: "Field study", thu: "Movement", fri: "Advisory" },
    { time: "15:30", mon: "Dismissal", tue: "Dismissal", wed: "Dismissal", thu: "Dismissal", fri: "Dismissal" },
  ];
  return (
    <Section seed="academics-schedule" count={2} className="py-24 md:py-32">
      <Reveal as="header" className="mb-12 max-w-2xl">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">Sample week, grade 7</h2>
        <p className="text-base text-muted-foreground">
          Real schedule from spring 2026. Wednesday afternoons are dedicated
          to field study, every week.
        </p>
      </Reveal>
      <Reveal>
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-3 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">Time</th>
                {days.map((d) => (
                  <th key={d} className="text-left p-3 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slots.map((s, i) => (
                <tr key={s.time} className={i % 2 === 0 ? "bg-card" : "bg-muted/20"}>
                  <td className="p-3 font-mono text-xs text-brand whitespace-nowrap">{s.time}</td>
                  {days.map((d) => {
                    const cell = (s as unknown as Record<string, string>)[d.toLowerCase()];
                    return (
                      <td key={d} className="p-3 align-top">
                        <p className="text-foreground">{cell}</p>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </Section>
  );
}

function OutcomesSection() {
  const colleges = [
    "Reed", "Lewis & Clark", "Whitman", "Willamette", "Oberlin", "Wesleyan", "Beloit", "Macalester", "Pomona", "Colorado College", "Evergreen", "MIT", "Cornell", "Stanford", "UW Honors",
  ];
  return (
    <Section seed="academics-outcomes" count={2} className="py-24 md:py-32 bg-muted/30">
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <Reveal as="header">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">Where our graduates go</h2>
            <p className="text-base text-muted-foreground max-w-prose leading-relaxed">
              Our college counselor does not chase rankings. Our students pick
              schools that fit who they are. The list below is the past five
              graduating classes.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8 grid grid-cols-3 gap-6">
              <div>
                <p className="text-3xl font-bold tracking-tighter text-amber">94%</p>
                <p className="text-xs text-muted-foreground mt-1">Matriculate to first-choice</p>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tighter text-amber">87%</p>
                <p className="text-xs text-muted-foreground mt-1">Graduate in four years</p>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tighter text-amber">2.4</p>
                <p className="text-xs text-muted-foreground mt-1">Avg. college credit on entry</p>
              </div>
            </div>
          </Reveal>
        </div>
        <div className="lg:col-span-7">
          <Reveal delay={0.05}>
            <div className="rounded-2xl border border-border bg-card p-7">
              <p className="text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground mb-4">
                Past five graduating classes
              </p>
              <ul className="flex flex-wrap gap-x-5 gap-y-2.5">
                {colleges.map((c) => (
                  <li key={c} className="text-sm font-medium text-foreground">
                    {c}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground mb-4">
                Grade 10 capstones, 2025
              </p>
              <ul className="space-y-2 text-sm">
                <li><span className="text-amber font-mono mr-2">·</span>Designing a low-cost water sensor for the Cooper River watershed</li>
                <li><span className="text-amber font-mono mr-2">·</span>Translating a previously untranslated Borges short story</li>
                <li><span className="text-amber font-mono mr-2">·</span>A statistical history of Pacific Northwest heat waves</li>
                <li><span className="text-amber font-mono mr-2">·</span>An original one-act play, performed in the black box</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

function FieldStudies() {
  // Per taste-skill §5: marquee is at most ONE per page. This is the one.
  const partners = [
    "Willowbrook Watershed Council",
    "Oregon State Marine Board",
    "Portland Museum of Craft",
    "Reed College Biology",
    "Oregon Zoo",
    "Bicycle Transportation Alliance",
    "Portland City Archives",
    "Zenodo Open Data",
    "Ecotrust",
    "Pacific Northwest College of Art",
  ];
  return (
    <Section seed="academics-field" count={2} className="py-24 md:py-32 overflow-hidden">
      <Reveal as="header" className="mb-10 max-w-2xl">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">Field studies & partners</h2>
        <p className="text-base text-muted-foreground">
          Real organizations our students work with, every year.
        </p>
      </Reveal>
      <div className="relative overflow-hidden">
        <motion.div
          className="flex gap-10 whitespace-nowrap will-change-transform"
          initial={{ x: 0 }}
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        >
          {[...partners, ...partners].map((p, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-3 text-xl md:text-2xl font-medium tracking-tight text-muted-foreground"
            >
              {p}
              <span className="text-amber">·</span>
            </span>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

function AcademicsCTA({ onInquire }: { onInquire: () => void }) {
  return (
    <Section seed="academics-cta" count={2} className="py-24 md:py-32">
      <Reveal>
        <div className="rounded-3xl bg-brand text-brand-foreground p-8 md:p-14 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3 text-balance">
              Talk to a department chair.
            </h2>
            <p className="text-base opacity-85 max-w-prose leading-relaxed">
              Each chair runs an open office hour every Thursday. Bring your
              questions, leave with a syllabus and a reading list.
            </p>
          </div>
          <div className="lg:col-span-4 lg:justify-self-end">
            <button
              type="button"
              onClick={onInquire}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-amber text-amber-foreground font-medium hover:bg-amber/90 transition-colors"
            >
              Book office hour
              <ArrowRight size={18} weight="bold" />
            </button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
