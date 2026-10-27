import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "소나무재선충 현장진단",
  description:
    "소나무가 갑자기 갈변했다면 재선충부터 확인하세요. 산림청 등록 1종 나무병원의 나무의사가 현장에서 시료를 채취해 1차 진단하고, 관할 기관 신고 안내와 예방나무주사까지 이어 드립니다. 느티나무병원 협동조합.",
  keywords: [
    "소나무재선충병 진단",
    "재선충 나무병원",
    "소나무 갑자기 갈변",
    "예방나무주사",
    "성남 나무병원",
  ],
  openGraph: {
    title: "소나무재선충 현장진단 | 느티나무병원 협동조합",
    description:
      "나무의사 현장 1차 진단 · 관할 기관 신고 안내 · 예방나무주사. 현장진단 문의 031-752-6000.",
  },
};

export default function PineWiltLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
