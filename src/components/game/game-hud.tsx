
"use client";

import { Trophy, Zap } from "lucide-react";

interface GameHUDProps {
  score: number;
  highScore: number;
  level: number;
}

export function GameHUD({ score, highScore, level }: GameHUDProps) {
  return (
    <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-none z-10">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md border border-primary/20 px-4 py-2 rounded-2xl shadow-sm">
          <Zap className="w-5 h-5 text-primary fill-primary" />
          <span className="text-xl font-bold font-headline text-primary">
            {score.toLocaleString()}
          </span>
        </div>
        <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground ml-2">
          Current Blitz
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md border border-accent/20 px-4 py-2 rounded-2xl shadow-sm">
          <Trophy className="w-5 h-5 text-accent fill-accent" />
          <span className="text-xl font-bold font-headline text-accent">
            {highScore.toLocaleString()}
          </span>
        </div>
        <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mr-2">
          Best Blitz
        </div>
        <div className="mt-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-tight">
          Lvl {level}
        </div>
      </div>
    </div>
  );
}
