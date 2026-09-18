"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  House,
  ListChecks,
  ChatCircleText,
  Article,
  Images,
  PlayCircle,
  CalendarBlank,
  Trash,
  Clock,
  Gear,
  ArrowLeft,
  GoogleLogo,
  SignOut,
} from "@phosphor-icons/react/dist/ssr";
import { useSite } from "@/components/site/site-context";
import { AdminBadge, AdminLoading } from "./admin-ui";
import { isFirebaseConfigured, signInWithGoogle, signOutAdmin } from "@/lib/firebase";
import { useFirebaseUser, GOOGLE_REQUIRED_MSG } from "@/lib/use-firebase-user";
import { useUnreadCounts } from "@/admin/use-unread-counts";
import { AdminDashboard } from "@/admin/pages/dashboard";
import { AdminInquiries } from "@/admin/pages/inquiries";
import { AdminContacts } from "@/admin/pages/contacts";
import { AdminContent } from "@/admin/pages/content";
import { AdminEvents } from "@/admin/pages/events";
import { AdminGallery } from "@/admin/pages/gallery";
import { AdminVideos } from "@/admin/pages/videos";
import { AdminFAQs } from "@/admin/pages/faqs";
import { AdminHistory } from "@/admin/pages/history";
import { AdminTrash } from "@/admin/pages/trash";
import { AdminSettings } from "@/admin/pages/settings";

/*
  Admin Shell
  ===========
  - Gated by password (VITE_ADMIN_PASSWORD env var, or 'brm-admin' default)
    or by Google sign-in via Firebase Auth. The session survives page refresh
    within the same tab; a new tab or browser restart starts logged out.
  - Sidebar nav + content area.
  - All admin pages live in src/admin/pages/*.
*/

export type AdminPage =
  | "dashboard"
  | "inquiries"
  | "contacts"
  | "content"
  | "events"
  | "gallery"
  | "videos"
  | "faqs"
  | "history"
  | "trash"
  | "settings";

const NAV: { page: AdminPage; label: string; Icon: typeof House; countKey?: "inquiries" | "contacts" }[] = [
  { page: "dashboard", label: "Dashboard", Icon: House },
  { page: "inquiries", label: "Inquiries", Icon: ListChecks, countKey: "inquiries" },
  { page: "contacts", label: "Contact messages", Icon: ChatCircleText, countKey: "contacts" },
  { page: "content", label: "Content (CMS)", Icon: Article },
  { page: "events", label: "Events", Icon: CalendarBlank },
  { page: "gallery", label: "Gallery", Icon: Images },
  { page: "videos", label: "Videos", Icon: PlayCircle },
  { page: "faqs", label: "FAQs", Icon: Article },
  { page: "history", label: "History", Icon: Clock },
  { page: "trash", label: "Trash", Icon: Trash },
  { page: "settings", label: "Settings", Icon: Gear },
];

const ADMIN_PW =
  (import.meta.env as Record<string, string | undefined>).VITE_ADMIN_PASSWORD ||
  "brm-admin";

// Tab-scoped session flag: survives page refresh, cleared when the tab closes.
// A brand-new tab (or browser restart) always starts logged out.
const SESSION_KEY = "brm-admin-authed";

