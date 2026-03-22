# TapTempo Blitz | Rhythm Mastery

A hypercasual rhythm game where speed meets precision. This project uses Next.js, Genkit for AI-driven level generation, and integrates the Yandex Games SDK.

## Features

- **Dynamic Level Generation**: Uses Google Gemini (via Genkit) to generate unique tap patterns based on difficulty.
- **Responsive Gameplay**: Optimized for mobile portrait devices with a clean, modern UI using ShadCN and Tailwind CSS.
- **Yandex Games Ready**: Pre-configured with Yandex Games SDK for leaderboards and player data.
- **High Performance**: Built with the Next.js App Router for optimal speed.

## Prerequisites

- **Node.js**: Version 18.x or later.
- **API Key**: A Google AI API Key is required for the GenAI level generation features.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Create a `.env` file in the root directory and add your Google AI API key:
   ```env
   GOOGLE_GENAI_API_KEY=your_api_key_here
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Access the game at `http://localhost:9002`.

## Build Options

### 1. Standard Production Build (Recommended)
This build supports all features, including the Server Actions used for GenAI level generation. This is ideal for platforms like Vercel, Firebase App Hosting, or any Node.js environment.

1. **Build**:
   ```bash
   npm run build
   ```
2. **Start**:
   ```bash
   npm run start
   ```

### 2. Completely Static Export (HTML/CSS/JS)
Use this option if you are deploying to a platform that **does not support Node.js** (e.g., standard GitHub Pages, basic S3 bucket, or a ZIP-based static game portal).

**⚠️ Important Note on AI Features:**
Next.js Server Actions (like `generateTapPatterns`) and Genkit flows require a server environment. In a static export:
- The AI level generation will **not work** out of the box because there is no server to run the logic.
- You would need to host the Genkit logic as a separate cloud function or API and update `src/components/game/game-engine.tsx` to call that external API instead of the Server Action.

**Steps to Export:**
1. **Update Config**: Open `next.config.ts` and add `output: 'export'`:
   ```ts
   const nextConfig: NextConfig = {
     output: 'export',
     // ... other options
   };
   ```
2. **Handle Images**: If you use `next/image`, you may need to disable the default optimization or use a custom loader since the optimization API requires a server.
3. **Build**:
   ```bash
   npm run build
   ```
4. **Locate Files**: All static files will be generated in the `out/` directory. This folder contains the index.html and all assets needed for the game.

## Deployment

### Yandex Games Platform
1. Create a static export (as described above).
2. Zip the contents of the `out/` directory.
3. Upload the ZIP to the Yandex Games Developer Console.
4. Ensure the Yandex Games SDK script is properly loaded (pre-configured in `src/app/layout.tsx`).

### Firebase App Hosting
1. Ensure your repository is connected to Firebase App Hosting.
2. Standard builds are handled automatically via the `apphosting.yaml` and the repository structure.

## Project Structure

- `src/ai/`: Genkit flows and AI logic.
- `src/components/game/`: Core game engine and UI components.
- `src/app/`: Next.js pages and layouts.
- `public/`: Static assets.
