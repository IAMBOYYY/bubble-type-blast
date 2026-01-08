import { useState, useEffect, useCallback, useRef } from 'react';
import { Bubble, BubbleColor, BubbleDuration, GameState, LEVEL_CONFIGS, BUBBLE_COLORS } from '@/types/game';

const STORAGE_KEY = 'typing-game-best';

// Generate unique ID for bubbles
const generateId = () => Math.random().toString(36).substring(2, 9);

// Get random character based on level
const getRandomChar = (characters: string): string => {
  return characters[Math.floor(Math.random() * characters.length)];
};

// Get random bubble color
const getRandomColor = (): BubbleColor => {
  return BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
};

// Get random position avoiding edges and HUD areas
const getRandomPosition = (): { x: number; y: number } => {
  const padding = 80;
  const topPadding = 140;
  const bottomPadding = 160;
  
  return {
    x: padding + Math.random() * (window.innerWidth - padding * 2 - 80),
    y: topPadding + Math.random() * (window.innerHeight - topPadding - bottomPadding - 80),
  };
};

// Load best scores from localStorage
const loadBestScores = (): { bestScore: number; bestLevel: number } => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load best scores:', e);
  }
  return { bestScore: 0, bestLevel: 1 };
};

// Save best scores to localStorage
const saveBestScores = (bestScore: number, bestLevel: number) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ bestScore, bestLevel }));
  } catch (e) {
    console.error('Failed to save best scores:', e);
  }
};

