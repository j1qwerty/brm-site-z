"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { getDb, isFirebaseConfigured } from "@/lib/firebase";
import type { CMSHistoryEntry } from "@/lib/cms-types";
import { AdminBadge, AdminButton } from "./admin-ui";
import { historyPageOf } from "./pages/history";

/*
  snapshotOf: extract the restorable field-map from a history entry.
  - content/settings entries: after/before ARE the field map.
  - item add entries: after = { kind, data } -> data.
  - item edit entries: after = merged data map.
  - item delete entries: after is { deleted: true } (useless) -> use before
    (full doc { kind, data, ... } -> data).
  - restore entries: nothing to fill -> null (no button rendered).
*/
export function snapshotOf(
  entry: CMSHistoryEntry,
): { kind?: string; data: Record<string, unknown> } | null {
  if (entry.action === "restore") return null;
  const pick = (v: unknown): { kind?: string; data: Record<string, unknown> } | null => {
    if (!v || typeof v !== "object") return null;
    const o = v as Record<string, unknown>;
    if (o.data && typeof o.data === "object" && !Array.isArray(o.data)) {
      return {
        kind: typeof o.kind === "string" ? o.kind : undefined,
        data: o.data as Record<string, unknown>,
      };
    }
    if (o.deleted === true && Object.keys(o).length <= 2) return null;
    return { kind: undefined, data: o };
  };
  if (entry.action === "delete") return pick(entry.before);
  return pick(entry.after) ?? pick(entry.before);
}

/* Cross-page handoff: global History "Open" writes the target, the destination
   admin page consumes it on mount (section select / item edit). Tab-scoped. */
const HANDOFF_KEY = "brm-history-handoff";
export type HistoryHandoff = { sectionId?: string; docId?: string };
export function writeHistoryHandoff(h: HistoryHandoff): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(HANDOFF_KEY, JSON.stringify(h));
}
export function readHistoryHandoff(): HistoryHandoff | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(HANDOFF_KEY);
    window.sessionStorage.removeItem(HANDOFF_KEY);
    return raw ? (JSON.parse(raw) as HistoryHandoff) : null;
  } catch {
    return null;
  }
}

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
  onRestore,
}: {
  collection: string;
  docId?: string;
  kind?: string;
  title?: string;
  onRestore?: (entry: CMSHistoryEntry) => void;
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
              <span className="text-xs text-muted-foreground">
                {new Date(h.timestamp.toMillis?.() ?? 0).toLocaleString()}
              </span>
            )}
            {onRestore && snapshotOf(h) && (
              <span className="ml-auto" title="Load this version into the editor above">
                <AdminButton variant="ghost" size="sm" onClick={() => {
                  if (typeof window !== "undefined") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                  onRestore(h);
                }}>
                  Restore
                </AdminButton>
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
