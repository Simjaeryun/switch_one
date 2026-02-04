"use client";

import { cn, Controller } from "@repo/shared/lib/client";
import { FormLabel } from "@repo/shared/ui/client";
import { useExchangeAction } from "./exchange-action.hook";
import { NumberToCommas } from "@repo/shared/utils";

export function ExchangeAction() {
  const { form, quoteData, exchangeRates, onResetAmount } = useExchangeAction();

  return (
    <form
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
      onSubmit={form.handleSubmit((data) => console.log(data))}
    >
      {/* 헤더 */}
      <div className="mb-6">
        <h2 className="mb-2 text-xl font-bold text-gray-900">환전하기</h2>
        <p className="text-sm text-gray-500">
          원하는 금액을 입력하고 환전하세요
        </p>
      </div>

      {/* 통화 선택 */}
      <div className="mb-4">
        <FormLabel className="mb-2 block text-sm font-medium text-gray-700">
          통화 선택
        </FormLabel>

        <Controller
          control={form.control}
          name="currency"
          render={({ field }) => (
            <div className="flex gap-2">
              {exchangeRates?.map((rate) => (
                <button
                  key={rate.currency}
                  type="button"
                  onClick={() => {
                    rate.currency !== field.value && onResetAmount();
                    field.onChange(rate.currency as "USD" | "JPY");
                  }}
                  className={cn(
                    "flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all",
                    field.value === rate.currency
                      ? "border-[#3CDC84] bg-[#3CDC84]/10 text-[#3CDC84]"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  )}
                >
                  {rate.currency}
                </button>
              ))}
            </div>
          )}
        />
      </div>

      {/* 매수/매도 토글 */}
      <Controller
        control={form.control}
        name="orderType"
        render={({ field }) => (
          <div className="mb-6 flex gap-2 rounded-xl bg-gray-100 p-1">
            <button
              type="button"
              className={cn(
                "flex-1 rounded-lg px-4 py-3 text-sm font-semibold text-white transition-all duration-200",
                field.value === "buy"
                  ? "bg-red-500 shadow-sm"
                  : "text-gray-600 hover:bg-gray-200"
              )}
              onClick={() => {
                field.value !== "buy" && onResetAmount();
                field.onChange("buy");
              }}
            >
              살래요
            </button>
            <button
              type="button"
              className={cn(
                "flex-1 rounded-lg px-4 py-3 text-sm font-semibold text-white transition-all duration-200",
                field.value === "sell"
                  ? "bg-blue-500 shadow-sm"
                  : "text-gray-600 hover:bg-gray-200"
              )}
              onClick={() => {
                field.value !== "sell" && onResetAmount();
                field.onChange("sell");
              }}
            >
              팔래요
            </button>
          </div>
        )}
      />

      {/* 입력 필드 */}
      <div className="mb-4">
        <FormLabel
          className="mb-2 block text-sm font-medium text-gray-700"
          htmlFor="amount"
        >
          {form.watch("orderType") === "buy" ? "매수 금액" : "매도 금액"}
        </FormLabel>

        <Controller
          control={form.control}
          name="amount"
          render={({ field }) => (
            <div className="relative flex items-center overflow-hidden rounded-lg border-2 border-gray-200 bg-white transition-colors focus-within:border-[#3CDC84]">
              <input
                type="number"
                id="amount"
                name="amount"
                placeholder="0"
                value={field.value}
                onChange={field.onChange}
                className="flex-1 border-0 bg-transparent px-4 py-3 text-lg font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none"
              />
              <div className="border-l border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
                {form.watch("currency")}
              </div>
            </div>
          )}
        />
      </div>

      {/* 환전 결과 */}
      <div className="mb-6">
        <FormLabel className="mb-2 block text-sm font-medium text-gray-700">
          필요 원화
        </FormLabel>
        <div className="relative flex items-center overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-50">
          <div className="flex-1 px-4 py-3 text-lg font-semibold text-gray-900">
            {NumberToCommas(quoteData?.krwAmount)}
          </div>

          <div
            className={cn(
              "border-l border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600",
              form.watch("orderType") === "buy"
                ? "text-red-600"
                : "text-blue-600"
            )}
          >
            {form.watch("orderType") === "buy"
              ? "원 필요해요"
              : "원을 받을 수 있어요"}
          </div>
        </div>
      </div>

      {/* 환율 정보 */}
      {quoteData && (
        <div className="bg-linear-to-r mb-6 rounded-lg from-blue-50 to-indigo-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">현재 환율</span>
            <span className="text-lg font-bold text-gray-900">
              {form.watch("currency") === "USD" ? "1 USD" : "1 JPY"}=
              {NumberToCommas(quoteData.appliedRate)}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={cn(
                "text-xs font-medium",
                quoteData.appliedRate > 0
                  ? "text-red-600"
                  : quoteData.appliedRate < 0
                    ? "text-blue-600"
                    : "text-gray-600"
              )}
            >
              {quoteData.appliedRate > 0
                ? "↑"
                : quoteData.appliedRate < 0
                  ? "↓"
                  : "→"}{" "}
              {Math.abs(quoteData.appliedRate).toFixed(2)}%
            </span>
            <span className="text-xs text-gray-500">전일 대비</span>
          </div>
        </div>
      )}

      {/* 환전 버튼 */}
      <button
        type="submit"
        disabled={!form.watch("amount") || form.watch("amount") <= 0}
        className={cn(
          "w-full rounded-lg bg-[#f7931a] px-6 py-4 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:bg-[#e6801b] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        )}
      >
        환전하기
      </button>
    </form>
  );
}
