# Map Kit AI Implementation Workflow

This file explains how to use an AI coding model to implement the map kit safely, phase by phase.

Use this together with:

- `MAP_KIT_PRODUCT_BLUEPRINT.md`

The blueprint explains what to build. This workflow explains how to get an AI model to build it without creating a messy codebase.

## 1. Core Rule

Do not ask the AI model to build the whole product in one prompt.

The product is too large:

- Monorepo
- Core package
- React package
- Next package
- Leaflet adapter
- MapLibre adapter
- Google Maps adapter
- Mapbox adapter
- CLI
- Registry
- Blocks
- Docs
- Tests

If you ask for all of it at once, the result will likely be incomplete, inconsistent, and hard to maintain.

Instead, work in small phases.

Each phase should:

1. Read the blueprint.
2. Inspect the current repo.
3. Make a short plan.
4. Implement only that phase.
5. Add tests or examples.
6. Run checks.
7. Stop and summarize.

## 2. Recommended AI Working Style

Use one prompt per phase.

In every prompt, include this guardrail:

```txt
Before coding, inspect the current files and write a short implementation plan.
Keep changes scoped to this phase.
Do not implement future phases.
Add tests or examples where useful.
Run lint/typecheck/build checks.
Summarize what changed and what remains.
```

Also include:

```txt
Follow MAP_KIT_PRODUCT_BLUEPRINT.md as the source of truth.
If anything in this prompt conflicts with the blueprint, ask or choose the safer scoped implementation.
```

## 3. Suggested Model Workflow

For each phase:

1. Start a fresh AI task.
2. Attach or reference:
   - `MAP_KIT_PRODUCT_BLUEPRINT.md`
   - this workflow file
   - current repo tree
3. Give one phase only.
4. Review the output.
5. Run the project locally.
6. Commit only if the phase is clean.

Do not let the AI continue into another phase automatically.

## 4. Phase 0: Planning And Repo Setup Decision

Goal:

Decide repo name, package manager, build tooling, docs framework, and package structure.

Recommended choices:

- Package manager: `pnpm`
- Monorepo: `pnpm workspaces`
- Build: `tsup` or `unbuild`
- Tests: `vitest`
- Docs: Next.js or VitePress/Nextra
- Examples: Next.js App Router and Vite
- Release: Changesets

Prompt:

```txt
Read MAP_KIT_PRODUCT_BLUEPRINT.md and MAP_KIT_AI_IMPLEMENTATION_WORKFLOW.md.

We are starting a new open-source map kit repo.

Phase 0 goal:
- Propose the exact repo structure.
- Choose tooling.
- Explain why each tool is selected.
- Do not write code yet.
- Do not implement components.

Output:
1. Monorepo folder structure.
2. Package list.
3. Build/test/docs tooling.
4. First 5 implementation phases.
5. Risks to watch.
```

Acceptance criteria:

- Clear monorepo structure.
- Clear package list.
- No code generated yet.
- MVP is scoped.

## 5. Phase 1: Monorepo Scaffold

Goal:

Create the initial monorepo structure.

Prompt:

```txt
Read MAP_KIT_PRODUCT_BLUEPRINT.md and MAP_KIT_AI_IMPLEMENTATION_WORKFLOW.md.

Phase 1 goal:
Create the initial monorepo scaffold only.

Use:
- pnpm workspaces
- TypeScript
- packages folder
- apps/docs
- examples folder
- shared lint/typecheck scripts

Create packages:
- packages/core
- packages/react
- packages/next
- packages/leaflet
- packages/maplibre
- packages/google-maps
- packages/mapbox
- packages/draw
- packages/routing
- packages/cli

Do not implement map components yet.
Do not implement adapters yet.

Before coding, inspect current files and make a short implementation plan.
After coding, run available checks.
```

Acceptance criteria:

- `pnpm-workspace.yaml` exists.
- Root `package.json` has workspace scripts.
- Each package has a minimal `package.json`.
- TypeScript configs exist.
- Docs app placeholder exists.
- No map implementation yet.

