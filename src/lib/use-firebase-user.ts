"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getAuthClient, isFirebaseConfigured } from "./firebase";

/*
  Tracks Firebase Auth state for the admin panel.
  On page refresh, Firebase restores the Google session asynchronously
  (IndexedDB). Until that resolves, `loading` is true and admin pages must
  NOT touch Firestore - with the tightened rules every read/write without
  auth fails with permission-denied. Gate all admin queries on this hook.
*/

export const GOOGLE_REQUIRED_MSG =
  "Database access needs Google sign-in. The local password opens the panel UI, but Firestore reads and writes require an authenticated Google session.";

export function useFirebaseUser(): { user: User | null; loading: boolean } {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(() => isFirebaseConfigured());

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setLoading(false);
      return;
    }
    const auth = getAuthClient();
    if (!auth) {
      setLoading(false);
      return;
    }
    // Fires immediately with the current user (restored session or null).
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { user, loading };
}
