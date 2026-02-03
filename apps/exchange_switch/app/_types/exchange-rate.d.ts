export type ExchangeRateResponse = Array<{
  exchangeRateId: number;
  currency: string;
  rate: number;
  changePercentage: number;
  applyDateTime: string;
}>;
