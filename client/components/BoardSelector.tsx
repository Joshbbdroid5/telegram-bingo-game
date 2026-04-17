import { useState, useEffect } from 'react';

interface BoardSelectorProps {
  onBoardsSelected: (boardNumbers: number[]) => void;
}

export default function BoardSelector({ onBoardsSelected }: BoardSelectorProps) {
  const [selectedBoards, setSelectedBoards] = useState<Set<number>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [isStarting, setIsStarting] = useState(false);
  const [selectionLocked, setSelectionLocked] = useState(false);

  useEffect(() => {
    // Lock selection and start timer when user selects a board
    if (selectedBoards.size > 0 && !selectionLocked) {
      setSelectionLocked(true);
      setTimeRemaining(30);
    }
  }, [selectedBoards, selectionLocked]);

  useEffect(() => {
    // Only start countdown if selection is locked
    if (!selectionLocked) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          // Auto-start with selected boards
          setIsStarting(true);
          const boardsToUse = Array.from(selectedBoards).sort((a, b) => a - b);

          setTimeout(() => {
            onBoardsSelected(boardsToUse);
          }, 1000);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectionLocked, selectedBoards, onBoardsSelected]);

  const handleBoardToggle = (boardNumber: number) => {
    // Only allow selection changes if selection is not locked
    if (selectionLocked) return;

    const newSelected = new Set(selectedBoards);

    if (newSelected.has(boardNumber)) {
      newSelected.delete(boardNumber);
    } else if (newSelected.size < 2) {
      newSelected.add(boardNumber);
    }

    setSelectedBoards(newSelected);
  };


  if (isStarting) {
    return (
      <div className="min-h-screen w-full bg-slate-950 text-white flex items-center justify-center p-3">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4 text-cyan-400">Starting...</h1>
          <p className="text-xl text-slate-300">Get ready for your game!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white p-3 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Countdown */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Select Your Bingo Boards</h1>
              <p className="text-slate-400">
                {selectionLocked
                  ? `Waiting to start with ${selectedBoards.size} board${selectedBoards.size !== 1 ? 's' : ''}...`
                  : 'Select 1 or 2 boards to begin'}
              </p>
            </div>
            {selectionLocked && (
              <div className="text-center">
                <div className="text-5xl font-bold font-mono mb-2 text-cyan-400">
                  {timeRemaining}
                </div>
                <p className="text-xs text-slate-400">seconds to start</p>
              </div>
            )}
          </div>
          <div className="mt-4">
            <div className="text-sm">
              <span className="font-mono text-cyan-400">
                Selected: {selectedBoards.size} / 2
              </span>
            </div>
          </div>
        </div>

        {/* Boards Grid */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          {Array.from({ length: 500 }, (_, i) => i + 1).map((boardNumber) => {
            const isSelected = selectedBoards.has(boardNumber);
            const canSelect = !selectionLocked && selectedBoards.size < 2;

            return (
              <button
                key={boardNumber}
                onClick={() => handleBoardToggle(boardNumber)}
                className={`
                  aspect-square rounded font-bold text-sm font-mono
                  transition-all duration-200 flex items-center justify-center border
                  ${
                    isSelected
                      ? 'bg-green-500 border-green-600 text-green-900'
                      : 'bg-red-500 border-red-600 text-blue-400'
                  }
                  ${!canSelect && !isSelected ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                  ${selectionLocked && !isSelected ? 'hover:bg-red-500' : !isSelected ? 'hover:bg-red-600' : ''}
                `}
                disabled={!canSelect && !isSelected}
              >
                {boardNumber}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
