# McCandless Automotive Services website

Simple static site, live at https://cdelvaux10.github.io/ex/

## Before going live
Edit the `SHOP` block at the top of `script.js`:
- `phone`, `email` (where service requests go), `address`, `mapQuery` are **placeholders**
- `hours` (index 0 = Sunday, `null` = closed)

Replace the three sample reviews in `index.html` with real ones.

## Republish
From the repo root:

    git subtree split --prefix site -b tmp && git push -f origin tmp:gh-pages && git branch -D tmp
