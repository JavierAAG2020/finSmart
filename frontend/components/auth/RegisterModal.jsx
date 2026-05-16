import { useState } from "react"
import { Modal, Button, Form } from "react-bootstrap"

function RegisterModal({ show, handleClose }) {
  const [nombre, setNombre] = useState("")
  const [correo, setCorreo] = useState("")
  const [pass, setPass] = useState("")
  const [pass2, setPass2] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    if (!nombre || !correo || !pass) return alert('Completa todos los campos')
    if (pass !== pass2) return alert('Las contraseñas no coinciden')

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, pass })
      })

      if (!res.ok) {
        // try parse JSON error, otherwise fall back to plain text
        let message = 'Error registrando usuario'
        const ct = res.headers.get('content-type') || ''
        if (ct.includes('application/json')) {
          const err = await res.json().catch(() => ({}))
          message = err.error || JSON.stringify(err) || message
        } else {
          const txt = await res.text().catch(() => '')
          if (txt) message = txt
        }
        throw new Error(message)
      }

      alert('Registro exitoso. Ahora puedes iniciar sesión.')
      handleClose()
    } catch (e) {
      alert(e.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Registrarse</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control onChange={(e) => setNombre(e.target.value)} value={nombre} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Correo</Form.Label>
            <Form.Control type="email" onChange={(e) => setCorreo(e.target.value)} value={correo} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control type="password" onChange={(e) => setPass(e.target.value)} value={pass} />
          </Form.Group>

          <Form.Group>
            <Form.Label>Confirmar contraseña</Form.Label>
            <Form.Control type="password" onChange={(e) => setPass2(e.target.value)} value={pass2} />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={handleRegister} disabled={loading}>
          {loading ? 'Registrando…' : 'Registrarse'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default RegisterModal
