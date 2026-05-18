import { useState, useEffect } from "react"
import { Card, Button, Modal, Form, Spinner } from "react-bootstrap"

const getToken = () => localStorage.getItem('token')

const apiFetch = (url, options = {}) => fetch(url, {
  ...options,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`,
    ...(options.headers || {})
  }
})

function ActionsPanel({ onDatosActualizados }) {
  const [listaGastos, setListaGastos] = useState([])
  const [listaIngresos, setListaIngresos] = useState([])
  const [listaMetas, setListaMetas] = useState([])
  const [listaInversiones, setListaInversiones] = useState([])
  const [cargando, setCargando] = useState(true)

  // Modales crear
  const [showGasto, setShowGasto] = useState(false)
  const [showIngreso, setShowIngreso] = useState(false)
  const [showMeta, setShowMeta] = useState(false)
  const [showInvertir, setShowInvertir] = useState(false)

  // Modales editar
  const [showEditIngreso, setShowEditIngreso] = useState(false)
  const [showEditGasto, setShowEditGasto] = useState(false)
  const [showEditMeta, setShowEditMeta] = useState(false)
  const [showEditInversion, setShowEditInversion] = useState(false)

  // Item siendo editado
  const [editItem, setEditItem] = useState(null)

  // Formularios crear
  const [gasto, setGasto] = useState({ monto: "", categoria: "", fecha: "", descripcion: "" })
  const [ingreso, setIngreso] = useState({ monto: "", fuente: "", fecha: "", descripcion: "" })
  const [meta, setMeta] = useState({ nombre: "", monto: "", fecha: "" })
  const [inversion, setInversion] = useState({ monto: "", tipo: "" })

  // AI
  const [showAISuggestions, setShowAISuggestions] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState('')
  const [aiError, setAiError] = useState(false)

  useEffect(() => { cargarTodo() }, [])

  const cargarTodo = async () => {
    setCargando(true)
    try {
      const [resR, resM, resI] = await Promise.all([
        apiFetch('/api/registros'),
        apiFetch('/api/metas'),
        apiFetch('/api/inversiones')
      ])
      const registros = await resR.json()
      const metas = await resM.json()
      const inversiones = await resI.json()

      const ingresos = registros.filter(r => r.tipo_movimiento === 'INGRESO')
      const gastos = registros.filter(r => r.tipo_movimiento === 'GASTO')

      setListaIngresos(ingresos)
      setListaGastos(gastos)
      setListaMetas(metas)
      setListaInversiones(inversiones)

      if (onDatosActualizados) {
        onDatosActualizados({
          totalIngresos: ingresos.reduce((s, r) => s + Number(r.monto), 0),
          totalGastos: gastos.reduce((s, r) => s + Number(r.monto), 0),
          totalInversiones: inversiones.reduce((s, r) => s + Number(r.monto_invertido), 0)
        })
      }
    } catch (err) {
      console.error('Error cargando datos:', err)
    } finally {
      setCargando(false)
    }
  }

  const fmt = (n) => n ? new Intl.NumberFormat("es-CO").format(n) : ""

  const handleChange = (setter, state) => (e) => {
    let { name, value } = e.target
    if (name === "monto") value = value.replace(/\D/g, "")
    setter({ ...state, [name]: value })
  }

  // ── Eliminar ──────────────────────────────────────────────────────────────
  const eliminar = async (endpoint, id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este registro?")) return
    try {
      const res = await apiFetch(`${endpoint}/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      await cargarTodo()
    } catch {
      alert("Error al eliminar")
    }
  }

  // ── Abrir modal editar ────────────────────────────────────────────────────
  const abrirEditIngreso = (item) => {
    setEditItem({
      id: item.id_registro,
      monto: String(item.monto),
      fuente: item.nombre_categoria || "",
      fecha: item.fecha_movimiento?.split('T')[0] || "",
      descripcion: item.descripcion || ""
    })
    setShowEditIngreso(true)
  }

  const abrirEditGasto = (item) => {
    setEditItem({
      id: item.id_registro,
      monto: String(item.monto),
      categoria: item.nombre_categoria || "",
      fecha: item.fecha_movimiento?.split('T')[0] || "",
      descripcion: item.descripcion || ""
    })
    setShowEditGasto(true)
  }

  const abrirEditMeta = (item) => {
    setEditItem({
      id: item.id_meta,
      nombre: item.nombre,
      monto: String(item.monto_objetivo),
      fecha: item.fecha_objetivo || "",
      prioridad: item.prioridad || "MEDIA"
    })
    setShowEditMeta(true)
  }

  const abrirEditInversion = (item) => {
    setEditItem({
      id: item.id_inversion,
      nombre_activo: item.nombre_activo || "",
      monto: String(item.monto_invertido),
      tipo: item.tipo_activo || "OTRO",
      fecha: item.fecha_inversion?.split('T')[0] || ""
    })
    setShowEditInversion(true)
  }

  // ── Guardar edición ───────────────────────────────────────────────────────
  const guardarEditIngreso = async () => {
    if (!editItem.monto || !editItem.fecha) return alert("Monto y fecha son obligatorios")
    try {
      const res = await apiFetch(`/api/registros/${editItem.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          tipo_movimiento: 'INGRESO',
          monto: Number(editItem.monto),
          categoria: editItem.fuente || 'General',
          fecha: editItem.fecha,
          descripcion: editItem.descripcion
        })
      })
      if (!res.ok) throw new Error()
      setShowEditIngreso(false)
      await cargarTodo()
    } catch { alert("Error al actualizar") }
  }

  const guardarEditGasto = async () => {
    if (!editItem.monto || !editItem.fecha) return alert("Monto y fecha son obligatorios")
    try {
      const res = await apiFetch(`/api/registros/${editItem.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          tipo_movimiento: 'GASTO',
          monto: Number(editItem.monto),
          categoria: editItem.categoria || 'General',
          fecha: editItem.fecha,
          descripcion: editItem.descripcion
        })
      })
      if (!res.ok) throw new Error()
      setShowEditGasto(false)
      await cargarTodo()
    } catch { alert("Error al actualizar") }
  }

  const guardarEditMeta = async () => {
    if (!editItem.nombre || !editItem.monto) return alert("Nombre y monto son obligatorios")
    try {
      const res = await apiFetch(`/api/metas/${editItem.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          nombre: editItem.nombre,
          monto_objetivo: Number(editItem.monto),
          fecha_objetivo: editItem.fecha || null,
          prioridad: editItem.prioridad || 'MEDIA'
        })
      })
      if (!res.ok) throw new Error()
      setShowEditMeta(false)
      await cargarTodo()
    } catch { alert("Error al actualizar") }
  }

  const guardarEditInversion = async () => {
    if (!editItem.monto) return alert("El monto es obligatorio")
    const hoy = new Date().toISOString().split('T')[0]
    try {
      const res = await apiFetch(`/api/inversiones/${editItem.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          nombre_activo: editItem.nombre_activo || 'Sin nombre',
          tipo_activo: editItem.tipo || 'OTRO',
          monto_invertido: Number(editItem.monto),
          fecha_inversion: editItem.fecha || hoy
        })
      })
      if (!res.ok) throw new Error()
      setShowEditInversion(false)
      await cargarTodo()
    } catch { alert("Error al actualizar") }
  }

  // ── Guardar crear ─────────────────────────────────────────────────────────
  const guardarIngreso = async () => {
    if (!ingreso.monto || !ingreso.fecha) return alert("Monto y fecha son obligatorios")
    try {
      const res = await apiFetch('/api/registros', {
        method: 'POST',
        body: JSON.stringify({ tipo_movimiento: 'INGRESO', monto: Number(ingreso.monto), categoria: ingreso.fuente || 'General', fecha: ingreso.fecha, descripcion: ingreso.descripcion })
      })
      if (!res.ok) throw new Error()
      setShowIngreso(false)
      setIngreso({ monto: "", fuente: "", fecha: "", descripcion: "" })
      await cargarTodo()
    } catch { alert("Error al guardar ingreso") }
  }

  const guardarGasto = async () => {
    if (!gasto.monto || !gasto.fecha) return alert("Monto y fecha son obligatorios")
    try {
      const res = await apiFetch('/api/registros', {
        method: 'POST',
        body: JSON.stringify({ tipo_movimiento: 'GASTO', monto: Number(gasto.monto), categoria: gasto.categoria || 'General', fecha: gasto.fecha, descripcion: gasto.descripcion })
      })
      if (!res.ok) throw new Error()
      setShowGasto(false)
      setGasto({ monto: "", categoria: "", fecha: "", descripcion: "" })
      await cargarTodo()
    } catch { alert("Error al guardar gasto") }
  }

  const guardarMeta = async () => {
    if (!meta.nombre || !meta.monto) return alert("Nombre y monto son obligatorios")
    try {
      const res = await apiFetch('/api/metas', {
        method: 'POST',
        body: JSON.stringify({ nombre: meta.nombre, monto_objetivo: Number(meta.monto), fecha_objetivo: meta.fecha || null })
      })
      if (!res.ok) throw new Error()
      setShowMeta(false)
      setMeta({ nombre: "", monto: "", fecha: "" })
      await cargarTodo()
    } catch { alert("Error al guardar meta") }
  }

  const guardarInversion = async () => {
    if (!inversion.monto) return alert("El monto es obligatorio")
    const hoy = new Date().toISOString().split('T')[0]
    try {
      const res = await apiFetch('/api/inversiones', {
        method: 'POST',
        body: JSON.stringify({ monto_invertido: Number(inversion.monto), tipo_activo: inversion.tipo || 'OTRO', nombre_activo: inversion.tipo || 'Sin nombre', fecha_inversion: hoy })
      })
      if (!res.ok) throw new Error()
      setShowInvertir(false)
      setInversion({ monto: "", tipo: "" })
      await cargarTodo()
    } catch { alert("Error al guardar inversión") }
  }

  // ── Botones de acción en tarjeta ──────────────────────────────────────────
  const BotonesAccion = ({ onEditar, onEliminar }) => (
    <div className="d-flex gap-1 float-end">
      <Button size="sm" variant="outline-secondary" onClick={onEditar}>✏️</Button>
      <Button size="sm" variant="outline-danger" onClick={onEliminar}>✕</Button>
    </div>
  )

  // ── AI ────────────────────────────────────────────────────────────────────
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
        if (resp.ok) { setAiSuggestions(data.suggestions || data) }
        else { setAiSuggestions(data.error || 'Error desconocido'); setAiError(true) }
      } catch (err) {
        setAiSuggestions('Error: ' + err.message); setAiError(true)
      } finally { setAiLoading(false) }
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
            <div className="text-center mt-4"><Spinner animation="border" size="sm" /> Cargando datos...</div>
          ) : (
            <>
              {/* INGRESOS */}
              <h6 className="mt-3">Ingresos registrados:</h6>
              {listaIngresos.length === 0 && <p className="text-muted">Sin ingresos aún.</p>}
              {listaIngresos.map((ing) => (
                <div key={ing.id_registro} className="border rounded p-2 mb-2">
                  <BotonesAccion
                    onEditar={() => abrirEditIngreso(ing)}
                    onEliminar={() => eliminar('/api/registros', ing.id_registro)}
                  />
                  <strong>Monto:</strong> ${fmt(ing.monto)}<br />
                  <strong>Categoría:</strong> {ing.nombre_categoria}<br />
                  <strong>Fecha:</strong> {ing.fecha_movimiento?.split('T')[0]}<br />
                  <strong>Descripción:</strong> {ing.descripcion}
                </div>
              ))}

              {/* GASTOS */}
              <h6 className="mt-3">Gastos registrados:</h6>
              {listaGastos.length === 0 && <p className="text-muted">Sin gastos aún.</p>}
              {listaGastos.map((g) => (
                <div key={g.id_registro} className="border rounded p-2 mb-2 bg-light">
                  <BotonesAccion
                    onEditar={() => abrirEditGasto(g)}
                    onEliminar={() => eliminar('/api/registros', g.id_registro)}
                  />
                  <strong>Monto:</strong> ${fmt(g.monto)}<br />
                  <strong>Categoría:</strong> {g.nombre_categoria}<br />
                  <strong>Fecha:</strong> {g.fecha_movimiento?.split('T')[0]}<br />
                  <strong>Descripción:</strong> {g.descripcion}
                </div>
              ))}

              {/* METAS */}
              <h6 className="mt-3">Metas:</h6>
              {listaMetas.length === 0 && <p className="text-muted">Sin metas aún.</p>}
              {listaMetas.map((m) => (
                <div key={m.id_meta} className="border rounded p-2 mb-2 bg-success text-white">
                  <BotonesAccion
                    onEditar={() => abrirEditMeta(m)}
                    onEliminar={() => eliminar('/api/metas', m.id_meta)}
                  />
                  <strong>Meta:</strong> {m.nombre}<br />
                  <strong>Objetivo:</strong> ${fmt(m.monto_objetivo)}<br />
                  <strong>Fecha límite:</strong> {m.fecha_objetivo}
                </div>
              ))}

              {/* INVERSIONES */}
              <h6 className="mt-3">Inversiones:</h6>
              {listaInversiones.length === 0 && <p className="text-muted">Sin inversiones aún.</p>}
              {listaInversiones.map((inv) => (
                <div key={inv.id_inversion} className="border rounded p-2 mb-2 bg-info text-white">
                  <BotonesAccion
                    onEditar={() => abrirEditInversion(inv)}
                    onEliminar={() => eliminar('/api/inversiones', inv.id_inversion)}
                  />
                  <strong>Activo:</strong> {inv.nombre_activo}<br />
                  <strong>Monto:</strong> ${fmt(inv.monto_invertido)}<br />
                  <strong>Tipo:</strong> {inv.tipo_activo}
                </div>
              ))}
            </>
          )}
        </Card.Body>
      </Card>

      {/* ── MODALES CREAR ─────────────────────────────────────────────────── */}

      {/* MODAL CREAR INGRESO */}
      <Modal show={showIngreso} onHide={() => setShowIngreso(false)}>
        <Modal.Header closeButton><Modal.Title>Agregar Ingreso</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2"><Form.Label>Monto *</Form.Label>
              <Form.Control type="text" name="monto" value={fmt(ingreso.monto)} onChange={handleChange(setIngreso, ingreso)} /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Fuente / Categoría</Form.Label>
              <Form.Control type="text" name="fuente" value={ingreso.fuente} onChange={handleChange(setIngreso, ingreso)} /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Fecha *</Form.Label>
              <Form.Control type="date" name="fecha" value={ingreso.fecha} onChange={handleChange(setIngreso, ingreso)} /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Descripción</Form.Label>
              <Form.Control type="text" name="descripcion" value={ingreso.descripcion} onChange={handleChange(setIngreso, ingreso)} /></Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowIngreso(false)}>Cancelar</Button>
          <Button variant="primary" onClick={guardarIngreso}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL CREAR GASTO */}
      <Modal show={showGasto} onHide={() => setShowGasto(false)}>
        <Modal.Header closeButton><Modal.Title>Registrar Gasto</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2"><Form.Label>Monto *</Form.Label>
              <Form.Control type="text" name="monto" value={fmt(gasto.monto)} onChange={handleChange(setGasto, gasto)} /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Categoría</Form.Label>
              <Form.Control type="text" name="categoria" value={gasto.categoria} onChange={handleChange(setGasto, gasto)} /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Fecha *</Form.Label>
              <Form.Control type="date" name="fecha" value={gasto.fecha} onChange={handleChange(setGasto, gasto)} /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Descripción</Form.Label>
              <Form.Control type="text" name="descripcion" value={gasto.descripcion} onChange={handleChange(setGasto, gasto)} /></Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowGasto(false)}>Cancelar</Button>
          <Button variant="warning" onClick={guardarGasto}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL CREAR META */}
      <Modal show={showMeta} onHide={() => setShowMeta(false)}>
        <Modal.Header closeButton><Modal.Title>Crear Meta</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2"><Form.Label>Nombre *</Form.Label>
              <Form.Control type="text" name="nombre" value={meta.nombre} onChange={handleChange(setMeta, meta)} /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Monto objetivo *</Form.Label>
              <Form.Control type="text" name="monto" value={fmt(meta.monto)} onChange={handleChange(setMeta, meta)} /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Fecha límite</Form.Label>
              <Form.Control type="date" name="fecha" value={meta.fecha} onChange={handleChange(setMeta, meta)} /></Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMeta(false)}>Cancelar</Button>
          <Button variant="success" onClick={guardarMeta}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL CREAR INVERSIÓN */}
      <Modal show={showInvertir} onHide={() => setShowInvertir(false)}>
        <Modal.Header closeButton><Modal.Title>Invertir dinero</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2"><Form.Label>Monto *</Form.Label>
              <Form.Control type="text" name="monto" value={fmt(inversion.monto)} onChange={handleChange(setInversion, inversion)} /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Tipo de inversión</Form.Label>
              <Form.Select name="tipo" value={inversion.tipo} onChange={handleChange(setInversion, inversion)}>
                <option value="">Seleccionar...</option>
                <option value="ACCION">Acción</option>
                <option value="ETF">ETF</option>
                <option value="CRIPTO">Cripto</option>
                <option value="FONDO">Fondo</option>
                <option value="CDT">CDT</option>
                <option value="BONO">Bono</option>
                <option value="OTRO">Otro</option>
              </Form.Select></Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInvertir(false)}>Cancelar</Button>
          <Button variant="info" onClick={guardarInversion}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      {/* ── MODALES EDITAR ─────────────────────────────────────────────────── */}

      {/* MODAL EDITAR INGRESO */}
      <Modal show={showEditIngreso} onHide={() => setShowEditIngreso(false)}>
        <Modal.Header closeButton><Modal.Title>Editar Ingreso</Modal.Title></Modal.Header>
        <Modal.Body>
          {editItem && <Form>
            <Form.Group className="mb-2"><Form.Label>Monto *</Form.Label>
              <Form.Control type="text" value={fmt(editItem.monto)} onChange={e => setEditItem({ ...editItem, monto: e.target.value.replace(/\D/g, "") })} /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Fuente / Categoría</Form.Label>
              <Form.Control type="text" value={editItem.fuente} onChange={e => setEditItem({ ...editItem, fuente: e.target.value })} /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Fecha *</Form.Label>
              <Form.Control type="date" value={editItem.fecha} onChange={e => setEditItem({ ...editItem, fecha: e.target.value })} /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Descripción</Form.Label>
              <Form.Control type="text" value={editItem.descripcion} onChange={e => setEditItem({ ...editItem, descripcion: e.target.value })} /></Form.Group>
          </Form>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditIngreso(false)}>Cancelar</Button>
          <Button variant="primary" onClick={guardarEditIngreso}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL EDITAR GASTO */}
      <Modal show={showEditGasto} onHide={() => setShowEditGasto(false)}>
        <Modal.Header closeButton><Modal.Title>Editar Gasto</Modal.Title></Modal.Header>
        <Modal.Body>
          {editItem && <Form>
            <Form.Group className="mb-2"><Form.Label>Monto *</Form.Label>
              <Form.Control type="text" value={fmt(editItem.monto)} onChange={e => setEditItem({ ...editItem, monto: e.target.value.replace(/\D/g, "") })} /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Categoría</Form.Label>
              <Form.Control type="text" value={editItem.categoria} onChange={e => setEditItem({ ...editItem, categoria: e.target.value })} /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Fecha *</Form.Label>
              <Form.Control type="date" value={editItem.fecha} onChange={e => setEditItem({ ...editItem, fecha: e.target.value })} /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Descripción</Form.Label>
              <Form.Control type="text" value={editItem.descripcion} onChange={e => setEditItem({ ...editItem, descripcion: e.target.value })} /></Form.Group>
          </Form>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditGasto(false)}>Cancelar</Button>
          <Button variant="warning" onClick={guardarEditGasto}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL EDITAR META */}
      <Modal show={showEditMeta} onHide={() => setShowEditMeta(false)}>
        <Modal.Header closeButton><Modal.Title>Editar Meta</Modal.Title></Modal.Header>
        <Modal.Body>
          {editItem && <Form>
            <Form.Group className="mb-2"><Form.Label>Nombre *</Form.Label>
              <Form.Control type="text" value={editItem.nombre} onChange={e => setEditItem({ ...editItem, nombre: e.target.value })} /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Monto objetivo *</Form.Label>
              <Form.Control type="text" value={fmt(editItem.monto)} onChange={e => setEditItem({ ...editItem, monto: e.target.value.replace(/\D/g, "") })} /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Fecha límite</Form.Label>
              <Form.Control type="date" value={editItem.fecha} onChange={e => setEditItem({ ...editItem, fecha: e.target.value })} /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Prioridad</Form.Label>
              <Form.Select value={editItem.prioridad} onChange={e => setEditItem({ ...editItem, prioridad: e.target.value })}>
                <option value="BAJA">Baja</option>
                <option value="MEDIA">Media</option>
                <option value="ALTA">Alta</option>
              </Form.Select></Form.Group>
          </Form>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditMeta(false)}>Cancelar</Button>
          <Button variant="success" onClick={guardarEditMeta}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL EDITAR INVERSIÓN */}
      <Modal show={showEditInversion} onHide={() => setShowEditInversion(false)}>
        <Modal.Header closeButton><Modal.Title>Editar Inversión</Modal.Title></Modal.Header>
        <Modal.Body>
          {editItem && <Form>
            <Form.Group className="mb-2"><Form.Label>Nombre del activo</Form.Label>
              <Form.Control type="text" value={editItem.nombre_activo} onChange={e => setEditItem({ ...editItem, nombre_activo: e.target.value })} /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Monto *</Form.Label>
              <Form.Control type="text" value={fmt(editItem.monto)} onChange={e => setEditItem({ ...editItem, monto: e.target.value.replace(/\D/g, "") })} /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Tipo</Form.Label>
              <Form.Select value={editItem.tipo} onChange={e => setEditItem({ ...editItem, tipo: e.target.value })}>
                <option value="ACCION">Acción</option>
                <option value="ETF">ETF</option>
                <option value="CRIPTO">Cripto</option>
                <option value="FONDO">Fondo</option>
                <option value="CDT">CDT</option>
                <option value="BONO">Bono</option>
                <option value="OTRO">Otro</option>
              </Form.Select></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Fecha</Form.Label>
              <Form.Control type="date" value={editItem.fecha} onChange={e => setEditItem({ ...editItem, fecha: e.target.value })} /></Form.Group>
          </Form>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditInversion(false)}>Cancelar</Button>
          <Button variant="info" onClick={guardarEditInversion}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL SUGERENCIAS IA */}
      <Modal show={showAISuggestions} onHide={() => setShowAISuggestions(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>Sugerencias de la IA</Modal.Title></Modal.Header>
        <Modal.Body>
          {aiLoading ? <div className="text-center"><Spinner animation="border" /> Cargando...</div>
            : aiError ? <p className="text-danger">{aiSuggestions}</p>
            : !aiSuggestions ? <p>No hay sugerencias todavía.</p>
            : typeof aiSuggestions === 'string' ? <p>{aiSuggestions}</p>
            : <div>
                {aiSuggestions.resumen && <p><strong>Resumen:</strong> {aiSuggestions.resumen}</p>}
                {Array.isArray(aiSuggestions.recomendaciones) && (
                  <ul>{aiSuggestions.recomendaciones.map((rec, i) => (
                    <li key={i}>{typeof rec === 'string' ? rec : rec.titulo}</li>
                  ))}</ul>
                )}
              </div>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAISuggestions(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ActionsPanel