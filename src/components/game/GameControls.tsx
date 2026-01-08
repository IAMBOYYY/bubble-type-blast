import { memo } from 'react';
import { Play, Pause, RotateCcw, Timer, Gauge } from 'lucide-react';
import { BubbleDuration } from '@/types/game';

interface GameControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  bubbleDuration: BubbleDuration;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onDurationChange: (duration: BubbleDuration) => void;
}

export const GameControls = memo(({
  isPlaying,
  isPaused,
  bubbleDuration,
  onStart,
  onPause,
  onResume,
  onStop,
  onDurationChange,
}: GameControlsProps) => {
  return (
    <div className="game-controls">
      <div className="max-w-4xl mx-auto">
        <div className="glass-panel p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Duration selector */}
            <div className="flex items-center gap-3">
              <Timer className="w-5 h-5 text-muted-foreground" />
              <select
                value={bubbleDuration}
                onChange={(e) => onDurationChange(Number(e.target.value) as BubbleDuration)}
                className="select-game"
                disabled={isPlaying}
              >
                <option value={2}>Easy (2s)</option>
                <option value={1}>Medium (1s)</option>
                <option value={0.5}>Hard (0.5s)</option>
              </select>
            </div>

            {/* Game controls */}
            <div className="flex items-center gap-3">
              {!isPlaying ? (
                <button onClick={onStart} className="btn-primary flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Start Game
                </button>
              ) : (
                <>
                  {isPaused ? (
                    <button onClick={onResume} className="btn-primary flex items-center gap-2">
                      <Play className="w-5 h-5" />
                      Resume
                    </button>
                  ) : (
                    <button onClick={onPause} className="btn-secondary flex items-center gap-2">
                      <Pause className="w-5 h-5" />
                      Pause
                    </button>
                  )}
                  <button onClick={onStop} className="btn-secondary flex items-center gap-2">
                    <RotateCcw className="w-5 h-5" />
                    Restart
                  </button>
                </>
              )}
            </div>

            {/* Difficulty indicator */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Gauge className="w-4 h-4" />
              <span className="hidden sm:inline">
                {bubbleDuration === 2 ? 'Relaxed' : bubbleDuration === 1 ? 'Challenging' : 'Intense'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

GameControls.displayName = 'GameControls';
