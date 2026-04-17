import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BingoGame from '@/components/BingoGame';

export default function Game() {
  const navigate = useNavigate();
  const [selectedBoards, setSelectedBoards] = useState<number[] | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('selectedBoards');
    if (stored) {
      setSelectedBoards(JSON.parse(stored));
    } else {
      // If no boards selected, redirect back to selection
      navigate('/');
    }
  }, [navigate]);

  if (!selectedBoards) {
    return (
      <div className="min-h-screen w-full bg-slate-950 text-white flex items-center justify-center p-4">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <BingoGame boardNumbers={selectedBoards} />
    </div>
  );
}
