const pool = require('../db')

;(async ()=>{
  try{
    const selectSql = `SELECT id_recomendacion, titulo FROM Recomendaciones_IA WHERE titulo LIKE 'Resumen:%' OR descripcion LIKE '%1.%'`
    const [rows] = await pool.query(selectSql)
    if (!rows || rows.length === 0) {
      console.log(JSON.stringify({ deleted: 0, ids: [] }, null, 2))
      return process.exit()
    }
    const ids = rows.map(r => r.id_recomendacion)
    console.log('Found ids to delete:', JSON.stringify(ids, null, 2))
    const [delRes] = await pool.query('DELETE FROM Recomendaciones_IA WHERE id_recomendacion IN (?)', [ids])
    console.log(JSON.stringify({ deleted: delRes.affectedRows, ids }, null, 2))
  } catch (e) {
    console.error('Error:', e.message)
    process.exit(1)
  } finally{
    process.exit()
  }
})()
