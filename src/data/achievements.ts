export type Achievement = {
  date: string;
  text: string;
  /** 作業時間。「10分」「3時間」「1時間30分」の形 */
  time: string;
};

export const achievements: Achievement[] = [
  { date: '2026-10-01', text: 'このサイトを作った', time: '3時間' },
];
