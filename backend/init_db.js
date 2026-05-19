const fs = require('fs')
const path = require('path')
const mysql = require('mysql2/promise')
const { v4: uuidv4 } = require('uuid')
require('dotenv').config()

async function run() {
  const file = path.join(__dirname, '..', 'sql_finsmart.txt')
  if (!fs.existsSync(file)) {
    console.error('No se encontró sql_finsmart.txt en la raíz del proyecto.')
    process.exit(1)
  }
  const sql = fs.readFileSync(file, 'utf-8')

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    multipleStatements: true
  })

  try {
    console.log('Ejecutando SQL... esto puede tomar un momento')
    await connection.query(sql)

    // Inserta una categoría por defecto si no existe
    await connection.query(`INSERT IGNORE INTO Categorias (id_categoria, nombre, tipo) VALUES (1, 'General', 'GASTO')`)

    // Crea usuario admin si no existe (password: 1234)
    const [rows] = await connection.query(`SELECT * FROM Usuarios WHERE correo = ? LIMIT 1`, ['admin@local'])
    if (!rows || rows.length === 0) {
      const bcrypt = require('bcrypt')
      const hash = await bcrypt.hash('1234', 10)
      const id = uuidv4()
      await connection.query(`INSERT INTO Usuarios (id_usuario, nombre, correo, password_hash) VALUES (?, ?, ?, ?)`, [id, 'admin', 'admin@local', hash])
      const hash = await bcrypt.hash('una_clave', 10)
      const id = uuidv4()
      await connection.query(`INSERT INTO Usuarios (id_usuario, nombre, correo, password_hash) VALUES (?, ?, ?, ?)`, [id, 'un_usr', 'un_usr@local', hash])
      console.log('Usuario admin creado: admin@local / 1234')
    }

    console.log('SQL ejecutado correctamente.')
  } catch (err) {
    console.error('Error al ejecutar SQL:', err)
  } finally {
    await connection.end()
  }
}

run()
