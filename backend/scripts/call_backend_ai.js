const axios = require('axios')
async function run() {
  const payload = {
    listaGastos: [
      { categoria: 'Alquiler', monto: 450000, descripcion: 'Alquiler' },
      { categoria: 'Comida', monto: 120000, descripcion: 'Comida y restaurantes' },
      { categoria: 'Transporte', monto: 80000, descripcion: 'Transporte' }
    ],
    listaIngresos: [ { fuente: 'Salario', monto: 3000000, descripcion: 'Salario mensual' } ],
    listaMetas: [ { nombre: 'Vacaciones', monto: 1500000, fecha: '2026-12-01' } ],
    listaInversiones: [ { tipo: 'Fondo indexado', monto: 200000, descripcion: 'Fondo indexado' } ]
  }

  try {
    const resp = await axios.post('http://localhost:4000/api/ai/suggestions', payload)
    console.log('Respuesta backend /api/ai/suggestions:')
    console.log(JSON.stringify(resp.data, null, 2))
  } catch (err) {
    console.error('Error llamando al backend:', err.message)
    if (err.response) {
      console.error('status:', err.response.status)
      console.error('data:', JSON.stringify(err.response.data, null, 2))
    }
    process.exit(1)
  }
}

run()
