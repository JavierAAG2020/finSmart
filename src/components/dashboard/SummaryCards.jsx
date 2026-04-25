import { Card, Row, Col } from "react-bootstrap"

function SummaryCards() {
  return (
    <Row className="mb-4">
      <Col md={4}>
        <Card className="shadow-sm">
          <Card.Body>
            <h6>Balance total</h6>
            <h3>$2,500</h3>
          </Card.Body>
        </Card>
      </Col>

      <Col md={4}>
        <Card className="shadow-sm">
          <Card.Body>
            <h6>Ahorros</h6>
            <h3>$1,200</h3>
          </Card.Body>
        </Card>
      </Col>

      <Col md={4}>
        <Card className="shadow-sm">
          <Card.Body>
            <h6>Inversiones</h6>
            <h3>$500</h3>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default SummaryCards