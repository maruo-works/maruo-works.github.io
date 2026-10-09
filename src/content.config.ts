import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { workTime } from './lib/schema';

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
    /** 作業時間。書いたときだけ記事の上に出す */
    time: workTime.optional(),
    /** true の記事は公開しない（npm run dev のときだけ見える） */
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
