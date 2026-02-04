import type { Metadata } from "next";
import "./globals.css";
import { TanstackQueryProvider } from "@repo/shared/providers";
import { Wrap } from "@repo/shared/ui/server";

export const metadata: Metadata = {
  title: "Exchange Switch",
  description: "Exchange Switch",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <TanstackQueryProvider>
          <Wrap>{children}</Wrap>
        </TanstackQueryProvider>
      </body>
    </html>
  );
}
