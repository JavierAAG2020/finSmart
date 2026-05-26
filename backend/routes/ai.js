const express = require('express')
const router = express.Router()
const { generateFromPrompt } = require('../ai_client')
const axios = require('axios')
const pool = require('../db')
const { v4: uuidv4 } = require('uuid')


async function callGeminiV1beta(prompt, opts = {}) {
  const apiKey = process.env.GOOGLE_AI_API_KEY
  if (!apiKey) throw new Error('Missing GOOGLE_AI_API_KEY in environment')

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`
  const body = {
    contents: [ { parts: [ { text: prompt } ] } ]
  }
  try {
    console.log('GEMINI REQUEST BODY:', JSON.stringify(body, null, 2))
    const resp = await axios.post(url, body)
    console.log('GEMINI RESPONSE BODY:', JSON.stringify(resp.data, null, 2))
    return resp.data
  } catch (err) {
    console.error('callGeminiV1beta HTTP error:', err.message)
    if (err.response) {
      console.error('status:', err.response.status)
      try { console.error('data:', JSON.stringify(err.response.data, null, 2)) } catch(e){ console.error('data (raw):', err.response.data) }
    }
    throw err
  }
}

router.post('/suggestions', async (req, res) => {
  try {
    const { listaGastos, listaIngresos, listaMetas, listaInversiones } = req.body || {}


    let prompt = 'Eres un asistente financiero que responde SOLO con JSON válido (sin texto adicional). Usa exactamente este formato de salida en español:\n' +
      '{"titulo":"","resumen":"","prioridad":"","impacto":"","recomendaciones":["texto 1","texto 2"]}\n' +
      'Notas:\n- Devuelve siempre las 5 claves: titulo, resumen, prioridad, impacto, recomendaciones. Si no aplican valores, usa cadena vacía o array vacío.\n- "recomendaciones" debe ser un array de strings (2-5 elementos), cada string máximo 120 caracteres.\n- No añadas explicaciones, ni markdown, ni comentarios, ni código: SOLO el JSON.\n- Responde en español.\n\n' +
      'Analiza los siguientes datos del usuario y rellena el JSON objeto con recomendaciones concisas.\n\n'

    prompt += 'Gastos:\n'
    if (Array.isArray(listaGastos) && listaGastos.length) {
      listaGastos.slice(-3).forEach(g => {
        prompt += `- ${g.categoria || 'sin-cat'}: $${g.monto || g.monto == 0 ? g.monto : ''} (${g.descripcion || ''})\n`
      })
    } else {
      prompt += '- No hay gastos registrados.\n'
    }

    prompt += '\nIngresos:\n'
    if (Array.isArray(listaIngresos) && listaIngresos.length) {
      listaIngresos.slice(-3).forEach(i => {
        prompt += `- ${i.fuente || 'sin-fuente'}: $${i.monto || ''} (${i.descripcion || ''})\n`
      })
    } else {
      prompt += '- No hay ingresos registrados.\n'
    }

    prompt += '\nMetas:\n'
    if (Array.isArray(listaMetas) && listaMetas.length) {
      listaMetas.forEach(m => {
        prompt += `- ${m.nombre || ''}: $${m.monto || ''} (limite: ${m.fecha || 'sin fecha'})\n`
      })
    } else {
      prompt += '- No hay metas definidas.\n'
    }

    prompt += '\nInversiones:\n'
    if (Array.isArray(listaInversiones) && listaInversiones.length) {
      listaInversiones.forEach(inv => {
        prompt += `- ${inv.tipo || ''}: $${inv.monto || ''}\n`
      })
    } else {
      prompt += '- No hay inversiones registradas.\n'
    }

    prompt += '\nProporciona las recomendaciones en español de forma concisa.'

    const result = await generateFromPrompt(prompt)

    // Intentar parsear JSON retornado por el modelo
    let normalized = { titulo: '', resumen: '', prioridad: '', impacto: '', recomendaciones: [] }
    try {
      const parsed = JSON.parse(String(result))
      // Map parsed keys into normalized shape, tolerate variants
      normalized.titulo = parsed.titulo || parsed.title || ''
      normalized.resumen = parsed.resumen || parsed.summary || ''
      normalized.prioridad = parsed.prioridad || parsed.priority || ''
      normalized.impacto = parsed.impacto || parsed.impact || ''
      if (Array.isArray(parsed.recomendaciones)) {
        // ensure array of strings
        normalized.recomendaciones = parsed.recomendaciones.map(r => (typeof r === 'string' ? r : (r.titulo || r.descripcion || JSON.stringify(r)))).slice(0,5)
      }
    } catch (e) {
      // Si no es JSON válido, intentar extraer JSON dentro de bloques ```json ```
      const text = String(result || '')
      const fencedMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
      if (fencedMatch) {
        try {
          const inner = fencedMatch[1].trim()
          const parsedInner = JSON.parse(inner)
          // map into normalized
          normalized.titulo = parsedInner.titulo || parsedInner.title || normalized.titulo
          normalized.resumen = parsedInner.resumen || parsedInner.summary || normalized.resumen
          normalized.prioridad = parsedInner.prioridad || parsedInner.priority || normalized.prioridad
          normalized.impacto = parsedInner.impacto || parsedInner.impact || normalized.impacto
          if (Array.isArray(parsedInner.recomendaciones)) {
            normalized.recomendaciones = parsedInner.recomendaciones.map(r => (typeof r === 'string' ? r : (r.titulo || r.descripcion || JSON.stringify(r)))).slice(0,5)
          }
          return res.json({ suggestions: normalized })
        } catch (innerErr) {
          // fallthrough to heuristics if parsing fails
          console.warn('Fenced JSON parse failed, falling back to heuristics:', innerErr.message)
        }
      }
      // Si no es JSON válido, aplicar heurística para construir el objeto requerido
      
      // Extraer recomendaciones numeradas o en viñetas
      const items = []
      const numRegex = /(?:\n|^)\s*\d+[\)\.]\s*(.+?)(?=\n\s*\d+[\)\.]|\n\s*$)/g
      let m
      while ((m = numRegex.exec(text)) !== null) {
        items.push(m[1].trim())
      }
      if (items.length === 0) {
        // try bullets
        const bulletRegex = /(?:\n|^)\s*[-\*\u2022]\s*(.+?)(?=\n|$)/g
        while ((m = bulletRegex.exec(text)) !== null) {
          items.push(m[1].trim())
        }
      }
      if (items.length === 0) {
        // fallback: split into sentences and take first 3
        const sentences = text.split(/(?<=[\.\?\!])\s+/).map(s=>s.trim()).filter(Boolean)
        for (let i=0;i<Math.min(3,sentences.length);i++) items.push(sentences[i])
      }

      // resumen: first line or first 160 chars
      const firstLine = text.split(/\r?\n/).find(l => l.trim()) || ''
      normalized.resumen = firstLine.length > 160 ? firstLine.slice(0,160) + '...' : firstLine

      // default titulo
      normalized.titulo = normalized.titulo || 'Sugerencias IA'

      // set recomendaciones as plain strings, limit 5
      normalized.recomendaciones = items.slice(0,5).map(i => i.replace(/^\d+[\)\.\-\s]*/,'').trim())
    }

    // Ensure required keys exist
    normalized.titulo = normalized.titulo || ''
    normalized.resumen = normalized.resumen || ''
    normalized.prioridad = normalized.prioridad || ''
    normalized.impacto = normalized.impacto || ''
    normalized.recomendaciones = Array.isArray(normalized.recomendaciones) ? normalized.recomendaciones : []

    // Return normalized object only
    return res.json({ suggestions: normalized })
  } catch (err) {
    console.error('AI suggestions error:', err.message || err)
    res.status(500).json({ error: 'Error generando sugerencias IA', details: err.message })
  }
})

// New endpoint: /api/ai/recomendaciones
router.post('/recomendaciones', async (req, res) => {
  try {
    const { gastos, ingresos, ahorro } = req.body || {}

    const prompt = `Analiza esta situación financiera y responde en español. Usa exactamente la estructura indicada y sé conciso. Limita la respuesta a aproximadamente 80 tokens como máximo.\n\nContexto:\nGastos: ${JSON.stringify(gastos)}\nIngresos: ${JSON.stringify(ingresos)}\nAhorro: ${JSON.stringify(ahorro)}\n\nInstrucciones para la salida (obligatorio):\n- Haz un breve resumen (1-2 frases).\n- Entrega 3 recomendaciones separadas numeradas. Cada recomendación debe seguir este formato:\n  Título: (máx. 6 palabras)\n  Acción concreta: (pasos claros y accionables, máximo 3 pasos)\n  Prioridad: ALTA | MEDIA | BAJA\n  Impacto estimado: alto | medio | bajo\n- Usa frases cortas. No añadas texto fuera de la estructura.\n\nResponde solo con el contenido solicitado.`

    // Call the v1beta Gemini generateContent endpoint with maxOutputTokens only
    const apiResp = await callGeminiV1beta(prompt, { maxOutputTokens: 80 })

    // Try to extract text from the response shape shown in the example
    const candidate = apiResp?.candidates && apiResp.candidates[0]
    const text = candidate?.content?.parts?.map(p => p.text).join('\n') || apiResp?.output?.text || JSON.stringify(apiResp)
    // Save to DB: require or fallback to admin user
    let idUsuario = req.body?.id_usuario
    if (!idUsuario) {
      const [rows] = await pool.query('SELECT id_usuario FROM Usuarios WHERE correo = ? LIMIT 1', ['admin@local'])
      if (rows && rows.length) idUsuario = rows[0].id_usuario
    }

    if (!idUsuario) {
      console.error('No se encontró id_usuario y no existe admin@local')
      return res.status(400).json({ ok: false, error: 'Se requiere id_usuario o exista un usuario admin@local en la BD' })
    }

    // Parse the model text into numbered recommendation blocks and insert each as a separate row
    const recRegex = /(\d+)\.\s*([\s\S]*?)(?=(?:\n\s*\d+\.)|\s*$)/g
    const blocks = []
    let m
    while ((m = recRegex.exec(text || '')) !== null) {
      blocks.push(m[2].trim())
    }

    const insertedIds = []
    try {
      console.log('Guardando recomendaciones separadas en BD para usuario:', idUsuario)
      const insertSql = `INSERT INTO Recomendaciones_IA (id_recomendacion, id_usuario, tipo_recomendacion, titulo, descripcion, nivel_prioridad, modelo_utilizado) VALUES (?, ?, ?, ?, ?, ?, ?)`

      if (blocks.length === 0) {
        // fallback: insert the whole text as one recommendation
        const idRecomendacion = uuidv4()
        const titulo = (text || '').split('\n')[0].slice(0, 200) || 'Recomendación IA'
        const params = [idRecomendacion, idUsuario, 'AUTOMATICA', titulo, text, 'MEDIA', 'gemini-2.5-flash']
        await pool.query(insertSql, params)
        insertedIds.push(idRecomendacion)
      } else {
        for (const block of blocks) {
          // Extract fields from block
          const titleMatch = block.match(/Título:\s*(.+)/i)
          const priorityMatch = block.match(/Prioridad:\s*(ALTA|MEDIA|BAJA)/i)
          const title = (titleMatch && titleMatch[1]) ? titleMatch[1].trim().slice(0,200) : block.split('\n')[0].slice(0,200)
          const prioridad = (priorityMatch && priorityMatch[1]) ? priorityMatch[1].toUpperCase() : 'MEDIA'
          const descripcion = block
          const idRecomendacion = uuidv4()
          const params = [idRecomendacion, idUsuario, 'AUTOMATICA', title, descripcion, prioridad, 'gemini-2.5-flash']
          await pool.query(insertSql, params)
          insertedIds.push(idRecomendacion)
        }
      }

      console.log('Inserted recommendation ids:', insertedIds)
    } catch (dbErr) {
      console.error('DB insert error:', dbErr)
      return res.status(500).json({ ok: false, error: 'Error guardando recomendación en BD', details: dbErr.message })
    }

    res.json({ ok: true, insertedIds, respuesta: text, raw: apiResp })
  } catch (err) {
    console.error('recomendaciones error:', err.message || err)
    res.status(500).json({ ok: false, error: err.message })
  }
})

module.exports = router

// GET /api/ai/recomendaciones? id_usuario=...
router.get('/recomendaciones', async (req, res) => {
  try {
    const { id_usuario } = req.query || {}
    if (id_usuario) {
      const [rows] = await pool.query('SELECT * FROM Recomendaciones_IA WHERE id_usuario = ? ORDER BY fecha_generacion DESC', [id_usuario])
      return res.json({ ok: true, rows })
    }

    // Return recent recommendations if no user specified
    const [rows] = await pool.query('SELECT * FROM Recomendaciones_IA ORDER BY fecha_generacion DESC LIMIT 200')
    res.json({ ok: true, rows })
  } catch (err) {
    console.error('get recomendaciones error:', err)
    res.status(500).json({ ok: false, error: err.message })
  }
})

// GET /api/ai/recomendaciones/:id
router.get('/recomendaciones/:id', async (req, res) => {
  try {
    const id = req.params.id
    const [rows] = await pool.query('SELECT * FROM Recomendaciones_IA WHERE id_recomendacion = ?', [id])
    if (!rows || rows.length === 0) return res.status(404).json({ ok: false, error: 'No encontrado' })
    res.json({ ok: true, row: rows[0] })
  } catch (err) {
    console.error('get recomendacion by id error:', err)
    res.status(500).json({ ok: false, error: err.message })
  }
})
