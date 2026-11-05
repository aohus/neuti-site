import { buildMetadata } from "@/lib/seo";
import { PINE_WILT_PATH, pineWiltSeo } from "@/data/pine-wilt-content";

export const metadata = buildMetadata({
  path: PINE_WILT_PATH,
  title: pineWiltSeo.title,
  description: pineWiltSeo.description,
  keywords: pineWiltSeo.keywords,
  image: pineWiltSeo.image,
  ogDescription: pineWiltSeo.ogDescription,
});

export default function PineWiltLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
