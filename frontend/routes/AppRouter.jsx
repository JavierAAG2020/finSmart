import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import Dashboard from "../pages/Dashboard"
import Contact from "../pages/Contact"
import EditarPerfil from "../pages/EditarPerfil"
import ProtectedRoute from "../components/auth/ProtectedRoute"

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/perfil" element={<EditarPerfil />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter