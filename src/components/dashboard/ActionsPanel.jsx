import { Card, Button } from "react-bootstrap"

function ActionsPanel() {
  return (
    <Card className="shadow-sm">
      <Card.Body>
        <h5>Acciones rápidas</h5>

        <div className="d-flex flex-wrap gap-3 mt-3">
          <Button variant="primary">Agregar ingreso</Button>
          <Button variant="warning">Registrar gasto</Button>
          <Button variant="success">Crear meta</Button>
        </div>
      </Card.Body>
    </Card>
  )
}

export default ActionsPanel