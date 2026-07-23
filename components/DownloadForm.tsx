"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Icon from "./Icon";
import Button from "./Button";
import { DEFAULT_ASSET_ID, getAsset } from "@/lib/assets";
import { isFreeEmail, FREE_EMAIL_MESSAGE } from "@/lib/freeEmail";
import { PREFECTURES } from "./prefectures";
import { trackLeadSubmit } from "@/lib/analytics-client";
import styles from "./form.module.css";

// Same lead fields as the contact form so both capture equivalent information.
const REQUIRED = [
  "company", "pref", "size", "role", "title",
  "last", "first", "email", "phone",
];
const THEMES = ["業務効率化", "売上拡大", "コスト最適化", "データ活用"];

const val = (form: HTMLFormElement, name: string) =>
  ((form.elements.namedItem(name) as HTMLInputElement | null)?.value ?? "").trim();

export default function DownloadForm() {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Which asset to distribute — from ?asset=<id> (article deep-links), else the
  // default service guide. Unknown ids fall back to the default.
  const requested = useSearchParams().get("asset");
  const assetId = getAsset(requested) ? (requested as string) : DEFAULT_ASSET_ID;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data: Record<string, string | string[]> = {};
    REQUIRED.forEach((k) => { data[k] = val(form, k); });
    data.asset = assetId;
    data.themes = Array.from(
      form.querySelectorAll<HTMLInputElement>('input[name="theme"]:checked')
    ).map((el) => el.value);

    if (REQUIRED.some((k) => !data[k])) {
      setError("必須項目（*）をすべてご入力ください。");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email as string)) {
      setError("メールアドレスの形式をご確認ください。");
      return;
    }
    if (isFreeEmail(data.email as string)) {
      setError(FREE_EMAIL_MESSAGE);
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const j = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && j.ok) {
        trackLeadSubmit("download", "success", assetId);
        setSubmitted(true);
      } else {
        trackLeadSubmit("download", "error", j.error || "api_error");
        setError(j.error || "送信に失敗しました。時間をおいて再度お試しください。");
      }
    } catch {
      trackLeadSubmit("download", "error", "network_error");
      setError("通信エラーが発生しました。時間をおいて再度お試しください。");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className={styles.card}>
        <div className={styles.success}>
          <span className={styles.successIcon}><Icon name="check" size={32} /></span>
          <h2 className={styles.successTitle}>ありがとうございます。</h2>
          <p className={styles.successText}>
            ご入力のメールアドレスへ、ご提案資料（PDF）をお送りしました。ご確認ください。
          </p>
          <Button href="/contact" variant="primary" size="md" analyticsLabel="download_followup_contact" analyticsLocation="download_form_success">あわせて相談する</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>ご提案資料をリクエスト</div>
      <form id="download-form" className={styles.form} onSubmit={onSubmit} noValidate style={{ gap: "18px" }}>
        <input type="hidden" name="asset" value={assetId} readOnly />
        <div>
          <label className={styles.lbl} htmlFor="company">会社名 <span className={styles.req}>*</span></label>
          <input id="company" name="company" className={styles.fld} type="text" placeholder="例）株式会社〇〇〇〇〇" />
        </div>
        <div>
          <label className={styles.lbl} htmlFor="pref">会社所在地（都道府県） <span className={styles.req}>*</span></label>
          <select id="pref" name="pref" className={styles.fld} defaultValue="">
            <option value="">選択してください</option>
            {PREFECTURES.map((pref) => (
              <option key={pref} value={pref}>{pref}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={styles.lbl} htmlFor="size">従業員数 <span className={styles.req}>*</span></label>
          <select id="size" name="size" className={styles.fld} defaultValue="">
            <option value="">選択してください</option>
            <option value="1-10">1〜10名</option>
            <option value="11-49">11〜49名</option>
            <option value="50-100">50〜100名</option>
            <option value="100-300">100〜300名</option>
            <option value="300-1000">300〜1,000名</option>
            <option value="1000+">1,000名以上</option>
          </select>
        </div>
        <div>
          <label className={styles.lbl} htmlFor="role">あなたのメインのお役回りを1つご選択ください <span className={styles.req}>*</span></label>
          <select id="role" name="role" className={styles.fld} defaultValue="">
            <option value="">選択してください</option>
            <option value="経営・役員">経営・役員</option>
            <option value="情報システム・IT">情報システム・IT</option>
            <option value="事業・企画">事業・企画</option>
            <option value="営業・マーケティング">営業・マーケティング</option>
            <option value="管理・バックオフィス">管理・バックオフィス</option>
            <option value="その他">その他</option>
          </select>
        </div>
        <div>
          <label className={styles.lbl} htmlFor="title">役職名 <span className={styles.req}>*</span></label>
          <select id="title" name="title" className={styles.fld} defaultValue="">
            <option value="">選択してください</option>
            <option value="経営者・役員">経営者・役員</option>
            <option value="部長クラス">部長クラス</option>
            <option value="課長・マネージャー">課長・マネージャー</option>
            <option value="担当者">担当者</option>
            <option value="その他">その他</option>
          </select>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label className={styles.lbl} htmlFor="last">姓 <span className={styles.req}>*</span></label>
            <input id="last" name="last" className={styles.fld} type="text" placeholder="例）山田" />
          </div>
          <div>
            <label className={styles.lbl} htmlFor="first">名 <span className={styles.req}>*</span></label>
            <input id="first" name="first" className={styles.fld} type="text" placeholder="例）太郎" />
          </div>
        </div>
        <div>
          <label className={styles.lbl} htmlFor="email">メールアドレス（業務用） <span className={styles.req}>*</span></label>
          <input id="email" name="email" className={styles.fld} type="email" placeholder="例）account@company.com" />
          <p className={styles.hint}>フリーメール（Gmail・Yahoo!メール・携帯キャリアメール等）はご利用いただけません。貴社ドメインのメールアドレスをご入力ください。</p>
        </div>
        <div>
          <label className={styles.lbl} htmlFor="phone">ご連絡がつきやすい携帯電話番号 <span className={styles.req}>*</span></label>
          <input id="phone" name="phone" className={styles.fld} type="tel" placeholder="例）09012345678" />
        </div>
        <div>
          <label className={styles.lbl}>関心のあるテーマ <span className={styles.optional}>（複数選択可）</span></label>
          <div className={styles.checks}>
            {THEMES.map((t) => (
              <label key={t} className={styles.check}>
                <input type="checkbox" name="theme" value={t} />
                <span>{t}</span>
              </label>
            ))}
          </div>
        </div>
        {error ? <div className={styles.error}>{error}</div> : null}
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          style={{ width: "100%", marginTop: "4px" }}
          disabled={submitting}
        >
          {submitting ? "送信中…" : "資料をリクエストする"}
          {!submitting && <Icon name="arrow-right" size={17} />}
        </button>
        <p className={styles.consent}>
          ご登録内容は<Link href="/privacy">プライバシーポリシー</Link>に基づき適切に管理・保護されます。
        </p>
      </form>
    </div>
  );
}
