const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const db = require('../db')
const authMiddleware = require('../middleware/authenticate')

router.use(authMiddleware)

// GET /api/metas — obtener todas las metas del usuario
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM Metas_Ahorro
       WHERE id_usuario = ?
       ORDER BY fecha_creacion DESC`,
      [req.user.userId]
    )
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al obtener metas' })
  }
})

// POST /api/metas — crear una meta
router.post('/', async (req, res) => {
  try {
    const { nombre, monto_objetivo, fecha_objetivo, descripcion, prioridad } = req.body

    if (!nombre || !monto_objetivo) {
      return res.status(400).json({ error: 'nombre y monto_objetivo son obligatorios' })
    }

    const id = uuidv4()
    await db.query(
      `INSERT INTO Metas_Ahorro
        (id_meta, id_usuario, nombre, descripcion, monto_objetivo, fecha_objetivo, prioridad)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        req.user.userId,
        nombre,
        descripcion || null,
        monto_objetivo,
        fecha_objetivo || null,
        prioridad || 'MEDIA'
      ]
    )

    res.status(201).json({ id_meta: id, mensaje: 'Meta creada' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al crear meta' })
  }
})


// PUT /api/metas/:id — editar meta
router.put('/:id', async (req, res) => {
  try {
    const { nombre, monto_objetivo, fecha_objetivo, prioridad } = req.body
    if (!nombre || !monto_objetivo) return res.status(400).json({ error: 'nombre y monto_objetivo son obligatorios' })

    const [rows] = await db.query(
      'SELECT id_meta FROM Metas_Ahorro WHERE id_meta = ? AND id_usuario = ?',
      [req.params.id, req.user.userId]
    )
    if (!rows.length) return res.status(404).json({ error: 'Meta no encontrada' })

    await db.query(
      `UPDATE Metas_Ahorro
       SET nombre = ?, monto_objetivo = ?, fecha_objetivo = ?, prioridad = ?
       WHERE id_meta = ? AND id_usuario = ?`,
      [nombre, monto_objetivo, fecha_objetivo || null, prioridad || 'MEDIA', req.params.id, req.user.userId]
    )

    res.json({ mensaje: 'Meta actualizada' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al actualizar meta' })
  }
})

// DELETE /api/metas/:id — eliminar meta
router.delete('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id_meta FROM Metas_Ahorro WHERE id_meta = ? AND id_usuario = ?',
      [req.params.id, req.user.userId]
    )
    if (!rows.length) return res.status(404).json({ error: 'Meta no encontrada' })

    await db.query('DELETE FROM Metas_Ahorro WHERE id_meta = ?', [req.params.id])
    res.json({ mensaje: 'Meta eliminada' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al eliminar meta' })
  }
})

module.exports = router