"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MoreHorizontal, Pencil, Trash2, Eye, Mail } from 'lucide-react'
import { EmptyState } from "@/components/ui/empty-state"
import type { Student } from "@/lib/types"

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Đang học", className: "bg-success/10 text-success border-success/20" },
  inactive: { label: "Nghỉ học", className: "bg-muted text-muted-foreground border-border" },
  graduated: { label: "Tốt nghiệp", className: "bg-primary/10 text-primary border-primary/20" },
  suspended: { label: "Đình chỉ", className: "bg-destructive/10 text-destructive border-destructive/20" },
}

function getGPAClassification(gpa: number): { label: string; className: string } {
  if (gpa >= 3.6) return { label: "Xuất sắc", className: "text-emerald-500" }
  if (gpa >= 3.2) return { label: "Giỏi", className: "text-blue-500" }
  if (gpa >= 2.5) return { label: "Khá", className: "text-cyan-500" }
  if (gpa >= 2.0) return { label: "TB", className: "text-yellow-500" }
  return { label: "Yếu", className: "text-red-500" }
}

export function StudentTable({ students, onEdit, onDelete, onView, canEdit = true }: StudentTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleDelete = () => {
    if (deleteId && onDelete) {
      onDelete(deleteId)
      setDeleteId(null)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.5) return "text-success"
    if (gpa >= 2.5) return "text-primary"
    if (gpa >= 2.0) return "text-warning"
    return "text-destructive"
  }

  if (students.length === 0) {
    return (
      <EmptyState
        icon="students"
        title="Chưa có sinh viên nào"
        description="Bắt đầu bằng cách thêm sinh viên đầu tiên vào hệ thống"
      />
    )
  }

  return (
    <>
      <div className="rounded-xl border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-[280px]">Sinh viên</TableHead>
              <TableHead className="hidden lg:table-cell">Lớp</TableHead>
              <TableHead className="hidden lg:table-cell">Ngành</TableHead>
              <TableHead className="hidden md:table-cell text-center">GPA</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student, index) => (
              <TableRow 
                key={student.id} 
                className={cn(
                  "group transition-colors",
                  index % 2 === 0 ? "bg-transparent" : "bg-muted/20"
                )}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9 border border-border/50">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                        {getInitials(student.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{student.fullName}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-mono">{student.studentId}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {student.email}
                        </span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <span className="text-sm text-muted-foreground">{student.class}</span>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <span className="text-sm text-muted-foreground">{student.major}</span>
                </TableCell>
                <TableCell className="hidden md:table-cell text-center">
                  <div className="flex flex-col items-center gap-0.5">
                    <span className={cn("font-semibold text-sm", getGPAColor(student.gpa))}>
                      {student.gpa.toFixed(2)}
                    </span>
                    <span className={cn("text-xs", getGPAClassification(student.gpa).className)}>
                      {getGPAClassification(student.gpa).label}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={cn("font-medium", statusConfig[student.status]?.className)}
                  >
                    {statusConfig[student.status]?.label || student.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Mở menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => onView(student)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      {canEdit && onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(student)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                      )}
                      {canEdit && onDelete && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => setDeleteId(student.id)} 
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa sinh viên
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa sinh viên?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Dữ liệu sinh viên sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