## 6. Phase 2: Core Types And Utilities

Goal:

Implement shared types and pure utilities.

Prompt:

```txt
Phase 2 goal:
Implement @map-kit/core.

Add:
- coordinate types
- map engine types
- provider config types
- marker/route/geofence types
- coordinate conversion helpers
- bounds helpers
- route distance/progress helpers
- provider validation helpers

Supported engines:
- leaflet
- maplibre
- google-maps
- mapbox

Do not implement React components.
Do not import Leaflet, MapLibre, Google Maps, or Mapbox.
This package must stay framework-agnostic.

Add unit tests for helpers.
Run tests and typecheck.
```

Acceptance criteria:

- Core package exports stable types.
- Utility functions are pure.
- Tests cover coordinate and bounds helpers.
- No browser-only APIs.

## 7. Phase 3: Engine-Agnostic React API

Goal:

Define the public React component API without binding to an engine.

Prompt:

```txt
Phase 3 goal:
Implement @map-kit/react engine-agnostic API contracts.

Create:
- Map component API
- Marker component API
- Popup component API
- Route component API
- Circle component API
- Polygon component API
- FitBounds component API
- Map context
- useMap hook

Do not implement actual Leaflet or MapLibre rendering yet.
Create adapter interfaces that engines will implement.

Add examples or tests showing intended JSX API.
```

Acceptance criteria:

- Public component props are typed.
- Adapter interface exists.
- Components do not crash.
- Rendering may be placeholder at this phase.

## 8. Phase 4: Leaflet Adapter

Goal:

Implement the simple/raster map engine first.

Prompt:

```txt
Phase 4 goal:
Implement @map-kit/leaflet adapter.

Requirements:
- SSR-safe.
- Works in React.
- Works inside Next client components.
- Loads Leaflet CSS or documents required CSS.
- Fixes Leaflet default marker icon asset issue.
- Supports Map, Marker, Popup, Route/polyline, Circle, Polygon, FitBounds.
- Supports OSM raster provider.
- Supports custom tile URL provider.

Do not implement MapLibre yet.
Do not implement Google Maps or Mapbox.

Add a working example.
Run lint/typecheck/tests.
```

Acceptance criteria:

- Basic Leaflet map works.
- Marker renders.
- Popup renders.
- Route renders.
- Circle/polygon render.
- No SSR crash.
- Default marker icon works.

## 9. Phase 5: Next.js Package

Goal:

Make Next.js usage frictionless.

Prompt:

```txt
Phase 5 goal:
Implement @map-kit/next.

Requirements:
- Export Next-safe Map components.
- Hide dynamic import/client-only complexity from users.
- Work in Next.js App Router.
- Provide a basic page example.
- Avoid window/document access during SSR.
- Provide map loading fallback.

Use Leaflet adapter first.
Do not implement MapLibre in this phase.
```

Acceptance criteria:

- User can import from `@map-kit/next`.
- Basic map works in App Router.
- No `window is not defined`.
- Docs example exists.

## 10. Phase 6: MapLibre Adapter

Goal:

Implement vector map support.

Prompt:

```txt
Phase 6 goal:
Implement @map-kit/maplibre adapter.

Requirements:
- SSR-safe.
- Supports MapLibre style URL.
- Supports OSM/MapTiler/custom style configs.
- Supports Marker and Popup.
- Supports Route via GeoJSON source/layer.
- Supports Polygon via GeoJSON layer.
- Supports Circle approximation or circle layer where appropriate.
- Supports FitBounds.
- Supports map controls.

Do not implement Google Maps or Mapbox yet.

Add a working example.
Run checks.
```

Acceptance criteria:

- MapLibre map renders.
- Marker works.
- Route layer works.
- Polygon/circle work.
- Fit bounds works.

## 11. Phase 7: Provider Presets

Goal:

Make provider setup simple and safe.

