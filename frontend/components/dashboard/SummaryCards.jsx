import { Card, Row, Col } from "react-bootstrap"

function SummaryCards({ dineroTotal, gastos, inversiones }) {

  const formatear = (num) => {
    return new Intl.NumberFormat("es-CO").format(num)
  }

  return (
    <Row className="mb-4">
      <Col md={4}>
        <Card className="shadow-sm">
          <Card.Body>
            <h6>Dinero total</h6>
            <h3>${formatear(dineroTotal)}</h3>
          </Card.Body>
        </Card>
      </Col>

      <Col md={4}>
        <Card className="shadow-sm">
          <Card.Body>
            <h6>Gastos</h6>
            <h3>${formatear(gastos)}</h3>
          </Card.Body>
        </Card>
      </Col>

      <Col md={4}>
        <Card className="shadow-sm">
          <Card.Body>
            <h6>Inversiones</h6>
            <h3>${formatear(inversiones)}</h3>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default SummaryCards