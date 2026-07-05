# My Week — complete bundle

Everything for your Weekly Operating System, in one place.

## 1. Host the app (these 3 files)

Upload to the **root** of a GitHub repo and turn on Pages:

- `index.html` — the app
- `manifest.webmanifest` — makes it installable
- `sw.js` — offline + the "Install app" prompt

Full step-by-step (no coding): **`guides/host-on-github-pages.md`**. Once live, open the link in Chrome → **Install app**.

## 2. Guides

- `guides/host-on-github-pages.md` — host it + install as a phone app (PWA)
- `guides/KWGT-widget-guide.md` — Samsung home-screen widget, incl. **auto-updating cycle phase via Tasker**
- `guides/cleaning-laundry-yard-schedule.md` — cleaning / laundry / yard rotation + Monday bin roster
- `guides/curly-hair-schedule.md` — curly (3a–3c) wash/refresh/treatment routine

## 3. Your saved setup (kept OUT of this bundle on purpose)

Your `my-week-backup.json` is **not** included here — it holds personal settings (your name, cycle start date), and this bundle is meant for a public repo. Keep that file on your device. To load it: open the app → **⚙ → Import from a backup file**. Don't upload it to a public repo.

## Quick start

1. Create a **public** GitHub repo → upload the 3 site files → **Settings → Pages → Deploy from branch → main / root**.
2. Wait ~1 min, open the live link in Chrome → **Install app**.
3. First open → **Set up your week** (or Import your backup).
4. Optional: build the home-screen widget from the KWGT guide.

## What updates itself vs. what you touch

- **Dashboard** — recomputes your day + cycle phase automatically; prompts you at cycle-end to confirm the date. Self-maintaining.
- **Calendar** — all reminders + the cycle phase bands recur on their own (28-day assumption). No upkeep unless your cycle shifts.
- **Widget** — with the Tasker option, advances daily on its own; one-tap button to roll to a new cycle.

To update the hosted app later, just re-upload a new `index.html`; your saved settings persist (they live in the browser, not the file).
