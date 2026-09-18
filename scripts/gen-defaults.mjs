// One-off helper: extracts DEFAULT_* literals from view files and prints them
// as cms-defaults.ts entries (single-quoted TS strings).
// Usage: node scripts/gen-defaults.mjs
import { readFileSync } from "node:fs";

function extractLiteral(src, name) {
  const idx = src.indexOf("const " + name);
  if (idx === -1) throw new Error("const " + name + " not found");
  const eq = src.indexOf("=", idx);
  let i = eq + 1;
  while (/\s/.test(src[i])) i++;
  const open = src[i];
  const close = open === "[" ? "]" : open === "{" ? "}" : null;
  if (!close) throw new Error("unexpected literal start for " + name + ": " + open);
  let depth = 0;
  let str = "";
  let strCh = null;
  for (; i < src.length; i++) {
    const ch = src[i];
    if (strCh) {
      str += ch;
      if (ch === "\\") { str += src[++i]; continue; }
      if (ch === strCh) strCh = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") { strCh = ch; str += ch; continue; }
    if (ch === "/" && src[i + 1] === "/") { while (i < src.length && src[i] !== "\n") i++; continue; }
    if (ch === open) depth++;
    if (ch === close) depth--;
    str += ch;
    if (depth === 0) break;
  }
  return str;
}

function tsString(json) {
  return "'" + json.replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";
}

const jobs = [
  ["src/views/academics.tsx", [
    ["academics.bands", "bandsJson", "DEFAULT_BANDS"],
    ["academics.departments", "departmentsJson", "DEFAULT_DEPARTMENTS"],
    ["academics.schedule", "slotsJson", "DEFAULT_SLOTS"],
    ["academics.outcomes", "outcomesJson", "DEFAULT_OUTCOMES_COMBINED"],
    ["academics.field_studies", "partnersJson", "DEFAULT_PARTNERS"],
  ]],
  ["src/views/admissions.tsx", [
    ["admissions.process", "stepsJson", "DEFAULT_STEPS"],
    ["admissions.requirements", "groupsJson", "DEFAULT_GROUPS"],
    ["admissions.tuition", "rowsJson", "DEFAULT_TUITION_ROWS"],
    ["admissions.aid", "statsJson", "DEFAULT_AID_STATS"],
  ]],
  ["src/views/home.tsx", [
    ["home.stats", "statsJson", "DEFAULT_STATS"],
    ["home.programs", "programsJson", "DEFAULT_PROGRAMS"],
    ["home.faculty", "credentialsJson", "DEFAULT_CREDENTIALS"],
    ["home.testimonials", "testimonialsJson", "DEFAULT_TESTIMONIALS"],
    ["home.campus_preview", "imagesJson", "DEFAULT_CAMPUS_IMAGES"],
    ["home.news_cta", "newsJson", "DEFAULT_NEWS"],
  ]],
  ["src/views/contact.tsx", [
    ["contact.depts", "contactsJson", "DEFAULT_DEPTS"],
  ]],
  ["src/views/inquiry.tsx", [
    ["inquiry.next_steps", "stepsJson", "DEFAULT_STEPS"],
    ["inquiry.faq", "faqsJson", "DEFAULT_FAQS"],
  ]],
];

let currentFile = "";
let src = "";
for (const [file, entries] of jobs) {
  if (file !== currentFile) { currentFile = file; src = readFileSync(file, "utf8"); }
  for (const [section, key, constName] of entries) {
    if (constName === "DEFAULT_OUTCOMES_COMBINED") {
      const stats = eval("(" + extractLiteral(src, "DEFAULT_STATS") + ")");
      const colleges = eval("(" + extractLiteral(src, "DEFAULT_COLLEGES") + ")");
      const capstones = eval("(" + extractLiteral(src, "DEFAULT_CAPSTONES") + ")");
      console.log(`## ${section} :: ${key}`);
      console.log(tsString(JSON.stringify({ stats, colleges, capstones })));
      continue;
    }
    const val = eval("(" + extractLiteral(src, constName) + ")");
    console.log(`## ${section} :: ${key}`);
    console.log(tsString(JSON.stringify(val)));
  }
}
