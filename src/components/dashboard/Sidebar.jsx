import { Nav } from "react-bootstrap"
import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"

function Sidebar() {
  const { logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <div
      className="bg-dark text-white p-3"
      style={{ width: "250px", minHeight: "100vh" }}
    >
      <h4>FinSmart</h4>

      <Nav className="flex-column mt-4">
        <Nav.Link as={Link} to="/dashboard" className="text-white">
          Dashboard
        </Nav.Link>

        <Nav.Link as={Link} to="/" className="text-white">
          Inicio
        </Nav.Link>

        <Nav.Link as={Link} to="/contact" className="text-white">
          Contacto
        </Nav.Link>

        <Nav.Link
          className="text-danger mt-3"
          onClick={handleLogout}
        >
          Cerrar sesión
        </Nav.Link>
      </Nav>
    </div>
  )
}

export default Sidebar