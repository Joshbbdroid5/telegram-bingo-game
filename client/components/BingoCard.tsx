interface BingoCardProps {
  cardId: string;
  cardNumber: number;
  grid: number[][];
  markedCells: Set<string>;
  isWinner: boolean;
  onToggleCell?: (row: number, col: number) => void;
}

const COLUMN_COLORS = ['cyan', 'purple', 'red', 'green', 'orange'];
const COLUMN_LABELS = ['B', 'I', 'N', 'G', 'O'];

export default function BingoCard({
  cardNumber,
  grid,
  markedCells,
  isWinner,
}: BingoCardProps) {
  return (
    <div
      className={`
        bg-slate-900 rounded-lg border p-2 sm:p-2.5 mb-2
        ${isWinner ? 'border-green-500' : 'border-slate-700'}
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-bold text-xs font-mono">
          Cartela {cardNumber}
        </h3>
        {isWinner && (
          <span className="bg-cyan-500 text-slate-900 text-xs font-bold px-2 py-0.5 rounded">
            WINNER
          </span>
        )}
      </div>

      {/* BINGO Header */}
      <div className="grid grid-cols-5 gap-0.5 sm:gap-1 mb-1">
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
      <div className="grid grid-cols-5 gap-0.5 sm:gap-1">
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
                  ${isMarked && !isFreeSpace ? 'bg-green-600' : isFreeSpace ? 'bg-slate-700' : 'bg-slate-800'}
                  ${!isFreeSpace ? colorClass : 'text-cyan-400'}
                `}
              >
                {isFreeSpace ? (
                  <span className="text-xs text-cyan-400 font-bold">•</span>
                ) : (
                  <>
                <span className="text-[10px] sm:text-xs leading-none">{num}</span>
                    {isMarked && (
                      <div className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-bold text-white opacity-70">
                        ✕
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
