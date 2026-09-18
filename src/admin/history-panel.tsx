"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { getDb, isFirebaseConfigured } from "@/lib/firebase";
import type { CMSHistoryEntry } from "@/lib/cms-types";
import { AdminBadge } from "./admin-ui";
import { historyPageOf } from "./pages/history";

/*
  HistoryPanel: per-page recent-changes feed.
  Embed at the bottom of an admin page (content editor, events, gallery,
  videos, faqs, settings) so each page shows its own history.
  - collection: e.g. "cms_content" | "cms_items" | "cms_settings"
  - docId: exact doc (section editor, settings) - shows last 10 for that doc
  - kind: cms_items kind filter (gallery, video, event, faq, news)
  Realtime via onSnapshot; equality-only filters need no composite index.
*/

export function HistoryPanel({
  collection: collectionName,
  docId,
  kind,
  title = "Recent changes",
}: {
  collection: string;
  docId?: string;
  kind?: string;
  title?: string;
}) {
  const [items, setItems] = useState<CMSHistoryEntry[] | null>(() =>
    isFirebaseConfigured() ? null : [],
  );

  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    const db = getDb();
    if (!db) {
      setItems([]);
      return;
    }
    return onSnapshot(
      query(collection(db, "cms_history"), where("collection", "==", collectionName)),
      (snap) => {
        const all: CMSHistoryEntry[] = [];
        snap.forEach((d) => all.push({ id: d.id, ...(d.data() as Omit<CMSHistoryEntry, "id">) }));
        const filtered = all.filter((h) => {
          if (docId && h.docId !== docId) return false;
          if (kind && h.collection === "cms_items" && h.kind && h.kind !== kind) return false;
          return true;
        });
        filtered.sort((a, b) => (b.timestamp?.toMillis?.() ?? 0) - (a.timestamp?.toMillis?.() ?? 0));
        setItems(filtered.slice(0, 10));
      },
      () => setItems([]),
    );
  }, [collectionName, docId, kind]);

  if (!items || items.length === 0) return null;

  return (
    <div className="mt-6">
      <p className="text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground mb-2">
        {title}
      </p>
      <ul className="rounded-2xl border border-border bg-card divide-y divide-border">
        {items.map((h, i) => (
          <li key={h.id || i} className="px-4 py-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <AdminBadge color={h.action === "publish" ? "amber" : h.action === "delete" ? "danger" : "neutral"}>
              {h.action}
            </AdminBadge>
            <span className="text-xs font-mono text-muted-foreground">{historyPageOf(h)}</span>
            {h.summary && <span className="text-foreground">{h.summary}</span>}
            {h.timestamp && (
              <span className="ml-auto text-xs text-muted-foreground">
                {new Date(h.timestamp.toMillis?.() ?? 0).toLocaleString()}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