Prompt:

```txt
Phase 7 goal:
Implement provider presets and validation.

Providers:
- OSM raster
- CARTO raster
- MapTiler vector
- custom raster
- custom style

Requirements:
- Attribution required.
- Missing API key should show developer-friendly error.
- Docs should mention provider terms.
- Do not silently render blank maps.

Do not add Google Maps or Mapbox yet.
```

Acceptance criteria:

- Provider configs are typed.
- Invalid config gives clear error.
- Docs include provider guide.

## 12. Phase 8: Geofence Editor Block

Goal:

Create first high-value block.

Prompt:

```txt
Phase 8 goal:
Create geofence-editor block.

Features:
- circle geofence
- polygon geofence
- radius input for circle
- center marker
- edit mode
- delete/reset
- output GeoJSON
- output normalized geofence object

Important:
- Circle should not expose many polygon points by default.
- Circle should be center + radius.
- Make UI compact and dashboard-friendly.

Add docs and example.
```

Acceptance criteria:

- User can create/edit circle.
- User can create/edit polygon.
- Output is usable.
- UI works in Next.js.

## 13. Phase 9: Trip Tracking Map Block

Goal:

Create logistics/fleet block.

Prompt:

```txt
Phase 9 goal:
Create trip-tracking-map block.

Features:
- origin marker
- destination marker
- via markers
- vehicle marker
- actual traversed route
- remaining route
- route legend
- fit bounds
- optional status tooltip

Use generic props. Do not hardcode business-specific names.
Add example data.
```

Acceptance criteria:

- Route renders.
- Vehicle marker renders.
- Legend renders.
- Works with sample data.

## 14. Phase 10: Route Playback Block

Goal:

Create completed-trip playback experience.

Prompt:

```txt
Phase 10 goal:
Create route-playback block.

Features:
- start
- pause/resume
- stop/reset
- speed options: 0.25x, 0.5x, 1x, 2x
- follow vehicle toggle
- progress bar
- moving marker rotates with path direction
- stop markers
- configurable stop hold duration

Use requestAnimationFrame.
Avoid excessive React state updates per frame.
Add demo route.
```

Acceptance criteria:

- Playback starts.
- Marker moves smoothly.
- Speed changes work.
- Stop hold works.
- Reset works.
- Follow camera works.

## 15. Phase 11: Registry And CLI

Goal:

Make installation plug-and-play.

Prompt:

```txt
Phase 11 goal:
Implement registry and CLI.

Commands:
- map-kit init
- map-kit add basic-map
- map-kit add geofence-editor
- map-kit add trip-tracking-map
- map-kit add route-playback

Requirements:
- Detect Next.js or Vite.
- Detect TypeScript.
- Detect Tailwind.
- Install required dependencies.
- Copy block files.
- Do not overwrite user files without confirmation.
- Print next steps.
```

Acceptance criteria:

- CLI can add a block.
- Generated code compiles.
- Instructions are clear.

## 16. Phase 12: Google Maps Adapter

Goal:

Add commercial Google Maps support after the core API is stable.

Prompt:

```txt
Phase 12 goal:
Implement @map-kit/google-maps adapter.

Requirements:
- Uses existing engine adapter API.
- Does not change core public API unless unavoidable.
- Loads Google Maps script only once.
- Requires API key.
- Shows clear missing-key error state.
- Supports Map, Marker, Popup/InfoWindow, Route/polyline, Polygon, Circle, FitBounds.
- Adds docs for billing, quotas, and terms.
- Adds Next.js example.

Do not implement Google Places or Directions in this phase unless base adapter is complete.
```

Acceptance criteria:

- Google map renders with key.
- Missing key state is clear.
- Marker and route work.
- Docs mention billing.

## 17. Phase 13: Mapbox Adapter

Goal:

Add commercial Mapbox support.

Prompt:

