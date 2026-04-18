import { useNavigate, useSearchParams } from 'react-router-dom';
import BoardSelector from '@/components/BoardSelector';

export default function BoardSelection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const stake = searchParams.get('stake') || '10';

  const handleBoardsSelected = (boardNumbers: number[]) => {
    // Store selected boards and stake in sessionStorage and navigate to game
    sessionStorage.setItem('selectedBoards', JSON.stringify(boardNumbers));
    sessionStorage.setItem('stake', stake);
    navigate('/game');
  };

  return <BoardSelector onBoardsSelected={handleBoardsSelected} />;
}
