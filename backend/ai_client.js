const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.GOOGLE_AI_API_KEY;

async function generateFromPrompt(prompt) {

    if (!apiKey) {
        throw new Error('Missing GOOGLE_AI_API_KEY');
    }

    try {

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ],
                generationConfig: {
                    maxOutputTokens: 1500,
                    temperature: 0.4
                }
            }
        );

        return response.data
            ?.candidates?.[0]
            ?.content?.parts?.[0]
            ?.text || "Sin respuesta";

    } catch (err) {

        console.error(
            'Gemini error:',
            err.response?.data || err.message
        );

        throw err;
    }
}

module.exports = {
    generateFromPrompt
};