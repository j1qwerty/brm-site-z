"use client";

/*
  Shared CMS list-field helper.
  List content (timelines, value grids, teams, schedules, FAQs...) is stored in
  Firestore as JSON strings - the admin editor shows them as textareas.
  parseList falls back to hardcoded defaults when the field is missing or the
  JSON is invalid, so the site never breaks on a bad edit.
*/

export function parseList<T>(raw: unknown, fallback: T[]): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (typeof raw === "string") {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as T[];
    } catch {
      /* fall through to defaults */
    }
  }
  return fallback;
}
