'use client';
import { useState } from 'react';

export default function DecisionSimulator({ remainingBalance, savingsTarget, numBudget, dailyAllowance }) {
  const [simAmount, setSimAmount] = useState('');
  const [simCategory, setSimCategory] = useState('Shopping');
  const [simulationResult, setSimulationResult] = useState(null);

  const runSimulation = (e) => {
    e.preventDefault();
    if (!simAmount) return;
    const cost = Number(simAmount);
    const postSimBalance = remainingBalance - cost;
    const postSimDaily = Math.max(0, Math.round(postSimBalance / 30));
    const breachesSavings = postSimBalance < savingsTarget;
    
    // Monthly forecast calculation
    const projectedEndMonth = postSimBalance;

    let healthScoreImpact = 'Optimal 🟢';
    if (breachesSavings) healthScoreImpact = 'Critical Risk 🔴 (Savings Breached)';
    else if (postSimBalance < numBudget * 0.3) healthScoreImpact = 'Moderate Warning 🟡';

    setSimulationResult({
      cost,
      postSimBalance,
      postSimDaily,
      projectedEndMonth,
      breachesSavings,
      healthScoreImpact,
    });
  };

  return (
    <div className="bg-white/90 border border-sky-200 p-6 rounded-3xl shadow-sm space-y-4">
      <div className="border-b border-slate-100 pb-3">
        <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full">
          Interactive Sandbox
        </span>
        <h3 className="text-lg font-bold text-slate-900 mt-1">Financial Decision Simulator 🔮</h3>
        <p className="text-xs text-slate-500">Test a purchase decision <i>before</i> making it to see interconnected consequences.</p>
      </div>

      <form onSubmit={runSimulation} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Simulate Category</label>
            <select
              value={simCategory}
              onChange={(e) => setSimCategory(e.target.value)}
              className="w-full bg-sky-50/50 border border-sky-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none"
            >
              <option value="Shopping">🛍️ Luxury Shopping</option>
              <option value="Dining">🍷 Weekend Dining</option>
              <option value="Subscriptions">📱 New Subscription</option>
              <option value="Commitment">🧾 Monthly Commitment</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Simulated Cost (₹)</label>
            <input
              type="number"
              placeholder="e.g. 1200"
              value={simAmount}
              onChange={(e) => setSimAmount(e.target.value)}
              className="w-full bg-sky-50/50 border border-sky-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-indigo-500/20"
        >
          Simulate Impact Now ⚡
        </button>
      </form>

      {simulationResult && (
        <div className="mt-4 p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-2 text-xs">
          <p className="font-bold text-indigo-900 uppercase tracking-wide">Simulation Outcome Forecast:</p>
          <div className="grid grid-cols-2 gap-2 font-medium text-slate-700">
            <div>Post-Decision Balance: <span className="font-bold text-slate-900">₹{simulationResult.postSimBalance}</span></div>
            <div>New Daily Allowance: <span className="font-bold text-slate-900">₹{simulationResult.postSimDaily}/day</span></div>
            <div>Monthly Forecast: <span className="font-bold text-slate-900">₹{simulationResult.projectedEndMonth}</span></div>
            <div>Financial Health: <span className="font-bold">{simulationResult.healthScoreImpact}</span></div>
          </div>
        </div>
      )}
    </div>
  );
}