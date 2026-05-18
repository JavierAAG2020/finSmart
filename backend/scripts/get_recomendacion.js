const pool = require('../db')
const id = process.argv[2]
if (!id) { console.error('Usage: node get_recomendacion.js <id>'); process.exit(1) }
;(async ()=>{
  try{
    const [rows] = await pool.query('SELECT * FROM Recomendaciones_IA WHERE id_recomendacion = ?', [id])
    console.log(JSON.stringify(rows, null, 2))
  } catch(e){
    console.error('Error:', e.message)
  } finally{ process.exit() }
})()
