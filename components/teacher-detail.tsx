"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Teacher } from "@/lib/types"

interface TeacherDetailProps {
  teacher: Teacher | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusLabels: Record<string, string> = {
  active: "Đang làm việc",
  inactive: "Tạm nghỉ",
  retired: "Đã nghỉ hưu",
}

const genderLabels: Record<string, string> = {
  male: "Nam",
  female: "Nữ",
  other: "Khác",
}

export function TeacherDetail({ teacher, open, onOpenChange }: TeacherDetailProps) {
  if (!teacher) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Chi tiết giáo viên</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">{teacher.fullName}</h3>
              <p className="text-sm text-muted-foreground">Mã GV: {teacher.teacherId}</p>
            </div>
            <Badge>{statusLabels[teacher.status]}</Badge>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{teacher.email || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Số điện thoại</p>
              <p className="font-medium">{teacher.phone || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Ngày sinh</p>
              <p className="font-medium">{teacher.dateOfBirth || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Giới tính</p>
              <p className="font-medium">{genderLabels[teacher.gender]}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Khoa</p>
              <p className="font-medium">{teacher.department || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Chức vụ</p>
              <p className="font-medium">{teacher.position || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Chuyên ngành</p>
              <p className="font-medium">{teacher.specialization || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Ngày vào làm</p>
              <p className="font-medium">{teacher.hireDate || "—"}</p>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground">Địa chỉ</p>
              <p className="font-medium">{teacher.address || "—"}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
