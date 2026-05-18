import { useState, useContext } from "react"
import { Card, Form, Button, Alert, Spinner } from "react-bootstrap"
import { AuthContext } from "../context/AuthContext"
import DashboardLayout from "../components/dashboard/DashboardLayout"

function EditarPerfil() {
  const { user, authHeader, updateUser } = useContext(AuthContext)

  const [nombre, setNombre] = useState(user?.nombre || "")
  const [correo, setCorreo] = useState(user?.correo || "")
  const [passwordActual, setPasswordActual] = useState("")
  const [passwordNueva, setPasswordNueva] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")

  const [cargando, setCargando] = useState(false)
  const [exito, setExito] = useState("")
  const [error, setError] = useState("")

  const limpiarMensajes = () => { setExito(""); setError("") }

  const guardarDatos = async () => {
    limpiarMensajes()
    if (!nombre || !correo) return setError("Nombre y correo son obligatorios")

    setCargando(true)
    try {
      const res = await fetch('/api/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ nombre, correo })
      })
      const data = await res.json()
      if (!res.ok) return setError(data.error || "Error al guardar")

      updateUser({ ...user, nombre, correo })
      setExito("Datos actualizados correctamente")
    } catch {
      setError("Error de conexión")
    } finally {
      setCargando(false)
    }
  }

  const cambiarPassword = async () => {
    limpiarMensajes()
    if (!passwordActual || !passwordNueva || !passwordConfirm)
      return setError("Completa todos los campos de contraseña")
    if (passwordNueva !== passwordConfirm)
      return setError("Las contraseñas nuevas no coinciden")
    if (passwordNueva.length < 4)
      return setError("La contraseña debe tener al menos 4 caracteres")

    setCargando(true)
    try {
      const res = await fetch('/api/perfil/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ passwordActual, passwordNueva })
      })
      const data = await res.json()
      if (!res.ok) return setError(data.error || "Error al cambiar contraseña")

      setExito("Contraseña cambiada correctamente")
      setPasswordActual("")
      setPasswordNueva("")
      setPasswordConfirm("")
    } catch {
      setError("Error de conexión")
    } finally {
      setCargando(false)
    }
  }

  return (
    <DashboardLayout>
      <h4 className="mb-4">Editar perfil</h4>

      {exito && <Alert variant="success" onClose={() => setExito("")} dismissible>{exito}</Alert>}
      {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}

      {/* DATOS PERSONALES */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h5 className="mb-3">Datos personales</h5>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre de usuario</Form.Label>
              <Form.Control
                type="text"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                value={correo}
                onChange={e => setCorreo(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={guardarDatos} disabled={cargando}>
              {cargando ? <Spinner size="sm" animation="border" /> : "Guardar cambios"}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* CAMBIAR CONTRASEÑA */}
      <Card className="shadow-sm">
        <Card.Body>
          <h5 className="mb-3">Cambiar contraseña</h5>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña actual</Form.Label>
              <Form.Control
                type="password"
                value={passwordActual}
                onChange={e => setPasswordActual(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nueva contraseña</Form.Label>
              <Form.Control
                type="password"
                value={passwordNueva}
                onChange={e => setPasswordNueva(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirmar nueva contraseña</Form.Label>
              <Form.Control
                type="password"
                value={passwordConfirm}
                onChange={e => setPasswordConfirm(e.target.value)}
              />
            </Form.Group>
            <Button variant="warning" onClick={cambiarPassword} disabled={cargando}>
              {cargando ? <Spinner size="sm" animation="border" /> : "Cambiar contraseña"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </DashboardLayout>
  )
}

export default EditarPerfil