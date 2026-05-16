require('dotenv').config()
const mysql = require('mysql2/promise')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')

async function run() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  })

  const nombre = 'admin'
  const correo = 'admin@local'
  const plain = '1234'

  const hash = await bcrypt.hash(plain, 10)
  const id = uuidv4()

  try {
    await pool.query(
      'INSERT INTO Usuarios (id_usuario, nombre, correo, password_hash) VALUES (?, ?, ?, ?)',
      [id, nombre, correo, hash]
    )
    console.log('Usuario creado:', correo, '/', plain)
  } catch (err) {
    console.error('Error creando usuario:', err.message)
  } finally {
    await pool.end()
  }
}

run().catch(e => { console.error(e); process.exit(1) })
