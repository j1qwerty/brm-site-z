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
    captionKicker: "Studio hour, Tuesday",
    captionTitle: "Grade 9 marine biology field study",
  },
  "home.stats": {
    title: "Numbers from the school",
    statsJson:
      '[{"value":"1:7","label":"Faculty to student ratio"},{"value":"82","label":"Faculty with advanced degrees"},{"value":"K-10","label":"Continuous, integrated curriculum"},{"value":"1998","label":"Year founded"}]',
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
    programsJson:
      '[{"grade":"Lower School","range":"Grades K through 5","blurb":"Play-based foundations in literacy, numeracy, and the natural world. Two teachers per classroom.","image":"https://picsum.photos/seed/brm-lower-school-classroom/800/600","big":true},{"grade":"Middle School","range":"Grades 6 through 8","blurb":"Transition to disciplinary depth with integrated humanities, lab science, and the arts.","image":"https://picsum.photos/seed/brm-middle-school-lab/600/400","big":false},{"grade":"High School","range":"Grades 9 through 10","blurb":"College-prep with the grade 10 capstone, dual-enrollment, and independent study in a field of choice.","image":"https://picsum.photos/seed/brm-high-school-seminar/600/400","big":false}]',
  },
  "home.faculty": {
    eyebrow: "Faculty spotlight",
    headline: "Hugo Tanaka teaches grade 7 physics with bike wheels and stopwatches.",
    body1:
      "Before joining BRM in 2014, Hugo built test rigs at a bicycle manufacturer. He brings that same hands-on discipline into his classroom, where students learn force and motion by building, instrumenting, and breaking things on purpose.",
    body2:
      "His students keep a field notebook that travels with them through eighth grade, a record of every measurement, hypothesis, and wrong turn they made along the way.",
    facultyImage: "https://picsum.photos/seed/brm-faculty-hugo/640/800",
    facultyImageAlt: "Hugo Tanaka, middle school science teacher",
    credentialsJson: '["14 years teaching","B.S. Mechanical Engineering","STEAM cohort lead"]',
  },
  "home.why": {
    headline: "Why families choose BRM",
    intro: "Eight reasons that came up again and again in conversations with current parents and alumni.",
    heroImage: "https://picsum.photos/seed/brm-why-campus-walk/800/800",
    heroImageAlt: "A student walking between studio buildings on campus",
    heroTitle: "A walkable campus that scales with your child",
    heroBody: "Twelve buildings, four gardens, one learning community that runs from kindergarten through grade 10.",
    smallTitle: "Small by design",
    smallBody: "Cap of 18 students per class, 22 per grade. The faculty know each student as a person, not a name on a roster.",
    ratioValue: "7:1",
    ratioLabel: "Faculty-to-student ratio across the school.",
    capstoneTitle: "Grade 10 capstone",
    capstoneBody: "Every grade 10 student ships a year-long project. Defended publicly in May.",
    outdoorTitle: "Outdoor education, weekly",
    outdoorBody: "Every Wednesday afternoon, regardless of weather. The forest is part of the curriculum, not a reward for finishing it.",
    aidTitle: "Financial aid that actually scales",
    aidBody: "38% of families receive need-based aid. The average award covers 47% of tuition. Apply without affecting admission odds.",
    counselingTitle: "College counseling that starts in 9th grade",
    counselingBody: "One counselor per 25 students. Four years to find the right fit, not four months to fill out applications.",
    lunchTitle: "Family-style lunch",
    lunchBody: "Mixed-age tables, faculty hosts, real food from the school garden. The most underrated part of the day.",
  },
  "home.testimonials": {
    headline: "What families say",
    intro: "Pulled from a survey of current parents and 2024 alumni.",
    testimonialsJson:
      '[{"quote":"Our daughter came home talking about tectonic plates for three weeks. We didn\'t know what to do, but we loved it.","name":"Priya Ramanathan","role":"Parent, grade 4"},{"quote":"The capstone program is the closest thing to real work I\'ve ever asked students to do.","name":"David Cho","role":"High School faculty"},{"quote":"I was nervous about the transition from public school. The faculty made space for who my kid already was.","name":"Aisha Okonkwo","role":"Parent, grade 7"},{"quote":"They told me I had to defend my senior project in front of the whole school. I have never been more prepared for anything.","name":"Theo Vandermeer","role":"Alumnus, class of 2023"}]',
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
    imagesJson:
      '[{"src":"https://picsum.photos/seed/brm-campus-library/600/800","alt":"Students reading in the library","tall":true},{"src":"https://picsum.photos/seed/brm-campus-studio/600/500","alt":"Studio art class in progress"},{"src":"https://picsum.photos/seed/brm-campus-garden/600/600","alt":"Working in the school garden"},{"src":"https://picsum.photos/seed/brm-campus-cafeteria/600/700","alt":"Family-style lunch","tall":true},{"src":"https://picsum.photos/seed/brm-campus-stage/600/450","alt":"Theater rehearsal"},{"src":"https://picsum.photos/seed/brm-campus-court/600/700","alt":"Outdoor basketball","tall":true}]',
  },
  "home.news_cta": {
    headline: "From the school journal",
    ctaHeadline: "Visit us this spring",
    ctaBody: "Open houses run every Thursday at 9am from January through April. Or schedule a private tour any weekday.",
    ctaPrimary: "Inquire now",
    ctaSecondary: "See the campus",
    newsJson:
      '[{"tag":"Announcement","date":"March 14, 2026","title":"BRM awarded state grant for forest stewardship program","excerpt":"The three-year grant funds a partnership with the Willowbrook Watershed Council."},{"tag":"Student work","date":"February 28, 2026","title":"Grade 10 chemistry class publishes water-quality dataset","excerpt":"Eight months of sampling along the Cooper River, openly licensed on Zenodo."},{"tag":"Community","date":"February 12, 2026","title":"Annual spring festival open to the public, May 4","excerpt":"Student performances, studio tours, plant sale, food. Admission is free."}]',
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
    eventsJson:
      '[{"year":"1998","title":"Founded in a converted grange hall","body":"Forty-three students, eight teachers, one rented building on Linden Ridge Road."},{"year":"2004","title":"Permanent campus purchased","body":"Twelve acres of former orchard land. The first building, Founders Hall, opens with grades K-8."},{"year":"2009","title":"First grade 10 class graduates","body":"Twelve students. Eleven go on to higher secondary; one starts an apprentice furniture-making business."},{"year":"2014","title":"STEAM wing opens","body":"Three labs, a maker space, and a student-run garden funded entirely by parent donations."},{"year":"2021","title":"Forest stewardship program","body":"Formal partnership with Willowbrook Watershed Council. Every grade now has forest curriculum."},{"year":"2026","title":"28 years in","body":"412 students, 84 faculty, 1,872 alumni across 32 states and 14 countries."}]',
  },
  "about.values": {
    headline: "What we believe",
    intro: "Six values that show up in every decision we make, from hiring to schedule to lunch.",
    valuesJson:
      '[{"name":"Take children seriously","body":"We assume students are competent until they prove otherwise, which they rarely do. Treat a child like a person and they respond like one."},{"name":"Make work that matters","body":"Every project ends in something shipped: a paper, a dataset, a performance, a fix to a real problem. No busy work, ever."},{"name":"Stay small","body":"Classes cap at 18. Faculty know every student by name. The school will not grow past 480 students, no matter how many applications arrive."},{"name":"Be honest about difficulty","body":"School is hard. We tell students when something is hard, and we help them through it. We do not pretend everything is fun."},{"name":"Get outside","body":"Wednesday afternoons, every week, in every grade, in every weather. The forest is curriculum, not reward."},{"name":"Welcome families in","body":"Parents are part of the school. Drop in. Eat lunch with your kid. Sit in on a class. The door is open."}]',
  },
  "about.leadership": {
    headline: "School leadership",
    intro: "Four people who set the tone. Email any of them directly.",
    leadersJson:
      '[{"name":"Mara Bishop","role":"Head of School","image":"https://picsum.photos/seed/brm-leader-mara/400/500","bio":"Ed.D. Harvard, 22 years at BRM."},{"name":"Hugo Tanaka","role":"Middle School Director","image":"https://picsum.photos/seed/brm-leader-hugo/400/500","bio":"B.S. Mech. Eng., 12 years at BRM."},{"name":"Adaeze Okwu","role":"Lower School Director","image":"https://picsum.photos/seed/brm-leader-adaeze/400/500","bio":"M.Ed. Bank Street, 9 years at BRM."},{"name":"Ben Carter","role":"High School Director","image":"https://picsum.photos/seed/brm-leader-ben/400/500","bio":"Ph.D. History Yale, 7 years at BRM."}]',
  },
  "about.campus": {
    headline: "The campus",
    intro: "Twelve buildings on twelve acres. Built for the way children actually move through a day.",
    image: "https://picsum.photos/seed/brm-campus-aerial/600/750",
    imageAlt: "Aerial view of the BRM campus in autumn",
    facilitiesJson:
      '[{"name":"Founders Hall","body":"Original 2004 building. Lower school classrooms, library, dining hall."},{"name":"STEAM Wing","body":"Three labs, maker space, robotics bay, darkroom. Built 2014."},{"name":"Theater & Music","body":"240-seat black box, four practice rooms, recording studio."},{"name":"Forest Classroom","body":"Heated yurt, outdoor kitchen, composting toilets. Used every Wednesday."},{"name":"Garden & Greenhouse","body":"Half-acre working garden. Student-run. Food goes to lunch program."},{"name":"Athletic Fields","body":"Two full-size fields, cross-country trail, all-weather track."}]',
  },
  "about.accreditation": {
    headline: "Accreditation & partners",
    intro: "We hold ourselves accountable to people outside the building.",
    orgsJson:
      '[{"name":"NAIS","monogram":"NAIS"},{"name":"NWAC","monogram":"NWAC"},{"name":"ISACS","monogram":"IS"},{"name":"CASE","monogram":"CASE"},{"name":"Watershed Council","monogram":"WC"},{"name":"Zenodo","monogram":"ZD"}]',
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
    bandsJson:
      '[{"band":"Lower School","grades":"K through 5","summary":"Foundational literacy, numeracy, and care for the natural world. Two teachers per classroom.","subjects":[{"name":"Literacy","body":"Daily reader\'s and writer\'s workshop. Two hours per day across the band."},{"name":"Mathematics","body":"Singapore-style, conceptual first. 60 minutes daily."},{"name":"Science","body":"Three units per year, integrated with the school garden."},{"name":"Studio","body":"Visual art, music, and movement on a three-week rotation."},{"name":"Forest","body":"Wednesday afternoons, every week, in every weather."}]},{"band":"Middle School","grades":"6 through 8","summary":"Transition to disciplinary depth. Students move between specialist faculty for the first time.","subjects":[{"name":"Humanities","body":"Integrated English and history. Three civilizations per year."},{"name":"Mathematics","body":"Pre-algebra in grade 6, algebra in grade 7, geometry in grade 8."},{"name":"Lab Science","body":"Physics, chemistry, biology, in rotation, taught as separate labs."},{"name":"World Languages","body":"Spanish, Mandarin, or French. Four years required to graduate."},{"name":"Arts","body":"Choose a primary and a secondary art. Both required each year."}]},{"band":"High School","grades":"9 through 10","summary":"College-prep with the grade 10 capstone, dual-enrollment, and independent study in a field of choice.","subjects":[{"name":"English","body":"Two years. American, British, World, and a capstone-linked research seminar."},{"name":"Mathematics","body":"Algebra 2, Pre-calc, Calculus, Statistics, or Discrete Math."},{"name":"Science","body":"Three lab sciences required. AP option in each."},{"name":"History","body":"World, US, and a primary-source research seminar tied to the capstone."},{"name":"Capstone","body":"Year-long project, defended publicly in May. Required to graduate from grade 10."}]}]',
  },
  "academics.departments": {
    headline: "Departments",
    intro: "Six departments, each led by a teaching department chair. Email any chair directly.",
    departmentsJson:
      '[{"name":"Humanities & Literature","lead":"Ben Carter","body":"American literature to creative nonfiction. Senior seminar on primary-source research.","count":"7 faculty"},{"name":"Mathematics & Computing","lead":"Mei-Ling Park","body":"Singapore math through multivariable calculus. Three sections of computer science.","count":"5 faculty"},{"name":"Lab Sciences","lead":"Hugo Tanaka","body":"Physics, chemistry, biology. All taught as separate labs starting grade 6.","count":"6 faculty"},{"name":"World Languages","lead":"Lucia Marchetti","body":"Spanish, Mandarin, French. Four-year minimum requirement for graduation.","count":"4 faculty"},{"name":"Studio & Performance Arts","lead":"Marcus Bell","body":"Visual art, music, theater, film. Every student must ship a public work each year.","count":"8 faculty"},{"name":"Health & Wellness","lead":"Jen Okonkwo","body":"Movement, nutrition, mental health. Required weekly through grade 10.","count":"3 faculty"}]',
  },
  "academics.schedule": {
    headline: "Sample week, grade 7",
    intro: "Real schedule from spring 2026. Wednesday afternoons are dedicated to field study, every week.",
    slotsJson:
      '[{"time":"08:30","mon":"Morning meeting","tue":"Morning meeting","wed":"Morning meeting","thu":"Morning meeting","fri":"Morning meeting"},{"time":"09:00","mon":"Humanities block","tue":"Math block","wed":"Lab science","thu":"Humanities block","fri":"Math block"},{"time":"10:30","mon":"Studio art","tue":"World languages","wed":"Forest classroom","thu":"World languages","fri":"Music"},{"time":"12:00","mon":"Family lunch","tue":"Family lunch","wed":"Family lunch","thu":"Family lunch","fri":"Family lunch"},{"time":"13:00","mon":"Math workshop","tue":"Humanities block","wed":"Field study","thu":"Lab science","fri":"Independent reading"},{"time":"14:30","mon":"Movement","tue":"Movement","wed":"Field study","thu":"Movement","fri":"Advisory"},{"time":"15:30","mon":"Dismissal","tue":"Dismissal","wed":"Dismissal","thu":"Dismissal","fri":"Dismissal"}]',
  },
  "academics.outcomes": {
    headline: "Where our graduates go",
    intro:
      "Our college counselor does not chase rankings. Our students pick schools that fit who they are. The list below is the past five graduating classes.",
    outcomesJson:
      '{"stats":[{"value":"94%","label":"Matriculate to first-choice"},{"value":"87%","label":"Graduate in four years"},{"value":"2.4","label":"Avg. college credit on entry"}],"colleges":["Reed","Lewis & Clark","Whitman","Willamette","Oberlin","Wesleyan","Beloit","Macalester","Pomona","Colorado College","Evergreen","MIT","Cornell","Stanford","UW Honors"],"capstones":["Designing a low-cost water sensor for the Cooper River watershed","Translating a previously untranslated Borges short story","A statistical history of Pacific Northwest heat waves","An original one-act play, performed in the black box"]}',
  },
  "academics.field_studies": {
    headline: "Field studies & partners",
    intro: "Real organizations our students work with, every year.",
    partnersJson:
      '["Willowbrook Watershed Council","Oregon State Marine Board","Portland Museum of Craft","Reed College Biology","Oregon Zoo","Bicycle Transportation Alliance","Portland City Archives","Zenodo Open Data","Ecotrust","Pacific Northwest College of Art"]',
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
    image: "https://picsum.photos/seed/brm-admissions-open-house/640/800",
    imageAlt: "Parents and students at an open house tour",
  },
  "admissions.process": {
    headline: "The process, in four steps",
    intro: "From inquiry to decision in roughly five months. The pace is deliberate. We want to know your family.",
    stepsJson:
      '[{"n":"01","title":"Inquiry","body":"Fill out the inquiry form. We send you the full viewbook and a calendar of open houses.","when":"Anytime, year-round"},{"n":"02","title":"Visit","body":"Come to an open house or schedule a private tour. Your child is welcome at both.","when":"October through April"},{"n":"03","title":"Apply","body":"Online application, school records, two teacher recommendations, student essay.","when":"Deadline January 15"},{"n":"04","title":"Decision","body":"Family meeting and student visit day. Decisions released March 10. Aid decisions March 17.","when":"March"}]',
  },
  "admissions.requirements": {
    headline: "What you will need",
    intro: "A short list on both sides. We try not to ask for anything we would not want to provide ourselves.",
    groupsJson:
      '[{"group":"Required from you","items":["Online application form (one per student)","Student essay, 500 words, any topic","Two teacher recommendations (math + humanities)","School records from past two years","Family meeting (in person or video)"]},{"group":"Required from us","items":["Full viewbook and curriculum guide","Personal tour with a current student host","Half-day student visit in the applicant\'s grade","Financial aid estimate, no commitment","Direct email to the head of school, anytime"]}]',
  },
  "admissions.tuition": {
    headline: "Tuition & fees, 2026-27",
    intro: "Per-year tuition by grade band. Optional add-ons listed separately. No hidden fees, no fundraising quotas.",
    footnote:
      "Tuition is set annually by the Board in February. A non-refundable enrollment deposit of $1,200 is due at enrollment and credited against final tuition.",
    rowsJson:
      '[{"grade":"Lower School (K-5)","tuition":"$24,800","body":"Two teachers per classroom, all books and supplies included."},{"grade":"Middle School (6-8)","tuition":"$28,400","body":"Lab fees, world-language materials, and grade trips included."},{"grade":"High School (9-10)","tuition":"$31,200","body":"Capstone mentorship and up to two AP exams included."},{"grade":"Optional: Bus route","tuition":"$1,800","body":"Three routes: eastside, westside, south metro."},{"grade":"Optional: Lunch plan","tuition":"$1,400","body":"Family-style lunch, ingredients from the school garden."},{"grade":"Optional: After-school","tuition":"$950","body":"Daily through 6pm. Includes one enrichment activity per term."}]',
  },
  "admissions.aid": {
    headline: "If tuition is a stretch, ask anyway.",
    body1:
      "Thirty-eight percent of families receive need-based aid. The average award covers 47 percent of tuition. Aid decisions are made independently of admission decisions.",
    body2:
      "Apply through SSS (School and Student Services). The application takes about 40 minutes. We do not see your finances; we see a single recommended award.",
    statsJson:
      '[{"value":"38%","label":"Of families receive aid"},{"value":"47%","label":"Average award size"},{"value":"$2.4M","label":"Total aid budget"},{"value":"K-10","label":"Aid at every grade"}]',
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
    mapImage: "https://picsum.photos/seed/brm-campus-map-aerial/800/600",
    mapImageAlt: "Aerial map view of the BRM International School campus",
    entranceLabel: "Main entrance",
    entranceBody: "Linden Ridge Road gate, follow the signs to Founders Hall.",
  },
  "contact.depts": {
    headline: "Who to ask",
    intro: "Direct email for the most common questions. Each is monitored by a person whose title is in their signature.",
    contactsJson:
      '[{"name":"Admissions Office","person":"Greta Linde","email":"admissions@brm-international.org","role":"All inquiries, tours, applications"},{"name":"Financial Aid","person":"Sofia Park","email":"aid@brm-international.org","role":"SSS, awards, payment plans"},{"name":"Lower School","person":"Adaeze Okwu","email":"lower@brm-international.org","role":"Grades K through 5"},{"name":"Middle School","person":"Hugo Tanaka","email":"middle@brm-international.org","role":"Grades 6 through 8"},{"name":"High School","person":"Ben Carter","email":"upper@brm-international.org","role":"Grades 9 through 10"},{"name":"Front Office","person":"Jules Yamada","email":"front@brm-international.org","role":"Anything else"}]',
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
    stepsJson:
      '[{"n":"1","title":"We reply within one business day","body":"A real person in the admissions office will email you, usually with the viewbook attached and a calendar link for a tour."},{"n":"2","title":"You come visit","body":"Open house every Thursday at 9am from January through April, or a private tour any weekday morning. Your student is welcome at both."},{"n":"3","title":"We meet your student","body":"Half-day visit in their current grade, paired with a student host. The most important part of the process for us."},{"n":"4","title":"Decision, March 10","body":"Admission decisions released March 10. Aid decisions released March 17. We will tell you where you are on the waitlist, honestly."}]',
  },
  "inquiry.faq": {
    headline: "Quick questions",
    faqsJson:
      '[{"q":"What if I miss the January 15 deadline?","a":"Late applications go on the waitlist. We keep the list active through the summer. Email admissions if you are unsure."},{"q":"Do you offer shadow days?","a":"Yes. Every applicant gets a half-day visit in their current grade, paired with a student host. We schedule it after the application is complete."},{"q":"Is financial aid a separate process?","a":"Yes, through SSS (School and Student Services). It opens in October. Aid decisions are made independently of admission."}]',
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
