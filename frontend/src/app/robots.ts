import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://xn--910b90bw7nhubu9w9vr.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/login", "/backend-api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
