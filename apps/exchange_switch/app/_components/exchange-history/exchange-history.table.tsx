"use client";

import { OrderDTO } from "@/_types/order";
import { JrTable } from "@repo/shared/ui/client";
import { formatDatef, NumberToCommas } from "@repo/shared/utils";

export function ExchangeHistoryTable({
  data,
}: {
  data: OrderDTO["OrderHistoryRes"];
}) {
  return (
    <JrTable
      data={data}
      columns={[
        {
          header: "거래 ID",
          accessorKey: "orderId",
        },
        {
          header: "거래일시",
          accessorKey: "orderedAt",
          cell: ({ row }) => {
            return <div>{formatDatef(row.original.orderedAt)}</div>;
          },
        },
        {
          header: "매수금액",
          accessorKey: "fromAmount",
          cell: ({ row }) => {
            return <div>{NumberToCommas(row.original.fromAmount)}</div>;
          },
        },
        {
          header: "매도금액",
          accessorKey: "toAmount",
          cell: ({ row }) => {
            return <div>{NumberToCommas(row.original.toAmount)}</div>;
          },
        },
        {
          header: "환율",
          accessorKey: "appliedRate",
          cell: ({ row }) => {
            return <div>{NumberToCommas(row.original.appliedRate)}</div>;
          },
        },
      ]}
      renderItem={() => (
        <div>
          <h1 className="text-2xl font-bold">환전 내역</h1>
          <p className="text-sm text-gray-500">
            환전 내역을 확인하실 수 있어요
          </p>
        </div>
      )}
    />
  );
}