export const useTypingGame = (bubbleDuration: BubbleDuration) => {
  const { bestScore: savedBestScore, bestLevel: savedBestLevel } = loadBestScores();
  
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isPaused: false,
    score: 0,
    level: 1,
    bubbles: [],
    bestScore: savedBestScore,
    bestLevel: savedBestLevel,
  });

  const spawnIntervalRef = useRef<number | null>(null);
  const bubbleTimersRef = useRef<Map<string, number>>(new Map());

  // Get current level config
  const getCurrentLevelConfig = useCallback(() => {
    const level = gameState.level;
    return LEVEL_CONFIGS.find(c => c.level === level) || LEVEL_CONFIGS[LEVEL_CONFIGS.length - 1];
  }, [gameState.level]);

  // Calculate progress to next level
  const getProgress = useCallback(() => {
    const currentConfig = getCurrentLevelConfig();
    const nextConfig = LEVEL_CONFIGS.find(c => c.level === currentConfig.level + 1);
    
    if (!nextConfig) return 100; // Max level reached
    
    const pointsInLevel = gameState.score - currentConfig.pointsRequired;
    const pointsNeeded = nextConfig.pointsRequired - currentConfig.pointsRequired;
    
    return Math.min(100, (pointsInLevel / pointsNeeded) * 100);
  }, [gameState.score, getCurrentLevelConfig]);

  // Check and update level
  const checkLevelUp = useCallback((newScore: number) => {
    for (let i = LEVEL_CONFIGS.length - 1; i >= 0; i--) {
      if (newScore >= LEVEL_CONFIGS[i].pointsRequired) {
        return LEVEL_CONFIGS[i].level;
      }
    }
    return 1;
  }, []);

  // Spawn a new bubble
  const spawnBubble = useCallback(() => {
    setGameState(prev => {
      if (prev.isPaused || !prev.isPlaying) return prev;
      
      const config = LEVEL_CONFIGS.find(c => c.level === prev.level) || LEVEL_CONFIGS[0];
      
      // Don't spawn if at max bubbles
      if (prev.bubbles.length >= config.maxBubbles) return prev;
      
      const { x, y } = getRandomPosition();
      const newBubble: Bubble = {
        id: generateId(),
        char: getRandomChar(config.characters),
        x,
        y,
        color: getRandomColor(),
        duration: bubbleDuration * 1000,
        createdAt: Date.now(),
      };

      return {
        ...prev,
        bubbles: [...prev.bubbles, newBubble],
      };
    });
  }, [bubbleDuration]);

  // Remove bubble by ID
  const removeBubble = useCallback((id: string, isSuccess: boolean = false) => {
    // Clear the timer for this bubble
    const timer = bubbleTimersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      bubbleTimersRef.current.delete(id);
    }

    setGameState(prev => {
      const newBubbles = prev.bubbles.filter(b => b.id !== id);
      
      if (isSuccess) {
        const pointsEarned = 10;
        const newScore = prev.score + pointsEarned;
        const newLevel = checkLevelUp(newScore);
        
        // Update best scores
        const newBestScore = Math.max(newScore, prev.bestScore);
        const newBestLevel = Math.max(newLevel, prev.bestLevel);
        
        if (newBestScore > prev.bestScore || newBestLevel > prev.bestLevel) {
          saveBestScores(newBestScore, newBestLevel);
        }

        return {
          ...prev,
          bubbles: newBubbles,
          score: newScore,
          level: newLevel,
          bestScore: newBestScore,
          bestLevel: newBestLevel,
        };
      }
      
      return {
        ...prev,
        bubbles: newBubbles,
      };
    });
  }, [checkLevelUp]);

  // Handle key press
  const handleKeyPress = useCallback((key: string) => {
    setGameState(prev => {
      if (!prev.isPlaying || prev.isPaused) return prev;
      
      // Find bubble with matching character
      const matchingBubble = prev.bubbles.find(b => b.char === key);
      
      if (matchingBubble) {
        // Will be handled by removeBubble with animation
        setTimeout(() => removeBubble(matchingBubble.id, true), 0);
      }
      
      return prev;
    });
  }, [removeBubble]);

  // Start game
  const startGame = useCallback(() => {
    // Clear all existing timers
    bubbleTimersRef.current.forEach(timer => clearTimeout(timer));
    bubbleTimersRef.current.clear();
    
    if (spawnIntervalRef.current) {
      clearInterval(spawnIntervalRef.current);
    }

    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      isPaused: false,
      score: 0,
      level: 1,
      bubbles: [],
    }));
  }, []);

  // Pause game
  const pauseGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPaused: true,
    }));
  }, []);

  // Resume game
  const resumeGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPaused: false,
    }));
  }, []);

  // Stop game
  const stopGame = useCallback(() => {
    // Clear all timers
    bubbleTimersRef.current.forEach(timer => clearTimeout(timer));
    bubbleTimersRef.current.clear();
    
    if (spawnIntervalRef.current) {
      clearInterval(spawnIntervalRef.current);
    }

    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      bubbles: [],
    }));
  }, []);

  // Set up bubble expiration timers
  useEffect(() => {
    gameState.bubbles.forEach(bubble => {
      if (!bubbleTimersRef.current.has(bubble.id)) {
        const timeLeft = bubble.duration - (Date.now() - bubble.createdAt);
        if (timeLeft > 0) {
          const timer = window.setTimeout(() => {
            removeBubble(bubble.id, false);
          }, timeLeft);
          bubbleTimersRef.current.set(bubble.id, timer);
        }
      }
    });
  }, [gameState.bubbles, removeBubble]);

  // Spawn bubbles at interval
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused) {
      const config = getCurrentLevelConfig();
      
      // Spawn initial bubble
      spawnBubble();
      
      spawnIntervalRef.current = window.setInterval(() => {
        spawnBubble();
      }, config.spawnInterval);

      return () => {
        if (spawnIntervalRef.current) {
          clearInterval(spawnIntervalRef.current);
        }
      };
    }
  }, [gameState.isPlaying, gameState.isPaused, gameState.level, spawnBubble, getCurrentLevelConfig]);

  // Keyboard event listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input or game not active
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if (gameState.isPlaying && !gameState.isPaused) {
        handleKeyPress(e.key);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [gameState.isPlaying, gameState.isPaused, handleKeyPress]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      bubbleTimersRef.current.forEach(timer => clearTimeout(timer));
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
      }
    };
  }, []);

  return {
    gameState,
    startGame,
    pauseGame,
    resumeGame,
    stopGame,
    removeBubble,
    getProgress,
    getCurrentLevelConfig,
  };
};
