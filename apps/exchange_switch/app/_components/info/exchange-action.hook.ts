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
    mutate(
      {
        fromCurrency: "KRW",
        toCurrency: form.getValues().currency,
        forexAmount: form.getValues().amount,
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
  };
};
