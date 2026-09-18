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
import { loadInquiries, softDeleteMessage, markMessageRead } from "@/lib/cms";
import { isFirebaseConfigured } from "@/lib/firebase";

type Inquiry = {
  id: string;
  parentName: string;
  email: string;
  phone: string;
  studentName: string;
  currentGrade: string;
  entryGrade: string;
  entryYear: string;
  interests: string[];
  howHeard: string;
  message: string;
  createdAt: { toMillis?: () => number } | null;
  read?: boolean;
};

export function AdminInquiries() {
  const [items, setItems] = useState<Inquiry[] | null>(() => (isFirebaseConfigured() ? null : []));
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured()) return; // lazy init already set []
    let cancelled = false;
    loadInquiries<Inquiry>()
      .then((data) => { if (!cancelled) setItems(data); })
      .catch((e) => {
        if (cancelled) return;
        setItems([]);
        setLoadError(
          e?.code === "permission-denied"
            ? "Firestore denied access. Sign in with Google (password login has no database access), then reopen this page."
            : "Could not load inquiries from Firestore.",
        );
      });
    return () => { cancelled = true; };
  }, []);

  if (!items) return <AdminLoading label="Loading inquiries..." />;

  return (
    <div>
      <AdminHeader title="Inquiries" subtitle={`${items.length} received from the inquiry form.`} />
      {loadError && (
        <div className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm">
          {loadError}
        </div>
      )}
      {items.length === 0 ? (
        <AdminEmptyState
          title="No inquiries yet"
          body="When parents submit the inquiry form, the submissions appear here."
        />
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          <ul className="space-y-2">
            {items.map((i) => (
              <li key={i.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(i);
                    if (!i.read) {
                      markMessageRead("inquiries", i.id).catch(() => {});
                    }
                  }}
                  className={`w-full text-left rounded-xl border p-4 hover:border-amber/60 transition-colors ${
                    selected?.id === i.id ? "border-amber bg-amber/5" : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <p className="font-medium text-foreground">
                      {i.parentName} {i.studentName && <span className="text-muted-foreground text-sm">/ {i.studentName}</span>}
                    </p>
                    {!i.read && <AdminBadge color="amber">New</AdminBadge>}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Applying to {i.entryGrade} ({i.entryYear}) · {i.email}
                  </p>
                </button>
              </li>
            ))}
          </ul>

          {selected ? (
            <AdminCard className="self-start">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg font-bold tracking-tight">{selected.parentName}</h2>
                  <p className="text-sm text-muted-foreground">{selected.email}</p>
                </div>
                <AdminButton variant="danger" size="sm" onClick={() => {
                  softDeleteMessage("inquiries", selected.id).then(() => {
                    setItems((prev) => prev?.filter((x) => x.id !== selected.id) ?? null);
                    setSelected(null);
                  });
                }}>
                  <Trash size={14} /> Delete
                </AdminButton>
              </div>
              <dl className="space-y-3 text-sm">
                {selected.studentName && <Field label="Student" value={selected.studentName} />}
                {selected.phone && <Field label="Phone" value={selected.phone} />}
                <Field label="Current grade" value={selected.currentGrade} />
                <Field label="Applying to" value={selected.entryGrade} />
                <Field label="Entry year" value={selected.entryYear} />
                {selected.interests?.length > 0 && (
                  <Field label="Interests" value={selected.interests.join(", ")} />
                )}
                {selected.howHeard && <Field label="How heard" value={selected.howHeard} />}
                {selected.message && <Field label="Message" value={selected.message} />}
                {selected.createdAt && (
                  <Field label="Received" value={new Date(selected.createdAt.toMillis?.() ?? 0).toLocaleString()} />
                )}
              </dl>
              <div className="mt-5 pt-4 border-t border-border">
                <a
                  href={`mailto:${selected.email}?subject=RE: Your inquiry to BRM International School`}
                  className="inline-flex items-center gap-1.5 text-sm text-brand hover:text-amber"
                >
                  Reply by email <ArrowRight size={14} />
                </a>
              </div>
            </AdminCard>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center text-sm text-muted-foreground">
              Select an inquiry to see details.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[8rem_1fr] gap-3">
      <dt className="text-xs font-mono uppercase tracking-[0.12em] text-muted-foreground pt-0.5">{label}</dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}
