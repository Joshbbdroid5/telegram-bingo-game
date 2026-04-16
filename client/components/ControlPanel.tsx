import { Volume2 } from 'lucide-react';

interface ControlPanelProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  calledNumbers: Set<number>;
}

const COLUMN_COLORS = [
  { name: 'B', bg: 'bg-cyan-500', label: 'B' },
  { name: 'I', bg: 'bg-purple-500', label: 'I' },
  { name: 'N', bg: 'bg-red-500', label: 'N' },
  { name: 'G', bg: 'bg-green-500', label: 'G' },
  { name: 'O', bg: 'bg-orange-500', label: 'O' },
];

export default function ControlPanel({
  volume,
  onVolumeChange,
  calledNumbers,
}: ControlPanelProps) {
  // Create grid numbers organized by BINGO columns
  // B(1-15), I(16-30), N(31-45), G(46-60), O(61-75)
  const getNumbersForGrid = () => {
    const rows = [];
    for (let row = 0; row < 15; row++) {
      const rowNumbers = [];
      for (let col = 0; col < 5; col++) {
        const num = row + col * 15 + 1;
        rowNumbers.push(num);
      }
      rows.push(rowNumbers);
    }
    return rows;
  };

  const numberRows = getNumbersForGrid();
  const getColorClass = (col: number) => {
    const colors = ['text-cyan-400', 'text-purple-400', 'text-red-400', 'text-green-400', 'text-orange-400'];
    return colors[col];
  };

  return (
    <div className="bg-slate-900 rounded-lg border border-slate-700 p-4">
      {/* Volume Control */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Volume2 size={20} className="text-cyan-400" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="flex-1 h-2 bg-slate-800 rounded cursor-pointer accent-cyan-500"
          />
        </div>
        <div className="w-3 h-3 rounded-full bg-cyan-500 mx-auto"></div>
      </div>

      {/* BINGO Buttons */}
      <div className="flex gap-1 mb-4">
        {COLUMN_COLORS.map((col) => (
          <button
            key={col.name}
            className={`${col.bg} text-white font-bold text-xs py-1 px-2 rounded text-center flex-1`}
          >
            {col.label}
          </button>
        ))}
      </div>

      {/* Number Grid */}
      <div className="space-y-1">
        {numberRows.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-1">
            {row.map((num, colIdx) => (
              <div
                key={num}
                className={`
                  flex-1 aspect-square flex items-center justify-center text-xs font-bold font-mono rounded
                  transition-colors duration-200
                  ${
                    calledNumbers.has(num)
                      ? 'bg-red-600 text-white'
                      : 'bg-green-600 text-white'
                  }
                `}
              >
                {num}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
