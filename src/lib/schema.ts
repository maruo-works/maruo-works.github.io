import { z } from 'astro/zod';

/** 作業時間。「10分」「3時間」「1時間30分」の形だけ通す。 */
export const workTime = z
  .string()
  .regex(/^(\d+時間)?(\d+分)?$/, '作業時間は「10分」「3時間」「1時間30分」の形で書いてください')
  .refine((s) => s !== '', '作業時間を書いてください');

export const achievementSchema = z.object({
  date: z.coerce.date(),
  text: z.string().min(1),
  time: workTime,
});
