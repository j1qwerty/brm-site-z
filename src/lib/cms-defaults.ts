// Default content for every editable section on the site.
// Used by:
//   1. Public site (rendered immediately as fallback before Firestore overrides)
//   2. Admin content editor (loaded as the starting draft on first edit)
//
// Keep this file in sync with what the actual view components render. When a
// section's hardcoded text changes in src/views/*.tsx, update the matching
// defaults here so the CMS editor shows the right starting point.

import type { SectionId } from "./cms-types";

export const SECTIONS: { page: string; sections: { id: SectionId; label: string }[] }[] = [
  {
    page: "Home",
    sections: [
      { id: "home.hero", label: "Hero" },
      { id: "home.stats", label: "Stats row" },
      { id: "home.mission", label: "Mission quote" },
      { id: "home.programs", label: "Programs by level" },
      { id: "home.faculty", label: "Faculty spotlight" },
      { id: "home.why", label: "Why families choose" },
      { id: "home.testimonials", label: "Testimonials" },
      { id: "home.events", label: "Upcoming events" },
      { id: "home.gallery_preview", label: "Gallery preview" },
      { id: "home.videos", label: "Videos" },
      { id: "home.faq", label: "FAQ" },
      { id: "home.campus_preview", label: "Campus life preview" },
      { id: "home.news_cta", label: "News + CTA" },
    ],
  },
  {
    page: "About",
    sections: [
      { id: "about.hero", label: "Hero" },
      { id: "about.history", label: "History timeline" },
      { id: "about.values", label: "Values" },
      { id: "about.leadership", label: "Leadership" },
      { id: "about.campus", label: "Campus facilities" },
      { id: "about.accreditation", label: "Accreditation" },
      { id: "about.cta", label: "CTA" },
    ],
  },
  {
    page: "Academics",
    sections: [
      { id: "academics.hero", label: "Hero" },
      { id: "academics.bands", label: "Curriculum bands" },
      { id: "academics.departments", label: "Departments" },
      { id: "academics.schedule", label: "Sample schedule" },
      { id: "academics.outcomes", label: "Outcomes" },
      { id: "academics.field_studies", label: "Field studies" },
      { id: "academics.cta", label: "CTA" },
    ],
  },
  {
    page: "Admissions",
    sections: [
      { id: "admissions.hero", label: "Hero" },
      { id: "admissions.process", label: "Process" },
      { id: "admissions.requirements", label: "Requirements" },
      { id: "admissions.tuition", label: "Tuition" },
      { id: "admissions.aid", label: "Financial aid" },
      { id: "admissions.cta", label: "CTA" },
    ],
  },
  {
    page: "Events",
    sections: [
      { id: "events.hero", label: "Hero" },
      { id: "events.cta", label: "CTA" },
    ],
  },
  {
    page: "Gallery",
    sections: [
      { id: "gallery.hero", label: "Hero" },
      { id: "gallery.cta", label: "CTA" },
    ],
  },
  {
    page: "Contact",
    sections: [
      { id: "contact.hero", label: "Hero" },
      { id: "contact.visit", label: "Visit info" },
      { id: "contact.depts", label: "Department contacts" },
    ],
  },
  {
    page: "Inquiry",
    sections: [
      { id: "inquiry.hero", label: "Hero" },
      { id: "inquiry.next_steps", label: "Next steps" },
      { id: "inquiry.faq", label: "FAQ" },
    ],
  },
  {
    page: "Shared",
    sections: [
      { id: "shared.footer", label: "Footer (site-wide)" },
      { id: "shared.contact_info", label: "Contact info (site-wide)" },
      { id: "shared.nav", label: "Nav (site-wide)" },
    ],
  },
];

