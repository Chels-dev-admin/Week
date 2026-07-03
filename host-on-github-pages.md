# Host your Weekly OS dashboard on GitHub Pages

This gives your dashboard a permanent web address (e.g. `https://yourname.github.io/my-week/`) with HTTPS — so it becomes a real **installable app (PWA)**: it installs to your phone, opens in its own window, and works offline. It's free and stays live.

Upload **all three files together** — they must sit side by side in the repo:

- `index.html` — the app itself
- `manifest.webmanifest` — makes it installable (name, icon, standalone window)
- `sw.js` — the service worker (offline + the "Install app" prompt)

The no-code web route below is the easy one. You don't need Git or the command line.

---

## What you need

- A free GitHub account — sign up at https://github.com/signup if you don't have one.
- The three files above (all shared alongside this guide).

---

## Route A — GitHub website (no code, ~5 minutes)

**1. Create a repository**
- Go to https://github.com/new
- **Repository name:** `my-week` (or anything — lowercase, no spaces)
- Set it to **Public** *(Pages is free on public repos)*
- Tick **Add a README file**
- Click **Create repository**

**2. Upload the app**
- On the repo page, click **Add file → Upload files**
- Drag in **all three files** — `index.html`, `manifest.webmanifest`, `sw.js` (keep the exact names)
- Scroll down, click **Commit changes**

**3. Turn on Pages**
- Click **Settings** (top of the repo) → **Pages** (left sidebar)
- Under **Build and deployment → Source**, choose **Deploy from a branch**
- **Branch:** select `main`, folder `/ (root)` → click **Save**

**4. Get your link**
- Wait 1–2 minutes, then refresh the Pages settings screen
- It shows: **"Your site is live at https://yourname.github.io/my-week/"**
- That link is your dashboard. Open it on your phone.

**5. Install it as an app**
- Open the link in **Chrome** on your Samsung
- Menu (⋮) → look for **Install app** (or **Add to Home screen**) → **Install**
- It installs like a real app: its own **green icon** in your app drawer, opens in its own window (no browser bar), and works offline.
- *Tip:* the "Install app" option may take a few seconds to appear on first visit while the service worker registers. If you only see "Add to Home screen," that also works.

**6. First open — the setup wizard**
- The very first time you open it, you'll see **"Set up your week."** It's pre-filled with a sensible starter, so you can just tap **Save my week** to begin, then fine-tune anytime via the **⚙️** button.
- You can edit work hours, work vs. office days, commute, lunch, every day's plan blocks (your responsibilities/anchors), your minimum-viable-day essentials, and cycle tracking.

---

## Route B — Git command line (optional, for later)

If you ever prefer the terminal:

```bash
# once, inside a folder containing index.html
git init
git add index.html
git commit -m "Add weekly dashboard"
git branch -M main
git remote add origin https://github.com/YOURNAME/my-week.git
git push -u origin main
```

Then enable Pages the same way as Route A, step 3.

---

## Updating it later

When I give you a new version of the dashboard (e.g. refreshed cycle dates, or a new feature):

- **Add file → Upload files**, drop the new `index.html` (or whichever files changed), and confirm "replace." Live within a minute.
- The app is **network-first**, so the next time you open it online it fetches the new version automatically — no need to reinstall. (If it ever looks stale, close and reopen it while online.)

### Will updating the file wipe my settings? No.

Your setup (work days, day plans, essentials, cycle) is stored in your browser under the **web address**, not inside the file. Replacing `index.html` swaps the code but leaves your saved settings untouched — you'll open the new version with everything intact.

The only things that clear it: clearing your browser data, or uninstalling the home-screen app. Two more notes:

- Your **phone and desktop keep separate copies** (each browser has its own storage).
- To be safe, use **⚙️ → Backup / Restore → Export my setup** to save a `my-week-backup.json` file. You can re-import it any time — and it's also how you copy your setup from phone to computer (export on one, import on the other).

---

## Good to know

- **Your data is private.** Your settings and cycle date are stored only in your own browser (localStorage), never uploaded to GitHub. The hosted file has no personal data in it.
- **Public repo ≠ public data.** "Public" just means anyone with the exact link could view the *dashboard layout*. It holds no info about you. If you'd rather it be private, GitHub Pages on private repos needs a paid plan — for this, public is simplest and safe.
- **HTTPS is automatic** — that's what makes the home-screen app and any web-widget app behave.
- **Custom name:** if you name the repo exactly `yourname.github.io`, the site lives at the shorter `https://yourname.github.io/` (root) instead of a subfolder. Optional.

---

## Where this fits

Once it's hosted, the live URL becomes the single source you point everything at:
- **Home-screen app** — Add to Home Screen (above).
- **Web-widget app** — point it at the URL for an always-on home-screen widget.
- **Desktop** — bookmark the same link; works anywhere.

The KWGT widget and Google Calendar phase bands stay as they are — this just gives the full dashboard a permanent home.
