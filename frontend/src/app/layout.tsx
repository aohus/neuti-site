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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: "https://xn--910b90bw7nhubu9w9vr.com",
    telephone: "031-752-6000",
    email: "coopneuti@naver.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "태평로 104",
      addressLocality: "성남시 수정구",
      addressRegion: "경기도",
      addressCountry: "KR",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "조경·수목관리 서비스",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "조경식재" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "녹지관리" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "소나무 전정" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "병충해 방제" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "위험목 제거" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "수목 진단·치료" } },
      ],
    },
  };

  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
      </body>
    </html>
  );
}
