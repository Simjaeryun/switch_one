"use client";

import { useWalletQuery } from "@/_api/wallet/wallet.query";
import { NumberToCommas } from "@repo/shared/utils";

const CURRENCY_SYMBOL = {
  USD: "$",
  JPY: "¥",
  KRW: "₩",
};

export function Wallets() {
  const { data } = useWalletQuery();

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <div className="text-lg font-bold text-gray-800">내 지갑</div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-3">
          {data?.wallets.map((item) => (
            <div
              key={item.walletId}
              className="rounded-lg border border-gray-100 bg-gray-50 p-3"
            >
              <div className="text-sm font-semibold text-gray-700">
                {item.currency}
              </div>
              <div className="mt-1 text-lg font-bold text-gray-900">
                {CURRENCY_SYMBOL[item.currency as keyof typeof CURRENCY_SYMBOL]}{" "}
                {NumberToCommas(item.balance)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-gray-200 p-4">
        <div className="flex justify-between text-xl text-gray-500">
          <span className="font-bold">총 보유 자산</span>
          <span className="ml-2 text-xl font-semibold text-blue-500">
            {NumberToCommas(data?.totalKrwBalance)} {CURRENCY_SYMBOL["KRW"]}
          </span>
        </div>
      </div>
    </div>
  );
}
