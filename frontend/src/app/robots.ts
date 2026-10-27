import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// 관리·작성·수정 화면은 색인 가치가 없고 로그인 리다이렉트만 반복된다.
const PRIVATE_PATHS = [
  "/login",
  "/admin",
  "/backend-api/",
  "/notice/write",
  "/notice/edit",
  "/qna/write",
  "/performance/*/edit",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: PRIVATE_PATHS,
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
