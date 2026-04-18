import { useNavigate, useSearchParams } from 'react-router-dom';
import BoardSelector from '@/components/BoardSelector';

export default function BoardSelection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const stake = searchParams.get('stake') || '10';

  const handleBoardSelected = (boardNumbers: number[]) => {
    // Store selected board and stake in sessionStorage and navigate to game
    // boardNumbers will contain a single board number
    sessionStorage.setItem('selectedBoard', String(boardNumbers[0]));
    sessionStorage.setItem('stake', stake);
    navigate('/game');
  };

  return <BoardSelector onBoardsSelected={handleBoardSelected} />;
}
