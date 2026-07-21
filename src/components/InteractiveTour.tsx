import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2,
  LayoutDashboard,
  Users,
  Grid,
  CreditCard,
  Bot,
  Shield,
  Lightbulb,
  BarChart3,
  Lock,
  FileText,
  ShoppingBag,
  Rocket,
  ArrowUp,
  ArrowLeft,
  ArrowDown,
  ArrowRight,
  Target,
  Compass,
} from "lucide-react";
import { Language } from "../types";

interface InteractiveTourProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  language: Language;
}

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
}

export const InteractiveTour: React.FC<InteractiveTourProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  language,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);

  const steps = [
    {
      title: language === "nl" ? "Welkom bij HanzeOS MKB!" : "Welcome to HanzeOS MKB!",
      subtitle:
        language === "nl"
          ? "Interactieve Platform Tour & Snelstart Handleiding"
          : "Interactive Platform Tour & Quickstart Guide",
      icon: Sparkles,
      color: "from-indigo-600 to-blue-600",
      targetTab: "dashboard",
      targetSelector: "#tour-dashboard-main",
      pointerLabel: language === "nl" ? "Overzicht Platform Workspace Canvas" : "Platform Workspace Canvas",
      description:
        language === "nl"
          ? "HanzeOS is hét alles-in-één modulaire SaaS platform voor het Nederlandse MKB. Beheer uw complete bedrijfsvoering — van CRM en projecten tot geautomatiseerde facturatie, HR en AI-ondersteuning."
          : "HanzeOS is the all-in-one modular SaaS platform for SME businesses. Manage your entire operation — from CRM and projects to automated invoicing, HR, and AI.",
      highlightIcon: Lightbulb,
      highlightText:
        language === "nl"
          ? "Tip: U kunt de tour op elk moment sluiten of via de navigatiebalk opnieuw starten."
          : "Tip: You can close or restart the tour anytime from the top navigation bar.",
    },
    {
      title: language === "nl" ? "1. Real-Time KPI Dashboard" : "1. Real-Time KPI Dashboard",
      subtitle:
        language === "nl"
          ? "Inzicht in Omzet, Facturen, Projecten & Werkdruk"
          : "Insights into Revenue, Invoices, Projects & Workload",
      icon: LayoutDashboard,
      color: "from-blue-600 to-cyan-600",
      targetTab: "dashboard",
      targetSelector: "#tour-kpis",
      pointerLabel: language === "nl" ? "Kijk hier: Live KPI Cards & Recharts Omzettrend" : "Look here: Live KPI Cards & Recharts Revenue Trend",
      description:
        language === "nl"
          ? "Het dynamische dashboard ververst gegevens automatisch in real-time. Bekijk live omzettrends met kwartaalprognoses, openstaande factuurtermijnen, klantacquisitie en medewerkersbelasting."
          : "The dynamic dashboard auto-refreshes data in real-time. View live revenue trends with forecast projections, aging invoices, acquisition, and team workload.",
      highlightIcon: BarChart3,
      highlightText:
        language === "nl"
          ? "Bevat interactieve Recharts grafieken en direct schakelbare prognosetrendlijnen."
          : "Features interactive Recharts graphs with togglable forecast trendlines.",
    },
    {
      title: language === "nl" ? "2. Multi-Tenant & Gebruikersrollen (RBAC)" : "2. Multi-Tenant & Role Access (RBAC)",
      subtitle:
        language === "nl"
          ? "Schakel tussen B.V.'s & Test Beheerdersrechten"
          : "Switch between Entities & Test Admin Permissions",
      icon: Shield,
      color: "from-purple-600 to-indigo-600",
      targetTab: "dashboard",
      targetSelector: "#tour-tenant-select",
      pointerLabel: language === "nl" ? "Kijk hier: Bedrijfsswitcher & Rolselector in Navigatiebalk" : "Look here: Company Switcher & Role Selector in Top Header",
      description:
        language === "nl"
          ? "Beheer meerdere entiteiten/B.V.'s vanuit één overzicht. Met de rol-selector in de topbalk test u eenvoudig rechten voor Eigenaar, Projectmanager, Financieel Medewerker en Personeel."
          : "Manage multiple business entities from a single unified view. Test role access for Owner, PM, Finance, and Staff using the top bar controls.",
      highlightIcon: Lock,
      highlightText:
        language === "nl"
          ? "Voldoet aan Nederlandse AVG privacy- en geheimhoudingsnormen met RBAC-toegangscontrole."
          : "Compliant with privacy guidelines and RBAC access controls.",
    },
    {
      title: language === "nl" ? "3. CRM, Offertes & Sales Pijplijn" : "3. CRM, Quotes & Sales Pipeline",
      subtitle:
        language === "nl"
          ? "Van Lead naar Geaccepteerde Offerte"
          : "From Lead to Accepted Proposal",
      icon: Users,
      color: "from-amber-600 to-orange-600",
      targetTab: "crm",
      targetSelector: "#tour-crm-main",
      pointerLabel: language === "nl" ? "Kijk hier: CRM Sales Pijplijn & Offerte Canvas" : "Look here: CRM Sales Pipeline & Proposal Workspace",
      description:
        language === "nl"
          ? "Volg al uw B2B klantrelaties in een overzichtelijke Kanban-pijplijn. Genereer binnen 30 seconden professionele offertes met BTW-specificaties en digitale akkoordlinks."
          : "Track B2B client deals in an intuitive Kanban pipeline. Generate official proposals with VAT details and digital approval links.",
      highlightIcon: FileText,
      highlightText:
        language === "nl"
          ? "Offertes worden met één klik automatisch omgezet in actieve projecten of facturen."
          : "Convert accepted quotes into active projects or invoices with a single click.",
    },
    {
      title: language === "nl" ? "4. App Store & Module Navigatie" : "4. App Store & Module Navigation",
      subtitle:
        language === "nl"
          ? "Schakel Flexibel Modules Aan & Uit"
          : "Enable or Disable Modules Flexibly",
      icon: Grid,
      color: "from-emerald-600 to-teal-600",
      targetTab: "dashboard",
      targetSelector: "#tour-modules-btn",
      pointerLabel: language === "nl" ? "Kijk hier: 'Modules (7/7)' Knop in de Bovenbalk" : "Look here: 'Modules (7/7)' Button in Top Navigation",
      description:
        language === "nl"
          ? "Betaal alleen voor wat u gebruikt. Activeer of deactiveer CRM, Projecten, Facturatie, HR, Voorraad, ESG en AI Bedrijfsadviseur via de HanzeOS App Store."
          : "Only pay for what you use. Enable or disable modules like CRM, Invoicing, HR, Inventory, ESG, and AI Support anytime.",
      highlightIcon: ShoppingBag,
      highlightText:
        language === "nl"
          ? "Modulewijzigingen worden direct verwerkt in uw maandelijkse abonnement factuur."
          : "Module changes automatically recalculate your monthly subscription billing.",
    },
    {
      title: language === "nl" ? "5. Abonnement & Geautomatiseerde Betalingen" : "5. Subscriptions & Payments",
      subtitle:
        language === "nl"
          ? "Stripe/Mollie iDEAL, Automatische Herinneringen & Huisstijl"
          : "Stripe/Mollie iDEAL, Automated Reminders & Branding",
      icon: CreditCard,
      color: "from-indigo-600 to-violet-600",
      targetTab: "dashboard",
      targetSelector: "#tour-subscription-btn",
      pointerLabel: language === "nl" ? "Kijk hier: Abonnement & Huisstijl Knop (Bovenbalk)" : "Look here: Subscription & Branding Button (Top Header)",
      description:
        language === "nl"
          ? "Volledig geautomatiseerde facturatie voor uw klanten én uw eigen SaaS-abonnement. Ondersteunt iDEAL betalingen, automatische herinneringsschema's en het instellen van uw eigen merkkleur."
          : "Automated billing for both client invoicing and SaaS subscriptions. Supports iDEAL payments, automated reminder schedules, and brand color customization.",
      highlightIcon: CreditCard,
      highlightText:
        language === "nl"
          ? "Inclusief automatische herinneringen voor verlopen facturen met iDEAL betaallink en merkkleur selectie."
          : "Includes automated reminders for overdue invoices with instant payment links and brand color options.",
    },
    {
      title: language === "nl" ? "6. AI Bedrijfsadviseur (Gemini)" : "6. AI Business Advisor (Gemini)",
      subtitle:
        language === "nl"
          ? "24/7 Fiscaal & Operationeel Advies"
          : "24/7 Tax & Operational Expertise",
      icon: Bot,
      color: "from-rose-600 to-pink-600",
      targetTab: "support",
      targetSelector: "#tour-ai-chat-box",
      pointerLabel: language === "nl" ? "Kijk hier: AI Support Module & Chatbot Workspace" : "Look here: AI Support Module & Chatbot Workspace",
      description:
        language === "nl"
          ? "Ingebouwde AI-assistent aangedreven door Gemini. Stel vragen over de Nederlandse KOR-regeling, CAO Bouw & Techniek, WKA-verklaringen of vraag direct hulp bij het opstellen van een offerte-tekst."
          : "Built-in Gemini AI advisor for Dutch business operations, tax rules, and instant text drafting.",
      highlightIcon: Rocket,
      highlightText:
        language === "nl"
          ? "U bent nu helemaal klaar om HanzeOS MKB te verkennen!"
          : "You're now fully equipped to explore HanzeOS MKB!",
    },
  ];

  const stepData = steps[currentStep];
  const IconComponent = stepData.icon;
  const HighlightIconComponent = stepData.highlightIcon;

  // DYNAMICALLY TRACK TARGET ELEMENT BOUNDING RECT, HIGHLIGHT EFFECT & AUTO SCROLL
  useEffect(() => {
    if (!isOpen) return;

    // Navigate to target tab for this step
    onNavigateTab(stepData.targetTab);

    let activeEl: HTMLElement | null = null;
    let prevPos = "";
    let prevZIndex = "";
    let prevBoxShadow = "";
    let prevTransition = "";

    const restoreActiveEl = () => {
      if (activeEl) {
        activeEl.style.position = prevPos;
        activeEl.style.zIndex = prevZIndex;
        activeEl.style.boxShadow = prevBoxShadow;
        activeEl.style.transition = prevTransition;
        activeEl = null;
      }
    };

    const updateTargetPos = () => {
      const el = document.querySelector(stepData.targetSelector) as HTMLElement | null;
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
        const rect = el.getBoundingClientRect();
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          right: rect.right,
          bottom: rect.bottom,
        });

        // Apply highlight effect directly on the target element
        if (activeEl !== el) {
          restoreActiveEl();
          activeEl = el;
          prevPos = el.style.position;
          prevZIndex = el.style.zIndex;
          prevBoxShadow = el.style.boxShadow;
          prevTransition = el.style.transition;

          const computedPos = window.getComputedStyle(el).position;
          if (computedPos === "static") {
            el.style.position = "relative";
          }
          el.style.zIndex = "40";
          el.style.transition = "box-shadow 0.3s ease, transform 0.3s ease";
          el.style.boxShadow = "0 0 0 4px rgba(99, 102, 241, 0.8), 0 12px 35px -5px rgba(99, 102, 241, 0.4)";
        }
      } else {
        setTargetRect(null);
      }
    };

    updateTargetPos();
    const t1 = setTimeout(updateTargetPos, 100);
    const t2 = setTimeout(updateTargetPos, 300);
    const t3 = setTimeout(updateTargetPos, 600);

    window.addEventListener("resize", updateTargetPos);
    window.addEventListener("scroll", updateTargetPos, true);

    return () => {
      restoreActiveEl();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener("resize", updateTargetPos);
      window.removeEventListener("scroll", updateTargetPos, true);
    };
  }, [isOpen, currentStep, stepData.targetSelector, stepData.targetTab, onNavigateTab]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
    }
  };

  // CALCULATE CALLOUT POINTER POSITION AND DIRECTION
  let arrowType: "up" | "down" | "left" | "right" = "down";
  let calloutStyle: React.CSSProperties = {};

  if (targetRect) {
    if (targetRect.top < 120) {
      // Top bar elements (Navbar)
      arrowType = "up";
      calloutStyle = {
        position: "fixed",
        top: `${Math.min(window.innerHeight - 80, targetRect.bottom + 14)}px`,
        left: `${Math.max(16, Math.min(window.innerWidth - 300, targetRect.left + targetRect.width / 2 - 120))}px`,
      };
    } else if (targetRect.left < 260) {
      // Left sidebar elements
      arrowType = "left";
      calloutStyle = {
        position: "fixed",
        top: `${Math.max(70, Math.min(window.innerHeight - 80, targetRect.top + targetRect.height / 2 - 20))}px`,
        left: `${Math.min(window.innerWidth - 320, targetRect.right + 16)}px`,
      };
    } else if (targetRect.left > window.innerWidth - 320) {
      // Right edge elements
      arrowType = "right";
      calloutStyle = {
        position: "fixed",
        top: `${Math.max(70, Math.min(window.innerHeight - 80, targetRect.top + targetRect.height / 2 - 20))}px`,
        left: `${Math.max(16, targetRect.left - 240)}px`,
      };
    } else {
      // Canvas / Main body elements
      if (targetRect.top < 160) {
        arrowType = "up";
        calloutStyle = {
          position: "fixed",
          top: `${Math.min(window.innerHeight - 80, targetRect.bottom + 14)}px`,
          left: `${Math.max(16, Math.min(window.innerWidth - 300, targetRect.left + targetRect.width / 2 - 120))}px`,
        };
      } else {
        arrowType = "down";
        calloutStyle = {
          position: "fixed",
          top: `${Math.max(70, targetRect.top - 58)}px`,
          left: `${Math.max(16, Math.min(window.innerWidth - 300, targetRect.left + targetRect.width / 2 - 120))}px`,
        };
      }
    }
  }

  // SMART NON-BLOCKING CARD POSITIONING
  let cardPositionClass = "bottom-6 right-6 sm:bottom-8 sm:right-8";
  if (targetRect) {
    const isBottomHalf = targetRect.top > window.innerHeight * 0.55;
    const isRightHalf = targetRect.left > window.innerWidth * 0.5;
    if (isBottomHalf && isRightHalf) {
      cardPositionClass = "bottom-6 left-6 sm:bottom-8 sm:left-8";
    } else if (isBottomHalf) {
      cardPositionClass = "top-20 right-6 sm:right-8";
    }
  }

  return (
    <>
      {/* SVG SPOTLIGHT BACKDROP WITH MASK CUTOUT */}
      {targetRect && (
        <svg className="fixed inset-0 w-full h-full pointer-events-none z-30 transition-all duration-300">
          <defs>
            <mask id="tour-spotlight-hole">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <rect
                x={Math.max(0, targetRect.left - 8)}
                y={Math.max(0, targetRect.top - 8)}
                width={targetRect.width + 16}
                height={targetRect.height + 16}
                rx="16"
                fill="black"
              />
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(15, 23, 42, 0.65)"
            mask="url(#tour-spotlight-hole)"
          />
        </svg>
      )}

      {/* SPOTLIGHT GLOWING RING & DYNAMICALLY POSITIONED ARROW OVERLAY */}
      {targetRect && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {/* HIGH-INTENSITY ILLUMINATED SPOTLIGHT BORDER */}
          <div
            className="fixed rounded-2xl pointer-events-none transition-all duration-300 ring-4 ring-indigo-500/90 shadow-[0_0_35px_rgba(99,102,241,0.8)] z-45 animate-pulse"
            style={{
              top: `${Math.max(0, targetRect.top - 8)}px`,
              left: `${Math.max(0, targetRect.left - 8)}px`,
              width: `${targetRect.width + 16}px`,
              height: `${targetRect.height + 16}px`,
            }}
          />

          {/* DYNAMIC POSITIONED BOUNCING ARROW CALLOUT */}
          <div
            className="fixed z-50 pointer-events-none transition-all duration-300"
            style={calloutStyle}
          >
            <div className="bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-2xl border-2 border-amber-400 flex items-center gap-2.5 animate-bounce">
              {arrowType === "up" && <ArrowUp className="w-5 h-5 text-amber-300 flex-shrink-0" />}
              {arrowType === "left" && <ArrowLeft className="w-5 h-5 text-amber-300 flex-shrink-0" />}
              {arrowType === "down" && <ArrowDown className="w-5 h-5 text-amber-300 flex-shrink-0" />}
              {arrowType === "right" && <ArrowRight className="w-5 h-5 text-amber-300 flex-shrink-0" />}
              <span className="text-xs font-black tracking-wide whitespace-nowrap">
                {stepData.pointerLabel}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SMART NON-BLOCKING TOUR CARD POPOVER */}
      <div className={`fixed ${cardPositionClass} max-w-lg w-[calc(100%-2rem)] z-[60] transition-all duration-300`}>
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 relative overflow-hidden">
          
          {/* TOP COLOR ACCENT BAR */}
          <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${stepData.color}`} />

          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            title={language === "nl" ? "Tour sluiten" : "Close tour"}
          >
            <X className="w-5 h-5" />
          </button>

          {/* HEADER & STEP BADGE */}
          <div className="flex items-start gap-4 pr-8">
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stepData.color} text-white flex items-center justify-center flex-shrink-0 shadow-md`}
            >
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-extrabold text-[10px] rounded-full uppercase tracking-wider border border-indigo-100 flex items-center gap-1">
                  <Compass className="w-3 h-3 text-indigo-600" />
                  {language === "nl"
                    ? `Stap ${currentStep + 1} van ${steps.length}`
                    : `Step ${currentStep + 1} of ${steps.length}`}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-1">
                {stepData.title}
              </h2>
              <p className="text-xs font-semibold text-slate-500">{stepData.subtitle}</p>
            </div>
          </div>

          {/* STEPPER PROGRESS BARS */}
          <div className="flex items-center gap-1.5 pt-1">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentStep(idx);
                }}
                className={`flex-1 h-2 rounded-full transition-all ${
                  idx === currentStep
                    ? "bg-indigo-600 ring-2 ring-indigo-200"
                    : idx < currentStep
                    ? "bg-indigo-400"
                    : "bg-slate-200 hover:bg-slate-300"
                }`}
              />
            ))}
          </div>

          {/* VISUAL LOCATION BADGE */}
          <div className="p-2.5 bg-slate-900 rounded-2xl text-white text-xs font-bold flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2 truncate">
              <Target className="w-4 h-4 text-amber-400 flex-shrink-0 animate-pulse" />
              <span className="truncate">{stepData.pointerLabel}</span>
            </div>
            <span className="text-[10px] bg-indigo-600 px-2 py-0.5 rounded-lg text-white font-black uppercase flex-shrink-0">
              Interactief
            </span>
          </div>

          {/* DESCRIPTION CONTENT */}
          <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <p className="text-xs sm:text-sm text-slate-700 font-medium">{stepData.description}</p>

            <div className="p-3 bg-indigo-50/80 rounded-2xl border border-indigo-100 text-indigo-900 font-semibold flex items-start gap-2.5">
              <HighlightIconComponent className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
              <span>{stepData.highlightText}</span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              {language === "nl" ? "Vorige" : "Previous"}
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3 py-2 text-slate-500 hover:text-slate-800 font-bold text-xs rounded-xl transition-colors"
              >
                {language === "nl" ? "Sla Tour Over" : "Skip Tour"}
              </button>

              <button
                onClick={handleNext}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 uppercase tracking-wider"
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-amber-300" />
                    {language === "nl" ? "Klaar & Starten" : "Finish Tour"}
                  </>
                ) : (
                  <>
                    {language === "nl" ? "Volgende" : "Next"}
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};
