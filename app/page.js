'use client';
import { useState } from 'react';

export default function BudgetZApp() {
  // Navigation / Step State: 'setup' or 'dashboard'
  const [step, setStep] = useState('setup');

  // Setup inputs (Blank by default, fixed ₹10,000 reference or user custom)
  const [totalBudget, setTotalBudget] = useState('10000');
  const [savingsTarget, setSavingsTarget] = useState('2500');

  // Expense Todo Ledger (Starts completely empty)
  const [expenses, setExpenses] = useState([]);

  // Form inputs for adding expense
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Food & Drinks');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');

  // Audit modal state
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditResult, setAuditResult] = useState(null);

  // Handle Lock & Start Setup
  const handleLockAndStart = (e) => {
    e.preventDefault();
    if (!totalBudget || !savingsTarget) return;
    setStep('dashboard');
  };

  // Handle adding expense todo item
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!title || !amount || !date) return;

    const newExpense = {
      id: Date.now(),
      title,
      category,
      date,
      amount: Number(amount),
    };

    setExpenses([newExpense, ...expenses]);
    setTitle('');
    setAmount('');
    setDate('');
  };

  // Delete expense item
  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  // Calculate totals
  const numBudget = Number(totalBudget) || 10000;
  const numSavings = Number(savingsTarget) || 0;
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const remainingBalance = numBudget - totalSpent;
  const safeSpendingLimit = numBudget - numSavings;
  const isBreached = remainingBalance < numSavings;

  // Run audit and open pop-up window
  const runAudit = () => {
    let message = '';
    if (isBreached) {
      message = `⚠️ ALERT! You went over your safe spending limit of ₹${safeSpendingLimit}. You spent ₹${totalSpent}, leaving only ₹${remainingBalance} remaining, which ruins your ₹${numSavings} savings goal! Check your recent expenses and cut down on impulse categories.`;
    } else {
      message = `✨ LOOKIN' FRESH! You are successfully within your safety threshold. You have spent ₹${totalSpent} and are on track to lock in your ₹${numSavings} savings target. Keep it up!`;
    }

    setAuditResult({
      isBreached,
      totalSpent,
      remainingBalance,
      message,
    });
    setShowAuditModal(true);
  };

  // ================= RENDER SETUP SCREEN =================
  if (step === 'setup') {
    return (
      <main className="min-h-screen w-full bg-gradient-to-br from-sky-50 via-white to-blue-100 text-slate-800 flex flex-col justify-between p-6 md:p-12">
        {/* Top Header */}
        <div className="w-full">
          <span className="px-3.5 py-1 text-xs font-semibold uppercase tracking-wider bg-blue-100 text-blue-700 rounded-full border border-blue-200">
            Gen Z Financial Simulator 💸
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mt-3 text-slate-900">
            Budget<span className="text-blue-600">Z</span>
          </h1>
          <p className="text-slate-600 text-sm md:text-base mt-2 max-w-xl">
            Take full control of your ₹10,000 monthly bag. Set your targets, simulate your choices, and audit your expenses before going broke.
          </p>
        </div>

        {/* Center Setup Card covering generous space */}
        <div className="w-full max-w-xl mx-auto bg-white/80 backdrop-blur-md border border-sky-200/80 p-8 md:p-10 rounded-3xl shadow-xl shadow-blue-500/5 my-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Setup Your Parameters 🛠️</h2>
          <p className="text-sm text-slate-500 mb-6">No prebuilt data here. Enter your exact custom numbers to begin.</p>

          <form onSubmit={handleLockAndStart} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Total Fixed Monthly Budget (₹)
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
                Expected Monthly Savings Target (₹)
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

        {/* Footer info */}
        <div className="w-full text-center text-xs text-slate-400 font-medium">
          BudgetZ Hackathon Edition • Pure Frontend React & Tailwind
        </div>
      </main>
    );
  }

  // ================= RENDER FULL-SCREEN DASHBOARD =================
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-sky-50 via-white to-blue-50 text-slate-800 p-4 md:p-8 flex flex-col space-y-6">
      
      {/* Top Header Bar */}
      <div className="w-full bg-white/90 backdrop-blur border border-sky-200/70 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
            30-Day Simulation Active ⚡
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-2">
            Budget<span className="text-blue-600">Z</span> <span className="text-slate-400 font-light">|</span> Dashboard
          </h1>
          <p className="text-sm text-slate-500">Fixed Budget: ₹{numBudget} | Target Savings: ₹{numSavings}</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={runAudit}
            className="flex-1 md:flex-none px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all shadow-md shadow-emerald-500/20 text-sm flex items-center justify-center gap-2"
          >
            🔍 Evaluate / Audit Expenses
          </button>
          <button 
            onClick={() => setStep('setup')}
            className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all text-sm"
          >
            ⚙️ Re-configure
          </button>
        </div>
      </div>

      {/* Metrics Row (Full Width Grid) */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/80 border border-sky-200 p-5 rounded-2xl shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Budget</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">₹{numBudget}</h3>
        </div>

        <div className="bg-white/80 border border-sky-200 p-5 rounded-2xl shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Spent So Far</p>
          <h3 className="text-2xl font-black text-blue-600 mt-1">₹{totalSpent}</h3>
        </div>

        <div className="bg-white/80 border border-sky-200 p-5 rounded-2xl shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Remaining Balance</p>
          <h3 className={`text-2xl font-black mt-1 ${remainingBalance < 0 ? 'text-red-500' : 'text-slate-900'}`}>
            ₹{remainingBalance}
          </h3>
        </div>

        <div className={`border p-5 rounded-2xl shadow-sm ${isBreached ? 'bg-red-50 border-red-200' : 'bg-emerald-50/60 border-emerald-200'}`}>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Savings Health Status</p>
          <h3 className={`text-lg font-bold mt-1 ${isBreached ? 'text-red-600' : 'text-emerald-700'}`}>
            {isBreached ? '⚠️ Limit Breached!' : '✨ Target On Track'}
          </h3>
        </div>
      </div>

      {/* Main Grid: Todo Expense Form & Todo Ledger */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
        {/* Left Form Column (5 cols) */}
        <div className="lg:col-span-5 bg-white/90 border border-sky-200 p-6 md:p-8 rounded-3xl shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-lg font-bold text-slate-900">Add Monthly Expense 📝</h3>
            <p className="text-xs text-slate-500">Log where you spent your money item by item.</p>
          </div>

          <form onSubmit={handleAddExpense} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Expense Title / Item</label>
              <input 
                type="text" 
                placeholder="e.g. Zomato Biryani, Zara Jacket" 
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
                  className="w-full bg-sky-50/50 border border-sky-200 rounded-xl px-3 py-3 text-sm font-medium focus:outline-none focus:border-blue-500"
                >
                  <option value="Food & Drinks">🍕 Food & Drinks</option>
                  <option value="Subscriptions">💻 Subscriptions</option>
                  <option value="Shopping">🛍️ Shopping</option>
                  <option value="Travel">🚕 Travel</option>
                  <option value="Impulse / Misc">🎲 Impulse / Misc</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Date</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-sky-50/50 border border-sky-200 rounded-xl px-3 py-3 text-sm font-medium focus:outline-none focus:border-blue-500"
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Amount (₹)</label>
              <input 
                type="number" 
                placeholder="e.g. 750" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-sky-50/50 border border-sky-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-500"
                required 
              />
            </div>

            <button 
              type="submit" 
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 text-sm mt-2"
            >
              Add to Expense Todo List ➕
            </button>
          </form>
        </div>

        {/* Right Ledger Feed Column (7 cols) */}
        <div className="lg:col-span-7 bg-white/90 border border-sky-200 p-6 md:p-8 rounded-3xl shadow-sm flex flex-col">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Expense Todo Feed</h3>
              <p className="text-xs text-slate-500">Live breakdown of your month's transactions</p>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-mono text-xs font-bold">
              {expenses.length} Items Logged
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[380px] pr-1">
            {expenses.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 text-slate-400">
                <p className="text-base font-semibold">No expenses logged yet!</p>
                <p className="text-xs mt-1">Use the form on the left to start adding your daily spending.</p>
              </div>
            ) : (
              expenses.map((exp) => (
                <div key={exp.id} className="flex justify-between items-center p-4 bg-sky-50/40 border border-sky-100 rounded-2xl transition-all hover:bg-sky-50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{exp.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md">
                        {exp.category}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slate-500">📅 {exp.date}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-mono font-extrabold text-red-500 text-base">-₹{exp.amount}</span>
                    <button 
                      onClick={() => handleDeleteExpense(exp.id)}
                      className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors text-xs font-bold"
                      title="Delete entry"
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

      {/* AUDIT POP-UP MODAL WINDOW */}
      {showAuditModal && auditResult && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-sky-200 rounded-3xl shadow-2xl p-6 md:p-8 space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  AI Financial Audit 🔍
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">Expense Audit Results</h3>
              </div>
              <button 
                onClick={() => setShowAuditModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-2 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-sky-50/60 border border-sky-100 p-4 rounded-2xl">
                  <p className="text-xs font-bold text-slate-500 uppercase">Total Spent</p>
                  <p className="text-xl font-black text-slate-900 mt-1">₹{auditResult.totalSpent}</p>
                </div>
                <div className="bg-sky-50/60 border border-sky-100 p-4 rounded-2xl">
                  <p className="text-xs font-bold text-slate-500 uppercase">Remaining Cash</p>
                  <p className={`text-xl font-black mt-1 ${auditResult.remainingBalance < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                    ₹{auditResult.remainingBalance}
                  </p>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border text-sm font-medium leading-relaxed ${
                auditResult.isBreached ? 'bg-red-50 border-red-200 text-red-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}>
                {auditResult.message}
              </div>
            </div>

            <button 
              onClick={() => setShowAuditModal(false)}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-md text-sm"
            >
              Got it, back to dashboard 👍
            </button>
          </div>
        </div>
      )}


    </main>
  );
}