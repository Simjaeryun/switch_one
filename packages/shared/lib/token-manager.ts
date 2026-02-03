import { cookies } from "next/headers";
import { DEFAULT_COOKIE_OPTIONS } from "../constants/cookie";

/**
 * 서버 사이드에서 토큰을 쿠키에 설정
 */
export async function setTokenFromCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: DEFAULT_COOKIE_OPTIONS.httpOnly,
    secure: DEFAULT_COOKIE_OPTIONS.secure,
    maxAge: DEFAULT_COOKIE_OPTIONS.maxAge,
    path: DEFAULT_COOKIE_OPTIONS.path,
    sameSite: "lax",
  });
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
  cookieStore.delete("token");
}

export const tokenManager = {
  // 서버 사이드
  setToken: setTokenFromCookie,
  getToken: getTokenFromCookie,
  removeToken: removeTokenFromCookie,
};
