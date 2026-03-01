import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { getFreelancers } from "../api/freelancers";

export default function FreelancersPage() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);

  useDocumentTitle("Freelancers");

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        setLoading(true);
        setError("");
        const { items, meta: incomingMeta } = await getFreelancers(page);
        setFreelancers(items || []);
        setMeta(incomingMeta);
      } catch (err) {
        console.error(err);
        setError("Failed to load freelancers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancers();
  }, [page]);

  const filteredFreelancers = useMemo(() => {
    if (!search.trim()) return freelancers;
    const query = search.toLowerCase();
    return freelancers.filter((item) => {
      const name = item.user?.name?.toLowerCase() || "";
      const title = item.title?.toLowerCase() || "";
      const skills =
        typeof item.skills === "string"
          ? item.skills.toLowerCase()
          : Array.isArray(item.skills)
          ? item.skills.join(", ").toLowerCase()
          : "";
      return name.includes(query) || title.includes(query) || skills.includes(query);
    });
  }, [freelancers, search]);

  const handlePrev = () => {
    if (meta?.current_page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (meta?.current_page < meta?.last_page) setPage((prev) => prev + 1);
  };

  return (
    <PageContainer
      title="Freelancers"
      subtitle="Meet talented people ready to join your projects."
    >
      {/* Search bar */}
      <form
        className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, skills, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 hover:border-slate-300"
          />
        </div>
        <Button variant="outline" className="sm:w-auto w-full" onClick={() => setSearch("")}>
          Reset
        </Button>
      </form>

      {/* States */}
      {loading && (
        <div className="flex items-center gap-2 text-sm text-slate-500 py-8">
          <svg className="animate-spin h-4 w-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading freelancers...
        </div>
      )}
      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      {!loading && !error && filteredFreelancers.length === 0 && (
        <div className="text-center py-12 rounded-2xl border border-dashed border-slate-200">
          <p className="text-sm text-slate-500">
            No matching profiles yet. Try adjusting your search.
          </p>
        </div>
      )}

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filteredFreelancers.map((profile) => (
          <FreelancerCard key={profile.id} profile={profile} />
        ))}
      </div>

      {/* Pagination */}
      {meta?.last_page > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={handlePrev} disabled={meta.current_page === 1}>
            ← Previous
          </Button>
          <span className="text-xs text-slate-500">
            Page {meta.current_page} of {meta.last_page}
          </span>
          <Button variant="outline" size="sm" onClick={handleNext} disabled={meta.current_page === meta.last_page}>
            Next →
          </Button>
        </div>
      )}
    </PageContainer>
  );
}

function FreelancerCard({ profile }) {
  const skills =
    typeof profile.skills === "string"
      ? profile.skills.split(",").map((s) => s.trim()).filter(Boolean)
      : profile.skills || [];

  return (
    <Card hover className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar placeholder */}
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-indigo-500/20 shrink-0">
            {(profile.user?.name || "?")[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-slate-900">
              {profile.user?.name || "No name"}
            </h2>
            {profile.title && (
              <p className="text-xs text-slate-500 mt-0.5">{profile.title}</p>
            )}
          </div>
        </div>

        {profile.hourly_rate != null && (
          <div className="text-right shrink-0">
            <div className="text-sm font-bold text-slate-900">
              €{profile.hourly_rate}
            </div>
            <div className="text-[10px] text-slate-400">/ hour</div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {profile.experience_level && (
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700 border border-indigo-100">
            {profile.experience_level}
          </span>
        )}

        {/* Social links */}
        {profile.linkedin_url && (
          <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="text-[11px] text-indigo-600 hover:text-indigo-700 font-medium">
            LinkedIn
          </a>
        )}
        {profile.github_url && (
          <a href={profile.github_url} target="_blank" rel="noreferrer" className="text-[11px] text-indigo-600 hover:text-indigo-700 font-medium">
            GitHub
          </a>
        )}
        {profile.website_url && (
          <a href={profile.website_url} target="_blank" rel="noreferrer" className="text-[11px] text-indigo-600 hover:text-indigo-700 font-medium">
            Website
          </a>
        )}
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <span key={skill} className="skill-tag rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="pt-2 border-t border-slate-100">
        <Link to={`/freelancers/${profile.id}`}>
          <Button variant="outline" size="sm" className="w-full">
            View profile
          </Button>
        </Link>
      </div>
    </Card>
  );
}
