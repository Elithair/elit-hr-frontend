import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import { routeTree } from '@/routeTree.gen'

const queryClient = new QueryClient()

const router = createRouter({
  routeTree,
  context: {
    queryClient: queryClient,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function AuthRouterProvider() {
  return <RouterProvider router={router} context={{}} />
}

export function Provider() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <AuthRouterProvider />
      </QueryClientProvider>
    </ThemeProvider>
  )
}
