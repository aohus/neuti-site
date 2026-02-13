import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "시공/견적 문의",
  description:
    "조경 시공·견적 문의. 수의계약 견적서 즉일 발급, 실적증명서·자격증빙 함께 제공. 느티나무병원 협동조합 031-752-6000.",
  openGraph: {
    title: "시공/견적 문의 | 느티나무병원 협동조합",
    description:
      "조경 수의계약 견적 요청. 빠른 견적 발급, 실적증명서 즉시 제공.",
  },
};

export default function QnALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
