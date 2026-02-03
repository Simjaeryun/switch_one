"use client";

import Link from "next/link";
import { Wrap } from "../server/wrap";
import { SwitchOneLogo } from "../server/logo";

export function NotFoundScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-16">
      <Wrap className="flex flex-col items-center justify-center text-center">
        <div className="mb-8">
          <SwitchOneLogo size="xl" />
        </div>

        <div className="mb-8">
          <h1 className="mb-4 text-6xl font-bold text-[#222222] md:text-8xl">
            404
          </h1>
          <h2 className="mb-4 text-2xl font-semibold text-[#222222] md:text-3xl">
            페이지를 찾을 수 없습니다
          </h2>
          <p className="mx-auto max-w-md text-base text-gray-600 md:text-lg">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/"
            className="rounded-md bg-[#3CDC84] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#21C66B] md:px-8 md:py-3 md:text-base"
          >
            홈으로 돌아가기
          </Link>
          <button
            onClick={() => window.history.back()}
            className="rounded-md border-2 border-[#e6e6e6] bg-white px-6 py-3 text-sm font-medium text-[#222222] transition-colors hover:border-[#3CDC84] hover:text-[#3CDC84] md:px-8 md:py-3 md:text-base"
          >
            이전 페이지
          </button>
        </div>
      </Wrap>
    </div>
  );
}
