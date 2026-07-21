import React from "react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  UserCheck,
  Package,
  Leaf,
  Bot,
  Grid,
  CreditCard,
  Settings,
  Sparkles,
} from "lucide-react";
import { Tenant, Language } from "../types";

export type ActiveTab =
  | "dashboard"
  | "crm"
  | "projects"
  | "invoicing"
  | "hr"
  | "inventory"
  | "esg"
  | "support";

interface SidebarProps {
  currentTenant: Tenant;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  language: Language;
  onOpenMarketplace: () => void;
  onOpenSubscription: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTenant,
  activeTab,
  onSelectTab,
  language,
  onOpenMarketplace,
  onOpenSubscription,
}) => {
  const { activeModules } = currentTenant;

  const navItems = [
    {
      id: "dashboard" as ActiveTab,
      label: { nl: "Dashboard", en: "Dashboard" },
      icon: LayoutDashboard,
      enabled: true,
    },
    {
      id: "crm" as ActiveTab,
      label: { nl: "CRM & Offertes", en: "CRM & Quotes" },
      icon: Users,
      enabled: activeModules.crm,
    },
    {
      id: "projects" as ActiveTab,
      label: { nl: "Projecten & Uren", en: "Projects & Hours" },
      icon: Briefcase,
      enabled: activeModules.projects,
    },
    {
      id: "invoicing" as ActiveTab,
      label: { nl: "Facturatie & BTW", en: "Invoicing & VAT" },
      icon: FileText,
      enabled: activeModules.invoicing,
    },
    {
      id: "hr" as ActiveTab,
      label: { nl: "HR & Personeel", en: "HR & Staff" },
      icon: UserCheck,
      enabled: activeModules.hr,
    },
    {
      id: "inventory" as ActiveTab,
      label: { nl: "Voorraad & Assets", en: "Inventory & Assets" },
      icon: Package,
      enabled: activeModules.inventory,
    },
    {
      id: "esg" as ActiveTab,
      label: { nl: "ESG & Incidenten", en: "ESG & Safety" },
      icon: Leaf,
      enabled: activeModules.esg,
    },
    {
      id: "support" as ActiveTab,
      label: { nl: "Support & AI Advisor", en: "Support & AI Advisor" },
      icon: Bot,
      enabled: activeModules.support,
    },
  ];

  return (
    <aside className="w-full h-full bg-white text-slate-800 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between p-4">
      <div className="space-y-6">
        
        {/* TENANT BRANDING CARD */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-xs flex-shrink-0 bg-indigo-600"
          >
            {currentTenant.name.charAt(0)}
          </div>
          <div className="truncate">
            <h2 className="text-xs font-bold text-slate-900 truncate">{currentTenant.name}</h2>
            <p className="text-[10px] text-slate-500 font-medium truncate">{currentTenant.industry}</p>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="space-y-1">
          <div className="px-2 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {language === "nl" ? "Hoofdnavigatie" : "Main Navigation"}
          </div>

          {navItems.map((item) => {
            if (!item.enabled) return null;
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`tour-${item.id}-tab`}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                  <span className="truncate">{item.label[language]}</span>
                </div>
                {item.id === "support" && (
                  <span className="flex items-center gap-0.5 px-2 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-800 rounded-full border border-amber-200">
                    <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM ACTIONS */}
      <div className="pt-4 border-t border-slate-100 space-y-1.5">
        <button
          onClick={onOpenMarketplace}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
        >
          <Grid className="w-4 h-4 text-indigo-600" />
          <span>{language === "nl" ? "App Store & Modules" : "App Store & Modules"}</span>
        </button>

        <button
          onClick={onOpenSubscription}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
        >
          <CreditCard className="w-4 h-4 text-emerald-600" />
          <span>{language === "nl" ? "Abonnement & Billing" : "Subscription & Billing"}</span>
        </button>
      </div>
    </aside>
  );
};
