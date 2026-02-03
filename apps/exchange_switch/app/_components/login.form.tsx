"use client";

import { loginAction } from "@/_api/login.api";
import { LoginForm } from "@repo/shared/ui/client";
import { useRouter } from "next/navigation";

export function LoginFormComponent() {
  const router = useRouter();
  const handleOnSubmit = async (data: { email: string }) => {
    const result = await loginAction(data.email);
    if (result.code === "OK") {
      router.replace("/info");
    } else {
      console.error("Login failed:", result);
      alert(result.message);
    }
  };

  return <LoginForm title="반갑습니다." onSubmitFn={handleOnSubmit} />;
}
