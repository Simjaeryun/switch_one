"use server";

import { cookies } from "next/headers";
import { DEFAULT_COOKIE_OPTIONS } from "../../constants/cookie";
import { redirect } from "next/navigation";

/**
 * 서버 사이드에서 토큰을 쿠키에 설정
 */
export async function setTokenFromCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("token", token, DEFAULT_COOKIE_OPTIONS);
}
/**
 * 서버 사이드에서 토큰을 쿠키에서 가져오기
 */
export async function getTokenFromCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
}

/**
 * 서버 사이드에서 토큰 쿠키 삭제
 */
export async function removeTokenFromCookie() {
  const cookieStore = await cookies();
  cookieStore.set("token", "", { ...DEFAULT_COOKIE_OPTIONS, maxAge: 0 });
  redirect("/");
}
