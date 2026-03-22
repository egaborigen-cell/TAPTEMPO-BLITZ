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

## Building for the Web

### Standard Build (Server-Side Support)
Since this app uses Genkit and Server Actions for AI level generation, a standard Node.js environment is recommended for deployment (e.g., Firebase App Hosting, Vercel).

1. **Create Production Build**:
   ```bash
   npm run build
   ```
2. **Test Production Locally**:
   ```bash
   npm run start
   ```

### Static Export (Optional)
If you require a completely static build (a folder of HTML/CSS/JS files) for platforms that do not support Node.js:

1. **Note**: GenAI features (level generation) will fail in a static export because they rely on server-side logic. You would need to refactor the AI flows to call a remote API endpoint instead of using `'use server'`.
2. **Update Config**: In `next.config.ts`, add `output: 'export'`.
3. **Build**: Run `npm run build`.
4. **Output**: The files will be generated in the `out/` directory.

## Deployment

### Firebase App Hosting (Recommended)
This project is pre-configured for Firebase.

1. Initialize Firebase in your project: `firebase init`.
2. Select **App Hosting**.
3. Connect your GitHub repository.
4. Set the `GOOGLE_GENAI_API_KEY` in the Firebase Console under the App Hosting environment secrets.
5. Push your code to deploy.

### Yandex Games Platform
1. Ensure the Yandex Games SDK script is properly loaded (included in `src/app/layout.tsx`).
2. Zip the contents of your build output.
3. Upload the ZIP to the Yandex Games Developer Console.
4. If using a static ZIP, ensure all paths are relative or use a custom export configuration.

## Project Structure

- `src/ai/`: Genkit flows and AI logic.
- `src/components/game/`: Core game engine and UI components.
- `src/app/`: Next.js pages and layouts.
- `public/`: Static assets.
