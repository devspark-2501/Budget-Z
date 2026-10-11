'use client';

export default function SetupScreen({
  selectedMonth,
  setSelectedMonth,
  totalBudget,
  setTotalBudget,
  savingsTarget,
  setSavingsTarget,
  onLockAndStart,
}) {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-sky-50 via-white to-blue-100 text-slate-800 flex flex-col justify-between p-6 md:p-12">
      
      {/* Top Header Section with extra bottom spacing / padding */}
      <div className="w-full max-w-5xl mx-auto pt-4 pb-8 md:pb-12">
        <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700 rounded-full border border-blue-200">
          Gen Z Financial Simulator 💸
        </span>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mt-3 text-slate-900">
          Budget<span className="text-blue-600">Z</span>
        </h1>
        <p className="text-slate-600 text-sm md:text-base mt-3 max-w-xl leading-relaxed">
          Simulate decisions over a 30-day monthly limit. Lock your parameters, manage emergency shocks, and evaluate risk before going broke.
        </p>
      </div>

      {/* Center Setup Card with comfortable margins */}
      <div className="w-full max-w-xl mx-auto bg-white/90 backdrop-blur-md border border-sky-200/80 p-8 md:p-10 rounded-3xl shadow-xl shadow-blue-500/5 my-4">
        <h2 className="text-2xl font-black text-slate-900 mb-1">Setup Your 30-Day Vibe 🛠️</h2>
        <p className="text-xs text-slate-500 mb-6">No prebuilt data. Enter your initial parameters to configure the simulation.</p>

        <form onSubmit={onLockAndStart} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Simulation Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full bg-sky-50/50 border border-sky-200 rounded-2xl px-4 py-3.5 text-slate-900 font-bold focus:outline-none focus:border-blue-500 text-base"
            >
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Fixed Monthly Budget (₹)
            </label>
            <input
              type="number"
              value={totalBudget}
              onChange={(e) => setTotalBudget(e.target.value)}
              className="w-full bg-sky-50/50 border border-sky-200 rounded-2xl px-4 py-3.5 text-slate-900 font-bold focus:outline-none focus:border-blue-500 text-lg"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Target Savings Goal (₹)
            </label>
            <input
              type="number"
              value={savingsTarget}
              onChange={(e) => setSavingsTarget(e.target.value)}
              className="w-full bg-sky-50/50 border border-sky-200 rounded-2xl px-4 py-3.5 text-slate-900 font-bold focus:outline-none focus:border-blue-500 text-lg"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl transition-all shadow-lg shadow-blue-500/30 text-base mt-2"
          >
            Lock & Start Dashboard 🔒🚀
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="w-full text-center text-xs text-slate-400 font-medium py-4">
        BudgetZ Hackathon Edition • Custom 30-Day Engine
      </div>
    </main>
  );
}