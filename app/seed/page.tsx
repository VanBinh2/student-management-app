"use client"

import { useState, useEffect } from "react"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { addStudent, addTeacher, getStudents, getTeachers } from "@/lib/firestore-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Database,
  Users,
  GraduationCap,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  UserPlus,
} from "lucide-react"
import Link from "next/link"

// Dữ liệu mẫu Việt Nam
const VIETNAMESE_FIRST_NAMES = [
  "Minh",
  "Hùng",
  "Dũng",
  "Tuấn",
  "Hải",
  "Nam",
  "Long",
  "Phong",
  "Khang",
  "Đức",
  "Thảo",
  "Linh",
  "Hương",
  "Mai",
  "Lan",
  "Ngọc",
  "Trang",
  "Hà",
  "Yến",
  "Chi",
  "Bảo",
  "Quân",
  "Thắng",
  "Việt",
  "Hoàng",
  "Khánh",
  "Trung",
  "Tùng",
  "Sơn",
  "Quang",
]

const VIETNAMESE_MIDDLE_NAMES = [
  "Văn",
  "Thị",
  "Hoàng",
  "Minh",
  "Quốc",
  "Đình",
  "Xuân",
  "Thu",
  "Hồng",
  "Thanh",
  "Ngọc",
  "Kim",
  "Bảo",
  "Gia",
  "Trọng",
  "Như",
  "Phương",
  "Thùy",
  "Anh",
  "Hữu",
]

const VIETNAMESE_LAST_NAMES = [
  "Nguyễn",
  "Trần",
  "Lê",
  "Phạm",
  "Hoàng",
  "Huỳnh",
  "Phan",
  "Vũ",
  "Võ",
  "Đặng",
  "Bùi",
  "Đỗ",
  "Hồ",
  "Ngô",
  "Dương",
  "Lý",
  "Đinh",
  "Cao",
  "Tạ",
  "Lưu",
]

const MAJORS = [
  "Công nghệ thông tin",
  "Quản trị kinh doanh",
  "Kế toán",
  "Marketing",
  "Ngôn ngữ Anh",
  "Luật",
  "Y khoa",
  "Kiến trúc",
]

const DEPARTMENTS = [
  "Khoa Công nghệ thông tin",
  "Khoa Kinh tế",
  "Khoa Ngoại ngữ",
  "Khoa Luật",
  "Khoa Y",
  "Khoa Kiến trúc",
]

const POSITIONS = ["Giảng viên", "Giảng viên chính", "Phó Giáo sư", "Giáo sư", "Trưởng khoa", "Phó trưởng khoa"]

const SPECIALIZATIONS = [
  "Trí tuệ nhân tạo",
  "An ninh mạng",
  "Phát triển phần mềm",
  "Tài chính doanh nghiệp",
  "Marketing số",
  "Luật thương mại",
  "Nội khoa",
  "Thiết kế đô thị",
]

const CLASSES = ["CNTT01", "CNTT02", "QTKD01", "QTKD02", "KT01", "MKT01", "NNA01", "LUAT01", "YK01", "KT02"]

const ADDRESSES = [
  "Quận 1, TP. Hồ Chí Minh",
  "Quận 3, TP. Hồ Chí Minh",
  "Quận 7, TP. Hồ Chí Minh",
  "Quận Bình Thạnh, TP. Hồ Chí Minh",
  "Quận Thủ Đức, TP. Hồ Chí Minh",
  "Quận Tân Bình, TP. Hồ Chí Minh",
  "Quận Hoàn Kiếm, Hà Nội",
  "Quận Đống Đa, Hà Nội",
  "Quận Cầu Giấy, Hà Nội",
  "Quận Hải Châu, Đà Nẵng",
]

