"use client";

import { useEffect, useState } from "react";
import { FloppyDisk } from "@phosphor-icons/react/dist/ssr";
import { AdminHeader, AdminCard, AdminButton, AdminInput, AdminField } from "../admin-ui";
import { saveSettings, isFirebaseConfigured } from "@/lib/cms";
import { useCMS } from "@/lib/cms-context";
import type { CMSSettings } from "@/lib/cms-types";

const DEFAULTS: CMSSettings = {
  autoDeleteDays: 30,
  siteName: "BRM International School",
  contactEmail: "hello@brm-international.org",
  contactPhone: "(503) 555-0140",
  address: "242 Linden Ridge Road, Willowbrook, OR 97XXX",
  socialInstagram: "https://instagram.com",
  socialYoutube: "https://youtube.com",
  socialFacebook: "https://facebook.com",
  socialX: "https://x.com",
  socialLinkedin: "https://linkedin.com",
};

export function AdminSettings() {
  const { settings } = useCMS();
  const [form, setForm] = useState<CMSSettings>(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) setForm({ ...DEFAULTS, ...settings });
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSettings(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      alert("Could not save: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Settings"
        subtitle="Site-wide settings. These apply across every page and view."
      />
      {!isFirebaseConfigured() && (
        <div className="mb-4 rounded-md border border-amber/40 bg-amber/10 p-3 text-sm">
          Firebase is not configured. Settings cannot be saved.
        </div>
      )}
      <div className="space-y-5">
        <AdminCard>
          <h2 className="text-base font-bold tracking-tight mb-4">Auto-deletion</h2>
          <AdminField
            label="Auto-delete soft-deleted items after (days)"
            hint="Items in the Trash are permanently purged after this many days. Set to 0 to disable auto-purge."
          >
            <AdminInput
              type="number"
              min={0}
              max={365}
              value={form.autoDeleteDays}
              onChange={(e) => setForm({ ...form, autoDeleteDays: Number(e.target.value) })}
            />
          </AdminField>
        </AdminCard>

        <AdminCard>
          <h2 className="text-base font-bold tracking-tight mb-4">Contact information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <AdminField label="Site name">
              <AdminInput value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })} />
            </AdminField>
            <AdminField label="Contact email">
              <AdminInput value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
            </AdminField>
            <AdminField label="Contact phone">
              <AdminInput value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
            </AdminField>
            <AdminField label="Address">
              <AdminInput value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </AdminField>
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="text-base font-bold tracking-tight mb-4">Social media links</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <AdminField label="Instagram">
              <AdminInput value={form.socialInstagram || ""} onChange={(e) => setForm({ ...form, socialInstagram: e.target.value })} />
            </AdminField>
            <AdminField label="YouTube">
              <AdminInput value={form.socialYoutube || ""} onChange={(e) => setForm({ ...form, socialYoutube: e.target.value })} />
            </AdminField>
            <AdminField label="Facebook">
              <AdminInput value={form.socialFacebook || ""} onChange={(e) => setForm({ ...form, socialFacebook: e.target.value })} />
            </AdminField>
            <AdminField label="X (Twitter)">
              <AdminInput value={form.socialX || ""} onChange={(e) => setForm({ ...form, socialX: e.target.value })} />
            </AdminField>
            <AdminField label="LinkedIn">
              <AdminInput value={form.socialLinkedin || ""} onChange={(e) => setForm({ ...form, socialLinkedin: e.target.value })} />
            </AdminField>
          </div>
        </AdminCard>

        <div className="flex items-center gap-3">
          <AdminButton onClick={handleSave} disabled={saving || !isFirebaseConfigured()}>
            <FloppyDisk size={14} /> Save settings
          </AdminButton>
          {saved && <span className="text-sm text-green-700 dark:text-green-400">Settings saved.</span>}
        </div>
      </div>
    </div>
  );
}
