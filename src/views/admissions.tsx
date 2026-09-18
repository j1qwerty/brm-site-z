"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check } from "@phosphor-icons/react/dist/ssr";
import { Section } from "@/components/site/section";
import { Parallax, Reveal, Stagger } from "@/components/site/motion-primitives";
import { useSite } from "@/components/site/site-context";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

/*
  ADMISSIONS VIEW - 7 sections
  1. Editorial hero
  2. Process timeline - vertical 4-step
  3. Requirements checklist - grouped
  4. Tuition & fees - redesigned spec sheet (per taste-skill §4.9 alternatives)
  5. Financial aid - clear info card
  6. FAQ - accordion
  7. Inquiry CTA
*/
export function AdmissionsView() {
  const { setView } = useSite();
  return (
    <>
      <AdmissionsHero onInquire={() => setView("inquiry")} />
      <ProcessTimeline />
      <RequirementsChecklist />
      <TuitionSheet />
      <FinancialAid />
      <AdmissionsFAQ />
      <AdmissionsCTA onInquire={() => setView("inquiry")} />
    </>
  );
}

function AdmissionsHero({ onInquire }: { onInquire: () => void }) {
  const reduce = useReducedMotion();
  return (
    <Section seed="admissions-hero" count={3} className="py-20 md:py-32 min-h-[78dvh] flex items-center">
      <div className="grid lg:grid-cols-12 gap-10 items-center w-full">
        <div className="lg:col-span-7">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-[0.2em] font-mono text-amber mb-6"
          >
            Admissions
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-balance text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.02]"
          >
            We admit 64 students a year, on purpose.
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="mt-8 text-base text-muted-foreground max-w-[60ch] leading-relaxed"
          >
            Small classes mean small admits. The process is long because we
            want to know your child, not just their file.
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <button
              type="button"
              onClick={onInquire}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-brand text-brand-foreground font-medium hover:bg-brand/90 transition-colors"
            >
              Start your inquiry
              <ArrowRight size={16} weight="bold" />
            </button>
          </motion.div>
        </div>
        <div className="lg:col-span-5">
          <Parallax offset={40}>
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-muted">
              <img
                src="https://picsum.photos/seed/brm-admissions-open-house/640/800"
                alt="Parents and students at an open house tour"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          </Parallax>
        </div>
      </div>
    </Section>
  );
}

