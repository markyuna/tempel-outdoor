// src/app/[locale]/layout.tsx

import type { ReactNode } from "react";

import AuthIdleLogout from "@/components/auth/AuthIdleLogout";
import ChatWidget from "@/components/chat/ChatWidget";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  return (
    <>
      <AuthIdleLogout />
      <Navbar />
      <main>{children}</main>
      <Footer locale={locale} />
      <ChatWidget />
    </>
  );
}