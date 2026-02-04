type OrderQuoteResponse = {
  krwAmount: number;
  appliedRate: number;
};

type OrderQuoteRequest = {
  fromCurrency: string;
  toCurrency: string;
  forexAmount: number;
};

type OrderCreateRequest = {
  exchangeRateId: number;
  fromCurrency: string;
  toCurrency: string;
  forexAmount: number;
};

export type OrderDTO = {
  OrderQuoteReq: OrderQuoteRequest;
  OrderQuoteRes: OrderQuoteResponse;
  OrderCreateReq: OrderCreateRequest;
};
