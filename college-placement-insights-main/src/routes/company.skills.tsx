import { createFileRoute } from "@tanstack/react-router";
import { memo, useMemo, useState } from "react";
import { ChevronDown, Lock } from "lucide-react";

import { CompanyLogo } from "@/components/CompanyLogo";
import { useCompany } from "@/context/CompanyContext";
import { SKILL_TOPICS } from "@/data/skillTopics";
import {
  BLOOM_ORDER,
  BLOOM_STYLES,
  CRITICALITY_STYLES,
  proficiencyToBloom,
  scoreToCriticality,
  type Criticality,
} from "@/lib/companyStyles";
import type { DashboardSkill } from "@/lib/companyData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/company/skills")({
  component: SkillIntelligence,
});

const CRITICALITY_ORDER: Criticality[] = ["Critical", "Important", "Baseline"];

interface SkillCardProps {
  skill: DashboardSkill;
}

const SkillCard = memo(function SkillCard({ skill }: SkillCardProps) {
  const [open, setOpen] = useState(false);
  const bloom = BLOOM_STYLES[proficiencyToBloom(skill.requiredLevel)];
  const criticality = CRITICALITY_STYLES[scoreToCriticality(skill.score)];
  const topics = SKILL_TOPICS[skill.skillSetId] ?? [];
  const pct = Math.min(100, Math.max(0, (skill.score / 10) * 100));

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start justify-between gap-3 text-left"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-heading text-sm font-semibold text-foreground">{skill.name}</h3>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                bloom.bgClass,
                bloom.textClass,
              )}
            >
              {bloom.code} · {bloom.label}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            <span className={criticality.textClass}>{criticality.label}</span> · {skill.proficiency}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="font-heading text-sm font-bold text-foreground">
            {skill.score}
            <span className="text-xs font-normal text-muted-foreground">/10</span>
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
          />
        </div>
      </button>

      {/* Progress bar */}
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div className={cn("h-full rounded-full", bloom.barClass)} style={{ width: `${pct}%` }} />
      </div>

      {/* Roadmap */}
      {open && (
        <ol className="mt-4 space-y-1.5">
          {topics.map((t) => {
            const locked = t.level_number > skill.requiredLevel;
            return (
              <li
                key={t.level_number}
                className={cn(
                  "flex items-center gap-3 rounded-lg border px-3 py-2 text-xs",
                  locked
                    ? "border-dashed border-border bg-secondary/40 text-muted-foreground"
                    : "border-border bg-background text-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
                    locked
                      ? "bg-secondary text-muted-foreground"
                      : cn(bloom.bgClass, bloom.textClass),
                  )}
                >
                  {t.level_number}
                </span>
                <span className="min-w-0 flex-1">{t.topic}</span>
                {locked && (
                  <span className="flex shrink-0 items-center gap-1 text-[10px] uppercase tracking-wide">
                    <Lock className="h-3 w-3" /> Beyond scope
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
});

function SkillIntelligence() {
  const { profile, skills, isLoading, error } = useCompany();
  const sorted = useMemo(() => [...skills].sort((a, b) => b.score - a.score), [skills]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 animate-spin rounded-full border-2 border-muted border-t-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Loading skill intelligence...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">Failed to load skill data</p>
          <p className="mt-2 text-xs text-muted-foreground">{error.message}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg border border-border bg-background px-4 py-2 text-xs font-medium hover:bg-secondary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <CompanyLogo
          name={profile.name}
          logoUrl={profile.logoUrl}
          websiteUrl={profile.websiteUrl}
          className="h-10 w-10"
        />
        <h1 className="font-heading text-lg font-semibold text-foreground sm:text-xl">
          {profile.name} Skill Intelligence
        </h1>
      </div>

      {/* Bloom legend */}
      <div className="mt-5 rounded-xl border border-border bg-card p-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Bloom's Levels
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {BLOOM_ORDER.map((code) => {
            const b = BLOOM_STYLES[code];
            return (
              <div key={code} className={cn("rounded-lg px-2.5 py-2", b.bgClass)}>
                <p className={cn("text-xs font-semibold", b.textClass)}>{b.code}</p>
                <p className="text-[11px] text-muted-foreground">{b.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Criticality legend */}
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {CRITICALITY_ORDER.map((key) => {
          const c = CRITICALITY_STYLES[key];
          return (
            <div key={key} className="rounded-xl border border-border bg-card p-3">
              <span
                className={cn(
                  "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold",
                  c.bgClass,
                  c.textClass,
                )}
              >
                {c.label}
              </span>
              <p className="mt-1.5 text-xs text-muted-foreground">{c.description}</p>
            </div>
          );
        })}
      </div>

      {/* Skill cards */}
      <div className="mt-5 space-y-3">
        {sorted.map((skill) => (
          <SkillCard key={skill.skillSetId} skill={skill} />
        ))}
      </div>
    </div>
  );
}
