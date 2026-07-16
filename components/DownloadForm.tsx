"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Icon from "./Icon";
import Button from "./Button";
import styles from "./form.module.css";

const REQUIRED = ["company", "name", "email", "size"];
const THEMES = ["業務効率化", "売上拡大", "コスト最適化", "データ活用"];

const val = (form: HTMLFormElement, name: string) =>
  ((form.elements.namedItem(name) as HTMLInputElement | null)?.value ?? "").trim();

export default function DownloadForm() {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data: Record<string, string | string[]> = {};
    REQUIRED.forEach((k) => { data[k] = val(form, k); });
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
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const j = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && j.ok) setSubmitted(true);
      else setError(j.error || "送信に失敗しました。時間をおいて再度お試しください。");
    } catch {
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
          <Button href="/contact" variant="primary" size="md">あわせて相談する</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>ご提案資料をリクエスト</div>
      <form className={styles.form} onSubmit={onSubmit} noValidate style={{ gap: "18px" }}>
        <div>
          <label className={styles.lbl} htmlFor="company">会社名 <span className={styles.req}>*</span></label>
          <input id="company" name="company" className={styles.fld} type="text" placeholder="株式会社〇〇" />
        </div>
        <div>
          <label className={styles.lbl} htmlFor="name">お名前 <span className={styles.req}>*</span></label>
          <input id="name" name="name" className={styles.fld} type="text" placeholder="山田 太郎" />
        </div>
        <div>
          <label className={styles.lbl} htmlFor="email">メールアドレス（業務用） <span className={styles.req}>*</span></label>
          <input id="email" name="email" className={styles.fld} type="email" placeholder="you@company.co.jp" />
        </div>
        <div>
          <label className={styles.lbl} htmlFor="size">従業員規模 <span className={styles.req}>*</span></label>
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
