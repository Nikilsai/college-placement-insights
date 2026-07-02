import { createFileRoute } from "@tanstack/react-router";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Linkedin, PlayCircle, Star, type LucideIcon } from "lucide-react";

import { CompanyLogo } from "@/components/CompanyLogo";
import { useCompany } from "@/context/CompanyContext";
import {
  buildIntelligenceSections,
  type IntelligenceField,
  type IntelligenceSection,
} from "@/data/intelligenceData";
import { isNullishText, splitItems } from "@/lib/companyData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/company/intelligence")({
  component: CompanyIntelligence,
});

function NotAvailable() {
  return (
    <span className="inline-flex rounded-full bg-secondary px-2 py-0.5 text-xs italic text-muted-foreground">
      Not Available
    </span>
  );
}

function Pills({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, i) => (
        <span
          key={i}
          className="rounded-md border border-border bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function renderValue(field: IntelligenceField) {
  const raw = (field.value ?? "").trim();
  if (!raw || isNullishText(raw)) return <NotAvailable />;

  switch (field.type) {
    case "url":
      return (
        <a
          href={raw.startsWith("http") ? raw : `https://${raw}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-dream hover:underline"
        >
          {raw.replace(/^https?:\/\//, "")}
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      );
    case "video":
      return (
        <a
          href={raw}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-dream hover:underline"
        >
          <PlayCircle className="h-4 w-4" /> Watch video
        </a>
      );
    case "rating":
      return (
        <span className="inline-flex items-center gap-1 font-medium text-foreground">
          <Star className="h-4 w-4 fill-regular text-regular" />
          {raw}
        </span>
      );
    case "list":
      return <Pills items={splitItems(raw)} />;
    case "paragraph":
      return <p className="leading-relaxed text-foreground">{raw}</p>;
    default: {
      // auto: pill-split on semicolons (safe) — leaves "740,000 employees"
      // and "Dublin, Ireland" as single values.
      if (/;/.test(raw)) {
        const parts = raw
          .split(";")
          .map((s) => s.trim())
          .filter(Boolean);
        if (parts.length > 1) return <Pills items={parts} />;
      }
      return <span className="text-foreground">{raw}</span>;
    }
  }
}

function FieldRow({ field }: { field: IntelligenceField }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border/60 py-2.5 last:border-0 sm:flex-row sm:gap-4">
      <dt className="text-sm font-medium text-muted-foreground sm:w-1/3">{field.label}</dt>
      <dd className="text-sm sm:w-2/3">{renderValue(field)}</dd>
    </div>
  );
}

interface SectionCardProps {
  section: IntelligenceSection;
  index: number;
  registerRef: (index: number, el: HTMLElement | null) => void;
}

const SectionCard = memo(function SectionCard({ section, index, registerRef }: SectionCardProps) {
  const Icon = section.icon as LucideIcon;
  const populated = section.fields.filter((f) => f.value && !isNullishText(f.value)).length;

  return (
    <section
      ref={(el) => registerRef(index, el)}
      data-index={index}
      id={section.id}
      className="scroll-mt-32 rounded-xl border border-border bg-card p-4 sm:p-5"
    >
      <div className="mb-3 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="flex-1 font-heading text-base font-semibold text-foreground">
          {section.title}
        </h2>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {populated}/{section.fields.length}
        </span>
      </div>
      <dl>
        {section.fields.map((field) => (
          <FieldRow key={field.key} field={field} />
        ))}
      </dl>
    </section>
  );
});

function CompanyIntelligence() {
  const { profile, isLoading, error } = useCompany();
  const sections = useMemo(() => (profile ? buildIntelligenceSections(profile) : []), [profile]);

  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const isScrollingRef = useRef(false);
  const [active, setActive] = useState(0);

  const registerRef = (index: number, el: HTMLElement | null) => {
    sectionRefs.current[index] = el;
  };

  // Scroll-spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const idx = Number((visible[0].target as HTMLElement).dataset.index ?? 0);
          setActive(idx);
        }
      },
      { rootMargin: "-140px 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );
    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [sections.length]);

  // Auto-center active tab
  useEffect(() => {
    const tab = tabRefs.current[active];
    tab?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [active]);

  function scrollToSection(idx: number) {
    const el = sectionRefs.current[idx];
    if (!el) return;
    isScrollingRef.current = true;
    setActive(idx);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      isScrollingRef.current = false;
    }, 700);
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 animate-spin rounded-full border-2 border-muted border-t-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Loading company details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">Failed to load company details</p>
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
    <div>
      {/* Sticky info bar */}
      <div className="sticky top-14 z-20 border-b border-border bg-card">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <CompanyLogo
              name={profile.name}
              logoUrl={profile.logoUrl}
              websiteUrl={profile.websiteUrl}
              className="h-10 w-10 shrink-0"
            />
            <div className="min-w-0">
              <h1 className="truncate font-heading text-base font-semibold text-foreground sm:text-lg">
                {profile.name}
              </h1>
              {profile.category && (
                <span className="inline-block rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                  {profile.category}
                </span>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {profile.websiteUrl && (
              <a
                href={profile.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Website</span>
              </a>
            )}
            {profile.fields.linkedin_url && (
              <a
                href={profile.fields.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary"
              >
                <Linkedin className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">LinkedIn</span>
              </a>
            )}
          </div>
        </div>

        {/* Tab bar */}
        <div className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-2">
          {sections.map((s, i) => (
            <button
              key={s.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              onClick={() => scrollToSection(i)}
              className={cn(
                "whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                active === i
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary",
              )}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-5">
        {sections.map((section, i) => (
          <SectionCard key={section.id} section={section} index={i} registerRef={registerRef} />
        ))}
      </div>
    </div>
  );
}
