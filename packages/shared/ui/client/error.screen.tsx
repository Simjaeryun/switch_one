"use client";

import { useEffect } from "react";
import { Wrap } from "../server/wrap";
import { SwitchOneLogo } from "../server/logo";
import { removeTokenFromCookie } from "../../lib/server";

interface ErrorScreenProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function ErrorScreen({ error, reset }: ErrorScreenProps) {
  useEffect(() => {
    // 에러 로깅 등 필요한 작업 수행
    console.error("Error:", error);
  }, [error]);

  const handleGoHome = () => {
    removeTokenFromCookie();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-16">
      <Wrap className="flex flex-col items-center justify-center text-center">
        <div className="mb-8">
          <SwitchOneLogo size="xl" />
        </div>

        <div className="mb-8">
          <h1 className="mb-4 text-6xl font-bold text-[#222222] md:text-8xl">
            오류
          </h1>
          <h2 className="mb-4 text-2xl font-semibold text-[#222222] md:text-3xl">
            문제가 발생했습니다
          </h2>
          <p className="mx-auto max-w-md text-base text-gray-600 md:text-lg">
            예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
          </p>
          {error.digest && (
            <p className="mt-2 text-xs text-gray-400">
              오류 코드: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            onClick={reset}
            className="rounded-md bg-[#3CDC84] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#21C66B] md:px-8 md:py-3 md:text-base"
          >
            다시 시도
          </button>
          <button
            onClick={handleGoHome}
            className="rounded-md border-2 border-[#e6e6e6] bg-white px-6 py-3 text-sm font-medium text-[#222222] transition-colors hover:border-[#3CDC84] hover:text-[#3CDC84] md:px-8 md:py-3 md:text-base"
          >
            홈으로 돌아가기
          </button>
        </div>
      </Wrap>
    </div>
  );
}
