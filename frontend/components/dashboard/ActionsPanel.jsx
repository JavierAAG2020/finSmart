import { useState } from "react"
import { Card, Button, Modal, Form } from "react-bootstrap"

function ActionsPanel({ agregarIngreso, registrarGasto, invertir }) {

  // Estados
  const [showGasto, setShowGasto] = useState(false)

  const [gasto, setGasto] = useState({
    monto: "",
    categoria: "",
    fecha: "",
    descripcion: ""
  })

  const [listaGastos, setListaGastos] = useState([])

  const [showIngreso, setShowIngreso] = useState(false)

  const [ingreso, setIngreso] = useState({
    monto: "",
    fuente: "",
    fecha: "",
    descripcion: ""
  })

  const [listaIngresos, setListaIngresos] = useState([])

  const [showMeta, setShowMeta] = useState(false)

  const [meta, setMeta] = useState({
    nombre: "",
    monto: "",
    fecha: ""
  })

  const [listaMetas, setListaMetas] = useState([])

  //  INVERSIONES
  const [showInvertir, setShowInvertir] = useState(false)

  const [inversion, setInversion] = useState({
    monto: "",
    tipo: ""
  })

  const [listaInversiones, setListaInversiones] = useState([])

  // AI SUGGESTIONS
  const [showAISuggestions, setShowAISuggestions] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState('')
  const [aiError, setAiError] = useState(false)

  // Formatear número
  const formatearNumero = (numero) => {
    if (!numero) return ""
    return new Intl.NumberFormat("es-CO").format(numero)
  }

  // Minimal markdown-like formatter for AI text -> HTML
  const escapeHtml = (unsafe) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
  }

  const formatAIResponse = (responseText) => {
  if (!responseText) return ""

  try {
    // Limpia posibles bloques ```json ... ```
    const cleaned = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()

    const data = JSON.parse(cleaned)

    let html = `<div class="ai-response">`

    // Título
    if (data.titulo) {
      html += `<h3>${escapeHtml(data.titulo)}</h3>`
    }

    // Prioridad o riesgo
    if (data.prioridad || data.riesgo) {
      html += `
        <p>
          <strong>${data.prioridad ? "Prioridad" : "Riesgo"}:</strong>
          ${escapeHtml(data.prioridad || data.riesgo)}
        </p>
      `
    }

    // Mensaje principal
    if (data.mensaje) {
      html += `<p>${escapeHtml(data.mensaje)}</p>`
    }

    // Recomendaciones
    if (
      data.recomendaciones &&
      Array.isArray(data.recomendaciones)
    ) {
      html += `<h4>Recomendaciones</h4>`
      html += `<ul>`

      data.recomendaciones.forEach((rec) => {
        html += `<li>${escapeHtml(rec)}</li>`
      })

      html += `</ul>`
    }

    // Ahorro sugerido
    if (data.ahorroSugerido) {
      html += `
        <p>
          <strong>Ahorro sugerido:</strong>
          ${escapeHtml(String(data.ahorroSugerido))}
        </p>
      `
    }

    html += `</div>`

    return html

  } catch (error) {
    console.error("Error parseando JSON IA:", error)

    // Fallback: mostrar texto normal
    return `<p>${escapeHtml(responseText)}</p>`
  }
}

  // Alias kept for backward compatibility in modal usage
  const formatAIText = (text) => formatAIResponse(text)

  // INGRESO
  const handleChangeIngreso = (e) => {
    let { name, value } = e.target

    if (name === "monto") {
      value = value.replace(/\D/g, "")
    }

    setIngreso({
      ...ingreso,
      [name]: value
    })
  }

  const guardarIngreso = () => {
    if (!ingreso.monto) {
      alert("El monto es obligatorio")
      return
    }

    agregarIngreso(ingreso.monto) 

    setListaIngresos([...listaIngresos, ingreso])
    setShowIngreso(false)

    setIngreso({
      monto: "",
      fuente: "",
      fecha: "",
      descripcion: ""
    })
  }

  // GASTO
  const handleChangeGasto = (e) => {
    let { name, value } = e.target

    if (name === "monto") {
      value = value.replace(/\D/g, "")
    }

    setGasto({
      ...gasto,
      [name]: value
    })
  }

  const guardarGasto = () => {
    if (!gasto.monto) {
      alert("El monto es obligatorio")
      return
    }

    registrarGasto(gasto.monto) 

    setListaGastos([...listaGastos, gasto])
    setShowGasto(false)

    setGasto({
      monto: "",
      categoria: "",
      fecha: "",
      descripcion: ""
    })
  }

  // META
  const handleChangeMeta = (e) => {
    let { name, value } = e.target

    if (name === "monto") {
      value = value.replace(/\D/g, "")
    }

    setMeta({
      ...meta,
      [name]: value
    })
  }

  const guardarMeta = () => {
  if (!meta.nombre || !meta.monto) {
    alert("Completa los campos obligatorios")
    return
  }

  const nuevaMeta = {
    ...meta,
    monto: Number(meta.monto)
  }

  setListaMetas(prev => [...prev, nuevaMeta]) 

  setShowMeta(false)

  setMeta({
    nombre: "",
    monto: "",
    fecha: ""
  })
}

  //  INVERSION
  const handleChangeInversion = (e) => {
    let { name, value } = e.target

    if (name === "monto") {
      value = value.replace(/\D/g, "")
    }

    setInversion({
      ...inversion,
      [name]: value
    })
  }

  const guardarInversion = () => {
    if (!inversion.monto) {
      alert("El monto es obligatorio")
      return
    }

    invertir(inversion.monto)

    setListaInversiones([...listaInversiones, inversion])
    setShowInvertir(false)

    setInversion({
      monto: "",
      tipo: ""
    })
  }

  return (
    <>
      <Card className="shadow-sm">
        <Card.Body>
          <h5>Acciones rápidas</h5>

          <div className="d-flex flex-wrap gap-3 mt-3">
            <Button variant="primary" onClick={() => setShowIngreso(true)}>
              Agregar ingreso
            </Button>

            <Button variant="warning" onClick={() => setShowGasto(true)}>
              Registrar gasto
            </Button>

            <Button variant="success" onClick={() => setShowMeta(true)}>
              Crear meta
            </Button>

            <Button variant="info" onClick={() => setShowInvertir(true)}>
              Invertir
            </Button>
            <Button variant="secondary" onClick={async () => {
              setShowAISuggestions(true)
              setAiError(false)
              // lazy load suggestions when opening
              if (!aiSuggestions) {
                setAiLoading(true)
                try {
                  const resp = await fetch('/api/ai/suggestions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ listaGastos, listaIngresos, listaMetas, listaInversiones })
                  })
                  const data = await resp.json()
                  if (resp.ok) {
                    // prefer structured suggestions object when available
                    setAiSuggestions(data.suggestions || data)
                    setAiError(false)
                  } else {
                    setAiSuggestions(data.error || JSON.stringify(data))
                    setAiError(true)
                  }
                } catch (err) {
                  setAiSuggestions('Error al solicitar sugerencias: ' + err.message)
                  setAiError(true)
                } finally {
                  setAiLoading(false)
                }
              }
            }}>
              Sugerencias IA
            </Button>
          </div>

          {/* INGRESOS */}
          <h6 className="mt-3">Ingresos registrados:</h6>
          {listaIngresos.map((ing, index) => (
            <div key={index} className="border rounded p-2 mb-2">
              <strong>Monto:</strong> ${formatearNumero(ing.monto)} <br />
              <strong>Fuente:</strong> {ing.fuente} <br />
              <strong>Fecha:</strong> {ing.fecha} <br />
              <strong>Descripción:</strong> {ing.descripcion}
            </div>
          ))}

          {/* GASTOS */}
          <h6 className="mt-3">Gastos registrados:</h6>
          {listaGastos.map((g, index) => (
            <div key={index} className="border rounded p-2 mb-2 bg-light">
              <strong>Monto:</strong> ${formatearNumero(g.monto)} <br />
              <strong>Categoría:</strong> {g.categoria} <br />
              <strong>Fecha:</strong> {g.fecha} <br />
              <strong>Descripción:</strong> {g.descripcion}
            </div>
          ))}

          {/* METAS */}
          <h6 className="mt-3">Metas:</h6>
          {listaMetas.map((m, index) => (
            <div key={index} className="border rounded p-2 mb-2 bg-success text-white">
              <strong>Meta:</strong> {m.nombre} <br />
              <strong>Monto:</strong> ${formatearNumero(m.monto)} <br />
              <strong>Fecha Limite:</strong> {m.fecha}
            </div>
          ))}

          {/* INVERSIONES */}
          <h6 className="mt-3">Inversiones:</h6>
          {listaInversiones.map((inv, index) => (
            <div key={index} className="border rounded p-2 mb-2 bg-info text-white">
              <strong>Monto:</strong> ${formatearNumero(inv.monto)} <br />
              <strong>Tipo:</strong> {inv.tipo}
            </div>
          ))}
        </Card.Body>
      </Card>


      {/* MODAL INGRESO */}
      <Modal show={showIngreso} onHide={() => setShowIngreso(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Ingreso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Monto</Form.Label>
              <Form.Control
                type="text"
                name="monto"
                value={formatearNumero(ingreso.monto)}
                onChange={handleChangeIngreso}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Fuente</Form.Label>
              <Form.Control
                type="text"
                name="fuente"
                value={ingreso.fuente}
                onChange={handleChangeIngreso}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                name="fecha"
                value={ingreso.fecha}
                onChange={handleChangeIngreso}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                name="descripcion"
                value={ingreso.descripcion}
                onChange={handleChangeIngreso}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowIngreso(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarIngreso}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL GASTO */}
      <Modal show={showGasto} onHide={() => setShowGasto(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Registrar Gasto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Monto</Form.Label>
              <Form.Control
                type="text"
                name="monto"
                value={formatearNumero(gasto.monto)}
                onChange={handleChangeGasto}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                type="text"
                name="categoria"
                value={gasto.categoria}
                onChange={handleChangeGasto}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                name="fecha"
                value={gasto.fecha}
                onChange={handleChangeGasto}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                name="descripcion"
                value={gasto.descripcion}
                onChange={handleChangeGasto}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowGasto(false)}>
            Cancelar
          </Button>
          <Button variant="warning" onClick={guardarGasto}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

          {/* MODAL META */}
<Modal show={showMeta} onHide={() => setShowMeta(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Crear Meta</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group className="mb-2">
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          type="text"
          name="nombre"
          value={meta.nombre}
          onChange={handleChangeMeta}
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Monto</Form.Label>
        <Form.Control
          type="text"
          name="monto"
          value={formatearNumero(meta.monto)}
          onChange={handleChangeMeta}
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Fecha</Form.Label>
        <Form.Control
          type="date"
          name="fecha"
          value={meta.fecha}
          onChange={handleChangeMeta}
        />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowMeta(false)}>
      Cancelar
    </Button>
    <Button variant="success" onClick={guardarMeta}>
      Guardar
    </Button>
  </Modal.Footer>
</Modal>

      {/* MODAL INVERSION */}
      <Modal show={showInvertir} onHide={() => setShowInvertir(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Invertir dinero</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Monto</Form.Label>
              <Form.Control
                type="text"
                name="monto"
                value={formatearNumero(inversion.monto)}
                onChange={handleChangeInversion}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Tipo de inversión</Form.Label>
              <Form.Control
                type="text"
                name="tipo"
                value={inversion.tipo}
                onChange={handleChangeInversion}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInvertir(false)}>
            Cancelar
          </Button>
          <Button variant="info" onClick={guardarInversion}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
      {/* MODAL SUGERENCIAS IA */}
      <Modal show={showAISuggestions} onHide={() => setShowAISuggestions(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Sugerencias de la IA</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {aiLoading ? (
            <div>Cargando sugerencias...</div>
          ) : (
            (() => {
              if (!aiSuggestions) return <div>No hay sugerencias todavía.</div>

              // If backend returned a plain string, render as formatted HTML
              if (typeof aiSuggestions === 'string') {
                return <div dangerouslySetInnerHTML={{ __html: formatAIText(aiSuggestions) }} />
              }

              // Expecting structured object: { resumen, recomendaciones: [ { titulo, accion: [], prioridad, impacto } ] }
              const s = aiSuggestions
              return (
                <div>
                  {s.resumen && <p><strong>Resumen:</strong> {s.resumen}</p>}
                  {<div>

  {s.titulo && (
    <h4 className="mb-3">
      <strong>{s.titulo}</strong>
    </h4>
  )}

  {s.resumen && (
    <p>
      <strong>Resumen:</strong> {s.resumen}
    </p>
  )}

  {s.mensaje && (
    <p>{s.mensaje}</p>
  )}

  {s.prioridad && (
    <p>
      <strong>Prioridad:</strong> {s.prioridad}
    </p>
  )}

  {s.impacto && (
    <p>
      <strong>Impacto:</strong> {s.impacto}
    </p>
  )}

  {Array.isArray(s.recomendaciones) &&
    s.recomendaciones.length > 0 && (
      <div className="mt-3">

        <h5>Recomendaciones</h5>

        <ul>
          {s.recomendaciones.map((rec, idx) => {

            // Si es string simple
            if (typeof rec === 'string') {
              return <li key={idx}>{rec}</li>
            }

            // Si es objeto complejo
            return (
              <li key={idx} className="mb-2">

                {rec.titulo && (
                  <strong>{rec.titulo}</strong>
                )}

                {Array.isArray(rec.accion) && (
                  <ul>
                    {rec.accion.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                )}

                {rec.prioridad && (
                  <div>
                    <strong>Prioridad:</strong> {rec.prioridad}
                  </div>
                )}

              </li>
            )
          })}
        </ul>

      </div>
  )}

</div>}
                </div>
              )
            })()
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAISuggestions(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ActionsPanel