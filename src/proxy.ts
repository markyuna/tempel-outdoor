// src/proxy.ts

import { createServerClient } from "@supabase/ssr";
import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";

import { routing } from "@/i18n/routing";

const intlProxy = createMiddleware(routing);

const protectedUserRoutes = ["/mon-compte"];
const authRoutes = ["/auth/login", "/auth/register"];

function getLocaleAndPath(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const possibleLocale = segments[0];

  const locales = routing.locales as readonly string[];
  const hasLocale = locales.includes(possibleLocale);

  const locale = hasLocale ? possibleLocale : routing.defaultLocale;

  const pathWithoutLocale = hasLocale
    ? `/${segments.slice(1).join("/")}`
    : pathname;

  return {
    locale,
    pathWithoutLocale: pathWithoutLocale === "/" ? "/" : pathWithoutLocale,
  };
}

function redirectLocalizedAdmin(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const localizedAdminMatch = pathname.match(/^\/(fr|en|es)\/admin(\/.*)?$/);

  if (!localizedAdminMatch) {
    return null;
  }

  const adminPath = pathname.replace(/^\/(fr|en|es)\/admin/, "/admin");

  return NextResponse.redirect(new URL(adminPath, request.url));
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const adminRedirect = redirectLocalizedAdmin(request);

  if (adminRedirect) {
    return adminRedirect;
  }

  let response = intlProxy(request);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({
          request,
        });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { locale, pathWithoutLocale } = getLocaleAndPath(pathname);

  const isProtectedUserRoute = protectedUserRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  const isAuthRoute = authRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  if (isProtectedUserRoute && !user) {
    const loginUrl = new URL(`/${locale}/auth/login`, request.url);
    loginUrl.searchParams.set("redirectTo", pathname);

    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL(`/${locale}/mon-compte`, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};