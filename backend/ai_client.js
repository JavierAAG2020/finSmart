const axios = require('axios')
require('dotenv').config()

async function generateFromPrompt(prompt) {
  const apiKey = process.env.GOOGLE_AI_API_KEY
  if (!apiKey) throw new Error('Missing GOOGLE_AI_API_KEY in environment')

  // Try using the official SDK if available
  try {
    const { GoogleGenAI } = require('@google/genai')
    const ai = new GoogleGenAI({ apiKey })
    // SDK may accept contents as string per user snippet
    const response = await ai.models.generateContent({ model: 'gemini-2.0-flash', contents: prompt })
    // Response shape can vary; try common fields
    const text = response && (response.text || (response.output && response.output[0] && response.output[0].content))
    if (text) return text
    return JSON.stringify(response)
  } catch (sdkErr) {
    console.error('SDK call failed or @google/genai not installed:', sdkErr.message || sdkErr)
    // fall back to HTTP call
  }
  // Fallback 1: try Gemini v1beta generateContent (used elsewhere and known to work)
  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`
    const geminiBody = { contents: [ { parts: [ { text: prompt } ] } ] }
    console.log('Calling Gemini v1beta REST API:', geminiUrl)
    const gemResp = await axios.post(geminiUrl, geminiBody)
    const gemData = gemResp.data || {}
    const candidate = gemData?.candidates && gemData.candidates[0]
    if (candidate) return candidate.content?.parts?.map(p => p.text).join('\n') || JSON.stringify(candidate)
    if (gemData?.output?.text) return gemData.output.text
  } catch (gemErr) {
    console.error('Gemini v1beta fallback error:', gemErr.message)
    if (gemErr.response) {
      try { console.error('status:', gemErr.response.status, 'data:', JSON.stringify(gemErr.response.data, null, 2)) } catch(e){ console.error('data:', gemErr.response.data) }
    }
    // continue to next fallback
  }

  // Fallback 2: try Generative Language REST API text-bison
  const MODEL = 'models/text-bison-001'
  const url = `https://generativelanguage.googleapis.com/v1/${MODEL}:generate?key=${apiKey}`
  const body = { prompt: { text: prompt }, temperature: 0.2, maxOutputTokens: 512 }
  try {
    console.log('Calling fallback REST API (text-bison):', url)
    const resp = await axios.post(url, body)
    const data = resp.data || {}
    const candidate = (data.candidates && data.candidates[0]) || data.candidate || null
    if (candidate) return candidate.output || candidate.content || candidate.text || JSON.stringify(candidate)
    return data?.output?.text || JSON.stringify(data)
  } catch (err) {
    console.error('Fallback REST API error:', err.message)
    if (err.response) {
      try { console.error('status:', err.response.status, 'data:', JSON.stringify(err.response.data, null, 2)) } catch(e){ console.error('data:', err.response.data) }
    }
    throw err
  }
}

module.exports = { generateFromPrompt }
