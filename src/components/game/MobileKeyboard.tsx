import { memo, useState, useCallback, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface MobileKeyboardProps {
  isPlaying: boolean;
  isPaused: boolean;
  onKeyPress: (key: string) => void;
  characters: string;
}

export const MobileKeyboard = memo(({ isPlaying, isPaused, onKeyPress, characters }: MobileKeyboardProps) => {
  const [showNumbers, setShowNumbers] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // Check if we need uppercase and numbers
  const hasUppercase = /[A-Z]/.test(characters);
  const hasNumbers = /[0-9]/.test(characters);

  // Generate keyboard rows
  const lowerRows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
  const upperRows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
  const numberRow = '0123456789';

  const currentRows = hasUppercase && showNumbers && hasNumbers 
    ? [numberRow] 
    : hasUppercase 
      ? (showNumbers ? upperRows : lowerRows)
      : lowerRows;

  const handleKeyClick = useCallback((key: string) => {
    if (isPlaying && !isPaused) {
      onKeyPress(key);
    }
  }, [isPlaying, isPaused, onKeyPress]);

  if (!isPlaying) return null;

  return (
    <div className="fixed bottom-24 left-0 right-0 z-30 md:hidden px-2">
      <div className="glass-panel p-2">
        {/* Toggle expand */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center py-1 text-muted-foreground"
        >
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>

        {isExpanded && (
          <>
            {/* Mode toggle */}
            {(hasUppercase || hasNumbers) && (
              <div className="flex justify-center gap-2 mb-2">
                <button
                  onClick={() => setShowNumbers(false)}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                    !showNumbers 
                      ? 'bg-[hsl(var(--primary))] text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  abc
                </button>
                {hasUppercase && (
                  <button
                    onClick={() => setShowNumbers(true)}
                    className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                      showNumbers && !hasNumbers
                        ? 'bg-[hsl(var(--primary))] text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    ABC
                  </button>
                )}
                {hasNumbers && (
                  <button
                    onClick={() => setShowNumbers(true)}
                    className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                      showNumbers && hasNumbers
                        ? 'bg-[hsl(var(--primary))] text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    123
                  </button>
                )}
              </div>
            )}

            {/* Keyboard rows */}
            <div className="space-y-1">
              {currentRows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-1">
                  {row.split('').map((char) => (
                    <button
                      key={char}
                      onClick={() => handleKeyClick(char)}
                      className="w-8 h-10 rounded bg-muted hover:bg-muted/80 active:bg-[hsl(var(--primary))] 
                                 text-foreground font-bold text-sm transition-colors"
                      disabled={isPaused}
                    >
                      {char}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
});

MobileKeyboard.displayName = 'MobileKeyboard';
