interface LastNumbersCalledProps {
  numbers: number[];
}

const getColumnLetter = (num: number): string => {
  if (num >= 1 && num <= 15) return 'B';
  if (num >= 16 && num <= 30) return 'I';
  if (num >= 31 && num <= 45) return 'N';
  if (num >= 46 && num <= 60) return 'G';
  if (num >= 61 && num <= 75) return 'O';
  return '';
};

export default function LastNumbersCalled({
  numbers,
}: LastNumbersCalledProps) {
  return (
    <div className="flex gap-2 mb-4">
      {numbers.map((num, idx) => (
        <button
          key={idx}
          className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg p-2 text-center transition-colors"
        >
          <div className="text-lg font-bold text-cyan-400 font-mono">
            {String(num).padStart(2, '0')}
          </div>
          <div className="text-xs font-bold text-cyan-400 font-mono">
            {getColumnLetter(num)}
          </div>
        </button>
      ))}
    </div>
  );
}
