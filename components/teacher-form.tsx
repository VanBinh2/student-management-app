"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import type { Teacher } from "@/lib/types"

interface TeacherFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  teacher: Teacher | null
  onSubmit: (data: Omit<Teacher, "id" | "createdAt" | "updatedAt">) => Promise<void>
  loading: boolean
}

type FormData = Omit<Teacher, "id" | "createdAt" | "updatedAt">

const departments = ["Công nghệ thông tin", "Kinh tế", "Ngoại ngữ", "Cơ khí", "Điện tử", "Xây dựng"]

const positions = ["Giảng viên", "Giảng viên chính", "Phó giáo sư", "Giáo sư", "Trưởng khoa", "Phó trưởng khoa"]

export function TeacherForm({ open, onOpenChange, teacher, onSubmit, loading }: TeacherFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      teacherId: "",
      fullName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "male",
      address: "",
      department: "",
      position: "",
      specialization: "",
      status: "active",
      hireDate: "",
    },
  })

  useEffect(() => {
    if (teacher) {
      reset({
        teacherId: teacher.teacherId,
        fullName: teacher.fullName,
        email: teacher.email,
        phone: teacher.phone,
        dateOfBirth: teacher.dateOfBirth,
        gender: teacher.gender,
        address: teacher.address,
        department: teacher.department,
        position: teacher.position,
        specialization: teacher.specialization,
        status: teacher.status,
        hireDate: teacher.hireDate,
      })
    } else {
      reset({
        teacherId: "",
        fullName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "male",
        address: "",
        department: "",
        position: "",
        specialization: "",
        status: "active",
        hireDate: "",
      })
    }
  }, [teacher, reset])

  const handleFormSubmit = async (data: FormData) => {
    await onSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{teacher ? "Sửa thông tin giáo viên" : "Thêm giáo viên mới"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="teacherId">Mã giáo viên *</Label>
              <Input
                id="teacherId"
                {...register("teacherId", { required: "Vui lòng nhập mã giáo viên" })}
                placeholder="VD: GV001"
              />
              {errors.teacherId && <p className="text-sm text-destructive">{errors.teacherId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Họ và tên *</Label>
              <Input
                id="fullName"
                {...register("fullName", { required: "Vui lòng nhập họ tên" })}
                placeholder="VD: Nguyễn Văn A"
              />
              {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "Vui lòng nhập email",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email không hợp lệ",
                  },
                })}
                placeholder="VD: gv@school.edu.vn"
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input id="phone" {...register("phone")} placeholder="VD: 0901234567" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Ngày sinh</Label>
              <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Giới tính</Label>
              <Select value={watch("gender")} onValueChange={(v) => setValue("gender", v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Nam</SelectItem>
                  <SelectItem value="female">Nữ</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Khoa *</Label>
              <Select value={watch("department")} onValueChange={(v) => setValue("department", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn khoa" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Chức vụ</Label>
              <Select value={watch("position")} onValueChange={(v) => setValue("position", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn chức vụ" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((pos) => (
                    <SelectItem key={pos} value={pos}>
                      {pos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Chuyên ngành</Label>
              <Input id="specialization" {...register("specialization")} placeholder="VD: Trí tuệ nhân tạo" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hireDate">Ngày vào làm</Label>
              <Input id="hireDate" type="date" {...register("hireDate")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select value={watch("status")} onValueChange={(v) => setValue("status", v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Đang làm việc</SelectItem>
                  <SelectItem value="inactive">Tạm nghỉ</SelectItem>
                  <SelectItem value="retired">Đã nghỉ hưu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Input id="address" {...register("address")} placeholder="VD: 123 Đường ABC, Quận XYZ, TP.HCM" />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {teacher ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
