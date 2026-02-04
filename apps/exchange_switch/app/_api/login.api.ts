"use server";

import { LoginDTO } from "@/_types/login";
import { END_POINT } from "../_constants/end-point";
import { loginApiInstance, setTokenFromCookie } from "@repo/shared/lib/server";

export async function loginAction(email: string) {
  try {
    // 쿼리 파라미터로 email 전송
    const data = (await loginApiInstance
      .post(END_POINT.LOGIN, {
        searchParams: { email },
      })
      .json()) as ApiResponse<LoginDTO["LoginResponse"]>;

    // 응답에서 토큰 추출 및 쿠키에 저장
    if (data.code === "OK") {
      const token = data.data.token;
      if (token) {
        await setTokenFromCookie(token);
      }
    }

    return data;
  } catch (error: unknown) {
    console.error("Login error:", error);
    return error as ErrorResponse;
  }
}
