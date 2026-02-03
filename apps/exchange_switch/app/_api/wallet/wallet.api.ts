import { END_POINT } from "@/_constants/end-point";
import { WalletsResponse } from "@/_types/wallet";
import { serverAPI } from "@repo/shared/lib/server";

export async function getWallets() {
  const data = (await serverAPI
    .get(END_POINT.WALLET.WALLETS)
    .json()) as ApiResponse<WalletsResponse>;

  return data.data;
}
