import "./globals.css";

export const metadata = {
  title: "CivicFix | Community Problem Reporting Platform",
  description:
    "Report local civic issues, track real-time resolution status, and notify municipal authorities directly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans">
        {children}
      </body>
    </html>
  );
}