# McCandless Automotive Services website

Static site: open `index.html` in a browser, or host the `site/` folder anywhere (GitHub Pages, Netlify, etc.).

## Before going live
Edit the `SHOP` block at the top of `script.js`:
- `phone`, `email`, `address`, `mapQuery` are **placeholders**
- `hours` (index 0 = Sunday, `null` = closed)

Also check:
- `SERVICES` prices in `script.js` (sample starting prices)
- The sample reviews in `index.html` (replace with real customer reviews)
- The warranty / shuttle claims in the hero and FAQ

## Features
- Live "open now / opens at" status from the hours table
- Appointment request form styled as a repair order. It validates the fields and blocks closed days, then opens the customer's email app with the details filled in
- Filterable service and price board
- Repair cost estimator with vehicle-type pricing, which can pre-fill the booking form
- Oil-change due-date calculator
- Reviews carousel, FAQ, hours, map, and a click-to-call button on phones
