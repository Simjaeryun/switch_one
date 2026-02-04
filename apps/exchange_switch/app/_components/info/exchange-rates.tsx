"use client";

import { useExchangeRateQuery } from "@/_api/exchange-rate/exchange-rate.query";
import { ExchangeRateDTO } from "@/_types/exchange-rate";
import { NumberToCommas } from "@repo/shared/utils";

const CURRENCY_SYMBOL = {
  USD: "미국 달러",
  JPY: "일본 엔",
};

export function ExchangeRateCard() {
  const { data } = useExchangeRateQuery();

  return (
    <div className="flex gap-3">
      {data?.map((item: ExchangeRateDTO["ExchangeRateResponse"][0]) => (
        <Card key={item.exchangeRateId} {...item} />
      ))}
    </div>
  );
}

function Card({
  exchangeRateId,
  currency,
  rate,
  changePercentage,
  applyDateTime,
}: ExchangeRateDTO["ExchangeRateResponse"][0]) {
  const isPositive = changePercentage > 0;
  const isNegative = changePercentage < 0;

  return (
    <div className="bg-linear-to-br group relative w-full overflow-hidden rounded-xl border border-gray-100 from-white to-gray-50 p-4 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      {/* 배경 그라데이션 효과 */}
      <div className="bg-linear-to-br absolute inset-0 from-transparent via-transparent to-gray-100/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10">
        {/* 통화 이름 */}
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">{currency}</h2>
          <div className="text-xs text-gray-400">
            {CURRENCY_SYMBOL[currency as keyof typeof CURRENCY_SYMBOL]}
          </div>
        </div>

        {/* 환율 */}
        <div className="mb-2">
          <div
            className={`text-2xl font-extrabold ${
              isPositive
                ? "text-red-500"
                : isNegative
                  ? "text-blue-500"
                  : "text-gray-700"
            }`}
          >
            {NumberToCommas(rate)} KRW
          </div>
          <div className="mt-0.5 text-xs text-gray-500">KRW</div>
        </div>

        {/* 변동률 */}
        <div className="flex items-center gap-2">
          <div
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
              isPositive
                ? "border border-red-200 bg-red-50 text-red-600"
                : isNegative
                  ? "border border-blue-200 bg-blue-50 text-blue-600"
                  : "border border-gray-200 bg-gray-50 text-gray-600"
            }`}
          >
            <span className="text-sm">
              {isPositive ? "↑" : isNegative ? "↓" : "→"}
            </span>
            <span>
              {isPositive ? "+" : ""}
              {changePercentage.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* 하단 accent 라인 */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-0.5 ${
          isPositive
            ? "bg-linear-to-r from-red-400 to-red-600"
            : isNegative
              ? "bg-linear-to-r from-blue-400 to-blue-600"
              : "bg-linear-to-r from-gray-300 to-gray-500"
        }`}
      />
    </div>
  );
}
