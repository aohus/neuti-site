export async function GET() {
  return new Response(
    "naver-site-verification: naver3bc1730bfad429fa4724a2971805d5d7.html",
    { headers: { "Content-Type": "text/html" } },
  );
}
