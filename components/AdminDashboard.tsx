"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import styles from "./admin.module.css";

type Lead = {
  id: number;
  created_at: string;
  type: "contact" | "download";
  company?: string;
  pref?: string;
  size?: string;
  role?: string;
  title?: string;
  last_name?: string;
  first_name?: string;
  email?: string;
  phone?: string;
  kind?: string;
  message?: string;
  asset?: string;
  themes?: string;
  roi?: string;
  country?: string;
  ai_summary?: string;
  ai_intent?: string;
  ai_priority?: number;
  ai_priority_reason?: string;
  ai_next_action?: string;
  ai_handling?: "human" | "auto" | string;
  ai_talking_points?: string;
  ai_reply?: string;
  ai_status?: string;
};

const PAGE = 100;

function fmtDate(iso: string): string {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", timeZone: "Asia/Tokyo",
    }).format(d);
  } catch {
    return iso;
  }
}

function note(l: Lead): string {
  return l.type === "contact"
    ? [l.kind, l.message].filter(Boolean).join("｜")
    : [l.asset, l.themes].filter(Boolean).join("｜");
}

const PRIORITY_LABEL = ["", "低", "やや低", "中", "高", "最優先"];

function PriorityBadge({ p }: { p?: number }) {
  if (!p) return <span className={styles.pNone}>—</span>;
  return (
    <span className={`${styles.pBadge} ${styles["p" + p]}`} title={PRIORITY_LABEL[p]}>
      {p}
    </span>
  );
}

function HandlingBadge({ h }: { h?: string }) {
  if (h === "human") return <span className={`${styles.hBadge} ${styles.hHuman}`}>要対応</span>;
  if (h === "auto") return <span className={`${styles.hBadge} ${styles.hAuto}`}>自動可</span>;
  return <span className={styles.pNone}>—</span>;
}

