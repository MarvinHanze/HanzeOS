import React, { useState } from "react";
import {
  CreditCard,
  Check,
  X,
  Zap,
  Building2,
  Palette,
  ShieldCheck,
  FileText,
  Users,
  Grid,
  Calculator,
  Send,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  CheckCircle,
} from "lucide-react";
import { Tenant, SubscriptionPlan, Language, Invoice } from "../types";

interface SubscriptionModalProps {
  currentTenant: Tenant;
  language: Language;
  onUpdatePlan: (plan: SubscriptionPlan) => void;
  onUpdateBranding: (primaryColor: string, logoUrl?: string) => void;
  onAddInvoice?: (invoice: Invoice) => void;
  onStartTour?: () => void;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  currentTenant,
  language,
  onUpdatePlan,
  onUpdateBranding,
  onAddInvoice,
  onStartTour,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"plans" | "calculator" | "payments" | "reminders" | "branding">("plans");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [selectedColor, setSelectedColor] = useState(currentTenant.primaryColor);
  const [logoInput, setLogoInput] = useState(currentTenant.logoUrl || "");
  
  // Seat & Module Calculator State
  const [userSeats, setUserSeats] = useState(5);
  const [selectedModules, setSelectedModules] = useState({
    crm: true,
    projects: true,
    invoicing: true,
    hr: currentTenant.activeModules.hr ?? true,
    inventory: currentTenant.activeModules.inventory ?? false,
    esg: currentTenant.activeModules.esg ?? false,
    support: currentTenant.activeModules.support ?? true,
  });

  // Payment Gateway Simulation State
  const [paymentGateway, setPaymentGateway] = useState<"stripe" | "mollie">("mollie");
  const [mollieBank, setMollieBank] = useState("ideal_ing");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState<string | null>(null);

  // Reminder Automation Schedule
  const [reminderDays, setReminderDays] = useState({
    beforeDue: 3,
    onDue: 0,
    afterDue7: 7,
    afterDue14: 14,
  });
  const [autoSendEnabled, setAutoSendEnabled] = useState(true);
  const [reminderSentToast, setReminderSentToast] = useState(false);

  // Trial status (simulated 14-day trial)
  const trialDaysLeft = 8;

  // Plan tiers metadata
  const plans = [
    {
      id: "starter" as SubscriptionPlan,
      name: "Starter (ZZP)",
      monthlyPrice: 19,
      annualPrice: 15,
      desc: "Ideaal voor ZZP'ers en eenmanszaken die willen starten met factureren en basis CRM.",
      includedSeats: 1,
      features: ["Tot 3 actieve modules", "1 Gebruiker inbegrepen", "E-facturatie & BTW-berekening", "E-mailondersteuning"],
    },
    {
      id: "business" as SubscriptionPlan,
      name: "Business (MKB)",
      monthlyPrice: 59,
      annualPrice: 49,
      desc: "Het populairste pakket voor MKB tot 15 medewerkers met project- en urenregistratie.",
      includedSeats: 5,
      features: [
        "Alle 7 modules beschikbaar",
        "5 Gebruikers inbegrepen",
        "Mobiele Timer & Takenbeheer",
        "AI Assistent & Herinneringen",
        "White-label kleurenschema",
      ],
      popular: true,
    },
    {
      id: "enterprise" as SubscriptionPlan,
      name: "Enterprise (Pro)",
      monthlyPrice: 239,
      annualPrice: 199,
      desc: "Voor grotere MKB-bedrijven met meerdere entiteiten, maatwerk rollen en ERP-export.",
      includedSeats: 25,
      features: [
        "Onbeperkt aantal gebruikers",
        "Multi-tenant entiteitenbeheer",
        "Maatwerk RBAC rollenmatrix",
        "Dedicated accountmanager",
        "SLA 99.9% Garantie",
      ],
    },
  ];

  const brandColors = ["#2563eb", "#059669", "#4f46e5", "#d97706", "#dc2626", "#7c3aed"];

