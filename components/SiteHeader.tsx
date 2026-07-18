"use client";

import { useEffect, useState } from "react";
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

const SERVICE_LINKS = [
  {
    eyebrow: "AI OPERATING SYSTEM",
    label: "AI経営基盤",
    description: "業務を置き換え、成果を生むAIを内製",
    href: "/ai-os",
  },
  {
    eyebrow: "STRATEGY & EXECUTION",
    label: "コンサルティング",
    description: "事業理解から戦略・実装まで伴走",
    href: "/consulting",
  },
];

export default function SiteHeader({
  variant = "overlay",
}: {
  variant?: "overlay" | "solid";
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          {NAV.map((item) => item.href === "/service" ? (
            <div key={item.href} className={styles.serviceNav}>
              <Link className={`navlink ${styles.serviceTrigger}`} href={item.href} aria-haspopup="true">
                {item.label}<span className={styles.serviceCaret} aria-hidden="true" />
              </Link>
              <div className={styles.serviceDropdown} aria-label="サービスメニュー">
                <div className={styles.serviceDropdownHead}>
                  <span>OUR SERVICES</span>
                  <Link href="/service">サービス一覧</Link>
                </div>
                <div className={styles.serviceDropdownGrid}>
                  {SERVICE_LINKS.map((service) => (
                    <Link key={service.href} className={styles.serviceOption} href={service.href}>
                      <span className={styles.serviceOptionEyebrow}>{service.eyebrow}</span>
                      <strong>{service.label}</strong>
                      <span className={styles.serviceOptionText}>{service.description}</span>
                      <span className={styles.serviceArrow} aria-hidden="true">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
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
              {NAV.map((item) => item.href === "/service" ? (
                <div key={item.href} className={styles.mobileServiceGroup}>
                  <Link className={styles.mobileLink} href={item.href} onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                  <div className={styles.mobileServiceLinks}>
                    {SERVICE_LINKS.map((service) => (
                      <Link key={service.href} href={service.href} onClick={() => setOpen(false)}>
                        <span>{service.label}</span><span aria-hidden="true">→</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
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

  const scrolledClass = scrolled ? ` ${styles.scrolled}` : "";
  const openClass = open ? ` ${styles.menuOpen}` : "";

  if (variant === "solid") {
    return (
      <header className={`${styles.header} ${styles.solid}${scrolledClass}${openClass}`}>
        <div className={styles.inner}>{content}</div>
      </header>
    );
  }
  return (
    <header className={`${styles.header} ${styles.overlay}${scrolledClass}${openClass}`}>
      {content}
    </header>
  );
}
