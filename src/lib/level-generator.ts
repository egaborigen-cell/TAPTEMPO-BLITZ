/**
 * @fileOverview Client-side procedural level generation for TapTempo Blitz.
 * Replaces the server-side AI generation to enable fully static builds.
 */

export type TapEvent = {
  timeMs: number;
  type: 'tap' | 'hold';
  positionX: number;
  positionY: number;
  visualHint: 'circle' | 'square' | 'star' | 'diamond';
};

export type LevelGenerationOutput = {
  patterns: TapEvent[];
};

export function generateProceduralPatterns(difficulty: number, durationSeconds: number): LevelGenerationOutput {
  const patterns: TapEvent[] = [];
  
  // Calculate event density based on difficulty
  // Difficulty 1: ~1.5 taps per second
  // Difficulty 10: ~5-6 taps per second
  const tapsPerSecond = 1.2 + (difficulty * 0.5);
  const totalEvents = Math.floor(durationSeconds * tapsPerSecond);
  
  const shapes: ('circle' | 'square' | 'star' | 'diamond')[] = ['circle', 'square', 'star', 'diamond'];
  
  let currentTimeMs = 500; // Start after a short delay

  for (let i = 0; i < totalEvents; i++) {
    // Determine type: holds become more common as difficulty increases
    const isHold = Math.random() < (0.05 + (difficulty * 0.02));
    
    patterns.push({
      timeMs: Math.floor(currentTimeMs),
      type: isHold ? 'hold' : 'tap',
      positionX: 0.1 + (Math.random() * 0.8), // Keep away from extreme edges
      positionY: 0.1 + (Math.random() * 0.8),
      visualHint: shapes[Math.floor(Math.random() * shapes.length)],
    });

    // Time gap decreases with difficulty
    const baseGap = 1000 / tapsPerSecond;
    const jitter = (Math.random() - 0.5) * (baseGap * 0.4);
    currentTimeMs += baseGap + jitter;
    
    // Add extra time for hold notes
    if (isHold) {
      currentTimeMs += 400; 
    }
  }

  return { patterns };
}
