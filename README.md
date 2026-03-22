# TapTempo Blitz | Rhythm Mastery

A hypercasual rhythm game where speed meets precision. This project is built with Next.js and optimized for high-performance static builds, making it perfect for platforms like Yandex Games.

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
Ideal for hosting on Vercel or Firebase App Hosting.
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

## Project Structure

- `src/lib/level-generator.ts`: The core logic for generating rhythmic patterns.
- `src/components/game/`: Game engine, HUD, and interactive components.
- `src/app/`: Next.js pages and layouts.
