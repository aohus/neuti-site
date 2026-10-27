import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Layout from "@/components/Layout";
import { AuthProvider } from "@/context/AuthContext";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";
import {
  SITE_DESCRIPTION,
  localBusinessJsonLd,
  serializeJsonLd,
  websiteJsonLd,
} from "@/lib/structuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // og:image 등 상대 경로 메타 URL 을 절대 URL 로 바꿀 기준.
  metadataBase: new URL(SITE_URL),
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
    images: [DEFAULT_OG_IMAGE],
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
        <link rel="alternate" type="application/rss+xml" title={SITE_NAME} href="/rss.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(localBusinessJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(websiteJsonLd()) }}
        />
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
      </body>
    </html>
  );
}
