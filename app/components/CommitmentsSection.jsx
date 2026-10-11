'use client';
import { useState } from 'react';

export default function CommitmentsSection({ commitments = [], onAddCommitment, onDeleteCommitment }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Subscription');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount) return;
    onAddCommitment({ id: Date.now(), name, amount: Number(amount), type });
    setName('');
    setAmount('');
  };

  return (
    <div className="bg-white/90 border border-sky-200 p-6 rounded-3xl shadow-sm space-y-4">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-lg font-bold text-slate-900">Commitments & Subscriptions 🧾</h3>
        <p className="text-xs text-slate-500">Track recurring fixed monthly bills & subscriptions.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <input
            type="text"
            placeholder="Name (e.g. Netflix)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-sky-50/50 border border-sky-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none"
            required
          />
          <input
            type="number"
            placeholder="Cost (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-sky-50/50 border border-sky-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none"
            required
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-sky-50/50 border border-sky-200 rounded-xl px-2 py-2 text-xs font-medium focus:outline-none"
          >
            <option value="Subscription">Subscription</option>
            <option value="Fixed Commitment">Fixed Bill</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-all"
        >
          Add Commitment / Subscription ➕
        </button>
      </form>

      <div className="space-y-2 max-h-36 overflow-y-auto">
        {commitments.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">No commitments or subscriptions added yet.</p>
        ) : (
          commitments.map((c) => (
            <div key={c.id} className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <div>
                <span className="font-bold text-slate-900">{c.name}</span>
                <span className="ml-2 text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">{c.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-red-600">-₹{c.amount}</span>
                <button onClick={() => onDeleteCommitment(c.id)} className="text-slate-400 hover:text-red-600 font-bold">✕</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}