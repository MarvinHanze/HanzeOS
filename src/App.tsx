import React, { useState, useEffect, Suspense, lazy } from "react";
import {
  INITIAL_TENANTS,
  INITIAL_CONTACTS,
  INITIAL_QUOTES,
  INITIAL_PROJECTS,
  INITIAL_TIME_ENTRIES,
  INITIAL_INVOICES,
  INITIAL_EMPLOYEES,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_EXPENSES,
  INITIAL_INVENTORY,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_CARBON_METRICS,
  INITIAL_INCIDENTS,
  INITIAL_ACTIVITIES,
} from "./data/mockDatabase";
import {
  Tenant,
  UserRole,
  Language,
  Contact,
  Deal,
  Quote,
  Project,
  TimeEntry,
  Invoice,
  InvoiceStatus,
  Employee,
  LeaveRequest,
  ExpenseClaim,
  InventoryItem,
  PurchaseOrder,
  CarbonMetric,
  SafetyIncident,
  SubscriptionPlan,
} from "./types";

import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";

// Code-split per tab: only the module a tenant actually clicks into gets
// downloaded, instead of bundling all 8 feature views (+ their chart/AI
// dependencies) into everyone's first load.
const DashboardView = lazy(() => import("./components/DashboardView").then((m) => ({ default: m.DashboardView })));
const CrmView = lazy(() => import("./components/CrmView").then((m) => ({ default: m.CrmView })));
const ProjectsView = lazy(() => import("./components/ProjectsView").then((m) => ({ default: m.ProjectsView })));
const InvoicingView = lazy(() => import("./components/InvoicingView").then((m) => ({ default: m.InvoicingView })));
const HrView = lazy(() => import("./components/HrView").then((m) => ({ default: m.HrView })));
const InventoryView = lazy(() => import("./components/InventoryView").then((m) => ({ default: m.InventoryView })));
const EsgView = lazy(() => import("./components/EsgView").then((m) => ({ default: m.EsgView })));
const AiSupportView = lazy(() => import("./components/AiSupportView").then((m) => ({ default: m.AiSupportView })));

import { MarketplaceModal } from "./components/MarketplaceModal";
import { SubscriptionModal } from "./components/SubscriptionModal";
import { OnboardingModal } from "./components/OnboardingModal";
import { InteractiveTour } from "./components/InteractiveTour";

