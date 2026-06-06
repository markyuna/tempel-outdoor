import type { ReactNode } from "react";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <main className="min-h-screen bg-[#f7f4ee]">{children}</main>;
}