"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { getDb, isFirebaseConfigured } from "@/lib/firebase";
import { useFirebaseUser } from "@/lib/use-firebase-user";

/*
  Live unread counters for the admin sidebar.
  Subscribes to `inquiries` + `contact_messages` and counts docs that are
  neither read nor soft-deleted. Realtime: a new form submission bumps the
  badge instantly. Returns null per collection when unknown (Firebase not
  configured, or signed in with the local password which has no DB access).
*/

export type UnreadCounts = {
  inquiries: number | null;
  contacts: number | null;
};

function countUnread(snap: { forEach: (cb: (d: { data: () => unknown }) => void) => void }): number {
  let n = 0;
  snap.forEach((d) => {
    const data = d.data() as { read?: boolean; deleted?: boolean };
    if (data.deleted !== true && data.read !== true) n++;
  });
  return n;
}

export function useUnreadCounts(enabled: boolean): UnreadCounts {
  const [counts, setCounts] = useState<UnreadCounts>({ inquiries: null, contacts: null });
  // Only subscribe once Firebase Auth has resolved AND a Google user exists.
  // Subscribing earlier (page refresh) gets permission-denied and kills the
  // listener, so the badge would stay empty until the next login.
  const { user, loading: authLoading } = useFirebaseUser();

  useEffect(() => {
    if (!enabled || authLoading || !user || !isFirebaseConfigured()) return;
    const db = getDb();
    if (!db) return;

    const unsubInquiries = onSnapshot(
      collection(db, "inquiries"),
      (snap) => setCounts((prev) => ({ ...prev, inquiries: countUnread(snap) })),
      () => setCounts((prev) => ({ ...prev, inquiries: null })),
    );
    const unsubContacts = onSnapshot(
      collection(db, "contact_messages"),
      (snap) => setCounts((prev) => ({ ...prev, contacts: countUnread(snap) })),
      () => setCounts((prev) => ({ ...prev, contacts: null })),
    );
    return () => {
      unsubInquiries();
      unsubContacts();
    };
  }, [enabled, authLoading, user]);

  return counts;
}
