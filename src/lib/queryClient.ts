import { QueryClient } from '@tanstack/react-query'

// frontend-architecture.md §6.1 — React Query 전역 QueryClient
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
