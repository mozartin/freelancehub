import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function PageContainer({ title, subtitle, children }) {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("auth_token");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (e) {
      // Ignore network/CORS issues; still clear local state
      console.warn("Logout request failed, clearing local session", e);
    } finally {
      localStorage.removeItem("auth_token");
      setIsMobileMenuOpen(false);
      navigate("/login");
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white relative">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-90 transition"
            onClick={closeMobileMenu}
          >
            <div className="h-8 w-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-semibold">
              FH
            </div>
            <span className="font-semibold text-slate-900">FreelanceHub</span>
          </Link>

          {/* Desktop Navigation */}
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/20 z-40 sm:hidden"
              onClick={closeMobileMenu}
            />
            {/* Menu */}
            <nav className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg z-50 sm:hidden">
              <div className="px-4 py-3 space-y-1">
                <NavLink
                  to="/"
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-sm transition ${
                      isActive
                        ? "text-indigo-600 font-semibold bg-indigo-50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`
                  }
                >
                  Home
                </NavLink>

                <NavLink
                  to="/jobs"
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-sm transition ${
                      isActive
                        ? "text-indigo-600 font-semibold bg-indigo-50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`
                  }
                >
                  Jobs
                </NavLink>

                <NavLink
                  to="/freelancers"
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-sm transition ${
                      isActive
                        ? "text-indigo-600 font-semibold bg-indigo-50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`
                  }
                >
                  Freelancers
                </NavLink>

                {isLoggedIn && (
                  <NavLink
                    to="/dashboard"
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-sm transition ${
                        isActive
                          ? "text-indigo-600 font-semibold bg-indigo-50"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                )}

                {!isLoggedIn && (
                  <>
                    <div className="pt-2 border-t border-slate-200 mt-2">
                      <NavLink
                        to="/login"
                        onClick={closeMobileMenu}
                        className="block px-3 py-2 rounded-md bg-slate-200 text-slate-800 text-sm font-medium hover:bg-slate-300 transition text-center"
                      >
                        Login
                      </NavLink>
                    </div>
                    <NavLink
                      to="/register"
                      onClick={closeMobileMenu}
                      className="block px-3 py-2 rounded-md bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition text-center"
                    >
                      Create account
                    </NavLink>
                  </>
                )}

                {isLoggedIn && (
                  <div className="pt-2 border-t border-slate-200 mt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full px-3 py-2 rounded-md bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </>
        )}
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
