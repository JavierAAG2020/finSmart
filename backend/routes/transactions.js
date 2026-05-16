const express = require('express')
const router = express.Router()
const pool = require('../db')
const { v4: uuidv4 } = require('uuid')
const authenticate = require('../middleware/authenticate')

// GET /api/dashboard
router.get('/dashboard', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId
    const sql = `
      SELECT
        COALESCE(SUM(CASE WHEN tipo_movimiento = 'INGRESO' THEN monto END),0) AS ingresos,
        COALESCE(SUM(CASE WHEN tipo_movimiento = 'GASTO' THEN monto END),0) AS gastos,
        COALESCE(SUM(CASE WHEN tipo_movimiento = 'INVERSION' THEN monto END),0) AS inversiones
      FROM Registros_Financieros
      WHERE id_usuario = ?
    `
    const [rows] = await pool.query(sql, [userId])
    const row = rows[0] || { ingresos: 0, gastos: 0, inversiones: 0 }
    const dineroTotal = Number(row.ingresos || 0) - Number(row.gastos || 0) - Number(row.inversiones || 0)
    res.json({ dineroTotal, gastos: Number(row.gastos || 0), inversiones: Number(row.inversiones || 0) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'db error' })
  }
})

// POST /api/registros { tipo_movimiento, monto, descripcion, fecha_movimiento }
router.post('/registros', authenticate, async (req, res) => {
  try {
    const { tipo_movimiento, monto, descripcion, fecha_movimiento, id_categoria } = req.body
    if (!tipo_movimiento || monto == null) return res.status(400).json({ error: 'tipo_movimiento & monto required' })

    const id = uuidv4()
    const userId = req.user.userId
    const fecha = fecha_movimiento || new Date().toISOString().slice(0,19).replace('T',' ')
    const categoria = id_categoria || 1

    const insert = `INSERT INTO Registros_Financieros (id_registro, id_usuario, id_categoria, tipo_movimiento, monto, descripcion, fecha_movimiento, es_recurrente) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    await pool.query(insert, [id, userId, categoria, tipo_movimiento, monto, descripcion || '', fecha, false])

    res.json({ id, tipo_movimiento, monto, descripcion, fecha_movimiento: fecha })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'db error' })
  }
})

module.exports = router
