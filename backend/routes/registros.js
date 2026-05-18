const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const db = require('../db')
const authMiddleware = require('../middleware/authenticate')

router.use(authMiddleware)

// Busca o crea una categoría por nombre y tipo
async function obtenerOCrearCategoria(nombre, tipo) {
  const [rows] = await db.query(
    'SELECT id_categoria FROM Categorias WHERE nombre = ? AND tipo = ?',
    [nombre, tipo]
  )

  if (rows.length > 0) {
    return rows[0].id_categoria
  }

  const [result] = await db.query(
    'INSERT INTO Categorias (nombre, tipo) VALUES (?, ?)',
    [nombre, tipo]
  )

  return result.insertId
}

// GET /api/registros — obtener todos los registros del usuario
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT r.*, c.nombre AS nombre_categoria
       FROM Registros_Financieros r
       JOIN Categorias c ON r.id_categoria = c.id_categoria
       WHERE r.id_usuario = ?
       ORDER BY r.fecha_movimiento DESC`,
      [req.user.userId]
    )

    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al obtener registros' })
  }
})

// POST /api/registros — crear ingreso o gasto
router.post('/', async (req, res) => {
  try {
    const { tipo_movimiento, monto, categoria, fecha, descripcion } = req.body

    if (!tipo_movimiento || !monto || !fecha) {
      return res.status(400).json({
        error: 'tipo_movimiento, monto y fecha son obligatorios',
      })
    }

    const nombreCategoria = categoria || 'General'
    const id_categoria = await obtenerOCrearCategoria(
      nombreCategoria,
      tipo_movimiento
    )

    const id = uuidv4()
    await db.query(
      `INSERT INTO Registros_Financieros
        (id_registro, id_usuario, id_categoria, tipo_movimiento, monto, descripcion, fecha_movimiento)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        req.user.userId,
        id_categoria,
        tipo_movimiento,
        monto,
        descripcion || null,
        fecha,
      ]
    )

    res.status(201).json({ id_registro: id, mensaje: 'Registro creado' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al crear registro' })
  }
})

// PUT /api/registros/:id — editar ingreso o gasto
router.put('/:id', async (req, res) => {
  try {
    const { monto, categoria, fecha, descripcion, tipo_movimiento } = req.body
    if (!monto || !fecha) return res.status(400).json({ error: 'monto y fecha son obligatorios' })

    // Verificar que el registro pertenece al usuario
    const [rows] = await db.query(
      'SELECT id_registro, tipo_movimiento FROM Registros_Financieros WHERE id_registro = ? AND id_usuario = ?',
      [req.params.id, req.user.userId]
    )
    if (!rows.length) return res.status(404).json({ error: 'Registro no encontrado' })

    const tipoFinal = tipo_movimiento || rows[0].tipo_movimiento
    const nombreCategoria = categoria || 'General'
    const id_categoria = await obtenerOCrearCategoria(nombreCategoria, tipoFinal)

    await db.query(
      `UPDATE Registros_Financieros
       SET monto = ?, id_categoria = ?, descripcion = ?, fecha_movimiento = ?
       WHERE id_registro = ? AND id_usuario = ?`,
      [monto, id_categoria, descripcion || null, fecha, req.params.id, req.user.userId]
    )

    res.json({ mensaje: 'Registro actualizado' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al actualizar registro' })
  }
})

// DELETE /api/registros/:id — eliminar ingreso o gasto
router.delete('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id_registro FROM Registros_Financieros WHERE id_registro = ? AND id_usuario = ?',
      [req.params.id, req.user.userId]
    )
    if (!rows.length) return res.status(404).json({ error: 'Registro no encontrado' })

    await db.query('DELETE FROM Registros_Financieros WHERE id_registro = ?', [req.params.id])
    res.json({ mensaje: 'Registro eliminado' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al eliminar registro' })
  }
})

module.exports = router
