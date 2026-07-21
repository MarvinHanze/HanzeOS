import React, { useState } from "react";
import {
  UserCheck,
  Calendar,
  DollarSign,
  Shield,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  UserPlus,
  FileCheck,
} from "lucide-react";
import { Employee, LeaveRequest, ExpenseClaim, UserRole, Language } from "../types";

interface HrViewProps {
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  expenseClaims: ExpenseClaim[];
  userRole: UserRole;
  language: Language;
  onApproveLeave: (id: string) => void;
  onRejectLeave: (id: string) => void;
  onApproveExpense: (id: string) => void;
}

export const HrView: React.FC<HrViewProps> = ({
  employees,
  leaveRequests,
  expenseClaims,
  userRole,
  language,
  onApproveLeave,
  onRejectLeave,
  onApproveExpense,
}) => {
  const [activeTab, setActiveTab] = useState<"staff" | "leave" | "expenses" | "rbac">("staff");

  const rbacMatrix = [
    { module: "Dashboard & KPIs", owner: "Volledig", pm: "Volledig", finance: "Lezen", emp: "Geen" },
    { module: "CRM & Offertes", owner: "Volledig", pm: "Lezen/Aanmaken", finance: "Lezen", emp: "Geen" },
    { module: "Projecten & Taken", owner: "Volledig", pm: "Volledig", finance: "Lezen", emp: "Uren Schrijven" },
    { module: "Facturatie & BTW", owner: "Volledig", pm: "Geen", finance: "Volledig", emp: "Geen" },
    { module: "HR & Salarissen", owner: "Volledig", pm: "Verlof Goedkeuren", finance: "Declaraties", emp: "Eigen Verlof" },
    { module: "Systeem Instellingen", owner: "Volledig", pm: "Geen", finance: "Geen", emp: "Geen" },
  ];

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {language === "nl" ? "HR & Personeelsbeheer" : "HR & Staff Management"}
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Beheer medewerkers, verlofaanvragen, declaraties en rol-gebaseerde toegangsrechten (RBAC).
          </p>
        </div>

        <div className="px-3.5 py-1.5 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center gap-2 text-xs text-indigo-700 font-bold tracking-wide">
          <Shield className="w-4 h-4 text-indigo-600" />
          <span>Huidige Rol: {userRole.toUpperCase()}</span>
        </div>
      </div>

      {/* SUB NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("staff")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all uppercase tracking-wider ${
            activeTab === "staff"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          {language === "nl" ? `Medewerkers (${employees.length})` : `Employees (${employees.length})`}
        </button>

        <button
          onClick={() => setActiveTab("leave")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all uppercase tracking-wider ${
            activeTab === "leave"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          {language === "nl" ? `Verlofaanvragen (${leaveRequests.length})` : `Leave Requests (${leaveRequests.length})`}
        </button>

        <button
          onClick={() => setActiveTab("expenses")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all uppercase tracking-wider ${
            activeTab === "expenses"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          {language === "nl" ? `Declaraties (${expenseClaims.length})` : `Expense Claims (${expenseClaims.length})`}
        </button>

        <button
          onClick={() => setActiveTab("rbac")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all uppercase tracking-wider ${
            activeTab === "rbac"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          {language === "nl" ? "Rechtenmatrix (RBAC)" : "Permissions Matrix"}
        </button>
      </div>

      {/* TAB 1: EMPLOYEES DIRECTORY */}
      {activeTab === "staff" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {employees.map((emp) => (
            <div key={emp.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                  {emp.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                  {emp.status}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{emp.name}</h3>
                <p className="text-xs text-slate-500">{emp.roleTitle}</p>
              </div>

              <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">Afdeling:</span>
                  <span className="font-semibold">{emp.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Contract:</span>
                  <span className="font-semibold">{emp.contractType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Verlofdagen:</span>
                  <span className="font-bold text-blue-600">{emp.leaveBalanceDays} dagen</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: LEAVE REQUESTS */}
      {activeTab === "leave" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Ingekomen Verlofaanvragen</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <th className="p-3">Medewerker</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Periode</th>
                  <th className="p-3">Dagen</th>
                  <th className="p-3">Reden</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Goedkeuring</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {leaveRequests.map((lr) => (
                  <tr key={lr.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{lr.employeeName}</td>
                    <td className="p-3 capitalize">{lr.type}</td>
                    <td className="p-3 text-slate-500">{lr.startDate} t/m {lr.endDate}</td>
                    <td className="p-3 font-bold text-blue-600">{lr.days} dagen</td>
                    <td className="p-3">{lr.reason}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        lr.status === "goedgekeurd"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}>
                        {lr.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {lr.status === "in_behandeling" ? (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onApproveLeave(lr.id)}
                            className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold"
                          >
                            Akkoord
                          </button>
                          <button
                            onClick={() => onRejectLeave(lr.id)}
                            className="px-2 py-1 bg-rose-600 text-white rounded text-[10px] font-bold"
                          >
                            Afwijzen
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400">Verwerkt</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: EXPENSE CLAIMS */}
      {activeTab === "expenses" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Ingediende Declaraties</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <th className="p-3">Medewerker</th>
                  <th className="p-3">Categorie</th>
                  <th className="p-3">Datum</th>
                  <th className="p-3">Omschrijving</th>
                  <th className="p-3 text-right">Bedrag (€)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Actie</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {expenseClaims.map((ec) => (
                  <tr key={ec.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{ec.employeeName}</td>
                    <td className="p-3">{ec.category}</td>
                    <td className="p-3 text-slate-500">{ec.date}</td>
                    <td className="p-3">{ec.description}</td>
                    <td className="p-3 text-right font-bold text-slate-900">€{ec.amount.toFixed(2)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        ec.status === "goedgekeurd" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                      }`}>
                        {ec.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {ec.status === "ingediend" ? (
                        <button
                          onClick={() => onApproveExpense(ec.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold"
                        >
                          Keur Goed
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400">Afgehandeld</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: RBAC MATRIX */}
      {activeTab === "rbac" && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Multi-tenant Role-Based Access Control (RBAC) Matrix
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Gedetailleerde rechtenstructuur per rol binnen het MKB platform.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white font-semibold">
                  <th className="p-3">Module / Functie</th>
                  <th className="p-3">Eigenaar (Owner)</th>
                  <th className="p-3">Projectmanager</th>
                  <th className="p-3">Financieel Medewerker</th>
                  <th className="p-3">Veldmedewerker</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {rbacMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-bold">{row.module}</td>
                    <td className="p-3 text-emerald-600 font-bold">{row.owner}</td>
                    <td className="p-3 text-blue-600 font-medium">{row.pm}</td>
                    <td className="p-3 text-purple-600 font-medium">{row.finance}</td>
                    <td className="p-3 text-slate-500">{row.emp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
