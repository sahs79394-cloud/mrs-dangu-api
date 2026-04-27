import express from "express";
import cors from "cors";
import multer from "multer";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import { MRS_DANGU_PERSONA } from "./persona.js";
import { landingHtml } from "./landing.js";

// ----- Provider setup (supports both Replit AI Integrations and direct API keys) -----

const openaiApiKey =
  process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
const openaiBaseUrl = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL; // undefined => default
const openaiModel = process.env.OPENAI_MODEL || "gpt-4o";

const geminiApiKey =
  process.env.AI_INTEGRATIONS_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const geminiBaseUrl = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL; // undefined => default
const geminiModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const openai = openaiApiKey
  ? new OpenAI({ apiKey: openaiApiKey, baseURL: openaiBaseUrl })
  : null;

const gemini = geminiApiKey
  ? new GoogleGenAI({
      apiKey: geminiApiKey,
      ...(geminiBaseUrl
        ? { httpOptions: { apiVersion: "", baseUrl: geminiBaseUrl } }
        : {}),
    })
  : null;

// ----- Express app -----

const app = express();
app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

function pickModel(value) {
  const v = String(value ?? "openai").toLowerCase();
  if (v === "gemini" || v === "google" || v === "gemini-3-flash") return "gemini";
  return "openai";
}

async function askOpenAI(message, image) {
  if (!openai) {
    throw new Error(
      "OpenAI not configured. Set OPENAI_API_KEY (or AI_INTEGRATIONS_OPENAI_API_KEY) env var.",
    );
  }
  const userContent = [{ type: "text", text: message }];
  if (image) {
    userContent.push({
      type: "image_url",
      image_url: { url: `data:${image.mimeType};base64,${image.data}` },
    });
  }
  const response = await openai.chat.completions.create({
    model: openaiModel,
    max_completion_tokens: 8192,
    messages: [
      { role: "system", content: MRS_DANGU_PERSONA },
      { role: "user", content: userContent },
    ],
  });
  return response.choices[0]?.message?.content?.trim() ?? "";
}

async function askGemini(message, image) {
  if (!gemini) {
    throw new Error(
      "Gemini not configured. Set GEMINI_API_KEY (or AI_INTEGRATIONS_GEMINI_API_KEY) env var.",
    );
  }
  const parts = [{ text: message }];
  if (image) {
    parts.push({
      inlineData: { data: image.data, mimeType: image.mimeType },
    });
  }
  const response = await gemini.models.generateContent({
    model: geminiModel,
    contents: [{ role: "user", parts }],
    config: {
      systemInstruction: MRS_DANGU_PERSONA,
      maxOutputTokens: 8192,
    },
  });
  return response.text?.trim() ?? "";
}

// ----- Routes -----

app.get("/", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(landingHtml);
});

app.get("/healthz", (_req, res) => res.json({ status: "ok" }));

app.get("/about", (_req, res) => {
  res.json({
    ai: "Mrs. Dangu",
    inventor: "Mr. Suraj Sir",
    description:
      "Mrs. Dangu ek pyaari AI assistant hai jo OpenAI ChatGPT aur Gemini dono models ka use karti hai. Koi bhi language me baat kar sakti hai aur photos bhi samajh sakti hai. 💖",
    models: ["openai", "gemini"],
    capabilities: ["text chat", "image understanding", "multilingual"],
    configured: {
      openai: !!openai,
      gemini: !!gemini,
    },
  });
});

app.post("/chat", upload.single("image"), async (req, res) => {
  try {
    const message = String(req.body?.message ?? "").trim();
    const model = pickModel(req.body?.model);

    if (!message && !req.file && !req.body?.image) {
      return res.status(400).json({
        error: "message ya image dono me se kuch toh do please 🙏",
      });
    }

    let image = null;
    if (req.file) {
      image = {
        data: req.file.buffer.toString("base64"),
        mimeType: req.file.mimetype || "image/png",
      };
    } else if (typeof req.body?.image === "string" && req.body.image.length > 0) {
      const raw = req.body.image;
      const m = raw.match(/^data:(.+?);base64,(.+)$/);
      if (m) {
        image = { mimeType: m[1], data: m[2] };
      } else {
        image = { mimeType: req.body?.imageMimeType || "image/png", data: raw };
      }
    }

    const promptText =
      message || "Is image me kya dikh raha hai? Pyaar se detail me batao.";

    const reply =
      model === "gemini"
        ? await askGemini(promptText, image)
        : await askOpenAI(promptText, image);

    res.json({
      ai: "Mrs. Dangu",
      inventor: "Mr. Suraj Sir",
      model,
      reply,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "kuch gadbad ho gayi";
    console.error("chat error:", msg);
    res.status(500).json({
      error: "Maaf karna, abhi thoda problem aa gayi 🙏",
      detail: msg,
    });
  }
});

// Backward-compat: also accept /api/* paths so the same client code
// works whether deployed at root (Railway) or behind /api (Replit).
app.use("/api", (req, _res, next) => {
  req.url = req.url || "/";
  next();
});
app.get("/api/", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(landingHtml);
});
app.get("/api/healthz", (_req, res) => res.json({ status: "ok" }));
app.get("/api/about", (_req, res) => res.redirect("/about"));
app.post("/api/chat", upload.single("image"), (req, res, next) => {
  req.url = "/chat";
  app._router.handle(req, res, next);
});

// ----- Start -----

const port = Number(process.env.PORT || 8080);
app.listen(port, () => {
  console.log(`💖 Mrs. Dangu API listening on port ${port}`);
  console.log(`   OpenAI: ${openai ? "ready" : "NOT configured (set OPENAI_API_KEY)"}`);
  console.log(`   Gemini: ${gemini ? "ready" : "NOT configured (set GEMINI_API_KEY)"}`);
});
