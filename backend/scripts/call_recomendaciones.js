const axios = require('axios')

async function run() {
  const payload = {
    gastos: [
      { categoria: 'Alquiler', monto: 450000 },
      { categoria: 'Comida', monto: 120000 },
      { categoria: 'Transporte', monto: 80000 }
    ],
    ingresos: [ { fuente: 'Salario', monto: 3000000 } ],
    ahorro: { emergencia: 200000 }
  }

  try {
    console.log('REQUEST JSON:')
    console.log(JSON.stringify(payload, null, 2))

    const resp = await axios.post('http://localhost:4000/api/ai/recomendaciones', payload)
    console.log('Respuesta /api/ai/recomendaciones:')
    console.log(JSON.stringify(resp.data, null, 2))
  } catch (err) {
    console.error('Error llamando a /api/ai/recomendaciones:', err.message)
    if (err.response) console.error('status:', err.response.status, 'data:', JSON.stringify(err.response.data, null, 2))
    process.exit(1)
  }
}

run()