  // Cost calculation
  const currentPlan = plans.find((p) => p.id === currentTenant.planTier) || plans[1];
  const basePrice = billingCycle === "annual" ? currentPlan.annualPrice : currentPlan.monthlyPrice;
  const extraSeats = Math.max(0, userSeats - currentPlan.includedSeats);
  const extraSeatsCost = extraSeats * 6; // €6/seat
  const activeModulesCount = Object.values(selectedModules).filter(Boolean).length;
  const extraModulesCost = Math.max(0, activeModulesCount - 3) * 10; // €10/addon
  const totalMonthlyCalculated = basePrice + extraSeatsCost + extraModulesCost;

  const [brandingSavedToast, setBrandingSavedToast] = useState(false);

  const handleSaveBranding = () => {
    onUpdateBranding(selectedColor, logoInput);
    setBrandingSavedToast(true);
    setTimeout(() => setBrandingSavedToast(false), 3000);
  };

  const handleGenerateInvoice = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      const invoiceNumber = `SABON-${Date.now().toString().slice(-5)}`;
      const subtotal = totalMonthlyCalculated;
      const vat = Math.round(subtotal * 0.21);
      const newInvoice: Invoice = {
        id: `inv-sub-${Date.now()}`,
        invoiceNumber,
        clientName: currentTenant.name,
        clientEmail: "administratie@" + currentTenant.name.toLowerCase().replace(/[^a-z]/g, "") + ".nl",
        clientAddress: `${currentTenant.city}, Nederland`,
        issueDate: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
        status: "verzonden",
        subtotalExVat: subtotal,
        vatTotal: vat,
        totalAmount: subtotal + vat,
        items: [
          {
            id: `item-1-${Date.now()}`,
            description: `HanzeOS MKB ${currentPlan.name} (${billingCycle === "annual" ? "Jaarlijks" : "Maandelijks"})`,
            quantity: 1,
            unitPrice: basePrice,
            vatRate: 21,
          },
          {
            id: `item-2-${Date.now()}`,
            description: `Extra Gebruikerslicenties (${extraSeats}x €6/m)`,
            quantity: extraSeats,
            unitPrice: 6,
            vatRate: 21,
          },
          {
            id: `item-3-${Date.now()}`,
            description: `Actieve Module Uitbreidingen (${activeModulesCount} modules)`,
            quantity: 1,
            unitPrice: extraModulesCost,
            vatRate: 21,
          },
        ],
      };

      if (onAddInvoice) {
        onAddInvoice(newInvoice);
      }

