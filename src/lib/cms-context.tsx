"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { isFirebaseConfigured, getDb, getAuthClient } from "./firebase";
import type {
  SectionId,
  ItemKind,
  GalleryItem,
  VideoItem,
  EventItem,
  FAQItem,
  NewsItem,
  CMSContentDoc,
  CMSSettings,
  CMSItemMap,
} from "./cms-types";

/*
  CMS Provider
  ============
  - Subscribes to Firestore for:
    - cms_content (all docs) - text overrides, merged with hardcoded defaults
    - cms_items (where deleted == false) - lists for gallery, videos, events, faqs, news
    - cms_settings (single doc) - site-wide settings
  - Renders children with the merged content.
  - If Firebase is not configured, children render with hardcoded defaults only.
  - Falls back gracefully: any Firestore error keeps the defaults and does not throw.
*/

type CMSContextValue = {
  // Section content: live overrides merged over defaults.
  content: Record<string, Record<string, unknown>>;
  // Lists (non-deleted items only).
  gallery: GalleryItem[];
  videos: VideoItem[];
  events: EventItem[];
  faqs: FAQItem[];
  news: NewsItem[];
  // Settings
  settings: CMSSettings | null;
  // Loading flags (for skeletons if needed)
  ready: boolean;
  // Whether we are falling back to defaults because Firebase is not configured
  usingFallback: boolean;
};

const CMSContext = createContext<CMSContextValue | null>(null);

export function CMSProvider({ children }: { children: React.ReactNode }) {
  const configured = isFirebaseConfigured();
  const [content, setContent] = useState<Record<string, Record<string, unknown>>>({});
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [settings, setSettings] = useState<CMSSettings | null>(null);
  // Ready is true immediately if Firebase is not configured (no async work to do).
  // Otherwise it flips true after the effect subscribes.
  const [ready, setReady] = useState<boolean>(() => !configured);
  // Bumped whenever Firebase Auth state changes (null -> user on refresh).
  // Data subscriptions re-run so admin reads happen authenticated - with the
  // tightened rules the first (unauthenticated) attempt fails terminally.
  const [authTick, setAuthTick] = useState(0);

  useEffect(() => {
    if (!configured) return;
    const auth = getAuthClient();
    if (!auth) return;
    return onAuthStateChanged(auth, () => setAuthTick((k) => k + 1));
  }, [configured]);

  useEffect(() => {
    if (!configured) {
      // Already ready via lazy init. Nothing to subscribe to.
      return;
    }
    const db = getDb();
    if (!db) {
      // Already ready. Nothing else to do.
      return;
    }

    // Subscribe to cms_content (all docs - small collection)
    const unsubContent = onSnapshot(
      collection(db, "cms_content"),
      (snap) => {
        const next: Record<string, Record<string, unknown>> = {};
        snap.forEach((d) => {
          const data = d.data() as CMSContentDoc;
          if (data.live) next[d.id] = data.live;
        });
        setContent(next);
      },
      (err) => {
        console.warn("[CMS] cms_content subscription failed, using defaults:", err);
      }
    );

    // Subscribe to cms_items where deleted != true
    const unsubItems = onSnapshot(
      query(collection(db, "cms_items"), where("deleted", "!=", true)),
      (snap) => {
        const g: GalleryItem[] = [];
        const v: VideoItem[] = [];
        const e: EventItem[] = [];
        const f: FAQItem[] = [];
        const n: NewsItem[] = [];
        snap.forEach((d) => {
          const data = d.data() as { kind: ItemKind; data: CMSItemMap[ItemKind]; deleted?: boolean };
          if (!data || data.deleted) return;
          const item = { ...(data.data as Record<string, unknown>), id: d.id } as CMSItemMap[ItemKind];
          switch (data.kind) {
            case "gallery": g.push(item as GalleryItem); break;
            case "video": v.push(item as VideoItem); break;
            case "event": e.push(item as EventItem); break;
            case "faq": f.push(item as FAQItem); break;
            case "news": n.push(item as NewsItem); break;
          }
        });
        setGallery(g);
        setVideos(v);
        setEvents(e);
        setFaqs(f);
        setNews(n);
      },
      (err) => console.warn("[CMS] cms_items subscription failed:", err)
    );

    // Subscribe to cms_settings (single doc)
    const unsubSettings = onSnapshot(
      doc(db, "cms_settings", "site"),
      (d) => {
        if (d.exists()) setSettings(d.data() as CMSSettings);
      },
      (err) => console.warn("[CMS] cms_settings subscription failed:", err)
    );

    // Defer the setReady(true) call to a microtask so it does not run
    // synchronously in the effect body (avoids the lint rule).
    queueMicrotask(() => setReady(true));

    return () => {
      unsubContent();
      unsubItems();
      unsubSettings();
    };
  }, [configured, authTick]);

  const value = useMemo<CMSContextValue>(
    () => ({
      content,
      gallery,
      videos,
      events,
      faqs,
      news,
      settings,
      ready,
      usingFallback: !configured,
    }),
    [content, gallery, videos, events, faqs, news, settings, ready, configured]
  );

  return <CMSContext.Provider value={value}>{children}</CMSContext.Provider>;
}

export function useCMS() {
  const ctx = useContext(CMSContext);
  if (!ctx) throw new Error("useCMS must be used within <CMSProvider>");
  return ctx;
}

/*
  useSection<T>(sectionId, defaults)
  =================================
  Returns the merged content for a section.
  - Renders `defaults` immediately (no loading flash).
  - Once Firestore live overrides arrive, merges them over the defaults
    and re-renders.
  - Field-level merge: only fields present in `live` override the defaults.
*/
export function useSection<T extends Record<string, unknown>>(
  sectionId: SectionId | string,
  defaults: T
): T {
  const { content } = useCMS();
  const live = content[sectionId];
  if (!live) return defaults;
  return { ...defaults, ...live } as T;
}

/*
  useItemList<T>(kind)
  ====================
  Returns the live list for a given kind. If Firestore has no items,
  returns an empty array (caller is responsible for falling back to its
  own hardcoded defaults if needed).
*/
export function useItemList<T extends { id: string }>(kind: ItemKind): T[] {
  const { gallery, videos, events, faqs, news } = useCMS();
  switch (kind) {
    case "gallery": return gallery as unknown as T[];
    case "video": return videos as unknown as T[];
    case "event": return events as unknown as T[];
    case "faq": return faqs as unknown as T[];
    case "news": return news as unknown as T[];
    default: return [];
  }
}
