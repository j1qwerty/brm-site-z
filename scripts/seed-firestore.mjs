// Seeds initial Firestore documents for BRM International School.
// Usage: node scripts/seed-firestore.mjs
// Reads config from .env.local (VITE_FIREBASE_*). Safe to re-run (uses setDoc merge).

import { readFileSync } from "node:fs";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

function loadEnvFile(path) {
  const env = {};
  try {
    for (const line of readFileSync(path, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (m && !line.trim().startsWith("#")) env[m[1]] = m[2];
    }
  } catch {
    console.error(`Missing ${path} - copy .env.example to .env.local first.`);
    process.exit(1);
  }
  return env;
}

const env = loadEnvFile(".env.local");
const config = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};
if (Object.values(config).some((v) => !v)) {
  console.error("Incomplete Firebase config in .env.local.");
  process.exit(1);
}

const app = initializeApp(config);
const db = getFirestore(app);

await setDoc(
  doc(db, "cms_settings", "site"),
  {
    autoDeleteDays: 30,
    siteName: "BRM International School",
    contactEmail: "hello@brm-school.edu",
    contactPhone: "+1 (555) 010-2030",
    address: "1 Curiosity Lane, Learning District",
    socialInstagram: "",
    socialYoutube: "",
    socialFacebook: "",
    socialX: "",
    socialLinkedin: "",
    updatedAt: serverTimestamp(),
  },
  { merge: true },
);
console.log("Seeded cms_settings/site");

process.exit(0);
