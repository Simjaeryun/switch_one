import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCookie } from "@repo/shared/lib/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getTokenFromCookie();

  // 로그인 페이지 경로
  const isLoginPage = pathname === "/";
  // 인증이 필요한 페이지 경로들
  const isProtectedPage = pathname.startsWith("/info");

  // 토큰이 있는 경우
  if (token) {
    // 로그인 페이지에 있으면 메인 페이지로 리다이렉트
    if (isLoginPage) {
      return NextResponse.redirect(new URL("/info", request.url));
    }
    // 이미 보호된 페이지에 있으면 통과
    return NextResponse.next();
  }

  // 토큰이 없는 경우
  // 보호된 페이지에 접근하려고 하면 로그인 페이지로 리다이렉트
  if (isProtectedPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 로그인 페이지에 있으면 통과
  return NextResponse.next();
}

export const config = {
  matcher: [
    // 미들웨어 실행 제외 경로들:
    // - _next: Next.js 내부 파일들
    // - api: 모든 API 라우트 제외
    // - 정적 파일들 (이미지, CSS, JS 등)
    // - robots.txt, sitemap.xml 등 SEO 파일들
    // - health-check, pass-certification: 공개 API
    "/((?!_next|api|health-check|pass-certification|robots.txt|sitemap.xml|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
