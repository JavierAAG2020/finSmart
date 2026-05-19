const express = require('express')
const router = express.Router()
const pool = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret'

// POST /api/auth/login { user, pass }
router.post('/login', async (req, res) => {
  try {
    const { user, pass } = req.body
    if (!user || !pass) return res.status(400).json({ error: 'user & pass required' })

    const [rows] = await pool.query(
      `SELECT * FROM Usuarios WHERE correo = ? OR nombre = ? LIMIT 1`,
      [user, user]
    )

    const row = rows && rows[0]
    if (!row) return res.status(401).json({ error: 'invalid credentials' })

    const ok = await bcrypt.compare(pass, row.password_hash)
    if (!ok) return res.status(401).json({ error: 'invalid credentials' })

    const token = jwt.sign({ userId: row.id_usuario, nombre: row.nombre }, JWT_SECRET, { expiresIn: '8h' })
    res.json({
  token,
  user: {
    id: row.id_usuario,
    nombre: row.nombre,
    correo: row.correo,
    foto_perfil: row.foto_perfil || null,
    moneda_preferida: row.moneda_preferida || 'COP'
  }
})
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
})

// POST /api/auth/register { nombre, correo, pass }
router.post('/register', async (req, res) => {
  try {
    console.log('REGISTER REQUEST BODY:', req.body)
    const { nombre, correo, pass } = req.body
    if (!nombre || !correo || !pass) return res.status(400).json({ error: 'nombre, correo y pass requeridos' })

    // comprobar si ya existe correo
    const [rows] = await pool.query('SELECT id_usuario FROM Usuarios WHERE correo = ? LIMIT 1', [correo])
    if (rows && rows[0]) return res.status(409).json({ error: 'correo ya registrado' })

    const hash = await bcrypt.hash(pass, 10)
    const id = uuidv4()

    await pool.query(
      'INSERT INTO Usuarios (id_usuario, nombre, correo, password_hash) VALUES (?, ?, ?, ?)',
      [id, nombre, correo, hash]
    )

    res.status(201).json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
})

module.exports = router
