export default function Card({ children, className = "", hover = false }) {
  return (
    <div
      className={`rounded-2xl bg-white border border-slate-100 shadow-sm p-5 sm:p-6 ${
        hover ? "card-hover" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
