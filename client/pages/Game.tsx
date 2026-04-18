import { useEffect, useState } from 'react';
import BingoGame from '@/components/BingoGame';

export default function Game() {
  const [selectedBoard, setSelectedBoard] = useState<number | null>(null);
  const [stake, setStake] = useState<string>('10');
  const [isWatchingOnly, setIsWatchingOnly] = useState(false);

  useEffect(() => {
    const storedBoard = sessionStorage.getItem('selectedBoard');
    const storedStake = sessionStorage.getItem('stake');

    if (storedBoard) {
      setSelectedBoard(parseInt(storedBoard));
      setIsWatchingOnly(false);
    } else {
      // Allow viewing game without a board selection (watching only mode)
      setIsWatchingOnly(true);
    }

    if (storedStake) {
      setStake(storedStake);
    }
  }, []);

  return (
    <div>
      <BingoGame
        boardNumber={selectedBoard || 1}
        stake={stake}
        isWatchingOnly={isWatchingOnly}
      />
    </div>
  );
}
