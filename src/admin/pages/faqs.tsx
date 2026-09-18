"use client";

import { useState } from "react";
import { Plus, Trash, PencilSimple, X, FloppyDisk } from "@phosphor-icons/react/dist/ssr";
import { AdminHeader, AdminCard, AdminEmptyState, AdminButton, AdminInput, AdminTextarea, AdminField } from "../admin-ui";
import { addItem, updateItem, softDeleteItem, isFirebaseConfigured } from "@/lib/cms";
import { useCMS } from "@/lib/cms-context";
import type { FAQItem } from "@/lib/cms-types";

const PAGES = ["home", "about", "academics", "admissions", "events", "gallery", "contact", "inquiry"];

const EMPTY: Omit<FAQItem, "id" | "deleted"> = {
  page: "admissions",
  question: "",
  answer: "",
  order: 0,
};

export function AdminFAQs() {
  const { faqs } = useCMS();
  const [editing, setEditing] = useState<FAQItem | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<Omit<FAQItem, "id" | "deleted">>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const startAdd = () => { setForm(EMPTY); setEditing(null); setAdding(true); };
  const startEdit = (f: FAQItem) => { setForm({ ...f }); setEditing(f); setAdding(false); };
  const cancel = () => { setEditing(null); setAdding(false); setErr(null); };

  const handleSave = async () => {
    setSaving(true); setErr(null);
    try {
      if (editing) await updateItem<FAQItem>(editing.id, form);
      else await addItem<"faq">("faq", form);
      cancel();
    } catch (e: any) { setErr(e.message); }
    finally { setSaving(false); }
  };

  // Group FAQs by page for display
  const byPage = faqs.reduce<Record<string, FAQItem[]>>((acc, f) => {
    (acc[f.page] ||= []).push(f);
    return acc;
  }, {});

  return (
    <div>
      <AdminHeader
        title="FAQs"
        subtitle={`${faqs.length} FAQs across ${Object.keys(byPage).length} pages.`}
        action={<AdminButton onClick={startAdd} disabled={!isFirebaseConfigured()}><Plus size={14} /> Add FAQ</AdminButton>}
      />
      {adding || editing ? (
        <AdminCard className="mb-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold tracking-tight">{editing ? "Edit FAQ" : "New FAQ"}</h2>
            <button onClick={cancel} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <AdminField label="Page" hint="Which page should this FAQ appear on?">
              <select
                value={form.page}
                onChange={(e) => setForm({ ...form, page: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm"
              >
                {PAGES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </AdminField>
            <AdminField label="Order (lower shows first)">
              <AdminInput type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
            </AdminField>
          </div>
          <div className="mt-4">
            <AdminField label="Question">
              <AdminInput value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
            </AdminField>
          </div>
          <div className="mt-4">
            <AdminField label="Answer">
              <AdminTextarea rows={4} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} />
            </AdminField>
          </div>
          {err && <p className="text-sm text-destructive mt-3">{err}</p>}
          <div className="flex gap-2 mt-4">
            <AdminButton onClick={handleSave} disabled={saving}><FloppyDisk size={14} /> Save</AdminButton>
            <AdminButton variant="ghost" onClick={cancel}>Cancel</AdminButton>
          </div>
        </AdminCard>
      ) : null}

      {faqs.length === 0 && !adding ? (
        <AdminEmptyState
          title="No FAQs yet"
          body="Add a question + answer and pick which page it should appear on."
          action={<AdminButton onClick={startAdd}><Plus size={14} /> Add FAQ</AdminButton>}
        />
      ) : (
        <div className="space-y-5">
          {Object.entries(byPage).map(([page, list]) => (
            <div key={page}>
              <h3 className="text-sm uppercase tracking-[0.14em] font-mono text-muted-foreground mb-2">
                {page}
              </h3>
              <ul className="space-y-2">
                {list.map((f) => (
                  <li key={f.id} className="rounded-xl border border-border bg-card p-4 group">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-medium tracking-tight">{f.question}</p>
                        <p className="text-sm text-muted-foreground mt-1">{f.answer}</p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => startEdit(f)} className="p-2 rounded hover:bg-muted"><PencilSimple size={14} /></button>
                        <button
                          onClick={() => { if (confirm("Soft-delete this FAQ? It can be restored from Trash.")) softDeleteItem(f.id); }}
                          className="p-2 rounded hover:bg-muted text-destructive"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
