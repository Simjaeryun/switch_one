"use client";

import { useExchangeRateQuery } from "@/_api/exchange-rate/exchange-rate.query";
import { useOrderCreateMutation } from "@/_api/order/order.mutate";
import { useOrderQuoteQuery } from "@/_api/order/order.query";
import { END_POINT } from "@/_constants/end-point";
import { set, useForm, useQueryClient } from "@repo/shared/lib/client";
import { useEffect } from "react";

export const useExchangeAction = () => {
  const form = useForm<{
    orderType: "buy" | "sell";
    currency: "USD" | "JPY" | "";
    amount: number;
    exchangeRateId: number;
    resetCount: number;
  }>({
    defaultValues: {
      orderType: "buy",
      currency: "",
      amount: 0,
      exchangeRateId: 0,
      resetCount: 0,
    },
  });
  const queryClient = useQueryClient();
  const { mutateAsync: mutateCreateOrder } = useOrderCreateMutation();
  const { data: exchangeRates, isFetching: exchangeRateFetching } =
    useExchangeRateQuery();
  const { data: quoteData, isFetching: quoteFetching } = useOrderQuoteQuery({
    fromCurrency:
      form.watch("orderType") === "buy" ? "KRW" : form.watch("currency"),
    toCurrency:
      form.watch("orderType") === "buy" ? form.watch("currency") : "KRW",
    forexAmount: form.watch("amount"),
  });

  const onResetAmount = () => {
    form.setValue("amount", 0);
  };

  const onSubmit = async () => {
    if (form.watch("currency") === "") {
      alert("통화를 선택해주세요");
      return;
    }

    const data = await mutateCreateOrder({
      exchangeRateId: form.watch("exchangeRateId"),
      fromCurrency:
        form.watch("orderType") === "buy" ? "KRW" : form.watch("currency"),
      toCurrency:
        form.watch("orderType") === "buy" ? form.watch("currency") : "KRW",
      forexAmount: form.watch("amount"),
    });

    if (data.code === "EXCHANGE_RATE_MISMATCH") {
      form.setValue("currency", "");
      form.setValue("amount", 0);
      queryClient.setQueryData([END_POINT.ORDER.QUOTE], null);
    }
  };

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: [END_POINT.ORDER.QUOTE] });
    queryClient.invalidateQueries({ queryKey: [END_POINT.EXCHANGE.RATES] });
  }, [form.watch("amount")]);

  return {
    form,
    quoteData,
    exchangeRates,
    onResetAmount,
    onSubmit,
    quoteFetching,
  };
};