```txt
Phase 13 goal:
Implement @map-kit/mapbox adapter.

Requirements:
- Uses existing engine adapter API.
- Requires Mapbox token.
- Supports style URL.
- Shows missing-token error state.
- Supports Map, Marker, Popup, Route via GeoJSON layer, Polygon, FitBounds.
- Adds docs for billing, quotas, and terms.
- Adds Next.js example.

Do not replace MapLibre adapter. Mapbox is an additional commercial adapter.
```

Acceptance criteria:

- Mapbox map renders with token.
- Missing token state is clear.
- Marker and route work.
- Docs mention billing.

## 18. Phase 14: Documentation Website

Goal:

Make the project understandable.

Prompt:

```txt
Phase 14 goal:
Build documentation website.

Docs pages:
- introduction
- installation
- Next.js setup
- Vite setup
- choosing an engine
- Leaflet
- MapLibre
- Google Maps
- Mapbox
- providers and billing
- basic map
- markers
- routes
- geofence editor
- trip tracking
- route playback
- troubleshooting

Add copyable examples.
```

Acceptance criteria:

- Docs run locally.
- Examples are copyable.
- Troubleshooting is clear.

## 19. Phase 15: Quality Pass

Goal:

Polish and stabilize.

Prompt:

```txt
Phase 15 goal:
Quality pass.

Check:
- public API consistency
- naming consistency
- TypeScript exports
- package builds
- docs correctness
- example apps
- SSR safety
- map cleanup
- memory leaks
- dependency size
- provider warnings

Do not add new features unless required to fix quality issues.
```

Acceptance criteria:

- Build passes.
- Typecheck passes.
- Tests pass.
- Examples run.
- Docs run.

## 20. Review Checklist For Every AI Phase

Before accepting AI output, check:

- Did it implement only the requested phase?
- Did it introduce unrelated abstractions?
- Did it duplicate code unnecessarily?
- Does TypeScript compile?
- Does package export correctly?
- Does the example run?
- Does it work in Next.js?
- Are provider terms documented?
- Are errors clear?
- Is the API beginner-friendly?

## 21. Prompt Template

Use this template for each implementation request:

```txt
Read:
- MAP_KIT_PRODUCT_BLUEPRINT.md
- MAP_KIT_AI_IMPLEMENTATION_WORKFLOW.md

We are implementing Phase X: [phase name].

Goals:
- [goal 1]
- [goal 2]
- [goal 3]

Constraints:
- Keep changes scoped to this phase.
- Do not implement future phases.
- Inspect existing files before coding.
- Make a short implementation plan first.
- Add tests or examples where useful.
- Run lint/typecheck/tests.

Acceptance criteria:
- [criteria 1]
- [criteria 2]
- [criteria 3]

After implementation:
- Summarize changed files.
- Explain how to test manually.
- Mention remaining work.
```

## 22. How To Avoid AI Mess

Do:

- Work in small phases.
- Ask for plans before code.
- Review diffs.
- Run examples.
- Keep public API stable.
- Add tests early.

Do not:

- Ask AI to build the full product at once.
- Let AI change package architecture repeatedly.
- Let AI add Google/Mapbox before core API is stable.
- Accept code without running examples.
- Accept blank map behavior for missing provider config.

## 23. Final Recommended Sequence

Best sequence:

1. Phase 0: Plan.
2. Phase 1: Scaffold.
3. Phase 2: Core.
4. Phase 3: React API.
5. Phase 4: Leaflet.
6. Phase 5: Next package.
7. Phase 6: MapLibre.
8. Phase 7: Providers.
9. Phase 8: Geofence editor.
10. Phase 9: Trip tracking.
11. Phase 10: Route playback.
12. Phase 11: CLI/registry.
13. Phase 14: Docs.
14. Phase 15: Quality pass.
15. Phase 12: Google Maps.
16. Phase 13: Mapbox.

Reason:

- Open-source adapters prove the core.
- Blocks prove product value.
- CLI proves plug-and-play.
- Docs make it usable.
- Commercial adapters come after API stability.
