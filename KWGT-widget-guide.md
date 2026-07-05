# Weekly OS — Samsung Home-Screen Widget (KWGT)

A live home-screen widget that shows **today's day-type** and **what you're doing right now**, updating on its own. KWGT can't import the HTML dashboard, so this rebuilds it using KWGT's own formulas — copy-paste ready below.

Build the **Minimum version** first (5 minutes, just the day-type). Add the **Live "right now" line** later only if you want it. No pressure to do both.

---

## One-time setup

1. Install **KWGT Kustom Widget Maker** (free) from the Play Store. To use custom formulas without the watermark you need **KWGT Pro** (one-off purchase) — the free version works but nags.
2. Long-press your home screen → **Widgets** → **KWGT** → drag an empty widget (e.g. 4x2) onto the screen.
3. Tap the placed widget → it opens the KWGT editor.
4. In the editor: **Items** → **＋** → **Text**. You'll add a few Text items and paste a formula into each.

For each Text item: tap it → **Text** tab → tap the little **fx** (formula) icon → paste → tick to confirm.

---

## Minimum version — day-type card

Three text items stacked vertically.

**Item 1 — Day name** (big)

```
$df(EEEE)$
```

**Item 2 — Day type** (headline)

```
$if(df(EEEE)=Monday|df(EEEE)=Wednesday|df(EEEE)=Friday, OFFICE DAY, if(df(EEEE)=Tuesday|df(EEEE)=Thursday, HOME DAY, WEEKEND))$
```

**Item 3 — Mode** (small subtitle)

```
$if(df(EEEE)=Monday|df(EEEE)=Wednesday|df(EEEE)=Friday, Survival + recovery. No study or cooking., if(df(EEEE)=Tuesday|df(EEEE)=Thursday, Workhorse day. Study + real exercise., if(df(EEEE)=Saturday, Big-movement + errands + Slot B., Reset day. Cook, plan, rest.)))$
```

That alone gives you a glanceable "what kind of day is this" card that changes automatically at midnight.

---

## Live "right now" line (optional, advanced)

Add one more Text item. This reads the clock and shows your current block. It uses `T` = minutes since midnight, which in KWGT is `df(H)*60+df(m)`.

**Office days (Mon/Wed/Fri)** — paste as one item:

```
$if(df(EEEE)=Monday|df(EEEE)=Wednesday|df(EEEE)=Friday,
 if(df(H)*60+df(m)<320, 😴 Sleep,
 if(df(H)*60+df(m)<345, 🐾 Morning: feed + litter,
 if(df(H)*60+df(m)<360, 🚶 Short dog walk,
 if(df(H)*60+df(m)<480, 🚗 Get ready / commute,
 if(df(H)*60+df(m)<960, 💼 Work,
 if(df(H)*60+df(m)<1080, 🚗 Commute home,
 if(df(H)*60+df(m)<1100, 🛋️ Decompress — no demands,
 if(df(H)*60+df(m)<1140, 🐾 Long dog walk + care,
 if(df(H)*60+df(m)<1185, 🍽️ Reheat dinner,
 if(df(H)*60+df(m)<1200, 🧹 10-min reset,
 if(df(H)*60+df(m)<1260, 🌙 Wind-down,
 😴 Bed))))))))))), )$
```

**Home days (Tue/Thu)** — a second item, same idea:

```
$if(df(EEEE)=Tuesday|df(EEEE)=Thursday,
 if(df(H)*60+df(m)<330, 😴 Sleep,
 if(df(H)*60+df(m)<375, 🐾 Feed + litter,
 if(df(H)*60+df(m)<405, 🚶 Dog walk,
 if(df(H)*60+df(m)<480, 💪 Reclaimed block (exercise/study),
 if(df(H)*60+df(m)<960, 💼 Work,
 if(df(H)*60+df(m)<980, ⏸️ Transition buffer,
 if(df(H)*60+df(m)<1080, 📚 Second block (study/cook),
 if(df(H)*60+df(m)<1125, 🍽️ Dinner,
 if(df(H)*60+df(m)<1170, 🐾 Dog walk + play,
 if(df(H)*60+df(m)<1200, 🧹 One cleaning zone (15 min),
 if(df(H)*60+df(m)<1290, 🌙 Wind-down,
 😴 Bed))))))))))), )$
```

**Weekend** — a third item:

```
$if(df(EEEE)=Saturday|df(EEEE)=Sunday,
 if(df(H)*60+df(m)<420, 😴 Sleep,
 if(df(H)*60+df(m)<450, 🐾 Feed + litter,
 if(df(H)*60+df(m)<600, 🏃 Long activity / movement,
 if(df(H)*60+df(m)<780, 🛒 Errands / cook,
 if(df(H)*60+df(m)<960, 🎨 Slot B / study,
 if(df(H)*60+df(m)<1200, 🍽️ Dinner + walk,
 if(df(H)*60+df(m)<1290, 🌙 Wind-down,
 😴 Bed))))))), )$
```

Stack all three "right now" items in the same spot — only the one matching today's day-type shows text; the other two return blank, so they don't collide.

---

## Cycle phase line (optional)

You want this to advance on its own instead of editing dates every cycle. Two ways — pick one.

### Option 1 — Self-advancing formula (KWGT only, no Tasker)

Store your period start date once in a KWGT **global**, and the widget computes the phase from it every day — you only touch that one date when a new cycle starts.

