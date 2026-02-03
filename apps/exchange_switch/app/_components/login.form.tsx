"use client";

import { loginAction } from "@/_api/login.api";
import { LoginForm } from "@repo/shared/ui/client";

export function LoginFormComponent() {
  const handleOnSubmit = async (data: { email: string }) => {
    console.log(data, ":::LOGIN DATA:::");
    const result = await loginAction(data.email);

    if (result) {
      console.log("Login successful:", result.data);
      // 로그인 성공 처리
    } else {
      console.error("Login failed:", result);
      alert("로그인에 실패했습니다.");
    }
  };

  return <LoginForm title="반갑습니다." onSubmitFn={handleOnSubmit} />;
}
