# Agent Workflow — FuelEU Maritime Compliance Platform

This document records the AI-assisted development process used to build the
FuelEU Maritime Compliance Platform, including prompts given, outputs
generated, corrections applied, and observations on agent performance.

---

## Agents Used

| Agent                                  | Role                                                                                                          |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **GitHub Copilot (Claude Sonnet 4.6)** | Primary coding agent — generated all backend and frontend code, tests, configuration, and architecture design |

---

## Phase 1 — Requirement Analysis & Architecture Design

### Prompt

> "Can you explain this assignment to me like a beginner?"
> (followed by) "I want to implement both bonus features (dark mode + animated KPIs, and in-memory cache)."

### Output

The agent produced:

- A plain-English explanation of the FuelEU Maritime regulation (GHG intensity targets, Compliance Balance formula, Banking article 20, Pooling article 21)
- A concise hexagonal architecture overview — core domain → ports (interfaces) → adapters (infra)
- A 40-step numbered implementation plan saved to session memory

### Agent Decision

The agent asked clarifying preference questions before writing any code:

- Database: PostgreSQL (local)
- ORM: Prisma
- Charts: Recharts
- Extras: both dark mode/animated KPIs and in-memory cache

**Correction/Observation**: No correction needed. The agent correctly paused to gather requirements before proceeding, preventing wasted implementation effort.

---

## Phase 2 — Backend Domain & Ports

### Prompt

> "continue"

### Output

Files generated in parallel where possible:

- `backend/src/core/domain/constants.ts` — `TARGET_GHG_INTENSITY = 89.3368`, `computeComplianceBalance()` formula
- `backend/src/core/domain/entities/` — `Route.ts`, `ComplianceBalance.ts`, `BankEntry.ts`, `Pool.ts`
- `backend/src/core/ports/outbound/` — 5 interface files: `IRouteRepository`, `IComplianceRepository`, `IBankRepository`, `IPoolRepository`, `ICacheService`

### Observation

The agent correctly kept the `core/` folder free of any framework imports (no Express, no Prisma, no React). All types are plain TypeScript interfaces, ensuring the domain is fully testable in isolation.

---

## Phase 3 — Use-Cases

### Prompt

> "continue"

### Output

8 use-case files generated:

- `GetRoutesUseCase` — cache-first, 60s TTL
- `SetBaselineUseCase` — validates route, invalidates cache pattern
- `GetComparisonUseCase` — `percentDiff = ((route.ghg / baseline.ghg) - 1) * 100`
- `ComputeCBUseCase` — `(89.3368 − ghg) × fuel × 41000`, upserts, 120s TTL
- `GetAdjustedCBUseCase` — raw CB + banked total
- `BankSurplusUseCase` — validates amount ≤ surplus CB, creates positive entry
- `ApplyBankedUseCase` — validates amount ≤ total banked, creates negative entry
- `CreatePoolUseCase` — greedy allocation (sort desc by CB, surplus transfers to deficit)

### Agent Decision

The agent independently chose to implement cache invalidation via `invalidatePattern('routes:*')` rather than deleting a hardcoded key, making the pattern more robust to future changes.

### Observation

The pool validation logic (surplus ship cannot exit the pool with negative CB; deficit ship cannot exit worse than before) was correctly implemented without being explicitly specified in the prompt — the agent inferred it from the FuelEU regulation text.

---

## Phase 4 — Prisma Schema, Seed & Repositories

### Prompt

> "continue"

### Output

- `prisma/schema.prisma` — 5 models with correct Prisma v7 format (`prisma-client` generator, `src/generated/prisma` output path)
- `prisma.config.ts` — Prisma v7 datasource config file
- `prisma/seed.ts` — 5 seed routes (R001–R005) with realistic GHG intensities spanning compliant to highly non-compliant
- 4 repository adapter files implementing the outbound port interfaces

### Correction Applied

**Prisma v7 uses a different generator provider syntax** (`"prisma-client"` not `"prisma-client-js"`) and requires a separate `prisma.config.ts` file. The agent self-corrected after recognising the v7 generator output format in the project's installed package version.

### Observation

The `PrismaRouteRepository.setBaseline()` method was implemented using `$transaction` to atomically clear the old baseline and set the new one — preventing a race condition that a naive two-step implementation would have.

---

## Phase 5 — Adapters, Controllers, DI & Server

### Prompt

> "continue"

### Output

- `InMemoryCacheService` — `Map<string, {value, expiresAt}>` with TTL-check on `get()`, pattern-matching on `invalidatePattern()`
- 4 HTTP controllers with Zod request validation (body/query params)
- 4 Express router files
- `container.ts` — manual constructor injection, singleton instances
- `app.ts` — Express factory with CORS (`process.env.FRONTEND_URL ?? 'http://localhost:5173'`), JSON middleware, route mounting
- `server.ts` — entry point, `prisma.$connect()` startup check

### Agent Decision

