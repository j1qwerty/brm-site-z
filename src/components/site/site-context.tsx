"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type ViewKey =
  | "home"
  | "about"
  | "academics"
  | "admissions"
  | "events"
  | "gallery"
  | "contact"
  | "inquiry"
  | "admin";

type SiteContextValue = {
  view: ViewKey;
  setView: (v: ViewKey) => void;
};

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  // Lazy initializer reads the URL hash ONCE on first render (client-side only).
  const [view, setViewState] = useState<ViewKey>(() => {
    if (typeof window === "undefined") return "home";
    const hash = window.location.hash.replace("#/", "").replace("#", "");
    if (hash && validViews.has(hash as ViewKey)) {
      return hash as ViewKey;
    }
    return "home";
  });

  const setView = useCallback((v: ViewKey) => {
    setViewState(v);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onHashChange = () => {
      const h = window.location.hash.replace("#/", "").replace("#", "");
      if (h && validViews.has(h as ViewKey)) {
        setViewState(h as ViewKey);
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (view === "home" && !window.location.hash) return;
    const target = `#/${view}`;
    if (window.location.hash !== target) {
      window.history.replaceState(null, "", target);
    }
  }, [view]);

  const value = useMemo(() => ({ view, setView }), [view, setView]);
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

const validViews = new Set<ViewKey>([
  "home",
  "about",
  "academics",
  "admissions",
  "events",
  "gallery",
  "contact",
  "inquiry",
  "admin",
]);

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within <SiteProvider>");
  return ctx;
}
