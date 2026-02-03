import type { Metadata } from "next";
import "./globals.css";
import { TanstackQueryProvider } from "@repo/shared/providers";

export const metadata: Metadata = {
  title: "Enterprise Admin",
  description: "Enterprise Admin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <TanstackQueryProvider>{children}</TanstackQueryProvider>
      </body>
    </html>
  );
}
