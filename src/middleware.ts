// src/middleware.ts

import { createServerClient } from "@supabase/ssr";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

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

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/fr/admin")) {
    return NextResponse.redirect(
      new URL(pathname.replace("/fr/admin", "/admin"), request.url)
    );
  }

  if (pathname.startsWith("/en/admin")) {
    return NextResponse.redirect(
      new URL(pathname.replace("/en/admin", "/admin"), request.url)
    );
  }

  if (pathname.startsWith("/es/admin")) {
    return NextResponse.redirect(
      new URL(pathname.replace("/es/admin", "/admin"), request.url)
    );
  }

  let response = intlMiddleware(request);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    }
  );

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