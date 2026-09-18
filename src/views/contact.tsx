"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, PaperPlaneTilt, Warning } from "@phosphor-icons/react/dist/ssr";
import { Section } from "@/components/site/section";
import { Reveal } from "@/components/site/motion-primitives";
import { useToast } from "@/hooks/use-toast";
import { isFirebaseConfigured, getDb } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

/*
  CONTACT VIEW - 4 sections
  1. Editorial hero
  2. Contact form (Firebase-backed)
  3. Visit info - address, hours, what to expect
  4. Department contacts - grouped grid of who to contact for what

  Form writes to Firestore collection "contact_messages".
  If Firebase is not configured (no env vars), shows a friendly hint to the dev.
*/

type ContactFormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const INITIAL: ContactFormState = { name: "", email: "", subject: "", message: "" };

export function ContactView() {
  return (
    <>
      <ContactHero />
      <ContactFormSection />
      <VisitInfo />
      <DepartmentContacts />
    </>
  );
}

function ContactHero() {
  const reduce = useReducedMotion();
  return (
    <Section seed="contact-hero" count={3} className="py-20 md:py-32 min-h-[68dvh] flex items-center">
      <div className="max-w-4xl">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs uppercase tracking-[0.2em] font-mono text-amber mb-6"
        >
          Contact
        </motion.p>
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="text-balance text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.02]"
        >
          Talk to a real person.
        </motion.h1>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="mt-6 text-base text-muted-foreground max-w-[60ch] leading-relaxed"
        >
          We answer every message. Usually within one business day, always
          from a person whose name and title are in the signature.
        </motion.p>
      </div>
    </Section>
  );
}

