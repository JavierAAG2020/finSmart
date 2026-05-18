const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const db = require('../db')
const authenticate = require('../middleware/authenticate')

router.use(authenticate)

// PUT /api/perfil — actualizar nombre y correo
router.put('/', async (req, res) => {
  try {
    const { nombre, correo } = req.body
    if (!nombre || !correo) return res.status(400).json({ error: 'nombre y correo son obligatorios' })

    // Verificar que el correo no lo use otro usuario
    const [rows] = await db.query(
      'SELECT id_usuario FROM Usuarios WHERE correo = ? AND id_usuario != ?',
      [correo, req.user.userId]
    )
    if (rows.length > 0) return res.status(409).json({ error: 'Ese correo ya está en uso' })

    await db.query(
      'UPDATE Usuarios SET nombre = ?, correo = ? WHERE id_usuario = ?',
      [nombre, correo, req.user.userId]
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

module.exports = router