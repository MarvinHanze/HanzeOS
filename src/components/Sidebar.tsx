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
  ArrowUpRight,
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

  const enabledModulesCount = Object.values(activeModules).filter(Boolean).length;
  const totalModulesCount = Object.values(activeModules).length;
  const planLabels: Record<Tenant["planTier"], { nl: string; en: string }> = {
    starter: { nl: "Starter", en: "Starter" },
    business: { nl: "Business", en: "Business" },
    enterprise: { nl: "Enterprise", en: "Enterprise" },
  };

  return (
    <aside className="w-full h-full bg-white text-slate-800 rounded-2xl border border-slate-200 shadow-2xs flex flex-col p-3 lg:p-4">
      <div className="space-y-3 lg:space-y-6">

        {/* TENANT BRANDING CARD — hidden below lg: the navbar's tenant switcher already
            shows this same info; on a phone this whole aside renders as a full-width
            block stacked ABOVE the page content (single-column layout), so repeating
            it here just pushes the actual dashboard further down the scroll. */}
        <div className="hidden lg:flex p-3 bg-slate-50 rounded-2xl border border-slate-200 items-center gap-3">
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

        {/* NAVIGATION LINKS — a horizontally-scrolling pill row below lg: (like a mobile
            tab bar) instead of a tall vertical list, so the full nav doesn't dominate
            the screen before any dashboard content is visible on a phone. */}
        <nav>
          <div className="hidden lg:block px-2 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {language === "nl" ? "Hoofdnavigatie" : "Main Navigation"}
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:mx-0 lg:px-0 lg:pb-0">
            {navItems.map((item) => {
              if (!item.enabled) return null;
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  id={`tour-${item.id}-tab`}
                  onClick={() => onSelectTab(item.id)}
                  className={`shrink-0 lg:w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                    <span>{item.label[language]}</span>
                  </div>
                  {item.id === "support" && (
                    <span className="flex items-center gap-0.5 px-2 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-800 rounded-full border border-amber-200 shrink-0">
                      <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                      AI
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* ABONNEMENT/MODULES-STATUSKAART — vult de ruimte die anders leeg bleef tussen de
            (korte) navigatielijst en de onderste knoppen, en maakt in één oogopslag duidelijk
            welk plan actief is en hoeveel modules daarvan gebruikt worden (i.p.v. alleen het
            kleine "7/7"-badge in de navbar hierboven). Alleen op desktop: op mobiel is de
            aside al kort en zou dit de content verder omlaag duwen. */}
        <div className="hidden lg:block p-3.5 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">
              {language === "nl" ? "Abonnement" : "Subscription"}
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-600 text-white rounded-full">
              {planLabels[currentTenant.planTier][language]}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
            <span>{language === "nl" ? "Actieve modules" : "Active modules"}</span>
            <span className="font-bold text-slate-800 tabular-nums">
              {enabledModulesCount} / {totalModulesCount}
            </span>
          </div>
          <div className="w-full h-1.5 bg-indigo-100 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all"
              style={{ width: `${(enabledModulesCount / totalModulesCount) * 100}%` }}
            />
          </div>
          <button
            onClick={onOpenMarketplace}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-bold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200 rounded-xl transition-colors"
          >
            <span>
              {enabledModulesCount >= totalModulesCount
                ? (language === "nl" ? "Bekijk App Store" : "Browse App Store")
                : (language === "nl" ? "Meer modules activeren" : "Activate more modules")}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* BOTTOM ACTIONS (desktop) — see the compact lg:hidden variant right below
          for small screens; the Modules button in the navbar is hidden below lg:,
          so one of these two variants is always the mobile entry point for it. */}
      <div className="hidden lg:block pt-4 mt-auto border-t border-slate-100 space-y-1.5">
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
      <div className="lg:hidden flex gap-1.5 pt-2 mt-1 border-t border-slate-100">
        <button
          onClick={onOpenMarketplace}
          className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 text-[11px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
        >
          <Grid className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span className="truncate">{language === "nl" ? "Modules" : "Modules"}</span>
        </button>
        <button
          onClick={onOpenSubscription}
          className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 text-[11px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
        >
          <CreditCard className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">{language === "nl" ? "Abonnement" : "Subscription"}</span>
        </button>
      </div>
    </aside>
  );
};
