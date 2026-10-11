'use client';

import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function BudgetZApp() {
  // Navigation: 'setup' | 'dashboard'
  const [step, setStep] = useState('setup');

  // Core Parameters
  const [totalBudget, setTotalBudget] = useState('10000');
  const [savingsTarget, setSavingsTarget] = useState('2500');
  const [selectedMonth, setSelectedMonth] = useState('October');

  // Ledger State
  const [expenses, setExpenses] = useState([]);

  // Form Inputs
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Food & Dining');
  const [selectedDay, setSelectedDay] = useState(1);
  const [amount, setAmount] = useState('');

  // UI Modals & Toasts
  const [toast, setToast] = useState(null);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  // Trigger Toast Notification
  const triggerToast = (msg, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4500);
  };

  // Calculations
  const numBudget = Number(totalBudget) || 10000;
  const numSavings = Number(savingsTarget) || 0;
  const totalSpent = useMemo(() => expenses.reduce((a, b) => a + b.amount, 0), [expenses]);
  const remainingBalance = numBudget - totalSpent;
  const safeBuffer = numBudget - numSavings;
  const isTargetBreached = remainingBalance < numSavings;
  const dailyAllowance = Math.max(0, Math.round(remainingBalance / 30));

  // Risk Level
  const riskLevel = useMemo(() => {
    if (remainingBalance < numSavings) return { level: 'High Risk 🔴', color: 'bg-red-50 text-red-700 border-red-200' };
    if (remainingBalance < numSavings + 1500) return { level: 'Moderate Risk 🟡', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { level: 'Healthy 🟢', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  }, [remainingBalance, numSavings]);

  // Handle Lock & Start
  const handleLockAndStart = (e) => {
    e.preventDefault();
    if (!totalBudget || !savingsTarget) return;
    setStep('dashboard');
    triggerToast(`Budget Locked! ₹${totalBudget} bag active for 30 Days in ${selectedMonth}.`, 'success');
  };

  // Handle Reconfigure / Reset
  const handleReconfigure = () => {
    if (window.confirm('Resetting will clear all current expenses and reboot your 30-day simulator. Continue?')) {
      setExpenses([]);
      setStep('setup');
      triggerToast('Simulator reset to blank state.', 'info');
    }
  };

  // Add Expense Item
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    const parsedAmount = Number(amount);
    const newExp = {
      id: Date.now(),
      title,
      category,
      day: Number(selectedDay),
      month: selectedMonth,
      amount: parsedAmount,
      isEmergency: false,
    };

    const newTotal = totalSpent + parsedAmount;
    const newRem = numBudget - newTotal;

    setExpenses((prev) => [newExp, ...prev]);
    setTitle('');
    setAmount('');

    if (newRem < numSavings) {
      triggerToast(`⚠️ ALERT: Expense added! You breached your ₹${numSavings} savings goal! ₹${newRem} left.`, 'danger');
    } else {
      triggerToast(`Expense added! You have ₹${newRem} remaining in your bag.`, 'success');
    }
  };

  // Delete Expense Item
  const handleDeleteExpense = (id) => {
    const item = expenses.find((e) => e.id === id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    if (item) {
      triggerToast(`Removed "${item.title}". ₹${item.amount} returned to budget.`, 'info');
    }
  };

  // Trigger Emergency Event
  const injectEmergency = (type, cost) => {
    const newExp = {
      id: Date.now(),
      title: `🚨 Emergency: ${type}`,
      category: 'Emergency Shock',
      day: selectedDay,
      month: selectedMonth,
      amount: cost,
      isEmergency: true,
    };

    setExpenses((prev) => [newExp, ...prev]);
    setShowEmergencyModal(false);

    const newRem = remainingBalance - cost;
    triggerToast(`🚨 EMERGENCY HIT: -₹${cost} deducted for ${type}! Remaining: ₹${newRem}`, 'danger');
  };

  // Graph Data Preparedness
  const lineChartData = useMemo(() => {
    const days = Array.from({ length: 30 }, (_, i) => i + 1);
    let runningBalance = numBudget;

    const dataPoints = days.map((day) => {
      const dayExpenses = expenses.filter((e) => e.day === day);
      const spentOnDay = dayExpenses.reduce((a, b) => a + b.amount, 0);
      runningBalance -= spentOnDay;
      return runningBalance;
    });

    return {
      labels: days.map((d) => `Day ${d}`),
      datasets: [
        {
          label: 'Remaining Balance (₹)',
          data: dataPoints,
          borderColor: '#0284c7',
          backgroundColor: 'rgba(2, 132, 199, 0.1)',
          fill: true,
          tension: 0.3,
        },
        {
          label: 'Savings Threshold Goal',
          data: days.map(() => numSavings),
          borderColor: '#ef4444',
          borderDash: [5, 5],
          pointRadius: 0,
        },
      ],
    };
  }, [expenses, numBudget, numSavings]);

  const categoryData = useMemo(() => {
    const cats = ['Food & Dining', 'Subscriptions', 'Shopping', 'Travel', 'Emergency Shock', 'Impulse / Misc'];
    const sums = cats.map((cat) => expenses.filter((e) => e.category === cat).reduce((a, b) => a + b.amount, 0));

    return {
      labels: cats,
      datasets: [
        {
          data: sums,
          backgroundColor: ['#38bdf8', '#818cf8', '#f472b6', '#fbbf24', '#f87171', '#a3e635'],
        },
      ],
    };
  }, [expenses]);

  // ================= RENDER SETUP SCREEN =================
  if (step === 'setup') {
    return (
      <main className="min-h-screen w-full bg-gradient-to-br from-sky-50 via-white to-blue-100 text-slate-800 flex flex-col justify-between p-6 md:p-12">
        {/* Header */}
        <div className="w-full max-w-5xl mx-auto">
          <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700 rounded-full border border-blue-200">
            Gen Z Financial Simulator 💸
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mt-3 text-slate-900">
            Budget<span className="text-blue-600">Z</span>
          </h1>
          <p className="text-slate-600 text-sm md:text-base mt-2 max-w-xl">
            Simulate decisions over a 30-day monthly limit. Lock your parameters, manage emergency shocks, and evaluate risk before going broke.
          </p>
        </div>

        {/* Center Setup Card */}
        <div className="w-full max-w-xl mx-auto bg-white/90 backdrop-blur-md border border-sky-200/80 p-8 md:p-10 rounded-3xl shadow-xl shadow-blue-500/5 my-auto">
          <h2 className="text-2xl font-black text-slate-900 mb-1">Setup Your 30-Day Vibe 🛠️</h2>
          <p className="text-xs text-slate-500 mb-6">No prebuilt data. Enter your initial parameters to configure the simulation.</p>

          <form onSubmit={handleLockAndStart} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Simulation Month
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full bg-sky-50/50 border border-sky-200 rounded-2xl px-4 py-3.5 text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-base"
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
                className="w-full bg-sky-50/50 border border-sky-200 rounded-2xl px-4 py-3.5 text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-lg transition-all"
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
                className="w-full bg-sky-50/50 border border-sky-200 rounded-2xl px-4 py-3.5 text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-lg transition-all"
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
        <div className="w-full text-center text-xs text-slate-400 font-medium">
          BudgetZ Hackathon Edition • Custom 30-Day Engine
        </div>
      </main>
    );
  }

  // ================= RENDER DASHBOARD =================
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-sky-50 via-white to-blue-50 text-slate-800 p-4 md:p-8 flex flex-col space-y-6 relative">
      
      {/* Toast Notification Banner */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-4 rounded-2xl shadow-2xl border text-sm font-bold flex items-center gap-3 animate-bounce ${
          toast.type === 'danger' ? 'bg-red-50 border-red-200 text-red-800' :
          toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
          'bg-sky-50 border-sky-200 text-sky-800'
        }`}>
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Top Header Navigation */}
      <div className="w-full bg-white/90 backdrop-blur border border-sky-200/70 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
            {selectedMonth} • 30-Day Cycle Active
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-2">
            Budget<span className="text-blue-600">Z</span> <span className="text-slate-300 font-light">|</span> Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Fixed Budget: <span className="font-bold text-slate-800">₹{numBudget}</span> | Savings Target: <span className="font-bold text-slate-800">₹{numSavings}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowEmergencyModal(true)}
            className="px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl transition-all shadow-md shadow-amber-500/20 text-xs flex items-center gap-1.5"
          >
            🚨 Emergency Shock Simulator
          </button>
          
          <button
            onClick={() => setShowAuditModal(true)}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all shadow-md shadow-emerald-500/20 text-xs flex items-center gap-1.5"
          >
            🔍 Evaluate / Audit
          </button>

          <button
            onClick={handleReconfigure}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all text-xs"
          >
            ⚙️ Re-configure
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white/80 border border-sky-200 p-5 rounded-2xl shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Budget</p>
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
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Financial Health Risk</p>
          <h3 className="text-base font-black mt-1">{riskLevel.level}</h3>
        </div>
      </div>

      {/* Main Grid: Add Expense, Custom 30-Day Calendar, & Expense Feed */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form & Custom Calendar Picker */}
        <div className="lg:col-span-5 bg-white/90 border border-sky-200 p-6 rounded-3xl shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-lg font-bold text-slate-900">Add Monthly Expense 📝</h3>
            <p className="text-xs text-slate-500">Log expenditures against your custom 30-day timeline.</p>
          </div>

          <form onSubmit={handleAddExpense} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Expense Item</label>
              <input
                type="text"
                placeholder="e.g. Swiggy Binge, Metro Pass"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-sky-50/50 border border-sky-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-sky-50/50 border border-sky-200 rounded-xl px-3 py-3 text-xs font-medium focus:outline-none focus:border-blue-500"
                >
                  <option value="Food & Dining">🍕 Food & Dining</option>
                  <option value="Subscriptions">💻 Subscriptions</option>
                  <option value="Shopping">🛍️ Shopping</option>
                  <option value="Travel">🚕 Travel</option>
                  <option value="Impulse / Misc">🎲 Impulse / Misc</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 450"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-sky-50/50 border border-sky-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* CUSTOM 30-DAY CALENDAR UI */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Select Simulation Day (1 - 30)
                </label>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                  Selected: Day {selectedDay} ({selectedMonth})
                </span>
              </div>
              <div className="grid grid-cols-6 gap-1.5 bg-sky-50/50 border border-sky-200 p-3 rounded-2xl max-h-40 overflow-y-auto">
                {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedDay === day
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-105'
                        : 'bg-white text-slate-700 hover:bg-blue-100 border border-sky-100'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 text-sm mt-2"
            >
              Add to Expense Ledger ➕
            </button>
          </form>
        </div>

        {/* Right Column: Ledger Feed */}
        <div className="lg:col-span-7 bg-white/90 border border-sky-200 p-6 rounded-3xl shadow-sm flex flex-col">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Expense Todo Ledger</h3>
              <p className="text-xs text-slate-500">Live feed of transactions recorded in {selectedMonth}</p>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-mono text-xs font-bold">
              {expenses.length} Records
            </span>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[380px] pr-1">
            {expenses.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 text-slate-400">
                <p className="text-base font-semibold">No expenses logged yet!</p>
                <p className="text-xs mt-1">Select a day on the calendar and enter your spending.</p>
              </div>
            ) : (
              expenses.map((exp) => (
                <div
                  key={exp.id}
                  className={`flex justify-between items-center p-3.5 border rounded-2xl transition-all ${
                    exp.isEmergency
                      ? 'bg-amber-50/80 border-amber-200'
                      : 'bg-sky-50/40 border-sky-100 hover:bg-sky-50'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{exp.title}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        exp.isEmergency ? 'bg-amber-200 text-amber-900' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {exp.category}
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-slate-400">
                      📅 {exp.month} • Day {exp.day}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono font-extrabold text-red-500 text-sm">-₹{exp.amount}</span>
                    <button
                      onClick={() => handleDeleteExpense(exp.id)}
                      className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors text-xs font-bold"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Analytics & Graphs Section */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white/90 border border-sky-200 p-6 rounded-3xl shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-1">30-Day Balance Trajectory 📈</h3>
          <p className="text-xs text-slate-500 mb-4">Real-time simulation of remaining cash balance vs. red savings threshold.</p>
          <div className="h-64">
            <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="lg:col-span-4 bg-white/90 border border-sky-200 p-6 rounded-3xl shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-1">Category Breakdown 🍕</h3>
          <p className="text-xs text-slate-500 mb-4">Where your ₹10K bag is leaking.</p>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={categoryData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* EMERGENCY SHOCK MODAL */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-amber-200 rounded-3xl shadow-2xl p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900">🚨 Trigger Emergency Shock</h3>
              <button onClick={() => setShowEmergencyModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Real financial planning requires handling unexpected shocks. Choose an event to simulate its impact on your ₹10K balance on <b>Day {selectedDay}</b>:
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              {[
                { type: 'Healthcare / Medical Bill', cost: 1200, icon: '🏥' },
                { type: 'Phone / Laptop Screen Repair', cost: 1800, icon: '📱' },
                { type: 'Vehicle Breakdown', cost: 950, icon: '🛵' },
                { type: 'Unplanned Family / Home Expense', cost: 1500, icon: '🏠' },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => injectEmergency(item.type, item.cost)}
                  className="flex justify-between items-center p-3.5 bg-amber-50/50 hover:bg-amber-100/80 border border-amber-200/80 rounded-2xl text-left transition-all"
                >
                  <span className="text-xs font-bold text-slate-800">{item.icon} {item.type}</span>
                  <span className="text-xs font-mono font-bold text-red-600">-₹{item.cost}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI AUDIT EVALUATION MODAL */}
      {showAuditModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-sky-200 rounded-3xl shadow-2xl p-6 md:p-8 space-y-6">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  AI Financial Audit 🔍
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">Expense Evaluation</h3>
              </div>
              <button onClick={() => setShowAuditModal(false)} className="text-slate-400 hover:text-slate-700 font-bold p-2 text-lg">✕</button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-sky-50/60 border border-sky-100 p-4 rounded-2xl">
                  <p className="text-xs font-bold text-slate-500 uppercase">Total Spent</p>
                  <p className="text-xl font-black text-slate-900 mt-1">₹{totalSpent}</p>
                </div>
                <div className="bg-sky-50/60 border border-sky-100 p-4 rounded-2xl">
                  <p className="text-xs font-bold text-slate-500 uppercase">Remaining Cash</p>
                  <p className={`text-xl font-black mt-1 ${remainingBalance < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                    ₹{remainingBalance}
                  </p>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border text-sm font-medium leading-relaxed ${
                isTargetBreached ? 'bg-red-50 border-red-200 text-red-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}>
                {isTargetBreached ? (
                  <>
                    ⚠️ <b>LIMIT BREACHED!</b> You spent ₹{totalSpent}, leaving you with ₹{remainingBalance}. You failed your target of saving ₹{numSavings}.
                    <br /><br />
                    <b>Where did you go wrong?</b> Review your entries in high-impulse categories or emergency shocks logged in {selectedMonth}.
                  </>
                ) : (
                  <>
                    ✨ <b>HEALTHY BAG!</b> You have spent ₹{totalSpent} and retained ₹{remainingBalance}. You are safely on track to lock in your ₹{numSavings} goal.
                  </>
                )}
              </div>
            </div>

            <button
              onClick={() => setShowAuditModal(false)}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-md text-sm"
            >
              Close Evaluation 👍
            </button>
          </div>
        </div>
      )}

    </main>
  );
}