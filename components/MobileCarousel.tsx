"use client";

import { Children, useCallback, useRef, useState, type ReactNode } from "react";
import styles from "./MobileCarousel.module.css";

/**
 * Wraps a card row so that on phones it reads clearly as a swipeable carousel:
 * the existing grid class already turns into a horizontal scroller under 640px,
 * and this adds dot indicators (active dot tracks the scroll position). On
 * larger screens the dots are hidden and the grid renders normally.
 */
export default function MobileCarousel({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = Children.count(children);

  const onScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const step = first ? first.offsetWidth + 12 : el.clientWidth;
    const i = Math.round(el.scrollLeft / step);
    setActive(Math.max(0, Math.min(count - 1, i)));
  }, [count]);

  return (
    <div className={styles.wrap}>
      <div ref={ref} className={className} onScroll={onScroll}>
        {children}
      </div>
      <div className={styles.dots} aria-hidden>
        {Array.from({ length: count }).map((_, i) => (
          <span key={i} className={`${styles.dot}${i === active ? ` ${styles.dotOn}` : ""}`} />
        ))}
      </div>
    </div>
  );
}
