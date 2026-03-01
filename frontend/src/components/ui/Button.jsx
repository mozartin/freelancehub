export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const sizes = {
    sm: "rounded-lg px-3 py-1.5 text-xs",
    md: "rounded-xl px-5 py-2.5 text-sm",
    lg: "rounded-xl px-6 py-3 text-base",
  };

  const variants = {
    primary:
      "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/30 hover:from-indigo-700 hover:to-violet-700 active:scale-[0.98]",
    outline:
      "border border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 active:scale-[0.98]",
    ghost:
      "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    danger:
      "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-md shadow-red-500/25 hover:shadow-lg hover:shadow-red-500/30 hover:from-red-600 hover:to-rose-600 active:scale-[0.98]",
  };

  const styles = `${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${className}`;

  return (
    <button className={styles} {...props}>
      {children}
    </button>
  );
}
