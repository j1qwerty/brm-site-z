"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Trash } from "@phosphor-icons/react/dist/ssr";
import {
  AdminHeader,
  AdminCard,
  AdminLoading,
  AdminEmptyState,
  AdminButton,
  AdminBadge,
} from "../admin-ui";
import { loadContactMessages, softDeleteMessage, markMessageRead } from "@/lib/cms";
import { isFirebaseConfigured } from "@/lib/firebase";

type Contact = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: { toMillis?: () => number } | null;
  read?: boolean;
};

export function AdminContacts() {
  const [items, setItems] = useState<Contact[] | null>(() => (isFirebaseConfigured() ? null : []));
  const [selected, setSelected] = useState<Contact | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    let cancelled = false;
    loadContactMessages<Contact>()
      .then((data) => { if (!cancelled) setItems(data); })
      .catch(() => { if (!cancelled) setItems([]); });
    return () => { cancelled = true; };
  }, []);

  if (!items) return <AdminLoading label="Loading contact messages..." />;

  return (
    <div>
      <AdminHeader title="Contact messages" subtitle={`${items.length} received from the contact form.`} />
      {items.length === 0 ? (
        <AdminEmptyState
          title="No messages yet"
          body="When visitors submit the contact form, the submissions appear here."
        />
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          <ul className="space-y-2">
            {items.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(c);
                    if (!c.read) {
                      markMessageRead("contact_messages", c.id).catch(() => {});
                    }
                  }}
                  className={`w-full text-left rounded-xl border p-4 hover:border-amber/60 transition-colors ${
                    selected?.id === c.id ? "border-amber bg-amber/5" : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <p className="font-medium text-foreground">{c.name}</p>
                    {!c.read && <AdminBadge color="amber">New</AdminBadge>}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {c.subject || "(no subject)"} · {c.email}
                  </p>
                </button>
              </li>
            ))}
          </ul>

          {selected ? (
            <AdminCard className="self-start">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg font-bold tracking-tight">{selected.name}</h2>
                  <p className="text-sm text-muted-foreground">{selected.email}</p>
                </div>
                <AdminButton variant="danger" size="sm" onClick={() => {
                  softDeleteMessage("contact_messages", selected.id).then(() => {
                    setItems((prev) => prev?.filter((x) => x.id !== selected.id) ?? null);
                    setSelected(null);
                  });
                }}>
                  <Trash size={14} /> Delete
                </AdminButton>
              </div>
              {selected.subject && (
                <p className="text-sm font-medium mb-2">{selected.subject}</p>
              )}
              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {selected.message}
              </p>
              {selected.createdAt && (
                <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
                  Received {new Date(selected.createdAt.toMillis?.() ?? 0).toLocaleString()}
                </p>
              )}
              <div className="mt-4">
                <a
                  href={`mailto:${selected.email}?subject=RE: ${encodeURIComponent(selected.subject || "Your message to BRM International School")}`}
                  className="inline-flex items-center gap-1.5 text-sm text-brand hover:text-amber"
                >
                  Reply by email <ArrowRight size={14} />
                </a>
              </div>
            </AdminCard>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center text-sm text-muted-foreground">
              Select a message to see details.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
