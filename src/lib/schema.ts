import { z } from 'astro/zod';

export const achievementSchema = z.object({
  date: z.coerce.date(),
  text: z.string().min(1),
});
