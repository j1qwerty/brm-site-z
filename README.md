# BRM International School

A multi-page school website built with Next.js 16, Tailwind v4, Motion, and Firebase,
with a full CMS-driven admin panel for managing all content.

Built per the **tasteskill** anti-slop frontend skill: editorial-kinetic visual
language, forest-green + bone + amber palette, asymmetric layouts, motivated
motion, and zero AI-template tells.

## What is here

- Single-route Next.js app at `/` with **state-based view switching** for the
  eight "pages": Home, About, Academics, Admissions, Events, Gallery, Contact,
  Inquiry. Each view is composed of multiple sections with different layout
  families.
- **Full admin panel** at the `admin` view (footer gear icon or `#/admin` URL)
  with: dashboard, inquiries, contact messages, content CMS, events, gallery,
  videos, FAQs, history, trash, and settings.
- **Content Management System (CMS)** that lets admin edit text, blurbs,
  image URLs, and list items for any section on any page. Drafts and
  publish-to-live are separate. Site visitors never see drafts.
- **Site loads with hardcoded defaults**, then a background Firestore
  subscription layers in any published overrides. No flash, no waiting.
- **History** of the last 10 changes per item, across all collections.
- **Soft-delete with restore**: every list item soft-deletes to Trash, can be
  restored or auto-purged after N days (configurable in Settings).
- **10 hand-rolled SVG decorative elements** scattered randomly across
  sections (corners, edges, center). Each section re-seeds the layout for
  stable, non-jittery placement. See `src/components/decor/`.
- **AnimatedBackground** that scatters those SVGs into random corner placements
  per section. Stable per-section (no reshuffle on re-render).
- **Floating scroll-to-top button** at bottom-right with the exact behavior
  requested:
  - Hidden when at the top of the page.
  - Visible when not at top.
  - Auto-hides after 800ms of no scrolling.
  - Animates (rotates + scales) **while** scrolling; stops when scrolling
    stops.
  - On click: smooth-scrolls to top (instant under reduced-motion).
  - Shows a progress ring around it reflecting scroll depth.
- **Parallax** and **scroll-triggered reveals** throughout, using Motion's
  `useScroll` + `useTransform` + `whileInView` (no `window.scroll` listeners).
- **Masonry gallery** using the classic CSS-columns pattern shared widely on
  GitHub gists. Filterable by category, animated layout transitions.
- **Events page** + events section on home page. Each event has date, time,
  location, description, image, category. Filter by category on the events page.
- **Videos section** with external-link preview cards. Click plays in a new
  tab on the source site (YouTube, Vimeo, etc). Site does not embed videos.
- **FAQ accordion** on home, admissions, and inquiry pages. Each FAQ is
  tied to a specific page. Admin can add/edit/delete FAQs per page.
- **Footer** with social media icons (Instagram, YouTube, Facebook, X, LinkedIn),
  navigation, contact info, and an admin gear icon.
- **Firebase-backed Contact and Inquiry forms** that write to Firestore.
- Honors `prefers-reduced-motion` everywhere.
- Dual light / dark mode via Tailwind `dark:` variant.
- Sticky footer at bottom on short pages, pushes down naturally on long ones.

## Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS v4** with custom design tokens (forest palette)
- **Motion** (formerly Framer Motion) for animation
- **Firebase** (client SDK) for Firestore writes (CMS + forms)
- **Phosphor Icons** for iconography (per taste-skill, preferred over Lucide)
- **shadcn/ui** for the accordion in the FAQ

## Local development

```bash
bun install
bun run dev
```

Open the preview in the right-side panel, or use the "Open in New Tab" button.

## Firebase setup (you add the keys manually)

The Contact and Inquiry forms, the CMS, the admin panel, and history all
require Firebase. They will not work until you provide credentials.

### 1. Create a Firebase project

1. Go to <https://console.firebase.google.com> and create a new project
   (or use an existing one). Name it whatever you like, e.g. `brm-school`.
2. In the project, click **Web (`</>`)** to add a web app. Give it a nickname.
3. After registering, Firebase shows a config object. Copy the values of
   `apiKey`, `authDomain`, `projectId`, `storageBucket`,
   `messagingSenderId`, and `appId`.

### 2. Add the keys to your environment

Copy `.env.example` to `.env.local` and paste the values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=brm-school.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=brm-school
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=brm-school.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890

