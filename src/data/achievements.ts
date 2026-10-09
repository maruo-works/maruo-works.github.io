export type Achievement = {
  date: string;
  /** 名詞で書く（例：「サイト作成」。「〜を作った」とは書かない） */
  text: string;
};

export const achievements: Achievement[] = [
  { date: '2026-10-01', text: 'サイト作成' },
];
