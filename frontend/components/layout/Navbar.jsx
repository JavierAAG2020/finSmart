import { Navbar, Nav, Container, Button } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useState } from "react"
import LoginModal from "../auth/LoginModal"

function CustomNavbar() {
  const [show, setShow] = useState(false)

  return (
    <>
      <Navbar bg="dark" variant="dark" fixed="top">
        <Container>
          <Navbar.Brand>FinSmart</Navbar.Brand>

          <Nav>
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contacto</Nav.Link>
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/files">Archivos</Nav.Link>
          </Nav>

          <Button onClick={() => setShow(true)}>Login</Button>
        </Container>
      </Navbar>

      <LoginModal show={show} handleClose={() => setShow(false)} />
    </>
  )
}

export default CustomNavbar