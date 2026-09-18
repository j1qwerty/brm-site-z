"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ListChecks, ChatCircleText, Clock, Gear } from "@phosphor-icons/react/dist/ssr";
import { AdminHeader, AdminCard, AdminLoading, AdminButton } from "../admin-ui";
import { loadContactMessages, loadInquiries, loadDeletedItems } from "@/lib/cms";
import { isFirebaseConfigured } from "@/lib/firebase";
import type { AdminPage } from "../admin-shell";

export function AdminDashboard({ onNavigate }: { onNavigate: (p: AdminPage) => void }) {
  // Lazy init: counts are already final (all zero) when Firebase is not configured,
  // otherwise null until the data loads.
  const [counts, setCounts] = useState<{ inquiries: number; contacts: number; trash: number; unread: number } | null>(
    () => (isFirebaseConfigured() ? null : { inquiries: 0, contacts: 0, trash: 0, unread: 0 })
  );

  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    let cancelled = false;
    Promise.all([loadInquiries(), loadContactMessages(), loadDeletedItems()])
      .then(([inq, contacts, trash]) => {
        if (cancelled) return;
        const unread = inq.filter((i: any) => !i.read).length + contacts.filter((c: any) => !c.read).length;
        setCounts({
          inquiries: inq.length,
          contacts: contacts.length,
          trash: trash.length,
          unread,
        });
      })
      .catch(() => { if (!cancelled) setCounts({ inquiries: 0, contacts: 0, trash: 0, unread: 0 }); });
    return () => { cancelled = true; };
  }, []);

  if (!counts) return <AdminLoading label="Loading dashboard..." />;

  const cards = [
    { label: "Unread messages", value: counts.unread, hint: "Across inquiries + contacts", onClick: () => onNavigate("inquiries"), Icon: ListChecks },
    { label: "Inquiries", value: counts.inquiries, hint: "All-time received", onClick: () => onNavigate("inquiries"), Icon: ListChecks },
    { label: "Contact messages", value: counts.contacts, hint: "All-time received", onClick: () => onNavigate("contacts"), Icon: ChatCircleText },
    { label: "In trash", value: counts.trash, hint: "Soft-deleted items, restorable", onClick: () => onNavigate("trash"), Icon: Clock },
  ];

  return (
    <div>
      <AdminHeader
        title="Dashboard"
        subtitle="Counts of everything happening across the site right now."
        action={<AdminButton variant="secondary" onClick={() => onNavigate("settings")}><Gear size={14} /> Settings</AdminButton>}
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, hint, onClick, Icon }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            className="rounded-2xl border border-border bg-card p-5 text-left hover:border-amber/60 transition-colors group"
          >
            <div className="flex items-center justify-between mb-3">
              <Icon size={20} className="text-amber" />
              <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-3xl font-bold tracking-tighter text-brand">{value}</p>
            <p className="text-sm font-medium mt-1">{label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>
          </button>
        ))}
      </div>

      <AdminCard className="mt-6">
        <h2 className="text-base font-bold tracking-tight mb-3">Quick actions</h2>
        <div className="flex flex-wrap gap-2">
          <AdminButton variant="secondary" size="sm" onClick={() => onNavigate("content")}>Edit site content</AdminButton>
          <AdminButton variant="secondary" size="sm" onClick={() => onNavigate("events")}>Add an event</AdminButton>
          <AdminButton variant="secondary" size="sm" onClick={() => onNavigate("gallery")}>Add gallery image</AdminButton>
          <AdminButton variant="secondary" size="sm" onClick={() => onNavigate("videos")}>Add a video</AdminButton>
          <AdminButton variant="secondary" size="sm" onClick={() => onNavigate("faqs")}>Add a FAQ</AdminButton>
        </div>
      </AdminCard>

      <AdminCard className="mt-6">
        <h2 className="text-base font-bold tracking-tight mb-2">How the CMS works</h2>
        <ul className="text-sm text-muted-foreground leading-relaxed space-y-1.5">
          <li>Public site renders with hardcoded defaults first, then layers in any published overrides from Firestore.</li>
          <li>Drafts only appear here in the admin panel. Site visitors never see drafts.</li>
          <li>Publishing a draft copies it to the live field. History records every change, last 10 per item.</li>
          <li>Delete is soft. Items move to Trash and stay there until auto-purged (see Settings) or restored.</li>
        </ul>
      </AdminCard>
    </div>
  );
}
