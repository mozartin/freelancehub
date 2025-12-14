// src/pages/RegisterPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../auth/AuthContext";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("client");
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
        role, // 🔥 send role to backend
        password,
        password_confirmation: passwordConfirmation,
      });

      navigate("/login");
    } catch (err) {
      console.error("REGISTER ERROR:", err);
      console.log("VALIDATION:", err.validation);

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
    <PageContainer
      title="Create your FreelanceHub account"
      subtitle="Join as a client or freelancer and start using the platform."
    >
      <div className="max-w-md mx-auto">
        <div className="mb-4">
          <Link
            to="/"
            className="text-xs text-slate-500 hover:text-slate-700 inline-flex items-center gap-1"
          >
            <span>←</span>
            <span>Back to home</span>
          </Link>
        </div>

        <Card className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Create account
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Fill in your details to get started.
            </p>
          </div>

          {(errorMessage || Object.keys(fieldErrors).length > 0) && (
            <div className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-md px-3 py-2 space-y-1">
              {errorMessage && <p>{errorMessage}</p>}
              {fieldErrors.name && <p>Name: {fieldErrors.name[0]}</p>}
              {fieldErrors.email && <p>Email: {fieldErrors.email[0]}</p>}
              {fieldErrors.role && <p>Role: {fieldErrors.role[0]}</p>}
              {fieldErrors.password && (
                <p>Password: {fieldErrors.password[0]}</p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
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

            {/* role selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Register as
              </label>
              <select
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="client">Client</option>
                <option value="freelancer">Freelancer</option>
              </select>
            </div>

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              label="Confirm password"
              type="password"
              name="password_confirmation"
              placeholder="••••••••"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">
                Password must be at least 6 characters.
              </span>
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Creating account..." : "Create account"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </PageContainer>
  );
}
