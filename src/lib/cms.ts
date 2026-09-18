"use client";

// Firestore write helpers for the admin panel.
// All writes go through these so we can:
// - Record an audit log entry to cms_history
// - Trim history to last 10 entries per (collection, docId)

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  writeBatch,
  Timestamp,
} from "firebase/firestore";
import { getDb, isFirebaseConfigured } from "./firebase";
import type {
  SectionId,
  ItemKind,
  CMSContentDoc,
  CMSHistoryEntry,
  CMSSettings,
} from "./cms-types";

const ADMIN_USER = "admin-session"; // placeholder until real auth is wired

// ---- Section content (text overrides) ----

export async function loadSectionForEditor(sectionId: SectionId | string): Promise<{
  live: Record<string, unknown> | null;
  draft: Record<string, unknown> | null;
} | null> {
  const db = getDb();
  if (!db) return null;
  const ref = doc(db, "cms_content", sectionId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return { live: null, draft: null };
  const data = snap.data() as CMSContentDoc;
  return { live: data.live ?? null, draft: data.draft ?? null };
}

export async function saveSectionDraft(
  sectionId: SectionId | string,
  draft: Record<string, unknown>,
  summary?: string,
): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase not configured");
  const ref = doc(db, "cms_content", sectionId);
  const snap = await getDoc(ref);
  const before = snap.exists() ? (snap.data() as CMSContentDoc) : null;
  const beforeDraft = before?.draft ?? null;

  await setDoc(
    ref,
    {
      sectionId,
      draft,
      draftUpdatedAt: serverTimestamp(),
      draftUpdatedBy: ADMIN_USER,
      live: before?.live ?? null,
      liveUpdatedAt: before?.liveUpdatedAt ?? null,
      liveUpdatedBy: before?.liveUpdatedBy ?? null,
    },
    { merge: true }
  );

  await recordHistory({
    collection: "cms_content",
    docId: sectionId,
    sectionId,
    action: "edit",
    before: beforeDraft,
    after: draft,
    summary: summary ?? `Draft saved for ${sectionId}`,
  });
}

export async function publishSection(
  sectionId: SectionId | string,
  draft: Record<string, unknown>,
  summary?: string,
): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase not configured");
  const ref = doc(db, "cms_content", sectionId);
  const snap = await getDoc(ref);
  const before = snap.exists() ? (snap.data() as CMSContentDoc) : null;
  const beforeLive = before?.live ?? null;

  await setDoc(
    ref,
    {
      sectionId,
      live: draft,
      liveUpdatedAt: serverTimestamp(),
      liveUpdatedBy: ADMIN_USER,
      draft: draft, // sync draft to live on publish
      draftUpdatedAt: serverTimestamp(),
      draftUpdatedBy: ADMIN_USER,
    },
    { merge: true }
  );

  await recordHistory({
    collection: "cms_content",
    docId: sectionId,
    sectionId,
    action: "publish",
    before: beforeLive,
    after: draft,
    summary: summary ?? `Published ${sectionId}`,
  });
}

export async function revertDraft(sectionId: SectionId | string): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase not configured");
  const ref = doc(db, "cms_content", sectionId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data() as CMSContentDoc;
  // Reset draft to whatever live currently is
  await updateDoc(ref, {
    draft: data.live ?? null,
    draftUpdatedAt: serverTimestamp(),
    draftUpdatedBy: ADMIN_USER,
  });
  await recordHistory({
    collection: "cms_content",
    docId: sectionId,
    sectionId,
    action: "edit",
    before: data.draft,
    after: data.live,
    summary: `Reverted draft for ${sectionId} to live`,
  });
}

// ---- List items (gallery, video, event, faq, news) ----

