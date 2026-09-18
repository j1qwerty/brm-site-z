"use client";

import { useEffect, useState } from "react";
import { Plus, Trash, PencilSimple, X, FloppyDisk, PlayCircle } from "@phosphor-icons/react/dist/ssr";
import { AdminHeader, AdminCard, AdminEmptyState, AdminButton, AdminInput, AdminTextarea, AdminField } from "../admin-ui";
import { HistoryPanel, snapshotOf, readHistoryHandoff } from "../history-panel";
import { addItem, updateItem, softDeleteItem, restoreItem, isFirebaseConfigured } from "@/lib/cms";
import { useCMS } from "@/lib/cms-context";
import type { VideoItem } from "@/lib/cms-types";
import type { CMSHistoryEntry } from "@/lib/cms-types";

const EMPTY: Omit<VideoItem, "id" | "deleted"> = {
  externalUrl: "",
  thumbnailUrl: "",
  title: "",
  description: "",
  durationLabel: "",
  source: "YouTube",
};

const SOURCES = ["YouTube", "Vimeo", "Loom", "Other"];

export function AdminVideos() {
  const { videos } = useCMS();
  const [editing, setEditing] = useState<VideoItem | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<Omit<VideoItem, "id" | "deleted">>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const startAdd = () => { setForm(EMPTY); setEditing(null); setAdding(true); };
  const startEdit = (v: VideoItem) => { setForm({ ...v }); setEditing(v); setAdding(false); };
  const cancel = () => { setEditing(null); setAdding(false); setErr(null); };
  // Cross-page jump from global History: open the item for editing.
  useEffect(() => {
    const handoff = readHistoryHandoff();
    if (handoff?.docId) {
      const it = videos.find((v) => v.id === handoff.docId);
      if (it) startEdit(it);
    }
  }, [videos]);
  // Load a history snapshot into the editor: undelete (or recreate) for
  // delete entries, otherwise prefill the edit/add form for review + save.
  const handleRestoreEntry = async (entry: CMSHistoryEntry) => {
    const snap = snapshotOf(entry);
    if (!snap) return;
    if (entry.action === "delete") {
      try {
        await restoreItem(entry.docId);
        return;
      } catch {
        /* item is gone for good - fall through and recreate it below */
      }
    }
    const existing = videos.find((v) => v.id === entry.docId);
    if (existing) {
      startEdit({ ...existing, ...snap.data } as VideoItem);
    } else {
      setForm({ ...EMPTY, ...snap.data } as Omit<VideoItem, "id" | "deleted">);
      setEditing(null);
      setAdding(true);
    }
  };

  const handleSave = async () => {
    setSaving(true); setErr(null);
    try {
      if (editing) await updateItem<VideoItem>(editing.id, form);
      else await addItem<"video">("video", form);
      cancel();
    } catch (e: any) { setErr(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <AdminHeader
        title="Videos"
        subtitle={`${videos.length} videos. All open externally on click.`}
        action={<AdminButton onClick={startAdd} disabled={!isFirebaseConfigured()}><Plus size={14} /> Add video</AdminButton>}
      />
      {adding || editing ? (
        <AdminCard className="mb-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold tracking-tight">{editing ? "Edit video" : "New video"}</h2>
            <button onClick={cancel} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <AdminField label="External video URL" hint="Full URL on the source site, e.g. https://www.youtube.com/watch?v=...">
              <AdminInput value={form.externalUrl} onChange={(e) => setForm({ ...form, externalUrl: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." />
            </AdminField>
            <AdminField label="Source">
              <select
                value={form.source || "YouTube"}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm"
              >
                {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </AdminField>
            <AdminField label="Thumbnail image URL" hint="Preview image shown on the card before click.">
              <AdminInput value={form.thumbnailUrl} onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })} placeholder="https://..." />
            </AdminField>
            <AdminField label="Duration label (optional)">
              <AdminInput value={form.durationLabel || ""} onChange={(e) => setForm({ ...form, durationLabel: e.target.value })} placeholder="3:45" />
            </AdminField>
            <AdminField label="Title">
              <AdminInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </AdminField>
          </div>
          <div className="mt-4">
            <AdminField label="Description">
              <AdminTextarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </AdminField>
          </div>
          {form.thumbnailUrl && (
            <div className="mt-4">
              <p className="text-xs uppercase tracking-[0.14em] font-mono text-muted-foreground mb-2">Card preview</p>
              <div className="relative inline-block rounded-lg overflow-hidden">
                <img src={form.thumbnailUrl} alt={form.title} className="w-72 h-40 object-cover" />
                <div className="absolute inset-0 bg-black/30 grid place-items-center">
                  <PlayCircle size={48} weight="fill" className="text-white" />
                </div>
              </div>
            </div>
          )}
          {err && <p className="text-sm text-destructive mt-3">{err}</p>}
          <div className="flex gap-2 mt-4">
            <AdminButton onClick={handleSave} disabled={saving}><FloppyDisk size={14} /> Save</AdminButton>
            <AdminButton variant="ghost" onClick={cancel}>Cancel</AdminButton>
          </div>
        </AdminCard>
      ) : null}

      {videos.length === 0 && !adding ? (
        <AdminEmptyState
          title="No videos yet"
          body="Add a video by pasting its external URL and a thumbnail. The card will appear on the home page videos section."
          action={<AdminButton onClick={startAdd}><Plus size={14} /> Add video</AdminButton>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {videos.map((v) => (
            <div key={v.id} className="rounded-xl overflow-hidden border border-border bg-card group relative">
              <div className="relative">
                {v.thumbnailUrl ? (
                  <img src={v.thumbnailUrl} alt={v.title} className="w-full aspect-video object-cover" />
                ) : (
                  <div className="w-full aspect-video bg-muted grid place-items-center">
                    <PlayCircle size={36} className="text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 grid place-items-center">
                  <PlayCircle size={48} weight="fill" className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs text-muted-foreground mb-1">{v.source}{v.durationLabel ? ` · ${v.durationLabel}` : ""}</p>
                <h3 className="font-medium tracking-tight mb-1">{v.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{v.description}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => startEdit(v)} className="p-1.5 rounded bg-background/90 hover:bg-background"><PencilSimple size={14} /></button>
                <button
                  onClick={() => { if (confirm("Soft-delete this video? It can be restored from Trash.")) softDeleteItem(v.id); }}
                  className="p-1.5 rounded bg-background/90 hover:bg-background text-destructive"
                >
                  <Trash size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <HistoryPanel collection="cms_items" kind="video" title="Video changes" onRestore={handleRestoreEntry} />
    </div>
  );
}
