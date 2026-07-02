import { describe, expect, it } from "vitest";

import { SEED_COMPANIES } from "@/data/seedCompanies";
import {
  normalizeCompanyProfile,
  normalizeCompanySummary,
  normalizeDashboardSkills,
  scoreToDifficulty,
  splitItems,
} from "@/lib/companyData";
import { proficiencyToBloom, scoreToCriticality } from "@/lib/companyStyles";

describe("Phase 1 seed + normalizers smoke test", () => {
  const seed = SEED_COMPANIES[0];

  it("has exactly one seeded company (Accenture)", () => {
    expect(SEED_COMPANIES).toHaveLength(1);
    expect(seed.company_id).toBe(1);
  });

  it("normalizes the company summary", () => {
    const summary = normalizeCompanySummary(seed.short_json, seed.company_id);
    expect(summary.name).toBe("Accenture plc");
    expect(summary.shortName).toBe("Accenture");
    expect(summary.companyType).toBe("Dream");
  });

  it("normalizes the full profile fields", () => {
    const profile = normalizeCompanyProfile(seed.full_json, seed.short_json, seed.company_id);
    expect(profile.fields.ceo_name).toBe("Julie Sweet");
    expect(profile.fields.annual_revenue).toContain("64.1B");
  });

  it("normalizes 12 dashboard skills", () => {
    const skills = normalizeDashboardSkills(seed.skill_levels);
    expect(skills).toHaveLength(12);
    expect(skills[0].difficulty).toBe(scoreToDifficulty(skills[0].score));
  });

  it("maps proficiency to bloom and criticality", () => {
    expect(proficiencyToBloom(2)).toBe("CU");
    expect(proficiencyToBloom(8)).toBe("EV");
    expect(scoreToCriticality(8)).toBe("Critical");
    expect(scoreToCriticality(3)).toBe("Baseline");
  });

  it("splits delimited items", () => {
    expect(splitItems("A; B; C")).toEqual(["A", "B", "C"]);
  });
});
