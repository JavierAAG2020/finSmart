import { useState, useEffect } from "react"
import { Card, Button, Modal, Form, Spinner } from "react-bootstrap"

const getToken = () => localStorage.getItem('token')

const apiFetch = (url, options = {}) => {
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
      ...(options.headers || {})
    }
  })
}

function ActionsPanel({ onDatosActualizados }) {

  const [listaGastos, setListaGastos] = useState([])
  const [listaIngresos, setListaIngresos] = useState([])
  const [listaMetas, setListaMetas] = useState([])
  const [listaInversiones, setListaInversiones] = useState([])
  const [cargando, setCargando] = useState(true)

  const [showGasto, setShowGasto] = useState(false)
  const [showIngreso, setShowIngreso] = useState(false)
  const [showMeta, setShowMeta] = useState(false)
  const [showInvertir, setShowInvertir] = useState(false)

  const [gasto, setGasto] = useState({ monto: "", categoria: "", fecha: "", descripcion: "" })
  const [ingreso, setIngreso] = useState({ monto: "", fuente: "", fecha: "", descripcion: "" })
  const [meta, setMeta] = useState({ nombre: "", monto: "", fecha: "" })
  const [inversion, setInversion] = useState({ monto: "", tipo: "" })

  const [showAISuggestions, setShowAISuggestions] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState('')
  const [aiError, setAiError] = useState(false)

  useEffect(() => {
    cargarTodo()
  }, [])

  const cargarTodo = async () => {
    setCargando(true)
    try {
      const [resRegistros, resMetas, resInversiones] = await Promise.all([
        apiFetch('/api/registros'),
        apiFetch('/api/metas'),
        apiFetch('/api/inversiones')
      ])

      const registros = await resRegistros.json()
      const metas = await resMetas.json()
      const inversiones = await resInversiones.json()

      const ingresos = registros.filter(r => r.tipo_movimiento === 'INGRESO')
      const gastos = registros.filter(r => r.tipo_movimiento === 'GASTO')

      setListaIngresos(ingresos)
      setListaGastos(gastos)
      setListaMetas(metas)
      setListaInversiones(inversiones)

      if (onDatosActualizados) {
        const totalIngresos = ingresos.reduce((s, r) => s + Number(r.monto), 0)
        const totalGastos = gastos.reduce((s, r) => s + Number(r.monto), 0)
        const totalInversiones = inversiones.reduce((s, r) => s + Number(r.monto_invertido), 0)
        onDatosActualizados({ totalIngresos, totalGastos, totalInversiones })
      }
    } catch (err) {
      console.error('Error cargando datos:', err)
    } finally {
      setCargando(false)
    }
  }

  const formatearNumero = (numero) => {
    if (!numero) return ""
    return new Intl.NumberFormat("es-CO").format(numero)
  }

  const handleChange = (setter, state) => (e) => {
    let { name, value } = e.target
    if (name === "monto") value = value.replace(/\D/g, "")
    setter({ ...state, [name]: value })
  }

  const guardarIngreso = async () => {
    if (!ingreso.monto || !ingreso.fecha) return alert("Monto y fecha son obligatorios")
    try {
      const res = await apiFetch('/api/registros', {
        method: 'POST',
        body: JSON.stringify({
          tipo_movimiento: 'INGRESO',
          monto: Number(ingreso.monto),
          categoria: ingreso.fuente || 'General',
          fecha: ingreso.fecha,
          descripcion: ingreso.descripcion
        })
      })
      if (!res.ok) throw new Error()
      setShowIngreso(false)
      setIngreso({ monto: "", fuente: "", fecha: "", descripcion: "" })
      await cargarTodo()
    } catch {
      alert("Error al guardar ingreso")
    }
  }

  const guardarGasto = async () => {
    if (!gasto.monto || !gasto.fecha) return alert("Monto y fecha son obligatorios")
    try {
      const res = await apiFetch('/api/registros', {
        method: 'POST',
        body: JSON.stringify({
          tipo_movimiento: 'GASTO',
          monto: Number(gasto.monto),
          categoria: gasto.categoria || 'General',
          fecha: gasto.fecha,
          descripcion: gasto.descripcion
        })
      })
      if (!res.ok) throw new Error()
      setShowGasto(false)
      setGasto({ monto: "", categoria: "", fecha: "", descripcion: "" })
      await cargarTodo()
    } catch {
      alert("Error al guardar gasto")
    }
  }

  const guardarMeta = async () => {
    if (!meta.nombre || !meta.monto) return alert("Nombre y monto son obligatorios")
    try {
      const res = await apiFetch('/api/metas', {
        method: 'POST',
        body: JSON.stringify({
          nombre: meta.nombre,
          monto_objetivo: Number(meta.monto),
          fecha_objetivo: meta.fecha || null
        })
      })
      if (!res.ok) throw new Error()
      setShowMeta(false)
      setMeta({ nombre: "", monto: "", fecha: "" })
      await cargarTodo()
    } catch {
      alert("Error al guardar meta")
    }
  }

  const guardarInversion = async () => {
    if (!inversion.monto) return alert("El monto es obligatorio")
    const hoy = new Date().toISOString().split('T')[0]
    try {
      const res = await apiFetch('/api/inversiones', {
        method: 'POST',
        body: JSON.stringify({
          monto_invertido: Number(inversion.monto),
          tipo_activo: inversion.tipo || 'OTRO',
          nombre_activo: inversion.tipo || 'Sin nombre',
          fecha_inversion: hoy
        })
      })
      if (!res.ok) throw new Error()
      setShowInvertir(false)
      setInversion({ monto: "", tipo: "" })
      await cargarTodo()
    } catch {
      alert("Error al guardar inversión")
    }
  }

  const abrirSugerenciasIA = async () => {
    setShowAISuggestions(true)
    setAiError(false)
    if (!aiSuggestions) {
      setAiLoading(true)
      try {
        const resp = await apiFetch('/api/ai/suggestions', {
          method: 'POST',
          body: JSON.stringify({ listaGastos, listaIngresos, listaMetas, listaInversiones })
        })
        const data = await resp.json()
        if (resp.ok) {
          setAiSuggestions(data.suggestions || data)
        } else {
          setAiSuggestions(data.error || 'Error desconocido')
          setAiError(true)
        }
      } catch (err) {
        setAiSuggestions('Error al solicitar sugerencias: ' + err.message)
        setAiError(true)
      } finally {
        setAiLoading(false)
      }
    }
  }

  return (
    <>
      <Card className="shadow-sm">
        <Card.Body>
          <h5>Acciones rápidas</h5>

          <div className="d-flex flex-wrap gap-3 mt-3">
            <Button variant="primary" onClick={() => setShowIngreso(true)}>Agregar ingreso</Button>
            <Button variant="warning" onClick={() => setShowGasto(true)}>Registrar gasto</Button>
            <Button variant="success" onClick={() => setShowMeta(true)}>Crear meta</Button>
            <Button variant="info" onClick={() => setShowInvertir(true)}>Invertir</Button>
            <Button variant="secondary" onClick={abrirSugerenciasIA}>Sugerencias IA</Button>
          </div>

          {cargando ? (
            <div className="text-center mt-4">
              <Spinner animation="border" size="sm" /> Cargando datos...
            </div>
          ) : (
            <>
              <h6 className="mt-3">Ingresos registrados:</h6>
              {listaIngresos.length === 0 && <p className="text-muted">Sin ingresos aún.</p>}
              {listaIngresos.map((ing) => (
                <div key={ing.id_registro} className="border rounded p-2 mb-2">
                  <strong>Monto:</strong> ${formatearNumero(ing.monto)} <br />
                  <strong>Categoría:</strong> {ing.nombre_categoria} <br />
                  <strong>Fecha:</strong> {ing.fecha_movimiento?.split('T')[0]} <br />
                  <strong>Descripción:</strong> {ing.descripcion}
                </div>
              ))}

              <h6 className="mt-3">Gastos registrados:</h6>
              {listaGastos.length === 0 && <p className="text-muted">Sin gastos aún.</p>}
              {listaGastos.map((g) => (
                <div key={g.id_registro} className="border rounded p-2 mb-2 bg-light">
                  <strong>Monto:</strong> ${formatearNumero(g.monto)} <br />
                  <strong>Categoría:</strong> {g.nombre_categoria} <br />
                  <strong>Fecha:</strong> {g.fecha_movimiento?.split('T')[0]} <br />
                  <strong>Descripción:</strong> {g.descripcion}
                </div>
              ))}

              <h6 className="mt-3">Metas:</h6>
              {listaMetas.length === 0 && <p className="text-muted">Sin metas aún.</p>}
              {listaMetas.map((m) => (
                <div key={m.id_meta} className="border rounded p-2 mb-2 bg-success text-white">
                  <strong>Meta:</strong> {m.nombre} <br />
                  <strong>Objetivo:</strong> ${formatearNumero(m.monto_objetivo)} <br />
                  <strong>Fecha límite:</strong> {m.fecha_objetivo}
                </div>
              ))}

              <h6 className="mt-3">Inversiones:</h6>
              {listaInversiones.length === 0 && <p className="text-muted">Sin inversiones aún.</p>}
              {listaInversiones.map((inv) => (
                <div key={inv.id_inversion} className="border rounded p-2 mb-2 bg-info text-white">
                  <strong>Activo:</strong> {inv.nombre_activo} <br />
                  <strong>Monto:</strong> ${formatearNumero(inv.monto_invertido)} <br />
                  <strong>Tipo:</strong> {inv.tipo_activo}
                </div>
              ))}
            </>
          )}
        </Card.Body>
      </Card>

      {/* MODAL INGRESO */}
      <Modal show={showIngreso} onHide={() => setShowIngreso(false)}>
        <Modal.Header closeButton><Modal.Title>Agregar Ingreso</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Monto *</Form.Label>
              <Form.Control type="text" name="monto" value={formatearNumero(ingreso.monto)} onChange={handleChange(setIngreso, ingreso)} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Fuente / Categoría</Form.Label>
              <Form.Control type="text" name="fuente" value={ingreso.fuente} onChange={handleChange(setIngreso, ingreso)} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Fecha *</Form.Label>
              <Form.Control type="date" name="fecha" value={ingreso.fecha} onChange={handleChange(setIngreso, ingreso)} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Descripción</Form.Label>
              <Form.Control type="text" name="descripcion" value={ingreso.descripcion} onChange={handleChange(setIngreso, ingreso)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowIngreso(false)}>Cancelar</Button>
          <Button variant="primary" onClick={guardarIngreso}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL GASTO */}
      <Modal show={showGasto} onHide={() => setShowGasto(false)}>
        <Modal.Header closeButton><Modal.Title>Registrar Gasto</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Monto *</Form.Label>
              <Form.Control type="text" name="monto" value={formatearNumero(gasto.monto)} onChange={handleChange(setGasto, gasto)} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Categoría</Form.Label>
              <Form.Control type="text" name="categoria" value={gasto.categoria} onChange={handleChange(setGasto, gasto)} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Fecha *</Form.Label>
              <Form.Control type="date" name="fecha" value={gasto.fecha} onChange={handleChange(setGasto, gasto)} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Descripción</Form.Label>
              <Form.Control type="text" name="descripcion" value={gasto.descripcion} onChange={handleChange(setGasto, gasto)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowGasto(false)}>Cancelar</Button>
          <Button variant="warning" onClick={guardarGasto}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL META */}
      <Modal show={showMeta} onHide={() => setShowMeta(false)}>
        <Modal.Header closeButton><Modal.Title>Crear Meta</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Nombre *</Form.Label>
              <Form.Control type="text" name="nombre" value={meta.nombre} onChange={handleChange(setMeta, meta)} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Monto objetivo *</Form.Label>
              <Form.Control type="text" name="monto" value={formatearNumero(meta.monto)} onChange={handleChange(setMeta, meta)} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Fecha límite</Form.Label>
              <Form.Control type="date" name="fecha" value={meta.fecha} onChange={handleChange(setMeta, meta)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMeta(false)}>Cancelar</Button>
          <Button variant="success" onClick={guardarMeta}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL INVERSIÓN */}
      <Modal show={showInvertir} onHide={() => setShowInvertir(false)}>
        <Modal.Header closeButton><Modal.Title>Invertir dinero</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Monto *</Form.Label>
              <Form.Control type="text" name="monto" value={formatearNumero(inversion.monto)} onChange={handleChange(setInversion, inversion)} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Tipo de inversión</Form.Label>
              <Form.Select name="tipo" value={inversion.tipo} onChange={handleChange(setInversion, inversion)}>
                <option value="">Seleccionar...</option>
                <option value="ACCION">Acción</option>
                <option value="ETF">ETF</option>
                <option value="CRIPTO">Cripto</option>
                <option value="FONDO">Fondo</option>
                <option value="CDT">CDT</option>
                <option value="BONO">Bono</option>
                <option value="OTRO">Otro</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInvertir(false)}>Cancelar</Button>
          <Button variant="info" onClick={guardarInversion}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL SUGERENCIAS IA */}
      <Modal show={showAISuggestions} onHide={() => setShowAISuggestions(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>Sugerencias de la IA</Modal.Title></Modal.Header>
        <Modal.Body>
          {aiLoading ? (
            <div className="text-center"><Spinner animation="border" /> Cargando sugerencias...</div>
          ) : aiError ? (
            <p className="text-danger">{aiSuggestions}</p>
          ) : !aiSuggestions ? (
            <p>No hay sugerencias todavía.</p>
          ) : typeof aiSuggestions === 'string' ? (
            <p>{aiSuggestions}</p>
          ) : (
            <div>
              {aiSuggestions.resumen && <p><strong>Resumen:</strong> {aiSuggestions.resumen}</p>}
              {Array.isArray(aiSuggestions.recomendaciones) && (
                <ul>
                  {aiSuggestions.recomendaciones.map((rec, i) => (
                    <li key={i}>{typeof rec === 'string' ? rec : rec.titulo}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAISuggestions(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ActionsPanel