import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    /** 内容を直した日。書いたときだけ「更新」と出す */
    updated: z.coerce.date().optional(),
    description: z.string(),
    /** 冒頭の「この記事で持ち帰れること」。1行ずつ書く（3つが目安） */
    takeaways: z.array(z.string()).optional(),
    /** true の記事は公開しない（npm run dev のときだけ見える） */
    draft: z.boolean().default(false),
  }),
});

/**
 * 短いログ（TIL＝今日学んだこと）。1つの気づきを10分で書く短文。記事（posts）とは別の一覧に出る。
 * ファイル名が URL になる（例：2026-10-30.md → /logs/2026-10-30/）。同じ日に2つ書くなら 2026-10-30-2.md のように続ける。
 * 先頭が _ のファイル（_雛形.md）は読み込まない（pattern の 2 つ目で除いている）。
 */
const logs = defineCollection({
  loader: glob({ pattern: ['**/*.{md,mdx}', '!**/_*'], base: './src/content/logs' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    /** 一覧と RSS に出す一文。書かなければ本文の先頭から作る */
    description: z.string().optional(),
    /** true のログは公開しない（npm run dev のときだけ見える） */
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts, logs };
