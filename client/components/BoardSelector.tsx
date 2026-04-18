import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCw, Gamepad2, History, Wallet, User } from 'lucide-react';

interface BoardSelectorProps {
  onBoardsSelected: (boardNumbers: number[]) => void;
}

export default function BoardSelector({ onBoardsSelected }: BoardSelectorProps) {
  const navigate = useNavigate();
  const [selectedBoard, setSelectedBoard] = useState<number | null>(null);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleBoardSelect = (boardNumber: number) => {
    // Allow selection of one board, deselect if clicking the same board
    if (selectedBoard === boardNumber) {
      setSelectedBoard(null);
    } else {
      setSelectedBoard(boardNumber);
      // Auto-navigate to game when a board is selected
      setTimeout(() => {
        onBoardsSelected([boardNumber]);
      }, 300);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#2d1b4e] to-[#1a0f2e] text-white flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold">Beteseb Bingo</h1>
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
          <div className="bg-purple-600/40 border border-purple-500/60 rounded-lg p-2 text-center">
            <p className="text-xs text-white/70 font-semibold">Stake</p>
            <p className="text-sm font-bold text-white">10 ETB</p>
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
