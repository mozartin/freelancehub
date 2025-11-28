import { Link, NavLink, useNavigate } from "react-router-dom";

export default function PageContainer({ title, subtitle, children }) {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("auth_token");

  const handleLogout = async () => {
    const token = localStorage.getItem("auth_token");

    if (token) {
      await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
    }

    localStorage.removeItem("auth_token");
    navigate("/login");
  };

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

          <nav className="hidden sm:flex items-center gap-4 text-sm text-slate-600">
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

            {isLoggedIn && (
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
            )}

            {!isLoggedIn && (
              <>
                <NavLink
                  to="/login"
                  className="ml-4 px-3 py-1.5 rounded-md bg-slate-200 text-slate-800 text-xs font-medium hover:bg-slate-300 transition"
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  className="px-3 py-1.5 rounded-md bg-indigo-500 text-white text-xs font-medium hover:bg-indigo-600 transition"
                >
                  Create account
                </NavLink>
              </>
            )}

            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="ml-4 px-3 py-1.5 rounded-md bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition"
              >
                Logout
              </button>
            )}
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
