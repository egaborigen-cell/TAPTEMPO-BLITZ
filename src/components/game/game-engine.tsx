"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { generateProceduralPatterns, type TapEvent } from "@/lib/level-generator";
import { GameHUD } from "./game-hud";
import { TapCue } from "./tap-cue";
import { Button } from "@/components/ui/button";
import { RotateCcw, Play, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type GameState = 'start' | 'loading' | 'playing' | 'gameover';

declare global {
  interface Window {
    YaGames?: any;
    ysdk?: any;
  }
}

export function GameEngine() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [patterns, setPatterns] = useState<TapEvent[]>([]);
  const [activeCues, setActiveCues] = useState<any[]>([]);
  const { toast } = useToast();

  const gameTimeRef = useRef(0);
  const rafRef = useRef<number>(null);
  const patternIndexRef = useRef(0);
  const startTimeRef = useRef<number>(null);

  // Yandex Games SDK Initialization
  useEffect(() => {
    if (typeof window !== 'undefined' && window.YaGames) {
      window.YaGames.init().then((ysdk: any) => {
        window.ysdk = ysdk;
        ysdk.getPlayer().then((player: any) => {
          console.log('Player initialized', player.getName());
        }).catch((err: any) => {
          console.log('Player not authorized', err);
        });
      }).catch((err: any) => {
        console.error('Yandex SDK failed', err);
      });
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('tap-tempo-highscore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const saveHighScore = (newScore: number) => {
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('tap-tempo-highscore', newScore.toString());
      if (window.ysdk) {
        window.ysdk.getLeaderboards().then((lb: any) => {
          lb.setLeaderboardScore('top_scores', newScore);
        }).catch((err: any) => console.log('LB Error', err));
      }
    }
  };

  const loadLevel = (lvl: number) => {
    setGameState('loading');
    // Simulate generation time for feel
    setTimeout(() => {
      try {
        const result = generateProceduralPatterns(
          Math.min(lvl, 10),
          30 + (lvl * 2)
        );
        setPatterns(result.patterns);
        setGameState('playing');
        patternIndexRef.current = 0;
        gameTimeRef.current = 0;
        startTimeRef.current = performance.now();
        setActiveCues([]);
      } catch (error) {
        toast({ title: "Failed to generate patterns", variant: "destructive" });
        setGameState('start');
      }
    }, 800);
  };

  const gameLoop = useCallback((time: number) => {
    if (gameState !== 'playing') return;
    
    if (!startTimeRef.current) startTimeRef.current = time;
    const elapsed = time - startTimeRef.current;
    gameTimeRef.current = elapsed;

    while (
      patternIndexRef.current < patterns.length &&
      patterns[patternIndexRef.current].timeMs <= elapsed
    ) {
      const p = patterns[patternIndexRef.current];
      setActiveCues(prev => [...prev, { ...p, id: Date.now() + Math.random() }]);
      patternIndexRef.current++;
    }

    if (patternIndexRef.current >= patterns.length && activeCues.length === 0) {
      if (patterns.length > 0) {
        const nextLvl = level + 1;
        setLevel(nextLvl);
        loadLevel(nextLvl);
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
  };

  const handleMiss = (id: number) => {
    setActiveCues(prev => prev.filter(c => c.id !== id));
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
              Master the rhythm in this high-speed blitz. Optimized for static play.
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
          <span className="text-xl font-bold text-primary tracking-widest uppercase">Preparing Sequence...</span>
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
              lifetimeMs={1200 - (level * 50)}
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
