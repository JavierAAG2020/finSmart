import { Button } from "react-bootstrap"

function Topbar() {
  return (
    <div className="bg-light p-3 shadow-sm d-flex justify-content-between align-items-center">
      <h5 className="m-0">Dashboard Financiero</h5>

      <div>
        <Button variant="primary" className="me-2">
          Nueva meta
        </Button>

        <Button variant="success">
          Invertir
        </Button>
      </div>
    </div>
  )
}

export default Topbar