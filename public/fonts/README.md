# Custom Fonts Directory

Place your Geograph font files in this directory (`public/fonts/`):

- `geograph-regular.woff2` (Recommended)
- `geograph-regular.woff`
- `geograph-regular.ttf`

The application is configured in `src/app/globals.css` with `@font-face` rules that check:
1. Local system-installed font (`geograph-regular`, `Geograph Regular`, `Geograph`)
2. Webfont files placed in `/fonts/geograph-regular.*`
3. Fallback geometric sans-serif fonts
