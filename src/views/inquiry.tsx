"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, PaperPlaneTilt, Warning } from "@phosphor-icons/react/dist/ssr";
import { Section } from "@/components/site/section";
import { Reveal } from "@/components/site/motion-primitives";
import { useToast } from "@/hooks/use-toast";
import { isFirebaseConfigured, getDb } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

/*
  INQUIRY VIEW - 4 sections
  1. Editorial hero
  2. Inquiry form (Firebase-backed) - structured: student + family + interests
  3. What happens next - timeline of next steps after submitting
  4. FAQ quick links - 3 quick Q&A

  Form writes to Firestore collection "inquiries".
*/

type InquiryForm = {
  // Family / parent
  parentName: string;
  email: string;
  phone: string;
  // Student
  studentName: string;
  currentGrade: string;
  entryGrade: string;
  entryYear: string;
  // Interests
  interests: string[];
  howHeard: string;
  message: string;
};

const INITIAL: InquiryForm = {
  parentName: "",
  email: "",
  phone: "",
  studentName: "",
  currentGrade: "",
  entryGrade: "",
  entryYear: "2026-27",
  interests: [],
  howHeard: "",
  message: "",
};

const INTEREST_OPTIONS = [
  "Academics", "Athletics", "Studio art", "Music", "Theater",
  "Outdoor program", "Financial aid", "Learning support", "School culture",
];

const GRADE_OPTIONS = [
  "Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
  "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10",
];

const ENTRY_YEARS = ["2026-27", "2027-28", "2028-29"];

export function InquiryView() {
  return (
    <>
      <InquiryHero />
      <InquiryFormSection />
      <NextSteps />
      <QuickFAQ />
    </>
  );
}

function InquiryHero() {
  const reduce = useReducedMotion();
  return (
    <Section seed="inquiry-hero" count={3} className="py-20 md:py-32 min-h-[68dvh] flex items-center">
      <div className="max-w-4xl">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs uppercase tracking-[0.2em] font-mono text-amber mb-6"
        >
          Inquiry form
        </motion.p>
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="text-balance text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.02]"
        >
          Tell us about your student.
        </motion.h1>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="mt-6 text-base text-muted-foreground max-w-[60ch] leading-relaxed"
        >
          Takes about three minutes. We will reply within one business day
          from a real person in the admissions office, not a queue.
        </motion.p>
      </div>
    </Section>
  );
}

