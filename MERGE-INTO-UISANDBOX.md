# UIcockpit → UISandbox: the merge brief

**Decision (Alexander Kaan, 2026-10-18).** UISandbox is the host and the name.
The UIcockpit engine moves into it as a package of modules. uicockpit.com stays
live until the cutover, then becomes a redirect. The merge is done in the
UISandbox repo and chat; this repo is the source being absorbed.

This file is the hand-off. Everything it points at lives in `dsg/` of this
repo at the commit that adds this file. Read it once, then read the code.

## What the merged product is

One screen. The benchmark is tweakcn (10.5k stars): presets top-left, export
top-right, controls left, real screens as tabs on the right. We keep that
skeleton and replace what tweakcn does worse: forty hex fields become one
colour and a derivation, shadcn-only becomes nine kits, "export CSS" becomes a
design system plus a skill, and the AI tab does not exist.

- **Top bar**: mark · *Look* dropdown (the kit start cards as presets) · *Engine*
  dropdown (the nine, pre-selected when the bridge recognises the app) · Light /
  Dark · undo / redo · **Share** · **Export**.
- **Left, the UISandbox row list** (this is the clearest of the three panels,
  keep it): Colour — Brand · Secondary · Status · Background · Grey tint. Type —
  Display · Body · Size · Line height · Letter spacing · Weight. Shape — Spacing
  · Radius · Border · Elevation · Motion. Foot: Shuffle · Reset. Each row shows
  label · current value · a state dot. UISandbox's deepest idea stays the
  grammar: **×1 = as in your code**; in kit mode the centre reads **as the kit
  ships it**. Hue / Saturation / Contrast appear only in own-build mode, because
  they only exist when there is somebody's CSS to move.
- **Stage**: tabs **Your app · Screens · Components**, UISandbox's viewport
  buttons (Fit / 1280 / 820 / 390), and one honesty line at the foot instead of
  UIcockpit's lint panel: reach meter, fidelity count, Check 1:1, "what we read
  from your code".
- **The door** (empty state): three ways in, equal: *your build* (zip, folder,
  repo URL — UISandbox), *your running app* (one script line + URL — the bridge),
  *a kit* (the nine). Samples under it.
