export type Achievement = {
  date: string;
  /** 名詞で書く（例：「サイト作成」。「〜を作った」とは書かない） */
  text: string;
  /** 作業時間。「10分」「3時間」「1時間30分」の形 */
  time: string;
};

export const achievements: Achievement[] = [
  { date: '2026-10-01', text: 'サイト作成', time: '3時間' },
];
