export default function Textarea({
  label,
  helperText,
  className = "",
  rows = 4,
  ...props
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      {label && (
        <span className="text-slate-700 font-medium tracking-tight">
          {label}
        </span>
      )}
      <textarea
        rows={rows}
        className={`rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 focus:bg-white hover:border-slate-300 resize-y ${className}`}
        {...props}
      />
      {helperText && (
        <span className="text-[11px] text-slate-400 leading-tight">
          {helperText}
        </span>
      )}
    </label>
  );
}
