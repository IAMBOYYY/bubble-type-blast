import { memo } from 'react';
import { Trophy, Star, Zap } from 'lucide-react';

interface GameHUDProps {
  score: number;
  level: number;
  bestScore: number;
  bestLevel: number;
  progress: number;
}

export const GameHUD = memo(({ score, level, bestScore, bestLevel, progress }: GameHUDProps) => {
  return (
    <div className="game-hud px-4 py-4">
      <div className="max-w-4xl mx-auto">
        {/* Main stats */}
        <div className="flex items-center justify-between gap-4 mb-3">
          {/* Level */}
          <div className="stat-card flex-1">
            <div className="flex items-center justify-center gap-2">
              <Star className="w-5 h-5 text-[hsl(var(--bubble-yellow))]" />
              <span className="stat-value text-[hsl(var(--bubble-yellow))]">{level}</span>
            </div>
            <p className="stat-label">Level</p>
          </div>

          {/* Score */}
          <div className="stat-card flex-1">
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-5 h-5 text-[hsl(var(--primary))]" />
              <span className="stat-value text-[hsl(var(--primary))]">{score}</span>
            </div>
            <p className="stat-label">Score</p>
          </div>

          {/* Best */}
          <div className="stat-card flex-1">
            <div className="flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 text-[hsl(var(--accent))]" />
              <span className="stat-value text-[hsl(var(--accent))]">{bestScore}</span>
            </div>
            <p className="stat-label">Best (Lvl {bestLevel})</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-xs text-muted-foreground mt-1">
          Progress to Level {level + 1}
        </p>
      </div>
    </div>
  );
});

GameHUD.displayName = 'GameHUD';
