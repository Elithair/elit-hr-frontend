import Cookie from 'js-cookie'
import { AppSidebar } from '../components/Sidebar'
import { SiteHeader } from '../components/SiteHeader'
import type React from 'react'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

/**
 * DashboardLayout - Main layout component for dashboard pages
 * Provides consistent structure with sidebar and main content area
 * Automatically adjusts content area based on sidebar state
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  const defaultOpen = Cookie.get('sidebar_state') === 'true'

  return (
    <SidebarProvider
      style={
        {
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
      defaultOpen={defaultOpen}
    >
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <main className={`flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8`}>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
