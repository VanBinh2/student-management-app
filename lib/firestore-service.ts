import { firebaseConfig, FIRESTORE_URL } from "./firebase-config"
import type { Student, Teacher, DashboardStats, UserRole } from "./types"

// ============ USER ROLE MANAGEMENT ============

export async function getUserRole(idToken: string, uid: string): Promise<UserRole | null> {
  try {
    const response = await fetch(`${FIRESTORE_URL}/users/${uid}?key=${firebaseConfig.apiKey}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return (data.fields?.role?.stringValue as UserRole) || null
  } catch {
    return null
  }
}

export async function setUserRole(
  idToken: string,
  uid: string,
  role: UserRole,
  email: string,
  displayName: string,
): Promise<void> {
  try {
    await fetch(`${FIRESTORE_URL}/users/${uid}?key=${firebaseConfig.apiKey}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        fields: {
          role: { stringValue: role },
          email: { stringValue: email },
          displayName: { stringValue: displayName },
          updatedAt: { timestampValue: new Date().toISOString() },
        },
      }),
    })
  } catch (error) {
    console.error("Error setting user role:", error)
  }
}

export async function getAllUsers(
  idToken: string,
): Promise<Array<{ uid: string; email: string; displayName: string; role: UserRole }>> {
  try {
    const response = await fetch(`${FIRESTORE_URL}/users?key=${firebaseConfig.apiKey}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    })

    const data = await response.json()

    if (!response.ok || !data.documents) {
      return []
    }

    return data.documents.map((doc: any) => {
      const pathParts = doc.name.split("/")
      const uid = pathParts[pathParts.length - 1]
      const fields = doc.fields || {}
      return {
        uid,
        email: fields.email?.stringValue || "",
        displayName: fields.displayName?.stringValue || "",
        role: (fields.role?.stringValue as UserRole) || "user",
      }
    })
  } catch {
    return []
  }
}

export async function updateUserRole(idToken: string, uid: string, role: UserRole): Promise<void> {
  const response = await fetch(
    `${FIRESTORE_URL}/users/${uid}?key=${firebaseConfig.apiKey}&updateMask.fieldPaths=role&updateMask.fieldPaths=updatedAt`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        fields: {
          role: { stringValue: role },
          updatedAt: { timestampValue: new Date().toISOString() },
        },
      }),
    },
  )

  if (!response.ok) {
    throw new Error("Không thể cập nhật quyền người dùng")
  }
}

// ============ STUDENT MANAGEMENT ============

// Convert Firestore document to Student object
function documentToStudent(doc: any, id: string): Student {
  const fields = doc.fields || {}
  return {
    id,
    studentId: fields.studentId?.stringValue || "",
    fullName: fields.fullName?.stringValue || "",
    email: fields.email?.stringValue || "",
    phone: fields.phone?.stringValue || "",
    dateOfBirth: fields.dateOfBirth?.stringValue || "",
    gender: fields.gender?.stringValue || "male",
    address: fields.address?.stringValue || "",
    major: fields.major?.stringValue || "",
    class: fields.class?.stringValue || "",
    enrollmentDate: fields.enrollmentDate?.stringValue || "",
    status: fields.status?.stringValue || "active",
    gpa: Number.parseFloat(fields.gpa?.doubleValue || fields.gpa?.integerValue || "0"),
    createdAt: fields.createdAt?.timestampValue || new Date().toISOString(),
    updatedAt: fields.updatedAt?.timestampValue || new Date().toISOString(),
  }
}

// Convert Student object to Firestore fields
function studentToFields(student: Omit<Student, "id" | "createdAt" | "updatedAt">): any {
  return {
    studentId: { stringValue: student.studentId },
    fullName: { stringValue: student.fullName },
    email: { stringValue: student.email },
    phone: { stringValue: student.phone },
    dateOfBirth: { stringValue: student.dateOfBirth },
    gender: { stringValue: student.gender },
    address: { stringValue: student.address },
    major: { stringValue: student.major },
    class: { stringValue: student.class },
    enrollmentDate: { stringValue: student.enrollmentDate },
    status: { stringValue: student.status },
    gpa: { doubleValue: student.gpa },
    createdAt: { timestampValue: new Date().toISOString() },
    updatedAt: { timestampValue: new Date().toISOString() },
  }
}

// Get all students
export async function getStudents(idToken: string): Promise<Student[]> {
  try {
    const response = await fetch(`${FIRESTORE_URL}/students?key=${firebaseConfig.apiKey}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    })

    const data = await response.json()

    if (!response.ok || !data.documents) {
      return []
    }

    return data.documents.map((doc: any) => {
      const pathParts = doc.name.split("/")
      const id = pathParts[pathParts.length - 1]
      return documentToStudent(doc, id)
    })
  } catch (error) {
    console.error("Error fetching students:", error)
    return []
  }
}

// Add a new student
export async function addStudent(
  idToken: string,
  student: Omit<Student, "id" | "createdAt" | "updatedAt">,
): Promise<Student> {
  const response = await fetch(`${FIRESTORE_URL}/students?key=${firebaseConfig.apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      fields: studentToFields(student),
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error("Không thể thêm sinh viên")
  }

  const pathParts = data.name.split("/")
  const id = pathParts[pathParts.length - 1]
  return documentToStudent(data, id)
}

// Update a student
export async function updateStudent(
  idToken: string,
  id: string,
  student: Omit<Student, "id" | "createdAt" | "updatedAt">,
): Promise<void> {
  const fields = studentToFields(student)
  fields.updatedAt = { timestampValue: new Date().toISOString() }

  const response = await fetch(`${FIRESTORE_URL}/students/${id}?key=${firebaseConfig.apiKey}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ fields }),
  })

  if (!response.ok) {
    throw new Error("Không thể cập nhật sinh viên")
  }
}

// Delete a student
export async function deleteStudent(idToken: string, id: string): Promise<void> {
  const response = await fetch(`${FIRESTORE_URL}/students/${id}?key=${firebaseConfig.apiKey}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  })

  if (!response.ok) {
    throw new Error("Không thể xóa sinh viên")
  }
}

// ============ TEACHER MANAGEMENT ============

function documentToTeacher(doc: any, id: string): Teacher {
  const fields = doc.fields || {}
  return {
    id,
    teacherId: fields.teacherId?.stringValue || "",
    fullName: fields.fullName?.stringValue || "",
    email: fields.email?.stringValue || "",
    phone: fields.phone?.stringValue || "",
    dateOfBirth: fields.dateOfBirth?.stringValue || "",
    gender: fields.gender?.stringValue || "male",
    address: fields.address?.stringValue || "",
    department: fields.department?.stringValue || "",
    position: fields.position?.stringValue || "",
    specialization: fields.specialization?.stringValue || "",
    status: fields.status?.stringValue || "active",
    hireDate: fields.hireDate?.stringValue || "",
    createdAt: fields.createdAt?.timestampValue || new Date().toISOString(),
    updatedAt: fields.updatedAt?.timestampValue || new Date().toISOString(),
  }
}

function teacherToFields(teacher: Omit<Teacher, "id" | "createdAt" | "updatedAt">): any {
  return {
    teacherId: { stringValue: teacher.teacherId },
    fullName: { stringValue: teacher.fullName },
    email: { stringValue: teacher.email },
    phone: { stringValue: teacher.phone },
    dateOfBirth: { stringValue: teacher.dateOfBirth },
    gender: { stringValue: teacher.gender },
    address: { stringValue: teacher.address },
    department: { stringValue: teacher.department },
    position: { stringValue: teacher.position },
    specialization: { stringValue: teacher.specialization },
    status: { stringValue: teacher.status },
    hireDate: { stringValue: teacher.hireDate },
    createdAt: { timestampValue: new Date().toISOString() },
    updatedAt: { timestampValue: new Date().toISOString() },
  }
}

export async function getTeachers(idToken: string): Promise<Teacher[]> {
  try {
    const response = await fetch(`${FIRESTORE_URL}/teachers?key=${firebaseConfig.apiKey}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    })

    const data = await response.json()

    if (!response.ok || !data.documents) {
      return []
    }

    return data.documents.map((doc: any) => {
      const pathParts = doc.name.split("/")
      const id = pathParts[pathParts.length - 1]
      return documentToTeacher(doc, id)
    })
  } catch (error) {
    console.error("Error fetching teachers:", error)
    return []
  }
}

export async function addTeacher(
  idToken: string,
  teacher: Omit<Teacher, "id" | "createdAt" | "updatedAt">,
): Promise<Teacher> {
  const response = await fetch(`${FIRESTORE_URL}/teachers?key=${firebaseConfig.apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      fields: teacherToFields(teacher),
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error("Không thể thêm giáo viên")
  }

  const pathParts = data.name.split("/")
  const id = pathParts[pathParts.length - 1]
  return documentToTeacher(data, id)
}

export async function updateTeacher(
  idToken: string,
  id: string,
  teacher: Omit<Teacher, "id" | "createdAt" | "updatedAt">,
): Promise<void> {
  const fields = teacherToFields(teacher)
  fields.updatedAt = { timestampValue: new Date().toISOString() }

  const response = await fetch(`${FIRESTORE_URL}/teachers/${id}?key=${firebaseConfig.apiKey}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ fields }),
  })

  if (!response.ok) {
    throw new Error("Không thể cập nhật giáo viên")
  }
}

export async function deleteTeacher(idToken: string, id: string): Promise<void> {
  const response = await fetch(`${FIRESTORE_URL}/teachers/${id}?key=${firebaseConfig.apiKey}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  })

  if (!response.ok) {
    throw new Error("Không thể xóa giáo viên")
  }
}

// ============ STATISTICS ============

// Calculate statistics
export function calculateStats(students: Student[], teachers?: Teacher[]): DashboardStats {
  const totalStudents = students.length
  const activeStudents = students.filter((s) => s.status === "active").length
  const graduatedStudents = students.filter((s) => s.status === "graduated").length

  const totalGPA = students.reduce((sum, s) => sum + (s.gpa || 0), 0)
  const averageGPA = totalStudents > 0 ? Math.round((totalGPA / totalStudents) * 100) / 100 : 0

  const majorCounts = students.reduce(
    (acc, s) => {
      if (s.major) {
        acc[s.major] = (acc[s.major] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  const studentsByMajor = Object.entries(majorCounts).map(([major, count]) => ({
    major,
    count,
  }))

  const statusCounts = students.reduce(
    (acc, s) => {
      acc[s.status] = (acc[s.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const studentsByStatus = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
  }))

  const totalTeachers = teachers?.length || 0
  const activeTeachers = teachers?.filter((t) => t.status === "active").length || 0

  return {
    totalStudents,
    activeStudents,
    graduatedStudents,
    averageGPA,
    studentsByMajor,
    studentsByStatus,
    totalTeachers,
    activeTeachers,
  }
}
