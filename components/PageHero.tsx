import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./PageHero.module.css";

export type Crumb = { label: string; href?: string };

/**
 * Shared interior-page hero: dark band with breadcrumb → eyebrow → title →
 * lead, and the bottom fade into the white canvas.
 */
export default function PageHero({
  crumbs,
  eyebrow,
  title,
  lead,
}: {
  crumbs: Crumb[];
  eyebrow: string;
  title: ReactNode;
  lead: ReactNode;
}) {
  return (
    <section className={styles.hero}>
      <div className={styles.glow} />
      <div className={styles.inner}>
        <div className={styles.breadcrumb}>
          {crumbs.map((c, i) => (
            <span key={i}>
              {i > 0 ? " ／ " : ""}
              {c.href ? <Link href={c.href}>{c.label}</Link> : c.label}
            </span>
          ))}
        </div>
        <span className={styles.eyebrow}><span />{eyebrow}</span>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.lead}>{lead}</p>
      </div>
      <div className={styles.fade} />
    </section>
  );
}
