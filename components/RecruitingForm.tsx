"use client";

import { useMemo, useState, type FormEvent } from "react";
import Icon from "./Icon";
import Button from "./Button";
import { trackLeadSubmit } from "@/lib/analytics-client";
import styles from "./form.module.css";
import local from "./RecruitingForm.module.css";

const POSITION_OPTIONS = [
  "オープンポジション",
  "AIコンサル / 事業設計",
  "AIエンジニア / 実装",
  "セールス / パートナー推進",
  "その他",
];

const val = (form: HTMLFormElement, name: string) =>
  ((form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null)?.value ?? "").trim();

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value >= 10 || unit === 0 ? Math.round(value) : value.toFixed(1)} ${units[unit]}`;
}

function humanizeFile(file: File | null): string {
  if (!file) return "未選択";
  return `${file.name} ・ ${formatBytes(file.size)}`;
}

export default function RecruitingForm() {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const accepted = useMemo(() => ".pdf,.doc,.docx,.png,.jpg,.jpeg", []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("resume") as HTMLInputElement | null;
    const file = fileInput?.files?.[0] ?? null;

    const last = val(form, "last");
    const first = val(form, "first");
    const email = val(form, "email");
    const phone = val(form, "phone");
    const position = val(form, "position");
    const message = val(form, "message");

    if (!last || !first || !email || !phone || !position || !file) {
      setError("必須項目（*）をすべてご入力ください。");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("メールアドレスの形式をご確認ください。");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("ファイルは10MB以内でアップロードしてください。");
      return;
    }

    const data = new FormData();
    data.set("last", last);
    data.set("first", first);
    data.set("email", email);
    data.set("phone", phone);
    data.set("position", position);
    data.set("message", message);
    data.set("kind", "採用応募");
    data.set("resume", file);

    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/recruiting", {
        method: "POST",
        body: data,
      });
      const j = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && j.ok) {
        trackLeadSubmit("recruiting", "success", position);
        setSubmitted(true);
      } else {
        trackLeadSubmit("recruiting", "error", j.error || "api_error");
        setError(j.error || "送信に失敗しました。時間をおいて再度お試しください。");
      }
    } catch {
      trackLeadSubmit("recruiting", "error", "network_error");
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
          <h2 className={styles.successTitle}>応募を受け付けました。</h2>
          <p className={styles.successText}>
            内容を確認のうえ、担当者よりご連絡いたします。履歴書・職務経歴書も受け付けています。
          </p>
          <Button href="/" variant="secondary" size="md" analyticsLabel="recruiting_top_return" analyticsLocation="recruiting_form_success">トップに戻る</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>採用応募フォーム</div>
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <div className={local.stackTwo}>
          <div>
            <label className={styles.lbl} htmlFor="last">姓 <span className={styles.req}>*</span></label>
            <input id="last" name="last" className={styles.fld} type="text" placeholder="例）山田" autoComplete="family-name" />
          </div>
          <div>
            <label className={styles.lbl} htmlFor="first">名 <span className={styles.req}>*</span></label>
            <input id="first" name="first" className={styles.fld} type="text" placeholder="例）太郎" autoComplete="given-name" />
          </div>
        </div>

        <div>
          <label className={styles.lbl} htmlFor="email">メールアドレス <span className={styles.req}>*</span></label>
          <input id="email" name="email" className={styles.fld} type="email" placeholder="例）taro@example.com" autoComplete="email" />
        </div>

        <div>
          <label className={styles.lbl} htmlFor="phone">電話番号 <span className={styles.req}>*</span></label>
          <input id="phone" name="phone" className={styles.fld} type="tel" placeholder="例）09012345678" autoComplete="tel" />
        </div>

        <div>
          <label className={styles.lbl} htmlFor="position">応募職種 <span className={styles.req}>*</span></label>
          <select id="position" name="position" className={styles.fld} defaultValue="">
            <option value="">選択してください</option>
            {POSITION_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className={local.fileCard}>
          <label className={styles.lbl} htmlFor="resume">履歴書か職務経歴書 <span className={styles.req}>*</span></label>
          <input
            id="resume"
            name="resume"
            className={local.fileInput}
            type="file"
            accept={accepted}
            onChange={(ev) => setSelectedFile(ev.currentTarget.files?.[0] ?? null)}
          />
          <div className={local.fileMeta}>{humanizeFile(selectedFile)}</div>
          <div className={local.fileMeta}>PDF / Word / 画像ファイルを受け付けます。10MB以内でお願いします。</div>
        </div>

        <div>
          <label className={styles.lbl} htmlFor="message">補足メッセージ <span className={styles.optional}>（任意）</span></label>
          <textarea
            id="message"
            name="message"
            className={styles.fld}
            rows={5}
            placeholder="応募の背景、希望条件、ポートフォリオURLなどがあればご記入ください"
          />
        </div>

        <div className={local.summary}>
          <div className={local.summaryHead}>
            <span className={local.summaryBadge}>i</span>
            <p className={local.summaryTitle}>送信前にご確認ください</p>
          </div>
          <ul className={local.summaryList}>
            <li>応募職種は「オープンポジション」「その他」も選択できます。</li>
            <li>履歴書・職務経歴書は1ファイル添付してください。</li>
            <li>送信後、担当者より確認のご連絡をいたします。</li>
          </ul>
        </div>

        {error ? <div className={styles.error}>{error}</div> : null}

        <button
          type="submit"
          className="btn btn-primary btn-lg"
          style={{ width: "100%", marginTop: "4px" }}
          disabled={submitting}
        >
          {submitting ? "送信中…" : "この内容で応募する"}
          {!submitting && <Icon name="arrow-right" size={17} />}
        </button>

        <p className={local.privacy}>
          送信内容は
          <a href="/privacy" target="_blank" rel="noopener noreferrer">プライバシーポリシー</a>
          に基づき管理します。
        </p>
      </form>
    </div>
  );
}
