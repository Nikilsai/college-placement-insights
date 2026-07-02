// Pure normalizers. Phase 1 reads from the seed; Phase 2 pipes Supabase rows
// (same short_json / full_json / skill_levels shapes) into the same functions.

export type Json = Record<string, unknown>;

export type Difficulty = "EXPERT" | "ADVANCED" | "PRO" | "BEGINNER";

export interface CompanySummary {
  companyId: number;
  name: string;
  shortName: string;
  logoUrl: string;
  category: string;
  companyType: string;
  incorporationYear: string;
  employeeSize: string;
  headquarters: string;
  operatingCountries: string;
  officeLocations: string;
  yoyGrowthRate: string;
  websiteUrl: string;
}

export interface CompanyProfile extends CompanySummary {
  /** every field from full_json, string-normalized */
  fields: Record<string, string>;
}

export interface DashboardSkill {
  skillSetId: number;
  name: string;
  requiredLevel: number;
  proficiency: string;
  score: number; // 0-10
  difficulty: Difficulty;
}

/* ----------------------------- helpers ----------------------------- */

const NULLISH = new Set(["na", "n/a", "none", "-", "null", "undefined", ""]);

export function asString(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
}

export function asRecord(value: unknown): Json {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Json) : {};
}

export function isNullishText(value: string): boolean {
  return NULLISH.has(value.trim().toLowerCase());
}

/** Split a value on newlines, semicolons, bullets and sentence periods. */
export function splitItems(value: string): string[] {
  if (!value) return [];
  return value
    .split(/\r?\n|;|•|\u2022|(?<=[a-z0-9)])\.\s+(?=[A-Z])/g)
    .map((s) => s.replace(/^[\s•\-*]+/, "").trim())
    .filter((s) => s.length > 0);
}

export function titleCaseFromCode(code: string): string {
  return code
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function scoreToDifficulty(score: number): Difficulty {
  if (score >= 8) return "EXPERT";
  if (score >= 6) return "ADVANCED";
  if (score >= 4) return "PRO";
  return "BEGINNER";
}

/* --------------------------- normalizers --------------------------- */

export function normalizeCompanySummary(shortJson: unknown, companyId?: number): CompanySummary {
  const s = asRecord(shortJson);
  return {
    companyId: companyId ?? (Number(asString(s.company_id)) || 0),
    name: asString(s.name),
    shortName: asString(s.short_name) || asString(s.name),
    logoUrl: asString(s.logo_url),
    category: asString(s.category),
    companyType: asString(s.company_type),
    incorporationYear: asString(s.incorporation_year),
    employeeSize: asString(s.employee_size),
    headquarters: asString(s.headquarters_address),
    operatingCountries: asString(s.operating_countries),
    officeLocations: asString(s.office_locations),
    yoyGrowthRate: asString(s.yoy_growth_rate),
    websiteUrl: asString(s.website_url),
  };
}

export function normalizeCompanyProfile(
  fullJson: unknown,
  shortJson: unknown,
  companyId?: number,
): CompanyProfile {
  const summary = normalizeCompanySummary(shortJson, companyId);
  const full = asRecord(fullJson);
  const fields: Record<string, string> = {};
  for (const [key, raw] of Object.entries(full)) {
    fields[key] = asString(raw);
  }
  return {
    ...summary,
    name: asString(full.name) || summary.name,
    shortName: asString(full.short_name) || summary.shortName,
    fields,
  };
}

export function normalizeDashboardSkills(skillLevels: unknown): DashboardSkill[] {
  if (!Array.isArray(skillLevels)) return [];
  return skillLevels.map((raw) => {
    const s = asRecord(raw);
    const score = Number(asString(s.required_level)) || 0;
    return {
      skillSetId: Number(asString(s.skill_set_id)) || 0,
      name: asString(s.skill_set_name),
      requiredLevel: score,
      proficiency: asString(s.required_proficiency),
      score,
      difficulty: scoreToDifficulty(score),
    };
  });
}
