"use client";

import { useState } from "react";
import { Plus, Trash, PencilSimple, X, FloppyDisk } from "@phosphor-icons/react/dist/ssr";
import { AdminHeader, AdminCard, AdminEmptyState, AdminButton, AdminInput, AdminField } from "../admin-ui";
import { HistoryPanel } from "../history-panel";
import { addItem, updateItem, softDeleteItem, isFirebaseConfigured } from "@/lib/cms";
import { useCMS } from "@/lib/cms-context";
import type { GalleryItem } from "@/lib/cms-types";

const CATEGORIES = ["Studio", "Athletics", "Forest", "Field trips", "Performance", "Events"];

const EMPTY: Omit<GalleryItem, "id" | "deleted"> = {
  src: "",
  alt: "",
  caption: "",
  category: "Studio",
};

export function AdminGallery() {
  const { gallery } = useCMS();
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<Omit<GalleryItem, "id" | "deleted">>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const startAdd = () => { setForm(EMPTY); setEditing(null); setAdding(true); };
  const startEdit = (g: GalleryItem) => { setForm({ ...g }); setEditing(g); setAdding(false); };
  const cancel = () => { setEditing(null); setAdding(false); setErr(null); };

  const handleSave = async () => {
    setSaving(true); setErr(null);
    try {
      if (editing) await updateItem<GalleryItem>(editing.id, form);
      else await addItem<"gallery">("gallery", form);
      cancel();
    } catch (e: any) { setErr(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <AdminHeader
        title="Gallery"
        subtitle={`${gallery.length} images live on the gallery page.`}
        action={<AdminButton onClick={startAdd} disabled={!isFirebaseConfigured()}><Plus size={14} /> Add image</AdminButton>}
      />
      {adding || editing ? (
        <AdminCard className="mb-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold tracking-tight">{editing ? "Edit image" : "New image"}</h2>
            <button onClick={cancel} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <AdminField label="Image URL">
              <AdminInput value={form.src} onChange={(e) => setForm({ ...form, src: e.target.value })} placeholder="https://..." />
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
            <AdminField label="Caption">
              <AdminInput value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} />
            </AdminField>
            <AdminField label="Alt text (for screen readers)">
              <AdminInput value={form.alt} onChange={(e) => setForm({ ...form, alt: e.target.value })} />
            </AdminField>
          </div>
          {form.src && (
            <div className="mt-4">
              <p className="text-xs uppercase tracking-[0.14em] font-mono text-muted-foreground mb-2">Preview</p>
              <img src={form.src} alt={form.alt} className="w-full max-w-sm rounded-lg" />
            </div>
          )}
          {err && <p className="text-sm text-destructive mt-3">{err}</p>}
          <div className="flex gap-2 mt-4">
            <AdminButton onClick={handleSave} disabled={saving}><FloppyDisk size={14} /> Save</AdminButton>
            <AdminButton variant="ghost" onClick={cancel}>Cancel</AdminButton>
          </div>
        </AdminCard>
      ) : null}

      {gallery.length === 0 && !adding ? (
        <AdminEmptyState
          title="No gallery images yet"
          body="Add your first image by URL. It will appear in the gallery on the home page and gallery page."
          action={<AdminButton onClick={startAdd}><Plus size={14} /> Add image</AdminButton>}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {gallery.map((g) => (
            <div key={g.id} className="rounded-xl overflow-hidden border border-border bg-card group relative">
              <img src={g.src} alt={g.alt} className="w-full aspect-square object-cover" />
              <div className="p-3">
                <p className="text-xs text-muted-foreground">{g.category}</p>
                <p className="text-sm font-medium truncate">{g.caption}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => startEdit(g)} className="p-1.5 rounded bg-background/90 hover:bg-background"><PencilSimple size={14} /></button>
                <button
                  onClick={() => { if (confirm("Soft-delete this image? It can be restored from Trash.")) softDeleteItem(g.id); }}
                  className="p-1.5 rounded bg-background/90 hover:bg-background text-destructive"
                >
                  <Trash size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <HistoryPanel collection="cms_items" kind="gallery" title="Gallery changes" />
    </div>
  );
}
