import { getExchangeRateAction } from "@/_api/exchange-rate.api";

export default async function InfoPage() {
  const data = await getExchangeRateAction();
  return <div>{JSON.stringify(data)}</div>;
}
