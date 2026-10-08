import { INTRO_POST } from '../consts';
import type { Post } from './posts';

/**
 * 記事の末尾に出す「あわせて読む」を選ぶ。
 * 題名・説明・持ち帰りの文を、文字2つずつ（バイグラム）に切り、重なりの多い記事を近いとみなす。
 * タグを付けなくても動く。記事が増えてタグを付けたら、この関数を差し替える。
 */

/** 文章を文字2つずつに切り、出てくる回数を数える。記号と空白は切る前に除く */
function bigrams(text: string): Map<string, number> {
  const chars = [...text.replace(/[\s、。・「」『』（）()：:／/,.!?！？\-—]/g, '')];
  const counts = new Map<string, number>();
  for (let i = 0; i + 1 < chars.length; i++) {
    const g = chars[i] + chars[i + 1];
    counts.set(g, (counts.get(g) ?? 0) + 1);
  }
  return counts;
}

const textOf = (p: Post) => [p.data.title, p.data.description, ...(p.data.takeaways ?? [])].join(' ');

/** 近い順に count 本。自分・「はじめに」の記事・exclude（前後の記事など、すでに出ているもの）は除く */
export function relatedPosts(post: Post, all: Post[], exclude: (string | undefined)[] = [], count = 3): Post[] {
  const skip = new Set([post.id, INTRO_POST, ...exclude.filter((id): id is string => !!id)]);
  const candidates = all.filter((p) => !skip.has(p.id));
  if (candidates.length === 0) return [];

  // どの記事にも出る文字の組（「ます」「する」など）は重みを下げる
  const docs = [post, ...candidates].map((p) => ({ p, grams: bigrams(textOf(p)) }));
  const df = new Map<string, number>();
  for (const { grams } of docs) for (const g of grams.keys()) df.set(g, (df.get(g) ?? 0) + 1);
  const idf = (g: string) => Math.log(1 + docs.length / (df.get(g) ?? 1));

  const vector = (grams: Map<string, number>) => {
    const v = new Map<string, number>();
    let norm = 0;
    for (const [g, n] of grams) {
      const w = n * idf(g);
      v.set(g, w);
      norm += w * w;
    }
    return { v, norm: Math.sqrt(norm) || 1 };
  };
  const self = vector(docs[0].grams);
  const score = (grams: Map<string, number>) => {
    const other = vector(grams);
    let dot = 0;
    for (const [g, w] of self.v) dot += w * (other.v.get(g) ?? 0);
    return dot / (self.norm * other.norm);
  };

  return docs
    .slice(1)
    .map(({ p, grams }) => ({ p, s: score(grams) }))
    .sort((a, b) => b.s - a.s || b.p.data.date.valueOf() - a.p.data.date.valueOf())
    .slice(0, count)
    .map(({ p }) => p);
}
