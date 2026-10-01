import { getCollection } from 'astro:content';
import { INTRO_POST } from '../consts';
import { achievements } from '../data/achievements';
import { monthTitles } from '../data/months';
import { achievementSchema } from './schema';

const pad = (n: number) => String(n).padStart(2, '0');

export type Kind = 'work' | 'post';

export type Item = {
  kind: Kind;
  title: string;
  date: Date;
  time: string;
  href?: string;
  /** その月の中での通し番号（月の最初が 01） */
  no: string;
};

export type MonthGroup = {
  key: string;
  label: string;
  items: Item[];
};

export const monthKey = (date: Date) => `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}`;

export function monthName(key: string): string {
  const [y, m] = key.split('-');
  return `${y}年${Number(m)}月`;
}

export function monthLabel(key: string): string {
  const title = monthTitles[key];
  return title ? `${monthName(key)}『${title}』` : monthName(key);
}

const newestFirst = (a: { date: Date }, b: { date: Date }) => b.date.valueOf() - a.date.valueOf();

function numberByMonth(items: Omit<Item, 'no'>[]): Item[] {
  const counts = new Map<string, number>();
  return [...items]
    .sort((a, b) => a.date.valueOf() - b.date.valueOf())
    .map((item) => {
      const key = monthKey(item.date);
      const n = (counts.get(key) ?? 0) + 1;
      counts.set(key, n);
      return { ...item, no: pad(n) };
    })
    .sort(newestFirst);
}

export async function loadItems() {
  const posts = numberByMonth(
    (await getCollection('posts')).map((p) => ({
      kind: 'post' as const,
      title: p.data.title,
      date: p.data.date,
      time: p.data.time,
      href: `/posts/${p.id}/`,
    })),
  );
  const works = numberByMonth(
    achievements.map((a, i) => {
      const parsed = achievementSchema.safeParse(a);
      if (!parsed.success) {
        throw new Error(`src/data/achievements.ts の ${i + 1} 行目（${a.text}）: ${parsed.error.issues[0].message}`);
      }
      return { kind: 'work' as const, title: parsed.data.text, date: parsed.data.date, time: parsed.data.time };
    }),
  );
  const all = [...posts, ...works].sort(newestFirst);
  const intro = posts.find((p) => p.href === `/posts/${INTRO_POST}/`);
  if (!intro) {
    throw new Error(`src/consts.ts の INTRO_POST（${INTRO_POST}）に当たる記事が src/content/posts/ にありません`);
  }
  return { posts, works, all, latest: all[0], intro };
}

export function groupByMonth(items: Item[]): MonthGroup[] {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const key = monthKey(item.date);
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, list]) => ({ key, label: monthLabel(key), items: list }));
}
