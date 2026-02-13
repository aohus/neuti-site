import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "시공사례",
  description:
    "조경식재·녹지관리·소나무전정·병충해방제·위험목제거 시공사례. 관공서·지자체 납품 실적 다수. 느티나무병원 협동조합.",
  openGraph: {
    title: "시공사례 | 느티나무병원 협동조합",
    description:
      "조경식재, 녹지관리, 수목치료 실적. 관공서 수의계약 실적 보유.",
  },
};

export default function PerformanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
