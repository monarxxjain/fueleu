# Reflection — AI-Assisted Development of FuelEU Maritime Compliance Platform

## What I Built

A full-stack FuelEU Maritime compliance dashboard — React frontend with four tabs (Routes, Compare, Banking, Pooling), backed by a Node.js/Express API, PostgreSQL via Prisma, and strict hexagonal architecture throughout. Both tiers include unit tests (29 passing), TypeScript strict mode, and two bonus features: in-memory caching and animated dark-mode KPI cards.

---

## What I Learned Using AI Agents

The biggest insight is that **an AI agent is strongest as an architectural multiplier, not just a code generator**. When I gave the agent a clear architectural constraint ("strict hexagonal — core must have zero framework imports"), it enforced that constraint consistently across ~65 files without being reminded. Every use-case accepted interfaces in its constructor, every adapter implemented an explicit port, and the folder structure reflected the architecture rather than being an afterthought.

I also learned to treat the agent like a senior pair-programmer who benefits from explicit context. The few corrections needed — Prisma v7's changed generator syntax, Tailwind v4's CSS-driven config replacing `tailwind.config.js` — happened at the boundary between general knowledge and version-specific APIs. Providing the project's installed package versions upfront would have eliminated these.

---

## Efficiency Gains vs. Manual Coding

Scaffolding this project manually — setting up two TypeScript projects with separate test configs, wiring 8 use-cases to 4 repository interfaces, implementing 4 React hooks that each interact with a separate API adapter, configuring Vitest in both jsdom and node environments — would realistically take two to three days. The agent completed it in one session.

More importantly, the agent maintained **consistency at scale**: naming conventions, constructor injection style, error handling patterns, and test structure are uniform across every file. In a large manual project that consistency erodes over time; the agent never gets fatigued or inconsistent.

The 29/29 test pass rate on first run reflects another efficiency gain: the agent wrote tests that match the interfaces it implemented, so test failures from interface drift (a common manual mistake) did not occur.

---

## What I Would Do Differently Next Time

**Provide version constraints in the initial prompt.** "Use Prisma v7" and "Use Tailwind v4" would have prevented the two self-corrections needed. The agent's general knowledge defaults to stable/common versions, so explicit version pinning at the start pays for itself immediately.

**Use the agent for integration tests too.** The current test suite covers units in isolation. The agent could also have generated supertest-based API integration tests and Playwright smoke tests — I would add those in a follow-up pass.

**Iterate on the UI earlier.** The backend was fully built before any UI work started. Running a quick frontend prototype first would let me validate the API shape against real component needs before finalising the backend routes.

---

## Conclusion

AI-assisted development with GitHub Copilot at this complexity level is most effective when you combine a clear architectural specification with explicit technology constraints. The agent handles the mechanical work of consistent implementation, freeing the developer to focus on domain logic (the FuelEU formula, pool transfer rules, cache invalidation strategy) and code review. The role of the developer shifts from author to reviewer and architect — which is a more valuable use of time.
