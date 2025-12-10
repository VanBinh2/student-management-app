"use client"

import { cn } from "@/lib/utils"
import { Users, UserCheck, GraduationCap, TrendingUp, Briefcase, ArrowUpRight, ArrowDownRight } from "lucide-react"
import type { DashboardStats } from "@/lib/types"

interface DashboardStatsProps {
  stats: DashboardStats
  showTeachers?: boolean
}

export function DashboardStatsCards({ stats, showTeachers = false }: DashboardStatsProps) {
  const statCards = [
    {
      title: "Tổng sinh viên",
      value: stats.totalStudents,
      icon: Users,
      change: "+12%",
      changeType: "positive" as const,
      description: "so với tháng trước",
    },
    {
      title: "Đang học",
      value: stats.activeStudents,
      icon: UserCheck,
      change: "+5%",
      changeType: "positive" as const,
      description: "sinh viên đang theo học",
    },
    {
      title: "Đã tốt nghiệp",
      value: stats.graduatedStudents,
      icon: GraduationCap,
      change: "+8%",
      changeType: "positive" as const,
      description: "sinh viên đã ra trường",
    },
    {
      title: "GPA trung bình",
      value: stats.averageGPA.toFixed(2),
      icon: TrendingUp,
      change: "-0.5%",
      changeType: "negative" as const,
      description: "điểm trung bình",
    },
  ]

  if (showTeachers) {
    statCards.push({
      title: "Tổng giáo viên",
      value: stats.totalTeachers || 0,
      icon: Briefcase,
      change: "+3%",
      changeType: "positive" as const,
      description: `${stats.activeTeachers || 0} đang làm việc`,
    })
  }

  return (
    <div
      className={cn(
        "grid gap-4",
        showTeachers ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
      )}
    >
      {statCards.map((stat) => {
        const Icon = stat.icon
        const isPositive = stat.changeType === "positive"

        return (
          <div
            key={stat.title}
            className={cn(
              "group relative overflow-hidden rounded-xl border border-border/50 bg-card p-5",
              "transition-all duration-300 hover:border-border hover:shadow-md",
            )}
          >
            {/* Background gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">{stat.title}</span>
                <div className="p-2 rounded-lg bg-muted/50">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </div>

                <div
                  className={cn(
                    "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                    isPositive ? "text-success bg-success/10" : "text-destructive bg-destructive/10",
                  )}
                >
                  {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
