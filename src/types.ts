export type Language = "nl" | "en";

export type UserRole = "owner" | "project_manager" | "finance" | "employee";

export type SubscriptionPlan = "starter" | "business" | "enterprise";

export interface Tenant {
  id: string;
  name: string;
  kvkNumber: string;
  vatNumber: string;
  logoUrl?: string;
  primaryColor: string;
  planTier: SubscriptionPlan;
  monthlyFee: number;
  currency: string;
  industry: string;
  city: string;
  activeModules: {
    crm: boolean;
    projects: boolean;
    invoicing: boolean;
    hr: boolean;
    inventory: boolean;
    esg: boolean;
    support: boolean;
  };
}

// CRM TYPES
export type LeadStage = "lead" | "contacted" | "proposal" | "won" | "lost";

export interface CRMContact {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  city: string;
  stage: LeadStage;
  estimatedValue: number;
  notes: string;
  createdAt: string;
}

export type Contact = CRMContact;
export type Deal = CRMContact;

export interface Quote {
  id: string;
  quoteNumber: string;
  clientName: string;
  companyName: string;
  amountExVat: number;
  vatAmount: number;
  totalAmount: number;
  status: "concept" | "verzonden" | "geaccepteerd" | "geweigerd";
  validUntil: string;
  createdAt: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    vatRate: number; // 21, 9, 0
  }[];
}

// PROJECT & TIME TRACKING TYPES
export type ProjectStatus = "planning" | "in_progress" | "on_hold" | "completed";

export interface ProjectTask {
  id: string;
  title: string;
  assignedTo: string;
  dueDate: string;
  completed: boolean;
  estimatedHours: number;
  loggedHours: number;
}

export interface Project {
  id: string;
  code: string;
  title: string;
  clientName: string;
  budget: number;
  spentBudget: number;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  completionPercentage: number;
  tasks: ProjectTask[];
}

export interface TimeEntry {
  id: string;
  projectId: string;
  projectName: string;
  employeeName: string;
  date: string;
  hours: number;
  description: string;
  hourlyRate: number;
  billable: boolean;
}

// INVOICING & FINANCIAL TYPES
export type InvoiceStatus = "concept" | "verzonden" | "betaald" | "herinnering_1" | "herinnering_2" | "vervallen";

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number; // 21, 9, 0
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  subtotalExVat: number;
  vatTotal: number;
  totalAmount: number;
  items: InvoiceItem[];
  isRecurring?: boolean;
  recurringInterval?: "monthly" | "quarterly" | "yearly";
}

// HR & EMPLOYEES TYPES
export type LeaveType = "vakantie" | "ziekte" | "bijzonder" | "ouderschap";
export type LeaveStatus = "in_behandeling" | "goedgekeurd" | "afgewezen";

export interface Employee {
  id: string;
  name: string;
  email: string;
  roleTitle: string;
  department: string;
  role: UserRole;
  phone: string;
  hourlyRate: number;
  contractType: "Fulltime" | "Parttime" | "ZZP" | "Oproep";
  leaveBalanceDays: number;
  status: "Actief" | "Ziek" | "Uit dienst";
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  status: LeaveStatus;
  reason: string;
}

export interface ExpenseClaim {
  id: string;
  employeeName: string;
  category: "Reiskosten" | "Materiaal" | "Representatie" | "Gereedschap";
  amount: number;
  vatAmount: number;
  date: string;
  description: string;
  status: "ingediend" | "goedgekeurd" | "uitbetaald";
}

// INVENTORY TYPES
export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantityInStock: number;
  minStockLevel: number;
  unitCost: number;
  sellingPrice: number;
  location: string;
  assignedProject?: string;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierName: string;
  date: string;
  totalAmount: number;
  status: "Concept" | "Besteld" | "Ontvangen";
  itemsCount: number;
}

// ESG & INCIDENT TYPES
export interface CarbonMetric {
  id: string;
  month: string;
  co2EmissionsKg: number; // e.g. 1450 kg
  paperSavedPages: number; // e.g. 3200 pages
  energyKwh: number;
}

export interface SafetyIncident {
  id: string;
  date: string;
  location: string;
  severity: "Laag" | "Middel" | "Hoog";
  description: string;
  actionTaken: string;
  status: "Gemeld" | "In onderzoek" | "Afgehandeld";
}

// CHAT & SUPPORT TYPES
export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}

// ACTIVITY LOG
export interface ActivityItem {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: "CRM" | "Projecten" | "Facturatie" | "HR" | "Voorraad" | "Systeem";
}
