"use server";

import { LoginResponse } from "@/_types/login";
import { END_POINT } from "./end-point";
import { loginApiInstance, tokenManager } from "@repo/shared/lib/server";

export async function loginAction(email: string) {
  try {
    console.log("Sending login request with email:", email);

    // 쿼리 파라미터로 email 전송
    const data = (await loginApiInstance
      .post(END_POINT.LOGIN, {
        searchParams: { email },
      })
      .json()) as ApiResponse<LoginResponse>;

    console.log("Login response:", data);

    // 응답에서 토큰 추출 및 쿠키에 저장
    if (data.code === "OK") {
      const token = data.data.token;
      if (token) {
        await tokenManager.setToken(token);
      }
    }

    return data;
  } catch (error: unknown) {
    return error as ErrorResponse;
  }
}
