import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Layout from "@/components/Layout";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_NAME = "느티나무병원 협동조합";
const SITE_DESCRIPTION =
  "산림청 등록 1종 나무병원 · 조경식재 · 녹지관리 · 수목진단 전문. 수의계약 견적 즉일 발급. 031-752-6000";

export const metadata: Metadata = {
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME} | 조경·수목진단 전문 (수의계약 가능)`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "느티나무병원",
    "나무병원",
    "조경 수의계약",
    "수목진단",
    "조경식재",
    "녹지관리",
    "소나무전정",
    "병충해방제",
    "위험목제거",
    "가로수관리",
    "성남 조경업체",
    "경기 조경업체",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | 조경·수목진단 전문`,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
      </body>
    </html>
  );
}
