"use client";

import { useState } from "react";
import Icon from "./Icon";
import styles from "./AiOsShowcase.module.css";

type PreviewKey =
  | "リード獲得AI"
  | "提案書自動生成"
  | "顧客分析・ランキング付け"
  | "コンテンツ生成"
  | "営業支援AI"
  | "価格最適化"
  | "マーケ最適化AI";

const TABS: PreviewKey[] = [
  "リード獲得AI",
  "提案書自動生成",
  "顧客分析・ランキング付け",
  "コンテンツ生成",
  "営業支援AI",
  "価格最適化",
  "マーケ最適化AI",
];

const KPI_BY_TAB: Record<PreviewKey, { label: string; value: string; delta: string }[]> = {
  リード獲得AI: [
    { label: "商談化率", value: "24.3%", delta: "+6.4pt" },
    { label: "高スコア企業", value: "412", delta: "+18.7%" },
    { label: "受注見込み額", value: "¥128.6M", delta: "+22.1%" },
  ],
  提案書自動生成: [
    { label: "作成時間", value: "30分", delta: "-82%" },
    { label: "提案初稿", value: "25頁", delta: "自動構成" },
    { label: "案件化速度", value: "3.2倍", delta: "+2.4x" },
  ],
  "顧客分析・ランキング付け": [
    { label: "優先顧客", value: "85社", delta: "+31%" },
    { label: "離脱予兆", value: "18社", delta: "検知中" },
    { label: "受注確度", value: "92点", delta: "上位群" },
  ],
  コンテンツ生成: [
    { label: "週次出稿量", value: "42本", delta: "+3.8x" },
    { label: "制作時間", value: "1/5", delta: "-79%" },
    { label: "CV導線案", value: "16件", delta: "自動提案" },
  ],
  営業支援AI: [
    { label: "商談準備", value: "28分", delta: "-12%" },
    { label: "受注率", value: "68%", delta: "+8pt" },
    { label: "次アクション率", value: "82%", delta: "+15%" },
  ],
  価格最適化: [
    { label: "推奨価格", value: "¥11,000", delta: "+12%" },
    { label: "粗利率", value: "43%", delta: "+3pt" },
    { label: "感度分析", value: "7案", delta: "自動計算" },
  ],
  マーケ最適化AI: [
    { label: "ROAS", value: "512%", delta: "+18%" },
    { label: "CPA", value: "¥2,100", delta: "-14%" },
    { label: "改善案", value: "9件", delta: "毎朝更新" },
  ],
};

const ROWS_BY_TAB: Record<PreviewKey, { left: string; right: string; meta?: string }[]> = {
  リード獲得AI: [
    { left: "株式会社A", right: "資料DL → 架電", meta: "スコア 92" },
    { left: "株式会社B", right: "ウェビナー参加", meta: "スコア 85" },
    { left: "株式会社C", right: "料金ページ閲覧", meta: "スコア 68" },
    { left: "株式会社D", right: "プロダクト比較", meta: "スコア 45" },
  ],
  提案書自動生成: [
    { left: "1. 表紙", right: "会社情報を自動差し込み" },
    { left: "2. 課題整理", right: "ヒアリングメモから構成" },
    { left: "3. 導入効果", right: "ROI試算を自動反映" },
    { left: "4. 見積ドラフト", right: "プラン別に出力" },
  ],
  "顧客分析・ランキング付け": [
    { left: "製造業セグメント", right: "優先度 A", meta: "確度 92%" },
    { left: "不動産セグメント", right: "優先度 B", meta: "確度 85%" },
    { left: "人材セグメント", right: "優先度 C", meta: "離脱 25%" },
    { left: "SaaSセグメント", right: "優先度 D", meta: "再接触推奨" },
  ],
  コンテンツ生成: [
    { left: "記事（ブログ）", right: "経営とAIの勝ち筋を解説" },
    { left: "LPコピー", right: "課題訴求 → ROI訴求へ" },
    { left: "メール案", right: "役員向け2パターン生成" },
    { left: "事例紹介", right: "業界別の導入効果に変換" },
  ],
  営業支援AI: [
    { left: "次アクション", right: "提案資料ドラフトを送付" },
    { left: "懸念点", right: "既存SaaSからの移行不安" },
    { left: "推奨トーク", right: "現場定着まで伴走を強調" },
    { left: "会議メモ", right: "役員会向けROI整理" },
  ],
  価格最適化: [
    { left: "シナリオ A", right: "¥10,000 / 粗利 40%" },
    { left: "シナリオ B", right: "¥11,000 / 粗利 43%" },
    { left: "シナリオ C", right: "¥12,000 / 粗利 45%" },
    { left: "感度分析", right: "価格弾力を自動計算" },
  ],
  マーケ最適化AI: [
    { left: "検索広告", right: "CPA 改善余地あり" },
    { left: "ディスプレイ", right: "CVR 上昇中" },
    { left: "SNS配信", right: "訴求別の勝ち筋あり" },
    { left: "メール", right: "再配分を推奨" },
  ],
};

const SUMMARY_BY_TAB: Record<PreviewKey, string> = {
  リード獲得AI: "今あたるべき企業を、スコアと次アクション付きで整理します。",
  提案書自動生成: "提案書の初稿を、会社情報と課題に合わせて自動構成します。",
  "顧客分析・ランキング付け": "受注確度や離脱予兆をもとに、優先順位を可視化します。",
  コンテンツ生成: "記事、LP、メールまで、用途別にドラフトを量産できます。",
  営業支援AI: "商談要約から推奨トークまで、営業の次の一手を整えます。",
  価格最適化: "価格の上げ下げが粗利にどう効くかを、その場で比較できます。",
  マーケ最適化AI: "媒体別の成果を整理し、次に動かす予算と訴求を示します。",
};

export default function AiOsShowcase() {
  const [active, setActive] = useState<PreviewKey>("リード獲得AI");
  const kpis = KPI_BY_TAB[active];
  const rows = ROWS_BY_TAB[active];

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.title}>向上の層</div>
        <p className={styles.text}>生まれた力を、売上へと変える層です。営業やマーケティングの現場で使えるAIを、貴社に内製します。</p>
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
        <div className={styles.previewMain}>
          <div className={styles.kpiRow}>
            {kpis.map((kpi) => (
              <div key={kpi.label} className={styles.kpiCard}>
                <div className={styles.kpiLabel}>{kpi.label}</div>
                <div className={styles.kpiValue}>{kpi.value}</div>
                <div className={styles.kpiDelta}>{kpi.delta}</div>
              </div>
            ))}
          </div>

          <div className={styles.table}>
            {rows.map((row) => (
              <div key={row.left} className={styles.tableRow}>
                <div>
                  <div className={styles.rowLeft}>{row.left}</div>
                  {row.meta ? <div className={styles.rowMeta}>{row.meta}</div> : null}
                </div>
                <div className={styles.rowRight}>{row.right}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.previewSide}>
          <div className={styles.sideChart}>
            <div className={styles.sideChartBars}>
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className={styles.sideChartLine} />
          </div>
          <p className={styles.summary}>{SUMMARY_BY_TAB[active]}</p>
          <div className={styles.sideFoot}>
            <span className={styles.sideFootIcon}><Icon name="sparkles" size={14} /></span>
            AIが運用データをもとに毎朝アップデート
          </div>
        </div>
      </div>
    </div>
  );
}
