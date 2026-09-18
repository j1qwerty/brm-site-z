"use client";

import { useEffect, useState } from "react";
import { Plus, Trash, PencilSimple, X, FloppyDisk } from "@phosphor-icons/react/dist/ssr";
import { AdminHeader, AdminCard, AdminLoading, AdminEmptyState, AdminButton, AdminInput, AdminTextarea, AdminLabel, AdminField, AdminBadge } from "../admin-ui";
import { HistoryPanel } from "../history-panel";
import { addItem, updateItem, softDeleteItem, isFirebaseConfigured } from "@/lib/cms";
import { useCMS } from "@/lib/cms-context";
import type { EventItem } from "@/lib/cms-types";

const CATEGORIES = ["Academic", "Athletics", "Cultural", "Community", "Open house", "Performance"];

const EMPTY: Omit<EventItem, "id" | "deleted"> = {
  title: "",
  date: new Date().toISOString().slice(0, 10),
  time: "",
  location: "",
  description: "",
  imageSrc: "",
  category: "Academic",
};

export function AdminEvents() {
  const { events, usingFallback } = useCMS();
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<Omit<EventItem, "id" | "deleted">>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const startAdd = () => {
    setForm(EMPTY);
    setEditing(null);
    setAdding(true);
  };
  const startEdit = (e: EventItem) => {
    setForm({ ...e });
    setEditing(e);
    setAdding(false);
  };
  const cancel = () => {
    setEditing(null);
    setAdding(false);
    setErr(null);
  };
  const handleSave = async () => {
    setSaving(true);
    setErr(null);
    try {
      if (editing) {
        await updateItem<EventItem>(editing.id, form);
      } else {
        await addItem<"event">("event", form);
      }
      cancel();
    } catch (e: any) {
      setErr(e.message || "Could not save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Events"
        subtitle={`${events.length} events live on the site.`}
        action={<AdminButton onClick={startAdd} disabled={!isFirebaseConfigured()}><Plus size={14} /> Add event</AdminButton>}
      />
      {usingFallback && (
        <div className="mb-4 rounded-md border border-amber/40 bg-amber/10 p-3 text-sm">
          Firebase is not configured. You can fill out the form but cannot save.
        </div>
      )}
      {adding || editing ? (
        <AdminCard className="mb-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold tracking-tight">
              {editing ? "Edit event" : "New event"}
            </h2>
            <button type="button" onClick={cancel} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <AdminField label="Title">
              <AdminInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </AdminField>
            <AdminField label="Category">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </AdminField>
            <AdminField label="Date">
              <AdminInput type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </AdminField>
            <AdminField label="Time">
              <AdminInput value={form.time || ""} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="9:00 AM - 11:00 AM" />
            </AdminField>
            <AdminField label="Location">
              <AdminInput value={form.location || ""} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </AdminField>
            <AdminField label="Image URL">
              <AdminInput value={form.imageSrc || ""} onChange={(e) => setForm({ ...form, imageSrc: e.target.value })} placeholder="https://..." />
            </AdminField>
          </div>
          <div className="mt-4">
            <AdminField label="Description">
              <AdminTextarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </AdminField>
          </div>
          {err && <p className="text-sm text-destructive mt-3">{err}</p>}
          <div className="flex gap-2 mt-4">
            <AdminButton onClick={handleSave} disabled={saving}><FloppyDisk size={14} /> Save</AdminButton>
            <AdminButton variant="ghost" onClick={cancel}>Cancel</AdminButton>
          </div>
        </AdminCard>
      ) : null}

      {events.length === 0 && !adding ? (
        <AdminEmptyState
          title="No events yet"
          body="Add your first event to see it appear on the home page and the events page."
          action={<AdminButton onClick={startAdd}><Plus size={14} /> Add event</AdminButton>}
        />
      ) : (
        <ul className="grid sm:grid-cols-2 gap-3">
          {events.map((e) => (
            <li key={e.id}>
              <AdminCard>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <AdminBadge color="amber">{e.category}</AdminBadge>
                      <span className="text-xs text-muted-foreground">{e.date}</span>
                    </div>
                    <h3 className="font-bold tracking-tight">{e.title}</h3>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(e)} className="p-2 rounded hover:bg-muted"><PencilSimple size={14} /></button>
                    <button
                      onClick={() => { if (confirm("Soft-delete this event? It can be restored from Trash.")) softDeleteItem(e.id); }}
                      className="p-2 rounded hover:bg-muted text-destructive"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </div>
                {e.location && <p className="text-sm text-muted-foreground">{e.location}{e.time ? ` · ${e.time}` : ""}</p>}
                <p className="text-sm text-foreground mt-1 line-clamp-2">{e.description}</p>
              </AdminCard>
            </li>
          ))}
        </ul>
      )}
      <HistoryPanel collection="cms_items" kind="event" title="Event changes" />
    </div>
  );
}
