# マガジンサムネイル運用

記事本文と画像を同じ内容に保つため、`lib/magazine.ts` から生成ブリーフを作り、
`content/magazine-thumbnails.json` で生成状態を管理します。

## アートディレクション

- 16:9、一覧カードの小さい表示でも主題が分かる構図
- 白〜クールグレーを基調に、コバルトブルーとネイビーを限定的に使う
- 記事の中心となる業務オブジェクトまたは業務フローを1つに絞る
- 文字、数字、ロゴ、人物の顔、汎用的なAI脳・ロボット表現は入れない
- 写真の質感と、控えめな建築・データビジュアライゼーションを組み合わせる

## 新規記事・本文更新時

1. `lib/magazine.ts` に記事を追加または本文を更新する。
2. `npm run magazine:thumbnail-briefs` を実行する。
3. `content/magazine-thumbnails.json` で `pending` の記事を確認する。
4. 各記事の `prompt` を使い、Codexの組み込み画像生成で1記事1画像を生成する。
5. 画像を `public/img/magazine/<slug>.webp` に保存する。
6. もう一度 `npm run magazine:thumbnail-briefs` を実行し、`ready` を確認する。
7. PC・スマホ表示とOG画像を確認して公開する。

`npm run magazine:thumbnail-check` は、本文変更後にブリーフの更新を忘れていないかを
検査します。本文の `sourceHash` と画像の `imageHash` を別々に持つため、本文だけが
変わった記事は `pending` に戻り、画像を差し替えた時点で再び `ready` になります。
