# Copilot / AI Agent Instructions for popup-builder

This file provides focused, actionable guidance so an AI coding agent can be immediately productive in this repository.

**Quick Context**
- **What:** A Next.js app (App Router) that provides a visual popup-builder UI under the `app/` directory and a second feature area under `popup-builder/`.
- **Runtime:** Uses Next.js (see `package.json`) with React and Tailwind-related tooling.

**Key entrypoints & areas to read first**
- `app/layout.tsx` and `app/page.tsx` — top-level app router layout and page.
- `app/PopupBuilder.tsx` — main composition for the editor experience used by the app routes.
- `popup-builder/PopupBuilder.tsx` and `popup-builder/page.tsx` — alternate implementation and examples; this directory contains the majority of popup-building domain logic.
- `popup-builder/types.ts` — canonical TypeScript types for the JSON shape the editor manipulates. Use these types when adding features or modifying serialization.
- `popup-builder/popupPresets.ts` — example presets used to seed the canvas; good reference for expected JSON structure.
- `popup-builder/defaultStyleTypes.ts` — central style value shapes and defaults.
- `popup-builder/RenderComponent.tsx` and `app/components/PopupComponentRenderer.tsx` — where saved JSON is converted back to rendered React components.

**Important components & patterns**
- Canvas and rendering split: `ComponentsPanel.tsx` / `CanvasArea.tsx` / `CanvasContainer.tsx` handle UI/placement; `PopupComponentRenderer.tsx` and `RenderComponent.tsx` handle converting data models → rendered elements.
- Actionable input components: `popup-builder/*TypeActionable.tsx` (e.g., `ButtonTypeActionable.tsx`, `InputTypeActionable.tsx`) encapsulate how a particular component type exposes its editable props. When adding a new component type, add a TypeActionable and a renderer.
- Small presentational components live in `popup-builder/components/` (example: `TinyRoundedBadge.tsx`). Use this folder for non-editor-specific UI.
- JSON-first model: the editor stores component trees as JSON (see `ShowPopupJSON.tsx` to view). Preserve shape compatibility with `types.ts` and `popupPresets.ts` when changing fields.

**Dev & run commands**
- Start dev server: `npm run dev` — runs `next dev -p 3010` (app runs on port 3010). Use this exact command when reproducing behavior locally.
- Build: `npm run build`, Start: `npm run start`. Lint: `npm run lint`.

**Code conventions / expectations**
- Prefer updating or extending `popup-builder/types.ts` first when introducing new component properties — these are the canonical shapes used across the editor and renderer.
- Keep editing UI (controls, pickers) in `popup-builder/` alongside their actionable components. Renderer-only components belong in `app/components` or `popup-builder/components` depending on reuse.
- Avoid adding global CSS changes; use `app/globals.css` only for shared styles. Tailwind is available (see `tailwindcss` dev dep) but this project also uses some local CSS modules (e.g., `page.module.css`), so match the surrounding style.

**How to add a new component type (example workflow)**
1. Add a new renderer file or export to `RenderComponent.tsx` that maps the JSON `type` to JSX.
2. Create a `XTypeActionable.tsx` under `popup-builder/` to expose editable props in the right-side UI.
3. Update `popup-builder/types.ts` with the new props interface and adjust any union types.
4. Add a sample entry to `popup-builder/popupPresets.ts` so designers and tests can see the component in the canvas.
5. Use `ShowPopupJSON.tsx` to inspect serialization and confirm render parity.

**Integration points & dependencies**
- UI interactions are local to the client — data moves between panels and the canvas via component props/state/contexts. There is no backend in this repository; JSON is the canonical interchange format.
- External libs: `lucide-react`, `react-icons`, and `uuid` are used for icons and id generation. Use the project's `uuid` usage pattern when creating new node ids.

**Files to reference for examples**
- `popup-builder/PopupBuilder.tsx` — how the editor composes panels and the canvas.
- `popup-builder/ShowPopupJSON.tsx` — how to display the saved JSON state.
- `popup-builder/popupPresets.ts` — sample data that demonstrates expected shapes.

**Pitfalls found in the codebase**
- There are two similarly named entry files: `app/PopupBuilder.tsx` and `popup-builder/PopupBuilder.tsx`. Check which route or import path you are changing to avoid editing the wrong copy.
- Some filenames contain typos (e.g. `new_componets.tsx`). Be cautious when searching for symbols — prefer TypeScript symbol searches over filename matching.

If anything here is unclear or you want the instructions to emphasize a particular workflow (tests, CI, or release), tell me which area to expand and I will iterate.
