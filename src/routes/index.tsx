import { createFileRoute } from '@tanstack/react-router'
import AuthScreen from '../modules/auth/screens/auth-screen'

export const Route = createFileRoute('/')({
  component: RouteComponent,
  // beforeLoad: requireGuest,
})

function RouteComponent() {
  return <AuthScreen />
}
