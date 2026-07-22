import Link from "next/link";
import Image from "next/image";
import styles from "./SiteFooter.module.css";
import logoMark from "@/public/logo-mark.png";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brandCol}>
          <Link href="/" className={styles.brand} aria-label="AI総合戦略研究所 ホーム">
            <Image src={logoMark} alt="AI総合戦略研究所" height={30} className={styles.brandMark} />
            <span className={styles.brandText}>
              <span className={styles.brandName}>AI総合戦略研究所</span>
              <span className={styles.brandSub}>AI STRATEGY INSTITUTE</span>
            </span>
          </Link>
          <p className={styles.tagline}>
            AI Native企業を、産み出す。試すだけで終わらせず、経営の数字が動く形で実装する。
          </p>
        </div>

        <div className={styles.cols}>
          <div>
            <div className={styles.colTitle}>サービス</div>
            <ul className={styles.list}>
              <li><Link href="/ai-os">AI経営基盤</Link></li>
              <li><Link href="/consulting">コンサルティング</Link></li>
              <li><Link href="/cases">導入事例</Link></li>
            </ul>
          </div>
          <div>
            <div className={styles.colTitle}>会社情報</div>
            <ul className={styles.list}>
              <li><Link href="/company">会社概要</Link></li>
              <li><Link href="/magazine">マガジン</Link></li>
              <li><Link href="/recruiting">採用情報</Link></li>
              <li><Link href="/partners">パートナー募集</Link></li>
              <li><Link href="/download">資料ダウンロード</Link></li>
              <li><Link href="/contact">お問い合わせ</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.bottomInner}>
          <div className={styles.legal}>
            <Link href="/privacy">プライバシーポリシー</Link>
            <Link href="/editorial-policy">編集方針</Link>
          </div>
          <span className={styles.copy}>© AI Strategy Institute All Rights Reserved.</span>
        </div>
      </div>
    </footer>
  );
}