// Helper functions
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomDate(startYear: number, endYear: number): string {
  const year = randomNumber(startYear, endYear)
  const month = String(randomNumber(1, 12)).padStart(2, "0")
  const day = String(randomNumber(1, 28)).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function generateVietnameseName(): { fullName: string; gender: "male" | "female" } {
  const gender = Math.random() > 0.5 ? "male" : "female"
  const lastName = randomItem(VIETNAMESE_LAST_NAMES)
  const middleName = gender === "female" ? "Thị" : randomItem(VIETNAMESE_MIDDLE_NAMES)
  const firstName = randomItem(VIETNAMESE_FIRST_NAMES)
  return {
    fullName: `${lastName} ${middleName} ${firstName}`,
    gender,
  }
}

function generatePhone(): string {
  const prefixes = [
    "090",
    "091",
    "093",
    "094",
    "096",
    "097",
    "098",
    "032",
    "033",
    "034",
    "035",
    "036",
    "037",
    "038",
    "039",
  ]
  return `${randomItem(prefixes)}${randomNumber(1000000, 9999999)}`
}

function generateStudentId(index: number): string {
  const year = randomNumber(20, 24)
  return `SV${year}${String(index + 1).padStart(4, "0")}`
}

function generateTeacherId(index: number): string {
  return `GV${String(index + 1).padStart(4, "0")}`
}

function generateEmail(name: string, isTeacher: boolean): string {
  const normalized = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .split(" ")
    .reverse()
    .join("")
  const randomNum = randomNumber(1, 999)
  const domain = isTeacher ? "university.edu.vn" : "student.edu.vn"
  return `${normalized}${randomNum}@${domain}`
}

function generateGPA(): number {
  // Phân phối GPA thực tế hơn
  const rand = Math.random()
  if (rand < 0.1) return Number((Math.random() * 1.5 + 0.5).toFixed(2)) // 10% yếu
  if (rand < 0.3) return Number((Math.random() * 0.5 + 2.0).toFixed(2)) // 20% trung bình
  if (rand < 0.7) return Number((Math.random() * 0.7 + 2.5).toFixed(2)) // 40% khá
  if (rand < 0.9) return Number((Math.random() * 0.4 + 3.2).toFixed(2)) // 20% giỏi
  return Number((Math.random() * 0.4 + 3.6).toFixed(2)) // 10% xuất sắc
}

function getStatusFromGPA(gpa: number): "active" | "suspended" {
  return gpa >= 2.0 ? "active" : "suspended"
}

function SeedContent() {
  const { user, idToken } = useAuth()
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [currentTask, setCurrentTask] = useState("")
  const [stats, setStats] = useState({ teachers: 0, students: 0 })

  const fetchCurrentStats = async () => {
    if (!idToken) return
    try {
      const [students, teachers] = await Promise.all([getStudents(idToken), getTeachers(idToken)])
      setStats({ teachers: teachers.length, students: students.length })
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  useEffect(() => {
    if (idToken) {
      fetchCurrentStats()
    }
  }, [idToken])

  const generateStudents = async (count: number): Promise<void> => {
    if (!idToken) return
    for (let i = 0; i < count; i++) {
      const { fullName, gender } = generateVietnameseName()
      const major = randomItem(MAJORS)
      const gpa = generateGPA()
      const student = {
        studentId: generateStudentId(stats.students + i),
        fullName,
        email: generateEmail(fullName, false),
        phone: generatePhone(),
        dateOfBirth: randomDate(1998, 2005),
        gender,
        address: randomItem(ADDRESSES),
        class: randomItem(CLASSES),
        major,
        gpa,
        status: getStatusFromGPA(gpa),
        enrollmentDate: randomDate(2020, 2024),
      }
      await addStudent(idToken, student)
      setProgress(((i + 1) / count) * 50 + 50)
      setCurrentTask(`Đang tạo sinh viên ${i + 1}/${count}: ${fullName}`)
    }
  }

  const generateTeachers = async (count: number): Promise<void> => {
    if (!idToken) return
    for (let i = 0; i < count; i++) {
      const { fullName, gender } = generateVietnameseName()
      const department = randomItem(DEPARTMENTS)
      const teacher = {
        teacherId: generateTeacherId(stats.teachers + i),
        fullName,
        email: generateEmail(fullName, true),
        phone: generatePhone(),
        dateOfBirth: randomDate(1965, 1990),
        gender,
        address: randomItem(ADDRESSES),
        department,
        position: randomItem(POSITIONS),
        specialization: randomItem(SPECIALIZATIONS),
        status: "active" as const,
        hireDate: randomDate(2010, 2023),
      }
      await addTeacher(idToken, teacher)
      setProgress(((i + 1) / count) * 50)
      setCurrentTask(`Đang tạo giáo viên ${i + 1}/${count}: ${fullName}`)
    }
  }

  const handleSeedData = async () => {
    if (!idToken) {
      setStatus("error")
      setMessage("Bạn cần đăng nhập để thực hiện chức năng này")
      return
    }
    setLoading(true)
    setStatus("loading")
    setProgress(0)
    setMessage("")

    try {
      setCurrentTask("Đang khởi tạo giáo viên...")
      await generateTeachers(10)
      setCurrentTask("Đang khởi tạo sinh viên...")
      await generateStudents(30)

      const [students, teachers] = await Promise.all([getStudents(idToken), getTeachers(idToken)])
      setStats({ teachers: teachers.length, students: students.length })

      setStatus("success")
      setMessage("Khởi tạo dữ liệu thành công!")
      setCurrentTask("")
    } catch (error) {
      console.error("Seed error:", error)
      setStatus("error")
      setMessage("Có lỗi xảy ra khi khởi tạo dữ liệu")
      setCurrentTask("")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle>Yêu cầu đăng nhập</CardTitle>
            <CardDescription>Bạn cần đăng nhập để sử dụng chức năng này</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại đăng nhập
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <span className="font-semibold">Seed Data</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Khởi tạo dữ liệu mẫu</h1>
          <p className="text-muted-foreground">Tự động tạo 10 giáo viên và 30 sinh viên với thông tin ngẫu nhiên</p>
        </div>

        {/* Current Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Giáo viên hiện tại</p>
                  <p className="text-2xl font-bold">{stats.teachers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10">
                  <GraduationCap className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sinh viên hiện tại</p>
                  <p className="text-2xl font-bold">{stats.students}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Tạo dữ liệu mới
            </CardTitle>
            <CardDescription>Mỗi lần chạy sẽ thêm 10 giáo viên và 30 sinh viên vào cơ sở dữ liệu</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50 border">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  10 Giáo viên sẽ được tạo
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Mã giáo viên: GV0001 - GV0010</li>
                  <li>• Họ tên tiếng Việt ngẫu nhiên</li>
                  <li>• Email @university.edu.vn</li>
                  <li>• Khoa, chức vụ, chuyên môn</li>
                  <li>• Số điện thoại, địa chỉ VN</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-emerald-500" />
                  30 Sinh viên sẽ được tạo
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Mã SV: SV20-24xxxx</li>
                  <li>• Họ tên tiếng Việt ngẫu nhiên</li>
                  <li>• Email @student.edu.vn</li>
                  <li>• Ngành, lớp, GPA (0.5 - 4.0)</li>
                  <li>• Trạng thái tự động theo GPA</li>
                </ul>
              </div>
            </div>

            {/* Progress */}
            {status === "loading" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{currentTask}</span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Status Messages */}
            {status === "success" && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                <div>
                  <p className="font-medium text-emerald-500">{message}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tổng cộng: {stats.teachers} giáo viên, {stats.students} sinh viên
                  </p>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                <p className="font-medium text-destructive">{message}</p>
              </div>
            )}

            {/* Action Button */}
            <Button onClick={handleSeedData} disabled={loading} className="w-full h-12 text-base" size="lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Đang khởi tạo...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-5 w-5" />
                  Bắt đầu khởi tạo dữ liệu
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Dữ liệu được tạo ngẫu nhiên với tên tiếng Việt, phù hợp cho mục đích demo và testing.</p>
          <p className="mt-1">GPA dưới 2.0 sẽ tự động chuyển trạng thái thành "Đình chỉ".</p>
        </div>
      </main>
    </div>
  )
}

export default function SeedPage() {
  return (
    <AuthProvider>
      <SeedContent />
    </AuthProvider>
  )
}
