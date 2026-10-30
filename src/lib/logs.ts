import { getCollection, type CollectionEntry } from 'astro:content';

export type Log = CollectionEntry<'logs'>;

/** 公開する短いログを古い順で返す。下書きは npm run dev のときだけ含める */
export async function getLogs(): Promise<Log[]> {
  const logs = await getCollection('logs', (l) => import.meta.env.DEV || !l.data.draft);
  return logs.sort((a, b) => a.data.date.valueOf() - b.data.date.valueOf() || a.id.localeCompare(b.id));
}

/** 一覧と RSS に出す一文。description がなければ本文の先頭 80 字から作る */
export function logSummary(log: Log, length = 80): string {
  if (log.data.description) return log.data.description;
  const text = (log.body ?? '')
    .replace(/^import .*$/gm, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[#*_>`|\[\]()!]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > length ? `${text.slice(0, length)}…` : text;
}
