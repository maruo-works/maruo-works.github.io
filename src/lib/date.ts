const pad = (n: number) => String(n).padStart(2, '0');

export function formatDate(date: Date): string {
  return `${date.getUTCFullYear()}.${pad(date.getUTCMonth() + 1)}.${pad(date.getUTCDate())}`;
}
