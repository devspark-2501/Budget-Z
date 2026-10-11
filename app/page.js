'use client';
import { useState } from 'react';

export default function Dashboard() {
  // State variables (Plain JavaScript)
  const [budget, setBudget] = useState(10000);
  const [savingsTarget, setSavingsTarget] = useState(2500);
  
  // Todo-style expense list
  const [expenses, setExpenses] = useState([
    { id: 1, title: 'Swiggy Biryani Feast', category: 'Food', amount: 650 },
    { id: 2, title: 'Spotify Subscription', category: 'Subs', amount: 119 },
    { id: 3, title: 'Uber to College', category: 'Transport', amount: 350 },
  ]);

  // Form input states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');

  // Evaluation & AI audit state
  const [evaluation, setEvaluation] = useState(null);

  // Calculations
  const totalSpent = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const remainingBalance = budget - totalSpent;
  const isOverSavingLimit = remainingBalance < savingsTarget;

  // Add Expense Handler (Todo style)
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    const newExpense = {
      id: Date.now(),
      title,
      category,
      amount: Number(amount),
    };

    setExpenses([newExpense, ...expenses]);
    setTitle('');
    setAmount('');
    setEvaluation(null); // Reset evaluation when new data comes in
  };

  // Delete Expense Handler
  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
    setEvaluation(null);
  };

  // Evaluate / Roast Function
  const evaluateExpenses = () => {
    if (totalSpent > (budget - savingsTarget)) {
      setEvaluation({
        status: 'danger',
        message: `⚠️ BAG ALERT: You breached your safety buffer! You've spent ₹${totalSpent} out of your ₹${budget} budget, leaving only ₹${remainingBalance}. Your target was to save ₹${savingsTarget}. Cut down on "${category}" and impulse buys immediately!`
      });
    } else {
      setEvaluation({
        status: 'success',
        message: `✨ LOOKIN' CLEAN: You are currently on track to hit your ₹${savingsTarget} savings target! Safe remaining buffer: ₹${remainingBalance}. Keep locking in!`
      });
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      
      {/* Top Header & Editable Savings Goal */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-zinc-950 border border-zinc-800 p-6 rounded-3xl gap-4">
        <div>
          <span className="text-xs font-mono px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 rounded-full">
            Gen Z Finance Tracker 💸
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-2">BudgetZ <span className="text-green-400">Dashboard</span></h1>
          <p className="text-zinc-400 text-sm">Monthly Total Budget: <span className="text-white font-mono font-bold">₹{budget}</span></p>
        </div>

        {/* Editable Saving Target Card */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col gap-1 w-full md:w-auto">
          <label className="text-xs font-mono text-zinc-400 uppercase">Target Savings Goal (₹)</label>
          <input 
            type="number" 
            value={savingsTarget} 
            onChange={(e) => setSavingsTarget(Number(e.target.value))}
            className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-green-400 font-mono font-bold focus:outline-none focus:border-green-500 text-lg"
          />
        </div>
      </div>

      {/* Main Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl">
          <p className="text-xs font-mono text-zinc-400 uppercase">Remaining Balance</p>
          <h3 className={`text-3xl font-black mt-1 ${remainingBalance < 0 ? 'text-red-500' : 'text-white'}`}>
            ₹{remainingBalance}
          </h3>
        </div>
        
        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl">
          <p className="text-xs font-mono text-zinc-400 uppercase">Total Spent So Far</p>
          <h3 className="text-3xl font-black mt-1 text-green-400">₹{totalSpent}</h3>
        </div>

        <div className={`bg-zinc-950 border p-5 rounded-2xl ${isOverSavingLimit ? 'border-red-500/50 bg-red-950/10' : 'border-zinc-800'}`}>
          <p className="text-xs font-mono text-zinc-400 uppercase">Savings Status</p>
          <h3 className={`text-lg font-bold mt-2 ${isOverSavingLimit ? 'text-red-400' : 'text-emerald-400'}`}>
            {isOverSavingLimit ? '⚠️ Below Savings Target' : '🎯 Target on Track'}
          </h3>
        </div>
      </div>

      {/* Top Evaluator Section */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 p-6 rounded-3xl space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold">Evaluate My Expenses 🔍</h3>
            <p className="text-sm text-zinc-400">Let the simulator check where and how you spent your ₹10K bag wrong.</p>
          </div>
          <button 
            onClick={evaluateExpenses}
            className="px-6 py-3 bg-green-500 hover:bg-green-400 text-black font-extrabold rounded-2xl transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] w-full sm:w-auto"
          >
            Run Audit ⚡
          </button>
        </div>

        {evaluation && (
          <div className={`p-4 rounded-2xl text-sm font-mono border leading-relaxed ${
            evaluation.status === 'danger' ? 'bg-red-950/30 border-red-500/40 text-red-200' : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
          }`}>
            {evaluation.message}
          </div>
        )}
      </div>

      {/* Todo-Style Add & Expense History Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Add Expense Form (Todo Input) */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-3xl space-y-4">
          <h3 className="font-bold text-lg">Log Where Money Went 📝</h3>
          <form onSubmit={handleAddExpense} className="space-y-3">
            <div>
              <label className="text-xs font-mono text-zinc-400 block mb-1">Expense Title / Item</label>
              <input 
                type="text" 
                placeholder="e.g. Zara Hoodie, Coffee, Zomato" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500"
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-green-500"
                >
                  <option value="Food">🍕 Food / Drinks</option>
                  <option value="Subs">💻 Subscriptions</option>
                  <option value="Shopping">🛍️ Shopping</option>
                  <option value="Transport">🚕 Transport</option>
                  <option value="Misc">🎲 Misc</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">Amount (₹)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 499" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500"
                  required 
                />
              </div>
            </div>

            <button type="submit" className="w-full py-3.5 bg-zinc-800 hover:bg-zinc-700 font-bold rounded-xl text-sm transition-all mt-2">
              Add to Expense Todo List ➕
            </button>
          </form>
        </div>

        {/* Expense Todo List / History */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-3xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Expense Ledger ({expenses.length})</h3>
            <span className="text-xs font-mono text-zinc-500">Live Feed</span>
          </div>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {expenses.length === 0 ? (
              <p className="text-zinc-500 text-sm text-center py-10 font-mono">No expenses logged yet. Add one!</p>
            ) : (
              expenses.map((exp) => (
                <div key={exp.id} className="flex justify-between items-center p-3.5 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl text-sm group">
                  <div className="space-y-0.5">
                    <p className="font-medium">{exp.title}</p>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-md">
                      {exp.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-red-400">-₹{exp.amount}</span>
                    <button 
                      onClick={() => handleDeleteExpense(exp.id)}
                      className="text-zinc-600 hover:text-red-400 text-xs px-2 py-1 transition-colors"
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
    </main>
  );
}