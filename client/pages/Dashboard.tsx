import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Navigation-f kan itti dabalame

// Telegram Web App API
const tele = (window as any).Telegram?.WebApp;

const WesternDashboard = () => {
  const navigate = useNavigate(); // Gara fuula biraatti si dabarsa
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState(250.75);

  useEffect(() => {
    if (tele) {
      tele.ready();
      tele.expand();
      setUser(tele.initDataUnsafe?.user);
      tele.setHeaderColor('secondary_bg_color');
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f2f5] font-sans">
      {/* Header & Profile */}
      <div className="bg-[#24a1de] pt-8 pb-16 px-6 rounded-b-[40px] shadow-2xl relative">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 text-xl font-black text-white">
              {user?.first_name?.charAt(0) || "B"}
            </div>
            <div>
              <p className="text-xs font-medium opacity-80 uppercase tracking-wider">Welcome back,</p>
              <h1 className="text-xl font-bold truncate max-w-[150px]">
                {user?.first_name || "Guest User"}
              </h1>
            </div>
          </div>
          <button className="p-2 bg-white/10 rounded-xl">
            <span className="text-2xl">🔔</span>
          </button>
        </div>

        {/* Floating Wallet Card */}
        <div className="absolute -bottom-10 left-6 right-6 bg-white rounded-[24px] p-6 shadow-xl border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[2px]">Total Balance</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-gray-900">{balance.toLocaleString()}</span>
                <span className="text-sm font-bold text-blue-600">ETB</span>
              </div>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold active:scale-95 transition-all">
              Add Cash
            </button>
          </div>
        </div>
      </div>

      {/* Main Actions Area */}
      <div className="mt-16 px-6 pb-10">
        <h3 className="text-gray-500 text-[11px] font-bold uppercase tracking-widest mb-4 ml-1">Main Menu</h3>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Button Tapha Jalqabi - Gara Bingo si dabarsa */}
          <button 
            onClick={() => navigate('/bingo')} // Kallaattiin gara /bingo tti si dabarsa
            className="col-span-2 bg-gradient-to-r from-blue-600 to-blue-500 p-5 rounded-[24px] shadow-lg shadow-blue-100 flex items-center justify-between text-white active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl text-2xl">🎮</div>
              <div className="text-left">
                <p className="font-black text-lg">Tapha Jalqabi</p>
                <p className="text-[10px] opacity-80">Join available bingo rooms</p>
              </div>
            </div>
            <span className="text-xl">➜</span>
          </button>

          {/* Buttons biroon ... */}
          {[
            { icon: "📜", label: "History", color: "bg-orange-50 text-orange-600" },
            { icon: "🏆", label: "Winners", color: "bg-green-50 text-green-600" },
            { icon: "🎁", label: "Rewards", color: "bg-purple-50 text-purple-600" },
            { icon: "⚙️", label: "Settings", color: "bg-gray-100 text-gray-600" }
          ].map((item, i) => (
            <button key={i} className="bg-white p-4 rounded-[24px] shadow-sm border border-gray-100 flex flex-col items-center gap-2 active:scale-95 transition-all text-gray-700">
              <div className={`${item.color} w-12 h-12 rounded-2xl flex items-center justify-center text-2xl`}>
                {item.icon}
              </div>
              <span className="font-bold text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WesternDashboard;
