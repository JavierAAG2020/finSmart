import { useState, useContext, useEffect } from "react"
import { Modal, Button, Form } from "react-bootstrap"
import { AuthContext } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"

function LoginModal({ show, handleClose }) {
  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")

  const { isAuth, login } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuth) {
      handleClose()
      setTimeout(() => {
        navigate("/dashboard")
      }, 300) // coincide con duración del fade
    }
  }, [isAuth])

  const handleLogin = () => {
    if (isAuth) {
      navigate("/dashboard")
      return
    }

    // intenta login en backend
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, pass })
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err.error || 'Credenciales incorrectas')
        }
        return res.json()
      })
      .then((json) => {
        const token = json.token
        const userObj = json.user || null
        login(token, userObj)
        handleClose()
        navigate('/dashboard')
      })
      .catch((e) => {
        alert(e.message || 'Error de autenticación')
      })
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