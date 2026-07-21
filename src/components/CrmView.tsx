import React, { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Building,
  Mail,
  Phone,
  Euro,
  FileText,
  CheckCircle,
  MoreVertical,
  X,
  Send,
} from "lucide-react";
import { CRMContact, Quote, LeadStage, Language } from "../types";

interface CrmViewProps {
  contacts: CRMContact[];
  quotes: Quote[];
  language: Language;
  onAddContact: (contact: Omit<CRMContact, "id" | "createdAt">) => void;
  onUpdateContactStage: (id: string, stage: LeadStage) => void;
  onAddQuote: (quote: Omit<Quote, "id" | "createdAt">) => void;
}

export const CrmView: React.FC<CrmViewProps> = ({
  contacts,
  quotes,
  language,
  onAddContact,
  onUpdateContactStage,
  onAddQuote,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"pipeline" | "contacts" | "quotes">("pipeline");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showAddQuoteModal, setShowAddQuoteModal] = useState(false);

  // New Contact Form State
  const [newContact, setNewContact] = useState({
    name: "",
    companyName: "",
    email: "",
    phone: "",
    city: "Utrecht",
    stage: "lead" as LeadStage,
    estimatedValue: 10000,
    notes: "",
  });

  // New Quote Form State
  const [newQuote, setNewQuote] = useState({
    clientName: "",
    companyName: "",
    amountExVat: 5000,
    itemDesc: "Werkzaamheden & Advies",
    validUntil: "2026-08-31",
  });

  const stages: { key: LeadStage; labelNL: string; labelEN: string; color: string }[] = [
    { key: "lead", labelNL: "Nieuwe Lead", labelEN: "New Lead", color: "bg-slate-100 text-slate-700 border-slate-300" },
    { key: "contacted", labelNL: "In Gesprek", labelEN: "Contacted", color: "bg-blue-50 text-blue-700 border-blue-200" },
    { key: "proposal", labelNL: "Offerte Uitgebracht", labelEN: "Proposal Sent", color: "bg-amber-50 text-amber-700 border-amber-200" },
    { key: "won", labelNL: "Gewonnen / Klant", labelEN: "Won / Client", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { key: "lost", labelNL: "Verloren", labelEN: "Lost", color: "bg-rose-50 text-rose-700 border-rose-200" },
  ];

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.name || !newContact.companyName) return;
    onAddContact(newContact);
    setShowAddContactModal(false);
    setNewContact({
      name: "",
      companyName: "",
      email: "",
      phone: "",
      city: "Utrecht",
      stage: "lead",
      estimatedValue: 10000,
      notes: "",
    });
  };

  const handleCreateQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuote.clientName || !newQuote.companyName) return;
    const vatRate = 21;
    const vatAmount = newQuote.amountExVat * (vatRate / 100);
    const totalAmount = newQuote.amountExVat + vatAmount;

    onAddQuote({
      quoteNumber: `OFF-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientName: newQuote.clientName,
      companyName: newQuote.companyName,
      amountExVat: newQuote.amountExVat,
      vatAmount,
      totalAmount,
      status: "verzonden",
      validUntil: newQuote.validUntil,
      items: [
        {
          description: newQuote.itemDesc,
          quantity: 1,
          unitPrice: newQuote.amountExVat,
          vatRate,
        },
      ],
    });
    setShowAddQuoteModal(false);
  };

  return (
    <div id="tour-crm-main" className="space-y-6">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {language === "nl" ? "CRM & Offertebeheer" : "CRM & Quote Management"}
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {language === "nl"
              ? "Volg potentiële klanten, beheer de sales pijplijn en maak direct offertes op."
              : "Track leads, manage sales pipeline and generate quotes for MKB clients."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddContactModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" />
            {language === "nl" ? "Nieuwe Lead" : "New Lead"}
          </button>

          <button
            onClick={() => setShowAddQuoteModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors uppercase tracking-wider"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            {language === "nl" ? "Offerte Maken" : "Create Quote"}
          </button>
        </div>
      </div>

      {/* SUB TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab("pipeline")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all uppercase tracking-wider ${
            activeSubTab === "pipeline"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          {language === "nl" ? "Kanban Pijplijn" : "Kanban Pipeline"}
        </button>

        <button
          onClick={() => setActiveSubTab("contacts")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all uppercase tracking-wider ${
            activeSubTab === "contacts"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          {language === "nl" ? `Relaties (${contacts.length})` : `Contacts (${contacts.length})`}
        </button>

        <button
          onClick={() => setActiveSubTab("quotes")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all uppercase tracking-wider ${
            activeSubTab === "quotes"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          {language === "nl" ? `Offertes (${quotes.length})` : `Quotes (${quotes.length})`}
        </button>
      </div>

      {/* VIEW 1: KANBAN PIPELINE */}
      {activeSubTab === "pipeline" && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {stages.map((stg) => {
            const stageContacts = contacts.filter((c) => c.stage === stg.key);
            const totalVal = stageContacts.reduce((acc, c) => acc + c.estimatedValue, 0);

            return (
              <div key={stg.key} className="bg-slate-100/80 rounded-xl p-3 border border-slate-200 flex flex-col h-[520px]">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-md border ${stg.color}`}>
                    {language === "nl" ? stg.labelNL : stg.labelEN}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{stageContacts.length}</span>
                </div>

                <div className="text-[11px] font-semibold text-slate-500 mb-3">
                  Totaal: €{totalVal.toLocaleString("nl-NL")}
                </div>

                {/* CARDS LIST */}
                <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
                  {stageContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-sm transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{contact.companyName}</h4>
                          <p className="text-[11px] text-slate-500">{contact.name}</p>
                        </div>
                        <span className="text-xs font-bold text-emerald-600">
                          €{contact.estimatedValue.toLocaleString("nl-NL")}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 line-clamp-2 bg-slate-50 p-1.5 rounded border border-slate-100">
                        {contact.notes || "Geen specifieke notitie"}
                      </p>

                      <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                        <span>{contact.city}</span>
                        
                        {/* MOVE STAGE DROPDOWN */}
                        <select
                          value={contact.stage}
                          onChange={(e) => onUpdateContactStage(contact.id, e.target.value as LeadStage)}
                          className="bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded px-1.5 py-0.5 text-[10px] font-medium text-slate-700 cursor-pointer"
                        >
                          {stages.map((s) => (
                            <option key={s.key} value={s.key}>
                              {language === "nl" ? s.labelNL : s.labelEN}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

                  {stageContacts.length === 0 && (
                    <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg">
                      Geen leads in deze fase
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: CONTACTS LIST TABLE */}
      {activeSubTab === "contacts" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Zoek contacten..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <th className="p-3">Bedrijf</th>
                  <th className="p-3">Contactpersoon</th>
                  <th className="p-3">E-mail</th>
                  <th className="p-3">Telefoon</th>
                  <th className="p-3">Plaats</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Geschatte Waarde</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredContacts.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-bold text-slate-900">{c.companyName}</td>
                    <td className="p-3">{c.name}</td>
                    <td className="p-3 text-slate-500">{c.email}</td>
                    <td className="p-3 text-slate-500">{c.phone}</td>
                    <td className="p-3">{c.city}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                        {c.stage}
                      </span>
                    </td>
                    <td className="p-3 text-right font-bold text-slate-900">
                      €{c.estimatedValue.toLocaleString("nl-NL")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: QUOTES / OFFERTES */}
      {activeSubTab === "quotes" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Uitgebrachte Offertes</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <th className="p-3">Offertenummer</th>
                  <th className="p-3">Klant & Bedrijf</th>
                  <th className="p-3">Datum</th>
                  <th className="p-3">Geldig Tot</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Totaal ex BTW</th>
                  <th className="p-3 text-right">Totaal incl BTW</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {quotes.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-blue-600">{q.quoteNumber}</td>
                    <td className="p-3 font-medium text-slate-900">{q.companyName} ({q.clientName})</td>
                    <td className="p-3 text-slate-500">{q.createdAt}</td>
                    <td className="p-3 text-slate-500">{q.validUntil}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        q.status === "geaccepteerd"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">€{q.amountExVat.toLocaleString("nl-NL")}</td>
                    <td className="p-3 text-right font-bold text-slate-900">
                      €{q.totalAmount.toLocaleString("nl-NL")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD CONTACT */}
      {showAddContactModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Nieuwe Lead / Klant Toevoegen</h3>
              <button onClick={() => setShowAddContactModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateContactSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bedrijfsnaam *</label>
                <input
                  type="text"
                  required
                  placeholder="Bijv. Bouwbedrijf Jansen B.V."
                  value={newContact.companyName}
                  onChange={(e) => setNewContact({ ...newContact, companyName: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contactpersoon *</label>
                <input
                  type="text"
                  required
                  placeholder="Bijv. Peter Jansen"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    placeholder="p.jansen@bedrijf.nl"
                    value={newContact.email}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Telefoon</label>
                  <input
                    type="text"
                    placeholder="06-12345678"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Plaats</label>
                  <input
                    type="text"
                    value={newContact.city}
                    onChange={(e) => setNewContact({ ...newContact, city: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Geschatte Waarde (€)</label>
                  <input
                    type="number"
                    value={newContact.estimatedValue}
                    onChange={(e) => setNewContact({ ...newContact, estimatedValue: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notities</label>
                <textarea
                  rows={2}
                  placeholder="Korte beschrijving van de aanvraag..."
                  value={newContact.notes}
                  onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddContactModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                >
                  Opslaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD QUOTE */}
      {showAddQuoteModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Nieuwe Offerte Opmaken</h3>
              <button onClick={() => setShowAddQuoteModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuoteSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Klant Bedrijfsnaam *</label>
                <input
                  type="text"
                  required
                  placeholder="Vries & Partners Vastgoed"
                  value={newQuote.companyName}
                  onChange={(e) => setNewQuote({ ...newQuote, companyName: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contactpersoon *</label>
                <input
                  type="text"
                  required
                  placeholder="Jan-Willem de Vries"
                  value={newQuote.clientName}
                  onChange={(e) => setNewQuote({ ...newQuote, clientName: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Omschrijving Posten</label>
                <input
                  type="text"
                  required
                  placeholder="Verbouwing & Installatietechniek Fase 1"
                  value={newQuote.itemDesc}
                  onChange={(e) => setNewQuote({ ...newQuote, itemDesc: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bedrag ex BTW (€)</label>
                  <input
                    type="number"
                    required
                    value={newQuote.amountExVat}
                    onChange={(e) => setNewQuote({ ...newQuote, amountExVat: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Geldig Tot</label>
                  <input
                    type="date"
                    value={newQuote.validUntil}
                    onChange={(e) => setNewQuote({ ...newQuote, validUntil: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-between">
                <span className="font-semibold text-slate-700">Totaal incl. 21% BTW:</span>
                <span className="text-sm font-bold text-blue-700">
                  €{(newQuote.amountExVat * 1.21).toLocaleString("nl-NL")}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddQuoteModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  Offerte Verzenden
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
