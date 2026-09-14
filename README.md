# Lasalle Army Maker

An unofficial, fan-made army building tool for [*Lasalle Second Edition*](https://www.honourgames.com/) by Sam A. Mustafa, based on the free **Army Maker v1.22** booklet.

Pick a nation (7 major powers + 14 minor powers), declare a Line or Elite corps where that distinction applies, build organic and reserve brigades within their min/max and subtype rules, attach or combine army assets, add foreign allied/client contingents, and track your points total against a budget — all validated against the essential-brigade, army-maximum, and two-units-per-brigade rules from the booklet.

Once your order of battle is built, use the sidebar's **Print Army List** button for a clean, printable order-of-battle sheet, or **Print Unit Cards** for one tabletop tracking card per unit you've actually purchased — track, resolve, skirmish value, and trait icons included, laid out to be cut apart, with header colors matched to each major power's own card color from the booklet. Card icon artwork uses the official game's own icon set (used with the rights holder's permission — see below); the stat values themselves (track length, resolve threshold, skirmish value, traits) were transcribed from each nation's own Army Tablet page and cross-checked against the booklet's "Open Architecture" point-cost formula (pages 60-61) for consistency.

The app displays its current version number in the header and footer, and on both printed documents, so a printout or screenshot always shows which version produced it.

## Accounts and saved army lists (optional)

Sign in with Google to save army lists to your account and load them back later. This is entirely optional — the builder works exactly the same without signing in, and the "Account" panel simply doesn't appear at all until a Supabase backend has been configured (see `SUPABASE_SETUP.md` for the one-time setup checklist). Saved lists are private to your own account.

## Running locally

```bash
npm install
npm run dev
```

## Building

```bash
npm run build
```

## Data source & known gaps

All unit costs, brigade displays, and army assets are transcribed from *The Army Maker* v1.22 PDF. A few things are worth knowing:

- **Sapeur, ADC, and Partisan costs are never printed in the booklet** (only the core Lasalle rulebook would have them). The app lets you type in a house-rule cost wherever they appear; it defaults to 0.
- Organic vs. Reserve brigade coloring and elite/line "corps" eligibility were reconstructed from the booklet's visual layout; if you spot a mismatch against your copy, it's an easy fix in `src/data/nations.ts` — the file is one big readable list of nations, units, and brigades.
- Historical date restrictions are shown for reference but not hard-enforced, matching the booklet's own philosophy: *"the rest is up to you."* Foreign contingents can currently be drawn from any nation, not just the historically-listed allies/clients, for the same reason.
- Sapeur / ADC / Partisan army assets have no printed unit card in the booklet either, so they're skipped when printing unit cards (same as the source material).

*Lasalle* and *Lasalle Second Edition* are copyright Sam Mustafa Publishing LLC. This is an unofficial fan tool and is not affiliated with or endorsed by the publisher. Card icon artwork (`src/assets/cards/`) is used with permission from the rulebook's author to use/customise the official templates and artwork for this project.
