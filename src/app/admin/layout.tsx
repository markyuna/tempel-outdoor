import type { ReactNode } from "react";

import AdminNavbar from "@/components/admin/AdminNavbar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f4ee]">
      <AdminNavbar />
      {children}
    </div>
  );
}
