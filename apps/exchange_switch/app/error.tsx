"use client";

import { ErrorScreen } from "@repo/shared/ui/client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorScreen error={error} reset={reset} />;
}
