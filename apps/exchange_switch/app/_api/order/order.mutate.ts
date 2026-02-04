"use client";

import { END_POINT } from "@/_constants/end-point";
import { getOrderQuote, postOrderCreate } from "./order.api";
import { OrderDTO } from "@/_types/order";
import { useMutation, useQueryClient } from "@repo/shared/lib/client";

// 주문 견적 조회 (실시간성 데이터이므로 mutate 사용)
export const useOrderQuoteMutation = () => {
  return useMutation({
    mutationFn: (body: OrderDTO["OrderQuoteReq"]) => getOrderQuote(body),
  });
};

// 주문 생성
export const useOrderCreateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: OrderDTO["OrderCreateReq"]) => postOrderCreate(body),
    onSuccess: () => {
      alert("주문이 완료되었습니다.");
      queryClient.invalidateQueries({ queryKey: [END_POINT.ORDER.LIST] });
      queryClient.invalidateQueries({ queryKey: [END_POINT.WALLET.WALLETS] });
    },
    onError: () => {
      alert("주문 완료에 실패했습니다.");
    },
  });
};
