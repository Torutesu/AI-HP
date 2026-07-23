"use client";

import { usePathname } from "next/navigation";
import Icon from "./Icon";
import Button from "./Button";
import styles from "./MobileStickyCta.module.css";

type Cta =
  | { type: "link"; href: string; label: string; icon?: "arrow-right" | "download" }
  | { type: "submit"; form: string; label: string };

function getCta(pathname: string): Cta | null {
  if (pathname === "/") return { type: "link", href: "/contact", label: "無料相談", icon: "arrow-right" };
  if (pathname === "/service") return { type: "link", href: "/download", label: "資料をダウンロード", icon: "download" };
  if (pathname === "/ai-os") return { type: "link", href: "/contact", label: "無料相談する", icon: "arrow-right" };
  if (pathname === "/consulting") return { type: "link", href: "/download", label: "資料をダウンロード", icon: "arrow-right" };
  if (pathname === "/cases") return { type: "link", href: "/download", label: "資料をダウンロード", icon: "arrow-right" };
  if (pathname === "/company") return { type: "link", href: "/download", label: "資料をダウンロード", icon: "arrow-right" };
  if (pathname === "/partners") return { type: "link", href: "/contact", label: "お問い合わせ", icon: "arrow-right" };
  if (pathname === "/magazine" || pathname.startsWith("/magazine/")) {
    return { type: "link", href: "/contact", label: "無料相談する", icon: "arrow-right" };
  }
  if (pathname === "/contact") return { type: "submit", form: "contact-form", label: "この内容で送信する" };
  if (pathname === "/download") return { type: "submit", form: "download-form", label: "資料をリクエストする" };
  if (pathname === "/recruiting") return { type: "submit", form: "recruiting-form", label: "応募内容を送信する" };
  return null;
}

export default function MobileStickyCta() {
  const pathname = usePathname();
  const cta = getCta(pathname);

  if (!cta) return null;

  return (
    <div className={styles.root} aria-hidden={false}>
      <div className={styles.shell}>
        {cta.type === "link" ? (
          <Button
            href={cta.href}
            variant="primary"
            size="lg"
            fullWidth
            analyticsLabel={`mobile_sticky_${pathname.replace(/\//g, "_") || "home"}`}
            analyticsLocation="mobile_sticky"
          >
            {cta.label}
            {cta.icon ? <Icon name={cta.icon} size={17} /> : null}
          </Button>
        ) : (
          <Button
            type="submit"
            form={cta.form}
            variant="primary"
            size="lg"
            fullWidth
            analyticsLabel={`mobile_sticky_submit_${pathname.replace(/\//g, "_") || "home"}`}
            analyticsLocation="mobile_sticky"
          >
            {cta.label}
          </Button>
        )}
      </div>
    </div>
  );
}
