interface StatsBarProps {
  cartela: number;
  called: number;
  wallet: number;
  derrah: number;
  timer?: number;
}

export default function StatsBar({
  cartela,
  called,
  wallet,
  derrah,
  timer,
}: StatsBarProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-6">
      <div className="bg-slate-900 border border-cyan-500 rounded-lg p-2 md:p-3">
        <p className="text-xs uppercase tracking-widest text-cyan-400 font-mono">
          Cartela
        </p>
        <p className="text-xl md:text-2xl font-bold text-cyan-400 font-mono">{cartela}</p>
      </div>
      <div className="bg-slate-900 border border-cyan-500 rounded-lg p-2 md:p-3">
        <p className="text-xs uppercase tracking-widest text-cyan-400 font-mono">
          Called
        </p>
        <p className="text-xl md:text-2xl font-bold text-cyan-400 font-mono">{called}</p>
      </div>
      <div className="bg-slate-900 border border-cyan-500 rounded-lg p-2 md:p-3">
        <p className="text-xs uppercase tracking-widest text-cyan-400 font-mono">
          Wallet
        </p>
        <p className="text-xl md:text-2xl font-bold text-cyan-400 font-mono">{wallet}</p>
      </div>
      <div className={`rounded-lg p-2 md:p-3 ${timer ? 'bg-yellow-900 border border-yellow-500' : 'bg-slate-900 border border-cyan-500'}`}>
        <p className="text-xs uppercase tracking-widest font-mono" style={{color: timer ? '#fbbf24' : '#22d3ee'}}>
          {timer ? 'Winner Timer' : 'Stake'}
        </p>
        <p className={`text-xl md:text-2xl font-bold font-mono ${timer ? 'text-yellow-400' : 'text-cyan-400'}`}>
          {timer !== undefined ? `${timer}s` : `${derrah} ETB`}
        </p>
      </div>
    </div>
  );
}
