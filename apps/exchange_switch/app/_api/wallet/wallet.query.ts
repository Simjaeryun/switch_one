import { END_POINT } from "@/_constants/end-point";
import { useQuery } from "@repo/shared/lib/client";
import { getWallets } from "./wallet.api";

export function useWalletQuery() {
  return useQuery({
    queryKey: [END_POINT.WALLET.WALLETS],
    queryFn: async () => {
      const result = await getWallets();
      return result;
    },
    refetchInterval: 60000, // 1분마다 자동 refetch
  });
}
