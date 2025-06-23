require('dotenv').config();
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
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'HTTP-Referer': 'http://localhost:3000',
                'X-Title': 'MyChatApp',
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

// route.post("/chat", async (req, res) => {
//     try {
//         const response = await axios.post(
//             "https://openrouter.ai/api/v1/chat/completions",
//             {
//                 model: "deepseek/deepseek-r1:free",
//                 messages: [{ role: "user", content: "Hello" }],
//             },
//             {
//                 headers: {
//                     "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
//                     "HTTP-Referer": "http://localhost:3000/chatRoute/chat",
//                     "X-Title": "MyChatApp",
//                     "Content-Type": "application/json"
//                 }
//             }
//         );

//         res.json(response.data);
//     } catch (err) {
//         console.error("ERROR:", err.response?.data || err.message);
//         res.status(500).json({ error: err.response?.data || err.message });
//     }
// });


module.exports = route;