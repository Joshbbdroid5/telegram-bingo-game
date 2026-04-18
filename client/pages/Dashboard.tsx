import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, History, Wallet, User } from 'lucide-react';

// Telegram Web App API
const tele = (window as any).Telegram?.WebApp;

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (tele) {
      tele.ready();
      tele.expand();
      setUser(tele.initDataUnsafe?.user);
      tele.setHeaderColor('secondary_bg_color');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2d1b4e] to-[#1a0f2e] text-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-6 pb-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-300 to-cyan-400 rounded-full flex items-center justify-center font-black text-purple-900">
            B
          </div>
          <h1 className="text-xl font-bold">Western Bingo</h1>
        </div>

        {/* Rules Button */}
        <button className="flex items-center gap-2 text-sm border border-white/30 rounded-full px-4 py-2 hover:bg-white/10 transition-all">
          <span className="w-5 h-5 rounded-full border-2 border-white/50 flex items-center justify-center text-xs">⚙</span>
          <span>Rules</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        {/* Welcome Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-2">
            Welcome to <span className="text-yellow-400">Western</span>
          </h2>
          <h3 className="text-4xl font-bold text-yellow-400">Bingo</h3>
        </div>

        {/* Choose Your Stake Box */}
        <div className="border border-white/30 rounded-3xl p-6 mb-8 bg-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-white/80 mb-6 font-bold">
            <span className="text-yellow-400">▶</span>
            <span>Choose Your Stake</span>
          </div>

          {/* Stake Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/boardselection?stake=10')}
              className="w-full bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
            >
              <span className="text-xl">▶</span>
              <span className="text-lg">Play 10</span>
            </button>
            <button
              onClick={() => navigate('/boardselection?stake=20')}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
            >
              <span className="text-xl">▶</span>
              <span className="text-lg">Play 20</span>
            </button>
          </div>
        </div>

        {/* Stats Box */}
        <div className="border border-white/30 rounded-3xl p-6 bg-white/5 backdrop-blur-sm text-center">
          <p className="text-white/60 text-sm mb-2">Total Prize Pool</p>
          <p className="text-3xl font-black text-yellow-400">45,000+</p>
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
};

export default Dashboard;
