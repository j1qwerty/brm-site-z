"use client";

import { useEffect, useState } from "react";
import { Trash, ArrowUUpLeft } from "@phosphor-icons/react/dist/ssr";
import { AdminHeader, AdminLoading, AdminEmptyState, AdminCard, AdminButton, AdminBadge } from "../admin-ui";
import { loadDeletedItems, restoreItem, permanentlyDeleteItem, isFirebaseConfigured } from "@/lib/cms";
import { useCMS } from "@/lib/cms-context";

type TrashItem = {
  id: string;
  kind: string;
  data: { title?: string; question?: string; src?: string; externalUrl?: string; [k: string]: unknown };
  deletedAt: { toMillis?: () => number } | null;
};

export function AdminTrash() {
  const { settings } = useCMS();
  const [items, setItems] = useState<TrashItem[] | null>(null);

  const reload = () => {
    if (!isFirebaseConfigured()) {
      setItems([]);
      return;
    }
    loadDeletedItems<TrashItem>()
      .then((data) => setItems(data))
      .catch(() => setItems([]));
  };

  useEffect(() => {
    reload();
  }, []);

  const autoDeleteDays = settings?.autoDeleteDays ?? 30;

  if (!items) return <AdminLoading label="Loading trash..." />;

  return (
    <div>
      <AdminHeader
        title="Trash"
        subtitle={`Soft-deleted items restorable here. Items auto-purged after ${autoDeleteDays} days (see Settings).`}
        action={<AdminButton variant="secondary" onClick={reload}>Refresh</AdminButton>}
      />
      {items.length === 0 ? (
        <AdminEmptyState title="Trash is empty" body="Soft-deleted items will appear here until restored or auto-purged." />
      ) : (
        <AdminCard>
          <ul className="divide-y divide-border">
            {items.map((it) => {
              const title =
                (it.data.title as string) ||
                (it.data.question as string) ||
                (it.data.src as string) ||
                (it.data.externalUrl as string) ||
                "Untitled";
              const deletedMs = it.deletedAt?.toMillis?.() ?? 0;
              const ageDays = deletedMs ? Math.floor((Date.now() - deletedMs) / (1000 * 60 * 60 * 24)) : 0;
              const daysUntilPurge = autoDeleteDays - ageDays;
              return (
                <li key={it.id} className="py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <AdminBadge color="amber">{it.kind}</AdminBadge>
                        {daysUntilPurge <= 7 && <AdminBadge color="danger">Purges in {Math.max(0, daysUntilPurge)} days</AdminBadge>}
                      </div>
                      <p className="text-sm font-medium truncate">{title}</p>
                      {it.deletedAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Deleted {new Date(deletedMs).toLocaleString()} · {ageDays} days ago
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <AdminButton variant="secondary" size="sm" onClick={() => { restoreItem(it.id).then(reload); }}>
                        <ArrowUUpLeft size={14} /> Restore
                      </AdminButton>
                      <AdminButton
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          if (confirm("Permanently delete this item? This cannot be undone.")) {
                            permanentlyDeleteItem(it.id).then(reload);
                          }
                        }}
                      >
                        <Trash size={14} /> Delete forever
                      </AdminButton>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </AdminCard>
      )}
    </div>
  );
}
