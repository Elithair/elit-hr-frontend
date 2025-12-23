import { memo, useCallback, useEffect, useState } from 'react'
import {
  BellIcon,
  CheckCircleIcon,
  CheckIcon,
  Cog6ToothIcon,
  LanguageIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/solid'
import {
  CommandIcon,
  Laptop,
  Moon,
  Sun,
  UserRound,
  UsersRound,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import {
  DROPDOWN_WIDTHS,
  LANGUAGES,
  MAX_NOTIFICATION_HEIGHT,
  READ_NOTIFICATIONS,
  SEARCH_PAGES,
  UNREAD_NOTIFICATIONS,
} from './constants'
import type { ComponentType } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from '@/components/animate-ui/components/radix/tabs'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/stores/app-store'
import { user } from '@/modules/auth/types/user'
import { useTheme } from '@/providers/theme-provider'

/**
 * Internal type definitions for SiteHeader component
 */

interface Notification {
  id: number
  type: string
  title: string
  message: string
  timestamp: string
  icon: ComponentType<{ className?: string }>
  color: string
  bg: string
}

interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

interface NotificationItemProps {
  notification: Notification
  isRead?: boolean
  onRead?: (id: number) => void
}

interface LanguageItemProps {
  language: Language
  isSelected: boolean
  onClick: () => void
}

/**
 * SiteHeader Component
 *
 * Main header component for the dashboard that includes:
 * - Search functionality with keyboard shortcuts (Cmd/Ctrl+K)
 * - Notifications panel with read/unread tabs
 * - Language selection
 *
 * @example
 * ```tsx
 * <SiteHeader />
 * ```
 */
export function SiteHeader() {
  const { data, error } = useQuery({
    queryKey: ['active-member-role'],
    queryFn: () => {
      return { data: { role: '' } }
    },
  })

  if (error) {
    console.error('Error fetching active member role:', error)
  }

  if (!data) {
    return null
  }

  // TODO: Update this after every role or permission is decided
  const isEmployee = user?.role === 'user' || data.data?.role !== 'manager'

  return (
    <>
      {/* Header */}
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex flex-row items-center justify-between w-full px-4 lg:gap-2 lg:px-6">
          {/* Left section: Sidebar trigger and breadcrumb */}
          <div className="flex flex-row items-center gap-1">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
          </div>

          {/* Right section: Actions */}
          <div className="flex flex-row items-center gap-3">
            <SearchBar />

            <NotificationDropdown />

            <ChangeLanguage />

            {isEmployee && <EmployeeModeSwitch />}

            <ThemeSwitch />
          </div>
        </div>
      </header>
    </>
  )
}

const ThemeSwitch = () => {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Change Theme</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="inline-block size-4" />
          <p>Light</p>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="inline-block size-4" />
          <p>Dark</p>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Laptop className="inline-block size-4" />
          <p>System</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const EmployeeModeSwitch = () => {
  const { employeeMode, setEmployeeMode } = useAppStore()

  return (
    <div className="flex items-center space-x-2">
      <Label>
        <Tooltip>
          <TooltipTrigger>
            <UserRound className="inline-block size-4" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Employee Mode</p>
          </TooltipContent>
        </Tooltip>
      </Label>
      <Switch
        checked={employeeMode !== 'employee'}
        onCheckedChange={(e) => setEmployeeMode(e ? 'manager' : 'employee')}
      />
      <Label>
        <Tooltip>
          <TooltipTrigger>
            <UsersRound className="inline-block size-4" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Manager Mode</p>
          </TooltipContent>
        </Tooltip>
      </Label>
    </div>
  )
}

const SearchBar = () => {
  const [commandOpen, setCommandOpen] = useState(false)

  // Event handlers with useCallback for performance optimization
  const handleCommandOpenChange = useCallback((open: boolean) => {
    setCommandOpen(open)
  }, [])

  const handleOpenCommandDialog = useCallback(() => {
    setCommandOpen(true)
  }, [])

  const handleNavigate = useCallback((href: string) => {
    // TODO: Implement navigation logic
    console.log('Navigate to:', href)
  }, [])

  const handleOpenSettings = useCallback(() => {
    // TODO: Implement settings navigation
    console.log('Open settings')
  }, [])

  const handleOpenNotifications = useCallback(() => {
    // TODO: Implement notifications panel opening
    console.log('Open notifications')
  }, [])

  // Keyboard shortcut for command dialog (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <SearchCommandDialog
        open={commandOpen}
        onOpenChange={handleCommandOpenChange}
        onNavigate={handleNavigate}
        onOpenSettings={handleOpenSettings}
        onOpenNotifications={handleOpenNotifications}
      />
      {/* Search Button */}
      <Button
        variant="outline"
        size="sm"
        startIcon={
          <MagnifyingGlassIcon className="group-hover:text-foreground size-4 text-muted-foreground" />
        }
        className="group min-w-56 justify-start"
        onClick={handleOpenCommandDialog}
        aria-label="Open search dialog (Cmd+K)"
      >
        <p className="group-hover:text-foreground text-sm font-normal text-muted-foreground">
          Type to search...
        </p>
        <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <CommandIcon className="size-3" />K
        </kbd>
      </Button>
    </>
  )
}

const NotificationDropdown = () => {
  const [unreadNotifications, setUnreadNotifications] =
    useState(UNREAD_NOTIFICATIONS)
  const [readNotifications, setReadNotifications] = useState(READ_NOTIFICATIONS)

  const handleNotificationRead = useCallback((id: number) => {
    setUnreadNotifications((prev) => {
      const notification = prev.find((n) => n.id === id)
      if (notification) {
        setReadNotifications((prevRead) => [notification, ...prevRead])
        return prev.filter((n) => n.id !== id)
      }
      return prev
    })
  }, [])

  const handleMarkAllAsRead = useCallback(() => {
    setReadNotifications((prev) => [...unreadNotifications, ...prev])
    setUnreadNotifications([])
  }, [unreadNotifications])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="outline"
                size="sm"
                startIcon={<BellIcon className="size-4" />}
                aria-label={`Notifications (${unreadNotifications.length} unread)`}
              />
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center">
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={12}>
        <NotificationsDropdown
          unreadNotifications={unreadNotifications}
          readNotifications={readNotifications}
          onMarkAllAsRead={handleMarkAllAsRead}
          onNotificationRead={handleNotificationRead}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * Language selection dropdown with language items
 * @internal
 */

const LanguageItem = memo<LanguageItemProps>(
  ({ language, isSelected, onClick }) => {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'group relative w-full rounded-lg p-3 text-left transition-all duration-200',
          'hover:bg-accent',
          isSelected && 'bg-accent/50',
        )}
        aria-label={`Select ${language.name} language`}
        aria-pressed={isSelected}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center size-10 rounded-full bg-muted text-xl"
              aria-hidden="true"
            >
              {language.flag}
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{language.nativeName}</span>
              <span className="text-xs text-muted-foreground">
                {language.name}
              </span>
            </div>
          </div>
          {isSelected && (
            <CheckIcon
              className="size-5 text-primary shrink-0"
              aria-label="Selected"
            />
          )}
        </div>
      </button>
    )
  },
)

