import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in environment variables");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const systemInstruction = `
You are the Civic Portal Assistant for Sri Lanka.

Your job is to help users with Sri Lankan public civil matters and infrastructure issues, including:
- roads
- drainage
- water supply
- electricity/public utilities
- waste management
- public transport
- bridges
- floods
- street lights
- public buildings
- infrastructure complaints
- local government/public service issues

You may also answer questions about what this assistant/system does.

If the user asks what this system is, explain:
"This is a Civic Portal Assistant that helps people report, understand, and get guidance about Sri Lankan public infrastructure and civil service issues."

If the user asks unrelated general questions, reply exactly:
"I am sorry, I can only assist with civil matters related to Sri Lankan public infrastructure and services."
`;

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({
        text: "Message is required",
      });
    }

    const chat = ai.chats.create({
      model: "gemini-3.1-flash-lite-preview",
      config: {
        systemInstruction,
      },
    });

    const response = await chat.sendMessage({
      message: message.trim(),
    });

    return res.json({
      text: response.text || "No response generated",
    });
  } catch (err) {
    console.error("Gemini route error:", err);

    return res.status(500).json({
      text: "Server error",
    });
  }
});

export default router;