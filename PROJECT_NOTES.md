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

**Debugging note (post-round-6):** Troy reported the live (Netlify) site's printed cards still showed plain gray headers after this shipped. A long diagnostic pass — checking `git remote`/`git log`, `git show HEAD:src/...` content directly, the Netlify deploy log, and a fresh incognito load — confirmed the correct round-6 code was committed, pushed, and deployed the entire time; there was no code or deployment defect. Two red herrings along the way, worth remembering: (1) Troy had the project checked out locally under two similarly-named folders (`lassale-armybuilder` vs the correctly-spelled `lasalle-armybuilder`), which briefly looked like a sync problem but wasn't — only the correctly-spelled one is wired to `git remote`/GitHub; (2) on Windows, `Copy-Item -Recurse` fails to merge into a folder that already has subfolders of the same name ("Container cannot be copied onto existing leaf item") — `robocopy source dest /E` is the right tool for merging a directory tree without deleting anything. The actual root cause: Chrome's print dialog has a "Background graphics" checkbox (under "More settings") that's unticked by default, which silently strips all CSS background colors/gradients — including the nation header colors — from print output. Ticking it fixed the live site immediately with zero code changes. (Troy asked for this to be added, so it's now implemented: `.print-only, .print-only * { print-color-adjust: exact; -webkit-print-color-adjust: exact; }` in `src/index.css` makes Chrome default its "Background graphics" checkbox to on for these pages — verified via Playwright with `page.emulateMedia({media:'print'})` that the computed style is applied and the header colors render correctly with no console errors. Version bumped to 1.0.1 for this fix.)

### Round 7: version numbering + accounts (Google sign-in) + save/load army lists

Troy's request: "add version numbering to the app as well as the ability to login/create a login with Google or email accounts, to save and load created lists." Clarified three open questions with him before building: backend = Supabase; login method = Google only for now (no email/password); saved lists = private to each account only (no sharing) for now.

**Version numbering**: `package.json` gained a real `version` field (starting at `1.0.0`). `vite.config.ts` reads it at build time and injects it as a global constant `__APP_VERSION__` (via Vite's `define`, declared for TypeScript in `src/vite-env.d.ts`). It's shown in the app header, the footer, and appended to both printed documents' captions ("Generated with the Lasalle Army Maker v1.0.0..."), so a screenshot or printout always says which version produced it. Bump `package.json`'s `version` for future rounds and it flows through automatically.

**Accounts + save/load**: added Supabase (hosted Postgres + Auth) as an optional backend — optional in the sense that the app works identically to every prior round if it isn't configured, since none of this is required to use the builder. `src/lib/supabaseClient.ts` reads two `VITE_`-prefixed env vars (URL + anon key) and exposes a `supabaseConfigured` boolean; every piece of new UI checks that flag and simply doesn't render if it's false, so nothing changes for anyone (including Troy, until he finishes setup) who hasn't wired up a Supabase project. Building blocks:

- `src/lib/useAuth.ts` — session state via Supabase's `getSession`/`onAuthStateChange`, plus `signInWithGoogle()` (delegates to Supabase's `signInWithOAuth`) and `signOut()`.
- `supabase/schema.sql` — creates one table, `army_lists` (`id`, `user_id`, `name`, `data jsonb`, timestamps), with Row Level Security policies restricting every select/insert/update/delete to rows where `auth.uid() = user_id`. This is the actual privacy boundary — enforced by Postgres on Supabase's servers, not just app code — which is what makes the anon key safe to ship publicly in the built site.
- `src/lib/savedLists.ts` — thin CRUD wrapper (`listSavedLists`, `saveList`, `loadList`, `deleteList`) around that table.
- `src/components/AccountPanel.tsx` — new sidebar panel (renders nothing if Supabase isn't configured): sign-in-with-Google button when signed out; when signed in, shows the account email, a "save as new" name field, an "update existing list" link when one's loaded, and a list of saved army lists with Load/Delete actions.

Setup is entirely Troy's own external work (creating the Supabase project, wiring Google OAuth via Google Cloud Console, adding the two env vars to Netlify) — written up step by step as a standalone doc, `SUPABASE_SETUP.md`, delivered alongside this round. Verified locally with Playwright both with and without Supabase env vars set: with none set, the app renders and behaves exactly as round 6 (no Account panel, zero console errors); a full `tsc -b` + `npm run build` pass was also clean.

### Round 8: artillery firepower dice + card width fix

Troy reported (uploading the core rulebook PDF for reference): "The cards are still not correct, they are missing. Please see pages 19-21 of the rulebook for details." Follow-up clarification (multi-select): cards appear but some details are wrong, a whole category is missing (traits), and cards are too wide compared to the originals.

Investigation first confirmed no unit was structurally missing a card profile at all (0/210 units lack one) — the actual defect was more specific:

1. **Artillery firepower dice were completely unmodeled.** Every artillery card rendered a generic fixed pair of 2 dice regardless of unit type, when the source booklet varies the dice count (3, 4, or 5) per battery type — this is the "how many dice you roll to hit" stat, arguably the single most important number on an artillery card, so it reads as "missing" even though every other field was present. Re-derived the correct dice count for all 62 artillery units from the "Open Architecture" Firepower table (Army Maker p.61: 5 dice = 15pts, 4 dice = 12pts, 3 dice = 10pts base cost, modified by Heavy Artillery +2, Horse Artillery +2, and a 5+ (rather than 4+) to-hit number −2) applied against each unit's existing printed cost/to-hit/traits, then cross-checked the formula's output directly against high-resolution crops of Austria's and France's actual printed cards (exact match). `CardProfile` gained a `firepower?: number` field, the `art()` helper now takes it as a required second argument, and all 62 call sites in `cardProfiles.ts` were mechanically updated. `DicePair` (`icons.tsx`) was rewritten from a hardcoded 2-die SVG into a variable-count die-cluster generator (2 dice per row, slight stagger/rotation to match the source art), and `UnitCard.tsx` now passes `profile.firepower` through instead of always rendering 2.
2. **One data gap found along the way**: Britain's Rocket Troop was missing the Horse Artillery trait entirely (confirmed directly off its printed card image: 3 dice, 5+ to-hit, Horse Artillery). Added.
3. **Card width**: measured a plain infantry card in the source PDF at 200dpi (≈2.245in × 1.12in, aspect ratio ≈2.0) against our rendered card (≈3.6in wide, ratio ≈2.82) — confirmed quantitatively too wide/squat compared to the originals. Narrowed `UnitCard.tsx`'s fixed width from `3.6in` to `2.75in`.

Re-verified via Playwright across Austria (infantry/cavalry/all three artillery trait combinations), Britain (Rocket Troop specifically), France (Horse Artillery), and Russia (Foot Battery/Horse Battery, the two 5-dice cases) — dice counts, trait icons, nation header colors, and card proportions all render correctly with zero console errors and a clean `tsc -b` build. Version bumped to 1.0.2.

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

## Deployment status — RESOLVED (this sandbox still can't push directly, but that's fine)

This sandboxed session's git credential is scoped to an empty "authorized repository set," so `git push` from here always fails with "not in this session's authorized repository set" — confirmed repeatedly, still true as of round 7. That's a permanent limitation of this environment, not a project problem, and there's now a working process around it:

- Repo: `https://github.com/Tromac2020/lasalle-army-builder` — Troy owns this and pushes from his own Windows machine.
- Hosting: Netlify site `lasalle-army-builder` is connected to that GitHub repo for continuous deployment — every push to `master` auto-deploys, no manual drag-and-drop needed anymore.
- **Per-round workflow**: this session builds/commits/packages a source zip and a dist zip → Troy extracts the source zip's contents into his real local repo folder (merging, not replacing — see the folder-name/`robocopy` note above if extracting over an existing checkout) → `git add -A && git commit && git push` on his machine → Netlify picks it up automatically within roughly a minute.

No action items remain here; this section is kept for context on why every round's delivery includes a source zip rather than a direct push.
