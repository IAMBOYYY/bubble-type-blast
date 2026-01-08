import { useState, useCallback } from 'react';
import { BubbleDuration } from '@/types/game';
import { useTypingGame } from '@/hooks/useTypingGame';
import { BubbleComponent } from './Bubble';
import { GameHUD } from './GameHUD';
import { GameControls } from './GameControls';
import { StartScreen } from './StartScreen';
import { PauseOverlay } from './PauseOverlay';
import { MobileKeyboard } from './MobileKeyboard';

export const TypingGame = () => {
  const [bubbleDuration, setBubbleDuration] = useState<BubbleDuration>(1);
  
  const {
    gameState,
    startGame,
    pauseGame,
    resumeGame,
    stopGame,
    removeBubble,
    getProgress,
    getCurrentLevelConfig,
  } = useTypingGame(bubbleDuration);

  const handleMobileKeyPress = useCallback((key: string) => {
    // Simulate keydown event for mobile
    const bubble = gameState.bubbles.find(b => b.char === key);
    if (bubble) {
      removeBubble(bubble.id, true);
    }
  }, [gameState.bubbles, removeBubble]);

  const currentConfig = getCurrentLevelConfig();

  return (
    <div className="game-container">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{
            background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)',
            top: '10%',
            left: '10%',
          }}
        />
        <div 
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{
            background: 'radial-gradient(circle, hsl(var(--secondary)) 0%, transparent 70%)',
            bottom: '20%',
            right: '10%',
          }}
        />
        <div 
          className="absolute w-64 h-64 rounded-full blur-3xl opacity-10"
          style={{
            background: 'radial-gradient(circle, hsl(var(--accent)) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      {/* Game HUD - always visible when playing */}
      {gameState.isPlaying && (
        <GameHUD
          score={gameState.score}
          level={gameState.level}
          bestScore={gameState.bestScore}
          bestLevel={gameState.bestLevel}
          progress={getProgress()}
        />
      )}

      {/* Start screen */}
      {!gameState.isPlaying && (
        <StartScreen 
          bestScore={gameState.bestScore} 
          bestLevel={gameState.bestLevel} 
        />
      )}

      {/* Pause overlay */}
      {gameState.isPaused && <PauseOverlay />}

      {/* Bubbles */}
      <div className="absolute inset-0">
        {gameState.bubbles.map(bubble => (
          <BubbleComponent
            key={bubble.id}
            bubble={bubble}
            onExpire={removeBubble}
          />
        ))}
      </div>

      {/* Mobile keyboard */}
      <MobileKeyboard
        isPlaying={gameState.isPlaying}
        isPaused={gameState.isPaused}
        onKeyPress={handleMobileKeyPress}
        characters={currentConfig.characters}
      />

      {/* Game controls */}
      <GameControls
        isPlaying={gameState.isPlaying}
        isPaused={gameState.isPaused}
        bubbleDuration={bubbleDuration}
        onStart={startGame}
        onPause={pauseGame}
        onResume={resumeGame}
        onStop={stopGame}
        onDurationChange={setBubbleDuration}
      />
    </div>
  );
};
