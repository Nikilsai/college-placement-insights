import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import { CompanyCard } from "@/components/CompanyCard";
import { useCompany } from "@/context/CompanyContext";
import {
  CATEGORY_ORDER,
  CATEGORY_STYLES,
  normalizeCategory,
  type CategoryKey,
} from "@/lib/companyStyles";
import { COLLEGE_SHORT, PORTAL_SUBTITLE, PORTAL_TITLE } from "@/lib/college";
import type { CompanySummary } from "@/lib/companyData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: PORTAL_TITLE },
      { name: "description", content: PORTAL_SUBTITLE },
      { property: "og:title", content: PORTAL_TITLE },
      { property: "og:description", content: PORTAL_SUBTITLE },
    ],
  }),
  component: Index,
});

type FilterKey = "All" | CategoryKey;

function CardSkeleton() {
  return (
    <div className="h-52 animate-pulse rounded-xl border border-border bg-card p-4">
      <div className="h-12 w-12 rounded-lg bg-muted" />
      <div className="mt-4 h-4 w-2/3 rounded bg-muted" />
      <div className="mt-2 h-3 w-1/3 rounded bg-muted" />
      <div className="mt-6 space-y-2">
        <div className="h-3 w-3/4 rounded bg-muted" />
        <div className="h-3 w-1/2 rounded bg-muted" />
      </div>
    </div>
  );
}

function Index() {
  const navigate = useNavigate();
  const { hydrated, summaries, selectCompany } = useCompany();

  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [filter, setFilter] = useState<FilterKey>("All");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 200);
    return () => clearTimeout(t);
  }, [query]);

  const counts = useMemo(() => {
    const base: Record<FilterKey, number> = {
      All: summaries.length,
      "Super Dream": 0,
      Dream: 0,
      Standard: 0,
      Regular: 0,
    };
    for (const c of summaries) base[normalizeCategory(c.companyType)] += 1;
    return base;
  }, [summaries]);

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    return summaries.filter((c) => {
      const matchesFilter = filter === "All" || normalizeCategory(c.companyType) === filter;
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.shortName.toLowerCase().includes(q) ||
        c.headquarters.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [summaries, filter, debounced]);

  function handleSelect(companyId: number) {
    selectCompany(companyId);
    navigate({ to: "/company/intelligence" });
  }

  function resetAll() {
    setQuery("");
    setDebounced("");
    setFilter("All");
  }

  const filters: FilterKey[] = ["All", ...CATEGORY_ORDER];

  return (
    <div className="min-h-screen bg-card">
      {/* Hero — clean white, bottom border, no gradient */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
          <span className="inline-block rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground">
            {COLLEGE_SHORT} · INTELLIGENCE PLATFORM
          </span>
          <h1 className="mt-4 max-w-3xl font-heading text-2xl font-bold leading-tight text-foreground sm:text-4xl">
            {PORTAL_TITLE}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">{PORTAL_SUBTITLE}</p>

          <div className="relative mt-6 max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search companies, HQ, industry…"
              className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-10 text-sm text-foreground outline-none transition focus:border-dream focus:ring-2 focus:ring-dream/20"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* Filter pills */}
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const active = filter === f;
            const style = f === "All" ? null : CATEGORY_STYLES[f];
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:bg-secondary",
                  !active && style?.textClass,
                )}
              >
                {f}
                <span
                  className={cn(
                    "ml-1.5 rounded-full px-1.5 py-0.5 text-[10px]",
                    active ? "bg-primary-foreground/20" : "bg-secondary",
                  )}
                >
                  {counts[f]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {!hydrated ? (
            Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
          ) : filtered.length > 0 ? (
            filtered.map((c: CompanySummary) => (
              <CompanyCard key={c.companyId} company={c} onSelect={handleSelect} />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
              <p className="font-heading text-lg font-semibold text-foreground">
                No companies match your search
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try a different term or clear your filters.
              </p>
              <button
                type="button"
                onClick={resetAll}
                className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
