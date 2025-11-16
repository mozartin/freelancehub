export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    outline:
      "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
    ghost: "text-slate-700 hover:bg-slate-100",
  };

  const styles = `${base} ${variants[variant]} ${className}`;

  return (
    <button className={styles} {...props}>
      {children}
    </button>
  );
}
