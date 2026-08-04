# Feature template

Copy this folder (and rename it) as the starting point for every new feature, e.g.
`src/features/cart/`. It follows the pattern used by the existing `auth`, `products`, and
`users` features.

## Structure

- `api/<name>-api.ts` — feature API. Prefer calling the **orval-generated client**
  (`@/lib/generated/api`) instead of `apiFetch` directly, so types never drift.
- `types/<name>-types.ts` — types. Re-export generated types from `@/lib/generated/api` and only
  hand-write what is not in the spec.
- `schemas/<name>-schema.ts` — zod validation schemas (used by react-hook-form).
- `components/` — feature-specific UI components.
- i18n — add the feature strings to BOTH `src/lib/i18n/locales/en/<feature>.json` and
  `src/lib/i18n/locales/ar/<feature>.json`, then register the namespace in `src/lib/i18n/index.ts`.

## Checklist for a new feature

- [ ] Backend: migration, entity, DTOs, service, controller (+ Swagger response annotations).
- [ ] Run `npm run generate:api` (frontend) after backend changes.
- [ ] Frontend: api module uses the generated client.
- [ ] Types re-exported from `@/lib/generated/api`.
- [ ] i18n keys exist in `en` and `ar`.
- [ ] Verify with `npm run build` in both projects.
