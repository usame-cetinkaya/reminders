export function toDatetimeLocal(isoDate: string) {
  const date = new Date(isoDate);

  const pad = (n: number) => String(n).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export const localDateTime = (isoString: string) =>
  new Date(isoString).toLocaleString("tr-TR", {
    timeZone: "Europe/Istanbul",
    hour: "2-digit",
    minute: "2-digit",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

export const localTime = (isoString: string) =>
  new Date(isoString).toLocaleTimeString("tr-TR", {
    timeZone: "Europe/Istanbul",
  });
