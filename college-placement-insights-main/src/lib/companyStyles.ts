// Presentation helpers for category / bloom / criticality — token-driven.

export type CategoryKey = "Super Dream" | "Dream" | "Standard" | "Regular";

export const CATEGORY_ORDER: CategoryKey[] = ["Super Dream", "Dream", "Standard", "Regular"];

interface CategoryStyle {
  label: CategoryKey;
  /** css color token var, e.g. hsl(var(--dream)) */
  colorVar: string;
  textClass: string;
  bgClass: string;
  borderClass: string;
}

export const CATEGORY_STYLES: Record<CategoryKey, CategoryStyle> = {
  "Super Dream": {
    label: "Super Dream",
    colorVar: "hsl(var(--super-dream))",
    textClass: "text-super-dream",
    bgClass: "bg-super-dream/10",
    borderClass: "border-super-dream/30",
  },
  Dream: {
    label: "Dream",
    colorVar: "hsl(var(--dream))",
    textClass: "text-dream",
    bgClass: "bg-dream/10",
    borderClass: "border-dream/30",
  },
  Standard: {
    label: "Standard",
    colorVar: "hsl(var(--standard))",
    textClass: "text-standard",
    bgClass: "bg-standard/10",
    borderClass: "border-standard/30",
  },
  Regular: {
    label: "Regular",
    colorVar: "hsl(var(--regular))",
    textClass: "text-regular",
    bgClass: "bg-regular/10",
    borderClass: "border-regular/30",
  },
};

export function normalizeCategory(type: string): CategoryKey {
  const t = type.trim().toLowerCase();
  if (t.includes("super")) return "Super Dream";
  if (t.includes("dream")) return "Dream";
  if (t.includes("standard")) return "Standard";
  return "Regular";
}

/* ------------------------------- bloom ------------------------------- */

export type BloomCode = "CU" | "AP" | "AS" | "EV" | "CR";

interface BloomStyle {
  code: BloomCode;
  label: string;
  colorVar: string;
  textClass: string;
  bgClass: string;
  barClass: string;
}

export const BLOOM_STYLES: Record<BloomCode, BloomStyle> = {
  CU: {
    code: "CU",
    label: "Understand",
    colorVar: "hsl(var(--bloom-cu))",
    textClass: "text-bloom-cu",
    bgClass: "bg-bloom-cu/10",
    barClass: "bg-bloom-cu",
  },
  AP: {
    code: "AP",
    label: "Apply",
    colorVar: "hsl(var(--bloom-ap))",
    textClass: "text-bloom-ap",
    bgClass: "bg-bloom-ap/10",
    barClass: "bg-bloom-ap",
  },
  AS: {
    code: "AS",
    label: "Analyze",
    colorVar: "hsl(var(--bloom-as))",
    textClass: "text-bloom-as",
    bgClass: "bg-bloom-as/10",
    barClass: "bg-bloom-as",
  },
  EV: {
    code: "EV",
    label: "Evaluate",
    colorVar: "hsl(var(--bloom-ev))",
    textClass: "text-bloom-ev",
    bgClass: "bg-bloom-ev/10",
    barClass: "bg-bloom-ev",
  },
  CR: {
    code: "CR",
    label: "Create",
    colorVar: "hsl(var(--bloom-cr))",
    textClass: "text-bloom-cr",
    bgClass: "bg-bloom-cr/10",
    barClass: "bg-bloom-cr",
  },
};

export const BLOOM_ORDER: BloomCode[] = ["CU", "AP", "AS", "EV", "CR"];

export function proficiencyToBloom(level: number): BloomCode {
  if (level <= 2) return "CU";
  if (level <= 4) return "AP";
  if (level <= 6) return "AS";
  if (level <= 8) return "EV";
  return "CR";
}

/* ---------------------------- criticality ---------------------------- */

export type Criticality = "Critical" | "Important" | "Baseline";

interface CriticalityStyle {
  label: Criticality;
  description: string;
  textClass: string;
  bgClass: string;
}

export const CRITICALITY_STYLES: Record<Criticality, CriticalityStyle> = {
  Critical: {
    label: "Critical",
    description: "Must-have to clear this company's process",
    textClass: "text-expert",
    bgClass: "bg-expert/10",
  },
  Important: {
    label: "Important",
    description: "Strongly expected, actively evaluated",
    textClass: "text-advanced",
    bgClass: "bg-advanced/10",
  },
  Baseline: {
    label: "Baseline",
    description: "Foundational, good to demonstrate",
    textClass: "text-standard",
    bgClass: "bg-standard/10",
  },
};

export function scoreToCriticality(score: number): Criticality {
  if (score >= 7) return "Critical";
  if (score >= 5) return "Important";
  return "Baseline";
}
