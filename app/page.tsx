"use client"

import { AuthProvider, useAuth } from "@/lib/auth-context"
import { AuthForm } from "@/components/auth-form"
import { Dashboard } from "@/components/dashboard"
import { Loader2 } from "lucide-react"

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  return <Dashboard />
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
