import { END_POINT } from "@/_constants/end-point";
import { ExchangeRateResponse } from "@/_types/exchange-rate";
import { apiInstance } from "@repo/shared/lib/server";

export async function getExchangeRateAction() {
  const data = (await apiInstance
    .get(END_POINT.EXCHANGE.RATES)
    .json()) as ApiResponse<ExchangeRateResponse>;

  return data;
}
