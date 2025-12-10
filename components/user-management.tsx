"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { getAllUsers, updateUserRole } from "@/lib/firestore-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Users } from "lucide-react"
import type { UserRole } from "@/lib/types"

interface UserData {
  uid: string
  email: string
  displayName: string
  role: UserRole
}

const roleLabels: Record<UserRole, string> = {
  admin: "Quản trị viên",
  teacher: "Giáo viên",
  user: "Người dùng",
}

const roleColors: Record<UserRole, "default" | "secondary" | "outline"> = {
  admin: "default",
  teacher: "secondary",
  user: "outline",
}

interface UserManagementProps {
  showToast: (message: string, type: "success" | "error") => void
}

export function UserManagement({ showToast }: UserManagementProps) {
  const { idToken, user: currentUser } = useAuth()
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const loadUsers = async () => {
    if (!idToken) return
    try {
      setLoading(true)
      const data = await getAllUsers(idToken)
      setUsers(data)
    } catch (error) {
      showToast("Không thể tải danh sách người dùng", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (idToken) {
      loadUsers()
    }
  }, [idToken])

  const handleRoleChange = async (uid: string, newRole: UserRole) => {
    if (!idToken) return

    // Không cho phép thay đổi role của chính mình
    if (uid === currentUser?.uid) {
      showToast("Không thể thay đổi quyền của chính mình", "error")
      return
    }

    setUpdatingId(uid)
    try {
      await updateUserRole(idToken, uid, newRole)
      setUsers(users.map((u) => (u.uid === uid ? { ...u, role: newRole } : u)))
      showToast("Cập nhật quyền thành công", "success")
    } catch (error) {
      showToast("Không thể cập nhật quyền", "error")
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Quản lý người dùng
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">Chưa có người dùng nào</div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Quyền hiện tại</TableHead>
                  <TableHead>Thay đổi quyền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.uid}>
                    <TableCell className="font-medium">
                      {user.displayName || "—"}
                      {user.uid === currentUser?.uid && (
                        <span className="ml-2 text-xs text-muted-foreground">(Bạn)</span>
                      )}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={roleColors[user.role]}>{roleLabels[user.role]}</Badge>
                    </TableCell>
                    <TableCell>
                      {user.uid === currentUser?.uid ? (
                        <span className="text-sm text-muted-foreground">—</span>
                      ) : (
                        <Select
                          value={user.role}
                          onValueChange={(v) => handleRoleChange(user.uid, v as UserRole)}
                          disabled={updatingId === user.uid}
                        >
                          <SelectTrigger className="w-36">
                            {updatingId === user.uid ? <Loader2 className="h-4 w-4 animate-spin" /> : <SelectValue />}
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Quản trị viên</SelectItem>
                            <SelectItem value="teacher">Giáo viên</SelectItem>
                            <SelectItem value="user">Người dùng</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
