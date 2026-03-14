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

## Phase 1 — Plan Mode, Terminology, and Scope

### Prompt

> "I want to start in plan mode first. Explain this assignment in beginner language, especially CB, Banking, and Pooling."
> "Before coding, give me a clear phased plan and assumptions."

### Output

- Beginner-friendly explanation of FuelEU terminology (CB formula, targets, banking rules, pooling rules)
- Problem decomposition into implementation phases
- Risks and assumptions identified before writing code

### Observation

This phase was user-led: planning and vocabulary clarity came first, which reduced rework later.

---

## Phase 2 — Architecture Learning and Project Direction

### Prompt

> "Now teach me hexagonal architecture in this context: core, ports, adapters, and how requests flow end-to-end."
> "I want manual control of steps, so propose the sequence and wait for my go-ahead."

### Output

- Clear architecture map for backend and frontend layers
- Concrete sequencing strategy (domain -> ports -> use-cases -> adapters -> tests)
- Technology choices confirmed (PostgreSQL, Prisma, Recharts, bonus features)

### Observation

The work proceeded as guided execution, not autonomous generation without direction.

---

## Phase 3 — Backend Domain and Port Contracts

### Prompt

> "Step 1: create domain entities and constants. Step 2: create outbound ports only. Keep core framework-agnostic."

### Output

- Domain constants and entities for routes, compliance balance, banking, and pooling
- Outbound interfaces for repository and cache boundaries
- Core layer remained free of Express/Prisma imports

### Observation

This established strict separation of concerns early and made later testing straightforward.

---

## Phase 4 — Backend Use-Cases and Business Rules

### Prompt

> "Implement use-cases one by one and explain the business rule each one enforces (CB compute, banking limits, pooling validation)."

### Output

- Use-cases for routes, baseline, comparison, CB compute, adjusted CB, banking, and pooling
- Cache-first behavior for expensive reads
- Validation rules in application layer (bank/apply constraints, pool consistency)

### Observation

Rules were encoded in use-cases, keeping controllers thin and domain behavior testable.

---

## Phase 5 — Persistence, Seed Data, and Repository Adapters

### Prompt

> "Now wire persistence: Prisma schema, repositories per port, and seed realistic sample routes."
> "Keep this compatible with Prisma v7."

### Output

- Prisma schema, config, migrations, and seed data (R001-R005)
- Repository adapters implementing outbound ports
- Transaction-safe baseline update logic

### Correction Applied

Prisma v7 format differences were corrected (`prisma-client` generator and explicit `prisma.config.ts`).

---

## Phase 6 — API Layer, DI Wiring, and Runtime Concerns

### Prompt

> "Build controllers and routers with validation at boundaries, then wire everything in a container."
> "Set up server boot checks and CORS for frontend integration."

### Output

- Express controllers and routers with Zod validation
- Manual dependency injection container
- In-memory cache adapter integrated via cache port
- Server startup with DB connectivity check
- CORS handling updated for deployed frontend origins

### Observation

Dependency direction stayed clean: HTTP and DB concerns remained outside core logic.

---

## Phase 7 — Frontend Implementation (Ports, Hooks, UI)

### Prompt

> "Mirror the same architecture on frontend: ports + use-cases first, then API adapters, hooks, and tabs."
> "I want dark mode and animated KPI bonus included."

### Output

- Frontend domain models, ports, and use-cases
- API adapters + hook orchestration for routes, comparison, banking, pooling
- UI tabs and shared components (including animated KPI cards)
- Dark mode with Tailwind v4-compatible setup

### Correction Applied

Tailwind v4 CSS setup was aligned to `@import "tailwindcss"` and `@custom-variant dark (...)`.

---

## Phase 8 — Testing, Refinement, and Deployment Debugging

### Prompt

> "Run tests and builds after each major milestone, then fix edge cases and deployment issues (Prisma, CORS, Supabase/Vercel envs)."

### Output

- Backend and frontend tests added and passing
- Build verification for both apps
- Pooling/banking UX logic refinements
- Migration, seeding, and environment troubleshooting for deployment

### Observation

This phase reflects iterative, manual steering: identify issue -> patch -> validate -> proceed.

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
