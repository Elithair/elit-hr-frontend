import { createFileRoute } from '@tanstack/react-router'
import AuthScreen from '../modules/auth/screens/auth-screen'
import { requireGuest } from '@/lib/route-guards'

export const Route = createFileRoute('/')({
  component: RouteComponent,
  beforeLoad: requireGuest,
})

function RouteComponent() {
  return <AuthScreen />
}
