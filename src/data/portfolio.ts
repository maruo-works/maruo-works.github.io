/** 「作ったもの」（/work/ に出る）。公開できるものだけ。仕事で作ったものは載せない */
export type Work = {
  title: string;
  /** 1文。何をするものか */
  text: string;
  /** 本体（GitHub など） */
  href: string;
  /** 補足のリンク（作ったときの記事など） */
  more?: { label: string; href: string };
};

export const portfolio: Work[] = [
  {
    title: 'このサイト（maruo-works.com）',
    text: '1枚の CD に見立てた、この個人サイト。自分のドメインで公開しています。表示の速さは Google の測定（2026年10月・スマホ）で 97 点。',
    href: 'https://github.com/maruo-works/maruo-works.github.io',
    more: { label: '公開までの記事', href: '/posts/own-domain/' },
  },
  {
    title: 'xlsx-month-roll',
    text: 'Excel の月の表記と日付を、書式を崩さずに次の月へ進めるツール。',
    href: 'https://github.com/maruo-works/xlsx-month-roll',
    more: { label: '実績づくりの記事', href: '/posts/portfolio-without-client-code/' },
  },
  {
    title: 'feed2wp-draft',
    text: 'YouTube・note・ブログの新着から記事の下書きを作り、WordPress に下書きとして保存するツール。',
    href: 'https://github.com/maruo-works/feed2wp-draft',
    more: { label: '止め方を決めた記事', href: '/posts/design-the-stop-first/' },
  },
];
