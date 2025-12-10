export type UserRole = "admin" | "teacher" | "user"

export interface Student {
  id: string
  studentId: string
  fullName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: "male" | "female" | "other"
  address: string
  class: string
  major: string
  gpa: number
  status: "active" | "inactive" | "graduated" | "suspended"
  enrollmentDate: string
  createdAt: string
  updatedAt: string
}

export interface Teacher {
  id: string
  teacherId: string
  fullName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: "male" | "female" | "other"
  address: string
  department: string
  position: string
  specialization: string
  status: "active" | "inactive" | "retired"
  hireDate: string
  createdAt: string
  updatedAt: string
}

export interface User {
  uid: string
  email: string | null
  displayName: string | null
  role: UserRole
}

export interface StudentFilters {
  search: string
  status: string
  major: string
  class: string
}

export interface TeacherFilters {
  search: string
  status: string
  department: string
}

export interface DashboardStats {
  totalStudents: number
  activeStudents: number
  graduatedStudents: number
  averageGPA: number
  studentsByMajor: { major: string; count: number }[]
  studentsByStatus: { status: string; count: number }[]
  totalTeachers?: number
  activeTeachers?: number
}
