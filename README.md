# maruo-works.com

まるおの個人サイト・ブログです。 → https://maruo-works.com

## 使っているもの

- **Astro**（静的サイト）＋ **MDX**（記事の中で部品を使う）
- **GitHub Actions** で自動ビルドし、**GitHub Pages** に公開（独自ドメイン）
- RSS・サイトマップの自動生成

## 工夫したところ

- **サイトを1枚の CD に見立てたデザイン**：時間帯（昼・夕方・夜）で見た目が変わります
- **記事の部品**：比較表・手順・見本・まとめなどを部品にし、MDX の記事から import なしで使えるようにしています
- **SNS 用の共有画像（OGP）を記事ごとに自動で作成**：satori で画像にし、日本語は BudouX で文節に分けて、単語の途中で改行されないようにしています。日本語の書体は使う文字だけを取り寄せて、ファイルを小さくしています
- **表示の速さ**：Google の Lighthouse で測りながら、書体の読み込み方や画像の優先度を調整しています
- **公開前の個人情報の確認**：コミットの名前とメール（GitHub の非公開用アドレス）、画像の撮影情報、ファイルに入った名前などを確かめてから公開しています

## 手元で動かす

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ に書き出し
```

## ほかの作品

- [feed2wp-draft](https://github.com/maruo-works/feed2wp-draft)：新着フィードから記事の下書きを作り、WordPress に下書き保存する
- [xlsx-month-roll](https://github.com/maruo-works/xlsx-month-roll)：Excel の月の表記と日付を、書式を崩さずに次の月へ進める