      setPaymentSuccessMessage(
        `Abonnementsfactuur ${invoiceNumber} t.w.v. €${newInvoice.totalAmount} gegeneerd & toegevoegd aan uw administratie!`
      );
      setTimeout(() => setPaymentSuccessMessage(null), 5000);
    }, 1000);
  };

  const handleProcessSimulatedPayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccessMessage(
        `Betaling van €${totalMonthlyCalculated} via ${
          paymentGateway === "stripe" ? "Stripe Credit Card" : "Mollie iDEAL (" + mollieBank.toUpperCase() + ")"
        } succesvol verwerkt! Uw abonnement is direct actief.`
      );
      setTimeout(() => setPaymentSuccessMessage(null), 5000);
    }, 1200);
  };

  const handleTriggerAutomatedReminders = () => {
    setReminderSentToast(true);
    setTimeout(() => setReminderSentToast(false), 4000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-md">
              <Zap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900">
                  Abonnement, Facturatie & Betalingen
                </h2>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full uppercase">
                  Actief Proefabonnement
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                SaaS abonnementen, module-prijzen, iDEAL/Stripe betalingskoppeling & herinneringsschema's.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PROOF OF TRIAL STATUS BANNER */}
        <div className="p-3.5 bg-gradient-to-r from-indigo-50 to-amber-50 rounded-2xl border border-indigo-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-xs">
              {trialDaysLeft}d
            </div>
            <div>
              <p className="font-bold text-slate-900">14-Dagen Gratis Proefperiode voor {currentTenant.name}</p>
              <p className="text-slate-600 text-[11px]">Nog {trialDaysLeft} dagen resterend in uw proefperiode. Converteer naar betaald voor doorlopend gebruik.</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("plans")}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-colors text-xs whitespace-nowrap uppercase tracking-wider"
          >
            Nu Met Korting Omzetten
          </button>
        </div>

        {/* TOAST MESSAGE */}
        {paymentSuccessMessage && (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 text-emerald-900 font-bold text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{paymentSuccessMessage}</span>
          </div>
        )}

        {/* SUB-NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("plans")}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "plans" ? "bg-indigo-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Pakketten
          </button>

          <button
            onClick={() => setActiveTab("calculator")}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "calculator" ? "bg-indigo-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            Zetel- & Module Calculator
          </button>

          <button
            onClick={() => setActiveTab("payments")}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "payments" ? "bg-indigo-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Stripe / Mollie iDEAL
          </button>

          <button
            onClick={() => setActiveTab("reminders")}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "reminders" ? "bg-indigo-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Automatische Herinneringen
          </button>

          <button
            onClick={() => setActiveTab("branding")}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "branding" ? "bg-indigo-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            Huisstijl & Logo
          </button>
        </div>

        {/* TAB 1: SUBSCRIPTION PLANS */}
        {activeTab === "plans" && (
          <div className="space-y-4">
            
            {/* MONTHLY VS ANNUAL TOGGLE */}
            <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-800">Facturatieperiode</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                    billingCycle === "monthly" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Maandelijks
                </button>
                <button
                  onClick={() => setBillingCycle("annual")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                    billingCycle === "annual" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Jaarlijks
                  <span className="px-1.5 py-0.5 bg-amber-400 text-slate-900 text-[10px] font-extrabold rounded-full">
                    20% Korting
                  </span>
                </button>
              </div>
            </div>

            {/* PLANS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((p) => {
                const isCurrent = currentTenant.planTier === p.id;
                const price = billingCycle === "annual" ? p.annualPrice : p.monthlyPrice;

                return (
                  <div
                    key={p.id}
                    className={`p-5 rounded-2xl border transition-all space-y-4 relative flex flex-col justify-between ${
                      isCurrent
                        ? "bg-indigo-50/70 border-indigo-500 shadow-md ring-2 ring-indigo-500/20"
                        : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
                    }`}
                  >
                    {p.popular && (
                      <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-extrabold text-[9px] rounded-full uppercase tracking-wider shadow-xs">
                        Meest Gekozen
                      </span>
                    )}

                    <div>
                      <h4 className="text-base font-extrabold text-slate-900">{p.name}</h4>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-3xl font-black text-slate-900">€{price}</span>
                        <span className="text-xs text-slate-500 font-medium">/ maand excl. BTW</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">{p.desc}</p>

                      <div className="mt-4 space-y-2 pt-4 border-t border-slate-100">
                        {p.features.map((f, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                            <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => onUpdatePlan(p.id)}
                      className={`w-full py-2.5 text-xs font-extrabold rounded-xl transition-all uppercase tracking-wider ${
                        isCurrent
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                      }`}
                    >
                      {isCurrent ? "Huidig Pakket" : "Kies dit Pakket"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: SEAT & MODULE CALCULATOR */}
        {activeTab === "calculator" && (
          <div className="space-y-5 text-xs">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                1. Aantal Gebruikerslicenties (Zetels)
              </h3>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={userSeats}
                  onChange={(e) => setUserSeats(parseInt(e.target.value))}
                  className="flex-1 accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 min-w-[100px] text-center">
                  {userSeats} Medewerkers
                </div>
              </div>
              <p className="text-slate-500 text-[11px]">
                {currentPlan.includedSeats} zetels inbegrepen in {currentPlan.name}. Extra zetels: {extraSeats} x €6/maand = €{extraSeatsCost}/maand.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Grid className="w-4 h-4 text-indigo-600" />
                2. Actieve Modulerenselectie
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { key: "crm", title: "CRM & Sales Pijplijn", cost: "Inbegrepen" },
                  { key: "projects", title: "Projecten & Mobiele Timer", cost: "Inbegrepen" },
                  { key: "invoicing", title: "Facturatie & BTW-Aangifte", cost: "Inbegrepen" },
                  { key: "hr", title: "HR, Verlof & Declaraties", cost: "+€10/m" },
                  { key: "inventory", title: "Voorraad & Materialen", cost: "+€10/m" },
                  { key: "esg", title: "ESG & Veiligheid op Werkvloer", cost: "+€10/m" },
                  { key: "support", title: "AI Bedrijfsadviseur (Gemini)", cost: "+€10/m" },
                ].map((m) => {
                  const isChecked = (selectedModules as any)[m.key];
                  return (
                    <label
                      key={m.key}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked ? "bg-indigo-50/70 border-indigo-400 font-bold" : "bg-white border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) =>
                            setSelectedModules({ ...selectedModules, [m.key]: e.target.checked })
                          }
                          className="rounded text-indigo-600 w-4 h-4"
                        />
                        <span className="text-slate-800">{m.title}</span>
                      </div>
                      <span className="text-[10px] text-indigo-600 font-extrabold bg-indigo-100 px-2 py-0.5 rounded-full">
                        {m.cost}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* LIVE CALCULATION SUMMARY */}
            <div className="p-5 bg-slate-900 rounded-2xl text-white space-y-3 shadow-lg">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-bold text-slate-300">Geautomatiseerd Maandbedrag</span>
                <span className="text-2xl font-black text-amber-400">€{totalMonthlyCalculated} / maand</span>
              </div>
              <div className="text-slate-400 text-[11px] space-y-1">
                <p>• Basispakket ({currentPlan.name}): €{basePrice}</p>
                <p>• Gebruikerslicenties ({userSeats} totaal, {extraSeats} extra): €{extraSeatsCost}</p>
                <p>• Module add-ons ({activeModulesCount} geactiveerd): €{extraModulesCost}</p>
                <p className="text-slate-300 font-bold pt-1">• Totaal incl. 21% BTW: €{Math.round(totalMonthlyCalculated * 1.21)}</p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleGenerateInvoice}
                  disabled={isProcessingPayment}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center gap-2 uppercase tracking-wider"
                >
                  <Receipt className="w-4 h-4 text-amber-300" />
                  {isProcessingPayment ? "Bezig met genereren..." : "Genereer Maandelijkse Abonnement Factuur"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STRIPE / MOLLIE INTEGRATION */}
        {activeTab === "payments" && (
          <div className="space-y-5 text-xs">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm">Selecteer Payment Gateway Integration</h3>
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setPaymentGateway("mollie")}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentGateway === "mollie" ? "bg-indigo-50 border-indigo-600 font-bold" : "bg-white border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">Mollie Payments (iDEAL)</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-md">Nederland</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-1">iDEAL, SEPA Automatische Incasso, Bancontact & Klarna.</p>
                </div>

                <div
                  onClick={() => setPaymentGateway("stripe")}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentGateway === "stripe" ? "bg-indigo-50 border-indigo-600 font-bold" : "bg-white border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">Stripe Payments</span>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded-md">Internationaal</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-1">Credit Card (Visa/Mastercard), Apple Pay, Google Pay.</p>
                </div>
              </div>

              {paymentGateway === "mollie" && (
                <div className="space-y-2 pt-2">
                  <label className="block font-bold text-slate-700">Kies uw iDEAL Bank</label>
                  <select
                    value={mollieBank}
                    onChange={(e) => setMollieBank(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="ideal_ing">ING Bank (iDEAL)</option>
                    <option value="ideal_rabobank">Rabobank (iDEAL)</option>
                    <option value="ideal_abnamro">ABN AMRO (iDEAL)</option>
                    <option value="ideal_bunq">bunq (iDEAL)</option>
                    <option value="ideal_triodos">Triodos Bank (iDEAL)</option>
                  </select>
                </div>
              )}

              {paymentGateway === "stripe" && (
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                  <label className="block font-bold text-slate-700">Credit Card Gegevens (Simulatie)</label>
                  <input
                    type="text"
                    disabled
                    value="•••• •••• •••• 4242 (Test Card Active)"
                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl font-mono text-slate-600"
                  />
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleProcessSimulatedPayment}
                  disabled={isProcessingPayment}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 uppercase tracking-wider"
                >
                  <CreditCard className="w-4 h-4" />
                  {isProcessingPayment ? "Verwerken..." : `Direct Betalen (€${totalMonthlyCalculated})`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AUTOMATED PAYMENT REMINDERS */}
        {activeTab === "reminders" && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Geautomatiseerde Betalingsherinneringen voor Klanten</h3>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Stuur automatisch e-mailherinneringen met directe iDEAL-betaallink naar uw debiteuren.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSendEnabled}
                    onChange={(e) => setAutoSendEnabled(e.target.checked)}
                    className="rounded text-indigo-600 w-4 h-4"
                  />
                  <span className="font-bold text-slate-800">Automatisch Verzenden</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800 block">Vriendelijke Herinnering</span>
                  <p className="text-slate-500 text-[10px]">3 dagen vóór de verfaldatum</p>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center pt-1">
                    <Check className="w-3 h-3 mr-1" /> E-mail template: A
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800 block">Eerste Aanmaning</span>
                  <p className="text-slate-500 text-[10px]">7 dagen ná de verfaldatum</p>
                  <span className="text-[10px] text-amber-600 font-bold flex items-center pt-1">
                    <Check className="w-3 h-3 mr-1" /> E-mail template: B
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800 block">Formele Ingebrekestelling</span>
                  <p className="text-slate-500 text-[10px]">14 dagen ná verfaldatum (+€15 incassokosten)</p>
                  <span className="text-[10px] text-rose-600 font-bold flex items-center pt-1">
                    <Check className="w-3 h-3 mr-1" /> E-mail template: C
                  </span>
                </div>
              </div>

              {reminderSentToast && (
                <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
                  <Send className="w-4 h-4 text-indigo-600" />
                  <span>Automatische herinneringsmails succesvol verzonden naar 2 verlopen debiteuren!</span>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleTriggerAutomatedReminders}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white font-extrabold rounded-xl shadow-md transition-all flex items-center gap-2 uppercase tracking-wider"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  Nu Herinneringsbatch Testen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: BRANDING */}
        {activeTab === "branding" && (
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-600" />
              Klantbranding & White-label Huisstijl
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-2">Primaire Merkkleur</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {brandColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`w-9 h-9 rounded-xl transition-transform ${
                        selectedColor === color ? "scale-110 ring-2 ring-offset-2 ring-slate-900 shadow-md" : ""
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <div className="flex items-center gap-2 ml-2 bg-white px-2 py-1 rounded-xl border border-slate-300">
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-7 h-7 rounded cursor-pointer border-none bg-transparent"
                      title="Kies een eigen merkkleur"
                    />
                    <span className="font-mono text-[11px] font-bold text-slate-700">{selectedColor}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bedrijfslogo URL</label>
                <input
                  type="text"
                  placeholder="https://via.placeholder.com/150"
                  value={logoInput}
                  onChange={(e) => setLogoInput(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
                />
              </div>
            </div>

            {/* INTERACTIVE TOUR RESTART BOX */}
            <div className="p-3.5 bg-indigo-50/80 rounded-2xl border border-indigo-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="font-extrabold text-indigo-900 text-xs block">Interactieve Platform Tour</span>
                <p className="text-[11px] text-indigo-700 font-medium">
                  Bekijk de uitleg over modules, kpi-dashboard, offertes en de AI-assistent opnieuw.
                </p>
              </div>
              {onStartTour && (
                <button
                  type="button"
                  onClick={onStartTour}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex-shrink-0 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Herstart Tour
                </button>
              )}
            </div>

            {/* LIVE PREVIEW BOX */}
            <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider block">Live Voorbeeld Weergave:</span>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 text-white">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-lg shadow-sm"
                  style={{ backgroundColor: selectedColor }}
                >
                  H
                </div>
                <div>
                  <span className="font-bold text-sm">HanzeOS {currentTenant.name}</span>
                  <p className="text-[10px] text-slate-400">White-label Primaire Merkkleur: {selectedColor}</p>
                </div>
                <button
                  className="ml-auto px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs"
                  style={{ backgroundColor: selectedColor }}
                >
                  Voorbeeld Knop
                </button>
              </div>
            </div>

            {brandingSavedToast && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Huisstijl en merkkleur ({selectedColor}) succesvol bijgewerkt voor {currentTenant.name}!</span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveBranding}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-md uppercase tracking-wider transition-all"
                style={{ backgroundColor: selectedColor }}
              >
                Huisstijl Opslaan
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
