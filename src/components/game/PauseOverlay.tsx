import { memo } from 'react';
import { Pause } from 'lucide-react';

export const PauseOverlay = memo(() => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-40 bg-background/60 backdrop-blur-sm">
      <div className="glass-panel p-8 text-center">
        <Pause className="w-16 h-16 mx-auto mb-4 text-[hsl(var(--secondary))]" />
        <h2 className="text-3xl font-bold mb-2">PAUSED</h2>
        <p className="text-muted-foreground">Press Resume to continue</p>
      </div>
    </div>
  );
});

PauseOverlay.displayName = 'PauseOverlay';
