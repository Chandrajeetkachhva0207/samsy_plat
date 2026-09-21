import type { Bi } from "@/lib/lang";

export type EventItem = {
  slug: string;
  title: Bi;
  date: string; // ISO yyyy-mm-dd
  time: string;
  venue: Bi;
  people: Bi;
  description: Bi;
  photos: string[];
};

/** Seeded events — editable from the admin panel. */
export const events: EventItem[] = [];

export function splitEvents(now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const upcoming = events
    .filter((e) => new Date(e.date).getTime() >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
  const past = events
    .filter((e) => new Date(e.date).getTime() < today)
    .sort((a, b) => b.date.localeCompare(a.date));
  return { upcoming, past };
}

const mrWeekdays = ["रविवार", "सोमवार", "मंगळवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];

export function formatEventDate(iso: string, lang: "mr" | "en") {
  const d = new Date(iso);
  if (lang === "mr") {
    return `${d.toLocaleDateString("mr-IN", { day: "numeric", month: "long", year: "numeric" })}, ${mrWeekdays[d.getDay()]}`;
  }
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  });
}
