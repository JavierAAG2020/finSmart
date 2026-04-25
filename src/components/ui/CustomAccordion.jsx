import { Accordion } from "react-bootstrap"

function CustomAccordion() {
  return (
    <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header>¿Qué es esto?</Accordion.Header>
        <Accordion.Body>
          App de finanzas con IA
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}

export default CustomAccordion