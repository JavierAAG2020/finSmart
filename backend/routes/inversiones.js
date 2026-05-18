const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const db = require('../db')
const authMiddleware = require('../middleware/authenticate')

router.use(authMiddleware)

// GET /api/inversiones — obtener todas las inversiones del usuario
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM Inversiones
       WHERE id_usuario = ?
       ORDER BY fecha_inversion DESC`,
      [req.user.userId]
    )
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al obtener inversiones' })
  }
})

// POST /api/inversiones — crear una inversión
router.post('/', async (req, res) => {
  try {
    const { nombre_activo, tipo_activo, monto_invertido, valor_actual, fecha_inversion, riesgo, rentabilidad } = req.body

    if (!monto_invertido || !fecha_inversion) {
      return res.status(400).json({ error: 'monto_invertido y fecha_inversion son obligatorios' })
    }

    // Tipos válidos en el ENUM de la BD
    const tiposValidos = ['ACCION', 'ETF', 'CRIPTO', 'FONDO', 'CDT', 'BONO', 'OTRO']
    const tipoNormalizado = tipo_activo?.toUpperCase()
    const tipoFinal = tiposValidos.includes(tipoNormalizado) ? tipoNormalizado : 'OTRO'

    const id = uuidv4()
    await db.query(
      `INSERT INTO Inversiones
        (id_inversion, id_usuario, nombre_activo, tipo_activo, monto_invertido, valor_actual, rentabilidad, riesgo, fecha_inversion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        req.user.userId,
        nombre_activo || 'Sin nombre',
        tipoFinal,
        monto_invertido,
        valor_actual || monto_invertido,
        rentabilidad || null,
        riesgo || 'MEDIO',
        fecha_inversion
      ]
    )

    res.status(201).json({ id_inversion: id, mensaje: 'Inversión creada' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al crear inversión' })
  }
})

module.exports = router