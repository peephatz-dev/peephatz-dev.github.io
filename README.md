# Peeraphat — Personal orbit

A buildless, responsive link-in-bio and project portfolio. No installation or build step required.

Run locally from this folder:

```sh
python3 -m http.server 4173 --directory dist
```

Open `http://localhost:4173`. Files served are in `dist/`. Change project content and links in `dist/app.js`, page copy in `dist/index.html`, and presentation in `dist/styles.css`.

Features: five featured links; six projects with category filters; accessible native project dialogs; email copy with honest error feedback; Bangkok local time; responsive layouts; keyboard focus and reduced-motion support.

Project facts and destinations use the user-provided material. Short links are reproduced as supplied. There is no invented GitHub or LINE contact. MODHEW artwork is supplied by the user. The chrome orbit artwork was made with built-in imagegen; prompt and design tokens are in `DESIGN.md`.

The Sites hosting manifest is in `.openai/hosting.json`.
