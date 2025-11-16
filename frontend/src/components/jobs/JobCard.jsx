import { Link } from "react-router-dom";
import Card from "../ui/Card";
import Button from "../ui/Button";

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
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-slate-900">
            {title}
          </h2>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            {company && <span>{company}</span>}
            {location && (
              <>
                <span>•</span>
                <span>{location}</span>
              </>
            )}
            {type && (
              <>
                <span>•</span>
                <span>{type}</span>
              </>
            )}
          </div>
        </div>

        {budget && (
          <div className="text-right">
            <div className="text-sm font-semibold text-slate-900">{budget}</div>
            <div className="text-xs text-slate-500">/ hour</div>
          </div>
        )}
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-slate-400">
          {createdAt || "Posted recently"}
        </span>
        <div className="flex items-center gap-2">
          {id && (
            <Link
              to={`/jobs/${id}`}
              className="text-xs text-indigo-600 hover:text-indigo-700"
            >
              View details
            </Link>
          )}
          <Button variant="outline" className="text-xs px-3 py-1.5">
            Apply
          </Button>
        </div>
      </div>
    </Card>
  );
}
