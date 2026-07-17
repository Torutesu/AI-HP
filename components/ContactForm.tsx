"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Icon from "./Icon";
import Button from "./Button";
import { isFreeEmail, FREE_EMAIL_MESSAGE } from "@/lib/freeEmail";
import styles from "./form.module.css";

/** Reads any ROI estimate stashed by the simulator into a short summary. */
function readRoiEstimate(): string {
  try {
    const raw = sessionStorage.getItem("roiEstimate");
    if (!raw) return "";
    const e = JSON.parse(raw) as {
      emp: number; salaryMan: number; rate: number; annualYen: number; monthlyHours: number;
    };
    const man = Math.round(e.annualYen / 10000).toLocaleString("ja-JP");
    const hrs = Math.round(e.monthlyHours).toLocaleString("ja-JP");
    return `対象${e.emp}人 / 平均月給${e.salaryMan}万円 / 代替率${e.rate}% → 年間創出価値 約${man}万円・月${hrs}時間`;
  } catch {
    return "";
  }
}

const REQUIRED = [
  "company", "pref", "size", "role", "title",
  "last", "first", "email", "phone", "kind", "message",
];

const val = (form: HTMLFormElement, name: string) =>
  ((form.elements.namedItem(name) as HTMLInputElement | null)?.value ?? "").trim();

export default function ContactForm() {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const roiRef = useRef<string>("");

  useEffect(() => { roiRef.current = readRoiEstimate(); }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data: Record<string, string> = {};
    REQUIRED.forEach((k) => { data[k] = val(form, k); });
    if (roiRef.current) data.roi = roiRef.current;

    if (REQUIRED.some((k) => !data[k])) {
      setError("必須項目（*）をすべてご入力ください。");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setError("メールアドレスの形式をご確認ください。");
      return;
    }
    if (isFreeEmail(data.email)) {
      setError(FREE_EMAIL_MESSAGE);
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const j = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && j.ok) {
        try { sessionStorage.removeItem("roiEstimate"); } catch {}
        setSubmitted(true);
      }
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
          <h2 className={styles.successTitle}>送信を受け付けました。</h2>
          <p className={styles.successText}>
            内容を確認のうえ、担当者より1〜2営業日以内にご返信いたします。
          </p>
          <Button href="/" variant="secondary" size="md">トップに戻る</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <div>
          <label className={styles.lbl} htmlFor="company">会社名 <span className={styles.req}>*</span></label>
          <input id="company" name="company" className={styles.fld} type="text" placeholder="例）株式会社〇〇〇〇〇" />
        </div>
        <div>
          <label className={styles.lbl} htmlFor="pref">会社所在地（都道府県） <span className={styles.req}>*</span></label>
          <select id="pref" name="pref" className={styles.fld} defaultValue="">
            <option value="">選択してください</option>
            <option value="北海道・東北">北海道・東北</option>
            <option value="関東">関東</option>
            <option value="中部">中部</option>
            <option value="近畿">近畿</option>
            <option value="中国・四国">中国・四国</option>
            <option value="九州・沖縄">九州・沖縄</option>
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
          <label className={styles.lbl} htmlFor="email">メールアドレス（勤務先） <span className={styles.req}>*</span></label>
          <input id="email" name="email" className={styles.fld} type="email" placeholder="例）account@company.com" />
          <p className={styles.hint}>フリーメール（Gmail・Yahoo!メール・携帯キャリアメール等）はご利用いただけません。貴社ドメインのメールアドレスをご入力ください。</p>
        </div>
        <div>
          <label className={styles.lbl} htmlFor="phone">ご連絡がつきやすい携帯電話番号 <span className={styles.req}>*</span></label>
          <input id="phone" name="phone" className={styles.fld} type="tel" placeholder="例）09012345678" />
        </div>
        <div>
          <label className={styles.lbl} htmlFor="kind">お問い合わせ種別 <span className={styles.req}>*</span></label>
          <select id="kind" name="kind" className={styles.fld} defaultValue="">
            <option value="">選択してください</option>
            <option value="サービスについて">サービスについて</option>
            <option value="費用・お見積り">費用・お見積り</option>
            <option value="無料AI経営診断の希望">無料AI経営診断の希望</option>
            <option value="協業・パートナー">協業・パートナー</option>
            <option value="採用">採用</option>
            <option value="その他">その他</option>
          </select>
        </div>
        <div>
          <label className={styles.lbl} htmlFor="message">お問い合わせ内容 <span className={styles.req}>*</span></label>
          <textarea id="message" name="message" className={styles.fld} rows={5} placeholder="お問い合わせ内容をご記入ください" />
        </div>
        {error ? <div className={styles.error}>{error}</div> : null}
        <div style={{ marginTop: "4px" }}>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%" }} disabled={submitting}>
            {submitting ? "送信中…" : "この内容で送信する"}
          </button>
        </div>
        <p className={styles.consent}>
          送信をもって
          <a href="/privacy" target="_blank" rel="noopener noreferrer">プライバシーポリシー</a>
          に同意したものとみなします。
        </p>
      </form>
    </div>
  );
}
