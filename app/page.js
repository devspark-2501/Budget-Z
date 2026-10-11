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
  Filler,
} from 'chart.js';

import ToastNotification from './components/ToastNotification';
import SetupScreen from './components/SetupScreen';
import Header from './components/Header';
import MetricsGrid from './components/MetricsGrid';
import ExpenseForm from './components/ExpenseForm';
import ExpenseLedger from './components/ExpenseLedger';
import AnalyticsCharts from './components/AnalyticsCharts';
import EmergencyModal from './components/EmergencyModal';
import AuditModal from './components/AuditModal';
import DecisionSimulator from './components/DecisionSimulator';
import CommitmentsSection from './components/CommitmentsSection';

// Register ChartJS plugins including Filler
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

export default function BudgetZApp() {
  const [step, setStep] = useState('setup');

  const [totalBudget, setTotalBudget] = useState('10000');
  const [savingsTarget, setSavingsTarget] = useState('2500');
  const [selectedMonth, setSelectedMonth] = useState('October');

  // CLEAN SLATE: Zero default dummy data
  const [expenses, setExpenses] = useState([]);
  const [commitments, setCommitments] = useState([]);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Food & Dining');
  const [selectedDay, setSelectedDay] = useState(1);
  const [amount, setAmount] = useState('');

  const [toast, setToast] = useState(null);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  const triggerToast = (msg, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4500);
  };

  const numBudget = Number(totalBudget) || 10000;
  const numSavings = Number(savingsTarget) || 0;
  
  const totalCommitments = useMemo(() => (commitments || []).reduce((a, b) => a + b.amount, 0), [commitments]);
  const totalExpenses = useMemo(() => (expenses || []).reduce((a, b) => a + b.amount, 0), [expenses]);
  const totalSpent = totalExpenses + totalCommitments;

  const remainingBalance = numBudget - totalSpent;
  const isTargetBreached = remainingBalance < numSavings;
  const dailyAllowance = Math.max(0, Math.round(remainingBalance / 30));

  const riskLevel = useMemo(() => {
    if (remainingBalance < numSavings) return { level: 'High Financial Risk 🔴', color: 'bg-red-50 text-red-700 border-red-200' };
    if (remainingBalance < numSavings + 1000) return { level: 'Moderate Financial Risk 🟡', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { level: 'Optimal Financial Health 🟢', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  }, [remainingBalance, numSavings]);

  const handleLockAndStart = (e) => {
    e.preventDefault();
    if (!totalBudget || !savingsTarget) return;
    setStep('dashboard');
    triggerToast(`Income & Budget Locked! ₹${totalBudget} bag active for 30 Days.`, 'success');
  };

  const handleReconfigure = () => {
    if (window.confirm('Resetting will clear all current records and reboot your 30-day simulator. Continue?')) {
      setExpenses([]);
      setCommitments([]);
      setStep('setup');
      triggerToast('Simulator reset to blank state.', 'info');
    }
  };

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

    const newRem = numBudget - (totalSpent + parsedAmount);
    setExpenses((prev) => [newExp, ...prev]);
    setTitle('');
    setAmount('');

    if (newRem < numSavings) {
      triggerToast(`⚠️ ALERT: Savings goal breached! ₹${newRem} remaining in balance.`, 'danger');
    } else {
      triggerToast(`Expense added successfully! Remaining balance: ₹${newRem}`, 'success');
    }
  };

  const handleDeleteExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    triggerToast('Expense deleted and balance updated.', 'info');
  };

  const handleAddCommitment = (c) => {
    setCommitments((prev) => [c, ...(prev || [])]);
    triggerToast(`Added commitment: ${c.name} (-₹${c.amount})`, 'info');
  };

  const handleDeleteCommitment = (id) => {
    setCommitments((prev) => prev.filter((c) => c.id !== id));
    triggerToast('Commitment removed.', 'info');
  };

  const injectEmergency = (type, cost) => {
    const newExp = {
      id: Date.now(),
      title: `🚨 Unexpected Expense: ${type}`,
      category: 'Unexpected Expenses',
      day: selectedDay,
      month: selectedMonth,
      amount: cost,
      isEmergency: true,
    };

    setExpenses((prev) => [newExp, ...prev]);
    setShowEmergencyModal(false);
    triggerToast(`🚨 UNEXPECTED EXPENSE SHOCK: -₹${cost} deducted!`, 'danger');
  };

  const lineChartData = useMemo(() => {
    const days = Array.from({ length: 30 }, (_, i) => i + 1);
    let runningBalance = numBudget - totalCommitments;

    const dataPoints = days.map((day) => {
      const dayExpenses = (expenses || []).filter((e) => e.day === day);
      const spentOnDay = dayExpenses.reduce((a, b) => a + b.amount, 0);
      runningBalance -= spentOnDay;
      return runningBalance;
    });

    return {
      labels: days.map((d) => `Day ${d}`),
      datasets: [
        {
          label: 'Monthly Forecast Balance (₹)',
          data: dataPoints,
          borderColor: '#0284c7',
          backgroundColor: 'rgba(2, 132, 199, 0.1)',
          fill: true,
          tension: 0.3,
        },
        {
          label: 'Savings Goal Threshold',
          data: days.map(() => numSavings),
          borderColor: '#ef4444',
          borderDash: [5, 5],
          pointRadius: 0,
        },
      ],
    };
  }, [expenses, numBudget, numSavings, totalCommitments]);

  const categoryData = useMemo(() => {
    const cats = ['Food & Dining', 'Shopping', 'Travel', 'Unexpected Expenses', 'Fixed Commitment'];
    const sums = cats.map((cat) => {
      if (cat === 'Fixed Commitment') {
        return (commitments || []).reduce((a, b) => a + b.amount, 0);
      }
      return (expenses || []).filter((e) => e.category === cat).reduce((a, b) => a + b.amount, 0);
    });

    return {
      labels: cats,
      datasets: [
        {
          data: sums,
          backgroundColor: ['#38bdf8', '#f472b6', '#fbbf24', '#f87171', '#34d399'],
        },
      ],
    };
  }, [expenses, commitments]);

  if (step === 'setup') {
    return (
      <SetupScreen
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        totalBudget={totalBudget}
        setTotalBudget={setTotalBudget}
        savingsTarget={savingsTarget}
        setSavingsTarget={setSavingsTarget}
        onLockAndStart={handleLockAndStart}
      />
    );
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-sky-50 via-white to-blue-50 text-slate-800 p-4 md:p-8 flex flex-col space-y-6 relative">
      <ToastNotification toast={toast} />

      <Header
        selectedMonth={selectedMonth}
        numBudget={numBudget}
        numSavings={numSavings}
        onOpenEmergency={() => setShowEmergencyModal(true)}
        onOpenAudit={() => setShowAuditModal(true)}
        onReconfigure={handleReconfigure}
      />

      <MetricsGrid
        numBudget={numBudget}
        totalSpent={totalSpent}
        remainingBalance={remainingBalance}
        dailyAllowance={dailyAllowance}
        riskLevel={riskLevel}
      />

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DecisionSimulator
          remainingBalance={remainingBalance}
          savingsTarget={savingsTarget}
          numBudget={numBudget}
        />
        <CommitmentsSection
          commitments={commitments}
          onAddCommitment={handleAddCommitment}
          onDeleteCommitment={handleDeleteCommitment}
        />
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <ExpenseForm
            title={title}
            setTitle={setTitle}
            category={category}
            setCategory={setCategory}
            amount={amount}
            setAmount={setAmount}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            onAddExpense={handleAddExpense}
          />
        </div>

        <div className="lg:col-span-7">
          <ExpenseLedger
            expenses={expenses}
            selectedMonth={selectedMonth}
            onDeleteExpense={handleDeleteExpense}
          />
        </div>
      </div>

      <AnalyticsCharts lineChartData={lineChartData} categoryData={categoryData} />

      <EmergencyModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        selectedDay={selectedDay}
        onInjectEmergency={injectEmergency}
      />

      <AuditModal
        isOpen={showAuditModal}
        onClose={() => setShowAuditModal(false)}
        totalSpent={totalSpent}
        remainingBalance={remainingBalance}
        numSavings={numSavings}
        isTargetBreached={isTargetBreached}
        selectedMonth={selectedMonth}
      />
    </main>
  );
}