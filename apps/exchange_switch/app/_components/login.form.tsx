"use client";

import { LoginForm } from "@repo/shared/ui/client";

export function LoginFormComponent() {
  const handleOnSubmit = (data: { email: string; password: string }) => {
    console.log(data);
    // 로그인 로직처리
  };

  return <LoginForm title="반갑습니다." onSubmitFn={handleOnSubmit} />;
}
