// Actualiza SITE_URL con el dominio real antes de salir a producción
export const SITE_URL = "https://www.tempel-outdoor.fr";
export const SITE_NAME = "Tempel Outdoor";

export const locales = ["fr", "en"] as const;

export function buildAlternates(locale: string, pathWithoutLocale: string) {
  const path =
    pathWithoutLocale === "/" || pathWithoutLocale === ""
      ? ""
      : pathWithoutLocale.startsWith("/")
      ? pathWithoutLocale
      : `/${pathWithoutLocale}`;

  return {
    canonical: `${SITE_URL}/${locale}${path}`,
    languages: {
      fr: `${SITE_URL}/fr${path}`,
      en: `${SITE_URL}/en${path}`,
      "x-default": `${SITE_URL}/fr${path}`,
    },
  };
}

export function buildOg({
  title,
  description,
  image,
  locale,
  type = "website",
}: {
  title: string;
  description: string;
  image?: string;
  locale: string;
  type?: "website" | "article";
}) {
  const ogLocale = locale === "fr" ? "fr_FR" : "en_GB";

  return {
    title,
    description,
    siteName: SITE_NAME,
    locale: ogLocale,
    alternateLocale: locale === "fr" ? ["en_GB"] : ["fr_FR"],
    type,
    ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: title }] } : {}),
  };
}
