import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "회사소개",
  description:
    "느티나무병원 협동조합 — 산림청 등록 1종 나무병원. 수목 진단·치료·조경 전문가 그룹. 미션, 연혁, 자격·면허, 오시는 길.",
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: "회사소개 | 느티나무병원 협동조합",
    description:
      "산림청 등록 1종 나무병원. 수목복지문화를 선도하는 전문가 그룹.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
