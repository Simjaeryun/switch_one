type OrderQuoteResponse = {
  krwAmount: number;
  appliedRate: number;
};

type OrderQuoteRequest = {
  fromCurrency: "KRW" | "USD" | "JPY";
  toCurrency: "KRW" | "USD" | "JPY";
  forexAmount: number;
};

type OrderCreateRequest = {
  exchangeRateId: number;
  fromCurrency: "KRW" | "USD" | "JPY";
  toCurrency: "KRW" | "USD" | "JPY";
  forexAmount: number;
};

export type OrderDTO = {
  OrderQuoteReq: OrderQuoteRequest;
  OrderQuoteRes: OrderQuoteResponse;
  OrderCreateReq: OrderCreateRequest;
};
