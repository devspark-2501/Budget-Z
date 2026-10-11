'use client';

export default function Header({
  selectedMonth,
  numBudget,
  numSavings,
  onOpenEmergency,
  onOpenAudit,
  onReconfigure,
}) {
  return (
    <div className="w-full bg-white/90 backdrop-blur border border-sky-200/70 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
          {selectedMonth} • 30-Day Cycle Active
        </span>
        <h1 className="text-3xl font-black text-slate-900 mt-2">
          Budget<span className="text-blue-600">Z</span> <span className="text-slate-300 font-light">|</span> Dashboard
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Income/Budget: <span className="font-bold text-slate-800">₹{numBudget}</span> | Savings Target: <span className="font-bold text-slate-800">₹{numSavings}</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <button
          onClick={onOpenEmergency}
          className="px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl transition-all shadow-md shadow-amber-500/20 text-xs flex items-center gap-1.5"
        >
          🚨 Unexpected Expense Shock
        </button>

        <button
          onClick={onOpenAudit}
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all shadow-md shadow-emerald-500/20 text-xs flex items-center gap-1.5"
        >
          🔍 Evaluate / Audit
        </button>

        <button
          onClick={onReconfigure}
          className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all text-xs"
        >
          ⚙️ Re-configure
        </button>
      </div>
    </div>
  );
}