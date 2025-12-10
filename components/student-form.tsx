"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, AlertTriangle } from "lucide-react"
import type { Student } from "@/lib/types"

interface StudentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  student: Student | null
  onSubmit: (data: Omit<Student, "id" | "createdAt" | "updatedAt">) => Promise<void>
  loading: boolean
}

type FormData = Omit<Student, "id" | "createdAt" | "updatedAt">

function getStatusByGPA(gpa: number, currentStatus?: string): "active" | "inactive" | "graduated" | "suspended" {
  // Giữ nguyên nếu đã tốt nghiệp hoặc nghỉ học
  if (currentStatus === "graduated" || currentStatus === "inactive") {
    return currentStatus
  }

  // GPA < 2.0: Đình chỉ (học lực yếu)
  if (gpa < 2.0) {
    return "suspended"
  }

  // GPA >= 2.0: Đang học
  return "active"
}

function getGPAStatusInfo(gpa: number): { label: string; color: string } {
  if (gpa >= 3.6) return { label: "Xuất sắc", color: "text-emerald-500" }
  if (gpa >= 3.2) return { label: "Giỏi", color: "text-blue-500" }
  if (gpa >= 2.5) return { label: "Khá", color: "text-cyan-500" }
  if (gpa >= 2.0) return { label: "Trung bình", color: "text-yellow-500" }
  return { label: "Yếu - Cảnh báo", color: "text-red-500" }
}

const majors = [
  "Công nghệ thông tin",
  "Kỹ thuật phần mềm",
  "Khoa học máy tính",
  "Hệ thống thông tin",
  "An toàn thông tin",
  "Trí tuệ nhân tạo",
  "Kinh tế",
  "Quản trị kinh doanh",
  "Marketing",
  "Kế toán",
  "Tài chính ngân hàng",
]

const classes = [
  "CNTT01",
  "CNTT02",
  "KTPM01",
  "KTPM02",
  "KHMT01",
  "HTTT01",
  "ATTT01",
  "TTNT01",
  "KT01",
  "QTKD01",
  "MKT01",
  "KT02",
  "TCNH01",
]

export function StudentForm({ open, onOpenChange, student, onSubmit, loading }: StudentFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      studentId: "",
      fullName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "male",
      address: "",
      class: "",
      major: "",
      gpa: 0,
      status: "active",
      enrollmentDate: new Date().toISOString().split("T")[0],
    },
  })

  const currentGPA = watch("gpa")
  const currentStatus = watch("status")
  const gpaStatusInfo = getGPAStatusInfo(currentGPA || 0)

  useEffect(() => {
    if (currentStatus !== "graduated" && currentStatus !== "inactive") {
      const newStatus = getStatusByGPA(currentGPA || 0, currentStatus)
      if (newStatus !== currentStatus) {
        setValue("status", newStatus)
      }
    }
  }, [currentGPA, currentStatus, setValue])

  useEffect(() => {
    if (student) {
      reset({
        studentId: student.studentId,
        fullName: student.fullName,
        email: student.email,
        phone: student.phone,
        dateOfBirth: student.dateOfBirth,
        gender: student.gender,
        address: student.address,
        class: student.class,
        major: student.major,
        gpa: student.gpa,
        status: student.status,
        enrollmentDate: student.enrollmentDate,
      })
    } else {
      reset({
        studentId: "",
        fullName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "male",
        address: "",
        class: "",
        major: "",
        gpa: 0,
        status: "active",
        enrollmentDate: new Date().toISOString().split("T")[0],
      })
    }
  }, [student, reset])

  const handleFormSubmit = async (data: FormData) => {
    const finalStatus = getStatusByGPA(data.gpa, data.status)
    await onSubmit({ ...data, status: finalStatus })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{student ? "Chỉnh sửa sinh viên" : "Thêm sinh viên mới"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studentId">Mã sinh viên *</Label>
              <Input
                id="studentId"
                {...register("studentId", { required: "Mã sinh viên là bắt buộc" })}
                placeholder="VD: SV001"
              />
              {errors.studentId && <p className="text-sm text-destructive">{errors.studentId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Họ và tên *</Label>
              <Input
                id="fullName"
                {...register("fullName", { required: "Họ và tên là bắt buộc" })}
                placeholder="Nguyễn Văn A"
              />
              {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email là bắt buộc",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email không hợp lệ",
                  },
                })}
                placeholder="email@example.com"
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input id="phone" {...register("phone")} placeholder="0901234567" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Ngày sinh</Label>
              <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Giới tính</Label>
              <Select
                value={watch("gender")}
                onValueChange={(value) => setValue("gender", value as "male" | "female" | "other")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Nam</SelectItem>
                  <SelectItem value="female">Nữ</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="major">Ngành học *</Label>
              <Select value={watch("major")} onValueChange={(value) => setValue("major", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn ngành học" />
                </SelectTrigger>
                <SelectContent>
                  {majors.map((major) => (
                    <SelectItem key={major} value={major}>
                      {major}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="class">Lớp *</Label>
              <Select value={watch("class")} onValueChange={(value) => setValue("class", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn lớp" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gpa">GPA (0-4)</Label>
              <Input
                id="gpa"
                type="number"
                step="0.01"
                min="0"
                max="4"
                {...register("gpa", {
                  valueAsNumber: true,
                  min: { value: 0, message: "GPA phải từ 0" },
                  max: { value: 4, message: "GPA tối đa là 4" },
                })}
                placeholder="3.50"
              />
              {errors.gpa && <p className="text-sm text-destructive">{errors.gpa.message}</p>}
              {/* Hiển thị xếp loại học lực */}
              <p className={`text-sm font-medium ${gpaStatusInfo.color}`}>Xếp loại: {gpaStatusInfo.label}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={watch("status")}
                onValueChange={(value) =>
                  setValue("status", value as "active" | "inactive" | "graduated" | "suspended")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Đang học</SelectItem>
                  <SelectItem value="inactive">Nghỉ học</SelectItem>
                  <SelectItem value="graduated">Tốt nghiệp</SelectItem>
                  <SelectItem value="suspended">Đình chỉ</SelectItem>
                </SelectContent>
              </Select>
              {/* Ghi chú về logic tự động */}
              {currentGPA < 2.0 && currentStatus !== "graduated" && currentStatus !== "inactive" && (
                <div className="flex items-center gap-1 text-sm text-amber-500">
                  <AlertTriangle className="h-3 w-3" />
                  <span>GPA dưới 2.0 - Tự động đình chỉ</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="enrollmentDate">Ngày nhập học</Label>
              <Input id="enrollmentDate" type="date" {...register("enrollmentDate")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ</Label>
            <Textarea id="address" {...register("address")} placeholder="Nhập địa chỉ..." rows={2} />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {student ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
