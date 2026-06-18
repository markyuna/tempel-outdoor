// src/components/auth/AuthIdleLogout.tsx

"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

const IDLE_TIMEOUT_IN_MINUTES = 30;
const IDLE_TIMEOUT = IDLE_TIMEOUT_IN_MINUTES * 60 * 1000;

const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "scroll",
  "touchstart",
  "click",
];

export default function AuthIdleLogout() {
  const router = useRouter();
  const pathname = usePathname();

  const timeoutRef = useRef<number | null>(null);
  const isLoggingOutRef = useRef(false);

  useEffect(() => {
    const supabase = createClient();

    async function logoutUser() {
      if (isLoggingOutRef.current) return;

      isLoggingOutRef.current = true;

      await supabase.auth.signOut();

      const locale = pathname?.split("/")[1] || "fr";

      router.replace(`/${locale}/auth/login?reason=inactive`);
      router.refresh();
    }

    function clearIdleTimeout() {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    function resetIdleTimeout() {
      clearIdleTimeout();

      timeoutRef.current = window.setTimeout(() => {
        void logoutUser();
      }, IDLE_TIMEOUT);
    }

    resetIdleTimeout();

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, resetIdleTimeout, {
        passive: true,
      });
    });

    return () => {
      clearIdleTimeout();

      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, resetIdleTimeout);
      });
    };
  }, [pathname, router]);

  return null;
}