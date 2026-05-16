import { createContext, useState, useEffect } from "react"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (storedToken) setToken(storedToken)
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)) } catch(e) { setUser(null) }
    }
  }, [])

  const login = (newToken, newUser) => {
    if (newToken) {
      localStorage.setItem('token', newToken)
      setToken(newToken)
    }
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser))
      setUser(newUser)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  const isAuth = !!token

  const authHeader = () => ({ Authorization: `Bearer ${token}` })

  return (
    <AuthContext.Provider value={{ isAuth, token, user, login, logout, authHeader }}>
      {children}
    </AuthContext.Provider>
  )
}