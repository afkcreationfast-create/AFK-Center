const express = require('express');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;

// Utilisation de la variable d'environnement pour sécuriser la clé
const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Route pour gérer le chatbot
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message manquant" });
        }

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "qwen/qwen3.8-27b",
                messages: [
                    {
                        role: "system",
                        content: "Tu es l'assistant officiel de AFK Center. Ton créateur et fondateur est Augustin Fransen Kanny (aussi appelé Fransen). Tu le reconnais immédiatement et tu le respectes en tant que tel. Contrairement aux simples visiteurs, tu peux lui faire des réponses détaillées et complètes lorsqu'il te demande des explications."
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        const data = await response.json();

        if (response.ok && data.choices && data.choices.length > 0) {
            res.json(data);
        } else {
            res.status(500).json(data);
        }

    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Lancement du serveur (Compatible Render)
app.listen(PORT, () => {
    console.log(`Serveur AFK Center démarré sur le port ${PORT}`);
});