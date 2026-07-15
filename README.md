# AI総合戦略研究所 — コーポレートサイト

エンタープライズ向けAIコンサルティング「AI総合戦略研究所 (AI Strategy Institute)」の
コーポレートサイトです。Claude Design のハンドオフ（HTML/CSS/JS プロトタイプ）をもとに、
本番向けの静的サイトとして実装しています。

## 実装済みページ

全ページ実装済みです。ハンドオフ同梱の各 `*.dc.html` プロトタイプを、共通の
デザインシステム上で本番向け静的ページとして再現しています。

| ページ | ファイル | 元プロトタイプ |
| --- | --- | --- |
| トップページ | `index.html` | トップページ.dc.html |
| サービス | `service.html` | サービス.dc.html |
| 導入事例 | `cases.html` | 導入事例.dc.html |
| AI経営基盤 | `ai-os.html` | AI経営基盤.dc.html |
| コンサルティング | `consulting.html` | コンサルティング.dc.html |
| 会社概要 | `company.html` | 会社概要.dc.html |
| マガジン | `magazine.html` | マガジン.dc.html |
| お問い合わせ・無料相談 | `contact.html` | お問い合わせ.dc.html |
| 資料ダウンロード | `download.html` | 資料ダウンロード.dc.html |

- 共通のヘッダー／フッター（元 `サイトヘッダー.dc.html` / `サイトフッター.dc.html`）は
  各インテリアページに組み込んでいます。
- **お問い合わせ**・**資料ダウンロード** のフォームは、プロトタイプの状態管理ロジック
  （必須チェック＋メール形式チェック＋送信完了ステート）をバニラJSで実装しています。
  実際の送信先バックエンドは未接続です（`form` の submit をフックして完了画面を表示）。

## 構成

```
index.html              トップページ
service.html            サービス
cases.html              導入事例
ai-os.html              AI経営基盤
consulting.html         コンサルティング
company.html            会社概要
magazine.html           マガジン
contact.html            お問い合わせ・無料相談（動作するフォーム）
download.html           資料ダウンロード（動作するフォーム）
assets/
  css/
    tokens.css          デザイントークン（色・タイポ・余白・効果）＋ベースリセット
    main.css            共通コンポーネント（Icon/SectionHeading/StatCard/Button/共通ヘッダー）＋レスポンシブ
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
