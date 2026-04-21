import { useState, useCallback, useEffect, useRef } from 'react';
import BingoCard from './BingoCard';
import WinnerModal from './WinnerModal';

interface BingoCardData {
  id: string;
  number: number;
  grid: number[][];
  markedCells: Set<string>;
  isWinner: boolean;
}

const generateBingoCard = (cardNumber: number): BingoCardData => {
  const grid: number[][] = [];
  const usedNumbers = new Set<number>();

  for (let col = 0; col < 5; col++) {
    const min = col * 15 + 1;
    const max = min + 14;

    const colNumbers: number[] = [];
    while (colNumbers.length < 5) {
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      if (!usedNumbers.has(num) && !colNumbers.includes(num)) {
        colNumbers.push(num);
        usedNumbers.add(num);
      }
    }

    colNumbers.sort((a, b) => a - b);
    colNumbers.forEach((num, row) => {
      if (!grid[row]) grid[row] = [];
      grid[row][col] = num;
    });
  }

  return {
    id: `card-${cardNumber}-${Math.random()}`,
    number: cardNumber,
    grid,
    markedCells: new Set([`2-2`]), // Free space
    isWinner: false,
  };
};

const checkBingo = (markedCells: Set<string>): boolean => {
  // Check rows
  for (let row = 0; row < 5; row++) {
    if (
      Array.from({ length: 5 }, (_, col) => markedCells.has(`${row}-${col}`)).every(
        (x) => x
      )
    ) {
      return true;
    }
  }

  // Check columns
  for (let col = 0; col < 5; col++) {
    if (
      Array.from({ length: 5 }, (_, row) => markedCells.has(`${row}-${col}`)).every(
        (x) => x
      )
    ) {
      return true;
    }
  }

  // Check diagonals
  const diag1 = Array.from({ length: 5 }, (_, i) =>
    markedCells.has(`${i}-${i}`)
  ).every((x) => x);
  const diag2 = Array.from({ length: 5 }, (_, i) =>
    markedCells.has(`${i}-${4 - i}`)
  ).every((x) => x);

  // Check four corners
  const fourCorners = [
    markedCells.has('0-0'),    // Top-left
    markedCells.has('0-4'),    // Top-right
    markedCells.has('4-0'),    // Bottom-left
    markedCells.has('4-4'),    // Bottom-right
  ].every((x) => x);

  return diag1 || diag2 || fourCorners;
};

interface BingoGameProps {
  boardNumber?: number;
  stake?: string;
  isWatchingOnly?: boolean;
}

const generateGameId = () => {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
};

const getLetterForNumber = (num: number): string => {
  if (num <= 15) return 'B';
  if (num <= 30) return 'I';
  if (num <= 45) return 'N';
  if (num <= 60) return 'G';
  return 'O';
};

