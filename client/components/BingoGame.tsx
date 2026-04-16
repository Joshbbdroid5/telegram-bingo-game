import { useState, useCallback } from 'react';
import StatsBar from './StatsBar';
import ControlPanel from './ControlPanel';
import NumberDisplay from './NumberDisplay';
import BingoCard from './BingoCard';
import LastNumbersCalled from './LastNumbersCalled';

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

  return diag1 || diag2;
};

export default function BingoGame() {
  const [cards, setCards] = useState<BingoCardData[]>([
    generateBingoCard(6),
    generateBingoCard(7),
  ]);
  const [calledNumbers, setCalledNumbers] = useState<Set<number>>(new Set());
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [lastThreeNumbers, setLastThreeNumbers] = useState<number[]>([]);
  const [volume, setVolume] = useState(50);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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
    setCards([generateBingoCard(6), generateBingoCard(7)]);
    setCalledNumbers(new Set());
    setCurrentNumber(null);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white p-3 md:p-6">
      {/* Stats Bar */}
      <StatsBar
        cartela={cards.length}
        called={calledNumbers.size}
        wallet={50}
        derrah={2056}
      />

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 max-w-7xl mx-auto">
        {/* Left Panel - Control */}
        <div className="lg:col-span-1">
          <ControlPanel
            volume={volume}
            onVolumeChange={setVolume}
            calledNumbers={calledNumbers}
          />
        </div>

        {/* Right Panel - Cards Display */}
        <div className="lg:col-span-3">
          {/* Number Display */}
          <NumberDisplay number={currentNumber} loading={isLoading} />

          {/* Bingo Cards */}
          <div className="space-y-4 mb-6">
            {cards.map((card) => (
              <BingoCard
                key={card.id}
                cardId={card.id}
                cardNumber={card.number}
                grid={card.grid}
                markedCells={card.markedCells}
                isWinner={card.isWinner}
              />
            ))}
          </div>

          {/* Control Buttons */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={callNumber}
              disabled={isLoading}
              className={`
                flex-1 py-2 rounded-lg font-bold text-xs
                ${
                  isAutoPlay
                    ? 'bg-cyan-500 hover:bg-cyan-600 text-slate-900'
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors
              `}
            >
              ✓ AUTO
            </button>
            <button
              onClick={callNumber}
              disabled={isLoading}
              className={`
                flex-1 py-2 rounded-lg font-bold text-xs
                ${
                  !isAutoPlay
                    ? 'bg-cyan-500 hover:bg-cyan-600 text-slate-900'
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors
              `}
            >
              MANUAL
            </button>
          </div>

          {/* Call Number Button */}
          <button
            onClick={callNumber}
            disabled={isLoading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm mb-2"
          >
            {isLoading ? 'Calling...' : 'Call Number'}
          </button>

          {/* Reset Button */}
          <button
            onClick={resetGame}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded-lg transition-colors text-sm"
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}