const LanguageDropdown = ({
  selectedLanguage,
  onLanguageChange,
}: {
  selectedLanguage: string
  onLanguageChange: (languageCode: string) => void
}) => {
  return (
    <div className={`${DROPDOWN_WIDTHS.LANGUAGES} p-0`}>
      <div className="p-4 pb-3 border-b">
        <div className="flex items-center gap-2">
          <LanguageIcon className="size-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Select Language</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Choose your preferred language
        </p>
      </div>
      <div className="p-3 space-y-1">
        {LANGUAGES.map((language) => (
          <LanguageItem
            key={language.code}
            language={language}
            isSelected={selectedLanguage === language.code}
            onClick={() => onLanguageChange(language.code)}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * Notifications dropdown with read/unread tabs
 * @internal
 */

const NotificationItem = memo<NotificationItemProps>(
  ({ notification, isRead = false, onRead }) => {
    const Icon = notification.icon

    const handleClick = () => {
      if (!isRead && onRead) {
        onRead(notification.id)
      }
    }

    return (
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          'group relative w-full rounded-lg p-4 text-left transition-all duration-200',
          'hover:bg-accent/50',
          isRead ? 'opacity-60' : 'bg-accent/30',
        )}
        aria-label={`${notification.title}. ${notification.message}`}
      >
        {!isRead && (
          <div className="absolute right-3 top-3 size-2 rounded-full bg-primary animate-pulse" />
        )}
        <div className="flex gap-3">
          <div
            className={cn(
              'flex shrink-0 items-center justify-center size-10 rounded-full',
              notification.bg,
            )}
          >
            <Icon className={cn('size-5', notification.color)} />
          </div>
          <div className="flex-1 space-y-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-semibold text-sm leading-tight">
                {notification.title}
              </h4>
            </div>
            <p className="text-sm text-muted-foreground leading-snug line-clamp-2">
              {notification.message}
            </p>
            <p className="text-xs text-muted-foreground/70 pt-0.5">
              {notification.timestamp}
            </p>
          </div>
        </div>
      </button>
    )
  },
)

const NotificationsDropdown = ({
  unreadNotifications,
  readNotifications,
  onMarkAllAsRead,
  onNotificationRead,
}: {
  unreadNotifications: Array<Notification>
  readNotifications: Array<Notification>
  onMarkAllAsRead?: () => void
  onNotificationRead?: (id: number) => void
}) => {
  const handleMarkAllAsRead = useCallback(() => {
    onMarkAllAsRead?.()
  }, [onMarkAllAsRead])

  return (
    <div className={`${DROPDOWN_WIDTHS.NOTIFICATIONS} p-0`}>
      <div className="p-4 pb-3 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Notifications</h3>
          {unreadNotifications.length > 0 && (
            <span className="flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
              {unreadNotifications.length} new
            </span>
          )}
        </div>
      </div>

      <Tabs defaultValue="unread-notifications">
        <div className="px-4 pt-3">
          <TabsList className="bg-muted/50 w-full">
            <TabsTrigger
              value="unread-notifications"
              className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Unread
            </TabsTrigger>
            <TabsTrigger
              value="read-notifications"
              className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Read
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContents>
          <TabsContent value="unread-notifications" className="mt-0">
            <div className={`${MAX_NOTIFICATION_HEIGHT} overflow-y-auto`}>
              {unreadNotifications.length > 0 ? (
                <div className="space-y-1 p-3">
                  {unreadNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onRead={onNotificationRead}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <div className="flex items-center justify-center size-16 rounded-full bg-muted mb-4">
                    <CheckCircleIcon className="size-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    All caught up! No new notifications.
                  </p>
                </div>
              )}
            </div>
            {unreadNotifications.length > 0 && (
              <div className="border-t p-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full font-normal"
                  startIcon={<CheckCircleIcon className="size-4" />}
                  onClick={handleMarkAllAsRead}
                >
                  Mark all as read
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="read-notifications" className="mt-0">
            <div className={`${MAX_NOTIFICATION_HEIGHT} overflow-y-auto`}>
              {readNotifications.length > 0 ? (
                <div className="space-y-1 p-3">
                  {readNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      isRead
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <div className="flex items-center justify-center size-16 rounded-full bg-muted mb-4">
                    <BellIcon className="size-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    No read notifications yet.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </TabsContents>
      </Tabs>
    </div>
  )
}

/**
 * Command palette for searching pages, creating requests, and quick actions
 * @internal
 */

const SearchCommandDialog = ({
  open,
  onOpenChange,
  onNavigate,
  onOpenSettings,
  onOpenNotifications,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNavigate?: (href: string) => void
  onOpenSettings?: () => void
  onOpenNotifications?: () => void
}) => {
  const handleNavigate = (href: string) => {
    onNavigate?.(href)
    onOpenChange(false)
  }

  const handleSettings = () => {
    onOpenSettings?.()
    onOpenChange(false)
  }

  const handleNotifications = () => {
    onOpenNotifications?.()
    onOpenChange(false)
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type to search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Pages">
          {SEARCH_PAGES.map((page) => {
            const Icon = page.icon
            return (
              <CommandItem
                key={page.id}
                value={page.title}
                onSelect={() => handleNavigate(page.href)}
              >
                <Icon className="size-4" />
                <div className="flex flex-col">
                  <span>{page.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {page.description}
                  </span>
                </div>
              </CommandItem>
            )
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={handleSettings}>
            <Cog6ToothIcon className="size-4" />
            <span>Settings</span>
          </CommandItem>
          <CommandItem onSelect={handleNotifications}>
            <BellIcon className="size-4" />
            <span>Notifications</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

const ChangeLanguage = () => {
  const { language, setLanguage } = useAppStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="sm"
                startIcon={<LanguageIcon className="size-4" />}
                aria-label="Change language"
              />
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center">
              <p>Language</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={12}>
        <LanguageDropdown
          selectedLanguage={language}
          onLanguageChange={setLanguage}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
