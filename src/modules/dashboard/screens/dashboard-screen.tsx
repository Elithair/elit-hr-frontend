import { memo, useCallback } from 'react'
import { Clock, TrendingUp, UserPlus, Users } from 'lucide-react'
import { ChevronRightIcon, PlusIcon } from '@heroicons/react/24/solid'
import type { ComponentType } from 'react'
import { APP_CONSTANTS } from '@/modules/dashboard/constants'
import { PageHeader } from '@/modules/dashboard/layout'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { REQUEST_TYPES } from '@/modules/dashboard/components/constants'

export default function DashboardScreen() {
  const handleRequestClick = useCallback((requestId: string) => {
    // TODO: Implement request creation logic
    console.log('Create request:', requestId)
  }, [])

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Welcome to ${APP_CONSTANTS.NAME} Dashboard`}
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Employees
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              New Hires This Month
            </CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Leave Requests
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Productivity Score
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest employee activities and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    John Doe joined the team
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Engineering Department - 2 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Leave request approved
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Sarah Smith - 5 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    New policy document uploaded
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Remote Work Policy - 1 day ago
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <PlusIcon className="size-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">New Request</h3>
              </div>
            </CardTitle>
            <CardDescription>What would you like to request?</CardDescription>
          </CardHeader>
          <CardContent>
            {REQUEST_TYPES.map((request) => (
              <RequestItem
                key={request.id}
                request={request}
                onClick={() => handleRequestClick(request.id)}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

interface RequestType {
  id: string
  titleEn: string
  titleTr: string
  descriptionEn: string
  descriptionTr: string
  icon: ComponentType<{ className?: string }>
  color: string
  bg: string
}

interface RequestItemProps {
  request: RequestType
  onClick: () => void
}

const RequestItem = memo<RequestItemProps>(({ request, onClick }) => {
  const Icon = request.icon

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative w-full rounded-lg p-4 text-left transition-all duration-200',
        'hover:bg-accent/50 active:scale-[0.98]',
      )}
      aria-label={`Create ${request.titleEn} request`}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex shrink-0 items-center justify-center size-12 rounded-full transition-transform group-hover:scale-110',
            request.bg,
          )}
        >
          <Icon className={cn('size-6', request.color)} />
        </div>
        <div className="flex-1 space-y-0.5 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold text-sm leading-tight">
              {request.titleEn}
            </h4>
            <ChevronRightIcon className="size-4 text-muted-foreground shrink-0 transition-transform group-hover:translate-x-1" />
          </div>
          <p className="text-xs text-muted-foreground leading-snug">
            {request.descriptionEn}
          </p>
        </div>
      </div>
    </button>
  )
})
