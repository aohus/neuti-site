import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "공지사항",
  description:
    "느티나무병원 협동조합 공지사항. 조경·수목관리 소식 및 안내.",
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: "공지사항 | 느티나무병원 협동조합",
    description: "느티나무병원 협동조합의 최신 소식과 안내.",
  },
};

export default function NoticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
