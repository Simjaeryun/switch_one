import { LoginLayoutComponent } from "@repo/shared/ui/server";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LoginLayoutComponent>{children}</LoginLayoutComponent>;
}
