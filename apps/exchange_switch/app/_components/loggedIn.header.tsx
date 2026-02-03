"use client";

import { ROUTE } from "@/_constants/route";
import { cn } from "@repo/shared/lib/client";
import { SwitchOneLogo } from "@repo/shared/ui/server";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function LoggedInHeader() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    // TODO: 로그아웃 로직 구현
    console.log("Logout clicked");
  };

  return (
    <header className="supports-backdrop-filter:bg-white/60 sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* 로고 */}
        <Link
          href="/"
          className="flex items-center transition-opacity hover:opacity-80"
        >
          <SwitchOneLogo size="medium" />
        </Link>

        {/* 내비게이션 */}
        <nav className="flex items-center gap-1 md:gap-2">
          <Link
            href={ROUTE.INFO}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors md:px-4",
              isActive(ROUTE.INFO)
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            환전 하기
          </Link>
          <Link
            href={ROUTE.EXCHANGE_HISTORY}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors md:px-4",
              isActive(ROUTE.EXCHANGE_HISTORY)
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            환전 내역
          </Link>
          <button
            onClick={handleLogout}
            className="ml-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 md:ml-4 md:px-4"
          >
            로그아웃
          </button>
        </nav>
      </div>
    </header>
  );
}
