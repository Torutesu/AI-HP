"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { trackCtaClick } from "@/lib/analytics-client";
import styles from "./RoiSimulator.module.css";

/**
 * Lightweight, honest ROI estimator embedded below the hero.
 * It shows the *value of the capacity freed up* — framed as a rough estimate,
 * not a guaranteed saving — so it stays consistent with the site disclaimer.
 */
const clamp = (n: number, min: number, max: number) =>
  Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min;

function formatMan(yen: number) {
  const man = yen / 10000;
  if (man >= 10000) {
    return `約 ${(man / 10000).toLocaleString("ja-JP", { maximumFractionDigits: 1 })} 億円`;
  }
  return `約 ${Math.round(man).toLocaleString("ja-JP")} 万円`;
}

export default function RoiSimulator() {
  const [emp, setEmp] = useState(50);
  const [salaryMan, setSalaryMan] = useState(40);
  const [rate, setRate] = useState(20);

  const annualYen = emp * salaryMan * 10000 * (rate / 100) * 12;
  const monthlyHours = emp * 160 * (rate / 100);

  // Stash the estimate so the contact form can attach it to the lead
  // (internal tracking only — never shown to the visitor).
  function stashEstimate() {
    try {
      sessionStorage.setItem(
        "roiEstimate",
        JSON.stringify({ emp, salaryMan, rate, annualYen, monthlyHours }),
      );
    } catch {
      /* private mode / storage disabled — tracking is best-effort */
    }
  }

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>貴社の投資対効果を試算</h3>
      <p className={styles.lead}>3項目を入力するだけで、AI活用で創出できる価値の概算をご提示します。</p>

      <div className={styles.fields}>
        <label className={styles.field}>
          <span className={styles.label}>対象となる人数<span className={styles.labelVal}>{emp.toLocaleString("ja-JP")} 人</span></span>
          <input
            className={styles.input}
            type="number"
            min={1}
            max={100000}
            value={emp}
            onChange={(e) => setEmp(clamp(parseInt(e.target.value, 10), 1, 100000))}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>一人あたり平均月給<span className={styles.labelVal}>{salaryMan} 万円</span></span>
          <input
            className={styles.input}
            type="number"
            min={20}
            max={200}
            value={salaryMan}
            onChange={(e) => setSalaryMan(clamp(parseInt(e.target.value, 10), 20, 200))}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>
            AIで代替できる業務の割合
            <span className={styles.labelVal}>{rate}%</span>
          </span>
          <input
            className={styles.range}
            type="range"
            min={5}
            max={50}
            step={1}
            value={rate}
            onChange={(e) => setRate(parseInt(e.target.value, 10))}
          />
        </label>
      </div>

      <div className={styles.result}>
        <div className={styles.resultRow}>
          <span className={styles.resultLabel}>年間で創出できる価値<span className={styles.resultSub}>（概算）</span></span>
          <span className={styles.resultValue}>{formatMan(annualYen)}</span>
        </div>
        <div className={styles.resultDivider} />
        <div className={styles.resultRow}>
          <span className={styles.resultLabel}>月あたり創出できる時間</span>
          <span className={styles.resultValueSm}>約 {Math.round(monthlyHours).toLocaleString("ja-JP")} 時間</span>
        </div>
      </div>

      <p className={styles.note}>
        ※ 一般的な前提に基づく概算であり、効果を保証するものではありません。実際の試算は無料相談で詳細にご提示します。
      </p>

      <a
        className={styles.btn}
        href="/contact"
        onClick={() => {
          stashEstimate();
          trackCtaClick("roi_simulator_contact", "/contact", "roi_simulator");
        }}
      >
        この試算をもとに相談する<Icon name="arrow-right" size={17} />
      </a>
    </div>
  );
}
