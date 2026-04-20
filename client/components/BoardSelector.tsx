import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCw, Gamepad2, History, Wallet, User } from 'lucide-react';

interface BoardSelectorProps {
  onBoardsSelected: (boardNumbers: number[]) => void;
}

export default function BoardSelector({ onBoardsSelected }: BoardSelectorProps) {
  const navigate = useNavigate();
  const [selectedBoard, setSelectedBoard] = useState<number | null>(null);
  const [previousBoard, setPreviousBoard] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [showGoodLuck, setShowGoodLuck] = useState(false);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleBoardSelect = (boardNumber: number) => {
    // Allow selection of one board, can switch to another board anytime during timer
    if (selectedBoard === boardNumber) {
      // Deselecting current board
      setSelectedBoard(null);
      setPreviousBoard(null);
    } else {
      // If already had a board selected, that becomes available for others
      if (selectedBoard !== null && selectedBoard !== boardNumber) {
        // Board was switched, previous becomes available
        setPreviousBoard(selectedBoard);
      }
      // Select new board
      setSelectedBoard(boardNumber);
    }
  };

  // 60-second countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowGoodLuck(true);
          // Navigate to game after timer expires
          setTimeout(() => {
            const boardToSelect = selectedBoard || 1; // Default to board 1 if no selection
            // Count this user's board selection + simulate other users' selections
            // For this simulation: if user selected a board, that's 1 board selected in the system
            // In a real multiplayer scenario, this would come from the backend
            const countToStore = selectedBoard ? 1 : 0; // This user's selection counts as 1
            sessionStorage.setItem('totalSelectedBoards', String(countToStore));
            onBoardsSelected([boardToSelect]);
          }, 1500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onBoardsSelected, selectedBoard]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#2d1b4e] to-[#1a0f2e] text-white flex flex-col">
      {/* Good Luck Modal */}
      {showGoodLuck && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gradient-to-b from-[#2d1b4e] to-[#1a0f2e] border-2 border-green-500 rounded-2xl p-8 text-center max-w-md">
            <h2 className="text-5xl font-black text-green-400 mb-4">Good Luck! 🍀</h2>
            <p className="text-xl text-white mb-4">Starting game...</p>
            <div className="text-sm text-white/60">
              <p>Your board has been selected</p>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="px-4 pt-4 pb-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold">Western Bingo</h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 bg-purple-700/50 hover:bg-purple-700 text-white px-3 py-2 rounded-lg transition-all font-semibold text-sm"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 bg-purple-700/50 hover:bg-purple-700 text-white px-3 py-2 rounded-lg transition-all font-semibold text-sm"
            >
              <RotateCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-purple-600/40 border border-purple-500/60 rounded-lg p-2 text-center">
            <p className="text-xs text-white/70 font-semibold">Main Wallet</p>
            <p className="text-sm font-bold text-white">0</p>
          </div>
          <div className="bg-purple-600/40 border border-purple-500/60 rounded-lg p-2 text-center">
            <p className="text-xs text-white/70 font-semibold">Play Wallet</p>
            <p className="text-sm font-bold text-white">0</p>
          </div>
          <div className={`border rounded-lg p-2 text-center ${timeRemaining <= 10 ? 'bg-red-600/40 border-red-500/60' : 'bg-purple-600/40 border-purple-500/60'}`}>
            <p className="text-xs text-white/70 font-semibold">Timer</p>
            <p className={`text-lg font-bold ${timeRemaining <= 10 ? 'text-red-400' : 'text-yellow-400'}`}>{timeRemaining}s</p>
          </div>
          <div className="bg-purple-600/40 border border-purple-500/60 rounded-lg p-2 text-center">
            <p className="text-xs text-white/70 font-semibold">Selected</p>
            <p className="text-lg font-bold text-yellow-400">{selectedBoard ? selectedBoard : '-'}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {/* Boards Grid */}
        <div className="grid grid-cols-8 gap-1">
          {Array.from({ length: 600 }, (_, i) => i + 1).map((boardNumber) => {
            const isSelected = selectedBoard === boardNumber;

            return (
              <button
                key={boardNumber}
                onClick={() => handleBoardSelect(boardNumber)}
                className={`
                  aspect-square rounded font-bold text-xs font-mono
                  transition-all duration-200 flex items-center justify-center border-2
                  ${
                    isSelected
                      ? 'bg-green-500 border-green-700 text-white scale-105'
                      : 'bg-orange-500 border-blue-600 text-white hover:bg-orange-600'
                  }
                `}
              >
                {boardNumber}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-white/20 bg-white/5 backdrop-blur-sm">
        <div className="flex justify-around items-center px-4 py-4 max-w-2xl mx-auto w-full">
          <button
            onClick={() => navigate('/')}
            className="flex flex-col items-center gap-1 text-cyan-400 active:opacity-70 transition-all"
          >
            <Gamepad2 size={24} />
            <span className="text-xs font-semibold">Game</span>
          </button>
          <button
            className="flex flex-col items-center gap-1 text-white/60 hover:text-white active:opacity-70 transition-all"
          >
            <History size={24} />
            <span className="text-xs font-semibold">History</span>
          </button>
          <button
            className="flex flex-col items-center gap-1 text-white/60 hover:text-white active:opacity-70 transition-all"
          >
            <Wallet size={24} />
            <span className="text-xs font-semibold">Wallet</span>
          </button>
          <button
            className="flex flex-col items-center gap-1 text-white/60 hover:text-white active:opacity-70 transition-all"
          >
            <User size={24} />
            <span className="text-xs font-semibold">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
