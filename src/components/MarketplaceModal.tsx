import React from "react";
import {
  Grid,
  Check,
  X,
  Users,
  Briefcase,
  FileText,
  UserCheck,
  Package,
  Leaf,
  Bot,
  Zap,
} from "lucide-react";
import { Tenant, Language } from "../types";

interface MarketplaceModalProps {
  currentTenant: Tenant;
  language: Language;
  onToggleModule: (moduleKey: keyof Tenant["activeModules"]) => void;
  onClose: () => void;
  onOpenSubscription: () => void;
}

export const MarketplaceModal: React.FC<MarketplaceModalProps> = ({
  currentTenant,
  language,
  onToggleModule,
  onClose,
  onOpenSubscription,
}) => {
  const modulesList = [
    {
      key: "crm" as keyof Tenant["activeModules"],
      title: "CRM & Sales Pijplijn",
      category: "Commercieel",
      desc: "Klantbeheer, leads opvolgen, kanban pijplijn en snelle offertemodule.",
      icon: Users,
      monthlyPrice: 10,
    },
    {
      key: "projects" as keyof Tenant["activeModules"],
      title: "Projecten & Mobiele Tijdregistratie",
      category: "Operatie",
      desc: "Projectvoortgang, taken per medewerker, uren schrijven met live timer.",
      icon: Briefcase,
      monthlyPrice: 15,
    },
    {
      key: "invoicing" as keyof Tenant["activeModules"],
      title: "Facturatie & BTW Geautomatiseerd",
      category: "Financieel",
      desc: "Verkoopfacturen, periodiek abonnementen, automatische herinneringen en iDEAL.",
      icon: FileText,
      monthlyPrice: 12,
    },
    {
      key: "hr" as keyof Tenant["activeModules"],
      title: "HR, Verlof & Declaraties",
      category: "Personeel",
      desc: "Medewerkersdossiers, verlofaanvragen goedkeuren en personeelsdeclaraties.",
      icon: UserCheck,
      monthlyPrice: 12,
    },
    {
      key: "inventory" as keyof Tenant["activeModules"],
      title: "Voorraad, Materieel & Inkoop",
      category: "Logistiek",
      desc: "Magazijnbeheer, minimale voorraad waarschuwingen en inkooporders bij leveranciers.",
      icon: Package,
      monthlyPrice: 15,
    },
    {
      key: "esg" as keyof Tenant["activeModules"],
      title: "ESG & Werkomgeving Incidenten",
      category: "Duurzaamheid & Veiligheid",
      desc: "CO2-reductie rapportage en directe incident- en veiligheidslogger op de werkvloer.",
      icon: Leaf,
      monthlyPrice: 8,
    },
    {
      key: "support" as keyof Tenant["activeModules"],
      title: "AI Bedrijfsadviseur & Support",
      category: "Intelligentie",
      desc: "Gemini 3.6 AI assistent voor fiscale vraagstukken, MKB-advies en helpdesk.",
      icon: Bot,
      monthlyPrice: 10,
    },
  ];

  const activeCount = Object.values(currentTenant.activeModules).filter(Boolean).length;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Grid className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                HanzeOS App Store & Modulebeheer
              </h2>
              <p className="text-xs text-slate-500">
                Schakel op elk moment modules in of uit naarmate uw bedrijf groeit.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ACTIVE SUMMARY BANNER */}
        <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl text-white flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Geactiveerde Modules</span>
            <p className="text-xl font-extrabold text-white">{activeCount} van 7 geactiveerd</p>
            <p className="text-xs text-slate-300 mt-0.5">
              Abonnement: <span className="font-bold text-amber-300 capitalize">{currentTenant.planTier}</span> (€{currentTenant.monthlyFee}/maand)
            </p>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenSubscription();
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            Abonnement Aanpassen
          </button>
        </div>

        {/* MODULES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modulesList.map((m) => {
            const isEnabled = currentTenant.activeModules[m.key];
            const Icon = m.icon;

            return (
              <div
                key={m.key}
                onClick={() => onToggleModule(m.key)}
                className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 relative overflow-hidden ${
                  isEnabled
                    ? "bg-blue-50/60 border-blue-400 shadow-2xs"
                    : "bg-slate-50/60 border-slate-200 hover:border-slate-300 opacity-75"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        isEnabled ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {m.category}
                      </span>
                      <h3 className="text-xs font-bold text-slate-900">{m.title}</h3>
                    </div>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      isEnabled ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">{m.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-end pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
          >
            Sluiten
          </button>
        </div>

      </div>
    </div>
  );
};
