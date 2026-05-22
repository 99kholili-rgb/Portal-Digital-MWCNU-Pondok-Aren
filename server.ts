import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily to avoid crashing if API key is not yet set
let ai: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not defined in the environment.");
    }
    ai = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return ai;
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Tanya Kyai Endpoint
app.post("/api/ask-kyai", async (req, res) => {
  try {
    const { questions, history, kyaiName, kyaiTitle } = req.body;
    if (!questions || typeof questions !== "string") {
      return res.status(400).json({ error: "Pertanyaan wajib diisi." });
    }

    const gemini = getGeminiClient();
    
    // System instruction to guide the persona
    const personaPrompt = `Anda adalah ${kyaiName}, seorang Kyai / Ulama ${kyaiTitle} dari organisasi Nahdlatul Ulama. 
Anda harus menjawab pertanyaan dengan kebijaksanaan, keramahan, penuh empati, dan sopan santun khas ulama Nusantara (Ahlussunnah wal Jama'ah).
Gunakan bahasa Indonesia yang santun, menyelipkan sapaan akrab seperti "Ananda" atau "Saudaraku", dan mulailah dengan salam hangat serta akhiri dengan doa keselamatan.
Sajikan jawaban Anda secara mendalam berdasarkan rujukan fiqih murni Nahdliyin, namun tetap kontekstual dengan kehidupan modern. Jika topik berkaitan dengan syariah, sebutkan pandangan madzhab Syafi'i jika relevan. 
Harap buat struktur jawaban yang rapi dengan poin-poin yang mudah dipahami warga biasa. Jangan terlalu kaku, berikan nasihat spiritual yang menyejukkan hati.`;

    const modelToUse = "gemini-3.5-flash";
    
    // Format context mapping history
    const contextHistory = (history || []).map((h: { sender: string; text: string }) => {
      return {
        role: h.sender === "user" ? "user" : "model",
        parts: [{ text: h.text }]
      };
    });

    const response = await gemini.models.generateContent({
      model: modelToUse,
      contents: [
        ...contextHistory,
        { role: "user", parts: [{ text: questions }] }
      ],
      config: {
        systemInstruction: personaPrompt,
        temperature: 0.7,
      }
    });

    res.json({
      answer: response.text || "Mohon maaf Ananda, saya sedang merenung dan belum bisa menyusun untaian kata yang tepat saat ini. Silakan tanyakan kembali nanti.",
    });

  } catch (error: any) {
    console.error("Error asking Kyai:", error);
    res.status(500).json({
      error: "Gagal menghubungkan ke batin spiritual Kyai. Silakan coba beberapa saat lagi.",
      details: error.message
    });
  }
});

// Setup Vite / Multi-mode Serving
async function boot() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully listening on port ${PORT}`);
  });
}

boot();
