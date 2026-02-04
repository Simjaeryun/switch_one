"use server";

import { END_POINT } from "@/_constants/end-point";
import { OrderDTO } from "@/_types/order";
import { serverAPI } from "@repo/shared/lib/server";
import { parseErrorResponse } from "@repo/shared/utils";

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
  try {
    const response = await serverAPI.post(END_POINT.ORDER.LIST, { json: body });

    const data = (await response.json()) as ApiResponse<null>;

    return data;
  } catch (error) {
    return parseErrorResponse(error) as ApiResponse<null>;
  }
};

export const getOrderHistory = async () => {
  const response = await serverAPI.get(END_POINT.ORDER.LIST, {
    next: {
      tags: ["order-history"],
    },
    cache: "force-cache",
  });

  const data = (await response.json()) as ApiResponse<
    OrderDTO["OrderHistoryRes"]
  >;

  return data.data;
};
