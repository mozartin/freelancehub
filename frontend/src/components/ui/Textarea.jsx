export default function Textarea({
  label,
  helperText,
  className = "",
  rows = 4,
  ...props
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label && <span className="text-slate-700 font-medium">{label}</span>}
      <textarea
        rows={rows}
        className={`rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y ${className}`}
        {...props}
      />
      {helperText && (
        <span className="text-[11px] text-slate-400">{helperText}</span>
      )}
    </label>
  );
}
