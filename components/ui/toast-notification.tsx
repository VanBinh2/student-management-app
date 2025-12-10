"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { CheckCircle2, XCircle, AlertCircle, X, Info } from "lucide-react"

export type ToastType = "success" | "error" | "warning" | "info"

interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
}

interface ToastContextValue {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

let toastListeners: ((toasts: Toast[]) => void)[] = []
let toasts: Toast[] = []

export const toast = {
  success: (title: string, description?: string) => addToast({ type: "success", title, description }),
  error: (title: string, description?: string) => addToast({ type: "error", title, description }),
  warning: (title: string, description?: string) => addToast({ type: "warning", title, description }),
  info: (title: string, description?: string) => addToast({ type: "info", title, description }),
}

function addToast(toast: Omit<Toast, "id">) {
  const id = Math.random().toString(36).substring(7)
  toasts = [...toasts, { ...toast, id }]
  toastListeners.forEach((listener) => listener(toasts))

  setTimeout(() => {
    removeToast(id)
  }, 5000)
}

function removeToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id)
  toastListeners.forEach((listener) => listener(toasts))
}

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
}

const colors = {
  success: "bg-success/10 text-success border-success/20",
  error: "bg-destructive/10 text-destructive border-destructive/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  info: "bg-primary/10 text-primary border-primary/20",
}

export function ToastContainer() {
  const [localToasts, setLocalToasts] = useState<Toast[]>([])

  useEffect(() => {
    const listener = (newToasts: Toast[]) => setLocalToasts([...newToasts])
    toastListeners.push(listener)
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener)
    }
  }, [])

  if (localToasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {localToasts.map((t) => {
        const Icon = icons[t.type]
        return (
          <div
            key={t.id}
            className={cn(
              "flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm shadow-lg",
              "animate-in slide-in-from-right-5 fade-in duration-300",
              colors[t.type],
            )}
          >
            <Icon className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{t.title}</p>
              {t.description && <p className="text-xs opacity-80 mt-1">{t.description}</p>}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
