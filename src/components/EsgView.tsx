import React, { useState } from "react";
import {
  Leaf,
  ShieldAlert,
  Plus,
  TreePine,
  FileCheck,
  Zap,
  CheckCircle2,
  X,
} from "lucide-react";
import { CarbonMetric, SafetyIncident, Language } from "../types";

interface EsgViewProps {
  carbonMetrics: CarbonMetric[];
  incidents: SafetyIncident[];
  language: Language;
  onAddIncident: (incident: Omit<SafetyIncident, "id">) => void;
}

export const EsgView: React.FC<EsgViewProps> = ({
  carbonMetrics,
  incidents,
  language,
  onAddIncident,
}) => {
  const [showIncidentModal, setShowIncidentModal] = useState(false);

  const [newIncident, setNewIncident] = useState({
    date: new Date().toISOString().split("T")[0],
    location: "Utrecht Bouwlocatie 2",
    severity: "Middel" as "Laag" | "Middel" | "Hoog",
    description: "",
    actionTaken: "",
    status: "Gemeld" as "Gemeld" | "In onderzoek" | "Afgehandeld",
  });

  const latestCarbon = carbonMetrics[carbonMetrics.length - 1] || {
    co2EmissionsKg: 1280,
    paperSavedPages: 4850,
    energyKwh: 2450,
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncident.description) return;
    onAddIncident(newIncident);
    setShowIncidentModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {language === "nl" ? "ESG & Veiligheid op de Werkvloer" : "ESG & Workplace Safety"}
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Duurzaamheidsrapportages (CO2 reductie) en directe incidentregistratie op bouw- en werkvloeren.
          </p>
        </div>

        <button
          onClick={() => setShowIncidentModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" />
          {language === "nl" ? "Incident Melden" : "Report Incident"}
        </button>
      </div>

      {/* ESG METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase">CO2-Uitstoot Reductie</span>
            <TreePine className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-950 mt-2">
            -{latestCarbon.co2EmissionsKg} kg CO2
          </p>
          <p className="text-xs text-emerald-700 mt-1">18.4% lager dan branchegemiddelde</p>
        </div>

        <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-800 uppercase">Papierloos Bespaard</span>
            <FileCheck className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-blue-950 mt-2">
            {latestCarbon.paperSavedPages.toLocaleString("nl-NL")} vel
          </p>
          <p className="text-xs text-blue-700 mt-1">Door 100% e-facturatie & digitale offertes</p>
        </div>

        <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase">Geregistreerde Incidenten</span>
            <ShieldAlert className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-amber-950 mt-2">
            {incidents.length} incidenten
          </p>
          <p className="text-xs text-amber-700 mt-1">Alle veiligheidsmaatregelen NEN3140 toegepast</p>
        </div>
      </div>

      {/* INCIDENTS TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900">Veiligheidsincidenten & Werkplekinspecties</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <th className="p-3">Datum</th>
                <th className="p-3">Locatie</th>
                <th className="p-3">Ernst</th>
                <th className="p-3">Omschrijving</th>
                <th className="p-3">Genomen Actie</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {incidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-50">
                  <td className="p-3 font-medium text-slate-900">{inc.date}</td>
                  <td className="p-3 font-semibold text-slate-800">{inc.location}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        inc.severity === "Hoog"
                          ? "bg-rose-100 text-rose-800"
                          : inc.severity === "Middel"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {inc.severity}
                    </span>
                  </td>
                  <td className="p-3">{inc.description}</td>
                  <td className="p-3 text-slate-600">{inc.actionTaken}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-full text-[10px]">
                      {inc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: REPORT INCIDENT */}
      {showIncidentModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Incident of Veiligheidsrisico Melden</h3>
              <button onClick={() => setShowIncidentModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Locatie / Project *</label>
                <input
                  type="text"
                  required
                  value={newIncident.location}
                  onChange={(e) => setNewIncident({ ...newIncident, location: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Datum</label>
                  <input
                    type="date"
                    value={newIncident.date}
                    onChange={(e) => setNewIncident({ ...newIncident, date: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ernst van Incident</label>
                  <select
                    value={newIncident.severity}
                    onChange={(e) => setNewIncident({ ...newIncident, severity: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="Laag">Laag Risico</option>
                    <option value="Middel">Middelmatig Risico</option>
                    <option value="Hoog">Hoog Risico (Noodgeval)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Omschrijving Incident *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Wat is er precies gebeurd op de werkvloer?"
                  value={newIncident.description}
                  onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Direct Genomen Actie</label>
                <textarea
                  rows={2}
                  placeholder="Welke veiligheidsmaatregel is direct genomen?"
                  value={newIncident.actionTaken}
                  onChange={(e) => setNewIncident({ ...newIncident, actionTaken: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowIncidentModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold"
                >
                  Incident Melden
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
