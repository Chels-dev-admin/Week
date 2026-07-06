# Weekly OS — Samsung Home-Screen Widget (KWGT)

A live home-screen widget showing **today's day-type**, **what you're doing right now**, and (optionally) your **cycle phase** — all updating on their own. KWGT can't import the app's HTML, so this rebuilds it with KWGT formulas, copy-paste ready.

---

## ⚠️ The one rule that breaks formulas — no commas

Inside a `$if(...)$`, **KWGT reads a comma as "next argument."** So text like `Cook, plan, rest.` is treated as extra arguments and only a fragment shows (this is why yours displayed just `rest.`).

**In any text a formula returns, don't use commas or parentheses.** Use `·`, `/`, `+`, `–`, or the word "and" instead. Periods, colons and emoji are fine. Every formula below already follows this rule.

Build the **Minimum version** first (day + type), then add the current-block line and phase only if you want them.

---

## One-time setup

1. Install **KWGT Kustom Widget Maker** (free; KWGT **Pro** removes the watermark).
2. Long-press home screen → **Widgets** → **KWGT** → drop a 4×2 widget.
3. Tap it → the KWGT editor opens.
4. **Items → ＋ → Text** for each line below. To paste a formula: tap the item → **Text** tab → the **fx** icon → paste → tick.

---

## 1. Day + type + mode  (KWGT only — reliable)

These use only `df(EEEE)` (the day name), so there's no date maths to go wrong.

**Item 1 — Day name** (big):

```
$df(EEEE)$
```

**Item 2 — Day type** (headline):

```
$if(df(EEEE)=Monday|df(EEEE)=Wednesday|df(EEEE)=Friday, OFFICE DAY, if(df(EEEE)=Tuesday|df(EEEE)=Thursday, HOME DAY, WEEKEND))$
```

**Item 3 — Mode** (subtitle, comma-free):

```
$if(df(EEEE)=Monday|df(EEEE)=Wednesday|df(EEEE)=Friday, Survival + recovery. No study or cooking., if(df(EEEE)=Tuesday|df(EEEE)=Thursday, Workhorse day. Study + exercise + hair wash., if(df(EEEE)=Saturday, Big-movement + errands + Slot B., Reset day. Cook · yoga · plan · rest.)))$
```

---

## 2. What you're doing right now  (KWGT only — reliable)

Time-based, so it advances through the day on its own. It reads the clock as **minutes since midnight** = `df(H)*60+df(m)` and picks the current block. Use **one** Text item with the formula below — it covers all three day-types itself, so **every `if` has a real value** and there are no blank arguments (that empty final slot is what caused the *"argument is missing"* error).

**Paste this as a single Text item:**

```
$if(df(EEEE)=Monday|df(EEEE)=Wednesday|df(EEEE)=Friday, if(df(H)*60+df(m)<300, 😴 Sleep, if(df(H)*60+df(m)<360, 🌅 Animals + walk + hair refresh, if(df(H)*60+df(m)<480, 🚗 Commute, if(df(H)*60+df(m)<960, 💼 Work, if(df(H)*60+df(m)<1080, 🚗 Commute home, if(df(H)*60+df(m)<1100, 🛋️ Decompress – no demands, if(df(H)*60+df(m)<1185, 🐾 Dogs + dinner, if(df(H)*60+df(m)<1200, 🧹 10-min reset, if(df(H)*60+df(m)<1260, 🌙 Wind-down + bonnet, 😴 Bed))))))))), if(df(EEEE)=Tuesday|df(EEEE)=Thursday, if(df(H)*60+df(m)<330, 😴 Sleep, if(df(H)*60+df(m)<405, 🌅 Animals + walk + laundry on, if(df(H)*60+df(m)<480, 💪 Reclaimed block – exercise or study, if(df(H)*60+df(m)<960, 💼 Work, if(df(H)*60+df(m)<1005, 📚 Second block, if(df(H)*60+df(m)<1080, 💧 Hair wash + style, if(df(H)*60+df(m)<1170, 🐾 Dinner + dog walk, if(df(H)*60+df(m)<1200, 🧽 Cleaning zone 15 min, if(df(H)*60+df(m)<1290, 🌙 Wind-down + bonnet, 😴 Bed))))))))), if(df(H)*60+df(m)<420, 😴 Sleep, if(df(H)*60+df(m)<540, 🌅 Animals + hair, if(df(H)*60+df(m)<720, 🏃 Activity / chores, if(df(H)*60+df(m)<960, 🎨 Slot B / study, if(df(H)*60+df(m)<1200, 🍽️ Dinner + walk + rest, if(df(H)*60+df(m)<1290, 🌙 Wind-down + bonnet, 😴 Bed))))))))$
```

