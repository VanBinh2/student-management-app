"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Eye, Pencil, Trash2 } from "lucide-react"
import type { Teacher } from "@/lib/types"

interface TeacherTableProps {
  teachers: Teacher[]
  onEdit: (teacher: Teacher) => void
  onDelete: (id: string) => void
  onView: (teacher: Teacher) => void
}

const statusLabels: Record<string, string> = {
  active: "Đang làm việc",
  inactive: "Tạm nghỉ",
  retired: "Đã nghỉ hưu",
}

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  inactive: "secondary",
  retired: "outline",
}

export function TeacherTable({ teachers, onEdit, onDelete, onView }: TeacherTableProps) {
  if (teachers.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">Chưa có giáo viên nào. Hãy thêm giáo viên mới!</div>
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã GV</TableHead>
            <TableHead>Họ và tên</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Khoa</TableHead>
            <TableHead>Chức vụ</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachers.map((teacher) => (
            <TableRow key={teacher.id}>
              <TableCell className="font-medium">{teacher.teacherId}</TableCell>
              <TableCell>{teacher.fullName}</TableCell>
              <TableCell>{teacher.email}</TableCell>
              <TableCell>{teacher.department}</TableCell>
              <TableCell>{teacher.position}</TableCell>
              <TableCell>
                <Badge variant={statusColors[teacher.status]}>{statusLabels[teacher.status]}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onView(teacher)}>
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Xem chi tiết</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(teacher)}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Sửa</span>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Xóa</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bạn có chắc chắn muốn xóa giáo viên {teacher.fullName}? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(teacher.id)}>Xóa</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
