import React, { useState } from "react";
import {
  FileText,
  Plus,
  Search,
  Euro,
  Send,
  CheckCircle,
  AlertTriangle,
  Printer,
  Download,
  Eye,
  CreditCard,
  Sparkles,
  X,
  RefreshCw,
} from "lucide-react";
import { Invoice, InvoiceItem, InvoiceStatus, Language } from "../types";

interface InvoicingViewProps {
  invoices: Invoice[];
  language: Language;
  onAddInvoice: (invoice: Omit<Invoice, "id">) => void;
  onUpdateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
}

export const InvoicingView: React.FC<InvoicingViewProps> = ({
  invoices,
  language,
  onAddInvoice,
  onUpdateInvoiceStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedInvoiceForPdf, setSelectedInvoiceForPdf] = useState<Invoice | null>(null);
  const [selectedInvoiceForReminder, setSelectedInvoiceForReminder] = useState<Invoice | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<Invoice | null>(null);
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);

  // New Invoice Form State
  const [newInvoice, setNewInvoice] = useState({
    clientName: "Vries & Partners Vastgoed",
    clientEmail: "facturen@vriesvastgoed.nl",
    clientAddress: "Maliebaan 88, 3581 CX Utrecht",
    dueDate: "2026-08-15",
    isRecurring: false,
    itemDesc: "Werkzaamheden & Oplevering NEN1010",
    quantity: 1,
    unitPrice: 2500,
    vatRate: 21,
  });

  // Reminder AI Text State
  const [reminderText, setReminderText] = useState("");
  const [isGeneratingReminder, setIsGeneratingReminder] = useState(false);

  const filteredInvoices = invoices.filter((i) => {
    const matchesSearch =
      i.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate totals
  const totalInvoiced = invoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalPaid = invoices.filter((i) => i.status === "betaald").reduce((acc, i) => acc + i.totalAmount, 0);
  const totalUnpaid = invoices.filter((i) => i.status !== "betaald").reduce((acc, i) => acc + i.totalAmount, 0);

  const handleGenerateReminderText = async (invoice: Invoice) => {
    setIsGeneratingReminder(true);
    try {
      const res = await fetch("/api/ai/invoice-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptText: `Factuur ${invoice.invoiceNumber}, Klant: ${invoice.clientName}, Bedrag: €${invoice.totalAmount}, Vervaldatum: ${invoice.dueDate}`,
          type: "reminder",
        }),
      });
      const data = await res.json();
      setReminderText(data.result || "Beste klant, hierbij herinneren wij u aan openstaande factuur.");
    } catch {
      setReminderText(
        `Beste ${invoice.clientName},\n\nHierbij herinneren wij u vriendelijk aan de openstaande factuur ${invoice.invoiceNumber} ter hoogte van €${invoice.totalAmount.toLocaleString(
          "nl-NL"
        )} met vervaldatum ${invoice.dueDate}.\n\nGelieve het bedrag binnen 7 dagen over te maken.\n\nMet vriendelijke groet,\nFinanciële Administratie HanzeOS`
      );
    } finally {
      setIsGeneratingReminder(false);
    }
  };

  const handleCreateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subtotal = newInvoice.quantity * newInvoice.unitPrice;
    const vatTotal = subtotal * (newInvoice.vatRate / 100);
    const totalAmount = subtotal + vatTotal;

    const items: InvoiceItem[] = [
      {
        id: `ii-${Date.now()}`,
        description: newInvoice.itemDesc,
        quantity: newInvoice.quantity,
        unitPrice: newInvoice.unitPrice,
        vatRate: newInvoice.vatRate,
      },
    ];

    onAddInvoice({
      invoiceNumber: `FACT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: newInvoice.clientName,
      clientEmail: newInvoice.clientEmail,
      clientAddress: newInvoice.clientAddress,
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: newInvoice.dueDate,
      status: "verzonden",
      subtotalExVat: subtotal,
      vatTotal,
      totalAmount,
      items,
      isRecurring: newInvoice.isRecurring,
      recurringInterval: newInvoice.isRecurring ? "monthly" : undefined,
    });

    setShowCreateInvoiceModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER & FINANCIAL METRICS */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {language === "nl" ? "Facturatie & BTW Beheer" : "Invoicing & VAT Management"}
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Automatisering van verkoopfacturen, periodieke abonnementen, BTW-aangifte berekening en iDEAL betalingen.
            </p>
          </div>

          <button
            onClick={() => setShowCreateInvoiceModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" />
            {language === "nl" ? "Nieuwe Factuur" : "New Invoice"}
          </button>
        </div>

        {/* METRICS SUMMARY */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Totaal Gefactureerd</span>
            <p className="text-lg font-extrabold text-slate-900 mt-0.5">€{totalInvoiced.toLocaleString("nl-NL")}</p>
          </div>
          <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/80">
            <span className="text-[11px] font-semibold text-emerald-700 uppercase">Betaald Ontvangen</span>
            <p className="text-lg font-extrabold text-emerald-800 mt-0.5">€{totalPaid.toLocaleString("nl-NL")}</p>
          </div>
          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80">
            <span className="text-[11px] font-semibold text-amber-700 uppercase">Openstaand Debiteuren</span>
            <p className="text-lg font-extrabold text-amber-800 mt-0.5">€{totalUnpaid.toLocaleString("nl-NL")}</p>
          </div>
        </div>
      </div>

      {/* FILTER BAR & SEARCH */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Zoek factuurnummer of klant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
          {["all", "verzonden", "betaald", "herinnering_1"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                statusFilter === st
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st === "all" ? "Alle Status" : st}
            </button>
          ))}
        </div>
      </div>

      {/* INVOICES TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <th className="p-3">Factuurnummer</th>
                <th className="p-3">Klant</th>
                <th className="p-3">Datum</th>
                <th className="p-3">Vervaldatum</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Bedrag ex BTW</th>
                <th className="p-3 text-right">Totaal incl BTW</th>
                <th className="p-3 text-center">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-mono font-bold text-blue-600">
                    <div className="flex items-center gap-1.5">
                      <span>{inv.invoiceNumber}</span>
                      {inv.isRecurring && (
                        <span className="px-1.5 py-0.2 text-[9px] bg-purple-100 text-purple-700 font-bold rounded">
                          Periodiek
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 font-medium text-slate-900">{inv.clientName}</td>
                  <td className="p-3 text-slate-500">{inv.issueDate}</td>
                  <td className="p-3 text-slate-500">{inv.dueDate}</td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        inv.status === "betaald"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : inv.status === "herinnering_1"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">€{inv.subtotalExVat.toLocaleString("nl-NL")}</td>
                  <td className="p-3 text-right font-bold text-slate-900">
                    €{inv.totalAmount.toLocaleString("nl-NL")}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* PREVIEW PDF */}
                      <button
                        onClick={() => setSelectedInvoiceForPdf(inv)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="Bekijk PDF Factuur"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* REMINDER GENERATOR */}
                      {inv.status !== "betaald" && (
                        <button
                          onClick={() => {
                            setSelectedInvoiceForReminder(inv);
                            handleGenerateReminderText(inv);
                          }}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"
                          title="Stuur Herinnering"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      )}

                      {/* PAY LINK SIMULATION */}
                      {inv.status !== "betaald" && (
                        <button
                          onClick={() => setShowPaymentModal(inv)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded"
                          title="Betaal via iDEAL/Stripe"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: PDF PREVIEW */}
      {selectedInvoiceForPdf && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-extrabold text-slate-900">Factuur Voorbeeld (PDF)</h3>
              </div>
              <button onClick={() => setSelectedInvoiceForPdf(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FACTUUR LAYOUT */}
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-6 text-xs text-slate-800">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-extrabold text-blue-600">HanzeOS MKB B.V.</h2>
                  <p className="text-slate-500">Oudegracht 142, 3511 AL Utrecht</p>
                  <p className="text-slate-500">KvK: 78493021 • BTW: NL859302184B01</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-mono font-bold text-slate-900">{selectedInvoiceForPdf.invoiceNumber}</span>
                  <p className="text-slate-500">Datum: {selectedInvoiceForPdf.issueDate}</p>
                  <p className="text-slate-500">Vervaldatum: {selectedInvoiceForPdf.dueDate}</p>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Factuuradres:</span>
                <p className="font-bold text-slate-900 text-sm">{selectedInvoiceForPdf.clientName}</p>
                <p className="text-slate-600">{selectedInvoiceForPdf.clientAddress}</p>
                <p className="text-slate-600">{selectedInvoiceForPdf.clientEmail}</p>
              </div>

              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-500">
                    <th className="py-2">Omschrijving</th>
                    <th className="py-2 text-center">Aantal</th>
                    <th className="py-2 text-right">Prijs</th>
                    <th className="py-2 text-right">BTW</th>
                    <th className="py-2 text-right">Totaal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {selectedInvoiceForPdf.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2.5 font-medium">{item.description}</td>
                      <td className="py-2.5 text-center">{item.quantity}</td>
                      <td className="py-2.5 text-right">€{item.unitPrice.toLocaleString("nl-NL")}</td>
                      <td className="py-2.5 text-right">{item.vatRate}%</td>
                      <td className="py-2.5 text-right font-bold">
                        €{(item.quantity * item.unitPrice).toLocaleString("nl-NL")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end pt-3 border-t border-slate-300">
                <div className="w-64 space-y-1.5 text-right text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Subtotaal ex BTW:</span>
                    <span className="font-semibold">€{selectedInvoiceForPdf.subtotalExVat.toLocaleString("nl-NL")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">BTW (21%):</span>
                    <span className="font-semibold">€{selectedInvoiceForPdf.vatTotal.toLocaleString("nl-NL")}</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-300">
                    <span>Totaal te voldoen:</span>
                    <span className="text-blue-600">€{selectedInvoiceForPdf.totalAmount.toLocaleString("nl-NL")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => alert("Simulatie: Factuur PDF gedownload.")}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REMINDER GENERATOR */}
      {selectedInvoiceForReminder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900">AI Betalingsherinnering Generator</h3>
              </div>
              <button onClick={() => setSelectedInvoiceForReminder(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                Invoerteller voor {selectedInvoiceForReminder.clientName} (Factuur {selectedInvoiceForReminder.invoiceNumber}):
              </p>

              {isGeneratingReminder ? (
                <div className="p-8 text-center space-y-2">
                  <RefreshCw className="w-6 h-6 text-amber-500 animate-spin mx-auto" />
                  <p className="text-slate-500 font-medium">AI stelt herinneringsmail op...</p>
                </div>
              ) : (
                <textarea
                  rows={8}
                  value={reminderText}
                  onChange={(e) => setReminderText(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs text-slate-800"
                />
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceForReminder(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium"
                >
                  Annuleren
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateInvoiceStatus(selectedInvoiceForReminder.id, "herinnering_1");
                    setSelectedInvoiceForReminder(null);
                    alert("Herinneringsmail succesvol verzonden!");
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Verstuur Herinnering
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW INVOICE */}
      {showCreateInvoiceModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Nieuwe Verkoopfactuur</h3>
              <button onClick={() => setShowCreateInvoiceModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoiceSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Klant Naam *</label>
                <input
                  type="text"
                  required
                  value={newInvoice.clientName}
                  onChange={(e) => setNewInvoice({ ...newInvoice, clientName: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Werkzaamheden Omschrijving *</label>
                <input
                  type="text"
                  required
                  value={newInvoice.itemDesc}
                  onChange={(e) => setNewInvoice({ ...newInvoice, itemDesc: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Eenheidsprijs ex BTW (€)</label>
                  <input
                    type="number"
                    required
                    value={newInvoice.unitPrice}
                    onChange={(e) => setNewInvoice({ ...newInvoice, unitPrice: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">BTW Tarief</label>
                  <select
                    value={newInvoice.vatRate}
                    onChange={(e) => setNewInvoice({ ...newInvoice, vatRate: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    <option value={21}>21% Hoog Tarief</option>
                    <option value={9}>9% Laag Tarief</option>
                    <option value={0}>0% Vrijgesteld / Verlegd</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="recCheck"
                  checked={newInvoice.isRecurring}
                  onChange={(e) => setNewInvoice({ ...newInvoice, isRecurring: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <label htmlFor="recCheck" className="font-semibold text-slate-700">
                  Maandelijks automatisch factureren (Abonnement)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateInvoiceModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                >
                  Factuur Maken & Versturen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PAY LINK SIMULATION */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-center">
            <CreditCard className="w-10 h-10 text-emerald-600 mx-auto" />
            <div>
              <h3 className="text-base font-extrabold text-slate-900">iDEAL & Online Betaling</h3>
              <p className="text-xs text-slate-500 mt-1">
                Betaallink via Mollie/Stripe voor factuur {showPaymentModal.invoiceNumber}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl font-bold text-lg text-slate-900">
              €{showPaymentModal.totalAmount.toLocaleString("nl-NL")}
            </div>

            <button
              onClick={() => {
                onUpdateInvoiceStatus(showPaymentModal.id, "betaald");
                setShowPaymentModal(null);
                alert("Simulatie: Betaling geslaagd via iDEAL!");
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Simuleer iDEAL Betaling
            </button>

            <button
              onClick={() => setShowPaymentModal(null)}
              className="text-xs text-slate-400 hover:underline block mx-auto"
            >
              Sluiten
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