*How it reads:* first it checks the day-type (office → home → else weekend), then within that it walks the time thresholds. The very last value, `🌙 Wind-down`, is the weekend "else" — a real value, so nothing is blank.

**Time thresholds used** (edit any to taste — they're minutes since midnight): 300 = 5:00, 330 = 5:30, 360 = 6:00, 405 = 6:45, 420 = 7:00, 480 = 8:00, 540 = 9:00, 720 = 12:00, 960 = 16:00, 1005 = 16:45, 1080 = 18:00, 1100 = 18:20, 1170 = 19:30, 1185 = 19:45, 1200 = 20:00, 1260 = 21:00, 1290 = 21:30.

---

## 3. Cycle phase  (KWGT only — no Tasker, nothing to pay for)

Two options. The **Reliable** one is guaranteed to work today; the **Self-advancing** one never needs date edits *if* your KWGT build supports its two functions — so test it first.

### Option A — Reliable (works right now)

Fixed dates for the current cycle. `df(yyyyMMdd)` turns today into a number like `20260705`; each threshold is the day *after* a phase ends, so the phase changes on its own as days pass. Comma-free, no add-ons.

```
$if(df(yyyyMMdd)<20260707, 🩸 Menstrual, if(df(yyyyMMdd)<20260714, 🌱 Follicular, if(df(yyyyMMdd)<20260717, ☀️ Ovulatory, if(df(yyyyMMdd)<20260726, 🍂 Early luteal, if(df(yyyyMMdd)<20260730, 🌘 Late luteal, 🔄 New cycle – update dates)))))$
```

When it flips to **"New cycle – update dates,"** that's your signal the current cycle's numbers are stale. Refresh them one of two ways: shift each of the five numbers forward by your cycle length, or just tell me your new start date and I'll paste you a fresh block (same moment I realign your calendar bands) — about 30 seconds.

Matching colour (optional):

```
$if(df(yyyyMMdd)<20260707, #FFA8434F, if(df(yyyyMMdd)<20260714, #FF3F6F5C, if(df(yyyyMMdd)<20260717, #FFC8912F, if(df(yyyyMMdd)<20260726, #FFA9784F, #FF6B5B8A))))$
```

### Option B — Self-advancing (never edit dates — if your build supports it)

Computes the phase from one stored start date, so it rolls over on its own. It needs a date-difference function (`dc`) and modulo (`%`), which some KWGT builds handle differently — so **test before trusting it**.

1. KWGT editor → **globals** → ＋ → **Text** global named `cyclestart`, value `2026-07-02`.
2. **Test:** put `$dc(d, gv(cyclestart))$` in a temporary Text item and read it today (5 Jul):
   - Shows **3** (a positive day count) → use the formula below as-is. ✅
   - Shows **-3** (negative) → replace every `dc(d, gv(cyclestart))` with `0-dc(d, gv(cyclestart))`.
   - Shows an **error or blank** → your build doesn't support it; stick with Option A.
3. Phase formula:

```
$if(dc(d, gv(cyclestart))%28<5, 🩸 Menstrual, if(dc(d, gv(cyclestart))%28<12, 🌱 Follicular, if(dc(d, gv(cyclestart))%28<15, ☀️ Ovulatory, if(dc(d, gv(cyclestart))%28<24, 🍂 Early luteal, 🌘 Late luteal))))$
```

When your period starts, change **only** the `cyclestart` global to the new date — the formula never changes.

*(Both assume a 28-day cycle. The My Week app remains your always-accurate source and self-corrects via its check-in; the widget just mirrors the phase to your home screen.)*

---

## Colours (to match the dashboard)

Tap a Text item → **Color**. Fixed colours:

- Office: deep blue `#43617F`  ·  Home: green `#3F6F5C`  ·  Weekend: amber `#8A5F3C`

To auto-recolour the headline by day-type, set the **Color** field to this formula (colour codes have no commas, so they're safe):

```
$if(df(EEEE)=Monday|df(EEEE)=Wednesday|df(EEEE)=Friday, #FF43617F, if(df(EEEE)=Tuesday|df(EEEE)=Thursday, #FF3F6F5C, #FF8A5F3C))$
```

(KWGT colours are `#AARRGGBB` — `FF` = fully opaque.)

---

## Two things to check

1. **Day-name language.** `df(EEEE)` returns the day in your phone's language. If it's not English, swap `Monday`/`Tuesday`/etc. for your local spellings.
2. **Refresh rate.** KWGT global settings → set the update interval to **1 min** so the "right now" line stays current.

---

## Lock screen / Always-On Display

KWGT widgets live on the **home screen** — Samsung doesn't allow custom third-party widgets on the true lock screen or AOD. For a lock-screen presence, lean on your **calendar** (its events show on the lock screen and AOD natively). Home screen = KWGT at-a-glance; lock screen = calendar. Together they cover both.