const DEFAULTS: Record<SectionId, Record<string, unknown>> = {
  "home.hero": {
    eyebrow: "Now enrolling grades K through 10",
    headline: "A school where curiosity becomes craft.",
    subtext:
      "Independent K-10 education built on small classes, real projects, and a community that knows your child by name.",
    primaryCta: "Visit campus",
    secondaryCta: "Explore programs",
    heroImage: "https://picsum.photos/seed/brm-hero-students/640/800",
    heroImageAlt: "BRM International School students working on a group project in the studio",
  },
  "home.stats": {
    title: "Numbers from the school",
  },
  "home.mission": {
    quote:
      "We believe children are already capable people. Our job is not to fill them, but to give them the tools, time, and trust to do work that matters.",
    attribution: "Mara Bishop, Head of School",
  },
  "home.programs": {
    headline: "Programs by level",
    intro:
      "A continuous curriculum from kindergarten through grade 10, designed so each grade builds on the last without gaps or repetition.",
  },
  "home.faculty": {
    eyebrow: "Faculty spotlight",
    headline: "Hugo Tanaka teaches grade 7 physics with bike wheels and stopwatches.",
    body1:
      "Before joining BRM in 2014, Hugo built test rigs at a bicycle manufacturer. He brings that same hands-on discipline into his classroom.",
    body2:
      "His students keep a field notebook that travels with them through eighth grade, a record of every measurement, hypothesis, and wrong turn.",
  },
  "home.why": {
    headline: "Why families choose BRM",
    intro: "Eight reasons that came up again and again in conversations with current parents and alumni.",
  },
  "home.testimonials": {
    headline: "What families say",
    intro: "Pulled from a survey of current parents and 2024 alumni.",
  },
  "home.events": {
    headline: "Upcoming events",
    intro: "Open to families and the public unless noted. Click through for details.",
  },
  "home.gallery_preview": {
    headline: "Campus life",
    intro: "A glimpse of an ordinary Tuesday.",
  },
  "home.videos": {
    headline: "Watch",
    intro: "Student productions, classroom visits, and event highlights. All play in a new tab on the source site.",
  },
  "home.faq": {
    headline: "Quick answers",
    intro: "The questions families ask most. For more, see the full FAQ on the Admissions page.",
  },
  "home.campus_preview": {
    headline: "Campus life",
    intro: "A glimpse of an ordinary Tuesday.",
  },
  "home.news_cta": {
    headline: "From the school journal",
    ctaHeadline: "Visit us this spring",
    ctaBody: "Open houses run every Thursday at 9am from January through April. Or schedule a private tour any weekday.",
    ctaPrimary: "Inquire now",
    ctaSecondary: "See the campus",
  },

  "about.hero": {
    eyebrow: "About BRM",
    headline: "A school built to fit the child, not the other way around.",
    subtext:
      "Founded in 1998 by a group of parents and teachers who wanted a school that took children seriously. We are still that school.",
  },
  "about.history": {
    headline: "A short history",
    intro: "Not a chronicle, just the years where something changed.",
  },
  "about.values": {
    headline: "What we believe",
    intro: "Six values that show up in every decision we make, from hiring to schedule to lunch.",
  },
  "about.leadership": {
    headline: "School leadership",
    intro: "Four people who set the tone. Email any of them directly.",
  },
  "about.campus": {
    headline: "The campus",
    intro: "Twelve buildings on twelve acres. Built for the way children actually move through a day.",
  },
  "about.accreditation": {
    headline: "Accreditation & partners",
    intro: "We hold ourselves accountable to people outside the building.",
  },
  "about.cta": {
    headline: "Come see the school for yourself.",
    body: "The best way to know if a school fits your family is to walk through it. Open houses run Thursdays at 9am from January through April.",
    cta: "Schedule a visit",
  },

  "academics.hero": {
    eyebrow: "Academics",
    headline: "A curriculum that compounds, year over year.",
    subtext:
      "Each grade band is designed to build on the last without gaps or repetition. The same faculty teach across the band, so they know exactly what your child learned the year before.",
  },
  "academics.bands": {
    headline: "Curriculum by band",
    intro:
      "Three bands, each designed by the faculty who teach in it. Click into any subject for the full scope and sequence.",
  },
  "academics.departments": {
    headline: "Departments",
    intro: "Six departments, each led by a teaching department chair. Email any chair directly.",
  },
  "academics.schedule": {
    headline: "Sample week, grade 7",
    intro: "Real schedule from spring 2026. Wednesday afternoons are dedicated to field study, every week.",
  },
  "academics.outcomes": {
    headline: "Where our graduates go",
    intro:
      "Our college counselor does not chase rankings. Our students pick schools that fit who they are. The list below is the past five graduating classes.",
  },
  "academics.field_studies": {
    headline: "Field studies & partners",
    intro: "Real organizations our students work with, every year.",
  },
  "academics.cta": {
    headline: "Talk to a department chair.",
    body: "Each chair runs an open office hour every Thursday. Bring your questions, leave with a syllabus and a reading list.",
    cta: "Book office hour",
  },

  "admissions.hero": {
    eyebrow: "Admissions",
    headline: "We admit 64 students a year, on purpose.",
    subtext:
      "Small classes mean small admits. The process is long because we want to know your child, not just their file.",
    cta: "Start your inquiry",
  },
  "admissions.process": {
    headline: "The process, in four steps",
    intro: "From inquiry to decision in roughly five months. The pace is deliberate. We want to know your family.",
  },
  "admissions.requirements": {
    headline: "What you will need",
    intro: "A short list on both sides. We try not to ask for anything we would not want to provide ourselves.",
  },
  "admissions.tuition": {
    headline: "Tuition & fees, 2026-27",
    intro: "Per-year tuition by grade band. Optional add-ons listed separately. No hidden fees, no fundraising quotas.",
  },
  "admissions.aid": {
    headline: "If tuition is a stretch, ask anyway.",
    body1:
      "Thirty-eight percent of families receive need-based aid. The average award covers 47 percent of tuition. Aid decisions are made independently of admission decisions.",
    body2: "Apply through SSS (School and Student Services). The application takes about 40 minutes.",
  },
  "admissions.cta": {
    headline: "Ready to start?",
    body: "The inquiry form takes about three minutes. You will hear back from a real person, usually within one business day.",
    cta: "Start inquiry",
  },

  "events.hero": {
    eyebrow: "Events",
    headline: "What is happening at BRM.",
    subtext:
      "Open houses, performances, athletic fixtures, community gatherings. Most are open to the public.",
  },
  "events.cta": {
    headline: "Want to host an event here?",
    body: "Our campus is available for community events outside school hours. Email events@brm-international.org.",
    cta: "Email events team",
  },

  "gallery.hero": {
    eyebrow: "Gallery",
    headline: "An ordinary Tuesday, in pictures.",
    subtext: "Photos taken by students in the photography elective. Updated weekly. Click any image to see the full caption.",
  },
  "gallery.cta": {
    headline: "Want to see it in person?",
    body: "Open houses run every Thursday at 9am, January through April. Or schedule a private tour any weekday.",
    cta: "Schedule a visit",
  },

  "contact.hero": {
    eyebrow: "Contact",
    headline: "Talk to a real person.",
    subtext:
      "We answer every message. Usually within one business day, always from a person whose name and title are in the signature.",
  },
  "contact.visit": {
    headline: "Visit",
    body: "Open houses run every Thursday at 9am from January through April. Private tours are available any weekday morning, year-round.",
    addressLine1: "242 Linden Ridge Road",
    addressLine2: "Willowbrook, OR 97XXX",
    phone: "(503) 555-0140",
    email: "hello@brm-international.org",
    hours: "Monday to Friday, 7:45am to 4:15pm",
  },
  "contact.depts": {
    headline: "Who to ask",
    intro: "Direct email for the most common questions. Each is monitored by a person whose title is in their signature.",
  },

  "inquiry.hero": {
    eyebrow: "Inquiry form",
    headline: "Tell us about your student.",
    subtext:
      "Takes about three minutes. We will reply within one business day from a real person in the admissions office, not a queue.",
  },
  "inquiry.next_steps": {
    headline: "What happens next",
    intro: "From the moment you hit submit to the day you get a decision.",
  },
  "inquiry.faq": {
    headline: "Quick questions",
  },

  "shared.footer": {
    siteName: "BRM International School",
    blurb: "An independent K-10 school where curiosity, craft, and community shape every lesson. Established 1998.",
    copyright: "Independent school, est. 1998.",
  },
  "shared.contact_info": {
    phone: "(503) 555-0140",
    email: "hello@brm-international.org",
    address: "242 Linden Ridge Road, Willowbrook, OR 97XXX",
  },
  "shared.nav": {
    siteName: "BRM International School",
  },
};

export function getDefaultsFor(sectionId: SectionId | string): Record<string, unknown> {
  return (DEFAULTS as Record<string, Record<string, unknown>>)[sectionId] ?? {};
}
