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

  const navLinkClass = ({ isActive }) =>
    `relative px-1 py-1 transition-colors duration-200 ${
      isActive
        ? "text-indigo-600 font-semibold"
        : "text-slate-500 hover:text-slate-900"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
      isActive
        ? "text-indigo-600 font-semibold bg-indigo-50"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
    }`;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-slate-200/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 hover:opacity-90 transition group"
            onClick={closeMobileMenu}
          >
            <img
              src="/favicon.svg"
              alt="FreelanceHub"
              className="h-9 w-9 transition-transform group-hover:scale-105"
            />
            <span className="font-bold text-lg text-slate-900 tracking-tight">
              Freelance<span className="text-indigo-600">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/jobs" className={navLinkClass}>
              Jobs
            </NavLink>
            <NavLink to="/freelancers" className={navLinkClass}>
              Freelancers
            </NavLink>
            {isLoggedIn && (
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
            )}

            <div className="w-px h-5 bg-slate-200 mx-1" />

            {!isLoggedIn && (
              <>
                <NavLink
                  to="/login"
                  className="px-4 py-2 rounded-xl text-slate-700 text-sm font-medium hover:bg-slate-100 transition-all duration-200"
                >
                  Sign in
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200"
                >
                  Get started
                </NavLink>
              </>
            )}

            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl text-slate-500 text-sm font-medium hover:text-red-600 hover:bg-red-50 transition-all duration-200"
              >
                Sign out
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 sm:hidden"
              onClick={closeMobileMenu}
            />
            <nav className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-xl z-50 sm:hidden">
              <div className="px-3 py-4 space-y-1">
                <NavLink to="/" onClick={closeMobileMenu} className={mobileNavLinkClass}>
                  Home
                </NavLink>
                <NavLink to="/jobs" onClick={closeMobileMenu} className={mobileNavLinkClass}>
                  Jobs
                </NavLink>
                <NavLink to="/freelancers" onClick={closeMobileMenu} className={mobileNavLinkClass}>
                  Freelancers
                </NavLink>
                {isLoggedIn && (
                  <NavLink to="/dashboard" onClick={closeMobileMenu} className={mobileNavLinkClass}>
                    Dashboard
                  </NavLink>
                )}

                <div className="pt-3 mt-2 border-t border-slate-100 space-y-2">
                  {!isLoggedIn && (
                    <>
                      <NavLink
                        to="/login"
                        onClick={closeMobileMenu}
                        className="block px-4 py-2.5 rounded-xl bg-slate-100 text-slate-800 text-sm font-medium hover:bg-slate-200 transition text-center"
                      >
                        Sign in
                      </NavLink>
                      <NavLink
                        to="/register"
                        onClick={closeMobileMenu}
                        className="block px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium text-center"
                      >
                        Get started
                      </NavLink>
                    </>
                  )}

                  {isLoggedIn && (
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 rounded-xl text-red-600 bg-red-50 text-sm font-medium hover:bg-red-100 transition"
                    >
                      Sign out
                    </button>
                  )}
                </div>
              </div>
            </nav>
          </>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
        {title && (
          <div className="mb-8 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm sm:text-base text-slate-500 max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 bg-white/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <img src="/favicon.svg" alt="" className="h-5 w-5 opacity-60" />
            <span>FreelanceHub — Portfolio project by Olena Beliavska</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>React + Tailwind</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>Laravel API</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
