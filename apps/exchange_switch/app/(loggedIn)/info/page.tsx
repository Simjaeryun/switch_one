import { getWallets } from "@/_api/wallet/wallet.api";
import { ExchangeRateCard } from "@/_components/info/exchange-rates";
import { Wallets } from "@/_components/info/wallets";

export default async function InfoPage() {
  const wallets = await getWallets();

  return (
    <main className="flex h-full flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">환율 정보</h1>
        <p className="text-sm text-gray-500">
          실시간 환율을 확인하고 간편하게 환전하세요.
        </p>
      </div>

      <div className="flex min-h-0 flex-1 gap-6">
        <div className="flex min-h-0 w-1/2 flex-col gap-6">
          <ExchangeRateCard />
          <Wallets data={wallets} />
        </div>

        <div className="w-1/2">
          <ExchangeRateCard />
        </div>
      </div>
    </main>
  );
}
