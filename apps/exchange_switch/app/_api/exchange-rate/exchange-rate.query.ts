import { useQuery } from "@repo/shared/lib/client";
import { getExchangeRates } from "./exchange-rate.api";
import { END_POINT } from "@/_constants/end-point";

export function useExchangeRateQuery() {
  return useQuery({
    queryKey: [END_POINT.EXCHANGE.RATES],
    queryFn: async () => {
      const result = await getExchangeRates();
      return result;
    },
    refetchInterval: 60000, // 1분마다 자동 refetch
    initialData: [],
  });
}
