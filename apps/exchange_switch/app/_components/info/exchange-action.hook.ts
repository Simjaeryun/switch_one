"use client";

import { useExchangeRateQuery } from "@/_api/exchange-rate/exchange-rate.query";
import { useOrderQuoteMutation } from "@/_api/order/order.mutate";
import { OrderDTO } from "@/_types/order";
import { useForm } from "@repo/shared/lib/client";
import { useEffect, useState } from "react";

export const useExchangeAction = () => {
  const { mutate } = useOrderQuoteMutation();
  const [quoteData, setQuoteData] = useState<OrderDTO["OrderQuoteRes"] | null>(
    null
  );
  const { data: exchangeRates } = useExchangeRateQuery();

  const onResetAmount = () => {
    form.setValue("amount", 0);
    setQuoteData(null);
  };

  const form = useForm<{
    orderType: "buy" | "sell";
    currency: "USD" | "JPY";
    amount: number;
  }>({
    defaultValues: {
      orderType: "buy",
      currency: "JPY",
      amount: 0,
    },
  });

  useEffect(() => {
    if (form.watch("amount") <= 0) {
      setQuoteData(null);
      return;
    }
    mutate(
      {
        fromCurrency:
          form.watch("orderType") === "buy" ? "KRW" : form.watch("currency"),
        toCurrency:
          form.watch("orderType") === "buy" ? form.watch("currency") : "KRW",
        forexAmount: form.watch("amount"),
      },
      {
        onSuccess: (data) => {
          setQuoteData(data);
        },
        onError: (error) => {
          setQuoteData(null);
        },
      }
    );
  }, [form.watch("amount")]);

  return {
    form,
    quoteData,
    exchangeRates,
    onResetAmount,
  };
};
