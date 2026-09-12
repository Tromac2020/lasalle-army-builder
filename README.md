# Lasalle Army Maker

An unofficial, fan-made army building tool for [*Lasalle Second Edition*](https://www.honourgames.com/) by Sam A. Mustafa, based on the free **Army Maker v1.22** booklet.

Pick a nation (7 major powers + 14 minor powers), declare a Line or Elite corps where that distinction applies, build organic and reserve brigades within their min/max and subtype rules, attach or combine army assets, add foreign allied/client contingents, and track your points total against a budget — all validated against the essential-brigade, army-maximum, and two-units-per-brigade rules from the booklet.

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

*Lasalle* and *Lasalle Second Edition* are copyright Sam Mustafa Publishing LLC. This is an unofficial fan tool and is not affiliated with or endorsed by the publisher.
