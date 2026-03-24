# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**VolAir Airlines** — a Hebrew-language (RTL) flight booking web app. Pure static HTML/CSS/JS with no build system, no npm, no frameworks.

To run locally, open `index.html` in a browser or serve via any static file server:
```bash
npx serve .
# or
python -m http.server 8080
```

## Architecture

### Tech Stack
- Vanilla HTML5 / CSS3 / JavaScript (ES6+)
- No frameworks, no transpilation, no build step
- Google Fonts (Inter) loaded from CDN
- All UI text in Hebrew (RTL: `lang="he" dir="rtl"`)

### File Layout
- `js/app.js` — single monolithic JS file (~620 lines) containing all page logic
- `css/style.css` — complete design system with CSS custom properties
- One HTML file per page in the root directory

### Booking Flow (6 steps, each a separate HTML file)
```
flights.html → results.html → seats.html → summary.html → payment.html → confirmation.html
```
State is persisted across pages via `sessionStorage` using `saveState()` / `loadState()`.

### State Object
```javascript
const STATE = {
  tripType, departure, returnDate,
  passengers: { adults, teens, children },
  selectedFlight,         // 'VA101' | 'VA203' | 'VA315'
  extras: { luggage, priority, drinks },
  selectedSeats,          // array of seat IDs e.g. ['3A', '3B']
  contact: { email, phone },
  paymentMethod,
  totalPrice,
  bookingRef
};
```

### app.js Structure
Each HTML page has a corresponding `init*Page()` function called on `DOMContentLoaded`. Shared utilities at the top:
- `$(s)` / `$$(s)` — DOM query shortcuts
- `formatPrice(n)` — formats as €X.XX
- `showToast(msg, type)` — toast notifications
- `showError(input, msg)` — form validation feedback
- `generateRef()` — creates booking reference (VA + 6 alphanumerics)

### Pricing Logic
```javascript
totalPrice = (BASE_PRICES[selectedFlight] + extrasTotal) * totalPassengers
// BASE_PRICES: { VA101: 120, VA203: 95, VA315: 145 }
// EXTRA_PRICES: { luggage: 35, priority: 15, drinks: 25 }
```

### Seat Map
20 rows × 6 columns (3+3 with aisle). Rows 1–3 are business class visually. 29 seats are pre-occupied (`TAKEN` array in app.js). Seat count must match passenger count to proceed.

### CSS Design System
Custom properties in `:root`:
- Primary: `#00B5C8` (turquoise), Secondary: `#7ED321` (lime)
- Dark bg: `#0A1628` (navy), Body bg: `#F4FBFC` (light blue)
- Font: Inter (Google Fonts)
- Responsive breakpoints: 768px (tablet), 1024px (desktop)

## Key Conventions
- All pages link `css/style.css` and `js/app.js` from root-relative paths (`css/` and `js/`)
- Images expected in `images/` directory; SVG fallbacks used when missing
- No testing framework exists
