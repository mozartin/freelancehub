import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setSubmitting(true);
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Invalid credentials. Please check your email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer
      title="Sign in to FreelanceHub"
      subtitle="Access your dashboard to manage jobs and proposals."
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
              Welcome back
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Enter your credentials to continue.
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">
                Use your client or freelancer account to sign in.
              </span>
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </PageContainer>
  );
}