export default function AdminDashboard() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [items, setItems] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [viewer, setViewer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  const load = useCallback(
    async (reset: boolean) => {
      setLoading(true);
      setError("");
      const off = reset ? 0 : offset;
      const params = new URLSearchParams({ limit: String(PAGE), offset: String(off) });
      if (q) params.set("q", q);
      if (type) params.set("type", type);
      try {
        const res = await fetch(`/api/admin/leads?${params.toString()}`, { credentials: "include" });
        const j = (await res.json().catch(() => ({}))) as {
          ok?: boolean; error?: string; reason?: string;
          total?: number; items?: Lead[]; viewer?: string | null;
        };
        if (!res.ok || !j.ok) {
          if (res.status === 403) {
            setError("アクセス権限がありません。Cloudflare Access のログイン／設定をご確認ください。");
          } else if (res.status === 503) {
            setError("データベース（D1）が未接続です。Pages の Bindings に DB を設定してください。");
          } else {
            setError(j.error || `読み込みに失敗しました（${res.status}）。`);
          }
          if (reset) setItems([]);
          return;
        }
        setTotal(j.total ?? 0);
        setViewer(j.viewer ?? null);
        setItems((prev) => (reset ? j.items ?? [] : [...prev, ...(j.items ?? [])]));
        setOffset(off + (j.items?.length ?? 0));
      } catch {
        setError("通信エラーが発生しました。");
      } finally {
        setLoading(false);
      }
    },
    [q, type, offset]
  );

  // initial load
  useEffect(() => {
    load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    setOffset(0);
    load(true);
  }

  const csvHref = (() => {
    const params = new URLSearchParams({ format: "csv" });
    if (q) params.set("q", q);
    if (type) params.set("type", type);
    return `/api/admin/leads?${params.toString()}`;
  })();

  return (
    <div className={styles.wrap}>
      <header className={styles.top}>
        <div>
          <h1 className={styles.h1}>リード管理</h1>
          <p className={styles.sub}>
            問い合わせ・資料ダウンロードの受信一覧（Cloudflare D1）
            {viewer ? <> ・ <span className={styles.viewer}>{viewer}</span></> : null}
          </p>
        </div>
        <a className={styles.csvBtn} href={csvHref}>CSVエクスポート</a>
      </header>

      <form className={styles.controls} onSubmit={onSearch}>
        <input
          className={styles.search}
          type="search"
          placeholder="会社名・氏名・メール・本文で検索"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className={styles.select} value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">すべて</option>
          <option value="contact">お問い合わせ</option>
          <option value="download">資料ダウンロード</option>
        </select>
        <button className={styles.searchBtn} type="submit">検索</button>
      </form>

      {error ? <div className={styles.error}>{error}</div> : null}

      <div className={styles.meta}>
        {loading && items.length === 0 ? "読み込み中…" : `${total.toLocaleString("ja-JP")} 件`}
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th></th>
              <th>受信日時</th>
              <th>種別</th>
              <th title="AIによる優先度（1〜5・企業規模×決裁権×緊度）">優先</th>
              <th title="AIによる振り分け（要対応＝人間 / 自動可）">対応</th>
              <th>会社名</th>
              <th>氏名</th>
              <th title="AIが推奨する次の一手">次の一手</th>
              <th>AI要約</th>
            </tr>
          </thead>
          <tbody>
            {items.map((l) => {
              const open = expanded === l.id;
              return (
                <Fragment key={l.id}>
                  <tr className={styles.row} onClick={() => setExpanded(open ? null : l.id)}>
                    <td className={styles.caret}>{open ? "▾" : "▸"}</td>
                    <td className={styles.nowrap}>{fmtDate(l.created_at)}</td>
                    <td>
                      <span className={`${styles.badge} ${l.type === "contact" ? styles.bContact : styles.bDownload}`}>
                        {l.type === "contact" ? "問い合わせ" : "資料DL"}
                      </span>
                    </td>
                    <td><PriorityBadge p={l.ai_priority} /></td>
                    <td><HandlingBadge h={l.ai_handling} /></td>
                    <td>{l.company || "—"}</td>
                    <td className={styles.nowrap}>{`${l.last_name ?? ""}${l.first_name ?? ""}` || "—"}</td>
                    <td className={styles.note} title={l.ai_next_action || ""}>{l.ai_next_action || "—"}</td>
                    <td className={styles.note} title={l.ai_summary || ""}>
                      {l.ai_summary || (l.ai_status === "error" ? <span className={styles.aiErr}>AI失敗</span> : <span className={styles.aiPending}>—</span>)}
                    </td>
                  </tr>
                  {open ? (
                    <tr className={styles.detailRow}>
                      <td colSpan={9}>
                        <div className={styles.detail}>
                          <div className={styles.detailGrid}>
                            <div><span className={styles.dl}>電話</span>{l.phone || "—"}</div>
                            <div><span className={styles.dl}>所在地</span>{l.pref || "—"}</div>
                            <div><span className={styles.dl}>従業員数</span>{l.size || "—"}</div>
                            <div><span className={styles.dl}>役回り</span>{l.role || "—"}</div>
                            <div><span className={styles.dl}>役職</span>{l.title || "—"}</div>
                            <div><span className={styles.dl}>AI意図</span>{l.ai_intent || "—"}</div>
                          </div>
                          {l.ai_priority_reason || l.ai_next_action || l.ai_talking_points ? (
                            <div className={styles.aiPanel}>
                              <div className={styles.aiPanelHead}>
                                <span className={styles.dl}>AIトリアージ</span>
                                <PriorityBadge p={l.ai_priority} />
                                <HandlingBadge h={l.ai_handling} />
                              </div>
                              {l.ai_priority_reason ? (
                                <div className={styles.aiRow}><span className={styles.aiK}>優先度の根拠</span><span>{l.ai_priority_reason}</span></div>
                              ) : null}
                              {l.ai_next_action ? (
                                <div className={styles.aiRow}><span className={styles.aiK}>次の一手</span><span>{l.ai_next_action}</span></div>
                              ) : null}
                              {l.ai_talking_points ? (
                                <div className={styles.aiRow}><span className={styles.aiK}>商談の切り口</span><span>{l.ai_talking_points}</span></div>
                              ) : null}
                            </div>
                          ) : null}
                          <div className={styles.detailBlock}>
                            <span className={styles.dl}>{l.type === "contact" ? "お問い合わせ内容" : "請求資料・関心テーマ"}</span>
                            <p className={styles.detailText}>{note(l) || "—"}</p>
                          </div>
                          {l.roi ? (
                            <div className={styles.detailBlock}>
                              <span className={styles.dl}>ROI試算</span>
                              <p className={styles.detailText}>{l.roi}</p>
                            </div>
                          ) : null}
                          {l.ai_reply ? (
                            <div className={styles.detailBlock}>
                              <span className={styles.dl}>AI返信ドラフト（低スコア/自動対応向け）</span>
                              <p className={styles.replyText}>{l.ai_reply}</p>
                              <button
                                className={styles.copyBtn}
                                onClick={() => {
                                  navigator.clipboard?.writeText(l.ai_reply || "");
                                  setCopied(l.id);
                                  setTimeout(() => setCopied((c) => (c === l.id ? null : c)), 1500);
                                }}
                              >
                                {copied === l.id ? "コピーしました" : "返信文をコピー"}
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
            {!loading && items.length === 0 && !error ? (
              <tr><td colSpan={9} className={styles.empty}>該当するリードはありません。</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {items.length < total ? (
        <div className={styles.more}>
          <button className={styles.moreBtn} onClick={() => load(false)} disabled={loading}>
            {loading ? "読み込み中…" : "もっと読み込む"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
