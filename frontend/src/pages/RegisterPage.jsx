import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../auth/AuthContext";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [searchParams] = useSearchParams();

  const initialRole =
    searchParams.get("role") === "freelancer" ? "freelancer" : "client";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(initialRole);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useDocumentTitle("Create account");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setFieldErrors({});

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (password !== passwordConfirmation) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);

      await register({
        name,
        email,
        role,
        password,
        password_confirmation: passwordConfirmation,
      });

      navigate("/login");
    } catch (err) {
      console.error("REGISTER ERROR:", err);

      if (err.validation) {
        setFieldErrors(err.validation);
      } else {
        setErrorMessage(
          err.message || "Registration failed. Please check your data."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <div className="max-w-md mx-auto pt-4 sm:pt-8">
        <div className="mb-6">
          <Link
            to="/"
            className="text-sm text-slate-500 hover:text-indigo-600 inline-flex items-center gap-1.5 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to home
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/25 mb-4">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Join FreelanceHub
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create your account as a client or freelancer.
          </p>
        </div>

        <Card>
          {(errorMessage || Object.keys(fieldErrors).length > 0) && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 space-y-1">
              {errorMessage && <p>{errorMessage}</p>}
              {fieldErrors.name && <p>Name: {fieldErrors.name[0]}</p>}
              {fieldErrors.email && <p>Email: {fieldErrors.email[0]}</p>}
              {fieldErrors.role && <p>Role: {fieldErrors.role[0]}</p>}
              {fieldErrors.password && (
                <p>Password: {fieldErrors.password[0]}</p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Name"
              type="text"
              name="name"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Role selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 tracking-tight">
                I want to
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("client")}
                  className={`rounded-xl border-2 px-4 py-3 text-sm font-medium text-center transition-all duration-200 cursor-pointer ${
                    role === "client"
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <div className="text-lg mb-1">💼</div>
                  Hire talent
                  <div className="text-[11px] text-slate-400 mt-0.5 font-normal">Client</div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("freelancer")}
                  className={`rounded-xl border-2 px-4 py-3 text-sm font-medium text-center transition-all duration-200 cursor-pointer ${
                    role === "freelancer"
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <div className="text-lg mb-1">🚀</div>
                  Find work
                  <div className="text-[11px] text-slate-400 mt-0.5 font-normal">Freelancer</div>
                </button>
              </div>
            </div>

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText="At least 6 characters."
            />

            <Input
              label="Confirm password"
              type="password"
              name="password_confirmation"
              placeholder="••••••••"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />

            <div className="pt-2">
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Creating account..." : "Create account"}
              </Button>
            </div>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5 pt-4 border-t border-slate-100">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </PageContainer>
  );
}
