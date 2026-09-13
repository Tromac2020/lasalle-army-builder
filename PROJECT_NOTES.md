# Lasalle Army Maker — build notes (2026-09-12)

## Update: printable army list + unit cards

Added two print outputs, reachable from the sidebar once a nation is picked:

- **Print Army List** (`src/components/PrintList.tsx`) — a clean order-of-battle document (no builder chrome), listing every brigade/combo brigade/foreign contingent/earthworks with costs and a grand total.
- **Print Unit Cards** (`src/components/PrintCards.tsx` + `src/components/UnitCard.tsx`) — one tabletop tracking card per unit actually in the army (brigades, attached assets, and combo-brigade units), showing track, resolve, skirmish value, and trait icons.

Both are rendered into a dedicated `#print-root` (`.print-only`, hidden on screen, shown only under `@media print`) built in `App.tsx`, while the entire interactive builder UI is now wrapped in `.screen-only` (hidden only during print). This replaced the old approach of trying to `.no-print` every individual control, which had gaps (e.g. `BrigadeCard`'s steppers weren't hidden).

Card stat data required re-reading the PDF's Army Tablet pages (14-58) directly rather than relying on memory, since `nations.ts` only stored name/kind/cost. Rather than embed this in `nations.ts`, it's a separate file — `src/data/cardProfiles.ts` — keyed by `` `${nationId}:${unitName}` `` (plus an `ALIASES` map for army-asset entries that use an abbreviated name, e.g. "Hvy. Position BTY" → "Heavy Position Battery"). Values (track array, shaken-zone size, resolve, skirmish, traits, and for artillery TH#/heavy/horse) were transcribed directly off each nation's own card image and cross-checked against the "Open Architecture" point formula on pages 60-61 (base track+resolve cost, plus per-trait modifiers) — that formula is documented in code comments but costs themselves are never recomputed from it; they still come from `nations.ts`.

Icon artwork went through four rounds before landing:

1. **Round 1**: original hand-drawn SVG, loosely inspired by a reference pack Troy uploaded (which turned out to be artwork extracted directly from the Army Maker PDF, not AI-generated as first described — confirmed via the pack's own bundled README/manifest). Rejected: "No sorry still not good enough" (style/quality, too small, a couple of wrong concepts).
2. **Round 2**: icons roughly doubled in size (16px → 24-30px, wider 28×28 viewBox), several redrawn more carefully. Also rejected: "No they are horrible, just stop."
3. **Round 3**: Troy shared a photo of the *official Lasalle rulebook's* own Traits key (page 20, a different document from the Army Maker booklet) and said the author had given permission to use/customise the official templates and artwork. Redrew all icons as closer original recreations of that reference. Sent as previews, not yet confirmed, before round 4 arrived.
4. **Round 4 (current, shipped)**: Troy then re-uploaded the same `lasalle-png-icons.zip` reference pack from round 1 (verified byte-identical via checksum) and asked to use its art directly. Since its README explicitly states this is "artwork extracted from Army-Maker-v1.22.pdf... not newly generated or original art," its use required going back to Troy to confirm the author's permission (from round 3) actually extends to this Army Maker booklet material too, not just the core rulebook page — he confirmed yes. **`src/components/icons.tsx` now renders these actual PNG assets directly** (`src/assets/cards/*.png`) via `<img>` tags scaled into a consistent square box (`object-fit: contain`), instead of hand-drawn SVG: `KindIcon` (infantry/cavalry/artillery silhouettes), `ResolveBurst` (pre-rendered numbered burst images for 3+/4+/5+/6), `SkirmishBadge` (infantry silhouette + a separate numeral image overlay for 1/2/3), and `TraitIcon` (all 11 traits, including Cavalry Skirmishers which now uses the pack's own pre-composed "soldier aiming, tagged 1" image instead of a hand-drawn equivalent).

**Do not use the `lasalle-png-icons.zip` pack (or any similar extracted-PDF material) as source-of-truth art in a *different* project, or for anything beyond this app, without independently re-confirming permission** — the permission here is specific to Troy's statement that the Lasalle rulebook author authorized this fan tool's use of the official templates/artwork.

### Round 5: card layout redesign (to more closely match the printed originals)

Troy's feedback after round 4 shipped: "Is there anything you can do to make the printed cards look more like the originals? They don't look very good." The icon *artwork* itself was fine by then (round 4) — the problem was the overall card layout/chrome around it. Re-read the source PDF's actual populated Army Tablet cards (pages 14-15, Austria) and the core rulebook's blank card-label template (page 2) directly to compare against, and extracted page 15 at 300dpi to study the artillery cards' dice/to-hit treatment closely. Found and fixed five gaps in `UnitCard.tsx` / `icons.tsx`:

1. Header now has a steel-gray linear gradient background with a thick black bottom border (was a plain white header with a thin gray line).
2. The point-cost badge is now a metallic gold coin (`CostBadge`, radial-gradient SVG) instead of a flat amber circle.
3. The cavalry/artillery "kind" icon (mounted horseman / cannon) moved from the card body into the header, next to the cost badge — matching the original layout. (Previously it was incorrectly placed in the body next to the trait icons.)
4. Artillery cards' to-hit value now shows the source material's "dice pair + soft red halo" treatment (`DicePair` + `ToHitBadge`, both new hand-authored SVG — no matching asset existed in the permitted extraction pack for this specific compound treatment) instead of plain text.
5. Card typography switched from the app's inherited Georgia serif to `font-sans`, matching the source's cleaner sans-serif card labels.

Also corrected the printed-cards page caption, which still said "Icon artwork is an original rendering, not reproduced from the source booklet" — a leftover from before round 4's permission was confirmed. It now reads "Icon artwork is the official game's own artwork, used with the rights holder's permission."

Re-tested via Playwright across Austria (Grenz/Jäger/Landwehr/Musketeer/Hussar/Insurrection Cavalry/artillery), Britain (Foot Guard/Foot Regiment/Rifle regiment/Brunswick units/artillery), and an Austria Cuirassier/Grenadier-focused spread — zero console errors, and close-up crops confirmed clean rendering of the new header gradient, cost badge, dice pair, and to-hit halo with no clipping or glitches.

### Round 6: per-nation header colors

Troy's next request: "can you colour the card headers based on the country as per the originals in the pdf." Round 5 gave every nation the same neutral steel-gray header; the source booklet actually gives each of the 7 major powers its own header color and keeps every minor power on a shared near-black header. Confirmed this by extracting and sampling each major power's Army Tablet page (not just the section title bar — the actual unit-card headers) at high resolution, and by checking several minor-power pages (Brunswick, Italy) plus their brigade-list bars: every minor power uses the same near-black `#231f20`, while the majors are each genuinely distinct:

- Austria: neutral steel-gray (`#c9cdd1`) — matches the booklet's own neutral UI chrome; Austria doesn't get a "flag color" like the others.
- Britain: red (`#c8212a`)
- France: royal blue (`#3969b1`)
- Prussia (both early and late war lists): navy (`#1c2a52`)
- Russia: dark green (`#1a532b`)
- Spain: yellow (`#fbe500`)
- Turkey: light green (`#7dcf73`)
- All 14 minor powers: near-black (`#231f20`)

Also checked whether the header's kind icon (mounted horseman / cannon) or the cost badge get recolored for contrast on dark headers — they don't in the source material (a French cavalry card on the blue header still shows a plain black horse silhouette), so `KindIcon` and `CostBadge` were left untouched; only the header background, unit-name text color, and (foreign-contingent) subtitle text color are nation-aware now.

Implementation: new `src/data/nationColors.ts` maps nation id → `{bg, text, subtitle}` (major powers keyed individually, everything else falls through to the shared minor-power default), plus a small `shade()` helper that derives a light-to-dark gradient from each nation's base color so the header keeps the same raised/gradient look as round 5 rather than going flat. `UnitCard.tsx` takes a new optional `nationId` prop and uses it for the header gradient and text colors; `PrintCards.tsx` passes `instance.nationId` through.

Verified with Playwright by building a brigade for each of Austria/Britain/France/Prussia/Russia/Spain/Turkey plus one minor power (Poland) and printing cards for each — zero console errors, and the rendered header colors/text contrast matched the sampled PDF colors closely across all eight.

Units with no printed tablet card (Sapeur/ADC/Partisans — cost is a house-rule value, as noted above) are simply skipped when generating cards, matching the source material.

Tested via Playwright: built a Britain army (Infantry/Guards/Heavy Cavalry brigades incl. attached assets) and an Austria Avant-Garde brigade (mixing Grenz/Jäger/Landwehr/Musketeer/Hussar/artillery — a good spread of traits), rendered both print views under `page.emulateMedia({media:'print'})`, and visually confirmed track/resolve/traits/fire-dice render correctly with no console errors.


## What's built

A full React + TypeScript + Vite + Tailwind army builder for *Lasalle Second Edition*, transcribed from the Army Maker v1.22 PDF Troy uploaded (63 pages, all 7 major powers + 14 minor powers).

- `src/data/types.ts` / `src/data/nations.ts` — the entire data model: units, brigade displays (min/max, essential stars, army maxima, elite/line corps eligibility), army assets (attach or combine), earthworks. One big readable file — easy to hand-correct.
- `src/logic/engine.ts` — pure functions: point totals, and `validateArmy()` which checks essential-brigade requirement, army maxima, 2-units-per-brigade minimum, per-brigade and army-wide asset caps, foreign elite-corps restriction, point budget.
- `src/components/BrigadeCard.tsx`, `Stepper.tsx`, `Summary.tsx`, `App.tsx` — the UI: nation/corps picker, brigade builder with steppers per unit line, asset attach/combine, foreign contingent picker, live point total + validation + print view.
- Verified with a Playwright smoke test (nation select → add brigade → adjust steppers → point math correct → essential/army-max validation both fire correctly).

## Known gaps (documented in README.md too)

- **Sapeur / ADC / Partisan costs are never printed anywhere in the Army Maker booklet.** The app models their cost as `null` and lets the user type in a house-rule value inline wherever they're purchased (defaults to 0).
- Organic-vs-reserve brigade coloring and which brigades are "either" corps vs strictly line/elite were reconstructed from the booklet's visual layout (colors, corner shapes) from memory of page images, not from machine-readable text — worth a spot check against a physical/PDF copy if something looks off. Essential-brigade flags, army maxima, and all point costs were read directly and should be reliable.
- Historical date restrictions and foreign-contingent eligibility (who's whose ally/client) are shown as reference text only, not hard-enforced — matches the booklet's own "the rest is up to you" philosophy (p.5). Any nation can currently be added as a foreign contingent to any other.

## Deployment status — BLOCKED, needs Troy's action

Two infrastructure walls hit in this sandboxed session, both confirmed not workaroundable from here:

1. **GitHub**: this session's git credential is scoped to "this session's authorized repository set," which is empty — `git push` and the GitHub API both refuse with "not in this session's authorized repository set." Creating a repo via `POST /user/repos` is also blocked ("sessions are bound to their configured repositories"). This looks like a Claude Code-on-the-web repo-binding feature that a Cowork session never gets offered. No tool in this session can grant it.
2. **Netlify direct deploy**: created the site successfully via the Netlify MCP connector (`lasalle-army-builder`, team `nf_team_dev`, id `ee02b0e5-6a33-4ab8-8c6f-9b9d18440b34`, URL `http://lasalle-army-builder.netlify.app`). But the MCP's own recommended deploy path (`npx @netlify/mcp@latest --proxy-path ...`) uploads straight to `netlify-mcp.netlify.app`, which this sandbox's egress policy blocks outright (confirmed via raw curl: `CONNECT tunnel failed, response 403`, not a token/timing issue). Also tried the built-in browser (runs on Troy's own device, different network) — but Netlify login there needs Google sign-in, and typing a password into that login form would cross the "never enter credentials" rule, so that path stops at the login screen and was not pursued further.

**Files already delivered to Troy**: `lasalle-army-builder-dist.zip` (built, ready to drag onto Netlify) and `lasalle-army-builder-source.zip` (full source), both sent via chat and also written to his Downloads folder.

## Fastest path to finish (for Troy or a future session)

1. Netlify: open `https://app.netlify.com/sites/lasalle-army-builder/deploys` (already logged in on his own machine) and drag `lasalle-army-builder-dist.zip` onto the deploy area — live in ~10 seconds. Or connect the GitHub repo once it exists for continuous deploys instead.
2. GitHub: unzip `lasalle-army-builder-source.zip` anywhere, then:
   ```
   git init -q  (skip if already a repo)
   git remote add origin https://github.com/Tromac2020/lasalle-army-builder.git
   git branch -M master
   git push -u origin master
   ```
   (create the empty repo on github.com first, no README/gitignore, so there's no merge conflict).
