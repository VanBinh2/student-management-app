"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { ChevronRight, Search, Bell } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  title: string
  breadcrumbs?: { label: string; href?: string }[]
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  actions?: React.ReactNode
}

export function Header({
  title,
  breadcrumbs,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Tìm kiếm...",
  actions,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex flex-col">
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-1 text-xs text-muted-foreground mb-0.5">
              {breadcrumbs.map((item, index) => (
                <span key={index} className="flex items-center gap-1">
                  {index > 0 && <ChevronRight className="w-3 h-3" />}
                  <span className={cn(index === breadcrumbs.length - 1 && "text-foreground font-medium")}>
                    {item.label}
                  </span>
                </span>
              ))}
            </nav>
          )}
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          {onSearchChange && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-[240px] pl-9 h-9 bg-muted/50 border-transparent focus:border-border"
              />
            </div>
          )}

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </Button>

          {/* Custom actions */}
          {actions}
        </div>
      </div>
    </header>
  )
}
