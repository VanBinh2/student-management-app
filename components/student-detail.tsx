"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone, MapPin, Calendar, BookOpen, Award } from "lucide-react"
import type { Student } from "@/lib/types"

interface StudentDetailProps {
  student: Student | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  active: { label: "Đang học", variant: "default" },
  inactive: { label: "Nghỉ học", variant: "secondary" },
  graduated: { label: "Tốt nghiệp", variant: "outline" },
  suspended: { label: "Đình chỉ", variant: "destructive" },
}

const genderMap: Record<string, string> = {
  male: "Nam",
  female: "Nữ",
  other: "Khác",
}

export function StudentDetail({ student, open, onOpenChange }: StudentDetailProps) {
  if (!student) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Chi tiết sinh viên</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
              {student.fullName.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{student.fullName}</h3>
              <p className="text-muted-foreground">{student.studentId}</p>
              <Badge variant={statusConfig[student.status]?.variant || "default"} className="mt-2">
                {statusConfig[student.status]?.label || student.status}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Thông tin liên hệ</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{student.email}</span>
              </div>
              {student.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{student.phone}</span>
                </div>
              )}
              {student.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{student.address}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Academic Info */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Thông tin học tập</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Ngành</p>
                  <p className="font-medium">{student.major}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Lớp</p>
                  <p className="font-medium">{student.class}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">GPA</p>
                  <p
                    className={`font-medium ${
                      student.gpa >= 3.5
                        ? "text-green-600"
                        : student.gpa >= 2.5
                          ? "text-blue-600"
                          : student.gpa >= 2.0
                            ? "text-yellow-600"
                            : "text-red-600"
                    }`}
                  >
                    {student.gpa.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Nhập học</p>
                  <p className="font-medium">{student.enrollmentDate}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Personal Info */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Thông tin cá nhân</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Giới tính</p>
                <p className="font-medium">{genderMap[student.gender] || student.gender}</p>
              </div>
              {student.dateOfBirth && (
                <div>
                  <p className="text-sm text-muted-foreground">Ngày sinh</p>
                  <p className="font-medium">{student.dateOfBirth}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
