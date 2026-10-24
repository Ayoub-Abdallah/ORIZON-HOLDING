// Call slots in Algiers time (UTC+1, no DST). Working week is Sunday–Thursday.

const OFFSET_HOURS = 1;
const HOURS = [9, 10, 11, 13, 14, 15, 16];
const WORKDAYS = new Set([0, 1, 2, 3, 4]);

export type Day = { key: string; label: string; weekday: string; slots: string[] };

export function upcomingDays(count = 10, from = new Date()): Day[] {
  const days: Day[] = [];
  // Start from tomorrow in Algiers time.
  const local = new Date(from.getTime() + OFFSET_HOURS * 3600_000);
  const cursor = new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate() + 1));
  while (days.length < count) {
    if (WORKDAYS.has(cursor.getUTCDay())) {
      const y = cursor.getUTCFullYear();
      const m = cursor.getUTCMonth();
      const d = cursor.getUTCDate();
      days.push({
        key: cursor.toISOString().slice(0, 10),
        label: cursor.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }),
        weekday: cursor.toLocaleDateString("en-GB", { weekday: "short", timeZone: "UTC" }),
        slots: HOURS.map((h) => new Date(Date.UTC(y, m, d, h - OFFSET_HOURS)).toISOString()),
      });
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return days;
}

export function isValidSlot(iso: string, now = new Date()) {
  return upcomingDays(10, now).some((d) => d.slots.includes(iso));
}

export function formatSlot(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Algiers",
  });
}

export function slotTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Algiers" });
}
