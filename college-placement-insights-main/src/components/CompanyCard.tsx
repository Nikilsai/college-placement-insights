import { memo } from "react";
import { ArrowRight, MapPin, TrendingDown, TrendingUp, Users } from "lucide-react";

import { CompanyLogo } from "@/components/CompanyLogo";
import { CATEGORY_STYLES, normalizeCategory } from "@/lib/companyStyles";
import { isNullishText } from "@/lib/companyData";
import type { CompanySummary } from "@/lib/companyData";
import { cn } from "@/lib/utils";

interface CompanyCardProps {
  company: CompanySummary;
  onSelect: (companyId: number) => void;
}

function NA() {
  return <span className="italic text-muted-foreground">not publicly available</span>;
}

function value(text: string) {
  if (!text || isNullishText(text)) return <NA />;
  return <span>{text}</span>;
}

function CompanyCardImpl({ company, onSelect }: CompanyCardProps) {
  const category = normalizeCategory(company.companyType);
  const style = CATEGORY_STYLES[category];
  const growth = company.yoyGrowthRate;
  const isNegative = growth.trim().startsWith("-");
  const hasGrowth = growth && !isNullishText(growth);

  return (
    <button
      type="button"
      onClick={() => onSelect(company.companyId)}
      className="group relative flex h-full flex-col rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-dream/40 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-3">
        <CompanyLogo
          name={company.name}
          logoUrl={company.logoUrl}
          websiteUrl={company.websiteUrl}
          className="h-12 w-12 shrink-0"
          textClassName="text-xl"
        />
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 text-xs font-medium",
            style.textClass,
            style.bgClass,
            style.borderClass,
          )}
        >
          {style.label}
        </span>
      </div>

      <div className="mt-3">
        <h3 className="font-heading text-base font-semibold leading-tight text-foreground">
          {company.name}
        </h3>
        <p className="text-sm text-muted-foreground">{company.shortName}</p>
      </div>

      <dl className="mt-4 space-y-1.5 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0" />
          {value(company.headquarters)}
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 shrink-0" />
          {value(company.employeeSize)}
        </div>
        <div className="flex items-center gap-2">
          {isNegative ? (
            <TrendingDown className="h-4 w-4 shrink-0 text-destructive" />
          ) : (
            <TrendingUp className="h-4 w-4 shrink-0 text-standard" />
          )}
          {hasGrowth ? (
            <span className={cn(isNegative && "text-destructive")}>{growth} YoY</span>
          ) : (
            <NA />
          )}
        </div>
      </dl>

      <div className="mt-auto flex justify-end pt-4">
        <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-dream" />
      </div>
    </button>
  );
}

export const CompanyCard = memo(CompanyCardImpl);