export default function App() {
  // TENANTS STATE
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [currentTenantId, setCurrentTenantId] = useState<string>(INITIAL_TENANTS[0].id);

  // GLOBAL CONTEXT STATE
  const [userRole, setUserRole] = useState<UserRole>("owner");
  const [language, setLanguage] = useState<Language>("nl");
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [searchTerm, setSearchTerm] = useState("");

  // MODALS STATE
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTour, setShowTour] = useState(() => {
    try {
      const tourCompleted = localStorage.getItem("hanzeos_tour_completed");
      return !tourCompleted;
    } catch {
      return true;
    }
  });

  const handleCloseTour = () => {
    try {
      localStorage.setItem("hanzeos_tour_completed", "true");
    } catch {
      // ignore
    }
    setShowTour(false);
  };

  // ENTITY DATA STATES
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [deals, setDeals] = useState<Deal[]>(INITIAL_CONTACTS);

  const [quotes, setQuotes] = useState<Quote[]>(INITIAL_QUOTES);

  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(INITIAL_TIME_ENTRIES);

  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);

  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(INITIAL_LEAVE_REQUESTS);
  const [expenseClaims, setExpenseClaims] = useState<ExpenseClaim[]>(INITIAL_EXPENSES);

  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);

  const [carbonMetrics] = useState<CarbonMetric[]>(INITIAL_CARBON_METRICS);
  const [incidents, setIncidents] = useState<SafetyIncident[]>(INITIAL_INCIDENTS);
  const [activities] = useState(INITIAL_ACTIVITIES);

  const currentTenant = tenants.find((t) => t.id === currentTenantId) || tenants[0];

  useEffect(() => {
    if (currentTenant?.primaryColor) {
      document.documentElement.style.setProperty("--primary-brand", currentTenant.primaryColor);
    }
  }, [currentTenant?.primaryColor]);

  // HANDLERS FOR TENANT & MODULE CONFIGURATION
  const handleToggleModule = (moduleKey: keyof Tenant["activeModules"]) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === currentTenantId) {
          return {
            ...t,
            activeModules: {
              ...t.activeModules,
              [moduleKey]: !t.activeModules[moduleKey],
            },
          };
        }
        return t;
      })
    );
  };

  const handleUpdatePlan = (plan: SubscriptionPlan) => {
    const fee = plan === "starter" ? 15 : plan === "business" ? 49 : 199;
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === currentTenantId) {
          return {
            ...t,
            planTier: plan,
            monthlyFee: fee,
          };
        }
        return t;
      })
    );
  };

  const handleUpdateBranding = (primaryColor: string, logoUrl?: string) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === currentTenantId) {
          return {
            ...t,
            primaryColor,
            logoUrl,
          };
        }
        return t;
      })
    );
  };

  const handleCompleteOnboarding = (newTenant: Tenant) => {
    setTenants((prev) => [...prev, newTenant]);
    setCurrentTenantId(newTenant.id);
    setShowOnboarding(false);
    setShowTour(true);
  };

  // HANDLERS FOR CRM
  const handleUpdateDealStage = (dealId: string, newStage: Deal["stage"]) => {
    setDeals((prev) => prev.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d)));
  };

  const handleAddQuote = (quote: Omit<Quote, "id">) => {
    const newQuote: Quote = { ...quote, id: `q-${Date.now()}` };
    setQuotes((prev) => [newQuote, ...prev]);
  };

  const handleAddContact = (contact: Omit<Contact, "id">) => {
    const newContact: Contact = { ...contact, id: `c-${Date.now()}` };
    setContacts((prev) => [newContact, ...prev]);
  };

  // HANDLERS FOR PROJECTS & TIME TRACKING
  const handleAddTimeEntry = (entry: Omit<TimeEntry, "id">) => {
    const newEntry: TimeEntry = { ...entry, id: `te-${Date.now()}` };
    setTimeEntries((prev) => [newEntry, ...prev]);

    // Update logged hours on project
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === entry.projectId) {
          return {
            ...p,
            spentBudget: p.spentBudget + entry.hours * entry.hourlyRate,
          };
        }
        return p;
      })
    );
  };

  const handleToggleTask = (projectId: string, taskId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
          };
        }
        return p;
      })
    );
  };

  const handleAddProject = (project: Omit<Project, "id">) => {
    const newProj: Project = { ...project, id: `proj-${Date.now()}` };
    setProjects((prev) => [newProj, ...prev]);
  };

  // HANDLERS FOR INVOICING
  const handleAddInvoice = (invoice: Omit<Invoice, "id">) => {
    const newInv: Invoice = { ...invoice, id: `inv-${Date.now()}` };
    setInvoices((prev) => [newInv, ...prev]);
  };

  const handleUpdateInvoiceStatus = (id: string, status: InvoiceStatus) => {
    setInvoices((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  // HANDLERS FOR HR
  const handleApproveLeave = (id: string) => {
    setLeaveRequests((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "goedgekeurd" as const } : l))
    );
  };

  const handleRejectLeave = (id: string) => {
    setLeaveRequests((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "afgewezen" as const } : l))
    );
  };

  const handleApproveExpense = (id: string) => {
    setExpenseClaims((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "goedgekeurd" as const } : e))
    );
  };

  // HANDLERS FOR INVENTORY
  const handleUpdateStock = (itemId: string, newQty: number) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantityInStock: newQty } : item))
    );
  };

  const handleAddInventoryItem = (item: Omit<InventoryItem, "id">) => {
    const newItem: InventoryItem = { ...item, id: `inv-item-${Date.now()}` };
    setInventory((prev) => [newItem, ...prev]);
  };

  // HANDLERS FOR ESG
  const handleAddIncident = (incident: Omit<SafetyIncident, "id">) => {
    const newInc: SafetyIncident = { ...incident, id: `inc-${Date.now()}` };
    setIncidents((prev) => [newInc, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-900">
      
      {/* NAVBAR */}
      <Navbar
        tenants={tenants}
        currentTenant={currentTenant}
        userRole={userRole}
        language={language}
        onSelectTenant={setCurrentTenantId}
        onChangeRole={setUserRole}
        onChangeLanguage={setLanguage}
        onOpenMarketplace={() => setShowMarketplace(true)}
        onOpenSubscription={() => setShowSubscription(true)}
        onOpenNewTenantModal={() => setShowOnboarding(true)}
        onOpenTour={() => setShowTour(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* MAIN CONTAINER WITH SIDEBAR & CONTENT */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SIDEBAR NAVIGATION */}
        <div className="lg:col-span-3">
          <Sidebar
            currentTenant={currentTenant}
            activeTab={activeTab}
            language={language}
            onSelectTab={setActiveTab}
            onOpenMarketplace={() => setShowMarketplace(true)}
            onOpenSubscription={() => setShowSubscription(true)}
          />
        </div>

        {/* MAIN VIEW CONTENT */}
        <main className="lg:col-span-9 space-y-6">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
              Laden...
            </div>
          }
        >
          {activeTab === "dashboard" && (
            <DashboardView
              currentTenant={currentTenant}
              invoices={invoices}
              projects={projects}
              timeEntries={timeEntries}
              contacts={contacts}
              deals={deals}
              activities={activities}
              language={language}
              onNavigateTo={(tab) => setActiveTab(tab)}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenNewInvoice={() => setActiveTab("invoicing")}
              onOpenNewQuote={() => setActiveTab("crm")}
              onOpenNewTimeEntry={() => setActiveTab("projects")}
              onOpenNewContact={() => setActiveTab("crm")}
            />
          )}

          {activeTab === "crm" && (
            <CrmView
              contacts={contacts}
              deals={deals}
              quotes={quotes}
              language={language}
              onUpdateDealStage={handleUpdateDealStage}
              onAddQuote={handleAddQuote}
              onAddContact={handleAddContact}
            />
          )}

          {activeTab === "projects" && (
            <ProjectsView
              projects={projects}
              timeEntries={timeEntries}
              language={language}
              onAddTimeEntry={handleAddTimeEntry}
              onToggleTask={handleToggleTask}
              onAddProject={handleAddProject}
            />
          )}

          {activeTab === "invoicing" && (
            <InvoicingView
              invoices={invoices}
              language={language}
              onAddInvoice={handleAddInvoice}
              onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
            />
          )}

          {activeTab === "hr" && (
            <HrView
              employees={employees}
              leaveRequests={leaveRequests}
              expenseClaims={expenseClaims}
              userRole={userRole}
              language={language}
              onApproveLeave={handleApproveLeave}
              onRejectLeave={handleRejectLeave}
              onApproveExpense={handleApproveExpense}
            />
          )}

          {activeTab === "inventory" && (
            <InventoryView
              inventory={inventory}
              purchaseOrders={purchaseOrders}
              language={language}
              onUpdateStock={handleUpdateStock}
              onAddInventoryItem={handleAddInventoryItem}
            />
          )}

          {activeTab === "esg" && (
            <EsgView
              carbonMetrics={carbonMetrics}
              incidents={incidents}
              language={language}
              onAddIncident={handleAddIncident}
            />
          )}

          {activeTab === "support" && (
            <AiSupportView currentTenant={currentTenant} language={language} />
          )}
        </Suspense>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 HanzeOS — Het modulaire MKB Bedrijfsplatform. KvK-compliant & Cloud-hosted in Nederland.
          </span>
          <span className="font-semibold text-slate-700">
            Huidige Entiteit: <span className="text-blue-600">{currentTenant.name}</span> ({currentTenant.industry})
          </span>
        </div>
      </footer>

      {/* GLOBAL MODALS */}
      {showMarketplace && (
        <MarketplaceModal
          currentTenant={currentTenant}
          language={language}
          onToggleModule={handleToggleModule}
          onClose={() => setShowMarketplace(false)}
          onOpenSubscription={() => setShowSubscription(true)}
        />
      )}

      {showSubscription && (
        <SubscriptionModal
          currentTenant={currentTenant}
          language={language}
          onUpdatePlan={handleUpdatePlan}
          onUpdateBranding={handleUpdateBranding}
          onAddInvoice={handleAddInvoice}
          onStartTour={() => {
            setShowSubscription(false);
            setShowTour(true);
          }}
          onClose={() => setShowSubscription(false)}
        />
      )}

      {showOnboarding && (
        <OnboardingModal
          onComplete={handleCompleteOnboarding}
          onClose={() => setShowOnboarding(false)}
        />
      )}

      <InteractiveTour
        isOpen={showTour}
        onClose={handleCloseTour}
        onNavigateTab={(tab) => setActiveTab(tab)}
        language={language}
      />

    </div>
  );
}
