'use client';

export default function ExpenseForm({
  title,
  setTitle,
  category,
  setCategory,
  amount,
  setAmount,
  selectedDay,
  setSelectedDay,
  selectedMonth,
  onAddExpense,
}) {
  return (
    <div className="bg-white/90 border border-sky-200 p-6 rounded-3xl shadow-sm space-y-4">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-lg font-bold text-slate-900">Add Monthly Expense 📝</h3>
        <p className="text-xs text-slate-500">Log expenditures against your 30-day timeline.</p>
      </div>

      <form onSubmit={onAddExpense} className="space-y-3.5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Expense Item</label>
          <input
            type="text"
            placeholder="e.g. Swiggy Binge, Metro Pass"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-sky-50/50 border border-sky-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-sky-50/50 border border-sky-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="Food & Dining">🍕 Food & Dining</option>
              <option value="Subscriptions">💻 Subscriptions</option>
              <option value="Shopping">🛍️ Shopping</option>
              <option value="Travel">🚕 Travel</option>
              <option value="Impulse / Misc">🎲 Impulse / Misc</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Amount (₹)</label>
            <input
              type="number"
              placeholder="e.g. 450"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-sky-50/50 border border-sky-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Compact 30-Day Compact Calendar Selector */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Simulation Day (1 - 30)
            </label>
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              Selected: Day {selectedDay}
            </span>
          </div>
          <div className="grid grid-cols-10 gap-1 bg-sky-50/50 border border-sky-200 p-2 rounded-xl">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={`py-1 rounded text-[11px] font-bold transition-all ${
                  selectedDay === day
                    ? 'bg-blue-600 text-white shadow-sm scale-105'
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
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 text-sm mt-1"
        >
          Add to Expense Ledger ➕
        </button>
      </form>
    </div>
  );
}