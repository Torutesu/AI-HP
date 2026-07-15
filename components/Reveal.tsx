"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import type { ReactNode, CSSProperties } from "react";

/**
 * Scroll / mount reveal wrapper (Framer Motion).
 * - default: fades + slides up when scrolled into view (once)
 * - immediate: plays on mount (used for the hero's staggered entrance)
 *
 * Robustness: the server render and the first client render are BOTH a plain,
 * fully-visible <div> (mount gate). This means:
 *   • the static export ships visible content (no opacity:0 baked into HTML) —
 *     SEO-safe and never blank if JS is slow/disabled,
 *   • no hydration mismatch (which previously left content stuck hidden),
 *   • reduced-motion users simply keep the static, visible div.
 * The animation only attaches after mount, on clients that allow motion.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  immediate = false,
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  immediate?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready || reduce) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  const transition = {
    duration: 0.8,
    delay,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  };
  const animateProps = immediate
    ? { animate: { opacity: 1, y: 0 } }
    : {
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.15, margin: "0px 0px -8% 0px" },
      };

  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      transition={transition}
      {...animateProps}
    >
      {children}
    </motion.div>
  );
}
