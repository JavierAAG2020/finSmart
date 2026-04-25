import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

function Contact() {
  return (
    <Form>
      <Form.Group>
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" />
      </Form.Group>

      <Button>Enviar</Button>
    </Form>
  )
}

export default Contact