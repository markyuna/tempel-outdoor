// src/app/[locale]/layout.tsx

import type { ReactNode } from "react";

import AuthIdleLogout from "@/components/auth/AuthIdleLogout";
import ChatWidget from "@/components/chat/ChatWidget";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

type Props = {
  children: ReactNode;
};

export default function LocaleLayout({ children }: Props) {
  return (
    <>
      <AuthIdleLogout />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <ChatWidget />
    </>
  );
}