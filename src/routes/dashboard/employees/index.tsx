import { createFileRoute } from '@tanstack/react-router'
import { EmployeeListScreen } from '@/modules/employee/screens/employe-list-screen'

export const Route = createFileRoute('/dashboard/employees/')({
  component: EmployeeListScreen,
})