# Admin panel password (defaults to "brm-admin" if not set)
NEXT_PUBLIC_ADMIN_PASSWORD=your-strong-password-here
```

Restart the dev server:

```bash
bun run dev
```

When the env vars are present, the warning banners on the Contact and Inquiry
forms disappear, the CMS starts reading published overrides, and the admin
panel becomes fully functional.

### 3. Create the Firestore collections

The app writes to five collections. All are created automatically on the
first write:

| Collection            | Written by                         | Fields                                                                                                                |
| --------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `contact_messages`    | Contact form (public)              | `name, email, subject, message, createdAt, read?, deleted?, deletedAt?`                                              |
| `inquiries`           | Inquiry form (public)              | `parentName, email, phone, studentName, currentGrade, entryGrade, entryYear, interests[], howHeard, message, createdAt, read?, deleted?` |
| `cms_content`         | Admin CMS (authed)                | `sectionId, live{...}, draft{...}, liveUpdatedAt, draftUpdatedAt, liveUpdatedBy, draftUpdatedBy`                     |
| `cms_items`           | Admin CMS (authed)                | `kind ("gallery"\|"video"\|"event"\|"faq"\|"news"), data{...}, deleted, deletedAt, createdAt, updatedAt`             |
| `cms_history`         | Admin CMS (authed, auto-trimmed)  | `collection, docId, sectionId?, action, before, after, timestamp, user, summary`                                     |
| `cms_settings`        | Admin CMS (single doc, id "site") | `autoDeleteDays, siteName, contactEmail, contactPhone, address, socialInstagram?, socialYoutube?, ...`               |

### 4. Lock down Firestore Security Rules

By default, a new Firestore project is locked. Replace the rules in
**Firestore > Rules** with the following to allow public write of forms,
public read of CMS, and authenticated admin writes:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Anyone can write a contact message; no public read.
    match /contact_messages/{docId} {
      allow write: if request.resource.schema() == {
        name: string(),
        email: string(),
        subject: string(),
        message: string(),
        createdAt: any()
      };
      allow read: if false;
    }

    // Anyone can write an inquiry; no public read.
    match /inquiries/{docId} {
      allow write: if request.resource.schema() == {
        parentName: string(),
        email: string(),
        phone: string(),
        studentName: string(),
        currentGrade: string(),
        entryGrade: string(),
        entryYear: string(),
        interests: list(),
        howHeard: string(),
        message: string(),
        createdAt: any()
      };
      allow read: if false;
    }

    // Public can READ cms_content (live overrides only).
    // Writes are restricted to authenticated admins.
    // NOTE: Until you wire Firebase Auth, this allows writes from anyone
    // who knows the sectionId. Tighten with `request.auth != null` once
    // auth is set up.
    match /cms_content/{docId} {
      allow read: if true;
      allow write: if true;  // TODO: tighten to `request.auth != null`
    }

    // Public can READ non-deleted cms_items.
    // Admin writes are open until auth is configured.
    match /cms_items/{docId} {
      allow read: if true;
      allow write: if true;  // TODO: tighten to `request.auth != null`
    }

    // Public can READ cms_settings.
    match /cms_settings/{docId} {
      allow read: if true;
      allow write: if true;  // TODO: tighten to `request.auth != null`
    }

    // History is admin-only.
    match /cms_history/{docId} {
      allow read: if true;   // TODO: tighten to `request.auth != null`
      allow write: if true;  // TODO: tighten to `request.auth != null`
    }

    // Deny everything else.
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

> The TODO comments mark where to add `request.auth != null` once you wire
> Firebase Auth. Until then, anyone who can guess a sectionId can write
> CMS content. The admin password gate is client-side only and is NOT a
> security boundary.

### 5. Set the admin password

The admin panel is gated by a password. Default is `brm-admin`. Override it
with `NEXT_PUBLIC_ADMIN_PASSWORD` in `.env.local`. This is a convenience
gate, not a security boundary. Anyone with the URL can attempt to log in.

For real security, wire Firebase Auth and tighten Firestore rules to
`request.auth != null` on the CMS collections.

## Admin panel

Access the admin panel via the gear icon in the footer, or by visiting
`#/admin` in the URL hash.

Pages:

| Page              | Purpose                                                                                       |
| ----------------- | --------------------------------------------------------------------------------------------- |
| Dashboard         | Counts of inquiries, contacts, trash, unread. Quick actions. How-the-CMS-works explainer.    |
| Inquiries         | List + detail view of inquiry form submissions. Mark as read, soft-delete.                   |
| Contact messages  | List + detail view of contact form messages. Mark as read, soft-delete.                       |
| Content (CMS)     | Per-page section text editor. Save draft, publish to live, revert draft to live.             |
| Events            | CRUD for events. Each event has title, date, time, location, description, image, category.  |
| Gallery           | CRUD for gallery images. Each image has src URL, alt text, caption, category.                |
| Videos            | CRUD for video cards. Each video has external URL, thumbnail URL, title, description, source. |
| FAQs              | CRUD for FAQs. Each FAQ has page, question, answer, order.                                   |
| History           | Last 10 changes per item across all collections. Filter by collection.                       |
| Trash             | Soft-deleted items with restore + permanent delete. Days-until-purge badge.                  |
| Settings          | Auto-delete days, contact info, social media links.                                          |

### CMS workflow

