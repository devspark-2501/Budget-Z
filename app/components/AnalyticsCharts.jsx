'use client';

import { Line, Doughnut } from 'react-chartjs-2';

export default function AnalyticsCharts({ lineChartData, categoryData }) {
  return (
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
  );
}