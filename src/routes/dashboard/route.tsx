import { Outlet, createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@/modules/dashboard/layout'
import { requireAuth } from '@/lib/route-guards'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: requireAuth,
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}
