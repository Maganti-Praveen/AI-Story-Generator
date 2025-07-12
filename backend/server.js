const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

app.post("/generate", async (req, res) => {
  const { genre, keywords } = req.body;

const prompt = `Write a ${genre} story or blog using these keywords: "${keywords}". 
Make it culturally relevant and emotionally appealing to people from Andhra Pradesh. 
Include Telugu names, local references (like Vizag, Vijayawada, Tirupati, Araku, Guntur, etc.), family values, or settings that resonate with Andhra readers. 
Use clear language, a warm tone, and limit the output to around 300 words.`;

  const requestBody = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  try {
    const response = await axios.post(GEMINI_API_URL, requestBody, {
      headers: { "Content-Type": "application/json" }
    });

    const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    res.json({ result: content });
  } catch (error) {
    console.error("Error generating content:", error.message);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
