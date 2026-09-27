import type { Bi } from "@/lib/lang";

export type EventItem = {
  slug: string;
  title: Bi;
  date: string;
  time: string;
  category: string;
  venue: Bi;
  people: Bi;
  description: Bi;
  photos: string[];
};

/** Seeded events — editable from the admin panel. */
export const events: EventItem[] = [];

export function normalizeEvent(e: any): EventItem {
  const getBi = (val: any, fallback = ""): Bi => {
    if (typeof val === "string") {
      return {
        mr: val,
        en: val,
      };
    }

    if (
      val &&
      typeof val === "object" &&
      (val.mr || val.en)
    ) {
      return {
        mr: val.mr || val.en || fallback,
        en: val.en || val.mr || fallback,
      };
    }

    return {
      mr: fallback,
      en: fallback,
    };
  };

  return {
    slug: e._id || e.id || e.slug || Math.random().toString(),

    title: getBi(
      e.title,
      e.eventName || "कार्यक्रम"
    ),

    date:
      e.date ||
      new Date().toISOString().split("T")[0],

    time: e.time || "",

    category: e.category || "general",

    venue: getBi(
      e.venue || e.location,
      "आळंदी देवाची"
    ),

    people: getBi(
      e.kirtankarSpeaker ||
        e.chiefGuest ||
        e.people,
      ""
    ),

    description: getBi(
      e.description,
      ""
    ),

    photos: Array.isArray(e.photos)
      ? e.photos
      : [],
  };
}

export function splitEventList(
  list: EventItem[],
  now = new Date()
) {
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();

  const upcoming = list
    .filter(
      (e) =>
        new Date(e.date).getTime() >= today
    )
    .sort((a, b) =>
      a.date.localeCompare(b.date)
    );

  const past = list
    .filter(
      (e) =>
        new Date(e.date).getTime() < today
    )
    .sort((a, b) =>
      b.date.localeCompare(a.date)
    );

  return {
    upcoming,
    past,
  };
}

export function splitEvents(now = new Date()) {
  return splitEventList(events, now);
}

const mrWeekdays = [
  "रविवार",
  "सोमवार",
  "मंगळवार",
  "बुधवार",
  "गुरुवार",
  "शुक्रवार",
  "शनिवार",
];

export function formatEventDate(
  iso: string,
  lang: "mr" | "en"
) {
  const d = new Date(iso);

  if (lang === "mr") {
    return `${d.toLocaleDateString(
      "mr-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    )}, ${mrWeekdays[d.getDay()]}`;
  }

  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  });
}