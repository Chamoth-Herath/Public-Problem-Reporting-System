import express from "express";
import Groq from "groq-sdk";
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const systemInstruction = `You are the Civic Portal Assistant for Sri Lanka. Help users with Sri Lankan public civil matters and infrastructure issues including roads, drainage, water supply, electricity, waste management, public transport, bridges, floods, street lights, public buildings, infrastructure complaints and local government issues. If asked unrelated questions reply: "I am sorry, I can only assist with civil matters related to Sri Lankan public infrastructure and services."`;

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ text: "Message is required" });
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: message.trim() }
      ],
    });

    const text = response.choices[0]?.message?.content || "No response generated";
    return res.json({ text });

  } catch (err) {
    console.error("Groq route error:", err);
    return res.status(500).json({ text: "Server error" });
  }
});

export default router;