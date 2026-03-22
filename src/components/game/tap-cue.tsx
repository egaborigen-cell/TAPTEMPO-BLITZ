
"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TapCueProps {
  id: number;
  type: 'tap' | 'hold';
  positionX: number;
  positionY: number;
  visualHint: 'circle' | 'square' | 'star' | 'diamond';
  onTap: (id: number) => void;
  onMiss: (id: number) => void;
  lifetimeMs: number;
}

export function TapCue({ id, type, positionX, positionY, visualHint, onTap, onMiss, lifetimeMs }: TapCueProps) {
  const [opacity, setOpacity] = useState(0);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    // Fade in and grow
    requestAnimationFrame(() => {
      setOpacity(1);
      setScale(1);
    });

    const timer = setTimeout(() => {
      onMiss(id);
    }, lifetimeMs);

    return () => clearTimeout(timer);
  }, [id, lifetimeMs, onMiss]);

  const shapes = {
    circle: "rounded-full",
    square: "rounded-xl",
    star: "clip-star", // Requires custom clip path or SVG
    diamond: "rotate-45"
  };

  const getShape = () => {
    switch (visualHint) {
      case 'star':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full text-white fill-current">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        );
      case 'diamond':
        return <div className="w-12 h-12 bg-white rotate-45 rounded-sm" />;
      case 'square':
        return <div className="w-12 h-12 bg-white rounded-lg" />;
      default:
        return <div className="w-14 h-14 bg-white rounded-full" />;
    }
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onTap(id);
      }}
      className={cn(
        "absolute flex items-center justify-center transition-all duration-300 ease-out z-20",
        "w-20 h-20 bg-primary/20 backdrop-blur-sm border-4 border-primary rounded-full hover:scale-110 active:scale-95 group",
        "animate-pulse-glow"
      )}
      style={{
        left: `${positionX * 85 + 7.5}%`,
        top: `${positionY * 80 + 10}%`,
        opacity: opacity,
        transform: `scale(${scale})`,
      }}
    >
      <div className="w-12 h-12 flex items-center justify-center pointer-events-none group-active:scale-110 transition-transform">
        {getShape()}
      </div>
      {/* Outer ring closing in */}
      <div 
        className="absolute inset-0 rounded-full border-2 border-accent opacity-60"
        style={{
          animation: `shrink ${lifetimeMs}ms linear forwards`
        }}
      />
      <style jsx>{`
        @keyframes shrink {
          from { transform: scale(1.8); opacity: 0; }
          20% { opacity: 0.6; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </button>
  );
}
