import { Link, NavLink } from "react-router-dom";

export default function PageContainer({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-90 transition"
          >
            <div className="h-8 w-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-semibold">
              FH
            </div>
            <span className="font-semibold text-slate-900">FreelanceHub</span>
          </Link>

          <nav className="hidden sm:flex gap-4 text-sm text-slate-600">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-indigo-600 font-semibold"
                  : "hover:text-slate-900"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/jobs"
              className={({ isActive }) =>
                isActive
                  ? "text-indigo-600 font-semibold"
                  : "hover:text-slate-900"
              }
            >
              Jobs
            </NavLink>

            <NavLink
              to="/freelancers"
              className={({ isActive }) =>
                isActive
                  ? "text-indigo-600 font-semibold"
                  : "hover:text-slate-900"
              }
            >
              Freelancers
            </NavLink>

            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "text-indigo-600 font-semibold"
                  : "hover:text-slate-900"
              }
            >
              Dashboard
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        {title && (
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
