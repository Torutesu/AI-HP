"use client";

import { useState } from "react";
import Icon from "./Icon";
import styles from "./CostDownShowcase.module.css";

type CostKey = "工数・人件費" | "SaaS費" | "外注費" | "間接業務";

type CostData = {
  kpis: { label: string; value: string; delta: string }[];
  rows: { item: string; detail: string; effect: string }[];
  summary: string;
};

const TABS: CostKey[] = ["工数・人件費", "SaaS費", "外注費", "間接業務"];

const DATA: Record<CostKey, CostData> = {
  "工数・人件費": {
    kpis: [
      { label: "月間削減", value: "420h", delta: "-58%" },
      { label: "年間効果", value: "2,016万円", delta: "概算" },
      { label: "自動化率", value: "68%", delta: "+42pt" },
    ],
    rows: [
      { item: "請求書処理", detail: "AI-OCR・仕訳", effect: "120h → 28h" },
      { item: "営業日報", detail: "音声入力・CRM連携", effect: "96h → 18h" },
      { item: "会議録作成", detail: "文字起こし・要約", effect: "72h → 8h" },
      { item: "データ集計", detail: "集計・レポート自動化", effect: "132h → 48h" },
    ],
    summary: "定型作業をAIへ移し、人が判断と顧客対応に使える時間を取り戻します。",
  },
  SaaS費: {
    kpis: [
      { label: "月額費用", value: "29万円", delta: "-66%" },
      { label: "統合対象", value: "7ツール", delta: "→ 2基盤" },
      { label: "年間効果", value: "672万円", delta: "概算" },
    ],
    rows: [
      { item: "CRM", detail: "顧客・案件管理", effect: "28万 → 9万円" },
      { item: "MA", detail: "配信・スコアリング", effect: "22万 → 7万円" },
      { item: "BI", detail: "集計・可視化", effect: "18万 → 5万円" },
      { item: "議事録ほか", detail: "要約・社内検索", effect: "17万 → 8万円" },
    ],
    summary: "重複するSaaS機能を一つのAI基盤へまとめ、固定費と運用負荷を同時に削ります。",
  },
  外注費: {
    kpis: [
      { label: "年間削減", value: "1,480万円", delta: "概算" },
      { label: "内製化率", value: "74%", delta: "+51pt" },
      { label: "納期", value: "1/4", delta: "短縮" },
    ],
    rows: [
      { item: "記事・LP制作", detail: "構成・初稿生成", effect: "月120万 → 36万円" },
      { item: "データ集計", detail: "収集・整形・分析", effect: "月70万 → 18万円" },
      { item: "定型開発", detail: "AIモジュール活用", effect: "月95万 → 32万円" },
      { item: "調査レポート", detail: "検索・要約・出典整理", effect: "月48万 → 12万円" },
    ],
    summary: "繰り返し発生する外注業務を社内AIへ置き換え、速度と知見を社内に残します。",
  },
  間接業務: {
    kpis: [
      { label: "月間削減", value: "310h", delta: "-54%" },
      { label: "対象業務", value: "18件", delta: "自動化" },
      { label: "入力ミス", value: "-82%", delta: "削減" },
    ],
    rows: [
      { item: "採用・労務", detail: "候補者整理・問合せ", effect: "月86h削減" },
      { item: "経理", detail: "照合・仕訳・督促", effect: "月94h削減" },
      { item: "法務", detail: "契約チェック・検索", effect: "月52h削減" },
      { item: "総務", detail: "申請・社内FAQ", effect: "月78h削減" },
    ],
    summary: "部署をまたぐ細かな定型業務をつなぎ、手戻りと待ち時間まで減らします。",
  },
};

export default function CostDownShowcase() {
  const [active, setActive] = useState<CostKey>("工数・人件費");
  const current = DATA[active];

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.title}>削減の層</div>
        <p className={styles.text}>業務と固定費を項目ごとに可視化し、AIへ置き換えられる範囲と削減効果を具体化します。</p>
      </div>

      <div className={styles.chips}>
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`${styles.chip} ${active === tab ? styles.chipActive : ""}`}
            onClick={() => setActive(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={styles.preview}>
        <div className={styles.kpiRow}>
          {current.kpis.map((kpi) => (
            <div key={kpi.label} className={styles.kpiCard}>
              <div className={styles.kpiLabel}>{kpi.label}</div>
              <div className={styles.kpiValue}>{kpi.value}</div>
              <div className={styles.kpiDelta}>{kpi.delta}</div>
            </div>
          ))}
        </div>

        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span>削減項目</span><span>置き換える内容</span><span>削減見込み</span>
          </div>
          {current.rows.map((row) => (
            <div key={row.item} className={styles.tableRow}>
              <div className={styles.rowItem}>{row.item}</div>
              <div className={styles.rowDetail}>{row.detail}</div>
              <div className={styles.rowEffect}>{row.effect}</div>
            </div>
          ))}
        </div>

        <div className={styles.summary}>
          <span className={styles.summaryIcon}><Icon name="cpu" size={14} /></span>
          <p>{current.summary}</p>
        </div>
      </div>
    </div>
  );
}
