import { useQuery } from "@tanstack/react-query";
import { supabase } from "./supabaseClient";
import {
  normalizeCompanySummary,
  normalizeCompanyProfile,
  normalizeDashboardSkills,
  type CompanySummary,
  type CompanyProfile,
  type DashboardSkill,
  asString,
  asRecord,
  scoreToDifficulty,
} from "./companyData";

const QUERY_CONFIG = {
  staleTime: 1000 * 60 * 5, // 5 minutes
  gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
  retry: 1,
};

/**
 * Fetch all companies from company_json table.
 * Returns normalized CompanySummary objects.
 */
export function useCompanies() {
  return useQuery<CompanySummary[], Error>({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data, error } = await supabase.from("company_json").select("company_id, short_json");

      if (error) throw error;

      // Normalize each row
      return (data || []).map((row) => normalizeCompanySummary(row.short_json, row.company_id));
    },
    ...QUERY_CONFIG,
  });
}

/**
 * Fetch a single company profile from company_json table.
 * Returns normalized CompanyProfile with full_json fields.
 */
export function useCompanyProfile(companyId: number | null) {
  return useQuery<CompanyProfile | null, Error>({
    queryKey: ["company-profile", companyId],
    queryFn: async () => {
      if (!companyId) return null;

      const { data, error } = await supabase
        .from("company_json")
        .select("company_id, short_json, full_json")
        .eq("company_id", companyId)
        .single();

      if (error) throw error;

      if (!data) return null;

      // Normalize with both short_json and full_json
      return normalizeCompanyProfile(data.full_json, data.short_json, data.company_id);
    },
    enabled: !!companyId,
    ...QUERY_CONFIG,
  });
}

/**
 * Fetch skills for a company from the 4 skill tables.
 * Joins company_skill_levels, skill_set_master, proficiency_levels, and skill_set_topics.
 * Returns normalized DashboardSkill objects.
 */
export function useCompanySkills(companyId: number | null) {
  return useQuery<DashboardSkill[], Error>({
    queryKey: ["company-skills", companyId],
    queryFn: async () => {
      if (!companyId) return [];

      // Fetch company_skill_levels with company_id
      const { data: skillLevels, error: skillError } = await supabase
        .from("company_skill_levels")
        .select(
          `
          company_id,
          skill_set_id,
          required_level,
          required_proficiency_level_id,
          skill_set_master (
            skill_set_id,
            skill_set_name,
            short_name
          ),
          proficiency_levels (
            proficiency_level_id,
            proficiency_name,
            proficiency_code
          )
        `,
        )
        .eq("company_id", companyId);

      if (skillError) throw skillError;

      if (!skillLevels || skillLevels.length === 0) {
        return [];
      }

      // Normalize each skill level row into DashboardSkill format
      return skillLevels.map((row) => {
        const skillSetMaster = asRecord(row.skill_set_master);
        const proficiencyLevel = asRecord(row.proficiency_levels);

        const name = asString(skillSetMaster.skill_set_name || skillSetMaster.short_name);
        const requiredLevel = Number(asString(row.required_level)) || 0;
        const proficiency = asString(proficiencyLevel.proficiency_name);

        return {
          skillSetId: row.skill_set_id,
          name,
          requiredLevel,
          proficiency,
          score: requiredLevel, // Map required_level to score (0-10)
          difficulty: scoreToDifficulty(requiredLevel),
        };
      });
    },
    enabled: !!companyId,
    ...QUERY_CONFIG,
  });
}
