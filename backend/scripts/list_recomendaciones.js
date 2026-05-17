const axios = require('axios')
const idUsuario = process.argv[2] || null
;(async ()=>{
  try{
    const url = 'http://localhost:4000/api/ai/recomendaciones'
    const resp = await axios.get(url, { params: idUsuario ? { id_usuario: idUsuario } : {} })
    console.log(JSON.stringify(resp.data, null, 2))
  } catch(e){
    console.error('Error:', e.message)
    if (e.response) console.error('status:', e.response.status, 'data:', JSON.stringify(e.response.data, null, 2))
    process.exit(1)
  }
  process.exit()
})()
