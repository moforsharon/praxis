import { useState, useEffect, useCallback } from 'react'

type ToastType = {
  title: string
  description?: string
  variant?: 'default' | 'destructive'
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastType[]>([])

  const toast = useCallback(({ title, description, variant = 'default' }: ToastType) => {
    setToasts((prevToasts) => [...prevToasts, { title, description, variant }])
  }, [])

  const dismissToast = useCallback((index: number) => {
    setToasts((prevToasts) => prevToasts.filter((_, i) => i !== index))
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (toasts.length > 0) {
        dismissToast(0)
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [toasts, dismissToast])

  return { toast, toasts, dismissToast }
}

