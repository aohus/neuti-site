import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://xn--910b90bw7nhubu9w9vr.com";

// Static pages with their update frequency and priority
const staticPages: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "", changeFrequency: "weekly", priority: 1.0 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/business", changeFrequency: "monthly", priority: 0.8 },
  { path: "/performance", changeFrequency: "weekly", priority: 0.9 },
  { path: "/qna", changeFrequency: "weekly", priority: 0.7 },
  { path: "/notice", changeFrequency: "weekly", priority: 0.5 },
  { path: "/request", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contract", changeFrequency: "monthly", priority: 0.9 },
];

async function getPerformanceIds(): Promise<{ id: number; created_at: string }[]> {
  const backendUrl = process.env.BACKEND_INTERNAL_URL || "http://backend:8000";
  try {
    const res = await fetch(`${backendUrl}/api/v1/performance/?limit=500`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((p: { id: number; created_at: string }) => ({
      id: p.id,
      created_at: p.created_at,
    }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${SITE_URL}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const performances = await getPerformanceIds();
  for (const p of performances) {
    entries.push({
      url: `${SITE_URL}/performance/${p.id}`,
      lastModified: new Date(p.created_at),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
