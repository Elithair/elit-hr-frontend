import {
  ArrowRightOnRectangleIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  Cog6ToothIcon,
  CurrencyDollarIcon,
  DocumentIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  UserCircleIcon,
  UserIcon,
} from '@heroicons/react/24/solid'

// Application branding constants
export const APP_CONSTANTS = {
  NAME: 'ELIT HRMS',
  DESCRIPTION: 'Human Resource Management System',
  VERSION: '1.0.0',
}

export interface DropdownItem {
  id: string
  label: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
  action?: () => void
}

export interface RequestDropdownItem extends DropdownItem {
  type: 'leave' | 'advance-payment' | 'extra-shift' | 'visa'
}

export const REQUEST_ITEMS: Array<RequestDropdownItem> = [
  {
    id: 'leave',
    label: 'Leave Request',
    type: 'leave',
    icon: CalendarDaysIcon,
    href: '/requests/leave',
  },
  {
    id: 'advance-payment',
    label: 'Advance Payment',
    type: 'advance-payment',
    icon: CurrencyDollarIcon,
    href: '/requests/advance-payment',
  },
  {
    id: 'extra-shift',
    label: 'Extra Shift',
    type: 'extra-shift',
    icon: ClockIcon,
    href: '/requests/extra-shift',
  },
  {
    id: 'visa',
    label: 'Visa Request',
    type: 'visa',
    icon: DocumentIcon,
    href: '/requests/visa',
  },
]

export interface ProfileDropdownItem extends DropdownItem {
  type: 'profile' | 'settings' | 'help' | 'logout'
}

// Note: Logout action should be set dynamically in the component using useAuth
export const PROFILE_ITEMS_CONFIG: Array<Omit<ProfileDropdownItem, 'action'>> =
  [
    {
      id: 'show-profile',
      label: 'Show Profile',
      type: 'profile',
      icon: UserIcon,
      href: '/',
    },
    {
      id: 'settings',
      label: 'Settings',
      type: 'settings',
      icon: Cog6ToothIcon,
      href: '/',
    },
    {
      id: 'help',
      label: 'Help',
      type: 'help',
      icon: QuestionMarkCircleIcon,
      href: '/',
    },
    {
      id: 'logout',
      label: 'Logout',
      type: 'logout',
      icon: ArrowRightOnRectangleIcon,
    },
  ]

// Deprecated: Use PROFILE_ITEMS_CONFIG instead and add actions in component
export const PROFILE_ITEMS: Array<ProfileDropdownItem> = [
  ...PROFILE_ITEMS_CONFIG.slice(0, -1),
  {
    ...PROFILE_ITEMS_CONFIG[PROFILE_ITEMS_CONFIG.length - 1],
    action: () => {
      console.log('Logout clicked - action should be set in component')
    },
  },
]

// Dashboard icon constants
export const DASHBOARD_ICONS = {
  BRAND: HomeIcon,
  REQUESTS: ClipboardDocumentListIcon,
  PROFILE: UserCircleIcon,
}

export * from './sidebar-items'
export * from './query-keys'