function ProcessTimeline() {
  const steps = [
    {
      n: "01",
      title: "Inquiry",
      body: "Fill out the inquiry form. We send you the full viewbook and a calendar of open houses.",
      when: "Anytime, year-round",
    },
    {
      n: "02",
      title: "Visit",
      body: "Come to an open house or schedule a private tour. Your child is welcome at both.",
      when: "October through April",
    },
    {
      n: "03",
      title: "Apply",
      body: "Online application, school records, two teacher recommendations, student essay.",
      when: "Deadline January 15",
    },
    {
      n: "04",
      title: "Decision",
      body: "Family meeting and student visit day. Decisions released March 10. Aid decisions March 17.",
      when: "March",
    },
  ];
  return (
    <Section seed="admissions-process" count={2} className="py-24 md:py-32">
      <Reveal as="header" className="mb-12 max-w-2xl">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">The process, in four steps</h2>
        <p className="text-base text-muted-foreground">
          From inquiry to decision in roughly five months. The pace is
          deliberate. We want to know your family.
        </p>
      </Reveal>
      <ol className="grid md:grid-cols-2 gap-6">
        {steps.map((s, i) => (
          <Reveal as="li" key={s.n} delay={i * 0.05}>
            <div className="rounded-2xl border border-border bg-card p-7 h-full">
              <div className="flex items-baseline gap-3 mb-3">
                <p className="font-mono text-amber text-sm tracking-[0.12em]">{s.n}</p>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight">{s.title}</h3>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                {s.body}
              </p>
              <p className="text-xs font-mono uppercase tracking-[0.14em] text-brand">
                {s.when}
              </p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

function RequirementsChecklist() {
  const groups = [
    {
      group: "Required from you",
      items: [
        "Online application form (one per student)",
        "Student essay, 500 words, any topic",
        "Two teacher recommendations (math + humanities)",
        "School records from past two years",
        "Family meeting (in person or video)",
      ],
    },
    {
      group: "Required from us",
      items: [
        "Full viewbook and curriculum guide",
        "Personal tour with a current student host",
        "Half-day student visit in the applicant's grade",
        "Financial aid estimate, no commitment",
        "Direct email to the head of school, anytime",
      ],
    },
  ];
  return (
    <Section seed="admissions-reqs" count={2} className="py-24 md:py-32 bg-muted/30">
      <Reveal as="header" className="mb-12 max-w-2xl">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">What you will need</h2>
        <p className="text-base text-muted-foreground">
          A short list on both sides. We try not to ask for anything we would
          not want to provide ourselves.
        </p>
      </Reveal>
      <div className="grid md:grid-cols-2 gap-8">
        {groups.map((g, i) => (
          <Reveal key={g.group} delay={i * 0.05}>
            <div>
              <h3 className="text-sm font-mono uppercase tracking-[0.14em] text-amber mb-5">
                {g.group}
              </h3>
              <Stagger className="space-y-4">
                {g.items.map((item) => (
                  <Stagger.Item key={item} y={12}>
                    <div className="flex items-start gap-3">
                      <Check size={18} weight="bold" className="text-amber shrink-0 mt-0.5" />
                      <p className="text-base text-foreground leading-relaxed">{item}</p>
                    </div>
                  </Stagger.Item>
                ))}
              </Stagger>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function TuitionSheet() {
  // Per taste-skill §4.9: avoid the long spec-table with hairline rows.
  // Use a 2-col card grid with the spec name + value + "why it matters" body.
  const rows = [
    { grade: "Lower School (K-5)", tuition: "$24,800", body: "Two teachers per classroom, all books and supplies included." },
    { grade: "Middle School (6-8)", tuition: "$28,400", body: "Lab fees, world-language materials, and grade trips included." },
    { grade: "High School (9-10)", tuition: "$31,200", body: "Capstone mentorship and up to two AP exams included." },
    { grade: "Optional: Bus route", tuition: "$1,800", body: "Three routes: eastside, westside, south metro." },
    { grade: "Optional: Lunch plan", tuition: "$1,400", body: "Family-style lunch, ingredients from the school garden." },
    { grade: "Optional: After-school", tuition: "$950", body: "Daily through 6pm. Includes one enrichment activity per term." },
  ];
  return (
    <Section seed="admissions-tuition" count={2} className="py-24 md:py-32">
      <Reveal as="header" className="mb-12 max-w-2xl">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">Tuition & fees, 2026-27</h2>
        <p className="text-base text-muted-foreground">
          Per-year tuition by grade band. Optional add-ons listed separately.
          No hidden fees, no fundraising quotas.
        </p>
      </Reveal>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map((r, i) => (
          <Reveal key={r.grade} delay={i * 0.05}>
            <div className="rounded-2xl border border-border bg-card p-6 h-full">
              <p className="text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground mb-2">
                {r.grade}
              </p>
              <p className="text-3xl font-bold tracking-tighter text-brand mb-2">
                {r.tuition}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {r.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <p className="mt-8 text-xs text-muted-foreground">
          Tuition is set annually by the Board in February. A non-refundable
          enrollment deposit of $1,200 is due at enrollment and credited
          against final tuition.
        </p>
      </Reveal>
    </Section>
  );
}

function FinancialAid() {
  return (
    <Section seed="admissions-aid" count={2} className="py-24 md:py-32 bg-muted/30">
      <Reveal>
        <div className="grid lg:grid-cols-12 gap-8 items-center rounded-3xl bg-brand text-brand-foreground p-8 md:p-14">
          <div className="lg:col-span-7">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-balance">
              If tuition is a stretch, ask anyway.
            </h2>
            <p className="text-base opacity-85 max-w-prose leading-relaxed mb-4">
              Thirty-eight percent of families receive need-based aid. The
              average award covers 47 percent of tuition. Aid decisions are
              made independently of admission decisions.
            </p>
            <p className="text-base opacity-85 max-w-prose leading-relaxed">
              Apply through SSS (School and Student Services). The application
              takes about 40 minutes. We do not see your finances; we see a
              single recommended award.
            </p>
          </div>
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-brand-foreground/20 p-5">
              <p className="text-3xl font-bold tracking-tighter text-amber">38%</p>
              <p className="text-xs opacity-80 mt-1">Of families receive aid</p>
            </div>
            <div className="rounded-xl border border-brand-foreground/20 p-5">
              <p className="text-3xl font-bold tracking-tighter text-amber">47%</p>
              <p className="text-xs opacity-80 mt-1">Average award size</p>
            </div>
            <div className="rounded-xl border border-brand-foreground/20 p-5">
              <p className="text-3xl font-bold tracking-tighter text-amber">$2.4M</p>
              <p className="text-xs opacity-80 mt-1">Total aid budget</p>
            </div>
            <div className="rounded-xl border border-brand-foreground/20 p-5">
              <p className="text-3xl font-bold tracking-tighter text-amber">K-10</p>
              <p className="text-xs opacity-80 mt-1">Aid at every grade</p>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

function AdmissionsFAQ() {
  const faqs = [
    {
      q: "What is your application deadline?",
      a: "January 15 for the following fall. We accept late applications on a rolling basis for the waitlist. Aid decisions require the SSS application to be complete by February 1.",
    },
    {
      q: "Do you accept transfer students mid-year?",
      a: "Yes, when there is space in the grade. We typically have one or two mid-year openings across the school. Contact the admissions office for current availability.",
    },
    {
      q: "Do you require standardized testing?",
      a: "No. We do not require the ISEE, SSAT, or any other entrance exam. We believe your child's school record and teacher recommendations tell us more.",
    },
    {
      q: "What is the student visit day like?",
      a: "Your child spends a half-day in their current grade, paired with a student host. They attend classes, eat lunch with us, and meet the grade-level faculty. It is the most important part of the process for us.",
    },
    {
      q: "How does the family meeting work?",
      a: "Forty-five minutes, in person or on video. Both parents and the student attend. We talk about your child and your questions, not ours. There are no right answers.",
    },
    {
      q: "What happens if my child is waitlisted?",
      a: "We keep the waitlist active through the summer. Offers come off the list as space opens, usually in April and again in June. We will tell you where you are on the list, honestly.",
    },
  ];
  return (
    <Section seed="admissions-faq" count={2} className="py-24 md:py-32">
      <Reveal as="header" className="mb-10 max-w-2xl">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">Frequently asked</h2>
        <p className="text-base text-muted-foreground">
          The questions we hear most often. Email us for anything not on this
          list.
        </p>
      </Reveal>
      <Reveal>
        <Accordion type="single" collapsible className="border-t border-border">
          {faqs.map((f, i) => (
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

function AdmissionsCTA({ onInquire }: { onInquire: () => void }) {
  return (
    <Section seed="admissions-cta" count={2} className="py-24 md:py-32">
      <Reveal>
        <div className="rounded-3xl bg-amber/15 border border-amber/30 p-8 md:p-14 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3 text-balance">
              Ready to start?
            </h2>
            <p className="text-base text-muted-foreground max-w-prose leading-relaxed">
              The inquiry form takes about three minutes. You will hear back
              from a real person, usually within one business day.
            </p>
          </div>
          <div className="lg:col-span-4 lg:justify-self-end">
            <button
              type="button"
              onClick={onInquire}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-brand text-brand-foreground font-medium hover:bg-brand/90 transition-colors"
            >
              Start inquiry
              <ArrowRight size={18} weight="bold" />
            </button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
