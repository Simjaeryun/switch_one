import { LoginFormComponent } from "@/_components/login.form";
import { redirect } from "next/navigation";

// page는 항상 서버컴포넌트로 유지.

export default function LoginPage() {
  return <LoginFormComponent />;
}
