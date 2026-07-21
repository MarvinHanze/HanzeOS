import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI client lazy/safely
  const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // API Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "HanzeOS" });
  });

  // AI Assistant Chat Route for Dutch MKB Advice & System Help
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, history, companyContext, lang } = req.body;
      const ai = getGenAI();

      const systemInstruction = `
Je bent 'HanzeOS Assistent', de virtuele MKB- en ZZP-bedrijfsadviseur voor het HanzeOS platform.
Taal: ${lang === "en" ? "English" : "Nederlands"}.
Je helpt Nederlandse MKB-ondernemers, ZZP'ers, bouwbedrijven, detacheerders en dienstverleners.
Je hebt diepgaande kennis van:
- BTW-tarieven (21%, 9%, 0%, verleggingsregeling), KvK-registratie, en e-facturatie (UBL/NLCIUS).
- Offertes opmaken, betalingsherinneringen en debiteurenbeheer.
- Projectplanning, urenregistratie en nacalculatie.
- HR, verlofaanvragen, declaraties en arbeidsvoorwaarden.
- Voorraadbeheer en ESG/duurzaamheidsrapportages voor MKB.

Huidige Bedrijfscontext:
- Bedrijfsnaam: ${companyContext?.name || "Onbekend B.V."}
- Branche: ${companyContext?.industry || "Algemeen MKB"}
- Plan: ${companyContext?.plan || "Business"}

Geef altijd een professioneel, praktisch en vriendelijk antwoord. Gebruik duidelijke opmaak met opsommingen waar nuttig.
      `.trim();

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: [
          { role: "user", parts: [{ text: systemInstruction }] },
          ...(history || []).map((h: { role: string; text: string }) => ({
            role: h.role === "assistant" ? "model" : "user",
            parts: [{ text: h.text }],
          })),
          { role: "user", parts: [{ text: message }] },
        ],
      });

      res.json({ reply: response.text || "Exposanten antwoord niet beschikbaar." });
    } catch (error: any) {
      console.error("Gemini AI Chat Error:", error);
      res.status(500).json({
        error: error.message || "Er is een fout opgetreden bij het verwerken van uw AI-vraag.",
      });
    }
  });

  // AI Invoice & Quote Text Generator Endpoint
  app.post("/api/ai/invoice-assist", async (req, res) => {
    try {
      const { promptText, type } = req.body;
      const ai = getGenAI();

      const prompt = type === "reminder"
        ? `Schrijf een vriendelijke maar dringende betalingsherinnering (1e of 2e aanmaning) voor een factuur. Details van de gebruiker: ${promptText}. Geeft tekst terug in een professionele toon met [Factuurnummer], [Bedrag] en [Vervaldatum] placeholders of ingevuld.`
        : `Genereer een professionele omschrijving en opbouw van factuur- of offerteregels voor het volgende werk: "${promptText}". Geef 3-4 duidelijke posten met geschatte uren/eenheden en adviesprijzen in EUR ex BTW.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      res.json({ result: response.text });
    } catch (error: any) {
      console.error("Gemini AI Invoice Assist Error:", error);
      res.status(500).json({ error: error.message || "AI assistent kon niet worden ingeschakeld." });
    }
  });

  // Vite middleware setup for dev / static serving for prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`HanzeOS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
