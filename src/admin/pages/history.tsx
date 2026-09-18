"use client";

import { useEffect, useState } from "react";
import { AdminHeader, AdminLoading, AdminEmptyState, AdminCard, AdminBadge, AdminButton } from "../admin-ui";
import { loadHistory, isFirebaseConfigured } from "@/lib/cms";
import { SECTIONS } from "@/lib/cms-defaults";
import type { CMSHistoryEntry } from "@/lib/cms-types";
import type { AdminPage } from "../admin-shell";
import { writeHistoryHandoff } from "../history-panel";

const SECTION_PAGES = new Map(
  SECTIONS.flatMap((g) => g.sections.map((s) => [s.id, g.page] as const)),
);

const ITEM_KIND_PAGES: Record<string, string> = {
  gallery: "Gallery",
  video: "Videos",
  event: "Events",
  faq: "FAQs",
  news: "News",
};

/* Which site page (or area) a history entry belongs to. */
export function historyPageOf(h: CMSHistoryEntry): string {
  if (h.sectionId) {
    const mapped = SECTION_PAGES.get(h.sectionId);
    if (mapped) return mapped;
    const prefix = h.sectionId.split(".")[0] || "";
    return prefix.charAt(0).toUpperCase() + prefix.slice(1);
  }
  if (h.collection === "cms_items") {
    if (h.kind && ITEM_KIND_PAGES[h.kind]) return ITEM_KIND_PAGES[h.kind];
    const snap = (h.after ?? h.before ?? {}) as {
      kind?: string;
      data?: { page?: unknown };
    };
    const data = (snap.data ?? (h.before as { data?: { page?: unknown } } | null)?.data) as
      | { page?: unknown }
      | undefined;
    if (data && typeof data.page === "string" && data.page) return data.page;
    if (snap.kind && ITEM_KIND_PAGES[snap.kind]) return ITEM_KIND_PAGES[snap.kind];
    const beforeKind = (h.before as { kind?: unknown } | null)?.kind;
    if (typeof beforeKind === "string" && ITEM_KIND_PAGES[beforeKind]) return ITEM_KIND_PAGES[beforeKind];
    return "Items";
  }
  if (h.collection === "cms_settings") return "Settings";
  if (h.collection === "contact_messages" || h.collection === "inquiries") return "Inbox";
  return "Other";
}

export function AdminHistory({ onNavigate }: { onNavigate: (p: AdminPage) => void }) {
  const [items, setItems] = useState<CMSHistoryEntry[] | null>(() => (isFirebaseConfigured() ? null : []));
  const [filter, setFilter] = useState<string>("all");
  const [pageFilter, setPageFilter] = useState<string>("all");
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    let cancelled = false;
    Promise.all([
      loadHistory("cms_content"),
      loadHistory("cms_items"),
      loadHistory("cms_settings"),
      loadHistory("contact_messages"),
      loadHistory("inquiries"),
    ])
      .then(([a, b, c, d, e]) => {
        if (cancelled) return;
        const all = [...a, ...b, ...c, ...d, ...e];
        all.sort((x, y) => {
          const xt = x.timestamp?.toMillis?.() ?? 0;
          const yt = y.timestamp?.toMillis?.() ?? 0;
          return yt - xt;
        });
        setItems(all);
      })
      .catch((e) => {
        if (cancelled) return;
        setItems([]);
        setLoadError(
          e?.code === "permission-denied"
            ? "Firestore denied access. Sign in with Google (password login has no database access), then reopen this page."
            : `Could not load history from Firestore (${e?.code ?? "unknown error"}). ${e?.message ?? "Retry in a bit."}`,
        );
      });
    return () => { cancelled = true; };
  }, []);

  if (!items) return <AdminLoading label="Loading history..." />;

  const byPage = pageFilter === "all" ? items : items.filter((i) => historyPageOf(i) === pageFilter);
  const filtered = filter === "all" ? byPage : byPage.filter((i) => i.collection === filter);
  const collections = ["all", ...Array.from(new Set(items.map((i) => i.collection)))];
  const pages = ["all", ...Array.from(new Set(items.map(historyPageOf))).sort()];

  return (
    <div>
      <AdminHeader
        title="History"
        subtitle="Last 10 changes per item, across all collections."
      />
      {loadError && (
        <div className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm">
          {loadError}
        </div>
      )}
      <p className="text-xs font-mono uppercase tracking-[0.12em] text-muted-foreground mb-2">Page</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPageFilter(p)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-[0.12em] transition-colors ${
              pageFilter === p ? "bg-brand text-brand-foreground" : "border border-border hover:border-amber/60"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
      <p className="text-xs font-mono uppercase tracking-[0.12em] text-muted-foreground mb-2">Collection</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {collections.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-[0.12em] transition-colors ${
              filter === c ? "bg-brand text-brand-foreground" : "border border-border hover:border-amber/60"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <AdminEmptyState title="No history yet" body="Make changes in the admin panel to see them logged here." />
      ) : (
        <AdminCard>
          <ul className="divide-y divide-border">
            {filtered.map((h, i) => (
              <li key={h.id || i} className="py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <AdminBadge color={actionColor(h.action)}>{h.action}</AdminBadge>
                      <span className="text-xs font-mono text-muted-foreground">{h.collection}</span>
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-muted text-foreground">
                        {historyPageOf(h)}
                      </span>
                      {h.docId && h.docId.length < 60 && (
                        <span className="text-xs font-mono text-muted-foreground">/{h.docId}</span>
                      )}
                    </div>
                    {h.summary && <p className="text-sm text-foreground">{h.summary}</p>}
                    {h.timestamp && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(h.timestamp.toMillis?.() ?? 0).toLocaleString()}
                      </p>
                    )}
                    {historyTarget(h) && (
                      <div className="mt-2">
                        <AdminButton
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            const t = historyTarget(h);
                            if (!t) return;
                            if (t.sectionId) writeHistoryHandoff({ sectionId: t.sectionId });
                            else if (t.docId) writeHistoryHandoff({ docId: t.docId });
                            onNavigate(t.page);
                          }}
                        >
                          Open
                        </AdminButton>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </AdminCard>
      )}
    </div>
  );
}

/* Destination admin page for an "Open" jump from global history. */
export function historyTarget(h: CMSHistoryEntry): { page: AdminPage; sectionId?: string; docId?: string } | null {
  if (h.sectionId) return { page: "content", sectionId: h.sectionId };
  if (h.collection === "cms_items") {
    const kind =
      h.kind ??
      (h.after as { kind?: unknown } | null)?.kind ??
      (h.before as { kind?: unknown } | null)?.kind;
    const page =
      kind === "gallery" ? "gallery"
      : kind === "video" ? "videos"
      : kind === "event" ? "events"
      : kind === "faq" ? "faqs"
      : null;
    if (page) return { page, docId: h.docId };
    return null;
  }
  if (h.collection === "cms_settings") return { page: "settings" };
  if (h.collection === "inquiries") return { page: "inquiries" };
  if (h.collection === "contact_messages") return { page: "contacts" };
  return null;
}

function actionColor(action: string): "neutral" | "amber" | "danger" | "success" {  switch (action) {
    case "add":
    case "restore":
      return "success";
    case "delete":
      return "danger";
    case "publish":
    case "settings":
      return "amber";
    default:
      return "neutral";
  }
}
