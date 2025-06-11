const express = require('express');
const route = express.Router();
 const axios = require('axios');


route.get("/" , (req, res) => {
    res.render("chatPage");
})


route.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.messages?.[0]?.content || req.body.message;
        
        if (!userMessage) {
            return res.status(400).json({ error: "No message provided" });
        }

        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: 'deepseek/deepseek-r1:free',
            messages: [{ role: 'user', content: userMessage }],
        }, {
            headers: {
                'Authorization': 'Bearer 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',
                'HTTP-Referer': 'https://www.sitename.com',
                'X-Title': 'SiteName',
                'Content-Type': 'application/json'
            }
        });
        
        const data = response.data;
        res.json({ 
            choices: [{
                message: {
                    content: data.choices?.[0]?.message?.content || 'No response received.'
                }
            }]
        });
    } catch (err) {
        console.error("Chat error:", err);
        res.status(500).json({ 
            choices: [{
                message: {
                    content: 'Error: ' + (err.response?.data?.error || err.message)
                }
            }]
        });
    }
});

module.exports = route;