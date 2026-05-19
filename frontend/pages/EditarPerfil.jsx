import { useState, useContext, useRef } from "react"
import { Card, Form, Button, Alert, Spinner } from "react-bootstrap"
import { AuthContext } from "../context/AuthContext"
import DashboardLayout from "../components/dashboard/DashboardLayout"

const MONEDAS = [
  { value: 'COP', label: 'COP — Peso colombiano' },
  { value: 'USD', label: 'USD — Dólar estadounidense' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'MXN', label: 'MXN — Peso mexicano' },
  { value: 'ARS', label: 'ARS — Peso argentino' },
  { value: 'BRL', label: 'BRL — Real brasileño' },
  { value: 'CLP', label: 'CLP — Peso chileno' },
  { value: 'PEN', label: 'PEN — Sol peruano' },
]

function EditarPerfil() {
  const { user, authHeader, updateUser } = useContext(AuthContext)

  const [nombre, setNombre] = useState(user?.nombre || "")
  const [correo, setCorreo] = useState(user?.correo || "")
  const [moneda, setMoneda] = useState(user?.moneda_preferida || "COP")

  const [passwordActual, setPasswordActual] = useState("")
  const [passwordNueva, setPasswordNueva] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")

  const resolverUrl = (ruta) => {
    if (!ruta) return null
    if (ruta.startsWith('blob:') || ruta.startsWith('http')) return ruta
    return `http://localhost:4000${ruta}`
  }
  const [fotoPreview, setFotoPreview] = useState(resolverUrl(user?.foto_perfil))
  const [fotoArchivo, setFotoArchivo] = useState(null)
  const inputFotoRef = useRef()

  const [cargando, setCargando] = useState(false)
  const [cargandoFoto, setCargandoFoto] = useState(false)
  const [exito, setExito] = useState("")
  const [error, setError] = useState("")

  const limpiarMensajes = () => { setExito(""); setError("") }

  // ── Foto ────────────────────────────────────────────────────────────────
  const handleFotoChange = (e) => {
    const archivo = e.target.files[0]
    if (!archivo) return
    if (archivo.size > 2 * 1024 * 1024) return setError("La imagen no puede superar 2MB")
    setFotoArchivo(archivo)
    setFotoPreview(URL.createObjectURL(archivo))
  }

const subirFoto = async () => {
  if (!fotoArchivo) return setError("Selecciona una imagen primero")
  limpiarMensajes()
  setCargandoFoto(true)
  try {
    const formData = new FormData()
    formData.append('foto', fotoArchivo)

    const res = await fetch('/api/perfil/foto', {
      method: 'POST',
      headers: { ...authHeader() },
      body: formData
    })
    const data = await res.json()
    if (!res.ok) return setError(data.error || "Error al subir foto")

    updateUser({ ...user, foto_perfil: data.foto_perfil })  // ← aquí
    setFotoPreview(resolverUrl(data.foto_perfil))            // ← y aquí
    setFotoArchivo(null)
    setExito("Foto de perfil actualizada")
  } catch {
    setError("Error de conexión")
  } finally {
    setCargandoFoto(false)
  }
}

  // ── Datos personales ─────────────────────────────────────────────────────
  const guardarDatos = async () => {
    limpiarMensajes()
    if (!nombre || !correo) return setError("Nombre y correo son obligatorios")

    setCargando(true)
    try {
      const res = await fetch('/api/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ nombre, correo, moneda_preferida: moneda })
      })
      const data = await res.json()
      if (!res.ok) return setError(data.error || "Error al guardar")

      updateUser({ ...user, nombre, correo, moneda_preferida: moneda })
      setExito("Datos actualizados correctamente")
    } catch {
      setError("Error de conexión")
    } finally {
      setCargando(false)
    }
  }

  // ── Contraseña ───────────────────────────────────────────────────────────
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

      {/* FOTO DE PERFIL */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h5 className="mb-3">Foto de perfil</h5>
          <div className="d-flex align-items-center gap-4">
            <div
              style={{
                width: 90, height: 90, borderRadius: '50%',
                overflow: 'hidden', border: '2px solid #dee2e6',
                backgroundColor: '#f8f9fa', flexShrink: 0
              }}
            >
              {fotoPreview ? (
                <img src={fotoPreview} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div className="d-flex align-items-center justify-content-center h-100 text-muted" style={{ fontSize: 36 }}>
                  👤
                </div>
              )}
            </div>

            <div>
              <input
                ref={inputFotoRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                style={{ display: 'none' }}
                onChange={handleFotoChange}
              />
              <Button
                variant="outline-secondary"
                size="sm"
                className="me-2"
                onClick={() => inputFotoRef.current.click()}
              >
                Seleccionar imagen
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={subirFoto}
                disabled={!fotoArchivo || cargandoFoto}
              >
                {cargandoFoto ? <Spinner size="sm" animation="border" /> : "Subir foto"}
              </Button>
              <div className="text-muted mt-1" style={{ fontSize: 12 }}>
                JPG, PNG o WEBP · máximo 2MB
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* DATOS PERSONALES */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h5 className="mb-3">Datos personales</h5>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre de usuario</Form.Label>
              <Form.Control type="text" value={nombre} onChange={e => setNombre(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control type="email" value={correo} onChange={e => setCorreo(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Moneda preferida</Form.Label>
              <Form.Select value={moneda} onChange={e => setMoneda(e.target.value)}>
                {MONEDAS.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </Form.Select>
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
              <Form.Control type="password" value={passwordActual} onChange={e => setPasswordActual(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nueva contraseña</Form.Label>
              <Form.Control type="password" value={passwordNueva} onChange={e => setPasswordNueva(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirmar nueva contraseña</Form.Label>
              <Form.Control type="password" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} />
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