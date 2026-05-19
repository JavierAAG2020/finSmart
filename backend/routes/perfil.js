const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const multer = require('multer')
const path = require('path')
const db = require('../db')
const authenticate = require('../middleware/authenticate')

router.use(authenticate)

// ── Configuración multer ──────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploadspfp/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `perfil_${req.user.userId}_${Date.now()}${ext}`)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB máximo
  fileFilter: (req, file, cb) => {
    const permitidos = /jpeg|jpg|png|webp/
    const valido = permitidos.test(path.extname(file.originalname).toLowerCase())
    valido ? cb(null, true) : cb(new Error('Solo se permiten imágenes JPG, PNG o WEBP'))
  }
})

// PUT /api/perfil — actualizar nombre, correo y moneda
router.put('/', async (req, res) => {
  try {
    const { nombre, correo, moneda_preferida } = req.body
    if (!nombre || !correo) return res.status(400).json({ error: 'nombre y correo son obligatorios' })

    const [rows] = await db.query(
      'SELECT id_usuario FROM Usuarios WHERE correo = ? AND id_usuario != ?',
      [correo, req.user.userId]
    )
    if (rows.length > 0) return res.status(409).json({ error: 'Ese correo ya está en uso' })

    await db.query(
      'UPDATE Usuarios SET nombre = ?, correo = ?, moneda_preferida = ? WHERE id_usuario = ?',
      [nombre, correo, moneda_preferida || 'COP', req.user.userId]
    )

    res.json({ mensaje: 'Perfil actualizado' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error del servidor' })
  }
})

// PUT /api/perfil/password — cambiar contraseña
router.put('/password', async (req, res) => {
  try {
    const { passwordActual, passwordNueva } = req.body
    if (!passwordActual || !passwordNueva) return res.status(400).json({ error: 'Faltan campos' })

    const [rows] = await db.query(
      'SELECT password_hash FROM Usuarios WHERE id_usuario = ?',
      [req.user.userId]
    )
    if (!rows.length) return res.status(404).json({ error: 'Usuario no encontrado' })

    const ok = await bcrypt.compare(passwordActual, rows[0].password_hash)
    if (!ok) return res.status(401).json({ error: 'La contraseña actual es incorrecta' })

    const hash = await bcrypt.hash(passwordNueva, 10)
    await db.query(
      'UPDATE Usuarios SET password_hash = ? WHERE id_usuario = ?',
      [hash, req.user.userId]
    )

    res.json({ mensaje: 'Contraseña actualizada' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error del servidor' })
  }
})

// POST /api/perfil/foto — subir foto de perfil
router.post('/foto', upload.single('foto'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se recibió ninguna imagen' })

    const urlFoto = `/uploads/${req.file.filename}`

    await db.query(
      'UPDATE Usuarios SET foto_perfil = ? WHERE id_usuario = ?',
      [urlFoto, req.user.userId]
    )

    res.json({ foto_perfil: urlFoto, mensaje: 'Foto actualizada' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al subir la foto' })
  }
})

module.exports = router