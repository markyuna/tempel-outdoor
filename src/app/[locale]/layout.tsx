// src/app/[locale]/layout.tsx

import type { Metadata } from "next";
import type { ReactNode } from "react";

import AuthIdleLogout from "@/components/auth/AuthIdleLogout";
import ChatWidget from "@/components/chat/ChatWidget";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { buildAlternates } from "@/lib/seo";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return {
    alternates: buildAlternates(locale, "/"),
  };
}

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
