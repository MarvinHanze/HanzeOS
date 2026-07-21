import React, { useState } from "react";
import {
  Bot,
  Send,
  HelpCircle,
  Sparkles,
  BookOpen,
  CheckCircle,
  RefreshCw,
  User,
  Lightbulb,
} from "lucide-react";
import { Tenant, ChatMessage, Language } from "../types";

interface AiSupportViewProps {
  currentTenant: Tenant;
  language: Language;
}

export const AiSupportView: React.FC<AiSupportViewProps> = ({ currentTenant, language }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "assistant",
      text: `Hallo! Ik ben de HanzeOS AI Bedrijfsadviseur voor ${currentTenant.name}. Hoe kan ik u vandaag helpen met uw facturatie, BTW, offertes, projecten of MKB wetgeving?`,
      timestamp: "10:00",
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sampleQuestions = [
    "Hoe werkt BTW-verlegging bij bouw- en installatieprojecten?",
    "Hoe stel ik een juridisch geldige offerte op volgens de KvK?",
    "Welke modules zijn het meest geschikt voor een ZZP'er in de IT?",
    "Hoe bereken ik de nacalculatie op een bouwproject?",
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = textToSend || inputPrompt;
    if (!prompt.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt,
          companyContext: currentTenant,
          lang: language,
          history: messages.map((m) => ({ role: m.sender, text: m.text })),
        }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "assistant",
        text: data.reply || "Excuses, ik kon momenteel geen antwoord genereren.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: "assistant",
        text: "Geen verbinding met de Gemini AI service. Controleer uw internetverbinding.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="tour-ai-chat-box" className="space-y-6">
      
      {/* HEADER */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {language === "nl" ? "Support Portal & AI Bedrijfsadviseur" : "Support Portal & AI Advisor"}
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Geïntegreerde kennisbank en 24/7 AI-assistent voor fiscale vraagstukken, offertes en MKB-procesadvies.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-50 border border-amber-200/80 rounded-xl text-xs font-bold text-amber-800">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Aangedreven door Gemini 3.6 Flash</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT 2 COLS: CHAT INTERFACE */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col h-[600px] overflow-hidden">
          
          {/* CHAT HEADER */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                H
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">HanzeOS AI Advisor</h3>
                <p className="text-[11px] text-slate-400">Status: Online • Context: {currentTenant.name}</p>
              </div>
            </div>
            <span className="px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-300 font-bold rounded-full">
              Actief
            </span>
          </div>

          {/* CHAT MESSAGES STREAM */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/60">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 max-w-[85%] ${m.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    m.sender === "user" ? "bg-slate-800 text-white" : "bg-blue-600 text-white"
                  }`}
                >
                  {m.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed space-y-1 ${
                    m.sender === "user"
                      ? "bg-slate-900 text-white rounded-tr-none"
                      : "bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-tl-none whitespace-pre-line"
                  }`}
                >
                  <p>{m.text}</p>
                  <span className={`text-[9px] block text-right mt-1 ${m.sender === "user" ? "text-slate-400" : "text-slate-400"}`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 w-48 text-xs text-slate-500 shadow-2xs">
                <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                <span>AI formuleert antwoord...</span>
              </div>
            )}
          </div>

          {/* CHAT INPUT FORM */}
          <div className="p-3 bg-white border-t border-slate-200 space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Stel een vraag over facturen, BTW, offertes of MKB processen..."
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 px-4 py-2 bg-slate-50 text-xs text-slate-800 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Verstuur</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COL: SUGGESTED PROMPTS & KNOWLEDGE BASE */}
        <div className="space-y-4">
          
          {/* SUGGESTED PROMPTS */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Veelgestelde MKB Vragen
            </h3>

            <div className="space-y-2">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="w-full text-left p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl text-xs text-slate-700 font-medium transition-all"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>

          {/* KNOWLEDGE BASE CARD */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Kennisbank Artikelen
            </h3>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <p className="font-bold text-slate-900">Handleiding E-Facturatie (UBL/NLCIUS)</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Hoe te voldoen aan de verplichte e-invoicing standaard voor de overheid.</p>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <p className="font-bold text-slate-900">NEN3140 & NEN1010 Veiligheidsnormen</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Veiligheidsvoorschriften voor bouw- en installatiebedrijven.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
