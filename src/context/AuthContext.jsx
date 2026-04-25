import { createContext, useState, useEffect } from "react"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("auth") === "true"
    setIsAuth(stored)
  }, [])

  const login = () => {
    localStorage.setItem("auth", "true")
    setIsAuth(true)
  }

  const logout = () => {
    localStorage.removeItem("auth")
    setIsAuth(false)
  }

  return (
    <AuthContext.Provider value={{ isAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}