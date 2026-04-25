import { Container, Row, Col } from "react-bootstrap"

function ThreeColumns() {
  return (
    <Container>
      <Row>
        <Col xs={12} md={6} lg={4}>Columna 1</Col>
        <Col xs={12} md={6} lg={4}>Columna 2</Col>
        <Col xs={12} md={12} lg={4}>Columna 3</Col>
      </Row>
    </Container>
  )
}

export default ThreeColumns