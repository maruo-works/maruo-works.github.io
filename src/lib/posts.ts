import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/** 公開する記事を古い順で返す。下書きは npm run dev のときだけ含める */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', (p) => import.meta.env.DEV || !p.data.draft);
  return posts.sort((a, b) => a.data.date.valueOf() - b.data.date.valueOf() || a.id.localeCompare(b.id));
}

const CHARS_PER_MINUTE = 500;

/** 本文の文字数から、読むのにかかるおよその分数を出す */
export function readingMinutes(body: string | undefined): number {
  const text = (body ?? '')
    .replace(/^import .*$/gm, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[#*_>`|\-\[\]()!]/g, '')
    .replace(/\s+/g, '');
  return Math.max(1, Math.ceil(text.length / CHARS_PER_MINUTE));
}
