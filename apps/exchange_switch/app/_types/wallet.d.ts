type WalletsResponse = {
  totalKrwBalance: number;
  wallets: Array<{
    walletId: number;
    currency: string;
    balance: number;
  }>;
};

export type WalletsDTO = {
  WalletsResponse: WalletsResponse;
};
