# Spider Solitaire

A modern, animated Spider Solitaire built as a web app. Three suit difficulties, undo/hint systems, statistics tracking, and switchable themes.

**Live:** [spider.rinnesoft.com](https://spider.rinnesoft.com)

## Features

- Three difficulty levels — 1, 2, and 4 suits
- Drag & drop or tap-to-move card handling
- Undo, hint, restart, and new game
- Stock dealing with empty-column rule enforcement
- Per-difficulty statistics (games played, win rate, best time, best score)
- Three themes — dark, light, and blue
- Smooth card animations and sound effects
- Keyboard shortcuts: `n` new game, `u` undo, `h` hint, `d` deal

## Tech Stack

- **React** + **TypeScript**
- **Vite** — build tooling
- **Tailwind CSS** + CSS variables — styling and theming
- **Framer Motion** — animations
- **Zustand** + Immer — state management
- **Howler.js** — sound

## Getting Started

```bash
npm install
npm run dev
```

Open [localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
```

Output goes to `dist/`. Deployed automatically to the server via GitHub Actions on every push to `main`.

## Project Structure

```
src/
├── engine/      # Pure game logic — deck, rules, hints
├── store/       # Zustand stores — game, stats, settings
├── hooks/       # Timer, keyboard, sound, drag
├── components/  # UI — board, cards, toolbar, modals
└── styles/      # Theme CSS variables
```

The `engine/` layer has zero UI dependencies, so the game rules can be tested independently of React.

## License

MIT