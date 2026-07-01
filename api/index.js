const express = require('express');
const cors = require('cors');


try {
    require('dotenv').config();
} catch (e) {
    console.log("dotenv not found, assuming production environment");
}

const app = express();


app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());


app.post('/api/chat', async (req, res) => {
    try {
        const userText = req.body.message;
        const systemPrompt = req.body.systemPrompt || "Kamu adalah asisten pintar.";
        
        
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        
        if (!GEMINI_API_KEY) {
            return res.status(500).json({ error: "API Key tidak dikonfigurasi di server (Missing .env)" });
        }

        
        
        const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${GEMINI_API_KEY}`;
        
        const payload = {
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: systemPrompt + "\n\nPertanyaan Anak SD: " + userText }
                    ]
                }
            ]
        };

        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            const detail = errData.error ? errData.error.message : response.statusText;
            throw new Error(detail);
        }

        const data = await response.json();
        let botReply = "Maaf, Fin sedang bingung. Coba lagi ya!";
        
        if (data && data.candidates && data.candidates.length > 0) {
            botReply = data.candidates[0].content.parts[0].text;
        }

        
        res.json({ reply: botReply });

    } catch (error) {
        console.error("Server Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});


module.exports = app;
