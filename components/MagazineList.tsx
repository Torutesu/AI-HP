"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "./Reveal";
import Icon from "./Icon";
import type { Article } from "@/lib/magazine";
import styles from "./MagazineList.module.css";

const PAGE = 6;

export default function MagazineList({
  articles,
  categories,
}: {
  articles: Article[];
  categories: readonly string[];
}) {
  const [active, setActive] = useState<string | null>(null);
  const [visible, setVisible] = useState(PAGE);

  const filtered = active ? articles.filter((a) => a.category === active) : articles;
  const shown = filtered.slice(0, visible);

  const pick = (cat: string | null) => {
    setActive(cat);
    setVisible(PAGE);
  };

  return (
    <>
      <div className={styles.filters}>
        <button
          type="button"
          className={`${styles.chip} ${active === null ? styles.chipActive : ""}`}
          onClick={() => pick(null)}
        >
          すべて
        </button>
        {categories.map((c) => (
          <button
            type="button"
            key={c}
            className={`${styles.chip} ${active === c ? styles.chipActive : ""}`}
            onClick={() => pick(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className={styles.empty}>該当する記事がまだありません。</p>
      ) : (
        <div className={styles.grid}>
          {shown.map((a, i) => (
            <Reveal key={a.slug} delay={(i % PAGE) * 0.06}>
              <Link href={`/magazine/${a.slug}`} className={styles.card}>
                <div className={styles.thumb}>
                  <Icon name="image" size={32} />
                </div>
                <div className={styles.body}>
                  <span className={styles.cat}>{a.category}</span>
                  <h3 className={styles.title}>{a.title}</h3>
                  <span className={styles.date}>{a.date}</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}

      {shown.length < filtered.length && (
        <div className={styles.more}>
          <button
            type="button"
            className="btn btn-secondary btn-md"
            onClick={() => setVisible((v) => v + PAGE)}
          >
            もっと読む
          </button>
        </div>
      )}
    </>
  );
}
