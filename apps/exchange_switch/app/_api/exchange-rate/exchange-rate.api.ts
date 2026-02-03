"use server";

import { END_POINT } from "@/_constants/end-point";
import { ExchangeRateResponse } from "@/_types/exchange-rate";
import { serverAPI } from "@repo/shared/lib/server";

export async function getExchangeRates() {
  const data = (await serverAPI
    .get(END_POINT.EXCHANGE.RATES, {})
    .json()) as ApiResponse<ExchangeRateResponse>;

  return data.data;
}