export default function BingoGame({ boardNumber = 1, stake = '10', isWatchingOnly = false }: BingoGameProps) {
  const [cards, setCards] = useState<BingoCardData[]>(
    [generateBingoCard(boardNumber)]
  );
  const [calledNumbers, setCalledNumbers] = useState<Set<number>>(new Set());
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [lastThreeNumbers, setLastThreeNumbers] = useState<number[]>([]);
  const [volume, setVolume] = useState(50);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [gameId] = useState(generateGameId());
  const [playersCount] = useState(3);
  const [winners, setWinners] = useState<BingoCardData[]>([]);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(7);
  const [totalSelectedBoards, setTotalSelectedBoards] = useState(0);
  const [autoCallInterval, setAutoCallInterval] = useState<NodeJS.Timeout | null>(null);
  const shouldContinueRef = useRef(true);

  const callNumber = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      let num: number;
      do {
        num = Math.floor(Math.random() * 75) + 1;
      } while (calledNumbers.has(num));

      setCurrentNumber(num);
      setCalledNumbers((prev) => new Set([...prev, num]));

      // Check and mark numbers in cards
      setCards((prevCards) =>
        prevCards.map((card) => {
          const newMarked = new Set(card.markedCells);
          card.grid.forEach((row, rowIdx) => {
            row.forEach((cellNum, colIdx) => {
              if (cellNum === num) {
                newMarked.add(`${rowIdx}-${colIdx}`);
              }
            });
          });

          return {
            ...card,
            markedCells: newMarked,
            isWinner: checkBingo(newMarked),
          };
        })
      );

      setIsLoading(false);
    }, 500);
  }, [calledNumbers]);

  const resetGame = () => {
    setCards([generateBingoCard(boardNumber)]);
    setCalledNumbers(new Set());
    setCurrentNumber(null);
    setTimerStarted(false);
    setTimeRemaining(30);
  };

  // Load total selected boards from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem('totalSelectedBoards');
    if (stored) {
      setTotalSelectedBoards(parseInt(stored, 10));
    }
  }, []);

  // Handle winner detection and modal display
  useEffect(() => {
    const currentWinners = cards.filter(card => card.isWinner);

    if (currentWinners.length > 0 && !showWinnerModal) {
      setWinners(currentWinners);
      setShowWinnerModal(true);
    }
  }, [cards, showWinnerModal]);

  // Countdown timer effect - runs when timer is started
  useEffect(() => {
    if (!timerStarted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Timer finished - you can add logic here for what happens when timer ends
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerStarted]);

  // 7-second redirect timer after winner is shown
  useEffect(() => {
    if (!showWinnerModal) return;

    const timer = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Redirect to board selection page
          window.history.back();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showWinnerModal]);

  // Auto-call numbers effect
  useEffect(() => {
    if (isAutoPlay) {
      shouldContinueRef.current = true;
      // Start calling immediately if no numbers called yet
      if (calledNumbers.size === 0) {
        callNumber();
      }
      const interval = setInterval(() => {
        if (shouldContinueRef.current && calledNumbers.size < 75 && !showWinnerModal) {
          callNumber();
        } else {
          clearInterval(interval);
          setAutoCallInterval(null);
        }
      }, 4000);
      setAutoCallInterval(interval);
      return () => {
        shouldContinueRef.current = false;
        clearInterval(interval);
      };
    } else {
      shouldContinueRef.current = false;
      if (autoCallInterval) {
        clearInterval(autoCallInterval);
        setAutoCallInterval(null);
      }
    }
  }, [isAutoPlay, callNumber]); // Removed calledNumbers.size and showWinnerModal

  // Stop auto-call when winner or all numbers called
  useEffect(() => {
    if ((showWinnerModal || calledNumbers.size >= 75) && autoCallInterval) {
      shouldContinueRef.current = false;
      clearInterval(autoCallInterval);
      setAutoCallInterval(null);
    }
  }, [showWinnerModal, calledNumbers.size, autoCallInterval]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#2d1b4e] to-[#1a0f2e] text-white flex flex-col">
      <WinnerModal winners={winners} isOpen={showWinnerModal} />
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-bold">Western Bingo</h1>
          <div className="flex gap-2">
            <button className="text-white/60 hover:text-white">⋮</button>
            <button className="text-white/60 hover:text-white">✕</button>
          </div>
        </div>

        {/* Stats Header */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mb-2">
          <div className="bg-purple-700/60 border border-purple-500/60 rounded-lg p-2 text-center">
            <p className="text-xs font-semibold text-white/80">Game ID</p>
            <p className="text-xs font-bold text-white">{gameId}</p>
          </div>
          <div className="bg-purple-700/60 border border-purple-500/60 rounded-lg p-2 text-center">
            <p className="text-xs font-semibold text-white/80">Players</p>
            <p className="text-xs font-bold text-white">{playersCount}</p>
          </div>
          <div className="bg-purple-700/60 border border-purple-500/60 rounded-lg p-2 text-center">
            <p className="text-xs font-semibold text-white/80">Selected</p>
            <p className="text-xs font-bold text-green-400">{totalSelectedBoards}</p>
          </div>
          <div className="bg-purple-700/60 border border-purple-500/60 rounded-lg p-2 text-center">
            <p className="text-xs font-semibold text-white/80">Bet</p>
            <p className="text-xs font-bold text-white">I-{stake}</p>
          </div>
          <div className="bg-purple-700/60 border border-purple-500/60 rounded-lg p-2 text-center">
            <p className="text-xs font-semibold text-white/80">Derash</p>
            <p className="text-xs font-bold text-white">42322</p>
          </div>
          <div className="bg-purple-700/60 border border-purple-500/60 rounded-lg p-2 text-center">
            <p className="text-xs font-semibold text-white/80">Called</p>
            <p className="text-xs font-bold text-white">{calledNumbers.size}</p>
          </div>
        </div>

        {/* Player Badges */}
        <div className="flex gap-1 flex-wrap">
          {['B', 'I', 'M', 'G', 'O', 'I-20', 'B-6', 'O-67', 'G-54'].map((badge, idx) => (
            <div
              key={idx}
              className={`px-2 py-1 rounded font-bold text-xs ${
                badge.includes('-')
                  ? 'bg-blue-600'
                  : ['bg-cyan-500', 'bg-purple-600', 'bg-purple-500', 'bg-green-600', 'bg-orange-500', 'bg-indigo-600', 'bg-blue-600', 'bg-orange-700'][idx]
              }`}
            >
              {badge}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="flex flex-col gap-3 w-full px-2">
          {/* Left Panel - Calling Grid */}
          <div className="w-full mb-4">
            <div className="grid grid-cols-5 gap-2 w-full">
              {['B', 'I', 'N', 'G', 'O'].map((letter, colIndex) => {
                const colMin = colIndex * 15 + 1;
                const colMax = colMin + 14;
                const calledInCol = Array.from(calledNumbers).filter(num => num >= colMin && num <= colMax).sort((a, b) => a - b);
                return (
                  <div key={letter} className="flex flex-col gap-1">
                    <div className="text-center font-bold text-sm uppercase text-cyan-400 mb-1 tracking-wider">
                      {letter}
                    </div>
                    <div className="flex flex-col gap-1 max-h-[200px] overflow-y-auto pr-1">
                      {calledInCol.map(num => (
                        <div
                          key={num}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-lg border-2 border-green-700 flex-shrink-0"
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel */}
          <div>
            {/* Current Number Display */}
              <div className="bg-purple-900/40 border-2 border-purple-500/60 rounded-2xl p-3 sm:p-5 mb-4 text-center">
                {currentNumber ? (
                  <>
                    <div className="text-2xl sm:text-3xl md:text-4xl font-black text-yellow-400 mb-2">
                      {getLetterForNumber(currentNumber)}-{currentNumber}
                    </div>
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-300 mx-auto flex items-center justify-center">
                      <span className="text-xl sm:text-2xl md:text-3xl font-black text-purple-900">
                        {getLetterForNumber(currentNumber)}-{currentNumber}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="py-8 sm:py-10">
                    <p className="text-white/60 text-base sm:text-lg">No number called yet</p>
                  </div>
                )}
              </div>

            {/* Automatic Toggle */}
            <div className="flex items-center justify-between bg-purple-700/40 border border-purple-500/60 rounded-lg p-3 sm:p-4 mb-3">
              <span className="font-semibold text-xs sm:text-sm">Automatic</span>
              <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className={`w-10 h-5 sm:w-12 sm:h-6 rounded-full transition-all ${isAutoPlay ? 'bg-green-500' : 'bg-gray-600'}`}
              />
            </div>

            {/* Watching Only Message */}
            {isWatchingOnly && (
              <div className="bg-purple-900/60 border-2 border-purple-500/60 rounded-xl p-3 sm:p-4 mb-3 text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Watching</h3>
                <h4 className="text-xl sm:text-2xl font-bold text-white mb-2">Only</h4>
                <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                  You haven't selected any boards<br />
                  so you can view the game without<br />
                  selecting a board
                </p>
              </div>
            )}

            {/* Bingo Card Display */}
            {!isWatchingOnly && cards.length > 0 && (
              <div className="bg-purple-900/40 border-2 border-purple-500/60 rounded-xl p-2 sm:p-3 mb-3">
                <BingoCard
                  cardId={cards[0].id}
                  cardNumber={cards[0].number}
                  grid={cards[0].grid}
                  markedCells={cards[0].markedCells}
                  isWinner={cards[0].isWinner}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="border-t border-white/10 bg-white/5 backdrop-blur-sm px-4 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 px-2 w-full">
          <button
            onClick={() => window.history.back()}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 sm:py-3 rounded-lg transition-all active:scale-95 text-sm"
            title="Leave game"
          >
            Leave
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-900/60 border border-red-700 hover:bg-red-900 text-white font-bold py-2.5 sm:py-3 rounded-lg transition-all active:scale-95 text-sm flex items-center justify-center gap-2"
            title="Refresh game"
          >
            ⟲ Refresh
          </button>
          <button
            onClick={callNumber}
            disabled={isLoading || isAutoPlay}
            className="bg-yellow-700 hover:bg-yellow-800 text-white font-bold py-2.5 sm:py-3 rounded-lg transition-all active:scale-95 disabled:opacity-50 text-sm"
            title="Call next number"
          >
            {isLoading ? 'Calling...' : isAutoPlay ? 'Auto On' : 'Call Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
