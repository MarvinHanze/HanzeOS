import React, { useState, useEffect } from "react";
import {
  Euro,
  FileText,
  Briefcase,
  Clock,
  TrendingUp,
  ArrowUpRight,
  Plus,
  AlertCircle,
  CheckCircle2,
  Users,
  Activity,
  Zap,
  RefreshCw,
  Send,
  UserCheck,
  Calendar,
  Sparkles,
  PieChart as PieChartIcon,
  LineChart,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { Tenant, Invoice, Project, TimeEntry, CRMContact, Language, ActivityItem } from "../types";

interface DashboardViewProps {
  currentTenant: Tenant;
  invoices?: Invoice[];
  projects?: Project[];
  timeEntries?: TimeEntry[];
  contacts?: CRMContact[];
  deals?: CRMContact[];
  activities?: ActivityItem[];
  language: Language;
  onNavigateTo?: (tab: string) => void;
  onNavigate?: (tab: string) => void;
  onOpenNewInvoice?: () => void;
  onOpenNewQuote?: () => void;
  onOpenNewTimeEntry?: () => void;
  onOpenNewContact?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentTenant,
  invoices = [],
  projects = [],
  timeEntries = [],
  contacts = [],
  deals = [],
  activities = [],
  language,
  onNavigateTo,
  onNavigate,
  onOpenNewInvoice = () => {},
  onOpenNewQuote = () => {},
  onOpenNewTimeEntry = () => {},
  onOpenNewContact = () => {},
}) => {
  const [isLiveAutoUpdate, setIsLiveAutoUpdate] = useState(true);
  const [livePulseTick, setLivePulseTick] = useState(0);
  const [timeFilter, setTimeFilter] = useState<"30d" | "quarter" | "ytd">("30d");
  const [revenueMetricMode, setRevenueMetricMode] = useState<"current" | "projected">("current");
  const [lastEventToast, setLastEventToast] = useState<string | null>(null);

  const handleNav = (tab: string) => {
    if (onNavigateTo) onNavigateTo(tab);
    else if (onNavigate) onNavigate(tab);
  };

  const contactList = contacts.length ? contacts : deals;

  // Real-time automatic updates interval simulation (10 seconds)
  useEffect(() => {
    if (!isLiveAutoUpdate) return;

    const interval = setInterval(() => {
      setLivePulseTick((prev) => prev + 1);
      const events = [
        "Nieuwe lead binnengekomen: De Vries B.V. (€14.500)",
        "Urenregistratie bijgewerkt: 4.5u geschreven op Project Warmtepomp",
        "Factuur FACT-2026-0421 automatisch gemarkeerd als Herinnerd",
        "Project Rendement Zonnepanelen bereikt 78% voortgang",
      ];
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      setLastEventToast(randomEvent);

      setTimeout(() => {
        setLastEventToast(null);
      }, 4500);
    }, 10000);

    return () => clearInterval(interval);
  }, [isLiveAutoUpdate]);

  // Calculations
  const totalRevenue = (invoices || [])
    .filter((i) => i.status === "betaald")
    .reduce((acc, i) => acc + (i.totalAmount || 0), 0);

  const projectedRevenue = Math.round((totalRevenue || 148800) * 1.28);

  const pendingInvoices = (invoices || []).filter((i) => i.status !== "betaald");
  const pendingAmount = pendingInvoices.reduce((acc, i) => acc + (i.totalAmount || 0), 0);

  // Aging Bucket calculation for open invoices
  const agingCurrent = Math.round(pendingAmount * 0.55);
  const aging30to60 = Math.round(pendingAmount * 0.30);
  const aging60Plus = Math.round(pendingAmount * 0.15);

  const activeProjects = (projects || []).filter((p) => p.status === "in_progress" || p.status === "planning");
  const avgProgress = projects.length
    ? Math.round(projects.reduce((acc, p) => acc + (p.completionPercentage || 0), 0) / projects.length)
    : 0;

  const totalHoursLogged = (timeEntries || []).reduce((acc, t) => acc + (t.hours || 0), 0);

  // Customer Acquisition calculation
  const totalLeads = (contactList || []).length;
  const wonLeads = (contactList || []).filter((c) => c.stage === "won").length;
  const conversionRate = totalLeads ? Math.round((wonLeads / totalLeads) * 100) : 34;

  // Revenue chart data with pulse variation and forecast trend
  const currentJulRevenue = totalRevenue + livePulseTick * 150;
  const chartData = [
    { month: "Feb", Omzet: 14200, Facturen: 16000, PrognoseTrend: 15000 },
    { month: "Mrt", Omzet: 18500, Facturen: 21000, PrognoseTrend: 19500 },
    { month: "Apr", Omzet: 22400, Facturen: 24500, PrognoseTrend: 23800 },
    { month: "Mei", Omzet: 29800, Facturen: 31000, PrognoseTrend: 29000 },
    { month: "Jun", Omzet: 34100, Facturen: 38000, PrognoseTrend: 35500 },
    { month: "Jul", Omzet: currentJulRevenue, Facturen: currentJulRevenue + pendingAmount, PrognoseTrend: 41000 },
    ...(revenueMetricMode === "projected"
      ? [
          { month: "Aug*", Omzet: 45000, Facturen: 49000, PrognoseTrend: 46500 },
          { month: "Sep*", Omzet: 52000, Facturen: 56000, PrognoseTrend: 53500 },
          { month: "Oct*", Omzet: 60000, Facturen: 64000, PrognoseTrend: 61000 },
        ]
      : []),
  ];

  // Employee workload summary data
  const employeeWorkloadData = [
    { name: "Anouk v.d. M.", hours: 38, capacity: 40, status: "Optimaal" },
    { name: "Bas Bakker", hours: 42, capacity: 40, status: "Overwerk (+2u)" },
    { name: "Thijs de J.", hours: 32, capacity: 40, status: "Beschikbaar" },
    { name: "Sophie K.", hours: 36, capacity: 40, status: "Optimaal" },
  ];

  const pipelineStages = [
    { name: "Lead", value: (contactList || []).filter((c) => c.stage === "lead").length || 3, color: "#94a3b8" },
    { name: "Contacted", value: (contactList || []).filter((c) => c.stage === "contacted").length || 2, color: "#3b82f6" },
    { name: "Proposal", value: (contactList || []).filter((c) => c.stage === "proposal").length || 4, color: "#f59e0b" },
    { name: "Won", value: (contactList || []).filter((c) => c.stage === "won").length || 5, color: "#10b981" },
  ];

  return (
    <div id="tour-dashboard-main" className="space-y-6">
      
      {/* WELCOME BENTO BANNER - FIXED HEIGHT TICKER TO PREVENT PAGE LAYOUT JUMP */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-indigo-500/30 text-indigo-200 rounded-full border border-indigo-400/30 uppercase tracking-widest">
                HanzeOS Dynamic SaaS Dashboard
              </span>
              <button
                onClick={() => setIsLiveAutoUpdate(!isLiveAutoUpdate)}
                className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border flex items-center gap-1.5 transition-all ${
                  isLiveAutoUpdate
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isLiveAutoUpdate ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
                {isLiveAutoUpdate ? "Live Auto-Sync (10s)" : "Auto-Sync Gepauzeerd"}
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {language === "nl" ? `Welkom bij ${currentTenant.name}` : `Welcome to ${currentTenant.name}`}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl font-medium">
              Real-time inzicht in omzet, openstaande factuurverloop, projectstatus, teamwerkdruk en klantacquisitie.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenNewInvoice}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              {language === "nl" ? "Nieuwe Factuur" : "New Invoice"}
            </button>
            <button
              onClick={onOpenNewTimeEntry}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs rounded-xl border border-slate-700 transition-all uppercase tracking-wider"
            >
              <Clock className="w-4 h-4 text-emerald-400" />
              {language === "nl" ? "Tijd Schrijven" : "Log Hours"}
            </button>
          </div>
        </div>

        {/* STABLE FIXED-HEIGHT LIVE TICKER BANNER (PREVENTS LAYOUT SHIFTS) */}
        <div className="mt-4 h-10 px-3.5 bg-indigo-950/80 rounded-2xl border border-indigo-500/40 text-xs text-indigo-200 flex items-center justify-between gap-2 overflow-hidden transition-all">
          {lastEventToast ? (
            <div className="flex items-center gap-2 font-semibold truncate animate-in fade-in duration-300">
              <Sparkles className="w-4 h-4 text-amber-300 flex-shrink-0 animate-spin" />
              <span className="truncate">{lastEventToast}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 font-semibold text-indigo-300/80 truncate">
              <Activity className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="truncate">Systeemstatus: 100% operationeel • Geen actieve storingen • Facturatie live gesynchroniseerd</span>
            </div>
          )}
          <span className="text-[10px] text-indigo-400 uppercase font-bold flex-shrink-0">
            {lastEventToast ? "Zojuist" : "Live"}
          </span>
        </div>
      </div>

      {/* BENTO GRID TOP ROW - KEY METRICS */}
      <div id="tour-kpis" className="grid grid-cols-12 gap-4">
        
        {/* KPI 1: TOTAL SALES REVENUE WITH CURRENT VS PROJECTED TOGGLE */}
        <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-1">
              <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                {revenueMetricMode === "current" ? "Huidige Omzet" : "Geprojecteerde Omzet"}
              </p>

              {/* CURRENT VS PROJECTED TOGGLE */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-bold">
                <button
                  onClick={() => setRevenueMetricMode("current")}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    revenueMetricMode === "current"
                      ? "bg-white text-indigo-700 shadow-2xs font-black"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Huidig
                </button>
                <button
                  onClick={() => setRevenueMetricMode("projected")}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    revenueMetricMode === "projected"
                      ? "bg-indigo-600 text-white shadow-2xs font-black"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Prognose
                </button>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              €
              {(revenueMetricMode === "current" ? totalRevenue : projectedRevenue).toLocaleString(
                "nl-NL",
                { minimumFractionDigits: 0 }
              )}
            </h2>

            {revenueMetricMode === "current" ? (
              <p className="text-emerald-600 text-xs mt-1.5 flex items-center font-bold">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                +18.4% vs vorige maand (Actueel)
              </p>
            ) : (
              <p className="text-indigo-600 text-xs mt-1.5 flex items-center font-bold">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-500" />
                Forecast Q3/Q4 (+28.0% Trend)
              </p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>
              {revenueMetricMode === "current"
                ? `Btw: €${Math.round(totalRevenue * 0.21).toLocaleString("nl-NL")}`
                : `Prognose Btw: €${Math.round(projectedRevenue * 0.21).toLocaleString("nl-NL")}`}
            </span>
            <span className={revenueMetricMode === "current" ? "text-emerald-700 font-bold" : "text-indigo-600 font-bold"}>
              {revenueMetricMode === "current" ? "Gerealiseerd" : "Prognose Lineair"}
            </span>
          </div>
        </div>

        {/* KPI 2: CUSTOMER ACQUISITION RATE */}
        <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                {language === "nl" ? "Klantacquisitie Rate" : "Acquisition Rate"}
              </p>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              {conversionRate}% <span className="text-xs font-normal text-slate-500">Conversie</span>
            </h2>
            <p className="text-blue-600 text-xs mt-1.5 flex items-center font-bold">
              <Users className="w-3.5 h-3.5 mr-1" />
              {totalLeads} Actieve B2B Leads in Sales Pipeline
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>Klantwaarde (CAC): €145</span>
            <button onClick={() => handleNav("crm")} className="text-blue-600 font-bold hover:underline">
              Pijplijn Bekijken →
            </button>
          </div>
        </div>

        {/* KPI 3: OPEN INVOICES & AGING BUCKETS */}
        <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-indigo-600 rounded-2xl p-5 shadow-lg text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-indigo-100 text-[11px] font-bold uppercase tracking-wider">
                {language === "nl" ? "Openstaand Saldo" : "Open Invoices"}
              </p>
              <span className="px-2 py-0.5 bg-amber-400 text-slate-900 font-extrabold text-[10px] rounded-full uppercase">
                {pendingInvoices.length} Facturen
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mt-2">
              €{pendingAmount.toLocaleString("nl-NL", { minimumFractionDigits: 0 })}
            </h2>
            
            {/* AGING BUCKET MINI BARS */}
            <div className="mt-3 space-y-1.5">
              <div className="flex justify-between text-[10px] text-indigo-100 font-semibold">
                <span>0-30 Dagen: €{agingCurrent.toLocaleString("nl-NL")}</span>
                <span>30-60D: €{aging30to60.toLocaleString("nl-NL")}</span>
              </div>
              <div className="w-full bg-indigo-900/50 h-2 rounded-full overflow-hidden flex">
                <div className="bg-emerald-400 h-2" style={{ width: "55%" }} />
                <div className="bg-amber-300 h-2" style={{ width: "30%" }} />
                <div className="bg-rose-400 h-2" style={{ width: "15%" }} />
              </div>
            </div>
          </div>

          <button
            onClick={() => handleNav("invoicing")}
            className="mt-4 w-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold py-2 rounded-xl transition-colors uppercase tracking-widest text-center"
          >
            {language === "nl" ? "Beheer Facturen & Herinneringen" : "Manage Invoices"}
          </button>
        </div>

        {/* KPI 4: TEAM WORKLOAD & CAPACITY */}
        <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                {language === "nl" ? "Medewerkers Werkdruk" : "Employee Workload"}
              </p>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              {totalHoursLogged}u <span className="text-xs font-normal text-slate-500">Geschreven</span>
            </h2>
            <p className="text-purple-600 text-xs mt-1.5 flex items-center font-bold">
              <Activity className="w-3.5 h-3.5 mr-1" />
              Gem. Team Capaciteit: 88%
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>1 Medewerker met Overwerk</span>
            <button onClick={() => handleNav("hr")} className="text-purple-600 font-bold hover:underline">
              Uren Grid →
            </button>
          </div>
        </div>

      </div>

      {/* BENTO GRID MAIN SECTION: RECHARTS FINANCIAL & WORKLOAD visualizers WITH FORECAST TREND LINE */}
      <div className="grid grid-cols-12 gap-4">
        
        {/* REVENUE TREND & INVOICING CHART WITH FORECAST TRENDLINE */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-slate-900">
                  Omzet- & Facturatieverloop (Real-Time Trend)
                </h3>
                {revenueMetricMode === "projected" && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full uppercase tracking-wider">
                    Inclusief Prognose Trendlijn
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {revenueMetricMode === "current"
                  ? "Gerealiseerde inkomsten vs. gefactureerde omzet"
                  : "Historische omzet + lineair geprojecteerde kwartaalprognose"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* CURRENT VS PROJECTED TOGGLE IN CHART HEADER */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                <button
                  onClick={() => setRevenueMetricMode("current")}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    revenueMetricMode === "current" ? "bg-white text-indigo-700 shadow-2xs" : "text-slate-600"
                  }`}
                >
                  Actueel
                </button>
                <button
                  onClick={() => setRevenueMetricMode("projected")}
                  className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                    revenueMetricMode === "projected" ? "bg-indigo-600 text-white shadow-2xs" : "text-slate-600"
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  Prognose Trend
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
                <button
                  onClick={() => setTimeFilter("30d")}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    timeFilter === "30d" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600"
                  }`}
                >
                  30D
                </button>
                <button
                  onClick={() => setTimeFilter("quarter")}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    timeFilter === "quarter" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600"
                  }`}
                >
                  Q2
                </button>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  formatter={(val: number) => [`€${val ? val.toLocaleString("nl-NL") : "0"}`, ""]}
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "none", color: "#fff", fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Bar dataKey="Omzet" fill="#4f46e5" radius={[6, 6, 0, 0]} name="Gerealiseerde Omzet" />
                <Bar dataKey="Facturen" fill="#93c5fd" radius={[6, 6, 0, 0]} name="Gefactureerd Totaal" />
                <Line
                  type="monotone"
                  dataKey="PrognoseTrend"
                  stroke="#d97706"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  dot={{ r: 4, fill: "#f59e0b" }}
                  name="Trendline Prognose"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TEAM WORKLOAD CAPACITY BARS */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                Medewerkers Belasting & Capaciteit
              </h3>
            </div>

            <div className="space-y-3.5 mt-4">
              {employeeWorkloadData.map((emp, idx) => {
                const percentage = Math.round((emp.hours / emp.capacity) * 100);
                const isOvertime = emp.hours > emp.capacity;

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-800">{emp.name}</span>
                      <span className={isOvertime ? "text-rose-600" : "text-slate-600"}>
                        {emp.hours}u / {emp.capacity}u ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full transition-all ${
                          isOvertime ? "bg-rose-500" : percentage > 85 ? "bg-indigo-600" : "bg-emerald-500"
                        }`}
                        style={{ width: `${Math.min(100, percentage)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => handleNav("hr")}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors uppercase tracking-wider"
          >
            Bekijk HR & Verlofkalender
          </button>
        </div>

      </div>

      {/* BENTO GRID BOTTOM ROW: PROJECT COMPLETION & PIPELINE */}
      <div className="grid grid-cols-12 gap-4">
        
        {/* PROJECT COMPLETION STATUS */}
        <div className="col-span-12 lg:col-span-6 bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Projecten Status & Voortgang ({avgProgress}% Gemiddeld)
              </h3>
              <p className="text-xs text-slate-500 font-medium">Lopende bouw- en adviesprojecten</p>
            </div>
            <button onClick={() => handleNav("projects")} className="text-xs text-indigo-600 font-bold hover:underline">
              Projecten Dashboard →
            </button>
          </div>

          <div className="space-y-3">
            {projects.slice(0, 4).map((proj) => (
              <div key={proj.id} className="p-3 border border-slate-100 rounded-xl bg-slate-50/60 flex items-center justify-between gap-4">
                <div className="space-y-1 max-w-[240px] truncate">
                  <p className="font-bold text-xs text-slate-800 truncate">{proj.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium">Klant: {proj.clientName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-28 bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${proj.completionPercentage}%` }} />
                  </div>
                  <span className="text-xs font-extrabold text-slate-800 min-w-[32px] text-right">
                    {proj.completionPercentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PIPELINE STAGES DISTRIBUTION */}
        <div className="col-span-12 lg:col-span-6 bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Sales Pijplijn Verdeling
              </h3>
              <p className="text-xs text-slate-500 font-medium">Status van lopende offertes en leads</p>
            </div>
            <button onClick={() => handleNav("crm")} className="text-xs text-indigo-600 font-bold hover:underline">
              CRM Pipeline →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {pipelineStages.map((stage, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
                <div className="w-3 h-3 rounded-full mx-auto" style={{ backgroundColor: stage.color }} />
                <p className="text-xs font-bold text-slate-800 mt-1">{stage.name}</p>
                <p className="text-lg font-black text-slate-900">{stage.value}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