export function AdminShell() {
  const { setView } = useSite();
  // Restored from the tab session (survives refresh). A new tab starts logged out.
  const [authed, setAuthed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem(SESSION_KEY) === "1";
  });
  const [page, setPage] = useState<AdminPage>("dashboard");
  const firebaseReady = isFirebaseConfigured();
  // Firebase restores the Google session asynchronously on refresh. Admin
  // pages must not query Firestore until this resolves - otherwise every
  // read/write fails with permission-denied (tightened rules need auth).
  const { user: fbUser, loading: authLoading } = useFirebaseUser();
  const unread = useUnreadCounts(authed);

  // One-time cleanup of the legacy persistent flag from older builds.
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem("brm-admin-session");
  }, []);

  const handleAuthed = useCallback(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    }
    setAuthed(true);
  }, []);

  const handleLogout = useCallback(async () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(SESSION_KEY);
    }
    try {
      await signOutAdmin();
    } finally {
      setAuthed(false);
      setPage("dashboard");
    }
  }, []);

  if (!authed) {
    return <AdminLogin onAuthed={handleAuthed} />;
  }

  // Auth still restoring after a refresh - hold the pages so their Firestore
  // queries don't fire unauthenticated and fail.
  if (firebaseReady && authLoading) {
    return (
      <div className="min-h-[calc(100dvh-4rem)] grid place-items-center">
        <AdminLoading label="Restoring session..." />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 grid md:grid-cols-[15rem_1fr] gap-6">
        <aside className="md:sticky md:top-20 md:self-start">
          <div className="rounded-2xl bg-card border border-border p-3">
            <p className="px-2 py-2 text-xs uppercase tracking-[0.14em] font-mono text-muted-foreground">
              Admin
            </p>
            <nav className="space-y-0.5">
              {NAV.map(({ page: p, label, Icon, countKey }) => {
                const active = page === p;
                const count = countKey ? unread[countKey] : null;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                      active
                        ? "bg-brand text-brand-foreground"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon size={16} weight={active ? "fill" : "regular"} />
                    <span>{label}</span>
                    {count != null && count > 0 && (
                      <span className="ml-auto" aria-label={`${count} unread`}>
                        <AdminBadge color="amber">{count}</AdminBadge>
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
            <div className="mt-3 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setView("home")}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted transition-colors"
              >
                <ArrowLeft size={16} />
                <span>Back to site</span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted transition-colors"
              >
                <SignOut size={16} />
                <span>Log out</span>
              </button>
            </div>
          </div>
          {!firebaseReady && (
            <div className="mt-3 rounded-md border border-amber/40 bg-amber/10 p-3 text-xs text-foreground leading-relaxed">
              <strong>Firebase not configured.</strong> Add Firebase keys to
              <code className="mx-1 font-mono bg-muted px-1 py-0.5 rounded">.env.local</code>
              to enable admin functions.
            </div>
          )}
          {firebaseReady && !fbUser && (
            <div className="mt-3 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-foreground leading-relaxed">
              <strong>Password session.</strong> {GOOGLE_REQUIRED_MSG} Log out
              and use Continue with Google.
            </div>
          )}
        </aside>

        <div className="min-h-[60vh] min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {page === "dashboard" && <AdminDashboard onNavigate={setPage} />}
              {page === "inquiries" && <AdminInquiries />}
              {page === "contacts" && <AdminContacts />}
              {page === "content" && <AdminContent />}
              {page === "events" && <AdminEvents />}
              {page === "gallery" && <AdminGallery />}
              {page === "videos" && <AdminVideos />}
              {page === "faqs" && <AdminFAQs />}
              {page === "history" && <AdminHistory onNavigate={setPage} />}
              {page === "trash" && <AdminTrash />}
              {page === "settings" && <AdminSettings />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function AdminLogin({ onAuthed }: { onAuthed: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [googleBusy, setGoogleBusy] = useState(false);
  const firebaseReady = isFirebaseConfigured();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PW) {
      onAuthed();
    } else {
      setErr("Wrong password. Try again.");
    }
  };

  const handleGoogle = async () => {
    setErr(null);
    if (!isFirebaseConfigured()) {
      setErr("Add Firebase keys to .env.local to enable Google sign-in.");
      return;
    }
    setGoogleBusy(true);
    try {
      await signInWithGoogle();
      onAuthed();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Google sign-in failed.");
    } finally {
      setGoogleBusy(false);
    }
  };

  return (
    <div className="min-h-[60vh] grid place-items-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-7 space-y-5"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Admin panel</h1>
          <p className="text-sm text-muted-foreground">
            Enter the admin password to continue.
          </p>
        </div>
        <div className="space-y-2">
          <label htmlFor="admin-pw" className="block text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground">
            Password
          </label>
          <input
            id="admin-pw"
            type="password"
            autoFocus
            value={pw}
            onChange={(e) => {
              setPw(e.target.value);
              setErr(null);
            }}
            className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber/60 focus:border-amber/60"
            placeholder="••••••••"
          />
        </div>
        {err && <p className="text-sm text-destructive">{err}</p>}
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-brand text-brand-foreground font-medium hover:bg-brand/90 transition-colors"
        >
          Enter admin
        </button>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" aria-hidden />
          <span>or</span>
          <span className="h-px flex-1 bg-border" aria-hidden />
        </div>
        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleBusy}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-border bg-background font-medium hover:bg-muted transition-colors disabled:opacity-60"
        >
          <GoogleLogo size={18} weight="bold" aria-hidden />
          {googleBusy ? "Connecting…" : "Continue with Google"}
        </button>
        {!firebaseReady && (
          <p className="text-xs text-muted-foreground text-center">
            Google sign-in needs Firebase keys in{" "}
            <code className="font-mono bg-muted px-1.5 py-0.5 rounded">.env.local</code>.
          </p>
        )}
        <p className="text-xs text-muted-foreground text-center">
          Default password is <code className="font-mono bg-muted px-1.5 py-0.5 rounded">brm-admin</code>.
          Override with <code className="font-mono bg-muted px-1.5 py-0.5 rounded">VITE_ADMIN_PASSWORD</code> in <code className="font-mono bg-muted px-1.5 py-0.5 rounded">.env.local</code>.
        </p>
      </form>
    </div>
  );
}
