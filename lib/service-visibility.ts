// Funeral is 7 July 2026; the Service page/link is only relevant through that day.
const SERVICE_HIDE_FROM = new Date("2026-07-08T00:00:00");

export function isServiceVisible(now: Date = new Date()): boolean {
  return now < SERVICE_HIDE_FROM;
}