- **Export**: the one deliverable first — *Design system + Skill* (the zip:
  theme.css, DESIGN.md, SKILL.md under `.claude/skills/<slug>/`, install.md,
  MANIFEST.md, tokens.json, the three pointers) with the agent line *"unzip in
  your repo, then: apply DESIGN.md and SKILL.md, screen by screen"*. Then the
  other forms: patch-in-place, Swift / Android (UISandbox), tokens.json as the
  Figma route (it is W3C DTCG; Tokens Studio and Figma's variable import read
  it; tweakcn's "Export to Figma" is a $119 upsell to a partner plugin, ours is
  the file plus a recipe and a link to each kit's own Figma kit).
- **Gone**: UIcockpit's start room, compose cards, wall room, seven-tab export
  drawer and lint panel; UISandbox's Hue/Sat/Contrast in kit mode.

## What moves over, and what each piece guarantees

| Piece | Files in `dsg/` | What it is | Invariant it carries |
|---|---|---|---|
| Derivation | `roles.mjs`, `color.mjs`, `palettes.mjs`, `stack.mjs` | one colour → every role, per kit vocabulary; `darken()` with `solidIn()` pointer resolution | every value traces to an input or to the kit's own published default; alpha pairs that cannot be re-derived are declared, not guessed |
| Routing + export | `generate.mjs` | `route`, `EMIT` per kit, `darkBlock`, `SCOPE`/`DARK` tables, theme.css, install.md, MANIFEST.md, DESIGN.md (Google's spec), **SKILL.md** (`skillMd`, `SKILL_VOCAB`), tokens.json (DTCG), AGENTS/CLAUDE/.cursor pointers, `COMPONENT_GAPS` | nothing invented: every variable is the kit's own name; a block wins by out-specifying the kit's own selector (`SCOPE`), dark is written under the kit's own switch (`DARK`); what could not be done is in the manifest |
| The kits | `kits/*.json`, `fetch-kits.mjs` (`node fetch-kits.mjs <kit>` refreshes one), `npm-read.mjs`, `registry-read.mjs`, `kit-defaults.mjs`, `icon-sets.mjs`, `antd-render.mjs`, `antd-nodes.mjs`, `material-elements.mjs`, `derive-material.mjs` | read from each package: variables, modes, classes, parts, runsIn, bands, licence, version; start cards; companion icon sets; Ant pre-rendered by its own React; Material's own generator | read, never typed; a kit's start card throws at build if the package stops publishing the value |
| Rendering | `parts.mjs` (the part vocabulary), `wall-bindings.mjs` (one table per kit), `scenes.mjs` (`BOARDS` = the strip, `SCREENS` = the six screens, `wallMarkup`, the shots/expose/audit CSS and the in-frame script), `build-css.mjs` | the same scene data rendered by every kit's own classes, elements or pre-render | every class on every element is defined by that kit's own stylesheet (fidelity + sweep CONSUMED) |
| The bridge | `live.js` (+ the page half: `appPayload`, `sendToApp`, `DARK_ROOT`, `DARK_NA`, the `message` listener in `page.template.html`) | one script line in the user's app; the exact live block `dress()` writes, posted over postMessage; kit detection read from the page itself | no model, no upload, nothing stored, inert when not framed; origin allow-list; the switch goes through the same diff dialog a base change always takes |
| Gates | `*.test.mjs` (123), `fidelity.mjs` (classes, elements, `SKILL_VOCAB` citations compiled as a probe), `sweep-check.mjs` + `runSweep` in the page (FOLLOW · VISIBLE · STATES · CONSUMED, light and proven-dark passes, twin deferred-and-counted), `exports-check.mjs` (consumer builds: Sass, Tailwind CLI, Radix/Mantine sheets, Ant's renderer, measured in Chrome) | | a gate that reports the kit's own number, never ours; `DARK_PROVEN` names what is open |
| Chrome worth keeping | `askSwitch` (the base-change diff dialog), the checks bar semantics, the `dress()` live-scope rules, `state.view` rooms | | |

## What UISandbox keeps as the spine

The loader (zip / folder / repo URL, service worker, security notes), the 1:1
tokeniser (every CSS literal becomes a variable holding its value), the dial
model with its ×1 centre and snaps, the reach meter and Check 1:1, patch-in-place
and Swift / Android export, the MCP and the Claude Code plugin. None of that
exists on the UIcockpit side and all of it is the reason UISandbox is the host.

## The doctrine that must survive the merge

From the homepage's "What it will not do", still true after the merge:
**no components of ours** (they come from the kit you picked), **no defaults of
ours** (switch a kit on and you get its values, read from what it publishes),
**no model in the render path**. Plus: gaps are declared, never substituted;
every rule we ship to an agent is checkable; a meter derives its subjects, it
never carries a hand-written list of them; and a second UI library never
arrives as a decision, it arrives as one import.

## Hard-won lessons, so they are not paid for twice

- **Specificity at distance** (three appearances): a live block loses to the
  kit's own more-specific selector (Mantine's `:root[data-mantine-color-scheme]`),
  so write under the kit's own scope; in dark, write under the kit's own dark
  selector; and never put a kit's dark switch on a *cell* inside an already-dark
  frame — the cell-level baked seeds beat the root-level re-theme.
- **A literal `</script>` inside an inline module** ends the module where it
  stands: "Unexpected end of input". Assemble the tag; never write it.
- **The audit must lay out both rooms at natural size** before it measures:
  hidden boxes have no computed colours, and flex-shrink flattens a tall screen's
  cards into "invisible" chips nobody ever sees.
- **An undo rule one selector short** of the rule it undoes loses the tie and
  leaves the transform on during measurement.
- **Tailwind and daisyUI generate classes on demand**: a cited class is only
  verifiable if the build was asked about it — compile the citations as a probe.
- **Pointer pairs** (`var(--x)`) resolve in their own mode's map before a
  light/dark judgement; **Tailwind tree-shakes unused `@theme` props** by design;
  only the light half of a block feeds var expectations; force
  `prefers-color-scheme: light` in CDP because a dark-mode host leaks.
- **Headless Chrome's minimum window is ~500px**: real phone layouts need
  `Emulation.setDeviceMetricsOverride`. `overflow-x:auto` silently computes
  `overflow-y` to auto. `.seg{display:inline-flex}` beats the `hidden`
  attribute; declare `[hidden]{display:none}` per class.
- **`.card` and `.col` are also daisyUI's and Bootstrap's classes**: address our
  own wall furniture by `data-` attribute and path, never by class name.

## Phases

1. **Done, live on uicockpit.com**: the six screens with Exposé, the generated
   skill in every export, the Your-app bridge, export in the top corner.
2. **UISandbox adopts the export and the kit door**: import `generate.mjs` with
   `roles` / `stack` / `kits` and produce DESIGN.md + SKILL.md + tokens.json from
   UISandbox's own knobs; add the kit door (the nine, from `kits/*.json`) with
   the six screens rendered by `wall-bindings` + `build-css`; port `live.js` and
   its page half as the third way in. Bring the gates with the modules — they
   are the reason the numbers can be trusted.
3. **One screen**: fold both UIs into the layout above. The row list is
   UISandbox's; the Look/Engine dropdowns, Share and Export are tweakcn's shape;
   Screens/Components/Your app are the tabs.
4. **Cutover**: uisandbox.org serves it; uicockpit.com 301s; GitHub About,
   README, og image, mark, footer, JSON-LD, llms.txt, sitemap, the skill's
   footer line, `live.js`'s allow-list and message names, and the npm
   deprecation texts all move in one sweep. Decide the mark before this step:
   the current one is UIcockpit's.

## Where things are

- This repo: `Ideelab/uicockpit`, engine in `dsg/`, gates `npm test` ·
  `npm run fidelity` · `npm run sweep` · `npm run exports`, build `npm run page`
  · `npm run home` · `npm run dist`, deploy `npx wrangler pages deploy dist
  --project-name=uicockpit`.
- UISandbox: `../UIsandbox` (`Ideelab/uisandbox`, uisandbox.org, `pnpm dev` on
  5190, `npm: uisandbox-mcp`).
- The three panels, looked at side by side on 2026-10-18: tweakcn's editor
  (presets, 40 hex fields, preview tabs incl. *Custom* = the script-tag bridge),
  UISandbox's row list on the Admin-dashboard sample, UIcockpit's compose page.
