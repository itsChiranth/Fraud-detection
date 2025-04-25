"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

type User = {
  name: string
  email: string
  role: string
  avatar?: string
} | null

type AuthContextType = {
  user: User
  login: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  isLoading: false,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is logged in
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Protect routes
    if (!isLoading) {
      const isLoginPage = pathname === "/"

      if (!user && !isLoginPage && pathname !== "/") {
        router.push("/")
      } else if (user && isLoginPage) {
        router.push("/dashboard")
      }
    }
  }, [user, isLoading, pathname, router])

  const login = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      // In a real app, you would validate credentials with an API
      // For this demo, we'll accept any credentials

      // Generate a random avatar based on initials
      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()

      const userData = {
        name,
        email,
        role: "User", // Default role
        avatar: `/placeholder.svg?height=40&width=40&query=${initials}`,
      }

      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)
      router.push("/dashboard")
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
