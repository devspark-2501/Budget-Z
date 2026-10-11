'use client';

export default function AuditModal({
  isOpen,
  onClose,
  totalSpent,
  remainingBalance,
  numSavings,
  isTargetBreached,
  selectedMonth,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white border border-sky-200 rounded-3xl shadow-2xl p-6 md:p-8 space-y-6">
        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              AI Financial Audit 🔍
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-2">Expense Evaluation</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 font-bold p-2 text-lg">
            ✕
          </button>
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

          <div
            className={`p-4 rounded-2xl border text-sm font-medium leading-relaxed ${
              isTargetBreached ? 'bg-red-50 border-red-200 text-red-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}
          >
            {isTargetBreached ? (
              <>
                ⚠️ <b>LIMIT BREACHED!</b> You spent ₹{totalSpent}, leaving you with ₹{remainingBalance}. You failed your target of saving ₹{numSavings}.
                <br />
                <br />
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
          onClick={onClose}
          className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-md text-sm"
        >
          Close Evaluation 👍
        </button>
      </div>
    </div>
  );
}