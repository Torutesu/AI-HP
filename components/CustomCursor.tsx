"use client";

import { useEffect, useRef } from "react";
import styles from "./CustomCursor.module.css";

/**
 * Design-studio style pointer: a precise dot + a ring that trails with easing.
 * The ring swells over interactive elements. Desktop / fine-pointer only —
 * touch devices keep their native behaviour and never hide the cursor.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const INTERACTIVE = 'a, button, input, textarea, select, label, summary, [role="button"], [data-cursor="hover"]';

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let visible = false;
    let raf = 0;

    document.documentElement.classList.add("cursor-custom");

    const show = () => {
      if (visible) return;
      visible = true;
      rx = mx;
      ry = my;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };
    const hide = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      show();
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      const el = (e.target as Element | null)?.closest?.(INTERACTIVE);
      ring.classList.toggle(styles.hover, !!el);
    };
    const onDown = () => ring.classList.add(styles.down);
    const onUp = () => ring.classList.remove(styles.down);

    const loop = () => {
      const k = reduce ? 1 : 0.2;
      rx += (mx - rx) * k;
      ry += (my - ry) * k;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", hide);
      window.removeEventListener("blur", hide);
      document.documentElement.classList.remove("cursor-custom");
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className={styles.dot} aria-hidden />
      <div ref={ringRef} className={styles.ring} aria-hidden>
        <span className={styles.ringInner} />
      </div>
    </>
  );
}
