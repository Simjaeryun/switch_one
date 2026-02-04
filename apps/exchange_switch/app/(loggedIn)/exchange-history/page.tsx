import { getOrderHistory } from "@/_api/order/order.api";
import { ExchangeHistoryTable } from "@/_components/exchange-history/exchange-history.table";

export default async function ExchangeHistoryPage() {
  const data = await getOrderHistory();
  return <ExchangeHistoryTable data={data || []} />;
}
