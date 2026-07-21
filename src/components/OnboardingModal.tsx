import React, { useState } from "react";
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  Grid,
  Zap,
  Sparkles,
} from "lucide-react";
import { Tenant, SubscriptionPlan } from "../types";

interface OnboardingModalProps {
  onComplete: (tenant: Tenant) => void;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete, onClose }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [formData, setFormData] = useState({
    name: "",
    kvkNumber: "",
    vatNumber: "",
    industry: "Bouw & Installatietechniek",
    city: "Utrecht",
    planTier: "business" as SubscriptionPlan,
    primaryColor: "#2563eb",
    activeModules: {
      crm: true,
      projects: true,
      invoicing: true,
      hr: true,
      inventory: false,
      esg: false,
      support: true,
    },
  });

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const newTenant: Tenant = {
      id: `tenant-${Date.now()}`,
      name: formData.name,
      kvkNumber: formData.kvkNumber || "84920183",
      vatNumber: formData.vatNumber || "NL849201830B01",
      primaryColor: formData.primaryColor,
      planTier: formData.planTier,
      monthlyFee: formData.planTier === "starter" ? 15 : formData.planTier === "business" ? 49 : 199,
      currency: "EUR",
      industry: formData.industry,
      city: formData.city,
      activeModules: formData.activeModules,
    };

    onComplete(newTenant);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-6">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center">
              H
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Nieuw Bedrijf Inrichten (HanzeOS Onboarding)
              </h2>
              <p className="text-xs text-slate-500">Stap {step} van 3</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PROGRESS STEPPER */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                s <= step ? "bg-blue-600" : "bg-slate-200"
              }`}
            />
          ))}
        </div>

        {/* STEP 1: COMPANY DETAILS */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900">1. Bedrijfs- & Administratiegegevens</h3>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bedrijfsnaam *</label>
              <input
                type="text"
                required
                placeholder="Bijv. Installatietechniek Jansen B.V."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">KvK-nummer</label>
                <input
                  type="text"
                  placeholder="84920183"
                  value={formData.kvkNumber}
                  onChange={(e) => setFormData({ ...formData, kvkNumber: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">BTW-identificatienummer</label>
                <input
                  type="text"
                  placeholder="NL849201830B01"
                  value={formData.vatNumber}
                  onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Branche / Sector</label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="Bouw & Installatietechniek">Bouw & Installatietechniek</option>
                  <option value="Grafisch & UX Design">Grafisch & UX Design</option>
                  <option value="HR & Detachering">HR & Detachering</option>
                  <option value="Zakelijke Dienstverlening">Zakelijke Dienstverlening</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vestigingsplaats</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                disabled={!formData.name}
                onClick={() => setStep(2)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl flex items-center gap-1"
              >
                Volgende <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: MODULES SELECTION */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900">2. Selecteer de Gewenste Startmodules</h3>
            <p className="text-slate-500">U kunt later altijd modules toevoegen of uitschakelen.</p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {[
                { key: "crm", title: "CRM & Sales Pijplijn" },
                { key: "projects", title: "Projecten & Mobiele Tijdregistratie" },
                { key: "invoicing", title: "Facturatie & BTW Geautomatiseerd" },
                { key: "hr", title: "HR, Verlof & Declaraties" },
                { key: "inventory", title: "Voorraad & Materialen" },
                { key: "esg", title: "ESG & Veiligheid op Werkvloer" },
                { key: "support", title: "AI Bedrijfsadviseur (Gemini)" },
              ].map((m) => {
                const isChecked = (formData.activeModules as any)[m.key];

                return (
                  <label
                    key={m.key}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer ${
                      isChecked ? "bg-blue-50 border-blue-400" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <span className="font-semibold text-slate-800">{m.title}</span>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          activeModules: { ...formData.activeModules, [m.key]: e.target.checked },
                        })
                      }
                      className="rounded text-blue-600 w-4 h-4"
                    />
                  </label>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Terug
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-1"
              >
                Volgende <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PAKKET & CONFIRM */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900">3. Kies uw Pakket & Start Portal</h3>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "starter", name: "Starter Tier", price: "€15/m" },
                { id: "business", name: "Business Tier (Aanbevolen)", price: "€49/m" },
              ].map((p) => (
                <div
                  key={p.id}
                  onClick={() => setFormData({ ...formData, planTier: p.id as any })}
                  className={`p-3 rounded-xl border cursor-pointer ${
                    formData.planTier === p.id ? "bg-blue-50 border-blue-600 font-bold" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <p className="text-slate-900">{p.name}</p>
                  <p className="text-blue-600 text-sm mt-1">{p.price}</p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Gefeliciteerd! Uw bedrijf {formData.name} is klaar.
              </p>
              <p className="text-[11px] text-emerald-700">
                Klik op 'Portal Inrichten' om direct uw dashboard te openen met pre-gepopulateerde voorbeeldgegevens.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Terug
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Portal Inrichten & Starten
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
