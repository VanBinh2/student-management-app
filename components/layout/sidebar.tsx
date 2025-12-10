"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Moon,
  Sun,
  Database,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { UserRole } from "@/lib/types"
import Link from "next/link"

interface SidebarProps {
  currentTab: string
  onTabChange: (tab: string) => void
  userRole: UserRole
  userName: string
  userEmail: string
  onLogout: () => void
  darkMode: boolean
  onToggleDarkMode: () => void
}

interface NavItem {
  id: string
  label: string
  icon: typeof LayoutDashboard
  roles: UserRole[]
  href?: string
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "teacher", "user"] },
  { id: "students", label: "Sinh viên", icon: GraduationCap, roles: ["admin", "teacher", "user"] },
  { id: "teachers", label: "Giáo viên", icon: BookOpen, roles: ["admin"] },
  { id: "users", label: "Phân quyền", icon: Users, roles: ["admin"] },
  { id: "seed", label: "Khởi tạo dữ liệu", icon: Database, roles: ["admin"], href: "/seed" },
]

export function Sidebar({
  currentTab,
  onTabChange,
  userRole,
  userName,
  userEmail,
  onLogout,
  darkMode,
  onToggleDarkMode,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  const filteredItems = navItems.filter((item) => item.roles.includes(userRole))

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon
    const isActive = currentTab === item.id

    const className = cn(
      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
      "transition-all duration-200",
      isActive
        ? "bg-sidebar-accent text-sidebar-accent-foreground"
        : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
    )

    const content = (
      <>
        <Icon className={cn("w-5 h-5 shrink-0", isActive && "text-primary")} />
        {!collapsed && <span className="truncate">{item.label}</span>}
      </>
    )

    if (item.href) {
      return (
        <Link href={item.href} className={className}>
          {content}
        </Link>
      )
    }

    return (
      <button onClick={() => onTabChange(item.id)} className={className}>
        {content}
      </button>
    )
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border",
          "flex flex-col transition-all duration-300 ease-in-out",
          collapsed ? "w-[68px]" : "w-[240px]",
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex items-center h-16 px-4 border-b border-sidebar-border",
            collapsed ? "justify-center" : "gap-3",
          )}
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && <span className="font-semibold text-sidebar-foreground truncate">Smart Manager</span>}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
          {filteredItems.map((item) => {
            const navElement = renderNavItem(item)

            if (collapsed) {
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>{navElement}</TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return <div key={item.id}>{navElement}</div>
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-3 border-t border-sidebar-border space-y-2">
          {/* Theme toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onToggleDarkMode}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm",
                  "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
                  "transition-all duration-200",
                )}
              >
                {darkMode ? <Sun className="w-5 h-5 shrink-0" /> : <Moon className="w-5 h-5 shrink-0" />}
                {!collapsed && <span>{darkMode ? "Chế độ sáng" : "Chế độ tối"}</span>}
              </button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">{darkMode ? "Chế độ sáng" : "Chế độ tối"}</TooltipContent>}
          </Tooltip>

          {/* User info */}
          <div
            className={cn("flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent/30", collapsed && "justify-center")}
          >
            <Avatar className="w-8 h-8 shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{userName}</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">{userEmail}</p>
              </div>
            )}
          </div>

          {/* Logout */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onLogout}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm",
                  "text-destructive hover:bg-destructive/10",
                  "transition-all duration-200",
                )}
              >
                <LogOut className="w-5 h-5 shrink-0" />
                {!collapsed && <span>Đăng xuất</span>}
              </button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">Đăng xuất</TooltipContent>}
          </Tooltip>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "absolute -right-3 top-20 w-6 h-6 rounded-full border border-border",
            "bg-background flex items-center justify-center",
            "hover:bg-accent transition-colors shadow-sm",
          )}
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>
    </TooltipProvider>
  )
}
