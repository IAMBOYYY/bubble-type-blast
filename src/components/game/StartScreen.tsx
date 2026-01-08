import { memo } from 'react';
import { Keyboard, Target, Trophy, Zap } from 'lucide-react';

interface StartScreenProps {
  bestScore: number;
  bestLevel: number;
}

export const StartScreen = memo(({ bestScore, bestLevel }: StartScreenProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-40 px-4">
      <div className="glass-panel p-8 md:p-12 max-w-lg w-full text-center">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(var(--secondary))] to-[hsl(var(--accent))] animate-gradient">
          TYPE BURST
        </h1>
        <p className="text-muted-foreground mb-8">Pop bubbles by typing the right keys!</p>

        {/* Instructions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="glass-panel p-4">
            <Keyboard className="w-8 h-8 mx-auto mb-2 text-[hsl(var(--primary))]" />
            <p className="text-sm text-muted-foreground">Type the character inside each bubble</p>
          </div>
          <div className="glass-panel p-4">
            <Target className="w-8 h-8 mx-auto mb-2 text-[hsl(var(--secondary))]" />
            <p className="text-sm text-muted-foreground">Pop bubbles before they disappear</p>
          </div>
          <div className="glass-panel p-4">
            <Zap className="w-8 h-8 mx-auto mb-2 text-[hsl(var(--bubble-yellow))]" />
            <p className="text-sm text-muted-foreground">Earn points and level up</p>
          </div>
          <div className="glass-panel p-4">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-[hsl(var(--accent))]" />
            <p className="text-sm text-muted-foreground">Beat your best score!</p>
          </div>
        </div>

        {/* Best scores */}
        {bestScore > 0 && (
          <div className="glass-panel p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-1">Your Best</p>
            <p className="text-2xl font-bold">
              <span className="text-[hsl(var(--accent))]">{bestScore}</span>
              <span className="text-muted-foreground mx-2">•</span>
              <span className="text-[hsl(var(--bubble-yellow))]">Level {bestLevel}</span>
            </p>
          </div>
        )}

        {/* Start instruction */}
        <p className="text-sm text-muted-foreground">
          Select difficulty below and press{' '}
          <span className="text-[hsl(var(--primary))] font-semibold">Start Game</span>
        </p>
      </div>
    </div>
  );
});

StartScreen.displayName = 'StartScreen';
