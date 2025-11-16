export default function PageContainer({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-semibold">
              FH
            </div>
            <span className="font-semibold text-slate-900">FreelanceHub</span>
          </div>

          <nav className="hidden sm:flex gap-4 text-sm text-slate-600">
            <a href="#" className="hover:text-slate-900">
              Jobs
            </a>
            <a href="#" className="hover:text-slate-900">
              Freelancers
            </a>
            <a href="#" className="hover:text-slate-900">
              Dashboard
            </a>
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
