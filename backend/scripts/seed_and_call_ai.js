const axios = require('axios')
const mysql = require('mysql2/promise')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')
require('dotenv').config()

const API_BASE = 'http://localhost:4000'

async function run() {
  // 1) register user via API
  const correo = `test_user_${Date.now()}@local`
  const nombre = 'Test User'
  const pass = 'testpass'

  try {
    await axios.post(`${API_BASE}/api/auth/register`, { nombre, correo, pass })
    console.log('Usuario registrado:', correo)
  } catch (err) {
    if (err.response && err.response.status === 409) {
      console.log('Usuario ya existe, continuando...')
    } else {
      console.error('Error registrando usuario:', err.message)
      return process.exit(1)
    }
  }

  // 2) login to get token and user id
  const login = await axios.post(`${API_BASE}/api/auth/login`, { user: correo, pass })
  const token = login.data.token
  const user = login.data.user
  console.log('Login OK, user id:', user.id)

  // 3) ensure default category exists (id 1)
  const pool = await mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'finsmart'
  })

  await pool.query(`INSERT IGNORE INTO Categorias (id_categoria, nombre, tipo) VALUES (1, 'General', 'GASTO')`)

  // 4) create some registros via API (authenticated)
  const registros = [
    { tipo_movimiento: 'INGRESO', monto: 3000000, descripcion: 'Salario mensual' },
    { tipo_movimiento: 'GASTO', monto: 450000, descripcion: 'Alquiler' },
    { tipo_movimiento: 'GASTO', monto: 120000, descripcion: 'Comida y restaurantes' },
    { tipo_movimiento: 'GASTO', monto: 80000, descripcion: 'Transporte' },
    { tipo_movimiento: 'INVERSION', monto: 200000, descripcion: 'Fondo indexado' }
  ]

  for (const r of registros) {
    try {
      const resp = await axios.post(`${API_BASE}/api/registros`, r, { headers: { Authorization: `Bearer ${token}` } })
      console.log('Registro creado:', resp.data)
    } catch (err) {
      console.error('Error creando registro:', err.response ? err.response.data : err.message)
    }
  }

  // 5) build payload from these registros and add a sample meta
  const listaGastos = registros.filter(r => r.tipo_movimiento === 'GASTO')
  const listaIngresos = registros.filter(r => r.tipo_movimiento === 'INGRESO')
  const listaInversiones = registros.filter(r => r.tipo_movimiento === 'INVERSION')
  const listaMetas = [ { nombre: 'Vacaciones', monto: 1500000, fecha: '2026-12-01' } ]
  // 6) Call Google Generative Language API directly using provided key to avoid needing server env
  const GOOGLE_KEY = process.env.GOOGLE_AI_API_KEY || process.argv[2]
  if (!GOOGLE_KEY) {
    console.error('Falta GOOGLE_AI_API_KEY en env o como argumento')
    process.exit(1)
  }

  // Build a prompt similar to the backend route
  let prompt = 'Eres un asistente financiero que ofrece sugerencias prácticas y accionables. Analiza los siguientes datos del usuario y entrega: 1) Resumen breve, 2) 3-5 recomendaciones personalizadas, 3) Prioridades (alta/media/baja), y 4) posibles metas financieras. Mantén el lenguaje en español.\n\n'
  prompt += 'Gastos:\n'
  listaGastos.forEach(g => { prompt += `- ${g.categoria || 'sin-cat'}: $${g.monto} (${g.descripcion || ''})\n` })
  prompt += '\nIngresos:\n'
  listaIngresos.forEach(i => { prompt += `- ${i.fuente || 'sin-fuente'}: $${i.monto} (${i.descripcion || ''})\n` })
  prompt += '\nMetas:\n'
  listaMetas.forEach(m => { prompt += `- ${m.nombre}: $${m.monto} (limite: ${m.fecha})\n` })
  prompt += '\nInversiones:\n'
  listaInversiones.forEach(inv => { prompt += `- ${inv.tipo || 'inversion'}: $${inv.monto}\n` })
  prompt += '\nProporciona las recomendaciones en español de forma concisa.'

  const modelVariants = [
    'text-bison-001',
    'chat-bison-001',
    'text-bison@001',
    'chat-bison@001',
    'text-bison'
  ]

  const body = { prompt: { text: prompt }, temperature: 0.2, maxOutputTokens: 512 }

  const versions = ['v1beta2', 'v1']

  let lastErr = null
  for (const mv of modelVariants) {
    for (const v of versions) {
      const url = `https://generativelanguage.googleapis.com/${v}/models/${mv}:generate?key=${GOOGLE_KEY}`
      try {
        console.log('intentando endpoint:', url)
        const resp = await axios.post(url, body)
        console.log('\n=== SUGERENCIAS IA (JSON) ===')
        console.log(JSON.stringify(resp.data, null, 2))
        lastErr = null
        break
      } catch (err) {
        lastErr = err
        console.error('endpoint fallo, intentando siguiente... status/message:', err.response ? err.response.status : err.message)
      }
    }
    if (!lastErr) break
  }

  if (lastErr) {
    console.error('Todas las endpoints/modelos intentados fallaron. Último error:')
    console.error('message:', lastErr.message)
    if (lastErr.response) {
      console.error('status:', lastErr.response.status)
      console.error('data:', JSON.stringify(lastErr.response.data, null, 2))
    }
    await pool.end()
    process.exit(1)
  }

  await pool.end()
}

run().catch(e => { console.error(e); process.exit(1) })
