import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const cls = (variant: Variant, size: Size, extra?: string) =>
  `btn btn-${variant} btn-${size}${extra ? ` ${extra}` : ""}`;

/**
 * Pill button. Renders an anchor (via next/link) when `href` is set,
 * otherwise a real <button>.
 */
export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  fullWidth = false,
  type = "button",
  className,
  onClick,
}: {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick?: () => void;
}) {
  const style = fullWidth ? { width: "100%" } : undefined;
  if (href) {
    return (
      <Link href={href} className={cls(variant, size, className)} style={style}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={cls(variant, size, className)} style={style} onClick={onClick}>
      {children}
    </button>
  );
}
