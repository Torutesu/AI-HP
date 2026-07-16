// Downloadable asset catalog.
// Maps a form `asset` id to a human label and a file path. The final URL is
// resolved at request time by functions/api/download.ts:
//   - an absolute http(s) `path` is used as-is
//   - otherwise ASSETS_BASE_URL + path (e.g. an R2 / public bucket)
//   - "service-guide" additionally falls back to the legacy DOC_DOWNLOAD_URL env
//     so the existing service-guide flow keeps working with no new config.
//
// To distribute a per-article template (稟議書xlsx / RFP / 規程docx 等), add an
// entry here and pass ?asset=<id> to /download (or a hidden input).
export type DownloadAsset = { id: string; label: string; path: string };

export const ASSETS: DownloadAsset[] = [
  { id: "service-guide", label: "サービス資料", path: "service-guide.pdf" },
  // { id: "ringi-template", label: "AI導入 稟議書テンプレート（Excel）", path: "templates/ringi.xlsx" },
  // { id: "rfp-template",   label: "AI開発 RFPテンプレート",           path: "templates/rfp.docx" },
];

export const DEFAULT_ASSET_ID = "service-guide";

export function getAsset(id: string | null | undefined): DownloadAsset | undefined {
  return ASSETS.find((a) => a.id === id);
}
