
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { generateTapPatterns, type DynamicTapPatternGenerationOutput } from "@/ai/flows/dynamic-tap-pattern-generation";
import { GameHUD } from "./game-hud";
import { TapCue } from "./tap-cue";
import { Button } from "@/components/ui/button";
import { RotateCcw, Play, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type GameState = 'start' | 'loading' | 'playing' | 'gameover';

export function GameEngine() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [patterns, setPatterns] = useState<DynamicTapPatternGenerationOutput['patterns']>([]);
  const [activeCues, setActiveCues] = useState<any[]>([]);
  const { toast } = useToast();

  const gameTimeRef = useRef(0);
  const rafRef = useRef<number>(null);
  const patternIndexRef = useRef(0);
  const startTimeRef = useRef<number>(null);

  useEffect(() => {
    const saved = localStorage.getItem('tap-tempo-highscore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const saveHighScore = (newScore: number) => {
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('tap-tempo-highscore', newScore.toString());
    }
  };

  const loadLevel = async (lvl: number) => {
    setGameState('loading');
    try {
      // Adaptive parameter generation via GenAI
      const result = await generateTapPatterns({
        difficultyLevel: Math.min(lvl, 10),
        durationSeconds: 30 + (lvl * 5) // Increase duration with level
      });
      setPatterns(result.patterns);
      setGameState('playing');
      patternIndexRef.current = 0;
      gameTimeRef.current = 0;
      startTimeRef.current = performance.now();
      setActiveCues([]);
    } catch (error) {
      toast({ title: "Failed to load Blitz", variant: "destructive" });
      setGameState('start');
    }
  };

  const gameLoop = useCallback((time: number) => {
    if (gameState !== 'playing') return;
    
    if (!startTimeRef.current) startTimeRef.current = time;
    const elapsed = time - startTimeRef.current;
    gameTimeRef.current = elapsed;

    // Check if new patterns need to spawn
    while (
      patternIndexRef.current < patterns.length &&
      patterns[patternIndexRef.current].timeMs <= elapsed
    ) {
      const p = patterns[patternIndexRef.current];
      setActiveCues(prev => [...prev, { ...p, id: Date.now() + Math.random() }]);
      patternIndexRef.current++;
    }

    // End condition
    if (patternIndexRef.current >= patterns.length && activeCues.length === 0) {
      // Level completed
      if (patterns.length > 0) {
        setLevel(prev => prev + 1);
        loadLevel(level + 1);
        return;
      }
    }

    rafRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, patterns, level, activeCues.length]);

  useEffect(() => {
    if (gameState === 'playing') {
      rafRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [gameState, gameLoop]);

  const handleTap = (id: number) => {
    setScore(prev => prev + (100 * level));
    setActiveCues(prev => prev.filter(c => c.id !== id));
    // Visual feedback handled in component
  };

  const handleMiss = (id: number) => {
    setActiveCues(prev => prev.filter(c => c.id !== id));
    // Game over on miss for hypercasual "Blitz" feel
    setGameState('gameover');
    saveHighScore(score);
  };

  const restart = () => {
    setScore(0);
    setLevel(1);
    loadLevel(1);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-accent to-transparent" />
      </div>

      <GameHUD score={score} highScore={highScore} level={level} />

      {gameState === 'start' && (
        <div className="z-20 flex flex-col items-center gap-8 p-12 bg-white/40 backdrop-blur-xl rounded-[3rem] border border-white/50 shadow-2xl animate-in zoom-in-95 fade-in duration-500">
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full" />
            <Zap className="w-24 h-24 text-primary relative" />
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-black font-headline tracking-tighter text-slate-900">
              TAPTEMPO <span className="text-primary">BLITZ</span>
            </h1>
            <p className="text-slate-500 font-medium max-w-xs mx-auto">
              Tap the shapes in time with the rhythm. Don't miss a single beat.
            </p>
          </div>
          <Button 
            size="lg" 
            onClick={() => loadLevel(1)}
            className="h-20 px-12 rounded-full text-2xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95 group"
          >
            <Play className="w-8 h-8 mr-3 fill-current group-hover:translate-x-1 transition-transform" />
            START BLITZ
          </Button>
        </div>
      )}

      {gameState === 'loading' && (
        <div className="z-20 flex flex-col items-center gap-4 animate-pulse">
          <Zap className="w-16 h-16 text-primary animate-bounce" />
          <span className="text-xl font-bold text-primary tracking-widest uppercase">Generating Level...</span>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="relative w-full h-full max-w-4xl mx-auto">
          {activeCues.map(cue => (
            <TapCue
              key={cue.id}
              id={cue.id}
              type={cue.type}
              positionX={cue.positionX}
              positionY={cue.positionY}
              visualHint={cue.visualHint}
              onTap={handleTap}
              onMiss={handleMiss}
              lifetimeMs={1200 - (level * 50)} // Adaptive difficulty: less time as level increases
            />
          ))}
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="z-20 flex flex-col items-center gap-8 p-12 bg-white/60 backdrop-blur-xl rounded-[3rem] border border-white/50 shadow-2xl animate-in slide-in-from-bottom-10 duration-500">
          <div className="text-center space-y-4">
            <h2 className="text-6xl font-black font-headline tracking-tighter text-slate-900">
              GAME <span className="text-destructive">OVER</span>
            </h2>
            <div className="space-y-1">
              <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Final Score</p>
              <p className="text-7xl font-black text-primary drop-shadow-sm">{score.toLocaleString()}</p>
            </div>
            {score >= highScore && score > 0 && (
              <div className="bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-bold animate-bounce mt-4">
                🎉 NEW ALL-TIME HIGH SCORE!
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-4 w-full">
            <Button 
              size="lg" 
              onClick={restart}
              className="h-16 rounded-full text-xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all"
            >
              <RotateCcw className="w-6 h-6 mr-3" />
              TRY AGAIN
            </Button>
            <Button 
              variant="outline"
              size="lg" 
              onClick={() => setGameState('start')}
              className="h-16 rounded-full text-xl font-bold border-2 hover:bg-slate-50"
            >
              MAIN MENU
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
