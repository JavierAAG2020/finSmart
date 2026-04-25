import { useState, useContext, useEffect } from "react"
import { Modal, Button, Form } from "react-bootstrap"
import { AuthContext } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"

function LoginModal({ show, handleClose }) {
  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")

  const { isAuth, login } = useContext(AuthContext)
  const navigate = useNavigate()

  // 🔥 Si ya está autenticado → redirigir automáticamente
  useEffect(() => {
    if (isAuth) {
      handleClose()
      navigate("/dashboard")
    }
  }, [isAuth])

  const handleLogin = () => {
    // 🔥 Validación: ya autenticado
    if (isAuth) {
      navigate("/dashboard")
      return
    }

    if (user === "admin" && pass === "1234") {
      login()              // 🔥 usa contexto
      handleClose()
      navigate("/dashboard") // 🔥 sin recargar
    } else {
      alert("Credenciales incorrectas")
    }
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Usuario</Form.Label>
            <Form.Control
              onChange={(e) => setUser(e.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              onChange={(e) => setPass(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={handleLogin} disabled={isAuth}>
          Ingresar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default LoginModal