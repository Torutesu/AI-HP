"use client";

import { useCallback, useEffect, useState } from "react";
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

export default function AdminDashboard() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [items, setItems] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [viewer, setViewer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
              <th>受信日時</th>
              <th>種別</th>
              <th>会社名</th>
              <th>氏名</th>
              <th>メール</th>
              <th>電話</th>
              <th>補足</th>
            </tr>
          </thead>
          <tbody>
            {items.map((l) => (
              <tr key={l.id}>
                <td className={styles.nowrap}>{fmtDate(l.created_at)}</td>
                <td>
                  <span className={`${styles.badge} ${l.type === "contact" ? styles.bContact : styles.bDownload}`}>
                    {l.type === "contact" ? "問い合わせ" : "資料DL"}
                  </span>
                </td>
                <td>{l.company || "—"}</td>
                <td className={styles.nowrap}>{`${l.last_name ?? ""}${l.first_name ?? ""}` || "—"}</td>
                <td>{l.email ? <a href={`mailto:${l.email}`}>{l.email}</a> : "—"}</td>
                <td className={styles.nowrap}>{l.phone || "—"}</td>
                <td className={styles.note} title={note(l)}>{note(l) || "—"}</td>
              </tr>
            ))}
            {!loading && items.length === 0 && !error ? (
              <tr><td colSpan={7} className={styles.empty}>該当するリードはありません。</td></tr>
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
