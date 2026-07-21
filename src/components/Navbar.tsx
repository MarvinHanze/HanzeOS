import React, { useState } from "react";
import {
  Building2,
  ChevronDown,
  Globe,
  Bell,
  Search,
  Grid,
  Shield,
  Plus,
  Check,
  Zap,
  Sparkles,
} from "lucide-react";
import { Tenant, UserRole, Language } from "../types";

interface NavbarProps {
  tenants: Tenant[];
  currentTenant: Tenant;
  onSelectTenant: (tenant: Tenant) => void;
  onOpenNewTenantModal: () => void;
  userRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  onOpenMarketplace: () => void;
  onOpenSubscription: () => void;
  onOpenTour?: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  tenants,
  currentTenant,
  onSelectTenant,
  onOpenNewTenantModal,
  userRole,
  onChangeRole,
  language,
  onChangeLanguage,
  onOpenMarketplace,
  onOpenSubscription,
  onOpenTour,
  searchTerm,
  onSearchChange,
}) => {
  const [showTenantDropdown, setShowTenantDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  const roleLabels: Record<UserRole, { nl: string; en: string }> = {
    owner: { nl: "Eigenaar / Admin", en: "Owner / Admin" },
    project_manager: { nl: "Projectmanager", en: "Project Manager" },
    finance: { nl: "Financieel Medewerker", en: "Finance Officer" },
    employee: { nl: "Medewerker", en: "Employee" },
  };

  const enabledModulesCount = Object.values(currentTenant.activeModules).filter(Boolean).length;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* LOGO & TENANT SWITCHER */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={onOpenSubscription}>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-xs transition-transform hover:scale-105"
                style={{ backgroundColor: currentTenant.primaryColor || '#4f46e5' }}
              >
                H
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-slate-800 tracking-tight">
                  Hanze<span className="text-indigo-600">OS</span>
                </span>
                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-slate-600 bg-slate-100 rounded-md border border-slate-200 uppercase">
                  MKB
                </span>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            {/* TENANT SELECTOR DROPDOWN */}
            <div className="relative" id="tour-tenant-select">
              <button
                onClick={() => setShowTenantDropdown(!showTenantDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-colors"
              >
                <Building2 className="w-4 h-4 text-slate-500" />
                <span className="max-w-[130px] sm:max-w-[180px] truncate">{currentTenant.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showTenantDropdown && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {language === "nl" ? "Selecteer Bedrijf" : "Select Company"}
                  </div>
                  {tenants.map((tenant) => (
                    <button
                      key={tenant.id}
                      onClick={() => {
                        onSelectTenant(tenant);
                        setShowTenantDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left hover:bg-slate-50 transition-colors ${
                        tenant.id === currentTenant.id ? "bg-indigo-50 font-bold text-indigo-700" : "text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: tenant.primaryColor }}
                        />
                        <span className="truncate">{tenant.name}</span>
                      </div>
                      {tenant.id === currentTenant.id && <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />}
                    </button>
                  ))}
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    onClick={() => {
                      setShowTenantDropdown(false);
                      onOpenNewTenantModal();
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-indigo-600 font-bold hover:bg-indigo-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    {language === "nl" ? "Nieuw Bedrijf Toevoegen" : "Add New Company"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={
                  language === "nl"
                    ? "Zoek in klanten, projecten, facturen..."
                    : "Search clients, projects, invoices..."
                }
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-slate-100 focus:bg-white text-slate-800 text-sm rounded-full border border-transparent focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/20 focus:outline-hidden transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* RIGHT ACTION CONTROLS */}
          <div className="flex items-center gap-2">
            
            {/* INTERACTIVE TOUR BUTTON */}
            {onOpenTour && (
              <button
                id="tour-tour-btn"
                onClick={onOpenTour}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors shadow-2xs"
                title="Start Interactieve Tour"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">{language === "nl" ? "Tour" : "Tour"}</span>
              </button>
            )}

            {/* MARKETPLACE / APP STORE BUTTON */}
            <button
              id="tour-modules-btn"
              onClick={onOpenMarketplace}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200"
              title="Modules & Apps Beheren"
            >
              <Grid className="w-3.5 h-3.5 text-indigo-600" />
              <span>{language === "nl" ? "Modules" : "Modules"}</span>
              <span className="ml-0.5 px-1.5 py-0.2 text-[10px] bg-indigo-600 text-white font-bold rounded-full">
                {enabledModulesCount}/7
              </span>
            </button>

            {/* ROLE SWITCHER FOR DEMO (RBAC) */}
            <div className="relative" id="tour-role-select">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
                title="Wissel Gebruikersrol (Demo RBAC)"
              >
                <Shield className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">{roleLabels[userRole][language]}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-3.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {language === "nl" ? "Test Gebruikersrol" : "Test User Role"}
                  </div>
                  {(["owner", "project_manager", "finance", "employee"] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        onChangeRole(r);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-1.5 text-xs text-left hover:bg-slate-50 ${
                        r === userRole ? "font-bold text-indigo-600 bg-indigo-50" : "text-slate-700"
                      }`}
                    >
                      <span>{roleLabels[r][language]}</span>
                      {r === userRole && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* LANGUAGE TOGGLE */}
            <button
              onClick={() => onChangeLanguage(language === "nl" ? "en" : "nl")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
              title="Wissel Taal"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span className="uppercase">{language}</span>
            </button>

            {/* NOTIFICATIONS */}
            <div className="relative">
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl relative transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white" />
              </button>

              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800">
                      {language === "nl" ? "Meldingen" : "Notifications"}
                    </span>
                    <span className="text-[11px] text-indigo-600 cursor-pointer font-bold hover:underline">
                      {language === "nl" ? "Alles gelezen" : "Mark all read"}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="p-2.5 bg-indigo-50/70 rounded-xl border border-indigo-100">
                      <p className="font-bold text-slate-900">Offerte goedgekeurd</p>
                      <p className="text-slate-600 mt-0.5">Anouk van der Meer heeft OFF-2026-090 geaccepteerd (€12.400).</p>
                      <span className="text-[10px] text-slate-400 mt-1 block font-medium">10 minuten geleden</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="font-bold text-slate-900">Betalingsherinnering vereist</p>
                      <p className="text-slate-600 mt-0.5">Factuur FACT-2026-0422 is 4 dagen verlopen.</p>
                      <span className="text-[10px] text-slate-400 mt-1 block font-medium">2 uur geleden</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SUBSCRIPTION TIER BADGE */}
            <button
              id="tour-subscription-btn"
              onClick={onOpenSubscription}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all uppercase tracking-wider"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span className="capitalize">{currentTenant.planTier}</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
