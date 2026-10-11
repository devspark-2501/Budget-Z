'use client';

export default function ToastNotification({ toast }) {
  if (!toast) return null;

  const bgStyles =
    toast.type === 'danger'
      ? 'bg-red-50 border-red-200 text-red-800'
      : toast.type === 'success'
      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
      : 'bg-sky-50 border-sky-200 text-sky-800';

  return (
    <div
      className={`fixed top-6 right-6 z-50 px-5 py-4 rounded-2xl shadow-2xl border text-sm font-bold flex items-center gap-3 animate-bounce ${bgStyles}`}
    >
      <span>{toast.msg}</span>
    </div>
  );
}