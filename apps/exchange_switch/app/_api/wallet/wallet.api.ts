"use server";

import { END_POINT } from "@/_constants/end-point";
import { WalletsDTO } from "@/_types/wallet";
import { serverAPI } from "@repo/shared/lib/server";

export async function getWallets() {
  const data = (await serverAPI
    .get(END_POINT.WALLET.WALLETS, {})
    .json()) as ApiResponse<WalletsDTO["WalletsResponse"]>;

  return data.data;
}
