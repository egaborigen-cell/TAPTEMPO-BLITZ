# TapTempo Blitz | Rhythm Mastery

A hypercasual rhythm game where speed meets precision. This project is built with Next.js and optimized for high-performance static builds.

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

## Building for Production

### Standard Next.js Build
Ideal for hosting on platforms like Vercel or Firebase App Hosting.
```bash
npm run build
npm run start
```

### Completely Static Export (HTML/CSS/JS)
Use this for platforms that **do not support Node.js** (e.g., Yandex Games, GitHub Pages, S3).

1. **Update Config**: In `next.config.ts`, ensure you have:
   ```ts
   const nextConfig: NextConfig = {
     output: 'export',
     images: { unoptimized: true }
   };
   ```
2. **Build**:
   ```bash
   npm run build
   ```
3. **Zip and Upload**: The resulting `out/` directory contains all static files. Zip this folder for submission to game portals.

## Pushing to GitHub

To push your local changes to the repository, run the following commands in your terminal:

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
