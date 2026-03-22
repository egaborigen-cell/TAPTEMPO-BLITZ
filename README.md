# TapTempo Blitz | Rhythm Mastery

A hypercasual rhythm game where speed meets precision. This project is built with Next.js and optimized for high-performance static builds (HTML/CSS/JS), perfect for game portals like Yandex Games.

## Repository
[https://github.com/egaborigen-cell/TAPTEMPO-BLITZ.git](https://github.com/egaborigen-cell/TAPTEMPO-BLITZ.git)

## Features

- **Procedural Level Generation**: Unique tap patterns generated on the client for smooth, serverless gameplay.
- **Static Export Ready**: Fully compatible with `next export`. No Node.js server required at runtime.
- **Responsive Gameplay**: Optimized for mobile portrait devices with a clean, modern UI using ShadCN and Tailwind CSS.
- **Yandex Games Ready**: Integrated with Yandex Games SDK for leaderboards and player data.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Access the game at `http://localhost:9002`.

## Building for Production (Static Export)

To generate a completely static folder of HTML, CSS, and JS files (ideal for Yandex Games ZIP uploads):

1. **Build**:
   ```bash
   npm run build
   ```
2. **Result**: The static files will be generated in the `out/` directory.
3. **Zip and Upload**: Zip the contents of the `out/` folder for submission to game portals.

## Pushing to GitHub

To push your local changes to the repository:

```bash
git init
git remote add origin https://github.com/egaborigen-cell/TAPTEMPO-BLITZ.git
git add .
git commit -m "Initial commit of TapTempo Blitz"
git branch -M main
git push -u origin main
```

## Project Structure

- `src/lib/level-generator.ts`: The core logic for generating rhythmic patterns on the client.
- `src/components/game/`: Game engine, HUD, and interactive components.
- `src/app/`: Next.js pages and layouts.
