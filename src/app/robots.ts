import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/fr/auth/",
          "/en/auth/",
          "/fr/cart/",
          "/en/cart/",
          "/fr/checkout/",
          "/en/checkout/",
          "/fr/mon-compte/",
          "/en/mon-compte/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
