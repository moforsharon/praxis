"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

interface LoginModalProps {
  onLogin: () => void
}

export function LoginModal({ onLogin }: LoginModalProps) {
  const [open, setOpen] = useState(true)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        const userData = await response.json()
        localStorage.setItem("user", JSON.stringify(userData))
        onLogin()
        setOpen(false)
      } else {
        setError("Invalid username or password")
      }
    } catch (error) {
      console.error(error)
      setError("An error occurred")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4">
            <Image
              src="/fever_app_logo_removedbg.png"
              alt="Logo"
              width={80}
              height={80}
              className="mx-auto"
            />
          </div>
          <DialogTitle className="text-center text-2xl font-semibold text-[#253771]">
            Sign in to Dashboard
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <Label htmlFor="text">username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="border-[#B6BBE0] focus:border-[#253771]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="border-[#B6BBE0] focus:border-[#253771]"
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          <Button 
            className="w-full bg-[#253771] hover:bg-[#253771]/90 text-white"
            onClick={handleLogin}
          >
            Sign In
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

