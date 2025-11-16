export default function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl bg-white shadow-sm border border-slate-200 p-4 sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
}
