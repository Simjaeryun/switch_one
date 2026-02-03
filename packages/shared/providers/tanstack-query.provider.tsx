"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function TanstackQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  queryClient.setDefaultOptions({
    queries: {
      refetchOnWindowFocus: false,
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
