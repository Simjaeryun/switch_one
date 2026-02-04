type OrderQuoteResponse = {
  krwAmount: number;
  appliedRate: number;
};

type OrderQuoteRequest = {
  fromCurrency: string;
  toCurrency: string;
  forexAmount: number;
};

type OrderHistoryResponse = {
  orderId: number;
  fromCurrency: string;
  fromAmount: number;
  toCurrency: string;
  toAmount: number;
  appliedRate: number;
  orderedAt: string;
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
  OrderHistoryRes: Array<OrderHistoryResponse>;
};
