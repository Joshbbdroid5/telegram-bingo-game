interface NumberDisplayProps {
  number: number | null;
  loading: boolean;
  column?: string;
}

const getColumnLetter = (num: number): string => {
  if (num >= 1 && num <= 15) return 'B';
  if (num >= 16 && num <= 30) return 'I';
  if (num >= 31 && num <= 45) return 'N';
  if (num >= 46 && num <= 60) return 'G';
  if (num >= 61 && num <= 75) return 'O';
  return '';
};

export default function NumberDisplay({
  number,
  loading,
  column,
}: NumberDisplayProps) {
  const columnLetter = number ? column || getColumnLetter(number) : '';

  return (
    <div className="bg-slate-900 rounded-lg border border-slate-700 p-4 md:h-40 h-28 flex flex-col items-center justify-center mb-4">
      {loading ? (
        <div className="animate-pulse flex gap-2">
          <div className="w-6 h-6 bg-slate-700 rounded"></div>
          <div className="w-6 h-6 bg-slate-700 rounded"></div>
        </div>
      ) : number ? (
        <div className="text-center">
          <div className="text-5xl md:text-6xl font-bold text-cyan-400 font-mono leading-none">
            {String(number).padStart(2, '0')}
          </div>
          <div className="text-xl md:text-2xl font-bold text-cyan-400 font-mono mt-1">
            {columnLetter}
          </div>
        </div>
      ) : (
        <div className="text-slate-600 text-xs">Waiting for first call...</div>
      )}
    </div>
  );
}