1. KWGT editor → the **globals** icon (the ⚙/sliders at the bottom) → **＋** → **Text** global. Name it `cyclestart`, value `2026-07-02` (your last period's first day).
2. Add a Text item and paste this (it works out today's day-of-cycle and picks the phase):

```
$if(dc(dr, gv(cyclestart))%28<5, 🩸 Menstrual,
 if(dc(dr, gv(cyclestart))%28<12, 🌱 Follicular,
 if(dc(dr, gv(cyclestart))%28<15, ☀️ Ovulatory,
 if(dc(dr, gv(cyclestart))%28<25, 🍂 Early luteal, 🌘 Late luteal (PMS)))))$
```

`dc(dr, gv(cyclestart))` = days between now and your start date; `%28` wraps it into a cycle; the thresholds pick the phase. **When your next period starts, just change the one `cyclestart` global to that date** — no formula edits, ever.

*Verify once:* drop `$dc(dr, gv(cyclestart))$` into a temporary text field and check it shows the number of days since your start (should read `3` on 5 Jul). If your KWGT build uses a slightly different date-diff token, that quick check will tell you.

Phase colour (optional) — set the text **Color** to:

```
$if(dc(dr, gv(cyclestart))%28<5, #FFA8434F,
 if(dc(dr, gv(cyclestart))%28<12, #FF3F6F5C,
 if(dc(dr, gv(cyclestart))%28<15, #FFC8912F,
 if(dc(dr, gv(cyclestart))%28<25, #FFA9784F, #FF6B5B8A))))$
```

### Option 2 — Fully hands-off with Tasker (recommended)

This is what you asked about: Tasker does the maths daily and feeds the phase to the widget, and a one-tap button rolls the cycle over. KWGT just displays the result.

**A. One-time setup**

1. Install **Tasker**. In Tasker → **☰ → More → Android settings**, make sure **“Allow external access”** and Kustom's *“Allow Kustom to read Tasker variables”* are on (KWGT ⚙ → Settings → sometimes under “Advanced”).
2. In Tasker, make a global variable `%CYCLESTART` = `1782914400` (that's the epoch seconds for your 2 Jul start — Variables tab → ＋).

**B. Task: `UpdatePhase`** (Tasker → Tasks → ＋)

```
1. Variable Set:   %days   To  (%TIMES - %CYCLESTART)/86400     [Do Maths ✓]
2. Variable Set:   %day    To  floor(%days)%28 + 1              [Do Maths ✓]
3. Variable Set:   %PHASE  To  🩸 Menstrual    If  %day ≤ 5
4. Variable Set:   %PHASE  To  🌱 Follicular   If  %day > 5  & %day ≤ 12
5. Variable Set:   %PHASE  To  ☀️ Ovulatory    If  %day > 12 & %day ≤ 15
6. Variable Set:   %PHASE  To  🍂 Early luteal  If  %day > 15 & %day ≤ 24
7. Variable Set:   %PHASE  To  🌘 Late luteal   If  %day > 24
8. Variable Set:   %CDAY   To  %day
```

`%PHASE` and `%CDAY` are capitalised, so they're **global** and persist for KWGT to read.

**C. Profile: run it daily** (Tasker → Profiles → ＋ → **Time** → 12:05am to 12:05am, or **Event → Date Set**) → link it to `UpdatePhase`. Also long-press the profile and add the same task to run at boot if you like.

**D. Show it in the widget** — KWGT Text item:

```
$tasker(PHASE)$ · Day $tasker(CDAY)$
```

**E. One-tap "new cycle" button** — make a Tasker task `NewCycle`:

```
1. Variable Set:  %CYCLESTART  To  %TIMES
2. Perform Task:  UpdatePhase
```

Add it as a **Tasker Task shortcut/widget** on your home screen (or a KWGT touch action → Tasker Task → NewCycle). When your period starts, tap it once — day resets to 1 and the widget updates instantly. That's the same job the app's check-in does, mirrored to your widget.

*(Option 2 assumes a 28-day cycle for the phase maths, like the calendar bands. The My Week app stays your always-accurate source and self-corrects via its check-in; this just mirrors the current phase onto the home screen with no upkeep.)*

---

## Colors (to match the dashboard)

Tap a text item → **Color**:

- Office days: deep blue `#43617F`
- Home days: green `#3F6F5C`
- Weekend: amber `#8A5F3C`

To make the headline auto-recolor by day-type, set the text **Color** field to a formula instead of a fixed swatch:

```
$if(df(EEEE)=Monday|df(EEEE)=Wednesday|df(EEEE)=Friday, #FF43617F, if(df(EEEE)=Tuesday|df(EEEE)=Thursday, #FF3F6F5C, #FF8A5F3C))$
```

(KWGT colors are `#AARRGGBB` — the `FF` prefix is full opacity.)

---

## Two things to check

1. **Day-name language.** `df(EEEE)` returns the day in your phone's language. If your phone isn't in English, swap `Monday`/`Tuesday`/etc. for your local spellings.
2. **Refresh.** In the KWGT editor, set the widget's update interval (Global settings → often "1 min") so the "right now" line stays current. Time-based text updates on its own tick.

---

## Lock screen / Always-On Display

KWGT widgets live on the **home screen**. Samsung doesn't allow custom third-party widgets on the true lock screen or Always-On Display. For a persistent lock-screen presence, use the **calendar reminders** instead — imported calendar events with alarms show on the lock screen and AOD natively. The KWGT widget is your home-screen "at a glance"; the calendar is your lock-screen + notification layer. Together they cover both.