The agent chose manual constructor injection over a library like `InversifyJS` or `tsyringe`, citing the assignment's focus on demonstrating the hexagonal pattern clearly rather than adding a secondary DI framework.

---

## Phase 6 — Backend Tests

### Prompt

> "continue"

### Output

4 test files, 21 total test cases:

- `constants.test.ts` — 5 tests for `computeComplianceBalance()` edge cases
- `ComputeCBUseCase.test.ts` — 4 tests with mock repository and mock cache
- `BankingUseCases.test.ts` — 8 tests covering happy path + error validation for both bank and apply
- `CreatePoolUseCase.test.ts` — 4 tests: invalid pool (negative sum), valid pool (surplus→deficit transfer), edge cases

**Result**: 21/21 tests pass on first run.

### Observation

The agent consistently used mock objects implementing the port interfaces rather than patching module internals, keeping tests aligned with hexagonal architecture principles.

---

## Phase 7 — Frontend: Core Domain, Ports, Use-Cases

### Prompt

> "continue"

### Output

- `core/domain/entities.ts` — all entity interfaces
- 4 port interfaces in `core/ports/`
- 5 use-case files in `core/application/usecases/`

### Observation

The frontend use-cases are thin orchestrators (call adapter via port → return result), mirroring the backend pattern. This keeps the hooks and components free of fetch/transformation logic.

---

## Phase 8 — Frontend: API Adapters, Hooks, & UI Components

### Prompt

> "continue" (multiple times)

### Output Per Batch

**Adapters:**

- `apiClient.ts` — base fetch wrapper, throws on non-2xx with parsed JSON error message
- 4 API adapter classes implementing each service port
- `container.ts` — factory functions with singleton adapter instances

**React Hooks (inbound adapters):**

- `useRoutes` — fetch + setBaseline, re-fetches on mutation
- `useComparison` — lazy fetch triggered by route selection
- `useBanking` — compute, bank surplus, apply banked, fetch records
- `usePooling` — select ships, compute pool CB, create pool
- `useDarkMode` — toggles `dark` class on `<html>`, persists to `localStorage`

**Components:**

- `KPICard.tsx` — framer-motion `useSpring` counter animation
- `LoadingSpinner.tsx` / `ErrorBanner.tsx` — minimal shared utilities
- `RoutesTab.tsx`, `CompareTab.tsx`, `BankingTab.tsx`, `PoolingTab.tsx`
- `AppLayout.tsx` — nav + dark mode toggle + tab bar

### Correction Applied (Tailwind v4)

Initial `index.css` had leftover Vite default styles mixed with the Tailwind import. The agent corrected it to exactly:

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));
```

No `tailwind.config.js` is used — Tailwind v4 is fully CSS-driven.

### Observation

The agent correctly noted that Tailwind v4's `@custom-variant` replaces the `darkMode: 'class'` config option from v3, and selected the `&:where(.dark, .dark *)` combinator to ensure that toggling the `dark` class on `<html>` propagates to nested elements without specificity wars.

---

## Phase 9 — Frontend Tests

### Prompt

> "continue"

### Output

3 test files, 8 total test cases:

- `RouteUseCases.test.ts` — 2 tests: fetch routes, set baseline
- `BankingUseCases.test.ts` — 4 tests: bank surplus validation, apply banked validation
- `PoolUseCases.test.ts` — 2 tests: valid pool, invalid pool rejection

**Result**: 8/8 tests pass on first run.

---

## Summary Statistics

| Metric                       | Value                                                                                               |
| ---------------------------- | --------------------------------------------------------------------------------------------------- |
| Files generated by agent     | ~65                                                                                                 |
| Lines of code                | ~3,500+                                                                                             |
| Total tests                  | 29 (21 backend + 8 frontend)                                                                        |
| Tests passing                | 29/29 (100%)                                                                                        |
| Manual corrections needed    | ~3 (Prisma v7 format, Tailwind v4 CSS, index.css cleanup)                                           |
| Agent-initiated improvements | Cache invalidation pattern, pool validation rules, atomic DB transaction, Zod validation boundaries |

---

## Observations

1. **Time saved**: Scaffolding 65+ files with strict hexagonal structure would take 2–4 days manually; the agent completed it in a single session, keeping architectural discipline throughout.

2. **Architectural reasoning**: The agent independently enforced "no framework imports in core" without being reminded after the first explanation. It consistently passed ports as constructor arguments rather than reaching for globals or singletons.

3. **Edge case handling**: Pool transfer rules (deficit can't exit worse, surplus can't exit negative) were inferred from the regulation text, not explicitly prompted.

4. **Failure modes**: The only failures were version-specific API differences (Prisma v7 generator syntax, Tailwind v4 CSS config). Both were self-corrected once the agent identified the installed version.

5. **Best practice followed**: The agent validated inputs only at system boundaries (Zod in HTTP controllers, type checks in use-cases for business rule enforcement), avoiding defensive over-engineering deeper in the stack.