export async function addItem<T extends Record<string, unknown>>(
  kind: ItemKind,
  data: T,
  summary?: string,
): Promise<string> {
  const db = getDb();
  if (!db) throw new Error("Firebase not configured");
  const ref = await addDoc(collection(db, "cms_items"), {
    kind,
    data,
    deleted: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await recordHistory({
    collection: "cms_items",
    docId: ref.id,
    action: "add",
    after: { kind, data },
    summary: summary ?? `Added ${kind} item`,
  });
  return ref.id;
}

export async function updateItem<T extends Record<string, unknown>>(
  itemId: string,
  data: Partial<T>,
  summary?: string,
): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase not configured");
  const ref = doc(db, "cms_items", itemId);
  const snap = await getDoc(ref);
  const before = snap.exists() ? snap.data()?.data : null;
  await updateDoc(ref, {
    data: { ...(snap.data()?.data ?? {}), ...data },
    updatedAt: serverTimestamp(),
  });
  await recordHistory({
    collection: "cms_items",
    docId: itemId,
    action: "edit",
    before,
    after: { ...(snap.data()?.data ?? {}), ...data },
    summary: summary ?? `Updated item ${itemId}`,
  });
}

export async function softDeleteItem(itemId: string, summary?: string): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase not configured");
  const ref = doc(db, "cms_items", itemId);
  const snap = await getDoc(ref);
  const before = snap.exists() ? snap.data() : null;
  await updateDoc(ref, {
    deleted: true,
    deletedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await recordHistory({
    collection: "cms_items",
    docId: itemId,
    action: "delete",
    before,
    after: { deleted: true },
    summary: summary ?? `Soft-deleted item ${itemId}`,
  });
}

export async function restoreItem(itemId: string, summary?: string): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase not configured");
  const ref = doc(db, "cms_items", itemId);
  await updateDoc(ref, {
    deleted: false,
    deletedAt: null,
    updatedAt: serverTimestamp(),
  });
  await recordHistory({
    collection: "cms_items",
    docId: itemId,
    action: "restore",
    after: { deleted: false },
    summary: summary ?? `Restored item ${itemId}`,
  });
}

export async function permanentlyDeleteItem(itemId: string): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase not configured");
  await deleteDoc(doc(db, "cms_items", itemId));
  await recordHistory({
    collection: "cms_items",
    docId: itemId,
    action: "delete",
    after: null,
    summary: `Permanently deleted item ${itemId}`,
  });
}

// ---- Settings ----

export async function loadSettings(): Promise<CMSSettings | null> {
  const db = getDb();
  if (!db) return null;
  const snap = await getDoc(doc(db, "cms_settings", "site"));
  return snap.exists() ? (snap.data() as CMSSettings) : null;
}

export async function saveSettings(
  settings: Partial<CMSSettings>,
  summary?: string,
): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase not configured");
  const ref = doc(db, "cms_settings", "site");
  const snap = await getDoc(ref);
  const before = snap.exists() ? snap.data() : null;
  await setDoc(ref, { ...settings, updatedAt: serverTimestamp() }, { merge: true });
  await recordHistory({
    collection: "cms_settings",
    docId: "site",
    action: "settings",
    before,
    after: settings,
    summary: summary ?? `Updated site settings`,
  });
}

// ---- History ----

export async function recordHistory(entry: Omit<CMSHistoryEntry, "id" | "timestamp">): Promise<void> {
  const db = getDb();
  if (!db) return;
  await addDoc(collection(db, "cms_history"), {
    ...entry,
    timestamp: serverTimestamp(),
    user: entry.user || ADMIN_USER,
  });
  // Trim to last 10 per (collection, docId) - run in background
  trimHistory(entry.collection, entry.docId).catch((e) =>
    console.warn("[CMS] history trim failed:", e)
  );
}

