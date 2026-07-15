"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./SiteHeader.module.css";
import logoMark from "@/public/logo-mark.png";

const NAV = [
  { label: "サービス", href: "/service" },
  { label: "導入事例", href: "/cases" },
  { label: "会社概要", href: "/company" },
  { label: "マガジン", href: "/magazine" },
];

export default function SiteHeader({
  variant = "overlay",
}: {
  variant?: "overlay" | "solid";
}) {
  const [open, setOpen] = useState(false);

  const content = (
    <>
      <div className={styles.bar}>
        <Link href="/" className={styles.brand} onClick={() => setOpen(false)}>
          <Image src={logoMark} alt="AI総合戦略研究所" className={styles.brandMark} height={32} priority />
          <span className={styles.brandText}>
            <span className={styles.brandName}>AI総合戦略研究所</span>
            <span className={styles.brandSub}>AI STRATEGY INSTITUTE</span>
          </span>
        </Link>

        <nav className={styles.nav}>
          {NAV.map((item) => (
            <Link key={item.href} className="navlink" href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link className="navlink" href="/contact">無料相談</Link>
          <Link className="glassBtn" href="/download">資料ダウンロード</Link>
        </div>

        <button
          type="button"
          className={`${styles.burger}${open ? ` ${styles.burgerOpen}` : ""}`}
          aria-label="メニュー"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className={styles.mobilePanel}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.mobileInner}>
              {NAV.map((item) => (
                <Link key={item.href} className={styles.mobileLink} href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              ))}
              <Link className={styles.mobileLink} href="/contact" onClick={() => setOpen(false)}>無料相談</Link>
              <div className={styles.mobileActions}>
                <Link className="glassBtn" href="/download" onClick={() => setOpen(false)}>資料ダウンロード</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  if (variant === "solid") {
    return (
      <header className={`${styles.header} ${styles.solid}`}>
        <div className={styles.inner}>{content}</div>
      </header>
    );
  }
  return <header className={styles.header}>{content}</header>;
}
