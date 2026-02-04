"use server";

import { END_POINT } from "@/_constants/end-point";
import { OrderDTO } from "@/_types/order";
import { serverAPI } from "@repo/shared/lib/server";

export const getOrderQuote = async (
  searchParams: OrderDTO["OrderQuoteReq"]
) => {
  const response = await serverAPI.get(END_POINT.ORDER.QUOTE, { searchParams });

  const data = (await response.json()) as ApiResponse<
    OrderDTO["OrderQuoteRes"]
  >;

  return data.data;
};

export const postOrderCreate = async (body: OrderDTO["OrderCreateReq"]) => {
  const response = await serverAPI.post(END_POINT.ORDER.LIST, { json: body });

  const data = (await response.json()) as ApiResponse<null>;

  return data.data;
};