function ContactFormSection() {
  const { toast } = useToast();
  const [form, setForm] = useState<ContactFormState>(INITIAL);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const firebaseReady = isFirebaseConfigured();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus("error");
      setErrorMsg("Please fill in your name, email, and message before sending.");
      return;
    }

    setStatus("submitting");
    setErrorMsg(null);

    const db = getDb();
    if (!db) {
      // Developer hasn't configured Firebase keys yet.
      setStatus("error");
      setErrorMsg(
        "Firebase is not configured. The site owner needs to add Firebase keys to .env.local. See README.md for instructions.",
      );
      toast({
        title: "Firebase not configured",
        description: "Add Firebase keys to .env.local. See README.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addDoc(collection(db, "contact_messages"), {
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
        createdAt: serverTimestamp(),
      });
      setStatus("success");
      setForm(INITIAL);
      toast({
        title: "Message sent",
        description: "We will reply within one business day.",
      });
    } catch (err) {
      console.error("Contact form submission failed:", err);
      setStatus("error");
      setErrorMsg("Something went wrong sending your message. Please try again or email us directly at hello@brm-international.org.");
    }
  };

  const inputClass =
    "w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber/60 focus:border-amber/60 transition-colors";

  return (
    <Section seed="contact-form" count={2} className="py-24 md:py-32">
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <Reveal as="header">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
              Send a message
            </h2>
            <p className="text-base text-muted-foreground max-w-prose leading-relaxed">
              For general questions, scheduling a tour, or anything not
              covered elsewhere on the site. Use the inquiry form for
              applications.
            </p>
          </Reveal>
          {!firebaseReady && (
            <Reveal delay={0.1}>
              <div className="mt-6 rounded-lg border border-amber/40 bg-amber/10 p-4 flex gap-3">
                <Warning size={18} weight="fill" className="text-amber shrink-0 mt-0.5" />
                <p className="text-sm text-foreground leading-relaxed">
                  <strong>Firebase is not configured.</strong> The form below
                  will not actually submit. Add Firebase keys to{" "}
                  <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">.env.local</code>{" "}
                  and restart the dev server. See README.md for the full setup
                  guide.
                </p>
              </div>
            </Reveal>
          )}
        </div>

        <div className="lg:col-span-7">
          <Reveal delay={0.05}>
            {status === "success" ? (
              <motion.div
                initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-amber/40 bg-amber/10 p-8 text-center"
              >
                <PaperPlaneTilt size={36} weight="fill" className="text-amber mx-auto mb-4" />
                <h3 className="text-2xl font-bold tracking-tight mb-2">
                  Message sent
                </h3>
                <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
                  We will get back to you within one business day. In the
                  meantime, take a look at the gallery or the academic
                  departments page.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:border-amber/60 text-sm"
                >
                  Send another
                </button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-5"
                noValidate
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="contact-name" className="block text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground">
                      Your name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Jane Rivera"
                      className={inputClass}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="contact-email" className="block text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="jane@email.com"
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-subject" className="block text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground">
                    Subject <span className="text-muted-foreground/70 normal-case">(optional)</span>
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Tour scheduling, financial aid, something else"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-message" className="block text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us what you would like to know. We will write back, in plain language, from a real inbox."
                    className={inputClass}
                    required
                  />
                </div>

                {status === "error" && errorMsg && (
                  <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive-foreground flex gap-2 items-start">
                    <Warning size={16} weight="fill" className="shrink-0 mt-0.5" />
                    <p>{errorMsg}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-brand text-brand-foreground font-medium hover:bg-brand/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "submitting" ? "Sending..." : "Send message"}
                  <ArrowRight size={16} weight="bold" />
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

function VisitInfo() {
  return (
    <Section seed="contact-visit" count={2} className="py-24 md:py-32 bg-muted/30">
      <div className="grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-5">
          <Reveal as="header">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">Visit</h2>
            <p className="text-base text-muted-foreground max-w-prose leading-relaxed mb-6">
              Open houses run every Thursday at 9am from January through
              April. Private tours are available any weekday morning, year-round.
            </p>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-amber mb-1">Address</p>
                <p className="text-foreground">242 Linden Ridge Road<br />Willowbrook, OR 97XXX</p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-amber mb-1">Front office</p>
                <p className="text-foreground">
                  <a href="tel:+15035550140" className="hover:text-amber underline-offset-4 hover:underline">(503) 555-0140</a>
                </p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-amber mb-1">Email</p>
                <p className="text-foreground">
                  <a href="mailto:hello@brm-international.org" className="hover:text-amber underline-offset-4 hover:underline">hello@brm-international.org</a>
                </p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-amber mb-1">Hours</p>
                <p className="text-foreground">Monday to Friday, 7:45am to 4:15pm</p>
              </div>
            </div>
          </Reveal>
        </div>
        <div className="lg:col-span-7">
          <Reveal delay={0.05}>
            <div className="rounded-2xl overflow-hidden border border-border aspect-[4/3] bg-muted relative">
              <img
                src="https://picsum.photos/seed/brm-campus-map-aerial/800/600"
                alt="Aerial map view of the BRM International School campus"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-background/90 backdrop-blur-md border border-border p-4">
                <p className="text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground mb-1">Main entrance</p>
                <p className="text-sm font-medium">Linden Ridge Road gate, follow the signs to Founders Hall.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

function DepartmentContacts() {
  const contacts = [
    { name: "Admissions Office", person: "Greta Linde", email: "admissions@brm-international.org", role: "All inquiries, tours, applications" },
    { name: "Financial Aid", person: "Sofia Park", email: "aid@brm-international.org", role: "SSS, awards, payment plans" },
    { name: "Lower School", person: "Adaeze Okwu", email: "lower@brm-international.org", role: "Grades K through 5" },
    { name: "Middle School", person: "Hugo Tanaka", email: "middle@brm-international.org", role: "Grades 6 through 8" },
    { name: "High School", person: "Ben Carter", email: "upper@brm-international.org", role: "Grades 9 through 10" },
    { name: "Front Office", person: "Jules Yamada", email: "front@brm-international.org", role: "Anything else" },
  ];
  return (
    <Section seed="contact-depts" count={2} className="py-24 md:py-32">
      <Reveal as="header" className="mb-10 max-w-2xl">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">Who to ask</h2>
        <p className="text-base text-muted-foreground">
          Direct email for the most common questions. Each is monitored by a
          person whose title is in their signature.
        </p>
      </Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map((c, i) => (
          <Reveal key={c.email} delay={i * 0.05}>
            <div className="rounded-2xl border border-border bg-card p-6 h-full">
              <p className="text-xs font-mono uppercase tracking-[0.14em] text-amber mb-2">
                {c.name}
              </p>
              <p className="text-lg font-bold tracking-tight mb-1">{c.person}</p>
              <p className="text-sm text-muted-foreground mb-3">{c.role}</p>
              <a
                href={`mailto:${c.email}`}
                className="text-sm text-brand hover:text-amber transition-colors underline-offset-4 hover:underline"
              >
                {c.email}
              </a>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
