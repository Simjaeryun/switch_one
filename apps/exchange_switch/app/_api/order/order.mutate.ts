"use client";

import { END_POINT } from "@/_constants/end-point";
import { getOrderQuote, postOrderCreate } from "./order.api";
import { OrderDTO } from "@/_types/order";
import { useMutation, useQueryClient } from "@repo/shared/lib/client";
import { revalidateCache } from "@repo/shared/lib/server";

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
    onSuccess: (data, body) => {
      if (data.code !== "OK") {
        queryClient.invalidateQueries({ queryKey: [END_POINT.EXCHANGE.RATES] });
        queryClient.invalidateQueries({ queryKey: [END_POINT.ORDER.QUOTE] });
        alert(data?.message || "주문 완료에 실패했습니다.");
        return;
      }

      // 성공
      alert(data.message);
      queryClient.invalidateQueries({ queryKey: [END_POINT.ORDER.LIST] });
      queryClient.invalidateQueries({ queryKey: [END_POINT.WALLET.WALLETS] });
      revalidateCache({ key: "order-history" });
    },
  });
};
