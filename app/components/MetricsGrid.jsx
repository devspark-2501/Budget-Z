'use client';

export default function MetricsGrid({
  numBudget,
  totalSpent,
  remainingBalance,
  dailyAllowance,
  riskLevel,
}) {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <div className="bg-white/80 border border-sky-200 p-5 rounded-2xl shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Income / Budget</p>
        <h3 className="text-2xl font-black text-slate-900 mt-1">₹{numBudget}</h3>
      </div>

      <div className="bg-white/80 border border-sky-200 p-5 rounded-2xl shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Spent</p>
        <h3 className="text-2xl font-black text-blue-600 mt-1">₹{totalSpent}</h3>
      </div>

      <div className="bg-white/80 border border-sky-200 p-5 rounded-2xl shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Remaining Balance</p>
        <h3 className={`text-2xl font-black mt-1 ${remainingBalance < 0 ? 'text-red-500' : 'text-slate-900'}`}>
          ₹{remainingBalance}
        </h3>
      </div>

      <div className="bg-white/80 border border-sky-200 p-5 rounded-2xl shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Daily Allowance</p>
        <h3 className="text-2xl font-black text-emerald-600 mt-1">₹{dailyAllowance}/day</h3>
      </div>

      <div className={`border p-5 rounded-2xl shadow-sm ${riskLevel.color}`}>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Financial Risk & Health</p>
        <h3 className="text-base font-black mt-1">{riskLevel.level}</h3>
      </div>
    </div>
  );
}