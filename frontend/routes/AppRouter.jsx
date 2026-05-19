import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import Dashboard from "../pages/Dashboard"
import Contact from "../pages/Contact"
import EditarPerfil from "../pages/EditarPerfil"
import ProtectedRoute from "../components/auth/ProtectedRoute"
import ServidorContenidos from "../pages/ServidorContenidos"

// Configuración principal de rutas de la aplicación
function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Ruta principal */}
        <Route path="/" element={<Home />} />

        {/* Ruta de contacto */}
        <Route path="/contact" element={<Contact />} />

        {/* Ruta del servidor de contenidos turísticos */}
        <Route
          path="/servidor-contenidos"
          element={<ServidorContenidos />}
        />

        {/* Ruta de edición de perfil */}
        <Route
          path="/perfil"
          element={<EditarPerfil />}
        />

        {/* Ruta protegida accesible solo para usuarios autenticados */}
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