import type { Student } from "./types"

export function exportToCSV(students: Student[], filename = "students") {
  const headers = [
    "Mã SV",
    "Họ tên",
    "Email",
    "Điện thoại",
    "Ngày sinh",
    "Giới tính",
    "Địa chỉ",
    "Lớp",
    "Ngành",
    "GPA",
    "Trạng thái",
    "Ngày nhập học",
  ]

  const genderMap: Record<string, string> = {
    male: "Nam",
    female: "Nữ",
    other: "Khác",
  }

  const statusMap: Record<string, string> = {
    active: "Đang học",
    inactive: "Nghỉ học",
    graduated: "Đã tốt nghiệp",
    suspended: "Bị đình chỉ",
  }

  const rows = students.map((student) => [
    student.studentId,
    student.fullName,
    student.email,
    student.phone,
    student.dateOfBirth,
    genderMap[student.gender] || student.gender,
    student.address,
    student.class,
    student.major,
    student.gpa.toString(),
    statusMap[student.status] || student.status,
    student.enrollmentDate,
  ])

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")),
  ].join("\n")

  const BOM = "\uFEFF"
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
