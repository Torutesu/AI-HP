"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Counts a metric up from 0 to its target when scrolled into view.
 * Accepts a display string like "-40%", "+25%", "-60%" — the sign and suffix
 * are preserved and only the integer animates. Falls back to the final value
 * for reduced-motion or unparsable input, and never causes a hydration
 * mismatch (server and first client render both show 0<suffix>).
 */
export default function CountUp({
  value,
  duration = 1.3,
}: {
  value: string;
  duration?: number;
}) {
  const match = value.match(/^([+\-]?)(\d+)(.*)$/);
  const sign = match ? match[1] : "";
  const target = match ? parseInt(match[2], 10) : 0;
  const suffix = match ? match[3] : "";

  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  const parsed = match !== null;
  useEffect(() => {
    if (!parsed) return;
    if (reduce) {
      setN(target);
      return;
    }
    if (!inView) return;
    let raf = 0;
    let startTs = 0;
    const step = (ts: number) => {
      if (!startTs) startTs = ts;
      const p = Math.min(1, (ts - startTs) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, parsed, target, duration]);

  if (!match) return <span ref={ref}>{value}</span>;
  return (
    <span ref={ref}>
      {sign}
      {n}
      {suffix}
    </span>
  );
}
