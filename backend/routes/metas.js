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

module.exports = router