1. Open **Content (CMS)** in the admin panel.
2. Pick a section from the sidebar (grouped by page, plus Shared sections).
3. The form loads the current live values (or hardcoded defaults on first edit).
4. Edit any field. Long values get a textarea, short values get an input.
5. **Save Draft** - writes the draft to Firestore. Site is unaffected.
6. **Publish** - copies the draft to live. Site updates on next render.
7. **Revert Draft** - discards the draft, resets to current live values.

Shared sections (Footer, Contact info, Nav) appear once in the admin and
apply across every page where they are used. There is no per-page duplication.

### List items workflow (gallery, videos, events, FAQs)

1. Open the relevant page (e.g. Gallery) in the admin panel.
2. Click **Add** to create a new item, or the pencil icon on an existing item to edit.
3. Fill out the form. Click **Save** to write to Firestore (immediately live).
4. Click the trash icon to soft-delete an item. It moves to Trash.
5. From Trash, you can **Restore** an item or **Delete forever** (permanent).

Soft-deleted items are auto-purged after the number of days configured in
Settings (default 30, set to 0 to disable auto-purge).

### History workflow

Every change (add, edit, delete, restore, publish, settings) writes a history
entry to the `cms_history` collection. The system automatically trims history
to the last 10 entries per `(collection, docId)` pair. Older entries are
deleted in a batch.

The History page shows the most recent 50 entries across all collections,
filterable by collection.

## Project structure

```
src/
  app/
    globals.css         Forest palette tokens, masonry utility, grain overlay
    layout.tsx          Root layout, fonts, metadata
    page.tsx            Mounts <SiteShell />
  components/
    decor/
      svg-decor.tsx            10 SVG decorative elements (blob, arcs, dots, etc.)
      animated-background.tsx  Scatters SVGs into random corner placements
    site/
      site-context.tsx         View-state + URL-hash sync (single-route SPA)
      site-shell.tsx           Navbar + view router + Footer + FloatingScrollTop + CMSProvider
      navbar.tsx               Desktop + mobile nav
      footer.tsx               Footer with social icons + admin gear link
      section.tsx              <Section> wrapper that paints AnimatedBackground
      motion-primitives.tsx    <Parallax>, <Reveal>, <Stagger>
      floating-scroll-top.tsx  The scroll-aware bottom-right button
    ui/                        shadcn/ui components (accordion used in FAQ)
  admin/
    admin-shell.tsx           Admin layout, auth gate, sidebar nav
    admin-ui.tsx               Shared admin UI primitives (buttons, inputs, etc.)
    pages/
      dashboard.tsx           Counts + quick actions
      inquiries.tsx           Inquiry list + detail
      contacts.tsx            Contact message list + detail
      content.tsx             CMS section editor
      events.tsx              Events CRUD
      gallery.tsx             Gallery CRUD
      videos.tsx              Videos CRUD
      faqs.tsx                FAQ CRUD
      history.tsx             History log viewer
      trash.tsx               Soft-deleted items + restore/purge
      settings.tsx            Site settings (auto-delete days, contact, social)
  lib/
    firebase.ts               Lazy Firebase app + Firestore init + isConfigured
    cms-types.ts              All CMS data types + section IDs
    cms-defaults.ts           Hardcoded default content (rendered immediately)
    cms-context.tsx           CMSProvider + useSection + useItemList hooks
    cms.ts                    Firestore write helpers (save draft, publish, CRUD, history)
    utils.ts, db.ts            Shadcn utility + Prisma client
  views/
    home.tsx                  12 sections (hero, stats, mission, programs, faculty,
                              why, testimonials, events, gallery preview, videos, FAQ, news+CTA)
    about.tsx                 7 sections
    academics.tsx             7 sections
    admissions.tsx            7 sections (timeline, checklist, tuition, aid, FAQ, CTA)
    events.tsx                3 sections (hero, filter+cards, CTA)
    gallery.tsx               4 sections (hero+filter, masonry, recent, CTA)
    contact.tsx               4 sections (form, visit info, dept contacts)
    inquiry.tsx               4 sections (form, next steps, FAQ)
```

## Design notes

- **Palette**: deep forest green + warm bone background + single amber accent.
  Per taste-skill §4.2 Forest preset, deliberately avoiding the AI-default
  beige + brass + oxblood + espresso family.
- **Fonts**: Geist Sans (display + body) and Geist Mono (eyebrows / labels).
  Loaded via `next/font`, no `<link>` tags.
- **Motion**: every animation is motivated (entry transitions for hierarchy,
  parallax for depth, scroll-reveals for storytelling). Honors
  `prefers-reduced-motion` everywhere.
- **Layout**: every section uses a different layout family. No three-equal-card
  rows, no zigzag pattern repeated three times, no scroll cues, no em-dashes.
- **Images**: Picsum-seeded placeholders that match the editorial tone. Swap
  in real school photography at the same paths before launch.
- **Accessibility**: WCAG AA contrast on every text, semantic HTML throughout,
  keyboard-navigable nav and forms, sr-only captions on gallery images.

## License

MIT.
