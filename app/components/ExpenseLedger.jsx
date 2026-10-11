'use client';

export default function ExpenseLedger({ expenses, selectedMonth, onDeleteExpense }) {
  return (
    <div className="bg-white/90 border border-sky-200 p-6 rounded-3xl shadow-sm flex flex-col">
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
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      exp.isEmergency ? 'bg-amber-200 text-amber-900' : 'bg-blue-100 text-blue-700'
                    }`}
                  >
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
                  onClick={() => onDeleteExpense(exp.id)}
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
  );
}