"use client";

import { getOrderQuote } from "./order.api";
import { OrderDTO } from "@/_types/order";
import { useMutation } from "@repo/shared/lib/client";

export const useOrderQuoteMutation = () => {
  return useMutation({
    mutationFn: (body: OrderDTO["OrderQuoteReq"]) => getOrderQuote(body),
  });
};
