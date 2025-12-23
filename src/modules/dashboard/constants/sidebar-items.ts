import {
  CalendarIcon,
  ChartBarIcon,
  ClockIcon,
  Cog6ToothIcon,
  CurrencyDollarIcon,
  DocumentIcon,
  HomeIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'

interface NavItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  isActive?: boolean
  items?: Array<NavItem>
  requirement?: Array<'manager' | 'employee'>
}

export const SIDEBAR_ITEMS = [
  {
    title: 'Dashboard',
    url: '/',
    icon: HomeIcon,
    isActive: true,
    requirement: ['manager', 'employee'],
  },
  {
    title: 'Employees',
    url: '/',
    icon: UsersIcon,
    requirement: ['manager', 'employee'],
  },
  // {
  //   title: 'Applications',
  //   url: '/applications',
  //   icon: DocumentIcon,
  //   requirement: ['manager'],
  // },
  // {
  //   title: 'Leave Management',
  //   url: '/leave',
  //   icon: CalendarIcon,
  //   requirement: ['manager'],
  // },
  // {
  //   title: 'Payroll',
  //   url: '/payroll',
  //   icon: CurrencyDollarIcon,
  //   requirement: ['manager'],
  // },
  // {
  //   title: 'Time Tracking',
  //   url: '/time-tracking',
  //   icon: ClockIcon,
  //   requirement: ['manager'],
  // },
  // {
  //   title: 'Reports',
  //   url: '/reports',
  //   icon: ChartBarIcon,
  //   requirement: ['manager'],
  // },
  // {
  //   title: 'Settings',
  //   url: '/settings',
  //   icon: Cog6ToothIcon,
  //   requirement: ['manager'],
  // },
] satisfies Array<NavItem>
