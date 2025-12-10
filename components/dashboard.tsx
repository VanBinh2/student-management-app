"use client"

import { useState, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  getTeachers,
  addTeacher,
  updateTeacher,
  deleteTeacher,
  calculateStats,
} from "@/lib/firestore-service"
import { exportToCSV } from "@/lib/export-utils"
import { Sidebar } from "./layout/sidebar"
import { Header } from "./layout/header"
import { DashboardStatsCards } from "./dashboard-stats"
import { StudentTable } from "./student-table"
import { StudentForm } from "./student-form"
import { StudentDetail } from "./student-detail"
import { StudentFiltersComponent } from "./student-filters"
import { TeacherTable } from "./teacher-table"
import { TeacherForm } from "./teacher-form"
import { TeacherDetail } from "./teacher-detail"
import { UserManagement } from "./user-management"
import { DashboardSkeleton, TableSkeleton } from "./ui/loading-skeleton"
import { ToastContainer, toast } from "./ui/toast-notification"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Download, RefreshCw } from "lucide-react"
import type { Student, StudentFilters, DashboardStats, Teacher, TeacherFilters } from "@/lib/types"

export function Dashboard() {
  const { user, idToken, signOut, isAdmin, isTeacher, canManageStudents, canManageTeachers } = useAuth()

  // Students state
  const [students, setStudents] = useState<Student[]>([])
  const [studentFormOpen, setStudentFormOpen] = useState(false)
  const [studentDetailOpen, setStudentDetailOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [viewStudent, setViewStudent] = useState<Student | null>(null)
  const [studentFilters, setStudentFilters] = useState<StudentFilters>({
    search: "",
    status: "",
    major: "",
    class: "",
  })

  // Teachers state
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [teacherFormOpen, setTeacherFormOpen] = useState(false)
  const [teacherDetailOpen, setTeacherDetailOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [viewTeacher, setViewTeacher] = useState<Teacher | null>(null)
  const [teacherFilters, setTeacherFilters] = useState<TeacherFilters>({
    search: "",
    status: "",
    department: "",
  })

  // Common state
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeStudents: 0,
    graduatedStudents: 0,
    averageGPA: 0,
    studentsByMajor: [],
    studentsByStatus: [],
    totalTeachers: 0,
    activeTeachers: 0,
  })
  const [loading, setLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark")
    setDarkMode(isDark)
  }, [])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    document.documentElement.classList.toggle("dark", newMode)
  }

  const loadData = async () => {
    if (!idToken) return
    try {
      setLoading(true)
      const [studentsData, teachersData] = await Promise.all([
        getStudents(idToken),
        isAdmin ? getTeachers(idToken) : Promise.resolve([]),
      ])
      setStudents(studentsData)
      setTeachers(teachersData)
      const statsData = calculateStats(studentsData, teachersData)
      setStats(statsData)
    } catch (error) {
      toast.error("Không thể tải dữ liệu", "Vui lòng thử lại sau")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (idToken) {
      loadData()
    }
  }, [idToken])

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const searchLower = studentFilters.search.toLowerCase()
      const matchesSearch =
        !studentFilters.search ||
        student.fullName.toLowerCase().includes(searchLower) ||
        student.studentId.toLowerCase().includes(searchLower) ||
        student.email.toLowerCase().includes(searchLower)

      const matchesStatus = !studentFilters.status || student.status === studentFilters.status
      const matchesMajor = !studentFilters.major || student.major === studentFilters.major
      const matchesClass = !studentFilters.class || student.class === studentFilters.class

      return matchesSearch && matchesStatus && matchesMajor && matchesClass
    })
  }, [students, studentFilters])

  // Filtered teachers
  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      const searchLower = teacherFilters.search.toLowerCase()
      const matchesSearch =
        !teacherFilters.search ||
        teacher.fullName.toLowerCase().includes(searchLower) ||
        teacher.teacherId.toLowerCase().includes(searchLower) ||
        teacher.email.toLowerCase().includes(searchLower)

      const matchesStatus = !teacherFilters.status || teacher.status === teacherFilters.status
      const matchesDepartment = !teacherFilters.department || teacher.department === teacherFilters.department

      return matchesSearch && matchesStatus && matchesDepartment
    })
  }, [teachers, teacherFilters])

  const uniqueMajors = useMemo(() => [...new Set(students.map((s) => s.major))].filter(Boolean), [students])
  const uniqueClasses = useMemo(() => [...new Set(students.map((s) => s.class))].filter(Boolean), [students])
  const uniqueDepartments = useMemo(() => [...new Set(teachers.map((t) => t.department))].filter(Boolean), [teachers])

  // Student handlers
  const handleAddStudent = () => {
    setSelectedStudent(null)
    setStudentFormOpen(true)
  }

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student)
    setStudentFormOpen(true)
  }

  const handleViewStudent = (student: Student) => {
    setViewStudent(student)
    setStudentDetailOpen(true)
  }

  const handleSubmitStudent = async (data: Omit<Student, "id" | "createdAt" | "updatedAt">) => {
    if (!idToken) return
    setFormLoading(true)
    try {
      if (selectedStudent) {
        await updateStudent(idToken, selectedStudent.id, data)
        toast.success("Cập nhật thành công", "Thông tin sinh viên đã được cập nhật")
      } else {
        await addStudent(idToken, data)
        toast.success("Thêm thành công", "Sinh viên mới đã được thêm vào hệ thống")
      }
      await loadData()
    } catch (error) {
      toast.error("Có lỗi xảy ra", "Vui lòng thử lại sau")
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteStudent = async (id: string) => {
    if (!idToken) return
    try {
      await deleteStudent(idToken, id)
      toast.success("Xóa thành công", "Sinh viên đã được xóa khỏi hệ thống")
      await loadData()
    } catch (error) {
      toast.error("Không thể xóa sinh viên")
    }
  }

  // Teacher handlers
  const handleAddTeacher = () => {
    setSelectedTeacher(null)
    setTeacherFormOpen(true)
  }

  const handleEditTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher)
    setTeacherFormOpen(true)
  }

  const handleViewTeacher = (teacher: Teacher) => {
    setViewTeacher(teacher)
    setTeacherDetailOpen(true)
  }

  const handleSubmitTeacher = async (data: Omit<Teacher, "id" | "createdAt" | "updatedAt">) => {
    if (!idToken) return
    setFormLoading(true)
    try {
      if (selectedTeacher) {
        await updateTeacher(idToken, selectedTeacher.id, data)
        toast.success("Cập nhật thành công", "Thông tin giáo viên đã được cập nhật")
      } else {
        await addTeacher(idToken, data)
        toast.success("Thêm thành công", "Giáo viên mới đã được thêm vào hệ thống")
      }
      await loadData()
    } catch (error) {
      toast.error("Có lỗi xảy ra", "Vui lòng thử lại sau")
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteTeacher = async (id: string) => {
    if (!idToken) return
    try {
      await deleteTeacher(idToken, id)
      toast.success("Xóa thành công", "Giáo viên đã được xóa khỏi hệ thống")
      await loadData()
    } catch (error) {
      toast.error("Không thể xóa giáo viên")
    }
  }

  const handleExportStudents = () => {
    exportToCSV(filteredStudents, "danh_sach_sinh_vien")
    toast.success("Xuất file thành công", "File CSV đã được tải xuống")
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success("Đăng xuất thành công")
    } catch (error) {
      toast.error("Không thể đăng xuất")
    }
  }

  // Get page title and breadcrumbs based on active tab
  const getPageInfo = () => {
    switch (activeTab) {
      case "dashboard":
        return { title: "Dashboard", breadcrumbs: [{ label: "Trang chủ" }, { label: "Dashboard" }] }
      case "students":
        return { title: "Quản lý sinh viên", breadcrumbs: [{ label: "Trang chủ" }, { label: "Sinh viên" }] }
      case "teachers":
        return { title: "Quản lý giáo viên", breadcrumbs: [{ label: "Trang chủ" }, { label: "Giáo viên" }] }
      case "users":
        return { title: "Phân quyền người dùng", breadcrumbs: [{ label: "Trang chủ" }, { label: "Phân quyền" }] }
      default:
        return { title: "Dashboard", breadcrumbs: [] }
    }
  }

  const { title, breadcrumbs } = getPageInfo()

  const showToast = (message: string, type: "success" | "error" = "success") => {
    if (type === "success") {
      toast.success(message)
    } else {
      toast.error(message)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        currentTab={activeTab}
        onTabChange={setActiveTab}
        userRole={user?.role || "user"}
        userName={user?.displayName || "User"}
        userEmail={user?.email || ""}
        onLogout={handleSignOut}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Content */}
      <main className={cn("transition-all duration-300 ml-[68px] lg:ml-[240px]")}>
        <Header
          title={title}
          breadcrumbs={breadcrumbs}
          actions={
            <div className="flex items-center gap-2">
              {activeTab === "students" && canManageStudents && (
                <>
                  <Button variant="outline" size="sm" onClick={handleExportStudents}>
                    <Download className="h-4 w-4 mr-2" />
                    Xuất CSV
                  </Button>
                  <Button size="sm" onClick={handleAddStudent}>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm sinh viên
                  </Button>
                </>
              )}
              {activeTab === "teachers" && canManageTeachers && (
                <Button size="sm" onClick={handleAddTeacher}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm giáo viên
                </Button>
              )}
            </div>
          }
        />

        <div className="p-6">
          {loading ? (
            <DashboardSkeleton />
          ) : (
            <>
              {/* Dashboard Tab */}
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  <DashboardStatsCards stats={stats} showTeachers={isAdmin} />

                  {/* Recent Students */}
                  <div className="rounded-xl border border-border/50 bg-card">
                    <div className="flex items-center justify-between p-4 border-b border-border/50">
                      <div>
                        <h2 className="font-semibold text-foreground">Sinh viên gần đây</h2>
                        <p className="text-sm text-muted-foreground">Danh sách 10 sinh viên mới nhất</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setActiveTab("students")}>
                        Xem tất cả
                      </Button>
                    </div>
                    <div className="p-4">
                      <StudentTable
                        students={students.slice(0, 10)}
                        onEdit={canManageStudents ? handleEditStudent : undefined}
                        onDelete={canManageStudents ? handleDeleteStudent : undefined}
                        onView={handleViewStudent}
                        canEdit={canManageStudents}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Students Tab */}
              {activeTab === "students" && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-border/50 bg-card">
                    <div className="p-4 border-b border-border/50">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h2 className="font-semibold text-foreground">Danh sách sinh viên</h2>
                          <p className="text-sm text-muted-foreground">
                            Hiển thị {filteredStudents.length} / {students.length} sinh viên
                          </p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={loadData} disabled={loading}>
                          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                        </Button>
                      </div>
                      <StudentFiltersComponent
                        filters={studentFilters}
                        onFiltersChange={setStudentFilters}
                        majors={uniqueMajors}
                        classes={uniqueClasses}
                      />
                    </div>
                    <div className="p-4">
                      {loading ? (
                        <TableSkeleton rows={10} />
                      ) : (
                        <StudentTable
                          students={filteredStudents}
                          onEdit={canManageStudents ? handleEditStudent : undefined}
                          onDelete={canManageStudents ? handleDeleteStudent : undefined}
                          onView={handleViewStudent}
                          canEdit={canManageStudents}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Teachers Tab */}
              {activeTab === "teachers" && isAdmin && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-border/50 bg-card">
                    <div className="p-4 border-b border-border/50">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h2 className="font-semibold text-foreground">Danh sách giáo viên</h2>
                          <p className="text-sm text-muted-foreground">
                            Hiển thị {filteredTeachers.length} / {teachers.length} giáo viên
                          </p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={loadData} disabled={loading}>
                          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                        </Button>
                      </div>
                      {/* Teacher Filters */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Input
                          placeholder="Tìm kiếm theo tên, mã GV, email..."
                          value={teacherFilters.search}
                          onChange={(e) => setTeacherFilters({ ...teacherFilters, search: e.target.value })}
                          className="flex-1 h-9 bg-muted/50 border-border/50"
                        />
                        <Select
                          value={teacherFilters.status}
                          onValueChange={(v) => setTeacherFilters({ ...teacherFilters, status: v === "all" ? "" : v })}
                        >
                          <SelectTrigger className="w-full sm:w-40 h-9 bg-muted/50 border-border/50">
                            <SelectValue placeholder="Trạng thái" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tất cả</SelectItem>
                            <SelectItem value="active">Đang làm việc</SelectItem>
                            <SelectItem value="inactive">Tạm nghỉ</SelectItem>
                            <SelectItem value="retired">Đã nghỉ hưu</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={teacherFilters.department}
                          onValueChange={(v) =>
                            setTeacherFilters({ ...teacherFilters, department: v === "all" ? "" : v })
                          }
                        >
                          <SelectTrigger className="w-full sm:w-40 h-9 bg-muted/50 border-border/50">
                            <SelectValue placeholder="Khoa" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tất cả</SelectItem>
                            {uniqueDepartments.map((dept) => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="p-4">
                      {loading ? (
                        <TableSkeleton rows={10} />
                      ) : (
                        <TeacherTable
                          teachers={filteredTeachers}
                          onEdit={handleEditTeacher}
                          onDelete={handleDeleteTeacher}
                          onView={handleViewTeacher}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === "users" && isAdmin && <UserManagement showToast={showToast} />}
            </>
          )}
        </div>
      </main>

      {/* Student Modals */}
      <StudentForm
        open={studentFormOpen}
        onOpenChange={setStudentFormOpen}
        student={selectedStudent}
        onSubmit={handleSubmitStudent}
        loading={formLoading}
      />
      <StudentDetail student={viewStudent} open={studentDetailOpen} onOpenChange={setStudentDetailOpen} />

      {/* Teacher Modals */}
      <TeacherForm
        open={teacherFormOpen}
        onOpenChange={setTeacherFormOpen}
        teacher={selectedTeacher}
        onSubmit={handleSubmitTeacher}
        loading={formLoading}
      />
      <TeacherDetail teacher={viewTeacher} open={teacherDetailOpen} onOpenChange={setTeacherDetailOpen} />

      {/* Toast Container */}
      <ToastContainer />
    </div>
  )
}
