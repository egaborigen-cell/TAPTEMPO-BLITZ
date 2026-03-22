'use server';
/**
 * @fileOverview A Genkit flow that dynamically generates unique and varied tap patterns
 * and visual sequences for a hypercasual rhythm game.
 *
 * - generateTapPatterns - A function that generates tap patterns based on difficulty and duration.
 * - DynamicTapPatternGenerationInput - The input type for the generateTapPatterns function.
 * - DynamicTapPatternGenerationOutput - The return type for the generateTapPatterns function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DynamicTapPatternGenerationInputSchema = z.object({
  difficultyLevel: z
    .number()
    .int()
    .min(1)
    .max(10)
    .describe('The desired difficulty level for the patterns (1-10, 1 being easiest, 10 being hardest).'),
  durationSeconds: z
    .number()
    .int()
    .min(10)
    .max(180)
    .describe('The desired duration of the pattern sequence in seconds (10-180 seconds).'),
});
export type DynamicTapPatternGenerationInput = z.infer<
  typeof DynamicTapPatternGenerationInputSchema
>;

const DynamicTapPatternGenerationOutputSchema = z.object({
  patterns: z
    .array(
      z.object({
        timeMs: z
          .number()
          .int()
          .min(0)
          .describe(
            'The time in milliseconds from the start of the game when this event should occur.'
          ),
        type: z
          .enum(['tap', 'hold'])
          .describe('The type of tap event. "tap" for a quick touch, "hold" for a sustained touch.'),
        positionX: z
          .number()
          .min(0)
          .max(1)
          .describe(
            'The horizontal position of the visual cue, normalized between 0 (left edge) and 1 (right edge).'
          ),
        positionY: z
          .number()
          .min(0)
          .max(1)
          .describe(
            'The vertical position of the visual cue, normalized between 0 (top edge) and 1 (bottom edge).'
          ),
        visualHint: z
          .enum(['circle', 'square', 'star', 'diamond'])
          .describe('A simple visual shape for the cue.'),
      })
    )
    .describe('An array of tap events forming the game pattern.'),
});
export type DynamicTapPatternGenerationOutput = z.infer<
  typeof DynamicTapPatternGenerationOutputSchema
>;

export async function generateTapPatterns(
  input: DynamicTapPatternGenerationInput
): Promise<DynamicTapPatternGenerationOutput> {
  return dynamicTapPatternGenerationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dynamicTapPatternPrompt',
  input: { schema: DynamicTapPatternGenerationInputSchema },
  output: { schema: DynamicTapPatternGenerationOutputSchema },
  prompt: `You are an AI assistant tasked with generating unique and engaging tap patterns for a hypercasual rhythm game.
Generate a sequence of tap events based on the provided difficulty level and desired duration.
Ensure the patterns are varied, challenging, and suitable for a fast-paced rhythm game.
Higher difficulty levels should result in more frequent, complex (e.g., more hold notes, closer timings), and spatially diverse patterns.

Input:
Difficulty Level: {{{difficultyLevel}}} (1-10, 1 being easiest, 10 being hardest)
Duration in Seconds: {{{durationSeconds}}}

Output should be a JSON array of tap events, where each event has:
- 'timeMs': The time in milliseconds from the start of the game when this event should occur. Must be a non-negative integer.
- 'type': The type of tap event. Must be either 'tap' (a quick touch) or 'hold' (a sustained touch).
- 'positionX': The horizontal position of the visual cue, normalized between 0 (left edge) and 1 (right edge).
- 'positionY': The vertical position of the visual cue, normalized between 0 (top edge) and 1 (bottom edge).
- 'visualHint': A simple visual shape for the cue. Must be one of 'circle', 'square', 'star', 'diamond'.

Generate patterns that are visually dynamic across the screen. For 'hold' events, consider adding a slight delay before the next event to give the player time to release.
The number of events should correspond to the difficulty and duration. For example, a 30-second duration on difficulty 5 might have around 60-100 events, while a 30-second duration on difficulty 1 might have 30-50 events. Ensure the timeMs values are strictly increasing.`,
});

const dynamicTapPatternGenerationFlow = ai.defineFlow(
  {
    name: 'dynamicTapPatternGenerationFlow',
    inputSchema: DynamicTapPatternGenerationInputSchema,
    outputSchema: DynamicTapPatternGenerationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
