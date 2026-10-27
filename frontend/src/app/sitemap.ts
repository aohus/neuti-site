import type { MetadataRoute } from "next";
import { getNotices, getPerformanceFeed } from "@/lib/feed";
import { SITE_URL } from "@/lib/seo";

// 빌드(CI) 시점에는 백엔드에 닿지 않아 시공사례가 빠진 sitemap 이 프리렌더된다. 요청 시점에 만든다.
export const dynamic = "force-dynamic";

// 정적 페이지는 실제 수정일을 알 수 없으므로 lastModified 를 넣지 않는다.
// (매 요청 new Date() 를 넣으면 검색엔진이 lastmod 를 신뢰하지 않게 된다)
const staticPages: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "", changeFrequency: "weekly", priority: 1.0 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/business", changeFrequency: "monthly", priority: 0.8 },
  { path: "/pine-wilt", changeFrequency: "monthly", priority: 0.8 },
  { path: "/school", changeFrequency: "monthly", priority: 0.8 },
  { path: "/performance", changeFrequency: "weekly", priority: 0.9 },
  { path: "/qna", changeFrequency: "weekly", priority: 0.7 },
  { path: "/notice", changeFrequency: "weekly", priority: 0.5 },
  { path: "/request", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contract", changeFrequency: "monthly", priority: 0.9 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [performances, notices] = await Promise.all([getPerformanceFeed(), getNotices()]);

  return [
    ...staticPages.map((page) => ({
      url: `${SITE_URL}${page.path}`,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...performances.map((p) => ({
      url: `${SITE_URL}/performance/${p.id}`,
      lastModified: new Date(p.updated_at ?? p.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...notices.map((n) => ({
      url: `${SITE_URL}/notice/${n.id}`,
      lastModified: new Date(n.created_at),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
