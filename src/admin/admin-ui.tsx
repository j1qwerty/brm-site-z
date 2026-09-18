"use client";

// Shared admin UI primitives - small enough to live in one file.
// Per taste-skill, we use shadcn/ui for the public site. For admin, we use
// these purpose-built primitives that match the admin aesthetic.

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function AdminHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1 max-w-prose">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}

export function AdminCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-6 ${className}`}>
      {children}
    </div>
  );
}

export function AdminButton({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
  size = "md",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  type?: "button" | "submit";
  disabled?: boolean;
  size?: "sm" | "md";
}) {
  const base =
    "inline-flex items-center gap-1.5 font-medium rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed";
  const sizeClass = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";
  const variantClass = {
    primary: "bg-brand text-brand-foreground hover:bg-brand/90",
    secondary: "border border-border hover:border-amber/60 hover:text-amber",
    ghost: "hover:bg-muted text-foreground",
    danger: "bg-destructive text-white hover:bg-destructive/90",
  }[variant];
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${sizeClass} ${variantClass}`}>
      {children}
    </button>
  );
}

export function AdminInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber/60 focus:border-amber/60 transition-colors ${props.className ?? ""}`}
    />
  );
}

export function AdminTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber/60 focus:border-amber/60 transition-colors ${props.className ?? ""}`}
    />
  );
}

export function AdminSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber/60 focus:border-amber/60 transition-colors ${props.className ?? ""}`}
    />
  );
}

export function AdminLabel({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground mb-1.5">
      {children}
    </label>
  );
}

export function AdminBadge({ children, color = "neutral" }: { children: ReactNode; color?: "neutral" | "amber" | "danger" | "success" }) {
  const colors = {
    neutral: "bg-muted text-foreground",
    amber: "bg-amber/15 text-amber",
    danger: "bg-destructive/15 text-destructive",
    success: "bg-green-500/15 text-green-700 dark:text-green-400",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono ${colors[color]}`}>
      {children}
    </span>
  );
}

export function AdminEmptyState({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
      <h3 className="text-lg font-medium tracking-tight mb-1">{title}</h3>
      {body && <p className="text-sm text-muted-foreground max-w-md mx-auto mb-5">{body}</p>}
      {action}
    </div>
  );
}

export function AdminLoading({ label = "Loading..." }: { label?: string }) {
  return (
    <motion.div
      className="rounded-2xl border border-border bg-card p-12 text-center text-sm text-muted-foreground"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
    >
      {label}
    </motion.div>
  );
}

export function AdminField({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <AdminLabel>{label}</AdminLabel>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
