import { createContext, useContext, useState } from 'react'
import { getUser, isAuthenticated, logout } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getUser())
  const [authenticated, setAuthenticated] = useState(() => isAuthenticated())

  function login(userData) {
    setUser(userData)
    setAuthenticated(true)
  }

  function signOut() {
    logout()
    setUser(null)
    setAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ user, authenticated, login, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
