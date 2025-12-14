import { useEffect, useMemo, useState } from "react";
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

      return (
        name.includes(query) || title.includes(query) || skills.includes(query)
      );
    });
  }, [freelancers, search]);

  const handlePrev = () => {
    if (meta?.current_page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (meta?.current_page < meta?.last_page) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <PageContainer
      title="Freelancers"
      subtitle="Meet talented people ready to join your projects."
    >
      <form
        className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="text"
          placeholder="Search by name, skills, or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <Button
          type="button"
          variant="outline"
          className="sm:w-auto w-full"
          onClick={() => setSearch("")}
        >
          Reset
        </Button>
      </form>

      {loading && <p className="text-sm text-slate-500">Loading...</p>}
      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      {!loading && !error && filteredFreelancers.length === 0 && (
        <p className="text-sm text-slate-500">
          No matching profiles yet. Try adjusting your search.
        </p>
      )}

      <div className="grid gap-4">
        {filteredFreelancers.map((profile) => (
          <FreelancerCard key={profile.id} profile={profile} />
        ))}
      </div>

      {meta?.last_page > 1 && (
        <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
          <Button
            variant="outline"
            className="px-3 py-2"
            onClick={handlePrev}
            disabled={meta.current_page === 1}
          >
            Prev
          </Button>
          <span className="text-xs text-slate-500">
            Page {meta.current_page} of {meta.last_page}
          </span>
          <Button
            variant="outline"
            className="px-3 py-2"
            onClick={handleNext}
            disabled={meta.current_page === meta.last_page}
          >
            Next
          </Button>
        </div>
      )}
    </PageContainer>
  );
}

function FreelancerCard({ profile }) {
  const skills =
    typeof profile.skills === "string"
      ? profile.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : profile.skills || [];

  return (
    <Card className="flex flex-col gap-3 sm:gap-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-slate-900">
            {profile.user?.name || "No name"}
          </h2>
          {profile.title && (
            <p className="text-sm text-slate-600 mt-1">{profile.title}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
            {profile.experience_level && (
              <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-[11px] font-medium text-indigo-700 border border-indigo-100">
                {profile.experience_level}
              </span>
            )}
            {profile.hourly_rate != null && (
              <>
                <span>•</span>
                <span>€{profile.hourly_rate}/h</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {profile.linkedin_url && (
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-indigo-600 hover:text-indigo-700"
            >
              LinkedIn
            </a>
          )}
          {profile.github_url && (
            <a
              href={profile.github_url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-indigo-600 hover:text-indigo-700"
            >
              GitHub
            </a>
          )}
          {profile.website_url && (
            <a
              href={profile.website_url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-indigo-600 hover:text-indigo-700"
            >
              Website
            </a>
          )}
        </div>
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

      <div className="text-xs text-slate-500">
        {profile.user?.email && (
          <span className="block">Email: {profile.user.email}</span>
        )}
      </div>
    </Card>
  );
}

