'use client';
import { useState } from 'react';

export default function EmergencyModal({ isOpen, onClose, selectedDay, onInjectEmergency }) {
  const [customTitle, setCustomTitle] = useState('');
  const [customCost, setCustomCost] = useState('');

  if (!isOpen) return null;

  const defaultEmergencies = [
    { type: 'Healthcare / Medical Bill', cost: 1200, icon: '🏥' },
    { type: 'Phone / Laptop Screen Repair', cost: 1800, icon: '📱' },
    { type: 'Vehicle Breakdown', cost: 950, icon: '🛵' },
    { type: 'Unplanned Family / Home Expense', cost: 1500, icon: '🏠' },
  ];

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customTitle || !customCost) return;
    onInjectEmergency(customTitle, Number(customCost));
    setCustomTitle('');
    setCustomCost('');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-amber-200 rounded-3xl shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="text-lg font-black text-slate-900">🚨 Trigger Emergency Shock</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 font-bold p-1">✕</button>
        </div>
        
        <p className="text-xs text-slate-500 leading-relaxed">
          Simulate unexpected shocks impacting your balance on Day <b>{selectedDay}</b>. Choose a preset or define your own custom emergency amount:
        </p>

        {/* Preset Emergencies */}
        <div className="grid grid-cols-1 gap-2.5">
          {defaultEmergencies.map((item) => (
            <div 
              key={item.type}
              className="flex justify-between items-center p-3 bg-amber-50/50 border border-amber-200/80 rounded-2xl"
            >
              <span className="text-xs font-bold text-slate-800">{item.icon} {item.type}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-red-600">-₹{item.cost}</span>
                <button
                  onClick={() => onInjectEmergency(item.type, item.cost)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  Trigger
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Emergency Form */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Add Custom Emergency Shock</h4>
          <form onSubmit={handleCustomSubmit} className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="Emergency Title (e.g. Broken Glass)"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full bg-sky-50/50 border border-amber-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Custom Cost Amount (₹)"
                value={customCost}
                onChange={(e) => setCustomCost(e.target.value)}
                className="w-full bg-sky-50/50 border border-amber-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all shadow-md"
            >
              Trigger Custom Emergency ⚠️
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}