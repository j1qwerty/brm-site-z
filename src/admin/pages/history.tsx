"use client";

import { useEffect, useState } from "react";
import { AdminHeader, AdminLoading, AdminEmptyState, AdminCard, AdminBadge } from "../admin-ui";
import { loadHistory, isFirebaseConfigured } from "@/lib/cms";
import type { CMSHistoryEntry } from "@/lib/cms-types";

export function AdminHistory() {
  const [items, setItems] = useState<CMSHistoryEntry[] | null>(() => (isFirebaseConfigured() ? null : []));
  const [filter, setFilter] = useState<string>("all");

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
      .catch(() => { if (!cancelled) setItems([]); });
    return () => { cancelled = true; };
  }, []);

  if (!items) return <AdminLoading label="Loading history..." />;

  const filtered = filter === "all" ? items : items.filter((i) => i.collection === filter);
  const collections = ["all", ...Array.from(new Set(items.map((i) => i.collection)))];

  return (
    <div>
      <AdminHeader
        title="History"
        subtitle="Last 10 changes per item, across all collections."
      />
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

function actionColor(action: string): "neutral" | "amber" | "danger" | "success" {
  switch (action) {
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
