"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackCtaClick } from "@/lib/analytics-client";

export default function TrackedLink({
  href,
  children,
  className,
  label,
  location,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  label: string;
  location?: string;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => trackCtaClick(label, href, location)}
    >
      {children}
    </Link>
  );
}
