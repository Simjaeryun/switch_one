import { getExchangeRates } from "@/_api/exchange-rate/exchange-rate.api";
import { useExchangeRateQuery } from "@/_api/exchange-rate/exchange-rate.query";
import { ExchangeAction } from "@/_components/info/exchange-action";
import { ExchangeRateCard } from "@/_components/info/exchange-rates";
import { Wallets } from "@/_components/info/wallets";

export default async function InfoPage() {
  const exchangeRates = await getExchangeRates();

  return (
    <main className="flex h-full flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">환율 정보</h1>
        <p className="text-sm text-gray-500">
          실시간 환율을 확인하고 간편하게 환전하세요.
        </p>
      </div>

      <div className="flex flex-1 gap-6">
        <div className="flex w-1/2 flex-col gap-6">
          <ExchangeRateCard />
          <Wallets />
        </div>

        <div className="flex w-1/2 flex-1 flex-col">
          <ExchangeAction
            defaultValues={{
              orderType: "buy",
              currency: exchangeRates[0].currency as "USD" | "JPY",
              amount: 0,
              exchangeRateId: exchangeRates[0].exchangeRateId,
            }}
          />
        </div>
      </div>
    </main>
  );
}
