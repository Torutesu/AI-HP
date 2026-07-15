"use client";

import { useEffect, useRef } from "react";

/**
 * Autoplaying, muted, looping background video.
 * React does not reliably set the `muted` *property* from the attribute, which
 * makes mobile browsers block autoplay and show a play button. We force
 * muted + playsInline via the ref and call play() (retrying on canplay).
 */
export default function HeroVideo({
  src,
  className,
  poster,
}: {
  src: string;
  className?: string;
  poster?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };
    tryPlay();
    v.addEventListener("canplay", tryPlay, { once: true });
    return () => v.removeEventListener("canplay", tryPlay);
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      poster={poster}
      controls={false}
      disablePictureInPicture
      tabIndex={-1}
      aria-hidden="true"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
