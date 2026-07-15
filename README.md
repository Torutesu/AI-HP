# AI総合戦略研究所 — コーポレートサイト

エンタープライズ向けAIコンサルティング「AI総合戦略研究所 (AI Strategy Institute)」の
コーポレートサイトです。Claude Design のハンドオフ（HTML/CSS/JS プロトタイプ）をもとに、
本番向けの静的サイトとして実装しています。

## 実装済みページ

| ページ | ファイル | 状態 |
| --- | --- | --- |
| トップページ | `index.html` | ✅ 実装済み |
| サービス / 導入事例 / 会社概要 / マガジン / お問い合わせ / 資料ダウンロード / AI経営基盤 / コンサルティング | `service.html` ほか | ⏳ 未実装（ハンドオフに設計あり） |

> 現在のスコープは **トップページ** です。ヘッダー・フッターのナビゲーションは
> 上記スラッグ（`service.html`, `cases.html`, `company.html`, `magazine.html`,
> `contact.html`, `download.html`, `ai-os.html`, `consulting.html`）へリンクしています。
> これらのページは今後、同じデザインシステム上で追加予定です。

## 構成

```
index.html              トップページ
assets/
  css/
    tokens.css          デザイントークン（色・タイポ・余白・効果）＋ベースリセット
    main.css            ページ用スタイル＋コンポーネント（Icon/SectionHeading/StatCard/Button）＋レスポンシブ
  js/
    main.js             Lucideアイコン描画＋スクロールリビール
  img/
    logo-mark.png       ブランドロゴマーク
```

## デザインシステム

ハンドオフ同梱のデザインシステム（`design-system-c8d7bd`）に忠実です。

- **配色**: 白キャンバス＋ブランドマーク由来のブルーアクセント1色。0.5px のヘアライン
  ボーダーで奥行きを表現し、ドロップシャドウは使いません。
- **タイポグラフィ**: 和文 Noto Sans JP / 欧文 Inter（Google Fonts）。行間は和文本文で 1.8。
- **アイコン**: [Lucide](https://lucide.dev) のライン系アイコン（stroke-width 1.75）を
  CDN 経由で使用。プロトタイプ／デザインシステムと同じ substitution 方針です。
  ライセンス済みアイコンセットがあれば差し替え可能です。
- **ダークテーマ**: `tokens.css` に定義済み（`<html data-theme="dark">` で有効化）。既定はライト。

## 外部依存

トップページは以下の外部リソースを読み込みます（デザイン指定のアセット）。

- Google Fonts（Inter / Noto Sans JP）
- Lucide アイコン CDN（`https://unpkg.com/lucide@latest`）
- ヒーロー動画・パートナーロゴ（`cdn.sceneai.art`）

## ローカルでの確認

ビルド不要の静的サイトです。任意の静的サーバーで配信できます。

```bash
python3 -m http.server 8000
# → http://localhost:8000/
```
