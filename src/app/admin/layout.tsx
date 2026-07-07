import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import AdminNavbar from "@/components/admin/AdminNavbar";
import { routing } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${routing.defaultLocale}/auth/login?redirectTo=/admin`);
  }

  return (
    <div className="min-h-screen bg-[#f7f4ee]">
      <AdminNavbar />
      {children}
    </div>
  );
}
