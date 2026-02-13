import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "주요 사업",
  description:
    "나무병원(수목 진단·치료·방제) 및 조경식재(설계·시공·유지관리) 전문. 수의계약 가능, 견적 즉일 발급. 느티나무병원 협동조합.",
  openGraph: {
    title: "주요 사업 | 느티나무병원 협동조합",
    description:
      "수목 진단·치료, 조경식재, 녹지관리, 병충해 방제. 수의계약 견적 문의 031-752-6000.",
  },
};

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