function InquiryFormSection() {
  const { toast } = useToast();
  const [form, setForm] = useState<InquiryForm>(INITIAL);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const firebaseReady = isFirebaseConfigured();

  const toggleInterest = (interest: string) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    if (!form.parentName.trim() || !form.email.trim() || !form.studentName.trim() || !form.entryGrade) {
      setStatus("error");
      setErrorMsg("Please complete parent name, email, student name, and the grade you are applying for.");
      return;
    }

    setStatus("submitting");
    setErrorMsg(null);

    const db = getDb();
    if (!db) {
      setStatus("error");
      setErrorMsg("Firebase is not configured. The site owner needs to add Firebase keys to .env.local. See README.md for instructions.");
      toast({
        title: "Firebase not configured",
        description: "Add Firebase keys to .env.local. See README.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addDoc(collection(db, "inquiries"), {
        parentName: form.parentName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        studentName: form.studentName.trim(),
        currentGrade: form.currentGrade.trim(),
        entryGrade: form.entryGrade,
        entryYear: form.entryYear,
        interests: form.interests,
        howHeard: form.howHeard.trim(),
        message: form.message.trim(),
        createdAt: serverTimestamp(),
      });
      setStatus("success");
      setForm(INITIAL);
      toast({
        title: "Inquiry received",
        description: "We will reply within one business day.",
      });
    } catch (err) {
      console.error("Inquiry submission failed:", err);
      setStatus("error");
      setErrorMsg("Something went wrong sending your inquiry. Please try again or email admissions@brm-international.org directly.");
    }
  };

  const inputClass =
    "w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber/60 focus:border-amber/60 transition-colors";

  return (
    <Section seed="inquiry-form" count={2} className="py-24 md:py-32">
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <Reveal as="header">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
              The form
            </h2>
            <p className="text-base text-muted-foreground max-w-prose leading-relaxed">
              All fields marked with an asterisk are required. Everything else
              helps us prepare for your first call.
            </p>
          </Reveal>
          {!firebaseReady && (
            <Reveal delay={0.1}>
              <div className="mt-6 rounded-lg border border-amber/40 bg-amber/10 p-4 flex gap-3">
                <Warning size={18} weight="fill" className="text-amber shrink-0 mt-0.5" />
                <p className="text-sm text-foreground leading-relaxed">
                  <strong>Firebase is not configured.</strong> The form below
                  will not submit. Add Firebase keys to{" "}
                  <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">.env.local</code>{" "}
                  and restart. See README.
                </p>
              </div>
            </Reveal>
          )}
        </div>

        <div className="lg:col-span-8">
          <Reveal delay={0.05}>
            {status === "success" ? (
              <motion.div
                initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-amber/40 bg-amber/10 p-8 text-center"
              >
                <PaperPlaneTilt size={36} weight="fill" className="text-amber mx-auto mb-4" />
                <h3 className="text-2xl font-bold tracking-tight mb-2">
                  Inquiry received
                </h3>
                <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
                  A real person in admissions will reply within one business
                  day. In the meantime, the next steps below are exactly what
                  happens after you hit submit.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:border-amber/60 text-sm"
                >
                  Submit another
                </button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-8"
                noValidate
              >
                {/* Family section */}
                <fieldset className="space-y-4">
                  <legend className="text-xs font-mono uppercase tracking-[0.14em] text-amber">
                    Family
                  </legend>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="inq-parent" className="block text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground">
                        Parent or guardian name *
                      </label>
                      <input
                        id="inq-parent"
                        type="text"
                        value={form.parentName}
                        onChange={(e) => setForm({ ...form, parentName: e.target.value })}
                        placeholder="Maria Rivera"
                        className={inputClass}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="inq-email" className="block text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground">
                        Email *
                      </label>
                      <input
                        id="inq-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="maria@email.com"
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="inq-phone" className="block text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground">
                      Phone <span className="text-muted-foreground/70 normal-case">(optional)</span>
                    </label>
                    <input
                      id="inq-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="(503) 555-0000"
                      className={inputClass}
                    />
                  </div>
                </fieldset>

                {/* Student section */}
                <fieldset className="space-y-4">
                  <legend className="text-xs font-mono uppercase tracking-[0.14em] text-amber">
                    Student
                  </legend>
                  <div className="space-y-2">
                    <label htmlFor="inq-student" className="block text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground">
                      Student name *
                    </label>
                    <input
                      id="inq-student"
                      type="text"
                      value={form.studentName}
                      onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                      placeholder="Theo Rivera"
                      className={inputClass}
                      required
                    />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="inq-current" className="block text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground">
                        Current grade
                      </label>
                      <select
                        id="inq-current"
                        value={form.currentGrade}
                        onChange={(e) => setForm({ ...form, currentGrade: e.target.value })}
                        className={inputClass}
                      >
                        <option value="">Select...</option>
                        {GRADE_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="inq-entry" className="block text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground">
                        Applying to *
                      </label>
                      <select
                        id="inq-entry"
                        value={form.entryGrade}
                        onChange={(e) => setForm({ ...form, entryGrade: e.target.value })}
                        className={inputClass}
                        required
                      >
                        <option value="">Select...</option>
                        {GRADE_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="inq-year" className="block text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground">
                        Entry year
                      </label>
                      <select
                        id="inq-year"
                        value={form.entryYear}
                        onChange={(e) => setForm({ ...form, entryYear: e.target.value })}
                        className={inputClass}
                      >
                        {ENTRY_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>
                </fieldset>

                {/* Interests */}
                <fieldset className="space-y-3">
                  <legend className="text-xs font-mono uppercase tracking-[0.14em] text-amber">
                    What are you most curious about?
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {INTEREST_OPTIONS.map((opt) => {
                      const active = form.interests.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => toggleInterest(opt)}
                          aria-pressed={active}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-sm transition-colors ${
                            active
                              ? "bg-brand text-brand-foreground border-brand"
                              : "border-border text-foreground hover:border-amber/60"
                          }`}
                        >
                          {active && <Check size={14} weight="bold" />}
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                {/* How heard + message */}
                <fieldset className="space-y-4">
                  <legend className="text-xs font-mono uppercase tracking-[0.14em] text-amber">
                    Anything else
                  </legend>
                  <div className="space-y-2">
                    <label htmlFor="inq-heard" className="block text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground">
                      How did you hear about us?
                    </label>
                    <input
                      id="inq-heard"
                      type="text"
                      value={form.howHeard}
                      onChange={(e) => setForm({ ...form, howHeard: e.target.value })}
                      placeholder="Friend, current family, web search, etc."
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="inq-msg" className="block text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground">
                      Message <span className="text-muted-foreground/70 normal-case">(optional)</span>
                    </label>
                    <textarea
                      id="inq-msg"
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Anything you would like the admissions office to know before the first call."
                      className={inputClass}
                    />
                  </div>
                </fieldset>

                {status === "error" && errorMsg && (
                  <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive-foreground flex gap-2 items-start">
                    <Warning size={16} weight="fill" className="shrink-0 mt-0.5" />
                    <p>{errorMsg}</p>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand text-brand-foreground font-medium hover:bg-brand/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === "submitting" ? "Sending..." : "Submit inquiry"}
                    <ArrowRight size={16} weight="bold" />
                  </button>
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

function NextSteps() {
  const steps = [
    { n: "1", title: "We reply within one business day", body: "A real person in the admissions office will email you, usually with the viewbook attached and a calendar link for a tour." },
    { n: "2", title: "You come visit", body: "Open house every Thursday at 9am from January through April, or a private tour any weekday morning. Your student is welcome at both." },
    { n: "3", title: "We meet your student", body: "Half-day visit in their current grade, paired with a student host. The most important part of the process for us." },
    { n: "4", title: "Decision, March 10", body: "Admission decisions released March 10. Aid decisions released March 17. We will tell you where you are on the waitlist, honestly." },
  ];
  return (
    <Section seed="inquiry-next" count={2} className="py-24 md:py-32 bg-muted/30">
      <Reveal as="header" className="mb-12 max-w-2xl">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">What happens next</h2>
        <p className="text-base text-muted-foreground">
          From the moment you hit submit to the day you get a decision.
        </p>
      </Reveal>
      <ol className="space-y-6">
        {steps.map((s, i) => (
          <Reveal as="li" key={s.n} delay={i * 0.04}>
            <div className="grid grid-cols-[3rem_1fr] gap-5 items-baseline">
              <p className="text-3xl font-bold tracking-tighter text-amber">{s.n}</p>
              <div>
                <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1">
                  {s.title}
                </h3>
                <p className="text-base text-muted-foreground max-w-prose leading-relaxed">
                  {s.body}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

function QuickFAQ() {
  const faqs = [
    {
      q: "What if I miss the January 15 deadline?",
      a: "Late applications go on the waitlist. We keep the list active through the summer. Email admissions if you are unsure.",
    },
    {
      q: "Do you offer shadow days?",
      a: "Yes. Every applicant gets a half-day visit in their current grade, paired with a student host. We schedule it after the application is complete.",
    },
    {
      q: "Is financial aid a separate process?",
      a: "Yes, through SSS (School and Student Services). It opens in October. Aid decisions are made independently of admission.",
    },
  ];
  return (
    <Section seed="inquiry-faq" count={2} className="py-24 md:py-32">
      <Reveal as="header" className="mb-10 max-w-2xl">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">Quick questions</h2>
      </Reveal>
      <div className="grid md:grid-cols-3 gap-4">
        {faqs.map((f, i) => (
          <Reveal key={f.q} delay={i * 0.05}>
            <div className="rounded-2xl border border-border bg-card p-6 h-full">
              <h3 className="text-base font-bold tracking-tight mb-2">{f.q}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
