'use client';

export default function EmergencyModal({ isOpen, onClose, selectedDay, onInjectEmergency }) {
  if (!isOpen) return null;

  const emergencies = [
    { type: 'Healthcare / Medical Bill', cost: 1200, icon: '🏥' },
    { type: 'Phone / Laptop Screen Repair', cost: 1800, icon: '📱' },
    { type: 'Vehicle Breakdown', cost: 950, icon: '🛵' },
    { type: 'Unplanned Family / Home Expense', cost: 1500, icon: '🏠' },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-amber-200 rounded-3xl shadow-2xl p-6 space-y-5">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="text-lg font-black text-slate-900">🚨 Trigger Emergency Shock</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">✕</button>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Real financial planning requires handling unexpected shocks. Choose an event to simulate its impact on Day <b>{selectedDay}</b>:
        </p>

        <div className="grid grid-cols-1 gap-2.5">
          {emergencies.map((item) => (
            <button
              key={item.type}
              onClick={() => onInjectEmergency(item.type, item.cost)}
              className="flex justify-between items-center p-3.5 bg-amber-50/50 hover:bg-amber-100/80 border border-amber-200/80 rounded-2xl text-left transition-all"
            >
              <span className="text-xs font-bold text-slate-800">{item.icon} {item.type}</span>
              <span className="text-xs font-mono font-bold text-red-600">-₹{item.cost}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}