"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";

/**
 * Scroll / mount reveal wrapper (Framer Motion).
 * - default: fades + slides up when scrolled into view (once)
 * - immediate: plays on mount (used for the hero's staggered entrance)
 * Respects prefers-reduced-motion (no transform/opacity animation).
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

  const hidden = reduce ? { opacity: 0 } : { opacity: 0, y };
  const shown = reduce ? { opacity: 1 } : { opacity: 1, y: 0 };
  const transition = {
    duration: 0.8,
    delay,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  };

  const animateProps = immediate
    ? { animate: shown }
    : { whileInView: shown, viewport: { once: true, amount: 0.15, margin: "0px 0px -8% 0px" } };

  return (
    <motion.div
      className={className}
      style={style}
      initial={hidden}
      transition={transition}
      {...animateProps}
    >
      {children}
    </motion.div>
  );
}
