"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { signInWithEmail, signUpWithEmail, refreshToken, type AuthUser } from "./auth-service"
import { getUserRole, setUserRole } from "./firestore-service"
import type { User, UserRole } from "./types"

interface AuthContextType {
  user: User | null
  idToken: string | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signOut: () => Promise<void>
  isAdmin: boolean
  isTeacher: boolean
  canManageStudents: boolean
  canManageTeachers: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_STORAGE_KEY = "student_app_auth"

const ADMIN_EMAIL = "admin@gmail.com"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [idToken, setIdToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY)
        if (stored) {
          const authData: AuthUser = JSON.parse(stored)
          // Try to refresh token
          const refreshed = await refreshToken(authData.refreshToken)
          if (refreshed) {
            let role: UserRole = "user"
            if (refreshed.email === ADMIN_EMAIL) {
              role = "admin"
            } else {
              const savedRole = await getUserRole(refreshed.idToken, refreshed.uid)
              if (savedRole) {
                role = savedRole
              }
            }

            setUser({
              uid: refreshed.uid,
              email: refreshed.email,
              displayName: refreshed.displayName,
              role,
            })
            setIdToken(refreshed.idToken)
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(refreshed))
          } else {
            localStorage.removeItem(AUTH_STORAGE_KEY)
          }
        }
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const signIn = async (email: string, password: string) => {
    const authUser = await signInWithEmail(email, password)

    let role: UserRole = "user"
    if (email === ADMIN_EMAIL) {
      role = "admin"
    } else {
      const savedRole = await getUserRole(authUser.idToken, authUser.uid)
      if (savedRole) {
        role = savedRole
      }
    }

    setUser({
      uid: authUser.uid,
      email: authUser.email,
      displayName: authUser.displayName,
      role,
    })
    setIdToken(authUser.idToken)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser))
  }

  const signUp = async (email: string, password: string, displayName: string) => {
    const authUser = await signUpWithEmail(email, password, displayName)

    const role: UserRole = email === ADMIN_EMAIL ? "admin" : "user"

    // Lưu role vào Firestore
    await setUserRole(authUser.idToken, authUser.uid, role, email, displayName)

    setUser({
      uid: authUser.uid,
      email: authUser.email,
      displayName: authUser.displayName,
      role,
    })
    setIdToken(authUser.idToken)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser))
  }

  const signOut = async () => {
    setUser(null)
    setIdToken(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  const isAdmin = user?.role === "admin"
  const isTeacher = user?.role === "teacher"
  const canManageStudents = isAdmin || isTeacher
  const canManageTeachers = isAdmin

  return (
    <AuthContext.Provider
      value={{
        user,
        idToken,
        loading,
        signIn,
        signUp,
        signOut,
        isAdmin,
        isTeacher,
        canManageStudents,
        canManageTeachers,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
