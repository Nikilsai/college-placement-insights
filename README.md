# Sri Venkateshwara College Of Engineering — Companies Research & Placement Analytics Portal

Also known as the **SVCE Placement Intelligence Hub**. A mobile-first, enterprise
SaaS–style portal that gives students a strategic edge for campus placements:
deep company intelligence and a Bloom's-taxonomy skill roadmap per recruiter.

## Phase 1 — UI only (this build)

- **No database, no backend.** Lovable Cloud / Supabase is intentionally **not**
  enabled. There are no tables, migrations, RLS policies, or edge functions, and
  no Supabase client in the codebase.
- **All data is hardcoded** in a single seed file: `src/data/seedCompanies.ts`
  (one real reference company — Accenture). The entire portal renders from this
  seed alone. Skill roadmaps live in `src/data/skillTopics.ts`.
- **Fully public, no login.** There is no `/login` route, no auth context, no
  protected routes. Every page is reachable directly by any visitor.
- **No college logo asset.** The hero is text-only: the college wordmark plus an
  `SVCE · INTELLIGENCE PLATFORM` pill. Only recruiting-company logos are shown
  (via Logo.dev / seed URL / initial-letter fallback).
- **Never shows CTC, Stipend, or Selection Ratio** anywhere.

### College configured

- `COLLEGE_NAME` = **Sri Venkateshwara College Of Engineering**
- `COLLEGE_SHORT` = **SVCE**

Both are centralized in `src/lib/college.ts`.

## Routes

| Path                    | Page                 | Notes                                   |
| ----------------------- | -------------------- | --------------------------------------- |
| `/`                     | Company grid         | Search + category filters               |
| `/company`              | →                    | Redirects to `/company/intelligence`    |
| `/company/intelligence` | Company Intelligence | 22 sections, scroll-spy tab bar         |
| `/company/skills`       | Skill Intelligence   | 12 skills, expandable 10-level roadmaps |
| `*`                     | NotFound             | Invalid URLs only                       |

Selection persists to `localStorage` (`selected-company`) and is restored on
refresh from the seed, so `/company/*` pages survive a hard reload. A missing
selection redirects to `/` (never NotFound).

## Data layer & Phase 2

`src/lib/companyData.ts` holds pure normalizers
(`normalizeCompanySummary`, `normalizeCompanyProfile`, `normalizeDashboardSkills`)
that accept the raw `short_json` / `full_json` / `skill_levels` JSON shapes.
In Phase 1 those shapes come from the seed; in **Phase 2** the same normalizers
will receive Supabase rows (identical JSONB shapes) untouched — swapping the data
source is a one-file change.

## Phase 2 — Supabase Integration

This portal is now integrated with Supabase for read-only access to company and
skill data. The app remains fully public (no auth) and uses React Query for
efficient data fetching with caching.

### Setup

1. **Fill environment variables:**
   - Copy `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from your Supabase
     project settings into the `.env` file at the project root:
     ```bash
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key
     ```
   - The `.env.example` file shows the required variables; `.env` is git-ignored.

2. **Install & run:**
   ```bash
   npm install
   npm run dev
   ```

### Data sources

- **Companies** → `public.company_json` table (short_json for cards, full_json for detail)
- **Skills** → Normalized from 4 joined tables:
  - `company_skill_levels` (company_id, skill_set_id, required_level, required_proficiency_level_id)
  - `skill_set_master` (skill_set_id, skill_set_name)
  - `proficiency_levels` (proficiency_level_id, proficiency_name)
  - `skill_set_topics` (skill_set_id, level_number, topics)

### React Query config

- **staleTime:** 5 minutes
- **gcTime:** 10 minutes
- **retry:** 1 attempt on failure

**Note:** The seed files (`src/data/seedCompanies.ts` and `src/data/skillTopics.ts`)
are still in the repo as fallback documentation but are no longer imported by the live UI.

## Environment variables

- `VITE_LOGO_DEV_PUBLISHABLE_KEY` (optional) — enables Logo.dev logos. When
  absent, `CompanyLogo` falls back to the seed `logo_url`, then an initial-letter
  circle. **No** `VITE_SUPABASE_*` in Phase 1.

## Scripts

- `bun run dev` — start the dev server
- `bun run build` — production build
- `bun run test` — Vitest smoke test (`src/lib/companyData.test.ts`)

## Stack note

This project runs on **TanStack Start** (file-based routing) with **Tailwind v4**.
The routing spec (React Router 6 nesting) is implemented 1:1 with TanStack's
file-based routes; all required paths, the `/company → /company/intelligence`
redirect, and refresh-safe behavior are preserved.