export async function loadHistory(collectionName: string, docId?: string): Promise<CMSHistoryEntry[]> {
  const db = getDb();
  if (!db) return [];
  let q;
  if (docId) {
    q = query(
      collection(db, "cms_history"),
      where("collection", "==", collectionName),
      where("docId", "==", docId),
      orderBy("timestamp", "desc"),
      limit(10)
    );
  } else {
    q = query(
      collection(db, "cms_history"),
      where("collection", "==", collectionName),
      orderBy("timestamp", "desc"),
      limit(50)
    );
  }
  const snap = await getDocs(q);
  const entries: CMSHistoryEntry[] = [];
  snap.forEach((d) => entries.push({ id: d.id, ...(d.data() as Omit<CMSHistoryEntry, "id">) }));
  return entries;
}

async function trimHistory(collectionName: string, docId: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  const q = query(
    collection(db, "cms_history"),
    where("collection", "==", collectionName),
    where("docId", "==", docId),
    orderBy("timestamp", "desc"),
    limit(11) // grab 11, delete from index 10 onward
  );
  const snap = await getDocs(q);
  if (snap.size <= 10) return;
  const docs = snap.docs;
  const batch = writeBatch(db);
  docs.slice(10).forEach((d) => batch.delete(d.ref));
  await batch.commit();
}

// ---- Soft-deleted items list (for admin trash page) ----

export async function loadDeletedItems(): Promise<{ id: string; kind: ItemKind; data: unknown; deletedAt: Timestamp | null }[]> {
  const db = getDb();
  if (!db) return [];
  const q = query(collection(db, "cms_items"), where("deleted", "==", true));
  const snap = await getDocs(q);
  const items: { id: string; kind: ItemKind; data: unknown; deletedAt: Timestamp | null }[] = [];
  snap.forEach((d) => {
    const data = d.data() as { kind: ItemKind; data: unknown; deletedAt: Timestamp | null };
    items.push({ id: d.id, kind: data.kind, data: data.data, deletedAt: data.deletedAt });
  });
  return items;
}

// ---- Contact messages & inquiries (for admin) ----

export async function loadContactMessages(): Promise<{ id: string; name: string; email: string; subject: string; message: string; createdAt: Timestamp | null; read: boolean; deleted?: boolean }[]> {
  const db = getDb();
  if (!db) return [];
  const q = query(collection(db, "contact_messages"), where("deleted", "!=", true));
  const snap = await getDocs(q);
  const items: { id: string; name: string; email: string; subject: string; message: string; createdAt: Timestamp | null; read: boolean; deleted?: boolean }[] = [];
  snap.forEach((d) => {
    const data = d.data() as any;
    items.push({ id: d.id, ...data });
  });
  return items.sort((a, b) => {
    const aT = a.createdAt?.toMillis?.() ?? 0;
    const bT = b.createdAt?.toMillis?.() ?? 0;
    return bT - aT;
  });
}

export async function loadInquiries(): Promise<{ id: string; parentName: string; email: string; phone: string; studentName: string; currentGrade: string; entryGrade: string; entryYear: string; interests: string[]; howHeard: string; message: string; createdAt: Timestamp | null; read?: boolean; deleted?: boolean }[]> {
  const db = getDb();
  if (!db) return [];
  const q = query(collection(db, "inquiries"), where("deleted", "!=", true));
  const snap = await getDocs(q);
  const items: any[] = [];
  snap.forEach((d) => items.push({ id: d.id, ...(d.data() as any) }));
  return items.sort((a, b) => {
    const aT = a.createdAt?.toMillis?.() ?? 0;
    const bT = b.createdAt?.toMillis?.() ?? 0;
    return bT - aT;
  });
}

export async function markMessageRead(collectionName: "contact_messages" | "inquiries", id: string): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase not configured");
  await updateDoc(doc(db, collectionName, id), { read: true });
}

export async function softDeleteMessage(collectionName: "contact_messages" | "inquiries", id: string): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase not configured");
  await updateDoc(doc(db, collectionName, id), { deleted: true, deletedAt: serverTimestamp() });
}

export async function restoreMessage(collectionName: "contact_messages" | "inquiries", id: string): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase not configured");
  await updateDoc(doc(db, collectionName, id), { deleted: false, deletedAt: null });
}

export { isFirebaseConfigured };
