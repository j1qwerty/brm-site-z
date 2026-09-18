// CMS data layer for BRM International School.
// All site content is organized by section keys. The site renders with
// hardcoded defaults immediately, then a background Firestore subscription
// layers in any published overrides from the admin panel.

import type { Timestamp } from "firebase/firestore";

/*
  CONTENT MODEL
  =============
  Five Firestore collections back the CMS:

  1. `cms_content` - per-section text/image overrides.
     Keyed by sectionId (e.g. "home.hero", "footer.brand_blurb").
     Each doc has: live (object of field=>value), draft (object of field=>value),
     updatedAt, updatedBy, draftUpdatedAt, draftUpdatedBy.

  2. `cms_items` - list items (gallery images, videos, events, faqs, news).
     Each doc has: kind ("gallery"|"video"|"event"|"faq"|"news"),
     data (object), deleted (boolean), deletedAt, createdAt, updatedAt.

  3. `cms_history` - audit log of every change. { collection, docId, action,
     before, after, timestamp, user }. We keep last 10 per (collection, docId).

  4. `cms_settings` - single doc with site-wide settings (autoDeleteDays, etc.).

  5. `contact_messages` and `inquiries` - already written to by the forms.

  SECURITY MODEL
  ==============
  Public users can:
  - READ cms_content (live only), cms_items (non-deleted), cms_settings.
  - WRITE to contact_messages, inquiries (validated shape).

  Only authed admins can write to cms_* collections. See README for rules.
*/

export type SectionId =
  // Home
  | "home.hero"
  | "home.stats"
  | "home.mission"
  | "home.programs"
  | "home.faculty"
  | "home.why"
  | "home.testimonials"
  | "home.events"
  | "home.gallery_preview"
  | "home.videos"
  | "home.faq"
  | "home.campus_preview"
  | "home.news_cta"
  // About
  | "about.hero"
  | "about.history"
  | "about.values"
  | "about.leadership"
  | "about.campus"
  | "about.accreditation"
  | "about.cta"
  // Academics
  | "academics.hero"
  | "academics.bands"
  | "academics.departments"
  | "academics.schedule"
  | "academics.outcomes"
  | "academics.field_studies"
  | "academics.cta"
  // Admissions
  | "admissions.hero"
  | "admissions.process"
  | "admissions.requirements"
  | "admissions.tuition"
  | "admissions.aid"
  | "admissions.cta"
  // Events
  | "events.hero"
  | "events.cta"
  // Gallery
  | "gallery.hero"
  | "gallery.cta"
  // Contact
  | "contact.hero"
  | "contact.visit"
  | "contact.depts"
  // Inquiry
  | "inquiry.hero"
  | "inquiry.next_steps"
  | "inquiry.faq"
  // Shared
  | "shared.footer"
  | "shared.contact_info"
  | "shared.nav";

export type ItemKind = "gallery" | "video" | "event" | "faq" | "news";

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  category: string;
  deleted?: boolean;
};

export type VideoItem = {
  id: string;
  externalUrl: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  durationLabel?: string;
  source?: string; // YouTube, Vimeo, etc.
  deleted?: boolean;
};

export type EventItem = {
  id: string;
  title: string;
  date: string;       // ISO date
  time?: string;
  location?: string;
  description: string;
  imageSrc?: string;
  category: string;   // Academic, Athletics, Cultural, Community, etc.
  gallery?: GalleryItem[];
  deleted?: boolean;
};

export type FAQItem = {
  id: string;
  page: string;       // which page this FAQ appears on
  question: string;
  answer: string;
  order: number;
  deleted?: boolean;
};

export type NewsItem = {
  id: string;
  tag: string;
  date: string;
  title: string;
  excerpt: string;
  deleted?: boolean;
};

export type CMSItemMap = {
  gallery: GalleryItem;
  video: VideoItem;
  event: EventItem;
  faq: FAQItem;
  news: NewsItem;
};

export type CMSContentDoc = {
  sectionId: SectionId | string;
  live: Record<string, unknown> | null;
  draft: Record<string, unknown> | null;
  liveUpdatedAt?: Timestamp | null;
  draftUpdatedAt?: Timestamp | null;
  liveUpdatedBy?: string;
  draftUpdatedBy?: string;
};

export type CMSHistoryEntry = {
  id?: string;
  collection: string;
  docId: string;
  sectionId?: string;
  kind?: string; // cms_items item kind (gallery, video, event, faq, news)
  action: "edit" | "add" | "delete" | "restore" | "publish" | "settings";
  before?: unknown;
  after?: unknown;
  timestamp: Timestamp | null;
  user: string;
  summary?: string;
};

export type CMSSettings = {
  autoDeleteDays: number;       // soft-deleted items auto-purged after N days
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialInstagram?: string;
  socialYoutube?: string;
  socialFacebook?: string;
  socialX?: string;
  socialLinkedin?: string;
};
