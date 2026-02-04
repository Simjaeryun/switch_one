import { END_POINT } from "@/_constants/end-point";
import { useQuery } from "@repo/shared/lib/client";
import { getOrderQuote } from "./order.api";
import { OrderDTO } from "@/_types/order";

export const useOrderQuoteQuery = (searchParams: OrderDTO["OrderQuoteReq"]) => {
  return useQuery({
    queryKey: [END_POINT.ORDER.QUOTE],
    queryFn: async () => {
      const result = await getOrderQuote(searchParams);
      return result;
    },
    enabled: searchParams.forexAmount > 0,
  });
};
