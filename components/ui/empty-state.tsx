"use client"

import { cn } from "@/lib/utils"
import { FileX2, Users, GraduationCap, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon?: "users" | "students" | "teachers" | "default"
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

const icons = {
  users: Users,
  students: GraduationCap,
  teachers: BookOpen,
  default: FileX2,
}

export function EmptyState({ icon = "default", title, description, action, className }: EmptyStateProps) {
  const Icon = icons[icon]

  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4", className)}>
      <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-6">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">{description}</p>
      {action && (
        <Button onClick={action.onClick} variant="outline" size="sm">
          {action.label}
        </Button>
      )}
    </div>
  )
}
