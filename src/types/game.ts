export interface Bubble {
  id: string;
  char: string;
  x: number;
  y: number;
  color: BubbleColor;
  duration: number;
  createdAt: number;
}

export type BubbleColor = 'cyan' | 'pink' | 'green' | 'yellow' | 'purple';

export type BubbleDuration = 0.5 | 1 | 2;

export interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  score: number;
  level: number;
  bubbles: Bubble[];
  bestScore: number;
  bestLevel: number;
}

export interface LevelConfig {
  level: number;
  pointsRequired: number;
  maxBubbles: number;
  spawnInterval: number;
  characters: string;
}

export const LEVEL_CONFIGS: LevelConfig[] = [
  { level: 1, pointsRequired: 0, maxBubbles: 3, spawnInterval: 2000, characters: 'abcdefghij' },
  { level: 2, pointsRequired: 50, maxBubbles: 4, spawnInterval: 1800, characters: 'abcdefghijklmnop' },
  { level: 3, pointsRequired: 120, maxBubbles: 5, spawnInterval: 1600, characters: 'abcdefghijklmnopqrstuvwxyz' },
  { level: 4, pointsRequired: 200, maxBubbles: 6, spawnInterval: 1400, characters: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJ' },
  { level: 5, pointsRequired: 300, maxBubbles: 7, spawnInterval: 1200, characters: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' },
  { level: 6, pointsRequired: 420, maxBubbles: 8, spawnInterval: 1000, characters: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' },
  { level: 7, pointsRequired: 560, maxBubbles: 9, spawnInterval: 900, characters: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' },
  { level: 8, pointsRequired: 720, maxBubbles: 10, spawnInterval: 800, characters: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' },
  { level: 9, pointsRequired: 900, maxBubbles: 11, spawnInterval: 700, characters: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' },
  { level: 10, pointsRequired: 1100, maxBubbles: 12, spawnInterval: 600, characters: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' },
];

export const BUBBLE_COLORS: BubbleColor[] = ['cyan', 'pink', 'green', 'yellow', 'purple'];
