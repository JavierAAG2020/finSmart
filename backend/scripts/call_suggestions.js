const axios = require('axios')

async function run() {
  const payload = {
    listaGastos: [ { categoria: 'Comida', monto: 120000, descripcion: 'Supermercado' } ],
    listaIngresos: [ { fuente: 'Salario', monto: 3000000 } ],
    listaMetas: [],
    listaInversiones: []
  }
  try {
    console.log('REQUEST JSON:')
    console.log(JSON.stringify(payload, null, 2))
    const resp = await axios.post('http://localhost:4000/api/ai/suggestions', payload)
    console.log('RESP:', JSON.stringify(resp.data, null, 2))
  } catch (err) {
    console.error('Error calling /api/ai/suggestions:', err.message)
    if (err.response) console.error('status:', err.response.status, 'data:', JSON.stringify(err.response.data, null, 2))
    process.exit(1)
  }
}

run()
