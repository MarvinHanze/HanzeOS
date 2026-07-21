import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Clock,
  Play,
  Square,
  Plus,
  CheckSquare,
  Square as SquareIcon,
  User,
  Calendar,
  DollarSign,
  AlertCircle,
  X,
  CheckCircle2,
} from "lucide-react";
import { Project, TimeEntry, ProjectTask, Language } from "../types";

interface ProjectsViewProps {
  projects: Project[];
  timeEntries: TimeEntry[];
  language: Language;
  onAddTimeEntry: (entry: Omit<TimeEntry, "id">) => void;
  onToggleTask: (projectId: string, taskId: string) => void;
  onAddProject: (project: Omit<Project, "id">) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  timeEntries,
  language,
  onAddTimeEntry,
  onToggleTask,
  onAddProject,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || "");
  const [showNewTimeModal, setShowNewTimeModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  // Live Timer State
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerProject, setTimerProject] = useState<string>(projects[0]?.id || "");
  const [timerDesc, setTimerDesc] = useState("Werkzaamheden op locatie");

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStopTimerAndSave = () => {
    setIsTimerRunning(false);
    const hours = Math.max(0.1, Number((timerSeconds / 3600).toFixed(2)));
    const proj = projects.find((p) => p.id === timerProject);

    if (proj) {
      onAddTimeEntry({
        projectId: proj.id,
        projectName: proj.title,
        employeeName: "Ingelogde Medewerker",
        date: new Date().toISOString().split("T")[0],
        hours,
        description: timerDesc || "Geregistreerd via live timer",
        hourlyRate: 65,
        billable: true,
      });
    }
    setTimerSeconds(0);
  };

  // Manual Time Entry form state
  const [manualEntry, setManualEntry] = useState({
    projectId: projects[0]?.id || "",
    employeeName: "Mark Visser",
    hours: 4.0,
    description: "Installatie & Nacalculatie",
    date: new Date().toISOString().split("T")[0],
  });

  const handleManualTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find((p) => p.id === manualEntry.projectId);
    if (!proj) return;

    onAddTimeEntry({
      projectId: proj.id,
      projectName: proj.title,
      employeeName: manualEntry.employeeName,
      date: manualEntry.date,
      hours: Number(manualEntry.hours),
      description: manualEntry.description,
      hourlyRate: 65,
      billable: true,
    });
    setShowNewTimeModal(false);
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  return (
    <div className="space-y-6">
      
      {/* HEADER & LIVE TIMER BAR */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {language === "nl" ? "Projecten & Urenregistratie" : "Projects & Time Tracking"}
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Beheer projectvoortgang, taken per medewerker en schrijf direct uren op locatie.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNewTimeModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors uppercase tracking-wider"
            >
              <Clock className="w-4 h-4" />
              {language === "nl" ? "Handmatig Uren Schrijven" : "Manual Log Hours"}
            </button>
          </div>
        </div>

        {/* LIVE MOBILE TIMER WIDGET */}
        <div className="p-4 bg-slate-900 rounded-2xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-mono font-bold text-xs flex-shrink-0">
              <Clock className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Live Mobiele Timer
              </p>
              <div className="flex items-center gap-2">
                <select
                  value={timerProject}
                  onChange={(e) => setTimerProject(e.target.value)}
                  className="bg-slate-800 text-slate-200 text-xs px-2 py-1 rounded border border-slate-700"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} - {p.title}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Wat ben je aan het doen?"
                  value={timerDesc}
                  onChange={(e) => setTimerDesc(e.target.value)}
                  className="bg-slate-800 text-slate-200 text-xs px-2 py-1 rounded border border-slate-700 hidden sm:block"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <span className="font-mono text-xl font-bold text-amber-300 tracking-wider">
              {formatTimer(timerSeconds)}
            </span>

            {!isTimerRunning ? (
              <button
                onClick={() => setIsTimerRunning(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-all"
              >
                <Play className="w-3.5 h-3.5" />
                Start
              </button>
            ) : (
              <button
                onClick={handleStopTimerAndSave}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg transition-all"
              >
                <Square className="w-3.5 h-3.5" />
                Stop & Opslaan
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: PROJECTS LIST */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900">
            {language === "nl" ? `Projecten Overzicht (${projects.length})` : `Projects Overview (${projects.length})`}
          </h3>

          <div className="space-y-3">
            {projects.map((proj) => {
              const isSelected = proj.id === selectedProjectId;
              const budgetPercent = Math.round((proj.spentBudget / proj.budget) * 100);

              return (
                <div
                  key={proj.id}
                  onClick={() => setSelectedProjectId(proj.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-blue-50/70 border-blue-500 shadow-xs"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-100/60 px-1.5 py-0.5 rounded">
                      {proj.code}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {proj.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900">{proj.title}</h4>
                  <p className="text-[11px] text-slate-500">{proj.clientName}</p>

                  <div className="mt-3 space-y-1.5">
                    <div className="flex justify-between text-[11px] text-slate-600 font-semibold">
                      <span>Voortgang</span>
                      <span>{proj.completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${proj.completionPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Budget besteed:</span>
                    <span className="font-bold text-slate-900">
                      €{proj.spentBudget.toLocaleString("nl-NL")} / €{proj.budget.toLocaleString("nl-NL")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: PROJECT DETAILS & TASKS */}
        {selectedProject && (
          <div className="lg:col-span-2 space-y-6">
            
            {/* SELECTED PROJECT SUMMARY CARD */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-blue-600">{selectedProject.code}</span>
                  <h2 className="text-lg font-bold text-slate-900">{selectedProject.title}</h2>
                  <p className="text-xs text-slate-500">Klant: {selectedProject.clientName}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Status</span>
                  <span className="text-xs font-bold text-emerald-600 capitalize">{selectedProject.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block">Totaal Budget</span>
                  <span className="font-bold text-slate-900">€{selectedProject.budget.toLocaleString("nl-NL")}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Besteed Budget</span>
                  <span className="font-bold text-slate-900">€{selectedProject.spentBudget.toLocaleString("nl-NL")}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Looptijd</span>
                  <span className="font-bold text-slate-900">{selectedProject.startDate} tot {selectedProject.endDate}</span>
                </div>
              </div>

              {/* TASKS CHECKLIST */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Project Taken & Mijlpalen ({selectedProject.tasks.length})
                </h3>

                <div className="space-y-2">
                  {selectedProject.tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => onToggleTask(selectedProject.id, task.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        task.completed ? "bg-slate-50 border-slate-200 opacity-75" : "bg-white border-slate-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <SquareIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                        )}
                        <div>
                          <p className={`text-xs font-bold ${task.completed ? "line-through text-slate-400" : "text-slate-900"}`}>
                            {task.title}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            Toegewezen aan: {task.assignedTo} • Vervaldatum: {task.dueDate}
                          </p>
                        </div>
                      </div>

                      <div className="text-right text-[11px]">
                        <span className="font-semibold text-slate-700">{task.loggedHours}u</span>
                        <span className="text-slate-400"> / {task.estimatedHours}u</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* TIME LOGS TABLE FOR SELECTED PROJECT */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Geregistreerde Uren op dit Project
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <th className="p-2.5">Medewerker</th>
                      <th className="p-2.5">Datum</th>
                      <th className="p-2.5">Omschrijving Werkzaamheden</th>
                      <th className="p-2.5 text-right">Uren</th>
                      <th className="p-2.5 text-right">Tarief /u</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {timeEntries
                      .filter((t) => t.projectId === selectedProject.id)
                      .map((te) => (
                        <tr key={te.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-900">{te.employeeName}</td>
                          <td className="p-2.5 text-slate-500">{te.date}</td>
                          <td className="p-2.5">{te.description}</td>
                          <td className="p-2.5 text-right font-bold text-blue-600">{te.hours}u</td>
                          <td className="p-2.5 text-right text-slate-500">€{te.hourlyRate}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* MODAL: MANUAL TIME ENTRY */}
      {showNewTimeModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Uren Registreren</h3>
              <button onClick={() => setShowNewTimeModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualTimeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Selecteer Project *</label>
                <select
                  value={manualEntry.projectId}
                  onChange={(e) => setManualEntry({ ...manualEntry, projectId: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} - {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Medewerker *</label>
                <input
                  type="text"
                  required
                  value={manualEntry.employeeName}
                  onChange={(e) => setManualEntry({ ...manualEntry, employeeName: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Aantal Uren</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={manualEntry.hours}
                    onChange={(e) => setManualEntry({ ...manualEntry, hours: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Datum</label>
                  <input
                    type="date"
                    value={manualEntry.date}
                    onChange={(e) => setManualEntry({ ...manualEntry, date: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Werkzaamheden Notitie</label>
                <textarea
                  rows={2}
                  required
                  value={manualEntry.description}
                  onChange={(e) => setManualEntry({ ...manualEntry, description: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewTimeModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                >
                  Opslaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
