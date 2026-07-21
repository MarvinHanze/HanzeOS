import React, { useState } from "react";
import {
  Package,
  AlertTriangle,
  Plus,
  Search,
  ShoppingCart,
  CheckCircle,
  Truck,
  Building2,
  X,
} from "lucide-react";
import { InventoryItem, PurchaseOrder, Language } from "../types";

interface InventoryViewProps {
  inventory: InventoryItem[];
  purchaseOrders: PurchaseOrder[];
  language: Language;
  onUpdateStock: (itemId: string, newQty: number) => void;
  onAddInventoryItem: (item: Omit<InventoryItem, "id">) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  inventory,
  purchaseOrders,
  language,
  onUpdateStock,
  onAddInventoryItem,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [newItem, setNewItem] = useState({
    sku: "MAT-NEW-100",
    name: "Installatiekabel YMVK 3x1.5mm",
    category: "Elektra",
    quantityInStock: 25,
    minStockLevel: 10,
    unitCost: 45,
    sellingPrice: 85,
    location: "Magazijn Utrecht - Stelling 2",
  });

  const filteredItems = inventory.filter(
    (i) =>
      i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockCount = inventory.filter((i) => i.quantityInStock <= i.minStockLevel).length;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddInventoryItem(newItem);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {language === "nl" ? "Voorraad & Assetbeheer" : "Inventory & Asset Management"}
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Materieel, magazijnlocaties, automatische bestelmeldingen en toewijzing aan bouwprojecten.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" />
          {language === "nl" ? "Artikel Toevoegen" : "Add Item"}
        </button>
      </div>

      {/* ALERT FOR LOW STOCK */}
      {lowStockCount > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-800">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-bold">Magazijn Waarschuwing</p>
              <p>{lowStockCount} artikelen hebben hun minimale voorraadniveau bereikt!</p>
            </div>
          </div>
          <button
            onClick={() => alert("Automatische inkooporder klaargezet bij leverancier Technische Unie B.V.")}
            className="px-3 py-1.5 bg-amber-600 text-white font-bold rounded-lg text-xs"
          >
            Bestel Aanvulling
          </button>
        </div>
      )}

      {/* SEARCH BAR */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Zoek artikel, SKU of categorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-hidden"
          />
        </div>
      </div>

      {/* INVENTORY TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <th className="p-3">SKU Code</th>
                <th className="p-3">Artikel Omschrijving</th>
                <th className="p-3">Categorie</th>
                <th className="p-3">Locatie</th>
                <th className="p-3 text-center">Voorraad Status</th>
                <th className="p-3 text-right">Inkoopprijs</th>
                <th className="p-3 text-right">Verkoopprijs</th>
                <th className="p-3 text-center">Aantal Aanpassen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredItems.map((item) => {
                const isLow = item.quantityInStock <= item.minStockLevel;

                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-900">{item.sku}</td>
                    <td className="p-3 font-bold text-slate-900">{item.name}</td>
                    <td className="p-3 text-slate-500">{item.category}</td>
                    <td className="p-3 text-slate-500">{item.location}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isLow
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {item.quantityInStock} stuks {isLow ? "(LAGE VOORRAAD)" : ""}
                      </span>
                    </td>
                    <td className="p-3 text-right">€{item.unitCost.toFixed(2)}</td>
                    <td className="p-3 text-right font-bold text-slate-900">€{item.sellingPrice.toFixed(2)}</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onUpdateStock(item.id, Math.max(0, item.quantityInStock - 1))}
                          className="w-6 h-6 bg-slate-100 hover:bg-slate-200 rounded font-bold text-slate-700"
                        >
                          -
                        </button>
                        <span className="w-8 font-bold text-center">{item.quantityInStock}</span>
                        <button
                          onClick={() => onUpdateStock(item.id, item.quantityInStock + 1)}
                          className="w-6 h-6 bg-slate-100 hover:bg-slate-200 rounded font-bold text-slate-700"
                        >
                          +
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PURCHASE ORDERS LIST */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Truck className="w-4 h-4 text-blue-600" />
          Recent Geplaatste Inkooporders bij Leveranciers
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {purchaseOrders.map((po) => (
            <div key={po.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-900">{po.supplierName}</p>
                <p className="text-[11px] text-slate-500">{po.orderNumber} • {po.date}</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-900 block">€{po.totalAmount.toLocaleString("nl-NL")}</span>
                <span className="px-2 py-0.5 text-[9px] font-bold bg-blue-100 text-blue-700 rounded-full">
                  {po.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: ADD ITEM */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Nieuw Magazijn Artikel</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Artikel Naam *</label>
                <input
                  type="text"
                  required
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={newItem.sku}
                    onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Categorie</label>
                  <input
                    type="text"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Aantal in Voorraad</label>
                  <input
                    type="number"
                    value={newItem.quantityInStock}
                    onChange={(e) => setNewItem({ ...newItem, quantityInStock: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Minimale Drempel</label>
                  <input
                    type="number"
                    value={newItem.minStockLevel}
                    onChange={(e) => setNewItem({ ...newItem, minStockLevel: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                >
                  Artikel Opslaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
