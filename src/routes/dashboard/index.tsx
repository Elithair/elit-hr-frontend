import { createFileRoute } from '@tanstack/react-router'
import DashboardScreen from '@/modules/dashboard/screens/dashboard-screen'
import { requireAuth } from '@/lib/route-guards'

export const Route = createFileRoute('/dashboard/')({
  beforeLoad: requireAuth,
  component: DashboardScreen,
})
