import {
  CalendarDaysIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  Cog6ToothIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  ExclamationCircleIcon,
  FolderIcon,
  HomeIcon,
  InformationCircleIcon,
  PaperAirplaneIcon,
  UserPlusIcon,
  UsersIcon,
} from '@heroicons/react/24/solid'
import type { ComponentType } from 'react'

export interface Notification {
  id: number
  type: string
  title: string
  message: string
  timestamp: string
  icon: ComponentType<{ className?: string }>
  color: string
  bg: string
}

export interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

export interface RequestType {
  id: string
  titleEn: string
  titleTr: string
  descriptionEn: string
  descriptionTr: string
  icon: ComponentType<{ className?: string }>
  color: string
  bg: string
}

export interface SearchPage {
  id: string
  title: string
  description: string
  icon: ComponentType<{ className?: string }>
  href: string
}

export const UNREAD_NOTIFICATIONS: Array<Notification> = [
  {
    id: 1,
    type: 'info',
    title: 'New feature available',
    message: 'Check out the new dashboard analytics feature we just released!',
    timestamp: '5 minutes ago',
    icon: InformationCircleIcon,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    id: 2,
    type: 'success',
    title: 'Request approved',
    message: 'Your leave request for December 15-20 has been approved.',
    timestamp: '1 hour ago',
    icon: CheckCircleIcon,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    id: 3,
    type: 'user',
    title: 'New team member',
    message: 'Sarah Johnson joined the Marketing team.',
    timestamp: '3 hours ago',
    icon: UserPlusIcon,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    id: 4,
    type: 'document',
    title: 'Document shared',
    message: "John shared 'Q4 Report.pdf' with you.",
    timestamp: '5 hours ago',
    icon: DocumentTextIcon,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
]

export const READ_NOTIFICATIONS: Array<Notification> = [
  {
    id: 5,
    type: 'alert',
    title: 'System maintenance',
    message: 'Scheduled maintenance completed successfully.',
    timestamp: 'Yesterday',
    icon: ExclamationCircleIcon,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
  },
  {
    id: 6,
    type: 'mail',
    title: 'New message',
    message: 'You have a new message from the support team.',
    timestamp: '2 days ago',
    icon: EnvelopeIcon,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
  },
]

export const LANGUAGES: Array<Language> = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
  },
  {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    flag: '🇹🇷',
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇦🇪',
  },
]

export const REQUEST_TYPES: Array<RequestType> = [
  {
    id: 'leave',
    titleEn: 'Leave Request',
    titleTr: 'İzin',
    descriptionEn: 'Request time off from work',
    descriptionTr: 'İş yerinden izin talebi',
    icon: CalendarDaysIcon,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    id: 'advance',
    titleEn: 'Advance Payment',
    titleTr: 'Avans',
    descriptionEn: 'Request advance on salary',
    descriptionTr: 'Maaş avansı talebi',
    icon: CurrencyDollarIcon,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    id: 'overtime',
    titleEn: 'Overtime',
    titleTr: 'Fazla Mesai',
    descriptionEn: 'Submit overtime work hours',
    descriptionTr: 'Fazla mesai saati bildirimi',
    icon: ClockIcon,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
  {
    id: 'visa',
    titleEn: 'Visa Document',
    titleTr: 'Vize Belgesi',
    descriptionEn: 'Request visa documentation',
    descriptionTr: 'Vize belgesi talebi',
    icon: PaperAirplaneIcon,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
]

export const SEARCH_PAGES: Array<SearchPage> = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Overview and analytics',
    icon: HomeIcon,
    href: '/dashboard',
  },
  {
    id: 'team',
    title: 'Team',
    description: 'Manage team members',
    icon: UsersIcon,
    href: '/dashboard/team',
  },
  {
    id: 'reports',
    title: 'Reports',
    description: 'View and generate reports',
    icon: ChartBarIcon,
    href: '/dashboard/reports',
  },
  {
    id: 'documents',
    title: 'Documents',
    description: 'Access your files',
    icon: FolderIcon,
    href: '/dashboard/documents',
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Configure your account',
    icon: Cog6ToothIcon,
    href: '/dashboard/settings',
  },
]

// UI Constants
export const DROPDOWN_WIDTHS = {
  NOTIFICATIONS: 'min-w-[420px] max-w-[420px]',
  REQUESTS: 'min-w-[320px] max-w-[320px]',
  LANGUAGES: 'max-w-96',
} as const

export const MAX_NOTIFICATION_HEIGHT = 'max-h-[480px]'
