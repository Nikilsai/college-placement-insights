import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

interface CompanyLogoProps {
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
  className?: string;
  /** tailwind text size for the fallback initial */
  textClassName?: string;
}

function domainFromUrl(url?: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/**
 * Logo resolution order:
 *  1. Logo.dev (if VITE_LOGO_DEV_PUBLISHABLE_KEY set and a domain is known)
 *  2. seed/DB logo_url
 *  3. initial-letter circle
 */
export function CompanyLogo({
  name,
  logoUrl,
  websiteUrl,
  className,
  textClassName,
}: CompanyLogoProps) {
  const token = import.meta.env.VITE_LOGO_DEV_PUBLISHABLE_KEY as string | undefined;

  const sources = useMemo(() => {
    const list: string[] = [];
    const domain = domainFromUrl(websiteUrl);
    if (token && domain) {
      list.push(`https://img.logo.dev/${domain}?token=${token}&size=128&format=png`);
    }
    if (logoUrl) list.push(logoUrl);
    return list;
  }, [token, websiteUrl, logoUrl]);

  const [index, setIndex] = useState(0);
  const showFallback = index >= sources.length;
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || "?";

  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden rounded-lg border border-border bg-card",
        className,
      )}
    >
      {showFallback ? (
        <span className={cn("font-heading font-semibold text-primary", textClassName ?? "text-lg")}>
          {initial}
        </span>
      ) : (
        <img
          src={sources[index]}
          alt={`${name} logo`}
          loading="lazy"
          className="h-full w-full object-contain p-1.5"
          onError={() => setIndex((i) => i + 1)}
        />
      )}
    </div>
  );
}
