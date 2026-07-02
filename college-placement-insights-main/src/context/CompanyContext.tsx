import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useCompanies, useCompanyProfile, useCompanySkills } from "@/lib/companyApi";
import {
  normalizeCompanyProfile,
  normalizeCompanySummary,
  normalizeDashboardSkills,
  type CompanyProfile,
  type CompanySummary,
  type DashboardSkill,
} from "@/lib/companyData";

const STORAGE_KEY = "selected-company";

export interface SelectedCompany {
  companyId: number;
  companyName: string;
  logoUrl: string;
}

interface CompanyContextValue {
  /** true until localStorage has been read on the client */
  hydrated: boolean;
  selected: SelectedCompany | null;
  profile: CompanyProfile | null;
  skills: DashboardSkill[];
  summaries: CompanySummary[];
  selectCompany: (companyId: number) => void;
  clearCompany: () => void;
  /** true if any query is still loading */
  isLoading: boolean;
  /** error from any of the queries */
  error: Error | null;
}

const CompanyContext = createContext<CompanyContextValue | undefined>(undefined);

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [selected, setSelected] = useState<SelectedCompany | null>(null);

  // Fetch all companies from Supabase
  const {
    data: summaries = [],
    isLoading: companiesLoading,
    error: companiesError,
  } = useCompanies();

  // Fetch profile for the selected company
  const {
    data: profile = null,
    isLoading: profileLoading,
    error: profileError,
  } = useCompanyProfile(selected?.companyId ?? null);

  // Fetch skills for the selected company
  const {
    data: skills = [],
    isLoading: skillsLoading,
    error: skillsError,
  } = useCompanySkills(selected?.companyId ?? null);

  // Restore selection from localStorage on startup
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SelectedCompany;
        // Validate that the company exists in summaries once loaded
        if (
          parsed &&
          summaries.length > 0 &&
          summaries.some((s) => s.companyId === parsed.companyId)
        ) {
          setSelected(parsed);
        } else if (!companiesLoading && summaries.length === 0) {
          // Companies loaded but the selected one doesn't exist
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, [summaries, companiesLoading]);

  const selectCompany = useCallback(
    (companyId: number) => {
      const summary = summaries.find((s) => s.companyId === companyId);
      if (!summary) return;
      const next: SelectedCompany = {
        companyId,
        companyName: summary.name,
        logoUrl: summary.logoUrl,
      };
      setSelected(next);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
    },
    [summaries],
  );

  const clearCompany = useCallback(() => {
    setSelected(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const value: CompanyContextValue = {
    hydrated,
    selected,
    profile,
    skills,
    summaries,
    selectCompany,
    clearCompany,
    // Expose loading and error states for pages to use
    isLoading: companiesLoading || profileLoading || skillsLoading || !hydrated,
    error: companiesError || profileError || skillsError,
  };

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

export function useCompany() {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompany must be used within a CompanyProvider");
  return ctx;
}
