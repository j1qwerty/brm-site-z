"use client";

import { useEffect, useState } from "react";
import { FloppyDisk, ArrowFatUp, ArrowClockwise, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import {
  AdminHeader,
  AdminCard,
  AdminButton,
  AdminLoading,
  AdminEmptyState,
  AdminInput,
  AdminTextarea,
  AdminLabel,
  AdminField,
} from "../admin-ui";
import { loadSectionForEditor, saveSectionDraft, publishSection, revertDraft, isFirebaseConfigured } from "@/lib/cms";
import { SECTIONS, getDefaultsFor } from "@/lib/cms-defaults";
import type { SectionId } from "@/lib/cms-types";

/*
  CMS Content Editor
  ==================
  - Pick a section from the sidebar (grouped by page).
  - On load, fetch live + draft from Firestore.
  - If draft exists in Firestore, edit the draft. Otherwise, edit defaults as
    the starting draft.
  - Save Draft: write draft to Firestore (no site change).
  - Publish: copy draft to live (site updates immediately).
  - Revert Draft: discard the draft, reset to live values.
*/

export function AdminContent() {
  const [selected, setSelected] = useState<SectionId | null>(null);
  const [liveValues, setLiveValues] = useState<Record<string, unknown> | null>(null);
  const [draftValues, setDraftValues] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "published" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    setStatus("idle");
    setErrorMsg(null);
    loadSectionForEditor(selected)
      .then((data) => {
        if (!data || (!data.live && !data.draft)) {
          // First edit - start with hardcoded defaults
          const defaults = getDefaultsFor(selected);
          setLiveValues(null);
          setDraftValues(defaults);
        } else {
          setLiveValues(data.live);
          setDraftValues(data.draft ?? data.live ?? {});
        }
      })
      .catch((e) => {
        console.error(e);
        setErrorMsg("Could not load section from Firestore.");
      })
      .finally(() => setLoading(false));
  }, [selected]);

  const handleFieldChange = (field: string, value: string) => {
    setDraftValues((prev) => ({ ...(prev ?? {}), [field]: value }));
    setStatus("idle");
  };

  const handleSaveDraft = async () => {
    if (!selected || !draftValues) return;
    setSaving(true);
    setErrorMsg(null);
    try {
      await saveSectionDraft(selected, draftValues);
      setStatus("saved");
    } catch (e: any) {
      setErrorMsg(e.message || "Could not save draft.");
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!selected || !draftValues) return;
    setSaving(true);
    setErrorMsg(null);
    try {
      await publishSection(selected, draftValues);
      setStatus("published");
      // Update liveValues to match
      setLiveValues(draftValues);
    } catch (e: any) {
      setErrorMsg(e.message || "Could not publish.");
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const handleRevertDraft = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await revertDraft(selected);
      // Reload
      const data = await loadSectionForEditor(selected);
      setLiveValues(data?.live ?? null);
      setDraftValues(data?.draft ?? data?.live ?? getDefaultsFor(selected));
      setStatus("idle");
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setSaving(false);
    }
  };

  const firebaseReady = isFirebaseConfigured();

  return (
    <div>
      <AdminHeader
        title="Content (CMS)"
        subtitle="Edit text, blurbs, and image URLs for any section on any page. Save a draft, publish to make it live."
      />
      {!firebaseReady && (
        <div className="mb-4 rounded-md border border-amber/40 bg-amber/10 p-4 text-sm">
          Firebase is not configured. You can browse sections and edit fields
          but you cannot save or publish. Add keys to <code className="font-mono bg-muted px-1 py-0.5 rounded">.env.local</code> first.
        </div>
      )}
      <div className="grid lg:grid-cols-[15rem_1fr] gap-4">
        <aside className="rounded-2xl border border-border bg-card p-3 max-h-[70vh] overflow-y-auto">
          {SECTIONS.map((group) => (
            <div key={group.page} className="mb-4">
              <p className="px-2 py-1 text-xs uppercase tracking-[0.12em] font-mono text-muted-foreground">
                {group.page}
              </p>
              <ul className="space-y-0.5">
                {group.sections.map((sec) => (
                  <li key={sec.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(sec.id)}
                      className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${
                        selected === sec.id ? "bg-brand text-brand-foreground" : "hover:bg-muted"
                      }`}
                    >
                      {sec.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        <div>
          {!selected ? (
            <AdminEmptyState
              title="Pick a section to edit"
              body="Sections are grouped by page. Shared sections (footer, contact info, nav) appear once and apply across all pages where they are used."
            />
          ) : loading ? (
            <AdminLoading label="Loading section..." />
          ) : !draftValues ? (
            <AdminEmptyState title="No content loaded" />
          ) : (
            <AdminCard>
              <div className="flex items-start justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-lg font-bold tracking-tight">{selected}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {liveValues
                      ? "Editing draft. Publish to make live on site."
                      : "First edit. Default values are loaded as your starting draft."}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <AdminButton variant="ghost" size="sm" onClick={handleRevertDraft} disabled={saving || !liveValues}>
                    <ArrowClockwise size={14} /> Revert draft
                  </AdminButton>
                  <AdminButton variant="secondary" size="sm" onClick={handleSaveDraft} disabled={saving || !firebaseReady}>
                    <FloppyDisk size={14} /> Save draft
                  </AdminButton>
                  <AdminButton variant="primary" size="sm" onClick={handlePublish} disabled={saving || !firebaseReady}>
                    <ArrowFatUp size={14} /> Publish
                  </AdminButton>
                </div>
              </div>

              {status === "saved" && <p className="text-sm text-green-700 dark:text-green-400 mb-3">Draft saved.</p>}
              {status === "published" && <p className="text-sm text-green-700 dark:text-green-400 mb-3">Published to live site. Visitors will see the change on next load.</p>}
              {status === "error" && errorMsg && <p className="text-sm text-destructive mb-3">{errorMsg}</p>}

              <div className="space-y-4">
                {Object.entries(draftValues).map(([field, value]) => (
                  <AdminField
                    key={field}
                    label={field}
                    hint={
                      liveValues && liveValues[field] !== value
                        ? "Draft differs from live value"
                        : undefined
                    }
                  >
                    {typeof value === "string" && value.length > 80 ? (
                      <AdminTextarea
                        rows={4}
                        value={value}
                        onChange={(e) => handleFieldChange(field, e.target.value)}
                      />
                    ) : (
                      <AdminInput
                        type="text"
                        value={String(value ?? "")}
                        onChange={(e) => handleFieldChange(field, e.target.value)}
                      />
                    )}
                  </AdminField>
                ))}
              </div>

              {liveValues && (
                <div className="mt-6 pt-5 border-t border-border">
                  <p className="text-xs uppercase tracking-[0.14em] font-mono text-muted-foreground mb-2">
                    Currently live on site
                  </p>
                  <pre className="text-xs bg-muted rounded-md p-3 overflow-x-auto max-h-40">
                    {JSON.stringify(liveValues, null, 2)}
                  </pre>
                </div>
              )}
            </AdminCard>
          )}
        </div>
      </div>
    </div>
  );
}
