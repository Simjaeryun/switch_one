"use client";

import { useExchangeRateQuery } from "@/_api/exchange-rate/exchange-rate.query";

import { useForm, useQueryClient } from "@repo/shared/lib/client";
import { FormLabel, Input } from "@repo/shared/ui/client";

export function ExchangeAction() {
  const { data } = useExchangeRateQuery();

  console.log(data, "data");

  const { register } = useForm({
    defaultValues: {
      amount: 0,
    },
  });

  return (
    <div>
      <select>
        <option value="USD">USD</option>
        <option value="JPY">JPY</option>
      </select>
      <FormLabel>매수금액</FormLabel>
      <Input
        type="number"
        placeholder="매수금액을 입력해주세요."
        {...register("amount")}
      />
      <button>Exchange</button>
    </div>
  );
}
