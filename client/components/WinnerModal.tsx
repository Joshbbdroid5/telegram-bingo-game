interface BingoCardData {
  id: string;
  number: number;
  grid: number[][];
  markedCells: Set<string>;
  isWinner: boolean;
}

interface WinnerModalProps {
  winners: BingoCardData[];
  isOpen: boolean;
}

const COLUMN_COLORS = ['cyan', 'purple', 'red', 'green', 'orange'];
const COLUMN_LABELS = ['B', 'I', 'N', 'G', 'O'];

function WinningBoardDisplay({ grid, markedCells }: { grid: number[][]; markedCells: Set<string> }) {
  return (
    <div className="bg-slate-900 rounded-lg border border-slate-700 p-3">
      {/* BINGO Header */}
      <div className="grid grid-cols-5 gap-0.5 mb-1">
        {COLUMN_LABELS.map((label, i) => (
          <div
            key={label}
            className={`
              text-center text-xs font-bold font-mono
              ${
                {
                  cyan: 'text-cyan-400',
                  purple: 'text-purple-400',
                  red: 'text-red-400',
                  green: 'text-green-400',
                  orange: 'text-orange-400',
                }[COLUMN_COLORS[i]]
              }
            `}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-5 gap-0.5">
        {grid.map((row, rowIdx) =>
          row.map((num, colIdx) => {
            const cellId = `${rowIdx}-${colIdx}`;
            const isMarked = markedCells.has(cellId);
            const isFreeSpace = rowIdx === 2 && colIdx === 2;
            const colorClass = {
              cyan: 'text-cyan-400',
              purple: 'text-purple-400',
              red: 'text-red-400',
              green: 'text-green-400',
              orange: 'text-orange-400',
            }[COLUMN_COLORS[colIdx]];

            return (
              <div
                key={cellId}
                className={`
                  aspect-square flex items-center justify-center rounded text-xs font-bold font-mono relative
                  ${isMarked && !isFreeSpace ? 'bg-green-600' : 'bg-slate-800'}
                  ${isFreeSpace ? 'bg-slate-700' : colorClass}
                `}
              >
                {isFreeSpace ? (
                  <span className="text-xs text-cyan-400 font-bold">•</span>
                ) : (
                  <>
                    <span className="text-xs leading-none">{num}</span>
                    {isMarked && (
                      <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white opacity-70">
                        ✓
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function WinnerModal({ winners, isOpen }: WinnerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-[#2d1b4e] to-[#1a0f2e] border-2 border-green-500 rounded-2xl p-6 max-w-2xl w-full">
        {/* Winner Title */}
        <div className="text-center mb-6">
          <h2 className="text-4xl font-black text-green-400 mb-2">🎉 WINNER! 🎉</h2>
          <p className="text-white/80">Congratulations!</p>
        </div>

        {/* Winners List */}
        <div className="space-y-6">
          {winners.map((card) => (
            <div key={card.id} className="bg-purple-700/40 border border-purple-500/60 rounded-xl p-4">
              {/* Winner Details */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">Player Name</p>
                    <p className="text-xl font-bold text-white">Player #{card.number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Board Number</p>
                    <p className="text-xl font-bold text-green-400">{card.number}</p>
                  </div>
                </div>
              </div>

              {/* Winning Board */}
              <WinningBoardDisplay grid={card.grid} markedCells={card.markedCells} />
            </div>
          ))}
        </div>

        {/* Redirect Message */}
        <div className="mt-6 text-center text-white/70 text-sm">
          Returning to board selection...
        </div>
      </div>
    </div>
  );
}
