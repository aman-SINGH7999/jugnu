// utils/datetime.ts
export function toDatetimeLocal(dateIso?: string | null): string {
  if (!dateIso) return "";
  const d = new Date(dateIso);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); // UTC → local
  return d.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
}

export function localDatetimeToISOString(local: string): string | null {
  if (!local) return null;
  const [datePart, timePart] = local.split("T");
  if (!datePart || !timePart) return null;
  const [y, m, d] = datePart.split("-").map(Number);
  const [hh, mm] = timePart.split(":").map(Number);
  const date = new Date(y, m - 1, d, hh, mm, 0); // local time
  return date.toISOString();
}
