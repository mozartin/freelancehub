import { Link, useNavigate } from "react-router-dom";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { useAuth } from "../../auth/AuthContext";

export default function JobCard({
  id,
  title,
  company,
  location,
  budget,
  type,
  skills = [],
  createdAt,
}) {
  const { user, isAuthenticated } = useAuth();
  const isFreelancer = user?.role === "freelancer";
  const isClient = user?.role === "client";
  const navigate = useNavigate();

  return (
    <Card hover className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <Link
            to={id ? `/jobs/${id}` : "#"}
            className="group"
          >
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">
              {title}
            </h2>
          </Link>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            {company && (
              <span className="inline-flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
                {company}
              </span>
            )}
            {location && (
              <>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                  </svg>
                  {location}
                </span>
              </>
            )}
            {type && (
              <>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700 border border-violet-100">
                  {type}
                </span>
              </>
            )}
          </div>
        </div>

        {budget && (
          <div className="text-right shrink-0">
            <div className="text-base font-bold text-slate-900">{budget}</div>
            <div className="text-[11px] text-slate-400 font-medium">
              {type === "Hourly" ? "per hour" : "fixed price"}
            </div>
          </div>
        )}
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <span
              key={skill}
              className="skill-tag rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <span className="text-xs text-slate-400">
          {createdAt || "Posted recently"}
        </span>
        <div className="flex items-center gap-2">
          {id && (
            <Link
              to={`/jobs/${id}`}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              View details →
            </Link>
          )}
          {id && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!isAuthenticated) {
                  navigate("/register?role=freelancer");
                  return;
                }
                if (!isFreelancer) return;
                navigate(`/jobs/${id}?apply=1`);
              }}
              disabled={isClient}
            >
              {isClient ? "Clients cannot apply" : "Apply"}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
