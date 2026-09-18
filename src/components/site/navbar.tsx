"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { List, X } from "@phosphor-icons/react/dist/ssr";
import { useSite, type ViewKey } from "./site-context";

type NavItem = { label: string; view: ViewKey };

const NAV_ITEMS: NavItem[] = [
  { label: "Home", view: "home" },
  { label: "About", view: "about" },
  { label: "Academics", view: "academics" },
  { label: "Admissions", view: "admissions" },
  { label: "Events", view: "events" },
  { label: "Gallery", view: "gallery" },
  { label: "Contact", view: "contact" },
];

export function Navbar() {
  const { view, setView } = useSite();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/60">
      <nav className="mx-auto max-w-7xl h-16 px-4 sm:px-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setView("home")}
          className="flex items-center gap-2 group"
          aria-label="BRM International School home"
        >
          <span className="grid place-items-center h-8 w-8 rounded-full bg-brand text-brand-foreground font-bold text-sm tracking-tight">
            L
          </span>
          <span className="font-display font-bold text-base tracking-tight">
            BRM International School
          </span>
        </button>

        {/* Desktop nav: ONE line, ≤80px tall, per taste-skill §4.7 */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active = view === item.view;
            return (
              <li key={item.view}>
                <button
                  type="button"
                  onClick={() => setView(item.view)}
                  className={`relative px-3 py-2 text-sm rounded-md transition-colors ${
                    active
                      ? "text-brand font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-amber"
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="hidden md:block">
          <button
            type="button"
            onClick={() => setView("inquiry")}
            className="inline-flex items-center px-4 py-2 rounded-full bg-brand text-brand-foreground text-sm font-medium hover:bg-brand/90 transition-colors"
          >
            Inquire
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden grid place-items-center h-10 w-10 rounded-md hover:bg-muted/50"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <List size={20} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden border-t border-border/60 bg-background"
          >
            <ul className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.view}>
                  <button
                    type="button"
                    onClick={() => {
                      setView(item.view);
                      setOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-md text-base ${
                      view === item.view
                        ? "bg-muted text-brand font-medium"
                        : "text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setView("inquiry");
                    setOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-md bg-brand text-brand-foreground font-medium"
                >
                  Inquire
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
