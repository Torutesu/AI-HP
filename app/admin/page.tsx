import type { Metadata } from "next";
import AdminDashboard from "@/components/AdminDashboard";

// Internal tool — never index, and no canonical/sitemap entry.
export const metadata: Metadata = {
  title: "リード管理",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
