export const END_POINT = {
  LOGIN: "auth/login",
  EXCHANGE: {
    RATES: "exchange-rates/latest",
  },
  WALLET: {
    WALLETS: "wallets",
  },
  ORDER: {
    LIST: "orders",
    QUOTE: "orders/quote",
  },
} as const;
