// Firebase client SDK initialization for BRM International School.
// User adds their Firebase keys to .env.local later. Until then, calls gracefully no-op.
//
// Vite build: config comes from `import.meta.env` (VITE_ prefix).
// See .env.example for the variable names.

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import {
  getFirestore,
  type Firestore,
} from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type Auth,
  type User,
} from "firebase/auth";

const viteEnv = import.meta.env as Record<string, string | undefined>;

const firebaseConfig = {
  apiKey: viteEnv.VITE_FIREBASE_API_KEY,
  authDomain: viteEnv.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: viteEnv.VITE_FIREBASE_PROJECT_ID,
  storageBucket: viteEnv.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: viteEnv.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: viteEnv.VITE_FIREBASE_APP_ID,
};

/**
 * Returns true when every Firebase env var is present.
 * Used by the contact / inquiry forms to decide whether to actually
 * write to Firestore or to surface a friendly "configure Firebase first" state.
 */
export function isFirebaseConfigured(): boolean {
  return Object.values(firebaseConfig).every(
    (value) => typeof value === "string" && value.length > 0,
  );
}

let _app: FirebaseApp | null = null;
let _db: Firestore | null = null;

/**
 * Lazily-initialised Firebase app. Returns null when keys are not configured
 * so callers can degrade gracefully without throwing on import.
 */
export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;
  if (_app) return _app;
  _app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return _app;
}

/**
 * Lazily-initialised Firestore client. Returns null when keys are missing.
 */
export function getDb(): Firestore | null {
  if (!isFirebaseConfigured()) return null;
  if (_db) return _db;
  const app = getFirebaseApp();
  if (!app) return null;
  _db = getFirestore(app);
  return _db;
}

let _auth: Auth | null = null;

/**
 * Lazily-initialised Firebase Auth client. Returns null when keys are missing.
 */
export function getAuthClient(): Auth | null {
  if (!isFirebaseConfigured()) return null;
  if (_auth) return _auth;
  const app = getFirebaseApp();
  if (!app) return null;
  _auth = getAuth(app);
  return _auth;
}

/**
 * One-tap Google sign-in for the admin panel. Throws when Firebase
 * is not configured; callers should check isFirebaseConfigured() first.
 */
export async function signInWithGoogle(): Promise<User> {
  const auth = getAuthClient();
  if (!auth) throw new Error("Firebase is not configured.");
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function signOutAdmin(): Promise<void> {
  if (_auth) await signOut(_auth);
}

export { onAuthStateChanged };
export type { User };
